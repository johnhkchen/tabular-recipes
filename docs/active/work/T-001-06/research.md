# T-001-06 — Research

What exists, where, and what the build will and will not accept. No proposals here.

## 1. What the Panadería actually holds today

The ticket says "9 recipes, 0 of them its own"; `docs/gaps/panaderia.md` says 8. Both are
stale. Counted from the files rather than the docs:

```
$ grep -h '^>> counters:' recipes/*/*.cook | tr ',' '\n' | sort | uniq -c | sort -rn
   95 Bakery … 20 Taquería … 12 Panadería …
```

Twelve recipes name **Panadería**, and **not one names it alone**:

| Slug | Folder | `counters:` |
| --- | --- | --- |
| `cinnamon-rolls` | breads | Bakery, Panadería |
| `pan-de-muerto` | breads | Panadería, Bakery |
| `russian-tea-cakes` | cookies | Bakery, Panadería |
| `alfajores` | cookies | Bakery, Panadería |
| `tres-leches-cake` | cakes-and-loaves | Panadería, Bakery |
| `pound-cake` | cakes-and-loaves | Bakery, Panadería |
| `flan` | custards-and-puddings | Taquería, Panadería |
| `corn-tortillas` | flatbreads-and-pancakes | Taquería, Panadería |
| `crema-mexicana` | dressings-and-dips | Panadería, Taquería |
| `queso-fresco` | dressings-and-dips | Panadería, Taquería |
| `nixtamalised-masa` | pastry-and-doughs | Panadería, Taquería |
| `sweet-tart-shell` | pastry-and-doughs | Bakery, Dim Sum Counter, Panadería |

The four not in the gap doc's "What it has" list are the T-001-01 output
(`crema-mexicana`, `queso-fresco`, `nixtamalised-masa`) and `sweet-tart-shell` — exactly the
staleness the ticket warned about. The **Pan Salado rack is still empty**: no bolillo, no
telera, nothing savoury.

`src/data/counters.json` still prints the old four sections (Pan Dulce ×3, Cakes and flan ×3,
tortillería ×1, Also here ×2 = 9 — that is where the ticket's "9" comes from). That file is
**T-001-17's**, not this ticket's.

## 2. Every ranked item is genuinely absent

`ls recipes/*/<slug>.cook` over all 22 ranked names and all 10 component names returned
**nothing** for any of them: concha, bolillo, telera, oreja, empanada, cuerno, puerquito,
campechana, mantecada, cubilete, bigote, polvorón, chocoflan, tamal(es), churros, pan de
elote, buñuelos, gelatina, capirotada, tostadas, totopos, café de olla, atole, champurrado,
piloncillo, cajeta, dulce de leche, puff pastry, masa preparada, pineapple filling. Confirmed
again against all 308 basenames. **Nothing on the ranked list needs a `counters:` edit to an
existing file**, so nothing here belongs in T-001-18's artifact on that basis.

Two components the gap doc lists are already written and need no edit: `nixtamalised-masa`
(carries `masa fresca` and `fresh masa` in its `aka`) and `crema-mexicana` / `queso-fresco`.

## 3. The file format

A `.cook` file is cooklang plus a `>>` metadata block. From `scripts/normalise.mjs` and the
existing files:

- `>> title:`, `>> category:`, `>> tags:`, `>> servings:` — **required** by
  `check-recipes.mjs` (`REQUIRED_META`). Missing any one is a hard FAIL.
- `>> counters:` — comma list, validated against the fifteen names in
  `src/data/counters.json`. `Panadería` with the accent is the exact string.
- `>> aka:` — comma list. Existing Spanish-named files carry an undiacritic form
  (`pan-de-muerto` → `bread of the dead`; `pound-cake` → `panqué, panque`). `phở-bò` carries
  both `phở bò` and `pho bo`, which is the pattern for a diacritic title.
- `>> pairs-with:` — slugs, made mutual at build time.
- `>> time:`, `>> dish:`, `>> kit:` — optional; everything else survives as free metadata.
- `>> step.N:` — **overrides** the derived operation label for step N (1-based). This is how
  a mangled derived label gets fixed, and `--labels` is the only way to see the difference.

Ingredient syntax: `@name{qty%unit}(note)`. Timers: `~name{10%min}` — **named**;
`~{10%min}` is legal cooklang but unnamed. Cookware: `#oven{}`. Step reference:
`@&(~1)dough{}` — an edge to the step *1 back*, resolved by the parser, not by the file.

`pan-de-muerto` (the closest existing neighbour) uses **unnamed** timers throughout. This
ticket's criteria require named ones, so it is a counter-example to copy structure from, not
timer style. `src/lib/time.ts::readTimers` infers a name when one is absent; the acceptance
criterion exists so the clock reads the stated name instead.

## 4. What the checker enforces

`node scripts/check-recipes.mjs --labels <files>` builds the tree and lays out the grid, so
every structural rule is a hard gate:

1. **The tree has exactly one root.** Every branch must flow into one final step via
   `@&(~1)…`. Two steps with no parent → `N steps end the recipe`.
2. **A step's output flows to exactly one later step.** Reusing a preparation twice →
   `step N is used by two later steps … a table is a tree`. This is the single most
   constraining rule for a bakery file: one dough cannot be split into two shapes in one file.
   It is also exactly why the gap doc says one dough / four breads "is precisely the split the
   build refuses."
3. **≥3 ingredient rows** and **≥3 columns**. Three columns means at least two chained
   operations after the ingredients; a flat "mix, bake" is a list, not a table.
4. **Every operation cell has a non-empty label** — else "reword the step, or set it with a
   `>> step.N:` line".
5. **Perfect tiling.** `findTilingErrors` checks every (row, col) is covered exactly once.
6. Unknown counter name → FAIL, with the known list printed.

`--labels` prints the header rows and then the operation staircase indented by column. The
criterion "reads as a cook's verbs rather than sentence fragments" is judged off that output.

## 5. Where things live

Twenty-one folders under `recipes/`. Relevant ones and their sizes:

- `breads/` 21 — enriched and lean yeast breads; `pan-de-muerto`, `cinnamon-rolls`,
  `brioche`, `baguette`, `japanese-milk-bread`.
- `pastry-and-doughs/` 3 — `all-butter-pie-crust`, `sweet-tart-shell`, `nixtamalised-masa`.
  This is where a component dough goes; `nixtamalised-masa` proves an ingredient-like
  preparation is welcome here.
- `cookies/` 20 — `russian-tea-cakes`, `alfajores`, `shortbread-cookies`.
- `cakes-and-loaves/` 21, `custards-and-puddings/` 23 (holds `red-bean-paste` and
  `lotus-seed-paste` — precedent that a **filling** is shelved here, not under sauces),
  `sauces-and-gravies/` 23, `bars-and-brownies/` 21.
- `drinks/` — **exists and is empty.** No `.cook` file anywhere is a drink; the gap doc's
  "there is no drink on the site at all" is accurate.

`scripts/find-recipes.mjs` walks the tree, so a **new folder needs no registration** — the
category string comes from `>> category:` or, failing that, from the folder name title-cased.
T-001-04 created three folders this way with nothing outside `recipes/` touched.

## 6. Cross-counter demand on the components

Grepping the other gap docs for the components this counter needs:

- **Laminated / puff pastry** is wanted by the Bakery too — `docs/gaps/bakery.md`:
  *"Laminated dough — … Croissant, danish, pain au chocolat, campechana, oreja and
  puff-pastry turnovers all wait on it."* It is also behind `pho-and-banh-mi.md`'s pâté chaud.
  It was **not** in T-001-01's shared-component list, so no ticket owns it yet.
- **Piloncillo syrup**, **concha topping paste**, **pineapple/calabaza/camote filling**,
  **pan dulce base dough**, **cajeta**, **masa preparada**, **tamal filling** appear only in
  `panaderia.md`.
- The Bakery separately wants a *"cookie-lid topping — the sugar-flour-fat crust that cracks
  into the grid"*, which is the melonpan lid, a neighbour of the concha's costra but a
  different item on a different bun.

## 7. Constraints and assumptions carried into Design

- **Ownership.** `recipes/**` only. `src/data/counters.json` and every section listing is
  T-001-17's; the gap docs are not this ticket's to edit either.
- **Commits.** Commit-sealed project (`lisa status`: *"commit-sealed — finished work lands as
  history"*). Every unit goes through `lisa commit-ticket --ticket-id T-001-06 --include …`
  with exact paths. Four sibling tickets are in flight on the same branch.
- **Count arithmetic.** 12 shelved today, 0 exclusive. The criteria want ≥18 shelved and ≥12
  naming Panadería *and no other counter*. Exclusivity is the binding constraint: ≥12 new
  files must carry `counters: Panadería` alone. Shelved count then follows for free.
- **A component that names Panadería is shelved at Panadería.** The Bakery already shelves
  `sweet-tart-shell` and `all-butter-pie-crust` under "Doughs and shells", so a dough on the
  shelf is the collection's own precedent, not a loophole.
- **The one-dough-many-breads problem is real and known.** Rule 2 above forbids one file from
  branching a dough into conchas and cuernos. The gap doc already states the honest form: a
  dough recipe plus short recipes that consume it as an ingredient row. `lo-mein` consuming
  `char-siu` as a plain `@` ingredient is the existing precedent for that shape.
- **Diacritics.** Titles use them (`Panadería`, `Phở Bò`); `aka` must carry the plain-ASCII
  form because that is what gets typed.
