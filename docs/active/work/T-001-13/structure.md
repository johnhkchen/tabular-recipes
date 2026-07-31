# T-001-13 — Structure

Twenty-two new `.cook` files, one new folder, nothing else. No file in the repository is
modified or deleted.

---

## 1. Files created

### New folder — `recipes/vegetables-and-sides/`

`>> category: Vegetables & Sides`. Five files. Opened for the reason in `design.md` §2:
the collection has no home for a plain cooked vegetable, and the vegetable list is what
this counter is short of.

| File | Title | Servings | Shape of the table |
| --- | --- | --: | --- |
| `candied-yams.cook` | Candied Yams | 8 | glaze reduced → sweet potatoes tossed → baked, basted once |
| `cornbread-dressing.cook` | Corn Bread Dressing | 10 | crumbs dried → trinity sweated → bound with stock and egg → baked |
| `green-beans.cook` | Green Beans | 8 | pot broth → beans in → stewed soft |
| `stewed-squash.cook` | Stewed Squash | 6 | onion sweated → squash in → stewed down → finished |
| `creamed-corn.cook` | Creamed Corn | 6 | cobs milked → corn in butter → thickened → simmered |

### `recipes/stews-and-braises/` — 5 files

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `collard-greens.cook` | Collard Greens | 8 | Consumes `ham-hock-stock`. Closing full-width row is the pot likker. |
| `smothered-pork-chops.cook` | Smothered Pork Chops | 4 | Consumes `onion-gravy`. The one "smothered" dish, per the gap doc. |
| `baked-turkey-wings.cook` | Baked Turkey Wings | 4 | Roasted, then finished in `onion-gravy`. |
| `oxtails.cook` | Ox Tails | 6 | Browned, then a three-hour braise. |
| `meatloaf.cook` | Meatloaf | 8 | Baked. Filed here on the `char-siu` / `siu-yuk` precedent — this folder already holds oven-roasted meats. |

### `recipes/fried-and-crispy/` — 3 files

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `fried-chicken.cook` | Fried Chicken | 6 | Buttermilk brine and seasoned dredge are steps, not files. |
| `country-fried-steak.cook` | Country Fried Steak | 4 | Consumes `cream-gravy`. |
| `fried-okra.cook` | Fried Okra | 6 | Cornmeal dredge, shallow fry. |

### `recipes/rice-beans-and-grains/` — 2 files

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `black-eyed-peas.cook` | Black-Eyed Peas | 8 | Consumes `ham-hock-stock`. Sits beside `hoppin-john`. |
| `butter-beans.cook` | Butter Beans | 8 | Consumes `ham-hock-stock`. |

### `recipes/sauces-and-gravies/` — 2 files

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `onion-gravy.cook` | Onion Gravy | 6 | The method word of the room, written once. |
| `cream-gravy.cook` | Cream Gravy | 6 | The plain white one. Explicitly not `sausage-gravy`. |

### `recipes/soups/` — 1 file

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `ham-hock-stock.cook` | Ham Hock Stock | 12 (as a pot) | Filed with the other stocks — `pho-broth`, `chintan-broth`, `tonkotsu-broth`, `dashi`. |

### `recipes/noodles/` — 1 file

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `macaroni-and-cheese.cook` | Macaroni and Cheese | 8 | Baked, custard-bound. The vegetable that is not a vegetable. |

### `recipes/custards-and-puddings/` — 2 files

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `peach-cobbler.cook` | Peach Cobbler | 8 | Dropped biscuit topping. Beside `bread-pudding`, which is the same kind of spoon dessert baked in a dish. |
| `sweet-potato-pie.cook` | Sweet Potato Pie | 8 | Pairs with `all-butter-pie-crust`, which exists and already names this counter. |

### `recipes/dressings-and-dips/` — 1 file

| File | Title | Servings | Notes |
| --- | --- | --: | --- |
| `potato-salad.cook` | Potato Salad | 8 | Item 18 on the list, pulled forward one place only because `coleslaw` and `deviled eggs` sit with it and `coleslaw` is already written; see `plan.md` for the ordering note. |

*(If the count is already met when this file is reached it is still written — it costs one
file and completes the cold end of the line beside the slaw that is already there.)*

---

## 2. Metadata contract, applied to all 22

Every file carries, in this order:

```
>> title:        Menu case. "Ox Tails", not "oxtails".
>> category:     The folder's display name, spelled as the existing files spell it.
>> tags:         5-6, lowercase, drawn from vocabulary already in the collection.
>> counters:     Meat and Three          (alone, except where the dish is genuinely two counters')
>> aka:          Menu words from docs/knowledge/counters.md, plus a diacritic-free form.
>> servings:     A number the quantities are actually for.
>> time:         A plain sum — "3 hr 30 min". Never a range; authorMinutesOf() reads null on one.
>> pairs-with:   Slugs that exist. One-sided is fine; parse-recipes.mjs makes it mutual.
>> step.N:       An override wherever the derived label would read as a fragment.
```

**Counter assignment.** Twenty of the twenty-two name `Meat and Three` alone. Two name a
second counter, because the dish is plainly sold at both and the collection already does
this (`skillet-cornbread` names three):

- `fried-chicken` → `Meat and Three, Diner` — it is a diner plate as much as a cafeteria one.
- `potato-salad` → `Meat and Three, Smokehouse, Deli` — it sits beside `coleslaw`, which
  already names those three.

That leaves **32 exclusive** files against a floor of 14, and **50 shelved** against 30.

---

## 3. The dependency graph inside this ticket

Three components and their consumers. This is a `pairs-with` graph, not a build
dependency — each file stands alone as a table.

```
ham-hock-stock ──┬── collard-greens
                 ├── green-beans
                 ├── black-eyed-peas
                 └── butter-beans

onion-gravy ─────┬── smothered-pork-chops
                 └── baked-turkey-wings

cream-gravy ─────┬── country-fried-steak
                 └── meatloaf
```

`pairs-with` also reaches out to files that already exist and are not touched:
`skillet-cornbread` (from `collard-greens`, `cornbread-dressing`, `green-beans`),
`all-butter-pie-crust` (from `sweet-potato-pie`), `cheese-grits`, `hoppin-john`,
`coleslaw`. `parse-recipes.mjs` mutualises those at build time, so no existing file is
edited.

---

## 4. The shape of one file, and why

`collard-greens.cook`, as the worked example. Every other file is the same skeleton.

```
>> title: Collard Greens
>> category: Stews & Braises
>> tags: greens, southern, pork, stewed, side
>> counters: Meat and Three
>> aka: greens, turnip greens, mustard greens, mixed greens, collards, pot likker
>> servings: 8
>> time: 2 hr 30 min
>> pairs-with: ham-hock-stock, skillet-cornbread, hot-water-cornbread
>> step.N: <verb-first override where needed>

Trim <greens>, wash them in <water> ...          <- op, col 2
Render <bacon> ... in a <pot>                    <- op, col 2
Sweat <onion> ... with <&(~1)pork fat>           <- op, col 3
Stew <&(~1)base> with <stock> ~stew{2%hr}        <- op, col 4  (root)
The liquid left in the pot is pot likker ...     <- no ingredients: full-width footer row
```

Four invariants the skeleton is holding:

1. **One root.** Every branch flows into the final stew step through an `@&(~n)` reference.
2. **One consumer per step.** No step is referenced twice.
3. **`colCount >= 3`** — the chain is at least three operations deep.
4. **`rowCount >= 3`** — every file has well over three ingredients.

The pot-likker line is a paragraph with no `@ingredient` and no `@&()` reference, so
`buildTree` files it as a footer rather than an operation. That is how one preparation
says it yields two things without asking the table to branch, which it cannot.

---

## 5. Ordering of the work

Components before consumers, so a `pairs-with` never points at a slug that is not there
yet. Within that, the ranked order of `docs/gaps/meat-and-three.md`.

1. `ham-hock-stock` — four consumers wait on it
2. `collard-greens` (item 2)
3. `fried-chicken` (item 3)
4. `macaroni-and-cheese` (item 4)
5. `candied-yams` (item 5)
6. `onion-gravy`, `smothered-pork-chops` (item 6)
7. `cornbread-dressing` (item 7)
8. `baked-turkey-wings`, `oxtails` (item 8)
9. `green-beans`, `fried-okra`, `stewed-squash`, `black-eyed-peas`, `butter-beans`,
   `creamed-corn` (item 9)
10. `cream-gravy`, `meatloaf`, `country-fried-steak` (item 10)
11. `peach-cobbler`, `sweet-potato-pie` (item 11)
12. `potato-salad` (item 18, the cold end)

---

## 6. Files explicitly NOT created

| Not written | Why |
| --- | --- |
| `cornbread` | `recipes/cakes-and-loaves/skillet-cornbread.cook` already exists and already names this counter. The gap doc is stale on its own headline item. |
| `hot-water-cornbread`, `banana-pudding`, `coleslaw`, pie shell | Same — all four exist and all four already name this counter. |
| `smothered-chicken` | The gap doc's own instruction: write the onion gravy once and one smothered dish properly. |
| `pot-likker` | One pot, two products. The build refuses a step with two consumers; it is a footer row on `collard-greens`. |
| `sweet-potato-souffle` | The mashed version of candied yams. One plain way per dish; it goes in `aka`. |
| `deviled-eggs` | Item 18's third member. Reached only after the cold end; left for the next pass with the rest of items 12–20. |
| Items 13–17, 19, 20 — red beans, gumbo, étouffée, po-boy, boudin, cracklins, maque choux, chitterlings, gumbo z'herbes, sweet tea | The Louisiana half of the board, which needs a dark roux and a New Orleans French bread first. See `design.md` §1. |
| Anything in `src/`, `docs/gaps/`, `src/data/counters.json` | Not this ticket's. Menu sections and shopping aisles are T-001-17's. |
