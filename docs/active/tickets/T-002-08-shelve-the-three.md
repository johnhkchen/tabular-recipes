---
id: T-002-08
story: S-002
title: shelve-the-three
type: task
status: done
priority: high
phase: done
depends_on: []
---

## Context

Six tickets have written recipes into empty shelves. This one puts them on the boards, and
places the recipes that were already here and never had a shelf to sit on.

You own `src/data/counters.json` and `src/data/aisles.json`. No writer ticket was allowed to
touch either, which is why this is safe to do all at once.

### 1. Fill the sections

T-002-01 created the three counters with ordered section titles and empty item lists. Fill
them, in menu order, with slugs.

**The large part of this job is the recipes that already existed.** A section may list a recipe
that never names the counter — that is how Panadería's page worked before it had a menu of its
own. Specifically:

- **The Bowl Shop's "Dressings and drizzles" section is already written**: 41 files in
  `recipes/dressings-and-dips/`. Not all of them belong — chopped liver and cream cheese are
  not bowl-shop dressings — so read them and choose. This is a judgement, not a `ls`.
- **One Pot is mostly existing recipes.** Ten carry a `one-pot` tag already; many more qualify
  without saying so. Read `recipes/stews-and-braises/`, `recipes/soups/`,
  `recipes/rice-beans-and-grains/` and `recipes/stir-fries/` against the test in
  `docs/active/tickets/T-002-04-one-pot-dinners.md`: at the end, how many things need washing?
  A dish needing a separate pot of pasta water does not go on this shelf however it is
  marketed.
- **Every writer ticket recorded dishes it found already existed** rather than rewriting them,
  with the section each belongs in. Those lists are in `docs/active/work/T-002-0*/`. Read them
  — they are the handoff, and they were written for you.

Each of the six writer tickets left its own work artifact naming what it wrote and what it
skipped. Read all six before touching the file.

### 2. Catch the new ingredients

Bowls and roasted vegetables bring ingredients this collection has not seen: grain varieties,
seed and nut toppings, shelf-stable crunch, whatever the salads pickled. Run the aisle-coverage
test in `src/lib/shopping.test.ts` — it prints what has no aisle. Add patterns to
`src/data/aisles.json` for the real ones.

Two things a previous pass learned the hard way and that are easy to repeat:

- **Most-specific pattern wins across aisles**, not within one. Adding a bare word to an aisle
  can steal a product from a more specific pattern somewhere else — "pepper" in Produce once
  orphaned `green bell pepper` by fighting the spice.
- **A pack size in the wrong system says nothing.** `purchaseOf` returns null rather than
  comparing grams to cups, and that is correct. Do not add a pack size to make a badge appear.

### 3. Check the shelves read as menus

Build and look at all three pages. A counter whose items all land in "Also here" has section
titles that do not match what got written — fix the placement, or the titles.

## Acceptance Criteria

- All three new counters have populated sections, in menu order, and **no counter renders an
  "Also here" section** on its page.
- The Bowl Shop's dressing section lists the dressings from `recipes/dressings-and-dips/` that
  genuinely belong there, and the work artifact says which were left off and why.
- One Pot shelves at least **25** recipes, the majority of them written before this story.
- Instant Pot shelves every recipe carrying `kit: Instant Pot`, and there are at least **20**.
- Every slug listed in every section resolves to a real recipe.
- The aisle-coverage test in `src/lib/shopping.test.ts` passes, and `npx vitest run` is green.
- `npm run build` succeeds and the three menu pages render.
- Only `src/data/counters.json` and `src/data/aisles.json` are modified.
