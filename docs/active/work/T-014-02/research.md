# T-014-02 — Research

What exists, where, and what state each of T-014-01's thirteen mechanical findings is actually in
today. Descriptive only: no fix is proposed here and none was applied.

## 0. The tree this starts from

```
$ git status --porcelain -- recipes/ src/ scripts/ docs/gaps/ docs/knowledge/ README.md
$ npm run verify > verify-before.txt 2>&1 ; echo "VERIFY_RC=$?"
VERIFY_RC=0
all 685 file(s) draw a table.
parsed 685 recipe(s) in 27 categories -> src/generated/recipes.json
 Test Files  21 passed (21)      Tests  1229 passed (1229)
[build] 710 page(s) built
22 counter(s): 930 slug(s) listed, 930 printed.
$ node scripts/menu-sections.mjs > ms-before.txt        # 177 lines
```

Clean and green. The only untracked paths are S-007…S-014 story files and this story's two
remaining ticket files, none of which is this ticket's. T-014-01 left the same tree, so anything
found under `recipes/`, `src/`, `scripts/` is this attempt's.

## 1. Where the band lives

`docs/gaps/what-the-season-left.md:132-246`, section `## Mechanical`, four sub-headings and
**thirteen** bullets. Each carries a `*Source:*` clause and a `*Verify:*` clause. The two bands
this ticket may not touch are `## Needs an argument` (250-444) and `## Needs food` (446-478); their
summaries are already in `docs/gaps/README.md` under `### What the season left, S-007 to S-013`
(lines 427-478) as two tables.

`docs/active/work/T-014-01/review.md` §4.1 lists five findings already pushed out of the band, with
the test each failed. This ticket does not re-litigate those five; it re-checks the thirteen.

## 2. The thirteen, as the repository has them today

Baseline for each was run before anything was written. Three of the thirteen carry an error in the
finding's own text — the file it names, or the arithmetic in its verify command. The findings are
real in all three cases; the location or the expected number is what is wrong.

### 2.1 `one-pot.md`'s `## What it has` omits five soups

`docs/gaps/one-pot.md` prints four sections. `src/data/counters.json` has five for One Pot; the
fifth is `Quick soups that go with dinner` with exactly:

```
tomato-potato-beef-soup · seaweed-egg-drop-soup · mustard-greens-tofu-soup
crucian-carp-tofu-soup · century-egg-amaranth-soup
```

```
$ node scripts/menu-sections.mjs | grep -A6 'One Pot'
  ok   One Pot: 4 sections, 68/73 placed
         unplaced -> century-egg-amaranth-soup, crucian-carp-tofu-soup,
                     mustard-greens-tofu-soup, seaweed-egg-drop-soup, tomato-potato-beef-soup
```

The section title and its five members are both already decided and both already live — the page is
the only thing that does not know. `docs/gaps/README.md:207-215` describes this as the last drift on
the board and says in as many words that adding five slugs closes it.

### 2.2 `cha-chaan-teng.md` describes a mechanism that was removed

Three sites, all stale in the same direction:

| line | what it says | what is true |
| --- | --- | --- |
| 42-44 | *"a borrowed slug is recorded in this file and dropped from the page. The counter prints 22."* | all five are shelved; `dist/menu/cha-chaan-teng/index.html` → `<p class="count">27 recipes` |
| 157-163 | `menuFor()` *"drops anything it does not find — silently, with nothing failing"*, *"the counter prints 22 rather than 27"*, and `menu-sections.mjs` *"reports the five as listed but not shelved here every run"* | T-011-05 made `menuFor()` **throw with the slug named**; `menu-sections.mjs` reports `Cha Chaan Teng: 5 sections, 27/27 placed` |
| 167-171 | five table rows whose *What happened* cell reads `listed, not rendering` | all five render |

`grep -c 'listed, not rendering' docs/gaps/cha-chaan-teng.md` → **5**. The verdict column
(*shelve as is* / *write a new file* / *do not shelve*) is the section's argument and is unaffected
by any of this — what is wrong is a status column and a description of code.

### 2.3 `cha-chaan-teng.md:127` — *"No source states a ratio"*

One does. `T-007-03/design.md:106,113-117` records 自由時報 giving 幼茶 65 % · 粗茶 25 % · 中茶 10 %,
and `T-007-03/plan.md:151` explicitly hands the correction on: *"The blend-ratio correction to
`docs/gaps/cha-chaan-teng.md` — that file is T-007-05's."* It was never applied.

The page's own `## Sources` block already cites 自由時報 (line ~289) and already says the *other*
source, ACTHK, *"states no ratio"* — so the evidence for the correction is on the page already. The
shipped `hong-kong-milk-tea` prints the ratio merged to two grades, which the same design decision
covers.

### 2.4 `docs/gaps/voice.md` still teaches `>> step.N:`

§5 (`## 5. 172,003 characters nobody reads`, lines 189-225) describes the numbered form in the
present tense at lines 191, 201 and 215. It is a **dated measurement record from S-005** — its table
is `before S-005` against `now`, and its figures are S-005's.

```
$ grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l
0
```

T-009-03 removed the form, `npm run check` refuses it, and `scripts/inline-step-labels.mjs --write`
moves any that remain. The measurements are not wrong; they are correctly dated. What is missing is
that the reader is never told the form is gone.

### 2.5 `docs/knowledge/scaling.md` says there is no air fryer recipe

Two sites, not one:

```
403: and **no air fryer recipe exists in this collection** — no `.cook` file declares `kit: Air Fryer`,
508: - **There is no air fryer recipe**, so the second pole in §7 is an illustration from
```

Line 403 sits inside §7's worked illustration; line 508 is §9, `## What this file could not settle`.
Both are false:

```
$ node -e "const R=require('./src/generated/recipes.json');console.log(R.filter(r=>r.kit==='Air Fryer').length)"
13
```

13 files declare the kit, across a 21-recipe shelf. §9's own sentence also says *"When T-008-04
lands, §7's air fryer block should be rewritten"* — T-008-04 landed. **That rewrite is in the
next band** (`README.md:464`, *"§7's air fryer pole is still a hypothetical"*), so what is available
here is the false clause and nothing else. T-014-01's verify (`grep -c 'no air fryer recipe'` → 0)
requires both sites, which is worth saying because the finding's prose names only §9.

### 2.6 The `Build state` block is stale — and it is not in `README.md`

The finding says `README.md`. There is no `## Build state` in the root `README.md`; the block is
**`docs/gaps/README.md:29-40`**. Its figures are S-007's, and the file says so twice — once in the
block itself (*"Measured after T-007-05, with the whole of S-007 in"*) and again at line 76
(*"the `Build state` figures above, which are S-007's, are stale by a good deal"*).

| the block says | the build says |
| --: | --: |
| 664 recipes | 685 |
| 894 tests in 11 files | 1,229 in 21 |
| 688 pages | 710 |
| 904 counter assignments | 930 |
| timers in 640 | 661 |
| washing-up in 11 | 177 |
| 45 `kit:` — 25 Instant Pot, 20 Slow Cooker | 58 — 25 · 20 · 13 Air Fryer |

Lines 37-40 are not figures: they are the arithmetic that explains the recipe count
(*"658 at the start, minus the sixteen 老火湯 …, plus the eight … and the fourteen"*), which is
S-007's story and is true of S-007.

### 2.7 `3 of 1074` — also `docs/gaps/README.md`, not `README.md`

`docs/gaps/README.md:395`. The test prints:

```
$ npx vitest run src/lib/shopping.test.ts --reporter=verbose 2>&1 | grep 'have no aisle'
```

to be run against the current build. T-014-01 recorded `4/1086`; this is re-measured before the fix
rather than carried.

### 2.8 `occasions.md` — `0 capacities declared`, in three places

`docs/knowledge/occasions.md` lines 213 (`**0 capacities declared**`), 393 (*"the annotation pass
has not run, so all 685 files answer as though nothing binds"*) and 539 (*"`capacity` 0"*).

```
$ node -e "const R=require('./src/generated/recipes.json');console.log(R.filter(r=>r.capacity).length)"
46
```

Line 539 sits under *"Every count here is from 7 August 2026 at 685 files and will drift"* and lists
`keeps` 138 · `slack` 416 · `washing-up` 177 alongside `capacity` 0 — the other three are right, so
the sentence is internally inconsistent rather than uniformly dated.

### 2.9 `scripts/measure-pages.mjs:6` names a deleted slug

```
6:  node scripts/measure-pages.mjs --slug ching-bo-leung-soup   # one page
```

T-007-02 deleted that file with the other fifteen 老火湯. Line 30 names the same slug inside a dated
baseline note about a build of `1ae1165` and stays true of that build. The script itself reports
today's wordiest page, which is what `ching-bo-leung-soup` was when the line was written:

```
$ node scripts/measure-pages.mjs | head -6
685 recipe page(s) in dist   mean 2860   median 2805   max 4480  biryani
```

### 2.10 The build's refusal list has an unwritten third member

`README.md:248-251` — the root one this time:

> Things a table cannot show, and which the build will refuse rather than draw wrong:
> - **Splitting** a preparation into two later steps (it is a tree, not a graph).
> - **Two endings** — every branch must flow into one final step.

Both are `src/lib/tree.ts` throws (lines 198-203 and 228-233). T-009-04 added a third refusal,
`recipe.stepRefProblems`, consumed by `scripts/check-recipes.mjs:264` and
`scripts/parse-recipes.mjs:58`, with its own comment at `check-recipes.mjs:260-263`: a reference
that names no step at all is read by cooklang as an ingredient, so *"the table grows a row that is
not an ingredient and draws perfectly well"*. That is the same shape as the two bullets — the build
refuses rather than draw a wrong table — and it is not in the list.

### 2.11 `air-fryer-and-pot.md`'s last heading is the odd one out

`docs/gaps/air-fryer-and-pot.md:856` is `## What a table cannot hold`; every other live counter page
uses `## What it could not stock`. The derived figure is `docs/gaps/README.md:194`, *"158 items
across the twenty-two counters that a single table cannot express — 150 of them counted at the
previous pass, plus the eight on the new counter's page"*.

**The finding's verify arithmetic is wrong and the finding is not.**

```
$ grep -l '^## What it could not stock' docs/gaps/*.md | wc -l
22
```

It is already 22, because the 22 are **21 counter pages plus `filter.md`**, which borrows the
heading deliberately (`README.md:104-109`) and is not a counter. `soup-pot.md` is a retired counter
and uses `## What a table could not hold`. So the live counter pages are 21 + air-fryer-and-pot = 22,
and after the rename the grep returns **23**, not 22.

### 2.12 `src/lib/time.ts` does not know `airfry`

`UNATTENDED` (lines 60-68) and `HANDS_ON` (71-75) contain neither `airfry` nor `air fry`.
`normalise()` (line 103) strips spaces and hyphens, so a **named** timer `~air fry{20%min}` looks up
as `airfry` and finds nothing; `readWords()` (127-141) tokenises on `[a-z]+`, so the loose words
`air` and `fry` reach `HANDS_ON` through `fry`. Every basket cell today opens with `roast`, which
`readWords` reaches first in `UNATTENDED`, so the 21 basket recipes read as unattended by word
order. T-002-01's precedent is on the file: the four pressure names were added before any pressure
recipe existed.

T-014-01 measured the fix on a scratch copy of `HEAD` and got an **empty diff** over six schedule
figures for all 685 recipes. That measurement is the thing this ticket has to reproduce, not trust.

### 2.13 `scripts/parse-recipes.mjs` does not throw on `capacityProblem`

```js
// scripts/parse-recipes.mjs:52-62
for (const recipe of recipes) {
  for (const problem of [
    recipe.slackProblem, recipe.washingUpProblem, recipe.keepsProblem,
    ...recipe.stepLabelProblems, ...recipe.stepRefProblems,
  ]) { if (problem) throw new Error(`${recipe.path}: ${problem}`); }
}
```

`scripts/normalise.mjs:286,318` produces `capacityProblem` from `readCapacity()` and puts it on the
recipe beside the other four; `src/generated/recipes.json` carries the field on every recipe. It is
the one sibling missing from the list. `check-recipes.mjs` fails on the same problem and runs first
inside `npm run verify`, so nothing malformed can ship today — a bare `npm run build` is the hole.

Note the distinction: `capacityProblem` is `readCapacity()`'s **malformed-line** problem.
`checkCapacity()` in `check-recipes.mjs:146` is a different, source-reading check (vessel binds no
operation; capacity disagrees with servings) and is not what this finding is about.

## 3. Constraints this ticket works under

- **`docs/gaps/*.md` is machine-read.** `scripts/menu-sections.mjs` parses each `## What it has`
  block back into `src/data/counters.json`. Any edit to a counter page has to leave that dry run
  where it found it, or move it in the one direction the finding names. `docs/gaps/README.md:14-27`
  documents the `**Section title.** slug · slug` shape and the em-dash trap.
- **Two `voice.md` files exist** — `docs/gaps/voice.md` (S-005's writing record) and
  `docs/knowledge/voice.md`. The finding is about the first.
- **`src/generated/` is not committed.** Every count above comes from a rebuild.
- **`npm run verify:mobile` builds.** It cannot share the tree with any other build, which is what
  cost T-010-03 five attempts.
- **`dist/` is a build output** and is not committed; checks against it are re-run, not carried.

## 4. What is not in scope, and where it already lives

The other two bands are already written up in `docs/gaps/README.md:439-478` as two tables —
*needs an argument* (25 rows) and *needs food* (4 rows). Each row carries finding, source ticket and
why it was not done; the evidence for each is in `what-the-season-left.md`. Whether every row
carries all four things its acceptance criterion asks for is a check this ticket owes, not a writing
job it inherits.
