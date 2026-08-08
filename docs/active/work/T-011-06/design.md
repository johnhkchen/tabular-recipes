# T-011-06 — Design

Ten decisions. The load-bearing ones are D1 (the target is clamped upward), D2 (the situation
changes the recipe, not the dials) and D3 (what the browser is shipped).

---

## D1 — The target is `people × days`, and it never goes below what the recipe makes

**Decided:** `n = people × days`, then `n_eff = max(n, s)`. Every cost is taken at `n_eff`.

The ticket's hardest criterion is *"at small numbers the behaviour is identical to T-010-02's."*
Three readings were available.

| Option | What happens at "two meals for one, for today" | Verdict |
| --- | --- | --- |
| A. `n = people × days`, unclamped | `m = 1/4` on a recipe for four; standing, elapsed and the longest go all **shrink**, and recipes pass dials they used to fail | rejected |
| B. Off by default, identical only when unset | true, and vacuous — the claim holds only where the feature is not switched on | rejected as the whole answer |
| C. `n_eff = max(n, s)` | `m = 1` on every one of the 630 files written for four or more, so every figure is the written figure and every verdict is T-010-02's | **chosen** |

C is not a trick to satisfy a criterion; it is the honest reading of what a cook does. **You do not
un-cook a recipe.** Faced with a pot of chili written for six and one person to feed, nobody
simmers a sixth of it for a sixth of the time — they cook the pot and eat it twice, which is
precisely the ticket's *"two meals for one."* Scaling down is also where the model is least
trustworthy in the direction that matters here: `scaling.md` §4.3 records that a quarter of a roux
is not a quarter of the stirring, and the error would run towards *reassuring* a tired cook, which
is the opposite of the house convention (`schedule.ts:longestUnbroken()` — *"it errs towards a
busier evening"*).

So the phrasebook's three scale-down rows never fire on this page. They still belong to T-011-05,
where a reader has explicitly asked for half a recipe. Noted rather than deleted.

`n_eff = s` also gives the page a sentence it needs: **"Makes eighteen as written"** is a real
finding and a good reason for a card to be on a list.

## D2 — The situation changes the recipe the dials are asked about, not the dials

**Decided:** build a `ScaledItem` — the same `Item` with `handsOnMinutes`, `elapsedMinutes` and
`longestHandsOnMinutes` replaced by their values at `n_eff` — and hand it to T-010-02's existing
`verdict()`, `figures()` and `unsaidLine()` unchanged.

Three things fall out of this that no other shape gives:

1. **`src/components/dials.ts` is not edited.** It is not in this ticket's ownership list (an
   existing component, not a new one), and composing rather than editing keeps that literal.
2. **"Identical at small numbers" becomes a type-level fact, not a promise.** When `n_eff = s` the
   scaled item is field-for-field the original, so the same function returns the same verdict. The
   test is an object comparison, not a walk over behaviour.
3. **Answerability is invariant under scaling.** `canAnswer` reads `evidence`, `elapsedMinutes > 0`
   and `washingUpCount !== null`; scaling multiplies elapsed by `m ≥ 1` and touches neither of the
   others, so no recipe crosses into or out of *cannot say* because somebody set the people dial.
   That is worth having: the cannot-say shelf stays a statement about annotation, not about
   arithmetic.

Rejected: a fourth `DialId` for people and a fifth for days, folded into `Settings`. It reads
tidier and it is wrong — a dial is a **cap a recipe is measured against**, and people/days are the
**size the measurement is taken at**. Putting them in the same record would let `verdict()` compare
a recipe's minutes to a headcount.

**Things to wash does not scale**, and is left alone. Six portions of stew is the same pot, board
and spoon as four. The one thing that would change it is a second batch, and the batch is already
charged to the clock; charging it to the sink as well would be the same fact counted twice.

## D3 — What the browser is shipped: a pair of numbers for 639 recipes, a small table for 46

`src/lib/scaling.ts` is read-only here and does not export `A_free`, `H_free`, `A_batch` or
`H_batch` — only `costOf`'s results. So the browser cannot evaluate the curve at an arbitrary `n`
from what exists today. Three ways to close that:

| Option | Cost | Risk |
| --- | --- | --- |
| A. Precompute `[elapsed, standing, longest]` for every recipe at every reachable target | 685 × 8 × 3 ≈ 16k numbers, **~110 KB on a 283 KB index** — a 39% increase paid by everyone who types one letter | none, but the endpoint's own header says everything in it is a summary and the repeats were stripped to pay for four numbers |
| B. Recover the four parameters by probing `costOf` and solving | ~2 KB | the 2×2 system is **degenerate exactly when `s` is a multiple of `c`**, which is the common case here (`s=4, c=2`; `s=6, c=3`). Guarded probe selection is cleverness in an index endpoint |
| C. Ship `A` per recipe and use §2's collapsed form for the 639 unbound files; ship a small target table for the 46 bound ones | 685 numbers + 46 × 8 × 3 ≈ **12 KB, 4%** | two code paths, both pinned by a whole-collection test |

**Chosen: C.** The 46 are the whole of the hard case, and the collapsed form for the rest is not a
second opinion — it is `scaling.md` §2 verbatim: *"when no capacity is declared … `r = 1`, and it
collapses to `elapsed(n) = A + m·H`."* Where the two could drift, a test decides it:

> for all 685 recipes × all 8 reachable targets, the client's `costAt()` reproduces
> `costOf(recipe, n_eff)`'s `elapsed.at`, `standing.at` and `longest.at` exactly.

That is the same discipline `scaling.ts:splitAttention()` already lives under (*"a whole-collection
test holds it to that: summing this over every task reproduces the schedule's own two totals"*),
and it converts the closed form from an assumption into a reading.

New keys on `search.json`, seven of them, each named for what it is rather than for its symbol:

| key | on | why |
| --- | --- | --- |
| `writtenServings` | all | `s`. Decides the clamp and prints *"makes six as written"* |
| `waitMinutes` | all | §2's `A`. **Not `elapsedMinutes`** — `A + H ≥ totalMinutes`, gap = work run on a second pair of hands |
| `capacityServings`, `vessel` | 46 | `c`, and the vessel in the author's words, because §4.2 says a reader with a smaller pan must be able to do the correction the model cannot |
| `scaled` | 46 | `[elapsed, standing, longest]` per target, clamped at build time |
| `keepsText`, `keepsCharacter` | 138 | the span, and what it is like when you get there |

`keepsCharacter` costs about 8 KB and earns it: `keeps.ts` refuses a bare duration from an author
because *"a duration on its own is a shelf life, and this site does not make those."* A card
printing *"3 days"* alone would ship exactly the form the field refuses to accept.

## D4 — The days setting filters on keeping, and the rule is `days − 1`

**Decided:** a recipe must keep at least `(days − 1) × 24 h`. At `days = 1` the keeping question is
not asked at all.

Cook once, on the first day. The last plate is eaten on day `days`, which is `days − 1` days later,
so three days needs a dish that is good after two. A `days` rule would demand a fourth day nobody
eats. `keeps: not at all` is `0` minutes and fails at `days ≥ 2`, which is the answer — air-fryer
chips are not a Wednesday lunch, and the page will say so rather than dropping them.

**547 recipes have no `keeps` line**, and at `days ≥ 2` every one of them is `unsaid` rather than a
pass. This is T-010-02's rule applied to a fourth question, including its sharp edge: a **known**
failure still beats an unknown, so a stew that blows the clock dial fails on the clock instead of
being promoted onto the cannot-say shelf. The alternative — treating silence as a pass — would put
685 recipes into a three-day list on 138 recipes' worth of evidence.

That the three-day list is therefore mostly stews, braises, beans and soups is not a coincidence to
apologise for: T-011-04 annotated where a cook actually knows the answer, and those are the same
dishes. It is checked, not assumed, in Review's read-through.

## D5 — "How much have you got left" is the three dials, and gets no control of its own

**The ticket asks for this to be argued.** It is not a fourth input.

*For folding it in:* the dials **already are** that question, in its only measurable form. "How much
have you got left" resolves, every time, into how long you can stand at a pan, how late you can eat,
and how much you can face washing — which is exactly `standing`, `by` and `wash`. A fourth switch
would have to be **derived from those three or invented over them.** Derived, it is a second answer
to a question already answered — the thing `washing-up` refuses by counting a list rather than
taking a number, and `slack` refuses by carrying a reason rather than a level. Invented, it is a
composite score, which T-010-02 banned in a regex and S-011 calls *"a vibe in a mathematical
costume."*

*Against:* the ticket's own case is real — a tired person turns one switch, not three. That is a
genuine cost and this design pays it in **layout rather than in a new number**: the situation sits
in one sentence-shaped row above the dials, so the first thing a knackered reader meets is *how
many people, over how many days* — two presses — and the dials stay optional underneath. Two presses
is the one-switch experience without a switch that means nothing.

If a later story still wants the one switch, the honest version is a **preset** that presses the
three existing dials (an "exhausted" button that sets 15 min / 1 hr / 3 things), because it changes
the controls rather than the model. That is a different ticket and it is written down here so
nobody re-argues it from scratch.

## D6 — The stops

People `1 · 2 · 4 · 6`, days `Today · 2 days · 3 days`, each with an `Any` stop, drawn in the same
`.dial` track the three dials use.

S-011 names one person and six people, so both ends are the story's; 2 and 4 are the household
sizes between them. Days stops at three because that is the story's span and because keeping
evidence thins out past it (one file claims five days, one a week). Eight distinct targets are
reachable — 1, 2, 3, 4, 6, 8, 12, 18 — which is what makes D3's table small.

Rejected: a number input or a slider. `dials.ts` already argues this for elapsed minutes (*"a linear
track over that range puts every dinner in its first fifth of a percent"*), and here it is worse: a
free number invites 7, 11, 23 and the page would need to answer for targets nobody cooks.

## D7 — Three shelves, because a recipe that scales badly must not vanish

| shelf | who is on it | the line each card carries |
| --- | --- | --- |
| matches | passes every set dial at `n_eff` and keeps long enough | the finding, then the scaled figures |
| **doesn't scale to this** | passed at the written size and fails at `n_eff`, **or** fails only on keeping | why it dropped: *"Fine for four. At eighteen you're standing there two hours."* |
| we can't say | some set dial or the keeping question has no answer for it | T-010-02's `unsaidLine`, plus *"nobody said whether this keeps"* |

The middle shelf is this ticket's criterion *"a recipe excluded because it scales badly says so
rather than vanishing"*, and it is deliberately **not** every failure — a recipe that already failed
at four portions did not fail *because of the situation*, and putting it here would turn a targeted
finding into a dump of 600 cards. Capped at 12 like the unanswered shelf, with the remainder
counted, never silently dropped.

## D8 — The sentences, and where each one comes from

`scaling.md` §6 is the whole vocabulary. Every row this page can reach, with its condition:

| finding | sentence |
| --- | --- |
| `n_eff = s` | Makes six as written. |
| nothing binds, elapsed flat | **Feeds eighteen without taking any longer.** |
| nothing binds, real work | Feeds eighteen. The pot doesn't care — it's the chopping that grows. |
| fits the vessel in one go | It fits. One load either way. |
| vessel binds, wait is short | It goes in five lots, and that costs you about ten minutes. |
| vessel binds, wait is long | Five lots, one after another, and about an hour longer standing there. |
| vessel binds on work only | It goes in five lots, and that is the only difference. |
| `evidence: 'unknown'` | This one doesn't time enough of itself to say. |
| no timers at all | No times here at all, so there's nothing to work out. |
| untimed operations | …plus four steps the recipe never times. |

Two deliberate departures from the table's literal wording, both argued:

- **The reader's own number replaces the multiplier.** *"Feeds eighteen without taking any longer"*
  rather than *"Cooking three times as much costs you nothing extra."* The reader typed eighteen;
  saying it back is plainer than a ratio, and `n_eff/s` is a fraction on most files (18 over 4 is
  four and a half times, which is not a sentence anybody says). The ticket names this sentence
  outright as the one the story exists to print.
- **Counts are words up to twelve** — *five lots*, not *5 lots* — as the phrasebook writes them.

**The uncertainty rows win over the growth rows.** A recipe whose hands-on evidence is `unknown`
gets *"this one doesn't time enough of itself to say"* instead of a confident growth claim, because
§4.6's failure is a confident sentence on a recipe that times almost none of itself. No notation
anywhere: no `O(·)`, no `×`, no `→`, no arithmetic. A test greps every string this module can
produce for `[×→]|O\(|\bO\b|\d+\s*x\b`.

## D9 — URL state

Two more parameters, `people` and `days`, validated against the declared stops exactly as
`readSettings` validates the dials (`?people=7` falls back to Any, because a page drawing a list its
own controls cannot reproduce is worse than a link that degrades). Written in fixed order after the
dials: `?q=…&standing=…&by=…&wash=…&people=…&days=…`. `carriesState` gains the two keys so the URL
stays either silent or the whole state.

## D10 — Layout: one row, above the dials, shaped like a sentence

The situation is a `.situation` block inside the same `.finder` well, above `.dials`: two
`.dial-set`s in a flex row that wraps, with the existing `.dial` track and its 44px phone rule
reused wholesale. No new colours, no new primitives — `b28-clay.css` tokens only, as T-010-02 left
it.

The front-door risk is real and the ticket is explicit that growth is a finding, not a licence.
Five stacked control rows at 375px would push the counter shelf off the first screen. Two things
hold it: the situation row is **one row, not two** (both sets side by side, `minmax` floor small
enough for a phone), and the counter row is untouched when nothing is set. **This is checked with a
screenshot at 375px in Review, and if it fails the finding goes in the artifact rather than being
argued away.**

---

## Rejected outright

- **Sorting results by how well they scale.** No score, no sort — T-010-02's ban, and the ticket
  says the reason is worth more than the ordering.
- **A `situation.json` endpoint fetched separately.** Not in the ownership list, and a second
  fetch to answer one question the first fetch could have answered.
- **Editing `src/components/dials.ts`.** Out of ownership; D2 makes it unnecessary.
- **Printing the vessel's cost in minutes on the card.** *"About an hour longer standing there"* is
  the finding; the minute figure is already on the figures line for whoever set the dial.
