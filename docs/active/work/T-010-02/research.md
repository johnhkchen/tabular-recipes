# T-010-02 — Research

What exists, where, and what it already decided. No proposals here.

---

## 1. The front page as it stands

`src/pages/index.astro`, 160 lines, is the only file this ticket owns outright. It is three
things stacked:

1. `.masthead` — an `h1` and a sentence with `{all.length}` in it (664).
2. `.finder .clay-well` — one `<input type="search" id="finder-q">` inside a `<label>` whose
   text is `.visually-hidden`, and a `<p class="tally" aria-live="polite">` under it.
3. `<ul class="results shelf" hidden>`, `<p class="nothing" hidden>`, and
   `<ul class="counters" data-counters>` — 21 counter cards, server-rendered.

The client script (lines 72–160) holds every behaviour the page has:

| Behaviour | Where | Detail |
| --- | --- | --- |
| lazy index fetch | `load()` | `fetch(search.json)` fires on the **first keystroke**, memoised in `loading`. The page ships no search data. |
| render | `render(query)` | splits on whitespace, `words.every((w) => item.find.includes(w))` |
| empty query | `render` early return | `results` hidden, `nothing` hidden, `shelf` (the counters) **shown**, tally reset to `Press / to search` |
| non-empty | `render` tail | counters hidden, results shown, tally set to `N of M recipes` |
| cap | `hits.slice(0, 60)` | plus an `li.more` reading `and N more — keep typing` |
| `/` shortcut | document keydown | focus + select unless already focused |
| deep link | bottom of script | reads `?q=` **once, on load**, and never writes it back |

Two facts that shape everything downstream:

- **The URL is read, never written.** `?q=miso` reproduces a search on load; typing `miso`
  produces no URL at all. There is no `history.replaceState` anywhere in the repository
  (`grep -rn replaceState src/` → nothing).
- **`Item` is declared as `{ slug, title, counters, find }`.** The four extra fields
  T-010-01 shipped are silently ignored. T-010-01's review, concern 1, names widening this type
  as this ticket's job.

## 2. What the index now carries

`src/pages/search.json.ts` (**not ours to edit**) emits nine keys per recipe, sorted by title:

```jsonc
{ "slug", "title", "counters", "find",
  "elapsedMinutes", "handsOnMinutes", "longestHandsOnMinutes",
  "washingUpCount", "evidence" }
```

`evidence` is `stated | inferred | unknown`, computed by `handsOnEvidence()` in
`src/lib/schedule.ts:364`. Its rule, read off the source:

```
totalMinutes === 0                          → unknown   (times nothing at all)
handsOnMinutes === 0 && untimedCount > 0    → unknown   (the trap S-010 names)
assumedHandsOnMinutes > 0                   → unknown   (minutes nobody claimed)
every task stated                           → stated
otherwise                                   → inferred
```

`washingUpCount` is `recipe.washingUp?.count ?? null` — `null` is "never declared", `0` is a
real answer (`memphis-dry-rub`).

### Measured against the built `dist/search.json`, 664 recipes

| | count | share |
| --- | ---: | ---: |
| `evidence: unknown` | 395 | 59.5% |
| `evidence: inferred` | 223 | 33.6% |
| `evidence: stated` | 46 | 6.9% |
| `washingUpCount !== null` | **11** | 1.7% |
| `elapsedMinutes === 0` | **24** | 3.6% |
| `handsOnMinutes === 0` | 267 | 40.2% — **254 of them `unknown`** |

Percentiles:

| | p25 | p50 | p75 | p90 | p95 | max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `elapsedMinutes` | 20 | 45 | 135 | 490 | 810 | 33,240 (`sour-dill-pickles`) |
| `handsOnMinutes` | 0 | 3 | 10 | 16 | 24 | 60 |
| `longestHandsOnMinutes` | 0 | 3 | 8 | 15 | 20 | 60 |

Four consequences, each of which constrains the design rather than suggesting one:

- **The hands-on axis is compressed.** Half the collection stands you there for 3 minutes or
  less. A gate at 15 minutes passes 588 of 664 raw — 88% — so a naive dial barely sorts.
- **The elapsed axis is not.** It spans 0 to 33,240 minutes with p50 at 45. A linear control
  over that range is meaningless; stops are the only readable shape.
- **`longestHandsOnMinutes === handsOnMinutes` on 604 of 664 (91.0%).** They differ on 60.
  At a 15-minute gate the two readings disagree about **18 recipes** (2.7%) — all of them
  braises and slow-cooker dishes: `carnitas-instant-pot`, `chili-con-carne-slow-cooker`,
  `refried-beans`, `taro-cake`, `gyoza`, `samosa`, and 12 more.
- **`elapsedMinutes === 0` is 24 sauces and seasonings** — `mayonnaise`, `guacamole`,
  `basil-pesto`, `memphis-dry-rub`, `taco-seasoning` — and all 24 are already `evidence:
  unknown`, so the elapsed trap is a strict subset of the hands-on one.

### The three-way split, measured

Answerable = the recipe's figure is evidence. Counting `evidence !== 'unknown'` for the
hands-on axis, `elapsedMinutes > 0` for elapsed, and `washingUpCount !== null` for the sink:

| gate | passes | fails | cannot say |
| --- | ---: | ---: | ---: |
| standing ≤ 5 min | 109 | 160 | **395** |
| standing ≤ 15 min | 227 | 42 | **395** |
| standing ≤ 30 min | 260 | 9 | **395** |
| on the table by ≤ 30 min | 207 | 433 | 24 |
| on the table by ≤ 60 min | 365 | 275 | 24 |
| on the table by ≤ 120 min | 458 | 182 | 24 |
| things to wash ≤ 1 | 4 | 7 | **653** |
| things to wash ≤ 3 | 6 | 5 | **653** |
| standing ≤ 15 **and** by ≤ 60 | 148 | 121 | 395 |

**The "cannot say" bucket is the largest answer on two of the three dials.** On the sink dial
it is 98.3% of the collection. This is not an edge case to style small.

## 3. The interactive vocabulary the site already has

There is exactly one segmented control in the repository, and it is called a dial.

`src/pages/list.astro:231–267` and `:995–1009` — the multiplier dial:

```html
<div class="dial" role="group" aria-label="How much Miso Ramen to make">
  <button type="button" aria-label="single batch" aria-pressed="true">×1</button>
  …
</div>
```

Styled as a `--clay-well` track (`background: var(--clay-well)`, `box-shadow:
var(--clay-shadow-well)`, `border-radius: var(--clay-radius-pill)`) holding transparent
buttons; the pressed one takes `var(--clay-primary)` + `--clay-shadow-raised` + `font-weight:
600`. Focus ring is `3px solid color-mix(in srgb, var(--clay-primary) 45%, transparent)` with
`outline-offset: 2px` — the same ring `.search input`, `.site-bar a`, `.filter` and
`.clay-button` all use.

**All of it is scoped**: `.list-page :global(.dial)`. Nothing in `src/styles/site.css` can see
it, so index.astro cannot reuse the rules — only the shape.

Three more precedents worth naming:

- **`AddToPlan.astro`** — a single `aria-pressed` toggle, with a comment (line 6) arguing that
  `aria-pressed` is what makes state *one* thing a screen reader reads rather than a label that
  changes underneath.
- **`RecipeTable.astro:116`** — every table cell is an `aria-pressed` target.
- **Dead CSS.** `src/styles/site.css:300–340` defines `.filters` and `.filter` — a wrapping
  flex row and a pressable pill with `aria-pressed='true'` styling and a `.n` count span.
  **Nothing uses them.** `grep 'class="filter'` over `src/` and `dist/` returns nothing, and
  `git log -S` puts them in `62a3ab9 Draw the table`, the first commit. They are a filter chip
  vocabulary written before there was a filter.

## 4. Accessibility and mobile, as already enforced

`npm run verify:mobile` = `npm run build && check-overflow --width 375,390,768 && check-touch`.

`scripts/check-touch.mjs` measures every `a[href], button, summary, select, textarea,
[role="button"], input:not([type=hidden]), label, td.cell:not(.cell--blank)` and fails under
**44px tall**. Two things it will do to a dial:

- **A `<label>` and the control it speaks for are measured as one union box, once, under the
  label** (`target()`, `spoken` set, lines 126–142). So a 19px `<span>` label above a 44px
  button row is not a fault — but a bare `<label>` with no control inside it or `for=` is
  measured alone and *will* fail at 19px.
- `[hidden]`, `display:none`, `visibility:hidden` and `clip-path` elements are skipped. A dial
  that only appears once results exist is invisible to the check while hidden — meaning a
  control shipped hidden gets no coverage, which is how `.clear` on the recipe table is
  handled today.

`scripts/check-overflow.mjs` fails on any element whose box passes `clientWidth + 0.5` without
a scrolling ancestor, at 375, 390 and 768. A wrapping flex row of pills cannot overflow; a
non-wrapping one at 375px can.

`src/styles/breakpoints.test.ts` **fails the build** on any `@media (max/min-width: …)` whose
value is not `44rem` or `34rem`, scanning every `.css` and every `<style>` block under `src/`.
There are exactly two numbers and a new dial may not invent a third.

The live region: `<p class="tally" aria-live="polite">` already exists and is already the one
thing that speaks when results change. `render()` writes it with `textContent`/`innerHTML` on
every keystroke — polite, so an announcement is superseded rather than queued, but it fires per
character today.

## 5. The kit, and where colour may come from

`src/styles/b28-clay.css` is vendored from b28.dev — **not ours to change** (the breakpoint
test's own error message says "reconcile there rather than here"). It gives:

- tokens: `--clay-primary #44679b`, `--clay-primary-strong`, `--clay-bg`, `--clay-surface`,
  `--clay-surface-raised`, `--clay-well`, `--clay-border`, `--clay-ink`, `--clay-ink-soft`,
  `--clay-on-primary #fff`; radii `sm/­default/lg/pill`; shadows `raised/pressed/well`;
  `--clay-ease`, `--clay-press`.
- primitives: `.clay-surface`, `.clay-well`, `.clay-button` (+`--soft`), `.clay-chip`, and a
  `prefers-reduced-motion` block that kills `.clay-button` transitions.

There are **nine colours in the whole system** and no semantic "warning" or "muted" colour
beyond `--clay-ink-soft`. Anything marking a recipe as unanswered has to be built from those
nine plus `color-mix`, or from weight, type and layout.

`site.css` writes `color-mix(in srgb, …)` in 20-odd places, so mixing is established practice;
inventing a hex is not.

## 6. Voice, as governed

`docs/knowledge/voice.md` is written about recipe files, but its three house tests apply to any
string a reader meets:

1. *Would a friend say it at a kitchen table?* — explicitly rejects "we worked out from the
   step whether you have to be there".
2. *Does it change how you cook it?* — otherwise it is the site explaining itself.
3. *Say it once.*

And the global brand rule (user CLAUDE.md): plain kitchen-table English, labels orient by what
you would **do** with it, no category jargon.

S-010 pre-names the three labels: *time you're standing there*, *on the table by*, *things to
wash*, and pre-names the rejects: *hands-on effort*, *active time*, *difficulty*.

## 7. Ownership and test surface

The ticket's last criterion: only `src/pages/index.astro`, `src/styles/**`, **new** components
under `src/components/`, tests, and `docs/active/work/T-010-02/**`.

That excludes `src/lib/**`. Every pure module in this repo lives in `src/lib/` with a
`*.test.ts` beside it (12 test files, 935 tests). `src/pages/_search.json.test.ts` is the
precedent for a test that had to live outside `src/lib/` — its header argues *"a test belongs
beside the thing it tests"* and the leading `_` keeps Astro from routing it.

Tests run under `vitest run` with no config file; `npm run verify` = `check && recipes &&
vitest run && astro build`. Nothing in the suite drives a browser — `check-overflow` and
`check-touch` are deliberately outside `verify` because CI may have no Chrome. **Chrome is
present on this machine** and `dist/` is a current build (664 recipes, 688 pages).

## 8. Constraints this ticket inherits, stated plainly

1. The three dial figures already exist in the index; nothing needs deriving.
2. Two of the three dials answer "cannot say" for the majority of the collection (395 and 653).
3. `longestHandsOnMinutes` agrees with `handsOnMinutes` on 91% of recipes and moves 18 of them
   at a 15-minute gate.
4. `slack` is **not in the search index at all** — reaching it would mean editing
   `search.json.ts`, which this ticket may not touch.
5. The URL is currently read-only and no code in the repo writes history state.
6. Only `44rem` and `34rem` may appear in a media query, enforced by a test.
7. Every interactive box must measure ≥44px tall at 375 and 390, enforced by a script.
8. Nothing may scroll `<body>` sideways at 375, 390 or 768.
9. New colours are not available; nine tokens and `color-mix` are.
10. `src/lib/` is out of ownership, so any pure logic must live under `src/components/`.
