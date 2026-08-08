# T-009-02 — Design

The decision, and what it was chosen over. Grounded in the measurements in `research.md`.

## The question the design has to answer

Not "how do I move a line" — the corpus is uniform enough that a `sed` one-liner would move most
of them. The question is **what makes the result trustworthy**, because nobody is going to read
643 diffs. Every option below is judged on the proof it can carry, not on how neatly it moves text.

## Where N comes from

### A. Reimplement the count in the script

Walk the source, count step blocks, insert the label above the Nth. Simple, no imports.

**Rejected.** The acceptance criteria forbid it outright, and for a good reason the research
confirms: the count is 1-based over *every* step block including prose ones, which is the
undocumented behaviour that has already cost three files a round trip. A second implementation of
a rule nobody has written down is a second chance to write it down wrong, and the failure would be
silent — a mislabelled page that builds.

### B. Export the block scanner from `src/lib/step-labels.ts`

`scanSteps()` already knows where every step block starts. Export it and the script has the
build's own positions.

**Rejected**, on two grounds. The acceptance criteria limit the files this ticket may modify to
`recipes/**/*.cook`, one new file under `scripts/`, and this work directory — `src/lib/` is not on
the list. And T-009-03 rewrites this vocabulary anyway, so widening a public interface for one
migration buys a maintenance obligation that outlives the migration.

### C. Rebuild each file from the parsed AST

Parse, then print. The AST is by definition what the build thinks the file says.

**Rejected.** The parser is lossy — `normalise()` exists precisely because
`raw_metadata.map` collapses two `>> step:` lines onto one key, and it keeps no record of where
any line sat. Printing from the AST would rewrite every byte of all 643 files and make the "no
`.cook` file changed in any way other than moving these lines" criterion unprovable.

### D. Ask `normalise()` which step wears which label; verify the answer with `readStepLabels()`

**Chosen.** Two calls to the build's own code, on both sides of the edit:

```js
// The build's answer to "which step is N", bugs included. The script never counts.
const before = normalise(source, { slug, path: rel, folder });
const wanted = new Map(
  before.steps.filter((s) => s.labelOverride).map((s) => [s.index, s.labelOverride]),
);

// … produce the migrated text …

// The build's answer to "where did those labels just land".
const { labels: landed } = readStepLabels(migrated);
if (!sameMap(wanted, landed)) refuse(file, 'the label would not bind back to the same step');
```

The script still has to find *lines*, because inserting text is a line-level act and no exported
function hands out step positions. But it never has to be *believed* about them: the candidate
output is handed back to the reader the build uses, and the file is written only when the reader
puts every label back on the step `normalise()` took it off. A scanner bug becomes a refused file
with a printed reason, not a wrong page.

That inversion — **guess the position, verify the binding** — is the whole design. Everything else
follows from it.

## Where the line goes

Directly above the step, no blank line between, one line per label, in step order. The
`>> step.N:` lines come out of the metadata block, leaving the rest of the block untouched and in
its original order.

Two consequences to state as convention, both named in the ticket:

- **Blank lines separate steps, so the codemod changes their count by exactly zero.** It removes
  `k` non-blank lines from the metadata block and inserts `k` non-blank lines in the body. Blank
  lines are never inserted, never removed, never merged. The collection-wide blank-line count is
  the cheapest possible check on that and it is in the evidence.
- **A label on the first step lands after the blank line under the metadata block.** The block
  loses a line, the body gains one, and the blank line between them stays where it is. The
  research walks the binding through `classify()` / `scanSteps()` / `above()` / `below()` and it
  holds — but the verification pass proves it per file rather than by argument, which is why the
  ambiguity the ticket warns about resolves without a judgement call.

## What is refused rather than migrated

The script converts a file whole or leaves it entirely alone. There is no half state: T-009-01's
mixed-form check fails a file that writes both forms, so a partial conversion would break the
build.

A file is left alone, and listed with its reason, when any of these hold:

1. Some `step.N` has no step N — out of range, or `N < 1`.
2. Two lines claim the same N, or a label is empty after the colon.
3. `normalise()` throws, or reports a `stepLabelProblem` before the edit.
4. The local scan cannot place a step's first line confidently — a step whose block start it
   cannot identify, a `step.N` line below the first step, a file it cannot re-read as it expects.
5. The verification pass disagrees: `readStepLabels(migrated).labels` is not the map
   `normalise(source)` produced.
6. The migrated text differs from the source anywhere other than in `>> step` lines.

Rule 6 is a per-file version of the collection-wide criterion, and it is cheap: strip every line
matching `^>>[ \t]*step[. \t]` from both texts and require the remainders to be byte-identical.
That single comparison catches a dropped blank line, a lost trailing newline, a reordered
metadata block and a mangled step in one go, before anything is written.

The research says none of 1–6 should fire on today's collection. They are in the script because it
ships and will be run again on a collection that has grown.

## How the proof is produced

The ticket is explicit that the proof *is* the review, so the dump is not a by-product.

### P1. A dedicated `--dump` mode in the same script

**Chosen as the primary proof.** `check-recipes.mjs --labels` prints operation cells and nothing
else — no durations, no hands-on split, and it skips a file that fails. The ticket needs every
step of every recipe with its label, its derived duration and its hands-on split, and it needs the
dump to be stable enough that `diff` returning nothing means something. So the new script carries
its own dump mode:

```
node scripts/inline-step-labels.mjs --dump > before.txt
node scripts/inline-step-labels.mjs --write
node scripts/inline-step-labels.mjs --dump > after.txt
diff before.txt after.txt
```

One line per step of every one of the 664 files, in `findRecipes()` order, carrying: slug, 1-based
step index, whether the step is an operation, the label exactly as the cell renders it
(`labelOverride ?? cleanLabel(rawLabel)`, mirroring `check-recipes.mjs:92`), the step's total
timed minutes, and the hands-on / unattended split of those minutes. Durations come from the same
`readTimers()` readings `normalise()` already attached to each timer and that
`src/lib/schedule.ts:150-158` sums — so a label that moved to another step moves a number in this
file, which is exactly the property the ticket asks the dump to have.

The dump reads and writes nothing under `recipes/`, so it can be taken at any time.

### P2. `src/generated/recipes.json`, byte for byte

**Adopted as a corroborating proof, free of charge.** `normalise()` deletes every `step.N` key
from `metadata` (line 256) before returning, and no field it returns records where a line sat. So
the build's own generated artifact should be **byte-identical** before and after the migration —
not merely equivalent. That is a stronger statement than the dump makes, over more fields
(ingredients, refs, timers, washing-up, variants, pairings), produced by the build rather than by
this ticket's code, and it costs one `npm run recipes` and one `cmp` on each side.

If it comes back non-identical the migration is wrong, whatever the dump says, and the two proofs
disagreeing is itself the finding.

### P3. `check-recipes.mjs --labels`, unchanged

Kept as a third witness because T-009-01 already established it as the collection's label
fingerprint (186,525 bytes). It is redundant with P1 on labels and silent on time, so it is
evidence, not the criterion.

### Rejected: trusting a summary

"All 2,771 labels verified identical" is not proof, it is a sentence. Every claim in the review
carries the command that produced it and the output it produced, per the ticket.

## Findings, not corrections

The ticket's trap: move each label to the step the *current build* gives it, never to the step it
looks like it wants. The design honours that structurally — the script's only source of truth for
"which step" is `normalise()`'s `labelOverride`, so it is not capable of moving a label to a
better step even if asked.

The mismatch list is therefore produced **separately from the codemod**, by the probe described in
`research.md` (score each label against every step in its file; flag where another step beats its
own by a margin), followed by reading each candidate by hand. 14 candidates; the probe is a screen
and the hand-read is the verdict. Nothing found this way is corrected here, and the list is
written into the work artifact for T-009-03.

Keeping the screen out of the shipped script is deliberate: a word-overlap heuristic that flagged
`smoked-turkey-breast`'s correct label is not something to leave in `scripts/` for someone to
mistake for a checker.

## Script shape

Follows `menu-sections.mjs`, which the ticket names: a header comment with the invocations, a dry
run that changes nothing, `--write` to write, a per-file line, a tally at the end. It borrows one
thing from `check-recipes.mjs` — a refused file prints *why*, addressed to whoever has to fix it,
rather than being counted.

Idempotence falls out of the form: a migrated file has no `>> step.N:` line, so the second run
reports "nothing to do" for it and writes nothing. Verified by running `--write` twice and
checking `git status` after the second.
