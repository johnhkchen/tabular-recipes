# T-003-07 — Plan

Fourteen steps. Each one is a `lisa commit-ticket` with exact `--include` paths, and each is
verifiable on its own before the next starts.

---

## Step 0 — the reading tool (no commit)

Write a scratch dumper that prints, for a list of slugs: the metadata block, the `>> step.N:`
overrides, and the first prose paragraph. That is enough to name a dish's real failure without
reading 200 whole files, and it is the difference between this ticket being possible and not.

Scratch only — it lives in the session scratchpad and is never committed.

**Verify:** it prints `baked-turkey-wings` and the output contains the words a reader would
need to have written that file's existing slack line.

---

## Steps 1–8 — the slack backfill

One step per batch from `structure.md`. Every step is the same three actions:

1. Dump the batch's files.
2. Write one `>> slack:` line into each, after `>> time:`.
3. `node scripts/check-recipes.mjs <the batch's paths>` → `all N file(s) draw a table`.
4. `lisa commit-ticket --ticket-id T-003-07 --message <message> --include <each path>`.

| Step | Batch | Files | Commit message |
| --- | --- | --: | --- |
| 1 | Pressure | 25 | *Say what the locked lid costs you if you are wrong* |
| 2 | Cures, pickles, beans | ~22 | *Name the failures that are not just a worse dinner* |
| 3 | Smoke and grill | 16 | *The long smoke is forgiving; the pull temperature is not* |
| 4 | Braises and stocks | ~38 | *An extra hour changes little, and say which part it does not* |
| 5 | Doughs | ~40 | *The bulk ferment is the window, and over-proof does not come back* |
| 6 | Custards, puddings, sugar | ~38 | *Where the property earns its place* |
| 7 | Short windows | ~30 | *The emulsion, the foam, the grain and the fryer* |
| 8 | The remaining long cooks | ~22 | *Finish the two-hour list* |

**The check after each step is not optional.** `check-recipes.mjs` is the only thing that
catches a level nobody agreed on or a reason left empty, and it catches it per file with the
file named. A batch that fails is fixed inside its own step, never carried forward.

### Testing strategy for Steps 1–8

There is no unit test to write. The slack property already has one — `src/lib/slack.test.ts`
covers the parser — and a backfill adds data, not behaviour. What guards the data is:

- **`check-recipes.mjs`, per file.** An unknown level or a missing reason fails the build.
- **`parse-recipes.mjs`, at build.** It throws on `slackProblem` rather than shipping a
  half-declared field to a page.
- **Reading it back.** After the last batch, count declared/undeclared and print the level
  distribution. A backfill that produced 200 `forgiving` lines and nothing else would be a
  backfill that was not reading the files, and the distribution is the cheapest way to see it.

---

## Step 9 — `src/lib/time.ts`

Add `parboil` to `UNATTENDED`, with the comment saying why it is safe where `boil` is not.

**Verify, in this order:**

1. `npx vitest run src/lib/time.test.ts src/lib/schedule.test.ts` → green.
2. `npm run recipes` → parses.
3. `buri-daikon` measures 10 hands-on / 45 unattended (was 30 / 25).
4. The six other `~parboil` files each move their parboil timer to unattended and nothing else
   moves.
5. `npx vitest run` in full → 825+ green, in particular `collection.test.ts`'s "never claims
   four unbroken hours of your attention", which this change can only help.

**Commit:** `--include src/lib/time.ts` alone. It is the only source file this ticket touches
and it should be readable as one diff.

---

## Step 10 — the aka correction

Drop `crockpot corned beef and cabbage` from
`recipes/stews-and-braises/corned-beef-slow-cooker.cook`.

**Verify:** `node scripts/check-recipes.mjs` on that file; then re-run the aka collision pass
and confirm the pair is gone and nothing else changed.

**Commit:** `--include recipes/stews-and-braises/corned-beef-slow-cooker.cook`.

---

## Step 11 — read the whole collection (no commit)

The measurements the work artifact has to carry. Run against the tree as it now is, after every
recipe edit and after Step 9, because every number here changes if it is taken early.

1. **The three-way kit choice.** For at least three dishes existing as plain + Instant Pot +
   Slow Cooker, report total and hands-on for all nine files. Thirteen such dishes exist; take
   the three the appliance is sold on and give the full thirteen as a table.
2. **The clock on the new bargains.** Recompute the hands-on-dominant list across the 144 new
   files. Confirm `buri-daikon` has left it. Confirm every survivor is short enough that
   hands-on dominance is the truth.
3. **Duplicates.** Re-run all three passes — `dish:` key, normalised title, `aka` collision —
   and record what was checked, not just what was found.
4. **Pairings.** `760 mutual, 0 dangling, 0 one-way, 0 self` from `collection.test.ts`.
5. **The front page.** Open `dist/index.html` after the build and read the counter row as a
   visitor would. Verdict plus what I would do about it.

**Verify:** every number in the work artifact traces to a command that was run, not to
Research. Research was taken before 200 files changed.

---

## Step 12 — the three gap docs

Runs after `npm run recipes` has been re-run, so the `What it has` blocks are written from the
shelf that now exists.

Per file: headline count, `What it has` from `recipes.json`, missing list with what has been
written moved out, closing block. `soup-pot.md` also gets its `## What is already here`
renamed to `## What it has`.

**Verify:**

1. `node scripts/menu-sections.mjs` (no `--write`) → every section parses, every slug resolves,
   nothing reported as listed-but-not-shelved for these three counters.
2. Every slug named under `What it has` actually names that counter in its own file.
3. The counts in the headline match `recipes.json`.

**Commit:** `--include docs/gaps/soup-pot.md docs/gaps/japanese-home.md
docs/gaps/slow-cooker.md`.

---

## Step 13 — `npm run verify`, in full

`check` → `recipes` → `vitest run` → `astro build`. All four. Paste the output into the work
artifact rather than describing it.

If `astro build` produces a different page count than before, say why — 682 pages was the count
T-002-09 recorded and this ticket adds no pages, so it should be 682.

---

## Step 14 — Review

`review.md` and `review-disposition.json`, then `lisa check-disposition T-003-07`, then stop.

Before writing either: `git status --porcelain` must show nothing of this ticket's staged,
modified or untracked. Every edit went through `lisa commit-ticket` or it did not happen.

---

## What could go wrong, and what happens then

**A slack line fails `check-recipes.mjs`.** Almost certainly an em dash inside the reason being
read as the separator, or a level typo. Fixed in the batch, not carried.

**`parboil` moves a timer nobody expected.** The blast radius was measured before the edit —
seven timers, six files. If an eighth moves, the assumption was wrong and the change comes back
out rather than being patched around.

**A gap doc's `What it has` block stops parsing.** `menu-sections.mjs` reports rather than
guesses, so this is visible and local. The block shape is `**Title.** slug · slug`, and the
failure is nearly always a slug that no longer exists.

**The backfill runs out of room before the predicate is empty.** Then it stops on a batch
boundary, the artifact says exactly which batches landed and which did not, and the count of
what remains is reported honestly rather than rounded. A partial backfill is the expected
outcome of a ticket whose own context says it is not annotating all 514 — an incomplete one
that claims to be complete is not.
