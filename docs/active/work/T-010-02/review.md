# T-010-02 — Review

The front page can now be asked the question the site could already answer, and it gives three
answers rather than two. Five commits, four files, 42 new tests. `npm run verify` is green —
**1028 tests, 710 pages** — and both mobile checks pass at 375, 390 and 768.

---

## What changed

| file | | what |
| --- | ---: | --- |
| `src/components/dials.ts` | new, 307 | the vocabulary, the three answerability rules, the verdict, the URL codec, the card copy |
| `src/components/dials.test.ts` | new, 419 | 42 tests: hand-built shapes, the codec, and properties over the whole collection |
| `src/pages/index.astro` | +224/−42 | twelve buttons in the finder, and a script that draws two shelves from a query and three dials |
| `src/styles/site.css` | +109/−27 | the dial, the unanswered shelf, one narrow-width rule — and 41 lines of dead CSS out |

Commits: `a190d7c`, `4dc8e19`, `87059f1`, `626935e`, `d7df8d7`. No `.cook` file, not
`src/pages/search.json.ts`, nothing under `src/lib/`, `src/data/` or `scripts/`.
`git status --porcelain -- src/ scripts/` is empty.

## The three decisions worth a reviewer's time

### 1. The longest unbroken stretch is a qualifier, not a fourth dial

`longestHandsOnMinutes ≤ handsOnMinutes` always, so a standing cap of fifteen minutes **already
guarantees** an unbroken stretch under fifteen. A fourth dial could never tighten the answer —
its only power is to let more recipes in. Measured, that power is small: the two figures are
equal on **604 of 664 recipes (91%)**, and at a fifteen-minute cap they disagree about **18
recipes (2.7%)**, every one a braise or a folding job.

So the number goes on the card instead, where the comparison actually happens:
`chile-verde-slow-cooker — 42 min standing · longest go 22 min`. It appears when the gap is at
least one break long, using `BREAK_MINUTES` imported from `schedule.ts` — the same constant that
decided what a break *is*, so the qualifier and the measurement cannot drift. A one-minute gap
(`bagels`, 11 against 10) is noise and stays off.

And the dial gates on `handsOnMinutes`, not on the longest run: the label says *time you're
standing there*, and gating on the longest run would let 42 minutes of standing through a
30-minute dial. `design.md` D2 is the full argument.

### 2. `slack` is not a fourth dial, for two reasons

It is not in `search.json` at all, and putting it there means editing an endpoint this ticket may
not touch. And a dial can only gate on the level, which strips the reason — the exact thing
S-003 refuses with *"'forgiving' alone is a vibe"*. `design.md` D3.

### 3. Answerability is per dial, and a known failure beats an unknown

Three separate rules — `evidence !== 'unknown'`, `elapsedMinutes > 0`, `washingUpCount !== null`
— rather than one global evidence gate. The global gate is cleaner and wrong on a real recipe:
`chile-verde-slow-cooker` has no standing evidence but its eight hours come from real timers, and
telling a reader we cannot say when an eight-hour braise lands is its own dishonesty. It would do
that to 371 recipes.

And a recipe we **know** is out stays out: with `standing ≤ 15` and `by ≤ 60` set, the braise
fails on the clock rather than being promoted onto the unanswered shelf where somebody looking
for a half-hour dinner would meet it. Both directions are pinned by tests, and the whole-
collection version asserts that adding the clock dial moves recipes *out* of unanswered and into
failed — the opposite of what the naive rule does.

## The three answers, on screen

Fails are not drawn — that is what failing a filter means. Passes are drawn; recipes the data
cannot answer for are drawn **below them, under their own heading**, never silently included and
never silently dropped. All three states are visible at once because the tally names all three:

> `2 match · 2 don’t · 2 we can’t say`

`shots/375-three-answers.png` is that screenshot at 375px — the tally, both passing cards with
their figures, and *We can't say for these 2* with its sentence, on one screen.

Marked three ways, none of them colour: the heading and its sentence, the position below the
passes, and one italic line per card — *"Nobody said how long you'd stand there."* A reader who
lands on a single card still knows what is missing. Rejected: a chip reading "unknown" (a legend
by another name), dimming (a legibility cost paid by the reader least able to afford it), and
recessed cards (they are still links you can pick up).

## Test coverage

42 tests in `src/components/dials.test.ts`.

**Hand-built shapes**, so the expected answer is read off a shape chosen for it: over a cap →
`fail`; exactly on a cap → `pass` (a stop is a cap, not a fence); an unanswerable dial →
`unsaid`; unanswerable *and* another dial failing → `fail`, asserted with the dials in both
orders; `washingUpCount: 0` under a cap of 1 → `pass`, because absent and zero are different
answers; the qualifier at gaps of 8, 0 and 1 minutes.

**The codec**: round-trips all 64 settings combinations, drops `?standing=7` / `?by=soon` /
`?wash=-1` to Any, writes a stable parameter order, and returns `''` for the pristine page.

**Properties over the whole collection**, read through `search.json.ts`'s own `GET()` so a
change to the endpoint fails here too:

- every recipe gets exactly one of three answers under every one of the 64 settings, and the
  three always sum to the collection size;
- **no recipe ever passes on a dial that cannot answer for it** — the invariant the whole design
  exists for, checked across all 64 × 672 combinations;
- turning a dial up only ever lets more through, on every dial;
- the cap cannot decide what can be answered — `unsaid` is identical at all three stops of every
  dial;
- "cannot say" outnumbers "matches" on the standing and sink dials;
- the annotation gap keeps its order: the sink is silent most often, the clock least often;
- named-slug regressions: `blondies` (the trap — `unsaid`, never a pass, at any standing stop),
  `mayonnaise` (`unsaid` on the clock, not an instant pass), `chile-verde-slow-cooker` (fails on
  the clock while its standing figure is silent), `memphis-dry-rub` (passes on a real zero),
  `gyoza` vs `patty-melt` (the qualifier on one and not the other).

**The composite ban is a test**, not a promise: every string in `DIALS` is matched against
`/difficult|easy|hard|score|rating|level|effort|active time|hands-on/i` and must not hit.

### Gaps

- **Nothing in vitest drives a DOM.** The rendering, `replaceState`, the debounce and the live
  region are covered by the by-hand browser pass below, not by a test anything reruns. Adding
  jsdom is a dependency this ticket does not get to take.
- **No screen reader ran here.** The keyboard path and the `aria-live` markup were checked; the
  announcement itself was not heard.
- **The 350 ms debounce is a constant, not a measurement.** It was chosen, not tuned.

## The collection moved under this ticket

Worth a reviewer knowing, because it changed one file and vindicated one decision.

| | at Research | at Review |
| --- | ---: | ---: |
| recipes | 664 | **672** |
| sinks the data can answer for | 11 | **164** |
| standing figures it cannot answer for | 395 | 403 |
| clock figures it cannot answer for | 24 | 24 |

T-008's annotation landed mid-ticket. The sink dial, which `design.md` D8 shipped knowing it
could answer for eleven recipes, now splits **55 / 141 / 162** across its three stops — which is
the spread those stops were chosen for, against a pool that did not exist when they were chosen.

**This cost a test rewrite, and the rewrite is better.** The first draft asserted exact counts —
227 passing at fifteen minutes, 653 silent sinks — and both were stale within the hour. On a
branch where four other tickets are adding recipes, an exact-count assertion is not a guard, it
is a tripwire strung across everybody else's `npm run verify`. `626935e` replaced them with the
structural facts the design actually rests on, none of which move when a recipe is added. The
measurements live here instead, against commit `626935e`, which is where a number that was true
on a Tuesday belongs. `design.md` carries a note pointing at this section; none of its arguments
reverses.

## Evidence against each acceptance criterion

| criterion | evidence |
| --- | --- |
| three dials working with the box: a query plus dials narrows one list | by-hand 5: `?q=beans&standing=15` → 24 passes, 43 unanswered, one list |
| no composite score anywhere, in UI or data | the `DIALS` regex test; `verdict` returns three words and no number; nothing sorts |
| unanswered shown and marked, all three states in one screenshot | `shots/375-three-answers.png` |
| labels plain, rejects recorded | `design.md` D9 — 14 rejected phrasings with reasons |
| longest-stretch decision argued | `design.md` D2, on the 91% / 18-recipe measurement |
| any fourth dial argued | `design.md` D2 and D3 |
| URL state, survives reload, pasted link reproduces the list | by-hand 1, 3, 4, 5, 6, 7; 64-combination round-trip test |
| dials with no query does something deliberate | `design.md` D6; by-hand 1 and 9 |
| `npm run verify:mobile` passes | both checks exit 0 — see below |
| the tally announces the filtered count; keyboard-only operable; say how it was tested | below |
| built with `b28-clay.css` primitives, no new colours | no hex added to `site.css`; every value is one of the nine tokens or a `color-mix` |
| counter row, search, recipe pages unchanged with no dial | by-hand 10; `dist/miso-ramen/index.html` has zero `data-dial` |
| `npm run verify` | below |
| only the owned files modified | four commits, four files; `git status --porcelain -- src/ scripts/` empty |

### How the keyboard and the live region were tested

Driven through `scripts/browser.mjs`'s own CDP plumbing at 375px; the full state dump is
`shots/transcript.md`.

**Tab order from the search box**, read off the document:
`input → standing:any,5,15,30 → by:any,30,60,120 → wash:any,1,3,5 → a`. Twelve stops in reading
order, each a real `<button type="button">` with `aria-pressed`, inside a `role="group"` named by
`aria-labelledby` pointing at a `<span>` — not a `<label>`, because `check-touch.mjs` measures a
label that speaks for no control on its own box. Focus lands, Space presses, and the state after
Space is `/?standing=5` with the tally rewritten. Focus ring is the house one.

**The live region** is the existing `<p class="tally" aria-live="polite">` — the same element
that already announced search results, not a second one. It settles rather than shouting: a
keystroke redraws the list at once and rewrites the tally after 350 ms of quiet, so typing
`pasta` announces once and not five times; a dial press writes it immediately, because one
deliberate action deserves one answer. Measured 100 ms after a keystroke the list is already 24
cards while the tally still reads the previous sentence — the debounce, caught working.

The first run of the driver read a stale tally and I nearly reported it as a bug. It was the
driver: CDP's `Runtime.evaluate` does not await a promise unless asked, so the sleep returned
instantly and measured the page mid-debounce.

**The debounce did carry one real bug, and it is fixed** (`d7df8d7`). `render()`'s empty-state
branch wrote the tally directly rather than through the debouncer, so it never cancelled the
timer already in flight: clearing the box within 350 ms of a keystroke reset the tally to
*Press / to search* and then had the old count land on top of it a third of a second later. One
line — a `hush()` in that branch — and Chrome now reads `Press / to search` at both 150 ms and
750 ms after clearing, with the counter row back.

### `npm run verify:mobile`

Run against an isolated build standing still, because a concurrent ticket rebuilding `dist/`
tripped `check-overflow`'s own "the build moved underneath this run" guard on the first attempt —
which is exactly what that guard is for.

```
2106 page views at 375px, 390px, 768px — nothing scrolls sideways.
2064 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px, …
```

and, re-run on `/`, `/list/` and `/miso-ramen/` against the final build after the last commit:

```
9 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px, …
9 page views at 375px, 390px, 768px — nothing scrolls sideways.
```

The twelve dial buttons are server-rendered and visible, so `check-touch` measured them rather
than skipping them as hidden — which is what the `min-height: 44px` rule under
`@media (max-width: 34rem)` is there for. The dial names are `<span id>` rather than `<label>`,
because a `<label>` speaking for no single control is measured on its own box and a 19px name
would have failed.

### `npm run verify` — green

**14 test files, 1028 tests, and `astro build` completes 710 pages.**

Two other tickets went red underneath this one mid-session, and both are recorded because a
reviewer reading the transcript will see them:

- `src/lib/step-labels.test.ts`, two failures, from T-009-03 in flight on the same branch —
  stashing that ticket's three working-tree files made the file pass 27/27, and it went green on
  its own when T-009-03 committed.
- `src/lib/icons.test.ts`, one failure on nine unknown verbs (`probe`, `shake`, `slick`, …) from
  the air-fryer recipes added by `ddc6f31` and `a7057a7` — green once T-008-04 taught them.

Neither was this ticket's: it adds no recipe and touches neither module.

## Open concerns

1. **The dials cost about 270px above the counter row on a phone.** Measured: the finder is 379px
   tall at 375px and the counter row starts at 694px, against 191px and 463px at 900px where
   `auto-fit` puts all three dials in one row. On a 375×900 screen the first counter card is
   still on the first screen; on a 667px-tall phone it is just below the fold. That is the price
   of `design.md` D6 and it is a real change to the front door. The fallback, if a reader
   disagrees, is a tighter name and gap — **not** hiding the controls behind a disclosure, which
   is the problem S-010 opens with.
2. **Twelve tab stops before the results.** Accepted deliberately (D11) so the front page's dial
   behaves exactly like the list page's. If that trade is wrong it should change in both places,
   in a ticket that owns both.
3. **One search behaviour does change, on a page arriving with `?q=`.** The URL rule is "silent,
   or the whole state" (D7): a pristine front page plus typing writes nothing — verified, by-hand
   10 — but a page loaded from a shared `?q=beans` link already carries state, so typing there
   now keeps the URL in step where before it went stale. That is the rule doing what it is for
   rather than an oversight, and it is strictly better behaviour, but a strict reading of
   criterion 11 ("the search behaviour is unchanged when no dial is set") could land either way
   on it, so it is named rather than buried.
4. **`.results` keeps its stale cards when hidden.** Clearing the box hides the list without
   emptying it, so the old children are still in the DOM. That is the behaviour the page already
   had; it is invisible and cheap, and fixing it was not this ticket's to do.
5. **The 350 ms debounce and the two shelf caps (60 and 12) are chosen, not measured.** Named
   constants, and the caps print their remainders, so none of them hides anything.
6. **The "cannot say" shelf is capped at 12 cards.** With the sink dial set that is 12 of 508.
   The count is printed on the heading, in the remainder line, and in the tally — three times —
   but a reader who wants to browse the unannotated recipes cannot. T-010-03 is the ticket that
   reads the whole thing.
7. **`dials.ts` is under `src/components/` rather than `src/lib/`**, where every other pure
   module lives, because the ticket's ownership list says so. The file's header says this and
   moving it later is a rename.
8. **The elapsed dial's stops top out at two hours** while the collection reaches 33,240 minutes.
   That is deliberate — a dial is a cap for tonight, not a browse of the whole range — but it
   means no dial setting distinguishes a four-hour dish from a three-week pickle.

Nothing here blocks completion.
