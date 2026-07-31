# T-001-17 — Research

Two data files decide where a dish is printed and where an ingredient is picked up. Fifteen
counter tickets wrote 289 new recipe placements and, by design, touched neither file. This is
what exists today.

## The two files this ticket owns

### `src/data/counters.json` (930 lines)

Shape: `{ "//": <long note>, "counters": [ Counter ] }`. Fifteen counters, each

```json
{ "name": "Bakery", "slug": "bakery", "blurb": "…",
  "categories": ["Breads", …],
  "sections": [ { "title": "The bread rack", "items": ["baguette", …] } ] }
```

- `name` is what a recipe's `>> counters:` line names; `slug` is the URL under `/menu/`.
- `categories` is a **fallback only** — a recipe naming no counter lands at whichever counter
  claims its category. Every recipe in the collection now names its counters explicitly
  (`parse-recipes.mjs` reports "514 named, 0 inferred from category"), so `categories` is
  currently inert.
- `sections` is the printed menu: ordered, and the order is part of what the menu says.
- Section `items` are recipe slugs. All fifteen counters already carry sections.

### `src/data/aisles.json` (1466 lines)

Shape: `{ note, matching, aisles: [Aisle], packs: { note, sizes: [PackSize] } }`.

- 14 aisles, in walk order: produce · butcher · fishmonger · cheese · dairy · bakery · baking ·
  dry-goods · tins · spices · oils · world · freezer · drinks. Pattern counts run from 6
  (freezer) to 144 (produce); 856 patterns in total.
- An aisle may carry `except`, which takes a name back out (`dairy` excepts `coconut milk`).
- 35 `packs.sizes` entries: `{ patterns, pack: {value, unit}, as }`.

## How the code reads them

### `src/lib/counters.ts` — `menuFor(counter, all)`

1. `mine` = every recipe whose `counters` array contains this counter's **name**.
2. If the counter has sections: map each section's slugs through `mine`, drop empty sections,
   keep the file's order.
3. **Anything not named in a section is swept into a trailing `Also` section** (counters.ts:88).
   Nothing is lost, but "Also" is a directory, not a menu — it is the failure this ticket fixes.
4. A counter with no sections at all falls back to grouping by `category`, biggest group first.

A slug listed in a section but not shelved at that counter is silently dropped (the `.filter`
at counters.ts:81) — so stale slugs are invisible, not fatal. There are none today.

### `src/lib/shopping.ts` — `soldAs` → `aisleFor` → `purchaseOf`

- `soldAs(name)` strips home preparation words ("melted", "finely chopped") unless the phrase is
  a product on a shelf (`SOLD_THAT_WAY`, `GROUND_IS_THE_PRODUCT`). It only ever removes words.
- `aisleFor(sold)` scores every pattern in every aisle by `specificity` = words × 1000 + chars,
  and the **most specific match across all aisles wins**. This is what puts "coconut milk" in
  tins rather than dairy. No match → `OTHER_AISLE` ("Anything else", note "ask someone").
- Matching is `matchesStaple()` from units.ts:541 — a pattern hits when its words appear as
  **consecutive whole words**, on `[a-z0-9]+` tokens, accents folded on both sides. So:
  - "corn" does not claim "cornstarch" (one token, not equal);
  - **"radish" does not claim "radishes"** — no singularisation happens in `aisleFor`;
    `shoppingKey` singularises but the aisle lookup does not. Plurals must be listed.
  - a two-word pattern always beats a one-word pattern, whatever the aisle.
- `purchaseOf(sold, amounts)` finds the most specific `packs` entry, converts through
  `canonicalUnit`, and refuses to answer unless every numbered amount is comparable to the pack's
  unit. Pack sizes are never used to convert an amount.

## What the tests require

`src/lib/shopping.test.ts:146` walks every ingredient name in `src/generated/recipes.json`,
counts the ones landing in "Anything else", drops any name matching `/\bwater\b/i`, and asserts
`real.length / counts.size < 0.02`. With 925 distinct names the budget is **18 unplaced names**.

Today: **90/925 = 9.73%** — the test fails. That figure is the ticket's own acceptance criterion
restated, and the report the test prints is the work list.

Other aisle assertions to keep green (shopping.test.ts:61-87): beef chuck→butcher, littleneck
clams→fishmonger, coconut milk→tins, coconut oil→oils, chicken stock→tins, fish sauce→world,
dried oregano→spices, flat-leaf parsley→produce, hot sauce→world, walk order produce → butcher →
spices. Any new pattern that outscores these breaks a named test.

## The 289 unplaced recipe placements

Every counter renders an "Also" section. Counts (`unplaced / shelved`):

| Counter | unplaced | shelved | Counter | unplaced | shelved |
| --- | --- | --- | --- | --- | --- |
| Bakery | 14 | 107 | Shawarma Counter | 23 | 44 |
| Panadería | 21 | 30 | Pizzeria | 10 | 32 |
| Taquería | 16 | 33 | Deli | 22 | 62 |
| Dim Sum Counter | 21 | 30 | Diner | 28 | 73 |
| Takeout Counter | 14 | 20 | Smokehouse | 14 | 21 |
| Phở & Bánh Mì | 14 | 18 | Meat and Three | 27 | 53 |
| Ramen Shop | 17 | 27 | Curry House | 32 | 47 |
| Thai Kitchen | 16 | 21 | | | |

A recipe sits at several counters, so the same slug is placed more than once (coleslaw is at the
Deli, the Smokehouse and Meat and Three; buttermilk-biscuits at the Diner and Meat and Three).
Each counter decides its own section for it.

## Where the section titles come from

`scripts/menu-sections.mjs` extracts them from the **`## What it has`** block of each
`docs/gaps/<slug>.md`, in the shape `**Salsas and the table.** salsa-roja · guacamole`. It is a
one-way import: gap note → counters.json. Running it now would not help — the gap notes were
written when the shelf was nearly empty, so their section lines carry the *old* items, and the
289 new recipes would come back as "Also" again. **The gap notes are also out of scope** (the
ticket permits two files), so this ticket edits `counters.json` directly and leaves the script
and the notes alone. T-001-18 rewrites `docs/gaps/`.

The titles themselves are on file. Every counter's gap note heads its sections, including the
empty ones, and those are exactly the sections the new dishes fill:

- **Phở & Bánh Mì**: Appetisers / plates (A) · Phở (P) · Bún (B) · Cơm (C) · Bánh mì (S) ·
  The cold case and drinks — five of six empty today.
- **Takeout Counter**: Appetizer / Side Orders · Fried Rice · The sauce shelf · Spice, plus
  *"Empty sections, as printed on the board: Soup · Chow Mein / Chop Suey · Lo Mein · Egg Foo
  Young · Vegetables · Pork · Beef · Seafood · Chicken · Mei Fun · House Specialties ·
  Combination Platters"*.
- **Ramen Shop**: Broths — the menu's first decision · Toppings you tick off · The small fried
  and griddled plates · Rice and donburi · Soup · Custard · The shelf.
- **Thai Kitchen**: Appetisers · Soups · Salads (yum) · Curries by colour · Noodles · Rice ·
  The shelf · Shelved here from a neighbouring board.
- **Smokehouse**: From the pit · Sauce on the table · Rubs and brines · Sides · Bread · Dessert.
- **Deli**: The bread rack · Spreads and dressings sold by the tub · Soups · The hot case ·
  The sweet end · Also here, plus *"Empty: the slicer · the smoked-fish case · salads by the
  pound · the sandwich board · the pickle barrel"*.
- **Diner**: Breakfast all day — eggs, meats, potatoes · The griddle · Gravies and sauces · Soup
  of the day · Blue plates · Sides · Dressings, by the cup on the side · The dessert case ·
  Sandwiches and burgers.
- **Meat and Three**: The meat list, rotating · The vegetable list · Gravies · Cornbread ·
  Dessert · The shelf · Shelved here from elsewhere.
- **Curry House**: Starters and the tray · Tandoori · The sauce list · Dal and vegetarian ·
  Rice · Breads · Sweets · The spice shelf · Shelved here from the Ethiopian board.
- **Taquería**: Fillings — the guisado and carne list · What it goes in · Arroz y frijoles ·
  Salsas and the table · The spice shelf · Dessert.
- **Dim Sum Counter**: Out of the steamer · Out of the fryer · Rice and noodle · Roast meats in
  the glass · The bakery case at the till · Sweets · The shelf.
- **Panadería**: Pan Dulce · Pan Salado · Cakes and flan, from the same counter · The
  tortillería side · Also here.
- **Shawarma Counter**: The spit — three or four proteins · The formats · Cold mezze · Sauces ·
  Rice and grains · Soups · Bread · The spice shelf · Hot · Shelved here from the Ethiopian board.
- **Pizzeria**: By the slice · Whole pies · The sauce shelf · Primi · Secondi · Soup · Bread and
  flat things · Salad dressings, for a salad that is not here · Sweets · Fried appetisers.
- **Bakery**: The bread rack · Sweet buns and morning things · Cakes, whole or by the slice ·
  Cookies by the piece · Bars and squares · The cold case · Odds that landed here (plus "Doughs
  and shells", already in counters.json).

Note the shape: several counters name sections in counters.json that the gap note does not
(Bakery's "Doughs and shells", Deli's "The barrel", Takeout's "Pork"). counters.json is ahead of
the notes in places, so it — not the note — is the current state of the board.

`docs/knowledge/counters.md` carries the vocabulary tables behind these boards (what a board
calls a thing, and its `aka` spellings), and confirms the section grammar: ramen splits on broth
first; a curry house prints a list of *sauces*; a taquería is fillings × vehicles; a dim sum
counter is steamer / fryer / glass case.

## The 90 unplaced ingredient names

Grouped by why they miss:

1. **Components this collection makes** (~35): chāshū, ajitama, shio tare, shoyu tare, mayu,
   menma, đồ chua, nước chấm, chả lụa, thịt nguội, schmaltz, frangipane, croissant dough,
   hojaldre, masa para pan dulce, relleno de piña, costra de azúcar, birista, makhani gravy,
   vindaloo paste, al pastor adobo, shawarma spice, tandoori marinade, birria braising liquid,
   pad thai sauce, house brown sauce, sicilian pan dough, pizza dough, marinara sauce, red bean
   paste, hollandaise, pie crust, blind-baked tart shells, sweet and sour sauce, attar.
   Most are also **buyable** — a shop sells pizza dough, marinara, red bean paste, pâté-style
   cold cuts, char siu — which is what decides their aisle.
2. **Plurals and variants of patterns already present** (~6): radishes (radish), turnips
   (turnip), green mangoes (mango), green papaya, english muffins, kaiser rolls.
3. **Genuinely new groceries** (~40): wheat starch, barbecue sauce, ketchup, jaggery, chaat
   masala, bamboo shoots, salted bamboo shoots, lap cheong, taro, kansui, naruto maki, kikurage,
   beni shoga, sesame paste, dried scallop, dried lily buds, dried tangerine peel, dried lotus
   leaves, dried split lotus seeds, matzo meal, seltzer, cold seltzer, cold lager, vanilla
   wafers, ziti, pickling spice, poultry seasoning, dried savory, mahlab, baker's ammonia,
   ascorbic acid, liquid rennet, chili sauce, prepared horseradish, Maggi seasoning, chipotles
   in adobo, whole smoked whitefish, baby bok choy, unsweetened pomegranate juice, day-old
   croissants, day-old skillet cornbread, rendered fat, frying fat, grated jicama.
4. **Not groceries at all** (3): flat skewers, metal skewers, oak or hickory wood. A supermarket
   does sell skewers, and wood chunks come from the same shop as a smoker; neither is food, and
   no existing aisle claims either. Three names is inside the 18-name budget.

## Constraints and things that would go wrong

- **Specificity is global.** Adding "sauce" anywhere would outrank nothing (one word, 5 chars)
  but adding "brown sauce" to `world` would beat `tins`' "tomato sauce"? No — equal word count,
  compared on characters. Every new multi-word pattern has to be checked against the named
  assertions in shopping.test.ts, not reasoned about in isolation.
- **`except` is checked before patterns** and is aisle-scoped: it removes a name from *that*
  aisle only, letting a less specific pattern elsewhere win.
- **Accents fold, so "đồ chua" tokenises as "d?" — not quite.** `fold()` strips combining marks
  (NFD), but `đ` is a distinct letter, not d + combining stroke, so "đồ" folds to "đô"→"đo" and
  the token is `o` plus a non-`[a-z0-9]` character dropped by `matchesStaple`. A pattern for it
  must be written the same way the recipe writes it and verified, not assumed.
- **Only two files may change.** `npx vitest run` currently fails three other tests that neither
  file can reach: `icons.test.ts` (51 operation verbs the icon map does not know) and two in
  `schedule.test.ts` (hardcoded longest-critical-path slugs, now outranked by `sauerkraut`).
  Both are collection-wide consequences of the fifteen writer tickets, and T-001-18
  ("read the whole shelf", `npm run verify` passes end to end) is the ticket that owns them.
- `src/generated/recipes.json` is gitignored and rebuilt by `npm run recipes`; it must be
  regenerated before any measurement, and it is never committed.
