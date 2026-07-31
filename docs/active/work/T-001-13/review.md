# T-001-13 — Review

**21 recipe files created. 1 created and then removed. 0 existing files modified. 0
deleted. One new category folder. Nothing outside `recipes/**`.**

The Meat and Three goes from **28 shelved / 10 exclusive** to **52 shelved / 30
exclusive**, against a floor of 30 and 14.

---

## What changed

Ten commits, each checked before it landed.

| Commit | What it added |
| --- | --- |
| `757a4c4` | `ham-hock-stock`, `collard-greens` |
| `1e67e5c` | `fried-chicken` |
| `d47c581` | `macaroni-and-cheese`, `candied-yams` |
| `606b040` | `onion-gravy`, `smothered-pork-chops` |
| `b286819` | `cornbread-dressing`, `baked-turkey-wings`, `oxtails` |
| `f1e6168` | `green-beans`, `fried-okra`, `stewed-squash`, `black-eyed-peas`, `butter-beans`, `creamed-corn` |
| `0935471` | `cream-gravy`, `country-fried-steak`, `meatloaf` |
| `1ca39ee` | `peach-cobbler`, `sweet-potato-pie`, *(`potato-salad`, withdrawn below)* |
| `5709f6a` | removed the duplicate `potato-salad` |
| `b145746` | renamed two ingredients so the shopping list finds the butcher |

By folder: 5 in `stews-and-braises/`, 5 in the new `vegetables-and-sides/`, 3 in
`fried-and-crispy/`, 2 in `rice-beans-and-grains/`, 2 in `sauces-and-gravies/`, 2 in
`custards-and-puddings/`, 1 in `soups/`, 1 in `noodles/`.

### One new folder — `recipes/vegetables-and-sides/`

The collection had 412 files and not one plain cooked vegetable: `salads` is raw,
`stews-and-braises` is meat, `rice-beans-and-grains` is starch. That is the one place the
existing folders did not reach, and it is exactly the part of the board the gap doc says
is thin. Precedent: `fried-and-crispy` and `drinks` were each opened with one file by an
earlier counter ticket. Nothing in `src/` needed to know — `aisles.json` keys off
ingredient names and `counters.json`'s `categories` list is a fallback only, which every
one of these files bypasses by naming its counter outright.

**It is already being used by a sibling ticket**: `mashed-potatoes.cook` (T-001-15) landed
in it during this run, which is some evidence the folder was the missing one rather than
a private convenience.

### The three things the gap doc actually complained about

1. **"There is no cornbread, and cornbread is what defines this counter."** The doc is
   stale — `skillet-cornbread` and `hot-water-cornbread` both exist and both already name
   this counter. Nothing was written for item 1 and nothing needed to be. Four more of its
   claims are stale the same way: banana pudding, coleslaw and the pie shell are all on
   the shelf and all already carry `Meat and Three`.
2. **"The vegetable list has six entries and none of them is a green."** It now has
   thirteen, and four of them are: collard greens, green beans, fried okra, stewed squash,
   creamed corn, candied yams, cornbread dressing, black-eyed peas and butter beans join
   the six that were there.
3. **"A smoked pork pot is the highest-leverage missing component — one table, six sides."**
   `ham-hock-stock` is written and four of the new sides take it as an ingredient row
   instead of re-deriving a pot of smoked pork each: `collard-greens`, `green-beans`,
   `black-eyed-peas`, `butter-beans`.

The doc's other named component gaps that were in scope are also closed: `onion-gravy` is
the method word of the room written once, and `cream-gravy` is the plain white one the doc
says `sausage-gravy` "is close and is not the same" as.

---

## The ranked list, item by item

Criterion 2 asks for this by name. Items are `docs/gaps/meat-and-three.md`'s numbering.

| # | Item | What happened |
| --: | --- | --- |
| 1 | Cornbread | **Already on the shelf** — `skillet-cornbread`, and it already names this counter. The doc is stale on its own headline item. |
| 2 | Collard greens, pot likker | **Written** — `collard-greens`. Pot likker is a closing full-width row on it, not a second file: one pot with two consumers is a shape `buildTree` refuses, and the doc itself lists it under "could not stock". |
| 3 | Fried chicken | **Written** — `fried-chicken`. Buttermilk brine and seasoned dredge are steps in it. |
| 4 | Macaroni and cheese | **Written** — `macaroni-and-cheese`, the custard-bound baked one. |
| 5 | Candied yams | **Written** — `candied-yams`. The sweet potato soufflé version is the same dish and is in `aka` plus a footer row, because `collection.test.ts` allows one plain way per dish. |
| 6 | Smothered pork chops **and** smothered chicken | **Half written on purpose** — `onion-gravy` + `smothered-pork-chops`. `smothered-chicken` is **deliberately not written**: the doc's own "could not stock" entry says the word names a method across six proteins and that a table holding all six "would be splitting the gravy — write the onion gravy once and one smothered dish properly". That instruction was followed rather than cited and ignored. |
| 7 | Corn bread dressing | **Written** — `cornbread-dressing`, with the everyday-not-once-a-year fact in its header row. |
| 8 | Baked turkey wings, oxtails | **Written** — both. |
| 9 | Green beans, fried okra, stewed squash, black-eyed peas, butter beans, creamed corn | **All six written.** |
| 10 | Meatloaf, country fried steak | **Written** — both, plus `cream-gravy` under them. |
| 11 | Banana pudding, peach cobbler, sweet potato pie | **Two written** — `peach-cobbler`, `sweet-potato-pie`. `banana-pudding` is already on the shelf and already names this counter. |
| 12 | Hot water cornbread | **Already on the shelf** — `hot-water-cornbread`, already names this counter. |
| 13–17 | Red beans and rice · gumbo · étouffée · po-boy and debris po-boy · boudin, cracklins, maque choux | **Not written.** These are the Louisiana plate lunch, which `docs/knowledge/counters.md` records as a second vocabulary sharing this room. Both anchors rest on components this collection does not have and that are substantial in their own right: a **dark roux** stirred forty-five minutes, and **New Orleans French bread**, which the doc says plainly the po-boy *is*. A gumbo written without the roux would be "a shortcut wearing its name", which criterion 6 forbids outright. Starting that half properly is a ticket, not a tail on this one. |
| 18 | Potato salad, coleslaw, deviled eggs | **`coleslaw` already on the shelf. `potato-salad` is on the shelf, written by T-001-14 — see below. `deviled-eggs` not written**, left with items 13–20 for the next pass. |
| 19 | Gumbo z'herbes | **Not written** — Louisiana, and it is gumbo with the roux problem plus a pot of greens. |
| 20 | Sweet tea | **Not written.** The doc's own "could not stock" section rules out sweet tea by the urn; the drink itself is item 20, below the line this ticket stopped at, and `drinks/` holding one file is a collection-wide gap rather than this counter's. |

**Where the line was drawn and why.** Items 1–11 are the cafeteria line — cornbread, the
greens, the meat list, the vegetable list, the gravy, the desserts. Item 13 opens
Louisiana. The stop falls exactly where the food changes, not where the count was met: the
count was met at item 5.

---

## The duplicate that had to be withdrawn

`recipes/dressings-and-dips/potato-salad.cook` was written and committed in `1ca39ee`.
`npm run recipes` then failed:

```
Error: two recipes share the slug "potato-salad" — that is the URL, so it has to be unique:
  recipes/dressings-and-dips/potato-salad.cook
  recipes/salads/potato-salad.cook
```

**T-001-14 (Deli) had already committed `recipes/salads/potato-salad.cook` in `5352a97`,
and its `counters:` line reads `Deli, Meat and Three`.** The dish was already shelved here,
in a better folder, by a ticket that owns it. Mine was deleted and the deletion committed
(`5709f6a`); `npm run recipes` passes again.

This is a **missing dependency edge**, and it is the honest name for it: item 18 of this
counter's list (potato salad, coleslaw, deviled eggs) is the cold end of the line, and the
same three items are the Deli's salad case. There is no edge between T-001-13 and T-001-14
in the DAG, and both tickets were live on the same branch at the same time. Flagged for
T-001-18 below.

---

## Test coverage

There is no unit test to write. This ticket adds data, not code, and every module that
reads it (`tree.ts`, `layout.ts`, `label.ts`, `time.ts`, `icons.ts`, `schedule.ts`,
`shopping.ts`) is untouched and already covered. The equivalent of a test suite for a
`.cook` file is `scripts/check-recipes.mjs`, which parses it, builds its merge tree, lays
out the grid and asserts that every cell tiles exactly once.

| Check | Command | Result |
| --- | --- | --- |
| each new file draws a table | `check-recipes.mjs --labels <21 exact paths>` | **all 21 file(s) draw a table**, 5–16 rows × 4–5 cols, no parser warnings |
| the whole collection still does | `node scripts/check-recipes.mjs` | **all 505 file(s) draw a table** |
| cross-file facts | `npm run recipes` | 505 recipes, 27 categories, 0 counters inferred, 0 dangling pairings |
| slugs unique | `ls recipes/*/*.cook \| xargs -n1 basename \| sort \| uniq -d` | empty |
| the site builds | `npx astro build` | **527 page(s) built**, including the six `Vegetables & Sides` pages |
| every timer named | `grep -n '~{'` over the 21 | no output |
| required metadata | `grep -L` for each of title/category/tags/servings/counters/aka/time/pairs-with | none missing on any of the 21 |
| shelved | `grep -rl "Meat and Three" recipes/ \| wc -l` | **52** |
| exclusive | `grep -h '^>> counters:'` over those, exact-matched | **30** (20 of the new files are exclusive; `fried-chicken` also names Diner) |
| label staircases | `--labels` on every batch | read at all ten steps; every cell is a verb, e.g. `render 8 min · sweat 6 min · stew covered 2 hr · season at the very end` |
| working tree | `git status --short recipes/` | nothing of this ticket's staged, modified or untracked |

### The label staircases, as printed

```
ham-hock-stock        rinse, into the pot → simmer bare 3 hr, skimmed → strain, pick the meat off the bone
collard-greens        trim the ribs out, wash in three waters · render 8 min → sweat 6 min → stew covered 2 hr → season at the very end
fried-chicken         cut into 8 pieces · whisk the dredge → brine 4 hr → dredge, then hydrate 15 min → fry 325°F, 8 min a side
macaroni-and-cheese   boil 7 min, drain short of done · whisk the custard → toss hot with butter and cheese → pour the custard over → bake 350°F 45 min
onion-gravy           brown the onions 25 min → stir the flour in 3 min → whisk in stock, simmer 12 min
smothered-pork-chops  season, both sides → dredge in flour → sear 8 min, both sides → braise covered 45 min
oxtails               season, both sides → brown 12 min, in batches → braise covered 325°F 3 hr → skim, then slake the starch in
meatloaf              soak the bread 10 min · sweat 8 min, then cool → mix by hand, lightly → shape into a loaf → glaze, bake 350°F 1 hr
```

### `npx vitest run` — 4 failed / 641 passed

**All four failures pre-date this ticket and none of them is this ticket's.** Recorded
before writing a single file, on the collection as it stood at 438 recipes:

| Test | Before this ticket | After |
| --- | --- | --- |
| `icons` → recognises every verb the recipes open an operation with | 54 verbs fall through (`balti`, `bhuna`, `palak`, `paneer`, `tonkotsu`, `tare`, `two`, `the` …) | 56 — the two added are `frizzle` and `notch`, both from T-001-15's diner files |
| `schedule` → the three longest are the three ferments | already failing | still failing |
| `schedule` → longest paths agree with their authors' claim | already failing | still failing |
| `shopping` → finds an aisle for nearly everything | 65/829 unplaced (7.8% vs a 2% gate) | 86/901 |

**Audited directly rather than asserted.** Of the 21 new files, **zero** contribute a
fall-through verb — every leading word of every step, header and footer rows included, was
checked against `matchOperation()`. Five of the 86 unaisled ingredient names are this
ticket's: `frying fat`, `day-old skillet cornbread`, `pie crust`, `poultry seasoning`,
`ketchup`. Two more were fixed rather than left (`oxtails` → `beef oxtails`, `cube steaks`
→ `beef cube steaks`, both of which now reach the butcher).

Those five were left alone deliberately. `aisles.json` sends "tomato ketchup" to **produce**
and "onion gravy" to **produce**, so bending an ingredient name until it matches a pattern
buys a wrong aisle rather than a right one. They are a gap in the aisle table, which is
`src/data/`, which this ticket may not touch.

Fixing all four failures is **T-001-18's** acceptance criterion (`npm run verify` passes
end to end), and three of the four need `src/` changes that are out of this ticket's reach.

---

## Hand-offs for T-001-18

Recorded here because T-001-18 reads every `docs/active/work/T-001-*/` artifact for them.

1. **No counter needs adding to an existing recipe.** Every dish on this counter's ranked
   list that already existed already named `Meat and Three`. There is no
   "add-a-counter" edit waiting from this ticket.
2. **A missing DAG edge, demonstrated.** T-001-13 and T-001-14 both tried to write
   `potato-salad`; the slug collision broke `npm run recipes` on the shared branch until
   this ticket withdrew its copy. `coleslaw` and `deviled-eggs` sit at the same seam. The
   Deli's `recipes/salads/potato-salad.cook` is the survivor and already carries both
   counters, so nothing needs merging — but the edge should exist.
3. **A new category exists: `Vegetables & Sides`** (`recipes/vegetables-and-sides/`,
   6 files now including T-001-15's `mashed-potatoes`). `src/data/counters.json` has no
   `categories` fallback entry for it, which is harmless because every file in it names
   its counter, but T-001-17 will want a menu section for it and `docs/gaps/README.md`'s
   category tally will need updating.
4. **Five ingredient names have no aisle** and belong in an `aisles.json` sweep:
   `frying fat`, `day-old skillet cornbread`, `pie crust`, `poultry seasoning`,
   `ketchup`. `ketchup` in particular is a mainstream item, and the near-match
   "tomato ketchup" resolves to *produce*, which looks like a real bug in the pattern
   table rather than a missing entry.
5. **Four recipes at this counter are still worth a maintainer's second look**, as the gap
   doc asks: `beef-bourguignon` and `coq-au-vin` are French bistro, `chicken-adobo` is
   Filipino, `jollof-rice` is West African, `haupia` is Hawaiian. Each is defensible as
   "one meat off a rotating list", and re-classifying them is an edit to files this ticket
   does not own.
6. **`banana-pudding`, `coleslaw`, `skillet-cornbread`, `hot-water-cornbread` and
   `all-butter-pie-crust` are stale entries in `docs/gaps/meat-and-three.md`** — listed as
   missing, actually on the shelf and already carrying this counter. The gap doc rewrite
   should drop them.

---

## Open concerns

- **The collection-wide test suite is red, and was before this started.** Nothing here
  makes it redder in kind — zero new fall-through verbs, five new unaisled ingredient
  names against 65 already there. But a reviewer looking at `npx vitest run` on this
  branch will see four failures and should not attribute them here. The baseline was
  captured before the first file was written and is quoted above.
- **`ketchup` reaching no aisle** is the one thing in this ticket's own files that reads
  as a defect rather than a deliberate choice, and it cannot be fixed from `recipes/**`.
- **Item 11's third dessert and item 18's third item** (`banana-pudding` already exists;
  `deviled-eggs` does not) are the only two places where this ticket stopped inside a
  numbered item rather than between two. `deviled-eggs` is named above with its reason.
- **`smothered-chicken` will look like an omission to anyone who reads the ranked list and
  not the "could not stock" section.** It is deliberate, the reason is the gap doc's own,
  and it is stated in three places in these artifacts so it is not mistaken for a gap.
