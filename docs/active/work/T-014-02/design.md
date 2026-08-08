# T-014-02 — Design

The decision this ticket is: **which of T-014-01's thirteen survive its three tests, and what shape
each surviving fix takes.** Everything else follows from that.

## D0 — How the three tests are read

The ticket's bar:

1. **The right answer is not in dispute.** Two reasonable people would make the same edit.
2. **A command verifies it.**
3. **It does not move a recipe between shelves, change a declared number, or rewrite an argument.**

Two readings had to be settled before the band could be re-checked, because eleven of the thirteen
edit prose and a strict reading of test 1 would reject all eleven.

**Test 1 is about the substance, not the sentence.** Every prose fix requires words nobody has
written yet, so if "would two people type the same characters" were the bar, only the four
code-and-slug fixes qualify and the ticket's own §2 — which expects *"stale sentences in gap pages"*
and *"a tag spelled two ways"* — would describe an empty band. What test 1 asks is whether the
**fact being asserted** is contested. `27 recipes` is not contested; `menuFor()` throws rather than
drops is not contested. So: a fix that replaces a false statement with a measured one passes; a fix
that requires choosing between two defensible states of the world does not.

**Test 3's "declared number" is the recipe property, not any number.** The acceptance criteria say
so in full: *"a declared time, servings, capacity, washing-up count or slack level"*. A count in a
document about the collection is a different thing, and §2 of the ticket names *"a count in a
document that the build now contradicts"* as an expected member of this band. So a stale figure in a
gap page is in scope and a `>> servings:` line is not.

Consequence for the tie-break: T-014-01 used *push it out of mechanical* because a wrongly-applied
fix costs a story and a wrongly-deferred one costs a read. **This ticket keeps that tie-break** — it
is the second opinion, not the appeal court, so where the two of us disagree in the direction of
caution, caution wins.

## D1 — The verdict on each of the thirteen

**Twelve applied, one pushed back.** The one pushed back is the largest of the thirteen.

| # | finding | verdict |
| --- | --- | --- |
| 1 | `one-pot.md` misses the fifth section | **apply** |
| 2 | `cha-chaan-teng.md` describes a removed mechanism | **apply** |
| 3 | `cha-chaan-teng.md:127` *"No source states a ratio"* | **apply** |
| 4 | `docs/gaps/voice.md` still teaches `>> step.N:` | **apply** — as a dated note |
| 5 | `scaling.md` says no air fryer recipe exists | **apply** — the false clause only, both sites |
| 6 | `docs/gaps/README.md`'s `## Build state` block | **push back** — fails test 1 |
| 7 | `3 of 1074` against `4/1086` | **apply** |
| 8 | `occasions.md`'s `0 capacities declared` ×3 | **apply** |
| 9 | `measure-pages.mjs:6` names a deleted slug | **apply** |
| 10 | the build's refusal list has an unwritten third member | **apply** |
| 11 | `air-fryer-and-pot.md`'s odd heading | **apply** — the rename only |
| 12 | `'airfry'` missing from `UNATTENDED` | **apply** |
| 13 | `parse-recipes.mjs` does not throw on `capacityProblem` | **apply** |

Three of the twelve carry a correction to the finding's own text. Those are stated here rather than
absorbed silently, because a verify command that cannot return its stated output is not a verify
command.

## D2 — The pushback: finding 6, the `Build state` block

**It fails test 1, and the ticket says that is a correct outcome.**

Three things, each on its own enough:

- **The file it names is wrong, and the reason it gave rests on that.** The finding says
  `README.md` and justifies itself with *"S-014 is the pass that publishes, and a stale front-door
  number is the first thing a reader meets."* The block is in **`docs/gaps/README.md`** — the index
  of the gap pages, which is not the front door and is not published. The root `README.md` carries
  no build figures at all. The justification does not survive the relocation.
- **The staleness is already disclosed, twice, on the same page.** The block's own line 37 says
  *"Measured after T-007-05, with the whole of S-007 in"*, and line 76 says *"the `Build state`
  figures above, which are S-007's, are stale by a good deal."* A dated measurement that says it is
  dated is not the same defect as a bare wrong number.
- **The current figures are already on the page**, forty lines below, correctly dated: lines 75-85
  print 685 recipes, timers 661, slack 416, washing-up 177, *"Measured on 7 August 2026"*. A refresh
  would duplicate them.

And the edit is genuinely two edits. Lines 37-40 are not figures — they are S-007's arithmetic
(*"658 at the start, minus the sixteen 老火湯 T-007-02 deleted, plus the eight T-007-03 wrote and the
fourteen from T-007-04"*), which is true of S-007 and false of today. So one reasonable person
refreshes the block and deletes that paragraph; another keeps the dated record intact because
deleting it loses the only place the story's arithmetic is written down. **Two reasonable people do
not make the same edit**, which is exactly what test 1 asks.

**Pushed back to *needs an argument*.** The decision it waits on is one sentence: *does a dated
measurement block get refreshed in place, or does a superseded one stay as the record it is?* That
answer applies to every dated block on the board — `voice.md` §5, `occasions.md`'s drift note,
`scaling.md`'s 664-recipe figures — so it is worth settling once rather than here.

## D3 — Three corrections to the band's own text

**Finding 5's verify needs two sites, not one.** The bullet names §9. Its verify is
`grep -c 'no air fryer recipe' docs/knowledge/scaling.md` → `0`, which also matches line 403 in §7.
Fixing §9 alone leaves the identical false clause forty lines above it and returns `1`. So the fix
takes both **clauses** and neither **block**: §7's illustration — its numbers, its pole, its worked
arithmetic — is untouched, because rewriting it is `README.md:464`'s *needs an argument* row.

**Finding 11's expected count is wrong by one.** `grep -l '^## What it could not stock' docs/gaps/*.md | wc -l`
is stated to go to 22 and is **already** 22, because the 22 are 21 counter pages **plus
`filter.md`**, which borrows the heading on purpose and is not a counter (`README.md:104-109`).
`soup-pot.md` is retired and uses a third wording. After the rename the answer is **23**. The
finding is unaffected; only its arithmetic is.

**Finding 6's file is `docs/gaps/README.md`, and so is finding 7's.** Both say `README.md`. Finding
7 is applied at the corrected location; finding 6 is pushed back for the reasons above.

## D4 — Shape of each applied fix, and what was rejected

The recurring choice is **repair in place** against **date and annotate**. Both are used, and the
rule between them is: *if the sentence is a claim about the present, repair it; if it is a
measurement with a date on it, annotate it.* Repairing a dated measurement destroys a record;
annotating a live claim leaves a reader to work out which half is true.

| # | shape chosen | rejected |
| --- | --- | --- |
| 1 | copy the fifth section out of `counters.json` verbatim | writing a new section title — the title is already decided and machine-read |
| 2 | repair in place: the count, the mechanism, the five status cells | annotating — the section describes code that no longer behaves that way, which a note cannot fix |
| 3 | repair in place, one bullet | rewriting `## The tea` — the ratio is one clause of one bullet |
| 4 | **annotate**: a dated note at the head of §5 | repairing the measurements — they are S-005's and correct as dated. The finding says so |
| 5 | repair the false clause, **annotate** what has not been done | rewriting §7 from `air-fryer-chicken-wings` — that is the next band |
| 7 | repair in place, one clause | re-deriving the whole bullet — only the coverage figure moved |
| 8 | repair three sites | rewriting §'s argument — *capacity is thinly annotated* survives 46 of 685 |
| 9 | replace with the slug the script itself reports as today's wordiest | picking a slug by hand — a hand-picked example is a choice and choices are disputable |
| 10 | one bullet, in the words of the two existing ones | describing the error message — the list is a list of shapes |
| 11 | rename the heading, nothing else | also re-deriving `README.md`'s 158 — see D5 |
| 12 | one word in `UNATTENDED` | reordering `readWords` — a behaviour change, and the finding is not |
| 13 | one member added to a list of five siblings | a new check — `readCapacity()` already produces the problem |

**Rejected across the board: batching.** Twelve edits verified once at the end cannot say which of
the twelve broke something; the ticket says so and T-010-03 is the evidence.

## D5 — The half of finding 11 that is not applied

The bullet's verify ends: *"the derived bullet count moves from 155 across 21 pages to 163 across 22
against the README's stated 158."* Renaming the heading is the fix. **Updating the 158 is not**, and
it is not done here:

`docs/gaps/README.md:126-130` states plainly that *Missing dishes* and *Missing components* are
**carried forward** and that *"nobody re-read twenty-one work lists for this pass and it would be
dishonest to print numbers as though somebody had."* The 158 is the same kind of number — 150
carried plus 8 new. Replacing it with a fresh derivation is a claim that the derivation is the right
way to count, which is precisely what that paragraph declines to assert. Recorded, not applied.

## D6 — Verification strategy

**One fix, one command, one recorded output, then the next.** Three tiers:

- **Per-fix command.** The finding's own `*Verify:*`, corrected where D3 says so.
- **The build, after every fix that can reach it.** `npm run verify`, exit code captured from the
  command and not from a pipeline — the failure mode that cost T-010-03 an afternoon and which
  T-014-03's ticket names.
- **Dump-and-diff for finding 12.** T-009-02's technique, which the acceptance criteria require for
  anything that could move an operation label or a clock figure. `src/lib/time.ts` is upstream of
  every schedule figure on the site, so it gets the same treatment a `.cook` edit would: dump
  `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`, `assumedHandsOnMinutes`, `untimedCount` and
  `longestHandsOnMinutes` for all 685 recipes before and after, and diff. **Expected output: empty.**
  A non-empty diff means the finding is not mechanical and it goes back to the band above.

**No `.cook` file is touched by any of the twelve**, so the per-recipe dump-and-diff has no other
call site. That is worth stating because the acceptance criterion is written as though one would be.

**`npm run verify:mobile` runs once, last, on a quiet tree**, with nothing else building. It cannot
be interleaved with the per-fix builds.

## D7 — Commit shape

Twelve fixes, **one `lisa commit-ticket` per fix**, exact `--include` paths, in the order of D8. No
ordinary `git add`, no `git commit`. The alternative — one commit per file — was rejected: three
files carry two fixes each, and a bisect that cannot separate them gives up the thing the
one-at-a-time rule buys.

## D8 — Order

Documents first, tools second, library last, so that a build-affecting change is never mixed with a
prose change in the same verification.

1. Finding 1 (`one-pot.md`) — the only prose fix with a machine-read consequence, so it goes first
   while the tree is untouched.
2. Findings 2, 3 (`cha-chaan-teng.md`), 4 (`voice.md`), 11 (`air-fryer-and-pot.md`) — gap pages.
3. Findings 5 (`scaling.md`), 8 (`occasions.md`) — knowledge pages.
4. Finding 7 (`docs/gaps/README.md`), and the finding-6 pushback row in the same file.
5. Finding 10 (root `README.md`), 9 (`measure-pages.mjs`).
6. Finding 13 (`parse-recipes.mjs`) — first change that can fail a build.
7. Finding 12 (`src/lib/time.ts`) — last, with the dump-and-diff either side of it.
8. §4 of the ticket: read the two undone bands in `docs/gaps/README.md` and add what is missing.
9. `npm run verify`, then `npm run verify:mobile` alone.

## D9 — What §4 of the ticket asks for, and how it is answered

*"Read the needs an argument and needs food bands and confirm each has enough in
`docs/gaps/README.md` for somebody to pick it up cold — the finding, the evidence, the ticket it
came from, and why it was not done. Add what is missing."*

The two tables at `docs/gaps/README.md:441-478` already carry three of the four columns
(finding · source · why it was not done). **Evidence is the one that is carried by reference**, in
the block's preamble: *"written up in what-the-season-left.md, which carries the evidence for every
line below."* Whether a pointer counts as evidence is the check to run row by row, not a conclusion
to assume. The pushed-back finding 6 gets a row in the same table, which is what *push it back*
means in a file rather than in a sentence.

**Nothing from either band is applied.** That is an acceptance criterion and it is also the whole
temperament of the ticket.
