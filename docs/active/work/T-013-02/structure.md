# T-013-02 — Structure

Four new files. Nothing existing is modified.

| Path | Status |
| --- | --- |
| `src/lib/stations.ts` | **new** — which appliance a step occupies, and at what temperature |
| `src/lib/stations.test.ts` | **new** |
| `src/lib/meal.ts` | **new** — the meal model |
| `src/lib/meal.test.ts` | **new** |
| `docs/active/work/T-013-02/**` | **new** — the phase artifacts |

Nothing else. Not `schedule.ts`, not `scaling.ts`, no `.cook` file, no page, no `src/data/**`.

---

## `src/lib/stations.ts`

The part that is guessing. Its header comment carries the measured error rates from research §5 so
they sit beside the code they describe.

```ts
/** The two shared resources a meal fights over. An appliance is not a station: see below. */
export type Station = 'oven' | 'hob';

/** Where a temperature came from, which is what the reading's confidence turns on. */
export type TemperatureSource = 'step' | 'header' | 'none';

export interface Occupancy {
  station: Station;
  /** °C. Null when nothing in the file said, and null is compatible with everything. */
  celsius: number | null;
  temperatureSource: TemperatureSource;
}

/** Two oven temperatures a cook would split the difference on. 15 °C — see design §4. */
export const OVEN_TOLERANCE_C = 15;

/** Null is compatible with anything, because not knowing is not a clash. */
export function temperaturesAgree(a: number | null, b: number | null): boolean;

/**
 * One reading per operation step, keyed by `RawStep.index` — the same number `Task.id`
 * carries as `s{index}`. Steps at no station are absent rather than present-and-null.
 */
export function readStations(recipe: RawRecipe): Map<number, Occupancy>;
```

Internals, in the order the reading applies:

1. `celsiusIn(text)` — every `NNN °F` in 200–600 and `NNN °C` in 90–320, converted to °C, rounded.
   The bands are what keeps `165°F internal` and `salt 2%` out. A step usually writes both units
   (`400°F (205°C)`); duplicates converge to within rounding and the lowest is taken so one number is
   reported per step.
2. `APPLIANCE` — `air fry`, `basket`, `smoker`, `grill`, `slow cooker`, `instant pot`, `pressure
   cooker`, `waffle iron`, `deep-fry`, `deep fryer`. A step naming one is at no station: it is that
   appliance's problem, and `air-fryer-sweet-potatoes` says *"roast in the basket"*.
3. `OVEN_VERB` — `roast|bake|broil` (with suffixes) or the bare word `oven` **after `dutch oven` has
   been masked out**.
4. `HOB_VERB` — `simmer|boil|fry|sauté|sear|sweat|steam|reduce|poach|blanch|scald|deglaze|griddle`
   and their suffixes.
5. `appliancesOnly(recipe)` — true when every entry in `recipe.cookware` is an appliance vessel. Used
   only to suppress the hob, never the oven, and never as a positive signal.
6. Header temperatures: the `celsiusIn` of every **non-operation** step (no ingredients, no refs), used
   as the fallback for an oven step whose own text says no temperature. Source `'header'`.

The text a step is read from is `labelOverride ?? '' + rawLabel + timer names` — the same three
sources `scaling.ts:197 textOf()` and `schedule.ts` already read, with timer names added because
`~roast{45%min}` is the author naming the operation.

Precedence: appliance → nothing. Else oven verb → oven. Else hob verb → hob. Else nothing. **Oven
beats hob** so a Dutch oven that goes into the oven is charged once, to the oven.

---

## `src/lib/meal.ts`

### Inputs

```ts
export interface MealDish {
  recipe: RawRecipe;
  /** Servings wanted at the table. */
  servings: number;
  /** True when it is not cooked on the day: its work leaves the clock entirely. */
  madeAhead?: boolean;
}

export interface Meal {
  dishes: MealDish[];
  /** Hands at once. Default 1 — schedule.ts's own assumption, made honest across recipes. */
  cooks?: number;
  /** Default 4. */
  burners?: number;
  /** Dishes the oven holds at once. Null (the default) is "nobody said" — NOT infinity. */
  ovenShelves?: number | null;
}
```

### Output

Minutes are **relative to serving**: `0` is the moment it goes on the table, and everything before it
is negative. A later ticket turns that into a clock face; this file returns numbers.

```ts
export interface Window { /** ≤ 0 */ from: number; /** ≤ 0 */ to: number }

export type FindingKind =
  | 'oven-clash'            // in the oven together at temperatures that cannot be split
  | 'oven-shared'           // in the oven together, temperatures compatible
  | 'oven-crowded'          // more dishes than ovenShelves. Only when ovenShelves is a number
  | 'hob-crowded'           // more pans than burners
  | 'hands-pile-up'         // more hands-on work than the cooks can do before serving
  | 'vessel-binds'          // the target needs more loads than the written recipe
  | 'make-ahead-available'  // it keeps a day or more, and its work is inside the pile-up
  | 'made-ahead-unclaimed'; // marked ahead, and the recipe never said it keeps

export interface Finding {
  kind: FindingKind;
  /** Slugs, sorted, never empty. */
  dishes: string[];
  /** Null on findings that are not about a stretch of the afternoon. */
  window: Window | null;
  confidence: Confidence;
  /** Oven temperatures in play, °C, ascending. Empty unless the finding is about the oven. */
  celsius: number[];
  /** What was asked for; see the table below. 0 when the kind counts nothing. */
  wanted: number;
  /** What there was. 0 when nobody said. */
  have: number;
  /** By how much. 0 when the kind is not a shortfall. */
  overrunMinutes: number;
}
```

`wanted` / `have` / `overrunMinutes`, per kind — one table, because a shared shape needs one:

| Kind | `wanted` | `have` | `overrunMinutes` |
| --- | --- | --- | --- |
| `oven-clash` | occupancies at once | `ovenShelves ?? 0` | 0 |
| `oven-shared` | occupancies at once | `ovenShelves ?? 0` | 0 |
| `oven-crowded` | occupancies at once | `ovenShelves` | 0 |
| `hob-crowded` | pans at once | `burners` | 0 |
| `hands-pile-up` | cook-minutes wanted in the window | cook-minutes the window holds | `wanted − have` |
| `vessel-binds` | loads at the target | loads the written recipe needs | `batches.costMinutes` |
| `make-ahead-available` | 0 | 0 | hands-on minutes it would take out of the window |
| `made-ahead-unclaimed` | 0 | 0 | 0 |

```ts
export interface DishLoad {
  slug: string;
  servings: { written: number | null; at: number };
  /** costOf(...).standing.at. Null when the recipe has no readable `>> servings:`. */
  standingMinutes: number | null;
  elapsedMinutes: number | null;
  batches: { written: number; at: number; binds: boolean; costMinutes: number } | null;
  /** costOf(...).evidence, or 'unknown' when the dish could not be scaled at all. */
  evidence: Confidence;
  assumedStandingMinutes: number;
  untimedCount: number;
  madeAhead: boolean;
  /** Its earliest task, relative to serving. Negative. 0 when made ahead. */
  startsAt: number;
}

export interface Diagnosis {
  findings: Finding[];
  /** One entry per dish, whether or not it is in a finding. Input order. */
  dishes: DishLoad[];
  /** Hands-on minutes the day asks for, over every dish cooked on the day. */
  standingMinutes: number;
  /** The earliest a dish must start, relative to serving. Negative, or 0 for an empty meal. */
  startsAt: number;
  /** The weakest recipe in the meal — the blunt answer, in one place. */
  evidence: Confidence;
  /** Slugs with no readable `>> servings:`. Placed on the clock, never scaled. */
  unscalable: string[];
  cooks: number;
  burners: number;
  ovenShelves: number | null;
}

export function diagnose(meal: Meal): Diagnosis;
```

**No display string and no notation anywhere in these types.** Every string is an enum this repo
already ships (`Confidence`), an enum declared here (`FindingKind`, `Station`, `TemperatureSource`),
or a recipe **slug**, which is an identifier and already `plan.ts`'s currency. No labels, no
sentences, no `O(·)`.

### Where the reused calls are

| Call | Where | For |
| --- | --- | --- |
| `buildSchedule(recipe)` | once per dish, in `placeDish()` | tasks, starts, `totalMinutes`, `criticalPath` |
| `costOf(recipe, servings, schedule)` | once per dish, in `placeDish()`, passing the schedule so it is not built twice | `standing`, `elapsed`, `batches`, `evidence`, `assumedStandingMinutes` |
| `readTimers(step.timers, task.label)` | in `handsOnSpansOf()` | per-timer attention — the same call `schedule.ts` and `scaling.ts:splitAttention` both make |
| `handsOnEvidence` | not called directly; taken through `costOf(...).evidence` | |
| `readStations(recipe)` | once per dish | oven / hob occupancy |

### Internal order

1. **`placeDish(dish)`** → `Placed`: schedule, cost, offset `= −schedule.totalMinutes`, hands-on
   spans (scaled), station intervals (unscaled).
2. **`handsOnSpansOf(recipe, schedule)`** replicates `schedule.ts:181-187` exactly — filter timers to
   the finite ones first, then walk them with a running offset from `task.start`. Held to that by a
   whole-collection test: summing the spans must reproduce `schedule.handsOnMinutes` on all 685 files.
3. **`scaleSpans(spans, cost)`** multiplies each span's minutes by `cost.standing.factor ?? 1`, so the
   spans sum to `cost.standing.at`. Also tested against every file.
4. **`stationWindows(placed[], station)`** — a boundary sweep. Collect `[from, to)` intervals for every
   task the station reads, sort the distinct boundaries, and for each elementary interval record its
   occupant set. Adjacent elementary intervals with the identical occupant set merge into one window.
5. **`ovenFindings`** — per merged window with ≥ 2 occupancies: `oven-clash` when any pair's
   temperatures disagree, else `oven-shared`; plus `oven-crowded` when `ovenShelves` is a number and
   the count exceeds it. Occupancies are counted, not dishes, so two branches of one recipe in the
   oven together is a finding.
6. **`hobFindings`** — per merged window with more occupancies than `burners`.
7. **`pileUp(spans, cooks)`** — the work-conservation bound. For each candidate cut `t` (every span
   start, and the meal's own start), `wanted = Σ minutes of spans with start ≥ t`,
   `have = cooks · (0 − t)`. Keep the largest `wanted − have`; ties to the earliest `t`. Emit only when
   positive.
8. **`aheadFindings`** — `make-ahead-available` for a dish with `keeps.minutes ≥ 1440` contributing
   spans inside the pile-up window; `made-ahead-unclaimed` for a dish marked `madeAhead` whose
   `keeps` is null or under a day.
9. **`vesselFindings`** — one per dish whose `cost.batches.binds` is true.
10. **Sort** by a declared kind order, then `window.from`, then `dishes.join()`. Deterministic, the
    way `packLanes` and `criticalPathTo` are.

### Confidence, in one place

`weakest(a, b)` over `Confidence` with `unknown < inferred < stated`, and:

- Station findings: weakest of the contributing `Task.confidence`, floored to `inferred` when any
  contributing occupancy's `temperatureSource` is not `'step'`.
- `hands-pile-up`, `make-ahead-available`: weakest of the contributing dishes' `DishLoad.evidence`.
  So one dish whose minutes are entirely assumed drags the whole finding to `unknown` — six recipes
  is six chances to be guessing.
- `vessel-binds`: the dish's own `evidence`.
- `made-ahead-unclaimed`: always `unknown`. Nobody said.
- `Diagnosis.evidence`: weakest over every dish. Not applied as a floor to station findings — see
  design §7 for why that would be honest about nothing.

---

## `src/lib/stations.test.ts`

- °F and °C both read, and converted to the same °C.
- A frying temperature is not an oven: `crab-rangoon`, `samosa`, `buttermilk-pancakes`.
- An air fryer that says "roast in the basket" is at no station (`air-fryer-sweet-potatoes`).
- A Dutch oven on the hob is the hob, not the oven.
- A step with no temperature anywhere reads `celsius: null`, source `'none'`.
- A temperature in a header reaches the operation step, source `'header'`.
- `temperaturesAgree`: 175/190 yes, 180/230 no, null/anything yes.
- Whole collection: every reading has a station, and no reading has a temperature outside 90–320 °C.

## `src/lib/meal.test.ts`

The five the ticket names, plus the invariants:

1. **Two recipes wanting the oven at once** → one `oven-shared` (or `oven-clash`) window naming both.
2. **Two at incompatible temperatures** → `oven-clash`, `celsius` carrying both.
3. **A hands-on pile-up in the final hour** → `hands-pile-up` with the window and the overrun.
4. **The same meal with two cooks** → the pile-up clears; nothing else changes.
5. **A meal where one recipe's figures are entirely assumed** → every hands-on finding it is in is
   `unknown`, and the oven findings it is not in are not dragged down with it.

Plus: no dish is ever moved (every task's window equals its written window minus the offset); the
diagnosis is deterministic across two calls; an empty meal returns no findings; `ovenShelves: null`
emits no `oven-crowded`; a `madeAhead` dish contributes no spans and no windows; and the two
whole-collection invariants on spans (§2, §3 above).
