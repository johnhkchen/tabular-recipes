# T-009-01 — Progress

Four commits, in the order the plan set. Every step's verification ran before the commit that
followed it.

| # | Commit | Paths | State |
| --- | --- | --- | --- |
| 1 | `9faefa3` Read the label that sits above its step | `src/lib/step-labels.ts`, `src/lib/step-labels.test.ts` | done |
| 2 | `efe3d54` Bind the label to the step under it | `scripts/normalise.mjs`, `scripts/parse-recipes.mjs`, `scripts/check-recipes.mjs` | done |
| 3 | `e16bb4e` Run the checker at both forms of the same recipe | `src/lib/step-labels.test.ts` | done |
| 4 | `a685055` Teach the label that sits above its step | `README.md` | done |

## Step 1 — the reader

`readStepLabels()` written as designed: fast path, blank-to-`--`, block scan, the seven binding
rules. 20 unit tests, green on the second run.

**Deviation, and the design was wrong on this one.** The plan had "a label with a blank line under
it" and "a label with nothing under it" as separate lookups at the very next line. A file ends
with a newline, so a label written as the last line of a file has a blank line under it *and*
nothing under it, and it drew the wrong message. `below()` now walks past blanks and reports which
it found: nothing left in the file → *has nothing under it*; a real line after a gap → *has a
blank line under it*. The test for the end-of-file case is written the way an author's file
actually ends, trailing newline included.

## Step 2 — the wiring

`normalise()` calls the reader, hands the blanked copy to the parser, and reads
`labels.get(index) ?? metadata['step.' + (index + 1)]`. The cross-check against the parser's own
step count is in and fires only for a file that uses the inline form. `parse-recipes.mjs` throws;
`check-recipes.mjs` prints.

One extra edit, flagged in structure §4 and made: the "operation cell(s) came out with no label"
message told authors to reach for `>> step.N:`. It now names the inline form, which is what
`README.md` calls the one to use.

**Verified before committing:** `npm run check` over all 664 files, diffed against the pre-ticket
baseline — identical, line for line (`check-before.txt` vs `check-after.txt`). Then the sweep and
the prep-step demonstration below.

## Step 3 — the checker, run for real

Seven more tests, through `execFileSync` on `check-recipes.mjs`, fixtures in a temp directory.
27 tests in the file, 640 ms — the six child processes are most of it, which is within the budget
the plan set (~6 s).

**Deviation:** the plan expected `fry in a Dutch oven` as a derived label; `cleanLabel()` actually
produces `fry and in in a Dutch oven` for that step. The test asserts what the code does, with a
comment pointing at `cleanLabel()`.

## Step 4 — README

Rule 5 rewritten: the inline form with a worked example, what it binds to, what happens when it
does not bind, that a prep step can carry one, and the numbered form named as older and still
working. It is not called removed.

## Evidence gathered (not committed — it is in this work directory)

- **`labels-numbered.txt` / `labels-inline.txt`** — every one of the 664 files, and a copy of the
  collection with all 643 numbered files rewritten into the inline form, both run through
  `check-recipes.mjs --labels`. `cmp` says byte-identical. The rewriter used for this is
  independent of `src/lib/step-labels.ts`, so the two trees agreeing is not the scanner agreeing
  with itself. `recipes/` was never written to.
- **`prep-step-demo.md`** — one real file, `fudgy-cocoa-brownies.cook`, labelled three ways.
- **`check-before.txt` / `check-after.txt`** — the whole collection through the checker, before
  and after.
- **`verify-before.txt` / `verify-after.txt`** — `npm run verify`, exit 0 both times.

## Note on the working tree

`src/lib/zz-aisle-dump.test.ts`, T-007-05's temporary scratch probe, was present and failing when
this attempt started (research §8) and its owner deleted it partway through, which is why the
before and after test-file counts are both 11. Nothing in this ticket touched it.
