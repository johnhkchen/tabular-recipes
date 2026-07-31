# T-001-17 — Design

Two independent decisions: how the 289 unshelved dishes get into named sections, and how the 90
unplaced ingredient names get an aisle. They share one constraint — only `counters.json` and
`aisles.json` may change — and one method: decide by hand, verify by script.

## A. Getting every dish into a section its board would print

### Options

**A1. Rewrite `docs/gaps/*.md` and re-run `scripts/menu-sections.mjs --write`.**
The script is the file's documented author, so this is the grain of the codebase. Rejected on two
counts. It writes files this ticket does not own (fifteen gap notes), and T-001-18 explicitly owns
rewriting `docs/gaps/` "to reflect what is now on the shelf". Doing it here would collide with the
next ticket and, worse, would put the board's contents into a note whose job is to record what is
*missing*.

**A2. Derive sections from `recipe.category`.**
Cheap and mechanical: Stews & Braises → a section, Salads → a section. Rejected outright — the
ticket's second criterion forbids exactly this ("Section titles are the ones a real board prints
… not the recipe categories"), and `menuFor`'s no-sections fallback already does it and is
described in the source as "a directory, not a menu … only ever a stopgap".

**A3. Hand-place every dish into a title taken from the gap note's `## What it has` headings,
edited into `counters.json` directly.** Chosen.

The titles already exist and are already menu language — "From the pit", "Out of the steamer",
"Toppings you tick off", "Bún (B)", "Chow Mein / Chop Suey". Several were written as headings with
nothing under them, and the fifteen writer tickets wrote exactly the dishes that fill them. The
gap notes stay untouched and stay accurate: they still describe the shelf as it was when they were
written, and T-001-18 rewrites them from the finished shelf.

### How the map is applied

A placement map — counter → ordered list of `(title, [slug…])` — is written by hand and applied by
a throwaway script under the session scratchpad, not in the repository. Reasons: 289 placements
across a 930-line JSON file is where hand-editing goes wrong silently, the same script can assert
its own postconditions (every shelved slug placed exactly once, no slug placed at a counter it is
not shelved at, JSON round-trips at 2-space indent with a trailing newline), and the artifact left
behind is the data file, which is what review reads. The map itself is recorded in `structure.md`,
so the reasoning survives without the script.

### Rules the map follows

1. **Existing sections keep their titles, their order and their items.** New dishes are appended
   into them where they belong; nothing already shelved moves. This ticket adds, it does not
   re-edit fifteen boards.
2. **New sections come from the gap note**, including the ones printed there as empty, and are
   inserted where that note prints them — Phở between the appetisers and Bún, not at the end.
3. **A component sits in the section its board sells it from**, not in a components bin: tares
   and broths under "Broths — the menu's first decision" is wrong (a tare is not a broth on the
   board), so the ramen shop gets "The shelf" for the tares and aroma oils, which is the title its
   own note already uses for bottled things. Where a counter has no such section, the note's own
   wording supplies one.
4. **A dish shelved at several counters is placed separately at each**, under whatever that board
   would call it: coleslaw is a "Side" at the Smokehouse, part of "The vegetable list" at Meat and
   Three, and a "salad by the pound" at the Deli.
5. **Section order is menu order**, first the things printed first. Where a counter's note gives
   an order, it is kept.

### Accepting the "Also" test

The first criterion asks for a script over `recipes.json` and `counters.json` proving no counter
renders "Also". `menuFor` builds that section only when `mine` contains a slug no section names,
so the check is exactly: for each counter, `{slugs shelved here} ⊆ {slugs named in its sections}`.
That check runs as a verification step, not as a new committed test file — this ticket may only
change two data files, and a new test file under `src/` would be a third.

## B. Getting ingredients off "Anything else"

### Options

**B1. A new aisle for things the collection makes.** Rejected. Every aisle in the file is a place
you physically walk, and the file's note says so ("Ordered as a route"). A "components" aisle is a
provenance fact, not a location, and it would put chāshū and pizza dough into a bin the shopper
cannot visit.

**B2. Suppress component names from the shopping list.** Rejected as out of scope and wrong-file:
it would need `shopping.ts` or `plan.ts` to know which names are recipes, and the ticket owns
neither. It is also not obviously right — a person may well buy the char siu.

**B3. Add patterns to the fourteen existing aisles, and put each name where a shop that sells it
ready-made would keep it.** Chosen.

This is what the file already does with `sauerkraut` and `kimchi` (produce, not a fermentation
bin) and with `dashi` (tins, beside the stock). The rule generalises cleanly:

- a made component goes where its ready-made version is sold — **chả lụa and thịt nguội to the
  butcher's chilled case**, **pizza dough and croissant dough to the bakery**, **marinara and
  makhani gravy to the jars**, **red bean paste and the tares to world foods**;
- where nothing is sold ready-made, it goes where its defining ingredient is — **ajitama with the
  eggs**, **hollandaise with the butter**, **attar with the syrups**;
- plurals of existing patterns are added as their own patterns, because `aisleFor` does no
  singularisation (radishes, turnips, mangoes, croissants, rolls);
- Vietnamese names are written exactly as the recipes spell them, because `fold()` does not
  reduce `đ` to `d` (research, "Accent folding has a hole in it").

### What stays in "Anything else"

Three names, deliberately: **flat skewers**, **metal skewers**, **oak or hickory wood**. None is
food, none belongs in a food aisle, and inventing a hardware aisle to hold three lines would
change the walk for every shopping list on the site. 3/925 = 0.32%, well inside the 2% the
criterion allows, and "ask someone" is the honest answer for a skewer.

They are also a signal worth passing on: they read like `cookware`, not ingredients. That is a
note for T-001-18, which owns cross-collection cleanup, not a change to make from here.

### Pack sizes

The criterion asks for a `packs` entry only "where a new ingredient is bought in a package the
list should reason about". `purchaseOf` refuses to answer unless every numbered amount converts
to the pack's unit, so an entry only earns its place when the recipes measure the thing in a
compatible unit. Checked against the actual amounts:

| Added | Recipes measure it in | Pack |
| --- | --- | --- |
| barbecue sauce | cups | a 18 oz bottle (2 cup) |
| marinara sauce | cups | a 24 oz jar (3 cup) |
| ketchup | Tbs, cups | a 20 oz bottle (2.5 cup) |
| wheat starch | Tbs, cups | a 1 lb bag (3.5 cup) |
| matzo meal | cups | a 1 lb box (4 cup) |
| red bean paste | cups | a tin (2 cup) |
| ziti | lb | a 1 lb box (1 lb) |
| vanilla wafers | oz | an 11 oz box (11 oz) |
| seltzer | cups | a 1 L bottle (4 cup) |
| sesame paste | Tbs | folded into the tahini jar entry |
| jaggery, chaat masala, pickling spice, poultry seasoning, mahlab, shawarma spice | tsp, Tbs | folded into the spice-jar entry |

Not added: **taro** and **turnips** (sold loose by weight, and the recipes weigh them — a "pack"
would be a fiction), **pizza dough** (measured in balls, and a ball *is* the pack — but nothing
converts, so `purchaseOf` would stay silent anyway), **lap cheong** (links), **chipotles in
adobo** (a bare count against a tin nobody counts).

## What could go wrong, and the check for it

- **A new pattern outscoring an old one.** Specificity is compared across aisles, so
  "chili sauce" in tins would beat "chili oil" nowhere but could shadow a future "sauce" pattern.
  Mitigation: after every edit, re-run the full aisle sweep and the named assertions in
  `shopping.test.ts` (coconut milk→tins, fish sauce→world, flat-leaf parsley→produce, …).
- **A section listing a slug shelved elsewhere.** `menuFor` drops it silently, so it would never
  show as a failure. The apply script asserts it instead.
- **Two sections claiming the same slug.** The menu would print the dish twice. Asserted.
- **JSON churn.** Both files are re-serialised at 2-space indent with a trailing newline, matching
  what `menu-sections.mjs --write` produces, so the diff shows placements rather than reformatting.

## Out of scope, and stated plainly

`npx vitest run` also fails `icons.test.ts` (51 unknown operation verbs) and two assertions in
`schedule.test.ts` (hardcoded longest-path slugs). Neither is reachable from `counters.json` or
`aisles.json`; both are collection-wide consequences of the fifteen writer tickets, and T-001-18
owns `npm run verify` passing end to end. This ticket takes the aisle-coverage test from failing
to passing and leaves those three exactly as it found them, recorded in the review.
