# T-002-06 — Structure

Twelve new files, one folder, nothing modified. This is the blueprint: what each file contains,
what its tree looks like, and which slugs it names.

---

## Files

### Created

All twelve in `recipes/salads/`, joining the ten already there.

```
recipes/salads/kale-caesar.cook
recipes/salads/shaved-brussels-salad.cook
recipes/salads/italian-chopped-salad.cook
recipes/salads/chinese-chicken-salad.cook
recipes/salads/harvest-chopped-salad.cook
recipes/salads/cobb-salad.cook
recipes/salads/wedge-salad.cook
recipes/salads/greek-salad.cook
recipes/salads/panzanella.cook
recipes/salads/spinach-salad.cook
recipes/salads/salade-nicoise.cook
recipes/salads/roasted-beet-salad.cook
```

### Modified

None. Not `src/lib/icons.ts` (which is why the label vocabulary is fixed in advance), not
`src/data/counters.json` (`The Bowl Shop` is already there), not any dressing file (pairings are
made mutual at build time), not `docs/gaps/bowl-shop.md` (T-002-08 rewrites that block).

### Deleted

None.

### Regenerated, not committed

`src/generated/recipes.json` — rebuilt by `npm run recipes`. `.gitignore` line 5 covers
`src/generated/`, so running it does not put a non-`recipes/**` file in the working tree. It has
to be rebuilt before `vitest run` means anything, because every collection test reads that file.

---

## The shape of one file

```
>> title:        board name, title case
>> category:     Salads
>> tags:         5–6, lowercase, comma separated — the leaf, the protein, the origin, the method
>> counters:     The Bowl Shop            ← the whole point of the ticket
>> aka:          generic + specific + misspellings + what people type
>> pairs-with:   only slugs confirmed to exist; omitted where the dressing is built in the bowl
>> servings:     2, 4 or 6
>> time:         wall clock, "40 min"
>> slack:        optional; level — reason, where level ∈ forgiving | narrow | unforgiving
>> step.1: …     one per operation step, 1-indexed over ALL steps including header rows
…

[optional header paragraph — no ingredients, no refs: the oven preheat]

One paragraph per step. Method, then the thing a cook would not know.

[optional footer paragraph — the ten-minute warning, what it is like the next day]
```

`>> step.N` numbering counts every step paragraph, header rows included. `beef-stew` is the
model: its labels start at `step.6` because five paragraphs precede them.

---

## Trees, one per file

Written as `[op] ← inputs`. `(n)` is the step index. The root is the last line of each block.

### 1. `kale-caesar` — gaps rank 6
```
(1) rub the kale     ← lacinato kale, lemon, salt, olive oil
(2) toast the bread  ← sourdough, olive oil, garlic, parmesan            [oven, ~toast{12%min}]
(3) shave over       ← (1), parmesan, black pepper
(4) toss             ← (3), (2), lemon
```
`pairs-with: caesar-dressing, sourdough-bread` — the dressing is referenced, never rebuilt.
Header row: preheat 400°F. 4 cols, ~11 rows.

### 2. `shaved-brussels-salad` — gaps rank 7
```
(1) toast the hazelnuts ← hazelnuts                                      [~toast{8%min}]
(2) slice fine          ← Brussels sprouts
(3) stand in lemon      ← (2), lemon juice, salt
(4) crumble in          ← (1), pecorino, olive oil, black pepper, (3)
```
Dressing built in the bowl (lemon, oil, pecorino) — no such dressing exists in the drawer.
`pairs-with:` names `basic-vinaigrette` as the alternative, not as a component.

### 3. `italian-chopped-salad` — gaps rank 13, *The Goop Father*
```
(1) crisp the chickpeas ← chickpeas, olive oil, oregano, salt            [oven, ~roast{25%min}]
(2) macerate            ← red onion, red wine vinegar
(3) chop to one size    ← romaine, radicchio, salami, provolone, tomatoes, pepperoncini
(4) whisk in            ← (2), olive oil, dried oregano, black pepper
(5) toss                ← (3), (4), (1)
```
The chop *is* the recipe — the paragraph on step 3 says so and gives the size.
Header row: preheat 425°F. 5 cols.

### 4. `chinese-chicken-salad` — gaps rank 13, *Brentwood*
```
(1) poach the chicken  ← chicken breast, ginger, scallion, salt          [~poach{15%min}, ~cool{10%min}]
(2) fry the wontons    ← wonton wrappers, neutral oil                    [~fry{2%min}]
(3) shred              ← (1)
(4) slice thin         ← napa cabbage, romaine, carrot, scallions, cilantro
(5) toss               ← (4), (3), (2), toasted almonds, sesame seeds
```
`pairs-with: goma-dare, miso-ginger-dressing` — both exist; neither is rebuilt.

### 5. `harvest-chopped-salad` — gaps rank 13, *Fall Harvest*
```
(1) roast the squash  ← delicata squash, olive oil, salt                 [oven, ~roast{25%min}]
(2) candy the pecans  ← pecans, maple syrup, salt, cayenne               [~toast{6%min}, ~cool{10%min}]
(3) chop              ← kale, apple, celery, dried cranberries
(4) toss              ← (3), (1), (2), goat cheese
```
`pairs-with: basic-vinaigrette`. Header row: preheat 425°F.

### 6. `cobb-salad`
```
(1) render the bacon ← bacon                                             [~render{10%min}]
(2) boil the eggs    ← eggs                                              [~boil{8%min}, ~chill{5%min}]
(3) poach the chicken← chicken breast, salt, bay                         [~poach{15%min}]
(4) peel and halve   ← (2)
(5) dice             ← (3), (1), avocado, tomatoes, blue cheese
(6) lay in rows      ← romaine, (5), (4), chives
```
Six operations; the rows *are* the dish, which is why the last step is `lay` and not `toss`.
`pairs-with: blue-cheese-dressing, basic-vinaigrette`.

### 7. `wedge-salad`
```
(1) render the bacon  ← bacon                                            [~render{10%min}]
(2) pickle the shallot← shallot, red wine vinegar, sugar, salt           [~stand{20%min}]
(3) quarter           ← iceberg lettuce
(4) crumble over      ← (3), (1), (2), blue cheese, chives, black pepper
```
`pairs-with: blue-cheese-dressing`. The dressing is poured over at the table, never tossed —
the footer row says so.

### 8. `greek-salad` (horiatiki)
```
(1) salt the tomatoes  ← tomatoes, salt                                  [~stand{15%min}]
(2) macerate the onion ← red onion, red wine vinegar                     [~stand{15%min}]
(3) warm the oil       ← olive oil, dried oregano, garlic                [~warm{3%min}]
(4) cut in chunks      ← cucumbers, green pepper, olives, (1), (2)
(5) spoon over         ← (4), feta, (3)
```
No lettuce, and the paragraph on step 4 says why. Dressing built in the bowl: oregano oil over a
slab of feta is the method, and no oregano-oil recipe exists to reference.

### 9. `panzanella`
```
(1) salt the tomatoes ← tomatoes, salt                                   [~stand{30%min}]
(2) crisp the bread   ← day-old bread, olive oil                         [~fry{6%min}]
(3) macerate          ← red onion, red wine vinegar
(4) whisk in          ← (1), olive oil, garlic
(5) throw in          ← (4), (2), (3), basil, black pepper
```
The dressing *is* the tomato juice from step 1 — the strongest case in the twelve for building in
the bowl. `pairs-with: fattoush` (the other bread salad on the site, and the contrast is worth
the pairing).

### 10. `spinach-salad`
```
(1) render the bacon ← bacon                                             [~render{8%min}]
(2) boil the eggs    ← eggs                                              [~boil{7%min}]
(3) sear the mushrooms← (1), mushrooms                                   [~sear{5%min}]
(4) whisk in         ← (3), red wine vinegar, dijon mustard, sugar
(5) peel and halve   ← (2)
(6) wilt             ← spinach, (4), (5), red onion
```
The warm bacon vinaigrette is built in the pan and cannot exist away from it. Step 3 consumes
the bacon *and* its fat, which is why (1) feeds (3) rather than the final toss.

### 11. `salade-nicoise`
```
(1) boil the potatoes ← new potatoes, salt                               [~boil{15%min}]
(2) blanch the beans  ← green beans                                      [~blanch{3%min}, ~chill{2%min}]
(3) boil the eggs     ← eggs                                             [~boil{8%min}]
(4) sear the tuna     ← tuna steak, olive oil, salt                      [~sear{4%min}]
(5) whisk             ← lemon juice, dijon mustard, olive oil, anchovy, shallot
(6) dress             ← (1), (5)
(7) arrange           ← (6), (2), (3), (4), olives, tomatoes, lettuce
```
Seven steps, four of them cooked. The dressing goes on the warm potatoes first (step 6) and the
rest of the plate second — that ordering is the recipe and the reason it is not one toss.

### 12. `roasted-beet-salad`
```
(1) roast the beets  ← beets, olive oil, salt, thyme                     [oven, ~roast{60%min}]
(2) candy the walnuts← walnuts, honey, salt                              [~toast{6%min}]
(3) marinate         ← goat cheese, olive oil, orange zest, black pepper
(4) peel and quarter ← (1)
(5) arrange          ← arugula, (4), (3), (2), orange segments
```
`pairs-with: basic-vinaigrette`. Header row: preheat 400°F. Overlaps in *subject* with
T-002-07's roasted-vegetable section and not in file — recorded, not avoided.

---

## Invariants every file is checked against, by eye, before the checker runs

1. **One parent per step.** No `(n)` appears in two later steps. Verified per tree above.
2. **One root.** Exactly one step is referenced by nothing. Verified per tree above.
3. **≥3 ingredient rows, ≥3 columns.** The thinnest tree here is `shaved-brussels-salad` at four
   operations deep; all twelve clear both floors with room.
4. **Every operation label opens with a verb in `VERB_ICONS`.** The blueprint's labels use
   `rub, toast, shave, toss, slice, stand, crumble, crisp, macerate, chop, whisk, poach, fry,
   shred, render, boil, peel, dice, lay, pickle, quarter, salt, warm, cut, spoon, sear, wilt,
   blanch, dress, arrange, marinate, roast, candy→toast, throw` — every one confirmed present.
   **`massage` and `tear` are not in the table**; `rub` and `throw` carry them.
5. **Every timer named.** `~toast{8%min}`, never `~{8%min}`.
6. **Every `pairs-with:` slug confirmed on disk** with `ls` before it is written.
7. **`counters: The Bowl Shop`** on all twelve, spelled exactly as `src/data/counters.json` has
   it.

## Slugs this ticket depends on existing (to be confirmed, not assumed)

`caesar-dressing`, `blue-cheese-dressing`, `basic-vinaigrette`, `goma-dare`,
`miso-ginger-dressing`, `green-goddess-dressing`, `ranch-dressing`, `honey-mustard-dressing`,
`fattoush`, `sourdough-bread`.

The last one is the only doubtful one; if `recipes/breads/sourdough-bread.cook` is not there
under that name, `kale-caesar` drops it and pairs with `caesar-dressing` alone.

## Ordering

The twelve are independent — no file references another, and pairings are one-directional. So
the order is the gaps-page order (1–5 first, in rank order, as the acceptance criterion
requires), then 6–12. Commits group them in fours, so a failure in one group leaves the
previous group's work sealed.
