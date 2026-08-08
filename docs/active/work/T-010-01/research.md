# T-010-01 — Research

What exists, where it sits, and what a fourth and fifth number have to fit into. Descriptive
only. Every figure below was measured against the collection on 2026-08-07, not remembered.

The collection is **664 recipes**, not the 658 the ticket and story quote. T-007 and T-009 landed
in between. Every count in this file is against 664.

---

## 1. The clock, and exactly what it computes

`src/lib/schedule.ts` (297 lines) turns the merge tree into a schedule. `buildSchedule(recipe,
tree?)` returns one `Schedule`:

| Field | What it is | Line |
| --- | --- | --- |
| `tasks` | one per operation, deepest-first | `:54` |
| `lanes` | tasks packed into non-overlapping rows | `:56` |
| `criticalPath` | ids of the chain that sets the total | `:58` |
| `totalMinutes` | the critical path's length — elapsed, not the sum | `:61` |
| `unattendedMinutes` / `handsOnMinutes` | the work, **summed over every task** | `:68-69` |
| `assumedHandsOnMinutes` | how much of hands-on is there only because nobody said otherwise | `:78` |
| `untimedCount` | operations that never said how long they take | `:80` |
| `authorMinutes` | the `>> time:` claim, kept apart from ours | `:82` |

Each `Task` carries `id`, `label`, `column`, `minutes`, `timed`, `attention`
(`hands-on | unattended | unknown`), `confidence` (`stated | inferred | unknown`), `start`, `end`,
`dependsOn` (`:33-51`).

**Two properties of this module decide most of the ticket.**

**(a) The minute split is done timer by timer; the task label is done step by step.** Inside the
loop at `:126-133`, each timer's own minutes land in `handsOnMinutes` or `unattendedMinutes`.
`attentionOfTask()` (`:192`) then labels the *whole task* hands-on if **any** timer in it is, "because
telling a cook they can walk away when half of the step needs them there is the worse error".

So `task.attention === 'hands-on'` does **not** mean `task.minutes` is hands-on minutes. `baguette`
has a task labelled hands-on carrying 128 minutes of which 8 are hands-on. Any run computed at
task granularity would report 128 minutes at the bench for a recipe with 8. The timer split is the
only honest unit.

**(b) The schedule assumes infinite hands.** The comment at `:64-66` says so outright: *"it never
delays one hands-on task for another."* `start` is `max(end of dependencies)` (`:138`) and nothing
else. Two hands-on tasks with no dependency between them both start at zero.

Consequence, already visible on the site: `handsOnMinutes` can exceed `totalMinutes`.
`patty-melt` is 45 minutes of hands-on inside 41 elapsed. `Timeline.astro:250-252` already handles
that case by printing "N steps run at once" under the figure.

## 2. Where the confidence already lives

`Confidence` is defined at `schedule.ts:31` with the three words this ticket needs:

- `stated` — the author named a timer we recognise (`~chill{4%hr}`).
- `inferred` — we read it off the operation ("braise 3 hr").
- `unknown` — nothing said, so we assumed you are standing there.

It comes from `AttentionSource` in `src/lib/time.ts:95` (`name | label | default`) through the map
at `schedule.ts:91-95`. `confidenceOfTask()` (`:212`) takes **the weakest reading**: "a step is
only as well described as its vaguest timer". `attentionIsOurs()` (`:207`) collapses the three to
two for the page, and its comment records why the question is asked in one place: *"it was being
asked in two and answered differently: one pane hedged an inferred reading and the other did not."*

That precedent — one derived answer, taken once, exported — is the strongest constraint on how the
index carries confidence.

**Measured over 664 recipes:**

| | count | share |
| --- | ---: | ---: |
| every operation timed (`untimedCount === 0`) | 60 | 9.0% |
| nothing timed at all (`totalMinutes === 0`) | 24 | 3.6% |
| some hands-on minutes assumed (`assumedHandsOnMinutes > 0`) | 141 | 21.2% |
| **every** hands-on minute assumed (`assumed === handsOn > 0`) | 82 | 12.3% |
| weakest-task roll-up says `stated` / `inferred` / `unknown` | 46 / 3 / 615 | 6.9 / 0.5 / 92.6% |

That last row is the finding that shapes the design phase. A per-recipe confidence taken as the
weakest of its tasks — the rule `confidenceOfTask` already uses within a task — puts **93% of the
collection in one bucket** and leaves the dial with nothing to sort.

The story's trap, quantified: **327 recipes would pass a "under 15 minutes standing" filter while
having no timed evidence for the figure at all** (nothing timed, or every hands-on minute assumed,
or zero hands-on across steps nobody timed). Named examples: `blondies` (0 hands-on, 4 of 5 steps
untimed, the only timer a 25-minute bake), `brown-butter-brownies`, `baklava`, `date-squares`.

## 3. The search index as it stands

`src/pages/search.json.ts` is 34 lines. `GET()` maps `src/generated/recipes.json` to
`{ slug, title, counters, find }`, sorted by title, and returns it as JSON.

`find` is `[title, category, ...counters, ...aka, ...tags, ...ingredientNames].join(' ')`,
lowercased (`:18-27`).

The file's own comment (`:1-6`) is the constraint: it used to live in `data-` attributes on 241
cards, *"which put 47 KB of ingredient names into every visit whether or not anyone searched"*.

**Measured, from `dist/search.json` on a clean build of the current tree:**

| | bytes |
| --- | ---: |
| raw | **253,812** |
| gzip -9 | 58,946 |
| brotli | 47,603 |

**How the browser consumes it** — `src/pages/index.astro:77-113`, which this ticket does **not**
own:

```ts
type Item = { slug: string; title: string; counters: string[]; find: string };
const words = query.toLowerCase().split(/\s+/).filter(Boolean);
const hits = index.filter((item) => words.every((word) => item.find.includes(word)));
```

Two facts follow, and both matter for the byte budget:

1. **The query is split on whitespace and each word is matched independently as a substring.** No
   query word can ever contain a space, so the *order* of tokens in `find` and any *repetition* of
   them cannot affect a single result.
2. `title` and `counters` are carried both as their own fields (used for rendering, `:122-124`) and
   again inside `find`. That duplication is load-bearing for search and cannot simply be dropped.

**`find` is 26.6% repeated tokens.** Across the collection it is 190,400 characters / 29,281
whitespace tokens; deduplicated within each record it is 139,825 characters / 21,387 tokens. A
probe of all 3,088 distinct tokens against all 664 records found **0** records where
`find.includes(word)` changed answer after the dedupe.

**Cost of adding fields, measured** (each shape built and compressed for real):

| shape | raw | gzip | brotli |
| --- | ---: | ---: | ---: |
| today | 253,812 | 58,946 | 47,603 |
| + 7 fields, full names | 354,635 (+39.7%) | 66,296 (+12.5%) | 51,886 (+9.0%) |
| + 5 fields, short names | 292,964 (+15.4%) | 63,524 (+7.8%) | 50,491 (+6.1%) |
| + 5 fields **and** a deduped `find` | 242,264 (−4.5%) | 54,338 (−7.8%) | 43,971 (−7.6%) |
| today with only a deduped `find` | 203,090 (−20.0%) | 49,748 (−15.6%) | 41,011 (−13.8%) |

## 4. Build-time cost

`buildSchedule` over all 664 recipes, cold, in one process: **12.4 ms**. The whole `astro build`
after `npm run recipes` reports **688 pages in 619 ms** on this machine.

Every recipe page already builds its own schedule — `[slug].astro` passes one into
`Timeline.astro` (`Timeline.astro:50-54` accepts `schedule` precisely so it is not built twice).
The endpoint would build 664 more. 12 ms against a 619 ms build is 2%.

## 5. `washing-up`, from T-008-01

`src/lib/washing-up.ts` (done, status `done`). `RawRecipe.washingUp` is
`WashingUp | null` (`tree.ts:72`), where `WashingUp = { items: string[]; count: number }` and
`count` is `items.length`, derived in one place (`washing-up.ts:18-21, 51-56`).

The file's own rule, verbatim (`:23-26`): *"Absent and zero are different answers and are different
values."* `null` is "never declared"; `{ items: [], count: 0 }` is "genuinely washes nothing".

**11 of 664 recipes have declared one.** T-008-03 annotates the candidate pool and has not run:

| slug | count |
| --- | ---: |
| `memphis-dry-rub` | 0 |
| `shakshuka`, `one-pot-pasta`, `ratatouille` | 1 |
| `beef-bourguignon`, `beef-bourguignon-instant-pot` | 3 |
| `pho-broth-instant-pot`, `sweet-and-sour-pork` | 4 |
| `general-tsos-chicken`, `orange-chicken`, `sesame-chicken` | 5 |

So the index will carry a washing-up count for 11 recipes and nothing for 653. The absent/zero
distinction is not theoretical: `memphis-dry-rub` is the zero.

## 6. What a run of hands-on work looks like in this collection

Built from per-timer segments (a hands-on timer at its position inside its task's span), serialised
onto a single cook — the cook does two overlapping jobs one after the other — with a run broken by
any idle gap of at least *N* minutes.

**Gaps between consecutive hands-on segments, whole collection: 63 positive gaps.**

| | value |
| --- | ---: |
| smallest gap anywhere | 3 min |
| p10 / p25 / median / p75 | 10 / 20 / 50 / 90 min |
| largest | 840 min |
| gaps under 4 min | 1 (1.6%) |
| gaps under 6 min | 3 (4.8%) |
| gaps under 10 min | 6 (9.5%) |
| gaps under 30 min | 24 (38.1%) |

**How much the threshold changes the answer** (recipes whose figure differs from the 5-minute one):

| threshold | 0 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 15 | 20 | 30 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| recipes changed | 141 | 1 | 1 | 0 | — | 2 | 3 | 4 | 7 | 11 | 21 |

4 and 5 are identical across all 664. A threshold of 0 — every gap is a break — changes 141
recipes, which is the count of recipes with more than one hands-on segment.

**Critical path versus all branches.** Measuring the run only along `criticalPath` differs on **80
of 664** recipes, and always downward:

| slug | all branches | critical path only | `handsOnMinutes` |
| --- | ---: | ---: | ---: |
| `mujaddara` | 52 | 27 | 52 |
| `chopped-liver` | 37 | 25 | 37 |
| `borscht` | 28 | 10 | 28 |
| `potato-knish` | 20 | **0** | 20 |
| `mole-poblano` | 19 | **0** | 19 |
| `chicken-pesto-bowl` | 17 | **0** | 17 |
| `pho-broth` | 13 | **0** | 13 |

Six recipes come out at **zero** on the critical path while their cook stands at the hob for
between 12 and 20 unbroken minutes. Their hands-on work is all on side branches, and the chain that
sets the elapsed time runs through untimed merges and long waits.

## 7. Nine worked cases, read off the real files

```
patty-melt              elapsed 41  hands 45  assumed 0   untimed 1/4
  s0 [0-35]  hands-on/stated   "cook the onions down 35 min, low and slow"
  s1 [0-4]   hands-on/stated   "griddle the thin patties 4 min"
  s2 [35-35] unknown           "layer on rye, cheese against both slices"
  s3 [35-41] hands-on/stated   "griddle the whole sandwich 6 min, both faces"

chile-verde-slow-cooker elapsed 512 hands 42  assumed 20  untimed 1/5
  s1 [0-12]     hands-on/stated   "char under the broiler 12 min, peel"
  s3 [0-10]     hands-on/stated   "brown 10 min in a skillet, in batches"
  s4 [12-492]   unattended/stated "braise on low, 8 hr"
  s5 [492-512]  hands-on/unknown  "reduce uncovered on high 20 min, then lime"

mujaddara               elapsed 57  hands 52  assumed 0   untimed 0/6
  s1 [0-25]  hands-on/inferred    "fry 25 min"
  s0 [0-15]  unattended/inferred  "simmer 15 min, drain"
  s2 [0-25]  hands-on/inferred    "fry crisp 25 min, drain"
  s3 [25-27] hands-on/inferred    "toast 2 min"

tortilla-espanola       elapsed 42  hands 32  assumed 0   untimed 0/4
  s1 [0-20]  hands-on/stated   "fry gently 20 min, no colour"
  s2 [20-30] unattended/stated "beat, lift the potato in, stand 10 min"
  s3 [30-38] hands-on/stated   "set 8 min over low heat"
  s4 [38-42] hands-on/stated   "turn out onto a plate, slide back, 4 min"

cheese-grits            elapsed 35  hands 35  assumed 35  untimed 3/4
beef-rendang            elapsed 180 hands 60  assumed 60  untimed 4/6
doro-wat                elapsed 85  hands 40  assumed 40  untimed 2/4
french-onion-soup       elapsed 83  hands 53  assumed 50  untimed 2/5
blondies                elapsed 25  hands 0   assumed 0   untimed 4/5
```

`patty-melt` and `chile-verde-slow-cooker` differ by 3 minutes of hands-on and are not the same
evening. `mujaddara` runs three branches at once and two of them are frying. `blondies` is the
trap: no hands-on minutes at all, because four of its five steps carry no timer.

## 8. Boundaries

- **Owned:** `src/lib/schedule.ts`, `src/pages/search.json.ts`, their tests,
  `docs/active/work/T-010-01/**`.
- **Not owned and read-only here:** `src/pages/index.astro` (the browser's search code and the
  `Item` type), `src/components/Timeline.astro`, `src/lib/time.ts`, `src/lib/tree.ts`,
  `src/lib/washing-up.ts`, every `.cook` file, `scripts/*`.
- `src/pages/search.json.ts` has **no test file today.** `src/lib/schedule.test.ts` (517 lines) is
  the pattern to follow: hand-built fixtures for arithmetic, then whole-collection property tests.
- `schedule.test.ts`'s `fixture()` helper (`:55-82`) builds a `RawRecipe` literal that **omits
  `washingUp`**, which `tree.ts:72` requires. Vitest does not typecheck, and `astro build` does not
  reach test files, so this is latent rather than failing.
- `npm run verify` = `check-recipes` → `parse-recipes` → `vitest run` → `astro build`.
- Node is not on `PATH` in a bare shell here; `~/.nvm/versions/node/v24.18.1/bin` has to be
  prepended.
