# T-012-02 — Design

Seven decisions, each one a rule that decides a number. The ticket's whole risk is that a count
gets made against a convenient definition and then quoted forever, so every rule below is written
before the number it produces, and every rejected alternative says what number it would have given.

---

## 1. Where the reading lives

**Decided: a new file, `docs/gaps/what-the-shelf-offers.md`, with a pointer from
`docs/gaps/README.md`.**

The acceptance criteria are explicit — the reading goes *where the other whole-shelf readings
live*, and `README.md` *gains a pointer to it*. A pointer implies a target that is not the README
itself. `docs/gaps/` is the only writable directory that qualifies.

- **Rejected: fold it into `docs/gaps/README.md`.** That is what T-002-09 and T-003-07 did, and it
  is why the README is now 312 lines of five different passes. This reading is ~600 lines of
  argument with three personas in it; appending it would bury the five-gaps list that the next
  pass actually looks work up in. And there would be nothing left for the README to point *to*.
- **Rejected: `docs/knowledge/`.** Out of the writable set, and wrong in kind:
  `docs/knowledge/cooks.md` says explicitly that a knowledge file which starts recommending
  features stops being the thing later work can be tested against. This reading ends in a ranked
  recommendation. It is a gaps document.
- **Rejected: work-artifact only.** `docs/active/work/T-012-02/` is a record of how the ticket was
  done. The five-gaps list is where the next pass looks for work, and a recommendation buried in a
  ticket's work directory is a recommendation nobody reads.

**Mechanical constraint honoured:** the file carries **no `## What it has` block**, so
`node scripts/menu-sections.mjs` cannot mistake it for a counter page. `docs/gaps/soup-pot.md` is
the precedent — a file in `docs/gaps/` that is a record rather than a counter.

**Name.** `what-the-shelf-offers.md` — plain, and it is what the file is. Not `personas.md` (the
repo refuses the word), not `balance.md` (names one of five findings).

---

## 2. What counts as a plant

**Decided: a plant is counted when it is on the plate as something you eat. Four bands, reported
separately, with the headline being band A.**

| Band | What is in it | Counts as a plant for the headline? |
| --- | --- | --- |
| **A — plant food** | vegetables, fruit, fungi, fresh legumes, seaweed | **Yes** |
| B — herbs | cilantro, parsley, mint, basil, dill, thyme, curry leaf | Reported, not headline |
| C — pulses, grains, nuts, seeds-as-food | chickpeas, rice, walnuts | Reported separately |
| D — seasoning and process | spices, extracts, flours, sugars, oils, vinegars, teas | **No** |

The line is band D against the rest, and it is drawn at *what the eater experiences as a
vegetable*. Cumin, cinnamon, bay leaf, vanilla and wheat flour are all plants botanically. Persona
one's complaint — *more like cattle than a zoo animal* — is about breadth of what is on the plate,
and a count that lets `ground cumin` register as a plant would return a large, cheerful number
that answers nothing. This is the same refusal `slack` makes when it demands a reason and not just
a level.

Fungi and seaweed are in band A. Neither is a plant botanically; both are the same thing to the
eater and to the argument, and calling them out separately in the artifact costs one sentence.

- **Rejected: botanical truth.** Would put every spice in and give ~380 "plants". A larger number
  and a worse answer.
- **Rejected: the `vegetarian` tag.** 33 files, author-applied, and it describes a dish's protein
  rather than its breadth. `charred-broccoli` and `candied-yams` are both in
  `vegetables-and-sides` — the ticket's own example of why a label is not a diet.
- **Rejected: folder membership.** Explicitly forbidden by the ticket, and correctly.

**Names are folded to plants, not counted raw.** `carrot`/`carrots`/`shredded carrot`/
`grated carrot`/`grated carrots` is **one** plant. The fold is an explicit table in the analysis
script so a reviewer can disagree with a specific line rather than with a number.

**Starch is a named list**, not a judgement per file: potato (all), sweet potato, yam, cassava/yuca,
taro, plantain, corn/masa/hominy, rice, wheat, and the winter squashes are **flagged and included**
in band A with the flag shown, because kabocha is not what anyone means by *heavy starch* and
pretending otherwise would be a thumb on the scale in the direction this ticket wants to go.

---

## 3. What "built on a plant" means

**Decided: the dish is the plant. Two machine tests, union taken, then every hit and every near
miss read by hand.**

- **Test 1 — named.** A band-A plant appears in `title`, `dish`, or `aka`, and also appears in
  `ingredientNames`.
- **Test 2 — dominant.** A band-A plant is the largest ingredient by mass among the ingredients
  that are not water, stock or fat. Amounts come from `steps[].ingredients[].amount`, converted
  through one unit table; anything not convertible (`2 cloves`, `1 bunch`) is left out of the
  arithmetic rather than guessed at.

**Both tests are noisy and the artifact says how.** Test 1 catches `tomato-sauce` (a sauce, not a
vegetable dish). Test 2 catches recipes whose only weighable ingredient happens to be an onion.
The union is a candidate pool of expected size 60–100; each is read and kept or dropped with a
one-line reason. **The published number is the hand-checked one**, and the machine number is
published beside it so the size of the correction is visible.

- **Rejected: dominant-only.** Misses `charred-broccoli`-shaped files whose spears are counted in
  pounds and whose stated mass ties with butter.
- **Rejected: named-only.** Makes `tomato-paste`, `garlic-confit` and `mango-chutney` vegetable
  dinners.
- **Rejected: no hand check.** The ticket asks for a claim to be confirmed or refuted. A number
  built on a rule nobody looked behind is exactly the fabricated number `README.md` forbids.

---

## 4. What "a pulse as the main thing, and it reads as dinner" means

**Decided: two gates in series, both stated, both hand-applied to a machine-built pool.**

**Gate 1 — main thing.** The pulse is the dish (title/`dish`/`aka`) or the dominant weighable
ingredient. Excluded by rule and not by taste:

- **pulse flours** — `gram flour`, `chickpea flour`, `urad dal flour`, `roasted gram flour`. A
  pulse botanically, a batter in the kitchen. Persona two is not neglecting pakora batter.
- **green vegetables that are beans by name** — `green beans`, `long beans`, `snow peas`,
  `flat green beans`. Band A, not pulses.
- **fermented pulse condiments** — `fermented black beans`, `fermented red bean curd`,
  `red bean paste`, `miso`, `doubanjiang`, soy sauce. A spoonful, and a seasoning.
- **soy as a protein** — tofu, `abura-age`, `konnyaku`. Argued the other way in the artifact and
  **excluded from the headline, reported as a second number**, because persona two named beans as
  a *cheap standby they used to reach for* and tofu is not the thing they said.

**Gate 2 — reads as dinner.** Would a person put this on the table as the meal. A dip, a side, a
component, a sweet paste and a soup course are all no. This is a judgement and every file gets a
reason.

The ticket predicts the answer is *much smaller than 43*. If it is not, the artifact says so.

---

## 5. What "a branch of real length" means, off `buildSchedule`

**Decided: a branch is a lane that runs beside the critical path and holds ≥ `BREAK_MINUTES` of
hands-on work. The count is the number of recipes with at least one.**

`buildSchedule` is used, as the ticket requires. But `lanes` cannot be counted raw and the design
has to say why:

- `packLanes` gives an **untimed** task its own slot deliberately, so a recipe of six untimed prep
  steps starting at 0 occupies six lanes and needs one person. Counting lanes would return a large
  number built on missing annotation — the precise trap S-010 §"The honesty problem" names.
- A lane is a **row on a timeline**, not a person. Two tasks can share a lane and be an hour apart.

So a lane is admitted as a hand-off-able branch when all three hold:

1. it is not the lane carrying the recipe's `criticalPath` root;
2. its tasks sum to **≥ 5 minutes of hands-on work** — `BREAK_MINUTES`, the constant
   `src/lib/schedule.ts` already argues for from the collection's own gap distribution, rather than
   a second threshold invented here;
3. at least one of its tasks **overlaps in clock time** with a critical-path task. Work that
   merely *could* be done early is not work that can be handed over *while* the cook is busy.

**Both numbers are published**: raw lane counts, and branches surviving the filter. The gap
between them is itself the finding — it is the measure of how much of the "multi-cook feature
already sitting there" is an artefact of packing.

- **Rejected: `lanes.length > 1`.** Would count nearly every recipe and mean nothing.
- **Rejected: counting tree branches from `tree.ts` directly.** The ticket says use `buildSchedule`
  and packing onto a clock is the part that makes a branch *concurrent* rather than merely
  *independent*.
- **Rejected: a new minutes threshold (10, 15).** Every threshold in this repo that could be
  argued from data already has been. Reusing `BREAK_MINUTES` means the number moves if the module's
  own argument moves, which is correct.

---

## 6. How the fridge is assumed for persona one

**Decided: `staples.json`'s 31, plus a written fridge of ordinary perishables, printed in full in
the artifact and used verbatim by the query.**

`docs/knowledge/cooks.md` §1 is explicit that the pantry has to be *assumed rather than typed*, or
the first person spends their evening listing salt, and that `staples.json`'s five-clause doctrine
is already the argument for which things those are. The fridge is the layer that doctrine
deliberately excludes: *fresh is shopping, even when the dried version is a staple.*

The assumed fridge is chosen by one rule — **things a one-person kitchen that cooks at all has on
an ordinary Tuesday** — and is capped at around twenty items so that it cannot quietly swallow the
answer. It is listed in the artifact as a table, item by item, before any slug is reported.

**The sensitivity is reported.** The query is re-run with the fridge removed (staples only) and
with two plausible extra items, and the artifact says how much the answer moves. A result that
triples on one extra ingredient is a result about the assumption, not about the shelf, and the
reader gets to see which this is.

- **Rejected: no fridge, staples only.** Honest and useless — nearly nothing cooks from 31 dry
  seasonings, and the answer would be an artefact of the pantry doctrine.
- **Rejected: a generous fridge.** Any answer can be manufactured by adding ingredients. The cap
  and the sensitivity run are what keep this from being a wish.

---

## 7. How the board conflicts are judged

**Decided: `docs/knowledge/cooks.md`'s own instrument, unchanged — passes / fails / cannot say —
applied to every open ticket on every running story, with the ticket named.**

The file already worked two examples (S-010's dials, S-011's capacity) and states the rule: a
design **passes** when it changes what the person's contradiction costs, **fails** when it serves
only the half already served, **cannot say** when the source does not settle it. Re-deriving an
instrument when one exists and has been used twice would be the worse choice, and using a
different one would make this reading incomparable with the two verdicts already on record.

The roster is **every story with an open ticket**: S-008, S-010, S-011, S-012, S-013. S-007 and
S-009 closed after S-012 was written, which is why "the five" is a different five now — stated in
the artifact so the count is not read as a coincidence.

**Nothing on the board is edited.** Each conflict is a paragraph in the artifact naming the ticket
it concerns and what the ticket's author would have to decide. The S-011 T-011-06 collision the
ticket names gets its own section, because it is the one where two personas are already inside one
story pulling opposite ways.

---

## 8. How the ranking is argued

**Decided: rank by day-one served count, with a hard veto.**

Each of the four capabilities gets four figures and one verdict:

| | |
| --- | --- |
| **Needs** | the property that does not exist yet |
| **Stands on** | what is already built that it can use |
| **Day one** | how many recipes it could return, measured, not estimated |
| **Food first?** | whether the collection has to grow before it is worth building |

The veto: **a capability whose day-one answer is the same small set for every reader is ranked
last regardless of appeal**, because that is the eight-vegetable-sides failure shipped. S-012 named
it, S-010 already guards against it with cannot-say, and this ticket's job is to apply it with a
number rather than repeat the warning.

The ranking ends with a plain sentence on whether the honest answer is *write food before writing
features*. `docs/gaps/README.md`'s five-gaps list has never been a feature list, and this design
does not assume the answer either way — the numbers from §2–§5 decide it, and the artifact is
written so that either answer is publishable.

---

## What this design does not do

- **It does not annotate a recipe, add a field, or touch `src/`.** The measurements are read off
  what is already there. Where a field is missing (`capacity` at 0, `keeps` mid-backfill at 102),
  the artifact says the number is a floor and names the ticket that will move it.
- **It does not re-shelve anything.** Category drift is `docs/gaps/README.md`'s job and is already
  first on its list.
- **It does not propose a fifth capability.** The ticket asks for four ranked. If the reading turns
  up a fifth it goes in the artifact as a note, not into the ranking, because ranking an unargued
  candidate against four argued ones would be the wrong shape of answer.
