# T-010-02 — Structure

The blueprint. Four files, one of them new logic, one of them new tests. No file outside the
ticket's ownership list is touched.

| file | change | ~lines |
| --- | --- | ---: |
| `src/components/dials.ts` | **new** — the pure module | ~190 |
| `src/components/dials.test.ts` | **new** — its tests + collection properties | ~230 |
| `src/pages/index.astro` | modified — markup + script | +140 / −25 |
| `src/styles/site.css` | modified — `.filters`/`.filter` block replaced by the dial | +75 / −40 |

Nothing else. No `.cook` file, no `src/pages/search.json.ts`, no `src/lib/**`, no script, no
other page or component.

---

## 1. `src/components/dials.ts` — the public interface

Opens with the paragraph explaining why a pure module sits under `src/components/` rather than
`src/lib/` (D12), the way `src/pages/_search.json.test.ts` explains its own placement.

### Types

```ts
export type DialId = 'standing' | 'by' | 'wash';
export type Verdict = 'pass' | 'fail' | 'unsaid';

/** One entry of search.json. The nine keys T-010-01 ships, all of them. */
export interface Item {
  slug: string;
  title: string;
  counters: string[];
  find: string;
  elapsedMinutes: number;
  handsOnMinutes: number;
  longestHandsOnMinutes: number;
  washingUpCount: number | null;
  evidence: 'stated' | 'inferred' | 'unknown';
}

/** A cap the reader can pick. `label` is drawn, `spoken` is read aloud. */
export interface Stop { value: number; label: string; spoken: string }

export interface Dial {
  id: DialId;
  /** The URL parameter. Same string as the id, written once so it cannot drift. */
  param: DialId;
  /** What the reader sees above the row. D9. */
  name: string;
  /** What "Any" is called to a screen reader. */
  anySpoken: string;
  stops: Stop[];
}

/** null on a dial means Any — that dial is not set. */
export type Settings = Record<DialId, number | null>;
```

### Constants

```ts
export const DIALS: readonly Dial[];   // three, in reading order: standing, by, wash
export const OFF: Settings;            // { standing: null, by: null, wash: null }
/** The cap on cards drawn in each shelf. D6. */
export const SHOW_PASSES = 60;
export const SHOW_UNSAID = 12;
```

`DIALS` carries the whole vocabulary — labels, spoken forms, stop values — so `index.astro`
renders from it and `dials.test.ts` asserts against it, and there is one copy of every string.

### Predicates

```ts
/** Is any dial off Any? */
export function anySet(settings: Settings): boolean;

/** Can this recipe's data answer this dial at all? D4's three rules, one place. */
export function canAnswer(item: Item, id: DialId): boolean;

/** The figure this dial measures. Only meaningful when canAnswer is true. */
export function measure(item: Item, id: DialId): number;

/**
 * pass | fail | unsaid, by D4's composition rule: a known failure on any set dial
 * beats an unknown on any other.
 */
export function verdict(item: Item, settings: Settings): Verdict;
```

`verdict` walks `DIALS` in order; a set dial that can answer and is over its cap returns `'fail'`
immediately, a set dial that cannot answer raises a flag, and the walk ends `'unsaid'` if the
flag is up and `'pass'` otherwise. Returning on the first failure is what makes the rule
order-independent: any failing dial short-circuits whatever the others said.

### URL codec

```ts
/** The query string's `q`, or ''. */
export function readQuery(search: string): string;

/**
 * Settings from a query string. A value that is not one of this dial's stops falls back to
 * Any — D7: the dial and the URL must agree.
 */
export function readSettings(search: string): Settings;

/** Does this query string carry any finder parameter? Decides whether the URL is ours to write. */
export function carriesState(search: string): boolean;

/** '?standing=15&by=60&q=beans', or '' for the pristine front page. Stable parameter order. */
export function searchString(query: string, settings: Settings): string;
```

Parameter order is fixed — `q`, then `standing`, `by`, `wash` in `DIALS` order — so the same
state always produces the same link and a pasted URL round-trips byte-for-byte.

### Copy

```ts
/** A passing card's meta line: the figures the reader asked about, plus D2's qualifier. */
export function figures(item: Item, settings: Settings): string;

/** An unanswered card's line. One sentence, one "Nobody said". */
export function unsaidLine(item: Item, settings: Settings): string;

/** '227 match · 42 don't · 395 we can't say'. */
export function tallyLine(counts: { pass: number; fail: number; unsaid: number }): string;
```

`figures` builds from the **set** dials only, joined with ` · `:

| dial | phrase | zero case |
| --- | --- | --- |
| standing | `12 min standing` | `no standing about` |
| standing (qualifier) | ` · longest go 22 min` when `handsOn − longest ≥ BREAK_MINUTES` | — |
| by | `on the table in 1 hr 20 min` | (unreachable: `elapsed > 0` is the answerability rule) |
| wash | `3 to wash` / `1 thing to wash` | `nothing to wash` |

`unsaidLine` builds one sentence from the set dials that could not answer:

```
Nobody said how long you'd stand there.
Nobody said how long this takes.
Nobody said how long you'd stand there or what this leaves in the sink.
Nobody said how long you'd stand there, how long this takes or what this leaves in the sink.
```

Durations come from `formatDuration` in `src/lib/time.ts` — the site's one duration format.
`BREAK_MINUTES` comes from `src/lib/schedule.ts`. Both are imports; neither file is modified.

### What is deliberately *not* here

No sort, no rank, no weight, no total. `verdict` returns one of three words and nothing that
could be read as a position. The three figures are never combined.

---

## 2. `src/pages/index.astro`

### Frontmatter

Adds `import { DIALS } from '../components/dials.ts';`. Everything else is unchanged: the same
`recipes.json` import, the same `menus()`, the same `teaser()`.

### Markup

Inside the existing `.finder .clay-well`, between the search label and the tally:

```html
<div class="dials">
  <!-- one of these per dial, rendered from DIALS -->
  <div class="dial-set">
    <span class="dial-name" id="dial-standing">Time you're standing there</span>
    <div class="dial" role="group" aria-labelledby="dial-standing">
      <button type="button" data-dial="standing" data-value=""
              aria-label="any amount of standing there" aria-pressed="true">Any</button>
      <button type="button" data-dial="standing" data-value="5"
              aria-label="under 5 minutes standing there" aria-pressed="false">5 min</button>
      …
    </div>
  </div>
</div>
```

`<span id>` + `aria-labelledby`, never `<label>` — D11, because `check-touch.mjs` measures a
`<label>` that speaks for no control on its own box.

After the existing `.results`, which gains `data-hits`:

```html
<ul class="results shelf" data-hits hidden></ul>

<section class="cannot-say shelf-group" data-cannot hidden>
  <h2>We can't say for these <span class="n" data-cannot-count></span></h2>
  <p class="blurb">Nobody wrote these down in enough detail to tell. They might still be
    what you want.</p>
  <ul class="results shelf" data-unsaid></ul>
</section>

<p class="nothing" hidden></p>
```

`.nothing`'s text moves into the script so it can say the right thing for a query
(*"Nothing matches that…"*, unchanged wording) and for dials (*"Nothing on the shelf fits that.
Try a longer time, or fewer things to wash."*). The counter row and everything above it are
untouched.

### Script

The existing script grows from one input handler to a small state object. Shape:

```ts
import { DIALS, OFF, anySet, carriesState, figures, readQuery, readSettings,
         searchString, SHOW_PASSES, SHOW_UNSAID, tallyLine, unsaidLine, verdict } from '…';

let query = '';
let settings: Settings = { ...OFF };
let index: Item[] | null = null;      // unchanged lazy fetch, now also triggered by a dial
let announce: number | undefined;     // the 350 ms tally timer
```

| function | job | changed? |
| --- | --- | --- |
| `load()` | fetch the index once | unchanged, now called from the dial handler too |
| `render()` | draws everything from `query` + `settings` | rewritten |
| `card(item, line)` | one `<li class="clay-surface">` with an `<a>`, `<h3>`, `<p>` | extracted from `render` |
| `paintDials()` | writes `aria-pressed` across all twelve buttons | new |
| `syncUrl()` | `replaceState` under D7's policy | new |
| `say(text, now)` | writes the tally immediately or after 350 ms | new |

`render()`'s branches, in order:

1. **no query and no dial** — results hidden, cannot-say hidden, nothing hidden, counters shown,
   tally reset to `Press / to search 664 recipes`. Byte-identical to today's empty state.
2. **index not loaded yet** — same as (1); the fetch's `.then` calls `render()` again.
3. **otherwise** — filter by the query words exactly as today, then partition with `verdict()`:
   - counters hidden;
   - passes → `data-hits`, capped at `SHOW_PASSES`, remainder line
     `and N more — turn a dial down, or search` when a dial is set, or the existing
     `and N more — keep typing` when it is only a query;
   - unsaid → `data-unsaid`, capped at `SHOW_UNSAID`, remainder line `and N more we can't say for`;
     the section is `hidden` when there are none;
   - `.nothing` shown only when passes and unsaid are both empty;
   - tally: `tallyLine(counts)` when a dial is set, the existing `N of M recipes` when it is not.

Event wiring:

| event | does |
| --- | --- |
| `input` on `#finder-q` | `query = value`; `load()` when non-empty; `render()`; `syncUrl()`; tally after 350 ms |
| `click` on `[data-dial]` | set/clear that dial; `paintDials()`; `load()`; `render()`; `syncUrl()`; tally now |
| `keydown` `/` on document | unchanged |
| on load | `readQuery` + `readSettings` from `location.search`; if either is set, `paintDials()`, `load()`, `render()` |

`syncUrl()` writes only when `anySet(settings)` **or** `carriesState(location.search)` — D7's
"silent, or the whole state" rule, evaluated live so clearing the last dial still rewrites once
and then falls silent.

---

## 3. `src/styles/site.css`

### Removed

Lines 300–340: `.filters`, `.filter`, `.filter:hover`, `.filter[aria-pressed='true']`,
`.filter:focus-visible`, `.filter .n`, `.filter--clear`. Dead since the first commit (D13),
and replaced by the thing they were written for.

### Added, in the same place — the `/* ---- the finder ---- */` section

```
.dials            grid, gap 0.75rem, repeat(auto-fit, minmax(14rem, 1fr)), margin-top 0.9rem
.dial-set         flex column, gap 0.3rem
.dial-name        0.78rem, --clay-ink-soft, font-weight 600
.dial             flex, wrap, gap 0.3rem, padding 0.25rem,
                  background --clay-well, box-shadow --clay-shadow-well,
                  border-radius --clay-radius-pill
.dial button      transparent, no border, pill radius, 0.82rem, tabular-nums,
                  --clay-ink-soft, transition --clay-press
.dial button:hover                 --clay-ink on a soft mix of --clay-surface-raised
.dial button[aria-pressed='true']  --clay-on-primary on --clay-primary, --clay-shadow-raised, 600
.dial button:focus-visible         the house ring: 3px color-mix(--clay-primary 45%), offset 2px
```

`auto-fit` + `minmax` rather than a media query: at 375px the inner width is ~322px so the three
dials stack, and at the page's 54rem cap they sit in one row of three. No new breakpoint, and
`breakpoints.test.ts` stays satisfied because no `@media` is added at all except the one below.

### Added — the cannot-say shelf and the card lines

```
.cannot-say       margin-top 2.25rem   (it reuses .shelf-group for h2 / .n / .blurb)
.results .unsaid  0.9rem, --clay-ink-soft, italic, margin-top 0.35rem
.results .figures 0.9rem, --clay-ink-soft, tabular-nums
```

### Added — `@media (max-width: 34rem)`, appended to the finder section's existing narrow block

```
.dial button { display: inline-flex; align-items: center; justify-content: center;
               min-height: 44px; }
```

The same shape `site.css` already writes for `.site-bar a` and `.skip:focus`, and `list.astro`
writes for `.dial button`. 34rem is a named breakpoint; 375 and 390 both sit under it, which is
where `check-touch.mjs` measures.

No new colour. Every value is one of the nine kit tokens or a `color-mix` of them.

---

## 4. `src/components/dials.test.ts`

Four groups.

**The vocabulary** — read off `DIALS` so a label change breaks a test rather than a page:
three dials with ids `standing`/`by`/`wash`; every stop has a distinct `value`, a `label` and a
`spoken`; no string anywhere in `DIALS` matches `/difficult|easy|hard|score|rating|level|effort|
active time|hands-on/i` — the composite ban asserted rather than promised.

**The verdict, on hand-built items** — one per rule, so the expected answer is read off a shape
chosen for it: over the cap on an answerable dial → `fail`; unanswerable dial → `unsaid`;
unanswerable **and** another set dial fails → `fail` (D4's tie-break, the one that is easy to get
wrong); nothing set → `pass` for everything; `washingUpCount: 0` under a cap of 1 → `pass`, not
`unsaid` (the absent-vs-zero distinction `washing-up.ts` is emphatic about).

**The URL codec** — round-trips `{ query, settings }` → string → `{ query, settings }`; drops a
value that is not a stop (`?standing=7` → Any); drops a non-numeric (`?by=soon`); orders
parameters stably; returns `''` for the pristine state; `carriesState` true for `?q=`, `?wash=1`,
false for `''` and `?other=1`.

**Properties over all 664 recipes**, importing `search.json.ts`'s `GET()` the way
`_search.json.test.ts` does — the same boundary, so a change in the endpoint fails here too:

- every recipe gets exactly one of three verdicts, for every one of the 64 settings combinations;
- with no dial set, all 664 `pass`;
- the counts at the documented stops are the ones `design.md` argues from — standing 15 →
  227/42/395, by 60 → 365/275/24, wash 3 → 6/5/653. If the collection moves, the design's
  numbers fail rather than quietly rotting;
- **no recipe passes on an unanswerable dial** — the whole point, stated as an invariant:
  `verdict === 'pass'` implies `canAnswer` for every set dial;
- `figures()` never returns an empty string for a passing recipe, and never mentions a dial that
  is not set;
- `unsaidLine()` starts with `Nobody said` and names only unanswerable set dials;
- named-slug regressions: `blondies` (the trap — `unsaid` at standing 15, never a pass),
  `chile-verde-slow-cooker` (`fail` at by 30 even though its standing figure is unanswerable —
  D4's tie-break on a real recipe), `mayonnaise` (`unsaid` at by 30, not an instant pass),
  `memphis-dry-rub` (`pass` at wash 1 on a real zero), `patty-melt` vs
  `chile-verde-slow-cooker` (the qualifier appears on one and not the other).

---

## 5. Ordering

The steps are independent enough to commit separately, and the order is chosen so each one is
verifiable before the next lands.

1. `dials.ts` + `dials.test.ts` — pure, `vitest run` proves it with no page and no browser.
2. `site.css` — the dead block out, the dial in. `vitest run` still passes
   (`breakpoints.test.ts` reads this file).
3. `index.astro` — markup, then script. `astro build` proves it compiles; `npm run verify`
   proves the whole suite.
4. `npm run verify:mobile` — the browser checks, last, because they need a build.

Step 1 cannot see steps 2–4; steps 2 and 3 both depend on 1 only for the names in `DIALS`.
