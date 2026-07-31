---
id: T-003-01
story: S-003
title: open-the-home-shelves
type: task
status: open
priority: critical
phase: ready
depends_on: [T-002-01]
---

## Context

Open the three counters and write their work lists, so three writers can start.

**This ticket depends on T-002-01 for a file-ownership reason, not a logical one.** That ticket
holds `src/data/counters.json` while it adds the S-002 counters, and two tickets must not hold
it at once. Read what it did before adding to it: it will have set the house style for a
counter that is not a shop.

### 1. Open the counters

Add three entries to `src/data/counters.json` in the existing shape (`name`, `slug`, `blurb`,
`categories`, `sections`), with section titles in menu order and **empty item lists**. T-003-06
fills the items.

| Name | Slug |
| --- | --- |
| The Soup Pot | `soup-pot` |
| Japanese Home Cooking | `japanese-home` |
| The Slow Cooker | `slow-cooker` |

The blurbs on the original fifteen are an instruction to a visitor standing in front of a
counter — "Take a tray and tongs, fill it, pay at the register." These three are not shops, so
the instruction is about the bargain rather than the queue: what you put in, and what you get
back for it. Keep the register out of it.

Section titles, as intent — improve the wording if the real thing says it better:

- **The Soup Pot** — Old-fire soups (老火湯) · Quick daily soups (滾湯) · What each thing is for ·
  Congee and rice soups · Also here
- **Japanese Home Cooking** — The soup and the rice · Simmered things (煮物) · Grilled and pan-fried
  mains · Small sides (小鉢) · Made ahead (作り置き) · Rice bowls and one-plate suppers · Also here
- **The Slow Cooker** — Braises, left alone all day · Beans and pulses · Stocks · Whole birds
  and big cuts · Also here

### 2. Write the three work lists

Write `docs/gaps/soup-pot.md`, `docs/gaps/japanese-home.md` and `docs/gaps/slow-cooker.md` in
the shape of the ones already in that folder. Read two or three first.

Each needs what is already here (by slug, grouped by section), what is missing (ranked, most
conspicuous absence first, named the way the tradition names it), and what a single table
cannot hold.

Three things this ticket must get right, because the writers inherit them:

**The Soup Pot's ranked list has to carry the logic, not just the names.** These soups are
organised around what each ingredient is *for* — what it is understood to do in the body, why
this dried thing goes with that meat, why the pot is not stirred. A list of soup names without
that is a list of ingredients in hot water and the shelf will read as nothing. Research it
properly: 老火湯 as a category, the standard pairings, the seasonal logic. Write the list so a
writer can produce a recipe that explains itself.

**Japanese Home Cooking is not the Ramen Shop.** The site already holds `karaage`, `gyoza`,
`okonomiyaki`, `chawanmushi`, `dashi`, `miso-soup`, `japanese-beef-curry`, `teriyaki-sauce` and
four ramens. Most of those are restaurant food; a few (`dashi`, `miso-soup`) are the foundation
of the home shelf and need shelving rather than rewriting. Say which is which, by slug. Then
rank what is missing: the 一汁三菜 canon, the 作り置き things made on Sunday, the one-plate
suppers.

**The Slow Cooker's list is drawn from what exists**, like the Instant Pot's — the braises,
beans and stocks already on the shelf, ranked by how much the machine actually helps. Note
where it helps *less* than the pressure cooker and where it helps more; a cook choosing between
them is the point. Cross-check against `docs/gaps/instant-pot.md`, which T-002-01 wrote.

## Acceptance Criteria

- `src/data/counters.json` holds three more counters than T-002-01 left it with, each with
  `name`, `slug`, `blurb` and ordered `sections` with empty item lists, and the file parses.
- `node scripts/check-recipes.mjs` reports ok for the whole collection, unchanged.
- A `.cook` file naming `counters: The Soup Pot`, `Japanese Home Cooking` or `The Slow Cooker`
  passes its check. Demonstrate it in the work artifact with a throwaway file; do not commit it.
- `docs/gaps/soup-pot.md`, `docs/gaps/japanese-home.md` and `docs/gaps/slow-cooker.md` exist,
  each with a what-is-already-here section listing real slugs, a ranked missing list, and a
  what-a-table-cannot-hold section.
- The Soup Pot list explains the logic of the genre, not just dish names, with sources.
- The Japanese list separates what exists into "shelve this" and "this is restaurant food,
  leave it", by slug.
- The Slow Cooker list names at least 20 candidate dishes that already exist as plain recipes,
  each with its slug, and says for each whether the machine helps more or less than pressure.
- Only `src/data/counters.json` and `docs/gaps/**` are modified.
