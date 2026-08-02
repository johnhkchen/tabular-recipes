---
id: T-004-01
story: S-004
title: breakpoints-and-shell
type: task
status: open
priority: critical
phase: ready
depends_on: []
---

## Context

Decide the breakpoints and make the shell work at them. Five tickets are waiting, and they all
need to be writing the same numbers.

### 1. Name the breakpoints

`34rem` is the only width query in the codebase — twice, in `list.astro:399` and
`CookModes.astro:951`. Everything else that greps as `@media` is `print`,
`prefers-reduced-motion` or `forced-colors`.

Decide whether one breakpoint is enough or a second is needed, name them, and write them down
where the other tickets will find them — a comment block at the top of `src/styles/site.css` is
enough; this does not need a build step or custom properties unless the design finds a reason.
Two constraints on the choice:

- **The two existing queries must keep working**, or be updated in the same pass. Do not leave a
  third number in the codebase that means almost the same as `34rem`.
- **The table's real thresholds are known** and are the strongest argument for wherever the
  numbers land: a 5-column recipe needs ~30rem, a 6-column ~35rem, a 7-column ~39.5rem. If a
  breakpoint can be placed so that the common cases change behaviour at the width where they
  actually stop fitting, place it there.

### 2. Fix the shell

`src/layouts/Base.astro` and the page-furniture section of `site.css` (~line 84) have no
narrow-width behaviour. Specifically:

- The container is `max-width: 54rem` with padding tuned for a wide window. At 375px the padding
  is eating scarce width.
- The nav bar (`.site-bar`, the "Your list" affordance) was drawn for a desktop.
- The finder section (~line 128) — the search box and its `max-width: 34rem` — needs checking at
  narrow widths.
- Base type scale and heading sizes: nothing steps down.

### 3. Prove the invariant that the rest of the story leans on

**No horizontal scroll on `<body>` at any width.** Add whatever check makes this testable —
the simplest honest version is a test that builds a page and asserts no element exceeds the
viewport at 375px, but if that is disproportionate, a documented manual procedure in the work
artifact is acceptable. Say which you chose and why.

This matters more than it sounds: body-level horizontal scroll is the failure that makes a page
feel broken rather than merely cramped, and it is usually one element that nobody notices.

## Acceptance Criteria

- The breakpoint set is decided, named, and documented at the top of `src/styles/site.css`, with
  a sentence on why those numbers. Every later ticket in S-004 can read it and comply.
- The two existing `34rem` queries either use the named set or are updated to; no third
  near-duplicate number is left in the codebase.
- `Base.astro` and the shell render at 375px with no horizontal scroll on the body: container
  padding, nav bar, skip link, and the finder.
- Headings and body type are readable at 375px without the display font overflowing its line.
- Tap targets in the shell and the finder are at least 44px.
- A desktop window (1440px) renders exactly as it does today. State in the work artifact how
  this was confirmed.
- `npm run verify` passes.
- Only `src/layouts/Base.astro`, `src/styles/site.css`, and the two files holding the existing
  `34rem` queries are modified — and in those two, only the query values.
