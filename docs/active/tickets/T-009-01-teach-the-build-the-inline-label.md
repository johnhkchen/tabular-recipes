---
id: T-009-01
story: S-009
title: teach-the-build-the-inline-label
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Make the build understand a step label written on the line above its step, **alongside** the
numbered form it already understands. Nothing is migrated here and nothing is taken away; 643
files still use `step.N` when you are done and all of them still work.

Nothing blocks this. T-009-02 and everything after it wait on it.

## What already works, and what does not

Checked against `@cooklang/cooklang` 0.18.7 rather than assumed, and both halves matter:

- **A mid-file `>> key: value` line is hoisted into `raw_metadata.map`** and **does not split the
  step that follows it.** A `>> step:` line dropped into the body leaves the step blocks and their
  numbering exactly as they were. That is what makes this possible at all.
- **The AST does not preserve where the line sat.** Two `>> step:` lines in one file collide in
  the map — last wins. So the position cannot be recovered after parsing.

Therefore: **`scripts/normalise.mjs` reads the positions off the raw source before it parses.**
That function already receives the source text. Strip the `>> step:` lines out, record which step
block each one preceded, and hand the cleaned source to the parser. The existing `labelOverride`
field then gets its value from the pre-pass instead of from `metadata['step.' + (index + 1)]`,
and nothing downstream — `src/lib/tree.ts`, `src/lib/time.ts`, the render, the checker — needs to
know which form the file used.

## Design notes, not instructions

You own the design phase; these are the constraints it has to satisfy.

- **Both forms work, and a file may not use both.** A file mixing them is ambiguous about which
  wins and should fail the check with a message saying so. A file using one or the other is fine.
- **The line binds to the step immediately below it, with no blank line between.** A `>> step:`
  line followed by a blank line, by another `>> step:` line, or by the end of the file is an
  error, not a silently-dropped label. **That check is most of this ticket's value** — it is the
  thing `step.N` could never do.
- **Prep steps count.** A full-width row (a step with no ingredients) is a step and can carry a
  label. The inline form gets this right for free, which is precisely the bug recorded in
  `docs/gaps/README.md` under *Recorded and not done*: `step.N` counts prose steps as well as
  operations, undocumented, and it cost three files a round trip.
- **The pre-pass must not disturb ordinary metadata.** `>> title:`, `>> tags:` and the rest are
  positionless and stay in the map. Only the step key is positional.
- **Decide what the key is called and say why.** `>> step:` is free — no file uses it today. If a
  different word reads better next to a step, argue it in the work artifact; what matters is that
  a person opening a `.cook` file for the first time can tell what the line does.
- The 2,771 existing `step.N` lines are read exactly as they are read today, including the prose
  steps in the count. **Do not fix the counting semantics of the old form.** It is being deleted
  in two tickets and changing it now would silently move labels in 643 files with no migration to
  prove it.

## Acceptance Criteria

- A `.cook` file can put a step's label on the line directly above the step, and it renders
  identically to the same label written as `>> step.N:`. Show both forms of one real recipe
  producing byte-identical output.
- `scripts/normalise.mjs` resolves the position from the source, not from `raw_metadata`, and
  more than one inline label in a file works — the collision in the parser's map is not a
  constraint on the format.
- The inline form labels a prep step (a full-width row) correctly, and the work artifact shows a
  case where the numbered form gets that same step wrong.
- `scripts/check-recipes.mjs` fails, with a message naming the file and the line, on: an inline
  label with no step under it, an inline label followed by a blank line, and a file that uses both
  forms.
- Nothing about the numbered form changes. **All 643 files that use it are untouched and
  `npm run verify` output is identical to before this ticket**, other than any new check's own
  reporting. Show the comparison.
- `src/lib/tree.ts`, `src/lib/time.ts` and the render are unchanged, or the work artifact says
  why one had to move.
- Tests cover: an inline label parses and wins; two inline labels in one file both apply; an
  inline label on a prep step; a dangling inline label fails; a mixed file fails; a file with
  neither renders its derived label.
- `README.md` documents the new form as the one to use and the numbered form as the older one,
  without yet calling it removed.
- `npm run verify` passes.
- Files outside `recipes/**` are limited to `scripts/`, `src/` and `README.md`. **No `.cook` file
  is edited** — T-009-02 owns those. **Do not touch `docs/knowledge/voice.md`** — T-009-03 does.
