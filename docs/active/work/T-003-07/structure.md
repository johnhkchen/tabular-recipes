# T-003-07 — Structure

No new files, no deleted files, no new modules. This ticket edits metadata lines in `.cook`
files, one word in one TypeScript vocabulary, and three markdown notes. The structure worth
defining is therefore not architecture — it is **which files are touched, in which batches, and
what the boundary of each batch is**, because a batch is a commit and a commit is what a
reviewer reads.

---

## The shape of every recipe edit

One line, inserted into the metadata block:

```
>> time: 7 hr
>> slack: forgiving — a turkey wing is collagen and skin, and at six hours or eight it either
   stays on the bone or falls off it and both are dinner; the skin is the part with no room
>> step.2: season, under the skin too
```

**Position: after `>> time:` and before the first `>> step.N:`.** That is where all 101
existing lines sit, and `normalise.mjs` does not care about order, so the only reason to be
consistent is that a human opening two files should see the same shape.

**One physical line.** Cooklang metadata is line-based; a wrapped reason would be read as the
start of the next directive. Some of these lines are long. That is correct and the existing
files already do it.

Nothing else in a recipe file changes. No timers, no quantities, no steps, no prose. A slack
line that requires the recipe to be rewritten means the reason is wrong, not the recipe.

---

## Batch 1 — pressure (25 files)

`recipes/**/…-instant-pot.cook`, all of them. Every file carrying `kit: Instant Pot`.

The boundary is the predicate, which makes the batch self-checking: `grep -L '^>> slack:'` over
the 25 must come back empty when the batch is done.

Two sub-shapes inside it, and they take different levels:

- **Beans from dry and pork** — `unforgiving`. Under-done is a safety failure and the locked
  lid means it is invisible until the pot is open. `boston-baked-beans-instant-pot`,
  `cuban-black-beans-instant-pot`, `ful-medames-instant-pot`, `refried-beans-instant-pot`,
  `gigantes-plaki-instant-pot`, `carnitas-instant-pot`, `chile-verde-instant-pot`.
- **Braises and stocks** — mostly `forgiving`, but each names the one part with no room. The
  release is usually it: a natural release cut short is the difference between shreddable and
  tough, and there is no putting it back under pressure.

## Batch 2 — cures, pickles and beans on the stove (~22 files)

`corned-beef` · `corned-beef-instant-pot` · `pastrami` · `cha-lua` · `char-siu` · `siu-yuk` ·
`chashu` · `scrapple` · `sour-dill-pickles` · `lime-pickle` · `do-chua` · `kabis` · `menma` ·
`ajitama` · `crema-mexicana` · `cream-cheese` · `labneh` · `queso-fresco` · `pork-liver-pate` ·
`ful-medames` · `boston-baked-beans` · `cuban-black-beans` · `gigantes-plaki` · `falafel`

The batch where "say that plainly" applies hardest. A fermenting pickle, a cure and a held pâté
each have a real failure that is not "worse dinner", and the reason has to name it as what it
is.

## Batch 3 — smoke and grill (16 files)

`recipes/smoked-and-grilled/` — everything undeclared with a long cook. `pastrami` is in
Batch 2 with the cures instead, because its 130 hours are a brine, not a smoke.

Mostly `forgiving` on the long side and `narrow` at one specific point: the stall, the pull
temperature, the rest. A brisket held an extra hour in a cooler is fine; a brisket pulled at
the wrong internal temperature is not, and it does not come back.

## Batch 4 — braises and stocks (~38 files)

`recipes/stews-and-braises/` (27 remaining after Batches 1–2) and `recipes/soups/`
(8 remaining), plus `bolognese` and `attar`.

The shelf's whole claim lives here. Most will be `forgiving`, and the ticket says so outright:
"the honest answer is usually *an extra hour changes little* — and saying so is what makes the
walk-away shelves trustworthy." The value is in each one naming its exception.

## Batch 5 — doughs (~40 files)

`recipes/breads/` (22), `recipes/pastry-and-doughs/` (7), `recipes/dumplings-and-rolls/` (4),
`recipes/flatbreads-and-pancakes/` (7).

The bulk ferment is the window. Over-proof is the failure and it is one of the few in baking
that genuinely does not come back — the gluten has gone, and no amount of extra oven fixes it.
Laminated doughs have a second, tighter window: butter temperature.

## Batch 6 — custards, puddings and sugar (~38 files)

`recipes/custards-and-puddings/` (30) and the sweet long cooks in `bars-and-brownies`,
`cakes-and-loaves` and `cookies` (8).

Where the property earns its place. The custard that breaks past its temperature and does not
come back is the worked example in `slack.ts`'s own header. Two safety cases sit here and take
`unforgiving`: a custard held warm, and anything set with egg and left out.

## Batch 7 — short windows (~30 files)

The set no measurement reaches. Emulsions (`mayonnaise`, `aioli`, `hollandaise`,
`beurre-blanc`, `caesar-dressing`, `toum`, `cheddar-cheese-sauce`), sugar work (`hot-fudge`,
`piloncillo-syrup`, `english-toffee-bars`), foams (`angel-food-cake`, `chiffon-cake`,
`castella`, `zabaglione`, `whipped-cream`), grain at al dente (`risotto-alla-milanese`,
`polenta`, `paella`, `arroz-con-pollo`, `one-pot-pasta`, `fresh-egg-pasta`), the fast custards
(`chawanmushi`, `bread-pudding`, `cherry-clafoutis`, `egg-custard-tart`, `frangipane`,
`peach-cobbler`, `rice-pudding`, `sweet-potato-pie`, `tapioca-pudding`), and the fryer
(`french-fries`, `onion-rings`, `karaage`).

## Batch 8 — the remaining long cooks (~10 files)

`potato-salad` · `macaroni-salad` · `whitefish-salad` · `shio-tare` · `shoyu-tare` ·
`miso-tare` · `barbecue-dip` · `ramen-noodles` · `bulgogi-marinade` · `chopped-liver` ·
`lo-mai-gai` · `com-tam` · `biryani` · `bun-thit-nuong` · `banh-mi-thit-nuong` · `injera` ·
`dosa` · `corn-tortillas` · `nixtamalised-masa` · `turnip-cake` · `taro-cake` · `papadom`

Whatever P1 still holds when Batches 1–7 are done. The batch exists so the predicate can be
run to empty rather than left "mostly done".

---

## Batch 9 — `src/lib/time.ts`

```diff
 const UNATTENDED = new Set([
   'rise', 'prove', 'proof', 'ferment', 'rest', 'chill', 'cool', 'freeze', 'set',
   'marinate', 'brine', 'soak', 'steep', 'bake', 'roast', 'braise', 'simmer', 'steam',
-  'boil', 'slowcook', 'infuse', 'dry', 'cure', 'age', 'refrigerate', 'overnight',
+  'boil', 'parboil', 'slowcook', 'infuse', 'dry', 'cure', 'age', 'refrigerate', 'overnight',
```

One word. The comment above the set explains why each questionable member is there; `parboil`
needs a line saying it is safe from the `NOT_A_VERB_IN_A_SENTENCE` trap that withholds `boil`,
and why — that it appears in the collection only as a timer name or as the verb opening its
own step, seven times, every one of them "bring to a boil and parboil, then drain and rinse."

**Blast radius, stated before the edit:** seven timers in six files — `buri-daikon` (20 min),
`chintan-broth` and its Instant Pot sibling (10 min each), `pho-broth` and its sibling (10 min
each), `tonkotsu-broth` and its sibling (30 min each). All seven move from hands-on to
unattended. `buri-daikon` goes from 30 hands-on / 25 unattended to 10 / 45, which is what the
dish actually is. No test asserts the old reading.

**This is the only file changed outside `recipes/` and `docs/`.**

## Batch 10 — `recipes/stews-and-braises/corned-beef-slow-cooker.cook`

The `>> aka:` line drops `crockpot corned beef and cabbage` and keeps everything else. Grouped
with the slack batches rather than given its own commit only if it lands in the same pass;
otherwise its own, because it is a different kind of claim.

## Batch 11 — the three gap docs

`docs/gaps/soup-pot.md` · `docs/gaps/japanese-home.md` · `docs/gaps/slow-cooker.md`

Per file, in order:

1. **Headline count** — from `recipes.json`, not from the ticket.
2. **`## What it has`** — rewritten from the shelf. `soup-pot.md` additionally renames its
   `## What is already here` heading, which is the edit its own text says T-003-06 would make
   and did not.
3. **`## What it is missing`** — every rank that has since been written moves out; the
   remainder keeps its reasoning verbatim, with the arithmetic corrected.
4. **A closing block** — what reading the whole collection found for this shelf, and what is
   left open. This is the "after" half of the before/after shape.

**Sections 3 and later of each file — components, what it could not stock, sources — are not
touched** unless the shelf made them wrong. They are T-003-01's research and rewriting them
would lose detail to no purpose.

**Order matters here:** the `What it has` blocks must be written from a `recipes.json` that
already has this ticket's edits in it, so Batch 11 runs after `npm run recipes` has been
re-run. Anything else risks the block disagreeing with the file it is folded into.

---

## Verification points

| After | Run | Expect |
| --- | --- | --- |
| each recipe batch | `node scripts/check-recipes.mjs <paths>` | `all N file(s) draw a table` |
| Batch 9 | `npx vitest run src/lib/time.test.ts src/lib/schedule.test.ts` | green |
| Batch 9 | the `buri-daikon` measurement | 10 hands-on / 45 unattended |
| Batch 11 | `node scripts/menu-sections.mjs` | nothing unparsed, no slug it cannot resolve |
| the end | `npm run verify` | all four stages pass |

`check-recipes.mjs` writes nothing and takes explicit paths, so a batch can be checked without
building the collection — which is what makes eleven batches cheap rather than eleven full
builds.
