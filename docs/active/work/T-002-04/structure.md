# T-002-04 — Structure

Fourteen new `.cook` files. No existing file is edited, created elsewhere, or deleted.

## Files created

| # | rank | path | vessel | shelf section | skillet? |
|---|------|------|--------|---------------|----------|
| 1 | 1 | `recipes/stews-and-braises/chicken-and-dumplings.cook` | Dutch oven | Braises and stews | |
| 2 | 2 | `recipes/soups/gumbo.cook` | Dutch oven | Soups that are the whole meal | |
| 3 | 3 | `recipes/rice-beans-and-grains/arroz-con-pollo.cook` | Dutch oven | Rice and grains that cook in | |
| 4 | 4 | `recipes/eggs/shakshuka.cook` | cast-iron skillet | Skillet dinners | ✓ |
| 5 | 7 | `recipes/rice-beans-and-grains/paella.cook` | wide shallow pan | Rice and grains that cook in | |
| 6 | 8 | `recipes/pasta/one-pot-pasta.cook` | deep skillet | Rice and grains that cook in | (spare) |
| 7 | 9 | `recipes/pasta/skillet-lasagna.cook` | cast-iron skillet | Skillet dinners | ✓ |
| 8 | 10 | `recipes/eggs/tortilla-espanola.cook` | nonstick skillet | Skillet dinners | ✓ |
| 9 | 11 | `recipes/stews-and-braises/chicken-cacciatore.cook` | large skillet | Skillet dinners | ✓ |
| 10 | 12 | `recipes/noodles/beef-stroganoff.cook` | large skillet | Skillet dinners | ✓ |
| 11 | 13 | `recipes/stews-and-braises/sausage-and-peppers.cook` | large skillet | Skillet dinners | ✓ |
| 12 | 14 | `recipes/stews-and-braises/new-england-boiled-dinner.cook` | stockpot | Braises and stews | |
| 13 | 15 | `recipes/soups/sancocho.cook` | stockpot | Soups that are the whole meal | |
| 14 | 16 | `recipes/stews-and-braises/ratatouille.cook` | Dutch oven | Braises and stews | |

Six skillet dinners; `one-pot-pasta` is the seventh candidate held in reserve (Design 2).

Folder choice follows the folder each dish's nearest neighbour already sits in:
`stews-and-braises/` holds the skillet mains (`smothered-pork-chops`, `chicken-adobo`),
`noodles/` holds the American noodle dinners (`macaroni-and-cheese`, `tuna-noodle-casserole`),
`pasta/` holds the Italian ones (`baked-ziti`), `eggs/` has two files and gains two.

Ranks skipped, with reasons carried into `progress.md` and `review.md`:

- **rank 5, red beans and rice** — a pot of beans plus a pot of rice. Fails the washing-up test.
- **rank 6, étouffée** — a sauce whose entire starch is a separately cooked pot of rice. Same.

Ranks 17–20 are past the count and additionally blocked or duplicative: 17 kedgeree needs a
`smoked-haddock` component that does not exist; 18 chicken and biscuits is rank 1's pot again; 19
bigos is recorded as the Deli's; 20 is a variant of the existing `congee`, which is shelving work.

## File shape (every file)

```
>> title: <Title Case>
>> category: <matches the folder>
>> tags: <5–7, lowercase, comma separated; always includes one-pot>
>> counters: One Pot
>> aka: <what people call it when they order it — omitted only where there is no other name>
>> servings: <n>
>> time: <total, as a cook would say it>
>> step.1: <the header prose, repeated verbatim>
>> step.2..N: <verb-first label, e.g. "brown 8 min", "simmer covered 25 min">

<header prose — no @ingredients, no refs>

<operation 1 — ingredients only>

<operation 2 — @&(~1)state{} plus its own ingredients>
...
<operation N — @&(~1)state{} plus its own ingredients>

<footer prose — no @ingredients, no refs>
```

Constraints this shape satisfies (from `research.md` §3):

- one root: operations form a single chain, each referencing the one before, so exactly one step
  ends the recipe;
- ≥3 ingredient rows and ≥3 columns: every file has ≥4 operations (≥5 columns) and ≥8 ingredients;
- every operation cell labelled: `>> step.N:` on every operation step;
- `step.N` is one-based over **all** steps including the two prose ones, so operations start at
  `step.2` and the footer prose is left without an override.

Timers use names from `time.ts`'s vocabularies only: `~brown`, `~sear`, `~fry`, `~saute`,
`~toast`, `~stir`, `~simmer`, `~braise`, `~steam`, `~poach`, `~rest`, `~stand`, `~soak`, `~bake`.
No unnamed `~{n%min}` anywhere.

## Per-file skeletons

Written as: label — what the step does. Each operation after the first takes `@&(~1)…{}`.

**chicken-and-dumplings** (Dutch oven, 6 serv) — brown 8 min · sweat 6 min · simmer covered 35
min, shred the meat in · stir the dumpling dough · steam covered 15 min, lid closed. Drop
dumplings mixed in a bowl and dropped on the surface; the bowl is the ticket's plate case.

**gumbo** (Dutch oven, 8 serv) — brown the sausage 8 min · stir the roux 35 min to milk chocolate
· drop in the trinity, 6 min · simmer 45 min · simmer 8 min, shrimp and okra in, filé off the
heat. The roux and the trinity are the two operations the gap file names as components; here they
are steps in the pot they belong to.

**arroz-con-pollo** (Dutch oven, 6 serv) — sear skin side down 10 min · sofrito 8 min · toast the
rice 2 min · simmer covered 22 min · rest 10 min, peas and olives folded in.

**shakshuka** (cast-iron skillet, 4 serv) — soften the peppers 10 min · bloom the spices 1 min ·
simmer 15 min to a thick sauce · poach the eggs covered 8 min · off the heat, feta and herbs.

**paella** (wide shallow pan, 6 serv) — brown the chicken 10 min · sofrito 8 min · toast the rice
2 min · boil hard 10 min, then low 8 min, unstirred · rest 10 min under a towel. The footer is the
socarrat: listen for it, do not stir for it.

**one-pot-pasta** (deep skillet, 4 serv) — soften the garlic 3 min · in with the tomatoes and the
water · simmer 12 min, stirring, until the pasta takes up the liquid · off the heat, basil and
cheese. The pasta goes in dry and the starch it sheds is the sauce.

**skillet-lasagna** (cast-iron skillet, 4 serv) — brown the sausage 8 min · aromatics 4 min · in
with the tomatoes and the broken noodles · simmer covered 20 min · dot with ricotta, cover 5 min.

**tortilla-espanola** (nonstick skillet, 4 serv as a main) — fry the potato and onion 20 min in
oil · pour off the oil, beat the eggs, lift the potato in, stand 10 min · set 8 min over low heat
· flip and set 4 min more. The flip is the step the file exists to describe.

**chicken-cacciatore** (large skillet, 4 serv) — brown skin side down 10 min · peppers and onion 8
min · deglaze with wine · braise covered 35 min · reduce 8 min, olives and herbs.

**beef-stroganoff** (large skillet, 4 serv) — sear the beef 3 min, out to a plate · brown the
mushrooms 8 min · flour and stock in · simmer the noodles 12 min · fold the sour cream in off the
heat, beef back. The last step is its own step because it is the one thing people get wrong.

**sausage-and-peppers** (large skillet, 4 serv) — brown the sausages 10 min, out to a plate ·
peppers and onion 12 min in the fat · deglaze and scrape · braise covered 15 min with the sausages
back in. Four operations, not "everything in and simmer" (Design 9).

**new-england-boiled-dinner** (stockpot, 6 serv) — simmer the corned beef 3 hr · potatoes and
carrots in, 20 min · cabbage in, 15 min · rest 15 min, carve across the grain. The vegetables go
in in the order of how long they take, which is the whole discipline of the dish.

**sancocho** (stockpot, 6 serv) — brown the beef 10 min · sofrito 6 min · simmer 1 hr 30 min ·
root vegetables in, 25 min · corn and plantain in, 12 min, cilantro off the heat.

**ratatouille** (Dutch oven, 4 serv) — fry the aubergine 8 min · courgette and pepper 6 min ·
onion, garlic and herbs 5 min · tomatoes in, simmer uncovered 30 min · stand 15 min off the heat.
Each vegetable is given the pot alone in the order it needs, which is the reason it is not one
step.

## Ordering of the work

Files are independent; they are written and committed in ranked order so that a partial run leaves
the top of the gap list done rather than a scatter. Commits are grouped by section
(braises/stews, then the six skillet dinners, then rice-and-grains, then soups) so each commit is
a readable unit.

## Not touched

`docs/gaps/one-pot.md`, `src/data/counters.json`, `src/generated/**`, any existing `.cook`, any
script. The build artifact `src/generated/recipes.json` is regenerated by `npm run recipes` and is
not part of this ticket's `--include` paths.
