# T-014-01 — Review

Twenty-nine work directories read as one thing. **One new page, four localised edits to
`docs/gaps/README.md`, and no fix of any kind.** `npm run verify` exits 0 — 685 files draw a
table, 1,229 tests in 21 files, 710 pages build, 22 counters print 930 slugs.

Two things a reviewer should read before the diff:

- **§4.1**, the band boundary. Five findings that read as one-line fixes were pushed out of
  *mechanical* on purpose, and if a reviewer disagrees with any of them the change is one bullet.
- **§4.2**, a cross-cutting finding no single ticket could see and the one I am least sure how to
  band: the record cites forty-odd evidence files that were never published.

---

## 1. What changed

| file | change | commit |
| --- | --- | --- |
| `docs/gaps/what-the-season-left.md` | **new**, 589 lines | `f7bcb4e` |
| `docs/gaps/README.md` | +4 localised blocks | `2be0ede` |

Both through `lisa commit-ticket` with exact `--include` paths. The ordinary index was never used.
`git status --porcelain` leaves nothing of this ticket's staged, modified or untracked.

**Nothing else.** No `.cook`, no `src/`, no `scripts/`, no `src/data/*.json`, no
`docs/knowledge/`, no other page under `docs/gaps/`.

The README's four edits: a pointer to the new page beside the two existing non-counter readings;
a `### What the season left, S-007 to S-013` sub-block under *Recorded and not done* holding the
two undone bands; three entries added to *Recorded and closed*, each naming the ticket that closed
it; and the five-gaps ranking re-checked against the shelf.

---

## 2. Acceptance criteria, against evidence

| criterion | evidence |
| --- | --- |
| Every `T-007-*` through `T-013-*` directory read, listed with a one-line note, *nothing new* allowed | `## What each of the twenty-nine contributed` — five tables, 29 rows. Checked mechanically: looping the 29 basenames and grepping the page returns an empty not-named list. T-009-04's row says **nothing new on the migration**, which is the honest answer for a ticket that found 0 of 33 worth migrating |
| One new page under `docs/gaps/` with each finding's **source ticket** and band | `what-the-season-left.md`. 34 distinct ticket IDs cited; every band entry carries a `*Source:*` clause or names its ticket inline |
| Every finding in exactly one band; the mechanical band defensible, with a verifying command each | Three band sections, no finding in two. `grep -c '\*Verify:\*'` over the mechanical section → **13**, and `grep -c '\*Source:\*'` → **13**, one of each per finding |
| The T-010-03 filter finding carried **at the top**, not ranked among smaller items, with what it implies for S-010's dials | `## The finding that is not in a band` is the first section, with three numbered consequences. §4.3 below says why it is above the bands rather than in them |
| The tag-vocabulary count re-run, new number stated against the old | `## Does the tag vocabulary still hold` — **615 at 685 recipes against 503 at 514**, run with T-001-18's own verifier, quoted. Three collisions that verifier drove to zero are back |
| Cross-property contradictions checked, listed by slug or reported as none found, **with the check that was run** | `## Do the new properties agree with each other` — a six-row table, each row naming the check and its result. One real contradiction (`batata-harra`), by slug |
| Each of the seven stories' headline claims checked **against the built site**, saying which held | `## Did each story's headline claim survive` — seven rows, each with the `dist/` check and its output. Five held, two held with a stated caveat, none failed |
| `README.md`'s recorded-and-not-done list and five-gaps ranking updated; anything now closed removed with the ticket that closed it | Both. Three closures moved into *Recorded and closed*, each naming T-007-06 or T-008-05 |
| **No fix of any kind.** `git status --porcelain` over those paths empty | `git status --porcelain -- recipes/ src/ scripts/ src/data/` → **no output**, run after each commit |
| `npm run verify` passes | **exit 0**, captured from the command rather than from a pipeline |
| Only `docs/gaps/**` and `docs/active/work/T-014-01/**` modified | Two commits, two files, both under `docs/gaps/` |

---

## 3. Test coverage

**No test was added, and that is the answer rather than a gap.** This ticket writes two markdown
files. `src/lib/` is unchanged, so there is nothing new to unit-test, and a test asserting a
paragraph exists is a test of the diff. T-012-02, T-013-01 and T-013-03 — the three closest
precedents, all documents produced by reading the collection — shipped the same way and all three
dispositions passed.

What stands in for tests, all run:

| check | catches | result |
| --- | --- | --- |
| `npm run verify`, before and after | anything touched that should not have been | exit 0 both times, same numbers |
| `node scripts/menu-sections.mjs` diffed against the pre-edit baseline | **the new `docs/gaps/` page opening a counter by accident** | empty, after each commit. T-013-03's check |
| `grep -c '^## What it has'` on the new page | the same thing, at the source | 0 |
| `git status --porcelain` over the four forbidden path roots | a fix applied by accident | empty after each commit |
| every mechanical finding's own `*Verify:*` command | a finding that cannot actually be verified — which by the ticket's own rule is not mechanical | 13 of 13 stated and runnable; the `airfry` one was executed in full |
| every headline claim re-measured off `dist/` | a claim carried from an artifact rather than checked | 7 of 7 |
| every T-010-03 figure re-derived from `dist/search.json` | a stale headline | 227 · 42 · 416 and 269 / 661 / 177 reproduce exactly |

### The gap no check can close, and it is the important one

**A finding could have been missed.** Twenty-nine `review.md` plus twenty-nine `progress.md` is
about 10,700 lines and nothing here proves the read was exhaustive. Two mitigations, both
structural rather than empirical, and neither is coverage:

- Every artifact stores its deferrals under the same four headings — `## Open concerns`, the
  *Gaps* block under `## Test coverage`, a *judgement calls* block, and a named handoff section —
  so the search space is a heading rather than a document.
- The per-ticket table forces a row for each of the twenty-nine whether or not it had anything, so
  a thin row is a claim somebody can disagree with rather than a silence.

That is weaker than a test and it is said so here rather than dressed up. The most likely shape of
a miss is a finding recorded in a `design.md` or `structure.md` and never restated in the review —
those were read for the tickets whose reviews pointed into them, not for all twenty-nine.

---

## 4. The judgement calls a reviewer should check

### 4.1 Five findings were pushed out of *mechanical*, and each is one bullet to move back

T-014-02 is told to re-check this classification and push back anything failing its three tests. A
finding I mislabel mechanical costs it a session; a finding I mislabel *needs an argument* costs a
reader one extra read. So the tie-break throughout was **push it out**.

The five, with the test each failed:

| finding | test it failed |
| --- | --- |
| `birista` declares `1 1/2 cups` and scales into the #2 dumpling-party dish | changes a **declared number** |
| `lengua`'s `slack` reason carries a keeping fact | changes a **declared slack line** |
| `batata-harra`'s capacity says *the pan*, its washing-up says *the frying pot* | **two reasonable people would disagree** about which word is right |
| the pickles and slaws want one folder | changes 13 files' declared `category`, and is already gap 1 |
| `scaling.md` §2's `r ≥ m` is false in a corner | the counterexample is certain; the **rewrite of the argument** around it is not |

**If a reviewer disagrees with any of them, moving it is one bullet** and the evidence is already
on the page in the band above.

### 4.2 The cross-cutting finding I am least sure how to band

**Fifteen of the twenty-nine work directories cite evidence files that exist nowhere in the
repository**, and only two directories — `T-012-02` and `T-013-03` — contain any artifact beyond
the seven RDSPI files. The cases that matter are the ones where the missing file *is* an
acceptance criterion's evidence: `T-008-03/findings.md` (seven of eleven criteria, by its own
review's account), `T-009-04/naming-steps-proposal.md` (a whole criterion), `T-011-06/six-over-three.md`
(the verdict per recipe), and the five screenshots under `shots/`, which is an empty directory.

I put it in *needs an argument* because the remedy is a workflow decision — does Lisa publish the
attempt directory, or must a criterion's evidence be inlined into a phase artifact? — and neither
answer can be reached from this ticket. **A reviewer might reasonably say it is not a finding about
the collection at all and belongs somewhere other than a gap page.** It is recorded here rather
than dropped because T-008-05 §6.5 already changed how it wrote a page to work around it, which
makes it a thing the board is paying for.

### 4.3 The T-010-03 finding is above the bands rather than in one

The ticket requires it not be buried, and the bands sort by *is the fix in dispute*. Its largest
cause — 112 of 143 verdicts turning on *is this dinner* — has no single fix at all. Ranked among
*needs an argument* it would sit beside a naming question. So it gets its own section, first, with
three consequences and no proposal. **This makes the page's first section not a band, which is a
reading of *every finding sits in exactly one of the three bands* that a strict reviewer could
disagree with.** The alternative — a fourth band — would have made that criterion plainly false.

### 4.4 The ticket's own attribution is wrong, and the page says so

The ticket says *"T-002-09 folded 24 concepts spelled two ways across 51 files."* It was
**T-001-18**: its review, structure and progress all carry `527 → 503`, and `T-002-09` contains
none of those numbers. The finding is real and the count was re-run as asked; only the source
moves. Recorded on the page rather than silently corrected, because the page's whole value is that
a reader can go back to the evidence.

### 4.5 The five-gaps re-rank moves nothing, on purpose

Seven stories and 48 new recipes and **not one of the five closed or changed order**. Every one was
checked against the shelf rather than remembered — `buttercream`, `cream-cheese-frosting`, a shared
chile purée, a dark roux and a trinity base are all still absent; the thirteen pickle and slaw files
are still split. Gap 2 changed by getting bigger. A re-rank that moves nothing looks like a ticket
that did not do the work, which is why the section says what was checked and prints the commands.

---

## 5. Open concerns

1. **The page is 589 lines against a gap-page average of about 130.** `filter.md` is 424 and
   `two-that-invert.md` is 887, so it sits inside the range, but it is long. The section that
   would go first if a reader finds it so is `## What each of the twenty-nine contributed`, and it
   cannot go — it is an acceptance criterion.

2. **Thirteen mechanical findings is a large band for a ticket that was told to be strict.** The
   defence is that eleven of the thirteen are a sentence or a number in a document, and the two
   that touch code (`'airfry'` in `UNATTENDED`, a throw on `capacityProblem`) each carry a
   command whose passing output is *no change*. If T-014-02 pushes any back, that is the process
   working.

3. **Three findings sit in `docs/knowledge/`, which is neither `docs/gaps/**` nor obviously
   T-014-02's.** `occasions.md`'s three `0 capacities declared` sites, `scaling.md` §9's *"there is
   no air fryer recipe"*, and the `voice.md` under `docs/gaps/` that still teaches `>> step.N:`.
   T-014-02's acceptance criteria restrict what a fix may *do* and not where it may live, so I read
   them as in scope — but a reviewer who reads it the other way should say so, and they stay
   recorded either way.

4. **`npm run verify:mobile` was not run.** It is not a criterion here, it drives a browser, and
   this ticket adds no markup — `docs/gaps/**` is not built. T-014-02 and T-014-03 both name it and
   both are told to run it on a quiet tree.

5. **Every fraction on the page is dated 7 August 2026 against 685 recipes.** The structural
   findings — the sixteen split concepts, the 24 keeps splits, the twenty timer names — do not move
   when a recipe is added. The fractions do, and the page says so.

6. **The branch was quiet for this whole attempt**, which is the condition T-010-03, T-011-06 and
   T-007-02 all failed to get. Every number here was taken from one build and re-checked against
   the same build at Review; there is no concurrency caveat to record and that is worth stating
   plainly, because four earlier reviews had to record one.

---

## 6. What T-014-02 inherits

- **A band of thirteen, each with the command.** The `airfry` one is the only one whose
  verification was executed here in full, and its expected output is *an empty diff* — if it is ever
  non-empty, the finding is not mechanical and belongs in the band above.
- **Five findings already pushed out**, with the test each failed, so T-014-02 does not re-litigate
  them from scratch.
- **A `docs/gaps/README.md` whose *needs an argument* and *needs food* blocks already carry the
  four things its acceptance criteria require** — finding, evidence, source ticket, why it was not
  done — so its §4 is a check rather than a writing job.
- **A clean tree.** `git status --porcelain` over `recipes/`, `src/`, `scripts/` and `src/data/` is
  empty, so anything it finds there is its own.
