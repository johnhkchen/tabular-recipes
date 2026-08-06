---
id: T-005-01
story: S-005
title: what-a-recipe-may-say
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Six tickets are about to cut words out of 658 recipes and four components. They need one rule to
cut against, or they will each invent their own and the site will end up with six voices instead
of two.

There is no style document in this repo. `docs/knowledge/` holds `counters.md` and
`rdspi-workflow.md` and nothing about words. Write the missing one, and give it teeth.

### Part one: the rule

`docs/knowledge/voice.md`. Short — a page somebody actually reads before writing a recipe, not a
manual. It has to answer, in plain terms:

- **Who is reading, and what they are holding.** The distinction that decides everything else:
  a sentence about the dish is for them; a sentence about how the site works out its numbers is
  not.
- **What each prose field is for.** There are five that carry words, and today at least three of
  them are being used for the same job:

  | Field | Where it lands | Today |
  | --- | --- | --- |
  | `>> step.N:` | the operation cell | mean 25 chars — **working** |
  | step body prose | nowhere (see T-005-06) | mean unread |
  | a step with no ingredients | full-width row above/below the table, **rendered 3×** | up to 757 chars |
  | `>> slack:` | under the timeline | 333 of 397 over 200 chars |
  | ingredient `(note)` | in the ingredient cell | mixed |

  Say what belongs in each and, more usefully, what does *not*. The tonkotsu file is the worked
  example: its `slack:`, its `step.1:` and its opening paragraph all say the same thing about
  the emulsion, in three lengths.
- **The house tests.** Two or three sentences a writer can apply themselves. The user-global
  brand voice already supplies the spirit — plain kitchen-table English, no jargon a friend
  would not say at a table — and this document is where it gets specific to a recipe.

### Part two: the ruler

Caps, in `scripts/check-recipes.mjs`, per field. The measured distributions are in the story;
pull them yourself with `node scripts/parse-recipes.mjs` and the generated JSON rather than
trusting the table.

**Choose the numbers from the data and say why in the work artifact.** A cap that cuts 90% of
the collection is not a cap, it is a rewrite; a cap only the 757-char outlier fails is
decoration. The useful question is where the distribution actually breaks — the shortest slack
lines run around 103 characters and read fine, the longest run 306 and do not.

### The trap

**A cap that fails the build on the day it lands blocks its own fix.** T-005-04 through
T-005-06 are the tickets that bring 658 files under the cap, and they each run `npm run verify`.
If the checker exits non-zero the moment this ticket ships, none of them can finish.

So the checker lands **reporting, not failing**: it prints every over-cap field with its file,
its length and the cap, and exits zero. T-005-07 flips it to failing once the collection is
clean. Leave the flip as a one-line change and say in the work artifact which line it is.

Print it as a ranked list — worst first, with a total — so the tickets downstream can work
straight off the output instead of re-deriving the list.

## Acceptance Criteria

- `docs/knowledge/voice.md` exists: who is reading, what each of the five prose fields is for,
  and what does not belong in any of them. It uses the tonkotsu file as a worked example of one
  fact said three times.
- Caps are defined per field in `scripts/check-recipes.mjs`, with the number for each chosen
  from the measured distribution and the reasoning recorded in the work artifact.
- `npm run check` reports every over-cap field — file, field, actual length, cap — ranked worst
  first with a total, and **exits zero**. It does not fail the build.
- The work artifact names the exact line that T-005-07 changes to make it fail, so flipping it
  is a one-line change and not an investigation.
- The report is run against the whole collection and its output is saved into the work directory,
  so T-005-04, T-005-05 and T-005-06 start from a list rather than a search.
- Operation cell labels are measured and confirmed healthy. If the data disagrees with the
  story's claim that they are fine, say so — that would change three tickets downstream.
- `npm run verify` passes.
- Only `docs/knowledge/voice.md` and `scripts/check-recipes.mjs` are modified. No recipe file and
  no component is touched by this ticket.
