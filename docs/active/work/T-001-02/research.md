# T-001-02 — Research

What is on the shelf, what the format demands, and what the gap doc actually says. No
proposals here; those are `design.md`.

## 1. The counter as it stands

`src/data/counters.json` defines fifteen counters. **Phở & Bánh Mì** (slug
`pho-and-banh-mi`, blurb "A bowl of soup, a sandwich, and iced coffee.") declares no
`categories` fallback, so every recipe on it must name it explicitly with `>> counters:`.

Four files name it today — the ticket's count, not the gap doc's "1 recipe":

| Slug | Folder | `counters:` | Exclusive? |
| --- | --- | --- | --- |
| `banh-xeo` | `flatbreads-and-pancakes` | Phở & Bánh Mì | yes |
| `do-chua` | `dressings-and-dips` | Phở & Bánh Mì | yes |
| `pork-liver-pate` | `dressings-and-dips` | Phở & Bánh Mì, Deli | no |
| `char-siu` | `stews-and-braises` | Dim Sum Counter, Takeout Counter, Phở & Bánh Mì | no |

So the starting position against the acceptance criteria is **4 on the counter, 2 of them
exclusive**. The bar is 16 and 12.

`counters.json` prints two sections for this counter — "Bánh mì (S)" holding
`pork-liver-pate`, `do-chua`, `char-siu`, and "Appetisers / plates (A)" holding `banh-xeo`.
That file is T-001-17's; nothing here touches it. A new recipe that names the counter but is
in no printed section still renders (the menu page falls back), but placing it properly is
T-001-17's job, so this ticket only has to make the files correct and let that ticket shelve
them.

## 2. What the gap doc lists, checked against the folder

`docs/gaps/pho-and-banh-mi.md` is ranked, most conspicuous absence first. The ticket warns it
is stale. Checking every ranked item against `ls recipes/*/*.cook`:

| # | Gap item | On the shelf? |
| --: | --- | --- |
| 1 | Bánh mì đặc biệt | no |
| 2 | Pâté | **yes** — `recipes/dressings-and-dips/pork-liver-pate.cook`, already counters this counter |
| 3 | Đồ chua | **yes** — `recipes/dressings-and-dips/do-chua.cook`, exclusive to this counter |
| 4 | Phở bò / phở gà | no |
| 5 | Chả lụa | no |
| 6 | Bánh mì thịt nướng | no |
| 7 | Bún thịt nướng | no |
| 8 | Nước chấm | no |
| 9 | Chả giò / gỏi cuốn | no |
| 10 | Cơm tấm | no |
| 11 | Cà phê sữa đá | no |
| 12 | Xíu mại | no |
| 13 | Nem nướng | no |
| 14 | Bì | no |
| 15 | Chả cá | no |
| 16 | Chả bông | no |
| 17 | Bò kho | no |
| 18 | Bún bò Huế | no |
| 19 | Pâté chaud | no |
| 20 | Bánh mì ốp la | no |
| 21 | Chè ba màu | no |
| 22 | Thịt nguội / giò thủ | no |
| 23 | Bánh mì không | no |

Two of the top three are already written. The doc's own header ("**1 recipe.** … That pâté is
not here. Neither is the bread, the pickle…") is out of date on exactly the two items the
ticket flagged as stale. The bread is still missing.

Of the "Components it would need" list, only **pâté** and **đồ chua** exist. `mayonnaise`
(Deli) and `baguette` (Bakery, Deli) exist but are, by the doc's own reading, *different
things* from the sandwich's mayonnaise and the Vietnamese roll.

## 3. The "What it could not stock" section

The ticket says this section is not a to-do list. Read literally, it contains seven entries,
and they are not all the same kind of refusal:

- **"The sandwich, honestly."** Refuses the sandwich *as a component-bearing table*, then
  names the shape that does work: *"a short assembly recipe that names its components and
  pairs to them, with the components written properly."* This is a prescription, not a veto.
- **"Phở as one table."** Refuses phở as one recipe and names the split: *"Two recipes: the
  broth, and the bowl that consumes it."* Also a prescription.
- **"Đặc Biệt."** Refuses "all of them at once" as a *rule* — "not a dish."
- **"The numbering."** Belongs in `aka`. Directly actionable as metadata.
- **"The beef-cut ladder."** Seven extras on one broth are a topping list, not seven rows.
- **"The cold case."** A display, not a table — *"though chả lụa and giò thủ individually are
  worth writing."*
- **"Chả lụa at full fidelity."** Writable *with a caveat*, and the caveat is called the
  recipe's most useful line.

Four of the seven end by naming what *can* be written. Only "Đặc Biệt" as a rule, "the
numbering", "the beef-cut ladder" and "the cold case" are flat refusals.

## 4. The file format, as enforced

`README.md` plus `scripts/check-recipes.mjs` are the contract. A `.cook` file fails unless:

- `title`, `category`, `tags`, `servings` are present as `>> key: value` lines.
- Every name in `counters:` is in `src/data/counters.json` — checked by both
  `check-recipes.mjs` and `parse-recipes.mjs`.
- The steps form **one merge tree**: every step after the first names what it consumes
  (`@&(~1)x{}` = one step back, `@&(3)x{}` = step 3); no preparation is consumed twice
  (splitting is refused); every branch merges into one final step.
- `grid.rowCount >= 3` (three ingredient rows) and `grid.colCount >= 3` (more than one
  operation).
- No operation cell comes out with an empty label.

The README asks for **5–16 ingredient rows and 3–6 operations**. `colCount` observed in
T-001-01's work is `operations + 1`, so 3–6 operations is 4–7 columns.

A step with no ingredients (`Preheat the #oven{} to 325°F.`) becomes a full-width row, and
**must be kept at the top**, because `~1` counts every step including prep ones.

Labels are derived by stripping ingredients out of the step, and are overridable with
`>> step.N: …` (N is 1-based over steps as written). `--labels` prints the staircase. The
acceptance criterion "reads as a cook's verbs rather than sentence fragments" is judged on
that printout.

`pairs-with` takes slugs, is made mutual at build time, and **pointing at a recipe that is
not here is a build error**. So a pairing written on my side needs no edit on the other side —
which matters, because editing another ticket's file is forbidden.

**Timers.** `src/lib/time.ts` reads a timer's *name* to decide whether a wait is hands-on or
unattended, falling back to the operation label and then to "you are standing there". The
acceptance criterion "every timer in every new file is named" is checked by `grep '~{'`
returning nothing. Note that several existing files (`banh-xeo`, `baguette`,
`chicken-noodle-soup`, `red-braised-pork-belly`) use bare `~{…}`; the two recent
Vietnamese files (`pork-liver-pate`, `do-chua`) name every timer. The recent files are the
precedent to follow.

`time.ts` also classifies by name: `simmer`, `soak`, `brine`, `chill`, `marinate`, `steep`,
`poach`, `drain`, `press`, `rest` are unattended; `stir`, `grill`, `sear`, `fry`, `toast`,
`whisk` are hands-on. `boil`, `dry` and `press` are only trusted when an author names them.

## 5. Categories and folders

Thirteen category folders exist: `bars-and-brownies`, `breads`, `cakes-and-loaves`,
`cookies`, `custards-and-puddings`, `dressings-and-dips`, `flatbreads-and-pancakes`,
`pastry-and-doughs`, `rice-beans-and-grains`, `sauces-and-gravies`, `soups`,
`spice-blends-and-marinades`, `stews-and-braises`.

Category comes from the folder unless `>> category:` overrides it. `scripts/find-recipes.mjs`
walks `recipes/` recursively, so **a new folder needs no registration anywhere** — it is
picked up by the walk. `parse-recipes.mjs` only reports the category count. The one
consequence of a new category is that no counter claims it as a fallback, so recipes in it
must name their counters — which every file here will.

Observed placement precedents that matter:

- `char-siu` (an oven roast) sits in `stews-and-braises`, so that folder is the de-facto
  home for meat that is not a soup, a rice dish or a bread.
- `pork-liver-pate` (a baked terrine) sits in `dressings-and-dips`, because it is spread.
- `banh-xeo` (a rice-flour crepe) sits in `flatbreads-and-pancakes`.
- `chicken-noodle-soup` sits in `soups`, so a noodle soup is a soup.

Nothing in the collection is a **sandwich**, a **roll**, or a **drink**. There is no folder
that could take a bánh mì without lying about it, and the gap doc says outright that there is
**no drink recipe anywhere on the site**.

## 6. Cross-collection invariants I can break

`src/lib/collection.test.ts` and `scripts/parse-recipes.mjs` enforce: unique slugs across the
whole collection (the slug is the URL), no dangling `pairs-with`, pairings mutual, no
self-pairing, no recipe without a counter, one plain way per `dish`.

Two tests are sensitive to what I add:

- `src/lib/schedule.test.ts` → "the recipes with the longest critical path … are the three
  ferments" pins `sour-dill-pickles`, `injera`, `pizza-dough` by name. **It already fails**
  on `main`: T-001-01's `crema-mexicana` (1680 min) displaced `pizza-dough` (1568 min), and
  T-001-01 deliberately left it red because `src/lib/` is owned by no ticket in this story.
  Baseline measured this session: `npx vitest run` → **405 passed, 1 failed**, that one. A
  phở broth is 6–8 hr (360–480 min) and a chả lụa overnight chill is ~14 hr (840 min), both
  far below the 1568-min cut, so nothing here should move that list further.
- `src/lib/shopping.test.ts` → "finds an aisle for nearly everything" fails if more than
  **2%** of distinct ingredient names fall to the `other` aisle. Measured this session:
  **zero** unplaced names (the test printed no report). `src/data/aisles.json` is T-001-17's,
  so any Vietnamese ingredient with no pattern (rice paper, thính, bánh phở noodles) eats
  into that 2% and cannot be fixed from here — it can only be measured and reported.

`npm run recipes` baseline: `parsed 254 recipe(s) in 13 categories · counters: 254 named, 0
inferred from category · timers in 234 · pairings 138`.

## 7. Ownership boundaries

- **Mine:** `recipes/**` only. New folders under `recipes/` are mine to create.
- **T-001-17's:** all of `src/`, including `src/data/counters.json` (menu sections) and
  `src/data/aisles.json` (shopping aisles).
- **T-001-18's:** any edit to a `.cook` file another ticket wrote. The ticket says to *record*
  such an edit in the work artifact rather than make it. The live candidate is `mayonnaise`
  (currently Deli only) — the gap doc says to "pair to it and note the difference" rather than
  duplicate it, and a `pairs-with` from my side is mutual at build time, so the only true
  hand-off is whether `mayonnaise` should also name this counter.
- `docs/gaps/` is rewritten by T-001-18, not here.

## 8. Constraints and assumptions carried into Design

1. Twelve new exclusive files is the arithmetic minimum (2 + 12 = 14 ≥ 12 exclusive;
   4 + 12 = 16 total). There is no slack at twelve — one file that has to be dropped puts the
   ticket under the bar.
2. `char-siu` and `pork-liver-pate` already carry this counter; neither needs an edit.
3. Every dish left on the ranked list is genuinely absent, so nothing on it is a "record it
   for T-001-18 instead" case.
4. The gap doc's component list is a dependency graph: the sandwich needs the bread, the
   pickle, the pâté and a cold cut; bún thịt nướng and cơm tấm share one lemongrass marinade;
   chả giò, gỏi cuốn and bún all sit on nước chấm. Writing order matters for `pairs-with`
   only in that every target slug must exist by the time the collection is parsed — not by
   the time each file is written.
5. The suite is already red for a reason outside this ticket's ownership. "All tests pass" is
   not an available end state; "no *new* failures" is.
