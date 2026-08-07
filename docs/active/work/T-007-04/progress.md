# T-007-04 — Progress

Fourteen files written, all six plan steps done, six commits through `lisa commit-ticket`.

---

## Commits

| # | Commit | What |
| --- | --- | --- |
| 1 | `f98affd` | Write the macaroni, the packet noodles and the soup that is not borscht — 4 files |
| 2 | `30748a3` | Write the pork chop twice — once in the pan and once under the cheese — 2 files |
| 3 | `669dd57` | Write the brisket, the mince, the soft egg and the noodles a home burner can manage — 4 files |
| 4 | `cfe4839` | Write the three sandwiches, and name the roll the bun actually wants — 3 files |
| 5 | `10427bf` | Write the Swiss wings, and the sauce that keeps — 1 file |
| 6 | `27e5349` | Open every operation cell with a verb the icon table knows — 10 files amended |

No ordinary `git add` and no ordinary `git commit` was run. `git status --porcelain recipes` is empty
— nothing of this ticket's is left staged, modified or untracked.

## The fourteen files, as built

| File | Rows | Ops | `slack` | Prose row |
| --- | ---: | ---: | :---: | :---: |
| `soups/ham-macaroni-soup.cook` | 8 | 4 | narrow | — |
| `noodles/luncheon-meat-and-egg-noodles.cook` | 8 | 4 | narrow | — |
| `noodles/satay-beef-noodles.cook` | 13 | 5 | — | — |
| `soups/hong-kong-borscht.cook` | 15 | 4 | forgiving | yes |
| `rice-beans-and-grains/baked-pork-chop-rice.cook` | 16 | 5 | narrow | — |
| `rice-beans-and-grains/pork-chop-in-tomato-sauce.cook` | 14 | 4 | — | — |
| `stews-and-braises/curry-beef-brisket.cook` | 15 | 5 | forgiving | — |
| `rice-beans-and-grains/minced-beef-rice.cook` | 14 | 4 | — | — |
| `noodles/soy-sauce-pan-fried-noodles.cook` | 9 | 4 | narrow | yes |
| `rice-beans-and-grains/shrimp-and-egg-rice.cook` | 10 | 4 | narrow | — |
| `sandwiches-and-rolls/hong-kong-egg-sandwich.cook` | 7 | 4 | narrow | — |
| `sandwiches-and-rolls/luncheon-meat-and-egg-sandwich.cook` | 7 | 4 | — | — |
| `sandwiches-and-rolls/pork-chop-bun.cook` | 11 | 4 | — | — |
| `stews-and-braises/swiss-wings.cook` | 10 | 4 | narrow | yes |

Every file is inside 5–16 rows and 3–6 operations. `baked-pork-chop-rice` sits exactly on the row
ceiling at 16, which is why nothing else was added to it.

Nine files carry `slack`; five leave it off — `satay-beef-noodles`, `pork-chop-in-tomato-sauce`,
`minced-beef-rice`, `luncheon-meat-and-egg-sandwich`, `pork-chop-bun`. Each of those five has a wide
window and no failure worth naming, and the README calls leaving the line off the legitimate answer
rather than a gap.

## Deviations from the plan

### 1. Every prose row had to be rewritten without commas — found, not planned for

`cleanLabel()` in `src/lib/label.ts` replaces **every comma with a space** before a full-width row
is rendered. The first draft of the `soy-sauce-pan-fried-noodles` row —

> A home burner will not scorch these. Dry the noodles hard, fry in two batches, and take the
> browning you get.

— rendered as *"…Dry the noodles hard fry in two batches take the browning you get"*, which is not
English. Rewritten comma-free:

> A home burner will not scorch these. Dry the noodles hard and fry them in two batches for what
> browning you can get.

Checked the other two prose rows (`hong-kong-borscht`, `swiss-wings`); both were already comma-free
and render intact. This is a property of the renderer, not of my files, and it is worth knowing:
**a full-width row cannot use commas.** Recorded here because it is not written down anywhere in
`README.md` or `docs/knowledge/voice.md`, and the next writer will hit it.

### 2. Ten operation labels had to be reopened with a recognised verb

`npm run verify` failed on `src/lib/icons.test.ts` — a test neither the ticket, the README nor
`voice.md` mentions. It requires the **first word** of every operation label to be a verb
`VERB_ICONS` in `src/lib/icons.ts` knows, so the table can pick an icon.

Ten of my labels opened with a noun and fell through to the fallback bowl:

| File | Was | Is |
| --- | --- | --- |
| `ham-macaroni-soup` | `broth over the macaroni, egg alongside` | `ladle the broth over the macaroni, egg alongside` |
| `luncheon-meat-and-egg-noodles` | `noodles and broth into the bowl, meat and egg on top` | `fill the bowl, meat and egg on top` |
| `satay-beef-noodles` | `satay beef over the noodles` | `spoon the satay beef over the noodles` |
| `baked-pork-chop-rice` | `rice, chop, sauce, cheese — bake…` | `layer rice, chop, sauce, cheese — bake…` |
| `pork-chop-in-tomato-sauce` | `same pan — simmer 8 min` | `simmer 8 min in the same pan` |
| `curry-beef-brisket` | `coconut milk in, 10 min uncovered` | `stir the coconut milk in, 10 min uncovered` |
| `minced-beef-rice` | `gravy over the rice, egg on top` | `ladle it over the rice, egg on top` |
| `hong-kong-egg-sandwich` | `lowest heat, fold 3 min, off wet` | `fold 3 min on the lowest heat, off wet` |
| `luncheon-meat-and-egg-sandwich` | `meat under egg, cut it in half` | `stack meat under egg, cut it in half` |
| `swiss-wings` | `lift them out, reduce 8 min to a syrup` | `reduce 8 min to a syrup, wings out` |

**The labels were rewritten rather than the verb table extended.** The test's own message offers
both — *"Add them to VERB_ICONS in src/lib/icons.ts, or leave them here deliberately"* — but `src/`
is out of scope for this ticket by its own terms, and every one of the ten read better opening on a
verb anyway. That is a convention the collection already keeps and I had simply not found it.

Committed separately as `27e5349` so the fix is legible against the four writing commits.

### 3. Nothing else departed from the plan

No file needed a row cut to fit 16. No three-branch merge failed to tile — six of the fourteen use
one. No planned file was dropped and none was added.

## Verification run

```
npm run check      →  all 658 file(s) draw a table.   (no field over cap)
npm run verify     →  check ok · parse ok · 832 of 833 tests pass · 1 failure, not mine
```

**The one failing test is not this ticket's.** `src/lib/icons.test.ts` still reports three leading
verbs falling through — `milk`, `pull`, `two` — and all three are in T-007-03's files:

```
recipes/drinks/yuenyeung.cook:10:>> step.2: two of tea to one of coffee
recipes/drinks/hong-kong-milk-tea.cook:11:>> step.4: pull it through the bag 3 to 6 times, steep 6 min
recipes/drinks/hong-kong-milk-tea.cook:12:>> step.5: milk in the cup first, tea on top, 7 to 3
```

T-007-03 is writing the drinks in parallel on the same branch and owns those files. Editing them
would be reaching into another ticket's scope, which the concurrency rules call the wrong fix for a
missing dependency edge. Before their files landed, this ticket's ten were the *only* failures; with
mine fixed, only theirs remain. Carried into `review.md`.

## The ingredient list, and where each thing is bought

65 distinct ingredients across the fourteen files. **None needs a specialist shop.** Grouped by
where a reader gets it:

**Ordinary supermarket, anywhere** — elbow macaroni, white sandwich bread, crusty white rolls,
eggs, evaporated milk, unsalted butter, salted butter, mild cheddar, neutral oil, kosher salt, fine
salt, sugar, black pepper, white pepper, ketchup, Worcestershire sauce, tomato paste, canned chopped
tomatoes, chicken stock, beef stock, coconut milk, frozen peas, bay leaf, star anise, ground
turmeric, five-spice powder, baking soda, cornstarch, toasted sesame seeds, yellow onion, garlic,
ginger, celery, carrot, potato, russet potato, green cabbage, bean sprouts, scallion(s), sliced ham,
minced beef, beef shin, beef brisket, beef sirloin, chicken wings, raw shrimp, boneless pork chops,
bone-in pork chops, steamed jasmine rice, cold cooked jasmine rice, water.

**Supermarket world-foods aisle, or any Asian grocery** — tinned luncheon meat, instant noodles,
light soy sauce, dark soy sauce, oyster sauce, toasted sesame oil, Shaoxing wine, chili garlic
sauce, satay sauce, rock sugar, mild curry powder, fresh thin egg noodles.

The second list is twelve items and every one of them is a shelf-stable jar, tin, bottle or packet.
That is the S-007 claim holding: no herbalist, no one shop across town.

## Notes for T-007-05

Written here because the ticket asks for them and because the shelver cannot see them from
`counters.json`.

1. **Section placement recommendation** — Design D8. Four files to *Macaroni, noodles and things in
   soup*, six to *Rice plates*, three to *Sandwiches and buns*, and `swiss-wings` with **no home in
   the six content titles**. That last one collides with T-007-05's own criterion that the menu
   render no "Also here" section. Two clean answers, both theirs: place it in "Also here" and accept
   the section, or retitle "Also here" to the snacks line the boards print (小食 / 小炒).
   `soy-sauce-pan-fried-noodles` is a fried-noodle plate; a real board files it in 粉麵飯 with the
   rice plates, which is where the recommendation puts it.
2. **New ingredient names that need an aisle**, exact strings: `tinned luncheon meat`,
   `instant noodles`, `evaporated milk`, `satay sauce`, `rock sugar`, `mild curry powder`,
   `chili garlic sauce`, `fresh thin egg noodles`, `crusty white rolls`, `steamed jasmine rice`,
   `cold cooked jasmine rice`.
3. **`evaporated milk` appears in two of my files and `condensed milk` in none.** The condensed tin
   is entirely T-007-03's. Verified by grep, so the two-pattern requirement can be checked against
   real files rather than assumed.
4. **Both `potato` and `russet potato` appear**, in `curry-beef-brisket` and `hong-kong-borscht`.
   That is not new — the collection already carries both spellings (`borscht` uses
   `russet potatoes`) — but an aisle pattern has to catch both.
5. **`pairs-with` links added into existing files by mutuality**: `chicken-broth` ← ham macaroni,
   `borscht` ← Hong Kong borscht, `egg-fried-rice` and `homemade-ketchup` ← baked pork chop rice.
   None of those four files was edited; the build makes the link.
6. **Board items on the work list that are real and are not written**, so the shelf's own gap page
   stays honest: 撈丁 (rank 22), 焗葡國雞飯 (rank 23), 咖喱魚蛋 (rank 19, blocked on sourcing),
   白汁海鮮焗飯 and 揚州炒飯 (never ranked). Reasons in Design D3 and D5.
7. **`char-siu`, `club-sandwich`, `beef-chow-fun`, `egg-custard-tart` and `pineapple-bun` were not
   touched.** All shelving jobs, all theirs.
