# T-002-07 — Progress

Plan executed in order. Twelve files written, three commits, one deviation.

## Step 0 — Baseline

553 `.cook` files, every one drawing a table. Working tree carried four modified ticket files and
two untracked `docs/active/work/` directories, all siblings' or Lisa's. By the end of the ticket
the tree had grown to **589** files: twelve mine, twenty-four landed by T-002-05, T-002-06 and
T-003-01 while this ticket ran.

## Step 1 — The six roasted vegetables — done

```
recipes/vegetables-and-sides/roasted-sweet-potatoes.cook
recipes/vegetables-and-sides/charred-broccoli.cook
recipes/vegetables-and-sides/roasted-cauliflower.cook
recipes/vegetables-and-sides/roasted-brussels-sprouts.cook
recipes/vegetables-and-sides/roasted-beets.cook
recipes/vegetables-and-sides/crispy-roast-potatoes.cook
```

`node scripts/check-recipes.mjs --labels …` over the six, verbatim (staircases as finally
committed, after Step 3a):

```
  ok   recipes/vegetables-and-sides/roasted-sweet-potatoes.cook  7 rows x 5 cols
       [ The pan goes in the oven empty and comes out at 450°F. … ]
       toss in oil and salt
       stir the maple-lime glaze
         roast 450°F (230°C) 20 min, cut face down, not moved
           turn and finish 10 min
             toss on the hot pan
  ok   recipes/vegetables-and-sides/charred-broccoli.cook  8 rows x 5 cols
       [ Three things, and only three: dry, hot, and not crowded. … ]
       cut into spears with one flat face, air-dry 10 min
       stir the lemon-garlic oil
         toss in oil and salt
           roast 500°F (260°C) 14 min, flat face down
             toss off the sheet
  ok   recipes/vegetables-and-sides/roasted-cauliflower.cook  7 rows x 5 cols
       cut the head into slabs through the core
         toss with oil, cumin and coriander
           roast 425°F (220°C) 25 min flat, then 8 min turned
             finish with lemon and parsley
  ok   recipes/vegetables-and-sides/roasted-brussels-sprouts.cook  7 rows x 5 cols
       trim and halve, loose leaves kept
       simmer the balsamic to a syrup 4 min
         toss in oil, salt and pepper
           roast 425°F (220°C) 22 min, cut side down
             toss off the heat
  ok   recipes/vegetables-and-sides/roasted-beets.cook  8 rows x 6 cols
       [ The first hour is not roasting. It is steaming, in a foil tent, … ]
       wash and cover with a splash of water
         roast covered 400°F (200°C) 60 min
           rub the skins off hot, under a towel
             dress while still warm
               stand 15 min, then fold in the herbs
  ok   recipes/vegetables-and-sides/crispy-roast-potatoes.cook  7 rows x 5 cols
       parboil 8 min in alkaline water
       heat the fat on the pan until it shimmers
         drain and shake hard, then dry 5 min
           roll in the hot fat, roast 425°F (220°C) 45 min
             salt and scatter rosemary

all 6 file(s) draw a table.
```

Every shape matches `structure.md` §4.7–4.12 exactly — no blueprint drift.

## Step 2 — Commit the vegetables — done

```
593699f  Put a roasting tray in the vegetable drawer
         6 files changed, 144 insertions(+)
```

Six `--include` paths through `lisa commit-ticket`. No ordinary `git add`, no `git commit`.

## Step 3 — The six proteins — done

```
recipes/smoked-and-grilled/pulled-roast-chicken.cook
recipes/smoked-and-grilled/blackened-salmon.cook
recipes/fried-and-crispy/crispy-chickpeas.cook
recipes/fried-and-crispy/crisped-marinated-tofu.cook
recipes/fried-and-crispy/seared-halloumi.cook
recipes/eggs/seven-minute-eggs.cook
```

```
  ok   recipes/smoked-and-grilled/pulled-roast-chicken.cook  6 rows x 5 cols
       salt uncovered in the fridge 12 hr
         roast 425°F (220°C) 35 min, skin up
           rest 15 min in the pan
             shred it back into its own juices
  ok   recipes/smoked-and-grilled/blackened-salmon.cook  10 rows x 5 cols
       chill the fillets uncovered 20 min
       stir the blackening spice
         butter, then press into the spice
           sear 3 min a side in a smoking skillet
             rest 3 min, then lemon
  ok   recipes/fried-and-crispy/crispy-chickpeas.cook  6 rows x 4 cols
       pat them dry until they squeak
       stir the spice while they roast
         roast 400°F (200°C) 35 min, plain
           toss hot, off the sheet
  ok   recipes/fried-and-crispy/crisped-marinated-tofu.cook  11 rows x 6 cols
       press 30 min under a weight
         marinate the cubes 20 min
           toss in cornstarch
             crisp 10 min, face by face, undisturbed
               finish off the heat
  ok   recipes/fried-and-crispy/seared-halloumi.cook  5 rows x 4 cols
       rinse the brine off, dry hard
       stir the hot honey
         sear 90 sec a face in a dry pan
           spoon over and eat it now
  ok   recipes/eggs/seven-minute-eggs.cook  5 rows x 5 cols
       boil 7 min from fridge-cold
         ice bath 5 min
           peel under the tap
             halve and salt at the table

all 6 file(s) draw a table.
```

Both merges (`blackened-salmon` s3, `seared-halloumi` s4) resolved on the first attempt.

## Step 4 — Commit the proteins — done

```
a776e83  Write the protein column the bowl counter sells
         6 files changed, 130 insertions(+)
```

## Step 3a — Deviation: four labels reworded for the icon map

**Not in the plan.** `npx vitest run` at Step 5 failed one test — `src/lib/icons.test.ts:273`,
*"recognises every verb the recipes open an operation with"* — reporting five leading verbs with no
icon: `break, dry, pull, scrub, spice`.

Three of the five were mine (`dry` twice, `pull`, `scrub`); `break` and `spice` came from
T-002-05's in-flight bowl files and were fixed by that ticket while this one worked.

`structure.md` §5 checked the timer vocabulary in `src/lib/time.ts` and missed that
`src/lib/icons.ts` holds a **second** vocabulary — the verb an operation label opens with must be
one the icon map knows, and it is asserted across the whole collection. The plan's verification
strategy caught it, which is what Step 5 was for, but Design should have known about it.

The fix could not be *"add the words to `VERB_ICONS`"*: acceptance criterion 8 forbids editing any
file that existed before this ticket, and `src/lib/icons.ts` is one. So the labels were reworded to
open with verbs the map already reads, which is also what the branch's own history does
(`9fd7e14 Open the vegetable legs with a verb the icon map reads`).

| File | Was | Now | Verb reads as |
| --- | --- | --- | --- |
| `crispy-chickpeas` s1 | `dry them until they squeak` | `pat them dry until they squeak` | `pat` → hand |
| `blackened-salmon` s2 | `dry the fillets uncovered 20 min` | `chill the fillets uncovered 20 min` | `chill` → fridge |
| `pulled-roast-chicken` s4 | `pull it back into its own juices` | `shred it back into its own juices` | `shred` → knife |
| `roasted-beets` s2 | `scrub, into a covered dish with a splash of water` | `wash and cover with a splash of water` | `wash` → strain |

Each replacement is accurate to the step it labels: the chickpeas are rolled between towels, the
salmon dries uncovered **in the fridge**, the chicken is pulled with two forks, the beets are
scrubbed under the tap. No prose changed — only the four `>> step.N:` override lines.

```
cd2dfd0  Open four operations with a verb the icon map reads
         4 files changed, 4 insertions(+), 4 deletions(-)
```

## Step 5 — Whole-collection verification — done, green

```
$ node scripts/check-recipes.mjs
all 589 file(s) draw a table.

$ node scripts/parse-recipes.mjs
parsed 589 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 589 named, 0 inferred from category · timers in 566 · pairings 670

$ npx vitest run
 Test Files  8 passed (8)
      Tests  756 passed (756)

$ npm run verify
[build] 610 page(s) built in 609ms
[build] Complete!
```

Zero parser warnings, zero orphans, zero duplicate slugs, zero counters inferred from category.
`npm run verify` passes end to end over the whole tree, siblings' in-flight files included.

## Step 6 — Acceptance evidence collected

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ≥ 10 files, each `counters: The Bowl Shop` | 12 files; `grep -c` returns 1 on every one |
| 2 | ≥ 5 proteins, ≥ 4 roasted vegetables | 6 and 6 |
| 3 | ≥ 2 proteins not meat | 4: chickpeas, tofu, halloumi, eggs |
| 4 | 3–6 operations each | 4,4,4,4,5,5,5,5,5,5,5,5 — from the staircases above |
| 5 | Nothing duplicates an existing dish | `research.md` §4 grep re-run; `design.md` §2, §4-E and §4-G argue the three close calls |
| 5b | Existing dishes listed by slug and section | `design.md` §5 — 30 for *What goes on top*, 9 for *Roasted vegetables* |
| 6 | `check-recipes.mjs --labels` ok, staircase reads as verbs | transcripts above; 12 of 12 ok |
| 7 | Every timer named; six metadata keys per file | `grep '~{'` → none; all 27 timers named; `grep -cE '^>> (title\|category\|tags\|servings\|counters\|aka):'` → 6 on all twelve |
| 8 | Only `recipes/**` touched, nothing pre-existing edited | three `git show --stat` above: 16 file entries, all `recipes/**`, all among the twelve |

## Working tree at the end

```
 M docs/active/tickets/T-002-05-bowl-shop-grain-bowls.md    (sibling)
 M docs/active/tickets/T-002-06-bowl-shop-salads.md         (sibling)
 M docs/active/tickets/T-002-07-bowl-shop-toppings.md       (Lisa's phase field)
 M docs/active/tickets/T-003-01-open-the-home-shelves.md    (sibling)
?? docs/active/work/T-002-05/  ?? docs/active/work/T-002-06/
?? docs/active/work/T-002-07/  ?? docs/active/work/T-003-01/
```

**No ticket-owned source file is staged, modified or untracked.** All twelve `.cook` files are
committed. `src/generated/` is uncommitted by design and was never included.
