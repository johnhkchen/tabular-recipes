---
id: T-003-06
story: S-003
title: shelve-the-home-wing
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-08]
---

## Context

Put the three home shelves on their boards, and place the recipes that were already here and
never had a shelf to sit on.

You own `src/data/counters.json` and `src/data/aisles.json`. **T-002-08 holds the same two
files** for the S-002 shelves, which is why this ticket waits for it rather than running
alongside. Read what it did first.

### 1. Fill the sections

T-003-01 created the three counters with ordered section titles and empty item lists. Fill
them with slugs, in menu order.

A section may list a recipe that never names the counter — that is how a shelf borrows. The
specific borrowings that matter here:

- **`dashi` and `miso-soup` are the foundation of Japanese Home Cooking** and already exist.
  They go in "The soup and the rice" without being edited. T-003-04 was told explicitly not to
  rewrite them.
- **`congee` belongs to The Soup Pot's rice-soup section** and already exists.
- **The Slow Cooker shelves only what declares `kit: Slow Cooker`**, unlike the other two. It is
  a kit shelf; a recipe cooked another way does not belong on it however slow it is.
- Each writer ticket recorded dishes it found already existed rather than rewriting them, with
  the section each belongs in. Those lists are in `docs/active/work/T-003-0*/`. **Read all three
  before touching the file** — they were written for you.

### 2. Decide what the Ramen Shop keeps

`karaage`, `gyoza`, `okonomiyaki`, `chawanmushi` and the ramens are Japanese and currently
shelved as restaurant food. Some of them are genuinely cooked at home constantly and belong on
both boards; some are not. `docs/gaps/japanese-home.md` made this call — apply it, and say in
the work artifact where you disagreed with it and why.

A recipe on two boards is normal and correct. A recipe on the wrong board is the failure.

### 3. Catch the new ingredients

Three shelves bring ingredients this collection has not seen: dried Chinese soup ingredients,
Japanese pantry staples, whatever the soups called for. Run the aisle-coverage test in
`src/lib/shopping.test.ts` — it prints what has no aisle. Add patterns to
`src/data/aisles.json` for the real ones.

The hazards a previous pass hit, which are easy to repeat:

- **Most-specific pattern wins across aisles**, not within one. A bare word added to an aisle
  can steal a product from a more specific pattern elsewhere.
- **A pack size in the wrong system says nothing.** `purchaseOf` returns null rather than
  compare grams to cups. Do not add a pack size to make a badge appear.
- Dried goods bought by the handful from a herbalist or an Asian grocery may not fit any
  existing aisle honestly. A new aisle is allowed; a wrong aisle is not.

### 4. Check the shelves read as shelves

Build and open all three pages. A counter whose items all land in "Also here" has section
titles that do not match what got written — fix the placement, or the titles.

## Acceptance Criteria

- All three new counters have populated sections, in menu order, and **no counter renders an
  "Also here" section**.
- Japanese Home Cooking shelves at least **25** recipes, including `dashi` and `miso-soup`,
  and the work artifact says which Ramen Shop recipes were added to it and which were left.
- The Soup Pot shelves at least **22** recipes, including `congee`.
- The Slow Cooker shelves every recipe carrying `kit: Slow Cooker`, and nothing else.
- Every slug listed in every section resolves to a real recipe.
- The aisle-coverage test passes and `npx vitest run` is green.
- `npm run build` succeeds and all three pages render.
- Only `src/data/counters.json` and `src/data/aisles.json` are modified.
