# T-001-02 — Progress

All ten plan steps done. Fourteen files written, nine commits through `lisa commit-ticket`,
nothing ticket-owned left in the working tree.

## Steps

| # | Step | State | Commit |
| --: | --- | --- | --- |
| 0 | `recipes/sandwiches-and-rolls/`, `recipes/drinks/` | done | with their first files |
| 1 | Baseline recorded | done | — |
| 2 | `banh-mi-khong`, `nuoc-cham` | done | `ed65d1c` |
| 3 | `pho-broth`, `pho-bo`, `pho-ga` | done | `840f900` |
| 4 | `cha-lua` | done | `e2b8ba3` |
| 5 | `banh-mi-dac-biet`, `banh-mi-thit-nuong` | done | `f9f5f75` |
| 6 | `cha-gio`, `goi-cuon` | done | `84c4e6d` |
| 7 | `bun-thit-nuong`, `com-tam` | done | `5535f18` |
| 8 | `xiu-mai` | done | `b9e6c0b` |
| 9 | `ca-phe-sua-da` | done | `91b958b` |
| 10 | Collection verification, then one fix commit | done — see deviations | `59c0525` |

## The fourteen, predicted against actual

Every file was checked with `--labels` before its commit.

| File | Folder | Predicted | Actual |
| --- | --- | --- | --- |
| `banh-mi-khong` | breads | 10 rows, 5 ops | `10 rows x 6 cols` |
| `nuoc-cham` | dressings-and-dips | 7 rows, 4 ops | `7 rows x 4 cols` |
| `pho-broth` | soups | 15 rows, 5 ops | `15 rows x 4 cols` |
| `pho-bo` | soups | 14 rows, 5 ops | `14 rows x 5 cols` |
| `pho-ga` | soups | 15 rows, 5 ops | `15 rows x 5 cols` |
| `cha-lua` | stews-and-braises | 10 rows, 5 ops | `10 rows x 6 cols` |
| `banh-mi-dac-biet` | sandwiches-and-rolls | 11 rows, 3 ops | `11 rows x 4 cols` |
| `banh-mi-thit-nuong` | sandwiches-and-rolls | 15 rows, 5 ops | `15 rows x 6 cols` |
| `cha-gio` | sandwiches-and-rolls | 15 rows, 5 ops | `15 rows x 6 cols` |
| `goi-cuon` | sandwiches-and-rolls | 15 rows, 5 ops | `15 rows x 4 cols` |
| `bun-thit-nuong` | rice-beans-and-grains | 15 rows, 5 ops | `15 rows x 5 cols` |
| `com-tam` | rice-beans-and-grains | 15 rows, 5 ops | `15 rows x 5 cols` |
| `xiu-mai` | stews-and-braises | 16 rows, 5 ops | `16 rows x 5 cols` |
| `ca-phe-sua-da` | drinks | 5 rows, 5 ops | `5 rows x 6 cols` |

Row counts landed exactly as the Structure blueprint predicted, all fourteen. Column counts
came in **at or below** prediction, because branches that open in parallel share a column —
`pho-broth`'s three openers (parboil, char, toast) all sit in column 1, so five operations
draw in four columns rather than six. Every file is inside the README's 5–16 rows and 3–6
operations. No table needed a structural rescue: the three-way merge in `pho-broth` tiled on
the first attempt, and `banh-mi-dac-biet` cleared the three-operation floor without splitting
a step, so neither risk in the plan's risk table had to be paid.

## Verification

- `node scripts/check-recipes.mjs --labels <the fourteen>` → **`all 14 file(s) draw a table.`**
  Every operation cell came out as a verb; the label staircases are in the commits.
- **Every timer named:** 41 timers across the fourteen files, and `grep '~{'` over them
  returns nothing.
- `node scripts/check-recipes.mjs` (whole collection) → **`all 312 file(s) draw a table.`**
- `npm run recipes` → **`parsed 312 recipe(s) in 20 categories · counters: 312 named, 0
  inferred from category`**. Twenty categories, up from thirteen: two are mine
  (`Sandwiches & Rolls`, `Drinks`) and five belong to the three counter tickets running
  alongside this one on the same branch.
- **The counter, measured from the generated JSON:** **18 recipes on Phở & Bánh Mì, 16 of
  them naming it and no other counter.** The bar is 16 and 12.

  ```
  banh-mi-dac-biet  banh-mi-khong  banh-mi-thit-nuong  banh-xeo  bun-thit-nuong
  ca-phe-sua-da     cha-gio        cha-lua             com-tam   do-chua
  goi-cuon          nuoc-cham      pho-bo              pho-broth pho-ga
  xiu-mai                                            ← 16 exclusive
  pork-liver-pate [also Deli]   char-siu [also Dim Sum Counter, Takeout Counter]
  ```

- `npx vitest run` → **461 passed, 3 failed.** Attribution is in the deviations below and in
  `review.md`; none of the three is this ticket's to fix, and one of the two that this
  ticket's files touched was fixed rather than reported.
- `git status --porcelain -- recipes/` → empty.

## Deviations from the plan

**One deviation, and it produced a tenth commit the plan did not have.**

Step 10 turned up two collection-level test failures that the per-file checker cannot see, and
that the plan had anticipated only as risks. Both were attributed by parsing the collection
with the fourteen files removed. Note that three other counter tickets are working the same
branch concurrently, so the raw failure count on `main` is not a measure of this ticket alone;
every number below is the attributed one.

1. **`units.test.ts` → "adds up every ingredient in the collection without losing a drop"
   failed on `water`.** Mine, and a real defect rather than a policy question: six ingredients
   across five files were written as bare `@water{}`, `@warm water{}`, `@cold water{}` with the
   quantity in a note ("to cover"). The acceptance criteria ask for quantities that are real
   for the stated servings, so "to cover" was the wrong call independently of the test.
   **Fixed** — every one now carries a number and a metric equivalent.
2. **`icons.test.ts` → "recognises every verb the recipes open an operation with" failed on
   fourteen verbs**, seven of them mine: `bowl`, `build`, `firm`, `load`, `pile`, `plate`,
   `serve`. The test's own message says to add them to `VERB_ICONS` in `src/lib/icons.ts` —
   which this ticket may not touch — so the alternative remedy was taken instead: each of the
   seven was reworded to a verb the collection already draws (`arrange`, `pack`, `freeze`,
   `fill`, `top`, `top`, `finish` / `arrange`), in both the prose and the `>> step.N:`
   override. The labels read at least as well; "freeze 20 min, shave paper-thin" is plainer
   than "firm 20 min", and every one of the fourteen operation cells now gets a drawn icon
   rather than the fallback. **Fixed.**

Both fixes landed in one commit, `59c0525`, and every affected file was re-checked with
`--labels` first: `all 14 file(s) draw a table`, sizes unchanged.

**What was left alone, deliberately:**

3. **`shopping.test.ts` → "finds an aisle for nearly everything" fails at 19/656 = 2.90%
   against a 2% budget.** Eight of the nineteen unplaced names are mine: `đồ chua` (4),
   `nước chấm` (3), `bánh mì rolls` (3), `grated jicama` (2), `ascorbic acid`, `chả lụa`,
   `thịt nguội`, `Maggi seasoning`. The other eleven belong to the concurrent counter tickets
   (`barbecue sauce`, `char siu`, `bamboo shoots`, `house brown sauce`, `pad thai sauce`,
   `sweet and sour sauce`, `green papaya`, `baby bok choy`, `dried lily buds`,
   `dried split lotus seeds`, `vanilla wafers`). With the fourteen files removed the ratio is
   11/615 = 1.79% and the test passes, so this ticket's names are what tip it over.

   The fix is patterns in `src/data/aisles.json`, which the ticket names as T-001-17's. The
   available workaround — renaming `đồ chua` to "pickled carrot and daikon" and `chả lụa` to
   "Vietnamese pork roll" — would contradict the premise the counter exists to serve; the gap
   doc's word for these is "impossible to find under an English name". One honest reduction
   was made: `split bánh mì rolls` and `bánh mì rolls` were two names for one thing, and are
   now one. Recorded for T-001-17, not fixed here.

4. **`schedule.test.ts` → "are the three ferments"** still fails on T-001-01's
   `crema-mexicana`, exactly as that ticket reported. Nothing here goes near it: the longest
   new critical path is `cha-lua` at 579 min against a 1568-min cut.

## Not done, deliberately

- `npm run verify` in full was not run. Its parse and test legs are covered above; the Astro
  build adds nothing for a data-only change; and the suite is known red for reasons outside
  this ticket. Same decision, and the same reason, as T-001-01.
- Ranked items 13–22 of `docs/gaps/pho-and-banh-mi.md` are unwritten. The count reached #12,
  which is what the acceptance criterion asks for. Named with reasons in `design.md` §D2 and
  again in `review.md`.
- No file outside `recipes/` was touched — not `src/data/counters.json`, not
  `src/data/aisles.json`, not `src/lib/icons.ts`, not `docs/gaps/`. `src/generated/` is
  gitignored and was only ever a build output.
