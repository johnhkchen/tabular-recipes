# T-003-07 — Review

Read 658 recipes as one collection, backfilled the slack property where it decides something,
fixed one clock that was lying, corrected one alias, and rewrote three gap notes. **Fifteen
commits, 315 files, one line of source.**

## What changed

| What | Files | Why |
| --- | --: | --- |
| `>> slack:` added | **296** `.cook` | The backfill. Coverage 101 → 397 declared. |
| `>> aka:` corrected | 1 `.cook` | `corned-beef-slow-cooker` had drifted onto another dish's name |
| `src/lib/time.ts` | 1 | `parboil` was reading as time a cook stands there |
| `docs/gaps/soup-pot.md` · `japanese-home.md` · `slow-cooker.md` | 3 | Rewritten against the shelf as it now is |

**Only one file outside `recipes/` and `docs/` changed: `src/lib/time.ts`.** That answers the
criterion asking this artifact to name each such file and say why — the list is one long, and the
why is below. `counters.json`, `aisles.json`, `schedule.ts`, `slack.ts` and `collection.test.ts`
were all read against the data and found correct or out of scope.

`git status --porcelain` leaves nothing of this ticket's staged, modified or untracked.

---

## Acceptance criteria, against evidence

### `npm run verify` passes in full ✅

```
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 658 named, 0 inferred from category · timers in 635 · pairings 760
 Test Files  8 passed (8)      Tests  825 passed (825)
[build] 682 page(s) built in 979ms
```

682 pages, the same count T-002-09 recorded. This ticket added no pages.

### The slack backfill — how many, how chosen, how many remain ⚠️ *see the concern below*

**296 annotated. 101 → 397 declared. 261 remain undeclared.**

**How they were chosen.** Three measured predicates, unioned, then audited:

1. **A long cook** — `buildSchedule().unattendedMinutes >= 120`. 157 files. Measured, not judged.
   This is the ticket's third rule and it swept in most of the first two: every bread with a bulk
   ferment, every custard with a chill, every cure, every pickle, every stock, every braise.
2. **Pressure** — every `kit: Instant Pot` file, 25 of them. Not one declared a slack, because
   S-002 wrote all 25 before T-003-02 built the property. That was the sharpest hole on the shelf
   and it was in the newest files, not the oldest.
3. **A short window that closes** — the set no measurement reaches: emulsions that break, sugar
   past its colour, a foam that deflates, a grain past al dente, an egg past set, a spice past
   fragrant. Enumerated by hand, because there is no number for it.

Then two passes of my own work: everything on the three new shelves that arrived by shelving
rather than writing (9 files), and an audit of what remained against the criterion (15 files),
which found genuine misses — `refried-beans` had no slack while its own Instant Pot sibling was
marked `unforgiving`, and five pulses-from-dry, two ground-meat kebabs and seven sealed dumplings
were undeclared.

**Levels: 93 `unforgiving`, 187 `narrow`, 117 `forgiving`.** Unsafe is always `unforgiving` —
under-done beans and under-done pork are not "worse dinner", and grading them `narrow` would be
the render telling a comfortable lie.

**What was deliberately left undeclared**, and it is most of the 261: a cookie that browns a
minute late, a vinaigrette, a sandwich, a spice mix that is only whisked, a stir-fry that is four
minutes of standing at the pan. An honest gap is better than a filled field, and the render was
built to look deliberate when the line is missing.

**Where the 261 sit**, so the next pass starts from a list rather than a number:

| Folder | Left | Folder | Left |
| --- | --: | --- | --: |
| dressings-and-dips | 27 | soups | 22 |
| stews-and-braises (mostly curries) | 24 | flatbreads-and-pancakes | 20 |
| bars-and-brownies · cakes-and-loaves · cookies | 18 each | rice-beans-and-grains | 18 |
| sauces-and-gravies | 21 | sandwiches-and-rolls | 10 |
| noodles | 12 | vegetables-and-sides | 12 |
| salads | 8 | spice-blends (the un-toasted ones) | 7 |
| everything else | ≤ 6 each | | |

### Three dishes in all three forms, with times for all nine files ✅

**Thirteen dishes exist as plain + Instant Pot + Slow Cooker.** All thirty-nine files, total
elapsed against hands-on, read off `buildSchedule()`:

| Dish | plain | Instant Pot | Slow Cooker |
| --- | --- | --- | --- |
| **beef-stew** | 2 hr 15 / **0** | 1 hr 28 / 20 min | 8 hr 37 / 37 min |
| **carnitas** | 3 hr 10 / 10 min | 1 hr 34 / 22 min | 8 hr 22 / 22 min |
| **pot-roast** | 4 hr / **0** | 2 hr 16 / 20 min | 8 hr 32 / 32 min |
| chili-con-carne | 2 hr / **0** | 1 hr 22 / 20 min | 8 hr 32 / 32 min |
| collard-greens | 2 hr 14 / 14 min | 46 min / 14 min | 7 hr 14 / 14 min |
| birria-de-res | 4 hr / **0** | 1 hr 19 / 4 min | 8 hr 5 / **5 min** |
| corned-beef | 125 hr 50 / 0 | 124 hr 30 / 0 | 132 hr 20 / 0 |
| oxtails | 3 hr 17 / 12 min | 1 hr 40 / 20 min | 9 hr 32 / 32 min |
| boston-baked-beans | 5 hr 30 / **0** | 1 hr 25 / 15 min | 9 hr / 30 min |
| braised-short-ribs | 3 hr / **0** | 1 hr 37 / 27 min | 7 hr 27 / 27 min |
| cachete | 3 hr / **0** | 1 hr 22 / 10 min | 8 hr 10 / 10 min |
| chile-verde | 2 hr 12 / 22 min | 1 hr 24 / 34 min | 8 hr 32 / 42 min |
| hungarian-goulash | 2 hr 30 / **0** | 1 hr 23 / 15 min | 8 hr 45 / 45 min |

**The choice is visibly a choice.** `beef-stew` is the clearest: 2 hr 15 tended by an oven,
1 hr 28 under a lid, 8 hr 37 while you are out. `corned-beef` is the honest outlier and reads
that way on purpose — its 125-plus hours are a five-day cure that no machine shortens, and all
three variants say so.

Every one of those pages offers both other forms in both directions; spot-checked in `dist/` on
`/beef-stew/`, `/carnitas/`, `/pot-roast/` and their six siblings.

### No new recipe reports the bulk of its duration as hands-on ✅

**12 of the 144 new files report hands-on as the majority of the work, and every one is telling
the truth.** The longest is `tortilla-espanola` at 42 minutes elapsed; the rest are
`sausage-and-peppers` 29, `nikumiso` 15, `spinach-salad` 13, `kale-caesar` 12, `kinpira-gobo` 12,
`crispy-rice-bowl` 10, `omurice` 7, `chahan` 4, `shogayaki` 4, `goma-ae` 3, `seared-halloumi` 2.
A four-minute stir-fry that reports four minutes of standing at the pan is not a defect.

**One was a defect and is fixed.** `buri-daikon` reported **30 of its 55 minutes as hands-on and
all 30 were assumed** — `time.ts` had fallen back to "you are standing there" because nobody said
otherwise. Twenty of them were `~parboil{20%min}`: a pot of rice water with daikon in it.

The ticket's rule is *the fix is a timer name or `src/lib/time.ts`, never the number.* The timer
was already named `~parboil`; the name was simply not in the vocabulary. **`parboil` added to
`UNATTENDED`.** It belongs beside `parbake`, `blindbake` and `prebake`, and it is safe from the
trap that withholds bare `boil`: the word appears in this collection only as a timer name or as
the verb opening its own step, seven times, every one of them *"bring to a boil and parboil, then
drain and rinse."*

Blast radius predicted before the edit and confirmed after: **seven timers in six files**, all
moving to `unattended` with source `name`. `buri-daikon` now reads **10 hands-on / 45
unattended**. The number was never touched.

### No two files describe the same dish under different names ✅

Three passes over all 658, none of which found a duplicate.

- **By `dish:` key.** 32 keys hold more than one file; every group is a declared kit family. Zero
  lonely variants, zero dishes with two plain ways — both asserted by `collection.test.ts`.
- **By normalised title.** Stopwords and kit words stripped, Jaccard ≥ 0.60, variants excluded:
  **17 pairs.** Every one is a paste beside its curry (`thai-red-curry-paste` ~ `thai-red-curry`),
  a component beside its dish (`char-siu` ~ `char-siu-bao`, `pad-thai` ~ `pad-thai-sauce`), or two
  genuinely different dishes sharing a word (`chicken-salad` ~ `chinese-chicken-salad`).
- **By `aka` and title collision across different dishes.** 33 keys before, **32 after**. Most are
  generic menu words doing exactly the job `aka` exists for — *grain bowl* on ten bowls, *lo fo
  tong* on sixteen old-fire soups, *gwan tong* on five quick ones. Those are genre names, not dish
  names, and they are how a person who does not know a soup's name finds it.

**One merge-shaped correction, and it is not a merge.** `crockpot corned beef and cabbage` sat on
both `corned-beef-slow-cooker` and `new-england-boiled-dinner-slow-cooker`. Read against the plain
siblings the answer is clear: `new-england-boiled-dinner` carries *corned beef and cabbage* and
`corned-beef` does not. The boiled dinner **is** that dish; `corned-beef` is a deli brisket that
gets an hour of cabbage at the end. **The alias was dropped from `corned-beef-slow-cooker`**, so
the variant matches the dish it is a variant of. Both files stay: they are different recipes and
both should exist.

`beetroot salad` on `roasted-beet-salad` and `roasted-beets` was examined and **kept on both**. A
deli case sells dressed roasted beets as beetroot salad and it also sells beets with goat cheese
and leaves as beetroot salad. A side and a composed salad, which is the `char-siu` /
`char-siu-bao` shape the collection already accepts.

### Every `pairs-with:` slug resolves ✅

**760 mutual edges. 0 dangling, 0 one-way, 0 self-pairings.** Asserted by `collection.test.ts`
and re-measured directly after the last edit.

### The three gap docs are rewritten ✅

All three rewritten against the shelf as it now is, in the before/after shape `one-pot.md` and
`instant-pot.md` use: headline count corrected, `What it has` rebuilt from `recipes.json`, written
ranks moved out of the missing list and marked with their slug, and a new closing block saying
what reading the whole collection found and what is left open.

`soup-pot.md` and `japanese-home.md` also had their `## What is already here` heading renamed to
`## What it has` — the edit each file's own text said T-003-06 would make once the `>> counters:`
lines existed, and which did not happen.

**That heading is not cosmetic.** `scripts/menu-sections.mjs` parses **only** the `What it has`
block and folds its section titles and slugs into `counters.json`, so those blocks are upstream
data, not prose. Before: three counters reported as *gap note has no "What it has" block*. After:
**`every counter parsed cleanly`**, with Soup Pot 24/24 in 3 sections, Japanese Home 38/38 in 6,
Slow Cooker 20/20 in 3 — matching `counters.json` exactly.

Two hazards found and fixed while rewriting, both of which would have silently rewritten a menu:

- `japanese-home.md` carried a **second copy of its section list inside the parsed block**, under
  `### Grouped the way this counter's sections will print`, listing every section as empty. Left
  in, a `--write` would have emptied the counter. Deleted; the sorting argument promoted to its
  own `##` heading outside the block.
- A `**Stocks.**` line in `slow-cooker.md` with an italic parenthetical was reported unparsed.
  Rewritten as prose — the shelf genuinely has no stocks, and every stock in its own candidate
  table ranks *less* against pressure.

Three first-draft claims were corrected against measurement rather than shipped: the Soup Pot's
level distribution (13/8/3, not 13/6/5), the Slow Cooker's elapsed range (`corned-beef-slow-cooker`'s
132 hours are a five-day cure and were skewing it), and the Japanese shelf's 一汁三菜 timings.

### The front-page verdict at 21 counters ✅

**The list has not stopped being usable at twenty-one. It has stopped being one list.** That is
the finding, and it is not about length.

Read off `dist/index.html`, not off the source. `src/pages/index.astro` renders one flat
`<ul class="counters">`, and `menus()` in `src/lib/counters.ts` sorts it **biggest first** — so
the row a visitor sees is:

> Bakery 107 · **The Bowl Shop 103** · Diner 77 · **One Pot 68** · Deli 62 · Meat and Three 53 ·
> Curry House 47 · Shawarma Counter 44 · **Japanese Home Cooking 38** · Taquería 34 · Pizzeria 32
> · Dim Sum 30 · Panadería 30 · Ramen Shop 27 · **Instant Pot 25** · **The Soup Pot 24** ·
> Smokehouse 21 · Thai Kitchen 21 · Takeout Counter 20 · **The Slow Cooker 20** · Phở & Bánh Mì 18

Fifteen of those answer one question — *where would I buy this if I couldn't make it at home*. Six
do not: **Instant Pot** and **The Slow Cooker** are kit, **One Pot** is a constraint, **The Soup
Pot** and **Japanese Home Cooking** are a household rather than a storefront, and **The Bowl
Shop** is a place but a new kind of one. And because the row is sorted by size, **the six are
interleaved with the fifteen** — `Instant Pot` lands between `Ramen Shop` and `The Soup Pot`,
`One Pot` between `Diner` and `Deli`. There is no visual or structural signal of the change of
kind, and nothing to scan by except the count.

The blurbs are doing more work than they should have to, and doing it well: *"Lock the lid and
walk away"*, *"Everything goes in one pan, and that is the only pan to wash"*, *"Fill it before
you leave; dinner is waiting when you get back"*. Every one is verb-forward and says what you
would do with the shelf. That is why the page still works.

**What I would do about it, for whoever takes it:** group the row rather than lengthen or prune
it — *Counters* (the fifteen places), *Kit* (Instant Pot, Slow Cooker), *Ways of cooking* (One
Pot, The Soup Pot, Japanese Home Cooking) — keeping size-descending inside each group. That is a
change to `menus()` and to `index.astro`'s single `<ul>`, and it costs nothing at the recipe
layer. It is not this ticket's job to make it, and it is this ticket's job to have noticed.

### Every file changed outside `recipes/` and `docs/` is named ✅

**One: `src/lib/time.ts`.** `parboil` added to the `UNATTENDED` vocabulary, with a comment saying
why it is safe where bare `boil` is not. Reason, blast radius and verification above.

---

## Test coverage

**No test was added, and that is the right answer for this work.** The slack property already has
`src/lib/slack.test.ts` covering the parser, and a backfill adds data, not behaviour. What guards
the data is three things that all ran:

- **`check-recipes.mjs`, per file.** An unknown level or an empty reason fails, with the file
  named. Ran on every batch's exact paths before every commit; all 296 passed first time.
- **`parse-recipes.mjs`, at build.** Throws on `slackProblem` rather than shipping a
  half-declared field to a page.
- **The level distribution.** 93/187/117 across three levels is the cheapest evidence that the
  files were actually read; a backfill running on autopilot produces one level over and over.

`src/lib/time.ts` was covered by the existing 55 tests in `time.test.ts` and `schedule.test.ts`,
green before the commit, and by `collection.test.ts`'s *never claims four unbroken hours of your
attention*, which this change can only help.

### Gaps in coverage, stated plainly

- **Nothing asserts that a `>> slack:` line is *true*.** The checker verifies the level is one of
  three and the reason is non-empty. A reason that names a wrong temperature would pass every
  gate. That is inherent to an authored field and the property's own header says so, but it is
  worth a reviewer knowing that 296 new claims entered the collection this ticket and none of them
  is machine-checkable.
- **No test asserts the three-way kit choice exists.** `collection.test.ts` checks that variants
  agree about their dish and that no dish has two plain ways; it does not check that any dish has
  three forms. The thirteen are measured in this artifact, not defended by a test.
- **No test asserts a gap note's `What it has` block matches `counters.json`.**
  `menu-sections.mjs` reports it, but it is a dry-run script nobody's CI runs. The
  `japanese-home.md` duplicate-section hazard above was found by reading, not by a gate.

---

## Open concerns

**1. The slack criterion is stronger than any bounded pass can satisfy, and 261 files remain
undeclared.** The criterion reads *every recipe with a window that closes, and every recipe whose
failure is a safety failure, declares its slack*. The ticket's own Context says the opposite in
the same breath — *this ticket does not annotate all of them; that is a judgement per file and a
pass of its own*.

I resolved it by taking the ticket's own examples as the definition — *custards, caramel,
emulsions, bread doughs; undercooked beans, undercooked pork, canning and pickling, a custard held
warm* — and covering those exhaustively, plus every long cook, plus a final audit that found
fifteen genuine misses. **I believe every safety failure in the collection now declares itself.**
I am less certain about *a window that closes*, because that phrase can be stretched to a cookie
that browns. The 261 that remain are, in my judgement, dishes where the answer does not change
what a cook does — but that is a judgement, and a reader who defines the window more widely would
find files to disagree with me about, most likely in `cookies`, `cakes-and-loaves` and
`bars-and-brownies`. The distribution above is there so they can start from the list rather than
from the number.

**2. A wrong slack reason is worse than an absent one, and 296 of them are new.** Every reason was
written from that file's own prose, steps and timers — not from general knowledge — and where a
file states a temperature or a minute count, the reason uses the file's own. Where it does not,
the reason describes the failure without inventing one. But this is 296 authored claims about what
goes wrong in a kitchen, and the only reviewer is the person reading them.

**3. `counters.json` still carries two empty sections.** *Stocks* on The Slow Cooker and *What
each thing is for* on The Soup Pot, both left from when a section was expected. Empty sections do
not render, so they cost nothing, and I did not edit `counters.json` because T-003-06 owns it and
churning it for a no-op is worse than leaving it. Both are noted in the gap docs.

**4. The Soup Pot's water rule is not enforced.** Every 老火湯 file says the liquid is water and
not stock, and `soup-pot.md` says it twice. Nothing in the build checks it. A future soup that
started from `chicken-broth` would pass every gate while quietly being a different genre. Recorded
in the gap doc's closing block; not this ticket's to build.

**5. The front page needs its own ticket.** Verdict above. Not started, deliberately.

---

## Deviations from the plan

Two, both recorded in `progress.md` with reasoning:

- **Batch boundaries moved.** The fast custards went in Batch 6 with the rest of
  `custards-and-puddings` rather than Batch 7 with the short windows. A custard is a custard.
- **Four batches ran beyond the eight planned** — 39 safety cases the three predicates did not
  reach, 19 toasted spice blends, 9 files on the new shelves that arrived by shelving, and 15 found
  by auditing my own remainder. `plan.md` sized the work at ~205 files before I had read them;
  the criterion is about what fails, not about a count agreed in advance.

One correction to `design.md`: it says the front page renders in `counters.json` declaration
order. It does not — `menus()` sorts biggest first. The verdict above is written from
`dist/index.html`.
