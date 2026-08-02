# T-004-02 — Structure

Two files, both named by the ticket. No files created, none deleted, no dependency added.

| file | action | scope of the change |
| --- | --- | --- |
| `src/styles/site.css` | modified | one word in the breakpoint block; ~45 lines added at the end of `/* ---- the table ---- */` |
| `src/components/RecipeTable.astro` | modified | one `<span>` in the foot; ~20 lines in the existing `<script>` |

---

## `src/styles/site.css`

### Edit 1 — the breakpoint block (line 14)

```
-  snug     max-width: 44rem   [reserved]  the widest recipes have stopped fitting
+  snug     max-width: 44rem   [in use]    the widest recipes have stopped fitting
```

The block's own rules say to flip the tag when the first `snug` query is written.
`src/styles/breakpoints.test.ts` asserts that anything tagged `[in use]` is written by a real
query, so this edit and the query below are one unit and must land in the same commit.

### Edit 2 — appended to the table section, after `.reset` (~line 706)

Two blocks, in breakpoint order, placed beside the rules they change and at the end of the
section — the placement rule from the block at the top of the file.

**Block one, `@media (max-width: 44rem)` — the pinned column.** Everything here is a consequence
of one property; the comment above it has to say so, because a reader who deletes the shadows
because they look decorative will silently delete the column's borders.

```
.cell--ingredient
    position: sticky; left: 0; z-index: 1
    border: 0                             ← the collapsed border cannot travel; the cell draws its own
    background: var(--clay-surface-raised)  ← must be opaque: ops scroll under it
    --edge: 0 0 0 transparent             ← no depth until something is actually hidden
    box-shadow: inset 0 1px 0 var(--line)      the row hairline
                inset 1px 0 0 var(--line)      the outer left hairline
                inset -1.5px 0 0 var(--frame)  the spine
                var(--edge)

.table-well[data-more] .cell--ingredient
    --edge: <warm ink shadow, offset right>   ← the depth cue, measured not assumed

.cell--ingredient[data-done]        opacity: 1
.cell--ingredient[data-done] > span opacity: 0.4
```

Ordering inside the block matters once: `--edge` must be declared on `.cell--ingredient` before
it is used, and the `[data-more]` rule overrides only the custom property, so the four shadow
layers are written once.

**Block two, `@media (max-width: 34rem)` — the metrics.**

```
.recipe-table            min-width: 0        ← was 30rem; a phone-only floor, and the biggest single cost
.cell                    padding: 0.62rem 0.45rem   ← inline only; the block value is the 44px tap target
.cell--ingredient .qty   min-width: 3.4rem   ← was 4.4rem
.cell--op                min-width: 4rem     ← was 4.75rem
```

### Edit 3 — the foot line's style, beside `.hint` (~line 705)

```
.table-more   color: var(--clay-primary)
```

One declaration; size and colour otherwise inherit from `.hint`. Named `table-more` to sit in the
section's existing vocabulary (`table-well`, `table-scroll`, `table-foot`) and to be greppable.
Ungated by any media query: it is only ever visible when `hidden` is removed, which measurement
does.

### Not touched

`.table-scroll`, `.recipe-table`'s `width`/`border-collapse`, `.cell`'s border, `.cell--op`'s
`max-width`, `.cell--prep`, `.cell--blank`, `.table-foot`'s flex, the `@media print` block, and
the comment at 629–634. No selector using `:first-child` or `:last-child` is added.

---

## `src/components/RecipeTable.astro`

### Edit 1 — markup, inside `.table-foot`

```diff
   <figcaption class="table-foot">
-    <span class="hint">Tap anything to cross it off.</span>
+    <span class="hint">
+      Tap anything to cross it off.
+      <span class="table-more" hidden>More to the right — drag the table across.</span>
+    </span>
     <button class="clay-button clay-button--soft reset" type="button" hidden>Clear the marks</button>
   </figcaption>
```

Nested inside `.hint` rather than added as a third flex child: `.table-foot` is
`justify-content: space-between`, and a third item would have to share a 327px row with the reset
button. Nested, the cue wraps to a second line and the foot's layout is untouched. It ships
`hidden`, the same contract `.reset` already uses, so a reader with no JS sees the table exactly
as before.

### Edit 2 — the script, appended inside the existing `forEach((table) => { … })`

A new section after the cell handlers and before the `reset` listener, sharing the loop's `table`
binding. Public surface: none — it is inside the module script, exports nothing, and touches only
elements inside this table's own `.table-well`.

```
scroll  = table.closest('.table-scroll')
well    = table.closest('.table-well')
more    = well.querySelector('.table-more')

measure():
    room   = scroll.scrollWidth - scroll.clientWidth
    unseen = room > 1 && scroll.scrollLeft < room - 1
    if unseen === last: return          ← no DOM write when nothing changed
    last = unseen
    well.toggleAttribute('data-more', unseen)
    more.hidden = !unseen

scroll.addEventListener('scroll', measure, { passive: true })
ResizeObserver(measure).observe(scroll)   ← the box changed
                       .observe(table)    ← the content changed inside an unchanged box
```

Three properties this shape has to keep:

1. **Idempotent.** `measure` is called on every scroll frame; the early return means the DOM is
   written only on a state change, so no style recalculation is forced while the finger is moving.
2. **Per table.** All three elements are looked up through `table.closest`, so a page with two
   tables cannot cross-wire them. (`[slug].astro` renders one, but the script's outer `forEach`
   already assumes more than one is possible.)
3. **Non-fatal.** If `.table-scroll` or `.table-well` is ever absent the block is skipped and the
   cross-off behaviour above it is unaffected.

### Not touched

The `localStorage` key and load/save, the `data-cell` ids, `tabIndex`/`role`/`aria-pressed`, the
click and keydown handlers, the reset button, the caption, and every `<td>` the grid emits. The
rowspans, colspans and `colCount` the invariant reads are produced by `layout.ts`, which this
ticket does not open.

---

## Ordering

1. **Breakpoint tag + the `44rem` block together.** Either alone fails
   `src/styles/breakpoints.test.ts` (tag without a query) or leaves the block lying about itself
   (query without a tag).
2. **The `34rem` metrics block** after it: independent of the sticky work, and the sticky column
   should be proven on today's widths before the widths change under it.
3. **The markup span and the script** together: the CSS for `.table-more` is inert until the
   markup exists, and the markup is `hidden` until the script measures.

Three commits, in that order, each one leaving `npm run verify` green.

---

## Verification surface

Nothing here adds a test file — the ticket's file ceiling forbids it. What checks the work:

- `npm run verify` — `check-recipes` (runs `findTilingErrors` over all 658), 831 vitest tests
  including `breakpoints.test.ts`, then a 682-page `astro build`.
- `node scripts/check-overflow.mjs` — body-level horizontal scroll across every built page at
  375px, and at the nine other widths T-004-01 used.
- `node scripts/check-overflow.mjs --shots` — full-page PNGs and SHA-256 hashes at 1440px, before
  and after, for the "renders exactly as today" criterion.
- A scratch CDP probe for what those two cannot see: sticky geometry while scrolled, cell heights,
  `data-more` presence, and taps landing on the pinned column.
