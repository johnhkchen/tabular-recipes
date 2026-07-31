# T-001-13 — Research

What exists, where, and what constrains a new `.cook` file at the Meat and Three.
Descriptive only. No proposals here.

## 1. The shape of the repository

| Path | What it holds |
| --- | --- |
| `recipes/<category>/*.cook` | The source of truth. **412 files** across 22 category folders. Basenames are slugs, and the slug is the URL. |
| `src/data/counters.json` | The counters, their blurbs, and the menu sections each one prints. **Owned by T-001-17.** |
| `scripts/check-recipes.mjs` | The per-file gate. `--labels` prints the operation staircase. |
| `scripts/normalise.mjs` | The only place the cooklang WASM parser is touched. |
| `scripts/parse-recipes.mjs` | Walks `recipes/`, settles the cross-file facts, writes `src/generated/recipes.json`. |
| `src/lib/tree.ts` / `layout.ts` | Steps → merge tree → tiled table. |
| `src/lib/icons.ts` + `icons.test.ts` | The verb→icon table, and a coverage test over every operation label in the collection. |
| `src/lib/time.ts` | Timer names → minutes, and hands-on vs unattended. |
| `src/lib/collection.test.ts` | Slug uniqueness, counters that exist, mutual pairings, one plain way per dish, timer sanity. |
| `docs/gaps/meat-and-three.md` | The ranked work list for this ticket. |
| `docs/knowledge/counters.md` | The menu vocabulary the `>> aka:` lines are drawn from. |

Category folders that exist today: bars-and-brownies, breads, cakes-and-loaves, cookies,
custards-and-puddings, dressings-and-dips, drinks, dumplings-and-rolls,
flatbreads-and-pancakes, fried-and-crispy, noodles, pastry-and-doughs,
rice-beans-and-grains, salads, sandwiches-and-rolls, sauces-and-gravies,
smoked-and-grilled, soups, spice-blends-and-marinades, stews-and-braises, stir-fries,
toppings-and-pickles.

`fried-and-crispy` holds exactly one file (`karaage`) and `drinks` holds exactly one
(`ca-phe-sua-da`). Both were opened by a counter ticket that had nowhere to put a dish, so
opening a folder is a precedent this project has already set.

## 2. What the Meat and Three actually shelves right now

`grep -rl "Meat and Three" recipes/` returns **28 files**, not the 26 the ticket names and
not the 23 the gap doc names. Five have landed since the doc was compiled.

**Exclusive — names this counter and no other (10):**

```
haupia        dirty-rice     hoppin-john    jambalaya    jollof-rice
cajun-seasoning   beef-bourguignon   braised-short-ribs   chicken-adobo   coq-au-vin
```

**Shared with another counter (18):** pecan-pie-bars, skillet-cornbread, texas-sheet-cake,
banana-pudding, bread-pudding, coleslaw, hot-water-cornbread, all-butter-pie-crust,
boston-baked-beans, cheese-grits, cheddar-cheese-sauce, cranberry-sauce, sausage-gravy,
turkey-pan-gravy, jerk-marinade, turkey-brine, beef-stew, pot-roast.

The gate is **≥30 shelved / ≥14 exclusive**. Every new file that names only this counter
moves both numbers, so **four new exclusive files** would clear the floor (32 / 14). The
exclusivity number is the binding one.

## 3. Where the work list is stale

`docs/gaps/meat-and-three.md` ranks twenty absences. Checked against `recipes/` rather
than trusted, **five of its claims are already answered**:

| The doc says missing | Actually on the shelf |
| --- | --- |
| **Cornbread** — "the single most conspicuous absence" | `recipes/cakes-and-loaves/skillet-cornbread.cook`, hot skillet and all |
| Hot water cornbread (item 12) | `recipes/flatbreads-and-pancakes/hot-water-cornbread.cook` |
| Banana pudding (item 11) | `recipes/custards-and-puddings/banana-pudding.cook` |
| Coleslaw (item 18) | `recipes/dressings-and-dips/coleslaw.cook` |
| Pie shell (component) | `recipes/pastry-and-doughs/all-butter-pie-crust.cook` |

All five already carry `Meat and Three` on their `counters:` line, so none of them is a
hand-off to T-001-18 either. The doc's headline complaint is out of date; its **second**
complaint — the vegetable list — is not.

Everything else on the list is genuinely absent. Checked one at a time with
`ls recipes/*/<slug>.cook`: collard-greens, fried-chicken, macaroni-and-cheese,
candied-yams, smothered-pork-chops, smothered-chicken, cornbread-dressing,
baked-turkey-wings, oxtails, green-beans, fried-okra, stewed-squash, black-eyed-peas,
butter-beans, creamed-corn, meatloaf, country-fried-steak, peach-cobbler,
sweet-potato-pie, red-beans-and-rice, gumbo, etouffee, po-boy, boudin, cracklins,
maque-choux, chitterlings, potato-salad, deviled-eggs, gumbo-z-herbes, sweet-tea —
and the components ham-hock-stock, dark-roux, cream-gravy, buttermilk-brine, onion gravy.
None of those slugs is taken anywhere in the collection.

**No hand-off to T-001-18 was found.** Every dish on the ranked list that already exists
already names this counter, so there is no "add a counter to somebody else's file" edit
waiting here.

## 4. The file format, as the code enforces it

A `.cook` file is `>>` metadata lines then one paragraph per step.

**Metadata.** `check-recipes.mjs` hard-requires `title`, `category`, `tags`, `servings`.
`counters` is validated against `src/data/counters.json` — a name not in that file is a
failure, not a warning. `aka`, `pairs-with`, `time`, `dish`, `kit` and `step.N` are
promoted out of the metadata bag; anything else stays as a printed recipe fact.

**The table is written, not guessed.** Ingredients (`@salt{1%tsp}`) are leaves in column 1.
A step that uses them is an operation. `@&(~1)thing{}` is an intermediate reference — an
edge from an earlier step into this one — and it is what builds the tree:

- `col(op) = 1 + max(col(children))`, so a chain of two operations is the minimum that
  reaches the checker's `colCount >= 3`.
- **A step may flow into exactly one later step.** Two consumers is a hard error ("a table
  is a tree").
- **Exactly one step may end the recipe.** Two roots is a hard error.
- A step with no ingredients and no refs is not an operation at all: it becomes a
  full-width header row above the table (or a footer, after the first real step).
- `rowCount >= 3` (three ingredient rows) and `colCount >= 3`, or it "would not draw a table".

**Labels.** The operation cell is the step text with its ingredients deleted, tidied by
`cleanLabel()` — which is why so much of the collection writes `>> step.N:` overrides
instead. `hoppin-john.cook` overrides all five of its steps and prints
`render · sweat 8 min · simmer covered 50 min · cook covered 20 min · finish`. That
staircase is what `--labels` shows.

**The icon coverage test is a real constraint on wording.** `icons.test.ts` takes the
first word of `labelOverride ?? rawLabel` for every step in the collection and fails if
`matchOperation()` returns null for it. `src/lib/icons.ts` is owned by no counter ticket
and this ticket may not touch `src/`, so **every new step has to open with a verb already
in `VERB_ICONS`** — render, sweat, simmer, braise, stew, fry, sear, brown, bake, roast,
whisk, stir, fold, mash, dredge, drain, season, pour, spread, layer, crumble, and so on.

**Timers.** `~name{20%min}`. The name is read first: a name in `UNATTENDED`
(braise, simmer, stew, bake, roast, chill, brine, soak, rest, set …) means time you can
walk away from; a name in `HANDS_ON` (fry, stir, whisk, beat, sear, brown, toss …) means
time you have to be there. An unnamed timer falls back to reading the step text, which is
exactly the guess the acceptance criteria forbid. `collection.test.ts` also fails any
hands-on timer of four hours or more, and any timer whose unit it cannot turn into minutes.

**`>> time:`** is parsed by `authorMinutesOf()`; a range ("30 to 40 min") reads as null and
fails `schedule.test.ts`. It must be a plain sum like `4 hr 30 min`.

**Pairings are made mutual at build time** by `parse-recipes.mjs`, so a one-sided
`pairs-with` pointing at somebody else's file is legal and is *not* an edit to that file.
It must point at a slug that exists, and never at itself.

## 5. What the counter's own vocabulary says

`docs/knowledge/counters.md` §Meat and Three is the source for `aka` lines. The facts that
bear on writing rather than on the menu page:

- **"Vegetable" means anything that is not the meat** — macaroni and cheese, candied yams,
  dressing and rice are all on that list.
- **"Smothered"** names a method, not a dish: browned first, then finished low in its own
  onion gravy. It runs across chops, chicken, steak, cabbage, potatoes and greens.
- **Pot likker** is the salty broth left after greens, and the cornbread is for mopping it.
- Turnip and mustard greens are near-interchangeable with collards and belong in the same
  `aka`.
- Candied yams are not yams, and the mashed version is printed as sweet potato soufflé.
- The Louisiana plate lunch shares this room: red beans, gumbo, étouffée, boudin, po-boy.

## 6. Constraints and assumptions carried into Design

1. **Only `recipes/**` may change.** Not `src/`, not `docs/gaps/`, not `counters.json`.
   That rules out adding a verb to `icons.ts` or an aisle to `aisles.json`.
2. **Two other tickets are writing to `recipes/` right now** (`T-001-11` has
   `falafel`, `chicken-shawarma`, `gyro-meat` untracked). A whole-collection
   `npm run verify` can therefore fail for reasons that are not this ticket's; per-file
   `check-recipes.mjs` runs on exact paths are the honest gate.
3. **The gap doc's "What it could not stock" section is not a to-do list.** It rules out
   meat-and-three itself, the rotating list, the steam table, "smothered" generically
   (write the onion gravy once and one smothered dish), a pot of greens that yields both
   greens and pot likker as two items, a roast that yields both slices and debris, sweet
   tea by the urn, and "vegetable" as a category on the *counter page*.
4. **There is no category in the collection for a plain cooked vegetable.** 412 files and
   not one pot of greens, pan of corn or dish of baked squash. `salads` is raw,
   `stews-and-braises` is meat, `rice-beans-and-grains` is starch. This is the one place
   where the existing folders genuinely do not reach, and it is exactly the part of the
   board the gap doc says is thin.
5. **The counter is a menu, not a technique.** Nine or ten vegetable lines and a rotating
   meat list is what makes it read as a board rather than a shelf of components — the
   failure mode `docs/gaps/README.md` records for the collection as a whole.
