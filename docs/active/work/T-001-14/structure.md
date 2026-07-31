# T-001-14 — Structure

The blueprint: eighteen new files, one new folder, nothing modified and nothing deleted.
Each entry below fixes the path, the metadata, and — because in this repository the tree *is*
the architecture — the step chain and where its branches merge.

## Files

```
recipes/cured-fish/                       ← NEW FOLDER
recipes/cured-fish/belly-lox.cook         ← NEW
recipes/smoked-and-grilled/pastrami.cook  ← NEW
recipes/stews-and-braises/corned-beef.cook
recipes/dressings-and-dips/russian-dressing.cook
recipes/dressings-and-dips/chopped-liver.cook
recipes/dressings-and-dips/cream-cheese.cook
recipes/dressings-and-dips/scallion-schmear.cook
recipes/sauces-and-gravies/schmaltz.cook
recipes/soups/chicken-broth.cook
recipes/soups/matzo-ball-soup.cook
recipes/salads/potato-salad.cook
recipes/salads/macaroni-salad.cook
recipes/salads/egg-salad.cook
recipes/salads/tuna-salad.cook
recipes/salads/chicken-salad.cook
recipes/salads/whitefish-salad.cook
recipes/toppings-and-pickles/sauerkraut.cook
recipes/dumplings-and-rolls/potato-knish.cook
```

Modified: none. Deleted: none. Outside `recipes/**`: none.

## The interface every file implements

```
>> title:        Title Case, the way the board writes it
>> category:     the folder's display name, exactly as other files in it spell it
>> tags:         lowercase, comma separated
>> counters:     Deli            (potato-salad: Deli, Meat and Three)
>> aka:          menu vocabulary from docs/knowledge/counters.md §Deli, diacritic-free forms included
>> pairs-with:   slugs that exist by the time this file is committed
>> servings:     a household bowl
>> time:         must agree with the file's own timer chain within a few percent
>> step.N:       one lowercase verb phrase per operation, opening with a mapped verb
```

Then the steps, in order, each referring back with `@&(~n)name{}` where `n` is the number of
steps back. Constraints, restated as things this blueprint must not violate: one root, no step
consumed twice, ≥ 3 ingredient leaves, ≥ 2 chained operations, every `~timer` named.

## Step chains, file by file

Notation: `1 → 2 → 3` is a chain; `(2,3) → 4` means step 4 consumes both.

### The slicer

**`smoked-and-grilled/pastrami.cook`** — Pastrami · Deli · serves 8
`1 stir the brine → 2 brine 5 days → 3 rinse, soak 2 hr → 4 press on the rub → 5 smoke 6 hr →
6 steam 2 hr, rest 30 min`
Timers: `~brine{5%days}` `~soak{2%hr}` `~smoke{6%hr}` `~steam{2%hr}` `~rest{30%min}`.
Leaves: water, kosher salt, brown sugar, pink curing salt, pickling spice, garlic, beef navel,
soak water, black peppercorns, coriander seed, sweet paprika, wood chunks, steam water ≈ 13.
`aka: hot pastrami, hand-cut pastrami, pastrami sandwich, beef navel pastrami, deli pastrami`.
`pairs-with: deli-rye-bread, sour-dill-pickles, corned-beef`.
Prose carries the two facts the gap doc insists on: the steam is the operation, and the
sandwich is slice-pile-mustard and is not a table.

**`stews-and-braises/corned-beef.cook`** — Corned Beef · Deli · serves 8
`1 stir the brine → 2 brine 5 days → 3 rinse, soak 2 hr → 4 simmer 3 hr 30 min → 5 rest, slice`
Same brine as pastrami, deliberately identical in composition; the files part at step 4.
`pairs-with: pastrami, sauerkraut, russian-dressing`.

### The pickle barrel and the kraut

**`toppings-and-pickles/sauerkraut.cook`** — Sauerkraut · Deli · serves 12
`1 shred and salt at 2% → 2 press until it runs → 3 pack under its own brine →
4 ferment 3 weeks → 5 refrigerate`
Timers: `~press{30%min}` `~ferment{3%weeks}` `~chill{2%days}`.
`aka: kraut, sour cabbage, kapusta kiszona, kapusta kiszona (no diacritics form given), sauerkraut for reubens`
— resolved in the file to plain-ASCII forms only.

### The hot case, the soup and its components

**`sauces-and-gravies/schmaltz.cook`** — Schmaltz and Gribenes · Deli · serves 12 (≈1 cup)
`1 dice the fat and skin → 2 render 1 hr with onion → 3 strain, salt the gribenes`
`aka: chicken fat, rendered chicken fat, gribenes, grieven, cracklings`.

**`soups/chicken-broth.cook`** — Clear Chicken Broth · Deli · serves 8 (≈3 qt)
`1 cover and bring to a boil, skim → 2 simmer 3 hr with the aromatics → 3 strain, chill, lift the cap`
Timers: `~skim{15%min}` `~simmer{3%hr}` `~chill{8%hr}`.
`aka: chicken soup, jewish penicillin, golden broth, clear chicken soup, chicken stock`.

**`soups/matzo-ball-soup.cook`** — Matzoh Ball Soup · Deli · serves 6
Two branches:
`1 whisk eggs, schmaltz, seltzer → 2 stir in matzo meal, chill 1 hr → 3 shape, poach 40 min`
`4 simmer the broth 20 min with carrot and dill`
`(3,4) → 5 ladle broth over the balls` — step 5 references `~1` (broth) and `~2` (balls).
`aka: matzo ball soup, matzah ball soup, matzoh ball soup, knaidlach, jewish penicillin`.
The file says which it is making — floaters, seltzer, rest before shaping — because the doc
says people have opinions.

### Salads by the pound

All six are the same architecture: a cooked or picked main, a whisked dressing, a fold, a
chill. Each has ≥ 4 operations and ≥ 7 leaves.

| File | Chain | Notes |
| --- | --- | --- |
| `salads/potato-salad.cook` | `1 boil 20 min → 2 dress warm with vinegar → 3 whisk the dressing ‖ (2,3) → 4 fold → 5 chill 2 hr` | Counters: **Deli, Meat and Three**. Vinegar on warm potato is the step people skip |
| `salads/macaroni-salad.cook` | `1 boil 8 min, rinse cold → 2 whisk the dressing ‖ (1,2) → 3 fold in the crunch → 4 chill 2 hr` | Dressing loosened with vinegar and sugar, deli-sweet |
| `salads/egg-salad.cook` | `1 boil 11 min, ice → 2 peel, chop → 3 whisk the dressing ‖ (2,3) → 4 fold → 5 chill 1 hr` | |
| `salads/tuna-salad.cook` | `1 drain and flake → 2 whisk the dressing ‖ (1,2) → 3 fold in celery and onion → 4 chill 1 hr` | Oil-packed tuna, drained hard |
| `salads/chicken-salad.cook` | `1 poach 15 min, rest 10 min → 2 dice → 3 whisk the dressing ‖ (2,3) → 4 fold → 5 chill 1 hr` | Poached, not roast-chicken leftovers |
| `salads/whitefish-salad.cook` | `1 pick the fish off the bone → 2 whisk the dressing ‖ (1,2) → 3 fold → 4 chill 2 hr` | Smoked whitefish; the fish is bought smoked and the file says so |

`‖` marks the independent branch; the fold consumes both, which is legal because each branch
is consumed exactly once.

### The appetizing side

**`dressings-and-dips/cream-cheese.cook`** — Cream Cheese · Deli · serves 12 (≈1 lb)
`1 warm the milk and cream to 22 °C → 2 stir in the culture, ripen 12 hr → 3 set with rennet 1 hr
→ 4 drain in cloth 12 hr → 5 beat with salt`
Timers: `~ripen{12%hr}` (unrecognised name → falls through; use `~ferment{12%hr}` instead),
`~set{1%hr}`, `~drain{12%hr}`. **Design note carried into implementation: every timer name must
be one `src/lib/time.ts` recognises**, so `ripen` becomes `ferment` and `pick` never becomes a
timer name.

**`dressings-and-dips/scallion-schmear.cook`** — Scallion Schmear · Deli · serves 8
`1 beat the cream cheese soft → 2 slice the scallions ‖ (1,2) → 3 fold → 4 chill 1 hr`
`aka: scallion cream cheese, schmear, schmeer, spread, green onion cream cheese`.

**`cured-fish/belly-lox.cook`** — Belly Lox · Deli · serves 10
`1 mix the cure → 2 bury the salmon, cure 3 days → 3 rinse, soak 2 hr → 4 dry, slice`
Timers: `~cure{3%days}` `~soak{2%hr}` `~dry{12%hr}`.
`aka: lox, salt-cured lox, belly lox, salt lox, gravlax (see note)` — the file's prose says
plainly that this is the salt cure and **not** nova, which is cold smoke and is not writable
here.

**`dressings-and-dips/chopped-liver.cook`** — Chopped Liver · Deli · serves 8
`1 boil the eggs 11 min, ice → 2 fry the onions 25 min → 3 sear the livers 6 min ‖
(1,2,3) → 4 chop coarse with schmaltz → 5 chill 2 hr`
Three branches into one chop, which is what "chopped" means: a hand chopper and a wooden bowl,
not a food processor. The file says so.

**`dressings-and-dips/russian-dressing.cook`** — Russian Dressing · Deli · serves 12
`1 stir the base → 2 fold in the chopped things → 3 chill 1 hr`

### The hot case

**`dumplings-and-rolls/potato-knish.cook`** — Potato Knish · Deli · serves 8
`1 mix the dough, rest 1 hr → 2 boil the potatoes 20 min → 3 fry the onions 20 min →
(2,3) → 4 mash with schmaltz ‖ (1,4) → 5 roll thin, fill, roll up, cut → 6 bake 45 min`
Step 5 references `~4` (the dough) and `~1` (the filling).
`aka: knish, square knish, potato knish, baked knish, knishes`.
The prose records the doc's own note that the round fried one is a different food.

## Ordering of the work

Only two orderings are forced, and both are `pairs-with` edges:

1. `schmaltz` before `matzo-ball-soup`, `chopped-liver` and `potato-knish` (they name it).
2. `chicken-broth` before `matzo-ball-soup`; `cream-cheese` before `scallion-schmear`;
   `pastrami` and `corned-beef` in either order but committed together, since they name each
   other.

Everything else is independent. The commit sequence in `plan.md` follows the gap doc's ranking
so the record reads as a walk down the list.

## What the checker will be asked, per file

```
node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook
```

Expected: `ok  <path>  N rows x M cols` with N ≥ 3, M ≥ 3, and a staircase whose every line
opens with a verb. Then, once at the end, the whole collection plus `npm run recipes` and
`vitest run`, compared against the baseline recorded in `research.md` §7.
