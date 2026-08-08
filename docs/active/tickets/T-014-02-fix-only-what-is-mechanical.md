---
id: T-014-02
story: S-014
title: fix-only-what-is-mechanical
type: task
status: done
priority: high
phase: done
depends_on: [T-014-01]
---

## Context

Apply the mechanical band from T-014-01's ranked list. **Nothing else.**

This is the ticket most likely to fail by doing too much. The list will contain findings that are
obviously right and one edit away, and are still not mechanical because somebody would want to
argue the edit. Those stay recorded. **A session that ends with a tidy list and three contested
changes is worse than one that ends with an honest list and none.**

### 1. The bar

A finding qualifies only if all three hold:

1. **The right answer is not in dispute.** Two reasonable people would make the same edit.
2. **A command verifies it.** T-014-01 was required to state that command for every mechanical
   finding; if it could not, the finding is not in this band whatever its label says.
3. **It does not move a recipe between shelves, change a declared number, or rewrite an argument.**
   Shelving is a counter decision, a number is a claim about cooking, and an argument belongs to
   the story that made it.

**Re-check the band rather than trusting it.** T-014-01 classified; you are the second opinion. If
something it called mechanical fails any of the three, push it back to *needs an argument*, say so,
and move on — that is a correct outcome for this ticket, not a failure to deliver.

### 2. What this probably covers

From the shapes the earlier consolidations found, expect: stale sentences in gap pages that
describe a state two stories out of date, a tag spelled two ways, a slug named in prose that no
longer exists, a count in a document that the build now contradicts, a comment describing a syntax
that was removed.

`docs/gaps/README.md` is the likeliest concentration. It has carried a *"still describes the
fifteen-counter shelf"* caveat since S-003 and the shelf has moved several times since.

### 3. One at a time, verified each time

Each fix gets its verifying command run and its output recorded before the next one starts. A
batch of twelve edits verified once at the end cannot say which of the twelve broke something.

**Where a fix touches a `.cook` file, the operation-label and clock output for that recipe must be
unchanged unless the fix is explicitly about one of them.** T-009-02 established the dump-and-diff
technique for exactly this; reuse it rather than inventing a new check.

### 4. What to do with the rest

Nothing, except make sure it is recorded well. Read the *needs an argument* and *needs food* bands
and confirm each has enough in `docs/gaps/README.md` for somebody to pick it up cold — the finding,
the evidence, the ticket it came from, and why it was not done. Add what is missing.

## Acceptance Criteria

- Every finding T-014-01 placed in the mechanical band is either **applied** or **pushed back**
  with the reason, and the work artifact accounts for all of them. None is silently skipped.
- Each applied fix has its verifying command and that command's output in the work artifact, run
  after that fix and before the next.
- No fix moves a recipe between counters, changes a declared time, servings, capacity,
  washing-up count or slack level, or rewrites an argument in a knowledge or gap page.
- For any `.cook` file touched, the operation labels and clock figures for that recipe are
  unchanged — shown by the dump-and-diff from T-009-02 — unless the fix was about them, in which
  case the change is stated.
- The *needs an argument* and *needs food* bands are each recorded in `docs/gaps/README.md` with
  finding, evidence, source ticket and reason. Nothing from those bands is applied.
- `npm run verify` passes, including `scripts/check-menus.mjs`.
- `npm run verify:mobile` passes. **Run it with nothing else building** — a concurrent build
  aborts the sweep on its own guard, which cost T-010-03 five attempts and an operator's
  afternoon.
- The work artifact states the count applied and the count pushed back. **A high applied count is
  not the goal**; if the honest answer is that two of nine qualified, that is the result.
