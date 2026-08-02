---
id: S-001
title: fill-the-menus
type: story
status: open
priority: high
---

## Why

Fifteen counters were derived from real menus, and all 249 recipes were shelved at them. Read
each counter's page as a menu and the same shape appears every time: **the collection is
components and dessert.** The rub is written and the meat is not. The paste is written and the
curry is not. The dough and the sauce are written and the pizza is not. Six pasta sauces and no
pasta; twelve dressings and no salad.

Two counters say it outright. **Panadería holds nine recipes and not one of them is its own** —
every item is borrowed from the Bakery or the Taquería, so its page has no menu. **Phở & Bánh Mì
holds four**, on the counter this project's own worked example is drawn from: someone who ate a
"#1 combo bánh mì" and wants the pâté in it.

`docs/gaps/` already holds the work list. One page per counter, written after the whole
collection was read as a set of menus: what landed there grouped into the sections its menu
actually prints, what a place like that obviously sells and we do not have, which sub-recipes
those dishes wait on, and which of its items a single table genuinely cannot hold. The dishes are
ranked, most conspicuous absence first, and named the way a menu names them.

This story works down those lists until every counter reads as a menu somebody could order from.

## Shape of the work

One ticket per counter, plus three that own the shared parts.

- **T-001-01** writes the components more than one counter is waiting on, so two tickets do not
  write the same recipe under two names. Everything else depends on it.
- **T-001-02 … T-001-16** are the fifteen counters, running in parallel. Each writes only `.cook`
  files, into whichever `recipes/<category>/` folder the dish belongs in. Distinct new files in a
  shared folder do not collide; **no counter ticket may touch a file another ticket owns.**
- **T-001-17** shelves everything: the menu sections in `src/data/counters.json` and any new
  ingredient that falls through `src/data/aisles.json`. It owns those two files alone, which is
  why no counter ticket may edit them.
- **T-001-18** reads the whole collection afterwards for the things no single counter ticket can
  see, and runs the full verification.

## Conventions every ticket follows

`README.md` is the authoring contract and it is accurate. The parts that fail a build if broken:

- One table per recipe, a merge tree, edges written as `@&(~1)thing{}`. Exactly one unreferenced
  ending. No splits. Prep steps at the top only.
- 5 to 16 ingredient rows, 3 to 6 operations. Rows are cheap; operations add columns and columns
  break a phone.
- Required metadata: `title`, `category`, `tags`, `servings`. Then `counters:` (a list — a recipe
  can sit at several), `aka:` (what people call it when they order it, including without
  diacritics, because a searcher types `pate` and `do chua` on a plain keyboard), and
  `pairs-with:` (slugs, verified to exist, made mutual at build time).
- **Name every timer.** `~rise{90%min}`, `~chill{4%hr}`, `~marinate{8%hr}`. The name is what
  separates time a cook spends from time they merely wait out, and it drives the clock under the
  table. An unnamed timer is guessed at from the operation label.

Check any file with `node scripts/check-recipes.mjs --labels <paths>`. It writes nothing, so any
number of tickets can run it at once. It validates counter names against `counters.json` too.

## Two hazards worth naming

**A dish that belongs to several counters is one recipe, not several.** Char siu is the Dim Sum
Counter's roast meat, the Takeout Counter's roast pork and *xá xíu* on a bánh mì — one file with
three names in `counters:`. Before writing anything, check whether it already exists:
`ls recipes/*/<slug>.cook`. Where two tickets could both claim a dish, the one whose menu leads
with it writes it and the other adds its counter name to the existing file — which is an edit to
a file the first ticket owns, so it waits for T-001-18 instead.

Fourteen dishes are on two or three ranked lists at once. Under fifteen tickets running in
parallel, "check whether it exists first" races, so they are assigned here. **The named ticket
writes it; the others do not**, and add their counter to the finished file through T-001-18.

| Dish | Written by | Also wanted by |
| --- | --- | --- |
| potato salad, coleslaw, egg cream | Deli | Meat and Three, Smokehouse, Diner |
| collard greens, banana pudding, peach cobbler, fried chicken | Meat and Three | Smokehouse |
| sweet tea, barbecue slaw | Smokehouse | Meat and Three |
| meatloaf | Diner | Meat and Three |
| egg custard tart | Dim Sum Counter | Bakery |
| manakish, baklava | Shawarma Counter | Bakery |
| cannoli, chicken wings | Pizzeria | Bakery, Thai Kitchen |

Cornbread is the case to learn from: both Meat and Three and the Smokehouse list it as missing and
**both are wrong** — skillet and hot-water cornbread were written weeks ago. Neither ticket writes
it; T-001-17 shelves it on both boards.

Six counters separately observe that no noodle dish exists anywhere on the site, and they are not
asking for the same one. Ramen Shop writes ramen noodles, Takeout Counter lo mein, Thai Kitchen
pad thai, Phở & Bánh Mì bún. The same goes for the rolls: chả giò and gỏi cuốn are the Vietnamese
counter's, the egg roll is the Takeout Counter's, and Thai fresh and fried spring rolls are the
Thai Kitchen's. Write the specific dish under its own name, never a generic one.

**The gap docs are a few weeks stale in places.** A pastry shell, two pickles, cornbread, char siu
and a pâté have been written since they were compiled, and several are still listed as missing.
Read the folder before trusting the list.

## Done when

- Every counter's page reads as a menu: its signature items are present, and no section a real
  board prints is empty on the page while the ranked list still names something for it.
- `npm run verify` passes: every recipe draws a table, every counter name resolves, every pairing
  points at something real, and the tests are green.
- `docs/gaps/` is updated to say what is still missing, so the next pass starts where this one
  stopped rather than re-deriving it.
