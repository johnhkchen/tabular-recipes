# T-001-13 — Design

Three decisions matter here: **how far down the ranked list to go**, **where a cooked
vegetable lives**, and **how much of the counter is written as components versus dishes**.
Everything else follows from the file format.

---

## Decision 1 — How far down the list

### The options

**A. Clear the floor and stop (4 files).** Items 2–5 of the ranked list — collard greens,
fried chicken, macaroni and cheese, candied yams — take the counter to 32 shelved / 14
exclusive. Literally satisfies both counted criteria and the "in that order" criterion.

**B. Work the list to the bottom (~35 files).** Everything through sweet tea, including
gumbo, étouffée, the po-boy and its French bread, boudin, cracklins, chitterlings.

**C. Work down to the end of item 11 (22 files).** The whole meat list, the whole
vegetable list, the gravy the room is named after, and the three desserts the reference
names for this counter. Stops before the Louisiana plate-lunch half of the board.

### Chosen: C

Option A passes the gate and leaves the counter still broken in the way the gap doc
describes. Its complaint is not a count — it is that "the vegetable list, which on a real
board is nine or ten lines and is where three of your four choices come from, has six
entries and none of them is a green." Four files does not fix that; six vegetables and a
smoked pork pot do. The sibling ticket T-001-09 (Curry House) had a floor of 22/20, started
at 15, and shipped 47 — the house practice is plainly to work the list rather than the
number.

Option B is the wrong shape rather than too much work. Items 13–17 are the **Louisiana
plate lunch**, which `docs/knowledge/counters.md` records as a *second* vocabulary sharing
this room. It rests on two components this collection does not have and that are large in
their own right: a dark roux stirred forty-five minutes, and New Orleans French bread. A
gumbo written without the roux is "a shortcut wearing its name", which criterion 6 forbids
outright. Starting that half properly is a ticket, not a tail.

Option C is the cut the list itself makes. Items 1–11 are the cafeteria line: cornbread,
greens, the meat list, the vegetable list, the gravy, the desserts. Item 12 is already
written. Item 13 opens Louisiana. The line falls exactly where the food changes.

**Result: 50 shelved, 32 exclusive**, against a floor of 30 and 14.

---

## Decision 2 — Where a cooked vegetable lives

The vegetable list is six of the twenty-two files and there is no folder for it.

**Rejected — spread them across existing folders.** Collard greens and green beans could
be argued into `stews-and-braises`; candied yams into `cakes-and-loaves` because they are
baked and sweet; creamed corn into `soups` because it is wet. Each of those is an argument
rather than a fact, and the result is that the vegetable list — the thing this counter is
short of — cannot be seen anywhere in the tree. It also puts a dish of baked sweet potato
next to `victoria-sponge`, which is worse than having nowhere to put it.

**Rejected — one folder per method** (`baked-sides`, `braised-sides`). Splits five files
into three folders to preserve a purity the collection does not have: `Salads`,
`Dressings & Dips`, `Toppings & Pickles` and `Spice Blends & Marinades` are all sorted by
what the thing is *for*, not by what heat it saw.

**Chosen — open `recipes/vegetables-and-sides/`, category `Vegetables & Sides`.**
Five files: `candied-yams`, `cornbread-dressing`, `green-beans`, `stewed-squash`,
`creamed-corn`. The precedent is `fried-and-crispy`, opened with one file in it by an
earlier counter ticket, and `drinks`, still holding one. Nothing in `src/` needs to know:
`aisles.json` keys off ingredient names, not categories, and `counters.json`'s `categories`
list is a fallback only — every file here names its counter outright, so the fallback is
never consulted.

Two vegetables still land elsewhere, and should: `fried-okra` is deep-fried
(`fried-and-crispy`, beside `karaage`) and `black-eyed-peas` and `butter-beans` are dried
beans in a pot (`rice-beans-and-grains`, beside `hoppin-john` and `boston-baked-beans`).
Sorting those by menu section instead of by form would be the same mistake in the other
direction.

---

## Decision 3 — Which components get their own file

The gap doc lists thirteen wanted components. Writing all of them produces the exact
failure `docs/gaps/README.md` names for the collection as a whole: "the rub is written and
the meat is not". Writing none of them duplicates the same forty lines across six files.

The test applied: **a component earns a file when more than one dish here uses it, or when
it is what the menu actually sells.** Otherwise it is a step inside the dish.

| Component | Verdict | Why |
| --- | --- | --- |
| Smoked pork pot / ham hock stock | **Own file** — `ham-hock-stock` | The gap doc's own "highest-leverage missing component": greens, green beans, black-eyed peas and butter beans all come out of one pot. Four consumers here. |
| Onion gravy | **Own file** — `onion-gravy` | The doc says outright: "Write the onion gravy once and one smothered dish properly." Used by the chops and by the turkey wings. |
| Cream gravy | **Own file** — `cream-gravy` | The doc records that `sausage-gravy` "is close and is not the same". Country fried steak is not the dish without it; meatloaf takes it too. |
| Buttermilk brine + seasoned dredge | **In the dish** | One brine, one dredge, and the fried chicken *is* the brine and the dredge. Splitting it into three files makes the headline dish a stub. Country fried steak repeats the dredge in its own words — four lines, not a dependency. |
| Candied yam glaze | **In the dish** | One consumer. It is two steps of `candied-yams`. |
| Cobbler topping | **In the dish** | One consumer, and the doc says "either" a dropped biscuit or a batter — so it is a choice inside the recipe, not a shared part. |
| Vanilla custard and wafers | **Already written** | `banana-pudding` exists and is the only consumer. |
| Cornbread batter | **Already written** | `skillet-cornbread`, hot skillet and all. `cornbread-dressing` pairs with it rather than re-deriving it. |
| Pie shell | **Already written** | `all-butter-pie-crust`, and it already names this counter. `sweet-potato-pie` pairs with it. |
| Dark roux · trinity · New Orleans French bread · debris gravy · boudin filling | **Out of scope** | They belong to the Louisiana half — see Decision 1. |

Three component files, nineteen dishes. The counter reads as a board.

---

## Decision 4 — What the gap doc rules out, honoured rather than worked around

- **Smothered chicken is deliberately not written.** "What it could not stock" says the
  word runs across six proteins and that a table holding all six "would be splitting the
  gravy" — write the gravy once and one smothered dish properly. `onion-gravy` +
  `smothered-pork-chops` is that instruction carried out. Writing `smothered-chicken` as
  well would be ignoring the doc while citing it.
- **Pot likker is not a second file.** One pot yields greens and pot likker, and the build
  refuses a step with two consumers. It is written into `collard-greens` as a closing
  full-width row that says what the liquid in the pot is and what to do with it.
- **Sweet potato soufflé is not a second file.** `collection.test.ts` allows one plain way
  to cook a dish; the mashed-and-baked version is the same dish and would need a `kit:`
  line, which is for equipment. It goes in `aka` on `candied-yams`, which is where the
  reference puts it.
- **The rotating list, the steam table and "vegetable as a category"** are facts about the
  board. Nothing here tries to encode them.

---

## Decision 5 — Writing style, forced by the tests

Not a preference — three collection-wide tests decide most of it.

1. **Every step opens with a verb `icons.ts` already knows**, because `icons.test.ts`
   fails on any leading verb that falls through to the plain bowl and this ticket cannot
   touch `src/`. Verified against `VERB_ICONS` before writing: render, sweat, simmer,
   stew, braise, boil, brown, sear, fry, bake, roast, whisk, beat, stir, fold, mash,
   dredge, drain, rinse, season, pour, spread, layer, crumble, cream, toss, chill, rest,
   soak, trim, slice, chop, cut, arrange, fill, finish, top, add.
2. **Every timer is named**, per criterion 5, and the name is chosen so
   `time.ts` reads the attention correctly: `~stew`, `~braise`, `~bake`, `~simmer`,
   `~soak`, `~brine`, `~chill`, `~rest` for time you can leave; `~fry`, `~stir`, `~brown`,
   `~sear`, `~whisk`, `~toss` for time you cannot. No hands-on timer reaches four hours.
3. **Every step gets a `>> step.N:` override** unless the derived label already reads as a
   cook's verb. This is what criterion 3 is asking for, and `hoppin-john.cook` — a file
   already at this counter — is the model: `render · sweat 8 min · simmer covered 50 min ·
   cook covered 20 min · finish`.

`aka` carries the menu words from `docs/knowledge/counters.md`, including a
diacritic-free form wherever a name has one (`étouffée`/`etouffee` is not in scope, but
`sauté`, `soufflé` and `po' boy` shapes are, so the rule is applied throughout).

---

## What this does not decide

- **Menu sections and shopping aisles.** `src/data/counters.json` prints the board and
  `src/data/aisles.json` sorts the shop. Both are T-001-17's. New files simply appear
  under their counter until that ticket arranges them.
- **Whether `beef-bourguignon`, `coq-au-vin`, `chicken-adobo` and `jollof-rice` belong
  here.** The gap doc asks for "a maintainer's second look". That is a re-classification
  of files this ticket does not own; it belongs to T-001-18 and is recorded there.
