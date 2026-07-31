# T-001-18 — Progress

Eight commits, all through `lisa commit-ticket` with exact `--include` paths. Plan followed
without deviation except where noted in §Deviations.

| # | Commit | Message | Files |
| --- | --- | --- | --: |
| 1 | `21275b6` | Stop two jars claiming the time they keep for | 2 |
| 2 | `2eb48da` | Say what the longest tables have in common, not their names | 1 |
| 3 | `80a9262` | Draw the verbs the cooks actually wrote, and stop reading prose as verbs | 2 |
| 4 | `295d429` | Open every ramen cell with what you do, not what goes in | 6 |
| 5 | `6b3b4c9` | Spell every tag concept one way | 51 |
| 6 | `a41f570` | Apply the hand-offs the counter tickets recorded | 15 |
| 7 | `e181cb8` | Rewrite the fifteen counter notes against the shelf as it is | 16 |
| 8 | `d0c44fd` | Rewrite the tally so it says what is actually on the shelf | 1 |

---

## Step 0 — scratch file cleared ✅

`src/lib/__probe.test.ts` was written during Research to read the schedule totals and the two
icon corpora off `layout()`. Deleted before the first commit; it appears in no `--include` and
`git status` never showed it again.

## Step 1 — the two schedule data defects ✅ `21275b6`

- `ginger-garlic-paste.cook` — `~chill{3%weeks}` removed from step 3, keeping time moved into
  that step's prose ("It keeps three weeks under the oil, and it is ready the moment it is
  blended — the wait is how long the jar lasts, not how long the paste takes"), `>> step.3`
  relabelled `pack down, film with oil, into the fridge`. Critical path 30240 → 0 min.
- `lime-pickle.cook` — `>> time: 15 days` → `14 days`. Drift 0.07 → 0.00.

Measured outcome, as the plan predicted: **3 failures → 2**. The author-agreement assertion
went green; the three-slug assertion still failed, now naming `sour-dill-pickles`,
`sauerkraut`, `lime-pickle`.

## Step 2 — the ferment assertion becomes a property ✅ `2eb48da`

`schedule.test.ts`, first `it` only. The plan's draft asserted *one* task carries more than
half the path. **That was wrong and the test said so**: `lime-pickle` is two seven-day waits
back to back, so its longest single task is exactly 0.50 of the path. Replaced with the
property that was actually meant —

- over a week long;
- the **unattended tasks on the critical path** account for >99% of it;
- the path is six tasks or fewer (the length is in the waits, not the work);
- every task on it over an hour has `confidence === 'stated'`, i.e. the author named the timer.

Teeth check, as planned: widening to `slice(0, 12)` fails at #4 (`pastrami`, 5.4 days) on the
week-long bound. Reverted to 3.

## Step 3 — icons ✅ `80a9262`

Two files, one commit, measured in two halves exactly as the plan asked:

| After | Fall-through verbs |
| --- | --: |
| baseline | 54 |
| `icons.test.ts` corpus narrowed to `layout()` cells of `kind === 'op'` | 26 |
| 19 verbs added to `VERB_ICONS` | 7 |

The 19: `crack` (flame), `blitz`/`bruise` (blend), `clarify`/`wring` (strain),
`dress`/`perfume`/`ribbon`/`slide` (pour), `return`/`slacken`/`velvet` (stir),
`mould`/`thread`/`tie` (hand), `sheet` (roll), `build`/`lay` (layer), `throw` (bowl).

Each was checked against `matchOperation`'s read-past-the-first-word behaviour before being
added. Four cells change icon deliberately, each to the verb the cook opened with:
`mould, fill and seal` layer→hand, `sheet to 1.5 mm, rest 30 min` rest→roll,
`tie in cloth, drain 24 hr` strain→hand, `velvet, rest 30 min` rest→stir. `clarify`, `return`
and `throw` resolve to the icon they already had.

The remaining 7 were exactly the noun-and-adjective openings Structure predicted:
`aromatics`, `broth`, `corn`, `hard`, `noodles`, `sprouts`, `tare`.

## Step 4 — the eleven mangled labels ✅ `295d429`

Fourteen `>> step.N:` lines across six files. No paragraph text moved, so no step index
shifted. `icons.test.ts` went **7 → 0** fall-throughs and is fully green.

The staircases were read with `--labels` before committing. Two examples:

```
recipes/soups/tonkotsu-broth.cook          recipes/noodles/miso-ramen.cook
  parboil 30 min, then scrub every bone      fry the pork hard 3 min
    boil hard 8 hr, topping the water up       toss the sprouts and aromatics in, 1 min
      stir the aromatics in, last hour           spoon the tare in, let it catch 30 sec
        strain, pressing the marrow through        pour the broth in, boil 1 min
                                                     boil 3 min, drain, into the broth
                                                       top with corn and butter
```

Attention readings are unchanged: every timer in these six files is named, and a named timer
wins over the label.

## Step 5 — one tag vocabulary ✅ `6b3b4c9`

24 spellings folded across **51 files**, one `>> tags:` line each. Applied by script from the
parsed collection so no file was found by eye, with an assertion per file that the fold
introduces no duplicate tag.

Verified: **527 distinct tags → 503**, and the normalising collision check returns `[]`. The
three the normaliser cannot see (`cookies`/`cookie`, `appetizer`/`appetiser`, and the six
method verb/participle pairs) were checked by grepping the tag dump: `appetiser`, `cookie`,
`glaze`, `grill`, `pan-fry`, `simmer`, `stew` each survive alone. `appetizing` is untouched —
it is the Deli's counter, not a spelling of `appetiser`.

## Step 6 — hand-offs and their menu sections ✅ `a41f570`

Recipe files and `counters.json` in one commit, so no counter ever rendered an `Also` heading
in between.

**Counters added:** `country-fried-steak`, `cream-gravy`, `meatloaf`, `tuna-salad` → `Diner`
(T-001-15 §1–4); `rice-pudding` → `Taquería` (T-001-10 §1). Diner 73 → 77, Taquería 33 → 34,
assignments 618 → 623.

**Sections added in `counters.json`:** Blue plates ← `country-fried-steak`, `meatloaf`;
Gravies and sauces ← `cream-gravy`; Sandwiches and burgers ← `tuna-salad` (beside
`tuna-melt`); Taquería Dessert ← `rice-pudding` (beside `flan`).

**`aka` corrections:** `marinara-sauce` → `red sauce, tomato sauce, salsa marinara` (T-001-12);
`white-sauce` drops `tzatziki`, `taziki`, `yogurt sauce`, `garlic sauce`; `tzatziki` drops
`white sauce`; `pilau-rice` drops `yellow rice` and `pilaf rice`; `rice-pilaf` drops `pilau`;
`chintan-broth` drops `clear chicken broth`.

Verified: no counter unsectioned, no section naming a slug not shelved there, and each fixed
name now resolves to one dish (`tzatziki`→`tzatziki`, `yellow rice`→`yellow-rice`, `clear
chicken broth`→`chicken-broth`, `pilau`→`pilau-rice`, `pizza sauce`→nothing).

## Step 7 — `docs/gaps/` ✅ `e181cb8`, `d0c44fd`

The fifteen notes were rewritten by script so every surviving bullet keeps **its own wording**
— the `What it has` block regenerated from `counters.json`, the numbered `missing` list filtered
and renumbered, the `components` list filtered, and `What it could not stock` copied verbatim.
Which entries survive was decided by matching each bolded dish name against the collection's
titles and `aka`, then read by hand for the cases a string match gets wrong.

Headers, the appended items, and the corrections below were written by hand.

**The round-trip, which is the acceptance test for this step:**

```
$ node scripts/menu-sections.mjs
...
every counter parsed cleanly.
```

and, run against a copy, `--write` now produces `counters.json` **byte for byte identical**.
T-001-17 warned that running this script today would undo its ticket; it now reproduces it.

150 missing dishes (was 315) and 133 missing components (was 191) across the fifteen.

## Deviations from the plan

1. **The property assertion was redrafted.** Plan §Step 2's shape failed on `lime-pickle`'s two
   equal waits. Corrected in place before committing; the correction is a better statement of
   the same claim. Recorded above.
2. **Three section titles in `counters.json` were shortened.** `menu-sections.mjs` cuts a
   heading at ` — `, so `Broths — the menu's first decision`, `The spit — three or four
   proteins` and `Breakfast all day — eggs, meats, potatoes` could not round-trip. The two
   sources of truth were made to agree by shortening the titles to `Broths`, `The spit`,
   `Breakfast all day` — which is the form every other section on the site already uses. Not in
   the plan; it is the same class of cross-file inconsistency this ticket exists to find, and
   the alternative was leaving a known drift between the notes and the data.
3. **Four `aka` entries beyond Structure §E.** `white-sauce` also dropped `yogurt sauce` and
   `garlic sauce` (`tzatziki` and `toum` own those), `tahini-sauce` and `toum` dropped
   `white sauce`, and `rice-pilaf` dropped `pilau`. Found while verifying the four planned
   edits: *white sauce* was answering for five dishes, not two. Same fix, four more lines.
4. **Six stale sentences hand-corrected inside the notes.** The script preserves prose, which
   preserves prose that is now false. An audit of every bolded name left in the fifteen files
   against the shelf found: the Diner's "Pie crust — the most-reused missing component on the
   entire site" (`all-butter-pie-crust` is written), its biscuit dough, its hot fudge and its
   burger patty; "tuna noodle casserole" listed as missing; the Smokehouse's peach cobbler; and
   **eight separate "there is no drink on the site" claims** across seven counters, untrue since
   `ca-phe-sua-da`, `egg-cream` and `milkshake`. All corrected by hand.
5. **`docs/active/tickets/T-001-18-read-the-whole-shelf.md` rode along in commit 6.** Lisa's own
   `phase: ready → implement` edit was sitting unstaged in the working tree, and the `--include`
   list for that commit was built from `git diff --name-only` without filtering it out. The
   content is Lisa's and unmodified by this ticket; nothing was written to it here. Later commits
   used explicit paths.

## What is not done, and why

- **No recipe moved between category folders.** Design §7 held this back deliberately: thirteen
  files re-categorised on this ticket's judgement is not one of the six acceptance criteria, and
  it moves the category tally the README has to report. Recorded as the **first job of the next
  pass** in `docs/gaps/README.md`, with the observation that it costs no URL change.
- **No tag checker was written.** The ticket asks for one vocabulary, not a mechanism. Recorded
  as the second job of the next pass.
- **No file was deleted.** The "weaker file is removed" remedy did not fire, because the
  duplicate-dish scan found no duplicate. Evidence is in `review.md`.

## Final state

```
npm run verify
  all 514 file(s) draw a table.
  parsed 514 recipe(s) in 27 categories -> src/generated/recipes.json
  Test Files  7 passed (7)
       Tests  666 passed (666)
  [build] 532 page(s) built in 505ms
```

`git status --short` shows no ticket-owned file staged, modified or untracked.
