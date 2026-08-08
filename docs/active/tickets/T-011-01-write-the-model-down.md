---
id: T-011-01
story: S-011
title: write-the-model-down
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Write `docs/knowledge/scaling.md`: what it costs to cook more of a thing, and how this collection
decides. **No code, no `.cook` file, no property.** Five tickets are built on the argument in this
file and every one of them will get it wrong if the argument is loose.

The other files in `docs/knowledge/` are the shape to follow. `counters.md` settles what a counter
is before any counter exists; `voice.md` settles the register before any writer uses it. This is
that file for the cost of scale.

### 1. The model, stated so a reader can check it

The claim is in `docs/active/stories/S-011-what-doubling-costs.md` and this file makes it precise:

- **Unattended time is O(1) in the number of servings.** A braise is two hours because of what
  happens to collagen, not because of how much collagen there is.
- **Hands-on time is O(n).** Twelve onions take three times four onions.
- **Capacity is the correction.** A vessel holding `c` servings means `ceil(n / c)` batches, run
  serially, and the batch's unattended time repeats with it.

**Derive the cost function properly and show the algebra.** Somebody reading this file should be
able to work out the elapsed time of twelve portions of a recipe from its four-portion figures
and its capacity, by hand, and get the same answer the code will. If they cannot, the file has
described a feeling rather than a model.

Be explicit about which term dominates where, because that is the useful part: at small `n` the
flat cost decides and capacity never binds; at large `n` the batch count swamps everything else.

### 2. Argue the free lunch, because it is the load-bearing claim

The model needs no new per-step annotation, and the reason is a real claim that has to survive
being written down: **the hands-on/unattended split the site already computes *is* the scaling
classification.** A wait is a property of the food's physics and does not care about quantity.
Work is a property of quantity and scales with it.

**Then attack it.** Find the cases where it fails, because there are some and a model that hides
them is not worth having:

- **A bigger pot takes longer to come to temperature.** Real, and it is neither O(1) nor O(n).
- **A crowded pan steams instead of browning.** The unattended time does not change; the *dish*
  does. That is a failure the model cannot see at all and the file must say so.
- **Some hands-on work does not scale linearly.** Chopping has a setup cost. Rolling forty
  dumplings is faster per dumpling than rolling twenty.
- **Oven recovery between batches.** Four batches is more than four times one batch, because the
  box drops 30°C every time the door opens.

For each: is it inside the model, outside it, or a known error the model accepts? **A stated error
bar beats a hidden one.** This section is what makes the file honest rather than clever.

### 3. Fix the language boundary

The model is O(·) here, in the code, and in the tests. **It is never O(·) on a page a cook reads.**
The house rule is plain kitchen-table English and this is exactly the sort of feature that breaks
it without noticing.

So this file also carries **the phrasebook** — the sentence each finding turns into — because
five tickets downstream will need it and none of them should invent its own wording:

| The model says | The page says |
| --- | --- |
| elapsed is O(1) in n | *Cooking three times as much costs you nothing extra.* |
| elapsed is O(n), capacity 3 | *Three times the people is three times the batches, and three times as long standing there.* |

Two rows is not a phrasebook. Write the real one, cover the cases the model can produce, and make
each sentence one a person would say out loud.

### 4. Work the examples

Four dishes, worked end to end with real numbers off real files in this collection — not
invented ones. `chili-con-carne` and an air fryer dish from S-008 are the two poles; pick two more
that are interesting rather than obvious, and at least one where the answer is surprising.

Then the two situations S-011 names — *two meals for one, today* and *six people over three days* —
worked as queries: what each one is actually asking for, in terms of the model, and which of the
four examples answers it.

## Acceptance Criteria

- `docs/knowledge/scaling.md` exists, in the shape of the files already in that folder.
- The cost function is stated with its algebra, and **a reader can compute a worked example by
  hand and get the number the file gives.** Show one such computation in full.
- The claim that attention and scaling are the same fact is argued, not asserted, and at least
  **four** cases where it fails are named, each classed as inside the model, outside it, or an
  accepted error.
- A phrasebook maps every finding the model can produce to a plain-English sentence, with no
  notation in any of them.
- Four dishes are worked end to end using figures from real files in this collection, named by
  slug, including at least one surprising result.
- The two situations from S-011 are worked as queries against the model.
- The file says what capacity is **not** for: it is the vessel's limit, not a serving suggestion,
  and a recipe that simply makes four portions has no capacity to declare.
- No code, no `.cook` file and no property is changed. Only `docs/knowledge/scaling.md` and
  `docs/active/work/T-011-01/**`.
