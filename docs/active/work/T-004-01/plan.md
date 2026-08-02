# T-004-01 — Plan

Five steps, three commits. Each step ends in something runnable, and the checks land before the
change they exist to catch.

---

## Step 1 — Name the breakpoints in `site.css`

**Edit.** Insert the breakpoint comment block into `src/styles/site.css`, immediately after the
existing opening comment and before `* { box-sizing: border-box; }`.

Contents, per `structure.md` Edit 1: the two names with their literals; the arithmetic that
produces them; the rule that these are the only two width values in the repository; the note that
media queries cannot read custom properties so the literal is repeated at each use site; the
distinction from `max-width` measure caps; the co-location convention for later tickets; and the
licence to delete `snug` if S-004 ends without a user.

**Verify.**

```
npm run verify          # nothing should change — a comment cannot break a build
grep -n "34rem\|44rem" src/styles/site.css
```

Expected: the block plus the untouched `.masthead p { max-width: 34rem }` at what is now a shifted
line number.

**Not committed alone** — it commits with Step 2, because a name with nothing enforcing it is half
a deliverable.

---

## Step 2 — Enforce the vocabulary

**Create** `src/styles/breakpoints.test.ts`.

Implementation notes carried from `structure.md`:

- Collect sources: `src/**/*.css`, and `<style>…</style>` bodies from `src/**/*.astro`. Walk with
  `node:fs` — no glob dependency.
- Parse the allowed set **out of the comment block** rather than hardcoding it, so block and test
  cannot drift. Read the literals from the block's declaration lines.
- Extract media features: for each `@media <condition> {`, pull every
  `(min-width: X)` / `(max-width: X)`. Normalise whitespace, compare as written.
- Three assertions: every extracted value is in the set; every value in the set is used at least
  once; the block declares exactly two values.
- Write the two known blind spots (`@import`, `@media` inside `@supports`) into a comment, with the
  note that neither appears in this repository.

**Verify.**

```
npx vitest run src/styles/breakpoints.test.ts
```

Expected **pass on the unmodified codebase** — this is the real evidence for the acceptance
criterion "the two existing `34rem` queries either use the named set or are updated to". They
already do; the test says so mechanically instead of by assertion.

Then prove the test can fail. Temporarily change `CookModes.astro:951` to `35rem`, re-run, confirm
a failure naming that file and value, revert. A test never seen red is a test not known to work.

**Commit 1** — `src/styles/site.css`, `src/styles/breakpoints.test.ts`.

```
lisa commit-ticket --ticket-id T-004-01 \
  --message "Name the breakpoints, and make a second number fail the build" \
  --include src/styles/site.css --include src/styles/breakpoints.test.ts
```

---

## Step 3 — The no-horizontal-scroll check

**Create** `scripts/check-overflow.mjs`, per `structure.md`: static server, Chrome launcher, CDP
client over node's global `WebSocket`, the probe, argument parsing, and `--shots`.

Points that must not be lost from research, each of which cost a debugging cycle:

1. Re-assert `Emulation.setDeviceMetricsOverride` **after** load and verify against `clientWidth`,
   retrying up to five times. Set before a navigation it is silently dropped, and the page reports a
   980px viewport — which manufactured two phantom overflows in the first baseline run.
2. Fail on **right-edge** escape only. `.skip` sits off-screen left on every page and creates no
   scrollable area; a naive checker reports 682 false positives.
3. Treat an element inside an `overflow-x: auto|scroll|hidden` ancestor as **contained, not
   failing**. That is the pattern S-004 mandates; `espresso-brownies` at 375px has 18 such elements
   and a stationary body.
4. Exit 2 with the manual fallback printed when Chrome is absent, so the script degrades into the
   documented procedure instead of a stack trace.

**Verify.**

```
npm run build
node scripts/check-overflow.mjs --width 375                 # all 682 pages
node scripts/check-overflow.mjs --width 375,390,768 /  /list/  /miso-ramen/
CHROME_BIN=/nonexistent node scripts/check-overflow.mjs     # expect exit 2 + procedure
```

Expected: `682 pages at 375px — 0 with body overflow`, matching the research baseline exactly. If
it does not match, the script is wrong, not the site — the baseline was taken with the same probe.

Then prove *this* check can fail too: add `<div style="width:200vw">x</div>` to a built page in
`dist/` (build output, not source), re-run against that one page, confirm it is reported with the
element named, and rebuild to discard.

**Commit 2** — `scripts/check-overflow.mjs`.

```
lisa commit-ticket --ticket-id T-004-01 \
  --message "Check the whole built site for sideways scroll, with the browser that is already here" \
  --include scripts/check-overflow.mjs
```

---

## Step 4 — The shell at 375px

**Edit** `src/styles/site.css` only — three changes, per `structure.md` Edits 2–4.

1. `.skip` → clip technique; `.skip:focus` restores size and gains `max-width: calc(100% - 2rem)`.
2. Shell narrow block before the page-furniture banner: body padding `1rem → 0.75rem` sides and
   `1.25rem → 1rem` top; `.site-bar a` and `.skip:focus` to a 44px minimum via inline-flex.
3. Page-furniture narrow block before the finder banner: `.masthead h1` to
   `clamp(1.6rem, 7vw, 1.9rem)` with `overflow-wrap: break-word`; `.back` to a 44px minimum.

The finder gets nothing — it measures correct. `.filter` gets nothing — no markup emits it.

**Read** `src/layouts/Base.astro` alongside; expected outcome is that it needs no edit. If it does,
record the deviation in `progress.md` before making it.

**Verify.**

```
npm run verify
node scripts/check-overflow.mjs --width 375,390,768
```

---

## Step 5 — Measure the result, and prove the desktop did not move

Everything here is evidence for a named acceptance criterion. All of it runs against the rebuilt
site.

### 5a — The invariant, whole site

```
node scripts/check-overflow.mjs --width 375
```

Must report 0 of 682. Also run at 390 and 768 on the representative set.

### 5b — Tap targets

Re-run the shell-metrics probe from research (`.site-bar a`, `.skip:focus`, `.search input`,
`.back`, `.masthead h1`) at 375px across `/`, `/list/`, `/menu/bakery/`, `/404.html` and a recipe.

Pass condition, from the acceptance criteria: **every shell and finder control ≥ 44px** —
`.site-bar a`, `.skip:focus`, `.back`, `.search input`. Record measured heights, not assertions.
Controls belonging to other tickets (`AddToPlan`'s 34.7px button, `.chips a`) are recorded as
still-failing and named as theirs, not silently omitted.

### 5c — Headings do not overflow

At 375px assert `h1.scrollWidth <= h1.clientWidth` on the front page, the 404, a menu, and the
longest-titled recipe (`Peanut, Black-Eyed Pea and Chicken Feet Soup`). Record the font size before
and after the step-down.

### 5d — Desktop unchanged, by comparison rather than claim

The method, stated because the criterion demands it:

Before touching any CSS, ten representative pages were rendered full-page at **1440px and 768px**
from the pre-change build and each PNG's SHA-256 recorded — front page, `/list/`, `/404.html`, both
largest menus (Bakery 107, The Bowl Shop 103), a 7-column recipe (`miso-ramen`), a 6-column
(`espresso-brownies`), a slow-cooked one (`beef-rendang`), the deepest tree (`biryani`, 19 rows) and
a 3-column (`aioli`).

After the change, the same ten pages are re-rendered with the same script at the same widths and
the hashes compared. **Identical hashes at 1440px is the pass condition** — pixel identity, not a
judgement call.

768px is captured for information: it sits above both breakpoints so it should also be identical,
and if it is not, a rule is leaking out of its band.

Any hash that differs is investigated element-by-element before being explained; a differing hash
is a failure until shown otherwise.

### 5e — `npm run verify`

Full run, output recorded in `review.md`.

**Commit 3** — `src/styles/site.css`.

```
lisa commit-ticket --ticket-id T-004-01 \
  --message "Make the shell fit a phone: padding, the nav line, the skip link, the heading" \
  --include src/styles/site.css
```

---

## Testing strategy, stated plainly

| criterion | how it is tested | automated? |
| --- | --- | --- |
| breakpoints documented and readable by later tickets | comment block; reviewed | no |
| no third near-duplicate number | `breakpoints.test.ts` | **yes, in `verify`** |
| two existing `34rem` queries comply | same test, passing before any edit | **yes** |
| no horizontal scroll at 375px | `check-overflow.mjs`, all 682 pages | **yes, one command** |
| headings do not overflow | CDP probe, `scrollWidth <= clientWidth` | yes, ad hoc |
| tap targets ≥ 44px | CDP probe, measured heights | yes, ad hoc |
| 1440px unchanged | full-page screenshot SHA-256, before vs after | **yes, exact** |
| `npm run verify` | run it | yes |

Nothing here needs a unit test in the usual sense: the change is CSS, and the honest test of CSS is
a browser measuring it. The one thing that *is* unit-testable — that six tickets write the same two
numbers — gets the one unit test.

## What could go wrong

- **The 1440px hashes differ.** Most likely cause would be a rule escaping its band. The band is
  `max-width: 34rem`, so nothing in Step 4 can fire at 1440px except the unconditional `.skip`
  changes — which is why `.skip` is at rest (clipped, invisible) in any screenshot and why the width
  cap is non-binding at 159px. If hashes differ, the `.skip` rewrite is the first suspect.
- **Font loading makes screenshots non-deterministic.** Lora and Karla come from Google Fonts over
  the network; a headless run without network gets fallbacks. Both before and after runs are offline
  and identical in that respect, so the comparison holds; this is recorded so nobody reads the
  hashes as a claim about the fonted render.
- **The heading clamp steps at the boundary.** Both clamps evaluate to 1.9rem at 544px by
  construction, but it is checked at 543/544/545px rather than assumed.
- **`.skip` clip technique breaks the focus behaviour.** Checked by focusing it in the probe and
  measuring the resulting box, which is how research measured it in the first place.
