# T-013-02 — Research

What exists, where, and what it can and cannot say about several recipes at once. No proposals.

## 1. The one-dish assumption, and where it is written down

`src/lib/schedule.ts:127` `buildSchedule(recipe, tree?)` is the whole scheduling surface. It takes
**one** `RawRecipe`, walks the merge tree deepest-first, and gives every operation a `start` and an
`end` in minutes from that recipe's own zero. Everything downstream — `lanes`, `criticalPath`,
`totalMinutes`, `handsOnMinutes` — is relative to a zero that belongs to that recipe alone. There is
no shared clock anywhere in `src/lib/`, and nothing in the repo puts two recipes on one.

The assumption the ticket names is stated twice in that file, in its own words:

- `Schedule.handsOnMinutes` (`schedule.ts:61`): *"The schedule also assumes you have as many hands as
  the tree has branches; it never delays one hands-on task for another."*
- `longestUnbroken()` (`schedule.ts:307`): *"The schedule above assumes as many hands as the tree has
  branches … which is right for a timeline and wrong for this number. A person with two hands-on jobs
  running at once is doing both, one after the other."*

So the file has already met the problem **inside one recipe** and answered it once, for one figure,
by laying hands-on spans on one cook's clock. It has never met it across recipes. `longestUnbroken`
is the closest thing here to prior art and it is a private function.

`handsOnSpans` — the per-timer, placed-on-the-clock list that `longestUnbroken` consumes — is
**internal**. It is built inside `buildSchedule` (`schedule.ts:181-187`) and never returned. A
`Task` carries `attention` at whole-step granularity, and `schedule.ts:236` says why that is
deliberately cautious: a step with one hands-on timer among five is called hands-on entire.

## 2. The precedent for reading timers again

`src/lib/scaling.ts:323` `splitAttention()` hit exactly this wall and its comment is the governing
precedent:

> `Task.attention` is a whole-step label and deliberately cautious … which is right for a table cell
> and wrong here: read that way karaage's `A` comes out 35 against the 40 the model computed by hand.
> So the timers are read again, with the same call `buildSchedule()` makes on the same inputs — the
> step's own timers against the label off the tree. **It is the same reading and not a second
> opinion**, and a whole-collection test in `scaling.test.ts` holds it to that.

`readTimers(timers, label)` is exported from `src/lib/time.ts` and is the shared call. The safety
mechanism is the whole-collection test: summing the re-read split over every task must reproduce the
schedule's own two totals on every recipe.

## 3. What `scaling.ts` already computes, per recipe

`costOf(recipe, wanted, schedule?)` (`scaling.ts:446`) returns `Cost | null`. Null when the recipe
has no readable `>> servings:`. The members that matter to a meal:

| Member | What it is |
| --- | --- |
| `servings.multiplier` | `m = n/s` |
| `batches.written` / `.at` / `.ratio` / `.binds` | `b(s)`, `b(n)`, `r = b(n)/b(s)`, and whether the target needs more loads |
| `batches.costMinutes` | `A_batch·(r−1) + H_batch·(r−m)` — what the vessel costs over no vessel |
| `elapsed` | `Growth` — clock time for one cook, `A_free + m·H_free + r·(A_batch+H_batch)` |
| `standing` | `Growth` — time you are standing there, `m·H_free + r·H_batch` |
| `longest` | `Growth` — longest unbroken stretch, grown by `max(m, r)`, capped at `standing.at` |
| `evidence` | `Confidence`, passed through from `handsOnEvidence(schedule)`, never strengthened |
| `assumedStandingMinutes` | the part of `standing.at` nobody claimed |
| `untimedCount` | operations that never said how long |

`Growth` is `{ written, at, factor, flat }` with `factor === null` when `written === 0`.

**Unattended minutes do not grow with `m`.** Read `elapsed`: only `hFree` carries `m`. Unattended
time grows only through `r`, the batch ratio. So an oven window read off the written schedule is
**exact at any serving count unless a vessel binds the dish**, and `batches.binds` says when that is.
This is the single most useful fact for placing dishes on a shared clock.

`handsOnEvidence(schedule)` (`schedule.ts:364`) returns `stated | inferred | unknown`, weakest-wins,
and drops to `unknown` when any assumed minutes are in the figure. `Confidence` is declared in
`schedule.ts:31`.

## 4. The rule about strings

`scaling.ts:22-28` states it: *"NO NOTATION ESCAPES … this file returns NO STRING A PAGE COULD PRINT
— the only string-typed member of `Cost` is the `Confidence` enum `schedule.ts` already ships."*
`Capacity.vessel` and `Capacity.operations` are the exception and they are the author's own words
read back, not text this repo composed. S-013 restates the rule: the analysis is O(·) in the
knowledge files and never on a page.

## 5. What the data actually carries about vessels

This is the constraint that decides the ticket's scope calls, and it is a hard one.

**`cookware` is recipe-level and flat.** `RawRecipe.cookware` (`tree.ts:110`) is *"Every `#pan{}` and
`#stand mixer{}` the recipe asks for"*, sorted, deduplicated. `scripts/normalise.mjs:124-155` builds
it by walking every step and adding every cookware item to **one `Set`**. `RawStep` (`tree.ts:33`)
has `index`, `rawLabel`, `labelOverride`, `ingredients`, `refs`, `timers` — **and no cookware
field**. `docs/knowledge/occasions.md` §3.7 records the same finding: *"the `#oven{}` mark is
flattened to one recipe-level list."*

So the question *which step is in the oven* cannot be answered from `cookware`. It has to be read off
the step's own words. Measured over the 685 generated recipes:

| Measure | Count |
| --- | ---: |
| Recipes naming `oven` in `cookware` | 113 |
| Recipes with at least one step whose text says roast / bake / broil / oven | 246 |
| **Operation** steps (ingredients or refs — the ones that become tasks) matching that | **224**, over 203 recipes |
| … of those, carrying a timer | 215 |
| … carrying an oven temperature in their own text | **186** |
| … whose temperature is only in a header step | 4 |
| … with no temperature anywhere in the file | 34 |
| Oven-looking steps in recipes that name no oven-ish cookware at all | 122 |

Two error directions, both measurable:

- **Cookware misses a third of it.** 122 of 393 oven-looking steps sit in files whose `cookware` names
  nothing oven-ish. `baked-turkey-wings` roasts for 45 minutes and braises for 90 and its `cookware`
  is `[]`.
- **Temperature alone over-claims.** 354 steps carry a temperature in the 200–600 °F / 90–320 °C band
  and **35 of them are a pan of oil, not an oven** — `crab-rangoon` "fry 350°F (175°C) 3 min",
  `samosa` "fry 15 min at 300°F", `buttermilk-pancakes` "griddle at 375°F". A rule built on
  temperature without a verb reads a deep-fryer as an oven.

**A third appliance class exists and reads like an oven.** `air-fryer-sweet-potatoes` step 2 is
*"roast in the basket 200°C (400°F), 15–18 min, one layer"*. It is `roast`, it has a temperature,
and it is not the oven. The 21 `air fryer basket` recipes, 24 `instant pot`, 20 `slow cooker`, 9
`smoker` and 4 `charcoal grill` recipes are all their own appliance.

**Hob attribution is weaker still.** 870 steps across 432 recipes match a hob verb
(simmer/boil/fry/sear/steam/reduce/…), and 149 of them are in recipes naming no hob-ish cookware.
There is no counterpart to the oven temperature — nothing in a hob step says *this is a burner* the
way `400°F` says *this is an oven*. `turkey-pan-gravy` "simmer 10 min" and `cranberry-sauce` "simmer
12 min" are indistinguishable from a simmer in an Instant Pot.

## 6. Annotation coverage today (685 files, 7 Aug 2026 build)

| Field | Declared |
| --- | ---: |
| `slack` | 416 |
| `washingUp` | 177 |
| `keeps` | 138 |
| `capacity` | **46** |

`capacity` was 0 when `occasions.md` was written; T-011-03 has since landed 46. So the vessel branch
of `costOf` is now live and `batches.binds` can be true in a real meal. Of the 46, the air-fryer
family carries most (`air-fryer-sweet-potatoes` = 4 servings, `one 5.7 L air fryer basket`,
operations `roast, air fry`).

## 7. The worked meal is on the shelf

A roast, several sides, something baked, one cook, ten people — every one of these is a real file
with real timers and a real oven temperature:

| Slug | Serves | Oven work | Temperature |
| --- | ---: | --- | --- |
| `baked-turkey-wings` | 4 | roast 45 min, then braise 90 min | 205 °C, then 165 °C |
| `cornbread-dressing` | 10 | bake 50 min | 190 °C |
| `crispy-roast-potatoes` | 6 | roast 45 min | 220 °C |
| `candied-yams` | 8 | bake 55 min | 190 °C |
| `sweet-potato-pie` | 8 | bake 55 min, then bake 45 min | 205 °C, then 175 °C |
| `mashed-potatoes` | 6 | none — hob | — |
| `turkey-pan-gravy` | 8 | none — hob, 3 min roux hands-on | — |

Five temperatures across five dishes, in one oven, all landing at one hour. `occasions.md` §3.3
already worked six of these under the family-meal profile and found nine of seventeen scoring
identically for want of fields; this ticket is about a different axis — where they collide — and the
fields it needs (timers, temperatures, the DAG) are the ones the collection is **not** silent on.

## 8. Test conventions

`src/lib/scaling.test.ts` is the model. It imports `../generated/recipes.json` as
`RawRecipe[]`, has a `real(slug)` helper that throws on a missing fixture, and a `fixture()` builder
that hand-builds a `RawRecipe` with an exact tree so a property (a capacity, an assumed timer) can be
declared without touching a `.cook` file. `timer(minutes, attention, source)` produces the
`RawTimer & { source }` shape that `schedule.ts` reads — `tree.ts`'s `RawTimer` predates `source`, so
tests cast. Whole-collection invariants live in `src/lib/collection.test.ts`.

`npm run verify` = `check-recipes` → `parse-recipes` → `vitest run` → `astro build`.

## 9. Constraints this ticket inherits

- **`docs/knowledge/scaling.md` is the model of record** for anything about cost; where a file and it
  disagree the file is right and it is a bug.
- **Absence is not zero**, everywhere: `keeps: null` is not "keeps for no days",
  `washingUp: null` is not "washes nothing", `capacity: null` is not "holds one serving". Three
  answers, not two — ranked, rejected, cannot say (`occasions.md` §3.2).
- **A figure may never be reported more confidently than the figure it was derived from**
  (`scaling.ts:489`).
- The ticket's own file boundary: only new files under `src/lib/`, their tests, and
  `docs/active/work/T-013-02/**`. Not `schedule.ts`, not `scaling.ts`, no `.cook` file, no page —
  which means **per-step cookware cannot be added**, and the oven must be read off step text.
