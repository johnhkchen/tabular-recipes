# T-001-11 — Structure

The blueprint: twenty-three new `.cook` files, nothing modified, nothing deleted. Shapes,
categories, shelving and merge trees, in the order they get written.

## Files created

All paths are repository-relative and are the exact `--include` arguments for
`lisa commit-ticket`.

### Wave 1 — components the top of the list needs (6 files)

| Path | Title | Category | Counters |
| --- | --- | --- | --- |
| `recipes/spice-blends-and-marinades/shawarma-spice.cook` | Shawarma Spice | Spice Blends & Marinades | Shawarma Counter |
| `recipes/dressings-and-dips/labneh.cook` | Labneh | Dressings & Dips | Shawarma Counter |
| `recipes/dressings-and-dips/white-sauce.cook` | White Sauce | Dressings & Dips | Shawarma Counter |
| `recipes/sauces-and-gravies/pomegranate-molasses.cook` | Pomegranate Molasses | Sauces & Gravies | Shawarma Counter |
| `recipes/toppings-and-pickles/sumac-onions.cook` | Sumac Onions | Toppings & Pickles | Shawarma Counter |
| `recipes/sauces-and-gravies/attar.cook` | Attar | Sauces & Gravies | Shawarma Counter |

### Wave 2 — the spit and the skewers, gap items 1, 2, 3, 5, 6 (6 files)

| Path | Title | Category | Gap item |
| --- | --- | --- | --- |
| `recipes/smoked-and-grilled/chicken-shawarma.cook` | Chicken Shawarma | Smoked & Grilled | 1 |
| `recipes/smoked-and-grilled/gyro-meat.cook` | Gyro Meat | Smoked & Grilled | 2 |
| `recipes/fried-and-crispy/falafel.cook` | Falafel | Fried & Crispy | 3 |
| `recipes/rice-beans-and-grains/yellow-rice.cook` | Yellow Rice | Rice, Beans & Grains | 5 |
| `recipes/smoked-and-grilled/shish-tawook.cook` | Shish Tawook | Smoked & Grilled | 6 |
| `recipes/smoked-and-grilled/kafta.cook` | Kafta | Smoked & Grilled | 6 |

### Wave 3 — the sides, gap items 8, 9, 10, 11, 12 (5 files)

| Path | Title | Category | Gap item |
| --- | --- | --- | --- |
| `recipes/salads/fattoush.cook` | Fattoush | Salads | 8 |
| `recipes/toppings-and-pickles/kabis.cook` | Kabis | Toppings & Pickles | 9 |
| `recipes/fried-and-crispy/batata-harra.cook` | Batata Harra | Fried & Crispy | 10 |
| `recipes/rice-beans-and-grains/ful-medames.cook` | Ful Medames | Rice, Beans & Grains | 11 |
| `recipes/fried-and-crispy/kibbeh.cook` | Kibbeh | Fried & Crispy | 12 |

### Wave 4 — the bakery half and the sweets, gap items 13, 14 (6 files)

| Path | Title | Category | Counters |
| --- | --- | --- | --- |
| `recipes/flatbreads-and-pancakes/manakish.cook` | Manakish | Flatbreads & Pancakes | Shawarma Counter, Bakery |
| `recipes/flatbreads-and-pancakes/lahm-bi-ajeen.cook` | Lahm bi Ajeen | Flatbreads & Pancakes | Shawarma Counter |
| `recipes/dumplings-and-rolls/fatayer.cook` | Fatayer | Dumplings & Rolls | Shawarma Counter |
| `recipes/dumplings-and-rolls/sambousek.cook` | Sambousek | Dumplings & Rolls | Shawarma Counter |
| `recipes/bars-and-brownies/baklava.cook` | Baklava | Bars & Brownies | Shawarma Counter, Bakery |
| `recipes/cookies/maamoul.cook` | Maamoul | Cookies | Shawarma Counter |

**Files modified: none. Files deleted: none. `src/` untouched. No new folder needed** —
every category above already exists.

## Category calls worth defending

- **`Smoked & Grilled` for the four proteins.** The folder is nine American pit files plus
  `al-pastor`, which is the closest analogue on the site: a marinated stack roasted in a tin
  and shaved. Shawarma, gyro, tawook and kafta are the same family of question — meat over
  or under fierce dry heat, then cut.
- **`Bars & Brownies` for baklava.** It is a tray baked whole, syruped, and cut into
  diamonds; `date-squares` and `millionaires-shortbread` are its neighbours structurally.
  `Pastry & Doughs` holds *unfilled shells and doughs* (`hojaldre`, `sweet-tart-shell`), and
  baklava is a finished sweet, not a dough.
- **`Cookies` for maamoul.** A moulded shortbread, filled. `Cookies` is where a moulded
  short dough belongs.
- **`Dumplings & Rolls` for fatayer and sambousek.** Both are dough folded around a filling
  and closed — the same question as `gyoza`, `siu-mai`, `cha-gio`. Sambousek is fried, but
  `Fried & Crispy` is about the fry being the point (`karaage`, `falafel`, `batata-harra`,
  `kibbeh`); in a sambousek the fold is the point and the fry is finishing.
- **`Flatbreads & Pancakes` for manakish and lahm bi ajeen.** Both are topping *on* an open
  round of dough, never enclosed — the distinction the counters doc draws in writing for
  lahm bi ajeen ("meat *on* dough, not enclosed").
- **`Sauces & Gravies` for attar and pomegranate molasses.** Both are poured. `piloncillo-syrup`
  is already there as precedent for a syrup on that shelf.

## The shape every file has

```
>> title:      Title Case
>> category:   exact string from the folder
>> tags:       lowercase, comma-separated — protein, cuisine, method, key ingredient
>> counters:   Shawarma Counter[, Bakery]
>> aka:        generous; includes at least one form with no diacritics
>> pairs-with: existing slugs only
>> servings:   integer
>> time:       total wall clock, cook's phrasing
>> step.N:     verb-forward label, one per operation step

<one imperative sentence per step carrying its ingredients, then plain commentary
 on the thing people get wrong>
```

Rules held across all twenty-three:

1. **Every timer named from `src/lib/time.ts`'s vocabularies** — `~marinate`, `~rest`,
   `~chill`, `~drain`, `~soak`, `~bake`, `~roast`, `~fry`, `~sear`, `~knead`, `~stir`,
   `~toss`, `~simmer`, `~steep`, `~cool`, `~set`, `~brine`, `~stand`. Never an invented name
   like `~hang` or `~shave`: an unrecognised name reads as no name at all.
2. **Metric in parentheses beside imperial**, and a preparation note where the cut matters:
   `@dried chickpeas{1%cup}(200 g; soaked 24 hr, never cooked)`.
3. **Back-references are relative and count header steps** — `@&(~1)dough{}` is the previous
   step. Branch merges use the true distance, as `gyoza` does with `~3`.
4. **≥3 ingredient rows and ≥3 columns**, i.e. at least two chained operations. Every file
   below is planned at 4–7 steps.
5. **`aka` carries the undiacriticked form** the criterion asks for, plus the transliteration
   spread `docs/knowledge/counters.md` records as least stable at this counter
   (shawarma/shwarma/shawerma, tawook/tawouk/taouk, kafta/kefta/kufta, kibbeh/kibbie/kibbi,
   manakish/manaeesh/man'oushe, labneh/labaneh).
6. **The caveat rides in the step's prose**, not in a `>> note:` field — the shape
   `al-pastor` was moved to.

## Merge trees, per file

Written as: ingredient-bearing steps → the operation each feeds. `→` is a reference edge.

**Components.** `shawarma-spice`: toast whole spices → grind → stir in ground/salt (3 ops).
`labneh`: salt yogurt → tie and drain 24 hr → dress with oil and za'atar (3). `white-sauce`:
whisk mayo/yogurt base → loosen with vinegar and lemon → herbs and garlic → rest to marry (4).
`pomegranate-molasses`: reduce juice → acidulate and sweeten → reduce to coat → cool (4).
`sumac-onions`: slice and rinse onion → salt and drain → toss with sumac, parsley, lemon (3).
`attar`: dissolve sugar → boil to thread → acidulate → perfume off the heat → cool (4).

**Wave 2.** `chicken-shawarma`: marinate thighs in spice+yogurt+acid → stack in a tin →
roast → rest and shave → crisp in the pan (5). `gyro-meat`: process meat to a paste with
onion squeezed dry → press into a tin → bake in a bain-marie → weight and chill → slice thin
and crisp (5). `falafel`: soak dried chickpeas raw → grind with herbs and aromatics → rest
the mix cold → work in the raising agent → fry (5); the never-cooked chickpea and the
green interior are the whole point and carry the prose. `yellow-rice`: rinse rice → bloom
turmeric and cumin in butter → toast the rice → simmer in stock → steam off heat and fork
(5). `shish-tawook`: whisk the yogurt-lemon-garlic marinade → marinate cubes → thread and
grill → rest and squeeze lemon (4). `kafta`: work meat with grated onion squeezed dry and
parsley → chill the mix → press onto skewers → grill (4).

**Wave 3.** `fattoush`: fry or toast the pita → whisk the sumac-and-molasses dressing →
chop the vegetables → dress and add the bread last (4). `kabis`: pack turnip with a beet →
boil the brine → pour and seal → ferment on the counter → refrigerate (5). `batata-harra`:
parboil and dry the potato → fry to crisp → pound the garlic-cilantro-chile → toss **off the
heat** (4). `ful-medames`: soak and simmer the fava → crush part of it → dress with
lemon-oil-cumin → top and serve to be finished at the table (4). `kibbeh`: soak fine bulgur
→ grind with lean meat to a paste → cook the onion-and-pine-nut filling → shape torpedoes →
fry (5).

**Wave 4.** `manakish`: yeast dough → knead and prove → mix za'atar with oil → shape rounds
→ top and bake hot (5). `lahm-bi-ajeen`: dough → prove → work the meat with tomato,
molasses and spice → spread thin and bake (4). `fatayer`: yogurt-enriched dough → prove →
wilt and wring the spinach, dress with lemon, sumac and onion → fold triangles and seal →
bake (5). `sambousek`: short unleavened dough → rest → cook the filling → fill and crimp
half-moons → fry (5). `baklava`: clarify the butter → chop and spice the nuts → layer filo
in a tray → cut before baking, then bake → pour cold syrup on the hot tray (5); the syrup
direction is the prose. `maamoul`: rub semolina with butter → rest overnight to hydrate →
knead with milk and blossom water → work the date paste → mould, fill and bake pale (5).

## Ordering, and why it matters

Waves run in ranked order because criterion 2 is about order. Within that, **wave 1 comes
first** for a practical reason: `chicken-shawarma`, `gyro-meat`, `fattoush` and `baklava`
each name a wave-1 file in `pairs-with`, and a `pairs-with` pointing at a slug that does not
exist yet is a dangling edge for the build to make mutual later. Writing the components
first means no file ever references a slug that is not on disk.

Commits: **one per wave**, four in total, each through
`lisa commit-ticket --ticket-id T-001-11 --message <msg> --include <path>...` with the exact
paths listed above. A wave is committed only after every file in it reports `ok`.
