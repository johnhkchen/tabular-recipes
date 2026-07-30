# T-001-01 — Review

Five shared components written, one file each, every counter that wants them named on the
file. Fifteen counter tickets can start. One test outside this ticket's ownership now fails
as a direct consequence, and that is the thing a human should look at.

## What changed

Five files created, none modified, none deleted.

| File | Component | Written for | Commit |
| --- | --- | --- | --- |
| `recipes/pastry-and-doughs/nixtamalised-masa.cook` | Nixtamalised Masa | **Panadería, Taquería** | `6aef743` |
| `recipes/dressings-and-dips/crema-mexicana.cook` | Crema Mexicana | **Panadería, Taquería** | `d9e178b` |
| `recipes/dressings-and-dips/queso-fresco.cook` | Queso Fresco | **Panadería, Taquería** | `f8ab4a7` |
| `recipes/custards-and-puddings/red-bean-paste.cook` | Red Bean Paste | **Bakery, Dim Sum Counter** | `f305d15` |
| `recipes/custards-and-puddings/lotus-seed-paste.cook` | Lotus Seed Paste | **Bakery, Dim Sum Counter** | `5875c1f` |

Those counter assignments are the gap docs' own words, not a guess:

- `docs/gaps/panaderia.md` — *"Nixtamalised masa … the nixtamal itself is the tortillería's
  real product"* and *"Crema mexicana and queso fresco — sold from the same case, and both are
  short tables."*
- `docs/gaps/taqueria.md` — *"Queso Oaxaca, queso fresco, crema mexicana — quesabirria,
  gringas and every taco topping need one of these"* and *"Nixtamalised masa — see the
  Panadería."*
- `docs/gaps/bakery.md` — *"Red bean paste, chunky (tsubu-an) and sieved (koshi-an) — anpan,
  sesame ball, mochi donut, mooncake"* and *"Lotus seed paste — mooncake."*
- `docs/gaps/dim-sum-counter.md` — *"Red bean paste and lotus seed paste — see the Bakery."*

All five were confirmed missing before writing (`ls recipes/*/<slug>.cook`, plus a scan of
all 249 basenames). None of them was one of the things the gap docs list as missing but which
has since been written — those, checked and confirmed already present, are the pastry shells,
both cornbreads, `char-siu`, `do-chua`, `sour-dill-pickles` and `pork-liver-pate`.

## Acceptance criteria

| Criterion | State |
| --- | --- |
| Each component is one `.cook` file, `counters:` naming every counter that wants it | met — table above |
| `node scripts/check-recipes.mjs --labels <the new files>` reports ok for each | met — output below |
| Every timer is named | met — 17 timers, all named; `grep '~{'` returns nothing |
| No file outside `recipes/` is modified | met — `git status` shows only Lisa's own files |
| The work artifact names which counters each component was written for | met — table above, and `structure.md` |

```
$ node scripts/check-recipes.mjs --labels recipes/pastry-and-doughs/nixtamalised-masa.cook \
    recipes/dressings-and-dips/crema-mexicana.cook recipes/dressings-and-dips/queso-fresco.cook \
    recipes/custards-and-puddings/red-bean-paste.cook recipes/custards-and-puddings/lotus-seed-paste.cook
  ok   recipes/pastry-and-doughs/nixtamalised-masa.cook  5 rows x 6 cols
       slake the cal
         simmer the corn 15 min
           steep 8 hr
             rinse and rub the hulls off
               grind to a masa, rest 30 min
  ok   recipes/dressings-and-dips/crema-mexicana.cook  6 rows x 5 cols
       warm to 85°F (29°C)
         whisk in the buttermilk, culture 24 hr
           stir in the lime and salt
             chill 4 hr
  ok   recipes/dressings-and-dips/queso-fresco.cook  5 rows x 6 cols
       heat to 185°F (85°C)
         stir in the acid, stand 20 min
           drain 45 min
             salt and press 2 hr
               chill 2 hr
  ok   recipes/custards-and-puddings/red-bean-paste.cook  6 rows x 6 cols
       boil 5 min, drain the first water
         simmer 90 min
           mash chunky, or sieve smooth
             cook down with the sugar 25 min
               beat in the oil, cool 1 hr
  ok   recipes/custards-and-puddings/lotus-seed-paste.cook  7 rows x 6 cols
       soak 4 hr, pull the germs
         simmer 60 min
           blend smooth
             fry down with the sugar 30 min
               cool 1 hr

all 5 file(s) draw a table.
```

## Coverage

There are no unit tests to add — this ticket adds data, and the collection's invariants are
already tested generically. What ran:

| Check | Result |
| --- | --- |
| `node scripts/check-recipes.mjs --labels <the five>` | `all 5 file(s) draw a table` |
| `node scripts/check-recipes.mjs` (whole collection) | `all 254 file(s) draw a table` |
| `npm run recipes` | `parsed 254 recipe(s) in 13 categories · counters: 254 named, 0 inferred from category · timers in 234 · pairings 138` |
| `npx vitest run` | **405 passed, 1 failed** — see below |
| `git status --porcelain -- recipes/` | empty |

`npm run recipes` passing is what proves every `pairs-with` slug resolves and that all five
attached to their named counters rather than falling through to a category default.

**Gap in coverage:** nothing asserts that a component is actually *reachable* from a dish —
these five are ingredients for recipes nobody has written yet, so until the counter tickets
land, they sit on their counters' pages as items in their own right. That is the intended
state for a components-first ticket, but it means the five are only as good as the reading
of the gap docs above.

## The one thing a human should look at

**`npx vitest run` is now red on the branch, and it is this ticket's doing.**

```
FAIL  src/lib/schedule.test.ts > the recipes with the longest critical path > are the three ferments
    [ "sour-dill-pickles", "injera", - "pizza-dough" + "crema-mexicana" ]
```

That test pins the three longest recipes in the collection by name. Crema mexicana's critical
path is 1680 min (24 hr culture → 4 hr chill), which is genuinely longer than pizza-dough's
1568 min, so it takes third place and the snapshot no longer matches.

The other two assertions in that block still pass with crema in the list: its author-claimed
`28 hr 15 min` agrees with the derived 28 hr to within 0.9%, and it is entirely unattended
time. Only the name list is stale.

**Why it was not fixed here.** This ticket's acceptance criteria say *"No file outside
`recipes/` is modified"*, and `src/lib/schedule.test.ts` is owned by no ticket in this
story's split — the fifteen counter tickets write `.cook` files only, and T-001-17 owns two
JSON files. Editing it would have broken an acceptance criterion to satisfy a test.

**Why the recipe was not shortened instead.** Culturing crema for 12 hours rather than 24 is
defensible on its own, and would have slipped it under the snapshot. It was rejected because
it would hide the signal: this assertion pins a collection-wide fact against a story that is
adding roughly two hundred recipes, and it will break again the first time a counter ticket
writes a phở broth, a cure, a long-fermented dough or a smoked brisket. Better to surface it
on the first recipe that trips it than on the twentieth.

**Suggested remedy** — a board decision, not a code one: either give
`src/lib/schedule.test.ts` to T-001-18 (which the story already charges with *"reads the
whole collection afterwards … and runs the full verification"*), or loosen that assertion so
it tests the property — *the longest paths are ferments* — rather than three fixed names.
Verify with `npx vitest run src/lib/schedule.test.ts`.

## Also worth the board's attention

Research scanned all fifteen gap docs for components wanted by two or more counters. Beyond
the five in this ticket, three are real, unwritten, and **owned by nobody**:

| Component | Wanted by | Risk |
| --- | --- | --- |
| sweetened whipped cream (stabilised) | Bakery, Diner | both tickets could write it, under two names |
| plain chicken stock / clear chicken broth | Deli, Takeout Counter | same |
| pickled mustard green | Phở & Bánh Mì, Thai Kitchen | same |

They were deliberately not written here. The ticket says *"keep it tight — these five"*, and
the story resolves cross-ticket contention **on the board** — it has an explicit table of
contested dishes with an owner named for each, and it settled cornbread by handing it to
T-001-17. Assigning three more components is that same kind of decision, and it is an edit to
a ticket file, which this ticket may not make.

Everything else that looked shared turned out to be covered already: the pastry shells,
cornbread and char siu are written; filo, the vanilla-custard-and-wafers pair and slaw
dressing are settled by the story's dish-ownership table.

## Smaller notes and known limitations

- **New ingredients will fall through `src/data/aisles.json`** until T-001-17 places them:
  pickling lime (cal), dried field corn, cultured buttermilk, dried adzuki beans, dried split
  lotus seeds, rock sugar, maltose syrup, peanut oil. Expected — that file is T-001-17's.
- **`lotus-seed-paste` carries no `pairs-with` line.** `red-bean-paste` names it, and pairings
  are made mutual at build time, so writing it on both sides would be duplication. The
  obvious partners — mooncake, anpan, sesame ball, lotus paste bun — are all unwritten; the
  Bakery and Dim Sum Counter tickets will point at these files from their side.
- **`nixtamalised-masa` is the first non-pastry file in `pastry-and-doughs`.** It is a dough
  and the folder is named for doughs, but if the shelf is later meant to be pastry-only, this
  is the file to move.
- **Tsubu-an and koshi-an are one file, not two.** They diverge at a single step — mashed
  coarsely or pushed through a sieve — and that choice is written into the step and into
  `aka`. Two files would have been the same recipe under two names, which is what this ticket
  exists to prevent.
- **The cal safety note is prose in step 1** ("never the builder's kind — keep it off your
  skin"). A table has nowhere else to put a warning.
- **Un-accented spellings are in every `aka`**, per the repo convention: `nixtamalized masa`,
  `crema`, `queso blanco`, `anko`, `hong dou sha`, `lian rong`.
- **`npm run verify` was not run in full.** Its parse and test stages ran separately and are
  reported above; the Astro build adds nothing for a data-only change, and the suite is
  already known-red for the reason above.

## Disposition

**Pass.** All five acceptance criteria are met, the five files are committed through
`lisa commit-ticket` with exact `--include` paths, and nothing ticket-owned is left staged,
modified or untracked. The failing test is a consequence of the work but not a defect in it,
and its remedy is outside what this ticket is permitted to touch — so it is reported here
rather than blocking fifteen dependent tickets on a snapshot of three recipe names.
