# T-009-03 — Research

What exists, where, and what holds it up. No proposals here.

## 1. The starting state, measured

`node scripts/inline-step-labels.mjs --dump` and `npm run verify` were both run before anything
was touched. Both are in this directory (`before/labels.txt`, `before/verify.txt`,
`before/recipes.json`).

| | |
| --- | --: |
| `.cook` files in the collection | 664 |
| lines matching `^>> *step\.` in `recipes/**` | **0** |
| steps in the label dump | 3,466 |
| `src/generated/recipes.json` | 3,956,883 bytes |
| `npm run verify` | exit 0 |

```
$ grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l
       0
```

**The hand-migration list T-009-02 hands over is empty.** Its `review.md` §"What T-009-03
inherits" says so in words — *"Every `step.N` in the collection is gone. The checker can be made
to reject `^>> step.N:` outright with no file needing a person first"* — and the grep above says
so independently. So the ticket's fork (*migrate by hand, or leave the form and say why*) resolves
to neither: there is nothing left to migrate, and the count is the evidence.

Node is not on the default PATH in this shell. `~/.nvm/versions/node/v24.18.1/bin` has it; every
command in these artifacts is run with that prepended.

## 2. Where `step.N` is still read

Exactly one place executes it.

**`scripts/normalise.mjs:145`**

```js
const labelOverride = labels.get(index) ?? metadata[`step.${index + 1}`] ?? null;
```

`labels` is the inline map from `readStepLabels()`; `metadata` is `recipe.raw_metadata.map`, where
cooklang hoists every `>> key: value` line in the file. That `??` is the whole numbered reader.

**`scripts/normalise.mjs:256`**

```js
if (/^step\.\d+$/.test(key) || PROMOTED.has(key)) delete metadata[key];
```

The cleanup the ticket names. Without it a `step.1` key survives into `recipe.metadata`, the bag of
loose metadata that reaches the page.

Nothing else reads the key. `src/` never sees it — `labelOverride` arrives already resolved.

## 3. Where `step.N` is matched but not read

**`src/lib/step-labels.ts:55`** — `const NUMBERED = /^>>[ \t]*step\.(\d+)[ \t]*:/i;`, used only at
lines 224–231 to report a file writing *both* forms. It does not resolve anything.

**`src/lib/step-labels.ts:138–141`** — the fast path:

```js
if (!ANY_INLINE.test(source)) {
  return { source, labels: new Map(), stepCount: 0, problems: [] };
}
```

A file that writes **only** the numbered form never gets scanned and never reports anything. This
is the single most important fact for anyone making the numbered form fail: today the reader is
structurally incapable of seeing such a file.

**`scripts/inline-step-labels.mjs:37`** — the fixer's own copy of the regex, with a capture for the
label text.

## 4. The fixer depends on the reader this ticket removes

`scripts/inline-step-labels.mjs` is the script the ticket wants the error message to name. It is
built on the numbered path in `normalise.mjs`:

- **`plan()` line 134–142** compares the text on the `>> step.N:` line against
  `recipe.steps[n - 1].labelOverride` — *"normalise() says which step wears which label"*, which is
  the script's stated safety property (header comment, lines 20–23).
- **`verify()` line 171–172** builds its expected set from `recipe.steps[…].labelOverride` too.
- **the run loop, line 280** skips any file with `recipe.stepLabelProblems`.

All three break the moment `normalise()` stops resolving `step.N`:

1. `labelOverride` is `null` for every numbered step, so `plan()` refuses every file with
   *"something else in this file is deciding the label"*.
2. If the numbered form is made to report a problem through `stepLabelProblems`, line 280 skips
   every file the script exists to fix, before `plan()` is even called.

**So the fixer stops working as a side effect of §2, and the checker's message would point at a
script that refuses every file.** This is the one non-obvious coupling in the ticket.

The script also carries `stepStarts()` (lines 55–70), a hand copy of `scanSteps()` in
`src/lib/step-labels.ts:82`. T-009-02's review flags the duplication as open concern #3:
*"two copies of one rule … nothing makes them agree tomorrow except that a divergence is loud."*
`scanSteps()` computes the same line positions internally but returns only `stepCount`, not the
positions.

## 5. How a problem becomes a failure

`readStepLabels().problems` → `normalise()` line 213 folds them into `stepLabelProblems` → two
consumers:

- **`scripts/check-recipes.mjs:162`** — `problems.push(...recipe.stepLabelProblems)`, and a
  non-empty `problems` prints `FAIL` and increments `failed`, which sets exit 1 (line 283).
- **`scripts/parse-recipes.mjs:56–58`** — throws, so `npm run recipes` and therefore the build
  stop too.

**A message routed through `stepLabelProblems` fails the checker *and* the build, and it is
reachable from a vitest unit test on the pure function.** That matters because the ticket asks for
both "the check fails" and "tests cover it", and vitest cannot reach the WASM parser directly —
`step-labels.test.ts:201` shells out to `check-recipes.mjs` for exactly that reason.

Message style in this file is a full sentence naming the line, e.g.
`line 8: >> step: "rest it cold" has a blank line under it — the label binds to the step on the
very next line, so close the gap`. The prefix `line N: ` is added centrally at line 239.

## 6. The nine documentation sites, verified line by line

| File | Line | Text |
| --- | --: | --- |
| `README.md` | 163–165 | rule 5's closing sentences: *"An older form, `>> step.7:`, sets the same label by counting steps from the top of the file instead … it still works, and a file uses one form or the other, never both."* |
| `docs/knowledge/voice.md` | 40 | register table, row 1: `` `>> step.N:` `` → the operation cell |
| " | 41 | register table, row 2: *"**nowhere**, once `step.N:` is set"* |
| " | 52 | *"**A `>> step.N:` line throws your paragraph away.**"* |
| " | 82 | *"**`>> step.1:` — 132 characters, and this was the one that printed:**"* |
| " | 89 | *"a `step.1:` was bolted on to rescue the table"* |
| " | 97 | was/is table: *"`>> step.1:`, which prints as the row \| 132 \| …(55)"* |
| " | 137 | length table: `` `>> step.N:` operation cell `` \| 70 |
| " | 138 | length table: *"the step's own words, once `step.N:` is set"* \| 150 |

That is **eight** occurrences in voice.md, not the seven the ticket quotes; lines 40 and 41 are two
rows of one table and are plausibly counted as one place. Nothing is missing — this is the full set
from `grep -n 'step\.[N0-9]' docs/knowledge/voice.md`.

**README rule 5 already teaches the inline form first** (T-009-01 added the worked
`>> step: bake 350°F (170°C) 30 to 40 min` block at line 155). Only the trailing "older form"
sentences are left.

**`scripts/check-recipes.mjs`'s error message already offers the inline form.** The ticket's table
says it *"offers `>> step.N:` as the fix"*; line 205–206 in fact reads *"reword the step, or name it
with a `>> step:` line directly above it"*. T-009-01 fixed it. What remain in that file are two
**comments**: line 46 (*"2782 steps carry a `>> step.N:` line"*) and line 96 (*"A `>> step.N:` line
replaces the step's own words"*) — which is exactly what §2 of the ticket lists under
"comments that outlive the syntax", so the two statements are consistent once you read them as
comment sites rather than message sites.

The other three comment sites, confirmed:

- `src/lib/tree.ts:35` — `/** A `>> step.N: …` line in the recipe wins over the derived label. */`
- `src/lib/time.ts:152` — *"a label rewritten by a `>> step.N:` line may not contain them at all"*
- `src/lib/time.test.ts:131` — *"A `>> step.N:` line can rewrite a step in words of its own"*

`src/lib/step-labels.ts:9` also names the older form, in a paragraph explaining *why* the inline
form exists. That is history, not instruction, and the ticket does not list it.

## 7. What voice.md's argument actually is

The ticket's stated failure mode is losing the argument to find-and-replace, so it is worth writing
down what has to survive, exactly:

1. **Line 52–58.** The override *throws the paragraph away* — not shortens. **172,003 characters
   nobody has ever read**, over **2782 steps in 637 recipes**, down from **278,833** before S-005.
2. **Lines 64–91.** The tonkotsu worked example: **472** characters of paragraph, **250** of
   `slack:`, **132** printed; the mechanism narrative ("the paragraph came first; when it would not
   fit the cell, a label was bolted on to rescue the table").
3. **Lines 95–99.** The was/is table: 132 → 55, 250 → 115, 472 → 72.
4. **Lines 135–141.** The length table: 70 / 150 / 120 / 200 / 80, and the aims beside them.
5. **Lines 146–158.** 3077 operation cells, mean 24; 304 slack reasons over, now `p50 111 · max
   151`, 78 above the aim.

Every number above is a **count of steps or characters**, none of them a step *index*. The rename
touches only the label `>> step.N:` → `>> step:`. Nothing in the argument depends on the number
existing.

One trap: line 82's `>> step.1:` and line 97's `>> step.1:` name step **1** of a real file,
`recipes/soups/tonkotsu-broth-instant-pot.cook`. Line 105 then says *"the label on step 5 says boil
hard, lid off, 20 min"* — prose about which step, not syntax. A find-and-replace tuned to `step.N`
misses both `step.1` sites; one tuned to `step\.\d` hits them correctly and leaves line 105 alone.

## 8. The recorded defect, and the decision to record beside it

`docs/gaps/README.md` is 261 lines, seven `##` sections, ending at **`## Recorded and not done`**
(line 244). Its preamble: *"Carried forward from the sixteen writer tickets so it is not lost. Each
is a rewrite of a dish rather than an edit to a metadata line, which is why none of it happened
here."* Seven bullets; the `step.N` one is the last, lines 260–261, and it is the only entry in the
list that is not a recipe rewrite.

There is **no existing "closed" or "done" section** anywhere in the file to move it into. Whatever
happens to that bullet has to invent its home.

The `@&(~N)` decision the ticket asks to record is stated in the story
(`S-009 …#What is in scope`): 2,401 uses, 373 of them `~2` or deeper, left alone because a
mis-pointed relative reference usually stops the tree merging, which is a build error rather than a
wrong page. Confirmed against the collection:

```
$ grep -roh '@&(~[0-9]*)' recipes --include='*.cook' | wc -l    # 2401
$ grep -roh '@&(~[2-9][0-9]*)' recipes --include='*.cook' | wc -l # 373
```

## 9. Tests that the change will break

`src/lib/step-labels.test.ts`, 362 lines, four `describe` blocks. Three tests assert behaviour that
the ticket removes:

| Line | Test | Why it breaks |
| --: | --- | --- |
| 78 | *"hands back the source untouched when the file never writes one"* — feeds `>> step.2:` and asserts `problems` is `[]` and `source` is returned **by reference** | A numbered line must now be a problem. |
| 149 | *"refuses a file that writes both forms, naming a line of each"* | "Both forms" stops being a concept once one form is illegal. |
| 282 | checker-level twin of the above, on `mixed.cook` | Same. |
| 316 | *"renders one real recipe identically written either way"* — builds a `>> step.N:` variant of `new-england-clam-chowder.cook` and asserts the checker's output is byte-identical to the inline variant | This is T-009-01's equivalence proof. Its premise is that both forms work; after this ticket the numbered variant must **fail**. |

Line 28 and line 85 read `stepCount` off the return value, so any change to that field's name or
meaning lands there too.

935 tests in 12 files pass today (`before/verify.txt`).

## 10. Constraints

- **Ownership.** The acceptance criteria allow `scripts/`, `src/`, `README.md`,
  `docs/knowledge/voice.md`, `docs/gaps/README.md`, hand-migrated `.cook` files and this work
  directory. **`docs/gaps/voice.md` is not on the list** and names `step.N` five times (lines 191,
  194, 201, 213, 215) — it is a dated measurement page, and it stays as written.
- **No `.cook` file needs to change**, so `recipes/**` should end the ticket untouched. That is
  also how criterion 8 ("every operation label unchanged, same dump") is met most cheaply: if no
  recipe changes, the dump cannot.
- **`npm run verify`** is `check && recipes && vitest run && astro build`. A step-label problem
  fails the first two of the four.
- Commits go through `lisa commit-ticket --include <exact paths>`; nothing may be left staged or
  untracked.
