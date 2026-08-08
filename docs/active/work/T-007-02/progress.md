# T-007-02 — Progress

All nine plan steps done, four commits, `npm run verify` green on a clean checkout of the tree this
ticket produced.

| Step | State | Commit |
| --- | --- | --- |
| 1 · Pre-flight sweep | done | — |
| 2 · Rehome the eight | done | `88ca990` |
| 3 · One Pot section | done | `88ca990` |
| 4 · Check and commit | done | `88ca990` |
| 5 · Delete the sixteen | done | `bbd8664` |
| 6 · Remove the counter | done | `97030c8` |
| 7 · Verify, then commit both | done | `bbd8664`, `97030c8` |
| 8 · The record | done | `cdf2dc6` |
| 9 · Evidence | done | — |

```
cdf2dc6  Leave the Soup Pot's research as a record   docs/gaps/README.md, docs/gaps/soup-pot.md
97030c8  Take The Soup Pot off the board             src/data/counters.json  (−109)
bbd8664  Delete the sixteen old-fire soups           16 files, −425
88ca990  Rehome the eight soups that stay            8 .cook + counters.json, +18/−8
```

Nothing outside the permitted file list is in any of the four.

---

## Step 1 — Pre-flight

Reproduced research §4 exactly before anything was deleted:

- `grep -rln "The Soup Pot" recipes/` → **24 files**, the sixteen plus the eight. Nothing else.
- 66 `.cook` files in `recipes/soups/`, `counters.json` at 2065 lines, working tree clean of
  ticket-owned paths.
- Per-slug inbound sweep over all sixteen: the only hits outside `docs/active/`, `docs/archive/`
  and the file itself were `docs/gaps/soup-pot.md`, `src/data/counters.json`, `docs/gaps/voice.md`
  (3 slugs) and `scripts/measure-pages.mjs` (1 slug). No new `pairs-with` had appeared. Cleared to
  delete.

A snapshot of all 658 `.cook` paths was taken here, because T-007-03 and T-007-04 are writing files
concurrently and a global count could not be trusted as a delta.

## Step 2 — The eight `>> counters:` lines

Eight `Edit` calls, each matching the full old value so no other line could collide.

```
8 files changed, 8 insertions(+), 8 deletions(-)
```

Every changed line is a `>> counters:` line. Filtering the diff to changed lines and then removing
`>> counters:` lines leaves **0 lines**. That is the acceptance criterion, shown:

```
->> counters: The Soup Pot                        +>> counters: One Pot            (×5)
->> counters: Takeout Counter, The Soup Pot       +>> counters: Takeout Counter
->> counters: Dim Sum Counter, One Pot, The Soup Pot  +>> counters: Dim Sum Counter, One Pot
->> counters: Instant Pot, The Soup Pot           +>> counters: Instant Pot
```

## Step 3 — One Pot gains a section

`Quick soups that go with dinner`, five items, appended as One Pot's fifth section. No `notes` key.
JSON round-trips byte-identically through `JSON.stringify(…, null, 2) + '\n'`, which was checked
before the edit rather than assumed, so the file's formatting is unchanged.

One Pot now: `Braises and stews (36) · Skillet dinners (16) · Rice and grains that cook in (11) ·
Soups that are the whole meal (9) · Quick soups that go with dinner (5)`.

## Step 4 — Check and commit

`node scripts/check-recipes.mjs recipes/soups/*.cook` → *all 66 file(s) draw a table*. This
intermediate state is internally consistent — The Soup Pot still existed and the sixteen still named
it — so the rehoming is committed on its own and the deletion cannot take it down with it.

## Steps 5-7 — The deletion, grouped as Plan required

Sixteen `rm`s, no `git rm`; `lisa commit-ticket --include` records the deletions. `recipes/soups/`
66 → 50.

The Soup Pot entry removed structurally: `removed The Soup Pot · sections 4 · items 24 · notes 14`,
counters 22 → 21. The diff is **109 deletions and 0 insertions** — nothing was reformatted and
nothing was relocated, including the empty `What each thing is for` section, which is gone and is
not recreated anywhere.

The guard the criteria ask for, run *before* building rather than discovered by a crash:

```
grep -rn "The Soup Pot" recipes/     →  no match
```

Then `npm run verify`:

```
all 642 file(s) draw a table.
parsed 642 recipe(s) in 27 categories
  counters: 642 named, 0 inferred from category · timers in 619 · pairings 760
Test Files  9 passed (9)   Tests  817 passed (817)
665 page(s) built
dist/menu/soup-pot → No such file or directory
```

### One deviation from Structure, corrected in Plan

Structure §3 said commit 3 could land before commit 2. It could not: removing the counter first
throws *unknown counter* on the sixteen, and deleting the files first throws on the eight `of:`
notes pointing at slugs that are no longer recipes. Plan opened by correcting this to a grouping —
both edits in the working tree, verified once, committed twice. That is what was done. No build was
run between Step 5 and Step 6.

### The test count moved, and Structure predicted wrong

Structure expected 833 tests unchanged; the run gives **817**. The difference is exactly 16.
`layout.test.ts` generates one case per recipe — 650 after, 666 before — so the drop is one test per
deleted file and not a regression. Confirmed by per-file counts: `layout.test.ts 650`,
`collection.test.ts 11`, and the other seven files unchanged.

## Step 8 — The record

`docs/gaps/soup-pot.md`: 405 lines → **254**. Assembled by concatenation rather than by editing, so
the kept material could not drift: the three preserved blocks were extracted from `git show
HEAD:docs/gaps/soup-pot.md` and pasted in untouched, then diffed back.

```
glossary + bodies + season + four rules + three genres (72 lines) → IDENTICAL
what a table could not hold                        (21 lines)     → IDENTICAL
where this came from, all eight sources            (19 lines)     → IDENTICAL
```

New headings: `Why it came down` (the five reasons, with the date **7 August 2026**), `What
happened to the twenty-four` (sixteen deleted by slug, eight with the counter each landed at),
`What would have to be true for this to work`. Dropped: `## What it has`, the ranked 18 + 10 + 4
unwritten soups, `## What reading the whole collection found`, `## Components it would need`.

One judgement call not in the plan: the old file closed with a paragraph of *"Two cautions for
T-003-03"* about confirming the romanisations. T-003-03 finished two stories ago and the ranked list
it addressed is gone, so instructing it in a record reads as a live work list. The half that still
applies — that the romanisations have no tone marks and were not dictionary-checked — is restated in
the standing note at the top, where a reader of the glossary meets it.

`docs/gaps/README.md`: two edits, no tally row touched.

- A `### Retired counters` section under **Build state**: The Soup Pot came down 7 August 2026,
  sixteen deleted, eight moved, `/menu/soup-pot` no longer builds, and `soup-pot.md` kept as a
  record. A pointer to it from the file's opening paragraph, so *"One page per counter"* stops being
  a false description of the folder.
- Build-state numbers refreshed from this ticket's own run and **stamped**: *"Measured after
  T-007-02 and no later"*, with T-007-03 and T-007-04 named as still landing recipes and T-007-05 as
  the ticket that restates them. The previous numbers were partly stale before this ticket
  (825 tests in 8 files against an actual 833 in 9); that is said in the file rather than quietly
  overwritten.

The criterion *"update the row for The Soup Pot in the tally"* has no row to update — the tally is
the fifteen-counter table the file itself flags as out of date, and never listed the counter. The
criterion it is graded against, *"no longer counts The Soup Pot as a live counter"*, now holds
explicitly rather than by omission. The twenty-counter rewrite is T-007-05's, by its own criteria.

## Step 9 — Evidence

**The eight survivors, resolved by name from the built collection.** None inferred:

```
tomato-potato-beef-soup      -> One Pot
seaweed-egg-drop-soup        -> One Pot
mustard-greens-tofu-soup     -> One Pot
crucian-carp-tofu-soup       -> One Pot
century-egg-amaranth-soup    -> One Pot
egg-drop-soup                -> Takeout Counter
congee                       -> Dim Sum Counter, One Pot
congee-instant-pot           -> Instant Pot
```

**The sixteen:** 0 of 16 still present in the built collection. Against the Step 1 snapshot,
**exactly 16 `.cook` files were removed** and none other.

**Per-counter item counts, before → after.** Every counter unchanged except the two this ticket
touches:

| Counter | Before | After |
| --- | --: | --: |
| One Pot | 68 | **73** |
| The Soup Pot | 24 | **gone** |
| Takeout Counter | 20 | 20 |
| Dim Sum Counter | 30 | 30 |
| Instant Pot | 25 | 25 |
| all seventeen others | — | unchanged |

Assignments 901 → 882 (−24 +5). Recipes 658 → 642. Pages 682 → 665 (sixteen recipe pages plus
`/menu/soup-pot`). Categories still 27, pairings still 760, `kit:` still 45 (25 Instant Pot, 20 Slow
Cooker).

**`npm run verify` exit code 0**, taken on a clean `git archive HEAD` checkout of the tree these
four commits produce — see Review for why that form was needed.

**`git status --porcelain`** shows no ticket-owned path staged, modified or untracked.
