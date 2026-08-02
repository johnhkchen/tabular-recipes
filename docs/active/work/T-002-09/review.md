# T-002-09 — Review

Read 658 recipes as one collection. Found one defect, fixed it, and wrote down four things the
next pass should not have to re-derive. Two commits, eight files, no code changed.

## What changed

| File | Change | Why |
| --- | --- | --- |
| `recipes/stir-fries/general-tsos-chicken.cook` | `>> counters:` drops `One Pot` | Four cups of peanut oil, double-fried in two batches, a dredging bowl, a draining rack and a second bowl for the glaze. Not one pot. |
| `recipes/stir-fries/orange-chicken.cook` | same | same |
| `recipes/stir-fries/sesame-chicken.cook` | same | same |
| `recipes/stir-fries/sweet-and-sour-pork.cook` | same | same |
| `docs/gaps/one-pot.md` | Counts corrected 72 → 68; four removed from *Skillet dinners*; new *deep fry* rejection with the reason; *fifty-seven* → *sixty-one that came off*; new closing block for what is left open | The shelf changed, and the page is upstream of the menu via `menu-sections.mjs` |
| `docs/gaps/instant-pot.md` | Rank arithmetic corrected; `gigantes-plaki` moved off the unwritten list; new section **What the clock now reads** | The page was one dish out, and the pressure evidence had never been measured |
| `docs/gaps/bowl-shop.md` | Numbers verified (none needed changing); new section **What reading the whole shelf found** | Three whole-collection findings no writer ticket could see |
| `docs/gaps/README.md` | `## Build state` paragraph only | It claimed 514 recipes and 666 tests |

**Nothing outside `recipes/` and `docs/` changed.** That answers the acceptance criterion asking
this artifact to name each such file and say why: the list is empty. `src/lib/time.ts`,
`schedule.ts`, `counters.ts`, `collection.test.ts` and `counters.json` were all read against the
data and found correct or out of scope.

Commits: `ed98111` *Send the deep-fried four back to the takeout counter*, `4e44659` *Say what
the three new shelves are missing now*. Both through `lisa commit-ticket` with exact
`--include` paths. `git status --porcelain` leaves nothing of this ticket's staged, modified or
untracked.

## Acceptance criteria, against evidence

### `npm run verify` passes in full ✅

```
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories · counters: 658 named, 0 inferred · timers in 635 · pairings 760
Test Files  8 passed (8)      Tests  825 passed (825)
[build] 682 page(s) built
```

Run last after T-003-06's `db18740` landed in the same tree, so this is the combined state, not
just mine.

### At least 20 recipes carry `kit: Instant Pot`, each paired to a plain recipe that exists ✅

**25**, plus 20 `Slow Cooker`, 45 kit files in all. Every one names a `dish:` that resolves to
**exactly one** kit-less sibling on the shelf — zero lonely variants, zero dishes with two plain
ways. 32 dish keys now hold more than one file and every group is a declared kit family.

Variant switch spot-checked in `dist/`, both directions, three pairs:

| Page | Renders |
| --- | --- |
| `/beef-stew/` | *Also written for **Instant Pot**, **Slow Cooker**.* |
| `/beef-stew-instant-pot/` | *Also written for **Slow Cooker**, **the plain way**.* |
| `/carnitas/` | *Also written for **Instant Pot**, **Slow Cooker**.* |
| `/carnitas-instant-pot/` | *Also written for **Slow Cooker**, **the plain way**.* |
| `/congee/` | *Also written for **Instant Pot**.* |
| `/congee-instant-pot/` | *Also written for **the plain way**.* |

### No two files describe the same dish under different names ✅

Three independent passes over all 658, none of which found a duplicate:

- **By `dish:` key** — 32 multi-file keys, all declared kit families.
- **By normalised title** — stopwords and kit words stripped; every collision is a variant family.
  No two unrelated files normalise together.
- **By ingredient overlap** — Jaccard ≥ 0.60 over `ingredientNames`, variants excluded: 100 pairs,
  every one either baking staples sharing flour/sugar/butter/egg (`pound-cake` ~ `marble-cake`) or
  a pair already argued in its own ticket (`salsa-verde` ~ `salsa-verde-cruda`;
  `general-tsos-chicken` ~ `sesame-chicken`, whose file says outright it is the same glaze with
  the chile gone). **None of the 144 files added during S-002 appears against an older file.**

**No merges were made, because none was warranted.** `aka` collisions were read separately: 165
values are shared by more than one file, and they fall into two benign shapes — variant families
sharing their aliases (`carnitas` and both its kits answer to *taco de carnitas*, which is
correct), and generic bowl words (*grain bowl* on 10 of 12 bowls). Neither is a dish written
twice.

### Every `pairs-with:` slug across the whole collection resolves ✅

**760 mutual edges. 0 dangling, 0 one-way, 0 self-pairings.** Asserted by `collection.test.ts`,
which is in the 825.

### The clock reports pressure and release as unattended ✅

**42 pressure-and-release tasks across the 25 Instant Pot variants. Zero read as hands-on. All 42
carry `confidence: stated`** — the author naming the timer, not an inference off the sentence.
The four names used are `~pressure cook` (29), `~natural release` (25), `~come to pressure` (13),
`~quick release` (4), and `time.ts` recognises all four by name.

| Variant | What the timeline says | Elapsed | Plain sibling |
| --- | --- | --: | --: |
| `beef-stew-instant-pot` | "35 min high pressure, natural release 15 min" — 62 min unattended | 88 | `beef-stew` 135 |
| `pot-roast-instant-pot` | "75 min high pressure, natural release 20 min" — 110 min unattended | 136 | `pot-roast` 240 |
| `tonkotsu-broth-instant-pot` | 90 min pressure + 30 min natural release, both unattended | 170 | `tonkotsu-broth` **570** |
| `congee-instant-pot` | 30 min pressure + 20 min natural release, both unattended | 50 | `congee` 95 |
| `carnitas-instant-pot` | "45 min high pressure, natural release 15 min" — 72 min unattended | 94 | `carnitas` 190 |

### The three counter pages read as menus ✅

| Counter | Shelves | Names it and no other counter | Sections | *Also* |
| --- | --: | --: | --: | --- |
| The Bowl Shop | 103 | 36 | 6 | none |
| Instant Pot | 25 | 25 | 5 | none |
| One Pot | 68 (was 72) | 14 | 4 | none |

Counts taken off the built pages in `dist/menu/`, not predicted.

### The three gap docs are rewritten against the shelf as it now is ✅

With one correction to the ticket's premise, stated because it changed how the work was done:
these three had **already** been rewritten against the current 658-recipe shelf by T-002-08
(`ac9236e`), not left at their pre-story state. Discarding them to re-derive the same rankings
would have lost the per-dish reasoning six writer tickets handed forward. So every claim in all
three was verified against `src/generated/recipes.json` and what this pass changed or disproved
was corrected — set out file by file in the table above and in `design.md` §3.

`node scripts/menu-sections.mjs`, the same parser that folds these blocks back into
`counters.json`, is the test:

```
  ok   The Bowl Shop: 6 sections, 103/103 placed
  ok   Instant Pot: 5 sections, 25/25 placed
  ok   One Pot: 4 sections, 68/68 placed
```

No `unplaced`, no `listed but not shelved here`, no `unparsed` for any of the three.

## Test coverage

**No tests were added, deliberately.** What this ticket verified splits in two:

- **Properties that hold for every future file** are already pinned. `collection.test.ts` covers
  unique slugs, no homeless recipe, counters resolve, pairings resolve / mutual / not self,
  variants agree on their dish, one plain way per dish, no timer claiming four unbroken hands-on
  hours, every timer readable. `time.test.ts` covers the pressure vocabulary.
- **One-off audits over a snapshot** — "these 100 ingredient-overlap pairs are all deliberate",
  "these 165 `aka` collisions are all benign". A test asserting a hand-curated allowlist would
  fail on the next dessert written and teach nobody anything. Those scripts ran from the
  scratchpad; their results are quoted above.

**The one regression this ticket could cause** is the four `counters:` edits, and four existing
gates cover it: `check-recipes.mjs` (tables still draw, shapes unchanged),
`parse-recipes.mjs` (counter names resolve), `collection.test.ts` (nothing orphaned —
all four still name Takeout Counter), `menu-sections.mjs` (gap note and menu agree).

**A gap worth naming:** nothing tests that a `counters.json` section's slugs are actually shelved
at that counter. `menuFor()` silently drops one that is not, which is what let this ticket fix the
One Pot menu without touching a contended file — useful here, and a place a future typo could
hide. `menu-sections.mjs` reports it, but it is not in `npm run verify`.

## Open concerns

1. **`src/data/counters.json` still lists the four fried dishes under One Pot's *Skillet
   dinners*.** They render nowhere, and the built page is correct at 68 items in four sections.
   The file was left alone because **T-003-06 declares it as a file it owns and was live
   throughout this ticket** — it landed `db18740` between this ticket's two commits, editing that
   exact file. Removing the four inert slugs, or re-running `menu-sections.mjs --write` against
   the corrected page, is a one-line job. Recorded in `docs/gaps/one-pot.md` for T-003-07.

   Worth flagging to a human: T-002-09's own text says *"Nothing is running in parallel with
   it."* The DAG disagrees — T-003-06 depends only on T-002-08, so it was scheduled alongside.
   No harm came of it, but the ticket's premise was wrong and the next ticket that plans on it
   may be less lucky.

2. **`carnitas` and `chile-verde` are unresolved on One Pot.** Both declare a `#broiler{}` next to
   their Dutch oven. Carnitas puts its own pot under the broiler; chile-verde chars its chiles
   there first, on a sheet the file never names — which is the shape that kept `birria-de-res`
   off this shelf. Splitting them on an undeclared pan was a finer distinction than the files
   support, so both stay and the argument is written into `one-pot.md` rather than decided
   quietly.

3. **The plain braises do not time their hands-on steps.** `beef-stew` has four untimed
   operations, `beef-bourguignon` five, `pot-roast` three, so they report `handsOnMinutes: 0`.
   The pressure clock is correct — this is the plain side never making a claim. Writing times
   into those files to make the comparison come out is the fabricated number this story forbids.
   Recorded with per-file counts in `docs/gaps/instant-pot.md`.

4. **19 files repeat one of their own `aka` values** (`>> aka: 卵焼き, tamagoyaki, tamagoyaki, …`).
   Cosmetic — a duplicate alias costs nothing but a wasted search entry. Not touched because 18
   of the 19 are in the Japanese home wing T-003-06 is holding. For T-003-07.

5. **`docs/gaps/README.md`'s tally table still describes fifteen counters.** Its *Build state*
   paragraph is corrected and now says so outright. Rewriting eighteen rows now and again after
   S-003 lands would waste the second pass, so the whole board is left for T-003-07.

6. **The bowls under-use `pairs-with`.** 2.3 pairings each — the collection average — on the one
   counter whose own gap note says the honest form of a bowl *is* components plus `pairs-with`.
   Every one of the twelve could name its base grain, its roasted vegetable and its dressing.
   Cheapest remaining improvement to that shelf; recorded in `bowl-shop.md`.

## What a reviewer should look at

`git show ed98111` is four one-line deletions and takes ten seconds. The judgement worth checking
is whether the deep-fried four belong on a shelf whose blurb is *"Everything goes in one pan, and
that is the only pan to wash"* — the case is in `docs/gaps/one-pot.md` under *What it could not
stock*. Everything else is documentation of what was measured.
