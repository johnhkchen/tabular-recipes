# T-004-01 — Design

Four decisions: how many breakpoints and where, how they are written down, how the
no-horizontal-scroll invariant is proved, and what the shell actually changes.

---

## Decision 1 — Two breakpoints: `snug` at 44rem, `narrow` at 34rem

### The options

**(a) One breakpoint, 34rem.** Keep exactly what exists. Zero churn, both existing queries already
comply, nothing to reconcile.

**(b) Two: 34rem and 44rem.** A phone band and a band where the widest tables have started to
scroll but the shell is still roomy.

**(c) Two: 34rem and 40rem.** Same shape, second breakpoint at the 6-column threshold instead of
the 7-column one.

**(d) Three or more** — a conventional 480/768/1024 ladder.

### Against the research

§3 of `research.md` computes the viewport width at which each table size stops fitting, after
subtracting body padding and `.table-well` padding:

| columns | recipes | fits at viewport ≥ |
| --- | --- | --- |
| 5 | **294** | **34.1rem** |
| 6 | 179 | 39.6rem |
| 7 | 23 | 44.5rem |

`34rem` lands within 0.1rem of the width where the *modal* recipe stops fitting. The ticket's
instruction — "if a breakpoint can be placed so that the common cases change behaviour at the
width where they actually stop fitting, place it there" — is already satisfied by the number in
the codebase. Nobody derived it that way; it is a coincidence worth keeping rather than a number
worth moving. Moving it would mean editing both existing queries, re-testing two surfaces this
ticket does not own, and gaining nothing.

**(d) is rejected outright.** A 480/768/1024 ladder is a convention imported from elsewhere; none
of those three numbers corresponds to anything this site does. 768px in particular is *above* every
threshold in the table — a 7-column recipe fits comfortably at 768px — so a breakpoint there would
fire where nothing is wrong.

**(a) vs (b)/(c) is the real question.** One breakpoint leaves the band from 34rem to 44.5rem with
no rules at all, and that band is where **202 recipes (6- and 7-column, 31% of the site)** overflow
their container while the shell is still comfortable. Five tickets are queued behind this one; if
T-004-02 wants to tighten cell padding before the phone band — which is exactly the "tighter
metrics at narrow widths" its ticket asks for — and no second name exists, it invents a number.
That is precisely the "third number that means almost the same as 34rem" this ticket is written to
prevent. Declaring the number now, derived, is cheaper than adjudicating it later.

**(b) over (c).** 40rem is the 6-column threshold; 44rem is the 7-column one, i.e. the earliest
width at which *anything on the site* has stopped fitting. A band that opens the moment the first
recipe overflows is easier to reason about than one that opens partway through. 44.5rem rounds down
to 44rem so the rules engage slightly before the problem rather than slightly after. And 44rem is
10rem clear of 34rem — not a near-duplicate by any reading.

### Chosen

```
snug    ≤ 44rem  (704px)   the widest recipes' tables have stopped fitting
narrow  ≤ 34rem  (544px)   the common recipe's table has stopped fitting, and the shell is cramped
```

Three bands, wide → snug → narrow. The names are plain and ordered; a reader who sees
`@media (max-width: 34rem)` and goes looking finds "narrow" and knows which band they are in.

Honest caveat, recorded rather than buried: **this ticket writes rules at `narrow` only.** The
shell is not cramped at 704px and inventing shell rules to justify the name would be worse than
leaving it unused. `snug` is declared with its arithmetic so that T-004-02 and T-004-04 have the
number ready. If S-004 finishes and nothing has used it, T-004-06 should delete it — that
instruction goes in the comment block itself so the deletion is licensed rather than debated.

### What is *not* a breakpoint

`site.css:96` (`.masthead p { max-width: 34rem }`) and `list.astro:129` (`.empty`) hold `34rem` as
a **measure cap** — the width past which a line of prose gets hard to track back to. Same number,
different job, and it binds at 1440px where the breakpoint never fires. These are left alone and
the comment block says why, so a later ticket does not "reconcile" a line-length limit into a
media query.

---

## Decision 2 — The set lives in a comment block, and a test enforces it

Media queries cannot read custom properties: `@media (max-width: var(--narrow))` is not valid CSS.
So a "named" set is a name in prose plus a literal at each use site, unless a build step is
introduced — and the ticket says explicitly that it should not be.

### Options

**(a) Comment block only.** What the ticket asks for. Costs nothing. Enforced by reviewers
remembering.

**(b) Comment block plus custom properties** (`--bp-narrow: 34rem`) usable in `calc()`/`clamp()`
even though not in `@media`. Rejected: the ticket says custom properties only "if the design finds
a reason", and no rule in this ticket needs the value arithmetically. Two places to change one
number, for nothing.

**(c) Comment block plus a test that reads the CSS and fails on any other width value.**

### Chosen: (c)

The acceptance criterion is "**no third near-duplicate number is left in the codebase**" — a
statement about a whole repository across six tickets. A comment can request that; only a test can
hold it. The test is ~60 lines of node, no dependencies, and rides `npm run verify` for free
because vitest already auto-discovers `**/*.test.ts`.

It scans every file that can carry CSS — `src/**/*.css` and the `<style>` blocks in
`src/**/*.astro` — extracts every `min-width`/`max-width` **media feature**, and asserts each value
is `34rem` or `44rem`. Width values in ordinary declarations are untouched, so `min-width: 4.75rem`
on a table cell and the `34rem` measure caps are not its business.

Deliberately a regex scan and not a parser: `parse5` is in `node_modules` only as a transitive
Astro dependency and depending on it would be a dependency in all but name. The scan's limits
(it does not understand `@supports` nesting or `@import`) are written into the test file, and
neither construct appears in the repository.

The test also asserts the two named values still appear at least once — so if a later ticket
deletes the last user of `snug`, the test says so rather than letting a dead name rot in a comment.

---

## Decision 3 — The invariant is a real-browser sweep, committed as a script

The ticket offers two shapes: "a test that builds a page and asserts no element exceeds the
viewport at 375px", or "a documented manual procedure … if that is disproportionate. Say which you
chose and why."

### The constraint that decides it

The acceptance criteria freeze the file list, which freezes `package.json`. **No new dependency is
available** — no Playwright, no Puppeteer, no jsdom. And jsdom would not help regardless: it has no
layout engine, so `getBoundingClientRect()` returns zeros and the question "does anything exceed
the viewport" is unanswerable in it. Real overflow needs real layout.

### Options

**(a) Manual procedure only.** T-004-06 is required to run this check "across the whole built site
rather than a sample". At 682 pages a manual procedure is not a procedure, it is a wish.

**(b) A vitest test that scans built HTML/CSS heuristically** — flag `width: 100vw`, `min-width`
above the narrow content budget, and so on. Runs in `verify`, but it does not measure anything. It
would pass a page that overflows for a reason it does not model, and fail honest CSS that is
contained. False confidence is worse than none for an invariant this load-bearing.

**(c) Drive the already-installed Chrome over CDP from a zero-dependency script.**

### Chosen: (c), plus a written procedure for the case where Chrome is absent

Research proved this works: node 26 ships a global `WebSocket`, which is enough to speak the DevTools
protocol directly; a ~40-line `node:http` handler serves `dist/`; Chrome is at a known path and
`CHROME_BIN` overrides it. The sweep of all 682 pages at 375px took about four minutes and reported
`0 with body overflow`.

It ships as **`scripts/check-overflow.mjs`**, matching the existing `scripts/check-recipes.mjs`
convention, and is run as `node scripts/check-overflow.mjs` with `--width` and page-glob arguments.

**It is not wired into `npm run verify`**, for two reasons, both stated in the script's header:
wiring it in means editing `package.json`, which this ticket may not do; and it needs a browser that
a CI container may not have. `verify` keeps the breakpoint test (Decision 2), which is pure node.
This is the one place the ticket's file-scope constraint costs something real, and it is recorded in
`review.md` as an open item for T-004-06, which *may* edit any file.

Two details the research forced:

- **Left overflow is not overflow.** `.skip` sits at `left: -9999px` on every page. In LTR that
  creates no scrollable area — confirmed by `scrollWidth == clientWidth` on all 682 pages. A checker
  that flags any escaping element reports 682 false positives. It flags right-edge escape only, and
  reports left-edge escape separately as information.
- **An element past the viewport inside an `overflow-x` scroller is correct, not a fault.** That is
  the pattern S-004 mandates and the table already uses. The checker walks ancestors for
  `overflow-x: auto|scroll|hidden` and counts those as contained. On `espresso-brownies` at 375px,
  18 elements are past the edge and all 18 are contained.

### Rejected: hiding the failure

`body { overflow-x: clip }` would make the invariant true by construction and is exactly the wrong
move — it converts "one element is too wide" from a visible bug into an invisible one, and makes
the checker useless for the five tickets that follow. Not used.

---

## Decision 4 — What the shell changes, and what it does not

Research measured the shell rather than assuming it, and the results reorder the ticket's own list.

### Not broken, left alone

- **The body does not horizontally scroll at 375px, on any of 682 pages.** The story's "105px of
  sideways scroll" is the table scrolling inside `.table-scroll`, working as designed. So this
  ticket **defends** the invariant rather than fixing it. That is stated plainly rather than
  claimed as a fix.
- **`.search input`** is 50.5px tall at 375px and its font is 16.32px — over the 16px floor below
  which iOS zooms a focused field. Both already correct; anything that steps type down must not
  touch it.
- **`.masthead h1`** does not overflow its line at 375px (`scrollWidth == clientWidth`). The longest
  unbreakable word in the corpus is `Snickerdoodles`.
- **The card grids** (`repeat(auto-fill, minmax(…))`) collapse correctly. Not this ticket's, and
  not broken.

### Broken, and fixed here

| what | measured at 375px | fix |
| --- | --- | --- |
| `.site-bar a` | 24.5px tall | 44px minimum in the `narrow` band |
| `.skip:focus` | 43px tall | 44px minimum, plus an unconditional width cap |
| `.back` | 24px tall | 44px minimum in the `narrow` band |
| body side padding | 16px, at its floor | 12px in the `narrow` band — 8px of content back |
| `.masthead h1` | 30.4px flat, no step-down | fluid step-down inside the `narrow` band |

The width cap on `.skip` is the one unconditional change: `max-width: calc(100% - 2rem)` against
the initial containing block. It binds nothing at any width the site is used at — the link measures
159px — and exists so a future translation or a longer label cannot push the body sideways from a
focus state that no screenshot test will ever catch. Rules that only fire narrow cannot cover it,
because a long label overflows at every width or none.

Type: only the display heading steps down, via `clamp(1.6rem, 7vw, 1.9rem)` inside the narrow band.
It is continuous with the existing `clamp(1.9rem, 4.5vw, 2.6rem)` at the 34rem boundary — both
evaluate to 1.9rem at 544px — so there is no visible jump. **Base body type stays at 16px**;
stepping it down is how a phone layout becomes unreadable rather than compact, and it would drag
the search input under the iOS zoom floor with it.

### Found broken, deliberately not fixed here

- **`.filter` renders nowhere.** 41 lines of `site.css` style a pressable shelf label that no markup
  emits — confirmed by grep and by `querySelector('.filter') === null` on the front page. Adding
  narrow-width rules to a selector with no markup produces a rule nobody can verify. It is reported
  to T-004-03, whose ticket describes those labels as an existing problem.
- **`.chips a`** is a tap target under 44px, but its link styling lives at `site.css:410`, inside
  T-004-03's "recipe page's trimmings" section, and the chips render only on `[slug].astro`. Split
  ownership; leaving it whole for one ticket beats two tickets each doing half.
- **`AddToPlan`'s button** measures 34.7px on a recipe page. That is T-004-04's file by name.
- **`.tally` reads "Press `/` to search"** — a keyboard hint on a device with no keyboard. Copy, not
  layout, and not in this ticket's scope. Reported.

### The two existing 34rem queries

They are already the `narrow` breakpoint. `list.astro:399` and `CookModes.astro:951` therefore need
**no edit at all** — the reconciliation criterion is met by declaring the set to match them, not by
rewriting them. This is the outcome the acceptance criterion's "either use the named set **or** are
updated to" allows for, and the enforcement test proves it mechanically rather than by assertion.
Two files stay out of the diff.

---

## Consequences

- Downstream tickets get two numbers, a comment block that explains both, and a test that fails if
  they write a third.
- The invariant becomes checkable across the whole site in one command, which is what T-004-06 was
  promised.
- `npm run verify` gains one pure-node test and no dependencies.
- The shell's four failing tap targets become compliant at phone widths and unchanged at desktop.
- Files modified: **two** (`site.css`, and `Base.astro` only if the markup needs it — see
  `structure.md`). Files created: two.
