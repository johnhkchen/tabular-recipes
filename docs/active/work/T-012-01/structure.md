# T-012-01 — Structure

The blueprint for `docs/knowledge/cooks.md`. Section by section: what it contains, what it must not,
and where every fact in it comes from.

---

## Files

| Path | Change | Owner |
| --- | --- | --- |
| `docs/knowledge/cooks.md` | **created** | this ticket |
| `docs/active/work/T-012-01/*.md` | created by Lisa from the attempt directory | this ticket |

Nothing else. No `src/`, no `recipes/`, no `scripts/`, no `README.md`, no `src/data/*.json`. Design
§6 records why the index link is not a `README.md` edit.

`npm run verify` is not affected — no code, no `.cook` file, no property. The build does not read
`docs/knowledge/`, and `scripts/menu-sections.mjs` reads `docs/gaps/`, not this folder.

---

## The document

Target 220–280 lines. Markdown, `#`/`##`/`###`, tables where the content is dense, the same
sentence-case-with-a-bolded-thesis register as `voice.md` and `scaling.md`.

### `# Cooks` — the opening (about 18 lines)

- One bolded thesis sentence directly under the title, in the shape `voice.md` and `scaling.md` use:
  **read this before you build anything a person has to be right about.**
- What a persona is *here*: a situation, its constraints, and the contradiction that makes it hard.
  Not a name, not a photograph, not a job title. One sentence each on why: a preference list cannot
  fail a design, a contradiction can.
- Where the three came from: the person this collection is for, recorded in
  `docs/active/stories/S-012-who-is-actually-cooking.md`. **There are three and there is not a
  fourth**, with the one-line reason (a reader who cooks alone on weeknights and hosts at
  Christmas is two of these, not a new one).
- Where a detail is missing it is a question in §"What the three did not say", never a guess.
- Sibling links: `counters.md`, `voice.md`, `scaling.md`, in the folder's link style
  (`[voice.md](voice.md)`).

### `## The three, and what pulls in two directions` — the contents table (about 12 lines)

One table, one screen. Columns: **The situation** · **The contradiction** · **What it costs when a
design gets it wrong.** Third column is what makes this a test rather than a summary.

Rows, verbatim in substance from the story and ticket §2:

1. Cooking for the day — variety and small batches fight; every shelf resolves it toward the batch.
2. The family rotation — the decision is the cost, so more choice makes it worse.
3. Holiday guests — more hands and more overload at once; help has a coordination cost.

Anchor links to the three sections below, the way `counters.md`'s contents table does.

### `## Cooking for the day` (about 40 lines)

Fixed internal order, repeated identically for all three, so a later ticket can find the same thing
in the same place three times:

1. **The contradiction**, bolded, first paragraph. Not the situation — the contradiction.
2. **The situation**: one person, using up what is in the fridge, no store run. Cannot take too oily
   or too salty or lacking nutrition. Defaults to meaty mains and heavy starches — *more like cattle
   than a zoo animal*, quoted as theirs. Will not accept four dishes for two meals; two servings of
   the same thing in a day gets old fast. Open to side dishes that do not send them to the shop.
3. **What would resolve it, and what would only look like it does.** Design §3's line: the property,
   never the mechanism. The false resolution here is the batch — a bigger pot of the same thing, or
   a "quick" filter, both of which resolve the tension by deleting the variety half.
4. **What they need to know before committing**, as the three-column table (Design §2): *What they
   need to know* · *What the site says* · *How complete that is*.

Rows for this person, with the field names: is this within reach without shopping
(`>> servings:` and the ingredient list exist; the staples split runs the wrong way — see §"What is
missing"); how long am I standing there (`handsOnMinutes`, with `assumedHandsOnMinutes` and
`untimedCount` as the honesty); is it one unbroken stretch (`longestHandsOnMinutes`); what is in the
sink (`>> washing-up:`, 177 of 685 files); what happens if I get it wrong (`>> slack:`, 416 of 685);
does it make a second dinner tomorrow (`keeps`, T-011-04, **not built**); can I halve it
(`MULTIPLIERS` in `src/lib/plan.ts` offers ×1/2, and `capacity` — T-011-02, **not built** — is the
thing that would say whether halving changes anything).

### `## The family rotation` (about 40 lines)

Same four parts.

The contradiction paragraph carries the file's most useful sentence and says so plainly: **the cost
is the decision, not the cooking**, so every feature that offers more choice makes the problem
worse. The false resolutions: a bigger collection, a better search box, more filters, a
recommendation the household still has to be polled about.

The situation: household off takeout; overtaxed by polling for preferences and by the shopping haul
that follows; what the household likes is hard to forecast; seasonal produce and store sales mean
standbys like beans get neglected although they were always an option; path dependence on meaty,
salty items that make weight loss and heart health hard to manage; accidentally committing to too
much kitchen time.

Table rows: what am I committing to in kitchen time (`totalMinutes`, `handsOnMinutes`); what is the
shopping haul (`/list/`, `src/lib/shopping.ts`, and the `>> staples:` split from
`src/data/staples.json` — 31 staples with a written doctrine, plus `isMoreThanAJar()` pushing a large
amount back onto the buying side); did we have this recently (**nothing** — `src/lib/plan.ts` holds
a plan, not a week); will the household eat it (**nothing**; `>> pairs-with:` on 434 files is about
dishes, not people); is it heavy again (**nothing** — no balance field, see §"What is missing").

### `## Holiday guests` (about 40 lines)

Same four parts.

The contradiction: more hands and more overload at once. The cook becomes a supervisor and a
coordinator, which is a different job; the overload is informational rather than physical. False
resolution: assuming help is free, which is precisely the assumption the code already makes — cross
-reference §"What is missing", do not restate it.

The situation: a couple and a niece for a few days; cramped living space; more mouths and more
hands; hard to stave off the pull of heavy holiday food; wants to impress the in-laws at the big
meals.

Table rows: what can be started before the guests arrive (`unattendedMinutes` and the schedule's
`lanes` are close, but nothing marks a step as *ahead of time*); what can I hand to somebody
(**nothing that says so** — `lanes` is the nearest thing and it was not built for this); how long is
the whole thing (`totalMinutes`); how many pans does this need at once (**nothing**; `>>
washing-up:` counts what is dirty afterwards, not what is occupied at the same moment, and `capacity`
— T-011-02, not built — would say what one vessel holds, not how many vessels are wanted); does it
hold if dinner slips an hour (`>> slack:`); does it feed more people (`MULTIPLIERS`, and the plan
page's live defect that the clock does not move, S-011).

### `## What is missing` (about 55 lines)

The file's real output. Four named things, each with **what it would take** — a description of the
work, not a proposal for a field. No ranking, and the section says why: T-012-02 ranks, from the
shelf.

1. **Cooking from what is already in the fridge.** `src/data/staples.json` holds 31 staples and a
   five-clause doctrine for where the line is between pantry and shopping; `/list/` already splits
   them. The direction is recipe → list. Nothing runs it backwards. What it would take: a way to
   read a set of things a person has and return what is within reach of it, which needs the pantry
   assumed rather than typed and needs *all of these and nothing else* rather than one ingredient at
   a time — `src/pages/search.json.ts` indexes ingredient names as one free-text blob.
2. **Balance, and breadth of plants.** No field, no filter, and — the story's measurement, cited to
   the story, not re-measured — very little food. What it would take: a fact about the dish that
   nobody has agreed on yet, and enough of the food to make an answer non-trivial. Point at
   T-012-02.
3. **Work that can be handed to somebody else.** The `schedule.ts` finding, stated explicitly per
   the acceptance criteria: the module assumes as many hands as the tree has branches and never
   delays one hands-on task for another (`src/lib/schedule.ts:63-66`); the same file already calls
   that assumption *"right for a timeline and wrong for this number"* and lays the stretches on one
   cook's clock for `longestHandsOnMinutes` (`schedule.ts:306-322`). **The same assumption is a bug
   for the first two people and a feature for the third**, and the multi-cook model is half-built by
   accident. What it would take: deciding how many cooks a page is talking about, which is a
   question about the reader and not about the graph.
4. **A rotation that does not need polling.** `src/lib/plan.ts` holds `{ slug, multiplier }` in
   `localStorage` under one key. Nothing holds a history, a preference, or a week. What it would
   take: something with a date in it, and an answer to whose preference it is — which runs straight
   into the second person's contradiction, because a preference that has to be collected is the
   polling they are trying to stop.

### `## Holding a design against these` (about 35 lines)

The demonstration. S-010's three dials — *time you're standing there*, *on the table by*, *things to
wash*, with three answers rather than two — held against all three people.

One table: **The situation** · **Verdict** · **Why**, with verdicts from {passes, fails, cannot
say}, then a short paragraph on what the result means. Expected shape, to be argued in the prose
rather than asserted:

- One: passes, and it was designed for them.
- Two: fails, and fails in the specific way their contradiction predicts — three dials is three more
  decisions, and the cost is the decision.
- Three: cannot say. The dials measure one cook's evening; nothing in them is wrong for a
  supervisor, and nothing in them is about the thing that is hard.

Then one paragraph on S-011's capacity, showing the method transfers and naming what it settles for
the third person and leaves open for the first.

The section ends with the rule that makes the file usable: **a design passes when it changes what
the person's contradiction costs them, and fails when it only serves the half of the contradiction
that was already served.**

### `## What the three did not say` (about 20 lines)

The assumptions block, numbered, each written as the question to ask rather than as a filled-in
answer: days covered by a fridge-clearing; household size; dietary restrictions; equipment in each
kitchen; how much of the holiday is the big meals; how long "a few days" is. One line on the rule —
where the body leans on one of these it says `(assumption)` inline and points here.

### `## What this file does not do` (about 10 lines)

Four lines: no ranking (T-012-02), no re-measurement of the shelf, no proposed field or dial, no
fourth person. Closing sentence on how the file is meant to be used and when it should be corrected
— the same job `voice.md`'s §"What changed, and when" does, stated forward because nothing has
happened to it yet.

---

## Ordering

Written top to bottom in one pass; the sections do not depend on each other except that
§"Holding a design against these" quotes the contradictions from the table at the top and must use
the same words. Verification is a read-through against the eight acceptance criteria plus
`markdownlint`-free-hand checks: no trailing whitespace, one `#`, links resolve.
