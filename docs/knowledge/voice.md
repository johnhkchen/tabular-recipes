# Voice

**Read this before you write a recipe file.** It is one page. It says who you are writing for,
which of the five places words can go is the right one, and how long each is allowed to be.

---

## Who is reading, and what they are holding

Somebody standing in a kitchen with a packet of dried lotus seeds in one hand.

Everything follows from that:

> **A sentence about the dish is for them. A sentence about how the site works out its numbers
> is not.**

The table does arithmetic. It adds up the waits, works out which ones overlap, guesses from the
step whether you have to stand there. All of that is true and none of it is soup. Put the
honesty in the number — *about 3 hr 30 min* — not in a paragraph beside it explaining why the
number might be off. A cook who wants to know how the timings were worked out is not on this
page.

The same goes for the second thing, and it is the one people write by accident:

> **Anything comparing this dish to its shelf-mates goes on the counter's menu, not here.**

*"This is the one bean dish on the shelf where slow beats pressure outright"* is a real
observation. It is just in the wrong room — the menu is where you can see both dishes at once.
What stays on the recipe page is only what changes how you cook it.

---

## Where the words go

Five places carry words. Three of them are being used for the same job today, which is why this
page exists.

| The line | Where it lands | What it is for | What does not go here |
| --- | --- | --- | --- |
| `>> step.N:` | the operation cell | The verb and its numbers. *"boil hard, lid off, 20 min"* | Why. Anything that is not doing. |
| the step's own words | **nowhere**, once `step.N:` is set | Naming the ingredients and what you do with them. | Essays. Nobody will ever read them. |
| a step with no ingredients | a full-width row above or below the table, **printed three times** | The one thing you must know before you start. One sentence. | A headnote. A story. Anything the steps already say. |
| `>> slack:` | under the timeline | What actually goes wrong, and whether it comes back. | How long it takes — that is the clock, two lines up. |
| an ingredient `(note)` | inside the ingredient cell, beside the amount | Which one to buy, and how to cut it. *"scaled and gutted, then dried"* | What it does for the dish. Where the name comes from. |

Two things about this you cannot see from inside the file:

**A full-width row is printed three times.** Once in the table, once in prep, once in cook. A
hundred words there is three hundred words paid. It is the most expensive sentence on the page,
so it had better be the most useful one.

**A `>> step.N:` line throws your paragraph away.** Not shortens — throws away. The step's own
words stop being rendered anywhere except inside the collapsed *See how it is written* block,
where they show up as raw cooklang with `@&(~1)scrubbed bones{}` in them. **There are 172,003
characters in this collection that nobody has ever read**, spread over 2782 steps in 637 recipes.
It was 278,833 before S-005 cut it; the mechanism that makes it is unchanged, so the number will
grow again if nothing watches it. If it matters, it goes in the cell, in `slack:`, or in a
full-width row. If it is not worth putting in one of those, it is not worth writing.

---

## One fact, three lengths

`recipes/soups/tonkotsu-broth-instant-pot.cook` used to say the same thing three times. The fact
is that a sealed pot can pull the bones apart but cannot turn the broth white.

**The opening paragraph — 472 characters, and nobody saw it:**

> The pot does the extraction and does it in an afternoon instead of a day. What it cannot do
> is the emulsion: a sealed vessel holds the liquid still, and still is the one thing tonkotsu
> is never allowed to be. So this is not eight hours made faster — it is ninety minutes of
> pressure to take the bones apart, and then twenty minutes of the hardest boil your burner
> will give, uncovered, which is where the broth turns white. Skip the last step and you have
> a clear, thin, grey pork stock.

**`>> slack:` — 250 characters:**

> narrow — the pot does the extraction and cannot do the emulsion, so the twenty minutes with
> the lid off at the end is the whole white of it, and a broth not boiled hard there stays thin
> and grey; the parboil before it is the only scum you ever get to take out

**`>> step.1:` — 132 characters, and this was the one that printed:**

> The pot does the extraction. It cannot do the emulsion, and the last twenty minutes with the
> lid off are where the white comes from.

Three drafts of one sentence, filed in three places, and the reader met it twice on the page.
Nobody wrote it three times on purpose. The paragraph came first; when it would not fit the
cell, a `step.1:` was bolted on to rescue the table; the paragraph stayed, unread, and the same
fact leaked into `slack:` because that was the next empty box. **That is the mechanism, and it
is still the clearest thing on this page. What follows is what was actually done about it.**

### What the file says now

| The line | Was | Is |
| --- | ---: | --- |
| `>> step.1:`, which prints as the row | 132 | *The pot does the extraction. It cannot do the emulsion.* (55) |
| `>> slack:` | 250 | *the twenty minutes with the lid off is the whole white of it, and a broth not boiled hard there stays thin and grey* (115) |
| the step 1 paragraph | 472 | 72, and still rendered nowhere |

**This page originally said the fix was to pick one of the three. That is not what was built, and
what was built is better.** All three were shortened and each was given a different job: the row
frames what the machine can and cannot do, `slack:` says what goes wrong if you cut the boil
short — the different fact this page asked for by name — and the label on step 5 says
*boil hard, lid off, 20 min — this is the colour*.

So the fact is still on the page more than once. The test that matters is not *how many times*
but *is each one doing a different job*: a frame, an instruction, and a failure are three jobs. A
paragraph arguing for the instruction is not a fourth one, and that is the part that went.

---

## The house tests

Three, and you can apply all of them without measuring anything.

1. **Would a friend say it at a kitchen table?** Not "the shortest stretches keep a sliver",
   not "we worked out from the step whether you have to be there". If you would not say it out
   loud to somebody chopping onions, it does not go on the page.

2. **Does it change how you cook it?** If it does, keep it. If it does not, it is either shelf
   talk — which goes on the counter's menu — or it is the site explaining itself, which goes
   nowhere.

3. **Say it once.** Before you write a sentence, check the other four places. If the operation
   cell already has it, `slack:` does not need it. If `slack:` has it, the headnote does not.

---

## How long

`scripts/check-recipes.mjs` counts these on every `npm run check` and prints anything over,
worst first. **The caps are the ceiling, not the aim.**

| The line | Cap | Aim for |
| --- | ---: | --- |
| `>> step.N:` operation cell | 70 | 25 — a verb and its numbers |
| the step's own words, once `step.N:` is set | 150 | one sentence that names the ingredients |
| a full-width row | 120 | one sentence. It prints three times |
| `>> slack:` reason | 200 | about 120 — one breath |
| an ingredient `(note)` | 80 | 15 — which one, cut how |

`scripts/check-recipes.mjs` holds the numbers; this table is the readable copy. Change the
script, then change this.

Two of these are worth knowing the story behind. The operation cell is the one surface that
already works — 3077 of them, mean 24 characters — so its cap is a ratchet at the current
ceiling rather than a cut, and you should not need to think about it. `slack:` was the opposite:
when these caps were written, 304 of the 397 declared lines were over. They are all under now —
`p50 111 · max 151` — but **78 are still above the aim**, and that is on purpose: several of them
carry two facts that both belong, like `cha-lua`'s 50°F *and* 165°F. 200 is where the checker
complains; one breath is about 120, and *"al dente is the last thing to happen and it does not
wait; overshoot it and you have porridge, which is a different dish"* is 120 and says everything.

The checker **fails the build** on anything over a cap. Nothing is exempt and no file has a
waiver — there is no skip list in `measure()` and there should not be one. If you think a cap is
wrong, move the number in `CAPS`, say what you measured in the comment beside it, and change the
table above. Do not carve out the file that disagrees with it.

---

## What changed, and when

This page was written by T-005-01 before any of the cutting happened. Four passages have been
corrected because a ticket decided something different from what was written here. The rules
themselves — who is reading, the five places words can go, the three house tests, the five caps —
are unchanged, because nothing decided differently about those.

- **The unread-body count is 172,003, not 278,833.** T-005-06 cut 844 bodies across 358 files.
  The count of overridden steps did not move: 2782 in 637 recipes, before and after.
- **The tonkotsu example describes what was built, not what this page prescribed.** This page
  said *pick one of the three*. T-005-04, T-005-05 and T-005-06 shortened all three and gave each
  a different job, which is better. The diagnosis above it is unchanged and still the clearest
  statement of the mechanism in this document.
- **`slack:` is no longer "almost every declared line is over".** T-005-04 brought 304 over-cap
  reasons to zero and deliberately left 78 above the 120 aim, arguing that a line carrying two
  real facts is worth 130 characters. The aim stands; the exception is now written down.
- **The checker fails rather than reports.** T-005-07 flipped `CAPS_FAIL_BUILD` after bringing
  the last field — 17 ingredient notes on the Cantonese soup shelf — under cap. No cap moved in
  either direction and nothing was exempted.

What the story did **not** fix is a separate page: [`docs/gaps/voice.md`](../gaps/voice.md),
ranked, with the measurements.
