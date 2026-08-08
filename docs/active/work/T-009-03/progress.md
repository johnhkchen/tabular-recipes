# T-009-03 — Progress

All five steps done, four commits, `npm run verify` exit 0. Every claim below is the command and
its output.

`node` is not on this shell's default PATH; every command was run with
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` first.

---

## Step 0 — baseline

Taken on the tree as T-009-02 left it, before any edit.

```
$ node scripts/inline-step-labels.mjs --dump > before/labels.txt
$ wc -l before/labels.txt
    3466
$ cp src/generated/recipes.json before/recipes.json     # 3,956,883 bytes
$ npm run verify > before/verify.txt ; echo $?
0
```

`before/verify.txt`: `all 664 file(s) draw a table.` · 664 parsed · **935 tests in 12 files** ·
688 pages built.

**Deviation from plan, noted rather than corrected:** other tickets committed to this branch while
this one ran. `git diff --stat 9aa31a2..HEAD` at the time of Step 1 showed T-008-02 and T-010-02
landing `src/components/dials.{ts,test.ts}`, `src/pages/index.astro`, `src/styles/site.css`,
`src/data/counters.json`, `docs/knowledge/counters.md` and `docs/gaps/air-fryer-and-pot.md`.
**None of them touches `recipes/`, `scripts/`, or the label path in `src/lib/`.** The visible
effect here is the test count: 935 in 12 files at baseline, 980 in 13 files after — a delta of 45,
of which **38 are `src/components/dials.test.ts`, not this ticket's**, and **7 are**. The label
dump and `recipes.json` are unaffected, which §5 shows by measurement rather than by argument.

---

## Step 1 — the reader refuses the numbered form

Commit `f38cb8d` — `src/lib/step-labels.ts`, `src/lib/step-labels.test.ts`, `scripts/normalise.mjs`.

**`src/lib/step-labels.ts`**

- `NUMBERED` gained a text capture and stopped being *"matched only to catch a file that writes
  both forms"*.
- `ANY_NUMBERED` added, and the fast path widened. This is the load-bearing line: a file writing
  **only** the numbered form used to return at line 139 unscanned, so nothing downstream could
  ever have seen it. A form nobody looks for is a form nobody can reject.
- `numberedRefusal()` builds the message; the main loop emits one per numbered line, before any
  binding is attempted.
- `stepCount: number` → `stepLines: number[]`, and `numbered: NumberedLabel[]` added.
- The both-forms block and the `firstInline` variable it needed were deleted. There is one form
  now, so being told twice about one line would be the second thing wrong with it.

**`scripts/normalise.mjs`** — the two things the ticket names, and nothing else:

```diff
-      const labelOverride = labels.get(index) ?? metadata[`step.${index + 1}`] ?? null;
+      const labelOverride = labels.get(index) ?? null;

-    if (/^step\.\d+$/.test(key) || PROMOTED.has(key)) delete metadata[key];
+    if (PROMOTED.has(key)) delete metadata[key];
```

plus `stepCount` → `stepLines.length` at the pre-pass count check, and the two comments that
described a two-forms world.

**The message, run for real.** A copy of `new-england-clam-chowder.cook` outside `recipes/`, with
its inline labels stripped and one numbered label put back:

```
$ node scripts/check-recipes.mjs demo.cook
FAIL   demo.cook
       - line 2: >> step.2: is the numbered form, and it is gone — the label goes on the line
         directly above the step it names. Write ">> step: sweat them soft, 8 min" on the line
         above step 2, or run node scripts/inline-step-labels.mjs --write and it will move every
         one of them for you.

1 of 1 file(s) would not draw a table.
$ echo $?
1
```

(One line in the terminal; wrapped here to fit the page.) It shows the author's own label
rewritten so it can be copied out, and it names the fixer with `--write` — not the bare command,
which is a dry run.

**Tests** — `npx vitest run src/lib/step-labels.test.ts` → 34 passed, from 27. Eleven were touched
— seven new, four rewritten — and the other 23 are the inline form's existing coverage, unchanged
and passing.

---

## Step 2 — the fixer stands on its own

Commit `a3596e9` — `scripts/inline-step-labels.mjs`.

**Why this was necessary and is not scope creep.** The fixer resolved N through
`recipe.steps[n - 1].labelOverride`, which is the reader Step 1 removes. Left alone it would have
refused every file it exists to repair — while being named, by this ticket, in the error message
telling people to run it. That is documented in `research.md` §4 and decided in `design.md` §2.

What changed:

- `stepStarts()`, the script's own copy of the parser's step-block rule, **deleted**. It now reads
  `readStepLabels().stepLines` — the build's own scan. This closes T-009-02's open concern #3
  ("two copies of one rule … nothing makes them agree tomorrow").
- The local `NUMBERED` regex deleted; hits come from `readStepLabels().numbered`.
- `plan()`'s fifth refusal — *"the build gives step N a different label"* — deleted, because the
  build no longer gives step N anything. A new refusal took its place: a numbered label naming a
  step that already carries an inline label is a question for a person, not a merge.
- `verify()` gate 1's expected map is now `[...reading.labels, ...moves]` rather than
  `normalise()`'s overrides; gate 3 counts the inline lines the run **added** rather than the
  total, so a file mixing the two forms can be migrated instead of refused.
- The run loop's skip test became `problems.length > numbered.length` — the invariant documented
  on `StepLabels.numbered` — instead of *"any step-label problem at all"*, which after Step 1
  would have been every numbered file.
- The header comment was rewritten. Its claim *"the script never counts. normalise() says which
  step wears which label"* became false with this change, and leaving it would have been exactly
  the defect §2 of this ticket is about. It now states what actually holds it up, **including
  that this is weaker than it was**: one scan resolves and verifies, held against the parser's
  count.

**The collection is a no-op**, which is what it must be:

```
$ node scripts/inline-step-labels.mjs
0 file(s) would move, 0 label(s). 664 file(s) had none. 0 file(s) skipped.
$ git status --porcelain recipes | wc -l
       0
```

**Round-trip 1, on a real recipe.** `new-england-clam-chowder.cook`, stripped of its own labels,
with three written back as `>> step.2:`, `>> step.4:`, `>> step.6:`:

```
$ node scripts/check-recipes.mjs roundtrip.cook        → FAIL, 3 refusals, exit 1
$ node scripts/inline-step-labels.mjs --write roundtrip.cook
  move roundtrip.cook  3 label(s)
$ node scripts/check-recipes.mjs --labels roundtrip.cook
  ok   roundtrip.cook  12 rows x 7 cols
       render in a Dutch oven until crisp
         sweat them soft, 8 min                 ← step 2
           cook for 2 min
             simmer 15 min, potatoes tender     ← step 4
               warm through without boiling with
                 season it last                 ← step 6
$ node scripts/inline-step-labels.mjs --write roundtrip.cook
0 file(s) moved, 0 label(s). 1 file(s) had none.        ← idempotent
```

Each label landed on the step its number named. **This is the claim the error message makes when
it says *run this to fix it*, tested end to end.**

**Round-trip 2, a mixed file** — one `>> step.2:` in the metadata block and one `>> step:` already
above step 5. New behaviour: it used to be refused by everything.

```
$ node scripts/check-recipes.mjs mixed.cook     → FAIL, one refusal, about the numbered line only
$ node scripts/inline-step-labels.mjs --write mixed.cook   → 1 label
$ node scripts/check-recipes.mjs --labels mixed.cook       → ok, exit 0
       …  sweat them soft, 8 min   ← moved, step 2
       …  thicken it, do not boil  ← already inline, step 5, unmoved
```

---

## Step 3 — the comments that outlived the syntax

Commit `b2d280f` — four files, five sites, comment text only.

| | Now |
| --- | --- |
| `src/lib/tree.ts:35` | `/** A `>> step:` line on the line above the step wins over the derived label. */` |
| `src/lib/time.ts:152` | *"a label written on a `>> step:` line may not contain them at all"* |
| `src/lib/time.test.ts:131` | *"A `>> step:` line can rewrite a step in words of its own"* |
| `scripts/check-recipes.mjs:46` | *"2782 steps carry a `>> step:` label"* |
| `scripts/check-recipes.mjs:96` | *"A `>> step:` label replaces the step's own words"* |

```
$ git diff --stat
 scripts/check-recipes.mjs | 4 ++--
 src/lib/time.test.ts      | 2 +-
 src/lib/time.ts           | 4 ++--
 src/lib/tree.ts           | 2 +-
 4 files changed, 6 insertions(+), 6 deletions(-)
```

Every changed line is inside a comment; no executable line moved. `npx vitest run` → 980 passed.

The `check-recipes.mjs` error message the ticket's table lists as *"offering `>> step.N:` as the
fix"* was already inline before this ticket — T-009-01 fixed it. What was left in that file were
the two comments above. Nothing was missed; the table was describing a site that had already
moved.

---

## Step 4 — the documentation

Commit `314a61a` — `README.md`, `docs/knowledge/voice.md`, `docs/gaps/README.md`.

### README rule 5

The two "older form" sentences replaced by one saying it is gone and naming the fixer. Rule 5's
worked inline example and its binding rules are untouched.

### voice.md — eight sites, and the argument checked number by number

```
$ git diff -U0 -- docs/knowledge/voice.md | grep -c '^[+-][^+-]'
   19
```

Eight table cells and sentences where `step.N` / `step.1` became `>> step:`; one paragraph
re-wrapped because the substitution made a line too long; one new paragraph added.

**The re-wrap changed no words.** Word-level, on the tonkotsu mechanism paragraph:

```
$ diff <(git show HEAD:…/voice.md | sed -n '87,91p' | tr ' ' '\n') \
       <(sed -n '87,92p' …/voice.md | tr ' ' '\n')
38c38,40
< `step.1:`
---
> `>>
> step:`
> label
```

One token. Nothing else in that paragraph differs.

**The argument's numbers, counted before and after:**

| | 172,003 | 278,833 | 2782 | 637 | 472 | 250 | 132 | 55 | 115 | 72 | 3077 | 304 | 397 | 111 | 151 | 78 | 120 |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| before | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 1 | 1 | 4 | 1 | 2 | 1 | 1 | 1 | 6 | 5 |
| after | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 1 | 1 | 4 | 1 | 2 | 1 | 1 | 1 | 6 | 5 |

The 132-character worked example, the 472 → 72 paragraph, the 250 → 115 `slack:` line, the 55-char
row it prints, and both length tables are all where they were, saying what they said.

**Added**, in *What changed, and when*, outside the bulleted list so its "Four passages" preamble
stays true: two sentences recording that S-009 moved the label onto the line above its step and
that nothing about what the label is for, what it costs, or how long it may be moved with it.

```
$ grep -n 'step\.[N0-9]' docs/knowledge/voice.md README.md
docs/knowledge/voice.md:171: … it used to be written `>> step.4:` in the metadata block …
README.md:163: … There was an older form, `>> step.7:`, which …
```

Both remaining mentions say the form is **gone**. Neither teaches it.

### docs/gaps/README.md

The `step.N` bullet is out of *Recorded and not done*, which now has six bullets, all of them
recipe rewrites — which is what that section's own preamble claims of it, and was not quite true
while the `step.N` entry sat there.

A new `## Recorded and closed` section carries two entries:

1. **`>> step.N:` counts prose steps as well as operations — closed by removal.** The original
   wording quoted, then: fixed by removing the form rather than repairing the count, why repairing
   it was rejected, and T-009-02's Screen A (0 of 264 files affected) as the evidence that retiring
   the behaviour cost nothing.
2. **`@&(~N)` left as it is**, with the reasoning: 2,401 uses, 373 at `~2` or deeper, left alone
   because a mis-pointed relative reference usually stops the tree merging, which is a build error
   and not a wrong page. Counts re-measured here, not copied:

```
$ grep -roh '@&(~[0-9]*)' recipes --include='*.cook' | wc -l          2401
$ grep -roh '@&(~[2-9][0-9]*)' recipes --include='*.cook' | wc -l      373
$ grep -roh '@&([0-9][0-9]*)' recipes --include='*.cook' | wc -l        33
```

---

## Step 5 — the whole-collection proof

**Every operation label on every page, unchanged from the end of T-009-02:**

```
$ node scripts/inline-step-labels.mjs --dump > after/labels.txt
$ diff before/labels.txt after/labels.txt
$ echo $?
0
$ wc -l before/labels.txt after/labels.txt
    3466 before/labels.txt
    3466 after/labels.txt
```

Empty. 3,466 lines each — one per step of all 664 files, label, whether it is an operation, and
its timed / hands-on / unattended minutes.

**The build's own witness, which this ticket did not write:**

```
$ cmp before/recipes.json src/generated/recipes.json
$ echo $?  →  0        # identical, 3,956,883 bytes
```

Worth one line on why this is not vacuous: `recipes.json` is rebuilt from every field the build
derives, and another ticket added 33 lines to `src/data/counters.json` between the two runs. It
still came out byte-identical.

**No `.cook` file uses the numbered form:**

```
$ grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l
       0
```

**`npm run verify`:**

```
$ npm run verify ; echo $?
all 664 file(s) draw a table.
664 recipes parsed
Test Files  13 passed (13)     Tests  980 passed (980)
688 page(s) built
0
```

**Nothing of this ticket's left behind:**

```
$ git status --porcelain -- src scripts README.md docs/knowledge docs/gaps recipes
 M docs/gaps/air-fryer-and-pot.md
```

That one file belongs to T-008-02, running concurrently on this branch. Nothing this ticket owns
is staged, modified or untracked.

---

## Commits

| | |
| --- | --- |
| `f38cb8d` | Refuse the numbered step label, and say how to write it |
| `a3596e9` | Stand the fixer on the build's own step scan |
| `b2d280f` | Stop four comments describing a syntax that is gone |
| `314a61a` | Teach one form, and close the defect it carried |

All four through `lisa commit-ticket` with exact `--include` paths. No ordinary `git add` or
`git commit` was used for ticket work.

## Deviations from the plan

1. **Step 2 was larger than `plan.md` described**, by one refusal: a numbered label naming a step
   that already has an inline label above it. It fell out of allowing mixed files to migrate and
   is the one case where merging them would be a guess.
2. **The equivalence test was rewritten, not deleted.** `plan.md` said delete
   *"renders one real recipe identically written either way"*, since its premise — both forms work
   — is what this ticket removes. Its fixture machinery is worth more than that: it now builds the
   same two variants from the same real recipe and asserts the inline one draws its table and the
   numbered one is refused with the message. Both halves of the criterion, on real data, from one
   source.
3. **One extra test** beyond the five planned: `stepLines` is asserted directly, because it went
   from an internal count to a published position list that another script now inserts against.
