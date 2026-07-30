# T-001-01 — Structure

The blueprint: exactly which files appear, what is inside each, and in what order they are
written. No prose recipes yet — the shape of them.

## Files

**Created (5):**

```
recipes/pastry-and-doughs/nixtamalised-masa.cook
recipes/dressings-and-dips/crema-mexicana.cook
recipes/dressings-and-dips/queso-fresco.cook
recipes/custards-and-puddings/red-bean-paste.cook
recipes/custards-and-puddings/lotus-seed-paste.cook
```

**Modified:** none.

**Deleted:** none.

Nothing outside `recipes/` is touched. `src/data/counters.json` and `src/data/aisles.json`
are T-001-17's, and `docs/gaps/` is the story's closing pass. Work artifacts go to
`.lisa/attempts/T-001-01/2/work/`, which Lisa publishes.

Basenames are URLs and must be unique across the whole collection; all five were checked
against the full list of 249 basenames in Research and none collides.

## The common file skeleton

Every file follows the order the existing 249 use — required metadata, then the site's
organising lines, then `time`, then `step.N` overrides, then the steps separated by blank
lines.

```
>> title:      Title Case, with diacritics
>> category:   the folder's display name, exactly as counters.json spells it
>> tags:       lowercase, comma-separated: main ingredient, method, role
>> counters:   exact names from src/data/counters.json
>> aka:        ordering words, accented and un-accented
>> pairs-with: existing slugs only
>> servings:   portions the yield covers
>> time:       sum of named waits plus working time
>> step.N:     label override where the derived label would be a fragment

<step 1 — the only step that may open with plain ingredients>

<step 2 — opens by consuming @&(~1)…{}>
…
```

Invariants each file must hold, restated as a checklist the Plan verifies:

1. required metadata present: `title`, `category`, `tags`, `servings`;
2. every `counters:` name resolves against `counters.json`;
3. steps 2..N each consume exactly one earlier preparation — linear chain, one ending;
4. no step without ingredient items anywhere below step 1 (no prep row mid-tree);
5. 5–16 ingredient rows, 3–6 operations;
6. every timer named, and named from the vocabulary `src/lib/time.ts` classifies;
7. every `pairs-with` slug resolves against a file that exists after this ticket;
8. no operation cell renders empty.

## 1. `recipes/pastry-and-doughs/nixtamalised-masa.cook`

- **title** Nixtamalised Masa · **category** `Pastry & Doughs`
- **counters** `Panadería, Taquería`
- **tags** corn, masa, tortilla, mexican, dough, make-ahead
- **aka** masa, masa nixtamalizada, nixtamalized masa, nixtamal, masa fresca, fresh masa,
  hominy dough
- **pairs-with** `corn-tortillas`, `carnitas`
- **servings** 12 · **time** ~9 hr 15 min

**Rows (5):** dried field corn · pickling lime (cal) · water for the cook · cool water for the
rinse · water for the grind.

**Operations (5), linear:**

| # | Step | Consumes | Timer |
| --: | --- | --- | --- |
| 1 | stir the cal into the cooking water until it goes milky | — | — |
| 2 | add the corn, simmer until a kernel's skin slips | `~1` | `~simmer{15%min}` |
| 3 | off the heat, steep overnight | `~1` | `~steep{8%hr}` |
| 4 | drain, rinse and rub the hulls off | `~1` | — |
| 5 | grind with the last of the water, rest to hydrate | `~1` | `~rest{30%min}` |

Cal is written with its safety note in the step sentence (food-grade only), because a table
cannot carry a warning any other way. Step 4 is the one where the un-slaked yield is judged.

## 2. `recipes/dressings-and-dips/crema-mexicana.cook`

- **title** Crema Mexicana · **category** `Dressings & Dips`
- **counters** `Panadería, Taquería`
- **tags** cream, cultured, mexican, condiment, make-ahead
- **aka** crema, mexican crema, mexican sour cream, crema agria
- **pairs-with** `birria-de-res`, `refried-beans`
- **servings** 12 · **time** ~28 hr 15 min

**Rows (6):** heavy cream · whole milk · cultured buttermilk · lime juice · lime zest ·
fine sea salt.

**Operations (4), linear:**

| # | Step | Consumes | Timer |
| --: | --- | --- | --- |
| 1 | warm the cream and milk to 85°F (29°C) | — | — |
| 2 | whisk in the buttermilk, cover, leave at room temperature | `~1` | `~ferment{24%hr}` |
| 3 | stir in lime juice, zest and salt | `~1` | — |
| 4 | chill until it pours in a ribbon | `~1` | `~chill{4%hr}` |

The step-2 sentence says *culture*; the timer is named `ferment` so the clock reads it as an
unattended wait from the name rather than from the label.

## 3. `recipes/dressings-and-dips/queso-fresco.cook`

- **title** Queso Fresco · **category** `Dressings & Dips`
- **counters** `Panadería, Taquería`
- **tags** cheese, milk, mexican, fresh, condiment
- **aka** queso blanco, fresh cheese, mexican fresh cheese, ranchero cheese
- **pairs-with** `salsa-roja`, `mexican-red-rice`
- **servings** 8 · **time** ~5 hr 30 min

**Rows (5):** whole milk · heavy cream · distilled white vinegar · lime juice · fine sea salt.

**Operations (5), linear:**

| # | Step | Consumes | Timer |
| --: | --- | --- | --- |
| 1 | heat the milk and cream to 185°F (85°C), stirring so it does not catch | — | — |
| 2 | stir in the vinegar and lime juice, stand until the whey runs clear | `~1` | `~stand{20%min}` |
| 3 | ladle into a cloth-lined sieve and drain | `~1` | `~drain{45%min}` |
| 4 | work in the salt, shape, and press under a weight | `~1` | `~press{2%hr}` |
| 5 | chill before crumbling | `~1` | `~chill{2%hr}` |

No timer on step 1: it is a temperature target, not a duration.

## 4. `recipes/custards-and-puddings/red-bean-paste.cook`

- **title** Red Bean Paste · **category** `Custards & Puddings`
- **counters** `Bakery, Dim Sum Counter`
- **tags** adzuki, sweet, filling, stovetop, make-ahead, vegan
- **aka** anko, tsubuan, koshian, tsubu-an, koshi-an, azuki paste, adzuki bean paste,
  hong dou sha, dou sha, sweet red bean paste
- **pairs-with** `japanese-milk-bread`, `lotus-seed-paste`
- **servings** 16 · **time** ~3 hr 15 min

**Rows (6):** dried adzuki beans · water for the first boil · water for the simmer ·
granulated sugar · fine sea salt · neutral oil.

**Operations (5), linear:**

| # | Step | Consumes | Timer |
| --: | --- | --- | --- |
| 1 | cover the beans with water, boil, and drain the tannic first water | — | `~boil{5%min}` |
| 2 | fresh water, simmer until a bean crushes between two fingers | `~1` | `~simmer{90%min}` |
| 3 | mash — coarsely for tsubu-an, through a sieve for koshi-an | `~1` | — |
| 4 | cook down with the sugar and salt to a paste that holds a furrow | `~1` | `~simmer{25%min}` |
| 5 | beat in the oil and cool | `~1` | `~cool{1%hr}` |

Step 3 is where the two names in `aka` diverge, written as one sentence in one step rather
than as two files.

## 5. `recipes/custards-and-puddings/lotus-seed-paste.cook`

- **title** Lotus Seed Paste · **category** `Custards & Puddings`
- **counters** `Bakery, Dim Sum Counter`
- **tags** lotus, sweet, filling, mooncake, stovetop, make-ahead
- **aka** lotus paste, lian rong, lin yung, sweet lotus seed paste, mooncake filling
- **pairs-with** — *(none; red bean paste carries the pairing and the build makes it mutual)*
- **servings** 16 · **time** ~6 hr 15 min

**Rows (7):** dried split lotus seeds · water for the soak · water for the simmer · rock
sugar · fine sea salt · peanut oil · maltose syrup.

**Operations (5), linear:**

| # | Step | Consumes | Timer |
| --: | --- | --- | --- |
| 1 | soak the seeds, then pick the bitter green germ out of each | — | `~soak{4%hr}` |
| 2 | drain, fresh water, simmer until a seed collapses under a spoon | `~1` | `~simmer{60%min}` |
| 3 | blend to a smooth purée with a little of the cooking water | `~1` | — |
| 4 | fry down with the sugar, oil and maltose until it pulls from the pan | `~1` | `~fry{30%min}` |
| 5 | cool to a paste firm enough to roll into a ball | `~1` | `~cool{1%hr}` |

`~fry` is in the hands-on set, which is correct: this is thirty minutes of standing over a
pan, and the timeline should say so.

## Ordering of the work

The five files are independent — no file references another's steps, and the only
cross-reference is `red-bean-paste`'s `pairs-with: lotus-seed-paste`, which resolves at build
time and does not constrain authoring order.

Written and checked in this order, cheapest failure first:

1. `crema-mexicana` — shortest tree, proves the metadata skeleton and the checker loop.
2. `queso-fresco` — same folder, same counters, one more operation.
3. `nixtamalised-masa` — new file in the two-file `pastry-and-doughs` folder.
4. `red-bean-paste` — first of the pair.
5. `lotus-seed-paste` — last, so that `red-bean-paste`'s `pairs-with` resolves before the
   full-collection build is run.

## Interfaces this work exposes to other tickets

- **Five slugs** other tickets may point `pairs-with` at:
  `nixtamalised-masa`, `crema-mexicana`, `queso-fresco`, `red-bean-paste`,
  `lotus-seed-paste`.
- **Five files other tickets must not edit.** A counter that wants one of these on its board
  adds its counter name through T-001-18, not by editing here — the same rule the story sets
  for shared dishes.
- **New ingredient names** T-001-17 will need to place in `src/data/aisles.json`: pickling
  lime (cal), dried field corn, cultured buttermilk, dried adzuki beans, dried split lotus
  seeds, rock sugar, maltose syrup, peanut oil.
