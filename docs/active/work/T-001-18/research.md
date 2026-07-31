# T-001-18 — Research

What is on the shelf after sixteen counter tickets, and what only shows up when you read all
of it at once. Descriptive only.

## 1. The shelf as it stands

`f86f437` (Complete T-001-17) is the baseline. Working tree is clean of ticket-owned files.

- **514 `.cook` files** in **27 category folders** under `recipes/`.
- **618 counter assignments**, **416 of them "only here"**, 15 counters.
- **558 pairings** made mutual, timers in **492** files, 0 orphans, 0 counters inferred from
  category, 0 parser warnings.
- `src/data/counters.json` is fully sectioned by T-001-17: **every one of the 618 assignments
  lands in a named section, and no section names a slug that is not shelved there.** Verified
  by walking `counters[].sections[].items` against `>> counters:` — 0 unsectioned, 0 ghosts.

Per-counter, today:

| Counter | Recipes | Only here |
| --- | --: | --: |
| Bakery | 107 | 63 |
| Diner | 73 | 35 |
| Deli | 62 | 25 |
| Meat and Three | 53 | 30 |
| Curry House | 47 | 47 |
| Shawarma Counter | 44 | 36 |
| Taquería | 33 | 25 |
| Pizzeria | 32 | 26 |
| Panadería | 30 | 17 |
| Dim Sum Counter | 30 | 20 |
| Ramen Shop | 27 | 26 |
| Thai Kitchen | 21 | 21 |
| Smokehouse | 21 | 14 |
| Takeout Counter | 20 | 15 |
| Phở & Bánh Mì | 18 | 16 |

`docs/gaps/README.md` still records the pre-story state: 241 recipes, 12 categories, 311
assignments, 171 only-here. Those are the "before" numbers the review artifact needs.

## 2. `npm run verify` — where it stands and why

`npm run check` passes (514/514 draw). `npm run recipes` passes. `astro build` is never
reached. **`vitest run` is 3 failed / 663 passed**, in two files.

### 2a. `icons.test.ts` — "recognises every verb the recipes open an operation with"

54 leading words fall through to the bowl. The test builds its corpus like this:

```ts
const operationLabels = all.flatMap((recipe) =>
  recipe.steps.map((step) => step.labelOverride ?? step.rawLabel));
```

That is **every step**, including the ingredient-less prose steps that render as full-width
rows rather than operation cells. Measured against `layout()`:

- 2672 step labels → 54 fall-through words
- 2429 real operation cells (`kind === 'op'`) → **26** fall-through words

The 28-word difference is entirely prose: `a`, `the`, `this`, `these`, `there`, `printed`,
`everything`, `two`, `nine`, `unripe`, `thicker`, `flat`, `hard`, `low`, `sweet`, `keep`,
`mint`, `vinegar`, `gram`, `pork`, `assembly`, `paneer`, `tonkotsu`, `balti`, `bhuna`,
`do-piaza`, `dum`, `palak`, `pasanda`. Those are the first words of sentences, not verbs.
The test's own docstring says it checks "every distinct verb the recipes actually open an
**operation** with", so the corpus is wider than the claim.

The 26 that come from real operation cells split two ways.

**Genuine cook's verbs with no entry in `VERB_ICONS` (19):** `blitz` (mayu, korma), `bruise`
(som-tum ×2), `build` (ful-medames), `clarify` (baklava), `crack` (four Thai curries — the
coconut cream), `dress` (fatayer, ful-medames, fattoush, larb-gai), `lay` (three ramen
bowls), `mould` (maamoul), `perfume` (attar), `return` (beef-with-broccoli), `ribbon`
(egg-drop-soup, hot-and-sour-soup), `sheet` (ramen-noodles), `slacken` (manakish), `slide`
(hot-and-sour-soup), `thread` (chicken-tikka, shish-tawook), `throw` (fattoush), `tie`
(labneh), `velvet` (four Takeout stir-fries), `wring` (gyro-meat, kafta).

**Labels that open with a noun or an adjective instead of an operation (7 words, 11 cells),
all in the Ramen Shop / broth files:** `aromatics` (chintan-broth, tonkotsu-broth), `broth`
(miso-ramen, shio-ramen), `corn` (miso-ramen), `hard` (tonkotsu-broth — "hard rolling boil 8
hr"), `noodles` (three bowls), `sprouts` (miso-ramen), `tare` (four bowls). The README's
`--labels` section calls the staircase "the only way to tell a cook's verb from a mangled
sentence fragment"; these are the fragments.

Every writer ticket from T-001-06 onward reported this test red and said the remedy was
outside its files. T-001-17's review names T-001-18 as the owner outright.

### 2b. `schedule.test.ts` — the two ferment assertions

The top of the critical-path table today:

| Slug | Total (min) | Author claims | Drift |
| --- | --: | --: | --: |
| sour-dill-pickles | 33240 | 33120 | 0.00 |
| sauerkraut | 33150 | 33150 | 0.00 |
| **ginger-garlic-paste** | **30240** | **15** | **2015.00** |
| lime-pickle | 20160 | 21600 | 0.07 |
| pastrami | 7830 | 7830 | 0.00 |

Two data defects, both only visible from here:

1. **`ginger-garlic-paste` writes shelf life as a timer.** Its step 3 is "Pack the paste into
   a clean jar, film the top with oil and `~chill{3%weeks}`." Nothing waits three weeks — the
   paste is a curry's worth two tablespoons at a time, the moment it is blended. `>> time: 15
   min` is the honest figure; the timer is the keeping time, and it puts a 21-day edge on the
   critical path of a 15-minute recipe. This single timer is what fails **both** schedule
   assertions.
2. **`lime-pickle` claims a day it does not take.** `>> time: 15 days` against `~stand{7%days}`
   twice = 14 days exactly. 0.07 drift, over the 0.05 gate.

The first assertion hard-codes three slugs (`sour-dill-pickles`, `injera`, `pizza-dough`) from
a 241-recipe collection. It has been wrong since T-001-01 and has named a different wrong trio
at nearly every ticket since — `crema-mexicana`, `lime-pickle`, `ginger-garlic-paste`,
`sauerkraut` have each displaced an entry. T-001-01, T-001-04, T-001-14 and T-001-16 all
recorded the same remedy: assert the property (the longest paths are long unattended ferments)
rather than three names. With the two data fixes above the top three become
`sour-dill-pickles`, `sauerkraut`, `lime-pickle`, all at 0.00–0.00 drift.

`shopping.test.ts` and `units.test.ts` are **green** — T-001-17's `aisles.json` pass and
T-001-14's `pink curing salt` fix closed those.

## 3. Slugs and duplicate dishes

`ls recipes/*/*.cook | xargs -n1 basename | sort | uniq -d` is **empty**; `bySlug.size ===
all.length` in `collection.test.ts` passes. The one collision this story produced
(`potato-salad`, T-001-13 vs T-001-14) was resolved inside T-001-13 by withdrawal.

**No two files are the same dish.** Checked three ways:

- *Ingredient-set Jaccard ≥ 0.6* — 72 pairs, every one a family resemblance rather than a
  duplicate (`creme-anglaise`/`creme-brulee`, `baguette`/`ciabatta`, `pound-cake`/`marble-cake`).
  The two closest reads, `salsa-verde` / `salsa-verde-cruda` (0.88) and
  `general-tsos-chicken` / `sesame-chicken` (0.88), are both deliberate and argued in their
  tickets: cooked versus raw, and the gap doc's own "the same fried chicken under two other
  glazes".
- *Title + `aka` name-set overlap* — top pair is `tzatziki` / `white-sauce` at 0.36. They are
  not one dish: Greek yogurt, cucumber, dill, drained versus halal-cart mayonnaise, yogurt,
  vinegar, oregano. What they share is `aka` entries.
- *`dish:` keys* — `collection.test.ts`'s "at most one plain way to cook a dish" passes.

What the name scan **did** find is 26 cases of two recipes claiming the same name in `aka`,
which is the same failure mode as the tag one: one concept, two files answering to it. The
ones where a searcher lands on the wrong table:

| Name claimed twice | By | Reading |
| --- | --- | --- |
| tzatziki, taziki, yogurt sauce | `white-sauce`, `tzatziki` | halal-cart white sauce is not tzatziki; both files say so in prose |
| white sauce | `tzatziki`, `toum`, `tahini-sauce`, `bechamel`, `white-sauce` | four sauces answering to one menu word |
| pizza sauce, Sunday gravy | `marinara-sauce` | recorded by T-001-12: the pie takes raw crushed tomato, and Sunday gravy is its own dish |
| yellow rice | `pilau-rice`, `yellow-rice` | two boards, two dishes |
| pilau | `pilau-rice`, `rice-pilaf` | Indian pilau vs Levantine vermicelli rice |
| clear chicken broth | `chicken-broth`, `chintan-broth` | deli pot vs ramen pot |
| madras | `madras-curry-powder`, `madras` | the blend and the curry |
| gaeng dang, gaeng ped, kaeng phet | `thai-red-curry-paste`, `thai-red-curry` | the paste answering to the curry's name |
| vindalho | `vindaloo-paste`, `vindaloo` | same shape |
| tonkotsu | `tonkotsu-broth`, `tonkotsu-ramen` | same shape |
| rice pudding | `kheer`, `rice-pudding` | |
| roast pork | `carnitas`, `char-siu` | |
| number 1 | `banh-mi-dac-biet`, `pho-bo` | |

## 4. Tag vocabulary

527 distinct tags over 514 files. Normalising (fold accents, strip punctuation, singularise)
collapses **17 groups** where one concept is spelled two ways:

`walnut/walnuts`, `almond/almonds`, `egg/eggs`, `biscuit/biscuits`, `bun/buns`,
`apple/apples`, `no-cook/no cook`, `onion/onions`, `chile/chiles`, `green/greens`,
`rice noodle/rice noodles`, `dumpling/dumplings`, `pepper/peppers`, `lentil/lentils`,
`mushroom/mushrooms`, `cold cuts/cold cut`, `beet/beets`.

Three more the normaliser misses:

- `cookie(1)` / `cookies(1)` — the `-ies → -y` rule fires first and makes "cooky".
- `appetiser(4)` / `appetizer(1)` — British and American spelling of one concept.
  (`appetizing(2)` is a different word: the Deli's appetizing counter. Not a variant.)
- Verb/participle pairs for one method: `pan-fry(2)`/`pan-fried(2)`,
  `stew(5)`/`stewed(5)`, `simmer(1)`/`simmered(1)`, `grill(12)`/`grilling(1)`,
  `glaze(2)`/`glazed(1)`, `toasted(6)`/`toasting(1)`.

Tags feed the front-page search alongside `aka` and ingredient names, so a split concept
halves a query's results silently. Nothing enforces the vocabulary today — `parse-recipes.mjs`
passes tags through untouched and no test reads them.

## 5. The recorded hand-offs

Every `docs/active/work/T-001-*/` artifact was read. Eleven of the sixteen tickets recorded
something for here; five recorded an explicit no-op (T-001-09 §4, T-001-11, T-001-13 §1, and
the T-001-05/T-001-07 satisfied-rather-than-rewritten notes).

**Counters to add to existing files** (the "same dish at two counters" case):

| File | Add | Recorded by |
| --- | --- | --- |
| `recipes/fried-and-crispy/country-fried-steak.cook` | `Diner` | T-001-15 |
| `recipes/sauces-and-gravies/cream-gravy.cook` | `Diner` | T-001-15 |
| `recipes/stews-and-braises/meatloaf.cook` | `Diner` | T-001-15 |
| `recipes/salads/tuna-salad.cook` | `Diner` | T-001-15 (conditional: "if written" — it is) |
| `recipes/custards-and-puddings/rice-pudding.cook` | `Taquería` (arroz con leche) | T-001-10 |
| `recipes/dressings-and-dips/mayonnaise.cook` | `Phở & Bánh Mì`? | T-001-02, left as a question |
| `recipes/soups/dashi.cook`, `recipes/dumplings-and-rolls/gyoza.cook` | wider counters? | T-001-08, left as a question |

**`aka` corrections:**

- `marinara-sauce`: drop `pizza sauce` and `Sunday gravy`; T-001-12 suggests
  `red sauce, tomato sauce, salsa marinara`.

**Pairings wanting the other side written:** T-001-16 records `croissant` → `croissant-dough`
as "pointing at it is enough" (already mutual at build). T-001-08 records `chashu` ↔
`shoyu-tare` as written on both sides. No dangling pairing exists — `collection.test.ts`
proves it.

**Icon verbs:** T-001-03 §1 (`crack`, `bruise`, `dress`), T-001-06, T-001-07, T-001-14 (ten
more) — all folded into §2a above.

**Gap-doc staleness, named by ticket:**

- T-001-05 §3: `smokehouse.md` says "There is no cornbread" (untrue) and calls the counter 5
  recipes (it is 21).
- T-001-06 §3–4: `panaderia.md`'s sections predate 18 of its 30 files; "there is no drink
  anywhere" is untrue since `ca-phe-sua-da`, `egg-cream`, `milkshake`.
- T-001-13 §6: `meat-and-three.md` lists `banana-pudding`, `coleslaw`, `skillet-cornbread`,
  `hot-water-cornbread`, `all-butter-pie-crust` as missing; all five are on the shelf.
- T-001-16 §4: `bakery.md` says "no pastry shell of any kind exists" and "nothing in the
  collection is laminated"; `sweet-tart-shell`, `all-butter-pie-crust`, `hojaldre`,
  `croissant-dough` all exist.
- T-001-02: `pho-and-banh-mi.md`'s header is stale on pâté and đồ chua.
- T-001-17: **`docs/gaps/*.md` is now behind `counters.json`, and
  `scripts/menu-sections.mjs --write` would therefore undo T-001-17.** Whoever rewrites the
  notes must re-run it and expect it to *reproduce*, not replace, the sections.

**Shelving judgements recorded and deliberately not made:** the Ethiopian trio split across
two counters, `beef-rendang` at Thai Kitchen, `chicken-adobo`/`jollof-rice` at Meat and Three,
`haemul-pajeon`/`bulgogi-marinade` at Ramen Shop (README §Shelving notes); `cha-lua` in
`stews-and-braises`; `nixtamalised-masa` in `pastry-and-doughs`; `recipes/salads/` holding
only Thai salads (T-001-03 §6 — no longer true, it now holds ten).

## 6. Boundaries and constraints

- **The slug is the URL and the basename is the slug.** Moving a file between category folders
  changes its `category` and nothing about its URL. `parse-recipes.mjs` — not
  `check-recipes.mjs` — is what refuses a duplicate basename.
- **`docs/gaps/*.md` is machine-read.** `menu-sections.mjs` parses the `## What it has` block
  only, taking `**Section title.** slug · slug` lines. Any rewrite has to keep that shape and
  agree with `counters.json`.
- **`>> step.N:` is 1-based over every paragraph**, prose rows included (T-001-08 §5). Editing
  a label means counting paragraphs, not operations.
- **A `#` inside an ingredient name is a cookware marker** (T-001-14). `check-recipes.mjs`
  cannot see the damage; `units.test.ts` can.
- **`counters.json` `categories` is inert** — 514 named, 0 inferred. It is the safety net for
  the next file written without a `>> counters:` line.
- Three ingredient names are not food: `flat skewers`, `metal skewers`, `oak or hickory wood`
  (T-001-17). They sit in "Anything else" in the shopping list.
- `src/generated/` is not committed.

## 7. What is left over that this ticket does not have to decide

Recorded so the gap-doc rewrite can carry them forward rather than lose them: the three
unowned shared components (stabilised whipped cream, plain chicken stock, pickled mustard
green — T-001-01); the shared toasted-chile purée under `birria-de-res`,
`red-enchilada-sauce`, `mole-poblano`, `adobo-para-al-pastor` (T-001-10); `chana-masala`
deriving inline what `onion-tomato-masala` exists to end (T-001-09 §5); `okonomiyaki` buying
its sauce and `japanese-beef-curry` making roux inline (T-001-08 §3); the three older Thai
files' unnamed timers and the `makrut`/`kaffir` lime split (T-001-03 §4–5);
`thai-green-curry-paste` overlapping step 1 of `thai-green-curry` (T-001-03 §3);
`recipes/cured-fish/` holding one file (T-001-14 §4).
