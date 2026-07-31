# T-002-07 — Research

What exists, where it lives, and what the collection's rules force on a component recipe. The two
sections this ticket writes are **What goes on top** (proteins) and **Roasted vegetables**.
Descriptive only — which recipes get written is Design.

## 1. The ticket in one line

At least ten new `.cook` files naming `counters: The Bowl Shop`, of which at least five are
proteins (two of them not meat) and at least four are roasted vegetables, each carrying 3–6
operations of real technique, none duplicating something already on the site, plus a list of
existing slugs that belong on these two shelves for T-002-08 to shelve.

## 2. The counter, and how a recipe reaches it

`src/data/counters.json` (written by T-002-01) holds eighteen counters. The Bowl Shop:

```json
{ "name": "The Bowl Shop", "slug": "bowl-shop",
  "blurb": "Pick a base, pile it up, dress it last.",
  "categories": [],
  "sections": [ "Grain bowls", "Leafy salads", "What goes on top", "Roasted vegetables",
                "Dressings and drizzles", "Soups", "Also here" ] }
```

`categories: []` means **nothing falls through**. A recipe is on this shelf only if it writes
`>> counters: The Bowl Shop`. `scripts/check-recipes.mjs:22-26` builds `KNOWN_COUNTERS` from this
file, so the counter name is validated per file — a typo fails before the build.

`grep -rl "Bowl Shop" recipes/` returns **zero files today**. Sections 3 and 4 of that menu, the
two this ticket fills, are empty. So is the whole shelf.

## 3. The two folders this ticket lands in, as they stand

553 `.cook` files across 27 folders (the tree carries siblings' untracked work; the committed
count at the start of this story was 514).

| Folder | Files | What is actually in it |
| --- | --: | --- |
| `recipes/vegetables-and-sides/` | 6 | `candied-yams`, `cornbread-dressing`, `creamed-corn`, `green-beans`, `mashed-potatoes`, `stewed-squash` — a Southern side board. **No roasting at all**: every one is stewed, creamed, mashed or baked in liquid. |
| `recipes/toppings-and-pickles/` | 6 | `ajitama`, `kabis`, `menma`, `sauerkraut`, `sumac-onions`, `whipped-cream`. Pickles and one marinated egg. |
| `recipes/smoked-and-grilled/` | 18 | The dry-heat meat folder. Holds oven work as well as fire: `gyro-meat` is a baked loaf, `smoked-turkey-breast` and `pastrami` are long dry cooks. |
| `recipes/fried-and-crispy/` | 15 | Where crisping lives: `batata-harra` (parboil then fry), `karaage`, `falafel`, `french-fries`, `home-fries`, `hash-browns`, `onion-rings`. |
| `recipes/eggs/` | 4 | `eggs-benedict`, `shakshuka`, `tortilla-espanola`, `western-omelette`. No plain boiled egg. |
| `recipes/salads/` | 10 | T-002-06's ground. |
| `recipes/rice-beans-and-grains/` | 35 | T-002-05's ground. |

Category strings, exactly as written in these folders: `Vegetables & Sides`, `Toppings & Pickles`,
`Smoked & Grilled`, `Fried & Crispy`, `Eggs`.

## 4. What the site does not have, checked by grep

Run over all of `recipes/`:

| Ingredient | Hits | Reading |
| --- | --- | --- |
| cauliflower | `onion-bhaji`, `korma` | never the vegetable itself |
| broccoli | `white-pizza`, `beef-with-broccoli`, `pad-see-ew` | two stir-fries and a topping |
| brussels | **none** | |
| beet | `borscht`, `borscht-instant-pot`, `kabis` | all cooked or pickled in liquid |
| sweet potato | `sweet-potato-pie`, `relleno-de-pina`, `candied-yams` | two desserts and a third that is a dessert with a vegetable in it |
| salmon | `belly-lox` | cured, not cooked. **No cooked fish technique anywhere.** |
| tofu | `hot-and-sour-soup`, `pad-thai`, `miso-soup` | a cube in a bowl, never the protein |
| halloumi | **none** | |
| chickpea | `hummus`, `falafel`, `socca`, `chana-masala`, `harira`, `raita` | never crunchy |
| quinoa / farro / wild rice | **none** | T-002-05's problem, recorded here for completeness |

There is **no roasted vegetable on the site at all**. The nearest thing is `batata-harra`, which
parboils and then deep-fries.

## 5. Existing dishes that belong on these two shelves

The ticket asks for these by slug, for T-002-08. `docs/gaps/bowl-shop.md:37-42` already lists a
candidate set; the list below is that set checked against the tree, plus what reading the folders
adds. **None of these needs writing — they need a `>> counters:` line, which is T-002-08's edit.**

**What goes on top** — cooked proteins already written, in their current folder:

- `stews-and-braises/`: `char-siu`, `chashu`, `carnitas`, `tinga-de-pollo`, `cha-lua`,
  `white-cut-chicken`, `soy-sauce-chicken`, `meatballs`, `siu-yuk`, `red-braised-pork-belly`
- `smoked-and-grilled/`: `chicken-shawarma`, `shish-tawook`, `pollo-asado`, `carne-asada`, `kafta`,
  `smoked-chicken`, `smoked-turkey-breast`, `gyro-meat`, `chicken-tikka`, `seekh-kabab`,
  `al-pastor`, `chopped-pork`
- `fried-and-crispy/`: `karaage`, `falafel`
- `dressings-and-dips/`: `paneer`, `queso-fresco`, `labneh`, `guacamole`, `birista`
- `toppings-and-pickles/`: `ajitama`, `sumac-onions`, `kabis`, `sauerkraut`, `menma`
- `dressings-and-dips/` pickles: `do-chua`, `sour-dill-pickles`
- `spice-blends-and-marinades/`: `dukkah`

**Roasted vegetables** — the vegetable sides that exist, none of them roasted:

- `vegetables-and-sides/`: `candied-yams`, `creamed-corn`, `green-beans`, `mashed-potatoes`,
  `stewed-squash`
- `fried-and-crispy/`: `batata-harra`, `fried-okra`
- `stews-and-braises/`: `collard-greens`, `collard-greens-instant-pot`, `ratatouille`

Design turns this into the artifact list the AC asks for, with a section per slug.

## 6. The authoring contract, as the code enforces it

From `README.md:19-157`, `scripts/check-recipes.mjs`, `src/lib/tree.ts`, `src/lib/time.ts`.

**Required metadata** (`check-recipes.mjs:18`): `title`, `category`, `tags`, `servings`. This
ticket adds `counters` and `aka`. `time` and `pairs-with` are optional and conventional.

**The tree.** Leaves are ingredients, one row each, column 1. `col(op) = 1 + max(col(children))`.
Edges are cooklang intermediate references: `@&(~1)x{}` is one step back counting **every** step
including prose-only ones, `@&(3)x{}` is absolute. Two hard errors: a step may flow into exactly
one later step (`tree.ts:163-168` — "a table is a tree"), and there must be exactly one root
(`tree.ts:188-195`). A step with no ingredients and no refs is a full-width row — a header before
the first real step, a footer after the last — and it still counts for `~1`, which is why prose
belongs at the top or the very end.

**Size gates** (`check-recipes.mjs:70-72`): under 3 ingredient rows fails; under 3 columns fails
("only one operation — nothing merges"). `colCount = 3` means two chained operations. README's
target is 5–16 rows and 3–6 operations, which is exactly the AC's 3–6.

**Labels** (`check-recipes.mjs:73-80`): the operation cell is the step text with ingredients
stripped — cookware, temperatures and timers survive. An empty label is a failure.
`>> step.N: …` overrides it, 1-based over steps as written. `--labels` prints the staircase, and
the AC asks that the staircase read as a cook's verbs.

**Timers** (`src/lib/time.ts`). `~name{n%unit}`. The name is the author saying outright whether a
wait is unattended or hands-on. Relevant to this ticket:

- `UNATTENDED` includes `roast`, `bake`, `rest`, `marinate`, `drain`, `press`, `boil`, `simmer`,
  `cool`, `chill`, `stand`, `dry`, `steam`, `poach`.
- `HANDS_ON` includes `sear`, `saute`, `fry`, `toss`, `toast`, `grill`, `stir`, `flip`, `baste`.
- An **unrecognised** name is not an error; it falls through to reading the step text.
- `boil`, `dry` and `press` are in `NOT_A_VERB_IN_A_SENTENCE`: they are distrusted when merely
  spotted in prose, but a timer the author *names* `~press{30%min}` still reads as a wait.

**Slack** is optional and the value is entirely in the reason (`README.md:72-93`). A level with no
reason, or a level nobody agreed on, is a per-file failure (`check-recipes.mjs:65`). Most of the
collection leaves it off, and that is a legitimate answer.

**Checked at build, not per file** (`scripts/parse-recipes.mjs`, `src/lib/collection.test.ts`):
`pairs-with` slugs must resolve and are made mutual at build time, so writing one side is correct
and edits nothing; slugs are unique across the whole collection because basenames are URLs; only
one file per `dish` may omit `kit`.

## 7. What the house style actually looks like

Read from `shish-tawook`, `batata-harra`, `sumac-onions`, `ajitama`, `green-beans`:

- Every step carries a sentence of **why**, not just how — the yogurt marinade's calcium versus a
  straight lemon one, why the potatoes must stand until chalky, why the garlic goes on off the
  heat. This is what the AC means by "real technique … that say how, not just how long."
- `>> step.N:` overrides are written for **every** step in most files, so the staircase reads as a
  deliberate line of verbs rather than whatever the label deriver produced.
- A prose-only opening line is used as an epigraph (`ajitama`, `green-beans`) and repeated as
  `step.1`.
- `aka` is generous — a dozen spellings and menu names, because the search box reads it.
- Notes carry the second unit: `@olive oil{3%Tbs}(45 mL)`, `@sweet potatoes{2%lb}(900 g; in
  3/4-in wedges)`. The parenthetical is also where cut and state go.

## 8. Constraints and boundaries

- **Only `recipes/**` is modified, and no file that existed before this ticket is edited.** So no
  `counters.json`, no `docs/gaps/bowl-shop.md` rewrite, no `docs/gaps/README.md` tally, and no
  touching the six files already in `vegetables-and-sides/`. Shelving existing dishes is
  T-002-08's job and this ticket only records the list.
- **Siblings are running on the same branch right now.** T-002-05 (grain bowls) has research
  written; T-002-06 (leafy salads) is queued. `pairs-with` may only name slugs that exist
  **today** — naming a file a sibling has not landed yet is a build error until it does.
- **Component overlap with T-002-05 is expected.** A grain bowl that roasts its own sweet potato
  and a `roasted-sweet-potatoes` component are two different files: the tree cannot reference
  across files, so a bowl that cooks has to cook inside its own table.
- **The working tree already carries other tickets' untracked files.** Exact `--include` paths on
  `lisa commit-ticket` are what keeps them out of these commits.

## 9. Verification available

- `node scripts/check-recipes.mjs --labels <paths>` — per file, writes nothing, safe to run while
  siblings work. This is the AC's named check.
- `node scripts/parse-recipes.mjs` — builds `src/generated/recipes.json`; where dangling
  `pairs-with` and duplicate slugs are caught. It **writes**, but only into the uncommitted
  `src/generated/`.
- `npx vitest run` — the collection invariants (mutual pairings, unique slugs, timers resolve to
  minutes, nothing claims ≥240 unbroken hands-on minutes).
- `npm run verify` — check + parse + tests + `astro build`, over the whole tree including
  siblings' in-flight files, so a failure there is not necessarily this ticket's.
