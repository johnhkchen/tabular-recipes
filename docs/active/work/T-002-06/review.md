# T-002-06 — Review

**Twelve leafy and composed salads, all on The Bowl Shop shelf, in four commits.** The Leafy
salads section of `docs/gaps/bowl-shop.md` went from three ranked holes and nothing written to
twelve files. No pre-existing file was edited, nothing outside `recipes/**` was touched, and the
whole collection is green.

---

## What changed

### Created — twelve files, all in `recipes/salads/`

| Slug | What it is | Table | Made or cooked in it | Dressing |
| --- | --- | --- | --- | --- |
| `kale-caesar` | gaps rank 6 | 10 × 4 | croutons baked with garlic and parmesan; kale rubbed down | `pairs-with: caesar-dressing` |
| `shaved-brussels-salad` | gaps rank 7 | 8 × 4 | hazelnuts toasted and skinned; sprouts stood in lemon | built in the bowl |
| `italian-chopped-salad` | gaps rank 13, *The Goop Father* | 15 × 4 | chickpeas crisped; six things cut to one half-inch | built in the bowl |
| `chinese-chicken-salad` | gaps rank 13, *Brentwood* | 14 × 4 | wontons fried; chicken poached and pulled by hand | `pairs-with: goma-dare` |
| `harvest-chopped-salad` | gaps rank 13, *Fall Harvest* | 15 × 4 | delicata roasted; pecans candied; kale rubbed | `pairs-with: basic-vinaigrette` |
| `cobb-salad` | the board | 11 × 4 | bacon rendered, eggs boiled to eight minutes, chicken poached | `pairs-with: blue-cheese-dressing` |
| `wedge-salad` | the board | 10 × 3 | bacon in lardons; shallots quick-pickled | `pairs-with: blue-cheese-dressing` |
| `greek-salad` | the board (horiatiki) | 11 × 4 | tomatoes salted for their juice; oregano oil warmed | built in the bowl |
| `panzanella` | the board | 10 × 4 | bread fried gold-edged and soft-middled | built — the tomato water |
| `spinach-salad` | the board | 9 × 5 | bacon rendered, mushrooms seared in the fat, dressing built in the pan | built in the pan |
| `salade-nicoise` | the board | 15 × 4 | potatoes boiled, beans blanched, eggs boiled, tuna seared | built in the bowl |
| `roasted-beet-salad` | the board (gaps rank 21 names the hole) | 14 × 4 | beets roasted in a parcel; walnuts candied; goat cheese marinated | `pairs-with: basic-vinaigrette` |

### Modified

`recipes/salads/kale-caesar.cook`, once, after it was first committed — see *The one real
problem* below. Nothing else.

### Not touched

`src/lib/icons.ts`, `src/data/counters.json`, `docs/gaps/bowl-shop.md`, and every one of the 40
dressing files. `src/generated/recipes.json` was regenerated and is gitignored.

### Commits

| Commit | Message | Files |
| --- | --- | --- |
| `bb2962a` | The kale, the sprouts and the three chopped salads | 5 |
| `d66ba6b` | Bacon three ways over a leaf | 3 |
| `b43462f` | Four that dress themselves | 4 |
| `9f45c89` | Open the parmesan step with a verb the icon table knows | 1 (the fix) |

All four through `lisa commit-ticket --ticket-id T-002-06` with exact `--include` paths. No
ordinary `git add` or `git commit` was run.

---

## Acceptance criteria, one at a time

| Criterion | Evidence |
| --- | --- |
| ≥10 new `.cook` files, each `counters: The Bowl Shop`, each leafy or composed | **12.** Audited: the line is exact on all twelve |
| Real work: ≥3 non-tossing operations and ≥1 made or cooked component | Thinnest is `wedge-salad` and `kale-caesar` at 3 non-tossing operations each; deepest is `salade-nicoise` at 7. Every file has a made component; the table above names it |
| No salad re-teaches an existing dressing | Six reference a drawer dressing by slug and take it as one ingredient row. Five build a dressing that **does not exist in the drawer** — warm bacon vinaigrette, tomato water, oregano oil, anchovy-lemon, lemon-and-pecorino. Checked each against `ls recipes/dressings-and-dips/` |
| Every `pairs-with:` slug confirmed to exist | `caesar-dressing`, `sourdough-boule`, `basic-vinaigrette`, `goma-dare`, `miso-ginger-dressing`, `blue-cheese-dressing`, `ranch-dressing`, `tzatziki`, `pita-bread`, `fattoush`, `ciabatta`, `kale-caesar`. `npm run recipes` rejects a slug naming no file and it passes |
| Nothing duplicates the ten in `recipes/salads/` | The ten were listed first. Six are deli-case salads, four belong to other counters; no overlap with any of the twelve |
| The top of the gaps salad list written, in order; skips named | Ranks 6, 7 and 13 written first, in that order. Rank 13 is three items on Goop's board and all three were written. **Nothing in the salad list was skipped** — the list holds only those three, which is why nine of the twelve came from elsewhere. See *Where the other nine came from* |
| `check-recipes.mjs --labels` ok for every new file, staircase reads as a cook's verbs | All twelve `ok`. Staircases read in `progress.md`; each one is a sequence of verbs a cook says |
| Every timer named | Audited: **zero** bare `~{` in the twelve |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | Audited: none missing |
| Only `recipes/**` modified; no pre-existing file edited | `git log --stat` on the four commits: twelve creations and one edit to a file this ticket created |

## Where the other nine came from

The acceptance criterion says to write the top of the gaps page's salad section *as far as the
count reaches*. The section reaches three: rank 6 (Kale Caesar), rank 7 (Shaved Brussels) and
rank 13 (a chopped salad, which Goop prints as three). Written in that order, that is five
files against a floor of ten.

The other seven — cobb, wedge, greek, panzanella, spinach, niçoise, roasted beet — come from the
same source the gaps page itself was built from: the American composed-salad board that Goop,
Sweetgreen, Cava and Dig all print alongside their own inventions, and that had **zero**
representation on a site with 40 dressings. Each one was chosen for the same reason the ticket
gives: it has cooking in it. Nothing was skipped and nothing was invented to reach a number.

## Verification

```
node scripts/check-recipes.mjs      all 589 file(s) draw a table
npm run recipes                     parsed 589 recipe(s) in 27 categories
                                    589 counters named, 0 inferred, timers in 566, pairings 670
npx vitest run                      Test Files 8 passed (8) · Tests 756 passed (756)
```

589, not 565, because T-002-05 and T-002-07 landed their files on the same branch during this
ticket. The full suite is green at the moment of writing, including the two tests that can only
fail from outside a single file: `icons.test.ts` (every operation verb has an icon) and
`collection.test.ts` (pairings resolve and are mutual, slugs unique, counters known).

## The one real problem, and how it was handled

The first pass wrote `>> step.4: shave over` in `kale-caesar`. It passed its own check — the
checker knows nothing about icons — and failed `icons.test.ts`, which collects the leading verb
of every operation label in the whole collection and asserts the icon table knows each one.
`shave` is not in `VERB_ICONS`.

Two fixes were available: add `shave` to `src/lib/icons.ts`, or reword. **Rewording was chosen**
because this ticket may only modify `recipes/**`, and the label is better for it —
`peel into wide sheets`, with a step that opens `Peel @parmesan{2%oz} into wide sheets with a
vegetable peeler`, names the actual tool. Committed separately as `9f45c89`.

Worth flagging for whoever reads this shelf as a whole: **the icon verb table is a
collection-wide coupling that no per-file check can see.** The same run named five more verbs
from T-002-05's and T-002-07's files (`break`, `dry`, `pull`, `scrub`, `spice`); both tickets
fixed their own within the hour, the same way. Three tickets hit the same trap independently on
one story.

## Open concerns

1. **`wedge-salad` is three columns**, the checker's floor. It is honest — four operations, three
   of them branches that merge in one place — but it is the thinnest table of the twelve, and a
   reviewer who wants a deeper tree would be right to say so. What it has instead is a made
   pickle and a rendered lardon, which is what the ticket asked for.
2. **Subject overlap with T-002-07, by design and not by file.** `roasted-beet-salad` roasts
   beets and T-002-07 wrote `roasted-beets`; `italian-chopped-salad` crisps chickpeas and
   T-002-07 wrote `crispy-chickpeas`; `harvest-chopped-salad` roasts squash. These are not
   duplicates: the component recipe teaches the component and the salad's branch does it at the
   cut and quantity that salad wants. **T-002-08 should decide whether the salads' `pairs-with:`
   lines should name those components** once both tickets are sealed — this ticket could not,
   because those files did not exist when its pairings were written.
3. **Three files render bacon** (`cobb`, `wedge`, `spinach`). The plan set a gate to cut one if
   they read as one recipe; the side-by-side read kept all three, because the bacon is diced into
   a stripe, speared as a lardon, and turned into a warm dressing respectively. A reviewer who
   disagrees loses `wedge-salad` and still has eleven.
4. **`italian-chopped-salad` wanted to pair with an Italian sub and there is none on the site.**
   No hero, no hoagie, no Italian sub under any slug. That is a Deli-shelf hole, not this
   ticket's, and it is recorded here so it is not lost.
5. **The Bowl Shop's menu items are still empty** in `src/data/counters.json`. T-002-08 fills
   them and renames the gaps page's `## What is already here` block to `## What it has`. The
   twelve slugs above belong under **Leafy salads**, in the order of the table.

## What is not covered by any test

Whether these are good salads. The suite proves each one draws a table, names a known counter,
pairs with something real and opens every operation with a verb the icons know. It cannot prove
that the paragraph under each step says something a cook did not already know — the standard the
existing collection sets. That judgement was made by reading each file against `fattoush`,
`som-tum` and `larb-gai`, and it is the thing a human reviewer should spend their time on.
