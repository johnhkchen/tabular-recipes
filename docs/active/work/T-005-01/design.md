# T-005-01 · Design — the rule and the ruler

Two decisions: what `voice.md` says, and what number each cap gets. The second one is the
part with consequences, so it goes first.

---

## Part two first: choosing the five numbers

The ticket sets the test: *"A cap that cuts 90% of the collection is not a cap, it is a
rewrite; a cap only the 757-char outlier fails is decoration. The useful question is where the
distribution actually breaks."*

Three of the five fields have a break in the data. Two do not, and they fail in opposite
directions — one because it is already healthy, one because it is uniformly overwritten. Those
two need a stated rule rather than a percentile, so here is the rule used for all five:

> **A cap is set at the point where the field stops being one sentence.** Where the data shows
> that point, take it. Where the field is already below it everywhere, set the cap at the
> observed ceiling and call it a regression guard. Where the field is above it everywhere,
> the cap is the ceiling of what still reads, and `voice.md` carries the target.

### The five numbers

| Field | Cap | Over today | Files | Owning ticket |
| --- | ---: | ---: | ---: | --- |
| operation cell label | **70** | 0 of 3077 | 0 | none — protected |
| step body prose (override steps) | **150** | 551 of 2642 (21%) | 266 | T-005-06 |
| full-width prose row | **120** | 232 of 393 (59%) | 183 | T-005-05 |
| `>> slack:` reason | **200** | 304 of 397 (77%) | 304 | T-005-04 |
| ingredient `(note)` | **80** | 17 of 4553 (0.4%) | 13 | **nobody — see §5** |

None cuts 90%. None is decoration except by deliberate choice in one case, argued below.

---

### 1. Operation cell label — 70

**Chosen at the observed maximum, on purpose.**

n = 3077, mean 24.3, p95 46, p99 57, max 70. Nineteen cells (0.6%) sit between 60 and 70; none
above. The story protects this field by name and no ticket edits it, so a cap that flags
anything today creates work with no owner and blocks T-005-07's flip.

Options considered:

- **60** — flags 19 cells in 19 files. Rejected: the 19 are good cells
  (`egg wash, roll edges in sugar, slice 1/2 in, bake 350°F (175°C) 18 min`), the story says
  leave them alone, and nobody is assigned to shorten them.
- **70** — flags nothing. *Chosen.* It is a ratchet: the collection cannot get wordier here
  without the report saying so, and the number is the collection's own ceiling rather than an
  opinion.
- **80 or higher** — decoration. Rejected.

70 is defensible precisely because it is not a judgement: the field was measured, found
healthy, and pinned where it already is.

### 2. Step body prose — 150

**Chosen where the median body stops being one sentence.**

Share of bodies that are still a single sentence: 99% below 100, 78% at 100–124, 56% at
125–149, **26% at 150–174**, 16% at 175–199, 7% at 200–224, ~0% past 225. The majority flips
between the 125–149 band and the 150–174 band.

The corroborating measure: among bodies that already run to two or more sentences, the *first*
sentence — the mechanical one that names ingredients and the action — is p50 71, p75 102, p90
131 characters. A 150-character cap therefore leaves room for the machinery in nine cases out
of ten and cuts only the essay bolted after it.

- **120** — 792 steps in 335 files. Rejected: it starts cutting into first sentences (p90 131)
  and would force rewriting of the mechanical clause, which is not what T-005-06 is for.
- **150** — 551 steps in 266 files (21% of override steps, 40% of the collection's files).
  *Chosen.*
- **200** — 289 steps in 169 files. Rejected: at 200 only 7% of bodies are still one sentence,
  so the cap would ratify the essay rather than remove it.

This is unread text. The story is explicit that T-005-06 cuts rather than rewrites, and 150 is
the number that makes "cut back to the sentence that does the work" a mechanical instruction.

### 3. Full-width prose row — 120

**Chosen at the bottom of a genuine trough, in the only field that has one.**

25-char bins: `0-24:11 · 25-49:90 · 50-74:37 ‖ 75-99:13 · 100-124:11 ‖ 125-149:34 · 150-174:38 · …`

Two humps with a hollow between them. Below 74 the rows are prep directives (*preheat a baking
steel …*). Above 125 they are essays. The 24 rows in between are the good case — one sentence:

> *Assembly, not cooking. Everything is already hot, the bowl goes together in ninety seconds,
> and it is eaten immediately.* (120)

One-sentence share confirms the same edge: 99% below 100, 55% at 100–124, 15% at 125–149, 0%
past 200.

- **100** — 242 rows in 192 files. Rejected: cuts inside the trough, taking good rows like
  charred-broccoli's 124-character opener with it.
- **120** — 232 rows in 183 files. *Chosen.* The last round number before the essay hump
  resumes at 125, and it keeps every row in the trough that reads as one sentence.
- **150** — 196 rows in 172 files. Rejected: 150 sits on the essay hump's flank; only 15% of
  rows at 125–149 are still one sentence.

120 also independently reproduces the story's own scope figure for T-005-05 — *"Recipes
carrying a prose row over 120 chars: 183"* — so the downstream ticket is not silently resized.

Weight worth stating: this row renders three times per page. A 120-character cap is a
360-character budget.

### 4. `>> slack:` reason — 200

**The hard one. There is no trough, so the cap is argued, not read off.**

The field is a plateau: 257 of 397 reasons (65%) sit in the 75-character band 225–299. Below
225, 140 reasons spread thinly over 133 characters. That is a field written to a length.
Every candidate cap in the readable range therefore cuts most of the collection, and the
ticket's 90% line is the binding constraint.

| Cap | Over | Share | Verdict |
| ---: | ---: | ---: | --- |
| 125 | 373 | 94% | Where two-clause majority is lost (62% → 38%). **Over the ticket's 90% line — a rewrite, not a cap.** |
| 150 | 362 | 91% | Still over the line. |
| 180 | 343 | 86% | Legal, but ~40 files more than the story budgeted and no data event at 180. |
| **200** | **304** | **77%** | *Chosen.* |
| 225 | 268 | 66% | The plateau's own shoulder — but it ratifies lines that are demonstrably overwritten. |

Why 200:

1. **It is the last point still inside the sparse region.** The population changes shape at
   225; 200 sits below the shoulder, so the cap governs the plateau rather than sitting on it.
2. **It matches the story's stated scope.** The story sizes T-005-04 at *"333 of 397 over 200
   characters"*; measured on the rendered reason that is 304, on the whole `>> slack:` value
   330. Choosing 200 keeps the downstream ticket the size it was planned at.
3. **It clears the ticket's 90% rule** with room, where 150 and 125 do not.
4. **Read against the text, 200 is the ceiling and not the aim.** A 200-character reason is
   already two full thoughts joined by a semicolon:

   > *five minutes a side and it is turned once, because a cake flipped early falls apart and
   > one pressed down goes dense; the batter rests an hour and can rest longer, so the whole
   > window is at the griddle* (200)

   whereas the 120-character band is one:

   > *al dente is the last thing to happen and it does not wait; overshoot it and you have
   > porridge, which is a different dish* (120)

**So the aim and the ceiling are separated, and this is the one field where they differ.**
`voice.md` tells a writer to aim at about 120 characters — one sentence, one breath, the
title of T-005-04. `check-recipes.mjs` fails only past 200. A checker cannot enforce good
prose; it can stop the worst of it, and the document does the rest.

The cap governs `slack.reason`, not the whole `>> slack:` line, because `Timeline.astro:315`
renders `<b>{word}</b> — {reason}` and the level is a chip. A writer counting their own line
should subtract the level word and the dash: 200 on the reason is about 211 as written.

### 5. Ingredient `(note)` — 80, and it has no owner

n = 4553, mean 12, p90 27, p95 38, p99 63, max 172. The note sits inside a table cell beside a
quantity and a name, so it is the most space-constrained field on the page.

- **60** — 54 notes in 39 files. Rejected: 60 cuts real ones (`3 1/2 Tbs Morton, or 1/3 cup
  Diamond Crystal; nothing iodised`, 61) that belong in the cell.
- **80** — 17 notes in 13 files. *Chosen.* It is 1.3× p99, above the 60–79 shoulder, and every
  note it flags is a paragraph rather than a note:

  > *naam bak hang; the sweet and the bitter kind together, about three to one, and the pairing
  > is the point — the bitter kind goes in small and always cooked through, never raw* (172)

- **130** — 6 notes in 6 files, sitting in the natural gap (nothing measures between 130 and
  169). Rejected as near-decoration; it would catch the two duplicated 172s and little else.
- **172** (observed max, zero failures) — rejected. That is the "only the outlier fails" case
  the ticket names, and it would freeze a field that is not healthy.

**The consequence has to be said plainly, because it lands on somebody else.** The story
assigns slack to T-005-04, rows to T-005-05, bodies to T-005-06, and protects operation
labels. Nothing owns ingredient notes. A cap of 80 therefore leaves 17 notes in 13 files that
no ticket is scheduled to fix, and T-005-07 cannot flip the checker to failing until they are.
The alternative — pinning the cap at 172 so the number never fires — buys a clean flip by
saying the field is fine when it is not. This design takes the flag and hands the scheduling
problem to a person; it is recorded again in `plan.md` and `review.md`, and the 13 files are
listed in the saved report so the fix is a read, not a search.

---

## Part one: what `voice.md` says

### Options for the shape of the document

- **A style manual by field, with rules and exceptions.** Rejected: the ticket asks for "a page
  somebody actually reads before writing a recipe, not a manual", and the failure mode is
  exactly a document nobody opens.
- **A worked-example walkthrough of one file.** Rejected on its own: it teaches the tonkotsu
  case and leaves the other 657 files to inference.
- **One distinction, then a table of the five fields, then two tests.** *Chosen.* It matches
  the ticket's own three-part outline, it is skimmable at a table, and the tonkotsu example
  goes inside it as the illustration of the distinction rather than as the structure.

### The load-bearing distinction

Everything follows from one sentence, so it is the first thing on the page:

> **A sentence about the dish is for the reader. A sentence about how the site works out its
> numbers is not.**

That is the line the story draws — *"None of that is about soup. It is the site explaining its
own inference to somebody holding a packet of dried lotus seeds."* It decides every field,
including the ones this ticket does not cap, and it is the test that survives being remembered
badly.

### The second distinction, from the story

Shelf talk — anything comparing this recipe to its shelf-mates — is a real observation in the
wrong room. It goes on the counter's menu, not the recipe page. This is decision 2 in the
story and T-005-03's whole brief, so `voice.md` records it rather than deciding it.

### What the five-field table has to do

Say what belongs in each field, and — more usefully, per the ticket — **what does not**. The
"does not" column is the one a writer actually uses, because every field in this collection has
drifted by accreting the same content the field above it already carried.

The tonkotsu file is the worked example: one fact (the pot cannot emulsify) appearing in
`slack:` at 241 characters, in `step.1:` at 128, and in the opening paragraph at 447. Showing
one fact at three lengths in one file makes the failure legible in a way per-field prose
cannot.

### The house tests

Two, both applicable by the writer without measuring anything:

1. **Would a friend say this at a kitchen table?** (the brand voice, made specific — no
   "inference", no "derived", no "the shortest stretches keep a sliver")
2. **Does this change how you cook it?** If not, it is either shelf talk (goes to the menu) or
   it is the site explaining itself (goes nowhere).

A third, mechanical: **say it once.** If a fact is already in the operation cell, it is not
also `slack:`.

Caps are recorded in `voice.md` as a table with a pointer to `check-recipes.mjs`, so the
document says the target and the script holds the number. One place to change it.

---

## Design of the report

**Reporting, not failing** — the trap in the ticket. Requirements the shape has to satisfy:

- ranked worst first, with a total;
- file, field, actual length, cap on every line;
- exits zero;
- flipping it to failing is one line, and that line is named;
- separable from the existing structural exit-1, which predates this ticket and must keep
  working;
- sensible when the checker is given a subset of paths.

**Chosen shape:** collect findings during the existing per-file loop, print one ranked block
after the per-file output, gate the exit code on a single named boolean.

- Rejected: a second script (`scripts/check-voice.mjs`). It would re-parse 658 files, and
  `npm run check` is already the gate the ticket names.
- Rejected: failing immediately per file. Ranking needs the whole collection first.
- Rejected: `--caps` opt-in flag. The acceptance criterion is that `npm run check` reports;
  an opt-in flag would leave the default output unchanged and the downstream tickets searching.

The flip is `const CAPS_FAIL_BUILD = false;` — a named constant beside the caps, with a comment
saying it is T-005-07's line. The exit becomes `process.exit(failed || (CAPS_FAIL_BUILD && overCap.length) ? 1 : 0)`,
so structural failures keep failing and caps do not, until one word changes.
