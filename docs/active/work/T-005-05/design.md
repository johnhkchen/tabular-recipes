# T-005-05 · Design — the rows above and below

232 rows over cap in 183 files. The ticket has already made the editorial decision (*shelf talk
goes to the shelf, dish talk stays, short*), so what is left to design is **how the edit is made
safely** and **what the rules are for the three destinations**. Five questions, each with the
rejected alternatives.

---

## 1. How the edit reaches the files

### Rejected — edit 183 files by hand with Edit calls

183 files, 232 rows, two different edit sites per file (a metadata line or a body paragraph).
Every one is an opportunity to touch a neighbouring line. The acceptance criterion is *"Only
`.cook` prose rows and `src/data/counters.json` are modified. No component, no other metadata
line, no step body"* — a criterion that can only be checked after the fact by reading 232 diffs.

### Rejected — a shortening heuristic (first sentence, or truncate at the cap)

T-005-04 measured this exact idea on the neighbouring field and killed it: on 64 of 117
`forgiving` slack lines the first clause named no failure. The same is true here and worse. The
first sentence of `boston-baked-beans-slow-cooker` is the sentence T-005-03 already moved to the
menu; the first sentence of `fresh-egg-pasta`'s footer is the one real cooking instruction in the
file. A heuristic would keep the wrong half of both.

### Chosen — a hand-authored table of new row text, applied mechanically

Same split T-005-04 proved: **the judgement is human, the edit is mechanical.**

- `rows-after.tsv` — one row per over-cap prose row: `path`, `kind`, `stepIndex`, `source`,
  `disposition`, `new text`. Hand-written, 232 rows, diffable as prose without opening a `.cook`.
- `apply-rows.mjs` — validates every row against the current files **before writing anything**,
  then makes exactly one replacement per row.

The applier has no code path that can write anything but the identified row:

| Source | What it rewrites |
| --- | --- |
| `step.N line` | the single line matching `^>> step.<N>:` in the metadata block |
| `paragraph` | the single blank-line-delimited paragraph at step position N |

It aborts, writing nothing, on: a path outside `recipes/`, a row whose current rendered text does
not match what the TSV says it was (so a stale table cannot overwrite a moved target), a new text
over 120 rendered characters, a new text that would introduce `@`, `#` or `~` markup (which would
turn a prose row into an operation and move the tree), a duplicate `path+step`, a file whose step
count changes, and any file whose `>> step.N:` key set changes.

That last guard is what makes *"no other metadata line"* a property of the tool rather than a
claim about the diff.

### Why the rendered text is the key rather than a line number

`cleanLabel` is between the file and the page. Matching on *"the row currently renders as X"*
means the applier is reading the same string the checker measures, so a paragraph that has been
reflowed, or a `step.N` line whose whitespace differs, still resolves — and a row someone else
has already edited does not.

## 2. May a row be deleted?

The ticket gives three destinations and one of them is **Goes**. If every sentence in a row goes,
the row is empty. `tree.ts:131` pushes `''` in that case and the table renders an empty
full-width `<td>`. So *goes* has to mean the step is removed from the file, not emptied.

**And removing a step renumbers every step after it** (`normalise.mjs:116`), which silently
breaks every `>> step.N:` line below the deletion. Repairing them means editing metadata lines
that are not this row — which the last acceptance criterion forbids in as many words.

**Decision: a prose row is never deleted while a `>> step.N:` key numbered above it exists in the
file.** In practice that is nearly every file, because a file with a long prose row is a file that
was rescued with `step.N` lines.

The narrow exception is kept and used only if it arises: a trailing footer with no `step.N` key
after it can be removed without renumbering anything. Any row where deletion would have been the
honest answer but the numbering forbade it is **recorded as a finding**, not forced.

The practical consequence: **`headers.length` and `footers.length` are unchanged for every
recipe.** That is a stronger invariant than the ticket asks for and it is free to check — it goes
into the tree-identity proof alongside the column counts.

## 3. What each destination means, precisely

The ticket's test is *does this change what I do at the stove?* Applied sentence by sentence, it
resolves into four working rules.

**1 · Stays.** A verb, a number, a doneness cue, or a named failure with a moment attached. Cut to
the cap, keep the number. *"Six hours on low. Lid off for the last one or the top never sets."*

**2 · Moves to the counter menu.** The sentence's subject is *this shelf* or *the other way of
cooking this dish* — `slow beats pressure`, `the only one here that browns`, `hotter than a bhuna
below a vindaloo`. It goes to `counters.json` as a note of ≤120 characters, filed at the counter
where the comparison is true. Two constraints inherited from T-005-03: `balti` and `madras` sit at
two counters and only one of them makes their comparison true; the Instant Pot rows mirror the
slow-cooker rows dish for dish, and one comparison is written once, on the side it reads better.

**3 · Goes.** Three kinds, and the third is the ticket's *"more of them than expected"`:
- the site explaining its own inference (*"so both numbers are floors"*);
- provenance and etymology (*"Goa is a place where pork is eaten"*, *"this is why it tastes of a
  curry house rather than a chip shop"*);
- **justification of the recipe's existence to a reader who already clicked on it** — *"this is
  the dish it was ground for"*, *"until now nothing did"*. The single largest category.

**4 · Already said on the same page.** Checked against the `>> slack:` line T-005-04 has just
rewritten and against the operation cell labels. When a row and the slack line say the same
thing, **the row goes** — the ticket names this rule and the ticket is right, because `slack:` is
the field whose job it is and it has just been sharpened.

## 4. How the rows are written

Two mechanical rules, both forced by §1 of the research.

**No mid-sentence commas in a paragraph-sourced row.** `cleanLabel` deletes them
(`label.ts:15–16`), so a comma is a word-join the reader never sees. Every paragraph-sourced row
in the collection reads as a run-on today for this reason. Short sentences separated by full
stops survive intact; so do semicolons, colons and em dashes. This costs nothing and it is the
single biggest readability gain available inside this ticket's boundary.

**A `step.N`-sourced row may keep its commas**, because `labelOverride` skips `cleanLabel`
entirely. Recording the asymmetry rather than flattening it: forcing comma-free prose on the 124
`step.N` rows too would be a house style this ticket has no mandate to set.

**Aim ~90, cap 120.** `voice.md` says *one sentence* and the caps are the ceiling. A header that
carries a genuine two-part instruction may sit near 120; nothing needs to.

### Rejected — pushing every row to the `voice.md` aim by force

The aim for a full-width row is *one sentence*, which in this field is about 60–90 characters.
Forcing it would drop the second half of rows that legitimately carry two facts —
`new-england-boiled-dinner-slow-cooker` has *nothing is browned* **and** *you are home for the
last two hours*. T-005-04 hit the same wall and made the same call (its open concern 3). 120 is
the enforceable number and it is the one the checker holds.

## 5. Finding the rows that repeat the `slack:` line

### Rejected — read all 183 slack lines against all 232 rows by eye

392 pairings, most of them obviously unrelated. The failure mode is fatigue, and the criterion
asks for the recipes to be *named*, which means a miss is a defect.

### Chosen — a content-word overlap flag, then read the flagged ones

`slack-echo.mjs` scores each (row, slack reason) pair on shared content words — stopwords out,
stems compared — and prints every pair over a low threshold. A low threshold over-reports on
purpose; a net that catches too much is the right direction, exactly as T-005-04 said of its own
disposition heuristic. Each flagged pair is then read and judged by hand, and the judgement is
what goes in the artifact.

The output is checked in as `slack-echo.txt` so the count is reproducible rather than asserted.

## 6. Footers that are really unwritten cooking steps

The ticket asks for a list and forbids acting on it. Detection is by hand from the same reading
pass, against a stated test:

> A footer is really a step when it has an **imperative verb**, a **thing to do it to**, and
> either a **duration** or a **doneness cue** — and nothing in the table above it says so.

`fresh-egg-pasta` is the ticket's example and it passes all three: *toss*, *the pan of sauce*,
*half a minute*. The list carries file, the verb, and what makes it a step. **Nothing is
promoted**: the sentence is shortened in place and stays a footer, and the tree-identity proof in
§2 is what shows it.

## 7. Proving the tree did not move

Three artifacts, all generated, all diffed:

| Proof | Command | What it shows |
| --- | --- | --- |
| column distribution | `dump-rows.mjs cols` | per recipe: root column count, leaf count, header count, footer count, and every operation's `stepIndex:col:row:rowSpan` |
| structural pass | `npm run check` | `all 658 file(s) draw a table` — `findTilingErrors` over every file |
| the caps | `npm run check` | `prose row 232 → 0` |

`cols` is the strong one. It is not a column *histogram* — it is the whole tree, per recipe, in
one line each, so a `diff` names the recipe and the operation if anything moves. The ticket asks
for the distribution to be identical; this is that and more, and it costs one command.

Operation cell labels are inside that dump implicitly (a changed label cannot change a col/row)
but not literally, so `npm run check`'s `operation cell 0` count and T-005-06's own byte-identity
requirement are the backstop. This ticket does not edit a single operation label by construction:
§1's applier writes only `step.N` lines belonging to non-op steps, and only body paragraphs of
non-op steps.

## 8. Order of work

Shelf by shelf, largest first — `stews-and-braises` (70), `soups` (47),
`rice-beans-and-grains` (26), then the tail. One `lisa commit-ticket` per shelf group, so a
failure loses one shelf's judgement and not the ticket. `counters.json` is committed once, at the
end, with the full set of moved sentences, because a note that points at a section is easier to
review as one block than as nine fragments.
