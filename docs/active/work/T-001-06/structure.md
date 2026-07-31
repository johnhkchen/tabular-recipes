# T-001-06 — Structure

Eighteen files created. None modified. None deleted. No folder created. Nothing outside
`recipes/**` is touched.

## The file list, in build order

Order matters only where a file is consumed as an ingredient row by a later one; those
prerequisites are written first so `pairs-with` never points at a slug that does not exist yet.

| # | Path | Ranked | `counters:` | Consumes |
| --- | --- | --- | --- | --- |
| 1 | `recipes/pastry-and-doughs/pan-dulce-dough.cook` | component | Panadería | — |
| 2 | `recipes/pastry-and-doughs/costra-de-azucar.cook` | component | Panadería | — |
| 3 | `recipes/breads/conchas.cook` | **1** | Panadería | 1, 2 |
| 4 | `recipes/breads/bolillos.cook` | **2** | Panadería | — |
| 5 | `recipes/breads/teleras.cook` | **3** | Panadería | — |
| 6 | `recipes/pastry-and-doughs/hojaldre.cook` | component | Panadería, **Bakery** | — |
| 7 | `recipes/cookies/orejas.cook` | **4** | Panadería | 6 |
| 8 | `recipes/custards-and-puddings/relleno-de-pina.cook` | component | Panadería | — |
| 9 | `recipes/cookies/empanadas-de-pina.cook` | **5** | Panadería | 8 |
| 10 | `recipes/breads/cuernos.cook` | **6** | Panadería | 1 |
| 11 | `recipes/sauces-and-gravies/piloncillo-syrup.cook` | component | Panadería | — |
| 12 | `recipes/cookies/puerquitos.cook` | **7** | Panadería | 11 |
| 13 | `recipes/cookies/campechanas.cook` | **8** | Panadería | 6 |
| 14 | `recipes/cakes-and-loaves/mantecadas.cook` | **9** | Panadería | — |
| 15 | `recipes/custards-and-puddings/cubiletes-de-queso.cook` | **10** | Panadería | — |
| 16 | `recipes/breads/bigotes-de-pina.cook` | **11** | Panadería | 1, 2, 8 |
| 17 | `recipes/cookies/polvorones-rosas.cook` | **12** | Panadería | — |
| 18 | `recipes/custards-and-puddings/chocoflan.cook` | **13** | Panadería | — |

Resulting counts: **12 + 18 = 30 shelved**, **17 naming Panadería and no other counter**
(everything but #6). Criteria are ≥18 and ≥12.

## The shape every file takes

```
>> title:        with diacritics
>> category:     the folder's display name, exactly as neighbours spell it
>> tags:         5, lowercase, comma-separated
>> counters:     Panadería
>> aka:          shop names + at least one undiacritic form + an English gloss
>> pairs-with:   slugs of what it is consumed by or consumes
>> servings:     an integer count of pieces
>> time:         total wall clock
>> step.N:       label override wherever the derived label would be a fragment

<one paragraph per step; blank line between>
```

`category` strings, taken from existing files in each folder so nothing forks a new category:
`Breads`, `Pastry & Doughs`, `Cookies`, `Cakes & Loaves`, `Custards & Puddings`,
`Sauces & Gravies`.

## Structural rules every file must satisfy

From `src/lib/tree.ts` and `src/lib/layout.ts`, enforced by `check-recipes.mjs`:

1. **One root.** The last step must absorb every open branch. Concretely: a file with two
   independent preparations (a dough and a filling) must have a step that references both,
   e.g. `Fill @&(~2)dough{} with @&(~1)filling{}`.
2. **Each step referenced at most once.** No `@&(~N)` target may appear twice in a file.
3. **≥3 ingredient rows, ≥3 columns.** Three columns = ingredients + at least two chained
   operations. Every file below has 4–7 operations, so this is comfortable.
4. **Every operation labelled.** Where the derived label would read as a fragment, a
   `>> step.N:` override is written. Verified with `--labels`.
5. **Named timers only.** `~rise{2%hr}`, never `~{2%hr}`.

## Per-file interface: what each table is

Short specs — the shape of the tree, not the prose.

**1. `pan-dulce-dough`** — *Masa para Pan Dulce*, 16 pieces.
Rows: milk, sugar, yeast · eggs, yolks · flour, salt · butter.
Ops: `stir, stand 10 min` → `beat in the eggs` → `add flour and salt, knead 10 min` →
`work in the butter, rise until doubled` → `chill 1 hr, divide into 16`. 5 cols.
Chilled because a cold enriched dough is what the shop shapes from. `aka: masa para pan
dulce, pan dulce dough, sweet bread dough, masa dulce`.

**2. `costra-de-azucar`** — the concha lid, enough for 16.
Rows: shortening, butter · powdered sugar · flour · vanilla · cocoa · pink colour.
Ops: `cream the fats and sugar` → `work in the flour to a paste` → `flavour, then divide and
tint`. 4 cols. Divided three ways at the end (vanilla / chocolate / pink) inside one step, so
it stays one root. `aka: costra de azucar, concha topping, sugar paste topping, tapa de
concha`.

**3. `conchas`** — 12. Consumes 1 and 2 as ingredient rows.
Ops: `shape 12 rounds, proof 90 min` → `press on the lids and score` → `bake 350°F 18 min`.
Plus a rows-only branch (egg wash) folded into the bake step. Needs ≥3 cols: shape → press →
bake is 3 operations after ingredients, giving 4 cols.
`aka: concha, conchas de vainilla, seashell bread, pan de concha`.

**4. `bolillos`** — 8. Self-contained lean dough.
Ops: `stir, stand 10 min` → `add flour and salt, knead 10 min` → `rise until doubled` →
`shape 8 torpedoes, proof 45 min` → `slash and bake with steam 400°F 22 min`.
`aka: bolillo, pan frances, pan francés, mexican french roll, torta roll`.

**5. `teleras`** — 8. Same family, different shape and a softer crumb (a little fat, no
steam), creased into three.
Ops: `stir, stand 10 min` → `add flour, salt and lard, knead 10 min` → `rise until doubled` →
`shape 8 ovals, crease twice, proof 45 min` → `bake 400°F 18 min`.
`aka: telera, telera roll, pan telera, mexican sandwich roll, torta bread`.

**6. `hojaldre`** — laminated dough, 1 sheet / 24 pieces. `counters: Panadería, Bakery`.
Rows: flour, salt, water, a little butter (détrempe) · butter block · flour for the block.
Ops: `mix the détrempe, chill 30 min` → `beat the block into a square, chill` →
`enclose and roll` → `fold in three, chill 30 min — four times` → `chill overnight`.
The fold loop is one step whose label carries the repeat count; the gap doc's "fold-and-turn
loop" note says a loop cannot be four separate tables.
`aka: hojaldre, pasta de hojaldre, puff pastry, laminated dough, pate feuilletee`.

**7. `orejas`** — 24. Consumes 6.
Ops: `roll into sugar` → `roll both edges to the middle, chill 30 min` → `slice and flatten` →
`bake 400°F 12 min, turn at 8`. `aka: oreja, orejitas, palmier, palmiers, elephant ears`.

**8. `relleno-de-pina`** — pineapple filling, enough for 16 empanadas.
Rows: pineapple · piloncillo or brown sugar · cinnamon stick · lime · cornstarch/water slurry.
Ops: `simmer 25 min` → `thicken with the slurry, 2 min` → `cool, then chill`.
`aka: relleno de pina, relleno de piña, pineapple filling, mermelada de piña, pina filling`.

**9. `empanadas-de-pina`** — 16. Consumes 8. Contains its own short dough.
Ops: `cut the fat into the dry` → `bring together with the liquid, chill 30 min` →
`roll and cut 16 rounds` → `fill, fold and crimp` → `wash, sugar and bake 375°F 20 min`.
The filling joins as a plain ingredient row on the fill step, so the fill step has two
children (the dough chain and the filling row) and the tree still has one root.
`aka: empanada de pina, empanada de piña, empanadas de calabaza, pineapple turnover, pastes`.

**10. `cuernos`** — 12. Consumes 1.
Ops: `roll and cut 12 triangles` → `roll up into crescents, proof 90 min` →
`wash and bake 350°F 16 min`. `aka: cuerno, cuernito, cuernitos, mexican crescent, pan cuerno`.

**11. `piloncillo-syrup`** — *Miel de Piloncillo*, 1½ cups.
Rows: piloncillo cones · water · cinnamon stick · orange peel · cloves.
Ops: `simmer until the cones dissolve, 10 min` → `steep the aromatics 15 min` →
`strain and cool`. `aka: miel de piloncillo, piloncillo syrup, panela syrup, cane sugar syrup`.

**12. `puerquitos`** — 18. Consumes 11.
Ops: `cream the fats and sugar` → `beat in the egg and the syrup` →
`work in the dry, chill 1 hr` → `roll, cut pigs, wash` → `bake 350°F 12 min`.
`aka: puerquito, marranito, marranitos, cochinito de piloncillo, cochinitos, pig cookies,
gingerbread pigs`.

**13. `campechanas`** — 18. Consumes 6.
Ops: `roll thin and sugar heavily` → `roll into a rope, coil and flatten, chill 30 min` →
`sugar again and bake 400°F 15 min`.
`aka: campechana, campechanas de azucar, sugar glazed puff pastry, shattering pastry`.

**14. `mantecadas`** — 12.
Rows: butter, sugar · eggs · milk · flour, baking powder, salt · vanilla.
Ops: `cream 4 min` → `beat in the eggs one at a time` → `alternate the dry and the milk` →
`scoop into fluted cases` → `bake 375°F then 350°F, 18 min`.
`aka: mantecada, mantecadas de vainilla, mexican muffin, panque individual, cupcake de
panaderia`.

**15. `cubiletes-de-queso`** — 12.
Rows: short dough (flour, butter, sugar, yolk) · cream cheese, queso fresco · sugar, eggs,
vanilla, lime zest.
Ops: `rub to crumbs` → `bring together, chill 30 min` → `press into 12 cups` →
`beat the filling smooth` → `fill and bake 350°F 25 min` → `cool, then chill 2 hr`.
`aka: cubilete, cubilete de queso, cheese cup, mexican cheese tart, pastel de queso`.

**16. `bigotes-de-pina`** — 12. Consumes 1, 2 and 8. Three ingredient rows drawn from other
tables, which is the widest table in the set.
Ops: `roll and cut 12 rectangles` → `pipe the filling and roll up` →
`curve into moustaches, proof 60 min` → `stripe with the paste and bake 350°F 18 min`.
`aka: bigote, bigotes, bigote de pina, moustache roll, pineapple moustache`.

**17. `polvorones-rosas`** — 24.
Rows: shortening · sugar · flour · cinnamon · pink colour · a little vanilla.
Ops: `cream the shortening and sugar` → `work in the flour and cinnamon` →
`tint pink, chill 30 min` → `cut discs and bake 325°F 15 min`.
Deliberately *not* `russian-tea-cakes`: no nuts, no butter, no powdered-sugar roll.
`aka: polvoron rosa, polvorones rosas, pink polvorones, pink shortbread cookies, galletas
rosas`.

**18. `chocoflan`** — 12.
Rows: caramel · chocolate cake batter (butter, sugar, egg, cocoa, flour, buttermilk) ·
flan custard (evaporated, condensed, eggs, vanilla, cream cheese).
Ops: `caramel into the pan` → `beat the cake batter, spread over the caramel` →
`blend the custard and pour on top` → `bake in a water bath 350°F 60 min` →
`cool, chill 4 hr, invert`.
`aka: chocoflan, pastel imposible, impossible cake, magic flan cake, flan de chocolate`.

## Commit units

Nine `lisa commit-ticket` calls, grouped so each is a shelf that makes sense on its own and
every prerequisite lands with or before its consumer:

| Unit | Files | Message |
| --- | --- | --- |
| A | 1, 2 | Write the pan dulce dough and its sugar lid for the Panadería |
| B | 3 | Write conchas for the Panadería |
| C | 4, 5 | Write bolillos and teleras for the Panadería |
| D | 6, 7, 13 | Write hojaldre, orejas and campechanas for the Panadería |
| E | 8, 9 | Write the pineapple filling and its empanadas for the Panadería |
| F | 10 | Write cuernos for the Panadería |
| G | 11, 12 | Write piloncillo syrup and puerquitos for the Panadería |
| H | 14, 15 | Write mantecadas and cubiletes de queso for the Panadería |
| I | 16, 17, 18 | Write bigotes, polvorones rosas and chocoflan for the Panadería |

Each `--include` names exact repository-relative paths. No ordinary `git add` or `git commit`
at any point.

## Verification interface

Per unit: `node scripts/check-recipes.mjs --labels <the files in that unit>` must print `ok`
for each and a staircase of verbs. At the end, one whole-collection run
(`node scripts/check-recipes.mjs`) confirms nothing already on the shelf was disturbed, plus:

- `grep -c '^>> counters: Panadería$' recipes/*/*.cook` → the exclusive count.
- `grep -l 'Panader' recipes/*/*.cook | wc -l` → the shelved count.
- `grep -rn '~{' recipes/…` over the new files → must be empty (every timer named).
- `git status --porcelain` → nothing outside `recipes/**`.
