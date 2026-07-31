# T-001-08 — Progress

Seven steps planned, seven done. Seventeen new `.cook` files, two new folders, nothing
modified and nothing deleted.

## Step 1 — the two broths and the dashi ✅
`recipes/soups/dashi.cook`, `tonkotsu-broth.cook`, `chintan-broth.cook`
`check-recipes --labels`: 3×4, 9×5, 9×5, all ok. Commit `8d794eb`.

**Deviation (applies to every file after it).** `>> step.N:` is indexed over **all** steps,
including a prose paragraph that has no ingredients and no refs. The plan assumed N counted
operations. The first run put my `step.1` override onto the header paragraph and left the
last operation labelled with its whole essay:

```
[ Soak cold 30 min ]                                  <- the header, wearing step 1's label
  steep in off the heat 2 min until every flake has sunk then pour it through …
```

Fixed by shifting every override down one and giving the header its own `step.1`.

**Second deviation, same cause.** A header row goes through `cleanLabel()`, which strips
commas — `"it tops up, draws off, and starts again"` rendered as `"it tops up draws off
starts again"`. An **override bypasses `cleanLabel()` entirely**, so every header row in this
ticket is written twice: once as the paragraph that makes it a step, once as a `>> step.1:`
override that carries the punctuation. Header rows were also cut from paragraphs to single
sentences, which is what the existing files do (`blondies`: *"Line an 8x8-in pan with
parchment"*).

## Step 2 — the three tares and the aroma oil ✅
`recipes/sauces-and-gravies/shoyu-tare.cook`, `shio-tare.cook`, `miso-tare.cook`, `mayu.cook`
7×4, 7×5, 10×4, 3×4, all ok. Commit `154bb1b`.

`mayu` is the tightest file in the ticket — exactly 3 ingredient rows against the floor of 3
at `check-recipes.mjs:66`, and exactly 3 operations against the floor of 3 columns. It passed
first time. `shoyu-tare` and `miso-tare` are the two-branch shape (a reduction joining a
steep), which the plan expected only in `gyoza`.

## Step 3 — chashu and the noodles ✅
`recipes/stews-and-braises/chashu.cook`, `recipes/noodles/ramen-noodles.cook`
11×5, 6×6, ok. Commit `c289d00`.

**The acceptance bar was cleared here**: 19 recipes at the counter, 18 exclusive, against
18/14. Everything after this step exists so the four bowls are makeable rather than to raise
the count.

`chashu` carries the sentence the gap doc asked for — strain and reduce the braising liquid
and it is a tare — as prose on the last step and as `pairs-with: shoyu-tare`, rather than as
a second ending the build would refuse.

## Step 4 — the toppings ✅
`recipes/toppings-and-pickles/ajitama.cook`, `menma.cook` — new folder, new category
**Toppings & Pickles**. 6×4, 8×4, ok. Commit `2262941`.

No registration was needed for the category, as research §4 predicted: nothing validates the
category list, only counters, and both files name `Ramen Shop` explicitly.

## Step 5 — the four bowls ✅
`recipes/noodles/tonkotsu-ramen.cook`, `shoyu-ramen.cook`, `shio-ramen.cook`, `miso-ramen.cook`
10×5, 11×5, 11×5, 14×7, ok. Commit `ebb1331`.

Mixed fractions parse as expected — `{1 1/2%cups}` comes out `1 1/2 cups (350 mL) tonkotsu
broth`, checked by dumping the normalised ingredients rather than by eye.

Read side by side, as the plan required: the three poured bowls share a staircase (tare in,
broth in, noodles in, top) because that is honestly what they are, and differ in every row —
broth, tare, fat, noodle gauge, boil time, toppings. `miso-ramen` is 7 columns and is cooked
in a wok, which is the difference the design predicted.

## Step 6 — gyoza ✅
`recipes/dumplings-and-rolls/gyoza.cook`. 17×6, ok. Commit `7631a5a`.
The only two-branch-plus-join tree in the ticket; both refs on the join step were right first
time, so the "2 steps end the recipe" failure never came up.

## Step 7 — karaage ✅
`recipes/fried-and-crispy/karaage.cook` — new folder, new category **Fried & Crispy**.
12×6, ok. Commit `9cd4e0a`.

## Final verification

```
node scripts/check-recipes.mjs        all 376 file(s) draw a table.
grep -n '~{' <the 17 new files>       nothing — every timer named
Ramen Shop                            27 recipes, 26 of them naming it alone   (bar: 18 / 14)
pairs-with across the 17              every slug resolves to a file on disk
git status --porcelain                no ticket-owned file left modified or untracked
```

An intermediate `check-recipes` run reported `1 of 376 file(s) would not draw a table` while
another ticket's agent was mid-write; the next run was clean. Nothing in that window was a
file of this ticket's.

**One failure outside this ticket.** `node scripts/parse-recipes.mjs` currently exits
non-zero on `recipes/dressings-and-dips/birista.cook`, which pairs with `biryani` — a recipe
that does not exist. That file was written by T-001-09 (commit `e47bc27`), which is still
running on the same branch. Every `pairs-with` slug in this ticket's seventeen files was
checked against the files on disk and all resolve. Recorded in `review.md`; not fixed here,
because the file belongs to another ticket.
