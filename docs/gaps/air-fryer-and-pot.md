# The Air Fryer & the Pot — what is missing

**0 recipes, and the zero is the finding.** This counter is a gate rather than a genre: a dish is
on it only if it washes two things or fewer, is cooked by one plug-in machine, and is on the table
in forty-five minutes. The gate was applied to every recipe on the three shelves that already
promise less work — One Pot's 73, Instant Pot's 25, The Slow Cooker's 20, a pool of 118 with no
overlap between them — and **it admitted none of them**.

That is not the failure this counter was braced for. S-008 worried the shelf would turn out to be
*"a filter wearing a shelf's clothes"*, 90% borrowed from Instant Pot. Measured, the borrowing is
**0%**. Every item here has to be written, which makes this page a commissioning list rather than a
shelving plan, and makes T-008-04 the whole counter rather than a top-up.

The site has no air fryer at all. No `.cook` file declares `kit: Air Fryer`, no recipe names the
machine, no tag mentions it. The only trace anywhere is `src/lib/icons.ts:319`, where `air fry`
already maps to an oven icon — an icon written for a verb nothing uses.

---

## What it has

Nothing yet. The five section titles below are the shape T-008-05 will fill; every list is
deliberately empty, and `node scripts/menu-sections.mjs` reads that as `0 sections, 0/0 placed`
rather than as a fault.

There is no *Also here* section, and that is deliberate. Panadería and Deli both have one and in
both it holds borrows from other counters. This shelf cannot borrow — the measurement below is that
nothing on the site clears its gate — so an *Also here* here would be a bucket built before there
is anything to put in it. [one-pot.md](one-pot.md) already says why that is the wrong shape: *"a
shelf whose items land in Also here has section titles that do not match what is on it."*

Do not run `node scripts/menu-sections.mjs --write` against this page while the lists are empty. It
would replace all five titles with `[]` and drop the shelf-talk note in `counters.json` along with
the eleven others it already drops. The dry run is safe and is the one to use.

No `---` rule closes this section and nothing follows the last title, which is not an oversight
either. The parser reads everything between `## What it has` and the next `##` as the block, splits
it at each bold lead-in, and reports whatever is left over. While the item lists are empty there is
no slug to swallow a trailing rule, so one would print `unparsed: Frozen things, done properly: ---`
on every run. Put it back once the lists have slugs in them.

**Straight out of the basket.**

**Start to finish in the pot.**

**Sheet-pan-shaped, in the basket.**

**Vegetables that go crisp.**

**Frozen things, done properly.**

## The gate, measured

The three bars, exactly as S-008 wrote them and not adjusted anywhere on this page:

1. **`washing-up` of two or fewer**, as declared by the recipe. Authored, never derived — a count
   taken off `cookware` is the thing `src/lib/washing-up.ts` exists to refuse.
2. **One plug-in machine does the cooking.** Air fryer or Instant Pot. Not a hob and then a
   machine; not a machine and then a grill.
3. **On the table in 45 minutes**, wall-clock, pressurising and resting included.

Everything below was measured against `src/generated/recipes.json` — the built collection, 664
recipes — read through `src/lib/schedule.ts`. Nothing is estimated.

### All twenty-five Instant Pot recipes, bar by bar

`>> time:` is the author's own claim about the whole dish. **elapsed** is
`buildSchedule().totalMinutes`, the critical path through the merge tree. **untimed ops** is how
many operations in that file carry no timer at all — `schedule.ts` gives those zero minutes on
purpose, so a row with untimed operations reads *shorter* than it cooks and its elapsed figure is a
floor rather than a clock.

| Recipe | `>> time:` | elapsed | untimed ops | bar 1 | bar 2 | bar 3 |
| --- | --: | --: | --: | --- | --- | --- |
| `collard-greens-instant-pot` | 1 hr | 46 min | 2 | not declared | yes | no |
| `congee-instant-pot` | 1 hr 15 min | 50 min | 2 | not declared | yes | no |
| `ful-medames-instant-pot` | 1 hr 35 min | 65 min | 3 | not declared | yes | no |
| `ham-hock-stock-instant-pot` | 1 hr 30 min | 65 min | 2 | not declared | yes | no |
| `refried-beans-instant-pot` | 1 hr 40 min | 70 min | 1 | not declared | yes | no |
| `cuban-black-beans-instant-pot` | 1 hr 35 min | 71 min | 0 | not declared | yes | no |
| `birria-de-res-instant-pot` | 1 hr 50 min | 79 min | 3 | not declared | yes | no |
| `cachete-instant-pot` | 1 hr 40 min | 82 min | 2 | not declared | yes | no |
| `chili-con-carne-instant-pot` | 1 hr 35 min | 82 min | 2 | not declared | yes | no |
| `hungarian-goulash-instant-pot` | 1 hr 35 min | 83 min | 2 | not declared | yes | no |
| `chile-verde-instant-pot` | 1 hr 45 min | 84 min | 1 | not declared | **no** — the broiler, before the pot | no |
| `boston-baked-beans-instant-pot` | 1 hr 55 min | 85 min | 0 | not declared | yes | no |
| `borscht-instant-pot` | 2 hr | 85 min | 1 | not declared | yes | no |
| `beef-stew-instant-pot` | 1 hr 45 min | 88 min | 2 | not declared | yes | no |
| `chicken-broth-instant-pot` | 1 hr 50 min | 90 min | 1 | not declared | yes | no |
| `carnitas-instant-pot` | 1 hr 45 min | 94 min | 1 | not declared | **no** — the broiler for the crust | no |
| `braised-short-ribs-instant-pot` | 1 hr 50 min | 97 min | 2 | not declared | yes | no |
| `pho-broth-instant-pot` | 2 hr 30 min | 100 min | 1 | **no** (4) | **no** — a dry skillet for the spices | no |
| `beef-bourguignon-instant-pot` | 2 hr | 100 min | 1 | **no** (3) | **no** — a skillet for the garnish | no |
| `oxtails-instant-pot` | 1 hr 50 min | 100 min | 1 | not declared | yes | no |
| `pot-roast-instant-pot` | 2 hr 30 min | 136 min | 2 | not declared | yes | no |
| `chintan-broth-instant-pot` | 3 hr | 150 min | 0 | not declared | yes | no |
| `tonkotsu-broth-instant-pot` | 3 hr 30 min | 170 min | 1 | not declared | yes | no |
| `gigantes-plaki-instant-pot` | 13 hr 30 min | 775 min | 0 | not declared | yes | no |
| `corned-beef-instant-pot` | 5 days 4 hr 30 min | 7470 min | 1 | not declared | yes | no |

**Bar 1: 0 clear it, 2 fail it, 23 cannot be measured.** Only eleven files in the whole 664 declare
`washing-up`, and only two of them are here. `pho-broth-instant-pot` declares four — *the Instant
Pot, a skillet for the spices, a fine sieve, the spice sachet* — and
`beef-bourguignon-instant-pot` declares three. The other twenty-three have never been asked. That
is T-008-03's job and this page does not guess it; guessing is the exact failure the property was
built to end.

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

### Where One Pot and Instant Pot actually fail, which is not where anyone guessed

| Shelf | Recipes | Clear bar 1 | Clear bar 2 | Clear bar 3 | Clear all three |
| --- | --: | --- | --: | --- | --: |
| One Pot | 73 | 4 declared, all ≤ 2 | **0** | 31 by elapsed, 17 by `>> time:` | **0** |
| Instant Pot | 25 | 0 declared, 2 fail | 21 | **0** | **0** |
| The Slow Cooker | 20 | none declared | 20 | **0** — shortest is 4 hr 40 min | **0** |

The three shelves do not overlap: Instant Pot ∩ One Pot is empty and The Slow Cooker ∩ One Pot is
empty, so the pool is 118 distinct recipes and the gate admits none.

**One Pot dies on bar 2, and it dies there at its fastest end.** Its 73 recipes are hob and oven
dishes; not one of them names a plug-in machine that cooks. The casualties are the quick ones —
`western-omelette` at 3 minutes elapsed, `egg-foo-young` at 3, `seaweed-egg-drop-soup` at 6,
`jalfrezi` at 7, `century-egg-amaranth-soup` at 10, `country-fried-steak` at 16. Six recipes that
would walk any speed test, excluded by a bar that has nothing to do with speed, and correctly so:
the shelf's promise is *plug one in*, and a skillet is not plugged in. At the other end the story
is the one S-008 already told — `vindaloo` at 14 hours, `pot-roast` at 4 hr 30 min, `carnitas` at
4 hr, `braised-short-ribs` at 4 hr.

The four One Pot files that have declared a `washing-up` line are `one-pot-pasta` (1),
`shakshuka` (1), `ratatouille` (1) and `beef-bourguignon` (3). The first three are the only recipes
on the site that have proved a one-pot claim rather than asserted it.

**Instant Pot dies on bar 3, unanimously**, and four of its files fail bar 2 as well.
`chile-verde-instant-pot` chars its chiles under the broiler *before* the pot; `carnitas-instant-pot`
finishes under the broiler; `beef-bourguignon-instant-pot` glazes its garnish in a skillet and says
in the file why — *"a separate pan, because the pot is full"*; `pho-broth-instant-pot` toasts its
spices in a dry skillet. All four are honest recipes and all four are two appliances.

**The Slow Cooker clears bar 2 outright and loses bar 3 by six hours.** Its shortest,
`soy-sauce-chicken-slow-cooker`, is 4 hr 40 min. The shelf is a different promise — *fill it before
you leave* — and the two shelves are not in competition at any point.

### Fewer than ten clear it. It is zero, and the bars do not move

The acceptance test for this ticket was that if fewer than ten existing recipes clear all three
bars, the page says so plainly and says what that means. It is zero, so:

**The gate as written admits nothing that exists.** The counter is not a re-cut of the shelves
beside it. It is a new shelf whose entire stock must be written, and the twenty ranks below are
that stock rather than a wish list on top of one.

**What that means, in the order it will bite:**

- **T-008-04 is the whole counter, not a top-up.** Its recipes are not additions to a shelf that
  already has something on it; until it lands, `/menu/air-fryer-and-pot` does not build at all,
  because `src/pages/menu/[counter].astro` filters on `menu.count > 0`.
- **T-008-03's annotation still pays, and it pays somewhere else.** Twenty-three Instant Pot files
  and sixty-nine One Pot files have never declared what is in the sink. Not one of them will clear
  this gate whatever the answer turns out to be — bar 3 and bar 2 have already settled that — but
  One Pot's own promise has never been checked, and that is the claim the property was built for.
  The gate is not the reason to do that work; it is the reason the work was noticed.
- **The gate is not too tight, and this is the evidence.** A bar that admits zero looks broken. It
  is not: the pool it was applied to is 118 recipes written for pots, ovens and crocks, and the
  machine the counter is named after does not appear in a single one of them. A gate cannot admit
  recipes for an appliance the collection has never owned. **The number to re-read this against is
  the one T-008-05 measures after T-008-04 has written for it.** If that number is also small, the
  gate is the problem. Today the empty cupboard is.
- **Under no reading does a bar move to improve the count.** Bar 3 at 90 minutes would admit 21 of
  the 25 Instant Pot recipes overnight and the shelf would look healthy by Friday. S-008 forbids
  exactly that, twice, and it is worth restating where the temptation actually lands: it lands
  here, on this page, on the day someone reads a zero.

---

## What it is missing

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

### The basket — ranks 1 to 14

1. **Chicken wings** — **standalone.** Nothing here to be a variant of: there is no `wings`, no
   `buffalo-wings`, no `chicken-wings`. The single most-searched thing anyone does with the
   machine, and it clears the gate without redesigning anything — dry the wings, toss them with
   salt and baking powder in the bowl you will serve them from, basket, one flip. **Two things, and
   arguably one.** 200°C/400°F, 18–24 minutes; see *what the basket times actually are* below,
   where this dish is also where the sources disagree most sharply.

2. **Brussels sprouts** — **`kit: Air Fryer` variant of `roasted-brussels-sprouts`.** The machine's
   best vegetable and the cleanest gate pass on the page: halve, toss in one bowl, basket, 200°C
   for 12–15 minutes with a shake. The loose outer leaves that burn on a sheet tray fall through
   and crisp here. Two things.

3. **Halloumi** — **`kit: Air Fryer` variant of `seared-halloumi`.** Needs no oil at all, which is
   the rarest thing on this list, so it is **one thing**: the basket. 200°C, 8–10 minutes, turned
   once. The plain file's skillet is the only vessel it removes and the only one it had.

4. **Chips, from a raw potato** — **`kit: Air Fryer` variant of `french-fries`.** The dish the
   appliance is bought for. **Flagged, because bar 3 is genuinely in doubt:** the plain file soaks
   the cut potato in cold water to pull the starch, and thirty minutes of soaking is wall-clock
   whether or not anyone is standing there. Soak included, this is 50–55 minutes and it **fails**.
   The writer has two honest ways out and must pick one in the file rather than leave it: soak the
   night before and declare the recipe as starting from soaked potato, or drop the soak and say in
   the table what is lost. **Do not simply omit the soak from the clock.**

5. **Cauliflower** — **`kit: Air Fryer` variant of `roasted-cauliflower`.** Florets, one bowl,
   200°C for 15–18 minutes. The steam that pools under cauliflower on a tray has somewhere to go
   here, which is a real improvement and not only a shortcut. Two things.

6. **Blackened salmon** — **`kit: Air Fryer` variant of `blackened-salmon`.** The argument for this
   one is not speed. Blackening is a smoking-hot dry cast-iron pan and a spice crust, and doing it
   indoors sets off the smoke alarm and coats the kitchen; the basket is the version a person can
   actually cook on a Tuesday. 200°C, 8–12 minutes by thickness. Two things: the basket and the
   plate the spice was pressed on. The finish temperature is contested and the disagreement is
   recorded below.

7. **Crispy chickpeas** — **`kit: Air Fryer` variant of `crispy-chickpeas`.** A drained tin, dried
   properly, one bowl of oil and spice, 200°C for 12–15 minutes with two shakes. Two things, and
   the machine beats the oven outright — a sheet tray takes 35 minutes and half of them stay soft.

8. **Chicken thighs, bone-in and skin-on** — **standalone.** There is no plain chicken-thigh recipe
   here; `pulled-roast-chicken` is a whole bird and `smoked-chicken` is a pit. Skin-side up, no
   turning, 190°C for 22–25 minutes to 74°C. One thing to wash if the seasoning goes on in the
   basket, two if it does not.

9. **Saba shioyaki** — **`kit: Air Fryer` variant of `saba-shioyaki`.** Salt-grilled mackerel
   without a grill, which is the single most common thing the machine is used for in a Japanese
   home kitchen and the reason it is here rather than lower. The plain file wants a fish grill most
   people do not have. 200°C, 10–12 minutes, skin side up, no turning. Two things.

10. **Sweet potatoes** — **`kit: Air Fryer` variant of `roasted-sweet-potatoes`.** Cubes rather than
    the oven's wedges, because the basket is short and a wedge stands up in it. 200°C, 15–18
    minutes. Two things. The sugar that catches and burns on a tray behaves better in moving air,
    and the file should say so rather than only claiming it is faster.

11. **Charred broccoli** — **`kit: Air Fryer` variant of `charred-broccoli`.** The one caution: the
    florets char and the stems do not, so this is a dish about cutting evenly, which is a judgement
    and not a time. 200°C, 10–12 minutes. Two things.

12. **Batata harra** — **`kit: Air Fryer` variant of `batata-harra`.** The plain file deep-fries the
    cubes and then tosses them with garlic, coriander and chile. The basket does the cubes and the
    same bowl does the toss, so it goes from a pan of oil plus two bowls to **two things**. One of
    the clearest wins on the page and it is not a famous air fryer dish, which is the ranking rule
    doing its job.

13. **Bacon** — **standalone.** No bacon recipe exists here. Flat, no oil, no splatter, no pan:
    190°C for 8–10 minutes. It is a table of one ingredient and that is its problem, not its
    virtue — see the note on the frozen section below, which is the same problem.

14. **Corn ribs** — **standalone.** A cob quartered lengthways, which curls into a rib as it
    cooks. It exists because of the machine rather than despite it, and nothing on the site is a
    counterpart. 200°C, 12–14 minutes. Two things.

### The pot — ranks 15 to 20

The pot half of the counter is thinner than the basket half and this is the honest reason: **every
Instant Pot recipe already written is a long braise**, because that is what T-002-02 and T-002-03
were asked for. The pot's *short* repertoire — eggs, grains, pulses — has never been written here
at all.

15. **Hard-boiled eggs** — **`kit: Instant Pot` variant of `seven-minute-eggs`.** Five minutes to
    pressure, five under, five in ice. Roughly 25 minutes end to end, **two things**, and the shell
    comes off in one piece, which is the actual reason anyone does it this way. The fastest clear
    pass on the whole page.

16. **A pot of plain rice** — **`kit: Instant Pot` variant of `gohan`.** Rinse, water, three
    minutes at pressure, ten of natural release. Under 30 minutes, one thing to wash. The plain
    file is a stovetop absorption method and the pressure one is genuinely a different technique,
    not a shortcut.

17. **Red lentil soup** — **`kit: Instant Pot` variant of `red-lentil-soup`.** Dinner in under 30
    minutes from a dry store cupboard, sautéed and pressured in the same pot. **One thing**, if the
    blending is done with a stick blender in the pot; two if it is not, and the file has to say
    which.

18. **Kitchari** — **`kit: Instant Pot` variant of `kitchari`.** Rice and mung in one vessel is
    what the dish already is; the pot only removes the watching. The plain file is 50 minutes and
    this is about 25.

19. **Mujaddara** — **`kit: Instant Pot` variant of `mujaddara`.** This one is worth writing for a
    reason beyond speed. [one-pot.md](one-pot.md) threw `mujaddara` off the One Pot shelf because
    *"lentils simmered apart from the onion skillet"* — two vessels. In the pot the onions
    caramelise on sauté and the lentils and rice go in on top of them, so **the appliance version
    is genuinely one pot where the plain version is two.** That is a claim the plain file cannot
    make and the variant can.

20. **Polenta** — **`kit: Instant Pot` variant of `polenta`.** Nine minutes at pressure against
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
- **A preheat convention.** Some machines have a preheat button and some do not, and a recipe that
  assumes one is wrong for half its readers. Two lines, decided once: whether the stated time
  assumes a cold or a hot basket, and what to add if it is the other one. ATK writes its ranges
  wide enough to cover both, which is one legitimate answer and should be the one adopted or
  explicitly rejected.
- **`~air fry` as a timer name**, added to `src/lib/time.ts` the way T-002-01 added
  `~pressure cook`, `~natural release`, `~come to pressure` and `~quick release`. Without it the
  clock reads a basket cook as hands-on time a cook is standing over, which is wrong — a basket is
  as walk-away as a pressure cooker, minus one shake. **`src/lib/icons.ts:319` already maps
  `air fry` to an oven icon, so the vocabulary is half there and nothing reads the other half.**
- **A shake convention.** Almost every dish on this list is shaken once halfway, and it should be
  one operation written the same way everywhere rather than a sentence twenty writers each invent.
  It is also the only hands-on moment in most of these recipes, so it is where the honest hands-on
  minute goes.
- **`washing-up` on every file this shelf touches.** Not a component so much as a precondition: the
  gate's first bar is unreadable on 92 of the 118 recipes in the candidate pool. T-008-03 owns it.
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

- **`docs/knowledge/counters.md` has entries for sixteen of the twenty-two counters, and all six it
  is missing are the appliance-and-format shelves** — The Bowl Shop, Instant Pot, One Pot, Japanese
  Home Cooking, The Slow Cooker, and until this ticket, this one. T-008-02 wrote the entry for this
  counter and deliberately did not backfill the other five, which would have been five unreviewed
  essays inside a ticket about one shelf. It is a real gap and it is somebody's next job.
- **`src/lib/icons.ts:319` maps `air fry` to an oven icon.** It is the right icon and nothing uses
  it yet. When T-008-04 lands, check whether a basket deserves its own.
- **The One Pot drift is still there.** `node scripts/menu-sections.mjs` still names One Pot and
  Cha Chaan Teng every run. Neither is this counter's doing and neither moved.

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

**Measured rather than sourced.** Every figure in *The gate, measured* comes from this repository:
`src/generated/recipes.json` at 664 recipes, read through `buildSchedule()` in
`src/lib/schedule.ts`, with bar 2 read off each file's step prose rather than its `cookware` line,
for the reason [one-pot.md](one-pot.md) gives. The script is in
`docs/active/work/T-008-02/plan.md` §7 and the numbers can be reproduced by running it.
