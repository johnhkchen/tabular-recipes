# T-002-05 — Research

What exists, where, and what the shape of a `.cook` file forces on a composed bowl. Descriptive
only; the choice of which bowls to write is Design.

## 1. The ticket in one line

At least ten new `.cook` files, each `counters: The Bowl Shop`, each a composed grain or rice
bowl with real cooking in it, referencing existing components through `pairs-with:` rather than
re-teaching them.

## 2. The counter this ticket writes for

`src/data/counters.json` (opened by T-002-01) holds eighteen counters. The Bowl Shop entry:

```json
{ "name": "The Bowl Shop", "slug": "bowl-shop",
  "blurb": "Pick a base, pile it up, dress it last.",
  "categories": [],
  "sections": [ "Grain bowls", "Leafy salads", "What goes on top", "Roasted vegetables",
                "Dressings and drizzles", "Soups", "Also here" ] }
```

Two facts matter to this ticket:

- **`categories: []`.** No category falls through to this counter. A recipe reaches The Bowl Shop
  only by naming it in `>> counters:`. Nothing I write is shelved by accident, and nothing I write
  is shelved unless I say so.
- **`"Grain bowls"` is section 1**, and it is empty. This ticket fills it.

`scripts/check-recipes.mjs:22-26` builds `KNOWN_COUNTERS` from that file, so a misspelled counter
name is caught per-file, before the build.

## 3. What is already on the shelf

Nothing. `docs/gaps/bowl-shop.md:3` — *"0 recipes. The shelf was opened by T-002-01 and nothing is
on it yet."* Every slug listed in its `## What is already here` block is shelved at another
counter today; T-002-08 makes the actual `>> counters:` calls. That block is a candidate list, not
an assignment (T-002-01 review, *Open concerns* 5).

Counts confirmed by `ls`:

| Folder | Files | Relevance |
| --- | --- | --- |
| `recipes/rice-beans-and-grains/` | 31 (2 of them untracked, from T-002-04) | Where grain bowls belong |
| `recipes/dressings-and-dips/` | 40 | The dressing drawer. Ticket says 41; it is 40 (T-002-01 already recorded this) |
| `recipes/salads/` | 10 | T-002-06's ground |
| `recipes/toppings-and-pickles/` | 6 | T-002-07's ground |
| `recipes/vegetables-and-sides/` | 6 | T-002-07's ground — a Southern side board, no roasting tray |
| `recipes/sauces-and-gravies/` | 41 | `teriyaki-sauce`, `ginger-scallion-oil`, `salsa-verde-cruda` live here, not in the dressing drawer |
| `recipes/spice-blends-and-marinades/` | 28 | `harissa`, `chermoula`, `zaatar`, `dukkah` live here |

**Two composed bowls already exist and are the closest models in the collection:**
`recipes/rice-beans-and-grains/bun-thit-nuong.cook` (marinade → marinate → grill → boil noodles →
arrange, five ops, two branches) and `com-tam`. Both are shelved at Phở & Bánh Mì.

## 4. Where components live, and what a bowl may not re-teach

The AC forbids re-teaching a component that exists as its own recipe. The slugs a bowl is most
likely to want, confirmed present:

- **Dressings and dips** (`recipes/dressings-and-dips/`): `basic-vinaigrette`, `caesar-dressing`,
  `green-goddess-dressing`, `ranch-dressing`, `blue-cheese-dressing`, `honey-mustard-dressing`,
  `russian-dressing`, `miso-ginger-dressing`, `goma-dare`, `tahini-sauce`, `toum`, `tzatziki`,
  `raita`, `nuoc-cham`, `mint-chutney`, `chimichurri`, `basil-pesto`, `romesco`, `muhammara`,
  `hummus`, `baba-ganoush`, `aioli`, `mayonnaise`, `crema-mexicana`, `guacamole`, `labneh`,
  `do-chua`, `sour-dill-pickles`, `birista`, `queso-fresco`, `paneer`, `coleslaw`, `barbecue-slaw`.
- **Sauces** (`recipes/sauces-and-gravies/`): `teriyaki-sauce`, `ginger-scallion-oil`,
  `salsa-verde-cruda`, `salsa-roja`, `pomegranate-molasses`, `sweet-and-sour-sauce`, `mayu`.
- **Spice blends** (`recipes/spice-blends-and-marinades/`): `harissa`, `chermoula`, `zaatar`,
  `dukkah`, `shichimi-togarashi`, `ras-el-hanout`, `cajun-seasoning`, `taco-seasoning`.
- **Pickles** (`recipes/toppings-and-pickles/`): `ajitama`, `kabis`, `sumac-onions`, `sauerkraut`,
  `menma`.
- **Grain dishes** (`recipes/rice-beans-and-grains/`): `coconut-rice`, `lemon-rice`, `mujaddara`,
  `rice-pilaf`, `yellow-rice`, `mexican-red-rice`, `pilau-rice`, `kitchari`, `tabbouleh`,
  `cuban-black-beans`, `refried-beans`, `hoppin-john`, `polenta`, `cheese-grits`.
- **Cooked proteins** (`recipes/smoked-and-grilled/`, `recipes/stews-and-braises/`,
  `recipes/fried-and-crispy/`): `chicken-shawarma`, `shish-tawook`, `pollo-asado`, `carne-asada`,
  `kafta`, `smoked-chicken`, `char-siu`, `chashu`, `carnitas`, `tinga-de-pollo`, `karaage`,
  `falafel`, `meatballs`.
- **Broth**: `dashi`, `chicken-broth` (plus its Instant Pot variant).

What does **not** exist anywhere in the 514 files, checked by `ls` across all 27 folders: plain
cooked **quinoa**, **farro**, **wild rice**; any **cauliflower**; any **Brussels sprouts**; any
roasted **sweet potato** (`candied-yams` is a dessert); any **cooked salmon** (`belly-lox` is
cured); **pickled red onion** in a brine; **crispy chickpeas**; **whipped feta**; a plain
**seven-minute egg** (`ajitama` is soy-marinated and belongs to the Ramen Shop).

## 5. The authoring contract, as the code enforces it

From `README.md:19-157` and the three enforcing files:

**Required metadata** (`check-recipes.mjs:18`): `title`, `category`, `tags`, `servings`. The ticket
adds `counters` and `aka` on top.

**The tree** (`src/lib/tree.ts`):

- Leaves are ingredients, one row each. `col(op) = 1 + max(col(children))`; ingredients are col 1.
- Edges are cooklang intermediate references. `@&(~1)x{}` = one step back, counting **every** step
  including prose-only ones; `@&(3)x{}` = absolute step 3.
- `tree.ts:163-168` — **a step may flow into exactly one later step.** Two consumers is a hard
  error ("a table is a tree"), so a component used twice must be two steps or two files.
- `tree.ts:188-195` — **exactly one root.** Every branch merges into one final step.
- A step with no ingredients and no refs is a full-width row: a header if before the first real
  step, a footer if after. `~1` still counts it, which is why prose is kept at the top or at the
  very end (`README.md:106-111`).

**Size gates** (`check-recipes.mjs:70-72`): fewer than 3 ingredient rows fails; fewer than 3
columns fails ("only one operation — nothing merges"). `colCount` is the root's column, so
`colCount = 3` means two chained operations. The README's target is 5–16 rows and 3–6 operations.

**Labels** (`check-recipes.mjs:73-80`, `src/lib/label.ts`): the cell label is the step text with
ingredients stripped; cookware, temperatures and timers stay. An empty label fails.
`>> step.N: …` overrides it, 1-based over steps as written. `--labels` prints the staircase.

**Timers** (`src/lib/time.ts`): `~name{n%unit}`. A recognised name is the author saying outright
whether the wait is `UNATTENDED` (`roast`, `simmer`, `marinate`, `rest`, `chill`, `steam`,
`boil`, `poach`, `pressure*`…) or `HANDS_ON` (`sear`, `saute`, `stir`, `toss`, `toast`, `grill`,
`fry`, `whisk`…). An **unrecognised** name falls through to reading the step text, so
`~massage{2%min}` is not an error but is read from its label. Every timer must resolve to minutes
(`collection.test.ts:90-95`) and nothing may claim ≥240 unbroken hands-on minutes
(`collection.test.ts:77-88`).

**Metadata that is validated at build, not per-file** (`scripts/parse-recipes.mjs`,
`src/lib/collection.test.ts`):

- `pairs-with` slugs must resolve (`collection.test.ts:36-39`) and are **made mutual at build
  time** (`:41-51`), so writing it on one side only is correct and does not edit the other file.
- Slugs are unique across the whole collection — basenames are URLs.
- `dish`/`kit`: a file with no `kit` is the plain way, and only one plain way per dish. Left off
  here; each bowl is its own dish.
- `slack`: optional. A level that is not `forgiving`/`narrow`/`unforgiving`, or a level with no
  reason, is a per-file failure (`check-recipes.mjs:65`, `src/lib/slack.ts:64-93`).

## 6. What `docs/gaps/bowl-shop.md` actually ranks

The gap note has one ranked list (`## What it is missing`, 22 entries) covering the whole counter,
not one list per menu section. The entries that are **grain bowls** rather than components, in
rank order:

| Rank | Entry | Kind |
| --- | --- | --- |
| 4 | Quinoa, farro and wild rice | three grain **bases**, listed again under *Components it would need* |
| 8 | **The Harvest Bowl** — roast chicken, sweet potato, apple, goat cheese, wild rice, balsamic | a whole bowl, "the thing a person actually orders" |
| 15 | **Crispy rice** — "one skillet, one table" | the crunch element, and a Goop bowl |
| 19 | **A grain-bowl teriyaki chicken** — "`teriyaki-sauce` exists; the bowl it goes in does not" | a whole bowl |
| 22 | **A hot grain bowl base**, warm rather than cold | "a technique note as much as a recipe" |

Ranks 1, 2, 3, 5, 7, 9, 10, 11, 13, 14, 16, 17, 18, 20, 21 are roasted vegetables, proteins,
pickles, dips and dressings — **T-002-07's and T-002-06's ground**, and this ticket says *stay in
the bowls*. Ranks 6 and 12 are a salad and two dressings.

The gap note also records, under `## What it could not stock`, that **"the bowl itself"** is an
assembly of components and "the honest form is components plus `pairs-with`". This ticket
overrides that finding for bowls that cook: *"A bowl earns its table by having real cooking in
it."* The two are reconcilable — the note is refusing a bowl that is one operation over eight
finished leaves; the ticket is asking for bowls where the grain, the protein and the vegetable are
cooked inside the table. Design has to keep every file on the right side of that line.

## 7. Constraints and boundaries

- **Only `recipes/**` is modified; no pre-existing file is edited.** So no `counters.json` edit,
  no gap-note edit, no `docs/gaps/README.md` tally. Shelving is T-002-08's.
- **Sibling tickets run concurrently.** T-002-06 (salads) and T-002-07 (proteins, roasted
  vegetables) share the branch and may be writing files right now. `pairs-with` may therefore only
  name slugs that exist **today**; naming a slug T-002-07 is about to write is a build error until
  it lands, and the mutuality is computed at build so there is nothing to coordinate.
- **Component overlap is expected, not forbidden.** A bowl that roasts its own sweet potato and a
  future `roasted-sweet-potatoes` component are two different files; the tree cannot reference
  across files, so a bowl that cooks has to cook inside its own table. Overlaps should be recorded
  for T-002-08 to shelve sensibly.
- **The working tree already carries other tickets' untracked files** (`one-pot-pasta.cook`,
  `paella.cook`, `arroz-con-pollo.cook`, four Instant Pot files, plus `docs/active/work/T-002-0{2,3,4}/`).
  `lisa commit-ticket --include` with exact paths is what keeps them out of my commits.

## 8. Verification available

- `node scripts/check-recipes.mjs --labels <paths>` — per file, writes nothing, safe to run
  concurrently. This is the AC's named check.
- `node scripts/parse-recipes.mjs` — builds `src/generated/recipes.json`; this is where dangling
  `pairs-with` and duplicate slugs are caught. **It writes**, and `src/generated/` is not
  committed.
- `npx vitest run` — the collection invariants above.
- `npm run verify` — check + parse + tests + `astro build`. It sees the whole tree, siblings'
  in-flight files included, so a failure in it is not necessarily mine.
