# T-001-14 — Plan

Eighteen files in seven commits, walking down `docs/gaps/deli.md`. Each commit is a section of
the counter that stands up on its own, and each is verified before the next one starts.

## Verification, defined once

Two gates run per file, one runs per commit, one runs at the end.

**Per file (authoring loop):**

```
node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook
```

Pass = `ok … N rows x M cols`, N ≥ 3, M ≥ 3, and every staircase line reads as a cook's verb
rather than a sentence fragment. The `--labels` output is read, not just the exit code — the
exit code cannot see a label that says "in the with".

**Per file (hand check), the things no script tests:**

- quantities are real for the stated `servings` (weights checked against the yield, not copied)
- the method is the canonical one, and where a shortcut is common the prose says why it is not
  taken
- every `~timer` has a name, and the name is one `src/lib/time.ts` recognises
- `title`, `category`, `tags`, `servings`, `counters` present; `aka` present wherever the board
  has another word for it, with a diacritic-free form
- every `pairs-with` slug exists

**Per commit:**

```
node scripts/check-recipes.mjs recipes/<each file in the commit>
lisa commit-ticket --ticket-id T-001-14 --message "<message>" --include <exact paths>
```

**At the end:**

```
node scripts/check-recipes.mjs          # all 421 + 18 files
npm run recipes                          # cross-file facts: slugs, pairings, counters
npx vitest run                           # compared against the 4-failure baseline
git status --porcelain                   # nothing of this ticket's left uncommitted
grep -rl '^>> counters:.*Deli' recipes/ | wc -l          # ≥ 44
grep -rl '^>> counters: *Deli *$' recipes/ | wc -l       # ≥ 12
```

There are no unit tests to write. This ticket adds data, not code; the collection-level tests
in `src/lib/*.test.ts` are the integration tests over that data, and `src/` is T-001-17's.

## The commits

### 1 — The slicer (gap ranks 2, 3)

`recipes/smoked-and-grilled/pastrami.cook`
`recipes/stews-and-braises/corned-beef.cook`

Committed together because they name each other in `pairs-with` and because the point of
writing them is that they share four steps and part at the fifth. Highest-risk pair in the
ticket: five-day cures, pink curing salt, and a `>> time:` that has to agree with a timer chain
spanning days. Verify the claimed time arithmetically before committing:

```
node -e '…buildSchedule…'   # totalMinutes vs authorMinutes, must be within 5%
```

*Message:* `Hang the pastrami and the corned beef, one brine and two finishes`

### 2 — The dressing the Reuben needs (rank 4)

`recipes/dressings-and-dips/russian-dressing.cook`

Small, and it unblocks nothing, but it is rank 4 and the doc's complaint is precise: twelve
dressings written and not this one.

*Message:* `Write the Russian dressing, the thirteenth in the case`

### 3 — The soup and its two components (rank 6, plus components)

`recipes/sauces-and-gravies/schmaltz.cook`
`recipes/soups/chicken-broth.cook`
`recipes/soups/matzo-ball-soup.cook`

Order inside the commit matters for `pairs-with`: schmaltz and broth are written first, the
soup names both. The soup is the ticket's only two-branch table, so its tree is checked with
`--labels` before anything else in this commit is considered done.

*Message:* `Set the broth, render the schmaltz, and float the matzoh balls`

### 4 — Salads by the pound (rank 7)

`recipes/salads/potato-salad.cook`
`recipes/salads/macaroni-salad.cook`
`recipes/salads/egg-salad.cook`
`recipes/salads/tuna-salad.cook`
`recipes/salads/chicken-salad.cook`

Five files, one architecture, deliberately not copy-paste: the dressings differ (mustard and
celery seed in the potato, sugar and vinegar in the macaroni, lemon in the tuna, tarragon in
the chicken), because five identical tables would be one table printed five times.

*Message:* `Fill the salad case: potato, macaroni, egg, tuna and chicken`

### 5 — Chopped liver (rank 8)

`recipes/dressings-and-dips/chopped-liver.cook`

Depends on commit 3 for its `pairs-with: schmaltz`. Three branches into one chop.

*Message:* `Chop the liver with onion and schmaltz, by hand and in a bowl`

### 6 — The appetizing side (rank 9)

`recipes/dressings-and-dips/cream-cheese.cook`
`recipes/dressings-and-dips/scallion-schmear.cook`
`recipes/salads/whitefish-salad.cook`
`recipes/cured-fish/belly-lox.cook`

Creates the one new folder. `cream-cheese` before `scallion-schmear`. This is the commit where
the "what it could not stock" reasoning is visible in the files themselves: belly lox exists
*because* nova does not, and its prose says which one the reader is holding.

*Message:* `Open the appetizing side: cream cheese, schmear, whitefish and belly lox`

### 7 — The kraut and the knish (ranks 10, 11)

`recipes/toppings-and-pickles/sauerkraut.cook`
`recipes/dumplings-and-rolls/potato-knish.cook`

*Message:* `Ferment the kraut and bake the square knish`

## Step-by-step execution order

1. Write `pastrami`, check, hand-check quantities and the time claim. Write `corned-beef`,
   check. Confirm the two brines are identical in composition. **Commit 1.**
2. Write `russian-dressing`, check. **Commit 2.**
3. Write `schmaltz`, `chicken-broth`, then `matzo-ball-soup`. Check all three; read the soup's
   staircase carefully for the two-branch merge. **Commit 3.**
4. Write the five case salads. Check all five together. Confirm the five dressings are five
   dressings. **Commit 4.**
5. Write `chopped-liver`, check. **Commit 5.**
6. `mkdir recipes/cured-fish`. Write `cream-cheese`, `scallion-schmear`, `whitefish-salad`,
   `belly-lox`. Check all four. **Commit 6.**
7. Write `sauerkraut`, `potato-knish`. Check both. **Commit 7.**
8. Run the whole-collection gate: `check-recipes.mjs`, `npm run recipes`, `vitest run`. Compare
   against the 4-failure baseline in `research.md` §7. Count Deli and Deli-exclusive files.
9. Write `progress.md` — what was written, what was skipped and why, the staircases, the counts.
10. Write `review.md` and `review-disposition.json`; run `lisa check-disposition T-001-14`.

## Where this plan expects to be wrong

- **A step chain that will not tile.** Most likely in `matzo-ball-soup` and `potato-knish`,
  the two multi-branch trees. Symptom: `buildTree` throws about two roots or a step used twice.
  Remedy is local — re-point one `@&(~n)` — and does not change the plan.
- **A derived label that reads as a fragment.** Remedy: a `>> step.N:` line, which is already
  the collection's norm.
- **The schedule test's top-three list changing again.** Expected, pre-existing, not this
  ticket's file to fix. What this ticket controls is that its own `>> time:` claims are true, so
  a new entry in that list does not also break the second assertion. Checked before commit 1
  and again at step 8.
- **An ingredient name with no shopping aisle.** `pink curing salt`, `matzo meal`,
  `smoked whitefish`, `beef navel` are the candidates. The aisle data is not this ticket's file;
  the number is recorded in `review.md` either way.

## Definition of done

- 18 files created under `recipes/**`, nothing else touched, nothing left uncommitted.
- `check-recipes.mjs` ok for all 439 files.
- Deli ≥ 44 shelved (expected 59), ≥ 12 exclusive (expected 25).
- `vitest run` no worse than the recorded baseline, with any movement explained by name.
- Every skipped ranked item named with a reason in `progress.md`.
