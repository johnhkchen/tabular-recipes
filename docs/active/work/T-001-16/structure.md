# T-001-16 — Structure

Six files created, none modified, none deleted. All under `recipes/`.

```
recipes/pastry-and-doughs/croissant-dough.cook       new
recipes/pastry-and-doughs/croissant.cook             new
recipes/pastry-and-doughs/pain-au-chocolat.cook      new
recipes/pastry-and-doughs/almond-croissant.cook      new
recipes/custards-and-puddings/frangipane.cook        new
recipes/breads/pineapple-bun.cook                    new
```

Nothing in `src/`, `scripts/`, `docs/gaps/` or `src/data/counters.json` is touched.

## Ordering

1. `croissant-dough` first — three files `pairs-with:` it, and `pairs-with` targets are validated
   against the collection at build time.
2. `croissant`, `pain-au-chocolat`.
3. `frangipane`, then `almond-croissant` (which pairs with both it and `croissant`).
4. `pineapple-bun` — independent of all of the above.

## Metadata contract, every new file

```
>> title:      display name
>> category:   Pastry & Doughs | Custards & Puddings | Breads   (matches the folder)
>> tags:       lowercase, comma separated
>> counters:   from design.md's table
>> aka:        ordering names, including an undiacriticked form and the romanised form
>> pairs-with: slugs only
>> servings:   integer
>> time:       total elapsed
>> step.N:     one per operation step, N counted over every paragraph in the file
```

`title`, `category`, `tags`, `servings` are what `check-recipes.mjs` requires; the rest are the
house pattern. Every timer is written `~name{qty%unit}`. No prose-only paragraphs anywhere —
notes live inside the step they annotate, so `~N` back-references cannot drift.

---

## 1. `recipes/pastry-and-doughs/croissant-dough.cook`

Bakery. 12 croissants' worth. ~14 hr elapsed.

Tree — two branches merging at the enclose step, then a chain:

```
step 1  mix the détrempe, chill overnight   [flour, water, milk, sugar, yeast, salt, butter]
step 2  beat the block into a square, chill [cold butter]
step 3  enclose the block, roll out          ← refs (~2) détrempe, (~1) block
step 4  fold in three, chill 45 min — three times   ← ref (~1)
step 5  rest overnight before it is cut      ← ref (~1)
```

Rows = 8 ingredients. Columns: leaves 1 → step 1 and 2 at col 2 → step 3 at col 3 → step 4 at
col 4 → step 5 at col 5. Both floors cleared.

Substance: 500 g bread flour, 250 g butter block (a 50% lamination, which is what a croissant
is), 3 turns, a cold overnight bulk so the butter and dough stay the same firmness. Timers:
`~chill`, `~rest`, `~firm`.

## 2. `recipes/pastry-and-doughs/croissant.cook`

Bakery. 12. Pairs with `croissant-dough`.

```
step 1  roll out to a 8x24-in sheet     [croissant dough, flour to dust]
step 2  cut triangles, roll each up      ← ref (~1)
step 3  proof 2 hr at room temperature   ← ref (~1)
step 4  whisk the egg wash               [egg, whole milk]        (second branch)
step 5  brush and bake 400°F 18 min      ← refs (~2) proofed, (~1) wash
```

Rows = 4. Columns: step 1 col 2, step 2 col 3, step 3 col 4, step 4 col 2, step 5 col 5.

The dough enters as a plain leaf — `@croissant dough{1%batch}(cold, from croissant-dough)` —
the same device `egg-custard-tart` uses for `@blind-baked tart shells{12}`.

## 3. `recipes/pastry-and-doughs/pain-au-chocolat.cook`

Bakery. 12. Pairs with `croissant-dough`.

Same skeleton as #2, differing where the dish differs: rectangles rather than triangles, two
batons of dark chocolate rolled in, seam down.

```
step 1  roll out and cut rectangles      [croissant dough, flour]
step 2  lay two batons, roll seam-down    ← ref (~1)   [dark chocolate batons]
step 3  proof 2 hr                        ← ref (~1)
step 4  whisk the egg wash                [egg, whole milk]
step 5  brush and bake 400°F 18 min       ← refs (~2), (~1)
```

Rows = 5. Columns = 5.

## 4. `recipes/custards-and-puddings/frangipane.cook`

Bakery. Makes enough for 12. Pairs with `almond-croissant`, `sweet-tart-shell`.

```
step 1  cream the butter and sugar        [butter, sugar, salt]
step 2  beat in the eggs one at a time    ← ref (~1)   [eggs]
step 3  fold in the almond and flour      ← ref (~1)   [almond flour, all-purpose flour]
step 4  stir in the rum and almond extract, chill 1 hr  ← ref (~1)   [rum, almond extract]
```

Rows = 8. Columns = 5. Equal weights butter / sugar / egg / almond flour, which is the
definition of the thing. Timer: `~chill{1%hr}`.

## 5. `recipes/pastry-and-doughs/almond-croissant.cook`

Bakery. 6. Pairs with `croissant`, `frangipane`.

```
step 1  boil the syrup, cool              [water, sugar, rum]
step 2  halve and soak the croissants      ← ref (~1)   [day-old croissants]
step 3  fill and close                     ← ref (~1)   [frangipane]
step 4  top, scatter almonds, bake 350°F 20 min  ← ref (~1)  [frangipane, sliced almonds]
step 5  dust once cool                     ← ref (~1)   [powdered sugar]
```

Rows = 8. Columns = 6. Both frangipane and the croissants enter as leaves — the recipe consumes
two other recipes and says so in `pairs-with:`.

Substance: this is the canonical *use up yesterday's croissants* pastry, not a fresh croissant
with paste on it. Day-old is written into the ingredient note because it is the point.

## 6. `recipes/breads/pineapple-bun.cook`

Bakery, Dim Sum Counter. 8 buns. `aka:` bo lo bao, bolo bao, 菠蘿包, pineapple bun, pineapple
bread — plus the note that there is no pineapple in it.

Two branches — the dough and the lid — merging at shaping:

```
step 1  scald the tangzhong, cool          [bread flour, whole milk]
step 2  mix and knead 10 min                ← ref (~1)  [flour, sugar, milk powder, yeast, egg, milk, salt]
step 3  knead in the butter, rise 1 hr      ← ref (~1)  [butter]
step 4  cream the lid, work in the flour    [butter, lard, sugar, egg, custard powder, flour, ammonia/soda]  (second branch)
step 5  divide, ball, drape the lid, proof 45 min  ← refs (~2) dough, (~1) lid
step 6  score the grid, egg-wash, bake 350°F 15 min ← ref (~1)  [egg yolk]
```

Rows = 15. Columns = 5 (step 1 col 2 → 2 col 3 → 3 col 4; step 4 col 2; step 5 col 5; step 6 col 6).
Columns = 6.

The lid is written into this file rather than split out as its own table. `costra-de-azucar`
exists as a standalone lid, but it is the Mexican concha crust — shortening, powdered sugar,
tinted three ways — and the bo lo bao lid is a different formula (custard powder, milk powder,
a lift from ammonia or soda) that cracks into a grid rather than being scored into one. Two
branches merging into one bun is a merge, which the build supports; it is the *split* it refuses.

---

## Verification points

- `node scripts/check-recipes.mjs --labels <file>` per file, then all six together.
- `npm run recipes` — parses the whole collection, validates `pairs-with` targets and counter
  names, rewrites `src/generated/recipes.json`. That file is generated, not committed by this
  ticket; only `recipes/**` is included in commits.
- A recount of Bakery-shelved and Bakery-only against the acceptance thresholds.
- `npm run verify` at the end, to confirm nothing in the collection broke.

## Commit units

1. `croissant-dough.cook`
2. `croissant.cook`, `pain-au-chocolat.cook`
3. `frangipane.cook`, `almond-croissant.cook`
4. `pineapple-bun.cook`

Each through `lisa commit-ticket --ticket-id T-001-16` with exact `--include` paths. Sibling
tickets have untracked files elsewhere in `recipes/`; no glob, no `-A`, no ordinary `git add`.
