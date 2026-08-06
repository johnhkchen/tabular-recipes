# T-005-06 · Progress — the prose nobody reads

All thirteen plan steps ran. Nine groups, nine commits, 358 `.cook` files, **844 bodies edited**
and **106,830 characters cut**. `step body 656 → 0`. Nothing was left unreached inside the
stated boundary.

---

## Step 0 · Baseline — done during Research

Captured against `7eb9baa` with a clean tree, and never regenerated:

```
report-before.txt       673 field(s) over cap in 329 file(s) — 48,733 characters over
                        step body 656
labels-before.tsv       3470 lines      data-before.tsv    4786 lines
cols-before.tsv          658 lines      meta-before.tsv     658 lines
bodies-all-before.tsv   2782 rows       bodies-over-before.tsv  656 rows
```

Two self-checks passed before anything was written, both over the whole collection rather than
a sample: `map-steps.mjs` → `658 file(s) checked, 0 disagreement(s)`; `split-bodies.mjs check`
→ `2782 bodies, 0 splitter failure(s)`.

## Step 1 · `apply-bodies.mjs`, and its guards proved before use

Written to design §4. Every refusal path was tested with a deliberately bad table **before any
group table was written**, and each was refused with the offending row named and
`git status --porcelain recipes/` left empty:

| Bad row | Refusal |
| --- | --- |
| a `rewrite` dropping six `@ingredient{}` tokens | `markup changed / was: … / now: (none)` |
| `keep 0,9` on a three-sentence body | `keep names sentence 9 but the body has 3` |
| `keep` naming every sentence | `keep names every sentence — nothing would change` |
| a step index past the end | `has no step 100` |
| a step with **no** `>> step.N:` line | `step 1 has no >> step.N: line — out of scope` |

### Deviation from the plan, recorded

**The token regex was wrong on first write and was fixed before any file was touched.**
`@&(~1)pot{}` was being matched as `~1)pot{}` — the `@&(` prefix fell outside the pattern. It
would still have compared equal before and after, so it was not a correctness hole in the
`keep` path, but a hand-written `rewrite` could have dropped `@&(` and been passed. Fixed by
giving the intermediate reference its own alternative, then verified the strong way: **every
markup character in every one of the 2782 bodies is now inside a whole token** —

```
bodies with unmatched markup characters: 0 of 2782
ref tokens matched whole: 2121   sample: @&(~2)clarified butter{}
```

**Second deviation:** the applier gained a `still over the 150 cap` report, computed from the
parser (`cleanLabel(after.steps[i].rawLabel).length`) rather than estimated. Without it, judging
whether a rewrite had actually landed under cap was guesswork. It is why the loop below is
*dry → read the over-cap list → retrim → dry* rather than a single pass.

## Steps 2-10 · The nine groups

Each group: read every body in the reading view, write `patch-<group>.tsv` where the proposal
was wrong, merge, `--dry`, retrim anything still over cap, apply, re-run `npm run recipes`,
diff all four proofs, commit, confirm the tree clean.

| # | Commit | Group | Bodies | Files | Hand patches |
| --- | --- | --- | ---: | ---: | ---: |
| 2 | `b87f2db` | the soup pot | 121 | 45 | 22 |
| 3 | `5063308` | the braise | 95 | 58 | 26 |
| 4 | `44491e9` | the grain shelf | 73 | 34 | 14 |
| 5 | `29a5f33` | the cold bowl | 67 | 23 | 1 |
| 6 | `2bb3874` | the fryer and the fire | 92 | 33 | 16 |
| 7 | `d7c95ca` | the sides and the dumpling table | 82 | 32 | 12 |
| 8 | `3473535` | the pouring shelf | 117 | 46 | 9 |
| 9 | `461c864` | the flour shelf | 93 | 42 | 12 |
| 10 | `78310a9` | the last shelves | 104 | 45 | 9 |
| | | **total** | **844** | **358** | **121** |

**The four proof diffs were run after every group, not only at the end** — `labels`, `data`,
`cols`, `meta`, all four `identical`, nine times. That is what makes "the tree did not move" a
statement about each commit rather than about the sum.

### How the 844 judgements divide

| | Count | |
| --- | ---: | --- |
| **keep-mask, proposal accepted** | 723 | sentences sliced out of the file, no text retyped |
| **hand-written `rewrite`** | 113 | a defence welded onto an instruction, or a body still over cap after tail-dropping |
| **keep-mask, corrected by hand** | 8 | the proposal kept the wrong sentence |
| | **844** | |

The proposal is *keep the first sentence and every sentence carrying markup, drop the rest*.
It was **read against the body in every one of the 844 cases**; the 121 patch rows are where it
was overruled. 113 of those are rewrites, which is where the retyping risk sits and why the
applier's token-sequence guard runs on every one.

### The group that needed a fixup commit

Group 3 (the braise) was applied with one body still at 156 characters — the over-cap list was
printed and the apply ran anyway. Caught before the commit, fixed by a one-row follow-up table
(`decisions-braises-fix.tsv`) against the file as it then stood, re-proved, and committed
together with the rest. No other group applied over cap.

## Step 11 · Findings

`findings.md`. Four bodies that would now make a good label on their own — **nothing acted on**,
and the reason the number is 4 rather than the 234 a looser test gives is written out there. 46
prose-row bodies reduced to a fragment of context, with the reason a fragment there costs a
reader nothing. Plus the 17 over-cap ingredient notes, which nobody owns and which will fail
T-005-07's build.

## Step 12 · The whole-collection proof

```
$ diff labels-before.tsv labels-after.tsv     ; echo $?   →  empty, 0
$ diff data-before.tsv   data-after.tsv       ; echo $?   →  empty, 0
$ diff cols-before.tsv   cols-after.tsv       ; echo $?   →  empty, 0
$ diff meta-before.tsv   meta-after.tsv       ; echo $?   →  empty, 0

$ node map-steps.mjs        658 file(s) checked, 0 disagreement(s).
$ node split-bodies.mjs check   2782 bodies, 0 splitter failure(s).

$ node dump-bodies.mjs stats
overridden steps: 2782 in 637 recipes
characters total: 172,003     (was 278,833)
mean 61.8  p50 56  p90 121  max 150
over 150: 0                   (was 656)

$ npm run check
17 field(s) over cap in 13 file(s) — 500 characters over.
by field:  operation cell 0 · step body 0 · prose row 0 · slack reason 0 · ingredient note 17
all 658 file(s) draw a table.

$ npm run verify        Test Files 9 passed (9) · Tests 833 passed (833) · 682 page(s) built
$ git diff --name-only 7eb9baa..HEAD | wc -l                    358
$ git diff --name-only 7eb9baa..HEAD | grep -v '\.cook$' | wc -l   0
```

Both self-checks were re-run **against the edited tree**, so the block mapping and the sentence
split are proved on the files as they end up, not only as they started.

## What was not reached, named

**Nothing inside the boundary.** The boundary itself, stated as design §1 set it and unchanged:

> **In scope: every body that is over the 150-character cap, or made of more than one
> sentence. 844 of the 2782.**
> **Out: the 1938 that are a single sentence at or under the cap.**

Those 1938 were **not read**. The claim that stands behind leaving them is measured, not
assumed: a defence is a second sentence, and T-005-01 measured the mechanical first sentence of
a body at p50 71 / p90 131 characters. Verifiable in one line against the tree as it stands:

```
$ node split-bodies.mjs counts | grep '1 sentence'
 1662  under 100 · 1 sentence
  276  100-150 · 1 sentence
```

**No folder was skipped.** All 27 folders carrying an overridden body were worked; the group
table above accounts for every one. The ticket's fallback — *finish whole categories rather
than a scattering* — was kept available and never needed.

## Artifacts in this directory

| File | What it is |
| --- | --- |
| `record.tsv` | **the deliverable** — 844 rows, one per edited body: path, step, kind, how, length before and after, the `step.N` line, and the body before and after in full |
| `decisions-<group>.tsv` | the nine tables the applier consumed |
| `patch-<group>.tsv` | the 121 rows where the proposal was overruled, by hand |
| `prop-<group>.tsv` | the generated proposals, so the overrule is diffable |
| `view-<group>.txt` | the reading views, sentence by sentence with the markup flagged |
| `finding-good-labels.tsv`, `finding-fragments.tsv` | the two findings, machine-readable |
| `*-before.tsv` / `*-after.tsv` | labels, data, cols, meta — the four proofs |
| `report-before.txt` / `report-after.txt` | `npm run check`, in full |
| `verify.log` | `npm run verify`, in full |
| `dump-bodies.mjs`, `map-steps.mjs`, `split-bodies.mjs`, `read.mjs`, `merge.mjs`, `apply-bodies.mjs`, `group.sh` | the toolchain; only `apply-bodies.mjs` writes |
