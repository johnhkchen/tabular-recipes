---
id: T-012-01
story: S-012
title: write-the-three-down
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Write `docs/knowledge/cooks.md`: who is standing in the kitchen, what each one is up against, and
what makes each one hard. **No code, no `.cook` file, no property, no feature.**

`counters.md` settled what a counter is before a counter existed. `voice.md` settled the register
before a writer used it. This is that file for the reader, and five stories are already building
filters that only a person can validate.

### 1. The three, as given

The source material is in `docs/active/stories/S-012-who-is-actually-cooking.md` and it came from
the person this collection is for. **Do not embellish it and do not invent a fourth.** Where a
detail is needed that they did not give, the file says it is an assumption.

**Cooking for the day.** One person. Peeling off a small enough recipe to use up what is in the
fridge without a store run. Cannot take something too oily or too salty, or lacking nutrition;
finds themselves defaulting to meaty mains and heavy starches, eating *more like cattle than a
zoo animal*. Does not want four dishes for two meals. Two servings of the same thing in one day
gets old fast. Open to side dishes, but not ones that send them to the shop.

**The family rotation.** Wants the household off takeout. Overtaxed by polling for preferences and
by the shopping haul that follows. What the household likes is hard to forecast. Seasonal produce
and store sales mean standbys like beans get neglected although they were always an option. The
result is path dependence on meaty, salty items that make weight loss and heart health hard to
manage, and accidentally committing to too much kitchen time.

**Holiday guests.** Hosting a couple and a niece for a few days. Cramped living space, more mouths,
**and more hands**. Shifting into supervisor and coordinator is a new mode and the overload is
informational rather than physical. Hard to stave off the pull of heavy holiday food. Wants to
impress the in-laws at the big meals.

### 2. Lead each one with its contradiction

**A persona that lists preferences is useless.** The design value is in the tension, because that
is what a proposal can be tested against:

- One wants **variety and small batches**, and those fight. Every shelf on this site resolves it
  toward the batch.
- Two's cost is **the decision, not the cooking** — so any feature offering more choice makes the
  problem worse. That inverts the usual instinct and it is the most useful sentence in the file.
- Three has **more hands and more overload at once**. Help has a coordination cost, and a recipe
  that is easy alone can be harder to hand out in pieces.

State each contradiction plainly, then say what would resolve it and what would only look like it
does.

### 3. Say what each one asks of a recipe page

Concrete, so a later ticket can act on it. For each persona: what they need to know before they
commit to a dish, and which of it this site can already tell them. Be specific — name the fields.
The clock, `slack`, `washing-up`, `capacity`, `keeps`, `counters`, the shopping list's staples
split.

**Then name what is missing**, which is the file's real output. At least these four, and say for
each what it would take:

- **Cooking from what is already in the fridge.** `src/data/staples.json` holds 31 staples and a
  written doctrine for *where the line is* between pantry and shopping, and the list already splits
  them. Nothing runs that backwards to ask which recipes are within reach tonight.
- **Balance, and breadth of plants.** No field, no filter, and — see T-012-02 — very little food.
- **Work that can be handed to somebody else.** `src/lib/schedule.ts` builds a DAG with packed
  lanes and states its own assumption: it *"assumes you have as many hands as the tree has
  branches; it never delays one hands-on task for another."* **That assumption is wrong for one
  and two and right for three.** The multi-cook model is half-built by accident and nobody has
  noticed.
- **A rotation that does not need polling.** `src/lib/plan.ts` holds a plan; nothing holds a
  history, a preference, or a week.

### 4. Do not design

This file describes people. It does not propose fields, dials or counters, and it does not rank
what to build — **that is T-012-02's, and it is ranked from the shelf rather than from the
personas.** A knowledge file that starts recommending features stops being the thing later work
can be tested against.

## Acceptance Criteria

- `docs/knowledge/cooks.md` exists, in the shape of the files already in that folder, and is
  linked from wherever that folder is indexed.
- Each of the three is written as a situation and its constraints, **led by its contradiction**,
  with no name, no photograph and no job title.
- Every detail traces to the source material, and **every assumption is marked as one.** No
  fourth persona.
- For each persona, a list of what they need to know before committing to a dish, and which
  existing field answers it — by field name.
- A section naming what is missing, covering at least the four above, each with what it would
  take. **No proposals, no ranking.**
- The `schedule.ts` finding is stated explicitly: the same assumption is a bug for two personas
  and a feature for the third.
- The file is written so a later ticket can hold a design against a persona and get a clear pass
  or fail. Demonstrate it: take one thing already on the board — S-010's dials or S-011's
  capacity — and show it passing or failing against all three.
- No code, no `.cook` file, no property changed. Only `docs/knowledge/cooks.md` and
  `docs/active/work/T-012-01/**`.
