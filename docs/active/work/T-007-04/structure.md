# T-007-04 — Structure

Fourteen files created, none modified, none deleted. Every path is `recipes/<category>/<slug>.cook`
and nothing outside `recipes/**/*.cook` and this work directory is touched.

The blueprint below is the shape of each file: its tree, its operation count, its row count, and
the metadata that has to be exact because T-007-05 reads it.

---

## The tree grammar these files are written to

Verified against the parser (Research §4) and against a probe run through
`node scripts/check-recipes.mjs` before any of these were written:

- `@&(~N)thing{}` is the **only** edge. It counts back over *every* step, prose rows included.
- **A step may consume more than one branch.** A three-branch merge draws and tiles — probed with a
  four-step macaroni-soup skeleton, which came out `6 rows x 3 cols, ok`.
- **A step may not be consumed twice.** That is "splitting a preparation into two later steps" and
  the build refuses it. This is the constraint that shapes three files here: where the real method
  is *fry the chop, then build the sauce in the same pan, then put the chop back*, the pan cannot be
  an edge as well as the chop. The sauce is written as a fresh branch and the words "same pan" go in
  the operation label, where they cost nothing and print.
- **A prose row is a step with no ingredients**, and it must be the **first** step in the file, or
  every `~1` after it points at something that makes nothing.

## The fourteen files

### Macaroni, noodles and things in soup

**1. `recipes/soups/ham-macaroni-soup.cook`** — 湯通粉 / 火腿通粉

- title `Ham and Macaroni Soup` · category `Soups` · servings 2 · time 20 min
- `aka: fo teui tung fan, tong tung fan, 火腿通粉, 湯通粉, 餐肉通粉, ham and macaroni soup, ham macaroni soup, macaroni in soup, macaroni soup`
- `pairs-with: chicken-broth`
- 4 operations, ~9 rows. Three branches, one merge.
  1. boil the macaroni 8 min, drain — its own water
  2. simmer the stock with ham 5 min *(new branch)*
  3. fry the eggs 3 min *(new branch)*
  4. ladle broth over macaroni, egg alongside — consumes `~1`, `~2`, `~3`
- `slack: narrow` — the macaroni boiled in the broth clouds the bowl. This is the one real failure
  the gap page names for this dish and it is why the two pots exist.
- **Ham, not luncheon meat**, because 火腿 means ham. The luncheon-meat version is a different board
  row (餐肉通粉) and goes in `aka`.

**2. `recipes/noodles/luncheon-meat-and-egg-noodles.cook`** — 餐蛋麵 / 公仔麵

- title `Luncheon Meat and Egg Noodles` · category `Noodles` · servings 1 · time 15 min
- `aka: chaan daan min, gong jai min, 餐蛋麵, 公仔麵, spam and egg noodles, instant noodles with luncheon meat and egg, luncheon meat noodle soup`
- 4 operations, ~8 rows. Three branches, one merge — same shape as file 1.
- The packet is named as the ingredient: `@instant noodles{1%packet}`, note *the seasoning sachet is
  not used*. That note is the recipe's whole point and it costs one ingredient cell.
- `slack: narrow` — two minutes, not the four the packet says.

**3. `recipes/noodles/satay-beef-noodles.cook`** — 沙嗲牛肉麵

- title `Satay Beef Noodles` · category `Noodles` · servings 2 · time 30 min
- `aka: sa de ngau yuk min, 沙嗲牛肉麵, 沙爹牛肉麵, satay beef noodles, sate beef noodle soup, satay beef instant noodles`
- 5 operations, ~12 rows.
  1. toss the beef with soda and cornstarch, rest 20 min
  2. fry the beef 2 min, lift it out — `~1`
  3. loosen the satay sauce with stock, return the beef, simmer 3 min — `~1`
  4. boil the noodles 2 min *(new branch)*
  5. spoon the satay beef over the noodles — `~1`, `~2`
- Satay sauce is **bought** — a jar, and the work list says so. No component file (design D2b).

**4. `recipes/soups/hong-kong-borscht.cook`** — 羅宋湯

- title `Hong Kong Borscht` · category `Soups` · servings 6 · time 1 hr 30 min
- `aka: lo song tong, lo sung tong, 羅宋湯, 紅湯, Borsch Soup, Hong Kong borscht, Russian soup, red soup`
- `pairs-with: borscht` — pairings are made mutual at build, so the Ukrainian file gains the link
  without being edited.
- **Prose row, step 1** — the one line saying what it is not. Under the 120-char cap.
- 4 operations after it, ~15 rows.
  2. brown the beef shin 8 min
  3. sweat onion, celery and carrot into it 8 min — `~1`
  4. tomato, potato, cabbage, stock; simmer 1 hr — `~1`
  5. season — `~1`
- **No beetroot appears in any row.** That is the acceptance criterion and it is a property of the
  ingredient list, so it is checkable by grep.
- `slack: forgiving` — an hour longer only softens the cabbage.

### Rice plates

**5. `recipes/rice-beans-and-grains/baked-pork-chop-rice.cook`** — 焗豬扒飯

The ticket's most-operations file and the one whose split was argued in Design D1. **One file, five
operations**, so the ticket's own trigger for splitting never fires.

- title `Baked Pork Chop Rice` · category `Rice, Beans & Grains` · servings 2 · time 1 hr
- `aka: guk jyu paa faan, 焗豬扒飯, baked pork chop rice, baked pork chop over rice, Baked Pork Chop Over Spaghetti, pork chop rice`
- `pairs-with: egg-fried-rice, homemade-ketchup, pork-chop-in-tomato-sauce`
- 5 operations, ~15 rows. Three branches, one merge.
  1. season the chops, rest 20 min
  2. fry the chops 6 min — `~1`
  3. simmer the tomato sauce 8 min *(new branch)*
  4. fry the rice with egg 4 min *(new branch)*
  5. lay it up, cheese over, bake 425°F (220°C) 12 min — `~1`, `~2`, `~3`
- **Step 3 is where "the sauce several plates share" lives, and step 5 consumes it with `&`.** That
  is the criterion satisfied inside one file, which is the only place `&` works.
- `slack: narrow` — the chop is already cooked when it goes in; the bake is browning only.

**6. `recipes/rice-beans-and-grains/pork-chop-in-tomato-sauce.cook`** — 茄汁豬扒

- title `Pork Chop in Tomato Sauce` · category `Rice, Beans & Grains` · servings 2 · time 40 min
- `aka: ke jap jyu paa, 茄汁豬扒, pork chop in tomato sauce, tomato pork chop, pork chop with tomato sauce over rice`
- `pairs-with: baked-pork-chop-rice`
- 4 operations, ~14 rows.
  1. season the chops, rest 15 min
  2. fry the chops 6 min — `~1`
  3. same pan — simmer the sauce 8 min *(new branch; the pan is words, not an edge)*
  4. chops back into the sauce 2 min, over rice — `~1`, `~2`
- Rank 11 on the work list, above the baked plate, and the reason the baked plate is not two files.

**7. `recipes/stews-and-braises/curry-beef-brisket.cook`** — 咖喱牛腩(飯)

- title `Curry Beef Brisket` · category `Stews & Braises` · servings 4 · time 2 hr 30 min
- `aka: ga lei ngau naam, 咖喱牛腩, 咖喱牛腩飯, curry brisket, curry beef brisket rice, beef stew with curry sauce`
- 5 operations, ~14 rows.
  1. blanch the brisket 5 min, drain
  2. fry onion, ginger, garlic and curry powder 3 min *(new branch)*
  3. simmer the brisket in the curry 2 hr — `~1`, `~2`
  4. coconut milk in, 10 min — `~1`
  5. season, over rice — `~1`
- The curry sauce is steps 2–3 and is consumed by `&`; no standalone `hong-kong-curry-sauce`
  (Design D2).
- `slack: forgiving` — the two hours is where the brisket starts to give, not a deadline.
- Curry powder is written as **mild curry powder**, noted *Madras or a meat-curry blend*, so it
  resolves against the same aisle pattern `singapore-mei-fun` and `madras` already use.

**8. `recipes/rice-beans-and-grains/minced-beef-rice.cook`** — 免治牛肉飯

- title `Minced Beef Rice` · category `Rice, Beans & Grains` · servings 2 · time 25 min
- `aka: min ji ngau yuk faan, 免治牛肉飯, minced beef rice, minced beef and egg over rice, ground beef over rice, minced beef with egg rice`
- 4 operations, ~13 rows.
  1. brown the mince with onion and garlic 5 min
  2. stock, oyster sauce, dark soy, peas; simmer and thicken 5 min — `~1`
  3. fry the eggs 3 min *(new branch)*
  4. gravy over rice, egg on top — `~1`, `~2`

**9. `recipes/noodles/soy-sauce-pan-fried-noodles.cook`** — 豉油皇炒麵

The wok-hei file. Design D4.

- title `Soy Sauce Pan-Fried Noodles` · category `Noodles` · servings 2 · time 20 min
- `aka: si yau wong chau min, 豉油皇炒麵, soy sauce pan fried noodles, soy sauce chow mein, king soy sauce noodles, soy sauce fried noodles`
- **Prose row, step 1** — what a home burner cannot do and what to do instead. Under 120 chars.
- 4 operations after it, ~9 rows.
  2. stir the sauce
  3. loosen the noodles in boiling water 1 min, drain and dry *(new branch)*
  4. fry flat in two batches 5 min — `~1`
  5. toss with the sauce, sprouts and scallions 1 min — `~1`, `~3`
- `slack: narrow` — a crowded pan steams; wet noodles do not come back.
- **Two surfaces, two jobs**: the row frames the equipment, `slack` names the failure. That is the
  test `voice.md` sets, and it is why the same fact is not written three times.

**10. `recipes/rice-beans-and-grains/shrimp-and-egg-rice.cook`** — 滑蛋蝦仁飯

- title `Shrimp and Soft Egg Rice` · category `Rice, Beans & Grains` · servings 2 · time 25 min
- `aka: waat daan ha yan faan, 滑蛋蝦仁飯, 滑蛋, shrimp and egg over rice, soft scrambled egg with shrimp, sliding egg rice, prawn and egg rice`
- 4 operations, ~10 rows.
  1. season the prawns, rest 10 min
  2. beat the eggs with evaporated milk and cornstarch *(new branch)*
  3. fry the prawns 2 min — `~2`
  4. egg over the prawns on the lowest heat, off wet, over rice — `~1`, `~2`
- Carries **rank 6, 滑蛋** as its technique. `evaporated milk` in a savoury row — the only one in
  this ticket, and one T-007-05 needs for the aisle test.
- `slack: narrow` — it is pulled while it still looks underdone.

### Sandwiches and buns

**11. `recipes/sandwiches-and-rolls/hong-kong-egg-sandwich.cook`** — 蛋治

- title `Hong Kong Egg Sandwich` · category `Sandwiches & Rolls` · servings 1 · time 10 min
- `aka: daan ji, 蛋治, egg sandwich, HK egg sandwich, scrambled egg sandwich, soft egg sandwich`
- 4 operations, ~7 rows.
  1. beat the eggs with evaporated milk
  2. cook low, fold, off wet 3 min — `~1`
  3. butter the bread *(new branch)*
  4. fill, crusts off, cut in triangles — `~1`, `~2`
- Two butters, deliberately two rows: `unsalted butter` in the pan, `salted butter` softened on the
  bread. Different jobs, different rows, and T-007-05 gets two unambiguous names.

**12. `recipes/sandwiches-and-rolls/luncheon-meat-and-egg-sandwich.cook`** — 餐蛋治

- title `Luncheon Meat and Egg Sandwich` · category `Sandwiches & Rolls` · servings 1 · time 12 min
- `aka: chaan daan ji, 餐蛋治, 蛋牛治, Spam & Egg Sandwich, spam and egg sandwich, luncheon meat and egg sandwich, corn beef & egg sandwich`
- 4 operations, ~7 rows. Three branches, one merge.
  1. fry the luncheon meat 4 min
  2. fold an omelette 2 min *(new branch)*
  3. toast and butter the bread 2 min *(new branch)*
  4. stack and cut — `~1`, `~2`, `~3`
- The corned-beef version (蛋牛治) is an `aka`, not a second file — the work list says so at rank 5.

**13. `recipes/sandwiches-and-rolls/pork-chop-bun.cook`** — 豬扒包

- title `Pork Chop Bun` · category `Sandwiches & Rolls` · servings 2 · time 40 min
- `aka: jyu paa baau, 豬扒包, pork chop bun, Macau pork chop bun, Macanese pork bun, Portuguese pork bun`
- 4 operations, ~11 rows.
  1. pound and marinate the chops, rest 30 min
  2. fry 6 min — `~1`
  3. warm and split the rolls 3 min *(new branch)*
  4. chop in the roll, press the lid down — nothing else goes in — `~1`, `~2`
- **The roll is the hard part and the file says which one**, in an ingredient note under the 80-char
  cap: a bolillo or Portuguese roll is closest, and a soft bun is not.

### Also here

**14. `recipes/stews-and-braises/swiss-wings.cook`** — 瑞士雞翼

- title `Swiss Wings` · category `Stews & Braises` · servings 4 · time 35 min
- `aka: seui si gai yik, 瑞士雞翼, 瑞士汁, Swiss chicken wings, Swiss sauce wings, sweet soy chicken wings`
- **Prose row, step 1** — the sauce keeps and goes again. That is the gap page's own finding and it
  is the one thing that changes what a cook does with the pot afterwards.
- 4 operations after it, ~10 rows.
  2. simmer the soy syrup 10 min
  3. poach the wings at a bare bubble 15 min, lid on — `~1`
  4. lift the wings, reduce the syrup 8 min — `~1`
  5. roll the wings in it, sesame over — `~1`
- `slack: narrow` — boiled hard the skin tears and the syrup clouds.
- **Placement is unresolved and is T-007-05's**, per Design D8. This is the only file here with no
  home in the six content section titles.

## What is not created

No `hong-kong-tomato-sauce`, no `hong-kong-curry-sauce`, no `satay-beef` component file — arguments
in Design D1, D2 and D2b. No `beef-chow-fun` edit, no `borscht` edit, no `egg-fried-rice` edit, no
`club-sandwich` edit: existing files are not touched by this ticket at all, and the `pairs-with`
links to them are made mutual by the build rather than by editing the other side.

## Ordering of the work

Only one ordering constraint is real: **a `pairs-with` at a slug that does not exist is a build
error**, and mutuality is added at build time, so the pair must exist by the time
`npm run check`/`npm run verify` runs — not at the moment the first file is written.

`baked-pork-chop-rice` ↔ `pork-chop-in-tomato-sauce` is the only pair inside this ticket. Both are
in the same commit unit. `chicken-broth`, `borscht`, `egg-fried-rice` and `homemade-ketchup` already
exist.

Otherwise the files are independent and are grouped by section for commits, which is what Plan
sequences.

## Interfaces T-007-05 depends on

These are the strings the shelver reads, and getting them wrong is a silent failure rather than a
build error:

| Thing | Contract |
| --- | --- |
| `>> counters: Cha Chaan Teng` | On all fourteen, exactly. It is the only counter any of them names. |
| Ingredient names | `tinned luncheon meat`, `instant noodles`, `evaporated milk`, `satay sauce`, `rock sugar`, `mild curry powder`, `oyster sauce`, `crusty white rolls`. Written identically wherever they repeat across files, so one aisle pattern catches each. |
| `evaporated milk` | Appears in two files (`shrimp-and-egg-rice`, `hong-kong-egg-sandwich`). **No file here writes `condensed milk`** — that tin is T-007-03's, and the two must not share a pattern. |
| Slugs | The fourteen above. All checked free against the collection before writing. |
| Section recommendation | Design D8. `swiss-wings` is the open question. |
