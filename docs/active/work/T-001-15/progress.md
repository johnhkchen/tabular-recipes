# T-001-15 — Progress

**Done.** 26 new `.cook` files in nine commits. Nothing outside `recipes/**` was touched.

Counts, measured with the script from `research.md` §1 (a file's `>> counters:` line, with the
category fallback applied):

| | Start | End | Required |
| --- | --- | --- | --- |
| Diner shelves | 46 | **73** | ≥ 49 |
| Diner and no other counter | 17 | **35** | ≥ 20 |

(End counts include two Diner-naming files written by sibling tickets while this one ran.)

## Commits

| # | Commit | Files |
| --- | --- | --- |
| 1 | Write the diner potatoes | `home-fries`, `hash-browns`, `corned-beef-hash` |
| 2 | Write the chipped beef and the biscuit | `creamed-chipped-beef`, `buttermilk-biscuits` |
| 3 | Write the griddle's third item and the meat choice | `french-toast`, `breakfast-sausage-patties`, `scrapple`, `pork-roll-egg-and-cheese` |
| 4 | Open an eggs shelf | `eggs-benedict`, `western-omelette` |
| 5 | Write the blue plate's potatoes, the pie, the casserole and the cream | `mashed-potatoes`, `apple-pie`, `tuna-noodle-casserole`, `whipped-cream` |
| 6 | Print the sandwich page | `smash-burger`, `patty-melt`, `club-sandwich`, `grilled-cheese`, `blt`, `tuna-melt` |
| 7 | Open the fryer and the fountain | `french-fries`, `onion-rings`, `milkshake`, `egg-cream`, `hot-fudge` |
| 8 | Open every operation cell with a verb the icon map knows | 13 files revised |
| 9 | Tidy two aka lists that repeated a name | `french-fries`, `french-toast` |

Commits 1–7 follow `plan.md` exactly. Commits 8 and 9 are the two deviations, below.

## Gap list, item by item

Ranks are `docs/gaps/diner.md`.

| Rank | Item | Outcome |
| --- | --- | --- |
| 1 | Home fries, hash browns | written, separate files — the diced cut and the shredded cut are two printed lines |
| 2 | Creamed chipped beef | written; `aka` carries S.O.S. and the rest of the counter's vocabulary |
| 3 | Biscuits | written, `pairs-with: sausage-gravy`, which makes the pairing mutual at build |
| 4 | Corned beef hash | written, `pairs-with: corned-beef` (T-001-14's file, on disk at commit time) |
| 5 | French toast | written |
| 6 | Bacon · sausage patties · ham steak · scrapple | patties and scrapple written; **bacon and ham steak skipped** — see below |
| 7 | Pork roll, egg & cheese | written; Taylor ham, pork roll and SPK all in `aka` |
| 8 | Eggs Benedict | written; takes `hollandaise` as an ingredient |
| 9 | Western (Denver) omelette, plain three-egg omelette | Western written; **plain omelette skipped** — see below |
| 10 | Mashed potatoes | written, `pairs-with: turkey-pan-gravy, pot-roast` |
| 11 | Hot beef commercial | **skipped** — the gap doc's own "could not stock" arrangement |
| 12 | Apple pie (and a pie crust) | pie written on `all-butter-pie-crust`, which already existed |
| 13 | Burger, patty melt, club, grilled cheese, BLT, tuna melt | all six written |
| 14 | Chicken fried steak | **skipped — sibling ticket owns the file** |
| 15 | Meatloaf | **skipped — sibling ticket owns the file** |
| 16 | Fries, onion rings | both written |
| 17 | Milkshake, brewed coffee, egg cream | shake and egg cream written; **coffee skipped** |
| 18 | Hot turkey sandwich, tuna noodle casserole | casserole written; **hot turkey skipped** (rank 11's arrangement) |
| 19 | Jell-O, banana split | **both skipped** |
| 20 | Two eggs any style | **skipped** — the gap doc's own "could not stock", at length |
| — | Whipped cream, hot fudge (components) | both written |
| — | Milk gravy (component) | **skipped — sibling ticket owns `cream-gravy`** |
| — | Chocolate syrup, caramel sauce, pancake syrup, bacon fat, buttered toast | not written; used as ingredients where a dish needs them |

### Skipped, with reasons

**Under the checker's floor** (3 ingredient rows and two chained operations, `research.md` §3):

- **Bacon** — one ingredient, one operation. It is written into `home-fries`, `blt`,
  `club-sandwich` and `corned-beef-hash` as an ingredient instead.
- **Ham steak** — ham, fat, heat. Reaching the floor would mean writing red-eye gravy, which is
  a different menu line than the meat-choice list asks for.
- **Brewed coffee** — two ingredients and one operation; the gap doc's own note calls bottomless
  coffee "an urn and a habit".
- **Plain three-egg omelette** — eggs, butter, salt. `western-omelette` carries the method; the
  plain one is that method with the filling left out.
- **Jell-O** — a packet, hot water and a mould.

**Named in the gap doc's own "What it could not stock"**:

- **Two eggs any style**, **hot beef commercial**, **hot turkey sandwich** (the same
  construction, per `docs/knowledge/counters.md`), **banana split** (an arrangement of
  `french-vanilla-ice-cream`, `hot-fudge` and `whipped-cream`, all of which now exist), plus
  blue plate special, breakfast all day, the flat-top, the short stack, substitutions,
  bottomless coffee and buttered toast.

**Owned by a sibling ticket** — recorded for T-001-18 below:

- **Chicken fried steak** → T-001-13's `recipes/fried-and-crispy/country-fried-steak.cook`.
- **Milk gravy** → T-001-13's `recipes/sauces-and-gravies/cream-gravy.cook`.
- **Meatloaf** → T-001-13's `recipes/stews-and-braises/meatloaf.cook`.

## For T-001-18 — existing files that want `Diner` added to `counters:`

This ticket may not edit files another ticket owns. These four are the same dish at two
counters, not two recipes:

1. `recipes/fried-and-crispy/country-fried-steak.cook` — gap rank 14, chicken fried steak with
   white gravy. Add `Diner`.
2. `recipes/sauces-and-gravies/cream-gravy.cook` — the component list's milk gravy; the gap doc
   notes the same gravy goes on four things at this counter. Add `Diner`.
3. `recipes/stews-and-braises/meatloaf.cook` — gap rank 15. Add `Diner`.
4. `recipes/salads/tuna-salad.cook` — if written, add `Diner`, so the salad and `tuna-melt` are
   one dish at two counters.

## Deviations from the plan

**1. A ninth and eighth commit the plan did not have.** After commit 7 the pre-existing
`src/lib/icons.test.ts` failure grew from 54 unrecognised opening verbs to 67 — thirteen of the
new ones came from this ticket's `>> step.N:` labels (`frizzle`, `notch`, `ball`, `smash`,
`mound`, `push`, `rain`, `rice`, `start`, `crumb`, `mayonnaise`, `syrup`, `vanilla`). Since
`src/lib/icons.ts` belongs to another ticket, the fix was on this side of the line: reword each
label to open with a verb the map already draws (`brown`, `score`, `shape`, `press`, `spread`,
`cut`, `whisk`, `render`, `scatter`, `stir`, `fill`, `simmer`). The list is back to the exact
54 it was at baseline. Two `aka` lines that repeated a name were tidied in the same pass.

**2. `smash-burger` and `patty-melt` say `ground beef` rather than `ground chuck`.** The cut is
in the note (`80/20 chuck, coarse ground`). `ground beef` is a name `src/lib/shopping.ts`
already routes to an aisle and `ground chuck` is not, so this keeps two more ingredients off the
unaisled list without changing what you buy.

**3. No `pairs-with` to `tuna-salad`.** `tuna-melt` carries its own salad. A dangling
`pairs-with` slug passes `check-recipes` and breaks `npm run recipes`, and that file was not on
disk when the sandwich page was written.

## Verification at the end of the ticket

```
node scripts/check-recipes.mjs        → all 514 file(s) draw a table
npm run recipes                       → parsed 514 recipe(s) in 27 categories
                                        counters: 514 named, 0 inferred · pairings 558
npx vitest run                        → 4 failed | 662 passed (666)   [baseline: 4 failed | 586 passed]
git status --porcelain recipes/       → empty
```

The four vitest failures are the same four as the step-0 baseline: `icons.test.ts` (54
unrecognised verbs, unchanged), `schedule.test.ts` ×2, and `shopping.test.ts`. All four are
collection-level tests over data that `src/` owns; see `review.md` for what this ticket
contributes to the shopping one.
