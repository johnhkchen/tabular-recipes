# What each counter is missing

One page per counter, written after all 241 recipes were assigned. Each file says what landed there
grouped into the sections that counter's menu actually prints, what a place like that obviously sells and
we do not have yet, which sub-recipes those dishes wait on, and which of its items a single table
genuinely cannot hold.

The vocabulary throughout comes from `docs/knowledge/counters.md`. Dish names are the names on real
boards, because that is the way in.

## Build state

`npm run recipes` and `npx vitest run` both pass, unchanged. **Nothing needed repairing.** 241 recipes,
12 categories, 311 counter assignments, 116 pairings made mutual, timers in 221 files, 0 orphans, 0
counters inferred from category, 0 parser warnings, 269 tests green. No bad counter name, no pairing
pointing at a missing slug, no recipe left uncounted.

## The tally

Counts of *assignments*, so a recipe at two counters is counted twice. "Only here" is how many of a
counter's recipes are not also shelved somewhere else — the number that says whether a counter has a
menu of its own or is borrowing one.

| Counter | Recipes | Only here | Missing dishes | Missing components |
| --- | --: | --: | --: | --: |
| [Bakery](bakery.md) | 91 | 58 | 22 | 15 |
| [Diner](diner.md) | 43 | 17 | 20 | 10 |
| [Deli](deli.md) | 38 | 7 | 25 | 14 |
| [Meat and Three](meat-and-three.md) | 23 | 10 | 20 | 13 |
| [Pizzeria](pizzeria.md) | 22 | 16 | 21 | 14 |
| [Shawarma Counter](shawarma-counter.md) | 21 | 15 | 22 | 16 |
| [Taquería](taqueria.md) | 17 | 12 | 22 | 12 |
| [Curry House](curry-house.md) | 15 | 15 | 20 | 14 |
| [Ramen Shop](ramen-shop.md) | 10 | 9 | 18 | 13 |
| [Panadería](panaderia.md) | 8 | **0** | 22 | 10 |
| [Dim Sum Counter](dim-sum-counter.md) | 7 | 3 | 21 | 13 |
| [Smokehouse](smokehouse.md) | 5 | 2 | 18 | 9 |
| [Takeout Counter](takeout-counter.md) | 5 | 1 | 20 | 12 |
| [Thai Kitchen](thai-kitchen.md) | 5 | 5 | 21 | 13 |
| [Phở & Bánh Mì](pho-and-banh-mi.md) | **1** | 1 | 23 | 13 |
| **Total** | **311** | 171 | **315** | **191** |

Also recorded: **107 items across the fifteen counters that a single table cannot express**, and the
reason in each case.

Two numbers in that table are the story on their own. **Panadería has no recipe of its own** — all eight
are borrowed from the Bakery or the Taquería, so its page currently has no menu. And **Phở & Bánh Mì has
one recipe**, on the counter this project's own worked example is drawn from.

## What no single classifier could see

The collection is **components and dessert**. Read across all fifteen files and the same shape appears
every time: the rub is written and the meat is not; the paste is written and the curry is not; the dough
and the sauce are written and the pizza is not; the custard is written and the shell is not; six pasta
sauces and no pasta; twelve dressings and no salad.

Some whole techniques are absent from all 241 files:

- **Nothing is pickled or fermented.** No dill pickle, no đồ chua, no curtido, no kabis, no sauerkraut,
  no escabeche, no pickled mustard green. Six counters print a pickle as a line item.
- **Nothing is deep-fried.** No falafel, no samosa, no karaage, no hushpuppy, no doughnut, no egg roll,
  no fried chicken, no churro, no flauta.
- **Nothing is smoked or cured.** No pastrami, no lox, no brisket, no chopped pork, no char siu.
- **There is no pastry shell.** Not one pie crust, tart shell or laminated dough in the collection,
  which blocks the case at four counters at once.
- **There are no dumplings and no noodle dishes.** Five counters lead with one or the other.
- **There are no sandwiches**, at three counters whose central item is a sandwich.
- **There is no drink.** Not one, and every counter in the reference sells one.

The counters that read best are the ones whose menu happens to be made of components — Shawarma
Counter's dip case, the Diner's eleven soups, the Pizzeria's sauce shelf. The counters that read worst
are the ones whose menu is made of assembled things.

## The five gaps to fill first

Ranked by how many counters each one unblocks, not by how much anyone wants to eat it.

1. **A pastry shell** — one all-butter shortcrust and one sweet shortcrust. Unblocks apple pie and pecan
   pie (Diner), sweet potato pie and peach cobbler (Meat and Three), egg custard tart (Bakery *and* Dim
   Sum Counter), empanada de piña (Panadería), fruit tart and turnover (Bakery), pâté chaud (Phở & Bánh
   Mì). **Nothing on the site has a crust**, and this single table is the most-reused missing thing in
   the collection.
2. **Two pickles — đồ chua and a sour dill.** Đồ chua is printed in English on nearly every Vietnamese
   board, so searchers arrive with the exact words. The dill is the barrel at the Deli. Between them
   they open the door to curtido, escabeche, kabis, sauerkraut and pickled mustard green, and they end
   the collection's strangest blind spot.
3. **Cornbread** — baked in a hot skillet, plus the hot-water fried version. It is *definitional* at
   Meat and Three ("cornbread whether you ask or not") and required at the Smokehouse, and it is written
   at neither.
4. **Char siu** — one table, three counters. It is the Dim Sum Counter's roast-meat anchor, the Takeout
   Counter's "roast pork" in the fried rice and the lo mein, and *xá xíu* on a bánh mì. It is also the
   first thing to come off a spit anywhere on the site, at counters that currently sell rubs and no meat.
5. **Pâté** — coarse pork liver pâté. This is the project's own stated reason for recording menu
   vocabulary: the person who ate a "#1 combo bánh mì" is looking for this and has no name for it. It
   also gives the emptiest counter on the site its first real item.

Immediately after, in order: **concha** (the loudest single absence anywhere, and the Panadería has no
menu without it), **a bowl of noodles** (pad thai or lo mein — five counters lead with noodles and there
are none), **bolillo** (the Panadería's empty savoury rack and the Taquería's missing torta, in one
loaf), **an onion-tomato masala base** (ten printed lines at the Curry House rest on it), and **a
Margherita** (the Pizzeria already has both halves of it written).

## Shelving notes for the maintainer

Four things landed where the nearest counter was, rather than where they belong, and no per-recipe
classifier could have seen them:

- **The Ethiopian pair is split across two rooms.** `berbere` and `doro-wat` are at the Curry House;
  `injera` is at the Shawarma Counter. The reference records **Ethiopian Platter** as an archetype found
  and deliberately not shelved. If it is ever split out, these three go together.
- **`beef-rendang` sits at the Thai Kitchen** and is Malay/Indonesian. The reference's unshelved
  **Roti Stall** and **Kopitiam** are its real home.
- **`chicken-adobo` and `jollof-rice` sit at Meat and Three**, which is defensible as "one meat off a
  rotating list" — the unshelved **Turo-Turo** is genuinely this counter's cousin — but neither is
  cafeteria-line Southern.
- **`haemul-pajeon` and `bulgogi-marinade` sit at the Ramen Shop**, which the reference explicitly says
  does not sell Korean food. The unshelved **Grill Table** and **Banchan Case** are where they point.

None of these is a build error, and nothing was changed. They are recorded here because they are the kind
of drift that only shows up when you read a whole counter's page as a menu.
