# T-011-06 — Research

What exists, where, and how it connects. No proposals here.

Measured against the working tree at `c2f97b7`, **685 recipes**, node v24.18.1 (`nvm`; not on the
default `PATH` in this shell — every command below was run with
`PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"`).

---

## 1. The three things this ticket sits on top of

| Dependency | Landed as | What it left behind |
| --- | --- | --- |
| T-010-02 | done | `src/components/dials.ts`, the three dials on `index.astro`, the URL codec, the cannot-say shelf |
| T-011-02 | done | `src/lib/scaling.ts` — `readCapacity`, `servingsOf`, `boundSteps`, `costOf` |
| T-011-03 | done | `>> capacity:` on **46** files |
| T-011-04 | done (**not cut**) | `src/lib/keeps.ts` — `readKeeps`, `NOT_AT_ALL`, `keepsWord`; `>> keeps:` on **138** files |

T-011-04 shipped, so the ticket's *"if that ticket was cut, say so on the page"* branch does not
apply. The days setting has a real field to filter on for 138 of 685 recipes and nothing at all
for the other 547.

## 2. `src/lib/scaling.ts` — the cost function, and what it will and will not hand over

`costOf(recipe, wanted, schedule?) → Cost | null`. Pure, no rendering, no strings a page could
print. Null only when `>> servings:` does not parse or `wanted ≤ 0`; **`servingsOf` returns a
number on all 685 files** (distribution below), so on this collection it is never null for a
positive target.

`Cost` carries, per §2 of `docs/knowledge/scaling.md`:

- `servings: {written s, at n, multiplier m}`
- `batches: {written b(s), at b(n), ratio r, binds, costMinutes}` — `costMinutes` is
  `A_batch·(r−1) + H_batch·(r−m)`, the whole of the vessel's contribution
- `elapsed: Growth`, `standing: Growth`, `longest: Growth` — each `{written, at, factor, flat}`
- `evidence: Confidence`, `assumedStandingMinutes`, `untimedCount`

Checked against the model by hand: `costOf(beef-with-broccoli, 12)` returns
`elapsed.at = 42`, `standing.at = 12`, `batches {written 2, at 6, ratio 3, costMinutes 0}` —
`scaling.md` §3's worked example, digit for digit.

**What it does not export**: `parts()`, `splitAttention()`, `binderFor()`, `entryMatches()`. So
`A_free`, `H_free`, `A_batch`, `H_batch` are not reachable from outside the module — only their
consequences are, through `Cost`. The four parameters that would let a browser evaluate the curve
at an arbitrary `n` are therefore **not available without either re-deriving them (a second
opinion about the same minutes) or probing `costOf` at chosen targets.**

The file's own header states the boundary this ticket inherits: *"NO NOTATION ESCAPES … the
sentences live in §6's phrasebook and are T-011-05's and T-011-06's to say."*

### The collapsed case, which is 639 of 685 recipes

With no capacity the batch set is empty, `r = 1`, and §2 collapses to `elapsed(n) = A + m·H`,
`standing(n) = m·H`. Read off `costOf`: `elapsed.written = A + H` and `standing.written = H`, so
`A = elapsed.written − standing.written`. `A` is **not** `elapsedMinutes` — `A + H ≥ totalMinutes`
(§2's identity, gap = hands-on work the timeline ran on a second pair of hands: gumbo 102 vs 94).

## 3. `src/lib/keeps.ts` — the days half

`readKeeps` → `{text, minutes, character}` or a problem. `minutes` is the span in minutes (0 for
`not at all`), which is the field a comparison would use. The generated data carries `keeps` and
`keepsProblem` per recipe already; 138 files have one.

The declared spans, counted: `not at all` 21, `2 days` 24, `3 days` 40, `4 days` 51, `5 days` 1
(chicken-adobo), `1 week` 1. The pool is stews, braises, beans, soups and the air-fryer shelf —
which is the shape the second situation wants, and it is not an accident: T-011-04 annotated where
a cook actually knows the answer.

The module is emphatic that this is **one cook's judgement of whether a dish is still worth
eating, never a food-safety claim**, and that absence is the right answer for most of the
collection rather than a gap.

## 4. `src/components/dials.ts` — the vocabulary this ticket extends

307 lines. Everything the front page says about filtering is in here and the page renders from it.

- `Item` — the nine keys of one `search.json` entry.
- `DIALS` — three dials, three stops each, with `spoken` labels; `OFF`; `SHOW_PASSES = 60`,
  `SHOW_UNSAID = 12`.
- `canAnswer(item, id)` — **one rule per dial**, deliberately not a global evidence gate.
- `measure(item, id)`, `verdict(item, settings) → 'pass' | 'fail' | 'unsaid'`.
- URL codec: `readQuery`, `readSettings` (validates against the declared stops — `?standing=7`
  falls back to Any), `carriesState`, `searchString` (fixed parameter order).
- Card copy: `figures()`, `unsaidLine()`, `tallyLine()`.

Two rules in it that this ticket must not break:

1. **A known failure beats an unknown.** `verdict` returns `fail` on the first dial that fails,
   whatever another dial could not say. Without it, 653 silent sinks would swamp the shelf.
2. **Nothing combines the dials.** No score, no sort, no weight. The composite ban is enforced by
   a test: every string in `DIALS` is matched against
   `/difficult|easy|hard|score|rating|level|effort|active time|hands-on/i`.

The file's header also records *why* it is not in `src/lib/`: T-010-02 owned `src/components/`
and not `src/lib/`. **The same constraint applies here** — this ticket owns `index.astro`,
`search.json.ts`, `src/styles/**`, new components and tests.

## 5. `src/pages/search.json.ts` — the index, and its size budget

685 entries, sorted by title, nine keys each. Built `dist/search.json` is **283,519 bytes**. The
`find` field dominates; the endpoint's header records that the repeats were removed to pay for the
four numbers, and that *"a task list per recipe would not be"* cheap — the standing rule is that
**everything in here is a summary, never the schedule it came from.**

The endpoint is fetched once, lazily, on the first keystroke or first dial press. Nothing else in
the site reads it: `grep -rn "search.json"` finds `index.astro` (the `data-index` attribute),
`dials.test.ts` and `_search.json.test.ts`, both of which import `GET()` directly.

## 6. `src/pages/index.astro` — what is on the page now

343 lines, half frontmatter/markup and half a client script.

- Markup: masthead, `.finder.clay-well` holding the search input and `.dials`, a `.tally` with
  `aria-live="polite"`, `ul.results[data-hits]`, `section.cannot-say[data-cannot]`, `p.nothing`,
  and `ul.counters[data-counters]` — the front door itself.
- Script: lazy `load()` of the index; `render(announceNow)` which hides the counter row and draws
  passes and unsaid; `card()`; `more()`; `paintDials()`; `syncUrl()` using `replaceState`; a 350 ms
  debounce with a `hush()` for anything that writes the tally directly; `/` focuses the box; on
  load, `readQuery` + `readSettings` reproduce a pasted link.
- The empty state is explicit: no query **and** no dial set → counter row back, tally reset. This
  is the guarantee that *"with no query and no dial set, this page is what it was."*

## 7. Styling and the mobile gates

`src/styles/site.css`, 1171 lines. The dial block (lines 300–405) is the vocabulary a new control
would sit beside: `.dials` is a `repeat(auto-fit, minmax(14rem, 1fr))` grid — three across at the
54rem cap, stacked at 375px — `.dial-set` (name + track), `.dial` (a recessed pill track),
`.dial button` with `aria-pressed='true'` raised on `--clay-primary`, and a `max-width: 34rem`
rule giving every stop `min-height: 44px`.

Two hard-won details recorded in that block's comment: the dial's name is a **`<span>`, not a
`<label>`**, because `check-touch.mjs` measures a label that speaks for no single control on its
own box and would fail it; and the layout uses `auto-fit` rather than a breakpoint.

`npm run verify:mobile` = `npm run build && node scripts/check-overflow.mjs --width 375,390,768 &&
node scripts/check-touch.mjs`. Both drive headless Chrome through `scripts/browser.mjs`, which
also exposes the serve/CDP plumbing used by hand for T-010-02's keyboard and live-region pass —
so an end-to-end run of the two situations in a real browser is available without new tooling.

`npm run verify` = `check-recipes` + `recipes` + `vitest run` + `astro build`.

## 8. The numbers this ticket will be arguing from

Servings the collection is written for (`servingsOf`, all 685):

| `s` | 1 | 2 | 3 | 4 | 6 | 8 | 9 | 10 | 12 | 16 | 18 | 20 | 24 | 30 | 36 | 40 | 48 |
| --- | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: | -: |
| files | 15 | 40 | 1 | 189 | 151 | 126 | 17 | 17 | 74 | 20 | 3 | 1 | 19 | 2 | 2 | 6 |

**No file is written for fewer than one serving and 630 of 685 are written for four or more.**
This is the fact behind the ticket's *"at small numbers the behaviour is identical"* claim: a
target of one or two portions is at or below what almost every file already makes.

Capacities (46 files, all from T-011-03):

| vessel | files | `c` | what it bounds |
| --- | ---: | ---: | --- |
| one 5.7 L air fryer basket | 22 | 4 (2 on two files) | roast, air fry |
| the Instant Pot's base | 9 | 2–3 | brown, sear |
| the skillet (slow-cooker pairs) | 5 | 3 | brown |
| four cups of oil in a wok/pan | 5 | 2 | fry |
| the heavy pot / Dutch oven | 4 | 3 | sear, brown |
| the wok, the wide pot, the frying pan, the cast-iron skillet | 5 | 1–3 | sear, boil, fry |

The air fryer files are the expensive pole (`A_batch` is a 15–25 minute roast, repeated); the
wok and oil files are the free pole (`H_batch` is a 90-second fry, and the work was going to grow
anyway). `scaling.md` §7 works both.

## 9. Constraints, stated once

- **No notation on any page, ever.** `scaling.md` §6's phrasebook is the whole of what may be
  said, and its two rules for anything not on the list: say the finding not the method, and when
  uncertain say less rather than hedge more.
- **Never fabricate a number** (S-011's Conventions). Absent is a legitimate answer.
- **A filter that hides things without saying why is the thing this site is built not to be** —
  T-010-02's cannot-say state, and this ticket's criterion that a recipe excluded for scaling
  badly says so rather than vanishing.
- Ownership: `src/pages/index.astro`, `src/pages/search.json.ts`, `src/styles/**`, any new
  component, tests, `docs/active/work/T-011-06/**`. **No `.cook` file, and not `src/lib/**`** —
  so `scaling.ts` and `keeps.ts` are read-only here, which is what forces §2's parameter question.
- T-010-03 is in review on this branch and touched only `docs/gaps/**`; T-011-05 owns
  `src/pages/list.astro`. The only shared surface is `src/styles/**`, and T-011-05 has not
  started.

## 10. Open questions this research does not answer

1. How the browser gets a scaled cost when the four model parameters are not exported — probe
   `costOf` at a fixed set of reachable targets, or ship a collapsed-form pair per recipe and a
   table for the 46 bound files. Both are Design's to weigh, and both need a whole-collection test
   pinning the result to `costOf`.
2. Whether the target is `people × days` outright, or clamped so a recipe is never costed below
   what it is written for. The ticket's *"identical at small numbers"* criterion turns on this.
3. Whether "how much have you got left" is a fourth control or the three dials it already is.
4. Whether five rows of controls still read as a front door at 375px.
