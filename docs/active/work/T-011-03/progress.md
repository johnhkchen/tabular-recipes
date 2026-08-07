# T-011-03 — Progress

**Done.** 46 of 685 files carry a `>> capacity:` line. Two commits, `939d8b5` and `aebb954`.
`npm run check` reads 685 files with no failure and no new warning; `npm run verify` passes —
1104 tests in 16 files, 710 pages built.

Every step in `plan.md` ran in order and none deviated.

---

## 1. Was a capacity ever derived from servings alone? Checked, and no

**Checked, and the answer is no.** The test applied to every row: *delete `>> servings:` from this
file — is the sentence the number came from still there?*

- **25 files**: the number comes from a batch count the author wrote — *"in two batches"*,
  *"in three batches"*. The division needs `s`, but the fact that the vessel binds, and how many
  loads it takes, is in the step.
- **21 files**: the number comes from *"Written for a preheated 5.7 L basket … A 3.5 L basket is
  two batches, not more minutes"* plus *"one layer"* on the step. The file names the machine, its
  size, and what a smaller one costs. That is a statement about the vessel, not about the yield.

**The forbidden move — "it serves 4 and uses a skillet, so the skillet holds 4" — appears nowhere,
and 98 area-bounded files were refused precisely because it was the only reading available.** §5
lists them.

## 2. The 55 that say it in prose

70 files carry a load statement in a step. 46 determined a capacity; **24 did not**, and each is
below with its reason. (The ticket's count of 55 predates the collection's growth to 685 files; the
word `batch` occurs in 71 files, of which 19 use it as a quantity — `croissant dough{1%batch}` — or
in a `>> slack:` line meaning *the lot*.)

### The 25 that state a batch count — `c = ceil(s/N)`, one row each

Every `c` was verified to reproduce the author's own load count: `ceil(s/c) = N`.

| File | The file's own words | `s` | `N` | `c = ceil(s/N)` | elapsed at 12 |
| --- | --- | ---: | ---: | ---: | ---: |
| `beef-with-broccoli` | *sear … in two batches so it browns rather than steams* | 4 | 2 | ⌈4/2⌉ = **2** | 34 → 42 |
| `general-tsos-chicken` | *fry … in two batches at 350°F* | 4 | 2 | ⌈4/2⌉ = **2** | 37 → 51 |
| `orange-chicken` | *fry … in two batches at 350°F* | 4 | 2 | ⌈4/2⌉ = **2** | 37 → 51 |
| `sesame-chicken` | *fry … in two batches at 350°F* | 4 | 2 | ⌈4/2⌉ = **2** | 37 → 51 |
| `sweet-and-sour-pork` | *fry … in two batches at 350°F* | 4 | 2 | ⌈4/2⌉ = **2** | 29 → 47 |
| `batata-harra` | *in two batches … until they are dark gold* | 4 | 2 | ⌈4/2⌉ = **2** | 21 → 31 |
| `fried-chicken` | *Fry in two batches and let the fat climb back to 325°F between them* | 6 | 2 | ⌈6/2⌉ = **3** | 271 → 287 |
| `soy-sauce-pan-fried-noodles` | *fry flat 5 min, two batches, still between turns* | 2 | 2 | ⌈2/2⌉ = **1** | 7 → 37 |
| `wonton-soup` | *Boil … in a wide pot of water, in two batches* | 4 | 2 | ⌈4/2⌉ = **2** | 24 → 32 |
| `borscht-instant-pot` | *brown … in their own fat 10 min, in two batches* | 6 | 2 | ⌈6/2⌉ = **3** | 93 → 111 |
| `beef-bourguignon-instant-pot` | *brown 12 min, in two batches* | 6 | 2 | ⌈6/2⌉ = **3** | 110 → 155 |
| `beef-stew-instant-pot` | *in two batches with room around every cube* | 6 | 2 | ⌈6/2⌉ = **3** | 88 → 108 |
| `beef-stew-slow-cooker` | *in two batches with room around each cube* | 6 | 2 | ⌈6/2⌉ = **3** | 517 → 554 |
| `braised-short-ribs-instant-pot` | *sear 12 min, in two batches, standing them on the meat faces* | 4 | 2 | ⌈4/2⌉ = **2** | 97 → 151 |
| `cachete-instant-pot` | *in two batches, until each face is properly dark* | 6 | 2 | ⌈6/2⌉ = **3** | 82 → 92 |
| `carnitas-instant-pot` | *in three batches — the pot's element is small and narrow* | 8 | 3 | ⌈8/3⌉ = **3** | 94 → 103 |
| `carnitas-slow-cooker` | *in three batches — crowded, it steams* | 8 | 3 | ⌈8/3⌉ = **3** | 502 → 511 |
| `chili-con-carne-instant-pot` | *brown 12 min, in two batches* | 6 | 2 | ⌈6/2⌉ = **3** | 82 → 102 |
| `chili-con-carne-slow-cooker` | *in two batches with room around every piece* | 6 | 2 | ⌈6/2⌉ = **3** | 512 → 544 |
| `dansak` | *sear 8 min in batches … in two batches* | 6 | 2 | ⌈6/2⌉ = **3** | 82 → 94 |
| `oxtails` | *brown 12 min … in two batches* | 6 | 2 | ⌈6/2⌉ = **3** | 197 → 209 |
| `oxtails-instant-pot` | *in two batches, on the cut faces where the meat is* | 6 | 2 | ⌈6/2⌉ = **3** | 100 → 120 |
| `oxtails-slow-cooker` | *brown 12 min in a skillet … in two batches* | 6 | 2 | ⌈6/2⌉ = **3** | 572 → 604 |
| `rogan-josh` | *in two batches so the pieces brown rather than steam* | 6 | 2 | ⌈6/2⌉ = **3** | 106 → 122 |
| `vindaloo` | *in two batches, scraping the paste off the bottom* | 6 | 2 | ⌈6/2⌉ = **3** | 793 → 806 |

**The rounding, stated.** `⌈8/3⌉ = 3` where the true load is 2.67. Both `carnitas` files say 3
loads at 8 servings, which is what `c = 3` reproduces; at 24 servings it gives 8 loads where 2.67
would give 9. One load in eight, and it errs towards a quieter evening — the wrong direction for
this repo, small, and stated rather than hidden.

### The 24 that did not determine one

| File | What it says | Why it does not determine `c` |
| --- | --- | --- |
| `karaage` | *in batches* | No count. `scaling.md` §7 says the same of this file. |
| `french-fries` | *in batches small enough that the oil does not drop below 350°F*, and *Rest in one layer on a rack 30 min* | No count, and the file says outright the bound is temperature. The one layer is a rest on a rack. |
| `chile-verde` | *in batches with room around every piece* | No count. |
| `chile-verde-instant-pot` | *in batches with room around every piece* | No count. |
| `chile-verde-slow-cooker` | *in batches with room around every piece* | No count. |
| `braised-short-ribs-slow-cooker` | *in batches, on the meat faces* | No count — its Instant Pot sibling says *two* and got a line. |
| `lamb-tagine-slow-cooker` | *in batches* | No count. |
| `sambousek` | *in batches, turning once* | No count. |
| `onion-bhaji` | *5 min a batch* | A time per batch, not a number of them. |
| `falafel` | *six at a time*, and the grind *in three batches* | *Six at a time* is a count of falafel, and the file never says how many falafel a serving is. The three batches are the food processor during prep. |
| `kibbeh` | grind *in batches* in a food processor | Prep, no count. |
| `nixtamalised-masa` | *through a mill, or in batches in a food processor* | Prep, no count, and an alternative rather than the method. |
| `sicilian-pan-dough` | *Press it out in two goes if it fights you. It cannot be halved into smaller trays* | *Two goes* is about a stiff dough resisting, not about loads; and the sentence bounds scaling **down**, not up. |
| `birista` | *Drain in one layer on paper* | Paper on a counter is not a vessel. |
| `crispy-chickpeas` | *leave them uncovered in a single layer to cool* | Cooling, not cooking. |
| `harvest-chopped-salad` | *spread them on parchment … in a single layer* | Cooling nuts. |
| `harvest-bowl` | *in one layer and not stirred for the first twenty* | Says the amount fits the sheet pan; not that the pan is full. |
| `crisped-marinated-tofu` | *in one layer, one face at a time* | A *wide skillet* with no size given. |
| `oyakodon` | *Lay into … in one layer* | A *small frying pan* with no size, and the layer is about the egg setting. |
| `shogayaki` | *one layer, about a minute a side* | Frying pan, no size. |
| `buri-daikon` | *in one layer and never at more than a lazy bubble* | Wide pot, no size. Charging a 25-minute simmer twice on that is exactly the confident wrongness the ticket warns about. |
| `saba-no-misoni` | *skin-side up and in one layer* | Wide pan, no size. |
| `kabocha-no-nimono` | *Arrange skin-side down in one layer in a wide saucepan* | Wide saucepan, no size. |
| `osso-buco-slow-cooker` | *the shanks standing upright in one layer so the marrow stays in the bone* | The reason given for the one layer is the marrow, not the cooker's limit — and a slow cooker is a pot. |

## 3. Every S-008 air fryer file carries a capacity — 21 of 21

No discrepancy. All 21 files whose slug begins `air-fryer-` declare `#air fryer basket{}` and carry
the S-008 gate line. All 21 now carry
`>> capacity: <s> — one 5.7 L air fryer basket, roast, air fry`.

`c = s` on every one: 4 for nineteen of them, **2** for `air-fryer-reheated-pizza` and
`air-fryer-saba-shioyaki`, which are written for two.

**Why `c = s` here is not a capacity read off the servings.** The file states the machine
(`5.7 L`), states the load (*one layer*, sometimes *not touching*, *with room around each wing*),
and states what a smaller machine costs (*a 3.5 L basket is two batches*). Those three sentences
pin the basket's limit at this quantity. It is also the cautious reading: if the basket in fact
takes five servings, the line under-states it, which errs towards a busier evening —
`schedule.ts:longestUnbroken()`'s stated convention.

**Two operations, and this is the finding of the ticket.** Every basket file writes its step as
`roast in the basket …` and its timer as `~air fry{21%min}`. A capacity naming only `roast` binds
the step, passes every check in the repo, and charges **nothing**:

| `air-fryer-chicken-wings`, at twelve servings | elapsed | the vessel costs |
| --- | ---: | ---: |
| `>> capacity: 4 — … , roast` | 21 | **0** |
| `>> capacity: 4 — … , roast, air fry` | **63** | **42** |

A capacity that names the label's verb and not the timer's is a line that reads correctly and
prices nothing. `roast` is what makes the line legible to a person; `air fry` is what makes the
minutes land. Both are the file's own words.

## 4. The four deep-fry files: the oil, not the pan

`general-tsos-chicken`, `orange-chicken`, `sesame-chicken` and `sweet-and-sour-pork` are annotated
`>> capacity: 2 — four cups of oil in the wok, fry`.

**The bound is the oil's temperature, not the wok's floor.** Three independent readings agree:

1. Two neighbours state the mechanism where these four only imply it. `fried-chicken`: *"let the
   fat climb back to 325°F between them."* `french-fries`: *"in batches small enough that the oil
   does not drop below 350°F."*
2. `docs/gaps/one-pot.md` calls them *"four cups of peanut oil double-fried in two batches"* — the
   oil is the subject.
3. The arithmetic. All four come out at **`costMinutes = 0`**: elapsed 37 → 51 at twelve servings,
   and every one of those extra minutes is frying that was going to happen anyway. That is
   `scaling.md` §7's finding for `karaage`'s oil bath reproduced on four more files — *it is not
   batching that costs, it is the length of the wait inside the batch.*

So the vessel is written as the oil rather than the wok. A cook with a wider wok does not get more
capacity; a cook with more oil does, and naming the oil is what lets them see that.

## 5. The 24 that name a bounding vessel, classed

The ticket's *"24 files name a bounding vessel"* is a narrower net than the collection now needs:
**119 files** name a vessel whose limit is area — sheet pan, baking sheet, baking steel, griddle,
waffle iron, pizzelle iron, comal, tawa, crepe pan, tamagoyaki pan, madeleine pan, plancha, mitad,
steamer, air fryer basket, charcoal grill, smoker, paella pan, peel, foil pan. All 119 were read.
**21 are bounded and annotated** (the baskets); **98 are bounded and unmeasured**, which is a
different answer from *not bounded*.

| Vessel | Files | Bounded? | Why nothing is written |
| --- | ---: | --- | --- |
| air fryer basket | 21 | **yes** | annotated |
| sheet pan / half-sheet / foil-lined | 25 | yes, unmeasured | No file says how full the pan is. `roasted-brussels-sprouts` spreads 1½ lb of halved sprouts cut-side-down on a half sheet that would take three times that. |
| baking sheets, cookies | 19 | yes, unmeasured | *"line two baking sheets"* for 48 cookies, and never how many rounds go on one — nor whether the oven takes both sheets at once, which is the difference between one load and two. |
| comal | 8 | mostly no | Six of the eight char aromatics for a sauce (`salsa-roja`, `mole-poblano`, `adobo-para-al-pastor`) — crowding a comal of tomatoes makes them slower, not different. `corn-tortillas` is one at a time and never says how many a serving is. |
| smoker | 9 | no | A brisket is one piece. Grate area is real and no file's yield approaches it. |
| steamer / bamboo steamer | 11 | yes, unmeasured | `har-gow` steams 24 dumplings *"well apart"*, `char-siu-bao` 12 buns the same. Neither says how many tiers, or how many to a tier. |
| baking steel | 6 | yes, unmeasured | `margherita` bakes one 12-inch pie for two servings on a steel whose size the file never gives. Whether a second pie fits is a fact about the reader's oven. |
| charcoal grill | 4 | yes, unmeasured | Grate area binds `kafta` and `shish-tawook`; no file states it. |
| griddle | 3 | yes, unmeasured | `buttermilk-pancakes` never says how many cakes a serving is. |
| tawa | 3 | yes, unmeasured | One flatbread at a time; no count per serving. |
| waffle iron · pizzelle iron · crepe pan · tamagoyaki pan · madeleine pan · mitad | 6 | yes, unmeasured | One item at a time by construction. `buttermilk-waffles` serves 6 and never says how many waffles that is. |
| peel · paella pan · plancha · grill | 4 | no or unmeasured | One pan per recipe by construction, or a single piece of food. |

**The one-sentence fix, and it is not this ticket's.** The baskets are annotatable for exactly one
reason: S-008's gate made every air fryer file say what machine it was written for. Nothing else in
the collection does. *"Written for a 13×18-in sheet pan"* on the roast-vegetable files, or
*"two tiers of a 10-inch steamer"* on the dumplings, would unlock about 60 more files without
anybody guessing. Recorded as a finding.

## 6. The fraction, and the over-annotation test

**46 of 685 = 6.7%.** Against the ticket's denominator, 46 of 658 = **7.0%**. The signal the ticket
sets is a quarter; this is a little over a quarter of that.

The distribution is the check that matters more than the fraction. **The 21 files where the vessel
costs real minutes are all one machine**, and the other 25 cost between −2 and +8 minutes at twelve
servings. If the annotation had been over-eager, the second group would be full of expensive
inventions. It is not: it is full of zeroes, which is what `scaling.md` §2 predicts for a vessel
that binds work rather than a wait.

## 7. The cost function over every annotated recipe

`costOf()` at 2×, 3× and 12 servings on all 46, each also computed with the capacity removed.
**No `NaN` anywhere, and `longest ≤ standing` on every row at every size.**

### The ten largest jumps in elapsed time — written size → 12 servings

| # | Recipe | written | at 12 | jump | loads | of that, the vessel |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | `air-fryer-saba-shioyaki` | 31 | 86 | **+55** | 1 → 6 | +55 |
| 2 | `braised-short-ribs-instant-pot` | 97 | 151 | **+54** | 2 → 6 | +0 |
| 3 | `air-fryer-chicken-thighs` | 28 | 74 | **+46** | 1 → 3 | +46 |
| 4 | `beef-bourguignon-instant-pot` | 110 | 155 | **+45** | 2 → 4 | +0 |
| 5 | `air-fryer-chips` | 22 | 66 | **+44** | 1 → 3 | +44 |
| 6 | `air-fryer-brussels-sprouts` | 22 | 66 | **+44** | 1 → 3 | +44 |
| 7 | `air-fryer-chicken-wings` | 21 | 63 | **+42** | 1 → 3 | +42 |
| 8 | `beef-stew-slow-cooker` | 517 | 554 | **+37** | 2 → 4 | +0 |
| 9 | `air-fryer-batata-harra` | 18 | 54 | **+36** | 1 → 3 | +36 |
| 10 | `air-fryer-tofu` | 27 | 61 | **+34** | 1 → 3 | +34 |

**The table splits itself in two, and the split is the story's whole argument.** Seven rows are
baskets, where every minute of the jump is the vessel: a twenty-minute wait, three times over.
Three rows are pots, where the vessel contributes **nothing** and the jump is hands-on work that
would have tripled anyway — `braised-short-ribs-instant-pot` gains 54 minutes at twelve servings
and would gain the same 54 with no capacity declared at all. Take the capacities away and rows 1,
3, 5, 6, 7, 9 and 10 collapse to 31, 28, 22, 22, 21, 18 and 27.

`air-fryer-saba-shioyaki` tops it because it is written for **two**: twelve servings is six loads of
an eleven-minute roast. That is the honest answer and it is the one this story exists to give — a
cook feeding six from a two-portion basket recipe is standing at the machine for an hour.

### Do any of them look wrong?

**No, and one is worth flagging to T-011-02 rather than fixing here.** Per the AC, a jump that
looks wrong is a finding for T-011-02, not a reason to change a number.

- Both `carnitas` files report `batches.costMinutes = −2`. It is T-011-02's own open concern 2:
  `r < m` is possible (`s = 8, c = 3, n = 12` gives `r = 1.33 < m = 1.5`), so `H_batch·(r − m)` goes
  negative on a part-full last load. The elapsed figure is unaffected and correct. A negative
  "cost of the vessel" is a cosmetic wart on a field a page might print. **Finding for T-011-02.**
- `beef-stew-slow-cooker` at 554 minutes and `vindaloo` at 806 are long because the recipes are —
  a nine-hour slow cook and a twelve-hour marinade. Neither moves with the capacity.

## 8. Deviations from the plan

One, and it is a correction to `structure.md` rather than to the work: `dansak`, `rogan-josh` and
`vindaloo` live in `recipes/stews-and-braises/`, not `recipes/curries/`. The paths in
`structure.md` were corrected before the commit; the files and lines are unchanged.

## 9. What was not touched

`git status` is clean of every ticket-owned path. Nothing outside `recipes/**/*.cook` changed —
no `src/`, no `scripts/`, no `docs/gaps/`, no `README.md`, no `docs/knowledge/`. The four scratch
scripts that derived and checked the table live in the attempt's scratch directory and are not
committed.
