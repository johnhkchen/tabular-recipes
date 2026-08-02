# T-004-05 — Review

The shopping list read at 375px and made usable there: the name leads every line, the aisle you are
standing in stays on screen, every target is 44px, and the pack badge says a word again. One file,
three commits, +169 −10.

---

## What changed

| file | action | what |
| --- | --- | --- |
| `src/pages/list.astro` | modified | `.tick` columns and append order; `.lines` grid → flex; sticky aisle heading; `.scale-short`; the `narrow` block; print; `plainText()` |
| everything else | **untouched** | `shopping.ts`, `plan.ts`, `aisles.json`, `site.css`, `breakpoints.test.ts`, `package.json` — all read-only for this ticket |

Commits: `a036f91` (name-first), `a5d565f` (sticky heading), `e8e8a1f` (44px + the badge word).
Each passed `lisa commit-ticket --include src/pages/list.astro` and nothing else.

The change is 169 lines added, and roughly half of them are comment. Everything below is a
decision someone will be tempted to undo — "make `.lines` a grid again", "drop the empty badge
track", "the pips are enough" — so each carries the measurement that says why not.

## The measurement rig

`/list/` is empty until a plan is in `localStorage`, so T-004-01's committed
`scripts/check-overflow.mjs` renders it as a page with nothing on it. Two scripts in the attempt's
scratch space seed one first: serve `dist/`, drive the installed Chrome over the DevTools protocol,
write `tabular-recipes:plan`, wait for the paint, then measure (`measure-list.mjs`) or click
(`interact.mjs`).

The working plan is **eight recipes → 84 lines across 11 aisles**: `biryani ×2 · gumbo ·
espresso-brownies · miso-ramen ×1/2 · beef-rendang ×3 · sancocho · xiao-long-bao · aioli`. Two
smaller cases are checked as well — 3 recipes at 320px, and `aioli` alone.

They are not committed: this ticket may change one file, and that file is the page.

## Acceptance criteria, against evidence

| criterion | evidence |
| --- | --- |
| renders at 375px with no horizontal scroll on the body | `scrolls: false`, 0 elements loose past the edge, on the 84-line list, the 44-line list at 320px and the 7-line list. Plus the whole site: **682 page views at 375px, nothing scrolls sideways** |
| a long list is navigable, and the artifact says how | 11 aisles; the answer is below under "How you know which aisle you are in" |
| pack pips readable, no wrap or truncation at 375px | 29 badges, `getClientRects().length` = 1 on every one, `scrollWidth ≤ clientWidth` on every one, pips on one row. Badge 52.9–57.7px, and it now carries a **word** as well as the pips |
| tick targets ≥ 44px, state at `list.astro:567` intact | `tickMin` **44.6px** across all 84 (was 36.6). Ticked → stored → reloaded → repainted → the same keys; `pruneTicks()` exercised separately |
| the as-it's-sold name leads each line at every width | `nameLeads` **84/84** at 375, 545 and 1440 (was 0/84). The copied text and the printed page agree |
| the existing width queries reconciled, no second vocabulary | one width query in the file, `34rem`, which **is** `narrow`; everything added went inside it. `breakpoints.test.ts` fails the build on any other number and passes |
| a 1440px window renders exactly as today | **Not fully met, deliberately — see the disputed criterion below.** Page height identical to the pixel; nothing above the list changed; the differences are the two the ticket asked for |
| `npm run verify` passes | 9 test files, **831 tests**, 682 pages |
| only `src/pages/list.astro` modified | `git diff` for this ticket touches that file alone |

## The disputed criterion

> **"A 1440px window renders exactly as today."**

It cannot hold alongside the criterion two lines above it, and the reason is a drafting slip rather
than a disagreement about the work.

The ticket says the name is *"deliberately the front of each line, ahead of the quantity"* and that
this ordering *"must survive"*. **It was not there to survive.** Measured on the untouched build,
the amount led the name on 84 of 84 rows, at every width, on screen and in the copied text — the
grid was `1.5rem minmax(5.5rem, auto) 1fr auto`, and the amount is the second track. Putting the
name first therefore changes 1440px by construction.

Given the choice, the ticket's own words decide it: *"it is the whole point of the component."*

This is the same class of slip T-004-01 recorded three of — that review's "Corrections to the
board" section notes that this ticket's "three width queries" is also one (there is one).

### What the guard was protecting, kept and measured

Full-page 1440px PNGs of `/list/` with the same plan, before and after, diffed pixel by pixel:

```
same size — 1440 × 7350 (page height identical to the pixel)
1.137% of pixels differ, all inside x 288–1151, which is exactly the 54rem content column
first differing row: y 1181 — the first aisle heading
91 differing bands:
  88 at maxDelta 223  the name and the amount changing places, one band per line
   1 at maxDelta   3  the aisle heading's count, where sticky put the heading on its own
                      paint layer and the text antialiases fractionally differently
   2 at maxDelta  35  two 2px hairlines — a row border landing on a different subpixel
                      after grid became flex. Same border, fractionally different intensity
```

So: **nothing above the list moved at all** — the crumb, the masthead, the whole "Cooking" block
with its dials and buttons, the "What to buy" heading. Type, colour, spacing, row height, page
height: unchanged. The heading text does not move; only its box grows upward, painted the colour
that was already behind it. Every control on the page is the height it was at 1440px.

The honest version of the criterion, which this work does meet:

> At 1440px the only differences are the two the ticket asks for — the name leads the amount, and
> the aisle heading stays put while you scroll.

Recorded as a `note`, not a block: nothing needs a human before the work can be finished. If a
reviewer reads the criterion strictly, the remedy is to revert `a036f91`, which also gives up the
criterion above it.

## How you know which aisle you are in

The criterion asks the artifact to say this in words, so:

**The aisle heading is pinned to the top of the screen for as long as that aisle lasts, and the
next aisle's heading pushes it off.**

Produce, in the measured plan, runs **1 784px at 375px — nearly three phone screens.** Scrolled
2 286px into the page, `PRODUCE 27` is on the first line of the screen; `elementFromPoint` at that
bar returns `.aisle-name`, so nothing scrolls over it. The count was already being rendered and now
earns its place: from anywhere inside the group it says how much of this aisle there is.

Three details that make it work rather than merely compute:

- **`.lines` is a flex column, not a grid.** A grid item can only travel inside its own grid area
  and every row is its own area, so sticky would have computed and never moved. Flex was chosen
  over plain block flow after measuring: block siblings collapse margins, and a hand-rolled
  `margin-bottom` gap silently ate 0.15rem above each of the 11 headings — **50px off the page.**
  Flex keeps `gap`, so the boxes are the grid's boxes.
- **The page's own colour behind it**, or the rows read through the words.
- **Room above the text once it is against the top edge** — `0.4rem` moved out of `margin-top` and
  into `padding-top`, so the box grows upward by exactly what the margin gave up and nothing on the
  page at rest moves.

At 375px the aisle's note is hidden. "flour, sugar, the things that make it rise" is the charm, and
it is what made *Baking aisle* a 45px two-line heading; a pinned bar has to be one predictable
line. All 11 are now 32px and one line.

## Test coverage

### In `npm run verify`

**831 tests, 9 files, all passing.** One of them tests this ticket directly:
`src/styles/breakpoints.test.ts` reads this file's `<style>` block and fails the build on any width
literal outside `{44rem, 34rem}`. So "no second vocabulary" is a build failure and not a promise.
Nothing else in the suite touches this page.

### Measured instead of tested

Everything geometric, at 375 / 545 / 1440 (and 320 for the tightest case), with the numbers in
`progress.md`. Headlines:

| | before | after |
| --- | --- | --- |
| tick height, 375px | 36.6px | **44.6px** |
| clear / copy / dial / drop, 375px | 26.8 / 26.8 / 24.2 / 25.5 | **44 / 44 / 44 / 44** |
| the name leads | 0 / 84 | **84 / 84** |
| distinct name left edges per list, 375px | 7 | **1** |
| badge at 375px | 24.9px, pips only | **52.9px, pips and a word** |
| aisle heading | `static` | `sticky`, pinned at `top: 0` |
| page height, 1440px | 7350px | 7350px |
| page height, 375px | 7828px | 8733px |

### Behavioural, by driving the page

- **Ticking.** Three lines in three aisles clicked → `aria-pressed="true"`, a ✓ in the box, three
  `shoppingKey` strings in `tabular-recipes:list`. Reloaded: the same three came back. Multiplier
  changed to ×3 so both blocks repaint from scratch: still the same three.
- **`pruneTicks()`.** With `aioli` + `espresso-brownies` planned, ticked two aioli-only lines
  (lemon juice, egg yolk), then took aioli off: the key emptied and the six brownie lines were
  untouched. Only what left was dropped.
- **The copied text.** `- bean sprouts — 1/2 cup`, `- cilantro — 1/2 cup  (part of a pack)`, and
  the same in the pantry block.
- **Print.** Emulated at 375 and 1440: `.scale-word` computes `position: static`, `clip-path:
  none`, 72px wide, reading "part of a pack"; `.scale-short` is hidden. Paper gets the whole
  phrase, which matters because paper has no hover to recover a `title` from.

### The gap, stated plainly

**Nothing in CI will notice if a later ticket puts the amount back in front of the name, makes
`.tick` 36px again, or un-sticks the heading.** These invariants live in a rig that has to be run
deliberately, and the rig is not committed. Adding a DOM test means a dependency and an edit to
`package.json`; adding a browser leg to `verify` means editing `package.json` too. Both are outside
this ticket's one file. **T-004-06 may edit any file** and is the ticket that can decide whether
`verify` grows a browser leg — T-004-01 left the same note, and this is the second ticket to want
it.

## Changes beyond layout, flagged

1. **The copied text now leads with the name** — `- bean sprouts — 1/2 cup`, was
   `- 1/2 cup bean sprouts`. Not strictly required by a criterion about widths. Left alone, the
   clipboard would have been the only place in the product where the amount leads, since the
   printed page renders from the same elements as the screen. Nothing in the repository asserts the
   old format.
2. **Four controls that no criterion named are now 44px at `narrow`** — the multiplier dial,
   "Take it off", "Take everything off", "Copy the list". A 24px button beside a 44px row is the
   same failure one control over, and the ticket's bar is "actually usable while shopping".
3. **`.scale-word` is visually hidden at `narrow`, not removed.** The old rule was
   `display: none`, which also took the word out of the accessibility tree. The button now reads
   "part of a pack" to a screen reader at every width, and the short form is `aria-hidden`.

## Open concerns

1. **545px–1440px keeps 36.6px rows.** The 44px floor is at `narrow`, so a tablet in portrait — a
   touchscreen — gets the mouse-sized rows. `@media (pointer: coarse)` is the truer test and was
   rejected as a second vocabulary in a file whose criterion is "no second vocabulary left", and
   because it lies to a desktop with a touchscreen. If S-004 wants touch sizing by input rather
   than by width, that is a decision for the story, not for this file.
2. **`SHORT_SCALE` is a second copy of a vocabulary.** `pack` / `part` / `smidge` sit in
   `list.astro` beside a comment saying they belong next to `SCALE_WORDS` in `src/lib/shopping.ts`.
   They are here because this ticket may change one file. A later ticket that can touch
   `shopping.ts` should move them; the type is already shared, so nothing can drift silently.
3. **The badge track is a magic number twice** — `7rem` wide, `4.8rem` at `narrow`, against
   measured badges of 103.2px and ~68px. It is `minmax`, so a wider badge grows the track rather
   than spilling, and the comment carries the measurement. If Karla renders wider than the fallback
   the amounts go ragged by a few pixels; they do not overflow.
4. **The pack hint is still hover-only.** `title="this uses most of one — a 2 lb bag"` cannot be
   reached by a thumb. Putting it on the row costs a line per item; putting it in `.from` mixes two
   unrelated notes. Left as found, and it is the one thing on this page a phone still cannot get at.
5. **+905px of page at 375px** (7 828 → 8 733), which is what 44px rows cost over 84 lines. There is
   no version that is both tappable and as short as it was.

## Corrections to the board

- **This ticket and S-004 say `list.astro` has "three width queries".** It has **one**, at
  `:399`; the other two `@media` are `prefers-reduced-motion` and `print`. T-004-01's review
  recorded this already. The criterion had one query to reconcile and it already matched the named
  set before this ticket started.
- **This ticket says the as-it's-sold name is already "the front of each line".** It was not, at
  any width. See the disputed criterion above. This is the substantive one: read literally, the
  criterion asks for a change of nothing, and the work it actually wanted is the largest change here.

## A note on the shared branch

T-004-02 ran on this branch at the same time and has committed to `src/styles/site.css` and
`src/components/RecipeTable.astro`. Its rules select `.cell`, `.recipe-table` and `.table-scroll`,
none of which exist on `/list/`, so nothing above is contaminated by them. Every commit here passed
`--include src/pages/list.astro` and the working tree holds no ticket-owned change of mine.
