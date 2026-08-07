# T-011-06 — Structure

Six files: two new, four modified. Nothing under `src/lib/`, no `.cook` file, and
`src/components/dials.ts` is imported and never edited.

| file | | what |
| --- | --- | --- |
| `src/components/situation.ts` | **new** | the situation's vocabulary, the scaled cost, the fourth question, the sentences, the URL codec |
| `src/components/situation.test.ts` | **new** | hand-built shapes, the codec, the phrasebook ban, and the whole-collection agreement with `costOf` |
| `src/pages/search.json.ts` | modified | seven new keys |
| `src/pages/index.astro` | modified | one control row, one shelf, and a render that shelves four ways |
| `src/styles/site.css` | modified | `.situation`, `.reason`, `.wont-scale` |
| `src/pages/_search.json.test.ts` | modified | the new keys asserted at the endpoint's boundary |

---

## 1. `src/components/situation.ts`

Imports: `Item`, `Settings`, `Verdict`, `verdict`, `figures`, `unsaidLine` from `./dials.ts`;
`formatDuration` from `../lib/time.ts`. Nothing else. It renders nothing and knows nothing about a
page, the same boundary `dials.ts` keeps.

### The vocabulary

```ts
export interface Control { id: 'people' | 'days'; name: string; anySpoken: string; stops: Stop[] }
export const CONTROLS: readonly Control[]      // people 1·2·4·6, days Today·2 days·3 days
export interface Situation { people: number | null; days: number | null }
export const NOBODY: Situation                 // both Any — the off state
export const TARGETS: readonly number[]        // [1,2,3,4,6,8,12,18], derived from CONTROLS
export const SHOW_DROPPED = 12                 // the same cap the unanswered shelf uses
export function anyoneSet(s: Situation): boolean
export function target(s: Situation): number   // (people ?? 1) × (days ?? 1); always in TARGETS
export function days(s: Situation): number     // days ?? 1
```

`TARGETS` is **derived from `CONTROLS`, never written down twice** — `search.json.ts` builds its
table from it and a test asserts every reachable `target()` is in it. Adding a stop therefore grows
the table automatically.

### The index entry

```ts
export interface SituationItem extends Item {
  writtenServings: number | null;
  waitMinutes: number;
  capacityServings?: number;
  vessel?: string;
  scaled?: number[][];        // [elapsed, standing, longest] per TARGETS index
  keepsText?: string;
  keepsCharacter?: string;
  untimedCount: number;
}
```

`extends Item` is what lets a scaled entry be handed straight to `verdict()`.

### The cost at a target

```ts
export interface Scaled {
  servings: number;      // n_eff = max(target, s)
  asWritten: boolean;    // n_eff === s
  multiplier: number;    // m ≥ 1
  loads: number;         // b(n_eff)
  loadsWritten: number;  // b(s)
  elapsed: number; standing: number; longest: number;
}
export function costAt(item: SituationItem, wanted: number): Scaled | null
export function scaledItem(item: SituationItem, wanted: number): SituationItem
```

- `null` when `writtenServings` is null — no baseline, so no cost. (No file in the collection is in
  this state today; the branch exists so a future one cannot make the page lie.)
- **Bound recipes** (`scaled` present) read row `TARGETS.indexOf(wanted)`. A `wanted` that is not a
  declared target **throws**, because the alternative is the unbounded formula returning a quietly
  wrong number for exactly the 46 recipes the table exists for. Only declared stops are reachable
  from the UI and a test pins that.
- **Unbounded recipes** use `scaling.md` §2's collapsed form, with `costOf`'s own rounding:
  `elapsed = round(wait + m·handsOn)`, `standing = round(m·handsOn)`,
  `longest = round(min(longestHandsOn·m, m·handsOn))`.
- `scaledItem` returns `{...item, elapsedMinutes, handsOnMinutes, longestHandsOnMinutes}` replaced —
  and **returns the item unchanged when `asWritten`**, which is D2's identity.

### The fourth question

```ts
export function keepsMinutesNeeded(s: Situation): number   // (days − 1) × 24 × 60
export function keepsVerdict(item: SituationItem, s: Situation): Verdict
```

`pass` when `days ≤ 1` (the question is not asked), when the dish keeps long enough, or when the
target is unreachable; `fail` when a declared span is too short — including `not at all`, which is
`0`; `unsaid` when no span was declared.

### Shelving

```ts
export type Shelf = 'match' | 'dropped' | 'unsaid' | 'out';
export function shelve(item: SituationItem, settings: Settings, s: Situation): Shelf
```

Order, and it is T-010-02's order for the same reason:

1. no situation set → delegate to `verdict(item, settings)` and map `pass → match`,
   `unsaid → unsaid`, `fail → out`. **Byte-identical behaviour to today.**
2. a **known failure** first: if the scaled dials fail or the keeping fails, the recipe is out —
   `dropped` when the written-size verdict was not already `fail` (the situation is what dropped
   it), `out` when it was failing anyway.
3. then `unsaid` from either the dials or the keeping.
4. otherwise `match`.

### The sentences

```ts
export function reason(item: SituationItem, s: Situation): string      // a match card
export function dropped(item: SituationItem, settings: Settings, s: Situation): string
export function silence(item: SituationItem, settings: Settings, s: Situation): string
export function keepsLine(item: SituationItem, s: Situation): string   // '' at days ≤ 1
```

`reason` walks design.md D8's table top to bottom; the uncertainty rows (`evidence: 'unknown'`, no
timers at all) are tested **before** the growth rows so a recipe that times almost none of itself
never gets a confident sentence. `silence` is `unsaidLine(item, settings)` from `dials.ts` with the
keeping clause appended, so the dials' own wording is not restated here.

Two private helpers: `count(n)` (words to twelve, digits above) and `people(n)`.

## 2. `src/pages/search.json.ts`

Imports gain `costOf`, `servingsOf` from `../lib/scaling.ts` and `TARGETS` from
`../components/situation.ts`. Per recipe, after the schedule is built:

```
const s    = servingsOf(recipe)
const cost = s === null ? null : costOf(recipe, s, schedule)     // written figures only
waitMinutes      = cost ? cost.elapsed.written − cost.standing.written : 0   // §2's A
writtenServings  = s
capacityServings = recipe.capacity?.servings          // 46 files
vessel           = recipe.capacity?.vessel            // 46 files
scaled           = recipe.capacity                    // 46 files
  ? TARGETS.map((n) => costOf(recipe, Math.max(n, s), schedule))
           .map((c) => [c.elapsed.at, c.standing.at, c.longest.at])
  : undefined
keepsText        = recipe.keeps?.text
keepsCharacter   = recipe.keeps?.character
untimedCount     = schedule.untimedCount
```

The schedule is built once and passed into every `costOf` call — `costOf`'s own signature exists
for this. Cost: 46 recipes × 8 targets = 368 extra `costOf` calls at build time, against 685
schedules already built.

Absent keys are **omitted, not null**: `JSON.stringify` drops `undefined`, which keeps the 639
unbound entries the size they were.

## 3. `src/pages/index.astro`

### Markup — one row, above `.dials`

```astro
<div class="situation">
  {CONTROLS.map((control) => (
    <div class="dial-set">
      <span class="dial-name" id={`situation-${control.id}`}>{control.name}</span>
      <div class="dial" role="group" aria-labelledby={`situation-${control.id}`}>
        <button data-situation={control.id} data-value="" aria-pressed="true">Any</button>
        {control.stops.map((stop) => <button data-situation={control.id} …>{stop.label}</button>)}
      </div>
    </div>
  ))}
</div>
```

Same `.dial-set` / `.dial` / `<span>`-not-`<label>` shape the three dials use — including the reason
for the span, which is `check-touch.mjs`. `data-situation` rather than `data-dial` so the two
control groups never collide in a query selector.

One new shelf between the matches and the unanswered one:

```astro
<section class="wont-scale shelf-group" data-dropped hidden>
  <h2>Not at this size <span class="n" data-dropped-count></span></h2>
  <p class="blurb">These work as written. They don't stretch to what you asked for.</p>
  <ul class="results shelf" data-dropped-list></ul>
</section>
```

### Script

- `card(item, lines)` — `lines` is `{text, cls}[]`, so a card can carry the finding **and** the
  figures. One line and no class is exactly today's card.
- `settings` gains a sibling `situation: Situation`, read from the URL on load by `readSituation`.
- `paintSituation()` mirrors `paintDials()`.
- `syncUrl()` calls `situationString(input.value, settings, situation)`.
- `render()` walks the matched items once, calling `shelve()`, and fills four buckets. The empty
  state adds `!anyoneSet(situation)` to its condition — **no query, no dial and no situation is the
  page exactly as it was.**
- The tally keeps `tallyLine({pass, fail, unsaid})` from `dials.ts`, with `dropped` counted inside
  `fail`; the dropped shelf carries its own count in its heading, the way the unanswered one does.
  One sentence in the live region rather than four clauses at 375px.

## 4. `src/styles/site.css`

Three additions, no new colours, `b28-clay.css` tokens only.

- `.situation` — `display: flex; flex-wrap: wrap; gap: .75rem` with both `.dial-set`s at
  `flex: 1 1 11rem`, so the two sit side by side at 375px and never become two stacked rows.
  `margin-bottom` separates it from `.dials`.
- `.reason` — the finding line on a card: `--clay-ink`, 0.85rem, sitting above `.figures`.
- `.wont-scale` — `margin-top` and the `.shelf-group` heading treatment `.cannot-say` already uses;
  **no dimming and no badge**, for the reason T-010-02 recorded (opacity is a legibility cost paid
  by the reader least able to afford it).

## 5. Tests

`src/components/situation.test.ts`, reading the index through `search.json.ts`'s own `GET()` the way
`dials.test.ts` does:

1. **Agreement with the model.** For all 685 recipes × all 8 targets, `costAt()` reproduces
   `costOf(recipe, max(target, s))`'s `elapsed.at`, `standing.at`, `longest.at` exactly. This is the
   test D3 rests on and it covers both code paths.
2. **The identity at small numbers.** For every recipe and every target ≤ its written servings,
   `scaledItem` returns the item unchanged, and `shelve()` agrees with `verdict()` across all 64
   dial combinations.
3. **The off state.** `anyoneSet(NOBODY)` is false and `shelve()` delegates to `verdict()` for all
   685 recipes × 64 settings.
4. **Answerability is invariant under scaling** — `canAnswer` gives the same answer on the scaled
   item as on the original, on every recipe at every target.
5. **A known failure beats an unknown**, on the fourth question too: a recipe with no `keeps` line
   that fails a scaled dial is `dropped`/`out`, never `unsaid`.
6. **Keeping arithmetic**: `days − 1`; `not at all` fails at two days; a 3-day span passes three
   days and a 2-day span fails it.
7. **The codec**: round-trips every people × days combination, drops `?people=7` and `?days=nine`,
   writes a stable parameter order, and leaves the pristine page silent.
8. **No notation.** Every sentence the module can produce, over the whole collection at every
   target, matched against `/[×→]|\bO\(|\d+\s*[x×]\b|\bO\(1\)|\bn\b/` and required not to hit.
9. **Named slugs**: `chili-con-carne` (flat at eighteen), `beef-with-broccoli` (binds, costs
   nothing — §3's worked example), an air-fryer file (binds on a wait, costs real minutes),
   `gyoza` (times too little of itself to say).

`src/pages/_search.json.test.ts` gains: the seven keys present/absent exactly where they should be
(46 with a capacity, 138 with keeps, 685 with `writtenServings` and `waitMinutes`), `waitMinutes`
equal to `costOf`'s own written figures, and `scaled` rows aligned to `TARGETS`.

## 6. Ordering

1. `situation.ts` — vocabulary, `costAt`, `scaledItem`. (No page yet.)
2. `search.json.ts` + `_search.json.test.ts` — the index carries the numbers.
3. `situation.test.ts` part 1 — agreement with `costOf` over the collection. **This gate comes
   before any sentence is written**: if the closed form disagrees, everything downstream is moot.
4. `shelve`, `keepsVerdict`, and the sentences, with their tests.
5. `index.astro` + `site.css`.
6. `npm run verify`, then `npm run verify:mobile`, then the two situations read end to end in a
   real browser through `scripts/browser.mjs`.
