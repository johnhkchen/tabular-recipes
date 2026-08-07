# T-009-02 — Progress

All eight steps of `plan.md` executed in order. No deviations from the plan.

**2,771 of 2,771 labels moved, in 643 of 643 files. Nothing was skipped, nothing was corrected,
and the label dump is byte-identical before and after.**

---

## Step 1 — the script

`scripts/inline-step-labels.mjs`, 332 lines. Dry run over the whole collection:

```
$ node scripts/inline-step-labels.mjs
  move recipes/bars-and-brownies/blondies.cook  4 label(s)
  …
  --   recipes/soups/dashi.cook  no >> step.N: line
  …
643 file(s) would move, 2771 label(s). 21 file(s) had none. 0 file(s) skipped.

dry run — pass --write to move them
```

`git status --porcelain recipes` → 0 lines. The dry run writes nothing.

Committed as `993e2b8` — *Move a numbered label onto the line above its step*.

### The call the criteria ask to see

The script never counts steps. Two calls to the build's own code bracket the edit
(`scripts/inline-step-labels.mjs`):

```js
// which step wears which label — the build's answer, prose steps counted, bugs included
const recipe = normalise(source, { slug: target.slug, path: rel, folder: target.folder });
const written = recipe.steps[move.n - 1]?.labelOverride;
…
// where the moved label binds — the build's own reader, on the candidate output
const { labels: landed, problems } = readStepLabels(migrated);
for (const [index, text] of wanted) {
  if (landed.get(index) !== text) return `step ${index + 1}'s label would become …`;
}
```

`normalise()` resolves `metadata['step.' + (index + 1)]` at line 145 of `scripts/normalise.mjs`,
which is 1-based over every step block **including prose steps** — the undocumented behaviour in
`docs/gaps/README.md:260`. Reproducing it is not a choice the codemod makes; it is the only
number the codemod ever sees.

The gate ran on all 643 files and passed on all 643. A file whose local line scan had been wrong
would have been refused and printed, not written.

## Step 2 — before-evidence

Into `before/`: `labels.txt` (the dump), `check-labels.txt`, `recipes.json`, `counts.txt`.

```
blank lines: 3466
numbered step lines: 2771
inline step lines: 0
```

## Step 3 — the migration

```
$ node scripts/inline-step-labels.mjs --write
643 file(s) moved, 2771 label(s). 21 file(s) had none. 0 file(s) skipped.
```

`git status --porcelain recipes` → 643 modified, 0 added, 0 deleted, 0 untracked.

Committed as `9350854` — *Move two thousand seven hundred and seventy-one labels to their steps*:
`643 files changed, 2771 insertions(+), 2771 deletions(-)`.

## Step 4 — the proof

### 1. The label dump, before and after — **the ticket's primary criterion**

```
$ node scripts/inline-step-labels.mjs --dump > before/labels.txt   # taken before --write
$ node scripts/inline-step-labels.mjs --dump > after/labels.txt    # taken after
$ diff before/labels.txt after/labels.txt
$ echo $?
0
```

**Empty.** 3,466 lines each — one per step of all 664 files — carrying slug, 1-based step index,
`op`/`prose`, the step's total timed minutes, its hands-on minutes, its unattended minutes, and the
label exactly as the cell renders it. Not a summary: the command and its output are above, and the
two files are in this directory.

The clock is in the same diff for the reason the ticket gives — `src/lib/time.ts` reads the
operation label's own words to decide whether a timer is time you spend or time you wait out, so a
label that moved a step would move a number. None moved.

### 2. `src/generated/recipes.json`, byte for byte

```
$ npm run recipes && cmp before/recipes.json after/recipes.json
$ echo $?
0
```

3,956,883 bytes, identical. The build's own artifact, over every field it derives —
ingredients, refs, timers and their readings, washing-up, slack, variants, pairings — not just
the ones this ticket looked at.

### 3. `check-recipes.mjs --labels`, the fingerprint T-009-01 used

```
$ cmp before/check-labels.txt after/check-labels.txt
$ echo $?
0
```

177,893 bytes, identical, `all 664 file(s) draw a table.` on both sides.

*(T-009-01 recorded 186,525 bytes for this file. That run was over a copied tree of a
664-and-a-sweep collection, six files ago; the number that matters here is that my own before and
after agree, which they do to the byte.)*

### 4. Blank lines — the paragraph structure

```
$ grep -rc '^$' recipes --include='*.cook' | awk -F: '{s+=$2} END {print s}'
3466      # before
3466      # after
```

Unchanged. The codemod removes k non-blank lines from the metadata block and inserts k non-blank
lines in the body; it never inserts, removes or merges a blank line. **Blank lines are how steps
are separated, and a file whose paragraph structure changed would have changed its steps
whatever its labels said** — so this count, not the label diff, is what says the steps are the
same steps.

### 5. Nothing but `>> step` lines changed, across all 643 files

```
$ git diff -U0 -- recipes | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' \
    | grep -vE '^[+-]>>[ \t]*step[.: \t]'
$ wc -l
0
```

**No output.** Every added and removed line in the whole migration is a `>> step` line.

```
$ git diff -U0 -- recipes | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' \
    | sed -E 's/^([+-])>>.*step\.[0-9]+.*/\1 >> step.N:/; s/^([+-])>>.*step[ \t]*:.*/\1 >> step:/' \
    | sort | uniq -c
2771 - >> step.N:
2771 + >> step:
```

2,771 out, 2,771 in. And in the files themselves:

```
numbered step lines: 2771 -> 0
inline step lines:      0 -> 2771
```

### 6. One representative file, whole

`recipes/soups/new-england-clam-chowder.cook` — six labels, one of them on the first step, and the
file T-009-01 built its own evidence on.

```diff
 >> slack: unforgiving — a boiled chowder splits and the clams go to rubber, …
->> step.1: render in a Dutch oven
->> step.2: sweat 8 min
->> step.3: stir in flour 2 min
->> step.4: simmer 15 min
->> step.5: warm through, no boil
->> step.6: season
 
+>> step: render in a Dutch oven
 Render @salt pork{3%oz}(85 g; diced, or bacon) in a #Dutch oven{} until crisp.
 
+>> step: sweat 8 min
 Sweat @&(~1)pork{} for ~{8%min} with @yellow onion{1%large}, @celery{2%ribs}, and @thyme{2%sprigs}.
 
+>> step: stir in flour 2 min
 Cook @&(~1)base{} for ~{2%min} with @all-purpose flour{3%Tbs}(25 g).
 
+>> step: simmer 15 min
 Simmer @&(~1)base{} for ~{15%min} with @Yukon Gold potatoes{1 1/2%lb}(700 g; cubed), …
 
+>> step: warm through, no boil
 Warm @&(~1)chowder{} through without boiling with @chopped clams{2%cups}(with their liquor) …
 
+>> step: season
 Season @&(~1)chowder{} with @kosher salt{1%tsp} and @black pepper{1/2%tsp}.
```

Every label on the line directly above its step, no blank line between, one line per label. The
blank line the metadata block lost is the one the diff shows as context, not as a change — the
block ends where it ended.

**The first-step case the ticket asks about resolves cleanly, and not by argument.** The label for
step 1 sits *after* the blank line under the metadata block. `readStepLabels()` blanks it to `--`,
which `classify()` treats as transparent, so `scanSteps()` still opens the block at `Render`;
`above()` skips the comment and finds a metadata line, so the inside-a-step rule does not fire;
`below()` finds the step with no blank crossed. The binding gate confirmed that on this file and
on the other 642 — it is checked per file, so the shape was never ambiguous enough to need a guess.

## Step 5 — idempotence

```
$ node scripts/inline-step-labels.mjs        # dry run, after the migration
0 file(s) would move, 0 label(s). 664 file(s) had none. 0 file(s) skipped.

$ node scripts/inline-step-labels.mjs --write # again
0 file(s) moved, 0 label(s). 664 file(s) had none. 0 file(s) skipped.

$ git status --porcelain recipes
(0 lines)
```

## Step 6 — `npm run verify`

```
all 664 file(s) draw a table.
parsed 664 recipe(s) in 27 categories -> src/generated/recipes.json
 Test Files  12 passed (12)
      Tests  935 passed (935)
[build] 688 page(s) built in 649ms
exit 0
```

Exit 0, so the working-tree hazard from `research.md` (another ticket's `search.json.test.ts`
rename) did not have to be told apart from anything — nothing failed.

This is also the first time the inline form has reached a real page: T-009-01 shipped the reader
with zero production users, and 643 of the 688 pages now render through it.

## Step 7a — labels not migrated

**None.** 2,771 of 2,771, against the ticket's floor of 2,700. The list T-009-03 depends on is
empty, and that is a result rather than an omission: `research.md` measured beforehand that no
`step.N` in the collection is out of range, below 1, duplicated within a file, empty, or written
below the first step, and the run confirmed it by refusing nothing.

The 21 files that carry no `>> step.N:` line at all are untouched and were never candidates.
*(The ticket says 15 of 658. Six files have been added since it was written, none using the
numbered form; the 643 / 2,771 figures every criterion is stated against are exact.)*

### The refusal paths, exercised on purpose

Since the collection refuses nothing, all six refusal paths would otherwise ship unexercised. Four
synthetic files, run in a scratch directory — **synthetic, and named as synthetic**:

```
  SKIP out-of-range.cook
       - line 6: >> step.9: names step 9 and this file has 2 step(s) — move it by hand, or fix the number
  SKIP duplicate.cook
       - line 6: >> step.2: is written twice (also line 5) — only the last one reaches the page, so say which one you meant
  SKIP empty.cook
       - line 5: >> step.1: says nothing — write the label after the colon
  SKIP mixed.cook
       - line 9: this file writes both >> step: and >> step.1: (line 5) — use one or the other, …

0 file(s) would move, 0 label(s). 0 file(s) had none. 4 file(s) skipped.
exit 1
```

Each is left on disk untouched, printed with a reason addressed to whoever has to fix it, repeated
in the tail list, and the run exits 1. Full output in `refusals.txt`.

## Step 7b — labels on a step they do not describe

**None found.** The screen produced 14 candidates; all 14 were read against their files by hand and
all 14 are false positives of the metric. Written up in full in `review.md`, with every candidate
listed and cleared individually rather than a count that shrank quietly.

## Deviations from the plan

None. One thing the plan did not anticipate: the first `lisa commit-ticket` for the migration was
invoked with a word-split path list and did not commit — no partial state, the log was unchanged
and `git status` still showed 643 modified. Re-invoked with the paths read line by line
(1,286 arguments) and it landed as `9350854`.
