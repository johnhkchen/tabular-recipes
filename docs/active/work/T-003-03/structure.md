# T-003-03 — Structure

The blueprint: exact files, exact shape, exact shared wording. No code, but the shape of it.

## Files

**Created — 21, all in `recipes/soups/`.** Nothing is modified and nothing is deleted. No file
outside `recipes/**` is touched by this ticket at all.

**Not touched, recorded for T-003-06** (found already present; the criteria say record by slug,
do not rewrite): `congee`, `congee-instant-pot`, `egg-drop-soup`, `wonton-soup`,
`hot-and-sour-soup`, `chicken-feet`, `chicken-broth`.

## The two skeletons

### 老火湯 — four to six operations

```
step 1   note, no ingredients   → header row above the table
step 2   blanch the meat from cold, tip it away, rinse       ┐
step 3   rinse / soak the dried goods                        ├→ two branches
step 4   simmer, one filling of cold water, barely a quiver  ┘  merge here
step 5   season at the end
step n   note, no ingredients   → footer row below the table
```

Back-references are relative and count **every** step including the notes, so the header note has
to be step 1 and the footer note has to be last. Step 4 refers to `@&(~2)blanched bones{}` and
`@&(~1)dried goods{}`.

### 滾湯 — three to five operations

```
step 1   note, no ingredients                         → header row
step 2   fry the base / brown the fish                ┐
step 3   boil, water in first                         ├→ merge
step 4   stir the delicate thing in, at the end       ┘
step 5   season
```

No blanch, no footer note about spent solids — the solids are the dish here, which is half of
what makes the two genres different on one shelf.

## Shared wording, fixed once (D4)

| slot | text |
| --- | --- |
| blanch label | `blanch from cold, then rinse the bones` |
| simmer label | `simmer 3 hr, barely a quiver` |
| season label | `season at the end, never at the start` |
| water | `@cold water{3%qt}(2.8 L; the pot is filled once and not topped up)` |
| pot | `#soup pot{}` |
| footer (老火湯) | `The broth is the dish. The solids — 湯渣 — are spent by the end; they go on a side plate with soy sauce, or they do not.` |

## Metadata block, every file

```
>> title:        English name, title case
>> category:     Soups
>> tags:         ingredients, cantonese, soup, old-fire soup | quick soup, season, stovetop
>> counters:     The Soup Pot
>> aka:          characters, jyutping-no-tones, plain-keyboard, English, 老火湯, lo fo tong
>> servings:     4–6
>> time:         3 hr 30 min           (authorMinutesOf-readable — no ranges, no "about")
>> slack:        level — the failure this pot actually has
>> step.N:       one label per step, opening with a verb VERB_ICONS knows
```

## The 16 old-fire soups

Order is the gap note's rank order, unbroken.

| # | slug | 湯名 | body | dried goods | fresh | slack |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `green-radish-carrot-pork-bone-soup` | 青紅蘿蔔豬骨湯 | pork neck bone | honey date, 南北杏, dried duck gizzard | green radish, carrot, corn | forgiving |
| 2 | `winter-melon-jobs-tears-soup` | 冬瓜薏米排骨湯 | pork rib | job's tears raw + toasted, dried scallop | winter melon (skin on), ginger | forgiving |
| 3 | `lotus-root-dried-octopus-soup` | 蓮藕章魚豬骨湯 | pork neck bone | dried octopus, peanut, black-eyed pea, red date | lotus root, ginger | forgiving |
| 4 | `watercress-honey-date-soup` | 西洋菜蜜棗豬骨湯 | pork neck bone | honey date, 南北杏 | watercress (in twice) | narrow |
| 5 | `peanut-black-eyed-pea-chicken-feet-soup` | 花生眉豆雞腳湯 | chicken feet + pork shin | peanut, black-eyed pea, red date | ginger | forgiving |
| 6 | `overlord-flower-soup` | 霸王花南北杏豬骨湯 | pork neck bone | overlord flower, 南北杏, honey date, dried fig | — | forgiving |
| 7 | `corn-carrot-pork-bone-soup` | 粟米紅蘿蔔豬骨湯 | pork neck bone | dried fig | sweet corn, carrot, ginger | forgiving |
| 8 | `chinese-yam-goji-black-chicken-soup` | 淮山杞子紅棗烏雞湯 | black chicken | 淮山, red date, goji (late) | ginger | narrow |
| 9 | `ching-bo-leung-soup` | 清補涼湯 | pork rib | 淮山, 玉竹, 蓮子, 百合, 芡實, 沙參, 薏米 | — | forgiving |
| 10 | `sha-shen-yu-zhu-soup` | 沙參玉竹瘦肉湯 | lean pork | 沙參, 玉竹, honey date | — | forgiving |
| 11 | `hairy-gourd-dried-scallop-soup` | 節瓜瑤柱瘦肉湯 | lean pork | dried scallop | hairy gourd, ginger | forgiving |
| 12 | `dried-bok-choy-pork-lung-soup` | 菜乾蜜棗豬肺湯 | pork lung + pork shin | dried bok choy, honey date, 南北杏 | — | unforgiving |
| 13 | `lotus-seed-lily-bulb-soup` | 蓮子百合紅棗瘦肉湯 | lean pork | lotus seed, dried lily bulb, red date | — | forgiving |
| 14 | `old-cucumber-rice-bean-soup` | 老黃瓜赤小豆豬骨湯 | pork neck bone | rice bean, dried scallop | old cucumber | forgiving |
| 15 | `green-papaya-peanut-trotter-soup` | 木瓜花生豬腳湯 | pork trotter | peanut, red date | green papaya, ginger | forgiving |
| 16 | `apple-pear-pork-bone-soup` | 蘋果雪梨南北杏豬骨湯 | pork neck bone | 南北杏, honey date | apple, snow pear | forgiving |

Seasons carried in the header notes, from the gap note's frame: 1 any · 2 summer · 3 autumn–winter
· 4 autumn · 5 spring · 6 autumn · 7 any · 8 winter · 9 summer · 10 autumn · 11 any · 12 autumn ·
13 any · 14 deep summer · 15 any (occasion) · 16 autumn.

**Where the skeleton takes a fifth operation:** 4 (the second handful of watercress), 8 (goji in
for the last ten minutes), 12 (the lung is washed and browned before anything else), 15 (the fat
is skimmed off a trotter pot).

## The 5 quick daily soups

| # | slug | 湯名 | the move that is the recipe | slack | time |
| --- | --- | --- | --- | --- | --- |
| 1 | `tomato-potato-beef-soup` | 番茄薯仔牛肉湯 | the tomatoes are fried down in oil first | narrow | 45 min |
| 2 | `seaweed-egg-drop-soup` | 紫菜蛋花湯 | the egg goes into water that has stopped moving | narrow | 15 min |
| 3 | `mustard-greens-tofu-soup` | 芥菜豆腐瘦肉湯 | the ginger is fried first; the bitterness stays | narrow | 30 min |
| 4 | `crucian-carp-tofu-soup` | 鯽魚豆腐湯 | fry the fish, then **boiling** water, then boil hard | unforgiving | 40 min |
| 5 | `century-egg-amaranth-soup` | 皮蛋莧菜湯 | garlic in oil, amaranth in for three minutes | narrow | 20 min |

`seaweed-egg-drop-soup` is a different soup from the existing `egg-drop-soup` and does not touch
it: no cornstarch, laver as the body, sesame oil at the end. The gap note says so explicitly.

## Ingredient notes — the glossary, distributed

Every dried good carries its romanisation and its job on its own row, in one consistent form, so
twenty-one tables agree instead of each re-explaining the same handful of goods:

```cooklang
@honey dates{2}(mat zou; sweetens a pot with no sugar in it — the word used is 潤, moistening)
@apricot kernels{1/4%cup}(naam bak hang; the sweet and the bitter kind together, about three to
  one — the bitter kind is used in small amounts and always cooked through, never raw)
@dried Chinese yam{1%oz}(waai saan; the everyday 健脾 tonic, the spleen-and-stomach word)
@goji berries{2%Tbs}(gei zi; in at the end, because they are already soft)
@red dates{6}(hung zou; pitted — the stone is held to make a pot 燥)
@dried scallops{4}(jiu cyu; soaked, and the soaking water goes in with them)
@dried octopus{1%small}(zoeng jyu gon; the savour, not a garnish — a pot without it is a
  different soup)
@aged tangerine peel{1%piece}(can pei; a pinch, not a handful — it cuts the richness)
```

The style is: **romanisation first, then what the tradition says it is for, attributed.** Never a
verb whose subject is the soup and whose object is a person (D9).

## Verbs available to a `>> step.N:` label

Checked against `VERB_ICONS` in `src/lib/icons.ts`, which this ticket may not edit and whose
coverage test fails the whole run on an unknown leading verb:

**In use here** — `blanch` · `rinse` · `soak` · `wash` · `simmer` · `boil` · `fry` · `brown` ·
`slice` · `trim` · `scatter` · `stir` · `skim` · `strain` · `season` · `warm` · `top` · `finish`.

**Deliberately avoided** — `serve`, `discard`, `tip`, `drop`, `lift`, `taste`, `check`: not in the
map, so any one of them at the head of a label turns the collection's icon test red.

## Timer names, and what each claims

| written | reads as | why |
| --- | --- | --- |
| `~simmer{3%hr}` | **unattended**, stated | `simmer` is in `UNATTENDED` in `src/lib/time.ts` — this is the shelf's whole claim |
| `~soak{30%min}` | unattended, stated | `soak` likewise |
| `~blanch{8%min}` | hands-on | `blanch` is in neither set, so it falls to the default — honest, you are at the sink |
| `~boil{20%min}` | unattended, stated | only used for the carp's hard boil and the quick pots |

Every timer is named; none is bare. No hands-on timer anywhere approaches the four-hour line that
`src/lib/collection.test.ts:78` fails on.

## Ordering of the work

1. Write `green-radish-carrot-pork-bone-soup` first and check it with `--labels`. It is the
   default household pot and it carries the shared wording every other old-fire file copies, so
   it is the reference and it has to be right before there are twenty of it.
2. Then old-fire 2–16 in rank order, in batches, checking each batch.
3. Then the five quick soups, whose skeleton is different and needs its own first-file check.
4. Then a whole-shelf pass: `check-recipes.mjs --labels` over all 21 at once, the clock probe over
   all 21, and `npx vitest run src/lib/icons.test.ts src/lib/collection.test.ts
   src/lib/schedule.test.ts`.

## What this deliberately leaves behind

- **`src/data/aisles.json`** — fourteen or so new ingredient names will have no aisle. Not this
  ticket's file; T-003-06 owns it and its criteria require the coverage test to pass. The exact
  list goes in `progress.md`.
- **`src/data/counters.json`** — the five section `items` arrays stay empty. T-003-06 fills them,
  and until it does the twenty-one land in the menu's `Also` bucket, which `menuFor` adds
  precisely so a shelf never silently drops a dish.
- **`docs/gaps/soup-pot.md`** — its `## What is already here` heading is T-003-06's rename. Not
  edited here; the criteria forbid editing any pre-existing file.
