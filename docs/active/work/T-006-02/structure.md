# T-006-02 — Structure

Fourteen files, one line each. No module boundaries move; nothing is created or deleted in the
source tree.

## Files modified — exactly fourteen, one line in each

| # | Path | Line to change | Old | New |
| --- | --- | --- | --- | --- |
| 1 | `recipes/soups/chintan-broth.cook` | `>> time:` | `5 hr 30 min` | `9 hr 30 min` |
| 2 | `recipes/dressings-and-dips/sour-dill-pickles.cook` | `>> time:` | `23 days` | `23 days 2 hr` |
| 3 | `recipes/spice-blends-and-marinades/bulgogi-marinade.cook` | `>> time:` | `15 min` | `2 hr 15 min` |
| 4 | `recipes/bars-and-brownies/baklava.cook` | `>> time:` | `3 hr 30 min` | `7 hr 30 min` |
| 5 | `recipes/breads/no-knead-bread.cook` | `>> time:` | `20 hr` | `20 hr 45 min` |
| 6 | `recipes/breads/focaccia.cook` | `>> time:` | `20 hr` | `20 hr 25 min` |
| 7 | `recipes/dressings-and-dips/mint-chutney.cook` | `>> time:` | `15 min` | `45 min` |
| 8 | `recipes/custards-and-puddings/chocoflan.cook` | `>> time:` | `6 hr` | `6 hr 10 min` |
| 9 | `recipes/custards-and-puddings/lotus-seed-paste.cook` | `>> time:` | `6 hr 15 min` | `6 hr 30 min` |
| 10 | `recipes/breads/deli-rye-bread.cook` | `>> time:` | `15 hr` | `15 hr 15 min` |
| 11 | `recipes/flatbreads-and-pancakes/turnip-cake.cook` | `>> time:` | `14 hr` | `14 hr 15 min` |
| 12 | `recipes/stews-and-braises/chicken-adobo.cook` | `>> time:` | `1 hr 30 min` | `1 hr 45 min` |
| 13 | `recipes/flatbreads-and-pancakes/taro-cake.cook` | `>> time:` | `14 hr` | `14 hr 10 min` |
| 14 | `recipes/breads/teleras.cook` | `>> time:` | `2 hr 50 min` | `2 hr 55 min` |

Each edit replaces the whole line `>> time: <old>` with `>> time: <new>`. The `>> time:` key
appears once per file, on its own line, so each edit is unambiguous.

## Files NOT modified, and why that matters

- **`src/**`** — the chip prints `recipe.metadata.time` verbatim and the clock is computed from
  timers. Neither needs a code change, and T-006-01 owns those files this cycle.
- **`scripts/check-recipes.mjs`** — a rule that catches a header below its timers belongs here and
  is out of scope (Design, "not done").
- **`src/generated/recipes.json`** and **`dist/`** — build products. `npm run build` regenerates
  both. `src/generated/recipes.json` is tracked, so its regeneration must be checked against the
  repo's convention before committing (see Ordering, step 0).
- **The other 644 recipes**, including the ~602 where the clock sits below the chip. Those are
  floors under estimates and are correct.

## Ordering

0. **Establish whether `src/generated/recipes.json` is tracked** and whether prior recipe-content
   commits included it. `npm run build` and `npm run verify` both regenerate it, so it will be
   dirty after the first build whether or not it is meant to be committed. If tracked and
   previously committed alongside recipe edits, it is a ticket-owned path for this ticket and goes
   in the same `lisa commit-ticket --include` list; if it is ignored, it must not be included.
   Resolve this before the first commit, not after.
1. Edit all fourteen `>> time:` lines. No build in between — the fourteen edits are independent of
   one another and none affects the clock.
2. `npm run build`, then re-run `compare-clock-to-chip.mjs`. Expect `clock GREATER than chip: 0`.
3. Snapshot into `figures-after.json`; diff against `figures-before.json`. Expect exactly fourteen
   pages differing, all in the `chip` field only, and no page differing in `total` or `needsYou`.
4. `git diff -- recipes/` — expect fourteen `-`/`+` pairs, all `>> time:` lines.
5. `npm run verify`.
6. `lisa commit-ticket` with the exact fourteen paths (plus `src/generated/recipes.json` only if
   step 0 says it belongs).

Steps 2–5 are all read-only checks; only step 1 mutates the source tree.

## Interfaces and invariants this must preserve

- **`authorMinutesOf` must be able to read every new figure.** It accepts a sequence of
  number-unit pairs with nothing left over. All fourteen new strings are of that shape;
  `23 days 2 hr` is the only two-unit one and `days` is a known unit. A figure that failed to
  parse would make `schedule.authorMinutes` null — invisible on the page today, but a silent
  regression for anything that later uses it. Verified by re-running the comparison script, whose
  `unreadable` count must stay at 0.
- **The five-minute grain.** Every `>> time:` in the collection resolves to a multiple of five
  minutes; all fourteen new figures do too.
- **The clock must not move.** `Start to finish` and `Needs you` are functions of timers alone.
  If any of them changes between the before and after snapshots, a timer was touched by accident
  and the change must be reverted.
- **Line shape.** `>> time: ` with a single space after the colon, matching the other 644 files
  and the surrounding metadata block; the line keeps its position between `>> servings:` and
  `>> slack:` (or `>> step.1:` where there is no slack line, as in `mint-chutney`).

## Artifacts produced by this ticket

Under `.lisa/attempts/T-006-02/1/work/`, published by Lisa to `docs/active/work/T-006-02/`:

- `research.md`, `design.md`, `structure.md`, `plan.md`, `progress.md`, `review.md`,
  `review-disposition.json`
- `compare-clock-to-chip.mjs` — the 658-page comparison, re-runnable
- `explain-fourteen.mjs` — prints the critical path behind each of the fourteen clocks
- `snapshot-figures.mjs`, `figures-before.json`, `figures-after.json` — the "nothing else moved"
  evidence
- `time-lines.diff` — the diff restricted to `>> time:` lines, for the acceptance criterion that
  asks to see it

These are work artifacts, not source: none of them ships in the site or runs in `npm run verify`.
