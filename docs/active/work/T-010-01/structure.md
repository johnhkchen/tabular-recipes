# T-010-01 — Structure

The blueprint. Four files, two of them new. No file outside this list is touched.

| File | Change |
| --- | --- |
| `src/lib/schedule.ts` | modified — one new `Schedule` field, one new exported function, two internals |
| `src/lib/schedule.test.ts` | modified — four new describe blocks, one fixture repair |
| `src/pages/search.json.ts` | modified — five fields per record, a deduped `find` |
| `src/pages/search.json.test.ts` | **created** — the endpoint has no test today |

Not touched: `src/pages/index.astro`, `src/components/Timeline.astro`, `src/lib/time.ts`,
`src/lib/tree.ts`, `src/lib/washing-up.ts`, `scripts/**`, every `.cook` file, `src/data/**`.

---

## 1. `src/lib/schedule.ts`

### 1.1 New public surface

```ts
/**
 * Idle time that counts as a break …
 */
export const BREAK_MINUTES = 5;

export interface Schedule {
  …                                  // every existing field, unchanged
  /** The longest run of hands-on work with no break in it. Never more than handsOnMinutes. */
  longestHandsOnMinutes: number;
}

/** Whether the hands-on figure is the author's, ours, or nobody's. */
export function handsOnEvidence(schedule: Schedule): Confidence;
```

`Confidence` already exists at `:31` and is already exported. Nothing is renamed.

### 1.2 New internals

```ts
/** A stretch of hands-on work: one hands-on timer, at its place in the schedule. */
interface HandsOnSpan {
  start: number;
  minutes: number;
  /** Task id and column, for a deterministic order when two start together. */
  id: string;
  column: number;
}

function longestUnbroken(spans: HandsOnSpan[]): number;
```

`longestUnbroken` sorts by `start`, then `column`, then `id` — the same tie-break `packLanes()`
uses at `:254-256`, so two modules never order the same two tasks differently — then walks:

```
cursor = 0; run = 0; longest = 0
for span of sorted:
  at = max(cursor, span.start)          // a cook cannot be in two places
  if (at - cursor >= BREAK_MINUTES) run = 0
  run += span.minutes
  cursor = at + span.minutes
  longest = max(longest, run)
return round(longest)
```

### 1.3 Where the spans come from

Inside `buildSchedule`'s existing per-operation loop (`:111-154`), after `timers` is filtered at
`:122-124` and while each timer's `attention` is still in hand. Timers within a step run in order
from the task's start — the same order `regionsOf()` in `time.ts:154` slices the label in — so a
running offset gives each its position:

```ts
let at = start;
for (const timer of timers) {
  if (timer.attention !== 'unattended' && timer.minutes > 0) {
    spans.push({ start: at, minutes: timer.minutes, id, column: op.col });
  }
  at += timer.minutes;
}
```

The condition mirrors the existing minute split at `:128-132` (`if unattended … else hands-on`), so
a timer contributes a span exactly when it contributes to `handsOnMinutes`. That equivalence is what
makes `longestHandsOnMinutes <= handsOnMinutes` true by construction, and it is asserted in the
tests over the whole collection.

`start` and `id` are needed before the `Task` literal is built at `:140`; both are already computed
above it (`:138`, `idOf(op)`), so the span push sits between the minute split and the task literal
with no reordering of anything else.

### 1.4 The verdict

```ts
export function handsOnEvidence(schedule: Schedule): Confidence {
  if (schedule.totalMinutes === 0) return 'unknown';
  if (schedule.handsOnMinutes === 0 && schedule.untimedCount > 0) return 'unknown';
  if (schedule.assumedHandsOnMinutes > 0) return 'unknown';
  if (schedule.tasks.every((task) => task.confidence === 'stated')) return 'stated';
  return 'inferred';
}
```

A function over a finished `Schedule` rather than a field, following `attentionIsOurs()` at `:207`:
it is a summary *for a filter*, not something the clock needs, and every input it reads is already
public. `Task.confidence` is `'unknown'` for an untimed task, so the `stated` test also covers
`untimedCount === 0` without saying it twice.

### 1.5 What is NOT changed

`round`, `idOf`, `opsDeepestFirst`, `attentionOfTask`, `attentionIsOurs`, `confidenceOfTask`,
`criticalPathTo`, `packLanes`, `authorMinutesOf`, and every value in the returned object other than
the added field. The fallback stays hands-on-when-unsure; `assumedHandsOnMinutes` and
`untimedCount` keep their meanings.

## 2. `src/pages/search.json.ts`

Shape after the change:

```ts
import { buildSchedule, handsOnEvidence } from '../lib/schedule.ts';

export function GET() {
  const index = (recipes as unknown as RawRecipe[])
    .map((recipe) => {
      const schedule = buildSchedule(recipe);
      return {
        slug, title, counters,
        find: unique([...]),                      // deduped, see below
        elapsedMinutes: schedule.totalMinutes,
        handsOnMinutes: schedule.handsOnMinutes,
        longestHandsOnMinutes: schedule.longestHandsOnMinutes,
        washingUpCount: recipe.washingUp?.count ?? null,
        evidence: handsOnEvidence(schedule),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
  …
}
```

`unique()` is a local helper — split the joined string on whitespace, `new Set`, join with a single
space. First-occurrence order is kept, which keeps a diff of the file readable even though no
result depends on it.

`recipe.washingUp?.count ?? null` is deliberate: `WashingUp.count` is `items.length` and can be `0`,
so `?.` (not `??` on the count) is what keeps zero from turning into null. `memphis-dry-rub` is the
case that proves it.

Sort order, key order and the response headers are unchanged.

The file's leading comment gains a paragraph: what the new fields are, that they are four numbers
and a word rather than a task list, and that the repeats came out of `find` to pay for them.

## 3. `src/lib/schedule.test.ts`

One repair and four new blocks. Existing blocks are not edited.

**Repair.** `fixture()` at `:55-82` returns a `RawRecipe` literal with no `washingUp`, which
`tree.ts:72` has required since T-008-01. Vitest does not typecheck and `astro build` does not reach
test files, so nothing fails today — but this ticket adds tests through the same helper and should
not add to a latent type error. One line: `washingUp: null,` beside `slack: null,`.

**New blocks**, all through `buildSchedule` on hand-built fixtures, matching the file's existing
style:

1. **`the longest stretch with one long hands-on task`** — a single `stir 30 min` hands-on task.
   Expects `longestHandsOnMinutes === 30`, equal to `handsOnMinutes`.
2. **`the longest stretch with short jobs around real waits`** — three 10-minute hands-on tasks
   chained through two 40-minute rests. Expects `handsOnMinutes === 30` and
   `longestHandsOnMinutes === 10`: the same half-hour of work, a different evening. This is the
   pair the story is built on, in fixture form.
3. **`a wait too short to count as a break`** — two 10-minute hands-on tasks separated by a
   3-minute unattended task. Expects `20`, and a second fixture with a 6-minute wait expects `10`,
   so the constant is pinned from both sides. The assertions read `BREAK_MINUTES` where they can, so
   the test says what the boundary is rather than repeating the number.
4. **`parallel branches`** — two 25-minute hands-on tasks from zero merging into a 2-minute one, the
   `mujaddara` shape. Expects `52`, and asserts explicitly that measuring along `criticalPath` would
   have said 27 — the number the ticket says must not be reported.
5. **`what the hands-on figure rests on`** — `handsOnEvidence` over four fixtures: all named timers
   (`stated`), all read off the step (`inferred`), one assumed minute (`unknown`), nothing timed at
   all (`unknown`).

**Whole-collection properties**, added inside the existing `describe('every recipe')` block:

- `longestHandsOnMinutes <= handsOnMinutes` on all 664, and `>= 0`.
- `longestHandsOnMinutes > 0` if and only if `handsOnMinutes > 0`.
- `handsOnEvidence` returns one of the three words for every recipe, and the tally is reported so a
  future change that collapses the collection into one bucket fails loudly.
- Named regressions on the recipes the work artifact argues from: `mujaddara` 52,
  `chile-verde-slow-cooker` 22, `patty-melt` 45, `tortilla-espanola` 20, and
  `french-onion-soup` / `beef-rendang` / `cheese-grits` / `blondies` all `unknown`.

## 4. `src/pages/search.json.test.ts` (new)

Astro endpoints are plain modules; `GET()` can be called directly and its `Response` read with
`await response.json()`. No Astro runtime is needed.

Covers:

- Every record carries all nine keys, and `evidence` is one of the three words.
- `find` has no repeated token, and — the property that makes the dedupe safe — **for every distinct
  token in the collection and every recipe, `find.includes(token)` matches what the undeduped string
  would have answered.** This is the guarantee `index.astro` depends on, so it is asserted rather
  than assumed.
- `washingUpCount` is `0` for `memphis-dry-rub`, `5` for `general-tsos-chicken`, `null` for a recipe
  that never declared — the absent/zero line from `washing-up.ts` held at the index boundary.
- The four numbers agree with `buildSchedule` on the same recipe, so the endpoint cannot drift from
  the module.
- `content-type` and the title sort are unchanged.

## 5. Order of work

1. `schedule.ts` — spans, `BREAK_MINUTES`, `longestUnbroken`, the field. Commit with its tests.
2. `schedule.test.ts` — fixture repair, five blocks, collection properties. Same commit as 1;
   neither is meaningful alone.
3. `search.json.ts` + `search.json.test.ts`. Second commit.
4. Measurement pass: rebuild, diff the rendered clock of all 664 pages against the baseline taken
   before any change, and record `dist/search.json` before/after and the build time. No source
   change; the numbers go in `progress.md` and `review.md`.

Step 4 depends on a baseline captured **before** step 1, which has been taken: 664 clock sections
extracted from a clean `dist/`, and `dist/search.json` at 253,812 bytes.
