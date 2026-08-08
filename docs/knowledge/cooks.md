# Cooks

**Read this before you build anything a person has to be right about.** Every filter, dial and gate
on the board is a guess about a reader, and until now the guess was never written down.

A cook on this page is a **situation, its constraints, and the contradiction that makes it hard**.
Not a name, not a photograph, not a job title. The reason is practical rather than tasteful: a list
of preferences cannot fail a design. A contradiction can. *"Wants variety"* approves of everything;
*"wants variety and small batches, and those fight"* tells you the moment your proposal has quietly
served one half and called it done.

The three below came from the person this collection is for, and are recorded in
[S-012](../active/stories/S-012-who-is-actually-cooking.md). **There are three, and there is not a
fourth.** The tempting fourth — somebody who cooks alone on a Tuesday and hosts at Christmas — is
two of these three in different weeks, and giving them a section would mean inventing a person to
hold the average. Where a detail was needed that they did not give, it is a question in
[What the three did not say](#what-the-three-did-not-say) and is marked `(assumption)` where the
text leans on it. Nothing here is filled in quietly.

The counts of what the site says are from 7 August 2026, over 685 recipe files. Sibling arguments:
[counters.md](counters.md) settled what a counter is, [voice.md](voice.md) settled who is reading a
recipe page, [scaling.md](scaling.md) settled what cooking more of a thing costs.

---

## The three, and what pulls in two directions

| The situation | The contradiction | What it costs when a design gets it wrong |
| --- | --- | --- |
| [Cooking for the day](#cooking-for-the-day) | **Variety and small batches fight**, and every shelf here resolves it toward the batch | You hand back one big pot and call it two dinners. They eat it twice and stop trusting the shelf |
| [The family rotation](#the-family-rotation) | **The decision is the cost, not the cooking** — so any feature offering more choice makes the problem worse | You add search, filters and a bigger collection, and the household orders takeout faster than before |
| [Holiday guests](#holiday-guests) | **More hands and more overload at the same time.** Help has a coordination cost | You assume help is free, promise an evening that needs three people to know what they are doing, and hand over a plan nobody can follow |

The third column is the point. A page that only summarises the three is a poster; a page that says
what a wrong answer does to them is something a later ticket can be held against.

---

## Cooking for the day

**The contradiction: variety and small batches fight each other.** Enough different things to be
worth eating means several dishes. Enough of any one dish to be worth cooking means leftovers of it.
Cook once and eat twice, and the second time is the same thing again — which is the failure they
named. Cook four things and you have spent the evening. **Every shelf on this site resolves this
toward the batch**, because a recipe is a batch: one table, one yield, one `>> servings:` line.

**The situation.** One person, peeling off a small enough recipe to use up what is in the fridge
without a store run. It cannot be too oily or too salty, and it cannot be lacking nutrition. Left to
default they find themselves on meaty mains and heavy starches — eating, in their words, *more like
cattle than a zoo animal*. They will not accept four dishes to cover two meals. Two servings of the
same thing in one day gets old fast. They are open to side dishes, but not to a side dish that sends
them to the shop.

**What would resolve it.** Anything that makes one cooking session end in **two different dinners
rather than one dinner twice** — the same work, the same pans, more than one thing on the plate at
the end. That is the property. Reaching it is not this file's business.

**What would only look like it does.** Three moves are available today and none of them is a
resolution:

- **A bigger yield.** Resolves the batch half by making the variety half worse. This is the default
  the collection already produces.
- **A "quick" filter.** Answers a question they did not ask. Their limit is not the clock — a
  forty-minute roast they can walk away from is fine; thirty unbroken minutes at a pan is not, which
  is exactly what [S-010](../active/stories/S-010-after-a-long-day.md) is built on.
- **More recipes.** They cannot shop. A recipe they cannot cook tonight is not an option, and the
  collection has no way to tell which ones those are.

| What they need to know before committing | What the site says | How complete that is |
| --- | --- | --- |
| Can I make this from what is already here? | The ingredient list, and the search box over ingredient names | **The nearest miss in the collection.** The pantry is written down and runs the other way — see [Cooking from what is already in the fridge](#1-cooking-from-what-is-already-in-the-fridge) |
| How long am I actually standing there? | `handsOnMinutes`, computed in `src/lib/schedule.ts` | Answered, and honest about itself: `assumedHandsOnMinutes` says how much of it nobody claimed, `untimedCount` says how many steps never said |
| Is it thirty unbroken minutes or three ten-minute jobs? | `longestHandsOnMinutes` | Answered, and this is the number their sentence is really about |
| What is in the sink afterwards? | `>> washing-up:`, the list, count derived from it | 177 of 685 files. Absent is a real answer and not a zero |
| What happens if I get it slightly wrong? | `>> slack:`, a level **and** a reason | 416 of 685 files |
| Does it give me a different dinner tomorrow? | Nothing | `keeps` (T-011-04) would say whether it survives to Thursday; it would not say whether it is a *different* dinner |
| Can I cook half of it? | `MULTIPLIERS` in `src/lib/plan.ts` offers ×1/2 | Halves the amounts. Whether halving changes anything about the cooking is `capacity` (T-011-02), **designed and not built** |
| Is this heavy again? | Nothing. No field, no filter | See [Balance, and breadth of plants](#2-balance-and-breadth-of-plants) |

---

## The family rotation

**The contradiction: the cost is the decision, not the cooking — so every feature that offers more
choice makes the problem worse.** This is the most useful sentence in this file, because it inverts
the instinct that produced almost everything on the board. A bigger collection, a better search box,
another filter and a smarter sort are all *more decisions*, delivered to somebody whose complaint is
that deciding is what wears them out. They are not short of options. They are short of a reason to
stop looking at them.

**The situation.** They want the household off takeout. What taxes them is polling everybody for
preferences, and the shopping haul that follows from whatever gets agreed. What the household will
like is hard to forecast. Seasonal produce and store sales pull the shopping around, so cheap
standbys — beans above all — get neglected although they were always an option. The result is path
dependence: the same meaty, salty items come round again, which makes weight loss and heart health
hard to manage, and they accidentally commit to more kitchen time than they meant to.

**What would resolve it.** Anything that **produces a defensible answer without asking anybody a
question**, including without asking *them*. The test is the number of decisions before dinner, and
it has to go down.

**What would only look like it does.**

- **A recommendation the household still has to approve.** The polling is the cost. Moving it later
  in the week does not remove it.
- **A preference setting.** A preference has to be collected, and collecting it is the polling.
  Anything built here runs straight into this wall — see
  [A rotation that does not need polling](#4-a-rotation-that-does-not-need-polling).
- **A better shopping list.** The haul is a real complaint and the list is genuinely good at it, but
  the haul is downstream of the decision. Halving the trip does not halve the deciding.
- **Filters for salt, fat or repetition.** Each one is another dial, and dials are decisions.

| What they need to know before committing | What the site says | How complete that is |
| --- | --- | --- |
| What am I committing to in kitchen time? | `totalMinutes` for elapsed, `handsOnMinutes` for the part they stand through | Answered, per recipe. Nothing sums a week |
| What is the shopping haul? | `/list/` builds it from the plan, `src/lib/shopping.ts` names things the way a shop does and puts them in an aisle | Answered, and the best-served question they have. `src/data/staples.json` — 31 staples and a written rule for where the line is — lifts out what they already have, and `isMoreThanAJar()` puts a staple back on the buying side when the amount is large |
| Did we have this recently? | Nothing | `src/lib/plan.ts` holds a plan, not a history. See [A rotation that does not need polling](#4-a-rotation-that-does-not-need-polling) |
| Will the household eat it? | Nothing | `>> pairs-with:` (434 files) is about which dishes go together, not which people like them |
| Is this meaty and salty *again*? | Nothing | No field records it, and the shelf itself is the deeper problem — see [Balance, and breadth of plants](#2-balance-and-breadth-of-plants) |
| Are the beans still an option this week? | The counters, `>> counters:`, and the categories | The food is there — `rice-beans-and-grains` is a real shelf — and nothing surfaces it against what has already been eaten |
| How much of this survives to be eaten later? | Nothing | `keeps` (T-011-04), **designed and not built** |

---

## Holiday guests

**The contradiction: more hands and more overload arrive together.** Help is not free. Every job
handed to somebody else has to be described, sequenced, checked and fitted around the jobs nobody
can take, and that describing is work the cook does alone and in their head. **A recipe that is easy
to cook alone can be harder to hand out in pieces**, and nothing on this site knows the difference.

**The situation.** Hosting a couple and a niece for a few days. The living space is cramped; there
are more mouths and **more hands**. The cook has shifted into supervisor and coordinator, which is a
new mode, and the overload is informational rather than physical — not *I am tired*, but *I am
holding too much at once*. It is hard to stave off the pull of heavy holiday food. They want to
impress the in-laws at the big meals.

**What would resolve it.** Anything that **moves a piece of the plan out of the cook's head and into
a form somebody else can act on** without the cook having to narrate it. The measure is how much the
cook still has to hold, not how many minutes come off the clock.

**What would only look like it does.**

- **Assuming help is free.** This is not hypothetical — it is the assumption the code already makes,
  and it is the third entry in [What is missing](#3-work-that-can-be-handed-to-somebody-else).
- **A longer timeline.** More detail to hold is more overload, not less, when the overload is
  informational.
- **A "serves 12" button.** Twelve portions of some dishes is one pot and of others is four
  batches; the plan page currently says `× 3` for both, which [S-011](../active/stories/S-011-what-doubling-costs.md)
  calls the collection's one uncaught invented number.

| What they need to know before committing | What the site says | How complete that is |
| --- | --- | --- |
| How long is the whole thing, end to end? | `totalMinutes` — the critical path, not the sum | Answered, per recipe. Nothing composes a meal of several |
| What can I do before anybody arrives? | `unattendedMinutes`, and the schedule's `lanes` show what runs alongside what | Close, and not it. Nothing marks a step as *do this the day before*; the split is attention, not calendar |
| What can I hand to somebody else? | Nothing that says so | `lanes` in `src/lib/schedule.ts` is the nearest thing and was not built for this — see [Work that can be handed to somebody else](#3-work-that-can-be-handed-to-somebody-else) |
| How many pans does this occupy at once? | Nothing | `>> washing-up:` counts what is dirty at the end, which is not the same question. `capacity` (T-011-02, **not built**) would say what one vessel holds, not how many are wanted at once |
| Does it hold if dinner slips an hour? | `>> slack:` — level and reason | 416 of 685 files, and the field is exactly right for this reader |
| Does this scale to the table? | `>> servings:` on every file, `MULTIPLIERS` on the plan page | Amounts scale. The clock does not move, which is a live defect S-011 owns |
| Is the whole week heavy? | Nothing | See [Balance, and breadth of plants](#2-balance-and-breadth-of-plants) |
| Will the in-laws be impressed? | Not a question this site can answer, and it should not try | Recorded because it is real, and because a design that quietly reframes it as *difficulty* has changed the subject |

---

## What is missing

Four things the three of them ask for that the collection cannot do. Each says what it would take —
**what the work is, not what to build.** They are numbered for reference and the numbers are not an
order: **this file does not rank them.** T-012-02 does, and ranks from what the shelf can actually
support rather than from these three.

### 1. Cooking from what is already in the fridge

`src/data/staples.json` holds 31 staples and a five-clause written doctrine for *where the line is*
between the pantry and the shop — bought-once-and-spent-by-the-spoonful is a staple, anything wanted
by the cup or the pound is shopping, fresh is shopping even where dried is a staple, universal
rather than cuisine-specific, and a large amount is shopping whatever the file says. `/list/`
already uses it to split a shopping list into what to buy and what you probably have.

**All of it runs recipe → list.** Nothing runs it backwards. There is no way to say *here is what I
have* and get back *here is what is within reach tonight*.

**What it would take.** A reading in the other direction, which is a different problem and not a
rearrangement of this one. It needs the pantry **assumed rather than typed**, or the first person
will be listing salt; the doctrine in `staples.json` is already the argument for which things those
are. It needs *all of these and nothing else* rather than one ingredient at a time —
`src/pages/search.json.ts` joins title, category, counters, `aka`, tags and ingredient names into
one free-text blob, which finds a recipe that mentions chickpeas and cannot tell you whether you can
finish it. And it needs a decision about how close is close enough, because a recipe missing one
ordinary thing is a different answer from one missing four.

### 2. Balance, and breadth of plants

No field records it, no filter offers it, and — the part that matters most — there is very little of
the food. S-012 measured the shelf at 658 recipes and found 103 stews and braises, 101 sweet things,
59 rice-beans-and-grains, 23 salads and **18 vegetables-and-sides**, five of them potato, yam or
corn and five more arriving as one block from another story; meat tags at 225 against 32
`vegetarian`. That measurement is the story's and is deliberately not re-taken here.

**What it would take.** Two separate things, and the second is the hard one. A fact about a dish
that nobody has agreed on yet — this site refuses ratings it cannot justify, and *balance* is a word
that would have to be turned into something measurable before it could be printed. And enough food
for an answer to be worth returning: a balance dial built on this shelf hands the same handful of
files to everybody, forever, which is a worse lie than saying nothing. T-012-02 measures this
properly.

### 3. Work that can be handed to somebody else

`src/lib/schedule.ts` builds the dependency graph the table already is, packs it into `lanes`, and
states its own assumption in the `Schedule` interface (`src/lib/schedule.ts:63-66`):

> The schedule also assumes you have as many hands as the tree has branches; it never delays one
> hands-on task for another.

**That assumption is wrong for the first two and right for the third**, and the same sentence is
therefore a bug and a feature depending on who is reading the page. For one cook it silently
promises that the glaze gets made while the onions are being watched. For a kitchen with a couple
and a niece in it, it is a fair description of the room.

The collection has already noticed half of this without noticing the whole. The same file corrects
itself for one number — `longestHandsOnMinutes`, at `src/lib/schedule.ts:306-322`:

> The schedule above assumes as many hands as the tree has branches — it never delays one hands-on
> task for another — which is right for a timeline and wrong for this number. A person with two
> hands-on jobs running at once is doing both, one after the other.

So there are two models of how many cooks there are living in one module: a many-hands model behind
`lanes`, `criticalPath` and `totalMinutes`, and a deliberate one-cook model behind
`longestHandsOnMinutes`. **The multi-cook model is half-built by accident**, and it was never argued
as a model of a household — it is a property of reading a graph.

**What it would take.** Deciding how many cooks a page is talking about, and saying so where a
reader can see it. That is a question about the reader, not about the graph, which is why it has
gone unanswered: nothing in the code was ever wrong enough to fail a test.

### 4. A rotation that does not need polling

`src/lib/plan.ts` holds a plan: a list of `{ slug, multiplier }` under one `localStorage` key, with
a version, a change event and careful handling for a browser that refuses to store anything. It is
good at what it does.

**Nothing holds a history, a preference, or a week.** There is no date anywhere in it. Clearing the
plan leaves nothing behind, so the site cannot know that beans have not come round since March, and
cannot know that they were liked.

**What it would take.** Something with a date in it, and an answer to whose preference is being
recorded — which runs straight back into the second person's contradiction, because **a preference
that has to be collected is the polling they are trying to stop.** Whatever resolves this has to get
its evidence from what already happened rather than from asking, or it has rebuilt the problem with
a nicer interface.

---

## Holding a design against these

The file is only worth writing if a later ticket can hold something against it and get an answer.
Here is one, worked: **S-010's three dials** — *time you're standing there* (`handsOnMinutes`), *on
the table by* (`totalMinutes` as a cap), *things to wash* (the count derived from `>> washing-up:`)
— with three answers rather than two, so a recipe nobody annotated is shown and marked rather than
quietly passed or quietly hidden.

| The situation | Verdict | Why |
| --- | --- | --- |
| Cooking for the day | **Passes** | Every dial is aimed at their evening, and the refusal to collapse them into one difficulty score is what keeps *forty minutes I can walk away from* separate from *thirty minutes at the pan* — the distinction their complaint is made of. It does not touch their contradiction, and it does not claim to |
| The family rotation | **Fails** | Three dials is three more decisions handed to somebody whose cost **is** the deciding. It answers *which of these should I cook* with *tell me more about what you want*, which is the shape of every move that makes their week worse. The dials are not wrong; they are aimed at the other person |
| Holiday guests | **Cannot say** | Nothing in the dials is false for them, and nothing in them is about what is hard. *Time you're standing there* is computed as though the tree's branches each had their own pair of hands, which for once is nearly true of their kitchen — so the number is more right for them than for anybody else, and it measures the wrong thing, because their overload is informational. A dial that told them what to hand to the niece would be the one that counted |

Three verdicts, one of each, and the middle one is the result: a feature can be well built, honestly
measured, argued at length, and still be aimed at one of three people. Nobody did anything wrong —
S-010 says on its own first line that it is answering *what can I cook when I have nothing left*,
which is the first person's question. The failure only becomes visible when there is a page listing
the other two.

**The same method on S-011's capacity**, briefly. Capacity — how many servings the limiting vessel
holds, named with its vessel — **passes** for the third person, because it is the difference between
one pot for twelve and four baskets one after another, and four baskets is an evening they cannot
supervise. It is **silent** for the first: at one person's scale nothing batches, so the number
never binds, which is the story's own reading and not a defect. For the second it is **silent too**,
one step removed — it would make a week's kitchen time honest, and honest arithmetic about a
decision they have not made yet does not help them make it.

**The rule this file is for:** a design **passes** when it changes what the person's contradiction
costs them, **fails** when it serves only the half of the contradiction that was already served, and
is **cannot say** when the source material does not settle it. Cannot-say is a real verdict here,
for the same reason it is a real answer in S-010's filter: guessing at a person is the failure this
page exists to prevent.

---

## What the three did not say

Six questions the source does not answer. They are written as questions, not filled in. Where the
text above leans on one it says `(assumption)` and points here; nothing above does, which is itself
the finding — every section could be written without them.

1. **How many days is *the day*?** One person clearing the fridge — is the horizon tonight, or
   tonight and tomorrow? Their objection to *four dishes for two meals* implies at least two meals,
   and no more than that is stated.
2. **How many people are in the household?** The rotation is for a household of unstated size, which
   is the number every scaling answer would need.
3. **Does anybody have a restriction?** Weight and heart health are named as goals, not as
   restrictions. Whether anyone must avoid a food is unknown, and the difference matters: a goal can
   be traded against, a restriction cannot.
4. **What is in each kitchen?** No equipment is named for any of the three. The collection has 58
   files declaring a `>> kit:`, and which of them are reachable by whom is unknown.
5. **How much of the holiday is the big meals?** *Impress the in-laws at the big meals* implies
   other meals that are not, and their share of the few days is unstated.
6. **How long is *a few days*?** Two nights and five nights are different problems, and the
   difference decides whether keeping matters.

Anyone answering these should edit this file rather than the ticket that asked.

---

## What this file does not do

- **It does not rank the four missing things.** T-012-02 ranks, argued from what the shelf can
  support.
- **It does not re-measure the collection.** The shelf numbers here are S-012's, taken at 658 files;
  the field counts are from 7 August 2026 at 685 files and will drift.
- **It does not propose a field, a dial, a filter or a page.** A knowledge file that starts
  recommending features stops being the thing later work can be tested against.
- **It does not invent a fourth person.**

Correct it when the person it came from says something different, or when a design is held against
one of the three and the verdict is obviously wrong — that is the file failing, not the design.
