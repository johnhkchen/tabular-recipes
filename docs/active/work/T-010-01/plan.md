# T-010-01 — Plan

Two commits of source, then a measurement pass. Each step names what it changes, how it is
verified, and what would make it wrong.

The baseline the last step diffs against was taken **before any edit**: a clean `npm run build`,
664 `<section class="timeline">` sections extracted to text, and `dist/search.json` at
253,812 bytes / 58,946 gzip / 47,603 brotli.

---

## Step 1 — The longest unbroken stretch

**Files:** `src/lib/schedule.ts`, `src/lib/schedule.test.ts`
**Commit:** `lisa commit-ticket --ticket-id T-010-01 --message "Count the stretch a cook cannot sit down in" --include src/lib/schedule.ts --include src/lib/schedule.test.ts`

### 1a. `schedule.ts`

1. `export const BREAK_MINUTES = 5;` with the comment carrying D4's argument — five minutes is the
   smallest gap you could leave the kitchen for, and 4 and 5 give identical answers on all 664, so
   the number is not deciding anything quietly.
2. `interface HandsOnSpan` and `function longestUnbroken(spans)`, with the comment carrying D2
   (timer, not task — `baguette` is 8 hands-on minutes inside a 128-minute step) and D3 (all
   branches, serialised — the critical path calls `potato-knish` restful at zero).
3. Collect spans inside `buildSchedule`'s existing loop, between the minute split (`:127-133`) and
   the `Task` literal (`:140`). Same condition as the minute split, so a timer contributes a span
   exactly when it contributes to `handsOnMinutes`.
4. `longestHandsOnMinutes: longestUnbroken(spans)` in the returned object, and the field on the
   `Schedule` interface beside `assumedHandsOnMinutes`.

### 1b. `schedule.test.ts`

5. Repair `fixture()`: add `washingUp: null,` beside `slack: null,`.
6. Five new describe blocks — one long task; short jobs around real waits; a wait too short to
   count and one just long enough; parallel branches; `handsOnEvidence` (written in step 2 but
   tested here, since both live in this module — see the note below).
7. Whole-collection properties inside `describe('every recipe')`.

**Note on ordering:** `handsOnEvidence` is written in step 1a as well, not step 2. It belongs to
`schedule.ts`, and splitting one module across two commits so the endpoint can arrive with it would
leave a commit whose tests reference a function that does not exist. Step 2 is then purely the
endpoint.

### Verification

```
npx vitest run src/lib/schedule.test.ts
```

Must pass, including the existing 40-odd assertions — the whole point is that none of them move.

**What would make this wrong:** a `longestHandsOnMinutes` greater than `handsOnMinutes` on any
recipe (means the unit slipped back to the task), or any existing assertion in `schedule.test.ts`
changing (means the clock moved).

---

## Step 2 — The index

**Files:** `src/pages/search.json.ts`, `src/pages/search.json.test.ts` (new)
**Commit:** `lisa commit-ticket --ticket-id T-010-01 --message "Put the four numbers where the front page can reach them" --include src/pages/search.json.ts --include src/pages/search.json.test.ts`

1. Import `buildSchedule` and `handsOnEvidence`.
2. Build a schedule per recipe; add `elapsedMinutes`, `handsOnMinutes`, `longestHandsOnMinutes`,
   `washingUpCount`, `evidence`.
3. `washingUpCount: recipe.washingUp?.count ?? null` — zero survives, absent becomes null.
4. Dedupe `find` token by token, first occurrence kept.
5. Extend the file's leading comment: what was added, that it is four numbers and a word rather
   than a task list, and that the repeats came out of `find` to pay for it.
6. Write `search.json.test.ts` per Structure §4.

### Verification

```
npx vitest run src/pages/search.json.test.ts
```

The load-bearing assertion is the dedupe-equivalence one: for every distinct token in the
collection and every recipe, `find.includes(token)` must answer what the undeduped string answered.
That is the contract `index.astro:109` relies on, and `index.astro` is not ours to fix if it breaks.

**What would make this wrong:** any changed answer in that probe, or a `washingUpCount` of `null`
on `memphis-dry-rub`.

---

## Step 3 — Measure, and prove the clock did not move

**No source change.** Output goes to `progress.md` and `review.md`.

1. `npm run verify` — `check-recipes`, `parse-recipes`, the full vitest run, `astro build`.
2. `dist/search.json`: raw, gzip -9 and brotli bytes, against the baseline. Report the percentages
   even if they are negative.
3. Build wall time from the `astro build` line, and `buildSchedule` over all 664 timed in isolation.
4. **The clock diff.** Re-extract the `<section class="timeline">` text of all 664 built pages and
   `diff` against the baseline. Expected: empty. This is the acceptance criterion that "nothing the
   clock computes changes", and an empty diff is the evidence.
5. The five-plus worked cases, the three-state tally, and the byte and time figures into
   `review.md`.

**What would make this wrong:** one line of clock diff. A non-empty diff means a value the Timeline
prints changed, and the ticket forbids it.

---

## Testing strategy

| What | Where | Why there |
| --- | --- | --- |
| the run's arithmetic | hand-built fixtures in `schedule.test.ts` | the shape is chosen, so the expected number can be read off it by hand |
| the break threshold | two fixtures, 3 min and 6 min | pins the constant from both sides; a change to `BREAK_MINUTES` fails loudly |
| parallel branches | a fixture, plus a named assertion that the critical-path figure differs | the ticket names this as the way to get it wrong |
| `longest <= handsOn` | property over all 664 | the invariant that the unit is the timer |
| the three states | four fixtures, plus a tally over all 664 | a rule that collapses the shelf into one bucket must fail |
| dedupe safety | property over 3,088 tokens × 664 recipes in `search.json.test.ts` | the browser's contract, and the browser is not ours |
| absent vs zero washing-up | named recipes in `search.json.test.ts` | `washing-up.ts`'s central rule, at a new boundary |
| the clock not moving | rendered-text diff of 664 pages | the only check that covers what a reader actually sees |

Named-slug assertions are a known trap in this file — `schedule.test.ts:455-464` records a test that
was wrong within one ticket of being written because the collection grew. The property tests carry
the load; the named slugs are pinned only where the ticket asks for those exact recipes to be the
cases T-010-02 designs against, and they assert derived figures rather than rankings.

## Out of scope, deliberately

- The dials, the front-page markup and any filtering UI — T-010-02.
- Auditing the collection against the filter — T-010-03.
- Annotating recipes with `washing-up` — T-008-03.
- Changing what the clock computes, or the hands-on-when-unsure fallback. S-003 argued that
  fallback; this ticket surfaces the uncertainty rather than removing it.
- `index.astro`'s `Item` type, which will need the new fields when T-010-02 reads them. Adding
  fields to the JSON does not break it today: it reads `slug`, `title`, `counters` and `find`, all
  unchanged.
