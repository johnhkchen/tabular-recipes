# T-004-02 — Design

Three problems, decided separately, because they fail independently: **pin the ingredients**,
**say that the table continues**, and **stop forcing the table to be 480px wide**.

---

## 1. Keeping the ingredient column in view

### Options

**A. `position: sticky; left: 0` on `.cell--ingredient`.** One property on the cells that already
exist. The column is one cell per row (`layout.ts` gives every ingredient `col: 1, rowSpan: 1`),
so there is no sticky-plus-rowspan case anywhere in the collection.

**B. Two tables side by side** — a frozen table of ingredients, a scrolling table of operations,
row heights synchronised by JS. Fails on the shape: an op cell spanning rows 3–11 is a claim
about *those* rows, and once the merge tree is cut down the middle the browser stops enforcing
the alignment and a script has to fake it against wrapped text. This is the "dissolves the table"
failure wearing a table's clothes.

**C. A cloned, absolutely-positioned overlay column** driven by scroll events. Duplicates every
cell — so `data-cell` ids, `aria-pressed` state and taps are duplicated too, which the ticket
forbids by name ("must not swallow or duplicate taps").

**Chosen: A.** Measured on the built site: it stays, taps keep working, and the scroller's
`overflow-x` clips it to the padding box, so it cannot paint over the 1.5px frame or outside the
radius — the ticket's frame hazard is answered by the box model, not by a z-index.

### The part A does not do by itself

Sticky arrives **with no borders**. Under `border-collapse: collapse` the borders belong to the
table and are painted at the table's coordinates; the cell travels, its edges do not. Screenshot
evidence in `research.md`: the pinned column becomes an unbordered slab, the row hairlines vanish
and the reader loses exactly the row-tracking the ticket is buying.

Options for giving it edges back:

**A1. `border-collapse: separate` at narrow widths**, with borders on two sides of each cell.
Rejected: it re-draws the whole table on a phone, the outer top/left edges then differ from the
outer bottom/right, and getting it right needs the positional selectors the ticket forbids.

**A2. Inset `box-shadow` on top of the existing border.** Rejected on sight — tested, and it
draws a **double line**: the collapsed border and the shadow land 1px apart.

**A3. `border: 0` on the sticky cell, three edges redrawn as inset shadows.** Chosen. Shadows
travel with the element, and a shadow is not a border, so no `:first-child`/`:last-child` reset
is introduced and the comment at `site.css:629` keeps its meaning. Three layers:

```
inset 0 1px 0 var(--line)        the row hairline (top edge — the bottom of the last row
                                 sits against the frame, where a missing hairline cannot show)
inset 1px 0 0 var(--line)        the outer left hairline, the ring just inside the frame
inset -1.5px 0 0 var(--frame)    the spine
```

Verified by screenshot at `scrollLeft: 0`: against today's render the drawing is the same — one
spine, one hairline per row, no thickening where the redrawn spine meets the operation column's
own border.

### The leak A creates

`.cell[data-done] { opacity: 0.4 }` fades a cell's **background** as well as its text. On a sticky
cell that means it stops being opaque, and the scrolling operations read straight through a
crossed-off ingredient. Confirmed by screenshot.

Every ingredient cell's content is `<span>`s (`layout.ts` always sets `parts`), so the fade moves
one level down — `.cell--ingredient[data-done] { opacity: 1 }` and the spans carry the 0.4. The
strikethrough is inherited and unaffected. Gated inside the media query so a desktop crossed-off
cell keeps fading its border exactly as it does today.

### Which breakpoint

`snug` — `max-width: 44rem`. T-004-01 reserved it for this ticket and its arithmetic is right:
at a **700px** viewport (inside `snug`, above `narrow`) `miso-ramen` still wants 651px in a 618px
box. Below `snug`, sideways travel is large enough to carry the ingredient column off the screen;
above it, the widest recipe on the site can travel at most ~29px, which is a fifth of the
column's width — it cannot leave. So `snug` flips to `[in use]`, which is what
`breakpoints.test.ts` checks.

*Known edge:* the true fit threshold for the 23 seven-column recipes is ~46rem, not 44.5rem — the
block's estimate of a 39.5rem table minimum measures 40.7rem in the browser. Between 704px and
736px those recipes scroll up to 29px with no pinned column. Adding a third breakpoint is exactly
what T-004-01 forbade, and 29px of travel cannot hide a 168px column, so the band is left alone
and recorded.

---

## 2. Saying that the table continues

The rule from the ticket: *"it must reflect what the render actually did: shown only when the
table genuinely overflows, never as decoration."* That rules out anything a stylesheet decides on
its own, because a media query knows the viewport and not the table.

### Options

**D. A CSS-only scroll shadow** (`background-attachment: local, scroll` on the scroller). Honest
without JS, but it has to share `background` with the raised surface the scroller already paints,
and the pinned column would sit on top of the left half of it.

**E. Always-on "scroll →" furniture.** Rejected by the ticket in as many words.

**F. Measured in JS, expressed twice — depth and words.** Chosen. One measurement per table,
`data-more` on `.table-well`, which drives:

- **the spine gains depth** — a warm ink shadow to the right of the pinned column, so the
  drawing says "the table slides under here" at the edge the eye is anchored to;
- **a line in the foot** — `More to the right — drag the table across.`, hidden in the HTML and
  revealed only by measurement.

`data-more` means *there is table to the right you have not seen*: set when
`scrollWidth − clientWidth > 1` and the scroller is not already at its right end, recomputed on
`scroll` and by a `ResizeObserver` on both the scroller and the table (the table's box changes
when a late font reflows it, without the scroller's box changing).

**Why not a gradient fade at the right edge.** It was the first choice and it was dropped for
geometry: an absolutely-positioned overlay inside a scroller scrolls with the content, `.table-well`
also contains the foot so its bottom inset is unknowable, and `mask-image` on the scroller fades
the 1.5px frame along with the content. All three fixes cost a wrapper element in the markup for
a cue the spine shadow already carries. Recorded as the one deliberate omission.

**Why JS is acceptable here.** The component already reveals `.reset` by measuring state rather
than guessing in CSS, and tap-to-cross-off — the table's whole interactive premise — is JS.
Without JS the table still draws, still scrolls, still prints; it just says nothing extra. The
alternative is a cue that lies on the 162 recipes that now fit.

**Retraction at the right end** is deliberate: at the far right there is nothing further right,
and a cue that still points there is the decoration the ticket rules out. It is strictly narrower
than "appears when the table overflows", never wider.

---

## 3. The 480px floor

This is the change with the largest measured effect, and the ticket does not mention it.

`.recipe-table { min-width: 30rem }` — 480px — against a 327px container at 375px. **Nothing on
the site fits a phone**, including the 162 recipes the ticket's own table lists as "fits". And
because `width: 100%` already fills the container, the floor can only bind below a ~529px
viewport: it is a phone-only rule that reads like a general one, and it is inert everywhere else.

Worse, the floor is *paid for by the ingredient column*, which has `width: 100%` and absorbs all
the slack. `conchas` — four columns, five rows — gives 240px of its 327px to ingredients and 87px
to three operations, of which the reader sees **one**. The ticket's "a reader can easily believe
a 7-column recipe has 4 operations" is worst on the smallest recipes.

**Chosen: `min-width: 0` inside `narrow`,** plus the tightening the ticket asks for — inline cell
padding `0.85rem → 0.45rem`, `.qty` `4.4rem → 3.4rem`, `.cell--op` `4.75rem → 4rem`. Block padding
is untouched: it is what puts the shortest cell at 44.8px, and the 44px floor is a criterion.

Measured at 375px, sideways scroll before → after:

| recipe | cols | before | after | height before → after |
| --- | --- | --- | --- | --- |
| `miso-ramen` | 7 | 324px | **238px** | 1182 → 1182 |
| `pastrami` | 7 | 319px | 232px | 1326 → 1326 |
| `beef-rendang` | 6 | 279px | 203px | 989 → 965 |
| `gyoza` | 6 | 197px | 123px | 1458 → 1458 |
| `mole-poblano` | 5 | 153px | 89px | 1275 → 1155 |
| `aioli` | 5 | 153px | 68px | 531 → 579 |
| `biryani` | 4 | 153px | 34px | 1406 → 1766 |
| `conchas` | 4 | 153px | **0px** | 394 → 586 |

**The trade, stated plainly.** Recipes that were being *stretched* by the floor get taller, because
their operations now wrap instead of spreading: `biryani` +360px, `conchas` +192px. Recipes that
were already wider than the floor get shorter or stay the same. Vertical scroll on a phone is free
and one-handed; sideways scroll is the failure this story exists to fix, and it hides content
rather than merely deferring it. `conchas` at 375px goes from *one of three operations visible*
to **the whole merge tree on one screen, no scrolling at all** — which is also what makes the
"absent when it fits" criterion checkable at 375px on a real recipe rather than only at 1440px.

**Rejected: metrics only** (the ticket's item 3 alone). It buys ~20% and leaves every one of 658
recipes scrolling. The ticket says as much: "worth having, not a solution."

**Rejected: smaller type at narrow widths.** T-004-01 settled this — body text stays at 16px or
iOS zooms a focused field, and the table's job is to be read while cooking.

---

## What this does not touch

- No markup change to cells, rowspans, colspans or `data-cell` ids — `findTilingErrors` is a check
  on the model and cannot see any of this.
- No `:first-child` / `:last-child` anywhere.
- Nothing outside `@media (max-width: 44rem)` / `(max-width: 34rem)` except `data-more`, which
  measurement never sets on a desktop — so 1440px is unchanged, and that is checkable by hash.
- `.cell--prep` still scrolls. It spans every column, so it is already as wide as the table and
  has nothing to stick to; a full-width band losing its left anchor is the honest outcome and is
  what happens today.
