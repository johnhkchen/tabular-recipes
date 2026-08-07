# T-012-02 — Plan

Nine steps. Steps 1–6 produce numbers; step 7 writes the reading; steps 8–9 land it. Each step
says how it is verified, because a reading has no test suite and *verified* has to mean something
other than "it ran".

The commit units are three: the script, the reading, the pointer. Everything else in
`docs/active/work/T-012-02/` is a phase artifact Lisa publishes.

---

## Step 1 — Vocabulary tables

Write the five literal tables at the top of `docs/active/work/T-012-02/read-the-shelf.ts`:
`PLANTS`, `STARCHES`, `PULSES`, `NOT_PLANT`, `FRIDGE`, plus `GRAMS`.

Built by reading the full 1,081-name ingredient vocabulary rather than by guessing at patterns.

**Verified by:** the script prints every ingredient name it could not classify into *plant food /
herb / pulse-grain-nut / seasoning-or-process / animal / dairy-egg / composite / other*, with its
recipe count. **The residue must be inspected, not tolerated** — an unclassified name at count 6 is
a plant the count is about to miss. Iterate until the residue is only genuinely ambiguous or
genuinely irrelevant, and report its size in the reading.

**Not committed on its own.** Steps 1–6 are one script and land together.

---

## Step 2 — §1, the plant count

Compute:

- distinct plants by band (A plant food, B herbs, C pulses/grains/nuts), from the folded canonical
  names, not from raw strings;
- the non-starch subset of band A;
- built-on-a-plant candidates by both tests from design §3 (named, dominant), union;
- the sweets count, re-derived from categories rather than quoted from the ticket.

**Verified by:** hand-reading every candidate in the union and recording keep/drop with a reason.
The hand-checked number is the published one; the machine number is published beside it. If the
correction is larger than about a third of the pool, the *rule* is wrong and design §3 gets
revisited before the number is published — that is the deviation this step is most likely to hit.

**Cross-check:** every one of the 24 files in `vegetables-and-sides` is classified by the rule and
the result compared against the folder. Files the rule and the folder disagree about are named in
the reading. That is the ticket's `charred-broccoli` / `candied-yams` test, run in both directions.

---

## Step 3 — §2, the pulse count

Rebuild the ticket's 43 from `ingredientNames` so the starting number is this pass's own, then
apply gate 1 (main thing) and gate 2 (reads as dinner) from design §4.

**Verified by:** every file that survives gate 1 is listed with its gate-2 verdict and a reason. A
gate-2 drop with no reason is not a drop. Tofu-and-soy is computed as a separate figure and never
folded into the headline.

**Expected shape:** the ticket predicts *much smaller than 43*. If the answer comes out near 43,
that is a finding about the ticket's expectation and gets said plainly.

---

## Step 4 — §5, the multi-cook count

Run `buildSchedule` over all 685 records. For each: raw `lanes.length`, and the count of lanes
surviving the three conditions in design §5 (not the critical-path lane, ≥ `BREAK_MINUTES`
hands-on, overlapping a critical-path task in clock time).

**Verified by:**
- the two distributions printed side by side, so the size of the filter's correction is visible;
- three recipes hand-walked against their own tables to confirm the filter agrees with what a cook
  reading the page would say — one expected multi-branch (a roast with a separate sauce), one
  expected single-branch (a stir-fry), one expected false positive under the raw count (a recipe
  whose lanes are untimed prep);
- `untimedCount` reported alongside, because a recipe with no timers has no branches the filter can
  see and that is *cannot say*, not zero.

---

## Step 5 — §3, the three queries

**Persona one.** Write the assumed fridge as a literal table in the script. Query: servings ≤ 2 as
written; every ingredient either a staple (via the real `matchesStaple`) or in the fridge; not a
heavy starch by the starch list. Output slugs.

Then two sensitivity runs — staples only, and fridge plus two plausible additions — with the
answer size for each.

**Verified by:** the fridge printed in full before the slugs, in the script's output and in the
reading. Every returned slug spot-checked against its `.cook` file for an ingredient the fridge
does not actually cover. **A query that returns nothing is a publishable answer** and is not to be
loosened into returning something.

**Persona three.** Slugs from step 4, with the branch that would be handed over named for the
first few.

---

## Step 6 — §3, the week of dinners for four

Hand exercise, informed by the script's protein and cuisine matrix (which is machine-built from
tags, `counters` and category, and is evidence rather than the answer).

Seven dinners for four, no repeated protein, no repeated cuisine. Written night by night with the
slug and what it is doing there. Then: **what ran out first**, named exactly — a protein, a
cuisine, a servings ceiling, or the vegetable side to put beside it.

**Verified by:** every night is a real slug that serves four or scales to four, and the exercise
records where it had to bend a rule rather than quietly bending it. If seven nights cannot be done,
that is the finding and the artifact says at which night it broke.

---

## Step 7 — §4 and §5 of the ticket: the ranking, and the board conflicts

**Ranking.** Four capabilities, each with needs / stands-on / day-one / food-first, day-one counts
taken from steps 2–5 rather than estimated. Then the ordering, argued, with the veto from design §8
applied to whichever candidate it catches. Then the plain sentence on writing food first.

**Board conflicts.** Every open ticket on S-008, S-010, S-011, S-012, S-013, held against each of
the three cooks with `cooks.md`'s passes / fails / cannot-say. S-011 × T-011-06 written first and
at length, because it is the one where two personas sit inside one story pulling opposite ways.

**Verified by:** every conflict names the ticket it concerns and says what its author would have to
decide. Nothing on the board is edited — checked with `git status --porcelain` at the end of the
step, which must show no ticket and no story file.

---

## Step 8 — Write `docs/gaps/what-the-shelf-offers.md`

Assembled in the section order from `structure.md`. Every number carries where it came from.

**Verified by:**
- `grep -c '## What it has' docs/gaps/what-the-shelf-offers.md` → 0;
- `node scripts/menu-sections.mjs` (dry run) reports the same result it did before the file
  existed — twenty of twenty-one counters round-tripping, One Pot not, and no new file named;
- every acceptance criterion in the ticket mapped to a heading in the file.

**Commit:** `lisa commit-ticket --include docs/gaps/what-the-shelf-offers.md
docs/active/work/T-012-02/read-the-shelf.ts` — the reading and the measurement it rests on, in one
unit, because neither is reviewable without the other.

---

## Step 9 — The pointer in `docs/gaps/README.md`

One insertion at the end of `## The five gaps to fill first`, saying what the reading found and
what it decided.

**Verified by:** `git diff` over the file shows one hunk and no other line changed; the `## Build
state` paragraph is untouched.

**Commit:** `lisa commit-ticket --include docs/gaps/README.md`.

---

## Verification strategy overall

There are no unit tests to add — this ticket writes no code the repo keeps and no `.cook` file. So
verification is three things:

1. **`npm run verify` passes unchanged**, before and after. Nothing this ticket writes is read by
   the build except `docs/gaps/` via `menu-sections.mjs`, and step 8 checks that path directly.
   Run once at the start to establish the baseline and once at the end.
2. **Every published number is reproducible** by one command against a stated input, and the script
   that produces it ships beside the reading. A number in the reading that the script does not
   print is a defect.
3. **Every judgement call is a named rule with a rejected alternative**, and every hand-decided file
   is listed with its reason. Where a rule is arguable, the reading says which way the number moves
   if it is decided the other way.

## What would make this ticket block

- The plant rule's hand correction being so large that the machine tests are not evidence — the
  reading would then be asserting a number it cannot support, and design §3 needs redoing.
- `npm run verify` failing for a reason this ticket caused. Nothing here should be able to, which
  is why the baseline run happens first.

Neither is expected. If either lands, `review-disposition.json` blocks with the specific number or
the specific failure, not a summary.
