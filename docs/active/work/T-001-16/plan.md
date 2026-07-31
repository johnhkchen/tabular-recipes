# T-001-16 — Plan

Four commits, six files. Each step is verified before the next is written, because a `~N`
reference that is off by one produces a table that still parses and is silently wrong.

## Step 0 — baseline

```
node scripts/check-recipes.mjs            # whole collection is green before I add to it
npm run recipes                           # parses, validates counters and pairs-with
```

Record the Bakery numbers as they stand (99 shelved / 58 exclusive) so the final recount has
something to move against.

Done when: the collection checks clean and the baseline is written into `progress.md`.

## Step 1 — `recipes/pastry-and-doughs/croissant-dough.cook`

Write the yeasted laminate: détrempe with a cold overnight bulk, a 250 g butter block into
500 g of flour, three letter folds with a 45-minute chill between each, then an overnight rest
before it is cut.

Verify:

```
node scripts/check-recipes.mjs --labels recipes/pastry-and-doughs/croissant-dough.cook
```

Done when: `ok`, ≥ 3 rows × ≥ 3 cols, the staircase reads as five verbs, and the two branches
(détrempe, butter block) meet at the enclose step rather than dangling.

Commit: `lisa commit-ticket --ticket-id T-001-16 --include recipes/pastry-and-doughs/croissant-dough.cook`

## Step 2 — the two shaped items

`croissant.cook`, then `pain-au-chocolat.cook`. Both take `@croissant dough{1%batch}` as a leaf
and carry `>> pairs-with: croissant-dough`.

Verify:

```
node scripts/check-recipes.mjs --labels recipes/pastry-and-doughs/croissant.cook recipes/pastry-and-doughs/pain-au-chocolat.cook
npm run recipes     # the pairs-with target must resolve, and be made mutual
```

Done when: both `ok`, and `npm run recipes` does not throw on the `pairs-with` slug.

Commit: both paths in one `lisa commit-ticket`.

## Step 3 — frangipane, then almond croissant

Order matters: `almond-croissant` pairs with `frangipane`, and `npm run recipes` throws on a
`pairs-with` slug that is not a recipe yet.

Verify:

```
node scripts/check-recipes.mjs --labels recipes/custards-and-puddings/frangipane.cook recipes/pastry-and-doughs/almond-croissant.cook
npm run recipes
```

Done when: both `ok`; `almond-croissant` shows six columns (syrup → soak → fill → top and bake →
dust) and both consumed recipes appear as ingredient rows.

Commit: both paths in one `lisa commit-ticket`.

## Step 4 — `recipes/breads/pineapple-bun.cook`

The one file with two counters. Dough branch and lid branch merge at the shaping step.

Verify:

```
node scripts/check-recipes.mjs --labels recipes/breads/pineapple-bun.cook
```

Done when: `ok`, and the merge shows as one operation cell spanning both branches' rows rather
than as two roots (`buildTree` would have thrown on two roots, so `ok` is the proof).

Commit: `lisa commit-ticket --ticket-id T-001-16 --include recipes/breads/pineapple-bun.cook`

## Step 5 — acceptance recount and full verify

```
node scripts/check-recipes.mjs                      # every file in the collection
npm run verify                                      # parse + test + build
```

Recount Bakery membership the way `parse-recipes.mjs` resolves it (explicit `>> counters:`, with
the category fallback for files that name none) and check against the thresholds:

| Criterion | Threshold | Expected |
|---|---|---|
| Bakery shelves | ≥ 97 | 105 |
| Bakery and no other counter | ≥ 62 | 63 |

Then re-read all six files against the per-recipe criteria by hand — no script checks these:

1. `title`, `category`, `tags`, `servings`, `counters` present on every file; `aka` present
   wherever the dish is ordered under another name, with an undiacriticked form included.
2. Every timer named. Grep for the anonymous form: `grep -n '~{' <files>` must return nothing.
3. Quantities real for the stated servings — a hydration and a butter percentage that would
   actually work, not decorative numbers.
4. The method canonical: three folds not one, a two-hour proof before baking, day-old croissants
   for the almond one, custard powder in the bo lo bao lid.

Done when: every check passes and the numbers clear.

## Step 6 — Review artifacts

`review.md` and `review-disposition.json` into `.lisa/attempts/T-001-16/1/work/`, then
`lisa check-disposition T-001-16`, then stop and wait.

## Testing strategy

There is no unit-test surface here — the deliverable is data, and `scripts/check-recipes.mjs` is
the test harness the project already provides. It exercises the real `buildTree` and
`layout` from `src/lib/`, so a file that checks `ok` is a file the site will render. Coverage
therefore comes from three layers:

- **Per file, structural** — `check-recipes.mjs` (metadata, counter names, tiling, row and
  column floors, empty labels).
- **Collection-wide, relational** — `npm run recipes` (unique slugs, `pairs-with` targets exist,
  counter names known, no homeless recipe, no duplicate `dish` without `kit`).
- **Whole build** — `npm run verify` (parse, the existing test suite over `src/lib`, and the
  Astro build).

Nothing here is checkable by machine for *culinary* correctness, so the ratios, the fold count
and the ferment times are the part that needs a human's eye in review; `review.md` will say so
plainly rather than implying the green checks cover it.

## Rollback

Each commit is one or two files that nothing else references at the time it lands. If a file
turns out wrong, it is rewritten and re-committed; nothing in `src/` or the generated JSON is
committed by this ticket, so there is no derived state to unwind.

## Known deviations to record if they happen

- If `check-recipes.mjs` rejects a shaped-item file for having too few columns, the fix is to
  stop merging shape-and-proof into one step, not to pad with ingredients.
- If `npm run verify` fails for a reason outside `recipes/**` (a sibling ticket mid-flight), that
  is noted in `progress.md` and `review.md` and is not this ticket's to fix.
