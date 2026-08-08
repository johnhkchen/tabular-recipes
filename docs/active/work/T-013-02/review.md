# T-013-02 — Review

Four new files, nothing modified, `npm run verify` green.

---

## 1. What changed

| File | Lines | State | Commit |
| --- | ---: | --- | --- |
| `src/lib/stations.ts` | 248 | new | `11956c8` |
| `src/lib/stations.test.ts` | 167 | new | `11956c8` |
| `src/lib/meal.ts` | 662 | new | `d3b78ba` |
| `src/lib/meal.test.ts` | 440 | new | `d3b78ba` |
| `docs/active/work/T-013-02/**` | — | new | Lisa publishes |

**Nothing was modified or deleted.** Not `src/lib/schedule.ts`, not `src/lib/scaling.ts`, no `.cook`
file, no page, no `src/data/**`. `git status` shows no ticket-owned file staged, modified or
untracked at hand-off.

### The shape, in one paragraph

`diagnose(meal)` takes a set of recipes with target servings, a cook count, a burner count and an
optional shelf count, and returns `Finding[]` plus a `DishLoad` per dish. **It returns no schedule
and no itinerary, and it never moves a task.** Each dish's own `buildSchedule()` output is shifted so
its last operation lands at zero — the serving hour — and the findings are the windows where what the
meal asks for exceeds what exists: two dishes in one oven at temperatures no cook could split, more
pans than burners, more hands-on work than the cooks can get through before the hour.

The hands-on finding is a **bound, not a simulation**. Work that cannot begin before *t* and must be
done by the hour needs at least that many cook-minutes, and *k* cooks do not have them. No ordering
fixes it, which is exactly why the model can say something useful without proposing one.

---

## 2. Test coverage

**43 tests. All five the acceptance criteria name are there**, in `src/lib/meal.test.ts`:

| Criterion | Test | Pinned |
| --- | --- | --- |
| two recipes wanting the oven at once | *names both, over the stretch they overlap* | window `[-30, 0]`, both slugs, `wanted 2` |
| two at incompatible temperatures | *is a clash, and carries both temperatures* | `celsius [180, 230]`, and not also reported as shared |
| a hands-on pile-up in the final hour | *states the window, what it asks for and what there is* | `[-20, 0]`, wanted 60, have 20, overrun 40 |
| the same meal with two cooks | *clears the pile-up that one cook could not do* | and the oven findings are byte-identical |
| one recipe entirely assumed | *drags every finding built on its minutes down to "nobody said"* | and does **not** drag down an oven finding it is not in |

**Plus the invariants that would catch a silent drift:**

- *reproduces `handsOnMinutes` on every recipe in the collection* — all 685 files. This is the one
  that matters most: `meal.ts` re-reads timers to place hands-on work, and if that reading ever
  parts company with `schedule.ts`'s, the meal answer and the recipe page start disagreeing. Same
  guard `scaling.test.ts` puts on `splitAttention()`, for the same reason.
- *reproduces the cost function's standing figure once it is scaled* — every file with a readable
  `>> servings:`, at twelve servings.
- *leaves every dish exactly where its own recipe put it* — over four real recipes, `startsAt` is
  exactly `−schedule.totalMinutes`. This is the no-scheduling promise, asserted rather than claimed.
- *returns only enum members and slugs* — walks every string in a seven-dish diagnosis and fails on
  anything that is not a `FindingKind`, a `Confidence` or a slug in the collection. **This is how the
  no-notation rule is held here rather than merely stated in a comment.**
- determinism, empty meal, `ovenShelves: null` never crowding, a made-ahead dish contributing
  nothing, and a real vessel-bound dish (`air-fryer-sweet-potatoes` at twelve servings → 3 loads).

`src/lib/stations.test.ts` covers the reading that guesses: °F/°C conversion, the three shapes of
frying false positive (`crab-rangoon`, `samosa`, `buttermilk-pancakes`), the air-fryer basket that
says *"roast"*, the Dutch oven, a burner in a file that names only a ricer, and four
whole-collection invariants.

### Gaps in the coverage, named

- **No test pins the braise rule against a false positive it has not met yet.** The rule — an
  oven-band temperature in a step naming neither a frying word nor a pan — was checked by dumping all
  28 steps it admits and reading them (see `progress.md` deviation 1); 23 are braises and broiler
  steps and are right. That reading is not a test. A future recipe that says *"hold the custard at
  180 °F"* would be admitted to the oven and nothing would fail.
- **`make-ahead-available` is tested on a fixture, not on a real meal**, because no dish on the
  worked plate declares `keeps`. See §4.
- **The hob is tested for arithmetic, not for attribution.** That five simmering pans exceed four
  burners is pinned; that a given real recipe's step is or is not a burner is only pinned for
  `mashed-potatoes` and the appliance-only files.

---

## 3. Where the model is knowingly wrong, and in which direction

Every one of these is in `progress.md` §1 with what it would take to fix. Repeated here because a
reviewer should not have to go looking:

- **Everything is anchored to land at the serving hour.** A cranberry sauce served cold does not have
  to, and anchoring it there invents contention. Errs towards a busier afternoon.
- **The hob over-reports.** 149 of 870 hob-verb steps are in files naming no hob cookware and are
  counted anyway. Deliberate, and it is `schedule.ts`'s own stated convention — warn a tired cook
  rather than reassure one.
- **A step is the finest granularity a station can be read at.** A step that sears and then rests is
  charged to the hob for its whole length.
- **Where a vessel binds, the windows are a floor.** `vessel-binds` says so; the model does not
  redraw them.
- **Scaled hands-on growth is spread evenly across spans.** Exact for the 639 files with no capacity;
  an even spread of an uneven truth for the 46 with one, with the total right either way.

---

## 4. The open concern worth a human's attention

**The worked meal produced no `hands-on pile-up`, and that is a finding about the collection rather
than a bug.**

Seven real dishes, one cook, ten people, and the model reports **13.75 hands-on minutes for the whole
afternoon** — ten from `cornbread-dressing`'s *"sweat 10 min"* and 3.75 from `turkey-pan-gravy`'s
roux. Five of the seven report zero. Sixteen operations across the seven are untimed. Peeling and
ricing ten people's worth of potatoes, carving, and plating seven things at once is an hour of
somebody's hands and not one minute of it is written down.

`occasions.md` §3.6 reached the same wall from the ranking side. This ticket now has it from the
scheduling side, on a named meal, with numbers. **The machinery is right and the shelf cannot feed
it**, which is precisely the failure S-013 says must be reported before a shelf opens — and it is
T-013-03's to weigh.

The same silence has a second face: **not one of the seven dishes declares `keeps`**, so
`make-ahead-available` cannot fire on this plate at all, and moving `sweet-potato-pie` off the day
correctly raises `made-ahead-unclaimed` instead. The model is behaving as designed; the files are
quiet.

**No action is proposed here.** Annotating those files is a `.cook` change and belongs to whoever
owns them, and this ticket may not touch one.

---

## 5. Acceptance criteria, one by one

| Criterion | Where |
| --- | --- |
| A meal model under `src/lib/` taking recipes, servings and a cook count, returning collisions and load findings; **no schedule, no itinerary** | `src/lib/meal.ts` `diagnose()`. No task is moved; pinned by *leaves every dish exactly where its own recipe put it* |
| Every constraint listed with what it assumes and how wrong it can be; **oven space, burner count, fridge space each explicitly in or out with the reason** | `progress.md` §1 — a nine-row table. Oven space **out**, reported not judged. Burners **in**, weakly, with the 149/870 error rate. Fridge **out**, with the two fields it would take |
| Calls `buildSchedule` and `src/lib/scaling.ts` rather than reimplementing. **Show the calls** | `progress.md` §2 — file and line for all four. Held by two whole-collection tests |
| **No display string and no notation** | `progress.md` §6 and the *returns only enum members and slugs* test |
| Confidence carried through; a diagnosis built on assumed minutes marked at least as strongly as the weakest recipe | `meal.ts` `weakest()` / `confidenceOf`. Per finding, over what that finding rests on — argued in `design.md` §7 and pinned by both halves of the *entirely assumed* suite |
| The worked meal run end to end, its diagnosis pasted in, naming recipes by slug | `progress.md` §3 |
| **One change made, and the finding it clears shown. Before and after** | `progress.md` §3 — `sweet-potato-pie` made ahead; two findings clear outright, the worst window drops from five dishes to four, and `made-ahead-unclaimed` is raised |
| Tests: two wanting the oven; two at incompatible temperatures; a hands-on pile-up; the same meal with two cooks; one recipe entirely assumed | §2 above, all five |
| What the model **cannot** see, in a gap page's shape, with the turkey in it | `progress.md` §5 — eleven entries, the turkey first |
| `npm run verify` passes | Exit 0. 1216 tests over 20 files, 710 pages built. `progress.md` §7 records the concurrent-thread noise seen mid-Implement and its resolution |
| Only new files under `src/lib/`, their tests, and `docs/active/work/T-013-02/**` | Four new files, nothing modified. Not `schedule.ts`, not `scaling.ts`, no `.cook`, no page |

---

## 6. Handing it over

The model reasons and does not render, which means **nothing on the site uses it yet** and that is
correct: rendering is a later ticket's, and S-011's rule about notation on a page holds without
exception. A reader wanting to see what it does should read `progress.md` §3 — five dishes, one oven,
four temperatures, in the last forty-five minutes, every number the author's own.

Two things a later ticket will want and should not invent for itself:

- **A window is a pair of signed minutes relative to the serving hour**, negative before. Turning
  that into *between 4:30 and 5:30* is rendering.
- **`wanted` / `have` / `overrunMinutes` mean different things per finding kind**, and the table that
  says which is in `meal.ts`'s `Finding` comment. A page that guesses will be wrong on two of the
  eight kinds.
