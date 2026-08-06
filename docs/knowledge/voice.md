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
where they show up as raw cooklang with `@&(~1)scrubbed bones{}` in them. There are 278,833
characters in this collection that nobody has ever read. If it matters, it goes in the cell, in
`slack:`, or in a full-width row. If it is not worth putting in one of those, it is not worth
writing.

---

## One fact, three lengths

`recipes/soups/tonkotsu-broth-instant-pot.cook` says the same thing three times. The fact is
that a sealed pot can pull the bones apart but cannot turn the broth white.

**The opening paragraph — 472 characters, and nobody sees it:**

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

**`>> step.1:` — 132 characters, and this is the one that prints:**

> The pot does the extraction. It cannot do the emulsion, and the last twenty minutes with the
> lid off are where the white comes from.

Three drafts of one sentence, filed in three places, and the reader meets it twice on the page.
Nobody wrote it three times on purpose. The paragraph came first; when it would not fit the
cell, a `step.1:` was bolted on to rescue the table; the paragraph stayed, unread, and the same
fact leaked into `slack:` because that was the next empty box.

**The fix is not to shorten all three. It is to pick one.** The 132-character version is the
one that prints, so it is the one that survives. `slack:` should say what goes wrong if you get
it wrong — *stop the boil early and it stays grey, and boiling it later will not bring the
white back* — which is a different fact. The paragraph goes.

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
ceiling rather than a cut, and you should not need to think about it. `slack:` is the opposite:
almost every declared line is over. 200 is where the checker complains, but one breath is about
120, and *"al dente is the last thing to happen and it does not wait; overshoot it and you have
porridge, which is a different dish"* is 120 and says everything.

Today the checker **reports and exits zero** — it names what is over cap without failing the
build, because the files that bring the collection under the caps have to be able to run it.
Once the collection is clean it flips to failing.
