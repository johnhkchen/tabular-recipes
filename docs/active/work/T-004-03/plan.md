# T-004-03 — Plan

Three commits, each written then measured before the next begins. The baseline is already
captured, so every claim in `review.md` is a diff against a number recorded before the first edit.

---

## Step 0 — baseline (done before Design, recorded here)

| what | result |
| --- | --- |
| `npm run build` | 682 pages, clean |
| `node scripts/check-overflow.mjs --width 375` | **682 page views, nothing scrolls sideways** |
| `check-overflow --width 1440,375 --shots before/` over 8 representative routes | 16 PNGs + SHA-256 manifest in the scratchpad |
| CDP probe: front door, Bakery, The Bowl Shop, `boston-baked-beans`, search-results state | the tables in `research.md` |

The 8 routes: `/`, `/menu/bakery/`, `/menu/bowl-shop/`, `/menu/japanese-home/` (longest counter
name), `/boston-baked-beans/` (three-way variant), `/pita-bread/` (30 pair cards),
`/banh-mi-dac-biet/` (12 aka), `/black-bean-soup/` (7 chips).

## Step 1 — the front door

Write block 1 (`.counters` gap, `.counter a` padding, `.counter .blurb` margin, `.counter .teaser`
hidden) at the end of the counters section.

**Verify**

1. `npm run build`.
2. Probe `/` at 375px: `.counters` height, 21 card heights, `.finder` top, document height.
   *Expected:* `.counters` ≈3150px (from 4505), no card under 44px, `.finder` still at ~279px.
3. Probe `/` at 375px with the search open (type `a`): counters hidden, results unaffected, no
   element past the right edge.
4. `check-overflow --width 375 /` → clean.
5. `check-overflow --width 1440 --shots after1/ /` → hash equals `1440_.png` in `before/`.
6. Screenshot at 375px, read it: the card still says name, sentence, count.

**Commit** `lisa commit-ticket --ticket-id T-004-03 --include src/styles/site.css`.

## Step 2 — one counter's menu

Write block 2 (`.menu-head h1` clamp, `.menu-section a` min-height) at the end of the menu section.

**Verify**

1. `npm run build`.
2. Probe `/menu/bakery/` and `/menu/bowl-shop/` at 375px: count items with height < 44.
   *Expected:* **0**, from 7 and 3.
3. Probe `/menu/japanese-home/` at **544px and 545px**: `.menu-head h1` computed font-size equal on
   both sides of the breakpoint (33.6px), and 27.2px at 375px. This is the "clamps meet" claim and
   it is checkable, so it gets checked rather than asserted.
4. `check-overflow --width 375 /menu/bakery/ /menu/bowl-shop/ /menu/japanese-home/` → clean.
5. Hashes at 1440px for the three menu routes equal the baseline.

**Commit** as above.

## Step 3 — the trimmings and the shelves

Write blocks 3 and 4.

**Verify**

1. `npm run build`.
2. Probe `/boston-baked-beans/` at 375px: every pressable element outside `AddToPlan`, `CookModes`
   and `.source` is ≥44px. *Expected:* crumbs 20→44, chips 15→44, variants 17→44.
3. Probe `/black-bean-soup/` (7 chips) at 375px: chip row wraps, no overflow, all chips 44px.
4. Probe `/pita-bread/` at 375px: 30 pair cards, `.pairs` height before/after, every card ≥44px.
5. Probe `/` at 375px with search open: 60 result cards, none under 44px, height reduced.
6. `check-overflow --width 375` across **all 682 pages** → clean. (The full sweep runs once, here,
   because this is the last step that can break it.)
7. `check-overflow --width 1440 --shots after/` over all 8 routes → all 8 hashes equal `before/`.
8. Read the 375px screenshots of `/boston-baked-beans/` and `/` for anything the numbers cannot
   see — a chip row that reads as buttons, punctuation stranded between variant links.

**Commit** as above.

## Step 4 — full verification

1. `npm run verify` — `check-recipes`, `parse-recipes`, `vitest run` (includes
   `breakpoints.test.ts`), `astro build`. Must pass.
2. `git status --porcelain` — no ticket-owned file left staged, modified or untracked.
3. Write `progress.md`, then `review.md` and `review-disposition.json`, then
   `lisa check-disposition T-004-03`.

---

## Testing strategy, and what is deliberately not unit-tested

**What the repository's own tests cover.** `src/styles/breakpoints.test.ts` is the only test that
looks at CSS, and it enforces exactly one thing: every `@media` width literal is one of the two
named breakpoints. That is the property this ticket could most plausibly break by accident (a
`36rem` that "felt right"), and it is already automated. It runs in `npm run verify`.

**What is checked by a browser, not a test.** Heights, tap targets and overflow need real layout.
T-004-01 decided this and wrote `scripts/check-overflow.mjs` for the invariant, kept deliberately
out of `npm run verify` because it needs a Chrome that CI may not have. Per-element measurements
use the same plumbing from the scratchpad. Adding a layout test to `vitest` would mean adding a
headless-browser dependency this project does not have — a change well outside a ticket whose
acceptance criteria say only `site.css` may be modified.

**What proves 1440px is unchanged.** Screenshot SHA-256 equality on 8 routes, the method T-004-02
used. It is stronger than reasoning about media queries: it catches a rule that leaked out of a
query, a specificity accident, and a value that changed the desktop cascade. Its limit is that it
proves it for 8 pages, not 682 — stated as such.

**Gaps this ticket will not close, to be recorded in `review.md`:**

- The two variant links sit ~4px apart. 44px tall each, but adjacent; separating them needs the
  sentence to become a list, which needs markup.
- `.source summary` (24px), `AddToPlan` (35px, 21px) and the `.mode` buttons (40px) miss 44px on
  the same page. Owned by T-004-04 and T-004-06.
- `.filter` / `.filters` and `.shelf-group` are rules nothing renders.

## Rollback

Each block is contiguous, gated by a media query, and touches only existing selectors. Any one of
the three commits reverts without affecting the others; reverting all three restores a file
byte-identical to `b373652`.
