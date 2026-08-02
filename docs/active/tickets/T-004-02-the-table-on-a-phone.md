---
id: T-004-02
story: S-004
title: the-table-on-a-phone
type: task
status: done
priority: critical
phase: done
depends_on: [T-004-01]
---

## Context

The signature ticket. The table is what this site is, and **75% of recipes do not fit on a
phone**.

```css
.recipe-table { min-width: 30rem }     /* 480px — a 375px phone scrolls 105px before content */
.cell--op     { min-width: 4.75rem; max-width: 8.5rem }
.cell--ingredient .qty { min-width: 4.4rem }
```

| Columns | Recipes | Minimum width | Scroll at 375px |
| --- | --- | --- | --- |
| 4 or fewer | 162 | ≤25rem | fits |
| 5 | 294 | ~30rem | ~105px |
| 6 | 179 | ~35rem | ~185px |
| 7 | 23 | ~39.5rem | ~257px |

The CSS is in `src/styles/site.css` under `/* ---- the table ---- */` (~line 492).
`RecipeTable.astro` holds the markup and the tap-to-cross-off behaviour and has no styles of its
own.

## Read this before designing

**Keep the table.** Do not reflow it into stacked cards, an accordion, or a step list at narrow
widths. The table is a merge tree drawn sideways and the shape carries information a list
cannot — it is the entire reason this site exists rather than being another recipe app. A design
that dissolves the table on mobile has removed the product.

The job is to make a wide table honest and navigable on a narrow screen:

1. **The ingredient column stays put while the operations scroll.** A cook scrolled three
   columns right must still see which ingredient row they are on, or the table stops meaning
   anything. This is the change that carries the ticket.
2. **The scroll announces itself.** Right now it is discovered by accident, or not at all — a
   reader can easily believe a 7-column recipe has 4 operations. Whatever form this takes, it
   must reflect what the render actually did: shown only when the table genuinely overflows,
   never as decoration.
3. **Tighter metrics at narrow widths.** Cell padding is `0.62rem 0.85rem`; the quantity holds a
   `4.4rem` minimum; operations hold `4.75rem`. Tightening these buys maybe a fifth of the width
   back. **Worth having, not a solution** — do not let it substitute for (1) and (2).

## Hazards specific to this table

- **Rowspans and `position: sticky` interact badly.** The ingredient column is one cell per row,
  but operation cells span many rows. Test the sticky column against a deep tree — `mole`,
  `rendang`, or any 16-row recipe — not just a 6-row one.
- **The existing border comment is load-bearing** (`site.css` ~522): there are deliberately no
  `:first-child`/`:last-child` border resets, because with rowspans the last `<td>` in a row is
  usually not the last column. A sticky column that adds its own edge must not reintroduce that
  bug. Read the comment before touching the borders.
- **`.table-scroll` owns the frame, not the table**, so collapsed cell borders cannot fight it.
  A sticky cell that scrolls over the frame will look wrong unless the layering is deliberate.
- **Tap-to-cross-off must keep working.** Cells are interactive; a sticky column must not
  swallow or duplicate taps, and cell tap targets should reach 44px at narrow widths.

## Acceptance Criteria

- A 7-column recipe is readable and navigable at 375px: the operations scroll, the ingredient
  column stays in view, and the reader can always tell which row they are on.
- The overflow affordance appears only when the table actually overflows its container, and is
  absent when it fits. Verified at 375px and at 1440px on the same recipe.
- The sticky column is correct on a deep tree with large rowspans — name the recipes tested in
  the work artifact, including at least one 15+ row file.
- No `:first-child`/`:last-child` border resets are introduced; the tiling still reads as one
  frame. The `findTilingErrors` invariant still holds.
- Tap-to-cross-off works at 375px, including on the sticky column, with tap targets ≥44px.
- No horizontal scroll on `<body>` — the table scrolls inside `.table-scroll` only.
- A 1440px window renders exactly as today. Say in the work artifact how this was confirmed.
- Uses the breakpoints T-004-01 named. No new numbers.
- `npm run verify` passes.
- Only `src/styles/site.css` (the table section) and `src/components/RecipeTable.astro` are
  modified.
