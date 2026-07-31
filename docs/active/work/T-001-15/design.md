# T-001-15 — Design

Decisions, and what they were chosen over. Everything here rests on `research.md`.

## Decision 1 — How far down the gap list to go

**Chosen: walk the ranked list from the top until both empty printed sections are stocked and
the ranked items above rank 13 are either written or explained. 24 new files.**

The counters are a floor, not a target: 46 shelved / 17 exclusive today, 49 / 20 required.
Three files would satisfy the arithmetic.

| Option | Files | Result |
| --- | --- | --- |
| A — minimum arithmetic | 3–4 | passes; breakfast still has three items and no sandwich page |
| **B — down to rank 13** | **24** | **both empty sections stocked; ranks 1–13 resolved** |
| C — the whole list plus components | ~34 | includes items the gap doc itself says a table cannot hold |

Option A is rejected on the ticket's own framing: *"45 recipes, 17 of them its own — the rest
are borrowed, which is legitimate but does not make a menu"*, and *"Breakfast all day, and
sandwiches and burgers, are both printed sections with nothing in them."* Filling one line of
breakfast satisfies the counter and not the sentence. Acceptance criterion 2 sets the order —
top of the list first — and the count only decides where to stop, so stopping at three would
leave the second criterion technically met and the ticket's purpose unmet.

Option C is rejected because the last ranks are the arrangements and the packet desserts (hot
beef commercial, banana split, Jell-O, two eggs any style), and four of them are named in the
gap doc's own *What it could not stock*. Writing them would be inventing dishes to hit a number.

Rank 13 is the natural stop: it is the entire sandwich page, and everything above it is
breakfast. Ranks 14–20 are covered below, item by item, with a reason.

## Decision 2 — What is skipped, and why

Every skip is either below the table floor, claimed by a sibling ticket, or named in the gap
doc as something a table cannot express.

| Gap item | Rank | Disposition |
| --- | --- | --- |
| Bacon | 6 | **Below the floor.** One ingredient, one operation: `rowCount 1, colCount 2`. Written into `home-fries` and `blt` as an ingredient instead. |
| Ham steak | 6 | **Below the floor.** Ham, fat, heat. Making it clear the floor requires red-eye gravy would be writing a different dish than the meat-choice line asks for. |
| Hot beef commercial | 11 | **Gap doc: could not stock.** *"three finished things arranged on a plate, and the arrangement is the item."* `pot-roast`, `mashed-potatoes` and white bread are each their own file after this ticket. |
| Chicken fried steak | 14 | **Sibling.** T-001-13 owns `fried-and-crispy/country-fried-steak.cook`. Recorded for T-001-18 to add `Diner` to its `counters:`. |
| Milk gravy | components | **Sibling.** T-001-13 owns `sauces-and-gravies/cream-gravy.cook`. Same T-001-18 note. |
| Meatloaf | 15 | **Sibling.** T-001-13 owns `stews-and-braises/meatloaf.cook`. Same T-001-18 note. |
| Brewed coffee | 17 | **Below the floor**, and the gap doc's own *bottomless coffee* note calls it an urn and a habit. Two ingredients, one operation. |
| Hot turkey sandwich | 18 | **Same arrangement as rank 11**, per `counters.md`: *"The same construction with turkey is a hot turkey sandwich."* |
| Jell-O | 19 | A packet, hot water and a mould. Below the floor and not a recipe. |
| Banana split | 19 | An arrangement of four files this ticket writes or already has (`french-vanilla-ice-cream`, `hot-fudge`, `whipped-cream`, a banana). |
| Two eggs any style | 20 | **Gap doc: could not stock**, at length. Six doneness words are six tables of two ingredients. |
| Blue plate special, breakfast all day, the flat-top, short stack, substitutions, bottomless coffee, the open-faced plate, buttered toast | — | The gap doc's own *could not stock* list, taken as written. |

Tuna noodle casserole (rank 18) is **not** skipped — it is a real dish with a real table, and it
is only its list-mate that is an arrangement.

## Decision 3 — The 24 files, and where each lives

No new category folder is created except one. Placement follows what the collection already
does, checked folder by folder.

**Breakfast — the empty section (ranks 1–9)**

| Slug | Folder | Why there |
| --- | --- | --- |
| `home-fries` | `fried-and-crispy` | browned potato; the folder already holds `batata-harra` |
| `hash-browns` | `fried-and-crispy` | the shredded cut, a separate printed line |
| `creamed-chipped-beef` | `sauces-and-gravies` | it is a gravy; `sausage-gravy` is its neighbour |
| `buttermilk-biscuits` | `breads` | a quick bread; `english-muffins` is there |
| `corned-beef-hash` | `fried-and-crispy` | pressed and crusted, not stewed |
| `french-toast` | `flatbreads-and-pancakes` | the griddle's third item, beside pancakes and waffles |
| `scrapple` | `fried-and-crispy` | simmered, set, then **sold fried**; the fry is the dish |
| `breakfast-sausage-patties` | `fried-and-crispy` | the meat-choice line that clears the floor |
| `pork-roll-egg-and-cheese` | `sandwiches-and-rolls` | it is a sandwich on a roll |
| `eggs-benedict` | **`eggs`** (new) | see Decision 4 |
| `western-omelette` | **`eggs`** (new) | see Decision 4 |

**Blue plates and the case (ranks 10, 12)**

| Slug | Folder | Why there |
| --- | --- | --- |
| `mashed-potatoes` | `vegetables-and-sides` | the folder T-001-13 is creating for exactly this |
| `apple-pie` | `custards-and-puddings` | where this site puts pies (`egg-custard-tart`, and T-001-13's `sweet-potato-pie`) |
| `tuna-noodle-casserole` | `noodles` | egg noodles, baked; `macaroni-and-cheese` is landing there |

**The sandwich page — the other empty section (rank 13)**

`smash-burger`, `patty-melt`, `club-sandwich`, `grilled-cheese`, `blt`, `tuna-melt` — all in
`sandwiches-and-rolls`, which holds four Vietnamese files and nothing else.

**The fryer and the fountain (ranks 16, 17)**

`french-fries`, `onion-rings` → `fried-and-crispy`. `milkshake`, `egg-cream` → `drinks`, which
holds one file.

**Components the menu leans on**

`whipped-cream` → `toppings-and-pickles`; `hot-fudge` → `sauces-and-gravies`. Both are named in
the gap doc's component list; both clear the floor; both are what the dessert case is made of.

## Decision 4 — A new `recipes/eggs/` folder

**Chosen: create it, for `eggs-benedict` and `western-omelette`.**

Rejected alternatives:

- `flatbreads-and-pancakes` — an omelette is not a flatbread, and the folder is the griddle's
  batters.
- `fried-and-crispy` — eggs benedict is poached and sauced; nothing about it is crisp.
- `sandwiches-and-rolls` for benedict, because it sits on a muffin — this is the open-faced
  fallacy the gap doc warns about; the dish is the egg and the hollandaise.
- `stir-fries`, where `egg-foo-young` sits — that is a Chinese-American dish in its own family.

The ticket explicitly allows it: *"a genuinely new kind of thing may take a new category and
folder."* A counter whose defining section is eggs, on a site with no egg category, is that
case. Two files is a thin folder; it is honest, and `pizzas` had four.

`>> category: Eggs` is stated in both files rather than left to the folder title-caser.

## Decision 5 — Which counters each file names

Exclusivity is a real signal, not a number to game: a file names a second counter only when a
person would genuinely buy it there.

- **Diner alone (17 new):** home-fries, hash-browns, creamed-chipped-beef, corned-beef-hash,
  french-toast, scrapple, breakfast-sausage-patties, pork-roll-egg-and-cheese, eggs-benedict,
  western-omelette, smash-burger, patty-melt, blt, onion-rings, milkshake, egg-cream,
  tuna-noodle-casserole. → **34 exclusive**, against a floor of 20.
- **Diner + Meat and Three:** `buttermilk-biscuits` (the gap doc's own note: the cobbler topping
  and the chicken biscuit want the same dough), `mashed-potatoes`, `french-fries`.
- **Diner + Deli:** `club-sandwich`, `tuna-melt`, `grilled-cheese` — all three are on a deli
  board as much as a diner one.
- **Diner + Bakery:** `apple-pie`, `whipped-cream`.
- **Diner + Bakery + Meat and Three:** `hot-fudge` sits at the Diner only — corrected: it names
  `Diner` alone. (Sundae sauce is fountain equipment, not a bakery item.)

New shelved total: **46 + 24 = 70**, exclusive **17 + 17 = 34**. Both criteria clear with room,
which is what a menu rather than an arithmetic pass looks like.

## Decision 6 — Pairings

`pairs-with` only to slugs present in the tree at the time of writing, because a dangling slug
passes `check-recipes` and breaks `npm run recipes` (research §5). That rules out pairing
`tuna-melt` with T-001-14's `tuna-salad` and `corned-beef-hash` with `corned-beef` unless the
file is on disk when the pairing is written — checked at commit time, and dropped if not.

Safe pairings, all present today: `sausage-gravy` ↔ `buttermilk-biscuits`; `hollandaise` ↔
`eggs-benedict`; `turkey-pan-gravy` and `pot-roast` ↔ `mashed-potatoes`;
`french-vanilla-ice-cream` ↔ `hot-fudge`, `apple-pie`, `milkshake`; `homemade-ketchup` ↔
`french-fries`, `home-fries`; `buttermilk-pancakes` ↔ `breakfast-sausage-patties`.

## Decision 7 — Method fidelity over shortcut

The criterion *"the method is the canonical one for the dish rather than a shortcut wearing its
name"* decides several arguments in advance:

- **Home fries** are boiled or steamed first, then browned — not raw diced potato fried for
  forty minutes.
- **Hash browns** are rinsed of starch and **wrung dry**; that is the whole difference between a
  crust and a grey pile.
- **Scrapple** is a real broth from pork shoulder and bones, thickened with cornmeal and
  buckwheat, set overnight, sliced thin, fried hard, and **not floured** — a floured slice is a
  cheat that hides a wet loaf.
- **Smash burger** is coarse grind, no binder, no seasoning in the mix, pressed once within 30
  seconds and never again.
- **French fries** are cut, soaked, blanched at 325°F, rested, and fried again at 375°F. The
  gap doc asks for exactly this ("a blanch-then-fry potato method").
- **Eggs benedict** is poached to order and the hollandaise is `hollandaise`, referenced as an
  ingredient rather than re-derived.
- **Apple pie** uses `all-butter-pie-crust` as an ingredient — the doc's "four counters unlock
  at once" is the point of that file existing.
- **Egg cream** contains neither egg nor cream, and the order — syrup, milk, then seltzer hard
  off a spoon — is the dish.

## Decision 8 — Timers

Every timer named, and named with a word `src/lib/time.ts` recognises (research §4).
`~fry`, `~simmer`, `~bake`, `~rest`, `~chill`, `~soak`, `~toast`, `~sear`, `~steam`, `~drain`,
`~set`, `~whip`, `~stand` cover everything in this ticket. No `~griddle`, no `~poach` as a
hands-on claim — `poach` is in the unattended set, which is correct for eggs sitting in barely
moving water and is used as such.
