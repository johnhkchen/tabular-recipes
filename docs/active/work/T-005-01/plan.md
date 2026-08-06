# T-005-01 · Plan

Five steps. Two produce source, one produces the report, two verify. Each source step is one
`lisa commit-ticket` call with exact `--include` paths.

---

## Step 1 — write `docs/knowledge/voice.md`

Create the file to the section order in `structure.md` §A.

**Content checklist** (each maps to an acceptance criterion):

- [ ] Who is reading, and what they are holding — the one distinction, stated first and short.
- [ ] Shelf talk goes to the counter's menu (story decision 2).
- [ ] A five-row table: `>> step.N:`, step body prose, a step with no ingredients,
      `>> slack:`, ingredient `(note)` — each with what it is for **and what does not go in it**.
- [ ] The two mechanics a writer cannot see from the file: a prose row renders three times; a
      `>> step.N:` line discards the step's own prose.
- [ ] The tonkotsu worked example, quoting `recipes/soups/tonkotsu-broth-instant-pot.cook` at
      all three lengths, one fact.
- [ ] Two or three house tests a writer can apply themselves.
- [ ] The caps table, pointing at `scripts/check-recipes.mjs` as the number's home.

**Voice constraints on the copy itself.** Plain kitchen-table English. No "inference",
"derive", "surface", "constraint", "field-level". The document is allowed to name the fields,
because its reader is holding a `.cook` file.

**Verification:** read it end to end once. It is prose; the only mechanical check is that every
quoted length and character count matches `research.md`, and that the tonkotsu quotes are
verbatim from the file.

**Commit:**
```
lisa commit-ticket --ticket-id T-005-01 \
  --message "Write down what a recipe may say" \
  --include docs/knowledge/voice.md
```

---

## Step 2 — add the caps and the report to `scripts/check-recipes.mjs`

Edit in the order of `structure.md` §B: header comment, `cleanLabel` import, `CAPS` +
`CAPS_FAIL_BUILD`, `overCap` array, `measure()`, the split of
`layout(buildTree(recipe))` into two lines, the `measure()` call inside the loop, the report
block, the exit expression.

**Non-negotiables:**

- Exits 0 today. `CAPS_FAIL_BUILD = false`.
- The pre-existing structural exit-1 keeps working and is unchanged in behaviour.
- Ranked by overage (`length - cap`), worst first, stable ties (path, then field).
- Every line carries file, field, actual length, cap.
- A total, and a per-field tally.
- The report block prints only when there is something to report, so a clean subset run looks
  exactly as it does today.

**Verification, in order:**

1. `npm run check` — exits 0, prints the report, `echo $?` is `0`.
2. `npm run check recipes/soups/tonkotsu-broth-instant-pot.cook` — a single-file run reports
   that file's fields only and exits 0. Confirms the subset path.
3. `npm run check recipes/cookies/*.cook` — a subset with no slack-heavy files still ranks
   correctly.
4. Counts cross-checked against `research.md`: the report's per-field tallies must read
   `operation cell 0 · step body 551 · prose row 232 · slack reason 304 · ingredient note 17`.
   **If any number disagrees, the checker's measure and the research measure disagree and the
   checker is wrong** — the research numbers came from `recipes.json`, the checker reads the
   same `normalise()`. This is the step's real test.
5. Temporarily set `CAPS_FAIL_BUILD = true`, run `npm run check`, confirm exit 1, set it back
   to `false`, confirm exit 0. Proves the flip is live and is one line. **The file is left with
   `false`.**

**Commit:**
```
lisa commit-ticket --ticket-id T-005-01 \
  --message "Measure how much a recipe says, and say so without failing" \
  --include scripts/check-recipes.mjs
```

---

## Step 3 — generate and save the report

```
npm run check > <work>/check-output.txt
```

then cut the cap block into `<work>/report.txt`, whole collection, worst first.

The report is the deliverable for three downstream tickets, so it has to stand alone: a header
naming the run, the ranked list, the per-field tally, the total. T-005-04 reads the
`slack reason` rows, T-005-05 the `prose row` rows, T-005-06 the `step body` rows. The
`ingredient note` rows belong to nobody yet — the report says so on its own line rather than
leaving them to be discovered.

**Verification:** `wc -l` the report; spot-check the top entry against the file it names
(`boston-baked-beans-slow-cooker.cook`, prose row, 730 against a cap of 120).

Work-directory artifacts are not committed with `lisa commit-ticket`; Lisa publishes them.

---

## Step 4 — `npm run verify`

```
npm run verify
```

= `check` → `recipes` → `vitest run` → `astro build`.

Expected: check exits 0 with the report, 658 recipes parse, the existing vitest suite passes
untouched, the site builds. Nothing in this ticket changes a library or a component, so any
test failure is a real regression and blocks.

Note `npm run recipes` rewrites `src/generated/recipes.json`. That file is a build artifact —
confirm with `git status` that it is ignored and that the working tree carries no ticket-owned
file left modified, staged or untracked.

---

## Step 5 — Review

`review.md` + `review-disposition.json`, then `lisa check-disposition T-005-01`.

`review.md` must carry, because the ticket asks for each by name:

- the two files changed;
- the five caps with the measurement each came from;
- **the exact file and line number of the `CAPS_FAIL_BUILD` declaration**, so T-005-07 is a
  one-line edit and not an investigation;
- where the report is saved and which ticket reads which rows;
- the operation-cell finding — measured 3077 cells, mean 24.3, max 70, **the story's "healthy,
  leave alone" claim confirmed**, so the three tickets that depend on it are unaffected;
- the open concern: **ingredient notes have no owning ticket.** 17 notes in 13 files are over
  the 80-character cap and T-005-07 cannot flip until somebody owns them.

---

## Testing strategy

**No new unit tests, and that is a decision rather than an omission.**

`scripts/` has no test file today — `src/lib/*.test.ts` covers the pure libraries
(`layout`, `slack`, `time`, `schedule`, `shopping`, `units`, `icons`, `collection`), and every
script in `scripts/` is a thin driver over them. `check-recipes.mjs` is not imported by
anything (`package.json`'s `check` script is its only caller), exports nothing, and adding a
vitest file for it would mean either restructuring it into a module — outside this ticket's
"only two files, no restructuring" boundary — or shelling out to it from a test, which just
re-runs step 2's verification more slowly.

What replaces a unit test is the **cross-check in step 2 verification item 4**: the checker's
per-field tallies are compared against numbers derived independently from
`src/generated/recipes.json`. Two paths to the same five numbers is the real assurance here,
and it covers the part that could silently be wrong — the measurement — rather than the part
that could not (the printing).

Gaps that remain, stated rather than hidden:

- The report's formatting is verified by reading it once, not by assertion.
- `measure()` has no test pinning the field-to-source mapping, so a later refactor of
  `tree.ts`'s header/footer rule could drift from the checker without anything catching it.
  Recorded in `review.md`.

## Rollback

Two files, two commits, no data migration, no generated output committed. Reverting either
commit restores the previous state exactly; `npm run check` returns to its 107-line form and
`voice.md` disappears. Nothing downstream depends on either until T-005-04 starts.

## Risks

| Risk | Handling |
| --- | --- |
| Checker fails the build on the day it lands, blocking T-005-04/05/06 | `CAPS_FAIL_BUILD = false`, verified twice: exit code checked in step 2, whole `verify` run in step 4 |
| Checker's measure disagrees with the research numbers | Step 2 item 4 compares all five tallies before the commit |
| A cap resizes a downstream ticket silently | 120 and 200 were chosen to reproduce the story's own scope figures (183 files, ~330 slack lines); `design.md` records where they came from |
| Ingredient notes have no owner | Flagged in the report, in `review.md`, and here. Not silently papered over with a cap of 172 |
