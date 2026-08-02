# T-004-05 — Structure

One file changes. This is the shape of the change, edit by edit, in the order they land.

```
src/pages/list.astro      modified   — style block + drawLine() + plainText()
```

Nothing is created, nothing is deleted, no import moves, no module boundary shifts. `shopping.ts`,
`plan.ts`, `units.ts`, `aisles.json`, `site.css`, `breakpoints.test.ts` and `package.json` are all
read-only for this ticket.

---

## Map of the edits

| # | region | lines (today) | what |
| --- | --- | --- | --- |
| S1 | `<style>` — a new note at the top | after `:108` | name the breakpoint vocabulary and point at `site.css` |
| S2 | `.lines` | `:281-291` | grid → block, gap → margin, so sticky has somewhere to travel |
| S3 | `.lines li.aisle` + `.aisle-note` | `:296-319` | sticky, opaque, padding/margin swap; note hidden at `narrow` |
| S4 | `.tick` | `:326-342` | new column order and tracks |
| S5 | `.scale` block | `:367-404` | `.scale-short`; the width query rewritten and extended |
| S6 | new `narrow` rules | inside the same query | 44px floors for `.tick`, `.dial button`, `.drop`, `.small` |
| S7 | `@media print` | `:482-508` | keep the long word, drop the short one |
| S8 | `drawLine()` | `:872-924` | append order; the second scale span |
| S9 | `plainText()` | `:1036-1043` | name before amount |

Order matters twice: **S2 before S3** (sticky is inert until `.lines` stops being a grid), and
**S4 before S8** is irrelevant to correctness but keeps the intermediate state readable — the
columns and the append order describe the same thing and should move together in one commit.

---

## S1 · The vocabulary note

A comment immediately after the existing "everything here is `:global()`" note:

```
 * Widths: this file writes one number, 34rem — `narrow` in the block at the top of
 * src/styles/site.css. 44rem/`snug` is declared there but [reserved]; using it from here
 * would mean editing that block, which is another ticket's file. src/styles/breakpoints.test.ts
 * fails the build on any third number.
```

Prose only. Satisfies "no second vocabulary left in the file" by making the one vocabulary
findable, not just by not violating it.

## S2 · `.lines` becomes a block

```css
.lines      { list-style: none; margin: 0; padding: 0 }          /* was display:grid; gap:.15rem */
.lines li   { padding: 0.1rem 0; margin-bottom: 0.15rem; border-bottom: 1px solid … }
.lines li:last-child { margin-bottom: 0 }
```

Invariant to hold: the rendered spacing between rows, and the outer height of `.lines`, are
unchanged. `gap` puts 0.15rem *between* children only; `margin-bottom` would also put it after the
last, hence the `:last-child` rule. `.lines li` keeps its `0.1rem` vertical padding, which is what
stops the li's bottom margin collapsing with `.from`'s.

A comment says why the display type is what it is, because "make this a grid again" is an obvious
and wrong tidy-up.

## S3 · The aisle heading sticks

```css
.lines li.aisle {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--clay-bg);
  display: flex; align-items: baseline; gap: 0.5rem;
  margin: 1rem 0 0.2rem;                 /* was 1.4rem — see below */
  padding: 0.4rem 0.5rem 0.35rem;        /* was 0 0.5rem 0.35rem */
  border-bottom: 1.5px solid …;          /* unchanged */
}
.lines li.aisle:first-child { margin-top: -0.2rem }   /* was 0.2rem */
```

The `0.4rem` moved from `margin-top` to `padding-top`: the border, the text and the gap below all
stay where they were, and the painted box simply starts 0.4rem higher — invisible, because its
background is the page's own colour. The same 0.4rem comes off `:first-child`'s `0.2rem`, giving
`-0.2rem`.

At `narrow`, `.aisle-note { display: none }` so the pinned bar is one line at 375px.

`z-index: 1` puts the heading over the rows sliding under it. Nothing else on the page carries a
`z-index`.

## S4 · `.tick`'s columns

```css
grid-template-columns: 1.5rem minmax(0, 1fr) auto minmax(7rem, auto);
/*                     ✓ box   name           amount  badge          */
```

- `minmax(0, 1fr)` on the name, not `1fr`: a bare `1fr` floors at min-content, so one long
  unbreakable word would push the row wider than the page. This is the rule that keeps the body
  from scrolling sideways.
- `auto` on the amount: it takes what it needs and no more, and can shrink when the line is tight.
  It loses the `5.5rem` floor, which was the cause of the ragged name edge.
- `minmax(7rem, auto)` on the badge, reserved on every row so the amounts line up. `7rem` = 112px
  against the widest measured badge, 103.2px, leaving headroom for the real webfont.

At `narrow` the last track becomes `minmax(4.8rem, auto)` — 76.8px against a measured ~68px for
pips plus "smidge".

`align-items: baseline`, `gap`, colour and font are untouched. `.from`'s `padding-left: calc(1.5rem
+ 0.5rem + 0.5rem)` already equals the second track's left edge, so it now aligns under the name
rather than under the amount — which is where it belonged.

## S5 · The badge

```css
.scale-short { display: none }          /* wide: the long word is the visible one */

@media (max-width: 34rem) {
  .scale-word  { … the .visually-hidden treatment … }
  .scale-short { display: inline }
  … S6's rules …
}
```

The narrow rule stops being `display: none` on `.scale-word` and becomes the visually-hidden
treatment (absolute, 1×1, `clip-path: inset(50%)`), so the button's accessible name is the same
string at every width. `.scale-short` is `aria-hidden` in the markup, so the two never double up.

Written out rather than reusing the global `.visually-hidden` class: applying a global class to a
script-made element would work, but the swap is a property change on one element inside one query
and reads better as CSS than as a `classList` branch in the drawing code.

## S6 · The 44px floors

All inside the same `@media (max-width: 34rem)`:

```css
.tick        { min-height: 44px; padding: 0.8rem 0.5rem }
.dial button { min-height: 44px; display: inline-flex; align-items: center; padding: 0 0.9em }
.drop        { min-height: 44px; display: inline-flex; align-items: center }
.small       { min-height: 44px; display: inline-flex; align-items: center }
```

`inline-flex` + `align-items: center` is the shape `site.css` already uses for the same job on
`.site-bar a`, `.back` and `.skip:focus` (`site.css:155-158`, `:227-231`, `:160-165`). Following it
rather than inventing a second idiom.

`.small` is `[data-clear]` and `[data-copy]`, both also `.clay-button`; the kit's button is
`inline-flex` already in some states, so the declaration is written anyway rather than assumed.

Check that follows in Plan: `.dial`'s four buttons at 44px must still fit one row at 375px inside
`.planned li`.

## S7 · Print

```css
@media print { .scale-short { display: none } .scale-word { … visible … } }
```

Paper is wide, but a phone printing to PDF matches the `narrow` query too, and paper has no hover
to recover the meaning from a `title`. The long word is what should land on paper. Two
declarations, in the block that already exists.

## S8 · `drawLine()`

Two changes, both local to `list.astro:872-924`:

```
button.append(box, el('span','name', line.name), el('span','amount', line.text));
…
scaleEl.append(pips, el('span','scale-word', SCALE_WORDS[scale].label),
                     shortWord);            // <span class="scale-short" aria-hidden="true">
```

and, above `drawLine()`, the local short-form map:

```
/* The short form for a 375px badge. SCALE_WORDS lives in shopping.ts, which this ticket may
   not modify; if that file ever opens up, this belongs beside its long forms. */
const SHORT_SCALE: Record<Scale, string> = { pack: 'pack', part: 'part', smidge: 'smidge' };
```

`Scale` is already exported from `shopping.ts`; the import list at `:530-539` gains the type.

Untouched in this function: the `ticked` lookup, `aria-pressed`, the ✓ `box` element and the click
handler that closes over both. The handler is defined after the appends and reads `line.key`,
`button` and `box` — none of which move.

## S9 · `plainText()`

```
out.push(`- ${line.name} — ${line.text}${scale}`);      // was `- ${line.text} ${line.name}${scale}`
```

and the same shape for the pantry line at `:1049`. An em dash, matching the page's own punctuation
elsewhere ("Shopping list — Biryani ×2"). The header line, the aisle grouping, the
already-ticked tally and the two-space `(a pack)` suffix are unchanged.

---

## Interfaces and boundaries

Nothing public changes. The page consumes `shopping.ts` and `plan.ts` exactly as before; the only
new symbol crossing the boundary is the `Scale` **type**, which is already exported.

Two class names are added to the page's private vocabulary — `.scale-short`, and nothing else. No
element is removed, so no selector elsewhere can go stale; `.scale-word` keeps its name and its
job.

## Risk register for Plan to check

| risk | how it shows | checked by |
| --- | --- | --- |
| sticky inert because a grid ancestor survived | heading scrolls away | measure `top` while scrolled |
| `.lines` height changed by the gap→margin swap | page grows or shrinks by ~2px per row | compare page height at 1440px |
| `minmax(0,1fr)` missing → long name overflows | body scrolls sideways | `check-overflow.mjs /list/` |
| badge track too narrow with real webfonts | badge wraps, or amounts go ragged | measure badge `getClientRects().length` |
| four 44px dial buttons no longer fit one row | `.planned li` wraps or scrolls | measure the dial's width at 375px |
| tick state disturbed by the reorder | a tick does not survive reload | click, reload, read `aria-pressed` |
