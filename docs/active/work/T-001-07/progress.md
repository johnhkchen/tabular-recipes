# T-001-07 — Progress

**Done.** Eighteen `.cook` files written, checked and committed through `lisa commit-ticket` in
seven units. Nothing outside `recipes/**` was written. The Dim Sum Counter now shelves **29
recipes, 20 of which name it and no other counter** (it started at 11 and 3).

## What landed, in order

| # | File | Gap | Commit |
| --- | --- | --- | --- |
| 1 | `recipes/dumplings-and-rolls/har-gow.cook` | 1 | `568497e` |
| 2 | `recipes/dumplings-and-rolls/siu-mai.cook` | 2 | `568497e`, relabelled `1902626`, `9abd17c` |
| 3 | `recipes/dumplings-and-rolls/char-siu-bao.cook` | 3 | `568497e`, `9abd17c` |
| 4 | `recipes/custards-and-puddings/egg-custard-tart.cook` | 4 | `568497e` |
| 5 | `recipes/stews-and-braises/siu-yuk.cook` | 6 | `0536b13` |
| 6 | `recipes/stews-and-braises/soy-sauce-chicken.cook` | 6 | `0536b13` |
| 7 | `recipes/stews-and-braises/white-cut-chicken.cook` | 6 | `0536b13`, relabelled `c5b49cd` |
| 8 | `recipes/sauces-and-gravies/ginger-scallion-oil.cook` | 6 | `0536b13` |
| 9 | `recipes/dumplings-and-rolls/cheung-fun.cook` | 7 | `0643bce` |
| 10 | `recipes/flatbreads-and-pancakes/turnip-cake.cook` | 8 | `0643bce` |
| 11 | `recipes/flatbreads-and-pancakes/taro-cake.cook` | 8 | `0643bce` |
| 12 | `recipes/rice-beans-and-grains/lo-mai-gai.cook` | 9 | `0643bce` |
| 13 | `recipes/dumplings-and-rolls/xiao-long-bao.cook` | 10 | `0643bce` |
| 14 | `recipes/stews-and-braises/chicken-feet.cook` | 11 | `0643bce` |
| 15 | `recipes/dumplings-and-rolls/wu-gok.cook` | 12 | `963cb8e` |
| 16 | `recipes/dumplings-and-rolls/ham-sui-gok.cook` | 12 | `963cb8e` |
| 17 | `recipes/dumplings-and-rolls/sesame-balls.cook` | 12 | `963cb8e` |
| 18 | `recipes/noodles/beef-chow-fun.cook` | 13 | `d77ad7c` |

Gap items **1 through 13 are complete**. Item 5 — char siu, the one the gap doc said to write
first — was already written by another ticket as `recipes/stews-and-braises/char-siu.cook`, and it
already names this counter; it was recorded rather than rewritten, and `char-siu-bao` consumes it.

Nothing was found that exists and merely needs this counter added to it, so there is no edit to
record for T-001-18. All eleven recipes that could already name Dim Sum Counter do.

## Gap items not written, each with its reason

- **14 — Gai lan with oyster sauce.** The dish is *blanched* greens under hot oyster sauce and
  oil. There is no vegetables folder in the collection and no plain plate of greens anywhere in
  it; writing it into `stir-fries/` would be exactly the "shortcut wearing its name" the
  acceptance criteria rule out. It wants a `recipes/vegetables/` folder opened by whichever
  ticket writes the first greens for any counter, not one file inventing a category on its way
  past.
- **15 — Wife cake (lo po beng).** Needs a candied winter melon paste that nothing on the site
  has, and it is a bakery-case item that `docs/gaps/bakery.md` will also want. Left for T-001-11,
  which can write it once for both counters.
- **16 — Youtiao.** A real gap and the best next file: alkaline dough, rested overnight,
  stretched and fried in pairs. It is a bread, it lands after this ticket's count was met, and it
  is the component two later gap items (cheung fun around a cruller, congee beside one) both
  point at. **Recommended first pick for whoever picks this list up.**
- **17 — Congee with century egg and pork, and fish congee.** Plain congee is written and shelved
  here. These are the same pot with a topping stirred in at the end, and written as separate files
  they would be three near-identical tables. The honest form is one congee with its toppings named
  — which is an edit to an existing file this ticket does not own.
- **18 — Dau fu fa, red bean soup, almond jelly.** The sweet end of the trolley. Mango pudding
  already stands there and `red-bean-paste` exists (red bean *soup* is a different preparation).
  Skipped for count, not for difficulty.
- **19 — Lotus paste bun and custard bun.** The steamed bun dough now exists, inside
  `char-siu-bao.cook`. Two sweet buns would repeat that dough twice more; the pair is worth
  writing when someone is ready to decide whether the dough becomes its own file.
- **20 — Two Choice / Three Choice.** On the gap doc's own "What it could not stock" list: you
  point at the glass. Nothing to draw.
- **21 — Hot tea, chrysanthemum or bo lei.** This one is structural rather than a matter of
  count: leaves and water steeped in a pot is *one* operation, and `scripts/check-recipes.mjs`
  refuses a file with fewer than three columns — "only one operation — nothing merges, so the
  table is a list". A tea cannot be a table here without being padded into something a tea is not.

## Deviations from the plan

1. **Eight commits, not five.** Three extra units were label and convention fixes found by
   verification: `1902626` (siu mai's opening verb), `9abd17c` (parchment, in siu mai and char siu
   bao) and `c5b49cd` (white cut chicken's ice bath, which the icon table was reading as *icing*).
   The plan expected to catch these before committing; they slipped through because the icon check
   was built after the first commit had already landed.

2. **A verb-coverage check was written that the plan did not name.** `src/lib/icons.test.ts`
   asserts that every word a recipe opens an operation with is in `VERB_ICONS`, and it tests the
   **bare verb**, not the sentence. Eight labels had to be rewritten to open with a mapped verb:
   `cup` → `press each wrapper into a cup`, `prick` → `salt the skin, prick it all over`,
   `blast` → `roast 465°F (240°C)`, `take the oil to smoking` → `heat the oil to smoking`,
   `build four parcels` → `spread the rice on the leaf`, `shell the filling` → `wrap the filling`,
   and two full-width rows that opened `A lou sui is kept…` and `Sold at both stages…` — headers
   and footers are read by that test too. Every rewrite kept the sentence's meaning; none changed
   a method. This ticket adds **zero** new fall-through verbs to a test that is already failing
   with 35 of them from elsewhere.

3. **Parchment is not an ingredient here.** Two files listed it with a quantity, which would have
   put "parchment" on a shopping list with no aisle. The collection's own convention — eleven
   files in `bars-and-brownies`, and `cha-lua` — writes it as plain prose inside the step.
   Corrected in `9abd17c`.

4. **`npm run recipes` could not be run to completion in the repository.** Three other tickets
   are writing to `recipes/` at the same time, and the build dies on the first `pairs-with` that
   points at a recipe not yet written — currently `recipes/dressings-and-dips/birista.cook` →
   `biryani`, from the Curry House ticket. This is not a failure of these eighteen files, and it
   was not left as an assumption: the whole collection was copied to a scratch directory, the
   thirteen in-flight pairings were dropped **in the copy only**, and the full build and test
   suite were run there. Result: `all 382 file(s) draw a table`, `parsed 382 recipe(s)`, and
   `3 failed test files | 530 tests passing`, with every failure traced away from this ticket in
   `review.md`.

## What is left for other tickets

- **`src/data/counters.json` (T-001-17).** All eighteen land in the counter's trailing "Also"
  section until the menu is sectioned. A layout that matches the board: *Out of the steamer* —
  har-gow, siu-mai, char-siu-bao, xiao-long-bao, cheung-fun, lo-mai-gai, chicken-feet;
  *Out of the fryer* — wu-gok, ham-sui-gok, sesame-balls, scallion-pancakes;
  *Off the griddle* — turnip-cake, taro-cake; *Roast meats in the glass* — char-siu, siu-yuk,
  soy-sauce-chicken, white-cut-chicken, red-braised-pork-belly; *Rice and noodle* —
  beef-chow-fun, egg-fried-rice, congee; *The bakery case at the till* — egg-custard-tart,
  chiffon-cake, sweet-tart-shell; *Sweets* — mango-pudding, red-bean-paste, lotus-seed-paste;
  *The table* — ginger-scallion-oil, chinese-five-spice-powder.
- **`src/data/aisles.json` (T-001-17).** Seven ingredient names are new to the collection with
  this ticket and have no aisle: `wheat starch`, `taro`, `lap cheong`, `dried lotus leaves`,
  `dried tangerine peel`, `red bean paste`, `blind-baked tart shells`. Two more —
  `char siu` and `bamboo shoots` — this ticket uses alongside other files.
