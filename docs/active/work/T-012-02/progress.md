# T-012-02 — Progress

Nine steps in `plan.md`. All nine done. Three deviations, each recorded below with what it cost.

## Step by step

| Step | State | Note |
| --- | --- | --- |
| 0 — baseline `npm run verify` | done | passes, exit 0, 710 pages |
| 1 — vocabulary tables | done | **residue driven to 0 of 1,081 names**, in two passes |
| 2 — §1 plant count | done | 147 machine candidates → 47 hand-checked |
| 3 — §2 pulse count | done | 72 loose → 29 gate 1 → **19 files, 14 dishes** |
| 4 — §5 multi-cook count | done | 200 raw lanes → **34 filtered**; two defects found and fixed |
| 5 — §3 the three queries | done | persona one returns **2**; deviation A |
| 6 — §4 the week | done | week done by hand **and** a computed ceiling; deviation B |
| 7 — ranking and board conflicts | done | four ranked, five stories held against three cooks |
| 8 — write the reading | done | `docs/gaps/what-the-shelf-offers.md` |
| 9 — README pointer | done | one hunk, 21 insertions, nothing else touched |

## Deviations from the plan

### A — the assumed kitchen grew a second layer

**Planned:** staples.json's 31 plus a written fridge of perishables.

**Done:** staples plus a **cupboard** (19 patterns) plus a **fridge** (23 patterns).

**Why.** Staples-only returns 0 recipes, and so does staples-plus-fridge, because
`staples.json`'s doctrine is written for a *shopping list*: its own second clause says flour,
sugar, eggs, milk and rice are shopping. That is right for a list and wrong for a kitchen — a
person who cooks has flour. Publishing a 0 built on that would have been a number about the
doctrine dressed up as a number about the shelf.

**What it cost.** Nothing, and that is the interesting part: the answer with the fuller kitchen is
**2**, and the sensitivity run that adds tomatoes and potatoes still returns **2**. The assumption
was widened and the result did not move, which is what makes it a result about the collection.
Both layers are printed in full in the reading and in the script's output.

### B — the week got a computed ceiling as well as a hand-built week

**Planned:** a hand exercise informed by a protein/cuisine matrix.

**Done:** both. The hand week is seven named nights; alongside it the script computes the
**maximum matching** between proteins and counters, which is the longest streak that exists.

**Why.** "Can it be done?" answered by hand gives *yes*. It does not give *how much slack there
was*, and "what runs out first" is a question about the ceiling. The matching answers both exactly:
**11 nights**, proteins binding rather than counters.

**What it cost.** One extra function. It also exposed a defect — see below.

### C — the script grew two corrections mid-flight, both from hand-checking

Neither was planned and both changed a published number.

**1. Lane hands-on minutes were over-counted.** The first filter summed `task.minutes` for tasks
labelled `hands-on`. `schedule.ts` labels a whole step hands-on when *any* timer in it is —
cautious and right for a label, wrong for arithmetic — so a 128-minute step that is 8 minutes of
work and 120 minutes of proving read as a two-hour hand-off branch. Caught by `bbq-tofu-bowl`
appearing in the results with `handsOnMinutes = 3`. Fixed by importing `readTimers` and splitting
timer by timer, the way `buildSchedule` splits its own totals. **The count moved 35 → 34.**

**2. Stock and sauce were being read as the protein of a dish.** `chicken stock` made
`risotto-alla-milanese` a chicken dinner; `fish sauce` made every Vietnamese recipe a fish one;
`egg noodles` made `tuna-noodle-casserole` an egg dinner. Caught by reading the matching's example
slugs rather than trusting the totals. Fixed with an exclusion list (`stock`, `broth`, `sauce`,
`fat`, `powder`, `noodles`, `pasta`, `wrappers`, `bones`, `marrow`, …). **The per-protein reach
numbers moved substantially** — fish went from 9 counters to 5, dairy from 4 to 1 — and the
eleven-night ceiling did not, which is why the ceiling is quoted with the reach table beside it.

## Verification done

**Step 1 — residue.** The script prints every ingredient name no rule matched. First run: 6
unmatched (`raspberry jam`, `apricot jam`, `sweet italian sausages`, and the three non-food
skewer/wood names `docs/gaps/README.md` already records). Rules added. **Second run: 0 of 1,081.**
That is what licenses the distinct-plant count as a count rather than a sample.

**Step 2 — the hand check.** 147 candidates read, 100 dropped, 2 added. The drop classes and the
two additions are enumerated in the reading. The correction is 68% of the pool, which is larger
than `plan.md`'s "revisit the rule if it exceeds a third" trigger — **so the rule was revisited**,
and the finding is that both machine tests are doing what they were designed to do: they find
*recipes containing a plant prominently*, and "built on" is a narrower thing that no rule
available here separates. The rules are kept as a **candidate generator** and the reading says so
explicitly, publishes both numbers, and names every drop class. That is the honest resolution;
tuning the rule until the machine number matched the hand number would have been fitting a rule to
an answer.

**Step 4 — three hand-walks against the tables**, as planned:

- `mole-poblano` — expected multi-branch. Confirmed: critical path is soak → blend → simmer, and
  two independent branches (char, 10 min; fry and toast, 9 min) run beside the 21-minute soak.
- `beef-with-broccoli` — expected single. Confirmed: the second lane holds 1 minute of hands-on
  work and is filtered out. Nobody hands over a one-minute job.
- `charred-broccoli` — expected **false positive under the raw count**, and it is the ticket's own
  example file. Confirmed: two raw lanes, the second being `stir the lemon-garlic oil`, untimed,
  zero minutes. Filtered out.

**Step 5 — spot checks.** Both returned slugs read against their `.cook` files. `horlicks` and
`hong-kong-egg-sandwich` are genuinely coverable. The near-miss list was read for a false negative
and none was found — every one is a drink or a sandwich, which is itself reported.

**Step 6 — every night verified.** All seven slugs read for `>> counters:` and `>> servings:`.
Four of the seven carry One Pot, which the reading states rather than hides.

**Steps 8–9 — the mechanical checks.**

- `grep -c '## What it has' docs/gaps/what-the-shelf-offers.md` → **0**.
- `node scripts/menu-sections.mjs` reports the same three counters needing a look as before (One
  Pot, Cha Chaan Teng, The Air Fryer & the Pot — all pre-existing, the third from S-008). The new
  file is not named in its output.
- `git diff --stat docs/gaps/README.md` → **1 file changed, 21 insertions(+)**. No deletions, so
  no existing line was altered; `## Build state` is untouched.

**`npm run verify`** run before and after.

## Nothing on the board was edited

`git status --porcelain` shows no ticket and no story file modified by this attempt. The five
conflicts found are recommendations inside `docs/gaps/what-the-shelf-offers.md`, each naming the
ticket it concerns.

## Commits

Through `lisa commit-ticket` with exact `--include` paths:

1. the reading and the script that produces it, plus its output
2. the `docs/gaps/README.md` pointer
