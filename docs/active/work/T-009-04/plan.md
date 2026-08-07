# T-009-04 — Plan

Five steps. Step 0 takes evidence that cannot be taken later; steps 1–3 are the three
commits; step 4 is the proof and the write-ups.

`node` is not on the default `PATH` in this environment. Every command below runs with:

```sh
export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"     # .node-version says 24.18.1
```

---

## Step 0 — Take the before-evidence

The tree dump has to be taken before any code lands, because a before-dump cannot be taken
afterwards. Same instrument as T-009-02's label dump.

1. Write `scratchpad/dump-trees.mjs`: for all 685 `.cook` files, print one block per recipe —
   `slug`, `rows x cols`, the leaf order, the header and footer rows, and for every op node
   its label, column, row, row span and child list, sorted so two runs diff cleanly.
2. `node scratchpad/dump-trees.mjs > scratchpad/before/trees.txt`
3. `npm run verify` — record that it passes **before** anything changes, so a failure later
   is attributable.

**Verify:** `before/trees.txt` has 685 recipe blocks; `verify` exits 0.

---

## Step 1 — The reader (commit 1)

### 1a. `src/lib/step-labels.ts`

- Add `export function stepBlocks(lines: string[]): number[][]` — the existing `scanSteps`
  walk, collecting every line index of a block instead of only the first.
- Reduce `scanSteps` to `stepBlocks(lines).map((b) => b[0])` and keep it exported.
- Doc comment says why one scan: the reader that finds a step and the reader that finds its
  references must not disagree.

**Verify:** `npx vitest run src/lib/step-labels.test.ts` — all existing tests pass untouched.
`scanSteps` has one behaviour and the suite already pins it (`stepLines` assertions).

### 1b. `src/lib/step-refs.ts` — new

`resolveRef`, `readStepRefs`, `refProblems` as specified in `structure.md` §2. Nothing
imports it yet.

**Verify:** `npm run verify` exits 0 — a new unused module changes nothing.

**Commit:**

```sh
lisa commit-ticket --ticket-id T-009-04 \
  --message "Read the references a recipe writes, not only the ones that resolved" \
  --include src/lib/step-labels.ts --include src/lib/step-refs.ts
```

---

## Step 2 — The wiring (commit 2)

### 2a. `scripts/normalise.mjs`

- Import `readStepRefs`, `refProblems`.
- After the step loop: `const stepRefProblems = refProblems(readStepRefs(cleaned), steps.map((s) => s.refs));`
- Return it, with a doc comment beside `stepLabelProblems`.
- **`cleaned`, not `source`** — the parser was handed the blanked copy, so the reader must
  read the same one.

### 2b. `scripts/check-recipes.mjs`

`problems.push(...recipe.stepRefProblems);` directly under the `stepLabelProblems` push
(line 162), with the comment from `structure.md` §4.

### 2c. `scripts/parse-recipes.mjs`

`...recipe.stepRefProblems,` into the throwing loop at lines 52-59.

**Verify, and this is the step that could go wrong:**

1. `node scripts/check-recipes.mjs` → `all 685 file(s) draw a table.`, exit 0. **If a single
   real recipe is now reported, the reader disagrees with the parser and step 1 is wrong —
   stop and fix the scan, do not add a skip.**
2. The guard message (`that is a bug in readStepRefs()`) must appear **zero** times across
   the whole collection.
3. `npm run verify` exits 0.
4. Hand-check the new failure on a throwaway file in the scratchpad — a step with `@&(99)` —
   and read the message out loud. It names the step, says the token became an ingredient, and
   gives both legal forms, or the wording gets fixed here rather than in review.

**Commit:**

```sh
lisa commit-ticket --ticket-id T-009-04 \
  --message "Refuse a reference that points at no step" \
  --include scripts/normalise.mjs --include scripts/check-recipes.mjs \
  --include scripts/parse-recipes.mjs
```

---

## Step 3 — The tests (commit 3)

`src/lib/step-refs.test.ts`, in two halves.

**Pure half** — `resolveRef`, `readStepRefs`. No parser, so it runs in Vite:

- the legal window and the null window, table-driven;
- two tokens in one step, in written order;
- a token on the second line of a multi-line step;
- a token inside a `--` comment: not counted;
- a token inside a `>> ` line: not counted;
- a file with no references: one empty array per step.

**Checker half** — `execFileSync` on `scripts/check-recipes.mjs`, temp-dir fixtures, the
harness copied from `step-labels.test.ts:255-295`. Seven fixtures, per `structure.md` §6.

Two of the seven — a reference at a prep step, absolute and relative — pass on the code as
it stood before this ticket. They are the acceptance criterion's *"if it already does, show
the test that proves it"*, and the test file says so in a comment naming `tree.ts:174-178`.

**Verify:**

1. `npx vitest run src/lib/step-refs.test.ts` — all pass.
2. **Each new-failure test is confirmed to fail without the fix**: `git stash` the three
   wiring files from step 2, re-run, watch the five out-of-range tests fail, restore. A test
   that passes with and without the code proves nothing.
3. `npm run verify` exits 0.

**Commit:**

```sh
lisa commit-ticket --ticket-id T-009-04 \
  --message "Cover the references that point at nothing, and the one already refused" \
  --include src/lib/step-refs.test.ts
```

---

## Step 4 — Proof and write-ups

1. `node scratchpad/dump-trees.mjs > scratchpad/after/trees.txt`
2. **`diff scratchpad/before/trees.txt scratchpad/after/trees.txt` — empty, or the ticket is
   not done.** 685 recipes, every node, every column, every row span. This is the primary
   evidence that a check on the parse path changed no page.
3. `git status --porcelain` — no ticket-owned file left staged, modified or untracked.
4. `npm run verify` one last time, whole output recorded in `progress.md`.
5. Write `naming-steps-proposal.md`: the count (33 absolute + 125 relative refs of distance
   ≥ 2 = the cases a handle would fix), what it would cost (a syntax addition, a codemod, a
   README rule, and a new class of error), and the honest conclusion that it is a legibility
   proposal rather than a safety one because the build already catches misdirection 30/30.
   **Not started** — no code, no syntax, no `.cook` edit.
6. Write `review.md` and `review-disposition.json`, then `lisa check-disposition T-009-04`.

---

## Testing strategy

| Claim | How it is tested | Where |
| --- | --- | --- |
| `resolveRef` window is right | unit, table-driven | `step-refs.test.ts` |
| tokens are read from steps only, not comments or metadata | unit | `step-refs.test.ts` |
| an out-of-range reference **fails the checker** | the checker, run for real, ×4 shapes | `step-refs.test.ts` |
| a reference at a prep step **fails the checker**, both forms | the checker, run for real, ×2 | `step-refs.test.ts` |
| the message names the file and the step | assert the path and `step N` in stdout | `step-refs.test.ts` |
| a healthy file still passes | the checker, run for real | `step-refs.test.ts` |
| the whole collection still parses | `npm run check` over 685 files | step 2 |
| **no page changed** | tree fingerprint diff, 685 files | step 4 |
| the tests would fail without the fix | stash-and-rerun | step 3 |

Unit tests cannot reach the WASM parser — it never runs inside Vite — so every "fails" claim
goes through the real checker. That is the same reasoning `step-labels.test.ts` and
`washing-up.test.ts` already record.

---

## What would make this stop

- **A real recipe reported by the new check.** Zero are expected (2,500 tokens, 0 orphans).
  One would mean the block scan and the parser disagree, and the scan gets fixed. It would
  never mean a skip list — `check-recipes.mjs:66-70` is explicit that there is no such thing
  in this project.
- **The tree diff is non-empty.** Then a check on the parse path changed a page, which it has
  no business doing. Stop and find out why before anything else.
- **`stepBlocks` changes `scanSteps` behaviour.** The existing `step-labels.test.ts`
  `stepLines` assertions catch it.

## Out of scope, restated

- No `.cook` file is edited. No conversion. `design.md` argues why.
- No `README.md` edit: no syntax changed, and the acceptance criteria gate README on that.
- Named steps are proposed, not started.
