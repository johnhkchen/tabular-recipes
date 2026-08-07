# The filter — what it cannot say

Every counter page in this directory ends with *what it could not stock*, and that habit is why
this collection is honest about itself. The filter on the front page needs the same page, for the
same reason.

A filter is a claim about **685 recipes at once**. Turning a dial to *under fifteen minutes
standing there* says, of every one of them, either *yes* or *no* or *nobody wrote it down*. This
is the first pass that has ever checked that claim against the food.

Read alongside [one-pot.md](one-pot.md), which supplies the reference case for the longest
unbroken stretch, and [README.md](README.md), which carries the coverage table below and is where
the next pass looks for work.

**Measured on 7 August 2026, against 685 recipes.** The story that opened this work was written at
658 and the ticket names 635 timers and 395 `slack`; S-008 and S-011 have been annotating
throughout. Nothing below is a number remembered from a previous ticket.

---

## What it can answer for

Three dials, three separate rules about whether the data can speak at all.

| dial | what it measures | the rule | can answer for | share of 685 |
| --- | --- | --- | --: | --: |
| Time you're standing there | `handsOnMinutes` | `evidence !== 'unknown'` | 269 | **39.3%** |
| On the table by | `elapsedMinutes` | `elapsedMinutes > 0` | 661 | **96.5%** |
| Things to wash | `washingUpCount` | `washingUpCount !== null` | 177 | **25.8%** |

Supporting annotation: timers in 661 files, `slack` in 416, `washing-up` in 177. The three
confidence states behind the standing dial are **stated 46 (6.7%) · inferred 223 (32.6%) ·
unknown 416 (60.7%)**.

**What the filter looks like at that coverage.** A reader who turns the sink dial is filtering
three-quarters of the shelf into *we can't say* and choosing among the quarter S-008 reached.
A reader who turns the standing dial is choosing among two-fifths. Only the clock speaks for
nearly everything, and it speaks for the wrong axis — S-010's whole argument is that elapsed time
is not what decides a Tuesday.

That is stated on the page and never hidden. It is not, today, stated as a *fraction*: the tally
says `227 match · 42 don't · 416 we can't say`, which is three counts and not a proportion, and a
reader has to notice that the third number is the largest to understand what they are looking at.

## What the scenario looked like

S-010's own sentence: *a long day, cooking for two, under twenty minutes standing there.*

**The filter can express one third of that.** There is no servings control. There is no *long day*
control — the nearest is the clock, which the reader must think to set separately. And there is no
twenty-minute stop: the standing dial stops at 5, 15 and 30.

Run at `standing = 15`, the tightest stop that honours *under twenty*:

| | pass | fail | we can't say |
| --- | --: | --: | --: |
| `standing ≤ 15` | **227** | 42 | 416 |
| `standing ≤ 30` | 260 | 9 | 416 |
| `standing ≤ 15` and `by ≤ 60` | 148 | 292 | 245 |

**The two nearest reachable settings are 33 recipes apart.** A reader who means twenty minutes
must pick a list that is either too tight or too loose, and nothing on the page tells them which.

### Every one of the 227, read

The full verdict list is in `docs/active/work/T-010-03/progress.md`, one line per slug. The
standard was fixed before the reading and is in that ticket's `design.md`; the counts:

| verdict | | share |
| --- | --: | --: |
| right for the evening | 72 | 32% |
| borderline | 12 | 5% |
| **wrong** | **143** | **63%** |

Wrong, by reason:

| reason | |
| --- | --: |
| not dinner tonight — a stock, a loaf, a side, a course or a drink | 75 |
| not dinner — a component another recipe eats | 37 |
| the standing figure is a floor, not a figure | 12 |
| started yesterday — over four hours on the clock | 10 |
| a quart of oil to heat, a dredge nobody timed, and batches | 9 |

**The judgement is open to disagreement and is printed so it can be disagreed with.** The first
two rows are 112 of the 143 and they rest on one call: that a person asking *what can I cook
tonight* is not answered by `garam-masala`, `chicken-broth`, `pizza-dough` or `baguette`. Somebody
who thinks a loaf is a legitimate result gets a very different headline from the same list.

The rest of this page is what the reading found.

---

## What it could not stock

### Whether you have the equipment

`beef-rendang` and `french-vanilla-ice-cream` are not fifteen-minute recipes in a kitchen without
a wok and an ice-cream machine, and `maamoul` is not one without a maamoul mould.

**This is not a gap in the annotation. It is a gap in what nine keys were chosen.**
`src/generated/recipes.json` carries a `cookware` line for **588 of 685 recipes** — `food
processor` on 11, `blender` on 13, `spice grinder` on 10, `mortar` on 22, `slow cooker` on 20,
`Instant Pot` on 24, `smoker` on 9, and one each of `mandoline`, `pasta roller`, `ice cream
maker`, `baking steel` and `maamoul mould`. `src/pages/search.json.ts` ships nine keys and none of
them is `cookware`.

Eight of the twelve recipes this audit called borderline were called borderline for exactly this
reason, and a reader cannot see any of it.

### Whether it started yesterday

**36 of the 227 passing recipes run longer than four hours on the clock**, and the clock is right
about every one of them. `lime-pickle` is fourteen days. `pizza-dough`, `ramen-noodles` and
`falafel` are over twenty-five hours. `baguette` is fifteen. All four pass *under fifteen minutes
standing there*, correctly, because the standing figure is genuinely small — and a person deciding
at six o'clock cannot use any of them tonight.

The `by` dial excludes them if it is set. It is a second control the reader has to think to reach
for, and the failure the story describes is a reader who has stopped thinking.

**And the clock is not always right, in the one direction that matters here.** Seven recipes write
a `~preheat` timer — 215 minutes of it — and **not one of those minutes reaches
`elapsedMinutes`**, because the preheat step never becomes an operation in the schedule:

| | reads elapsed | actual preheat |
| --- | --: | --: |
| `margherita` | **7 min** | 45 min |
| `white-pizza` | **7 min** | 45 min |
| `sicilian-pizza` | 35 min | 30 min |
| `grandma-pie` | 48 min | 45 min |
| `garlic-knots` | 44 min | 20 min |
| `baked-ziti` | 42 min | 15 min |
| `chicken-parmigiana` | 38 min | 15 min |

A margherita reads as a seven-minute dish. It is a baking steel at 550°F for three-quarters of an
hour, on top of a dough that is a separate recipe running 26 hours. A reader with *on the table by
30 min* set is shown it first.

### Whether the shopping is done

The most common reason a recipe is wrong for tonight, and nothing in the data knows. The site has
a shopping list and no idea what is in the reader's cupboard.

Unchanged by this pass and recorded because it is the largest of these and the least tractable:
closing it means asking the reader to keep an inventory, which is a different site.

### How tired the reader actually is

Twenty minutes of chopping is not twenty minutes of whisking, and neither is twenty minutes of
standing at a roux. `handsOnMinutes` counts a minute the same whichever it is.

The collection *does* carry the distinction, in prose, and the filter cannot reach it either:
`slack` is on **416 of 685** files and says what happens if you get it wrong — `gumbo`'s reads
*"the roux is stirred without stopping, and any way of hurrying it ends in scorched flour and a pot
to start again"*. That is the sentence a tired person most needs and there is no way to ask for it.
T-010-02 argued against making it a dial and the argument holds: a dial could only gate on the
level, which strips the reason, and *"'forgiving' alone is a vibe"*.

So this is not a missing dial. It is a missing sentence on the card.

### Whether it is dinner

**Found by running it, and it is the single largest reason a result is wrong.** 112 of the 143
wrong verdicts are a component, a stock, a loaf, a side or a drink.

Ask for fifteen minutes of standing and the filter offers `garam-masala`, `shichimi-togarashi`,
`thai-green-curry-paste`, `chintan-broth`, `dashi`, `whipped-cream`, `piloncillo-syrup`,
`flour-tortillas` and `milkshake`. Every one is a true answer to the question asked and none is an
answer to the question meant.

The collection knows: `category` says `Spice Blends & Marinades`, `Sauces & Gravies`, `Dressings &
Dips`, `Toppings & Pickles`, `Pastry & Doughs` on 37 of them. The other 75 are filed under
`Soups`, `Breads`, `Vegetables & Sides` and `Drinks` alongside real dinners, so no category test
finds them — `dashi` and `wonton-soup` are both `Soups`.

### How many it feeds

The story asks for **two**, and `metadata.servings` is on **all 685 files**, and it is not in the
index.

Of the 227 recipes the filter offers for an evening for two: **26 serve exactly two.** 79 serve
four, 34 serve eight, 19 serve twelve, 4 serve twenty-four. `berbere` serves twenty. A reader
cooking for two is being handed a spice blend that makes a year of it and a loaf that makes twelve
portions, with no way to say so.

### Whether the standing figure is a figure or a floor

**This is the finding this audit exists for.** The confidence state was built to stop an
unannotated recipe sailing through, and there is a class it does not catch.

`handsOnEvidence()` returns `unknown` when the hands-on figure is zero with untimed steps around
it (the `blondies` trap), and when any assumed minute is inside the figure. Both work — checked on
real files, not fixtures: **141 recipes carry assumed minutes, 1,273 of them in total, and not one
of those recipes is answerable on the standing dial.** Nothing passes on an assumed minute.

What it does not test is an **untimed operation sitting beside a timed one.** One recognised
hands-on timer anywhere in the recipe puts the figure above zero, the trap rule stops applying,
and the recipe reports `inferred` — which the dial treats as answerable, and thresholds as though
the figure were the figure.

**Only 35 of the 227 passing recipes have every operation timed.** The other 192 report a floor.
Most of the untimed operations are a stir and cost nothing. These twelve are minutes of shaping,
read one file at a time:

| slug | reads | the operation nobody timed |
| --- | --: | --- |
| `flour-tortillas` | **0.75 min** | *roll the dough thin* — twelve of them, by hand |
| `chapati` | **1 min** | *roll into 6-in rounds* — eight of them |
| `crab-rangoon` | **3 min** | *fill 24 wonton wrappers, wetting all four edges, pressing the corners into a purse* |
| `paratha` | 2 min | *roll thin, brush with ghee, pleat and coil* |
| `wu-gok` | 9 min | *divide into 12, flatten in an oiled palm, close the filling in, roll into an oval* |
| `ham-sui-gok` | 11 min | *shape into 16 balls, flatten each, work it into a pointed football* |
| `cha-gio` | 11 min | *soften 20 rice papers one at a time, and roll each tight* |
| `egg-rolls` | 12 min | *roll the filling up in 8 wrappers, sealing the last corner* |
| `sesame-balls` | 12 min | *seal the paste inside 12 balls, roll them through the sesame* |
| `sambousek` | 12 min | *rub the butter in by fingertips*, then *roll thin, cut rounds, fill, crimp the rim* |
| `fatayer` | 8 min | *roll into rounds, mound, fold three sides, pinch each seam* |
| `seekh-kabab` | 15 min | *press onto flat skewers with a wet hand, into a sleeve, then rake it lengthways* |

Every one passes *under fifteen minutes standing there*, and `crab-rangoon` passes at three.
Every one reports `evidence: "inferred"`, which is the site saying *we read it off the step* about
a step it did not read because the step said nothing.

Five more are the same shape and are in the verdict list under the same reason: `kibbeh`,
`lahm-bi-ajeen`, `manakish`, `scallion-pancakes` and `xiu-mai`. Five of the twelve above —
`crab-rangoon`, `flour-tortillas`, `chapati`, `paratha`, `sesame-balls` — are counted in the
verdict breakdown under *not dinner* instead, because a verdict takes the first reason that
applies and they were already out on that one. The floor is why they would have been wrong
anyway.

**Two fixes exist and neither is this ticket's.** Annotate the twelve shaping steps — one `~` each,
twelve one-line edits. Or make `handsOnEvidence()` demote a recipe whose untimed operation names
hands work, which is a change to `src/lib/schedule.ts` and wants its own tests. The second is the
general fix; the first is the honest one, because the number is missing rather than
mis-derived.

### Whether twenty minutes is a setting

It is not. The stops are 5, 15 and 30, and the story's own scenario asks for 20.

Recorded because it is the smallest thing on this page and the easiest to dismiss: a dial with
three stops is a dial with three answers, and *the number the reader had in mind* is not usually
one of them.

---

## What was found and not fixed

### Twenty timer names the vocabulary does not know

`src/lib/time.ts` holds two sets of words — 53 that mean a wait, 24 that mean your hands — and a
third of three that mean the wait only when an author *names* a timer with them. Its header
records that every word in that third set *"was caught lying"*, one at a time. **The collection
writes 70 distinct timer names. Twenty are in neither of the first two sets.**

A name in neither set is not a claim about anything, so `readTimers()` falls through to reading
the step's words, and when those say nothing the answer is `default` — which is
`confidence: unknown`, which puts the recipe on the *we can't say* shelf. **Naming a timer with a
word the list does not know is currently worse than leaving it unnamed**, which is the exact
failure the module's header already describes for `~blind bake`.

The twenty, by the minutes they carry:

| name | uses | minutes | reads as | should be |
| --- | --: | --: | --- | --- |
| `airfry` | 21 | 296 | unattended, **by luck** | `UNATTENDED` |
| `reduce` | 17 | 231 | hands-on | `UNATTENDED` |
| `preheat` | 7 | 215 | *nothing at all* | `UNATTENDED`, once the step reaches the schedule |
| `render` | 12 | 126 | hands-on | `HANDS_ON` |
| `thicken` | 9 | 111 | hands-on | `UNATTENDED` |
| `sweat` | 14 | 103 | hands-on | `HANDS_ON` |
| `char` | 3 | 28 | hands-on | `HANDS_ON` |
| `firm` | 1 | 20 | unattended | `UNATTENDED` |
| `warm` `blanch` `cook` `rub` `rinse` `glaze` `cream` `blast` `heat` `caramel` `bloom` `draw` | 33 | ~95 | mixed | mostly `HANDS_ON`; `draw` and `heat` are waits |

**`airfry` is right by accident, which is the most fragile row in the table.** All 21 air-fryer
steps open with the verb *"Roast"*, which is in `UNATTENDED`, so the reading comes from the
sentence rather than from the name. An author who wrote *"Crisp the tofu in the air fryer
~air fry{17%min}"* would get seventeen minutes of standing at a closed box.

#### `reduce` and `thicken` — measured

A lid-off reduction on Sauté, or a slaked starch on High with the lid off, is a pot bubbling by
itself. Measured on a patched copy of `time.ts` run over the same 685 records:

- **31 recipes change figures.** `beef-rendang` 60 → 0 standing; `chile-verde-slow-cooker` 42 → 22;
  `hungarian-goulash-slow-cooker` 45 → 25; `pot-roast-slow-cooker` 32 → 12.
- **16 recipes leave the *we can't say* shelf**, taking the standing dial from 269 to 285 of 685.
- **18 more recipes pass `standing ≤ 15`**, taking 227 to 245 — sixteen of them slow-cooker and
  Instant Pot braises, which is the food a long day is actually for.
- **Zero recipes newly fail.** Nothing that was answerable becomes less so.

**The counter-evidence, which is why this is a proposal and not an edit.** Two of the seventeen
`~reduce` timers are not a walk-away: `nikujaga` reads *"lift the drop lid off and ~reduce{8%min},
shaking the pot rather than stirring it"*, and `red-braised-pork-belly` *"~reduce{10%min}, spooning
the liquid over the fish every minute or so"*. Both would be over-corrected from about eight
minutes of standing to none. That is fifteen right against two wrong, and it is the judgement the
next ticket has to make rather than one this page can make for it.

#### The eleven that cost nothing and buy coverage

`render`, `sweat`, `char`, `blanch`, `warm`, `glaze`, `rub`, `cream`, `bloom`, `caramel`, `cook`
already read hands-on — by falling through to `default`. Adding them to `HANDS_ON` moves
**not one minute**. It moves `source` from `default` to `name`, which is `unknown` → `stated`, and
takes recipes off the *we can't say* shelf for free. This is the cheapest coverage the standing
dial can buy anywhere.

#### `churn` should probably leave `HANDS_ON`

It is **never written as a timer name** anywhere in the collection. Its only effect is loose in a
sentence, and its only catch is `french-vanilla-ice-cream` — *"Churn the cold custard in an
#ice cream maker{} for ~{25%min}"* — where it reports twenty-five minutes of standing at a machine
built to be left. That is the same shape as `dry`, `press` and `boil` and belongs in the same
argument.

Eight of `HANDS_ON`'s 24 words and nineteen of `UNATTENDED`'s 53 are likewise never written as a
name — `mix`, `roll`, `shape`, `deepfry`, `temper`, `flip`, `baste` and `churn` on one side;
`infuse`, `overnight`, `blindbake`, `autolyse`, `retard`, `thaw` and thirteen more on the other. They act only in a sentence, which is worth knowing before anyone weighs a word by how many
files it appears in.

### Two recipes where an interval is read as a duration

Not a vocabulary problem. Two files write *"every N minutes"* and the timer takes the interval:

- `sourdough-boule` — *"work in the salt, fold every 45 min for 4 hours"* → **45 minutes of
  standing**, from a fold that takes thirty seconds. It is the 6th-longest unbroken stretch in the
  collection.
- `ciabatta` — *"fold in the bowl every 30 min for 2 hours"* → **30 minutes of standing.**

One timer split each, in each file. Both are the strongest members of *fails and should not*: they
fail `standing ≤ 15` on minutes nobody spends.

### The longest unbroken stretch is right, and says almost nothing

[one-pot.md](one-pot.md) names the reference case — a dark roux is *"flour and fat taken to milk
chocolate over 30 to 45 minutes of continuous stirring… hands-on time from end to end"*.

**`gumbo` ranks 4th of 685 at 49 unbroken minutes**, from `~stir{35%min}` plus a `~brown{8%min}`
and a `~saute{6%min}` with no break between them, `evidence: stated`, **nothing assumed**. The
number measures what it says.

But the three above it are worth the paragraph:

| | longest | of which assumed | evidence |
| --- | --: | --: | --- |
| `beef-rendang` | 60 | **60 (100%)** | unknown |
| `mujaddara` | 52 | 0 | inferred |
| `french-onion-soup` | 50 | **50 (94%)** | unknown |
| **`gumbo`** | **49** | **0** | **stated** |

Two of the three are figures nobody claimed. **Read with the evidence column beside it, gumbo is
first**, and `beef-rendang`'s hour at the pan is the site's own guess — the same hour that
disappears entirely if `reduce` joins `UNATTENDED`, since the step is `~{60%min}` on *"reduce 1 hr
until dark and dry"*.

**In the other direction the number rescues three recipes.** `longestHandsOnMinutes` equals
`handsOnMinutes` on **625 of 685 (91.2%)**. Only three have a total of 30 minutes or more with a
gap of 15 or more, and all three really are broken up — a sear, then hours away, then a reduction:

| | hands-on | longest | elapsed |
| --- | --: | --: | --: |
| `chile-verde-slow-cooker` | 42 | 22 | 512 |
| `hungarian-goulash-slow-cooker` | 45 | 25 | 525 |
| `beef-bourguignon-instant-pot` | 45 | 30 | 100 |

**All three are `evidence: unknown`, so the standing dial cannot answer for any of them, and the
card that would print `longest go 22 min` is never drawn.** The qualifier can say something about
35 recipes; 19 of those 35 are on the *we can't say* shelf for the same reason; of the 16 that
remain, five pass at `standing ≤ 15`. The fourth number is correct, it is cheap, and **it is
printed on about five cards.**

It is not failing. It is waiting for the annotation that would let it speak — and `reduce` and
`thicken` alone would move all three of those recipes onto the shelf where it draws.

### The air-fryer shelf cannot be recommended at all

**All 21 air-fryer recipes read `evidence: unknown` and can never pass the standing dial.** Every
one is `handsOnMinutes: 0` with two to four untimed operations, which is the `blondies` trap rule
firing exactly as designed.

And every one of them is genuinely zero standing. The untimed operation is *toss the cubes in oil
and salt* — thirty seconds, untimed because nobody would time it. The trap rule cannot tell that
from `blondies`, where four untimed steps are a batter.

**This is the honest cost of the trap rule, not a bug in it**, and it lands on the twenty-one
recipes best suited to the evening the whole filter was built for. Twenty-one `~toss{1%min}`
annotations close it.

---

## What would close each of these, ranked

Ranked by how much of the shelf each one unlocks, not by how much anyone wants to do it.

1. **Annotate the 21 air-fryer toss steps.** One `~toss{1%min}` each. Twenty-one recipes move from
   *we can't say* to a real, and correct, zero minutes of standing — and they are the exact food
   this filter exists to find.
2. **Add `reduce` and `thicken` to `UNATTENDED`, and the eleven no-cost words to `HANDS_ON`.**
   Measured: 16 recipes leave the unanswered shelf on the first two alone, 18 more pass, none newly
   fails. Its own ticket, because `time.ts` is argued line by line — and it should land with a test
   asserting that **every timer name written in the collection is in one of the two sets**, which
   would have caught all twenty at once and will catch the twenty-first.
3. **Put `cookware` and `metadata.servings` in `search.json`.** Both already exist on 588 and 685
   files. Neither has to become a dial to be printed on a card, and *serves 12* next to a loaf
   answers the reader's question without a control.
4. **Give `handsOnEvidence()` the floor case**, or annotate the twelve shaping steps. Twelve
   one-line edits versus one rule change with tests; the ticket that takes it should say which and
   why.
5. **Make the preheat step reach the schedule.** Seven recipes, 215 minutes, and a margherita that
   reads as seven minutes on a page whose whole argument is that the clock tells the truth.

Not on this list, deliberately: **a fourth dial**, for equipment, servings or lead time. S-010's
argument against a composite score is also an argument against a control panel, and the four
things above are all cheaper and all fix the data rather than the interface.
