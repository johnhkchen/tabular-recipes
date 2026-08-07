# What each counter is missing

One page per counter, rewritten after the whole shelf was read at 514 recipes. Each file says what landed
there grouped into the sections that counter's menu actually prints, what a place like that obviously sells
and we do not have yet, which sub-recipes those dishes wait on, and which of its items a single table
genuinely cannot hold.

One file here is no longer a counter page: [soup-pot.md](soup-pot.md) is the record of a shelf that came
down. See [Retired counters](#retired-counters) below.

The vocabulary throughout comes from `docs/knowledge/counters.md`. Dish names are the names on real
boards, because that is the way in.

The `## What it has` block of each file is machine-read: `node scripts/menu-sections.mjs` parses it back
into `src/data/counters.json`, and as of this pass it **reproduces that file byte for byte** rather than
replacing it. Keep the `**Section title.** slug · slug` shape when you edit one, and keep the section
titles free of an em-dash aside — the parser cuts a title at ` — `.

## Build state

`npm run verify` passes end to end: **642 files draw a table, 642 recipes parse, 817 tests green in 9
files, 665 pages build.** 642 recipes, 27 categories, 882 counter assignments, 760 pairings made mutual,
timers in 619 files, 0 orphans, 0 counters inferred from category, 0 parser warnings, 0 duplicate slugs.
45 files declare a `kit:` — 25 `Instant Pot`, 20 `Slow Cooker` — and every one resolves to exactly one
plain sibling.

**Measured after T-007-02 and no later.** T-007-03 and T-007-04 are writing the cha chaan teng's recipes
while this is being read, so every count above will be higher by the time they land. T-007-05 restates
them once the whole story is in. The previous line read 658 files, 825 tests in 8 files and 682 pages;
that was already stale on the test count before this ticket touched anything.

### Retired counters

**The Soup Pot came down on 7 August 2026** under S-007, and is the first counter this collection has
removed. Sixteen 老火湯 were deleted, eight soups moved to other shelves — five of them to One Pot, under
a new section there — and the counter's entry was taken out of `src/data/counters.json`, so
`/menu/soup-pot` no longer builds. The board is 21 counters, 20 of them with something on them; Cha Chaan
Teng is the empty one and T-007-05 fills it.

[soup-pot.md](soup-pot.md) was kept rather than deleted, and rewritten as a record: why the shelf failed,
what happened to each of the twenty-four recipes, and what would have to be true for anyone to try it
again. Its dried-goods glossary and its four rules of the pot are intact. It has no `## What it has`
block, because there is no counter for `menu-sections.mjs` to match it to.

**The tally below, and the three sections after it, still describe the fifteen-counter shelf.** S-002
added The Bowl Shop, Instant Pot and One Pot; S-003 is adding three more. Rewriting eighteen rows twice
would waste the second pass, so the whole board is left for T-003-07, which reads it all after the S-003
shelves land. Until then the three new counters are described only in their own pages —
[bowl-shop.md](bowl-shop.md), [instant-pot.md](instant-pot.md), [one-pot.md](one-pot.md) — each of which
is current.

At 514 recipes, three things needed repairing, and none of them was visible from inside one folder:

- **`ginger-garlic-paste` wrote its shelf life as a timer** (`~chill{3%weeks}` on a fifteen-minute paste),
  which put a 21-day edge on the critical path and made it the third-longest recipe on the site.
- **`lime-pickle` claimed 15 days** against two seven-day waits.
- **`schedule.test.ts` named three slugs** that had been wrong since the third ticket of this story. It now
  asserts the property those names stood for.

## The tally

Counts of *assignments*, so a recipe at two counters is counted twice. "Only here" is how many of a
counter's recipes are not also shelved somewhere else — the number that says whether a counter has a
menu of its own or is borrowing one. The **was** columns are the state this story started from.

| Counter | Recipes | was | Only here | Missing dishes | was | Missing components | was |
| --- | --: | --: | --: | --: | --: | --: | --: |
| [Bakery](bakery.md) | 107 | 91 | 63 | 18 | 22 | 11 | 15 |
| [Diner](diner.md) | 77 | 43 | 35 | 4 | 20 | 5 | 10 |
| [Deli](deli.md) | 62 | 38 | 24 | 13 | 25 | 10 | 14 |
| [Meat and Three](meat-and-three.md) | 53 | 23 | 27 | 7 | 20 | 6 | 13 |
| [Curry House](curry-house.md) | 47 | 15 | 47 | 10 | 20 | 8 | 14 |
| [Shawarma Counter](shawarma-counter.md) | 44 | 21 | 36 | 9 | 22 | 10 | 16 |
| [Taquería](taqueria.md) | 34 | 17 | 25 | 14 | 22 | 7 | 12 |
| [Pizzeria](pizzeria.md) | 32 | 22 | 26 | 13 | 21 | 13 | 14 |
| [Panadería](panaderia.md) | 30 | 8 | 17 | 8 | 22 | 6 | 10 |
| [Dim Sum Counter](dim-sum-counter.md) | 30 | 7 | 20 | 9 | 21 | 11 | 13 |
| [Ramen Shop](ramen-shop.md) | 27 | 10 | 26 | 9 | 18 | 10 | 13 |
| [Thai Kitchen](thai-kitchen.md) | 21 | 5 | 21 | 13 | 21 | 10 | 13 |
| [Smokehouse](smokehouse.md) | 21 | 5 | 14 | 4 | 18 | 8 | 9 |
| [Takeout Counter](takeout-counter.md) | 20 | 5 | 15 | 9 | 20 | 9 | 12 |
| [Phở & Bánh Mì](pho-and-banh-mi.md) | 18 | 1 | 16 | 10 | 23 | 9 | 13 |
| **Total** | **623** | **311** | **412** | **150** | **315** | **133** | **191** |

Also recorded: **107 items across the fifteen counters that a single table cannot express**, and the
reason in each case. That number has not moved, and it should not — nothing about what a table can hold
changed.

The two numbers the old tally called the story on their own are both closed. **Panadería had no recipe of
its own**; it now has seventeen. **Phở & Bánh Mì had one recipe**; it has eighteen, sixteen of them only
there.

Every counter is now **fully sectioned**: all 623 assignments print under a heading its board would use,
and no section names a dish that is not shelved there.

## What no single classifier could see

The old version of this section said the collection was *components and dessert*, and listed seven whole
techniques absent from all 241 files. **All seven are now present** — pickles and ferments (`do-chua`,
`sour-dill-pickles`, `sauerkraut`, `kabis`, `lime-pickle`), deep frying (`falafel`, `karaage`,
`hush-puppies`, `onion-rings`, `fried-chicken`, `cha-gio`), smoking and curing (`pastrami`, `belly-lox`,
`smoked-brisket`, `chopped-pork`, `char-siu`), pastry shells (`all-butter-pie-crust`, `sweet-tart-shell`,
`hojaldre`, `croissant-dough`), dumplings and noodles (fifteen and thirteen), sandwiches (eleven), and
drinks (three).

What reading all 514 files found instead is not about what is on the shelf but about how it is arranged.

- **The category tree has drifted.** Pickles live in two folders: `sour-dill-pickles`, `do-chua`,
  `lime-pickle` and `mango-chutney` are in `dressings-and-dips/`, while `kabis`, `sauerkraut` and
  `sumac-onions` are in `toppings-and-pickles/`. `coleslaw` and `barbecue-slaw` are filed as dressings
  though `salads/` exists. `cured-fish/` holds one file. Moving a file changes its category and nothing
  else — the slug is the basename, so no URL moves — which makes this cheap to fix and easy to keep
  putting off. **This is the first job of the next pass.**
- **The tag vocabulary had 24 concepts spelled two ways** — `chile`/`chiles`, `no cook`/`no-cook`,
  `stew`/`stewed`, `appetiser`/`appetizer` and twenty more — across 51 files. Folded in this pass, 527
  distinct tags down to 503. **Nothing enforces it.** Tags feed the front-page search alongside `aka` and
  ingredient names, so a split concept silently halves a query, and the next fifty recipes will split it
  again. A checker is a small file and it is the second job of the next pass.
- **26 dish names were claimed by two recipes at once.** Some are honest — a menu really does print
  *madras* for both a blend and a curry, *tonkotsu* for both a broth and a bowl. Six were sending a
  searcher to the wrong table and were fixed: `white-sauce` no longer answers to *tzatziki*,
  `marinara-sauce` no longer answers to *pizza sauce* or *Sunday gravy*, `pilau-rice` no longer answers to
  *yellow rice*, and *white sauce* now returns two dishes instead of five.
- **No two files are the same dish.** Checked by ingredient overlap, by title-and-`aka` overlap, and by
  `dish:` key. The closest pairs — `salsa-verde`/`salsa-verde-cruda`, `general-tsos-chicken`/
  `sesame-chicken`, `tzatziki`/`white-sauce` — are all deliberate and argued in their own tickets.

## The five gaps to fill first

All five of the old list are written: the pastry shell, both pickles, the cornbread, the char siu and the
pâté. Ranked the same way — by how many counters each one unblocks, not by how much anyone wants to eat it.

1. **Move the pickles into one folder, and the slaws into `salads/`.** Not a recipe: an afternoon of
   `git mv` and one `>> category:` line each. Thirteen files, no URL changes, and it is the difference
   between a shelf and a pile.
2. **A tag checker.** One file under `src/lib/`, one test. It has to know the difference between a
   spelling variant and two real concepts, which is why it is worth writing once rather than re-reading
   527 tags every pass.
3. **A shared toasted dried-chile purée** — `birria-de-res`, `red-enchilada-sauce`, `mole-poblano` and
   `adobo-para-al-pastor` all begin toast, soak, blend, strain. Recorded by T-001-10 and still true. It
   only pays off if those four are rewritten to consume it, which is the work.
4. **Buttercream and a cream cheese frosting.** Twenty-one cakes are written and not one of them is
   finished. Two tables turn the whole Bakery cake section into case items, and they unlock the éclair,
   the fruit tart and the doughnut alongside `pastry-cream`, which is already here.
5. **A drink that is brewed.** Three drinks exist and all three are poured cold. Sweet tea is asked for by
   the Smokehouse and Meat and Three, Thai iced tea and café de olla by two more, and hot tea by the Dim
   Sum Counter. One table each.

Immediately after, in order: **a dark roux and a trinity base** (five Louisiana lines at Meat and Three
rest on them), **the Vietnamese baguette** (the one component under a counter that reached rank 12 and
stopped), **wor tip** (the Dim Sum Counter's own pan-fried dumpling — `gyoza` is Japanese and stays at the
Ramen Shop), **cebolla y cilantro** (one row, one operation, on every taquería counter in the world), and
**youtiao**, which two gap notes point at from different rooms.

## Shelving notes for the maintainer

Four things landed where the nearest counter was rather than where they belong, and no per-recipe
classifier could have seen them. **None of the four was resolved by this pass**, because each is a board
decision — a new counter or a moved cuisine — rather than a file edit.

- **The Ethiopian trio is still split across two rooms.** `berbere` and `doro-wat` are at the Curry House;
  `injera` is at the Shawarma Counter. The reference records **Ethiopian Platter** as an archetype found
  and deliberately not shelved.
- **`beef-rendang` sits at the Thai Kitchen** and is Malay/Indonesian. The reference's unshelved
  **Roti Stall** and **Kopitiam** are its real home.
- **`chicken-adobo` and `jollof-rice` sit at Meat and Three**, joined during this story by
  `beef-bourguignon` and `coq-au-vin`, which are French bistro. Each is defensible as "one meat off a
  rotating list"; four of them together is a pattern.
- **`haemul-pajeon` and `bulgogi-marinade` sit at the Ramen Shop**, which the reference explicitly says
  does not sell Korean food. The unshelved **Grill Table** and **Banchan Case** are where they point.

Three more, added by this pass:

- **`cha-lua` is in `stews-and-braises/`** and is a cold cut. It is the weakest placement on the shelf and
  it wants a charcuterie category that does not exist yet.
- **`nixtamalised-masa` is the only non-pastry file in `pastry-and-doughs/`.** It is a dough, and the
  folder is named for doughs, but if that shelf is meant to be pastry-only this is the file to move.
- **Three ingredient names are not food** — `flat skewers`, `metal skewers` and `oak or hickory wood` read
  like cookware written into an ingredient list, and they sit in the shopping list's "Anything else".

## Recorded and not done

Carried forward from the sixteen writer tickets so it is not lost. Each is a rewrite of a dish rather than
an edit to a metadata line, which is why none of it happened here.

- **`chana-masala` derives an onion-tomato masala inline** across steps 2 to 4 — the exact duplication
  `onion-tomato-masala` exists to end (T-001-09 §5).
- **`okonomiyaki` buys its sauce and `japanese-beef-curry` makes its roux inline** (T-001-08 §3).
- **`thai-green-curry-paste` overlaps step 1 of `thai-green-curry`.** Both are defensible; the tidy end
  state is the curry starting from a spoonful of the paste (T-001-03 §3).
- **Three older Thai files carry unnamed timers** — `tom-kha-gai`, `coconut-rice`, `thai-green-curry` —
  which the convention now forbids (T-001-03 §4).
- **The same leaf is spelled two ways**: `makrut lime` in the newer files, `kaffir lime` in
  `thai-green-curry`. Every newer file carries the other spelling in `aka`, so search works either way
  (T-001-03 §5).
- **`naan` does not declare which one it is** — a tandoor naan or a home-oven one (T-001-09 §6).
- **`>> step.N:` counts prose steps as well as operations**, which is undocumented, silently mislabels a
  file rather than failing it, and cost three files a round trip (T-001-08 §5).
