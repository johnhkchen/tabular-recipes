# T-001-05 — Review

The Smokehouse had seven recipes and nothing that had been in smoke. It now has **21, of which 14
name it and no other counter**, and eight of those came out of a pit. Fourteen files created,
none modified, none deleted, nothing outside `recipes/` touched.

## What changed

New folder `recipes/smoked-and-grilled/` — category **Smoked & Grilled**, the collection's first
home for meat cookery. Nothing else in the tree fitted: `stews-and-braises` has already absorbed a
roast and an oven confit for want of anywhere better, and none of these is stewed or braised.

| File | Gap | Commit |
| --- | --- | --- |
| `recipes/smoked-and-grilled/chopped-pork.cook` | 1, and 16 folded in | `a494d49` |
| `recipes/smoked-and-grilled/smoked-brisket.cook` | 2 | `5a43627` |
| `recipes/smoked-and-grilled/smoked-pork-ribs.cook` | 3 | `a494d49` |
| `recipes/smoked-and-grilled/burnt-ends.cook` | 4 | `5a43627` |
| `recipes/smoked-and-grilled/rib-tips.cook` | 13 | `a494d49` |
| `recipes/smoked-and-grilled/smoked-chicken.cook` | 10 | `5cbe59f` |
| `recipes/smoked-and-grilled/smoked-turkey-breast.cook` | 10 | `5cbe59f` |
| `recipes/smoked-and-grilled/smoked-bologna.cook` | 11 | `5cbe59f` |
| `recipes/sauces-and-gravies/barbecue-dip.cook` | 5 | `9d446d6` |
| `recipes/dressings-and-dips/barbecue-slaw.cook` | 6 | `9d446d6` |
| `recipes/dressings-and-dips/coleslaw.cook` | 6 | `9d446d6` |
| `recipes/flatbreads-and-pancakes/hush-puppies.cook` | 7 | `f59fe71` |
| `recipes/stews-and-braises/brunswick-stew.cook` | 12 | `f59fe71` |
| `recipes/custards-and-puddings/banana-pudding.cook` | 8 | `f59fe71` |

A sixth commit, `c39ad8e`, changed label overrides in eight of them and one ingredient name — see
*Deviation* in `progress.md`.

Twelve of the fourteen name Smokehouse alone. `coleslaw` also names Deli and Meat and Three
(`docs/gaps/deli.md:41`, `docs/gaps/meat-and-three.md:62` both ask for it); `banana-pudding` also
names Diner and Meat and Three, which is the gap doc's own sentence — *"the one dessert the
Smokehouse, the Diner and Meat and Three all share"*.

## Acceptance criteria

| Criterion | State |
| --- | --- |
| Smokehouse shelves ≥16 recipes | **met — 21** |
| ≥10 name it and no other counter | **met — 14** |
| Gap list written top down, skips named with reasons | **met** — items 1–13 written, 14–18 and the skip at 9 accounted for in `progress.md` |
| `check-recipes --labels` ok for every new file, labels read as a cook's verbs | **met** — output below |
| `title`, `category`, `tags`, `servings`, `counters`, and `aka` where ordered by another name | **met** — all fourteen carry all six |
| Every timer named | **met** — 37 timers, 37 named; `grep '~{'` over the fourteen returns nothing |
| Quantities real for the servings, method canonical | **met to the limit of what can be checked** — see *Open concerns* |
| Only `recipes/**` modified | **met** — `git status` shows this ticket touched nothing else |

Counts measured, not asserted: a script over `normalise()` across all 312 files reports
`Smokehouse: 21 recipes, 14 naming it and no other`, no duplicate slugs, no dangling pairing from
these files, no unnamed timer, no missing `aka`/`servings`/`tags`.

```
$ node scripts/check-recipes.mjs --labels <the fourteen>
  ok   recipes/smoked-and-grilled/chopped-pork.cook  13 rows x 5 cols
       [ Bring the smoker to 250°F (120°C) over hickory or oak and hold it there ]
       coat and rub
       stir a spritz
         smoke 250°F (120°C) 7 hr, to 165°F (74°C)
           wrap, back in 4 hr, to 203°F (95°C)
             rest 1 hr, off the bone, chop
  ok   recipes/smoked-and-grilled/smoked-brisket.cook  7 rows x 5 cols
       [ Bring the smoker to 250°F (120°C) over post oak and hold it there ]
       trim to a 1/4-in fat cap, season
       stir a spritz
         smoke 250°F (120°C) 8 hr, to 165°F (74°C)
           wrap, back in 4 hr, to 203°F (95°C)
             rest 2 hr, slice pencil-thick
  ok   recipes/smoked-and-grilled/smoked-pork-ribs.cook  13 rows x 5 cols
       trim the membrane, rub / smoke 3 hr / wrap, back in 2 hr /
       glaze for wet, dust for dry, set 45 min
  ok   recipes/smoked-and-grilled/burnt-ends.cook  7 rows x 5 cols
       season / smoke 8 hr, to 195°F / cut in 1-in cubes, toss / smoke 2 hr, until the edges candy
  ok   recipes/smoked-and-grilled/rib-tips.cook  10 rows x 5 cols
  ok   recipes/smoked-and-grilled/smoked-chicken.cook  9 rows x 5 cols
  ok   recipes/smoked-and-grilled/smoked-turkey-breast.cook  6 rows x 5 cols
  ok   recipes/smoked-and-grilled/smoked-bologna.cook  9 rows x 4 cols
  ok   recipes/sauces-and-gravies/barbecue-dip.cook  9 rows x 5 cols
  ok   recipes/dressings-and-dips/barbecue-slaw.cook  8 rows x 4 cols
  ok   recipes/dressings-and-dips/coleslaw.cook  10 rows x 4 cols
  ok   recipes/flatbreads-and-pancakes/hush-puppies.cook  11 rows x 5 cols
  ok   recipes/stews-and-braises/brunswick-stew.cook  15 rows x 6 cols
  ok   recipes/custards-and-puddings/banana-pudding.cook  9 rows x 6 cols

all 14 file(s) draw a table.
```

(Middle staircases elided for length; every one was read, and unit 6 exists because of that
reading.)

## Test coverage

There are no unit tests to add. This ticket adds data, and the collection's own suites are the
tests for data: `collection.test.ts` (unique slugs, mutual pairings, every recipe at a counter, no
timer claiming four unbroken hands-on hours), `layout.test.ts` (every table tiles with no holes),
`shopping.test.ts`, `icons.test.ts`, `schedule.test.ts`, `units.test.ts`. All of them run over
these fourteen files.

`npm run verify` currently reports **4 failed test files, 460 tests passing**. None of the four
fails because of this ticket, and each was traced rather than assumed:

| Failing test | Cause | Whose |
| --- | --- | --- |
| `icons.test.ts` — every leading verb has an icon | 14 verbs fall through: `bowl, bruise, build, crack, dress, firm, load, pile, plate, return, ribbon, serve, slide, velvet` | none from this ticket — nine of mine were rewritten in `c39ad8e` for exactly this reason |
| `schedule.test.ts` — the three longest are the ferments | `crema-mexicana` (24 hr culture, written by T-001-01) displaced `pizza-dough` from third | T-001-01. This ticket's longest chain is the brisket at 14 hr, nowhere near |
| `shopping.test.ts` — under 2% of ingredients without an aisle | 20 of 657 (3.0%). Two are mine: `barbecue sauce` (×5) and `vanilla wafers` (×1) | shared. Removing mine leaves 18/657 = 2.7%, still over — the threshold is crossed without this ticket, and the fix is `src/data/aisles.json`, which is T-001-17's |
| `units.test.ts` — every ingredient total adds up | ingredients written with no quantity at all (`{value: null, unit: null}`) in `cha-lua`, `cha-gio`, `goi-cuon`, `pho-bo`, `pho-broth` | T-001-02, in flight. Every water quantity in this ticket's files is a real number |

`npm run verify` also failed outright for a while during this work — T-001-02's `nuoc-cham.cook`
pointed at three recipes it had not written yet. That resolved on its own when they landed. The
four failures above are what remains.

## Open concerns

1. **Nothing automated can check that a recipe is correct cooking.** A brisket smoked at the wrong
   temperature for the wrong time draws exactly the same table as a right one. The defence here is
   sourcing — method and vocabulary from `docs/knowledge/counters.md` §Smokehouse and
   `docs/gaps/smokehouse.md`, quantities scaled to the stated servings by hand — and a human
   reader. This is the one thing in the ticket a reviewer has to actually judge.
2. **Everything is written for a smoker, and says so.** Each pit file opens with a full-width row
   naming `#smoker{}`, the temperature and the wood, which is the gap doc's instruction that a
   recipe *"written for an oven … is a different piece of meat; the file should say which"*. No
   oven variant is written. `dish`/`kit` is the mechanism if anyone wants one, and a `kit:` line
   must mean *the variant exists and is written* — so none was claimed.
3. **Seventeen of the Smokehouse's 21 recipes currently print under "Also".** The menu's four
   sections in `src/data/counters.json` predate all of this. Nothing is lost — `menuFor()` sweeps
   unplaced recipes into a trailing section — but the menu reads as a list until T-001-17 places
   them. A suggested section layout is in `progress.md`.
4. **Two new ingredient names have no shopping aisle** (`barbecue sauce`, `vanilla wafers`), which
   is the one measurable way this ticket makes an existing test worse, and the file that fixes it
   is not this ticket's. Recorded for T-001-17.
5. **`coleslaw` and `banana-pudding` are claimed early.** Both sit on Deli, Diner or Meat and Three
   gap lists as well. Writing them once here is the modelling the README asks for, but T-001-13,
   T-001-14 and T-001-15 will find them already written and should record a no-op rather than a
   second file under another name — which is exactly the duplicate T-001-18 exists to catch.
6. **Gap items 14, 15, 17 and 18 are unwritten** — the side list, sausage, the rest of the dessert
   list, sweet tea. Reasons per item in `progress.md`. The one worth a second look is collard
   greens and pit beans: both want a **smoked pork stock** that Meat and Three needs too, and that
   is a shared component, not a Smokehouse file.

## What a reviewer should look at first

The three files where the cooking is most easily got wrong and least easily checked:
`smoked-brisket.cook` (salt and pepper only, wrap at 165°F, pull at 203°F, two-hour rest),
`chopped-pork.cook` (the chop keeps the outside brown in — that is gap item 16 living inside gap
item 1), and `barbecue-dip.cook` (it must not read as a second `barbecue-sauce`; it is vinegar-led,
thin, and rested overnight rather than simmered down).
