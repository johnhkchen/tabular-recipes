# T-014-01 — Design

Four decisions, each against what Research found.

---

## D1. One new page, in the shape of the four existing non-counter readings

**Options.**

| | |
| --- | --- |
| **A. One new page under `docs/gaps/`** | The shape `soup-pot.md`, `filter.md`, `what-the-shelf-offers.md` and `two-that-invert.md` already established: a whole-shelf reading that is not a counter page and carries no `## What it has` block. |
| B. Fold everything into `docs/gaps/README.md` | The README is the index. Adding 200 lines of findings to it makes the thing people scan unscannable, and the ticket asks for a new page anyway. |
| C. One page per story | Seven pages of forty lines each. It reproduces exactly the per-folder blindness the consolidation exists to end — a cross-cutting finding has no page to live on. |

**Chose A.** The ticket names it; the precedent is four files deep; and the cross-cutting findings
in §3 of the ticket have nowhere to sit under B or C.

**Name: `docs/gaps/what-the-season-left.md`.** The directory's names are plain and sayable —
`filter`, `soup-pot`, `two-that-invert`, `what-the-shelf-offers`. *What the season left* is what a
reader would call it out loud, and it matches `what-the-shelf-offers.md`'s construction closely
enough to read as the same family without reading as its sequel.

**It carries no `## What it has` block.** Verified as a hard requirement, not a habit:
`scripts/menu-sections.mjs` matches a page to a counter by that block, and a new one would open a
counter by accident. The verification is the before/after diff T-013-03 established.

---

## D2. The T-010-03 finding goes above the bands, not in them

The ticket requires it *"carried at the top of the list rather than ranked among smaller items."*

**The reason it cannot be ranked is structural, not editorial.** The three bands sort by *can this
be fixed without an argument*. The 143-of-227 finding has no single fix at all — its largest cause
(112 of the 143) is that the index carries no way to say whether a recipe is dinner, which is a
new field, a new rule about what counts as dinner, and a decision about what a filter is for. Put
in *needs an argument* it sits below a stale sentence in a gap page, which is exactly the burial
the ticket forbids.

So: a `## The finding that is not in a band` section, first, with what it implies for S-010's
dials stated as consequences rather than as a proposal. Three consequences, each traceable:

1. The standing dial is the one S-010 shipped and it is not the axis that decides the verdicts —
   the 143 fail on *is it dinner*, *how many does it feed* and *is the figure a floor*, none of
   which any dial reads.
2. `handsOnEvidence()`'s trap rule fires only at `handsOnMinutes === 0`, so a single recognised
   timer switches it off. Only 35 of the 227 passes have every operation timed.
3. `~preheat` is invisible to `elapsedMinutes` on the dial with 96.5% coverage — the one nobody
   was auditing.

**Rejected:** giving it its own band. Four bands would make *every finding sits in exactly one of
the three bands* false, and the ticket is explicit about three.

---

## D3. Band boundaries, drawn against T-014-02's own bar rather than against intuition

T-014-02 will re-check this classification and push back anything that fails its three tests. A
finding I label mechanical that it pushes back costs it a session. So the boundary is drawn at
**T-014-02's bar, applied strictly**, and the tie-break is *push it out of mechanical*.

The bar, restated as a filter:

1. Two reasonable people make the same edit.
2. A command verifies it — stated here, per finding, or the finding is not in the band.
3. It moves no recipe between shelves, changes no declared number, rewrites no argument.

**Test 3 does most of the work and it is worth showing where it bites**, because several findings
are obviously right, one line, and still fail:

| finding | why it is not mechanical |
| --- | --- |
| `birista` declares `1 1/2 cups` and scales to the #2 party dish (T-013-03) | changing it changes a **declared number** |
| `lengua`'s `slack` carries a keeping fact (T-011-04) | changing it changes a **declared slack level's reason** |
| `batata-harra`'s capacity says *the pan*, its `washing-up` says *the frying pot* | which one is right is exactly the argument test 1 forbids |
| the pickles and slaws want one folder (`README.md` gap 1) | it changes 13 files' declared `category` and is ranked as a story's worth of work |
| `scaling.md` §2's `r ≥ m` claim is false in a corner (T-011-02) | it is a sentence **inside an argument**; the counterexample is certain, the rewrite is not |

**And where it does not bite.** Adding `'airfry'` to `UNATTENDED` looks like a behaviour change and
is not one: measured on a scratch copy of `HEAD`, all seven schedule figures for all 685 recipes are
**byte-identical** with and without it. That is a command, it is not in dispute, and it changes no
declared number. It is mechanical, and the same command is the verification.

---

## D4. The README is edited in place, in three specific blocks — and nothing else

`docs/gaps/README.md` is 456 lines of other stories' arguments. The ticket asks for two things
from it: the recorded-and-not-done list, and the five-gaps ranking.

**What gets touched:**

| block | what happens |
| --- | --- |
| `## Recorded and not done` | The six S-001 entries stay. A `### What the season left` sub-block is appended, holding the *needs an argument* and *needs food* bands, each with its source ticket, and pointing at the new page for the evidence. |
| `## Recorded and closed` | Gains the entries this read found already closed, each naming the ticket that closed it. |
| `## The five gaps to fill first` | Re-ranked, not ticked, the way T-007-05 re-ranked it when gap 5 closed. |
| A pointer to the new page | Alongside the `filter.md` and `what-the-shelf-offers.md` pointers, which is where a reader looks. |

**What does not get touched, and why it is a decision.** The `## Build state` block is stale — it
says 664 recipes and 894 tests against 685 and 1229 — and **this ticket does not fix it**, because
fixing anything is T-014-02's job and this ticket's last acceptance criterion forbids it. It is
recorded as a mechanical finding with its command instead. Same for the tally's carried-forward
columns and the `3 of 1074` aisle figure.

**Rejected:** rewriting the README's five gaps from scratch. Two of the five are S-001 findings
that no ticket this season touched, and re-deriving them would replace measured entries with
remembered ones — the exact failure the README's own tally paragraph apologises for.

---

## D5. The cross-cutting checks, and what counts as an answer

The ticket names three. Each needed a decision about what "re-run" means.

**The tag vocabulary.** T-001-18's own verification command is in `T-001-18/plan.md:113-124`: fold
accents, lowercase, strip non-alphanumerics, group, print the collisions. It printed `503` and `[]`.
Re-running *that exact normaliser* is the honest comparison, and it is what §"the number" reports.
A second, broader reading — plus singularisation, which `T-001-18/research.md:163` describes but the
verifier does not implement — is reported beside it because it is what the finding was actually
about. Both numbers, both stated as what they are.

**Cross-property contradictions.** Four properties, six pairwise checks, each written as a script
over `src/generated/recipes.json` and each reported by slug or as *none found*. The ticket accepts
*none found* as an answer provided the check is stated, so the checks are printed in full.

**Headline claims.** One claim per story, taken from the story's own bolded thesis, checked against
`dist/` rather than against the artifact that made it. Where a claim is about a migration that has
already run and left no baseline, the **observable residue** is what is checked and the artifact
says so rather than pretending to a before-and-after it cannot take.

---

## D6. What this page is not

Not a plan. Not a proposal. Not a ranking by importance — the ticket is explicit and the
ranking axis is cost and certainty, which puts a corrected sentence above a broken filter and
says so at the top so nobody reads the order as a priority list.

Not a re-derivation of the three earlier consolidations. Where a finding is already in
`docs/gaps/README.md` from T-001-18, T-002-09 or T-003-07, this page names it and moves on.
