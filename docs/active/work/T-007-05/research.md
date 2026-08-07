# T-007-05 — Research

What exists, where, and how it connects. No proposals here.

Everything below was read or measured on the tree at `1b9f228`, with `npm run recipes` run first
so `src/generated/recipes.json` is current. Node is not on `PATH` by default in this session; it
lives at `~/.nvm/versions/node/v24.18.1/bin`.

---

## 1. The four files this ticket owns

| File | What it is | Who wrote it last |
| --- | --- | --- |
| `src/data/counters.json` | 21 counters. Hand-edited *and* machine-writable. | T-007-02 (One Pot section), T-007-01 (counter opened) |
| `src/data/aisles.json` | 14 aisles, 908 patterns, 44 pack sizes. | S-005 |
| `docs/gaps/cha-chaan-teng.md` | 326 lines. The work list, written **before** the shelf. | T-007-01 |
| `docs/gaps/README.md` | 199 lines. Tally, build state, five gaps, shelving notes. | T-003-07 era, patched by T-007-02 |

## 2. How a recipe gets onto a counter — the single mechanism

This is the finding that governs the whole ticket, so it is first.

`src/lib/counters.ts:73–91`, `menuFor()`:

```ts
const mine = all.filter((r) => r.counters.includes(counter.name));
const bySlug = new Map(mine.map((r) => [r.slug, r]));
...
items: items.map((slug) => bySlug.get(slug)).filter(Boolean)
```

`bySlug` is built from `mine` — recipes whose own `>> counters:` line names this counter.
A slug listed in `counters.json` that the recipe does not claim is looked up, missed, and
**dropped by `.filter(Boolean)`**. It never renders, and nothing errors.

`scripts/parse-recipes.mjs:100–106` says so in its own words:

> A note on a slug the section lists but the shelf does not carry is the quiet failure: menuFor
> drops the item (src/lib/counters.ts:81) and the note goes with it, silently.

and its error text at line 153 gives the only remedy: *"Give it a `>> counters:` line naming
{counter}."*

`counters.json` also carries `categories`, but `scripts/parse-recipes.mjs:71–73` applies it only
to a recipe with **zero** counters. Cha Chaan Teng's `categories` is `[]` by T-007-01's argument,
and every borrow candidate already names other counters, so that route is closed too.

**Measured consequence.** `One Pot` already lists four slugs it does not shelve —
`general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` — 77 listed
against 73 shelved. Those four are on the front page of `counters.json` and on no page of the
site. The mechanism the ticket calls "how a shelf borrows" is, in this codebase, the shape of an
existing silent bug.

## 3. State of the Cha Chaan Teng shelf

**22 recipes name the counter.** All 22 were created inside S-007; `git log --diff-filter=A`
dates every one to 2026-08-07 under T-007-03 and T-007-04. **None of them existed before this
story.**

```
drinks/            hong-kong-milk-tea yuenyeung iced-lemon-tea lemon-coke-with-ginger
                   horlicks red-bean-ice
flatbreads/        hong-kong-french-toast thick-toast
noodles/           luncheon-meat-and-egg-noodles satay-beef-noodles soy-sauce-pan-fried-noodles
rice-beans/        baked-pork-chop-rice minced-beef-rice pork-chop-in-tomato-sauce
                   shrimp-and-egg-rice
sandwiches/        hong-kong-egg-sandwich luncheon-meat-and-egg-sandwich pork-chop-bun
soups/             ham-macaroni-soup hong-kong-borscht
stews/             curry-beef-brisket swiss-wings
```

All 22 are **only** at this counter. `counters.json` gives the counter seven section titles and
**zero** items, so `menuFor` falls through to its catch-all and every dish would print under
*Also*.

The seven titles, in T-007-01's order: *The set meals (常餐 · 早餐 · 下午茶餐)* · *The drinks
counter* · *Toast and the bun case* · *Macaroni, noodles and things in soup* · *Rice plates* ·
*Sandwiches and buns* · *Also here*.

Two of those seven can hold nothing written. The set is not a dish — T-007-01's own *what a table
cannot hold* says so ("常餐 is not a dish, it is a rule"). *Also here* is the catch-all the
acceptance criteria forbid rendering.

## 4. The borrow candidates

`>> counters:` lines, read directly:

| Slug | Names | T-007-01's verdict |
| --- | --- | --- |
| `egg-custard-tart` | Dim Sum Counter, Bakery | shelve as is |
| `pineapple-bun` | Bakery, Dim Sum Counter | shelve as is |
| `club-sandwich` | Diner, Deli | shelve as is |
| `beef-chow-fun` | Dim Sum Counter | shelve as is |
| `char-siu` | Dim Sum Counter, Takeout Counter, Phở & Bánh Mì, The Bowl Shop | shelve as is |
| `lo-mein` | Takeout Counter | **do not shelve** |

None names Cha Chaan Teng. Combined with §2, listing them in `counters.json` records the borrow
in the data and shows nothing on the page. Editing their `>> counters:` lines is the only thing
that would render them, and the last acceptance criterion forbids editing any `.cook` file.

## 5. What T-007-02 actually rehomed

`git show 88ca990` — eight soups, and the destinations are unambiguous:

- **One Pot** ×5: `century-egg-amaranth-soup`, `crucian-carp-tofu-soup`,
  `mustard-greens-tofu-soup`, `seaweed-egg-drop-soup`, `tomato-potato-beef-soup`
- kept where they already were ×3: `congee`, `congee-instant-pot`, `egg-drop-soup`

**Nothing was rehomed onto Cha Chaan Teng.** The ticket's conditional — *"if it put a 滾湯 in the
餐湯 slot"* — did not happen. The 餐湯 slot is filled instead by `hong-kong-borscht`, written by
T-007-04, which carries `餐湯` in its own `aka` line.

The same commit added a fifth One Pot section, *Quick soups that go with dinner* (5 items), to
`counters.json` **without** adding it to `docs/gaps/one-pot.md`. That is why
`scripts/menu-sections.mjs` currently reports `One Pot: 4 sections, 68/73 placed` with five
unplaced slugs. `docs/gaps/one-pot.md` is not owned by this ticket.

## 6. Aisles: how resolution works and what is unresolved

`src/lib/shopping.ts`:

- `soldAs()` strips home preparation, keeps shop preparation (`SOLD_THAT_WAY`, `GROUND_IS_THE_PRODUCT`).
- `aisleFor()` scores every pattern in **every** aisle by `words × 1000 + length` and takes the
  single highest. Ties break on aisle order in the file, first wins.
- An aisle's `except` list removes a name from that aisle before scoring.
- `purchaseOf()` returns `null` rather than convert across measurement systems.

`src/lib/shopping.test.ts` → *"finds an aisle for nearly everything, and reports what is left"*
prints the gaps and asserts `< 2%`. Current output:

```
5/1074 ingredients have no aisle:
  tinned luncheon meat (2), satay sauce (1), flat skewers (1),
  oak or hickory wood (1), metal skewers (1)
```

Three of the five are cookware written into ingredient lists and are already recorded in
`docs/gaps/README.md` under *Shelving notes for the maintainer*. **Two are real products**, both
from this shelf.

### Already covered, contrary to the ticket's expectation

The shelf's other "never seen before" tins and packets all resolve today:

| Name as written | Aisle | Winning pattern |
| --- | --- | --- |
| `evaporated milk` | `dairy` | `evaporated milk` |
| `sweetened condensed milk` | `baking` | `sweetened condensed milk` |
| `instant noodles` | `dry-goods` | `noodles` |
| `golden syrup` | `baking` | `golden syrup` |
| `malted milk powder` | `baking` | `malted milk powder` |
| `loose-leaf Ceylon black tea`, `Ceylon tea bags` | `drinks` | `tea` |

`custard powder` is a pattern in `baking` (twice, alongside `birds custard powder`) but no recipe
on this shelf uses it — nothing on the counter needs it.

**Condensed and evaporated already resolve to different patterns.** `dairy.except` carries
`condensed milk` and `sweetened condensed milk`, which takes them out of the cold case; `baking`
claims both. `dairy` and `baking` *both* carry the identical pattern `evaporated milk`, so that
one is decided by a tie on file order — `dairy` is index 4, `baking` index 6.

### Two ingredients on this shelf land in the wrong place

- `chili garlic sauce` → **`produce`**, on the pattern `garlic` (1 word). It is a jar. Used by
  `satay-beef-noodles` and nothing else in the collection.
- `Hong Kong milk tea` → **`dairy`**, on the pattern `milk`. It is a sub-recipe reference written
  as an ingredient in `yuenyeung`. The collection's convention for these is a pattern of their
  own: `char siu` → `butcher`, `pizza dough` → `bakery`, `corn tortillas` → `bakery`.

### The Soup Pot's dead patterns steal nothing

The dried-goods patterns left behind are `honey date`, `honey dates` (`dry-goods`) and
`dried scallop`, `dried lily buds`, `job's tears`, `lily bulb`, `fox nut`, `apricot kernels`,
`Solomon's seal`, `adenophora root`, `overlord flower` (`world`). Two of them —
`dried scallop`, `dried lily buds` — still win for live ingredients elsewhere and are not dead.
The rest match nothing in the collection and cost nothing.

## 7. The whole-collection numbers

Baseline is the tree at `096b1d4`, the commit S-007 started from, rebuilt from source in a
scratch checkout.

| | S-007 start (`096b1d4`) | now (`1b9f228`) |
| --- | --: | --: |
| recipes | 658 | 664 |
| categories | 27 | 27 |
| counter assignments | 901 | 904 |
| counters in `counters.json` | 21 (incl. The Soup Pot) | 21 (incl. Cha Chaan Teng) |
| counters with something on them | 21 | 21 |
| pairings (mutual) | 760 | 770 |
| files with timers | 635 | 640 |
| files declaring `washing-up` | 0 | 11 |
| orphans / inferred counters / duplicate slugs | 0 / 0 / 0 | 0 / 0 / 0 |

658 − 16 deleted + 8 (T-007-03) + 14 (T-007-04) = **664**, which is the arithmetic the ticket
asks for.

### The tally in `docs/gaps/README.md`

Fifteen rows, no Bowl Shop, no Instant Pot, no One Pot, no Slow Cooker, no Japanese Home Cooking,
no Cha Chaan Teng, and a Soup Pot that no longer exists is absent from it as well. Line 45 admits
it: *"The tally below … still describe the fifteen-counter shelf."*

Its columns were re-derived to check the method before rewriting anything. **Recipes**, **Missing
dishes** (numbered `**` items under `## What it is missing`) and **Missing components** (`- **`
bullets under `## Components it would need`) reproduce all fifteen rows exactly. **Only here**
does not: the file says Curry House 47, Deli 24, Diner 35; counted as *recipes at exactly one
counter* they are 31, 17, 29. That column is stale, from the 514-recipe pass.

Line 37 is the one current sentence in the section: *"The board is 21 counters, 20 of them with
something on them; Cha Chaan Teng is the empty one and T-007-05 fills it."* The ticket's phrase
"twenty counters" is that count. After this ticket it is 21 counters, 21 of them stocked.

### The five gaps

Gap 5 is *"A drink that is brewed"*. `hong-kong-milk-tea`, `yuenyeung` and `iced-lemon-tea` all
brew, so it is closed. Gaps 1–4 (pickle folder move, tag checker, shared chile purée, buttercream
and cream-cheese frosting) are untouched by S-007. The named runners-up are dark roux and trinity,
the Vietnamese baguette, wor tip, cebolla y cilantro, youtiao.

## 8. The duplicate-name check, as T-002-09 defined it

Three passes, plus alias collisions read separately. Re-run over both trees:

| Pass | S-007 start | now | delta |
| --- | --: | --: | --- |
| alias collisions (title + `aka`, folded) | 149 | 148 | −`lo fo tong`, −`老火湯`, +`french toast` |
| multi-file `dish:` keys | 32 | 32 | unchanged; all declared kit families |
| ingredient overlap ≥ 0.60, variants excluded | 97 | 98 | +`baked-pork-chop-rice` ~ `pork-chop-in-tomato-sauce` (0.61) |

The sixteen 老火湯 files leaving took both their shared aliases with them. S-007 introduced
exactly **one** new alias collision and **one** new near-duplicate pair.

## 9. Pages and layout

`src/pages/index.astro` is the front door and the menus index — there is no second index page;
`list.astro`'s "All counters" is a back link to `/`. It renders `menus(all)`, which drops any
counter with `count === 0`, into `ul.counters`.

`src/styles/site.css:356–360`:

```css
.counters { display: grid; grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr)); }
```

`auto-fill` with a min track width — no fixed column count, no `nth-child` rules on the counter
cards, so the card count changes nothing structurally. The comments at lines 416 and 573 already
say "21 counters", written when The Soup Pot was one of them; the board is 21 again with Cha
Chaan Teng on it. T-004-03 owns this file and nothing here needs it changed.

`/menu/soup-pot` cannot build: `getStaticPaths` in `src/pages/menu/[counter].astro` maps over
`counters` from `counters.json`, which no longer contains it.

## 10. Constraints this ticket works under

1. Writable: `src/data/counters.json`, `src/data/aisles.json`, `docs/gaps/cha-chaan-teng.md`,
   `docs/gaps/README.md`, `docs/active/work/T-007-05/**`. Nothing else, and **no `.cook` file**.
2. `scripts/menu-sections.mjs --write` rewrites **every** counter's sections and drops every
   hand-written `notes` block in the file. It must not be run with `--write`.
3. A section in `counters.json` with an empty `items` list cannot be produced by
   `menu-sections.mjs` — it only emits sections where `found.length` is non-zero. For the dry run
   to reproduce the file, every section in `counters.json` must be non-empty.
4. `src/components/Timeline.astro` and `src/pages/[slug].astro` are modified in the working tree
   by something outside this ticket. They must be left alone.
5. `docs/gaps/soup-pot.md` still exists and is meant to; `menu-sections.mjs` iterates counters,
   not gap files, so an orphan gap note is inert.
