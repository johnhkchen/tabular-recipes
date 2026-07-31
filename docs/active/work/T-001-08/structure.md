# T-001-08 — Structure

Seventeen new `.cook` files, two new folders, nothing modified and nothing deleted.

## The change set

```
recipes/soups/dashi.cook                            NEW
recipes/soups/tonkotsu-broth.cook                   NEW
recipes/soups/chintan-broth.cook                    NEW
recipes/sauces-and-gravies/shoyu-tare.cook          NEW
recipes/sauces-and-gravies/shio-tare.cook           NEW
recipes/sauces-and-gravies/miso-tare.cook           NEW
recipes/sauces-and-gravies/mayu.cook                NEW
recipes/stews-and-braises/chashu.cook               NEW
recipes/noodles/ramen-noodles.cook                  NEW
recipes/toppings-and-pickles/ajitama.cook           NEW   (new folder)
recipes/toppings-and-pickles/menma.cook             NEW
recipes/noodles/tonkotsu-ramen.cook                 NEW
recipes/noodles/shoyu-ramen.cook                    NEW
recipes/noodles/shio-ramen.cook                     NEW
recipes/noodles/miso-ramen.cook                     NEW
recipes/dumplings-and-rolls/gyoza.cook              NEW
recipes/fried-and-crispy/karaage.cook               NEW   (new folder)
```

No file outside `recipes/**` is touched. `src/data/counters.json` is T-001-17's.

New categories, taken from the folder name by `normalise.mjs:194` and set explicitly on each
file anyway: **Toppings & Pickles**, **Fried & Crispy**.

## The metadata block every file carries

```
>> title:      display name, diacritics correct (Ajitama, Chāshū, Mayu)
>> category:   the folder's display name
>> tags:       4–6, lowercase, comma list
>> counters:   Ramen Shop
>> aka:        romaji, no-diacritic form, kana/kanji, and what people say at the counter
>> pairs-with: slugs of the files it is used by or uses
>> servings:   for a component, the number of bowls it dresses
>> time:       total wall clock, formatted like the existing files
>> step.N:     override wherever the derived label would come out as a fragment
```

`aka` must always contain a form typed **without diacritics** (`chashu` beside `chāshū`,
`ramen` beside `rāmen`) — that is the acceptance criterion and it is also what a person types.

## Ordering — this is a dependency graph, not a list

```
dashi ──────────────┬──> shio-tare ──┬──> shio-ramen
                    └──> shoyu-tare ─┼──> shoyu-ramen
chintan-broth ───────────────────────┤     (chicken fat comes off this broth)
                     miso-tare ──────┴──> miso-ramen
tonkotsu-broth ─┬──> tonkotsu-ramen
mayu ───────────┘
chashu ─────────────> all four bowls
ramen-noodles ──────> all four bowls
ajitama, menma ─────> shoyu-ramen, shio-ramen
gyoza, karaage        (independent)
```

Everything a bowl names must exist as a file **before** the bowl is written, so `pairs-with`
resolves to real slugs on the first check.

## File-by-file blueprint

Each is written as: **rows** (ingredient leaves) → **steps** (operations, one column each).
`colCount` is the number of chained steps plus one; the floor is 3 columns and 3 rows.

### 1. `soups/dashi.cook` — Dashi (ichiban dashi)
Rows: water, kombu, katsuobushi. Steps: **soak the kombu 30 min cold** → **heat to 150°F,
lift the kombu out** → **steep the katsuobushi 2 min off the heat, strain**. 3 rows × 4 cols.
Header row above the table: never boil kombu. Footer: the spent kombu and flakes make niban
dashi. `pairs-with: shio-tare, shoyu-tare, shio-ramen`.

### 2. `soups/tonkotsu-broth.cook` — Tonkotsu Broth
Rows: pork trotters, pork neck bones, pork fatback, water (parboil), water (the boil), onion,
garlic, ginger, scallion greens. Steps: **parboil 30 min and scrub every bone** → **hard
rolling boil 8 hr, topping the water up** → **aromatics in for the last hour** → **strain
through a sieve, pressing the marrow through**. ~9 rows × 5 cols.
Two paragraphs of judgement: the boil must never drop to a simmer (that is the whole
difference between white and grey), and the shop's 12–18 hr with continuous top-up is a loop
a home pot cannot run — this is the one-off version and says so.

### 3. `soups/chintan-broth.cook` — Chintan Broth
Rows: chicken carcasses, chicken wings, pork neck bones, water, onion, ginger, scallion,
kombu. Steps: **parboil 10 min, rinse** → **bring up and skim, then hold at a tremble 4 hr**
→ **aromatics and kombu for the last 30 min** → **strain, chill, lift the fat and keep it**.
~8 rows × 5 cols. The last step is where the shoyu and shio bowls' chicken fat comes from,
and it says so. `pairs-with: shoyu-ramen, shio-ramen, miso-ramen`.

### 4. `sauces-and-gravies/shoyu-tare.cook` — Shoyu Tare
Rows: koikuchi soy sauce, kombu, dried shiitake, sake, mirin, brown sugar, katsuobushi.
Steps: **steep kombu and shiitake in the soy overnight, cold** → **boil the sake and mirin
2 min to burn the alcohol off** → **combine and warm to 160°F, katsuobushi in, steep 10 min**
→ **strain, bottle**. 7 rows × 5 cols. Header: this is what makes a bowl "shoyu ramen";
the broth itself is unseasoned.

### 5. `sauces-and-gravies/shio-tare.cook` — Shio Tare
Rows: sea salt, water, sake, kombu, dried scallop, usukuchi soy, mirin. Steps: **soak the
kombu and scallop in cold water and sake 8 hr** → **warm to 160°F, hold 20 min, do not boil**
→ **stir the salt in until it is gone, then the usukuchi and mirin** → **strain**.
7 rows × 5 cols.

### 6. `sauces-and-gravies/miso-tare.cook` — Miso Tare
Rows: white miso, red miso, sesame paste, garlic, ginger, doubanjiang, sake, mirin, sugar,
toasted sesame oil. Steps: **fry the garlic, ginger and doubanjiang in sesame oil 2 min** →
**boil the sake and mirin down by half** → **beat both misos, the sesame paste and the sugar
in off the heat** → **rest overnight**. ~10 rows × 5 cols.

### 7. `sauces-and-gravies/mayu.cook` — Mayu
Rows: garlic, toasted sesame oil, neutral oil. Steps: **fry the garlic in the neutral oil
until it goes past brown to black, 12 min** → **blitz with the sesame oil to a loose black
paste** → **cool and settle**. 3 rows × 4 cols. Header: this is a controlled burn and it is
supposed to smell scorched; a paragraph on the thirty seconds between right and acrid.

### 8. `stews-and-braises/chashu.cook` — Chāshū
Rows: pork belly, salt, neutral oil, soy sauce, sake, mirin, sugar, garlic, ginger, scallion,
water. Steps: **roll skin-out and tie at 1-in intervals** → **brown all over 8 min** →
**braise covered at a bare tremble 3 hr, turning every 45 min** → **chill in the liquid
overnight, then slice thin**. ~11 rows × 5 cols.
A note, not a step: the braising liquid is a tare — reduce it and it seasons the bowl. Two
uses, two tables, `pairs-with: shoyu-tare` and a sentence saying so, which is the split the
gap doc asks for.

### 9. `noodles/ramen-noodles.cook` — Ramen Noodles
Rows: bread flour, vital wheat gluten, water, kansui, salt, potato starch. Steps: **dissolve
the kansui and salt in the water** → **rub into the flour to a dry crumb, 5 min** → **press
into a slab and rest 1 hr** → **sheet in passes down to 1.5 mm, rest 30 min** → **cut, dust
with potato starch, rest 24 hr**. 6 rows × 6 cols.
Header: 38% hydration is a dough that looks broken and is correct. Footer: baked baking soda
as the kansui substitute, with the oven temperature and time.

### 10. `toppings-and-pickles/ajitama.cook` — Ajitama
Rows: eggs, water (marinade), soy sauce, mirin, sake, sugar. Steps: **boil the marinade 1 min
and cool it** → **boil the eggs exactly 6 min 30 sec from the fridge** → **ice bath 5 min,
peel under water** → **marinate 8 hr, turning the bag once**. 6 rows × 5 cols.
The timing paragraph is the recipe: 6:30 for a jammy centre at fridge temperature, and why
the ice bath is not optional.

### 11. `toppings-and-pickles/menma.cook` — Menma
Rows: salted or dried bamboo shoots, sesame oil, dashi, soy sauce, mirin, sugar, chilli.
Steps: **soak 8 hr, changing the water, then boil 20 min and taste for salt** → **fry in
sesame oil 3 min** → **simmer in the dashi and seasonings until dry, 15 min**. 7 rows × 4 cols.

### 12. `noodles/tonkotsu-ramen.cook` — Tonkotsu Ramen
Rows: shio tare, mayu, tonkotsu broth, ramen noodles, water, chashu, kikurage, beni shoga,
scallion, sesame seeds. Steps: **tare and mayu into a warmed bowl** → **boiling broth onto
them, stir** → **noodles boiled 15 sec, drained hard, into the bowl** → **top and serve
inside a minute**. ~10 rows × 5 cols.
Header row: the bowl is assembly — everything must already be hot.

### 13. `noodles/shoyu-ramen.cook` — Shoyu Ramen
Same skeleton, different contents: shoyu tare, chicken fat, chintan broth, wavy noodles
90 sec, chashu, ajitama, menma, nori, naruto, scallion.

### 14. `noodles/shio-ramen.cook` — Shio Ramen
shio tare, chicken fat, chintan broth cut with dashi, thin noodles 60 sec, chashu, ajitama,
scallion, yuzu zest, kamaboko.

### 15. `noodles/miso-ramen.cook` — Miso Ramen
Not assembly. Rows: lard, ground pork, garlic, ginger, bean sprouts, miso tare, chintan
broth, thick curly noodles, water, corn, butter, scallion, chashu. Steps: **fry the pork hard
in lard 3 min** → **sprouts and aromatics in, 1 min** → **tare in, let it catch 30 sec** →
**broth in, bring to a boil, pour into the bowl** → **noodles boiled 3 min in** → **corn,
butter, chashu, scallion on top**. ~13 rows × 7 cols — the longest of the four, correctly.

### 16. `dumplings-and-rolls/gyoza.cook` — Gyoza
Two branches joining, which the tree allows via a step taking two refs.
Dough branch: flour, salt, boiling water → **knead 8 min** → **rest 30 min** → **roll and cut
into 3.5-in rounds**. Filling branch: napa cabbage, salt, ground pork, garlic, ginger, garlic
chives, soy, sesame oil, sake, sugar, white pepper → **salt the cabbage 20 min and wring it
dry** → **beat into the pork in one direction until sticky, 3 min**. Join: **fill and pleat
one side only** → **fry flat-side-down 3 min, water in, cover and steam 6 min, lid off and
crisp 2 min**. ~14 rows × 7 cols.
The wring and the one-sided pleat are the two things that separate a gyoza from a jiaozi.

### 17. `fried-and-crispy/karaage.cook` — Karaage
Rows: chicken thighs, soy, sake, mirin, ginger, garlic, sugar, sesame oil, potato starch,
egg, frying oil, lemon. Steps: **marinate 30 min** → **beat the egg through** → **dredge in
potato starch, let it hydrate 5 min** → **fry at 320°F 90 sec, rest 5 min** → **fry again at
360°F 60 sec**. ~12 rows × 6 cols. The double fry is the dish; a single fry is the shortcut
wearing its name.

## Conventions applied to all seventeen

- **Every timer named** — `~simmer{}`, `~boil{}`, `~marinate{}`, `~fry{}`, `~rest{}`,
  `~chill{}`, `~steep{}`, `~soak{}`, `~drain{}`, `~knead{}`. Names are picked from the
  vocabularies in `src/lib/time.ts` so the timeline reads attention honestly rather than
  defaulting to hands-on.
- **Both unit systems**: `@pork belly{2%lb}(900 g)`.
- **Notes carry prep or spec**: `(rolled and tied)`, `(at 320°F/160°C)`.
- **`>> step.N:` wherever the derived label would be a fragment**, and always for a step whose
  sentence carries a paragraph of judgement after it — `cleanLabel()` would otherwise put the
  whole essay in the cell.
- **One root**: the last step of every file references what came before it.
- **No step referenced twice**, checked by reading each file's refs before running the checker.
