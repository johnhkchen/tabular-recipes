# T-001-13 — Plan

Eight commits, each a batch that stands on its own and passes the checker before it lands.
Components go in before the dishes that pair with them.

---

## Verification strategy

There is no unit test to write: this ticket adds data, not code, and every line of code
that reads it (`tree.ts`, `layout.ts`, `label.ts`, `time.ts`, `icons.ts`, `schedule.ts`) is
untouched and already covered. The equivalent of a test suite for a `.cook` file is
`scripts/check-recipes.mjs`, which parses it, builds its merge tree, lays out the grid and
asserts every cell tiles exactly once.

**Per batch, before `lisa commit-ticket`:**

```
node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook ...
```

Read for three things, not one:

1. `ok  <path>  N rows x M cols` — it draws a table.
2. The printed staircase — every line a cook's verb (`stew 2 hr`), not a fragment
   (`with , and for`). Criterion 3 is about this, and it is the one thing the exit code
   does not check.
3. No `cooklang:` notes — a parser warning means a bracket in the wrong place.

**Per batch, three greps that answer the criteria directly:**

```
grep -L '^>> aka:'      <batch>          # criterion 4: every file has aka
grep -n '~{'            <batch>          # criterion 5: an unnamed timer, must print nothing
grep -c '^>> counters: Meat and Three$'  # exclusivity
```

**At the end, whole-collection:**

```
node scripts/check-recipes.mjs           # every file still draws a table
npm run recipes                          # slugs unique, counters known, pairings resolve
npx vitest run                           # icon coverage, timer sanity, tiling, schedule
grep -rl "Meat and Three" recipes/ | wc -l
git status --short recipes/              # nothing of this ticket's left uncommitted
```

**Known interference.** T-001-11 is writing into `recipes/` at the same time
(`falafel`, `chicken-shawarma`, `gyro-meat` are untracked in the working tree). A
whole-collection `vitest` or `npm run recipes` reads their files too, so a failure there
has to be attributed to a path before it is treated as this ticket's. The per-file
`check-recipes.mjs` runs on exact paths are the gate that is actually about this work; the
whole-collection runs are a cross-check and their output is recorded in `review.md` with
the attribution made explicit.

---

## Step 0 — Prove the format on one file before writing twenty-two

Write `ham-hock-stock.cook` alone and run the checker on it. It exercises everything the
other twenty-one need: a named timer with a long unattended wait, an `@&(~n)` reference
chain three deep, a `>> step.N:` override, an ingredient with a metric note, and a
full-width header row. If the reference syntax or the label override is wrong, it is wrong
here, at a cost of one file rather than twenty-two.

**Verify:** `ok`, ≥3 rows × ≥3 cols, no parser notes, staircase reads as verbs.

---

## Step 1 — The pot and the greens *(gap items 1–2)*

`recipes/soups/ham-hock-stock.cook`
`recipes/stews-and-braises/collard-greens.cook`

The doc's highest-leverage component and the first line on the vegetable list. The greens
consume the stock; the pot-likker line goes in as a footer row.

**Commit:** `The pot of smoked pork, and the greens that come out of it`

---

## Step 2 — Fried chicken *(gap item 3)*

`recipes/fried-and-crispy/fried-chicken.cook`

"The most-ordered line on the meat list, and there is nothing deep-fried anywhere on the
site" — except `karaage`, which is where this one is filed. Buttermilk brine (`~brine`,
unattended, 4 hr) and seasoned dredge are steps in it. Two counters: `Meat and Three, Diner`.

**Commit:** `Brine the chicken overnight and fry it, the most-ordered line on the list`

---

## Step 3 — The two starches on the vegetable list *(gap items 4–5)*

`recipes/noodles/macaroni-and-cheese.cook`
`recipes/vegetables-and-sides/candied-yams.cook`

Opens `recipes/vegetables-and-sides/`. The macaroni is what `cheddar-cheese-sauce` was
written without; the yams are not yams, and the mashed version goes in `aka`.

**Commit:** `Macaroni and candied yams, the two starches the board calls vegetables`

---

## Step 4 — The method word of the room *(gap item 6)*

`recipes/sauces-and-gravies/onion-gravy.cook`
`recipes/stews-and-braises/smothered-pork-chops.cook`

The gravy written once, and one smothered dish properly — the gap doc's instruction,
followed rather than worked around. `smothered-chicken` is deliberately absent.

**Commit:** `Write the onion gravy once, and smother the chops in it`

---

## Step 5 — Dressing, and the two biggest plates *(gap items 7–8)*

`recipes/vegetables-and-sides/cornbread-dressing.cook`
`recipes/stews-and-braises/baked-turkey-wings.cook`
`recipes/stews-and-braises/oxtails.cook`

Dressing is an everyday side here, not a once-a-year thing — that fact goes in a header
row. The wings take the onion gravy from step 4.

**Commit:** `Dressing every day, and the two biggest plates on the board`

---

## Step 6 — The rest of the vegetable list *(gap item 9)*

`recipes/vegetables-and-sides/green-beans.cook`
`recipes/fried-and-crispy/fried-okra.cook`
`recipes/vegetables-and-sides/stewed-squash.cook`
`recipes/rice-beans-and-grains/black-eyed-peas.cook`
`recipes/rice-beans-and-grains/butter-beans.cook`
`recipes/vegetables-and-sides/creamed-corn.cook`

Six lines in one commit because they are one list, and three of them come out of the same
pot from step 1. This is the batch that answers the gap doc's actual complaint: the
vegetable list goes from six entries with no green in it to twelve with four.

**Commit:** `Six more lines on the vegetable list, four of them out of one pot`

---

## Step 7 — The other two meat-list regulars *(gap item 10)*

`recipes/sauces-and-gravies/cream-gravy.cook`
`recipes/fried-and-crispy/country-fried-steak.cook`
`recipes/stews-and-braises/meatloaf.cook`

`cream-gravy` first: the plain white one, which `sausage-gravy` is close to and is not.

**Commit:** `Cream gravy, and the two meat-list regulars that need it`

---

## Step 8 — Dessert, and the cold end *(gap items 11, 18)*

`recipes/custards-and-puddings/peach-cobbler.cook`
`recipes/custards-and-puddings/sweet-potato-pie.cook`
`recipes/dressings-and-dips/potato-salad.cook`

Three desserts are named in the reference for this counter; `banana-pudding` is the one
already written, so these are the other two. `potato-salad` closes the cold end beside the
slaw that is already there.

**Commit:** `Cobbler, sweet potato pie, and the potato salad at the cold end`

---

## Step 9 — Whole-collection cross-check and the Review artifacts

Run the four commands under "At the end" above. Record in `review.md`:

- the shelved and exclusive counts, before and after
- which ranked items were written, which were already on the shelf, and which were left,
  each with a reason (criterion 2 asks for this by name)
- the full `--labels` staircase evidence for the batches
- `git status --short recipes/` showing nothing of this ticket's staged, modified or
  untracked

Then `review-disposition.json`, then `lisa check-disposition T-001-13`.

---

## Rollback shape

Every commit is additive and touches only new files, so any batch can be reverted on its
own without disturbing another. The one exception to watch is `recipes/vegetables-and-sides/`:
reverting step 3 alone would leave the folder empty but referenced by nothing, which is
inert. No existing file is modified by any step, so nothing here can regress a counter
that is already correct.

---

## What could go wrong, and what it looks like

| Failure | How it shows | Response |
| --- | --- | --- |
| A verb is not in `VERB_ICONS` | `vitest` prints `N verb(s) fall through to the bowl: <verb>` | Reword the step to open with a verb already in the table. `src/` is not this ticket's. |
| A step is referenced twice | checker: "step N is used by two later steps" | Split the step or duplicate the ingredient. |
| Two steps end the recipe | checker: "N steps end the recipe" | Add the missing `@&(~n)` into the final step. |
| A timer reads as hands-on for hours | `collection.test.ts`: "never claims four unbroken hours" | Name the timer with an unattended word (`~stew`, `~braise`, `~bake`). |
| `>> time:` written as a range | `schedule.test.ts`: "reads every `>> time:` line" | Write a plain sum. |
| A pairing points at a slug that is not there | `npm run recipes` throws by path | Fix the slug, or drop the pairing. |
