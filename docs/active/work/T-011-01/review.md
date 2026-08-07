# T-011-01 — Review

**One file created: `docs/knowledge/scaling.md`, 521 lines.** No code, no `.cook` file, no property.
Committed as `2a118e5` through `lisa commit-ticket` with a single `--include`.

---

## What changed

| File | Action | Lines |
| --- | --- | ---: |
| `docs/knowledge/scaling.md` | created | 521 |

Nothing else. `git status --short docs/knowledge/scaling.md` is clean;
`git log --oneline -1 -- docs/knowledge/scaling.md` shows `2a118e5 Write the cost of cooking more
down`. `src/generated/recipes.json` was rebuilt three times to take measurements and is gitignored.

Three other threads committed to `recipes/**` during this ticket (T-008-03's `washing-up`
annotations, among them `gumbo`, `chili-con-carne`, `vindaloo` and `chile-verde`). Every figure this
file cites was re-measured after those landed and none moved.

---

## What the file says

Nine sections. The load-bearing ones:

**§2, the cost function.** For a recipe written for `s` servings, measured at `s`:

```
m = n/s      b(k) = ceil(k/c) or 1      r = b(n)/b(s)
elapsed(n)  = A_free + m·H_free + r·(A_batch + H_batch)
elapsed(n)  = A + m·H                                     when no capacity is declared
```

`A` is unattended minutes **on the critical path**, not `unattendedMinutes` — the latter is a branch
sum and prices waits that never happened (`gyoza`: 56 unattended minutes against a 49-minute clock).
`r` is a **ratio** because the 23 files saying `~brown{12%min}, in two batches` have already paid for
their batching inside the timer.

**The checkable identity**, verified on seven recipes: `A + H ≥ totalMinutes`, equality on a single
chain, gap exactly `H − H_cp` — the hands-on work the timeline gave to a second pair of hands. So
`elapsed(s)` is the one-cook clock and errs towards a busier evening, matching
`schedule.ts:longestUnbroken()`.

**The result the ticket did not ask for and the file is better for.** Subtracting the no-capacity
answer from the capacity one:

```
cost of the vessel = A_batch·(r − 1) + H_batch·(r − m)
```

`r ≥ m` always, so the second term is only a part-full last batch. **A vessel that binds on a wait
is expensive; a vessel that binds on work is free.** The air fryer's basket costs 40 minutes at
twelve portions. The wok in `beef-with-broccoli` and the oil bath in `karaage` cost zero — both
batch, and neither reaches the clock. This caught a wrong claim in the first draft (see *Corrections*
below) and it hands T-011-03 a filter: most of the 55 files mentioning batches do not need a
`>> capacity:` at all.

---

## Acceptance criteria

| # | Criterion | Met | Evidence |
| --- | --- | --- | --- |
| 1 | File exists, in the shape of the folder | **yes** | Second-person opener, tables carrying the content, a named self-attack section (§4), a closing *What this file could not settle* (§9) — the shape of `voice.md` and `counters.md` |
| 2 | Cost function with algebra; a reader can hand-compute and get the file's number; one shown in full | **yes** | §3: `beef-with-broccoli` 4 → 12, every input with its source line, arithmetic to 42 min. Reproduced by script |
| 3 | The attention/scaling identity **argued**, ≥ 4 failure cases, each classed | **yes** | §1 argues it from the two vocabularies in `time.ts` and from the fact they were drawn for a timeline. §4 carries **six** cases: 2 outside the model, 4 accepted errors, each with its direction of error stated |
| 4 | Phrasebook covers every finding, no notation | **yes** | §6, twelve rows keyed on model output. Right column grepped clean for `O(`, backticks, `×`, `≈`, `≤`, `≥`, symbols |
| 5 | Four dishes worked from real files, by slug, ≥ 1 surprising | **yes, with a substitution** | **Five**: `chili-con-carne`, `karaage`, `beef-with-broccoli`, `gumbo`, `gyoza`. Three surprising. See *Open concerns* 1 |
| 6 | The two S-011 situations worked as queries | **yes** | §8: `n = 2` → `beef-with-broccoli`; `n ≈ 18` → `chili-con-carne`, with the `keeps` flag |
| 7 | Says what capacity is **not** | **yes** | §5, its own section: vessel's limit not a serving suggestion; a plain four-portion recipe has none; absent by default; names an operation |
| 8 | No code, `.cook` or property changed | **yes** | One `--include`; `git status` clean on `src/`, `recipes/`, `scripts/` |

---

## Verification

No unit tests, because no code ships. Writing the cost function is T-011-02 and is explicitly out of
scope. What stands in for tests:

| Check | Result |
| --- | --- |
| `A + H ≥ totalMinutes`, gap `= H − H_cp` | Holds on 7 of 7 measured slugs |
| Every figure in §3, §7, §8 reproduced by script | 17 of 17 |
| Figures re-measured after three concurrent commits to `recipes/**` | Unchanged |
| Collection counts (46 / 223 / 395 evidence; 267 zero-hands-on; 60 fully timed; 664 servings) | Re-confirmed on the final build |
| Batch prose (55 files, 23 verbatim) | Re-confirmed |
| Cited paths exist | 12 of 12 |
| `plan.ts:47`, `list.astro:925` quoted verbatim | Both confirmed |
| Vocabulary sizes | `UNATTENDED` 53, `HANDS_ON` 24 |
| `npm run recipes` | 664 recipes, 27 categories, clean |

**`npm run verify` was deliberately not run.** It runs vitest over `src/lib/`, which other threads
were mid-edit in for the whole of this ticket; a failure would have been theirs and a pass would
prove nothing about a markdown file. The only build step this ticket's inputs touch is
`npm run recipes`, which passed.

---

## Corrections made during the work

Recorded because two of them were wrong in the first draft and the checks are what caught them.

1. **`beef-with-broccoli`'s wok "costs eight minutes" — it costs nothing.** Caught by running the
   no-capacity case alongside. Produced the vessel-cost formula in §2 and rewrote §3's close, §7.3,
   the air fryer block and one phrasebook row.
2. **`UNATTENDED` is 53 words, not 48.** Counted rather than estimated; corrected in the deliverable
   and in all three earlier artifacts.
3. **Evidence split is 46 / 223 / 395**, not 46 / 224 / 395 — the first pass ran against a
   665-file build that included another thread's transient probe file.

---

## Open concerns

### 1. The air fryer pole is an illustration, not a recipe — and the ticket asked for a recipe

The ticket names *"an air fryer dish from S-008"* as one of two poles. **No air fryer `.cook` file
exists in this collection.** No file declares `kit: Air Fryer`; `counters.md` says so outright
(*"The site owns no air fryer recipe at all"*); S-008 gives the writing to **T-008-04**, which is
open. T-011-01 `depends_on: []`, so this ticket runs first by design and the pole cannot be a file.

What was done instead, and stated twice in the deliverable (§7 and §9): the pole is worked from
`karaage` — named by slug in `docs/gaps/air-fryer-and-pot.md` as the parent the basket variant will
be a `kit:` of — plus that same file's **measured** basket figures (wings at 200°C for 18–24 min;
ATK's basket holding about four cutlets). The block is labelled an illustration and carries no
invented recipe and no invented capacity.

**This is not a blocker and should not be treated as one.** Inventing an air fryer recipe or a
capacity to satisfy the wording would be the exact failure S-011 exists to prevent: *"a capacity
written because it seemed plausible is worse than no capacity."* §9 says what T-008-04 should
trigger — rewrite §7's air fryer block from a real file and **check** the numbers rather than adjust
them.

### 2. Two things the code will need that the data does not have

Both in §9, and both are T-011-02's problem rather than defects here:

- **`src/generated/recipes.json` carries no per-step cookware.** `steps[]` has ingredients and
  timers; the `#wok{}` mark is flattened to one recipe-level `cookware` list. The cost function
  needs the mark per step, **or** `>> capacity:` must carry the operation itself.
- **A capacity that is only a number is not enough.** §3 shows the cost of getting this wrong: 102
  minutes instead of 42. This is a real constraint the file places on T-011-03's shape.

### 3. The model is knowingly wrong in four places, and one of them is large

§4 states all six failure cases with their directions. The one worth a reviewer's attention is
**§4.6**: 395 of 664 recipes score `unknown` on `handsOnEvidence` and 267 report zero hands-on
minutes, mostly from absence. `chili-con-carne` — the story's own headline example — has four
untimed operations out of five, so *"cooking three times as much costs you nothing extra"* is true
there partly by luck. The phrasebook carries a row for this and T-011-05 must use it rather than
print a number.

### 4. Length

521 lines against a ~350 estimate. `counters.md` is 1160 and `voice.md` 184, so it sits inside the
folder's range, but §7 is the section to cut first if a reader finds it long — not §4, which is what
makes the file honest.

### 5. Not linked from `README.md`

Deliberate, and argued in `structure.md`: a pointer to an unimplemented model does not belong in the
front door. The link belongs to whichever ticket first ships a scaling feature.

---

## For a human reviewer, in one paragraph

The argument to check is §2 and §3. If the cost function is right, the rest follows; if it is wrong,
five tickets inherit it. The two claims most worth attacking are that **`A` should be critical-path
unattended time rather than `unattendedMinutes`** (§2, with the seven-row identity table as
evidence) and that **`r` should be a ratio rather than a batch count** (§2, from the 23 files whose
timers already contain their own batching). The one thing a reviewer might reasonably want changed
is the air fryer pole, and the answer is that the file it needs has not been written yet.
