# T-004-03 — Review

The front door is a third shorter on a phone, every menu item and every trimming you can press is
44px, and a 1440px window is byte-identical to before the ticket. Four commits, **one file, +138
lines, no deletions, no markup, no dependency**.

---

## What changed

| commit | what |
| --- | --- |
| `a1b1611` | **the front door** — `@media (max-width: 34rem)`: `.counters` gap, `.counter a` padding, `.counter .blurb` margin, `.counter .teaser` hidden |
| `cdd7555` | **one counter's menu** — `.menu-head h1` clamp steps down, `.menu-section a` min-height 44px |
| `07d29a8` | **the trimmings and the shelves** — `.crumbs a` / `.variants a` / `.chips li` / `.chips a` reach 44px; `.shelf` gap and `.shelf a` padding tighten |
| `45eda6a` | comments corrected to the measured numbers where the first pass had written predicted ones |

All four blocks are `@media (max-width: 34rem)` — the `narrow` breakpoint T-004-01 named — placed
at the end of their own section, which is where the file's header block says a query goes. No new
width literal, so the breakpoint block at the top needed no edit and
`src/styles/breakpoints.test.ts` passes unchanged.

`src/pages/index.astro`, `src/pages/menu/[counter].astro` and `src/pages/[slug].astro` were read,
not written. Nothing here needed markup.

## The three decisions worth a reviewer's time

**1. The counter card sheds its teaser on a phone.** The 21 cards measured **4505px of a 4998px
page** — about seven phone screens of near-identical panels, and the biggest single component was
the teaser line of four dish names (504px of text plus 336px of margin). Hiding it at `narrow`,
with tighter padding and gaps, takes the column to **3103px (−31%)** and leaves each card saying
name, sentence, count — a label on a shelf. `display: none` removes it for screen readers too;
that is deliberate and argued in `design.md`. **This is the one change a reviewer might disagree
with, and it is one declaration to revert** — the rest of the block stands without it.

**2. A flex chip eats a space.** The first version of the chip rule used `display: inline-flex` to
centre a 44px pill. A fact chip is a text node and a `<b>` — `"serves "` then `"8"` — and a flex
container makes each an anonymous flex item, which strips the run's trailing space. The 375px
screenshot read **"serves8"**. The same version had a second fault: the pill measured 44px but the
anchor inside it measured 34, so a tap on the pill's padding landed on the `<li>` and did nothing.
Both fixed by growing the chip with padding and letting the link take that padding back off with a
negative margin. Caught by reading a screenshot, not by a number.

**3. `.pairs .shelf a` wins on specificity, not order.** The shelves block first wrote
`padding: 1.1rem 1.2rem` on the theory that it would override the pairs rule above it. It does not
— `.pairs .shelf a` is the more specific selector — so pair cards never moved. Rewritten as the
same `1rem 1.2rem` the pairs rule uses, which makes the intent (one card size on a phone) true and
leaves the search results as the only cards the line moves.

## Acceptance criteria against evidence

| criterion | evidence |
| --- | --- |
| `index.astro` at 375px, no body scroll: counters, finder, shelf labels, whatever else | clean at 320, 375, 390, 768px; also with the search open — 61 result cards, nothing past the right edge |
| a reader on a phone reaches the finder without scrolling past the counter list | **`.finder` sits at 279px and is 114px tall; the first counter starts at 429px** — on a 375 × 667 phone the finder is entirely on the first screen and the list has not begun. It precedes `.counters` in the document, and a running search hides the counters outright. Nothing was built; the list was shortened 4505 → 3103px so the *return* trip is shorter too |
| `menu/[counter].astro` at 375px, tested against **The Bowl Shop (103)** and **Bakery (107)** | both named and measured: items under 44px **7 → 0** (Bakery) and **3 → 0** (The Bowl Shop); one used column; no body scroll at 320/375/390/768 |
| `[slug].astro`'s trimmings at 375px, including a three-way variant switch | **`/boston-baked-beans/`** — a plain file with Instant Pot and Slow Cooker variants, all three ways on one page. Crumbs 20 → 44px, chips 15 → 44px, variants 17 → 44px. Also `/black-bean-soup/` (7 chips), `/pita-bread/` (30 pair cards), `/banh-mi-dac-biet/` (12 alternative names) |
| shelf labels and any other pressable element reach 44px | every pressable element these four sections own now measures ≥44px on all three pages. **The ticket's "shelf labels" (`.filter`) are not rendered by any page** — see below. Four elements on the recipe page still miss and are owned by other tickets — also below |
| the card grids are not rewritten | `grid-template-columns` untouched in both `.counters` and `.shelf`; no failure was found to name — both are correctly one column at 375px |
| a 1440px window renders exactly as today | **8 of 8 screenshot SHA-256 hashes identical** to the pre-ticket baseline (`b373652`), method below |
| uses the breakpoints T-004-01 named, no new numbers | six `34rem` blocks and one `44rem` in the file, all pre-existing values; `breakpoints.test.ts` green |
| `npm run verify` passes | **9 test files, 831 tests, 682 pages** — green |
| only `src/styles/site.css` (the four sections) modified | one file, +138 lines, four blocks, each at the end of its own section |

### The desktop-unchanged method

`node scripts/check-overflow.mjs --width 1440 --shots …` captures a full-page PNG per route and
writes a SHA-256 manifest. Taken on `b373652` before the first edit and again on the shipped build,
over `/`, `/menu/bakery/`, `/menu/bowl-shop/`, `/menu/japanese-home/`, `/boston-baked-beans/`,
`/pita-bread/`, `/banh-mi-dac-biet/`, `/black-bean-soup/`. All eight identical. This is stronger
than reasoning about media queries — it catches a rule that leaked out of one, a specificity
accident, and a changed cascade — but it proves it for eight pages, not 682.

### The narrow-width numbers, in one place

| | before | after |
| --- | --- | --- |
| front door: `.counters` | 4505px | **3103px** |
| front door: document | 4998px | **3596px** |
| front door: counter card (min/median/max) | 181/203/225px | 125/148/148px |
| front door with search open: document | 7669px | **6470px** |
| Bakery: items under 44px | 7 | **0** |
| The Bowl Shop: items under 44px | 3 | **0** |
| `.menu-head h1` at 375px | 33.6px | 27.2px (33.6px at 544 **and** 545 — the clamps meet) |
| recipe: crumb links | 20px | **44px** |
| recipe: chip links | 15px | **44px** (pill and link) |
| recipe: variant links | 17px | **44px** |
| recipe: chips row | 66px | 95px (the cost of tappable) |
| `/pita-bread/`: `.pairs` (30 cards) | 2554px | **2345px** |

## Test coverage, and its gaps

**Automated.** `npm run verify` runs 831 tests, of which the CSS-relevant one is
`src/styles/breakpoints.test.ts`: it fails the build on any `@media` width that is not one of the
two named breakpoints, and on a name tagged `[in use]` that nothing writes. That is exactly the
property this ticket could most easily break by accident, and it is covered.

**Not automated, by an earlier decision.** Heights, tap targets and overflow need real layout, so
they are measured by `scripts/check-overflow.mjs` (T-004-01's, in the repository, deliberately
outside `npm run verify` because it needs a Chrome that CI may not have) and by a scratchpad script
that reuses its CDP plumbing to evaluate arbitrary probes. The scratchpad script is **not** in the
repository: this ticket may modify `site.css` only, and adding a headless-browser test to `vitest`
would be a dependency change well outside it.

**The gap that leaves.** Nothing in CI would notice if a future edit dropped a tap target back to
34px or made the front door long again. The regression net for this ticket's work is the sweep
plus the screenshot hashes, both run by hand. Worth raising with T-004-06, which owns the
end-to-end pass.

**A harness note, not a code fault.** An intermediate sweep reported `/whitefish-salad/` with a
`<code>` past the right edge. `check-overflow.mjs` serves `dist/` while it runs, and that run
overlapped a rebuild, so one page loaded without its stylesheet — an unstyled `<pre>` has no
`overflow-x: auto`. Re-checked on a stable build: clean, and so are all 682 in the final run.

## Open concerns

1. **The ticket's "shelf labels" do not exist.** The criterion asks for 44px on the pressable shelf
   labels — `.filter` / `.filters`, "pressed means showing only this". **No page renders them**:
   zero occurrences of `class="filter` in the 682-page build and no mention in any `.astro` file.
   They also sit in the finder section, not one of the four this ticket owns. I reported them
   rather than styling them: a 44px rule on a selector nothing renders cannot be verified at any
   width, and adding one would put a fifth section in the diff to make a criterion *look* met. The
   pressable things actually on the front door are the 21 counter cards, at 125–148px.
   **`.shelf-group` (four rules, lines 545–568 pre-change) is dead the same way.** A reviewer may
   want either deleted or a filter row built; both are outside this ticket.

2. **Four pressable elements on the recipe page still miss 44px, by ownership.**
   `.clay-button.toggle` 35px and `.to-list` 21px (`AddToPlan.astro`) and the three `.mode` buttons
   at 40px (`CookModes.astro`) belong to **T-004-04**, which names both files. `.source summary`
   at 24px is in the "source" section of `site.css`, which no ticket owns; **T-004-06** may edit any
   file. Fixing them here would have meant editing another ticket's surface against this ticket's
   own scope criterion.

3. **Two variant links sit 6.7px apart.** Each is 44px tall and 76–84px wide, but on one line they
   are neighbours. Separating them needs the sentence "Also written for *Instant Pot*, *Slow
   Cooker*." to become a list, which needs markup this ticket does not own. For T-004-06.

4. **Hiding the teaser is a judgement, not a measurement.** It is the only content this ticket
   removes from a phone. If the reviewer wants it back, delete
   `.counter .teaser { display: none }` and the column returns to about 3950px; everything else in
   the block still applies.

5. **The desktop proof is eight pages.** Every rule is inside a `max-width` query, so 1440px cannot
   see them, and eight hashes confirm it — but that is a sample, not the build.

6. **Menu length is unchanged and deliberate.** Bakery is 10.7k pixels and The Bowl Shop 11.2k at
   375px. `design.md` argues that a 107-item menu is honestly 107 items long, unlike the front
   door, where 21 counters are a choice among things rather than the things. If a reviewer wants
   the menus shortened, the lever is the ingredient gloss under each item, and it is a content
   decision rather than a layout one.

## How to look at this yourself

```
npm run build
node scripts/check-overflow.mjs --width 375                  # 682 pages, the invariant
node scripts/check-overflow.mjs --width 1440 --shots shots/   # hashes for the desktop check
```

Then open `/`, `/menu/bakery/` and `/boston-baked-beans/` at 375px in a device toolbar. The four
new blocks are the only things in `site.css` that fire below 544px in these sections, and each
carries a comment saying what it measured and why it chose what it chose.
