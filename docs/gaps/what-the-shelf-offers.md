# What the shelf offers the three cooks

The fourth whole-shelf reading, after T-001-18, T-002-09 and T-003-07, and the first one taken
from outside the collection looking in. Those three read the shelf against itself — what is
missing from a counter, what no single classifier could see. **This one reads it against the three
people in [`docs/knowledge/cooks.md`](../knowledge/cooks.md)** and ends with a ranked
recommendation of what to build next.

Taken **7 August 2026, at 685 recipe files and 27 categories.** Every number below is produced by
[`docs/active/work/T-012-02/read-the-shelf.ts`](../active/work/T-012-02/read-the-shelf.ts) —
run it and you get this document's arithmetic back:

```
PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH" \
  node docs/active/work/T-012-02/read-the-shelf.ts
```

Its full output is kept at `docs/active/work/T-012-02/reading-output.txt`. It reads
`src/generated/recipes.json`, `src/data/staples.json` and — for the schedule half —
`src/lib/schedule.ts` itself, so the hand-off numbers are `buildSchedule`'s own and not a second
model of the same graph.

**This reading builds nothing.** No `.cook` file, no `src/`, no `scripts/`, and nothing on the
board is edited. Where it finds a story pulling against a person, that is a recommendation in
[§5](#5-where-the-personas-disagree-with-the-board), named with the ticket it concerns.

---

## How the counting was done

Three rules decide most of the numbers, and each was written before the number it produced.

### A plant is counted when it is on the plate as something you eat

Four bands. The headline is band A.

| Band | What is in it | Distinct |
| --- | --- | --: |
| **A — plant food** | vegetables, fruit, fungi, seaweed, fresh legumes | **76** |
| B — herbs | eaten by the sprig, seasoning by weight | 18 |
| C — pulses, grains, nuts, seeds | plant food, and not what *breadth* is asking about | 36 |
| D — process | spice, flour, sugar, oil, vinegar, extract, sauce, drink | *not counted* |

The line is band D against the rest, and it is drawn at **what the eater experiences as a
vegetable**. Cumin, cinnamon, bay leaf, vanilla and wheat flour are all plants botanically.
Counting them would return a large, cheerful number and answer nothing — persona one's complaint
is about what is on the plate, not what is in the spice tin. The same refusal `slack` makes when
it demands a reason and not just a level.

Fungi and seaweed are in band A. Neither is a plant botanically; both are the same thing to the
eater and to the argument.

**Names are folded to plants, not counted raw.** The collection has 1,081 distinct ingredient
names and they are uncontrolled: `carrot` / `carrots` / `grated carrot` / `shredded carrot` is one
plant, and `tomato` has ten spellings. The fold is an explicit table in the script, so a reader
who disagrees with a line can point at the line.

**The five heavy starches in band A** — potato, sweet potato, taro, yuca, plantain — are flagged
and subtracted where the question is *a plant that is not a potato*. Corn is flagged with them.
The winter squashes are **not** treated as starch: kabocha is not what anyone means by heavy
starch, and calling it one would be a thumb on the scale in the direction this reading wants to
go.

**All 1,081 names classify.** The residue is zero, which is what licenses the distinct-plant count
as a count rather than a sample.

### A dish is "built on a plant" when the plant is the dish

Two machine tests, union taken, then every candidate read by hand:

1. **named** — a non-starch, non-aromatic band-A plant appears in the title, `dish` or `aka`, and
   also in the ingredient list;
2. **dominant** — that plant is the largest ingredient by mass among the ingredients that are not
   water, stock or fat.

Mass is converted through one unit table, **volume at water density**, and count units (`2 cloves`,
`1 bunch`) are **not converted** — they return null and drop out of the arithmetic rather than
being assigned a plausible weight. `src/lib/shopping.ts` already refuses to compare grams to cups;
this follows it.

The machine found **147 candidates. 47 survived the hand check**, and the correction is the point:
both tests are noisy in known ways and the published number is the read one.

### A branch is "real" when a second pair of hands could take it

`buildSchedule`'s `lanes`, filtered three ways. See [§3, Holiday guests](#holiday-guests) for why
raw lanes cannot be counted and what the filter costs.

---

## 1. The cattle claim

> *more like cattle than a zoo animal*

**It survives, and the numbers are worse than the folder names suggested in one direction and
better in another.**

### What the folders say now

The ticket's table was taken at 658 files. One row has moved:

| | S-012, at 658 | Today, at 685 |
| --- | --: | --: |
| `stews-and-braises` | 103 | 103 |
| Sweets — cookies, cakes, bars, custards | **101** | **101** |
| `rice-beans-and-grains` | 59 | 59 |
| `salads` | 23 | 23 |
| **`vegetables-and-sides`** | **18** | **24** |

Meat tags run **229** across pork (80), chicken (79) and beef (70), against **33** `vegetarian`
and 13 `vegan`.

The six new files in `vegetables-and-sides` all arrived from one place, and it matters: they are
S-008's air fryer basket (`a7057a7`, *Put five vegetables in the basket, two of them at a tested
number*). **The one blocked ticket on the board is the ticket that has been fixing this problem.**
See [§5](#s-008--two-things-to-wash).

### What the ingredient lists say

Counted from the files rather than the folders:

| | |
| --- | --: |
| Distinct plants used across the collection, all bands | **130** |
| — band A, plant food | 76 |
| — band A minus the five heavy starches and corn | **71** |
| — band B, herbs | 18 |
| — band C, pulses, grains, nuts and seeds | 36 |
| **Savoury dishes built on a non-starch plant** | **47** |
| — of those, a vegetable **side** you would put beside a main | **16** |
| Sweets — cookies, cakes, bars, custards | **101** |
| **Distinct non-starch plants that actually carry a dish** | **23 of 71** |

**That last row is the finding, and it is sharper than the eighteen-vegetable-sides version.**
The collection knows about seventy-one non-starch plants. Twenty-three of them are ever the point
of a recipe. The other forty-eight — celery, leek, parsnip, turnip, jicama, lotus root, bamboo
shoot, snow pea, radicchio, arugula, okra, avocado and thirty-six more — appear only as a
component inside something else. **The breadth is in the ingredient lists and not on the plate**,
which is exactly the shape of complaint persona one made, and no folder could have shown it.

### The claim, stated plainly

**A hundred and one desserts and sixteen non-starch vegetable sides.** Widen from *side* to *any
savoury dish where the vegetable is the dish* and it is 101 to 47 — **2.2 sweets for every plant-
built savoury thing on the shelf.** The claim is confirmed.

S-012's *roughly eight* was a fair estimate of the wrong quantity: it counted the folder, minus
the starches, minus one block from another story. The right quantity is 16 sides, and 47 dishes,
and 23 plants. **It is bigger than eight and it is still the answer S-012 reached** — a balance
dial built on this shelf would return a few dozen files to everybody, forever, and the same
twenty-three plants.

### The 47, since a count with no list is a vibe

**Sides — 16.**
`air-fryer-broccoli` · `air-fryer-brussels-sprouts` · `air-fryer-cauliflower` ·
`air-fryer-padron-peppers` · `charred-broccoli` · `goma-ae` · `green-beans` · `hijiki-no-nimono` ·
`kabocha-no-nimono` · `kinpira-gobo` · `kiriboshi-daikon` · `ohitashi` · `roasted-beets` ·
`roasted-brussels-sprouts` · `roasted-cauliflower` · `stewed-squash`

**Salads — 11.** `greek-salad` · `harvest-chopped-salad` · `italian-chopped-salad` ·
`kale-caesar` · `panzanella` · `roasted-beet-salad` · `shaved-brussels-salad` · `som-tum` ·
`spinach-salad` · `sunomono` · `wedge-salad`

**Soups — 10.** `borscht` · `borscht-instant-pot` · `butternut-squash-soup` · `caldo-verde` ·
`cream-of-mushroom-soup` · `french-onion-soup` · `hong-kong-borscht` · `minestrone` ·
`mustard-greens-tofu-soup` · `tomato-soup`

**Stews — 5.** `collard-greens` · `collard-greens-instant-pot` · `collard-greens-slow-cooker` ·
`palak-paneer` · `ratatouille`

**Everything else — 5.** `shakshuka` · `fried-okra` · `turnip-cake` · `okonomiyaki` · `fatayer`

### What the hand check changed, and why the rules are noisy

Of 147 machine candidates, 100 were dropped and 2 were added. Both directions are informative.

**Dropped — the plant is a component, not the dish (the big class).** Five noodle dishes where
bean sprouts win the mass test only because the dried noodles are weighed in a unit the table
declines to convert (`pad-thai`, `beef-chow-fun`, `lo-mein`, `singapore-mei-fun`,
`soy-sauce-pan-fried-noodles`). Four tomato-sauced pasta and pizza (`one-pot-pasta`,
`skillet-lasagna`, `margherita`, `grandma-pie`) — the tomato is the sauce. Seven composed bowls
where a handful of kale or spinach outweighs everything solid (`harvest-bowl`,
`crispy-chickpea-bowl`, `chicken-pesto-bowl`, `fish-taco-bowl`, `bbq-tofu-bowl`,
`teriyaki-chicken-bowl`, `crispy-rice-bowl`). Two dumplings whose cabbage is filler (`gyoza`,
`egg-rolls`).

**Dropped — a condiment, not a dish: 34.** Every salsa, chutney, pickle, slaw and sauce.
`marinara-sauce`, `salsa-verde`, `do-chua`, `sauerkraut`, `coleslaw`, `baba-ganoush`,
`tzatziki`, `muhammara`, `mayonnaise` and twenty-five more. They are genuinely built on plants and
nobody eats a bowl of them for dinner. **They are reported and not counted**, because folding
them in would let the shelf claim thirty-four vegetable dishes it does not have.

**Dropped — a sweet: 20.** `carrot-cake`, `zucchini-bread`, `banana-bread`, `apple-pie`,
`peach-cobbler`, `mango-pudding`, `cherry-clafoutis` and thirteen more. Fruit desserts are built
on plants and they are already inside the 101.

**Dropped — the plant is named but the meat is the dish.** `beef-with-broccoli`, `orange-chicken`,
`thai-red-curry`, `thai-yellow-curry`, `tom-kha-gai`, `buri-daikon`, `chikuzenni`, `tonjiru`,
`new-england-boiled-dinner`, `brunswick-stew`.

**Added — two the rule missed, both for the same reason.** A dish built on an *aromatic* is
excluded by rule, because otherwise every stew on the shelf becomes an onion dish.
`air-fryer-padron-peppers` and `french-onion-soup` are the two files where the aromatic genuinely
is the dish, and they are added by hand.

### The `charred-broccoli` / `candied-yams` test, run both ways

The ticket's own example: a folder name is not a diet. Run the rule against all 24 files in
`vegetables-and-sides`:

| | Files |
| --- | --- |
| **Folder yes, rule yes — 15** | the sides above, minus `air-fryer-padron-peppers` |
| **Folder yes, rule no — 9** | `air-fryer-corn-ribs` · `air-fryer-sweet-potatoes` · `candied-yams` · `cornbread-dressing` · `creamed-corn` · `crispy-roast-potatoes` · `mashed-potatoes` · `roasted-sweet-potatoes` · `air-fryer-padron-peppers` |
| **Folder no, rule yes — 32** | the salads, soups, stews and five others above |

Eight of the nine rule-no files are starch — potato, yam, corn, cornbread. The ninth is the
padrón peppers the aromatic rule over-excluded and the hand check put back. **The folder is
one-third starch and the rule finds twice as many plant dishes outside the folder as in it.**
Both halves of the ticket's warning were correct.

---

## 2. The beans claim

> *cheap standbys — beans above all — get neglected although they were always an option*

**It survives, and the honest number is much smaller than 43.**

| | |
| --- | --: |
| Files mentioning a bean, lentil, chickpea, dal or pea, on the loosest reading | **72** |
| Through gate 1 — a pulse is the main thing | **29** |
| Through gate 2 — **and it reads as dinner** | **19** |
| Tofu and soy, reported separately and never folded in | 12 |

The loosest reading is 72 and not 43, and it is 72 because it counts `creme-brulee` (vanilla
*bean*), `french-vanilla-ice-cream`, `green-beans`, `som-tum` (long beans), `pad-thai` (bean
sprouts) and `char-siu` (fermented bean curd). **That is the number to distrust**, and it is
larger than the ticket's 43 for the same reason the ticket warned about folders: the word *bean*
is doing four different jobs.

**Gate 1 — a pulse is the main thing.** Excluded by rule, not by taste: pulse *flours*
(`gram flour`, `urad dal flour` — a pulse botanically, a batter in the kitchen); green vegetables
that are beans by name (`green beans`, `long beans`, `snow peas`); fermented pulse condiments
(`fermented black beans`, `red bean paste`, miso, soy sauce). 29 files survive.

**Gate 2 — would a person put this on the table as dinner.** Ten of the 29 fail, each for a
stated reason:

| Dropped | Why |
| --- | --- |
| `red-bean-paste`, `red-bean-ice` | a sweet filling and a dessert drink |
| `hummus` | a dip |
| `sweet-tart-shell` | the beans are **pie weights** — the clearest false positive on the shelf |
| `air-fryer-chickpeas`, `crispy-chickpeas` | a snack |
| `falafel` | a component; it is dinner inside a sandwich, not on a plate |
| `refried-beans`, `refried-beans-instant-pot` | a side, and the file's own tag says so |
| `black-eyed-peas` | a side at Meat and Three, `pork`-tagged |

**The 19 that are dinner.**
`boston-baked-beans` · `boston-baked-beans-instant-pot` · `boston-baked-beans-slow-cooker` ·
`butter-beans` · `chana-masala` · `crispy-chickpea-bowl` · `cuban-black-beans` ·
`cuban-black-beans-instant-pot` · `dal-tadka` · `ful-medames` · `ful-medames-instant-pot` ·
`gigantes-plaki` · `gigantes-plaki-instant-pot` · `harira` · `kitchari` · `mujaddara` ·
`black-bean-soup` · `red-lentil-soup` · `split-pea-soup`

**And 19 overstates it, because five are kit siblings of another five.** The three Boston baked
beans are one dish; so are the two Cuban black beans, the two ful medames, the two gigantes
plaki. **Counted as dishes rather than files, persona two has fourteen.** Four of the fourteen
are a soup. Four carry pork in the ingredient list, which is not a defect and is worth knowing for
a household managing heart health.

**Fourteen dishes is the size of the thing they said was neglected.** It is not nothing — it is
four more than the collection has vegetable soups — and it is a fortnight's rotation at most, with
no repetition allowance. The ticket predicted much smaller than 43. It is 19 files, 14 dishes.

---

## 3. The three, run as queries

### Cooking for the day

> *One person, peeling off a small enough recipe to use up what is in the fridge without a store
> run. It cannot be too oily or too salty, and it cannot be lacking nutrition.*

**The answer is two recipes, and one of them is a hot malted milk drink.**

#### The assumed kitchen, in full

This is the whole answer and it must be visible, so it is printed before the slugs.

`src/data/staples.json`'s **31 staples** are the floor. They are not enough on their own, and the
reason is worth stating: **the staples doctrine is written for a shopping list, not for a
kitchen.** Its own second clause says *"everything a recipe wants by the cup or the pound is
shopping, however ordinary it is. Flour, butter, sugar, eggs, milk and rice are shopping."* That
is the right rule for what to print on a list and the wrong rule for what a person has. Run this
query on the 31 alone and it returns **0 recipes**, and the 0 is a fact about the doctrine rather
than about the shelf.

So the assumed kitchen is the 31, plus two written layers:

**The cupboard (19 patterns).** Ordinary dry goods a cooking household keeps and `staples.json`
calls shopping:
`all-purpose flour` · `plain flour` · `flour` · `granulated sugar` · `sugar` ·
`light brown sugar` · `dark brown sugar` · `brown sugar` · `long-grain white rice` · `rice` ·
`rolled oats` · `canned whole tomatoes` · `crushed tomatoes` · `canned crushed tomatoes` ·
`tomato paste` · `white sandwich bread` · `breadcrumbs` · `chicken stock` · `vegetable stock`

**The fridge (23 patterns).** Perishables, chosen by one rule — things a one-person kitchen that
cooks at all has on an ordinary Tuesday:
`eggs` · `egg` · `unsalted butter` · `butter` · `whole milk` · `milk` · `plain yogurt` ·
`whole-milk yogurt` · `sharp cheddar` · `yellow onion` · `onion` · `onions` · `garlic` ·
`fresh ginger` · `scallions` · `scallion` · `carrot` · `carrots` · `celery` · `lemon` ·
`lemon juice` · `flat-leaf parsley` · `cilantro`

That is a generous kitchen for one person and it is capped deliberately: **any answer can be
manufactured by adding ingredients.**

#### The query, and the answer

Serves 1 or 2 as written · every ingredient a staple or in the kitchen above · not a heavy starch.

| | |
| --- | --: |
| Recipes serving 1 or 2 as written | 50 |
| — of those, not a heavy starch | 27 |
| — **of those, needing no store run** | **2** |

**`horlicks`** (serves 2 — boiling water, evaporated milk, sugar, malted milk powder) and
**`hong-kong-egg-sandwich`** (serves 1 — eggs, evaporated milk, salt, butter, white pepper,
bread).

A drink and a sandwich. **Neither is dinner and neither has a vegetable in it.**

#### Sensitivity, because an assumption this large has to show its working

| Kitchen | Answer |
| --- | --: |
| staples only — the doctrine as written | **0** |
| staples + cupboard, no fridge | **0** |
| **staples + cupboard + fridge** | **2** |
| staples + kitchen + tomato + potato | **2** |

**The answer does not move.** Adding tomatoes and potatoes — the two most plausible extra things
in any fridge — changes nothing. That is what makes this a result about the shelf rather than
about the assumption.

#### How far off the rest are

Of the 27 that serve one or two and are not a starch:

| Missing | Count | The near ones |
| --: | --: | --- |
| 0 | 2 | `horlicks`, `hong-kong-egg-sandwich` |
| 1 | 5 | `lemon-coke-with-ginger` (cola) · `milkshake` (ice cream) · `yuenyeung` (coffee) · `grilled-cheese` (American cheese) · `luncheon-meat-and-egg-sandwich` (tinned luncheon meat) |
| 2 | 4 | `ca-phe-sua-da` · `egg-cream` · `iced-lemon-tea` · `ham-macaroni-soup` |
| 3+ | 16 | |

**Every one of the near misses is a drink or a sandwich.** The small-batch end of this collection
is a Hong Kong café menu, and that is a real finding about what got written for one person.

#### The whole shelf, ignoring servings

Because *serves two* might be the binding constraint rather than the shopping:

| Ingredients needing a shop | Recipes |
| --: | --: |
| 0 | **33** |
| 1 | 97 |
| 2 | 153 |
| 3 | 120 |
| 4 | 86 |
| 5 | 78 |
| 6+ | 118 |

**33 of 685 recipes can be cooked tonight from a well-stocked kitchen with no shop.** And the 33
break down like this: **twelve sweets** (`angel-food-cake`, `pound-cake`, `sugar-cookies`,
`shortbread-cookies`, `sable-cookies`, `madeleines`, `mantecadas`, `chiffon-cake`,
`peanut-butter-cookies`, `flan`, `lemon-curd`, `lemon-bars`), **eight sauces and dressings**
(`aioli`, `mayonnaise`, `toum`, `chimichurri`, `bechamel`, `cheddar-cheese-sauce`, `hollandaise`,
`homemade-ketchup`), **four spice blends** (`cajun-seasoning`, `chermoula`, `ginger-garlic-paste`,
`memphis-dry-rub`), two crusts, two plain rices, two pancakes, `seven-minute-eggs`, `horlicks` and
`hong-kong-egg-sandwich`.

**Not one of the 33 is a vegetable dish, and not one of them is dinner.** The shelf cannot answer
persona one's question today, and the reason is not the filter that does not exist — it is that
the food that would answer it has not been written.

### The family rotation

> *Take a week of dinners for four off this shelf without repeating a protein or a cuisine. Can it
> be done? What runs out first?*

**Yes, comfortably, and what runs out is the animals — at eleven.**

#### The week, done by hand

Seven dinners, seven proteins, seven counters, every one serving four or more as written:

| Night | Slug | Serves | Protein | Counter | Keeps? |
| --- | --- | --: | --- | --- | --- |
| Mon | `dopiaza` | 4 | chicken | Curry House | yes |
| Tue | `hungarian-goulash` | 6 | beef | Deli / Diner | yes |
| Wed | `tonjiru` | 4 | pork | Japanese Home Cooking | — |
| Thu | `mujaddara` | 6 | pulse (lentil) | Shawarma Counter | — |
| Fri | `new-england-clam-chowder` | 6 | shellfish | Diner, One Pot | yes |
| Sat | `irish-stew` | 6 | lamb | Diner, One Pot | yes |
| Sun | `tortilla-espanola` | 4 | egg | One Pot | yes |

**Seven proteins, no repeats. The counters do repeat, and the bend is recorded rather than
hidden:** four of the seven carry One Pot and three carry Diner, because `hungarian-goulash`,
`new-england-clam-chowder`, `irish-stew` and `tortilla-espanola` are shelved there and mostly
nowhere else.

That is a fact about the counter namespace rather than about the week. **A counter is a shop, not
a cuisine** — `counters.md` settled that — and One Pot is not a shop at all but one of the four
*bargains* S-013 names. By cuisine as a person would say it out loud, the week is Indian,
Hungarian, Japanese, Levantine, New England, Irish and Spanish, and it holds with no repeat.
**The collection has no cuisine field**, and that is the one thing this exercise found that a
rotation feature would need and cannot read today.

#### The ceiling, computed rather than guessed

A week without repeating a protein or a cuisine is a **maximum matching** between proteins and
counters over the pairs the shelf actually has. Over the 248 recipes that serve four or more and
are a meal on their own:

**The longest possible streak is eleven nights.** Every one of the eleven proteins can be given
its own counter:

```
chicken   @ One Pot                 arroz-con-pollo
beef      @ Pizzeria                risotto-alla-milanese
pork      @ Instant Pot             boston-baked-beans-instant-pot
egg       @ The Bowl Shop           seven-minute-eggs
pulse     @ Meat and Three          black-eyed-peas
fish      @ Diner                   tuna-noodle-casserole
shellfish @ Takeout Counter         singapore-mei-fun
lamb      @ Shawarma Counter        gyro-meat
tofu      @ Japanese Home Cooking   takikomi-gohan
turkey    @ Smokehouse              smoked-turkey-breast
dairy     @ Curry House             palak-paneer
```

*(A stock is not the protein of a dish and neither is a sauce — without that rule, "chicken stock"
makes a risotto a chicken dinner and "fish sauce" makes every Vietnamese recipe a fish one. The
count above drops both.)*

#### What runs out first: the proteins, not the cuisines

**Eleven proteins against twenty-one counters.** The protein side of the graph is what binds, and
it binds unevenly:

| Protein | Counters it can reach | Recipes |
| --- | --: | --: |
| dairy | **1** — Curry House | 1 |
| turkey | **3** | 3 |
| shellfish | 5 | 8 |
| fish | **5** | 9 |
| tofu | 5 | 7 |
| lamb | 6 | 12 |
| egg | 11 | 25 |
| pulse | 12 | 29 |
| beef | 16 | 60 |
| pork | 16 | 51 |
| chicken | 19 | 60 |

**Fish is the answer to *what runs out first*.** Not because there are only nine — lamb has
twelve and dairy has one — but because fish is the protein a household trying to get off meat
reaches for, and the nine are `tuna-noodle-casserole`, `nanbanzuke`, `saba-no-misoni`,
`buri-daikon`, `crucian-carp-tofu-soup` and four more: **five of the nine are Japanese, and one
is a tinned-tuna casserole.** A household that wants fish twice a week is eating Japanese twice a
week or eating the casserole again.

Behind that, the second thing to run out is the **vegetable to put beside any of it**. The week
above has one vegetable in it, in the goulash. From [§1](#1-the-cattle-claim), there are sixteen
non-starch sides on the whole shelf and four of them are the same air fryer basket. **A seven-night
rotation exhausts a quarter of the collection's vegetable sides.**

And the third: three of the seven nights have no `keeps` line, so the household cannot know which
of them survives to be eaten again — the exact fact persona two would need to stop cooking every
night. `keeps` stands at **138 of 685** with T-011-04 mid-backfill.

### Holiday guests

> *How many recipes have a tree that genuinely splits into work two people can do at once?*

**Thirty-four of 685 — five per cent — and the raw lane count says two hundred.**

#### Why the lanes cannot be counted raw

`buildSchedule` packs tasks into `lanes` first-fit by start time, and 200 recipes have more than
one lane. That number is not the multi-cook number, for two reasons the module states about
itself:

- **`packLanes` gives an untimed task its own slot deliberately**, so it does not vanish from the
  timeline. `charred-broccoli` — the ticket's own example file — has two lanes, and the second is
  `stir the lemon-garlic oil`, an untimed step of zero minutes. Nobody hands that over.
- **A lane is a row on a timeline, not a person.** Two tasks can share a lane and be an hour
  apart.

So a lane is admitted as a hand-off-able branch when all three hold:

1. it does not carry the recipe's critical path;
2. its tasks hold **at least `BREAK_MINUTES` = 5 minutes of hands-on work** — the module's own
   constant, argued in `src/lib/schedule.ts` from the collection's real gap distribution, rather
   than a second threshold invented here;
3. at least one of its tasks **overlaps in clock time** with a critical-path task. Work that could
   merely be done early is not work a second person can take *while the cook is busy*.

The hands-on minutes are summed **timer by timer**, not off `task.attention`. `schedule.ts` labels
a whole step hands-on when any timer in it is — right for a label, wrong for arithmetic, and it
says so at lines 167–180. Without that split, a 128-minute step that is 8 minutes of hands and
120 minutes of proving would read as a two-hour job to hand over.

#### The result

| | Recipes |
| --- | --: |
| Raw: more than one lane | **200** |
| Filtered: at least one hand-off-able branch | **34** |
| Filtered: two or more | **2** |
| No timers at all — *cannot say*, not zero | **275** |

**The gap between 200 and 34 is the measure of how much of the multi-cook feature is an artefact
of packing.** `docs/knowledge/cooks.md` §3 says the multi-cook model is *half-built by accident*.
Measured, it is about a sixth built.

And **275 recipes cannot answer the question at all** — they have no timers, so there is no
branch the filter can see. That is a cannot-say, in exactly the sense S-010 built its third
filter state for, and it is 40% of the shelf.

#### The 34, most branches first

`mole-poblano` (2) · `chicken-pesto-bowl` (2) · `mujaddara` · `beef-bourguignon-instant-pot` ·
`chile-verde-slow-cooker` · `chopped-liver` · `borscht` · `gigantes-plaki-instant-pot` ·
`chile-verde` · `potato-knish` · `borscht-instant-pot` · `refried-beans-instant-pot` ·
`refried-beans` · `chikuzenni` · `crispy-rice-bowl` · `teriyaki-chicken-bowl` ·
`corned-beef-hash` · `kibbeh` · `pho-broth-instant-pot` · `pho-broth` · `jalfrezi` · `passanda` ·
`cuban-black-beans` · `pork-liver-pate` · `gigantes-plaki` · `spicy-lamb-bowl` · `wu-gok` ·
`tinga-de-pollo` · `miso-salmon-bowl` · `harvest-chopped-salad` · `dal-tadka` · `fish-taco-bowl` ·
`panzanella` · `roasted-beet-salad`

**What the branch actually is, on the first three:**

- **`mole-poblano`** — the critical path is *toast and soak the chiles* (21 min), then blend, then
  a 45-minute simmer. Two whole branches run beside the soak: **char the tomatoes and onions** (10
  min) and **fry the nuts and seeds, then toast the spice** (9 min). A second cook can take either
  and never touch the first. This is a real hand-off and it is the best one on the shelf.
- **`chicken-pesto-bowl`** — four lanes, two of them real work overlapping the chicken.
- **`beef-bourguignon-instant-pot`** — 45 minutes of hands-on, one branch of it beside the
  pressure cycle.

**And two of the 34 are `borscht` and one is `harvest-chopped-salad`** — which is to say the
recipes that hand off best are not the big holiday roasts. **The collection has no big holiday
meal to test this on.** `roast-turkey` does not exist; `baked-turkey-wings` and
`smoked-turkey-breast` do. That is the single most useful thing this section found for persona
three, and it is a fact about the food, not about the graph.

---

## 4. What to build next, ranked from what the shelf can support

Four capabilities, ranked by what the collection could return on day one, with one veto:
**a capability whose day-one answer is the same small set for every reader is ranked last however
good it sounds**, because that is the eight-vegetable-sides failure shipped.

### The ranking

| | Capability | Day one | Verdict |
| --: | --- | --: | --- |
| **1** | **Work that can be handed to somebody else** | **34 recipes** | **Build it. Smallest, most honest, already measured.** |
| **2** | **A rotation that does not need polling** | **11 nights, 248 dinners** | **Build it second.** The shelf can feed it; the hard part is a design question, not a food shortage. |
| **3** | **Balance, and breadth of plants** | **16 sides · 47 dishes · 23 plants** | **Write food first.** |
| **4** | **Cooking from what is already in the fridge** | **2 recipes** | **Write food first, and more of it.** |

### 1 — Work that can be handed to somebody else

**What it needs.** A page to say how many cooks it is talking about. `docs/knowledge/cooks.md` §3
already names the problem exactly: two models of how many cooks there are live in one module, a
many-hands model behind `lanes`, `criticalPath` and `totalMinutes`, and a deliberate one-cook
model behind `longestHandsOnMinutes`. Nothing in the code is wrong enough to fail a test, which is
why it has gone unanswered.

**What it stands on.** `buildSchedule`, complete and tested: the DAG, the lanes, the critical
path, the hands-on/unattended split per timer, and `BREAK_MINUTES` already argued from the
collection's own data. The filter in [§3](#holiday-guests) is fifteen lines on top of it.

**Day one: 34 recipes**, each with a named branch. Plus a fourth state for the 275 that cannot
say — which S-010 has already built the pattern for.

**Does food have to be written first? No** — and this is the only one of the four where the answer
is no. 34 is a small number and it is a *true* number about existing recipes, not a thin shelf
pretending to be a full one. The feature says *this recipe has a job you can give away, and here
it is*; on 651 recipes it says *no, or nobody said*. **Both answers are useful and neither is a
lie.**

**The caveat, stated.** It serves persona three and nobody else. `cooks.md` is explicit that the
many-hands assumption *"is wrong for the first two and right for the third"*.

### 2 — A rotation that does not need polling

**What it needs.** Something with a date in it. `src/lib/plan.ts` holds `{ slug, multiplier }`
under one `localStorage` key and **there is no date anywhere in it**, so the site cannot know that
beans have not come round since March. And an answer to whose preference is being recorded — which
runs straight back into persona two's contradiction, because **a preference that has to be
collected is the polling they are trying to stop.**

**What it stands on.** `plan.ts` for storage and its version/change-event discipline. The
protein/counter graph in [§3](#the-family-rotation), which is derivable from `tags`, `counters`
and ingredient names with no new annotation. `pairsWith` on 506 of 685 files. `keeps` at 138 and
rising.

**Day one: 248 dinners for four or more, and an eleven-night ceiling** before a protein or a
counter has to repeat. That is enough shelf for a rotation to be non-obvious, which is the test.

**Does food have to be written first? No, but the answer would be thin in one corner.** Fish
reaches five counters and nine recipes; dairy-as-protein reaches one. A rotation built today would
send a household to Japan for fish and to a tinned-tuna casserole after that. **That is a
recommendation for four or five fish dinners, not a reason to wait.**

**Why second and not first.** The evidence problem is real: whatever resolves this *has to get its
evidence from what already happened rather than from asking*, or it has rebuilt the polling with a
nicer interface. That is a design argument nobody has had yet, and it is a story, not a ticket.

### 3 — Balance, and breadth of plants

**What it needs.** Two things, and `cooks.md` §2 says the second is the hard one: a fact about a
dish nobody has agreed on yet — *balance* would have to become something measurable before it
could be printed — and enough food for an answer to be worth returning.

**What it stands on.** The plant classification in this reading, which is reusable and whose
residue is zero. `>> tags:`, unenforced. Nothing else: **no field records balance and none is
designed.**

**Day one: sixteen non-starch vegetable sides, forty-seven savoury plant-built dishes, and
twenty-three plants that ever carry a dish.** A balance dial would hand the same sixteen files to
every reader who turned it, forever.

**Does food have to be written first? Yes, and it is not close.** This is the veto, applied. S-012
predicted it and was right about the shape while under-counting the size. **The gap is not the
dial. The gap is forty-eight plants the collection buys and never cooks.** Celery, leek, parsnip,
turnip, snow pea, okra, radicchio, arugula, lotus root, bamboo shoot and thirty-eight more are in
the ingredient lists and are never the point of a recipe.

### 4 — Cooking from what is already in the fridge

**What it needs.** A reading that runs list → recipe, which `cooks.md` §1 says is a different
problem and not a rearrangement of the existing one. The pantry **assumed rather than typed**.
*All of these and nothing else* rather than one ingredient at a time —
`src/pages/search.json.ts` joins everything into one free-text blob and finds a recipe that
*mentions* chickpeas without saying whether you could finish it. And a decision about how close is
close enough.

**What it stands on.** `staples.json`'s 31 and its five-clause doctrine, which is the best-argued
data file in the repo. `matchesStaple()`. `src/lib/shopping.ts`, which already does the split in
the other direction.

**Day one: two recipes** — a malted milk drink and an egg sandwich — for the person the feature is
for. **Thirty-three** across the whole shelf at any serving size, of which twelve are sweets, five
are sauces and none is dinner.

**Does food have to be written first? Yes, and more of it than for balance.** This is the
best-argued of the four capabilities and it has the worst shelf under it. Loosening it to *missing
one thing* gets 97 more recipes, and the ranking does not rescue it: the answer would then be
*here are 97 dishes, go to the shop*, which is the question they said they could not answer yes to.

### Say it plainly: write food before writing features

**Two of the four capabilities cannot be built on this collection today, and they are the two the
personas argued for hardest.** The honest answer for balance and for fridge-cooking is *write food
first*, and this repo has taken that answer before — `docs/gaps/README.md`'s
[five gaps](README.md#the-five-gaps-to-fill-first) has never been a feature list. Every entry on
it is food or a checker.

What the food would be, if somebody wanted the shortest path:

1. **Vegetable dinners, not vegetable sides.** The sixteen sides are sides. A shelf answering
   persona one needs dishes where a non-starch plant is the whole plate at one or two servings,
   and there are currently zero of those that also need no shop.
2. **The forty-eight plants already in the shopping lists.** Leek, celery, parsnip, turnip,
   fennel, okra, snow pea, radicchio, arugula. Each is one table, and each moves the *distinct
   plants that carry a dish* count directly.
3. **Four or five fish dinners outside Japan**, which is the rotation's thinnest corner.
4. **A small-batch shelf that is not a café menu.** Every near miss in
   [§3](#cooking-for-the-day) is a drink or a sandwich.

**The two features that can be built — hand-off, and the rotation — should be built anyway**, and
neither is waiting on food. That is the recommendation: build 1 and 2, write food for 3 and 4, and
do not open a balance dial or a fridge search until the shelf can answer them with more than
sixteen files and two.

---

## 5. Where the personas disagree with the board

Five stories are running: **S-008, S-010, S-011, S-012, S-013.** Three of them — S-008, S-010,
S-011 — were argued before `cooks.md` existed. S-013 is the only one that already read it.
(S-012's own sentence *"five stories are in flight"* named a different five: S-007 and S-009 have
closed since, and S-013 has opened.)

Held against the three cooks with `cooks.md`'s own instrument, unchanged: a design **passes** when
it changes what the person's contradiction costs, **fails** when it serves only the half already
served, and is **cannot say** when the source does not settle it.

**Nothing below is edited. Every conflict names the ticket it concerns.**

### S-011 × T-011-06 — *six people over three days* against *two of the same gets old fast*

**This is the real one, and it is not a story that serves nobody — it is one story serving two
people with one control.**

S-011 §"The two situations" already splits its own scope:

> **Exhausted, two meals for one, for today.** n = 2. Nothing batches at that size … **S-010's
> dials already answer this** — it is the small-n case and it is done.
>
> **Stressed, six people, over three days.** n ≈ 18 portion-meals, cooked once.

And T-011-06 is scheduled to build *"how many people, over how many days, with how much left in
you"* — **one control covering both.**

**The conflict.** At n = 2 the story's own analysis says capacity never binds and the growth model
returns nothing. So for persona one, T-011-06's *how many people* dial is a control that does not
move, and the useful part of the widget is the S-010 dials it wraps. Meanwhile *over how many
days* is the half that would help persona one most — *does this give me a different dinner
tomorrow* is the one row in `cooks.md`'s first table answered by **Nothing** — and it is being
built as a scaling input rather than as a variety output.

**They are not opposite. They are the same control read from opposite ends**, and the risk is that
one set of defaults gets chosen and it will be the six-people end, because that is where the
story's arithmetic lives.

| | Verdict on T-011-06 as scoped |
| --- | --- |
| Cooking for the day | **Fails** — at n = 2 nothing batches, so the story's own reading says the growth model is silent. *Over how many days* would help them and it is aimed at leftovers-for-a-crowd, not at a different dinner tomorrow. And it is another dial. |
| The family rotation | **Cannot say** — nothing in it is false for them, and honest arithmetic about a decision they have not made yet does not help them make it. `cooks.md` already reached this verdict for capacity. |
| Holiday guests | **Passes** — this is their control, and *six people over three days* is their sentence. |

**Recommendation, for T-011-06's author.** Decide which end the defaults sit at and say so on the
page. If it is the six-people end — which the story's arithmetic supports — then say plainly that
the small-n case is S-010's dials, rather than shipping a *how many people* control that does
nothing at 2 and letting persona one conclude the site has nothing for them. **The two personas
are already inside this one story; the ticket does not have to resolve that, but it should not
resolve it silently.**

### S-011 × T-011-02 and T-011-03 — capacity

`cooks.md` has already worked this one: **passes** for persona three, **silent** for personas one
and two, and the silence is the story's own reading rather than a defect. This reading adds one
number: **`capacity` is declared on 0 of 685 files.** T-011-02 is in `implement` and nothing has
landed.

**Recommendation, for T-011-03.** S-011 says the annotation starts from *"the 55 files that
already say it in prose"*. Of the 34 recipes with a hand-off-able branch in
[§3](#holiday-guests), the overlap with a vessel-bound dish is where a capacity line pays twice —
a recipe that batches *and* has a branch is where persona three loses an evening. Worth checking
the intersection before the annotation order is fixed.

### S-011 × T-011-04 — `keeps`

**Passes for persona two and persona three, and it is the ticket S-011 nominates to cut if the
story needs to be smaller.** This reading says: **do not cut it.**

`cooks.md` lists *"How much of this survives to be eaten later?"* as answered by **Nothing** for
persona two, and *"Does it give me a different dinner tomorrow?"* as **Nothing** for persona one.
In [§3's week](#the-family-rotation), three of seven nights have no `keeps` line. `keeps` stands
at 138 of 685.

**Recommendation, for whoever would cut T-011-04.** It is the only ticket on the board that
touches all three cooks, and it is the cheapest thing in the ranking above that makes the
rotation feature possible.

### S-010 × T-010-02 and T-010-03 — the three dials

`cooks.md` has already worked this one and this reading does not disturb it: **passes** for
persona one, **fails** for persona two — *"three dials is three more decisions handed to somebody
whose cost is the deciding"* — and **cannot say** for persona three.

What this reading adds is the size of the cannot-say bucket. **275 of 685 recipes have no timers
at all**, and `washing-up` is declared on **177 of 685**. So the *things to wash* dial has an
answer for a quarter of the shelf and the other three-quarters is the third state.

**Recommendation, for T-010-03**, which is the ticket that *"reads the result against the whole
collection and records what the filter cannot say"*: the honest headline is that **cannot-say is
the majority answer on two of three dials**, and the ticket should be free to report that as the
finding rather than as a coverage gap. It is the same shape of answer this reading gives for
balance.

### S-008 × T-008-04 and T-008-05 — the air fryer basket

**S-008 serves persona one and persona two and it is the story quietly fixing the vegetable
problem** — and its vegetable ticket is the one blocked ticket on the board.

| | Verdict |
| --- | --- |
| Cooking for the day | **Passes** — *washing-up of two or fewer, one machine, on the table in 45 minutes* is aimed squarely at their evening, and four of the sixteen non-starch sides on this shelf came from T-008-04. |
| The family rotation | **Cannot say** — a fourth shelf is a fourth place to look, which is more deciding; but the shelf is a *gate*, and a gate is the one shape of feature that reduces decisions rather than adding one. |
| Holiday guests | **Fails** — a basket that holds three portions is the exact dish S-011 says lies about `× 3`, and this reading found the Air Fryer & the Pot reaching only **3** of the 248 dinners for four or more. |

**Recommendation, for T-008-05**, which applies the gate and reads the result. S-008 states its
own risk up front — *"if fewer than about twenty-five recipes clear it once the pool is annotated,
the finding is the gate is wrong or the shelf is thin"* — and this reading supplies a second number
for that report: **the counter reaches 3 dinners at four servings or more.** The gate is doing its
job for one person and the shelf is a one-or-two-serving shelf. That is worth saying in the same
breath as the count, because it is the difference between *the gate is too tight* and *this shelf
is for a different reader than the gate's other three*.

**And T-008-04 being blocked has a cost this reading can price.** Four of the collection's sixteen
non-starch vegetable sides came from it. It is, measured, the most productive ticket on the board
for the problem in [§1](#1-the-cattle-claim), and it is stopped.

### S-013 × T-013-01, T-013-02, T-013-03 — cooking for a moment

**S-013 is the only running story that read the personas, and it holds up.** It forward-declares
this reading — *"nothing here opens a shelf until T-012-02 has said whether the collection can
feed one"* — and its dumpling-party inversion is the sharpest existing argument against any single
difficulty ranking.

| | Verdict |
| --- | --- |
| Cooking for the day | **Cannot say** — an occasion is a moment in a year and their problem is Tuesday. Nothing in it is false for them. |
| The family rotation | **Passes, potentially** — *"here is why your Thanksgiving falls apart at four o'clock, and which dish to move"* is an answer produced without asking anybody a question, which is their whole test. |
| Holiday guests | **Passes** — it is their story. |

**One conflict, and it is with the shelf rather than with a person.** T-013-02 models the meal
rather than the dish, and its worked example is *six dishes whose hands-on time all lands in the
same ninety minutes, four of them wanting one oven*. **The collection has no big holiday meal to
model.** There is no roast turkey; the multi-branch recipes are `mole-poblano`, two borschts and a
chopped salad; `capacity` is 0 of 685; and only 34 recipes have a hand-off-able branch.

**Recommendation, for T-013-03**, which *"proves the method on two occasions that invert each
other, and reports whether the shelf could feed either"*: the dumpling-party half is feedable —
`gyoza`, `wonton-soup`, `char-siu-bao`, `wu-gok`, `xiao-long-bao` and the rest of the Dim Sum
Counter are exactly the O(n)-hands-on, many-hands, low-skill-floor-per-unit shape S-013 describes,
and `wu-gok` is already in the 34. **The big-family-meal half is not**, and this reading's answer
to the forward declaration is: *not yet, and here is what is missing.*

### One conflict that belongs to no single story

**Three of the five running stories are building a control that offers the reader a choice**, and
`cooks.md` says of persona two that *"every feature that offers more choice makes the problem
worse"* and calls that *"the most useful sentence in this file, because it inverts the instinct
that produced almost everything on the board."*

S-010's three dials, S-011's T-011-06 situation control, and S-013's occasion profile are all
controls. **None of them is wrong. All three are aimed at the same two people**, and the third
person is served by exactly one thing on the board — T-011-04's `keeps`, which S-011 nominates as
the one to cut.

**That is the board-level finding, and it is not a ticket's fault.** It is what happens when five
stories are argued from the shelf outwards, which is precisely what S-012 was opened to notice.

---

## What this reading does not do

- **It does not edit a story or a ticket.** Every conflict above is a recommendation. Nothing on
  the board was touched.
- **It does not add a field, a filter or a page**, and it writes no recipe.
- **It does not re-take `cooks.md`'s field counts.** That file's numbers are from the same day and
  the same tree; where this reading disagrees it is because the question is different, not because
  the file drifted.
- **It does not rank a fifth capability.** The four are `cooks.md`'s four. Nothing found here
  argues for a fifth.
- **It does not settle whether `capacity` and `keeps` change the answer.** Both are mid-flight —
  `capacity` at 0 of 685, `keeps` at 138 — and every number here that touches them is a floor.

## What would move these numbers

| Number | Moves when |
| --- | --- |
| 16 non-starch sides · 47 plant dishes · 23 plants | somebody writes vegetable food. T-008-04 alone moved it by four. |
| 2 recipes with no store run | same, and it needs small-batch savoury food specifically |
| 34 hand-off-able branches | more timers. **275 recipes cannot answer at all.** |
| 11-night rotation ceiling | fish, and any protein outside the eleven |
| 138 `keeps` · 0 `capacity` | T-011-04 and T-011-02 landing |

**Re-run the script and diff the output.** That is what it is kept for.
