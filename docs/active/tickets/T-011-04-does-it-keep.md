---
id: T-011-04
story: S-011
title: does-it-keep
type: task
status: done
priority: medium
phase: done
depends_on: [T-011-01]
---

## Context

*Six people, over three days* is two questions and scaling only answers one. The other is whether
the dish is still good on Thursday.

**A recipe that scales beautifully and dies overnight does not answer that request**, and nothing
in the collection records which is which. Chili is better the next day. A fried thing is not a
fried thing an hour later. The site cannot tell them apart.

This ticket is independent of the rest of S-011 and safe to drop if the story needs to be smaller.

### 1. What it says

A recipe declares **how long it stays good and what it is like when you come back to it** — and
the second half is the point, exactly the way `slack` carries a reason rather than a level alone.

*"3 days — better on the second"* and *"3 days — the crust is gone by the next morning; reheat in
the oven, not the microwave"* are both three days and they are different dinners. **A number with
no character is a shelf life, and a shelf life is a food-safety claim this site should not be
making.** That distinction is this ticket's whole design problem:

- **This is not a food-safety field.** It is about whether the dish is still worth eating. Say so
  in the README, because the next author will assume otherwise and a site that appears to promise
  a safe window has taken on something it cannot stand behind. Look at how the S-007 story handled
  the same shape of problem — the tradition's reasoning recorded as the tradition's reasoning,
  never as a claim about a body.
- **Absent is fine and will be the common answer.** Same rule as `slack` and `washing-up`.
- **Freezing is a different question from keeping.** Decide whether one line carries both or
  whether freezing is out of scope, and say why. One line that means two things is how a field
  stops comparing.

Follow the path the other properties took: `normalise.mjs`, `tree.ts`, `check-recipes.mjs`,
rendered where `slack` renders.

### 2. Annotate where it decides something

Do not backfill 658 files. Annotate where the answer changes what somebody cooks:

- **Everything on One Pot, Instant Pot and The Slow Cooker.** These are the batch-cooking shelves
  and *keeps* is the whole reason a person fills a slow cooker on Sunday.
- **The things that obviously do not keep**, which are as useful as the things that do. Anything
  fried, anything whose texture is the dish. `docs/gaps/one-pot.md` names the four deep-fried wok
  recipes; they are the reference case here too.
- **Whatever S-008's air fryer files say for themselves**, since reheating is a stated part of
  that shelf.

**Where the answer is genuinely uncertain, leave it off.** A guessed keeping time is worse than
none, and it is the one field on this site where a confident wrong number could make somebody ill
— which is the reason for the framing rule above and not a rhetorical flourish.

## Acceptance Criteria

- A recipe can declare how long it keeps and what it is like when reheated, in `>> ` metadata,
  with **the character required alongside the duration** — a bare number fails the check.
- The README documents the field and states plainly that it is about whether the dish is still
  good, not about whether it is safe.
- The freezing decision is made and argued.
- `normalise.mjs` promotes it, `tree.ts` types it, `check-recipes.mjs` validates it, and it
  renders where `slack` does. A recipe that does not declare renders nothing.
- At least **60** recipes annotated, drawn from One Pot, Instant Pot and The Slow Cooker, plus
  every recipe whose answer is *it does not keep* that turned up while reading them.
- The four deep-fried recipes named in `docs/gaps/one-pot.md` are annotated and say what happens
  to them, in words a cook would use.
- Any recipe where the answer could not be established honestly is listed in the work artifact
  and left undeclared. **State the count** — a low one means somebody guessed.
- Tests cover: a declaration with character parses; a bare duration fails; an undeclared recipe
  renders nothing.
- `npm run verify` passes.
- Only `scripts/`, `src/`, `README.md`, the annotated `.cook` files' new line, and
  `docs/active/work/T-011-04/**` are modified. No other line of any recipe changes.
