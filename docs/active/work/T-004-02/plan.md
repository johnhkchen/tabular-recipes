# T-004-02 — Plan

Three commits, each green on `npm run verify`, each independently reversible. Then one
verification pass that produces the evidence every acceptance criterion asks for.

---

## Step 0 — the "before" that cannot be taken later

Capture reference renders **against the unmodified build**, because the "1440px renders exactly
as today" criterion has no meaning once the stylesheet changes.

```
node scripts/check-overflow.mjs --width 1440,768 --shots <scratch>/before-1440 \
  / /list/ /404.html /menu/bakery/ /menu/bowl-shop/ \
  /miso-ramen/ /espresso-brownies/ /beef-rendang/ /biryani/ /aioli/ /conchas/ /mole-poblano/
```

Twelve pages × two widths = 24 PNGs and their SHA-256s. 768px is in the set because it sits above
both breakpoints and would catch a rule leaking out of its band. Six of the twelve are recipe
pages spanning 4, 5, 6 and 7 columns.

*Not committed — a scratch artifact. The hashes go in `review.md`.*

---

## Step 1 — the pinned column

**Files:** `src/styles/site.css` (breakpoint block line 14, and a new `@media (max-width: 44rem)`
block at the end of the table section).

1. Flip `snug` from `[reserved]` to `[in use]`.
2. Add the block: sticky, `border: 0`, opaque background, the three inset edges, the `--edge`
   placeholder, and the two `[data-done]` rules.

**Verify before committing**

| check | how | expected |
| --- | --- | --- |
| the set still holds | `npx vitest run src/styles/breakpoints.test.ts` | 5 pass; `snug` now legal as `[in use]` |
| the column stays | probe `/miso-ramen/` at 375px, `scrollLeft = 9999` | ingredient cell's `left` still at the scroller's left edge |
| it is drawn | screenshot, scrolled | spine, row hairlines, outer left hairline all present |
| at rest it is unchanged | screenshot at `scrollLeft: 0` vs step 0's | same drawing: one spine, one hairline per row |
| the leak is closed | cross two ingredients off, scroll right, screenshot | no operation text reads through |
| deep trees | `mole-poblano` (5×15), `biryani` (4×19), `pineapple-bun` (6×18), `pastrami` (7×14) | column pinned, tall rowspan cells scroll cleanly under it |
| the snug band is real | probe `/miso-ramen/` at 700px | still overflows, column pinned |

`lisa commit-ticket --include src/styles/site.css`

---

## Step 2 — the metrics

**Files:** `src/styles/site.css` (a new `@media (max-width: 34rem)` block).

`min-width: 0` on the table; inline cell padding to `0.45rem`; `.qty` to `3.4rem`; `.cell--op` to
`4rem`. Block padding untouched.

**Verify before committing**

| check | how | expected |
| --- | --- | --- |
| less sideways scroll | probe 12 recipes at 375px | `miso-ramen` 324 → ~238px; `conchas` → 0 |
| tap targets | same probe, min cell height | ≥ 44px on every recipe measured, at 375px and 320px |
| the 44px floor is not luck | `conchas`, `aioli`, `biryani` at 320px | ≥ 44px |
| nothing above the band moved | probe at 700px and 1440px | identical to step 1's numbers |

`lisa commit-ticket --include src/styles/site.css`

---

## Step 3 — the affordance

**Files:** `src/components/RecipeTable.astro` (markup + script), `src/styles/site.css`
(`.table-more`, and the `[data-more]` rule inside the existing `44rem` block).

**Verify before committing**

| check | how | expected |
| --- | --- | --- |
| appears when it overflows | probe `/miso-ramen/` at 375px | `data-more` present, `.table-more` visible |
| absent when it fits | probe `/conchas/` at 375px | no `data-more`, `.table-more` still `hidden` |
| absent at 1440px | probe both at 1440px | no `data-more` on either |
| retracts at the end | scroll `/miso-ramen/` to the right end | `data-more` removed |
| returns | scroll back to 0 | `data-more` present again |
| no JS, no lie | strip the script, render | table draws and scrolls; nothing extra claimed |
| the depth cue | screenshot at 375px | shadow to the right of the spine, gone when scrolled to the end |

`lisa commit-ticket --include src/components/RecipeTable.astro src/styles/site.css`

---

## Step 4 — the verification pass

Run against a fresh `npm run build`.

### 4a. `npm run verify`

`check-recipes` over 658 recipes (this is `findTilingErrors` — the invariant criterion), then
831 vitest tests including `breakpoints.test.ts`, then a 682-page build. Must be green.

### 4b. No horizontal scroll on `<body>`

```
node scripts/check-overflow.mjs                     # 682 pages at 375px
node scripts/check-overflow.mjs --width 320,375,390,414,543,544,545,768,1024,1440 <10 pages>
```

The whole-site sweep is the S-004 invariant and is the check that would catch the foot line
pushing a page sideways at 320px.

### 4c. 1440px is unchanged

Re-shoot step 0's twelve pages at 1440 and 768 and diff the SHA-256 lists. **All 24 must match.**
Any mismatch is either a rule that escaped its media query or a real regression; either way it
blocks.

### 4d. Deep trees, named

The ticket wants recipes named, including at least one 15+ row file. The set, all at 375px,
scrolled to the right end:

| recipe | shape | why it is in the set |
| --- | --- | --- |
| `biryani` | 4 × **19** | deepest tree on the site |
| `pineapple-bun` | 6 × **18** | deepest wide one |
| `xiao-long-bao` | 5 × **18** | deep, modal column count |
| `mole-poblano` | 5 × **15** | the ticket's "mole" |
| `pastrami` | 7 × 14 | widest, deep |
| `miso-ramen` | 7 × 14 | widest, most scroll |
| `beef-rendang` | 6 × 14 | named in the ticket |
| `conchas` | 4 × 5 | the one that now fits — the "absent" case |

### 4e. Taps on the pinned column

At 375px, scrolled to the right end, dispatch a real click at the centre of a pinned cell and
read back `data-done` and `aria-pressed`; then the same on an operation cell. Both must toggle,
and the pinned cell must not toggle twice.

---

## What could go wrong, and what it would look like

| risk | how it shows | response |
| --- | --- | --- |
| a hash mismatch at 1440px | 4c fails | find the rule that escaped its query; `position: relative` and `--edge` are the two additions outside a `[data-done]` state |
| the 44px floor breaks on some recipe not sampled | not caught — only 12 of 658 are measured | measure the shortest cell across a wider sample in 4b's probe rather than trusting the sample |
| the foot line pushes a narrow page sideways | 4b fails at 320px | the cue is nested inside `.hint`; it wraps rather than widening the flex row |
| `ResizeObserver` fires before fonts settle | `data-more` wrong on first paint | it observes the table too, so a font reflow re-fires it |
| a browser that paints collapsed borders on sticky cells anyway | doubled spine on that engine | the redrawn edges replace `border: 0`, so there is nothing to double against |

---

## Out of scope, deliberately

- The right-edge gradient fade (needs a wrapper element — see `design.md`).
- `.cell--prep` losing its left anchor when scrolled: it spans every column and has nothing to
  stick to. Unchanged from today.
- Wiring `check-overflow.mjs` into `npm run verify`: `package.json` is not this ticket's file, and
  T-004-01 already left the decision to T-004-06.
- The 704–736px band where the 23 widest recipes scroll ≤29px with no pinned column: fixing it
  needs a third breakpoint, which T-004-01 forbids.
