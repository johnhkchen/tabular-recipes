# T-004-01 — Structure

The shape of the change. Two files modified, two created, none deleted.

---

## File-level summary

| file | action | why |
| --- | --- | --- |
| `src/styles/site.css` | **modify** | the breakpoint block, the `.skip` rewrite, two narrow-width blocks |
| `src/layouts/Base.astro` | **read, expected unmodified** | every shell fix lands in CSS; see below |
| `src/pages/list.astro` | **unmodified** | its `34rem` query is already the named breakpoint |
| `src/components/CookModes.astro` | **unmodified** | same |
| `scripts/check-overflow.mjs` | **create** | the no-horizontal-scroll invariant, whole-site |
| `src/styles/breakpoints.test.ts` | **create** | one-vocabulary enforcement, rides `npm run verify` |

### On `Base.astro`

The ticket lists it as modifiable and its markup is the shell, so it is read carefully — but every
defect research found (`.site-bar a` height, `.skip` height, body padding, heading scale) is a CSS
property on an element that already exists with the right structure and the right ARIA. Adding
markup to Base.astro to solve a padding problem would be the wrong file. **The plan is that it ends
up unmodified**, and if implementation proves otherwise the deviation goes in `progress.md`.

`Base.astro:28` already carries `<meta name="viewport" content="width=device-width, initial-scale=1">`,
verified correct. There is no missing-tag bug to fix.

### On the two created files

The acceptance criteria say "only … are **modified**". Both new files are creations, and the ticket
body explicitly instructs "**Add whatever check makes this testable**" — a check cannot be added
without a file to add it to. Neither file is imported by the site: `astro build` does not see them,
the bundle does not change, and deleting both would leave the rendered site byte-identical. This
reading is stated again in `review.md` so a reviewer can overrule it cheaply.

---

## `src/styles/site.css` — the four edits, in order

### Edit 1 — the breakpoint block (new, ~28 lines, inserted after the opening comment)

Placed immediately after the existing file-opening comment (the one about the table being the whole
point) and before `* { box-sizing: border-box; }` — inside the first 40 lines, which is what "the
top of the file" has to mean for a reader who opens it and skims.

It carries, in this order:

1. **The two names and their literals**, wide → snug → narrow.
2. **The arithmetic**, so the numbers are defensible rather than inherited: the per-column table
   minimums, the padding subtracted, and the viewport widths that fall out (34.1rem, 39.6rem,
   44.5rem).
3. **The rule for later tickets** — these two values, no others; media queries cannot take custom
   properties, so the literal is written at each use site and this block is the source of truth.
4. **The distinction from measure caps** — `max-width: 34rem` on `.masthead p` is a line-length
   limit, not a breakpoint, and must not be "reconciled" into a query.
5. **The co-location convention** (below).
6. **A licence to delete `snug`** if S-004 ends without a user, so removing it is a housekeeping
   task rather than an argument.

### Edit 2 — `.skip` (lines 23–35), rewritten

From the off-screen-position technique to the clip technique already used two rules below it by
`.visually-hidden`:

```
.skip            position absolute, 1×1px, overflow hidden, clip-path inset(50%)
.skip:focus      restores size and clip; keeps left/top 1rem, z-index, padding, clay surface
                 + min-height 44px, inline-flex centred        ← narrow band only
                 + max-width: calc(100% - 2rem)                ← unconditional
```

Two reasons, both from research. `left: -9999px` puts a 9999px-wide element on every page; in LTR
that creates no scrollable area, but it means the overflow checker reports an escaping element on
all 682 pages and has to special-case it to stay readable. And the width cap is the one guard that
cannot live in a media query — a label too long for its line overflows at every width or none, so
capping it narrow-only would not catch it.

The cap is `calc(100% - 2rem)` against the **initial containing block**: `body` has no `position`,
so `100%` here is the viewport, not `main`. Measured link width is 159px, so the cap binds nothing
today at any width — it is a floor under a future change, and it leaves the 1440px render identical.

### Edit 3 — the shell's narrow block

Inserted at the end of the `.site-bar` region, immediately before the `/* ---- page furniture ---- */`
banner. Covers the three shell selectors that live above that banner:

```
@media (max-width: 34rem) {          /* narrow */
  body            side padding 1rem → 0.75rem, top 1.25rem → 1rem
  .site-bar a     inline-flex, align-items centre, min-height 44px, wider hit area
  .skip:focus     inline-flex, align-items centre, min-height 44px
}
```

Body side padding is at its `1rem` floor from 0 to 400px — the `4vw` term does not engage below
400px — so this is a flat 8px of content returned at 375px and 390px, and nothing above 544px.

### Edit 4 — the page-furniture narrow block

Inserted at the end of the page-furniture section, immediately before the `/* ---- the finder ---- */`
banner:

```
@media (max-width: 34rem) {          /* narrow */
  .masthead h1    font-size: clamp(1.6rem, 7vw, 1.9rem)
                  overflow-wrap: break-word
  .back           inline-flex, align-items centre, min-height 44px
}
```

The clamp is continuous with the unqueried `clamp(1.9rem, 4.5vw, 2.6rem)`: at the 544px boundary
both evaluate to 1.9rem, so there is no step at the breakpoint. At 375px it yields 1.64rem.

`overflow-wrap: break-word` is inside the band rather than global so the 1440px render is provably
untouched; it acts only when a word would otherwise overflow, which nothing in the corpus does
today (longest unbreakable word: `Snickerdoodles`).

**The finder gets no rules.** Measured at 375px, the search input is 50.5px tall with a 16.32px
font — above the 44px tap floor and above the 16px floor below which iOS zooms a focused field.
Adding rules to a section that measures correct would be motion, not work. `.filter` (41 lines,
`site.css:154–194`) is styled but emitted by no markup; it gets no rules either, and is reported to
T-004-03.

### Two `@media` blocks in one file, on purpose

The alternative — one narrow block at the bottom of `site.css` that every ticket appends to — turns
that block into a shared write target for five chained tickets, and destroys the section-ownership
model that T-004-02, -03 and -04 are scoped against (their tickets name sections by line number).
Co-locating each narrow block with the section it modifies keeps every ticket's diff inside its own
region. The cost is a few duplicated `@media` lines and no runtime cost at all. The convention is
written into the breakpoint block so the next four tickets follow it rather than rediscover it.

---

## `scripts/check-overflow.mjs` — new, ~180 lines, zero dependencies

Named to match `scripts/check-recipes.mjs`, the existing "say what is wrong, write nothing" script.

### Interface

```
node scripts/check-overflow.mjs [--root dist] [--width 375,390,768] [--shots <dir>] [path…]
```

- exit **0** — every page measured, none overflows
- exit **1** — at least one page overflows; each is printed with the offending elements
- exit **2** — Chrome not found, or the build directory is missing; prints the manual procedure

`CHROME_BIN` overrides the Chrome path. `path…` limits the sweep to named routes; with none, it
walks every `*.html` under `--root` except `_astro/`.

### Internal shape

Four parts, in one file because it has no importers:

1. **`serve(root)`** — a `node:http` static handler over the build output. Directory requests and
   extensionless requests both resolve to `index.html`, matching `trailingSlash: 'always'` and
   `build.format: 'directory'` from `astro.config.mjs`.
2. **`launchChrome()`** — spawns headless Chrome on an ephemeral debugging port with a throwaway
   profile and `--hide-scrollbars`, and reads the `ws://` URL off stderr.
3. **`Cdp`** — a ~40-line client over node's global `WebSocket` (node ≥ 22). Request/response by
   id, event fan-out by method. This is the whole reason no dependency is needed.
4. **The probe** — one `Runtime.evaluate` per page returning:
   - `documentElement.scrollWidth` vs `clientWidth` — the invariant itself
   - every element whose right edge passes the viewport, each tagged with the nearest ancestor
     whose computed `overflow-x` is `auto`/`scroll`/`hidden`
   - elements escaping **left**, counted separately and never failing the run

**A page fails only when the document actually scrolls, or an element passes the right edge with no
scroller above it.** Both halves are needed: `scrollWidth` alone does not say which element did it,
and the element walk alone would flag the table, which is contained and correct.

The viewport override is re-asserted after load and verified against `clientWidth`, with up to five
attempts. Research hit this: `Emulation.setDeviceMetricsOverride` issued before a navigation is
silently dropped on some pages, which reported a 980px viewport and two phantom overflows.

`--shots <dir>` writes a full-page PNG per page/width plus a `hashes.txt` manifest of SHA-256 per
file. That is the before/after mechanism T-004-06 needs for "desktop rendering at 1440px is
demonstrably unchanged, by a stated method", and it costs about twenty lines here versus rebuilding
the rig there.

### Why it is not in `npm run verify`

Two reasons, both in the file header: wiring it in edits `package.json`, which this ticket may not
do; and it needs a browser that CI may not have. `verify` keeps `breakpoints.test.ts`, which is pure
node. Handing the wiring to T-004-06 — the one ticket allowed to edit any file — is recorded as an
open item in `review.md`.

---

## `src/styles/breakpoints.test.ts` — new, ~70 lines

Placed beside the file it tests rather than in `src/lib/`, which holds tests for modules; this tests
a stylesheet. Vitest's default discovery (`**/*.test.ts`) picks it up with no config change, and
Astro never routes it because only `src/pages/` produces routes.

### What it asserts

1. **Every width media feature in the repository uses a named value.** Sources: `src/**/*.css` plus
   the `<style>` blocks of `src/**/*.astro`. It extracts `(min-width: …)` / `(max-width: …)` from
   `@media` conditions only — width values in ordinary declarations (`.recipe-table { min-width:
   30rem }`, the `34rem` measure caps) are not media features and are not its business.
2. **Both named values are still used at least once**, so a dead name in the comment block is a test
   failure rather than rot.
3. **The comment block still declares exactly the values the test enforces** — the test parses the
   names out of `site.css` instead of hardcoding them twice, so the block and the check cannot
   drift.

Failure messages name the file, the offending value, and point at the block.

`src/styles/b28-clay.css` is included in the scan even though it is vendored (`just sync-kit`
overwrites it). It has no width query today; if a kit sync introduces one, that is a second
vocabulary arriving in the codebase and stopping the build is the correct response. The failure
message says so and names the escape hatch.

Regex, not a parser: `parse5` exists in `node_modules` only as a transitive Astro dependency, and
reaching for it would be a dependency in all but name. The scan's two blind spots — `@import` and
`@media` nested inside `@supports` — are written into the file, and neither appears anywhere in the
repository.

---

## Ordering

The edits are independent except that the test reads the comment block, so:

1. `site.css` breakpoint block (Edit 1) — nothing else can be checked until the names exist
2. `src/styles/breakpoints.test.ts` — proves the two existing queries already comply, before any
   CSS moves
3. `scripts/check-overflow.mjs` — re-establishes the 682-page baseline as a committed tool
4. `site.css` edits 2–4 — the shell
5. Re-measure: 682-page sweep, tap targets, 1440px screenshot comparison against the baseline

Steps 2 and 3 land before step 4 deliberately: a check written after the change it is meant to
catch is a check fitted to its own answer.
