# T-009-04 — Research: the other counted reference

Descriptive. What exists, where, and what the 33 absolute references actually are. No fix
proposed here; that is `design.md`.

## 1. Where a reference lives, end to end

```
recipes/**/*.cook          @&(~1)batter{}  /  @&(3)dough{}   — the source of truth
  scripts/normalise.mjs    the only place the WASM parser is touched
    @cooklang/cooklang     resolves a reference token to a 0-based STEP INDEX
    src/lib/step-labels.ts pre-pass: reads >> step: positions off the source first
  → RawStep { index, rawLabel, labelOverride, ingredients, refs: number[], timers }
      src/lib/tree.ts      refs → parent/child edges; throws on the impossible ones
        src/lib/layout.ts  tree → grid
  scripts/check-recipes.mjs   one file at a time, prints FAIL <path> + reasons
  scripts/parse-recipes.mjs   whole collection, throws, writes src/generated/recipes.json
```

`npm run verify` = `check` → `recipes` → `vitest run` → `astro build`. Both `check` and
`recipes` see every reference, so a failure in either fails the deploy.

The parser hands `normalise` an ingredient carrying
`relation.relation.type === 'reference'` and `relation.reference_target === 'step'`; its
`references_to` is the resolved 0-based step index. `normalise` pushes that into `step.refs`
and drops the token from `step.ingredients` (`scripts/normalise.mjs:169-173`). **Both `~N`
and `N` arrive as the same resolved integer** — nothing downstream can tell which form the
author wrote. That is the single most important fact for this ticket: the tree, the table,
the labels, the schedule and the shopping list are all blind to the difference.

Step numbering is 1-based over **every** step, prep steps included (README rule 2). `~1` is
"one step back" counting the same way. Verified against `honey-cake.cook`: steps 1–2 are
`Grease`/`Preheat`, and `@&(3)` resolves to index 2 — the third block in the file.

## 2. The 33, read

Measured by parsing all 674 `.cook` files, lining each raw `@&(…)` token up with the
parser's resolved ref, and reading the tree each one lands in
(`classify.mjs` / `probe3.mjs`, scratchpad).

**33 absolute references, 31 lines, 30 files.** Distances: 25 at `~2`, 4 at `~3`, 4 at `~4`.

The ticket's three groups, against the data:

| Group | The ticket's words | Count |
| --- | --- | --- |
| 1 | could have been relative all along — mechanical | **0** |
| 2 | reaches back past a branch — two chains merging | **29** |
| 3 | reaches across branches — three chains merging at once | **4** |

**Group 1 is empty, and this is the finding that decides the ticket.** Not one of the 33
sits in a step with a single reference. Every one of the 33 is inside a step that also
consumes at least one *other* reference — 29 of them exactly `@&(~1)` plus this absolute
one, 4 of them (`honey-cake` ×2, `gingerbread-cake` ×2) inside a step merging three chains.
Every one has at least one intervening operation step, and **not one** intervening step is a
prep step. There is no case where the absolute number is a typo for the obvious `~1`.

The shape is the same sentence, 33 times:

```cooklang
Whisk @all-purpose flour{2%cup}, @baking soda{2%tsp}, …      ← step 3, branch A
Whisk @eggs{4%large}, @granulated sugar{1%cup}, …            ← step 4, branch B
Fold @&(~1)dry mixture{}, @grated carrots{3%cup} into @&(3)egg mixture{}.
```

`~1` names the branch you just finished; `@&(3)` names the other one. Both are correct.

**Group 2, 29 refs.** Two chains meet. The absolute number names the head of the chain that
is *not* the one the reader just walked. `~2` is what it would become. Present in the whole
`cakes-and-loaves` "wet + dry" family (17), and in ten Japanese/Mexican dishes where a
component is prepared, set aside, and merged back: `goma-ae`, `hambagu`, `omurice`,
`chahan`, `sunomono`, `buri-daikon`, `chikuzenni`, `kiriboshi-daikon`, `nanbanzuke`,
`takikomi-gohan`, `shogayaki`, `tinga-de-pollo`.

The longest reaches are all this shape too — `texas-sheet-cake`, `tres-leches-cake` and
`victoria-sponge` each merge a 4-deep baked-cake chain with a 1-deep topping chain, and
`marble-cake` / `sour-cream-coffee-cake` reach `~4` back past a 3-deep sibling.

**Group 3, 4 refs.** `honey-cake` step 6 and `gingerbread-cake` step 6 each merge **three**
chains in one sentence:

```cooklang
Fold @&(~1)spiced flour{}, @&(3)honey mixture{} into @&(4)egg mixture{}.
```

Two absolute numbers side by side, doing genuinely different work. `~3` and `~2` would be
correct and would read as arithmetic.

## 3. What the build catches today, measured not assumed

`src/lib/tree.ts:172-187` is the only place a reference can be refused, and it has exactly
two refusals:

- `step N references step M, which makes nothing.` — `ops.get(ref)` missed, i.e. the target
  step produced no column (a prep step, a full-width row).
- `step M is used by two later steps.` — a tree, not a graph.

Probed directly (`probe.mjs`, `probe3.mjs`):

| Written | Parser gives | Build says |
| --- | --- | --- |
| `@&(1)` at a prep step | ref → index 0 | **caught** — `step 5 references step 1, which makes nothing.` |
| `@&(~4)` at a prep step | ref → index 0 | **caught** — same message |
| `@&(9)`, past the end | **an ingredient named "9"'s label** | **nothing** |
| `@&(0)` | **an ingredient** | **nothing** |
| `@&(~9)`, past the start | **an ingredient** | **nothing** |
| `@&(3)` written in step 3 | **an ingredient** | **nothing** |

So: **the in-range wrong number is already caught, in both forms, and there is no test
anywhere in the repo that proves it** (`grep 'makes nothing' src/ scripts/` → one hit, the
throw itself). And **the out-of-range wrong number is not caught at all.**

### 3.1 The silent, plausible, incorrect page

This is the ticket's own stated failure mode, reproduced (`probe2.mjs`):

```cooklang
Whisk @flour{2%cup}, @sugar{1%cup}, @salt{1%tsp}.
Whisk @eggs{2}, @milk{1%cup}, @oil{1/2%cup}.
Fold @&(~1)wet{} into @&(1)dry{}.
Bake @&(~1)batter{} with @&(99)glaze{} at 350°F.
```

```
warnings: []
steps: #4{ing:[glaze],refs:[2]}
tree: OK — 7 rows x 4 cols
leaves: eggs, milk, oil, flour, sugar, salt, glaze
```

An unresolvable reference **does not error and does not warn — it degrades into an
ingredient.** `@&(99)glaze{}` became a leaf row called "glaze" with no quantity. The table
drew. `npm run check` would print `ok … 7 rows x 4 cols`. That is a confident, plausible,
incorrect page, and it is the exact class of failure S-009 exists to close.

The mechanism is in the parser, not in this repo: when a reference cannot be resolved,
`relation.type` comes back `definition` rather than `reference`, so the branch at
`normalise.mjs:170` that recognises an edge never fires and the token falls through to the
ingredient list four lines below.

### 3.2 The collection is clean of it today

Every `@&(…)` token in every step of all 674 files was counted against the refs the parser
resolved for that step: **2,464 tokens, 0 dangling.** No recipe currently carries this bug.
The check being built is a ratchet, not a repair.

## 4. Where a check like this would go

`src/lib/step-labels.ts` is the pattern to copy, and it is a close one:

- Pure — no parser, no filesystem — so it is directly unit-testable.
- Reads the source *before* the parser sees it, because it needs a fact the parser destroys.
- Returns `problems: string[]`, each naming its line.
- `normalise()` surfaces them as `stepLabelProblems` on the recipe.
- `check-recipes.mjs:162` pushes them into `problems` (prints under `FAIL <path>`).
- `parse-recipes.mjs:52-59` throws `${recipe.path}: ${problem}`.
- `step-labels.test.ts` tests the pure function directly **and** runs
  `scripts/check-recipes.mjs` for real over temp-dir fixtures, because "fails" is a property
  of a run, not of a return value. `washing-up.test.ts` does the same.

One trap: `readStepLabels()` takes a **fast path** and returns `stepLines: []` for any file
that writes no `>> step:` line at all (`step-labels.ts:188`). Most of the 674 do write one,
but the positions cannot be relied on for every file, so a new reader needs its own block
scan — or `scanSteps`/`classify` need exporting, which is the safer of the two given the
codebase's own stated anxiety about two scans disagreeing (`normalise.mjs:215-220` exists
purely to hold the pre-pass to the parser's count).

## 5. Constraints this ticket inherits

- **Nothing downstream can distinguish `~N` from `N`.** A conversion is invisible to the
  tree, the table, the labels, the schedule and the shopping list — which makes a
  before/after tree dump a real proof, and also means a conversion buys nothing downstream.
- **Neither form is safe against insertion.** `@&(3)` breaks on an insertion *above* the
  target; `~3` breaks on an insertion *between* the target and the consumer. Both fail
  silently unless they happen to land on a prep step or off the end. The reference form is
  not what makes the defect silent — the missing check is.
- **A conversion is not free of risk.** 33 hand-edits to 30 files, each of which must land
  on the same step index. The tree-dump proof T-009-02 built is the instrument that would
  hold it.
- **Naming steps is out of scope.** The ticket says so explicitly: write it up, do not start
  it (§3 of the ticket).
- **Modifiable paths.** `scripts/`, `src/`, converted `.cook` files, `README.md` if the
  syntax changed, `docs/active/work/T-009-04/**`. Nothing else.
- `npm run verify` must pass. Caps are enforced (`CAPS_FAIL_BUILD = true`), so any wording
  added to a `.cook` file is measured.

## 6. Open questions carried into Design

1. Group 1 is empty. The ticket's own framing says only group 1 is a mechanical change —
   so is there a migration to do at all?
2. Does converting 29 + 4 cross-branch references to `~2`/`~3`/`~4` make the collection more
   legible or less? `~4` past a 3-deep sibling chain is arithmetic; `@&(6)` is a coordinate.
3. The out-of-range hole is real and reproduced. It is the strongest available outcome. Does
   it belong in a new `src/lib/step-refs.ts`, or inside `step-labels.ts` alongside the scan
   it needs?
4. The in-range refusal already works and is untested. A test for it is owed either way.
