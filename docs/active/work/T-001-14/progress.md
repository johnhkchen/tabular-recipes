# T-001-14 — Progress

**Done.** Eighteen files written, eight commits, all through `lisa commit-ticket`. Nothing of
this ticket's is left staged, modified or untracked.

## Commits

| Commit | What landed |
| --- | --- |
| `04f4691` | `pastrami`, `corned-beef` |
| `c4dcfbe` | `russian-dressing` |
| `1c08d97` | `schmaltz`, `chicken-broth`, `matzo-ball-soup` |
| `5352a97` | `potato-salad`, `macaroni-salad`, `egg-salad`, `tuna-salad`, `chicken-salad` |
| `92b1382` | `chopped-liver` |
| `683f818` | `cream-cheese`, `scallion-schmear`, `whitefish-salad`, `belly-lox` |
| `897d3c0` | `sauerkraut`, `potato-knish` |
| `d0b9dec` | fix: the pink-salt ingredient name (see *Deviations*) |

## The counter, before and after

| | Before | After | Gate |
| --- | --- | --- | --- |
| Recipes shelving the Deli | 41 | **59** | ≥ 44 |
| Naming the Deli and no other counter | 8 | **25** | ≥ 12 |

## The eighteen, with their staircases

Every one reports `ok` from `node scripts/check-recipes.mjs --labels`.

```
pastrami                    14 x 7   stir the brine / brine 5 days, turn daily / rinse, soak 2 hr, pat dry /
                                     press on the pepper and coriander / smoke 6 hr at 225°F (107°C) /
                                     steam 2 hr, rest 30 min, slice by hand
corned-beef                 14 x 6   stir the brine / brine 5 days, turn daily / rinse, soak 2 hr /
                                     simmer 3 hr 30 min with the aromatics / rest 20 min, slice across the grain
russian-dressing            10 x 4   whisk the base / fold in the chopped things / chill 1 hr
schmaltz                     5 x 5   chop the fat and skin / render 1 hr on the lowest heat /
                                     fry the onion 20 min to gribenes / strain, salt the cracklings
chicken-broth               11 x 5   cover with cold water, bring to a boil, skim 15 min /
                                     simmer 3 hr with the aromatics / strain, salt to taste /
                                     chill 8 hr, lift the cap of fat
matzo-ball-soup             13 x 5   whisk the eggs with schmaltz and seltzer + simmer the broth 20 min /
                                     stir in the matzo meal, chill 1 hr / shape wet, poach 40 min covered /
                                     ladle the broth over the balls
potato-salad                13 x 5   boil the potatoes 20 min + whisk the dressing /
                                     cut warm, splash with vinegar, rest 10 min /
                                     fold in the crunch and the egg / chill 2 hr
macaroni-salad              14 x 4   boil the macaroni 8 min, rinse cold + whisk the dressing /
                                     fold in the crunch / chill 2 hr, loosen with milk
egg-salad                   10 x 5   boil the eggs 11 min, ice them + whisk the dressing /
                                     peel and chop coarse / fold, keeping the pieces / chill 1 hr
tuna-salad                   9 x 4   drain and flake the tuna + whisk the dressing /
                                     fold in the crunch / chill 1 hr
chicken-salad               13 x 5   poach the breasts 15 min, rest 10 min in the pot + whisk the dressing /
                                     dice into half-inch pieces / fold in the celery and scallion / chill 1 hr
chopped-liver                9 x 4   broil the livers 6 min a side + fry the onions 25 min + boil the eggs 11 min /
                                     chop coarse with schmaltz / chill 2 hr
cream-cheese                 5 x 6   warm the milk and cream to 72°F (22°C) / stir in the culture, ferment 12 hr /
                                     set with rennet 1 hr / drain in cloth 12 hr / beat with salt
scallion-schmear             6 x 4   slice the scallions thin + beat the cream cheese soft /
                                     fold them through / chill 1 hr
whitefish-salad              9 x 4   debone the whitefish, keep the flakes big + whisk the dressing /
                                     fold in the celery and dill / chill 2 hr
belly-lox                    6 x 6   pack the salmon in salt / cure 3 days, pour off the brine / rinse, soak 2 hr /
                                     pat dry, leave uncovered 12 hr / slice paper-thin off the skin
sauerkraut                   5 x 6   shred the cabbage, salt at 2% / press 30 min until it runs /
                                     pack under its own brine / ferment 3 weeks at 65°F (18°C) / refrigerate 2 days
potato-knish                15 x 5   boil the potatoes 20 min + fry the onions 20 min + mix the dough, rest 1 hr /
                                     mash coarse, season hard / roll thin, fill the sheet, lay the top /
                                     brush with egg, bake 45 min, cut into squares
```

Every leading verb has a reading in `src/lib/icons.ts`; every timer in all eighteen files
carries a name, and every name is one `src/lib/time.ts` recognises (`brine`, `soak`, `smoke`,
`steam`, `rest`, `simmer`, `skim`, `chill`, `boil`, `fry`, `broil`, `poach`, `cure`, `dry`,
`ferment`, `press`, `set`, `drain`, `bake`).

## Where the gap doc was stale

- **Rank 1, a pickle** — `sour-dill-pickles` was written after the doc was compiled, and it is
  the lacto ferment the doc asked for. Not rewritten.
- **Rank 5, coleslaw** — likewise already written, and already naming this counter.
- The doc's "nothing in the entire collection is pickled" and "nothing brined or fermented
  exists" are both out of date on the same two files.

Nothing planned turned out to already exist under another name, so nothing was recorded for
T-001-18.

## Skipped, and why

| Skipped | Reason |
| --- | --- |
| **Pastrami on rye** (rank 2 sandwich half), **the Reuben** and **the Rachel** (rank 3), **Italian combo / hoagie** (12), **Philly cheesesteak** (13), **Jersey sloppy joe** (23) | `docs/gaps/deli.md:108` — a sandwich is "one operation and eight leaves", under the floor on operations and over it on the point. The meats are written; the assembly lives in the prose and in `pairs-with` |
| **Nova lox** (rank 9) | `docs/gaps/deli.md:105` — cold smoke below 30 °C is equipment, and hot smoke makes a different fish. `belly-lox` is written instead, and its last paragraph says plainly what nova is and why this is not it |
| **The round fried knish** (rank 11's second half) | A second dough and a second cooking method. `potato-knish` records that the two are different foods under one word. Left for the ticket that picks up rank 12 onward |
| **Ranks 12–25** — Italian roast pork, broccoli rabe, hot pepper relish, Dutch crunch, swirl rye, kasha varnishkes, kishka, noodle kugel, blintzes, pierogi, uszka, żurek, bigos, the two kiełbasas, Leberkäse, herring, egg cream, farmer cheese | Out of the scope set in `design.md`: ranks 2–11 are the delicatessen and the appetizing store, which is where the five empty sections were. Rank 12 onward is the Italian, Polish and San Francisco ends of the counter, and it is a clean seam for a following ticket |
| **A standalone curing-brine file** | Two ingredients and one stir is under the checker's floor, and there is no cross-recipe include in this format. `pastrami` and `corned-beef` each carry the identical brine as step 1, which is what makes the pair legible as one cure and two finishes |

## Deviations from the plan

1. **`belly-lox` step labels.** Planned as "bury the salmon in salt" and "dry 12 hr". Neither
   `bury` nor `dry` has a reading in `VERB_ICONS`, and the icons coverage test collects the
   first word of every label — so both would have arrived in that test's fall-through list by
   name. Relabelled to `pack the salmon in salt` and `pat dry, leave uncovered 12 hr`, which
   are the same operations in mapped verbs.
2. **`sauerkraut` step 4 was not an operation.** As first written, "weight everything below the
   surface and ferment" used no ingredient and no reference, so `buildTree` treated it as a
   footer and step 5's `@&(~1)` pointed at nothing. Fixed by having it consume the packed jar.
3. **`cream-cheese` rennet note.** An `@water{}` written inside a parenthetical note is not
   parsed as an ingredient — it printed literally in the ingredient cell. Rewritten as plain
   note text.
4. **`pink curing salt #1` — the one real bug, caught by the collection tests.** Cooklang read
   the `#1` as cookware and cut the ingredient short at `@pink`, leaving a 25 g dose with no
   quantity attached and adding a phantom `1` to the cookware list. It passed
   `check-recipes.mjs` (the table still tiled) and was caught by `units.test.ts`, which failed
   with `pink: expected false to be true`. Renamed to `@pink curing salt{25%g}` with "cure #1"
   moved into the note; `units.test.ts` went green again in commit `d0b9dec`.
5. **A slug collision with a concurrent ticket.** T-001-13 wrote
   `recipes/dressings-and-dips/potato-salad.cook` while this ticket's
   `recipes/salads/potato-salad.cook` was already committed. `npm run recipes` reported the
   duplicate slug; T-001-13 removed its copy in `5709f6a` before this ticket touched anything.
   No file of another ticket's was edited from here.

## Verification at the end

```
node scripts/check-recipes.mjs                 all 497 file(s) draw a table
npm run recipes                                parsed 493 recipe(s) in 27 categories
npx vitest run                                 4 failed | 641 passed  (baseline: 4 failed | 559 passed)
grep -rl '^>> counters:.*Deli' recipes/ | wc   59
grep -rl '^>> counters: *Deli *$' | wc         25
git status --porcelain recipes/                nothing of this ticket's
```

The four failures are the same four recorded in `research.md` §7 before any file was written.
Their movement, and this ticket's contribution to it, is set out in `review.md`.
