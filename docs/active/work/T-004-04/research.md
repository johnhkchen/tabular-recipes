# T-004-04 — Research

What the clock and the two cook views actually do at a phone's width, measured in a real browser
against the built site rather than read off the stylesheet. Descriptive only; the choices are
Design's.

Every number below was measured with headless Chrome over the DevTools protocol, driving the
build in `dist/`, with **Karla and Lora actually loaded** (`document.fonts.ready`,
`document.fonts.check('12px Karla') === true`) — the fonts are linked from Google Fonts, so a
measurement taken before they arrive is a measurement of the fallback, not of the site.

---

## 1. The four files, as they stand

| file | lines | width queries | other `@media` |
| --- | --- | --- | --- |
| `src/components/Timeline.astro` | 776 | **none** | `forced-colors`, `print` |
| `src/components/CookModes.astro` | 1193 | **one**, `max-width: 34rem` (951) | `prefers-reduced-motion` |
| `src/components/AddToPlan.astro` | 143 | **none** | `prefers-reduced-motion`, `print` |
| `src/styles/site.css` — the views section (962–975) | 14 | none | — |

The ticket says CookModes has two width queries and AddToPlan two; T-004-01's review already
corrected both counts and the corrections hold: CookModes has one, AddToPlan has none.

**The vocabulary is fixed and enforced.** `snug` 44rem and `narrow` 34rem, both `[in use]`, and
`src/styles/breakpoints.test.ts` fails the build on any `@media` width outside that set. Its scan
reads `@media(…)` conditions only — an `@container` condition is invisible to it, which is a fact
Design has to decide what to do with rather than a loophole to walk through quietly.

CookModes' existing `34rem` query already **is** the named `narrow`, so "reconciled with that set"
is satisfied by leaving the literal alone; what it holds today is the modebar going full-width and
the step rows tightening.

The views section of `site.css` holds one rule — the gap between a pane and the clock under it —
and nothing in it is width-dependent.

---

## 2. The axis: what the floor actually costs

`FLOOR_PX = 11` with `minmax(11px, N fr)` per stretch. The question the ticket asks is whether the
floor eats the proportions on a phone. Resolved every recipe's tracks the way grid does, at the
axis widths measured in the browser:

**Axis width is 322.2px at a 375px viewport** (and 268.9 / 463.3 / 602.9 / 819.2px at
320 / 545 / 704 / 1440).

Across the **635 recipes that draw a chart**:

| | |
| --- | --- |
| most stretches any recipe has | **6** |
| recipes with more than 12 stretches | **0** |
| most columns pinned at the floor at 375px | **4** (of 6) |
| most of the axis spent on floors at 375px | **14%** (`gigantes-plaki-instant-pot`) |
| worst gap between a stretch's true share and its drawn share | **8 points** (98% drawn as 90%) |
| recipes where that gap is 10 points or more | **0** |
| recipes where it is under 5 points | **627 of 635** |

The eight worst, all at 7–8 points: `taro-cake`, `turnip-cake`, `ajitama`,
`corned-beef-instant-pot`, `chocolate-babka`, `corned-beef`, `miso-tare`, `vindaloo`.

So the ticket's premise — "a recipe with several short stretches is at or near the floor for most
of them, and the proportions the timeline exists to show stop being proportions" — is **half
true at most**. The floor binds on up to four columns, but the collection has no chart dense
enough for the floors to take more than a seventh of the strip, and the longest wait is never
drawn more than 8 points short of its real share. What a phone loses to the floor is a few
percent, not the proportions.

At 1440 the same charts pin nothing: `gigantes` resolves to `21.1 / 739.9 / 21.1 / 21.1 / 15.8px`,
all above the 11px floor. The floor is therefore a phone-only mechanism in practice, and 11px of a
322px axis is 3.4% — where the same 11px at desktop would be 1.3%.

### The extreme-ratio recipes that exist

| recipe | span | ratio, longest:shortest | at 375px |
| --- | --- | --- | --- |
| `lime-pickle` | 336 hr | **10080:1** (7 days vs 1 min) | two 11px floors, then 150.1 + 150.1px |
| `sour-dill-pickles` | 554 hr | 252:1 | the longest span in the collection |
| `sauerkraut` | 552 hr | 1008:1 | |
| `gigantes-plaki-instant-pot` | 12 hr 55 min | 47:1 | 11 / **278.2** / 11 / 11 / 11px |
| `corned-beef-slow-cooker` | 132 hr | 90:1 | |
| `injera` | 72 hr | 1440:1 | one label, one bar |

`gigantes-plaki-instant-pot` is the ticket's own example — an 11 hr 40 min soak beside three
20-minute jobs and a 15-minute one. Looked at it at 375px: the soak takes 278 of 322px, its label
`11 hr 40 min` sits centred over it on one line, and the four short stretches are unlabelled 11px
slivers at the right-hand end whose durations are printed beside their own rows (`20 min`,
`20 min`, `15 min`). Nothing is compressed and nothing overlaps.

---

## 3. The labels: where the 8% rule actually lands

`LABEL_AT = 0.08` is a share of the span, decided with no reference to how wide the label is or
how wide the axis is. Swept all 635 chart pages in the browser at four widths:

| viewport | axis | labels that **spill** past their stretch | labels that **wrap to 2+ lines** | narrowest labelled stretch |
| --- | --- | --- | --- | --- |
| 375px | 322.2px | **0** | **57 pages** | 25.4px |
| 545px | 463.3px | 0 | 8 pages | 36.9px |
| 704px | 602.9px | 0 | 2 pages | 48.2px |
| 1440px | 819.2px | 0 | 0 | 65.5px |

Two things follow, and they pull in opposite directions:

- **Nothing overflows today, anywhere.** `min-width: 0` plus `overflow-wrap: break-word` on
  `.stretch` means a label that cannot fit wraps inside its own column instead of escaping it. The
  acceptance criterion "a label never overflows the stretch it belongs to" already holds; no label
  was found breaking mid-word either.
- **What it does instead is stack.** The worst is `bagels`: `1 hr 10 min` in a 26.6px column,
  drawn as three stacked lines, which pushes the axis strip from 15.7px to 38.7px tall. Then
  `pork-liver-pate` (`1 hr 30 min` in 30.5px, 3 lines), then 55 more at two lines.

So the narrow-width defect is real but is *stacking*, not spilling.

### How wide a label actually is

Rendered every one of the **93 distinct duration strings** the collection can print, in Karla, at
both ends of `.stretch`'s `font-size: clamp(0.6rem, 2.4vw, 0.68rem)` (9.6px on a phone, 10.88px
from a 453px viewport up). Adding the stretch's own `0 0.1rem` padding (3.2px), the widths group
by character count with no overlap:

| characters | example | widest label of that length, at 0.68rem |
| --- | --- | --- |
| 4 | `1 hr` … `8 hr` | 23.0px |
| 5 | `12 hr`, `1 day`, `8 min` | 32.5px |
| 6 | `15 sec` … `38 min` | 38.9px |
| 7 | `21 days` | 39.0px |
| 10 | `1 hr 5 min`, `2 hr 8 min` | 54.5px |
| 11 | `1 hr 15 min` … `8 hr 20 min` | 60.9px |
| 12 | `11 hr 40 min`, `13 hr 50 min`, `6 days 23 hr` | 64.1px |

The widest label the site can draw needs **64.1px**. The narrowest labelled stretch at 1440px is
**65.5px**. That 1.4px is the whole reason a fit rule can be introduced without touching the
desktop rendering — and the margin is bigger than it looks, because the 65.5px column belongs to a
short label, not a long one.

Counting it properly across all 1268 labelled stretches: a rule that hides a label whose own
column cannot hold it on one line would hide **0 labels at 1440px**, 2 at 704px, 8 at 545px and
**95 at 375px** — 95 of 1268, and every one of them is a label that stacks today.

---

## 4. Tap targets, measured

Every control in the three views, at 320 / 375 / 545px, with the panes actually switched to and
the reset buttons unhidden by ticking something first. Heights in px:

| control | 320px | 375px | 545px | ≥44px? |
| --- | --- | --- | --- | --- |
| `.mode` — Table / Prep / Cook | **40** | **40** | 40 | **no** |
| `.tick` — one prep row (the whole label is the target) | **42.8** | **42.8** | 42.8 | **no** — 11–12 rows of 20 |
| `.tick input` — the box itself | 18.4 | 18.4 | 18.4 | n/a, the label carries it |
| `.hit` — one cook step | 260.3 | **212.9** | 161.6 | yes, comfortably |
| `[data-prep-reset]` "Untick everything" | **33.7** | **33.7** | 33.7 | **no** |
| `[data-cook-reset]` "Start over" | **33.7** | **33.7** | 33.7 | **no** |
| `.toggle` "Add to the list" | **34.7** | **34.7** | 34.7 | **no** |
| `.to-list` "See the list" | **21.1** | **21.1** | 21.1 | **no** |

Five distinct controls miss 44px, four of them by 9–23px. The `.hit` step buttons — the one
surface a cook uses with wet hands mid-recipe — are the only things already right, at five times
the minimum.

Nothing here is a width problem: every one of these heights is identical at 320, 375 and 545px,
because they are all set by `em` padding on the type. They are 40px and 33.7px on a desktop too.
That matters for the "1440px renders exactly as today" criterion: any fix has to be narrow-only,
which is the same shape T-004-01 used for `.site-bar a` and `.back`.

## 5. What the panes look like at 375px, in words

Rendered `/biryani/` (prep) and `/gigantes-plaki-instant-pot/` (cook, two steps ticked) at 375px
and read the pictures:

- **Prep** — the segmented control spans the width, three pills. Groups are clay cards, each with
  a numbered circle, an icon and the operation as a heading; rows are a checkbox and a quantity in
  bold with the ingredient beside it, notes on a second line (`— chopped`), and
  `also in step 2 — 8 tsp in all` in italic. Nothing wraps badly. The tally reads `0 of 20 out.`
- **Cook** — big cards, `clamp(1.15rem, 3.2vw, 1.45rem)` headings, ticked steps struck through and
  pressed in with a ✓, the current one ringed with `NOW` on it. `meanwhile you could start step 2`
  sits in its own tinted well. It reads at arm's length. The only defect is the 40px control above
  it and the 33.7px "Start over" under it.

## 6. Horizontal scroll

`document.documentElement.scrollWidth === clientWidth` on every page/width/mode combination
measured (320, 375, 545, 1440 × table, prep, cook). T-004-01's `scripts/check-overflow.mjs`
reports the whole build clean at 375px, and that is the check this ticket has to keep green.

One artefact worth recording so nobody chases it: a probe that walks ancestors looking for a
scroller reports the `<code>` inside the collapsed `<details class="source">` as "loose" at
5026px. The document does not scroll — `scrollWidth` is 375 — and `.source pre` is
`overflow-x: auto`. It is a quirk of measuring inside a closed `<details>`, not a defect, and
`check-overflow.mjs` does not report it.

## 7. Constraints this ticket inherits

1. **No compression, no log scale, no invented ratio.** The axis was logarithmic once and it lied;
   the pixel floor is the honest compromise and the component says so in three places.
2. **1440px must render exactly as today.** A before/after PNG hash comparison is the only
   evidence that carries. Captured the "before" side already: 12 pages × 1440 and 768px, with
   fonts settled; two independent runs of the unchanged build produce **identical hashes**, so the
   method is stable enough to trust a one-pixel difference.
3. **Four files, and only four.** No new files, no `package.json`, no test file — which means any
   check this ticket wants beyond `npm run verify` lives in the work artifact as a command and a
   number, the way T-004-01's overflow sweep does.
4. **`npm run verify` passes** — 9 test files, 831 tests, 682 pages built, green on the untouched
   tree as of this research.
