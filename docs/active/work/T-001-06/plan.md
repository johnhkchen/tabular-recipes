# T-001-06 — Plan

Nine steps, one per commit unit. Each step is write → check → commit, and each is verifiable
on its own. A step that fails its check is fixed before the next step starts; nothing is
committed that has not printed `ok`.

## The loop that every step runs

```
1. write the .cook file(s) for the step
2. node scripts/check-recipes.mjs --labels <exactly those files>
3. read the staircase: does each cell read as a verb a cook would say?
   - fragment or empty cell  -> add/repair a >> step.N: override, back to 2
4. grep -n '~{' <those files>          # must print nothing
5. lisa commit-ticket --ticket-id T-001-06 --message "<message>" --include <exact paths>
6. append the step to progress.md
```

Step 3 is the only judgement call in the loop; steps 2, 4 and 5 are pass/fail.

## Steps

**Step 1 — the dough and the lid.**
`recipes/pastry-and-doughs/pan-dulce-dough.cook`, `recipes/pastry-and-doughs/costra-de-azucar.cook`.
Nothing depends on anything yet. The check to watch: `costra-de-azucar` is short and must
still make 3 columns — cream → work in flour → tint is exactly 3 operations, so if the tint
step collapses into the flour step the file fails on `only one operation`.
Commit: *Write the pan dulce dough and its sugar lid for the Panadería*.

**Step 2 — conchas.** `recipes/breads/conchas.cook`.
First consumer. Verify the dough and the lid appear as plain `@` ingredient rows (not
`@&(~N)` — they are other files), and that `pairs-with: pan-dulce-dough, costra-de-azucar`
resolves to slugs that now exist.
Commit: *Write conchas for the Panadería*.

**Step 3 — the savoury rack.** `recipes/breads/bolillos.cook`, `recipes/breads/teleras.cook`.
Two self-contained lean doughs. These two are what make the Pan Salado rack non-empty, which
is the ticket's second-loudest complaint. Watch that they do not come out as the same table:
telera carries lard and no steam, bolillo carries steam and a slash.
Commit: *Write bolillos and teleras for the Panadería*.

**Step 4 — the laminated shelf.** `recipes/pastry-and-doughs/hojaldre.cook`,
`recipes/cookies/orejas.cook`, `recipes/cookies/campechanas.cook`.
The only file in the ticket with a second counter (`Panadería, Bakery`) — confirm the checker
accepts both names against `src/data/counters.json`. The fold loop in `hojaldre` is one step
with a repeat count in its label; if the derived label mangles it, override with `>> step.N:`.
Commit: *Write hojaldre, orejas and campechanas for the Panadería*.

**Step 5 — the turnover.** `recipes/custards-and-puddings/relleno-de-pina.cook`,
`recipes/cookies/empanadas-de-pina.cook`.
The structural risk of the whole ticket is here: `empanadas-de-pina` has a dough chain and a
filling row meeting at the fill step. If the fill step forgets to reference the dough chain,
`buildTree` throws *"N steps end the recipe"*. Check output is the proof.
Commit: *Write the pineapple filling and its empanadas for the Panadería*.

**Step 6 — cuernos.** `recipes/breads/cuernos.cook`.
Second consumer of the dough. Small step on purpose: it is the last of the ranked top six, so
committing it alone gives a clean point to stop at if anything upstream has to be reworked.
Commit: *Write cuernos for the Panadería*.

**Step 7 — piloncillo and the pigs.** `recipes/sauces-and-gravies/piloncillo-syrup.cook`,
`recipes/cookies/puerquitos.cook`.
Commit: *Write piloncillo syrup and puerquitos for the Panadería*.

**Step 8 — the case.** `recipes/cakes-and-loaves/mantecadas.cook`,
`recipes/custards-and-puddings/cubiletes-de-queso.cook`.
`cubiletes-de-queso` has a crust chain and a filling chain meeting at the bake step — same
two-branch shape as step 5, same failure mode to watch.
Commit: *Write mantecadas and cubiletes de queso for the Panadería*.

**Step 9 — the last three.** `recipes/breads/bigotes-de-pina.cook`,
`recipes/cookies/polvorones-rosas.cook`, `recipes/custards-and-puddings/chocoflan.cook`.
`bigotes-de-pina` draws three ingredient rows from three other files; confirm all three slugs
exist before writing `pairs-with`. `polvorones-rosas` must read as a different table from
`russian-tea-cakes` — shortening and cinnamon, no nuts, no powdered-sugar roll — because the
gap doc's whole point about item 12 is that they are two items.
Commit: *Write bigotes, polvorones rosas and chocoflan for the Panadería*.

## Testing strategy

There is no unit-test surface here: this ticket adds data files, not code. The test is the
checker, and it is the same gate the build uses (`check-recipes.mjs` imports the very
`buildTree` / `layout` the site renders with, so a file that checks `ok` is a file that draws).

Three levels, in order of cost:

1. **Per file, per step — structural.** `node scripts/check-recipes.mjs --labels <files>`.
   Exit 0 and `ok  <path>  N rows x M cols` for each. This covers required metadata, counter
   names, single root, no double-referenced step, ≥3 rows, ≥3 columns, every op labelled, and
   perfect tiling.
2. **Per file, per step — editorial.** Read the `--labels` staircase. Each printed cell must
   be an instruction a cook would say out loud ("knead 10 min", "press on the lids and
   score"), not a fragment ("in the , and to ."). Also: `grep -n '~{'` empty, `aka` carries an
   undiacritic form, quantities scale to the stated `servings`.
3. **Once, at the end — collection-wide.**
   - `node scripts/check-recipes.mjs` (all 326 files) — proves nothing already shelved broke.
   - `npm run recipes` then `npm run verify` — proves the collection still parses and builds
     with the new files in it. If `verify` fails for a reason that predates this ticket, that
     is recorded in `review.md`, not patched here (T-001-01's review already reports one
     out-of-scope test failing).
   - Counts: `grep -c` for shelved and exclusive, against ≥18 and ≥12.
   - `git status --porcelain` shows no ticket-owned file left staged, modified or untracked,
     and nothing outside `recipes/**`.

## Verification criteria, mapped to the ticket

| Criterion | How it is checked | Where the evidence lands |
| --- | --- | --- |
| ≥18 shelved, ≥12 exclusive | `grep -l 'Panader'` / `grep -c '^>> counters: Panadería$'` | `review.md` |
| Ranked dishes written in order; skips named | the file table in `structure.md`, ranks 1–13 | `review.md` skip list |
| `check-recipes.mjs --labels` ok, verbs not fragments | step 2 + 3 of the loop, every step | `progress.md`, `review.md` |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` present | checker fails without the first four; `aka` read by eye per file | `progress.md` |
| Every timer named | `grep -n '~{'` per step | `review.md` |
| Real quantities, canonical method | written per file; the four judgement calls recorded | `design.md` §5, `review.md` |
| Only `recipes/**` modified | `git status --porcelain` at the end | `review.md` |

## Deviations

Any departure from `structure.md` — a file moved to a different folder, a step merged, a
recipe dropped — is written into `progress.md` with its reason **before** the commit that
contains it, per the workflow's rule on deviations.

## Stop condition

After step 9: run the collection-wide checks, write `review.md` and
`review-disposition.json`, run `lisa check-disposition T-001-06`, then stop and wait. No
phase or status edit, no completion commit, no second ticket.
