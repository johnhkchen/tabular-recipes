# T-001-16 — Research

Descriptive only. What the Bakery counter actually holds today, how a `.cook` file becomes a
table, and which of the gap doc's entries are still real.

## 1. What "the Bakery counter" is, mechanically

`src/data/counters.json` defines fourteen counters. Bakery is the first entry, with:

- `categories: ["Breads", "Cakes & Loaves", "Cookies", "Bars & Brownies"]` — a *fallback* only.
- `sections[]` — the printed menu order on the counter page (T-001-17 owns this file).

`scripts/parse-recipes.mjs` settles counter membership for the whole collection at once:

1. Every name in a recipe's `>> counters:` line must exist in `counters.json` or the build throws.
2. A recipe with **no** `>> counters:` line inherits the counters whose `categories` list contains
   its category (`countersInferred = true`).
3. A recipe that lands at no counter at all is a build error.

So "Bakery shelves N recipes" = files whose resolved counter list contains `Bakery`, and
"names it and no other counter" = files whose resolved list is exactly `["Bakery"]`.

### Measured, today (475 `.cook` files)

| Quantity | Count |
|---|---|
| Files total | 475 |
| Bakery shelves | **99** |
| Bakery and no other counter | **58** |
| Files with no `>> counters:` line (inferred) | **0** |

The ticket's header says "93 recipes, 58 of them its own" and the gap doc says 91. Both are
stale on the total: sibling tickets have since added recipes that name Bakery alongside another
counter. The **exclusive** number has not moved — 58, exactly as the ticket states.

Against the acceptance criteria (≥97 shelved, ≥62 exclusive), the shelved number is already
satisfied at 99. The binding constraint is the exclusive count: **four more Bakery-only recipes**
is the floor.

## 2. The file format, and what the checker will not let through

A recipe is cooklang with `>>` metadata. `scripts/normalise.mjs` flattens it; `src/lib/tree.ts`
builds a merge tree; `src/lib/layout.ts` tiles it into a grid.

- **Leaves are ingredients.** One `@ingredient{qty}` = one table row.
- **Internal nodes are steps.** A step becomes an operation cell spanning its rows.
- **Edges are intermediate references.** `@&(~2)détrempe{}` means "the thing made two steps back".
  The count is over *all* content steps in the file, prose paragraphs included, so a note left
  as its own paragraph would shift every reference after it. Existing files keep notes inside the
  same paragraph as the step they annotate (`hojaldre.cook`, `egg-custard-tart.cook`). Steps with
  no ingredient and no reference render as full-width header/footer rows, not operations.

`buildTree` throws on three shapes:

1. A step referenced by **two** later steps — "a table is a tree, so a preparation can only flow
   into one place."
2. More than one step with no parent — every branch must flow into a single final step.
3. No step that uses an ingredient at all.

`check-recipes.mjs` then adds:

- `title`, `category`, `tags`, `servings` must be present.
- Every counter named must be known.
- `findTilingErrors` — every (row, column) covered exactly once.
- `rowCount >= 3` — fewer than three ingredients is "too thin to be a table".
- `colCount >= 3` — one operation is a list, not a table. `colCount` is the depth of the deepest
  operation chain, so three chained operations is the floor.
- No operation cell may come out with an empty label.

`--labels` prints the header rows and then the operation labels indented by column, which is the
"staircase" the acceptance criteria names. Labels come from `>> step.N:` when present, otherwise
from the step text with its ingredients stripped and `cleanLabel()` applied. Every well-written
file in the collection sets `>> step.N:` for every operation; the derived labels are the fallback.

### Timers

`~{30%min}` is an anonymous timer; `~chill{30%min}` is a named one. `normalise.mjs` records
`name: null` for the anonymous form and `readTimers()` then has to guess what kind of wait it is
from the operation label. Older files use the anonymous form freely — `japanese-milk-bread.cook`
has six of them. The ticket requires every timer in every *new* file to carry a name.

### Other metadata in use

`counters`, `aka` (menu vocabulary, searched — existing files include an undiacriticked form
next to the accented one), `pairs-with` (slugs, validated against the collection and made mutual
at build time), `servings`, `time`, `dish`/`kit` (equipment variants of one dish; two files
sharing a `dish` with no `kit` is a build error — irrelevant here since `dish` defaults to slug).

## 3. What the Bakery case already holds

Folders that matter: `recipes/breads/` (28), `recipes/cakes-and-loaves/`, `recipes/cookies/`,
`recipes/bars-and-brownies/`, `recipes/custards-and-puddings/` (27), `recipes/pastry-and-doughs/` (6).

`recipes/pastry-and-doughs/` is the newest and the most relevant:

- `all-butter-pie-crust.cook`
- `sweet-tart-shell.cook` — pâte sucrée, `Bakery, Dim Sum Counter, Panadería`, blind-baked
- `hojaldre.cook` — **puff pastry**, `Panadería, Bakery`, détrempe + butter block, four letter
  folds with a chill between each, overnight rest. Unyeasted.
- `costra-de-azucar.cook` — the concha cookie lid, `Panadería`
- `pan-dulce-dough.cook`, `nixtamalised-masa.cook`

`recipes/custards-and-puddings/` holds `pastry-cream.cook` (`Bakery`), `creme-anglaise.cook`,
`lemon-curd.cook`, `red-bean-paste.cook`, `lotus-seed-paste.cook`, and — importantly —
`egg-custard-tart.cook` (`Dim Sum Counter, Bakery`, pairs with `sweet-tart-shell`).

## 4. The gap doc, re-read against `recipes/`

The ticket warns the gap doc is stale. It is, substantially. Checked item by item:

| # | Gap item | State today |
|---|---|---|
| 1 | Croissant, pain au chocolat, almond croissant | **Absent.** No `croissant*` file anywhere. |
| 2 | Egg custard tart | **Written** — `custards-and-puddings/egg-custard-tart.cook` |
| 3 | Pineapple bun, bo lo yau | Absent |
| 4 | Anpan, melon pan, cream pan, curry pan | Absent |
| 5 | Danish, cinnamon twist | Absent |
| 6 | Éclair, cream puff | Absent |
| 7 | Fruit tart | Absent (its shell and its cream both exist) |
| 8 | Apple turnover / hand pie | Absent (`hojaldre` would carry it) |
| 9 | Doughnut | Absent |
| 10–22 | black-and-white cookie … baklava | Absent except **`baklava.cook`** and **`manakish.cook`**, both written |

Its "Components it would need" list is stale in the same direction: **sweet shortcrust**
(`sweet-tart-shell`), **red bean paste**, **lotus seed paste** and the **cookie-lid topping**
(`costra-de-azucar`, in its Mexican form) all exist now, and the claim that "no pastry shell of
any kind exists on the site" is no longer true.

What is still missing from that list and is load-bearing for item 1: a **yeasted** laminated
dough, and **frangipane**. `hojaldre` is puff pastry — no yeast, no proof — so it is not the
croissant dough under another name, and the collection has nothing yeasted and laminated.

## 5. Constraints this ticket inherits

- **Write `.cook` files only, into `recipes/<category>/`.** `src/` belongs to T-001-17, so
  `counters.json` sections are not this ticket's to edit — a new recipe reaches the Bakery page
  through its `>> counters:` line and the counter's own section list stays as it is.
- **A dish that belongs to several counters is one file with several names in `counters:`** —
  not one file per counter. If a dish already exists and only needs Bakery added, that is an edit
  to a file another ticket owns and belongs in T-001-18's work artifact instead.
- **Only `recipes/**` is modified.**
- Sibling tickets (T-001-13/14/15) are writing into `recipes/stews-and-braises/`,
  `recipes/vegetables-and-sides/`, `recipes/rice-beans-and-grains/`, `recipes/fried-and-crispy/`
  concurrently. No overlap with the bakery folders, but `lisa commit-ticket --include` must name
  exact paths so their in-flight files are not swept up.

## 6. The shape the gap doc says a croissant has to take

From "What it could not stock":

> **A croissant as one table.** Lamination is a loop … Written honestly it is two recipes: the
> dough as its own table, and each shaped item as a short table that starts from it.

`hojaldre` is the precedent and it is already built that way: the dough is its own file whose
final step is "rest overnight before it is cut", and `orejas` / `campechanas` are separate files
that start from a sheet of it. The same split applies to a yeasted laminated dough: one dough
file, and one short file per shaped item, each taking the finished dough in as a plain
ingredient with `pairs-with:` pointing back at the dough. That also sidesteps the tree
constraint — a single dough feeding three shaped items would be one step flowing into three
places, which `buildTree` rejects outright.

A "short table that starts from it" still has to clear `rowCount >= 3` and `colCount >= 3`:
three ingredients and three chained operations. Shape, proof, wash, bake is four operations, and
dough + egg + milk is three rows, so the floor is met without padding.
