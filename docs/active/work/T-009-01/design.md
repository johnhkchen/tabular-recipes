# T-009-01 — Design

Six decisions. Each one is grounded in a measurement from `research.md`, and the two that could
have gone either way (the key's name, and how position is recovered) are argued against the
alternatives that were actually considered.

---

## 1. The key is `step`

`>> step: soak the flower 30 min, then rinse it hard`

Considered: `step`, `label`, `cell`, `name`, `call it`.

**`label` and `cell` name the machinery.** They are accurate — the value replaces the derived
operation-cell label — and they are exactly the register CLAUDE.md rules out: a cook opening a
`.cook` file for the first time does not know the table has cells, and does not need to. `name`
is vaguer still; a file already has a `title`, and a second naming key invites the question of
which one names the dish.

**`step` keeps a word the collection already teaches.** `>> step.7:` is in 643 files, in
`README.md:153`, and in seven places in `docs/knowledge/voice.md` — the file that argues *why* an
override throws the step's own words away. That argument is about steps and their labels, and it
survives this change untouched if the word survives. Choosing a new word would make T-009-03's
edit to voice.md a re-argument rather than a rename, and voice.md is explicitly out of scope here.

**Read aloud it is a heading, not a tautology.** A line reading `step: soak the flower 30 min`
sitting directly above the sentence about soaking the flower reads the way a heading reads. The
half-second test from CLAUDE.md — read the label, know what the thing is — passes: the line names
the step it sits on.

And it is free: `grep -c '^>>\s*step\s*:' recipes/**/*.cook` is **0**. Nothing is displaced.

The migration is then mechanical in the plainest possible way — delete `.N`, move the line to sit
above step N — which is what makes T-009-02's byte-identical proof believable.

## 2. Position comes from a scan of the source, cross-checked against the parser

The AST has no spans (research §3), so position must be read off the text. Four ways to do that
were considered.

| | How | Why not |
| --- | --- | --- |
| **A. Scan the source for step blocks** | Walk the lines; blank / `>>` / `=` / `>` close a block, `--` is transparent, anything else opens one. The label binds to the block below it. | **Chosen.** |
| B. Prefix-parse per label | For each label at line *L*, parse `lines[0..L]` and count the steps the parser finds. | Re-parses per label, and the thing it parses is a truncated document — a multi-line step cut in half still counts as a step, so the "authority" is answering a different question from the one asked. Correctness is *harder* to argue than A's, not easier. |
| C. Sentinel steps | Replace each label line with a unique one-line step plus a blank line, parse once, and read the sentinels' positions out of the step list. | Injecting steps shifts every `@&(~N)` relative reference in the file — 2,401 uses across the collection — so the probe parse answers a question about a document that is not the one being built. Clever, and unreadable in six months. |
| D. Keep reading `raw_metadata` | — | The map collides: two labels in one file, last wins (research §3, probe 2). This is the constraint the ticket exists to escape. |

**A's real weakness is that it duplicates the parser's block rules, and the answer is not to argue
about it but to assert it.** Both numbers are already in hand inside `normalise()`: the scan's
step count, and the number of `type === 'step'` blocks the parser emitted. When a file carries
inline labels, `normalise()` compares them and reports a problem if they disagree. A divergence
between the scanner and cooklang therefore cannot mislabel a page — it stops the build and says
so. That is the same bargain the rest of this repo makes: refuse to draw a table you cannot
justify.

Measured: the scanner and the parser agree on all 664 files today, at 0.21 ms/file including the
parse. But the collection uses none of cooklang's harder constructs (0 sections, 0 text blocks,
0 comments, 0 multi-line steps), so **the agreement check, not the 664-file run, is what makes
this safe.**

## 3. The label line is blanked to `--` in place, not deleted

Both are byte-identical to the parser (research §3, measured on a full `JSON.stringify` of the
parse). Blanking wins on one property: **line numbers stay true.** Every problem message this
ticket produces names a line, and a reader has to be able to jump to it. Deletion would shift
every line below the first label, so the number in the message would drift from the number in the
editor — by up to eight lines in files that carry eight overrides today.

## 4. The reader is a pure function in `src/lib/`, not logic inside `normalise.mjs`

`scripts/normalise.mjs` is the bridge to the WASM parser and cannot be unit-tested without it.
Every authored field that can be malformed already lives behind a pure reader in `src/lib/` —
`readSlack()`, `readWashingUp()` — each returning its value and its problem, each tested directly
and thoroughly, with `normalise.mjs` reduced to a call and a hand-off. This follows that:

```ts
// src/lib/step-labels.ts
export interface StepLabels {
  /** The source with every inline label line blanked to `--`. Same line count, always. */
  source: string;
  /** Label text by 0-based step index — the index normalise() already counts with. */
  labels: Map<number, string>;
  /** How many step blocks the scan found, for the cross-check against the parser. */
  stepCount: number;
  /** Everything wrong with how the labels were written. Each message names its line. */
  problems: string[];
  /** True when the file also carries `>> step.N:` lines. */
  usesNumbered: boolean;
}

export function readStepLabels(source: string): StepLabels;
```

**Fast path:** a source with no `>> step:` line returns `{ source, labels: empty, problems: [] }`
with the source object untouched and no scan performed. All 643 files that use the numbered form
take that path, so "nothing about the numbered form changes" is true by construction rather than
by test — the code that could change their behaviour does not run for them.

`normalise()` then reads:

```js
const { source: cleaned, labels, problems } = readStepLabels(source);
// …parse `cleaned` instead of `source`…
const labelOverride = labels.get(index) ?? metadata[`step.${index + 1}`] ?? null;
```

Two forms, one field. Nothing downstream can tell which was used, which is the first acceptance
criterion restated as an implementation property: `src/lib/tree.ts`, `src/lib/time.ts` and the
render are not touched.

## 5. What is an error, and why each one is worth failing over

The rule: **a label binds to the step on the very next line.** Seven ways to break it, each
failing with a message that names the line and says the fix.

| # | The file says | Why it fails rather than being dropped |
| --- | --- | --- |
| 1 | a label with nothing but the end of the file below it | Silently dropping it loses a label the author wrote. Required by the ticket. |
| 2 | a label with a blank line below it | It looks bound and is not. **This is the case `step.N` can never get wrong and the inline form must never get wrong quietly.** Required by the ticket. |
| 3 | two labels stacked | Same as 2 with a sharper message: the upper one has no step. |
| 4 | a label with only metadata below it | Same class; the next line is not a step. |
| 5 | a label *inside* a step block — step text directly above it | Measured (research §3, probe 3): cooklang **splits the step there**, so this does not merely mislabel, it changes the table's shape and shifts every step below. |
| 6 | an indented `  >> step:` line | Measured: cooklang does not treat it as metadata at all — the words fall into the step's own text and appear in the cell. Silent corruption, and the fix is one keystroke. |
| 7 | a label with nothing after the colon | `readWashingUp()` already refuses a line that is there and says nothing, for the same reason: an empty override would blank a cell. |
| 8 | both forms in one file | Required by the ticket: which one wins is not something a reader should have to work out. |

5 and 6 are beyond the ticket's three named failures. Both are justified the same way: each is a
measured silent-corruption path, each costs nothing today (0 files in the collection are indented
or multi-line), and this story exists precisely because the silent path is the expensive one.

Rejected: **warning instead of failing** for any of these. The washing-up cross-check warns
because a foil-lined tray is a real answer — the check is a guess about the world. Every rule
here is a fact about the file, and the repo's line is that a guess warns and a fact fails.

Rejected: **inferring intent** — binding a label across a blank line to the next step down,
because that is "obviously" what was meant. That is the `step.N` failure mode wearing a new hat:
a confident, plausible, incorrect page.

## 6. Problems travel the road `slack` and `washing-up` already built

`normalise()` returns `stepLabelProblems: string[]`. Then:

- **`parse-recipes.mjs`** throws on it, in the existing loop that already throws on
  `slackProblem` and `washingUpProblem` — one array added to the list. The build cannot produce a
  page from a file whose labels do not bind.
- **`check-recipes.mjs`** pushes them onto `problems`, so they print under `FAIL <path>` with the
  rest and the file exits 1. The path comes from the `FAIL` header, the line number from the
  message, which together satisfy *"a message naming the file and the line"*.

Message register, taken from `readSlack()` and `readWashingUp()`: lowercase, states what is wrong,
then the fix, then an example of a good line. Draft wording:

```
line 12: >> step: has nothing under it — an inline label names the step on the next line,
         so put it directly above one
line 12: >> step: has a blank line under it — the label binds to the step on the very next
         line, so delete the blank line
line 12: >> step: is inside a step — a metadata line in the middle of a step splits it in
         two, so move the label above the whole step
line 12: >> step: says nothing — write the label after the colon, e.g. >> step: soak 30 min
line 12: >> step: is indented — cooklang only reads >> at the start of a line, so the words
         would end up inside the step
this file uses both >> step: (line 12) and >> step.N: (line 8) — pick one; the inline form is
         the one to use
```

Nothing here needs a new field name, a new artefact, or a change to any consumer. The whole
ticket is: one pure reader, one call in `normalise()`, one `??` in front of an existing lookup,
one line in `parse-recipes.mjs`, one in `check-recipes.mjs`, and the documentation.

---

## What this design does not do

- **It does not touch the numbered form.** Not its counting of prose steps, not its precedence,
  not its deletion from `metadata`. The ticket forbids it and the fast path means the code cannot
  reach those files anyway.
- **It does not migrate anything.** No `.cook` file is edited. T-009-02 owns that.
- **It does not add a `>> step:` line to a real recipe**, which means the inline form ships with
  zero production users. The proof it works therefore has to come entirely from tests and from the
  before/after comparison on a copied file, which the plan treats as the main risk.
- **It does not change `raw_metadata` handling.** A stray `>> step:` never reaches the map, since
  the line is gone before the parser sees it, so `metadata` needs no new key to delete.
