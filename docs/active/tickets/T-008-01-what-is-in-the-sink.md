---
id: T-008-01
story: S-008
title: what-is-in-the-sink
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Build the fourth thing a recipe can say about a cook's evening. The clock says how long and how
much of it is hands-on. `slack` says what happens if you get it wrong. **Nothing says what is in
the sink at the end**, and three counters currently make a promise about exactly that.

Everything downstream in S-008 waits on this. Nothing blocks it; start immediately.

## What it is

A property a recipe declares, rendered near the clock: **the things that need washing when the
food is on the table.**

Two facts fix the design before you start.

**It is authored, never derived.** `docs/gaps/one-pot.md` already ran the experiment: it ranked
114 candidates off the derived `cookware` list and then threw 61 off the shelf by hand, because
`cookware` counts what a recipe *names*. `general-tsos-chicken` declares one `#wok{}` and is a
quart of oil, a velveting bowl, a dredging dish, a draining rack and a glaze bowl. Any formula
run over `cookware` calls it a one-pot recipe. A cook knows what they washed; a parser does not.

**The count is what gets used, and it must not be a claim the author makes separately from the
list.** A recipe that says "2" and then lists three things has told two different stories. Derive
the number from the list so the two can never disagree — the same instinct behind labels being
derived from steps and `pairs-with` being made mutual at build time.

## Design notes, not instructions

You own the design phase; these are the constraints it has to satisfy.

- **The line is a list of the things that go in the sink**, in plain words a cook would use — *the
  fryer basket, one mixing bowl* — not a number and not a category. It is read by a person first
  and counted by the build second.
- **Absent is fine and will be common.** 650-odd recipes predate this field and only the
  candidate pool gets annotated this pass (T-008-03). The render must look deliberate with the
  line missing: nothing at all, no empty slot, no zero.
- **Zero is a real answer and is not the same as absent.** A no-cook dressing shaken in the jar
  it is stored in genuinely washes nothing. Decide how a recipe says that, and make sure it
  cannot be confused with not having declared.
- **Cross-check it against `cookware`, and make the check advisory rather than fatal.** Every
  `#thing{}` a file names either appears in the washing-up line or is something not washed — an
  oven, a hob, a worktop. A file naming a `#dutch oven{}` and declaring nothing in the sink is
  probably wrong and worth a warning; it is not automatically wrong, because a foil-lined tray is
  a real answer. **The interesting failure is the opposite direction and no check can catch it** —
  the bowls a recipe uses and never names — which is why this is authored.
- Follow the path `kit`, `dish` and `slack` already took: read in `scripts/normalise.mjs`,
  promoted out of loose metadata, typed in `src/lib/tree.ts`, validated in
  `scripts/check-recipes.mjs`, rendered where the clock is.
- **Do not count the plate you eat off.** Say so in the README. Otherwise every recipe on the
  site declares one more thing than the next author thinks it should, and the field stops
  comparing.

## What it unblocks, and why the render matters

The three counters this decides for are One Pot, Instant Pot and The Slow Cooker, and a reader
choosing between `beef-stew` and `beef-stew-instant-pot` is choosing an evening. **Put the line
where that comparison is visible** — beside the clock, on the recipe page, and consider whether
the variant switcher (`src/lib/tree.ts` carries `variants`) should show it too. That last is a
judgement call; argue it either way in the work artifact.

## Acceptance Criteria

- A recipe can declare its washing-up in `>> ` metadata, and the field name reads as plain
  English to someone opening a `.cook` file for the first time.
- The count is **derived from the list**, never authored alongside it, and the work artifact
  shows the parse of at least three real lines with the number each produced.
- A recipe that washes nothing can say so, and that state is distinguishable in the data from a
  recipe that did not declare.
- `scripts/normalise.mjs` promotes it out of loose metadata the way `kit`, `dish` and `slack`
  are, and `src/lib/tree.ts` types it.
- `scripts/check-recipes.mjs` rejects a malformed line with a message saying what a good one
  looks like, and **warns** — does not fail — when a file names cookware that appears nowhere in
  its washing-up line.
- The property renders near the clock. A recipe that does not declare one renders nothing.
- At least **8** existing recipes are annotated as worked examples. They must include: one from
  One Pot that genuinely washes one thing, **at least two of `general-tsos-chicken`,
  `orange-chicken`, `sesame-chicken` or `sweet-and-sour-pork`** — the four that proved the
  derived list cannot be trusted — and one Instant Pot recipe that browns in a separate pan
  first. These set the standard three later tickets copy.
- Tests cover: a list parses to the right count, a zero declaration parses and is not absent, a
  malformed line fails, an undeclared recipe renders without the line, and the cookware
  cross-check warns without failing.
- The README's authoring contract documents the field with two example lines and the rule that
  the plate you eat off does not count.
- `npm run verify` passes.
- Files outside `recipes/**` are limited to `scripts/`, `src/` and `README.md`. **Do not touch
  `src/data/counters.json`** — T-007-05 and T-008-02 hold it.
