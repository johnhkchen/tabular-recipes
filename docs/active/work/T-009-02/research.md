# T-009-02 — Research

What exists, where, and how it connects. No solutions here.

## The population, measured

Every number below comes from a probe run over the working tree today, not from the ticket.

| | Count |
| --- | --: |
| `.cook` files under `recipes/` | **664** |
| files carrying at least one `>> step.N:` | **643** |
| files carrying none | **21** |
| `>> step.N:` lines in total | **2,771** |
| blank lines across the collection | **4,130** |

The ticket says 658 files and 15 untouched; the tree says 664 and 21. Six files have been added
since the ticket was written and none of them uses the numbered form. The 643/2,771 figures —
the ones every acceptance criterion is stated against — match exactly.

## The lines are uniform to the byte

Of 2,771 lines, **2,771** match the exact literal `>> step.N: `. There is no `>>step.4:`, no
`>> step .4 :`, no tab, no `>> Step.4:`. A `sed`-level uniformity that the codemod does not have
to rely on but which does mean the population holds no lexical surprises.

Further, across all 643 files:

- **0** labels have `N` out of range (`N > steps.length`).
- **0** have `N < 1`.
- **0** files repeat an `N`.
- **0** `>> step.N:` lines sit below the first step — every one is in the metadata block at the top.
- **0** files have their `step.N` lines non-contiguous within that block.
- **0** label values are empty after the colon.

## The files are uniform in shape too

A second probe classified every line of every one of the 664 files:

| Shape | Count |
| --- | --: |
| files whose first step is not preceded by a blank line | 0 |
| steps spanning more than one line | 0 |
| comment lines (`--`) | 0 |
| section headers (`= …`) | 0 |
| text blocks (`> …`) | 0 |
| metadata lines below the first step | 0 |
| CRLF line endings | 0 |
| files with no trailing newline | 0 |
| consecutive blank lines | 0 |
| lines with trailing whitespace | 0 |
| indented content lines | 0 |

So every file in the collection is literally: a metadata block of `>> key: value` lines, one
blank line, then one-line steps separated by exactly one blank line, ending in a newline.

This is the single most important research finding, and it cuts both ways. It means the mechanical
risk here is far lower than 643 files sounds. It also means **the collection exercises none of the
hard cases**, so the script's handling of them is untested by the corpus and has to be either
defended by unit-style reasoning or refused outright.

## How N is resolved today

`scripts/normalise.mjs` is the only place the parser is touched, shared by the build
(`parse-recipes.mjs`) and the checker (`check-recipes.mjs`). Line 145:

```js
const labelOverride = labels.get(index) ?? metadata[`step.${index + 1}`] ?? null;
```

`index` is `steps.length` at the moment the step is pushed (line 127), and steps are pushed for
**every** `content.type === 'step'` in every section — with no filter for whether the step uses an
ingredient. That is the whole of the recorded bug: `step.N` is 1-based over every step block as
written, **prose steps included**. `docs/gaps/README.md:260` records it under *Recorded and not
done*; the story quotes it.

`labels` comes from `readStepLabels(source)` in `src/lib/step-labels.ts`, which T-009-01 added. It
returns `{ source, labels, stepCount, problems }`, where `source` is the file with every
`>> step:` line blanked in place to `--`. A file with no inline label returns its own source
object unscanned (line 139), so today all 643 numbered files take that fast path and
`labels.get(index)` is always `undefined` for them.

**The codemod's access to the build's own numbering is therefore `normalise()` itself.** There is
no smaller exported seam: `readStepLabels()` gives step *line* positions but only for a file
already in the inline form, and its `stepCount` is 0 on the fast path. `normalise()` is the object
that decides which step is N, and it is importable.

## Where a label would have to land

`readStepLabels()` binds a `>> step:` line to the step block on the very next meaningful line
(`below()`, `stepOf`). Its `scanSteps()` treats a comment as transparent and everything else
non-step as closing a block. So for the collection's actual shape:

```
>> slack: …
>> step.1: render in a Dutch oven      ->   >> slack: …
                                            (blank)
(blank)                                     >> step: render in a Dutch oven
Render @salt pork{…} …                      Render @salt pork{…} …
```

The first step is the interesting case the ticket calls out. After migration the label line sits
*after* the blank line that separates the metadata block from the body. When
`readStepLabels()` blanks it to `--`, the parser sees a comment line directly above the step;
`classify()` calls that transparent and `scanSteps()` opens the block at the `Render` line — so
step 0 is still step 0. `above()` skips the comment and finds the metadata line, so the
"inside a step" rule does not fire, and `below()` finds the step with `acrossBlank === false`.
This binds. It is worth proving on a real file rather than reasoning about, and the ticket asks
for exactly that.

## What must not move: the two things downstream reads

1. **The label itself.** `check-recipes.mjs:92` renders `step.labelOverride ?? cleanLabel(...)`
   into the operation cell, and `src/lib/tree.ts` puts it on the page. Byte-identical is the
   criterion.
2. **The clock.** `normalise.mjs:192` calls `readTimers(timers, operationLabel)` where
   `operationLabel` is `labelOverride ?? rawLabel`. `src/lib/time.ts:174` reads the label's words
   to decide whether a timer is `hands-on` or `unattended`, and `regionsOf()` slices the label per
   timer. A label that moved to a different step would hand a different sentence to
   `readTimers()`, and `src/lib/schedule.ts:150-158` sums exactly those readings into
   `handsOnMinutes` / `unattendedMinutes`. So the label and the clock are the same fact twice, and
   the dump has to carry both.

## Is the current numbering actually right?

Two probes, because the ticket's "list every label the build gives to a step it does not describe"
needs a method, not a vibe.

**Probe A — systemic drift.** 264 files contain at least one prose step (no ingredients, no refs)
and at least one `step.N` line. For each, the labels were scored by word overlap against the step
the build gives them, and against the step an *operations-only* numbering would give them. Files
where the operations-only numbering fits better: **0**. So no file was authored by someone
counting only the rows the table draws — the recorded gap has cost round trips but has not left
a shifted file behind in the collection as it stands.

**Probe B — individual mismatch.** Each of the 2,771 labels was scored against every step in its
own file; a label was flagged when some other step scored ≥ 0.5 and beat its own step by ≥ 0.34.
That yields **14 candidates**. Read by hand, most are false positives of the metric rather than
findings — `smoked-turkey-breast`'s `>> step.2: brine chilled, 12 hr` scores badly against
"Submerge … in the fridge and ~brine{12%hr}" only because the overlap is one stemmed word, and it
is plainly the right step. The candidates still have to be read one at a time; the metric is a
screen, not a verdict.

108 labels land on a **prose** step. That is not by itself a finding: `peach-cobbler`'s
`>> step.1:` is byte-identical to the prose row it names, which is an author who counted prose
steps correctly and chose to keep the row's own words. Whether each of the 108 is intentional is a
reading question.

## The scripts already there, and their shape

`scripts/` holds `normalise.mjs`, `parse-recipes.mjs`, `check-recipes.mjs`, `find-recipes.mjs`,
`menu-sections.mjs`, `browser.mjs`, `check-overflow.mjs`, `check-touch.mjs`, `measure-pages.mjs`.

The one the ticket points at as the model is `menu-sections.mjs`: a file-header comment giving the
two invocations, a dry run that reports and changes nothing, `--write` to actually write, a
per-item `ok` / `--` line, a count of what needs a look at the end. `check-recipes.mjs` adds the
other half of the house style: it writes nothing at all, it says *exactly* what is wrong per file
rather than a total, and its messages are addressed to the person who has to fix the file.

`find-recipes.mjs` exports `findRecipes()`, returning `{ full, folder, slug }` in a stable sorted
order — the same order the build uses, so a dump built on it diffs cleanly between runs.

## Constraints inherited from T-009-01

- **A half-migrated file fails loudly.** `readStepLabels()` line 224 reports a file that writes
  both forms, and `parse-recipes.mjs:56` throws on it. So a file is converted entirely or not at
  all; there is no partial state that builds.
- The numbered form still works. Nothing is removed here — T-009-03 does that — so a file left
  behind still renders.
- `>> Step:` is accepted case-insensitively, and an indented `>> step:` is refused.

## Verification surface

`npm run verify` = `check-recipes.mjs` → `parse-recipes.mjs` → `vitest run` → `astro build`.
`check-recipes.mjs --labels` prints every operation cell per file and is what T-009-01 used for
its own byte-identical sweep (`labels-numbered.txt` / `labels-inline.txt`, 186,525 bytes each).
It does **not** print durations or the hands-on split, so the dump this ticket needs is a
superset of it and does not exist yet.

## Working-tree hazard

`git status` shows another ticket mid-flight: `src/pages/search.json.test.ts` deleted and
`src/pages/_search.json.test.ts` added, plus a dozen untracked story/ticket files. None of it is
owned here. `npm run verify` runs the whole suite, so a failure originating in that other work can
land in this ticket's evidence and has to be told apart from a failure this ticket caused.
