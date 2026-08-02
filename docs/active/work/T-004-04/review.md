# T-004-04 — Review

The clock now shows a label only where the column can hold it, and the five controls a cook
presses with wet hands all reach 44px on a phone. Three commits, three files modified, none
created, none deleted.

---

## What changed

| file | action | what |
| --- | --- | --- |
| `src/components/Timeline.astro` | modified | `LABEL_FITS_AT` + `fitsAt()`; the label wrapped in `.stretch-label[data-fits]`; `.stretch` gets `container-type: inline-size` and a flat `0.68rem`; six `@container` rules |
| `src/components/CookModes.astro` | modified | three `min-height: 2.75rem` inside the `34rem` query it already had |
| `src/components/AddToPlan.astro` | modified | its first `@media (max-width: 34rem)`, two controls |
| `src/styles/site.css` | **read, unmodified** | its views section holds one rule — the gap between a pane and the clock — and nothing in it is width-dependent |

Commits: `9eab256` (the labels), `82e3b74` (the cook views), `6bb4e9f` (the list button).

## The framing this ticket had to correct

The ticket says that at 375px "a recipe with several short stretches is at or near the floor for
most of them, and the proportions the timeline exists to show stop being proportions."

Measured, across all **635 recipes that draw a chart**, at the axis width a 375px phone actually
gives them (322.2px):

| | |
| --- | --- |
| most stretches any recipe in the collection has | **6** |
| most columns ever pinned at the 11px floor | **4** |
| most of the axis ever spent on floors | **14%** (`gigantes-plaki-instant-pot`) |
| largest gap between a stretch's true share and its drawn share | **8 points** — 98% drawn as 90% |
| recipes where that gap reaches 10 points | **0** |
| recipes where it stays under 5 points | **627 of 635** |

So the floor costs a few percent, not the proportions. The eight worst, all at 7–8 points:
`taro-cake`, `turnip-cake`, `ajitama`, `corned-beef-instant-pot`, `chocolate-babka`,
`corned-beef`, `miso-tare`, `vindaloo`.

That measurement is why the arrangement did not change and `FLOOR_PX` stayed at 11. The ticket
licenses a different arrangement *if* the real proportions cannot render; they render. Shrinking
the floor on the smallest screen would trade away the one thing the floor exists for — a
one-minute stretch you can see — to buy back three points of share, and would draw two different
geometries either side of 544px.

Stated plainly so nobody reads the unchanged geometry as work not done: the geometry was measured
first and found honest, and the ticket's real defect turned out to be the labels on top of it.

## What was actually broken, and what it looks like now

**The labels.** `LABEL_AT = 0.08` decides labelling by share of the span, which is a quantity that
knows nothing about how wide a label is or how wide the axis is: 8% of the span is 65.5px at 1440
and 25.4px at 375. Nothing overflowed — `overflow-wrap: break-word` kept every label inside its
column, at every width, before and after — but **57 of 635 charts stacked a label at 375px**,
worst case three lines deep, which swelled the axis strip from 15.7px to 38.7px.

Now each stretch measures its own column and a label appears only if the column can hold it on one
line. Swept all 635 chart pages, in Chrome, with Karla loaded:

| viewport | labels that spill | labels that stack, before | after | tallest axis strip |
| --- | --- | --- | --- | --- |
| 375px | 0 → 0 | 57 pages | **0** | 38.7 → **17.2px** |
| 545px | 0 → 0 | 8 pages | **0** | 30.3 → **17.2px** |
| 704px | 0 → 0 | 2 pages | **0** | 30.3 → **17.2px** |
| 1440px | 0 → 0 | 0 | 0 | 17.2 → 17.2px |

No chart is left without a label: checked at 320, 375 and 545px, **0 of 635** lose every label.

### The recipes tested, and what the reader sees

- **`gigantes-plaki-instant-pot`** — the ticket's own case, an 11 hr 40 min soak beside three
  20-minute jobs and a 15-minute one, 47:1. At 375px the soak takes **278.2 of 322.2px** with
  `11 hr 40 min` centred on it in one line; the four short stretches are 11px slivers at the
  right-hand end, unlabelled, their durations printed beside their own rows (`20 min`, `20 min`,
  `20 min`, `15 min`). Nothing is compressed, nothing overlaps, and the drawing says at a glance
  that this recipe is one long wait with twenty minutes of work in it.
- **`lime-pickle`** — the widest ratio in the collection, **10080:1** (7 days beside 1 min). Four
  columns at 375px: `11 / 11 / 150.1 / 150.1px`, labelled `6 days 23 hr` and `7 days`, the two
  one-minute stretches sitting as slivers. 336 hours drawn to scale on a phone.
- **`bagels`** — the worst stacked label before this change: `1 hr 10 min` in 26.6px over three
  lines. Now the axis shows `12 hr` over the overnight rise and nothing else, and the hour and ten
  minutes reads off its own row where it always did.
- **`sour-dill-pickles`** (554 hr, 252:1), **`corned-beef-slow-cooker`** (132 hr, 90:1),
  **`pork-liver-pate`**, **`injera`** (1440:1) — all checked, all one-line labels or none.

### How the fit rule works, and why it is not a breakpoint

Each `.stretch` is an inline-size container; the label carries `data-fits`, the width it needs; six
`@container (max-width: …)` rules hide a label whose column is no wider than that. The numbers are
column widths measured by the browser, not window widths, so they belong to a different vocabulary
than `snug` and `narrow` — a phone draws one stretch at 278px and the next at 11px on the same
page, and no viewport query could answer this. Both the constant and the rules say so in their
comments.

The table came from rendering all **93 distinct duration strings** the collection can print, in
Karla at 0.68rem, and taking the widest of each character count: `20 / 30 / 36 / 52 / 58 / 61px`.
`.stretch`'s font-size lost the lower half of its clamp for this — it is a flat `0.68rem` now, so
one table covers every width. Above a 453px window that changes nothing; below it the smallest
type on the site went **up**, 9.6 → 10.88px.

**A browser without container queries** (pre-2022) fires none of the rules, renders every label,
and stacks a long one exactly as before. The fallback is the old behaviour, not a broken axis.
Same if a font's metrics beat the measurement: `.stretch` keeps `min-width: 0` and
`overflow-wrap: break-word`, so a label wraps, never spills.

**The tap targets.** All five that missed 44px were the same height at 320, 375, 545 **and**
1440px, because they are sized by `em` padding on the type. They are raised inside
`@media (max-width: 34rem)` only, which is what keeps the desktop identical.

| control | 375px before | 375px after | 545px, either side |
| --- | --- | --- | --- |
| `.mode` — Table / Prep / Cook | 40 | **44** | 40, unchanged |
| `.tick` — one prep row | 42.8 (12 of 20 rows under) | **44** (0 under) | 42.8, unchanged |
| "Untick everything" | 33.7 | **44** | 33.7, unchanged |
| "Start over" | 33.7 | **44** | 33.7, unchanged |
| "Add to the list" | 34.7 | **44** | 34.7, unchanged |
| "See the list" | 21.1 | **44** | 21.1, unchanged |
| a cook step (`.hit`) | 212.9 | 212.9, untouched | 161.6, unchanged |

Identical at 320px. The checkbox itself stays 18.4px: the target is the `<label>` around it, which
is the full width of the card and is what the minimum applies to.

## Acceptance criteria, against evidence

| criterion | evidence |
| --- | --- |
| the timeline says something true at 375px; no compression, no log scale, no invented ratio; recipes named | geometry untouched — `FLOOR_PX` 11, linear, unchanged grid template. 635-chart survey: ≤14% of the axis on floors, worst share error 8 points. Recipes and what a reader sees, above |
| the label threshold is checked at narrow, and a label never overflows its stretch | swept all 635 charts at 320/375/545/704/1440: **0 labels spill** before or after; stacking goes 57 pages → 0 at 375px |
| tested against an extreme ratio, named, with what it looks like | `gigantes-plaki-instant-pot` (11 hr 40 min vs 15 min, 47:1) and `lime-pickle` (7 days vs 1 min, **10080:1**) — measured column widths above |
| `CookModes.astro` works at 375px — toggle, step list, checkoff state; tap targets ≥44px | measured table above; screenshotted prep (`biryani`) and cook (`gigantes`, two steps ticked): control, list, strike-through, `NOW` badge and reset all intact |
| `AddToPlan.astro` works at 375px | both controls at 44px, still one line at 320px (158.5 + 73.8 in a 296px row), screenshotted |
| no horizontal scroll on `<body>` on any recipe page | `node scripts/check-overflow.mjs` — **682 page views at 375px, nothing scrolls sideways**; and 72 views over six widths from 320 to 1440 |
| a 1440px window renders exactly as today | 12 pages, full-page PNG SHA-256, fonts settled: **12 of 12 identical**. Method proven first on two runs of the unchanged build |
| uses the breakpoints T-004-01 named; the `34rem` in CookModes reconciled | the only width literal this ticket writes is `34rem`, already `[in use]`; `breakpoints.test.ts` passes and now runs one extra case, for `AddToPlan.astro` |
| `npm run verify` passes | 9 test files, **832 tests**, 682 pages built |
| only the four named files modified | three modified; `site.css` read and left alone |

## Test coverage, and the gap

**In `npm run verify`.** `src/styles/breakpoints.test.ts` is the one automated check this change
can fail: it reads every `@media` condition in `src/**/*.css` and every `<style>` in
`src/**/*.astro` and rejects a width outside `{44rem, 34rem}`. It went from 831 to 832 tests
because it runs one case per file carrying a width query and `AddToPlan.astro` became one. The
other 826 cover `src/lib`, which this ticket does not touch.

**Not in `verify`, and why.** Nothing in `verify` renders anything, and the acceptance criteria
here are all measurements of rendered layout. Those were taken in headless Chrome over the
DevTools protocol — the same technique `scripts/check-overflow.mjs` uses — by scripts in this
attempt's scratchpad. **They are not in the repository**, because the ticket's file ceiling is four
named files and none of them is a script. So the numbers in this document are the record, each one
next to the command that produced it, the way T-004-01 recorded its sweep. A reviewer who wants to
re-run them needs `scripts/check-overflow.mjs` (in the repo, covers the overflow criterion) plus
Chrome and the DevTools recipe described here.

**The one thing measurement cannot settle.** A container query is a browser feature and this was
measured in Chrome. Safari 16 and Firefox 110 both ship it, and the failure mode if one did not is
the label stacking exactly as it does today — the risk is bounded to "no improvement", never to a
broken axis.

## Open concerns

1. **One page changed at 768px, and it is the bucket rounding.** `bagels` at 768px: `1 hr 10 min`
   in a 53px content box. It needs 51.9px, so it fitted — but the 11-character bucket is 58px,
   because the widest 11-character label the site can print (`8 hr 20 min`) needs 57.7px. Counted
   across the collection: **1 label of 1268 at 768px**, 0 at 1024 and 1440, 15 at 375px. The
   duration is printed beside its own row in every one of those cases. Recovering them means a
   second key on the table — Karla's `1` is ~2.9px narrower than its other digits, which is the
   whole variance inside a character count — for roughly double the rules. Left as a judgement
   call a reviewer can reverse.
2. **`LABEL_FITS_AT` and the six `@container` thresholds are the same six numbers, 500 lines
   apart.** Nothing enforces that. A mismatch fails quietly in the safe direction — a label with
   no matching rule simply never hides, i.e. today's behaviour — and both comments name the other
   half. A test could pin it; this ticket may not add a test file.
3. **The table is measured against Karla.** The fonts come from Google Fonts, so a reader who is
   offline gets `system-ui` and slightly different metrics. Wider metrics wrap a label rather than
   spilling it; narrower ones hide a label that would have fitted. Both are the failure modes the
   design already accepts.
4. **`snug` (44rem) is still unused by this ticket.** It is `[in use]` elsewhere (the table, from
   T-004-02), so nothing is left dangling — but the fit rules deliberately do not gate on a
   viewport at all, so the clock writes no width query of its own.

## Found, and left for whoever owns it

`.stretch`'s `title` attribute is the only place an unlabelled stretch's duration survives on the
axis itself, and a `title` is a hover affordance — on a phone there is no hover. Nothing is lost,
because every row prints its own duration beside it and that is the component's stated rule, but
if anyone ever wants the axis alone to carry the durations on touch, that is the thread to pull.
It is not a defect and it predates this ticket.
