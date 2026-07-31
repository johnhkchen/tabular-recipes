# T-001-17 — Structure

Two files change. Nothing is created, nothing is deleted.

- `src/data/counters.json` — sections added to fifteen counters; new sections inserted.
- `src/data/aisles.json` — patterns added to eleven of the fourteen aisles; nine `packs` entries
  added and three extended.

No file under `src/lib/`, `scripts/`, `docs/` or `recipes/` is touched. `src/generated/recipes.json`
is regenerated (`npm run recipes`) before and after, and is gitignored.

## Ordering of the work

1. counters.json first — it is self-contained and verifiable on its own (no counter renders "Also").
2. aisles.json second — its verification is the vitest run, which is also the ticket's gate.
3. Both re-serialised as `JSON.stringify(file, null, 2) + "\n"`, the format
   `scripts/menu-sections.mjs --write` produces, so the diff is placements and patterns only.

## A. counters.json — the placement map

Rules applied, and one amendment to the design's rule 1: existing section **titles and items** are
kept exactly, but where a counter's gap note prints an explicit board order (Phở & Bánh Mì's
A/P/B/C/S codes), the sections are emitted in that order rather than in the order the extraction
script happened to leave them. Everywhere else the existing relative order stands and new sections
are inserted where the note prints them.

Below, `+` marks an added section; slugs listed are the ones being added to that section.

### Bakery — 14 placed

- The bread rack: `manakish`
- Sweet buns and morning things: `pineapple-bun`, `croissant`, `pain-au-chocolat`,
  `almond-croissant`, `egg-custard-tart` — the viennoiserie and the bun case, which is what
  "morning things" names
- Cakes, whole or by the slice: `apple-pie` — sold whole or cut, like everything else in it
- Bars and squares: `baklava` — cut in diamonds and sold by the piece
- Doughs and shells: `croissant-dough`, `hojaldre`
- The cold case: `frangipane`, `lotus-seed-paste`, `red-bean-paste`, `whipped-cream` — the section
  already holds pastry-cream, crème anglaise and lemon curd, so fillings are its established sense

### Panadería — 21 placed

- Pan Dulce: `conchas`, `cuernos`, `bigotes-de-pina`, `orejas`, `campechanas`, `polvorones-rosas`,
  `puerquitos`, `empanadas-de-pina`, `mantecadas`, `cubiletes-de-queso`
- **+ Pan Salado** (after Pan Dulce, as the note prints it): `bolillos`, `teleras`
- Cakes and flan, from the same counter: `chocoflan`
- The tortillería side: `nixtamalised-masa`, `crema-mexicana`, `queso-fresco`
- Also here: `pan-dulce-dough`, `costra-de-azucar`, `relleno-de-pina`, `hojaldre`,
  `piloncillo-syrup` — the components behind the racks

### Taquería — 16 placed

- Fillings: `al-pastor`, `carne-asada`, `pollo-asado`, `cachete`, `chile-verde`, `lengua`,
  `suadero`, `tinga-de-pollo`, `tripas`
- What it goes in: `nixtamalised-masa`
- Salsas and the table: `salsa-verde`, `salsa-verde-cruda`, `crema-mexicana`, `queso-fresco`,
  `consome-de-birria` — the consomé arrives in a cup on the table, beside the salsas
- The spice shelf: `adobo-para-al-pastor`

### Dim Sum Counter — 21 placed

- **+ Out of the steamer** (first, as the note prints it): `har-gow`, `siu-mai`, `char-siu-bao`,
  `cheung-fun`, `xiao-long-bao`, `lo-mai-gai`, `chicken-feet`, `turnip-cake`, `taro-cake`
- Out of the fryer: `wu-gok`, `ham-sui-gok`, `sesame-balls`
- Rice and noodle: `beef-chow-fun`
- Roast meats in the glass: `siu-yuk`, `soy-sauce-chicken`, `white-cut-chicken`
- The bakery case at the till: `pineapple-bun`, `egg-custard-tart`
- Sweets: `lotus-seed-paste`, `red-bean-paste`
- The shelf: `ginger-scallion-oil`

### Takeout Counter — 14 placed

Sections in board order (counters.md: Appetizer, Soup, Chow Mein, Lo Mein, Egg Foo Young,
Vegetables, Fried Rice, Pork / Beef / Seafood / Chicken, Mei Fun, …), inserted around the five
that already exist.

- Appetizer / Side Orders: `crab-rangoon`, `egg-rolls`
- **+ Soup**: `egg-drop-soup`, `hot-and-sour-soup`, `wonton-soup`
- **+ Lo Mein**: `lo-mein`
- **+ Egg Foo Young**: `egg-foo-young`
- Pork: `sweet-and-sour-pork`
- **+ Beef**: `beef-with-broccoli`
- **+ Chicken**: `general-tsos-chicken`, `sesame-chicken`, `orange-chicken`
- **+ Mei Fun**: `singapore-mei-fun`
- The sauce shelf: `house-brown-sauce`

### Phở & Bánh Mì — 14 placed

Emitted in the board's letter order: A, P, B, C, S, then the case.

- Appetisers / plates (A): `cha-gio`, `goi-cuon`
- **+ Phở (P)**: `pho-bo`, `pho-ga`, `pho-broth`
- **+ Bún (B)**: `bun-thit-nuong`, `nuoc-cham` — the note calls nước chấm "one table, three
  sections"; it is printed where it is poured
- **+ Cơm (C)**: `com-tam`
- Bánh mì (S): `banh-mi-dac-biet`, `banh-mi-thit-nuong`, `banh-mi-khong`, `xiu-mai`
- **+ The cold case and drinks**: `cha-lua`, `ca-phe-sua-da`

### Ramen Shop — 17 placed

- **+ Broths — the menu's first decision** (first): `tonkotsu-ramen`, `shoyu-ramen`, `shio-ramen`,
  `miso-ramen` — the bowls are printed under the broth that names them, which is the note's point
- **+ Toppings you tick off**: `chashu`, `ajitama`, `menma`
- The small fried and griddled plates: `gyoza`, `karaage`
- The shelf: `tonkotsu-broth`, `chintan-broth`, `dashi`, `ramen-noodles`, `shio-tare`,
  `shoyu-tare`, `miso-tare`, `mayu` — the stocks, tares and aroma oil behind the counter

### Thai Kitchen — 16 placed

- Soups: `tom-yum-goong`
- **+ Salads (yum)** (after Soups): `som-tum`, `larb-gai`
- Curries by colour: `thai-red-curry`, `thai-yellow-curry`, `panang-curry`, `massaman-curry`
- **+ Noodles** (after the curries): `pad-thai`, `pad-see-ew`, `pad-kee-mao`
- Rice: `pad-krapow` — printed over rice, which is how it is ordered
- The shelf: `thai-green-curry-paste`, `thai-yellow-curry-paste`, `panang-curry-paste`,
  `massaman-curry-paste`, `pad-thai-sauce`

### Curry House — 32 placed

- **+ Starters and the tray** (first): `samosa`, `onion-bhaji`, `papadom`, `mango-chutney`,
  `lime-pickle`, `mint-chutney`, `raita`, `kachumber` — the papadom-and-chutney-tray opening
- Tandoori: `chicken-tikka`, `seekh-kabab`
- The sauce list: `balti`, `bhuna`, `butter-chicken`, `dansak`, `dopiaza`, `jalfrezi`, `karahi`,
  `korma`, `madras`, `passanda`, `patia`, `rogan-josh`, `vindaloo`
- Dal and vegetarian: `palak-paneer`
- Rice: `biryani`, `pilau-rice`
- The spice shelf: `ginger-garlic-paste`, `vindaloo-paste`, `makhani-gravy`,
  `onion-tomato-masala`, `birista`, `paneer`

### Shawarma Counter — 23 placed

- **+ The spit — three or four proteins** (first): `chicken-shawarma`, `gyro-meat`, `shish-tawook`,
  `kafta`
- Cold mezze: `labneh`, `fattoush`, `kabis`, `sumac-onions`
- Sauces: `white-sauce`, `pomegranate-molasses`
- Rice and grains: `yellow-rice`
- Bread: `manakish`
- The spice shelf: `shawarma-spice`
- Hot: `falafel`, `kibbeh`, `batata-harra`, `sambousek`, `fatayer`, `lahm-bi-ajeen`, `ful-medames`
- **+ Sweets** (last): `baklava`, `maamoul`, `attar` — the note names them "the sweets"; two other
  counters already print the same heading

### Pizzeria — 10 placed

- **+ By the slice** (first, as the note prints it): `margherita`, `white-pizza`, `grandma-pie`,
  `sicilian-pizza`
- Whole pies: `sicilian-pan-dough` — beside the dough already there
- Primi: `baked-ziti`, `fresh-egg-pasta`
- Secondi: `chicken-parmigiana`, `meatballs`
- Bread and flat things: `garlic-knots`

### Deli — 22 placed

Four of the five sections the note lists as empty are opened here.

- **+ The sandwich board** (after the bread rack — the note says the bread question comes first):
  `club-sandwich`, `grilled-cheese`, `tuna-melt`
- **+ The slicer**: `pastrami`, `corned-beef`
- **+ The smoked-fish case**: `belly-lox`, `whitefish-salad`
- **+ Salads by the pound**: `chicken-salad`, `egg-salad`, `tuna-salad`, `macaroni-salad`,
  `potato-salad`, `coleslaw`
- Spreads and dressings sold by the tub: `cream-cheese`, `scallion-schmear`, `chopped-liver`,
  `russian-dressing`, `schmaltz`
- The barrel: `sauerkraut` — the note's "pickle barrel", already named "The barrel" here
- Soups: `chicken-broth`, `matzo-ball-soup`
- The hot case: `potato-knish`

### Diner — 28 placed

- **+ Breakfast all day — eggs, meats, potatoes** (first): `eggs-benedict`, `western-omelette`,
  `breakfast-sausage-patties`, `scrapple`, `corned-beef-hash`, `hash-browns`, `home-fries`,
  `buttermilk-biscuits`
- The griddle: `french-toast`
- Gravies and sauces: `creamed-chipped-beef`, `hot-fudge`
- Blue plates: `fried-chicken`, `tuna-noodle-casserole`
- Sides: `french-fries`, `onion-rings`, `mashed-potatoes`
- The dessert case: `apple-pie`, `banana-pudding`, `whipped-cream`, `milkshake`, `egg-cream` —
  the fountain drinks are printed with the case; the notes record no separate fountain heading
- **+ Sandwiches and burgers** (last, where the note prints it): `blt`, `club-sandwich`,
  `grilled-cheese`, `patty-melt`, `pork-roll-egg-and-cheese`, `smash-burger`, `tuna-melt`

### Smokehouse — 14 placed

- **+ From the pit** (first): `smoked-brisket`, `burnt-ends`, `chopped-pork`, `smoked-pork-ribs`,
  `rib-tips`, `smoked-chicken`, `smoked-turkey-breast`, `smoked-bologna`
- Sauce on the table: `barbecue-dip`
- Sides: `coleslaw`, `barbecue-slaw`, `brunswick-stew`
- Bread: `hush-puppies`
- **+ Dessert** (last): `banana-pudding`

### Meat and Three — 27 placed

- The meat list, rotating: `fried-chicken`, `country-fried-steak`, `meatloaf`, `oxtails`,
  `smothered-pork-chops`, `baked-turkey-wings`
- The vegetable list: `collard-greens`, `green-beans`, `black-eyed-peas`, `butter-beans`,
  `candied-yams`, `creamed-corn`, `stewed-squash`, `fried-okra`, `mashed-potatoes`,
  `macaroni-and-cheese`, `potato-salad`, `coleslaw`, `french-fries`, `cornbread-dressing` — a
  meat-and-three's "vegetable" is whatever is on the vegetable line, macaroni and slaw included
- Cornbread: `buttermilk-biscuits` — the bread line on the board, which is cornbread or a biscuit
- Gravies: `cream-gravy`, `onion-gravy`
- Dessert: `banana-pudding`, `peach-cobbler`, `sweet-potato-pie`
- The shelf: `ham-hock-stock`

**Total: 289 placements, which is every unshelved slug at every counter.**

## B. aisles.json — patterns

Added by aisle. Names in the ingredient list that these are for are in brackets where the pattern
is not the name itself.

- **produce**: `radishes`, `turnips`, `mangoes`, `green mangoes`, `papaya`, `green papaya`,
  `jicama` [grated jicama], `bok choy`, `baby bok choy`, `taro`
- **butcher**: `char siu`, `chashu` [chāshū], `chả lụa`, `cha lua`, `thịt nguội`, `lap cheong`,
  `schmaltz`, `rendered fat`, `pork floss`
- **fishmonger**: `whitefish`, `smoked whitefish` [whole smoked whitefish]
- **dairy**: `ajitama` [the marinated egg], `hollandaise`
- **bakery**: `croissant`, `croissants` [day-old croissants], `croissant dough`, `english muffins`,
  `rolls` [kaiser rolls], `bánh mì rolls`, `banh mi rolls`, `pizza dough`, `sicilian pan dough`,
  `hojaldre`, `masa para pan dulce`, `pie crust`, `tart shells` [blind-baked tart shells],
  `vanilla wafers`, `cornbread` [day-old skillet cornbread]
- **baking**: `frangipane`, `costra de azúcar`, `attar`, `rennet` [liquid rennet],
  `baker's ammonia`, `ascorbic acid`, `jaggery`
- **dry-goods**: `ziti`, `sesame paste`, `lotus seeds` [dried split lotus seeds], `kikurage`,
  `wood ear`, `wheat starch`
- **tins**: `marinara sauce`, `ketchup`, `barbecue sauce`, `chili sauce`, `prepared horseradish`,
  `horseradish`, `sweet and sour sauce`, `house brown sauce`, `makhani gravy`, `bamboo shoots`,
  `chipotles in adobo`, `relleno de piña`, `braising liquid` [birria braising liquid]
- **spices**: `chaat masala`, `pickling spice`, `poultry seasoning`, `dried savory`, `mahlab`,
  `shawarma spice`, `dried tangerine peel`
- **oils**: `frying fat`
- **world**: `đồ chua`, `nước chấm`, `maggi seasoning`, `kansui`, `naruto maki`, `beni shoga`,
  `menma`, `salted bamboo shoots`, `shio tare`, `shoyu tare`, `miso tare`, `mayu`,
  `pad thai sauce`, `vindaloo paste`, `tandoori marinade`, `al pastor adobo`, `red bean paste`,
  `birista`, `fried shallots`, `dried scallop`, `dried lily buds`, `lotus leaves`,
  `dried lotus leaves`, `matzo meal`, `matzo`
- **drinks**: `seltzer`, `lager`, `pomegranate juice`

Left in "Anything else", on purpose: `flat skewers`, `metal skewers`, `oak or hickory wood`.

### Constraints these have to respect

- Every pattern is matched by `matchesStaple` on whole words, accents folded. `đ` does not fold to
  `d`, so `đồ chua` is written as the recipe writes it.
- A two-word pattern outscores every one-word pattern in every aisle. `bamboo shoots` (tins) and
  `salted bamboo shoots` (world) are deliberate — the tin is the default, the bagged Japanese one
  is more specific and wins for menma.
- `red bean paste` in world must outscore `lotus seed paste`? They are different names; no
  interaction. But `red bean paste` (3 words) beats dry-goods' `beans` (1 word) — intended.
- `rolls` in bakery must not claim `rolled oats` (different token) — checked by the sweep.
- `taro` in produce vs `taro cake`: `taro cake` is a recipe, not an ingredient name; no conflict.

## C. packs

New entries:

| patterns | pack | as |
| --- | --- | --- |
| barbecue sauce | 2 cup | a 18 oz bottle |
| marinara sauce | 3 cup | a 24 oz jar |
| ketchup | 2.5 cup | a 20 oz bottle |
| wheat starch | 3.5 cup | a 1 lb bag |
| matzo meal | 4 cup | a 1 lb box |
| red bean paste | 2 cup | a tin |
| ziti, penne, rigatoni, macaroni, pasta | 1 lb | a 1 lb box |
| vanilla wafers | 11 oz | an 11 oz box |
| seltzer | 4 cup | a 1 L bottle |

Extended entries:

- the tahini jar (`peanut butter, almond butter, tahini`) gains `sesame paste`
- the spice jar (`ground cumin, …`) gains `chaat masala`, `pickling spice`, `poultry seasoning`,
  `shawarma spice`, `mahlab`
- the 1 lb bag of pulses gains nothing; `jaggery` gets no entry (sold as a block and weighed,
  never measured against one)

Deliberately not given packs: `taro`, `turnips` (weighed loose), `pizza dough` (counted in balls —
no unit converts, so `purchaseOf` stays silent either way), `lap cheong` (links),
`chipotles in adobo` (a bare count against a tin nobody counts).

## D. Verification steps

1. `npm run recipes` — rebuild `src/generated/recipes.json`.
2. Placement check: for each counter, `{slugs shelved here} ⊆ {slugs named in its sections}`, no
   slug named twice in one counter, no slug named at a counter it is not shelved at. Run from the
   scratchpad, not committed.
3. Aisle sweep: recompute the unplaced set and its share of 925 names; assert ≤ 3 names and that
   they are the three non-food ones.
4. `npx vitest run` — `shopping.test.ts` green, including every named aisle assertion.
5. `git status` — exactly two modified files.
