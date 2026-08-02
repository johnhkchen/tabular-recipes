# T-004-02 — Progress

Done. Three commits, two files, plan followed with two deviations — both forced by what the
browser actually does, both recorded below.

| step | commit | state |
| --- | --- | --- |
| 0 — baseline renders | *(scratch, not committed)* | 24 PNGs + SHA-256 at 1440px and 768px |
| 1 — the pinned column | `1e052fd` | done |
| 2 — the metrics | `e93dca1` | done |
| 3 — the affordance | `97310a8` | done |
| 4 — verification pass | — | done, evidence in `review.md` |

---

## Step 1 — the pinned column (`1e052fd`)

`src/styles/site.css`: `snug` flipped to `[in use]`; a new `@media (max-width: 44rem)` block at
the end of the table section with `position: sticky`, `border: 0`, an opaque background, three
inset shadows redrawing the edges, and the two `[data-done]` rules.

Verified before committing, all at 375px against the built site:

- pinned at 1px from the scroller's left edge on **every** row, including the last, on
  `miso-ramen`, `pastrami`, `biryani` (19 rows), `pineapple-bun` (18), `xiao-long-bao` (18),
  `mole-poblano` (15), `beef-rendang`, `conchas`;
- `elementFromPoint` at a pinned cell's centre, scrolled to the right end, returns that cell or
  one of its own spans on all eight — nothing paints over it;
- at rest the drawing is unchanged: screenshot at `scrollLeft: 0` against the pre-change build
  shows one spine, one hairline per row, no thickening;
- the `opacity` leak is closed — cell opacity 1, span opacity 0.4, background still opaque, no
  operation text reads through a crossed-off ingredient;
- `snug` is a real band: at 700px `miso-ramen` still overflows by 30px with the column pinned;
- at 1440px the column is `static` with its 1px border — untouched.

### Deviation 1 — a tap-target rule the plan did not have

Giving the pinned cell `border: 0` cost it 1px of height, and the shortest cell fell from
**44.8px to 43.8px** — under the ticket's 44px floor. Found by measuring, not by review.

The drawn table had been clearing 44px by 0.8px purely by arithmetic (block padding + a 24px
line + the border), which is a floor nobody wrote down and anybody could have deleted. So
`.cell { height: 2.75rem }` was added inside the same `snug` block, with a comment saying why.
Re-measured: **≥44px on all 12 sampled recipes at both 375px and 320px**, and 44px in the snug
band at 700px where it was 43.9px.

Committed with step 2 rather than amending step 1.

---

## Step 2 — the metrics (`e93dca1`)

`@media (max-width: 34rem)`: `min-width: 0` on the table, inline cell padding to `0.45rem`,
`.qty` to `3.4rem`, `.cell--op` to `4rem`. Block padding untouched.

Measured at 375px, before → after: `miso-ramen` 324 → **238px**, `pastrami` 319 → 231,
`paella` 220, `beef-rendang` 279 → 202, `pineapple-bun` 157, `gyoza` 197 → 123,
`xiao-long-bao` 95, `mole-poblano` 153 → 88, `aioli` 153 → 67, `biryani` 153 → 34,
**`conchas` 153 → 0**. At 320px everything still holds and the shortest cell is still ≥44px.
At 700px and 1440px the numbers are identical to step 1's.

---

## Step 3 — the affordance (`97310a8`)

### Deviation 2 — the depth cue could not be a shadow

The design put the "there is more" cue on the pinned column as an outer `box-shadow`. Built it,
measured it applied (`rgba(28,25,23,0.34) 4.8px 0 6.4px -4.48px` in the computed style) — and it
**did not paint**. Confirmed with a deliberately absurd `1rem 0 0 0 red`: nothing rendered.
Outer box-shadows on table cells are not painted under `border-collapse: collapse`; the inset
shadows that redraw the borders are unaffected, which is why step 1 looked right.

So the cue moved to where it belongs anyway — the **right edge**, where content is actually being
cut. That needs an element the scroller cannot provide: anything positioned inside a scroll box
scrolls with the content, an inset shadow on the scroller paints underneath the opaque cells, and
`.table-well` also contains the foot so its bottom inset is unknowable. One wrapper,
`<div class="table-view">`, holds it.

`design.md` rejected exactly this option on the grounds that the spine shadow already carried the
cue. The spine shadow does not exist, so the reason is gone. The wrapper is inside
`RecipeTable.astro`, which the ticket names; nothing else moved.

The fade is declared inside the `44rem` block, which also keeps it off paper — a printed page is
about 51rem wide, so the query never matches and the `@media print` block (outside this ticket's
file scope) did not have to be touched.

### The rest of step 3, as planned

- `<span class="table-more" hidden>` nested inside `.hint`, revealed only by measurement.
- `.table-more { display: block; color: var(--clay-primary) }`. **`display: block` was not in the
  plan**: Astro strips the whitespace between the text and the span, so the two sentences rendered
  as `…cross it off.More to the right…`. Giving the cue its own line fixes it and reads better
  than a re-inserted space.
- ~20 lines in the existing script: one `measure()`, an early return when nothing changed, a
  passive `scroll` listener, and one `ResizeObserver` watching both the scroller and the table.

Verified: `data-more` present on `miso-ramen` at 375px and 700px, absent at 1440px; **absent on
`conchas` at 375px, where the table now fits**; removed when scrolled to the right end and back
when scrolled to 0. Screenshots confirm the fade appears, the fitted recipe has none, and the
foot reads `Tap anything to cross it off.` / `More to the right — drag the table across.`

---

## Verification pass

- `npm run verify` — **9 test files, 831 tests, 682 pages built**, green. That includes
  `check-recipes` (`findTilingErrors` over all 658 recipes) and `breakpoints.test.ts`, which now
  also polices the `[in use]` tag on `snug`.
- `node scripts/check-overflow.mjs` — 682 pages at 375px, nothing scrolls sideways.
- `node scripts/check-overflow.mjs --width 320,…,1440` — 100 page views across ten widths,
  nothing scrolls sideways. 320px is in there because the foot line is the one thing that could
  have widened a page.
- **24 of 24 screenshot hashes identical** at 1440px and 768px against the pre-change build.
- Taps at 375px scrolled to the right end, on `miso-ramen`, `biryani` and `mole-poblano`: the
  first pinned cell, the last pinned cell and an operation cell each toggle once, `aria-pressed`
  follows, a second tap clears rather than double-toggling, and `localStorage` holds exactly the
  marks made.

## Left as it was

Nothing from the plan was dropped. The two items the plan listed as out of scope stay out: the
704–736px band where the 23 widest recipes scroll ≤29px without a pinned column (fixing it needs
a third breakpoint, which T-004-01 forbids), and `.cell--prep` scrolling, which it already did.
