# T-011-02 — Review

A recipe can now say how many servings its limiting vessel holds, and one function turns that into
what cooking any amount costs. **Every figure `docs/knowledge/scaling.md` worked by hand is a test,
and the code produces all of them.**

`npm run verify` passes: **1104 tests in 16 files, 685 recipes checked, 710 pages built.** Six
commits, `git status` clean of every ticket-owned path.

---

## What changed

| File | Lines | What |
| --- | ---: | --- |
| `src/lib/scaling.ts` | new, 501 | `readCapacity()`, `servingsOf()`, `boundSteps()`, `saysItBatches()`, `costOf()` |
| `src/lib/scaling.test.ts` | new, 735 | 55 tests in 9 groups |
| `src/lib/tree.ts` | +11 | `capacity?` and `capacityProblem?` on `RawRecipe`, and the type import |
| `scripts/normalise.mjs` | +19 | reads the line, promotes the key, returns both fields |
| `scripts/check-recipes.mjs` | +80 | `checkCapacity()` — two failures and one warning |
| `README.md` | +35 | the `capacity` bullet, and the file-table row |

Commits: `6f781cd`, `605463a`, `05f9629`, `59e3adc`, `0ed6fb9`, `e0c6022`. **No `.cook` file
declares a capacity** — that is T-011-03's, and every test here uses a fixture or spreads one onto a
real recipe in memory.

## The line

```cooklang
>> capacity: 2 — the wok, sear
>> capacity: 4 — the air fryer basket, roast
```

A number of **servings** (D1: it composes with the plan page's multipliers and survives somebody
editing `>> servings:`, where a batch count would silently become a lie), then the vessel, then the
operations it bounds. Refused, each with its own message: no number; zero or less; a count of
batches; no vessel; **no operation**.

The operation is not optional, and that is the design decision most likely to be argued with. It is
`scaling.md` §5's last rule and §3 is its proof: a bare `2` on `beef-with-broccoli` charges the wok's
batches to a thirty-minute rest in the fridge and turns 42 minutes into 102. Nobody's fridge holds
less because the wok does.

## The cost function

```
m = n/s     b(k) = ceil(k/c) or 1     r = b(n)/b(s)
elapsed(n)  = A_free + m·H_free + r·(A_batch + H_batch)
standing(n) =          m·H_free + r·H_batch
```

`costOf(recipe, wanted, schedule?)` returns numbers, booleans and one enum — `elapsed`, `standing`
and `longest` each as `{ written, at, factor, flat }`, plus `batches { written, at, ratio, binds,
costMinutes }`, `evidence`, `assumedStandingMinutes` and `untimedCount`. Null when the recipe has no
readable `>> servings:` or the target is not positive: there is no baseline, and inventing one is
`serves 4 → 12` all over again.

**Two things it gets right that a plausible implementation gets wrong**, both caught by the oracle
rather than by inspection:

1. **`A` is unattended minutes on the critical path, timer by timer.** `Task.attention` is a
   cautious whole-step label, and read that way karaage's `A` is 35 against the published 40 —
   the five-minute rack rest inside "fry 90 sec, rest 5 min" disappears into a hands-on label. So
   `splitAttention()` re-reads each step's timers with the same `readTimers()` call
   `buildSchedule()` makes. `schedule.ts` is outside this ticket's ownership, so a field could not
   be added to `Task`; the duplication is paid for by a whole-collection test that sums the re-read
   split over all 685 recipes and reproduces the schedule's own two totals exactly.
2. **A capacity binds timers, not whole steps.** Binding the whole step charges karaage's rack rest
   to the oil and repeats it, giving 57.5 where the file says 47.5. A timer's *name* is the author
   saying which operation its minutes belong to, so inside a bound step a named timer is in the
   vessel only when the capacity names it; an unnamed one is in whenever its step is. See
   `progress.md` for the full write-up.

## The check, and the one place this ticket read two documents against each other

The ticket asks for a capacity below `>> servings:` to fail, naming both lines. `scaling.md` §3
*authors exactly such a capacity* — `beef-with-broccoli` serves 4 and its wok holds 2 — and calls it
the collection's one readable case; the model's ratio `b(n)/b(s)` exists precisely so `b(s) > 1`
works.

**Resolved by reading the ticket's own sentence whole:** the fault it names is "a wrong number **or**
a recipe that already batches **and did not say**". So the check fails a capacity below servings
**unless a bound step's own words say it batches** — the word `batch` in the label or the body, which
is where the 23 files that batch already put it and where `beef-with-broccoli` writes
`sear in two batches 3 min`. Both dispositions are tested by running the checker for real:

```
FAIL   probe-contradiction.cook
       - capacity and servings disagree — one of these two lines is wrong:
           >> capacity: 2 — the wok, sear
           >> servings: 8
         the vessel holds 2 and the recipe makes 8, so it already goes in more than one load.
         Either the number is wrong, or the recipe batches and does not say so — say it where
         it happens ("in two batches"), the way beef-with-broccoli does
```

Two more: an operation that names no step in the file **fails** (printing the step labels it tried,
because the fix is always a word in that list), and a capacity on a file whose servings is not a
plain count — the six `N cups` files — **warns and does not fail**, since the fault is in what those
files can say.

## Test coverage

55 tests. The ones that carry the ticket:

| Group | What it holds |
| --- | --- |
| §7, five dishes | `chili-con-carne` 120/0 · `karaage` 47.5/7.5 · `beef-with-broccoli` 42/12 · `gumbo` 200/147 · `gyoza` 84/48 — the published figures, at the published sizes |
| §3 | `beef-with-broccoli` at 12 with `c = 2`, **and that it is not 102** |
| §7, the air fryer | 66 minutes at twelve, 26 with the capacity taken away, so the basket costs 40 — and karaage's oil costs 0 |
| §8 | both situation tables, all nine rows, rounded as the file rounds them |
| the five AC cases | unbounded at 3× (clock flat, chopping tripled) · bounded at 3× (both up by the ratio) · 0.5× (no batching, hands-on halved) · no capacity · a wholly assumed figure |
| the contract | every string in a `Cost` is one of `stated`/`inferred`/`unknown`; the vessel's own words never come back |
| the collection | the re-read split matches the schedule on all 685 · confidence never strengthens at any multiplier · nothing is `NaN` at any plan multiplier · `longest ≤ standing` |
| the checker | five cases run as a real process, exit codes and messages asserted |

**No notation escapes**, as the criterion asks, shown by grep as well as by test — the members of
`Growth`, `Batches` and `Cost` are `number`, `number | null`, `boolean`, and `evidence: Confidence`.
There is no other string in the return type, so there is nothing for a page to print except numbers
it has to phrase itself.

**Confidence carries through.** `cost.evidence` is `handsOnEvidence(schedule)` unchanged — the
verdict T-010-01 already ships — and `assumedStandingMinutes` scales by the same factor as the figure
it sits inside, so a guess multiplied reads as a bigger guess. Two whole-collection properties assert
that scaling can never strengthen the reading and never shrinks the assumed part when the figure
grows.

---

## Open concerns

1. **`scripts/parse-recipes.mjs` does not throw on `capacityProblem`.** It throws on
   `slackProblem`, `washingUpProblem`, `keepsProblem` and the step-label problems (its lines 54–56),
   and that file is **outside this ticket's ownership list**, so the line could not be added here.
   `check-recipes.mjs` fails on the same problem and `npm run verify` runs `check` before `recipes`,
   so nothing malformed can ship today — but a `npm run build` run on its own would let a
   half-written capacity through as `null`. **One line for whoever owns that file next; T-011-03 is
   the natural place.**
2. **A prose claim in `scaling.md` §2 is false in a corner, and nothing depends on it.** The file
   says `r ≥ m` always, "because `ceil` cannot give you a fraction of a batch". With `s = 4, c = 3,
   n = 8`: `b(4) = 2`, `b(8) = 3`, so `r = 1.5 < m = 2`. The formula is unaffected — the claim is
   used only to argue that `H_batch·(r − m)` is rounding — but `longestGrowth()` takes `max(m, r)`
   rather than `r` because of it. Worth a sentence in the knowledge file; that file is T-011-01's.
3. **The longest stretch's growth is the weakest number returned.** Which minutes are in the stretch
   is not recorded, so it grows by the larger of the two factors and is capped at the standing
   figure. It errs busy, which is `schedule.ts:longestUnbroken()`'s stated convention, and it is
   named as an accepted error in the code. A page leaning hard on it should say less rather than
   hedge more.
4. **The operation matcher is a guess about English.** Stems compared whole, then a prefix either
   way, three letters minimum: `sear`/`searing` and `marinate`/`marinating` match, `fry`/`fries`
   would not. The failure is loud — an operation that matches nothing fails the check and prints the
   labels — so T-011-03 will find out immediately, on the file it is annotating.
5. **A capacity binds whole operations, never a fraction of one.** A single timer covering a sear
   and a simmer is charged whole. `scaling.md` §4 already carries the accepted errors this joins:
   crowded pans, oven recovery, heat-up, and non-linear hands-on work.
6. **No cap on the capacity line in `check-recipes.mjs`'s `CAPS`.** The line is a number, a vessel
   and a verb, and there is nothing measured to put a cap at. If T-011-03 writes essays into it,
   that is the moment to measure and add one.

## What a reviewer should look at first

`src/lib/scaling.ts:costOf()` and the `§7` and `§8` describe blocks in the test — between them they
are the whole claim, and they are checkable against `docs/knowledge/scaling.md` without reading any
other code. After that, `checkCapacity()` in `scripts/check-recipes.mjs`, which is the one place this
ticket interpreted rather than implemented.
