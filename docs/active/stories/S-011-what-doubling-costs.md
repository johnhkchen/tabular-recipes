---
id: S-011
title: what-doubling-costs
type: story
status: open
priority: high
---

## Why

**The site already scales recipes, and it already lies about what scaling costs.**

`src/lib/plan.ts` carries `MULTIPLIERS = [0.5, 1, 2, 3]` and a `scaleAmount` that triples the
chicken. `src/pages/list.astro:925` prints `serves 4 → 12`. **The clock does not move.** Triple a
pot of chili and that is true — the two-hour simmer is two hours for four portions or twelve.
Triple a basket of air fryer wings and it is a fabrication: the basket holds what it holds, so
twelve portions is four batches, one after another, and the twenty-five-minute recipe is now most
of two hours with you standing at it for all of them.

Both dishes say `× 3`. One of them means it.

This is the collection's one uncaught invented number, in a repo whose cardinal rule is that it
does not invent numbers — and it is uncaught because **how a recipe's cost grows with the number
of people is a property of the recipe, and nothing has ever recorded it.**

**Cooks already know this and the collection already half-says it.** 55 recipes carry the
knowledge as untyped prose — *"in two batches"* (19 files), *"in batches with room around every
piece"*, *"in two batches and let the fat climb back to 325°F between them"*. The fact is in the
files. Nothing can read it.

## The model

For a recipe written for `s` servings and cooked for `n`, the cost is not one curve. Each kind of
cost grows differently, and **the site already computes the split that decides it.**

**Unattended time is O(1) in n.** A braise is two hours because of what happens to collagen, not
because of how much collagen. A rise is a rise. A chill is a chill.

**Hands-on time is O(n).** Twelve onions take three times four onions. Shaping forty dumplings
takes twice shaping twenty.

Those two are not a new annotation. `src/lib/schedule.ts` already classifies every task as
hands-on or unattended, and has since S-003 — because a wait is a property of the food's physics
and work is a property of its quantity. **The scaling behaviour and the attention split are the
same fact seen twice.** The baseline model is free.

**The correction is capacity, and it is the whole trick.** When the limiting vessel holds `c`
servings, cooking for `n` means `ceil(n / c)` batches, run one after another — and the batch's
*unattended* time repeats with it. That is what turns an O(1) wait into O(n) elapsed:

| Dish | Capacity | At 12 servings | Elapsed | Standing there |
| --- | --- | --- | --- | --- |
| Chili | a big pot — not binding | 1 batch | **O(1)** | O(n), small constant |
| Air fryer wings | one basket, ~3 | 4 batches | **O(n)** | **O(n)**, and you reload every time |
| Sheet-pan vegetables | one pan | 3 batches | **O(n)** | O(n) |
| A braise | the Dutch oven | 1 batch | **O(1)** | O(n), small constant |

Capacity is the only thing an author has to write down, and it is a fact a cook knows without
thinking: *how many portions fit in the thing.* **Nobody is asked to write a complexity class.**
That would be a vibe in a mathematical costume, and this repo has refused that shape of thing
three times already — `slack` carries a reason because a level alone is a vibe, `washing-up`
derives its count from a list so the two cannot disagree, and the clock refuses to invent a
duration. The growth is *derived* from a measurement, or it is not worth printing.

## The two situations, which are not the same request

> Exhausted, two meals for one, for today.

n = 2. Nothing batches at that size, so capacity never binds and every recipe is O(1) in the only
way that matters. What decides is the flat cost: hands-on minutes, things to wash, and whether
you have to stand unbroken at a pan. **S-010's dials already answer this** — it is the small-n
case and it is done.

> Stressed, six people, over three days.

n ≈ 18 portion-meals, cooked once. Now the flat cost barely matters and **the growth is
everything**: the recipe you want is one whose elapsed time does not care how much of it there
is, whose vessel does not bind at eighteen, and — the part the phrase *over three days* smuggles
in — **which is still good on Thursday.**

That last one is a separate fact from scaling and this story treats it as one. A dish that scales
beautifully and dies overnight does not answer *six over three days*.

## Where the jargon stops

The model is O(·) in `docs/knowledge/scaling.md`, in `src/lib/scaling.ts`, and in the tests. It is
**never O(·) on a page a cook reads.**

The house rule is plain kitchen-table English, and a visitor sees the finding, not the notation:
*"Cooking three times as much costs you nothing extra."* *"Three times the people is three times
the batches — and three times as long standing there."* The analysis earns its keep by being
right, not by being visible.

## Shape of the work

- **T-011-01** writes the model down. No code. Depends on nothing.
- **T-011-02** builds `capacity` and the cost function. Needs **T-010-01**'s schedule numbers.
- **T-011-03** annotates capacity where a vessel actually binds, starting from the 55 files that
  already say it in prose.
- **T-011-04** adds `keeps` — whether the dish survives to Thursday. Independent of the rest.
- **T-011-05** stops the plan page lying. This is the ticket that fixes a live defect.
- **T-011-06** turns S-010's dials into a situation: how many people, over how many days, with how
  much left in you.

**T-011-04 is the one to cut if this story needs to be smaller.** Everything else is one argument.

## Conventions

Everything in `README.md` holds. Two rules bind harder than usual here:

**Never fabricate a number**, which is what this story is about. A capacity written because it
seemed plausible is worse than no capacity: an absent one leaves the plan page saying what it says
today, and a wrong one makes it confidently wrong in a new way.

**Absent is a legitimate answer**, the way it is for `slack` and `washing-up`. Most recipes are
not vessel-bound and should say nothing. **A capacity on every file would mean somebody guessed.**
