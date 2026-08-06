# T-005-02 · Research — the clock stops explaining itself

What exists, where, and what the collection actually measures. No proposals here.

---

## 1. The two components and how they reach a page

`src/pages/[slug].astro` builds the tree once and hands it to three places:

| Line | What renders |
| --- | --- |
| `40–44` | `facts` chips — `serves`, **`about <>> time:>`**, category |
| `97–99` | `<CookModes>` wrapping `<RecipeTable>` |
| `105` | `<Timeline>` |
| `132–135` | `<details class="source">` — the collapsed cooklang dump |

`facts` at line 42 is the finding that reframes the ticket's third question:

```astro
recipe.metadata.time && { label: 'about', value: recipe.metadata.time },
```

**The author's own time is already printed on every page, already labelled `about`.** 658 of 658
recipes carry `>> time:` (measured, §4). So the site already has a word for an approximate
duration, in the chrome above the table, and it is `about`. Nothing needs inventing; there is a
vocabulary to join.

## 2. `src/components/Timeline.astro` — where the sentences are built

Two separate string builders, both assembled in the frontmatter so an empty one leaves no empty
paragraph:

- **`notes`** (216–248) → rendered at 308 as `<p class="notes">`. Four pushes:
  - `217–223` untimed steps → *"One of the 4 steps never says how long it takes, so both numbers are floors."*
  - `230–237` assumed hands-on → either *"Nothing here says whether you can walk away, so all 10 min of it is counted as time you are standing over it."* or *"12 min of that is counted as needing you only because the step never said otherwise."*
  - `243–247` `handsOn > total` → *"It adds up to more hands-on time than the whole dish takes because two branches run at once — which needs someone free to run both."*
  - `248` → *"The recipe itself says 3 hr 30 min."*
- **`note`** (251–259) → rendered at 410 as `<p class="note">`. Three clauses joined by a space:
  - the scale/sliver sentence, when `stretches.length > 1`
  - *"Bars that line up are happening at the same time."*, when rows overlap
  - the dashed/dotted sentence, when any drawn bar is not `stated`

Other prose in the same file, which the ticket's tables do not list but which is the same species:

| Line | String | Printed on |
| --- | --- | --- |
| `294` | `.sub` *"two waits that overlap count once"* | every timed page (635) |
| `202–205` | `.sub` *"the rest you can walk away from"* / *"of the steps that give a time"* | every timed page |
| `283–287` | the `timesNothing` verdict, two sentences | 23 |
| `324` | `.axis-caption` *"Drawn to scale, longest wait and all:"* | every page with a stretch |
| `131–135` | `HEDGE` map → per-row `(read off the step)` / `(assumed)` | per row |

The `HEDGE` map matters more than its size suggests: **the fact the dashed/dotted paragraph
explains is already written in words next to every bar.** A dotted bar's row already reads
`10 min · needs you (assumed) · from the start`.

### The three-way visual code

`data-confidence` on `.bar` drives `border-style`: solid (`stated`), dashed (`inferred`), dotted
(`unknown`) — CSS at `730–737`. `schedule.ts` sets it from `AttentionSource`:

- `name` → `stated` — the author named a timer we recognise (`~rise{90%min}`)
- `label` → `inferred` — read off the operation's own words ("braise 3 hr")
- `default` → `unknown` — nothing said, so hands-on is assumed

`readTimers()` (`src/lib/time.ts`) only ever defaults to **hands-on**, so
**`confidence: 'unknown'` on a task that has minutes always means `attention: 'hands-on'`.**
The dotted edge can therefore only ever over-claim your attention, never under-claim it. That is
the safe direction, and it is the whole difference the third level of the code encodes.

## 3. `src/components/CookModes.astro` — one live sentence and one dead array

- **`clockFacts` (264–286) is dead code.** It is built and never rendered. `grep` finds
  `clockFacts` exactly once in the repository, at its own declaration; the cook pane carries a
  comment at `412–416` explaining that the chips were removed because the timeline prints the
  same two numbers 200px away. `const floor = … 'at least '` at `263` and the `.clock` CSS block
  at `750–769` are dead with it. **Nothing the ticket attributes to `clockFacts` is on a page
  today.**
- **`overlaps` pane-note (427–435)** is live, 144 pages: *"Start to finish is the longest chain
  through the table, so branches that overlap are counted once. That is why the waits add up to
  more than the clock…"* Its `overlaps` is `handsOn + unattended > total` — it explains a
  contradiction between the elapsed figure and the *waiting* figure. The waiting figure was in
  `clockFacts`. **It explains a clash between two numbers, one of which the page stopped
  printing.**
- **`!anyTiming` pane-note (418–425)**, 23 pages: *"Not one step here is timed, so there is no
  clock to keep — only the order things happen in."* Duplicates Timeline's verdict.
- **`.hedge` (491–493)**, per step: *"the recipe does not say whether you can leave"*, shown only
  when `confidence === 'unknown'`. Timeline shows its hedge for `inferred` too. **The two
  components already disagree about when the reading is worth flagging.**
- `.kind` (485–489) *"you can walk away"* / *"stay with it"*, and the `meanwhile` lines, are
  statements about the recipe's own structure, not about how the site reasons.

## 4. What the collection measures

Run against `src/generated/recipes.json` through the real `buildTree` / `buildSchedule`, 658
recipes. Every one of the story's six chrome counts reproduces exactly, which is what makes the
rest of these numbers trustworthy:

| Condition | Pages | Story says |
| --- | ---: | ---: |
| `untimed > 0` and something is timed → floors sentence | **577** | 577 |
| `stretches > 1` → sliver sentence | **531** | 531 |
| any drawn bar not `stated` → dashed/dotted sentence | **307** | 307 |
| `handsOn + unattended > total` → CookModes overlap note | **144** | 144 |
| `assumed >= handsOn` → "all 10 min of it" | **97** | 97 |
| `assumed > 0 && < handsOn` → "12 min of that" | **57** | 57 |
| `authorMinutes` parses → "The recipe itself says …" | **658** | 658 |
| `handsOn > total` → Timeline overlap sentence | **15** | 15 |

Further counts the ticket needs and the story does not have:

| | |
| --- | ---: |
| Recipes with `>> time:` (so the `about` chip renders) | **658 of 658** |
| Recipes that time nothing at all (`verdict`) | 23 |
| Recipes with any non-`stated` bar | 307 |
| Recipes with `assumedHandsOnMinutes > 0` | 154 |
| **Recipes with no ambiguity of any kind** (`untimed = 0`, every bar `stated`) | **44** |
| Recipes where the hands-on figure is our reading but the clock is exact | 14 |

Per-bar, across the whole collection — only tasks with minutes, i.e. bars that get an edge:

| `confidence` | Bars | Edge today |
| --- | ---: | --- |
| `stated` | **1112** | solid |
| `inferred` | **415** | dashed |
| `unknown` | **170** | dotted |

1697 bars, 34% of them not `stated`. A two-way solid/dashed split would be 1112/585 — a real
distinction, not a code that fires on everything or nothing. The 1380 `unknown` tasks with zero
minutes draw a diamond mark, not a bar, so they carry no edge at all.

## 5. The four recipes this ticket has to be right about

Read straight from `buildSchedule`:

| | steps | untimed | start→finish | needs you | assumed | `>> time:` | confidences |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `ching-bo-leung-soup` | 4 | 1 | 210 | 10 | 10 | 210 | unknown, stated, stated, unknown |
| `tonkotsu-broth-instant-pot` | 5 | 1 | 170 | 0 | 0 | 210 | stated ×4, unknown |
| `shakshuka` | 4 | **0** | 34 | 11 | 0 | 45 | **stated ×4** |
| `mushroom-risotto` | 5 | 1 | **24** | **34** | 4 | 45 | unknown, inferred ×3, unknown |
| `french-onion-soup` | 5 | 2 | 83 | 53 | **50** | 120 | unknown, unknown, inferred, unknown, inferred |
| `pizzelle` | 5 | **4** | **0.75** | 0.75 | 0.75 | **45** | unknown ×5 |

Three of these decide the design:

- **`shakshuka`** is the unambiguous page: nothing untimed, every reading the author's own. It is
  one of 44. Today it still prints *"The recipe itself says 45 min."* and the sliver sentence.
- **`mushroom-risotto`** is the overlap case: 34 minutes of hands-on work inside a 24-minute
  dish, because three branches run together. One of 15.
- **`pizzelle`** is why the floor cannot become a fuzz. It times 45 *seconds* out of five steps
  and its own header says 45 *minutes*. The page currently reads *"at least 45 sec"*. Written as
  *"about 45 sec"* it would sit 200px under a chip reading *"about 45 min"* and one of them
  would be a lie. `Timeline.astro:208–213` already names this case in a comment.

## 6. `src/lib/schedule.ts` — what it already exposes

`Schedule` carries `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`,
**`assumedHandsOnMinutes`**, `untimedCount`, `authorMinutes`, plus `tasks` with `confidence`
per task. Everything both components need for a hedge is already there or one predicate away;
what is *not* there is a single place that says **what counts as our reading rather than the
author's**. Timeline spells it `row.task.confidence !== 'stated'` in two places; CookModes
spells it `row.task.confidence === 'unknown'`. That divergence is the drift the ticket is asking
to close.

`schedule.test.ts` is 9 files / 832 tests' worth of suite alongside the other libraries; it has
a test at `183` — *"will not claim to know whether you can walk away"* — that pins the
`unknown` fallback. Any export added here needs a test beside it.

## 7. Constraints that bound any change

- **T-004-04:** true proportions only. The axis is linear, floored in pixels (`FLOOR_PX = 11`),
  and `LABEL_FITS_AT` is measured type width. Nothing about the hedge may touch `columns`,
  `span`, `LABEL_AT` or the container queries.
- **Ticket file boundary:** `Timeline.astro`, `CookModes.astro`, and `schedule.ts` only, with
  `schedule.test.ts` if `schedule.ts` moves. No recipe file. No new file, so a shared helper has
  to live in `schedule.ts` or nowhere.
- **`npm run verify`** = check → recipes → vitest → astro build. **`npm run verify:mobile`** =
  build → `check-overflow.mjs --width 375,390,768` → `check-touch.mjs`. Neither asserts on any
  string this ticket touches; `grep` finds no test or script referencing *floors*, *sliver*,
  *dashed edge* or *recipe itself says*.
- **Accessibility already in place:** the legend is a real `<ul aria-label="How to read the
  bars">` whose swatches are `aria-hidden` but whose text is not; the axis is entirely
  `aria-hidden` and every duration in it is repeated in a row. So a fact moved into the legend
  is still read aloud, and a fact moved into the axis would not be.

## 8. The measurement method, reproduced

The story's method — "stripping tags out of the built HTML with the collapsed source block
excluded" — is not scripted anywhere in the repository. Reconstructed as: take the `<main>`
element of `dist/<slug>/index.html`, drop `<details class="source">`, `<script>`, `<style>` and
comments, strip remaining tags with no substitution, decode entities, collapse whitespace.

Against the story's published figures:

| | this method | story | drift |
| --- | ---: | ---: | ---: |
| `ching-bo-leung-soup` | **6226** | 6223 | +3 |
| `dried-bok-choy-pork-lung-soup` | **6128** | 6126 | +2 |
| mean over 658 pages | **3494** | 3487 | +7 |
| median | **3383** | 3379 | +4 |
| max | **6226** | 6223 | +3 |

0.2% at worst, and the wordiest-ten list is the same Chinese soup shelf in the same order. Close
enough that a before/after delta measured this way is comparable to the story's baseline.

**Before, for the two pages the ticket names:** `ching-bo-leung-soup` **6226**,
`tonkotsu-broth-instant-pot` **4027**. Also recorded for the design's worked examples:
`shakshuka` 4421, `mushroom-risotto` 3688, `pizzelle` 2835.

## 9. Assumptions carried into Design

1. `dist/` as checked out is current — built at 08:12 today, ahead of every commit that touches
   `src/`, and the six chrome counts derived from `recipes.json` match the built pages' story
   figures exactly.
2. `>> time:` is present on all 658 recipes today, so removing the author's figure from the
   timeline never removes it from the page — the chip at `[slug].astro:42` always renders. A
   recipe added later without `>> time:` gets no chip and no note either, which is the same
   silence the collection already gives an unstated fact.
3. `formatDuration` is the only duration formatter; a hedge word has to be prefixed by the
   caller, as `CookModes.astro:263` already does.
