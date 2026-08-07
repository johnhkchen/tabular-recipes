# T-009-03 — Plan

Six steps, four commits. Every step names the command that says it worked.

`node` is not on this shell's default PATH. Every command below is run with
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` first.

---

## Step 0 — the baseline, already taken

Done before Research was written, on the tree as T-009-02 left it:

| Artifact | What it is |
| --- | --- |
| `before/labels.txt` | `node scripts/inline-step-labels.mjs --dump`, 3,466 lines |
| `before/recipes.json` | `src/generated/recipes.json`, 3,956,883 bytes |
| `before/verify.txt` | `npm run verify`, exit 0 |

These are the *end of T-009-02* that criterion 8 compares against. Taken first because a baseline
taken after an edit proves nothing.

---

## Step 1 — the reader rejects the numbered form

**Files:** `src/lib/step-labels.ts`, `scripts/normalise.mjs`, `src/lib/step-labels.test.ts`

One unit, because `stepCount` → `stepLines` breaks `normalise.mjs` the moment it lands.

1. `step-labels.ts`: `NUMBERED` gains the text capture; add `ANY_NUMBERED`; widen the fast path;
   add `NumberedLabel`, `stepLines`, `numbered` to the interface; add `numberedRefusal()`; add the
   `NUMBERED` branch to the main loop; delete the both-forms block and `firstInline`.
2. `normalise.mjs`: drop `?? metadata['step.' + (index + 1)]`; drop the `/^step\.\d+$/` delete;
   `stepCount` → `stepLines.length`; rewrite the two comments that describe the two-forms world.
3. `step-labels.test.ts`: the four rewrites and four unit additions from `structure.md` §8. The
   fifth addition (checker-level) waits for step 2 only in the sense that it is easier to read
   beside the other checker tests — it can land here, and does.

**Verify**

```
npx vitest run src/lib/step-labels.test.ts     # green, including the new describe block
npx vitest run                                 # 935+ tests, nothing else disturbed
node scripts/check-recipes.mjs                 # all 664 file(s) draw a table
```

Then the thing this step exists for, on a throwaway file outside `recipes/`:

```
node scripts/check-recipes.mjs /tmp/…/numbered.cook   # exit 1, message pasted into progress.md
```

**Commit:** `lisa commit-ticket --include src/lib/step-labels.ts --include
src/lib/step-labels.test.ts --include scripts/normalise.mjs`

**Risk:** the widened fast path makes `readStepLabels()` scan 21 more files. If `npm run check`
slows measurably, say so; it is one regex per file and it will not.

---

## Step 2 — the fixer stands on its own

**File:** `scripts/inline-step-labels.mjs`

Delete `stepStarts()` and the local `NUMBERED`; `plan()` takes the reading; delete the
`labelOverride` comparison; `verify()` gate 1 rebuilt from `moves` plus the labels already inline;
gate 3 becomes a delta; the run loop's skip test becomes `problems.length > numbered.length`;
header comment rewritten to the true safety story.

**Verify** — the collection first, which must be a no-op:

```
node scripts/inline-step-labels.mjs
  → 0 file(s) would move, 0 label(s). 664 file(s) had none. 0 file(s) skipped.
  → exit 0, git status --porcelain recipes empty
```

Then a real round-trip, on a copy of a real recipe in a temp directory — not in `recipes/`:

1. take `recipes/soups/new-england-clam-chowder.cook`, strip its inline labels, re-add three of
   them as `>> step.N:` in the metadata block;
2. `node scripts/check-recipes.mjs <file>` → exit 1, three rejections;
3. `node scripts/inline-step-labels.mjs --write <file>` → 1 file moved, 3 labels;
4. `node scripts/check-recipes.mjs --labels <file>` → exit 0, and the three labels appear in the
   same cells they named.

Step 4 is the claim the message makes when it says *run this to fix it*, and it is the only way to
find out whether the fixer's number resolution survived losing `normalise()`.

A second round-trip on a **mixed** file (one numbered line, one inline label) — new behaviour, so
it gets its own run.

**Commit:** `lisa commit-ticket --include scripts/inline-step-labels.mjs`

**Risk:** this is the step where a wrong `stepLines` index would show up as a label landing on the
wrong step. The round-trip above is the detector, and `verify()`'s gate 1 is what would refuse the
file rather than write it.

---

## Step 3 — the five prose comments

**Files:** `src/lib/tree.ts`, `src/lib/time.ts`, `src/lib/time.test.ts`,
`scripts/check-recipes.mjs`

Comment text only. Nothing executable moves.

**Verify**

```
git diff --stat        # 4 files, ~5 insertions, ~5 deletions
git diff -U0 | grep -E '^[+-]' | grep -vE '^[+-]\s*(\*|//|/\*)'   # empty: only comment lines
npx vitest run         # unchanged count, green
```

**Commit:** `lisa commit-ticket --include src/lib/tree.ts --include src/lib/time.ts --include
src/lib/time.test.ts --include scripts/check-recipes.mjs`

---

## Step 4 — the documentation

**Files:** `README.md`, `docs/knowledge/voice.md`, `docs/gaps/README.md`

Three edits with different shapes, one commit, because they are one act: the docs stop teaching a
syntax that no longer exists.

- **README rule 5** — replace the two "older form" sentences.
- **voice.md** — the eight sites in `structure.md` §6, by hand, one at a time, plus the added
  paragraph in *What changed, and when*.
- **docs/gaps/README.md** — the bullet out of *Recorded and not done*; a new
  `## Recorded and closed` section with the two entries.

**Verify** — the criterion is *"a diff limited to the syntax"*, so it is measured, not asserted:

```
grep -c 'step\.[N0-9]' docs/knowledge/voice.md README.md      # 0 and 0
git diff --numstat -- docs/knowledge/voice.md                 # 8 changed lines + 1 added para
git diff --word-diff=porcelain -- docs/knowledge/voice.md     # every changed word is the syntax
```

And the argument, checked by looking for its numbers rather than by reading:

```
grep -c '172,003\|278,833\|2782\|637\|472\|250\|132\|55\|115\|72\|3077\|304' docs/knowledge/voice.md
```

compared before and after. Identical counts, pasted into `progress.md`.

**Commit:** `lisa commit-ticket --include README.md --include docs/knowledge/voice.md --include
docs/gaps/README.md`

---

## Step 5 — the whole-collection proof

No edits. This is criterion 8 and criterion *"npm run verify passes"*.

```
npm run verify                                     # exit 0
node scripts/inline-step-labels.mjs --dump > after/labels.txt
diff before/labels.txt after/labels.txt ; echo $?  # empty, 0
cmp before/recipes.json src/generated/recipes.json # identical
grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l   # 0
git status --porcelain                             # no ticket-owned file left over
```

`recipes/**` is never edited by this ticket, so the dump diff should be empty for the strongest
possible reason. It is still run, because "I did not touch it" is a claim and `diff` is evidence —
and because a change in `normalise.mjs` could move a label without any recipe changing, which is
precisely the accident this criterion is written to catch.

---

## Testing strategy

**Unit, in `src/lib/step-labels.test.ts`** — the rejection itself: that a numbered line produces a
problem, at the right line, with the label rewritten and the fixer named; that nothing binds by
number; that an empty label degrades; that four of them come out in line order. Pure function, no
parser, fast.

**Subprocess, in the same file's `describe('the checker, run for real')`** — that
`check-recipes.mjs` exits 1 on a numbered file and prints the message. This is the only honest test
of "the check fails", because failing is a property of a process, and the WASM parser does not run
inside Vite. The pattern already exists in this file and in `washing-up.test.ts`; fixtures go to a
temp directory and never to `recipes/`.

**Regression, by the existing suite** — "the inline form still works everywhere" is already
covered by 23 tests in this file, four of which run the real checker over real fixtures, plus 664
real files through `npm run check` and 688 pages through `astro build`. Nothing new is needed for
that half; what is needed is that none of it changes, which `npm run verify` says.

**By hand, recorded in `progress.md`** — the two fixer round-trips (Step 2). They cannot be unit
tests without adding a test file for a migration script that the criteria do not ask for and that
T-009-02 deliberately did not write; they are run, and their output is pasted.

**Not tested, and named as such in `review.md`:** the fixer's resolve-and-verify path shares one
scan (`design.md` §2, Option D), so a scan that miscounts by a compensating error is not caught by
anything. No file in the collection can reach it.

---

## What would make this ticket stop

Only one thing, and it is already known not to have happened: a `.cook` file still using
`>> step.N:`. The count is 0 (Research §1), so the ticket's *"migrate by hand or explain why"*
fork closes on the third branch — nothing to migrate — and that is stated with the count rather
than left silent.

If Step 2's round-trip cannot be made to work, the fallback is to keep the numbered reader inside
the fixer alone (a private resolver, not `normalise()`) rather than to ship a message naming a
broken script. That would still satisfy every criterion, since `scripts/normalise.mjs` is the file
the criterion names. It is a fallback and not the plan.
