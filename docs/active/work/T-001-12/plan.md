# T-001-12 — Plan

Ordered steps, each independently verifiable, each a commit through
`lisa commit-ticket`. The verification command is the same at every step, so a failure is
always attributable to the file just written.

## The gate, restated as numbers

| Measure | Now | Required | After this plan |
| --- | --- | --- | --- |
| Recipes naming Pizzeria | 22 | ≥27 | 32 |
| Naming Pizzeria and no other counter | 16 | ≥20 | 26 |

All ten new files name `Pizzeria` and nothing else, so both counts move by ten.

## Verification, defined once

**Per file (the ticket's own criterion):**

```sh
node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook
```

Must print `ok`, a row×col count inside 5–16 rows and 3–6 operations, and a staircase whose
every line opens with a cook's verb.

**Per commit (cross-file facts the per-file checker cannot see):**

```sh
npm run recipes                       # dangling pairings, unknown counters, orphans
npx vitest run src/lib/collection.test.ts
```

**Once, at the end (the counts and the icon baseline):**

```sh
grep -rl 'Pizzeria' recipes/ | wc -l                      # ≥27
grep -rl 'Pizzeria' recipes/ | xargs grep -l '^>> counters: *Pizzeria *$' | wc -l   # ≥20
npx vitest run src/lib/icons.test.ts                      # 46 fall-throughs, unchanged
npm run verify                                            # expected red, pre-existing
```

## Baseline captured before any file is written

`npx vitest run src/lib/icons.test.ts` on `main` **already fails** with 46 verbs falling
through to the bowl. The list is saved to the scratchpad so the after-state can be diffed
verb by verb. **The success condition for this ticket is that the list is unchanged**, not
that it is empty — `src/lib/icons.ts` belongs to another ticket. If a new verb appears, the
remedy is to reword the label or the note, never to touch `icons.ts`.

## Steps

### P1 — The Margherita (gap #1)

Write `recipes/pizzas/margherita.cook`, creating `recipes/pizzas/`.

The two halves that already exist finally have an item. Raw crushed tomato as its own
branch (D4), `pizza-dough` as a plain ingredient (D3), five operations, closing note that
says which crust this is — a 550°F home steel, not an 800°F deck.

Check → `npm run recipes` → commit: `Write the Margherita the dough and the sauce were waiting for`.

### P2 — The square pair (gap #2)

Two files, one commit, because the gap doc says they are only tellable apart by being sold
beside each other and are therefore worth writing together.

1. `recipes/breads/sicilian-pan-dough.cook` — 75% hydration, folded, proofed in the oiled
   tray. Written first: `sicilian-pizza` names it.
2. `recipes/pizzas/sicilian-pizza.cook` — cheese to the edges, sauce ladled on top.
3. `recipes/pizzas/grandma-pie.cook` — the *round* dough pressed cold and thin into an
   oiled sheet, cubed cheese, raw tomato in dollops.

Check all three → `npm run recipes` → `vitest collection` → commit:
`Print the square pair, the tray dough and the two ways to cut it`.

### P3 — Verify the icon baseline is intact

After the first four files, run `npx vitest run src/lib/icons.test.ts` and diff the
fall-through list against the baseline. Done here rather than at the end so a wording habit
that costs a verb is caught after four files instead of ten. No commit.

### P4 — The white pie (gap #3)

`recipes/pizzas/white-pizza.cook`. Ricotta beaten with garlic and pepper, spooned on in
dollops so it does not seal the crust; no tomato anywhere in the file.

Check → commit: `Write the white pie, ricotta and garlic and no tomato at all`.

### P5 — The dinner list (gaps #4, #5, #6)

Three files, one commit — they are one section of the board and they share `marinara-sauce`
as an ingredient.

1. `recipes/pasta/baked-ziti.cook`, creating `recipes/pasta/`. The gap doc: *no baked pasta
   exists on the site*.
2. `recipes/fried-and-crispy/chicken-parmigiana.cook`. Its closing note carries the other
   four parms, which is gap #5's actual scope.
3. `recipes/stews-and-braises/meatballs.cook`. Thirteen ingredient rows, at the top of the
   README's range.

Check all three → `npm run recipes` → `vitest collection` → commit:
`Set out the red-sauce dinner list: ziti, parm and meatballs`.

### P6 — Something to put the sauces on (gap #7)

`recipes/pasta/fresh-egg-pasta.cook`. Closing note is where the pasta-water emulsion gets
said out loud — the gap doc's "operation nobody writes down and everybody gets wrong".

Check → `npm run recipes` (the `pairs-with: bolognese, basil-pesto, alfredo-sauce` edges
are what this step really tests) → commit:
`Roll a sheet of egg pasta for the six sauces that had none`.

### P7 — Garlic knots (gap #8)

`recipes/breads/garlic-knots.cook`. Two branches: the knots, and the garlic butter they are
tossed through while hot.

Check → commit: `Tie the garlic knots from the same dough as everything else`.

### P8 — Final verification and the counts

Run the full end-of-plan block above. Record in `progress.md`:

- the ten `--labels` staircases,
- the two counts,
- the icon fall-through diff (expected: empty),
- `npm run verify`'s result and whether it differs from the `main` baseline,
- the T-001-18 escalation for `marinara-sauce.cook`'s `aka`,
- every gap item skipped or not reached, with its reason.

Then `git status --short recipes/` must show nothing untracked or modified: everything
committed through `lisa commit-ticket`, nothing left in the ordinary index. No commit.

### P9 — Review

`review.md` and `review-disposition.json`, then `lisa check-disposition T-001-12`.

## Testing strategy, and what it cannot cover

| Claim | How it is tested |
| --- | --- |
| The file draws a table | `check-recipes.mjs` — tiling, row and column floors, empty labels |
| Labels read as a cook's verbs | `--labels` staircase, read by eye; this is a judgement, not an assertion |
| Counters exist, pairings are mutual, slugs unique | `npm run recipes` + `collection.test.ts` |
| Timers are readable and honest | `collection.test.ts` (unit, and no ≥4 hr hands-on claim) |
| No new verb is asked of the icon table | `icons.test.ts` fall-through diff against baseline |
| The gate counts | `grep -rl 'Pizzeria' recipes/` |
| **Quantities are real for the stated servings** | **Nothing automated. Human review.** Stated per file with both units, scaled from the component recipes' own yields — `pizza-dough` makes four 250 g balls, so a two-pie Margherita takes half of it. |
| **The method is the canonical one** | **Nothing automated. Human review.** The design records the canonical claim for each dish and where it came from (`docs/knowledge/counters.md`). |

## Risks

1. **`npm run verify` is already red** on `main` (icons coverage, 46 verbs). This ticket
   cannot fix it — `src/lib/icons.ts` is another ticket's file. It must not make it worse,
   and P3/P8 measure that. This will be surfaced in `review.md` rather than quietly passed.
2. **Two new categories** (`Pizzas`, `Pasta`) are unclaimed by any counter in
   `counters.json`. Harmless while every file names `Pizzeria`; a later file in one of
   these folders that omits `counters:` would be orphaned and fail the build. Noted for
   T-001-17.
3. **Thirteen ingredient rows** in `meatballs` is the README's ceiling. If the table reads
   badly, the fix is fewer aromatics, not a second file.
4. **Other tickets are live on this branch.** Every commit passes exact
   `--include recipes/<folder>/<slug>.cook` paths. No `git add`, no `-A`, nothing staged.
