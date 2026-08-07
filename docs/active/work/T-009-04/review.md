# T-009-04 — Review

**Outcome: the 33 absolute references stay, and the build gained the check that stops a
reference being silently wrong.** No `.cook` file was edited. `npm run verify` passes:
685 files draw a table, 1,028 tests, 710 pages built.

The ticket allowed for this outcome and asked that it be argued. It is, in `design.md`, on
two measurements — one expected, one not.

## What changed

| File | Change | Lines |
| --- | --- | --- |
| `src/lib/step-refs.ts` | **new** | 118 |
| `src/lib/step-refs.test.ts` | **new** | 253 |
| `src/lib/step-labels.ts` | `scanSteps` split into an exported `stepBlocks` | +18/−12 |
| `scripts/normalise.mjs` | computes and returns `stepRefProblems` | +16 |
| `scripts/check-recipes.mjs` | prints them under `FAIL <path>` | +6 |
| `scripts/parse-recipes.mjs` | throws on them during the build | +1 |

Three commits: `b6b425c` the reader, `beb829d` the wiring, `9250234` the tests.

Not changed: every `.cook` file, `src/lib/tree.ts`, `README.md`.

## The finding that decided it

The ticket's premise was that an absolute reference goes *"wrong and silent the moment a
step is inserted above it."* Half of that is true and half is not, and it is worth stating
plainly because it is the reason there is no migration here.

**Group 1 — the mechanical cases — is empty. 0 of 33.** All 33 sit in a step that consumes
at least one other reference: 29 merge two chains, 4 merge three. The absolute number always
names the branch that is *not* the one just walked. The ticket's own rule is that only group
1 is a mechanical change, so there was nothing mechanical to do.

**And the failure is not silent.** A prep step was prepended to each of the 30 files, shifting
every `@&(N)` by one — the exact edit the ticket names — and the tree rebuilt:

```
shift1 {"caught":30}   shift2 {"caught":30}   shift3 {"caught":30}
```

30 out of 30 fail the build, every time. 20 via `references step N, which makes nothing`, 10
via `is used by two later steps`. The reason is structural rather than lucky: a table is a
tree with one parent per node and one root, and a cross-branch reference that slides by one
has nowhere quiet to land. Converting to `~N` and inserting a step mid-file gives the same
30/30. Each form is immune to one insertion and fatal under the other, and both are caught.

For completeness, the conversion *was* built and measured: all 30 files produced a
byte-identical tree fingerprint under it. It is available and risk-free. It simply buys
nothing, and it would put a 33-edit diff across 30 files in front of a reviewer for no gain.

## The hole that was real

An `@&(…)` reference the parser **cannot resolve** is not refused — cooklang returns it with
relation `definition` instead of `reference`, the edge branch in `normalise.mjs` never fires,
and the token falls into the ingredient list four lines below. **It becomes a row in the
table.**

```cooklang
Bake @&(~1)batter{} with @&(99)glaze{} at 350°F.
```

Before this ticket: `warnings: []`, `tree: OK — 7 rows x 4 cols`, leaves
`… flour, sugar, salt, glaze`. `npm run check` printed `ok`. That is a confident, plausible,
incorrect page with an ingredient that is not an ingredient — the same failure class the
`>> step.N:` label had, in the one other place this format counts steps by hand.

It fires for `@&(0)`, `@&(99)`, `@&(~9)` past the start, and a step referencing itself, in
both reference forms. It is now an error naming the file, the step and the token.

## Acceptance criteria, against evidence

| Criterion | Status |
| --- | --- |
| All 33 read and classified into three groups, by slug, with counts | ✅ `research.md` §2 — 0 / 29 / 4, every one listed with its step, target, distance and branch shape |
| One of the two outcomes, argued | ✅ **absolute references stay**, argued in `design.md` on four measurements |
| `check-recipes.mjs` fails on a reference to a step that produces nothing, naming file and step | ✅ It already did (`tree.ts:174-178`) and **had no test**. Two tests now prove it, absolute and relative. The build additionally gained the case it did *not* catch |
| Tests cover the outcome, including a reference at a prep step | ✅ 23 tests; the prep-step case in both forms |
| Naming written up as a proposal, not started | ✅ `naming-steps-proposal.md` — 158 references worth migrating, the cost in five parts, **no code, no syntax, no `.cook` edit** |
| `npm run verify` passes | ✅ exit 0 |
| Only `scripts/`, `src/`, `.cook`, `README.md` if syntax changed, `docs/…/T-009-04/**` | ✅ `scripts/` ×3, `src/` ×3, no `.cook`, no `README.md` |

## Test coverage

23 new tests in `src/lib/step-refs.test.ts`; suite 1,005 → 1,028.

- **Pure**, 15 tests: `resolveRef`'s window including all six out-of-window shapes;
  `readStepRefs` order, multi-line steps, and tokens in comments and metadata lines *not*
  counted; `refProblems`' wording rules and its parser-disagreement guard.
- **The checker, run for real**, 8 fixtures via `execFileSync` — the only way to reach the
  WASM parser, which never runs inside Vite. Four new-failure shapes, two prep-step shapes,
  one healthy file, and the whole 685-file collection.

**The new tests were confirmed to fail without the fix.** With the wiring line commented out,
exactly the four out-of-range tests fail and the two prep-step tests still pass — which is
the evidence for both halves of the criterion at once. Restored and re-verified.

## The proof that nothing moved

Every recipe's tree was dumped before and after — grid shape, leaf order with row numbers,
full-width rows, root, and every op node's step, column, row, row span, label and child list:

```
$ diff before/trees.txt after/trees.txt   # 685 recipes, 7,980 lines
$ echo $?
0
```

**Byte-identical.** A check added to the parse path changed no page. Same instrument
T-009-02 used for its label dump.

Also measured on the live collection: **2,500 reference tokens across 685 files, 0 dangling**,
and the block scan agreed with the parser's step count on every file — the guard message
`bug in readStepRefs()` fires zero times. The check landed green; it is a ratchet, not a
repair.

## Open concerns

1. **`README.md` was not updated, deliberately.** The acceptance criteria permit editing it
   *"if the syntax changed"*, and no syntax changed. But the README's list of *"things a table
   cannot show, and which the build will refuse rather than draw wrong"* now has a third
   member that is not written down, and an author who hits it will read the error message
   rather than the docs. **Recommend a one-line follow-up** adding the bullet. Not taken here
   against an explicit scope line.

2. **The `refProblems` guard is untested against a real disagreement.** It is unit-tested
   with hand-built input, and it is silent across all 685 files, but no cooklang construct is
   known that would trigger it. That is the same position `normalise.mjs:215-220` has been in
   since T-009-03, and it is the honest one: the guard exists precisely because the failure
   is unknown.

3. **`stepBlocks` is now a shared surface.** Two readers depend on one scan, which is the
   point, but it means a future change to what counts as a step block moves both the labels
   and the references at once. The existing `step-labels.test.ts` `stepLines` assertions pin
   the label half; the new `readStepRefs` tests pin the other.

4. **The naming proposal came out weaker than the ticket expected.** Because misdirected
   references are caught 30/30, named steps are a legibility improvement, not a safety one.
   The proposal says so and recommends scoping any future story that way. A reviewer who
   expected naming to be the answer to fragility should read that section — it is the main
   thing that changed.

5. **The insertion experiment covers the 30 files that carry an absolute reference**, under
   one, two and three inserted prep steps. It is not a proof about every conceivable edit to
   every one of the 685 files. The structural argument — one parent, one root, every case a
   cross-branch merge — is what generalises it, and it is stated rather than assumed.

## Nothing left in the working tree

No ticket-owned file staged, modified or untracked. `docs/.obsidian/` is untracked and
predates this ticket.
