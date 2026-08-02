# T-004-02 — Review

The ingredient column stays put while the operations scroll, the table says when it continues
past the edge, and the 480px floor that made **every one of 658 recipes** scroll on a phone is
gone. Three commits, two files, no new files, no dependency.

---

## What changed

| file | commit | what |
| --- | --- | --- |
| `src/styles/site.css` | `1e052fd` | `snug` → `[in use]`; a `@media (max-width: 44rem)` block: sticky ingredient column, its edges redrawn as shadows, the 44px cell floor, the crossed-off fix |
| `src/styles/site.css` | `e93dca1` | a `@media (max-width: 34rem)` block: `min-width: 0`, tighter inline padding, `.qty`, `.cell--op` |
| `src/styles/site.css` | `97310a8` | `.table-view`, the edge cue, `.table-more` |
| `src/components/RecipeTable.astro` | `97310a8` | one wrapper `<div>`, one hidden `<span>`, ~20 lines of measurement in the existing script |

+124 lines of CSS, +25 of component (the rest of that file's diff is re-indentation from the
wrapper). Nothing outside the table section of `site.css` was touched; `src/pages/list.astro`
in the working tree belongs to T-004-05, running in parallel.

### The three decisions worth a reviewer's time

**1. The pinned column had to give up its borders.** Under `border-collapse: collapse` borders
belong to the table and are painted at the table's coordinates — the cell travels, its edges stay
behind. Measured, not assumed: a naive `position: sticky` produces an unbordered slab beside a
fully drawn table. So `.cell--ingredient` takes `border: 0` and redraws three edges as inset
shadows, which travel. No `:first-child`/`:last-child` is involved, so the comment at
`site.css:629` keeps its meaning; the one edge left undrawn is the bottom of the last row, which
sits against the frame where a missing hairline cannot show.

**2. `opacity` on a sticky cell is a leak.** `.cell[data-done] { opacity: 0.4 }` fades a cell's
*background* too, so a crossed-off ingredient stopped being opaque and the scrolling operations
read straight through it. Fixed by moving the fade to the cell's spans, which is possible because
`layout.ts` gives every ingredient cell `parts` and therefore only `<span>` children. Gated in
the media query so a desktop crossed-off cell still fades exactly as today.

**3. `min-width: 30rem` was a phone-only rule that read like a general one.** With `width: 100%`
the table already fills its container, so a 480px floor can only bind below a ~529px window. What
it did there was force *every* recipe — including the 162 the ticket lists as fitting — to scroll
at least 153px, and hand the surplus to the ingredient column, which has `width: 100%` and
absorbs it. `conchas` gave 240px of a 327px screen to ingredients and showed one of its three
operations. This is the change with the largest measured effect and the ticket does not mention
it; if a reviewer disagrees with it, it is one declaration to revert and the rest still stands.

---

## Acceptance criteria against evidence

| criterion | evidence |
| --- | --- |
| a 7-column recipe is readable and navigable at 375px | `miso-ramen`: operations scroll, column pinned at 1px from the scroller's edge on all 14 rows, sideways scroll 324 → **238px** |
| the affordance appears only when the table overflows; verified at 375px **and 1440px on the same recipe** | `conchas` at 375px: `over: 0`, no `data-more`, cue still `hidden`. `conchas` at 1440px: same. `miso-ramen` at 375px: `data-more` set, cue shown; at 1440px: absent |
| correct on a deep tree with large rowspans; **name the recipes, ≥1 file of 15+ rows** | below |
| no `:first-child`/`:last-child` resets; the tiling still reads as one frame; `findTilingErrors` holds | no positional selector added (`grep` clean); screenshot at rest matches the pre-change build; `npm run check` runs `findTilingErrors` over 658 recipes, green |
| tap-to-cross-off works at 375px including the sticky column, targets ≥44px | taps tested on three recipes scrolled to the right end; **shortest cell ≥44px on 12 recipes at 375px and 320px** |
| no horizontal scroll on `<body>` | **682 pages at 375px, clean**; 100 page views across ten widths from 320 to 1440, clean |
| a 1440px window renders exactly as today; say how | **24 of 24 screenshot hashes identical** — method below |
| uses the breakpoints T-004-01 named, no new numbers | only `44rem` and `34rem`; `breakpoints.test.ts` passes and now polices `snug`'s `[in use]` tag |
| `npm run verify` passes | 9 test files, **831 tests**, 682 pages |
| only `site.css` (the table section) and `RecipeTable.astro` modified | two files, three commits |

### Deep trees, named

All at 375px, scrolled to the right end, checking that the column stays pinned on every row and
that tall rowspan cells pass under it cleanly.

| recipe | shape | result |
| --- | --- | --- |
| `biryani` | 4 × **19** | pinned rows 1 and 19; taps toggle; an op cell 1420px tall scrolls under |
| `pineapple-bun` | 6 × **18** | pinned throughout |
| `xiao-long-bao` | 5 × **18** | pinned throughout |
| `mole-poblano` | 5 × **15** | the ticket's "mole" — pinned, taps verified |
| `pastrami` | 7 × 14 | widest, pinned |
| `miso-ramen` | 7 × 14 | widest and most scroll; pinned, taps verified |
| `beef-rendang` | 6 × 14 | pinned |
| `conchas` | 4 × 5 | fits at 375px — the "absent" case |

Four of these are 15+ rows. The rowspan hazard turns out to be structural, not incidental:
`layout.ts` puts every ingredient at `col: 1, rowSpan: 1`, so the pinned column is single-row
cells by construction and the deep-rowspan cells are the ones scrolling past it.

### How "1440px unchanged" was confirmed

Twelve pages — the front page, `/list/`, `/404.html`, the two largest menus, and six recipes
spanning 4, 5, 6 and 7 columns — rendered full-page at **1440px and 768px** by
`check-overflow.mjs --shots`, once against a build of the pre-change stylesheet and once against
the final build, and each PNG's SHA-256 compared. **All 24 identical.** Pixel identity, not a
judgement. 768px is in the set because it sits above both breakpoints and would catch a rule
leaking out of its band — the new `.table-view` wrapper and `position: relative` are exactly the
kind of always-on change that would show up there, and they do not.

### Sideways scroll at 375px, before → after

| recipe | cols | before | after |
| --- | --- | --- | --- |
| `miso-ramen` | 7 | 324px | 238px |
| `pastrami` | 7 | 319px | 231px |
| `beef-rendang` | 6 | 279px | 202px |
| `gyoza` | 6 | 197px | 123px |
| `mole-poblano` | 5 | 153px | 88px |
| `aioli` | 5 | 153px | 67px |
| `biryani` | 4 | 153px | 34px |
| `conchas` | 4 | 153px | **0px** |

---

## Test coverage, and the gaps

**Automated, in `npm run verify`:** `check-recipes` (the `findTilingErrors` invariant over 658
recipes), 831 vitest tests including `breakpoints.test.ts`, and a 682-page build. All green.

**Automated, as a command:** `scripts/check-overflow.mjs` — 682 pages at 375px and 100 page views
across ten widths, nothing scrolls sideways; `--shots` for the 1440px hash comparison.

**Not automated, and this is the real gap.** Everything specific to *this* ticket — the column
staying pinned, the edges being drawn, the crossed-off cell staying opaque, `data-more` telling
the truth, the 44px floor — was measured with a throwaway CDP probe in a scratch directory. None
of it is in `npm run verify`, and **nothing in the repository would fail if a later ticket broke
any of it.**

That is a consequence of the ticket's file ceiling: adding a check means adding a file, and the
last criterion says only two files may be modified. T-004-01 hit the same wall and left the same
note. The three things most worth a permanent check, in order:

1. the shortest cell in a rendered table is ≥44px at 375px — the floor is now explicit
   (`height: 2.75rem`) but nothing enforces the *result*;
2. `data-more` is set exactly when `scrollWidth > clientWidth` — the affordance's whole claim;
3. an ingredient cell's computed `position` is `sticky` below 44rem and `static` above it.

All three are one-line assertions in the probe that already exists in
`scripts/check-overflow.mjs`. **T-004-06 may edit any file** and is the natural owner.

---

## Open concerns

1. **`min-width: 0` costs height.** A recipe that was being stretched by the floor now wraps
   instead: `biryani` 1406 → 1750px, `conchas` 394 → 581px. Recipes that were already wider than
   the floor get shorter or stay the same. The trade is deliberate — vertical scroll on a phone is
   free and one-handed, sideways scroll hides content — but it is a visible change to 162 small
   recipes, and it is the one decision here a reviewer might want to make differently. Reverting
   is one declaration.

2. **The affordance needs JS.** No script, no cue. The table still draws, scrolls and prints, and
   the component already reveals `.reset` by measurement, so this is consistent with what is
   there — but it is a real dependency and the alternative (a CSS-only cue) would lie on the
   recipes that now fit.

3. **A 32px band with no pinned column.** The true fit threshold for the 23 seven-column recipes
   measures ~46rem, not the 44.5rem the breakpoint block estimated (its 39.5rem table minimum is
   40.7rem in the browser). Between 704px and 736px those recipes scroll up to 29px with nothing
   pinned. 29px cannot carry a 168px column off the screen and the foot cue still fires, so it is
   left alone; fixing it needs a third breakpoint, which T-004-01 forbids. **The block's
   arithmetic is slightly optimistic and a later ticket may want to correct the comment.**

4. **`.cell--prep` still scrolls.** A full-width band spans every column, so it is already as wide
   as the table and has nothing to stick to; scrolled right, a prep sentence shows its middle.
   Unchanged from today, but the pinned column makes it more noticeable by contrast.

5. **One sweep failed and was not reproducible.** A 682-page run reported `1 scroll sideways`
   while `npm run verify` was rebuilding `dist/` underneath it; two subsequent clean runs against
   a stable build report 682 clean. Recorded rather than quietly dropped. `check-overflow.mjs`
   serves files straight off disk and has no guard against the build changing under it — worth a
   line in whatever T-004-06 writes.

6. **The wrapper `<div class="table-view">` is new markup** that exists only to hold the edge cue,
   because a scroll container cannot hold one (anything positioned inside it scrolls with the
   content; an inset shadow paints underneath the opaque cells). It is inert — `position: relative`
   with no offsets — and the 1440px hashes prove it changes nothing. If a reviewer would rather not
   have it, deleting it and the `::after` costs the fade and keeps the words.

---

## For the next ticket in S-004

- **`snug` is now `[in use]`.** T-004-04 can write `44rem` without re-deriving anything.
- **The breakpoint block's 7-column arithmetic is ~1.5rem optimistic** (see concern 3).
- **T-004-01's finding still stands:** `check-overflow.mjs` is not in `npm run verify`, and
  `package.json` is nobody's file until T-004-06.
