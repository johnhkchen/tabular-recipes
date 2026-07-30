# T-001-04 — Design

Fourteen new `.cook` files, all naming **Takeout Counter and nothing else**, working straight
down `docs/gaps/takeout-counter.md` from item 1 to item 10. Three questions had real options:
how many to write, where a stir-fry lives, and whether a component is a row or a table.

## Decision 1 — how many, and which

**Chosen: fourteen files, covering ranked items 1–10 in order.**

The arithmetic from Research: six shelved today, one exclusive. The criteria want ≥16 shelved
and ≥10 exclusive, so the floor is 10 new files with 9 exclusive. Options:

| Option | Files | Result | Verdict |
| --- | --- | --- | --- |
| A. Write to the floor | 10 | 16 shelved / 11 exclusive | meets the letter; leaves the soup section half-printed and stops mid-item-6 |
| B. **Ranked items 1–10** | **14** | **20 shelved / 15 exclusive** | **chosen** |
| C. Ranked items 1–20 | ~28 | every section printed | the ticket's own count target is 16; item 18 is an assembly and item 20 is a service model |

B is chosen because the criteria say the top dishes are written *"in that order, as far as
the count above reaches"*, and the ranked items do not divide neatly at ten. Item 6 is three
soups and item 2 is two chickens; stopping at exactly ten files would leave one soup written
and two not, which is the shape the whole story exists to fix. Ten is a floor, not a target.

C was rejected on the ticket's own numbers and on what the remaining items are: the pu pu
platter (18) is a tray of other finished tables, chow mein American-style (20) is explicitly a
steam-table service model, and the fortune cookie (19) is dessert at a counter that has none
of its mains yet. Those are a better second pass than a worse first one.

**The list, in ranked order:**

| Rank | File | Exclusive |
| --- | --- | --- |
| 1 | `general-tsos-chicken` | yes |
| 2 | `sesame-chicken`, `orange-chicken` | yes |
| 3 | `lo-mein` | yes |
| 4 | `beef-with-broccoli` | yes |
| 5 | `egg-rolls` | yes |
| 6 | `hot-and-sour-soup`, `egg-drop-soup`, `wonton-soup` | yes |
| 7 | `egg-foo-young`, `house-brown-sauce` | yes |
| 8 | `crab-rangoon` | yes |
| 9 | `sweet-and-sour-pork` | yes |
| 10 | `singapore-mei-fun` | yes |

**Item 12 (roast pork / char siu) is skipped: it is already written** and already names this
counter. **Item 10's plain "mei fun" is skipped**: it is the Singapore table with the curry
powder left out, which is the gap doc's own "sauce-across-proteins grid" objection — a table
that held both would be splitting the dish. Both skips are named again in `review.md`.

Everything is exclusive. No dish on this list appears in any other counter's gap doc (checked
in Research), the story assigns lo mein and the egg roll to this counter by name, and nothing
here is a component another counter is waiting on. Fifteen exclusive against a floor of ten
is deliberate headroom: if one file is later reshelved onto a second counter it costs nothing.

## Decision 2 — where a stir-fry lives

**Chosen: two new folders, `recipes/stir-fries/` and `recipes/noodles/`, plus a third,
`recipes/dumplings-and-rolls/`.**

Research established that `scripts/find-recipes.mjs` walks `recipes/` recursively and that
neither checker nor build validates a category string against a list, so a new folder is a
new category with no registration step and no edit outside `recipes/**`.

| Option | What it means | Verdict |
| --- | --- | --- |
| A. Force everything into existing folders | ten wok dishes into `stews-and-braises/` | rejected |
| B. One catch-all new folder (`takeout/`) | a folder named after a counter | rejected |
| C. **Three folders by what the thing is** | Stir-Fries, Noodles, Dumplings & Rolls | **chosen** |

A is the tempting one, because `char-siu` and `red-braised-pork-belly` already sit in
`stews-and-braises/`. But those are genuinely long-cooked. Filing a four-minute wok dish as a
braise would make the category a lie for six files at once, and `category` is what the site
groups and what the counter fallback reads.

B is rejected because the repo is deliberate about the split: `counters` is *where you would
buy it*, `category` is *what kind of thing it is*, and a recipe can sit at several counters
but has one category. A folder named `takeout` collapses the two, and would strand every
future counter that also sells a stir-fry.

C names the thing. Each of the three is a technique-and-form the collection is missing
wholesale, in `docs/gaps/README.md`'s own words: *"There are no dumplings and no noodle
dishes"*, *"Nothing is deep-fried."* Sibling tickets will want the same shelves — the Thai
Kitchen has pad thai and spring rolls, the Ramen Shop has ramen — so these folders are the
general answer, not this counter's private one. Distinct new files in a shared folder do not
collide, which is the story's own rule.

Category strings: `Stir-Fries`, `Noodles`, `Dumplings & Rolls`. Ampersand and title case
follow `Rice, Beans & Grains` and `Spice Blends & Marinades`.

Soups go in the existing `recipes/soups/` and the brown sauce in
`recipes/sauces-and-gravies/`. No argument there.

## Decision 3 — component as a row, or component as a table

The gap doc lists twelve components. The ranked list — which is what the acceptance criteria
actually point at — contains exactly one of them, item 7's *"egg foo young and its brown
gravy"*. The rest are supporting notes, not the work list.

**Chosen: one component table (`house-brown-sauce`), everything else as ingredient rows.**

This follows what the collection already does. `chicken-tikka-masala` lists `garam masala` as
a plain row even though `garam-masala.cook` exists; eight files list `chicken stock` as a row
and none of them points at a stock recipe. Cooklang gives this repo no sub-recipe reference —
verified across all 254 files — so a component and its dish are two independent tables linked
only by `pairs-with`. Writing a table per component would therefore not shorten a single dish;
it would only add files that duplicate rows.

`house-brown-sauce` earns its own table on the gap doc's reasoning — *"one table sits under a
dozen printed lines on this board"* — and because egg foo young's gravy is genuinely made
separately and ladled over. `beef-with-broccoli` then carries it as a single row, which is
what a cook with a jar of it in the fridge actually does, and pairs with it.

**Deliberately not written as tables:**

- **Velveting slurry** — it is four rows and a rest, and it is never made ahead. It is written
  *inside* `general-tsos-chicken`, `beef-with-broccoli` and `lo-mein` as step 1, which is
  where a cook meets it. The gap doc's point (that home cooks do not know to look it up) is
  served better by it being the first row of the dish they searched for than by a table nobody
  searches for.
- **Chicken stock** — `docs/active/work/T-001-01/review.md` records it as wanted by both the
  Deli and this counter and **owned by nobody**. Writing it here would race T-001-14 for the
  slug. It stays a row, as it is in eight existing files.
- **Wonton and egg roll wrappers** — shop-bought in every home version of these dishes, and a
  wrapper table would be a dough this ticket has no ranked call for.
- **Duck sauce, hot mustard, mandarin pancakes, crisp noodle strips** — ranked at items 11 and
  13, below where this ticket stops.

## Decision 4 — the wok, and honesty about it

`docs/gaps/takeout-counter.md` says a domestic hob is not a 100,000-BTU jet burner and that
*"the recipe should say which it is rather than pretend the char will arrive."* Every wok dish
here is written for a domestic hob: cook in **two batches**, get the pan properly hot, and do
not promise *wok hei*. This lands in the step text and in `tags` (`wok`, `quick`), not in a
disclaimer the table has nowhere to put.

## Decision 5 — the numbers, and `aka`

The gap doc is emphatic that `C1`–`C16` are not identifiers because they mean different dishes
at different shops, *"but it belongs in `aka`, where it is genuinely useful."* So combination
numbers go in `aka` only where they are near-universal (General Tso's as `C16`/`C12`, which
the gap doc names) and are always accompanied by the words. Every `aka` carries: the menu
spelling, an undiacriticked/ASCII form, and the Han characters where a shop prints them —
matching `char-siu`'s existing line. Examples: `general tso, general tsos chicken, general
gau, C16, 左宗棠鸡`; `mei fun, mai fun, rice vermicelli, 星洲炒米`.

## Consequences and risks

- **New categories will not print on the menu page** until T-001-17 puts the slugs into
  sections in `src/data/counters.json`. The recipes still shelve at the counter, because
  `counters:` is read per file and the counter has no category fallback to conflict with.
  Recorded for T-001-17.
- **New ingredients fall through `src/data/aisles.json`** — Shaoxing wine is already in the
  collection via `char-siu`, but oyster sauce, wonton wrappers, egg roll wrappers, rice
  vermicelli, dried wood ear, lily buds, chile bean paste and cream cheese are new. T-001-17's.
- **`src/lib/schedule.test.ts` is already red** from T-001-01. Nothing here is long enough to
  displace a ferment — the longest path on this board is a 30-minute marinate — so this ticket
  neither fixes nor worsens it.
- **The 16-row ceiling binds three files**: General Tso's, egg rolls and Singapore mei fun.
  Structure resolves each explicitly rather than discovering it during Implement.
