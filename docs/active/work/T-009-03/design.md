# T-009-03 — Design

Four decisions. Only the first two are interesting; the rest follow from them.

---

## Decision 1 — where the rejection lives

The ticket says *"make `scripts/check-recipes.mjs` fail on a `>> step.N:` line"*. That names the
observable behaviour, not the file the regex goes in.

### Option A — a source regex in `check-recipes.mjs`

Add, beside the `REQUIRED_META` scan at line 139, a `/^>>\s*step\.\d+\s*:/mi` test over the raw
source and push a problem.

- **For:** four lines. Reads exactly like the criterion.
- **Against:** it only fails the *checker*. `npm run recipes` (`parse-recipes.mjs`) would build
  pages from a numbered file without complaint, because `normalise()` — with the numbered reader
  removed — silently gives every numbered step a **derived** label instead. **The label the author
  wrote would vanish from the page with nothing said.** That is the exact failure mode S-009 exists
  to kill, reintroduced in a new place.
- **Against:** untestable in vitest except by shelling out to the checker. Criterion *"tests cover:
  a `step.N` line fails the check"* would be one subprocess test and no unit test.

### Option B — a problem from `readStepLabels()` in `src/lib/step-labels.ts` ✅

Match the numbered line where the inline form is already read, and emit one `problems` entry per
occurrence. Research §5: `problems` → `normalise().stepLabelProblems` → **both** `check-recipes.mjs`
(FAIL, exit 1) and `parse-recipes.mjs` (throws), and the function is pure, so vitest tests it
directly.

- **For:** one code path, two enforcement points, no possible page built from a numbered file.
- **For:** the module is already named *"the label that sits on the line above its step"* and
  already owns `NUMBERED` (line 55). The regex does not move; only what happens on a match does.
- **For:** the message can quote the label text back, which is what the ticket asks for, because
  the regex is right there with the line in hand.
- **Cost:** the fast path at line 139 must widen — a file writing **only** the numbered form
  currently returns early and is never scanned (Research §3). This is not optional under any
  option; Option A hides the need for it rather than removing it.

**Chosen: B.** A checker-only rejection would leave the build willing to publish a page whose label
was silently dropped, and that is a worse defect than the one being removed.

`check-recipes.mjs` still *fails* on the line — it is the process that exits 1 and prints the
message — so the criterion is met literally as well as in spirit.

---

## Decision 2 — what happens to the fixer

Research §4: `scripts/inline-step-labels.mjs` resolves N through `normalise()`'s numbered reader.
Removing that reader breaks it, and Decision 1 then makes the run loop skip every file it is meant
to repair. The checker's message is required to name this script, so **a broken fixer is not an
acceptable outcome of this ticket**.

### Option A — leave it broken, drop the name from the message

Rejected outright. *"Point them at the fixer by name. A checker that says run this to fix it is
worth more than one that only says no"* is a written requirement, and pointing at a script that
refuses every file is worse than saying nothing.

### Option B — delete the script

It has done its job; 2,771 labels moved and nothing is left. But the ticket wants the message to
name a fixer, and T-009-02's handover explicitly keeps it for the hand-written numbered label
*"the story predicts someone will add out of habit"*. Rejected.

### Option C — the script resolves N itself, from its own `stepStarts()`

It already has that scan. Change `plan()` to take the label text off the line and the target off
`stepStarts()[n - 1]`, and drop the `labelOverride` comparison.

- **Against:** it discards the script's whole safety argument. Today the *build* says which step
  wears which label and the script only proposes a line; under C the script's own unverified copy
  of the parser's rule decides both where the label came from and where it goes.

### Option D — the script resolves N from the build's own scan ✅

`scanSteps()` in `src/lib/step-labels.ts` computes the line each step block starts on and then
throws the positions away, returning only `stepCount`. Return them instead — `stepLines: number[]`,
with `stepCount` becoming `stepLines.length` at its one call site. The fixer deletes its
`stepStarts()` copy and reads `stepLines`.

What still holds it up after the change:

| Gate | Where | What it catches |
| --- | --- | --- |
| the scan matches the parser | `normalise.mjs:214`, and the fixer's own `stepLines.length !== recipe.steps.length` | a cooklang construct the scan misreads |
| the label binds where it was aimed | `verify()` gate 1: `readStepLabels(migrated).labels` must equal the intended map | a bad insertion, a lost blank line, a label that lands on the wrong step |
| nothing else moved | `verify()` gates 2 and 3, unchanged | everything else |

**This is weaker than what T-009-02 shipped and it is worth being plain about it.** Before: the
build resolved the label and the build verified it, two different code paths. After: one scan
resolves it and the same scan verifies it, held against the parser's step *count*. The count check
is what makes it not circular — a scan that finds the wrong line generally finds the wrong *number*
of lines too, and normalise refuses the file. A scan that miscounts by a compensating error would
slip through. Nothing in the collection exercises that (664 files, zero comments, sections, text
blocks or multi-line steps — T-009-02 `research.md`), so it is a theoretical hole, and it is
recorded rather than papered over.

**Chosen: D**, because it also closes T-009-02's open concern #3 — the two copies of the step scan
become one — and a single scan that can be wrong is safer than two that can disagree.

### How the fixer knows which problems are its own business

`readStepLabels()` returns `problems` (all of them, line-ordered, numbered rejections included) and
a new `numbered: {line, n, text}[]` of the structured hits. The invariant, documented on the
interface: **exactly one `problems` entry per `numbered` entry.** So the fixer's skip test is
arithmetic, not string-sniffing:

```js
if (problems.length > numbered.length) skip(rel, problems.join('; '));
```

More than one problem per numbered line means an inline label that does not bind — a file to leave
alone. Rejected alternative: exporting an `isNumberedProblem(text)` predicate, which is a
`String.includes` on a message that will get reworded.

---

## Decision 3 — the message

Requirements: fail; show *the same label written the new way*; name the fixer. It is prefixed with
`line N: ` by the existing sort-and-format at `step-labels.ts:239`, and rendered by the checker as
`       - <message>`, one line.

```
line 6: >> step.2: is the numbered form, and it is gone — the label goes on the line directly
above the step it names. Write ">> step: fry the aromatics" on the line above step 2, or run
node scripts/inline-step-labels.mjs --write and it will move every one of them for you.
```

Three properties, each deliberate:

- **It quotes the author's own label back at them, rewritten.** Not a schematic `>> step: <label>`.
  Somebody who typed the line from muscle memory can copy the corrected text out of the terminal.
- **It says *the line above step N*.** The number the author already wrote is the fastest available
  description of which step they meant, so it is used to locate the step — and then thrown away,
  which is the point.
- **It names the script and its flag.** `--write` and not a bare invocation, because the bare form
  is a dry run and a reader who types it and sees nothing change is worse off than before.

An empty label (`>> step.2:`) degrades to `Write ">> step:" with the label after the colon` — the
"same label written the new way" clause has nothing to show, and inventing a placeholder would be
noise.

One message per numbered line rather than one per file: a file with four of them is four lines of
output, in line order, interleaved with any other step-label problem. That is how every other
problem in this module behaves.

## Decision 4 — retiring the "both forms" check

`step-labels.ts:224–231` reports a file writing both forms. With Decision 1, every numbered line is
already its own error, so a mixed file would print the rejection *and* a "you wrote both" note
saying the same thing twice.

**Removed.** After this ticket there is one form, so "both forms" is not a state the reader needs a
name for. The two tests asserting it (`step-labels.test.ts:149` and `:282`) are rewritten to assert
the numbered rejection instead — same files, same failure, one message.

A knock-on the ticket does not mention and which falls out for free: the fixer can now migrate a
file that mixes the forms, because the numbered line is a normal thing to move and the existing
inline labels are simply carried through `verify()`'s expected map. Previously such a file was
refused by everything. Gate 3 changes from *count the inline lines in the output* to *count the
ones the run added* to allow it.

---

## What is deliberately not done

- **No `.cook` file is touched.** The hand-migration branch of the criteria is closed by
  measurement, not by work: `grep -c '^>> *step\.'` over `recipes/**` is 0 (Research §1). Criterion
  8 — every operation label unchanged — is then met by the strongest available means, which is that
  the inputs did not change at all.
- **`docs/gaps/voice.md` is left alone.** Five `step.N` mentions, outside this ticket's ownership
  list, and it is a dated measurement page rather than instruction.
- **`src/lib/step-labels.ts`'s header paragraph (line 9) keeps naming the older form.** It explains
  why the inline form exists at all. A comment describing a syntax that no longer exists is worse
  than no comment; a comment describing a syntax that *used* to exist, in a file whose shape is a
  direct consequence of that history, is the reason the code looks the way it does. The wording is
  adjusted to past tense so nobody reads it as a live alternative.
- **`>> step.N:` is not rewritten to something the parser rejects.** Cooklang will still hoist the
  line into `raw_metadata.map`; it is this repo that refuses it. Nothing can be done about that
  from here, and it does not matter: the file fails before a page exists.

## Risk register

| Risk | Mitigation |
| --- | --- |
| Widening the fast path scans 664 files instead of 643 | 21 files with no label at all now get one regex test each. Immeasurable; `verify` timing is compared before and after anyway. |
| Removing `delete metadata[/^step\.\d+$/]` leaks a `step.1` key into `recipe.metadata` | Unreachable: the file fails in `check` and throws in `recipes` before any page is built. Confirmed by test rather than by argument. |
| voice.md's argument damaged by find-and-replace | Every edit is made by hand, and the review pastes a diff filtered to the changed lines so the numbers are visible as unchanged. `git diff --stat` plus a word-level diff. |
| The fixer's remaining safety story is weaker | Stated above and repeated in `review.md`. Not hidden. |
