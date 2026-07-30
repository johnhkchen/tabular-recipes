# T-001-01 — Progress

All seven plan steps done. Five files written, five commits through `lisa commit-ticket`,
nothing ticket-owned left in the working tree.

## Steps

| # | Step | State | Commit |
| --: | --- | --- | --- |
| 1 | `recipes/dressings-and-dips/crema-mexicana.cook` | done | `d9e178b` |
| 2 | `recipes/dressings-and-dips/queso-fresco.cook` | done | `f8ab4a7` |
| 3 | `recipes/pastry-and-doughs/nixtamalised-masa.cook` | done | `6aef743` |
| 4 | `recipes/custards-and-puddings/red-bean-paste.cook` | done | `f305d15` |
| 5 | `recipes/custards-and-puddings/lotus-seed-paste.cook` | done | `5875c1f` |
| 6 | Verify the five, then the collection | done — one failure, outside this ticket's ownership (below) | — |
| 7 | Progress and review artifacts | done | — |

Each file was checked with `--labels` before its commit and drew the table the Structure
blueprint predicted, at the predicted size:

| File | Predicted | Actual |
| --- | --- | --- |
| nixtamalised-masa | 5 rows, 5 ops | `5 rows x 6 cols` |
| crema-mexicana | 6 rows, 4 ops | `6 rows x 5 cols` |
| queso-fresco | 5 rows, 5 ops | `5 rows x 6 cols` |
| red-bean-paste | 6 rows, 5 ops | `6 rows x 6 cols` |
| lotus-seed-paste | 7 rows, 5 ops | `7 rows x 6 cols` |

Every one inside the README's 5–16 rows and 3–6 operations. No `>> step.N:` override had to be
added beyond the ones the Structure planned — every derived label came out as a cook's verb
on the first pass, so no step needed rewording.

## Verification

- `node scripts/check-recipes.mjs --labels <the five>` → **`all 5 file(s) draw a table.`**
- Every timer named: 17 timers across the five files, `grep -n '~{'` returns nothing.
- `node scripts/check-recipes.mjs` → **`all 254 file(s) draw a table.`** (249 + 5)
- `npm run recipes` → `parsed 254 recipe(s) in 13 categories · counters: 254 named, 0
  inferred from category · timers in 234 · pairings 138`. Every `pairs-with` resolved; nothing
  was left inferring its counter.
- `npx vitest run` → **405 passed, 1 failed.** See the deviation below.
- `git status --porcelain -- recipes/` → empty.

## Deviations from the plan

**One, and it is the only open item: `src/lib/schedule.test.ts` now fails.**

`crema-mexicana`'s critical path is 1680 min (24 hr culture + 4 hr chill), which lands it
third-longest in the collection and pushes `pizza-dough` (1568 min) off a snapshot the test
pins by name:

```
src/lib/schedule.test.ts > the recipes with the longest critical path > are the three ferments
- "pizza-dough"
+ "crema-mexicana"
```

The other two assertions in that block still pass with crema in the list — its author-claimed
28 hr 15 min agrees with the derived 28 hr to within 0.9%, and it is entirely unattended.

Three ways to handle it were considered:

1. **Shorten the culture to 12 hr.** Twelve hours is a defensible number for crema, so this
   would be honest on its own terms — but choosing it *because a snapshot says so* would hide
   a signal the board needs. The same assertion will break again the first time a counter
   ticket writes a phở broth, a cure or a long-fermented dough, and this story is adding
   roughly two hundred recipes.
2. **Update the test.** Forbidden here: the ticket's acceptance criteria say *"No file outside
   `recipes/` is modified"*, and `src/lib/` is owned by no ticket in this story's split.
3. **Leave it, and report it.** Chosen.

Nothing about the five files was changed to accommodate it. The failure is carried into
`review.md` as the open concern, with the remedy named.

## Not done, deliberately

- `npm run verify` in full (parse + tests + build) was not run. Steps 3–5 above cover the
  parse and the tests; the Astro build adds nothing for a data-only change and the suite is
  already known-red for the reason above. Recorded in `plan.md` as a decision.
- No file outside `recipes/` was touched — not `src/data/counters.json`, not
  `src/data/aisles.json`, not `docs/gaps/`, not `src/lib/schedule.test.ts`.
