---
id: S-012
title: who-is-actually-cooking
type: story
status: open
priority: high
---

## Why

Five stories are in flight and every one of them was argued from the shelf outwards — what the
collection has, what a counter is, what a table can hold. **None of them was argued from a person
standing in a kitchen**, and three of them are building filters that only a person can validate.

S-010 asks *what can I cook when I have nothing left*. S-011 asks *what does doubling cost*. Both
are right and both are answering a question nobody has written down properly. There are three
questions, they belong to three different people, and the answers pull against each other.

`docs/knowledge/` is where this repo settles an argument before building on it. `counters.md`
settled what a counter is before a counter existed. `voice.md` settled the register before a
writer used it. **There is no file saying who any of it is for**, and that omission is now
expensive: every filter, dial and gate on the board is a guess about a reader.

## The three, and what makes each one hard

Written properly in T-012-01. In brief, and the useful part of each is the **contradiction**, not
the preference list:

**Cooking for the day.** One person, using up what is in the fridge, without a store run. Wants
nutrition and variety; will not accept four dishes for two meals, and two servings of the same
thing in a day gets old fast. **The contradiction: variety and small batches fight each other**,
and every existing shelf resolves it toward the batch.

**The family rotation.** Wants the household off takeout. The tax is not the cooking — it is
**polling for preferences and forecasting a shopping haul**, and what the household likes is hard
to predict. Seasonal produce and store sales mean the cheap standbys, beans above all, get
skipped even though they were always there. The result is path dependence on meaty, salty
food that makes weight and heart health hard to manage. **The contradiction: the decision is the
cost, and every feature that offers more choice makes it worse.**

**Holiday guests.** A few days, a cramped kitchen, more mouths **and more hands**. The cook
becomes a supervisor, which is a different job, and the shift is informational overload rather
than physical work. Wants to feed people well and to impress the in-laws, without the whole
holiday being heavy food. **The contradiction: help has a coordination cost**, and a recipe that
is easy alone can be harder to hand out in pieces.

## What the collection already fails at, measured

Persona one's sharpest line is that this food eats *more like cattle than a zoo animal* — meat
and starch, little breadth of plants. **That is measurably true of this collection**, and the
numbers are not close:

| | Files |
| --- | --: |
| `stews-and-braises` | 103 |
| Sweets — cookies, cakes, bars, custards | **101** |
| `rice-beans-and-grains` | 59 |
| `salads` | 23 |
| **`vegetables-and-sides`** | **18** |

Eighteen, of 658. Five of them are potato, yam or corn; five more arrived as a block from S-003's
Japanese shelf. Strip those and the collection has **roughly eight vegetable sides that are not a
starch**. Meat tags run 225 across pork, chicken and beef; `vegetarian` is 32.

**A hundred and one desserts and eighteen vegetable sides.** No filter fixes that. A balance dial
built on this shelf would return the same eight files to everybody, forever, and would be a
worse lie than saying nothing — which is exactly the failure S-010 already guards against with
its cannot-say state.

So this story measures the shelf against the people before anything is built on top of it.

## Scope, stated plainly

**This story writes down who is cooking and what the shelf actually offers them. It builds no
feature.**

That is deliberate. The personas name at least four capabilities the board does not have —
cooking from what is in the fridge, balance and variety, work that can be handed to a helper, and
a rotation that does not need polling. **Each is a story.** Opening four at once, on top of five
already running, would produce five half-arguments instead of one settled one.

T-012-02 ends with a ranked recommendation of which to open next, argued from what the shelf can
actually support rather than from which sounds best.

## Shape of the work

- **T-012-01** writes the personas down, with their contradictions. Depends on nothing.
- **T-012-02** measures the collection against them and ranks what to build next.

## Conventions

`docs/knowledge/voice.md` governs how these are written. **A persona is not a marketing sketch
and it does not get a name, a photograph or a job title.** It is a situation, its constraints,
and the contradiction that makes it hard — written so a later ticket can test a design against it
and get a clear pass or fail.

Nothing in this story invents a reader. The three came from the person this collection is for,
and where a detail is needed that they did not give, **the file says it is an assumption** rather
than quietly filling it in.
