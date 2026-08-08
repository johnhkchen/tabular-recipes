# T-011-02 — Structure

Five files touched, one of them new. Nothing else in the repository is in scope.

| File | Action | Rough size |
| --- | --- | ---: |
| `src/lib/scaling.ts` | **new** | ~330 lines |
| `src/lib/scaling.test.ts` | **new** | ~420 lines |
| `src/lib/tree.ts` | modified | +14 |
| `scripts/normalise.mjs` | modified | +12 |
| `scripts/check-recipes.mjs` | modified | +45 |
| `README.md` | modified | +30 |

---

## 1. `src/lib/scaling.ts` — new

Two halves in one file (D3): the reader that turns a line into a `Capacity`, and the cost function.
No imports from `astro`, no DOM, nothing that renders. Imports: `readTimers` from `./time.ts`,
`buildSchedule`/`handsOnEvidence` and the `Confidence`/`Schedule`/`Task` types from `./schedule.ts`,
`RawRecipe`/`RawStep` types from `./tree.ts`.

### Public surface

```ts
export interface Capacity {
  /** Servings the limiting vessel holds at once. Finite and > 0. */
  servings: number;
  /** The vessel, in the author's words: "one 12-inch skillet". Never empty. */
  vessel: string;
  /** The operations it bounds, in the author's words. Never empty. */
  operations: string[];
}

export interface CapacityReading { capacity: Capacity | null; problem: string | null }

/** `>> capacity: 2 — the wok, sear` → whole, or nothing and the reason why. */
export function readCapacity(value: string | null | undefined): CapacityReading;

/** Servings the recipe is written for: the leading number of `>> servings:`, or null. */
export function servingsOf(recipe: RawRecipe): number | null;

/** Indices of the steps a capacity binds. Empty means it binds nothing — a fault, not a fact. */
export function boundSteps(recipe: RawRecipe, capacity: Capacity): number[];

/** True when a bound step's own words say it batches. Decides D5's check. */
export function saysItBatches(recipe: RawRecipe, capacity: Capacity): boolean;

/** The cost function. Pass the schedule if you have one; it is not built twice. */
export function costOf(recipe: RawRecipe, wanted: number, schedule?: Schedule): Cost | null;
```

`costOf` returns `null` for a recipe whose `>> servings:` does not read as a number, or a
non-positive `wanted` — there is no baseline to scale from, and a caller must not be handed a
fabricated one. Everything else returns a `Cost`.

### The returned shape (D7 — numbers, booleans, one enum)

```ts
export interface Growth {
  /** The figure at the servings the recipe is written for. */
  written: number;
  /** The same figure at the target. */
  at: number;
  /** at / written, or null when `written` is 0 — nothing to have grown from. */
  factor: number | null;
  /** True when the figure did not move. §6's "costs you nothing extra", asked directly. */
  flat: boolean;
}

export interface Batches {
  /** ceil(s/c) — loads the recipe already needs as written. 1 when no capacity is declared. */
  written: number;
  /** ceil(n/c) — loads at the target. */
  at: number;
  /** at / written. §2's `r`. */
  ratio: number;
  /** True when the target needs more loads than the written recipe does. */
  binds: boolean;
  /** Minutes the vessel costs over the same recipe with none: A_batch(r−1) + H_batch(r−m). */
  costMinutes: number;
}

export interface Cost {
  /** Whether a capacity was declared at all. §6's "nobody has measured what the pan holds". */
  bounded: boolean;
  servings: { written: number; at: number; multiplier: number };
  batches: Batches;
  /** Clock time, one cook. §2's elapsed(n). */
  elapsed: Growth;
  /** Time you are standing there. §2's standing(n). */
  standing: Growth;
  /** T-010-01's longest unbroken stretch, grown by max(m, r) — D8. */
  longest: Growth;
  /** handsOnEvidence(schedule), unchanged: never stronger than the figure it scaled. */
  evidence: Confidence;
  /** The part of `standing.at` that is there only because nothing was said. */
  assumedStandingMinutes: number;
  /** Operations the recipe never timed. §6's "…plus four steps the recipe never times". */
  untimedCount: number;
}
```

### Internal organisation, top to bottom

1. **File comment.** The two rules it inherits (authored, never derived; the value is in the vessel
   and the operation), the one boundary the ticket sets (`O(·)` freely here, never in a return
   value), and the pointer to `docs/knowledge/scaling.md` as the authority.
2. `Capacity`, `CapacityReading`, `readCapacity()`, plus the private `isBatchClaim()`.
3. `servingsOf()`, the flattener, the word matcher, `boundSteps()`, `saysItBatches()`.
4. `splitAttention(recipe, task)` — private, D6: re-read one task's timers and return
   `{ handsOn, unattended }`. The one place the schedule's reading is repeated.
5. `parts()` — private: from a recipe and its schedule, `{ A, H, aBatch, hBatch, longest, ... }`.
6. `costOf()` — the formula, and only the formula, from those parts.
7. `growth()` — private, builds a `Growth`.

### Where the numbers come from

| Symbol | Source |
| --- | --- |
| `s` | `servingsOf(recipe)` |
| `n` | the caller |
| `m` | `n / s` |
| `c` | `recipe.capacity?.servings` |
| `b(k)` | `Math.ceil(k / c)`, or 1 with no capacity |
| `A` | unattended minutes of `schedule.criticalPath` tasks, timer by timer (D6) |
| `H` | `schedule.handsOnMinutes` |
| `A_batch` | the part of `A` in steps `boundSteps()` returns |
| `H_batch` | hands-on minutes in those steps, across **all** branches — same basis as `H` |
| `L` | `schedule.longestHandsOnMinutes` |

---

## 2. `src/lib/tree.ts` — modified

`import type { Capacity } from './scaling.ts';` beside the existing `Slack` and `WashingUp` type
imports, and two fields on `RawRecipe` after `washingUpProblem`:

```ts
  /**
   * How many servings the limiting vessel holds, the vessel, and the operations it bounds.
   * Authored, never derived, and absent on almost every file — see src/lib/scaling.ts.
   */
  capacity?: Capacity | null;
  /** What is wrong with a `>> capacity:` line that is there but not whole. A diagnostic. */
  capacityProblem?: string | null;
```

**Optional, not required** — `slack` and `washingUp` are required, but making `capacity` required
breaks every hand-built `RawRecipe` fixture in `schedule.test.ts` and `layout.test.ts`, which are
other tickets' files. Optional is also the honest type for a field older generated data does not
carry. `scaling.ts` reads `recipe.capacity ?? null` everywhere.

The type-only import is erased at build, so the `tree.ts ↔ scaling.ts` cycle does not exist at
runtime.

---

## 3. `scripts/normalise.mjs` — modified

Three edits, each mirroring the `washing-up` block directly above it:

1. `import { readCapacity } from '../src/lib/scaling.ts';` beside the other lib imports.
2. After the `readWashingUp` call and **before** `PROMOTED` deletes the key:
   `const { capacity, problem: capacityProblem } = readCapacity(metadata.capacity);`
   with the comment saying why it is authored and why the operation has to be in the line.
3. `'capacity'` added to `PROMOTED`; `capacity` and `capacityProblem` added to the returned object,
   with the `>> capacity: 2 — the wok, sear` example in the doc comment as `slack` has.

---

## 4. `scripts/check-recipes.mjs` — modified

Imports `boundSteps`, `saysItBatches`, `servingsOf` from `../src/lib/scaling.ts`. One block after
the `washingUpProblem` line, in the same shape: **problems fail, notes warn.**

| Condition | Disposition | Message |
| --- | --- | --- |
| `capacityProblem` | fail | the reader's own reason (unknown number, missing vessel, missing operation, a batch claim) |
| a capacity whose operations match **no** step | fail | names the entries that matched nothing and prints the step labels it tried |
| `c < s` and no bound step says it batches | fail | quotes **both lines** — `>> capacity: …` and `>> servings: …` — and names the two readings |
| `c < s` and a bound step says it batches | silent | the recipe already batches and says so; `b(s) > 1` is the model working |
| a capacity on a file whose `>> servings:` is not a number | note | the six `N cups` files; the comparison cannot be made |

The `c < s` message, shaped so the two lines are unmissable:

```
capacity and servings disagree — one of these two lines is wrong:
         >> capacity: 4 — the basket, roast
         >> servings: 8
       the pan holds fewer servings than the recipe makes, so either the number is
       wrong, or the recipe already batches and does not say so — say it where it
       happens ("in two batches"), the way beef-with-broccoli does
```

No new entry in `CAPS`: the capacity line is a number, a vessel and a verb, and a cap on it would be
a number nobody measured. Noted in `review.md`.

---

## 5. `src/lib/scaling.test.ts` — new

Seven groups. Fixtures are hand-built `RawRecipe`s in the style of `schedule.test.ts`'s `fixture()`
(a local copy — that helper is not exported), plus real recipes read from
`src/generated/recipes.json` with a capacity **spread on in the test** so no `.cook` file declares
one.

1. **`readCapacity`** — the whole grammar: a good line; punctuation variants; several operations;
   `6 servings —`; no number; zero and negative; a batch claim; vessel only; empty; absent.
2. **`boundSteps` / `saysItBatches`** — matching by prefix in either direction, matching nothing,
   matching two steps, and the three real files that say "batches" in a label or a body.
3. **The four worked examples** (AC): §7's five real dishes and §8's two tables, asserted against
   the exact figures `scaling.md` publishes, at the multipliers it publishes them at. Plus §3's
   `beef-with-broccoli` at 12, 2 and 18 with `c = 2` spread on, and its 102-minute wrong answer
   asserted as *not* what the code returns.
4. **The air fryer pole** — the §7 fixture: `c = 4`, a 20-minute unattended batch, `H ≈ 2`; 66
   minutes at `n = 12`, 26 with the capacity taken away, so the basket costs 40.
5. **The five cases the AC lists** — unbounded at 3× (elapsed flat, hands-on tripled); bounded at 3×
   (both up by the batch ratio); 0.5× (no batching, hands-on halved); no capacity declared; a recipe
   whose hands-on figure is entirely assumed.
6. **No notation escapes** — walk the returned object and assert every string in it is one of
   `stated`/`inferred`/`unknown`; assert no value matches `/O\(|batch|×/i`.
7. **Whole-collection properties** — the re-read split reproduces `schedule.unattendedMinutes` and
   `handsOnMinutes` on all 664 (D6); `evidence` is never stronger than `handsOnEvidence`;
   `assumedStandingMinutes ≥ schedule.assumedHandsOnMinutes` at `m ≥ 1`; `elapsed.at ≥ standing.at`;
   nothing is `NaN`.
8. **`check-recipes` run for real** — `execFileSync` on a temp `.cook` file, the pattern
   `washing-up.test.ts` established: the `c < s` failure with both lines in the output (the AC's
   "Show it"), the batching-acknowledged file passing, an operation that binds nothing failing, and
   a malformed line failing.

---

## 6. `README.md` — modified

A `**capacity**` bullet after `washing-up` in the metadata list, in the same voice: the line, what
each part is for, that the operation is not optional and why (§3's 102 minutes), that absent is the
common and correct answer, and that a capacity below `servings` is a build error unless the recipe
says where it batches. Plus a row in the file table near line 211 for `src/lib/scaling.ts`.

---

## Ordering

`scaling.ts` (reader) → `tree.ts` → `normalise.mjs` → `check-recipes.mjs` → `scaling.ts` (cost
function) → tests → `README.md`. The reader has to exist before anything can hold a `Capacity`, and
the cost function needs nothing from the checker. Each of those is a commit that leaves
`npm run verify` passing, because no `.cook` file declares a capacity at any point.
