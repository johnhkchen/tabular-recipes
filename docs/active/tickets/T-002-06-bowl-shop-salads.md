---
id: T-002-06
story: S-002
title: bowl-shop-salads
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-01]
---

## Context

Write the leafy salads. This is the clearest hole in the whole collection: there are **41
dressings** in `recipes/dressings-and-dips/` — vinaigrette, green goddess, caesar, miso ginger,
tahini, goma-dare, ranch, blue cheese, honey mustard, russian — and **ten salads**, of which
nearly all are the deli-case kind sold by the pound: chicken salad, egg salad, tuna salad,
potato salad, macaroni salad, whitefish salad. Four are real composed salads (`fattoush`,
`kachumber`, `som-tum`, `larb-gai`) and they belong to other counters.

Forty-one dressings and almost nothing to put them on.

`docs/gaps/bowl-shop.md` ranks what a bowl-shop board actually prints. T-002-05 has the grain
bowls and T-002-07 has the toppings and roasted vegetables; **stay in the salads**.

## What makes a leafy salad worth a table

The same problem as the bowls, sharper: a salad that is "toss leaves with dressing" has no tree
and should not be written. What earns a table is a salad with real work in it —

- something cooked or roasted that goes in warm,
- something cured, pickled or macerated ahead,
- a component made rather than bought: croutons, candied nuts, crisped chickpeas, a shaved
  vegetable that sits in acid,
- a dressing built in the bowl.

The famous ones are famous for exactly this. A caesar has a dressing you build and croutons you
make. A wedge has bacon and a blue cheese dressing. A chopped salad has six things cut to the
same size and that cutting *is* the recipe.

**Do not rewrite the dressings.** They exist. Name them in `pairs-with:` and let the salad
reference them. Where a salad genuinely builds its dressing in the bowl as part of the method,
that is different and it belongs in the table — a caesar is not a leaf problem.

## Names

A cook looking for these knows them by the board name. `aka:` should carry the generic and the
specific: "house salad," "chopped salad," "kale caesar," "cobb." Someone types what they
remember eating.

## Acceptance Criteria

- At least **10** new `.cook` files, each naming `counters: The Bowl Shop`, each a leafy or
  composed salad.
- Every one has real work in it: at least three operations that are not tossing, and at least
  one made component or cooked element.
- No salad re-teaches a dressing that already exists in `recipes/dressings-and-dips/`. Those
  are named in `pairs-with:` instead, with every slug confirmed to exist.
- Nothing duplicates the ten salads already in `recipes/salads/`. Check with
  `ls recipes/salads/` before writing.
- The dishes at the top of `docs/gaps/bowl-shop.md`'s salad section are written, in that order,
  as far as the count reaches. Anything skipped is named in the work artifact.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs.
- Every timer is named. Every file carries `title`, `category`, `tags`, `servings`, `counters`,
  and `aka`.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
