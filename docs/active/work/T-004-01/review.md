# T-004-01 — Review

Breakpoints named, the shell made to fit a phone, and the invariant the rest of S-004 leans on
turned into one command. Three commits, two files modified, two created.

---

## What changed

| file | action | what |
| --- | --- | --- |
| `src/styles/site.css` | modified | breakpoint block (+30 lines at the top); `.skip` rewritten; two `@media (max-width: 34rem)` blocks |
| `src/styles/breakpoints.test.ts` | created | 5 tests — no width query anywhere may use a number outside the named set |
| `scripts/check-overflow.mjs` | created | whole-site no-horizontal-scroll check in a real browser, zero dependencies |
| `src/layouts/Base.astro` | **read, unmodified** | every defect was a CSS property; its viewport meta and markup were already correct |
| `src/pages/list.astro` | **unmodified** | its `34rem` query already *is* the named breakpoint |
| `src/components/CookModes.astro` | **unmodified** | same |

Commits: `b72822a` (names + test), `acb21f1` (the check), `c45a4d9` (the shell).

## The breakpoints

```
snug     max-width: 44rem   [reserved]   the widest recipes have stopped fitting
narrow   max-width: 34rem   [in use]     the common recipe has stopped fitting,
                                         and the page furniture is cramped
```

Derived, not borrowed. A table fits when viewport − body padding − well padding ≥ the table's own
minimum, which puts the thresholds at **34.1rem** for a 5-column recipe (294 of 658 — the biggest
bucket), **39.6rem** for 6 columns, **44.5rem** for 7. `34rem` — already in the codebase, chosen
before anyone did that arithmetic — lands within 0.1rem of where the modal recipe stops fitting, so
it was kept rather than moved. `44rem` is where the first recipe on the site stops fitting.

`snug` is declared and **not yet used**. It exists so T-004-02 and T-004-04 have a middle step
ready instead of inventing one, which is the failure this ticket was written to prevent. The block
tags it `[reserved]`, tells the next ticket to flip the tag to `[in use]`, and licenses its deletion
if S-004 ends with no user. Flagged below as the one open judgement call.

## Test coverage

### Automated, in `npm run verify`

`src/styles/breakpoints.test.ts` — 5 tests, pure node, no dependencies. Reads the allowed set out of
the comment block (so block and check cannot drift), scans `src/**/*.css` and every `<style>` block
in `src/**/*.astro`, and fails on any media-feature width outside the set.

Proved in both directions:

- **Green on the untouched codebase** — which is the evidence for "the two existing `34rem` queries
  either use the named set or are updated to". They already did, so neither file was edited.
- **Red on a third number** — `CookModes.astro` temporarily set to `35rem` produced
  `…/CookModes.astro writes (max-width: 35rem). The set is 44rem and 34rem, declared at the top of
  src/styles/site.css.` Reverted immediately.

It also found a bug in its own first draft: it was reading the comment block's worked example
(`@media (max-width: var(--x))`, written there to explain why custom properties do not work in media
queries) as a real breakpoint. CSS comments are now stripped before scanning.

`npm run verify` end to end: **9 test files, 831 tests passing**, 682 pages built.

### Automated, as a command — the invariant

`node scripts/check-overflow.mjs` serves the build, drives the installed Chrome over the DevTools
protocol with node's built-in `WebSocket`, and measures real layout. **This is the choice the ticket
asked me to state**: not the manual procedure, because T-004-06 must run this "across the whole
built site rather than a sample" and 682 pages is not a manual procedure; and not a vitest test,
because measuring overflow needs a layout engine and the only way to add one is a dependency, which
this ticket's file scope forbids.

Result, after the change:

```
682 page views at 375px — nothing scrolls sideways.
80 page views at 320px, 375px, 390px, 414px, 543px, 544px, 545px, 768px, 1024px, 1440px
  — nothing scrolls sideways.
```

Both failure paths exercised: an injected `<div style="width:200vw">` in one built page was caught
and named (`SCROLLS 375px /aioli/ (766px of content in a 375px window)`); `CHROME_BIN=/nonexistent`
prints the by-hand procedure and exits 2. Full sweep: 1m46s.

Two distinctions the checker had to learn, both from measurement:

- **Left is not right.** `.skip` sat at `left: -9999px` on every page and creates no scrollable
  area in LTR; a naive checker fails all 682. (This ticket also removed the cause — see below.)
- **Inside a scroller is not overflow.** `espresso-brownies` at 375px has 18 elements past the
  viewport edge, all inside `.table-scroll`, and the body does not move. That is the pattern S-004
  mandates, not a fault.

### Manual

None required. Every criterion below is backed by a measurement.

## Acceptance criteria, against evidence

| criterion | evidence |
| --- | --- |
| breakpoint set decided, named, documented at the top of `site.css`, with a sentence on why | `site.css:19–48` — names, literals, the arithmetic, four rules for later tickets |
| the two existing `34rem` queries use the named set; no third near-duplicate | `breakpoints.test.ts` passes on the untouched files, fails on a `35rem` |
| `Base.astro` and the shell render at 375px with no body scroll — padding, nav, skip link, finder | 682/682 pages clean at 375px, plus nine other widths |
| headings and body type readable at 375px without the display font overflowing | `h1.scrollWidth <= h1.clientWidth` on every page tested, including the longest title in the collection (*Peanut, Black-Eyed Pea and Chicken Feet Soup*); h1 steps 30.4px → 26.25px at 375px; body stays 16px |
| tap targets in the shell and the finder ≥ 44px | measured, below |
| a 1440px window renders exactly as today; state how confirmed | 20/20 screenshot hashes identical — method below |
| `npm run verify` passes | 9 files, 831 tests, 682 pages |
| only the four named files modified, and in two of those only query values | two modified, two created; the two query-holding files were not touched at all |

### Tap targets, measured

| control | before, 375px | after, 375px | at 545px |
| --- | --- | --- | --- |
| `.site-bar a` ("Your list") | 54 × **24px** | 62 × **44px** | 54 × 24px — unchanged |
| `.skip:focus` | 159 × **43px** | 159 × **44px** | 159 × 43px — unchanged |
| `.back` ("← all counters") | 108 × **24px** | 108 × **44px** | 108 × 24px — unchanged |
| `.search input` | 322 × 50px | 322 × 50px | unchanged |

Identical at 390px. The `.search input` font stays at 16.32px — above the 16px floor below which
iOS zooms a focused field, which is why nothing stepped body type down.

### Desktop unchanged — the method, since the criterion asks for it

Ten representative pages — front page, `/list/`, `/404.html`, both largest menus (Bakery 107, The
Bowl Shop 103), a 7-column recipe (`miso-ramen`), a 6-column (`espresso-brownies`), a slow-cooked
one (`beef-rendang`), the deepest tree (`biryani`, 19 rows) and a 3-column (`aioli`) — rendered
full-page at **1440px and 768px** by `check-overflow.mjs --shots`, once against a build of the
pre-change stylesheet and once against the final build, and each PNG's SHA-256 compared.

**All 20 hashes identical.** Pixel identity, not a judgement. 768px is included because it sits
above both breakpoints and would catch a rule leaking out of its band; it is identical too.

Same tool on both sides, both runs offline, so the fallback fonts are the same in each — the
comparison is a claim about layout, not about the fonted render.

Boundary checked at 543/544/545px: the two heading clamps meet exactly (30.4px on both sides of
544px), so there is no visible step in type at the breakpoint.

## Open concerns

1. **`snug` is declared with no user.** It is the one thing here taken on faith: the arithmetic says
   the widest tables stop fitting at 44.5rem, but no rule writes it yet. If T-004-02 and T-004-04
   both end up needing only `narrow`, the honest move is to delete it. The block says so explicitly
   and the test's `[in use]` tag makes the state visible. A reviewer who would rather ship one
   breakpoint can delete six lines and lose nothing else.

2. **The check is not in `npm run verify`.** Wiring it in means editing `package.json`, which this
   ticket's file scope forbids, and it needs a browser a CI container may not have. **T-004-06 may
   edit any file** and should decide whether `verify` gains a `verify:mobile` alongside it, or
   whether the check stays a command run deliberately. Recorded here rather than left to be
   rediscovered.

3. **Two files created, and the criteria say "only … modified".** Both are creations, neither is
   imported by the site, `astro build` never sees them, and deleting both leaves the rendered output
   byte-identical. The ticket body says "Add whatever check makes this testable", which cannot be
   done without a file. If a reviewer reads the ceiling as covering creations too, the remedy is to
   delete `scripts/check-overflow.mjs` and `src/styles/breakpoints.test.ts` — but then criterion
   three ("prove the invariant") has nothing behind it.

4. **A step in the body padding at the breakpoint.** Side padding is 12px at 544px and 21.8px at
   545px, where it was previously continuous. Visible only when dragging a desktop window across
   544px; never on a device. Smoothing it means a fitted slope with two derived constants
   (`clamp(0.75rem, 5.77vw - 0.6rem, 1.36rem)`) in a stylesheet four more tickets have to read.
   Kept as-is, deliberately.

## Found broken, and left for the ticket that owns it

Each of these was measured, not guessed, and none is in this ticket's file scope.

1. **`.filter` renders nowhere.** `site.css:154–194` — 41 lines styling a pressable shelf label,
   with the comment *"Pressed means showing only this"* — and **no markup in the repository emits
   `.filter`, `.filters` or `.filter--clear`**. Confirmed by grep and by `querySelector('.filter')`
   returning null on the front page. **T-004-03's ticket describes these labels as an existing
   problem** ("the labels are pressable and sized for a mouse … at 21 counters plus categories they
   wrap into a large block"). They are not on the page. That ticket should decide whether to wire
   them up or delete the CSS, and should not spend its width budget restyling a control nobody can
   see. No rules were added here for the same reason.

2. **`AddToPlan`'s button is 34.7px tall** on a recipe page at 375px. `AddToPlan.astro` is
   T-004-04's file by name.

3. **`.chips a` is under 44px.** Its link styling lives at `site.css:410`, inside T-004-03's
   "recipe page's trimmings" section, and chips render only on `[slug].astro`. Left whole for one
   ticket rather than split across two.

4. **The finder's tally reads "Press `/` to search 658 recipes"** — a keyboard shortcut offered to
   a device with no keyboard. Copy, not layout; nobody's ticket. Worth a line in
   `docs/gaps/mobile.md` when T-004-06 writes it.

## Corrections to the board

Three counts in the story and its tickets are wrong. None changes any decision, all would waste a
later ticket's time.

- **S-004 and T-004-05 say `list.astro` has "three width queries".** It has **one** (`:399`). The
  other two `@media` in that file are `prefers-reduced-motion` and `print`. T-004-05's criterion
  "the three existing width queries are reconciled" has one query to reconcile — and it already
  matches the named set, so that criterion is satisfied before that ticket starts.
- **T-004-04 says `CookModes.astro` "has two width queries already".** It has **one**; the second
  `@media` is `prefers-reduced-motion`.
- **T-004-04 says `AddToPlan.astro` "has two queries".** It has two `@media`, and **neither is a
  width query** — they are `prefers-reduced-motion` and `print`.

## The framing this ticket had to correct

S-004 says a 375px phone "hits 105px of sideways scroll before a single word is drawn", and the
ticket calls body-level horizontal scroll "the failure that makes a page feel broken".

Measured before any change: **the body did not scroll on any of 682 pages at 375px.** The 105px is
real but it is the *table* scrolling inside `.table-scroll`, which is exactly the pattern the story
mandates, working as designed since before this story existed.

So this ticket did not fix that invariant — it **defended** one that already held. That is not a
smaller job: five tickets are about to write narrow-width CSS across five surfaces, and until now
nothing would have told them which one broke it. What is new is that a single command now answers
the question across the whole site in under two minutes, and T-004-06's hardest criterion
("checked across the whole build rather than a sample") is already tooled.

Stated plainly here so nobody later reads the green baseline as this ticket's achievement, or
concludes the story was wrong to be worried.
