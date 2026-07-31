---
id: T-002-07
story: S-002
title: bowl-shop-toppings
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-01]
---

## Context

Write the two sections that make the other two work: **What goes on top** and **Roasted
vegetables**. On a real bowl-shop board these are the columns you choose from — the proteins,
the roasted things, the crunch — and without them the Bowl Shop is a menu of finished dishes
with nothing to build from.

`docs/gaps/bowl-shop.md` ranks them. T-002-05 has the grain bowls and T-002-06 has the leafy
salads; **stay in the components**.

## What goes on top

The proteins a bowl counter actually sells, cooked the way a counter cooks them: marinated and
grilled, blackened, braised and shredded, crisped in a pan, roasted whole and pulled. Also the
non-meat ones that carry the same weight — crisped chickpeas, seared halloumi, marinated tofu,
a jammy egg.

These are small recipes and that is correct. A marinated grilled chicken thigh is five
ingredients and four operations and it is genuinely useful, because it is the thing a cook
actually needs to be told: the marinade ratio, how long, how hot, how to know.

**Check what exists first.** The collection has a lot of cooked protein already — `char-siu`,
`chashu`, `larb-gai`, `ajitama`, `paneer`, `carnitas`, `tinga-de-pollo` — and several of them
belong on this shelf by shelving rather than writing. Record those slugs for T-002-08.

## Roasted vegetables

The section that is nearly empty. `recipes/vegetables-and-sides/` holds candied yams, creamed
corn, green beans, mashed potatoes, stewed squash, cornbread dressing — a Southern side board,
not a bowl shop's roasting tray. Sheet-pan roasted vegetables with real technique — the heat,
the fat, the crowding, what colour to take it to — are missing.

The temptation here is a recipe that says "roast at 425 until done," and that is not worth a
table. What earns one is the thing that makes the vegetable good: the parboil before the roast,
the toss in cornstarch, the cut side down and not moved, the glaze added at the end so it does
not burn.

## Acceptance Criteria

- At least **10** new `.cook` files, each naming `counters: The Bowl Shop`.
- At least **5** are proteins for the "what goes on top" section and at least **4** are roasted
  vegetables.
- At least **2** of the proteins are not meat.
- Every file has real technique in it — 3 to 6 operations that say how, not just how long.
- Nothing duplicates a protein or side that already exists. Dishes found to exist are listed in
  the work artifact by slug and section, for T-002-08 to shelve.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs.
- Every timer is named. Every file carries `title`, `category`, `tags`, `servings`, `counters`,
  and `aka` where people say it another way.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
