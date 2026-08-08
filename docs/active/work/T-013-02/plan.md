# T-013-02 — Plan

Six steps. Each is committable on its own through `lisa commit-ticket`, and each has a check that
does not depend on the step after it.

---

## Step 1 — `src/lib/stations.ts`

Write the reader: `Station`, `TemperatureSource`, `Occupancy`, `OVEN_TOLERANCE_C`,
`temperaturesAgree`, `readStations`. Header comment carries the four measured error rates from
research §5 (122/393, 35/354, 149/870, 34 with no temperature anywhere), because they are the reason
the file is separate.

**Check.** `npx vitest run src/lib/stations.test.ts` after step 2. Before that, a scratch script that
prints the reading for `baked-turkey-wings`, `crispy-roast-potatoes`, `air-fryer-sweet-potatoes`,
`crab-rangoon` and `mashed-potatoes` and shows the four expected answers by hand.

**Commit.** `--include src/lib/stations.ts`

---

## Step 2 — `src/lib/stations.test.ts`

Unit tests from named real recipes, plus two whole-collection invariants:

- every `Occupancy` has a station and, when it has a temperature, one in 90–320 °C;
- no step matching `APPLIANCE` gets a station.

Named cases: °F/°C conversion, the frying false positive (`crab-rangoon`, `samosa`,
`buttermilk-pancakes`), the air-fryer basket, the Dutch oven, the header fallback, `temperaturesAgree`
at 175/190 (yes), 180/230 (no), null/anything (yes).

**Check.** `npx vitest run src/lib/stations.test.ts` passes.

**Commit.** `--include src/lib/stations.test.ts`

---

## Step 3 — `src/lib/meal.ts`

In the order of structure §"Internal order":

1. Types (`MealDish`, `Meal`, `Window`, `FindingKind`, `Finding`, `DishLoad`, `Diagnosis`).
2. `weakest()` over `Confidence`.
3. `handsOnSpansOf(recipe, schedule)` — the exact replication of `schedule.ts:181-187`.
4. `placeDish()` — `buildSchedule`, `costOf`, `readStations`, the offset, the scaled spans, the
   station intervals.
5. `stationWindows()` — the boundary sweep with adjacent-identical merging.
6. `pileUp()` — the work-conservation bound.
7. The five finding builders, then the sort.
8. `diagnose()`.

**Risks, and what each turns into if it goes wrong.**

| Risk | What it would look like | Guard |
| --- | --- | --- |
| The span replication drifts from `schedule.ts` | hands-on totals disagree with the recipe's own page | whole-collection test in step 4 |
| The sweep double-counts a window boundary | a one-minute `oven-shared` between two dishes that merely touch | intervals are `[from, to)`, half-open; a test that two back-to-back roasts produce no finding |
| `standing.factor` is null | `NaN` minutes everywhere | `?? 1`, and it is only null when `standing.written === 0`, in which case there are no spans |
| A recipe with no `>> servings:` | `costOf` returns null and everything downstream throws | `unscalable`, factor 1, `evidence: 'unknown'`, and a named test |
| Findings come back in a different order run to run | a diff-noisy artifact and a flaky test | declared kind order, then `window.from`, then `dishes.join()`; determinism test |

**Check.** `npx vitest run src/lib/meal.test.ts` after step 4.

**Commit.** `--include src/lib/meal.ts`

---

## Step 4 — `src/lib/meal.test.ts`

**The five the acceptance criteria name**, built with a `fixture()` helper in the shape
`scaling.test.ts` uses, so a temperature, a capacity or an entirely-assumed timer can be declared
without touching a `.cook` file:

1. two dishes wanting the oven at once → one window, both slugs;
2. two at 180 °C and 230 °C → `oven-clash`, `celsius: [180, 230]`;
3. forty minutes of hands-on work that cannot start before the last twenty-five → `hands-pile-up`,
   `window {from: −25, to: 0}`, `wanted 40`, `have 25`, `overrunMinutes 15`;
4. the same meal at `cooks: 2` → no `hands-pile-up`, and the oven findings unchanged;
5. a meal where one dish's timers are all `source: 'default'` → every hands-on finding it appears in
   is `unknown`, and an oven finding it is not in is not.

**Invariants:**

- **Nothing is scheduled.** For every dish, every task's placed window equals its written window minus
  `totalMinutes` — asserted over the whole worked meal, not a fixture.
- **The spans reproduce the schedule.** Over all 685 files: `Σ handsOnSpansOf(...).minutes` ===
  `schedule.handsOnMinutes`.
- **The scaled spans reproduce the cost function.** Over a sample with `>> servings:`:
  `Σ scaled minutes` === `costOf(...).standing.at`.
- **Determinism.** Two `diagnose()` calls on the same input deep-equal.
- **Absence is not a number.** `ovenShelves: null` never emits `oven-crowded`; a `madeAhead` dish
  contributes nothing; a dish marked ahead with no `keeps` raises `made-ahead-unclaimed`.
- **No string a page could print.** A test walks every string-valued field of the diagnosis for the
  worked meal and asserts each is a known enum member or a slug in the collection. This is how
  `scaling.ts`'s no-notation rule is held here rather than merely stated.

**Check.** `npx vitest run src/lib/meal.test.ts` passes; `npx vitest run` passes.

**Commit.** `--include src/lib/meal.test.ts`

---

## Step 5 — Run the worked meal and write it down

A scratch script (never committed) runs `diagnose()` over the seven real files from research §7 at
ten servings, one cook, and dumps the diagnosis. Then it runs the same meal with **one change** and
dumps it again.

**The meal.** `baked-turkey-wings` (serves 4), `cornbread-dressing` (10), `crispy-roast-potatoes` (6),
`candied-yams` (8), `sweet-potato-pie` (8), `mashed-potatoes` (6), `turkey-pan-gravy` (8) — all at
ten servings, `cooks: 1`.

**The change**, chosen after the first run so it targets a finding that is actually there. The
candidate is `sweet-potato-pie`, whose two bakes run 100 minutes at 205 °C and 175 °C and sit across
everything: `madeAhead: true` takes it off the day. If the first run's sharpest finding is elsewhere,
the change follows the finding — the requirement is *one change, and the finding it clears*, before
and after.

Both diagnoses are pasted into `progress.md` verbatim, naming recipes by slug.

**Check.** The before/after tables are in the artifact and the cleared finding is named.

**Commit.** Nothing. The script stays in the scratchpad.

---

## Step 6 — `npm run verify`, then Review

`npm run verify` runs `check-recipes` → `parse-recipes` → `vitest run` → `astro build`. No `.cook`
file and no page changed, so `check-recipes` and `astro build` are regression guards rather than the
point; `vitest run` is the point.

Then `review.md` and `review-disposition.json`, and `lisa check-disposition T-013-02`.

**The work artifact must also contain**, per the acceptance criteria:

- **Every constraint, with what it assumes and how wrong that assumption can be.** One table. Oven
  space, burner count and fridge space each explicitly in or out with the reason.
- **The reused calls, shown.** File and line, for `buildSchedule`, `costOf` and `readTimers`.
- **The worked meal's diagnosis**, by slug, and the before/after of the one change.
- **What this model cannot see**, in the shape of a gap page's *what it could not stock* section.
  The turkey that is done when it is done goes in it, along with: reheating a made-ahead dish;
  fridge and counter space; oven shelf space; the assumption that everything lands at one time; the
  resting joint; a second oven; and the fact that a hob reading has no `400°F` to lean on.

---

## What "done" means

- `npm run verify` passes.
- Only `src/lib/stations.ts`, `src/lib/stations.test.ts`, `src/lib/meal.ts`, `src/lib/meal.test.ts`
  and `docs/active/work/T-013-02/**` exist that did not before. Nothing modified.
- `git status` shows no ticket-owned file staged, modified or untracked.
