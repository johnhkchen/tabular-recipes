---
id: S-010
title: after-a-long-day
type: story
status: open
priority: high
---

## Why

**The site can already answer "what can I cook when I have nothing left", and there is no way to
ask it.**

Every recipe page carries a clock that separates the time a dish takes from the time you stand
there for it. `src/lib/schedule.ts` computes both, per recipe, and more besides:

| Already computed | What it is |
| --- | --- |
| `totalMinutes` | elapsed — the critical path, not the sum |
| `handsOnMinutes` | how much of it you are standing there for |
| `unattendedMinutes` | how much of it you are not |
| `assumedHandsOnMinutes` | how much of the hands-on figure nobody actually claimed |
| `untimedCount` | operations that never said how long they take |

`slack` says what happens if you get it wrong, on 395 of 658 files. `washing-up` — S-008 — says
what is in the sink.

**All of it stops at the recipe page.** `src/pages/search.json.ts` indexes title, category,
counters, `aka`, tags and ingredient names, and nothing else. The front page can find you a dish
by what you ate or what is in the fridge, and it cannot find you a dish by the one thing that
actually decides a Tuesday. There is no filtering UI anywhere on the site — the only interactive
control is a text box.

## What the filter is actually for

*Low-touch and medium-length is fine — a sheet pan of vegetables that roasts for forty minutes
while you sit down. Standing over a pan stirring for thirty is not.*

That sentence is the whole specification, and note what it is **not**: it is not "quick". A
forty-minute roast beats a twenty-minute stir-fry on the evening it matters. **Elapsed time is
the wrong axis and the site already knows it** — that distinction is why the clock was built
with two numbers instead of one.

So the dials are the ones a tired person actually turns:

1. **Time you're standing there** — `handsOnMinutes`. The primary one.
2. **On the table by** — `totalMinutes`. A cap, not a target.
3. **Things to wash** — `washing-up`, from S-008.

And one number that does not exist yet and should: **the longest stretch without a break.**
Thirty minutes of hands-on split into three ten-minute jobs around two waits is a different
evening from thirty unbroken minutes at the hob, and `handsOnMinutes` alone cannot tell them
apart. The task graph can — a run of consecutive hands-on tasks with no wait between them — and
it is the difference between the two dishes in the sentence above.

## No difficulty score, and this is a decision rather than an omission

The obvious shape for this is a single rating — easy, medium, hard — and this story deliberately
does not build one.

This repo refuses ratings it cannot justify, consistently and on the record. The clock will not
invent a duration. The shopping list returns null rather than compare grams to cups. `slack`
exists as a level **and a reason** because, in S-003's words, *"'forgiving' alone is a vibe."*
A "difficulty: medium" chip would be the vibe with none of the reason, and it would average
together three things a cook is trading against each other rather than adding up. Somebody who
can stand at a pan for forty minutes but has no bowls left is not served by a number that mixed
those together.

**Three dials, each of which is a real measurement, each of which the reader sets for themselves.**

## The honesty problem, which is the hard part

**Hands-on is what the clock falls back to when a step says nothing.** That is the safe default —
promising a cook they can walk away when they cannot is the worse error — but it means an
under-annotated recipe collects hands-on minutes nobody ever claimed. `assumedHandsOnMinutes`
exists precisely to say how much of the figure is a guess, and `untimedCount` counts the
operations that never said.

Which produces the trap: **a recipe with no timers at all reads as no time at all.** Filter for
*under fifteen minutes standing* and it sails through, on no evidence whatever. 635 of 658 files
carry timers; the rest, and every untimed step inside the ones that do, are the recipes a naive
filter would recommend first.

So the filter has three answers, not two: **passes**, **fails**, and **cannot say**. The third is
shown, and shown as what it is. A filter that quietly hides a dish because nobody annotated it
has lied to the reader in exactly the way this whole site is built not to.

## Shape of the work

- **T-010-01** puts the numbers where a browser can reach them, and derives the longest unbroken
  stretch. It needs `washing-up`, so it waits for **T-008-01**.
- **T-010-02** builds the dials on the front page.
- **T-010-03** reads the result against the whole collection and records what the filter cannot
  say.

## Conventions

`docs/knowledge/voice.md` governs the labels. **These are dials a tired person reads at a
glance**, so they are named for what they measure in words somebody would say out loud — *time
you're standing there*, *on the table by*, *things to wash* — not *hands-on effort*, not
*active time*, not *difficulty*.

S-004 put this site on a phone and left `npm run verify:mobile` behind to keep it there:
`scripts/check-overflow.mjs` at 375, 390 and 768, and `scripts/check-touch.mjs` for target
sizes. **A filter is the first genuinely interactive control the site has**, and a tired person
is holding a phone. It passes both or it does not land.
