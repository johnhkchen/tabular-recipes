# T-011-01 — Design

The deliverable is prose, so the design decisions are (a) what the cost function actually is,
(b) which dishes carry the argument, and (c) how the file is shaped. Each is decided against the
figures in `research.md`.

---

## Decision 1 — the cost function

### The candidates

**Option A — the story's model taken literally.**

```
m = n/s          b(k) = ceil(k/c) or 1          elapsed(n) = b(n)·U + m·H
```

Rejected on three counts, all measurable:

1. **`U` is a branch sum, not a wait.** `gyoza` reports `unattendedMinutes = 56` and
   `totalMinutes = 49`. The 20-minute cabbage salt runs alongside the 30-minute dough rest; only
   one of them is on the clock. Feeding `U` into an elapsed-time formula prices a wait that never
   happened.
2. **`b(n)` double-counts.** 23 files already say `in two batches` **inside a timer** —
   `~brown{12%min}, in two batches`. The 12 minutes is both batches at the written size. Multiply
   by `b(n) = 6` at three times the servings and you have charged the author's two batches twice.
3. **It repeats waits that are not in the vessel.** `beef-with-broccoli` (`s = 4`, wok, *"sear in
   two batches"*) has a 30-minute velvet in the fridge. Option A triples it. Nobody's fridge holds
   less because the wok does.

**Option B — replace `U` with the critical-path wait and the batch count with a ratio.**

```
A = unattended minutes ON THE CRITICAL PATH        r = b(n)/b(s)
elapsed(n) = r·A + m·H
```

Fixes (1) and (2). Still fails (3): `r·A` triples `beef-with-broccoli`'s velvet, giving 102 minutes
for twelve portions where the truth is nearer 42.

**Option C — split the recipe at the vessel.** The batch repeats only what the batch contains.

```
elapsed(n) = A_free + m·H_free + r·(A_batch + H_batch)
```

### Chosen: Option C, with Option B named as its ceiling

**This is not a departure from S-011.** The story says *"the batch's **unattended** time repeats
with it."* Option C is that sentence made precise; Option B is the sloppy reading of it. The whole
content of this decision is *which* unattended time is the batch's.

**The definitions, all computable from what `buildSchedule()` already returns:**

| Symbol | Definition | Where it comes from |
| --- | --- | --- |
| `s` | Servings the recipe is written for | `>> servings:` — parses numerically on 664 of 664 |
| `n` | Servings wanted | The reader |
| `m` | `n / s` | The multiplier `plan.ts` already has |
| `c` | Capacity: servings the limiting vessel holds | `>> capacity:`, authored by T-011-03. **Usually absent.** |
| `b(k)` | `ceil(k / c)`, or `1` when no capacity is declared | — |
| `r` | `b(n) / b(s)` — batches now over batches then | — |
| `A` | Unattended minutes **on the critical path** | Sum the unattended timers along `schedule.criticalPath` |
| `H` | `schedule.handsOnMinutes` | Already published |
| `A_batch`, `H_batch` | The parts of `A` and `H` in the operations the capacity is declared against | Needs the vessel named — see Decision 4 |
| `A_free`, `H_free` | The rest | `A − A_batch`, `H − H_batch` |

**With no capacity declared** — which is most of the collection and should stay that way — the
batch set is empty, `r = 1`, and the whole thing collapses to two numbers:

```
elapsed(n) = A + m·H
```

### The identity that makes it checkable

`A + H ≥ totalMinutes`, always, with equality exactly when the recipe is a single chain. The gap is
`H − H_cp`: the hands-on work the schedule ran on a parallel branch, which one cook cannot do at
the same time as anything else. Verified on ten recipes:

| Slug | `A` | `H` | `A+H` | `T` | gap | off-path hands-on |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `chili-con-carne` | 120 | 0 | 120 | 120 | 0 | — |
| `karaage` | 40 | 2.5 | 42.5 | 42.5 | 0 | — |
| `vindaloo` | 780 | 13 | 793 | 793 | 0 | — |
| `beef-with-broccoli` | 30 | 4 | 34 | 33 | 1 | `s3` stir-fry 1 min |
| `gyoza` | 36 | 16 | 52 | 49 | 3 | `s4` beat one way 3 min |
| `gumbo` | 53 | 49 | 102 | 94 | 8 | `s1` brown 8 min |
| `chile-verde` | 120 | 22 | 142 | 132 | 10 | — |

So `elapsed(s)` under this model is **the one-cook clock**, and it sits at or above the timeline's
`totalMinutes`. That direction of error is the house convention already —
`schedule.ts:longestUnbroken()`: *"where it errs it errs towards a busier evening, which warns a
tired cook rather than reassuring one."*

### Dominance, which is the useful part

- **`n ≤ c`** (and `s ≤ c`): `r = 1` exactly. The model is `A + m·H`. Flat wait dominates unless
  `H` is large. **Capacity never binds below `c`, so the model is flat and then linear, with the
  knee at exactly `n = c`.**
- **`n → ∞`:** `r → n / (c·b(s))` and `m = n/s`, both linear. The batch term beats the work term
  when one batch takes longer than the hands-on work for `c` servings. For a basket — 12 minutes a
  load against a minute of tossing — that is always. **Once the vessel binds, nothing else matters.**
- **The reversal worth printing:** without a vessel, `elapsed = A + m·H` — only the work triples.
  With one, `r ≈ m` and `elapsed ≈ m·(A + H)` — everything triples. So **the dishes that scale best
  with no vessel (big `A`, small `H`) are the ones a vessel punishes hardest.** A two-hour braise
  is free at any size in a pot and ruinous in a basket.

---

## Decision 2 — which dishes carry it

Ticket asks for four, poles being `chili-con-carne` and an air fryer dish, two more interesting,
one surprising. **There is no air fryer recipe in the collection** (`research.md` §6). Decided:

| # | Slug | Role | Why this one |
| --- | --- | --- | --- |
| 1 | `chili-con-carne` | Pole: nothing binds | The story's own example. `A=120, H=0` |
| 2 | `karaage` | Pole: the vessel binds — **standing in for the air fryer** | `docs/gaps/air-fryer-and-pot.md` names it by slug as the `kit:` parent of the basket version. Says *"in batches"* and does not say how many, which is itself the finding |
| 3 | `beef-with-broccoli` | The one worked by hand | **The only candidate whose capacity is readable from its own words** — *"sear in two batches"* at `s = 4` ⟹ `c = 2` |
| 4 | `gumbo` | Surprising — model over-charges | Best-evidenced recipe in the collection: `stated`, 0 untimed. No vessel binds and it still scales worst of the five, and the model is wrong about why |
| 5 | `gyoza` | Surprising — model under-charges | The most obviously per-unit dish here, priced cheapest, because `roll thin, cut rounds` and `fill, pleat one side, press flat` carry **no timer** |

Five, not four. Four is the floor and the fifth is the one that can be checked by hand.

**Rejected:** `vindaloo` (perfect flat case but says the same thing as chili with a longer number —
kept as a one-line citation), `sourdough-boule` (same), `fried-chicken` (the 4-hour brine argument
duplicates chili's).

**On the air fryer substitution.** The file will say plainly that the pole is a stand-in, cite
`counters.md` §Basket and `docs/gaps/air-fryer-and-pot.md` for the measured basket facts, and leave
the numeric answer for `karaage` **as a function of `c`** rather than pick one. Inventing a capacity
in the file that settles the model would be the exact failure S-011 names: *"a capacity written
because it seemed plausible is worse than no capacity."*

---

## Decision 3 — the free lunch, argued rather than asserted

**The claim:** the hands-on/unattended split `src/lib/time.ts` already computes *is* the scaling
classification, so the baseline model costs no new annotation.

**The argument, from the vocabulary itself.** `UNATTENDED` (48 words) is physics of the food:
`rise prove ferment chill marinate brine soak steep braise simmer steam bake roast cure age
pressure`. `HANDS_ON` (24 words) is quantity of the food: `whisk stir knead beat fold toss roll
shape sear brown fry baste skim`. Those two lists were written for a timeline, with no thought of
scaling, and they sorted themselves into *"how long the change takes"* and *"how much there is to
do"*. That is the claim, and the fact that the split was drawn for another purpose is the evidence
that it is real rather than fitted.

**Then the attacks**, five of them, each classed. Four are the ticket's; the fifth was found in
this pass.

| # | Case | Class | Argument |
| --- | --- | --- | --- |
| 1 | Bigger pot, longer to temperature | **Accepted error** | Neither O(1) nor O(n) — heat-up goes with surface and mass. Nothing in the repo times it; no timer models heat-up. Bounded and small against a 2-hour simmer; unbounded against a 3-minute sear. Stated, not fixed |
| 2 | Crowded pan steams instead of browning | **Outside the model** | The clock does not move and the **dish** changes. The model cannot see it at all. This is what capacity is for: 23 files already say *"in two batches with room around every cube"*, and `counters.md` says *"if the basket sounds wet rather than loose, it is crowded and the answer is a second batch, not more minutes"* |
| 3 | Hands-on is not linear | **Accepted error, both directions** | Over-charge: `gumbo`'s 35-minute roux is a temperature process — three times the flour is not 105 minutes of stirring. Under-charge: `gyoza`'s pleating is per-unit and **untimed**, so the model prices it at zero |
| 4 | Oven recovery between batches | **Accepted error** | `r` charges `b` identical batches; the box drops on every door-opening, so real cost is superlinear in `b`. Nothing in the repo measures it. Direction of error is stated: the model is optimistic here |
| 5 | The same file is a different number of batches in a different kitchen | **Outside the model** | ATK, via `docs/gaps/air-fryer-and-pot.md`: *"external dimensions and stated capacities of air fryers are not reliable indications of how much food they can cook at once"*, and *"a recipe written for one machine's full basket is a recipe for two batches in another's."* Same bag of chips: 18 min at 1400 W, 12 at 1700 W, 9 at 2000 W. `c` is a fact about a kitchen the file cannot see |

Sixth, and it belongs with them: **the figures are only as good as the timers.** 395 of 664 recipes
score `unknown` on `handsOnEvidence`; 267 report `handsOnMinutes = 0`, mostly from absence.
`chili-con-carne` is one of them. A scaling claim on an unmeasured recipe is a confident answer
about nothing, and the phrasebook has to carry a sentence for it.

---

## Decision 4 — what the file asks of the tickets downstream

The file is the spec for five tickets, so it says what it needs rather than only what it knows.

1. **A capacity must name its operation, not just a number.** `beef-with-broccoli` is the proof:
   `c = 2` on its own is enough to triple a fridge rest. `>> capacity:` has to pin the batched leg.
   This is the file's one demand on T-011-03's shape.
2. **`src/generated/recipes.json` carries no per-step cookware.** Checked: `steps[]` has
   `ingredients` and `timers` and no vessel. The `#wok{}` mark exists in the body and is flattened
   to a recipe-level `cookware` list. T-011-02 needs the per-step mark, or the `capacity:` line
   must carry the step itself.
3. **Never print a scaling claim on a recipe whose `handsOnEvidence` is `unknown`** without saying
   so. Same rule S-010 put on the dials — passes, fails, **cannot say**.
4. **Absent is the default.** A recipe with no binding vessel declares nothing.

---

## Decision 5 — shape of the file

Follows `voice.md` and `counters.md`: second-person opener, tables carrying the content, a named
self-attack section, every number cited to a file, and a closing section on what could not be
measured.

```
# Scaling
  opener — what it costs to cook more, and how this collection decides
1 The three costs, and the thing that already measures them   (the free lunch, argued)
2 The cost function                                            (symbols, formula, dominance)
3 Work one out by hand                                         (beef-with-broccoli, 4 → 12)
4 Where it fails                                               (six cases, each classed)
5 What capacity is not                                         (AC item, stated flatly)
6 The phrasebook                                               (model finding → sentence)
7 Five dishes, worked                                          (chili, karaage, b-w-b, gumbo, gyoza)
8 The two situations                                           (n=2 today, n≈18 over three days)
9 What this file could not settle                              (the air fryer gap, capacity's kitchen)
```

Target 300–400 lines. `counters.md` is 1160 and `voice.md` 184; this sits between, and the
~200-line RDSPI guidance governs the work artifacts, not the deliverable.

### Phrasebook design

Rows are keyed on **what the model produced**, not on a dish, so five tickets can look up a case
rather than invent wording. Must cover: `r = 1` with negligible `H`; `r = 1` with real `H`; `r > 1`;
`n` below the knee; `n` crossing the knee; scaling **down**; no capacity declared; evidence
`unknown`; the recipe times nothing at all. No notation in any right-hand cell — that is the
acceptance criterion and the house rule (`voice.md` test 1).

### Rejected shapes

- **A section per downstream ticket.** Ties a knowledge file to a board that will move.
- **Leading with the phrasebook.** The sentences are only trustworthy after the model is stated;
  putting them first invites copying wording onto findings that do not hold.
- **Writing it as a gaps file.** `docs/gaps/` is ranked lists of what is missing. This settles a
  definition, which is `docs/knowledge/`.
