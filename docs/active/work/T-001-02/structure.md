# T-001-02 — Structure

Fourteen new `.cook` files, two new folders, nothing else. Below: the file list, then each
file's merge tree, predicted size, and metadata. No file outside `recipes/` is created,
modified or deleted.

## Files

**Created — two new folders:**

```
recipes/sandwiches-and-rolls/     (category: Sandwiches & Rolls)
recipes/drinks/                   (category: Drinks)
```

Neither needs registering: `scripts/find-recipes.mjs` walks `recipes/` recursively and the
folder names the category. No counter claims either as a fallback, so every file in them
carries an explicit `>> counters:` line — which all fourteen do anyway.

**Created — fourteen files:**

| # | Path | Rows × cols (predicted) |
| --: | --- | --- |
| 1 | `recipes/breads/banh-mi-khong.cook` | 10 × 6 |
| 2 | `recipes/dressings-and-dips/nuoc-cham.cook` | 7 × 5 |
| 3 | `recipes/soups/pho-broth.cook` | 15 × 6 |
| 4 | `recipes/soups/pho-bo.cook` | 14 × 6 |
| 5 | `recipes/soups/pho-ga.cook` | 15 × 6 |
| 6 | `recipes/stews-and-braises/cha-lua.cook` | 10 × 6 |
| 7 | `recipes/sandwiches-and-rolls/banh-mi-dac-biet.cook` | 11 × 4 |
| 8 | `recipes/sandwiches-and-rolls/banh-mi-thit-nuong.cook` | 15 × 6 |
| 9 | `recipes/rice-beans-and-grains/bun-thit-nuong.cook` | 15 × 6 |
| 10 | `recipes/sandwiches-and-rolls/cha-gio.cook` | 15 × 6 |
| 11 | `recipes/sandwiches-and-rolls/goi-cuon.cook` | 15 × 6 |
| 12 | `recipes/rice-beans-and-grains/com-tam.cook` | 15 × 6 |
| 13 | `recipes/drinks/ca-phe-sua-da.cook` | 5 × 6 |
| 14 | `recipes/stews-and-braises/xiu-mai.cook` | 16 × 6 |

Every one inside the README's 5–16 rows and 3–6 operations. `colCount = operations + 1`.

**Modified / deleted:** none. `src/data/counters.json`, `src/data/aisles.json` and
`docs/gaps/` are other tickets'.

---

## Common shape

Every file carries, in this order:

```
>> title:      the diacritic form, title case
>> category:   the folder's display name
>> tags:       main ingredient, cuisine, method, meal — lower case, comma-separated
>> counters:   Phở & Bánh Mì            (alone, on all fourteen)
>> aka:        diacritic form, undiacriticked form, English words, board code / number
>> pairs-with: slugs that exist by parse time
>> servings:
>> time:       the author's claim, ≈ the summed critical path
>> step.N:     wherever the derived label would read as a fragment
```

Rules held on every file: first step may start a branch; every later step names what it
consumes; no preparation is consumed twice; all branches merge into the final step; **every
timer named**, chosen from `src/lib/time.ts`'s classified vocabulary.

---

## The trees

Notation: `n. verb → leaves` with `[~k]` meaning "consumes the step k back".

### 1 · `banh-mi-khong` — Breads

```
1. stir the sponge      → bread flour, cool water, instant yeast        ~ferment{2%hr}
2. mix the dough  [~1]  → bread flour, rice flour, warm water, sugar,
                          fine sea salt, instant yeast, ascorbic acid
3. knead, rise    [~1]                                    ~knead{10%min} ~rise{1%hr}
4. divide, shape, proof [~1]                                     ~proof{45%min}
5. slash, bake with steam [~1]                                    ~bake{20%min}
```

10 rows × 6 cols. `servings: 6` rolls, `time: 4 hr 30 min`.
The rice flour and the low-protein blend are the point: this is not the site's `baguette`, and
the prose says so in one line. `pairs-with: pork-liver-pate, do-chua`.

### 2 · `nuoc-cham` — Dressings & Dips

```
1. dissolve            → granulated sugar, warm water
2. pound to a paste    → garlic, Thai chiles
3. stir in the sauce and lime [~2 = step 1] → fish sauce, lime juice
4. stir in the chile [~2 = step 2] and [~1 = step 3] → shredded carrot  ~stand{10%min}
```

7 rows × 5 cols. `servings: 8` (≈1½ cups), `time: 15 min`.
The ratio is written out in prose — 1 sugar : 1 fish sauce : 1 lime : 4 water — because the
gap doc asks for a ratio, not just quantities. `pairs-with: cha-gio, goi-cuon, bun-thit-nuong`.

### 3 · `pho-broth` — Soups

```
1. parboil, rinse   → beef marrow bones, oxtail, cold water     ~parboil{10%min}
2. char over a flame → yellow onions, fresh ginger              ~char{10%min}
3. toast, tie a sachet → star anise, cinnamon stick, whole cloves,
                         coriander seed, black cardamom         ~toast{3%min}
4. simmer, skimming [~3][~2][~1] → beef brisket, water          ~simmer{6%hr}
5. season and strain [~1] → fish sauce, rock sugar, kosher salt
```

15 rows × 6 cols. `servings: 8` (≈4 qt), `time: 6 hr 30 min`.
A three-way merge at step 4 — the pattern `chicken-noodle-soup` uses at two. The `~simmer{6%hr}`
is the unattended timer the gap doc asks for by name. `pairs-with: pho-bo`.

### 4 · `pho-bo` — Soups

```
1. soak, drain      → dried bánh phở noodles, warm water         ~soak{30%min}
2. firm, shave paper-thin → beef eye of round                    ~freeze{20%min}
3. boil, drain, divide [~2 = step 1] → water                     ~boil{20%sec}
4. pile the bowl, ladle over [~1][~2 = step 2] → cooked brisket, yellow onion,
                                                 scallions, boiling phở broth
5. serve with the plate [~1] → Thai basil, bean sprouts, lime, bird chiles,
                               hoisin sauce, sriracha
```

14 rows × 6 cols. `servings: 4`, `time: 45 min`.
Consumes `phở broth` as an ingredient and pairs to it — the split the gap doc prescribes. The
beef-cut ladder stays out of the rows and goes in one prose line plus `aka`.

### 5 · `pho-ga` — Soups

```
1. char             → yellow onion, fresh ginger                 ~char{8%min}
2. poach, lift the bird [~1] → whole chicken, water, kosher salt, star anise  ~poach{45%min}
3. season, simmer, shred [~1] → fish sauce, rock sugar           ~simmer{20%min}
4. boil, drain, divide → dried bánh phở noodles, water           ~boil{5%min}
5. ladle over [~2 = step 3][~1 = step 4] → scallions, cilantro, yellow onion,
                                           lime, bird chiles
```

15 rows × 6 cols. `servings: 4`, `time: 1 hr 30 min`.
One table, not two, and the file says why in a line: the bird is both the broth and the meat,
so there is no moment at which a phở gà broth exists on its own. Step 3 keeps the shredded
meat *inside* the pot preparation rather than branching it out — branching it would be a split,
which the format refuses.

### 6 · `cha-lua` — Stews & Braises

```
1. freeze firm      → lean pork loin, pork fatback                ~freeze{45%min}
2. beat to a smooth paste [~1] → fish sauce, granulated sugar, baking powder,
                                 potato starch, white pepper, ice water   ~beat{4%min}
3. wrap and tie [~1] → banana leaves
4. poach to 165°F [~1] → water                                    ~poach{50%min}
5. chill before slicing [~1]                                      ~chill{8%hr}
```

10 rows × 6 cols. `servings: 12`, `time: 10 hr`.
The caveat the gap doc calls "the recipe's most useful line" is written in step 2's prose: the
paste has to stay below 50°F (10°C) or it breaks, and banana leaf is a nice-to-have that
parchment and foil substitute for. `pairs-with: banh-mi-dac-biet`.

### 7 · `banh-mi-dac-biet` — Sandwiches & Rolls *(new folder)*

```
1. crisp and split  → bánh mì rolls                               ~bake{4%min}
2. spread     [~1]  → unsalted butter, mayonnaise, pork liver pâté
3. layer, close, press [~1] → chả lụa, thịt nguội, đồ chua, cucumber,
                              cilantro, bird chiles, Maggi seasoning
```

11 rows × 4 cols. `servings: 4`, `time: 15 min`.
The short assembly D4 argues for: three operations — spread, layer, close — and every leaf
that has its own table is `pairs-with`-linked to it (`banh-mi-khong`, `pork-liver-pate`,
`do-chua`, `cha-lua`, `mayonnaise`). Two prose lines carry what the count cannot: that the
cold-cut set is whatever the shop's case holds that morning, and that the sandwich's
mayonnaise is yolk-heavier and looser than the Deli's `mayonnaise`.

### 8 · `banh-mi-thit-nuong` — Sandwiches & Rolls

```
1. pound to a paste → lemongrass, garlic, shallot
2. stir the marinade [~1] → granulated sugar, fish sauce, oyster sauce,
                            black pepper, vegetable oil
3. marinate chilled [~1] → sliced pork shoulder                   ~marinate{4%hr}
4. grill until lacquered [~1]                                     ~grill{8%min}
5. build the sandwich [~1] → split bánh mì rolls, mayonnaise, đồ chua,
                             cucumber, cilantro, bird chiles
```

15 rows × 6 cols. `servings: 4`, `time: 4 hr 45 min`.

### 9 · `bun-thit-nuong` — Rice, Beans & Grains

```
1. stir the marinade → lemongrass, garlic, granulated sugar, fish sauce,
                       vegetable oil
2. marinate    [~1]  → sliced pork shoulder                       ~marinate{2%hr}
3. grill       [~1]                                               ~grill{8%min}
4. boil, rinse cold  → rice vermicelli, water                     ~boil{4%min}
5. bowl and dress [~1 = step 4][~2 = step 3] → lettuce, cucumber, mint,
                    đồ chua, roasted peanuts, fried shallots, nước chấm
```

15 rows × 6 cols. `servings: 4`, `time: 2 hr 45 min`.
Not a soup — the file's tags and prose both say so, because the gap doc notes bún is a printed
section of its own. Its marinade is the same lemongrass-and-sugar mix as #8 and #12; that is
deliberate repetition of a component across three different tables, not a duplicate dish.

### 10 · `cha-gio` — Sandwiches & Rolls

```
1. soak, drain, chop → dried wood ear mushrooms, glass noodles, warm water  ~soak{20%min}
2. mix the filling [~1] → ground pork, grated carrot, grated jicama,
                          garlic, egg, fish sauce, black pepper
3. soften and roll [~1] → rice paper wrappers, warm water
4. fry twice   [~1]  → vegetable oil                        ~fry{8%min} ~fry{3%min}
5. drain and serve [~1] → lettuce, mint, nước chấm
```

15 rows × 6 cols. `servings: 6` (20 rolls), `time: 1 hr 15 min`.
The double fry is the canonical method, not a flourish — one pass cooks the filling, the second
blisters the skin. Prose carries the doc's note that "spring roll" means this one at some shops
and `goi-cuon` at others; both files carry "spring rolls" in `aka` for that reason.

### 11 · `goi-cuon` — Sandwiches & Rolls

```
1. poach, cool, slice → pork belly, shrimp, water, kosher salt    ~poach{12%min}
2. boil, rinse cold   → rice vermicelli, water                    ~boil{4%min}
3. soften and roll [~1 = step 2][~2 = step 1] → rice paper wrappers, warm water,
                                                lettuce, mint, garlic chives
4. stir the peanut sauce → hoisin sauce, peanut butter, water, roasted peanuts
5. serve [~2 = step 3][~1 = step 4]
```

15 rows × 6 cols. `servings: 4` (12 rolls), `time: 45 min`.
Step 5 is the merge that closes both branches — the format requires exactly one ending.

### 12 · `com-tam` — Rice, Beans & Grains

```
1. stir the marinade → lemongrass, garlic, granulated sugar, fish sauce,
                       dark soy sauce, vegetable oil
2. marinate    [~1]  → bone-in pork chops                         ~marinate{4%hr}
3. rinse, steam, rest → broken rice, water              ~steam{20%min} ~rest{10%min}
4. grill, basting [~2 = step 2]                                   ~grill{10%min}
5. plate [~2 = step 3][~1 = step 4] → scallion oil, đồ chua, cucumber,
                                      tomato, nước chấm
```

15 rows × 6 cols. `servings: 4`, `time: 4 hr 45 min`.
Broken rice is the dish's whole identity; the prose says what to do when only whole grains are
available, and why the result is a different plate.

### 13 · `ca-phe-sua-da` — Drinks *(new folder)*

```
1. spoon the milk, set the phin → sweetened condensed milk
2. load and level [~1] → Vietnamese dark roast coffee
3. bloom      [~1]  → boiling water                               ~bloom{30%sec}
4. let it drip [~1] → boiling water                               ~steep{4%min}
5. stir and pour over ice [~1] → ice
```

5 rows × 6 cols — the thinnest table here, and honestly so: a phin has five moves and four
things in it. Two rows are boiling water because the bloom and the fill are two separate
pours, which is the part people get wrong. `servings: 1`, `time: 10 min`.
The site's first drink.

### 14 · `xiu-mai` — Stews & Braises

```
1. mix and roll 12 balls → ground pork, grated jicama, shallot, garlic,
                           fish sauce, granulated sugar, cornstarch
2. fry, stir in the paste → yellow onion, annatto oil, tomato paste   ~fry{4%min}
3. simmer thin and sweet [~1] → grated tomatoes, chicken stock, fish sauce ~simmer{10%min}
4. poach the meatballs [~3 = step 1][~1 = step 3]                 ~poach{20%min}
5. scatter and serve [~1] → scallions, cilantro, bánh mì rolls
```

16 rows × 6 cols. `servings: 4`, `time: 45 min`.
The sauce is deliberately thin — the gap doc's word is "spooned in wet so the bread soaks" —
and the prose says that a thick sauce is the usual mistake.

---

## Ordering

Only two orderings matter.

1. **`pairs-with` targets must exist by the time `npm run recipes` runs**, not when each file
   is written. `check-recipes.mjs` does not resolve pairings, so per-file checks are safe at
   any point; the full parse happens once, at the end.
2. **Components before the things that name them**, for the reader's sake and so a
   half-finished tree still makes sense: the bread and nước chấm first, then the boards.

Commit units, eight of them, grouped as menu sections rather than one per file:

| # | Unit | Files |
| --: | --- | --- |
| 1 | The two components everything else needs | `banh-mi-khong`, `nuoc-cham` |
| 2 | The phở board | `pho-broth`, `pho-bo`, `pho-ga` |
| 3 | The cold cut | `cha-lua` |
| 4 | The bánh mì board | `banh-mi-dac-biet`, `banh-mi-thit-nuong` |
| 5 | The appetiser rolls | `cha-gio`, `goi-cuon` |
| 6 | Bún and cơm | `bun-thit-nuong`, `com-tam` |
| 7 | The wet one | `xiu-mai` |
| 8 | The drink | `ca-phe-sua-da` |

Each through `lisa commit-ticket --ticket-id T-001-02 --message … --include <exact paths>`.
No ordinary `git add`, no `git commit`, nothing ticket-owned left staged or untracked.

## Interfaces this ticket exposes to others

- **T-001-17** gets fourteen recipes naming `Phở & Bánh Mì` and two new categories
  (`Sandwiches & Rolls`, `Drinks`) to shelve into menu sections and shopping aisles.
- **T-001-18** gets one recorded hand-off — whether `mayonnaise` should also name this
  counter — plus the `cha-lua`-in-`stews-and-braises` placement, flagged as the weakest of the
  fourteen.
