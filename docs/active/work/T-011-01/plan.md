# T-011-01 — Plan

One file of prose. The risk is not build breakage, it is a wrong number, so the plan is ordered
around measuring first and writing second.

---

## Steps

### Step 1 — Pin the measurements (done during Research; re-run before writing)

Rebuild the gitignored data and recompute every figure the file will quote.

```sh
export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"
npm run recipes                      # rebuilds src/generated/recipes.json (gitignored)
node --experimental-strip-types <scratchpad>/cp.mjs \
  chili-con-carne karaage gumbo gyoza beef-with-broccoli vindaloo
```

`cp.mjs` imports `buildSchedule` and `readTimers` from `src/lib/**` directly and prints, per slug:
`s`, `>> time:`, `T`, `H`, `U`, `A` (unattended timers on `criticalPath`), `H_cp`, `A+H`,
`untimedCount`, `handsOnEvidence`, and the critical path itself.

**Verification:** `A + H ≥ T` for every slug, with `A + H − T = H − H_cp`. Any violation means `A`
was computed wrong and nothing downstream is trustworthy.

**Status: done.** Seven slugs check out (table in `research.md` §4 / `design.md` Decision 1).

### Step 2 — Pin the arithmetic

A second script evaluates the cost function for every `(dish, n)` pair the file will print, and the
naive `r·A + m·H` alongside, so the 102-vs-42 contrast in §3 is measured rather than asserted.

**Verification:** every number that appears in §3, §7 and §8 of the file comes out of this script.
No number is typed from memory.

**Status: done.** 17 cases evaluated; results in `design.md` and `structure.md`.

### Step 3 — Write `docs/knowledge/scaling.md`

Section order from `structure.md` §Ordering: **2 → 3 → 7 → 4 → 6 → 8 → 1 → 5 → 9 → opener.**
Formula first, because four sections quote it.

Written as one file in one pass, not section-by-section commits — a knowledge file that half-states
a model is worse than no file, and there is no intermediate state worth reviewing.

**Verification, in order:**

1. **Numbers.** Every figure in the file appears in the Step 1 or Step 2 output. Grep the file for
   digits and account for each one.
2. **Citations.** Every claim about the repo names the file or script it came from, and each named
   path exists. Check `src/lib/time.ts`, `src/lib/schedule.ts`, `src/lib/plan.ts:47`,
   `src/pages/list.astro:925`, `docs/gaps/air-fryer-and-pot.md`, `docs/knowledge/counters.md`,
   `docs/knowledge/voice.md`, and the five recipe slugs.
3. **No notation in the phrasebook.** Every right-hand cell of §6 grepped for `O(`, `n`, `c`, `r`,
   `ceil`, `×`, and any symbol from the model.
4. **Acceptance criteria**, walked one by one — see the checklist below.

### Step 4 — Commit

```sh
lisa commit-ticket --ticket-id T-011-01 \
  --message "Write the cost of cooking more down" \
  --include docs/knowledge/scaling.md
```

Exactly one `--include`. Work artifacts are Lisa's to publish.

**Verification:** `git status --short docs/knowledge/` shows nothing for `scaling.md` afterwards,
and `git status --short src/ recipes/ scripts/` is unchanged from the pre-ticket snapshot — three
concurrent threads are editing `src/lib/step-labels.ts`, `src/lib/step-labels.test.ts` and
`scripts/normalise.mjs`, and none of those may be swept in.

### Step 5 — Review

`review.md` and `review-disposition.json`, then `lisa check-disposition T-011-01`.

---

## Testing strategy

**No unit tests, because no code changes.** The file is the artifact and it ships zero behaviour.
Writing a test would mean writing the cost function, which is T-011-02's ticket and explicitly out
of scope here (*"No code, no `.cook` file, no property"*).

What stands in for tests:

| Check | How | What it catches |
| --- | --- | --- |
| The identity `A + H ≥ T` | Step 1 script over 7 slugs | A wrong definition of `A` |
| Every printed figure traceable | Step 2 script; grep the file for digits | Invented numbers — the repo's cardinal sin, and the one this whole story is about |
| The hand computation reproduces | Do §3's arithmetic on paper against the script output | An AC in exactly these words |
| Cited paths exist | `ls` / `grep -n` each one | Rot at write time |
| No notation in the phrasebook | grep §6's right-hand cells | An AC in exactly these words |
| Build unaffected | `git status` on `src/`, `recipes/`, `scripts/` | Sweeping another thread's work into the commit |

**Deliberately not run: `npm run verify`.** It runs vitest over `src/lib/`, which two other threads
are mid-edit in; a failure there would be theirs and a pass would prove nothing about a markdown
file. `npm run recipes` was run (rebuilds a gitignored artifact) and parsed 664 recipes cleanly,
which is the only build step this ticket's inputs touch.

---

## Acceptance criteria checklist

| # | Criterion | Where it is met | How it is verified |
| --- | --- | --- | --- |
| 1 | `docs/knowledge/scaling.md` exists, in the shape of the folder | Whole file | Compare against `voice.md` / `counters.md`: second-person opener, tables, a named self-attack section, a closing "what could not be settled" |
| 2 | Cost function stated with algebra; a reader can compute a worked example by hand and get the file's number; **one shown in full** | §2 and §3 | §3 is `beef-with-broccoli` 4 → 12, every input with its source line, arithmetic to `42 min`; reproduced by the Step 2 script |
| 3 | The attention/scaling identity **argued**, and **≥ 4** failure cases, each classed | §1.2 and §4 | Argument runs off the two vocabularies in `time.ts`; §4 carries **six** cases, each ending in a bold *inside / outside / accepted error* |
| 4 | Phrasebook maps every finding to plain English, no notation | §6 | 12 rows keyed on model output; grep the right column for symbols |
| 5 | Four dishes worked end to end from real files, named by slug, ≥ 1 surprising | §7 | **Five** dishes; three flagged surprising (`karaage` cheap batching, `gumbo` over-charged, `gyoza` under-charged) |
| 6 | The two S-011 situations worked as queries | §8 | `n = 2` and `n ≈ 18`, each with a table over the worked dishes and a named winner |
| 7 | Says what capacity is **not** | §5 | Its own section: vessel's limit not a serving suggestion; a plain four-portion recipe has none |
| 8 | No code, no `.cook`, no property changed; only `scaling.md` and the work dir | — | Step 4's `git status` check; single `--include` |

**One criterion is met with a substitution and the file says so.** Criterion 5 asks for *"an air
fryer dish from S-008"* as a pole. No air fryer `.cook` file exists — T-008-04 writes them and
T-011-01 `depends_on: []`, so this ticket runs first by design. The pole is worked from `karaage`
(named by slug in `docs/gaps/air-fryer-and-pot.md` as the parent the basket variant will be a `kit:`
of) plus the measured basket figures in that same gaps file, and both §7 and §9 label it as an
illustration. Inventing an air fryer recipe to satisfy the criterion would break the rule the file
is about.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| A concurrent thread changes `src/lib/time.ts` or `schedule.ts` and moves the figures | Figures are stamped "664-recipe build" and cited to the fields, not to line numbers. Re-run Step 1 immediately before the commit |
| The file sets a model T-011-02 cannot implement | §9 states the two things the code will need (per-step vessel, capacity naming its operation) rather than assuming them |
| Over-length | `counters.md` is 1160 lines; ~350 is not the problem. Cut §7's prose before cutting §4's cases — the failure cases are what make the file honest |
| Sweeping another thread's files into the commit | Exactly one `--include`; `git status` checked before and after |
