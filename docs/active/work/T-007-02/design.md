# T-007-02 — Design

Four decisions, each grounded in what Research measured. The cull itself is not a decision — S-007
made it and this ticket executes it.

---

## D1 — Where the five unshelved 滾湯 go

`tomato-potato-beef-soup`, `seaweed-egg-drop-soup`, `mustard-greens-tofu-soup`,
`crucian-carp-tofu-soup`, `century-egg-amaranth-soup`.

### The options

**A. All five to One Pot.**
**B. Split: `tomato-potato-beef-soup` to Cha Chaan Teng, the other four to One Pot.**
**C. All five to the Diner, named explicitly.**
**D. Name nothing and let the `categories` fallback carry them.**

### Assessment

**D fails on a live invariant.** The fallback for `Soups` is the Diner and only the Diner
(research §2). The build reports `0 inferred from category` today, and T-007-05's acceptance
criteria require `0 counters inferred from category` after this story
(`T-007-05-shelve-it-and-read-it.md:107-109`). Choosing D would hand the next ticket a criterion it
cannot satisfy without editing `.cook` files, which its own criteria forbid (*"No `.cook` file is
edited here — a recipe that needs a fix is a finding, not a fix"*). The ticket offers D as an escape
hatch for a soup that fits nowhere honestly. One fits honestly, so the hatch is not needed.

**C is D with the quiet part written down.** Landing a 番茄薯仔牛肉湯 on an American diner board is
exactly the placement nobody can defend. Rejected.

**B is the one worth arguing, and the work list already answered it.** The ticket flags Cha Chaan
Teng as a second real option *"because the 常餐 comes with a 餐湯 and a tomato-and-beef soup is
squarely that; T-007-01's work list will have said whether it wants them."* It said no, three
times over:

1. `docs/gaps/cha-chaan-teng.md:250-252` files 例湯 under **What a table cannot hold** — *"whatever
   the kitchen boiled that morning… there is nothing to draw."* The soup slot is deliberately
   undrawable, not vacant.
2. The board's soup line is `火腿通粉` (rank 7) and `羅宋湯` (rank 9), and rank 9 is a **new file**
   that must declare it is not `borscht`. Neither is a household 滾湯.
3. The dish is not the same dish. A cha chaan teng's tomato-and-beef is 番茄牛肉 served over rice or
   in a noodle bowl, off the rice-plate and noodle blocks. 番茄薯仔牛肉湯 is a Cantonese household
   soup with potato in it, drunk beside dinner. S-007's own rule — *"a Hong Kong dish that shares an
   English name with a Western one is usually not the same dish"* — cuts the same way between a
   household pot and a board item.

There is also a mechanical cost. T-007-05 must make Cha Chaan Teng render **no "Also here"
section**. A soup shelved there by this ticket and not listed in one of the seven section item
lists lands in the auto-appended `Also` bucket (`src/lib/counters.ts:82-85`). T-007-05 could place
it — its §1 anticipates exactly this — but it would be placing a dish its own work list said the
board does not sell.

**A is what the shelf is.** One Pot's blurb is the method of all five, read off their own step
lines: *"Everything goes in one pan, and that is the only pan to wash."* Every one of the five
fries or boils and finishes in a single vessel — `crucian-carp-tofu-soup` most literally, where the
fish is fried and then boiled in the same pot and that sharing *is* the method. And `congee` is
already at One Pot, so the shelf has precedent for a Cantonese pot on it.

### Decision: A. All five to One Pot, and nothing to Cha Chaan Teng.

Per-soup reason, which the acceptance criteria ask for by name — *not "One Pot" alone, but why that
shelf and not another*:

| Slug | Why One Pot | Why not the other candidate |
| --- | --- | --- |
| `tomato-potato-beef-soup` | Tomatoes fried down in oil, water in on top of them, potatoes and beef cooked in the same pot. 45 min, one wash. | The nearest cha chaan teng dish is 番茄牛肉 over rice or noodles, and 例湯 is undrawable by the board's own work list. |
| `seaweed-egg-drop-soup` | Boil water, laver in, egg in off the boil. There is no second vessel in the file. | Not a Takeout Counter soup — `egg-drop-soup` is the one that board sells, and this page already says the two are not the same soup. |
| `mustard-greens-tofu-soup` | Ginger fried in the pot first, greens boiled in it, pork and tofu finished in it. | Bitter 芥菜 is a household green; no counter on the board sells it. |
| `crucian-carp-tofu-soup` | Fried golden and then boiled hard **in the same pot** — the emulsion that makes it white depends on not changing vessels. The strongest One Pot case of the five. | Whole fish is not a cha chaan teng item and not a Dim Sum one. |
| `century-egg-amaranth-soup` | Garlic fried, century eggs boiled, amaranth in for three minutes. One pot, 20 minutes. | Century egg appears at the Dim Sum Counter only inside congee; this is a home soup. |

### The three already shelved elsewhere

`egg-drop-soup` → `Takeout Counter`. `congee` → `Dim Sum Counter, One Pot`. `congee-instant-pot`
→ `Instant Pot`. Each keeps every counter it already had; only `The Soup Pot` is struck. No counter
is added to any of the three — `congee-instant-pot` is an equipment variant and belongs where its
kit is, and manufacturing a second shelf for it would be shelf-padding, not rehoming.

---

## D2 — Which One Pot section the five land in

Once the five name One Pot they must also be listed in one of its sections, or `menuFor()` sweeps
them into an auto-appended section literally titled `Also` (`src/lib/counters.ts:82-85`). An
unlabelled bucket on a live menu page is the dumping ground this ticket is written against.

### The options

**A. Append to `Soups that are the whole meal`** (gumbo, sancocho, minestrone, harira,
split-pea-soup, new-england-clam-chowder, borscht, black-bean-soup, wonton-soup).

**B. Add one new section to the One Pot entry.**

**C. Add nothing; let them fall into `Also`.**

### Assessment

**A is false on its face for at least three of the five.** A 15-minute bowl of laver and egg is not
the whole meal; neither is a 20-minute amaranth soup. A 滾湯 is drunk *beside* dinner — that is the
definition `docs/gaps/soup-pot.md:139-140` gives it and the one the survivors' own `aka` lines
carry. The existing section title makes a claim, and putting these under it would make the shelf
say something untrue about five dishes to avoid adding four lines of JSON.

**C leaves a visible unlabelled section** on `/menu/one-pot` and quietly contradicts the property
T-003-07 established, that every counter is fully sectioned.

**B costs a widened drift that already exists.** `docs/gaps/one-pot.md` is not writable by this
ticket, so a section added here is one `menu-sections.mjs --write` would delete. But research §6
found One Pot **already** drifts by four slugs (`general-tsos-chicken`, `orange-chicken`,
`sesame-chicken`, `sweet-and-sour-pork` are listed in `counters.json` and shelved at Takeout Counter
only), so `docs/gaps/README.md`'s *"reproduces that file byte for byte"* is already false for this
counter. The choice is between widening a broken claim and printing a false section title.

### Decision: B — one new section, `Quick soups that go with dinner`

Appended after `Soups that are the whole meal`, holding the five in the order the retired counter
listed them. The title says the two things that separate them from the section above: the clock and
the role. It stays in the register of One Pot's other titles — `Braises and stews`, `Skillet
dinners`, `Rice and grains that cook in` — plain English, no genre jargon, no em-dash (which
`menu-sections.mjs` would cut a title at).

No `notes` are carried over. The Soup Pot's four 滾湯 notes are shelf talk written to compare those
soups against the sixteen old-fire pots up the page; with the old-fire pots gone the comparison has
no other half, and `parse-recipes.mjs:139-152` would reject a note pointing at a slug its section
does not shelve. They go with the counter.

Handed to Review as a finding for whoever next owns `docs/gaps/one-pot.md`.

---

## D3 — What `docs/gaps/soup-pot.md` becomes

The ticket is specific: keep it, stop it describing a live shelf, keep the glossary and the four
rules, drop the ranked list, add the five reasons and the date, and add the one thing the old page
never said — what would have to be true for the shelf to work.

### Options for the shape

**A. Minimal surgery** — retitle, delete the ranked list, bolt a preface on.
**B. Rewrite front-to-back as a record**, lifting the two research blocks across intact.

**B.** A page that opens *"24 recipes: 16 老火湯, 6 滾湯 and the two congees"* and then admits four
screens later that none of them are here is worse than either version. The frame has to change at
the top, and every section that describes a live work list (`## What it has`, `## What it is
missing`, `## Components it would need`) has to go or be re-headed. That is a rewrite.

### Decision: B, with the kept material moved rather than re-typed

Structure:

1. **New title and standing note** — what this file is now, and the date (2026-08-07).
2. **`## Why it came down`** — the five reasons from S-007, stated plainly and briefly, in the
   story's order: the ingredients are not for sale; three hours buys a course, not a dinner; it is
   not a counter; the frame is a medicine frame; twenty-four files, one recipe.
3. **`## What happened to the twenty-four`** — sixteen deleted by slug, eight rehomed with the
   counter each landed at. This is the record that stops someone re-deriving the shelf.
4. **`## What would have to be true for this to work`** — the section the old page did not have.
   Three conditions: an aisle that can name a dried-goods shop, a substitution model, and a counter
   definition that admits a home practice rather than a storefront.
5. **`## Preserved research`** — the glossary, the bodies, the season, the four rules of the pot and
   the 老火湯/滾湯/燉湯 distinction, moved across **byte-identical** under a heading that says they
   are preserved research and not a work list.
6. **`## What a table could not hold`** — kept, because it is the same kind of finding.
7. **`## Where this came from`** — the eight sources, kept.

Dropped: `## What it has` (the machine-read block — once the counter leaves `counters.json`,
`menu-sections.mjs` iterates counters and never opens this file again, research §8), the ranked 18
+ 10 + 4 unwritten soups, `## What reading the whole collection found`, and `## Components it would
need` — all four describe a shelf that is being built.

---

## D4 — What changes in `docs/gaps/README.md`

The ticket says *"update the row for The Soup Pot in `docs/gaps/README.md`'s tally"*. **There is no
row.** The tally is the fifteen-counter table the file itself flags as out of date, and
`grep "Soup Pot" docs/gaps/README.md` is empty (research §9). The criterion — *"the tally no longer
counts The Soup Pot as a live counter"* — holds on the file as inherited.

### Options

**A. Change nothing**, and say in Review that the criterion was already satisfied.
**B. Rewrite the tally to twenty counters** so the row is unambiguously gone.
**C. Minimal honest edit**: say the counter is retired, and refresh the numbers this ticket moves.

**A** leaves the file's **Build state** block asserting 658 recipes and 682 pages, which this ticket
makes false, and leaves *"one page per counter"* describing a folder that now holds a page for no
counter. Both are small lies introduced by this ticket, and this ticket owns the file.

**B** is T-007-05's job by its own criteria — *"the tally covers all twenty counters, The Soup Pot's
row is gone, and the five-gaps list is re-ranked"* — and cannot be done correctly now anyway:
T-007-04 is at `design` and T-007-03 at `research` **right now**, both writing `.cook` files, so any
per-counter count written here is stale before it is committed.

### Decision: C

Two edits, both inside what this ticket owns:

- A short **Retired counters** note stating that The Soup Pot came down on 2026-08-07 under S-007,
  that sixteen files were deleted and eight rehomed, and that `soup-pot.md` is now a record rather
  than a counter page — so the *"one page per counter"* sentence stays true of the folder.
- The **Build state** numbers refreshed from this ticket's own verify run, stamped with what they
  are measured against and pointing at T-007-05 for the full restatement, because T-007-03 and
  T-007-04 are landing recipes concurrently.

The tally table itself is not touched. Writing counts into it now would be inventing numbers two
concurrent tickets are about to change.

---

## What was rejected outright

- **Deleting `docs/gaps/voice.md`'s or `scripts/measure-pages.mjs`'s references to the culled
  slugs.** Both are outside the permitted file list, both are records of measurements that were
  true when made, and `measure-pages.mjs` is not in `npm run verify` by its own design
  (`measure-pages.mjs:11-13`). Findings, not edits.
- **Touching `docs/knowledge/counters.md`.** The conditional in the ticket does not fire: the file
  never named the counter.
- **Re-homing anything onto Cha Chaan Teng "so the new shelf starts with something on it."** The
  shelf starting empty is T-007-01's recorded, correct state, and T-007-03/04 fill it.
- **Removing the dead dried-goods patterns from `src/data/aisles.json`.** T-007-05's ticket
  explicitly instructs leaving them (*"a pattern with nothing matching it costs nothing"*), and the
  file is not this ticket's to edit.
