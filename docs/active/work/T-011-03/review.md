# T-011-03 — Review

**46 of 685 recipes now say what their limiting vessel holds.** Two commits, `939d8b5` and
`aebb954`, 46 files, **46 lines added and 0 deleted** — every added line begins `>> capacity:`.

`npm run verify` passes: 685 files checked, **1104 tests in 16 files**, 710 pages built.
`git status` is clean of every ticket-owned path.

---

## What changed

| Group | Files | The line | Where the number came from |
| --- | ---: | --- | --- |
| The file counts its own batches | 25 | `2 — the wok, sear` and kin | `c = ceil(s/N)` from *"in two batches"* / *"in three batches"* |
| S-008's basket | 21 | `4 — one 5.7 L air fryer basket, roast, air fry` | the file names the machine, its size, and what a smaller one costs |

Nothing else. No `src/`, no `scripts/`, no `docs/gaps/`, no `README.md`, no `docs/knowledge/`.

The full added-line diff, collapsed:

```
19 +>> capacity: 4 — one 5.7 L air fryer basket, roast, air fry
 7 +>> capacity: 3 — the Instant Pot's base, brown
 4 +>> capacity: 3 — the skillet, brown
 4 +>> capacity: 2 — four cups of oil in the wok, fry
 3 +>> capacity: 3 — the heavy pot, sear
 2 +>> capacity: 2 — one 5.7 L air fryer basket, roast, air fry
 1 +>> capacity: 3 — the Dutch oven, brown
 1 +>> capacity: 3 — the cast-iron skillet of fat, fry
 1 +>> capacity: 2 — the wok, sear
 1 +>> capacity: 2 — the wide pot, boil
 1 +>> capacity: 2 — the Instant Pot's base, sear
 1 +>> capacity: 2 — four cups of oil in the pan, fry
 1 +>> capacity: 1 — the frying pan, fry
```

## Acceptance criteria

| Criterion | Where |
| --- | --- |
| All prose-batching files read; each carries a capacity with arithmetic shown, or is listed with a reason | `progress.md` §2 — 70 files, 46 annotated with per-file arithmetic, 24 listed |
| All files naming a bounding vessel read and classed | `progress.md` §5 — 119 read (the ticket's net was narrower), 21 bounded and annotated, 98 bounded-but-unmeasured or not bounded, by vessel |
| Every S-008 air fryer file carries a capacity | `progress.md` §3 — **21 of 21**, no discrepancy |
| No capacity derived from servings alone, and it says so | `progress.md` §1 — the test applied, and the 98 refusals are refusals of exactly that derivation |
| Every capacity names its vessel as well as its number | Enforced by `readCapacity()`; visible in the diff above |
| Nothing not vessel-bound carries the line; fraction of 658 stated | `progress.md` §6 — 46/685 = 6.7%, 46/658 = 7.0%, against a quarter |
| The four deep-fry recipes annotated, and whether the bound is the pan or the oil | `progress.md` §4 — annotated; **the oil's temperature**, with three independent readings |
| No line other than `>> capacity:` changes; diff limited to added lines | Above — 46 added, 0 deleted |
| T-011-02's check passes over the whole collection | `npm run check`: 685 files, no failure, no new warning |
| Cost function at 2×, 3× and 12 servings; ten largest jumps in elapsed time | `progress.md` §7 |
| `npm run verify` passes | 1104 tests, 710 pages |
| Only `recipes/**/*.cook` and the work directory modified | `git show --numstat` over both commits: 46 files, all under `recipes/` |

## Test coverage

**No new test file**, deliberately: this ticket owns `>> capacity:` lines in `.cook` files, and
`src/lib/scaling.test.ts` is T-011-02's. The data is covered three ways that already run in CI:

| Check | Catches |
| --- | --- |
| `check-recipes.mjs` (first in `verify`) | a malformed line, one that binds nothing, one that contradicts its own servings |
| `scaling.test.ts` whole-collection properties | `NaN` at any plan multiplier, confidence strengthening, `longest > standing` — now running against 46 real capacities for the first time rather than against fixtures |
| `astro build` | anything downstream that reads `recipe.capacity` |

Two gaps, both by design and both covered by hand instead:

1. **Nothing automated can say a number is wrong about a real pan.** Mitigated by the per-file
   arithmetic in `progress.md` §2 — every capacity is one division away from a sentence quoted out
   of its own file, checkable in about ten seconds a row without opening anything.
2. **Nothing automated catches a capacity that binds a step but charges no minutes.** This is the
   real hazard and it was caught by hand: a basket file naming only `roast` passes every check in
   the repo and costs **0** instead of 42 minutes. All 46 were probed for it before writing, and
   every bound step was checked for unnamed timers.

## Open concerns

1. **A capacity can bind a step and cost nothing, and nothing warns.** The operation has to match
   the **timer's name**, not just the step's words. `>> capacity: 4 — the basket, roast` on
   `air-fryer-chicken-wings` binds the step, passes `check-recipes.mjs`, and prices twelve servings
   at 21 minutes instead of 63. Every file here names both the label's verb and the timer's, so
   nothing is wrong today — but **the next person to write a capacity will hit this**, and the
   check that already prints every step label could print the timer names beside them. Owner:
   whoever next holds `scripts/check-recipes.mjs`.

2. **`scripts/parse-recipes.mjs` still does not throw on `capacityProblem`.** T-011-02's open
   concern 1, which named this ticket as the natural place to fix it. It is outside this ticket's
   ownership — the AC restricts changes to `recipes/**/*.cook` — so it is carried, not fixed.
   Nothing ships broken: `npm run check` fails on a malformed line and runs before `recipes` in
   `npm run verify`. A bare `npm run build` would still read a half-written line as absent.

3. **`batches.costMinutes` goes negative on both `carnitas` files** (−2 minutes). T-011-02's open
   concern 2 reproduced on real data: `s = 8, c = 3, n = 12` gives `r = 1.33 < m = 1.5`, so the
   part-full-last-load term `H_batch·(r − m)` is negative. `elapsed` is unaffected and correct.
   **A finding for T-011-02**, per the AC, not a reason to change the number — but a field a page
   might print should probably not go below zero.

4. **98 files are area-bounded and unmeasured.** Sheet pans, cookie sheets, steamers, steels,
   griddles, irons. Every one of them is a surface where crowding changes the dish, and not one
   says how full it is. They are annotatable the moment their files say what the baskets say —
   *"written for a 13×18-in sheet pan"* — which is one sentence per file and about 60 more
   capacities. **The strongest single follow-up this ticket found**, and it is a writing job, not
   a code one.

5. **The eleven that say `in batches` without a count.** `karaage`, `french-fries`, all three
   `chile-verde` variants, `braised-short-ribs-slow-cooker`, `lamb-tagine-slow-cooker`,
   `sambousek`, `onion-bhaji`, `kibbeh`, `nixtamalised-masa`. Their siblings that say *two* got a
   line and they did not, which reads as unevenness in the collection rather than in this ticket —
   `braised-short-ribs-instant-pot` says *two batches* and `braised-short-ribs-slow-cooker` says
   *in batches*, and they are the same dish. Adding the word *two* where the author knows it is a
   one-word fix per file.

6. **`c` is rounded up to a whole serving**, so `carnitas` at `s = 8, N = 3` says 3 where the true
   load is 2.67. It reproduces the author's own batch count at the written size (checked on all 25)
   and drifts to one load in eight at 24 servings, in the direction of a quieter evening. Stated in
   `design.md`; a one-decimal capacity is the alternative and reads worse.

7. **`docs/knowledge/scaling.md` §7 and §9 are now out of date in this ticket's favour.** §9 says
   *"there is no air fryer recipe, so the second pole in §7 is an illustration"*; there are 21, and
   the illustration's hypothetical figures (66 minutes at twelve, the basket costing 40) are within
   a couple of minutes of the real `air-fryer-chicken-wings` (63, costing 42). Rewriting §7 from a
   real file is T-011-01's, and the file's own §9 asks for it.

## What a reviewer should look at first

`progress.md` §2's first table — 25 rows, each with the sentence the number was read from. If the
rule is right, the numbers follow; if a row's sentence does not support its number, that row is
wrong and nothing else is.

Then `progress.md` §7's ten largest jumps, which is where the whole story either pays off or looks
absurd. It splits cleanly: seven baskets where every minute of the jump is the vessel, three pots
where the vessel contributes nothing and the growth is work that was going to triple anyway.
