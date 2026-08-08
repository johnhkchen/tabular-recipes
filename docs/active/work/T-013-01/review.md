# T-013-01 — Review

**One file: `docs/knowledge/occasions.md`, 562 lines.** It settles what an occasion is, how you
establish that one is real, what makes a recipe a hall of famer *for* it, and whether an occasion
belongs in `>> counters:`. No counter opened, no property added, no recipe written, no code changed.

---

## What changed

| Path | Change | Lines |
| --- | --- | ---: |
| `docs/knowledge/occasions.md` | created | 562 |

Commit `f9559f4`, through `lisa commit-ticket` with a single `--include`. Nothing else in the
repository was touched. `git status --porcelain` shows no tracked file modified.

## Acceptance criteria, against evidence

| # | Criterion | Verdict |
| --- | --- | --- |
| 1 | Exists, in the shape of `counters.md`, linked where the folder is indexed | **Met, with one stated interpretation** — see below |
| 2 | The rule stated and applied, **four kinds** of selling evidence, **at least one** rejection | **Met.** Four kinds in §1's table, each with what it proves *and* what it cannot. Three rejections: moving day, in-laws for a week, a rustic Tuscan evening |
| 3 | Three axes each classed in or out, and *type of day* addresses the S-010 overlap | **Met.** §2. Time of year in; moment in life in on graded evidence; type of day out, naming S-010's three dials, `longestHandsOnMinutes`, and the cost of the decision in both directions |
| 4 | Hall-of-fame profile as a per-occasion weighting over named existing fields, **worked in full for both corners**, same machinery inverting | **Met.** §3.1 names eleven fields with their modules and coverage; §3.2 the shape; §3.3 and §3.4 both corners with gates, signed rates, arithmetic and rankings; §3.5 the inversion table |
| 5 | Missing fields named with what each would take, **no proposals beyond naming** | **Met.** §3.7, six rows. Each says what it would take and stops |
| 6 | Namespace argued both ways and decided; if a separate axis, the cost stated | **Met.** §4, five costs listed |
| 7 | Says what an occasion is **not** — theme, cuisine, mood, season with recipes attached | **Met.** All four, in the opening, before anything else |
| 8 | No counter, no property, no recipe, no code. Only the two paths | **Met.** One file created; the commit's `--stat` is one line |

**Criterion 1's interpretation.** The file asks to be *"linked where that folder is indexed"*, and
criterion 8 permits only `docs/knowledge/occasions.md` and the work directory. There is no
`docs/knowledge/README.md`; `README.md` names `counters.md` and `scaling.md` inside prose about
other things and names `voice.md` and `cooks.md` not at all. The folder's actual convention is
sibling cross-linking from the opening — `cooks.md:20-22` and `voice.md:189` both do it. This file
does the same, naming all four siblings and what each settled. **T-012-01 hit the identical conflict
and resolved it identically**, and its disposition passed; following the accepted precedent beat
inventing a second reading. If the intent was a `README.md` edit, that is one line and it needs a
criterion-8 amendment, not this ticket.

## Test coverage, and why there is none

**No unit tests were written, and that is the correct answer rather than a gap.** The deliverable is
a knowledge file. Nothing imports it, no checker parses it, and a test asserting a paragraph exists
is a test of the diff. `T-011-01` (`scaling.md`) and `T-012-01` (`cooks.md`) — the two closest
precedents, both knowledge files in the same folder — shipped the same way.

What stands in for tests, all run:

| Check | Result |
| --- | --- |
| `npm run verify` | **16 test files, 1104 tests passed, 710 pages built**, 0 parser warnings |
| Every relative link resolves | 8 of 8, plus 3 in-page anchors and 1 anchor into `counters.md` |
| Every field named exists in `src/lib/` | 11 of 11 checked against their modules |
| Every figure reproducible | Produced by `costOf(recipe, 12, buildSchedule(recipe))` over the 17 slugs in `research.md` §7 |
| Scores hand-checkable | The rates are printed above each table. `chili-con-carne`: `0 + 0 + (1×5) + (4×−20) + (−20) = −95` |

The figures came from a throwaway probe run under `vitest` against the built collection. **It was
deleted before the commit** and left nothing behind; `git status` is clean.

## The three findings a reviewer should read first

**1. The shape inverts, and the collection cannot feed it.** The same eleven fields with their signs
flipped move `gyoza` from 17th of 17 under the family-meal profile to 1st under the dumpling
party's, and the turkey from 2nd to 14th. That answers S-013's *anything that cannot express both is
not the system*. But nine of the seventeen score **identically** under the family profile, because
every field they would be separated on is absent — and `har-gow`, `siu-mai` and `xiao-long-bao`, the
three purest per-unit hand-labour dishes on the shelf, report zero hands-on minutes because their
shaping steps carry no timer. The shape is exonerated; the annotation is what fails.

**2. Positive-weight hands-on inverts the site's own error convention.** `schedule.ts` falls back to
hands-on when a step says nothing, and states why: *"where it errs it errs towards a busier evening,
which warns a tired cook rather than reassuring one."* That is safe only while hands-on is a **cost**.
Give it a positive weight and the same fallback rewards the recipe nobody annotated —
`green-beans` ranks **second in a dumpling party** on 13 unclaimed minutes out of 19.5. The file
carries the rule that follows: a profile weighting hands-on positively may score only
`handsOnMinutes − assumedHandsOnMinutes`, and must put `evidence: unknown` into cannot-say. Applied,
the party ranks 5 of 17 and says cannot-say to 12. **This is the most consequential thing in the
file and it was not anticipated by the ticket.**

**3. The namespace decision rests on a mechanical argument, not a taste one.** A counter's
membership is authored and stable; an occasion's is `profile(occasion)` over measured fields, so it
moves when a `keeps` line is written. A derived, moving membership cannot live in an authored,
static list without either freezing into a hand-curated list — the cookbook again — or changing
silently under the reader. Hence: separate axis, with five costs named.

## Corrections this file makes to things already written

- **There is no mooncake recipe.** The ticket says the collection carries three seasonal-board
  dishes — `pan-de-muerto`, mooncake, `hot-cross-buns`. `lotus-seed-paste` is the filling and names
  the word; no `.cook` file is a mooncake. Two of the three. Recorded in *What could not be
  verified*.
- **Pan de muerto's window is looser than the pure case wants** — on sale from mid-September, and at
  least one bakery bakes it year round. The argument holds on volume; the overstatement is not
  relied on.
- **The snow day passes the selling test.** The ticket's framing implies *type of day* would be
  excluded by the rule. It is not; it is excluded by a second gate. Recorded as a decision in
  `design.md` §3, not smuggled in.

## Open concerns

**1. One pass, not six.** `counters.md` rests on six independent readings of ~70 menus. This rests
on eight searches in one sitting, US-biased, towards sellers who publish online. The file says so at
length. **A second pass would strengthen §1 more than anything else here would.** It does not block:
every claim is attributed and the rejections are stated as *searched for and not found*, not as
*absent*.

**2. The weights are declared preferences, not measurements.** Twenty minutes for a day of keeping,
five for a thing in the sink. The file says this out loud twice, because the repo's cardinal rule is
about measurements and a weight is not one. **What does not move with the rates is the inversion**
(it comes from the signs) or the silence (it comes from the collection). A reviewer who dislikes a
rate should reorder the middle of a table, not the finding.

**3. The gate belongs to the plate, and this file can only say so.** `smoked-turkey-breast` is
`unforgiving` and is gated out of its own occasion, which is honest and useless — it is the
centrepiece. The right rule is *exactly one dish may be unforgiving, and everything else is timed
around it*, which is a fact about a meal. **T-013-02 owns it** and the file forward-declares it
rather than half-building it.

**4. `capacity` is machinery with no annotations.** T-011-02 landed the reader and cost function;
0 of 685 files declare one, so every scaling answer quoted here is the no-vessel branch. The
family-meal profile's *is twelve servings one pot or four loads* question is therefore unanswerable
today. T-011-03 is the ticket.

**5. Counts will drift, and are drifting now.** `keeps` 138, `slack` 416, `washing-up` 177,
hands-on-can-speak 269, all-four 43 — all at 685 files on 7 August 2026, with other threads
annotating on this branch as this was written. Each figure carries its date and population.

## Nothing needs human attention before this lands

No critical issues. The one judgement call — criterion 1's index link — is documented above with its
precedent, and is the same call a completed sibling ticket made.
