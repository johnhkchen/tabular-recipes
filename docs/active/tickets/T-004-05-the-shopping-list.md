---
id: T-004-05
story: S-004
title: the-shopping-list
type: task
status: done
priority: high
phase: done
depends_on: [T-004-01]
---

## Context

`src/pages/list.astro` — 1082 lines, and the best-covered surface on the site with **three**
width queries, one of them at `34rem` (~399). It is also the only page that owns its own layout
rather than borrowing `site.css`, which is why this ticket runs in parallel with the chain
instead of queueing behind it.

**This is the one page whose whole purpose is a phone.** It is a shopping list: it is read
standing in an aisle, one-handed, with a trolley. Every other surface merely ought to work
narrow. This one is used narrow or it is not used.

So the bar is higher than "does not break". Read the page at 375px and ask whether it is
actually usable while shopping:

- **Aisle groups** run in shop-walk order (produce → butcher → fishmonger → cheese → dairy →
  bakery → baking → dry goods → tins → spices → oils → world → freezer → drinks). A shopper
  works down one group at a time. Do the headings survive scrolling — can you tell which aisle
  you are in halfway down a long one?
- **The pack pips** — the pack / part-of-a-pack / smidge badge — are the at-a-glance signal the
  feature was built for. At 375px, are they still at-a-glance, or do they wrap?
- **Tick-off targets.** `TICK_KEY` state at `list.astro:567`. These are tapped with a thumb
  while holding something else. 44px is a floor here, not a target.
- **The "as it's sold" name** is deliberately the front of each line, ahead of the quantity.
  That ordering must survive whatever narrow layout you choose — it is the whole point of the
  component.

## Acceptance Criteria

- The list renders at 375px with no horizontal scroll on the body.
- A long list — build a plan spanning at least six aisles — is navigable: the work artifact says
  how a shopper knows which aisle they are in while scrolled into a long group.
- Pack pips remain readable and do not wrap or truncate at 375px.
- Tick-off targets are at least 44px, and ticking works with the state at `list.astro:567`
  intact.
- The as-it's-sold name still leads each line at every width.
- The three existing width queries are reconciled with the breakpoints T-004-01 named — no
  second vocabulary left in the file.
- A 1440px window renders exactly as today.
- `npm run verify` passes.
- Only `src/pages/list.astro` is modified.
