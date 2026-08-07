# T-009-01 — Plan

Four commits, then the evidence. Each commit leaves `npm run verify` green, and every step below
names the command that says so.

> **Environment note carried from research §8.** A bare `npm run verify` in this working tree exits
> 1 on `src/lib/zz-aisle-dump.test.ts`, an untracked scratch probe belonging to T-007-05 that dies
> unless `DUMP_OUT` is set. Every verify in this plan is run as
> `DUMP_OUT=<scratch>/dump.txt npm run verify`, before and after alike, so the comparison is
> like-for-like. That file is never edited, deleted or committed here.

---

## Step 1 — the reader, and the half of its tests that needs nothing else

**Write** `src/lib/step-labels.ts` and the first half of `src/lib/step-labels.test.ts`
(structure §1, §5).

Order inside the file: patterns, `classify()`, `scanSteps()`, `readStepLabels()`.

**Tests** (pure, no parser, no filesystem — this is why the module is in `src/lib/`):

| What | Asserts |
| --- | --- |
| one label above a step | `labels` is `{1 → 'bake it hard'}`, the line is blanked to `--`, line count unchanged |
| two labels in one file | two different indices, both values intact |
| a label above a prep step | the index of the prose block, which the scan counts like any other |
| no label at all | `source` comes back **by reference** (`toBe`, not `toEqual`) and `labels.size` is 0 |
| a value with a colon in it | everything after the first colon is kept |
| seven problem cases | the line number in the message, and the words of the fix |
| scanner rules | comments transparent; blank / `>>` / `=` / `>` close a block; a multi-line step counts once |

**Verify:** `npx vitest run src/lib/step-labels.test.ts` — all green, and no other test file runs.

**Commit 1:** `lisa commit-ticket --ticket-id T-009-01 --message "Read the label that sits above
its step" --include src/lib/step-labels.ts --include src/lib/step-labels.test.ts`

---

## Step 2 — wire it into the build

**Modify** `scripts/normalise.mjs`, `scripts/parse-recipes.mjs`, `scripts/check-recipes.mjs`
(structure §2, §3, §4). One unit: until all three move, a bad file is read but never refused.

**Verify, in this order:**

1. `npm run check` over the whole collection → compare against the baseline in
   `verify-before.txt`. **Every one of the 664 files must produce the same line as before**, and
   the fast path is what guarantees it: no file has a `>> step:` line, so `readStepLabels()`
   returns before it scans anything.
2. A hand-written pair in a temp directory — the same recipe written both ways — through
   `node scripts/check-recipes.mjs --labels`: the two outputs must be byte-identical.
3. Each of the failure cases through the checker once by hand, to read the messages as a person
   would meet them, and to fix the wording before it is frozen into tests.
4. `DUMP_OUT=… npm run verify` → green.

**Commit 2:** `--include scripts/normalise.mjs --include scripts/parse-recipes.mjs --include
scripts/check-recipes.mjs`, message *"Bind the label to the step under it"*.

---

## Step 3 — the checker, run for real

**Write** the second half of `src/lib/step-labels.test.ts` (structure §5), following
`washing-up.test.ts:245-315`: fixtures into `fs.mkdtempSync(os.tmpdir())`, never into `recipes/`,
run through `execFileSync(process.execPath, ['scripts/check-recipes.mjs', …])`, assert on the exit
code and the printed text.

The parser must not be imported into vitest — `astro.config.mjs` says the WASM parser never runs
inside Vite, and `normalise.mjs` is the only thing that touches it. Every test that needs a real
parse goes through a child process. This is not a workaround; it is the same reason
`washing-up.test.ts` shells out.

The six cases the ticket names, plus the two it implies:

1. an inline label parses and wins over the derived label
2. two inline labels in one file both apply
3. an inline label on a prep step lands on the prose row
4. a dangling label fails — three flavours: end of file, blank line under it, another label under it
5. a file using both forms fails
6. a file using neither still draws its derived labels
7. **byte-identical**: a real recipe copied out of `recipes/`, written both ways, produces
   identical `--labels` output
8. the numbered form gets the prep-step case wrong on that same file — the recorded defect,
   asserted rather than described

**Verify:** `npx vitest run src/lib/step-labels.test.ts`, then the whole suite.
Watch the added wall-clock: each `execFileSync` is a full node start (~0.4 s measured in research).
Keep the child-process cases to the ones that genuinely need a parse; if the file adds more than
~6 s, cut case 7 down to one recipe instead of several.

**Commit 3:** `--include src/lib/step-labels.test.ts`, message *"Run the checker at both forms of
the same recipe"*.

---

## Step 4 — the authoring contract

**Modify** `README.md` rule 5 (structure §6). The inline form is the one to use; the numbered form
is the older one and still works. It is not called removed — T-009-03 does that.

**Verify:** re-read rule 5 whole. The example must be a real, buildable pair of lines, and the
sentence about binding must say what happens when it does not bind.

**Commit 4:** `--include README.md`, message *"Teach the label that sits above its step"*.

---

## Step 5 — the evidence, which is not committed

Written into the attempt's work directory, quoted in `review.md`:

- **`verify-after.txt`** — `DUMP_OUT=… npm run verify`, diffed against `verify-before.txt`. The
  ticket asks for identical output; expect the diff to be exactly the test counts (one new test
  file) and nothing else. Any other line in that diff is a defect, not a footnote.
- **The whole-collection sweep.** A scratch script rewrites all 643 numbered files into the inline
  form **in a temp directory**, runs `check-recipes.mjs --labels` over both trees, and diffs. Zero
  differences is the claim T-009-02 will have to make about the real migration; making it here on
  a copy is what says the two forms are the same thing. Recipes are never written back.
- **The prep-step case**, printed both ways from one real file, showing where the numbered form
  puts the label and where the inline form puts it.

## Step 6 — Review

`review.md` and `review-disposition.json`, then `lisa check-disposition T-009-01`. Before writing
either: `git status --porcelain` must show no ticket-owned file staged, modified or untracked —
only the other tickets' files that were already there when this attempt started.

---

## Testing strategy, stated once

- **Pure logic is unit-tested directly.** Every binding rule and every message lives in
  `readStepLabels()`, which takes a string and returns data. That is where the coverage is.
- **Behaviour that is only true of a whole run is tested by running it.** "Fails" versus "warns"
  is a property of an exit code; byte-identical rendering is a property of the pipeline. Both go
  through `check-recipes.mjs` in a child process.
- **The collection is the fixture for the claim that nothing moved.** 664 files through
  `npm run check` before and after, and the whole-collection sweep on a copy.
- **No new dependency, no config change, no snapshot file.** Vitest picks up
  `src/lib/step-labels.test.ts` because it picks up `src/lib/*.test.ts`.

## Risks, and what each one would look like

| Risk | Signal | Response |
| --- | --- | --- |
| the scanner disagrees with cooklang on a construct the collection does not use | the cross-check problem fires | it fails loudly and names itself as a bug; the file that provokes it becomes a test case |
| a wording change to the "no label" message breaks an existing test | red test naming `>> step.N:` | grep for that string first, and read the test rather than the diff |
| the `--labels` output is not stable enough for a byte comparison | a flaky test | it is a pure function of the parse, sorted by column; if it proves otherwise, compare `normalise()` output through a child process instead |
| another ticket's agent edits a file this one owns | `git status` shows an unexpected modification | do not commit it; record it in `review.md` |
