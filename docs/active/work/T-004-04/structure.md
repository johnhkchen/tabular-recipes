# T-004-04 — Structure

The shape of the change, file by file. Three files modified, none created, none deleted.

| file | what changes | roughly |
| --- | --- | --- |
| `src/components/Timeline.astro` | one constant + one derived field; one wrapper element in the axis markup; the `.stretch` rule and six `@container` rules | +30 lines |
| `src/components/CookModes.astro` | four `min-height` declarations inside the `34rem` query it already has | +14 lines |
| `src/components/AddToPlan.astro` | one `@media (max-width: 34rem)` block, two controls | +18 lines |
| `src/styles/site.css` | **nothing** — its views section holds one rule and none of it is width-dependent | 0 |

No file is created. `src/styles/breakpoints.test.ts` is not touched and does not need to be: the
only `@media` width literal this ticket writes is `34rem`, which is already `[in use]`.

---

## 1. `src/components/Timeline.astro`

### 1a. Frontmatter — the fit table, beside the threshold it now works with

Next to `LABEL_AT`, add the measured table and one helper. It reads a label's length and answers
with the width its column must beat.

```ts
const LABEL_AT = 0.08;

/*
 * How wide a label has to be given, indexed by how many characters it has. Measured, in Karla
 * at 0.68rem, over every one of the 93 duration strings formatDuration() can produce here,
 * plus the stretch's own 0.1rem of side padding. Lengths group cleanly because the vocabulary
 * is tiny — "8 hr", "38 min", "21 days", "13 hr 50 min" — and each entry is the widest label
 * of that length, so the rule errs towards holding a label back rather than stacking it.
 */
const LABEL_FITS_AT = [23, 23, 23, 23, 23, 33, 39, 39, 55, 55, 55, 61, 65];
const fitsAt = (text: string) => LABEL_FITS_AT[Math.min(text.length, LABEL_FITS_AT.length - 1)];
```

`axis` gains one field:

```ts
const axis = stretches.map((stretch) => ({
  ...stretch,
  labelled: stretch.minutes / span >= LABEL_AT,
  fitsAt: fitsAt(stretch.text),
}));
```

Nothing else in the frontmatter moves. `FLOOR_PX`, `columns`, `span`, `rows`, `note` are
untouched.

### 1b. Markup — the label becomes a child of the stretch

A container query styles the *descendants* of a container, so the text needs an element of its
own. Today:

```astro
<span class="stretch" style={`grid-column: ${i + 1}`} title={stretch.text}>
  {stretch.labelled ? stretch.text : ''}
</span>
```

Becomes:

```astro
<span class="stretch" style={`grid-column: ${i + 1}`} title={stretch.text}>
  {stretch.labelled && <span class="stretch-label" data-fits={stretch.fitsAt}>{stretch.text}</span>}
</span>
```

Unchanged: the `title` stays on `.stretch` (it is the whole column's tooltip, and it is the one
place the duration survives when the label is held back — on a pointer, at least; on a phone the
row's own `.dur` is the answer, as it always was). `aria-hidden="true"` stays on `.axis`, so none
of this reaches assistive technology, which reads the rows.

Class name: `.stretch-label`, not `.label` — `.label` already means the operation's name in a row,
and its rules would otherwise land on the axis too.

### 1c. Styles — one container, six rules

`.stretch` gains two declarations and loses the lower half of a clamp:

```css
  .stretch {
    …unchanged…
    font-size: 0.68rem;          /* was clamp(0.6rem, 2.4vw, 0.68rem) */
    /* Each stretch measures its own column, so the rules below can ask if the label fits it. */
    container-type: inline-size;
  }
```

Then, immediately after it, the fit rules with the comment that explains why they are not
breakpoints:

```css
  /*
   * A label shows only when the column it belongs to can hold it on one line.
   *
   * These are not breakpoints and they are not in the block at the top of site.css: the number
   * is the width of a COLUMN, not of a window, and the browser measures the column for us. A
   * stretch's width depends on the recipe, not on the device — the same phone draws one
   * stretch at 278px and the next at 11px — so no viewport query could answer this.
   *
   * data-fits carries the width this label needs, measured; see LABEL_FITS_AT above. A browser
   * without container queries fires none of these, every label renders, and a long one wraps
   * inside its own column exactly as it does today. That is the old behaviour, not a broken one.
   */
  @container (max-width: 23px) { .stretch-label[data-fits='23'] { display: none } }
  @container (max-width: 33px) { .stretch-label[data-fits='33'] { display: none } }
  @container (max-width: 39px) { .stretch-label[data-fits='39'] { display: none } }
  @container (max-width: 55px) { .stretch-label[data-fits='55'] { display: none } }
  @container (max-width: 61px) { .stretch-label[data-fits='61'] { display: none } }
  @container (max-width: 65px) { .stretch-label[data-fits='65'] { display: none } }
```

`overflow-wrap: break-word` and `min-width: 0` stay on `.stretch`: they are the safety net for the
no-container-query case and for a font whose metrics differ from the measurement.

The `@media print` and `@media (forced-colors: active)` blocks at the end are untouched. Print
draws at the paper's width, where columns are wide; forced-colors changes fills, not geometry.

### What must not change

`FLOOR_PX` stays 11. `LABEL_AT` stays 0.08. The grid template, the bars, the marks, the legend,
the headline, the notes and the slack panel are not touched. The axis geometry is byte-identical;
only which labels are painted changes, and only where a column cannot hold one.

---

## 2. `src/components/CookModes.astro`

One block changes: the `@media (max-width: 34rem)` that already exists at line 951. It keeps what
it has (`.modebar` full width, `.mode` flex, `.hit` and `.num` tightened) and gains four minimums.

```css
  @media (max-width: 34rem) {
    .modebar { … }
    .mode {
      flex: 1;
      padding: 0.5rem 0.5rem;
      min-height: 2.75rem;        /* new */
    }
    …
    /* Wet hands, standing up: nothing you have to hit is under 44px here. */
    .tick { min-height: 2.75rem; }
    .pane-foot .clay-button { min-height: 2.75rem; }
  }
```

- `.mode` — 40px → 44px. `.mode` is already `flex: 1` here, so the width is the third of the bar
  it already was.
- `.tick` — 42.8px → 44px for the one-line rows; the rows that already carry a note or an
  "also in step 2" line are taller than the minimum and do not move. It stays
  `align-items: baseline`: on a three-line row a centred checkbox floats away from the line it
  belongs to.
- `.pane-foot .clay-button` — 33.7px → 44px, covering both `[data-prep-reset]` ("Untick
  everything") and `[data-cook-reset]` ("Start over"), which are the only two buttons in that
  footer. Both are Astro-scoped selectors on elements this component owns.

`.hit` is already 212.9px tall at 375px and is not touched. The checkbox stays 18.4px; the label
around it is the target.

Nothing outside that one query changes, so every width above 544px — 545, 768, 1440 — renders
from exactly the same declarations as today.

---

## 3. `src/components/AddToPlan.astro`

Gains its first width query, placed with the other `@media` blocks at the end of the component's
style, before `prefers-reduced-motion` (which must stay last of the two motion/print pair only in
the sense that its rules override transforms; ordering between these three is not significant, so
the new block goes first, in width-then-preference-then-print order).

```css
  /*
   * On a phone this is one of two things you press on a recipe page, so both reach 44px. The
   * link needs a box before a minimum means anything to it.
   */
  @media (max-width: 34rem) {
    .toggle {
      min-height: 2.75rem;
    }
    .to-list {
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
    }
  }
```

- `.toggle` — 34.7px → 44px.
- `.to-list` — 21.1px → 44px. `display: inline-flex` is what makes `min-height` apply at all; the
  underline on hover and the focus ring are unaffected.

`.add-to-plan` is already `flex-wrap: wrap` with a `0.35rem 1rem` gap, so a taller pair still sits
on one line at 375px (158.5 + 73.8 + 16 = 248px in a 345px main).

---

## 4. Ordering

The three files are independent — no rule in one depends on a rule in another — but the commits
go in the order the evidence is gathered:

1. **Timeline** first, because it is the only one whose change can move the desktop rendering, and
   the before/after hash comparison has to run against a build where nothing else has changed.
2. **CookModes** second.
3. **AddToPlan** third.

Each is one `lisa commit-ticket` with exact `--include` paths.

## 5. Interfaces and boundaries

Nothing crosses a module boundary. `Timeline.astro` gains a private constant and a private helper;
neither is exported and nothing imports the component's internals. No props change, so
`src/pages/[slug].astro` — which passes `recipe`, `tree`, `schedule` — is untouched and cannot
break. `src/lib/*` is untouched, so all 831 existing tests exercise exactly what they did before.

The only new contract is between the frontmatter and the stylesheet, inside one component: the
values in `LABEL_FITS_AT` must match the six `@container` thresholds. They sit 500 lines apart,
which is the one thing in this change that could rot. It is guarded three ways: the constant's
comment names the rules, the rules' comment names the constant, and a mismatch fails visibly (a
label with no matching rule simply never hides, i.e. today's behaviour).
