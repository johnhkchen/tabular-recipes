---
id: T-013-02
story: S-013
title: why-the-meal-not-the-dish
type: task
status: done
priority: critical
phase: done
depends_on: [T-011-02]
---

## Context

Six reasonable recipes make an unreasonable afternoon, and **nothing on this site can see it**,
because every tool here reasons about one dish at a time.

`buildSchedule` builds a DAG per recipe, packs its lanes and finds its critical path. A meal is
several of those at once, **competing for one oven, four burners, a fridge and a cook**, all
landing at one serving time. That competition is the entire reason a family holiday meal
overwhelms somebody who cooks perfectly well the other fifty-one weeks of the year.

**T-011-05 already forward-declared this ticket** — it was told that a plan total is a scheduling
question, that summing elapsed times is wrong, and that if the honest answer was *this needs its
own story*, to say so. This is that story.

### 1. Diagnose. Do not plan.

**The output is a diagnosis, not a schedule**, and this is the single most important constraint on
the ticket.

A generated minute-by-minute plan would be over-promising: real cooking does not run on rails, a
turkey is done when it is done, and a plan that is wrong by fifteen minutes is worse than no plan
because somebody trusted it. It is also the wrong shape of problem — resource-constrained job-shop
scheduling is NP-hard in general, and *optimal* is not what anybody is asking for.

What a cook actually needs is the thing they cannot see:

- *Your oven is oversubscribed between 4:30 and 5:30 — three dishes want it and two want different
  temperatures.*
- *Seventy minutes of hands-on work falls in the last forty-five minutes.*
- *Two of these six can be made the day before, and one has to be.*

**Findings a person can act on**, each naming the dishes involved. Not an itinerary.

### 2. What a meal model needs

Take a set of recipes with target servings and return where they collide. It reasons; it does not
render.

The constraints that are real, and each needs a decision recorded:

- **The oven is one oven, and temperature is part of the constraint.** Two dishes at 180°C can
  share it if they fit; 180°C and 230°C cannot. Whether the model knows about oven *space* as well
  as time is a scope call — S-011's `capacity` is about the cooking vessel, and an oven shelf is a
  different bound. **Argue it; do not silently assume infinite shelves.**
- **Burners are a small integer.** Derivable from the `#cookware{}` a recipe names, imperfectly.
  Say how imperfectly.
- **The cook is one person unless told otherwise.** `schedule.ts` states its own assumption — it
  *"assumes you have as many hands as the tree has branches; it never delays one hands-on task for
  another."* **Across recipes that assumption becomes absurd**, and it is the bug that hides the
  whole problem. Take cook count as an input; default it to one.
- **Everything lands at one time.** That is what makes a meal a meal, and it is the constraint the
  per-recipe schedule has never had.
- **Fridge and counter space.** Persona three's kitchen is cramped and this is a real bound, but it
  is the least measurable thing here. **Probably out of scope** — say so, and say what it would
  take, rather than modelling it badly.

### 3. Reuse, do not reimplement

Every per-recipe number this needs already exists: the DAG, the lanes, the critical path, the
hands-on split, the confidence from T-010-01, the cost function from T-011-02. **Call them.** A
meal model that recomputes a recipe's schedule its own way will disagree with the recipe's own page
within a month.

The confidence rule carries through and gets sharper. A collision computed from six recipes'
figures is only as good as the worst of them, and **a diagnosis built on assumed minutes must not
look more certain than one built on stated ones.** Six recipes is six chances to be guessing, and
the compounding is the danger.

### 4. Prove it on the meal that motivated it

A model that cannot explain the case it was built for is not finished. Take a realistic big family
meal off this shelf — a roast, several sides, something baked, cooked by one person for ten — and
show the diagnosis it produces.

Then change one thing and show it move: make one side ahead, or take one dish out of the oven, and
show which finding clears. **That is the demonstration that this is a tool and not a report.**

## Acceptance Criteria

- A meal model under `src/lib/` takes a set of recipes with target servings and a cook count, and
  returns collisions and load findings. **It returns no schedule and no itinerary.**
- Every constraint it models is listed with what it assumes and how wrong that assumption can be.
  Oven space, burner count and fridge space are each explicitly in or out, with the reason.
- It calls `buildSchedule` and `src/lib/scaling.ts` rather than reimplementing either. Show the
  calls.
- **It returns no display string and no notation** — same rule S-011 set. Rendering is a later
  ticket's.
- Confidence is carried through and a diagnosis built on assumed minutes is marked at least as
  strongly as the weakest recipe in it.
- The worked meal is run end to end and its diagnosis pasted into the work artifact, naming the
  recipes by slug.
- **One change is made to that meal and the finding it clears is shown.** Before and after.
- Tests cover: two recipes wanting the oven at once; two wanting it at incompatible temperatures;
  a hands-on pile-up in the final hour; the same meal with two cooks instead of one; and a meal
  where one recipe's figures are entirely assumed.
- The work artifact says what this model **cannot** see, in the shape of a gap page's
  what-it-could-not-stock section. The turkey that is done when it is done belongs in it.
- `npm run verify` passes.
- Only new files under `src/lib/`, their tests, and `docs/active/work/T-013-02/**`. No `.cook`
  file, no page, and not `src/lib/schedule.ts` or `src/lib/scaling.ts`.
