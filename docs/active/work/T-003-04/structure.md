# T-003-04 — Structure

The blueprint. 26 new files, all under `recipes/**`, none of them an edit to anything that already
exists.

---

## 1. Files created

Nothing is modified and nothing is deleted. Every path below is new.

```
recipes/rice-beans-and-grains/gohan.cook
recipes/rice-beans-and-grains/takikomi-gohan.cook
recipes/rice-beans-and-grains/oyakodon.cook
recipes/rice-beans-and-grains/gyudon.cook
recipes/rice-beans-and-grains/omurice.cook
recipes/soups/tonjiru.cook
recipes/soups/sumashi-jiru.cook
recipes/stews-and-braises/nikujaga.cook
recipes/stews-and-braises/buri-daikon.cook
recipes/stews-and-braises/chikuzenni.cook
recipes/stews-and-braises/saba-no-misoni.cook
recipes/vegetables-and-sides/kabocha-no-nimono.cook
recipes/vegetables-and-sides/kiriboshi-daikon.cook
recipes/vegetables-and-sides/kinpira-gobo.cook
recipes/vegetables-and-sides/hijiki-no-nimono.cook
recipes/vegetables-and-sides/ohitashi.cook
recipes/vegetables-and-sides/goma-ae.cook
recipes/smoked-and-grilled/saba-shioyaki.cook
recipes/smoked-and-grilled/buri-teriyaki.cook
recipes/stir-fries/shogayaki.cook
recipes/fried-and-crispy/hambagu.cook
recipes/fried-and-crispy/nanbanzuke.cook
recipes/salads/sunomono.cook
recipes/eggs/tamagoyaki.cook
recipes/toppings-and-pickles/nikumiso.cook
recipes/sauces-and-gravies/mentsuyu.cook
```

Stretch, written only if the 26 land clean:
`recipes/toppings-and-pickles/asazuke.cook` · `recipes/rice-beans-and-grains/chahan.cook`

**Not touched, and named here so the diff can be read against it:** `src/data/counters.json`,
`docs/gaps/japanese-home.md`, `recipes/soups/dashi.cook`, `recipes/soups/miso-soup.cook`,
`recipes/sauces-and-gravies/teriyaki-sauce.cook`, `README.md`, everything in `scripts/` and `src/`.

## 2. The metadata block every file carries

Order is fixed across all 26, so the diff reads the same way twice:

```cooklang
>> title: <English title>
>> category: <the folder's canonical string>
>> tags: japanese, <main ingredient>, <method>, <meal or occasion>
>> counters: Japanese Home Cooking
>> aka: <漢字/かな>, <rōmaji with macrons>, <plain-keyboard spelling>, <what a menu would say>, …
>> pairs-with: <slugs>
>> servings: <2–4>
>> time: <total>
>> slack: <level> — <reason>
>> step.1: <label>
… one step.N per step, no gaps
```

- `counters` is exactly `Japanese Home Cooking` — `check-recipes.mjs:22` rejects anything else.
- `aka` carries three obligatory forms per the ticket: the characters, a macron romanisation, and
  the plain-keyboard spelling. `nikujaga` → `肉じゃが, nikujaga, niku jaga, meat and potatoes`.
  `shogayaki` → `生姜焼き, shōgayaki, shogayaki, ginger pork, pork ginger`.
- `slack` is present on **all 26** (design D4).
- `step.N` is set for every step, matching house style in `dashi.cook` and `harvest-bowl.cook`.
  N is 1-based over steps *as written*, prose rows included.

## 3. Per-file shape: rows × operations, and the tree

Written as `rows / ops`. The floor is 3 / 2; the README target is 5–16 / 3–6. Anything at 3 / 2 is
flagged, because it has no margin if a row merges.

### The soup and the rice

| Slug | rows / ops | Tree |
| --- | --- | --- |
| `gohan` | 3 / 4 | rinse (rice + rinsing water) → soak (+ cooking water) → boil & steam 12 min → rest 10 min, lid on, then fold. **At the row floor**: plain rice is two things, so the rinsing water is its own row and its own operation, which is honest — it is used and poured away. |
| `tonjiru` | 9 / 4 | fry pork + roots in sesame oil → add dashi, simmer 15 min, skim → whisk miso in off the boil → scatter negi |
| `sumashi-jiru` | 6 / 3 | season dashi with usukuchi, salt, sake → warm tofu through → float mitsuba and yuzu peel |
| `takikomi-gohan` | 9 / 4 | rinse & soak rice → season the dashi → lay chicken, shiitake, carrot, abura-age on top and cook 12 min → rest 10 min and fold |

### Simmered things (煮物)

| Slug | rows / ops | Tree |
| --- | --- | --- |
| `nikujaga` | 10 / 4 | fry beef and onion in sesame oil → add potato and ito-konnyaku, pour dashi 10 : soy 1 : mirin 1 : sake 1, drop lid, 15 min → uncover and reduce to a glaze → scatter snow peas |
| `buri-daikon` | 9 / 4 | **two branches.** (a) parboil daikon in rice-washing water 20 min; (b) 霜降り — pour boiling water over the buri collar and rinse. They merge: simmer together under a drop lid 25 min → reduce and spoon over 10 min |
| `kabocha-no-nimono` | 6 / 3 | arrange skin-down with dashi and seasonings → drop lid, 15 min → cool in the liquid 20 min, which is when it takes the seasoning |
| `chikuzenni` | 12 / 4 | soak dried shiitake → fry chicken and roots in sesame oil → dashi and seasonings, drop lid, 20 min → uncover and cook dry |
| `saba-no-misoni` | 8 / 3 | 霜降り the mackerel → simmer in water, sake, mirin, sugar with ginger under a drop lid 10 min → whisk miso into the liquid and spoon over 5 min, never boiling |
| `kiriboshi-daikon` | 8 / 3 | rehydrate the dried daikon 15 min, keep the soaking water → fry with carrot and abura-age in sesame oil → simmer in dashi and seasonings until dry |

### Grilled and pan-fried mains

| Slug | rows / ops | Tree |
| --- | --- | --- |
| `shogayaki` | 8 / 4 | mix the tare (ginger 1 : soy 1 : sake 1 : mirin 1) → dust pork with flour and sear → add onion and the tare, reduce → serve over shredded cabbage |
| `saba-shioyaki` | 6 / 4 | salt and rest 30 min → blot and wipe with sake → broil 8 min → serve with grated daikon and lemon |
| `buri-teriyaki` | 8 / 3 | salt 10 min and blot → dust with flour and sear → wipe the pan, pour soy 2 : mirin 2 : sake 2 : sugar 1, glaze while spooning |
| `hambagu` | 12 / 5 | soak panko in milk → sweat onion and cool it → mix, knead, shape, dimple → sear then finish under a lid with a splash of sake → pan sauce from the fond |

### Small sides (小鉢)

| Slug | rows / ops | Tree |
| --- | --- | --- |
| `kinpira-gobo` | 8 / 4 | soak matchsticked gobo → fry in sesame oil with chile → add seasonings and cook until dry → toss with sesame seeds |
| `hijiki-no-nimono` | 8 / 3 | rehydrate hijiki 20 min → fry with carrot and abura-age → simmer to nearly dry |
| `ohitashi` | 6 / 4 | blanch spinach 30 s and shock → squeeze and cut → steep in 浸し地 (dashi 8 : soy 1 : mirin 1) → top with katsuobushi |
| `sunomono` | 7 / 4 | **two branches.** (a) salt and squeeze the cucumber; (b) rehydrate the wakame. Merge into: whisk 三杯酢 (vinegar 3 : sugar 2 : soy 1) and dress → chill 15 min |
| `goma-ae` | 5 / 3 | toast and grind the sesame with sugar and soy → blanch the beans and squeeze → dress warm |
| `tamagoyaki` | 6 / 4 | whisk eggs with dashi, mirin, usukuchi, salt and strain → first layer, roll → three more layers → shape in the mat, rest, cut |

### Made ahead (作り置き)

| Slug | rows / ops | Tree |
| --- | --- | --- |
| `nikumiso` | 8 / 3 | fry ginger, garlic and negi in sesame oil → brown the pork → stir in miso, sake, mirin, sugar and cook down 8 min |
| `nanbanzuke` | 11 / 3 | warm the 南蛮酢 with onion, carrot and chile → dust the fish in potato starch and fry → steep the fish hot in the cold marinade, then 2 hr in the fridge |
| `mentsuyu` | 4 / 3 | boil the alcohol off the mirin → dissolve soy and sugar into it → add dashi 4 : soy 1 : mirin 1, bring just to a simmer, cool. **4 rows, no margin below the target but two above the floor.** |

### Rice bowls and one-plate suppers

| Slug | rows / ops | Tree |
| --- | --- | --- |
| `oyakodon` | 9 / 4 | simmer onion in 割り下 (dashi 4 : mirin 1 : soy 1) → add chicken, 5 min → first egg pour, 1 min → second pour, lid off the heat 30 s, slide onto rice with mitsuba |
| `gyudon` | 9 / 3 | simmer onion in the same 割り下 with ginger → add thin beef, skim, 5 min → spoon over rice with beni-shoga |
| `omurice` | 10 / 4 | fry chicken and onion in butter → add rice, ketchup and Worcestershire, fry dry → soft omelette in butter → drape and shape |

## 4. The `pairs-with` graph, and why it is written in this order

`pairs-with` is validated at **build** (`parse-recipes.mjs:93–103`), not by `check-recipes.mjs`. A
slug that does not exist yet is a build error, and mutuality is computed, so **each edge is written
on exactly one side** — the side that is committed later.

Edges written in each file (targets already on disk at that point):

```
gohan            → miso-soup
tonjiru          → dashi, gohan
sumashi-jiru     → dashi, gohan
takikomi-gohan   → dashi, tonjiru
mentsuyu         → dashi

nikujaga         → dashi, gohan, miso-soup
buri-daikon      → gohan, sumashi-jiru
kabocha-no-nimono→ dashi, gohan
chikuzenni       → dashi, gohan
saba-no-misoni   → gohan, sumashi-jiru
kiriboshi-daikon → dashi, gohan, mentsuyu

shogayaki        → gohan, miso-soup
saba-shioyaki    → gohan, tonjiru
buri-teriyaki    → gohan, sumashi-jiru
hambagu          → gohan, omurice ✗ (omurice is later — dropped; hambagu → gohan, kabocha-no-nimono)

kinpira-gobo     → gohan, saba-shioyaki
hijiki-no-nimono → gohan, chikuzenni
ohitashi         → dashi, mentsuyu, nikujaga
sunomono         → gohan, saba-no-misoni
goma-ae          → dashi, hambagu
tamagoyaki       → dashi, gohan, shogayaki

nikumiso         → gohan, tamagoyaki
nanbanzuke       → dashi, gohan, kinpira-gobo
oyakodon         → dashi, sumashi-jiru, sunomono
gyudon           → dashi, miso-soup, kinpira-gobo
omurice          → sumashi-jiru, hambagu
```

Three targets are pre-existing files — `dashi`, `miso-soup` — and pointing at them adds the
reciprocal edge **at build time, in `src/generated/`, which is not committed**. No pre-existing
file is edited. That is the mechanism the whole "no file that existed before is edited" criterion
rests on.

## 5. Ordering of the work

Six batches, each a `lisa commit-ticket` with exact `--include` paths. The order is forced by §4:
a batch may only point at `dashi`, `miso-soup`, and files from an earlier batch or its own.

| Batch | Files | Why here |
| --- | --- | --- |
| B1 foundation | `gohan` `tonjiru` `sumashi-jiru` `takikomi-gohan` `mentsuyu` | Everything else points at rice, at a soup, or at mentsuyu |
| B2 煮物 | `nikujaga` `buri-daikon` `kabocha-no-nimono` `chikuzenni` `saba-no-misoni` `kiriboshi-daikon` | The heart of the shelf; the ratio work is concentrated here |
| B3 mains | `shogayaki` `saba-shioyaki` `buri-teriyaki` `hambagu` | Point back at B1 |
| B4 小鉢 | `kinpira-gobo` `hijiki-no-nimono` `ohitashi` `sunomono` `goma-ae` `tamagoyaki` | Carry the edges back to B2 and B3, closing the 一汁三菜 graph |
| B5 bowls & 作り置き | `oyakodon` `gyudon` `omurice` `nikumiso` `nanbanzuke` | Point anywhere |
| B6 stretch | `asazuke` `chahan` | Only if B1–B5 are clean |

## 6. Interfaces this ticket does not own, and what it hands over

**To T-003-06**, which fills `counters.json` sections and renames the gap file's block:

- The section for each of the 26 slugs is the table in §3 and in `design.md` D1. It is recorded in
  `progress.md` as a flat slug → section list so it can be pasted rather than re-derived.
- "Also here" gets the eight existing slugs the gap file already named: `karaage`, `gyoza`,
  `okonomiyaki`, `chawanmushi`, `japanese-beef-curry`, `teriyaki-sauce`, `shichimi-togarashi`,
  `goma-dare`. "The soup and the rice" also gets `dashi` and `miso-soup`. **None of those ten is
  mine to edit** — they need a `>> counters:` line added, which is T-003-06's work, and they are
  recorded here so it does not have to re-sort them.

**Not handed over, because they are findings rather than work:** `ochazuke`, `katsudon`, `korokke`
and the home `kare raisu` cannot be written as one honest table each without a component that does
not exist. `design.md` D1 has the reason per dish.

## 7. Verification shape

- Per file: `node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook`, read for the
  staircase as well as for `ok`.
- Per batch: the same over the batch's paths, then `lisa commit-ticket`.
- Once at the end: `npm run recipes`, which is the only thing that validates `pairs-with`. **It
  parses the whole collection, including three sibling tickets' in-flight files**, so a failure
  there has to be attributed before it is believed. A failure in a path I do not own is reported,
  not fixed.
