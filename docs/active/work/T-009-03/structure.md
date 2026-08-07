# T-009-03 — Structure

Eight files modified, none created, none deleted. No `.cook` file changes.

| File | Change |
| --- | --- |
| `src/lib/step-labels.ts` | reject the numbered form; return `stepLines`; drop the both-forms check |
| `src/lib/step-labels.test.ts` | rewrite 4 tests, add 5 |
| `scripts/normalise.mjs` | remove the numbered reader and the key cleanup |
| `scripts/inline-step-labels.mjs` | resolve N without `normalise()`; delete the duplicate scan |
| `src/lib/tree.ts` | one doc comment |
| `src/lib/time.ts` | one comment |
| `src/lib/time.test.ts` | one comment |
| `scripts/check-recipes.mjs` | two comments |
| `README.md` | rule 5's closing sentences |
| `docs/knowledge/voice.md` | eight syntax sites, one added note |
| `docs/gaps/README.md` | one bullet out, one section in |

Ten source/doc files plus this work directory. Within the criteria's allow-list.

---

## 1. `src/lib/step-labels.ts` — the reader

The only file where behaviour changes.

### Interface

```ts
/** A `>> step.N:` line, which is no longer a form this project reads. */
export interface NumberedLabel {
  /** 0-based line index, so a message can say `line ${line + 1}`. */
  line: number;
  /** The N that was written. Not resolved to a step — nothing resolves it any more. */
  n: number;
  /** What was written after the colon, trimmed. Empty when the line says nothing. */
  text: string;
}

export interface StepLabels {
  source: string;                    // unchanged
  labels: Map<number, string>;       // unchanged
  /**
   * The line each step block starts on, in order. `stepLines.length` is the step count
   * normalise() holds the parser to; the positions are what the fixer inserts against.
   */
  stepLines: number[];               // replaces `stepCount: number`
  problems: string[];                // unchanged in type
  /**
   * Every `>> step.N:` line in the file. `problems` carries exactly one entry for each of
   * these, so `problems.length > numbered.length` means something else is also wrong.
   */
  numbered: NumberedLabel[];         // new
}
```

`stepCount` → `stepLines` is a rename with more information, not an addition beside it: two fields
that must agree is the shape this change is trying to remove elsewhere.

### Internal changes

1. **`NUMBERED`** (line 55) gains a text capture and a new docstring:
   `/^>>[ \t]*step\.(\d+)[ \t]*:(.*)$/i`. It is no longer *"matched only to catch a file that
   writes both forms"* — it is the rejection.

2. **A new `ANY_NUMBERED`** multiline probe beside `ANY_INLINE` (line 58), and the fast path at
   139 becomes:

   ```ts
   if (!ANY_INLINE.test(source) && !ANY_NUMBERED.test(source)) {
     return { source, labels: new Map(), stepLines: [], problems: [], numbered: [] };
   }
   ```

   A file with neither still returns its own `source` by reference and is never split. A file with
   only the numbered form now reaches the scan, which is the whole point.

3. **A message builder**, `numberedRefusal(hit: NumberedLabel): string`, module-private, so the
   wording sits next to the regex it belongs to:

   - with text: `` >> step.${n}: is the numbered form, and it is gone — the label goes on the line
     directly above the step it names. Write ">> step: ${text}" on the line above step ${n}, or run
     node scripts/inline-step-labels.mjs --write and it will move every one of them for you. ``
   - without text: same opening, then `` Write ">> step:" with the label after the colon on the
     line above step ${n}, or … ``

4. **The main loop** (line 155) gains a `NUMBERED` branch **before** the `INDENTED` and `INLINE`
   branches. `^>>` anchors all three, and `>> step.2:` cannot match `INLINE`'s `step[ \t]*:`, so
   the branches are already disjoint — the ordering is for reading, not for correctness. Each hit
   is pushed to `numbered` and to `found` via the existing `say(i, …)`, which is what puts the
   message in line order with everything else.

5. **The both-forms block** (lines 222–231) and the `firstInline` variable that exists only to
   serve it are deleted.

6. **`scanSteps()`** is unchanged. `stepOf` is still built from it; the return adds
   `stepLines: [...stepOf.keys()]` — already in ascending order, since `scanSteps` walks the file
   once forward.

### What does not change

`classify()`, `above()`, `below()`, `INLINE`, `INDENTED`, every inline-label problem message, and
the blanking rule. A numbered line is **not** blanked to `--`: it is left for cooklang to hoist as
it always did, harmlessly, because the file never reaches a page.

---

## 2. `scripts/normalise.mjs` — the reader's one consumer

Three edits, all deletions or near-deletions.

| Line | Now | After |
| --: | --- | --- |
| 111 | `const { source: cleaned, labels, stepCount, problems } = readStepLabels(source);` | `stepCount` → `stepLines` |
| 143–145 | `// Two ways in, one field out: …` + `labels.get(index) ?? metadata['step.'+(index+1)] ?? null` | `labels.get(index) ?? null`, comment rewritten to one way in |
| 214–218 | `if (labels.size && stepCount !== steps.length)` | `stepLines.length`; guard becomes `if (labels.size && …)` unchanged in meaning |
| 251–257 | `if (/^step\.\d+$/.test(key) \|\| PROMOTED.has(key)) delete metadata[key];` | `if (PROMOTED.has(key)) delete metadata[key];` |

The docstring at 104–110 loses its last sentence (*"A file that writes the older `>> step.N:` form
does not go near any of this"*) and gains one saying the numbered form is refused by the reader.

**Nothing else in the file moves.** `labelOverride` keeps its name, its type and its position in
the returned step, so `src/lib/tree.ts`, `check-recipes.mjs`, `parse-recipes.mjs` and the dump all
compile and behave identically for every file in the collection.

---

## 3. `scripts/inline-step-labels.mjs` — the fixer

The largest edit, and the one the ticket does not ask for. Justified in `design.md` §2.

**Deleted:** `stepStarts()` (lines 48–70, 23 lines with its comment) and the local `NUMBERED`
regex (lines 36–37). The `cleanLabel` and `normalise` imports stay — the dump uses both, and
`plan()` still needs `recipe.steps.length` as the parser's own count.

**`plan(source, recipe)` → `plan(reading, recipe)`**, taking the `readStepLabels()` return:

```
hits          ← reading.numbered                    (was: its own regex scan)
starts        ← reading.stepLines                   (was: stepStarts(lines))
```

The four per-hit refusals — says nothing / N out of range / N written twice / sits below the first
step — are kept verbatim; they are about the *number*, and the number is still written by a person.
The fifth (lines 129–142, *"the build gives step N a different label"*) is **deleted with its
comment**: the build no longer gives step N anything. Its replacement is `verify()` gate 1, which
already existed.

**`verify(source, migrated, reading, moves)`** — gate 1's expected map is rebuilt from what the run
intends rather than from `normalise()`:

```js
const wanted = new Map([...reading.labels, ...moves.map((m) => [m.n - 1, m.text])]);
```

Including `reading.labels` is what lets a mixed file migrate: the labels already inline must still
be there, on the same steps, afterwards. Gate 3 changes from an absolute count to a delta:

```js
const added = count(migrated, INLINE) - count(source, INLINE);
if (added !== moves.length) …
```

Gate 2 (nothing but step lines changed) and the leftover-numbered check are untouched.

**The run loop** replaces `if (recipe.stepLabelProblems.length)` with the reading-based test from
`design.md` §2, and calls `readStepLabels(source)` once, before `plan()`.

**The header comment** (lines 9–25) is rewritten. Its current claim — *"the script never counts.
normalise() says which step wears which label"* — becomes false with this change, and leaving it
would be the exact defect §2 of the ticket is about. The replacement states what actually holds it
up now, including that resolution and verification share one scan.

---

## 4. The four prose comments

| File:line | After |
| --- | --- |
| `src/lib/tree.ts:35` | `/** A `>> step:` line above the step wins over the derived label. */` |
| `src/lib/time.ts:152` | *"a label written on a `>> step:` line above the step may not contain them at all"* |
| `src/lib/time.test.ts:131` | *"A `>> step:` line can rewrite a step in words of its own"* |
| `scripts/check-recipes.mjs:46` | *"2782 steps carry a `>> step:` label, and the words they wrote instead …"* |
| `scripts/check-recipes.mjs:96` | *"A `>> step:` label replaces the step's own words wherever the step lands"* |

Five sites in four files; the ticket names four sites and `check-recipes.mjs` has two. Comments
only — no executable line in `tree.ts`, `time.ts` or `time.test.ts` changes, so those three files'
tests are unaffected by their own edit.

---

## 5. `README.md` — rule 5

Lines 163–165 today:

> A prep step is a step, so a full-width row can carry one too. An older form, `>> step.7:`, sets
> the same label by counting steps from the top of the file instead (prose rows included, which is
> easy to get wrong); it still works, and a file uses one form or the other, never both.

After: the first sentence stays; the rest is replaced by one sentence saying the numbered form was
removed and naming the fixer, so a reader with an old file in front of them knows what to run.
Rule 5's worked example and the binding rules above it are untouched.

---

## 6. `docs/knowledge/voice.md` — eight sites, nothing else

Every edit is `step.N` / `step.1` → `step`, in place, with the surrounding sentence re-read to make
sure it still parses. No number, no example, no table cell, no paragraph moves.

| Line | Was | Is |
| --: | --- | --- |
| 40 | `` `>> step.N:` `` | `` `>> step:` `` |
| 41 | `once `step.N:` is set` | `once a `>> step:` label is set` |
| 52 | `A `>> step.N:` line throws` | `A `>> step:` line throws` |
| 82 | `` **`>> step.1:` — 132 characters** `` | `` **`>> step:` — 132 characters** `` |
| 89 | `a `step.1:` was bolted on` | `a `>> step:` label was bolted on` |
| 97 | `` `>> step.1:`, which prints as the row `` | `` `>> step:`, which prints as the row `` |
| 137 | `` `>> step.N:` operation cell `` | `` `>> step:` operation cell `` |
| 138 | `once `step.N:` is set` | `once a `>> step:` label is set` |

Lines 41 and 138 need the small rewording shown because *"once `step:` is set"* reads as a
sentence about a variable; *"once a `>> step:` label is set"* says the same thing in the same
number of words.

**One paragraph is added**, after line 167 in *What changed, and when*, before the four bullets:
two sentences recording that S-009 moved the label onto the line above its step and that nothing
about what the label is for or what it costs changed with it. It goes **outside** the bulleted list
so the list's own preamble — *"Four passages have been corrected"* — stays true.

Untouched, and checked line by line in review: 54–55 (172,003 / 2782 / 637 / 278,833), 67–86 (the
472 / 250 / 132 worked example), 95–99 (the was/is table), 101–109 (the *what was built is better*
argument), 117–126 (the three house tests), 135–141 (the cap table), 146–158.

---

## 7. `docs/gaps/README.md`

The bullet at 260–261 leaves *Recorded and not done*. There is no closed section to move it to
(Research §8), so one is added at the end of the file:

```markdown
## Recorded and closed

### `>> step.N:` counts prose steps as well as operations

<the original wording, quoted, then: closed by removal, not repair — S-009, T-009-03. Why
removal was the fix, and Screen A's zero as the evidence it cost nothing.>

### `@&(~N)`, the relative back-reference, is left as it is

<2,401 uses, 373 at ~2 or deeper, the counts re-measured here. Why: relative references fail
loudly — a mis-pointed one usually stops the tree merging, which is a build error and not a
wrong page. S-009 chose the quiet failures.>
```

A new `##` section rather than a line struck through in place, because the existing section's job
is *"where the next pass looks for work"* and an entry that is done should not be in it at all. The
two entries are different in kind — one closed, one declined — and both are things the next pass
would otherwise rediscover, so they share a section and say which is which.

The seventh bullet's removal leaves six. The section preamble (*"Each is a rewrite of a dish rather
than an edit to a metadata line"*) becomes **more** accurate, since the `step.N` entry was the only
one it did not describe.

---

## 8. `src/lib/step-labels.test.ts`

Four rewrites, five additions, in the existing `describe` blocks.

**Rewritten**

| Line | Now asserts | Will assert |
| --: | --- | --- |
| 78 | a `>> step.2:` file returns no problems and its `source` by reference | a file with neither form returns its `source` by reference and no problems — the fast path, tested on what it is actually for |
| 149 | both forms → one "you wrote both" problem | both forms → one problem, and it is the numbered rejection |
| 282 | `mixed.cook` fails with `both >> step:` | `mixed.cook` fails with the numbered rejection |
| 316 | the two forms render identically | **deleted.** Its premise is that both forms work. Replaced by the checker-level rejection test below. |

**Added**, in a new `describe('the numbered form is refused', …)`:

1. **One numbered line, one problem**, naming the line, quoting the label back as `>> step: …`,
   naming `scripts/inline-step-labels.mjs`.
2. **The label is not resolved** — `labels` stays empty, so nothing binds by number.
3. **An empty numbered line** degrades to the no-text wording rather than quoting nothing.
4. **Four numbered lines give four problems, in line order**, interleaved with an inline problem.
5. **At the checker, for real** (in the existing `describe('the checker, run for real')`): a file
   with one `>> step.N:` line exits 1, prints `FAIL`, the corrected label, and the fixer's name.
   This is criterion *"tests cover: a `step.N` line fails the check"* met by running the check.

**Kept and expected to keep passing unchanged:** every inline binding test (23–76), every
non-binding refusal (89–147), the whole step-scan block (172–193), and the four checker tests at
235–265 — which are criterion *"the inline form still works everywhere"*.

`stepCount` → `stepLines.length` at lines 28 and 85.

---

## 9. Ordering

The reader and its consumers must move together — `stepCount` disappearing breaks `normalise.mjs`
at once — so §1, §2 and §8 are one commit. The fixer (§3) depends on `stepLines` and `numbered`
existing, so it follows. Comments and docs (§4–§7) depend on nothing and land last, in one commit
each for the code comments and the documentation.

1. reader + normalise + tests — `npm test` green
2. the fixer — a synthetic numbered file round-trips
3. the five prose comments — no behaviour
4. `README.md`, `voice.md`, `docs/gaps/README.md` — no behaviour
5. `npm run verify`, the dump, the diff against `before/`
