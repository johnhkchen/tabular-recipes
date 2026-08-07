# T-008-02 — Review

**The counter is open, the gate is written down in three places, and the work list is a
commissioning list rather than a shelving plan — because the measurement said the gate admits
nothing that already exists.**

---

## What changed

Three files, four commits. Nothing else in the repository was touched.

| File | Change | Commit |
| --- | --- | --- |
| `src/data/counters.json` | 22nd counter appended; 5 sections, empty items, one shelf-talk note | `b646acf` |
| `docs/gaps/air-fryer-and-pot.md` | **new**, 684 lines | `b646acf`, `9bf59b9`, `5f6d639` |
| `docs/knowledge/counters.md` | one Contents row + one entry (~70 lines) | `addd18d` |

Written, run, and deleted without ever being committed:
`recipes/fried-and-crispy/zz-air-fryer-probe.cook`.

## The finding, stated once

**The gate admits 0 of the 118 recipes on the three shelves that already promise less work.**

| Shelf | Recipes | Bar 1 | Bar 2 | Bar 3 | All three |
| --- | --: | --- | --: | --- | --: |
| One Pot | 73 | 4 declared, all ≤ 2 | **0** | 31 by elapsed, 17 by `>> time:` | **0** |
| Instant Pot | 25 | 0 declared, 2 fail, 23 unmeasured | 21 | **0** | **0** |
| The Slow Cooker | 20 | none declared | 20 | **0** | **0** |

Measured off `src/generated/recipes.json` at 664 recipes through `buildSchedule()`, with bar 2 read
off each file's step prose rather than its `cookware` line. The three shelves do not intersect.

Two things follow, and both are in the gap page rather than only here:

1. **The risk S-008 named has inverted.** It feared a counter *"90% borrowed from Instant Pot"*.
   The borrowing is 0%. The risk is not redundancy; it is an empty shelf with twenty-six recipes of
   work under it.
2. **The bars did not move**, and the page says at the point of maximum temptation that bar 3 at 90
   minutes would admit 21 of the 25 Instant Pot recipes overnight and is forbidden.

## Acceptance criteria, one at a time

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `counters.json` holds `air-fryer-and-pot` with name, slug, blurb, ordered sections, empty items, no `categories` fallback, and parses | 22 counters; `"categories": []`, the shape 13 of the 21 existing entries use; `parse-recipes.mjs` green and **664 named / 0 inferred**, which is the proof no fallback leaked |
| 2 | `counters.md` entry with a what-it-is paragraph, the three-bar gate as a rule, and combined-or-separate **naming One Pot and Instant Pot with counts**; Contents row added | Entry at `## The Air Fryer & the Pot`: *What it is*, *The gate* (3 numbered bars, each with how it is measured), *Separate, and separate on the numbers* with the 73/0, 25/0, 20/0 table. Contents row added, anchor `#the-air-fryer--the-pot` following the existing `#pho--banh-mi` precedent |
| 3 | Gap page reports how many of the 25 clear **each** bar, measured off the built site, bar 3 against the real clock not `>> time:` alone | Full 25-row table with a per-bar mark, `>> time:` **and** derived elapsed **and** the untimed-operation count on every row. Both readings reported; both give 0 |
| 4 | If fewer than 10 clear all three, say so plainly and what it means; do not adjust the bars | §*Fewer than ten clear it. It is zero, and the bars do not move*, with four consequences in the order they bite |
| 5 | `## What it has` in the machine-read shape; ranked list of **≥ 20 air fryer dishes**; components section; what-a-table-cannot-hold naming **≥ 4** things the machine is bad at | Round trip prints `ok The Air Fryer & the Pot: 0 sections, 0/0 placed` with no `unparsed`. **20 basket ranks + 6 pot ranks.** 6 components. 8 bullets in *What a table cannot hold*, of which 6 are things it is bad at |
| 6 | Every ranked item says `kit: Air Fryer` variant of a **named** slug, or standalone, and the reason | All 26 carry one of the two, verified by grep: 26/26 |
| 7 | Sources for the basket times cited the way `soup-pot.md` cites them — linked, and what each established | §*Where this came from*, 7 bullets, 14 links, each saying what it established and where two disagree |
| 8 | A `.cook` naming the counter and `kit: Air Fryer` passes its check; demonstrated with a throwaway; not committed | `progress.md` §Step 6 — full transcripts. Not in `git status`, never passed to `commit-ticket` |
| 9 | `check-recipes.mjs` ok for the whole collection, unchanged | `all 664 file(s) draw a table.` — identical to the baseline recorded before any edit |
| 10 | Only the three named files modified | `git log --name-only` over this ticket's four commits lists exactly those three |

## Test coverage

**Nothing here has a unit test to write, and that is the honest answer rather than a gap.** The
change is one JSON object and two markdown documents. What could break is covered by machinery that
already exists, and every one of these was run:

| Risk | Covered by | Result |
| --- | --- | --- |
| JSON does not parse | `parse-recipes.mjs` | 664 recipes, 27 categories |
| the shelf-talk note is malformed or too long | `parse-recipes.mjs:118-136` | passes; 108/120 characters |
| a `categories` fallback leaks recipes onto the shelf | assignment counts | 664 named, **0 inferred** |
| a recipe naming this counter is rejected | `src/lib/collection.test.ts:29` | 11/11 with the probe in |
| `kit: Air Fryer` breaks the dish-group rule | `parse-recipes.mjs:198` | no throw; `karaage` group legal |
| the machine-read block does not round-trip | `menu-sections.mjs` | `0 sections, 0/0 placed`, no `unparsed`, problem count unchanged at 2 |
| the collection regressed | `check-recipes.mjs`, `vitest`, `astro build` | 664 files, **980/980**, **688 pages** |

**The gap the tests do not cover is the one that matters most, and it cannot be tested: the numbers
in the gap page could be wrong.** The mitigation is that the measurement is a script rather than a
reading — it is printed in `plan.md` §7, it runs in seconds, and re-running it reproduces the table
exactly. That is weaker than a test and is said so rather than dressed up.

## Open concerns

**1. Bar 2's reading is the single most consequential judgement on the page, and a reviewer should
check it.** *"One plug-in machine does the cooking"* is read here as **requiring** one — so a hob
dish with no machine at all fails, and that alone excludes all 73 One Pot recipes including the six
fastest things on the site. The reading follows the counter's name and blurb (*plug one in*) and
S-008's *"not a hob and then a machine"*, and no other reading makes the counter distinguishable
from One Pot. But if the intent was *at most one machine*, several One Pot recipes clear the gate
and the headline changes from 0 to a small positive number. **Everything else on the page survives
that change; the headline does not.**

**2. Bar 1 is unreadable on 92 of the 118 candidate recipes.** Only 11 of 664 files have declared a
`washing-up` line and only 2 of them are on the Instant Pot shelf. The page reports this as
*unmeasured* and refuses to estimate, which is right, but it means the gate currently has one bar
it cannot actually apply. T-008-03 owns it and the page says so. **This does not change the
headline** — bars 2 and 3 already settle every candidate — but it would change any future recount.

**3. Nineteen of the twenty-six ranked times are `[to establish]` placeholders, and this was a real
defect that was caught late.** The first draft of the ranked list carried specific temperatures and
times for every dish with no source behind most of them, which is exactly the fault S-008 forbids.
It was caught while writing this review. The evidence that it mattered: the vegetable ranks were
drafted at 200°C for 12–18 minutes, which is where every recipe site points, and America's Test
Kitchen **tested 400°F on brussels sprouts, rejected it and published 350°F for 20–25 minutes**,
because the outside browned before the inside softened. The received number was wrong in both
directions at once. Every time on the page is now tagged **[ATK]** (four, cited) or **[to
establish]** (nineteen, explicitly *not to be copied into a recipe*), three ranks carry no time at
all, and the correction is itself written up on the page as the reason the tags exist. **A reviewer
should treat the nineteen as a work item for T-008-04, not as guidance.**

**4. The gap page is 684 lines, about three times `instant-pot.md`.** It carries a 25-row
measurement table, 26 ranked entries each with a kit call and a reason, a sourced times section and
14 citations, all of which the acceptance criteria ask for — but it is long, and length is a cost a
maintainer pays. Nothing in it is padding as far as this attempt can tell; that judgement is worth a
second opinion.

**5. Five counters still have no `counters.md` entry.** The Bowl Shop, Instant Pot, One Pot,
Japanese Home Cooking and The Slow Cooker — every appliance-and-format shelf on the board. This
ticket's entry is the first of that kind the file has ever carried, and it deliberately did not
backfill the other five. Recorded on the gap page as somebody's next job.

**6. `--write` will undo two things on this page.** `node scripts/menu-sections.mjs --write` would
replace the five hand-written section titles with `[]` and drop the shelf-talk note carrying the
gate. This is pre-existing behaviour affecting eleven other sections; it is warned about in the gap
page and in `docs/gaps/README.md`. **T-008-05 is the ticket most likely to run it.**

## Concurrency

This branch moved twice under this ticket. **T-009-02 migrated every `>> step.N:` label to the
inline form during Research**, which is why the first draft of the throwaway probe was rejected by
`check-recipes.mjs`. And `npx vitest run` failed twice mid-session — 2 of 979, in
`src/lib/step-labels.test.ts` — while another thread had that file and its module dirty. Checked
out in a scratch worktree at `b646acf^`, `b646acf`, `a190d7c`, `4dc8e19` and `addd18d`, that file
passes **27/27 at every one of them**, including both of this ticket's commits at the time; the
final run is **980/980 green**. Recorded because a reviewer reading a log would otherwise see a red
run inside this ticket's window.

No commit here touched a file another thread was holding. `lisa commit-ticket` was given exact
`--include` paths every time and the ordinary index was never used.

## What a human reviewer should read first

1. **`docs/gaps/air-fryer-and-pot.md` § *The gate, measured*** — the 25-row table and the three
   paragraphs under it. If the zero is wrong, everything else on the shelf is planned against a
   wrong number, and open concern 1 is where it would be wrong.
2. **`docs/knowledge/counters.md` § *The Air Fryer & the Pot* → *The gate*** — three bars, each with
   how it is measured. This is the copy that has to survive a year.
3. **The `[to establish]` tags** in the ranked list — open concern 3. They are the difference
   between a work list and a set of invented numbers, and they are what T-008-04 inherits.
