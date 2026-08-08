# T-011-06 — Review

The front page can now be asked *what can I cook for these people, over these days*, and it
answers with a list, a reason on every card, and a shelf of the things that dropped out saying why.

**Six people over three days returns 113 recipes — stews, braises, beans, soups, curries — 25
dropped with the author's own sentence about why they don't keep, and 547 marked as unanswerable.
Read as a cook, 91 of the 113 are things you would genuinely batch-cook, 12 are doubtful and 10 are
wrong.** Every one of the 22 has a named cause, and none of them is the model or the page.

**One person for today is byte-for-byte T-010-02's page**, which is the criterion that decided the
design.

Both gates are green and both were run in this attempt:

- `npm run verify` — **20 test files, 1218 tests passed, 710 pages built**, exit 0
  (`verify.log`).
- The `verify:mobile` pair — **2130 page views at 375px, 390px, 768px, nothing scrolls sideways**;
  **2130 page views, everything a thumb has to hit is 44px**, exit 0 (`verify-mobile.log`).
  How that run was obtained, and why it is not literally `npm run verify:mobile`, is § *The mobile
  gate* below. Read that section before accepting this line.

---

## What changed

| file | | what |
| --- | ---: | --- |
| `src/components/situation.ts` | new, 571 | the two settings, the cost at a size, the fourth question, the shelving, the sentences, the URL codec |
| `src/components/situation.test.ts` | new, 468 | 46 tests, including the whole-collection agreement with `costOf` |
| `src/pages/search.json.ts` | +58 (144) | seven new keys, all of them `costOf`'s or the recipe's own words |
| `src/pages/_search.json.test.ts` | +101 (271) | the keys, the wait, the vessel, the table, the keeping |
| `src/pages/index.astro` | +150/−45 (486) | one control row, one shelf, a render that shelves four ways |
| `src/styles/site.css` | +56 (1227) | `.situation`, `.reason`, `.wont-scale` |

Nothing deleted. **Four** commits, all through `lisa commit-ticket` with exact `--include` paths:

| commit | what |
| --- | --- |
| `db75fe0` | `situation.ts` — the vocabulary, the cost at a size, the shelving, the sentences |
| `cd76aa7` | `search.json.ts` + both test files — the index carries the numbers, agreement with `costOf` proved |
| `31a759a` | `index.astro`, `site.css`, `situation.ts` — the control row, the dropped shelf, the four-way render |
| `586556c` | `situation.ts`, `situation.test.ts` — the dropped shelf says *At eighteen*, not *At 18* |

`progress.md` names three of those four; `586556c` landed a minute after `progress.md` was last
written and is the seven-line change that puts the size in words on the **Not at that size** shelf,
so that card reads in the same voice as every other sentence on the page. It is recorded here.

`git status --porcelain -- src/ scripts/ recipes/` is empty at the time of writing. No `.cook`
file, nothing under `src/lib/`, `src/data/` or `scripts/`, and **`src/components/dials.ts` is
imported everywhere and edited nowhere** — its last commit is still `a190d7c`, T-010-02's.

## The four decisions worth a reviewer's time

### 1. The situation changes the recipe, not the dials

Nothing here re-implements a dial. `scaledItem()` returns the same `Item` with three figures taken
at the target and hands it to T-010-02's own `verdict()`, `figures()` and `unsaidLine()`.

Three things fall out of that, and the third is the one the implementer did not expect:

- **`dials.ts` needed no edit**, which is what ownership required anyway.
- **"Identical at small numbers" is an object comparison, not a behavioural promise.** At or below
  the written size `scaledItem` returns *the same object*, asserted with `toBe` on every recipe at
  every size.
- **Answerability cannot change under scaling.** `canAnswer` reads `evidence`, `elapsedMinutes > 0`
  and `washingUpCount !== null`; scaling multiplies elapsed by a number ≥ 1 and touches neither of
  the others. So no recipe crosses into or out of *we can't say* because somebody set a headcount,
  and the cannot-say shelf stays a statement about annotation rather than about arithmetic. Pinned
  by a test over 685 recipes × 8 sizes.

### 2. The target never goes below what the recipe makes

`n = people × days`, then `max(n, s)`. **You do not un-cook a recipe**: faced with a pot of chili
written for six and one person to feed, nobody simmers a sixth of it for a sixth of the time — they
cook the pot and eat it twice, which is exactly S-011's *two meals for one*. Scaling down is also
where the model is least trustworthy in the direction that matters (`scaling.md` §4.3 — a quarter
of a roux is not a quarter of the stirring) and the error would run towards *reassuring* a tired
cook, against the house convention.

630 of 685 files are written for four or more, so the small situation cannot reach the model at
all, and that is why the before-and-after is exact rather than close. `design.md` D1 has the two
rejected readings.

### 3. What the browser is shipped, and what it costs

`src/lib/scaling.ts` is read-only here and exports none of the four parameters a browser would need
to evaluate the curve. So: `waitMinutes` (§2's `A`) on every recipe, which with `handsOnMinutes` is
the whole model wherever no capacity is declared, plus a **small table of `costOf`'s own answers for
the 46 recipes a vessel binds**. The alternative — a figure per recipe per size for all 685 — was
rejected on weight.

**The claim that made it safe is tested, and it held on the first run:** for all 685 recipes at all
8 reachable sizes, both code paths reproduce `costOf()`'s `elapsed.at`, `standing.at` and
`longest.at` exactly.

**The weight claim in `design.md` was wrong and this is the correction.** Measured:

| | raw | gzipped |
| --- | ---: | ---: |
| before | 281,289 | 57,840 |
| after | 343,113 | **69,789 (+12.0 KB, +21%)** |
| the rejected full table | 390,759 | 78,730 (+20.9 KB, +36%) |

D3 costed the values and forgot that three new keys on 685 entries is 41 KB of repeated key names
before a single digit. The decision does not reverse — the shipped shape is 43% cheaper than the one
it beat, and the file is fetched once, lazily, on the first keystroke — but **21% is the honest
number and a reviewer should decide whether it is worth it**, not be told 4%.

### 4. The uncertainty sentence is a tail, not a replacement

`design.md` D8 said the phrasebook's *"This one doesn't time enough of itself to say"* would be
tested before the growth rows. Measured against the collection, that fires on **228 of the 248
recipes that scale flat at eighteen servings** — including every stew in the three-day list, because
267 recipes report zero hands-on minutes and most of that is silence rather than freedom (§4.6). A
hundred cards all reading *we can't say* is the site explaining itself, which §6's second rule
refuses.

So the finding is said and the silence is said after it, using §6's own last row:

> **Feeds eighteen without taking any longer. Plus four steps it never times.**

That is `chili-con-carne`'s card, and it is both halves of §4.6 in one line. **The refusal row is
therefore unused by this page.** Where it belongs is T-011-05's recipe page, which says one thing
about one recipe and can afford to say nothing; and that ticket has in fact implemented it, in
`src/components/scaling-words.ts`, landed on this branch while this ticket was being built.

## The findings from reading the results

Full working, with a verdict per recipe, is **`six-over-three.md`**. Four findings:

1. **The list is right in kind, and the keeping filter is why.** Not the scaling model — T-011-04
   annotated `>> keeps:` exactly where a cook knows the answer, which is stews and braises, and
   the scaling model then priced what survived.
2. **Three of the 113 are stock, not dinner** — `chicken-broth-instant-pot`,
   `ham-hock-stock-instant-pot`, `pho-broth-instant-pot`. Not new and not fixable here:
   `docs/gaps/filter.md` (T-010-03) already names *"it cannot tell dinner from a spice blend"* as
   the filter's largest fault. Confirmed at eighteen servings, with slugs.
3. **Five pan-bound dishes have no capacity, so the page says the pan doesn't care** —
   `tortilla-espanola` (144 minutes standing at eighteen), `paella`, `jalfrezi`, `bhuna`,
   `sausage-and-peppers`. **The model is right and the annotation is missing**: none of the five
   says *"in batches"* in prose, so none was in T-011-03's pool. The same gap shows as sibling
   inconsistency — `beef-bourguignon` says *feeds eighteen without taking any longer* while
   `beef-bourguignon-instant-pot` says *six lots*. **This is the strongest follow-up ticket in the
   artifact** and it needs a `.cook` file, which this ticket may not touch.
4. **§4.3's two known errors surface exactly where it said they would** — `gumbo` over-charged at
   110 minutes of roux-stirring, `xiu-mai` under-charged at 18 minutes for eighteen portions of
   hand-rolled meatballs. Both are accepted errors with a stated direction, now visible on a page
   rather than only in a document.

## The front door: a finding, not a pass

Measured at 375px, from the built page:

| | y of the first counter card |
| --- | ---: |
| before this ticket | ≈ 695 (about 120px of it above an 812px fold) |
| **after** | **820 — 8px below the fold** |

The situation row costs 112px: two rows of 52px, because at 375px there is about 322px inside the
finder and the two tracks cannot sit side by side. Two things were done to hold it down — the name
sits *beside* its stops rather than above them, which is the one place this row departs from
`.dial-set`, and the day stops are `1 · 2 · 3` rather than `Today · 2 days · 3 days`, which had
wrapped one stop onto a line of its own and read as a broken control.

**It is not enough, and it is reported rather than argued away.** The page still reads as a front
door — the counter shelf is intact, unchanged, and the first scroll brings it up — but a phone now
shows five rows of controls and no shelf on the first screen, and the ticket is explicit that this
is a reason to move them.

**What should happen** (a ticket, not a change here, because `dials.ts` and the three dials belong
to S-010): put the three dials behind a disclosure — *"More: time, sink"* — closed by default. The
situation is the question a tired person actually asks and it is two presses; the dials are the
refinement. That would make the finder shorter than it was before this ticket and put the counter
shelf back above the fold. It needs T-010-02's ticket-holder's argument about always-visible dials
to be revisited, which is why it is not done unilaterally here.

## Test coverage

**Two files**: `situation.test.ts` (46 `it`/`describe` blocks across seven groups) and the 19 new
assertions in `_search.json.test.ts`. They run inside the 1218 that `npm run verify` passes.

**Against the model**, over the whole collection at all 8 sizes: `costAt` reproduces `costOf`'s
three figures exactly; the load counts match `costOf`'s batch counts; a size with no row throws
rather than guessing; `beef-with-broccoli` at twelve reproduces `scaling.md` §3's hand-worked 42
and 12; `gumbo`'s `waitMinutes` is 53 against a drawn clock of 94, so `A` and `elapsedMinutes`
cannot be read as the same number.

**Against T-010-02**, over the whole collection: `scaledItem` returns the same object at or below
the written size; `shelve` agrees with `verdict` for all 685 recipes × 64 dial settings, both with
the situation off and at one person for one day; `canAnswer` is invariant under scaling; no figure
ever shrinks.

**The fourth question**: `days − 1`; `not at all` fails two days; a declared span never comes back
`unsaid`; a span never prints without what the dish is like.

**The shelving**: every recipe on exactly one shelf under every situation; a known failure beats an
unknown on the fourth question too; `dropped` only ever holds a recipe that was not already
failing.

**The sentences**: one test per phrasebook row on a shape chosen for it, plus **the notation ban run
over every sentence the module can produce for all 685 recipes at all 8 sizes**
(`situation.test.ts:403`, `/[×→]|\bO\s*\(|\b\d+\s*[x×]\b|\bn\b|serves \d+ →/`) — plus the composite
ban on every string in `CONTROLS`. Independently re-checked here: `dist/index.html` contains zero
matches for `O(1)`, `O(n)`, `×` or `→`.

**The codec**: round-trips all 20 people × days combinations, drops `?people=7` and `?days=nine`,
writes one fixed parameter order, stays silent on a pristine page.

### Gaps

- **Nothing in vitest drives a DOM.** The rendering, `replaceState`, the four shelves and the live
  region were checked by hand through `scripts/browser.mjs` (dumps in `browser-pass.json`), not by
  a test anything reruns. Same gap T-010-02 recorded, same reason: jsdom is a dependency this
  ticket does not get to take.
- **No screen reader ran.** Tab order was read off the document — `finder-q → people (5 stops) →
  days (4) → the three dials (12)` — and the keyboard path was driven: focusing *6* and pressing
  Space leaves the URL at `?people=6`, `aria-pressed` on that stop `true` and on Any `false`, the
  tally rewritten and focus still on *cooking for six*. The announcement itself was not heard.
- **`A_REAL_WAIT = 20` is a choice, not a measurement.** It is one basket load (§7's 18–24
  minutes), and it only decides which of two true sentences a bound recipe gets.
- **The `costAt` throw is untested in the browser.** It cannot fire from the UI — every reachable
  target is a declared stop, and that is asserted — but if a future stop is added without
  rebuilding the index, a card would throw inside `render`. A defensive catch was rejected as
  hiding exactly the fault the throw exists to surface.

## The mobile gate

`npm run verify:mobile` was run first as written, and **exited 2 without producing evidence**:

```
SCROLLS  768px  /smoked-brisket/  (768px of content in a 768px window)
           <code> reaches 1534px
dist/ changed while this was reading it — a build running alongside, most likely.
Nothing above is evidence either way. Re-run against a build standing still.
```

That is `check-overflow.mjs`'s own concurrency guard, not a fault in this work. Four other tickets
are running builds and browser sweeps against the same `dist/` on this branch — the same collision
that has T-010-03 waiting. The `SCROLLS` line above is an artifact of the swap: `dist/smoked-brisket/`
did not even exist a minute later, mid-rebuild by another agent.

So the sweep was re-run **against a private build that nothing else can touch**, which is what the
guard's own message asks for:

```
npm run recipes
npx astro build --outDir <scratch>/dist-t01106
node scripts/check-overflow.mjs --width 375,390,768 --root <scratch>/dist-t01106
node scripts/check-touch.mjs --root <scratch>/dist-t01106
```

Those are `verify:mobile`'s three steps with `--root` pointed at a directory outside the repo;
both scripts take `--root` (`check-overflow.mjs:41`, `check-touch.mjs:72`) and their `moved()` guard
then watches that directory instead of the contended one. Result, exit 0, captured in
`verify-mobile.log`:

```
2130 page views at 375px, 390px, 768px — nothing scrolls sideways.

2130 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px, the table
says when it continues, and the pinned column stays below 44rem.
```

2130 page views is the full sweep — the same count `check-overflow` reports on a passing run of the
npm script. **The one honest caveat:** the literal string `npm run verify:mobile` has not been
observed exiting 0 on this machine while four agents share a `dist/`. The commands it runs have,
over every page, at all three widths, on a build made from this exact working tree. A reviewer who
wants the literal invocation should run it once when the branch is quiet; nothing in the work would
change.

## Open concerns

1. **There are now two phrasebooks.** `src/components/scaling-words.ts` (T-011-05, landed
   mid-ticket) says the same findings for the recipe page from a `RawRecipe` and a `Cost`; this
   file says them for the front page from an index entry. They were written concurrently and
   independently, and they agree on the load-bearing thing — that `bounded` is tested before
   `evidence`, because a batch count is arithmetic over two authored numbers and does not rest on
   the hands-on figure. **They should be one module**, split into a finding-namer and a
   `wordsFor(kind, numbers)`, and neither ticket could have done it. A merge ticket is worth
   raising.
2. **The three-day list is 113 of 685 because 547 recipes say nothing about keeping.** That is
   honest and it is also most of the collection. The unanswered shelf shows 12 and counts the
   rest; a reader who wants a three-day plan is being shown a fifth of the shelf. More `>> keeps:`
   annotation is the only fix.
3. **The index is 21% bigger** (§3 above). Worth a reviewer's explicit assent.
4. **The front door lost the fold at 375px** (§ above). Worth a ticket.
5. **`src/styles/site.css` is shared with T-011-05**, which ran on this branch concurrently. This
   ticket's commit added 56 lines and removed none.
6. **People on its own rescales; it does not filter.** `?people=6` alone reads *685 match · 0
   don't · 0 we can't say*, because with no dial set and one day asked for, nothing can fail. Every
   card still gains its reason — *Makes six as written*, *Feeds six without taking any longer* —
   so the page answers rather than shrugging, but a reader who expected a headcount to narrow
   something will be surprised. It is the honest behaviour (a size is not a cap) and it is
   deliberate; naming it here rather than defending it later.

Nothing in 1–6 is a defect in the shipped behaviour. 1 and 4 are follow-up tickets, 2 is an
annotation backlog, 3 and 6 are decisions a reviewer may want to overrule.

## Evidence against each acceptance criterion

| criterion | evidence |
| --- | --- |
| takes people and days, filters against the **scaled** cost from `scaling.ts` | `costAt` + the whole-collection agreement test; `search.json.ts` calls `costOf` and computes nothing |
| **at small numbers identical to T-010-02**, with a before-and-after | `six-over-three.md` §1: `?standing=15` and `?standing=15&people=1&days=1` — same 227, same 416, 0 dropped, compared from the rendered DOM |
| days filters on keeping as well as scaling, no silent omission | `keepsVerdict`, `days − 1`; 547 recipes go to *we can't say* with *Nobody said whether this keeps* |
| every result carries a plain-English reason from the phrasebook | every match card; `reason()` and its ten rows |
| **no notation anywhere** | the collection-wide ban test at `situation.test.ts:403`; re-grepped here — `dist/index.html` has zero matches for `O(1)`, `O(n)`, `×`, `→` |
| a recipe excluded for scaling badly says so rather than vanishing | the **Not at that size** shelf; `shot-375-not-at-that-size.png`; `586556c` puts its size in words |
| both situations run end to end, read as a cook, verdict per recipe | `six-over-three.md` — 113 verdicts, 25 drops read, four findings |
| **the six-over-three list scrutinised** | `six-over-three.md` findings 1–4; 91 yes / 12 doubt / 10 no, every "no" with a cause |
| URL state covers people and days; a pasted link reproduces the list | `?q=beans&standing=30&people=6&days=3` pasted cold reproduces the list and paints both controls (`browser-pass.json`) |
| `npm run verify` | 20 files, 1218 tests, 710 pages, exit 0 — `verify.log` |
| `npm run verify:mobile` | both legs clean over 2130 page views, exit 0 — `verify-mobile.log`, with the caveat in § *The mobile gate* |
| the front page still reads as a front door, or the artifact says what should happen | the finding above, with the ticket that should follow |
| counter row, search box and recipe pages unchanged when nothing is set | pristine page: counters visible, URL empty, tally *Press / to search*; `dist/miso-ramen/index.html` and `dist/list/index.html` contain zero `data-situation` |
| only the owned files modified | four commits, six files; `git status --porcelain -- src/ scripts/ recipes/` empty |

## Artifacts in this directory

`research.md`, `design.md`, `structure.md`, `plan.md`, `progress.md`, this file,
`review-disposition.json`, plus the evidence the criteria rest on: `six-over-three.md` (the
verdict per recipe), `browser-pass.json` (the raw browser dumps), `verify.log`,
`verify-mobile.log`, and four screenshots — `shot-375-front-door.png`,
`shot-375-six-over-three.png`, `shot-375-not-at-that-size.png`, `shot-768-six-over-three.png`.

## Disposition

**Pass.** Every acceptance criterion has evidence above; both gates are green; the working tree is
clean and every ticket-owned change is committed through `lisa commit-ticket`. The two things a
human should actually decide are the 21% index and the lost fold at 375px, and both are written up
with what should happen rather than left for a reviewer to find.
