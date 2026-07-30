---
id: T-001-17
story: S-001
title: shelve-and-place
type: task
status: open
priority: high
phase: ready
depends_on: [T-001-02, T-001-03, T-001-04, T-001-05, T-001-06, T-001-07, T-001-08, T-001-09, T-001-10, T-001-11, T-001-12, T-001-13, T-001-14, T-001-15, T-001-16]
---

## Context

The counter tickets wrote recipes and deliberately did not touch `src/`, because two of its files
are shared by all fifteen of them and concurrent edits to one file are a missing dependency edge,
not a merge to resolve. This ticket owns those two files and runs after every writer.

**`src/data/counters.json`** lists each counter's menu sections explicitly, as an ordered array of
`{title, items:[slug]}`. A recipe not named in any section still appears — `menuFor()` gathers
leftovers into an "Also" section so a menu can never quietly lose a dish — but "Also" is a
fallback, not a menu. Every new recipe belongs in a section its board would actually print. Several
sections currently exist in `docs/gaps/*.md` as headings with nothing under them ("Phở (P)",
"Chow Mein / Chop Suey", "From the pit"); those are the sections the new dishes should fill.

**`src/data/aisles.json`** decides where each ingredient is picked up in a shop and what a shop
sells it in. New recipes bring new ingredients, and one that matches no pattern falls to "Anything
else" at the bottom of the shopping list.

## Acceptance Criteria

- Every recipe shelved at a counter appears in one of that counter's named sections. Verify with
  a script over `src/generated/recipes.json` and `counters.json`; no counter renders an "Also"
  section.
- Section titles are the ones a real board prints, taken from `docs/knowledge/counters.md` and
  `docs/gaps/`, not the recipe categories.
- Ingredients falling to "Anything else" stay under 2% of the collection, water excepted — it is
  the one thing no shop sells, and `src/lib/shopping.test.ts` already excludes it. Add patterns
  for the rest, to the aisle a shopper would actually walk to.
- Where a new ingredient is bought in a package the list should reason about, it gets a `packs`
  entry. Sizes are the common supermarket unit and are never used to convert an amount.
- `npx vitest run` passes, including the aisle-coverage test.
- Only `src/data/counters.json` and `src/data/aisles.json` are modified.
