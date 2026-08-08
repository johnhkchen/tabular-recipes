# T-011-01 — Research

What exists, where, and what it already knows about the cost of cooking more. No proposals here.

---

## 1. What the ticket asks for, in one line

One new file — `docs/knowledge/scaling.md` — that states the cost-of-scale model precisely enough
that five downstream tickets (T-011-02…06) cannot each invent a different one. No code, no `.cook`
file, no property.

---

## 2. The shelf this file joins

`docs/knowledge/` holds three files today:

| File | Lines | What it settles | Written before or after the code |
| --- | ---: | --- | --- |
| `counters.md` | 1160 | What a counter is, and the menu vocabulary each one draws on | Before (S-002); corrected in place as tickets landed |
| `voice.md` | 184 | Who is reading, which of five places words go, and how long each may be | Before (T-005-01); has a **"What changed, and when"** section correcting four passages that later tickets decided differently |
| `rdspi-workflow.md` | 137 | The six phases | Process, not domain |

Shape to copy, read off those two:

- **A one-paragraph opener that says what the thing IS**, in the second person, before any table.
  `counters.md`: *"A counter is where you would get this if you were not making it at home."*
  `voice.md`: *"Somebody standing in a kitchen with a packet of dried lotus seeds in one hand."*
- **Tables carry the load.** Both files put their real content in tables with a "plainly" column.
- **Every claim is measured, and says what was measured.** `counters.md`'s air-fryer entry gives a
  three-row table of shelf-by-shelf gate results with counts. `voice.md` gives character counts
  (`3077 operation cells, mean 24`), and names the script that enforces them.
- **The file argues against itself in a named section.** `counters.md` has *"What it does not
  admit, stated so the shelf stays honest"* and *"What could not be verified"*; `voice.md` has
  *"What changed, and when"*. Self-attack is house style, not decoration.
- **Numbers are cited to a file or a script**, never floated.

`docs/gaps/*.md` is the sibling genre: same rigour, but ranked lists of what is missing.
`docs/gaps/air-fryer-and-pot.md` (588 lines) is the current high-water mark and is directly
relevant — see §6.

---

## 3. The code the model would sit on top of

### `src/lib/time.ts` (192 lines) — where hands-on/unattended is decided

Three-way source, recorded per timer as `AttentionSource`:

| Source | Meaning | Confidence it maps to |
| --- | --- | --- |
| `name` | The author named the timer and the name is in `UNATTENDED` (48 words) or `HANDS_ON` (24 words) | `stated` |
| `label` | Read off the operation's words, sliced per timer by `regionsOf()` | `inferred` |
| `default` | Nothing said → **assume hands-on**, because promising a cook they can leave when they cannot is the worse error | `unknown` |

`NOT_A_VERB_IN_A_SENTENCE = {boil, dry, press}` withholds trust from three words when they are
merely spotted in a sentence rather than used as a timer name.

**Load-bearing for this ticket:** the vocabulary is physics-of-the-food words on one side
(`rise prove ferment chill marinate brine soak braise simmer steam bake roast pressure …`) and
quantity-of-the-food words on the other (`stir knead fold roll shape sear brown fry toss …`).
That split is the raw material of the "free lunch" claim.

### `src/lib/schedule.ts` (424 lines) — where the per-recipe numbers come from

`buildSchedule(recipe)` → `Schedule`, with the fields S-010 lists:

| Field | What it is | Relevance to scaling |
| --- | --- | --- |
| `totalMinutes` | Critical path, **not** the sum | The baseline elapsed at `s` servings |
| `handsOnMinutes` | Summed over every task, all branches | The O(n) term's baseline |
| `unattendedMinutes` | Same, other side | The O(1) term's baseline — but see the trap below |
| `assumedHandsOnMinutes` | How much of hands-on nobody claimed | Error bar |
| `longestHandsOnMinutes` | Longest unbroken run, serialised onto **one cook** | The dial S-010 added |
| `untimedCount` | Operations with no timer at all | The other error bar |
| `authorMinutes` | Parsed `>> time:`; null if not readable whole | The independent check |

`handsOnEvidence(schedule)` collapses those into `stated | inferred | unknown` and is already the
honesty gate S-010's dials use.

**Two facts about `totalMinutes` that a naive cost function will get wrong:**

1. It is the **critical path**, so `total ≠ handsOn + unattended`. Gumbo: total 94, hands 49,
   unattended 53 — 102 ≠ 94, because `s1` (brown, 8 min) runs alongside `s2` (roux, 35 min).
2. `unattendedMinutes` is a sum over branches, so **it is not "the flat cost"**. Two parallel
   one-hour rises are 120 unattended minutes and 60 minutes of clock. Only the unattended time
   *on the critical path* is the flat term.

### `src/lib/plan.ts` + `src/pages/list.astro` — the defect S-011 exists to fix

- `plan.ts:47` `export const MULTIPLIERS = [0.5, 1, 2, 3]`
- `plan.ts:64` `scaleAmount(amount, multiplier)` — scales ingredient quantities only
- `list.astro:925` `` `serves ${servings} → ${n * multiplier}` ``

Nothing in either file touches the clock. That is the "uncaught invented number".

### Other prior art in the same shape (all cited by S-011 as precedent)

| Module | The move it makes |
| --- | --- |
| `src/lib/slack.ts` | A level **and a reason**, because a level alone is a vibe |
| `src/lib/washing-up.ts` | Authored list; the count is derived **from the list** so the two cannot disagree; the `cookware` cross-check is advisory only |
| `src/lib/schedule.ts` | Untimed → 0 minutes and `timed: false`, and the count is reported rather than filled in |

---

## 4. What the collection actually measures — figures from the built data

Rebuilt with `npm run recipes` (665 files on disk at the time of the first pass, **664 now** — a
concurrent ticket's probe file, `recipes/fried-and-crispy/zz-air-fryer-probe.cook`, appeared and
was removed mid-session; see §6). All figures below are from the 664-recipe build via
`buildSchedule()`.

**Evidence quality across the whole collection:**

| `handsOnEvidence` | Recipes |
| --- | ---: |
| `unknown` | 395 |
| `inferred` | 224 |
| `stated` | 46 |

- **267 of 664 recipes report `handsOnMinutes === 0`.** For most of them that is absence, not
  freedom.
- **60 of 664 have `untimedCount === 0`.** Only those can be hand-checked end to end.
- **664 of 664 have a numerically parseable `>> servings:`** — the `n/s` ratio always exists.
  Modal servings: 4 (170 files), 6 (151), 8 (126), 12 (74), 2 (38).

**Batch prose already in the files** (S-011 says 55; confirmed):

| Phrase | Files |
| --- | ---: |
| any mention of "batch" | 55 |
| `in two batches` verbatim | 23 |
| `>> step.N:` labels mentioning a batch | 24 |

Crucially, the batch prose sits **inside the timed operation**:

```
>> step: brown 12 min, in two batches
Brown @&(~1)seasoned beef{} … for ~brown{12%min}, in two batches with room around every cube.
```

So the recipe's own 12 minutes **already contains** the two batches it needs at its written
serving count. Any cost function that scales from that baseline and then adds a batch term is
double-counting. This is the single most consequential thing found in this pass.

**The four candidate worked examples, measured:**

| Slug | Servings | `>> time:` | total | hands | unatt | longest | untimed | evidence |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `chili-con-carne` | 6 | 3 hr | 120 | **0** | 120 | 0 | 4 of 5 | `unknown` |
| `karaage` | 4 | 1 hr | 42.5 | 2.5 | 40 | 1.5 | 1 of 5 | `inferred` |
| `gumbo` | 8 | 2 hr | 94 | 49 | 53 | 49 | **0 of 5** | **`stated`** |
| `gyoza` | 4 | 1 hr 45 min | 49 | 16 | 56 | 8 | 2 of 7 | `inferred` |

Per-task detail worth keeping:

- **`chili-con-carne`** — `s0 brown`, `s1 soften`, `s2 bloom`, `s4 thicken` all untimed (0 min,
  `unknown`); only `s3 simmer covered 2 hr` carries a timer, read `unattended/inferred`. The model
  would say tripling it costs *literally nothing*, and it would be right about the simmer and
  silent about four operations.
- **`karaage`** — `s1 marinate 30 min` (unattended/stated), `s3 dredge…5 min` (unattended/stated),
  `s4 fry 90 sec + rest 5 min` (hands-on/stated, 6.5), `s5 fry again 60 sec` (hands-on/stated).
  Body text says *"in batches"*. `s2 beat the egg through` untimed.
- **`gumbo`** — every operation timed and named: `s2 stir the roux 35 min` (hands-on/stated),
  `s3 sweat the trinity 6 min`, `s4 simmer 45 min`, `s1 brown 8 min` (parallel branch),
  `s5 simmer 8 min`. Cookware: one Dutch oven, One Pot counter. Nothing binds.
- **`gyoza`** — `s1 knead 8 min`, `s2 rest 30 min`, `s3 salt 20 min`, `s4 beat one way 3 min`,
  `s7 fry 3 + steam 6 + crisp 2 = 11 min`; **`s5 roll thin, cut rounds` and `s6 fill, pleat one
  side, press flat` are both untimed.** The two operations that most obviously scale with the
  number of dumplings contribute zero minutes to `handsOnMinutes`.

**Supporting figures gathered but not needed as full examples:**

| Slug | Servings | total | hands | unatt | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| `vindaloo` | 6 | 793 | 13 | 780 | 12 hr marinade; `s1 sear 8 min in batches`; `stated`, 0 untimed |
| `beef-with-broccoli` | — | — | — | — | `>> step: sear in two batches 3 min, lift out` — wok binds at the written size |
| `beef-stew-instant-pot` | 6 | 88 | — | — | `>> step: brown 12 min, in two batches` |
| `sourdough-boule` | 12 | 975 | 45 | 930 | The extreme flat case |
| `jalfrezi` | 4 | 7 | 12 | 0 | hands > total: two branches at once |

---

## 5. What the site would say to a cook — the language constraint

`docs/knowledge/voice.md` is binding and hostile to this feature:

- **House test 1:** *"Would a friend say it at a kitchen table?"* — O(·) fails outright.
- **House test 3:** *"Say it once."* Five places carry words and each has a cap enforced by
  `scripts/check-recipes.mjs`, which **fails the build**: operation cell 70, step body 150,
  full-width row 120, `slack:` reason 200, ingredient note 80.
- The five word-places are already allocated. A scaling finding is **none of them** — it is derived,
  not authored, so it belongs to the page furniture (plan page, dials), not to a `.cook` line.

S-011 §"Where the jargon stops" gives two sample sentences and the ticket asks for a full
phrasebook covering every finding the model can produce.

`docs/gaps/air-fryer-and-pot.md` already demonstrates the register for "what to look for instead of
the clock" — *"if the basket sounds wet rather than loose, it is crowded and the answer is a second
batch, not more minutes."* That is the target voice.

---

## 6. The air fryer pole — a live constraint

The ticket asks for *"chili-con-carne and an air fryer dish from S-008"* as the two poles.

**There is no air fryer recipe in this collection.** Confirmed three ways:

1. `grep -rl 'kit: Air Fryer' recipes/` → nothing.
2. `counters.md` §The Air Fryer & the Pot: *"The site owns no air fryer recipe at all: no `.cook`
   file declares `kit: Air Fryer`"*, and its gate table shows **0** of One Pot's 73, **0** of
   Instant Pot's 25, **0** of The Slow Cooker's 20 clearing.
3. S-008 §Shape of the work: **T-008-04** writes them. T-008-04 is open; T-008-02 is in flight in
   another thread. T-011-01 `depends_on: []`, so it runs first by design.

A transient `recipes/fried-and-crispy/zz-air-fryer-probe.cook` (Karaage, Air Fryer — 4 servings,
45 min, `washing-up: the basket, the bag`, `~air fry{12%min}` at 200°C in one layer) existed for
part of this session and has since been removed by the concurrent thread. It is not in git and
cannot be cited as a real file.

**What can be cited instead**, all from real files:

- `recipes/fried-and-crispy/karaage.cook` — the plain deep-fried sibling the air fryer variant will
  be a `kit:` of (named as such in `docs/gaps/air-fryer-and-pot.md`). Same dish, same "the vessel
  holds what it holds" physics, real timers.
- `docs/gaps/air-fryer-and-pot.md` §*What the basket times actually are* — measured, sourced
  capacity evidence:
  - ATK: winning machines *"exceed 10 × 10 inches and hold four chicken cutlets or two 15-ounce
    bags of chips, while smaller machines hold two cutlets or one bag."*
  - ATK's flat warning: *"external dimensions and stated capacities of air fryers are not reliable
    indications of how much food they can cook at once."*
  - *"A recipe written for one machine's full basket is a recipe for two batches in another's."*
  - Same bag of frozen chips: **18 min at 1400 W, 12 at 1700 W, 9 at 2000 W.**
- `counters.md` §Basket: *"Its **width** is what limits a recipe, because everything cooks in one
  layer — height buys nothing."*
- `counters.md` §what it does not admit: *"Anything cooked in two batches and called one load."*

That last group is the strongest capacity evidence in the repo and it says something the ticket's
model does not: **capacity is partly a property of the reader's kitchen, not of the recipe.**

---

## 7. The four failure cases the ticket names, checked against the repo

| Case | Evidence already in the repo |
| --- | --- |
| Bigger pot, longer to temperature | Nothing measures this. No timer models heat-up; `~brown{12%min}` is the whole claim. |
| Crowded pan steams instead of browning | Written in 23 files as *"in two batches with room around every cube"*; `counters.md` §Vegetables: *"if the basket sounds wet rather than loose, it is crowded"*. The **timer does not change** — the dish does. |
| Hands-on that is not linear | `gumbo`'s 35-minute roux (a temperature process, not a quantity one); `gyoza`'s untimed pleating (a per-unit process the clock cannot see at all). |
| Oven recovery between batches | Nothing in the repo measures it. `docs/gaps/air-fryer-and-pot.md` records the machine-to-machine spread but not door-opening recovery. |

A fifth, found in this pass and not on the ticket's list: **the same file is a different number of
batches in a different kitchen** (§6). It is the one failure the model can neither see nor fix,
because the missing variable is not in any file.

---

## 8. Constraints and assumptions carried into Design

1. **Nothing may change but `docs/knowledge/scaling.md` and `docs/active/work/T-011-01/**`.**
   `src/generated/` is gitignored and rebuilding it is not a repo change.
2. **Every number in the file must be reproducible** from `src/generated/recipes.json` via
   `buildSchedule()`, and one worked example must be checkable by hand.
3. **`unattendedMinutes` is a branch sum, not the flat cost.** The flat term is the unattended time
   *on the critical path*.
4. **Baseline figures already include the batching the recipe needs at `s`.** Scale from the
   baseline; do not add batches the author already paid for.
5. **Capacity is authored (T-011-03) and is absent by default.** The file must say what capacity is
   *not*: not a serving suggestion, and a recipe that simply makes four portions has none.
6. **No O(·) on any page a cook reads.** The phrasebook is the deliverable that enforces this for
   five downstream tickets.
7. **Concurrency.** T-008-02, T-009-03 and T-010-02 are in flight; `recipes/` and `src/lib/` are
   moving under this ticket. Cite figures with the build they came from.
