# T-005-07 · Plan — read it all again

Ten steps, four commits. Each step names what it produces and how it is checked before the next one
starts. Steps 1–3 are the only ones that change the site; 4–10 are reading and reporting, and they
are the bulk of the ticket.

---

## Step 0 · Baseline, before anything moves

Nothing to commit. Establishes the "after" tree is clean and the "before" tree is buildable.

1. `git status --porcelain` — expect only the untracked S-005 story and T-005-07 ticket markdown.
2. `npm run build` — regenerates `src/generated/recipes.json` and `dist/` from the current tree, so
   every later measurement reads a build made from the committed files.
3. `git worktree add <scratch>/pre-story 1ae1165` — the commit before the first S-005 commit
   (`937ca8a`). `npm install` is not needed; `node_modules` is shared through the repo root only if
   the worktree is inside it, so run `npm ci --omit=dev` there or symlink `node_modules`. Then
   `node scripts/parse-recipes.mjs` inside the worktree.

**Check:** the pre-story worktree produces a `src/generated/recipes.json` with **658 recipes**, the
same count as HEAD. A different count means the baseline ref is wrong and everything after it is
meaningless.

---

## Step 1 · Cut the 17 ingredient notes · **commit 1**

The 13 files from `structure.md` §1, plus `src/data/counters.json`.

1. Dump the 17 notes in full with their file, step and ingredient — from
   `src/generated/recipes.json`, not by grepping, so the length measured is the length
   `check-recipes.mjs` measures.
2. Write the replacement for each by hand. Rule from `design.md` §1: keep the romanisation and how
   it arrives or is cut; drop what it does for the dish and where the name comes from. Each
   replacement gets a **disposition**: `to the shelf` (the tonic vocabulary), `already on the page`
   (the step says it), or `not worth keeping` (with which of `voice.md`'s two exclusions it is).
3. Apply by exact string replacement inside the `@name{qty}(note)` parenthetical. Nothing outside
   the parentheses may move — not the name, not the quantity, not the unit.
4. Add one section-level note to `The Soup Pot` → `Old-fire soups (老火湯)` in `counters.json`
   carrying the tonic-word fact, ≤120 characters, no `of:` key.

**Checks, in order, before committing:**

| Check | Command | Expect |
| --- | --- | --- |
| every note under cap | `npm run check` | `ingredient note 0`, all five fields zero |
| every file still draws a table | same run | `all 658 file(s) draw a table.` |
| nothing but the note changed | `git diff --numstat -- recipes/` | 13 files; line counts match the number of notes per file |
| the parenthetical is the only edit | `git diff -U0 -- recipes/` read by eye, 17 hunks | ingredient name, quantity and unit byte-identical on both sides |
| the counter note validates | `npm run recipes` | 0 warnings, note count 42 |
| the suite and the build | `npm run verify` | exit 0, 658 tables, 833 tests, 682 pages |

`lisa commit-ticket --ticket-id T-005-07 --message "Say which one to buy, and put the tonic word on
the shelf" --include <13 paths> --include src/data/counters.json`.

---

## Step 2 · Flip the gate · **commit 2**

`scripts/check-recipes.mjs` only.

1. `:67` `false` → `true`.
2. Rewrite the comment block at `:60-66` to the past tense: what the flag was for, which ticket
   cleared which field, that it is now on.
3. Leave the `false` branch of the closing message in place; rewrite the `true` branch to say what a
   writer who has just failed the build should do.

**Checks:**

| Check | Command | Expect |
| --- | --- | --- |
| a clean collection still passes | `npm run check; echo $?` | `0` |
| the flag actually bites | put one note back over cap, `npm run check; echo $?` | `1`, and the report names that file |
| and restores | `git checkout` the note, `npm run check; echo $?` | `0` |
| structural failure still fails independently | already covered — the exit expression is untouched | — |
| end to end | `npm run verify` | exit 0 |

The bite test is the whole point of the commit and it is run **after** the flip, on a real file,
then reverted. Both exit codes go in `progress.md`.

`lisa commit-ticket … --include scripts/check-recipes.mjs`.

---

## Step 3 · Script the measurement · **commit 3**

`scripts/measure-pages.mjs`, created.

Implements the extractor from `structure.md` §2. Header comment states the method, cites T-005-02
`research.md` §8, and records the drift.

**Check — the only one that matters:** run it against the story's own published figures, on the
pages the story named. It reproduces T-005-02's reconstruction to the character
(`ching-bo-leung-soup` 6226 against the story's 6223 at the time it was written) *or* the difference
is explained by what S-005 has since cut. Concretely: build the **pre-story worktree** and measure
it. If the script says `mean 3494 / median 3383 / max 6226` on the pre-story build, it is the
story's method. If it does not, the script is wrong and the measurement cannot be trusted.

This is the test that stands in for a unit test, and it is stronger: it pins the script against a
number published by a person before any of this code existed.

`lisa commit-ticket … --include scripts/measure-pages.mjs`.

---

## Step 4 · The six measurements

No commit. Produces the tables that go in `progress.md` and feed `docs/gaps/voice.md`.

| # | Measurement | Method | Against |
| --- | --- | --- | --- |
| 1 | visible chars per page — mean, median, max | `measure-pages.mjs` on `dist/`, and on the pre-story build | 3487 / 3379 / 6223 |
| 2 | the wordiest ten | `measure-pages.mjs --all \| sort` | the pre-story ten, computed the same way |
| 3 | the six chrome sentences | `--count` for each of the six strings, on both builds | 577 / 531 / 307 / 144 / 97 / 15 |
| 4 | `slack:` reasons over 200 | from `recipes.json`, both trees, reported on **both** conventions | 333 of 397 |
| 5 | prose rows over 120 | `buildTree` headers and footers, both trees | 126 headers, 106 footers |
| 6 | discarded step-body characters | every step carrying a `>> step.N:` line, both trees | 228,000 |

For 3, 4 and 6 the three known baseline discrepancies from `design.md` §3 are stated with both
numbers and the reason. For 3, the six strings come from T-005-02's ticket table verbatim; the
fifth is counted twice, once for each population, because the ticket and its predecessor disagree
about which one 97 refers to.

**Check:** every "before" figure is measured on the pre-story build with the same tool as the
"after" figure. Nothing is quoted from a prior ticket's review as if it were a measurement taken
here.

---

## Step 5 · The four regression checks

No commit. Two projections, one worktree, two reads.

**a. The merge tree.** `buildTree` + `layout` over both trees, one line per recipe: root column
count, leaf count, header count, footer count, and every operation's `stepIndex:col:row:rowSpan`.
**Expect an empty diff over 658 lines.**

**b. Ingredients and timers.** Per step: every ingredient as
`name|quantity|amount.value|amount.unit`, every timer as `name|text|minutes|attention`, every ref in
order, plus per-recipe `cookware` and `ingredientNames`. **Expect an empty diff.** Notes are
projected separately; **expect exactly 17 differing rows**, all in the 13 files from step 1.

**c. Safety facts.** All 36 from `docs/active/work/T-005-04/progress.md`, read against the file as
it stands now — not against T-005-04's own table, because T-005-05 and T-005-06 edited files on that
list afterwards. For each: does the number still appear, in a field that renders, saying what it
needs to. A number that now lives only in a discarded step body is a finding.

**d. Nothing moved twice.** Every `notes` entry in `counters.json` against every rendered field of
the recipe it names, compared on content words rather than exact strings. A sentence on a menu that
is also still on the page is a finding.

**Check:** each of the four is reported as a result with its command and its output, not as an
assertion. A non-empty diff on (a) or (b) blocks the ticket.

---

## Step 6 · Read seven pages whole

No commit. The part of the ticket no script can do.

For each of `ching-bo-leung-soup`, `dried-bok-choy-pork-lung-soup`,
`boston-baked-beans-slow-cooker`, `tonkotsu-broth-instant-pot`, `fresh-egg-pasta`, one of
`grilled-cheese` / `egg-cream`, and The Slow Cooker menu: read the built page top to bottom and
write a verdict — **is a cook being talked to?** With what is still wrong on that page, if anything.

The already-short page carries a specific burden the ticket names: it must show that **nothing was
taken from a recipe that had nothing spare**. That is a diff, not an opinion — the pre-story build
versus now, on that page, character count and text.

**Check:** seven verdicts, each naming at least one concrete thing on the page, and each saying
whether it is a pass. Verdicts that could have been written without opening the page do not count.

---

## Step 7 · `docs/gaps/voice.md`

Written from steps 4, 5 and 6, in the shape of `docs/gaps/mobile.md`. Entries 1–3 are the three
findings the ticket names, ranked by cost to a cook. Later entries come from the page reading and
from findings prior tickets recorded and nobody owned. Closes with what this story did not fix.

**Check:** every numbered entry carries a measurement that came from step 4, step 5 or step 6 — not
one carried over from a prior ticket's prose without being re-measured here. Anything that cannot be
re-measured is stated as *"recorded by T-005-0N, not re-measured"*.

---

## Step 8 · `docs/knowledge/voice.md`

Four corrections from `design.md` §6, plus a `## What changed, and when` section naming the ticket
behind each.

**Check:** re-read the whole file against the collection. Every number in it is either re-measured
in step 4 or is a cap in `CAPS` (which did not move). Every quoted example is grepped for in the
file it names.

---

## Step 9 · Commit 4, and the full verification

`lisa commit-ticket … --include docs/gaps/voice.md --include docs/knowledge/voice.md`.

Then, on the committed tree:

| | Expect |
| --- | --- |
| `npm run verify` | exit 0 — check + parse + 833 tests + 682 pages |
| `npm run verify:mobile` | exit 0 — 2046 page views at 375/390/768, both scans |
| `git status --porcelain` | no `recipes/`, no `src/`, no `scripts/`, no `docs/gaps/`, no `docs/knowledge/` |
| `git worktree remove` | the pre-story worktree is gone |

`verify:mobile` runs its own `npm run build` first. Nothing else is building — every other S-005
ticket is `done` — so the torn-read problem T-005-02 and T-005-05 both recorded should not appear.
If it does, the recorded way through is `astro build --outDir <private>` then each scan with
`--root` pointed at it, and the fact that it was needed is a finding.

---

## Step 10 · Review

`review.md` and `review-disposition.json`. Then `lisa check-disposition T-005-07`.

---

## Testing strategy

**No new vitest file, and it is the fifth time this story has made that call.** T-005-01, -03, -04,
-05 and -06 each recorded it with the same reasoning: `scripts/` holds thin drivers, `src/lib/`
holds the 833 tests, and there is no test harness for a script that reads `dist/`.

What stands in its place, per changed surface:

| Surface | What proves it |
| --- | --- |
| the 17 notes | `npm run check` re-parses all 658 files; projections (a) and (b) against the pre-story tree prove nothing else moved; 833 existing tests over `src/lib/` cover parse, label and tile |
| `counters.json` | `parse-recipes.mjs` validates every note; the menu pages build |
| the flag | exercised in both directions on a real file, exit codes recorded |
| `measure-pages.mjs` | pinned against a figure published in the story before the script existed — the pre-story build must measure `mean 3494 / median 3383 / max 6226` |
| the two markdown files | read, and every number in them traced to a command in step 4 or 5 |

**The gap, stated now rather than discovered at Review:** no check can tell whether a shortened
ingredient note still says the useful thing, and no check can tell whether a page reads like it is
talking to a cook. Both are judgements. The mitigation is the same one T-005-05 and T-005-06 used —
the judgement is published as data: 17 rows of before/after/disposition, and seven verdicts each
naming what is on the page.

---

## What would block

- Projection (a) or (b) coming back non-empty beyond the 17 expected note rows. That is a
  regression the story promised not to cause, and it blocks.
- A safety fact from T-005-04's 36 that now renders nowhere.
- A note that cannot be brought under 80 without losing a fact that has no destination. The
  escape the ticket allows — raise the cap with a measurement — is available and `design.md` §1
  argues no such measurement exists; if one turns up, it is a block-or-argue moment, not a silent
  cap change.
