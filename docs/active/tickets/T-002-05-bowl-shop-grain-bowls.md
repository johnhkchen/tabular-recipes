---
id: T-002-05
story: S-002
title: bowl-shop-grain-bowls
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-01]
---

## Context

Write the grain bowls — the thing the Bowl Shop's board leads with, and the reason the counter
exists. `docs/gaps/bowl-shop.md` ranks them, grounded in the menus of the places that actually
sell these: Goop Kitchen, Sweetgreen, Cava, Dig.

A bowl is a composed dish, which makes it an unusual fit for a merge tree and an interesting
one. The table has room for 5 to 16 ingredient rows and 3 to 6 operations, and a bowl assembled
from six sub-recipes has neither the rows nor the operations to say anything useful — it reads
as "combine everything." **A bowl earns its table by having real cooking in it**: the grain
cooked with something in the water, the protein marinated and seared, the vegetable roasted
until it takes colour, the whole thing dressed and tossed.

So write bowls that cook, not bowls that assemble. Where a component is genuinely its own
recipe that already exists — `coconut-rice`, `lemon-rice`, `mujaddara`, any of the 41 dressings
in `recipes/dressings-and-dips/` — name it in `pairs-with:` and let the bowl reference it
rather than re-teaching it inside your table.

## The shape of the section

Grain bowls, as the menus print them: a base, something roasted, a protein, something pickled
or crunchy, and a dressing. The good ones are named for what makes them themselves — the
teriyaki bowl, the harissa chicken bowl, the crispy rice bowl — not for a list of contents.

**Names are how someone finds this.** A cook who ate one of these at a counter knows it by the
name on the board, so `aka:` matters more here than almost anywhere: "buddha bowl," "grain
bowl," "power bowl," "poke bowl" are all things people type, and the board name is often none
of them.

## What already exists

Read before writing. `recipes/rice-beans-and-grains/` holds 29 files including several bowl
bases. `recipes/dressings-and-dips/` holds 41 — this counter's whole dressing section is
already written and needs shelving, not writing. T-002-06 has the leafy salads and T-002-07 has
the toppings, roasted vegetables and proteins; **stay in the bowls**.

If a bowl you were about to write already exists under another name, record the slug in your
work artifact for T-002-08 and write the next one down the list.

## Acceptance Criteria

- At least **10** new `.cook` files, each naming `counters: The Bowl Shop`, each a composed
  grain or rice bowl.
- Every one has real cooking in it: at least three operations that are not assembly, and a
  table that says something a list of contents would not.
- No bowl re-teaches a component that exists as its own recipe. Those are named in
  `pairs-with:` instead, with every slug confirmed to exist.
- Every file carries `aka` with the names people actually say, including the generic ones they
  would search for.
- The dishes at the top of `docs/gaps/bowl-shop.md`'s grain-bowl section are written, in that
  order, as far as the count reaches. Anything skipped is named in the work artifact.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs.
- Every timer is named. Every file carries `title`, `category`, `tags`, `servings`, `counters`.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
