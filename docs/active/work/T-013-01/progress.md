# T-013-01 — Progress

One file written, one commit. All seven plan steps done, with two deviations recorded below.

---

## Steps

| # | Step | State |
| --- | --- | --- |
| 1 | Opening, contents table, *what an occasion is not* | done |
| 2 | §1 — the selling rule, four kinds of evidence, the rejections, the second gate | done |
| 3 | §2 — the three axes | done |
| 4 | §3 — the profile, both corners worked, the inversion, the missing fields | done |
| 5 | §4 — the namespace, argued both ways and decided | done |
| 6 | Sources · What could not be verified · What this file does not do | done |
| 7 | `npm run verify`, then `lisa commit-ticket` | done |

## Deviations from the plan

**1. The file is 563 lines, not the ~330 the structure budgeted.** The overrun is entirely in
tables: §1's evidence table carries four columns rather than two (*what it proves* and *what it
cannot* are separate, because the whole argument is that the four kinds fail differently), and §3
carries five tables rather than three, because both corners are worked in full and the inversion is
shown in its own. `counters.md`, the model, is 1160 lines. The ~200-line guidance is for phase
artifacts, not for the deliverable. Nothing was padded; the *what could not be verified* section is
long for the same reason `counters.md`'s is.

**2. The snow day was expected to be the rejection and it passed.** The plan assumed the selling
rule would exclude *type of day* directly. It does not — restaurants print snow-day specials and
pizzerias sell take-home kits called that. Rather than bend the evidence, the file gained a second
gate (§1's closing subsection): *is it real* and *is it ours* are different questions, and the snow
day passes the first and fails the second. This is a better argument than the planned one and it is
recorded in `design.md` §3 as a decision rather than as a patch.

## What the numbers came from

Every figure in §3 was produced by `costOf(recipe, 12, buildSchedule(recipe))` over the seventeen
slugs in `research.md` §7, run under `vitest` against the built collection through a throwaway probe
file. **The probe was deleted before the commit** and is not part of the deliverable; the recipe for
reproducing it is in `plan.md`. Coverage counts came from the same pass over all 685 entries in
`src/generated/recipes.json` (which is git-ignored and rebuilt by `npm run recipes`).

The two profile scores are plain arithmetic over the rates printed in §3.3 and §3.4, so a reviewer
can redo any row by hand from the table above it. Spot-check: `chili-con-carne` under the family
profile is `0 + 0 + (1 × 5) + (4 × −20) + (−20) = −95`.

## Verification run

```
npm run verify
  → 16 test files, 1104 tests passed
  → 710 pages built
  → 0 parser warnings, 0 errors
git status --porcelain   (tracked)  → empty
```

The change cannot affect the build — nothing reads `docs/knowledge/` — and running it proves that
rather than assuming it.

## Checks done by hand

- **Links.** Eight relative links out of the file, all resolve: `counters.md`, `scaling.md`,
  `cooks.md`, `voice.md`, `../active/stories/S-010-…`, `../active/stories/S-013-…`,
  `../active/tickets/T-012-02-…`, `../active/tickets/T-013-02-…`. Three in-page anchors match their
  headings. One anchor into `counters.md` (`#the-air-fryer--the-pot`) matches that file's own
  contents table.
- **Fields.** Every field named in §3.1 was checked against its module: `handsOnMinutes`,
  `assumedHandsOnMinutes`, `handsOnEvidence()`, `longestHandsOnMinutes`, `totalMinutes`,
  `untimedCount`, `lanes`, `criticalPath` in `src/lib/schedule.ts`; `slack` in `src/lib/slack.ts`;
  `washingUp.count` in `src/lib/washing-up.ts`; `keeps` in `src/lib/keeps.ts`; `capacity`, `costOf`,
  `Batches`, `Growth` in `src/lib/scaling.ts`. No field is described that the code does not have.
- **Register.** §3 and §4 read against `voice.md`'s three house tests. No *festive*, no
  *effortless*, no *crowd-pleaser*. No O(·) anywhere, per S-011's boundary — and none of this file
  reaches a page a cook reads.
- **Scope.** No `.cook` file touched, no `src/`, no `scripts/`, no `README.md`, no `docs/gaps/`, no
  JSON. One file created.

## Commit

```
lisa commit-ticket --ticket-id T-013-01 \
  --message "Settle what makes an occasion real" \
  --include docs/knowledge/occasions.md
```

Ordinary `git add` and `git commit` were not used for ticket work. Other threads' files on this
branch — `docs/gaps/filter.md`, `docs/active/work/T-012-02/`, the untracked story and ticket
files — were never passed to `--include`.
