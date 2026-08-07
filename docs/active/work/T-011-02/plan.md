# T-011-02 — Plan

Six steps, six commits. Every step leaves `npm run verify` green, because no `.cook` file declares a
capacity at any point in the sequence.

`node` is not on the default PATH here: `export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"`
before any npm command.

---

## Step 1 — the reader

**Write** `src/lib/scaling.ts`: the file comment, `Capacity`, `CapacityReading`, `readCapacity()`,
`servingsOf()`, `boundSteps()`, `saysItBatches()` and the private flatten/match helpers. No cost
function yet.

**Write** `src/lib/scaling.test.ts` groups 1 and 2: the whole grammar, and the matcher against
hand-built steps plus the three real files that say "batches".

**Verify:** `npx vitest run src/lib/scaling.test.ts`.

**Commit:** `lisa commit-ticket --ticket-id T-011-02 --message "Read what the vessel holds, the
vessel, and where it binds" --include src/lib/scaling.ts --include src/lib/scaling.test.ts`

## Step 2 — the property's path through the parser

**Modify** `src/lib/tree.ts`: type-only `Capacity` import, `capacity?` and `capacityProblem?` on
`RawRecipe`.

**Modify** `scripts/normalise.mjs`: import `readCapacity`, call it before `PROMOTED` deletes the
key, add `'capacity'` to `PROMOTED`, return both fields.

**Verify:** `npm run check` (664 files, all silent on capacity because none declares one) and
`npm run recipes` (the generated JSON gains `"capacity": null` on every record).

**Commit:** `--include src/lib/tree.ts --include scripts/normalise.mjs`

## Step 3 — the check, and the two lines that disagree

**Modify** `scripts/check-recipes.mjs`: import the three helpers, add the block after
`washingUpProblem` — the reader's problem fails; a capacity binding no step fails; `c < s` with no
acknowledged batching fails, quoting both lines; a capacity on a non-numeric `>> servings:` warns.

**Write** `src/lib/scaling.test.ts` group 8: `execFileSync` against temp `.cook` fixtures, the
pattern from `washing-up.test.ts`. Four cases — the `c < s` failure with both lines in the output,
the batching-acknowledged file passing, an operation that binds nothing failing, a malformed line
failing.

**Verify:** `npm run check` still passes the whole collection; the new tests pass.

**Commit:** `--include scripts/check-recipes.mjs --include src/lib/scaling.test.ts`

## Step 4 — the cost function

**Modify** `src/lib/scaling.ts`: `Growth`, `Batches`, `Cost`, the private `splitAttention()` and
`parts()`, and `costOf()`.

The formula, and nothing else in it:

```
m = n/s                        b(k) = c ? ceil(k/c) : 1        r = b(n)/b(s)
elapsed(n)  = A_free + m·H_free + r·(A_batch + H_batch)
standing(n) =          m·H_free + r·H_batch
longest(n)  = L · max(m, r)
vessel cost = A_batch·(r − 1) + H_batch·(r − m)
```

**Write** group 3 of the tests as the first thing after: §7's five dishes and §8's two tables
against the published figures. **If any disagree, the file wins and the code is the bug** — chase it
before writing another line.

**Verify:** `npx vitest run src/lib/scaling.test.ts`.

**Commit:** `--include src/lib/scaling.ts --include src/lib/scaling.test.ts`

## Step 5 — the rest of the tests

**Write** groups 4–7: the air fryer pole (66 / 26 / 40); the five cases the acceptance criteria
list; the no-notation walk; the whole-collection properties (the re-read split reproduces the
schedule's two sums on all 664; `evidence` never stronger; `assumedStandingMinutes` grows; nothing
`NaN`).

**Verify:** `npm run verify` — the whole thing, first time end to end.

**Commit:** `--include src/lib/scaling.test.ts`

## Step 6 — the README

**Modify** `README.md`: the `capacity` bullet after `washing-up`, and the `src/lib/scaling.ts` row
in the file table.

**Verify:** `npm run verify` again.

**Commit:** `--include README.md`

---

## Testing strategy

| Kind | What it covers | Where |
| --- | --- | --- |
| Unit, pure | `readCapacity` grammar and every refusal | group 1 |
| Unit, pure | `boundSteps` / `saysItBatches` matching, including matching nothing | group 2 |
| **Oracle** | every figure `scaling.md` §3, §7 and §8 publish, at the multipliers it publishes | groups 3–4 |
| Unit, fixture | the five AC cases (3× unbounded, 3× bounded, 0.5×, no capacity, all-assumed) | group 5 |
| Contract | no printable string, no notation, in the return value | group 6 |
| Property, 664 recipes | re-read split vs `schedule.ts`; confidence never strengthens; no `NaN` | group 7 |
| Integration, real process | `check-recipes.mjs` exit codes and messages | group 8 |

**The oracle tests are the ones that matter.** They are the ticket's own criterion — *"the code
produces the numbers that file computed by hand"* — and they are what makes the model checkable by
somebody who has read the knowledge file and not the code.

## Verification criteria, in order

1. `npm run check` — 664 files draw a table, no capacity problem anywhere, exit 0.
2. `npx vitest run` — every existing test still passes; no other suite's fixtures broke on the new
   `RawRecipe` field (it is optional, so none should).
3. `npm run verify` — check, parse, test, build.
4. `grep -n 'string' src/lib/scaling.ts` on the `Cost`/`Growth`/`Batches` blocks shows no string
   member but `Confidence` (the AC's grep, done by hand as well as by test 6).
5. `git status --short` clean of ticket-owned files after the last commit.

## Risks

| Risk | Mitigation |
| --- | --- |
| A published figure does not reproduce | The file wins. Fix the code; if the file is genuinely wrong, write it up in `review.md` rather than editing the code around it. `research.md` §5 already reproduced all of them by hand, so this is unlikely. |
| The optional `capacity?` field breaks another suite's fixtures | It is optional exactly so it cannot. Step 2 runs the whole suite. |
| The word matcher is too clever and matches the wrong step | Failure is loud (the check fails, listing labels) and the rule is three lines. |
| `check-recipes.mjs` importing `scaling.ts` pulls `schedule.ts` into the checker | Both are pure and already imported transitively via `tree.ts`; `npm run check` timing is measured in step 3. |
