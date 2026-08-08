# T-007-03 — Progress

Complete. Eight new `.cook` files, five commits through `lisa commit-ticket`, nothing else
touched.

---

## Commits

| Commit | What |
| --- | --- |
| `e2941f6` | Write the Hong Kong milk tea |
| `209641d` | Write the yuenyeung on top of the milk tea |
| `ca44889` | Write the rest of the drinks counter |
| `17190f6` | Write the toast: 西多士 and 厚多士 |
| `ba4e886` | Open every operation cell with a verb the icon map knows |

Every one used exact `--include` paths. No ordinary `git add`, no `git commit`, nothing left
staged, modified or untracked in `recipes/`.

## The eight files, as built

Shapes are what `node scripts/check-recipes.mjs --labels` reported, not what was planned.

| File | Reported | Ops | Matches `structure.md`? |
| --- | --- | --: | --- |
| `recipes/drinks/hong-kong-milk-tea.cook` | 5 rows × 5 cols | 4 | yes |
| `recipes/drinks/yuenyeung.cook` | 5 rows × 4 cols | 3 | yes |
| `recipes/drinks/iced-lemon-tea.cook` | 5 rows × 4 cols | 4 | yes |
| `recipes/drinks/lemon-coke-with-ginger.cook` | 3 rows × 4 cols | 3 | yes |
| `recipes/drinks/red-bean-ice.cook` | 6 rows × 5 cols | 4 | yes |
| `recipes/drinks/horlicks.cook` | 5 rows × 4 cols | 3 | yes |
| `recipes/flatbreads-and-pancakes/hong-kong-french-toast.cook` | 7 rows × 5 cols | 5 | yes |
| `recipes/flatbreads-and-pancakes/thick-toast.cook` | 3 rows × 4 cols | 3 | yes |

## Deviations from the plan

**One, and it cost a whole commit: every operation cell has to open with a verb the icon map
already knows.** `src/lib/icons.test.ts` collects the first word of every operation cell in the
collection and fails if `matchOperation()` returns null for it. Twelve of this ticket's opening
words fell through — `beans, cold, condensed, lemon, milk, paste, peanut, pull, smash, sweeten,
the, two` — and the test's own advice is to add them to `VERB_ICONS` in `src/lib/icons.ts`,
which this ticket does not own.

Nothing in `README.md`, `docs/knowledge/voice.md` or the ticket says this rule exists. It was
found by running `vitest`, not by reading. Thirteen cells were reworded to open with `pour`,
`press`, `stir`, `simmer`, `spoon`, `spread` or `lay`. **The rewording made the cells better** —
voice.md asks for "the verb and its numbers" and half of these had been opening with a noun —
so this is recorded as a deviation rather than a complaint.

The one that cost something real: the pull cell was `pull it through the bag 3 to 6 times,
steep 6 min` and is now `pour it back through the bag, 3 to 6 pulls, steep 6 min`. Same
operation, same count, same timer; `pull` is not a verb the icon table knows and `pour` is.
撞茶 is literally *pour-hit*, so the wording is not a retreat, but a collection that draws a
picture beside every operation should probably know the word. **Finding for whoever owns
`src/lib/icons.ts`: `pull`, `paste`, `smash` and `sweeten` are all real cooking verbs missing
from `VERB_ICONS`.**

Everything else went as `plan.md` said, including the two risks that were called out:
`~simmer{2-3%min}` parses fine with a name on it, and neither `@&(~2)` mis-targeted.

## Verification run

```
npm run check      all 664 file(s) draw a table.        (nothing over cap)
npm run recipes    parsed 664 recipe(s) in 27 categories
                   counters: 664 named, 0 inferred · timers in 640 · pairings 770
npx vitest run     10 files, 856 tests, all passing
npx astro build    688 page(s) built
```

`664` rather than the `666` `plan.md` predicted: T-007-02 and T-007-04 are landing on the same
branch in parallel and the collection's total moved under this ticket while it ran. The eight
files this ticket added are all present and all `ok`.

## Every number in `hong-kong-milk-tea`, checked against its source

The one thing no test can check. Read line by line against `design.md` §4:

| In the file | Source |
| --- | --- |
| 65 % fine cut / 35 % coarse | 自由時報 (幼茶 65 %, 粗茶 25 %, 中茶 10 % — the two coarse grades added) |
| 6 tea bags + 7 g loose = 20 g leaf : 600 mL water (1 : 30) | 自由時報, 1g茶粉：30g水 |
| 90–96 °C | 自由時報, 沖茶最佳溫度在90～96℃之間 |
| `~simmer{2-3%min}` | 自由時報, 小火煮約2～3分鐘 |
| 3 to 6 pulls | 自由時報 3–4 · teavoya 4–6, printed as the union |
| `~steep{6%min}` | hk01 / 謝忠德師傅, 焗6分鐘 |
| 180 mL evaporated milk to ~420 mL tea, 7 : 3 | all three sources, 茶和奶的比例大概是7比3 |
| "there is no standard" (the prose row) | HK intangible-heritage listing 2017, 並無統一標準 |

**No other number appears in the file.** The 25-minute `time:` is the sum of the timers plus
the kettle, which is how every file in the collection states it.

## What was written up rather than committed

**菠蘿油.** Two ingredients — a warm `pineapple-bun` and a cold slab of butter — and
`check-recipes.mjs` fails under three ingredient rows. Written, run, and deleted rather than
committed:

```
FAIL   …/pineapple-bun-with-butter.cook
       - only 2 ingredient row(s) — too thin to be a table
```

The work list (rank 21) asked for "a short assembly file that pairs to the bun". The floor is
in `check-recipes.mjs:` `if (grid.rowCount < 3)`. Padding it to three rows would mean adding
condensed milk, an egg or cheese — each a different printed item, none of them 菠蘿油 — so the
file is not written and the handoff to T-007-05 is a section note instead. Full argument in
`design.md` §2; the exact note is in `review.md`.

`horlicks` was written in its place, so the count is eight.

## Nothing else was touched

```
$ git status --porcelain | grep recipes/
(nothing)
```

`src/generated/recipes.json` is rebuilt by `npm run recipes` and is gitignored. No `src/` file,
no `docs/gaps/` file and no existing `.cook` file was edited. `>> pairs-with:` reaches
`french-toast`, `red-bean-paste`, `white-sandwich-bread` and `hong-kong-milk-tea`; mutuality is
applied at build time, so none of those files changed on disk.
