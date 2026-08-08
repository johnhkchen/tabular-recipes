# T-007-05 — Review

The cha chaan teng is on its board, its tins have aisles, and the whole collection has been read.
Four files, six commits, no source code and **no `.cook` file** touched. `npm run verify` is green
end to end.

**The one thing that needs a human is §2.** Five recipes were borrowed onto this counter exactly
the way the ticket describes, and the site drops all five. That is a defect in the borrow
mechanism, not in the data, and this ticket may not touch the file that would fix it.

---

## 1. What changed

| File | Change | Commit |
| --- | --- | --- |
| `src/data/aisles.json` | +3 patterns. Nothing removed, nothing reordered. | `062e89b` |
| `docs/gaps/cha-chaan-teng.md` | `## What it has` filled; missing list re-ranked 24 → 5; components cut 7 → 2; borrows table gains a *What happened* column; last heading renamed. | `8fd1931`, `e0885ae`, `4c99920` |
| `src/data/counters.json` | The `cha-chaan-teng` object only: 7 empty sections → 5 populated ones. | `de86f85` |
| `docs/gaps/README.md` | Build state, retired-counters close, the tally (15 rows → 21), duplicate-check result, the five gaps, two new shelving notes. | `dfa92ff` |

Nothing else. `git status --porcelain` shows no owned file staged, modified or untracked. Two
scratch probes under `src/lib/` were deleted and reached no commit.

## 2. The borrow does not reach the page — read this one

**What the ticket says.** *"A section may list a recipe that never names the counter — that is how
a shelf borrows"*, and the shelf must hold *"at least four written before this story"*.

**What the code does.** `src/lib/counters.ts:74–81`, `menuFor()`:

```ts
const mine = all.filter((r) => r.counters.includes(counter.name));
const bySlug = new Map(mine.map((r) => [r.slug, r]));
...
items: items.map((slug) => bySlug.get(slug)).filter(Boolean)
```

A listed slug whose `.cook` file does not name the counter is looked up, missed, and dropped by
`.filter(Boolean)`. Nothing fails. `scripts/parse-recipes.mjs:100–106` says the same thing in its
own comment and calls it "the quiet failure"; its error text at line 153 gives the only remedy —
*"Give it a `>> counters:` line naming {counter}."*

**Measured, off the built page.** `counters.json` lists 27; `dist/menu/cha-chaan-teng/index.html`
prints 22.

| Section | Listed | Printed | Dropped |
| --- | --: | --: | --- |
| The drinks counter | 6 | 6 | — |
| Toast and the bun case | 4 | 2 | `pineapple-bun`, `egg-custard-tart` |
| Macaroni, noodles and things in soup | 7 | 5 | `beef-chow-fun`, `char-siu` |
| Rice plates | 6 | 6 | — |
| Sandwiches and buns | 4 | 3 | `club-sandwich` |

**Why it was done this way anyway.** The ticket states the mechanism twice and names two of the
five dishes by slug. `design.md` §1 sets out the four options; the two that would render them are
editing five `>> counters:` lines (forbidden by the last acceptance criterion, which also says a
recipe needing a fix is *a finding, not a fix*) and changing `menuFor()` (a file this ticket does
not own, and a collection-wide behaviour change).

**This has happened before, by accident.** `One Pot` has listed four slugs it does not shelve —
`general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` — since
`88ca990`, and every gate in the repository is green over it. Nothing fails when `counters.json`
lies.

**The remedy is one line per file**, in five files this ticket may not open:

| File | Current `>> counters:` | Add |
| --- | --- | --- |
| `recipes/custards-and-puddings/egg-custard-tart.cook` | Dim Sum Counter, Bakery | `, Cha Chaan Teng` |
| `recipes/breads/pineapple-bun.cook` | Bakery, Dim Sum Counter | `, Cha Chaan Teng` |
| `recipes/sandwiches-and-rolls/club-sandwich.cook` | Diner, Deli | `, Cha Chaan Teng` |
| `recipes/noodles/beef-chow-fun.cook` | Dim Sum Counter | `, Cha Chaan Teng` |
| `recipes/stews-and-braises/char-siu.cook` | Dim Sum Counter, Takeout Counter, Phở & Bánh Mì, The Bowl Shop | `, Cha Chaan Teng` |

Alternatively the board decides listing-without-shelving should be an **error** rather than a
silent drop, which would catch One Pot's four as well. Either is a ticket; neither is a data edit.

## 3. Acceptance criteria against evidence

| Criterion | Evidence |
| --- | --- |
| Populated sections, in menu order, **no "Also here"** | Five `<h2>`s in the built page, in file order. `grep -c "Also" dist/menu/cha-chaan-teng/index.html` → `0` |
| ≥ 20 recipes, ≥ 4 written before this story, borrows named | 27 listed / 22 printed. The four pre-story dishes are `egg-custard-tart` (Dim Sum Counter, Bakery), `pineapple-bun` (Bakery, Dim Sum Counter), `club-sandwich` (Diner, Deli), `beef-chow-fun` (Dim Sum Counter), plus `char-siu` (four counters). **See §2 — listed, not printed.** |
| Every listed slug resolves to a real recipe | `menu-sections.mjs` resolves all 27 against `src/generated/recipes.json`; a token it cannot resolve is reported as `unparsed`, and there are none |
| Aisle test passes; `condensed milk` ≠ `evaporated milk` | §4 |
| No pattern steals from a more specific one elsewhere | §4 — full 1074-name before/after diff, three changed lines |
| `## What it has` rewritten; `menu-sections.mjs` reproduces `counters.json` | §5 |
| README tally covers all 21, no Soup Pot row, five gaps re-ranked | §6 |
| Duplicate-name check run, every collision classed, wrong ones fixed | §7 |
| Every shelf ingredient with its aisle; specialists named | §8 |
| `npm run verify` green | §9 |
| Only the four owned files modified, no `.cook` edited | §1 |

## 4. Aisles

`src/lib/shopping.test.ts`, the coverage report, before and after:

```
5/1074 ingredients have no aisle:            3/1074 ingredients have no aisle:
  tinned luncheon meat (2), satay sauce (1),   flat skewers (1), oak or hickory wood (1),
  flat skewers (1), oak or hickory wood (1),   metal skewers (1)
  metal skewers (1)
```

The three that remain are cookware written into ingredient lists and were already on record in
`docs/gaps/README.md`.

**Three patterns added**, all strictly more specific than whatever won for those names before:

| Pattern | Aisle | Score | Beat |
| --- | --- | --: | --- |
| `luncheon meat` | `tins` | 2013 | nothing (was `other`) |
| `satay sauce` | `world` | 2011 | nothing (was `other`) |
| `chili garlic sauce` | `world` | 3018 | `garlic` in `produce`, 1006 |

**The no-theft evidence** is a dump of `(name → aisle, winning pattern)` for all 1074 ingredient
names in the collection, taken before and after. The producing probe asserted its own resolver
agreed with `aisleFor()` on every one of the 1074 before writing a line. The whole diff:

```
234c234
< chili garlic sauce      produce   garlic
> chili garlic sauce      world     chili garlic sauce
867c867
< satay sauce             other     -
> satay sauce             world     satay sauce
973c973
< tinned luncheon meat    other     -
> tinned luncheon meat    tins      luncheon meat
```

Three lines, all intended, and every one moves a name *to* a more specific pattern. Nothing else in
the collection moved.

**The two tins, shown:**

```
condensed milk            -> baking   [condensed milk]            score 2014
sweetened condensed milk  -> baking   [sweetened condensed milk]  score 3024
evaporated milk           -> dairy    [evaporated milk]           score 2015
```

Different patterns, different aisles. `condensed milk` cannot reach `dairy` at all —
`dairy.except` carries it, along with `sweetened condensed milk`.

**No pack size was added.** `purchaseOf()` returns `null` rather than compare grams to cups, and no
badge is worth an invented density.

**The Soup Pot's dead patterns were left alone**, as the ticket asks. Of the eleven —
`honey date`, `honey dates`, `dried scallop`, `dried lily buds`, `job's tears`, `lily bulb`,
`fox nut`, `apricot kernels`, `Solomon's seal`, `adenophora root`, `overlord flower` — the dump
shows two are not dead (`dried scallop`, `dried lily buds` still win for live ingredients) and the
other nine win for nothing. None steals.

## 5. The round trip

Proven on a scratch copy of the tree, so `--write` could run without touching the real file:

```
git archive HEAD | tar -x -C $SP/rt
cp src/data/{counters,aisles}.json $SP/rt/src/data/ ; cp docs/gaps/cha-chaan-teng.md $SP/rt/docs/gaps/
cd $SP/rt && node scripts/parse-recipes.mjs && node scripts/menu-sections.mjs --write
→ the cha-chaan-teng object in the rewritten copy is identical to the real one
```

The comparison is scoped to that counter on purpose: `--write` rewrites **every** counter and drops
the hand-written `notes` on eleven sections elsewhere. That is a property of the script, now
written down in the README's intro, and not something this ticket caused.

The dry run in the real tree:

```
  ok   Cha Chaan Teng: 5 sections, 27/22 placed
         The drinks counter (6) / Toast and the bun case (4)
         Macaroni, noodles and things in soup (7) / Rice plates (6) / Sandwiches and buns (4)
         listed but not shelved here -> pineapple-bun, egg-custard-tart, beef-chow-fun,
                                        char-siu, club-sandwich
2 counter(s) need a look.
```

Both flagged counters are §2: this one deliberately, One Pot pre-existing.

**Two of T-007-01's seven titles were dropped.** *The set meals (常餐 · 早餐 · 下午茶餐)* can hold
nothing — T-007-01's own page says 常餐 "is not a dish, it is a rule" — and *Also here* is the
catch-all the criteria forbid. A section with no items cannot be produced by `menu-sections.mjs`,
so keeping either would have broken the round trip. The ticket's instruction covers it: *"fix the
placement, or the titles."*

**`lo-mein` was not shelved**, applying T-007-01's refusal as written. No disagreement with any of
the eight verdicts in that table; each was re-read against the `>> counters:` and `>> aka:` lines
of the file it judges, and each held.

## 6. `docs/gaps/README.md`

- **Build state** restated after a real `npm run verify`. 664 recipes = 658 at `096b1d4` − 16
  deleted + 8 + 14, which is the arithmetic the ticket asks for. **0 orphans, 0 inferred, 0 parser
  warnings, 0 duplicate slugs.**
- **The tally is 21 rows.** The Soup Pot's row is gone; its `096b1d4` values (24 / 21 / 32 / 6) are
  written into the paragraph under the table so the `was` total still adds up.
- **`was` is re-derived**, not remembered: the tree at `096b1d4` was rebuilt from source in a
  scratch checkout and counted with the same script.
- **The method was validated before it was trusted.** Run against the fifteen rows the old table
  printed, it reproduces **Recipes**, **Missing dishes** and **Missing components** exactly. It does
  not reproduce **Only here** — the old column was left at 514-recipe values and is wrong for eleven
  counters (Curry House 47 → 31, Diner 35 → 29, Deli 24 → 17). Corrected, and the correction is
  stated in the file.
- **The fifteen-counter apology is deleted**, because the thing it apologised for is fixed.
- **The five gaps are re-ranked.** Gap 5 was *a drink that is brewed*; there are nine drinks now and
  three brew, so it comes off and **a dark roux and a trinity base** is promoted from the
  runners-up. Sweet tea, Thai iced tea, café de olla and hot tea are recorded as ordinary requests
  with `hong-kong-milk-tea` named as the shape to copy.
- **150 items a single table cannot hold**, across 21 counters. The old figure was 107 across
  fifteen; nothing changed about what a table can hold, six counters had simply never been counted.

## 7. The duplicate-name check

T-002-09's three passes, re-run over `096b1d4` and over the current tree, then diffed — so the
answer is *what S-007 changed* rather than a re-litigation of 148 collisions.

| Pass | was | now | delta |
| --- | --: | --: | --- |
| alias collisions (title + `aka`, accent- and case-folded) | 149 | 148 | −*lo fo tong*, −*老火湯*, +*french toast* |
| multi-file `dish:` keys | 32 | 32 | none — all declared kit families |
| ingredient overlap ≥ 0.60, variants excluded | 97 | 98 | +`baked-pork-chop-rice` ~ `pork-chop-in-tomato-sauce` (0.61) |

- **−*lo fo tong* / −*老火湯***: both were shared by the same sixteen files, all deleted by
  T-007-02. Gone with them.
- **+*french toast*** — shared by `french-toast` and `hong-kong-french-toast`. **Honest.** A menu
  really does print it for both; the Brooklyn board prices *Kowloon French Toast* above the plain
  one on the same page. `hong-kong-french-toast` carries a full-width row saying it is not the
  diner's, so a searcher who lands on the wrong one is told which is which by the table itself.
- **+the overlap pair** — 0.61 between the pan pork chop and the baked one. **Deliberate**; the gap
  note ranked the pan version first precisely so the baked one could share its sauce, and the two
  files pair to each other.

**Twenty-two new files, one new shared name.** The block of Cantonese `aka` lines added no
collision at all. **Nothing was classed wrong, so nothing was fixed.**

## 8. Every ingredient on the shelf, and where it lands

All 27 listed recipes, 118 distinct ingredient names.

| Aisle | Names |
| --- | --- |
| **Produce** (17) | bay leaf · bean sprouts · beefsteak tomato · carrot · celery · fresh ginger · garlic · ginger · green cabbage · iceberg lettuce · lemon · potato · russet potato · scallion · scallions · yellow chives · yellow onion |
| **Butcher** (13) | beef brisket · beef shin · beef sirloin · bone-in pork chops · boneless pork chops · chicken wings · flank steak · lard · minced beef · pork shoulder · roast turkey · sliced ham · thick-cut bacon |
| **Fishmonger** (1) | raw shrimp |
| **Cheese counter** (1) | mild cheddar |
| **Dairy & eggs** (14) | beaten egg yolk · egg · egg yolk · eggs · evaporated milk · fermented red bean curd · Hong Kong milk tea · mayonnaise · nonfat dry milk · salted butter · softened unsalted butter · unsalted butter · warm whole milk · whole milk |
| **Bakery** (4) | blind-baked tart shells · crusty white rolls · thick-cut white bread · white sandwich bread |
| **Baking aisle** (17) | baker's ammonia · baking soda · bread flour · cake flour · cornstarch · custard powder · golden syrup · granulated sugar · honey · instant yeast · malted milk powder · powdered sugar · rock sugar · sugar · sugar syrup · sweetened condensed milk · vanilla extract |
| **Dry goods** (9) | cold cooked jasmine rice · creamy peanut butter · dried adzuki beans · elbow macaroni · fresh thin egg noodles · fresh wide rice noodles · instant noodles · steamed jasmine rice · toasted sesame seeds |
| **Tins & jars** (7) | beef stock · canned chopped tomatoes · chicken stock · coconut milk · ketchup · tinned luncheon meat · tomato paste |
| **Spice rack** (10) | black pepper · Chinese five-spice powder · fine salt · five-spice powder · ground turmeric · kosher salt · mild curry powder · star anise · table salt · white pepper |
| **Oils & vinegars** (3) | neutral oil · peanut oil · toasted sesame oil |
| **World foods** (9) | chili garlic sauce · dark soy sauce · hoisin sauce · light soy sauce · maltose · oyster sauce · satay sauce · Shaoxing wine · Worcestershire sauce |
| **Freezer** (3) | crushed ice · frozen peas · ice |
| **Drinks** (4) | Ceylon tea bags · cola · ground dark roast coffee · loose-leaf Ceylon black tea |
| **Anything else** (6) | six spellings of water, which `staples.json` lifts off the buying list |

### Does it need a specialist shop?

**Of the 22 recipes written for this counter: two ingredients, and both are borderline rather than
specialist.**

| Ingredient | Where | Verdict |
| --- | --- | --- |
| `Shaoxing wine` | 7 files | A large supermarket carries it; a small one may not. Dry sherry is the standard substitute and every file that uses it is a stir-fry where the swap is invisible. |
| `satay sauce` | `satay-beef-noodles` | The gap note called this in advance — "a jar most supermarkets carry and some do not". Now aisled to *World foods*, the aisle you go to on purpose. |

Everything else on those 22 — the evaporated milk, the sweetened condensed milk, the tinned
luncheon meat, the instant noodles, the custard powder, the golden syrup, the malted milk powder,
the Ceylon tea — is an ordinary supermarket line, which is exactly the claim S-007 made.
**The story kept its promise.**

**The five genuinely specialist names all arrive with the borrowed recipes, not with this shelf:**

| Ingredient | From | Note |
| --- | --- | --- |
| `fermented red bean curd` (南乳) | `char-siu` | Chinese grocery. Also **mis-shelved**: it resolves to *Dairy & eggs* on the pattern `curd`. It is a jar. |
| `maltose` | `char-siu` | Chinese grocery; correctly in *World foods*. |
| `fresh wide rice noodles` (河粉) | `beef-chow-fun` | Fresh ho fun is a Chinese grocery item; the dried ones are not the same dish. |
| `yellow chives` (韭黃) | `beef-chow-fun` | Chinese grocery; resolves to *Produce* on `chives`. |
| `baker's ammonia` | `pineapple-bun` | A specialist baking line, correctly in the baking aisle. |

`fermented red bean curd` is the one wrong shelf among them. It is used by exactly one file,
`char-siu`, which this ticket may not edit, and adding a pattern for it is a fix to a recipe this
counter borrowed rather than to this counter — recorded here rather than done.

## 9. `npm run verify`

```
all 664 file(s) draw a table.
parsed 664 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 664 named, 0 inferred from category · timers in 640 · pairings 770 · washing-up in 11
 Test Files  11 passed (11)
      Tests  894 passed (894)
[build] 688 page(s) built
```

**0 orphans, 0 counters inferred from category, 0 parser warnings, 0 duplicate slugs** — the first
three are the parser line above, the fourth is `collection.test.ts`.

**No test was added, deliberately.** This ticket's product is data, and five existing gates cover
everything it could break: `shopping.test.ts` (coverage and specificity), `collection.test.ts`
(slugs, orphans, counters, pairings), `parse-recipes.mjs` (counter names, notes), `check-recipes.mjs`
(every file draws a table), `menu-sections.mjs` (the gap note and the menu agree). The two things
asserted here that no test can hold — "no added pattern stole a product" and "these 148 collisions
are honest" — are diffs against a baseline, and a test asserting a hand-curated allowlist would
fail on the next recipe written. Same reasoning T-002-09 recorded.

## 10. Open concerns

1. **The five borrows do not render.** §2. Needs a ticket that owns those five `.cook` files, or a
   decision about `menuFor()`.
2. **One Pot lists four slugs it does not shelve, and `docs/gaps/one-pot.md` is five sections
   behind `counters.json`** — since `88ca990`. Not owned here; fixing one half of a two-file drift
   makes it worse. Named in the README tally.
3. **`evaporated milk` sits in the cold case on a tie-break.** `dairy` and `baking` carry the
   identical pattern and the winner is whichever aisle comes first in the file. Nothing is wrong
   today; a re-order of `aisles.json` would move a tin with no test failing.
4. **`Hong Kong milk tea` is an ingredient line that resolves to Dairy on `milk`.** It is a
   sub-recipe. The convention elsewhere is a pattern per component; the honest fix is probably in
   `yuenyeung` rather than in the aisle list.
5. **`fermented red bean curd` resolves to Dairy on `curd`.** §8.
6. **No shelf talk.** The new counter has no `notes`, because `menu-sections.mjs --write` drops
   them and the criteria asked for a block that round-trips. Five sections that compare their own
   dishes would be worth a small follow-up.
7. **The heading rename was unplanned.** `cha-chaan-teng.md`'s last `##` was
   *What a table cannot hold*; the other twenty counters use *What it could not stock*, and the
   README's "items a table cannot express" figure is derived off that heading. Renamed so the
   derivation sees all 21. `progress.md` records it as a deviation.

## 11. Concurrency

Three other threads committed to this branch during this ticket — T-008-01, T-009-01, and a
`schedule.ts` change. `npm run verify` was red for a few minutes on
`src/lib/step-labels.test.ts`, which belongs to T-009-01 and went green again on its own. No file
this ticket owns was touched by any of them, and the final verify above was run after they landed.
The **test and page counts** in the README's Build state will move under those stories; the recipe,
counter, assignment and pairing counts are this story's and are stable.
