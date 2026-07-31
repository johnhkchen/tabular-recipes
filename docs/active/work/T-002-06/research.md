# T-002-06 — Research

What exists, where it lives, and what constrains a new leafy-salad `.cook` file. Descriptive
only; the choice of which salads to write is Design.

## 1. The shelf as it stands

`recipes/` holds 27 folders and **553 `.cook` files** at the moment this was read (T-002-02,
T-002-03 and T-002-05 are writing into the same tree concurrently, so that number moves).

### `recipes/salads/` — ten files

```
chicken-salad   egg-salad   fattoush   kachumber   larb-gai
macaroni-salad  potato-salad  som-tum  tuna-salad  whitefish-salad
```

Six are the deli-case, sold-by-the-pound kind (`chicken-`, `egg-`, `tuna-`, `whitefish-`,
`potato-`, `macaroni-`), shelved at the Deli. Four are composed salads belonging to other
counters: `fattoush` (Shawarma Counter), `kachumber` (Curry House), `som-tum` and `larb-gai`
(Thai Kitchen). **Not one leafy salad, and nothing on the Bowl Shop shelf.** The ticket's
framing is accurate.

Checked across all 553 slugs for near-misses on the obvious board names — `cobb`, `nicoise`,
`panzanella`, `greek`, `wedge`, `spinach`, `brussels`, `kale`, `caesar` (as a salad),
`chopped` (as a salad), `beet`, `crouton`, `caprese`, `waldorf`, `chicory`, `endive`. The only
hits are `caesar-dressing`, `chopped-liver`, `chopped-pork`, `peach-cobbler` and
`pecan-pie-bars`. **No leafy salad on the site is at risk of being duplicated.**

### `recipes/dressings-and-dips/` — 40 files on disk

The drawer the ticket describes. Confirmed slugs relevant to salads: `basic-vinaigrette`,
`caesar-dressing`, `green-goddess-dressing`, `ranch-dressing`, `blue-cheese-dressing`,
`honey-mustard-dressing`, `russian-dressing`, `miso-ginger-dressing`, `goma-dare`,
`tahini-sauce`, `basil-pesto`, `romesco`, `muhammara`, `chimichurri`, `toum`, `tzatziki`,
`raita`, `nuoc-cham`, `aioli`, `mayonnaise`, `crema-mexicana`, `white-sauce`, `do-chua`,
`sour-dill-pickles`, `coleslaw`, `barbecue-slaw`, `labneh`, `queso-fresco`, `paneer`.

(The gaps page and the ticket both say 41; the folder holds 40 files. The difference does not
change anything here — every slug named in a `pairs-with:` line has to be confirmed against the
folder anyway, one at a time.)

## 2. What a `.cook` file has to satisfy

`node scripts/check-recipes.mjs` reads one file at a time and refuses anything that would not
draw a table. Reading `scripts/check-recipes.mjs`, `scripts/normalise.mjs`, `src/lib/tree.ts`
and `src/lib/layout.ts`, the binding rules are:

**Metadata.** `title`, `category`, `tags`, `servings` are required by the checker
(`REQUIRED_META`, line 19). `counters:` is validated against the 18 names in
`src/data/counters.json`; **`The Bowl Shop` is there** (slug `bowl-shop`, blurb "Pick a base,
pile it up, dress it last.", sections in menu order with `Leafy salads` second, all item lists
empty pending T-002-08). `aka:` and `pairs-with:` are optional to the checker and required by
this ticket.

**The tree.** `buildTree()` turns steps into a merge tree:

- A step with at least one ingredient or one `@&(~n)` reference is an **operation** (a cell).
  A step with neither becomes a full-width **header** row above the table (before the first
  operation) or a **footer** row below it.
- `@&(~n)ingredient{}` is a back-reference *n* steps up. The parser resolves it to an absolute
  index; `fattoush` step 5 uses both `@&(~4)` and `@&(~1)` in one sentence.
- **A step may be referenced by exactly one later step.** Two consumers of one preparation is a
  hard error ("a table is a tree").
- **Exactly one step may end the recipe.** Every branch has to flow into one final operation,
  or the build throws with the count of roots.

**The grid.** `layout()` gives every ingredient one row and every operation one cell spanning
its rows. The checker then requires `rowCount >= 3` (three ingredient rows) and
`colCount >= 3`. `colCount` is the root's column: ingredients sit at column 1, an operation
over raw ingredients lands at column 2, and one that consumes it at column 3. So **the
shallowest legal shape is two chained operations**, and anything with three or more chained
operations clears it comfortably. `findTilingErrors()` catches overlaps and holes; the ordinary
chain-plus-branches shape used throughout the collection tiles cleanly.

**Labels.** Every operation cell must carry non-empty text. `cleanLabel()` derives it from the
step sentence with the ingredients stripped out, which mangles most real sentences — hence the
`>> step.N:` override lines every existing file uses. Overrides are 1-indexed on the step
order.

## 3. The icon constraint — the sharpest one, and it is invisible from inside a recipe

`src/lib/icons.test.ts` collects **the leading word of every operation label in the whole
collection** and asserts that `matchOperation()` recognises each one:

```
expect(fellThrough).toEqual([]);
```

The recognised set is `VERB_ICONS` in `src/lib/icons.ts` (plus `PHRASE_ICONS` and, from the
second word on, `CONTEXT_ICONS`). This ticket may only touch `recipes/**`, so **`icons.ts`
cannot be extended** — every `>> step.N:` line has to open with a verb already in the table.

The verbs available and useful for salad work, read out of `VERB_ICONS`:

- oven — `bake`, `roast`, `toast` (flame), `crisp`, `preheat`
- direct heat — `fry`, `sear`, `brown`, `render`, `caramelise`, `blister`, `cook`, `warm`
- grill — `grill`, `broil`, `char`
- wet heat — `simmer`, `boil`, `poach`, `blanch`, `parboil`, `steam`, `reduce`, `bring`
- cold — `chill`, `marinate`, `pickle`, `brine`, `cure`
- bowl and stir — `mix`, `combine`, `toss`, `stir`, `dissolve`, `assemble`, `whisk`, `beat`,
  `fold`, `throw`
- knife — `chop`, `slice`, `cut`, `dice`, `mince`, `shred`, `grate`, `halve`, `quarter`,
  `trim`, `peel`, `core`
- hands — `crumble`, `press`, `rub`, `pat`, `pinch`, `work`, `scoop`, `stuff`, `tear` is **not**
  in the table (checked — `tear` is absent; `throw` is present)
- mesh — `drain`, `rinse`, `wash`, `squeeze`, `strain`, `skim`
- liquid — `pour`, `drizzle`, `stream`, `spoon`, `deglaze`, `dress`, `splash`
- dry on top — `scatter`, `sprinkle`, `season`, `salt`, `top`, `finish`, `garnish`
- painted — `brush`, `glaze`, `coat`, `dip`, `baste`
- stacked — `layer`, `arrange`, `nestle`, `lay`, `stack`, `pack`, `fill`, `cover`
- leave alone — `rest`, `cool`, `stand`, `macerate`, `wilt`, `sit`, `set`, `settle`, `leave`
- measured waiting — `soak`, `steep`, `wait`

`WEAK_VERBS` (`add`, `cover`, `wrap`, `finish`, `turn`, `heat`, `top`, `work`) are recognised
but read past to a later word, so a label may open with one without failing.

Two further collection-level assertions in the same file: every operation must resolve to a
real icon, and the collection must use more than 12 distinct icons — both are already true and
a dozen new salads cannot break them.

## 4. Timers

`~name{5%min}` is the shape. `scripts/normalise.mjs` reads a timer together with its operation
label, and `src/lib/time.ts` decides whether it is a cook's attention or a wait. The ticket
requires **every timer named** — `~stand{5%min}`, not `~{5%min}` — which is also what makes the
attention reading correct. `src/lib/collection.test.ts` guards the property that no recipe
claims four unbroken hours of a cook's attention; a salad cannot approach it.

## 5. Pairings

`>> pairs-with:` takes bare slugs (file basenames), comma separated. `scripts/parse-recipes.mjs`
line 90 onwards **makes every pairing mutual at build time**, and rejects a slug that names no
file. `src/lib/collection.test.ts` re-checks: no dangling pairing, all pairings mutual, nothing
paired with itself. Consequences for this ticket:

1. A one-directional `pairs-with:` line in a new salad is correct and complete — the dressing
   file does not need editing, which is what makes "no file that existed before this ticket is
   edited" compatible with "name the dressings in `pairs-with:`".
2. Every slug must be verified against the folder before it is written. A typo is a build
   failure for the whole collection, not just for the new file.
3. A salad may not pair with itself, and two new salads pairing with each other is fine.

## 6. House style, read off the existing files

`fattoush`, `som-tum` and `larb-gai` are the closest models — all three are composed salads with
real work, all three are what this ticket is being asked to write more of.

- Metadata block first: `title`, `category`, `tags`, `counters`, `aka`, `pairs-with`,
  `servings`, `time`, optional `slack`, then the `>> step.N:` labels in order.
- `category` for a file in `recipes/salads/` is `Salads` (title case of the folder is the
  fallback; every file states it anyway).
- One paragraph per step. The paragraph is the method **plus one thing a cook would not know**
  — why the pita is fried rather than toasted, why larb is poached and never browned, what the
  three-chile number means. That second half is the voice of the collection, and it is what
  makes the file worth more than the table.
- `aka:` is generous and includes misspellings and the generic search term.
- `slack:` is optional and mostly absent; it is `level — reason` where level is one of
  `forgiving`, `narrow`, `unforgiving` (`src/lib/slack.ts`). A level with no reason fails the
  check.

## 7. The gaps page, and which of its ranks are ours

`docs/gaps/bowl-shop.md` ranks 22 missing dishes in one list across all seven sections, not one
list per section. The **salad** entries in that ranked list, in order:

| Rank | Entry | Note |
| --: | --- | --- |
| 6 | **Kale Caesar** | massaged kale, shaved parmesan, `caesar-dressing` already written |
| 7 | **Shaved Brussels sprouts** | Goop's *Everyday Kale And Brussels Salad*; zero Brussels on the site |
| 13 | **A chopped salad** | Goop prints three: *Fall Harvest Chopped*, *The Goop Father Italian Chopped*, *Brentwood Chinese Chicken* |

Everything else in that list belongs to a neighbour: ranks 1–3, 7's roasting method, 9, 10, 15,
16, 17, 18, 20, 21 are components and roasted vegetables (**T-002-07**); ranks 4, 8, 14, 19, 22
are grains and bowls (**T-002-05**); ranks 11, 12 are dressings and dips the drawer is missing.

The page also records what a table cannot hold, and one entry bears directly on this ticket:
*"A salad spinner's worth of greens… at a table it is one cell that says 'wash and dry well' and
teaches nothing."* Washing leaves is not an operation worth a column.

## 8. Constraints and assumptions carried into Design

- **Ten files minimum**, each `counters: The Bowl Shop`, each leafy or composed.
- **Three non-tossing operations minimum** per file, and at least one made or cooked component.
- **No dressing re-taught.** Named in `pairs-with:` instead — except where the dressing is
  genuinely built in the bowl as part of the method, which the ticket explicitly allows.
- **Only three ranked salad entries exist** for twelve-ish files. Everything past rank 13 has to
  come from the same menus the gaps page was read from (Goop Kitchen, Sweetgreen, Cava, Dig)
  and from the standard American composed-salad board, and the artifact has to say so.
- **Concurrency.** T-002-05 and T-002-07 are on the same branch. Files are disjoint by
  construction (they write bowls and components; we write salads), but a salad that roasts a
  vegetable inside its own method overlaps in *subject* with T-002-07's roasted-vegetable
  section. That is not a file conflict and is worth recording rather than avoiding.
- **`recipes/**` only, and no pre-existing file edited.** The pairing-mutuality machinery makes
  this achievable; nothing else in the ticket requires touching an old file.
