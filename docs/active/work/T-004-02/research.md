# T-004-02 — Research

What the table is made of, what it actually measures at 375px, and which of the ticket's
hazards are real. Everything numeric below was measured in Chrome against the built site, not
reasoned about.

---

## The two files

### `src/components/RecipeTable.astro` (~140 lines)

Markup, then a module script. No styles of its own — the ticket is right about that.

```
figure.table-well.clay-well
  div.table-scroll                 ← the only thing that scrolls sideways
    table.recipe-table[data-slug]
      caption.visually-hidden      ← "ingredients down the left, what to do with them across"
      tbody
        tr > td.cell.cell--prep[colspan=colCount]     ← headers, 0..n
        tr > td.cell.cell--ingredient | .cell--op | .cell--blank
        tr > td.cell.cell--prep[colspan=colCount]     ← footers, 0..n
  figcaption.table-foot
    span.hint   "Tap anything to cross it off."
    button.reset[hidden]  "Clear the marks"
```

The script, per `.recipe-table` on the page:

- reads `localStorage['tabular-recipes:<slug>']` into a `Set` of cell ids;
- for every `[data-cell]` sets `tabIndex = 0`, `role="button"`, `aria-pressed`, and a `click` +
  `keydown` (Enter/Space) handler that toggles `data-done` and saves;
- unhides `.reset` when the set is non-empty.

Two consequences for this ticket. Every cell is already a real control, so a sticky column
inherits working taps as long as nothing is painted over it. And the component already has a
precedent for JS-driven visibility: `.reset` is `hidden` in the HTML and revealed by measurement
of state, never by CSS guessing.

### `src/styles/site.css`, `/* ---- the table ---- */` (599–706)

| rule | what it is doing |
| --- | --- |
| `.table-well` | the clay well; `padding: clamp(0.7rem, 1.6vw, 1rem)`; owns `--frame` / `--line` |
| `.table-scroll` | `overflow-x: auto`, the **1.5px frame**, `border-radius`, raised background |
| `.recipe-table` | `width: 100%`, **`min-width: 30rem`**, `border-collapse: collapse` |
| `.cell` | `border: 1px solid var(--line)`, `padding: 0.62rem 0.85rem`, `cursor: pointer` |
| `.cell--ingredient` | `width: 100%` (absorbs all slack), `border-right: 1.5px solid var(--frame)` — the spine |
| `.cell--ingredient .qty` | `inline-block`, `min-width: 4.4rem`, tabular numerals |
| `.cell--op` | `min-width: 4.75rem`, `max-width: 8.5rem`, display font, tinted |
| `.cell--prep` | full-width band, `border-bottom-color: var(--frame)` |
| `.cell[data-done]` | **`opacity: 0.4`** + line-through |
| `.table-foot` | `display: flex; justify-content: space-between; gap: 1rem` |

The comment at 629–634 is the load-bearing one: no `:first-child` / `:last-child` resets,
because with rowspans the last `<td>` in a row is usually not the last column.

---

## The collection, recomputed

`layout(buildTree(recipe))` over all 658 recipes:

| columns | recipes | deepest examples |
| --- | --- | --- |
| 3 | 7 | — |
| 4 | 155 | `biryani` 19 rows, `date-squares` 10 |
| 5 | 294 | `xiao-long-bao` 18, `mole-poblano` 15 |
| 6 | 179 | `pineapple-bun` 18, `sancocho` 18, `beef-rendang` 14 |
| 7 | 23 | `miso-ramen` 14, `pastrami` 14, `paella` 13 |

The ticket's table is accurate (162 = 7 + 155). Note `mole` does not exist; the ticket means
**`mole-poblano`** (5 columns, 15 rows). The deepest tree on the site is `biryani` at 19 rows,
and it is only 4 columns wide.

---

## Baseline at 375px, measured

`.table-scroll` gets **327px** of width at a 375px viewport (375 − 24 body padding − 22.4 well
padding − 3 frame). Then:

| recipe | cols | table width | sideways scroll | ingredient col | shortest cell |
| --- | --- | --- | --- | --- | --- |
| `miso-ramen` | 7 | 651px | **324px** | 168px | 68.8px |
| `pastrami` | 7 | 646px | 319px | 162px | 68.8px |
| `beef-rendang` | 6 | 606px | 279px | 187px | 44.8px |
| `gyoza` | 6 | 524px | 197px | 138px | 68.8px |
| `mole-poblano` | 5 | 480px | 153px | 167px | 44.8px |
| `aioli` | 5 | 480px | 153px | 171px | 44.8px |
| `biryani` | 4 | 480px | 153px | 231px | 44.8px |
| `conchas` | 4 | 480px | 153px | 240px | 44.8px |

Three facts fall out of this table that the ticket does not say.

**1. Nothing fits. Not one recipe on the site fits a 375px phone today** — including the 162
recipes the ticket lists as "fits". `min-width: 30rem` is 480px and the container is 327px, so
every table on the site scrolls at least 153px. The smallest recipe in the collection scrolls as
far as a 5-column one.

**2. `min-width: 30rem` is a phone-only rule that nobody wrote as one.** With `width: 100%` the
table already fills its container, so the minimum can only bind when the container is *below*
480px — which happens under a viewport of about **529px**, i.e. entirely inside `narrow`
(544px). Above that it is inert. It is the single largest contributor to sideways scroll on a
phone and it is invisible on every other screen.

**3. Half the screen is ingredients.** The ingredient column takes 138–240px of the 327px box.
Where the table is stretched by `min-width` (4- and 5-column recipes) the column absorbs all the
slack, so the *narrower* the recipe, the *wider* the column: `conchas` gives 240px of 327 to
ingredients and 87 to the three operations. `conchas` at 375px shows the ingredient column and
**one** of its three operations. That is the ticket's "a reader can easily believe a 7-column
recipe has 4 operations", and it is worst on the small recipes, not the big ones.

Body scroll: `0` on all 682 pages (T-004-01 measured it and `check-overflow.mjs` re-measures it).
The table's overflow is held by `.table-scroll`, which is the pattern S-004 mandates.

---

## The hazards, tested

### Sticky and `border-collapse: collapse` — real, and worse than "badly"

Injected `.cell--ingredient { position: sticky; left: 0 }` into a built `/miso-ramen/` at 375px,
scrolled to the right end, screenshotted.

The column **stays and the taps still work** — but it arrives **with no borders at all**. Under
`border-collapse: collapse` the borders belong to the *table*, not the cell, and are painted at
the table's coordinates; the cell travels and its edges do not. The spine
(`border-right: 1.5px`), the row hairlines and the outer left hairline all stay behind, leaving
an unbordered slab of background beside a fully drawn table. Row boundaries in the sticky column
disappear, which is exactly the "tell which row you are on" the ticket is buying.

Box-shadow is the property that does travel, and it is not a border, so it introduces no
`:first-child`/`:last-child` reset. Tested: `box-shadow: inset …` **on top of** the existing
border gives a visible **double line** (the collapsed border and the shadow are 1px apart). The
combination that draws correctly is `border: 0` on the sticky cell plus insets for the three
edges the cell must now draw itself.

### `opacity: 0.4` on a sticky cell — a leak the ticket does not list

Crossed off two ingredients, then scrolled right: the operation cells **read through** the
crossed-off ingredient cells. `opacity` fades the element's background as well as its text, so a
sticky cell at 0.4 stops being opaque and the scrolling table shows through it. This is invisible
today because nothing is sticky. Ingredient cells contain only `<span>` children
(`.qty`/`.note`/`.name` — `layout.ts` gives every ingredient cell `parts`), so the fade can be
moved off the cell and onto its children without touching the markup.

### Rowspans — not where the ticket expects

`layout.ts` puts **every** ingredient at `col: 1, rowSpan: 1`; ops and blanks only ever occupy
columns 2..n. So the sticky column is a column of single-row cells, and the deep-rowspan cells
(`boil 3 min` spanning 8 rows) are the ones that scroll *past* it. The interaction still has to
be tested against a deep tree — a tall op cell scrolling under a stack of short sticky cells is
where a z-index or background mistake shows — but there is no sticky-cell-with-rowspan case in
the collection, by construction.

The one thing that genuinely cannot be pinned is `.cell--prep`: it spans every column, so it is
already as wide as the table and has nothing to stick to. Full-width bands will scroll.

### The frame — safe by clipping

`.table-scroll` has `overflow-x: auto`, so its content is clipped to its padding box: a sticky
cell physically cannot paint over the 1.5px frame or outside the `border-radius`. Confirmed in
the screenshots — the frame's left edge and rounded corner survive with the column pinned
against them. The ticket's warning applies to a design that puts the sticky element outside the
scroller, which this is not.

### Tap targets — already at the line

Shortest cell today at 375px is **44.8px** (`0.62rem × 2` block padding + a 24px line + border).
It clears 44 by 0.8px. Any tightening of *block* padding breaks the criterion; tightening
*inline* padding does not. Whatever is done to metrics, the block padding is load-bearing.

---

## What is available to build on

**The breakpoints (T-004-01).** `snug max-width: 44rem [reserved]` and
`narrow max-width: 34rem [in use]`, declared at `site.css:10–48`. `snug` was reserved *for this
ticket*: the block's own arithmetic says a 7-column recipe stops fitting at 44.5rem. Measured
confirmation — at a 700px viewport (inside `snug`, outside `narrow`) `miso-ramen` still needs
651px in a 618px box. So the band between the two breakpoints is real and non-empty, and it is
where a sticky column earns its keep without any of the narrow-width metric changes.

**`src/styles/breakpoints.test.ts`** reads the set out of the comment block and fails the build
on a third number. It also asserts that anything tagged `[in use]` is written by a real query —
so tagging `snug` as in use is only legal once a `44rem` query exists, and leaving it `[reserved]`
after writing one is not caught (the test is one-directional).

**`scripts/check-overflow.mjs`** serves `dist/`, drives the installed Chrome over CDP, and reports
body-level horizontal scroll per page per width; `--shots` writes full-page PNGs plus SHA-256
hashes, which is how T-004-01 proved "1440px renders exactly as today". Both jobs this ticket
needs are already tooled.

**`findTilingErrors`** (`src/lib/layout.ts:129`) is a check on the *model* — every (row, column)
covered exactly once — run by `npm run check` over all 658 recipes. No CSS can affect it; it stays
green as long as the markup keeps emitting the same rowspans and colspans.

`npm run verify` = `check` → `recipes` → `vitest run` → `astro build`. Currently 9 test files,
831 tests, 682 pages.

---

## Constraints this ticket inherits

- **Only two files.** `src/styles/site.css` (the table section) and `RecipeTable.astro`. That
  rules out a new test file, a new script, and any change to `package.json`.
- **No new numbers in width queries.** `44rem` and `34rem`, or nothing. Values inside
  declarations (padding, min-width on a cell) are not breakpoints and the test says so explicitly.
- **1440px must be pixel-identical.** Every rule that changes the drawing has to sit inside a
  `max-width` query, or be gated on an attribute that measurement never sets on a desktop.
- **The table must stay a table.** No reflow, no cards, no accordion.
- **No JS-free regression.** The affordance may be JS-driven — `.reset` already is — but the
  table itself must keep working without it.
