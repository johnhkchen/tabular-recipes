# T-009-04 — Design: absolute references stay, and here is the check

## The decision

**The 33 absolute references stay. This ticket delivers the check instead of a migration,
and writes the naming proposal up without starting it.**

The ticket anticipated this outcome and asked for it to be argued rather than avoided:

> if the third group is most of them, the honest outcome of this ticket may be *absolute
> references stay, and here is the check that stops them being wrong* rather than a
> migration.

Two measurements decide it. The first is that **group 1 is empty** — there is no mechanical
case. The second is stronger and was not anticipated: **converting these 33 buys no
correctness at all, because the build already catches every one of them when a step is
inserted.** What it does not catch is something else entirely, and that is the real hole.

## Evidence 1 — there is nothing mechanical to convert

| Group | Count |
| --- | --- |
| 1 — could have been relative all along | **0** |
| 2 — reaches back past a branch (two chains merge) | 29 |
| 3 — reaches across branches (three chains merge) | 4 |

All 33 sit in a step that consumes at least one other reference. The absolute number always
names *the other branch*; `@&(~1)` names the one just finished. The ticket's own rule —
"Only the first group is a mechanical change" — leaves nothing to do mechanically.

## Evidence 2 — the ticket's stated failure is already caught, 30/30

The ticket's premise:

> wrong and silent the moment a step is inserted above it. Insert an operation at the top of
> a recipe and `@&(3)` now consumes a different step. The tree still merges, the table still
> draws, and it is drawing the wrong tree.

Tested directly (`insert2.mjs`, `insert3.mjs`): a prep step was prepended to each of the 30
files, shifting every `@&(N)` by one, and the tree was rebuilt.

```
shift1   {"caught":30}
shift2   {"caught":30}
shift3   {"caught":30}
```

**Every file fails the build. One inserted step, two, or three — 30 out of 30, every time.**
The messages:

```
 20  step N references step N, which makes nothing.
 10  step N is used by two later steps. A table is a tree, so a preparation can only
     flow into one place. Split the recipe or duplicate the step.
```

The premise is half right: the reference does go wrong. It is not silent. The reason is
structural rather than lucky — a table is a tree with **exactly one parent per node and
exactly one root**, and every one of these 33 is a cross-branch merge. Slide a
cross-branch reference by one and it either lands on a prep step (which makes nothing),
lands on a step already consumed by its real parent (two parents), or abandons a branch
(two roots). There is no room in a merge tree for it to be quietly right.

## Evidence 3 — the relative form is caught the same way, no better

Converting all 33 to `~N` and inserting a prep step *between* the target and the consumer —
the insertion `~N` is vulnerable to and `@&(N)` is immune to — gives:

```
B: converted to ~N, one prep step inserted mid-file
   {"caught":30}
   30  step N references step N, which makes nothing.
```

**30/30 caught, same as before.** Each form is immune to one insertion and fatal under the
other, and the tree invariants catch both. The migration would trade one silent-in-theory
failure for a different silent-in-theory failure, and neither is silent in practice.

For completeness, the conversion itself is provably safe — every one of the 30 files
produced a **byte-identical tree fingerprint** (rows × cols, leaf order, and every op node's
label, column, row span and child list) before and after:

```
conv     {"identical tree":30}
```

So the migration is available and risk-free. It is simply not worth doing: nothing
downstream can tell `~2` from `@&(3)` (`normalise.mjs` resolves both to the same integer),
and neither can a wrong one hide better than the other.

## Evidence 4 — the hole that is real

An `@&(…)` reference the parser **cannot resolve** does not error and does not warn. It
comes back with `relation.type === 'definition'` instead of `'reference'`, so the edge
branch at `normalise.mjs:170` never fires and the token falls through into the ingredient
list four lines below. **It becomes a row in the table.**

```cooklang
Bake @&(~1)batter{} with @&(99)glaze{} at 350°F.
```

```
warnings: []      tree: OK — 7 rows x 4 cols
leaves: eggs, milk, oil, flour, sugar, salt, glaze
```

`npm run check` prints `ok`. A reader gets a confident, plausible, incorrect page — with an
ingredient that is not an ingredient. This fires for `@&(0)`, `@&(99)`, `@&(~9)` past the
start, and a step referencing itself, in **both** reference forms. It is the same failure
class S-009 exists to close, and it is the one nothing catches.

## Options considered

**A. Convert all 33 to relative, plus the check.** Rejected. Evidence 2 and 3: no
correctness gained. It also costs legibility in the group-3 cases — `Fold @&(~1)spiced
flour{}, @&(~3)honey mixture{} into @&(~2)egg mixture{}` asks a reader to do three
subtractions where `@&(3)`/`@&(4)` are coordinates they can count to once from the top. And
it puts a 33-edit diff across 30 files in front of a reviewer for no measurable gain, which
is the kind of change that spends review budget without buying anything.

**B. Convert the 29 group-2 cases only, leave the 4 group-3.** Rejected, and worse than A:
it makes the collection use two conventions for one thing, decided by a rule
("two chains, not three") no author would infer from reading the files.

**C. Start named steps.** Rejected — the ticket forbids it explicitly, and Evidence 2 shows
the case for it is about reading, not about safety.

**D. Absolute references stay; deliver the check.** **Chosen.** It is the ticket's
smallest useful outcome, it is the only one that leaves the build able to say something it
cannot say today, and it is worth having on its own.

## What gets built

### 1. `src/lib/step-refs.ts` — new, pure

The information needed is destroyed by the parser: which `@&(…)` tokens were *written*. So
it is read off the source first, exactly as `src/lib/step-labels.ts` reads label positions
off the source first, and for the same reason.

```ts
/** Every @&(…) token written in each step block, in order, by step index. */
export function readStepRefs(source: string): string[][]

/** What is wrong when the parser resolved fewer references than were written. */
export function refProblems(written: string[][], resolved: number[][]): string[]
```

Pure — no parser, no filesystem — so both halves are unit-testable, which is the house rule
that `step-labels.ts`, `slack.ts` and `washing-up.ts` all follow.

The block scan is the piece that must not disagree with the parser. `step-labels.ts` already
owns that scan (`scanSteps`/`classify`), and `normalise.mjs:215-220` already exists purely
to hold the pre-pass to the parser's count. Writing a second scan would be the exact mistake
that comment is guarding against, so **`scanSteps` gets exported** and `step-refs.ts` uses
it. `readStepLabels`'s fast path returns `stepLines: []` for a file that writes no
`>> step:` line, so its *output* cannot be reused — its *scan* can, and must be.

Measured guard rail: the scan agreed with the parser's step count on all 685 files, and the
token count off the blanked source matched the raw file exactly (2,500 = 2,500).

### 2. Wiring — `scripts/normalise.mjs`

A new `stepRefProblems: string[]` on the returned recipe, alongside `stepLabelProblems`,
computed from `readStepRefs(cleaned)` and the resolved `steps[].refs`. The blanked source is
used, because that is what the parser was handed.

### 3. Surfacing — the two entry points, mirroring how `stepLabelProblems` is already handled

- `scripts/check-recipes.mjs:162` — push into `problems`, so it prints under `FAIL <path>`
  and exits non-zero.
- `scripts/parse-recipes.mjs:52-59` — add to the loop that throws `${recipe.path}: ${problem}`.

Both are already on the `npm run verify` path, so the build fails either way.

### 4. The message

It has to name the file and the step, and the file comes from the caller in both entry
points. So the message names the step and the token, and says what actually happened —
because "it became an ingredient" is the part nobody would guess:

```
step 4 writes @&(99), which points at no step — it was read as an ingredient called
"glaze" instead of a reference, so the table would draw a row that is not an ingredient.
A recipe has 3 steps, so the reference has to name one of them.
```

### 5. Tests — `src/lib/step-refs.test.ts`, new

Both halves, following `step-labels.test.ts` exactly:

- **Unit**, against the pure functions: tokens read per step; a token in a metadata line is
  not counted; a multi-line step keeps its tokens; a comment line is transparent.
- **The checker, run for real** — temp-dir fixtures, `execFileSync` on
  `scripts/check-recipes.mjs`, asserting exit code and output. This is the only way to reach
  the WASM parser, which never runs inside Vite, and "fails" is a property of a run:
  - `@&(99)` past the end → **fails**, names the file and the step (new).
  - `@&(~9)` past the start → **fails** (new).
  - `@&(0)` → **fails** (new).
  - a step referencing itself → **fails** (new).
  - **`@&(1)` pointing at a prep step → fails** — the acceptance criterion. This already
    works via `tree.ts:174-178`; the test is what proves it and what stops it regressing.
  - **`@&(~4)` pointing at a prep step → fails** — the same refusal, relative form.
  - a healthy recipe with both forms → **passes**, unchanged.

### 6. `docs/active/work/T-009-04/naming-steps-proposal.md`

Written, not started. Its honest conclusion has to carry Evidence 2: naming steps is a
**legibility** proposal, not a safety one, because the build already catches misdirected
references. That is a weaker case than the ticket assumed, and saying so is the point of
writing it down.

## Not changed, deliberately

**`README.md`.** The acceptance criteria permit it "if the syntax changed". No syntax
changed — `@&(N)` and `@&(~N)` mean exactly what they meant. Adding the new refusal to the
README's "things the build will refuse rather than draw wrong" list would be useful, and it
is flagged in `review.md` as a follow-up rather than smuggled in against an explicit scope
line.

**The 33 references, and every other `.cook` file.** No recipe is edited. The collection has
zero dangling references today (2,500 tokens, 0 orphans), so the check lands green.

## How this is verified

1. `npm run verify` passes — check, parse, 685 files, vitest, astro build.
2. The tree fingerprint of all 685 recipes is byte-identical before and after the change.
   Nothing about the tree, the table or the labels is touched; this proves it rather than
   asserting it, the way T-009-02 diffed its label dump.
3. The seven checker cases above, run for real against `scripts/check-recipes.mjs`.
