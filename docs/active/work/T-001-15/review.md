# T-001-15 — Review

The Diner had 46 recipes and 17 of its own, a full soup section, and two printed sections with
nothing under them. It now has 73 and 35, breakfast is stocked from home fries to eggs benedict,
and the sandwich page exists.

## What changed

**26 files created, all under `recipes/**`. Nothing modified, nothing deleted, no `src/` change.**

| Folder | New files |
| --- | --- |
| `fried-and-crispy` | `home-fries`, `hash-browns`, `corned-beef-hash`, `breakfast-sausage-patties`, `scrapple`, `french-fries`, `onion-rings` |
| `sandwiches-and-rolls` | `pork-roll-egg-and-cheese`, `smash-burger`, `patty-melt`, `club-sandwich`, `grilled-cheese`, `blt`, `tuna-melt` |
| `sauces-and-gravies` | `creamed-chipped-beef`, `hot-fudge` |
| `eggs` *(new folder)* | `eggs-benedict`, `western-omelette` |
| `drinks` | `milkshake`, `egg-cream` |
| `breads` | `buttermilk-biscuits` |
| `flatbreads-and-pancakes` | `french-toast` |
| `vegetables-and-sides` | `mashed-potatoes` |
| `custards-and-puddings` | `apple-pie` |
| `noodles` | `tuna-noodle-casserole` |
| `toppings-and-pickles` | `whipped-cream` |

One new category, `Eggs`, for the two dishes the counter is defined by and the collection had
nowhere to put. The reasoning and the four rejected homes are in `design.md` §4.

Nine commits, all through `lisa commit-ticket` with exact `--include` paths. `git status
--porcelain recipes/` is empty.

## Acceptance criteria against evidence

| Criterion | Evidence |
| --- | --- |
| Diner shelves ≥ 49 | **73** (`research.md` §1 counting script, re-run at the end) |
| ≥ 20 name it and no other counter | **35** |
| Top of the gap list written in order, skips named with a reason | ranks 1–13 resolved item by item in `progress.md`; seven skips, each with a reason |
| `check-recipes --labels` ok for every new file, labels read as a cook's verbs | all 26 ok; the staircases are in the per-commit runs, and commit 8 reworded 13 labels so every one opens with a verb `src/lib/icons.ts` draws |
| `title`, `category`, `tags`, `servings`, `counters`, and `aka` where it is ordered by another name | all 26 carry the five; all 26 carry `aka` |
| Every timer named | `grep -rn "~{"` over the 26 files returns nothing |
| Quantities real for the servings; canonical method | by hand, per file — see below |
| Only `recipes/**` modified | `git status --porcelain` clean apart from other tickets' files |

The diacritic clause of the `aka` criterion binds where a name carries one: `whipped-cream` lists
both `crème chantilly` and `creme chantilly`. This counter's other names — pon haus, pommes
frites, pain perdu — carry none.

## Method, where it would have been easy to cheat

Every one of these is a place the shortcut version is more common than the real one, and each
file says in prose why the shortcut is not taken:

- **Home fries** boiled whole, cooled, then cut and browned — not raw potato fried from cold.
- **Hash browns** rinsed and wrung dry; the wring is its own step because it is the dish.
- **Scrapple** from a real pork-and-bone broth, thickened with cornmeal *and* buckwheat, set
  overnight, sliced and fried unfloured.
- **Smash burger** coarse grind, nothing mixed in, no salt until after the smash, and the smash
  inside the first thirty seconds.
- **French fries** cut, soaked, blanched at 325°F, rested cold, fried again at 375°F.
- **Apple pie** two apple varieties, juice drained and reduced to a syrup before it goes back —
  which is what stops the lid floating over a gap — and cut only after four hours.
- **Mashed potatoes** from cold water, dried in the pan, riced, butter before warm milk.
- **Egg cream** syrup, then milk, then seltzer hard off the back of a spoon.

Quantities were set against the stated `servings` rather than copied: `scrapple` yields a loaf
of twelve slices from 2 lb of shoulder and 6 cups of its own broth; `apple-pie` is 3 lb of
apples in a 9-in shell; `buttermilk-biscuits` is eight from 3 cups of flour.

## Test coverage

There are no unit tests to write — this ticket adds data, not code, and `src/` belongs to
T-001-17. The collection-level tests are the integration tests over that data:

```
node scripts/check-recipes.mjs   all 514 file(s) draw a table
npm run recipes                  514 recipes, 27 categories, 514 counters named, 558 pairings
npx vitest run                   4 failed | 662 passed (666)
```

**The four failures are the step-0 baseline's four**, recorded before any file was written
(baseline: `4 failed | 586 passed`). Two of them deserve a note:

- **`icons.test.ts`** — 54 verbs fall through to the default icon. This ticket briefly pushed
  that to 67 and then brought it back to exactly 54; none of the 54 comes from a file here.
- **`shopping.test.ts`** — the unaisled fraction is 0.098 against a 0.02 gate, up from 0.078 at
  baseline, driven by every ticket adding recipes this week. Seven ingredient names from these
  26 files have no aisle: **dried savory, english muffins, hollandaise, kaiser rolls, ketchup,
  lager, seltzer**. Three of those (`english muffins`, `hollandaise`, `ketchup`) are recipes on
  this site used as ingredients, which is the existing pattern — `bánh mì đặc biệt` uses
  `pork liver pâté` the same way. The other four are shop items and want a line in
  `src/data/aisles.json`, which is T-001-17's file.

## Open concerns

1. **Nothing on this counter is printed yet.** `src/data/counters.json` has no *Breakfast all
   day* and no *Sandwiches and burgers* section, and the 26 new recipes are not listed in any of
   Diner's existing sections. They sit at the counter in the data and are invisible on the site
   until **T-001-17** wires the sections. This is by design — the ticket forbids touching `src/`
   — but it means "the sandwich page exists" is true of the collection and not yet of the page.
2. **Four handoffs to T-001-18**, listed in full in `progress.md`: `country-fried-steak`,
   `cream-gravy`, `meatloaf` and `tuna-salad` each want `Diner` added to their `counters:` line.
   Three of them are gap-list items this ticket could not write because a sibling ticket owns
   the file, so until T-001-18 runs, chicken fried steak and meatloaf are on the site but not at
   this counter.
3. **Four aisle entries for T-001-17**: `kaiser rolls`, `lager`, `seltzer`, `dried savory`.
4. **`tuna-melt` carries its own tuna salad** rather than pairing with T-001-14's `tuna-salad`,
   which was not on disk when the sandwich page was written. If someone later decides the two
   should be one dish, the melt's first step is the thing to cut.
5. **The `Eggs` category has two files.** That is thin, and it is deliberate: `pizzas` had four.
   If a later ticket writes shirred eggs, an omelette variant or a frittata, they have a home.

Nothing here needs a human decision before the ticket completes.
