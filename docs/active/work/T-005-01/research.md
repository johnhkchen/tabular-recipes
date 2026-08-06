# T-005-01 · Research — what a recipe may say

Descriptive only. What exists, where the words live, how they reach a page, and what the
collection actually measures today. No proposals here.

## 1. The two files this ticket may touch

- `docs/knowledge/voice.md` — **does not exist.** `docs/knowledge/` holds exactly two files:
  `counters.md` (979 lines, the counter archetypes and menu vocabulary) and
  `rdspi-workflow.md`. Nothing in the repo describes how a recipe should be worded.
- `scripts/check-recipes.mjs` — 107 lines. Runs as `npm run check`, and `npm run verify` is
  `check → recipes → vitest → astro build`, so `check` is the first gate in the chain.

## 2. How words get from a `.cook` file onto a page

The pipeline is three hops and one branch decides everything.

```
recipes/**/*.cook
  └─ scripts/normalise.mjs      parses cooklang, flattens to { steps[], slack, metadata }
       └─ src/lib/tree.ts       buildTree() — splits steps into ops and prose rows
            └─ src/lib/layout.ts  layout() — tiles the ops into the grid
                 └─ src/components/RecipeTable.astro, Timeline.astro, CookModes.astro
```

`scripts/parse-recipes.mjs` writes `src/generated/recipes.json` (658 recipes, 4.0 MB) using
the same `normalise()`. `check-recipes.mjs` uses `normalise()` + `buildTree()` + `layout()`
too, so **the checker already sees every field this ticket cares about**; nothing new has to
be parsed.

### The branch

`src/lib/tree.ts:117` — `const isOpStep = (step) => step.ingredients.length > 0 || step.refs.length > 0`

- A step that **uses an ingredient or a reference** becomes an operation. Its cell text is
  `step.labelOverride ?? cleanLabel(step.rawLabel)` (`tree.ts:129`).
- A step that **uses neither** becomes a full-width prose row — a `header` if it comes before
  the first operation, a `footer` if after (`tree.ts:130-133`).

`rawLabel` is the step's own prose with the ingredient names removed
(`normalise.mjs:83 stripIngredients`). Cookware, timers and temperatures stay in.

### Where the discard happens

When a step has a `>> step.N:` line, `labelOverride` wins and `rawLabel` is never rendered —
it survives only inside the collapsed *See how it is written* block, as raw cooklang. This is
the mechanism the story names, and the code confirms it: `rawLabel` is stored on the step
(`normalise.mjs:187`) and read by nothing except `tree.ts`'s fallback.

### Where each field lands

| Field | Produced at | Rendered at |
| --- | --- | --- |
| `>> step.N:` (op step) | `normalise.mjs:132` | operation cell, `layout.ts` grid |
| step body prose (op step with an override) | `normalise.mjs:131` | **nowhere** |
| step with no ingredients | `tree.ts:130` | `tree.headers` / `tree.footers`, full-width row |
| `>> slack:` | `src/lib/slack.ts readSlack()` | `Timeline.astro:315` — `<b>{word}</b> — {reason}` |
| ingredient `(note)` | `normalise.mjs:164` | ingredient cell, inside `display` |

`Timeline.astro:315` renders **the reason only**; the level is a separate bold chip. So the
payload of the `slack:` line is `slack.reason`, not the whole `>> slack:` line.

A full-width row is emitted by all three views — table, prep and cook (`CookModes.astro`
switches views client-side over the same markup), which is the story's "rendered 3×".

## 3. What the collection measures today

Measured over all 658 recipes from `src/generated/recipes.json`, regenerated with
`node scripts/parse-recipes.mjs` (658 recipes, 27 categories).

### Operation cell labels — n = 3077

```
mean 24.3   p50 24   p75 33   p90 41   p95 46   p99 57   max 70
over 60: 19 cells (0.6%)   over 70: 0
```

Histogram (10-char bins): `0-9:429  10-19:709  20-29:918  30-39:657  40-49:275  50-59:66  60-69:21  70-79:2`

**The story's claim holds.** It said 3077, mean 25, max 70, healthy. Measured: 3077, mean 24.3,
max 70. The longest are legitimately dense —
`recipes/cookies/sable-cookies.cook#7 "egg wash, roll edges in sugar, slice 1/2 in, bake 350°F (175°C) 18 min"`
(70). Nothing here reads like a mangled sentence fragment. Three tickets downstream depend on
this staying true; it does.

### Discarded step bodies — n = 2642 op steps carrying a `step.N` override, in 637 files

```
mean 103   p50 80   p75 145   p90 216   p95 262   max 547
total 250,382 characters that no reader sees
```

The story says "1501 steps across 474 recipes, 228,000 characters". Measured under the plain
definition (any op step with an override) it is 2642 / 637 / 250,382. The story's figure is
reproducible with a floor: bodies over 60 characters give 1487 steps in 480 files and 214,999
characters. **Same phenomenon, slightly different counting rule; the plain definition is larger,
not smaller.** Nothing here contradicts the story.

Share that is still a single sentence, by length band:

```
0-99   1673 steps   99% one sentence
100-124  207        78%
125-149  208        56%
150-174  140        26%
175-199  121        16%
200-224   90         7%
225+     203         1%
```

Among bodies that have two or more sentences, the **first** sentence — the mechanical one that
names the ingredients — runs p50 71, p75 102, p90 131 characters. So the machinery fits well
under 150; everything past that is the essay.

### Full-width prose rows — n = 393 in 292 files

Split by side of the table:

```
above (headers)  n=286   mean 134   p50 80    p90 291   max 730
below (footers)  n=107   mean 271   p50 255   p90 454   max 588
```

The story says 286 above (mean 135, max 757) and 107 below (mean 276). Counts match exactly;
the two means differ by one character and the max by 27, because the story measured the raw
line and this measures the rendered row (`cleanLabel` applied, ingredient markup gone).

**The distribution is bimodal.** 25-char bins:

```
0-24:11   25-49:90   50-74:37  │ 75-99:13  100-124:11 │ 125-149:34  150-174:38  175-199:23
200-224:20  225-249:16  250-274:20  275-299:19  300+:47   max 730
```

- **The lower hump (≤74, 138 rows)** is prep directives: `preheat a baking steel on the upper
  rack of the oven at 550°F (290°C) 45 min`. Instructions, not prose.
- **The trough (75–124, 24 rows)** is one good sentence:
  `Assembly, not cooking. Everything is already hot, the bowl goes together in ninety seconds,
  and it is eaten immediately.` (120) — `Three things, and only three: dry, hot, and not
  crowded.` (124).
- **The upper hump (≥125, 231 rows)** is essays. One-sentence share falls off a cliff across
  the trough: 99% below 100, 55% at 100–124, 15% at 125–149, 0% past 200.

Rows over 120 characters: 232 rows in **183 files** — exactly the story's figure.

Worst: `recipes/rice-beans-and-grains/boston-baked-beans-slow-cooker.cook#1` at 730 rendered
characters, printed three times per page.

### `>> slack:` reasons — n = 397 declared of 658

```
min 92   p10 160   p25 204   p50 236   p75 250   p90 260   max 290
```

25-char bins:

```
75-99:6  100-124:21  125-149:8  150-174:15  175-199:39  200-224:51 │ 225-249:153  250-274:95  275-299:9
```

**No trough. A plateau.** 257 of 397 lines (65%) sit in the 75-character band 225–299. Below
225 the field is sparse — 140 lines spread over 133 characters. That shape is what a field
written *to a length* looks like, not one written to a point.

Two counting notes, because the story and the ticket quote different numbers:

- The story's "333 of 397 over 200 characters" reproduces as **330** when the whole
  `>> slack:` value is measured (`narrow — …`) and **304** when only the rendered reason is.
- The ticket's "shortest around 103, longest 306" are likewise whole-line: the reason floor is
  92 (`+ "forgiving — "` = 103) and the reason ceiling is 290 (`+ "unforgiving — "` = 304).

**`Timeline.astro:315` renders the reason. That is the number a cap should govern.**

Clause count climbs steadily with length — share at two clauses or fewer: 100% below 100,
62% at 100–124, 38% at 125–149, 20% at 150–174, 15% at 175–199, 10% at 200–224, 3% at 225–249,
1% at 250+. Mean words per reason: 18 at the floor, 46 at the plateau.

### Ingredient `(note)` — n = 4553 in the collection

```
mean 12   p50 6   p90 27   p95 38   p99 63   max 172
over 60: 54 notes in 39 files   over 80: 17 in 13 files   over 120: 6 in 6 files
```

Smooth decay, one gap: nothing at all between 130 and 169, then two identical 172-character
notes (`green-radish-carrot-pork-bone-soup`, `watercress-honey-date-soup`). The long ones are
the Cantonese soup shelf, where the note carries the romanisation, the Chinese term and a
paragraph of what it does:

> `naam bak hang; the sweet and the bitter kind together, about three to one, and the pairing
> is the point — the bitter kind goes in small and always cooked through, never raw` (172)

## 4. The worked example the ticket names

`recipes/soups/tonkotsu-broth-instant-pot.cook` says the same fact three times:

- `>> slack:` (241 chars) — *"the pot does the extraction and cannot do the emulsion, so the
  twenty minutes with the lid off at the end is the whole white of it…"*
- `>> step.1:` (128 chars, and step 1 has no ingredients, so it renders as the header row) —
  *"The pot does the extraction. It cannot do the emulsion, and the last twenty minutes with
  the lid off are where the white comes from."*
- the opening paragraph body (447 chars) — *"The pot does the extraction and does it in an
  afternoon instead of a day. What it cannot do is the emulsion…"*

One fact, three lengths, and the reader meets it twice on the page plus a third time inside
the source dump. `recipes/noodles/tonkotsu-ramen.cook` has the same shape: `step.1` is the
120-char header row, and the paragraph under it repeats it verbatim before adding the scalded
bowl.

## 5. Constraints this ticket runs under

1. **The checker cannot fail today.** `npm run verify` starts with `npm run check`. T-005-04,
   T-005-05 and T-005-06 each run `verify`; if `check` exits non-zero the day caps land, the
   three tickets that clean the collection cannot finish. Reporting only.
2. **Two of the five fields have no owning ticket.** The story assigns slack to T-005-04, prose
   rows to T-005-05 and step bodies to T-005-06. Operation labels are protected by name
   ("measured, healthy, left alone"). **Ingredient notes are assigned to nobody.** Any cap that
   flags a note today is work with no owner, and T-005-07 flips the checker to failing.
3. **Only two files may change.** No `.cook` file, no component.
4. `check-recipes.mjs` already exits 1 for structural failures. That behaviour predates this
   ticket and is not the cap gate; the cap gate has to be separable from it.
5. The checker takes optional path arguments (`scripts/check-recipes.mjs recipes/braises/*.cook`)
   and a `--labels` flag. A report must behave sensibly on a subset, not just the whole
   collection.
6. Current state: `npm run check` reports `all 658 file(s) draw a table.` and exits 0.

## 6. Assumptions carried forward

- Lengths are counted in characters of the **rendered** string, after `cleanLabel`, because
  that is what a reader meets and what `Timeline.astro` / `RecipeTable.astro` print.
- The "step body" field only exists as something distinct when the step has a `>> step.N:`
  override. Without one, the body *is* the operation label and is governed by that cap.
- `src/generated/recipes.json` is a build artifact, regenerated by `npm run recipes`; measuring
  from it is measuring the collection.
