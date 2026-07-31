# T-003-04 — Plan

Six batches, each independently checkable and independently committable. Verification is
path-scoped throughout, because three sibling tickets are writing into `recipes/**` on the same
branch.

---

## Step 0 — Prove the floor before writing 26 files against it

Before B1, write one file (`gohan`) and run the checker on it alone. `gohan` is the riskiest file
in the roster: **3 ingredient rows, which is exactly `check-recipes.mjs`'s minimum**, and if
cooklang merges the two water rows into one it fails outright.

```sh
node scripts/check-recipes.mjs --labels recipes/rice-beans-and-grains/gohan.cook
```

**Verification criterion:** prints `ok` with `>= 3 rows x >= 3 cols`, and the staircase reads as
verbs — `rinse until it runs clear` / `soak 30 min` / `boil, then 12 min low` / `rest 10 min, lid on`.

**If it fails on rows:** the fallback is a `gohan` that is honestly four rows — rice, rinsing
water, cooking water, and the kombu strip that a household often adds — and the design note about
the two-ingredient dish moves into the file's opening prose. Recorded here so the deviation is
already reasoned rather than improvised.

## Step 1 — B1, the foundation (5 files)

`gohan` · `tonjiru` · `sumashi-jiru` · `takikomi-gohan` · `mentsuyu`

Everything downstream points at rice, at a soup, or at mentsuyu, so this batch has to land first.

```sh
node scripts/check-recipes.mjs --labels \
  recipes/rice-beans-and-grains/gohan.cook \
  recipes/rice-beans-and-grains/takikomi-gohan.cook \
  recipes/soups/tonjiru.cook \
  recipes/soups/sumashi-jiru.cook \
  recipes/sauces-and-gravies/mentsuyu.cook
```

**Verification:** `all 5 file(s) draw a table.`, exit 0. Then commit:

```sh
lisa commit-ticket --ticket-id T-003-04 \
  --message "The rice, two soups and the mentsuyu" \
  --include recipes/rice-beans-and-grains/gohan.cook \
  --include recipes/rice-beans-and-grains/takikomi-gohan.cook \
  --include recipes/soups/tonjiru.cook \
  --include recipes/soups/sumashi-jiru.cook \
  --include recipes/sauces-and-gravies/mentsuyu.cook
```

Exact paths only. No `git add`, no `git add -A`, no `git commit`.

## Step 2 — B2, 煮物 (6 files)

`nikujaga` · `buri-daikon` · `kabocha-no-nimono` · `chikuzenni` · `saba-no-misoni` ·
`kiriboshi-daikon`

The ratio work is concentrated here and this is where "never fabricate a number" is load-bearing.
Before writing, each file's ratio is checked against the table in `design.md` D3, and the file
either quotes the ratio in its opening prose or does not claim one.

Two shapes carry risk and get checked first:

- **`buri-daikon`** is the only two-branch tree in the batch — daikon parboiled in rice-washing
  water on one side, the buri 霜降り on the other, merging into the simmer. If `findTilingErrors`
  reports a hole, the fallback is to fold the 霜降り into the same step as the daikon's transfer,
  which costs the operation but keeps the tree single-branched.
- **`chikuzenni`** is the widest at 12 rows and 4 operations, which is inside the README's target
  but close to the point where the table scrolls.

**Verification:** checker over all six, then one commit with six `--include` paths.

## Step 3 — B3, grilled and pan-fried mains (4 files)

`shogayaki` · `saba-shioyaki` · `buri-teriyaki` · `hambagu`

`buri-teriyaki` gets read against `recipes/sauces-and-gravies/teriyaki-sauce.cook` before it is
committed — not to edit it, but to make sure the new file's opening line describes the difference
accurately rather than from memory.

**Verification:** checker over all four, then one commit.

## Step 4 — B4, 小鉢 (6 files)

`kinpira-gobo` · `hijiki-no-nimono` · `ohitashi` · `sunomono` · `goma-ae` · `tamagoyaki`

This is the batch that closes the 一汁三菜 graph: its `pairs-with` lines point back at B2 and B3,
so a main opened after this batch shows its companions.

`goma-ae` at 5 rows / 3 operations and `ohitashi` at 6 / 4 are the smallest tables on the shelf and
the test of the ticket's claim that a small recipe is not a lesser one. **Neither gets padded to
look bigger.** If either falls below the floor it is rewritten to be honest at a larger size or
dropped, and the stretch file replaces it.

`sunomono` is the batch's two-branch tree; same fallback as `buri-daikon`.

**Verification:** checker over all six, then one commit.

## Step 5 — B5, rice bowls and 作り置き (5 files)

`oyakodon` · `gyudon` · `omurice` · `nikumiso` · `nanbanzuke`

`oyakodon`'s two egg pours are two operations and the second one is the dish. The tree is linear;
the risk is the label on the fourth step coming out as a fragment, so `step.4` is set by hand like
every other step.

**Verification:** checker over all five, then one commit.

## Step 6 — B6, the stretch files, and the whole-shelf pass

Only if B1–B5 are all `ok`: `asazuke` · `chahan`.

Then the checks that only make sense over the finished shelf:

1. **Every new file, in one run** — the acceptance criterion is worded as
   `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook`, so it is run that way
   and the full output is pasted into `progress.md`. This is the criterion's own command; it is not
   paraphrased.
2. **Counts, mechanically, not by eye:**
   ```sh
   grep -l 'counters: Japanese Home Cooking' recipes/*/*.cook | wc -l      # >= 22
   grep -L 'slack:' $(grep -l 'counters: Japanese Home Cooking' recipes/*/*.cook)   # must be empty
   grep -L 'aka:'   $(grep -l 'counters: Japanese Home Cooking' recipes/*/*.cook)   # must be empty
   ```
   plus the same for `title`, `category`, `tags`, `servings`.
3. **No dashi re-taught:** `grep -l 'katsuobushi\|kombu' <my files>` must return nothing but the
   files where kombu is genuinely an ingredient of the dish rather than of a stock — and if any
   does, it is a design violation, not a check to relax.
4. **Every timer named:** `grep -o '~{' <my files>` must return nothing. An unnamed timer is
   written `~{30%min}`; a named one is `~soak{30%min}`.
5. **Untouched-files proof:**
   ```sh
   git status --porcelain
   git diff --stat HEAD -- . ':!recipes'
   ```
   Both must show nothing of mine outside `recipes/**`, and nothing of mine staged or modified.
6. **`pairs-with` resolves:** `npm run recipes`. This is the only validator for the pairing graph.
   It parses the whole collection, so a failure is attributed to a path before it is believed; a
   failure in a sibling ticket's file is reported in `review.md` and not fixed.

## Testing strategy

There is nothing to unit-test: this ticket adds data, not code. The test surface is entirely the
existing harness, and it is used at three levels.

| Level | What it catches | When |
| --- | --- | --- |
| `check-recipes.mjs` per file | metadata missing, unknown counter, bad slack line, table too thin, unlabelled cell, tiling holes | on writing each file, before the batch |
| `check-recipes.mjs --labels` per batch | a label that is a sentence fragment rather than a cook's verb — the criterion's own wording | before each commit |
| `npm run recipes` once | dangling or self-referential `pairs-with`, duplicate slugs, homeless recipes | after B6 |

`npm run verify` (parse + tests + build) is **not** the gate for this ticket and is not run as one.
It would fail on a sibling ticket's half-written file and tell me nothing about mine. If it is run
at all it is run for information, and its result is attributed per path.

## What would make this blocked rather than passing

Recorded now so the Review disposition is decided against a standard set before the writing, not
after it:

- A ratio I cannot source for a dish I have written. Remedy: rewrite the dish without the claim, or
  drop it and promote a stretch file. Not a block.
- A file that cannot clear 3 rows × 2 operations honestly. Remedy: drop it; the roster has 4 files
  of margin. Not a block.
- `npm run recipes` failing on a path this ticket owns. **That is a block** — the pairing graph is
  the one thing per-file checking cannot see, and a dangling edge breaks the site build.
- `npm run recipes` failing on a sibling's path. Not a block; reported in `review.md` with the
  path, so the human reading it knows the whole-collection check has not been passed cleanly and
  why.
