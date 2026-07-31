# T-001-07 — Review

The Dim Sum Counter had eleven recipes, three of them its own, and not one steamed item on it. It
now has **29, of which 20 name it and no other counter**, and the steamer, the fryer, the
roast-meat window and the noodle plate are all stocked. Eighteen files created, none modified,
none deleted; nothing outside `recipes/` touched.

## What changed

| File | Gap | Sole counter? | Commit |
| --- | --- | --- | --- |
| `recipes/dumplings-and-rolls/har-gow.cook` | 1 | yes | `568497e` |
| `recipes/dumplings-and-rolls/siu-mai.cook` | 2 | yes | `568497e` |
| `recipes/dumplings-and-rolls/char-siu-bao.cook` | 3 | yes | `568497e` |
| `recipes/custards-and-puddings/egg-custard-tart.cook` | 4 | no — also Bakery | `568497e` |
| `recipes/stews-and-braises/siu-yuk.cook` | 6 | yes | `0536b13` |
| `recipes/stews-and-braises/soy-sauce-chicken.cook` | 6 | yes | `0536b13` |
| `recipes/stews-and-braises/white-cut-chicken.cook` | 6 | yes | `0536b13` |
| `recipes/sauces-and-gravies/ginger-scallion-oil.cook` | 6 | yes | `0536b13` |
| `recipes/dumplings-and-rolls/cheung-fun.cook` | 7 | yes | `0643bce` |
| `recipes/flatbreads-and-pancakes/turnip-cake.cook` | 8 | yes | `0643bce` |
| `recipes/flatbreads-and-pancakes/taro-cake.cook` | 8 | yes | `0643bce` |
| `recipes/rice-beans-and-grains/lo-mai-gai.cook` | 9 | yes | `0643bce` |
| `recipes/dumplings-and-rolls/xiao-long-bao.cook` | 10 | yes | `0643bce` |
| `recipes/stews-and-braises/chicken-feet.cook` | 11 | yes | `0643bce` |
| `recipes/dumplings-and-rolls/wu-gok.cook` | 12 | yes | `963cb8e` |
| `recipes/dumplings-and-rolls/ham-sui-gok.cook` | 12 | yes | `963cb8e` |
| `recipes/dumplings-and-rolls/sesame-balls.cook` | 12 | yes | `963cb8e` |
| `recipes/noodles/beef-chow-fun.cook` | 13 | yes | `d77ad7c` |

Three further commits — `1902626`, `9abd17c`, `c5b49cd` — are label and convention corrections to
files already listed above; see *Deviations* in `progress.md`.

**No new folder was created.** Every file went into a folder that already had a neighbour it
belongs beside: the filled and wrapped things with `crab-rangoon` and `egg-rolls`, the roast-meat
window with the `char-siu` already shelved in `stews-and-braises`, the two steamed-then-fried
cakes with `scallion-pancakes`. The reasoning, including the two placements a reviewer might
argue with, is in `design.md` §4 and §5.

**Only one of the eighteen names a second counter.** `egg-custard-tart` names Bakery as well,
because gap item 4 says dan tat is missing at both and `docs/knowledge/counters.md` prints it in
both menu tables. Writing it twice is the duplication T-001-18 exists to catch.

## Acceptance criteria, against measured evidence

| Criterion | State |
| --- | --- |
| Dim Sum Counter shelves ≥ 18 recipes | **met — 29** |
| ≥ 12 name it and no other counter | **met — 20** |
| Gap list written top down; skips named with reasons | **met** — items 1–13 complete in order (item 5 already existed); 14–21 each named with a reason in `progress.md` |
| `check-recipes --labels` ok for every new file; labels read as a cook's verbs | **met** — full output below, read line by line |
| `title`, `category`, `tags`, `servings`, `counters`, and `aka` with a diacritic-free form | **met** — all eighteen carry all six; checked by script, not by eye |
| Every timer named | **met** — 69 timers across the eighteen, 69 named |
| Quantities real for the servings; method canonical | **met to the limit of what can be checked** — see *Open concerns* 1 |
| Only `recipes/**` modified | **met** — `git status` shows no file outside `recipes/` touched by this ticket, and no ticket-owned file left staged, modified or untracked |

Counts are measured, not asserted. A script over `normalise()` across the whole collection
reports:

```
collection: 383 recipes, 383 distinct slugs
Dim Sum Counter: 29 recipes, 20 naming it and no other
  sole: beef-chow-fun, char-siu-bao, cheung-fun, chicken-feet, congee, ginger-scallion-oil,
        ham-sui-gok, har-gow, lo-mai-gai, mango-pudding, red-braised-pork-belly, sesame-balls,
        siu-mai, siu-yuk, soy-sauce-chicken, taro-cake, turnip-cake, white-cut-chicken,
        wu-gok, xiao-long-bao
  shared: char-siu, chiffon-cake, chinese-five-spice-powder, egg-custard-tart, egg-fried-rice,
          lotus-seed-paste, red-bean-paste, scallion-pancakes, sweet-tart-shell
my files: 18, timers: 69, all named: true
no problems in this ticket's files
```

The same script checks, per file: the six required metadata lines, an unnamed timer, a timer with
no readable duration, a hands-on timer claiming four unbroken hours, a dangling or self-pairing
`pairs-with`, an ambiguous `dish` against the rest of the collection, and an `aka` with no plain
ASCII form. Zero findings.

```
$ node scripts/check-recipes.mjs --labels <the eighteen>
  ok   recipes/dumplings-and-rolls/har-gow.cook  15 rows x 4 cols
       stir the boiling water in, knead hot, rest 10 min
       stir one way until tacky, chill 30 min
         roll 24 rounds, pleat the near edge only
           steam 6 min, until the skin goes translucent
  ok   recipes/dumplings-and-rolls/siu-mai.cook  14 rows x 5 cols
       soak the mushrooms 30 min, squeeze dry, dice fine
         stir one way until sticky, chill 20 min
           press each wrapper into a cup, pack it full, flatten the top
             steam 8 min
  ok   recipes/dumplings-and-rolls/char-siu-bao.cook  17 rows x 5 cols
  ok   recipes/custards-and-puddings/egg-custard-tart.cook  6 rows x 5 cols
  ok   recipes/stews-and-braises/siu-yuk.cook  7 rows x 6 cols
       blanch 5 min, dry the skin hard
         rub the cut faces only, keep the skin dry
           salt the skin, prick it all over, air-dry uncovered 12 hr
             roast 325°F (160°C) 1 hr 30 min
               roast 465°F (240°C) 25 min, rest 15 min, chop through the crackling
  ok   recipes/stews-and-braises/soy-sauce-chicken.cook  12 rows x 4 cols
  ok   recipes/stews-and-braises/white-cut-chicken.cook  7 rows x 4 cols
  ok   recipes/sauces-and-gravies/ginger-scallion-oil.cook  6 rows x 4 cols
  ok   recipes/dumplings-and-rolls/cheung-fun.cook  13 rows x 4 cols
  ok   recipes/dumplings-and-rolls/xiao-long-bao.cook  18 rows x 5 cols
  ok   recipes/flatbreads-and-pancakes/turnip-cake.cook  12 rows x 5 cols
  ok   recipes/flatbreads-and-pancakes/taro-cake.cook  13 rows x 6 cols
  ok   recipes/rice-beans-and-grains/lo-mai-gai.cook  18 rows x 5 cols
  ok   recipes/stews-and-braises/chicken-feet.cook  15 rows x 6 cols
       blanch 5 min, dry them right through
         fry 350°F (175°C) 5 min, until the skin blisters
           soak in ice water 1 hr, until they plump and wrinkle
             simmer in the black bean sauce 1 hr
               steam 30 min, until the sauce clings
  ok   recipes/dumplings-and-rolls/wu-gok.cook  15 rows x 5 cols
  ok   recipes/dumplings-and-rolls/ham-sui-gok.cook  16 rows x 4 cols
  ok   recipes/dumplings-and-rolls/sesame-balls.cook  7 rows x 6 cols
  ok   recipes/noodles/beef-chow-fun.cook  18 rows x 5 cols

all 18 file(s) draw a table.
```

(Staircases elided for length on files whose shape repeats one above; every one was printed and
read, and eight labels were rewritten because of that reading — listed in `progress.md`.)

## Test coverage

There are no unit tests to add. This ticket adds data, and the collection's suites are the tests
for data — `collection.test.ts` (unique slugs, every recipe at a real counter, mutual pairings, no
timer claiming four unbroken hands-on hours), `layout.test.ts`, `shopping.test.ts`,
`icons.test.ts`, `schedule.test.ts`, `units.test.ts`, `time.test.ts`. All of them run over these
eighteen files.

**The build could not be run to completion inside the repository, and that is not this ticket's
doing.** Three other tickets are writing to `recipes/` concurrently, and `npm run recipes` stops
at the first `pairs-with` pointing at a recipe not yet written:

```
$ npm run recipes
Error: recipes/dressings-and-dips/birista.cook pairs with "biryani", which is not a recipe here.
```

Rather than assume, the whole tree was copied to a scratch directory, the thirteen in-flight
pairings were dropped **in the copy only**, and the build and full suite were run there:

```
all 382 file(s) draw a table.
parsed 382 recipe(s) in 22 categories -> src/generated/recipes.json
  counters: 382 named, 0 inferred from category · timers in 361 · pairings 277
Test Files  3 failed | 4 passed (7)
     Tests  4 failed | 530 passed (534)
```

Every failure traced, none caused by this ticket:

| Failing test | Cause | Whose |
| --- | --- | --- |
| `icons.test.ts` — every leading verb has an icon | 35 verbs fall through: `a, aromatics, assembly, bhuna, blitz, broth, bruise, corn, crack, do-piaza, dress, everything, hard, keep, lay, nine, noodles, paneer, pork, printed, return, ribbon, sheet, slide, sprouts, sweet, tare, the, there, thicker, this, tonkotsu, two, velvet, vinegar` | **none from this ticket.** Every label in these eighteen opens with a mapped verb; eight were rewritten in `1902626`, `9abd17c` and `c5b49cd` for exactly this reason |
| `schedule.test.ts` — the three longest are the ferments | `ginger-garlic-paste` displaced `pizza-dough` from third | the Curry House ticket. This ticket's longest chain is siu yuk at 15 hr, nowhere near the pickles at three weeks |
| `schedule.test.ts` — authors' claimed times agree | same three recipes | same |
| `shopping.test.ts` — under 2% of ingredients without an aisle | 46 of 753 (6.1%) | shared. Seven of the 46 are new with this ticket. Removing all seven still leaves 39/753 = 5.2%, so the threshold is crossed without this ticket, and the fix is `src/data/aisles.json`, which is T-001-17's |

The baseline before this ticket wrote anything was 4 failing test files / 460 passing tests;
`units.test.ts` has since been fixed by another ticket.

## Open concerns

1. **Nothing automated can check that a recipe is correct cooking.** A har gow made with a wonton
   wrapper draws exactly the same table as a real one. The defence here is sourcing — every title,
   `aka` and method comes from `docs/knowledge/counters.md` §Dim Sum Counter and
   `docs/gaps/dim-sum-counter.md`, with quantities scaled by hand to the stated servings — and a
   human reader. This is the one thing in the ticket a reviewer has to actually judge.
2. **The master stock is a first pour, and says so out loud.** `soy-sauce-chicken.cook` ends with
   a full-width row explaining that a lou sui is kept rather than finished, that the shop's is
   older than the shop, and that this one tastes cleaner and thinner. That is the gap doc's own
   instruction — *"written as a one-off poach it is honest and it is a different thing; say
   which"* — and it is the sentence most worth a reviewer's eye, because it is a claim about what
   this recipe is not.
3. **Seven new ingredient names have no shopping aisle** — `wheat starch`, `taro`, `lap cheong`,
   `dried lotus leaves`, `dried tangerine peel`, `red bean paste`, `blind-baked tart shells` — and
   `src/data/aisles.json` is not this ticket's file. This is the one measurable way this ticket
   makes an existing (already failing) test worse. Recorded for T-001-17 in `progress.md`.
4. **All eighteen currently print under "Also" on the counter's page.** The six sections in
   `src/data/counters.json` predate every one of them. Nothing is lost — unplaced recipes sweep
   into a trailing section — but the menu reads as a list until T-001-17 sections it. A suggested
   eight-section layout, written to match how the board is actually printed, is in `progress.md`.
5. **`egg-custard-tart` is claimed early for the Bakery.** T-001-11 will find it written and
   should record a no-op rather than write a second dan tat.
6. **Gap items 14–21 are unwritten**, each with a reason in `progress.md`. Two are worth a second
   look: **youtiao** (item 16) is the component two other gaps point at, and **gai lan** (item 14)
   is blocked on a decision nobody has made yet — the collection has no home for a plain plate of
   vegetables, and that is a gap across every counter, not just this one.

## What a reviewer should look at first

The three files where the cooking is easiest to get wrong and hardest to check:
`har-gow.cook` (boiling water into wheat starch, and a pleat on the near edge only),
`siu-yuk.cook` (blanch, season the meat side only, twelve hours uncovered in the fridge, then two
oven temperatures), and `xiao-long-bao.cook` (the aspic is the dish; a filling without it is a
pork dumpling wearing the name).
