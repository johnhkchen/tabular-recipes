# T-004-05 — Progress

| step | state | commit |
| --- | --- | --- |
| 0 · the measuring rig, before-shots | done | — (not repository code) |
| 1 · the line reads name-first | done | `a036f91` |
| 2 · the aisle heading stays on screen | done | `a5d565f` |
| 3 · 44px, and the badge says a word | done | `e8e8a1f` |
| 4 · whole-page checks | done | — (no further edits needed) |

`src/pages/list.astro` is the only file this ticket touched, and it is committed. Everything else
in `git status` belongs to T-004-02, running on the same branch (see the note at the end).

---

## Step 0 — the rig

`measure-list.mjs` and `interact.mjs`, in the attempt's scratch space: serve `dist/`, drive the
installed Chrome over CDP, seed `tabular-recipes:plan`, wait for the paint, then measure or click.
Not committed — this ticket may change one file, and T-004-01 already owns the committed browser
check (`scripts/check-overflow.mjs`), which cannot see this page because `/list/` is empty without
a plan.

Baseline, unmodified build, the eight-recipe plan (**84 lines, 11 aisles**):

```
375px   scrolls false · loose []       tick 36.6–55.6px   nameLeads 0/84   name left edges: 7
545px   scrolls false                  tick 36.6px        nameLeads 0/84
1440px  scrolls false · height 7350    tick 36.6px        nameLeads 0/84
        badge 24.9×6.7 at 375 (pips only, no word) · 103.2×14 at 545 and 1440
        clear 26.8 · copy 26.8 · dial 24.2 · drop 25.5   at every width
        11 headings, all position: static · Produce spans 1533→3361 = 1828px
```

Before-shots at 1440 / 545 / 375 captured and hashed.

## Step 1 — the line reads name-first

`.tick`'s tracks reordered to `1.5rem minmax(0,1fr) auto minmax(7rem,auto)`, `drawLine()`'s append
order swapped, `plainText()` swapped to match, and the breakpoint note added at the top of the
style block.

**Deviation from Plan.** The narrow badge track (`minmax(4.8rem, auto)`) was scheduled for Step 3
and landed here instead. Reserving 7rem for a badge at 375px left the name ~115px and pushed four
rows to three lines; the narrow override is part of the same column decision and splitting it left
an intermediate state that was worse than either end.

Measured after: `nameLeads 84/84` at 375 / 545 / 1440, name left edges down from 7 to **1** per
list, `scrolls false`, page height at 1440 and 545 unchanged (7350 / 7612). Copied text reads
`- bean sprouts — 1/2 cup`.

## Step 2 — the aisle heading stays on screen

Sticky heading, opaque, `z-index: 1`, with `0.4rem` moved from `margin-top` into `padding-top` so
the static layout does not shift. `.aisle-note` hidden at `narrow`.

**Deviation from Plan.** Structure said `.lines` should become `display: block`. It did, and the
1440px page lost **50px**: block siblings collapse their margins, so the hand-rolled `margin-bottom`
gap was swallowed above each of the 11 aisle headings. Changed to `display: flex; flex-direction:
column` with the original `gap: 0.15rem` — a flex item's containing block is the whole container, so
sticky still travels, and the boxes are the grid's boxes to the pixel. Page height back to 7350.

Measured: `position: sticky`, `background rgb(250,248,245)`, pinned `top: 0` while scrolled 2286px
into Produce, `elementFromPoint` at the pinned bar returns `.aisle-name` (nothing paints over it),
all 11 headings one line and 32px tall at 375px — *Baking aisle* included, which was 45px.

## Step 3 — 44px, and the badge says a word

`SHORT_SCALE` map, a second `.scale-short` span (`aria-hidden`), the wide/narrow swap, 44px floors
for `.tick` and the four other controls, and the print override.

`.scale-word` is now visually hidden at `narrow` rather than `display: none`, so the button's
accessible name is the long phrase at every width — better than before, where the narrow rule took
the word out of the accessibility tree.

Measured at 375px: `tickMin 44.6`, clear/copy/dial/drop all **44.0**, badge 52.9–57.7px on one line,
`scaleClipped 0`, `scrolls false`. At 1440px: every control back to its old height, badge 103.2px,
page height 7350.

## Step 4 — whole-page checks

| check | result |
| --- | --- |
| `npm run verify` | 9 test files, **831 tests**, 682 pages |
| `check-overflow.mjs` (whole site, 375px) | **682 page views — nothing scrolls sideways** |
| `check-overflow.mjs` at 7 widths on 5 pages | 35 page views — nothing scrolls sideways |
| 320px, three recipes, 44 lines | no scroll, `tickMin 44.6`, `nameLeads 44/44` |
| one-recipe plan (`aioli`, 7 lines) | no scroll, amounts still aligned at the same x as the 84-line list |
| tick → reload → repaint | the same three keys pressed and ticked every time |
| `pruneTicks()` | ticked two aioli-only lines, dropped aioli: the key emptied, brownies' lines untouched |
| print media | long phrase visible and unclipped, short form hidden, at 375 and 1440 |
| 1440px before/after diff | same page size; 1.137% of pixels differ; nothing above the first aisle heading changed |

## A note on the working tree

T-004-02 is running on this branch at the same time and has committed to `src/styles/site.css`,
`src/components/RecipeTable.astro`. Its rules are all `.cell`, `.recipe-table` and `.table-scroll`
selectors, none of which exist on `/list/`, so the measurements above are unaffected. Every
`lisa commit-ticket` here passed `--include src/pages/list.astro` and nothing else.
