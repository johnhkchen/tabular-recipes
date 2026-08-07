---
id: T-009-02
story: S-009
title: move-two-thousand-labels
type: task
status: done
priority: high
phase: done
depends_on: [T-009-01]
---

## Context

Move all 2,771 `>> step.N:` lines in 643 files down to sit above the steps they label. **By
script, and with proof that nothing moved.**

This is not a change anybody reviews by reading a diff. 643 files is the whole collection bar
fifteen. The review is the proof, so the proof is the ticket.

**You own `recipes/**/*.cook` and the new script.** T-009-01 taught the build both forms and both
still work, which is what makes this safe to do in one pass.

### 1. The script ships, it is not a throwaway

Write it as `scripts/` tooling that can be run again — the collection will grow, someone will
hand-write a numbered label out of habit, and a fixer that exists is the difference between
catching that and arguing about it. Follow the shape of the scripts already there
(`normalise.mjs`, `menu-sections.mjs`, `check-recipes.mjs`): reads files, prints what it did,
`--write` to actually write.

### 2. Resolve N the way the build resolves it today, bugs included

`step.N` is 1-based over **every** step as written, **including prose steps** — the undocumented
behaviour recorded in `docs/gaps/README.md` under *Recorded and not done*, which cost three files
a round trip. The codemod must reproduce that exactly.

**This is the trap in the whole ticket.** The temptation is to move a label to the step you think
it describes. Do not. Move it to the step the current build gives it to, even where that is
plainly the wrong step, because the point of this pass is that no label changes. **A label sitting
on the wrong step is a finding**, and it is a valuable one: list every case in the work artifact
with the slug, the number, the step it landed on and the step it reads like it wanted. Somebody
fixes those in a later pass, one file at a time, where a person can look at each.

Do not reuse the reader from `normalise.mjs` by reimplementing it. **Call it**, so the codemod's
idea of which step is N is the same object as the build's.

### 3. The proof

Byte-identical labels before and after. Concretely:

1. Build the site, or run the normaliser over the collection, and dump **every operation label of
   every step of every recipe** to a file — slug, step index, label.
2. Run the codemod.
3. Dump again.
4. `diff`. It is empty, or the ticket is not done.

Paste the command and the empty diff into the work artifact. **A summary sentence is not the
proof; the command and its output are.**

The same applies to the clock: `src/lib/time.ts` reads the override when it slices a step's
timers, so a label that moved would move a time. The dump includes each step's derived duration
and hands-on split for the same reason.

### 4. Where the line goes, exactly

Directly above its step, no blank line between, one line per label. The old `>> step.N:` lines
come out of the metadata block at the top.

Two things to get right and to state in the work artifact as the convention:

- **Blank lines between steps are how steps are separated.** The codemod must not eat one or add
  one; a file whose paragraph structure changes has changed its steps, whatever the labels say.
- **A file where the metadata block is the only thing above the first step** now has one fewer
  line in that block, and the first step may gain a label line directly above it with the blank
  line still between the block and the step. Check that the pre-pass from T-009-01 binds it to
  the right step, and if the shape is ambiguous, say so rather than guessing.

### 5. Expect some files to resist

15 of the 658 use no `step.N` at all and are untouched. Of the rest, expect a handful where the
number is out of range, points at a step that no longer exists, or sits in a file whose structure
the script cannot read confidently.

**Leave those files alone and list them.** They still work — the numbered form is not removed
until T-009-03 — and a hand-migrated file with an explanation is worth more than a clever script
that got it silently wrong. T-009-03 needs that list before it can take the old form away.

## Acceptance Criteria

- A script under `scripts/` performs the migration, is idempotent, prints a per-file summary, and
  requires `--write` to change anything.
- **The label dump is byte-identical before and after.** The command and its empty diff output
  are pasted into the work artifact. This is the ticket's primary criterion and nothing
  substitutes for it.
- The per-step derived duration and hands-on split are in the same dump and are also unchanged.
- The script resolves N by calling the build's own reader, not by reimplementing the count. Show
  the call.
- At least **2,700** of the 2,771 lines are migrated. Every unmigrated one is listed by slug and
  number with the reason, and that list is what T-009-03 depends on.
- Every migrated label sits on the line directly above its step, with no blank line between, and
  no file's paragraph structure changes. Show it: a diff of one representative file, and a count
  of blank lines across the collection before and after.
- **A list of every label the current build gives to a step it does not describe**, with slug,
  number, the step it landed on and the step it reads like it wanted. Nothing is corrected here.
- No `.cook` file changes in any way other than moving these lines. Show it: a diff filtered to
  added and removed `>> step` lines only, across all 643 files, coming back with nothing else.
- `npm run verify` passes.
- Only `recipes/**/*.cook`, one new file under `scripts/` and `docs/active/work/T-009-02/**` are
  modified.
