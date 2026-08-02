# T-004-04 — Design

Three decisions: what to do about the axis at a phone's width, how to decide which stretches get a
label, and how to get five undersized controls to 44px without moving the desktop.

---

## Decision 1 — the axis keeps its arrangement, because the proportions are already true

### The options

**A. Change the arrangement at narrow** — stack the chart, or drop the strip and let the per-row
durations carry it. This is what the ticket offers as the alternative ("a different arrangement, a
stacked form, an explicit note") *if* the real proportions cannot render.

**B. Shrink the floor at narrow** — `FLOOR_PX` 11 → 8 below `narrow`, so less of a 322px axis goes
to slivers and the drawn shares get closer to true.

**C. Leave the geometry alone** and spend the ticket on what is actually broken.

### Why C

Research measured the thing the ticket assumes. Across 635 charts at 375px: the most stretches any
recipe has is **6**, the most columns ever pinned at the floor is **4**, the most of the axis ever
spent on floors is **14%**, and the largest gap between a stretch's true share of the span and its
drawn share is **8 points** — on eight recipes; 627 of 635 are inside 5 points.

A drawing that is within 8 points of true, worst case in the whole collection, is not a drawing
whose "proportions stop being proportions". It is the pixel floor doing exactly the job the
component's comment claims for it. Changing the arrangement to rescue proportions that are not
lost would be inventing a problem, and the arrangement it would replace is the one the timeline's
whole design rests on.

**B is rejected on its own terms.** The floor exists so a one-minute stretch stays visible; making
it smaller *precisely on the smallest screen* trades away the reason it exists to buy back three
points of share. And it would need a media query to do it, so the axis would render two different
geometries either side of 544px — a thing a reader dragging a window would see, for no gain they
could name.

**A is rejected** because there is no failure to arrange around. It is worth being explicit that
this is a measured finding and not a shrug: had the collection held a recipe with fifteen stretches
at 375px (165px of floor in a 322px axis, half the strip), A would have been the answer.

### What is said about the floor, and where

Nothing new. The chart already prints, under itself, whenever there is more than one stretch:

> Drawn to scale, so a long wait really does take up the room it takes. The shortest stretches keep
> a sliver so they stay visible; their times are printed beside them.

That is the "explicit note" the ticket asks for, it is already true, and it is already there. The
work artifact carries the measurement that says how much the sliver costs; the page does not need
a number that changes with the window.

---

## Decision 2 — a label shows when its own column can hold it

`LABEL_AT = 0.08` decides labelling by share of the span. Share is the wrong quantity: whether
`1 hr 10 min` fits is a question about pixels and a font, and 8% of the span is 65.5px at 1440 and
25.4px at 375. The consequence, measured: **57 of 635 charts stack a label at 375px**, worst case
three lines deep (`bagels`, `1 hr 10 min` in 26.6px), which also swells the axis strip from 15.7px
to 38.7px.

Nothing overflows today — `overflow-wrap: break-word` keeps a label inside its column — so this is
about a label that has stopped being readable, not one that has escaped.

### The options

**A. Raise the threshold at narrow.** Impossible in one pass: `LABEL_AT` is applied on the server,
which has no viewport. It could be done by rendering both decisions and letting a media query pick,
but the decision would then be computed for an assumed axis width per band (viewport minus body
padding minus panel padding, each a `clamp()`), and that assumption rots the first time a padding
changes. It is also coarse: one answer for every phone from 320 to 544px.

**B. `white-space: nowrap` plus `text-overflow: ellipsis`.** Turns `1 hr 10 min` into `1 hr…`. A
truncated duration in a chart about durations is worse than no duration.

**C. Widen the column to fit its label** — `minmax(min-content, N fr)`. This is the invented ratio
the ticket forbids, in its purest form: the axis would draw a one-minute stretch at the width of
the words "1 min".

**D. A container query per stretch.** Make each `.stretch` an inline-size container, put the label
in a child, and hide the child when the container is too narrow to hold it. The decision is then
made against the width the column *actually resolved to*, in the browser, at every viewport — no
assumed axis width, no breakpoint, nothing to rot.

### Why D

It answers the real question ("does this label fit this column?") with the real measurement, and it
is the only option that does. Three things had to be checked before choosing it:

1. **Desktop must not move.** A fit rule can only ever *hide* labels, so the risk is hiding one at
   1440px. Measured across all 1268 labelled stretches: the widest label the site can print needs
   64.1px, and the narrowest labelled stretch at 1440px is 65.5px. **Zero labels hide at 1440px.**
   Also zero at any width above 704px.
2. **The breakpoint test must stay meaningful.** `breakpoints.test.ts` scans `@media` conditions
   only, so an `@container (max-width: 39px)` is invisible to it. That is not a loophole to use
   quietly: a container query is a measurement of a 39px *column*, not a claim about a viewport, so
   it belongs to a different vocabulary than `snug` and `narrow`. The stylesheet comment says so
   at the rules, in the terms the breakpoint block itself uses.
3. **A browser without container queries must degrade to something honest.** It does: no `@container`
   support means no rule fires, every candidate label renders, and the label wraps inside its
   column exactly as it does today. The fallback is the status quo, not a broken axis. (Support is
   Chrome 105 / Safari 16 / Firefox 110, all 2022–23.)

### How the thresholds are chosen — measured, then bucketed by length

A container query condition cannot read a custom property, so the component cannot hand CSS "this
label needs 54.5px". It can hand it a bucket. Every one of the 93 distinct duration strings the
collection can print was rendered in Karla at 0.68rem and measured; with the stretch's own 3.2px of
padding added, they group by character count with no overlap:

| characters | widest such label | bucket |
| --- | --- | --- |
| ≤4 | `8 hr` — 23.0px | **23px** |
| 5 | `8 min` — 32.5px | **33px** |
| 6–7 | `38 min`, `21 days` — 39.0px | **39px** |
| 8–10 | `2 hr 8 min` — 54.5px | **55px** |
| 11 | `8 hr 20 min` — 60.9px | **61px** |
| ≥12 | `13 hr 50 min` — 64.1px | **65px** |

Six rules. The bucket is always the widest label of that length, so the rule errs towards hiding a
label that would have squeezed in rather than towards stacking one that will not. Measured cost of
that rounding at 375px: 109 labels hidden where 95 genuinely could not fit — **14 labels across
635 recipes** hidden with a few pixels to spare. Those 14 lose nothing a reader needs: every row
prints its own duration beside it, which is the component's standing rule for exactly this case.

Rejected on the way: a per-character width table (22 measured constants, false precision, and it
still needs bucketing to reach CSS), and coarser three-bucket tables (45 unnecessary hides at
375px instead of 14).

### One dependency: the label font stops shrinking

`.stretch` is `font-size: clamp(0.6rem, 2.4vw, 0.68rem)` — 10.88px from a 453px viewport up, 9.6px
on a phone. Two reasons to make it a flat `0.68rem`:

- The bucket table is measured at one size. Keeping two sizes means either two sets of thresholds
  (twelve rules for a 13% difference) or thresholds that over-hide on phones.
- 9.6px is the smallest type on the site, on the surface with the least room, on the device held
  furthest from the eye. Making the *only* text on a phone's axis bigger is the right direction.

Above 453px the clamp is already at its cap, so this changes nothing at 545px or 1440px. Below it,
the surviving labels get 13% bigger — which the fit rule then guarantees still fit.

`LABEL_AT` stays exactly as it is. It now answers a different question from the container query,
and both are honest: the share rule says *which stretches are big enough to be worth a label*, the
container query says *whether that label fits the column it landed in*. Removing the share rule
would put labels on desktop stretches that have none today, which the 1440px criterion forbids.

---

## Decision 3 — five controls reach 44px, at narrow only

Measured heights: `.mode` 40px, `.tick` 42.8px (11–12 rows of 20), `[data-prep-reset]` and
`[data-cook-reset]` 33.7px, `.toggle` 34.7px, `.to-list` 21.1px. All five are the same height at
320, 375, 545 **and 1440px**, because they are sized by `em` padding on the type.

**Rejected: fix them at every width.** It is the tidier rule and it breaks the ticket's own
"1440px renders exactly as today". Not close: `.to-list` would grow 23px.

**Chosen: raise them inside `@media (max-width: 34rem)`**, which is `narrow`, already the named
breakpoint, already the query CookModes writes, and exactly the shape T-004-01 used for
`.site-bar a` (24 → 44px) and `.back`. The vocabulary criterion is satisfied by using the literal
that is already there rather than adding a second one.

**`min-height: 2.75rem`, not more padding.** Padding would have to be re-derived from the line box
every time the type changes and is 1.2px from failing on `.tick` today; a minimum is a statement of
the requirement itself. Where the row is taller than the minimum — a prep row with a note under it,
a step card — the minimum does nothing at all.

`.to-list` is a link, so it also gets `display: inline-flex; align-items: center`, otherwise a
`min-height` on an inline box does nothing.

The prep checkbox stays 18.4px. The tap target there is the `<label>` wrapping it, which is the
full width of the card and is what `min-height` is applied to; growing the box itself would change
`accent-color`'s drawing on every browser for no gain in reach.

---

## What this ticket is not doing

- **Not touching `src/styles/site.css`.** Its views section holds one rule, about the gap between a
  pane and the clock, and nothing about it is width-dependent. The ticket permits editing it; there
  is nothing there to edit. Said plainly here so a reviewer does not read its absence from the diff
  as an oversight.
- **Not adding a test file or a script.** The file ceiling is four named files. The evidence for
  every criterion is a command and a number in the Review artifact, the way T-004-01 recorded its
  overflow sweep.
- **Not changing `FLOOR_PX`, `LABEL_AT`, `buildSchedule`, or any number the recipes supply.**

## How each decision will be checked

| decision | evidence |
| --- | --- |
| proportions render at 375px | resolved-track survey across 635 charts; named recipes; screenshots of `gigantes-plaki-instant-pot` and `bagels` |
| labels fit | browser sweep of all 635 charts at 320/375/545/704/1440 — count of labels that spill (must stay 0) and that stack (must go to 0 on phones) |
| desktop unchanged | SHA-256 of full-page PNGs, 12 pages × 1440 and 768px, before vs after, fonts settled; the method is already proven stable on two runs of the unchanged build |
| tap targets | the same measurement that produced the table above, re-run after |
| no body scroll | `node scripts/check-overflow.mjs` over all 682 built pages |
| the rest | `npm run verify` |
