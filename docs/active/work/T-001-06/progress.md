# T-001-06 — Progress

All nine planned steps done, plus one unplanned tenth. Eighteen files created, nothing
modified outside them, nothing deleted. Every unit checked `ok` before it was committed.

## Steps

| # | Unit | Files | Commit | State |
| --- | --- | --- | --- | --- |
| 1 | dough and lid | `pan-dulce-dough`, `costra-de-azucar` | `e631b4d` | done |
| 2 | conchas | `conchas` | `95005cf` | done |
| 3 | the savoury rack | `bolillos`, `teleras` | `e7ce856` | done |
| 4 | the laminated shelf | `hojaldre`, `orejas`, `campechanas` | `c2e2328` | done |
| 5 | the turnover | `relleno-de-pina`, `empanadas-de-pina` | `e6520f6` | done |
| 6 | cuernos | `cuernos` | `c47dc6a` | done |
| 7 | piloncillo and the pigs | `piloncillo-syrup`, `puerquitos` | `0c3bfd6` | done |
| 8 | the case | `mantecadas`, `cubiletes-de-queso` | `11eac64` | done |
| 9 | the last three | `bigotes-de-pina`, `polvorones-rosas`, `chocoflan` | `d07510f` | done |
| 10 | **label repair** (unplanned) | 6 files reworded | `6bd38c0` | done |

Every commit went through `lisa commit-ticket --ticket-id T-001-06` with exact
`--include` paths. No ordinary `git add` or `git commit` was run at any point, and
`git status --porcelain recipes/` is empty.

## Checker output, per step

Each of the 18 printed `ok` with a verb staircase. Sizes:

```
pan-dulce-dough      8 rows x 6 cols     costra-de-azucar     7 rows x 4 cols
conchas              5 rows x 4 cols     bolillos             7 rows x 6 cols
teleras              6 rows x 6 cols     hojaldre             6 rows x 5 cols
orejas               4 rows x 5 cols     campechanas          4 rows x 5 cols
relleno-de-pina      7 rows x 4 cols     empanadas-de-pina   10 rows x 6 cols
cuernos              4 rows x 4 cols     piloncillo-syrup     5 rows x 4 cols
puerquitos          12 rows x 6 cols     mantecadas           8 rows x 6 cols
cubiletes-de-queso  11 rows x 6 cols     bigotes-de-pina      6 rows x 5 cols
polvorones-rosas    10 rows x 6 cols     chocoflan           15 rows x 6 cols
```

## Deviations from the plan

**One deviation, and it is step 10.** `plan.md` treated the `--labels` staircase as the only
editorial gate. It is not: `src/lib/icons.test.ts` asserts that every verb a recipe *opens an
operation with* is one the collection can draw an icon for, and a sibling commit
(`59c0525`, another ticket) had just been made to keep that list empty. Seven of my opening
verbs fell through — `flavour`, `enclose`, `sharpen`, `alternate`, `curve`, `stripe`, `tint`.

The fix belongs in `recipes/**`, not `src/`: the ticket forbids touching `src/`, and
`VERB_ICONS` is `src/lib/icons.ts`. So the six affected files were reworded to open on verbs
the collection already draws, prose kept in step with the label:

| File | Was | Now |
| --- | --- | --- |
| `costra-de-azucar` | `flavour, then divide and tint` | `stir in the vanilla, then divide and tint` |
| `hojaldre` | `enclose the block and roll out` | `fold the dough round the block and roll out` |
| `relleno-de-pina` | `sharpen with lime, cool and chill` | `stir in the lime, cool and chill 2 hr` |
| `mantecadas` | `alternate the dry and the milk` | `fold in the dry and the milk, alternating` |
| `mantecadas` | `5 min hot, then 13 min at 350°F` | `bake 5 min hot, then 13 min at 350°F` |
| `bigotes-de-pina` | `curve into moustaches, proof 60 min` | `shape into moustaches, proof 60 min` |
| `bigotes-de-pina` | `stripe with the paste, wash and bake…` | `pipe on the paste, wash and bake…` |
| `polvorones-rosas` | `tint pink, chill 30 min` | `knead the colour through, chill 30 min` |

The mantecadas step-5 change is worth naming separately: that label did not open with a verb
at all, which the acceptance criteria call out directly. It reads as an instruction now.

After the repair the fall-through list is `bruise, crack, cup, dress, return, ribbon, slide,
velvet` — eight verbs, **none of them from a file this ticket owns**. Traced: `bruise` →
`som-tum`, `dress` → `larb-gai`, `crack` → the four Thai curries (T-001-03); `return`,
`velvet`, `ribbon`, `slide` → the stir-fries and soups (T-001-04); `cup` → `siu-mai`, which
landed from T-001-07 while this ticket was running.

No other deviation. Every file landed in the folder `structure.md` named, with the servings,
the consumers and the `aka` forms it specified.

## Notes taken while writing

- **`empanadas-de-pina` and `cubiletes-de-queso` were the two structural risks** flagged in
  the plan — a dough chain and a filling meeting at one step. Both wired first time; the
  merge step references the dough chain with `@&(~2)` and the filling with `@&(~1)`.
- **`hojaldre` needed its ref order swapped** during the label repair, since the reworded step
  reads "fold the détrempe over the block". Both refs are still present and the tree is
  unchanged; the checker confirms 6 rows x 5 cols either way.
- **Servings were made to line up across files that feed each other.** `pan-dulce-dough`
  yields 16 pieces at ~65 g; `conchas` takes the whole batch, `cuernos` and `bigotes-de-pina`
  take three-quarters each and say so. `costra-de-azucar` makes 16 lids; `conchas` takes the
  batch, `bigotes` half. `relleno-de-pina` makes ~500 g; `empanadas-de-pina` takes the batch,
  `bigotes` half.
- **`recipes/drinks/` was left alone.** It exists and is empty. Café de olla is ranked 22, far
  below where the count reaches, and claiming the folder for a ticket that stops at 13 would
  be taking a decision that is not this ticket's.

## Counts at the end of Implement

```
$ grep -l 'Panader' recipes/*/*.cook | wc -l          →  30    (criterion: ≥18)
$ grep -lx '>> counters: Panadería' recipes/*/*.cook  →  17    (criterion: ≥12)
$ node scripts/check-recipes.mjs                      →  all 334 file(s) draw a table
$ grep -n '~{' <the 18 new files>                     →  no matches (51 named timers)
$ git status --porcelain recipes/                     →  empty
```
