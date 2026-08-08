# T-013-02 — Progress

All six plan steps done. Two commits through `lisa commit-ticket`.

| Step | State | Commit |
| --- | --- | --- |
| 1–2 `src/lib/stations.ts` + test | done | `11956c8` *Read which appliance a step occupies* |
| 3–4 `src/lib/meal.ts` + test | done | `d3b78ba` *Model the meal rather than the dish* |
| 5 the worked meal | done | below |
| 6 `npm run verify` | see §7 | — |

**Deviations from the plan**, both in `stations.ts` and both found by running the reading over all
685 files rather than by reasoning about it:

1. **A braise at 325°F is in the oven and says no oven verb.** The plan had oven = roast/bake/broil
   only, and `baked-turkey-wings` step 3 — *"braise covered 325°F 1 hr 30 min"* — is 90 minutes of
   oven that rule misses, along with thirteen other braises (`beef-bourguignon`, `osso-buco`,
   `pot-roast`, `carnitas`, `birria-de-res`, …). A third rule was added: an oven-band temperature in
   a step naming neither a frying word nor a pan. The two guards are what keep
   `hot-water-cornbread`'s *"heat in a cast-iron skillet to 350°F"* and `crab-rangoon`'s *"fry
   350°F"* out of it.
2. **`cookware` is not the hob gate.** The design already argued this; running it confirmed the cost
   would be `mashed-potatoes`, whose `cookware` is `["ricer"]` and which simmers for twenty minutes.
   A burner pan named in the step text (`skillet`, `wok`, `DUTCHPOT`, …) became a hob signal instead,
   and the same word became the guard that stops `massaman-curry-paste` dry-roasting its spices in a
   skillet from reading as the oven.

---

## 1. Every constraint, what it assumes, and how wrong that can be

| Constraint | In / out | What it assumes | How wrong that can be |
| --- | :---: | --- | --- |
| **One oven** | **in** | The kitchen has one. Two dishes hold it whenever their timed windows overlap | A second oven, or a countertop oven, makes every oven finding wrong in the safe direction — it warns about a collision that is not one. There is no input for it, because a second oven is a fact about a kitchen and `scaling.md` §4.2 already settled that those are authored, not guessed |
| **Oven temperature** | **in** | Two dishes within 15 °C share; further apart they cannot | Read from the step's own words on 186 of 224 oven operation steps; from a header on 4; **absent on 34**, and absent agrees with everything rather than clashing. A dish whose temperature nobody wrote can hide a real clash |
| **Oven space (shelves)** | **out**, reported not judged | Nothing. `ovenShelves` defaults to `null` = nobody said, and no crowding is reported | Nothing in this collection measures a dish — a sheet pan of potatoes and a ramekin are both "one thing" — so the model hands over the count and refuses to rule. **What it would take:** per-step cookware plus an authored pan size, and `normalise.mjs` flattens `#oven{}` into one recipe-level list today |
| **Burners** | **in**, weakly | Four unless told otherwise; a hob verb or a named burner pan holds one for the length of the step | The blunt half of the file. There is no `400°F` for a burner. **149 of 870 hob-verb steps are in files naming no hob cookware and are counted anyway** — over-reporting, deliberately, which is `schedule.ts`'s own convention. A `#pot{}` simmering inside an Instant Pot is counted as a burner unless the recipe names *only* appliance vessels |
| **The cook** | **in** | One, unless `cooks` says otherwise | This is `schedule.ts`'s own assumption made honest: it *"assumes you have as many hands as the tree has branches"*, which is right for one recipe and absurd for six. The bound is exact for the count given, and says nothing about a helper who arrives halfway through |
| **Everything lands at one time** | **in** | Every dish's last operation is the serving hour | **The most over-stated assumption here.** A cranberry sauce served cold does not have to finish at the hour, and anchoring it there invents contention a real afternoon does not have. The error is towards a busier afternoon; the escape hatch is `madeAhead` |
| **Fridge and counter space** | **out** | Nothing | No field anywhere measures the volume of a finished dish, and `keeps` is a duration, not a shelf. **What it would take:** an authored per-dish volume plus a per-kitchen capacity — two new fields, and the second is a fact about the reader's kitchen rather than about the recipe, which is exactly `capacity`'s shape and exactly why `capacity` had to be authored. Deriving it from ingredient quantities would produce a confident wrong number |
| **Servings** | **in** | Hands-on minutes grow with the multiplier; unattended minutes do not | Straight out of `costOf`'s own `elapsed` formula — only `H_free` carries `m`. So an oven window is exact at any serving count **unless a vessel binds the dish**, and `vessel-binds` says when |
| **A vessel** | **in**, through `costOf` | `capacity` is authored, on 46 of 685 files | Where it binds, the windows this model draws are a **floor**: more loads means longer, and the model does not redraw them. It reports `batches.at`, `batches.written` and `batches.costMinutes` instead |

---

## 2. The calls, shown

| Call | Where | What it is for |
| --- | --- | --- |
| `buildSchedule(recipe)` | `src/lib/meal.ts:309` | The DAG, the task starts and ends, `totalMinutes` |
| `costOf(recipe, dish.servings, schedule)` | `src/lib/meal.ts:310` | `standing`, `elapsed`, `batches`, `evidence`, `assumedStandingMinutes` — the schedule is passed in so it is not built twice |
| `readTimers(all, task.label)` | `src/lib/meal.ts:254` | Per-timer attention, the same call `schedule.ts:146` and `scaling.ts:329` both make |
| `readStations(recipe)` | `src/lib/meal.ts:327` | Which appliance each step occupies |

Nothing is recomputed. Two whole-collection tests hold it there:

- `handsOnSpansOf()` summed over every one of the 685 files reproduces `schedule.handsOnMinutes`
  exactly.
- `diagnose()`'s `standingMinutes` for a single dish at twelve servings reproduces
  `costOf(recipe, 12).standing.at` on every file that has a readable `>> servings:`.

---

## 3. The worked meal

A roast, several sides, something baked. **One cook, ten people**, every dish off this shelf:

`baked-turkey-wings` (written for 4) · `cornbread-dressing` (10) · `crispy-roast-potatoes` (6) ·
`candied-yams` (8) · `sweet-potato-pie` (8) · `mashed-potatoes` (6) · `turkey-pan-gravy` (8)

### The diagnosis, before

```
cooks=1 burners=4 shelves=null
starts -135   standing 13.75   evidence unknown   unscalable []

-- dishes --                serves     starts  standing (assumed)  elapsed  untimed
baked-turkey-wings           4 -> 10     -135        0    (0)        135       1
cornbread-dressing          10 -> 10      -60       10   (10)         60       2
crispy-roast-potatoes        6 -> 10      -58        0    (0)         58       2
candied-yams                 8 -> 10      -60        0    (0)         60       2
sweet-potato-pie             8 -> 10     -100        0    (0)        100       2
mashed-potatoes              6 -> 10      -22        0    (0)         22       2
turkey-pan-gravy             8 -> 10      -13     3.75 (3.75)      13.75       3

-- findings --
oven-shared   [-100..-90]  wanted 2  stated  180°C-ish: [204]
              baked-turkey-wings + sweet-potato-pie
oven-clash    [ -90..-55]  wanted 2  stated  [163, 204]
              baked-turkey-wings + sweet-potato-pie
oven-clash    [ -55..-50]  wanted 3  stated  [163, 190, 204]
              baked-turkey-wings + candied-yams + sweet-potato-pie
oven-clash    [ -50..-45]  wanted 4  stated  [163, 190, 204]
              baked-turkey-wings + candied-yams + cornbread-dressing + sweet-potato-pie
oven-clash    [ -45..  0]  wanted 5  stated  [163, 175, 190, 218]
              baked-turkey-wings + candied-yams + cornbread-dressing
              + crispy-roast-potatoes + sweet-potato-pie
```

**Read plainly: for the last forty-five minutes, five dishes want one oven at four temperatures
spanning 163 °C to 218 °C.** Every one of those temperatures is the author's own written number —
the finding reads `stated`. Nothing on this site can see it today, and no single recipe page could:
each of the five is a perfectly reasonable dish.

The windows are also cumulative in a way a cook would recognise. The oven is shared from −100, in
conflict from −90, and the conflict gets one dish worse every five minutes from −55 to −45.

### The one change, and the finding it clears

**`sweet-potato-pie` is made the day before.**

```
-- findings, after --
oven-clash    [ -55..-50]  wanted 3  stated  [163, 190]
              baked-turkey-wings + candied-yams
oven-clash    [ -50..-45]  wanted 3  stated  [163, 190]
              baked-turkey-wings + candied-yams + cornbread-dressing
oven-clash    [ -45..  0]  wanted 4  stated  [163, 190, 218]
              baked-turkey-wings + candied-yams + cornbread-dressing + crispy-roast-potatoes
made-ahead-unclaimed        —          unknown
              sweet-potato-pie
```

| | Before | After |
| --- | --- | --- |
| `oven-shared [-100..-90]` | 2 dishes | **cleared** |
| `oven-clash [-90..-55]` | `baked-turkey-wings + sweet-potato-pie` | **cleared** |
| `oven-clash [-55..-50]` | 3 dishes, 3 temperatures | 2 dishes, 2 temperatures |
| `oven-clash [-45..0]` | **5 dishes**, 4 temperatures | 4 dishes, 3 temperatures |
| `made-ahead-unclaimed` | — | **raised** |

Two findings clear outright and the worst window drops from five dishes to four. The 100 minutes of
oven that `sweet-potato-pie` was holding — 55 at 205 °C and 45 at 175 °C — leave the day entirely.

**And the model refuses to congratulate the reader for it.** `sweet-potato-pie` declares no
`keeps`, so moving it raises `made-ahead-unclaimed`. That is not the model being pedantic: nothing
about a pie's second morning can be read off its steps, absence is not a yes, and a cook who moved it
on our say-so would find out at four o'clock. **Not one of the seven dishes on this plate declares
`keeps`**, which is the same silence `occasions.md` §3.3 found from the other direction.

### With two shelves declared

Passing `ovenShelves: 2` adds three `oven-crowded` findings, at −55, −50 and −45, wanting 3, 4 and 5
against 2. With `ovenShelves` left at its default the model reports the counts and says nothing about
whether they fit, which is the scope call design §4 argues.

### With two cooks

**Identical.** There is no `hands-pile-up` in this meal to clear, and §4 is about why.

---

## 4. The silence, which is a finding about the collection

**This meal reports 13.75 hands-on minutes for a whole Thanksgiving afternoon**, and every one of
them is assumed rather than claimed: ten from `cornbread-dressing`'s *"sweat 10 min"* and 3.75 from
`turkey-pan-gravy`'s *"cook roux 3 min"* scaled to ten servings. Five of the seven dishes report
**zero** hands-on minutes. The diagnosis's `evidence` is `unknown`, which is correct and is the whole
point of carrying it.

So the model finds no `hands-on pile-up` on the meal it was built for. **That is the collection's
silence, not the model's blindness**, and it is the same finding `occasions.md` §3.6 reached from the
ranking side: *the site systematically under-times exactly the operations an occasion built on labour
would rank by.* Peeling ten people's worth of potatoes, ricing them, carving, and getting seven
things onto plates at once is an hour of somebody's hands and **not one minute of it is written
down** in any of these files.

The pile-up machinery is exercised and correct — `src/lib/meal.test.ts` pins the window, the ask, the
supply and the overrun, and pins that two cooks clear it — but it can only speak about a meal whose
recipes timed their hands-on work. The list of what a `hands-on pile-up` needs is short and it is an
annotation pass, not a code change.

---

## 5. What this model cannot see

In the shape of a gap page's *what it could not stock*.

- **A turkey that is done when it is done.** Every window here is read off a written timer, and the
  one dish everything else is timed around is the one whose timer is a guess. A bird that runs forty
  minutes over does not move any finding on this page, and it is the single commonest way a holiday
  afternoon actually fails. Modelling it would mean a distribution rather than a number, and this
  repo does not have one anywhere.
- **Resting.** A roast out of the oven at −20 frees the oven and occupies the counter, and the model
  sees the first and not the second. No file marks a rest as *the joint is on the board now*.
- **Reheating what was made ahead.** `madeAhead` takes a dish off the day completely. In a real
  kitchen it comes back at the worst possible moment, into the oven everything else is fighting over.
  The model would need a step marked *this is the reheat*, and nothing marks one.
- **Whether the dishes fit in the oven.** Shelf space is out, on purpose. The model says *five things
  want the oven* and will not say whether five things go in it.
- **The fridge and the counter.** Also out. Persona three's kitchen is cramped and this is a real
  bound, and there is no measurement of a dish's volume anywhere in 685 files.
- **A second oven, a barbecue, a neighbour's kitchen.** One oven, and no input to say otherwise.
- **Which burner is which.** The hob has no temperature, so a wok wanting the big ring and a milk pan
  wanting the small one are the same burner here.
- **A helper who arrives at four.** `cooks` is one number for the whole afternoon.
- **Anything a step did not time.** Sixteen operations across these seven dishes are untimed. They
  take no minutes in this model and every load figure here is a floor by exactly that much.
- **What can be handed to somebody else.** `occasions.md` §3.7 already names this as missing. The DAG
  knows which tasks are independent; nothing knows which ones a niece can do.
- **Whether the meal is any good.** No ranking, no score, no suggestion of which dish to drop. This
  file diagnoses; choosing is the cook's, and a model that started choosing would be the itinerary
  the ticket forbids wearing a different hat.

---

## 6. What was written

| File | Lines | New / modified |
| --- | ---: | --- |
| `src/lib/stations.ts` | 248 | new |
| `src/lib/stations.test.ts` | 167 | new |
| `src/lib/meal.ts` | 662 | new |
| `src/lib/meal.test.ts` | 440 | new |

Nothing else. No `.cook` file, no page, and neither `src/lib/schedule.ts` nor `src/lib/scaling.ts`
was touched.

---

## 7. `npm run verify`

**Passes, exit 0. 1216 tests over 20 files, of which 43 are this ticket's.** `check-recipes` clean,
`parse-recipes` clean, 710 pages built.

Worth recording because it cost a re-run: mid-Implement the suite showed 6 failures in
`src/components/situation.test.ts` and `src/pages/_search.json.test.ts`, then 4 different ones
(`ReferenceError: servingsOf is not defined`). Neither file is this ticket's. **T-011-05 and T-011-06
are running concurrently on this branch** — `cb73622 Stop the plan page lying about the clock` and
`457ad94 Say what the multiplier costs` landed between this ticket's two commits — and those were
their files caught mid-edit. They settled; the suite is green as recorded above. Nothing here was
changed in response to them.
