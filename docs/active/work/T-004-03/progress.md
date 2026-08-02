# T-004-03 — Progress

Three commits, one file, four `@media (max-width: 34rem)` blocks. The plan held; two things came
out differently under measurement and are recorded below.

| step | commit | state |
| --- | --- | --- |
| 1 — the front door | `a1b1611` | done, measured |
| 2 — one counter's menu | `cdd7555` | done, measured |
| 3 — the trimmings and the shelves | `07d29a8` | done, measured |
| 4 — full verification | — | `npm run verify` green; sweeps below |

---

## Step 1 — the front door (`a1b1611`)

Written: `.counters { gap: 0.7rem }`, `.counter a { padding: 1.05rem 1.15rem 0.95rem }`,
`.counter .blurb { margin-bottom: 0.55rem }`, `.counter .teaser { display: none }`.

| at 375px | before | after |
| --- | --- | --- |
| `.counters` | 4505px | **3103px** (−31%) |
| card height (min / median / max) | 181 / 203 / 225 | **125 / 148 / 148** |
| document | 4998px | **3596px** |
| `.finder` top | 279px | 279px (unmoved) |
| pressables under 44px | none | none |

Design predicted ≈3150px; measured 3103. Search-open state re-measured: counters hidden, 61 result
cards, no link under 44px, nothing past the right edge. `/` clean at 320, 375 and 390px. 1440px
screenshot hash identical to baseline. Read the 375px screenshot: the card still says name,
sentence, count.

## Step 2 — one counter's menu (`cdd7555`)

Written: `.menu-head h1 { font-size: clamp(1.7rem, 6.2vw, 2.1rem) }`,
`.menu-section a { min-height: 44px }`.

| at 375px | before | after |
| --- | --- | --- |
| Bakery items under 44px | **7** of 107 | **0** |
| The Bowl Shop items under 44px | **3** of 103 | **0** |
| shortest item | 42px | 44px |
| median item | 81px | 81px (unchanged) |

The "clamps meet" claim, checked rather than asserted — `.menu-head h1` computed font-size on
`/menu/japanese-home/` (the longest counter name):

| viewport | 375 | **544** | **545** | 704 | 1440 |
| --- | --- | --- | --- | --- | --- |
| font-size | 27.2px | **33.6px** | **33.6px** | 42.24px | 49.6px |

No step at the breakpoint. Three menus clean at 320, 375, 390px; three 1440px hashes identical.

## Step 3 — the trimmings and the shelves (`07d29a8`)

Written: `.crumbs a` / `.variants a` inline-flex 44px; `.chips li` 44px by padding and `.chips a`
filling it; `.shelf { gap: 0.8rem }`; `.shelf a { padding: 1rem 1.2rem }`.

| `/boston-baked-beans/` at 375px | before | after |
| --- | --- | --- |
| crumb links | 20px | **44px** |
| chip links | 15px | **44px** (pill and link both) |
| variant links (Instant Pot, Slow Cooker) | 17px | **44px** |
| `.chips` row | 66px | 95px (the cost) |
| document | 2964px | 3024px |

| the shelves at 375px | before | after |
| --- | --- | --- |
| `/pita-bread/` `.pairs` (30 cards) | 2554px* | **2345px** |
| front-door search results (60 + more) | 7669px doc | **6470px doc** (−16%) |
| tallest result card | 99px | 86px |
| pair card | 64px | 64px (unchanged) |

\* computed from the measured gap change (7.2px × 29 gaps), cross-checked against the 3-card case
on `/boston-baked-beans/`, which measured 275 → 261px = 2 × 7.2px.

---

## Two deviations from the plan, both found by measuring

**1. `display: inline-flex` on `.chips li` ate a space.** The first version made the chip a flex
row to centre its content. A fact chip is a text node and a `<b>` — `"serves "` then `"8"` — and a
flex container turns each into an anonymous flex item, which strips the run's trailing space. The
375px screenshot read **"serves8"** and **"about6 hr"**. Rewritten to grow the chip with padding
(`min-height: 44px; padding: 0.75rem`) and let the link take that padding back off with a negative
margin so it covers the whole pill. Same 44px, spaces intact — re-measured: chips read "serves 8"
and "about 50 min", `li` 44px and `a` 44px at full pill width.

This also fixed a second fault in the same rule: with the flex version the pill measured 44px but
the **anchor inside it measured 34px**, so a tap on the pill's own padding landed on the `<li>` and
did nothing. The criterion is about what you can press, not what you can see.

**2. `.shelf a` padding does not reach the pair cards, and the first comment said it did.**
Written as `1.1rem 1.2rem` on the theory that it would override `.pairs .shelf a { padding: 1rem
1.2rem }` by order. It does not: `.pairs .shelf a` is the more specific selector and wins whatever
the order. Measured pair cards stayed 64px either way. Changed to `1rem 1.2rem` — the same value
the pairs rule already uses, so the line is now true to its intent (one card size on a phone) and
the comment says what actually happens: the only cards it moves are the search results.

---

## Verification run

| check | result |
| --- | --- |
| `npm run verify` | **9 test files, 831 tests, 682 pages** — green |
| `breakpoints.test.ts` (inside verify) | green; only `44rem` and `34rem` written, no block edit needed |
| `check-overflow --width 1440` × 8 routes, hashes vs baseline | **8 of 8 identical** |
| `check-overflow --width 375,390,320` on the changed pages | clean |
| `check-overflow --width 375` over all 682 pages | see `review.md` |

A note on the full sweep: an early run reported `/whitefish-salad/` with a `<code>` past the right
edge. It was an artefact of the harness, not the CSS — the sweep serves `dist/` while it runs, and
that run overlapped a rebuild, so one page loaded without its stylesheet and its `<pre>` had no
`overflow-x: auto` yet. Re-checked on a stable build: clean. The final sweep in `review.md` was run
with nothing else touching `dist/`.

## Left for other tickets, unchanged here

- `AddToPlan` (35px, 21px) and the three `.mode` buttons (40px) — T-004-04 owns those files.
- `.source summary` (24px) — the "source" section of `site.css`, unowned; T-004-06.
- `.filter` / `.filters` (the ticket's "shelf labels") and `.shelf-group` — rules nothing renders.
- The two variant links sit ~6.7px apart on one line; separating them needs markup.
