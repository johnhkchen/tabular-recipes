---
id: S-004
title: the-site-on-a-phone
type: story
status: open
priority: high
---

## Why

The site is built for a desktop and has never been told otherwise. Counted honestly, the whole
codebase contains **two width-based media queries** — both `max-width: 34rem`, both in
`list.astro` and `CookModes.astro`. Everything else that greps as `@media` is `print`,
`prefers-reduced-motion`, or `forced-colors`.

Nothing at all for width in: `Base.astro`, `index.astro`, `[slug].astro`,
`menu/[counter].astro`, `RecipeTable.astro`, `404.astro`. That is the shell, the front door, the
recipe page, every menu, and the table itself.

The viewport meta tag is present and correct (`Base.astro:28`), so this is not a missing-tag
bug. The layout simply assumes a wide window.

### The table is the problem, and it is not a small one

```css
.recipe-table { min-width: 30rem }     /* 480px */
.cell--op     { min-width: 4.75rem }   /* 76px per operation column */
.cell--ingredient .qty { min-width: 4.4rem }
```

A 375px phone — an iPhone SE or a 12 mini — hits 105px of sideways scroll before a single word
is drawn. And that is the floor, not the typical case:

| Columns | Recipes | Minimum width | Scroll at 375px |
| --- | --- | --- | --- |
| 3 | 7 | ~21rem | fits |
| 4 | 155 | ~25rem | fits |
| **5** | **294** | ~30rem | ~105px |
| **6** | **179** | ~35rem | ~185px |
| **7** | **23** | ~39.5rem | ~257px |

**496 of 658 recipes — 75% — are five columns or wider.** The one thing this site exists to
show is the thing that does not fit on the device most people will open it on.

## The decision this story is built on

**Keep the table.** Do not reflow it into stacked cards, an accordion, or a step list at narrow
widths. The table *is* the product — a merge tree drawn sideways, where the shape carries
information that a list cannot. A mobile layout that dissolves it has not made the site
responsive; it has removed the site and left a recipe app.

So the work is to make a wide table **honest and navigable on a narrow screen**, not to hide
that it is wide:

- the ingredient column stays put while the operations scroll, so a cook never loses which row
  they are reading;
- the scroll announces itself rather than being discovered by accident;
- cell padding and type tighten at narrow widths so there is less to scroll through.

Tightening metrics buys perhaps a fifth of the width back. That is worth having and it is not a
solution on its own — which is why the sticky column and the affordance carry the ticket, and
the metrics only help.

## What else is wrong, in rough order

- **The shell.** `Base.astro` and the page furniture have no narrow-width behaviour at all: the
  container is `max-width: 54rem` with padding tuned for a wide window, and the nav bar was
  drawn for one.
- **The front door at 21 counters.** The card grids do respond — `repeat(auto-fill,
  minmax(16.5rem, 1fr))` collapses to one column correctly — but nothing else on the page does,
  including the finder and the shelf labels.
- **The timeline.** `Timeline.astro` lays out `minmax(11px, <n>fr)` per stretch with no width
  query anywhere. A recipe with several short stretches is already at the 11px floor on a
  desktop; on a phone the whole clock compresses into a bar with nothing readable in it.
- **The cook views and the shopping list** are the best-covered surfaces — three width queries
  between them — and still need a pass.

## Shape of the work

Six tickets. Five of them touch `src/styles/site.css`, which holds the layout for every surface
except the timeline, so **they chain rather than run in parallel** — concurrent edits to one
stylesheet is exactly the collision this board avoids elsewhere. The list is the one page with
its own file, so it runs alongside.

- **T-004-01** sets the breakpoints and fixes the shell. Everything depends on it.
- **T-004-02** the table. The signature ticket.
- **T-004-03** the front door and the menus.
- **T-004-04** the timeline and the cook views.
- **T-004-05** the shopping list, in parallel from T-004-01.
- **T-004-06** reads the whole site at three widths and verifies.

## Conventions

- **One breakpoint set, written down once.** `34rem` is the only width query in the codebase
  today; T-004-01 decides whether that stays the single breakpoint or gains a second, names
  them, and every later ticket uses those names rather than inventing a number.
- **Test at 375px, 390px and 768px.** The first is the narrowest phone still in real use, the
  second the common modern one, the third a tablet in portrait.
- **No horizontal scroll on `<body>`, anywhere, at any width.** A surface that must scroll
  sideways does it inside its own container — the table already has `.table-scroll` for exactly
  this, and it is the pattern to follow.
- **Tap targets at least 44px.** The table cells are tap-to-cross-off and the shelf labels are
  buttons; both are currently sized for a mouse.
- **Nothing regresses on a desktop.** These are additive narrow-width rules. A 1440px window
  renders exactly as it does today, and T-004-06 proves it.

## Done when

- Every page renders at 375px with no horizontal scroll on the body.
- A 7-column recipe is readable and navigable on a phone, with the ingredient column in view
  throughout.
- The timeline says something true at 375px rather than collapsing to a stripe.
- `npm run verify` passes, and the desktop rendering is unchanged.
