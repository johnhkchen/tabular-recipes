# T-009-01 — Structure

Six files: two new, four modified. No file is deleted. No `.cook` file is touched.

```
src/lib/step-labels.ts        NEW   the reader — pure, no parser, no filesystem
src/lib/step-labels.test.ts   NEW   its unit tests, plus the checker run for real
scripts/normalise.mjs         MOD   calls the reader; one `??` in front of an existing lookup
scripts/parse-recipes.mjs     MOD   the build throws on a label that does not bind
scripts/check-recipes.mjs     MOD   the checker prints it, and stops teaching the older form
README.md                     MOD   rule 5 of the authoring contract
```

Untouched, and named here because the ticket asks: `src/lib/tree.ts`, `src/lib/time.ts`,
`src/lib/label.ts`, `src/lib/layout.ts`, every `.astro` component, every `.cook` file,
`docs/knowledge/voice.md`.

---

## 1. `src/lib/step-labels.ts` (new)

The only new module. Pure: a string in, a reading out. No `fs`, no `Parser`, so vitest can test it
directly without WASM ever entering Vite.

### Public interface

```ts
/** A recipe's inline step labels, read off the source before the parser sees it. */
export interface StepLabels {
  /** The source with every inline label line blanked to `--`. Same number of lines, always. */
  source: string;
  /** Label text by 0-based step index — the same index normalise() counts steps with. */
  labels: Map<number, string>;
  /** Step blocks the scan found in `source`. normalise() checks this against the parser. */
  stepCount: number;
  /** Every way the labels were written wrong. One string per problem, each naming its line. */
  problems: string[];
}

/** Reads `>> step:` lines. A source with none comes back untouched and unscanned. */
export function readStepLabels(source: string): StepLabels;
```

`labels` is a `Map`, not an array: it is sparse by nature (a file labels three of its seven steps)
and it never leaves `normalise()`.

### Internal organisation, in the order the file reads

1. **The shape of a line.** One classifier, `classify(line)`, returning
   `'blank' | 'metadata' | 'section' | 'text' | 'comment' | 'step'`. The rules and the column-0
   requirement for `>>` are cooklang's, and the comment above it says which probe established each.
2. **The patterns.** `INLINE` (`>> step:` at column 0, case-insensitive), `INDENTED`
   (the same with leading whitespace — which cooklang does *not* read as metadata), `NUMBERED`
   (`>> step.N:`, matched only to detect a file that uses both forms).
3. **`scanSteps(lines)`** — the block walk. Returns the line index each step block starts on.
   Blank, metadata, section and text lines close a block; a comment line is transparent; anything
   else opens one if none is open. This is the piece that duplicates a parser rule, so it is
   short, commented, and cross-checked at runtime by its caller.
4. **`readStepLabels(source)`** — the assembly:
   - fast path: no line matches `INLINE` or `INDENTED` → return the source object itself, an empty
     map, `stepCount: 0`, no problems. **643 files take this path and cannot be affected by any
     of the code below it.**
   - blank each `INLINE` line to `--`, in place, keeping the line count.
   - `scanSteps` over the **blanked** lines, so the scan sees exactly what the parser will see.
   - for each label line: check it downward (what does it bind to?), check it upward (is it inside
     a step?), check the value is not empty, then resolve the target line to a step index.
   - the mixed-form check, once per file.
   - problems sorted by line so two runs of the checker diff cleanly.

### The binding rules, as code will express them

For a label on line *i* (0-based; messages print `i + 1`):

| Looking | At | Result |
| --- | --- | --- |
| down, past comment lines | a `step` line | binds; target index = position of that line in `scanSteps` |
| down | nothing left | `has nothing under it` |
| down | `blank` | `has a blank line under it` |
| down | another inline label | `has another >> step: line under it` |
| down | `metadata` / `section` / `text` | `has no step under it` |
| up, past blank and comment lines | a `step` line | `is inside a step` |

Empty value and the indented form are checked before either walk; a file that uses both forms adds
one problem naming a line of each.

---

## 2. `scripts/normalise.mjs` (modified)

Four edits, all inside `normalise()`. Nothing above it changes — the function already receives the
source text, so no caller's signature moves.

```js
import { readStepLabels } from '../src/lib/step-labels.ts';   // +1 import, alongside meta/slack/washing-up

export function normalise(source, { slug, path: relPath, folder }) {
  const { source: cleaned, labels, stepCount, problems } = readStepLabels(source);
  const parser = new Parser();
  const result = parser.parse_full(cleaned, true);            // ← was `source`
  …
      const labelOverride = labels.get(index) ?? metadata[`step.${index + 1}`] ?? null;
  …
  return { …, stepLabelProblems, … };
}
```

The cross-check, after the step loop, and only when the file used the inline form:

```js
const stepLabelProblems = [...problems];
if (labels.size && stepCount !== steps.length) {
  stepLabelProblems.push(
    `the inline label pre-pass counted ${stepCount} step(s) and the parser found ${steps.length} — ` +
      `that is a bug in readStepLabels(), not in this file`,
  );
}
```

It says "not in this file" on purpose: the one person who can ever see this message is the one
holding a `.cook` file the scanner does not understand, and the honest thing is to point at the
code. A file with no inline labels never reaches it, so the 643 numbered files cannot be failed by
a scanner they do not use.

The returned object gains exactly one field, `stepLabelProblems: string[]`, placed beside
`slackProblem` and `washingUpProblem`. `PROMOTED` and the `/^step\.\d+$/` deletion are unchanged —
an inline label never reaches `metadata`, because its line is gone before the parser reads it.

---

## 3. `scripts/parse-recipes.mjs` (modified)

One existing loop, one array folded in:

```js
for (const problem of [recipe.slackProblem, recipe.washingUpProblem, ...recipe.stepLabelProblems]) {
  if (problem) throw new Error(`${recipe.path}: ${problem}`);
}
```

The path prefix is already there, so the thrown message names the file and the message names the
line.

---

## 4. `scripts/check-recipes.mjs` (modified)

Two edits.

**a. Report the problems**, next to the two that already report:

```js
if (recipe.slackProblem) problems.push(recipe.slackProblem);
if (recipe.washingUpProblem) problems.push(recipe.washingUpProblem);
problems.push(...recipe.stepLabelProblems);          // +1 line
```

They print under the existing `FAIL   <rel>` header, so file and line both appear.

**b. Stop teaching the older form in the one message that does.** Line 200 today reads
`reword the step, or set it with a >> step.N: line`. It becomes the inline form, since that is
what README will call the one to use, and this message is the place a stuck author actually reads:

```
… came out with no label — reword the step, or name it with a >> step: line directly above it
```

Nothing else in the checker changes. `measure()` reads `step.labelOverride` and is indifferent to
where it came from, which is the point.

---

## 5. `src/lib/step-labels.test.ts` (new)

Two halves, mirroring `washing-up.test.ts` exactly.

**Half one — `readStepLabels()` directly** (no parser, no filesystem):

- an inline label is read, with its step index, and the source comes back with the line blanked
  and the line count unchanged
- two labels in one file land on two different steps
- a label on a prep step (a step with no ingredients is still a step block to the scan)
- the fast path: a source with no `>> step:` line comes back with `source` identical **by
  reference** and nothing scanned
- each of the seven problems, asserting the line number and the words of the fix
- the scanner's own rules: comments transparent, blank lines closing a block, a section header and
  a text block closing one, a multi-line step counted once

**Half two — the checker, run for real** (`execFileSync`, temp dir, never `recipes/`):

- an inline label and the same label as `>> step.N:` produce **byte-identical**
  `check-recipes.mjs --labels` output on a copy of a real recipe
- a prep step labelled inline comes out right, and the numbered form on the same file lands the
  label on the wrong row
- a dangling label, a label over a blank line, a label at the end of the file, a mixed file: exit
  1, and the message names the file and the line
- a file that uses neither form still draws its derived labels

`--labels` prints one line per operation cell, which is the rendered label and nothing else, so
comparing two runs of it is the byte-identical proof the ticket asks for, taken through the same
code path a page takes.

---

## 6. `README.md` (modified)

Rule 5 of the authoring contract (`README.md:148-153`) is the only prose that teaches the
override. It gains the inline form as the one to use and keeps the numbered one as older, without
calling it removed:

```
5. **Cell labels are derived, and overridable.** … To set one by hand, put the label on the
   line directly above its step:

       >> step: bake 350°F (170°C) 30 to 40 min
       Bake the @&(~1)batter{} at 350°F for 30 min.

   The line binds to the step directly under it — no blank line between — and the build fails
   if it has no step to bind to. The older form, `>> step.7:`, counts steps from the top of the
   file (prose rows included) and still works.
```

---

## Ordering

The scanner and its tests can land before anything reads them; the checker cannot be tested until
`normalise()` produces the problems. So:

1. `src/lib/step-labels.ts` + `src/lib/step-labels.test.ts` (half one) — testable alone.
2. `scripts/normalise.mjs` — the labels start working; half two of the tests becomes possible.
3. `scripts/parse-recipes.mjs` + `scripts/check-recipes.mjs` — the failures become failures.
4. `src/lib/step-labels.test.ts` (half two) — the checker run.
5. `README.md`.

Steps 1-2 are one commit only if the tests for 1 pass standing alone; the plan splits them.
