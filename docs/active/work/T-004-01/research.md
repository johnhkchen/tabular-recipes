# T-004-01 — Research

What exists, where, and what the numbers actually are. No proposals here.

## 1. How the shell is assembled

`src/layouts/Base.astro` (73 lines) is the only layout. Every page goes through it.

```
<html class="b28-clay">
  <head> … viewport meta present and correct (line 28) … Google Fonts link …
  <body>
    <a class="skip" href="#main">          ← skip link
    <nav class="site-bar" aria-label="Your list">  ← the one piece of furniture
    <main id="main"><slot /></main>
    <script> … paints the plan count beside "Your list" …
```

Two stylesheets, both imported by `Base.astro` in this order:

- `src/styles/b28-clay.css` — the vendored b28 kit. Tokens (`--clay-*`), primitives
  (`.clay-surface`, `.clay-well`, `.clay-button`, `.clay-chip`). One `@media` in it, and it is
  `prefers-reduced-motion`.
- `src/styles/site.css` — 653 lines, this site's own layout, sectioned by comment banners:

  | line | section | owner |
  | --- | --- | --- |
  | 10–44 | reset, `body`, `main`, `.skip`, `.visually-hidden` | **T-004-01** |
  | 46–82 | `.site-bar` | **T-004-01** |
  | 84–126 | page furniture — `.masthead`, `.back`, `.chips` | **T-004-01** |
  | 128–206 | the finder — `.finder`, `.search`, `.filter`, `.tally`, `.nothing` | **T-004-01** |
  | 208–267 | the counters | T-004-03 |
  | 269–385 | one counter's menu | T-004-03 |
  | 387–436 | the recipe page's trimmings | T-004-03 |
  | 438–490 | the shelves | T-004-03 |
  | 492–599 | the table | T-004-02 |
  | 601–614 | the three views and the clock | T-004-04 |
  | 616–653 | the source block, then `@media print` | — |

  The section banners are the de-facto ownership boundary the S-004 tickets are written against,
  and they hold: no selector appears in two sections.

Pages that render the shell furniture this ticket owns:

- `.masthead` — `index.astro:28`, `[slug].astro:53`, `404.astro:7`
- `.back` — `menu/[counter].astro:25` (`← all counters`) — the only use
- `.chips` — `[slug].astro:59`
- `.finder` / `.search` — `index.astro:36` only
- `.site-bar` / `.skip` — every page, via `Base.astro`

## 2. Every width query in the repository

Counted by grep across `src/`, all eleven `@media` blocks:

```
src/styles/b28-clay.css:122   prefers-reduced-motion
src/styles/site.css:637       print
src/components/Timeline.astro:749   forced-colors
src/components/Timeline.astro:760   print
src/components/AddToPlan.astro:100  prefers-reduced-motion
src/components/AddToPlan.astro:107  print
src/pages/list.astro:474      prefers-reduced-motion
src/pages/list.astro:482      print
src/components/CookModes.astro:971  prefers-reduced-motion

src/pages/list.astro:399      (max-width: 34rem)   ← width query
src/components/CookModes.astro:951  (max-width: 34rem)   ← width query
```

**Two width queries. Both `34rem`.** The ticket's count is exact.

Two corrections to the surrounding paperwork, neither load-bearing but both worth recording so a
later ticket does not go hunting:

- **S-004 says `list.astro` has "three width queries" and T-004-05 repeats it.** It has one
  (`:399`). The other two `@media` in that file are `prefers-reduced-motion` and `print`. T-004-05's
  acceptance criterion "the three existing width queries are reconciled" has one query to reconcile.
- **T-004-04 says `CookModes.astro` "has two width queries already (one at `34rem`)".** It has one
  width query; the second `@media` is `prefers-reduced-motion`. Same for `AddToPlan.astro`, which
  the ticket calls "two queries" — both are `prefers-reduced-motion` and `print`, neither is width.

Separately, `34rem` also appears twice as a **`max-width` property**, not a query:
`site.css:96` (`.masthead p`, a measure cap) and `list.astro:129` (`.empty`). These are line-length
limits, not breakpoints. The ticket's pointer to "the finder section (~line 128) — the search box
and its `max-width: 34rem`" is off by one selector: the `34rem` near there is `.masthead p` at :96,
and `.search input` has no max-width at all (it is `width: 100%`).

## 3. The table's real thresholds, recomputed

The ticket gives per-column minimums; what a breakpoint needs is the **viewport** width at which
each stops fitting, which means subtracting the chrome between the viewport and the table.

```
body    padding: clamp(1.25rem, 4vw, 3rem) clamp(1rem, 4vw, 2.5rem) 4rem;   /* side pad */
main    max-width: 54rem;
.table-well  padding: clamp(0.7rem, 1.6vw, 1rem);
.recipe-table min-width: 30rem;
```

Side padding floors at `1rem` and only starts tracking `4vw` above 400px. Solving
`vw − 2·pad_body − 2·pad_well ≥ table_min`:

| columns | recipes | table min | **fits at viewport ≥** |
| --- | --- | --- | --- |
| 3 | 7 | ~21rem | always |
| 4 | 155 | ~25rem | ~28.5rem (456px) |
| **5** | **294** | ~30rem | **~34.1rem (546px)** |
| **6** | **179** | ~35rem | **~39.6rem (633px)** |
| **7** | **23** | ~39.5rem | **~44.5rem (712px)** |

Column histogram verified against the live data (`layout(buildTree(recipe)).colCount` over all 658
recipes): `{3: 7, 4: 155, 5: 294, 6: 179, 7: 23}` — matches S-004 exactly.

The number that matters: **the modal recipe (5 columns, 294 of 658) stops fitting at 34.1rem**, and
`34rem` — the value already in the codebase, chosen before anyone did this arithmetic — is within
0.1rem of it. The widest recipes stop fitting at ~44.5rem.

## 4. What the browser actually reports today

Measured with a headless Chrome driven over CDP from a zero-dependency script
(node 26's built-in `WebSocket`; Chrome already on the machine), serving the real `astro build`
output. Method and script are described in §6.

### The invariant already holds

Swept **all 682 built pages at 375px**: `documentElement.scrollWidth` vs `clientWidth`, plus every
element whose right edge escapes the viewport without an `overflow-x` scroller ancestor.

```
682 pages at 375px — 0 with body overflow
```

This is the single most important research finding and it changes the shape of the ticket. The
story's "a 375px phone hits 105px of sideways scroll" is true **of the table**, and the table
already scrolls inside `.table-scroll` (`overflow-x: auto`, `site.css:502`) exactly as designed. On
`espresso-brownies` at 375px, 18 elements extend past the viewport and **all 18 are inside a
scroller**; the body does not move. So the invariant is not currently broken — it is *undefended*.
Five tickets are about to write narrow-width CSS across five surfaces, and nothing would tell them
if one of them broke it.

One element is reported as escaping on every page: `<a class="skip">` at `-9999..-9872`. That is
**left** overflow, which does not create a scrollable area in LTR — confirmed by `scrollWidth`
staying equal to `clientWidth`. A checker has to distinguish left from right escape or it reports a
false positive on all 682 pages.

### Shell metrics at 375px

`main` measures **343px** (viewport 375 − 2×16px body padding) — so the content box is 21.4rem.

| element | at 375px | ≥44px? |
| --- | --- | --- |
| `.site-bar a` ("Your list") | 53.7 × **24.5px**, font 13.12px | **no** |
| `.skip:focus` | 159 × **43px**, at `left: 16px` | **no**, by 1px |
| `.search input` | 314 × 50.5px, font **16.32px** | yes |
| `.back` (`← all counters`) | inline-block, font 16px, line-height 1.5 → **24px** | **no** |
| `.masthead h1` | font 30.4px, `scrollWidth == clientWidth` (no overflow) | n/a |
| `.clay-button` on `/list/` | 217 × 48px | yes |
| `.clay-button` in `AddToPlan` on a recipe | 158 × **34.7px** | **no** (T-004-04's) |
| `.cell` on `miso-ramen` | 650 × 68.8px | yes |

`.search input` at 16.32px is above the 16px floor that stops iOS zooming a form field on focus.
Anything that steps type down narrow has to leave that input alone.

Body side padding is already at its `1rem` floor at 375px and 390px; the `4vw` term does not
engage until 400px. So "the padding is eating scarce width" is a fixed 32px, not a fluid problem.

### `.filter` renders nowhere

`site.css:154–194` styles `.filters`, `.filter`, `.filter[aria-pressed]`, `.filter .n`,
`.filter--clear` — 41 lines with the comment *"A shelf label you can press. Pressed means showing
only this."* **No markup in the repository emits any of them.** Confirmed by grep across
`src/**/*.astro` and by `document.querySelector('.filter')` returning `null` on the front page.
The finder ships a search input and a tally, and nothing else.

This matters twice: T-004-01's "tap targets in the shell and the finder are at least 44px" has one
finder control to fix (the input, already 50.5px), and T-004-03's "the finder and the shelf labels
… the labels are pressable … at 21 counters plus categories they wrap into a large block" is
describing CSS for a control that is not on the page.

### Desktop baseline captured

Full-page screenshots at **1440px and 768px** for ten representative pages (front page, list, 404,
both largest menus, a 7-column recipe, a 6-column, a 16-row, a deep tree, a 3-column) taken from
the pre-change build, with SHA-256 of each PNG recorded. This is the before side of the
"desktop renders exactly as today" criterion.

## 5. Constraints this ticket is boxed in by

- **File scope is explicit.** Only `Base.astro`, `site.css`, `list.astro` and `CookModes.astro` may
  be *modified*, and in the last two only the query values. That rules out touching `package.json`,
  so **no new dependency is available** — no Playwright, no jsdom, no headless-browser devDependency.
- `npm run verify` = `check-recipes` → `parse-recipes` → `vitest run` → `astro build`. Vitest
  auto-discovers `**/*.test.ts`; the eight existing tests all live in `src/lib/` and are pure
  node — no DOM, no fixtures beyond `src/generated/recipes.json`.
- **Media queries cannot read custom properties.** `@media (max-width: var(--x))` is not valid CSS.
  Any "named" breakpoint set is a name in prose plus a literal at each use site, unless a build step
  is introduced — which the ticket explicitly says is not wanted.
- **Five tickets chain behind this one** on the same stylesheet (T-004-02 → 03 → 04), with T-004-05
  in parallel on `list.astro`. Whatever vocabulary lands here is read four more times.
- The `.skip` link is positioned against the initial containing block (`body` has no `position`),
  so a width cap on it is a cap against the viewport, not against `main`.

## 6. The measurement rig, since a later ticket has to reuse it

T-004-06 must run the no-horizontal-scroll check "across the whole built site rather than a sample",
which rules out a manual procedure at 682 pages. What exists to build on:

- `node -v` → **26.5.0**, which has a global `WebSocket`. That is enough to speak CDP directly.
- Chrome is present at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- Astro's build output in `dist/` is plain static files; a ~40-line `node:http` handler serves them.

Together that is a real-layout, whole-site overflow check with **zero npm dependencies** — which is
what makes it compatible with the frozen `package.json`. It cost ~4 minutes of wall clock to sweep
682 pages once.

What it cannot be is part of `npm run verify`: wiring it in means editing `package.json`, and the
check needs a browser that a CI container may not have.

## 7. Open questions carried into Design

1. One breakpoint or two, and where — the arithmetic in §3 constrains this but does not settle it.
2. Whether the invariant check is a committed script, a vitest test, a documented procedure, or a
   combination — and how any of those survive the frozen `package.json`.
3. Whether dead selectors (`.filter`) get narrow-width rules or a note.
4. Whether `.back`, which is in this ticket's section but renders only on T-004-03's page, is fixed
   here.
