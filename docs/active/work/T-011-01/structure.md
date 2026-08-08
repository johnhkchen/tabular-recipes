# T-011-01 — Structure

Not code, so "file-level changes" is short and "the shape of the prose" is the blueprint.

---

## Files

| Path | Action | Notes |
| --- | --- | --- |
| `docs/knowledge/scaling.md` | **create** | The whole deliverable. ~350 lines |
| `docs/active/work/T-011-01/*.md` | create | Phase artifacts, published by Lisa from the attempt dir |

**Nothing else.** No `src/**`, no `recipes/**`, no `docs/knowledge/counters.md` edit, no
`README.md` edit. `src/generated/recipes.json` is gitignored and was rebuilt to take measurements;
that is not a repo change.

**Not linked from anywhere yet, on purpose.** `README.md` §How it fits together lists code paths,
and `docs/knowledge/` is reached from the counters sentence at `README.md:15`. Adding a link is a
one-line edit that belongs to whichever ticket first ships a scaling feature (T-011-02), not to the
ticket that writes the argument. Adding it here would put a pointer to an unimplemented model in the
front door.

---

## Section blueprint

### `# Scaling` — opener (~15 lines)

Second person, no table. Names the defect it exists to fix: `plan.ts:47` offers `×3` and
`list.astro:925` prints `serves 4 → 12`, and the clock does not move. States the one-sentence
answer — *some of the cost is about the food and some is about how much of it there is, and the
site already knows which is which* — and says what the file settles: the cost function, its error
bars, and the words the site is allowed to use.

Closes with the boundary: **this file is O(·). No page a cook reads ever is.**

### `## 1. Three costs, and the thing that already measures them` (~45 lines)

1. The three kinds of cost, as prose plus a three-row table: **the wait** (about the food),
   **the work** (about how much), **the vessel** (about the kitchen).
2. **The free lunch, argued.** Print the two vocabularies from `src/lib/time.ts` side by side —
   `UNATTENDED` (48 words: `rise prove ferment chill marinate brine soak braise simmer …`) against
   `HANDS_ON` (24: `whisk stir knead fold roll shape sear brown fry …`). The argument is that those
   lists were drawn for a timeline with no thought of scaling and sorted themselves into *how long
   the change takes* and *how much there is to do*. Written for another purpose is the evidence.
3. **What it costs to be wrong**, i.e. the three-way `Confidence` and the `default → hands-on`
   fallback, with the collection figures: 395 `unknown`, 224 `inferred`, 46 `stated`; 267 recipes
   reporting `handsOnMinutes = 0`.

### `## 2. The cost function` (~55 lines)

Symbol table, then the formula, then dominance. Order matters: symbols first so the formula reads.

- Symbol table: `s n m c b(k) r A H A_batch H_batch A_free H_free`, each with **where it comes
  from**, matching `design.md` Decision 1.
- **`A` gets its own paragraph** because it is the one number not already published: unattended
  minutes *on the critical path*, not `unattendedMinutes`. With the counter-example — `gyoza`
  reports 56 unattended minutes and a 49-minute clock, because the cabbage salts while the dough
  rests. A branch sum is not a wait.
- The formula, and the collapse when no capacity is declared:
  ```
  elapsed(n) = A_free + m·H_free + r·(A_batch + H_batch)
  elapsed(n) = A + m·H                       when nothing binds
  standing(n) = m·H_free + r·H_batch
  ```
- **`r = b(n)/b(s)`, and why the denominator is there.** The 23 files that say
  `~brown{12%min}, in two batches` have already paid for two batches inside the timer. Ratio, not
  count.
- **The checkable identity:** `A + H ≥ totalMinutes`, equality on a single chain, gap = the
  hands-on work the timeline ran on a second pair of hands. The seven-row verification table from
  `research.md`. Says plainly that `elapsed(s)` is the **one-cook clock** and sits at or above the
  timeline, and cites `schedule.ts:longestUnbroken()` for the house rule on which way to err.
- **Which term decides, and where.** Three bullets: flat below `n = c`; knee exactly at `c`;
  everything linear above it. Then the reversal — a big-`A`, small-`H` recipe is free at any size
  in a pot and ruinous in a basket, so **the best scaler with no vessel is the worst with one.**

### `## 3. Work one out by hand` (~35 lines)

`beef-with-broccoli`, 4 → 12. Chosen because it is the only worked dish whose capacity is readable
from its own words: `>> servings: 4` and `>> step: sear in two batches 3 min, lift out` ⟹ `c = 2`.

Every input shown with its source line, then the arithmetic in full:

```
s = 4, n = 12                     m = 12/4 = 3
c = 2                             b(4) = 2, b(12) = 6, r = 6/2 = 3
A = 30   (s0 ~rest{30%min}, on the critical path s0 → s2 → s5)
H = 4    (s2 ~sear{3%min} + s3 ~stirfry{1%min})
batched leg = the sear:  A_batch = 0, H_batch = 3
                         A_free  = 30, H_free  = 1

elapsed(12) = 30 + 3·1 + 3·(0 + 3) = 30 + 3 + 9 = 42 min
standing(12) = 3·1 + 3·3 = 12 min
baseline at 4:  A + H = 34 min, of which 4 standing
```

Then the counter-computation that justifies Decision 1: the same recipe under the loose reading
`r·A + m·H` gives `3·30 + 3·4 = 102 minutes`, **and it is wrong**, because nobody's fridge holds
less because the wok does. One sentence, and it is the reason a capacity has to name its operation.

Closes with the scale-down case, which is the one that surprises: `n = 2` gives `b(2)/b(4) = 1/2`,
so `r = 0.5` — **the vessel stops binding**, and elapsed is 32 minutes with 2 of them standing.

### `## 4. Where it fails` (~60 lines)

Six cases, one subsection each, each ending with a bold verdict —
**inside the model** / **outside it** / **a known error the model accepts**. Content from
`design.md` Decision 3. Order is worst-first by how much it can mislead:

1. **The crowded pan** — *outside*. The clock does not move and the dish changes. What capacity
   exists for. Cite the 23 files and `counters.md`'s *"sounds wet rather than loose"*.
2. **The kitchen the file cannot see** — *outside*. ATK's *"external dimensions and stated
   capacities … are not reliable indications"*, one bag of chips at 18/12/9 minutes across
   1400/1700/2000 W, *"a recipe written for one machine's full basket is a recipe for two batches
   in another's"*. `c` is a fact about a kitchen.
3. **Work that is not linear** — *accepted error, both directions*. `gumbo`'s 35-minute roux
   (over-charged) and `gyoza`'s untimed pleating (under-charged). This is the one that cancels
   least, because the two errors land on different dishes.
4. **The bigger pot takes longer to heat** — *accepted error*. Neither O(1) nor O(n). Bounded and
   ignorable against a two-hour simmer; unbounded against a three-minute sear.
5. **Oven recovery between batches** — *accepted error, and the model is optimistic here*. `r`
   charges `b` identical batches and the box drops on every door-opening.
6. **The figures are only as good as the timers** — *accepted error, and the largest one*. 395 of
   664 `unknown`; `chili-con-carne` is 4 untimed operations out of 5. **A stated error bar beats a
   hidden one**, so this is the case that gets a phrasebook row rather than a footnote.

### `## 5. What capacity is not` (~15 lines)

Flat, short, its own section because it is the sentence T-011-03 will be tempted to break.

- It is the **vessel's limit**, not a serving suggestion. A recipe that simply makes four portions
  has none.
- It is **absent by default**, the way `slack` and `washing-up` are. *A capacity on every file
  would mean somebody guessed.*
- It is **not a complexity class**. Nobody is asked to write O(n). The growth is derived from a
  measurement or it is not printed — cite the three precedents `slack` / `washing-up` / the clock.
- It **names an operation, not just a number.** The 102-vs-42 computation in §3 is why.
- A wrong capacity is worse than none: absent leaves the plan page where it is today, wrong makes
  it confidently wrong in a new way.

### `## 6. The phrasebook` (~35 lines)

Two-column table, keyed on **what the model produced**, not on a dish. Draft rows:

| Case | Sentence |
| --- | --- |
| `r = 1`, `H` negligible | Cooking three times as much costs you nothing extra. |
| `r = 1`, `H` real | Three times as much is three times the chopping. The pot doesn't care. |
| `r = 1`, `m < 1` | Half as much still takes the same two hours. |
| `n ≤ c` | It fits. One load either way. |
| `n` crosses `c` | Up to six fits in one go. Past that it's a second load. |
| `r > 1`, batch wait large | Three times the people is three times the batches, and three times as long standing there. |
| `r > 1`, batch wait small | It goes in three lots, and that costs you about five minutes. |
| `r < 1` (scaled down past the knee) | At this size it all goes in at once. |
| No capacity declared | Nobody has measured what the pan holds for this one. |
| `handsOnEvidence = unknown` | This recipe doesn't time enough of itself to say. |
| `totalMinutes = 0` | No times here at all, so there's nothing to work out. |
| Untimed operations present | …plus four steps the recipe never times. *(existing site wording)* |

Rules stated above the table: **no notation in any right-hand cell**; a sentence a person would say
out loud; and when in doubt say less. Then the three worked pairs from S-011 kept verbatim so the
downstream tickets can see the register.

### `## 7. Five dishes, worked` (~70 lines)

One block per dish: the inputs with their source lines, the answer at the target `n`, and **the
finding in one sentence of phrasebook English**. All figures from the 664-recipe build.

| # | Slug | `s` | `A` | `H` | `c` | Target | elapsed | standing | The finding |
| --- | --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | --- |
| 1 | `chili-con-carne` | 6 | 120 | 0 | none | 18 | 120 | 0 | Free — and 4 of its 5 operations are untimed, so *free* here is partly *unmeasured* |
| 2 | `karaage` | 4 | 40 | 2.5 | not declared | 12 | 47.5 | 7.5 | **Surprising:** it batches, and batching is nearly free — the batch is 90 seconds long |
| 3 | `beef-with-broccoli` | 4 | 30 | 4 | 2 | 12 | 42 | 12 | The hand-check. The vessel binds and costs 8 minutes |
| 4 | `gumbo` | 8 | 53 | 49 | none | 24 | 200 | 147 | **Surprising:** nothing binds, best-evidenced file in the collection, worst scaler here |
| 5 | `gyoza` | 4 | 36 | 16 | none | 12 | 84 | 48 | **Surprising:** the most per-unit dish here, priced cheapest, because pleating carries no timer |

The air fryer pole gets its own short block after #2 rather than a table row, because **no air
fryer `.cook` file exists** (T-008-04 writes them). It is worked from the measured figures in
`docs/gaps/air-fryer-and-pot.md` — wings at 200°C for 18–24 minutes, ATK's basket holding four
cutlets — and labelled as an illustration, not a recipe:

```
a basket load ≈ 20 min, c ≈ 4, H ≈ 2   →   at n = 12: r = 3, elapsed = 66 min
karaage, same 12 portions, same batching                          = 47.5 min
```

**Same batching, and the basket costs 8× what the oil bath does, because the basket's batch is
twenty minutes of waiting and the fryer's is ninety seconds of frying.** That is the pole contrast
the story wanted, and it says something S-011 did not: it is not batching that costs, it is the
length of the batch.

### `## 8. The two situations` (~30 lines)

Each stated as what it asks of the model, then answered from the five.

**"Exhausted, two meals for one, today."** `n = 2`, so `m < 1` for every file here and `r ≤ 1` —
capacity cannot bind. The model is `A + m·H` and **`A` is nearly the whole answer**, which is why
S-010's dials already settle this case. Worked:

| Dish | elapsed at n=2 | standing |
| --- | ---: | ---: |
| `beef-with-broccoli` | 32 | 2 |
| `karaage` | 41 | 1 |
| `gyoza` | 44 | 8 |
| `gumbo` | 65 | 12 — **and the model is wrong**; a quarter roux is not nine minutes |
| `chili-con-carne` | 120 | 0 |

Answer: `beef-with-broccoli`. Note the reversal against the other query.

**"Stressed, six people, over three days."** `n ≈ 18`, cooked once. `m` is large, so the flat cost
stops mattering and what is wanted is small `H` and no binding vessel:

| Dish | elapsed at n=18 | standing |
| --- | ---: | ---: |
| `chili-con-carne` | 120 | 0 |
| `beef-with-broccoli` | 48 | 18 |
| `gyoza` | 108 | 72 |
| `gumbo` | 163 | 110 |

Answer: `chili-con-carne`, and it wins by the term the other query ignored. Two flags:

- **`beef-with-broccoli` scores better and is the wrong answer**, because *over three days* asks a
  second question the model cannot answer — **does it keep**. S-011 says so explicitly and gives it
  to T-011-04. A dish that scales beautifully and dies overnight does not answer this.
- **Chili's silence is untested.** It declares no capacity, which means nobody has looked, not that
  nothing binds. Eighteen portions in one Dutch oven is a real question and T-011-03 has to ask it.

### `## 9. What this file could not settle` (~20 lines)

House convention — `counters.md` §*What could not be verified*, `voice.md` §*What changed, and
when*. Contents:

- **No air fryer recipe exists**, so the second pole is an illustration from `docs/gaps/`. When
  T-008-04 lands, this section and §7 get rewritten from real files.
- **`c` is a property of a kitchen**, and the file records a capacity for one vessel.
- **Per-step cookware is not in the generated data.** `steps[]` carries ingredients and timers and
  no vessel; the `#wok{}` mark is flattened to a recipe-level list. T-011-02 needs it, or
  `>> capacity:` must carry the operation itself.
- **Heat-up and oven recovery are unmeasured**, in this repo and in its sources.
- **The keeping question is not scaling** and belongs to T-011-04.

---

## Ordering

One file, written top to bottom, but §2 must be settled before anything else is written: §3, §6, §7
and §8 all quote its numbers, and a change to the formula rewrites four sections. Draft order:
**2 → 3 → 7 → 4 → 6 → 8 → 1 → 5 → 9 → opener.** Verify every number against a rerun of the
measurement script before committing.
