# T-004-05 — Plan

Four commits, each one a thing that can be measured on its own. The measuring rig is built first,
because every step after it is a claim about pixels and none of them should be taken on trust.

---

## Step 0 · The rig (no commit — not repository code)

`scripts/check-overflow.mjs` (T-004-01) cannot see this page: `/list/` is empty until a plan is in
`localStorage`. So the harness for this ticket seeds one first.

`measure-list.mjs`, in the attempt's scratch space:

1. serve `dist/` on loopback (the same tiny static server as `check-overflow.mjs`),
2. launch the installed Chrome headless, attach over the DevTools protocol,
3. navigate to `/` on that origin, write the plan into `tabular-recipes:plan`,
4. navigate to `/list/`, re-assert the viewport, poll until `.lines .tick` exists,
5. evaluate one probe and print JSON; optionally capture a full-page PNG and its SHA-256.

The plan is fixed and spans the shop: `biryani ×2 · gumbo · espresso-brownies · miso-ramen ×1/2 ·
beef-rendang ×3 · sancocho · xiao-long-bao · aioli` → **84 lines, 11 aisles**, which is the
ticket's "at least six aisles" with room to spare.

The probe returns, per width: body scroll and any element loose past the edge; every `.tick`'s
height; whether `.name` precedes `.amount`; the set of distinct `.name` left edges; each `.scale`'s
line count, `scrollWidth` vs `clientWidth`, and box; each aisle heading's `position` and page
`top`; and the box of `[data-clear]`, `[data-copy]`, `.dial button`, `.drop`.

**Before-shots are captured now, against the unmodified build**, at 1440px, 545px and 375px. They
are the only way to say afterwards what changed on a desktop, and they cannot be taken later.

This file is not committed. It is not repository code, the ticket's scope is one file, and
T-004-01 already owns the committed browser check. Its full source and its output are quoted in
`review.md` so the numbers can be re-derived.

## Step 1 · The line reads name-first

**Edits:** S1 (vocabulary note), S4 (`.tick` columns), S8 (`drawLine()` append order + `Scale`
import), S9 (`plainText()`).

Landed together because they are one behaviour described in four places; splitting them leaves a
commit where the CSS says "column 2 is the name" and the script puts the amount there.

**Verify** — `npm run build`, then the rig at 375 / 545 / 1440:

| check | pass |
| --- | --- |
| name leads | `nameLeadsCount` = 84/84 at all three widths |
| name column is a column | `distinctNameLeftEdges` = 1 (from 7) |
| no sideways scroll | `scrolls: false`, `loose: []` |
| amounts align | badge track reserved on rows with no badge — right edge of `.amount` constant |
| copied text | evaluate `plainText()` in the page; first item line reads `- <name> — <amount>` |

**Commit** — `lisa commit-ticket --ticket-id T-004-05 --include src/pages/list.astro`

## Step 2 · The aisle heading stays on screen

**Edits:** S2 (`.lines` grid → block), S3 (sticky heading; `.aisle-note` hidden at `narrow`).

**Verify** — build, then:

| check | pass |
| --- | --- |
| sticky is live | scroll to the middle of Produce at 375px; the heading's `getBoundingClientRect().top` is 0, not negative |
| it is the right heading | the pinned `.aisle-name` reads `Produce` while `scrollY` is between Produce's and Butcher's tops |
| it is opaque | the heading's computed `background-color` is `--clay-bg`, not `transparent` |
| one line at 375px | every heading's `getClientRects().length` = 1 and height ≈ 26px, including *Baking aisle* |
| static layout unmoved | page height at 1440px within 1px of the Step 1 build; every heading's page `top` unchanged |
| the gap swap is neutral | `.lines` `scrollHeight` unchanged at 1440px |

The last two are the ones that catch a wrong `margin`/`padding` trade.

**Commit** — same command, same include.

## Step 3 · 44px, and the badge says a word

**Edits:** S5 (`.scale-short` + the visually-hidden swap), S6 (44px floors), S7 (print), and the
`SHORT_SCALE` map and second span in `drawLine()`.

**Verify** at 375px:

| check | pass |
| --- | --- |
| ticks | `tickMin` ≥ 44 across all 84 |
| the other four controls | `[data-clear]`, `[data-copy]`, `.dial button`, `.drop` all ≥ 44px tall |
| the dial still fits | the four buttons and `.drop` occupy one row inside `.planned li`; no sideways scroll |
| badge readable | every `.scale` shows a word; `getClientRects().length` = 1; `scrollWidth ≤ clientWidth` |
| pips intact | three `.pip` per badge, `pips` on one line |
| accessible name unchanged | a badged `.tick`'s `textContent` still contains the long label at 375px and at 1440px |
| still no sideways scroll | `scrolls: false`, `loose: []` |

And at 1440px: `.scale-short` is `display: none`, the long word is visible, nothing else moved.

**Commit** — same command, same include.

## Step 4 · The whole-page checks

No edits unless something below fails.

1. **`npm run verify`** — `check-recipes`, `recipes`, `vitest run`, `astro build`. The vitest run
   includes `src/styles/breakpoints.test.ts`, which is what proves "no second vocabulary": it scans
   every `<style>` block in `src/**/*.astro` and fails on any width literal other than `44rem` or
   `34rem`. Expected: 9 files / 831 tests, 682 pages.
2. **`node scripts/check-overflow.mjs`** — the whole built site at 375px. `/list/` is empty for
   this run, which is the case the rig cannot cover; the rig covers the full one. Expected: 682
   pages, nothing scrolls.
3. **`node scripts/check-overflow.mjs --width 320,375,390,414,545,768,1440`** on a representative
   handful including `/list/`.
4. **Tick state, by hand in the browser** — the criterion names `list.astro:567` specifically:
   - tick three lines in different aisles; read `localStorage['tabular-recipes:list']` and confirm
     the three `shoppingKey` strings are there;
   - reload; confirm the same three come back `aria-pressed="true"` with a ✓;
   - change a multiplier so the block repaints; confirm the ticks survive;
   - take a recipe off the plan and confirm `pruneTicks()` drops only the keys that left.
5. **Desktop diff** — full-page 1440px PNG of `/list/` with the same plan, against Step 0's
   before-shot. The expected differences are exactly two: the name/amount order, and nothing else.
   Any third difference is a bug in this ticket. Page height compared as a number, and both PNGs
   kept for `review.md`.
6. **One-recipe plan** — `aioli` alone, 375px: two aisles, no badge on some rows, the reserved
   badge track still holding the amounts in line. Guards against a layout that only works when
   full.
7. **Print** — emulate print media at 1440px and confirm the long word is what renders.

## Testing strategy, and its limits

**What is unit-tested.** Nothing new. Every change is CSS or DOM assembly in an `.astro` page;
`vitest` in this repository runs pure modules (`units`, `shopping`, `schedule`, `layout`, …) and
there is no DOM environment, no `jsdom`, and no test that renders a page. Adding one means adding a
dependency and editing `package.json`, which the ticket's file scope forbids — the same wall
T-004-01 hit and answered with a script rather than a test.

**What `npm run verify` does cover** for this ticket: `breakpoints.test.ts` reads this file's
`<style>` block and fails on a stray width literal, so the "one vocabulary" criterion is a build
failure and not a promise. Everything else in the suite is a regression guard on the libraries this
page reads.

**What is covered by measurement instead**: every geometric criterion, by the rig, at three widths,
with the numbers quoted in `review.md`.

**The gap, stated plainly.** Nothing in CI will notice if a later ticket makes `.tick` 36px again,
un-sticks the heading, or puts the amount back in front of the name. The invariants of this page
live in a script that has to be run deliberately. T-004-06 may edit any file and is the ticket that
can decide whether `npm run verify` grows a browser leg; this is recorded for it rather than left
to be rediscovered.

## Rollback

Each step is one commit touching one file. Any step can be reverted alone. Step 1 is the only one
that changes desktop; Steps 2 and 3 are additive at `narrow` or invisible at rest.

## Definition of done

All eight acceptance criteria have a number or a named artifact behind them in `review.md`; the
1440px conflict from Design is written up as a `note` with both screenshots cited;
`lisa check-disposition T-004-05` reports clean; `src/pages/list.astro` is committed through
`lisa commit-ticket` and `git status` shows no ticket-owned file staged, modified or untracked.
