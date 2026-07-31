# T-002-07 — Plan

Six steps, two of them commits. Every step is verifiable on its own with a command that writes
nothing, so siblings working the same branch are never disturbed.

## Step 0 — Baseline

Record the state the ticket starts from, so any failure later can be attributed.

```sh
git status --short
ls recipes/*/*.cook | wc -l
node scripts/check-recipes.mjs 2>&1 | tail -3
```

**Expected:** the four modified ticket files and the two untracked `docs/active/work/` directories
already in the tree (siblings' and this story's), 553 `.cook` files, and every file drawing a
table. A pre-existing failure here is a sibling's and is recorded, not fixed.

**Verifies:** nothing yet. This is the control.

## Step 1 — Write the six roasted vegetables

Create, in this order:

```
recipes/vegetables-and-sides/roasted-sweet-potatoes.cook
recipes/vegetables-and-sides/charred-broccoli.cook
recipes/vegetables-and-sides/roasted-cauliflower.cook
recipes/vegetables-and-sides/roasted-brussels-sprouts.cook
recipes/vegetables-and-sides/roasted-beets.cook
recipes/vegetables-and-sides/crispy-roast-potatoes.cook
```

Each to the blueprint in `structure.md` §4.7–4.12: metadata block in the fixed order, `step.N`
override for every step, relative `@&(~n)` references only, prose only at the top.

**Verify:**

```sh
node scripts/check-recipes.mjs --labels \
  recipes/vegetables-and-sides/roasted-sweet-potatoes.cook \
  recipes/vegetables-and-sides/charred-broccoli.cook \
  recipes/vegetables-and-sides/roasted-cauliflower.cook \
  recipes/vegetables-and-sides/roasted-brussels-sprouts.cook \
  recipes/vegetables-and-sides/roasted-beets.cook \
  recipes/vegetables-and-sides/crispy-roast-potatoes.cook
```

**Pass condition:** six `ok` lines; every file ≥ 3 rows and ≥ 3 cols; the printed staircase reads
as verbs — `toss`, `roast … 20 min`, `turn and finish`, not a clause fragment. Any label that
reads badly is fixed by rewording the step or by tightening its `step.N` override, then re-run.

This is the check the acceptance criteria name, so its output is captured verbatim into
`progress.md`.

## Step 2 — Commit the vegetables

```sh
lisa commit-ticket --ticket-id T-002-07 \
  --message "Put a roasting tray in the vegetable drawer" \
  --include recipes/vegetables-and-sides/roasted-sweet-potatoes.cook \
  --include recipes/vegetables-and-sides/charred-broccoli.cook \
  --include recipes/vegetables-and-sides/roasted-cauliflower.cook \
  --include recipes/vegetables-and-sides/roasted-brussels-sprouts.cook \
  --include recipes/vegetables-and-sides/roasted-beets.cook \
  --include recipes/vegetables-and-sides/crispy-roast-potatoes.cook
```

Exactly six `--include` paths, all repository-relative, no globs. No ordinary `git add`, no
`git commit`, nothing left staged.

**Verify:** `git status --short` shows none of the six, and shows every sibling file it showed at
Step 0, untouched.

## Step 3 — Write the six proteins

Create:

```
recipes/smoked-and-grilled/pulled-roast-chicken.cook
recipes/smoked-and-grilled/blackened-salmon.cook
recipes/fried-and-crispy/crispy-chickpeas.cook
recipes/fried-and-crispy/crisped-marinated-tofu.cook
recipes/fried-and-crispy/seared-halloumi.cook
recipes/eggs/seven-minute-eggs.cook
```

To `structure.md` §4.1–4.6. The two merges (`blackened-salmon` s3, `seared-halloumi` s4) are the
places most likely to fail, because `~1` and `~2` must name the two immediately preceding steps.
`slack` lines go on `blackened-salmon`, `crispy-chickpeas`, `seared-halloumi` and
`seven-minute-eggs` only, each with a named failure.

**Verify:** the same `check-recipes.mjs --labels` run over the six paths; six `ok` lines.

## Step 4 — Commit the proteins

```sh
lisa commit-ticket --ticket-id T-002-07 \
  --message "Write the protein column the bowl counter sells" \
  --include recipes/smoked-and-grilled/pulled-roast-chicken.cook \
  --include recipes/smoked-and-grilled/blackened-salmon.cook \
  --include recipes/fried-and-crispy/crispy-chickpeas.cook \
  --include recipes/fried-and-crispy/crisped-marinated-tofu.cook \
  --include recipes/fried-and-crispy/seared-halloumi.cook \
  --include recipes/eggs/seven-minute-eggs.cook
```

## Step 5 — Whole-collection verification

```sh
node scripts/check-recipes.mjs 2>&1 | tail -3      # every file, including siblings'
node scripts/parse-recipes.mjs 2>&1 | tail -20     # pairs-with resolution, duplicate slugs
npx vitest run 2>&1 | tail -15                     # collection invariants
```

**Pass condition:**

- `all 565 file(s) draw a table.` — 553 at baseline plus twelve.
- The parse prints twelve more recipes than baseline, **0 orphans**, **0 duplicate slugs**, **0
  parser warnings**, and twelve counter assignments to The Bowl Shop.
- Vitest green.

`parse-recipes.mjs` writes `src/generated/`, which is uncommitted by design; nothing there is
included in any commit.

**Attribution rule:** if any of the three fails on a file this ticket did not write, the failure is
recorded in `progress.md` and `review.md` as a sibling's and is not repaired here — repairing it
would edit a file this ticket does not own.

`npm run verify` additionally runs `astro build` over the whole tree, siblings' in-flight files
included. It is run once for information, and a failure inside it that is not attributable to these
twelve files is reported rather than fixed.

## Step 6 — Acceptance criteria, checked one at a time

| # | Criterion | How it is checked | Where the evidence lands |
| --- | --- | --- | --- |
| 1 | ≥ 10 new `.cook` files, each naming `counters: The Bowl Shop` | `grep -c "The Bowl Shop"` over the twelve; `grep -rl` over `recipes/` returns exactly twelve | `progress.md`, `review.md` |
| 2 | ≥ 5 proteins, ≥ 4 roasted vegetables | 6 and 6 by construction; listed by path | `review.md` table |
| 3 | ≥ 2 of the proteins not meat | 4 of 6: chickpeas, tofu, halloumi, eggs | `review.md` |
| 4 | 3–6 operations, real technique | `--labels` staircase per file, plus the op count from `structure.md` §4 | `progress.md` transcript |
| 5 | Nothing duplicates an existing protein or side | the grep table in `research.md` §4, re-run after writing; plus the rejected-duplicate argument in `design.md` §2 | `review.md` |
| 5b | Existing dishes listed by slug and section for T-002-08 | `design.md` §5, restated in `review.md` | `design.md` §5 |
| 6 | `check-recipes.mjs --labels` ok for every new file, staircase reads as verbs | Steps 1 and 3 | `progress.md` verbatim |
| 7 | Every timer named; `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | `grep -o '~[a-z ]*{'` finds no bare `~{`; a six-key grep per file | `progress.md` |
| 8 | Only `recipes/**` modified, no pre-existing file edited | `git show --stat` on both commits; `git status --short` clean of ticket paths | `review.md` |

## Testing strategy, stated plainly

There is no unit test to write. This ticket adds **data**, not code, and the collection's tests are
generic invariants that already run over every file — unique slugs, mutual pairings, timers that
resolve to minutes, no recipe claiming four unbroken hands-on hours, every table tiling with no
holes. Twelve new files means those invariants execute twelve more times; there is no new
behaviour for a new test to pin.

What that leaves uncovered, and it should be said out loud in Review: **nothing checks that a
recipe is correct cooking.** `check-recipes.mjs` proves a file draws a table; it cannot tell 450 °F
from 250 °F, or a seven-minute egg from a six-minute one. The quality gate on these twelve files is
a human reading them, which is exactly where review time on this ticket is worth spending.

## Rollback

Each step is one commit through `lisa commit-ticket`. A bad file is fixed and re-committed; nothing
here modifies existing state, so there is no migration to undo. Reverting the ticket entirely is
deleting twelve files that nothing else references — `pairs-with` is written on this side only, so
no other file names them.
