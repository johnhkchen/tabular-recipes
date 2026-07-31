# T-001-14 — Research

What exists, where, and what constrains a new `.cook` file at the Deli. Descriptive only;
no proposals.

## 1. The shape of the repository

| Path | What it holds |
| --- | --- |
| `recipes/<category>/*.cook` | The source of truth. **421 files** across 22 category folders. Basenames are URLs and must be unique collection-wide. |
| `src/data/counters.json` | The 15 counters, their blurbs, and the menu sections each prints. **Owned by T-001-17, not this ticket.** |
| `src/data/aisles.json` | Ingredient-name → shopping aisle patterns. Also not this ticket's. |
| `scripts/check-recipes.mjs` | The per-file gate. `--labels` prints the operation staircase. |
| `scripts/normalise.mjs` | The only place the cooklang WASM parser is touched. |
| `scripts/parse-recipes.mjs` | Walks `recipes/`, enforces cross-file facts, writes `src/generated/recipes.json` (gitignored). |
| `src/lib/tree.ts` → `layout.ts` | Steps → merge tree → tiled table. |
| `src/lib/icons.ts` + `icons.test.ts` | Verb → icon table, with a coverage test over every operation label in the collection. |
| `src/lib/time.ts` | Reads timers. A **named** timer is the author saying outright whether a wait is unattended. |
| `docs/gaps/deli.md` | The ranked work list for this ticket. |
| `docs/knowledge/counters.md` §Deli (lines 628–688) | The menu vocabulary the `>> aka:` lines are drawn from. |

Category folders in existence: bars-and-brownies, breads, cakes-and-loaves, cookies,
custards-and-puddings, dressings-and-dips, drinks, dumplings-and-rolls,
flatbreads-and-pancakes, fried-and-crispy, noodles, pastry-and-doughs,
rice-beans-and-grains, salads, sandwiches-and-rolls, sauces-and-gravies,
smoked-and-grilled, soups, spice-blends-and-marinades, stews-and-braises, stir-fries,
toppings-and-pickles.

## 2. What the Deli actually shelves right now

`grep -rl '^>> counters:.*Deli' recipes/` returns **41 files**, not the 38 the gap doc says
and not the 40 the ticket says. Three arrived after the gap docs were compiled:

- `dressings-and-dips/sour-dill-pickles.cook` — **gap rank #1 is already written**, and it is
  the lacto ferment the doc asks for, not a vinegar quick pickle.
- `dressings-and-dips/coleslaw.cook` — **gap rank #5 is already written** (Smokehouse, Deli,
  Meat and Three).
- `dressings-and-dips/pork-liver-pate.cook` — a Phở & Bánh Mì file that does not name the Deli;
  it is the pâté the ticket's staleness note refers to.

Exclusive to the Deli (names it and no other counter) — **8**: `aioli`, `basic-vinaigrette`,
`chimichurri`, `mayonnaise`, `romesco`, `sour-dill-pickles`, `blini`, `borscht`.

The acceptance gate is **≥ 44 shelved / ≥ 12 exclusive**. So: 3 short on the first, 4 short on
the second. Every new Deli-only file moves both, so the exclusive count is the binding one —
but the ranked list is much longer than four dishes, and the criterion asks for the top of the
list "as far as the count reaches", not for the minimum.

Composition of the 41: 8 breads, 15 spreads/dressings, 7 soups, 6 sweet things, 1 braise,
blini, cranberry-sauce, mojo-marinade. Confirmed: **no cured meat, no fish of any kind, no
salad-by-the-pound, no sandwich, one pickle and no kraut.**

## 3. The work list, checked against `recipes/` rather than trusted

`docs/gaps/deli.md` ranks 25 absences. Ranks 1 and 5 are done (above). Everything else on the
list is genuinely absent — checked slug by slug with `ls recipes/*/<slug>.cook`:

```
pastrami  corned-beef  russian-dressing  matzo-ball-soup  chicken-broth  chicken-stock
schmaltz  potato-salad macaroni-salad    egg-salad        tuna-salad     chicken-salad
chopped-liver  cream-cheese  whitefish-salad  lox  belly-lox  sauerkraut  knish
potato-knish   farmer-cheese
```

— all twenty-one return "no matches found". Nothing here is an edit to a file another ticket
owns, so §2 of the ticket's preamble (record it for T-001-18 instead) does not fire for any
planned dish.

Adjacent things that DO exist and are worth knowing about: `chintan-broth`, `pho-broth`,
`tonkotsu-broth` (so a clear poultry broth has three siblings and a naming convention),
`chicken-noodle-soup` (Diner + Deli, and it makes its stock from a carton), `smoked-brisket`,
`smoked-bologna`, `burnt-ends` (the Smokehouse's beef, and the closest method neighbours to
pastrami), `pork-liver-pate` (the closest neighbour to chopped liver), `paneer` and
`queso-fresco` (fresh-curd cheeses, so cream cheese has a house pattern to follow),
`ajitama`, `menma`, `sumac-onions` (the whole of `toppings-and-pickles`).

## 4. "What it could not stock" is binding, and it removes several ranked items

The last section of the gap doc gives reasons, not preferences, and three of them delete
ranked entries outright:

- **A sandwich** is "one operation and eight leaves: under the floor on operations and over it
  on the point." That takes out the *assembly* half of rank 2 (pastrami on rye), rank 3
  (Reuben, Rachel), rank 12 (Italian combo/hoagie), rank 13 (cheesesteak) and rank 23 (Jersey
  sloppy joe). It does **not** take out the meats themselves: "A table can hold a wet cure and
  a cook — pastrami and corned beef both work."
- **Cold-smoked fish**: nova is equipment. But "a lox cure — salt and sugar, three days, no
  heat" is listed under components as writable, and `counters.md` line 650 records **belly lox**
  as its own menu item, salt-cured and never smoked. So the honest fish is belly lox, not nova.
- **Dry-cured anything** takes out capicola, mortadella, soppressata, kabanosy — which is most
  of what an Italian combo is made of.

The checker enforces the same floor mechanically: `grid.rowCount < 3` and `grid.colCount < 3`
both fail. A file needs **≥ 3 ingredient leaves and ≥ 2 chained operations**.

## 5. What a `.cook` file has to satisfy

Six independent gates, all of which have to hold at once:

1. **Metadata.** `check-recipes.mjs` requires `title`, `category`, `tags`, `servings`. The
   ticket additionally requires `counters` and, where a dish is ordered by another name, `aka`
   including a diacritic-free form. `counters` is validated against `src/data/counters.json`;
   the name is exactly `Deli`.
2. **The tree.** `buildTree()` throws on three things: a step no other step consumes (more than
   one root), a step consumed by *two* later steps ("a table is a tree"), and a reference to a
   step that makes nothing. `@&(~n)name{}` means *n steps back*, resolved by the parser —
   `sour-dill-pickles` step 4 reaches `~3` for the brine and `~1` for the packed jar.
3. **The tiling.** `findTilingErrors()` demands every (row, column) covered exactly once.
   In practice this follows from a well-formed tree.
4. **Labels.** Every operation cell must be non-empty. `>> step.N:` overrides the derived label
   and is the norm in this collection — `cleanLabel()` produces fragments when a step is
   ingredient-heavy. Labels read as lowercase cook's verbs.
5. **Timers.** `readTimers()` trusts a timer's *name* first — `~ferment{3%weeks}` — and only
   then guesses from the words around it. The ticket requires every timer named. The vocabulary
   that gets a reading is fixed in `time.ts`: UNATTENDED (`brine`, `cure`, `smoke`, `steam`,
   `simmer`, `chill`, `soak`, `drain`, `ferment`, `rest`, `bake`, `poach`, `refrigerate`, …)
   and HANDS_ON (`whisk`, `stir`, `fry`, `sear`, `toast`, `beat`, `knead`, `skim`, …). An
   unrecognised name is not a claim and falls through — so naming a timer badly is worse than
   naming it well.
6. **Pairings.** `parse-recipes.mjs` throws if `>> pairs-with:` names a slug that is not a
   recipe here, and makes pairings mutual at build time. So a pairing is a hard dependency on
   another file existing — including files written inside this ticket.

## 6. The verb→icon coverage test, and what it means for step labels

`icons.test.ts` collects the **first word of every operation label in the collection** and
fails if any of them has no reading in `VERB_ICONS`. It is currently red with 46 fall-throughs
(`balti`, `palak`, `tonkotsu`, `the`, `two`, …) — all of them from other counters' files, none
from a Deli file. Any label I open with a noun adds to that list by name. The mapped
vocabulary is large and covers everything this counter needs: `brine`, `cure`, `smoke`,
`steam`, `simmer`, `boil`, `render`, `chop`, `fold`, `whisk`, `beat`, `drain`, `press`,
`pack`, `roll`, `bake`, `chill`, `rinse`, `skim`, `scoop`, `spread`, `season`.

## 7. Baseline test state, recorded before touching anything

`npm test` → **4 failed / 559 passed**, all four pre-existing and all four caused by files
other tickets added:

| Test | Why it is red now |
| --- | --- |
| `icons.test.ts` — recognises every verb | 46 noun-opening labels, from Curry House / Ramen / Dim Sum files |
| `schedule.test.ts` — are the three ferments | expects `sour-dill-pickles, injera, pizza-dough`; gets `sour-dill-pickles, ginger-garlic-paste, lime-pickle` |
| `schedule.test.ts` — agree with what their authors claim | falls out of the same list; `ginger-garlic-paste` claims minutes its timers do not |
| `shopping.test.ts` — finds an aisle for nearly everything | 6.8% of ingredient names unaisled against a 2% gate |

`node scripts/check-recipes.mjs` → **all 421 files draw a table.** That one is green, and it is
the gate the ticket names.

Two of these are sensitive to what this ticket adds. The schedule test ranks by critical path:
a multi-day cure would enter that top three and change the received list again. The shopping
test ranks by unmatched ingredient names: every unfamiliar name (pink curing salt, matzo meal,
smoked whitefish) is a candidate to push the ratio further from its gate. Neither is this
ticket's to fix — `src/` is T-001-17's and the aisle data is not recipe data — but both are
this ticket's to not make worse than it has to.

## 8. Constraints and assumptions, stated

- **Only `recipes/**` may be modified.** `src/data/counters.json` menu sections are T-001-17's,
  so a new file becomes visible on the Deli page through that ticket, not this one.
- **`servings` is a cook's bowl, not a shop's tub.** The gap doc says outright that "a tub of
  coleslaw scaled for a shop is not a cook's bowl". Quantities are for a household batch.
- **A component gets its own file when it is also a case item.** Schmaltz, cream cheese, clear
  broth and farmer cheese are all listed twice in the gap doc — once under components and once
  under things sold by weight — which is the doc saying they are both.
- **`dish`/`kit` are for equipment variants**, not for a component and the thing it feeds; the
  relation between a broth and the soup that uses it is `pairs-with`, and there is no
  cross-recipe include in this format. A recipe that needs a component either restates it as
  steps or names it as an ingredient.
