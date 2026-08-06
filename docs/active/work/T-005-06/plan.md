# T-005-06 · Plan — the prose nobody reads

Thirteen steps. Steps 1-2 are done before any file is touched; steps 4-12 are the nine
folder groups, each identical in shape and each one commit; step 13 is the whole-collection
proof.

---

## Step 0 · Baseline — DONE during Research

Captured against `7eb9baa` with a clean tree:

```
report-before.txt   673 field(s) over cap in 329 file(s) — 48,733 characters over
                    by field: operation cell 0 · step body 656 · prose row 0
                              slack reason 0 · ingredient note 17
labels-before.tsv   3470 lines
data-before.tsv     4786 lines
cols-before.tsv      658 lines
meta-before.tsv      658 lines
bodies-all-before.tsv   2782 rows
bodies-over-before.tsv   656 rows
```

**These files are never regenerated.** Everything after this compares against them.

T-005-01's own baseline, for the criterion that asks for both totals:
**1209 fields over cap in 499 files — 92,947 characters over** (`T-005-01/review.md:76`).

**Verification:** already run — `map-steps.mjs` reports `658 file(s) checked, 0
disagreement(s)`; `split-bodies.mjs check` reports `2782 bodies, 0 splitter failure(s)`.

---

## Step 1 · Write `apply-bodies.mjs`

The only tool that writes. Built to the guard list in `design.md` §4.

**Verification, before it is trusted with anything:**

1. `--dry` over a hand-made three-row table covering all three shapes (`keep` tail-drop,
   `keep` non-contiguous, `rewrite`) — reports what it would write, touches nothing.
2. A deliberately bad table — a step with no override, a `keep` index past the end, a
   `rewrite` that drops an `@ingredient{}` — must be refused with the file named, and
   `git status --porcelain recipes/` must stay empty.
3. Applied for real on one file, then `git diff` read by eye and `git checkout` to undo.

Only after (2) refuses all three bad rows does any group table get written.

---

## Steps 2-10 · The nine groups

Identical procedure. Group list and folder membership are `structure.md` §6.

**Per group:**

1. `node split-bodies.mjs over | grep '^recipes/<folder>/'` plus the under-cap
   multi-sentence rows for the same folders — this is the reading list.
2. **Read every body on the list** and write `decisions-<group>.tsv`: one row per body, a
   `keep` mask or a `rewrite`, and a tag from `compare | defend | provenance | meta |
   rewrite`.
3. `node apply-bodies.mjs decisions-<group>.tsv --dry` — expect `0 refusal(s)`.
4. `node apply-bodies.mjs decisions-<group>.tsv` — writes; prints the files written.
5. `npm run recipes && npm run check` — the group's over-cap bodies must be gone from the
   report; nothing else may appear.
6. `node dump-bodies.mjs labels | diff labels-before.tsv -` — **empty**.
   Same for `data`, `cols`, `meta`. Four empty diffs, every group, not only at the end.
7. `lisa commit-ticket --ticket-id T-005-06 --message <message> --include <exact paths>`
   using the paths the applier printed.
8. `git status --porcelain recipes/` — empty.

**A group that fails at 3, 5 or 6 is not committed.** The applier restores on refusal; if
step 6 ever produces a non-empty diff the fix is to correct the decisions row and re-run,
not to accept the diff.

| Step | Group | Folders | Over-cap |
| --- | --- | --- | ---: |
| 2 | the soup pot | `soups` | 89 |
| 3 | the braise | `stews-and-braises` | 75 |
| 4 | the grain shelf | `rice-beans-and-grains` | 68 |
| 5 | the cold bowl | `salads` | 58 |
| 6 | the fat and the fire | `fried-and-crispy`, `smoked-and-grilled` | 74 |
| 7 | the sides | `vegetables-and-sides`, `dumplings-and-rolls` | 67 |
| 8 | the pouring shelf | `sauces-and-gravies`, `dressings-and-dips`, `spice-blends-and-marinades`, `toppings-and-pickles` | 85 |
| 9 | the flour shelf | `breads`, `pastry-and-doughs`, `flatbreads-and-pancakes`, `pizzas`, `pasta`, `noodles` | 68 |
| 10 | the rest | nine small folders | 72 |

Each group is a commit whose message says what the shelf lost, in the project's voice —
*"Cut the soup pot's bodies to what happens in the pot"* — not *"apply decisions-soups.tsv"*.

---

## Step 11 · Findings

`findings.md`, written from the tags accumulated across the nine tables. Two lists the
criteria ask for by name:

1. **Bodies that would now make a good label on their own.** The test: the shortened body is
   at or under the 70-character operation-cell cap, reads as a verb phrase, and says
   something the current `>> step.N:` line does not. **Nothing is acted on** — the ticket
   forbids touching a `step.N` line and T-005-05 has just proved the tree unchanged.
2. **Bodies that were all defence**, where §5 of the design forced the shortest
   instruction-bearing clause to be kept rather than the body emptied.

Plus anything the reading turned up that belongs to nobody: the 17 over-cap ingredient notes
are already known, and a body that hides a missing operation is T-005-05's §5 list, not this
ticket's.

---

## Step 12 · The whole-collection proof

```
npm run recipes
node dump-bodies.mjs labels > labels-after.tsv ; diff labels-before.tsv labels-after.tsv
node dump-bodies.mjs data   > data-after.tsv   ; diff data-before.tsv   data-after.tsv
node dump-bodies.mjs cols   > cols-after.tsv   ; diff cols-before.tsv   cols-after.tsv
node dump-bodies.mjs meta   > meta-after.tsv   ; diff meta-before.tsv   meta-after.tsv
npm run check > report-after.txt
npm run verify
git diff --name-only 7eb9baa..HEAD
git status --porcelain
```

**Pass conditions:**

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | every operation cell label byte-identical | `diff labels` empty, exit 0 |
| 2 | ingredients, timers, quantities identical across 658 | `diff data` empty, exit 0 |
| 3 | no `>> step.N:` line added, removed or changed | `diff meta` empty, exit 0 |
| 4 | steps without an override untouched | applier construction + `diff labels` (their labels are derived from their bodies, so any edit would show) |
| 5 | before/after character total, five worked examples | `bodies-all-before.tsv` vs after; quoted in `review.md` |
| 6 | what was not reached, named | `progress.md`, by folder and by the stated boundary |
| 7 | good-label findings listed, nothing acted on | `findings.md` + `diff meta` empty |
| 8 | over-cap report smaller than T-005-01's | both totals pasted |
| 9 | `npm run verify` passes | its own output |
| 10 | only `.cook` step bodies modified | `git diff --name-only`, `diff meta` empty |

Criterion 4 deserves its own line: a step **without** an override has its label derived from
its body, so editing one would change a label — and `diff labels` being empty is therefore a
positive proof of it, not only an argument about the applier.

---

## Testing strategy

**No new vitest file, and it is a decision.** This ticket ships no code that runs in the
site. T-005-01, T-005-03, T-005-04 and T-005-05 each made the same call for the same reason.
What the suite is for here is that the 833 existing tests under `src/lib/` cover parsing,
labelling and tiling — the exact properties that must not move — and they run in
`npm run verify`.

Three layers of check, from narrowest to widest:

| Layer | Scope | Catches |
| --- | --- | --- |
| **applier guards** | one row, one file, in memory before writing | a mistyped quantity, a dropped `@&(~1)` ref, a keep index off the end, a step with no override |
| **per-group diffs** | the whole collection, after every group | anything the guards let through, at the group that caused it |
| **`npm run verify`** | check + parse + 833 tests + build | a file that no longer draws a table, a page that no longer builds |

The self-checks of the two read-only tools are the fourth layer and they run first:
`map-steps.mjs` (mapping) and `split-bodies.mjs check` (round trip). Both are re-run at
step 12 against the edited tree, so the mapping is proved on the files as they end up, not
only as they started.

### The gap, stated in advance

**No check can tell whether a shortened body still says the useful thing.** 844 bodies are
judged by hand. The mitigation is that the judgement is data: `decisions-*.tsv` carries the
keep mask and the tag for every one, and `bodies-all-before.tsv` carries the original text,
so any single call can be found and disputed with one `grep`. That is the deliverable; it is
not a substitute for a human reading it.

### If the reading runs out

The ticket's own fallback, unchanged: **finish whole folders, name the unreached ones.**
Groups are folder-shaped for exactly this reason. `progress.md` names which groups landed
and which did not, and `review.md` repeats it. A partial pass that is honest about its
boundary is the stated preference; a scattering is not.
