---
id: T-004-06
story: S-004
title: read-it-on-a-phone
type: task
status: done
priority: high
phase: done
depends_on: [T-004-04, T-004-05]
---

## Context

Five tickets each fixed their own surface. This one reads the whole site at phone width and
catches what no single ticket could see, then verifies.

Nothing runs in parallel with it. It may edit any file.

### 1. Walk the site at three widths

**375px, 390px, 768px.** The narrowest phone still in real use, the common modern one, and a
tablet in portrait. At each:

- the front page, with all 21 counters
- the two largest menus — The Bowl Shop (103) and Bakery (107)
- a 7-column recipe, a 4-column one, and a 16+ row one
- a recipe with a three-way variant switch (plain / Instant Pot / Slow Cooker)
- a timeline with an extreme ratio — an 11-hour stock, or an 8-hour slow cooker
- the prep and cook views
- the shopping list with six or more aisles
- the 404 page, which no ticket owned and which nobody has looked at

### 2. The invariant

**No horizontal scroll on `<body>`, on any page, at any width.** T-004-01 chose how this is
tested; use that, and run it across the whole built site rather than a sample. One overflowing
element on one page is the failure this ticket exists to catch.

### 3. One vocabulary

Five tickets wrote media queries. Confirm they all use the breakpoints T-004-01 named, and that
no near-duplicate number crept back in. If two tickets disagreed about a value, resolve it here
and say which you kept.

### 4. Desktop is unchanged

The whole story is additive narrow-width rules. A 1440px window must render exactly as it did
before T-004-01. Prove it rather than asserting it — a before/after comparison on a handful of
representative pages, with the method named in the work artifact.

### 5. What is still wrong

Write `docs/gaps/mobile.md`: what the site still does badly on a phone, ranked. Some of this
will be real — a 7-column table is a hard problem and the sticky column is a mitigation, not a
cure. Say so plainly, so the next pass starts from an honest list rather than re-deriving it.

## Acceptance Criteria

- Every page in the built site renders at 375px with no horizontal scroll on the body, checked
  across the whole build rather than a sample.
- The surfaces listed above are walked at 375px, 390px and 768px, with findings in the work
  artifact — including the 404 page, which no other ticket owned.
- One breakpoint vocabulary across every file; any disagreement between tickets is resolved and
  the resolution recorded.
- Desktop rendering at 1440px is demonstrably unchanged, by a stated method.
- Tap targets are ≥44px on every interactive element: table cells, shelf labels, tick-offs,
  the view toggle, the plan button.
- `docs/gaps/mobile.md` exists and ranks what is still wrong.
- `npm run verify` passes in full.
- Any file may be edited; the work artifact names each one changed and says why.
