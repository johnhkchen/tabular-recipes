# T-009-02 — Plan

Ordered steps, each one verifiable on its own. The order is not negotiable after step 4: the
before-dumps cannot be taken once the files have moved.

## Step 1 — Write `scripts/inline-step-labels.mjs`

The six units from `structure.md`. No writing to `recipes/` yet — `--write` exists but is not
passed.

**Verify:** `node scripts/inline-step-labels.mjs` over the whole collection.
Expect: 643 `move` lines totalling 2,771 labels, 21 `--` lines, 0 `SKIP`, `git status` on
`recipes/` clean. If any file skips, read it before writing anything.

**Commit:** `lisa commit-ticket --include scripts/inline-step-labels.mjs`.

## Step 2 — Take the before-evidence

All of it, into `.lisa/attempts/T-009-02/1/work/before/`.

```
node scripts/inline-step-labels.mjs --dump             > before/labels.txt
node scripts/check-recipes.mjs --labels                > before/check-labels.txt
npm run recipes && cp src/generated/recipes.json         before/recipes.json
grep -rc '^$' recipes --include='*.cook' | …           > before/blank-lines.txt
grep -rhc '^>>[ \t]*step'  …                           > before/step-line-count.txt
```

**Verify:** `before/labels.txt` has one line per step of all 664 files and no empty label field
where the file has a `>> step.N:` for that step. `before/check-labels.txt` is 186,525 bytes, the
figure T-009-01 recorded, or the difference is explained before going on.

## Step 3 — Migrate

```
node scripts/inline-step-labels.mjs --write
```

**Verify:** the tail says 643 moved / 2,771 labels / 0 skipped, and `git status --short recipes`
lists exactly 643 modified files and nothing untracked.

## Step 4 — Take the after-evidence and diff

Same five commands into `after/`. Then, in order of how much each one proves:

1. `diff before/labels.txt after/labels.txt` — **empty, or the ticket is not done.** This is the
   primary criterion: label, derived duration and hands-on split, every step, every recipe.
2. `cmp before/recipes.json after/recipes.json` — byte-identical. The build's own artifact.
3. `cmp before/check-labels.txt after/check-labels.txt` — byte-identical. The third witness.
4. Blank lines: the two counts equal, and equal to 4,130.
5. `git diff -U0 -- recipes | grep '^[+-]' | grep -v '^\(+++\|---\)' | grep -v '>> step'` —
   **no output.** Every added and removed line across all 643 files is a `>> step` line.
6. `git diff -- recipes` filtered to `^+` and `^-`: 2,771 removals of `>> step.N:` and 2,771
   additions of `>> step:`.
7. One representative file diff, pasted whole: `new-england-clam-chowder.cook` — six labels, a
   label on step 1, and it is the file T-009-01 used, so the two tickets' evidence lines up.

Any of 1–6 failing stops the work here and the files are reverted, not patched.

**Commit:** `lisa commit-ticket --include <each of the 643 paths>`.

## Step 5 — Idempotence

```
node scripts/inline-step-labels.mjs           # dry run
node scripts/inline-step-labels.mjs --write   # again
git status --short recipes
```

**Verify:** the dry run reports 664 files with nothing to do, the second `--write` writes nothing,
and `git status` is clean against the step-4 commit. Both outputs go in the evidence.

## Step 6 — `npm run verify`

Full run: `check-recipes.mjs` → `parse-recipes.mjs` → `vitest run` → `astro build`.

**Verify:** exit 0. The checker's per-file output is compared with `before/check-labels.txt`'s
`ok` lines — 664 files draw a table, same rows × cols.

**Hazard, from `research.md`:** another ticket has `src/pages/search.json.test.ts` deleted and
`_search.json.test.ts` added in the working tree. If the suite fails, the failure is attributed
before it is reported: a failing test that names a file this ticket did not touch, and that fails
identically with `recipes/` reverted, is not this ticket's. The check is
`git stash` the recipes, re-run, compare — read-only with respect to the finding.

## Step 7 — The two lists the criteria ask for

**7a. Unmigrated labels.** Every `>> step.N:` line not moved, by slug and number, with the reason.
Expected empty; if it is empty, the artifact says so explicitly and states the count reached
(2,771 of 2,771, against a floor of 2,700) rather than omitting the section.

**7b. Labels on a step they do not describe.** The screen from `research.md` re-run over the
*pre-migration* files — 14 candidates — then each one read by hand against its file. For each
survivor: slug, the number as written, the step it landed on, and the step it reads like it
wanted. Nothing is corrected. Candidates the hand-read clears are listed too, with why, because a
list of 14 that silently became a list of 2 is not reviewable.

This is the one step whose output cannot be produced by a command, so it gets the most words in
the review.

## Step 8 — `review.md` and `review-disposition.json`

Then `lisa check-disposition T-009-02`, and fix whatever it reports.

## Testing strategy

**No new test file.** `src/lib/step-labels.test.ts` has 27 tests over the reader, and this ticket
may not modify `src/`. The script's correctness is not asserted by a unit test; it is asserted by
the per-file verification gate that runs on every file on every run, which is a stronger check
than any test I would write — it compares the build's answer before the edit with the build's
answer after it, on real files, 643 times.

What that leaves untested, said plainly rather than papered over:

- **The refusal paths.** No file in the collection triggers any of the six, so all six ship
  unexercised by real data. They are exercised deliberately instead: three synthetic files (an
  out-of-range N, a duplicate N, an empty label) are run through the script in a scratch directory
  and their refusal messages pasted into the evidence. Synthetic, and named as synthetic.
- **The local `stepStarts()` scan against cooklang's harder constructs.** The collection has zero
  comments, sections, text blocks and multi-line steps (`research.md`). The verification gate
  turns a scan bug into a refused file rather than a wrong page, which is the mitigation; it is
  not coverage and is not claimed as coverage.
- **`astro build` rendering a migrated page.** It renders 643 of them after step 6, which is the
  first time the inline form reaches a real page at all — T-009-01 shipped it with zero users.

## What would make this ticket fail

Stated up front so the review cannot quietly move the goalposts:

- `diff before/labels.txt after/labels.txt` non-empty.
- Fewer than 2,700 lines migrated.
- Any added or removed line in `recipes/` that is not a `>> step` line.
- The blank-line count changing.
- `npm run verify` failing for a reason this ticket caused.

Each is checked by a command whose output goes in the artifact, and none of them is checked by a
sentence.
