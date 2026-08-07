# T-010-01 — Review

The numbers a tired cook needs now reach the front page, and one that did not exist is derived.
`npm run verify` passes: **935 tests in 12 files, 688 pages built.** The rendered clock on all 664
recipe pages is byte-identical to before the change.

---

## What changed

| File | Lines | What |
| --- | ---: | --- |
| `src/lib/schedule.ts` | +117 | `BREAK_MINUTES`, `HandsOnSpan`, `longestUnbroken()`, `handsOnEvidence()`, and one new `Schedule` field |
| `src/lib/schedule.test.ts` | +240 | 7 new describe blocks, 2 new whole-collection properties, one fixture repair |
| `src/pages/search.json.ts` | +49/−10 | five fields per record, `find` deduplicated, comment extended |
| `src/pages/_search.json.test.ts` | new, 168 | the endpoint had no test |

Four commits: `4411167`, `cc1c210`, `9ae51ff`, `ad1041e`. Nothing else in the repository is
touched — no `.cook` file, no page markup, no `src/data/**`, no script.

### The new number

`Schedule.longestHandsOnMinutes` — the longest run of hands-on work with no break in it.

Three decisions carry it, each argued in `design.md` and each pinned by a test:

1. **The unit is the timer, never the task** (D2). `attentionOfTask()` calls a whole step hands-on
   when any timer in it is — right for a label, catastrophic here. `baguette` has one such step of
   128 minutes of which 8 are your hands and 120 are a prove. Measured at task granularity the
   collection's longest stretch is two hours at a bowl of dough that is doing nothing.
2. **Across all branches, serialised onto one cook** (D3). The schedule assumes as many hands as
   the tree has branches; a person with two hands-on jobs at once does both, one after the other.
   Measuring along `criticalPath` instead disagrees on 80 of 664 recipes and always downward — six
   of them to **zero**, including `potato-knish`, which stands you at the hob for 20 unbroken
   minutes on a branch the critical path never touches.
3. **A break is idle time of at least five minutes** (D4), as the constant `BREAK_MINUTES`. Five is
   the smallest gap you could leave the kitchen for, and — the stronger reason — it is doing no
   secret work: the smallest gap anywhere in the collection is 3 minutes, and thresholds of 4 and 5
   give identical answers on all 664 recipes. The value that would decide things is 0, which
   changes 141.

### The five index fields

```jsonc
{ "slug": …, "title": …, "counters": […], "find": …,
  "elapsedMinutes": 512, "handsOnMinutes": 42, "longestHandsOnMinutes": 22,
  "washingUpCount": null, "evidence": "unknown" }
```

`evidence` is `stated | inferred | unknown` — the `Confidence` type already in `schedule.ts`,
derived by `handsOnEvidence()` and shipped as its answer rather than as the two raw numbers behind
it (D6). A browser asked to threshold `assumedHandsOnMinutes` itself would have the wrong behaviour
as its **quiet default**: forget it and 327 recipes pass "under fifteen minutes standing" on no
evidence at all. Shipping the verdict means hiding an unannotated recipe takes writing a line that
says so.

`washingUpCount` is the count or `null`, never a missing key —`washing-up.ts` is emphatic that
absent and zero are different answers, and `memphis-dry-rub` is the real zero.

---

## Evidence against each acceptance criterion

| Criterion | Evidence |
| --- | --- |
| `Schedule` gains the figure, threshold a named constant, parallel decision argued | `schedule.ts` `BREAK_MINUTES` + `longestHandsOnMinutes`; `design.md` D2–D4 |
| index carries elapsed, hands-on, longest, washing-up, and the three states | `dist/search.json`, nine keys, asserted in `_search.json.test.ts` |
| byte size before and after, build cost, what was cut | below, and `progress.md` §3 |
| ≥5 worked pairs, named by slug | below |
| count of recipes in each confidence state | below |
| nothing the clock computes changes, shown by diffing all pages | 664 clocks re-extracted, **0 lines of diff** |
| tests: one long task, short jobs around waits, a wait too short, parallel branches | 4 named describe blocks in `schedule.test.ts` |
| `npm run verify` passes | 935 tests, 688 pages |
| only the four owned files changed | `git status --porcelain src/` empty; commits list above |

### Bytes and time

| | raw | gzip | brotli |
| --- | ---: | ---: | ---: |
| `dist/search.json` before | 253,812 | 58,946 | 47,603 |
| after | 275,542 (**+8.6%**) | 56,131 (**−4.8%**) | 44,752 (**−6.0%**) |

**On the wire it is smaller than it was.** On disk it grew 33 bytes per recipe.

**What was cut:** `find` was 26.6% repeated tokens (190,400 chars → 139,825), because it
concatenates six overlapping fields. Without that cut the file would be ~326,100 raw, **+28.5%**.
The dedupe is safe for a checkable reason, not an asserted one: the front page splits a query on
whitespace and asks `find.includes(word)` per word, so no query word can contain a space and no
result can depend on order or repetition. The test proves it against **3,088 distinct tokens × 664
recipes, 0 answers changed**.

**Build cost:** `buildSchedule` over all 664 recipes is **12.2 ms** cold. The endpoint's own work
went from 0.8 ms to 6.3 ms; `/search.json` reports +16 ms in the build log; the whole build went
619 ms → 629 ms for the same 688 pages. Under 1%.

### The three states, counted

| | count | share |
| --- | ---: | ---: |
| `stated` — the recipe says | 46 | 6.9% |
| `inferred` — we read it off the step | 223 | 33.6% |
| `unknown` — nobody said | 395 | 59.5% |

The rule (D7) is weakest-wins, with the one distinction a single task never had to make: an
**untimed** operation adds no minutes, so it leaves the figure a floor and demotes to `inferred`; an
**assumed** minute is a number nobody claimed sitting inside the figure as though somebody had, and
drops the recipe to `unknown`. Taking untimed steps the same way puts **615 of 664** in one bucket
and leaves the dial sorting nothing.

### Worked cases — the ones T-010-02 designs against and T-010-03 audits

**Two evenings that `handsOnMinutes` cannot tell apart.**

| slug | elapsed | hands-on | **longest** | wash | evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| `patty-melt` | 41 | 45 | **45** | — | inferred |
| `chile-verde-slow-cooker` | 512 | 42 | **22** | — | unknown |

Three minutes apart on the dial the site has today, and not the same Tuesday. The patty melt runs
35 minutes of onions beside 4 of patties and then 6 more on the sandwich — one cook, one griddle,
45 unbroken minutes. The chile verde chars for 12 and browns for 10, then goes away for eight
hours, then comes back for 20.

**A second pair, which also separates on evidence.**

| slug | elapsed | hands-on | **longest** | wash | evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| `tortilla-espanola` | 42 | 32 | **20** | — | **stated** |
| `cheese-grits` | 35 | 35 | **35** | — | **unknown** |

Both look like half an hour of standing there. The tortilla names all four of its timers and gives
you a ten-minute sit-down while the egg stands. Cheese grits is one line — "cook covered 35 min" —
that nobody called hands-on, and all 35 minutes of its figure are ours.

**Three where the figure is mostly assumed.**

| slug | hands-on | of which assumed | **longest** | evidence |
| --- | ---: | ---: | ---: | --- |
| `beef-rendang` | 60 | **60 (100%)** | 60 | unknown |
| `doro-wat` | 40 | **40 (100%)** | 40 | unknown |
| `french-onion-soup` | 53 | **50 (94%)** | 50 | unknown |

`french-onion-soup` is the recipe `Timeline.astro:227` already names as the reason the panel hedges:
its 50-minute caramelise is in the hands-on figure on our say-so alone. All three would read as an
hour at the pan to a filter that trusted the number.

**And the trap the story names, which is worse than any of them.**

| slug | elapsed | hands-on | longest | evidence |
| --- | ---: | ---: | ---: | --- |
| `blondies` | 25 | **0** | 0 | unknown |

Four of five steps carry no timer and the only one that does is a bake. A filter for *under fifteen
minutes standing* would put it first, on no evidence whatever. `evidence: "unknown"` is the whole
reason the index carries a fifth field.

**One more, for the parallel-branch decision.**

| slug | elapsed | hands-on | **longest** | evidence |
| --- | ---: | ---: | ---: | --- |
| `mujaddara` | 57 | 52 | **52** | inferred |

Three branches at once, two of them frying. 52 of its 57 minutes are unbroken standing. Measured
along the critical path it reports 27, and looks like half the evening it is.

---

## Test coverage

`schedule.test.ts` went from 45 to 69 tests; `_search.json.test.ts` is 12 new ones.

**Hand-built fixtures**, so the expected number can be read off a shape we chose:

- one long hands-on task → 30 = `handsOnMinutes`
- the same half hour split by two 40-minute rises → 30 hands-on, **10** longest
- a 3-minute wait → 20 (not a break); `BREAK_MINUTES − 1` → 20; `BREAK_MINUTES` and `+1` → 10.
  The constant is pinned **from both sides** and the assertions read it rather than repeating 5
- parallel branches → 52, with an explicit assertion that the critical-path reading is 27 and lower
- one step that kneads then rises → 8, not 128: the test that the unit is the timer
- `handsOnEvidence` over six fixtures: all named → `stated`; all read off the step → `inferred`;
  one untimed step → `inferred` (a floor); one assumed minute → `unknown`; nothing timed →
  `unknown`; the blondies shape → `unknown`

**Properties over all 664 recipes:**

- `longestHandsOnMinutes <= handsOnMinutes`, never negative, and zero exactly when
  `handsOnMinutes` is — the invariant that says the unit is still the timer
- `handsOnEvidence` returns one of three words; **every state is non-empty and none holds more than
  90% of the collection**, so a rule that collapses the shelf fails loudly rather than quietly
- the index's four numbers and its verdict equal `buildSchedule`'s on the same recipe, so the
  endpoint cannot drift from the module
- every record has exactly the nine keys
- `washingUpCount` matches `recipe.washingUp?.count ?? null` on all 664, with `memphis-dry-rub`
  (0), `general-tsos-chicken` (5) and `blondies` (null) named
- `find` has no repeated token, and answers every one of the 3,088 tokens exactly as the
  undeduplicated string did

**Named-slug regressions** for the recipes above. `schedule.test.ts:455-464` records a test that was
wrong within one ticket of being written because it named the three longest recipes; these name
figures derived from one recipe's own timers, which do not move when the collection grows.

### Gaps

- **No test asserts the rendered clock is unchanged.** That is a build-output diff, run by hand for
  this ticket and reported above, not a check anything reruns. Making it one would mean a new
  script, which is not this ticket's to add.
- **`longestUnbroken` is not exported**, so it is only reached through `buildSchedule`. Deliberate —
  the module's other internals are the same — but it means the walk is tested through fixtures
  rather than directly.
- **`_search.json.test.ts` calls `GET()` in module scope** with a top-level `await`. It works and is
  fast, but a failure there reports as a collection error rather than as a failing test.

---

## Open concerns for whoever picks this up

1. **`index.astro`'s `Item` type does not know about the new fields.** It declares
   `{ slug, title, counters, find }` and reads only those, so nothing breaks today — extra JSON
   keys are ignored. **T-010-02 has to widen that type**, and it owns that file; this ticket
   deliberately did not touch it.
2. **17 recipes have `longestHandsOnMinutes > elapsedMinutes`** — `blt`, `chahan`,
   `club-sandwich`, `crispy-rice-bowl` and 13 more. Not a bug: parallel branches are more work than
   there is clock, exactly as `handsOnMinutes > totalMinutes` already can be, and
   `Timeline.astro:250-252` handles that today with "N steps run at once". A dial that assumes
   longest ≤ elapsed will draw something wrong.
3. **Only 11 recipes carry a washing-up count.** T-008-03 annotates the pool and has not run, so
   the "things to wash" dial has almost nothing to sort by yet. `washingUpCount: null` on 653
   recipes is the honest state, not a defect, but a dial that filters on it hides 98% of the shelf.
4. **`evidence: "unknown"` is 59.5% of the collection.** That is the true state of the annotation
   and the reason the filter needs three answers rather than two — but T-010-02 should expect the
   "cannot say" bucket to be the biggest one, not an edge case.
5. **`BREAK_MINUTES` will start to matter as the collection grows.** Today 4 and 5 agree on every
   recipe because only one gap anywhere is under 4 minutes. A pass of finer annotation could put
   real 2- and 3-minute gaps in, and then the constant is deciding something. The test pins it from
   both sides, so a change has to be deliberate.
6. **`lisa commit-ticket` cannot take a rename as one commit** — see `progress.md`. Two commits, new
   path then old, works.

Nothing here blocks completion.
