# T-001-15 — Plan

26 files in seven commits, walking down `docs/gaps/diner.md`. Each commit is a section of the
counter that stands on its own and is verified before the next one starts.

(The design counted 24 menu lines; the structure adds the two components those lines are made of
— `whipped-cream` and `hot-fudge` — for **26 files**. Both are on the gap doc's component list.)

## Verification, defined once

**Per file, in the authoring loop:**

```
node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook
```

Pass = `ok … N rows x M cols` with N ≥ 3 and M ≥ 3, **and** the printed staircase reads as a
cook's verbs. The exit code cannot see a label that says "in the with", so the `--labels` output
is read every time, not just the status. Where a derived label comes out mangled, a
`>> step.N:` line replaces it — that is what the override exists for.

**Per file, by hand — the things no script tests:**

- quantities are real for the stated `servings` (weights checked against the yield, not copied
  from a larger recipe);
- the method is the canonical one; where a common shortcut is not taken, the prose says why;
- every `~timer` is named, with a word `src/lib/time.ts` recognises (`research.md` §4);
- `title`, `category`, `tags`, `servings`, `counters` present; `aka` present wherever the board
  has another word for it, including a form typed without diacritics;
- every `pairs-with` slug exists **on disk right now** (`ls recipes/*/<slug>.cook`).

**Per commit:**

```
node scripts/check-recipes.mjs recipes/<each file in the commit>
lisa commit-ticket --ticket-id T-001-15 --message "<message>" --include <exact paths>
```

Only this ticket's paths in `--include`. No `git add`, no `git add -A`, no `git commit` — three
sibling tickets are writing to the same branch.

**At the end:**

```
node scripts/check-recipes.mjs                       # the whole collection
npm run recipes                                      # cross-file: slugs, pairings, counters
npx vitest run                                       # against the baseline recorded in step 0
git status --porcelain                               # nothing of this ticket's left behind
node -e "<the counting script from research §1>"     # ≥ 49 shelved, ≥ 20 exclusive
```

No unit tests are written. This ticket adds data, not code; `src/lib/*.test.ts` are the
integration tests over that data and `src/` belongs to T-001-17.

## Step 0 — Baseline

Record, before touching anything:

- `npx vitest run` pass/fail counts, so a pre-existing failure is not read as damage from this
  ticket;
- `node scripts/check-recipes.mjs` failures in the tree as it stands (siblings are mid-flight);
- the shelved/exclusive counts (expected 46 / 17).

## Commit 1 — The potatoes (gap ranks 1, 4)

```
recipes/fried-and-crispy/home-fries.cook
recipes/fried-and-crispy/hash-browns.cook
recipes/fried-and-crispy/corned-beef-hash.cook
```

Together because they are one method three ways — the gap doc's "blanch-then-fry potato method,
one table, three menu lines" — and writing them apart is how the diced cut and the shredded cut
end up with the same table. Risks: `hash-browns` is the thinnest file in the ticket (four
ingredients) and must still reach 3 × 3; `corned-beef-hash` pairs with `corned-beef`, a
T-001-14 file, so the pairing goes in only if `ls recipes/stews-and-braises/corned-beef.cook`
succeeds at commit time.

## Commit 2 — The gravy and the biscuit (ranks 2, 3)

```
recipes/sauces-and-gravies/creamed-chipped-beef.cook
recipes/breads/buttermilk-biscuits.cook
```

The gap doc's two "easiest fixes on the page": `sausage-gravy` has had nothing under it, and
chipped beef is the most conspicuously *named* absence at the counter. Committed together
because the biscuit is what both gravies land on. `buttermilk-biscuits` carries
`pairs-with: sausage-gravy`, which makes the pairing mutual at build time and fixes the doc's
complaint without editing another ticket's file.

## Commit 3 — The griddle and the meat choice (ranks 5, 6, 7)

```
recipes/flatbreads-and-pancakes/french-toast.cook
recipes/fried-and-crispy/breakfast-sausage-patties.cook
recipes/fried-and-crispy/scrapple.cook
recipes/sandwiches-and-rolls/pork-roll-egg-and-cheese.cook
```

Highest-risk unit. `scrapple` is a five-step chain with an overnight set and a 2-hour simmer;
its `>> time:` has to agree with the timer chain, and the loaf yield has to agree with
`servings: 12`. `pork-roll-egg-and-cheese` is written for the `aka` as much as the method —
Taylor ham and pork roll both go in, plus SPK, because nobody uses the other side's word.

Bacon and ham steak are **skipped here**, deliberately, and named in `progress.md` with the
reason: one ingredient and one operation is under the checker's floor by construction.

## Commit 4 — The eggs (ranks 8, 9)

```
recipes/eggs/eggs-benedict.cook
recipes/eggs/western-omelette.cook
```

Creates `recipes/eggs/`. Both state `>> category: Eggs` so nothing depends on the folder
title-caser. `eggs-benedict` takes `hollandaise` as an ingredient rather than re-deriving it,
and pairs with `hollandaise` and `english-muffins` — both on disk.

Verify after this commit that a brand-new category does not upset `npm run recipes`: a category
no counter claims is only a problem for a file that names **no** counter, and both of these name
`Diner`.

## Commit 5 — The plate and the case (ranks 10, 12, 18)

```
recipes/vegetables-and-sides/mashed-potatoes.cook
recipes/custards-and-puddings/apple-pie.cook
recipes/noodles/tuna-noodle-casserole.cook
recipes/toppings-and-pickles/whipped-cream.cook
```

`mashed-potatoes` finally gives `turkey-pan-gravy` something to be poured on. `apple-pie` takes
`all-butter-pie-crust` as an ingredient — the reason that file exists. `whipped-cream` rides
along because the pie and the case both want it.

`recipes/vegetables-and-sides/` may or may not exist by now (T-001-13 creates it); either way
the file states `>> category: Vegetables & Sides` and creating the folder is harmless.

## Commit 6 — The sandwich page (rank 13)

```
recipes/sandwiches-and-rolls/smash-burger.cook
recipes/sandwiches-and-rolls/patty-melt.cook
recipes/sandwiches-and-rolls/club-sandwich.cook
recipes/sandwiches-and-rolls/grilled-cheese.cook
recipes/sandwiches-and-rolls/blt.cook
recipes/sandwiches-and-rolls/tuna-melt.cook
```

The second empty printed section, filled in one commit because it is one page. `grilled-cheese`
is the thinnest table here (bread, butter, two cheeses) and is checked first, since if it cannot
reach 3 × 3 the whole unit's shape is wrong. `tuna-melt` carries its own tuna salad rather than
pairing with T-001-14's unwritten `tuna-salad` slug.

## Commit 7 — The fryer and the fountain (ranks 16, 17)

```
recipes/fried-and-crispy/french-fries.cook
recipes/fried-and-crispy/onion-rings.cook
recipes/drinks/milkshake.cook
recipes/drinks/egg-cream.cook
recipes/sauces-and-gravies/hot-fudge.cook
```

`french-fries` is the blanch-then-fry method written out in full, which commit 1 borrowed from.
`milkshake` and `egg-cream` take the `drinks` folder from one file to three. `hot-fudge` closes
the sundae the gap doc opened by noting `french-vanilla-ice-cream` has no sauce.

## After the last commit

1. Run the four end-of-ticket checks above.
2. Write `progress.md`: what landed, what was skipped and why, deviations from this plan.
3. Write the **T-001-18 note** into `progress.md` and `review.md` — the existing-file edits this
   ticket is not allowed to make:
   - `recipes/fried-and-crispy/country-fried-steak.cook` (T-001-13) → add `Diner` to `counters:`;
     it is gap rank 14, chicken fried steak.
   - `recipes/sauces-and-gravies/cream-gravy.cook` (T-001-13) → add `Diner`; it is the component
     list's milk gravy.
   - `recipes/stews-and-braises/meatloaf.cook` (T-001-13) → add `Diner`; gap rank 15.
   - `recipes/salads/tuna-salad.cook` (T-001-14) → add `Diner` if written, so the melt and the
     salad are one dish at two counters.
4. Write `review.md` and `review-disposition.json`, then run
   `lisa check-disposition T-001-15` and fix anything it reports.
5. Stop. Do not touch the ticket frontmatter; do not start another ticket.

## What would make this block

- A slug collision with a sibling that lands first — resolved by dropping the file and recording
  it for T-001-18, not by renaming the dish.
- `npm run recipes` failing on a dangling `pairs-with` — resolved by removing the pairing.
- A file that cannot reach 3 × 3 without inventing ingredients — resolved by skipping it with a
  reason, which is what criterion 2 asks for.

None of these are expected to require a `block` disposition; all three have a remedy inside this
ticket.
