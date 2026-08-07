---
id: T-011-02
story: S-011
title: capacity-and-the-cost-function
type: task
status: done
priority: critical
phase: done
depends_on: [T-011-01, T-010-01]
---

## Context

Build the one thing an author has to declare, and the function that turns it into an answer.

**You own a new `src/lib/scaling.ts`, the property's path through `scripts/normalise.mjs` and
`scripts/check-recipes.mjs`, and their tests.** T-011-03 annotates recipes with it; T-011-05 and
T-011-06 render it. Implement the model in `docs/knowledge/scaling.md` — **if the code and that
file disagree, the file is right and the code is a bug.**

### 1. The property is a capacity, not a class

A recipe declares **how many servings the limiting vessel holds** — a fact a cook knows without
thinking. It does not declare O(1), O(n), a difficulty, or a batch count. The growth is derived.

Design constraints:

- **It names the vessel as well as the number.** *"6 — one 12-inch skillet"* tells a reader with a
  different pan what to do with it; a bare `6` does not. Same discipline as `slack` carrying a
  reason and `washing-up` listing what it counted.
- **Absent is the common, correct answer.** Most recipes are not vessel-bound. A capacity on every
  file would mean somebody guessed, and the render must look deliberate with the line missing.
- **It is relative to `>> servings:`, which every one of the 664 files carries.** A recipe serving
  4 with a capacity of 6 does not batch until 7. Decide whether capacity is in servings or in
  batches-of-this-recipe and say why; servings is probably right because it composes with the
  plan page's multipliers, but argue it.
- **A capacity below the recipe's own servings is a contradiction** — the file says it serves 8
  and admits the pan holds 4. That is either a wrong number or a recipe that already batches and
  did not say. Fail the check and make the message say which two lines disagree.

Follow the path `kit`, `dish`, `slack` and `washing-up` took: read in `normalise.mjs`, promoted
out of loose metadata, typed in `src/lib/tree.ts`, validated in `check-recipes.mjs`.

### 2. The cost function

`src/lib/scaling.ts` takes a recipe and a target number of servings and returns what it costs.
It does not render anything and it does not know about pages.

It has everything it needs already: `buildSchedule` gives `handsOnMinutes`, `unattendedMinutes`,
`totalMinutes` and the per-task attention split; T-010-01 added the longest unbroken stretch;
`>> servings:` gives the baseline; capacity gives the bound.

Four things to get right, and each is a place a plausible implementation is wrong:

- **Batches are serial and they repeat the unattended time.** Four baskets of wings is four
  fifteen-minute cooks one after another. This is the entire trick and everything else is
  bookkeeping.
- **Only the bounded part batches.** A recipe that fries in batches and simmers a sauce in one pot
  does not repeat the sauce. If the model can only express whole-recipe capacity, **say so as a
  known limitation** rather than pretending otherwise — `docs/knowledge/scaling.md` should already
  have decided this.
- **Return the growth, not just the number.** A caller needs to say *"three times as much costs
  nothing extra"*, which is a statement about the curve. Return enough to answer that — the cost
  at n, and how it grew — without the caller re-deriving it.
- **Carry the confidence through.** T-010-01 made the index distinguish stated from inferred from
  nobody-said. A cost built on assumed hands-on minutes is a guess multiplied, and multiplying
  makes it worse. **A scaled figure must never look more certain than the figure it scaled.**

### 3. No notation escapes

`scaling.ts` may use O(·) freely in its names, comments and tests. **It must not return a string a
page could print.** Rendering is T-011-05's and T-011-06's, from the phrasebook in
`docs/knowledge/scaling.md`. A function returning `"O(n)"` is how the notation ends up on a card.

## Acceptance Criteria

- A recipe can declare its capacity in `>> ` metadata, naming both the number and the vessel, and
  the field reads as plain English to someone opening a `.cook` file for the first time.
- `normalise.mjs` promotes it, `tree.ts` types it, `check-recipes.mjs` validates it.
- A capacity below the file's own `>> servings:` **fails the check**, with a message naming both
  lines. Show it.
- `src/lib/scaling.ts` exports a cost function taking a recipe and a target servings, returning
  elapsed, hands-on, batch count, longest unbroken stretch, and how each grew.
- **It returns no display string and no notation.** Grep the file's return types to show it.
- The confidence from T-010-01 is carried through, and a cost built on assumed minutes is marked
  as such at least as strongly as the unscaled figure was.
- The four worked examples in `docs/knowledge/scaling.md` are unit tests, and **the code produces
  the numbers that file computed by hand.** Any disagreement is resolved in the file's favour and
  written up.
- Tests cover: an unbounded recipe at 3× (elapsed unchanged, hands-on tripled); a bounded recipe
  at 3× (elapsed and hands-on both up by the batch count); a recipe at 0.5× (no batching, hands-on
  halved); a recipe with no capacity declared; and a recipe whose hands-on figure is entirely
  assumed.
- No recipe declares a capacity yet — that is T-011-03's. Use fixtures.
- `npm run verify` passes.
- Only `src/lib/scaling.ts`, `src/lib/tree.ts`, `scripts/normalise.mjs`,
  `scripts/check-recipes.mjs`, `README.md`, their tests and `docs/active/work/T-011-02/**`.
