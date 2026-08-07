# T-013-02 — Design

Seven decisions. Each names what was rejected and why, against the research.

---

## 1. The output is a demand-against-supply diagnosis, not a schedule

**Options.**

| | Shape | Why not |
| --- | --- | --- |
| A | Generate a minute-by-minute plan for the meal | The ticket forbids it, and it is right to. Resource-constrained job-shop scheduling is NP-hard, *optimal* is not the ask, and a plan wrong by fifteen minutes is worse than none because somebody trusted it |
| B | Simulate one ordering and report where it broke | A simulation's failures are **its ordering's** failures. Change the tie-break and a finding vanishes. Nothing a cook could act on survives that |
| C | Measure demand against supply over the shared clock and report where demand wins | Chosen |

**Chosen: C.** No task is ever moved. For each resource — the oven, the burners, the cook's hands —
the model computes how much of it the meal *asks for* over a window and how much *exists*, and
reports the windows where the ask is larger. That is a statement about the meal, not about a plan,
and it survives any ordering because it is a bound on all of them.

For hands the bound is exact and provable. Let `D(t)` be the hands-on minutes belonging to tasks that
**cannot start before `t`** (the recipe holds them there), and let there be `k` cooks and `serve − t`
minutes left. If `D(t) > k·(serve − t)` then **no ordering finishes it**, because `k` cooks cannot
produce more than `k·(serve − t)` cook-minutes in that window. It is work conservation, not a
heuristic. *Seventy minutes of hands-on work falls in the last forty-five minutes* is exactly this
statement, and it needs no plan to make it.

Findings therefore carry a window, the dishes in it, and how much over. Never an instruction.

---

## 2. The shared clock runs backwards from one serving time

**Rejected: a common start.** Two recipes started together finish at different times, which is not a
meal. The ticket names the constraint — *everything lands at one time, and that is what makes a meal
a meal* — and it is the constraint the per-recipe schedule has never had.

**Chosen:** `serve = 0`, earlier is negative. Dish *d* is offset by `−totalMinutes(d)`, so every
dish's root task ends at 0 and its tasks sit at `task.start − totalMinutes(d)`. A window is a pair of
minute offsets, both ≤ 0. Rendering the offsets as clock times is a later ticket's; the model returns
numbers.

**What this asserts and where it is wrong** is named in §6 of the artifact's gap list: a cranberry
sauce served cold does not need to finish at 0, and anchoring it there invents contention that a real
afternoon does not have. The escape hatch is `madeAhead` (§6 below), and the direction of the error
is towards a busier afternoon, which is `schedule.ts`'s own stated convention.

---

## 3. Placement comes from the written schedule; only hands-on minutes are scaled

This is the subtle one and the research settles it.

`costOf`'s `elapsed` is `A_free + m·H_free + r·(A_batch + H_batch)`. **Only hands-on minutes carry
`m`.** Unattended minutes grow only through `r`, the batch ratio, which is `1` unless a vessel binds
the dish. So:

- **An oven window read off the written schedule is exact at any serving count, unless
  `costOf(...).batches.binds`.** A 45-minute roast is 45 minutes for four wings and for ten. Twice
  the potatoes is not twice the roast.
- **Hands-on minutes do grow.** Ten servings of mashed potato is more ricing than six.

**Rejected: stretch every task by `elapsed.factor`.** It would turn a 90-minute braise into a
180-minute braise at double the servings, which the recipe never said and which is false.

**Rejected: don't scale anything.** Then the pile-up finding under-reports exactly where it matters,
and the meal model would disagree with the recipe's own page — the failure the ticket's §3 names.

**Chosen:** tasks keep their written intervals. Each hands-on span's **minutes** are multiplied by
that dish's `costOf(...).standing.factor`, so the spans sum to `standing.at` exactly — the cost
function's own answer, distributed rather than recomputed. This is testable and will be tested.

**The accepted error, stated with its direction.** `standing.factor` is `(m·H_free + r·H_batch)/H`;
which individual minutes were batched is not recorded, so the growth is spread evenly across spans.
For the 639 files with no capacity it is exact (`r = 1`, so the factor is `m`). For the 46 with one it
is an even spread of an uneven truth, and the total is still right. `scaling.ts`'s `longestGrowth()`
makes the same trade for the same reason and says so.

**Where a vessel binds, the window is a floor, and the model says so.** A dish with
`batches.binds === true` gets a `vessel-binds` finding carrying `batches.at` and
`batches.costMinutes`, because its unattended windows will be longer than the model has drawn them.

---

## 4. The oven: one oven, temperature is part of it, shelves are out

**One oven.** Not an input. A second oven is a different kitchen, and the same argument
`scaling.md` §4.2 makes about a vessel applies: it is a fact about a kitchen, so the honest move is to
name what was assumed rather than to invent a dial nobody will set.

**Temperature is part of the constraint.** Two dishes within `OVEN_TOLERANCE_C` share; further apart
they cannot. **15 °C**, chosen because 350 °F and 375 °F are 15 °C apart and cooks routinely split
that difference, and because the ticket's own example — 180 against 230 — is 50 and must fail. The
five temperatures in the worked meal are 165, 175, 190, 205 and 220, so the constant is doing real
work rather than sitting at a value that never decides anything (`BREAK_MINUTES`' test).

**Oven space is OUT, and not by assuming infinite shelves.** Nothing in the data measures a dish. A
sheet pan of potatoes and a ramekin of custard are both "one dish" here, and `#oven{}` is flattened to
a recipe-level list anyway (research §5). Modelling shelves would mean inventing a size per dish,
which is the one thing this repo does not do.

So the model **reports the count and refuses to judge it**: every oven window carries how many dishes
want the oven at once, and the input carries `ovenShelves?: number | null`, defaulting to **`null`,
meaning "not stated"**. With `null` no crowding finding is emitted — the count is handed over and the
reader with a two-shelf oven decides. Given a number, `oven-crowded` becomes a finding. Absence is
not infinity, the same way `keeps: null` is not zero.

**Rejected: default `ovenShelves` to 2.** That is us guessing a reader's kitchen and printing it as a
finding.

**A temperature clash is a finding whatever the shelf count**, because it is not a space problem.

**Attribution comes from step text, because it cannot come from anywhere else.** Research §5: 122 of
393 oven-looking steps are in files whose `cookware` names nothing oven-ish, so `cookware` alone
misses a third; and 35 temperature-bearing steps are a pan of oil. The rule that survives both:

1. The step's text or timer name says **roast / bake / broil / oven**, and
2. it does not say **air fry / basket / smoker / grill / slow cooker / instant pot** — those are
   other appliances, and `air-fryer-sweet-potatoes` literally says *"roast in the basket"*, and
3. "dutch oven" is masked before the word `oven` is looked for.

Temperature is then read from the step's own text (186 of 224 operation steps), else from a header
step in the same file (4 more), else it is `null` — 34 steps — and a `null` temperature is
**compatible with everything** and drops the finding to `inferred`. Guessing a temperature would be
worse than not knowing one.

---

## 5. Burners: in, derived, and weaker — with the imperfection measured

The ticket says derive them and say how imperfectly. Both halves are done.

**In**, because a holiday meal genuinely runs out of burners — mashed potatoes, gravy and cranberry
sauce all want one at once — and because it costs one more station in machinery already built for the
oven. `burners` is an input, default **4**.

**How imperfectly, exactly.** There is no hob equivalent of `400°F`. Nothing in a hob step marks it
as a burner the way a temperature marks an oven. So the reading is a verb, gated on the recipe naming
hob cookware, and both error directions are real:

- **870 steps across 432 recipes match a hob verb; 149 of them are in recipes naming no hob-ish
  cookware.** Those are dropped, so the model **under-reports** hob demand by up to 17 %.
- The gate does not separate a burner from an appliance that behaves like one. A `#pot{}` simmering
  in an Instant Pot is counted as a burner. `instant pot` is excluded by name; a generic `pot` in a
  file that also names a slow cooker is not.
- A step doing two things — sear, then rest — is charged to the hob for its whole timed length,
  because a step is the finest granularity a station can be read at.

Therefore: **a hob finding never gates and never rejects**, its confidence floor is `inferred` at
best, and the finding names the dishes so a reader can check. The oven is the sharp instrument here;
the hob is the blunt one, and the code says which is which.

---

## 6. The cook is an input; make-ahead is an input; fridge and counter are out

**`cooks`, default 1.** This is the assumption `schedule.ts` states about itself and the one that
becomes absurd across recipes. Two cooks doubles the supply term in §1's bound, which is why *the
same meal with two cooks* clears the pile-up rather than halving it — a bound is not a division.

**`madeAhead?: boolean` per dish.** The ticket's demonstration needs a change to make, and *make one
side ahead* is the change a cook actually has. A dish marked ahead contributes no tasks to the clock
at all. Two consequences, both deliberate:

- **A dish marked ahead that declares no `keeps` raises `made-ahead-unclaimed`.** The recipe never
  said it survives the night, and the model will not congratulate a reader for assuming it does.
  Absence is not a yes.
- **Reheating is not modelled.** It is in the gap list.

The model also volunteers `make-ahead-available`: dishes whose `keeps.minutes` is at least a day and
whose hands-on minutes fall inside an oversubscribed tail. Those are the ones worth moving. *Two of
these six can be made the day before* is this finding.

**Fridge and counter space: OUT.** The ticket calls it probably out of scope and the research agrees
for a sharper reason than "hard": there is no field anywhere in the collection that measures the
volume of a finished dish, and `keeps` is a duration, not a shelf. **What it would take:** an authored
per-dish volume, plus a per-kitchen capacity — and the second of those is a fact about the reader's
kitchen, not about the recipe, which is exactly the shape `capacity` has and exactly why `capacity`
had to be authored rather than derived. Two new fields, one of them unauthorable from a recipe file.
Modelling it from ingredient quantities would produce a confident wrong number, which is the failure
mode this whole repo is built against.

---

## 7. Confidence is per finding, weakest-wins, over what that finding rests on

**Rejected: one confidence for the whole diagnosis, floored at the weakest recipe's
`handsOnEvidence`.** Only 269 of 685 recipes have a hands-on figure that is not a guess, so this
would stamp `unknown` on an oven temperature clash that is read from two authors' own numbers. It
would be honest about nothing and would destroy the finding the model is sharpest at.

**Chosen:** each finding takes the weakest reading of **the inputs it is actually built from**.

| Finding | Rests on | Confidence is the weakest of |
| --- | --- | --- |
| oven contention / clash, hob contention | timer minutes and the station reading | each contributing `Task.confidence`, and `stated`→`inferred` where the temperature came from a header or is `null` |
| hands-on pile-up | the hands-on split | each contributing dish's `costOf(...).evidence` |
| vessel binds | `capacity`, which is authored | the contributing dish's `evidence` |

Plus a meal-level `evidence`, which **is** the weakest recipe in the meal, so a caller that wants the
blunt answer has it in one place. And the invariant the ticket asks for, stated as a rule and held by
a test: **a finding whose hands-on minutes include any assumed minute is `unknown`.** Six recipes is
six chances to be guessing and the compounding is the danger, so the compounding is what the rule
catches.

---

## 8. Two files, and why not one

`src/lib/stations.ts` — which appliance a task occupies and at what temperature — is separated from
`src/lib/meal.ts` because it is the part that is **guessing**, and its error rates deserve to live
next to it with their own tests. `meal.ts`'s arithmetic is exact given the attribution; `stations.ts`
is a reading of English. Keeping them in one file would let the sound half borrow the shaky half's
credibility, which is the argument `keeps.ts` and `slack.ts` each make for being their own reader.

Neither file renders. Neither returns a string a page could print: the only string-typed members are
enums this repo already ships (`Confidence`), new enums for finding kind and station, and recipe
**slugs**, which are identifiers and already the plan page's currency.

---

## What was considered and dropped entirely

- **Ranking dishes, or scoring the meal.** That is `occasions.md` §3's profile and T-013-03's to
  apply. A number for how bad an afternoon is answers nothing.
- **Suggesting which dish to move.** One step past diagnosis and straight into planning. The model
  says which findings a dish is in; choosing is the cook's.
- **Washing-up as a resource.** `washingUp.count` is a count of things, not a sink with a size, and
  177 of 685 declare it. There is no supply side to compare it against.
- **Reading `pairsWith` to propose a meal.** The meal is the caller's input. Composing one is a shelf,
  and S-013 opens no shelf.
