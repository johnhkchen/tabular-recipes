# T-002-09 — Research

Reading the whole collection as one shelf, after eight tickets each saw one corner. Descriptive
only: what is here, where, and how it connects.

## The shelf as it stands

`npm run verify` passes end to end today, before any change:

| Leg | Result |
| --- | --- |
| `npm run check` | `all 658 file(s) draw a table.` |
| `npm run recipes` | 658 recipes into `src/generated/recipes.json`, no warnings |
| `npx vitest run` | 8 files, **825 tests**, all green |
| `astro build` | **682 pages** built |

658 recipes across 27 categories, **892 counter assignments**, **760 mutual pairings**,
**3,375 `aka` values**, 101 files carrying a `slack:` line, 635 carrying a timer. 144 recipe
files were added during S-002 (`e9d9e7c..HEAD`), taking the collection from 514 to 658.

## The moving parts this ticket touches

| Path | What it decides |
| --- | --- |
| `recipes/<category>/*.cook` | Source of truth. `>> counters:`, `>> dish:`, `>> kit:`, `>> aka:`, `>> pairs-with:` all live here. |
| `scripts/parse-recipes.mjs` | Throws when two files share a `dish:` and neither names a `kit:`; resolves `pairs-with` and makes it mutual; validates counter names. |
| `src/lib/collection.test.ts` | The cross-file invariants: unique slugs, no homeless recipe, no unknown counter, pairings resolve / are mutual / are not self, variants agree on their dish, one plain way per dish. |
| `src/lib/time.ts` | The vocabulary that decides hands-on vs walk-away. T-002-01 added the pressure words. |
| `src/lib/schedule.ts` | Reads every timer in a step against the words that belong to it, and sums `handsOnMinutes` / `unattendedMinutes` / `assumedHandsOnMinutes`. |
| `src/lib/counters.ts` | `menuFor()` — intersects a counter's section lists with the recipes that actually name it. |
| `src/data/counters.json` | The counters and their ordered menu sections. |
| `scripts/menu-sections.mjs` | Lifts the `## What it has` block out of `docs/gaps/<slug>.md` back into `counters.json`. **The gap note is upstream of the menu.** |
| `docs/gaps/*.md` | 21 files, one per counter, plus a README. |

## 1. The variant pairs

**45 files declare a `kit:`** — 25 `Instant Pot`, 20 `Slow Cooker`. Every one of the 45 names a
`dish:` that resolves to exactly one plain (kit-less) sibling on the shelf. There are **zero
lonely variants** and **zero dishes with two plain ways**; `parse-recipes.mjs` would have thrown
for the second and `collection.test.ts` asserts both.

32 dish keys now have more than one file under them. The switch renders in both directions —
spot-checked in `dist/` for `beef-stew` (3-way), `carnitas` (3-way) and `congee` (2-way); the
plain page lists its kits by name and each kit page lists its siblings plus *the plain way*.

The 25 Instant Pot files sit in five menu sections: 13 braises, 5 bean pots, 5 stocks, 1
porridge, 1 big cut. All 25 name `Instant Pot` and no other counter — a kit shelf is exclusive
by construction, because a variant names its counter in the file it is written in.

## 2. What the clock says about pressure

The four pressure words the writers used are `~pressure cook` (29 uses), `~natural release`
(25), `~come to pressure` (13) and `~quick release` (4). `time.ts` normalises a timer name by
lowercasing and stripping spaces and hyphens, so all four land in `UNATTENDED` and read with
`source: 'name'` — the author saying it outright, not an inference.

Scanning every task in all 25 Instant Pot schedules for a timer whose label mentions pressure or
release and that reads `hands-on`: **none**. Total elapsed is a fraction of the plain sibling's
in every pair (e.g. `ful-medames` 810 → 65 min, `chicken-broth` 675 → 90, `carnitas` 190 → 94).

One thing the numbers will not show, and it is not a bug in `time.ts`: most plain siblings report
`handsOnMinutes: 0`, because their brown/soften/deglaze steps carry **no timer at all**
(`timed: false`, 0 minutes, counted in `untimedCount`). The Instant Pot files time those steps;
the plain files do not. So "hands-on is a fraction of the plain version's" cannot be read off the
data — not because pressure is mis-read, but because the plain side never made a claim.
`schedule.ts` is explicit that it will not fill that gap with a plausible number.

## 3. Whether a dish got written twice

Three independent passes, none of which found a duplicate dish:

- **By `dish:` key** — 32 keys hold more than one file, and every one of those groups is a
  declared kit family.
- **By normalised title** — after stripping stopwords and the kit words, every collision is a
  variant family. No two unrelated files normalise together.
- **By ingredient overlap** (Jaccard ≥ 0.60 over `ingredientNames`, variants excluded) — 100
  pairs, all of them baking staples sharing flour/sugar/butter/egg, or pairs already argued in
  their own tickets (`salsa-verde`/`salsa-verde-cruda`, `general-tsos-chicken`/`sesame-chicken`,
  whose file says outright it is the same glaze with the chile gone). **None of the 144 new
  files appears in this list against an older file.**

`aka` collisions are real but almost all benign. Two shapes:

- **Variant families sharing their aliases** — `carnitas` / `carnitas-instant-pot` /
  `carnitas-slow-cooker` all answer to *taco de carnitas*. Correct: a searcher who wants carnitas
  should be offered all three tables.
- **Generic category words on the bowls** — *grain bowl* is on 10 of the 12 bowls, *power bowl*
  on 8, *rice bowl* on 6. Not a duplicate-dish signal; a search-quality one.

Two smaller things, both outside this ticket's blast radius:

- 19 files repeat one of their own `aka` values verbatim (`tamagoyaki, tamagoyaki`). Cosmetic.
  All but one are in the Japanese home wing, which **T-003-06 is holding right now**.
- `braised-short-ribs-instant-pot` and `braised-short-ribs-slow-cooker` both answer to *braised
  beef short ribs* and the plain `braised-short-ribs` does not.

## 4. Pairings

`collection.test.ts` asserts all three properties and they pass: **0 dangling slugs, 0 one-way
edges, 0 self-pairings** across 760 mutual edges. The bowls and salads sit at 2.3 pairings each,
which is exactly the collection average — the ticket's expectation that they lean on `pairs-with`
harder than anything before is not borne out, but nothing is broken either.

## 5. The three menus, read as menus

| Counter | Shelves | Names it and no other counter | Sections |
| --- | --: | --: | --- |
| The Bowl Shop | 103 | 36 | 6 |
| Instant Pot | 25 | 25 | 5 |
| One Pot | 72 | 14 | 4 |

None of the three renders an *Also* section — every recipe on each counter is placed in a named
section.

**The Bowl Shop** reads cleanly in the boards' own build order: base, greens, toppings, roasted
vegetables, dressing last, then soups. Nothing on it belongs elsewhere.

**Instant Pot** reads cleanly. Two sections hold one item each (*Rice, grains and porridge* →
`congee-instant-pot`; *Whole birds and big cuts* → `corned-beef-instant-pot`), and the second
heading promises a bird the shelf does not have.

**One Pot** has four items that wandered in from the Takeout Counter. `general-tsos-chicken`,
`orange-chicken`, `sesame-chicken` and `sweet-and-sour-pork` are each **four cups of peanut oil,
double-fried in two batches, drained on a rack, with the glaze stirred smooth in a separate
bowl** before the wok is used again. `abba20f` (T-002-08) added `One Pot` to all four; they
survived its filter because their `cookware` line declares only `wok`, which is the exact failure
mode `docs/gaps/one-pot.md` warns about in its own opening ("that line turned out to be evidence
rather than an answer").

Two adjacent cases that are arguable rather than wrong: `carnitas` and `chile-verde` both declare
a `broiler` alongside their Dutch oven. Carnitas puts its own pot under the broiler; chile-verde
chars its chiles there first, which is the same shape that kept `birria-de-res` off this shelf.

`jollof-rice` carries the `one-pot` tag and is not on the counter — deliberately: `one-pot.md`
lists it under *A jug blender, food processor or mortar*, a whole component made outside the pot.

## 6. The gap docs

`docs/gaps/bowl-shop.md`, `instant-pot.md` and `one-pot.md` were **already rewritten by T-002-08**
(`ac9236e`) against the current shelf, in the before/after shape the other eighteen use. They are
substantially right. What is stale in them is narrow:

- `one-pot.md` lists the four fried takeout dishes under *Skillet dinners*, and its counts (72,
  "fifty-eight shelved") follow from that.
- `instant-pot.md` says "twenty-five of the thirty-one ranks below are written". 24 of the 31
  ranks are written; the 25th variant (`gigantes-plaki`) comes from the lower *Also worth a
  variant* list, where it is still listed as unwritten.
- `docs/gaps/README.md` still reports the 514-recipe build state and a tally table with fifteen
  counters, three fewer than exist.

## 7. Constraints on this ticket

**`src/data/counters.json` is held by a live ticket.** T-003-06 (`shelve-the-home-wing`) states
outright that it owns `counters.json` and `aisles.json`, and it has an open attempt directory
created in the same minute as this one. The ticket text for T-002-09 says nothing is running
alongside it; the DAG says otherwise, because T-003-06 depends only on T-002-08.

This matters for the One Pot fix. `menuFor()` intersects each section's slug list with the
recipes that actually name the counter, so **dropping `One Pot` from a recipe's `counters:` line
is enough to take it off the menu** — the leftover slug in `counters.json` renders nothing. The
menu can be corrected without touching the contended file.
