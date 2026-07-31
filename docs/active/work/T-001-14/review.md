# T-001-14 — Review

**Disposition: pass.** Eighteen recipes written, both acceptance counts cleared with margin,
one self-inflicted parse bug found by the collection tests and fixed, three pre-existing test
failures re-measured and attributed.

## What changed

Eighteen files created under `recipes/**`, one of them in a new folder. Nothing modified,
nothing deleted, nothing outside `recipes/**`.

| Path | Rows × cols |
| --- | --- |
| `recipes/smoked-and-grilled/pastrami.cook` | 14 × 7 |
| `recipes/stews-and-braises/corned-beef.cook` | 14 × 6 |
| `recipes/dressings-and-dips/russian-dressing.cook` | 10 × 4 |
| `recipes/sauces-and-gravies/schmaltz.cook` | 5 × 5 |
| `recipes/soups/chicken-broth.cook` | 11 × 5 |
| `recipes/soups/matzo-ball-soup.cook` | 13 × 5 |
| `recipes/salads/potato-salad.cook` | 13 × 5 |
| `recipes/salads/macaroni-salad.cook` | 14 × 4 |
| `recipes/salads/egg-salad.cook` | 10 × 5 |
| `recipes/salads/tuna-salad.cook` | 9 × 4 |
| `recipes/salads/chicken-salad.cook` | 13 × 5 |
| `recipes/salads/whitefish-salad.cook` | 9 × 4 |
| `recipes/dressings-and-dips/chopped-liver.cook` | 9 × 4 |
| `recipes/dressings-and-dips/cream-cheese.cook` | 5 × 6 |
| `recipes/dressings-and-dips/scallion-schmear.cook` | 6 × 4 |
| `recipes/cured-fish/belly-lox.cook` | 6 × 6 |
| `recipes/toppings-and-pickles/sauerkraut.cook` | 5 × 6 |
| `recipes/dumplings-and-rolls/potato-knish.cook` | 15 × 5 |

**One new folder: `recipes/cured-fish/`, category `Cured Fish`.** Reasoning in `design.md`:
twenty-two existing folders and none of them honest about a raw salt cure —
`smoked-and-grilled` would be a lie in the URL and `toppings-and-pickles` makes the appetizing
counter's headline item a garnish. The folder is where sable, kippered salmon and the two
herrings go next, and every one of those is a cure plus a heat step.

Eight commits, all through `lisa commit-ticket --ticket-id T-001-14` with exact `--include`
paths: `04f4691`, `c4dcfbe`, `1c08d97`, `5352a97`, `92b1382`, `683f818`, `897d3c0`, `d0b9dec`.

## Acceptance criteria, one by one

| Criterion | Evidence |
| --- | --- |
| Deli shelves ≥ 44 | **59.** `grep -rl '^>> counters:.*Deli' recipes/ \| wc -l`. Was 41 |
| ≥ 12 name it and no other counter | **25.** `grep -rl '^>> counters: *Deli *$' recipes/ \| wc -l`. Was 8; 17 of the 18 new files are Deli-only, `potato-salad` also names Meat and Three |
| Top of `docs/gaps/deli.md` written, in order | Ranks **2, 3, 4, 6, 7, 8, 9, 10, 11** complete, plus four entries from the components list (curing brine as steps, clear broth, schmaltz, matzo balls, cream cheese). Ranks 1 and 5 were already written before this ticket. Everything skipped is named with a reason in `progress.md` |
| `check-recipes --labels` ok, staircase reads as verbs | All 18 `ok`. Full staircases quoted in `progress.md`; e.g. `stir the brine / brine 5 days, turn daily / rinse, soak 2 hr, pat dry / press on the pepper and coriander / smoke 6 hr at 225°F (107°C) / steam 2 hr, rest 30 min, slice by hand` |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | All 18 carry all six, plus `time`, `pairs-with` and per-step labels. Diacritic-free forms given wherever the board's word carries a diacritic: `kapusta kiszona`, `knysh`, `matza ball soup`, `shmear`, `griven` |
| Every timer named | Every `~` in all 18 files carries a name, and every name is one `src/lib/time.ts` recognises, so the attention reading comes from the author rather than from a guess |
| Quantities real for the servings | Hand-checked per file. 5 lb of navel to serve 8 (a deli pile is half a pound); 2% salt by weight for the kraut, which is the recipe rather than a seasoning; 40 g salt to 2 kg cabbage; 500 g of salt to a 900 g side of salmon, because that cure is a burial and not a sprinkle |
| Canonical method, not a shortcut | Notes below |
| Only `recipes/**` modified | `git status --porcelain recipes/` shows nothing of this ticket's; every commit's `--include` list is `recipes/…` only |

## Where the method was the point, not the shortcut

- **Pastrami is steamed.** The gap doc names the steam twice and it is the operation that
  separates this from smoked brisket, so the table ends on `steam 2 hr` and the prose says
  outright that a home slicer makes it into something else.
- **The two cures are identical on purpose.** `pastrami` and `corned-beef` share step 1 word
  for word and part at step 4. The doc asked for "a table saying out loud" what the difference
  is; two tables that agree for three steps is that sentence.
- **Sauerkraut is a ferment, not a pickle.** 2% salt, its own brine, three weeks at 18 °C, and
  a closing line that cooked kraut from a can is a different food.
- **Belly lox is salt alone.** No sugar, no dill — sugar makes gravlax. The file says what nova
  is, why it is not writable here, and that hot smoke gives kippered salmon instead.
- **Chopped liver is broiled and hand-chopped.** Broiling is the traditional draw of the blood
  and gives a liver that chops instead of smearing; the file points at `pork-liver-pate` for
  anyone who wanted the processor version.
- **Matzo balls poach in salted water, not in the broth**, and rest before shaping. The file
  commits to floaters and says so.
- **Cream cheese is cultured and set with rennet**, not blended cottage cheese, and the note
  about the foil brick being gum-stabilised is why the home one is looser.

## Test coverage

This ticket adds data, not code. There are no unit tests to write; the tests over this data are
the collection-level ones in `src/lib/*.test.ts`, and `src/` belongs to T-001-17.

`npx vitest run` → **4 failed / 641 passed**, against a recorded baseline of **4 failed / 559
passed** taken before any file was written (`research.md` §7). Same four tests, same causes:

| Test | Baseline | Now | This ticket's part in it |
| --- | --- | --- | --- |
| `icons` — recognises every verb | 46 fall-throughs | 56 | **None.** Checked verb by verb: not one of the 56 comes from a file in this ticket. The ten new ones (`build`, `clarify`, `frizzle`, `mould`, `notch`, `perfume`, `slacken`, `throw`, `tie`, `wring`) arrived with other counters' files while this ticket ran |
| `schedule` — are the three ferments | expects `sour-dill-pickles, injera, pizza-dough`, got `sour-dill-pickles, ginger-garlic-paste, lime-pickle` | `sour-dill-pickles, sauerkraut, ginger-garlic-paste` | **`sauerkraut` is now second-longest** at 33 150 min, so it displaces one entry of a list that was already wrong before this ticket. The assertion is a hard-coded slug list in `src/`, which this ticket may not edit |
| `schedule` — authors' claims agree within a few percent | fails at 2015 (`ginger-garlic-paste`) | fails at 2015, same recipe | **None, deliberately.** Every new file's `>> time:` was checked against its own timer chain: `sauerkraut` 0.0% drift, `pastrami` 0.0%, `corned-beef` 0.0%, `belly-lox` 0.0%, `cream-cheese` 2.0%, `chicken-broth` 2.2%. The failure is `ginger-garlic-paste` claiming minutes its timers do not |
| `shopping` — an aisle for nearly everything | 54/790 = 6.8% (gate 2%) | 86/901 = 9.5% | **Five names.** `schmaltz` (4 uses), `pickling spice` (2), `liquid rennet`, `prepared horseradish`, `chili sauce`. None of the five appears anywhere in `src/data/aisles.json` under any spelling, so no honest rename would place them; the file is `src/`-side and not this ticket's |
| `units` — adds up every ingredient | passing | passing | **Broken and repaired inside this ticket.** See below |

**The one real bug, and how it surfaced.** `@pink curing salt #1{25%g}` looks fine and tiles
fine: cooklang read the `#1` as cookware, cut the ingredient short at `@pink`, and left the
25 g dose attached to nothing. `check-recipes.mjs` passed it — the table still drew — and
`units.test.ts` caught it with `pink: expected false to be true`. Renamed to
`@pink curing salt{25%g}` with "cure #1" moved into the note, fixed in `d0b9dec`, and
`units.test.ts` is green again. Worth knowing generally: **a `#` inside an ingredient name is a
cookware marker**, and the per-file checker cannot see the damage.

## Open concerns, for whoever picks this up

1. **The Deli's menu sections do not list any of this yet.** `src/data/counters.json` is
   T-001-17's file. Until it names them, these eighteen reach the site only through their
   categories. The five sections the gap doc called empty now have items behind them: the
   slicer (`pastrami`, `corned-beef`), the smoked-fish case (`belly-lox`, `whitefish-salad`),
   salads by the pound (five files), the hot case (`potato-knish`, `matzo-ball-soup`), and the
   spread case (`chopped-liver`, `cream-cheese`, `scallion-schmear`, `russian-dressing`).
2. **Five ingredient names want an aisle** (above). One line each in `src/data/aisles.json`
   would take a tenth of a percent off a ratio that is currently 4.75× its gate for reasons
   that mostly predate this ticket.
3. **`schedule.test.ts`'s three-ferment list is now wrong by four recipes**, one of them this
   ticket's. Whoever owns `src/lib/*.test.ts` should decide whether that assertion should name
   slugs at all, or should assert the shape (three long unattended ferments) instead.
4. **`recipes/cured-fish/` holds one file.** That is deliberate and it is argued in `design.md`,
   but a reviewer who disagrees has one file to move, not eighteen.
5. **Ranks 12–25 of the gap doc are untouched** and are a coherent next ticket: the Italian
   side (roast pork, broccoli rabe, hot pepper relish, Dutch crunch, swirl rye), the Polish side
   (pierogi, kiełbasa, Leberkäse, kishka), the appetizing herrings, and the egg cream — which
   would be the site's second drink.
6. **A concurrent-ticket collision happened and was resolved by the other side.** T-001-13
   briefly wrote a second `potato-salad.cook` in another folder; `npm run recipes` reported the
   duplicate slug and T-001-13 removed its copy in `5709f6a`. Nothing was edited from here. If
   the salad case and the cafeteria line are going to keep meeting, that is a missing dependency
   edge between those two tickets rather than a file problem.
