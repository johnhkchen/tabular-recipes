# T-004-03 — Structure

One file changes: `src/styles/site.css`. Four additions, each a `@media (max-width: 34rem)` block
at the end of its own section, in the shape the file's own header block prescribes ("put the query
beside the rules it changes, at the end of that section, not in one shared block at the bottom").

No file is created. No file is deleted. No `.astro` file is written — every change in `design.md`
is a size, a spacing or a visibility, and CSS reaches all three.

---

## The one file

`src/styles/site.css`, 876 lines before, ~200 after. Insertion points, by the line numbers as they
stand now (each insertion shifts the ones below it, so they are applied top-down and re-read
between steps):

| # | after line | ends the section | before |
| --- | --- | --- | --- |
| 1 | 374 (`kbd { … }`) | the counters, on the front door | `/* ---- one counter's menu ---- */` (376) |
| 2 | 492 (`.kit { … }`) | one counter's menu | `/* ---- the recipe page's trimmings ---- */` (494) |
| 3 | 543 (`.pairs .shelf a`) | the recipe page's trimmings | `/* ---- the shelves ---- */` (545) |
| 4 | 597 (`.shelf p { … }`) | the shelves | `/* ---- the table ---- */` (599) |

Nothing outside those four gaps is touched — not the header block (both breakpoints are already
`[in use]`), not the shell, not the finder, not the table, not `@media print`.

---

## Block 1 — the counters, on the front door

Selectors written, all existing:

```
.counters          row/column gap
.counter a         padding
.counter .blurb    bottom margin
.counter .teaser   display: none
```

Values: `gap: 0.7rem`; `padding: 1.05rem 1.15rem 0.95rem`; `margin-bottom: 0.55rem`;
`display: none`.

`.counter h2`, `.counter .count` and `.counters`' `grid-template-columns` are **not** written. The
grid is the thing the ticket says not to rewrite, and the name and the count are the label.

Comment carries: what the card is at narrow (name, sentence, count), the measured cost of the
teaser (840px of 4505), and the fact that hiding it removes it for screen readers too and that
this is deliberate.

## Block 2 — one counter's menu

```
.menu-head h1      font-size: clamp(1.7rem, 6.2vw, 2.1rem)
.menu-section a    display: block is already set; add min-height: 44px
```

Nothing else. `.menu` (the multicol), `.menu-section h2`, `.item-*` and `.kit` are left alone —
`design.md` records why for each.

The clamp is chosen so that at 544px it evaluates to 2.1rem, the same value the unqueried rule
holds there: `6.2vw` of 544px is 33.7px, above the 2.1rem ceiling, so it clamps to 33.6px. Below
440px it rests on the 1.7rem floor. The comment states this, because a reader checking the
breakpoint for a visible step needs the arithmetic, not the assurance.

## Block 3 — the recipe page's trimmings

```
.crumbs a          inline-flex, centred, min-height: 44px
.chips li          inline-flex, centred, min-height: 44px
.chips a           align-self: stretch, flex, centred   (fills the pill)
.variants a        inline-flex, centred, min-height: 44px
```

`.chips li` is defined in the page-furniture section (202), not here. It is written here anyway and
the comment says why: `.chips` renders on the recipe page and nowhere else, so this is the section
that owns its narrow behaviour, and editing another ticket's lines is what section ownership
exists to prevent. This is the only cross-section selector in the change.

Not written: `.aka`, `.kit-list`, `.pairs h2`, `.crumbs` itself. All are text, all measured
readable at 375px, none pressable.

## Block 4 — the shelves

```
.shelf             gap: 0.8rem
.shelf a           padding: 1.1rem 1.2rem
```

`grid-template-columns` untouched. `.shelf-group` untouched and reported as dead in `review.md`.

Note the double duty: `.shelf` styles the pair cards on a recipe page *and* the search results on
the front door (`ul.results.shelf`), so this block is verified on both. `.pairs .shelf a` at 543
sets its own padding for pair cards and sits *above* this block, so the narrow padding here wins by
order for pair cards too — intended, and stated in the comment so the next reader does not
"fix" it.

---

## Ordering, and why it is this order

The four blocks are independent — different selectors, different pages, no cascade between them.
They are applied and committed in section order (front door → menu → trimmings → shelves) because
that is the order the ticket lists them and the order they appear in the file, which makes the
diff read top-to-bottom against both.

Three commits through `lisa commit-ticket`, each a unit that could stand alone:

1. **the front door** — block 1. Verifiable on its own: `/` at 375px, `.counters` height falls from
   4505 to ~3150, no overflow, 1440px unchanged.
2. **the menu** — block 2. Verifiable on its own: Bakery and The Bowl Shop at 375px, zero items
   under 44px, `h1` 33.6px at 544 and 27.2px at 375.
3. **the trimmings and the shelves** — blocks 3 and 4 together: both are the recipe page's
   furniture below and around the table, both are verified on the same page load
   (`boston-baked-beans` for the variant switch, `pita-bread` for 30 pair cards), and splitting
   them would mean measuring the same pages twice for no additional signal. Block 4's other client,
   the front-page search results, is verified in the same step.

## Boundaries this change does not cross

| thing | at 375px | owner |
| --- | --- | --- |
| `.clay-button.toggle` 35px, `.to-list` 21px | under 44 | T-004-04 (`AddToPlan.astro`) |
| three `.mode` buttons, 40px | under 44 | T-004-04 (`CookModes.astro`) |
| `.source summary`, 24px | under 44 | unowned; `site.css` "the source" section — T-004-06 |
| `.filter` / `.filters`, the ticket's "shelf labels" | not rendered anywhere | reported, not styled |
| `.shelf-group` | not rendered anywhere | reported, not deleted |
| the finder (`.search input`, 322 × 50px) | passes | T-004-01, already done |
| `.counters` / `.shelf` `grid-template-columns` | pass | not to be rewritten without a failure |

## Verification surface (detail in `plan.md`)

- `npm run verify` — includes `breakpoints.test.ts`, which fails on any width literal other than
  44rem and 34rem.
- `node scripts/check-overflow.mjs --width 375` — all 682 pages, the S-004 invariant.
- `node scripts/check-overflow.mjs --width 1440 --shots …` against the 16-shot baseline already
  captured in the scratchpad — SHA-256 equality is the desktop-unchanged proof.
- A scratchpad CDP probe for the per-element numbers (card heights, item heights, tap targets).
  Not added to the repository: this ticket may modify `site.css` only.
