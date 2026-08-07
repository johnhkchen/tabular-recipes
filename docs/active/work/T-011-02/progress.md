# T-011-02 — Progress

Six steps, six commits, all planned steps done. `npm run verify` passes: **1104 tests in 16 files,
685 recipes checked, 710 pages built.**

| Step | Commit | What landed |
| --- | --- | --- |
| 1 | `6f781cd` | `src/lib/scaling.ts` — the reader half, and its tests |
| 2 | `605463a` | `tree.ts` types it, `normalise.mjs` promotes it |
| 3 | `05f9629` | `check-recipes.mjs` fails the two lines that disagree, tested by running it |
| 4 | `59e3adc` | the cost function, and every figure `scaling.md` publishes as an oracle test |
| 5 | `0ed6fb9` | the five criterion cases, the no-notation contract, the whole-collection properties |
| 6 | `e0c6022` | `README.md` — the `capacity` bullet and the file-table row |

---

## Deviations from the plan

**One, and it is the substantive finding of the implementation.**

### Capacity binds TIMERS, not whole steps (step 4)

`structure.md` said `A_batch`/`H_batch` are the parts of `A` and `H` "in steps `boundSteps()`
returns". That is wrong, and the oracle caught it on the first run: **karaage came out at 57.5
minutes where `scaling.md` §7 says 47.5.**

The cause is that a step is often two operations in one sentence. Karaage's is
`~fry{90%sec}, then lift it onto a rack and ~rest{5%min}` — ninety seconds in the oil and five
minutes on a rack, and **only the first is in the pot.** Binding the whole step charges the rack
rest to the vessel and repeats it three times, which is §3's 102-minute error again one level down.

The fix is `binderFor()` in `scaling.ts`: **a timer's NAME is the author saying which operation its
minutes belong to** — the same claim `time.ts` already leans on for the whole hands-on reading — so
inside a bound step, a named timer is in the vessel only when the capacity names it, and an unnamed
timer is in whenever its step is (nothing distinguishes it, and charging it is the busier reading).

With that, karaage is 47.5 and the air fryer fixture is 66, both exactly as published. `boundSteps()`
stays step-level, because the checker's two questions — does this operation exist, and does the file
say it batches — are questions about steps.

### Two smaller corrections, both caught by tests

- **The longest stretch may not exceed the standing figure.** `max(m, r)` alone reported
  `chewy-granola-bars` standing at the hob for 10 unbroken minutes out of 5 minutes of work at 0.5×,
  because `r` is 1 when nothing binds and `max(0.5, 1)` is 1. Now the factor is `m` unless the vessel
  bounds hands-on work, and the result is capped at `standing.at` — the schedule keeps the same
  invariant, and a run longer than the work it is cut from is incoherent rather than cautious.
- **`>> servings:` needs to be a plain count for the contradiction check.** `structure.md` said the
  note fires when servings does not parse; in fact `servingsOf()` reads the leading number of
  `2 cups` and returns 2. The note now fires when the line is not a bare number, and the comparison
  is skipped rather than made against a volume.

## What the collection did while this ran

Other threads landed `keeps` (T-011-04) and the air fryer recipes (T-008-04) on the same branch.
The collection is **685 files, not the 664 `scaling.md` and `research.md` counted** — none of the
published figures moved, because all five worked dishes are unchanged files. Both `tree.ts` and
`check-recipes.mjs` were edited by those threads before this ticket touched them; each of this
ticket's commits added to the current state of the file rather than overwriting it, and
`git status` is clean of every ticket-owned path.

One test outside this ticket (`keeps.test.ts`, on `air-fryer-frozen-prawns`) failed mid-run from the
collision between those two threads and was fixed by `fcfef25` before this ticket finished. It never
touched anything here.

## Verification, in the order plan.md asked for it

1. `npm run check` — 685 files draw a table, nothing says a word about capacity (none declares one).
2. `npx vitest run` — 1104 tests, 16 files, all pass. No other suite's fixtures broke on the new
   optional `RawRecipe` field.
3. `npm run verify` — check, parse, test, build. Passes.
4. The return types carry no string but `Confidence`; the grep is in `review.md` and the same claim
   is a test.
5. `git status --short` clean of ticket-owned files.
