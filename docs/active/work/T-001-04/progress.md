# T-001-04 — Progress

Complete. Fourteen files written and committed in eleven commits, in the plan's order. No
deviation from `plan.md`; no file exceeded its designed row count; nothing needed rewriting.

## Baseline (plan step 0)

Recorded before the first file was written, so "no new failure" is a comparison:

```
node scripts/check-recipes.mjs   →  all 254 file(s) draw a table
npx vitest run                   →  1 failed | 405 passed (406)
                                    src/lib/schedule.test.ts, red from T-001-01
```

## Commits

| # | Plan step | Files | Commit | Table |
| --- | --- | --- | --- | --- |
| 1 | 1 | `recipes/sauces-and-gravies/house-brown-sauce.cook` | `af087bd` | 10 × 5 |
| 2 | 2 | `recipes/dumplings-and-rolls/egg-rolls.cook` | `20908dc` | 15 × 6 |
| 3 | 3 | `recipes/stir-fries/general-tsos-chicken.cook` | `ce744b7` | 16 × 5 |
| 4 | 4 | `recipes/stir-fries/sesame-chicken.cook`, `recipes/stir-fries/orange-chicken.cook` | `db0e26a` | 16 × 5, 15 × 5 |
| 5 | 5 | `recipes/noodles/lo-mein.cook` | `4c7911e` | 15 × 4 |
| 6 | 6 | `recipes/stir-fries/beef-with-broccoli.cook` | `be05b1e` | 10 × 5 |
| 7 | 7 | `recipes/soups/hot-and-sour-soup.cook`, `egg-drop-soup.cook`, `wonton-soup.cook` | `befca49` | 14 × 6, 9 × 5, 16 × 5 |
| 8 | 8 | `recipes/stir-fries/egg-foo-young.cook` | `0cf8553` | 10 × 5 |
| 9 | 9 | `recipes/dumplings-and-rolls/crab-rangoon.cook` | `eb1d520` | 10 × 5 |
| 10 | 10 | `recipes/stir-fries/sweet-and-sour-pork.cook` | `01a12d4` | 10 × 5 |
| 11 | 11 | `recipes/noodles/singapore-mei-fun.cook` | `6edf20c` | 15 × 4 |

Every commit went through `lisa commit-ticket --ticket-id T-001-04` with exact
repository-relative `--include` paths. No ordinary `git add`, no ordinary `git commit`,
nothing left staged.

Three folders were created as designed: `recipes/stir-fries/`, `recipes/noodles/`,
`recipes/dumplings-and-rolls/`.

## Per-file checks at commit time

Every file was checked with `node scripts/check-recipes.mjs --labels <file>` before its
commit and came back `ok` first time. Row counts landed exactly where `structure.md` put
them, including the two designed at the 16-row ceiling (`general-tsos-chicken`,
`wonton-soup`). `sesame-chicken` came in at 16 as well — the sesame seeds row that
`structure.md` counted into the last step.

Column counts came in **lower** than the operation count on the branched files, because two
branches that start in the same column share it: `general-tsos-chicken` is 6 operations in 5
columns, `lo-mein` and `singapore-mei-fun` are 5 operations in 4. That is the layout doing
what it should — the phone-width worry in the README is about columns, and branching costs
none.

## Quantity and method notes, per the criteria

- **Velveting is written into the dish, not shortcut.** `general-tsos-chicken`,
  `sesame-chicken`, `orange-chicken` and `beef-with-broccoli` all carry the egg white,
  cornstarch, wine and baking soda with a named `~rest{30%min}` — the gap doc's *"the single
  thing home cooks most reliably do not know to look up."*
- **The twice-fry is two timers, not one.** 350°F then 375°F on all four fried mains, with
  the reason in the step text.
- **Quantities are for the stated servings**: 1½ lb chicken for 4, 1 lb flank steak plus 1 lb
  broccoli for 4, 1 lb noodles for 4, 6 cups stock for 6 (hot and sour), 4 cups for 4 (egg
  drop), 8 oz pork and 40 wrappers for 4 (wonton), 8 oz cream cheese and 24 wrappers for 24
  rangoon, 8 filled egg rolls from 8 oz pork.
- **Domestic hob honesty**, per Design decision 4: `lo-mein` and `singapore-mei-fun` say
  outright that a home hob does not give wok hei and where the flavour comes from instead;
  every fried and seared dish says to cook in two batches.
- **`aka` carries an ASCII form on all fourteen** — `general tsos chicken`, `hot & sour
  soup`, `won ton soup`, `gu lo yuk`, `singapore mai fun`, `chun juan` — plus Han characters
  where a board prints them, matching `char-siu`'s existing line. `general-tsos-chicken`
  carries `C16` and `C12`, the two numbers the gap doc names, in `aka` and nowhere else.

## Collection verification (plan step 12)

| Check | Result |
| --- | --- |
| `check-recipes.mjs --labels` over all fourteen | `all 14 file(s) draw a table` |
| `check-recipes.mjs` over everything | `all 280 file(s) draw a table` |
| unnamed timers in the fourteen (`grep '~{'`) | none |
| named timers, read back through `normalise()` | 47 timers, 0 unnamed, 0 with an unreadable duration, 0 hands-on ≥ 4 hr |
| unique slugs across the whole collection | ok, 294 files at the time of the run |
| dangling `pairs-with` **from these fourteen** | none |
| unknown counter names | none |
| dishes with two plain ways | none |
| Takeout Counter shelf | **20 shelved, 15 exclusive** (was 6 and 1) |
| `git status --porcelain` over this ticket's paths | empty |
| `npx vitest run` | 1 failed \| 405 passed — **identical to baseline** |

### One deviation from the plan, in the verification only

`npm run recipes` **does not complete**, and it is not this ticket's doing. It throws on the
first dangling `pairs-with` it meets, and at the moment of the run those belong to sibling
tickets still mid-flight on the same branch:

```
Error: recipes/dressings-and-dips/nuoc-cham.cook pairs with "cha-gio", which is not a
       recipe here.
```

A scan of every `pairs-with` in the collection finds four dangling edges, all from other
counters' in-progress files (`nuoc-cham` → `cha-gio`, `goi-cuon`, `bun-thit-nuong`;
`pho-broth` → `pho-bo`), and **none from these fourteen**. They resolve when T-001-02 writes
those dishes.

Because the collection build cannot run, `src/generated/recipes.json` cannot be refreshed,
so `npx vitest run` is testing the collection as it stood before these fourteen landed.
Rather than leave that gap, the collection-scope checks `parse-recipes.mjs` performs — unique
slugs, no recipe homeless, counter names known, pairings resolve and are not self-pairs, one
plain way per dish — were run directly against a fresh `normalise()` of every file on disk,
including all fourteen. Results are the table above. The script is read-only and lives in the
session scratchpad; it wrote nothing into the repository.
