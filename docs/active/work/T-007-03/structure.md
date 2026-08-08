# T-007-03 — Structure

Eight new files, no edits to anything that already exists. Each block below is the blueprint:
the metadata, the operations in order, the rows each one contributes, and the shape the checker
should report.

`R` = ingredient rows the operation adds. The reported shape is `rows x cols`, where `cols` is
`1 + the depth of the operation chain`.

---

## Files created

```
recipes/drinks/hong-kong-milk-tea.cook          5 rows x 5 cols   4 ops
recipes/drinks/yuenyeung.cook                   5 rows x 4 cols   3 ops
recipes/drinks/iced-lemon-tea.cook              5 rows x 4 cols   4 ops
recipes/drinks/lemon-coke-with-ginger.cook      3 rows x 4 cols   3 ops
recipes/drinks/red-bean-ice.cook                6 rows x 5 cols   4 ops
recipes/drinks/horlicks.cook                    5 rows x 4 cols   3 ops
recipes/flatbreads-and-pancakes/hong-kong-french-toast.cook   7 rows x 5 cols   5 ops
recipes/flatbreads-and-pancakes/thick-toast.cook              3 rows x 4 cols   3 ops
```

## Files modified

None. `>> pairs-with:` is made mutual at build time, so pairing to `french-toast`,
`red-bean-paste` and `white-sandwich-bread` writes nothing into those files.

## Files deliberately not created

`recipes/breads/pineapple-bun-with-butter.cook` — 菠蘿油. Two ingredients, and
`check-recipes.mjs` fails under three. Argued in `design.md` §2; the handoff line is at the
bottom of this document.

---

## 1. `recipes/drinks/hong-kong-milk-tea.cook`

```
title: Hong Kong Milk Tea          category: Drinks (folder default)
tags: tea, hong kong, evaporated milk, brewed, drink
counters: Cha Chaan Teng
aka: hong kong milk tea, 港式奶茶, 奶茶, gong sik naai cha, naai cha, lai cha, nai cha,
     silk stocking milk tea, 絲襪奶茶, si mat naai cha, HK milk tea, milk tea, stocking tea
pairs-with: (none — 鴛鴦 declares it from its side)
servings: 4          time: 25 min
slack: narrow — …the leaf keeps working while it sits, and tea left past the steep goes bitter
       under the milk rather than strong
```

| # | Step | Cell (`>> step.N:`) | R |
| --- | --- | --- | --: |
| 1 | *prose, full-width row above the table* — no two shops blend it the same; the 2017 heritage listing says outright there is no standard | — | 0 |
| 2 | mix the two cuts into a cloth bag or fine strainer | `blend the two cuts, into the bag` | **2** |
| 3 | water to 90–96 °C in a saucepan, leaf in, `~simmer{2-3%min}` | `90-96°C, simmer 2 to 3 min` | **1** |
| 4 | lift the bag, pour the tea back through it onto the leaves, 3 to 6 times, cover, `~steep{6%min}` | `pull it through the bag 3 to 6 times, steep 6 min` | 0 |
| 5 | evaporated milk and sugar into the cups first, tea poured on top, 7 to 3 | `milk in the cup first, tea on top, 7 to 3` | **2** |

Rows: Ceylon tea bags · loose-leaf Ceylon black tea · water · evaporated milk · granulated
sugar. **5 rows × 5 cols.**

Refs chain straight: 3→2, 4→3, 5→4, all `@&(~1)`. The prose step is first, so nothing shifts.

**Every number in this file and where it came from** — the table in `design.md` §4 is the
authority; the file itself carries the 2 to 3 and the 3 to 6 as ranges in the cells.

## 2. `recipes/drinks/yuenyeung.cook`

```
title: Yuenyeung                   category: Drinks
tags: coffee, tea, hong kong, evaporated milk, drink
counters: Cha Chaan Teng
aka: yuenyeung, yuen yeung, yuanyang, yin yong, 鴛鴦, coffee and tea, Coffee & Tea,
     coffee with tea, tea coffee mix, hong kong coffee tea
pairs-with: hong-kong-milk-tea
servings: 2          time: 15 min
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | ground coffee + boiling water in a French press, `~steep{4%min}`, press | `steep 4 min, press it down` | **2** |
| 2 | pour the milk tea into the coffee — two of tea to one of coffee | `two of tea to one of coffee` | **1** |
| 3 | evaporated milk and sugar stirred in, poured hot | `top up the milk, sugar to taste` | **2** |

Rows: ground dark roast coffee · boiling water · **Hong Kong milk tea** · evaporated milk ·
granulated sugar. **5 rows × 4 cols.**

**The `&` the AC asks for is step 2 → step 1.** The milk tea is one ingredient row carrying
`(300 mL; hot, the recipe on this shelf)` — the same shape the eight `onion-tomato masala`
curries use — and `pairs-with` links the two files. No brew is re-derived: this file contains no
tea leaf, no temperature and no steep for the tea.

No `slack`: the failure here is the ratio, and the ratio is in the cell.

## 3. `recipes/drinks/iced-lemon-tea.cook`

```
title: Iced Lemon Tea              category: Drinks
tags: tea, lemon, hong kong, iced, drink
counters: Cha Chaan Teng
aka: iced lemon tea, 凍檸茶, dung ling cha, dong ning cha, ling cha, lemon tea, LT,
     hong kong iced lemon tea, cold lemon tea, lemon ice tea
pairs-with: hong-kong-milk-tea
servings: 2          time: 45 min
slack: narrow — press the slices, not the rind: crushed pith turns the glass bitter and
       stirring only spreads it
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | tea bags in boiling water, `~steep{5%min}`, lifted out unsqueezed | `steep 5 min, lift the bags out` | **2** |
| 2 | `~chill{30%min}` the brewed tea to fridge-cold | `chill 30 min, all the way cold` | 0 |
| 3 | lemon slices + sugar syrup pressed hard against the glass with a long spoon | `bruise the slices against the glass` | **2** |
| 4 | ice into the glass, cold tea poured over | `ice in, tea over, stir it yourself` | **1** |

Rows: Ceylon tea bags · boiling water · lemon · sugar syrup · ice. **5 rows × 4 cols.**

**Two branches, one merge.** Step 4 takes `@&(~2)` (the chilled tea) and `@&(~1)` (the bruised
lemon). That is what makes the bruising its own column, which the work list asked for by name:
"the bruising of the lemon with the spoon is the technique and is the one thing a table can
say."

## 4. `recipes/drinks/lemon-coke-with-ginger.cook`

```
title: Lemon Coke with Ginger      category: Drinks
tags: cola, ginger, lemon, hong kong, hot, drink
counters: Cha Chaan Teng
aka: lemon coke with ginger, 檸樂煲薑, ling lok bou geung, ning lok bou geung, 薑檸樂,
     geung ling lok, ginger coke, hot coke with lemon and ginger, hot cola with ginger
servings: 2          time: 20 min
slack: narrow — lemon dropped in while it is still boiling turns the pan bitter and no amount
       of sugar takes it back
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | *prose row* — drunk hot, and the fizz is boiled out on purpose; what is left is a thin ginger syrup | — | 0 |
| 2 | ginger coins smashed flat, into the cola in a saucepan | `smash the coins, into the cola` | **2** |
| 3 | `~simmer{10%min}` uncovered until flat, off the heat, `~steep{5%min}` covered | `simmer 10 min flat, steep 5 min off the heat` | 0 |
| 4 | lemon slices stirred in **off the heat**, pressed once | `lemon in off the heat, press once` | **1** |

Rows: fresh ginger · cola · lemon. **3 rows × 4 cols.** Under the 5-row aim — `design.md`
"Where the sizes fall short".

## 5. `recipes/drinks/red-bean-ice.cook`

```
title: Red Bean Ice                category: Drinks
tags: adzuki, evaporated milk, hong kong, iced, drink
counters: Cha Chaan Teng
aka: red bean ice, 紅豆冰, hung dau bing, hong dau bing, iced red bean, red bean drink,
     adzuki ice, hong kong red bean ice
pairs-with: red-bean-paste
servings: 4          time: 3 hr 15 min
slack: narrow — twenty minutes more and the beans go to paste, which is a different recipe on
       this shelf
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | beans covered, `~boil{5%min}`, first water drained | `boil 5 min, drain the first water` | **2** |
| 2 | fresh water, `~simmer{60%min}`, topped up | `simmer 60 min, whole not mashed` | **1** |
| 3 | rock sugar in, `~simmer{10%min}` to a loose syrup, `~chill{2%hr}` | `sweeten 10 min, chill 2 hr` | **1** |
| 4 | beans over crushed ice, evaporated milk down the side | `beans over the ice, milk down the side` | **2** |

Rows: dried adzuki beans · water for the first boil · fresh water · rock sugar · crushed ice ·
evaporated milk. **6 rows × 5 cols.**

The two water rows carry different names, which is what `red-bean-paste` already does. Step 2's
cell — *whole not mashed* — and the `slack` line together are where this file says what makes it
not `red-bean-paste`; no prose row is spent on it.

## 6. `recipes/drinks/horlicks.cook`

```
title: Horlicks                    category: Drinks
tags: malt, evaporated milk, hong kong, hot, drink
counters: Cha Chaan Teng
aka: horlicks, holick, 好立克, hou laap hak, ovaltine, 阿華田, a wa tin, malted milk,
     hot malted milk, malt drink, hong kong horlicks
pairs-with: hong-kong-milk-tea
servings: 2          time: 10 min
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | powder pasted with a splash of boiling water until no lump is left | `paste it smooth before the rest` | **2** |
| 2 | the rest of the boiling water in | `the rest of the water in` | **1** |
| 3 | evaporated milk and sugar stirred through, poured hot | `milk and sugar, pour it hot` | **2** |

Rows: malted milk powder · boiling water for the paste · boiling water · evaporated milk ·
granulated sugar. **5 rows × 4 cols.**

The ingredient is `malted milk powder` — the name `milkshake` already uses and the name
`aisles.json` already matches — with `(Horlicks or Ovaltine)` as the note that says which tin.
No `slack`: the only failure is lumps, and step 1's cell is where that is said once.

## 7. `recipes/flatbreads-and-pancakes/hong-kong-french-toast.cook`

```
title: Hong Kong French Toast      category: Flatbreads & Pancakes
tags: bread, eggs, peanut butter, deep-fried, hong kong
counters: Cha Chaan Teng
aka: french toast, hong kong french toast, 西多士, sai do si, sai dor si, HK french toast,
     western toast, kowloon french toast, deep fried french toast, peanut butter french toast
pairs-with: french-toast
servings: 2          time: 20 min
slack: narrow — oil below 350°F soaks into the crumb instead of sealing it, and a soggy 西多士
       does not crisp back up
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | *prose row* — **not the diner's french toast**: the peanut butter goes inside, and it is deep-fried rather than griddled | — | 0 |
| 2 | peanut butter between the slices, pressed into two sandwiches | `peanut butter inside, press to two` | **2** |
| 3 | eggs beaten with evaporated milk in a wide dish | `beat the egg loose` | **2** |
| 4 | sandwiches turned through the egg, every face and every edge | `coat every face, edges too` | 0 |
| 5 | `~fry{90%sec}` in 1 in of oil held at 350°F, turned once, drained | `deep-fry 350°F, 90 sec, turn once` | **1** |
| 6 | cold butter slab on top, golden syrup over at the table | `cold butter on top, syrup over` | **2** |

Rows: smooth peanut butter · white sandwich bread · eggs · evaporated milk · neutral oil ·
salted butter · golden syrup. **7 rows × 5 cols.**

Step 4 merges two branches: `@&(~2)` the sandwiches, `@&(~1)` the egg.

**The three things the AC asks this file for:** `french toast` leads `aka`; the prose row says
what it is not; the oil depth and temperature in step 5 say which fryer it is written for —
a pan, not a counter fryer held at temperature all afternoon.

## 8. `recipes/flatbreads-and-pancakes/thick-toast.cook`

```
title: Thick Toast                 category: Flatbreads & Pancakes
tags: bread, butter, condensed milk, hong kong, toast
counters: Cha Chaan Teng
aka: thick toast, 厚多士, hau do si, 奶油多, naai yau do, 奶醬多, condensed milk toast,
     butter and condensed milk toast, thick cut butter toast, hong kong thick toast
pairs-with: white-sandwich-bread
servings: 1          time: 10 min
```

| # | Step | Cell | R |
| --- | --- | --- | --: |
| 1 | one 1 in slice under a hot grill, `~toast{3%min}`, turned once | `grill 3 min, gold outside, soft in` | **1** |
| 2 | cold butter slab laid on while it is hot | `butter on while it is hot` | **1** |
| 3 | condensed milk poured over in lines, cut in two | `condensed milk over, cut in two` | **1** |
| 4 | *prose row below the table* — peanut butter in place of the butter is 奶醬多; a board prints each spread as its own row | — | 0 |

Rows: thick-cut white bread · salted butter · sweetened condensed milk. **3 rows × 4 cols.**
Under the aim, and the ticket says so itself.

**`sweetened condensed milk`, not `condensed milk`, and not near `evaporated milk`.** This is the
only file in the ticket carrying condensed milk, and T-007-05's AC turns on the two tins
resolving to different aisle patterns. Both names already exist in `aisles.json`; the ingredient
row is spelled to match the existing `ca-phe-sua-da` row exactly.

---

## Ordering of the work

1. `hong-kong-milk-tea` — everything sourced hangs off it, and `yuenyeung` cannot be checked
   until it exists (`pairs-with` is a build error when it dangles).
2. `yuenyeung`.
3. The other four drinks, in any order.
4. The two toasts.
5. `npm run check` over the whole collection, then `npm run verify`.

Each numbered group is one `lisa commit-ticket` with exact `--include` paths.

## What T-007-05 is being handed

Written up in full in `progress.md` and `review.md`; listed here so the blueprint is complete.

- **菠蘿油 is not a file.** Recommended section note on the borrowed `pineapple-bun` in *Toast
  and the bun case*, ≤120 characters:
  `Split warm around a cold slab of butter it is 菠蘿油, bo lo yau — the same bun, nothing added.`
- **Section placement.** *The drinks counter*: `hong-kong-milk-tea`, `yuenyeung`,
  `iced-lemon-tea`, `lemon-coke-with-ginger`, `horlicks`, `red-bean-ice`. *Toast and the bun
  case*: `hong-kong-french-toast`, `thick-toast`, plus the borrowed `pineapple-bun` and
  `egg-custard-tart`.
- **New ingredient names needing an aisle:** `Ceylon tea bags`, `loose-leaf Ceylon black tea`,
  `malted milk powder` (already matched), `golden syrup`, `rock sugar`, `cola`, `crushed ice`,
  `sugar syrup`, `Hong Kong milk tea` (a component row, like `onion-tomato masala`).
- **`docs/gaps/cha-chaan-teng.md` says "No source states a ratio" for the blend.** One does.
- **檸樂煲薑 is in the ticket and not on the ranked work list.**
