# T-004-03 — Research

What the front door, the 21 menus and the recipe page's trimmings actually do at 375px, measured
on the built site rather than read off the stylesheet. Descriptive only; the choices are Design's.

---

## 1. The four sections, where they are now

The ticket's line numbers predate T-004-01 and T-004-02, both of which added rules above them.
Current `src/styles/site.css` (876 lines):

| ticket says | is now | section |
| --- | --- | --- |
| ~208 | **315–374** | `/* ---- the counters, on the front door ---- */` |
| ~269 | **376–492** | `/* ---- one counter's menu ---- */` |
| ~387 | **494–543** | `/* ---- the recipe page's trimmings ---- */` |
| ~438 | **545–597** | `/* ---- the shelves ---- */` |

Neither section carries a width query. The file's only queries are the shell's two
(`151`, `223`, from T-004-01) and the table's two (`745`, `809`, from T-004-02), plus `@media print`
at 860.

**The breakpoint vocabulary is fixed and enforced.** The block at the top of the file names two
numbers — `snug` 44rem and `narrow` 34rem, both `[in use]` — and
`src/styles/breakpoints.test.ts` fails the build on any `@media` width that is not one of them.
It also fails if a name is tagged `[in use]` and nothing writes it. Both are already in use, so
this ticket adds no bookkeeping either way; it may write only those two literals.

**Where a query goes.** The block says: beside the rules it changes, at the end of that section,
not in one shared block at the bottom. T-004-01 and T-004-02 both did that. Four sections here
means up to four small blocks, not one.

## 2. The three pages, and what of them these sections own

### `src/pages/index.astro` (160 lines)

Order in the document: `.masthead` → `.finder` (search box + tally) → `ul.results.shelf` (hidden)
→ `p.nothing` (hidden) → `ul.counters` with 21 `li.counter` cards. Each card is one `<a>` holding
`h2` (name), `p.blurb`, `p.teaser` (four dish names joined with ` · `), `p.count`.

The finder's own section of the stylesheet (`235–313`) is **not one of the four**, and T-004-01
already worked it: the search input measured 322 × 50px at 375px there, and its review records the
shell and finder as clean at ten widths. So the finder is a thing this ticket *verifies*, not one
it edits.

The search results are drawn by the page's own script into `ul.results.shelf`, so they are styled
by **the shelves** section — one of the four. That is the only place `.results` and `.shelf` meet
on the front page.

### `src/pages/menu/[counter].astro` (96 lines)

`a.back` → `header.menu-head` (h1, blurb, count) → `div.menu` holding one `section.menu-section`
per section, each an `h2` and a `ul` of items. An item is one block `<a>` containing
`span.item-name` (with an optional `span.kit` badge), `span.item-of` (principal ingredients) and,
when the recipe has them, `span.item-aka`. A script may append `span.item-onlist` client-side.

`.menu` is a multicol: `columns: 2 19rem; column-gap: 2.5rem`.

### `src/pages/[slug].astro` (136 lines)

The trimmings, in order: `nav.crumbs` → `header.masthead` + `p.aka` → `ul.chips` (counters as
links, then servings/time/category facts) → `p.variants` → `AddToPlan` → `CookModes`/`RecipeTable`
→ `Timeline` → `p.kit-list` → `section.pairs` (an `ul.shelf` of pair cards) → `details.source`.

Of those, this ticket's sections own `.crumbs`, `.aka`, `.chips a`, `.variants`, `.kit-list`,
`.pairs` and the `.shelf` inside it. `AddToPlan`, `CookModes` and `Timeline` are **T-004-04's**
(that ticket names all three files). `.source` is a fifth section of `site.css` and belongs to
nobody yet; T-004-06 may edit any file.

## 3. Two selectors in these sections are dead

Extracted every class selector from the four ranges and grepped both the 682-page build and every
`.astro` file:

- `.shelf-group`, `.shelf-group h2`, `.shelf-group h2 .n`, `.shelf-group .blurb` (545–568) —
  **no HTML anywhere, no source anywhere.** Nothing renders it.
- `.filter` / `.filters` (261–301, the finder section, so outside the four) — same: zero
  occurrences of `class="filter` in the build.

This matters because the ticket's second bullet is "**the finder and the shelf labels** … the
labels are pressable ('pressed means showing only this') and sized for a mouse. At 21 counters
plus categories they wrap into a large block." That describes `.filter`, which no page has ever
rendered. The pressable things actually on the front door are the 21 counter cards. Design has to
decide what, if anything, a 44px rule on dead CSS is worth.

Everything else in the four sections does render: `.counter*`, `.results`, `.more`, `kbd`,
`.menu*`, `.item-*`, `.kit`, `.crumbs`, `.aka`, `.chips`, `.variants`, `.kit-list`, `.pairs`,
`.shelf`. (`.item-onlist` is created by script, so it is absent from static HTML by design.)

## 4. Measured at 375px

Method: `npm run build`, then a scratchpad copy of `scripts/check-overflow.mjs`'s CDP plumbing
that evaluates an arbitrary probe per route instead of the fixed overflow one. Headless Chrome,
`Emulation.setDeviceMetricsOverride` at 375 × 1200, viewport re-asserted after navigation and
verified before measuring (the same trap T-004-01's script documents). The probe lives in the
scratchpad, not the repository: this ticket may modify `site.css` only.

### The front door

| | |
| --- | --- |
| document height | **4998px** |
| `.counters` | top 429px, **4506px tall** — 90% of the page |
| 21 cards | min 181, median **203**, max 225px |
| `.masthead` | 185px |
| `.finder` | top **279px**, 114px tall |
| pressables under 44px | none (the 1px skip link excepted, which is the shell's) |
| body scroll | none |

Two things follow. **The finder is already above the counter list** — at a 375 × 667 phone it is
fully on the first screen, 279px down, with the first counter card starting at 429px. The ticket's
"a reader on a phone can reach the finder without scrolling past the whole counter list" is
therefore a property of document order that already holds; what does not hold is anything about
the *length* of what follows. **A 4.5k-pixel column of 21 near-identical 203px cards is roughly
seven phone screens**, and there is nothing under it.

With the search open (typed `a`, 658 hits, 60 rendered plus a "more" line): counters hidden,
result cards 20–99px, no link under 44px, no element past the right edge, document 7669px.

### The two largest menus

| | Bakery | The Bowl Shop | Pho and Banh Mi (control) |
| --- | --- | --- | --- |
| items | 107 | 103 | 18 |
| sections | 8 | 6 | 6 |
| document height | **10702px** | **11162px** | 2818px |
| used columns | **1** | 1 | 1 |
| item heights | 42 / 81 / 120 (min/median/max) | 42 / 81 / 120 | 81 / 100 / 139 |
| items under 44px | **7** | **3** | 0 |
| gap between items | 14px (`li + li` 0.85rem) | 14px | 14px |
| body scroll | none | none | none |

`columns: 2 19rem` degrades correctly: with 351px of content width, a 304px column width and a
40px gap, the used count is 1. Multicol needs no narrow-width rule — it already has one, written
in its own units.

The failure is the **42px item**: a recipe with a short name and one line of ingredients and no
aka. Seven of them on Bakery, three on The Bowl Shop. The ticket's 44px criterion bites here and
nowhere else on these pages. Note that the *gap* is 14px, so the miss is small and the fix is
small, but it is a real miss.

The other fact is height: 10.7k and 11.2k pixels, about 16 phone screens each. Median item 81px =
name (~22) + one or two lines of `.item-of` (~35) + optional `.item-aka` (~20) + the 14px gap.

### The recipe page's trimmings

`/boston-baked-beans/` — the three-way variant case the ticket asks for: a plain file whose
`variants` are Instant Pot and Slow Cooker, so the page offers all three ways.

| element | at 375px |
| --- | --- |
| `.crumbs` | 20px tall; its two links **20px** |
| `.masthead` + `.aka` | 95 + 50px |
| `.chips` | 66px, 5 chips; the two counter links **15px** |
| `.variants` | 22px, one sentence; links **17px** ("Instant Pot" 76px wide, "Slow Cooker" 84px) |
| `.kit-list` | 21px |
| `.pairs` | 275px, 3 cards |
| body scroll | none |

**Every pressable thing in the trimmings misses 44px**: crumbs 20, chip links 15, variant links
17. Nothing overflows; nothing is unreadable; it is entirely a touch-size problem. The variant
switch is the sharpest case — it is prose with two inline links in it ("Also written for *Instant
Pot*, *Slow Cooker*."), and prose cannot grow a 44px line box without becoming something else.

Also under 44px on the same page but **owned by other tickets**: `.clay-button.toggle` 35px and
`.to-list` 21px (AddToPlan → T-004-04), the three `.mode` buttons at 40px (CookModes → T-004-04),
and `.source summary` at 24px (the source section, no owner; T-004-06 may take it).

## 5. Constraints this ticket inherits

1. **Desktop must not move.** "A 1440px window renders exactly as today." T-004-02 proved this with
   `node scripts/check-overflow.mjs --shots …` before and after and compared the SHA-256 manifest —
   24 of 24 hashes identical. The same method is available here and is the only cheap proof.
2. **No body scroll at any width**, the S-004 invariant, checked by `scripts/check-overflow.mjs`
   across the whole build. It is deliberately outside `npm run verify` (it needs a browser).
3. **`npm run verify`** = `check` + `recipes` + `vitest run` + `astro build`. It does not look at
   layout; it will catch a breakpoint that is not one of the two named, via
   `breakpoints.test.ts`.
4. **Card grids are not to be rewritten** without a demonstrated failure. Both measured clean:
   `.counters` `minmax(16.5rem, 1fr)` and `.shelf` `minmax(15rem, 1fr)` are single-column at 375px
   with no overflow. There is no failure to name.
5. **Only `site.css`, and only these four sections.** The page files are read. Nothing in the
   measurements above requires markup: every gap is a size, a spacing or a visibility question,
   all of which CSS can answer.

## 6. Content extremes worth testing against

From `src/generated/recipes.json` (658 recipes):

- longest title: *Peanut, Black-Eyed Pea and Chicken Feet Soup* (44 chars) — menus and mastheads.
- most aka: `banh-mi-dac-biet`, **12** alternative names — `.aka` on the recipe page, `.item-aka`
  on the menu.
- most chips: `black-bean-soup`, 4 counters + 3 facts = **7 chips**.
- most pairs: `pita-bread`, **30** cards in `.pairs`.
- longest cookware line: `pork-liver-pate`, 65 chars.
- 39 recipes carry two variants (the three-way switch); `boston-baked-beans`, `beef-stew` and
  `birria-de-res` are the plain files of three of them.
- longest counter name: *Japanese Home Kitchen* (21 chars) — `.menu-head h1` at 2.1rem.

## 7. Open questions Design has to answer

1. **The 4.5k-pixel counter column.** Denser cards, fewer lines per card, or left alone with only
   spacing corrected? The teaser line is the largest single component of the card.
2. **Dead `.filter` rules.** Give them a 44px floor so the criterion is literally satisfied, or
   report them as unrendered and leave them? A rule nothing renders cannot be verified.
3. **The variant switch.** Inline links in a sentence cannot reach 44px as prose. Either the
   sentence becomes a row of pressable things at narrow, or the criterion is met by padding that
   overlaps neighbouring lines, or it is declared out of reach and said plainly.
4. **Menu length.** 10.7k pixels is honest for a 107-item menu; whether anything should be
   tightened per item is a judgement about how much of `.item-of` a phone reader needs.
