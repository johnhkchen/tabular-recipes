# T-007-01 — Review

The counter is open, argued, and has a work list. Three files, three commits, no source code
touched, whole collection verified byte-identical against a pre-change baseline.

---

## What changed

| File | Change | Commit |
| --- | --- | --- |
| `src/data/counters.json` | +36 lines, **0 removed**. One counter appended after `slow-cooker`. | `f95a388` |
| `docs/knowledge/counters.md` | +1 Contents row, +88-line `## Cha Chaan Teng` section, +1 bullet in `## Sources`. | `97581b6` |
| `docs/gaps/cha-chaan-teng.md` | **New**, 327 lines. | `79f4226` |

Nothing else. No `.cook` file, no `aisles.json`, no `src/` TypeScript, no test file, no
`docs/gaps/README.md`, no `docs/gaps/soup-pot.md`.

### `src/data/counters.json`

```json
{ "name": "Cha Chaan Teng", "slug": "cha-chaan-teng",
  "blurb": "Pick a set by the time of day; the milk tea comes with it.",
  "categories": [],
  "sections": [ 7 titles, every one with "items": [] ] }
```

`categories` is empty on purpose: `Sandwiches & Rolls` and `Drinks` are both claimed elsewhere and
either would drag the Deli or the drinks shelf onto this board through the fallback at
`scripts/parse-recipes.mjs:72`. Every item must arrive by an explicit `>> counters:` line.

Section order is menu order and `menuFor()` renders it as given: the sets first, because the set
grid is what makes this a counter; the drinks second, because the drink is in the set price and the
tea is this shelf's flagship recipe.

### `docs/knowledge/counters.md`

A **what it is** paragraph pair (the 早餐/常餐/快餐/下午茶餐 grid, the hours, the drink-in-the-price
convention with its two surcharges, and what the kitchen physically is), a **separate-and-argued**
block that takes the Dim Sum Counter and the Takeout Counter one at a time on different axes, a
paragraph naming the honest overlaps, a paragraph folding in the 冰室, and a **31-row** vocabulary
table.

### `docs/gaps/cha-chaan-teng.md`

`## What it has` (seven empty headings matching `counters.json` exactly) · `## What it is missing`
(**24** ranked, plus a `### The tea` sub-section) · `## What this board borrows, and what it must
not` (all seven slugs, one verdict each) · `## Components it would need` · `## What a table cannot
hold` · `## Sources` (11 linked bullets, each saying what that source established, plus three
cautions addressed to the writer tickets).

---

## Acceptance criteria, against evidence

| Criterion | Evidence |
| --- | --- |
| `counters.json` holds one more counter, `cha-chaan-teng`, with name/slug/blurb/ordered sections with empty items, and parses | Schema assertion passed: `22 counters; last = cha-chaan-teng`, 7 sections, all `items: []`. `npm run verify` parses it four separate times. |
| **The Soup Pot is untouched** | `git diff \| grep -c '^-[^-]'` → **0**. No line was removed from the file. Deep-equal against `baseline-soup-pot.json` passed. |
| `counters.md` has a `## Cha Chaan Teng` entry: what-it-is paragraph, argued combined-or-separate naming both neighbours, vocabulary table ≥20 rows | 31 rows. Both neighbours named by working anchor (`#dim-sum-counter`, `#takeout-counter`), each argued on stated evidence rather than assertion. |
| Contents table gains its row | `/\[Cha Chaan Teng\]\(#cha-chaan-teng\)/` → true. Anchor matches the heading. |
| Every *Also called* cell carries ≥1 non-English spelling **and** ≥1 alternative romanisation or English board-name | Checked mechanically over all 31 rows: **0 failures**. Not eyeballed. |
| `docs/gaps/cha-chaan-teng.md` exists with a machine-read `## What it has`, ≥20 ranked missing, components, what-a-table-cannot-hold | All present. Headings deep-equal `counters.json` titles. 24 ranked entries. |
| Ranked list states, for each of the seven slugs, *shelve as is* or *write a new file*, with the reason | An eight-row table (seven required plus `char-siu`, which belongs here and was not on the list). 5 shelve · 2 write · 1 refusal. |
| Sources cited the way `soup-pot.md` cites them | 11 bullets, each a bold subject, a link, and a clause saying what it established. Plus three cautions in `soup-pot.md`'s closing form. |
| `node scripts/check-recipes.mjs` reports ok for the whole collection, unchanged | `diff baseline-check.txt after-check.txt` → **no output**. Byte-identical, exit 0, `all 658 file(s) draw a table.` |
| A `.cook` file naming `counters: Cha Chaan Teng` passes its check; demonstrate with a throwaway file, do not commit | Full file and both transcripts in `progress.md` §Step 2. `ok … 4 rows x 3 cols`. Negative control with a typo'd name fails with `unknown counter`. File deleted; `git status --porcelain recipes/` prints nothing. |
| Only the three named files are modified | `git status --porcelain` shows nothing under `src/`, `recipes/`, `docs/knowledge/` or `docs/gaps/`. All three committed via `lisa commit-ticket` with exact `--include` paths. |

---

## Verification, in full

```
node scripts/check-recipes.mjs          exit 0, byte-identical to baseline
npm run verify                          658 files draw a table · 658 recipes parse ·
                                        658 counters named, 0 inferred · 0 orphans ·
                                        833 tests passed in 9 files · 682 pages built
node scripts/menu-sections.mjs          every counter parsed cleanly.
                                        diff vs baseline = exactly one added line
ls dist/menu/                           21 pages, no cha-chaan-teng route
git status --porcelain                  no owned file staged, modified or untracked
```

The empty counter is invisible by design: `menuFor()` drops sections whose items resolve to nothing
(`src/lib/counters.ts:83`), `menus()` drops counters with zero recipes (line 112), and
`getStaticPaths` filters on `menu.count > 0` (`src/pages/menu/[counter].astro:16`). Page count is
unchanged at 682 — observed, not assumed.

### Test coverage

**No test was added, and that is the right call.** This ticket changes one data file and two prose
files. The behaviour it introduces — a counter name being accepted by `.cook` files — is already
covered by `src/lib/collection.test.ts` (which asserts every recipe names a known counter) and by
the two validators that read `counters.json` independently. What this ticket needed instead was
*assertions on data shape and prose format*, and five were written and run:

1. schema assertion on the new JSON entry, including a deep-equal guard on The Soup Pot;
2. an end-to-end probe that a real `.cook` file naming the counter passes the real checker, **with a
   negative control** proving the pass came from the JSON edit;
3. a mechanical check that all 31 vocabulary rows satisfy the two-spelling rule — the criterion
   least suited to reading by eye;
4. a parser round-trip proving the gap page's headings equal the JSON's section titles;
5. a byte-identical diff of the whole-collection check against a pre-change baseline.

**Gap worth naming:** nothing in the repository enforces #3 or #4 going forward. If a later ticket
renames a section title in one file and not the other, the two drift silently until someone runs
`menu-sections.mjs` and reads the output. A checker for that would be small — it is the same shape
as the tag checker `docs/gaps/README.md` already ranks second in its next-pass list — and it is not
this ticket's file to add.

---

## Judgement calls a reviewer should check

**The `lo-mein` refusal.** S-007 says `club-sandwich`, `beef-chow-fun`, `french-toast`, `borscht`,
`pineapple-bun`, `egg-custard-tart` and `lo-mein` "are all already here and all belong on this
board." Reading the boards, `lo-mein` does not. The existing file is the Chinese-American 撈麵 —
soft boiled wheat noodles tossed with char siu and oyster sauce, shelved at the Takeout Counter. A
cha chaan teng's 撈丁 is instant noodles served drained, and its 雲吞撈麵 is thin wonton noodles with
the soup in a separate bowl. They share an English name and nothing else, which is precisely the
trap the story warns about two paragraphs later. **The gap page says do not shelve it**, and this is
the one place the work contradicts the story's own text. If a reviewer disagrees, the fix is one row
in one table.

**`char-siu` was added to the seven.** 叉燒湯意粉 is a breakfast-set item on a Hong Kong board and
`char-siu` is already written. It is listed with a *shelve as is* verdict so T-007-05 does not miss
it. Eight rows where the criterion asked for seven.

**Ranking put 乾炒牛河 last.** It is the most emblematic dish on the board and it needs a wok hot
enough to scorch rice noodles. S-007's argument is that emblematic-ness is not the axis, so it sits
at rank 24 with the reason written next to it. That will look wrong to anyone who reads the list as
a menu rather than as a work queue, so the ranking rule is restated at the top of the page.

**The tea commits to ranges, not numbers.** The blend count is "three or more, sometimes seven or
eight" with Lan Fong Yuen reported as five in one source and six in another. The pull count is 3–4
in one write-up and 8 *and* 3 for the same shop in two others. The one temperature (90–96 °C) and
the one ratio (1 g : 30 g) come from a single source and are attributed to it in the text. The
intangible-heritage listing's own words — 並無統一標準 — are quoted. A writer who wants a number to
type will not find one here, and that is deliberate.

---

## Open concerns

**1. `menu-sections.mjs --write` would drop all seven sections from this counter.** The parser only
emits a section when it found a slug (`scripts/menu-sections.mjs:85`), so running `--write` today
would replace the new counter's seven titles with an empty array. This is correct behaviour for an
unfilled shelf and is the same state `docs/gaps/soup-pot.md` describes for itself before T-003-03
wrote its files. But `docs/gaps/README.md` claims the parser *"reproduces that file byte for byte"*,
and **that claim is now false for one counter** until T-007-05 shelves items into it. Nobody should
run `--write` between now and then. T-007-05 closes it.

**2. The Contents table in `docs/knowledge/counters.md` now lists 16 of 22 counters.** It was 15 of
21 before this ticket; the six S-002/S-003 counters (Bowl Shop, Instant Pot, One Pot, Soup Pot,
Japanese Home Cooking, Slow Cooker) have never had rows. The criterion asked for one row and one row
was added. Widening the table is a separate job and is named here so it is not lost. Note that
T-007-02 removes The Soup Pot, which will take the count to 21 with 16 listed.

**3. `docs/gaps/README.md`'s build-state numbers are stale.** It records "825 tests green in 8
files"; the suite is now 833 in 9. That drift predates this ticket and was not introduced by it —
the baseline run showed the same numbers — but a reader comparing this review to that README will
notice. T-003-07 owns that page.

**4. The Cantonese romanisations are unverified.** Written without tone marks, compiled from the
sources cited rather than from a dictionary pass, to save the writer tickets a lookup. Both the
counter entry and the gap page say so, in the same form `soup-pot.md` used for the same reason. A
reader who knows Cantonese will find errors in them and should correct them in place.

**5. `docs/gaps/cha-chaan-teng.md` is 327 lines against the workflow's ~200-line guide.** It carries
a ranked list of 24, an eight-row verdict table, a sourced tea section and eleven cited sources
because the acceptance criteria ask for all of them. Trimming it would mean dropping a criterion.

---

## What the next ticket inherits

T-007-02 takes `counters.json` next and deletes The Soup Pot from it. The entry it must remove is
untouched by this ticket and sits exactly where it did; the new entry is appended after
`slow-cooker`, so the two edits do not overlap a single line.

T-007-03 and T-007-04 take the ranked list. The four things this ticket was told to get right for
them are: the cookable-tonight ranking (stated twice, at the top of the page and again above the
list), the seven-slug verdicts (their own section, with the two *write a new file* rows saying what
the new file must declare it is not), the tea researched rather than guessed (`### The tea`, with
every range attributed), and the shared components named once (four of them, plus a fifth that is
bought and is said to be bought).

T-007-05 fills the seven section item lists, catches evaporated milk, condensed milk, luncheon meat,
custard powder and golden syrup in `aisles.json`, and closes concern 1 above.
