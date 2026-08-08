# T-009-04 — Structure: the shape of the check

Six files. One new module, one new test file, one small export, three wiring lines. No
`.cook` file is touched and no recipe changes.

## The files

| Path | Change | Why |
| --- | --- | --- |
| `src/lib/step-labels.ts` | **modify**, ~12 lines | Export the block scan so there is one, not two. |
| `src/lib/step-refs.ts` | **new**, ~110 lines | Reads the `@&(…)` tokens off the source and says which point at nothing. |
| `src/lib/step-refs.test.ts` | **new**, ~210 lines | The pure half directly; the failing half by running the checker. |
| `scripts/normalise.mjs` | **modify**, ~10 lines | Compute `stepRefProblems` next to `stepLabelProblems`. |
| `scripts/check-recipes.mjs` | **modify**, 2 lines | Print them under `FAIL <path>`. |
| `scripts/parse-recipes.mjs` | **modify**, 1 line | Throw on them during the build. |

Not touched: `src/lib/tree.ts` (its two refusals already do their half and are correct),
`README.md` (no syntax changed — see `design.md`), every `.cook` file.

## 1. `src/lib/step-labels.ts` — export the scan, do not copy it

`scanSteps(lines)` returns the line each block *starts* on. `step-refs.ts` needs the lines a
block *contains*, because a step can run over several lines and each may carry a reference.
Both are the same walk, so the walk moves out and `scanSteps` becomes a projection of it.

```ts
/**
 * The lines belonging to each step block, in order, as 0-based line indices. One scan, so
 * the reader that finds a step and the reader that finds its references cannot disagree.
 * A comment is transparent: it neither opens nor closes a block, and it is not part of one,
 * which is what keeps a reference inside a `--` line out of the count.
 */
export function stepBlocks(lines: string[]): number[][]

/** The line each step block starts on. */
export function scanSteps(lines: string[]): number[]   // = stepBlocks(lines).map((b) => b[0])
```

`classify()` is unchanged and stays private. `readStepLabels` is unchanged, including its
fast path — that fast path is exactly why its *output* cannot be reused and its *scan* must
be.

Behaviour change: none. `scanSteps` returns what it returned.

## 2. `src/lib/step-refs.ts` — new, pure

No parser, no filesystem. Three exports, each testable on its own.

```ts
/** `@&(~1)batter{}` and `@&(3)dough{}` — the token, not the ingredient after it. */
const REF = /@&\((~?\d+)\)/g;

/**
 * Where a reference token points, or null when it points at nothing.
 *
 * `3` is the third step, 1-based, prep steps included. `~2` is two steps back. Both land on
 * a 0-based index, and both have to land strictly BEFORE the step doing the referring: a
 * recipe is read downwards, and a step cannot consume itself or something not made yet.
 * Out of that window is null, and null is the whole point of this module.
 */
export function resolveRef(token: string, stepIndex: number): number | null

/** Every reference token written in each step block, in order, by step index. */
export function readStepRefs(source: string): string[][]

/**
 * What is wrong. `written` comes from readStepRefs(); `resolved` is what the parser made of
 * the same file, one array per step. Each problem names the step and the token.
 */
export function refProblems(written: string[][], resolved: number[][]): string[]
```

### `resolveRef`

```
token '3',  stepIndex 5  →  2        third step, 0-based
token '~2', stepIndex 5  →  3        two back
token '99', stepIndex 5  →  null     past the end of what can be referred to
token '0',  stepIndex 5  →  null     there is no step zero
token '~9', stepIndex 5  →  null     past the start of the file
token '6',  stepIndex 5  →  null     itself
token '7',  stepIndex 5  →  null     a step below it
```

The window is `0 <= target < stepIndex`. The upper bound is the referring step, not the step
count, which makes the self-reference and the forward reference fall out of the same rule
rather than needing two of their own. Measured against the parser in `probe2.mjs`: every one
of these returns an unresolved token, and cooklang turns each into an ingredient.

### `refProblems`

Two jobs, in order.

**The problems.** For each step, each token whose `resolveRef` is null:

```
step 4 writes @&(99), which points at no step, so cooklang read it as an ingredient
instead of a reference and the table would draw a row that is not an ingredient.
A reference names a step from the top (@&(3), counting prep steps) or counts back
from this one (@&(~1)); this recipe has 5 steps.
```

Three things it has to say, because the failure is invisible without all three: where it is,
that the token silently became an ingredient, and what the two legal forms are. The file is
added by the caller — both entry points already prefix `recipe.path`.

**The guard.** The count of non-null targets must equal `resolved[step].length`. If it does
not, the reader and the parser disagree and the message says so in those words:

```
step 4: this file's references were read as [2, 0] and the parser resolved 1 of them —
that is a bug in readStepRefs(), not in this file
```

Same shape and same reasoning as `normalise.mjs:215-220`, which already holds the label
pre-pass to the parser's step count. Measured to be quiet across all 685 files.

## 3. `scripts/normalise.mjs` — one computation, one field

After the step loop, before the return. Reads `cleaned` — the blanked source the parser was
actually handed — not `source`, so the two see the same file.

```js
const stepRefProblems = refProblems(
  readStepRefs(cleaned),
  steps.map((s) => s.refs),
);
```

Returned as `stepRefProblems`, sitting beside `stepLabelProblems` with a doc comment in the
same voice. Nothing else in the return changes.

Import added: `import { readStepRefs, refProblems } from '../src/lib/step-refs.ts';`

## 4. `scripts/check-recipes.mjs` — two lines

Directly under the `stepLabelProblems` push (line 162), which is where a reader looking for
"what else does this file refuse" will be:

```js
// A reference that points at no step. cooklang does not refuse one — it quietly reads it
// as an ingredient, so the table draws a row that is not an ingredient and says nothing.
problems.push(...recipe.stepRefProblems);
```

`problems` being non-empty prints `FAIL <rel>` with each reason under it and increments
`failed`, so the process exits 1. The file is named by the `FAIL` line.

## 5. `scripts/parse-recipes.mjs` — one line

Into the existing loop at lines 52-59, which throws `${recipe.path}: ${problem}`:

```js
for (const problem of [
  recipe.slackProblem,
  recipe.washingUpProblem,
  ...recipe.stepLabelProblems,
  ...recipe.stepRefProblems,        // ← added
]) {
```

So the build fails as well as the check, and both name the path.

## 6. `src/lib/step-refs.test.ts` — new

Two describes, copying `step-labels.test.ts` line for line in shape.

**`describe('resolveRef')` and `describe('readStepRefs')`** — pure, fast, no parser:

- the seven `resolveRef` rows above, as one table-driven test each for the legal and the null
  window;
- tokens read per step, in order, for a two-reference step;
- a reference on the second line of a multi-line step is found;
- a reference inside a `--` comment is **not** counted;
- a reference in a `>> ` metadata line is **not** counted;
- a file with no references gives one empty array per step.

**`describe('the checker, run for real')`** — temp dir, `execFileSync` on
`scripts/check-recipes.mjs`, exactly the harness at `step-labels.test.ts:255-295`. Fixtures
never go near `recipes/`, so the collection build never sees them.

| Fixture | Expect |
| --- | --- |
| healthy, `@&(~1)` and `@&(1)` both | code 0 |
| `@&(99)` past the end | code 1, output has the path, `step 4`, `@&(99)` |
| `@&(~9)` past the start | code 1 |
| `@&(0)` | code 1 |
| step 3 writing `@&(3)` — itself | code 1 |
| **`@&(1)` at a prep step** | code 1, output has `makes nothing` — *already works* |
| **`@&(~4)` at a prep step** | code 1, output has `makes nothing` — *already works* |

The last two are the acceptance criterion. They pass before this ticket's code is written;
they are here because "if it already does, show the test that proves it" and because nothing
currently stops `tree.ts:174-178` being deleted by accident.

## Ordering, and why

1. **`step-labels.ts` export + `step-refs.ts`.** A new module nothing imports yet. Green.
2. **The wiring** — `normalise.mjs`, `check-recipes.mjs`, `parse-recipes.mjs`. Green, because
   the collection has 0 dangling references out of 2,500.
3. **`step-refs.test.ts`.** Green.

Each step leaves `npm run verify` passing, so each is a commit that can stand alone. Step 2
before step 3 is deliberate: the checker tests cannot pass until the checker can fail.

## The proof that nothing moved

Before step 1 and after step 3, dump every recipe's tree fingerprint — `rows × cols`, leaf
order, and each op node's label, column, row, row span and child list — for all 685 files,
and diff. **Empty, or the ticket is not done.** This is T-009-02's instrument, and it is the
only thing that can show a check added to the parse path changed no page.

The dump script lives in the scratchpad, not in `scripts/`: it is this ticket's evidence,
not a tool the project needs afterwards, and `scripts/` is a documented surface in the README
table.
