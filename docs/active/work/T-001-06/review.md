# T-001-06 — Review

The Panadería went from **12 recipes, none of them its own** to **30 recipes, 17 its own**.
The Pan Salado rack is no longer empty, and the concha — the ticket's "most conspicuous single
absence on the whole site" — is on the shelf with the dough and the sugar lid under it.
Eighteen files created, none modified, none deleted, nothing outside `recipes/**` touched.

## What changed

| # | File | Ranked | Commit |
| --- | --- | --- | --- |
| 1 | `recipes/pastry-and-doughs/pan-dulce-dough.cook` | component | `e631b4d` |
| 2 | `recipes/pastry-and-doughs/costra-de-azucar.cook` | component | `e631b4d` |
| 3 | `recipes/breads/conchas.cook` | **1** | `95005cf` |
| 4 | `recipes/breads/bolillos.cook` | **2** | `e7ce856` |
| 5 | `recipes/breads/teleras.cook` | **3** | `e7ce856` |
| 6 | `recipes/pastry-and-doughs/hojaldre.cook` | component | `c2e2328` |
| 7 | `recipes/cookies/orejas.cook` | **4** | `c2e2328` |
| 8 | `recipes/custards-and-puddings/relleno-de-pina.cook` | component | `e6520f6` |
| 9 | `recipes/cookies/empanadas-de-pina.cook` | **5** | `e6520f6` |
| 10 | `recipes/breads/cuernos.cook` | **6** | `c47dc6a` |
| 11 | `recipes/sauces-and-gravies/piloncillo-syrup.cook` | component | `0c3bfd6` |
| 12 | `recipes/cookies/puerquitos.cook` | **7** | `0c3bfd6` |
| 13 | `recipes/cookies/campechanas.cook` | **8** | `c2e2328` |
| 14 | `recipes/cakes-and-loaves/mantecadas.cook` | **9** | `11eac64` |
| 15 | `recipes/custards-and-puddings/cubiletes-de-queso.cook` | **10** | `11eac64` |
| 16 | `recipes/breads/bigotes-de-pina.cook` | **11** | `d07510f` |
| 17 | `recipes/cookies/polvorones-rosas.cook` | **12** | `d07510f` |
| 18 | `recipes/custards-and-puddings/chocoflan.cook` | **13** | `d07510f` |

A tenth commit, `6bd38c0`, reworded operation labels in six of these — see **Deviation** below.
No new folder was created; every file went into a folder that already sorted its kind of thing.

**Ranked items 1 through 13 are all written, in order.** Five components were written first
because the dishes consume them: the gap doc's own *"Components it would need"* list names all
five, and four of the thirteen dishes cannot be written without one.

## The one dough, four breads problem

`buildTree` throws when one step feeds two later steps — *"a table is a tree, so a preparation
can only flow into one place."* Conchas, cuernos and bigotes are one dough with three finishes,
so they cannot be one file. They are written the way `docs/gaps/panaderia.md` itself prescribes:
*"a dough recipe and four short recipes that consume it."* `pan-dulce-dough` is a real table
(8 rows × 6 cols); each consumer opens with `@masa para pan dulce{…}` as an ordinary ingredient
row and names it in `pairs-with`. `lo-mein` consuming `char-siu` is the existing precedent.

Servings line up across the seam, so the numbers are real: `pan-dulce-dough` yields 16 pieces at
~65 g; `conchas` takes the batch, `cuernos` and `bigotes` three-quarters each and say so.
`costra-de-azucar` makes 16 lids — batch to `conchas`, half to `bigotes`. `relleno-de-pina`
makes ~500 g — batch to `empanadas`, half to `bigotes`.

The same reasoning splits `hojaldre` from `orejas` and `campechanas`, which the gap doc lists
under *"What it could not stock"* as two things that cannot share one table.

## The one file that is not Panadería-exclusive

`hojaldre` carries `counters: Panadería, Bakery`. `docs/gaps/bakery.md` lists laminated dough
as a component **it** needs, naming *"campechana, oreja and puff-pastry turnovers"* among the
things waiting on it. T-001-01 deduplicated five shared components; laminated dough was not one
of them, so no ticket owns it. Writing it Panadería-only would have created exactly the
duplicate T-001-01 exists to prevent. **See the open concern for T-001-16 below.**

## What was skipped, and why

The criteria require anything skipped from the top of the list to be named here. The count is
met with headroom at item 13; items 14–22 are below where it reaches.

1. **14 — Tamales.** Needs `masa preparada` and a chile-braised filling: two prerequisite
   tables before the dish exists. The gap doc puts masa preparada in components and the
   tamal filling as a separate one.
2. **15 — Churros.** Needs a fryer table and cajeta. Nothing in the collection is deep-fried
   as a sweet, so this is a new kind of thing, not a short table.
3. **16 — Pan de elote**, **17 — Buñuelos** (fryer + piloncillo), **19 — Capirotada**.
   Straightforwardly next-pass items.
4. **18 — Gelatina.** The gap doc calls the case of colours a split a single table cannot hold.
5. **20 — Masa fresca / masa preparada.** `masa fresca` is in the doc's own *"could not stock"*
   list (a stone mill and a shop's day of yield); `nixtamalised-masa` already carries
   *masa fresca* in its `aka`. `masa preparada` waits on tamales.
6. **21 — Tostadas and totopos**, **22 — Café de olla / atole.** `recipes/drinks/` exists and is
   empty; no drink exists anywhere on the site. Claiming that folder for a ticket that stops at
   13 would be a decision this ticket should not make alone.

Nothing on the ranked list needed a `counters:` edit to an existing file, so **nothing here
belongs in T-001-18's artifact**. All 22 ranked names and all 10 component names were checked
against every one of the 308 basenames present at the start; none existed.

## Acceptance criteria

| Criterion | State |
| --- | --- |
| ≥18 shelved, ≥12 naming it and no other counter | **met — 30 and 17** |
| Top of the ranked list written in order; skips named | **met — 1–13 in order; 14–22 named above** |
| `check-recipes.mjs --labels` ok, labels read as verbs | **met — 18/18 ok; see below** |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | **met — scanned all 18** |
| An undiacritic form in every `aka` | **met — e.g. `bigote de pina`, `panqué individual`/`panque individual`, `pâte feuilletée`/`pate feuilletee`** |
| Every timer named | **met — 51 named timers, `grep '~{'` returns nothing** |
| Real quantities, canonical method | **met — see the four judgement calls below** |
| Only `recipes/**` modified | **met — `git status --porcelain recipes/` empty** |

```
$ grep -l 'Panader' recipes/*/*.cook | wc -l           →  30
$ grep -lx '>> counters: Panadería' recipes/*/*.cook   →  17
$ node scripts/check-recipes.mjs                       →  all 334 file(s) draw a table
```

The four method calls worth a reviewer's eye, all made against the "canonical rather than a
shortcut wearing its name" criterion:

- **`hojaldre` is a real lamination** — détrempe, butter block, four letter folds with rests,
  overnight before cutting. Rough puff was rejected as the shortcut the criterion names.
- **`costra-de-azucar` uses shortening**, because a butter-only lid melts into the bun and does
  not crack into its grid. This is the shop's reason, not a substitution.
- **`puerquitos` are sweetened with piloncillo syrup**, not molasses and brown sugar. A
  molasses pig is a gingerbread pig wearing the name.
- **`polvorones-rosas` are a different table from `russian-tea-cakes`** — shortening,
  cinnamon, tinted, cut as discs; no nuts, no butter, no powdered-sugar roll. The gap doc's
  whole point about item 12 is that these are two items in the case.

## Deviation: the label repair (`6bd38c0`)

`src/lib/icons.test.ts` asserts that every verb a recipe *opens an operation with* is one the
collection can draw. `plan.md` did not account for it. Seven of my opening verbs fell through
— `flavour`, `enclose`, `sharpen`, `alternate`, `curve`, `stripe`, `tint` — and one mantecadas
label (`5 min hot, then 13 min at 350°F`) did not open with a verb at all, which the acceptance
criteria call out directly.

The fix went into `recipes/**`, not `src/`: the ticket forbids touching `src/`, and `VERB_ICONS`
lives in `src/lib/icons.ts`. Six files were reworded, prose kept in step with the label —
`stir in the vanilla`, `fold the dough round the block`, `stir in the lime`, `fold in the dry
and the milk, alternating`, `bake 5 min hot`, `shape into moustaches`, `pipe on the paste`,
`knead the colour through`. Full before/after table in `progress.md`.

**After the repair, none of the remaining fall-through verbs comes from a file this ticket
owns.**

## Test coverage and the three failures

There is no unit-test surface here — this ticket adds data files, not code. The gate is
`check-recipes.mjs`, which imports the same `buildTree` and `layout` the site renders with, so
a file that checks `ok` is a file that draws. All 18 pass, all 334 in the collection pass.

`npm run verify` reports **3 failing tests**. All three were **already failing before this
ticket started**, verified by running the suite in a worktree at `b8aeec9` (the commit
immediately before the first commit here), which showed **4** failures — the same three plus a
`units.test.ts` water failure that a sibling ticket has since fixed.

| Test | Cause | This ticket's part |
| --- | --- | --- |
| `icons.test.ts` — every opening verb is drawable | 8 verbs: `bruise`, `dress` (`som-tum`, `larb-gai`), `crack` (four Thai curries), `return`, `velvet`, `ribbon`, `slide` (stir-fries and soups), `cup` (`siu-mai`, landed from T-001-07 mid-run) | **none — all seven of mine were removed in `6bd38c0`** |
| `schedule.test.ts` — the three longest are ferments | expects `pizza-dough` third, gets `crema-mexicana` (T-001-01's file, 28 hr culture) | **none — identical assertion at baseline** |
| `shopping.test.ts` — <2% of ingredients lack an aisle | 26/677 unmatched, 0.038 vs. the 0.02 gate; baseline was 0.030 | **4 of the 26 names** — see below |

### The shopping concern, stated plainly

Four of the 26 unmatched ingredient names are this ticket's: `masa para pan dulce`,
`relleno de piña`, `costra de azúcar`, `hojaldre`. Every one of them is *another recipe used as
an ingredient row*, which is the same shape as seven names already on that list from other
tickets (`char siu`, `đồ chua`, `nước chấm`, `bánh mì rolls`, `house brown sauce`,
`pad thai sauce`, `chả lụa`). The gate was already breached before this ticket
(0.030 > 0.02) and every cross-recipe reference nudges it further.

This is not fixable from inside `recipes/**` without renaming ingredients to something untrue.
The aisle rules are in `src/lib/shopping.ts`, and **the ticket says outright that the shopping
aisles are T-001-17's**. Recorded here rather than patched.

## Open concerns for a human

1. **T-001-16 should consume `hojaldre`, not write a second laminated dough.** `hojaldre`
   already names `Bakery` in its `counters:`. This ticket cannot edit `docs/gaps/bakery.md` to
   say so, so the note lives here.
2. **The shopping-aisle gate is drifting.** Each counter ticket that references another recipe
   by name pushes the ratio further past 0.02. T-001-17 will need a rule for "an ingredient
   that is itself a recipe" rather than 11 individual entries and counting.
3. **`src/data/counters.json` still prints the old Panadería sections** — nine items across
   four headings. Thirty recipes now name this counter and none of the 18 new ones appears in
   any section list. That is T-001-17's work and is exactly what that ticket is for, but until
   it runs, the rendered page will not show most of this.
4. **`recipes/drinks/` is still empty.** Ranked item 22 and `docs/gaps/README.md` both note
   there is no drink anywhere on the site. Left for whoever claims that folder.
