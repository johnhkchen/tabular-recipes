# T-002-06 — Progress

Twelve files written, four commits, all gates run. Complete.

---

## Step 0 — Confirm the slugs · done

All `pairs-with:` candidates checked with `ls recipes/*/<slug>.cook`.

**Deviation from Structure:** `sourdough-bread` does not exist. The file is
`recipes/breads/sourdough-boule.cook`, and `kale-caesar` pairs with that. `ciabatta`,
`pita-bread` (in `recipes/flatbreads-and-pancakes/`), `tzatziki` and `fattoush` were confirmed
the same way before being written.

**Second deviation:** `italian-chopped-salad` was drafted with `pairs-with: italian-sub`. **No
such file** — the collection has no Italian hero under any slug (`grep` over all 553 basenames
for `sub|hero|hoagie|italian` returned nothing). The pairing was dropped rather than invented.
Recorded here because it is a genuine hole on the Deli/Pizzeria shelf that a later ticket may
want.

## Step 1 — The gaps-page ranks · done

| File | gaps rank | table |
| --- | --- | --- |
| `recipes/salads/kale-caesar.cook` | 6 | 10 rows × 4 cols |
| `recipes/salads/shaved-brussels-salad.cook` | 7 | 8 rows × 4 cols |
| `recipes/salads/italian-chopped-salad.cook` | 13, *The Goop Father* | 15 rows × 4 cols |
| `recipes/salads/chinese-chicken-salad.cook` | 13, *Brentwood Chinese Chicken* | 14 rows × 4 cols |
| `recipes/salads/harvest-chopped-salad.cook` | 13, *Fall Harvest Chopped* | 15 rows × 4 cols |

Each checked with `--labels` as it was written; all five `ok`, all five staircases read as a
cook's verbs.

**Commit `bb2962a`** — "The kale, the sprouts and the three chopped salads", five `--include`
paths.

## Step 2 — The bacon three · done

| File | table | what makes it not the other two |
| --- | --- | --- |
| `cobb-salad.cook` | 11 rows × 4 cols | bacon diced into a stripe; the rows are the dish and it is never tossed |
| `wedge-salad.cook` | 10 rows × 3 cols | bacon as lardons you can spear; a quarter of iceberg and a pickled shallot to cut the fat |
| `spinach-salad.cook` | 9 rows × 5 cols | the fat is kept and the dressing is built in the pan; the only warm salad of the twelve |

All three kept — the side-by-side read that Plan set as the cut gate found three different
recipes, not one recipe three times. `wedge-salad` is the shallowest table of the twelve at
three columns, which clears the checker's floor exactly; it earns it with a made pickle and a
rendered lardon rather than with depth.

**Commit `d66ba6b`** — "Bacon three ways over a leaf", three `--include` paths.

## Step 3 — The dressed-in-the-bowl four · done

| File | table | why it does not reference the drawer |
| --- | --- | --- |
| `greek-salad.cook` | 11 rows × 4 cols | warm oregano oil poured over a slab of feta; no oregano oil exists |
| `panzanella.cook` | 10 rows × 4 cols | the dressing is the water the salted tomatoes gave up |
| `salade-nicoise.cook` | 15 rows × 4 cols | anchovy-lemon vinaigrette that goes on the potatoes hot, in two parts |
| `roasted-beet-salad.cook` | 14 rows × 4 cols | references `basic-vinaigrette`; what is built is the marinated goat cheese |

**Commit `b43462f`** — "Four that dress themselves", four `--include` paths.

## Step 4 — Whole-collection gates · done, with one finding

```
node scripts/check-recipes.mjs        all 587 file(s) draw a table
npm run recipes                       parsed 587 recipe(s) in 27 categories
npx vitest run                        1 failed | 755 passed
```

(587, not 565: T-002-05 and T-002-07 landed their files on the same branch while this ticket
was being written.)

**The failure was `icons.test.ts`, and one of the six verbs was ours.**

```
6 verb(s) fall through to the bowl: break, dry, pull, scrub, shave, spice
```

`shave` was `kale-caesar` step 4 (`>> step.4: shave over`). Research had predicted `massage` and
`tear` as the missing salad verbs and had not thought of `shave`, which is the reason this gate
exists — a verb table cannot be checked from inside one file.

**Fix, per the risk table in Plan:** reworded the label rather than editing `src/lib/icons.ts`,
which is outside this ticket's file scope. `>> step.4: peel into wide sheets`, and the step
sentence now opens `Peel @parmesan{2%oz}(60 g) into wide sheets with a vegetable peeler`, which
is literally the tool and reads better than the original.

**Commit `9f45c89`** — "Open the parmesan step with a verb the icon table knows".

Re-run after the fix: `shave` is gone from the fall-through list. The remaining five —
`break`, `dry`, `pull`, `scrub`, `spice` — belong to files this ticket does not own:

| Verb | File | Owner |
| --- | --- | --- |
| `break` | `rice-beans-and-grains/spicy-lamb-bowl.cook`, `crispy-rice-bowl.cook` | T-002-05 |
| `pull` | `rice-beans-and-grains/harvest-bowl.cook`, `smoked-and-grilled/pulled-roast-chicken.cook` | T-002-05, T-002-07 |
| `spice` | `rice-beans-and-grains/crispy-chickpea-bowl.cook` | T-002-05 |
| `dry` | `smoked-and-grilled/blackened-salmon.cook`, `fried-and-crispy/crispy-chickpeas.cook` | T-002-07 |
| `scrub` | `vegetables-and-sides/roasted-beets.cook` | T-002-07 |

Both tickets are still in flight on this branch. Left alone: editing another ticket's recipe
files, or editing `src/lib/icons.ts`, would break this ticket's file-scope criterion and would
take the fix out of the hands of whoever owns it.

## Step 5 — Working-tree hygiene · done

```
git status --porcelain recipes/salads/     (empty)
```

Nothing this ticket owns is staged, modified or untracked. The two modified files under
`recipes/rice-beans-and-grains/` in the wider `git status` are T-002-05's, in flight.

Per-file audit over the twelve: `title`, `category`, `tags`, `servings`, `counters`, `aka` all
present; `counters: The Bowl Shop` exact on all twelve; **zero bare `~{` timers** — every timer
carries a name.

## Step 6 — Review · in progress

`review.md` and `review-disposition.json` next.

---

## Deviations from the plan, collected

1. `sourdough-bread` → `sourdough-boule` (Step 0).
2. `italian-sub` pairing dropped; no such recipe exists (Step 0).
3. `kale-caesar` step 4 reworded from `shave` to `peel` after `icons.test.ts` named it (Step 4).
   One extra commit beyond the three the plan named.
4. No file was cut. The plan allowed dropping one of the bacon three down to eleven files; the
   read found three distinct recipes, so all twelve stand.
