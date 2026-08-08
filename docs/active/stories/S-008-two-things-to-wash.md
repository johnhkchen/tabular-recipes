---
id: S-008
title: two-things-to-wash
type: story
status: open
priority: high
---

## Why

**This site has three shelves that promise less work and no way to check whether any of them is
telling the truth.**

One Pot (68 recipes) — *"Everything goes in one pan, and that is the only pan to wash."*
Instant Pot (25) — *"Lock the lid and walk away."* The Slow Cooker (20) — *"Fill it before you
leave."* Three claims about a cook's evening, and `docs/gaps/one-pot.md` already says out loud
what is wrong with the first one:

> the *promise* of the counter is a claim about the washing-up, and washing-up is not a row in
> a table.

That page then proves it. `general-tsos-chicken`, `orange-chicken`, `sesame-chicken` and
`sweet-and-sour-pork` each declare **one** `#wok{}` and nothing else, and each is a quart of
frying oil, a bowl to velvet in, a shallow one to dredge in, a rack to drain on and a third bowl
for the glaze. Four things on the shelf were one pot on paper and five things to wash in a
kitchen. They were caught by a person reading the page as a menu — not by any check, because
there is no check, because there is nothing to check against.

**The `cookware` list cannot do this job and it is worth saying why once.** It is derived from
the `#thing{}` marks in the body, so it counts what a recipe *names*. A recipe that boils
something in water it never calls a pot declares less cookware than it uses; a recipe that names
a `#mixing bowl{}` twice declares one. It is evidence, and `docs/gaps/one-pot.md` reached exactly
that conclusion when it ranked 114 candidates off that line and then threw 61 of them off the
shelf by hand.

## What this adds

**A `washing-up` line every recipe can declare: the things that actually go in the sink.**

This is the same move S-003 made and for the same reason. That story added `slack` because a
shelf promising "walk away" and then handing a cook a narrow window has lied to them, and there
was no way for a recipe to say which it was. This is the third cap in that pair's family:

| Already there | Says |
| --- | --- |
| the clock | how long, and how much of it you stand there |
| `slack` | what happens if you get it wrong |
| **`washing-up`** | **what is in the sink at the end** |

**It is authored, never derived.** Same rule `slack` carries, and here the evidence for it is
already on the shelf: the four wok recipes above would pass any formula run over `cookware`.
A cook knows what they washed. A parser does not.

**It pays off everywhere, not only on the new shelf.** One Pot can finally prove its own claim,
Instant Pot can show which of its braises brown in a separate skillet first, and a reader
choosing between the pressure version and the plain one gets the one fact that actually decides
a Tuesday.

## The counter

**The Air Fryer & the Pot** — *plug one in, eat, wash two things.*

The site has **zero air fryer recipes**. No `.cook` file declares `kit: Air Fryer`; the only
trace of the machine anywhere is `src/lib/icons.ts:319`, where `air fry` already maps to an oven
icon. It is the most common countertop appliance in the collection's audience and the collection
does not know it exists.

The shelf is not "air fryer recipes", though, and that distinction is the story. It is a gate,
and every item on it passes all three bars:

1. **`washing-up` of two or fewer.** The basket and a plate. The pot and a chopping board.
2. **One plug-in machine does the cooking.** Air fryer or Instant Pot. Not a hob and then a
   machine; not a machine and then a grill.
3. **On the table in 45 minutes**, wall-clock, pressurising and resting included.

**A gate, not a genre, is what makes this a fourth less-work shelf worth having.** One Pot holds
68 recipes and a good many of them are three-hour braises. Instant Pot holds 25 and some of them
brown in a skillet first. Neither shelf can currently tell you which of its items clears these
three bars, and the intersection is the thing a person actually wants at half past six on a
Tuesday.

**The risk, stated up front:** the gate may be too tight. If fewer than about twenty-five
recipes clear it once the pool is annotated, the finding is *the gate is wrong* or *the shelf is
thin*, and T-008-05 reports it. **It does not loosen the bars quietly to fill a page** — a shelf
that admits a 90-minute recipe to look fuller has become the thing this story exists to fix.

## Shape of the work

- **T-008-01** builds the property: metadata, parse, validation, render, tests, README. Depends
  on nothing and should start immediately, because everything else needs it.
- **T-008-02** opens the counter and writes the work list. It holds `src/data/counters.json`, so
  it waits for **T-007-05**, which holds the same file for S-007.
- **T-008-03** annotates the candidate pool — every One Pot, Instant Pot and Slow Cooker recipe —
  so the gate can be applied to something.
- **T-008-04** writes the air fryer recipes. `.cook` files only.
- **T-008-05** shelves it, applies the gate, and reads the result.

## Conventions

Everything in `README.md` holds: one table per recipe, a merge tree, 5 to 16 ingredient rows, 3
to 6 operations, every timer named, `aka` carrying what a person would actually say.

**Never fabricate a number**, and on this shelf that lands on the air fryer hardest. Basket
machines differ by several hundred watts and by basket geometry, times are not oven times
scaled, and a recipe that says "12 min at 200°C" without saying it was cooked in a basket of a
stated size has invented a number. Say the machine, say the load, and say what to look for
instead of the clock where the clock cannot be trusted.

**`kit: Air Fryer` means a variant exists and is written**, never *this would probably adapt*.
`scripts/parse-recipes.mjs` enforces that only one file per `dish` omits `kit`, so an air fryer
version of something already here is a `kit:` sibling, and an air fryer dish with no plain
counterpart carries no `kit` line at all. Both are correct; getting them backwards is a build
error.
