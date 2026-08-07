# T-010-02 — Design

Twelve decisions. Each names what was rejected and the measurement that decided it. Counts are
from `dist/search.json`, 664 recipes, as tabulated in `research.md` §2.

---

## D1 — Three dials, four stops each, as buttons in a well

**Decided.** Each dial is a `role="group"` track holding four real `<button>`s — `Any` plus
three caps — one of which carries `aria-pressed="true"`. Server-rendered, so the controls exist
before any script runs.

| dial | stops | passes / fails / cannot say at each stop |
| --- | --- | --- |
| Time you're standing there | Any · 5 min · 15 min · 30 min | 109/160/395 · 227/42/395 · 260/9/395 |
| On the table by | Any · 30 min · 1 hr · 2 hr | 207/433/24 · 365/275/24 · 458/182/24 |
| Things to wash | Any · 1 · 3 · 5 | 4/7/653 · 6/5/653 · 11/0/653 |

**Stops, not a slider.** `elapsedMinutes` runs 0 → 33,240 with a median of 45; a linear track
over that range puts every dinner in the first 0.2% of its travel. `handsOnMinutes` is the
opposite problem — p50 is 3 and p95 is 24, so a slider's whole useful range is 20 pixels wide.
Three named stops per dial are readable, thumb-sized, and encode a decision the reader can say
out loud. *Rejected:* `<input type=range>` (the range is unusable on both axes and a range
thumb is a 20px target), a numeric text field (a dial you have to type into is not a dial), a
`<select>` (native pickers are fine but the site has none and a closed menu hides the stops).

The stops were chosen for spread, not roundness: standing 5/15/30 splits the 269 answerable
recipes 109 → 227 → 260, three genuinely different shelves. Standing 45 was rejected — it
passes 267 of 269 and sorts nothing. The wash stops are chosen for a pool that does not exist
yet (D8); on today's 11 rows they split 4 → 6 → 11.

## D2 — The longest unbroken stretch is a qualifier on the first dial, not a fourth dial

**Decided: qualifier.** The ticket asks for the argument, so here it is in full.

**The case for its own dial** is that it is the complaint S-010 opens with: thirty minutes at
the hob and three ten-minute jobs around two waits are different evenings, and `handsOnMinutes`
cannot tell them apart. That is true and it is why T-010-01 derived the number.

**The case against is arithmetic, and it is decisive.** `longestHandsOnMinutes ≤
handsOnMinutes` always — it is made of the same minutes (`schedule.ts:84-88`, asserted over all
664 in `_search.json.test.ts:94`). So a standing cap of 15 minutes **already guarantees** an
unbroken stretch under 15 minutes. A fourth dial gating on the longest run could never tighten
the answer; its only power is to *let more recipes in* — the ones with a lot of standing broken
into short jobs.

Measured, that power is small:

- the two figures are **equal on 604 of 664 recipes (91.0%)**;
- at a 15-minute cap the two readings disagree about **18 recipes (2.7%)** — `carnitas-instant-pot`,
  `braised-short-ribs-slow-cooker`, `refried-beans`, `gyoza`, `samosa`, `taro-cake` and 12 more,
  every one a braise or a folding job;
- adding the dial costs a quarter of the control strip and, in the ticket's own words, makes
  every other dial less likely to be turned.

Four dials to reorder 2.7% of the shelf, in the direction of *loosening*, is a bad trade.

**What is kept instead.** The information is on the card, where the comparison actually happens.
When a recipe's longest run is at least one break shorter than its standing figure, the card
says so:

> `chile-verde-slow-cooker` — 42 min standing · longest go 22 min

"At least one break" is `BREAK_MINUTES` (5), imported from `schedule.ts` — the same constant
that decided what a break *is*, so the qualifier and the measurement cannot drift. That fires
on **35 recipes**, all of them braises, dumplings and `tortilla-espanola`. A 1-minute gap
(`bagels` 11/10, `beef-with-broccoli` 4/3) is noise and stays off the card.

**And the dial gates on `handsOnMinutes`, not on the longest run.** The label says *time you're
standing there*. Gating on the longest run would make a recipe with 42 minutes of standing pass
a 30-minute dial, and the label would be a lie. D9 is the whole reason the labels are the design.

## D3 — `slack` is not a fourth dial

**Rejected, twice over.**

1. **It is not reachable.** `slack` is not one of the nine keys in `search.json`. Putting it
   there means editing `src/pages/search.json.ts`, which this ticket's last acceptance criterion
   forbids by name.
2. **A level without its reason is the thing this story refuses.** S-003's line is *"'forgiving'
   alone is a vibe"*, and `slack` carries a level **and** a sentence for exactly that reason. A
   dial can only gate on the level. Shipping "narrow / wide" as a control would strip the reason
   and reintroduce the rating S-010 spends a section refusing — one dial over.

If a later ticket wants it, the shape is a dial that filters on the level *and* prints the
reason on the card, and it starts by widening the endpoint. Not here.

## D4 — Answerability is per dial, and a known failure beats an unknown

**Decided.** Three separate rules, one per dial, rather than one global evidence gate:

| dial | can answer when | cannot, for |
| --- | --- | ---: |
| standing | `evidence !== 'unknown'` | 395 |
| on the table by | `elapsedMinutes > 0` | 24 |
| things to wash | `washingUpCount !== null` | 653 |

*Rejected: one global gate* — treat `evidence: 'unknown'` as unanswerable for everything. It
fails on a real recipe: `chile-verde-slow-cooker` is `unknown` because its hands-on figure has
assumed minutes in it, but its 512 elapsed minutes come from real timers. Telling a reader we
cannot say when an eight-hour braise will be on the table, when the recipe says eight hours, is
its own dishonesty. The global gate would mark 395 recipes unanswerable on the elapsed axis
when 371 of them have a stated elapsed figure.

`elapsedMinutes > 0` is the elapsed axis's own trap, and it is a strict subset of the hands-on
one: all 24 zero-elapsed recipes are already `evidence: 'unknown'` (verified). They are the
sauces and rubs — `mayonnaise`, `guacamole`, `basil-pesto`, `taco-seasoning`,
`memphis-dry-rub` — which a naive "on the table by 30 minutes" would rank as instant on no
timer at all.

**The composition rule, which is the part that is easy to get wrong:**

```
for each SET dial:
  if it can answer for this recipe and the recipe is over the cap  → FAIL   (stop)
  if it cannot answer for this recipe                              → mark unanswered
if any FAIL          → fail
else if any unanswered → cannot say
else                   → pass
```

**A known failure outranks an unknown.** If the sink dial cannot say for
`chile-verde-slow-cooker` but the "on the table by 30 min" dial definitely fails it, the recipe
is a fail and is not shown. The alternative — any unknown promotes the recipe into "we can't
say" — would put an eight-hour braise under a heading about a thirty-minute dinner, and with
653 unanswered sinks it would put nearly the whole collection there.

## D5 — Three answers: passes shown, fails dropped, cannot-say shown below and marked

**Decided.** Results become two shelves and one sentence:

```
<ul class="results shelf">                     ← passes
<section class="unsaid shelf-group">           ← cannot say
  <h2>We can't say for these <span class="n">395</span></h2>
  <p class="blurb">Nobody wrote these down in enough detail to tell.
     They might still be what you want.</p>
  <ul class="results shelf">…</ul>
</section>
```

Fails are not rendered — that is what failing a filter means. **All three states are on screen
anyway, in the tally**, which is what makes one screenshot able to show them:

> `227 match · 42 don't · 395 we can't say`

**Marked without a legend, three ways, none of them colour:** the heading and its sentence; the
section's position, below the passes; and a per-card line naming the missing fact in plain words
— *"nobody said how long you'd stand there"*, *"nobody said what this leaves in the sink"*. A
reader who lands mid-page on one card still gets the answer from the card.

*Rejected: a badge or chip on each card* (`.clay-chip` was the obvious reach) — a chip reading
"unknown" is a legend by another name, and it costs 24px on every card in the longest list on
the site. *Rejected: dimming the unanswered cards* — opacity is a legibility cost paid by the
reader least able to afford it, and it says "lesser" where the site means "unmeasured".
*Rejected: `.clay-well` cards* — a recessed card reads as not-pressable, and these are still
links you can pick up.

The heading reuses `.shelf-group h2 / .n / .blurb`, which already exist in `site.css:720-741`
and already draw a titled shelf with a count. No new section CSS.

## D6 — Dials with no query show the passing recipes

**Decided: show them.** *What can I cook tonight* is a real question with no search term in it,
and a page that answers it with a row of counters has heard the question and declined to answer.

**Why it still reads as a front door.** The default page — no query, no dial — is unchanged down
to the byte: counter row visible, tally reading `Press / to search 664 recipes`. Only turning a
dial replaces it, which is the same trade the search box already makes. And the result of
turning one dial is not a database dump: the passes are capped at 60 with a visible remainder,
exactly as search is capped today, and the cannot-say shelf is capped at 12.

**Caps and their copy.** Search's remainder line reads *"and N more — keep typing"*. With dials
and no query that is wrong advice, so the line becomes:

- passes over 60 → `and 167 more — turn a dial down, or search`
- cannot-say over 12 → `and 383 more we can't say for`

Capping is not silent dropping: the count is printed, and the tally has already said 395.
*Rejected: rendering all 395* — that is 395 `<li>`s and, at 375px, about 25,000px of page.
*Rejected: no cap at all on the cannot-say shelf* — the section's job is to be seen and counted,
not browsed.

## D7 — The URL is either silent or it is the whole state

**Decided.** Four params: `q`, `standing`, `by`, `wash`. Values are the numbers the dial
carries — `?standing=15&by=60&q=beans`. Written with `history.replaceState`.

**The write policy**, which is what keeps criterion 11 (`search behaviour unchanged when no dial
is set`) true:

> The URL is written whenever a dial changes, and — **only if the URL already carries a finder
> param** — whenever the query changes.

So a pristine front page plus typing writes nothing, exactly as today. The first dial press
takes ownership of the URL and from then on the URL is the complete state, query included.
Clearing every dial back to `Any` rewrites the URL to just `?q=…`, or to the bare path when the
box is empty. There is never a stale param.

*Rejected: `pushState`* — one history entry per dial press turns Back into an undo stack for a
control that has an "Any" stop already, and thirteen presses would bury the page the reader
arrived from. *Rejected: syncing `q` unconditionally* — it is a strictly nicer behaviour and it
is a change to the search behaviour on a page with no dial set, which the criteria forbid.

**Reading is validated, not trusted.** `?standing=7` is not a stop this dial has. An unrecognised
value falls back to `Any` rather than being honoured, because a page showing a list its own
controls cannot reproduce is worse than a link that degrades. Same for `?wash=-1`, `?by=abc`.

## D8 — Ship the sink dial, knowing it can answer for 11 recipes

**Decided: ship it**, because the ticket and S-010 both name it as one of the three, and because
it is the clearest demonstration the three-answer design will ever get: set it and **653 of 664
recipes go to "we can't say"**, which is the literal truth of the annotation today.

T-010-01's review flags this as concern 3 — *"a dial that filters on it hides 98% of the shelf"*.
It does not hide them. It shows them, under a heading that says nobody wrote it down. That is
the difference this whole story is about, and the sink dial is where it is visible at full scale.
T-008-03 annotates the pool; the dial's stops (1/3/5) are chosen for that pool rather than for
today's eleven rows.

## D9 — The labels, and what they beat

The dial names are S-010's own words, and every rejection below is a phrase that was live in
some draft of this repository or in the category around it.

| kept | rejected, and why |
| --- | --- |
| **Time you're standing there** | *Active time* — a stopwatch category. *Hands-on* — the code's word (`handsOnMinutes`, `attentionOf`) and recipe-site jargon; nobody says it at a table. *Effort* — a rating wearing a noun. *Attention* — what `schedule.ts` calls it internally; a code word is not a reader word. |
| **On the table by** | *Total time* — the site refuses to let elapsed be the headline (S-010: "elapsed time is the wrong axis"). *Ready in* — a promise the recipe makes; this is a cap **the reader** sets, and the preposition is the whole difference. *Duration*, *Cook time* — category words. |
| **Things to wash** | *Washing up* — the property's name, a gerund where the reader wants a count. *Cleanup* — vague and American. *Dishes* — collides with the plates you eat off, and with "dish" meaning the food. |
| **Any** (the off stop) | *All*, *No limit*, *—*. "Any" is what you would say. |
| **We can't say for these** | *Unknown*, *Unrated*, *Insufficient data*, *Not enough information* — the first three are labels for the data and the fourth is a form letter. |

Absent from the entire UI, by rule: *difficulty*, *easy/medium/hard*, *score*, *rating*, *level*,
*quick*, *effort*, *filter*. There is no composite anywhere — the three figures are never added,
averaged, weighted or ranked against each other, in the markup or in the module behind it.

## D10 — The tally is the live region, debounced on typing and immediate on a press

**Decided.** `<p class="tally" aria-live="polite">` stays exactly where it is and keeps being the
one thing that speaks. Two write paths:

- **a dial press** writes the tally immediately — one deliberate action, one announcement;
- **a keystroke** renders the list immediately and writes the tally after **350 ms of quiet**.

350 ms sits above a fast typist's inter-key gap (~150 ms) and below the ~500 ms at which a
number visibly lags its input. Typing `pasta` announces once, not five times.

*Rejected: a second `visually-hidden` live region* with the visible tally left un-live. It is the
textbook pattern and it is a worse fit here: the criterion asks for **the tally's** live region,
and two elements holding the same count is the "say it once" rule broken in markup.
*Rejected: debouncing the render* — the list lagging the box by a third of a second reads as a
broken page.

## D11 — Keyboard: real buttons, no roving tabindex

**Decided.** Twelve `<button type="button">` elements, each independently tab-reachable,
Space/Enter to press, `aria-pressed` carrying state, `role="group"` + `aria-labelledby` naming
the dial. This is `list.astro`'s multiplier dial exactly (`:995-1009`), and `AddToPlan.astro:6`
argues the `aria-pressed` half of it: state that is one thing a screen reader reads, rather than
a label that changes underneath the reader.

*Rejected: the ARIA radiogroup pattern* with roving tabindex and arrow keys. It is arguably more
correct for one-of-N, and it would be the site's **second** interaction model for a control that
already exists and already works. Twelve tab stops on the front page is a real cost; a reader
who has learned the list page's dial and finds the front page's dial behaves differently is a
larger one. If the pattern changes it should change in both places, in a ticket that owns both.

Names are `<span id>` + `aria-labelledby`, not `<label>`: `check-touch.mjs` measures a `<label>`
as the union of itself and the control it speaks for, and a `<label>` speaking for nothing is
measured alone — a 19px name over a 44px row would fail the check for saying the right thing.

## D12 — Where the code lives

**Decided.** Three files:

- `src/pages/index.astro` — markup, and the client script that wires it.
- `src/components/dials.ts` — a pure module: the stop tables, the three answerability rules, the
  verdict function, the URL codec, the card copy. No DOM, no imports from Astro.
- `src/components/dials.test.ts` — its tests, plus properties over all 664 recipes.

**Why not `src/lib/`,** where every other pure module in this repo lives. The ticket's last
criterion lists what may be modified and `src/lib/**` is not on it; `src/components/**` is. The
repo has the same situation solved once already — `src/pages/_search.json.test.ts` sits outside
`src/lib/` and opens with a paragraph explaining why. `dials.ts` gets the same paragraph. If a
later ticket owns both trees, moving it is a rename.

It imports `formatDuration` from `src/lib/time.ts` and `BREAK_MINUTES` from `src/lib/schedule.ts`
— reads, not writes, and reusing the site's one duration format rather than inventing a second.

**Not a `.astro` component.** The dials' markup is 40 lines of static HTML that belongs beside
the finder it sits inside, and the behaviour is one script that already exists in `index.astro`
and has to see both the box and the dials. Splitting the markup into `Dials.astro` and leaving
the script behind buys a file boundary and pays for it with a script reaching across it.

## D13 — Styles: revive the dead filter block as the dial

`site.css:300-340` already defines `.filters` (a wrapping flex row) and `.filter` (a pressable
pill with `aria-pressed='true'` styling, a `.n` count span and the house focus ring). **Nothing
in the repository uses them** — `grep 'class="filter'` over `src/` and `dist/` is empty and
`git log -S` puts them in the first commit. They are a filter-chip vocabulary written before
there was a filter.

**Decided:** replace that block with `.dials` / `.dial-set` / `.dial`, drawn as `list.astro`
draws its multiplier dial — a `--clay-well` track with `--clay-shadow-well`, transparent
buttons, the pressed one on `--clay-primary` with `--clay-shadow-raised`. Leaving two chip
vocabularies in one stylesheet, one of them dead, is worse than either.

Every value comes from the nine kit tokens plus `color-mix`. The only media query is
`max-width: 34rem`, already a named breakpoint, where the buttons take `min-height: 44px` — the
same `display: inline-flex; align-items: center; min-height: 44px` shape `site.css` writes for
`.site-bar a` and `list.astro` writes for `.dial button`. At 375px a dial's four buttons wrap
inside a flex row, so nothing can reach past the edge.
