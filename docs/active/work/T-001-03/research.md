# T-001-03 — Research

What is on the Thai Kitchen shelf today, what the collection will accept as a new file, and
which of the gap doc's claims survive contact with `recipes/`. Descriptive only.

## The counter as it stands

`src/data/counters.json` gives Thai Kitchen the blurb *"Curries by colour, noodles by the
plate."* and five sections, four of which hold one item each:

| Section printed | Items on it |
| --- | --- |
| Soups | `tom-kha-gai` |
| Curries by colour | `thai-green-curry` |
| Rice | `coconut-rice` |
| The shelf | `thai-red-curry-paste` |
| Shelved here from a neighbouring board | `beef-rendang` |

`grep -rl "Thai Kitchen" recipes/` returns exactly those five files, and each of them names
Thai Kitchen and nothing else. So the counter is at **5 recipes, 5 of them exclusive**, and
the acceptance bar (16 total, 14 exclusive) is **11 new exclusive files at minimum**.

The blurb is the accusation: it promises noodles by the plate and there is no noodle dish in
the entire collection of 254 files, at any counter. It promises curries by colour and one of
five colours is written.

## What the five look like inside

They are the house style, and they are close enough to each other to read as a set:

- `thai-green-curry.cook` — 15 rows × 5 cols. **Pounds its own paste in step 1** (ten
  ingredients into a `#mortar{}`), fries it in cracked coconut cream, simmers, finishes with
  basil. Its `aka` line carries `gaeng keow wan, kaeng khiao wan, gang keow wan, green curry`
  — the transliteration pair the counters doc insists on.
- `thai-red-curry-paste.cook` — 5 steps: soak, toast-and-grind, pound, pound in, work in.
  `>> pairs-with: coconut-rice`. No curry consumes it, which is the asymmetry the gap doc
  leads with.
- `tom-kha-gai.cook` — 4 steps, simmer/poach/season/scatter. Its aromatics (galangal,
  lemongrass, makrut lime leaf) are exactly tom yum's, minus the coconut milk.
- `coconut-rice.cook` — pairs with `thai-green-curry` and `beef-rendang`.
- `beef-rendang.cook` — Malay, parked here because no Roti Stall counter exists.

Two spellings are already in play across these files: `kaffir lime` in the green curry,
`makrut lime` in the paste and the soup. Whichever a new file picks, it matches one of them.

## The authoring contract, as the code actually enforces it

`README.md` is the prose version; these are the checks that fail a build.

**`scripts/check-recipes.mjs`** — per file, writes nothing, safe to run concurrently:

- `title`, `category`, `tags`, `servings` must be present as `>> key:` lines.
- every name in `counters:` must exist in `src/data/counters.json` (`Thai Kitchen` does).
- the tree must tile: `findTilingErrors()` on the laid-out grid.
- `rowCount >= 3` ingredient rows and `colCount >= 3` (i.e. at least two operations).
- no operation cell may come out with an empty label.
- `--labels` prints the staircase, which is the only way to see whether a derived label
  reads as a cook's verb.

**`src/lib/tree.ts`** throws on three shapes:

1. a reference to a step that makes nothing (`@&(~1)` pointing at a prep line);
2. a step whose output is consumed twice — *"a table is a tree"*, so no splits;
3. more than one step with no parent — every branch must merge into one ending.

`~1` counts **every** step including ingredient-less prep lines, which is why README says
prep steps go at the top only.

**`scripts/parse-recipes.mjs`** (runs in `npm run recipes`, and only it) adds the
cross-file rules: slugs unique across the whole collection because the slug is the URL;
`pairs-with` must name a real slug and is made mutual at build time (so writing it on one
side is enough, and writing it on both is harmless — the sets are unioned); one file per
`dish` may omit `kit`.

**`src/lib/time.ts`** decides whether a wait is time you spend or time you wait out. A timer
name is trusted first, and only if it is in one of two vocabularies:

- unattended: `rest chill cool set marinate brine soak steep bake roast braise simmer steam
  boil infuse dry cure age stand drain press smoke stew poach` (and more);
- hands-on: `whisk stir knead beat mix fold toss whip roll shape saute fry deepfry stirfry
  sear brown broil temper toast grill flip baste skim churn`.

An **unrecognised** name is not a claim and falls through to reading the label. So
`~stirfry{3%min}` and `~simmer{20%min}` are honest; `~wok{3%min}` would silently be no better
than an unnamed timer. `src/lib/collection.test.ts` also fails any timer read as `hands-on`
for four hours or more, so a long wait needs an unattended name.

The ticket requires **every timer named**, which the existing Thai files do not do —
`tom-kha-gai`, `coconut-rice` and `thai-green-curry` all use bare `~{18%min}`. The
convention is newer than they are; the T-001-01 files name all 17 of theirs.

**Size.** README asks for 5–16 ingredient rows and 3–6 operations. Every existing Thai file
is inside that: the green curry is the widest at 15 rows.

## Categories, and what has no home

Thirteen folders exist: `bars-and-brownies`, `breads`, `cakes-and-loaves`, `cookies`,
`custards-and-puddings`, `dressings-and-dips`, `flatbreads-and-pancakes`,
`pastry-and-doughs`, `rice-beans-and-grains`, `sauces-and-gravies`, `soups`,
`spice-blends-and-marinades`, `stews-and-braises`.

The folder names the category unless `>> category:` overrides it; `normalise.mjs` title-cases
the folder, so `noodles-and-stir-fries` would render as `Noodles And Stir Fries` unless the
file states `>> category: Noodles & Stir-Fries` — which every existing file does anyway
(`Rice, Beans & Grains`, `Stews & Braises`). Since T-001-17 owns `counters.json` and nothing
in `src/` reads a fixed list of categories, **adding a folder is not a build event**: the
category fallback in `counters.json` only matters for recipes that name no counter, and
these will all name one.

There is no folder for a noodle dish and none for a salad. `tabbouleh` sits in
`rice-beans-and-grains` because it is a grain; a pounded papaya salad has no such excuse.
Curry pastes have a clear home in `spice-blends-and-marinades`, beside `thai-red-curry-paste`.

## The gap doc, checked against the folder

`docs/gaps/thai-kitchen.md` ranks 21 absences and lists 13 components. I checked every
proposed slug with `ls recipes/*/<slug>.cook` and against all 254 basenames:

- **Nothing on the ranked list is already written.** No pad thai, no tom yum, no curry
  besides green, no salad, no noodle dish anywhere in the collection.
- The staleness warning in the ticket is about *other* counters' lists — the pastry shells,
  both cornbreads, `char-siu`, `do-chua`, `sour-dill-pickles` and `pork-liver-pate` are all
  present now. None of them is on this counter's list, so none of this page is stale.
- `beef-rendang` is on the counter but not on the list, correctly: it is the Malay item.

## Where other tickets' claims cross this one

`docs/active/stories/S-001-fill-the-menus.md` settles contention on the board rather than by
racing:

- **chicken wings** appears in this counter's ranked item 10 and is assigned to **Pizzeria**.
  The Thai Kitchen does not write it.
- **Six counters want a noodle dish and they are not the same dish**: Ramen Shop writes ramen
  noodles, Takeout Counter lo mein, **Thai Kitchen pad thai**, Phở & Bánh Mì bún. Likewise
  the rolls: chả giò and gỏi cuốn are Vietnamese, the egg roll is the Takeout Counter's, and
  **Thai fresh and fried spring rolls are the Thai Kitchen's**.
- **pickled mustard green** was flagged by T-001-01's review as wanted by two counters (Phở &
  Bánh Mì and Thai Kitchen) and **owned by nobody**. It is khao soi's garnish. Writing it
  here would be the same race the story exists to prevent.
- A dish already written that only needs `Thai Kitchen` adding to its `counters:` is an edit
  to another ticket's file, and must be **recorded for T-001-18**, not made.

`docs/knowledge/counters.md` lines 452–497 are the vocabulary source: it gives the "on the
menu / also called / plainly" triple for gaeng, pad, and every dish on the ranked list. It is
also where the `L-` lunch prefix and the 1-to-5 spice dial are recorded — both listed in the
gap doc's "could not stock" section, because they are menu machinery rather than dishes.

## The build, before this ticket touches anything

```
npm run recipes    -> parsed 254 recipe(s) in 13 categories · counters: 254 named,
                      0 inferred · timers in 234 · pairings 138
node scripts/check-recipes.mjs
                   -> all 254 file(s) draw a table.
npx vitest run     -> 405 passed, 1 failed
```

The one failure is **pre-existing and not this ticket's**:
`src/lib/schedule.test.ts > the recipes with the longest critical path > are the three
ferments` expects `[sour-dill-pickles, injera, pizza-dough]` and gets `crema-mexicana` in
third place. T-001-01 wrote `crema-mexicana` (24 hr culture → 4 hr chill = 1680 min) and
documented the breakage in its own review; the remedy is a board decision it was not allowed
to make. Anything written here must stay well under **1568 min** of critical path or it will
displace another name and deepen the same failure. The longest thing on this counter's list
is a massaman simmer, on the order of two hours, so that is not a live risk.

## Constraints this ticket inherits

- `.cook` files only, into `recipes/<category>/`. `src/` — including `counters.json` and
  `aisles.json` — belongs to T-001-17, so **new items will not appear in the menu sections
  or the shopping aisles until that ticket runs**. That is the designed order, not a defect.
- No file another ticket owns may be edited: that includes the five existing Thai files.
  `thai-red-curry-paste.cook` therefore stays exactly as it is, and a new red curry has to
  reach it by naming the paste as an ingredient rather than by editing it.
- Only `recipes/**` may be modified.

## Open questions carried into Design

1. Where do a noodle plate and a pounded salad live, given thirteen folders and no fit?
2. Does each new colour of curry pound its paste inline (the `thai-green-curry` precedent) or
   consume a paste that has its own table (the `thai-red-curry-paste` precedent)? Both
   precedents are on this counter, pointing opposite ways, and the gap doc's first sentence
   is a complaint about exactly that split.
3. How far down the ranked list does 16 recipes reach, and what gets named as skipped?
