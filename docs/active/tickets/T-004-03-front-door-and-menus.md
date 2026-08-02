---
id: T-004-03
story: S-004
title: front-door-and-menus
type: task
status: done
priority: high
phase: done
depends_on: [T-004-02]
---

## Context

The front page, the 21 counter menus, and the recipe page's trimmings. Four sections of
`src/styles/site.css`:

```
~208  the counters, on the front door
~269  one counter's menu
~387  the recipe page's trimmings
~438  the shelves
```

None of the pages that use them — `index.astro`, `menu/[counter].astro`, `[slug].astro` — has a
single width query.

**Chained behind T-004-02 because it is the same stylesheet**, not because it needs the table's
outcome. Read what that ticket did before starting.

## What is actually broken, and what is not

Start by checking rather than assuming: **the card grids already respond.**
`repeat(auto-fill, minmax(16.5rem, 1fr))` (~213) and `minmax(15rem, 1fr)` (~466) collapse to one
column correctly at 375px. Do not rewrite what works — that is width the ticket can spend
elsewhere.

What has no narrow-width behaviour:

- **The counter list at 21.** It has grown from 15 to 21 this month and nothing about its
  presentation has changed. On a phone that is a long column of cards before a reader reaches
  anything else. Whether that wants collapsing, a denser card at narrow widths, or simply
  correct spacing is design's call — but a reader arriving on a phone should be able to reach
  the finder without scrolling past everything.
- **The finder and the shelf labels.** The labels are pressable ("pressed means showing only
  this") and sized for a mouse. At 21 counters plus categories they wrap into a large block.
- **One counter's menu.** Section headings, item rows, and whatever the menu prints per item.
  The Bowl Shop shelves 103 recipes and Bakery 107 — those are the pages to test against, not a
  20-item one.
- **The recipe page's trimmings** — the header, metadata, pairings, variant switch. The variant
  switch is new this month and now shows up to three ways to cook one dish; it has never been
  looked at narrow.

## Acceptance Criteria

- `index.astro` renders at 375px with no horizontal scroll on the body: counters, finder, shelf
  labels, and whatever else the page carries.
- A reader on a phone can reach the finder without scrolling past the whole counter list. Say in
  the work artifact what you did and why.
- `menu/[counter].astro` renders at 375px, tested against the two largest menus — The Bowl Shop
  (103) and Bakery (107) — named in the work artifact.
- `[slug].astro`'s trimmings render at 375px, including a recipe with a three-way variant switch
  (a dish with a plain, an Instant Pot and a Slow Cooker file).
- Shelf labels and any other pressable element reach 44px tap targets.
- The card grids are not rewritten unless a specific failure is demonstrated and named.
- A 1440px window renders exactly as today.
- Uses the breakpoints T-004-01 named. No new numbers.
- `npm run verify` passes.
- Only `src/styles/site.css` (the four sections above) is modified. The page files are read, not
  written, unless a change genuinely cannot live in CSS — in which case say so.
