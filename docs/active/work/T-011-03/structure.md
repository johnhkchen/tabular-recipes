# T-011-03 — Structure

46 files, one added line each. No file is created, deleted, or changed in any other way.

---

## The change, in full

One line per file:

```
>> capacity: <servings> — <vessel>, <operations>
```

**Placement.** Immediately after `>> washing-up:` where the file has one, else after `>> slack:`,
else after `>> time:`. That is `README.md`'s own documented order — `slack`, `washing-up`,
`capacity`, `keeps` — and it puts the line in the metadata block, never in the body. Nothing else
on the line, and no blank line added or removed.

**Nothing else moves.** No step, no ingredient, no timer, no other metadata key. The verification
in `plan.md` is a diff filtered to added lines, and every added line has to start `>> capacity:`.

## The 46 files

### Group 1 — the file states a batch count (25 files)

`c = ceil(s/N)`, verified to reproduce `ceil(s/c) = N`.

| File | `s` | `N` | `c` | The line |
| --- | ---: | ---: | ---: | --- |
| `recipes/stir-fries/beef-with-broccoli.cook` | 4 | 2 | 2 | `2 — the wok, sear` |
| `recipes/stir-fries/general-tsos-chicken.cook` | 4 | 2 | 2 | `2 — four cups of oil in the wok, fry` |
| `recipes/stir-fries/orange-chicken.cook` | 4 | 2 | 2 | `2 — four cups of oil in the wok, fry` |
| `recipes/stir-fries/sesame-chicken.cook` | 4 | 2 | 2 | `2 — four cups of oil in the wok, fry` |
| `recipes/stir-fries/sweet-and-sour-pork.cook` | 4 | 2 | 2 | `2 — four cups of oil in the wok, fry` |
| `recipes/fried-and-crispy/batata-harra.cook` | 4 | 2 | 2 | `2 — four cups of oil in the pan, fry` |
| `recipes/fried-and-crispy/fried-chicken.cook` | 6 | 2 | 3 | `3 — the cast-iron skillet of fat, fry` |
| `recipes/noodles/soy-sauce-pan-fried-noodles.cook` | 2 | 2 | 1 | `1 — the frying pan, fry` |
| `recipes/soups/wonton-soup.cook` | 4 | 2 | 2 | `2 — the wide pot, boil` |
| `recipes/soups/borscht-instant-pot.cook` | 6 | 2 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/beef-bourguignon-instant-pot.cook` | 6 | 2 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/beef-stew-instant-pot.cook` | 6 | 2 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/beef-stew-slow-cooker.cook` | 6 | 2 | 3 | `3 — the skillet, brown` |
| `recipes/stews-and-braises/braised-short-ribs-instant-pot.cook` | 4 | 2 | 2 | `2 — the Instant Pot's base, sear` |
| `recipes/stews-and-braises/cachete-instant-pot.cook` | 6 | 2 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/carnitas-instant-pot.cook` | 8 | 3 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/carnitas-slow-cooker.cook` | 8 | 3 | 3 | `3 — the skillet, brown` |
| `recipes/stews-and-braises/chili-con-carne-instant-pot.cook` | 6 | 2 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/chili-con-carne-slow-cooker.cook` | 6 | 2 | 3 | `3 — the skillet, brown` |
| `recipes/curries/dansak.cook` | 6 | 2 | 3 | `3 — the heavy pot, sear` |
| `recipes/stews-and-braises/oxtails.cook` | 6 | 2 | 3 | `3 — the Dutch oven, brown` |
| `recipes/stews-and-braises/oxtails-instant-pot.cook` | 6 | 2 | 3 | `3 — the Instant Pot's base, brown` |
| `recipes/stews-and-braises/oxtails-slow-cooker.cook` | 6 | 2 | 3 | `3 — the skillet, brown` |
| `recipes/curries/rogan-josh.cook` | 6 | 2 | 3 | `3 — the heavy pot, sear` |
| `recipes/curries/vindaloo.cook` | 6 | 2 | 3 | `3 — the heavy pot, sear` |

### Group 2 — S-008's basket (21 files)

`c = s`, vessel `one 5.7 L air fryer basket`, operations `roast, air fry`.

`air-fryer-batata-harra` · `air-fryer-broccoli` · `air-fryer-brussels-sprouts` ·
`air-fryer-cauliflower` · `air-fryer-chicken-thighs` · `air-fryer-chicken-tikka` ·
`air-fryer-chicken-wings` · `air-fryer-chickpeas` · `air-fryer-chips` · `air-fryer-corn-ribs` ·
`air-fryer-frozen-chips` · `air-fryer-frozen-prawns` · `air-fryer-frozen-spring-rolls` ·
`air-fryer-halloumi` · `air-fryer-padron-peppers` · `air-fryer-salmon` ·
`air-fryer-shish-tawook` · `air-fryer-sweet-potatoes` · `air-fryer-tofu` — all `c = 4`.
`air-fryer-reheated-pizza` and `air-fryer-saba-shioyaki` — `c = 2`, their own servings.

Across five folders: `fried-and-crispy/` (8), `vegetables-and-sides/` (7),
`smoked-and-grilled/` (4), `dumplings-and-rolls/` (1), `pizzas/` (1).

## Ordering

The two groups are independent — no file is in both, and nothing reads another file. They are two
commits only because they are two different arguments and a reviewer should be able to accept one
and question the other.

1. **Group 1**, 25 files. The arithmetic case.
2. **Group 2**, 21 files. The stated-vessel case.

Then verification, which is read-only and commits nothing.

## Boundaries

| Thing | Owner | This ticket |
| --- | --- | --- |
| `>> capacity:` in `recipes/**/*.cook` | **T-011-03** | writes 46 lines |
| `src/lib/scaling.ts`, its test | T-011-02 | read only |
| `scripts/check-recipes.mjs`, `normalise.mjs` | T-011-02 | run only |
| `scripts/parse-recipes.mjs` | unclaimed | **not touched** — see below |
| `docs/knowledge/scaling.md` | T-011-01 | read only; §7's air fryer block now has real files, and rewriting it is T-011-01's |
| the plan page | T-011-05 | untouched |

**`parse-recipes.mjs` stays as it is.** T-011-02's review asks the next owner to make it throw on
`capacityProblem`, and names this ticket as the natural place. It is not in this ticket's ownership
list — the AC says only `recipes/**/*.cook` and the work directory may change — so it is carried
into `review.md` as a finding instead. Nothing ships broken either way: `npm run check` fails on a
malformed line and runs first inside `npm run verify`.

## What is not written

Recorded in `progress.md`, file by file with its reason. In summary:

| Group | Files | Why not |
| --- | ---: | --- |
| `in batches`, no count | 11 | the number is not in the file |
| `one layer` in an unsized vessel | 13 | says the amount fits, not that the vessel is full |
| cookie and other baking sheets | 24 | never says how many to a sheet, or whether the oven takes both |
| griddle · iron · comal · tawa · crepe pan | 10 | one item at a time, and no file says how many items a serving is |
| bamboo steamers | 8 | *"well apart"*, and no count of tiers |
| baking steels | 6 | one pie, and the steel's size is never stated |
| smokers and charcoal grills | 14 | grate area is real; a brisket is one piece |
| `batch` meaning a quantity or *the lot* | 19 | not a load count at all |

## Verification, defined here and executed in `plan.md`

1. Every line parses: `readCapacity()` returns a `Capacity` with a vessel and an operation.
2. Every line binds a step **that carries a timer the capacity names**. The silent failure mode —
   `roast` alone on a basket — is a `costMinutes` of 0 where a wait repeats.
3. `ceil(s/c) = N` for all 25 of group 1.
4. `npm run check` — 685 files, no new failure, no new warning.
5. `npm run verify` — check, generate, 1104 tests, build.
6. `git diff` limited to added lines, all 46 of them `>> capacity:`.
7. `costOf()` at 2×, 3× and 12 servings over all 46, with the ten largest jumps in elapsed time.
