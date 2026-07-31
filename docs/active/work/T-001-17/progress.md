# T-001-17 — Progress

## Step 0 — baseline ✅

`npm run recipes` → 514 recipes, 27 categories, "514 named, 0 inferred from category".
`npx vitest run` → 4 failures / 666 tests:

- `shopping.test.ts` "finds an aisle for nearly everything" — 90/925 = 9.73% unplaced (mine)
- `icons.test.ts` "recognises every verb the recipes open an operation with" — 51 verbs (not mine)
- `schedule.test.ts` ×2 — hardcoded longest-critical-path slugs (not mine)

Baseline copy of `counters.json` kept in the scratchpad for diffing.

## Step 1 — counters.json placements ✅

Applied the map from `structure.md` with `place.py` (scratchpad, not committed):
**289 slugs placed across 15 counters**, matching the 289 the baseline sweep counted.

The script's own assertions all passed: every mapped slug is shelved at that counter, no slug in
two sections of one counter, no section title outside the recorded set, and the file round-trips
byte-identically through `json.dumps(..., indent=2, ensure_ascii=False)`.

### Deviation from the plan: three pre-existing duplicates

The first run failed on `shawarma-counter: slug in two sections: {'injera'}`. A sweep of the
baseline found three slugs already listed twice on one board, so those menus print the dish twice
today:

| Counter | Slug | Sections |
| --- | --- | --- |
| Shawarma Counter | `injera` | Bread · Shelved here from the Ethiopian board |
| Meat and Three | `beef-bourguignon` | The meat list, rotating · Shelved here from elsewhere |
| Pizzeria | `marinara-sauce` | Whole pies · The sauce shelf |

A menu prints a dish once, and the ticket's first criterion says a recipe appears in **one** of
its counter's sections, so all three were deduplicated rather than left standing. Which listing
survives:

- `injera` and `beef-bourguignon` keep the **"Shelved here from…"** listing, because that heading
  is the more informative of the two — it exists precisely to say why an out-of-place dish is on
  this board — and drop out of the general section.
- `marinara-sauce` keeps **The sauce shelf**, beside the other sauces, and drops out of Whole
  pies, which now reads as the two doughs a whole pie is built from.

This edits items in existing sections, which the design's rule 1 said it would not do. Recorded
here rather than done silently; it touches three lines and no other existing item moved.

### Second deviation: emitted section order at Phở & Bánh Mì

The gap note prints that board in letter order — A, P, B, C, S, then the case — and
`counters.json` had "Bánh mì (S)" before "Appetisers / plates (A)", which is extraction order, not
board order. The sections are emitted in the note's order. Recorded in `structure.md` as an
amendment before the work started.

### Verification ✅

`check-menus.py` (scratchpad) re-derives what `menuFor` would render, independently of the apply
script: **every counter clean** — no "Also" section anywhere, no empty section, no dish printed
twice, no section item silently dropped for not being shelved there. Section counts per counter:

Bakery 8 · Panadería 5 · Taquería 6 · Dim Sum 7 · Takeout 11 · Phở & Bánh Mì 6 · Ramen 7 ·
Curry House 9 · Thai 7 · Shawarma 10 · Pizzeria 9 · Deli 11 · Diner 9 · Smokehouse 6 ·
Meat and Three 7.

Diff: 492 insertions, 66 deletions, all inside `sections` arrays. No reformatting.

## Step 2 — commit counters.json ✅

`lisa commit-ticket --ticket-id T-001-17 --include src/data/counters.json`

Commit `ed49b39`.

## Step 3 — aisles.json ✅

**100 patterns** added across thirteen aisles, **9 new pack entries**, **2 existing pack entries
extended** — applied with `aisles_add.py` (scratchpad) rather than by hand, for the same reason as
the placements: the script refuses a pattern already on file, refuses a pack pattern that collides
with an existing entry, and asserts the file round-trips at 2-space indent with
`ensure_ascii=False`. Deviation from the plan's wording ("Edit tool, one aisle at a time") in
method only; the patterns are exactly the ones listed in `structure.md` §B and §C.

### Verification ✅

- **Unplaced ingredients: 90 → 3 of 925 = 0.32%** (budget was 18). The three left are
  `flat skewers`, `metal skewers`, `oak or hickory wood` — the non-food names the design named in
  advance.
- **Named aisle assertions**: all 15 from `shopping.test.ts` still resolve as before.
- **Spot checks**: 87/87 new names land in the aisle `structure.md` assigned them.
- **Regression sweep**: of the 835 names that already had an aisle, **four moved**, all of them to
  a better shelf, none named in a test:
  - `all-butter pie crust` dairy → bakery (was matching "butter")
  - `tomato ketchup` produce → tins (was matching "tomato")
  - `fried shallots` produce → world (the crispy shallot tub, in bún thịt nướng)
  - `dried wood ear mushrooms` produce → dry-goods (was matching "mushrooms")
- `npx vitest run src/lib/shopping.test.ts` → **14/14 passed**, pack assertions unmoved.

## Step 4 — commit aisles.json ✅

Commit `2783e9a`.

## Step 5 — final verification ✅

After a clean `npm run recipes`:

- `check-menus.py` → EVERY COUNTER CLEAN.
- aisle sweep → 3/925 = 0.32%.
- `npx vitest run` → **663 passed, 3 failed**. The three are the ones this ticket cannot reach:
  `icons.test.ts` (unknown operation verbs) and `schedule.test.ts` ×2 (hardcoded longest-path
  slugs). Both live in `src/lib/`, which this ticket may not modify, and T-001-18 owns
  `npm run verify` passing end to end.
- `git status --porcelain` → no ticket-owned source file modified, staged or untracked. The
  ticket file's own frontmatter edit is Lisa's; `.lisa-layout.kdl` and the two `.lisa/*.jsonl`
  files were already untracked at session start.
