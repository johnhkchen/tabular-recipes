# T-004-06 — Design

Seven decisions. Six of them are "fix it here or write it down honestly", and the seventh is the
one four tickets asked this one to make.

The governing tension: this ticket has the widest file scope in S-004 (**any file**) and the
narrowest mandate (**read the whole site, catch what no single ticket could see, verify**). A
ticket with permission to edit everything and an appetite for tidying can quietly become a
sixth implementation ticket with no review behind it. So the rule below is applied to every
candidate change:

> **Change it if a criterion names it. Otherwise write it down, ranked, and say what it would
> cost.** `docs/gaps/mobile.md` is a deliverable, not a consolation prize.

---

## 1. The regression net — the decision four tickets deferred

T-004-01, ‑02, ‑03 and ‑05 each measured their own result with a throwaway rig, each deleted it,
and each wrote the same sentence: nothing in the repository would notice if a later edit undid
the work. `package.json` was nobody's file until now.

### Options

| | approach | verdict |
| --- | --- | --- |
| A | leave it: the sweep stays a command run deliberately | rejected — four tickets asked, and this one's own criterion is "tap targets ≥44px on **every** interactive element", which no sample can support |
| B | a vitest DOM test (jsdom / happy-dom) | **rejected on capability, not taste.** jsdom does not lay out. `getBoundingClientRect()` returns zeroes, so it cannot assert 44px, cannot resolve `position: sticky`, cannot see a media query bind. It would be a dependency that proves nothing |
| C | a second committed browser check, wired to a **new** npm script beside `verify` | **chosen** |
| D | put the browser leg inside `npm run verify` | rejected — `verify` must run on a machine without Chrome. Today it does; making it browser-dependent would trade a real guarantee for a conditional one |

### What C looks like

`scripts/check-touch.mjs`, run over the **whole build** at 375px and 390px, asserting the three
things T-004-02 named plus the one this ticket's criteria name:

1. every visible interactive element is ≥44px tall;
2. `data-more` is set exactly when `.table-scroll` actually overflows;
3. `.cell--ingredient` computes `sticky` below 44rem and `static` above it;
4. the shortest rendered `<td class="cell">` is ≥44px.

`package.json` gains one line:

```
"verify:mobile": "npm run build && node scripts/check-overflow.mjs --width 375,390,768 && node scripts/check-touch.mjs"
```

`verify` itself is **not** changed. Stated plainly so nobody reads this as the browser leg
landing in CI: it is a second command, and the reason it is not the first is that a check which
cannot run is worse than a check that has to be asked for.

### The plumbing question

`check-overflow.mjs` already contains ~120 lines of static file server, Chrome launcher and CDP
client. A self-contained second script would duplicate all of it.

**Chosen:** extract the plumbing to `scripts/browser.mjs` and have both import it.
`check-overflow.mjs` keeps its CLI, its `PROBE`, its `BY_HAND` text and its exit codes unchanged.

The risk is real — this is the one tool the whole story leans on — and it is bought off cheaply:
the full 2046-page sweep is re-run after the extraction and must report the same result it
reports today. A refactor with a 2046-case regression test behind it is not a gamble.

### The build-under-the-sweep guard

Two tickets recorded a one-page false positive from running the sweep while `astro build` was
rewriting `dist/`. A page served without its stylesheet has no `overflow-x: auto` anywhere and
reads as an overflow that is not there.

`browser.mjs` records the newest mtime under the served root before the run and re-checks it
after. If the build moved, the run says so and exits 2 (*could not look*) rather than 1
(*something scrolls*). Cheap, no dependency, and it turns a confusing failure into an accurate
one.

---

## 2. The three tap targets under 44px

All three are named by the criterion "Tap targets are ≥44px on every interactive element: table
cells, shelf labels, tick-offs, the view toggle, the plan button." The criterion's list is
examples, not a ceiling — a 24px control on a phone fails it whether or not it is enumerated.

| element | measured | fix | why this shape |
| --- | --- | --- | --- |
| `.source summary` | 24px, on all 658 recipe pages | block padding at `narrow`, `min-height: 44px` behind it | `<summary>` needs `display: list-item` to keep its disclosure marker, so `inline-flex` is out. Padding grows the box the way T-004-05 grew `.tick`, and the min-height stands behind it so the number does not depend on the loaded font |
| `.clay-button` | 41.4px, the 404 page's only control | `min-height: 44px` + `inline-flex` centring at `narrow`, in `site.css` | the kit is **vendored** from b28.dev (`breakpoints.test.ts` says so in its own failure message), so the rule belongs in the site, not in `b28-clay.css`. Value matches the 2.75rem `AddToPlan` and `CookModes` already set locally, so nothing fights |
| `.planned h3 a` | 22px, one per planned recipe on `/list/` | `inline-flex` + `min-height: 44px` at `narrow` | same shape `site.css` uses for `.site-bar a`, `.back` and `.to-list`. It is the way back from the list to the recipe, and it is the last control on that page still sized for a mouse |

Rejected for `.clay-button`: editing `b28-clay.css`. It is a vendored copy of a shared kit; a
local edit is lost at the next `just sync-kit` and desynchronises three other frontends. If the
kit should carry a touch floor, that is a change at b28.dev — noted in the gaps file.

---

## 3. The variant links, 6.6px apart

Both are 44px tall. Neither is a criterion violation. Together they are a mis-tap: two adjacent
targets on one line with 6.6px between them, and the two of them are *Instant Pot* and *Slow
Cooker* — the switch that decides which recipe you are about to cook.

### Options

| | approach | verdict |
| --- | --- | --- |
| A | turn the sentence into a list in `[slug].astro` | **rejected.** It changes the desktop rendering, and criterion 4 says a 1440px window must render exactly as it did before T-004-01. T-004-03 named this fix; it did not know it collides with this ticket's own criterion |
| B | `margin-inline` on `.variants a` at narrow | rejected — margin before the link pushes the comma with it and prints "Instant Pot , Slow Cooker" |
| C | `margin-inline-start` on `.variants a + a` at narrow | **chosen** |
| D | leave it, record only | rejected — C costs three lines and no markup |

C works because the separator is a text node: `a + a` still matches across it, so the margin
lands *after* the comma, where a space already is. `1.1rem` takes the gap from 6.6px to 24.2px,
which is the spacing figure WCAG 2.2's target-size criterion is written around. On a page where
the two links wrap to separate lines it costs nothing at all, and above 34rem the rule does not
exist.

It is a mitigation, not the cure — the cure is a list, and the list is in the gaps file with the
reason it was not built here.

---

## 4. One vocabulary — and the one disagreement in it

The codebase writes two numbers and only two: `34rem` and `44rem`. `breakpoints.test.ts` passes,
so there is no near-duplicate to hunt. **No two tickets disagree about a value.**

What does disagree is `site.css`'s prose and the browser. The block calls `44rem` "the widest
recipes have stopped fitting" and derives it at 44.5rem. Measured, the widest recipes stop
fitting at **736px ≈ 46rem**; between 705px and 735px they scroll up to 14px with the ingredient
column no longer pinned.

### Options

| | approach | verdict |
| --- | --- | --- |
| A | move `snug` to `46rem` | rejected. It recovers ≤14px of unpinned scroll and, in exchange, applies the phone cell floor (`height: 2.75rem`) and the pinned column to a 736px window — restyling a 32px band that no ticket has read for legibility. It also changes rendering above 704px, which is not where any of this story's evidence was gathered |
| B | keep `44rem`, correct the prose to the measured figure, record the band | **chosen** |
| C | a third breakpoint | rejected — T-004-01's block forbids it, and a 32px band is not worth a name |

**Kept: `44rem`.** The resolution is recorded in the block itself, next to the arithmetic it
corrects, so the next reader finds the measured number rather than the predicted one — which is
exactly what T-004-03's fourth commit did for its own comments.

The six `@container` thresholds in `Timeline.astro` are **not** a second vocabulary. A container
query measures an element's own inline size, not the window; they can no more be one of two
viewport breakpoints than `.masthead p { max-width: 34rem }` can. Said here because "one
vocabulary" invites the wrong grep.

---

## 5. Desktop unchanged — the method, chosen before the result is known

The claim is stronger than any prior ticket's: not "my rules did not leak" but "**the whole
story** changed nothing at 1440px". That needs the state before T-004-01, which is commit
`02b65e8`.

**Method.** Build `02b65e8` in a detached git worktree to its own `dist/`; build `HEAD` to the
working `dist/`; render the same twelve pages full-page at **1440px and 768px** with
`check-overflow.mjs --shots`; compare SHA-256 per file. Same tool both sides, both runs offline,
so the fallback fonts match and the comparison is about layout rather than about a fonted render.

768px is in the set on purpose: it is above both breakpoints, so a rule leaking out of its band
shows up there and nowhere else.

**Twelve pages:** the front door, `/list/`, `/404.html`, Bakery, The Bowl Shop, a 7-column
(`miso-ramen`), a 6-column (`beef-stew-slow-cooker`), a 5-column (`tonkotsu-broth`), a 4-column
(`conchas`), the deepest tree (`biryani`, 20 rows), a variant page (`boston-baked-beans`) and a
long one (`pastrami`).

**The one place identity is not expected, stated in advance.** `/list/` renders from
`localStorage`, so a screenshot of it is the empty state on both sides and proves only that the
empty state is unchanged. The *populated* list did change on the desktop — T-004-05 moved the
as-it's-sold name to the front of every line at every width, and filed a `note` disposition
saying so, which is on the board now. This ticket measures the populated list at 1440px on both
sides and reports the difference rather than hiding behind an empty page. A criterion that reads
"exactly as before" is met by every surface except the one where a completed ticket deliberately
and visibly did otherwise, with the operator already informed.

---

## 6. What is deliberately not fixed

Each of these is a real defect, each is cheap, and each is recorded in `docs/gaps/mobile.md`
instead of being changed. The reason is the rule at the top: a verification ticket that starts
rewriting surfaces other tickets owned produces changes with no design behind them.

**"Press `/` to search 658 recipes"** — a keyboard shortcut offered to a phone, on the front
door. T-004-01 owned the shell and the finder, found this, and chose to record it as copy rather
than layout. Fixing it means splitting the sentence in the markup *and* in the script that
rewrites it when the query clears, and choosing new words for a front-page line — a brand-voice
decision that deserves its own ticket rather than a paragraph in this one's diff. Ranked in the
gaps file.

**63 lines of dead stylesheet** — `.filters` / `.filter` / `.filter--clear` (`site.css:261–301`)
and `.shelf-group` (`site.css:662–683`) style markup no page emits. Deleting them is provably
render-neutral and would shave the stylesheet every phone downloads. Not deleted here, because
the choice is not "delete or keep" but "**does the front door get a filter row?**" — a product
question. Deleting the CSS silently answers it. The gaps file states the line ranges and both
options so the next person makes one decision instead of two.

**Tablets in portrait get the mouse drawing.** At 768px every touch rule is off: `.site-bar a`
24.5px, `.chips a` 15px, `.mode` 40px, `label.tick` 42.8px. This is the **top-ranked** gap. It is
not a bug in any ticket — S-004 chose width as the axis, and T-004-05 rejected
`@media (pointer: coarse)` for good reasons it wrote down. Changing the axis is a story-level
decision, and this ticket recording it is exactly what the ranked list is for.

**The clock at an extreme ratio.** `pastrami` draws one 286px bar and three 11px slivers at
375px, and still does at 768px, so it is a ratio problem rather than a width one. Every row
prints its own duration underneath, which is the mitigation and is honest. In the gaps file as a
"real, and not solved" item, the way the ticket asks for the 7-column table to be described.

---

## 7. `docs/gaps/mobile.md` — what shape it takes

`docs/gaps/` already holds twenty-one files, one per counter, plus a README. This is the first
that is not about a counter, so it says at the top what kind of document it is.

Ranked by **how much it costs a person holding a phone**, not by how hard it is to fix, with
each entry carrying: what happens, where, measured, what it would take, and whether it is a
mitigation or a cure. The ticket asks for honesty about the 7-column table specifically — that
the sticky column is a mitigation and not a cure — so every entry is written to that standard.
