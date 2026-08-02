# T-002-09 — Progress

All five planned steps complete. Two commits. No deviations from the plan; two things it
anticipated came true and are recorded below.

## Step 1 — take the four fried dishes off One Pot ✅

Edited one line in each of four files, `>> counters: Takeout Counter, One Pot` →
`>> counters: Takeout Counter`:

- `recipes/stir-fries/general-tsos-chicken.cook`
- `recipes/stir-fries/orange-chicken.cook`
- `recipes/stir-fries/sesame-chicken.cook`
- `recipes/stir-fries/sweet-and-sour-pork.cook`

Nothing else in any of them moved. Each keeps its `deep-fry` tag, its `aka` list, its pairings
and its Takeout Counter home.

```
  ok   recipes/stir-fries/general-tsos-chicken.cook  16 rows x 5 cols
  ok   recipes/stir-fries/orange-chicken.cook  15 rows x 5 cols
  ok   recipes/stir-fries/sesame-chicken.cook  16 rows x 5 cols
  ok   recipes/stir-fries/sweet-and-sour-pork.cook  10 rows x 5 cols
parsed 658 recipe(s) in 27 categories
```

Table shapes unchanged. Counter assignments 892 → **888**.

**Committed** `ed98111` — *Send the deep-fried four back to the takeout counter*.

## Step 2 — re-measure the three menus ✅

| Counter | Shelves | Sections | *Also* section | Names it and no other counter |
| --- | --: | --: | --- | --: |
| The Bowl Shop | 103 | 6 | none | 36 |
| Instant Pot | 25 | 5 | none | 25 |
| One Pot | **68** (was 72) | 4 | none | 14 |

`Skillet dinners` 16 → 12. As predicted, `menuFor()` dropped the four from the menu with no edit
to `counters.json`; the dry run flagged them as `listed but not shelved here` until step 4
corrected the gap note.

## Step 3 — the pressure evidence ✅

Every timer in all 25 `kit: Instant Pot` schedules, read through `src/lib/schedule.ts`:

**42 pressure-and-release tasks. Zero read as hands-on. All 42 carry `confidence: stated`** — the
author naming the timer, not an inference from the sentence.

| Variant | Pressure + release, as the timeline reads it | Elapsed | Plain sibling |
| --- | --- | --: | --: |
| `beef-stew-instant-pot` | 62 min unattended/stated · 6 min unattended/stated | 88 | `beef-stew` 135 |
| `pot-roast-instant-pot` | 110 min unattended/stated · 6 min unattended/stated | 136 | `pot-roast` 240 |
| `tonkotsu-broth-instant-pot` | 90 min + 30 min, both unattended/stated | 170 | `tonkotsu-broth` 570 |
| `congee-instant-pot` | 30 min + 20 min, both unattended/stated | 50 | `congee` 95 |
| `carnitas-instant-pot` | 72 min unattended/stated | 94 | `carnitas` 190 |

**Deviation from the ticket's diagnostic, and it is not a defect.** The ticket expected hands-on
time under pressure to be a fraction of the plain sibling's, and said that if it is not, the fix
is in `time.ts` or in a timer name. It is in neither: most plain siblings report **0** hands-on
minutes because their brown/soften/deglaze steps carry no timer at all (`timed: false`,
`untimedCount` 2–5). The pressure clock is right; the plain side never made a claim to compare
against. Writing times into those files to close the gap is the fabricated number the story
forbids, so it is recorded in `docs/gaps/instant-pot.md` instead, with the per-file untimed
counts, for whoever next has cause to open one.

## Step 4 — rewrite the three gap notes ✅

**`docs/gaps/one-pot.md`** — 72 → 68 and "fifty-eight shelved" → fifty-four in the lede, with a
paragraph on why the four came off; the four removed from *Skillet dinners*; a new **deep fry**
bullet under *What it could not stock*; "the fifty-seven that came off" → **sixty-one**, with the
four as a seventh group; and a new closing block, *Left open, for whoever reads this next*,
holding the `carnitas` / `chile-verde` broiler argument and the `counters.json` reconciliation.

**`docs/gaps/instant-pot.md`** — corrected "twenty-five of the thirty-one ranks are written" to
24 of 31 plus `gigantes-plaki` off the lower list; removed `gigantes-plaki` from *Also worth a
variant* and corrected 58 → 56 dishes; added a new section, **What the clock now reads**, with
the 42-task result, the five worked pairs, and the untimed-plain-sibling finding.

**`docs/gaps/bowl-shop.md`** — every number verified against `src/generated/recipes.json` and
none needed changing (103 = 12 + 16 + 36 + 7 + 24 + 8; 36 written, 67 shelved). Added a new
section, **What reading the whole shelf found**: pairings all resolve and are mutual; the bowls
sit at the collection-average 2.3 pairings each when this is the one counter where the pairing
*is* the dish; and the generic aliases (*grain bowl* on 10 of 12) cost the search box without
being duplicates.

**`docs/gaps/README.md`** — the `## Build state` paragraph only. It claimed 514 recipes and 666
tests; it now reports the measured 658 / 825 / 682 pages and says plainly that the tally table
below it still describes the fifteen-counter shelf and is left for T-003-07, which reads the
whole board after the S-003 shelves land.

**Verification** — `node scripts/menu-sections.mjs`, the same parser that folds these blocks back
into `counters.json`:

```
  ok   The Bowl Shop: 6 sections, 103/103 placed
  ok   Instant Pot: 5 sections, 25/25 placed
  ok   One Pot: 4 sections, 68/68 placed
```

No `unplaced`, no `listed but not shelved here`, no `unparsed` for any of the three.

**Anticipated deviation.** The same run reports `gap note has no "What it has" block` for The
Soup Pot, Japanese Home Cooking and The Slow Cooker. Those are the three S-003 counters; their
notes are T-003-06's work and were not written when this ran. Pre-existing and out of scope, as
the plan said to expect.

## Step 5 — full verification ✅

```
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories · counters: 658 named, 0 inferred · timers in 635 · pairings 760
Test Files  8 passed (8)      Tests  825 passed (825)
[build] 682 page(s) built
```

Built-page spot checks:

- `dist/menu/one-pot/` — **68** recipe links, four `<h2>` sections, no *Also*, zero occurrences of
  any of the four fried slugs.
- `dist/menu/bowl-shop/` — 103 links, six sections. `dist/menu/instant-pot/` — 25 links, five
  sections. Both unchanged.
- `dist/menu/takeout-counter/` — still carries `general-tsos-chicken`. Nothing was orphaned.
- Variant switch, both directions, three pairs: `beef-stew` ⇄ `beef-stew-instant-pot` (3-way),
  `carnitas` ⇄ `carnitas-instant-pot` (3-way), `congee` ⇄ `congee-instant-pot` (2-way).

**Committed** — *Say what the three new shelves are missing now*, covering the four docs.

## What was deliberately not done

- **`src/data/counters.json` and `src/data/aisles.json`** — declared owned by T-003-06, which had
  a live attempt open throughout this ticket. The One Pot menu is correct without them.
- **No file outside `recipes/` and `docs/` changed.** `time.ts`, `schedule.ts`, `counters.ts` and
  every test were checked and found correct.
- **The 19 files repeating one of their own `aka` values** (`tamagoyaki, tamagoyaki`) — cosmetic,
  and 18 of them are in the Japanese home wing T-003-06 is holding. Recorded for T-003-07.
- **`carnitas` and `chile-verde`** — argued in `one-pot.md` rather than decided quietly.
- **No new tests** — the properties are already pinned in `collection.test.ts` and `time.test.ts`;
  the rest were one-off audits over a snapshot.
