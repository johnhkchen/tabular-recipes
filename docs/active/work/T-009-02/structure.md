# T-009-02 — Structure

The shape of the code, not the code.

## Files

| Path | | Why |
| --- | --- | --- |
| `scripts/inline-step-labels.mjs` | **new**, ~230 lines | The codemod and its dump. The one new file under `scripts/` the criteria allow. |
| `recipes/**/*.cook` | modified, 643 files | The migration itself: 2,771 lines moved, nothing else. |
| `docs/active/work/T-009-02/**` | new | Artifacts and evidence. |

Nothing under `src/`, nothing else under `scripts/`, no `package.json` script entry — the ticket
does not ask for one and `npm run verify` must stay exactly what it is so its output is comparable
across the migration.

## `scripts/inline-step-labels.mjs`

### Invocations

```
node scripts/inline-step-labels.mjs                    # dry run: what would move, per file
node scripts/inline-step-labels.mjs --write            # move it
node scripts/inline-step-labels.mjs --dump             # the label + clock dump, to stdout
node scripts/inline-step-labels.mjs recipes/soups/*.cook   # a subset, any mode
```

Argument handling copies `check-recipes.mjs:118-125`: flags filtered out of `argv`, remaining
paths resolved to `{ full, slug, folder }`, and `findRecipes()` when none are named. That is what
makes a partial run possible and it is how the representative single-file diff in the evidence is
produced.

### Imports — the seam that matters

```js
import { normalise } from './normalise.mjs';          // which step wears which label
import { findRecipes } from './find-recipes.mjs';     // the collection, in build order
import { readStepLabels } from '../src/lib/step-labels.ts';  // where a label binds
import { cleanLabel } from '../src/lib/label.ts';     // the cell, as check-recipes renders it
```

Four imports, all of them the build's own code, none of them new. The script contributes no
opinion about which step is N and no opinion about where a `>> step:` line binds.

### Internal organisation

Six units, in dependency order.

**1. `NUMBERED` / `INLINE_ANY` — the two line patterns.**
`^>>[ \t]*step\.(\d+)[ \t]*:(.*)$` and `^>>[ \t]*step[. \t]`. The first is deliberately the same
shape as `src/lib/step-labels.ts:55` so the codemod and the mixed-form check agree about what a
numbered line is. The second is the broad "any step line at all" used by the
everything-else-unchanged comparison, and it is intentionally looser than either form.

**2. `stepStarts(lines) -> number[]` — the local scan, held in suspicion.**
The line each step block starts on. Mirrors `scanSteps()` in `src/lib/step-labels.ts:82` and says
so in a comment naming it, because the two have to agree and only one of them is the build's. Its
answer is never trusted: it is a *proposal*, checked in unit 5. Returns the starts in file order.

**3. `plan(source, recipe) -> { moves, refusal }` — what would change, and why not.**
Takes the file text and the `normalise()` result. Produces one `move` per numbered line:
`{ n, text, fromLine, toLine }`. Sets `refusal` to a sentence, and `moves` to empty, on any of the
six refusal conditions from `design.md`: N out of range, N < 1, duplicate N, empty label, a
numbered line below the first step, or a step whose start line the scan could not place. Pure —
takes text, returns a description. No filesystem, no writing.

**4. `apply(lines, moves) -> string[]` — the edit.**
Deletes the numbered lines and inserts `>> step: <text>` immediately above each target step's first
line. Implemented as a single rebuild of the line array rather than successive splices, so no index
arithmetic drifts as lines move: walk the source once, drop a line that is a move's source, emit
the label line before a line that is a move's target, emit everything else unchanged. Blank lines
pass through untouched by construction — the walk never looks at them and never emits one.

**5. `verify(source, migrated, recipe) -> string | null` — the three gates, before writing.**
Returns the reason to refuse, or null.

- *Binding.* `readStepLabels(migrated).labels` must equal the map of
  `{ step.index -> step.labelOverride }` taken from `recipe.steps`. Same keys, same values, same
  size. This is the criterion the whole design rests on: the build's own reader putting every
  label back on the step the build's own normaliser took it off.
- *Nothing else moved.* Strip every line matching `INLINE_ANY` from both texts; the remainders must
  be byte-identical. Catches a lost blank line, a lost trailing newline, a reordered metadata
  block, a mangled step.
- *Count.* As many `>> step:` lines out as `>> step.N:` lines in.

A file failing any gate is left on disk exactly as it was and printed with its reason.

**6. `dumpOf(recipe) -> string[]` — the proof's payload.**
One line per step of one recipe. Fields, tab-separated, in this order:

```
<slug>  <1-based step>  op|prose  <total min>  <hands-on min>  <unattended min>  <label>
```

- `op|prose` mirrors `isOpStep` in `src/lib/tree.ts` the way `check-recipes.mjs:86` does:
  a step with ingredients or refs is an operation.
- `label` is `step.labelOverride ?? cleanLabel(step.rawLabel)` — what the cell renders,
  `check-recipes.mjs:92`.
- the three minute figures come from `step.timers[]`, which `normalise()` has already annotated
  with `{ minutes, attention, source }` via `readTimers(timers, operationLabel)`. Total is the sum
  of the finite ones; hands-on is the sum of those whose `attention !== 'unattended'`; unattended
  is the rest. Same arithmetic as `src/lib/schedule.ts:153-158`, on the same numbers.
  A step with no timer is `0 0 0`, which is a value and not a blank.

Formatting is fixed and locale-free: minutes printed with `String(Math.round(m * 100) / 100)`, no
`toLocaleString`, no padding that depends on the widest row in the run. A dump of a subset is a
subsequence of a dump of everything, so a single-file dump can be pasted into evidence as-is.

### Output

Dry run and `--write` print one line per file:

```
  move   recipes/soups/new-england-clam-chowder.cook  6 label(s)
  --     recipes/soups/dashi.cook  no >> step.N: line
  SKIP   recipes/x/y.cook
         - >> step.9: names step 9 and the file has 7 steps — move it by hand, or fix the number
```

`--dump` prints only the dump, so it redirects cleanly.

The tail:

```
643 file(s) moved, 2771 label(s).  21 file(s) had none.  0 file(s) skipped.
dry run — pass --write to move them
```

and, when anything was skipped, the skipped list repeated at the end with slug and number, because
that list is what T-009-03 depends on and it should not have to be scraped out of 664 lines.

Exit code: 0 when nothing was skipped, 1 when something was. A migration that silently left files
behind is the failure mode the ticket is most worried about.

## Ordering of the work

The order is forced by the proof, not by preference:

1. Write the script. Dry-run it over the whole collection. Nothing on disk changes.
2. `--dump > before/labels-before.txt`. Also `npm run recipes` and keep
   `src/generated/recipes.json` as `before/recipes.json`, and
   `check-recipes.mjs --labels > before/check-labels.txt`.
3. Record the blank-line count and the `>> step` line counts.
4. `--write`.
5. `--dump > after/labels-after.txt`, rebuild `recipes.json`, re-run the checker.
6. `diff`, `cmp`, blank-line count, the filtered git diff, the one representative file diff.
7. `--write` a second time: no-op, `git status` unchanged. That is the idempotence evidence.
8. `npm run verify`.

Step 2 cannot move after step 4, which is the only hard constraint. `src/generated/recipes.json`
is generated and git-ignored; it is copied into the work directory rather than committed.

## Commits

Through `lisa commit-ticket`, exact paths, in this order:

1. `scripts/inline-step-labels.mjs` — the script, dry-run clean, nothing migrated yet.
2. `recipes/**/*.cook` — the migration, one commit, because it is one atomic act whose proof is
   collection-wide. 643 paths passed as `--include`.
3. `docs/active/work/T-009-02/**` — handled by Lisa on completion; the phase artifacts are written
   to the attempt directory.

## What this ticket deliberately does not do

- Does not touch `README.md` or `docs/knowledge/voice.md`. They teach `step.N`, and T-009-03 is
  the ticket that retires it; changing the documentation before the checker rejects the form would
  leave the docs describing a rule nothing enforces.
- Does not remove the numbered form from `src/lib/step-labels.ts` or `normalise.mjs`.
- Does not touch `@&(N)` — that is T-009-04.
- Does not correct a single label, however plainly wrong. The mismatch list is a list.
