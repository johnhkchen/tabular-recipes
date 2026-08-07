# T-011-05 — Design

Four decisions: how the cost reaches the browser, how a `Cost` becomes a finding, which
phrasebook row each finding takes, and how far to take the total.

---

## 1. How the cost reaches a page drawn in the browser

`costOf()` needs the whole recipe tree and a `Schedule`. `/list/` has neither: it has
`localStorage` and one 650 KB `plan.json` of ingredients. Four ways out.

| | Approach | Verdict |
| --- | --- | --- |
| A | Ship `recipes.json` to the browser and call `costOf()` live | **No.** 4.2 MB for four slugs. |
| B | Add cost fields to `/plan.json` | **No.** `src/pages/plan.json.ts` is not a file this ticket owns. |
| C | A new `/scaling.json` endpoint | **No.** A second page under `src/pages/` is not "a component", and it is a second fetch on the critical path for data the page needs on first paint. |
| D | **Precompute at build time, emit as a JSON island in the page** | **Chosen.** |

**D.** A new component, `src/components/PlanCosts.astro`, imports `recipes.json` in its
frontmatter, calls `buildSchedule()` once and `costOf()` four times per recipe — one per entry in
`MULTIPLIERS` — turns each result into a finding and a sentence, and renders one
`<script type="application/json" data-plan-costs>`. The page's client script parses it on load.

This puts every call to `costOf()` at build time, on the server, where the recipe tree already
is. **The page does no arithmetic on batches, minutes or ratios** — it looks up a string and two
numbers by slug and multiplier, which is what the criterion *"the batch count comes from
`src/lib/scaling.ts`, not from arithmetic done in the page"* asks for, in the strongest form
available: the page cannot do the arithmetic, because it does not have the inputs.

**Cost of D, measured.** 685 recipes × 4 multipliers. Written naively as objects it is 264 KB.
Deduplicated — there are only **76 distinct sentences** across the whole collection, because
every unbounded recipe at a given multiplier says the same thing — it packs to a string table
plus one four-element array per slug:

```
{ "says": [["Three times as much is three times the chopping. The pot doesn’t care.", ""], …],
  "at":   { "gumbo": [[3,24.5,116.5,1],[-1,49,102,1],[6,98,151,1],[9,147,200,1]], … } }
```

≈ 60 KB of inline JSON, almost all of it short integers, against a page that already fetches
650 KB. It is not free and it is the price of not owning `plan.json.ts`; §7 records what would
be cheaper if that file were in scope.

**Why the island and not `define:vars`.** A `<script type="application/json">` is inert, needs no
escaping dance, and is the same shape `data-plan-json`/`data-home` already use on this page: the
markup carries the data, the script reads it out.

---

## 2. Classifying a `Cost` — and keeping "unbounded" and "cannot say" apart

The criterion is explicit: *the unbounded case and the cannot-say case must be different in the
code.* So the classifier returns a **named finding**, not a nullable string:

```ts
export type Finding =
  | { kind: 'unchanged' }        // × 1 — the recipe as written
  | { kind: 'free' }             // nothing binds, and there is no work to grow
  | { kind: 'work' }             // nothing binds, and the work grows
  | { kind: 'same-wait' }        // nothing binds, less is wanted, the clock does not move
  | { kind: 'fits' }             // a vessel, and the wanted amount still fits it
  | { kind: 'unbinds' }          // a vessel that no longer binds at this size
  | { kind: 'lots-only'; loads } // a vessel that binds, and it costs nothing but reloading
  | { kind: 'lots-cost'; loads; minutes }   // a vessel that binds, and it costs the clock
  | { kind: 'cannot-say' };      // no vessel declared, and the hands-on figure is ours
```

`'free'` and `'cannot-say'` are two different words in one union. Nothing downstream can
collapse them: `'free'` carries a sentence, `'cannot-say'` carries none, and the test file
asserts both on named recipes.

**The order of the tests, and why it is this order.**

```
m === 1                          → unchanged
cost.bounded                     → fits | unbinds | lots-only | lots-cost
cost.evidence === 'unknown'      → cannot-say
otherwise                        → free | work | same-wait
```

**`bounded` is tested before `evidence`, and that is the load-bearing choice.** All 27 of the
collection's capacity-carrying air fryer recipes read `evidence: 'unknown'`, because roast and
air-fry are unattended verbs and those files report zero hands-on minutes. Asking about evidence
first would silence exactly the recipes this ticket exists for — the basket that turns a
twenty-one-minute recipe into an hour. It is also right on the merits: **a batch count is a fact
about an authored `>> capacity:` line and does not rest on the hands-on figure at all.** `c` and
`s` are both stated by the author; `b(n)/b(s)` is arithmetic over two stated numbers.

What *does* rest on the hands-on figure is the clock consequence, and that is why `lots-cost`
reports `batches.costMinutes` — `A_batch·(r−1) + H_batch·(r−m)`, the vessel's own contribution —
rather than `elapsed.at`. For a basket that term is a repeated *wait* off real timers.

**`evidence === 'unknown'` is the cannot-say test**, and it is not a new rule: `dials.ts:154`
already uses `item.evidence !== 'unknown'` as `canAnswer` for the standing dial, on the same
axis, for the same reason. Reusing it means the plan page and the front page cannot disagree
about which recipes can be spoken for. It resolves to the ticket's *"declares no capacity and its
hands-on figure is mostly assumed"* through `handsOnEvidence()`: times nothing at all, or zero
hands-on minutes across untimed steps, or assumed minutes inside the figure.

**What it silences: 389 of 685 recipes, 57%.** That is a large number and it is the right one.
The two worst unwarned ×3 costs in the collection — `beef-rendang` (+120 min) and
`french-onion-soup` (+106 min) — are both in it, and both because their standing figures are
almost entirely assumed. Printing *"three times the chopping"* over a number nobody wrote is
`scaling.md` §4.6's failure reintroduced, which is the thing the ticket says this defect is.

---

## 3. The phrasebook mapping

Every sentence is a row of `docs/knowledge/scaling.md` §6, instantiated with this recipe's
figures. Nothing is improvised, and **no row needed adding** — §7 records the one near miss.

| Finding | Condition on `Cost` | §6 row |
| --- | --- | --- |
| `free` | not bounded, `standing.flat` , m > 1 | Cooking **three times** as much costs you nothing extra. |
| `work` | not bounded, standing grows | **Three times as much** is **three times** the chopping. The pot doesn't care. |
| `same-wait` | not bounded, `standing.flat`, m < 1 | **Half as much** still takes the same **2 hr**. |
| `fits` | bounded, `batches.at === batches.written` | It fits. One load either way. |
| `unbinds` | bounded, `batches.at < batches.written` | At this size it all goes in at once. |
| `lots-only` | bounded, binds, `costMinutes === 0` | It goes in **six** lots, and that is the only difference. |
| `lots-cost` | bounded, binds, `costMinutes > 0` | It goes in **three** lots, and that costs you about **42 min**. |
| — qualifier | `untimedCount > 0` | …plus **three** steps the recipe never times. |

Notes on three of them.

- **`work` covers both directions.** *"Half as much is half the chopping. The pot doesn't care"*
  is the same row read downward and reads correctly; `same-wait` is reserved for the case where
  the clock genuinely does not move at all.
- **`lots-cost` uses the phrasebook's short-wait row for long waits too.** §6 offers a separate
  row for a long bound wait — *"three times the batches, and three times as long standing
  there"* — and it is **wrong for every recipe in this collection that would reach it**: the
  22 air fryer files report zero standing minutes, so their forty extra minutes are a wait, not
  standing there. *"…and that costs you about 42 min"* states the same fact without the false
  clause. The long row stays unused rather than misapplied.
- **The qualifier is a second element, not a longer sentence.** §6 writes it with a leading
  ellipsis because it is a tail. Rendering it as its own `<span>` in a lighter colour keeps both
  rows verbatim, avoids the `"… 42 min. …plus three steps"` collision, and marks it as a caveat
  rather than part of the claim.

**Counted over the collection** (per multiplier — the distribution is identical at ×2 and ×3):
237 `work`, 13 `free`, 24 `lots-only`, 22 `lots-cost`, 389 `cannot-say`. At ×0.5: 237 `work`,
13 `same-wait`, 25 `unbinds`, 21 `fits`, 389 `cannot-say`.

**No notation.** The new copy contains no `O(·)`, no `×`, no arrow, no batch count written as
arithmetic. The dial's own `×2` labels and the existing `serves 4 → 12` are the multiplier
*control* and its readout; the ticket protects the multiplier set and does not ask for them, and
removing the label from the button that sets the multiplier would leave the control unreadable.

---

## 4. The total

### The arithmetic

Per the ticket, and per `buildSchedule`'s own model: **unattended work runs in parallel, hands-on
work does not.**

```
standing  = Σ  standing.at        over the planned items
evening  ≥ max elapsed.at         over the planned items
```

**Elapsed times are never summed.** The maximum is a floor and is stated as one — two two-hour
braises are a two-hour evening, and if they are also two twenty-minute chops the evening is two
hours and forty minutes, which this deliberately does not claim.

### What it may count

The same split `dials.ts` already makes, for the reason it gives:

- **Standing** sums only items whose `evidence !== 'unknown'`. Those are the minutes we would be
  refusing to speak about one line above; summing them into a total would put back exactly the
  fabrication the per-line rule removed.
- **The floor** takes the maximum over every item with `elapsed.at > 0`, including cannot-say
  ones. `dials.ts:153` argues this and it holds here: an eight-hour braise is eight hours because
  the recipe says so, and refusing to say when the evening ends because its *hands-on* figure is
  weak is its own dishonesty.
- **What is left out is said, not dropped.** Items with no usable standing figure are counted and
  named in the same line, in `unsaidLine()`'s register.

### The wording

> **About 1 hr 10 standing, and the evening runs at least 2 hr** — the waits overlap, the
> standing about doesn't. Two of these don't time enough of themselves to count.

Plain, verb-forward, no notation, and it says *at least* out loud. §6 has no row for it because
§6 catalogues per-recipe findings; this is a scheduling statement about several recipes and the
model file's §9 lists cross-recipe scheduling as unsettled. The wording is therefore new copy in
the house voice rather than a phrasebook row, and this is recorded as the one place this ticket
writes a sentence §6 does not contain.

### How far, and what is deferred

**A real cross-recipe schedule is its own story and is not attempted.** Doing it properly means
interleaving two recipes' critical paths, deciding whether the oven is free, and resolving which
hands-on stretch yields to which — that is `buildSchedule` again over a merged graph, plus a
vessel-contention model the collection has no data for (`scaling.md` §9: per-step cookware is not
in the generated data). The sum-and-max version answers the cook's actual question — *is this a
one-hour evening or a four-hour one* — at a hundredth of the cost, and it cannot be wrong in the
dangerous direction, because it never claims less than the longest single dish.

**It shows at every multiplier, including when everything is at ×1.** *What does this evening
cost* is not a question about scaling; it is the question the list has always been unable to
answer. §3's "nothing at ×1" is about the per-line batch warning, and that rule is kept exactly.

---

## 5. Not letting it shout

- **Nothing at ×1** — `unchanged` returns no sentence, before any rendering decision is made.
- **Nothing where there is nothing to say** — `cannot-say` returns none either. The element is
  not created; there is no empty box, no dash, no "unknown".
- **One line, in the existing quiet register.** The finding goes inside `.what`, directly under
  `p.meta`, as a `p.cost` at `0.82rem` in `--clay-ink-soft` — the same size and colour `p.meta`
  already uses. It adds height to a flex item and moves nothing sideways.
- **The total is one line under the planned list**, in the `.fine` register that already carries
  the doubling note.
- **No colour-only signalling and no icon.** A batch warning that reads as an alert would make a
  shopping list feel like a form with an error on it.

---

## 6. Rejected

- **Compute in the browser from a compact per-recipe model** (`A`, `H`, `A_batch`, `H_batch`,
  `c`, `s` — about 27 KB instead of 60 KB). Cheaper, and it puts `ceil(n/c)` in the page, which
  the criteria forbid by name and `scaling.ts` forbids by design. A second implementation of the
  cost function is exactly how the two answers drift apart.
- **A `cannot-say` sentence** — *"Nobody has measured what the pan holds for this one"* is a real
  §6 row and would fire on 389 recipes, on most lines of most lists. The ticket says print
  nothing, and 389 apologies is a page that has been made worse.
- **Putting the module in `src/lib/`.** Not this ticket's directory. `dials.ts` documents the
  same call and the same reasoning; moving it later is a rename.
- **Changing `servingsText`.** `serves 4 → 12` is true — the servings really do triple. The lie
  was the silence beside it, and the silence is what this fills.

---

## 7. Known gaps, carried to Review

1. **57% of the collection stays silent**, including the two largest unwarned costs in it. That
   is a data problem (untimed steps), not a page problem, and the honest surface for it is
   `>> capacity:` and more timers in the `.cook` files.
2. **60 KB of inline JSON** on `/list/`, which would be a few hundred bytes of extra `plan.json`
   if that file were in scope. Worth revisiting when it is.
3. **`scaling.md` §6's long-bound-wait row is unreachable** as written, because the recipes it
   describes report no standing minutes. Not a gap this ticket may fix — the file is not in the
   criteria list — but a real note for whoever owns it next.
4. **The batch model is optimistic** (§4.5: the oven drops every time the door opens), which is
   why the qualifier and the word *about* both matter on the `lots-cost` line.
