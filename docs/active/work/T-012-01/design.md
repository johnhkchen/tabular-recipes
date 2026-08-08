# T-012-01 — Design

One file, `docs/knowledge/cooks.md`. The decisions below are about its shape, not its prose.

---

## 1. The organising question: what is a section of this file *about*?

Three viable structures. All three can carry the same facts; they differ in what a later reader can
do with the page.

**A. One section per person, each self-contained.** Situation → contradiction → what they need to
know → which field answers it → what is missing for them. Three long sections, then a demonstration.

**B. One section per axis, three columns.** A table per question: *what decides dinner*, *what the
site can say*, *what it cannot*, with a column each for the three. Compact, comparative.

**C. Contradictions first as a short list, then the detail.** Lead the whole file with the three
contradictions on one screen, then expand each.

**Chosen: A, with C's opening.** The file opens with the three contradictions in a table — one
screen, because that is the part a later ticket actually holds a design against — then gives each
person a full section. Reasons, grounded in what Research found:

- The ticket's §2 says *"Lead each one with its contradiction"* and calls the second one *"the most
  useful sentence in the file."* A page whose first screen buries it under three prose paragraphs
  has failed that instruction on layout alone.
- B fails the ticket's §3: *"what they need to know before they commit to a dish, and which of it
  this site can already tell them"* is a per-person list with per-person field names. Forcing it
  into a shared grid would make the three look like three settings of one dial, which is precisely
  the flattening the story warns about — the second person's cost inverts the usual instinct, and a
  column in a comparison table hides an inversion.
- `counters.md` is A-shaped and it is the longest-lived argument in the repo: an opening claim, a
  contents table, then one self-contained section per thing, each stating *why it is one thing and
  not two*. The contents table at the top of `counters.md` is exactly C's opening. Following the
  house shape is free.

What is **not** per-person: the missing capabilities. Ticket §3 asks for one section naming what is
missing, and three of the four are missing for more than one person (the many-hands assumption
matters to all three, oppositely). Splitting them across the three sections would say the thing
three times and lose the fact that one assumption is a bug for two and a feature for the third.
**One shared section, after the three.**

---

## 2. Where the fields go: inside each person, not in a shared table

Ticket §3 wants, per person: what they need to know before committing, and which existing field
answers it, by name.

Rejected: a single 3-column matrix of field × person. It reads as coverage scoring, which invites
exactly the ranking §4 forbids, and it cannot express the answers that are *partial* — the clock
answers "how long am I standing there" for all three, but for the third person the number is
computed under an assumption that is true for them and false for the others. That is a sentence, not
a cell.

Chosen: a small per-person table with three columns — *What they need to know* · *What the site
says* · *How complete that is*. The third column is where honesty lives, and it is a phrase, not a
score. The `voice.md` house test applies: if a friend would not say it at a kitchen table, it does
not go in the cell.

**Fields are named exactly as the repo names them**, in backticks for the declared ones
(`>> slack:`, `>> washing-up:`, `>> servings:`, `>> counters:`, `>> pairs-with:`) and by their
computed name for the derived ones (`handsOnMinutes`, `totalMinutes`, `longestHandsOnMinutes`,
`untimedCount`, `assumedHandsOnMinutes`), because that is how `scaling.md` and `voice.md` refer to
them and how a later ticket will grep for them.

**`capacity` and `keeps` are named as designed-not-built**, with their ticket IDs. Research §3
confirms zero files carry either and `src/lib/scaling.ts` does not exist. Writing them as if they
answer something today would be the file's first lie, and the whole point of the page is to be the
thing later work is tested against.

---

## 3. How much to say about what would resolve each contradiction

The ticket asks, per contradiction: *"say what would resolve it and what would only look like it
does."* This sits one inch from designing, which §4 forbids. The line I am drawing:

**Allowed:** a statement of the *property* a resolution must have, phrased about the person.
*"Anything that resolves this has to make one cooking session end in two different dinners, not one
dinner twice."*

**Not allowed:** the mechanism. No field name that does not exist, no dial, no filter, no page. The
moment the sentence contains a proposed noun the file has started designing.

The *"only looks like it does"* half is where the value is and it is also the safest half, because it
is a refutation rather than a proposal: naming the plausible move that does not work costs a later
ticket nothing and saves it a story. Three of these are already available from the source without
inventing anything — the batch, more choice, and more hands.

---

## 4. The demonstration: which design, and how it is scored

Ticket §"Acceptance": take S-010's dials **or** S-011's capacity and show it passing or failing
against all three.

**Chosen: S-010's three dials.** Grounds:

- The dials are built (T-010-02 is at phase `review`), so the demonstration is against something
  real rather than against a plan. Capacity is at phase `plan` and its shape could still move; a
  demonstration that goes stale in a week is a worse artifact.
- The dials were argued entirely from one person — S-010's opening sentence is *"what can I cook
  when I have nothing left"* — so holding them against the other two is the test that has never been
  run, which makes it a real result and not a formality.
- They produce a genuinely mixed verdict. A demonstration where the answer is *pass, pass, pass* has
  demonstrated nothing about the method.

**Capacity gets one paragraph, not a second full pass.** Enough to say the method transfers and to
record the one thing the dials cannot answer for the third person, without doubling the section or
pre-judging a ticket in `plan`.

**The scoring is pass / fail / cannot say.** This is S-010's own three-answer vocabulary, borrowed
deliberately: the filter that refuses to hide a recipe it has no evidence for is judged by a page
that refuses to score a persona it has no evidence for. Where the source material does not say
enough to decide, the verdict is *cannot say*, marked as such — not a guess.

---

## 5. Assumptions: how they are marked

Two candidate mechanisms:

**A. Inline, in the sentence.** *"Assume, because the source does not say, that…"* Reads naturally,
scatters them.

**B. One numbered block, referenced from the body.** Collected, auditable, and a later ticket can
check them off as the person answers.

**Chosen: B, plus inline `(assumption)` markers where the body relies on one.** The story's
requirement is that the file *says* a detail is an assumption; the collection makes it possible to
ask the person the six questions in one sitting rather than re-reading the file for them. `voice.md`
does the same thing with its §"What changed, and when" — one place where the page reconciles itself
with reality.

The assumptions I expect to need, all from Research §2: how many days the fridge-clearing covers;
the household's size; whether anyone has a dietary restriction; the equipment in each kitchen; how
much of the holiday is the big meals; how long "a few days" is. **Every one of these is left as a
question, not filled in.** Where a section can be written without the answer, it is written without
it.

---

## 6. The index link — resolving two criteria that collide

Criterion 1 wants the file *"linked from wherever that folder is indexed."* The last criterion
allows only `docs/knowledge/cooks.md` and the work directory to change.

Research §1 establishes the facts: `docs/knowledge/` has no index. There is no
`docs/knowledge/README.md`. `README.md:15` names `counters.md` inside a prose sentence about
counters and names nothing else in the folder; its "How it fits together" table has no `docs/` row.
`voice.md` and `scaling.md`, the two knowledge files written by tickets, are linked from nowhere
outside `docs/active/`, and `git show --stat` confirms both landed as single-file commits.

Options:

**A. Add a `docs/knowledge/README.md` index and link all four files.** Satisfies criterion 1
generously. Violates the last criterion, and creates a second index convention in the repo on a
ticket whose entire scope is *write down who is cooking*.

**B. Add one line to `README.md`.** Smaller, still violates the last criterion, and puts a persona
page into a paragraph about how the site is arranged by counter, where it does not belong.

**C. Treat the criterion as vacuously satisfied and cross-link from inside the file.** The folder is
indexed nowhere, so there is nowhere to link from; `cooks.md` links to its three siblings the way
`voice.md` links to `docs/gaps/voice.md`, which is the folder's actual convention.

**Chosen: C.** The last criterion is unambiguous about scope and is the ticket's own guard against a
knowledge ticket touching the build; criterion 1 is conditional — *wherever that folder is indexed*
— and its condition is not met. Both prior knowledge files set the precedent. Review will record
this as a stated interpretation with the evidence, so a human can overrule it in one line if the
intent was a `README.md` edit after all.

---

## 7. Length and register

`voice.md` is 190 lines and `scaling.md` is 521. The RDSPI guidance for artifacts is ~200 lines;
`cooks.md` is not an artifact but the deliverable, and the ticket asks for three sections, a missing
list of four with what each would take, a per-person field table, a worked demonstration, and an
assumptions block. **Target 220–280 lines.** Longer than `voice.md` because it carries three
subjects; much shorter than `counters.md`, which is a vocabulary.

Register, from `voice.md`'s three house tests, applied to a knowledge page rather than a recipe:

1. *Would a friend say it at a kitchen table?* — no persona jargon. No "user", no "segment", no "job
   to be done", no "pain point". The people are "the one cooking for the day", and so on.
2. *Does it change how you cook it?* — here: does it change what a later ticket would build or
   refuse to build? A sentence that does neither is decoration.
3. *Say it once.* — the many-hands finding belongs in §"What is missing" and gets referred to, not
   restated, from the third person's section.

**No names, no photographs, no job titles**, per the story. The section headings are situations —
*Cooking for the day*, *The family rotation*, *Holiday guests* — which are the story's own words and
are already wayfinding rather than description.

---

## 8. What this file deliberately does not do

- It does not rank the four missing capabilities. T-012-02 does, from the shelf.
- It does not count the collection. The story's 103 / 101 / 59 / 23 / 18 measurement is quoted once,
  as the story's finding with the story cited, and is not re-measured — the shelf has moved to 685
  files under other stories and re-measuring here would produce a second number for T-012-02 to
  disagree with.
- It does not propose a field, a dial, a filter or a page.
- It does not invent a fourth person, and it says so, because the temptation is real: a reader who
  cooks alone on weeknights and hosts on weekends is two of these three, not a fourth.
