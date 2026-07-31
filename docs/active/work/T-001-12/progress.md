# T-001-12 — Progress

Ten files written, six commits, all through `lisa commit-ticket` with exact
`--include` paths. Nothing outside `recipes/**` touched.

## Steps, as planned and as done

| Plan step | Files | Commit | State |
| --- | --- | --- | --- |
| P1 | `recipes/pizzas/margherita.cook` | `8504b2c` Write the Margherita the dough and the sauce were waiting for | done |
| P2 | `recipes/breads/sicilian-pan-dough.cook`, `recipes/pizzas/sicilian-pizza.cook`, `recipes/pizzas/grandma-pie.cook` | `15fc66b` Print the square pair, the tray dough and the two ways to cut it | done |
| P3 | — | (no commit) icon baseline re-measured | done |
| P4 | `recipes/pizzas/white-pizza.cook` | `82f0cf3` Write the white pie, ricotta and garlic and no tomato at all | done |
| P5 | `recipes/pasta/baked-ziti.cook`, `recipes/fried-and-crispy/chicken-parmigiana.cook`, `recipes/stews-and-braises/meatballs.cook` | `c83e08a` Set out the red-sauce dinner list: ziti, parm and meatballs | done |
| P6 | `recipes/pasta/fresh-egg-pasta.cook` | `8ef1c16` Roll a sheet of egg pasta for the six sauces that had none | done |
| P7 | `recipes/breads/garlic-knots.cook` | `a11429c` Tie the garlic knots from the same dough as everything else | done |
| P8 | — | (no commit) final verification | done |

## Deviations from the plan

1. **P5's cross-file check ran after P6, not before it.** `chicken-parmigiana` and
   `meatballs` both declare `pairs-with: fresh-egg-pasta`, and `parse-recipes.mjs` treats a
   pairing at a slug that does not exist yet as a build error. Writing P6's file first and
   then running the check once for both steps was the only ordering that never left a
   committed state failing its own gate. Per-file `check-recipes.mjs` still ran on each of
   the three P5 files before the commit. Structure §Ordering anticipated the constraint but
   put it on the wrong side of the two steps.
2. **`npm run recipes` could not be run against the live working tree at P8**, for reasons
   that belong to another ticket. See "The build on this branch", below. The equivalent
   verification was performed instead in an isolated copy of the tree.

Nothing else deviated. No file was written that the plan did not name, and no file the plan
named was skipped.

## Verification

**Per file** — `node scripts/check-recipes.mjs --labels …`, all ten `ok`:

| File | Shape | Staircase |
| --- | --- | --- |
| `pizzas/margherita.cook` | 8 rows × 5 cols | stretch to 12 in, thick at the rim / crush by hand, and do not cook it / top thin, cheese in the gaps / bake 550°F (290°C) 6 to 8 min / finish with oil, off the heat |
| `breads/sicilian-pan-dough.cook` | 6 × 5 | mix to a wet, shaggy dough / fold four times over 2 hr / press into an oiled tray / prove 2 hr, until it fills the corners |
| `pizzas/sicilian-pizza.cook` | 5 × 5 | layer the cheese right to the edge / ladle the sauce on top in stripes / bake 500°F (260°C) 22 to 28 min / cool 10 min on a rack, then cut in squares |
| `pizzas/grandma-pie.cook` | 10 × 5 | press cold dough into an oiled sheet, twice / crush raw, garlic straight in / scatter the cheese, dollop the tomato / bake 500°F (260°C) 16 to 20 min / finish with pecorino, basil and oil |
| `pizzas/white-pizza.cook` | 12 × 5 | mix the ricotta with garlic and pepper / stretch to 12 in, thick at the rim / spoon on the ricotta, mozzarella between / bake 550°F (290°C) 6 to 8 min / finish with oil, oregano and flaky salt |
| `pasta/baked-ziti.cook` | 10 × 5 | boil 3 min under the box / beat the ricotta with an egg / toss the hot pasta through both / layer with mozzarella, half in the middle / bake 375°F (190°C) 35 min, uncovered at the end |
| `fried-and-crispy/chicken-parmigiana.cook` | 10 × 6 | pound to 1/4 in and salt / dredge flour, egg, then crumb / fry 3 min a side, drain on a rack / spoon the sauce down the middle only / bake 425°F (220°C) 12 min, until it blisters |
| `stews-and-braises/meatballs.cook` | 13 × 6 | soak the bread to a paste / mix by hand, and stop early / roll 18 balls, chill 20 min / brown all over, 8 min / simmer 45 min in the sauce |
| `pasta/fresh-egg-pasta.cook` | 8 × 6 | mix to a stiff dough / knead 10 min, until it springs back / rest 30 min, wrapped / roll thin and cut in ribbons / cook 90 sec, and keep a cup of the water |
| `breads/garlic-knots.cook` | 10 × 5 | cut 12 strips and tie each in a knot / warm the garlic in butter, no colour / prove 30 min, until puffed / bake 450°F (230°C) 12 to 15 min / toss the knots through it hot |

Every row count is inside the README's 5–16, every operation count inside 3–6, and every
staircase line opens with a verb rather than a sentence fragment.

**Per file, additionally** — a scratch script over the ten files
(`scratchpad/verify.mjs`, using the repo's own `normalise` and `matchOperation`):

```
all 10 files: pairings resolve, every label has an icon, every timer named and
readable, metadata complete, slugs unique.
```

That covers four acceptance criteria at once: `counters` is exactly `Pizzeria` on all ten,
`aka` is present on all ten, every timer carries a name and a unit `time.ts` can read, and
no label asks `src/lib/icons.ts` for a verb it does not have.

**The counts:**

```
grep -rl 'Pizzeria' recipes/ | wc -l                       →  32   (required ≥27)
grep -rlE '^>> counters: *Pizzeria *$' recipes/ | wc -l    →  26   (required ≥20)
```

**Cross-file** — in an isolated copy of the tree (see below):

```
npm run recipes                → parsed 448 recipe(s) in 24 categories
vitest collection.test.ts + layout.test.ts   →  467 passed
```

## The build on this branch

`npm run recipes` does not currently complete in the working tree, and none of the causes
are this ticket's:

- `recipes/sauces-and-gravies/schmaltz.cook` (untracked) pairs with `chopped-liver`
- `recipes/soups/chicken-broth.cook` pairs with `matzo-ball-soup` and `schmaltz`
- `recipes/stews-and-braises/collard-greens.cook` pairs with `ham-hock-stock`, `black-eyed-peas`
- `recipes/stews-and-braises/corned-beef.cook` pairs with `sauerkraut`

These are forward references from the Deli and Meat-and-Three tickets, which are live on
this branch and have written one side of a pairing but not yet the other. They resolve when
those tickets finish. To get a real signal anyway, the tree was copied to the scratchpad,
those five dangling *targets* were stripped from the *other tickets'* files in the copy
only, and the build and tests were run there — result above. **No file in the repository was
modified to do this.**

`npm run verify` is red for a second, separate, pre-existing reason: `src/lib/icons.test.ts`
asserts that no operation verb falls through to the fallback icon, and it was **already
failing on `main` before this ticket started**, with 46 such verbs. It now reports 55. All
nine additions belong to other tickets' files, verified by name:

```
attar :: perfume        baklava :: clarify        collard-greens :: strip
fattoush :: throw       ful-medames :: build      gyro-meat :: wring
kafta :: wring          labneh :: tie             maamoul :: mould
manakish :: slacken
```

**Zero come from this ticket's ten files.** That was the design goal in D5 and it held.

## Working tree

```
git status --short recipes/pizzas recipes/pasta \
  recipes/breads/sicilian-pan-dough.cook recipes/breads/garlic-knots.cook \
  recipes/fried-and-crispy/chicken-parmigiana.cook \
  recipes/stews-and-braises/meatballs.cook
→ (empty)
```

Nothing this ticket owns is staged, modified or untracked. `git status --short recipes/`
shows two untracked files (`schmaltz.cook`, `ham-hock-stock.cook`) which belong to another
ticket in flight and were deliberately left alone.

## Recorded for T-001-18 — not done here

`recipes/sauces-and-gravies/marinara-sauce.cook` line 5 reads:

```
>> aka: red sauce, pizza sauce, Sunday gravy
```

Both trailing names are now wrong on this shelf.

- **pizza sauce.** `docs/gaps/pizzeria.md` states it outright: marinara is a *cooked* sauce,
  a pie takes raw crushed tomato that cooks in the oven, and using the former for the latter
  is why home pizza tastes stewed. `margherita.cook` and `grandma-pie.cook` now write that
  raw sauce as a branch, so the collection contains both and the `aka` sends a searcher to
  the wrong one.
- **Sunday gravy.** The gap doc lists it separately as its own dish and its own afternoon —
  long-cooked with pork and beef. It is not marinara under another name.

Suggested edit, for whoever owns the pass over existing files: `>> aka: red sauce, tomato
sauce, salsa marinara`. Editing an existing file is outside this ticket's ownership, so it
was not made.

## Gap-list items skipped or not reached

Written, in the gap doc's own order: **#1** Margherita · **#2** Sicilian and Grandma (with
the pan dough they need) · **#3** white pizza · **#4** baked ziti · **#5** chicken
parmigiana · **#6** meatballs · **#7** fresh egg pasta · **#8** garlic knots.

**Skipped inside that range:**

- **#9 calzone and stromboli.** Named in the gap doc's own "What it could not stock": both
  are one dough split into a base and a closure, and a preparation feeding two later steps
  is what `layout.ts` refuses outright. Not writable as one table, and writing them as two
  would be inventing a recipe nobody cooks.

**Not reached** — the count was met four files earlier and the ranking puts these after:
#10 eggplant rollatini, #11 lasagna, #12 the Italian hero (also in "could not stock":
assembly of cured meats nobody makes at home), #13 the fried-appetiser section (wings,
mozzarella sticks, poppers, garlic fries), #14 arancini, #15 pasta e fagioli, #16 the
dessert case (cannoli, tiramisu, zeppole, Italian ice), #17 the salads, #18 the secondi
(saltimbocca, piccata, marsala), #19 tomato pie, #20 vodka slice, #21 sfincione.

Of the components list, only **Sicilian pan dough** was written, because gap #2 is
unwritable without it. Fresh mozzarella, low-moisture mozzarella and ricotta are bought by
every pizzeria in the country and appear as ingredients; the breading standard is three
bowls inside `chicken-parmigiana`; the garlic butter is one operation inside `garlic-knots`;
the pasta-water emulsion is the closing note of `fresh-egg-pasta`. Sunday gravy, seasoned
breadcrumbs, cannoli shells, ladyfingers and the pepper relish are unwritten and belong with
the gap items that need them.

## Two things for T-001-17

1. Two new categories exist — **Pizzas** (`recipes/pizzas/`, 4 files) and **Pasta**
   (`recipes/pasta/`, 2 files). Neither is claimed by any counter's `categories` fallback in
   `src/data/counters.json`. Harmless today, because all six files name `Pizzeria`
   explicitly; a later file in either folder that omits `>> counters:` would be orphaned and
   fail the build.
2. The Pizzeria menu sections in `counters.json` do not yet list any of the ten new slugs,
   so the rendered menu will not show them until that file is updated. That is T-001-17's
   work by the ticket's own boundary, not an omission here.
