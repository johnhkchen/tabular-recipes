# T-011-02 — Research

What exists, where, and what it already answers. No proposals; those are `design.md`'s.

The ticket names one authority: **`docs/knowledge/scaling.md`**, and says that where code and that
file disagree, the file is right. So the first job of this phase was not reading code — it was
re-measuring the file's published figures against the build. **They all reproduce.** §5 below.

---

## 1. The authority: `docs/knowledge/scaling.md` (521 lines, T-011-01, commit `2a118e5`)

The parts this ticket has to implement, quoted by section:

| § | What it settles |
| --- | --- |
| §1 | The hands-on / unattended split the site already computes **is** the scaling classification. No new per-step annotation. |
| §2 | The symbols, the formula, and why `r` is a ratio rather than a batch count |
| §3 | `beef-with-broccoli` worked by hand, 4 → 12 portions, and the 102-minute wrong answer that motivates naming an operation |
| §4 | Six failure cases, each labelled *inside the model*, *outside it*, or *an accepted error* |
| §5 | What capacity is **not** — five rules, the last of which is "it names an operation, not just a number" |
| §6 | The phrasebook. Thirteen findings, thirteen sentences. **No notation, ever.** |
| §7 | Five dishes worked from the 664-recipe build, plus the air fryer illustration |
| §8 | Two situations from S-011, each a query against the model |
| §9 | What the file could not settle — including that per-step cookware is not in the generated data |

The formula, verbatim from §2:

```
m = n/s      b(k) = ceil(k/c), or 1 when no capacity      r = b(n)/b(s)

elapsed(n)  = A_free + m·H_free + r·(A_batch + H_batch)
standing(n) =          m·H_free + r·H_batch
elapsed(n)  = A + m·H                                     when no capacity is declared
```

`A` is **unattended minutes on the critical path** — not `schedule.unattendedMinutes`, which is a
branch sum (`gyoza` reports 56 unattended minutes against a 49-minute recipe). `H` is
`schedule.handsOnMinutes` as published. `A_batch`/`H_batch` are the parts of each inside the
operations the capacity is declared against.

---

## 2. What the codebase already computes

### `src/lib/schedule.ts` — `buildSchedule(recipe, tree?) → Schedule`

Everything the cost function needs is already on this object, and **nothing here needs changing**
(the file is outside this ticket's ownership list, which is consistent with that):

| Field | What it is |
| --- | --- |
| `totalMinutes` | Length of the critical path |
| `criticalPath: string[]` | Ids (`s0`, `s3`, …) of the chain that sets the total, earliest first |
| `unattendedMinutes` / `handsOnMinutes` | Branch **sums**, timer by timer |
| `assumedHandsOnMinutes` | The part of `handsOnMinutes` that is there only because nothing was said |
| `longestHandsOnMinutes` | T-010-01's number: the longest unbroken run of hands-on work, one cook, all branches |
| `untimedCount` | Operations that never said how long they take |
| `tasks[]` | `{ id, label, minutes, timed, attention, confidence, start, end, dependsOn }` |

`handsOnEvidence(schedule) → 'stated' | 'inferred' | 'unknown'` collapses the per-task confidence
into one verdict per recipe. T-010-01 shipped exactly this verdict to the search index rather than
the two raw numbers behind it, because "a browser deriving this for itself is a second answer to one
question".

**The gap that matters.** `Task.attention` is *task-level and deliberately cautious*: a step with
one hands-on timer among five is labelled `hands-on` whole. `A` needs the **timer-level** split, and
the schedule does not publish it per task — it only publishes the two collection-wide sums. Measured
both ways on `karaage`: task-level gives `A = 35`, timer-level gives `A = 40`, and §7 says **40**.
`gyoza` is the same story (task-level 30, timer-level 36, §7 says 36). So whatever computes `A` has
to re-read the step's timers with `readTimers()` the way `buildSchedule()` does.

### `src/lib/time.ts`

`readTimers(timers, label) → Reading[]` — one reading per timer: `{ attention, source }` with
`source ∈ {name, label, default}`. `minutesOf(value, unit)`. `UNATTENDED` (53 words) and `HANDS_ON`
(24 words) are the classification §1 leans on.

### `src/lib/tree.ts`

`RawRecipe` is the shape everything downstream reads. Authored, promoted fields already living here:
`counters`, `dish`, `kit`, `slack` + `slackProblem?`, `washingUp` + `washingUpProblem?`, `aka`,
`pairsWith`, `variants`. Free-text metadata that was never promoted stays in `metadata:
Record<string, string>` — which is where `servings` and `time` still live.

### `src/lib/plan.ts`

`MULTIPLIERS = [0.5, 1, 2, 3]`, `formatMultiplier()`, `scaleAmount()`. `src/pages/list.astro:925`
prints `serves 4 → 12` with the clock unchanged — the lie §0 of `scaling.md` opens on. Not this
ticket's to fix (T-011-05 owns the plan page).

---

## 3. The path an authored property takes — `slack` and `washing-up`, four stops

1. **A reader in `src/lib/`.** `readSlack(value)` and `readWashingUp(value)` each return
   `{ <field>: T | null, problem: string | null }`. Whole, or nothing — and when it is nothing, the
   reason to print. Both are pure and both are tested directly.
2. **`scripts/normalise.mjs`** calls the reader (lines 240, 249), puts the value and the problem on
   the returned object, and adds the key to `PROMOTED` (line 252) so it is deleted from the loose
   `metadata` map. Reading happens **before** the deletion, and `washing-up` is passed through
   `undefined`-or-not deliberately: absent and present-but-empty are different answers.
3. **`src/lib/tree.ts`** types the field on `RawRecipe`, with the doc comment that explains why it
   is authored.
4. **`scripts/check-recipes.mjs`** pushes `recipe.<field>Problem` into `problems` (lines 155–158),
   which fails the file. Advisory cross-checks go into `notes`, which print and exit 0.

`scripts/parse-recipes.mjs:54-56` also throws on `slackProblem`, `washingUpProblem` and
`stepLabelProblems` at build time. **That file is not in this ticket's ownership list.**

House rules both readers state and this ticket inherits: *authored, never derived*; *the value is in
the reason / the list*; *a derived number is never written by an author* (`washing-up` refuses `2`
as an entry); *absent is a legitimate answer and most of the collection is absent*.

---

## 4. `>> servings:` as it actually is

Required metadata already (`check-recipes.mjs:24`), and present on all 664 files. Distribution:

```
189 × 4    150 × 6    126 × 8    73 × 12    39 × 2    20 × 16    19 × 24    17 × 9    17 × 10
 11 × 1     6 × 48     3 × 18     3 × "1 cup"   2 × 40   2 × 36   2 × 30   1 × 20   1 × "6 cups" …
```

**Six files carry a volume rather than a count** — `1 cup`, `2 cups`, `3 cups`, `6 cups`. §2 of
`scaling.md` says servings "parses as a number on 664 of 664 files", which is true of a
leading-number read (`1 cup` → 1) and false of a strict one. Worth knowing: on those six the
comparison "capacity below servings" compares a count to a volume.

---

## 5. The published figures, re-measured against today's build

Run through `buildSchedule()` on `src/generated/recipes.json`, with `A` taken **timer by timer along
`criticalPath`**:

| Slug | `s` | `A` | `H` | `L` | `untimed` | `handsOnEvidence` | §7 says `A`/`H` |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `chili-con-carne` | 6 | 120 | 0 | 0 | 4 | `unknown` | 120 / 0 ✓ |
| `karaage` | 4 | 40 | 2.5 | 1.5 | 1 | `inferred` | 40 / 2.5 ✓ |
| `beef-with-broccoli` | 4 | 30 | 4 | 3 | 1 | `inferred` | 30 / 4 ✓ |
| `gumbo` | 8 | 53 | 49 | 49 | 0 | `stated` | 53 / 49 ✓ |
| `gyoza` | 4 | 36 | 16 | 8 | 2 | `inferred` | 36 / 16 ✓ |
| `vindaloo` | 6 | 780 | 13 | 13 | 0 | `stated` | 780 / 13 ✓ (§8) |

Applying §2's formula by hand to those inputs reproduces **every** number §7 and §8 publish:

```
chili   n=18  120 / 0        karaage n=12  47.5 / 7.5     beef n=12  42 / 12
gumbo   n=24  200 / 147      gyoza   n=12  84 / 48
§8 at n=2:  beef 32/2 · karaage 41.25→41/1.25→1 · gyoza 44/8 · gumbo 65.25→65/12.25→12 · chili 120/0
§8 at n=18: beef 48/18 · chili 120/0 · gyoza 108/72 · gumbo 163.25→163/110.25→110
air fryer fixture (A_batch 20, H 2, c 4, s 4, n 12): 66 elapsed, 26 with the capacity removed, 40 cost
```

So the model is not in dispute with the build. **No recipe declares a capacity** — `grep -rn
capacity recipes src scripts` returns nothing at all. That is T-011-03's work, and this ticket's
tests must use fixtures.

---

## 6. Two things the ticket and the authority say differently

Recorded here as findings; `design.md` resolves them.

**(a) A capacity below servings.** The ticket: *"A capacity below the recipe's own servings is a
contradiction … Fail the check."* `scaling.md` §3: `beef-with-broccoli` serves 4 and its wok holds
2, which is the file's only fully worked example and the case §2's ratio `r = b(n)/b(s)` exists to
handle — `b(s) = 2` means the recipe as written already batches. The two documents are describing
different halves of the same sentence: the ticket's own words are *"a wrong number **or** a recipe
that already batches **and did not say**"*. `beef-with-broccoli` says it, in the step label the file
quotes: `>> step: sear in two batches 3 min, lift out`. `karaage` says it in the step body: *"Fry …
in batches"*.

**(b) `r ≥ m always`.** §2 claims this ("`ceil` cannot give you a fraction of a batch"), and uses it
to argue that `H_batch·(r − m)` is only rounding. It is false in general: `s = 4, c = 3, n = 8`
gives `b(4) = 2`, `b(8) = 3`, so `r = 1.5 < m = 2`. Nothing in the formula depends on the claim —
the correction is to the prose around it, not to the arithmetic.

---

## 7. Constraints this ticket works under

- **Ownership is narrow**: `src/lib/scaling.ts`, `src/lib/tree.ts`, `scripts/normalise.mjs`,
  `scripts/check-recipes.mjs`, `README.md`, their tests, `docs/active/work/T-011-02/**`.
  **`src/lib/schedule.ts` is not in the list**, so `A` cannot be got by adding a field to `Task`.
  **`scripts/parse-recipes.mjs` is not either**, so a `capacityProblem` cannot be made to throw at
  build time by this ticket.
- **No `.cook` file may declare a capacity.** Fixtures only.
- **No notation escapes.** `scaling.md` §6 is the whole of what a page may say, and it is
  T-011-05's/T-011-06's to say. A `Cost` that carries a printable string is how `O(n)` reaches a card.
- `npm run verify` = `check` → `recipes` → `vitest run` → `astro build`. Vitest does not typecheck;
  `astro build` typechecks `.astro`. A required new field on `RawRecipe` would still break the
  hand-built fixtures in `schedule.test.ts` and `layout.test.ts` under any future `tsc`.
- Node is not on the default PATH in this environment; `~/.nvm/versions/node/v24.18.1/bin` is.
