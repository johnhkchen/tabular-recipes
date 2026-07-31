# T-001-10 — Research

What exists, where, and what constrains a new `.cook` file at the Taquería. Descriptive
only; no proposals.

## 1. The shape of the repository

| Path | What it holds |
| --- | --- |
| `recipes/<category>/*.cook` | The source of truth. 341 files across 20 category folders. Basenames are URLs and must be unique collection-wide. |
| `src/data/counters.json` | The 15 counters, their blurbs, and the menu sections each one prints. **Owned by T-001-17, not this ticket.** |
| `scripts/check-recipes.mjs` | Per-file gate. `--labels` prints the operation staircase. |
| `scripts/normalise.mjs` | The only place the cooklang WASM parser is touched. |
| `scripts/parse-recipes.mjs` | Walks `recipes/`, enforces cross-file facts, writes `src/generated/recipes.json`. |
| `src/lib/tree.ts`, `src/lib/layout.ts` | Steps → merge tree → tiled table. |
| `src/lib/icons.ts` + `icons.test.ts` | The verb→icon table, and a coverage test over every operation label in the collection. |
| `src/lib/collection.test.ts` | Slug uniqueness, mutual pairings, one plain way per dish, timer sanity. |
| `docs/gaps/taqueria.md` | The ranked work list for this ticket. |
| `docs/knowledge/counters.md` | The menu vocabulary the `>> aka:` lines are drawn from. |

`recipes/` categories in existence: bars-and-brownies, breads, cakes-and-loaves, cookies,
custards-and-puddings, dressings-and-dips, drinks, dumplings-and-rolls,
flatbreads-and-pancakes, noodles, pastry-and-doughs, rice-beans-and-grains, salads,
sandwiches-and-rolls, sauces-and-gravies, smoked-and-grilled, soups,
spice-blends-and-marinades, stews-and-braises, stir-fries.

## 2. What the Taquería actually shelves right now

`grep -rl Taquer recipes/` returns **20 files**, not the 17 the ticket and the gap doc say.
Three have arrived since the gap docs were compiled — `crema-mexicana`, `queso-fresco`,
`nixtamalised-masa` — all of them Panadería-first files that also name this counter.

Exclusive to the Taquería (names it and no other counter) — **12**:

```
arepas-de-queso   mexican-red-rice   refried-beans      flour-tortillas
cuban-black-beans carnitas           birria-de-res      taco-seasoning
chili-powder      red-enchilada-sauce salsa-roja        mole-poblano
```

Shared with another counter — **8**: corn-tortillas (+Panadería), flan (+Panadería),
mojo-marinade (+Deli), guacamole (+Deli), crema-mexicana (+Panadería), queso-fresco
(+Panadería), black-bean-soup (+Diner), nixtamalised-masa (+Panadería).

So the acceptance gate of **≥24 shelved / ≥18 exclusive** is 4 short on the first number
and 6 short on the second. Every new exclusive file moves both, so the exclusive count is
the binding constraint.

## 3. The work list, and where it is stale

`docs/gaps/taqueria.md` ranks 22 absences. Checked against `recipes/` rather than trusted:

- **#8 garnish tray** — `crema-mexicana` now exists (Panadería + Taquería). `salsa de
  aguacate` and `cebolla y cilantro` still do not.
- **#9 "nothing in the whole collection is pickled"** — stale. `do-chua` and
  `sour-dill-pickles` both live in `recipes/dressings-and-dips/`. Escabeche itself is still
  missing, and that folder is where a Mexican pickle would land.
- **Components list** — `queso-fresco`, `crema-mexicana` and `nixtamalised-masa` are
  written. `adobo para al pastor`, the toasted dried-chile purée, salsa verde in either
  form, achiote paste, consomé, escabeche, curtido, sope masa, queso Oaxaca, chicharrón,
  bolillo and horchata base are not.

Every slug this ticket would plausibly claim is free. `ls recipes/*/<slug>.cook` returns
nothing for al-pastor, adobo-para-al-pastor, salsa-verde{,-cruda,-asada}, carne-asada,
pollo-asado, tinga-de-pollo, chile-verde, lengua, suadero, cachete, tripas,
consome-de-birria, escabeche, elote, esquites, horchata, torta, sopes, huaraches, flautas,
alambre, machaca, quesabirria, chile-relleno, curtido, pupusas. Nothing here is an edit to
a file another ticket owns, so the T-001-18 escalation path in the ticket is not triggered
by the top of the list.

`docs/knowledge/counters.md` carries the Taquería vocabulary table verbatim — al pastor
(*pastor, adobada, trompo*), lengua (*beef tongue*), suadero (*res*), cachete (*beef cheek,
cabeza*), tripa (*tripas, tripe*), chile verde pork (*chile verde, puerco en salsa verde*),
consomé (*consome, dipping broth, caldo*), and so on. That table is the stated source for
`>> aka:` lines and it already contains diacritic-free spellings.

## 4. What a `.cook` file has to satisfy

**Metadata.** `title`, `category`, `tags`, `servings` are required by the checker.
`counters`, `aka`, `pairs-with`, `dish`, `kit`, `time` and `step.N` are optional. `counters`
naming a counter absent from `counters.json` is a build error. `pairs-with` takes slugs,
is made mutual at build time (so it is written on one side only), and pointing at a
non-existent slug is a build error.

**The tree.** Every step after the first says what it consumes — `@&(~1)x{}` for one step
back, `@&(3)x{}` for step 3. A step with no ingredients becomes a full-width row and must
sit at the top, because `~1` counts prep steps too. Splitting one preparation into two
later steps is refused; so are two endings.

**The checker's hard floors** (`scripts/check-recipes.mjs`):

- ≥3 ingredient rows, or "too thin to be a table".
- ≥3 operation columns, or "only one operation — nothing merges".
- No tiling errors from `findTilingErrors`.
- No operation cell with an empty label.
- Every named counter known.

The README's soft target is 5–16 rows and 3–6 operations; the T-001-06 files ran 4–15 rows
by 4–6 columns.

**The icon coverage test** is the gate that is not obvious from the ticket.
`src/lib/icons.test.ts` collects the first word of every operation label in the whole
collection and asserts `matchOperation` returns non-null for each. A new verb that is not
in `VERB_ICONS`/`PHRASE_ICONS` fails `npm run verify`. T-001-06's progress notes record
exactly this: seven opening verbs (`flavour`, `enclose`, `sharpen`, `alternate`, `curve`,
`stripe`, `tint`) fell through and six files had to be reworded, because `src/lib/icons.ts`
belongs to another ticket. The remedy lives in `recipes/**`.

Verbs the table already draws that this counter's work will want: toast, blend, strain,
marinate, braise, simmer, boil, sear, grill, char, griddle, fry, crisp, shred, chop, dice,
slice, mix, stir, toss, whisk, season, finish, spread, layer, stack, pack, wrap, rest,
cool, chill, skim, drain, rinse, pour, ladle, scoop, press, pat, roll, blister, render,
peel, trim, sprinkle, scatter, warm, reduce, steep, soak, pickle, cure.

**Timers.** `~name{20%min}` — the name says whether the wait is time you spend or time you
walk away from. `src/lib/time.ts` reads recognised names (`UNATTENDED`: braise, simmer,
marinate, chill, soak, rest, roast, steam, poach, stew…; `HANDS_ON`: fry, sear, grill,
toast, stir, sauté…); an unrecognised name falls through to the operation label and then to
"you are standing there". `collection.test.ts` fails any hands-on timer of ≥240 min, and
any timer whose unit it cannot read. Ranges parse (`~{3-4%hr}` is used in `birria-de-res`).
This ticket requires every timer in every new file to be named, which the existing
collection does not generally do — 53 unnamed `~{10%min}` and similar are in the tree.

**Labels.** The cell label is the step text with ingredients stripped, tidied by
`cleanLabel`. `>> step.N: …` overrides it, 1-based over steps as written. The `--labels`
staircase is how you see whether the result reads as a cook's verb.

## 5. Precedent worth copying

`recipes/stews-and-braises/birria-de-res.cook` is the closest existing neighbour: preheat as
a full-width prep row, toast chiles, blend the adobo, strain it, season the meat, pour over,
braise. Seven steps, `step.6`/`step.7` overridden. `carnitas.cook` is the same shape in five
steps. `salsa-roja.cook` is the four-step table sauce: char on a comal, blend coarse, fry,
finish off the heat — and it labels all four by hand.

`burnt-ends.cook` and `chopped-pork.cook` show a component recipe used as a plain ingredient
in another recipe (`@barbecue sauce{1%cup}(240 mL)`) rather than as a tree edge, which is
the only way one table can lean on another.

`aka` lines in the collection are generous and carry misspellings on purpose — `chopped-pork`
lists *barbeque*, *bbq*, *brownies*, *outside brown*. Diacritic-free forms are the norm.

## 6. Boundaries

- **Only `recipes/**`.** `src/` is T-001-17's: the menu sections in `counters.json` and the
  shopping aisles. A new recipe therefore does *not* appear on the rendered Taquería menu
  until T-001-17 runs; it appears in the counter's recipe set via `>> counters:` regardless,
  which is what the acceptance criteria count.
- **An existing file that only needs this counter added is T-001-18's**, recorded in the
  work artifact rather than edited here. Nothing at the top of the gap list is in that
  state.
- `src/generated/` is not committed; `npm run recipes` rebuilds it.

## 7. Constraints and assumptions carried into Design

1. The exclusive count (12 → 18) is the binding number; 6 new exclusive files clear both
   gates, and the gap list's ranking decides which 6+.
2. Some gap entries cannot be a table at all under the 3-row/3-column floor — a garnish of
   onion and cilantro, a cup of chiles toreados, a single agua fresca. The gap doc's own
   "What it could not stock" section says as much for the aguas frescas and the grid.
3. Al pastor cannot be written as the trompo makes it; the gap doc states the home
   loaf-pan version is a different dish and should say so.
4. Birria and its consomé cannot come off one table — one preparation, two endings, which
   the layout refuses. The consomé has to start from the braise as its own file.
5. Opening verbs are a hard gate via `icons.test.ts`, and the fix has to be in the recipe
   wording, not in `src/lib/icons.ts`.
