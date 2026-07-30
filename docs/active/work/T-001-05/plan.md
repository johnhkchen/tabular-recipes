# T-001-05 — Plan

Five commit units, fourteen files. Each unit is written, checked with the per-file gate, then
committed through `lisa commit-ticket`. The collection-wide invariants run once at the end,
because they cannot hold until the last `pairs-with` target exists.

## Verification, and what each level catches

| Command | Catches | When |
| --- | --- | --- |
| `node scripts/check-recipes.mjs --labels <files>` | missing metadata, unknown counter, broken refs, un-mergeable tree, holes in the tiling, <3 rows, <3 cols, an operation cell with no label — and prints the staircase so the labels can be read as a cook's verbs | before every commit unit |
| `grep -n '~{' <files>` | an unnamed timer | before every commit unit |
| `npm run recipes` | duplicate slug, a recipe at no counter, a `pairs-with` pointing nowhere | after unit 5 |
| `npx vitest run src/lib/collection.test.ts` | one-way pairings, four unbroken hands-on hours, an unreadable timer duration | after unit 5 |
| `npm run verify` | all of the above plus the build | after unit 5 |
| `git status --short` | anything modified outside `recipes/` | after unit 5 |

The label staircase is a judgement call, not an assertion: `--labels` output is read for every
file and any cell that comes out as a sentence fragment gets a `>> step.N:` override. That is the
acceptance criterion *"reads as a cook's verbs rather than sentence fragments"*, and nothing
automated can decide it.

## Before writing anything

1. `ls recipes/*/<slug>.cook` for all fourteen slugs — already run in Research, all fourteen
   absent. Re-run immediately before each unit, because three other tickets are in flight.
2. `mkdir recipes/smoked-and-grilled` happens implicitly with the first file written there.

## Unit 1 — the table sauces and the slaws

Files: `recipes/sauces-and-gravies/barbecue-dip.cook`,
`recipes/dressings-and-dips/barbecue-slaw.cook`, `recipes/dressings-and-dips/coleslaw.cook`

First because every pit meat points at one of them, and because the dip is the gap doc's *"more
important of the two"* sauces. `coleslaw` is the one file here that names three counters.

Check, then:
```
lisa commit-ticket --ticket-id T-001-05 \
  --message "Write the dip and both slaws for the Smokehouse" \
  --include recipes/sauces-and-gravies/barbecue-dip.cook \
  --include recipes/dressings-and-dips/barbecue-slaw.cook \
  --include recipes/dressings-and-dips/coleslaw.cook
```

Verification beyond the gate: `barbecue-dip` must not read as a near-duplicate of
`barbecue-sauce` — different base (vinegar, not ketchup-and-molasses), different method (no
sweating aromatics), different use. Read both files side by side before committing.

## Unit 2 — the pit, pork

Files: `recipes/smoked-and-grilled/chopped-pork.cook`, `.../smoked-pork-ribs.cook`,
`.../rib-tips.cook`

Creates the folder and therefore the category. Risks specific to this unit:

- The two-branch shape (rub, spritz, smoke consuming both) is the first place the `~2` back-
  reference is used in this ticket. If `check-recipes` reports a hole in the tiling, the cause is
  a reference counting the full-width prep row differently than expected — the fix is to check
  `~N` against the steps **as written**, prep row included.
- `chopped-pork` is the file carrying gap 16. Its final label must say the outside brown is kept
  in, or the ticket has quietly dropped an item off the list.

```
lisa commit-ticket --ticket-id T-001-05 \
  --message "Write chopped pork, ribs and rib tips for the Smokehouse" \
  --include recipes/smoked-and-grilled/chopped-pork.cook \
  --include recipes/smoked-and-grilled/smoked-pork-ribs.cook \
  --include recipes/smoked-and-grilled/rib-tips.cook
```

## Unit 3 — the pit, beef

Files: `recipes/smoked-and-grilled/smoked-brisket.cook`, `.../burnt-ends.cook`

The brisket seasoning is salt and coarse pepper and nothing else. That is deliberate and is the
gap doc's stated reason for wanting a beef rub at all; a paprika-and-brown-sugar rub on a brisket
would be the shortcut wearing the name that the acceptance criteria forbid.

`~smoke{8%hr}` plus `~smoke{4%hr}` plus `~rest{2%hr}` is where the "never four unbroken hands-on
hours" test would fire if a timer name were wrong. `smoke` and `rest` are both in
`src/lib/time.ts`'s unattended set; confirm with `npx vitest run src/lib/time.test.ts` if
anything looks off.

```
lisa commit-ticket --ticket-id T-001-05 \
  --message "Write smoked brisket and burnt ends for the Smokehouse" \
  --include recipes/smoked-and-grilled/smoked-brisket.cook \
  --include recipes/smoked-and-grilled/burnt-ends.cook
```

## Unit 4 — the pit, poultry, and the bologna

Files: `recipes/smoked-and-grilled/smoked-chicken.cook`, `.../smoked-turkey-breast.cook`,
`.../smoked-bologna.cook`

`smoked-turkey-breast` references `@turkey brine{}` as an ingredient and pairs with the existing
`turkey-brine` recipe. The pairing edge is written here only; `turkey-brine.cook` is not opened.
Confirm after the build that `npm run recipes` reports no dangling pairing.

```
lisa commit-ticket --ticket-id T-001-05 \
  --message "Write smoked chicken, turkey breast and bologna for the Smokehouse" \
  --include recipes/smoked-and-grilled/smoked-chicken.cook \
  --include recipes/smoked-and-grilled/smoked-turkey-breast.cook \
  --include recipes/smoked-and-grilled/smoked-bologna.cook
```

## Unit 5 — bread, side, sweet

Files: `recipes/flatbreads-and-pancakes/hush-puppies.cook`,
`recipes/stews-and-braises/brunswick-stew.cook`,
`recipes/custards-and-puddings/banana-pudding.cook`

`hush-puppies` is the first deep fry on the site, so the oil is a real ingredient row with a real
quantity and the timer is `~fry` — hands-on, correctly, because you stand at the pot turning them.
`banana-pudding` names three counters and is the file most likely to be wanted by a later ticket;
it is written as the plain version so that Diner and Meat and Three can both take it as-is.

```
lisa commit-ticket --ticket-id T-001-05 \
  --message "Write hush puppies, Brunswick stew and banana pudding for the Smokehouse" \
  --include recipes/flatbreads-and-pancakes/hush-puppies.cook \
  --include recipes/stews-and-braises/brunswick-stew.cook \
  --include recipes/custards-and-puddings/banana-pudding.cook
```

## After the last unit

1. `node scripts/check-recipes.mjs --labels <all fourteen>` — one run, output pasted into
   `review.md` as the evidence for that criterion.
2. `grep -c '~{' recipes/smoked-and-grilled/*.cook <the other six>` — expect zero everywhere.
3. `npm run verify` — parse, tests, build. A failure here that is **not** caused by this ticket
   (T-001-01's review records one such pre-existing failure) is reported in `review.md` rather
   than fixed, because the fix would be outside this ticket's ownership.
4. `node -e` over `src/generated/recipes.json` to count Smokehouse recipes and Smokehouse-only
   recipes — the two headline acceptance numbers, measured rather than asserted.
5. `git status --short` — only `recipes/**` and Lisa's own files should appear, and no
   ticket-owned file should remain modified, staged or untracked.

## Testing strategy, stated plainly

There are no unit tests to write. This ticket adds data, not code, and the collection's tests are
already the tests for data: `collection.test.ts` is the suite that proves slugs are unique,
pairings are mutual, every recipe has a counter and no timer lies about attention.
`layout.test.ts` proves every table tiles without holes, over every file including these fourteen.
Adding a test here would mean testing the checker, which is not this ticket's subject.

The gap that leaves, and it is worth stating: **nothing automated can check that a recipe is
correct cooking.** A brisket smoked at the wrong temperature for the wrong time draws exactly the
same table as a right one. The defence is the sourcing — the method and the vocabulary come from
`docs/knowledge/counters.md` §Smokehouse and `docs/gaps/smokehouse.md`, and quantities are scaled
to the stated servings by hand — and a human reader. `review.md` names it as an open concern
rather than pretending the green checkmarks cover it.

## Rollback

Each unit is one commit of new files only. Nothing is modified, so reverting a unit is deleting
its files; no other ticket's work is entangled with any of them.
