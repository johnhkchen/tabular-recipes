# T-001-05 — Structure

Fourteen files created, one folder created, nothing modified, nothing deleted. Blueprint only:
metadata lines, the merge tree each file draws, and the order the units land in.

## Files

### Created — new folder `recipes/smoked-and-grilled/` (category `Smoked & Grilled`)

| File | Title | Servings | Ops |
| --- | --- | --- | --- |
| `chopped-pork.cook` | Chopped Pork | 12 | 6 |
| `smoked-brisket.cook` | Smoked Brisket | 12 | 6 |
| `smoked-pork-ribs.cook` | Smoked Pork Ribs | 4 | 5 |
| `burnt-ends.cook` | Burnt Ends | 6 | 5 |
| `rib-tips.cook` | Rib Tips | 4 | 5 |
| `smoked-chicken.cook` | Smoked Chicken | 4 | 6 |
| `smoked-turkey-breast.cook` | Smoked Turkey Breast | 8 | 5 |
| `smoked-bologna.cook` | Smoked Bologna | 8 | 5 |

### Created — in existing folders

| File | Title | Category | Servings | Ops |
| --- | --- | --- | --- | --- |
| `sauces-and-gravies/barbecue-dip.cook` | Barbecue Dip | Sauces & Gravies | 16 | 4 |
| `dressings-and-dips/barbecue-slaw.cook` | Barbecue Slaw | Dressings & Dips | 8 | 4 |
| `dressings-and-dips/coleslaw.cook` | Coleslaw | Dressings & Dips | 8 | 4 |
| `flatbreads-and-pancakes/hush-puppies.cook` | Hush Puppies | Flatbreads & Pancakes | 6 | 5 |
| `custards-and-puddings/banana-pudding.cook` | Banana Pudding | Custards & Puddings | 8 | 5 |
| `stews-and-braises/brunswick-stew.cook` | Brunswick Stew | Stews & Braises | 8 | 5 |

### Not created, not modified

`src/**` (T-001-17), `docs/gaps/**` (T-001-18), `src/data/counters.json`, and every existing
`.cook` file. The two cornbreads and `boston-baked-beans` already name Smokehouse, so no hand-off
edit is needed for them.

## Metadata contract, every file

```
>> title:        Title Case, the name on the board
>> category:     written explicitly, even where the folder would derive it
>> tags:         5–6, lower case, main ingredient · method · counter idiom
>> counters:     Smokehouse first (it is the breadcrumb home, [slug].astro:36)
>> aka:          the menu vocabulary from docs/knowledge/counters.md §Smokehouse,
                 with a diacritic-free form wherever the name carries one
>> servings:     integer, and the quantities below are real for it
>> time:         wall clock, as a cook would say it
>> pairs-with:   slugs only, one side is enough (made mutual at build)
>> step.N:       label override where the derived label would read as a fragment
```

Every timer named, from `src/lib/time.ts`'s vocabulary: `~smoke`, `~rest`, `~chill`, `~simmer`,
`~brine`, `~cool`, `~drain` (unattended) and `~fry`, `~whisk`, `~sweat`, `~sear` (hands-on).
No bare `~{n%unit}` anywhere in this ticket.

## The trees

Notation: each numbered line is one step; `←` lists what it consumes. A step consuming nothing
starts a branch. Every file ends in one step, as the build requires.

### `chopped-pork` — gap 1, and gap 16 folded in
```
1  bring the smoker to 250°F (120°C), hickory or oak      [full-width prep row, no ingredients]
2  coat and rub            ← shoulder, mustard, salt, brown sugar, paprika, pepper, garlic powder
3  stir a spritz           ← cider vinegar, water, hot sauce            [branch]
4  smoke to 165°F ~smoke{7%hr}, spritzing        ← (~2) rubbed shoulder, (~1) spritz
5  wrap, back in ~smoke{4%hr} to 203°F           ← (~1), cider vinegar   [#butcher paper]
6  rest ~rest{1%hr}, pull off the bone, chop keeping the outside brown in
                                                ← (~1), cider vinegar, coarse black pepper
```
`aka:` carries barbecue · chopped bbq · chopped barbecue · pulled pork · coarse chopped · outside
brown · brownies · bark · pork shoulder.

### `smoked-brisket` — gap 2
```
1  bring the smoker to 250°F (120°C), post oak            [full-width prep row]
2  trim and season         ← packer brisket, kosher salt, coarse black pepper   (salt and pepper
                             only — the point of having a beef rub distinct from memphis-dry-rub)
3  stir a spritz           ← cider vinegar, water                    [branch]
4  smoke to 165°F ~smoke{8%hr}                  ← (~2) brisket, (~1) spritz
5  wrap in butcher paper, back in ~smoke{4%hr} to 203°F   ← (~1), beef tallow
6  rest ~rest{2%hr}, slice the flat for lean, the point for moist    ← (~1), flaky salt
```

### `smoked-pork-ribs` — gap 3
```
1  bring the smoker to 250°F (120°C), hickory             [full-width prep row]
2  membrane off, rub       ← spare ribs, mustard, brown sugar, paprika, salt, pepper,
                             garlic powder, cayenne
3  smoke bone down ~smoke{3%hr}                 ← (~1)
4  wrap and cook back ~smoke{2%hr}              ← (~1), butter, brown sugar, honey, cider vinegar
5  sauce for wet, dust with rub for dry, set ~smoke{45%min}   ← (~1), barbecue sauce
```

### `burnt-ends` — gap 4
```
1  bring the smoker to 250°F (120°C), oak                 [full-width prep row]
2  season the point        ← brisket point, kosher salt, coarse black pepper
3  smoke to 195°F ~smoke{8%hr}                  ← (~1)
4  cube and toss          ← (~1), barbecue sauce, dark brown sugar, unsalted butter
5  back in the smoke until the edges candy ~smoke{2%hr}    ← (~1), flaky salt
```

### `rib-tips` — gap 13
```
1  bring the smoker to 250°F (120°C), hickory             [full-width prep row]
2  rub                    ← rib tips, mustard, salt, brown sugar, paprika, pepper, cayenne
3  smoke until the cartilage softens ~smoke{3%hr}          ← (~1)
4  cut in 2-in pieces, toss                     ← (~1), barbecue sauce, unsalted butter
5  back in until the glaze tightens ~smoke{45%min}         ← (~1), flaky salt
```

### `smoked-chicken` — gap 10a (the `char-siu` two-branch shape)
```
1  bring the smoker to 275°F (135°C), cherry or hickory   [full-width prep row]
2  spatchcock and rub     ← whole chicken, butter, salt, paprika, garlic powder,
                            onion powder, coarse black pepper
3  dry the skin, uncovered in the fridge ~chill{4%hr}      ← (~1)
4  smoke to 165°F in the breast ~smoke{3%hr}               ← (~1)
5  stir a glaze           ← barbecue sauce, cider vinegar          [branch]
6  brush, set ~smoke{15%min}, ~rest{15%min}, cut into eight   ← (~1) glaze, (~2) smoked chicken
```

### `smoked-turkey-breast` — gap 10b
```
1  bring the smoker to 275°F (135°C), apple or hickory    [full-width prep row]
2  brine chilled ~brine{12%hr}     ← bone-in turkey breast, turkey brine
                                     (the component recipe, referenced as an ingredient —
                                      the corpus already does this with @mayonnaise, @masa, stocks)
3  pat dry, butter under the skin  ← (~1), unsalted butter, coarse black pepper, smoked paprika
4  smoke to 160°F ~smoke{3%hr}     ← (~1)
5  rest ~rest{20%min}, slice across the grain   ← (~1), flaky salt
```
`pairs-with: turkey-brine` — the reverse edge is written at build time, so
`recipes/spice-blends-and-marinades/turkey-brine.cook` is not touched.

### `smoked-bologna` — gap 11
```
1  bring the smoker to 250°F (120°C), hickory             [full-width prep row]
2  score in a diamond, coat  ← bologna chub, mustard, brown sugar, paprika, pepper, garlic powder
3  smoke until the cuts open ~smoke{3%hr}                  ← (~1)
4  stir a glaze              ← barbecue sauce, brown sugar, cider vinegar     [branch]
5  brush, set ~smoke{30%min}, ~rest{10%min}, slice half-inch thick  ← (~1) glaze, (~2) bologna
```

### `barbecue-dip` — gap 5
```
1  whisk in a saucepan     ← cider vinegar, tomato ketchup, water
2  stir in the heat        ← (~1), brown sugar, salt, red pepper flakes, black pepper, cayenne
3  simmer just under a boil ~simmer{10%min}                ← (~1)
4  off the heat, rest overnight ~rest{8%hr}                ← (~1), hot sauce
```

### `barbecue-slaw` — gap 6a
```
1  whisk the dressing      ← ketchup, cider vinegar, sugar, salt, black pepper, red pepper flakes
2  chop fine               ← green cabbage                              [branch]
3  toss                    ← (~1) chopped cabbage, (~2) dressing, grated yellow onion
4  chill ~chill{1%hr}      ← (~1)
```

### `coleslaw` — gap 6b, and Deli #5 / Meat and Three #18
```
1  salt and ~drain{30%min} ← green cabbage, carrot, yellow onion, kosher salt
2  whisk the dressing      ← mayonnaise, cider vinegar, sugar, dry mustard, celery seed, pepper
3  toss                    ← (~2) drained cabbage, (~1) dressing
4  chill ~chill{1%hr}      ← (~1)
```

### `hush-puppies` — gap 7 (the site's first deep fry)
```
1  whisk the dry           ← cornmeal, flour, sugar, baking powder, salt, baking soda
2  stir to a thick batter  ← (~1), buttermilk, egg, grated onion
3  rest ~rest{10%min}      ← (~1)
4  heat to 350°F (175°C)   ← peanut oil                                 [branch, #Dutch oven]
5  drop by the spoonful, ~fry{4%min}, drain   ← (~2) batter, (~1) hot oil, flaky salt
```

### `banana-pudding` — gap 8
```
1  whisk smooth in a saucepan ← sugar, cornstarch, salt, egg yolks
2  cook to a boil ~whisk{8%min}  ← (~1), whole milk
3  off the heat, ~cool{20%min}   ← (~1), unsalted butter, vanilla extract
4  layer in a 2-qt dish         ← (~1) custard, vanilla wafers, bananas
5  chill ~chill{4%hr}           ← (~1)
```

### `brunswick-stew` — gap 12
```
1  sweat in a Dutch oven ~sweat{8%min}   ← yellow onion, unsalted butter
2  simmer ~simmer{20%min}   ← (~1), chicken stock, crushed tomatoes, cider vinegar,
                              Worcestershire sauce, hot sauce
3  add the potato, ~simmer{25%min}       ← (~1), Yukon Gold potatoes
4  stir in the meat and the beans, ~simmer{30%min}
                            ← (~1), chopped smoked pork, smoked chicken, lima beans, corn
5  season                   ← (~1), kosher salt, black pepper, dark brown sugar
```

## The pairing graph

Written on one side only; `collection.test.ts` proves the other side exists after the build.

```
chopped-pork          → barbecue-dip, barbecue-slaw, hush-puppies
smoked-brisket        → barbecue-sauce, coleslaw
smoked-pork-ribs      → memphis-dry-rub, barbecue-sauce
burnt-ends            → boston-baked-beans
rib-tips              → barbecue-dip
smoked-chicken        → coleslaw
smoked-turkey-breast  → turkey-brine
smoked-bologna        → hush-puppies
barbecue-dip          → hush-puppies
barbecue-slaw         → hush-puppies
brunswick-stew        → skillet-cornbread
banana-pudding        → (none — it ends the meal)
```

Every target exists today; nothing points at a file this ticket does not create or the collection
does not already hold.

## Ordering of the work

Sequenced so that every `pairs-with` target exists before the file naming it is checked, and so
each commit is a coherent unit rather than a bag of files:

1. **The table sauces and the slaws** — `barbecue-dip`, `barbecue-slaw`, `coleslaw`. They have no
   dependencies and they are what the pit meats point at.
2. **The pit, pork** — `chopped-pork`, `smoked-pork-ribs`, `rib-tips`. Creates the folder.
3. **The pit, beef** — `smoked-brisket`, `burnt-ends`.
4. **The pit, poultry and the odd one** — `smoked-chicken`, `smoked-turkey-breast`,
   `smoked-bologna`.
5. **Bread, side and sweet** — `hush-puppies`, `brunswick-stew`, `banana-pudding`.

Five `lisa commit-ticket` units, each with exact `--include` paths, each verified by
`node scripts/check-recipes.mjs --labels` before it lands. `npm run recipes` plus
`npx vitest run src/lib/collection.test.ts` after the last unit, since the mutual-pairing and
unique-slug invariants only hold across the whole collection.
