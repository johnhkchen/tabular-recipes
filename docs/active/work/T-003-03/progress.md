# T-003-03 — Progress

## Done

All six commits landed through `lisa commit-ticket`. Twenty-one new `.cook` files, all in
`recipes/soups/`, all naming `counters: The Soup Pot`. Nothing outside `recipes/**` was touched
and no pre-existing file was edited.

| commit | files |
| --- | --- |
| The pot a house makes when nobody has decided | rank 1 |
| The summer melon, the octopus, the cough pot, the spring pot and the flower | ranks 2–6 |
| The child's pot, the winter tonic, the mixed packet, the small pot and the scallop | ranks 7–11 |
| The lung, the sleepless house, deep summer, the new mother and the fruit pot | ranks 12–16 |
| Five nightly bowls: the water boils first | 滾湯 ranks 1–5 |
| The tap is not an ingredient | a fix to rank 12 (see Deviations) |

Counts against the criteria: **21 files** (≥ 20), **16 老火湯** (≥ 12), **5 滾湯** (≥ 5).
`node scripts/check-recipes.mjs --labels` reports **ok** for all 21.

## Where each soup came from

The criterion: "The work artifact says, for each soup, where the method and the pairing came
from. Nothing is invented to fill a section." Sources are keyed as:

- **G** — `docs/gaps/soup-pot.md`, which is itself sourced (hk01, 鴻福堂, China Sichuan Food, The
  Woks of Life, Kanlaw's 七十款 list, FWD, UrbanLife, Cosmopolitan HK, Made With Lau) and which
  names each soup's pairing and its stated purpose.
- **Gg** — the same document's dried-goods glossary, which gives each ingredient's job and the
  things it is standardly paired with.
- **M** — the four method rules in G (blanch from cold, one filling of water, no stirring, the
  broth is the dish), applied unchanged.

### 老火湯

| # | soup | method | pairing | anything added beyond the source |
| --- | --- | --- | --- | --- |
| 1 | green radish and carrot | M | G rank 1 — green radish, carrot, pork neck bone, honey dates, apricot kernels, corn, dried duck gizzard | nothing |
| 2 | winter melon and job's tears | M | G rank 2 — melon skin on, raw + toasted job's tears, ribs, dried scallop | nothing |
| 3 | lotus root and dried octopus | M | G rank 3 — lotus root, one dried octopus, pork bones, peanuts, black-eyed peas | red dates, from Gg ("red dates … Chinese yam, black chicken, lotus seed") as a general pork-pot sweetener, not as a claimed pairing |
| 4 | watercress and honey date | M + G's own note that the watercress goes in twice | G rank 4 | nothing |
| 5 | peanut, black-eyed pea, chicken feet | M | G rank 5 — peanuts, black-eyed peas, chicken feet, pork shin | red dates, as above |
| 6 | overlord flower | M + the soak, from G's "dried-goods soaking note" | G rank 6 — flower, 南北杏, pork bones, honey dates | dried figs, from Gg ("dried fig … sweetens like the honey date but drier") |
| 7 | corn and carrot | M | G rank 7 — corn in rounds, carrot, pork bones, "sometimes a fig" | nothing; the fig is the only dried thing and G's "sometimes" is why it is one |
| 8 | Chinese yam, goji, black chicken | M + goji late, from Gg ("added late because it is already soft") | G rank 8 | nothing |
| 9 | ching bo leung | M | G rank 9 lists the packet: 淮山, 玉竹, 蓮子, 百合, 芡實, 沙參, 薏米 + lean pork or ribs | nothing; each ingredient's note is Gg verbatim in sense |
| 10 | sha shen and yu zhu | M | G rank 10 — four things, and Gg's "**沙參**, always — the two are sold and used as one pair" | nothing |
| 11 | hairy gourd and dried scallop | M, at G's stated shorter length ("quick for the genre") | G rank 11 | nothing |
| 12 | dried bok choy and pork lung | M + G's lung note (washed until it runs white; no number, because G says writing one would be inventing it) | G rank 12 | the dry-wok browning after the wash, which is the standard finish to that preparation and is stated in the file as part of the wash rather than as a separate claim |
| 13 | lotus seed and lily bulb | M | G rank 13 — the 安神 pot; Gg pairs lotus seed with lily bulb, red dates, lean pork | nothing |
| 14 | old cucumber and rice bean | M | G rank 14 — old cucumber, rice beans, dried scallop, pork bones | aged tangerine peel, from Gg ("陳皮 … red bean, fish, duck, any fatty pot") |
| 15 | green papaya, peanut, trotter | M | G rank 15 — green papaya, raw peanuts, pork trotter | red dates, as above |
| 16 | apple and pear | M | G rank 16 — apple, snow pear, 南北杏, pork bones | honey dates, from Gg as the standard 潤 sweetener alongside the kernels |

### 滾湯

| # | soup | method | pairing | added |
| --- | --- | --- | --- | --- |
| 1 | tomato, potato, beef | G's own note: "the tomatoes are cooked down in oil first — that step is the recipe" | G 滾湯 rank 1 | the cornstarch-and-soy dressing on the sliced beef, which is the ordinary Cantonese handling of thin beef and is why the two minutes work |
| 2 | seaweed and egg drop | G 滾湯 rank 2 — laver, egg, sesame oil, five minutes | same | dried shrimp, as the usual savoury base for a plain 紫菜蛋花湯 |
| 3 | mustard greens and tofu | G 滾湯 rank 3 — "the bitterness is the point and the ginger is why it is bearable" | same | lean pork, which G's own dish name (芥菜豆腐**瘦肉**湯) contains |
| 4 | crucian carp and tofu | G 滾湯 rank 4 — fried in the pot first, then boiled hard; "the only place in this whole shelf where a hard boil is correct, because that is what turns it milky white" | same | nothing |
| 5 | century egg and amaranth | G 滾湯 rank 5 — ten minutes, bright pink | same | garlic fried in oil, which is the standard opening of this bowl |

**Nothing was invented to fill a section.** Where something is in a file that G did not name for
that soup, it is in the table above and it comes from G's own glossary of standard pairings.

## What was not written, and why

The criterion: anything skipped is named with a reason. Nothing in the ranges written was skipped
— ranks 1–16 of the 老火湯 block and 1–5 of the 滾湯 block are complete and in order. What lies
beyond where the count reached:

- **老火湯 17, 五指毛桃土茯苓豬骨湯.** G marks it "strongly regional, and worth a line saying so."
  With the target already met by sixteen, the ticket's rule — write a different one rather than
  fill a rank with something plausible — points away from it.
- **老火湯 18, 蟲草花響螺瘦肉湯.** G says the dried conch is used "if it can be got" and that the
  file must distinguish cultivated cordyceps flower from the wild caterpillar fungus. Two
  qualifications on one entry is the shakiest thing on the list.
- **滾湯 6–10** (silk gourd and straw mushroom; pork liver and spinach; winter melon, dried shrimp
  and glass noodle; hairy gourd, conpoy and glass noodle; tomato and egg drop). G's reading order
  is explicit that the extra files go down the **老火湯** block after the first five quick ones,
  which is what was done. These are the obvious next tranche for anyone extending the shelf.
- **The four congee entries.** Out of scope by the ticket's own words: `congee` exists and "needs
  shelving, not rewriting", which is T-003-06's job.

## Found already here — recorded by slug for T-003-06

Not edited, not rewritten. The section each belongs to on The Soup Pot's board, per
`docs/gaps/soup-pot.md`:

| slug | section | note |
| --- | --- | --- |
| `congee` | Congee and rice soups | shelved at the Dim Sum Counter; T-003-06's criterion names it |
| `congee-instant-pot` | Congee and rice soups | the Instant Pot variant of the above |
| `egg-drop-soup` | Quick daily soups (滾湯) | a Takeout Counter soup, but a genuine 滾湯 by method |
| `wonton-soup` | Also here | Takeout Counter; a noodle lunch in a Cantonese house, not a home soup |
| `hot-and-sour-soup` | Also here | Takeout Counter; northern by way of an American menu |
| `chicken-feet` | Also here | Dim Sum Counter; listed because the feet are the body of rank 5 |
| `chicken-broth` | Also here | the Deli's, and explicitly **not** what these soups start from |

## Handed to T-003-06 — the ingredients with no aisle

`src/lib/shopping.test.ts` asserts under 2% of distinct ingredient names fall through to `other`.
This ticket may only touch `recipes/**`; `src/data/aisles.json` is T-003-06's file and its
criteria require the coverage test to pass. The sixteen names this shelf adds that have no aisle:

```
Solomon's seal · adenophora root · aged tangerine peel · amaranth · apricot kernels
crucian carp · dried lily bulb · dried overlord flower · fox nut · hairy gourd
job's tears · raw job's tears · toasted job's tears · laver · lotus root · snow pears
```

Notes for whoever places them: most are bought by the handful from a herbalist or a dried-goods
shop, which T-003-06's ticket already flags may not honestly be any existing aisle. `crucian
carp` is a fishmonger; `amaranth`, `hairy gourd`, `lotus root` and `snow pears` are produce;
`laver` is the seaweed shelf. `raw job's tears` and `toasted job's tears` are one product in two
states and a pattern on `job's tears` catches all three names.

Fifty other new names placed themselves correctly with no change needed — the pork cuts to
`butcher`, the dried seafood to `fishmonger`, 淮山 / 菜乾 / 杞子 to `produce`, 紅棗 / 蓮子 /
赤小豆 / 花生 to `dry-goods`.

## Deviations from the plan

1. **`@running water{}` removed from rank 12.** Written as an ingredient with no quantity, it
   produced a null amount, and `src/lib/units.test.ts` requires every amount in the collection to
   be a finite number. A tap is not an ingredient; the wash is now described in the step's prose.
   Caught by the plan's own whole-suite step, fixed, and committed on its own.
2. **`>> time:` tightened on two files** (`watercress-honey-date-soup` 3 hr 30 min → 3 hr 15 min,
   `hairy-gourd-dried-scallop-soup` 2 hr → 2 hr 15 min) so the author's claim and the computed
   schedule agree to within the prep time rather than drifting.
3. **Rank 15 folded the skim into the season step** rather than taking a fifth operation, because
   a step that consumes a previous step but introduces no ingredient of its own is not a shape
   this collection uses. Label: `skim the fat, then season`.

## Verification, as run

- `node scripts/check-recipes.mjs --labels` — **ok** on each of the 21, individually and as a
  batch; `all 66 file(s) draw a table` across `recipes/soups/`.
- Clock probe over all 21 through the real `normalise` + `buildSchedule`: every file's longest
  timer reads **unattended** with **stated** confidence; the old-fire pots come out at 8–12
  minutes hands-on against 1½–3½ hours of walking away.
- Every timer named (0 unnamed across 21 files); every file declares slack; every `aka` carries
  characters plus two romanisations plus the English name.
- `npm run build` — **succeeds**, 682 pages.
- `npx vitest run` — three red, none of them this ticket's work; the detail is in `review.md`.
