# T-002-01 — Plan

Three steps, one commit each, each independently verifiable. Baseline captured before anything
moves.

## Step 0 — baseline (done during Research)

```
node scripts/check-recipes.mjs   → all 514 file(s) draw a table.
npx vitest run                   → 7 files, 666 tests, all passed
```

Both numbers are what every later step is compared against. Recorded in `progress.md`.

---

## Step 1 — open the three counters

**Edit:** `src/data/counters.json`. Append the three entries from `structure.md` §1 to the end of
the `counters` array, five keys each in the fifteen's order, `categories: []`, `sections` with
empty `items`.

**Verify, in order:**

1. `node -e "…"` — the file parses; `.counters.length === 18`; no duplicate `name` or `slug`; all
   three carry `categories: []` and every `items` is `[]`.
2. `node scripts/check-recipes.mjs` — must still report **all 514 file(s) draw a table**. This is
   AC 2: the three new counters must not disturb the collection.
3. `node scripts/parse-recipes.mjs` — must still report 514 recipes, **0 inferred from category**.
   A non-zero inferred count would mean a `categories` entry leaked.
   `src/generated/recipes.json` is a build artifact and is regenerated identically; confirm with
   `git status` that it is unchanged, and do not include it in the commit.
4. `npx vitest run` — 666 pass. `collection.test.ts` "only names counters that exist" reads this
   file directly.
5. **AC 3 demonstration.** Write one throwaway `.cook` file *outside the repository*, in the
   session scratchpad, naming all three new counters on one `>> counters:` line. Run
   `node scripts/check-recipes.mjs <abs-path>` and paste the transcript into `progress.md`.
   Repeat with one deliberately misspelled counter to show the check still rejects an unknown
   name. Delete the file. Nothing under `recipes/` is created, so `parse-recipes.mjs` never sees
   it and the 514 count cannot move.

**Commit:** `lisa commit-ticket --ticket-id T-002-01 --message "Open the three shelves" --include src/data/counters.json`

**Rollback if verification fails:** the change is three appended array entries; revert the file
and re-run steps 2–4.

---

## Step 2 — teach the clock that pressure cooking is waiting

**Edit:** `src/lib/time.ts`. Add nine words to `UNATTENDED` and the explanatory comment from
`structure.md` §2. Nothing else in the file moves.

**Verify, in order:**

1. `npx vitest run` — **666 pass, unchanged**. This is the whole regression story, because
   `time.test.ts` (39 assertions over `attentionOf`/`readTimers`) and `collection.test.ts` (the
   four-hour invariant across 514 recipes) both exercise the changed set. A drop in the count, or
   any new failure, means a word started lying.
2. **AC 5 assertions**, via a throwaway script in the scratchpad that imports `time.ts` and prints
   the readings. Transcript pasted into `progress.md`. Cases:
   - `attentionOf('pressure cook')` → `{ unattended, name }`
   - `attentionOf('natural release')` → `{ unattended, name }`
   - `attentionOf('quick release')`, `attentionOf('come to pressure')` → `{ unattended, name }`
   - `attentionOf(null, 'cook at high pressure 35 min')` → `{ unattended, label }`
     (the unnamed-timer path the bare `pressure` word exists for)
3. **Guard assertions** in the same script, each one a thing the change could have broken:
   - `attentionOf('blind bake', 'bake the shell 20 min')` → `{ unattended, name }` — unknown names
     still fall through rather than defaulting.
   - `attentionOf(null, 'until the mushrooms release their liquid, 8 min')` → **not** unattended —
     bare `release` was deliberately left out.
   - `attentionOf(null, 'seal the edges and crimp')` → **not** unattended — bare `seal` likewise.
   - `readTimers([{name:'saute',text:'8 min'},{name:'pressure cook',text:'35 min'}], 'saute the onions 8 min, then pressure cook 35 min')`
     → `[hands-on, unattended]` — region splitting still gives each timer its own words.
4. `node scripts/check-recipes.mjs` — 514 still ok. `check-recipes` runs the same tree/layout path
   and would surface a crash in `time.ts`.

**Explicit gap, carried to Review:** AC 8 forbids touching `src/lib/time.test.ts`, so steps 2 and
3 above are a transcript in a work artifact rather than a committed test. The follow-up is one
`describe` block and is named in `review.md`.

**Commit:** `lisa commit-ticket --ticket-id T-002-01 --message "Teach the clock that pressure is a wait" --include src/lib/time.ts`

---

## Step 3 — write the three work lists

**Create:** `docs/gaps/bowl-shop.md`, `docs/gaps/instant-pot.md`, `docs/gaps/one-pot.md`, to the
skeleton in `structure.md` §3.

Written in this order, because each is a different kind of job and the middle one is the one with
a hard numeric criterion:

1. `instant-pot.md` — AC 6 wants ≥25 existing dishes with slugs. Do it first, count it, and the
   riskiest criterion is closed early.
2. `one-pot.md` — the largest already-here block; grounded in `cookware`.
3. `bowl-shop.md` — the most external-menu work (Goop Kitchen, Sweetgreen, Cava, Dig).

**Verify:**

1. **Every slug named in an already-here block is real.** Script over the three files: extract
   every `[a-z0-9-]+` token from the `## What is already here` block, check membership in
   `src/generated/recipes.json` slugs, print anything unmatched. Must print nothing. This is the
   one mechanical failure mode of a hand-written list, and AC 5 says "listing real slugs".
2. **Instant Pot names ≥ 25 distinct existing slugs.** Same script, counted. Print the number.
3. **`menu-sections.mjs` is not disturbed.** `node scripts/menu-sections.mjs` (dry run, writes
   nothing) must report the same 15 counters as before plus three `no gap note` → and after these
   files exist, three `gap note has no "What it has" block`. Both are pre-existing report lines
   for an un-stocked counter, not errors; the check is that **no existing counter's line changes**.
   Transcript before and after in `progress.md`.
4. Each file has the four required headings: already-here, ranked missing, components, could-not-
   stock (AC 5 requires three of the four; the components block is the fifteen's convention).
5. `npx vitest run` and `node scripts/check-recipes.mjs` once more — markdown cannot affect
   either, so this is a cheap tripwire against an accidental stray edit.

**Commit:** `lisa commit-ticket --ticket-id T-002-01 --message "Write the three work lists" --include docs/gaps/bowl-shop.md --include docs/gaps/instant-pot.md --include docs/gaps/one-pot.md`

---

## Step 4 — final gate before Review

1. `npm run verify` end to end — `check → recipes → vitest → astro build`. Must pass, and the
   build must produce **no** `/menu/bowl-shop`, `/menu/instant-pot` or `/menu/one-pot` page,
   because all three counters are empty (`counters.ts:109-114`,
   `[counter].astro:12-18`). Confirmed by listing `dist/menu/`.
2. `git status --porcelain` — the only paths that may appear are the three committed ones and
   `docs/active/tickets/T-002-01-open-the-three-shelves.md` (pre-existing, Lisa's). No ticket-owned
   file left staged, modified or untracked (workflow rule at `rdspi-workflow.md:45`).
   `src/generated/recipes.json` must be unchanged.
3. Write `review.md` and `review-disposition.json`, then `lisa check-disposition T-002-01`.

---

## Testing strategy, stated plainly

| What | How it is covered | Confidence |
| --- | --- | --- |
| Counter names now validate | `check-recipes.mjs` on a throwaway file naming all three | High — it is the exact gate the writers hit |
| Nothing re-shelved | `parse-recipes.mjs` "0 inferred from category" + 666 tests | High |
| Collection undisturbed | 514 files draw a table, byte-identical `recipes.json` | High |
| Pressure timers read as waits | Existing 666 tests for regressions; scratch script for the new cases | **Medium** — the new behaviour has no committed test, by AC 8 |
| The four-hour invariant | `collection.test.ts:77-88`, unchanged and green | High |
| Gap-note slugs are real | Script checking every token against the generated slugs | High |
| Gap-note *judgement* (rankings, what a table cannot hold) | Human review | Low by nature — this is the part a reviewer must read |

## Risks

- **A word in `UNATTENDED` that lies.** Mitigated by grepping the corpus first (`pressure`: 0
  hits) and by leaving `release`, `vent` and `seal` out. Residual risk sits with future files.
- **The Bowl Shop already-here list over-claiming.** A recipe being *listable* at the Bowl Shop is
  a judgement, not a fact; the file says so, and T-002-08 makes the actual assignments.
- **`menu-sections.mjs --write` run by hand later** against a `## What it has` heading these files
  deliberately do not use. Each file carries a line saying why, so the next person is not
  surprised.
