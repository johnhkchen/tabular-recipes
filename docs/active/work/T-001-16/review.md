# T-001-16 — Review

## What this is

The Bakery counter had the loudest empty section on the site: nothing in the whole collection
was laminated. This ticket writes the laminated case — a yeasted croissant dough as its own
table, the three things cut from it, and the almond cream one of them needs — plus the pineapple
bun, the next entry on the gap list that was still genuinely missing.

Six files created. Nothing modified, nothing deleted, nothing outside `recipes/`.

```
recipes/pastry-and-doughs/croissant-dough.cook     Bakery              7 rows x 5 cols
recipes/pastry-and-doughs/croissant.cook           Bakery              4 rows x 5 cols
recipes/pastry-and-doughs/pain-au-chocolat.cook    Bakery              5 rows x 5 cols
recipes/pastry-and-doughs/almond-croissant.cook    Bakery              8 rows x 6 cols
recipes/custards-and-puddings/frangipane.cook      Bakery              8 rows x 5 cols
recipes/breads/pineapple-bun.cook                  Bakery, Dim Sum     18 rows x 6 cols
```

Five commits, all through `lisa commit-ticket` with exact `--include` paths: `27c9244`,
`40dfc94`, `4055911`, `c7b2681`, `e6aed06`.

## Acceptance criteria, one by one

**1. Bakery shelves ≥ 97, of which ≥ 62 name it and no other counter.**

| | Before | After | Threshold |
|---|---|---|---|
| Bakery shelves | 99 | **107** | ≥ 97 |
| Bakery only | 58 | **63** | ≥ 62 |

Counted the way `parse-recipes.mjs` resolves membership: the `>> counters:` line, with the
`counters.json` category fallback for files that name none (there are none — all 514 files name
their counters explicitly). The shelved figure was already over threshold at baseline and has
since been pushed further by sibling tickets; the exclusive figure is this ticket's, five of the
six new files being Bakery and nothing else.

**2. The dishes at the top of `docs/gaps/bakery.md`, in order.**

Gap item **1** (croissant, pain au chocolat, almond croissant) is written complete, including
the two components it stands on. Gap item **2** (egg custard tart) was already written —
`custards-and-puddings/egg-custard-tart.cook`, one of the stale entries the ticket warned about.
Gap item **3** is the pineapple bun, written here.

Skipped, and why:

- **Bo lo yau** (gap 3's second half) — a finished bun cut open with a cold slab of butter in it.
  One operation and two ingredients, under both of `check-recipes.mjs`'s floors, and the gap
  doc's own "the knife is the customer's" rule covers it.
- **Gap items 4–22** (anpan, danish, éclair, fruit tart, turnover, doughnut, and the rest) —
  below the line the count reaches. Each needs a component of its own (a Japanese bun dough,
  danish dough, choux paste, an enriched fried base), which is another ticket's work rather than
  a tail on this one.

**3. `check-recipes.mjs --labels` reports ok, and the staircase reads as a cook's verbs.**

All six `ok`. The staircases, verbatim from `--labels`:

```
croissant-dough    mix → beat the block → fold round the block → fold in three (×3) → rest
croissant          roll the sheet → cut triangles → proof → [beat the wash] → brush and bake
pain-au-chocolat   roll and cut → roll two batons in → proof → [beat the wash] → brush and bake
frangipane         cream → beat the eggs in → fold the almond through → stir in the rum, chill
almond-croissant   boil the syrup → halve and soak → pipe the filling → top and bake → dust
pineapple-bun      cook the paste → mix and knead → knead the butter in → [cream the lid] → portion and drape → brush and bake
```

Three labels were reworded late (`shut` → `fold`, `lay` → `roll`, `ball` → `portion`) after the
icons test showed `shut` falling through to the fallback icon from this ticket's files alone.
Details in `progress.md`.

**4. `title`, `category`, `tags`, `servings`, `counters` on every file, plus `aka` with an
undiacriticked form.** Present on all six. The `aka` lines carry the accented form and a plain
one: `pâte à croissant` / `pate a croissant`, `crème d'amande` / `creme d'amande` /
`creme damande`, `菠蘿包` / `bo lo bao` / `bolo bao` / `boh loh bao`. `pain-au-chocolat` also
carries `chocolatine`, which is what half of France orders it by.

**5. Every timer named.** `grep -n '~{'` across the six returns nothing. Timers are
`~chill`, `~firm`, `~rest`, `~proof`, `~bake`, `~cool`, `~knead`, `~rise`.

**6. Quantities real, method canonical.** See the next section — this is the part no script
checks.

**7. Only `recipes/**` modified.** `git status` on the ticket's paths is clean, and
`src/generated/` is gitignored, so regenerating `recipes.json` for verification left no tracked
change. `src/data/counters.json` was not touched.

## The judgement calls a reviewer should actually check

Everything above is machine-verified. These are not, and they are where a wrong recipe would hide:

- **250 g butter into 500 g flour** in the croissant dough — a 50% lamination. That is the
  bakery ratio; home recipes often halve it, and the result is a bread roll with layers.
- **Three folds, not four.** `hojaldre` (puff pastry, unyeasted) takes four. A yeasted laminate
  takes three: a fourth thins the layers past the point where the yeast can lift them. The step
  text says so, because it is the single most common way this dough is got wrong.
- **A cold overnight bulk** rather than a warm rise. It is flavour, and it is also what brings the
  dough to the same firmness as the butter block, which is the whole trick of lamination.
- **Day-old croissants** in the almond croissant. Written into the ingredient note as a
  requirement, not a preference — the pastry exists to sell yesterday's case, and a fresh
  croissant collapses into paste in the syrup.
- **Baker's ammonia and custard powder** in the pineapple bun lid, and **lard** alongside the
  butter. This is the Hong Kong bakery formula. Baking powder is the common home substitution
  and gives a lid that spreads smooth instead of cracking into the grid the bun is named for;
  the step text says that rather than leaving it as folklore.
- **Equal weights** butter, sugar, egg and almond flour in the frangipane. That is the
  definition of the thing; the tablespoon of flour is structural.
- **Proof times** — 2 hr for shaped croissants at room temperature, 45 min for the buns. Both are
  written as "until they wobble" / "until light" as well as by the clock, since the clock is the
  weaker of the two signals.

## Test coverage

There is no unit-test surface here; the deliverable is data. Coverage came from the three gates
the project already provides:

- **Per file** — `check-recipes.mjs`, which runs the real `buildTree` and `layout` from
  `src/lib/`, so an `ok` file is one the site will render. Catches missing metadata, unknown
  counters, tiling errors, the 3-row / 3-column floors, and unlabelled operation cells.
- **Collection-wide** — `npm run recipes`: unique slugs, `pairs-with` targets resolve, counter
  names known, nothing homeless. 512 recipes parsed clean at the time of the run.
- **Whole build** — `npm run verify`.

**Gap, stated plainly:** none of this checks whether a recipe *works*. A file with 5 g of yeast
where it needs 7 g, or a 90-minute proof written as 20, checks `ok` and bakes badly. The bullet
list above is the part that needs a baker's eye, not a green check.

## Open concerns

### 1. `npm run verify` is red — four tests, all pre-existing

```
FAIL icons.test.ts    > recognises every verb the recipes open an operation with
FAIL schedule.test.ts > the recipes with the longest critical path are the three ferments
FAIL schedule.test.ts > ... agree with what their authors claim, within a few percent
FAIL shopping.test.ts > finds an aisle for nearly everything, and reports what is left
```

Not taken on trust. A detached worktree at `27c9244~1` — the commit immediately before this
ticket's first — was parsed and tested in isolation and produced **the same four failures**
(`4 failed | 641 passed`). They are collection-wide assertions that every in-flight ticket
moves: the schedule failures now name `sauerkraut` and `ginger-garlic-paste` as the longest
ferments, neither of which is this ticket's, and 86 of the 89 unmatched shopping ingredients
predate it.

**This needs a human decision, but not from this ticket.** Those three assertions are pinned to
a collection that has roughly doubled — the schedule test hard-codes three slugs, and the
shopping test's 2% threshold is at 9.7%. They will keep failing as the board fills. Someone
should decide whether they are re-pinned, relaxed, or the aisle map is filled in; T-001-17 or
T-001-18 is the natural home.

### 2. Three new ingredients have no shopping aisle

`frangipane`, `croissant dough` and `baker's ammonia` fall through the aisle map. The map is in
`src/lib/`, which this ticket is explicitly forbidden to touch ("the menu sections and the
shopping aisles are T-001-17's"). The first two are the same shape as `hojaldre`, `pizza dough`,
`char siu` and `blind-baked tart shells` — recipes consumed as ingredients by other recipes,
already unmatched. **Handoff to T-001-17.**

### 3. The new recipes do not appear in the printed Bakery sections

`counters.json` gives Bakery an explicit `sections[]` list, and its "Doughs and shells" section
names only `all-butter-pie-crust` and `sweet-tart-shell`. The six new files reach the Bakery page
through their `>> counters:` line, but where they sit on the printed board is an `src/` edit.
**Handoff to T-001-17** — the laminated case wants its own section heading.

### 4. `docs/gaps/bakery.md` is now stale in one more place

Its component list says "no pastry shell of any kind exists on the site" (untrue since
`sweet-tart-shell`) and "nothing in the collection is laminated" (untrue since `hojaldre`, and
now doubly so). Not corrected here — the ticket scopes this to `.cook` files, and the gap docs
look like T-001-18's ground.

## Nothing blocking

Every acceptance criterion is met and measured. The red tests are inherited, proven so against a
baseline build, and belong to whoever owns `src/lib`. Disposition: **pass**.
