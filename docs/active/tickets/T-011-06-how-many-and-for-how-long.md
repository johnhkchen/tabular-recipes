---
id: T-011-06
story: S-011
title: how-many-and-for-how-long
type: task
status: done
priority: high
phase: done
depends_on: [T-011-03, T-011-04, T-010-02]
---

## Context

Turn S-010's dials into a situation. Right now they answer *what can I cook*; this makes them
answer *what can I cook for these people, over these days, with what I have left.*

**You own `src/pages/index.astro` and the search index's shape for this.** T-010-02 built the
dials and this extends them rather than replacing them — read its work artifact first, including
whatever it decided about URL state and the cannot-say marking.

### 1. The two situations are one control with two settings

> Exhausted, two meals for one, for today.

Small n. Nothing batches at that size, capacity never binds, and **S-010's dials already answer
this completely.** Do not rebuild it. The situation control should collapse to exactly the
existing behaviour when the numbers are small, and if it does not, the numbers are wired wrong.

> Stressed, six people, over three days.

n ≈ 18 portion-meals, cooked once. Now the flat cost barely matters and the growth is everything:
elapsed that does not care how much there is, a vessel that does not bind at eighteen, and a dish
that is still good on Thursday.

**The same three dials, read against the scaled cost rather than the written one.** That is the
whole feature and it is why the dials were built first: *time you're standing there* at eighteen
servings is a different number from *time you're standing there* at four, and until S-011 the site
could not tell.

### 2. What the reader sets

How many people, and over how many days. Between them they give the target servings the cost
function takes.

**Days is not just a multiplier**, and this is the part that is easy to get wrong: three days for
two people is six portion-meals cooked *once*, which is a scaling question, but it is also a
keeping question, and a dish that does not survive to Thursday fails it however well it scales.
Wire T-011-04's field in as a filter on the days setting — **if that ticket was cut, say so on the
page rather than silently ignoring the third day.**

Whether "how much have you got left" is a third input or just the existing dials is a judgement.
**Argue it.** The case for folding it in is that the dials already are that; the case against is
that a tired person will not turn three dials and would turn one switch.

### 3. Say the finding, not the model

From the phrasebook in `docs/knowledge/scaling.md`. **No notation on the page, ever.**

The result a reader wants is not a list — it is a list with the reason each thing is on it.
*"Feeds six without taking any longer"* is the sentence this whole story exists to be able to
print, and it is worth more than the ordering.

And the negative case matters as much: a recipe that is perfect for two and terrible for six
should say why it dropped out, not silently vanish. **Same rule as T-010-02's cannot-say state** —
a filter that hides things without saying why is the thing this site is built not to be.

### 4. It still has to work

`npm run verify:mobile` passes: no overflow at 375, 390 or 768, touch targets intact. The URL
still carries the state, and a pasted link still reproduces the list — now including the people
and days.

The front page still reads as a front door. If the controls have grown to the point that they
dominate it, that is a finding and a reason to move them, not a reason to ship it.

## Acceptance Criteria

- The front page takes how many people and over how many days, and filters against the **scaled**
  cost from `src/lib/scaling.ts` rather than the recipe's written figures.
- **At small numbers the behaviour is identical to T-010-02's**, demonstrated by a before-and-after
  of the same query.
- The days setting filters on keeping as well as scaling, or the page says plainly that it cannot
  — no silent omission.
- Each result carries the plain-English reason it is there, from the phrasebook. **No notation
  anywhere.**
- A recipe excluded because it scales badly says so rather than vanishing.
- Both of S-011's situations are run end to end and the results are read as a cook, with a verdict
  per recipe in the work artifact. **The six-over-three-days list is the one to scrutinise** — if
  it is full of things nobody would batch-cook, the model or the annotation is wrong and that is
  the finding.
- URL state covers people and days; a pasted link reproduces the list.
- `npm run verify` and `npm run verify:mobile` both pass.
- The front page still reads as a front door, or the work artifact says it does not and what
  should happen.
- The counter row, the search box and every recipe page are unchanged when nothing is set.
- Only `src/pages/index.astro`, `src/pages/search.json.ts`, `src/styles/**`, any new component,
  tests and `docs/active/work/T-011-06/**` are modified. No `.cook` file.
