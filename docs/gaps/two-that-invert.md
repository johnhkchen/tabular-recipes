# Two occasions, run against the whole shelf

The method in [`docs/knowledge/occasions.md`](../knowledge/occasions.md) was settled on seventeen
hand-picked recipes. This runs it on all of them, twice, and reports whether it holds.

**Taken 7 August 2026, at 685 recipe files and 27 categories.** Every number below is produced by
[`docs/active/work/T-013-03/rank-the-shelf.ts`](../active/work/T-013-03/rank-the-shelf.ts) — run it
and you get this document's arithmetic back:

```
PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH" \
  node docs/active/work/T-013-03/rank-the-shelf.ts
```

Its full output is kept at `docs/active/work/T-013-03/ranking-output.txt`. It reads
`src/generated/recipes.json` and imports `src/lib/schedule.ts`, `src/lib/scaling.ts` and
`src/lib/meal.ts` directly, so every figure is the site's own and not a second model of the same
graph.

**This reading builds nothing.** No counter is opened, no recipe is written, no `src/` file and no
`.cook` file is touched. It does not edit `occasions.md` either, though it contradicts two things
that file says; those are flagged in [§9](#9-what-this-reading-says-occasionsmd-should-fix) for
whoever owns it.

**Two occasions were chosen because they invert**, and one is enough to prove nothing. A method
demonstrated on a single occasion may be a difficulty filter with a season written on it, and one
example cannot tell the difference.

---

## The short version

| Question | Answer |
| --- | --- |
| Are both occasions real by the *somebody sells for it* rule? | **Yes**, both, on fresh evidence. The party's evidence is a different shape and that shape matters — [§1](#1-are-they-real) |
| Do the two ranked lists differ? | **Yes, and decisively. Zero of ten shared in the top tens; Spearman ρ = −0.591** — [§3](#3-the-overlap-number) |
| Does the party's list contain what the holiday list ranks worst? | **Yes. The holiday list's worst-ranked recipe is the party's #1**, and six of its worst ten are in the party's top ten — [§4](#4-the-inversion-test) |
| Do the tops read as obviously right to a cook? | **The holiday list: yes. The party list: no** — and the reason is not the profile — [§2](#2-the-two-rankings) |
| Can the shelf feed either? | **Neither, yet.** The holiday needs about five files written; the party needs its existing dumplings timed — [§5](#5-can-the-shelf-feed-either) |
| Does the diagnosis explain a real afternoon? | **One true sentence out of a six-dish holiday plate, and S-013's promised sentence is not one this collection can currently say** — [§6](#6-the-holiday-meal-diagnosed) |
| Open either shelf? | **No. Both wait, for different reasons and different amounts of work** — [§7](#7-recommendation) |

**The mechanism works and the food is not there.** That is the same answer
[`what-the-shelf-offers.md`](what-the-shelf-offers.md) reached from the other direction, and it is
the same answer [`soup-pot.md`](soup-pot.md) reached about The Soup Pot. Three readings, three
methods, one conclusion.

---

## 1. Are they real

`occasions.md` §1's rule, unchanged: **an occasion is real if somebody sells for it.** Four kinds of
evidence, each failing differently. Advice is not selling; a tradition with no product is not
selling; search volume is not selling.

`occasions.md` §1 had already put both in its *Applied* table on one sitting's searching. It also
says, in its own closing, that its selling pass is **"eight searches in one sitting"** against
`counters.md`'s six independent readings of seventy menus. So this is a second pass rather than a
citation, and where it agrees with §1 that is now two passes rather than one.

### 1.1 The holiday meal — four kinds, confirmed

| Kind | Source | What it establishes |
| --- | --- | --- |
| **A pre-order sheet with a deadline** | [Cooked Goose Catering, Thanksgiving](https://www.cookedgoosecatering.com/thanksgiving-catering) | The strongest kind, and the cleanest example found. *"Order by: Friday, Nov 20, 2026"*, pickup *"Wednesday, Nov 25, 10 AM–4 PM"*. Two packages: a Heat & Serve at **$319.95 serving 10**, and a Holiday Feast at **$21.95 a head with a fifteen-guest minimum**. A deadline five days out is inventory committed against a forecast |
| **A caterer's seasonal menu** | [Keif's Catering, holiday menu](https://keifscatering.com/holiday-catering-menu/) | A holiday combo **from $45 a head with a ten-person minimum**. Same source `occasions.md` §1 used, re-checked and still live — which is itself the point that file makes about caterers' menus: *a menu that survives a second year is a measurement* |
| **A seasonal bakery board** | [Grand Central Bakery, holiday menu](https://www.grandcentralbakery.com/holiday-menu) · [Baltimore Magazine's round-up of local pie pre-orders](https://www.baltimoremagazine.com/section/fooddrink/where-to-order-thanksgiving-pies-baltimore/) | A pre-order window that opens **6 November and closes 21 November**, and a shop-by-shop list of bakeries whose Thanksgiving pie orders close 20–23 November. The board exists for six weeks and the deadline is the product |
| **A one-night prix fixe, and dining volume** | [National Restaurant Association via restaurant.org](https://restaurant.org/education-and-resources/resource-library/restaurants-to-play-big-role-on-the-mother-of-all-dining-out-days/) · [NRN](https://www.nrn.com/menu-trends/how-restaurant-traffic-will-trend-this-mother-s-day) | **80 million US adults forecast to eat out on Mother's Day, 10 May 2026**, up from 75 million in 2025. The only kind that measures a population rather than a shop. It also carries `occasions.md`'s warning unchanged: **a day people eat out is a day people did not cook** |

**Verdict: real, on all four kinds, and this pass found each of them without difficulty.** The
holiday meal is not the interesting case and the ticket said so.

### 1.2 The dumpling party — the harder case, pushed

The ticket named four places to look: **kits, restaurant classes, the frozen aisle, and shops
selling wrappers by the packet.** All four were looked at. Three of them sell something. One of
them turns out to be the wrong question.

| What was found | Source | What it establishes |
| --- | --- | --- |
| **A priced package with a head-count minimum**, which is a caterer's menu in everything but name | [Mei Mei, private dumpling classes](https://meimeidumplings.com/private-cooking-classes) | The strongest single piece of evidence for this occasion. **$98 a person, minimum $490 or five people**, two hours, private reserved space, *"participants make 15–20 dumplings each to take home"*, plus a 20% hospitality fee. A kids' version at **$78 a head, minimum six or $470**. A virtual version **from $1,450 for twelve with ingredient kits shipped**, scaling to 200. That is a caterer's price sheet — head count, minimum, tiers, service fee — sold against an evening rather than a season |
| **Ticketed events, on a calendar, named "party"** | [Dumpling Academy's Mother's Day class, Sun 10 May 2026](https://www.eventbrite.com/e/2026-mothers-day-weekendsun-lunch-hand-made-dumpling-making-class-philly-tickets-1984595616914) · [the same seller's Father's Day class, Sun 21 June 2026](https://www.eventbrite.com/e/2026-fathers-day-weekend-lunch-hand-made-dumpling-making-class-philly-tickets-1984596375182) · [Handmade Dumpling Party, NYC](https://www.eventbrite.com/e/in-person-class-handmade-dumpling-party-nyc-tickets-1987716528645) · [Handmade Dumpling Party, LA](https://bucketlisters.com/experience/4rz-hand-made-dumpling-making-class) | A one-night prix fixe in the shape `occasions.md` §1 describes, at **$67–$169 a head**, and several of them literally carry the word *party* in the product name. **And note the dates**: a dumpling party attaches itself to somebody else's calendar. Mother's Day and Father's Day are the two dates the trade sells it on |
| **A seasonal retail kit** | [Costco item 1981261, Lunar New Year Make Your Own Dumpling Set](https://app.warehouserunner.com/costco/1981261-lunar-new-year-make-your-own-dumpling-set) · [the trade write-up at launch](https://parade.com/food/costco-new-28-cooking-set-is-an-adorable-last-minute-gift-idea) | Launched at **$27.99, seen at 70 warehouses, cleared to $9.97 by July**. Ten pieces: bamboo steamer, roller, cutter, dumpling press, flour, three sauces, a recipe book. This is the seasonal-board kind of evidence — a product that exists for a window — and the clearance price is part of what it establishes: the window closed |
| **Wrappers by the packet, and this is the one that answers a different question** | [Target's grocery listing](https://www.target.com/s/dumpling+wrappers) — Nasoya won ton wraps 12 oz **$2.59**, egg roll wraps 16 oz **$2.69**, Blue Dragon spring wrappers 16 ct **$2.99**, all SNAP-eligible · [Weee!'s wrapper aisle](https://www.sayweee.com/en/grocery-near-me/lang-en/explore/dumpling-wrapper) | Wrappers are a **staple**, not an occasion product: refrigerated aisle, ordinary grocery price, no season. That is evidence the *food* is everyday. It is **not** evidence for the moment, and admitting it would be the mistake `occasions.md` warns about — an ingredient's availability is not somebody selling for a moment |

**Verdict: real, on three of the four kinds** — a priced package with a minimum, a dated ticketed
event, and a seasonal retail kit. **The missing kind is the pre-order sheet**, and its absence is
informative rather than a gap in the searching: nobody sells *your dumpling party, order by
Friday*, because the thing being bought is the afternoon.

### 1.3 What is actually sold, and why it decides the profile

`occasions.md` §1 noticed this in a half-sentence — *"note what is sold: the making, not the
dumplings"* — and did not develop it. It is the whole justification for the party profile's sign
flip, so it is worth stating properly.

**Every seller above is selling labour to people who want to do it.** Mei Mei's product is two
hours and 15–20 dumplings you fold yourself. Costco's product is a roller, a press and a bag of
flour. The Eventbrite listings sell a room, a teacher and BYOB. **Nobody in this evidence sells a
tray of finished dumplings for a party**, and the frozen aisle — which does sell finished
dumplings, in quantity, all year — sells them for a Tuesday.

So the party profile's `standing(12)` sign is not an aesthetic choice about parties. **It is the
revealed preference in the selling evidence**, which is the same move `counters.md` made on menus
and the same move this whole method rests on. If hands-on time were a cost at a dumpling party,
the frozen aisle would be the party's product and the classes would not exist.

**One thing this pass could not establish, and it is the ticket's honest-failure branch.** Nothing
found sells *catering for a dumpling party at somebody's house*. Every product is either a class
somebody attends or a kit somebody buys. That is closer to a hobby product than to a Thanksgiving
order form, and it is the reason §7 does not treat the two occasions as equally proven. **It
passes the rule. It passes it on thinner evidence than the holiday, and this file says thinner
rather than pretending otherwise** — exactly as `occasions.md` §2 does for a new baby.

---

## 2. The two rankings

### 2.1 How the profiles were transcribed

`occasions.md` §3.3 and §3.4, copied into a table at the top of the script. **No rate was changed,
no gate was softened, and the target stayed at twelve servings.** The ticket is explicit that a
profile shape adjusted to flatter its examples has proved nothing, so the transcription is checked
against the file's own worked figure before anything else runs:

```
transcription check: chili-con-carne = −95.0 under the family profile — reproduced
transcription check: the party's unforgiving term never fires — the gate holds
```

`0 + 0 + (1 × 5) + (4 × −20) + (−20) = −95`, and the script exits non-zero if it does not come out.
Every score `occasions.md` printed for the seventeen is reproduced exactly —
[§9.1](#91-the-seventeen-reproduce) has the table.

**There is no `if (occasion === 'party')` anywhere in the arithmetic.** One scoring function, two
rate tables. That is `occasions.md` §3.2's claim — *the same number, one sign* — asserted
structurally rather than described.

### 2.2 The holiday list — and it reads right

| | Slug | Score | standing | wash | keeps | slack |
| --: | --- | ---: | ---: | ---: | --- | --- |
| **1** | `braised-short-ribs` | **−95** | 0 | 1 | 4 d | forgiving |
| **1** | `cachete` | **−95** | 0 | 1 | 4 d | forgiving |
| **1** | `chili-con-carne` | **−95** | 0 | 1 | 4 d | forgiving |
| **1** | `pot-roast` | **−95** | 0 | 1 | 4 d | forgiving |
| 5 | `lamb-tagine` | −90 | 0 | 2 | 4 d | forgiving |
| 6 | `beef-bourguignon` | −85 | 0 | 3 | 4 d | forgiving |
| 6 | `chicken-broth-instant-pot` | −85 | 0 | 3 | 4 d | forgiving |
| 6 | `corned-beef-instant-pot` | −85 | 0 | 3 | 4 d | forgiving |
| 6 | `ham-hock-stock-instant-pot` | −85 | 0 | 3 | 4 d | forgiving |
| 10 | `japanese-beef-curry` | −75 | 0 | 1 | 3 d | forgiving |

**Read as a cook: this is right, and it is more right than `occasions.md` predicted.** That file's
worked example crowned `chili-con-carne` and called it out as *not a Thanksgiving dish*. At 685
files the same score is a four-way tie and two of the four — **`pot-roast` and
`braised-short-ribs`** — are things a household absolutely puts in the middle of a holiday table.
`lamb-tagine` and `beef-bourguignon` behind them are the same answer in another accent.

The profile has found the **big forgiving braise**: a thing you make the day before, that keeps
four days, that washes one pot, and that does not care if the guests are an hour late. That is a
correct and non-obvious answer to *what should a solo cook put in the middle of a holiday table*,
and no cookbook index would produce it.

**And the bottom is right too**, which matters more than the top:

| | Slug | Score | Why it is last |
| --: | --- | ---: | --- |
| 592 | `patty-melt` | **540** | 270 standing minutes at twelve — a sandwich, griddled one at a time |
| 591 | `birista` | 480 | 240 standing minutes of fried shallots |
| 590 | `beef-rendang` | 240 | 120 standing minutes, **all 120 of them a fallback nobody claimed** |
| 589 | `mujaddara` | 223 | 104 standing minutes |
| 588 | `french-onion-soup` | 206 | 106 standing, 100 of them a fallback |

Nobody makes twelve patty melts for Thanksgiving. The profile agrees.

### 2.3 The dumpling party list — and it does not read right

| | Slug | Score | claimed standing | written servings | wash | slack |
| --: | --- | ---: | ---: | ---: | ---: | --- |
| **1** | `patty-melt` | **405** | 270 | 2 | — | — |
| 2 | `birista` | 360 | 240 | *"1 1/2 cups"* | — | — |
| 3 | `mujaddara` | 150 | 104 | 6 | 3 | — |
| 4 | `luncheon-meat-and-egg-sandwich` | 144 | 96 | **1** | — | — |
| 5 | `bhuna` | 139.75 | 94.5 | 4 | 1 | — |
| 6 | `luncheon-meat-and-egg-noodles` | 126 | 84 | **1** | — | narrow |
| 7 | `tortilla-espanola` | 120 | 96 | 4 | 3 | narrow |
| 8 | `braised-short-ribs-instant-pot` | 119.5 | 81 | 4 | 2 | forgiving |
| 9 | `polenta` | 118 | 80 | 6 | 1 | narrow |
| 10 | `blt` | 108 | 72 | 2 | — | — |

**Read as a cook: this is nonsense, and the reason is not the profile.** Nobody throws a
dumpling party and makes twelve patty melts. But look at the *written servings* column.
**Seven of the top ten are written for four servings or fewer**, and four of them for one or two.

The party profile's only large positive term is `standing(12)`, and `costOf()` scales hands-on work
by `m = wanted / written`. A sandwich written for one is multiplied by twelve. **So at a fixed
target of twelve servings, the party profile is substantially ranking recipes by how small a batch
they were written for.** `luncheon-meat-and-egg-sandwich` has eight honest hands-on minutes and
arrives at 96 because it serves one.

**`birista` is the sharpest form of it and it is a defect in the data, not the model.** Its
`>> servings:` line reads **`1 1/2 cups`**. `servingsOf()` takes the leading number and returns
**1**, so a cup and a half of fried shallots is scaled by twelve and becomes the second-best dish
for a dumpling party in the entire collection. That is one line in one file, and it is worth fixing
before anybody builds on this.

**What the party profile is right about is further down.** `gyoza` at #38 of 234 is the
best-ranked actual dumpling, on 48 claimed standing minutes and a 24-minute unbroken pleating
stretch — which is exactly the dish `occasions.md` said the profile should find. It is buried under
sandwiches, not absent.

### 2.4 The three answers, per profile

`occasions.md` §3.2 demands *ranked · rejected · cannot say*, and absence is never a zero.

| | Holiday meal | Dumpling party |
| --- | ---: | ---: |
| **ranked** | 592 · 86.4% | **234 · 34.2%** |
| **rejected** (`slack: unforgiving`) | 93 · 13.6% | 93 · 13.6% |
| **cannot say** | **0** | **358 · 52.3%** |

Every one of the party's 358 is the same cause: *hands-on evidence is unknown, and this profile
pays for hands-on minutes* — `occasions.md` §3.6's rule, applied. **The rule costs the party more
than half the collection, and that is the rule working**, not failing. `green-beans` drops out
exactly as §3.6 predicted it should.

The holiday profile's **zero** cannot-says are worth a sentence: every file in the collection has a
readable `>> servings:`, so every file can be scaled to twelve, so the only way out of the holiday
ranking is the gate. **The holiday profile ranks 592 recipes and separates almost none of them:**

| | Holiday | Party |
| --- | ---: | ---: |
| distinct scores | 136 over 592 | 108 over 234 |
| largest tie group | **161 recipes, all scoring 0** | 11 recipes, all scoring 36 |
| ranked while sharing a score with somebody | 456 · 77% | 126 · 54% |
| ranked with no `>> slack:` | 269 · 45% | 91 · 39% |
| ranked with no `>> keeps:` | 472 · 80% | 182 · 78% |
| ranked with no `>> washing-up:` | 443 · 75% | 170 · 73% |
| standing minutes that are a fallback rather than a claim | **2,284 of 9,044 · 25%** | 0 · 0% by construction |
| **genuinely good** (ranked, with ≥ 2 of the four fields actually declared) | **241 · 41%** | **163 · 70%** |
| all four fields declared | 35 | 35 |

**`occasions.md` §3.6 found nine of seventeen tied at zero and called it "not a close ranking; it is
no ranking." At 685 files the same tie is 161 recipes.** A quarter of the collection scores
identically under the holiday profile because every field that would separate them is absent.

**And the party's better-looking percentages are an artefact of its own gate**, not of better data:
it looks like 70% genuinely good because the `evidence: unknown` rule already removed the silent
files into cannot-say. The two profiles agree on the underlying number — **35 files, of 685, declare
all four fields.**

---

## 3. The overlap number

The ticket asks for the overlap as a number and says a high one is a failure of the method reported
as a failure, not explained away. Four were computed, all before the lists were read.

### A. The top tens — **0 of 10**

```
family: braised-short-ribs, cachete, chili-con-carne, pot-roast, lamb-tagine,
        beef-bourguignon, chicken-broth-instant-pot, corned-beef-instant-pot,
        ham-hock-stock-instant-pot, japanese-beef-curry
party : patty-melt, birista, mujaddara, luncheon-meat-and-egg-sandwich, bhuna,
        luncheon-meat-and-egg-noodles, tortilla-espanola, braised-short-ribs-instant-pot,
        polenta, blt
shared: 0
```

**Zero.** Not one file appears in both top tens. A reader opening the two shelves sees two
completely different sets of food.

### B. Jaccard over the ranked sets — **0.395**

234 recipes are ranked by both, 592 by either. This one is mostly a **coverage** fact rather than a
ranking fact, because the party's gate removes 358 files the holiday profile keeps, and it is
reported with that caveat attached.

### C. Spearman ρ over the 234 both profiles rank — **−0.591**

This is the number that could have convicted the method and does not. **ρ = −0.591**, over the
population where both profiles have an opinion.

- **ρ near +1** would have been the *easy is good* collapse: two names for one difficulty score.
  That is the failure the ticket names, and it is not what happened.
- **ρ near 0** would have meant the two profiles are reading different mostly-absent fields and
  agreeing about nothing in particular — a third outcome nobody predicted, and also not what
  happened.
- **ρ = −0.591** is a substantial, real inversion. The two orderings are opposed, and they are not
  perfectly opposed because the profiles genuinely differ in more than the sign of one term:
  `keeps` is worth −80 to the holiday and nothing to the party, the washing-up rates differ by a
  factor of 2.5 and by sign, and only the party filters to claimed minutes.

**The method is doing work.** A high overlap would have meant the whole thing reduces to *easy is
good*; the measured overlap says it does not.

### D. The seventeen from `occasions.md` §3.5 — reproduced

See [§9.1](#91-the-seventeen-reproduce). Every printed score comes back identical.

---

## 4. The inversion test

> *Does the dumpling party's list contain the dish the holiday list ranks worst? It should. That
> single inversion is the strongest evidence the system is real, and if it does not happen, say so.*

**It happens.** Run three ways, all three stated.

### 1. The literal test — **passes**

The holiday list's last ranked recipe is **`patty-melt`**, rank 592 of 592, score 540. Nothing
shares that score.

**In the party's list it is rank 1 of 234.** The single worst dish for a family holiday is the
single best dish for a dumpling party, out of 685 files, with no thumb on the scale.

### 2. The bottom ten against the top ten — **six of ten**

| Holiday rank | Slug | Where it lands in the party's list |
| ---: | --- | --- |
| 592 | `patty-melt` | **#1** |
| 591 | `birista` | **#2** |
| 589 | `mujaddara` | **#3** |
| 586 | `luncheon-meat-and-egg-sandwich` | **#4** |
| 585 | `luncheon-meat-and-egg-noodles` | **#6** |
| 583 | `polenta` | **#9** |
| 590 | `beef-rendang` | cannot say — evidence unknown |
| 588 | `french-onion-soup` | cannot say — evidence unknown |
| 587 | `mushroom-risotto` | cannot say — evidence unknown |
| 584 | `risotto-alla-milanese` | cannot say — evidence unknown |

**Six of the holiday list's worst ten are in the party's top ten. The other four are not ranked
below them — they are not ranked at all**, because §3.6's rule refuses to score a hands-on figure
nobody claimed. There is no case where the two profiles agree about a recipe at the extreme.

### 3. The named case — `gyoza` — **the direction holds, the magnitude does not**

`occasions.md` §3.5's headline is `gyoza` at **#17 of 17 for the family and #1 of 17 for the
party.** At 685 files:

| Slug | Holiday | Party |
| --- | --- | --- |
| `gyoza` | **#539 of 592** | **#38 of 234** |
| `samosa` | #446 of 592 | #134 of 234 |
| `egg-rolls` | #427 of 592 | #139 of 234 |
| `green-beans` | #468 of 592 | cannot say |

**The direction is right on every one of them and the magnitude is not.** `gyoza` is in the worst
tenth of the holiday list and is only in the top sixth of the party's, and everything above it is a
sandwich or a fried shallot. **The inversion is real; the party's list is not yet a list of the
party's food**, and §2.3 says why.

**Stated plainly, because the ticket asks for it either way: the test passes.** The strongest form
of the claim — one specific dish, worst here and best there — happens on the whole collection.

---

## 5. Can the shelf feed either

[`what-the-shelf-offers.md`](what-the-shelf-offers.md) §4 is the reason this ticket waited, and its
answer was **"write food before writing features"** with one veto: *a capability whose day-one
answer is the same small set for every reader is ranked last however good it sounds.* Both
occasions are held against it.

### 5.1 The holiday meal

**How many clear the profile: 592 of 685.** That number is meaningless on its own, because the
holiday profile ranks everything with a readable serving count and 161 of them tie at zero.

**How many are genuinely good: 241** — ranked with at least two of the four fields actually
declared. **Thirty-five have all four.**

**How many are holiday food: far fewer.** Searching slug, title, `aka` **and** tags for the plate's
vocabulary returns 91 candidates, and the honest reading of them is short:

| Slot | What exists | Holiday rank |
| --- | --- | --- |
| Centrepiece | `pot-roast` · `braised-short-ribs` · `oxtails` · `baked-turkey-wings` | #1 · #1 · #34 · #296 |
| — a whole roast turkey | **`smoked-turkey-breast` is a 15½-hour smoker recipe and the gate rejects it.** There is no oven turkey | rejected |
| Stuffing | `cornbread-dressing` — serves 10, and its `aka` list says *cornbread stuffing* | #402 |
| Starch | `mashed-potatoes` · `crispy-roast-potatoes` · `candied-yams` | #105 · #357 · #105 |
| Vegetable | `roasted-brussels-sprouts` · `green-beans` · `roasted-cauliflower` · `charred-broccoli` · `creamed-corn` | #357 · #468 · #325 · #357 · #446 |
| Sauce | `cranberry-sauce` · `turkey-pan-gravy` · `onion-gravy` | #105 · #321 · #576 |
| Bread | `dinner-rolls` | #96 |
| Dessert | `apple-pie` · `sweet-potato-pie` · `pecan-pie-bars` | #105 · #105 · #105 |

**The search has to read `aka`, and the first version of this reading did not.** `cornbread-dressing`
is the collection's stuffing and nothing but its `aka` list says so — a scan of slugs and titles
reported a hole that is not there. The script now reads all four fields, and this is worth saying
out loud because *reporting an absence that is not real* is the exact failure this whole document
is trying to catch elsewhere.

**What is conspicuously missing, and it is a short list**, which is the good news:

1. **A roast turkey.** Not a smoked breast, not wings. The one thing every household cooks on the
   one day this occasion is about, and the collection does not have it.
2. **A pumpkin pie.** `frosted-pumpkin-bars` and `pumpkin-bread` exist; the pie does not.
3. **A green bean casserole**, or any of the casserole shape. One file in the collection has
   *casserole* in its name and it is `tuna-noodle-casserole`.
4. **A gratin.**
5. **A second roast** — `goose`, `duck` and `prime rib` all return nothing.

**Five files.** That is what stands between this collection and a holiday plate that does not have a
hole in the middle of it — and unlike `what-the-shelf-offers.md` §4's *forty-eight plants the
collection buys and never cooks*, five is a ticket rather than a season of writing.

### 5.2 The dumpling party

**How many clear the profile: 234 of 685** — a third of the collection, and the low number is
`occasions.md` §3.6's rule doing its job.

**How many are genuinely good: 163.**

**How many are dumplings: this is where it falls apart.** `recipes/dumplings-and-rolls/` holds
**sixteen** files — not the fifteen the ticket assumed — and several are not dumplings:

| Slug | Party verdict | Why |
| --- | --- | --- |
| `gyoza` | **#38 of 234**, score 60 | The party's best real dumpling. 48 claimed standing minutes |
| `potato-knish` | **#32 of 234**, score 65 | **Ranks above every dumpling in the collection**, and is a knish |
| `sambousek` | #135 | |
| `samosa` | #134 | |
| `egg-rolls` | #139 | |
| `fatayer` | #158 | |
| `ham-sui-gok` | #189 | |
| `crab-rangoon` | #193 | |
| `char-siu-bao` | #230 of 234 | Zero hands-on minutes, and the reading is `stated` |
| `sesame-balls` · `wu-gok` · `siu-mai` · `xiao-long-bao` | **rejected** | `slack: unforgiving` |
| `air-fryer-frozen-spring-rolls` · `cheung-fun` · `har-gow` | **cannot say** | evidence unknown |

**Seven of the sixteen are not available to the party at all**, and of the nine that are, the
best-ranked is a potato knish. `har-gow`, `siu-mai` and `xiao-long-bao` — three of the four dishes a
dumpling party is actually about — are gone for two different reasons and `occasions.md` §3.6
predicted both.

**What is conspicuously missing:**

1. **The timers.** This is the whole problem and it is not a food problem. `har-gow`, `siu-mai`,
   `xiao-long-bao` and `cheung-fun` report **zero hands-on minutes** because the steps that pleat
   and fill them carry no timer. `scaling.md` §4.3 found this on `gyoza` and `occasions.md` §3.6
   generalised it: **the site systematically under-times exactly the operations an occasion built on
   labour would rank by.** Four files with timers written in would move all four from *cannot say*
   or *last* into the party's real top ten.
2. **`slack: unforgiving` on four dumplings, three of which are probably wrong.** A `siu-mai` that
   cannot survive a slipped ten minutes is a strong claim. It may be right about `xiao-long-bao`,
   whose skin is the entire dish. It is the gate that removes them and it should be re-read by
   whoever wrote it.
3. **The obvious absences.** No jiaozi, no potsticker, no pierogi, no ravioli, no manti, no
   khinkali, no momo, **and no dumpling wrapper or dumpling dough recipe** — which is remarkable for
   an occasion whose entire selling evidence is people buying a roller and a bag of flour.

### 5.3 Which is better served — and it is not the one the ticket guessed

The ticket assumed "one of these two occasions is probably much better served than the other" and
pointed at fifteen dumpling files against eight vegetable sides.

**The answer is the holiday meal, and the gap is not about counts.** The holiday needs about five
recipes written. The party has sixteen relevant files already written and **cannot use seven of
them**, because of annotations rather than food. **Writing is cheaper than re-annotating a genre**,
and the holiday's missing five are ordinary dishes anybody can write, while the party's problem is
that somebody has to sit with four dumpling files and decide how long pleating takes.

That is the reverse of what the file count suggests, and it is the fact worth knowing before either
becomes a shelf.

---

## 6. The holiday meal, diagnosed

> *That output — your oven is oversubscribed between 4:30 and 5:30; seventy minutes of hands-on
> work falls in the last forty-five — is the thing S-013 claims no cookbook can produce. Either it
> reads as the explanation of a real afternoon, or the claim is overstated and this ticket says
> which.*

**The claim is overstated, and the reason is the collection rather than the model.**

### 6.1 The plate

Assembled from the holiday ranking by slot, with the slot rules written before the ranking was
read. Twelve servings, one cook, four burners, oven capacity unstated.

| Slot | Slug | Holiday rank | Why |
| --- | --- | --- | --- |
| centrepiece | `pot-roast` | **#1 of 592** | The ranking's own pick, and a real one |
| starch | `mashed-potatoes` | #105 | The 161-way tie at zero |
| vegetable | `roasted-brussels-sprouts` | #357 | Best-ranked green side |
| vegetable | `green-beans` | #468 | **The ranking says avoid it. A household cooks it anyway** — kept deliberately, to see whether the model agrees with the profile |
| sauce | `cranberry-sauce` | #105 | |
| dessert | `apple-pie` | #105 | |

Six dishes that are each individually reasonable, which is the exact sentence S-013 opens on.

### 6.2 The diagnosis, pasted in full

`diagnose()` at one cook, four burners, `ovenShelves: null`:

```json
{
  "findings": [
    {
      "kind": "oven-clash",
      "dishes": [
        "pot-roast",
        "roasted-brussels-sprouts"
      ],
      "window": {
        "from": -22,
        "to": 0
      },
      "confidence": "inferred",
      "celsius": [
        149,
        218
      ],
      "wanted": 2,
      "have": 0,
      "overrunMinutes": 0
    }
  ],
  "standingMinutes": 19.5,
  "startsAt": -355,
  "evidence": "unknown",
  "unscalable": [],
  "cooks": 1,
  "burners": 4,
  "ovenShelves": null
}
```

*(The `dishes` array of six `DishLoad` entries is omitted here for length and is in
`docs/active/work/T-013-03/ranking-output.txt` in full. Its content is summarised below.)*

| Slug | servings | standing | elapsed | startsAt | evidence |
| --- | ---: | ---: | ---: | ---: | --- |
| `pot-roast` | 6 → 12 | 0 | 240 | −240 | unknown |
| `mashed-potatoes` | 6 → 12 | 0 | 22 | −22 | unknown |
| `roasted-brussels-sprouts` | 4 → 12 | 0 | 22 | −22 | unknown |
| `green-beans` | 8 → 12 | **19.5** | 68 | −68 | unknown |
| `cranberry-sauce` | 8 → 12 | 0 | 17 | −17 | unknown |
| `apple-pie` | 8 → 12 | 0 | 355 | −355 | unknown |

**The same meal with two cooks returns a byte-identical finding list.** Nothing about this plate is
constrained by how many hands are in the room.

### 6.3 The sentence it produces, and whether it explains a real afternoon

Written from the numbers, because `meal.ts` deliberately renders nothing:

> **In the last twenty-two minutes before you serve, the pot roast wants the oven at 149 °C and the
> brussels sprouts want it at 218 °C. You cannot have both.**

**That sentence is true, useful, and not in any cookbook.** It is a real collision between two
dishes a household would really cook together, it is read off the two authors' own temperatures,
and it is the shape of thing S-013 promised. On its own it justifies the model.

**And it is the only thing this six-dish holiday plate has to say.** No hands-on pile-up. No
crowded hob. No vessel binding. No make-ahead available. The whole afternoon asks for **19.5
hands-on minutes**, of which 13 are `green-beans`' fallback rather than anybody's claim — and the
diagnosis's own `evidence` field says `unknown`, which is the model being honest about what it was
handed.

S-013's promised sentence was *seventy minutes of hands-on work falls in the last forty-five.*
**This collection cannot currently say that about any plate a household would cook.** Here is the
bound, and it is not close:

| standing minutes at twelve servings, over 685 files | |
| --- | ---: |
| median | **5.0** |
| 75th percentile | 22.5 |
| 90th percentile | 40.0 |
| 99th percentile | 96.0 |
| maximum | 270.0 |
| files reporting **zero** | **288 · 42%** |
| files with ≥ 30 **claimed** standing minutes at twelve and a non-`unknown` reading | **83** |

**Forty-two per cent of the collection claims a holiday-sized batch costs zero hands-on minutes.**

### 6.4 The model is not the problem — the upper bound proves it

To separate "the model cannot say it" from "this plate has nothing to say", the six dishes in the
whole collection with the most hands-on minutes at twelve servings were diagnosed together. **This
is not a meal and is not proposed as one.** It is an upper bound.

`patty-melt` · `birista` · `beef-rendang` · `french-onion-soup` · `mujaddara` · `mushroom-risotto`:

```json
{
  "kind": "hands-pile-up",
  "dishes": ["beef-rendang", "birista", "french-onion-soup", "mujaddara",
             "mushroom-risotto", "patty-melt"],
  "window": { "from": -83, "to": 0 },
  "confidence": "unknown",
  "celsius": [],
  "wanted": 942,
  "have": 83,
  "overrunMinutes": 859
}
```

plus five `hob-crowded` findings between −57 and −33 minutes, where six pans want four burners.

**So `meal.ts` produces every finding kind it claims to, on real files, with correct arithmetic.**
It is not broken and it is not untested. **It is being fed a collection where the median dish costs
five hands-on minutes to make twelve servings of**, and no model can find a pile-up in that.

### 6.5 The gate belongs to the plate — confirmed on a real meal

`occasions.md` §3.3 argued that rejecting the turkey is not an answer: *"the gate belongs to the
plate, not to each dish: exactly one dish may be unforgiving, and it is the one everything else is
timed around."* It could not test that, and said so.

Substituting `smoked-turkey-breast` — the gated centrepiece — for `pot-roast` and re-running:

- The meal's `startsAt` moves from **−355 to −920 minutes**. Fifteen and a half hours.
- **The oven clash disappears**, because the smoker is not the oven.
- **No new finding appears.** `meal.ts` has nothing to say about a dish being unforgiving, because
  `slack` is not one of its inputs.

**So §3.3's argument stands and its remedy does not exist yet.** The plate-level gate it proposed is
still an idea: nothing in `meal.ts` reads `slack`, so nothing can say *this plate spends its one
unforgiving dish on the turkey, which is correct* or *this plate has two and one of them has to go.*
That is a real, small, named gap between the two halves of S-013's machinery.

---

## 7. Recommendation

Neither opens. The reasons are different and so is the amount of work.

### 7.1 The holiday meal — **open it after writing about five recipes**

**What argues for it.** The profile's top ten reads as obviously right and finds a non-obvious
answer (*a big forgiving braise*). The occasion has all four kinds of selling evidence. The
diagnosis produces at least one true, useful sentence on a plate a household would really cook. And
the inversion test passes on it.

**What argues against opening today.** There is no roast turkey, no pumpkin pie and no casserole. A
holiday shelf whose centrepiece is a pot roast because the turkey is a smoked breast that got gated
is a shelf that tells the truth about the collection and not about the holiday.

**What it would take:**

1. **Five recipes**, in this order: a roast turkey, a pumpkin pie, a green bean casserole, a
   gratin, and one more roast. Ordinary dishes; no new machinery.
2. **`keeps` on the plate's existing files.** `cranberry-sauce` plainly keeps and is plainly the
   make-ahead dish of its plate, and it declares nothing — so `make-ahead-available`, the one
   finding a cook can actually act on, never fires. `occasions.md` §"What this file does not do"
   noticed the same thing about the same file and declined to fix it, correctly.
3. **Nothing else.** Not a field, not a page, not a schema. The profile runs today.

### 7.2 The dumpling party — **do not open it, and the blocker is annotation, not food**

**What argues for it.** The occasion is real on three kinds of evidence, and what is sold — the
making, at $67–$169 a head — is the direct justification for the profile's sign flip. It is the
counter-example that proves the method is not *easy is good*, and that job is done.

**What argues against.** Its ranked list opens with a patty melt, a cup and a half of fried
shallots, and two sandwiches written for one person. Seven of the sixteen dumpling files are not
available to it. Its best real dumpling is #38. **Opening this shelf today would print a list that
is wrong at the top and missing at the bottom**, which is worse than not having it.

**What it would take:**

1. **Timers on four files** — `har-gow`, `siu-mai`, `xiao-long-bao`, `cheung-fun` — for the steps
   that pleat and fill. This is the whole blocker and it is four files.
2. **A re-read of `slack: unforgiving` on `siu-mai`, `sesame-balls` and `wu-gok`.** The gate is
   right to exist and may be wrong about these three.
3. **Fix `birista`'s `>> servings: 1 1/2 cups`**, which `servingsOf()` reads as one serving. One
   line, and it is currently the #2 dumpling-party dish in the collection.
4. **A decision about the multiplier, which is the real design problem.** Ranking by
   `standing(12)` at a fixed target means ranking partly by how small a batch the file was written
   for. A profile that pays for hands-on time needs either a per-serving rate or a written-servings
   floor, and **naming that is as far as this reading goes** — `occasions.md`'s rule is that a
   knowledge file names what is missing and stops.
5. **Dumpling wrappers and dumpling dough**, which the occasion's own selling evidence is built on
   and the collection does not have.

### 7.3 And the shared answer

**This is the same conclusion S-007 reached about The Soup Pot from the other direction, and it was
right.** That shelf failed on sourcing and on framing rather than on any individual file, and
`soup-pot.md` records that keeping two of its twenty-four *because their ingredients are easy*
would have been keeping the two least interesting members of a genre the shelf had decided not to
carry.

Same shape here. **Neither shelf opens on what is written today**, and the honest thing is to say
so before anybody builds the axis, the reader, the build-time check, the render and the front-page
answer for March that `occasions.md` §4 priced out.

---

## 8. The namespace, re-tested

`occasions.md` §4 decided **a separate axis** rather than an entry in `>> counters:`. Its third and
deciding argument was mechanical:

> **A counter's membership is an authored judgement about a shop, and it is stable** — a bánh mì is
> a bánh mì next year. **An occasion's membership is `profile(occasion)` applied to measured
> fields**, so it moves: it changes when a `keeps` line is written, when a timer is added, when a
> `capacity` lands.

**That argument was theoretical when it was written. It is not any more, and this reading is the
proof.**

`occasions.md` §3.1 recorded **`capacity`: 0 declared, of 685.** Today it is **46.** The annotation
pass that file called missing has partly run on this branch while the file sat unchanged. Nothing
about any recipe changed; a field landed.

And the membership moved with it. Three concrete movements, all inside this reading:

1. **`chili-con-carne` was `occasions.md` §3.5's #5 for the dumpling party. It is now *cannot
   say*** — not reordered, removed — because §3.6's rule about unclaimed minutes was applied. A
   `counters.json` entry containing it would have had to lose a member for a reason that has
   nothing to do with the dish.
2. **`occasions.md` §3.3's own worked table crowned `chili-con-carne` alone at −95. It is now a
   four-way tie** with `braised-short-ribs`, `cachete` and `pot-roast`, because the collection got
   bigger. A hand-curated list would have said *chili con carne* and been wrong by three.
3. **`siu-mai` and `xiao-long-bao` are ranked #6 and #8 in §3.5's table and are rejected by the
   same file's own gate.** A membership that a careful author got wrong inside one document is not
   a membership an authored static list can hold.

**Decision confirmed, and now on evidence rather than on reasoning.** An occasion is not a counter
and must not live in `>> counters:`.

**One thing this reading adds that §4 did not have.** §4 listed the cost of a separate axis — a
field and a reader, a build-time check, keeping it out of `search.json.ts`'s free-text blob, a
render that is not the counter row, `menu-sections.mjs` deliberately ignoring it, and a
`docs/gaps/` page per occasion. **All of that is still right and none of it should be paid for
yet**, because §5 says neither shelf can be fed. The order is: write the six recipes, add the four
timers, then decide about an axis. **Building the axis first would produce a beautifully-engineered
route to a list with a patty melt at the top of it.**

---

## 9. What this reading says `occasions.md` should fix

Not edited here — `occasions.md` belongs to whoever maintains it, and its own closing invites
exactly this: *"Correct it when … a profile is held against these rules and the verdict is obviously
wrong."*

### 9.1 The seventeen reproduce

Every score `occasions.md` printed comes back identical, which is the strongest available evidence
that the profiles in this reading are the profiles that file described. Ranked only against each
other, as §3.5 did:

| Holiday | | Party | |
| --- | ---: | --- | ---: |
| `chili-con-carne` | **−95** | `gyoza` | **60** |
| `char-siu-bao` | 0 | `samosa` | 24.5 |
| `cranberry-sauce` | 0 | `egg-rolls` | 23.25 |
| `har-gow` | 0 | `ham-sui-gok` | 10.5 |
| `mashed-potatoes` | 0 | `char-siu-bao` | 0 |
| `baked-turkey-wings` | 5 | *(twelve cannot say or rejected)* | |
| `turkey-pan-gravy` | 9 | | |
| `ham-sui-gok` | 12.75 | | |
| `wonton-soup` | 15 | | |
| `egg-rolls` | 28.5 | | |
| `samosa` | 32 | | |
| `green-beans` | 39 | | |
| `gyoza` | 72 | | |
| *(four rejected: `smoked-turkey-breast`, `turkey-brine`, `siu-mai`, `xiao-long-bao`)* | | | |

§3.6's corrected party answer — *five of seventeen ranked, twelve cannot say*, with `gyoza` 60.0,
`samosa` 24.5, `egg-rolls` 23.3, `ham-sui-gok` 10.5, `char-siu-bao` 0.0 — **reproduces exactly.**

### 9.2 Three corrections

1. **§3.1's `capacity` row says 0 declared. It is 46.** Everything §3.1 says about the no-vessel
   branch being the only branch is now false, and `vessel-binds` is a finding that can fire.
2. **§3.5's combined seventeen-row table ranks four recipes its own gates reject.**
   `smoked-turkey-breast` at #2 and `turkey-brine` at #3 are listed as `gated` in §3.3's own table
   two sections earlier; `siu-mai` at #6 and `xiao-long-bao` at #8 are `unforgiving` and §3.4's gate
   rejects them. The table is a ranking of scores with the gate not applied. It should say so or
   drop the four.
3. **§3.6's rule has a hole, and this reading did not fill it.** The rule filters `standing` to
   claimed minutes when the sign is positive. It says nothing about **`longest`**, which the party
   profile also weights positively at +0.5 and which has no assumed-minutes counterpart to subtract.
   So a fallback minute that the rule bars from the `standing` term is still paying into the
   `longest` term. It is a small effect and it is real.

---

## 10. Where the numbers came from

**The arithmetic.** [`docs/active/work/T-013-03/rank-the-shelf.ts`](../active/work/T-013-03/rank-the-shelf.ts),
run against `src/generated/recipes.json` at 685 files on 7 August 2026. Full output at
`docs/active/work/T-013-03/ranking-output.txt`. The two profile rate tables are the first fifty
lines of the script; every rate is annotated with the section of `occasions.md` it was transcribed
from.

**The method.** [`docs/knowledge/occasions.md`](../knowledge/occasions.md) §1 (the selling rule),
§3.2 (the profile shape), §3.3 and §3.4 (the two corners' rates), §3.6 (the claimed-minutes rule),
§4 (the namespace).

**The meal model.** `src/lib/meal.ts`'s `diagnose()`, at its shipped signature. `src/lib/stations.ts`
for which step holds the oven and at what temperature.

**The shelf reading it is held against.**
[`what-the-shelf-offers.md`](what-the-shelf-offers.md) §4 and its veto.

**Selling evidence, grouped by what each established.**

*The holiday meal, four kinds.* [cookedgoosecatering.com](https://www.cookedgoosecatering.com/thanksgiving-catering)
(the pre-order sheet: order by Fri 20 Nov 2026, pickup Wed 25 Nov; $319.95 for ten, or $21.95 a head
with a fifteen minimum) · [keifscatering.com](https://keifscatering.com/holiday-catering-menu/) (the
caterer's menu: from $45 a head, ten-person minimum) ·
[grandcentralbakery.com](https://www.grandcentralbakery.com/holiday-menu) and
[baltimoremagazine.com](https://www.baltimoremagazine.com/section/fooddrink/where-to-order-thanksgiving-pies-baltimore/)
(the seasonal board: a pre-order window 6–21 November, and local pie deadlines of 20–23 November) ·
[restaurant.org](https://restaurant.org/education-and-resources/resource-library/restaurants-to-play-big-role-on-the-mother-of-all-dining-out-days/)
and [nrn.com](https://www.nrn.com/menu-trends/how-restaurant-traffic-will-trend-this-mother-s-day)
(dining volume: 80 million US adults forecast for Mother's Day, 10 May 2026, up from 75 million).

*The dumpling party, three kinds.* [meimeidumplings.com](https://meimeidumplings.com/private-cooking-classes)
(the priced package with a minimum: $98 a head, minimum $490 or five people, two hours, 15–20
dumplings each, 20% hospitality fee; a kids' tier at $78 with a six minimum; virtual from $1,450 for
twelve with kits shipped) · [Dumpling Academy's Mother's Day](https://www.eventbrite.com/e/2026-mothers-day-weekendsun-lunch-hand-made-dumpling-making-class-philly-tickets-1984595616914)
and [Father's Day](https://www.eventbrite.com/e/2026-fathers-day-weekend-lunch-hand-made-dumpling-making-class-philly-tickets-1984596375182)
classes, [CocuSocial's Handmade Dumpling Party in NYC](https://www.eventbrite.com/e/in-person-class-handmade-dumpling-party-nyc-tickets-1987716528645)
and [the LA equivalent at $67.15 a head](https://bucketlisters.com/experience/4rz-hand-made-dumpling-making-class)
(dated ticketed events carrying the word *party* in the product name, $67–$169 a head) ·
[Costco item 1981261](https://app.warehouserunner.com/costco/1981261-lunar-new-year-make-your-own-dumpling-set)
and [the launch write-up](https://parade.com/food/costco-new-28-cooking-set-is-an-adorable-last-minute-gift-idea)
(the seasonal kit: $27.99 at launch, 70 warehouses, $9.97 by July).

*What is a staple rather than an occasion product.* [target.com](https://www.target.com/s/dumpling+wrappers)
(wrappers at $2.59–$2.99 a packet, SNAP-eligible, refrigerated aisle, no season) ·
[sayweee.com](https://www.sayweee.com/en/grocery-near-me/lang-en/explore/dumpling-wrapper).

---

## What could not be verified

Read this before treating anything above as settled.

**The rates are declared preferences and were never measurements.** `occasions.md` says so itself,
and nothing here changes it. *Twenty minutes for a day of keeping*, *five minutes for a thing in the
sink* — a different set would reorder the middle of both lists. **What does not move with the rates
is the sign of ρ, which comes from the signs, and the silence, which comes from the collection.**

**Two ways of counting the top ten were computed and both were zero**, which is a stronger result
than one of them would have been, but the top ten is still ten rows out of 685 and both lists are
heavy with ties. Spearman ρ over the shared 234 is the number to argue with.

**The party profile's ranking is confounded with written servings** and this reading did not
untangle it. §2.3 measures the effect and §7.2 names the fix; **nothing here says how much of
ρ = −0.591 survives a per-serving rate**, and it might be a lot less. **This is the biggest single
caveat in the document.**

**"Genuinely good" is this reading's rule, not the method's.** *Ranked, with at least two of the
four fields actually declared* was written before any number was read, and it is a reasonable line
rather than a derived one. A different threshold gives a different count.

**The plate in §6 is one plate.** Six dishes chosen by slot from the holiday ranking, and a
different six would produce a different diagnosis. The upper bound in §6.4 is what stops that being
fatal — it shows the model can produce every finding kind on real files, so §6.2's near-silence is
about the collection rather than about the plate.

**The selling pass is one pass and eight searches**, the same limitation `occasions.md` records
about itself, and biased the same two ways: towards sellers who publish online at all, and towards
the United States. Whether either occasion carries the same evidence elsewhere was not tested, and
the American Thanksgiving plainly does not.

**No source was checked for a second year**, which is the one thing that would separate an
aspirational listing from one anybody bought. `occasions.md` names that as the caterer's-menu
evidence class's specific weakness and it applies to everything in §1 here.

**The dumpling party's missing evidence class was not exhaustively searched.** No pre-order sheet
or deadline was found for it, and §1.2 reads that as informative. It is possible one exists and was
not found; what can be said is that four searches aimed directly at it returned classes and kits.

**The holiday's "five missing recipes" is a judgement, not a query.** It came from reading a
91-candidate list produced by matching slug, title, `aka` and tags against a plate vocabulary chosen
by hand. A different vocabulary returns a different list — and the first version of this reading
matched only slugs and tags, reported *no stuffing*, and was wrong, because `cornbread-dressing`
declares itself only in `aka`. Treat every absence claimed above as *nothing matched this
vocabulary*, not as *this does not exist*.

**Every count here is from 7 August 2026 at 685 files and will drift.** `slack` was 416, `keeps`
138, `washing-up` 177, `capacity` **46**, and 110 files declare `slack`, `keeps` and `washing-up`
together. Only **35** declare all four of the fields either profile is decided on. Three of those
numbers are being annotated on this branch by other work as this is written — which is §8's whole
argument, happening again.
