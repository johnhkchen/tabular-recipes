# T-002-04 — Progress

Fourteen new `.cook` files, all naming `>> counters: One Pot`. Five commits through
`lisa commit-ticket`. Nothing that existed before this ticket was edited.

## What was written

Each line: rank in `docs/gaps/one-pot.md` · slug · **the one vessel, start to finish** · the One
Pot section it belongs under, for T-002-08 · `check-recipes.mjs` result.

**Braises and stews**

1. rank 1 · `stews-and-braises/chicken-and-dumplings.cook` · **Dutch oven** · Braises and stews ·
   ok, 14 rows x 5 cols. Dough stirred in a bowl and dropped on the surface; the bowl is the
   ticket's plate case, and nothing is drained.
2. rank 14 · `stews-and-braises/new-england-boiled-dinner.cook` · **stockpot** · Braises and stews
   · ok, 11 rows x 5 cols. Beef, then roots, then cabbage, all in the same water.
3. rank 16 · `stews-and-braises/ratatouille.cook` · **Dutch oven** · Braises and stews · ok, 13
   rows x 6 cols. Each vegetable gets its turn in the pot rather than its own pan.

**Skillet dinners** — the six the criterion asks for

4. rank 4 · `eggs/shakshuka.cook` · **cast-iron skillet** · Skillet dinners · ok, 14 rows x 5 cols.
5. rank 9 · `pasta/skillet-lasagna.cook` · **cast-iron skillet** · Skillet dinners · ok, 13 rows x
   5 cols. Noodles broken in dry and cooked in the sauce.
6. rank 10 · `eggs/tortilla-espanola.cook` · **nonstick skillet** · Skillet dinners · ok, 5 rows x
   5 cols. Oil poured off, not strained; potato lifted into the egg with a slotted spoon; turned
   out on a plate. One pan, one bowl, no colander.
7. rank 11 · `stews-and-braises/chicken-cacciatore.cook` · **large skillet** · Skillet dinners ·
   ok, 13 rows x 6 cols.
8. rank 12 · `noodles/beef-stroganoff.cook` · **large skillet** · Skillet dinners · ok, 14 rows x
   5 cols. Noodles simmer in the beef's own broth in the pan; sour cream folded in off the heat.
9. rank 13 · `stews-and-braises/sausage-and-peppers.cook` · **large skillet** · Skillet dinners ·
   ok, 9 rows x 4 cols.

**Rice and grains that cook in**

10. rank 3 · `rice-beans-and-grains/arroz-con-pollo.cook` · **Dutch oven** · Rice and grains that
    cook in · ok, 17 rows x 6 cols.
11. rank 7 · `rice-beans-and-grains/paella.cook` · **paella pan** (a wide shallow pan; a large
    skillet stands in) · Rice and grains that cook in · ok, 13 rows x 7 cols.
12. rank 8 · `pasta/one-pot-pasta.cook` · **deep skillet** · Rice and grains that cook in · ok, 11
    rows x 5 cols. Also a legitimate skillet dinner; held in reserve as the seventh if a reviewer
    rejects one of the six above.

**Soups that are the whole meal**

13. rank 2 · `soups/gumbo.cook` · **Dutch oven** · Soups that are the whole meal · ok, 17 rows x 5
    cols. The dark roux is steps 3 and 4 of this file, made in the gumbo pot.
14. rank 15 · `soups/sancocho.cook` · **stockpot** · Soups that are the whole meal · ok, 18 rows x
    6 cols.

## What was skipped, and why

- **rank 5, red beans and rice.** A pot of beans and a pot of rice. The dish as a person eats it
  needs a second vessel, which is the ticket's colander case. Not written rather than written
  dishonestly, and not renamed to "red beans" to dodge the problem.
- **rank 6, étouffée.** A sauce whose entire starch is a separately cooked pot of rice. Same
  reason. Gumbo is written and étouffée is not because a bowl of gumbo is a dinner as it stands,
  while an étouffée without rice is a pan of sauce.
- **ranks 17–20** are past the count of 14. Additionally: 17 kedgeree needs a `smoked-haddock`
  component that does not exist and is not this ticket's to write; 18 chicken and biscuits is rank
  1's pot with a different lid; 19 bigos is recorded as the Deli's rank 8; 20 is a variant of the
  existing `congee`, which is shelving work.

## Dishes found to already exist

None. Every one of the twenty ranked absences was checked with `ls recipes/*/<slug>.cook` and
against a grep of every `>> title:` and `>> aka:` line in the collection before writing. The only
hit anywhere near the list was the existing plain `soups/congee.cook`, which is rank 20's base
dish and not rank 20 itself. So there is nothing here for T-002-08 to shelve on this ticket's
behalf beyond the fourteen new files and their sections above.

## Deviations from the plan

**One extra pass that the plan did not have.** After the fourth commit, `npm run verify` failed on
`src/lib/icons.test.ts > recognises every verb the recipes open an operation with`: ten of the
operation labels written here opened with a word that is not in `VERB_ICONS` — `sofrito`,
`trinity`, `roots`, `cabbage`, `corn`, `low`, `in`, `off`, `dot`, `flip`. The fix could have been
one line each in `src/lib/icons.ts`, but this ticket may only touch `recipes/**`, and the labels
were the thing actually at fault: a staircase rung should open with a verb. Reworded, in a fifth
commit:

| was | now |
|-----|-----|
| `sofrito 8 min` | `sweat the sofrito 8 min` |
| `trinity in, 6 min` | `sweat the trinity 6 min` |
| `roots in, 20 min` | `simmer the roots 20 min` |
| `cabbage in, 15 min` | `simmer the cabbage 15 min` |
| `corn and plantain in, 12 min` | `simmer the corn and plantain 12 min` |
| `low 8 min, shrimp on top` | `simmer low 8 min, shrimp on top` |
| `in with the tomatoes, bring it up` | `bring the tomatoes up, 2 min` |
| `off the heat, cheese and basil` | `beat in the cheese off the heat` |
| `dot with cheese, stand covered 5 min` | `spoon the cheese on, stand covered 5 min` |
| `flip onto a plate, slide back, 4 min` | `turn out onto a plate, slide back, 4 min` |

The plan's step 5 (a sweep) ran as written otherwise.

## Verification run

- `node scripts/check-recipes.mjs --labels <each of the 14>` — **ok** for all fourteen, and every
  printed staircase reads as verbs.
- `npm run verify` — `all 551 file(s) draw a table`; 717 of 718 tests pass. The one failure is
  `icons.test.ts`, and after the reword every remaining fall-through verb (`cold`, `dry`, `full`,
  `molasses`, `natural`, `potatoes`, `pressure`, `vegetables`) comes from a `*-instant-pot.cook`
  file written in parallel by T-002-02 and T-002-03. None of the fourteen files here contributes
  to it. Recorded in `review.md` as an open concern for whoever lands last.
- `grep -L '^>> counters: One Pot$'` over the fourteen — empty.
- `grep -l '~{'` over the fourteen — empty; every timer is named.
- `grep -ilE 'pressure|instant pot|^>> kit:'` over the fourteen — empty.
- One `#…{}` vessel per file, and the same one throughout: verified file by file.
- `title`, `category`, `tags`, `servings`, `counters` and `aka` present in all fourteen.
- `git status --porcelain recipes/` — nothing of this ticket's left modified, staged or untracked.

## Commits

- `6fd3fd0` Three one-pot braises: chicken and dumplings, boiled dinner, ratatouille
- `82ad1f2` Six skillet dinners for the One Pot shelf
- `7caa69e` Rice and pasta that cook in: arroz con pollo, paella, one-pot pasta
- `2dfa3eb` Two whole-meal soups: gumbo with its roux, sancocho
- `05e0f71` Open every operation label with a verb the icon table knows
