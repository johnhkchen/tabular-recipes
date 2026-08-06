# T-005-01 · Progress

All five plan steps complete. Two commits, both through `lisa commit-ticket`.

| Step | State | Commit |
| --- | --- | --- |
| 1 · write `docs/knowledge/voice.md` | done | `937ca8a` Write down what a recipe may say |
| 2 · caps + report in `scripts/check-recipes.mjs` | done | `c1dd47e` Measure how much a recipe says, and say so without failing |
| 3 · save the report | done | `work/report.txt`, 2438 lines |
| 4 · `npm run verify` | done | exit 0 |
| 5 · review | done | `review.md`, `review-disposition.json` |

## Step 1 — `docs/knowledge/voice.md`

Written to the seven sections in `structure.md` §A. Every checklist item in `plan.md` step 1 is
present. The tonkotsu quotes are verbatim from
`recipes/soups/tonkotsu-broth-instant-pot.cook`; the three lengths quoted (472 / 250 / 132) are
the measured rendered lengths, not the raw line lengths.

## Step 2 — `scripts/check-recipes.mjs`

107 lines → 244. Everything that was there before is unchanged in behaviour.

Added, in the order `structure.md` §B set out:

- header comment extended to name the second job and point at `voice.md`;
- `import { cleanLabel } from '../src/lib/label.ts'`;
- `CAPS` (five numbers, each with the measurement it came from in a comment above it);
- `CAPS_FAIL_BUILD = false` with the comment naming T-005-07;
- `measure(rel, recipe, tree)`, module-scope and pure;
- `const overCap = []` beside `let failed = 0`;
- `layout(buildTree(recipe))` split into `const tree` / `const grid`, and one `measure()` call
  inside the loop, placed so a file that fails structurally is still measured;
- the ranked report block after the existing summary line;
- `process.exit(failed || (CAPS_FAIL_BUILD && overCap.length) ? 1 : 0)`.

### Deviation from the plan — one, and it matters

**`structure.md` scoped the `step body` field to steps that become operations. That was wrong,
and the checker measures the wider field.**

`src/lib/tree.ts:129` applies `step.labelOverride ?? cleanLabel(step.rawLabel)` on *both* sides
of the `isOpStep` branch. So a step with no ingredients that carries a `>> step.N:` line also
renders the override and discards its own paragraph — the same discard, in a different place.
That is 140 further steps in 109 files and 28,451 more characters nobody reads.

It was found while pulling the tonkotsu quotes for `voice.md`: the ticket names that file as
the worked example, and its step 1 is exactly this case — a 132-character override rendering as
the header row while the 472-character paragraph beneath it goes nowhere. The ticket's own
example does not fit the ticket's own field table.

Consequences, all carried through before the commit:

- the field is defined as "any step carrying a `>> step.N:` line";
- `research.md` §3 and §4 corrected: 2782 steps / 637 files / 278,833 characters, up from
  2642 / 637 / 250,382;
- the 150 cap was re-derived on the wider field and **held** — it is now the exact crossing
  point rather than near one. One-sentence share falls 51% (125–149) → 23% (150–174);
- `design.md` §2 updated: 656 steps over in 329 files, up from 551 in 266;
- `plan.md`'s expected tally updated from 551 to 656 before the checker was run against it.

No other deviation. The caps are the five numbers `design.md` chose.

### Verification performed

1. `npm run check` — exit 0, report printed. ✓
2. `npm run check recipes/soups/tonkotsu-broth-instant-pot.cook` — reports that file's six
   step bodies, one prose row and one slack reason, exit 0. ✓
3. **The cross-check, which was the real test.** The report's per-field tally reads
   `operation cell 0 · step body 656 · prose row 232 · slack reason 304 · ingredient note 17`.
   All five match the numbers derived independently from `src/generated/recipes.json` in
   `research.md`. Two paths, same five numbers. ✓
4. Flip proved live: `CAPS_FAIL_BUILD = true` → exit 1; back to `false` → exit 0. The file is
   committed with `false`. ✓
5. `npm run verify` — exit 0. `all 658 file(s) draw a table`, 658 recipes parsed, 9 test files
   and 832 tests passed, 682 pages built. ✓

One change made after the first run, before the commit: the per-field tally originally hid
fields with a count of zero, which suppressed `operation cell 0`. That line is a result the
ticket asks for by name, so every field is now listed even at zero.

## Step 3 — the report

`work/report.txt`, 2438 lines. Header names the run, the caps, where the reasoning lives, and
which ticket reads which lines. Then the ranked list — worst overage first — the per-field
tally and the total: **1209 fields over cap in 499 files, 92,947 characters over.**

Top entry cross-checked against the file it names:
`recipes/rice-beans-and-grains/boston-baked-beans-slow-cooker.cook`, prose row above the table,
730 against a cap of 120. That is the story's headline case, and it is printed three times per
page.

## Step 4 — verify

Green, as above. `src/generated/recipes.json` is gitignored and no ticket-owned file is left
staged, modified or untracked — `git status --short` shows only board files and Lisa's own
work directory.

## Open, carried into review

**Ingredient notes have no owning ticket.** 17 notes in 13 files are over the 80-character cap
and no ticket in S-005 is scheduled to fix them, so T-005-07 cannot flip `CAPS_FAIL_BUILD`
until somebody owns them. Flagged in the report header, and in `review.md` with the specific
recommendation.
