# T-001-16 — Progress

## Baseline (Step 0)

`node scripts/check-recipes.mjs` — all 493 files draw a table.
`npm run recipes` — parsed 493 recipes, 493 named counters, 0 inferred.

Bakery, resolved the way `parse-recipes.mjs` resolves it:

| | Baseline | Threshold |
|---|---|---|
| Bakery shelves | 99 | ≥ 97 |
| Bakery and no other counter | **58** | ≥ 62 |

The shelved number was already over; the exclusive number was the binding one, four short.

Note: the collection grew from 475 to 493 to 512 files *while this ticket ran* — sibling tickets
T-001-13/14/15 are committing into other folders concurrently. Every count below is a
point-in-time reading.

## Step 1 — `recipes/pastry-and-doughs/croissant-dough.cook` ✅

Written as planned: 500 g bread flour, a 250 g butter block, cold overnight bulk, three letter
folds with a 45-minute chill between each, one hour of rest before it is cut.

`check-recipes --labels` → `ok  7 rows x 5 cols`. Two branches (détrempe, butter block) meet at
the enclose step; the staircase descends across five operations.

Committed `27c9244` — *Laminate a yeasted dough, three folds and an overnight rest*.

## Step 2 — `croissant.cook`, `pain-au-chocolat.cook` ✅

Both take `@croissant dough{1%batch}` as a plain leaf and carry `>> pairs-with: croissant-dough`,
the device `egg-custard-tart` already uses for `@blind-baked tart shells{12}`.

`ok  4 rows x 5 cols` and `ok  5 rows x 5 cols`.

Committed `40dfc94` — *Cut the crescents and the batons from the same sheet*.

**Deviation from plan:** `npm run recipes` was deferred from Step 2 to the end of Step 3.
`croissant.cook` pairs with `almond-croissant`, which did not exist yet, and `parse-recipes.mjs`
throws on a `pairs-with` slug that is not a recipe. `check-recipes.mjs` does not validate
`pairs-with`, so the per-file gate still ran at Step 2; only the collection-wide gate moved.

## Step 3 — `frangipane.cook`, `almond-croissant.cook` ✅

Frangipane written first so its slug resolves. Equal weights butter / sugar / egg / almond flour,
plus a spoon of flour to hold it, rum and almond extract, chilled firm enough to pipe.

Almond croissant written as the twice-baked pastry it actually is — day-old croissants, rum
syrup, filled and topped, almonds, dusted cold.

`ok  8 rows x 5 cols` and `ok  8 rows x 6 cols`.
`npm run recipes` → parsed 503, no `pairs-with` or counter errors.

Committed `4055911` — *Write the almond cream, and the second bake it was made for*.

## Step 4 — `recipes/breads/pineapple-bun.cook` ✅

Dough branch (tangzhong → knead → butter → rise) and lid branch (butter, lard, powdered sugar,
yolk, custard powder, baker's ammonia, cake flour) merging at the drape-and-proof step.

`ok  18 rows x 6 cols`. The merge rendering as one operation cell is the proof that both
branches flow into a single root — `buildTree` throws outright on two roots.

Committed `c7b2681` — *Drape the cracked lid over the bun the case is named for*.

## Step 5 — acceptance recount and full verify

### The counts

| Criterion | Threshold | Measured |
|---|---|---|
| Bakery shelves | ≥ 97 | **107** |
| Bakery and no other counter | ≥ 62 | **63** |

Six new files: five Bakery-only (58 → 63), one at Bakery and Dim Sum Counter. The shelved figure
of 107 includes recipes sibling tickets added at Bakery alongside their own counters.

### Per-file checks

`node scripts/check-recipes.mjs --labels` reports `ok` for all six, every staircase a chain of
verbs. `grep -n '~{'` across the six returns nothing — every timer is named.

`node scripts/check-recipes.mjs` (whole collection): all 512 files draw a table.

### `npm run verify` — 4 pre-existing failures, none caused by this ticket

```
FAIL icons.test.ts    > recognises every verb the recipes open an operation with
FAIL schedule.test.ts > the recipes with the longest critical path are the three ferments
FAIL schedule.test.ts > ... agree with what their authors claim, within a few percent
FAIL shopping.test.ts > finds an aisle for nearly everything
```

Attributed rather than assumed. A detached worktree at `27c9244~1` — the commit immediately
before this ticket's first — was built and tested in isolation:

```
parsed 493 recipe(s)
FAIL icons.test.ts / schedule.test.ts (x2) / shopping.test.ts
Tests  4 failed | 641 passed (645)
```

**The same four tests, already red before this ticket wrote a line.** They are collection-wide
assertions that many in-flight tickets move: the schedule failures name `sauerkraut` and
`ginger-garlic-paste` as the new longest ferments (neither is this ticket's), and 86 of the 89
unmatched shopping ingredients predate it.

**Deviation from plan — three step labels reworded.** The icons test prints which leading verbs
fall through to the fallback icon. Sixty-five do; of those, exactly one — `shut`, from
`croissant-dough` step 3 — came only from this ticket's files. `lay` and `ball` also appeared in
this ticket's labels but were already house usage (`shio-ramen`, `smash-burger`). All three were
reworded onto verbs the icon map draws, which is an improvement to the staircase in its own
right, not test-chasing:

- `shut the block in and roll to a long rectangle` → `fold the dough round the block and roll it long`
  (also matching `hojaldre` step 3, the sibling laminate)
- `lay two batons in each and roll seam-down` → `roll two batons into each, seam down`
- `ball the dough, drape a lid on each, proof 45 min` → `portion the dough, drape a lid on each, proof 45 min`

Re-checked `ok` after the edits, with no fall-through verbs left from this ticket.

Committed `e6aed06` — *Open three operation cells with verbs the case already draws*.

### Left for T-001-17

`frangipane`, `croissant dough` and `baker's ammonia` have no shopping aisle. The aisle map lives
in `src/lib/`, which this ticket is explicitly forbidden to touch, and the same gap already
exists for `hojaldre`, `pizza dough`, `char siu` and `blind-baked tart shells` — every recipe
used as an ingredient in another. Recorded in `review.md` as a handoff, not fixed here.

## Files created

```
recipes/pastry-and-doughs/croissant-dough.cook     Bakery
recipes/pastry-and-doughs/croissant.cook           Bakery
recipes/pastry-and-doughs/pain-au-chocolat.cook    Bakery
recipes/pastry-and-doughs/almond-croissant.cook    Bakery
recipes/custards-and-puddings/frangipane.cook      Bakery
recipes/breads/pineapple-bun.cook                  Bakery, Dim Sum Counter
```

Nothing modified, nothing deleted. `src/generated/` is gitignored, so regenerating
`recipes.json` left no tracked change under `src/`.

## Commits

| | |
|---|---|
| `27c9244` | Laminate a yeasted dough, three folds and an overnight rest |
| `40dfc94` | Cut the crescents and the batons from the same sheet |
| `4055911` | Write the almond cream, and the second bake it was made for |
| `c7b2681` | Drape the cracked lid over the bun the case is named for |
| `e6aed06` | Open three operation cells with verbs the case already draws |

All through `lisa commit-ticket --ticket-id T-001-16` with exact `--include` paths. No ordinary
`git add`, no `-A`, no ordinary `git commit`. No ticket-owned file is left staged, modified or
untracked.
