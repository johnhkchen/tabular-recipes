# T-010-03 — Research

What exists, where it lives, and what it can be asked. No proposals here.

Every count below is measured against the working tree at the time of writing, not remembered
from a previous ticket. **The collection is 685 recipes**, not the 658 the ticket text names, the
664 T-010-01 measured or the 672 T-010-02 measured. S-008 and S-011 have been landing on this
branch throughout. Every fraction in this ticket is over 685 and says so.

---

## 1. The three modules this ticket reads

| file | what it owns | this ticket |
| --- | --- | --- |
| `src/lib/time.ts` | the timer vocabulary: `UNATTENDED`, `HANDS_ON`, `NOT_A_VERB_IN_A_SENTENCE`, `readTimers()` | reads, proposes, **does not edit** |
| `src/lib/schedule.ts` | `buildSchedule()`, `BREAK_MINUTES`, `longestUnbroken()`, `handsOnEvidence()` | reads only |
| `src/pages/search.json.ts` | the nine keys the browser gets | reads only |
| `src/components/dials.ts` | `canAnswer()`, `measure()`, `verdict()`, `figures()` | reads only |

The filter's whole behaviour is four small functions in `dials.ts`, and each is a single line:

```
canAnswer(item,'standing') === item.evidence !== 'unknown'
canAnswer(item,'by')       === item.elapsedMinutes > 0
canAnswer(item,'wash')     === item.washingUpCount !== null
verdict()                  returns 'fail' on the first dial whose measure exceeds its cap
```

So auditing the filter is auditing the five numbers `search.json.ts` ships, and auditing those is
auditing `readTimers()`. There is nothing else in the chain.

## 2. What `search.json` carries, and what it does not

Nine keys per recipe: `slug`, `title`, `counters`, `find`, `elapsedMinutes`, `handsOnMinutes`,
`longestHandsOnMinutes`, `washingUpCount`, `evidence`.

`src/generated/recipes.json` carries considerably more, and two fields matter to this ticket
because a reader would use them and the browser cannot see them:

- **`metadata.servings` — present on all 685 files.** Values run `1`, `2`, `4`, `6`, `8`, `12`,
  `16`, `20`, `24`, and free text (`1 cup`, `3 cups`).
- **`cookware` — present on 588 of 685.** 40+ distinct entries: `food processor` (11),
  `blender` (13), `spice grinder` (10), `mortar` (22), `slow cooker` (20), `Instant Pot` (24),
  `smoker` (9), `mandoline`, `pasta roller`, `ice cream maker`, `baking steel` (6).

Neither is in the index. This is not a gap in the annotation; it is a gap in what nine keys were
chosen. `slack` (416 of 685) is likewise absent, which T-010-02's D3 argued for deliberately.

## 3. The vocabulary in `time.ts`, measured against what the files actually write

`UNATTENDED` holds 47 words, `HANDS_ON` 24, `NOT_A_VERB_IN_A_SENTENCE` 3 (`boil`, `dry`, `press`).

Counted directly off the `.cook` sources: **the collection writes 70 distinct named timers.**

- **50 are in one of the two lists** and read from the name — `source: 'name'`, `confidence:
  'stated'`.
- **20 are in neither.** They fall through `readTimers()` to `readWords()`, which reads the
  step's own words, and when those say nothing the reading is `default` → `unknown`.

The twenty, by minutes they carry:

| name | uses | total min | where |
| --- | --: | --: | --- |
| `airfry` | 21 | 296 | the whole air-fryer shelf |
| `reduce` | 17 | 231 | Instant Pot / slow-cooker lid-off finishes |
| `preheat` | 7 | 215 | pizzas, baked ziti, garlic knots |
| `render` | 12 | 126 | bacon and lardons |
| `thicken` | 9 | 111 | slaked starch on high |
| `sweat` | 14 | 103 | onions, no colour |
| `char` | 3 | 28 | pho aromatics over a flame |
| `firm` | 1 | 20 | croissant dough |
| `warm` | 7 | 18 | 13 more, all under 20 min each |
| `blanch` | 5 | 17 | |
| `cook` `rub` `rinse` `glaze` `cream` `blast` `heat` `caramel` `bloom` `draw` | 21 | ~60 | |

Two of `HANDS_ON`'s 24 words and nineteen of `UNATTENDED`'s 47 are **never written as a timer
name anywhere in the collection**. They act only loose in a sentence.

## 4. The three confidence states and where they come from

`handsOnEvidence()` in `schedule.ts:`, in order:

1. `totalMinutes === 0` → `unknown` (24 recipes: every dressing, rub and blend that times nothing)
2. `handsOnMinutes === 0 && untimedCount > 0` → `unknown` — **the blondies trap**
3. `assumedHandsOnMinutes > 0` → `unknown`
4. every task `stated` → `stated`, else `inferred`

Measured over 685: **stated 46 (6.7%), inferred 223 (32.6%), unknown 416 (60.7%).** The
distribution T-010-01 reported over 664 has not moved in shape.

What the rule does **not** test: an untimed operation sitting *beside* a timed hands-on one. Rule
2 fires only when `handsOnMinutes` is exactly zero. One recognised hands-on timer anywhere in the
recipe puts the figure above zero, rule 2 stops applying, and the recipe reports `inferred` —
which `canAnswer()` treats as answerable. This is the shape of the whole Design phase and it is
recorded here as a fact about the code, not yet as a defect.

**Only 35 of the 227 recipes that pass `standing ≤ 15` have every operation timed.** The other
192 report a figure that is a floor.

## 5. Coverage, as fractions of 685

| dial | rule | can answer for | share |
| --- | --- | --: | --: |
| Time you're standing there | `evidence !== 'unknown'` | 269 | **39.3%** |
| On the table by | `elapsedMinutes > 0` | 661 | **96.5%** |
| Things to wash | `washingUpCount !== null` | 177 | **25.8%** |

Supporting annotation: timers in 661 of 685 (96.5%), `slack` in 416 (60.7%), `washing-up` in 177
(25.8%). The washing-up figure has moved a great deal — T-010-01 measured 11, T-010-02 measured
164, it is 177 now — because S-008 has been annotating throughout. The washing-up counts
themselves are `0`×1, `1`×55, `2`×62, `3`×36, `4`×15, `5`×6, `6`×2.

## 6. The longest unbroken stretch, as it stands in the data

- `longestHandsOnMinutes === handsOnMinutes` on **625 of 685 (91.2%)**.
- The gap reaches `BREAK_MINUTES` (5) on **35 recipes** — those are the only ones where
  `figures()` would print the `longest go N` qualifier at all.
- Of those 35, **19 have `evidence: 'unknown'`**, so the standing dial cannot answer for them and
  the qualifier's own card never renders.
- Only **3 recipes** have `handsOnMinutes ≥ 30` with a gap of 15 minutes or more:
  `chile-verde-slow-cooker` (42/22), `hungarian-goulash-slow-cooker` (45/25),
  `beef-bourguignon-instant-pot` (45/30). All three are `unknown`.

`gumbo` reads `longestHandsOnMinutes: 49`, `handsOnMinutes: 49`, `assumedHandsOnMinutes: 0`,
`evidence: 'stated'`, and ranks **4th of 685**. Its 35-minute roux timer is a single named
`~roux`-class timer read as hands-on with `source: 'name'`.

## 7. The scenario the story names, against the controls that exist

S-010's sentence is *a long day, cooking for two, under twenty minutes standing there*. The three
dials in `DIALS`:

| dial | stops |
| --- | --- |
| `standing` | 5, 15, 30 |
| `by` | 30, 60, 120 |
| `wash` | 1, 3, 5 |

There is no 20-minute stop and no servings control anywhere. The nearest setting a reader can
actually press for *under twenty minutes* is `standing=15`. At that setting the collection splits
**227 pass · 42 fail · 416 cannot say**; at `standing=30` it is **260 · 9 · 416**.

## 8. Constraints this ticket works under

- **No `.cook` file is edited.** Everything found is a finding.
- **`src/lib/time.ts` is not edited.** The header comment says every word in
  `NOT_A_VERB_IN_A_SENTENCE` *"was caught lying"*, one at a time, with the evidence in the
  comment. A change to that file is its own ticket.
- **No dial is added.**
- Owned paths: `docs/gaps/README.md`, one new page, `docs/active/work/T-010-03/**`.
- The branch is live under other tickets. `src/lib/scaling.ts` and `scaling.test.ts` are modified
  in the working tree by S-011 work in flight, and 25 Instant Pot `.cook` files with them. Any
  count in this ticket is a count at a moment, and the moment is named.

## 9. How the measurements in this ticket were taken

`buildSchedule()` and `handsOnEvidence()` are imported directly from `src/lib/` by scratch
scripts outside the repository and run over all 685 records of `src/generated/recipes.json`,
reproducing exactly what `search.json.ts`'s `GET()` computes. `dials.ts`'s `canAnswer` /
`measure` / `verdict` are reimplemented line-for-line in the same scratch script rather than
imported, because `dials.ts` imports `.ts` paths Astro resolves and node does not.

Where a proposed vocabulary change is measured, `src/lib/*.ts` is **copied** to a scratch
directory, the copy is edited, and both versions are run over the same 685 records. The
repository copy is never touched.
