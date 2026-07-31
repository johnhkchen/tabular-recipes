# T-001-17 — Review

Every dish the fifteen counter tickets wrote now prints in a section its board would actually
print, and the ingredients they brought with them have an aisle. Two files changed, two commits.

## What changed

| File | Commit | Diff |
| --- | --- | --- |
| `src/data/counters.json` | `ed49b39` | +492 / −66 |
| `src/data/aisles.json` | `2783e9a` | +215 / −15 |

Nothing else. No file was created or deleted. `src/generated/recipes.json` was rebuilt several
times (`npm run recipes`) and is gitignored, so it is not in either commit.

### counters.json

- **289 slugs placed** into named sections across all fifteen counters — every dish that was
  falling into `menuFor`'s "Also" sweep.
- **21 sections opened** that the gap notes print but the file did not carry: Out of the steamer
  (Dim Sum) · Pan Salado (Panadería) · Soup, Lo Mein, Egg Foo Young, Beef, Chicken, Mei Fun
  (Takeout) · Phở (P), Bún (B), Cơm (C), The cold case and drinks (Phở & Bánh Mì) ·
  Broths — the menu's first decision, Toppings you tick off (Ramen) · Salads (yum), Noodles
  (Thai) · Starters and the tray (Curry House) · The spit — three or four proteins, Sweets
  (Shawarma) · By the slice (Pizzeria) · The sandwich board, The slicer, The smoked-fish case,
  Salads by the pound (Deli) · Breakfast all day — eggs, meats, potatoes, Sandwiches and burgers
  (Diner) · From the pit, Dessert (Smokehouse).
- Every title is quoted from a `## What it has` heading in `docs/gaps/<slug>.md` — including the
  ones printed there with "— nothing." under them, and the ones listed as "Empty sections, as
  printed on the board". None is a recipe category. `structure.md` cites the source for each.
- **Three pre-existing duplicates removed** (`injera`, `beef-bourguignon`, `marinara-sauce`), each
  of which was making one board print a dish twice. Reasoning in `progress.md`.
- Section order follows the board: new sections are inserted where the note prints them, and at
  Phở & Bánh Mì the sections are emitted in the board's A/P/B/C/S letter order rather than the
  order the extraction script left behind.

### aisles.json

- **100 patterns** across thirteen aisles, **9 new pack sizes**, **2 pack entries extended**.
- Unplaced ingredient names: **90 → 3** of 925, i.e. 9.73% → **0.32%** against a 2% ceiling.

## Test coverage

`npx vitest run` → **663 passed, 3 failed** (666 total).

Green, and directly covering this work:

- `shopping.test.ts` **14/14**, including `finds an aisle for nearly everything, and reports what
  is left` — the ticket's own aisle-coverage criterion — plus every named aisle assertion
  (beef chuck→butcher, coconut milk→tins, fish sauce→world, flat-leaf parsley→produce, …) and the
  pack-size assertions, none of which moved.
- `layout`, `units`, `time`, `collection` suites unaffected.

Not covered by a committed test, verified by script instead:

- **No counter renders an "Also" section.** `check-menus.py` (session scratchpad) re-derives what
  `menuFor` renders — filters `mine` by counter name, maps section slugs, sweeps leftovers — and
  reports EVERY COUNTER CLEAN: no "Also", no empty section, no dish printed twice, no section item
  silently dropped for not being shelved there. This is deliberately not a new test file: the
  ticket permits two data files, and a test under `src/` would be a third. **A committed version of
  this check is worth having, and belongs to whoever next opens `src/lib/counters.ts`.**

### Three failures this ticket did not fix and could not

| Test | Why it fails | Reachable from counters.json / aisles.json? |
| --- | --- | --- |
| `icons.test.ts` — recognises every verb the recipes open an operation with | 51 operation verbs across the new recipes are not in the icon map (`a`, `aromatics`, `balti`, `bhuna`, `blitz`, `dum`, …) | No — the fix is `src/lib/icons.ts` or the recipe files |
| `schedule.test.ts` — are the three ferments | the longest-critical-path top three is now `sour-dill-pickles`, `sauerkraut`, … ; the test names `injera` and `pizza-dough` | No — the fix is the test's hardcoded list |
| `schedule.test.ts` — agree with what their authors claim | one of those recipes' author minutes and computed total disagree by 2015× | No — the fix is the recipe's own claimed time |

All three were already failing before this ticket touched anything (recorded in `progress.md`,
Step 0). They are collection-wide consequences of the fifteen writer tickets, and **T-001-18
("read the whole shelf") is the ticket that owns them** — its criteria include `npm run verify`
passing end to end. Fixing them here would mean editing `src/lib/`, which this ticket's final
criterion forbids.

## Judgement calls a reviewer may want to overrule

These are placements where the board could reasonably read differently. All are one-line changes
in `counters.json`.

1. **Meat and Three → Cornbread → `buttermilk-biscuits`.** The note gives that counter one bread
   heading and calls it "Cornbread"; a real board's bread line is "cornbread or a biscuit". The
   biscuit is filed under it rather than given a heading the notes do not print.
2. **Diner → The dessert case → `milkshake`, `egg-cream`.** Both are fountain items. Neither
   `docs/gaps/diner.md` nor `counters.md` records a fountain heading, so they sit with the case
   rather than under a title invented here.
3. **Shawarma Counter → Sweets.** The note names baklava and maamoul "the sweets" in prose rather
   than as a heading; "Sweets" is the heading two other counters already print.
4. **Ramen Shop → The shelf** holds the broths, tares, noodles and aroma oil (13 items). The
   note's "Broths — the menu's first decision" names the *bowls*, which is what went there.
5. **Thai Kitchen → Rice → `pad-krapow`.** It is a stir-fry, ordered over rice; the note gives the
   board no stir-fry heading.
6. **Phở & Bánh Mì → Bún (B) → `nuoc-cham`.** The note calls it "one table, three sections"; it is
   printed where it is poured most.

## Open concerns

- **`counters.json` `categories` is now inert.** Every recipe names its counters explicitly
  ("514 named, 0 inferred from category"), so the fallback lists have not been exercised in a
  build. Left alone — they are the safety net for the next recipe written without a
  `>> counters:` line.
- **Three ingredient names are not food**: `flat skewers`, `metal skewers` (kafta, shish tawook)
  and `oak or hickory wood` (pastrami). They read like `cookware` entries written into an
  ingredient list. Left in "Anything else" rather than given a fictional aisle; **worth a look
  from T-001-18**, which owns cross-collection cleanup.
- **Four ingredients changed aisle** as a side effect of new patterns, each to a better shelf:
  `all-butter pie crust` dairy→bakery, `tomato ketchup` produce→tins, `fried shallots`
  produce→world, `dried wood ear mushrooms` produce→dry-goods. None is named in a test.
- **`docs/gaps/*.md` is now behind `counters.json`.** The notes still describe the shelf as it was
  before the fifteen writer tickets, and `scripts/menu-sections.mjs` would therefore *undo* this
  ticket if run with `--write` today. T-001-18 rewrites the notes; whoever does it should re-run
  the script afterwards and expect it to reproduce, not replace, these sections.
- **Pack sizes are approximations by design** (the file says so). The nine added were checked
  against the units the recipes actually use, so each can produce a badge; `taro`, `turnips`,
  `pizza dough`, `lap cheong` and `chipotles in adobo` were deliberately left without one because
  nothing would convert and `purchaseOf` would stay silent anyway.

## Acceptance criteria

| Criterion | Status |
| --- | --- |
| Every shelved recipe in a named section; no counter renders "Also" | ✅ verified by `check-menus.py`, all 15 counters |
| Titles are board titles from `counters.md` / `docs/gaps/`, not categories | ✅ each cited in `structure.md` |
| "Anything else" under 2%, water excepted | ✅ 3/925 = 0.32% |
| `packs` entry where the list should reason about a package | ✅ 9 added, 2 extended, each unit-checked |
| `npx vitest run` passes, including the aisle-coverage test | ⚠️ aisle-coverage test passes; three pre-existing failures in `src/lib/` remain, outside this ticket's two files and owned by T-001-18 |
| Only `counters.json` and `aisles.json` modified | ✅ `git status` clean of ticket-owned files |
