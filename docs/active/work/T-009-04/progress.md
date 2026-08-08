# T-009-04 — Progress

All five planned steps complete. `npm run verify` passes. Three commits through
`lisa commit-ticket`; no `.cook` file edited and no recipe changed.

## Step 0 — Before-evidence ✅

- `scratchpad/dump-trees.mjs` written: per recipe, grid shape, leaf order with row numbers,
  header and footer rows, root step, and every op node's step, column, row, row span, label
  and child list — sorted so two runs diff cleanly.
- `before/trees.txt`: **685 recipe blocks, 7,980 lines, 0 threw.**
- Baseline `npm run verify` → exit 0.

## Step 1 — The reader ✅ — commit `b6b425c`

`src/lib/step-labels.ts`
- `scanSteps` split into an exported `stepBlocks(lines) → number[][]` (every line index of
  each block) with `scanSteps` reduced to `stepBlocks(lines).map((b) => b[0])`.
- **Deviation from `structure.md`:** the plan said "`scanSteps` stays exported". It was never
  exported — it is module-private and stays that way. Only `stepBlocks` is exported. No
  caller outside the module ever wanted the starts.

`src/lib/step-refs.ts` — new, 3 exports, pure.
- `resolveRef(token, stepIndex)` — window `0 <= target < stepIndex`.
- `readStepRefs(source)` — tokens per step, from the block scan.
- `refProblems(written, resolved)` — the problems, plus the parser-disagreement guard.

Verify: `step-labels.test.ts` 34/34 unchanged; `npm run verify` exit 0.

## Step 2 — The wiring ✅ — commit `beb829d`

- `scripts/normalise.mjs` — imports the two functions, computes `stepRefProblems` from
  `cleaned` (the blanked source the parser was handed) and `steps.map(s => s.refs)`, returns
  it beside `stepLabelProblems`.
- `scripts/check-recipes.mjs` — `problems.push(...recipe.stepRefProblems)` under the label
  push, so it prints under `FAIL <path>` and exits 1.
- `scripts/parse-recipes.mjs` — added to the loop that throws `${recipe.path}: ${problem}`.

Verify:
- `node scripts/check-recipes.mjs` → `all 685 file(s) draw a table.`, exit 0.
- `bug in readStepRefs` — **0 hits** across the collection. The scan and the parser agree on
  all 685 files.
- `points at no step` — **0 hits**. The check landed green, as predicted by the 2,500-token
  scan in Research.
- `npm run verify` exit 0, 1,005 tests.

### Wording, fixed here rather than in review

The first draft of the message ended `A reference names a step from the top of the file
(@&(3), counting prep steps)…`. Read aloud against the self-reference fixture it came out as
`step 3 writes @&(3) … a reference names a step from the top (@&(3))` — the example was the
number already written, so it read as advice to type what the author had typed. Both example
numbers were removed. A second pass fixed `land on one of the 0 step(s) above it` for a
reference written in step 1, which now says `step 1 has nothing above it` and points at the
new-branch rule instead. Plural `step`/`steps` handled.

Final message, hand-checked on six fixtures:

```
FAIL   fix/ghost.cook
       - step 4 writes @&(99), which points at no step — cooklang read it as an ingredient
         instead of a reference, so the table would draw a row that is not an ingredient. A
         reference names a step counted from the top of the file, prep steps included, or
         counted back from this one with a ~, and either way it has to land on one of the 3
         steps above it.
```

## Step 3 — The tests ✅ — commit `9250234`

`src/lib/step-refs.test.ts` — 23 tests, four describes.

- `resolveRef` — 4 tests: absolute, relative, the six out-of-window shapes, and step 1.
- `readStepRefs` — 6 tests: order, two in one step, a step running over two lines, a token in
  a `--` comment (not counted), a token in a `>>` line (not counted), a file with none.
- `refProblems` — 5 tests: silence when all resolve, naming the step and token, the step-1
  wording, the no-colliding-example rule, and the parser-disagreement guard.
- **The checker, run for real** — 8 fixtures through `execFileSync` on
  `scripts/check-recipes.mjs`, temp dir, never `recipes/`:

| Fixture | Result |
| --- | --- |
| healthy, both forms | exit 0 |
| `@&(99)` past the end | exit 1, names file + `step 4` + token |
| `@&(~9)` past the start | exit 1 |
| `@&(0)` | exit 1 |
| step 3 referencing itself | exit 1 |
| `@&(1)` at a prep step | exit 1, `step 5 references step 1, which makes nothing` |
| `@&(~4)` at a prep step | exit 1, same message |
| the whole 685-file collection | exit 0 |

### The tests were confirmed to fail without the fix

`problems.push(...recipe.stepRefProblems)` was commented out and the suite re-run:

```
× fails on a reference past the end of the file, and names the file and the step
× fails on a relative reference past the start of the file
× fails on @&(0), because there is no step zero
× fails on a step that references itself
Tests  4 failed | 19 passed (23)
```

**Exactly the four new-failure tests fail; the two prep-step tests still pass.** That is the
evidence for both halves of the acceptance criterion at once: the four are new coverage of a
hole this ticket closed, and the two are proof that the prep-step refusal already worked and
is now pinned. The line was restored (`git diff --stat` empty) and `npm run verify` re-run.

## Step 4 — Proof and write-ups ✅

**The tree dump, before and after — the primary evidence.**

```
$ diff before/trees.txt after/trees.txt
$ echo $?
0
```

**Byte-identical across all 685 recipes** — grid shape, leaf order, full-width rows, root,
and every operation node's column, row, row span, label and child list. A check added to the
parse path changed no page. This is T-009-02's instrument, reused.

**Final `npm run verify`:**

```
all 685 file(s) draw a table.
 Test Files  14 passed (14)
      Tests  1028 passed (1028)
[build] 710 page(s) built
EXIT=0
```

**Working tree:** no ticket-owned file staged, modified or untracked. The only untracked path
is `docs/.obsidian/`, which predates this ticket and is not ticket-owned.

`naming-steps-proposal.md` written — count, cases fixed, cost, recommendation. Not started:
no syntax added, no code, no `.cook` edit.

## Deviations from the plan

1. **`scanSteps` was already private** and stayed private; only `stepBlocks` is exported.
   `structure.md` described it as staying exported, which was wrong about the starting state.
2. **The naming proposal's count was corrected.** `plan.md` said "125 = relative refs of
   distance ≥ 2". 125 is the count at distance **≥ 3** (90 + 33 + 2); distance 2 is 251 on its
   own. The proposal states both separately and argues only the 125 + 33 = 158 are worth
   migrating.
3. **Step 2's commit re-included `src/lib/step-refs.ts`** because the message wording was
   fixed after step 1 had already committed the file.

## Not done, deliberately

- **No `.cook` file converted.** `design.md` §Evidence 2 and 3: the migration is provably
  tree-preserving but buys no correctness, because both reference forms are caught 30/30
  under insertion.
- **No `README.md` edit.** The acceptance criteria permit it "if the syntax changed"; no
  syntax changed. Raised in `review.md` as a follow-up rather than taken against a scope line.
