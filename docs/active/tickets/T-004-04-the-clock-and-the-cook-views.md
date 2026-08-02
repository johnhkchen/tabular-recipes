---
id: T-004-04
story: S-004
title: the-clock-and-the-cook-views
type: task
status: done
priority: high
phase: done
depends_on: [T-004-03]
---

## Context

The timeline and the three views under the table. `src/styles/site.css` ~601
(`/* ---- the three views, and the clock under them ---- */`), plus `Timeline.astro` (776 lines,
the only component with its own `<style>`), `CookModes.astro` (1193 lines) and
`AddToPlan.astro`.

### The timeline is the interesting one

It lays out one grid column per stretch:

```js
const FLOOR_PX = 11;
`minmax(${FLOOR_PX}px, ${Math.max(s.minutes, 0.001).toFixed(3)}fr)`
```

with **no width query anywhere in the file** — only `forced-colors` and `print`.

The floor exists because a stretch of one minute beside a stretch of twelve hours would
otherwise be invisible. It was set for a desktop-width clock. At 375px, a recipe with several
short stretches is at or near the floor for most of them, and the proportions the timeline
exists to show stop being proportions.

There is history here worth reading before touching it: the timeline was **originally
log-scaled and that was wrong** — it drew a 720:1 duration ratio as 3.4:1, which is a lie about
the recipe. It is now linear with a pixel floor, and the floor is the honest compromise. **Do
not reintroduce compression to make it fit.** If a phone cannot show the true proportions of a
particular recipe, the timeline should say something true about that — a different arrangement,
a stacked form, an explicit note — rather than draw a false ratio.

`LABEL_AT = 0.08` decides which stretches get a label. That threshold was also chosen at desktop
width and is worth revisiting narrow: a label that does not fit its stretch is worse than no
label.

### The cook views

`CookModes.astro` has two width queries already (one at `34rem`) and is the prep/cook toggle —
the surface a cook actually uses standing up, with a phone, hands busy. If any surface on this
site deserves to work at 375px it is this one. Check the tap targets especially.

`AddToPlan.astro` has two queries and is small.

## Acceptance Criteria

- The timeline says something true at 375px: either the real proportions render legibly, or the
  arrangement changes to one that can carry them. **No compression, no log scale, no invented
  ratio** — the work artifact states which recipes were tested and what the reader sees.
- The label threshold is checked at narrow widths, and a label never overflows the stretch it
  belongs to.
- Tested against a recipe with an extreme ratio — an 8-hour slow cooker or an 11-hour stock
  beside minutes of hands-on work — named in the work artifact with what it looks like.
- `CookModes.astro` works at 375px: the toggle, the step list, and the checkoff state. Tap
  targets ≥44px, because this is the surface used with wet hands.
- `AddToPlan.astro` works at 375px.
- No horizontal scroll on `<body>` on any recipe page.
- A 1440px window renders exactly as today.
- Uses the breakpoints T-004-01 named; the existing `34rem` query in `CookModes.astro` is
  reconciled with that set rather than left as a second vocabulary.
- `npm run verify` passes.
- Only `src/styles/site.css` (the views section), `src/components/Timeline.astro`,
  `src/components/CookModes.astro` and `src/components/AddToPlan.astro` are modified.
