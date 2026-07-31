# T-001-02 — Review

Fourteen new recipes for **Phở & Bánh Mì**, two new category folders, nothing else touched.
The counter goes from 4 recipes (2 exclusive) to **18 (16 exclusive)** against a bar of 16 and
12.

## Acceptance criteria, one by one

| Criterion | Result |
| --- | --- |
| ≥16 recipes, ≥12 naming this counter and no other | **18 / 16** — measured from `src/generated/recipes.json`, not asserted |
| Top of `docs/gaps/pho-and-banh-mi.md` written in order, skips named with reasons | ranked #1–#12 written, plus #23 pulled forward; #13–#22 named below |
| `check-recipes.mjs --labels` ok for every new file, staircase reads as verbs | **`all 14 file(s) draw a table.`** Every leading verb is one the collection draws an icon for |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` with an undiacriticked form | all fourteen; every `aka` carries the diacritic form, a plain-ASCII form, English words, and the board code or number where the gap doc records one |
| Every timer named | **41 timers, 41 named.** `grep '~{'` over the fourteen returns nothing |
| Quantities real for the stated servings; canonical method | yes — see "quantities" below |
| Only `recipes/**` modified | yes. `git status --porcelain -- recipes/` is empty and no path outside `recipes/` was written |

## What changed

**Created — 14 files, 2 folders.** Nothing modified, nothing deleted.

| File | Gap rank | Rows × cols |
| --- | --: | --- |
| `recipes/sandwiches-and-rolls/banh-mi-dac-biet.cook` | 1 | 11 × 4 |
| `recipes/soups/pho-broth.cook` | 4 | 15 × 4 |
| `recipes/soups/pho-bo.cook` | 4 | 14 × 5 |
| `recipes/soups/pho-ga.cook` | 4 | 15 × 5 |
| `recipes/stews-and-braises/cha-lua.cook` | 5 | 10 × 6 |
| `recipes/sandwiches-and-rolls/banh-mi-thit-nuong.cook` | 6 | 15 × 6 |
| `recipes/rice-beans-and-grains/bun-thit-nuong.cook` | 7 | 15 × 5 |
| `recipes/dressings-and-dips/nuoc-cham.cook` | 8 | 7 × 4 |
| `recipes/sandwiches-and-rolls/cha-gio.cook` | 9 | 15 × 6 |
| `recipes/sandwiches-and-rolls/goi-cuon.cook` | 9 | 15 × 4 |
| `recipes/rice-beans-and-grains/com-tam.cook` | 10 | 15 × 5 |
| `recipes/drinks/ca-phe-sua-da.cook` | 11 | 5 × 6 |
| `recipes/stews-and-braises/xiu-mai.cook` | 12 | 16 × 5 |
| `recipes/breads/banh-mi-khong.cook` | 23 | 10 × 6 |

New folders: **`recipes/sandwiches-and-rolls/`** (four files — nothing in 254 recipes was an
assembled handheld) and **`recipes/drinks/`** (one — the gap doc's point is that the site had
no drink at all). Neither needs registering; `find-recipes.mjs` walks `recipes/` recursively.

Ten commits through `lisa commit-ticket`, grouped as menu sections: `ed65d1c`, `840f900`,
`e2b8ba3`, `f9f5f75`, `84c4e6d`, `5535f18`, `b9e6c0b`, `91b958b`, and a fix commit `59c0525`.

## Three judgement calls a reviewer should look at

**1. Bánh mì đặc biệt was written, though it appears in "What it could not stock".**
It is ranked **#1** in "what it is missing" and called "the single most conspicuous absence on
the entire site", and it also appears twice in the could-not-stock section. The reading taken:
that section refuses one *shape* and then prescribes another — *"The right shape is a short
assembly recipe that names its components and pairs to them, with the components written
properly."* So the file is exactly that: three operations (spread, layer, close), eleven
leaves, and a `pairs-with` line to `banh-mi-khong`, `pork-liver-pate`, `do-chua`, `cha-lua`
and `mayonnaise`. The separate "Đặc Biệt … not a dish" objection — that the set varies by shop
— is answered in the file's own prose rather than by leaving the item out. Full reasoning in
`design.md` §D4. **If a reviewer disagrees, deleting this one file leaves 17 / 15, still over
the bar.**

**2. Phở is three files, phở gà is one of them.** The doc prescribes the split (broth + the
bowl that consumes it), and `pho-broth` / `pho-bo` follow it. `pho-ga` is deliberately *not*
split, because one bird is both the broth and the meat in the bowl — there is no kitchen
moment at which a chicken phở broth exists on its own, and splitting it would have invented a
step. The file says so in a line.

**3. `cha-lua` sits in `stews-and-braises`, and it is poached.** The weakest placement of the
fourteen. That folder is the collection's de-facto meat drawer — `char-siu`, an oven roast, is
already there — and the alternative was a third new folder holding one file. Flagged for
T-001-18, which reads the whole shelf and can move it if a charcuterie category emerges.

## Quantities and method

Every quantity is written for the stated servings with a metric equivalent, and the notes carry
the second unit as the README asks. Six ingredients originally written as "to cover" now carry
real numbers; that was the one place where the file said less than a cook needs.

Methods are the canonical ones, and each file spends a line on the part that is usually cut:

- `pho-broth` parboils and scrubs before it simmers, because there is no skimming back from a
  muddy start; the sachet and the brisket both come out at ninety minutes.
- `cha-lua` carries the caveat the gap doc calls the recipe's most useful line — the paste stays
  below 50°F (10°C) or the fat smears and the roll is crumbly instead of springy — and says
  plainly that parchment substitutes for banana leaf at the cost of the smell.
- `cha-gio` fries twice, at 325°F then 375°F, rather than once hot.
- `com-tam` says why broken rice is the dish rather than a substitutable grain.
- `xiu-mai` says the sauce must stay thin, because soaking into the bread is the whole point.
- `ca-phe-sua-da` blooms before it fills, and says four minutes with the fix at the grinder.

The three lemongrass marinades (`banh-mi-thit-nuong`, `bun-thit-nuong`, `com-tam`) are one
component appearing in three dishes, and differ where the dishes differ — oyster sauce in the
sandwich, nothing extra in the bún bowl because nước chấm is already running through it, dark
soy in the chop so it plates mahogany. They are not one recipe written three times.

## Test coverage, and the gaps

There are no unit tests to write: this ticket adds data, and `src/` is out of bounds. The three
existing layers were all run.

| Layer | Result |
| --- | --- |
| Per file — `check-recipes.mjs --labels` | `all 14 file(s) draw a table.` Whole collection: `all 312 file(s) draw a table.` |
| Per collection, at parse — `npm run recipes` | `parsed 312 recipe(s) in 20 categories · counters: 312 named, 0 inferred`. No duplicate slug, no dangling pairing, nothing orphaned |
| Per collection, at test — `npx vitest run` | **461 passed, 3 failed.** All three below |

Three other counter tickets are working the same branch concurrently, so the raw failure list
is not a measure of this ticket. Attribution was done by parsing the collection with these
fourteen files removed and re-running.

1. **`schedule.test.ts` → "are the three ferments".** Pre-existing, T-001-01's, unchanged. The
   longest critical path added here is `cha-lua` at 579 min against a 1568-min cut.
2. **`icons.test.ts` → "recognises every verb …".** Seven verbs fall through, **none of them
   from these fourteen files**. Seven that were mine (`bowl`, `build`, `firm`, `load`, `pile`,
   `plate`, `serve`) were reworded to verbs the collection already draws, in commit `59c0525`.
3. **`shopping.test.ts` → "finds an aisle for nearly everything": 19/656 = 2.90% against a 2%
   budget.** This one is partly mine and is the only open concern. Detail below.

Nothing was changed outside `recipes/` to make a number look better, and nothing inside
`recipes/` was distorted to do so either.

## Open concerns

**One, and it needs someone else's file.** Eight ingredient names in these fourteen recipes
have no aisle pattern in `src/data/aisles.json`, which the ticket assigns to T-001-17:

```
đồ chua (4)   nước chấm (3)   bánh mì rolls (3)   grated jicama (2)
ascorbic acid   chả lụa   thịt nguội   Maggi seasoning
```

Eleven more, from the three concurrent counter tickets, are in the same list. With these
fourteen files removed the ratio is 11/615 = 1.79% and the test passes, so these eight are what
tip it past 2%. The obvious workaround — renaming `đồ chua` to "pickled carrot and daikon" and
`chả lụa` to "Vietnamese pork roll" — was rejected: the gap doc's reason for wanting these
recipes at all is that they are *"impossible to find under an English name"*. One honest
reduction was made instead, folding `split bánh mì rolls` into `bánh mì rolls`. **T-001-17 adds
eight patterns and the test goes green.**

## Hand-offs recorded for other tickets

**T-001-17** (`src/`):

- Shelve fourteen new slugs into the counter's printed sections. The gap doc's own section
  codes map cleanly: **Phở (P)** — `pho-bo`, `pho-ga`, `pho-broth`; **Bún (B)** —
  `bun-thit-nuong`; **Cơm (C)** — `com-tam`; **Bánh mì (S)** — `banh-mi-dac-biet`,
  `banh-mi-thit-nuong`, `banh-mi-khong`, `cha-lua`, `xiu-mai`; **Appetisers / plates (A)** —
  `cha-gio`, `goi-cuon`; **drinks** — `ca-phe-sua-da`; **the shelf** — `nuoc-cham`.
- Two new categories exist and no counter claims either as a fallback: **Sandwiches & Rolls**,
  **Drinks**.
- Add the eight aisle patterns above to `src/data/aisles.json`.

**T-001-18** (whole-shelf pass):

- **The one recorded edit to another ticket's file:** `mayonnaise` (currently Deli only) is
  spread on two of these sandwiches. The gap doc says to "pair to it and note the difference"
  rather than duplicate it, which is what `banh-mi-dac-biet` does — pairing plus a prose line
  on the yolk-heavier house version. Whether `mayonnaise` should *also* name Phở & Bánh Mì is
  left to T-001-18. No edit was made.
- `cha-lua` in `stews-and-braises` is the weakest placement here; move it if a charcuterie
  category emerges.
- `pork-liver-pate` and `char-siu` already named this counter and were not touched.
- Ranked items still unwritten, for the rewritten `docs/gaps/`: **#13 nem nướng, #14 bì, #15
  chả cá, #16 chả bông, #17 bò kho, #18 bún bò Huế, #19 pâté chaud, #20 bánh mì ốp la, #21 chè
  ba màu, #22 thịt nguội / giò thủ.** All ten were skipped for one reason — the count reached
  #12 and the list is worked in order. Two are worth doing first next time: **bì**, because it
  needs thính (toasted rice powder), a component nothing else has; and **giò thủ**, which the
  doc calls "exactly the kind of thing this site exists to record".
- The gap doc's header is stale in two places it already flagged: pâté and đồ chua were written
  before this ticket started.

## What a reviewer should read first

`design.md` §D4 — the bánh mì đặc biệt call — and `recipes/sandwiches-and-rolls/banh-mi-dac-biet.cook`
itself. It is the one file where the gap doc could be read two ways, and it is item #1.
