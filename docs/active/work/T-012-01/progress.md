# T-012-01 — Progress

## Steps

| # | Step | State |
| --: | --- | --- |
| 1 | Freeze the counts the file quotes | done |
| 2 | Opening and contradictions table | done |
| 3 | The three sections | done |
| 4 | §"What is missing" | done |
| 5 | The demonstration | done |
| 6 | Assumptions and scope sections | done |
| 7 | Read against the eight acceptance criteria | done — recorded in `review.md` |
| 8 | Commit | done — `05308ec` |

## Step 1 — counts, taken 7 August 2026

`find recipes -name '*.cook'` → **685**. `>> servings:` 685 · `>> slack:` 416 · `>> washing-up:`
177 · `>> pairs-with:` 434 · `>> kit:` 58 · `>> capacity:` **0** · `>> keeps:` **0**.
`src/data/staples.json` → **31** staples.

The zeros confirmed what Design §2 assumed: `capacity` and `keeps` are designed (T-011-02 and
T-011-04, both at phase `plan`) and not built, and `src/lib/scaling.ts` does not exist. The file
names both with their ticket IDs and marks them as not built.

The shelf measurement (103 / 101 / 59 / 23 / 18 at 658 files) is quoted as S-012's, cited to the
story, and deliberately not re-taken — Design §8.

## Steps 2–6 — the file

`docs/knowledge/cooks.md`, 326 lines. Sections in the order Structure specified:

1. Opening — thesis, what a persona is here, where the three came from, no fourth, sibling links.
2. The three, and what pulls in two directions — one-screen table, three columns, anchors into the
   sections below.
3. Cooking for the day · The family rotation · Holiday guests — each with the identical four-part
   shape: contradiction, situation, what would resolve it, what would only look like it does, then
   the *need to know* / *what the site says* / *how complete that is* table.
4. What is missing — four numbered entries, each with what it would take, explicitly unranked.
5. Holding a design against these — S-010's dials against all three, plus a paragraph on capacity.
6. What the three did not say — six questions.
7. What this file does not do — four scope statements.

## Deviations from the plan

**One, and it is length.** Design §7 targeted 220–280 lines; the file is 326. What ran over is the
three per-person tables — eight, seven and eight rows against the five or six I sketched — and the
`schedule.ts` entry, which carries two block quotes because the point is that the same file states
the assumption twice and treats it differently each time. Cutting rows would have meant dropping
questions the source material actually raises, and cutting the second quote would have weakened the
one finding the acceptance criteria name explicitly. `voice.md` is 190 lines and `scaling.md` is
521, so 326 sits inside the house range. No section was padded; nothing was cut to compensate.

**Nothing else moved.** The index-link question resolved exactly as Design §6 planned — the file
cross-links its three siblings and no file outside the ticket's scope was touched. Evidence and the
reasoning are restated in `review.md` so a reviewer can overrule it in one line.

## Checks run

- Six relative links resolve to existing files; four in-page anchors match their headings.
- One `#` heading; no trailing whitespace.
- `git status --short` — the only untracked/modified paths this ticket owns are
  `docs/knowledge/cooks.md` (now committed) and `docs/active/work/T-012-01/`, which is Lisa's to
  publish. `scripts/normalise.mjs` and `src/lib/tree.ts` are modified by another ticket on the
  shared branch and were not touched, staged or included.
- Every field name in the file checked against `README.md`, `src/lib/schedule.ts`, `src/lib/plan.ts`,
  `src/lib/shopping.ts`, `src/data/staples.json` and `src/pages/search.json.ts`.
- `npm run verify` deliberately not run — no code, no `.cook` file, no property. Plan §"Testing
  strategy" says why, and the branch carries other tickets' in-flight source changes, so a result
  from it would not be a result about this work.

## Commit

`05308ec` — *Write down who is actually cooking* — `docs/knowledge/cooks.md`, one file.
