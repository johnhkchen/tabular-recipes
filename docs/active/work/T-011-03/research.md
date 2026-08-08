# T-011-03 — Research

What is on the shelf before anything is annotated: the field, the machine that reads it, the three
places the collection already carries the fact in prose, and the two mechanical traps that decide
whether a line does anything at all.

Descriptive only. Nothing here decides which files get a line.

---

## 1. The field, as T-011-02 left it

`>> capacity: 2 — the wok, sear` — a number of **servings**, then the vessel, then the operations
it bounds, comma-separated.

| Piece | Read by | Refused when |
| --- | --- | --- |
| the number | `readCapacity()` in `src/lib/scaling.ts:84` | absent, zero, or a count of batches (`2 batches`) |
| the vessel | same | missing — `2` alone tells a reader with a different pan nothing |
| the operations | same | missing — the batches would land on every wait in the recipe |

Two further failures live in `checkCapacity()` in `scripts/check-recipes.mjs:145`:

1. **It binds nothing.** The operation names no step in the file, so the vessel bounds no work and
   the cost function prices the recipe as if it had no capacity. Fails, printing every step label.
2. **It holds less than the recipe makes**, and no bound step says it batches. Fails, quoting both
   lines. `saysItBatches()` looks for the word `batch` in a **bound** step, which is why
   `beef-with-broccoli`'s `sear in two batches 3 min` is legal at `c = 2, s = 4`.

One warning, not a failure: a capacity on a file whose `>> servings:` is a volume (`2 cups`).

**No `.cook` file declares a capacity today.** `grep -rl '^>> capacity:' recipes/` returns nothing.
Every test in `scaling.test.ts` uses a fixture or spreads one onto a real recipe in memory.

## 2. The cost function, in the two forms that matter here

From `docs/knowledge/scaling.md` §2, implemented in `costOf()`:

```
m = n/s     b(k) = ceil(k/c), or 1 with no capacity     r = b(n)/b(s)
elapsed(n)  = A_free + m·H_free + r·(A_batch + H_batch)
standing(n) =          m·H_free + r·H_batch
cost of the vessel = A_batch·(r − 1) + H_batch·(r − m)
```

The consequence that governs this whole ticket: **`A_batch·(r − 1)` is the expensive term and
`H_batch·(r − m)` is rounding.** A vessel that bounds a *wait* costs real minutes; a vessel that
bounds *work* costs nothing, because the work was going to grow anyway. Searing beef in two goes is
free. Three loads of a twenty-minute basket is forty minutes.

`r` is a **ratio**, `b(n)/b(s)`, not a count — a recipe measured at `s` servings was measured with
`b(s)` loads already in it, so a capacity below `>> servings:` does not double-charge the author's
own batching.

## 3. Two mechanical traps, both found by probing rather than by reading

Both were measured against real files with a candidate line injected in memory
(`scratchpad/probe.mjs`), and both silently produce **a capacity that costs nothing**.

### 3.1 The operation has to match the TIMER NAME, not just the step

`binderFor()` (`scaling.ts:369`) charges a timer to the vessel only when the capacity names it:

> a named timer is in the vessel only if the capacity names it, and an unnamed one is in whenever
> its step is

Every air fryer file writes its step label as **`roast in the basket …`** and its timer as
**`~air fry{21%min}`**. Measured on `air-fryer-chicken-wings` at twelve servings:

| Operations declared | Binds the step? | Timer in the vessel? | elapsed at 12 | vessel costs |
| --- | --- | --- | ---: | ---: |
| `roast` | yes | **no** | 21 | **0** |
| `air fry` | yes | yes | 63 | 42 |
| `roast, air fry` | yes | yes | 63 | 42 |

The first row passes every check in the repo and does nothing. **A capacity that names only the
label's verb is a line that reads correctly and prices nothing.**

### 3.2 Matching is by whole words over label + body, so a capacity binds more steps than expected

`textOf()` is `labelOverride + rawLabel`, and `rawLabel` keeps the cookware words. So `air fry`
matches a step that merely says `#air fryer basket{}`, and `fry` on `general-tsos-chicken` binds
step 0, `velvet, rest 30 min`, because its body mentions frying.

This is harmless **only** because the over-bound steps carry *named* timers (`rest`, `stirfry`,
`fry=8`) that the capacity does not name, so no minutes are charged. It would not be harmless on a
step with an unnamed timer. Checked across all 46 candidates: **no bound step anywhere carries an
unnamed timer.**

---

## 4. What the collection already says, measured

685 `.cook` files (the ticket says 658; the collection grew — see §7).

| Set | Files | How it was found |
| --- | ---: | --- |
| the word `batch` anywhere | 71 | `grep -rli batch recipes/` |
| a **step** whose words state a load | 70 | `>> step:` label + body, `scratchpad/inventory.mjs` |
| a step that states a **batch count** (`two`, `three`) | 25 | of those 70 |
| an area-bounding vessel in `cookware` | 119 | sheet pan · baking sheet · steel · griddle · iron · comal · tawa · steamer · basket · grill · smoker · plancha · peel |
| S-008's air fryer files | 21 | slug `air-fryer-*`, all declaring `#air fryer basket{}` |

The gap between 71 and 70 is the word doing other work: **`one batch` as a quantity** of a written
component (`croissant dough{1%batch}`, `masa para pan dulce{800%g}(three-quarters of a batch)`,
`shawarma spice{3%Tbs}(one batch)` — 11 files), and **`the batch` in a `>> slack:` line** meaning
*the lot* (`a scorched batch is all of it` — 8 files).

### The four wordings that carry a load, and how many determine a number

| Wording | Files | Determines `c`? |
| --- | ---: | --- |
| `in two batches` / `in three batches` | 25 | **yes** — `c = ceil(s/N)` |
| `in batches` with no count | 11 | no |
| `one layer` / `not touching` in a named machine of stated size | 21 | **yes** — the air fryer files |
| `one layer` in an unsized pan, rack or sheet | 13 | no |

### The air fryer files are the only ones that pin a vessel's size

Every one of the 21 carries the same line, which S-008's gate required:

> Written for a preheated 5.7 L basket. From cold, add three minutes. **A 3.5 L basket is two
> batches, not more minutes.**

That sentence does two things nothing else in the collection does: it **names the vessel's size**,
and it says **what a smaller one costs**. Together they pin the load — this quantity is one basket
in a 5.7 L machine and two in a 3.5 L one. Everywhere else, `one layer` says only that the amount
fits, which bounds capacity from below and leaves it undetermined.

## 5. The deep-fry group, and what actually bounds it

`docs/gaps/one-pot.md` names four: `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`,
`sweet-and-sour-pork`. All four serve 4, all four declare one `#wok{}`, all four read:

> Fry … in @peanut oil{4%cups} **in two batches** at 350°F (175°C) for ~fry{5%min}, rest them on a
> rack, then return every piece to the oil at 375°F (190°C) for ~fry{2%min}.

Two neighbours state the mechanism outright:

- `french-fries`: *"in batches small enough that **the oil does not drop below 350°F**"*
- `fried-chicken`: *"Fry in two batches and **let the fat climb back to 325°F** between them"*

So the limit is thermal recovery, not area — four cups of oil has a heat capacity and a cold piece
of chicken spends it. `scaling.md` §7 already prices this: `karaage`'s oil bath **costs zero
minutes**, because the batched operation is ninety seconds of frying rather than a wait.

## 6. What binds and what only looks like it, in the files

- **The basket** (21) — a machine, sized in the file, twenty minutes of *waiting* per load. The
  expensive case, and the only one where `A_batch` is large.
- **The browning pan** (24) — a skillet or an Instant Pot's base, `~brown{12%min}` or
  `~sear{12%min}`, hands-on. Crowding changes the dish (*"in two batches with room around every
  cube"*, *"crowded, it steams"*) and the clock barely moves. Real, and cheap.
- **The pot of frying oil** (5) — bound by temperature recovery; the batch is 90 seconds to 5
  minutes of *frying*, so it costs nothing on the clock and still tells a cook to use two goes.
- **The wide pot of water** (`wonton-soup`) — wontons must not stick to each other; a 4-minute
  *boil* repeats, so this one does move the clock.
- **The sheet pan** (≈30, including 24 cookie files) — genuinely area-bounded, and **no file says
  how full it is**. `roasted-brussels-sprouts` spreads 1½ lb cut-side-down on a pan that could hold
  three times that; `chocolate-chip-cookies` lines *two* baking sheets for 48 cookies and never
  says how many rounds go on one, or whether the oven takes both at once.
- **The griddle, the waffle iron, the comal, the tawa, the crepe pan** (≈10) — one item at a time
  by construction, and not one file says how many items a serving is.
- **The bamboo steamer** (8) — `har-gow` steams 24 dumplings *"well apart"*, `char-siu-bao` 12 buns
  the same; neither says how many tiers or how many to a tier.
- **The baking steel** (6 pizzas and flatbreads) — `margherita` bakes one 12-inch pie for two
  servings on a steel whose size the file never gives.
- **The smoker and the charcoal grill** (14) — grate area is real, and a brisket is one piece.
- **The pot** — volume, and `chili-con-carne`'s Dutch oven scales past any household number. Not a
  capacity, per `scaling.md` §1.

## 7. Constraints this ticket works under

- **One line, in `recipes/**/*.cook`.** No `src/`, no `scripts/`, no `docs/gaps/`, no README.
- **658 vs 685.** The ticket's fraction-of-658 test is quoted against an older count; the tree now
  holds 685 files. Both denominators are reported.
- **`scripts/parse-recipes.mjs` does not throw on `capacityProblem`** (T-011-02's open concern 1).
  It is outside this ticket's ownership. `npm run check` runs first in `npm run verify`, so nothing
  malformed can ship — but `npm run build` alone would read a broken line as absent.
- **`r < m` is possible** (T-011-02's concern 2). At `s = 8, c = 3, n = 12`: `b(8) = 3`, `b(12) = 4`,
  so `r = 1.33 < m = 1.5` and `costMinutes` comes out **negative** — a part-full last load. The two
  `carnitas` files are exactly this shape. Cosmetic, and not this ticket's code.
- **The stemmer is crude.** `sear`/`searing` match, `fry`/`fries` do not. Every candidate line was
  probed against its own file rather than assumed.
