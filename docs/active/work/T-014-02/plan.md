# T-014-02 — Plan

Fifteen steps. Twelve are a fix; step 0 is the baseline, step 13 is the two undone bands, step 14 is
the sweep. **Every fix step is: edit → run its command → record the output → commit → next.** No
step starts before the one before it has its output written down.

## Step 0 — baseline (done in Research, re-stated so the deltas have a floor)

```
$ git status --porcelain -- recipes/ src/ scripts/ docs/gaps/ docs/knowledge/ README.md   # empty
$ npm run verify > verify-before.txt 2>&1 ; echo "VERIFY_RC=$?"                            # 0
685 files · 685 parsed · 1229 tests in 21 files · 710 pages · 22 counters, 930/930
$ node scripts/menu-sections.mjs > ms-before.txt                                           # 177 lines
$ node scripts/measure-pages.mjs | head -6                                                 # max 4480 biryani
```

`ms-before.txt` is the reference every gap-page edit is diffed against, so a page edit that opens or
closes a counter section by accident is caught at the edit that did it. **Expected delta for the
whole ticket: exactly the One Pot line and its five `unplaced` names.**

## The twelve fix steps

Each names the file, the edit, the command, and what the command has to say. A step whose command
does not say that is a step that stops and gets recorded, not retried into submission.

### Step 1 — finding 1, `docs/gaps/one-pot.md`

Add the fifth section block copied from `src/data/counters.json`.

```
$ node scripts/menu-sections.mjs | grep -A1 'One Pot'
```
→ `ok One Pot: 5 sections, 73/73 placed`, no `unplaced` line.

```
$ node scripts/menu-sections.mjs > ms-after.txt && diff ms-before.txt ms-after.txt
```
→ only the One Pot lines differ. Then `ms-before.txt` is replaced by `ms-after.txt` as the floor for
steps 2 onward.

Commit: `docs/gaps/one-pot.md`.

### Step 2 — finding 2, `docs/gaps/cha-chaan-teng.md`

Three sites: the `## What it has` preamble, the borrow preamble, five `What happened` cells.

```
$ grep -c 'listed, not rendering' docs/gaps/cha-chaan-teng.md      → 0
$ grep -c 'prints 22' docs/gaps/cha-chaan-teng.md                  → 0
$ grep -o '<p class="count">[^<]*' dist/menu/cha-chaan-teng/index.html
                                                                   → 27 recipes
$ node scripts/menu-sections.mjs | diff ms-before.txt -            → empty
```

`dist/` is the build already on disk from step 0's verify; if any step has rebuilt since, it is
re-read rather than remembered.

Commit: `docs/gaps/cha-chaan-teng.md`.

### Step 3 — finding 3, same file, one clause under `### The tea`

```
$ grep -c 'No source states a ratio' docs/gaps/cha-chaan-teng.md   → 0
$ grep -c '自由時報' docs/gaps/cha-chaan-teng.md                     → ≥ 2 (the bullet and Sources)
$ node scripts/menu-sections.mjs | diff ms-before.txt -            → empty
```

Commit: `docs/gaps/cha-chaan-teng.md`.

### Step 4 — finding 4, `docs/gaps/voice.md`

A dated note at the head of §5.

```
$ grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l        → 0
$ grep -c 'T-009-03' docs/gaps/voice.md                            → ≥ 1
$ grep -c '172,003' docs/gaps/voice.md                             → unchanged
$ node scripts/menu-sections.mjs | diff ms-before.txt -            → empty
```

The third is the one that matters: it says the measurements were not touched.

Commit: `docs/gaps/voice.md`.

### Step 5 — finding 11, `docs/gaps/air-fryer-and-pot.md`

Rename the last heading. Before the edit, `grep -n 'table cannot hold' docs/gaps/air-fryer-and-pot.md`
to find any in-page cross-reference that has to move with it.

```
$ grep -l '^## What it could not stock' docs/gaps/*.md | wc -l     → 23   (was 22 — see design D3)
$ grep -c 'What a table cannot hold' docs/gaps/air-fryer-and-pot.md → 0
$ node scripts/menu-sections.mjs | diff ms-before.txt -            → empty
```

Commit: `docs/gaps/air-fryer-and-pot.md`.

### Step 6 — finding 5, `docs/knowledge/scaling.md`

Two false clauses, §7 and §9.

```
$ grep -c 'no air fryer recipe' docs/knowledge/scaling.md          → 0
$ grep -ci 'There is no air fryer' docs/knowledge/scaling.md       → 0
$ node -e "const R=require('./src/generated/recipes.json');console.log(R.filter(r=>r.kit==='Air Fryer').length)"
                                                                   → 13
$ grep -c 'elapsed = 66 min' docs/knowledge/scaling.md             → 1  (illustration untouched)
```

Commit: `docs/knowledge/scaling.md`.

### Step 7 — finding 8, `docs/knowledge/occasions.md`

Three sites, `0` → `46`.

```
$ node -e "const R=require('./src/generated/recipes.json');console.log(R.filter(r=>r.capacity).length)"
                                                                   → 46
$ grep -c '0 capacities declared' docs/knowledge/occasions.md      → 0
$ grep -n '46' docs/knowledge/occasions.md                         → the three sites
$ grep -c 'ρ = ' docs/knowledge/occasions.md                       → unchanged (rates untouched)
```

Commit: `docs/knowledge/occasions.md`.

### Step 8 — finding 7, `docs/gaps/README.md`

One clause about the coverage report.

```
$ npx vitest run src/lib/shopping.test.ts --reporter=verbose 2>&1 | grep -A1 'have no aisle'
                                                                   → 4/1086 …, leftover pizza named
$ grep -c '3 of 1074' docs/gaps/README.md                          → 0
$ grep -c '## Build state' docs/gaps/README.md                     → 1  (the pushback, untouched)
$ node scripts/menu-sections.mjs | diff ms-before.txt -            → empty
```

Commit: `docs/gaps/README.md`.

### Step 9 — finding 10, `README.md`

One bullet on the refusal list.

```
$ sed -n '/Things a table cannot show/,/^$/p' README.md             → three bullets
$ npm run verify > v9.txt 2>&1 ; echo "RC=$?"                       → 0, same figures as step 0
```

This is the first step that re-runs the whole build, because the finding's own verify is
*"the bullet is present and `npm run verify` is unchanged"*.

Commit: `README.md`.

### Step 10 — finding 9, `scripts/measure-pages.mjs`

Line 6's usage slug, replaced with the script's own current wordiest page.

```
$ node scripts/measure-pages.mjs --slug <replacement>               → a count, not nothing
$ node scripts/measure-pages.mjs --slug ching-bo-leung-soup         → nothing (the defect, shown)
$ grep -n 'ching-bo-leung-soup' scripts/measure-pages.mjs           → line 30 only
```

The third is what proves the dated baseline note at line 30 was left alone.

Commit: `scripts/measure-pages.mjs`.

### Step 11 — finding 13, `scripts/parse-recipes.mjs`

`recipe.capacityProblem` added to the throw list.

```
$ npm run recipes                                                   → 685 parsed, exit 0
$ cp <a real .cook> $SP/probe.cook  # scratch copy, then a malformed capacity line written into
$ cp $SP/probe.cook recipes/<category>/zz-t01402-probe.cook
$ npm run recipes ; echo "RC=$?"                                    → non-zero, message names the file
$ rm recipes/<category>/zz-t01402-probe.cook
$ npm run recipes                                                   → 685 parsed, exit 0
$ git status --porcelain -- recipes/                                → empty
```

**The probe file is written into `recipes/` and removed in the same step**, and the empty
`git status -- recipes/` afterwards is the proof it left nothing behind. A probe that cannot be
removed is a failed step. Before the fix, the same probe must make `npm run recipes` exit **0** —
that is what makes the after-state a demonstration rather than an assertion.

Commit: `scripts/parse-recipes.mjs`.

### Step 12 — finding 12, `src/lib/time.ts`, wrapped in the dump-and-diff

T-009-02's technique, which the acceptance criteria require for anything that could move an
operation label or a clock figure.

```
$ node $SP/dump.mjs > $SP/sched-before.txt      # 685 lines: slug + 6 schedule figures
# edit: 'airfry' into UNATTENDED
$ npm run recipes
$ node $SP/dump.mjs > $SP/sched-after.txt
$ diff $SP/sched-before.txt $SP/sched-after.txt ; echo "DIFF_RC=$?"
```
→ **empty, DIFF_RC=0.** A non-empty diff means the finding is not mechanical: the edit is reverted,
the finding is pushed back to *needs an argument* with the diff as the evidence, and the ticket ends
with eleven applied rather than twelve.

The dump carries `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`, `assumedHandsOnMinutes`,
`untimedCount` and `longestHandsOnMinutes` for every recipe — the same six T-014-01 dumped, so the
two measurements are comparable.

Also, because the acceptance criteria name operation labels as well as clock figures:

```
$ node scripts/check-recipes.mjs --labels <a basket recipe>   before and after   → identical
```

Commit: `src/lib/time.ts`.

### Step 13 — the two undone bands, `docs/gaps/README.md`

Not a fix. Three things, in one commit:

1. **Row by row over the 25 *needs an argument* rows and the 4 *needs food* rows**, checking each
   has finding, evidence, source ticket and reason. Recorded as a table in `progress.md` with a
   verdict per row, not as a sentence saying it was checked.
2. **The finding-6 pushback row added** to the *needs an argument* table.
3. **Whatever the read finds missing, added.** Additive only — no existing row is reworded.

And the bookkeeping edit to `docs/gaps/what-the-season-left.md`: the finding-6 bullet moved between
bands, *Thirteen* → *Twelve*, one pointer line to this ticket's artifact.

```
$ grep -c 'T-014-02' docs/gaps/README.md docs/gaps/what-the-season-left.md
$ awk '/^## Mechanical/{p=1;next} /^## Needs an argument/{p=0} p' docs/gaps/what-the-season-left.md | grep -c '\*Verify:\*'
                                                                    → 12
$ node scripts/menu-sections.mjs | diff ms-before.txt -             → empty
```

Commit: `docs/gaps/README.md`, `docs/gaps/what-the-season-left.md`.

### Step 14 — the sweep, on a quiet tree

```
$ npm run verify > verify-after.txt 2>&1 ; echo "VERIFY_RC=$?"
$ diff <(grep -E 'draw a table|parsed|Test Files|Tests |page\(s\) built|counter\(s\)' verify-before.txt) \
       <(grep -E '…same…' verify-after.txt)
$ npm run verify:mobile > mobile.txt 2>&1 ; echo "MOBILE_RC=$?"
$ git status --porcelain
```

**`verify:mobile` runs with nothing else building.** T-010-03 lost five attempts and an operator's
afternoon to a concurrent build tripping the sweep's own guard; that is the one instruction in this
ticket with a cost already attached to ignoring it. No background build, no watcher, no second
terminal, and the exit code read from the command rather than from a pipeline.

## Testing strategy

**No unit test is added, and that is the answer rather than a gap.**

- Eleven of the twelve fixes are documents. A test asserting a paragraph exists is a test of the
  diff.
- Finding 13 adds a member to a list of five siblings, none of which has a test of its own; what
  covers it is the probe in step 11, which is a real failure demonstrated and then removed. A
  permanent fixture would mean a deliberately malformed `.cook` living in `recipes/`, which every
  other checker in `npm run verify` would then have to be taught to ignore.
- Finding 12 adds a word to a vocabulary set. The 1,229 existing tests cover the readers that
  consume it; what a new test would assert — that `~air fry{}` reads unattended — is asserted more
  strongly by the dump-and-diff, which says the same thing across all 685 files.

Precedent: T-012-02, T-013-01 and T-013-03 all shipped document work with no new test and all three
dispositions passed.

**What stands in for tests:**

| check | catches | when |
| --- | --- | --- |
| each finding's own `*Verify:*` | the fix not landing | after every fix |
| `menu-sections.mjs` diffed against `ms-before.txt` | a gap-page edit moving a counter section | after every gap-page fix |
| `npm run verify` | anything reaching the build | steps 9, 11, 12, 14 |
| the malformed-capacity probe | finding 13 doing nothing | step 11, before and after |
| the 685-recipe schedule dump-and-diff | finding 12 moving a clock figure | step 12 |
| `check-recipes.mjs --labels` on a basket recipe | finding 12 moving an operation label | step 12 |
| `npm run verify:mobile` | a heading rename breaking a layout | step 14 |
| `git status --porcelain` | a probe left behind, a file left uncommitted | steps 11 and 14 |

## Risks, and what each costs

| risk | cost | handling |
| --- | --- | --- |
| Finding 12's diff comes back non-empty | one fix, not the ticket | revert, push back, record the diff. Planned for above |
| Step 11's probe cannot be removed | a dirty `recipes/` | `git status -- recipes/` is checked in the same step; the probe name is prefixed `zz-t01402-` so it is unmistakable |
| A prose repair takes more than the false clause | the ticket's whole point | every step names what it does **not** touch, and the *Not touched* greps are run |
| `verify:mobile` fails on a heading rename | a real finding, in T-014-03's area | recorded, not worked around |
| Another thread builds during step 14 | a false failure | the branch has been quiet all attempt; re-checked before the sweep |

## Definition of done

- Twelve fixes applied, each with its command and that command's output in `progress.md`, run after
  that fix and before the next.
- One finding pushed back with its reason, recorded in `progress.md`, in
  `docs/gaps/what-the-season-left.md` and in `docs/gaps/README.md`.
- No `.cook`, no `src/data/`, no declared time, servings, capacity, washing-up count or slack level
  changed; no argument in a knowledge or gap page rewritten.
- Both undone bands read row by row, with a verdict per row recorded.
- `npm run verify` exit 0; `npm run verify:mobile` exit 0, run alone.
- `git status --porcelain` carries nothing of this ticket's, and every commit went through
  `lisa commit-ticket`.
