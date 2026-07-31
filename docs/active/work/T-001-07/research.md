# T-001-07 — Research

What exists, where it lives, and what the Dim Sum Counter actually holds today. Descriptive only.

## 1. The counter as it stands, read from `recipes/` rather than the gap doc

`grep -rl "Dim Sum Counter" recipes/` returns **11 files**, not the 7 the gap doc counts or the 9
the ticket quotes. Both are stale; the ticket warned they would be.

| File | Also names | Sole? |
| --- | --- | --- |
| `recipes/soups/congee.cook` | — | **yes** |
| `recipes/custards-and-puddings/mango-pudding.cook` | — | **yes** |
| `recipes/stews-and-braises/red-braised-pork-belly.cook` | — | **yes** |
| `recipes/stews-and-braises/char-siu.cook` | Takeout Counter, Phở & Bánh Mì | no |
| `recipes/flatbreads-and-pancakes/scallion-pancakes.cook` | Takeout Counter | no |
| `recipes/rice-beans-and-grains/egg-fried-rice.cook` | Takeout Counter | no |
| `recipes/spice-blends-and-marinades/chinese-five-spice-powder.cook` | Takeout Counter | no |
| `recipes/cakes-and-loaves/chiffon-cake.cook` | Bakery | no |
| `recipes/pastry-and-doughs/sweet-tart-shell.cook` | Bakery, Panadería | no |
| `recipes/custards-and-puddings/red-bean-paste.cook` | Bakery | no |
| `recipes/custards-and-puddings/lotus-seed-paste.cook` | Bakery | no |

So the starting point is **11 shelved, 3 of them its own**. The acceptance bar is 18 and 12.
The arithmetic that follows from that: **at least 9 new files that name this counter and no
other**, and at least 7 new files in total. Nothing in the target is reachable by re-labelling
what is already here — every one of the eight shared files is legitimately shared.

Four items the gap doc lists as missing have since been written by other tickets and are *not*
gaps any more: `char-siu` (gap item 5, the one it said to write first), `sweet-tart-shell` (the
pastry shell dan tat needs), `red-bean-paste` and `lotus-seed-paste` (fillings for gap items 12
and 19). This is exactly the staleness the ticket predicted, and it changes the work list.

Still absent, and confirmed absent by `ls recipes/*/`: har gow, siu mai, char siu bao, dan tat,
cheung fun, turnip cake, taro cake, lo mai gai, xiao long bao, chicken feet, wu gok, ham sui gok,
sesame ball, chow fun, siu yuk, soy sauce chicken, white cut chicken, ginger-scallion oil,
youtiao, gai lan, wife cake, dau fu fa, almond jelly.

## 2. What a `.cook` file is here

Cooklang with a metadata block. From `recipes/stews-and-braises/char-siu.cook`, the closest
existing neighbour to this ticket's subject matter:

```
>> title: Char Siu
>> category: Stews & Braises
>> tags: pork, chinese, roast, marinade, oven
>> counters: Dim Sum Counter, Takeout Counter, Phở & Bánh Mì
>> aka: cha siu, chashao, 叉燒, xá xíu, xa xiu, BBQ pork, roast pork
>> pairs-with: egg-fried-rice
>> servings: 6
>> time: 9 hr
>> step.2: marinate chilled 8 hr
...
Marinate @pork shoulder{3%lb}(1.35 kg; …) in @&(~1)marinade{} … for ~marinate{8%hr}.
```

- `@ingredient{qty%unit}(note)` — one table row each.
- `#cookware{}` — stays in the label.
- `~name{qty%unit}` — a **named** timer. The name is the honest source for whether a wait is
  time you spend or time you wait out (`src/lib/time.ts`).
- `@&(~N)thing{}` — an intermediate reference to step N's output. This is the edge that builds
  the tree; it is not an ingredient.
- `>> step.N:` — overrides the derived label for step N.

Category and folder are separate: `category` is the display string, the folder is where the file
sits. `normalise()` falls back from `category` to a title-cased folder name.

## 3. The tree is the constraint that shapes every file

`src/lib/tree.ts` builds a merge tree and throws — the checker reports it as a FAIL — on three
things:

1. **No step uses an ingredient** → nothing to draw.
2. **A step is referenced by two later steps** — "a table is a tree, so a preparation can only
   flow into one place." This is the rule behind the gap doc's warning about dumplings: a
   wrapper that flows into forty pieces cannot be one table.
3. **More than one step ends the recipe** — every branch must flow into one final step.

Two branches *merging into one* step is fine and is the shape most of this ticket's work wants:
dough in step 1, filling in step 2, step 3 references both, step 4 steams the result.

`scripts/check-recipes.mjs` additionally refuses:

- fewer than 3 ingredient rows ("too thin to be a table");
- fewer than 3 columns ("only one operation — nothing merges");
- any operation cell with an empty label;
- a `counters:` name not in `src/data/counters.json`;
- tiling errors from `findTilingErrors`.

A step with **no** ingredients and **no** refs is not an operation at all — it becomes a
full-width header row above the table (or a footer, after the first real step). That is how
`smoked-brisket` states its smoker temperature, and it is the mechanism available for saying
"line the steamer" or "this is a poach, not the shop's master stock" without inventing a column.

## 4. Labels, verbs and icons

`cleanLabel()` (`src/lib/label.ts`) strips the removed ingredients' connectives, so a step
written as prose degrades into fragments like "fold in to". Every existing well-written file
therefore carries a `>> step.N:` override for every step, phrased as an imperative verb with its
temperature and time: `marinate chilled 8 hr`, `roast 425°F (220°C) 30 min, to 160°F (71°C)`.

`src/lib/icons.ts` maps the **leading verb** of each label to a drawing. `src/lib/icons.test.ts`
prints every verb in the collection that falls through to the plain bowl; it is currently failing
with 14 such verbs (documented in `docs/active/work/T-001-05/review.md`). The relevant vocabulary
that *is* mapped, for this ticket's methods: `steam`, `boil`, `blanch`, `poach`, `simmer`,
`fry`/`deep fry`/`stir fry`/`pan fry` (phrases), `roast`, `bake`, `mix`, `stir`, `toss`, `fold`,
`knead`, `shape`, `seal`, `stuff`, `pinch`, `press`, `roll`, `wrap`, `fill`, `chop`, `slice`,
`grate`, `mince`, `shred`, `mash`, `grind`, `soak`, `steep`, `chill`, `rest`, `cool`, `set`,
`drain`, `rinse`, `strain`, `skim`, `pour`, `ladle`, `brush`, `glaze`, `coat`, `dust`, `scatter`,
`season`, `spread`, `arrange`, `stack`, `portion`, `cut`, `trim`, `dip`. `pleat` is **not**
mapped; neither is `steam` as a noun-first phrase.

`src/lib/time.ts` classifies a timer by its name first: `steam`, `soak`, `steep`, `chill`,
`marinate`, `rest`, `set`, `simmer`, `poach`, `braise`, `press`, `drain` are *unattended*;
`fry`, `stirfry`, `stir`, `knead`, `whisk`, `toss`, `roll`, `shape` are *hands-on*. An
unrecognised timer name falls through to reading the label. `collection.test.ts` fails if any
hands-on timer claims ≥ 240 minutes, so a long soak must be named with a wait word.

## 5. The collection-wide invariants a new file can break

From `src/lib/collection.test.ts` and `scripts/parse-recipes.mjs`:

- slugs are unique across all folders (the slug is the URL);
- every recipe names a counter that exists;
- `pairs-with` must point at a slug that exists, is made mutual at build time, and may not
  point at itself;
- two files sharing a `dish` with neither carrying a `kit` is ambiguous. `dish` defaults to the
  slug, so distinct slugs are safe unless a `dish:` line is written by hand.

`shopping.test.ts` asserts under 2% of distinct ingredient names lack an aisle in
`src/data/aisles.json`. It is already failing at 3.0%, and `src/data/aisles.json` belongs to
T-001-17. Every unfamiliar ingredient this ticket introduces — wheat starch, tapioca starch,
lotus leaves, glutinous rice flour, fermented black beans, maltose, dried shrimp, lap cheong,
rock sugar, Chinese celery — pushes that number the wrong way, and cannot be fixed from here.

## 6. Where the new files would go

Existing folders and what they already hold:

- `dumplings-and-rolls/` — `crab-rangoon`, `egg-rolls`. Two files. This is the natural home for
  every filled and wrapped item on the list.
- `stews-and-braises/` — holds `char-siu` (a roast) and `red-braised-pork-belly`. It has already
  absorbed roast-meat-window items for want of anywhere better.
- `noodles/` — `lo-mein`, `pad-thai`, `pad-see-ew`, `pad-kee-mao`, `singapore-mei-fun`. The gap
  doc's claim that "there is no noodle dish anywhere on the site" is stale by five files.
- `flatbreads-and-pancakes/` — holds `scallion-pancakes`, the other griddled Chinese slab.
- `rice-beans-and-grains/`, `custards-and-puddings/`, `sauces-and-gravies/`, `soups/`,
  `pastry-and-doughs/`, `spice-blends-and-marinades/` — all populated and obvious.
- There is **no** vegetables folder. Nothing in the collection is a plain plate of greens.

`src/data/counters.json` gives Dim Sum Counter six sections and no `categories` fallback, so a
new recipe reaches this counter only by naming it. Placing new slugs into those sections is
T-001-17's file, not this one — unplaced recipes sweep into a trailing "Also" section, so nothing
is lost in the meantime.

## 7. Vocabulary, sourced

`docs/knowledge/counters.md` §Dim Sum Counter carries a menu table with the counter's own names
for 20 items — har gow's "pleat count is how people judge the kitchen", cheung fun "doused in
sweetened soy", turnip cake "no turnip involved", ham sui gok "sweet outside, salty inside — that
is the point". That table is the source for `title` and `aka` on every new file, including the
Chinese characters and the diacritic-free romanisations the acceptance criteria ask for.

## 8. Constraints and assumptions carried into Design

- **Only `recipes/**` may be modified.** `src/data/counters.json`, `src/data/aisles.json` and
  every menu section belong to T-001-17.
- **A dish that belongs to several counters is one file with several names in `counters:`.**
  Where a dish already exists and only needs this counter added, that edit belongs to T-001-18
  and gets recorded, not made.
- **Concurrency is live.** `git status` shows T-001-02, T-001-06 and T-001-08 modifying files
  right now, and `npm run recipes` currently dies on a dangling `pairs-with` in T-001-06's
  `costra-de-azucar.cook`. Baseline before this ticket writes anything: **4 failing test files,
  460 tests passing**, plus that build break, none of it this ticket's.
- **Nothing automated checks that a recipe is correct cooking.** A har gow with a wonton wrapper
  draws the same table as a real one. The defence is the sourced vocabulary above, canonical
  method, and quantities scaled by hand to the stated servings.
