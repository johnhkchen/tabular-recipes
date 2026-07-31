# T-001-15 — Structure

The blueprint: 24 new files under `recipes/**`, nothing else. No file is modified, none deleted,
no `src/` change. One new folder, `recipes/eggs/`.

Notation per entry: **slug** · folder · `counters:` · rows × cols the table should come out as ·
the operation chain. "n → n+1" means step n+1 carries `@&(~1)…{}` back to step n; a chain of
depth *d* gives `colCount = d + 1`, and the checker needs ≥ 3, so every chain here is ≥ 2 deep.

---

## A. Breakfast — the empty section

### 1. `recipes/fried-and-crispy/home-fries.cook`
Diner · 4 servings · ~6 × 4 · `aka: homefries, country fries, cottage fries, breakfast potatoes,
diner potatoes`
1. par-boil the potatoes (potatoes, salt) → 2. brown in bacon fat (fat, the drained potatoes) →
3. add onion and pepper, keep browning → 4. season (paprika, salt, pepper).
`pairs-with: homemade-ketchup`. Timers: `~simmer{10%min}`, `~fry{8%min}`, `~fry{6%min}`.
Canonical: boiled first, cut after, browned undisturbed.

### 2. `recipes/fried-and-crispy/hash-browns.cook`
Diner · 4 servings · ~4 × 3 · `aka: hashbrowns, shredded hash browns, potato hash browns`
1. shred and rinse (potatoes, cold water) → 2. wring dry in a towel → 3. press into hot fat and
fry both sides (clarified butter, salt, pepper). Timers: `~soak{5%min}`, `~fry{6%min}`,
`~fry{4%min}`. The wring is its own step because it is the dish.

### 3. `recipes/sauces-and-gravies/creamed-chipped-beef.cook`
Diner · 4 servings · ~6 × 4 · `aka: chipped beef on toast, S.O.S., shit on a shingle, creamed
dried beef, chipped beef gravy, frizzled beef, cream chipped beef`
1. frizzle the beef in butter → 2. cook the roux (flour) → 3. whisk in milk, simmer →
4. season (black pepper, nutmeg, Worcestershire). Timers: `~fry{3%min}`, `~simmer{6%min}`.
Rinsing the dried beef is in the prose, not a step: it is the only seasoning control the dish
has.

### 4. `recipes/breads/buttermilk-biscuits.cook`
Diner, Meat and Three · 8 servings · ~7 × 4 · `aka: biscuits, buttermilk biscuit, southern
biscuits, baking powder biscuits, split biscuits`
1. whisk the dry (flour, baking powder, baking soda, salt) → 2. cut in cold butter →
3. stir in buttermilk to a shaggy dough → 4. laminate by folding, cut, bake.
`pairs-with: sausage-gravy`. Timers: `~bake{14%min}`. Folded, not kneaded; cutter pressed
straight down and not twisted, said in prose.

### 5. `recipes/fried-and-crispy/corned-beef-hash.cook`
Diner · 4 servings · ~6 × 4 · `aka: hash, red flannel hash (with beet), diner hash`
1. par-boil potato → 2. sweat onion in fat → 3. fold in the corned beef and potato →
4. press flat and leave it alone until a crust forms. Timers: `~simmer{8%min}`, `~fry{5%min}`,
`~fry{8%min}`. `pairs-with: corned-beef` **only if that file is on disk at commit time**.

### 6. `recipes/flatbreads-and-pancakes/french-toast.cook`
Diner · 4 servings · ~6 × 3 · `aka: eggy bread, pain perdu, french toast`
1. whisk the custard (eggs, milk, sugar, vanilla, cinnamon, salt) → 2. soak the bread →
3. griddle both sides in butter. Timers: `~soak{2%min}`, `~fry{3%min}`, `~fry{2%min}`.
Day-old thick-cut bread, stated in the ingredient note.

### 7. `recipes/fried-and-crispy/scrapple.cook`
Diner · 12 servings · ~8 × 5 · `aka: pon haus, pannhaas, panhaas, panhoss, Philadelphia
scrapple`
1. simmer the pork with aromatics → 2. shred and return to the strained broth → 3. rain in
cornmeal and buckwheat, cook to a thick mush → 4. season (sage, thyme, savoury, pepper) and set
in a loaf pan overnight → 5. slice thin and fry hard. Timers: `~simmer{2%hr}`, `~simmer{25%min}`,
`~chill{8%hr}`, `~fry{10%min}`. No flour on the slice — in prose.

### 8. `recipes/fried-and-crispy/breakfast-sausage-patties.cook`
Diner · 8 servings · ~7 × 4 · `aka: sausage patties, breakfast sausage, country sausage,
sage sausage`
1. mix the cure/seasoning (sage, thyme, salt, pepper, red pepper, brown sugar, nutmeg) →
2. work into the ground pork just until tacky → 3. rest cold → 4. shape and fry.
`pairs-with: buttermilk-pancakes`. Timers: `~chill{1%hr}`, `~fry{6%min}`. Patties dimpled and
shaped a size larger than the bun because they shrink — prose.

### 9. `recipes/sandwiches-and-rolls/pork-roll-egg-and-cheese.cook`
Diner · 2 servings · ~6 × 4 · `aka: Taylor ham egg and cheese, taylor ham egg and cheese, pork
roll egg and cheese, SPK, taylor ham, pork roll`
1. notch and griddle the pork roll slices → 2. fry the eggs alongside → 3. melt cheese onto the
pork → 4. build on the toasted roll (kaiser roll, salt, pepper, ketchup).
Timers: `~fry{3%min}`, `~fry{2%min}`, `~toast{2%min}`. The four notches are step 1's whole
point; SPK is written out in prose.

### 10. `recipes/eggs/eggs-benedict.cook` *(new folder)*
Diner · 2 servings · ~7 × 4 · `>> category: Eggs` · `aka: benedict, eggs benny, eggs benedictine`
1. crisp the Canadian bacon → 2. toast and butter the muffin halves → 3. poach the eggs in
vinegared water → 4. build and sauce (`hollandaise` as an ingredient, chives).
`pairs-with: hollandaise, english-muffins`. Timers: `~fry{2%min}`, `~toast{2%min}`,
`~poach{3%min}`.

### 11. `recipes/eggs/western-omelette.cook` *(new folder)*
Diner · 1 serving · ~7 × 4 · `>> category: Eggs` · `aka: denver omelette, western omelet,
denver omelet, western omelette`
1. sweat the ham, onion and green pepper → 2. beat the eggs with water and salt → 3. set the
eggs in butter, stirring then still → 4. fill and fold, off the heat.
Timers: `~fry{3%min}`, `~fry{2%min}`. Diner-style: filling cooked first and folded in, not a
French rolled omelette — stated.

---

## B. The blue plate and the case

### 12. `recipes/vegetables-and-sides/mashed-potatoes.cook`
Diner, Meat and Three · 6 servings · ~6 × 4 · `>> category: Vegetables & Sides` ·
`aka: mashed potato, mash, whipped potatoes, smashed potatoes`
1. boil the potatoes from cold, salted → 2. drain and dry them in the empty pan → 3. rice and
fold in warm butter → 4. loosen with hot milk, season.
`pairs-with: turkey-pan-gravy, pot-roast`. Timers: `~simmer{20%min}`, `~drain{2%min}`.
Butter before milk, warm dairy, no food processor — prose.

### 13. `recipes/custards-and-puddings/apple-pie.cook`
Diner, Bakery · 8 servings · ~8 × 4 · `>> category: Custards & Puddings` · `aka: apple pie,
double crust apple pie, deep dish apple pie`
1. macerate the sliced apples with sugar, spice and lemon → 2. reduce the drained juice to a
syrup → 3. toss the apples back with the syrup and starch → 4. fill the `all-butter-pie-crust`
shell, lid it, vent, bake hot then moderate.
`pairs-with: all-butter-pie-crust, french-vanilla-ice-cream`. Timers: `~macerate{45%min}`,
`~simmer{5%min}`, `~bake{20%min}`, `~bake{45%min}`, `~cool{4%hr}`. Two apple varieties; the
juice reduction is why the top crust does not float.

### 14. `recipes/noodles/tuna-noodle-casserole.cook`
Diner · 6 servings · ~9 × 4 · `aka: tuna casserole, tuna bake, tuna noodle bake`
1. boil the egg noodles short of done → 2. make the sauce (butter, flour, milk, stock, cheddar,
mustard, pepper) → 3. fold in tuna, peas, onion and the noodles → 4. top with buttered crumbs
and bake. Timers: `~boil{6%min}`, `~simmer{5%min}`, `~bake{25%min}`.

---

## C. The sandwich page

All in `recipes/sandwiches-and-rolls/`.

### 15. `smash-burger.cook`
Diner · 2 servings · ~7 × 4 · `aka: cheeseburger, hamburger, diner burger, smashburger,
smashed burger, single with cheese`
1. toast the buns in butter → 2. ball the beef, no seasoning in the mix → 3. smash on the hot
surface, season the top, flip once, cheese on → 4. dress and close (onion, pickle, sauce).
Timers: `~toast{1%min}`, `~sear{2%min}`, `~sear{1%min}`. 80/20 chuck, 30-second smash window.

### 16. `patty-melt.cook`
Diner · 2 servings · ~7 × 5 · `aka: patty melt, patty melt sandwich`
1. cook the onions down slowly → 2. griddle the thin patties → 3. build on rye with swiss →
4. griddle the whole sandwich in butter, both sides. Timers: `~fry{35%min}`, `~sear{4%min}`,
`~fry{6%min}`. Rye, swiss, no lettuce — the three things that make it not a burger.

### 17. `club-sandwich.cook`
Diner, Deli · 2 servings · ~8 × 4 · `aka: club, clubhouse sandwich, triple decker, turkey club`
1. fry the bacon → 2. toast three slices per sandwich → 3. spread and layer the two decks →
4. skewer the quarters and cut corner to corner. Timers: `~fry{8%min}`, `~toast{3%min}`.
Three slices, two decks, four picks, cut on both diagonals.

### 18. `grilled-cheese.cook`
Diner, Deli · 2 servings · ~5 × 3 · `aka: grilled cheese, toasted cheese, cheese toastie,
grilled cheese sandwich`
1. butter the outsides of the bread → 2. fill with two cheeses → 3. griddle low and slow under
a weight, both sides. Timers: `~fry{4%min}`, `~fry{3%min}`. Low heat is the method; mayonnaise
on the outside is named as the shortcut it is and not taken.

### 19. `blt.cook`
Diner · 2 servings · ~6 × 4 · `aka: BLT, bacon lettuce and tomato, bacon lettuce tomato
sandwich`
1. lay the bacon in a cold pan and render it flat → 2. toast the bread → 3. mayonnaise both
faces → 4. build (tomato salted, lettuce, pepper). Timers: `~fry{10%min}`, `~toast{2%min}`.
Cold pan, salted tomato, mayonnaise on both faces so the tomato does not wet the toast.

### 20. `tuna-melt.cook`
Diner, Deli · 2 servings · ~8 × 4 · `aka: tuna melt, tuna fish melt, open tuna melt`
1. mix the tuna salad (tuna, mayonnaise, celery, onion, lemon, pepper) → 2. mound it on the
bread with cheese over → 3. griddle in butter, lid on, until the cheese runs.
Timers: `~fry{4%min}`, `~fry{3%min}`. Self-contained salad rather than a `pairs-with` to a
slug another ticket has not written yet (design §6).

---

## D. The fryer and the fountain

### 21. `recipes/fried-and-crispy/french-fries.cook`
Diner, Meat and Three · 4 servings · ~5 × 5 · `aka: fries, chips, steak fries, pommes frites,
pommes frites`
1. cut and soak the potatoes → 2. blanch in 325°F oil → 3. rest and cool → 4. fry again at
375°F → 5. salt the moment they come out. `pairs-with: homemade-ketchup`.
Timers: `~soak{30%min}`, `~fry{6%min}`, `~rest{30%min}`, `~fry{3%min}`.

### 22. `recipes/fried-and-crispy/onion-rings.cook`
Diner · 4 servings · ~8 × 4 · `aka: onion rings, beer battered onion rings, fried onion rings`
1. separate the rings and soak in buttermilk → 2. whisk the batter (flour, cornstarch, baking
powder, salt, paprika, beer) → 3. dip and fry at 365°F → 4. drain and salt.
Timers: `~soak{30%min}`, `~fry{3%min}`.

### 23. `recipes/drinks/milkshake.cook`
Diner · 2 servings · ~4 × 3 · `aka: milk shake, thick shake, malted, malt, frappe`
1. soften the ice cream → 2. blend with milk and syrup → 3. add malt powder and blend short.
Timers: `~stand{5%min}`, `~whip{20%sec}`. `pairs-with: french-vanilla-ice-cream`.
Ratio stated: a scoop count and a milk volume that make a shake a spoon can stand in.

### 24. `recipes/drinks/egg-cream.cook`
Diner · 1 serving · ~3 × 3 · `aka: egg cream, chocolate egg cream, Brooklyn egg cream, U-bet
egg cream`
1. stir syrup and cold milk in a tall glass → 2. spray seltzer hard off the back of a spoon →
3. stir the bottom only, leaving the head. Timers: none.
Contains no egg and no cream; the head is the dish.

---

## E. Components the case leans on

### 25. `recipes/toppings-and-pickles/whipped-cream.cook`
Diner, Bakery · 8 servings · ~4 × 3 · `aka: whipped cream, chantilly, creme chantilly, creme
chantilly, sweetened whipped cream`
1. chill the bowl and beater → 2. whip the cream to soft peaks → 3. rain in sugar and vanilla,
whip to medium. Timers: `~chill{15%min}`, `~whip{3%min}`, `~whip{1%min}`.

### 26. `recipes/sauces-and-gravies/hot-fudge.cook`
Diner · 8 servings · ~6 × 4 · `aka: hot fudge, hot fudge sauce, fudge sauce, sundae sauce`
1. bring cream, sugar, corn syrup and cocoa to a simmer → 2. melt chocolate and butter into it →
3. off the heat, vanilla and salt. `pairs-with: french-vanilla-ice-cream`.
Timers: `~simmer{4%min}`, `~stir{2%min}`.

> Entries are numbered 1–26 for reference; two of them (25, 26) are the components, so the file
> count is 24 recipes plus those two = **26 files**. The design's "24" counted the menu lines;
> the components are what the menu lines are made of and are committed with them.

---

## Ordering

Files are independent — no file imports another — so the only ordering that matters is
verification cost. Written and committed in seven units, each a section of the counter that
stands up on its own (see `plan.md`): breakfast potatoes → the gravy and the biscuit → the
griddle and the meats → the eggs → the plate and the case → the sandwich page → the fryer and
the fountain.

`recipes/eggs/` is created by the first file written into it; no other change is needed for a
new folder, because `findRecipes()` globs `recipes/*/*.cook` and `category` is stated in the
file.

## Not changed

- `src/data/counters.json` — the Diner sections belong to T-001-17. New recipes sit at the
  counter in the data and are printed when that ticket runs.
- `recipes/**` files owned by other tickets — `country-fried-steak`, `cream-gravy`, `meatloaf`,
  `tuna-salad`, `corned-beef`. Adding `Diner` to their `counters:` is recorded for **T-001-18**
  in `progress.md` and `review.md`.
- `scripts/**`, `src/**`, `docs/gaps/**`.
