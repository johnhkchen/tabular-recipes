---
id: S-013
title: cooking-for-a-moment
type: story
status: open
priority: high
---

## Why

**Every recipe in this collection is written for a dish. None is written for a moment.**

A counter answers *where would I buy this*. The clock answers *how long*. `slack` answers *what if
I'm late*. Nothing answers **why is it the third week of November and I am underwater**, and that
is a question with a completely predictable answer that recurs for the same household every single
year.

The occasion cookbook is the existing attempt and it fails in a way worth naming, because the
failure is the design brief. It organises by **theme** — a Tuscan dinner party, a rustic
Christmas — and a theme is a thing nobody wants three seasons out of four. That is why those books
sit unopened: **the recipes in them were selected for coherence with an idea, not for what people
actually eat at that moment.** Seventy-five per cent dead weight, by construction.

**This collection has the method that fixes that, and it has already used it once.**
`docs/knowledge/counters.md` settled twenty-one archetypes from roughly seventy real menus read end
to end — *revealed preference*, what people actually pay for, rather than what a category says they
should want. Occasions have the same evidence and more of it: caterers publish holiday menus,
supermarkets print pre-order sheets, bakeries run seasonal boards, restaurants set a prix fixe for
one night a year. **Somebody sells for every occasion that is real, and nobody sells for one that
is not.** That is the filter the occasion cookbook never applied.

## The second thing we have, which nobody else does

Revealed preference says *what*. It does not say why the meal went wrong, and that is the half a
home cook actually needs.

**S-011 gives us the diagnosis.** A family holiday meal overwhelms a solo cook for reasons that are
now measurable rather than atmospheric:

- Six dishes that are each individually reasonable, whose hands-on time **all lands in the same
  ninety minutes**.
- Four of them wanting one oven at the same temperature at the same hour.
- A vessel that bound at four servings and is being asked for twelve, so what was one batch is now
  three, serially, at the worst possible time.
- Nothing made ahead, because nothing recorded that it could be.

Not one of those is visible from any single recipe page, and every one of them is computable from
things the board is already building: `buildSchedule`'s DAG and lanes, S-011's capacity and cost
function, T-011-04's `keeps`, S-008's `washing-up`.

**That is the actual product.** Not *here are Thanksgiving recipes* — every publisher has those —
but *here is why your Thanksgiving falls apart at four o'clock, and which dish to move.*

## Hall of fame is per-moment, and the dumpling party proves it

The tempting mistake is to build this as *easy = good* and rank every occasion the same way. It is
wrong, and the counter-example is decisive.

**A big family meal, cooked alone.** The hall of famers scale flat, keep for three days, stay out
of the oven in the last hour, hand off to a helper cleanly, and forgive a cook who is late —
because that cook will be late.

**A dumpling party for friends.** Every one of those dials inverts. You *want* the dish whose
hands-on time is O(n), because **the labour is the party**. You want many hands, a low skill floor
per unit, a long forgiving assembly, and a thing that is no fun at all to make alone. A filter
tuned for the first occasion would rank the dumpling party's best dish dead last.

**So the system is not a difficulty score with a season attached.** It is a per-occasion profile
over measurements the site already takes, and the two occasions above are opposite corners of the
same space. Anything that cannot express both is not the system.

## What this story does, and what it deliberately does not

**It builds the system. It opens no counter.**

Three axes look like occasions and only some of them are: **time of year** (the holidays, the
seasonal board), **moment in life** (a new baby, in-laws for a week, moving), **type of day** (a
long day, a day off, a snow day). Whether all three are the same kind of thing is an open question
and T-013-01 settles it.

It also settles a question the board has been ducking. `counters.md` defines a counter as a shop,
and the namespace **already stretched once** — Instant Pot, One Pot, The Slow Cooker and The Air
Fryer & the Pot are bargains, not shops, and T-003-01 said so out loud when it opened them. An
occasion would be a third kind of thing in the same field. **That may be right and it may be one
stretch too many**, and it is a decision, not a detail.

And nothing here opens a shelf until **T-012-02** has said whether the collection can feed one.
The reading that ticket is doing found roughly eight non-starch vegetable sides against a hundred
and one desserts; an occasion shelf built on a collection that cannot supply it is the same
failure as the cookbook, with better tooling.

## Shape of the work

- **T-013-01** writes the method down: what an occasion is, how one is established from what
  people sell, and what makes a hall of famer *for that occasion*. Needs **T-011-01**'s scaling
  model and **T-012-01**'s personas.
- **T-013-02** models the meal rather than the dish — why six reasonable recipes make an
  unreasonable afternoon. **T-011-05 already forward-declared this**, and it is the differentiator.
- **T-013-03** proves the method on two occasions that invert each other, and reports whether the
  shelf could feed either. **It opens no counter.**

## Conventions

`docs/knowledge/voice.md` governs the language and it bites hard here. An occasion shelf is where
this site would most easily start sounding like a magazine — *festive*, *effortless entertaining*,
*crowd-pleaser*. **None of those words describe anything.** The register is the same as everywhere
else: what it is, what it costs you, and what happens if you are late.

And S-011's rule holds without exception: the analysis is O(·) in the knowledge files and never on
a page a cook reads.
