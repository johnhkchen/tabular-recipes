# T-001-07 — Structure

Eighteen files created, none modified, none deleted. Every path is under `recipes/`.

Common shape for all eighteen (from Design §8): metadata block with `title`, `category`, `tags`,
`counters`, `aka`, `servings`, `time`, and a `>> step.N:` override for every step; four to six
operations; one final step; every timer named; metric beside imperial in a note.

Notation below: `1 → 3` means step 3 carries `@&(~1)…{}`. Every tree ends in exactly one root.

---

## `recipes/dumplings-and-rolls/` — seven files

The folder holds `crab-rangoon` and `egg-rolls` today. Category string: **Dumplings & Rolls**.

### 1. `har-gow.cook` — gap 1
- counters: `Dim Sum Counter` · servings 24 pieces (4)
- aka: `har gao, ha gow, haa gaau, xia jiao, 蝦餃, shrimp dumpling, crystal shrimp dumpling`
- tags: `shrimp, dumpling, chinese, steamed, wheat starch`
- steps: 1 dough (wheat starch + tapioca starch + boiling water, knead hot) · 2 filling (shrimp,
  pork fat, bamboo shoot, seasoning, chilled) · 3 roll rounds and pleat, `1 → 3`, `2 → 3` ·
  4 steam 6 min, `3 → 4`
- the sentence: boiling water is what gelatinises the wheat starch; warm water gives a dough that
  cracks and steams opaque.

### 2. `siu-mai.cook` — gap 2
- counters: `Dim Sum Counter` · servings 24 pieces (4)
- aka: `shu mai, shumai, siu maai, shao mai, siomai, 燒賣, pork and shrimp dumpling`
- steps: 1 soak dried shiitake · 2 filling stirred one direction until sticky, chilled, `1 → 2` ·
  3 cup the wrapper and fill, `2 → 3` · 4 steam 8 min, `3 → 4`
- bought thin yellow wrappers, by decision; the roe or a pea dot goes on before the steam.

### 3. `char-siu-bao.cook` — gap 3
- counters: `Dim Sum Counter` · servings 12 buns
- aka: `cha siu bao, chāshāo bāo, 叉燒包, BBQ pork bun, steamed pork bun, cha siu baau`
- steps: 1 bun dough (low-gluten flour, sugar, yeast, baking powder), rise 90 min · 2 gravy
  (oyster/hoisin/dark soy thickened with a cornstarch slurry), cooled · 3 fold diced char siu into
  the gravy, `2 → 3` · 4 divide, wrap, prove 30 min, `1 → 4`, `3 → 4` · 5 steam 12 min, `4 → 5`
- steamed, not baked. Baking powder alongside yeast is what splits the top white.
- names `char siu` as an ingredient with a note pointing at the existing recipe; `pairs-with:
  char-siu`.

### 4. `xiao-long-bao.cook` — gap 10
- counters: `Dim Sum Counter` · servings 24 pieces (4)
- aka: `XLB, 小籠包, xiaolongbao, soup dumplings, Shanghai soup dumplings, tang bao`
- steps: 1 aspic (pork skin and chicken wing simmered 2 hr, strained, chilled 4 hr, diced) ·
  2 hot-water dough, rested 30 min · 3 filling with the diced aspic folded through, `1 → 3` ·
  4 roll thin-edged rounds and pleat, `2 → 4`, `3 → 4` · 5 steam 8 min, `4 → 5`
- the aspic is the dish. Without it this is a pork dumpling with a fancy name.

### 5. `cheung-fun.cook` — gap 7
- counters: `Dim Sum Counter` · servings 4
- aka: `cheong fun, chee cheong fun, chang fen, 腸粉, rice noodle roll, rice crepe roll`
- steps: 1 batter (rice flour, wheat starch, tapioca starch, oil, water), rest 30 min · 2 sweetened
  soy (light soy, dark soy, rock sugar, water, simmered) · 3 steam a thin sheet on an oiled tray
  4 min, scatter shrimp on, roll, `1 → 3` · 4 pour the soy over, `2 → 4`, `3 → 4`
- the tray must be oiled cold and the sheet rolled while hot, or it tears.

### 6. `wu-gok.cook` — gap 12
- counters: `Dim Sum Counter` · servings 12 pieces
- aka: `woo gok, 炸芋角, taro dumpling, deep fried taro puff, taro puff, wu kok`
- steps: 1 steam and mash taro 25 min · 2 beat in wheat starch paste and lard, chill 1 hr,
  `1 → 2` · 3 pork filling, cooled · 4 shell the filling in the taro dough, `2 → 4`, `3 → 4` ·
  5 deep-fry 320°F (160°C) 4 min, `4 → 5`
- the lace comes from a *moderate* fryer: too hot and the shell seals smooth.

### 7. `ham-sui-gok.cook` — gap 12
- counters: `Dim Sum Counter` · servings 16 pieces
- aka: `hom sui gok, haam seui gok, 鹹水角, fried pork dumpling, football dumpling, jian dui gok`
- steps: 1 pork and dried shrimp filling, cooled · 2 glutinous dough (glutinous rice flour, wheat
  starch scalded with boiling water, sugar, lard), rest 20 min · 3 shape footballs around the
  filling, `1 → 3`, `2 → 3` · 4 fry 300°F (150°C) 6 min, `3 → 4`
- sweet outside, salty inside. A cool fryer taken up slowly is what blisters it.

### 8. `sesame-balls.cook` — gap 12
- counters: `Dim Sum Counter` · servings 12 pieces
- aka: `jin deui, jian dui, zin deoi, 煎堆, sesame ball, deep fried sesame ball, matuan`
- steps: 1 dough (glutinous rice flour, brown sugar syrup), rest 20 min · 2 wrap red bean paste
  balls, `1 → 2` · 3 roll in sesame seeds, `2 → 3` · 4 fry 300→340°F 12 min, pressing, `3 → 4`
- names `red bean paste` as an ingredient (the file exists); `pairs-with: red-bean-paste`.
- the ball is pressed against the pan wall as it fries; that is what makes it puff hollow.

---

## `recipes/stews-and-braises/` — four files

Category string: **Stews & Braises**. Joins `char-siu.cook` and `red-braised-pork-belly.cook`.

### 9. `siu-yuk.cook` — gap 6
- counters: `Dim Sum Counter` · servings 6
- aka: `siu yook, sio bak, 燒肉, roast pork belly, crispy skin pork, crispy pork belly`
- steps: 1 blanch the belly 5 min, dry · 2 season the meat side only, `1 → 2` · 3 prick the skin,
  salt it, air-dry uncovered in the fridge 12 hr, `2 → 3` · 4 roast 325°F (160°C) 1 hr, `3 → 4` ·
  5 blast 465°F (240°C) 25 min until the skin blisters, rest, chop, `4 → 5`
- the dry fridge night is the whole recipe; a wet skin steams and stays leather.

### 10. `soy-sauce-chicken.cook` — gap 6
- counters: `Dim Sum Counter` · servings 4
- aka: `see yao gai, si yau gai, 豉油雞, soya chicken, soy sauce chicken, lou sui gai`
- steps: 1 build the *lou sui* (light and dark soy, rock sugar, Shaoxing, star anise, cassia,
  ginger, scallion), simmer 20 min · 2 poach the bird 35 min off the boil, turning, `1 → 2` ·
  3 rest in the liquid 20 min, lift, brush with sesame oil, chop, `2 → 3`
- **footer row** (no ingredients, no refs): what a master stock is, that this one is a first
  pour, and how to keep it.

### 11. `white-cut-chicken.cook` — gap 6
- counters: `Dim Sum Counter` · servings 4
- aka: `bak chit gai, baak cit gai, 白切雞, poached chicken, plain chicken, white cooked chicken`
- steps: 1 bring aromatic water up, submerge the bird, poach 30 min off the boil · 2 ice bath 15
  min, `1 → 2` · 3 rest, rub with sesame oil, chop; serve with ginger-scallion oil, `2 → 3`
- `pairs-with: ginger-scallion-oil`. The ice bath sets the skin; that is the texture the dish is
  ordered for.

### 12. `chicken-feet.cook` — gap 11
- counters: `Dim Sum Counter` · servings 4
- aka: `fung zao, fung jao, 鳳爪, 豉汁蒸鳳爪, phoenix claws, braised chicken feet`
- steps: 1 clip the nails, blanch 5 min, dry · 2 fry 350°F (175°C) 5 min until the skin puffs,
  `1 → 2` · 3 soak in ice water 1 hr so the skin wrinkles, `2 → 3` · 4 braise in black bean,
  garlic, star anise 1 hr 30 min, `3 → 4` · 5 steam 20 min with the sauce, `4 → 5`
- the puff-then-soak is what makes them plump. Braising them straight gives skin that clings.

---

## `recipes/flatbreads-and-pancakes/` — two files

Category string: **Flatbreads & Pancakes**. Joins `scallion-pancakes.cook`.

### 13. `turnip-cake.cook` — gap 8
- counters: `Dim Sum Counter` · servings 12
- aka: `lo bak go, lo baak gou, luo bo gao, 蘿蔔糕, radish cake, daikon cake, fried radish cake`
- steps: 1 fry dried shrimp, lap cheong and shiitake · 2 simmer grated daikon 15 min, `1 → 2` ·
  3 stir the hot daikon into a rice-flour slurry, `2 → 3` · 4 steam the loaf 50 min, cool, chill
  overnight, `3 → 4` · 5 slice and pan-fry 8 min, `4 → 5`
- **footer row**: the shop sells it at both stages — a chilled loaf and a fried slice.
- no turnip in it; that is in the `aka` and the sentence.

### 14. `taro-cake.cook` — gap 8
- counters: `Dim Sum Counter` · servings 12
- aka: `wu tau go, wu tao gou, yu tou gao, 芋頭糕, taro cake, fried taro cake`
- steps: same five-step shape with taro cubes and bacon in place of daikon and lap cheong; the
  taro is fried, not simmered, so the cubes stay whole in the slice.

---

## `recipes/rice-beans-and-grains/` — one file

### 15. `lo-mai-gai.cook` — gap 9
- category **Rice, Beans & Grains** · counters: `Dim Sum Counter` · servings 4 parcels
- aka: `no mai gai, nor mai gai, lo mai kai, nuo mi ji, 糯米雞, sticky rice in lotus leaf`
- steps: 1 soak glutinous rice 4 hr, drain · 2 soak the lotus leaves in hot water 30 min ·
  3 marinate chicken thigh with shiitake and lap cheong · 4 stir the rice with oyster sauce and
  the mushroom liquor, `1 → 4` · 5 build the parcels and fold, `2 → 5`, `3 → 5`, `4 → 5` ·
  6 steam 1 hr 30 min, `5 → 6`
- the leaf is the flavour; a foil parcel is a different dish and the file says so.

---

## `recipes/sauces-and-gravies/` — one file

### 16. `ginger-scallion-oil.cook` — gap 6's other half
- category **Sauces & Gravies** · counters: `Dim Sum Counter` · servings 8
- aka: `ginger scallion sauce, ginger scallion oil, 薑蔥蓉, geung chung yau, jiang cong you`
- steps: 1 mince ginger and scallion into a bowl with salt · 2 smoke peanut oil and pour it over,
  `1 → 2` · 3 stir in sesame oil and rest 20 min, `2 → 3`
- three operations, seven rows — over the checker's floor of 3×3. `pairs-with: white-cut-chicken`.
- the oil has to be smoking; warm oil gives raw onion in a bowl.

---

## `recipes/noodles/` — one file

### 17. `beef-chow-fun.cook` — gap 13
- category **Noodles** · counters: `Dim Sum Counter` · servings 2
- aka: `gon chow ngau ho, gan chao niu he, 乾炒牛河, dry fried beef ho fun, beef chow fun, ho fun`
- steps: 1 velvet the beef in soy, cornstarch and oil 20 min · 2 stir the sauce · 3 sear the beef
  1 min, lift, `1 → 3` · 4 char the loosened ho fun 3 min, `3 → 4` · 5 toss with sauce, sprouts
  and scallion 1 min, `2 → 5`, `4 → 5`
- dry-fried means no cornstarch gravy at all. The noodles must be at room temperature and pulled
  apart by hand or they break.

---

## `recipes/custards-and-puddings/` — one file

### 18. `egg-custard-tart.cook` — gap 4
- category **Custards & Puddings** · counters: `Dim Sum Counter, Bakery` · servings 12
- aka: `dan tat, daan taat, 蛋撻, egg tart, egg custard tart, Hong Kong egg tart`
- steps: 1 dissolve sugar in hot water, cool · 2 whisk eggs and evaporated milk in, `1 → 2` ·
  3 strain twice, `2 → 3` · 4 fill the blind-baked shells and bake 350°F (175°C) 20 min, `3 → 4`
- names `sweet tart shell` as its ingredient (`recipes/pastry-and-doughs/sweet-tart-shell.cook`
  exists and names both counters); `pairs-with: sweet-tart-shell`.
- straining twice and baking below 350°F is what keeps the top smooth instead of blistered — the
  Hong Kong tart, not the Portuguese one.

---

## Ordering of the work

Folders are independent; the only ordering that matters is that the three files naming an
existing recipe as an ingredient (`char-siu-bao` → char siu, `sesame-balls` → red bean paste,
`egg-custard-tart` → sweet tart shell) are written after those files are confirmed present. They
are already present, so the order below is chosen for reviewability instead: the Four Heavenly
Kings first, so the counter's headline is checkable early.

1. Kings — `har-gow`, `siu-mai`, `char-siu-bao`, `egg-custard-tart`
2. The window — `siu-yuk`, `soy-sauce-chicken`, `white-cut-chicken`, `ginger-scallion-oil`
3. The steamer — `cheung-fun`, `turnip-cake`, `taro-cake`, `lo-mai-gai`, `xiao-long-bao`,
   `chicken-feet`
4. The fryer — `wu-gok`, `ham-sui-gok`, `sesame-balls`
5. The plate — `beef-chow-fun`

## Files deliberately not touched

`src/data/counters.json` (menu sections — T-001-17), `src/data/aisles.json` (shopping aisles —
T-001-17), `docs/gaps/dim-sum-counter.md` (a record of what was found, not a checklist to tick),
and every existing `.cook` file. No existing recipe needs this counter added to it: all eleven
that could already name it.
