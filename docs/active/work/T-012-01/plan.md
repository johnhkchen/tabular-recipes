# T-012-01 — Plan

Eight steps. The deliverable is one prose file, so "tests" are checks a person or a command can run
against it; there is no unit test to write, and inventing one would be a test of the test.

---

## Step 1 — Freeze the numbers the file will quote

Re-take every count the file cites, in one pass, so no two sentences disagree and so the file can
say when it was measured. Other stories are adding recipes on this branch.

```sh
find recipes -name '*.cook' | wc -l
grep -rl '^>> slack:' recipes/ | wc -l
grep -rl '^>> washing-up:' recipes/ | wc -l
grep -rl '^>> pairs-with:' recipes/ | wc -l
grep -rl '^>> capacity:' recipes/ | wc -l     # expect 0
grep -rl '^>> keeps:' recipes/ | wc -l        # expect 0
```

Taken on 7 August 2026: 685 · 416 · 177 · 434 · 0 · 0, and 31 staples in `src/data/staples.json`.

**Verification:** the file states the date beside the counts, the way `docs/gaps/README.md` does.
The story's 103/101/59/23/18 shelf measurement is quoted as the story's, at 658 files, and is not
re-taken — Design §8.

Not committed on its own.

## Step 2 — Write the opening and the contents table

`# Cooks`, the thesis line, what a persona is here, where the three came from, the no-fourth
statement, the sibling links, and the one-screen contradictions table.

**Verification:** the three contradictions on the first screen; anchors in the table resolve to the
three headings below; no name, photograph or job title anywhere.

## Step 3 — Write the three sections

In order, each with the identical four-part internal shape from Structure: contradiction first,
then situation, then what would resolve it and what would only look like it does, then the
three-column table of what they need to know.

**Verification, per section:**

- The first paragraph is the contradiction, not the situation.
- Every factual clause traces to `S-012` or the ticket. Read both alongside and check clause by
  clause — this is the criterion most easily failed by a fluent sentence.
- Every field named exists and is spelled the way the repo spells it. Check each against
  `README.md` and `src/lib/`.
- `capacity` and `keeps` are marked as designed-not-built, with ticket IDs.
- Nothing in the "what would resolve it" paragraphs names a mechanism that does not exist.

## Step 4 — Write §"What is missing"

Four entries, each with what it would take. The `schedule.ts` entry carries the explicit finding.

**Verification:**

- All four of the ticket's items are present.
- The `schedule.ts` sentence says in one place that the same assumption is a bug for two people and
  a feature for the third, with both line references (`63-66`, `306-322`) checked against the file.
- No ranking, no ordering language ("first", "most important", "highest value"). The four are
  numbered for reference only and the section says so.
- No proposed field name, no proposed dial.

## Step 5 — Write the demonstration

S-010's dials against all three, as a verdict table plus prose, then one paragraph on S-011's
capacity, then the pass/fail rule.

**Verification:** three verdicts, each argued; at least one is not "passes"; the rule at the end is
usable without reading the rest of the file.

## Step 6 — Write §"What the three did not say" and §"What this file does not do"

The numbered assumptions as questions; the four closing statements of scope.

**Verification:** every `(assumption)` marker in the body has an entry here, and every entry here is
a real gap in the source rather than something the story does answer. Grep the body for
`(assumption)` and count both ways.

## Step 7 — Read the whole file against the eight acceptance criteria

One pass per criterion, with the criterion quoted and the evidence named. This is the record that
goes into `review.md`.

| # | Criterion | How it is checked |
| --: | --- | --- |
| 1 | exists, house shape, linked from wherever the folder is indexed | file present; shape compared to `voice.md`/`scaling.md`; index question resolved per Design §6 and recorded |
| 2 | situation + constraints, led by contradiction, no name/photo/title | read each section's first paragraph; grep for a name |
| 3 | every detail traces, every assumption marked, no fourth | clause-by-clause against S-012 and the ticket |
| 4 | per-person list of what they need to know, by field name | three tables present; every field name verified against the repo |
| 5 | what is missing, four items, what each would take, no proposals/ranking | read §"What is missing" |
| 6 | the `schedule.ts` finding stated explicitly | quote it |
| 7 | a design held against all three, demonstrated | read the demonstration |
| 8 | only `docs/knowledge/cooks.md` and the work directory changed | `git status --short` |

## Step 8 — Commit

One unit, one commit — the file is one argument and half of it is not reviewable.

```sh
lisa commit-ticket --ticket-id T-012-01 \
  --message "Write down who is actually cooking" \
  --include docs/knowledge/cooks.md
```

**Verification after:** `git status --short` shows no ticket-owned file staged, modified or
untracked. The attempt work directory is Lisa's to publish and is not passed to `--include`.

---

## Testing strategy

There is no code, so there is nothing to unit-test and nothing for `npm run verify` to catch. The
checks that do apply:

- **`git status --short`** — the only mechanical check of criterion 8, and the one that catches an
  accidental `README.md` edit.
- **Clause-tracing against the source** (step 3) — the substitute for a test, and the one that
  protects criterion 3. A persona file's failure mode is a plausible invented detail, and no command
  can catch that.
- **Field-name verification against `README.md` and `src/lib/`** — protects criterion 4. A named
  field that does not exist would make the file worse than silence, which is the same argument
  S-011 makes about a fabricated capacity.
- **`npm run verify` is deliberately not run.** It builds recipes and pages; this ticket changes
  neither, and a green build would be evidence of nothing. If it is red it is red for another
  ticket's reason on a shared branch, and claiming that as a result of this work would be a false
  report.

## Risks

- **Writing a design by accident.** The highest one. Mitigation: step 3's and step 4's explicit
  no-mechanism check, and Design §3's line between a property and a noun.
- **A fluent invented detail.** Mitigation: step 3's clause tracing, step 6's assumption ledger.
- **Numbers going stale under a shared branch.** Mitigation: step 1 dates the counts and the file
  says which story owns the shelf measurement.
- **The index-link criterion.** Resolved in Design §6, recorded in `review.md` with the evidence so
  a human can overrule it cheaply. Not a blocker: the ticket's own scope line is unambiguous.
