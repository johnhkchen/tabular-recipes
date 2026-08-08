---
id: T-009-04
story: S-009
title: the-other-counted-reference
type: task
status: done
priority: medium
phase: done
depends_on: [T-009-03]
---

## Context

`@&(3)dough{}` has the same defect `>> step.4:` had: a number counted by a person, addressing a
step from a distance, wrong and silent the moment a step is inserted above it. Insert an operation
at the top of a recipe and `@&(3)` now consumes a different step. The tree still merges, the table
still draws, and it is drawing the wrong tree.

**33 uses across 30 files.** Small enough to do carefully, and leaving it would mean fixing the
format's fragile joint and leaving a splinter in it.

This runs after T-009-03 so the two migrations never touch the same file at the same time, and so
the label proof from S-009's first three tickets is settled before a second kind of edit starts.

### 1. Look before deciding what to do

Read all 33 and answer one question first: **why did each of these use an absolute reference
instead of a relative one?**

Three answers are likely and they want different treatment:

- **It could have been relative all along.** `@&(3)` where the target happens to be `~2` back.
  These convert mechanically.
- **It reaches back past a branch**, where counting backwards is genuinely awkward to write and
  awkward to read. A relative form is still correct but less legible, and a name would be better
  than either.
- **It reaches across branches** — the merge tree has more than one chain and the absolute number
  is doing real work. These may not have a relative form that reads well at all.

Only the first group is a mechanical change. **Say how many are in each group before proposing a
fix**, and if the third group is most of them, the honest outcome of this ticket may be *absolute
references stay, and here is the check that stops them being wrong* rather than a migration. That
is a legitimate result and it should be argued in the work artifact rather than avoided.

### 2. Whatever the fix, the build must be able to catch a wrong one

The reason `step.N` was worth a story is that being wrong produced a confident, plausible,
incorrect page. Whatever this ticket concludes, it leaves the build able to say something it
cannot say today.

At minimum: **a reference pointing at a step that produces nothing is an error.** README rule 1
already says a step that consumes nothing starts a new branch and every branch must merge — so a
reference to a prep step, a full-width row, or a step that was never an operation is a real
mistake the build can name. Check whether it currently does. If not, that is this ticket's
smallest useful outcome and it is worth having on its own.

### 3. If a name is the answer, say so and stop

A named step — a step that declares a handle, referred to by that handle — solves this and solves
`@&(~4)` with it. **It is also a bigger change than this ticket, and this ticket does not start
it.** If the 33 cases point at naming, write that up as a proposal for its own story, with the
count, the cases it would fix, and what it would cost. Do not begin it here.

## Acceptance Criteria

- All 33 absolute references are read and classified into the three groups above, by slug, with
  counts.
- One of the following, argued in the work artifact:
  - the mechanical cases are converted, with a before-and-after proof that **every recipe's tree
    is unchanged** — same parents, same merge order, same table shape, dumped and diffed the way
    T-009-02 dumped labels; or
  - absolute references stay, with the reason stated plainly and the check below delivered
    regardless.
- **`scripts/check-recipes.mjs` fails on a reference to a step that produces nothing**, with a
  message naming the file and the step. If it already does, show the test that proves it and say
  so.
- Tests cover whichever outcome landed, including a reference pointing at a prep step.
- If naming steps is the recommendation, it is written up as a proposal — count, cases fixed,
  cost — and **not started**.
- `npm run verify` passes.
- Only `scripts/`, `src/`, any converted `.cook` files, `README.md` if the syntax changed, and
  `docs/active/work/T-009-04/**` are modified.
