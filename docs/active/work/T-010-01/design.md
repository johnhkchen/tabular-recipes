# T-010-01 — Design

Nine decisions. Each is stated, weighed against Research, chosen, and the rejected options say
why. The three the ticket asks to be argued are **D2 (the unit)**, **D3 (parallel branches)**,
**D4 (what counts as a break)** and **D6 (confidence, raw or derived)**.

---

## D1 — The number is a field on `Schedule`, called `longestHandsOnMinutes`

| Option | Against it |
| --- | --- |
| A free function the endpoint calls | The rule about what a cook's evening looks like would live outside the module that owns the tasks, and the timer split it needs (D2) is only visible inside `buildSchedule`'s loop. |
| A field on each `Task` | It is not a fact about one task. A run crosses tasks by construction. |
| **A field on `Schedule`** | — |

**Chosen: a field**, computed inside `buildSchedule` where the per-timer readings already are, sitting
beside `handsOnMinutes` and `assumedHandsOnMinutes` and named to match them.

Nothing existing changes. `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`,
`assumedHandsOnMinutes`, `untimedCount`, `criticalPath`, `lanes`, `tasks` and `authorMinutes` all keep
their current values; a field is added to the returned object and nothing else.

## D2 — The unit is the **timer**, not the task

Research §1(a): `attentionOfTask()` labels a whole step hands-on if any timer in it is, on purpose
— *"telling a cook they can walk away when half of the step needs them there is the worse error"*.
That caution is right for a label and catastrophic for a run.

`baguette` has one task labelled `hands-on` carrying **128 minutes**, of which **8** are hands-on
timers and 120 are a rise. Measured at task granularity the collection's longest stretch is
baguette at 128 minutes; measured at timer granularity it is `beef-rendang` at 60. Task granularity
also produced `lahm-bi-ajeen` and `pita-bread` at 98 minutes, both of which are eight minutes of
shaping around long proves.

**Chosen: build a hands-on segment per hands-on timer**, positioned inside its task's span — the
timers of a step run in order from `task.start`, which is the same order `readTimers()` slices the
label in — and measure the run over segments.

This buys an invariant worth testing: **`longestHandsOnMinutes <= handsOnMinutes` always**, because
the segments *are* the hands-on minutes. At task granularity that invariant is false on 5 recipes.

Rejected: adding a per-task `handsOnMinutes` field to `Task` and running over tasks. It fixes the
128-minute error but still says a step is one indivisible block of standing, which is wrong for
"knead 8 min, then rise 2 hours" — the rise inside the step is exactly the break a cook would take.

## D3 — Measured across **all branches**, serialised onto one cook

This is the decision the ticket says gets a four-branch recipe wrong.

The schedule's own comment (`schedule.ts:64-66`): *"assumes you have as many hands as the tree has
branches; it never delays one hands-on task for another."* That is right for a timeline — the glaze
genuinely gets made while the braise braises — and wrong for this number.

| Option | What it says about `mujaddara` | Verdict |
| --- | --- | --- |
| Along `criticalPath` only | 27 min | Rejected |
| Union of overlapping hands-on intervals | 27 min | Rejected |
| **All branches, serialised on one cook** | 52 min | **Chosen** |

**Critical path only** differs on 80 of 664 recipes and always downward. Six of them come out at
**zero** — `potato-knish`, `mole-poblano`, `chicken-pesto-bowl`, `crispy-rice-bowl`,
`teriyaki-chicken-bowl`, `pho-broth` — while their cook stands at the hob for 12 to 20 unbroken
minutes. The chain that sets the elapsed time runs through untimed merges and long waits, so
"restful" is exactly what it reports about the busiest recipes on the shelf.

**Interval union** is worse than it looks. Two 25-minute fries running in parallel are 25 minutes of
wall clock and 50 minutes of standing there; a union reports 25. It is the many-hands assumption
again, with a different arithmetic.

**Serialising** is one line of the walk: a cook takes each hands-on segment no earlier than the
recipe allows and no earlier than they finished the last one.

```
at = max(cursor, segment.start)
```

`mujaddara` fries the onions 25 min and the lentils 25 min, both from zero, then toasts 2 min at
25. A cook does 25 + 25 + 2 = 52 minutes back to back inside a 57-minute dish, and 52 is the
answer. `patty-melt` runs 35 minutes of onions beside 4 minutes of patties and then 6 more: 45
unbroken minutes inside 41 elapsed.

**Note for T-010-02:** `longestHandsOnMinutes` can exceed `totalMinutes`, for the same reason
`handsOnMinutes` already can. `Timeline.astro:250-252` handles that case today by printing "N steps
run at once". The dials will need the same care; the number is not wrong.

Serialising can only push work *later*, so it can only *shrink* the idle gaps it measures. Where it
errs it errs towards a busier evening, which is the direction that warns a tired cook rather than
reassuring one. It never changes `Task.start` or `Task.end` — the walk is local and the schedule it
walks is untouched.

## D4 — A break is idle time of at least **five minutes**: `BREAK_MINUTES = 5`

The ticket's frame: an unattended task between two hands-on ones is plainly a break; two minutes is
not, because nobody sits down for two minutes.

**Chosen: 5, as a named constant `BREAK_MINUTES` in `schedule.ts`.**

Two reasons, and the second is the stronger one.

1. Five minutes is the smallest gap you could plausibly leave the kitchen for. Under it you are
   still standing there waiting for the pan, which is what the dial is about.
2. **The collection does not care, and the number should not be doing secret work.** The smallest
   gap between hands-on segments anywhere in 664 recipes is **3 minutes**; exactly one gap is under
   4, and three are under 6. Thresholds of **4 and 5 give identical answers on all 664 recipes**.
   6 changes 2, 10 changes 4, 20 changes 11. So 5 sits on the plateau: it is defensible as English
   and it is not silently deciding anything.

The value that *does* decide things is **0** — every gap breaks the run — which changes 141
recipes. That is the count of recipes with more than one hands-on segment, and it is the shape the
constant exists to reject: `chile-verde-slow-cooker` would report 12 minutes rather than 22, and
`mujaddara` 25 rather than 52.

Rejected: making it configurable per call. One number, one answer, one place — the same instinct as
`attentionIsOurs`.

## D5 — The gap is measured against the cook's clock, not the recipe's

Once segments are serialised, the gap before a segment is `max(cursor, start) - cursor` — idle time
for **the cook**, not a hole in the recipe. Two hands-on jobs the recipe runs in parallel produce a
gap of zero and join into one run, which is what the ticket asks for. Only genuine nothing-to-do
time can break a run.

The run resets rather than accumulating across the break; the reported figure is the largest run
seen. A recipe with two 20-minute stretches around an 8-hour braise reports 20, not 40.

## D6 — The index carries a **derived verdict**, not the raw numbers

The ticket asks for one or the other and says to prefer the one that makes the wrong thing hard to
build.

| Option | For | Against |
| --- | --- | --- |
| A: raw `assumedHandsOnMinutes` + `untimedCount` | T-010-02 can threshold it any way it likes | Asks the browser to re-derive a rule that already exists here — the exact failure `attentionIsOurs`'s comment records (*"it was being asked in two and answered differently"*). And **the wrong thing is the default**: forget the threshold and 327 recipes pass "under 15 minutes standing" on no evidence at all. |
| B: **a derived verdict**, three states | Hiding an unannotated recipe requires writing `filter(r => r.evidence !== 'unknown')` — a visible act somebody reviews | T-010-02 cannot re-tune without a change here |
| C: both | — | Two answers to one question in one file. Also the most expensive shape. |

**Chosen: B.** The re-tuning objection does not survive contact with the board: T-010-03 audits the
collection at build time and can call `buildSchedule` directly, so it never reads the browser's
index; and re-tuning a threshold is a code change wherever it lives.

Exported as `handsOnEvidence(schedule: Schedule): Confidence`, reusing the `Confidence` type
already at `schedule.ts:31` — `stated | inferred | unknown` — because those are already this
repo's three words for exactly these three states, and a fourth vocabulary would be a second
answer by another name.

## D7 — The rule behind the verdict

Weakest-wins, the rule `confidenceOfTask()` already uses within a task, extended to the recipe, with
one distinction it has to make that a single task never had to.

```
unknown  when the hands-on figure rests on nothing we can point at:
           totalMinutes === 0                                  (the recipe times nothing)
         | handsOnMinutes === 0 && untimedCount > 0            (claims no standing time, across
                                                                steps nobody timed)
         | assumedHandsOnMinutes > 0                           (some standing minute is ours alone)
stated   when every task's reading is the author's own word
inferred otherwise
```

The distinction: **an untimed operation demotes the figure to `inferred`, not to `unknown`** — on
its own. An untimed step adds zero minutes, so it makes the hands-on figure a *floor*: we read what
was there and there is more. An **assumed** minute is different in kind — it is a number nobody
claimed, sitting inside the figure as if somebody had.

That distinction is what makes the field usable. The plain weakest-task rule — take the weakest
`Task.confidence` — puts **615 of 664** recipes in `unknown`, because 604 recipes have at least one
untimed step. A dial with 93% of the shelf in one bucket sorts nothing.

**Measured over 664:**

| verdict | count | share |
| --- | ---: | ---: |
| `stated` | 46 | 6.9% |
| `inferred` | 223 | 33.6% |
| `unknown` | 395 | 59.5% |

Rejected variants:

- **Any-assumed-minute is fine, only a wholly-assumed figure is unknown** (49 / 279 / 336). Leaves
  `french-onion-soup` — 50 of its 53 hands-on minutes assumed, the very recipe `Timeline.astro:227`
  names as the reason for the hedge — reading as merely inferred. So does
  `chile-verde-slow-cooker`, whose 20-minute finish is entirely our assumption.
- **Majority-assumed is unknown** (49 / 249 / 366). Introduces a second threshold — why a half? —
  that nothing justifies. This repo does not ship numbers it cannot justify.
- **`stated` needs only that every operation be timed.** Would call `mujaddara` stated, when every
  one of its readings came off the step text rather than a named timer. `stated` has to mean the
  author said it.

## D8 — Index fields: five, named for what they are

```jsonc
{
  "slug": "chile-verde-slow-cooker",
  "title": "Chile Verde (Slow Cooker)",
  "counters": ["Butcher"],
  "find": "chile verde slow cooker butcher pork shoulder tomatillos …",
  "elapsedMinutes": 512,          // Schedule.totalMinutes
  "handsOnMinutes": 42,           // Schedule.handsOnMinutes
  "longestHandsOnMinutes": 22,    // the new one
  "washingUpCount": null,         // count, or null for never declared
  "evidence": "unknown"           // stated | inferred | unknown
}
```

- **`washingUpCount` is written explicitly as `null`**, not omitted, on the 653 recipes that have
  never declared one. `washing-up.ts:23-26` is emphatic that absent and zero are different answers
  and different values, and an absent key is a third state a browser reads as `undefined` — which
  is falsy exactly like `0`. Writing the null costs 14 KB raw and buys a field that is always there
  and always means one of two things. `memphis-dry-rub` is the real zero in the collection today.
- **Nothing is rounded.** `Schedule` already rounds to two decimals (`schedule.ts:86`); rounding
  again here would be a second opinion about the same minute. `chahan` is 4.33 hands-on minutes and
  the index says 4.33.
- Field names match `Schedule`'s so the two cannot drift apart in a reader's head. These are
  machine-facing keys, not copy a visitor reads; `docs/knowledge/voice.md` governs the labels
  T-010-02 puts on the dials, not these.

## D9 — Paying for it: the 26.6% of `find` that was repeats

Adding five fields costs **+15.4% raw / +7.8% gzip**, well past the ticket's "a few percent".

The cut: **`find` is deduplicated token by token, within each record.** It is built by concatenating
`title`, `category`, `counters`, `aka`, `tags` and `ingredientNames`, and those overlap heavily —
26.6% of it is tokens already present.

This is safe, and it is safe for a reason that can be checked rather than asserted. The browser
(`index.astro:99-109`, not owned here) splits the query on whitespace and asks
`item.find.includes(word)` for each word independently. **No query word can contain a space**, so
no result can depend on the order of tokens in `find` or on any token appearing twice. A probe of
all 3,088 distinct tokens against all 664 records found **0** answers changed.

| | raw | gzip | brotli |
| --- | ---: | ---: | ---: |
| today | 253,812 | 58,946 | 47,603 |
| five new fields, `find` untouched | 292,986 (+15.4%) | 63,532 (+7.8%) | 50,495 (+6.1%) |
| **five new fields, `find` deduped** | **~242,000 (−4.5%)** | **~54,300 (−7.8%)** | **~44,000 (−7.6%)** |

The endpoint ends up **smaller than it is today**, on the wire and on disk. Final figures are
measured from the built `dist/search.json` in Review, not from this table.

Rejected: single-letter keys (`"e":45,"h":12`). Buys about 3% more and costs the file its
legibility, which is the thing this repo spends bytes on everywhere else.

Rejected: dropping `title` and `counters` from `find` — both are already separate fields on the
record, but the browser only ever searches `find`, and `index.astro` is not this ticket's to change.

## D10 — Build cost

`buildSchedule` over all 664 recipes is **12.4 ms**, against a 619 ms `astro build`. The endpoint
builds its own schedules rather than reaching for the ones the recipe pages built, because the
pages are separate module scopes and a shared cache would be a new global for 12 ms. Measured
again in Review, not assumed.
