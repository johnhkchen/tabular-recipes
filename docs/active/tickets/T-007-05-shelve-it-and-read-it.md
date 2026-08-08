---
id: T-007-05
story: S-007
title: shelve-it-and-read-it
type: task
status: done
priority: high
phase: done
depends_on: [T-007-02, T-007-03, T-007-04]
---

## Context

Put the cha chaan teng on its board, catch its ingredients, and then read the whole collection
once — because the thing S-007 changed is the shape of the shelf, and no writer ticket can see
that from inside one folder.

**You own `src/data/counters.json`, `src/data/aisles.json`, `docs/gaps/cha-chaan-teng.md` and
`docs/gaps/README.md`.** Three tickets held two of those before you: T-007-01 opened the counter,
T-007-02 removed The Soup Pot and rehomed eight soups. Read all three work artifacts in
`docs/active/work/T-007-0*/` before touching anything — they were written for you.

### 1. Fill the sections

T-007-01 created the counter with ordered section titles and empty item lists. Fill them with
slugs, in menu order.

A section may list a recipe that never names the counter — that is how a shelf borrows, and this
board borrows more than most. The ones that matter:

- **`egg-custard-tart` and `pineapple-bun`** are at the Bakery and belong in the bun case here too.
- **`club-sandwich`, `beef-chow-fun` and `lo-mein`** are already written. T-007-01's work list said
  for each whether it is a shelving job or a distinct dish; apply that, and say in the work
  artifact where you disagreed with it and why.
- **Whatever T-007-02 rehomed onto this counter**, if it put a 滾湯 in the 餐湯 slot.

A recipe on two boards is normal and correct. A recipe on the wrong board is the failure.

### 2. Catch the new ingredients

This shelf brings tins and packets the collection has never seen: evaporated milk, condensed milk,
tinned luncheon meat, instant noodles, custard powder, golden syrup, the tea blend. Run the
aisle-coverage test in `src/lib/shopping.test.ts` — it prints what has no aisle — and add patterns
to `src/data/aisles.json` for the real ones.

The hazards, which are easy to repeat:

- **Most-specific pattern wins across aisles, not within one.** A bare `milk` added to an aisle
  can steal `evaporated milk` from a more specific pattern elsewhere. **`condensed milk` and
  `evaporated milk` are two different tins** and a pattern that catches both is a silent wrong
  shelf, not a build error.
- **A pack size in the wrong system says nothing.** `purchaseOf` returns null rather than compare
  grams to cups. Do not add a pack size to make a badge appear.
- The Soup Pot's dried goods left patterns behind in `aisles.json` — 霸王花, 菜乾 and the rest.
  T-007-02 deleted their recipes. **Leave dead patterns alone unless one of them now steals
  something**; a pattern with nothing matching it costs nothing, and removing patterns is a
  separate job with its own risk.

### 3. Check the shelf reads as a shelf

Build and open `/menu/cha-chaan-teng`. A counter whose items all land in "Also here" has section
titles that do not match what got written — fix the placement, or the titles.

Then open the menus index and the front page. **The Soup Pot card is gone from both** and the
grid has to still look deliberate at 20 counters. T-004-03 owns how those pages lay out; if
removing one card breaks a row, that is a finding for the work artifact, not a licence to restyle.

### 4. Read the whole collection

Then do the pass no writer ticket can do. Specifically:

- **Nothing orphaned.** 0 orphans, and the count is 16 recipes lower than the story started at
  plus whatever T-007-03 and T-007-04 wrote.
- **The tally in `docs/gaps/README.md` is current.** It still describes a fifteen-counter shelf
  in places and there are now twenty. Rewrite the tally rows for every counter that moved and say
  in the file which counters this story touched.
- **The alias collisions.** Sixteen files sharing *lo fo tong* just left the collection and a
  block of Cantonese `aka` lines just arrived. Re-run the duplicate-name check. Two recipes
  answering to the same board word is sometimes honest and sometimes sends a searcher to the wrong
  table — say which each one is, the way T-002-09 did.
- **The five gaps to fill first, in `docs/gaps/README.md`.** Gap 5 was *a drink that is brewed*.
  If T-007-03 wrote the milk tea, that gap is closed and the list needs rewriting rather than
  ticking. Re-rank what is left.
- **Whether the new shelf kept its promise.** S-007's claim is that this counter is cookable from
  an ordinary supermarket. Check it against the files rather than asserting it: every ingredient
  on the shelf, and which aisle each landed in. If something needs a specialist shop, name it —
  one or two is fine and honest, eighteen would mean the story failed.

## Acceptance Criteria

- Cha Chaan Teng has populated sections, in menu order, and **renders no "Also here" section**.
- It shelves at least **20** recipes, including at least four written before this story, and the
  work artifact names which were borrowed and from where.
- Every slug listed in every section resolves to a real recipe.
- The aisle-coverage test passes, and `condensed milk` and `evaporated milk` resolve to different
  patterns. Show both.
- No pattern added to `aisles.json` steals a product from a more specific pattern elsewhere —
  demonstrate by diffing the resolved aisle of every ingredient before and after.
- `docs/gaps/cha-chaan-teng.md`'s `## What it has` block is rewritten from the built shelf and
  `node scripts/menu-sections.mjs` reproduces `src/data/counters.json` from it.
- `docs/gaps/README.md`'s tally covers all twenty counters, The Soup Pot's row is gone, and the
  five-gaps list is re-ranked against what this story closed.
- The duplicate-name check is run and every collision is classed as honest or wrong, with the
  wrong ones fixed.
- The work artifact lists **every ingredient on the new shelf with the aisle it resolved to**, and
  names any that need a specialist shop.
- `npm run verify` passes end to end: every file draws a table, every recipe parses, tests green,
  every page builds, 0 orphans, 0 counters inferred from category, 0 parser warnings, 0 duplicate
  slugs.
- Only `src/data/counters.json`, `src/data/aisles.json`, `docs/gaps/cha-chaan-teng.md`,
  `docs/gaps/README.md` and `docs/active/work/T-007-05/**` are modified. **No `.cook` file is
  edited here** — a recipe that needs a fix is a finding, not a fix.
