---
id: T-013-01
story: S-013
title: what-makes-an-occasion-real
type: task
status: done
priority: critical
phase: done
depends_on: [T-011-01, T-012-01]
---

## Context

Write `docs/knowledge/occasions.md`: what an occasion is, how you establish that one is real, and
what makes a recipe a hall of famer *for it*. **No counter, no property, no recipe, no code.**

This is `counters.md` for moments. Read that file first — it is the model, and its opening rule is
the one to carry over: **archetypes, not taxonomies**, settled from what people actually buy rather
than from the recipes already written.

### 1. Establish an occasion the way a counter was established

`counters.md` was settled from roughly seventy real menus. The equivalent evidence for a moment is
what somebody sells for it:

- **Caterers' seasonal menus** — the closest thing to a controlled experiment, because a caterer
  who lists a dish nobody orders stops listing it.
- **Supermarket pre-order sheets** — turkeys, hams, sides by the pound, with a deadline. What a
  chain prints on a form is not a guess.
- **Bakery seasonal boards.** The collection already carries three: `pan-de-muerto`, mooncake,
  `hot-cross-buns`. Each is a dish that exists *only* for a moment, which is the purest case there
  is.
- **A restaurant's one-night prix fixe**, and what takeout volume does on the days nobody cooks.

**The test, and it is the whole filter:** an occasion is real if somebody sells for it. Nobody sells
for *a rustic Tuscan evening*, which is why the cookbook of them goes unopened. **State this as the
rule and apply it hard**, including to occasions that feel obvious — if the selling evidence is
thin, say so rather than assuming.

### 2. Settle whether the three axes are one thing

Three shapes look like occasions:

- **Time of year** — the holidays, the seasonal board. Recurs on a calendar, and the evidence is
  abundant.
- **Moment in life** — a new baby, in-laws for a week, moving, somebody ill. Recurs per household,
  not per calendar, and the selling evidence is thinner but real (meal trains, the casserole).
- **Type of day** — a long day, a day off, a snow day. **This one may not be an occasion at all**;
  it may be exactly what S-010's dials already answer, and folding it in would duplicate a feature
  the board is building.

**Decide, and say which of the three the method covers.** Each entry in `counters.md` says whether
an archetype is combined or separate and why; do the same here. Getting *type of day* wrong in
either direction is expensive — as an occasion it duplicates S-010, and excluded wrongly it strands
the one persona who is most often in the kitchen.

### 3. Define the hall of fame per occasion, not once

**This is the file's real work and the place it earns its keep.**

A hall of famer is a recipe that survives *that moment's* constraints, and the constraints are
measurable. The fields exist or are being built: the clock's hands-on split, `slack`,
`washing-up`, S-011's `capacity` and cost function, T-011-04's `keeps`, and the branch structure
`buildSchedule` already computes.

Write the profile as a **per-occasion weighting over those fields**, and demonstrate it on the two
corners S-013 names, because they invert:

- **A big family meal cooked alone** wants flat scaling, keeps for days, no oven in the last hour,
  a clean hand-off to a helper, and forgiving slack — because that cook will be late.
- **A dumpling party** wants the opposite of most of that. **Hands-on time is the point**, because
  the labour is the party. Many hands, a low skill floor per unit, a long forgiving assembly, and a
  dish that is genuinely worse to make alone.

**A system that cannot express both is not the system.** If the profile shape you land on ranks the
dumpling party's best dish badly, the shape is wrong, not the dumpling.

Say plainly which fields do not exist yet and would be needed — *skill floor per unit* and *is this
better with company* are two that plausibly do not, and naming them is worth more than pretending
the current fields cover it.

### 4. Settle the namespace question

`counters.md` defines a counter as a shop. **The field has already stretched once**: Instant Pot,
One Pot, The Slow Cooker and The Air Fryer & the Pot are bargains rather than shops, and T-003-01
said so when it opened them.

An occasion in the same `>> counters:` list would be a third kind of thing. **Argue it both ways
and decide.** For: one namespace, one render, no new machinery, and a recipe genuinely can belong
to a shop and a moment at once. Against: `counters.md`'s definition stops meaning anything, and a
front page mixing *Bakery*, *One Pot* and *Thanksgiving* has stopped being wayfinding.

If the answer is a separate axis, say what it costs — that is a schema change and it is not free.

## Acceptance Criteria

- `docs/knowledge/occasions.md` exists, in the shape of `counters.md`, and is linked where that
  folder is indexed.
- The *somebody sells for it* rule is stated and applied, with **at least four kinds of selling
  evidence** named and at least one candidate occasion **rejected** for failing it. A rule that
  rejects nothing is not a rule.
- The three axes are each classed as in or out, with the reason, and the *type of day* decision
  explicitly addresses the overlap with S-010.
- The hall-of-fame profile is defined as a per-occasion weighting over named existing fields, and
  **worked in full for both the big family meal and the dumpling party** — showing the same
  machinery producing opposite rankings.
- Fields the profile needs and the site does not have are named, with what each would take. No
  proposals beyond naming them.
- The namespace question is argued both ways and decided, and if the answer is a separate axis the
  cost is stated.
- The file says what an occasion is **not**: a theme, a cuisine, a mood, or a season with recipes
  attached.
- No counter is opened, no property is added, no recipe is written, no code changes. Only
  `docs/knowledge/occasions.md` and `docs/active/work/T-013-01/**`.
