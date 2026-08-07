# T-007-02 — Research

What exists, where it lives, and what actually holds The Soup Pot together. Descriptive only; the
argument for the cull is in `docs/active/stories/S-007-a-counter-you-can-shop-for.md` and is not
re-opened here.

## 1. The counter, and the one file that knows it exists

`src/data/counters.json` is 2065 lines, one `counters` array, 22 entries. The Soup Pot is entry 19
of 22, `src/data/counters.json:1745-1856`:

```
"name": "The Soup Pot", "slug": "soup-pot",
"blurb": "Put it on, leave it alone for three hours, and it gets better.",
"categories": [],          <- no fallback claim
"sections": [ 4 sections ]
```

Its four sections, and their item counts as the file has them:

| Section | Items | Notes attached |
| --- | --: | --: |
| `Old-fire soups (老火湯)` | 16 | 10 (2 section-level, 8 with `of:`) |
| `Quick daily soups (滾湯)` | 6 | 4, all with `of:` |
| `What each thing is for` | **0** | 0 |
| `Congee and rice soups` | 2 | 0 |

The empty third section renders as nothing — `menuFor()` (`src/lib/counters.ts:75-88`) filters
sections with no items — so it has never been visible on the site. It is a heading that was
carried over from the gap page's glossary and never filled.

**Nothing else in `src/` or `scripts/` names the counter.** Verified: `grep -rn "soup-pot\|Soup
Pot" src/ scripts/` returns exactly two lines, both inside `counters.json` (the `name` and the
`slug`). `src/pages/menu/[counter].astro:11-17` builds its paths from `counters` filtered by
`menu.count > 0`, so removing the entry removes `/menu/soup-pot` with no other edit. `src/lib/
icons.ts` has no per-counter map. The front page and menus index read `menus(all)` the same way.

`docs/knowledge/counters.md` has **no Soup Pot section** and no mention of the counter at all —
`grep -rn "Soup Pot" docs/knowledge/` is empty. Its Contents table lists 16 of 22 counters; the six
S-002/S-003 counters (Bowl Shop, Instant Pot, One Pot, Soup Pot, Japanese Home, Slow Cooker) never
got rows. So the ticket's conditional — *"the pointer in `docs/knowledge/counters.md` if it names
the counter"* — resolves to **no edit**. That file does carry the new `## Cha Chaan Teng` section
T-007-01 wrote (`docs/knowledge/counters.md:793-878`).

## 2. How a recipe reaches a counter, and what "orphan" means mechanically

`scripts/parse-recipes.mjs` is the only place that sees the whole collection at once.

1. Every `>> counters:` name is checked against `counters.json`; an unknown name **throws**
   (`parse-recipes.mjs:60-68`). `scripts/check-recipes.mjs:26-31` checks the same thing per-file so
   a typo surfaces without a full build.
2. A recipe naming **no** counter inherits every counter whose `categories` list contains its
   category (`parse-recipes.mjs:70-77`) and is flagged `countersInferred`.
3. A recipe that still has zero counters throws as *"sit at no counter"* — that is the literal
   orphan check. `src/lib/collection.test.ts:26-29` asserts the same property from the built JSON.

**The `Soups` fallback goes to the Diner**, and only there — the eight counters with a non-empty
`categories` list are Bakery, Panadería, Curry House, Shawarma Counter, Pizzeria, Deli, Diner and
Meat and Three, and Diner claims `['Flatbreads & Pancakes', 'Soups', 'Custards & Puddings']`.

This matters for a rule the ticket offers but the board contradicts. The ticket permits leaving a
soup to fall through the fallback. The collection today reports **`0 inferred from category`**, and
T-007-05's acceptance criteria (`docs/active/tickets/T-007-05-shelve-it-and-read-it.md:107-109`)
require `0 counters inferred from category` after this story. Falling through would therefore make
this ticket hand T-007-05 a criterion it cannot meet. Constraint recorded, decided in Design.

## 3. Baseline, measured rather than quoted

`npm run verify` = `check-recipes` → `parse-recipes` → `vitest run` → `astro build`. Run clean on
the tree as inherited:

```
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories
  counters: 658 named, 0 inferred from category · timers in 635 · pairings 760
Test Files  9 passed (9)   Tests  833 passed (833)
682 page(s) built
```

901 counter assignments across 22 counters (21 with items; Cha Chaan Teng is at 0 and therefore
renders nothing, which T-007-01 recorded as correct). Per-counter, the numbers this ticket can move:

| Counter | Items today |
| --- | --: |
| The Soup Pot | 24 |
| One Pot | 68 |
| Takeout Counter | 20 |
| Dim Sum Counter | 30 |
| Instant Pot | 25 |
| Cha Chaan Teng | 0 |

Note `docs/gaps/README.md` quotes 888 assignments and 825 tests in 8 files. Both were already stale
before this ticket — T-007-01's review flagged the test drift. Today's numbers are 901 and 833/9.

## 4. The sixteen, and whether anything points at them

All sixteen exist in `recipes/soups/` (folder holds 66 `.cook` files). Checked every slug against
the whole tree with `grep -rl`, excluding `node_modules`, `dist`, `.git`, `.lisa`:

- **No `.cook` file references any of them.** No `>> pairs-with:` anywhere in `recipes/` points at
  a Soup Pot slug — the full `pairs-with` sweep of `recipes/` was read line by line.
- **No file under `src/`** except `src/data/counters.json` and the gitignored, rebuilt
  `src/generated/recipes.json`.
- **No file under `docs/knowledge/`.**

Two live references outside those, and neither is a build input:

- **`scripts/measure-pages.mjs:6` and `:30`** name `ching-bo-leung-soup` — once as the `--slug`
  usage example, once inside the header comment recording the S-005 baseline (*"max 6219 (story:
  6223, ching-bo-leung-soup, and it is the same page)"*). That script reads built HTML, writes
  nothing, and its own header says it stays out of `npm run verify` (`measure-pages.mjs:11-13`).
  A missing page makes the `--slug` example print nothing; it does not fail. The baseline note is
  a historical measurement of a tree at commit `1ae1165` and stays true of that tree.
- **`docs/gaps/voice.md`** cites `dried-bok-choy-pork-lung-soup` (line 94), `ching-bo-leung-soup`
  (line 237) and `corn-carrot-pork-bone-soup` (line 275) as worked examples in a record of past
  measurements.

Neither file is in this ticket's permitted-modification list. Both are records of something that
was true when written. Carried to Review as findings, not edits.

## 5. The eight survivors, exactly as they stand

Read from the files. Every `>> counters:` line is line 4.

| Slug | `>> counters:` today | Time | Category |
| --- | --- | --- | --- |
| `tomato-potato-beef-soup` | `The Soup Pot` | 45 min | Soups |
| `seaweed-egg-drop-soup` | `The Soup Pot` | 15 min | Soups |
| `mustard-greens-tofu-soup` | `The Soup Pot` | 30 min | Soups |
| `crucian-carp-tofu-soup` | `The Soup Pot` | 40 min | Soups |
| `century-egg-amaranth-soup` | `The Soup Pot` | 20 min | Soups |
| `egg-drop-soup` | `Takeout Counter, The Soup Pot` | 15 min | Soups |
| `congee` | `Dim Sum Counter, One Pot, The Soup Pot` | 1 hr 45 min | Soups |
| `congee-instant-pot` | `Instant Pot, The Soup Pot` | 1 hr 15 min | Soups |

The first five orphan the moment the counter goes. The last three do not.

What the five actually do, from their own step lines — this is what any rehoming has to be honest
against:

- `tomato-potato-beef-soup` — fry tomatoes down in oil 8 min, boil 20 min with potatoes, beef in
  for 2 min. One pot start to finish.
- `seaweed-egg-drop-soup` — boil water with dried shrimp 5 min, laver 1 min, egg off the boil.
- `mustard-greens-tofu-soup` — fry ginger 2 min, boil 10 min with greens, pork and tofu 4 min.
- `crucian-carp-tofu-soup` — fry the fish golden 8 min **in the same pot**, boil hard 20 min until
  white, tofu 3 min. The fry and the boil sharing one vessel is the whole method.
- `century-egg-amaranth-soup` — fry garlic 2 min, boil 5 min with century eggs, amaranth 3 min.

All five: one vessel, one wash, 15 to 45 minutes, every ingredient a supermarket carries.

## 6. What One Pot is, and what its board already says

`src/data/counters.json:1645-1744`. Blurb: *"Everything goes in one pan, and that is the only pan
to wash."* `categories: []`. Four sections: `Braises and stews` (36), `Skillet dinners` (16),
`Rice and grains that cook in` (11, and `congee` is already one of them), `Soups that are the whole
meal` (9 — gumbo, sancocho, minestrone, harira, split-pea-soup, new-england-clam-chowder, borscht,
black-bean-soup, wonton-soup). No `notes` anywhere in the One Pot entry.

**One Pot's sections already drift from its gap page.** `node scripts/menu-sections.mjs` reports
`One Pot: 4 sections, 68/68 placed` with `Skillet dinners (12)`, while `counters.json` lists 16.
The four extra — `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` —
each carry `>> counters: Takeout Counter` only, so `menuFor()` drops them at render and the parser
drops them on read. `docs/gaps/README.md`'s claim that the parser *"reproduces that file byte for
byte"* is therefore **already false for One Pot**, before this ticket touches anything. T-007-01
recorded the same claim breaking for Cha Chaan Teng.

`docs/gaps/one-pot.md` is **not** in this ticket's permitted-modification list.

## 7. What the Cha Chaan Teng work list actually asked for

The ticket says T-007-01's work list will have said whether it wants a 滾湯. It said no, twice:

- `docs/gaps/cha-chaan-teng.md:250-252`, under **What a table cannot hold**: *"例湯, the soup of the
  day. Literally whatever the kitchen boiled that morning, and it changes daily. It is the third
  option in the 快餐's soup choice and **there is nothing to draw**."*
- Its ranked list of 24 has no 滾湯 in it. The board's soup slot is `火腿通粉` (rank 7) and `羅宋湯`
  (rank 9), and rank 9 is explicitly a **new file** that must say it is not `borscht`
  (`cha-chaan-teng.md:90-92`, `:201`). `docs/knowledge/counters.md:875` records 例湯 the same way.

The counter's seven section titles are all empty item lists and T-007-05 fills them. T-007-05's
criteria require Cha Chaan Teng to render **no "Also here" section** — which means any recipe this
ticket shelved there without T-007-05 listing it in a section becomes a criterion failure for a
ticket that cannot edit `.cook` files.

## 8. `docs/gaps/soup-pot.md` — what is in the 405 lines

| Lines | What it is | Ticket's disposition |
| --- | --- | --- |
| 1-30 | Opening: the 44-files-and-no-老火湯 finding, the clock claim, the register rule | Superseded |
| 32-66 | `## What it has` — the machine-read block, three section headings with slugs | Superseded |
| 69-143 | `## What each thing is for` — 19-row dried-goods glossary, the bodies, the season, **the four rules of the pot**, and the 老火湯/滾湯/燉湯 distinction | **Keep intact** |
| 146-292 | `## What it is missing` — the ranked 18 + 10 + 4 unwritten soups | **Goes** |
| 295-325 | What T-003-07's whole-collection read found | Superseded |
| 328-349 | `## Components it would need` | Superseded |
| 352-375 | `## What it could not stock` — includes the substitution rule S-007 quotes | Source material for the new record |
| 378-405 | `## Where this came from` — 8 cited sources | **Keep** |

The `## What it has` heading is what `scripts/menu-sections.mjs` reads (`menu-sections.mjs:29-34`).
Once the counter is gone from `counters.json`, the script iterates `COUNTERS` and never looks for a
`soup-pot.md`, so the heading can go without breaking it.

## 9. `docs/gaps/README.md` — what is actually in it

**There is no Soup Pot row.** The tally is the fifteen-counter table (Bakery through Phở & Bánh Mì,
total 623) and the file says so in its own words: *"The tally below … still describe the
fifteen-counter shelf"*, deferred to T-003-07 and never done. `grep -n "Soup Pot\|soup-pot"
docs/gaps/README.md` is empty.

So the criterion *"`docs/gaps/README.md`'s tally no longer counts The Soup Pot as a live counter"*
is satisfied by the file as it stands, and *"update the row"* has no row to update. What the file
does carry that this ticket falsifies is its **Build state** block — 658 files, 658 recipes, 682
pages — and its framing of `docs/gaps/*.md` as *"one page per counter"*, which stops being true the
moment `soup-pot.md` describes a counter that no longer exists.

T-007-05 owns this file and its criteria require the full twenty-counter rewrite, including *"The
Soup Pot's row is gone"*. That is the same criterion from the other side, and it is theirs.

## 10. Constraints this ticket is boxed in by

1. **Only `>> counters:` may change in the eight.** Every other line, including `>> aka:` lines
   carrying `滾湯, gwan tong`, stays.
2. **Permitted files**: `src/data/counters.json`, the sixteen deletions, the eight `>> counters:`
   lines, `docs/gaps/soup-pot.md`, `docs/gaps/README.md`, `docs/knowledge/counters.md` *if it names
   the counter* (it does not).
3. **`lisa commit-ticket` only**, exact `--include` paths, no ordinary index.
4. **`0 inferred from category` is a live invariant** the next ticket is graded on.
5. **A section note in `counters.json` cannot point at a slug the section does not shelve** —
   `parse-recipes.mjs:139-152` throws. Every one of the 14 Soup Pot notes dies with its section, so
   this is only a hazard if a note were moved rather than deleted.
6. **`docs/gaps/one-pot.md` is not writable here**, so any One Pot section change widens a drift
   that already exists and has to be handed on rather than fixed.
