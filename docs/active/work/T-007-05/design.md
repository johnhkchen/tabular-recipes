# T-007-05 — Design

Six decisions. Each is grounded in a fact from `research.md`, and the one that matters is §1.

---

## 1. The borrow: list it, and say plainly that it does not render

**The conflict.** Two acceptance criteria cannot both hold:

- *"It shelves at least 20 recipes, including at least four written before this story"* — the four
  are `egg-custard-tart`, `pineapple-bun`, `club-sandwich`, `beef-chow-fun` (and `char-siu`,
  which T-007-01 added).
- *"No `.cook` file is edited here."*

`research.md` §2 shows why: `menuFor()` builds its lookup from recipes whose own `>> counters:`
line names the counter, and drops any listed slug that is not among them. All 22 recipes that
name Cha Chaan Teng were written inside S-007 (`research.md` §3), so "written before this story"
can only be satisfied by a borrow, and a borrow can only reach the page through a `.cook` edit.

**Options considered.**

| | What it does | Why not |
| --- | --- | --- |
| **A. Edit five `>> counters:` lines** | The five borrowed dishes render. | Directly violates the last acceptance criterion, which also says a recipe needing a fix is *a finding, not a fix*. |
| **B. Change `menuFor()` to look up the whole collection** | Borrowing works everywhere, One Pot's four ghosts come back too. | `src/lib/counters.ts` is not owned by this ticket, and it is a collection-wide behaviour change dressed up as a data fix. Also needs a test, which is a third unowned file. |
| **C. Do not list them** | Tool output clean; nothing inert in the data. | Fails an explicit criterion outright, and discards the classification work T-007-01 did on all seven candidates. |
| **D. List them, and report the drop** | The borrow is recorded where the ticket says to record it; the defect is named with a code citation and a one-line remedy. | Leaves five entries in `counters.json` that render nothing, and `menu-sections.mjs` will warn about them for as long as they are there. |

**Chosen: D.** The ticket states the mechanism twice and in the imperative — *"A section may list a
recipe that never names the counter — that is how a shelf borrows"*, and *"`egg-custard-tart` and
`pineapple-bun` … belong in the bun case here too"*. That is the author's decision about where the
borrow is recorded. What this ticket can add is the measurement they did not have: the borrow is
recorded and **does not reach the page**, the reason is one line of `counters.ts`, and the remedy
is five `>> counters:` lines in files this ticket may not touch.

B is the tempting one and is wrong here for a reason worth stating: One Pot's four ghost slugs
(`research.md` §2) show the same drop has already happened by accident once. Whether the right
answer is "make listing work" or "make listing an error" is a board decision, not a data edit, and
it belongs in its own ticket with its own test.

**`lo-mein` is not shelved.** T-007-01's work list refuses it — the existing file is
Chinese-American 撈麵, and this board's 撈丁 is drained instant noodles, unwritten. Applied as
written; no disagreement.

## 2. Section titles: five, not seven

T-007-01 gave seven titles and no items. Two of them cannot hold anything that exists:

- **"The set meals (常餐 · 早餐 · 下午茶餐)"** — T-007-01's own *what a table cannot hold* section
  says "常餐 is not a dish, it is a rule … Four tables and a clock", and records the set grid in
  `docs/knowledge/counters.md` instead. Nothing was written as a set and nothing will be. Filling
  it would mean printing a dish twice, once under its own kind and once under the set it appears
  in.
- **"Also here"** — the criteria forbid rendering it, and after §1 there is nothing left over to
  put in it.

`scripts/menu-sections.mjs` emits a section only when it finds at least one slug, so an empty
title in `counters.json` can never be reproduced from the gap note. Keeping either title would
break the round-trip criterion. Both are dropped, and the ticket's own instruction covers it:
*"fix the placement, or the titles."*

The remaining five keep T-007-01's relative order, so the drinks lead — which is the order T-007-01
argued for on the merits ("the tea is this shelf's flagship recipe"), now that the set grid above
it is gone.

**Rejected:** renaming "The set meals" into something the files fill (e.g. "Breakfast, all
morning"). It would be a new title invented by this ticket rather than a menu order argued from
boards, and the dishes it would hold are already sorted by kind.

## 3. Placement

Borrowed slugs are marked ◦.

| Section | Items |
| --- | --- |
| The drinks counter | `hong-kong-milk-tea` `yuenyeung` `iced-lemon-tea` `lemon-coke-with-ginger` `horlicks` `red-bean-ice` |
| Toast and the bun case | `thick-toast` `hong-kong-french-toast` ◦`pineapple-bun` ◦`egg-custard-tart` |
| Macaroni, noodles and things in soup | `ham-macaroni-soup` `luncheon-meat-and-egg-noodles` `hong-kong-borscht` `satay-beef-noodles` `soy-sauce-pan-fried-noodles` ◦`beef-chow-fun` ◦`char-siu` |
| Rice plates | `baked-pork-chop-rice` `pork-chop-in-tomato-sauce` `minced-beef-rice` `shrimp-and-egg-rice` `curry-beef-brisket` `swiss-wings` |
| Sandwiches and buns | `luncheon-meat-and-egg-sandwich` `hong-kong-egg-sandwich` `pork-chop-bun` ◦`club-sandwich` |

22 shelved + 5 borrowed = 27 listed, 22 rendered, every dish in exactly one section.

Within a section the order is menu order, not alphabetical: the flagship or the cheapest set item
first. The drinks run tea → tea-with-coffee → cold tea → the soda → the malt → the ice, which is
the order every board read prints them in. `curry-beef-brisket` and `swiss-wings` sit under *Rice
plates* because that is how the counter sells them — 咖喱牛腩飯 is in `curry-beef-brisket`'s own
`aka`, and its last step is literally "over rice". `char-siu` sits under the noodle-and-soup
heading for T-007-01's stated reason: 叉燒湯意粉 is a breakfast-set item, not a roast-meat plate.

**No `notes` (shelf talk) is written.** `scripts/menu-sections.mjs --write` drops every note in
the file, and the acceptance criterion asks for a block that round-trips. Shelf talk for this
counter is a follow-up, recorded in `review.md`.

## 4. Aisles: three patterns, all more specific than anything they touch

The coverage test names two real gaps and the audit found two silent mis-shelvings
(`research.md` §6).

| Pattern | Aisle | Fixes | Score vs. what it beats |
| --- | --- | --- | --- |
| `luncheon meat` | `tins` | `tinned luncheon meat` → `other` | 2013 vs nothing (`butcher` has `stew meat`, `ham`; neither matches) |
| `satay sauce` | `world` | `satay sauce` → `other` | 2011 vs nothing |
| `chili garlic sauce` | `world` | `chili garlic sauce` → `produce` on `garlic` | 3018 vs 1006 |

All three are strictly more specific than any pattern that currently wins for those names, so by
construction none can take a product away from a more specific pattern — the only way to steal
under `aisleFor()` is to out-score, and a longer pattern only out-scores names it fully matches.
The before/after diff over all 1074 ingredient names is the evidence, not this argument.

**Aisle choices.** `luncheon meat` goes to *Tins & jars* because it is a tin, and the whole
sourcing argument of S-007 is that it is an ordinary middle-aisle tin. `satay sauce` goes to
*World foods*, "the aisle you go to on purpose", which is exactly where the gap note says it sits
("a jar most supermarkets carry and some do not"). `chili garlic sauce` joins it: it is the same
kind of jar, and `sriracha` and `sambal` are already there.

**Rejected: `instant noodles` as its own pattern.** It already resolves to *Dry goods* through
`noodles`, which is the right aisle. A pattern that changes nothing is noise.

**Rejected: moving `evaporated milk` out of `dairy`.** `dairy` and `baking` carry the identical
two-word pattern, so the tie breaks on file order and the cold case wins. Both are defensible
shelves and the criterion — *"`condensed milk` and `evaporated milk` resolve to different
patterns"* — already holds (`condensed milk` is in `dairy.except`, so it can only be `baking`).
Changing it would move every evaporated-milk recipe in the collection for a shelf preference this
ticket was not asked to have. Recorded as a finding instead: it is decided by ordering, and a
reordering of `aisles.json` would move it silently.

**Rejected: removing The Soup Pot's dead patterns.** The ticket says leave them unless one steals
something; the before/after diff shows none of them wins for any live ingredient except
`dried scallop` and `dried lily buds`, which are still in use elsewhere and are therefore not
dead.

**Rejected: a pack size for anything.** `purchaseOf()` returns `null` rather than compare grams to
cups, and no badge is worth an invented density.

**`Hong Kong milk tea` is left alone.** It resolves to `dairy` on `milk`, which is wrong — it is a
sub-recipe, not a carton — and the collection's convention would give it a pattern of its own
(`char siu` → `butcher`, `pizza dough` → `bakery`). But it is wrong in `yuenyeung`, a `.cook` file
this ticket may not edit, and the honest fix is arguably in the recipe (a `@&` reference rather
than a named ingredient) rather than in the aisle list. Recorded as a finding.

## 5. `docs/gaps/README.md`: rewrite four blocks, leave the rest

- **Build state** — restated from a real `npm run verify` after the change, with the numbers this
  ticket measured rather than the ones T-007-02 predicted.
- **Retired counters** — kept. The Soup Pot's record is the point of it. The last paragraph, which
  says Cha Chaan Teng is the empty one and T-007-05 fills it, is rewritten to say it is full.
- **The tally** — 21 rows, one per counter, The Soup Pot's row gone, Cha Chaan Teng's row added.
  **was** columns are re-derived against `096b1d4`, the commit this story started from, which is
  what the file already says they mean. The *Only here* column is recomputed as "recipes at
  exactly one counter" and is different from the printed one for eleven counters; the printed one
  is from the 514-recipe pass and was never updated.
- **The five gaps** — gap 5 is closed by `hong-kong-milk-tea`, so the list is re-ranked rather
  than ticked, and the four that remain move up with one promoted from the runners-up.

Left alone: *What no single classifier could see*, *Shelving notes for the maintainer*,
*Recorded and not done*. Each is a claim about the collection that S-007 did not change, except
where a fact in it has moved — those are corrected in place and the correction is listed in
`review.md`.

**Rejected: deleting the "still describes the fifteen-counter shelf" apology and leaving the
prose.** The apology only exists because the tally was stale; rewriting the tally is what removes
it.

## 6. Verification strategy

Everything the criteria ask for is measured, not asserted:

- **Round-trip** — copy the tree to a scratch directory, run `menu-sections.mjs --write` there,
  diff the Cha Chaan Teng object against the real one. The copy absorbs the note-dropping that
  `--write` does to the eleven sections that carry `notes` elsewhere, so the diff is about this
  counter only.
- **No theft** — dump `(ingredient, aisle, winning pattern)` for all 1074 names before and after,
  and diff. Produced by a temporary test file under `src/lib/` that asserts its own
  reimplementation agrees with `aisleFor()` on every name; deleted before the last commit.
- **Renders** — `astro build`, then read `dist/menu/cha-chaan-teng/index.html` for the section
  headings and the item count, and `dist/index.html` for the counter cards.
- **Duplicates** — the three passes T-002-09 defined, run over both trees and diffed, so the
  finding is *what S-007 changed* rather than a re-litigation of 148 collisions.
- **The rest** — `npm run verify` end to end.
