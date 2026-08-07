# The Air Fryer & the Pot — what is missing

**21 recipes, and the twenty-one is the finding.** This counter is a gate rather than a genre: a
dish is on it only if it washes two things or fewer, is cooked by one plug-in machine, and is on
the table in forty-five minutes. S-008 said in advance that if fewer than about twenty-five clear
it once the pool is annotated, the finding is *the gate is wrong* or *the shelf is thin*. It is
twenty-one. **The shelf is thin, the gate is not wrong, and no bar moves on this page.**

The bar doing the excluding is **bar 2, and it is not close.** Of the collection's 685 recipes, 642
fail *one plug-in machine does the cooking*, and **22 fail that and nothing else** — quick,
low-sink dinners kept off by a bar that has nothing to do with either, because a hob is not plugged
in. Bar 3 alone excludes 13. **Bar 1 alone excludes nobody at all**: not one recipe anywhere in the
collection is kept off this shelf by its washing-up. That is a finding about a bar and it is
written up below as a recommendation rather than acted on here.

**The borrowing is still 0%, and now it is 0% of a shelf that exists.** The gate was applied to the
three shelves that already promise less work — One Pot's 73, Instant Pot's 25, The Slow Cooker's 20
— and it admitted none of them, exactly as this page said before any of them had declared what it
washed. All 21 items are air fryer recipes written by T-008-04 for this counter. S-008 worried the
shelf would turn out to be *"a filter wearing a shelf's clothes"*, 90% borrowed from Instant Pot.
It is the opposite: 100% written, 0% borrowed.

**The pot half of the counter is empty**, and it is empty for a reason no amount of shelving fixes.
Every Instant Pot recipe on the site is a long braise, because that is what T-002-02 and T-002-03
were asked for; the shortest is 46 minutes on the critical path and 60 by its own claim. Ranks 21
to 26 below are the pot's short repertoire — eggs, rice, lentils, polenta — and not one of them has
been written. **A section title with nothing under it is not a placeholder, it is a lie about a
menu**, so the title came off and this paragraph is where the absence lives instead.

Before T-008-04 the site had no air fryer at all: no `.cook` file declared `kit: Air Fryer`, no
recipe named the machine, no tag mentioned it, and the only trace anywhere was
`src/lib/icons.ts:319`, where `air fry` already mapped to an oven icon — an icon written for a verb
nothing used. Something uses it now.

---

## What it has

Twenty-one, in four sections. Every one of them cleared all three bars under
`docs/active/work/T-008-05/gate.mjs`, and the table proving it, one row per item, is in
*The shelf, item by item* below.

Two of the five titles this page opened with are gone. *Start to finish in the pot* had nothing to
put under it and the paragraph above says why. *Sheet-pan-shaped, in the basket* described the
vegetables, which have their own title, so it was a second name for one shelf. *Reheats that beat
the microwave* is new and holds one item, which is a normal size on this board — Smokehouse's
*Dessert*, Instant Pot's *Rice, grains and porridge* and two of The Slow Cooker's four are also
one. Padding it to look fuller is the move this shelf exists to refuse.

There is no *Also here* section, and that is a measurement rather than a preference: `menuFor()`
appends one automatically for anything this counter shelves that the lists below forget, so the
absence of one means all 21 are placed. `node scripts/menu-sections.mjs` says
`4 sections, 21/21 placed` and that is the check. [one-pot.md](one-pot.md) says why it matters:
*"a shelf whose items land in Also here has section titles that do not match what is on it."*

Do not run `node scripts/menu-sections.mjs --write` against this page casually. It rewrites **every**
counter, not this one, and drops the shelf-talk note in `counters.json` along with the eleven others
it already drops. The dry run is safe and is the one to use.

**Straight out of the basket.** air-fryer-chicken-wings · air-fryer-chicken-thighs ·
air-fryer-salmon · air-fryer-saba-shioyaki · air-fryer-halloumi · air-fryer-tofu ·
air-fryer-chicken-tikka · air-fryer-shish-tawook

**Vegetables that go crisp.** air-fryer-brussels-sprouts · air-fryer-broccoli ·
air-fryer-cauliflower · air-fryer-sweet-potatoes · air-fryer-chips · air-fryer-batata-harra ·
air-fryer-chickpeas · air-fryer-corn-ribs · air-fryer-padron-peppers

**Frozen things, done properly.** air-fryer-frozen-chips · air-fryer-frozen-spring-rolls ·
air-fryer-frozen-prawns

**Reheats that beat the microwave.** air-fryer-reheated-pizza

---

## The gate, measured

The three bars, exactly as S-008 wrote them and not adjusted anywhere on this page:

1. **`washing-up` of two or fewer**, as declared by the recipe. Authored, never derived — a count
   taken off `cookware` is the thing `src/lib/washing-up.ts` exists to refuse.
2. **One plug-in machine does the cooking.** Air fryer or Instant Pot. Not a hob and then a
   machine; not a machine and then a grill.
3. **On the table in 45 minutes**, wall-clock, pressurising and resting included.

Everything below was measured against `src/generated/recipes.json` — the built collection, **685
recipes** — read through `src/lib/schedule.ts`. Nothing is estimated.

**The gate is applied by a script and the script is the record.** It is
`docs/active/work/T-008-05/gate.mjs`; its whole output is `gate-output.md` beside it; every number
in this section is pasted from that file rather than retyped. It reads all 685 recipes, not the
118-recipe pool this page opened with, because a pool defined before the air fryer existed cannot
find the air fryer.

### The three bars, over the whole collection

| bar | pass | fail | not declared |
| --- | --: | --: | --: |
| 1 — `washing-up` ≤ 2 | 118 | 59 | **508** |
| 2 — one plug-in machine cooks | 45 | 640 | 0 |
| 3 — 45 min, claimed **and** elapsed | 260 | 425 | 0 |

**Clearing all three: 21.**

Bar 3 is read on **both** clocks and passes only on both. `>> time:` is a person's claim about the
whole dish; `buildSchedule().totalMinutes` is a floor, because an untimed operation is given zero
minutes rather than a plausible guess. Neither is called the truth here, and requiring both keeps
the shelf honest in the direction that matters — a recipe whose author says fifty minutes is not
admitted because its merge tree adds up to forty.

### Which bar is doing the excluding

Every recipe that failed, by which bars it failed:

| bars failed | recipes |
| --- | --: |
| 1 + 2 + 3 | 340 |
| 1 + 2 | 217 |
| 2 + 3 | 61 |
| 2 only | **22** |
| 3 only | 14 |
| 1 + 3 | 10 |

**Bar 2 excludes the most, and bar 1 excludes nobody.** The *only* column is the one that answers
the question, because a recipe that fails two bars would still be off the shelf if one of them
moved:

- **Bar 2 alone: 22 recipes.** `seven-minute-eggs`, `shakshuka`, `western-omelette`,
  `seared-halloumi`, `one-pot-pasta`, `beef-stroganoff`, `risotto-alla-milanese`, `saba-shioyaki`,
  `roasted-cauliflower`, `red-lentil-soup`, `xiu-mai`, `egg-foo-young`, `balti`, `jalfrezi`,
  `panang-curry`, `thai-red-curry`, `memphis-dry-rub`, and the five S-007 soups
  (`century-egg-amaranth-soup`, `crucian-carp-tofu-soup`, `mustard-greens-tofu-soup`,
  `seaweed-egg-drop-soup`, `tomato-potato-beef-soup`). Quick, low-sink dinners, every one of them
  cooked on a hob. **This is correct and it is the shelf's whole promise**: *plug one in*, and a
  skillet is not plugged in.
- **Bar 3 alone: 14 recipes**, twelve Instant Pot and two slow cooker. The nearest miss on the site
  is `collard-greens-instant-pot` at 60 minutes claimed and 46 elapsed — **one minute over on the
  optimistic reading, fifteen over on the author's.** `congee-instant-pot` is next at 75/50.
  Everything else is half an hour or more past the bar, and the two slow cooker rows are eight and
  ten hours over.
- **Bar 1 alone: zero.** Not one recipe in 685 is excluded by washing-up and nothing else. See
  *Bar 1 measures the wrong thing* below.

### The shelves the gate was braced against

| shelf | recipes | clear bar 1 | clear bar 2 | clear bar 3 | clear all three |
| --- | --: | --: | --: | --: | --: |
| One Pot | 73 | 65 | **0** | 17 | **0** |
| Instant Pot | 25 | 13 | 21 | **0** | **0** |
| The Slow Cooker | 20 | 6 | **3** | **0** | **0** |
| The Air Fryer & the Pot | 21 | 21 | 21 | 21 | **21** |

**Two rows correct what this page said before the pool was annotated.**

**The Slow Cooker does not clear bar 2 outright.** This page said *"The Slow Cooker clears bar 2
outright and loses bar 3 by six hours"*, written when no slow cooker file had declared what it
washed. Read off step prose, **3 of 20 clear it** — `irish-stew-slow-cooker`,
`corned-beef-slow-cooker` and `new-england-boiled-dinner-slow-cooker`, the three that say in their
own first row that nothing is browned. Of the other seventeen, fifteen brown or sweat in a skillet
before the crock (which is T-008-03's count), `baked-turkey-wings-slow-cooker` roasts in an oven
first, and `boston-baked-beans-slow-cooker` parboils in a saucepan. It changes no outcome, because
every one of the twenty loses bar 3 by hours, and it is corrected here rather than left standing.

**Instant Pot's bar 1 is now readable and it is worse than the shelf's reputation.** 13 of 25
clear it. The pot browns in the pot, but it also strains: broths cost four to six things whatever
appliance makes them.

### Where the script was overruled, and by whom

**Bar 2 is the one a script cannot decide alone, and this is where it did not.** The lexicon reads
each file's `>> step:` labels and bodies — never its metadata lines, and never a step carrying no
ingredient, cookware or timer, because those are this collection's full-width note rows and are
where the comparisons to ovens and grills live. Left in, they failed **eighteen of the twenty-one**
air fryer files on their own filing and their own argument: `>> category: Fried & Crispy` is not a
frying pan, `>> keeps: the basket brings the skin round better than an oven or a microwave will` is
not an oven, and *"a sheet tray takes 35 minutes and half of them stay soft"* is not a sheet tray.

A second class of word came out after the first run: **`simmer`, `boil`, `sauté`, `sear` and
`fry`.** A slow cooker simmers and an Instant Pot sautés, so a step labelled *simmer on low, 9 hr*
in a `#slow cooker{}` is the machine doing its job. Left in, they failed
`corned-beef-slow-cooker` and `new-england-boiled-dinner-slow-cooker`, both of which say in their
own first row that **nothing is browned and nothing should be**. A second pan is now caught by
name — `#skillet{}`, `#saucepan{}`, `#oven{}` — which is the signal that does not lie in either
direction.

**On the Instant Pot shelf the lexicon is not trusted at all.** The machine's selling point is that
it browns on its own Sauté, and no word list separates *"sauté the onions"* in a pot from the same
words in a skillet. T-008-03 §3 read all 25 files by hand and found exactly four that cook outside
the pot; the script takes that verdict wholesale and **nine verdicts moved**, all the same way:

| slug | the lexicon said | the reading says |
| --- | --- | --- |
| `cuban-black-beans-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `gigantes-plaki-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `refried-beans-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `borscht-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `chicken-broth-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `chintan-broth-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `tonkotsu-broth-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `braised-short-ribs-instant-pot` | fail — pot plus hob | the pot's own Sauté |
| `pot-roast-instant-pot` | fail — pot plus hob | the pot's own Sauté |

The result — **21 of 25 clearing bar 2** — reproduces the figure this page published before any of
it was scripted, which is the point of doing it twice.

One further override, kept from this page and named in the script: `birria-de-res-instant-pot` uses
a jug blender and still clears bar 2, because a blender is plugged in and cooks nothing. Its jug
and sieve are a bar 1 cost instead, and it washes four.

**The Slow Cooker was not overruled**, because there is nothing to overrule it with: T-008-03
published a count and not a slug list. Its seventeen failures are the lexicon's reading, and all
seventeen name the second vessel in their own `cookware` line, so they are checkable rather than
asserted. Each is listed in `gate-output.md` so a person can disagree with a line rather than with a
total.

### All twenty-five Instant Pot recipes, bar by bar

`>> time:` is the author's own claim about the whole dish. **elapsed** is
`buildSchedule().totalMinutes`, the critical path through the merge tree. **untimed ops** is how
many operations in that file carry no timer at all — `schedule.ts` gives those zero minutes on
purpose, so a row with untimed operations reads *shorter* than it cooks and its elapsed figure is a
floor rather than a clock.

| Recipe | `>> time:` | elapsed | untimed ops | bar 1 | bar 2 | bar 3 |
| --- | --: | --: | --: | --- | --- | --- |
| `collard-greens-instant-pot` | 1 hr | 46 min | 2 | yes (2) | yes | no |
| `congee-instant-pot` | 1 hr 15 min | 50 min | 2 | yes (1) | yes | no |
| `ful-medames-instant-pot` | 1 hr 35 min | 65 min | 3 | yes (1) | yes | no |
| `ham-hock-stock-instant-pot` | 1 hr 30 min | 65 min | 2 | **no** (3) | yes | no |
| `refried-beans-instant-pot` | 1 hr 40 min | 70 min | 1 | **no** (3) | yes | no |
| `cuban-black-beans-instant-pot` | 1 hr 35 min | 71 min | 0 | yes (1) | yes | no |
| `birria-de-res-instant-pot` | 1 hr 50 min | 79 min | 3 | **no** (4) | yes | no |
| `cachete-instant-pot` | 1 hr 40 min | 82 min | 2 | yes (1) | yes | no |
| `chili-con-carne-instant-pot` | 1 hr 35 min | 82 min | 2 | yes (1) | yes | no |
| `hungarian-goulash-instant-pot` | 1 hr 35 min | 83 min | 2 | yes (1) | yes | no |
| `chile-verde-instant-pot` | 1 hr 45 min | 84 min | 1 | **no** (4) | **no** — the broiler, before the pot | no |
| `boston-baked-beans-instant-pot` | 1 hr 55 min | 85 min | 0 | yes (1) | yes | no |
| `borscht-instant-pot` | 2 hr | 85 min | 1 | yes (2) | yes | no |
| `beef-stew-instant-pot` | 1 hr 45 min | 88 min | 2 | yes (2) | yes | no |
| `chicken-broth-instant-pot` | 1 hr 50 min | 90 min | 1 | **no** (3) | yes | no |
| `carnitas-instant-pot` | 1 hr 45 min | 94 min | 1 | yes (2) | **no** — the broiler for the crust | no |
| `braised-short-ribs-instant-pot` | 1 hr 50 min | 97 min | 2 | yes (2) | yes | no |
| `pho-broth-instant-pot` | 2 hr 30 min | 100 min | 1 | **no** (4) | **no** — a dry skillet for the spices | no |
| `beef-bourguignon-instant-pot` | 2 hr | 100 min | 1 | **no** (3) | **no** — a skillet for the garnish | no |
| `oxtails-instant-pot` | 1 hr 50 min | 100 min | 1 | yes (2) | yes | no |
| `pot-roast-instant-pot` | 2 hr 30 min | 136 min | 2 | **no** (3) | yes | no |
| `chintan-broth-instant-pot` | 3 hr | 150 min | 0 | **no** (6) | yes | no |
| `tonkotsu-broth-instant-pot` | 3 hr 30 min | 170 min | 1 | **no** (3) | yes | no |
| `gigantes-plaki-instant-pot` | 13 hr 30 min | 775 min | 0 | **no** (3) | yes | no |
| `corned-beef-instant-pot` | 5 days 4 hr 30 min | 7470 min | 1 | **no** (3) | yes | no |

**Bar 1: 13 clear it, 12 fail it, 0 cannot be measured.** When this table was first printed, only
two of the twenty-five had ever been asked; T-008-03 asked the other twenty-three and the column
above is their answers. **The shelf's reputation was better than its sink.** The twelve that fail
are the broths and the beans that come out of the pot into something else:
`chintan-broth-instant-pot` washes **six** — pot, colander, sieve, cloth, settling jug, fat jar —
and nothing about the appliance changes that, because straining is not a thing a lid can do.
`pho-broth-instant-pot` washes four, `chile-verde-instant-pot` and `birria-de-res-instant-pot` four
each.

**And bar 1 becoming readable moved nothing**, which is the whole finding about this bar. The zero
this page published rested on bars 2 and 3 while bar 1 was unknown on twenty-three files. It is
known on all of them now, and the zero is unchanged.

**Bar 2: 21 of 25 clear it.** The four that do not are named in the table and each says so in its
own step text — not inferred from `cookware`, which [one-pot.md](one-pot.md) established counts
only what a recipe *names*. `birria-de-res-instant-pot` uses a jug blender and still clears bar 2,
because a blender is a plug-in machine that does no cooking; its jug and sieve are a bar 1 problem
instead.

**Bar 3: 0 of 25, on both readings of the clock.** The shortest recipe on the shelf is
`collard-greens-instant-pot` at 60 minutes by its own `>> time:` and 46 by the critical path, and
that 46 has two untimed operations inside it. The second shortest is `congee-instant-pot` at 75 and
50. Nothing else is within half an hour of the bar.

**All three together: 0 of 25.**

### What the clock actually reads, and how it differs from what was expected

T-008-02 was told to check bar 3 hardest, on the reasoning that an Instant Pot recipe carries a
pressure time that is not the whole clock — a 25-minute cook being ten minutes to come up, 25
under and fifteen of natural release. **On these twenty-five files that worry does not apply, and
the reason is that it was already dealt with.**

T-002-01 taught `src/lib/time.ts` the four pressure timer names before a single pressure recipe
existed. T-002-02 and T-002-03's writers then used them: [instant-pot.md](instant-pot.md) counts
**42 pressure-and-release tasks across the 25 files**, every one reading as unattended and every
one carrying `confidence: stated`. Come-up and release are timers in the tree, so they are in the
critical path, and the authors wrote `>> time:` over the top of them.

The result is the opposite of the worry. **`>> time:` is greater than or equal to the derived
critical path on all twenty-five files.** Median gap 21 minutes, largest 50
(`chintan-broth-instant-pot`, 3 hr claimed against 150 minutes derived), smallest 0. The author's
number is the conservative one.

Neither number is presented here as the truth, and that is not a hedge:

- **`>> time:` is a claim**, written by a person about a whole dish, and it is the one a reader
  sees under the table.
- **elapsed is a floor.** `schedule.ts` gives an untimed operation zero minutes and `timed: false`
  rather than filling the gap with a plausible number, and counts it in `untimedCount`. Nineteen of
  the twenty-five have at least one such operation.

The two readings disagree on the length of every recipe and **agree on the only question this page
asked**: nothing here is a forty-five-minute dinner. That agreement is what makes the zero worth
trusting.

### Where each shelf actually fails, which is not where anyone guessed

The three older shelves do not overlap: Instant Pot ∩ One Pot is empty and The Slow Cooker ∩ One Pot
is empty, so that pool is 118 distinct recipes and the gate still admits none of them.

**One Pot dies on bar 2, and it dies there at its fastest end.** Its 73 recipes are hob and oven
dishes; not one of them names a plug-in machine that cooks. The casualties are the quick ones —
`western-omelette` at 3 minutes elapsed, `egg-foo-young` at 3, `seaweed-egg-drop-soup` at 6,
`jalfrezi` at 7, `century-egg-amaranth-soup` at 10, `country-fried-steak` at 16. Six recipes that
would walk any speed test, excluded by a bar that has nothing to do with speed, and correctly so:
the shelf's promise is *plug one in*, and a skillet is not plugged in. At the other end the story
is the one S-008 already told — `vindaloo` at 14 hours, `pot-roast` at 4 hr 30 min, `carnitas` at
4 hr, `braised-short-ribs` at 4 hr.

**One Pot's own promise now holds, and this page can say so for the first time.** When this table
was first printed, four of its 73 files had declared a `washing-up` line. All 73 have now:
**65 of 73 wash one or two things and 40 wash exactly one.** The eight that wash three or more are
listed in [one-pot.md](one-pot.md), which is the page that should carry them.

**Instant Pot dies on bar 3, unanimously**, and four of its files fail bar 2 as well.
`chile-verde-instant-pot` chars its chiles under the broiler *before* the pot; `carnitas-instant-pot`
finishes under the broiler; `beef-bourguignon-instant-pot` glazes its garnish in a skillet and says
in the file why — *"a separate pan, because the pot is full"*; `pho-broth-instant-pot` toasts its
spices in a dry skillet. All four are honest recipes and all four are two appliances.

**The Slow Cooker loses bar 2 as well as bar 3, and this page had that wrong** — see the correction
above. Three of twenty brown nothing; seventeen use a skillet, an oven or a saucepan first. It
still loses bar 3 by hours: its shortest, `soy-sauce-chicken-slow-cooker`, is 4 hr 40 min. The
shelf is a different promise — *fill it before you leave* — and the two shelves are not in
competition at any point.

### It is twenty-one, which is under twenty-five, and the bars do not move

S-008 named this number in advance and named what to do with it:

> If fewer than about twenty-five recipes clear it once the pool is annotated, the finding is *the
> gate is wrong* or *the shelf is thin*, and T-008-05 reports it. It does not loosen the bars
> quietly to fill a page.

**It is twenty-one. The shelf is thin. The gate is not wrong.** The evidence for that division, in
the order it will bite:

- **All twenty-one are air fryer recipes and all twenty-one are new.** Nothing was borrowed, because
  nothing on the three older shelves clears the gate and — since T-011-05 — a section list cannot
  shelve a recipe whose own `>> counters:` line does not name the counter. This shelf's stock is
  exactly what was written for it.
- **The four short of twenty-five are four recipes, not four bars.** Three of them are already
  ranked and argued below and were **ranked out for cause, not for quality**: bacon (rank 13) clears
  all three bars and cannot be written, because one ingredient and two operations gives a table with
  one row and `check-recipes.mjs:199` refuses it; seekh kabab (17) and crispy roast potatoes (20)
  fail bar 1 as the ranks describe them. **Seekh kabab is now writable** — see *the drawer* below —
  which is one of the four found by settling a sentence rather than by moving a bar.
- **The pot half is the other three and more.** Ranks 21 to 26 are six dishes, none written, all of
  them plausible passes: hard-boiled eggs at roughly 25 minutes and two things, a pot of plain rice
  at under 30 and one thing, red lentil soup at under 30 and one. **The fastest route to twenty-five
  is `kit: Instant Pot` variants of things already here**, and it is a commission rather than a
  measurement problem.
- **Bar 2 is the bar that excludes, and it is the bar that must not move.** Dropping *one plug-in
  machine* would admit 22 recipes overnight and the shelf would read healthy by Friday — and it
  would no longer be this shelf. Its blurb is *plug one in*. A hob dish on this counter makes the
  blurb a lie, and [one-pot.md](one-pot.md) is the record of what happens to a shelf whose promise
  and whose contents disagree.
- **Bar 1 is the bar that measures the wrong thing, and it is written up rather than moved.** See
  below. Changing a bar in the same ticket that first measures it is how a gate becomes decoration.

### Bar 1 measures the wrong thing, and this is a recommendation, not a change

**Bar 1 has never excluded a single recipe on its own** — 0 of 685 fail it and nothing else. It is
doing no work at the gate. Three separate readings say the same thing:

1. **It is unreadable on three-quarters of the collection.** 508 of 685 recipes have never declared
   a `washing-up` line, and an undeclared line is not a pass. So bar 1 is mostly a coverage measure
   wearing a rule's clothes.
2. **Where it is readable, it agrees with bar 2 and bar 3 almost everywhere.** 118 clear it; the
   ones that fail it fail something else too, in every case.
3. **It reads looser than the sentence that defined it.** T-008-03's convention rule 6 — the
   README's, not the ticket's — does not count the knife and chopping board at all, so S-008's own
   illustration of two-or-fewer, *"The pot and a chopping board"*, scores **1** rather than 2.
   T-008-01 flagged this in its review §4.2, T-008-03 flagged it again in `findings.md` §7, and
   nobody has ruled on it.

**What a later story should consider, and what this page will not do:** either tighten bar 1 to
something that bites (**≤ 1 admits three of the current twenty-one** — chicken thighs, halloumi and
padrón peppers — which is a different and much smaller shelf, and worth knowing before anyone
proposes it), or rule on the chopping board so the bar means what the story's sentence says, or drop
bar 1
from the gate and keep `washing-up` as the thing every item on this shelf prints. **All three are
counter decisions and none of them is this ticket's.** What bar 1 unquestionably *did* earn is the
annotation: 177 recipes now say what is in the sink where 11 did before, One Pot's promise has been
checked against all 73 of its files, and the kit axis turned out not to be about washing up at all.
The bar found nothing; the work of building it found everything.

---

## The shelf, item by item

**Every item, its washing-up, its machine and its clock, in one table.** Pasted from
`docs/active/work/T-008-05/gate.mjs`. There are no exceptions on this shelf and no item without a
`washing-up` line, and this is where that is checkable rather than asserted.

**untimed ops** is how many operations in a file carry no timer at all. `schedule.ts` gives those
zero minutes on purpose, so **elapsed** is a floor and not a clock — which is why bar 3 is required
on the author's number as well.

| slug | washing-up | count | machine | `>> time:` | elapsed | untimed ops |
| --- | --- | --: | --- | --: | --: | --: |
| `air-fryer-batata-harra` | the basket, the bowl | 2 | air fryer | 35 min | 18 min | 3 |
| `air-fryer-broccoli` | the basket, the bowl | 2 | air fryer | 25 min | 10 min | 3 |
| `air-fryer-brussels-sprouts` | the basket, the bowl | 2 | air fryer | 35 min | 22 min | 3 |
| `air-fryer-cauliflower` | the basket, the bowl | 2 | air fryer | 30 min | 15 min | 3 |
| `air-fryer-chicken-thighs` | the basket | 1 | air fryer | 40 min | 28 min | 2 |
| `air-fryer-chicken-tikka` | the marinating bowl, the basket | 2 | air fryer | 45 min | 33 min | 2 |
| `air-fryer-chicken-wings` | the basket, the bowl | 2 | air fryer | 35 min | 21 min | 3 |
| `air-fryer-chickpeas` | the basket, the bowl | 2 | air fryer | 25 min | 13 min | 3 |
| `air-fryer-chips` | the basket, the bowl | 2 | air fryer | 35 min | 22 min | 3 |
| `air-fryer-corn-ribs` | the basket, the bowl | 2 | air fryer | 30 min | 13 min | 3 |
| `air-fryer-frozen-chips` | the basket, the bowl | 2 | air fryer | 25 min | 15 min | 3 |
| `air-fryer-frozen-prawns` | the basket, the bowl | 2 | air fryer | 20 min | 9 min | 3 |
| `air-fryer-frozen-spring-rolls` | the basket, the bowl | 2 | air fryer | 20 min | 11 min | 3 |
| `air-fryer-halloumi` | the basket | 1 | air fryer | 15 min | 9 min | 3 |
| `air-fryer-padron-peppers` | the basket | 1 | air fryer | 15 min | 7 min | 3 |
| `air-fryer-reheated-pizza` | the basket, a small bowl | 2 | air fryer | 12 min | 5 min | 3 |
| `air-fryer-saba-shioyaki` | the basket, the plate the fish salted on | 2 | air fryer | 40 min | 31 min | 3 |
| `air-fryer-salmon` | the basket, the plate the spice was pressed on | 2 | air fryer | 25 min | 12 min | 4 |
| `air-fryer-shish-tawook` | the marinating bowl, the basket | 2 | air fryer | 45 min | 33 min | 2 |
| `air-fryer-sweet-potatoes` | the basket, the bowl | 2 | air fryer | 30 min | 17 min | 3 |
| `air-fryer-tofu` | the basket, the bowl | 2 | air fryer | 40 min | 27 min | 3 |

### Does the blurb survive its own shelf?

The counter's blurb is **"Plug one in, eat, and wash two things."** Checked against the twenty-one
rows above rather than asserted:

- **Plug one in** — 21 of 21. Every machine cell reads *air fryer* and no row names a second one.
  The blurb says *one*, and the shelf has exactly one machine on it, which is a smaller claim than
  the counter's name makes. **The name is the thing that is now slightly ahead of the contents**,
  and the honest fix is the pot half, not a shorter name.
- **Eat** — the longest is 45 minutes (`air-fryer-chicken-tikka`, `air-fryer-shish-tawook`), the
  shortest 12. The median claim is 30 minutes and the median critical path 15.
- **Wash two things** — 18 rows wash two, 3 rows wash one, **nothing washes three**. The blurb
  reads as a ceiling and the shelf meets it as a ceiling, which is the right way round: a reader who
  turns up expecting two and washes one is not disappointed.

**Nothing on the shelf contradicts the blurb**, so neither was changed. The one sentence that
*did* have to change is on this page and not on the counter: *"The Slow Cooker clears bar 2
outright"*, corrected above.

### The drawer, settled

T-008-04 left one call here, and it is worth settling because it decides whether a dish can be
written at all. This page counts the basket as one thing everywhere except seekh kabab (rank 17),
where *"the fat renders out and drips, so this is the one dish on the page where the drawer under
the basket is part of the washing-up and should be counted."* T-008-04's objection is correct:
**wings render fat too, and so do thighs and prawns**, and they are on the shelf at two.

**The rule, from here on: the basket assembly — basket, drawer and crisper plate — is one thing,
because it is washed in one action.** That is T-008-03 convention rule 9 (*a lid is part of its
vessel*) applied to the machine this shelf is named after; rule 4 reserves separate counting for
parts washed on a *different schedule*, and nobody washes a drawer on a different evening from its
basket.

**It changes nothing on the shelf today** — no item counts a drawer — and it changes exactly one
thing about tomorrow: **`air-fryer-seekh-kabab` is writable at two things**, mince bowl and basket,
and it comes off the ranked-out list. It is a recommendation to whoever writes it, not a
re-ranking done here, because the dish does not exist yet.

---

## What it is missing

**Seventeen of the twenty-six ranks below are written and are on the shelf above. Nine are still
out**, and the ranks are left in place rather than struck through, because what each one argues —
why it is where it is, what it costs the sink, whose number its time is — is the reason the next
writer will not have to re-derive it.

| still out | rank | why |
| --- | --: | --- |
| **Bacon** | 13 | clears all three bars and **cannot be written**: one ingredient and two operations gives a one-row table, which `check-recipes.mjs:199` refuses. The answer is the one the frozen block took — build a dish *around* it — and it is a different commission |
| **Seekh kabab** | 17 | ranked out at three things on the drawer reading. **The drawer is settled above and it is now two.** This is the readiest of the nine |
| **Crispy roast potatoes** | 20 | the parboil is a pot, a colander and a hob. Dropping it produces `air-fryer-chips` under another name and loses the roughed starchy surface. Still out, still argued |
| **Hard-boiled eggs** | 21 | `kit: Instant Pot`. Roughly 25 minutes, two things. The fastest clear pass on the page |
| **A pot of plain rice** | 22 | `kit: Instant Pot` of `gohan`. Under 30 minutes, one thing |
| **Red lentil soup** | 23 | `kit: Instant Pot`. Under 30 minutes, one thing if the stick blender goes into the pot |
| **Kitchari** | 24 | `kit: Instant Pot`. Roughly 25 against the plain file's 50 |
| **Mujaddara** | 25 | `kit: Instant Pot`. The one dish where the appliance version is genuinely *fewer* vessels than the plain one |
| **Polenta** | 26 | `kit: Instant Pot`. Nine minutes at pressure against forty-five of stirring |

**Six of the nine are the pot half**, and writing them is what takes this shelf past the
twenty-five S-008 asked for. None of them needs a bar to move.

### How this list is ranked

**By what clears the gate, not by what an air fryer is famous for.** In order:

1. **How many things it puts in the sink.** A marinade bowl, a dredging station and the basket is
   three, and the dish does not belong here however good it is.
2. **Whether one machine does all of it.** A parboil-then-basket or a hob-then-basket is two.
3. **Whether it lands under forty-five minutes**, including preheating and any rest.
4. **Only then, whether anyone wants it.**

That order demotes half of what an air fryer is sold on. Tonkatsu and korokke need flour, egg and
panko in three dishes before the basket sees them. It also promotes things nobody puts on a list,
like a tray of sprouts, and those are near the top on merit.

**Every rank says whether it is a `kit: Air Fryer` variant of a named existing slug or a standalone
dish, because getting that backwards is a build error the writer hits blind.**
`scripts/parse-recipes.mjs:198` throws when two files share a `dish` and neither declares a `kit:`
line. A basket version of something already here is a second file carrying `>> dish: <slug>` and
`>> kit: Air Fryer`. A basket dish with no plain counterpart carries neither line, and its `dish`
defaults to its own slug (`scripts/normalise.mjs:230`).

**Every time below carries a tag saying whose number it is, and the tags are not decoration.**

- **[ATK]** — a test kitchen established it by testing, and the citation is in *Where this came
  from*. **Four** of the twenty-six ranks have one: wings, brussels sprouts, salmon and broccoli.
- **[to establish]** — a plausible starting range and **nothing more**. It is where the general
  180–200°C basket envelope puts the dish; nobody has cooked it and measured it. **A writer must
  not copy one of these into a recipe.** Cook it, in a stated machine at a stated load, and write
  the number that came out — or find a source that did and cite it. **Nineteen** ranks are tagged
  this way, which is an honest measure of how thin the literature is.

The remaining three — batata harra, crispy roast potatoes and mujaddara — carry **no time at all**,
because what is interesting about each of them is a washing-up or a vessel argument rather than a
clock, and inventing a number to fill the column would be the same fault in a smaller font.

That distinction is the whole of *Never fabricate a number* on this shelf. **The evidence that it
matters is on this page**: the vegetable ranks below were first drafted at 200°C for 12–18 minutes,
which is where every recipe site and every conversion chart points. America's Test Kitchen tested
400°F on brussels sprouts, **rejected it**, and published 350°F for 20–25 minutes instead, because
at the higher heat *"the exterior browned too quickly while the interior remained undercooked"*.
The received number was hotter and shorter than the tested one, in both directions at once.

### The basket — ranks 1 to 20

1. **Chicken wings** — **standalone.** Nothing here to be a variant of: there is no `wings`, no
   `buffalo-wings`, no `chicken-wings`. The single most-searched thing anyone does with the
   machine, and it clears the gate without redesigning anything — dry the wings, toss them with
   salt and baking powder in the bowl you will serve them from, basket, one flip. **Two things, and
   arguably one.** **[ATK]** 200°C/400°F, 18–24 minutes on 2½ lb. It is also where the sources
   disagree most sharply, on the loading rather than the clock — see *what the basket times
   actually are* below.

2. **Brussels sprouts** — **`kit: Air Fryer` variant of `roasted-brussels-sprouts`.** The machine's
   best vegetable and the cleanest gate pass on the page: halve, toss in one bowl, basket, shake
   once. The loose outer leaves that burn on a sheet tray fall through and crisp here. Two things.
   **[ATK]** 175°C/350°F for **20–25 minutes**, 1 lb of sprouts to 1 Tbsp of oil — and note that
   this is the number a test kitchen reached *after rejecting* the 200°C every recipe site prints,
   because at that heat the outside browned before the inside softened. **This rank is the reason
   the tags on this list exist.**

3. **Halloumi** — **`kit: Air Fryer` variant of `seared-halloumi`.** Needs no oil at all, which is
   the rarest thing on this list, so it is **one thing**: the basket. **[to establish]** 200°C,
   8–10 minutes, turned once. The plain file's skillet is the only vessel it removes and the only one it had.

4. **Chips, from a raw potato** — **`kit: Air Fryer` variant of `french-fries`.** The dish the
   appliance is bought for. **Flagged, because bar 3 is genuinely in doubt:** the plain file soaks
   the cut potato in cold water to pull the starch, and thirty minutes of soaking is wall-clock
   whether or not anyone is standing there. **[to establish]** for the cook itself; soak included, this is 50–55 minutes and it **fails**.
   The writer has two honest ways out and must pick one in the file rather than leave it: soak the
   night before and declare the recipe as starting from soaked potato, or drop the soak and say in
   the table what is lost. **Do not simply omit the soak from the clock.**

5. **Cauliflower** — **`kit: Air Fryer` variant of `roasted-cauliflower`.** Florets, one bowl, one
   shake. The steam that pools under cauliflower on a tray has somewhere to go here, which is a
   real improvement and not only a shortcut. Two things. **[to establish]** — and this one has no
   test-kitchen number at all, which was checked rather than assumed. The nearest sourced anchor is
   the broccoli-and-fennel method at rank 11; start there and expect to go longer, because a floret
   of cauliflower is denser than one of broccoli.

6. **Blackened salmon** — **`kit: Air Fryer` variant of `blackened-salmon`.** The argument for this
   one is not speed. Blackening is a smoking-hot dry cast-iron pan and a spice crust, and doing it
   indoors sets off the smoke alarm and coats the kitchen; the basket is the version a person can
   actually cook on a Tuesday. Two things: the basket and the plate the spice was pressed on.
   **[ATK]** 200°C/400°F for **10–14 minutes** on a 1½-inch fillet, pulled at 52°C/125°F. Time
   tracks thickness rather than weight, and the finish temperature is genuinely contested — three
   sources give three numbers and the disagreement is recorded below.

7. **Crispy chickpeas** — **`kit: Air Fryer` variant of `crispy-chickpeas`.** A drained tin, dried
   properly, one bowl of oil and spice, two shakes. **[to establish]** 200°C, 12–15 minutes. Two things, and
   the machine beats the oven outright — a sheet tray takes 35 minutes and half of them stay soft.

8. **Chicken thighs, bone-in and skin-on** — **standalone.** There is no plain chicken-thigh recipe
   here; `pulled-roast-chicken` is a whole bird and `smoked-chicken` is a pit. Skin-side up, no
   turning. **[to establish]** 190°C, 22–25 minutes — but the finish is 74°C in the thickest part
   and **that** number is not negotiable and not a guess. One thing to wash if the seasoning goes on in the
   basket, two if it does not.

9. **Saba shioyaki** — **`kit: Air Fryer` variant of `saba-shioyaki`.** Salt-grilled mackerel
   without a grill, which is the single most common thing the machine is used for in a Japanese
   home kitchen and the reason it is here rather than lower. The plain file wants a fish grill most
   people do not have. **[to establish]** 200°C, 10–12 minutes, skin side up, no turning. Two
   things.

10. **Sweet potatoes** — **`kit: Air Fryer` variant of `roasted-sweet-potatoes`.** Cubes rather than
    the oven's wedges, because the basket is short and a wedge stands up in it. **[to establish]**
    200°C, 15–18 minutes. Two things. The sugar that catches and burns on a tray behaves better in moving air,
    and the file should say so rather than only claiming it is faster.

11. **Charred broccoli** — **`kit: Air Fryer` variant of `charred-broccoli`.** The one caution: the
    florets char and the stems do not, so this is a dish about cutting evenly, which is a judgement
    and not a time. Two things. **[ATK]** 175°C/350°F for **8–12 minutes**, tossed halfway — and
    tossed first with *equal parts water and oil*, which is a technique and not a garnish: the
    water steams the floret soft, and once it has boiled off the oil browns it. That two-stage
    trick is the sourced answer to the complaint that air-fried vegetables come out dry, and it
    should be written into every vegetable rank on this page.

12. **Batata harra** — **`kit: Air Fryer` variant of `batata-harra`.** The plain file deep-fries the
    cubes and then tosses them with garlic, coriander and chile. The basket does the cubes and the
    same bowl does the toss, so it goes from a pan of oil plus two bowls to **two things**. One of
    the clearest wins on the page and it is not a famous air fryer dish, which is the ranking rule
    doing its job.

13. **Bacon** — **standalone.** No bacon recipe exists here. Flat, no oil, no splatter, no pan. **[to establish]**
    190°C, 8–10 minutes. It is a table of one ingredient and that is its problem, not its
    virtue — see the note on the frozen section below, which is the same problem.

14. **Corn ribs** — **standalone.** A cob quartered lengthways, which curls into a rib as it
    cooks. It exists because of the machine rather than despite it, and nothing on the site is a
    counterpart. **[to establish]** 200°C, 12–14 minutes. Two things.

15. **Chicken tikka** — **`kit: Air Fryer` variant of `chicken-tikka`.** The first of the tandoor
    substitutes, and the best of them: the marinade is thick yoghurt that clings rather than a
    batter that blows off, and a basket is the closest a home kitchen gets to a clay oven's dry
    radiant heat. **[to establish]** 200°C, 12–15 minutes, turned once. **Two things** — the marinating bowl and the
    basket — and only if the skewers are dropped, which they can be here and cannot in a tandoor.

16. **Shish tawook** — **`kit: Air Fryer` variant of `shish-tawook`.** The same argument one shelf
    over, and the same two things. **[to establish]** 200°C, 12–14 minutes. The plain file wants a grill, which is the
    thing most of its readers do not have and the reason this variant is worth writing rather than
    merely possible.

17. **Seekh kabab** — **`kit: Air Fryer` variant of `seekh-kabab`.** Mince worked in one bowl,
    moulded straight onto the basket's own bars. **[to establish]** 200°C, 10–12 minutes. Two
    things. The caution
    the file must carry is that the fat renders out and drips, so this is the one dish on the page
    where the drawer under the basket is part of the washing-up and should be counted.

18. **Padrón peppers** — **standalone.** Nothing here to be a variant of. No oil beyond a slick, no
    prep beyond a rinse. **[to establish]** 200°C, 6–8 minutes, until they blister and collapse; salt in the bowl
    you serve from. **One thing**, which puts it level with halloumi as the cleanest pass here,
    and it is on the list at eighteen rather than three only because it is a snack and not a
    dinner.

19. **Crisped marinated tofu** — **`kit: Air Fryer` variant of `crisped-marinated-tofu`.** The
    basket does what a skillet does to tofu without the sticking and without turning each face by
    hand. **[to establish]** 200°C, 15–18 minutes with a shake. **Flagged:** the marinade bowl is the whole question —
    press, marinate and toss in the same bowl and it is two things; use a separate one for the
    cornflour and it is three and it fails.

20. **Crispy roast potatoes** — **`kit: Air Fryer` variant of `crispy-roast-potatoes`.**
    **Flagged hardest on the page, and ranked last of the basket for it.** The plain file parboils,
    and a pot plus a colander plus the basket is three things and two appliances — it fails bars 1
    and 2 as written. The variant has to drop the parboil, which drops the roughed-up starchy
    surface that makes the plain version worth cooking. That is a real loss and the table must
    argue it rather than quietly omit it. Written honestly it is a good weeknight potato; written
    as though nothing was given up it is the advertisement this shelf exists to avoid.

### The pot — ranks 21 to 26

The pot half of the counter is thinner than the basket half and this is the honest reason: **every
Instant Pot recipe already written is a long braise**, because that is what T-002-02 and T-002-03
were asked for. The pot's *short* repertoire — eggs, grains, pulses — has never been written here
at all.

21. **Hard-boiled eggs** — **`kit: Instant Pot` variant of `seven-minute-eggs`.** Five minutes to
    pressure, five under, five in ice. **[to establish]** roughly 25 minutes end to end, **two
    things**, and the shell
    comes off in one piece, which is the actual reason anyone does it this way. The fastest clear
    pass on the whole page.

22. **A pot of plain rice** — **`kit: Instant Pot` variant of `gohan`.** Rinse, water, three
    minutes at pressure, ten of natural release. **[to establish]** under 30 minutes, one thing to
    wash. The plain
    file is a stovetop absorption method and the pressure one is genuinely a different technique,
    not a shortcut.

23. **Red lentil soup** — **`kit: Instant Pot` variant of `red-lentil-soup`.** Dinner in under 30
    minutes from a dry store cupboard, sautéed and pressured in the same pot. **[to establish]** **One thing**, if the
    blending is done with a stick blender in the pot; two if it is not, and the file has to say
    which.

24. **Kitchari** — **`kit: Instant Pot` variant of `kitchari`.** Rice and mung in one vessel is
    what the dish already is; the pot only removes the watching. The plain file's own `>> time:` is
    50 minutes; **[to establish]** the pressure version at roughly 25.

25. **Mujaddara** — **`kit: Instant Pot` variant of `mujaddara`.** This one is worth writing for a
    reason beyond speed. [one-pot.md](one-pot.md) threw `mujaddara` off the One Pot shelf because
    *"lentils simmered apart from the onion skillet"* — two vessels. In the pot the onions
    caramelise on sauté and the lentils and rice go in on top of them, so **the appliance version
    is genuinely one pot where the plain version is two.** That is a claim the plain file cannot
    make and the variant can.

26. **Polenta** — **`kit: Instant Pot` variant of `polenta`.** **[to establish]** nine minutes at pressure against
    forty-five of stirring, and no skin, no catching, no arm. One thing. The plain file's whole
    difficulty is the stirring and pressure removes exactly that.

### Also worth writing, lower down

Each is marked with the call so a writer never has to re-derive it.

**Basket, breaded — all demoted for bar 1, not for quality.** A flour dish, an egg dish and a crumb
dish is three things before the basket is opened, and the honest fix is a bag rather than a bowl:
`karaage` (**kit of `karaage`** — the plain file marinates 30 min, beats an egg through, then
dredges in potato starch, so as written it is three vessels and **fails bar 1**; marinate and
dredge in the bag and it clears), `falafel` (**kit of `falafel`** — the overnight soak is outside
the clock the same way a cure is, but the food processor is a second machine and a second thing),
`onion-rings` (**kit of `onion-rings`** — a wet batter, and the machine's single worst case; see
below), `samosa` (**kit of `samosa`**), `onion-bhaji` (**kit of `onion-bhaji`**),
`hush-puppies` (**kit of `hush-puppies`**), `crab-rangoon` (**kit of `crab-rangoon`**),
`egg-rolls` (**kit of `egg-rolls`**), tonkatsu (**standalone**), korokke (**standalone**),
arancini (**standalone**), mozzarella sticks (**standalone**), scotch egg (**standalone**).

**Basket, skewered and spiced** — the tandoor substitutes, all of which are a marinade bowl plus
the basket and therefore borderline: `chicken-tikka` (**kit of `chicken-tikka`**),
`shish-tawook` (**kit of `shish-tawook`**), `kafta` (**kit of `kafta`**),
`seekh-kabab` (**kit of `seekh-kabab`**), `chicken-shawarma` (**kit of `chicken-shawarma`**),
`meatballs` (**kit of `meatballs`**).

**Basket, vegetables** — `roasted-cauliflower` and the rest are ranked above; still out are padrón
peppers (**standalone**), courgette (**standalone**), `fried-okra` (**kit of `fried-okra`**),
`crispy-roast-potatoes` (**kit of `crispy-roast-potatoes`** — flagged: the plain file parboils, and
a pot plus a colander plus the basket is three things and two appliances, so the variant has to
drop the parboil and argue the loss), `crisped-marinated-tofu` (**kit of
`crisped-marinated-tofu`** — the marinade bowl is the whole question).

**Pot, lower down** — `dal-tadka` (**kit of `dal-tadka`** — the tempering has to go on the pot's own
sauté afterwards or it is a second pan), `chana-masala` (**kit of `chana-masala`** — 35 minutes from
dry chickpeas, which is a real pass and a tight one), steel-cut oats (**standalone**),
`congee` already has a variant at 50 minutes and is the near miss worth re-timing rather than
rewriting.

**The frozen section, and whether it can exist at all.** *Frozen things, done properly* is the
machine's genuine best case and it is the section most at risk of being unbuildable **under this
collection's own rules**. `scripts/check-recipes.mjs:199` rejects a recipe whose grid has fewer
than three columns — *"only one operation — nothing merges, so the table is a list"* — and a bag of
frozen chips is one ingredient and two operations. It is a timing note, not a table. The section
survives only if its items are **dishes built around the frozen thing**: chips with a sauce made
while they cook, spring rolls with a dip mixed in the bowl they are served from, a frozen-prawn
dish that seasons and finishes in one load. All **standalone** — a frozen dish is not a variant of
a recipe that starts by cutting a potato, and writing it as `kit:` of `french-fries` would be
backwards. **T-008-05 should be prepared to drop this section rather than pad it.**

---

## What the basket times actually are

**Every number below is somebody's, and it is said whose.** Machines differ by several hundred
watts and by basket geometry, and a recipe that states a time without stating the machine and the
load has invented one.

**How much the machine itself moves the number.** The same bag of frozen chips is quoted at
**18 minutes in a 1400 W machine, 12 in a 1700 W and 9 in a 2000 W** — a factor of two across
machines a person would buy from the same shelf. And two 1700 W machines still disagree, because
fan design and basket geometry carry as much weight as the power rating. So a single stated time is
wrong for most readers before anything else goes wrong.

**How much the load moves it.** America's Test Kitchen's equipment testing found that the width of
the cooking surface matters more than the height, because the food cooks in one layer; their
winners exceed 10 × 10 inches and hold four chicken cutlets or two 15-ounce bags of chips, while
smaller machines hold two cutlets or one bag. Their flat warning is that *"external dimensions and
stated capacities of air fryers are not reliable indications of how much food they can cook at
once."* A recipe written for one machine's full basket is a recipe for two batches in another's.

**Where the sources disagree, dish by dish.**

- **Wings.** America's Test Kitchen: 400°F, **18–24 minutes**, 2½ pounds, and — unusually —
  *"arrange wings in even layer in air-fryer basket (wings will overlap)"*, with the range written
  wide on purpose to cover a cold or a preheated machine. Recipe sites on the same dish: 390°F for
  10 minutes then 8–10 more; 380°F for 20–24; 400°F for 18–24. **The times broadly agree and the
  loading does not.** Every non-ATK source insists on a single layer with space between each wing
  and warns that a heaped basket steams; ATK, testing on a large machine, permits overlap. A writer
  should give the range and say the load, and should not resolve a disagreement two credible
  sources are actually having.
- **Salmon.** America's Test Kitchen: 400°F, **10–14 minutes**, two 8-ounce fillets at 1½ inches,
  pulled at **125°F** for medium-rare (120°F if wild). Elsewhere: 6 minutes; 7–9 minutes at 200°C;
  10–12 minutes at 400°F for a 1-inch fillet. **The times differ because the thickness differs and
  mostly the sources do not say which** — the useful fact is that time tracks height rather than
  weight, because the heat travels inward. **The finish temperatures genuinely conflict**: 125°F
  (ATK, medium-rare), 130–135°F (several recipe sites, "buttery and not dry") and 145°F (the
  food-safety figure). That is not a rounding difference, it is three different opinions about what
  cooked salmon is, and a recipe here should name its number and say what it is.
- **Vegetables, and the biggest gap between what is printed and what was tested.** Every recipe
  site and every conversion chart puts a basket of vegetables at 200°C/400°F for 12–18 minutes.
  **America's Test Kitchen tried 400°F on brussels sprouts and threw it out** — the outside browned
  before the inside softened — and published **350°F for 20–25 minutes** on 1 lb with 1 Tbsp of oil
  instead. Lower *and* longer, which is the opposite of the direction the received wisdom moves in.
  Their broccoli is **350°F for 8–12 minutes**, tossed halfway and tossed first with **equal parts
  water and oil**: the water steams the floret soft and, once it has boiled off, the oil browns it.
  That two-stage toss is the sourced answer to *air-fried vegetables come out dry*, and no recipe
  site on this shelf's evidence mentions it. They found no cauliflower number, and neither did this
  page — that gap is marked in place rather than filled with the broccoli's.
- **Everything, converted from an oven.** The rule in wide circulation is *drop the oven
  temperature by 25°F and cut the time by 20%*. **This is the rule that manufactures numbers** and
  it should not be used to write a single time on this shelf. It is a starting guess for a cook
  standing at the machine, not evidence.

**What to look for instead of the clock**, which is what a table can actually hold when the clock
cannot be trusted:

- **Wings** — the skin has stopped glistening and gone matt and pebbled; the joint moves freely.
- **Chips** — an edge snaps rather than bends when one is lifted out.
- **Salmon** — the tip of a paring knife meets no resistance and the centre is still translucent.
- **Vegetables** — the shake at the halfway point is where the judgement happens; if the basket
  sounds wet rather than loose, it is crowded and the answer is a second batch, not more minutes.
- **Anything breaded** — the crumb has gone from pale sand to biscuit brown, which happens in the
  last two minutes and not gradually.

---

## Components it would need

- **A basket-load table.** Not a recipe: the one piece of shared knowledge the whole shelf rests
  on, and the equivalent of the pressure-braise table [instant-pot.md](instant-pot.md) asks for.
  How much of a thing fits a small (3.5 L) and a large (5.7 L) basket in one layer, by weight, for
  wings, chips, florets, cubes and fillets. Without it every writer invents a serving size and they
  will not agree.
- **A preheat convention, written down once.** T-008-04 **decided** it and every one of the 21 files
  carries it in the same words — *written for a preheated 5.7 L basket; from cold add three minutes;
  a 3.5 L basket is two batches, not more minutes.* It is therefore not an open question any more;
  it is twenty-one copies of a sentence with no home. It belongs in `docs/knowledge/`, and until it
  is there the twenty-second writer will invent a twenty-second version of it.
- **`~air fry` as a timer name**, added to `src/lib/time.ts` the way T-002-01 added
  `~pressure cook`, `~natural release`, `~come to pressure` and `~quick release`. Without it the
  clock reads a basket cook as hands-on time a cook is standing over, which is wrong — a basket is
  as walk-away as a pressure cooker, minus one shake. **`src/lib/icons.ts:319` already maps
  `air fry` to an oven icon, so the vocabulary is half there and nothing reads the other half.**
  **This is now a live defect rather than a nicety.** `air fry` is in neither `UNATTENDED` nor
  `HANDS_ON`, so the reading falls through to the words of the step, and *fry* is `HANDS_ON`. All
  twenty-one files read correctly today only because every basket cell happens to open with `roast`,
  which `readWords` reaches first. **Reorder any basket cell so `roast` falls after the clock and
  that recipe silently becomes twenty minutes of standing at a machine you can walk away from.**
  The fix is one line and `src/lib/**` is not this ticket's to edit.
- **A shake convention, and the word for it.** Almost every dish on this list is shaken once halfway,
  and it should be one operation written the same way everywhere rather than a sentence twenty
  writers each invent. It is also the only hands-on moment in most of these recipes, so it is where
  the honest hands-on minute goes. **The machine's own verb is currently unusable**: `shake` has no
  entry in `VERB_ICONS` and `src/lib/icons.test.ts:273` fails the build on an unrecognised opening
  verb, so ten cells that wanted to say *shake* say *toss the basket* instead. One line in
  `src/lib/icons.ts` gives the shelf its own word back.
- **A `kit: Air Fryer` sibling badge that means something.** `scripts/parse-recipes.mjs:216` already
  carries `washingUpCount` onto each variant so a page can print it. The page where a deep-fried
  original sits beside its basket version, with **five things** against **two**, is the single
  clearest argument this whole story can make, and it needs no new code — only both files declaring
  the line.

---

## What a table cannot hold

**This section is what stops the shelf becoming an advertisement.** Everything below is a thing the
machine is bad at or a fact about it that no cell can carry.

- **A crowded basket steams instead of crisping**, and this one line decides half the recipes on
  the shelf. It is not a caution, it is the mechanism: the machine is a small convection oven, the
  fan needs a path around each piece, and packing it tightly means the moisture coming off the food
  has nowhere to go. America's Test Kitchen puts it plainly — *"if the food was packed too tightly
  it steamed instead of browned"*, and *"overfilling the basket leads to poor browning and unevenly
  cooked food."* A table can say *one layer*; it cannot hold **how much that is in the reader's
  machine**, and that number changes the recipe.
- **Wet batter blows off.** The circulating air lifts a pourable batter before it sets, so it slides
  off the food, drips onto the element and bakes there. This is the difference between a beer batter
  and a crumb, and it takes `onion-rings`, tempura, corn dogs and fish in batter off the shelf as
  written. An egg-and-dry-crumb coating holds where a liquid one does not, and that is a change to
  the dish rather than a change to the equipment.
- **Anything needing a lot of oil is a fryer, not an air fryer.** A dish whose method is submersion
  — a doughnut, a churro, a proper double-fried chip — is not being adapted, it is being replaced
  with a different dish that resembles it. The honest recipe says which, and a recipe that claims a
  basket version *is* the fried one is the exact advertisement this section exists to prevent.
- **Stacking does not work.** Multi-rack, oven-shaped machines were the consistent failure in
  testing: the upper rack blocks heat from the lower, food on the two levels finishes at different
  times, and crumbs fall through. So *"cook it in two batches"* is a real instruction and not a
  cop-out, and a table with no cell for *"do this twice"* will quietly imply otherwise.
- **Nothing braises in it, and nothing with a sauce works.** A wet dish in a basket is a wet dish
  in a hot draught. That is why this counter needed the pot as its other half rather than being an
  air fryer shelf, and it is the reason the two machines are on one counter at all.
- **Capacity is not a number you can look up.** *"External dimensions and stated capacities are not
  reliable indications of how much food they can cook at once."* A recipe's servings line is
  therefore a claim about the writer's machine, and the only honest version of it says so.
- **The machine's real killer application is not a recipe.** Reheating chips, pizza and anything
  breaded is what people use it for most and it will never be a table: no ingredients, no merge, no
  tree. `check-recipes.mjs:199` refuses a table that does not merge, which is right, and it means
  the machine's best trick has no home here.
- **How loud it is, and how it smells the kitchen out.** A basket of fish is a fact about the
  evening. No cell holds it, and it is a genuine reason a person cooks one thing rather than
  another.

---

## Recorded for whoever reads this next

- **`docs/knowledge/counters.md` now has entries for seventeen of the twenty-two counters, and all
  five it is still missing are the appliance-and-format shelves** — The Bowl Shop, Instant Pot, One
  Pot, Japanese Home Cooking and The Slow Cooker. It was sixteen of twenty-one before this ticket,
  and this counter's entry is the first appliance shelf the file has ever described. T-008-02
  deliberately did not backfill the other five, which would have been five unreviewed essays inside
  a ticket about one shelf. It is a real gap and it is somebody's next job — and the shape of this
  entry is the template, because it is the one that had to solve *what does a counter with no board
  put in its vocabulary table*.
- **`src/lib/icons.ts:319` maps `air fry` to an oven icon.** Twenty-one recipes use it now, so the
  question is live rather than hypothetical: an oven drawn beside a basket dish is not wrong, and it
  is not the picture either. A basket icon is a small job and it is nobody's yet.
- **The One Pot drift is still there and it is now the only one.** `node scripts/menu-sections.mjs`
  named One Pot and Cha Chaan Teng every run when this page was written; Cha Chaan Teng was settled
  by T-007-06, this counter came off the list when its sections were filled, and **One Pot's five
  S-007 soups are the last unplaced slugs on the board**. Not this counter's doing and not fixed
  here — re-sectioning One Pot is a counter decision.
- **Three things this shelf needs that live in `src/lib/**` and could not be touched from here.**
  `'airfry'` in `UNATTENDED` (a live defect — see *Components*), `shake` in `VERB_ICONS`, and a
  `NEVER_WASHED` entry for utensils, which would silence the seven permanent `unaccountedCookware`
  advisories T-008-03 left behind. All three are one line each.
- **The board is 22 counters, not 23.** T-008-05's ticket expected 23; the difference is The Soup
  Pot, which came down under S-007 and is recorded in [README.md](README.md). Every one of the 22
  has something on it and every one is fully sectioned.
- **`docs/knowledge/counters.md` has no entry for the pot half.** This counter's entry describes a
  gate applied to a basket. The six Instant Pot ranks, when someone writes them, will need the
  vocabulary table to say something about pressure that it currently does not.

---

## Where this came from

The air fryer literature is mostly recipe sites rather than test kitchens, which is itself a finding
— it is why the times disagree and why this page gives ranges. What each source established:

- **The times and loads for wings, and the one place a test kitchen disagrees with everybody
  else** — [America's Test Kitchen, *Air-Fryer Chili-Lime Chicken Wings*](https://www.americastestkitchen.com/recipes/15786-air-fryer-chili-lime-chicken-wings),
  which gives 400°F for 18–24 minutes on 2½ pounds, says the range is written to cover a cold or a
  preheated machine, and permits the wings to overlap. Against it,
  [WellPlated](https://www.wellplated.com/air-fryer-chicken-wings/) and
  [Everyday Family Cooking](https://www.everydayfamilycooking.com/air-fryer-chicken-wings/), which
  give 380–400°F over 18–24 minutes and both insist on a single layer with space between each wing.
- **Salmon, and the three different finish temperatures** —
  [America's Test Kitchen, *Air-Fryer Roasted Salmon Fillets*](https://www.americastestkitchen.com/recipes/12457-air-fryer-roasted-salmon-fillets),
  400°F for 10–14 minutes on two 8-ounce 1½-inch fillets, pulled at 125°F (120°F wild);
  [Wholesome Yum](https://www.wholesomeyum.com/air-fryer-salmon/) and
  [The Big Man's World](https://thebigmansworld.com/air-fryer-salmon/) for the shorter times and
  the 130–135°F target; and [Food Republic](https://www.foodrepublic.com/1420100/how-long-to-coook-salmon-air-fryer-filet-size/)
  for the point that time tracks thickness rather than weight.
- **Capacity, basket geometry and why stacking fails** —
  [America's Test Kitchen, *The Best Air Fryers*](https://www.americastestkitchen.com/equipment_reviews/2331-air-fryers),
  which established that cooking-surface width matters more than height, that their winners exceed
  10 × 10 inches and hold four cutlets or two 15-ounce bags of chips against a small machine's two
  and one, that stated capacities are unreliable, and that multi-rack models cook unevenly because
  the upper rack shades the lower.
- **Vegetables, and the number a test kitchen reached by rejecting the popular one** —
  [America's Test Kitchen, *Air-Fried Brussels Sprouts*](https://www.americastestkitchen.com/recipes/12466-air-fried-brussels-sprouts),
  which establishes 350°F for 20–25 minutes on 1 lb with 1 Tbsp of oil **and says it got there by
  testing 400°F and rejecting it**, because the exterior browned before the interior softened;
  [*Air-Fryer Roasted Broccoli*](https://www.americastestkitchen.com/recipes/14763-air-fryer-roasted-broccoli)
  for 350°F over 8–12 minutes tossed halfway; and
  [*When Air-Frying Vegetables, Water and Oil Do Mix*](https://www.americastestkitchen.com/articles/4349-when-air-frying-vegetables-water-and-oil-do-mix),
  which establishes the equal-parts water-and-oil toss and why it works — the water steams first,
  the oil browns after it evaporates.
- **The mechanism behind crowding, and that the machine is a convection oven** —
  [America's Test Kitchen, *A Case for Buying an Air Fryer*](https://www.americastestkitchen.com/articles/1649-a-case-for-buying-an-air-fryer-and-what-you-need-to-make-the-most-of-it)
  (*"a mini convection oven"*, and *"if the food was packed too tightly it steamed instead of
  browned"*) and [*5 Tips for Better Air Frying*](https://www.americastestkitchen.com/articles/6745-5-tips-for-better-air-frying)
  (pat dry, add fat, do not overfill, flip once halfway, cut to an even size).
- **Why wet batter cannot be used** —
  [Mashed, *You Should Never Put Wet Batter In An Air Fryer*](https://www.mashed.com/242567/you-should-never-put-wet-batter-in-an-air-fryer-heres-why/)
  and [The Daily Meal](https://www.thedailymeal.com/1507682/reason-avoid-putting-wet-batter-air-fryer/),
  which agree that the circulating air lifts the batter before it sets and that egg-and-dry-crumb is
  the working substitute rather than a compromise.
- **How much the machine itself changes the number** —
  [Modern Kitchen Cookware, *Air Fryer Wattage Comparison*](https://modernkitchencookware.com/air-fryer-wattage-comparison-chart-complete-guide-to-power-efficiency-cost/),
  for the 1400 W / 1700 W / 2000 W figures on one bag of chips and for the point that two machines
  of equal wattage still differ on fan design and basket geometry.
- **The conversion rule, cited so it can be refused** —
  [The Foodie Physician, *Oven to Air Fryer Conversion*](https://thefoodiephysician.com/easy-oven-to-air-fryer-conversion-guide/),
  which states the widely repeated *drop 25°F, cut 20%*. It is recorded here as the thing not to
  write a recipe from.

**Measured rather than sourced.** Every figure in *The gate, measured* and *The shelf, item by item*
comes from this repository: `src/generated/recipes.json` at **685 recipes**, read through
`buildSchedule()` in `src/lib/schedule.ts`, with bar 2 read off each file's step prose rather than
its `cookware` line, for the reason [one-pot.md](one-pot.md) gives. **The script is
`docs/active/work/T-008-05/gate.mjs`** and its full output is `gate-output.md` beside it; run

```
node docs/active/work/T-008-05/gate.mjs
```

from the repository root after `npm run recipes` and every number on this page comes back. The
earlier, smaller measurement it replaces is in `docs/active/work/T-008-02/plan.md` §7.

**Where the script is not the authority**, said once so it is not buried: bar 2 on the Instant Pot
shelf is T-008-03's hand reading, not the lexicon's, and nine verdicts differ. That is recorded in
*Where the script was overruled, and by whom* with every slug named.
