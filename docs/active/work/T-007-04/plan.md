# T-007-04 — Plan

Fourteen `.cook` files in five commit units, each unit checkable on its own. No source outside
`recipes/**/*.cook` is touched, so there is no build wiring to sequence — the only real ordering
constraint is that a `pairs-with` pair must land together.

`node` is not on the default PATH in this environment; every command below is run with
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` first. That is an environment fact, not
a project change, and nothing is written to make it permanent.

---

## Step 0 — baseline (done)

```sh
node scripts/check-recipes.mjs
```

→ `all 658 file(s) draw a table.` and no over-cap block. Recorded so that any failure later belongs
to this ticket rather than to the two tickets running beside it.

Also done: a four-step probe file confirming a **three-branch merge** draws and tiles
(`6 rows x 3 cols, ok`), then deleted. Six of the fourteen files depend on that shape.

## Step 1 — Macaroni, noodles and things in soup (4 files)

- `recipes/soups/ham-macaroni-soup.cook`
- `recipes/noodles/luncheon-meat-and-egg-noodles.cook`
- `recipes/noodles/satay-beef-noodles.cook`
- `recipes/soups/hong-kong-borscht.cook`

Two of the ticket's three mandatory files are here (湯通粉, 餐蛋麵), and so is the file with the
sharpest single criterion (羅宋湯: no beetroot, `borscht` in `aka`, one line of prose).

**Verify before committing:**

```sh
node scripts/check-recipes.mjs --labels recipes/soups/ham-macaroni-soup.cook \
  recipes/noodles/luncheon-meat-and-egg-noodles.cook \
  recipes/noodles/satay-beef-noodles.cook recipes/soups/hong-kong-borscht.cook
grep -in 'beet' recipes/soups/hong-kong-borscht.cook     # must return nothing
```

`--labels` is not decoration here: it prints the staircase of operation cells, which is the only way
to see that a derived label reads like a cook's verb rather than a mangled fragment. Every file in
this ticket sets `>> step.N:` explicitly, so what `--labels` actually checks is that the *tree* came
out the shape the blueprint says — the indentation is the tree.

**Commit:**

```sh
lisa commit-ticket --ticket-id T-007-04 \
  --message "Write the macaroni, the packet noodles and the soup that is not borscht" \
  --include recipes/soups/ham-macaroni-soup.cook \
  --include recipes/noodles/luncheon-meat-and-egg-noodles.cook \
  --include recipes/noodles/satay-beef-noodles.cook \
  --include recipes/soups/hong-kong-borscht.cook
```

## Step 2 — the pork chop pair (2 files)

- `recipes/rice-beans-and-grains/baked-pork-chop-rice.cook`
- `recipes/rice-beans-and-grains/pork-chop-in-tomato-sauce.cook`

**These two commit together and cannot be split**: they name each other in `pairs-with`, and a
pairing at a slug that is not in the collection is a build error. This is the only ordering
constraint in the ticket.

`baked-pork-chop-rice` is the third mandatory file and the one carrying the ticket's split
judgement. What to check beyond the table drawing:

- exactly **5** operations, so the "more than six operations means two files" trigger never fires
- step 5 consumes step 3 (the tomato sauce) with `@&(~2)…{}` — the `&` the criterion asks for
- `pairs-with: egg-fried-rice, homemade-ketchup, pork-chop-in-tomato-sauce`, all three of which
  exist

```sh
node scripts/check-recipes.mjs --labels recipes/rice-beans-and-grains/baked-pork-chop-rice.cook \
  recipes/rice-beans-and-grains/pork-chop-in-tomato-sauce.cook
```

**Commit:**

```sh
lisa commit-ticket --ticket-id T-007-04 \
  --message "Write the pork chop twice — once in the pan and once under the cheese" \
  --include recipes/rice-beans-and-grains/baked-pork-chop-rice.cook \
  --include recipes/rice-beans-and-grains/pork-chop-in-tomato-sauce.cook
```

## Step 3 — the rest of the rice plates (4 files)

- `recipes/stews-and-braises/curry-beef-brisket.cook`
- `recipes/rice-beans-and-grains/minced-beef-rice.cook`
- `recipes/rice-beans-and-grains/shrimp-and-egg-rice.cook`
- `recipes/noodles/soy-sauce-pan-fried-noodles.cook`

`soy-sauce-pan-fried-noodles` is the wok-hei file and carries two surfaces that have to say
different things — a prose row about the burner, a `slack` reason about the failure. Read both
aloud before committing; if they say the same thing, one of them is the leak `voice.md` describes.

```sh
node scripts/check-recipes.mjs --labels recipes/stews-and-braises/curry-beef-brisket.cook \
  recipes/rice-beans-and-grains/minced-beef-rice.cook \
  recipes/rice-beans-and-grains/shrimp-and-egg-rice.cook \
  recipes/noodles/soy-sauce-pan-fried-noodles.cook
```

**Commit:**

```sh
lisa commit-ticket --ticket-id T-007-04 \
  --message "Write the brisket, the mince, the soft egg and the noodles a home burner can manage" \
  --include recipes/stews-and-braises/curry-beef-brisket.cook \
  --include recipes/rice-beans-and-grains/minced-beef-rice.cook \
  --include recipes/rice-beans-and-grains/shrimp-and-egg-rice.cook \
  --include recipes/noodles/soy-sauce-pan-fried-noodles.cook
```

## Step 4 — Sandwiches and buns (3 files)

- `recipes/sandwiches-and-rolls/hong-kong-egg-sandwich.cook`
- `recipes/sandwiches-and-rolls/luncheon-meat-and-egg-sandwich.cook`
- `recipes/sandwiches-and-rolls/pork-chop-bun.cook`

The one to watch is `pork-chop-bun`: the roll note has to name a real supermarket roll and stay
under the 80-character ingredient-note cap.

```sh
node scripts/check-recipes.mjs --labels recipes/sandwiches-and-rolls/hong-kong-egg-sandwich.cook \
  recipes/sandwiches-and-rolls/luncheon-meat-and-egg-sandwich.cook \
  recipes/sandwiches-and-rolls/pork-chop-bun.cook
```

**Commit:**

```sh
lisa commit-ticket --ticket-id T-007-04 \
  --message "Write the three sandwiches, and name the roll the bun actually wants" \
  --include recipes/sandwiches-and-rolls/hong-kong-egg-sandwich.cook \
  --include recipes/sandwiches-and-rolls/luncheon-meat-and-egg-sandwich.cook \
  --include recipes/sandwiches-and-rolls/pork-chop-bun.cook
```

## Step 5 — Swiss wings (1 file)

- `recipes/stews-and-braises/swiss-wings.cook`

Its own unit because it is the only file whose menu placement is unresolved, and keeping it separate
means the finding and the file are one commit apart rather than buried in four.

```sh
node scripts/check-recipes.mjs --labels recipes/stews-and-braises/swiss-wings.cook
lisa commit-ticket --ticket-id T-007-04 \
  --message "Write the Swiss wings, and the sauce that keeps" \
  --include recipes/stews-and-braises/swiss-wings.cook
```

## Step 6 — the whole collection, and the criteria

```sh
npm run check      # every .cook file, and every cap
npm run verify     # check + parse + vitest + astro build
```

`npm run verify` is the one command that must pass, and it is the acceptance criterion. It runs the
collection invariants in `src/lib/collection.test.ts` — unique slugs, **mutual pairings**, no
dangling pairing, at most one plain way per dish — which are exactly the four things a new batch of
files can break and which `check-recipes.mjs` cannot see.

**Known risk, and it is not mine to fix.** T-007-02 (deleting sixteen soups) and T-007-03 (writing
eight drink and toast files) are working the same branch in parallel. `npm run check` and
`npm run verify` read the whole tree, so a failure in their files shows up in my run. If that
happens, the review artifact names the file and the ticket that owns it rather than editing it —
`.cook` files outside this ticket are not mine, and a same-file conflict is a missing dependency
edge in the DAG, not something to patch around.

## Testing strategy

There is no unit test to add. This ticket's product is data, and the collection tests it in three
layers that already exist:

| Layer | What it catches | Command |
| --- | --- | --- |
| `scripts/check-recipes.mjs`, per file | missing metadata, unknown counter, a malformed `slack` line, a tree that will not tile, under 3 rows or 3 operations, every over-cap field | `npm run check` |
| `scripts/parse-recipes.mjs` | parser warnings, duplicate slugs, counters that do not exist | `npm run recipes` |
| `src/lib/collection.test.ts` | unique slugs, no orphan, mutual and non-dangling `pairs-with`, one plain way per dish, no timeline claiming four unbroken hours of attention | `vitest run` |

Adding a test for "this recipe is a real dish" is not possible and would be theatre. What replaces
it is the criteria checklist below, each line of which is a command or a read.

## The criteria, and how each is verified

| Acceptance criterion | How it is checked |
| --- | --- |
| ≥12 new `.cook` files, all passing the checker | 14 files; `npm run check` |
| 湯通粉, 餐蛋麵, 焗豬扒飯 among them | files 1, 2, 5 — Steps 1 and 2 |
| 羅宋湯: no beetroot, `borscht` in `aka`, one line saying what it is not | `grep -in beet` returns nothing; `aka` read; the prose row read |
| same test for every other shared English name | Design D6 — the collection was swept and 羅宋湯 is the only collision |
| two-file dishes consume the component via `&`, both argued | no dish is two files; Design D1/D2/D2b is the argument |
| `>> counters: Cha Chaan Teng` on every file | `grep -c` across the fourteen |
| `aka` carries characters + Cantonese romanisation + plain-keyboard English | read per file against `docs/knowledge/counters.md` |
| every timer named | `grep -n '~{'` across the fourteen returns nothing |
| 5–16 ingredient rows, 3–6 operations | the checker prints `N rows x M cols` per file; ops = cols − 1 |
| no specialist-shop ingredient | every ingredient row listed in `progress.md` with where it is bought |
| wok hei said or ranked out | `soy-sauce-pan-fried-noodles` says it; 乾炒牛河 ranked out in Design D4 |
| `slack` only where there is a real failure | 7 of 14 carry one; the other 7 are listed in `review.md` with why not |
| no drink, no 西多士 | nothing in `recipes/drinks/`; no file touches bread-and-egg-and-fryer |
| `npm run check` passes for the whole collection | Step 6 |
| only `recipes/**/*.cook` and the work artifacts modified | `git status --porcelain` read at the end of Step 6 |

## Deviation policy

`progress.md` records every departure from this plan with its reason, before the departure is made.
Two are already anticipated:

1. **A file that will not fit 16 rows.** The two at risk are `baked-pork-chop-rice` (~15) and
   `hong-kong-borscht` (~15). If one crosses, the row is cut rather than the cap moved — a cap is
   moved only with a measurement, and there is no measurement here that says 16 is wrong.
2. **A three-branch merge that tiles badly in a specific file.** Probed generically, not per file.
   If one fails, the fix is to chain a branch rather than to add an operation, because operations
   are columns and columns are what force a phone to scroll sideways.
