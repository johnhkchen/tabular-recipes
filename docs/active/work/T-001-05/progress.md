# T-001-05 — Progress

Fourteen files written, six commits, plan followed with one addition (unit 6). Complete.

## Commits

| Unit | Commit | Files |
| --- | --- | --- |
| 1 — the dip and both slaws | `9d446d6` | `barbecue-dip`, `barbecue-slaw`, `coleslaw` |
| 2 — the pit, pork | `a494d49` | `chopped-pork`, `smoked-pork-ribs`, `rib-tips` |
| 3 — the pit, beef | `5a43627` | `smoked-brisket`, `burnt-ends` |
| 4 — poultry and the bologna | `5cbe59f` | `smoked-chicken`, `smoked-turkey-breast`, `smoked-bologna` |
| 5 — bread, side, sweet | `f59fe71` | `hush-puppies`, `brunswick-stew`, `banana-pudding` |
| 6 — labels and one ingredient name | `c39ad8e` | eight of the above, metadata only |

Every commit through `lisa commit-ticket --ticket-id T-001-05` with exact `--include` paths. No
ordinary `git add` or `git commit` was run; no ticket-owned file is left staged, modified or
untracked.

## Deviation from the plan: unit 6

The plan had five units. A sixth was needed after the full test suite was read for the first time.

`src/lib/icons.test.ts` asserts that **every verb the collection opens an operation with** is one
`src/lib/icons.ts` can draw. Nine of my label overrides opened with verbs it does not know — `off`,
`pull`, `sauce`, `back`, `cube`, `spatchcock`, `dry`, `drop`, `in`. The test's own message offers
two remedies: add the verbs to `VERB_ICONS`, or change the labels. `src/lib/icons.ts` belongs to
T-001-17, and the ticket says not to touch `src/`, so the labels changed:

| Was | Now | Why it is not worse |
| --- | --- | --- |
| `off the heat, rest overnight` | `rest overnight off the heat` | same words, the verb leads |
| `off the heat, cool 20 min` | `cool 20 min off the heat` | same |
| `pull the membrane, rub` | `trim the membrane, rub` | what a butcher calls it |
| `sauce for wet, dust with rub for dry, set 45 min` | `glaze for wet, dust for dry, set 45 min` | shorter, and the dry side no longer needs the word rub twice |
| `back in until the glaze tightens, 45 min` | `smoke 45 min, until the glaze tightens` | says the method rather than the direction |
| `cube, toss` | `cut in 1-in cubes, toss` | now matches the step it labels |
| `back in until the edges candy, 2 hr` | `smoke 2 hr, until the edges candy` | as above |
| `spatchcock, rub` | `butterfly, rub over and under the skin` | plainer word, same cut |
| `dry the skin uncovered, 4 hr` | `chill uncovered 4 hr, to dry the skin` | the fridge is the operation; drying is why |
| `drop by the spoonful, fry 4 min, drain` | `fry by the spoonful, 4 min, drain` | frying is the operation |
| `in with the potato, simmer 25 min` | `add the potato, simmer 25 min` | reads as an instruction |
| `in with the meat and the beans, simmer 30 min` | `stir in the meat and the beans, simmer 30 min` | same |

After the change the collection's fall-through list holds **fourteen verbs, none of them from this
ticket** (`bowl, bruise, build, crack, dress, firm, load, pile, plate, return, ribbon, serve,
slide, velvet` — all from other tickets in flight).

The same unit renamed one ingredient: `@St. Louis cut spare ribs` → `@pork spare ribs{}(St. Louis
cut, …)`. `src/lib/shopping.ts` finds a butcher's aisle for the second and none for the first, and
the cut belongs in the note anyway.

## Gap list: what was written and what was not

| # | Item | State |
| --- | --- | --- |
| 1 | Chopped pork | `chopped-pork` |
| 2 | Sliced brisket | `smoked-brisket`, lean/moist in the last label and in `aka` |
| 3 | Pork ribs, St. Louis | `smoked-pork-ribs`, dry and wet in the last label and in `aka` |
| 4 | Burnt ends | `burnt-ends` |
| 5 | The dip | `barbecue-dip` |
| 6 | Barbecue slaw and white slaw | `barbecue-slaw`, `coleslaw` |
| 7 | Hush puppies | `hush-puppies` |
| 8 | Banana pudding | `banana-pudding`, at all three counters that sell it |
| 9 | Cornbread | **skipped — already written.** `skillet-cornbread` and `hot-water-cornbread` both name Smokehouse. The gap doc is stale here |
| 10 | Smoked chicken and turkey | `smoked-chicken`, `smoked-turkey-breast` |
| 11 | Smoked bologna | `smoked-bologna` |
| 12 | Brunswick stew | `brunswick-stew` |
| 13 | Rib tips | `rib-tips` |
| 14 | Mac and cheese, potato salad, collard greens, pit beans | **not written** — the count was reached at 21. Collards and pit beans both start from smoked pork stock, a component the gap doc says Meat and Three needs too; writing it inside a counter ticket would hand T-001-13 a file to edit rather than write. Mac and cheese and potato salad are the cold/starch end of three counters' lists |
| 15 | Smoked sausage / hot links | **not written** — count reached. Grinding and stuffing is a different craft from the pit and wants its own file pair (sausage, then smoking it) |
| 16 | Coarse chopped | **written inside item 1**, not as its own file. Same cook, different knife at the end; a separate file would be the one-preparation-two-products split the build refuses. It is in `chopped-pork`'s `aka` and its final label |
| 17 | Peach cobbler and pecan pie | **not written** — count reached. Both are also on Meat and Three's list, and `pecan-pie-bars` already exists, so a pie needs deciding against it |
| 18 | Sweet tea | **not written** — count reached. The site now has one drink (`ca-phe-sua-da`, written by T-001-02 while this ticket ran), so a drinks category exists for whoever takes it |

## Hand-offs recorded for other tickets

Nothing was edited outside `recipes/`. These are the edits this ticket would have made if it
owned the files:

**For T-001-17** (`src/data/counters.json`, `src/data/aisles.json`):

1. The Smokehouse menu has four sections and now holds 21 recipes; seventeen of them land in the
   trailing "Also" catch-all. The sections the gap doc's own headings suggest: **From the pit** —
   `chopped-pork`, `smoked-brisket`, `smoked-pork-ribs`, `burnt-ends`, `rib-tips`,
   `smoked-chicken`, `smoked-turkey-breast`, `smoked-bologna`; **Sauce on the table** —
   `barbecue-dip` first, then `barbecue-sauce`; **Sides** — `barbecue-slaw`, `coleslaw`,
   `brunswick-stew`, `boston-baked-beans`; **Bread** — `hush-puppies`, `skillet-cornbread`,
   `hot-water-cornbread`; **Dessert** — `banana-pudding`; **Rubs and brines** — unchanged.
2. Two ingredient names this ticket introduced have no aisle: **`barbecue sauce`** (used in five
   files; a condiments aisle) and **`vanilla wafers`** (a cookies/baking aisle). `aisleFor` places
   every other new ingredient, including `beef tallow`, `pork rib tips` and `beef bologna`.

**For T-001-18** (`docs/gaps/`, whole-shelf pass):

3. `docs/gaps/smokehouse.md` is stale in two places even before this ticket's work: "There is no
   cornbread" is no longer true, and the counter is described as holding 5 recipes when it held 7.
4. New category **`Smoked & Grilled`** (`recipes/smoked-and-grilled/`, 8 files). No counter claims
   it as a fallback, which is correct — every file in it names Smokehouse outright.
5. `coleslaw` is written once and named at Smokehouse, Deli and Meat and Three, so
   `docs/gaps/deli.md` item 5 and `docs/gaps/meat-and-three.md` item 18 are answered by it. Ditto
   `banana-pudding` for `docs/gaps/meat-and-three.md` item 11.
6. Components the gap doc asks for that are still unwritten: **smoked pork stock**, **a
   salt-and-pepper beef rub** as its own file, **Alabama white sauce**, **Carolina mustard
   sauce**, **Kansas City thick sauce**, **slaw dressing as a component**. The brisket carries its
   salt-and-pepper seasoning inline, which is the whole of that rub; a separate file would be one
   ingredient row and a whisk.
