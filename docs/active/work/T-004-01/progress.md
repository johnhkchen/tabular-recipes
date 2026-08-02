# T-004-01 — Progress

Five steps planned, five done. Three commits. Two deviations, both recorded below.

---

## Step 1 — Name the breakpoints — **done**

The block is at `src/styles/site.css:19–48`, immediately after the file's opening comment and
before `* { box-sizing: border-box; }`.

It declares `snug` (44rem) and `narrow` (34rem), shows the arithmetic that produces them, and
carries the four rules for later tickets: use one of these two literals; put the query beside the
rules it changes rather than in one shared block at the bottom; a `max-width` property is a measure,
not a breakpoint; delete `snug` if nothing ever uses it.

### Deviation 1 — `[in use]` / `[reserved]` tags

`design.md` said the test would assert *both* named values appear at least once, so a dead name
fails the build. That is unimplementable as written: `snug` is declared for T-004-02 and T-004-04
and has no user on the day it is declared, so the assertion would fail on arrival.

Resolved by tagging each name in the block — `[in use]` or `[reserved]` — and asserting only that
every `[in use]` name is genuinely written somewhere. The block tells the next ticket to flip the
tag when it writes the first `snug` query. The intent survives (a name whose last user disappears
fails the build) and the honest starting state is representable.

## Step 2 — Enforce the vocabulary — **done**

`src/styles/breakpoints.test.ts`, 5 tests, no dependencies. It reads the allowed set out of the
comment block rather than repeating it, scans `src/**/*.css` and the `<style>` blocks of
`src/**/*.astro`, and fails on any `(min-width:)` / `(max-width:)` media feature outside the set.

**It passed on the untouched codebase**, which is the evidence for "the two existing `34rem`
queries either use the named set or are updated to" — they already did, so neither file was edited.

Proved red as well as green: changing `CookModes.astro:951` to `35rem` produced

```
AssertionError: …/CookModes.astro writes (max-width: 35rem). The set is 44rem and 34rem,
declared at the top of src/styles/site.css.
```

and the file was reverted with `git checkout` immediately after.

### One bug the test found in itself

First run failed on `site.css` reporting a breakpoint of `var(--x`. The scan was reading the
comment block's own worked example — `@media (max-width: var(--x))`, written there to explain why
custom properties do not work in media queries. Stripping CSS comments before scanning fixed it,
and is correct regardless: a commented-out query is not a query. The test caught a real
false-positive class in its own first draft.

**Commit `b72822a`** — `src/styles/site.css`, `src/styles/breakpoints.test.ts`.

## Step 3 — The overflow check — **done**

`scripts/check-overflow.mjs`, ~290 lines, no dependencies. Serves `dist/`, drives the installed
Chrome over the DevTools protocol using node's built-in `WebSocket`, and reports every page whose
document scrolls sideways or has an element past the right edge with no scrolling ancestor.

All three exit paths exercised:

| path | how | result |
| --- | --- | --- |
| 0 | full sweep of the built site | `682 page views at 375px — nothing scrolls sideways.` |
| 1 | injected `<div style="width:200vw">` into one page in `dist/` | `SCROLLS 375px /aioli/ (766px of content in a 375px window)` naming the `<div>`; `dist/` restored |
| 2 | `CHROME_BIN=/nonexistent` | prints the by-hand procedure, exits 2 |

The full sweep takes 1m46s.

**Commit `acb21f1`** — `scripts/check-overflow.mjs`.

## Step 4 — The shell — **done**

`src/styles/site.css` only. **`src/layouts/Base.astro` was read and needed no change** — the
expected outcome from `structure.md`. Its viewport meta is correct, its markup already carries the
right elements and ARIA, and every defect was a CSS property on an element that already exists.

Three changes:

1. **`.skip`** moved from `left: -9999px` to the clip technique already used by `.visually-hidden`
   two rules below it, and `.skip:focus` gained `max-width: calc(100% - 2rem)` — unconditional,
   because a label too long for the window overflows at every width or none.
2. **Shell narrow block** before the page-furniture banner: body padding to `1rem 0.75rem 4rem`;
   `.site-bar a` and `.skip:focus` to a 44px minimum via inline-flex.
3. **Page-furniture narrow block** before the finder banner: `.masthead h1` to
   `clamp(1.6rem, 7vw, 1.9rem)` with `overflow-wrap: break-word`; `.back` to a 44px minimum.

The finder got no rules — measured correct at 375px before the change (50.5px tall, 16.32px font)
and unchanged after. `.filter` got no rules — no markup emits it.

### Deviation 2 — a step in the body padding at the breakpoint

Reducing the side padding to a flat `0.75rem` in the narrow band introduces a discontinuity that
did not exist before: measured, padding is 12px at 544px and 21.8px at 545px, so the content shifts
about 10px per side for anyone dragging a window across the breakpoint. Previously the padding was
continuous, because `clamp(1rem, 4vw, 2.5rem)` tracks `4vw` from 400px up.

Kept deliberately. Removing the step means a slope fitted between the two endpoints —
`clamp(0.75rem, 5.77vw - 0.6rem, 1.36rem)` — two derived constants in a stylesheet that four more
tickets have to read past, to smooth a transition that only appears when resizing a desktop window
and never on a device. The 8px it returns at 375px is real; the jump costs nothing to anyone
holding a phone. Recorded in `review.md` as a known limitation rather than smoothed over.

## Step 5 — Measurement — **done**

All figures in `review.md`. Headlines:

- **682 pages at 375px — nothing scrolls sideways**, after the change as before it.
- **80 page views across ten widths** (320 → 1440, including 543/544/545 either side of the
  breakpoint) — nothing scrolls sideways.
- **Tap targets** at 375px and 390px: `.site-bar a` 24px → **44px**, `.skip:focus` 43px → **44px**,
  `.back` 24px → **44px**, `.search input` **50px** unchanged. All revert to their previous sizes at
  545px.
- **Headings** fit their line on every page tested at every width, including the longest title in
  the collection.
- **Desktop unchanged, proved by pixel identity**: ten pages rendered full-page at 1440px and 768px
  before and after, by the same script against two builds — **all 20 SHA-256 hashes identical**.
- `npm run verify`: **9 test files, 831 tests, all passing**; 682 pages built.

**Commit `c45a4d9`** — `src/styles/site.css`.

---

## Files, final

| file | state |
| --- | --- |
| `src/styles/site.css` | modified — breakpoint block, `.skip`, two narrow blocks |
| `src/styles/breakpoints.test.ts` | created |
| `scripts/check-overflow.mjs` | created |
| `src/layouts/Base.astro` | read, unmodified |
| `src/pages/list.astro` | unmodified — its `34rem` query already is the named breakpoint |
| `src/components/CookModes.astro` | unmodified — same |

No ticket-owned file is left staged, modified or untracked.
