# Scaling

**Read this before you build anything that offers a cook more than one serving size.** It settles
what it costs to cook more of a thing, how this collection works that cost out, and — the part that
five tickets will need and none of them should invent — the sentence each answer turns into.

The site already offers the switch and already lies about it. `src/lib/plan.ts:47` carries
`MULTIPLIERS = [0.5, 1, 2, 3]`, `src/pages/list.astro:925` prints `serves 4 → 12`, and **the clock
does not move.** Triple a pot of chili and that is true. Triple a basket of anything and it is a
fabrication, because the basket holds what it holds and twelve portions is four loads one after
another.

The whole answer is that cost is not one curve. Some of it is about the food and does not care how
much there is; some of it is about how much there is; and one thing — the size of the pan — decides
which of those two you are paying. **This collection already measures the first two and has never
recorded the third.**

One boundary, stated once and enforced everywhere below. The model is O(·) here, in
`src/lib/scaling.ts` when it is written, and in the tests. **It is never O(·) on a page a cook
reads.** §6 is the whole of what the site is allowed to say.

---

## 1. Three costs, and the thing that already measures two of them

| The cost | What it is a property of | How it grows with the number of servings |
| --- | --- | --- |
| **The wait** | The food. Collagen, gluten, yeast, salt getting into a thing. | Not at all. A braise is two hours for four portions or twelve. |
| **The work** | How much food there is. | In step. Twelve onions take three times four onions. |
| **The vessel** | Your kitchen. | It does not grow. That is the problem. |

### The classification is already computed, and this is the load-bearing claim

The model needs **no new per-step annotation**, and the reason is a real claim rather than a
convenience: *the hands-on/unattended split the site already computes is the scaling
classification.* A wait is a property of the food's physics and does not care about quantity. Work
is a property of quantity and scales with it.

The evidence is `src/lib/time.ts`, and specifically the fact that **it was written for something
else.** It sorts timers into two vocabularies so a timeline can say whether you have to stand
there. Nobody was thinking about scaling. Look at what the two lists turned out to be:

| Set | Size | The words |
| --- | ---: | --- |
| `UNATTENDED` | 53 | `rise prove ferment chill cool freeze set marinate brine soak steep bake roast braise simmer steam cure age smoke poach pressure …` |
| `HANDS_ON` | 24 | `whisk stir knead beat mix fold toss whip roll shape saute fry sear brown baste skim churn …` |

The left column is **how long a change takes**. The right column is **how much there is to do**.
Nobody drew that line for this purpose and the line came out in the same place, which is the
strongest thing that can be said for it short of measuring every dish. That is the free lunch: the
baseline model costs nothing to annotate because the annotation already exists and was paid for by
S-003.

### What the reading is worth, per recipe

`src/lib/time.ts` records where each answer came from, and `handsOnEvidence()` in
`src/lib/schedule.ts` collapses that per recipe. Across the 664-recipe build:

| Reading | Recipes | What it means |
| --- | ---: | --- |
| `stated` | 46 | The author named every timer and we know every name |
| `inferred` | 223 | Read off the operation — *"braise 3 hr"* is plainly not three hours of your attention |
| `unknown` | 395 | Something in the recipe never said, so a number in the figure is ours |

**267 of 664 recipes report zero hands-on minutes**, and for most of them that is absence rather
than freedom. Everything below inherits that error bar, and §4.6 is where it is paid.

---

## 2. The cost function

### The symbols

| Symbol | What it is | Where it comes from |
| --- | --- | --- |
| `s` | Servings the recipe is written for | `>> servings:` — parses as a number on 664 of 664 files |
| `n` | Servings wanted | The reader |
| `m` | `n / s` | The multiplier `plan.ts` already has |
| `c` | **Capacity**: servings the limiting vessel holds | `>> capacity:`, authored. Absent on almost every file, and should be |
| `b(k)` | `ceil(k / c)` — batches needed for `k` servings; `1` when no capacity is declared | — |
| `r` | `b(n) / b(s)` — batches now over batches then | — |
| `A` | Unattended minutes **on the critical path** | Sum the unattended timers along `schedule.criticalPath` |
| `H` | `schedule.handsOnMinutes` | Already published on every recipe |
| `A_batch`, `H_batch` | The parts of `A` and `H` inside the operations the capacity is declared against | Needs the capacity to name its operation — see §5 |
| `A_free`, `H_free` | Everything else: `A − A_batch`, `H − H_batch` | — |

**`A` is not `unattendedMinutes`, and the difference matters.** `unattendedMinutes` is a sum over
every branch; `A` is a length of clock. `gyoza` reports 56 unattended minutes against a 49-minute
recipe, because the cabbage salts for twenty minutes while the dough rests for thirty. Only one of
those two is time you are waiting through. Feed a branch sum into an elapsed-time formula and you
have charged a cook for a wait that never happened.

### The function

```
elapsed(n)  = A_free + m·H_free + r·(A_batch + H_batch)
standing(n) =          m·H_free + r·H_batch
```

and when no capacity is declared — which is nearly always — the batch set is empty, `r = 1`, and it
collapses to two numbers a recipe page could print today:

```
elapsed(n) = A + m·H
```

**Why `r` is a ratio and not a count.** 23 files already say `in two batches`, and they say it
*inside the timer*: `~brown{12%min}, in two batches with room around every cube`. Those twelve
minutes are both batches. A model that multiplies by `b(n)` has charged the author's own batching
twice over. The recipe's figures are measured at `s` servings with whatever batching `s` already
needs, so what scales is `b(n)/b(s)`.

### The identity that lets you check it

For every recipe, `A + H ≥ totalMinutes`, with equality exactly when the recipe is a single chain.
The gap is the hands-on work the timeline ran on a second pair of hands:

| Slug | `A` | `H` | `A + H` | `totalMinutes` | gap | what is in the gap |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `chili-con-carne` | 120 | 0 | 120 | 120 | 0 | one chain |
| `karaage` | 40 | 2.5 | 42.5 | 42.5 | 0 | one chain |
| `vindaloo` | 780 | 13 | 793 | 793 | 0 | one chain |
| `beef-with-broccoli` | 30 | 4 | 34 | 33 | 1 | the aromatics, 1 min |
| `gyoza` | 36 | 16 | 52 | 49 | 3 | beating the filling, 3 min |
| `gumbo` | 53 | 49 | 102 | 94 | 8 | browning the chicken, 8 min |

So `elapsed(s)` is **the one-cook clock**, and it sits at or above the timeline the page draws. That
is deliberate and it is the house convention already — `schedule.ts:longestUnbroken()`:
*"where it errs it errs towards a busier evening, which warns a tired cook rather than reassuring
one."*

### Which term decides, and where

- **Below `n = c`**, `r` is exactly 1 and the vessel is not in the answer at all. The model is
  `A + m·H`, and for most dishes `A` is nearly the whole of it. **At small `n` the flat cost decides
  and capacity never binds.**
- **The knee is exactly at `c`.** Flat, then linear, with the corner at the first serving that does
  not fit.
- **Above it**, `r` grows like `n/(c·b(s))` and `m` like `n/s`; both are linear, and the batch term
  wins whenever one batch takes longer than the hands-on work for `c` servings. For a basket —
  twenty minutes a load against a minute of tossing — that is always. **At large `n` the batch count
  swamps everything else.**

**The reversal is the useful part.** With no vessel, `elapsed = A + m·H`: only the work triples.
With one, `r ≈ m` and `elapsed ≈ m·(A + H)`: everything triples, the wait included. So **the dishes
that scale best when nothing binds are exactly the ones a vessel punishes hardest.** A two-hour
braise is free at any size in a pot and ruinous in a basket.

### What the vessel actually costs, which is less often than it looks

Subtract the no-capacity answer from the capacity one and almost everything cancels:

```
cost of the vessel = A_batch·(r − 1) + H_batch·(r − m)
```

Two terms, and they say different things.

- **`A_batch·(r − 1)` is the real one.** It is a *wait* inside the vessel, repeated. This is the air
  fryer: twenty minutes a load, three loads, forty minutes you did not have before.
- **`H_batch·(r − m)` is small and is only rounding.** `r ≥ m` always, because `ceil` cannot give
  you a fraction of a batch, and the gap is a part-full last load.

So: **a vessel that binds on a wait is expensive, and a vessel that binds on work is free.** Searing
beef in two goes costs nothing beyond the searing, because the work was going to triple anyway and
the pan is not making you wait while it happens. Only when the batch holds a *wait* does the batch
count reach the clock.

That is the test for whether a recipe is worth a `>> capacity:` at all, and it should save T-011-03
most of the 55 files that mention batching.

---

## 3. Work one out by hand

`beef-with-broccoli`, four portions to twelve. It is the example to check because it is the only
dish here whose capacity is readable from its own words.

**The inputs, each with the line it comes from:**

```
>> servings: 4                                 s = 4
>> step: sear in two batches 3 min, lift out   the wok holds half of four, so c = 2
>> step: velvet, rest 30 min                   ~rest{30%min}, unattended, on the critical path
>> step: stir-fry the aromatics 1 min          ~stirfry{1%min}, hands-on
```

critical path is `s0 → s2 → s5`, so `A = 30`. Hands-on across all branches is the 3-minute sear
plus the 1-minute stir-fry, so `H = 4`. The batched operation is the sear and only the sear.

**The arithmetic:**

```
m    = 12 / 4 = 3
b(4) = ceil(4/2) = 2      b(12) = ceil(12/2) = 6      r = 6 / 2 = 3

A_batch = 0     H_batch = 3        (the sear)
A_free  = 30    H_free  = 1        (the velvet, the aromatics)

elapsed(12)  = 30 + 3·1 + 3·(0 + 3) = 30 + 3 + 9 = 42 min
standing(12) =      3·1 + 3·3       =       3 + 9 = 12 min

for comparison, at the written four portions:  A + H = 34 min, of which 4 standing
```

**Now the same recipe under the loose reading**, where the batch ratio is put on the whole wait
rather than on the batch:

```
r·A + m·H = 3·30 + 3·4 = 102 min
```

**102 is wrong**, and it is wrong for a reason worth carrying: nobody's fridge holds less because
the wok does. The thirty minutes is a velvet in the fridge and it happens once whatever the wok is
doing. This is the entire argument for §5's rule that **a capacity has to name its operation and not
just carry a number.**

**And check the other direction.** Two portions: `b(2)/b(4) = 1/2`, so `r = 0.5` and the vessel
stops binding altogether — `30 + 0.5·1 + 0.5·3 = 32 min`, two of them standing. Scaling down can
take a batch away, and the ratio finds it without being told.

**Last, what the capacity bought.** Run the same twelve portions with no capacity at all:
`A + m·H = 30 + 3·4 = 42 min`. **The same answer.** The wok binds, and it costs nothing — because
the operation it binds is a sear, and searing was going to triple whether or not it happened in one
go. That is §2's `A_batch·(r − 1) + H_batch·(r − m)` coming out at zero, and it is the ordinary
case. A capacity here is worth declaring so a cook is told to use two goes, not because it moves the
clock.

---

## 4. Where it fails

Six cases. Each is **inside the model**, **outside it**, or **a known error the model accepts**. A
stated error bar beats a hidden one, and this section is what makes the file honest rather than
clever.

### 4.1 A crowded pan steams instead of browning

The elapsed time does not change. The **dish** changes. Twelve pieces of beef in a pan sized for
four give up their water faster than it can leave, the pan drops below browning, and what comes out
is grey and boiled. Every number in the model is unaffected and the cook has been handed a
different dinner.

The collection already knows this and says it in prose — 55 files mention batches, 23 of them
verbatim as *"in two batches with room around every cube"* — and `docs/knowledge/counters.md` puts
it as well as it can be put: *"if the basket sounds wet rather than loose, it is crowded and the
answer is a second batch, not more minutes."*

**Outside the model.** This failure is exactly what capacity exists to prevent, and it is prevented
by declaring one, not by computing anything. Where no capacity is declared, the model cannot see
this coming and will not warn anybody.

### 4.2 The same file is a different number of batches in a different kitchen

The strongest evidence in this repo for capacity is also the strongest evidence against trusting it.
From `docs/gaps/air-fryer-and-pot.md`, on America's Test Kitchen's equipment testing: winning
machines *"exceed 10 × 10 inches and hold four chicken cutlets or two 15-ounce bags of chips, while
smaller machines hold two cutlets or one bag"*, and their flat warning is that *"external dimensions
and stated capacities of air fryers are not reliable indications of how much food they can cook at
once."* The same page: *"a recipe written for one machine's full basket is a recipe for two batches
in another's."* The same bag of frozen chips is quoted at **18 minutes in a 1400 W machine, 12 in a
1700 W and 9 in a 2000 W.**

**Outside the model.** `c` is a fact about a kitchen, and the file records it for one vessel. This
is not fixable by measuring harder; the missing variable is not in any file and never will be. What
a recipe can honestly declare is the capacity **it was written for**, and a page should say the
vessel out loud so a reader with a smaller one can do the correction the model cannot.

### 4.3 Some hands-on work does not scale linearly

This one fails in both directions and on different dishes, so the errors do not cancel.

**Over-charged.** `gumbo` spends 35 minutes stirring flour and oil to the colour of milk chocolate.
That is a temperature process wearing a quantity's clothes: three times the roux in a wider pan is
not 105 minutes of stirring. The model says it is.

**Under-charged.** `gyoza` fills and pleats every dumpling by hand, which is as close to purely
per-unit as cooking gets — and the two operations that do it, `>> step: roll thin, cut 3.5-in
rounds` and `>> step: fill, pleat one side, press flat`, **carry no timer at all.** They contribute
zero minutes to `H`, so the model prices the most scale-sensitive dish in this file as one of the
cheapest. Chopping's setup cost lands the same way: sharpening a knife and clearing a board is paid
once and the model spreads it across every serving.

**A known error the model accepts**, and the largest of the accepted ones.

### 4.4 A bigger pot takes longer to come to temperature

Real, and it is neither O(1) nor O(n) — heat-up goes with mass against surface, so it lands
somewhere between. Nothing in this repo measures it: no timer models a pot warming up, and
`~brown{12%min}` is the author's whole claim about that operation.

**A known error the model accepts.** Its size is what decides whether it matters, and the size is
known even though the number is not: bounded and ignorable against a two-hour simmer, unbounded
against a three-minute sear. So it is worst exactly where the times are shortest, which is the
opposite of where anyone looks for it.

### 4.5 The oven drops every time the door opens

`r` charges `b` identical batches. They are not identical: the box loses heat on every opening and
the second batch starts cold, so four batches is more than four times one batch. Nothing in the repo
measures the recovery, and neither do its sources.

**A known error the model accepts, and here the model is optimistic.** That is the wrong direction —
everywhere else this collection errs towards a busier evening — so a page that leans on a batch
count should read as a floor rather than an estimate.

### 4.6 The figures are only as good as the timers

The model reads what is there. 395 of 664 recipes score `unknown` on `handsOnEvidence`, and 267
report zero hands-on minutes.

`chili-con-carne` is the worked example of the problem. **Four of its five operations carry no
timer** — brown, soften, bloom, thicken — and the only one that does is the two-hour simmer. So
`H = 0`, and the model reports that cooking three times as much chili costs nothing extra. That
happens to be roughly true, and it is true *by luck*: the file said nothing about four of its five
steps and the model read the silence as zero.

**A known error the model accepts**, and the one that gets a phrasebook row of its own rather than a
footnote. A confident scaling sentence on a recipe that times almost none of itself is the same
failure as the plan page printing `serves 4 → 12` — a number nobody measured, said in a voice that
sounds measured.

---

## 5. What capacity is not

The one paragraph most likely to be broken by whoever next annotates a file.

- **It is the vessel's limit, not a serving suggestion.** *How many portions fit in the thing.* A
  recipe that simply makes four portions has **no capacity to declare**, and a `capacity: 4` on it
  is a lie that will read as a binding pan for as long as the file exists.
- **It is absent by default**, the way `slack` and `washing-up` are. Most recipes are not
  vessel-bound and should say nothing. **A capacity on every file would mean somebody guessed.**
- **A wrong one is worse than none.** Absent leaves the plan page saying what it says today. Wrong
  makes it confidently wrong in a new way, which is the failure this whole argument exists to stop.
- **It is not a complexity class.** Nobody is asked to write down how their dish grows. That would
  be a vibe in a mathematical costume, and this repo has refused that shape three times already —
  `slack` carries a reason because a level alone is a vibe, `washing-up` derives its count from a
  list so the two cannot disagree, and the clock refuses to invent a duration. The growth is derived
  from a measurement or it is not printed.
- **It names an operation, not just a number.** §3 is the proof: `c = 2` on its own triples a
  30-minute rest in a fridge and turns 42 minutes into 102.

---

## 6. The phrasebook

Every finding the model can produce, and the sentence it turns into. **No notation in any of these,
ever** — not O(·), not a multiplier, not a batch count dressed as arithmetic. `voice.md`'s first
house test governs: would a friend say it at a kitchen table?

| What the model found | What the page says |
| --- | --- |
| Nothing binds, and the work is negligible | Cooking three times as much costs you nothing extra. |
| Nothing binds, and there is real work | Three times as much is three times the chopping. The pot doesn't care. |
| Nothing binds, and less is wanted | Half as much still takes the same two hours. |
| Wanted amount fits the vessel | It fits. One load either way. |
| Wanted amount crosses the vessel's limit | Up to six fits in one go. Past that it's a second load. |
| Vessel binds on a wait, and the wait is long | Three times the people is three times the batches, and three times as long standing there. |
| Vessel binds on a wait, and the wait is short | It goes in three lots, and that costs you about five minutes. |
| Vessel binds only on work, not on waiting | It goes in three lots, and that is the only difference. |
| Vessel stops binding because less is wanted | At this size it all goes in at once. |
| No capacity declared | Nobody has measured what the pan holds for this one. |
| The recipe times too little of itself to say | This one doesn't time enough of itself to say. |
| The recipe times nothing at all | No times here at all, so there's nothing to work out. |
| Some operations are untimed | …plus four steps the recipe never times. |

Two rules for anything not on the list. **Say the finding, not the method** — a cook who wants to
know how the growth was worked out is not on this page, and `voice.md` settles that. And **when the
model is uncertain, say less rather than hedge more**: *"Nobody has measured what the pan holds for
this one"* is a sentence; *"scaling behaviour could not be determined"* is the site explaining
itself, which goes nowhere.

---

## 7. Five dishes, worked

All figures from the 664-recipe build, via `buildSchedule()` in `src/lib/schedule.ts`.

| # | Slug | `s` | `A` | `H` | `c` | at `n` | elapsed | standing |
| --- | --- | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 1 | `chili-con-carne` | 6 | 120 | 0 | none | 18 | 120 | 0 |
| 2 | `karaage` | 4 | 40 | 2.5 | not declared | 12 | 47.5 | 7.5 |
| 3 | `beef-with-broccoli` | 4 | 30 | 4 | 2 | 12 | 42 | 12 |
| 4 | `gumbo` | 8 | 53 | 49 | none | 24 | 200 | 147 |
| 5 | `gyoza` | 4 | 36 | 16 | none | 12 | 84 | 48 |

**1. `chili-con-carne` — the pole where nothing binds.** `>> time: 3 hr`; one Dutch oven; the whole
clock is `~simmer{2%hr}`. Eighteen portions take the same two hours as six and cost no extra
minutes of your attention. *Cooking three times as much costs you nothing extra.* **With the caveat
from §4.6**: four of its five operations are untimed, so the zero is partly silence. And it declares
no capacity, which means nobody has looked — eighteen portions in one Dutch oven is a genuine
question and nothing in this file has asked it.

**2. `karaage` — the pole where the vessel binds, and the surprise.** `>> servings: 4`,
`>> time: 1 hr`, and the body says *"in batches"* without saying how many. A first reading says this
is the expensive case. It is not. The batched operations are two fries of ninety and sixty seconds;
the forty minutes of `A` is a thirty-minute marinade and two five-minute rests on a rack, none of
which is in the oil. So `A_batch = 0` and `H_batch = 2.5`, and twelve portions comes out at
**47.5 minutes** whether the pot holds four servings at a time or one.

**The air fryer pole, written before any file existed.** S-008 wants the basket as the opposite of
the pot, and when this was written no `.cook` file declared `kit: Air Fryer`. **T-008-04 has since
landed: 13 files declare the kit, on a 21-recipe shelf** (7 August 2026). This block has not been
rewritten from one of them, so what follows is still an illustration from the measured figures in
`docs/gaps/air-fryer-and-pot.md` rather than a worked recipe: wings at 200°C for 18–24 minutes, in a
basket ATK found holds about four cutlets. §9 records what redoing it from a real file would take.

```
a basket load ≈ 20 min unattended, c ≈ 4, H ≈ 2      at n = 12:  r = 3,  elapsed = 66 min
                                            with the capacity taken away:  elapsed = 26 min
                                                   so the basket costs:              40 min
karaage, twelve portions, also batched:      the oil bath costs:                      0 min
```

**Both batch, and only one of them costs anything.** The difference is not that one batches and the
other does not. It is that the basket's batch is twenty minutes of *waiting* and the fryer's is
ninety seconds of *frying*, and only a wait repeats onto the clock — §2's
`A_batch·(r − 1)` is 40 for the basket and 0 for the oil.

**It is not batching that costs. It is the length of the wait inside the batch.** That is the
sentence S-011 was reaching for, and it is why the air fryer shelf needs capacities and the
deep-fry shelf largely does not.

**3. `beef-with-broccoli` — the one worked by hand.** §3 in full. Forty-two minutes for twelve
portions, twelve of them standing, against thirty-four and four at the written size. The vessel
genuinely binds — the wok sears two portions at a time — **and it costs nothing**, because what it
binds is three minutes of searing rather than a wait. Take the capacity away and the answer is still
forty-two. *It goes in six lots, and that is the only difference.*

**4. `gumbo` — surprising, because nothing binds and it still scales worst.** This is the
best-evidenced recipe in the collection: every operation timed, every timer named, `stated`,
`untimedCount = 0`. One Dutch oven, One Pot counter, no vessel in the way. And twenty-four portions
is **200 minutes, of which 147 are you at the pot** — more than twice the whole recipe. The reason
is `>> step: stir the roux 35 min, to milk chocolate`, and the recipe's own `slack` line says *"the
roux is stirred without stopping."*

**And the model is wrong about it**, in the direction of §4.3: three times the flour in a wider pan
is not 105 minutes of stirring. The finding is right and the number is too big. A page that prints
*"three times as long standing there"* here is telling a true story with a made-up figure, and that
is worth knowing before T-011-05 puts a number on a screen.

**5. `gyoza` — surprising the other way, because the model prices it too cheaply.** Twelve portions
comes out at 84 minutes with 48 standing, which looks like the middle of this table. It is not.
Rolling wrappers and pleating dumplings — `>> step: roll thin, cut 3.5-in rounds` and
`>> step: fill, pleat one side, press flat` — are **untimed**, so the two operations that are pure
per-unit work contribute nothing at all. The most scale-sensitive dish in this file is the one the
model discounts hardest, and it does so silently. `handsOnEvidence` says `inferred`, which is not
alarming enough. **This is the case §4.6 exists for**, and the honest sentence is not a number:
*this one doesn't time enough of itself to say.*

---

## 8. The two situations

S-011 names two, and they are not the same request. Each is a query against the model.

### "Exhausted, two meals for one, for today."

`n = 2`. Every recipe here is written for four or more, so `m < 1` and `r ≤ 1` throughout — **no
vessel can bind at this size**, and the batch term is not in the answer. The model is `A + m·H`, and
because `m` is small, **`A` is nearly the whole of it.** This is the flat-cost case, and it is why
S-010's dials already settle it: what decides is hands-on minutes, the longest unbroken stretch, and
things to wash, not growth.

Minutes, rounded to the nearest one in both tables below:

| Dish | elapsed at 2 | standing |
| --- | ---: | ---: |
| `beef-with-broccoli` | 32 | 2 |
| `karaage` | 41 | 1 |
| `gyoza` | 44 | 8 |
| `gumbo` | 65 | 12 |
| `chili-con-carne` | 120 | 0 |

**Answer: `beef-with-broccoli`** — half an hour, two minutes of which are yours, and thirty of which
are a rest in the fridge you can spend elsewhere. `gumbo`'s 12 comes with §4.3 attached: a quarter
of a roux is not nine minutes of stirring, so its real answer is worse than the model's and it
should not be recommended here.

### "Stressed, six people, over three days."

`n ≈ 18` portion-meals, cooked once. `m` is large, so the flat cost stops mattering and **the growth
is everything.** What is wanted is a small `H` and no binding vessel.

| Dish | elapsed at 18 | standing |
| --- | ---: | ---: |
| `beef-with-broccoli` | 48 | 18 |
| `chili-con-carne` | 120 | 0 |
| `gyoza` | 108 | 72 |
| `gumbo` | 163 | 110 |

**Answer: `chili-con-carne`**, and it wins on the term the other query ignored: eighteen portions
cost exactly what six do. `vindaloo` is the same shape and more extreme — `A = 780`, `H = 13`, so
tripling a fourteen-hour recipe adds twenty-six minutes.

Two flags on this answer, both of which the model cannot resolve on its own:

- **`beef-with-broccoli` scores better on the table and is the wrong answer.** *Over three days*
  smuggles in a second question — **does it keep** — and a stir-fry does not survive to Thursday.
  That is a separate fact from scaling, S-011 says so, and T-011-04 owns it. A dish that scales
  beautifully and dies overnight does not answer this query, and nothing in §2 knows that.
- **`chili-con-carne`'s silence is untested**, per §7. No capacity declared means nobody looked.

---

## 9. What this file could not settle

- **The second pole in §7 is still an illustration** from `docs/gaps/air-fryer-and-pot.md` rather
  than a worked file. This entry was written when the collection had nothing in a basket; **T-008-04
  has since landed and 13 files declare `kit: Air Fryer` on a 21-recipe shelf** (7 August 2026). So
  what this asked for is now possible and still owed — §7's air fryer block rewritten from a real
  `.cook` file, `air-fryer-chicken-wings` being the one it was guessing at, with the numbers
  **checked, not adjusted**. A rewrite is not a correction, so it is not done here.
- **Capacity is a fact about a kitchen** and the file records one vessel (§4.2). No amount of
  annotation fixes this. What a page can do is name the vessel so a reader can correct it.
- **Per-step cookware is not in the generated data.** `src/generated/recipes.json` gives each step
  its ingredients and its timers and no vessel; the `#wok{}` mark is flattened to one recipe-level
  `cookware` list. Whatever builds the cost function needs the mark per step, **or** `>> capacity:`
  has to carry the operation itself. §3 shows what it costs to get this wrong: 102 minutes instead
  of 42.
- **Heat-up and oven recovery are unmeasured** here and in the sources this repo has read (§4.4,
  §4.5). They are declared as accepted errors with their directions stated, not estimated.
- **Whether a dish keeps is not a scaling question.** It decides one of S-011's two situations and
  the model cannot see it.
