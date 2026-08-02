# T-004-04 — Plan

Three commits, each independently verifiable, each one file. The evidence for every acceptance
criterion is a command whose output goes into `review.md`.

---

## Step 0 — the baseline, already taken

Done during Research, against the unchanged tree, because it cannot be taken afterwards:

- `npm run build` — 682 pages, clean.
- Full-page PNG + SHA-256 for **12 recipe pages × 1440px and 768px**, webfonts settled
  (`document.fonts.ready`, `fonts.check('12px Karla') && fonts.check('12px Lora')`), written to the
  scratchpad as `shots/before/hashes.txt`. **Run twice; the two runs are identical**, so a
  difference afterwards is a real difference and not shutter noise.
- The tap-target table at 320 / 375 / 545px, all three panes.
- The axis sweep over all 635 chart pages at 320 / 375 / 545 / 704 / 1440px.

The twelve pages: `bagels`, `gigantes-plaki-instant-pot`, `lime-pickle`, `sour-dill-pickles`,
`pork-liver-pate`, `biryani`, `miso-ramen`, `espresso-brownies`, `beef-rendang`, `aioli`,
`pizzelle`, `blondies` — between them: the worst stacked label, the ticket's extreme ratio, the
widest ratio in the collection (10080:1), the longest span, a 7-column table, a 6-column table, the
deepest tree, a recipe that times almost nothing, the "at least 45 sec" headline, and a chart with
a single full-width stretch.

---

## Step 1 — Timeline: labels that fit

**Edit** `src/components/Timeline.astro`:

1. Frontmatter: add `LABEL_FITS_AT` and `fitsAt()` beside `LABEL_AT`, with the measurement written
   into the comment. Add `fitsAt` to the `axis` mapping.
2. Markup: wrap the label text in `<span class="stretch-label" data-fits={…}>`, rendered only when
   `labelled`.
3. Styles: `.stretch` gets `font-size: 0.68rem` (was `clamp(0.6rem, 2.4vw, 0.68rem)`) and
   `container-type: inline-size`; six `@container` rules follow it with the comment that says why
   they are not breakpoints.

**Verify, in this order:**

| check | command | must say |
| --- | --- | --- |
| it builds at all | `npm run build` | 682 pages, and `@container` survives the CSS pipeline (grep the built stylesheet for it) |
| no label spills | axis sweep at 320/375/545/704/1440 | `spill: 0` at every width, as today |
| no label stacks on a phone | same sweep | `wrapped` goes 57 → 0 at 375px, 8 → 0 at 545px |
| every chart keeps a label | same sweep | no page renders an axis with zero visible labels |
| desktop untouched | 12 pages × 1440 + 768, hashes vs `shots/before` | **24 of 24 identical** |
| the extreme ratio still reads | screenshot `gigantes-plaki-instant-pot` and `bagels` at 375px | soak still ~86% of the strip; `bagels` shows `12 hr` and no longer stacks `1 hr 10 min` |
| tests | `npm run verify` | 9 files, 831 tests, green |

If any hash differs, that is a stop: read the PNG pair before going further. The only expected
cause would be `container-type` changing the axis strip's height, which would show up on every
page at once.

**Commit** — `lisa commit-ticket --ticket-id T-004-04 --include src/components/Timeline.astro`

---

## Step 2 — CookModes: 44px where a wet hand lands

**Edit** `src/components/CookModes.astro`, inside the existing `@media (max-width: 34rem)`:
`min-height: 2.75rem` on `.mode`, on `.tick`, and on `.pane-foot .clay-button`.

**Verify:**

| check | command | must say |
| --- | --- | --- |
| tap targets at 375px | the measurement script, prep and cook, with something ticked so both resets are visible | `.mode` 40 → **≥44**; `.tick` 42.8 → **≥44** on every row; both resets 33.7 → **≥44**; `.hit` unchanged |
| and at 320px | same | same, nothing narrower than the control needs |
| desktop untouched | same measurement at 545px and 1440px | every height exactly as the baseline table |
| the pane still reads | screenshot prep (`biryani`) and cook (`gigantes-plaki-instant-pot`, two steps ticked) at 375px | control, list and checkoff state all intact |
| no body scroll | `node scripts/check-overflow.mjs --width 320,375,545` on the three pages | nothing scrolls |
| tests | `npm run verify` | green |

**Commit** — `lisa commit-ticket --ticket-id T-004-04 --include src/components/CookModes.astro`

---

## Step 3 — AddToPlan: the button and the link

**Edit** `src/components/AddToPlan.astro`: a new `@media (max-width: 34rem)` block with `.toggle`
`min-height: 2.75rem`, and `.to-list` `display: inline-flex; align-items: center;
min-height: 2.75rem`.

**Verify:**

| check | command | must say |
| --- | --- | --- |
| tap targets at 375px | measurement script | `.toggle` 34.7 → **≥44**, `.to-list` 21.1 → **≥44** |
| still one line | same, plus a screenshot at 320px | button and link still side by side, no wrap into a taller block |
| desktop untouched | same at 545 and 1440 | 34.7 and 21.1, unchanged |
| tests | `npm run verify` | green |

**Commit** — `lisa commit-ticket --ticket-id T-004-04 --include src/components/AddToPlan.astro`

---

## Step 4 — the whole-site checks, once, at the end

1. `npm run build`
2. `node scripts/check-overflow.mjs` — all 682 pages at 375px. Must report
   *nothing scrolls sideways*. This is the criterion "no horizontal scroll on `<body>` on any
   recipe page", checked over the whole build rather than a sample.
3. `node scripts/check-overflow.mjs --width 320,414,768,1024,1440` over the twelve pages.
4. The axis sweep, final run, all 635 charts × 5 widths — the table that goes in `review.md`.
5. The tap-target table, final run, 320 / 375 / 545 / 1440 × prep and cook.
6. The hash comparison, final run, 24 shots vs `shots/before`.
7. `npm run verify`.
8. `git status` — no ticket-owned file left staged, modified or untracked.

---

## Testing strategy, and what it cannot cover

**What `npm run verify` covers.** `breakpoints.test.ts` proves no third width literal entered the
codebase — it reads the `@media` conditions of every `.css` and every `<style>` in `src/`. The
other 826 tests cover `src/lib`, which this ticket does not touch; they are a regression net for
"the numbers on the page are still the recipe's own", not for layout.

**What it cannot cover, and what stands in for it.** Nothing in `verify` renders anything. Widths,
heights and paint are measured in a real browser instead, by scratchpad scripts driving the
DevTools protocol — the same technique `scripts/check-overflow.mjs` uses, which is in the
repository and is the one browser check this project owns. This ticket may not add a second one
(four files, none of them a script or a test), so the numbers land in `review.md` with the command
that produced them, exactly as T-004-01 recorded its sweep.

**The one gap worth naming up front.** A container query is a browser feature; a headless Chrome
measurement proves it works in Chrome. Safari 16 and Firefox 110 both ship it, and the failure mode
if one did not is the label wrapping as it does today — the fallback is the current behaviour, so
the risk is bounded to "no improvement" rather than "broken".

## Deviations

Any deviation from this plan gets written into `progress.md` with its reason before the work
continues.
