---
id: T-003-02
story: S-003
title: how-much-slack
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Build the third cap. The clock under every table already says how long a recipe takes and how
much of that is hands-on. It says nothing about the question people are actually nervous
about: **what happens if I get it wrong.**

Three writers are waiting on this so they can author it from their first file. Nothing blocks
this ticket; start it immediately.

## What it is

A property a recipe declares, rendered next to the clock. Two parts:

1. **A level**, from a controlled vocabulary — so it can be filtered, searched and tested.
2. **A reason**, one line, naming the *actual failure*.

**The value is entirely in the reason.** "Forgiving" on its own is a vibe and helps nobody.
*"An extra hour in the pot changes little"* is something a cook can plan an evening around. So
is *"the custard breaks past 82°C and will not come back."* So is *"the dough is fine anywhere
from six to twelve hours; past that the gluten goes slack."*

This is the same discipline as the rest of the repo. The clock refuses to invent a duration; the
shopping list returns null rather than compare grams to cups. **A recipe that cannot name its
real failure has not earned a rating** — the field is optional and absent is a legitimate,
honest answer. Design the render so absence shows nothing at all rather than an empty slot.

## Design notes, not instructions

You own the design phase; these are the constraints it has to satisfy.

- **Three levels is probably right** and the names should be words a cook says, not a scale.
  Whatever you choose has to make the middle case meaningful — a two-level flag collapses into
  "easy/hard" and stops carrying information.
- **The reason is required when the level is present.** A level with no reason should fail the
  check, the same way an unknown counter does.
- **Absent is fine and will be common.** 514 recipes predate this field and only some get
  backfilled this pass (T-003-07). The render must look deliberate with the line missing.
- **It is authored, never derived.** Do not compute it from timers, step count, or ingredient
  count. A five-minute custard is less forgiving than a six-hour braise, and any formula that
  gets that backwards is worse than nothing.
- Follow the path `kit` and `dish` already took: read in `scripts/normalise.mjs`, promoted out
  of loose metadata, typed in `src/lib/tree.ts`, validated in `scripts/check-recipes.mjs`,
  rendered where the clock is.

## Acceptance Criteria

- A recipe can declare its slack in `>> ` metadata, and the field name reads as plain English
  to someone opening a `.cook` file for the first time.
- `scripts/normalise.mjs` promotes it out of loose metadata the way `kit` and `dish` are, and
  `src/lib/tree.ts` types it.
- `scripts/check-recipes.mjs` rejects an unknown level, and rejects a level with no reason,
  with a message that says what the legal values are.
- The property renders next to the clock under the table. A recipe that does not declare one
  renders nothing — no empty slot, no placeholder, no default.
- At least **8** existing recipes are annotated as worked examples, chosen to cover all levels
  and to include at least two where the failure is genuinely dangerous or unrecoverable. These
  are the reference for three writer tickets, so they set the standard for what a reason reads
  like.
- Tests cover: each level parses, a missing reason fails, an unknown level fails, and an
  undeclared recipe renders without the line.
- `npm run verify` passes.
- The README's authoring contract documents the field, with two example lines.
- Files outside `recipes/**` are limited to `scripts/`, `src/`, and `README.md`. Do not touch
  `src/data/counters.json` or `src/lib/time.ts` — other tickets hold those.
