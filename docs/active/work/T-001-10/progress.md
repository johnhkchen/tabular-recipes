# T-001-10 — Progress

All seven planned units done. **Thirteen files created, none modified, none deleted.** Every
file checked `ok` before its unit was committed. No deviations from `plan.md`.

## Units

| # | Unit | Files | Commit | State |
| --- | --- | --- | --- | --- |
| 1 | the adobo and the dish | `adobo-para-al-pastor`, `al-pastor` | `aa8bfc2` | done |
| 2 | the salsa pair | `salsa-verde`, `salsa-verde-cruda` | `cafcbf8` | done |
| 3 | the grill | `carne-asada`, `pollo-asado` | `5d05f71` | done |
| 4 | the guisado pot | `tinga-de-pollo`, `chile-verde` | `2e7cd2e` | done |
| 5 | the first two cuts | `lengua`, `suadero` | `5a18f96` | done |
| 6 | the second two cuts | `cachete`, `tripas` | `41322f7` | done |
| 7 | the cup | `consome-de-birria` | `a2d795c` | done |

Every commit went through `lisa commit-ticket --ticket-id T-001-10` with exact
`--include` paths, never a folder — three other tickets were writing into
`recipes/stews-and-braises/` and `recipes/soups/` at the same time. No ordinary `git add`
or `git commit` was run. `git status --porcelain recipes/` is empty.

## Checker output

```
adobo-para-al-pastor  14 rows x 5 cols     al-pastor             7 rows x 6 cols
salsa-verde            9 rows x 5 cols     salsa-verde-cruda     8 rows x 4 cols
carne-asada           14 rows x 6 cols     pollo-asado          13 rows x 6 cols
tinga-de-pollo        13 rows x 4 cols     chile-verde          14 rows x 5 cols
lengua                 9 rows x 5 cols     suadero               9 rows x 5 cols
cachete               12 rows x 5 cols     tripas               10 rows x 5 cols
consome-de-birria      8 rows x 5 cols
```

All inside the README's 5–16 rows × 3–6 columns. Every staircase reads as verbs:

```
$ node scripts/check-recipes.mjs --labels recipes/smoked-and-grilled/al-pastor.cook
  ok   recipes/smoked-and-grilled/al-pastor.cook  7 rows x 6 cols
       coat every slice, marinate 12 hr
         stack the slices, pineapple on top
           roast 325°F 2 hr, then 450°F 20 min
             rest 20 min, shave off the block
               crisp on the comal 2 min
```

## The counts, measured from `recipes/`

```
shelved:   33   (gate: 24)
exclusive: 25   (gate: 18)
```

The 13 new exclusive files: adobo-para-al-pastor, al-pastor, salsa-verde,
salsa-verde-cruda, carne-asada, pollo-asado, tinga-de-pollo, chile-verde, lengua, suadero,
cachete, tripas, consome-de-birria.

## Two things caught while writing

**1. `>> step.N` counts the prep row.** `cachete` opens with a full-width
`Preheat the #oven{}` row, so its overrides had to start at `step.2`. Written as `step.1`
first, which would have labelled the preheat "season in the pot" and left the real seasoning
step with a scavenged label. `carnitas` numbers the same way — the precedent was there and
worth reading twice.

**2. `>> note:` renders nowhere.** An earlier draft of `al-pastor` carried the "this is not
the trompo" caveat as a `>> note:` metadata line. `src/pages/[slug].astro` only reads
`servings` and `time` off `metadata`, so the sentence would have been invisible. It moved
into step 2's prose, where a cook reading the steps actually meets it.

## Written down the gap list, in order

Ranked items #1 through #7 of `docs/gaps/taqueria.md` are complete, plus the first entry of
its "Components it would need" section:

| Gap item | Written |
| --- | --- |
| components — adobo para al pastor | `adobo-para-al-pastor` |
| 1 — al pastor | `al-pastor` (loaf-tin version, and it says so) |
| 2 — salsa verde | `salsa-verde` (charred) + `salsa-verde-cruda` (raw) |
| 3 — carne asada | `carne-asada` |
| 4 — pollo asado, tinga de pollo | `pollo-asado`, `tinga-de-pollo` |
| 5 — chile verde pork | `chile-verde` |
| 6 — lengua, suadero, cachete, tripa | `lengua`, `suadero`, `cachete`, `tripas` |
| 7 — consomé | `consome-de-birria` |

## Skipped, and why — items #8 onward

**#8 the garnish tray.** `crema-mexicana` already exists (the gap doc is stale here).
*Cebolla y cilantro* is two ingredients and one operation — below the checker's 3-row /
3-column floor, and a garnish that is chopping two things is not a table. *Salsa de
aguacate* is writable and is the best single candidate for the next ticket down this list.

**#9 escabeche.** Writable, and the folder for it is `recipes/dressings-and-dips/`, where
`do-chua` and `sour-dill-pickles` already live — the gap doc's claim that "nothing in the
whole collection is pickled" is stale. Not reached; below the count.

**#10 chiles toreados.** Blister, toss with lime and soy, serve. Three ingredients, two
operations. Under the floor.

**#11 quesabirria, #12 chile relleno, #16 alambre, #17 machaca.** All genuinely writable
tables. Not reached; below the count.

**#13 the masa vehicles (sopes, huaraches, mulitas, vampiros, gringas).** Four of the five
need a sope/huarache masa that does not exist — masa beaten with flour and salt so it holds
a pinched rim, which the gap doc lists as its own component. Writing five vehicles on top of
an unwritten dough would be five recipes each opening with the same unexplained step.

**#14 torta and torta cubana.** Blocked on the bolillo, which the gap doc places at the
Panadería. T-001-06 wrote `bolillos` there — so this is now unblocked for whoever takes the
next pass, and it was not when this ticket's design was settled.

**#15 flautas.** Writable; not reached.

**#18 aguas frescas.** The gap doc's own "What it could not stock" section rules these out:
blend, strain, sweeten is two operations and three ingredients, and three of them on one
table would be a split. A horchata table alone would earn its rows and is the honest
version.

**#19 elote and esquites, #20 the pupusería block, #21 salsa macha, #22 arroz con leche.**
Below the count. The pupusería block additionally needs Salvadoran chicharrón (the soft
ground paste, not crackling) and curtido; `arroz-con-leche` exists as `rice-pudding` at the
Diner and Deli, so it is an `aka`/`counters` edit to a file this ticket does not own.

## Recorded for T-001-18 (edits to files other tickets own)

1. **`rice-pudding` should also name the Taquería**, as *arroz con leche* — gap item #22.
   It already carries `>> aka: arroz con leche`; the change is one word added to
   `>> counters: Diner, Deli` in `recipes/custards-and-puddings/rice-pudding.cook`. Not
   made here; the ticket says to record it instead.
2. **A shared toasted dried-chile purée** is the strongest single argument in the gap doc's
   components list — `birria-de-res`, `red-enchilada-sauce`, `mole-poblano` and the new
   `adobo-para-al-pastor` all begin with toast, soak, blend, strain. Writing it only pays
   off if those four are rewritten to take it as an ingredient row, which is an edit to
   three files this ticket does not own. `adobo-para-al-pastor` does its own toasting, in
   step with its three neighbours rather than ahead of them.

## Verification run at the end

- `node scripts/check-recipes.mjs` — **all 410 files draw a table** (410, not 354: other
  tickets landed files while this one ran).
- `npm run recipes` — parsed 410 recipes, **410 counters named, 0 inferred, 347 pairings**.
  This is what proves every `>> counters:` and `>> pairs-with:` line in the new files
  resolves; the per-file checker cannot see cross-file facts.
- `npx vitest run src/lib/collection.test.ts` — **passes**. No timer this ticket wrote is
  unreadable, and none claims four unbroken hours of a cook's attention.
- `npx vitest run src/lib/icons.test.ts` — **fails, and not on anything this ticket wrote.**
  See `review.md`; 46 verbs fall through to the plain bowl, all from other files, and the
  test was already red at this ticket's base commit `4abb4cf`.
