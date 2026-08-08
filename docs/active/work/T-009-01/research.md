# T-009-01 — Research

What exists, where it sits, and what the parser actually does. Every parser claim below was run
against `@cooklang/cooklang` 0.18.7 in this checkout, not read off the spec; the probes are in the
attempt scratchpad and their output is quoted verbatim.

## 1. The one road from a `.cook` file to a table

```
recipes/**/*.cook
      │
      ├─ scripts/parse-recipes.mjs ──┐
      │     (the build; throws)      ├─ scripts/normalise.mjs ─→ src/lib/tree.ts ─→ layout ─→ pages
      └─ scripts/check-recipes.mjs ──┘        (the only place the WASM parser is touched)
            (the checker; reports)
```

`scripts/normalise.mjs` is the single bridge. Its header says so and it is true: nothing else
constructs a `Parser`. It takes `(source, { slug, path, folder })` — **the raw source text is
already in hand**, which is what makes a pre-pass possible without changing any caller.

Two callers, two dispositions for the same fact:

- `parse-recipes.mjs:52-58` throws on `recipe.slackProblem` / `recipe.washingUpProblem`, so a
  half-declared field never reaches a page.
- `check-recipes.mjs:155-158` pushes the same strings onto `problems`, prints them under
  `FAIL <path>`, and exits 1.

That pair — *normalise reports a problem string, the build throws it, the checker prints it* — is
the established shape for "a line that is there but not whole". A third field would follow it.

## 2. Where `labelOverride` comes from, and everything it touches

One line makes it (`scripts/normalise.mjs:133`):

```js
const labelOverride = metadata[`step.${index + 1}`] ?? null;
```

`index` is the running count of **step blocks** the loop has emitted (`const index = steps.length`),
over every section's `content` entries of `type === 'step'`. Prose steps are step blocks, so they
are counted — that is the recorded defect, not an accident of this loop.

Everything that reads the field, in full (`grep labelOverride src scripts`, generated JSON aside):

| Site | What it does |
| --- | --- |
| `scripts/normalise.mjs:134` | `operationLabel = labelOverride ?? rawLabel`, handed to `readTimers()` so an unnamed timer is read from the override when there is one |
| `scripts/normalise.mjs:187` | stored on the step |
| `src/lib/tree.ts:36,144` | the type, and `step.labelOverride ?? cleanLabel(step.rawLabel)` — the cell's text |
| `scripts/check-recipes.mjs:92,98` | the operation-cell cap, and the "step body written but not shown" cap |
| `src/lib/schedule.test.ts:76` | a test fixture builder |

Nothing reads `metadata['step.N']` anywhere else, and `normalise.mjs:230` deletes every
`/^step\.\d+$/` key from `metadata` before the recipe is returned, so a `step.` key never reaches
`recipes.json`. **The field is the whole interface.** Anything that produces the same
`labelOverride` produces the same page, byte for byte — which is what the first acceptance
criterion is asking to be shown.

## 3. What the parser does with a `>> key: value` line in the body — measured

Probe 1 — the load-bearing fact, and it holds:

```
=== 1. inline step label above a step ===
meta: {"title":"Probe",…,"step":"rest it cold"}
  [0] s0:step:"Mix <ingredient> and <ingredient>."
  [1] s0:step:"Rest the <ingredient> in the <cookware>, <timer>."
```

The line is hoisted into `raw_metadata.map` and the two steps below it are untouched. Probe 2 —
two `>> step:` lines in one file collide in the map, last wins (`"step":"second"`), with both steps
still intact. So the AST carries the *value* and destroys the *position*, exactly as the ticket says.

Four more facts the ticket does not state, all of which change the design:

- **The AST has no spans.** A full dump of `parse_full(src, true)` (probe, §4 of the scratchpad)
  contains `raw_metadata`, `sections[].content[]`, `ingredients`, `cookware`, `timers`,
  `inline_quantities` — and no offset, line, or range anywhere. Steps carry a `number` (1-based
  within the section), not a position in the file. **Position cannot be recovered from the AST at
  all**; it has to be read off the source.
- **A metadata line *inside* a step block splits that block in two** (probe 3):
  `Mix @flour{1%cup}` / `>> step: middle` / `and @water{1%cup}` parses as **two** steps. Only a
  line that *starts* a block leaves the step count alone. An inline label written mid-sentence
  would therefore silently split a step and shift every step index below it.
- **An indented metadata line is not metadata** (probe 2b): `  >> step: indented` never reaches
  the map (`meta=null`) and its text is swallowed into the step below it. Cooklang wants `>>` at
  column 0; `>>step:` with no space is fine.
- **Replacing the line with `--` is invisible to the parser.** Both
  `shape(with the label line replaced by "--") === shape(without the line)` and
  `shape(with the line deleted) === shape(without the line)` came back `true` on a full
  `JSON.stringify` of the parse. A comment line neither opens nor closes a block, so blanking the
  line **in place** preserves every line number in the file while producing a byte-identical AST.

Also measured: `>> step: 350°F: hot, then 20 min` keeps everything after the first colon
(`"350°F: hot, then 20 min"`), and `>> step:` with nothing after it yields `""`, not absence.
`recipe.warnings` came back `[]` even for a dangling `@&(~9)` reference, so warnings are not a
channel this ticket can lean on.

## 4. Can the source be scanned for step blocks without reimplementing the parser?

Yes, and it was tested rather than argued. A ~25-line scanner — blank / `>>` metadata / `=`
section / `>` text closes a block, `--` comment is transparent, anything else opens one — was run
over the whole collection beside the real parser:

```
664 files, 0 mismatches, 141 ms total (0.21 ms/file incl. parse)
```

Two caveats on how much that proves:

- The collection exercises none of the interesting rules. `grep` over `recipes/**/*.cook` finds
  **0** indented `>>` lines, **0** `>` text blocks, **0** `=` section headers, **0** `--`
  comments, **0** `[- -]` block comments and **0** multi-line steps. Every file is a metadata
  header, a blank line, then one-line steps separated by blank lines. The 0-mismatch result says
  the scanner agrees on the shape the collection actually has; it does not say the scanner has
  been exercised on cooklang's whole grammar.
- Parsing is cheap enough that a per-label prefix parse would also have been affordable
  (0.21 ms/file). Cost is not what should decide between the two; **agreement with the parser** is,
  and that agreement can be *asserted* at runtime for free, because both counts are already in
  hand inside `normalise()`.

## 5. The collection as it stands today

```
664 .cook files
2,771  >> step.N:  lines in 643 files
    0  >> step:    lines            ← the key is free, as the ticket says
```

Metadata keys in use: `title` 664, `time` 664, `tags` 664, `servings` 664, `counters` 664,
`category` 664, `aka` 635, `pairs-with` 434, `slack` 395, `kit` 45, `dish` 45, `washing-up` 11,
`source` 1. Every one of them sits in the header block; **no file has a mid-body metadata line
today**, so the pre-pass starts from a collection where nothing can be disturbed.

(The ticket says 643 files / 658 total; the file count has since grown to 664 under S-007. The
`step.N` numbers — 2,771 uses, 643 files — are unchanged.)

## 6. The prose-step defect, counted

Running `normalise()` over the collection and marking every step with no ingredients and no refs:

```
664 files · 283 with a prose step · 131 where a prose step is not the first step
```

A worked case, `recipes/bars-and-brownies/espresso-brownies.cook`:

```
 1 PROSE  Butter and flour an 8x8-in pan.
 2 PROSE  Preheat the oven to 350°F (170°C).
 3 op     Melt .
 4 op     Mix with , , and .
 5 op     Mix with .
 6 op     Fold in , , , and to .
 7 op    [bake 350°F (170°C) 30 to 40 min] Bake at 350°F for 30 min.
```

The author had to write `>> step.7:` to label the **fifth** operation, and the file gives no hint
that 7 is the right number — the two prose rows are not in the table's column staircase at all.
This is the T-001-08 §5 entry in `docs/gaps/README.md` under *Recorded and not done*, in a real
file. 131 files carry the same trap, and two of the prose rows above cannot be labelled by an
author who counts what they see on the page.

## 7. How this codebase tests things like this

- Tests are `src/lib/*.test.ts`, run by bare `vitest run` (no vitest config; `npm test`).
- **Pure readers are unit-tested directly**: `src/lib/washing-up.ts` / `slack.ts` export a
  `read…(line) → { value, problem }` and their tests assert both halves, including the exact words
  of the problem string ("the fix is one word, so the message has to carry it").
- **Checker behaviour is tested by running the checker.** `washing-up.test.ts:245-315` writes a
  fixture into `fs.mkdtempSync(os.tmpdir())`, never into `recipes/`, runs
  `execFileSync(process.execPath, ['scripts/check-recipes.mjs', file])`, and asserts on the exit
  code and the printed text. That is the only honest way to test "fails" versus "warns", and it is
  the pattern this ticket's four failure cases want.
- **Collection-wide invariants are asserted over `src/generated/recipes.json`**, imported directly
  by the test file.
- `.mjs` scripts import `.ts` modules directly (`import { splitList } from '../src/lib/meta.ts'`)
  — Node 24.18.1 strips types natively. A pure helper for this work can live in `src/lib/*.ts`,
  be unit-tested by vitest, and be imported by `normalise.mjs` with no build step.

## 8. Baseline: what `npm run verify` does right now

```
all 664 file(s) draw a table.
Test Files  11 passed (11)
     Tests  868 passed (868)
09:37:53 [build] Complete!            exit 0
```

Saved to `verify-before.txt` beside this file, for the byte comparison the ticket asks for.

**One environmental snag, and it is not this ticket's:** `src/lib/zz-aisle-dump.test.ts` is an
untracked scratch probe belonging to T-007-05 (its own first line says *"TEMPORARY scratch probe
for T-007-05 — deleted before Implement finishes"*). It writes to `process.env.DUMP_OUT` and dies
with `TypeError: The "path" argument must be of type string` when that variable is unset, so a
bare `npm run verify` in this working tree exits 1 before this ticket touches anything. Setting
`DUMP_OUT` to a scratch path makes it pass, which is how the baseline above was taken. The file is
owned by another ticket: it must not be edited, deleted, or committed here, and both the before
and the after run have to be taken the same way for the comparison to mean anything.

## 9. Constraints this ticket inherits

- **No `.cook` file may be edited** (T-009-02 owns them) and `docs/knowledge/voice.md` is off
  limits (T-009-03). Writable: `scripts/`, `src/`, `README.md`.
- **The numbered form's semantics are frozen**, prose-step counting included. Two forms will
  coexist for two tickets.
- `README.md:153` is the one line in the authoring contract that teaches `step.N`; it sits inside
  rule 5, *"Cell labels are derived, and overridable"*.
- Other tickets are live in this working tree (T-007-05, T-008-02…05 tickets are untracked). Every
  commit must name exact paths through `lisa commit-ticket`.
- `src/lib/tree.ts`, `src/lib/time.ts` and the render read `labelOverride` and nothing else, so
  they have no reason to change.
