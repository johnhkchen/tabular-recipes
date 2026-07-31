# T-001-12 — Research

What exists, where, and what constrains a new `.cook` file at the Pizzeria. Descriptive
only; no proposals.

## 1. The shape of the repository

| Path | What it holds |
| --- | --- |
| `recipes/<category>/*.cook` | The source of truth. 443 files across 22 category folders. Basenames are URLs, unique collection-wide. |
| `src/data/counters.json` | The counters, blurbs, and the menu sections each one prints. **Owned by T-001-17, not this ticket.** |
| `scripts/check-recipes.mjs` | Per-file gate. `--labels` prints the operation staircase. |
| `scripts/normalise.mjs` | The only place the cooklang WASM parser is touched. |
| `scripts/parse-recipes.mjs` | Walks `recipes/`, enforces cross-file facts, writes `src/generated/recipes.json`. |
| `src/lib/tree.ts`, `src/lib/layout.ts` | Steps → merge tree → tiled table. |
| `src/lib/icons.ts` + `icons.test.ts` | The verb→icon table, and a coverage test over every operation label in the collection. |
| `src/lib/time.ts` | Timer names → minutes, and hands-on vs unattended. |
| `src/lib/collection.test.ts` | Slug uniqueness, mutual pairings, one plain way per dish, timer sanity. |
| `docs/gaps/pizzeria.md` | The ranked work list for this ticket. |
| `docs/knowledge/counters.md` | The menu vocabulary the `>> aka:` lines are drawn from. |

Category folders in existence: bars-and-brownies, breads, cakes-and-loaves, cookies,
custards-and-puddings, dressings-and-dips, drinks, dumplings-and-rolls,
flatbreads-and-pancakes, fried-and-crispy, noodles, pastry-and-doughs,
rice-beans-and-grains, salads, sandwiches-and-rolls, sauces-and-gravies,
smoked-and-grilled, soups, spice-blends-and-marinades, stews-and-braises, stir-fries,
toppings-and-pickles.

`fried-and-crispy` currently holds exactly one file (`karaage`), which is the precedent
that a counter's ticket may open a new folder when the existing ones do not fit.

## 2. What the Pizzeria actually shelves right now

`grep -rl Pizzeria recipes/` returns **22 files**, which matches the ticket and the gap
doc exactly — unlike the Taquería and Curry House, nothing has landed here since the gap
docs were compiled.

Exclusive to the Pizzeria (names it and no other counter) — **16**:

```
socca              risotto-alla-milanese  mushroom-risotto   polenta
osso-buco          zabaglione             pizza-dough        panna-cotta
beurre-blanc       vodka-sauce            marinara-sauce     bechamel
arrabbiata-sauce   bolognese              alfredo-sauce      puttanesca-sauce
```

Shared with another counter — **6**: focaccia (+Bakery), basil-pesto (+Deli),
caesar-dressing (+Deli), blue-cheese-dressing (+Diner), ranch-dressing (+Diner),
minestrone (+Deli).

The gate is **≥27 shelved / ≥20 exclusive**. That is 5 short on the first number and 4
short on the second, so **five new exclusive files clear both**. Every new exclusive file
moves both counts, so the shelved count (5) is the binding one here — the reverse of the
Taquería's situation.

Nine of the sixteen exclusives are sauces or dressings and three more are risotto and
polenta. The arrangement the gap doc calls "almost comic" is real: the counter is a sauce
shelf with a dough on it.

## 3. The work list, and where it is stale

`docs/gaps/pizzeria.md` ranks 21 absences. Checked against `recipes/` rather than trusted:

- **Nothing on the list has been written since it was compiled.** Every slug it implies is
  free. `ls recipes/*/<slug>.cook` returns nothing for margherita, cheese-pizza,
  sicilian-pizza, grandma-pie, white-pizza, pizza-bianca, baked-ziti, chicken-parmigiana,
  eggplant-parmigiana, meatballs, fresh-egg-pasta, garlic-knots, calzone, stromboli,
  lasagna, rollatini, arancini, pasta-e-fagioli, cannoli, tiramisu, zeppole,
  mozzarella-sticks, chicken-wings, ricotta, mozzarella, sunday-gravy, garlic-bread,
  antipasto, saltimbocca, chicken-piccata, veal-marsala, tomato-pie, sfincione,
  sicilian-pan-dough, pizza-sauce.
- **The staleness the ticket warns about lands elsewhere.** The pastry shell, two pickles,
  cornbread, char siu and the pâté it names are all Bakery/Curry House/Dim Sum/Deli files.
  None of them touch this counter's list.
- **Nothing here is an edit to a file another ticket owns.** The one adjacent case is
  `marinara-sauce.cook`, which carries `aka: red sauce, pizza sauce, Sunday gravy` — the
  gap doc says plainly that marinara is a *cooked* sauce and that calling it pizza sauce is
  why home pizza tastes stewed. Correcting that `aka` line would be an edit to an existing
  file, which is T-001-18's, not this ticket's.

The list's own **"What it could not stock"** section removes several items from
consideration before Design starts: calzone and stromboli (one dough split into a base and
a closure), stuffed pizza, the hero, a slice, a wall of specialty pies, and Old Forge cuts
and trays. Those are reasons, not to-dos.

## 4. What a `.cook` file has to satisfy

**Metadata.** `title`, `category`, `tags`, `servings` are required by the checker.
`counters`, `aka`, `pairs-with`, `dish`, `kit`, `time` and `step.N` are optional.
`counters` naming a counter absent from `counters.json` is a build error. `pairs-with`
takes slugs, is made mutual at build time (so it is written on one side only), and pointing
at a non-existent slug is a build error. `dish` defaults to the slug; only one file per
dish may omit `kit`.

**The tree.** Every step after the first says what it consumes — `@&(~1)x{}` for one step
back, `@&(3)x{}` for step 3. A step with no ingredients becomes a full-width row and must
sit at the top or the bottom; `~1` counts prep steps too, so one wedged mid-table breaks
the next back-reference. Splitting one preparation into two later steps is refused, and so
are two endings.

**The checker's hard floors** (`scripts/check-recipes.mjs`):

- ≥3 ingredient rows, or "too thin to be a table".
- ≥3 operation columns, or "only one operation — nothing merges".
- No tiling errors from `findTilingErrors`.
- No operation cell with an empty label.
- Every named counter known.

The README's soft target is 5–16 rows and 3–6 operations.

**The icon coverage test is the gate that is not in the ticket.** `src/lib/icons.test.ts`
takes the first word of every operation label in the whole collection and asserts
`matchOperation` returns non-null. A verb missing from `VERB_ICONS`/`PHRASE_ICONS` fails
`npm run verify`, and `src/lib/icons.ts` belongs to another ticket, so the fix has to be
the recipe's wording. Verbs already covered that this counter's work wants: stretch, top,
bake, broil, crush, mix, knead, rise, prove, press, dimple, fry, brown, simmer, boil,
drain, toss, layer, spread, scatter, season, dredge, coat, roll, shape, divide, cut, rest,
cool, chill, melt, brush, assemble, fill, cover, ladle, scoop, finish, stack, arrange,
nestle, reduce.

**Timers.** `~name{20%min}`. `src/lib/time.ts` reads the name: `UNATTENDED` includes rise,
prove, rest, chill, cool, bake, roast, braise, simmer, steam, dry, cure, drain, press;
`HANDS_ON` includes knead, stir, fry, sear, brown, roll, shape, toss, whisk, beat.
`collection.test.ts` fails any hands-on timer of ≥240 min and any timer whose unit it
cannot read. This ticket requires **every timer in every new file to be named**, which the
existing collection does not generally do.

**Labels.** The cell label is the step text with ingredients stripped. `>> step.N: …`
overrides it, 1-based over steps as written. Recent work (papadom, balti, char-siu-bao,
karaage) overrides every operation label by hand, which is how the staircase comes out
reading as a cook's verbs.

## 5. Precedent worth copying

- `recipes/breads/pizza-dough.cook` — five steps, all labels overridden, `pairs-with:
  marinara-sauce`, and it already produces four dough balls at 500 g flour. It is the
  component every pie on this list consumes.
- `recipes/breads/focaccia.cook` — the oiled-tray shape: mix wet, cold-rest, stretch into
  an oiled 9x13 pan, dimple and top, bake. The square pies are the same silhouette.
- `recipes/fried-and-crispy/karaage.cook` — the one fried file, and the model for how a
  breaded-and-fried table is written here (marinate, bind, dredge, fry, fry again).
- `recipes/stews-and-braises/balti.cook` and `char-siu-bao.cook` — a component recipe used
  as a plain ingredient (`@onion-tomato masala{1%cup}(240 g; the base recipe)`,
  `@char siu{10%oz}(285 g; …roast it from the recipe on this shelf)`) rather than as a tree
  edge. This is the only way one table can lean on another, and it is exactly how a pie
  consumes its dough.
- Both files close with a full-width prose paragraph carrying the context a table cannot.
  The checker does not require a label on it, because it is not an operation cell.

## 6. Boundaries

- **Only `recipes/**`.** `src/` is T-001-17's: the menu sections in `counters.json` and the
  shopping aisles. A new recipe therefore does not appear on the rendered Pizzeria menu
  until T-001-17 runs; it joins the counter's recipe set via `>> counters:` regardless,
  which is what the acceptance criteria count.
- **An existing file that only needs an edit is T-001-18's**, recorded in the work artifact
  rather than changed here. `marinara-sauce.cook`'s `aka: … pizza sauce …` is the one such
  case this ticket surfaces.
- `src/generated/` is not committed; `npm run recipes` rebuilds it.
- Other tickets are in flight on the same branch (`recipes/smoked-and-grilled/carne-asada.cook`
  and the T-001-09/T-001-10 work directories are untracked in the working tree). Commits go
  through `lisa commit-ticket` with exact `--include` paths, so nothing of theirs is
  swept up.

## 7. Constraints and assumptions carried into Design

1. **Five new exclusive files clear both gates**, and the gap list's ranking decides which.
   The top eight ranked items are: Margherita, Sicilian + Grandma, white pizza, baked ziti,
   chicken parm, meatballs, fresh egg pasta, garlic knots.
2. **A pie needs a dough it does not contain.** One batch of dough becomes six pies and a
   tray of knots, and a preparation cannot feed two later steps — the gap doc states this
   outright. Every pie must consume `pizza-dough` as a plain ingredient.
3. **The round dough and the square dough are different doughs.** `pizza-dough` is a
   4×250 g round-ball dough at ~63% hydration, cold-fermented. A Sicilian tray wants a
   wetter dough proofed in oil in the pan. One file cannot be both, and cannot be split.
4. **Marinara is not pizza sauce.** The gap doc's sharpest technical point. A Neapolitan pie
   takes raw crushed tomato that cooks in the oven. Whether that becomes its own table or a
   branch inside each pie is a Design question — a raw sauce is two operations at most,
   which is below the checker's three-column floor.
5. **There is no pasta category.** Six sauces exist with nothing to put them on, and
   `recipes/noodles/` is eleven Asian noodle dishes. Where a baked ziti and a sheet of egg
   pasta land is a Design question.
6. Calzone, stromboli, stuffed pizza, the hero, the slice and the specialty-pie wall are
   ruled out by the gap doc's own reasoning and must be named as skipped, with the reason,
   rather than silently passed over.
