# T-002-04 — Research

What exists, where it lives, and what the One Pot shelf is actually short of. Descriptive only.

## 1. The collection as it stands

- 514 `.cook` files under `recipes/`, in 27 category folders. Folder name and the `>> category:`
  line agree throughout (`stews-and-braises/` → `Stews & Braises`).
- Folder sizes relevant to this ticket: `stews-and-braises/` 60, `soups/` 34,
  `rice-beans-and-grains/` 29, `vegetables-and-sides/` 6, `pasta/` 2
  (`baked-ziti`, `fresh-egg-pasta`), `eggs/` 2 (`eggs-benedict`, `western-omelette`).
  The thin folders are exactly where the One Pot gaps sit.
- `grep -rl 'One Pot' recipes/` returns **0**. T-002-01 opened the counter in
  `src/data/counters.json`; nothing names it yet. T-002-08 will do the shelving of the ~114
  files that already qualify. This ticket writes only what does not exist.

## 2. The counter definition

`src/data/counters.json` holds `One Pot` (slug `one-pot`, blurb "Everything goes in one pan, and
that is the only pan to wash") with five empty sections, in this order:

1. Braises and stews
2. Skillet dinners
3. Rice and grains that cook in
4. Soups that are the whole meal
5. Also here

`counters` is a list per recipe (`>> counters: Diner, Meat and Three`). `check-recipes.mjs`
validates every counter name against this file, so `>> counters: One Pot` is already legal and a
typo fails at check time rather than at build time.

## 3. The file format, as the checker enforces it

`scripts/check-recipes.mjs` → `scripts/normalise.mjs` (cooklang WASM parser) → `src/lib/tree.ts`
→ `src/lib/layout.ts`. What a file must satisfy:

- **Required metadata**: `title`, `category`, `tags`, `servings` (regex on `>> key:` lines).
  Counters, `aka`, `pairs-with`, `time`, `dish`, `kit` are optional and promoted to fields.
- **The tree is written, not guessed.** `@&(~1)browned beef{}` is an intermediate reference to the
  step one back. `tree.ts` throws when:
  - a referenced step makes nothing (`step N references step M, which makes nothing`),
  - a step is referenced by two later steps (a table is a tree, not a DAG),
  - more than one step ends the recipe ("N steps end the recipe … add an `@&(~1)…` reference").
    So every branch must flow into exactly one final step.
- **Size floors**: fewer than 3 ingredient rows → "too thin to be a table"; fewer than 3 columns
  → "only one operation — nothing merges, so the table is a list". Columns = 1 + depth of the op
  chain, so a linear chain of *n* operations gives *n+1* columns. Two ops is the floor; the
  written recipes here run four to six.
- **Tiling**: `findTilingErrors` requires every (row, column) covered exactly once. Linear chains
  and single-merge branches (see `mushroom-risotto`, which merges `@&(~4)mushrooms{}` into
  `@&(~1)risotto{}`) both tile correctly.
- **Every operation cell needs a label.** The label is the step sentence with its ingredients
  stripped (`stripIngredients` + `cleanLabel`), unless a `>> step.N: …` line overrides it. `N`
  counts *every* step in the file including prose-only ones, one-based.
- **Prose steps become full-width rows.** A step with no ingredients and no refs is a header (if
  written before the first real step) or a footer (after). `smothered-pork-chops` opens with one
  and closes with one; that is the house voice for a well-made file.

## 4. What a named timer buys

`src/lib/time.ts` reads `~name{qty%unit}`. The name is the author saying outright whether the
wait is `hands-on` or `unattended`:

- `UNATTENDED`: rest, chill, cool, soak, steep, bake, roast, braise, simmer, steam, boil, poach,
  stew, stand, marinate, smoke, drain, press, dry, and the pressure-cooker words.
- `HANDS_ON`: whisk, stir, knead, beat, mix, fold, toss, roll, saute, fry, stirfry, sear, brown,
  broil, temper, toast, grill, flip, baste, skim.
- An **unrecognised** name is not a claim and falls through to reading the step words; an
  **unnamed** timer (`~{90%min}`) does the same. Falling through defaults to `hands-on`, because
  telling a cook they can leave when they cannot is the worse error.

`beef-stew` and `jambalaya` (older files) use unnamed timers; `smothered-pork-chops` and
`corned-beef` (newer) use `~sear{8%min}`, `~braise{45%min}`. The ticket requires named timers, so
every timer written here must use a name from one of those two sets — a descriptive name outside
them is silently worthless.

Relevant subtlety for this shelf: a dark roux is 30–45 minutes of *continuous stirring*.
`~stir{…}` reads hands-on and is the honest name for it; `~simmer{…}` would lie.

## 5. What `docs/gaps/one-pot.md` says, and what the folders confirm

The gap file ranks 20 absences. Checked every one against `recipes/*/<slug>.cook` and against a
grep of all `>> title:` and `>> aka:` lines for near-names:

| # | dish | exists? |
|---|------|---------|
| 1 | chicken and dumplings | no |
| 2 | gumbo | no (no roux file either) |
| 3 | arroz con pollo | no |
| 4 | shakshuka | no |
| 5 | red beans and rice | no |
| 6 | étouffée | no |
| 7 | paella | no |
| 8 | one-pot pasta | no (`baked-ziti` boils separately) |
| 9 | skillet lasagna | no |
| 10 | tortilla española | no (the two `tortilla` files are the Mexican breads) |
| 11 | chicken cacciatore | no |
| 12 | beef stroganoff | no |
| 13 | sausage and peppers | no (`breakfast-sausage-patties`, `sausage-gravy` are other things) |
| 14 | New England boiled dinner | no (`corned-beef` exists, uncut and unaccompanied) |
| 15 | sancocho / caldo de res | no |
| 16 | ratatouille | no |
| 17 | kedgeree | no |
| 18 | chicken and biscuits | no (`buttermilk-biscuits` exists) |
| 19 | bigos | no |
| 20 | congee with thousand-year egg | plain `congee` exists in `soups/`; the ordered version does not |

**Nothing on the list has to be handed to T-002-08 as already-written.** The near-misses that a
careless writer would have collided with are recorded above so the check is on the record.

Components the gap file names as missing and that this ticket would touch: a dark roux, a trinity
base, a sofrito, drop dumplings, smoked haddock, a fish stock. None exist as files. Existing
components that can be *referenced as ingredients* rather than rewritten: `ham-hock-stock`,
`chicken stock` (used by name as an ingredient throughout), `buttermilk-biscuits`.

## 6. The honesty constraint, read against real dishes

The ticket's test: at the end, how many things need washing? More than the pot and the tools you
ate with, and it does not go on the shelf. The ticket's own carve-out: browning in the pot and
resting the meat on a plate is still one pot, because a plate is not a pot.

Applying that to the ranked list turns up three genuinely different cases:

1. **Complete in the pot.** Chicken and dumplings, shakshuka, arroz con pollo, paella, one-pot
   pasta, skillet lasagna, cacciatore, sausage and peppers, boiled dinner, sancocho, ratatouille.
   No second vessel at any point. These are unproblematic.
2. **Complete in the pot only in the version that cooks the starch in.** Beef stroganoff is
   normally beef over separately boiled egg noodles; the widely-made weeknight version simmers
   the noodles in the beef broth in the same skillet and folds sour cream in off the heat. The
   second version is a real dish, not a compromise, and it is the only one that belongs here.
3. **Not one pot as served.** Red beans and rice and étouffée are both *a pot plus a pot of
   rice*. That is the ticket's colander case wearing a different hat: the dish as a person eats
   it needs a second vessel, and no wording in the file changes what gets washed.

Gumbo sits on the line and lands on the safe side of it: a gumbo is finished in the pot and eaten
from a bowl. Rice is how it is often served, not how it is made — the pot is complete without it,
which is not true of étouffée, where the rice is the entire starch of the plate.

Tortilla española has a smaller version of the same question. The classic method fries the potato
in oil, lifts it out, and folds it into beaten egg. The lifting-out vessel is a bowl, which the
ticket has already ruled on ("a plate is not a pot"), and the oil is poured off rather than
strained. One pan, one bowl, no colander.

The gap file's own "could not stock" section flags two more limits that bear on writing: the
socarrat cannot be held by a table (a table can say *do not stir for eight minutes*; it cannot
hold a heat gradient), and "put everything in and simmer" is rejected by the checker as one
operation, which is a live risk for the simplest weeknight dishes here.

## 7. Boundaries

- **Owned by this ticket**: new files under `recipes/**` only. No file that existed before is
  edited — that includes `docs/gaps/one-pot.md`, `src/data/counters.json`, and every existing
  `.cook`.
- **Not this ticket**: shelving the ~114 qualifying files (T-002-08); any pressure-cooker file
  (T-002-02 braises, T-002-03 beans and stocks — both in flight now, both would use
  `>> kit:` / Instant Pot vessels). Nothing written here may use a pressure cooker.
- The generated `src/generated/recipes.json` is a build output (`npm run recipes`), not something
  to hand-edit; `check-recipes.mjs` writes nothing, so it is safe to run alongside the other two
  agents working the same branch.

## 8. Assumptions carried into Design

- `>> counters: One Pot` alone is correct on a new file even where the dish also belongs at the
  Diner or the Pizzeria; T-002-08 owns cross-shelving, and a second counter here is a claim about
  another counter's board that this ticket has not read. (Exception noted in Design.)
- Section assignment per file is recorded in the work artifact, not in the file: the `.cook`
  format has no section field, and `counters.json` is where sections live — which T-002-08 edits.
- Sixteen ranked dishes are reachable within the count; the two that fail the washing-up test are
  named as skips rather than written weakly.
