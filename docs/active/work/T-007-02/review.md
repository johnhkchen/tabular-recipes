# T-007-02 — Review

The Soup Pot is off the board. Sixteen recipes deleted, eight rehomed with zero orphans, the counter
removed, and its research kept as a record of why. `npm run verify` exits 0.

---

## What changed

**Deleted — 16 files** (`bbd8664`), all in `recipes/soups/`, 425 lines:

```
apple-pear-pork-bone-soup            lotus-root-dried-octopus-soup
chinese-yam-goji-black-chicken-soup  lotus-seed-lily-bulb-soup
ching-bo-leung-soup                  old-cucumber-rice-bean-soup
corn-carrot-pork-bone-soup           overlord-flower-soup
dried-bok-choy-pork-lung-soup        peanut-black-eyed-pea-chicken-feet-soup
green-papaya-peanut-trotter-soup     sha-shen-yu-zhu-soup
green-radish-carrot-pork-bone-soup   watercress-honey-date-soup
hairy-gourd-dried-scallop-soup       winter-melon-jobs-tears-soup
```

No other `.cook` file was deleted. Checked against a snapshot of all 658 paths taken before the
first edit: **exactly 16 removed.**

**Modified — 8 `.cook` files** (`88ca990`), one line each. `8 files changed, 8 insertions(+), 8
deletions(-)`, and filtering the diff to changed lines and then removing `>> counters:` lines leaves
**zero lines**. Nothing else moved — not the `>> aka:` lines carrying `滾湯, gwan tong`, not the
`>> slack:` lines, not a step.

**Modified — `src/data/counters.json`** in two commits touching disjoint regions: `+10` for One
Pot's new section (`88ca990`), `−109` for the whole Soup Pot entry (`97030c8`). 109 deletions, 0
insertions on the removal — nothing reformatted, nothing relocated. Counters 22 → 21.

**Rewritten — `docs/gaps/soup-pot.md`** (`cdf2dc6`), 405 → 254 lines.

**Modified — `docs/gaps/README.md`** (`cdf2dc6`), +27 lines across two localised edits. No tally
row touched.

**Not modified:** `docs/knowledge/counters.md` — the ticket's condition does not fire, the file
never named the counter (`grep -rn "Soup Pot" docs/knowledge/` is empty). No other file in the repo.

---

## Acceptance criteria, against evidence

| Criterion | Evidence |
| --- | --- |
| Sixteen deleted, no other `.cook` deleted | Snapshot diff: exactly 16 removed. `bbd8664` touches 16 paths. |
| **Zero orphans**, all eight resolve, `verify` reports 0 | `642 named, 0 inferred from category`. The eight printed by name below. |
| The five name a counter explicitly, with a per-soup reason | All five → `One Pot`, none inferred. Reasons in `design.md` D1, one row each. |
| Only `>> counters:` changed in the eight — shown as a diff | 8/8 changed lines are `>> counters:`; the non-counters count is **0**. |
| `soup-pot` gone from `counters.json`, `/menu/soup-pot` no longer builds | `grep` returns nothing; `dist/menu/soup-pot` does not exist after `astro build`. |
| No `.cook` still names The Soup Pot — checked before building | `grep -rn "The Soup Pot" recipes/` → no match, run as Step 7's first action. |
| `soup-pot.md` exists, five reasons + date, glossary and four rules kept, ranked list dropped, says what would have to be true | 254 lines. Three preserved blocks diffed **IDENTICAL**. Date `7 August 2026`. No ranked entries remain. |
| `docs/gaps/README.md` no longer counts it as a live counter | Now says so explicitly under `### Retired counters`. See the note below. |
| Count drops by exactly 16; every other counter unchanged except gainers | 658 → 642. One Pot 68 → 73; Takeout Counter, Dim Sum, Instant Pot and the other seventeen unchanged. |
| `npm run verify` passes end to end | Exit code **0**. See the concurrency note below for the form the run had to take. |
| Only the permitted files modified | The four commits touch exactly: 8 `.cook`, 16 deletions, `counters.json`, `soup-pot.md`, `README.md`. |

The eight, resolved from the built collection:

```
tomato-potato-beef-soup   -> One Pot          egg-drop-soup       -> Takeout Counter
seaweed-egg-drop-soup     -> One Pot          congee              -> Dim Sum Counter, One Pot
mustard-greens-tofu-soup  -> One Pot          congee-instant-pot  -> Instant Pot
crucian-carp-tofu-soup    -> One Pot
century-egg-amaranth-soup -> One Pot
```

---

## The two decisions worth a reviewer's time

**1. The five went to One Pot, and nothing went to Cha Chaan Teng.** The ticket offered Cha Chaan
Teng as a second real option *"if T-007-01's work list wants them."* It does not. Its own page files
例湯 under **What a table cannot hold** — *"there is nothing to draw"* — and its ranked 24 has no
滾湯 in it; the board's soup line is 火腿通粉 and 羅宋湯, and 羅宋湯 is a new file that must say it is
not `borscht`. A cha chaan teng's tomato-and-beef is served over rice or in a noodle bowl, which is
not 番茄薯仔牛肉湯. Shelving one there would also have handed T-007-05 a dish in the auto-`Also here`
bucket its own criteria forbid. Full argument and the per-soup reasons in `design.md` D1.

**2. One Pot gained a section rather than absorbing the five into an existing one.** Without a
section they land in `menuFor()`'s auto-appended `Also` — an unlabelled bucket on a live page, which
is the dumping ground the ticket warns against. `Soups that are the whole meal` would have been
false for at least three of them: a 15-minute bowl of laver and egg is not the whole meal. So a
fifth section, `Quick soups that go with dinner`, says the clock and the role and stays in the
register of One Pot's other four titles.

---

## Test coverage

**No new test was written, and that is a decision.** Everything this ticket could break is already
asserted twice, once in the build and once in the suite:

| Property | Enforced by |
| --- | --- |
| No recipe at zero counters | `parse-recipes.mjs:79-87`, `collection.test.ts:26-29` |
| No recipe naming a counter that does not exist | `parse-recipes.mjs:60-68`, `check-recipes.mjs:26-31`, `collection.test.ts:31-34` |
| No menu note pointing at an unshelved or absent slug | `parse-recipes.mjs:139-152` |
| Every surviving file still draws a table | `check-recipes.mjs` |
| Pairings resolve both ways | `parse-recipes.mjs:160-175`, `collection.test.ts:37-55` |

A test asserting *"`soup-pot` is not in `counters.json`"* would snapshot one decision rather than an
invariant, and would need a new file under `src/lib/` — outside the permitted list. What no
automated check covers was verified by hand and is shown above: the one-line diff, the byte-identical
preserved blocks, and the absent `/menu/soup-pot`.

**The suite went 833 → 817.** Exactly 16, because `layout.test.ts` generates one case per recipe
(666 → 650). Not a regression; the other eight test files are unchanged.

---

## Open concerns

**1. `npm run verify` had to be run on a clean checkout, and here is why.** T-007-03 and T-007-04
are working the same branch right now — T-007-04 committed `f98affd` on top of this ticket's last
commit while this review was being written. With their in-progress untracked files in the tree,
`icons.test.ts` fails: *"2 verb(s) fall through to the bowl: broth, noodles"*, from
`recipes/soups/ham-macaroni-soup.cook` and `recipes/noodles/luncheon-meat-and-egg-noodles.cook`.
**Neither file is owned or touched by this ticket**, and neither existed when its work began.

So the pass reported here was taken on `git archive HEAD | tar -x` — a pristine checkout of exactly
the tree these four commits produce, with `node_modules` symlinked:

```
all 642 file(s) draw a table.
parsed 642 recipe(s) in 27 categories
  counters: 642 named, 0 inferred from category · timers in 619 · pairings 760
Test Files  9 passed (9)   Tests  817 passed (817)
665 page(s) built
verify exit on HEAD tree: 0
```

The identical run in the live working tree, taken before T-007-04's files appeared, gave the same
numbers and the same exit code. **This is a finding about a neighbouring ticket, not a defect
here** — T-007-04 needs to add `broth` and `noodles` to `VERB_ICONS` in `src/lib/icons.ts`, or
reword those two operation labels, before its own Review can pass.

**2. One Pot's new section drifts from `docs/gaps/one-pot.md`, which this ticket cannot edit.**
`node scripts/menu-sections.mjs` now reports One Pot with `unplaced -> century-egg-amaranth-soup,
crucian-carp-tofu-soup, mustard-greens-tofu-soup, seaweed-egg-drop-soup, tomato-potato-beef-soup`.
A `--write` run would delete the new section. **Nobody should run `--write` until the gap page is
updated.**

This widens a break that already existed rather than creating one: `counters.json` already listed
four slugs in One Pot's `Skillet dinners` — `general-tsos-chicken`, `orange-chicken`,
`sesame-chicken`, `sweet-and-sour-pork` — that name only the Takeout Counter and that the gap page
does not carry, so `--write` would have dropped them too. T-007-01 recorded the same claim breaking
for Cha Chaan Teng. **Three counters now diverge from `docs/gaps/README.md`'s "reproduces that file
byte for byte" claim.** There is no way to avoid this from inside this ticket's file list; any
placement of the five in `counters.json` produces the same report. The fix is four lines in
`docs/gaps/one-pot.md`.

**3. Two live files still name deleted slugs, and both are outside the permitted list.**

- `scripts/measure-pages.mjs:6` uses `ching-bo-leung-soup` as its `--slug` usage example, and `:30`
  cites it in the S-005 baseline note. The script reads built HTML, writes nothing, and its own
  header says it stays out of `npm run verify`. The example now prints nothing; the baseline note
  describes a build of commit `1ae1165` and stays true of it. **The usage example is worth one line
  of repair by whoever next owns that script.**
- `docs/gaps/voice.md` cites `dried-bok-choy-pork-lung-soup`, `ching-bo-leung-soup` and
  `corn-carrot-pork-bone-soup` as worked examples in a record of past measurements. Records of what
  was measured; correct as written.

**4. `docs/gaps/README.md`'s tally was not rewritten, deliberately.** The criterion asks to update
The Soup Pot's row; there is no row — the tally is the fifteen-counter table the file itself flags
as out of date. The criterion it is graded against now holds explicitly. The twenty-counter rewrite
is T-007-05's by its own criteria, and could not be done correctly now anyway: two tickets are
landing recipes as this is written, so any per-counter count would be stale before it committed.
The build-state numbers were refreshed and **stamped with what they were measured after**.

**5. What T-007-05 inherits from here.** The Soup Pot card is gone from the menus index and the
front page, which is its §3 check. One Pot carries a section this ticket added — if T-007-05 wants
those five soups shown differently, moving them is a `counters.json` edit it already owns. Concern 2
is the one thing to close.

---

## Known limitation

`docs/gaps/soup-pot.md` now sits in a folder described as *"one page per counter"* while being a
page for no counter. The README says so at the top and links to the retirement note, which is the
best available fix inside this ticket's file list. If more counters are ever retired, that folder
wants a `docs/gaps/retired/` subfolder rather than a paragraph — a board decision, not this ticket's.
