# What the season left

Seven stories landed between S-007 and S-013 and every one of them deliberately left findings
behind rather than fixing them in flight. This is those findings, read as one thing: **29 work
directories, `T-007-01` through `T-013-03`, every artifact in each.**

**The ranking here is by cost and certainty, not by importance.** Three bands, and the axis is
*can this be fixed without an argument*. A corrected sentence in a gap page sits above a broken
filter, because the sentence is one edit nobody would dispute and the filter is a season of
somebody's decisions. Read the order as a work queue, not as a priority list — and read the first
section, which is neither.

**Every finding names the ticket it came from.** A finding without its source is a rumour, and the
whole value of this page is that a reader can go back to the evidence.

Measured on 7 August 2026 against **685 recipes**, with `npm run verify` green: 685 files draw a
table, 1,229 tests in 21 files, 710 pages build, 22 counters print 930 slugs.

---

## The finding that is not in a band

**143 of the 227 recipes the filter recommends for a tired evening are wrong for it, and the
largest single cause is that it cannot tell dinner from a spice blend.**

*Source:* T-010-03, `docs/gaps/filter.md`. Re-measured here against the shipped `dist/search.json`
rather than carried: at the story's own scenario — *under twenty minutes standing there*, set at
the nearest stop the dial has — the collection splits **227 pass · 42 fail · 416 we can't say**,
and reading all 227 as a tired cook found **72 right for the evening, 12 borderline, 143 wrong.**
**112 of the 143 fail on one call**: that a person asking *what can I cook tonight* is not answered
by a spice blend or a loaf.

This is not in a band because the bands sort by whether a fix is in dispute, and this finding has
no single fix. Ranked among the mechanical items it would sit below a stale sentence; ranked among
*needs an argument* it would sit beside a naming question. Both are the burial the ticket that
commissioned this page forbade.

### What it implies for S-010's dials

Three consequences, each measurable, none of them a proposal.

1. **The dial the story shipped is not the axis that decides the verdicts.** The 143 fail on *is
   it dinner*, *how many does it feed*, and *is the standing figure a floor*. No dial reads any of
   the three. `servings` is on all 685 files and `cookware` on 588, and neither is in the index —
   which is a gap in the nine keys `search.json.ts` was given, not an annotation gap.
2. **The confidence state has a hole beside it.** `handsOnEvidence()` fires its trap rule only
   when `handsOnMinutes === 0`, so one recognised timer anywhere turns it off. **Only 35 of the 227
   passes have every operation timed.** `flour-tortillas` reports 0.75 minutes of standing for
   rolling twelve tortillas by hand and `crab-rangoon` 3 minutes for sealing twenty-four wonton
   purses, and both say `inferred`.
3. **The dial with 96.5% coverage is the one nobody was auditing.** `~preheat` never reaches
   `elapsedMinutes` — seven recipes, 215 minutes — so `margherita` reads as a seven-minute dish.

The per-dial coverage the filter is working at is already recorded in
[README.md](README.md#what-the-three-dials-can-answer-for) and reproduces exactly here: standing
**269 of 685 (39.3%)**, clock **661 (96.5%)**, sink **177 (25.8%)**; confidence **stated 46 ·
inferred 223 · unknown 416**.

---

## What each of the twenty-nine contributed

*Nothing new* is a legitimate answer and it appears below. T-009-04 is the clearest case: it was
commissioned to migrate 33 references and found none of them worth migrating.

**S-007 — the cha chaan teng.**

| ticket | what it contributed |
| --- | --- |
| T-007-01 | Opened the counter, wrote the `counters.md` entry and a 24-rank gap page. Five open concerns; four are still live below. |
| T-007-02 | Retired The Soup Pot — 16 files deleted, 8 rehomed, the counter removed. Named two stale slug citations outside its own scope. |
| T-007-03 | Eight drinks and toasts, every milk-tea number sourced. Named four verbs missing from `VERB_ICONS` and two corrections `cha-chaan-teng.md` still needs. |
| T-007-04 | Fourteen plates and bowls. Found that a full-width prose row cannot contain a comma, and that this is written down nowhere. |
| T-007-05 | Shelved 27, aisled the tins, rewrote the tally to 21 rows. **Found that the borrow mechanism dropped five listed slugs silently.** |
| T-007-06 | Made a listed-but-unshelved slug a build failure and added `check-menus.mjs` to `verify`. Left four stale-prose findings. |

**S-008 — washing-up and the basket.**

| ticket | what it contributed |
| --- | --- |
| T-008-01 | Built `washing-up` end to end. Found the collection holds no Instant Pot recipe that browns in a separate pan, and that the chopping-board rule makes S-008's own gate example score 1 rather than 2. |
| T-008-02 | Opened The Air Fryer & the Pot. **The gate admits 0 of the 118 recipes on the three shelves that already promise less work.** Shipped nineteen ranked times as `[to establish]` rather than invent them. |
| T-008-03 | Annotated 145 files, 11 → 177 declared. **The kit axis says almost nothing about the sink** — the slow cooker washes more sixteen times in twenty and fewer never. Its measurements live in a `findings.md` that was never published. |
| T-008-04 | Wrote the 21 basket recipes. **Found the `~air fry` latent defect in `src/lib/time.ts`** that all 21 depend on. Disagreed with the gap page about the drawer and followed it anyway, and said so. |
| T-008-05 | Shelved the 21 and said plainly it is four short of 25. Settled the drawer. Re-derived the tally to 22 rows. |

**S-009 — the label above its step.**

| ticket | what it contributed |
| --- | --- |
| T-009-01 | Taught the build the inline `>> step:` form. Six failure rules, three of them beyond the ticket's three, each a measured silent-corruption path. |
| T-009-02 | Moved 2,771 of 2,771 labels across 643 files with a byte-identical dump. **Screen A: 0 of 264 candidate files depended on the prose-step counting bug.** |
| T-009-03 | Removed the numbered form; closed its entry in `README.md` and recorded the `@&(~N)` decision. Left `voice.md` in this directory still teaching the dead syntax. |
| T-009-04 | **Nothing new on the migration** — 0 of 33 absolute references were mechanical, and a misdirected one fails the build 30 times out of 30. Added a real check for a reference the parser cannot resolve. Its `naming-steps-proposal.md` was never published. |

**S-010 — the three dials.**

| ticket | what it contributed |
| --- | --- |
| T-010-01 | Derived `longestHandsOnMinutes` and put five fields in the search index. Found 17 recipes where the longest unbroken stretch exceeds the elapsed clock. |
| T-010-02 | Built the three dials with three answers rather than two. **Recorded that an exact-count assertion on a shared branch is a tripwire across everybody else's `verify`.** The dials cost about 270px above the counter row on a phone. |
| T-010-03 | Ran the scenario and read all 227. **The finding above.** Twenty timer names in neither word list; `~preheat` invisible to the clock. |

**S-011 — what doubling costs.**

| ticket | what it contributed |
| --- | --- |
| T-011-01 | Wrote `docs/knowledge/scaling.md`. Found the vessel-cost identity nobody asked for: a vessel that binds on a wait is expensive, one that binds on work is free. |
| T-011-02 | Built `capacity` and `costOf()`. **`parse-recipes.mjs` still does not throw on `capacityProblem`** where it throws on the other four. Found `r ≥ m` false in a corner. |
| T-011-03 | Annotated 46 capacities. **98 files are area-bounded and unmeasured** — its own strongest follow-up. `carnitas` reports a negative vessel cost. |
| T-011-04 | Built `keeps`, annotated 138, withdrew five deliberately. Flagged `lengua`'s `slack` line carrying a keeping fact, and that there is no variant roll-up. |
| T-011-05 | Put the cost sentence on `/list/`. **Two `scaling.md` §6 phrasebook rows are unusable as written.** The `×N` dial and `serves 4 → 12` still print notation on that page. |
| T-011-06 | Built the situation control. **Five pan-bound dishes have no capacity, so the page tells a cook the pan doesn't care.** Two phrasebooks now exist and should be one. The front door lost the fold at 375px. |

**S-012 — who is cooking.**

| ticket | what it contributed |
| --- | --- |
| T-012-01 | Wrote `docs/knowledge/cooks.md`. Found `schedule.ts`'s parallel assumption is a bug for two of the three cooks and a feature for the third. |
| T-012-02 | Read 685 against the three cooks. **130 distinct plants and only 23 that ever carry a dish; 2 recipes one person can cook with no trip to the shop.** Verdict for two of its four ranked capabilities: *write food before writing features.* |

**S-013 — cooking for a moment.**

| ticket | what it contributed |
| --- | --- |
| T-013-01 | Wrote `docs/knowledge/occasions.md`. **A profile that weights hands-on positively rewards the recipe nobody annotated.** Also: there is no mooncake recipe. |
| T-013-02 | Built the meal model. **The worked seven-dish meal reports 13.75 hands-on minutes for a whole afternoon** — the machinery is right and the shelf cannot feed it. |
| T-013-03 | Ran two inverting profiles: ρ = −0.591, and the inversion test passes. **The party profile is confounded with written servings.** `birista` declares `1 1/2 cups` and becomes the #2 party dish. Named three errors in `occasions.md` and did not edit it. |

---

## Mechanical

**This band was T-014-02's entire scope.** Twelve findings. Each is one edit two reasonable people
would make the same way, each carries the command that verifies it, and none moves a recipe
between shelves, changes a declared number, or rewrites an argument.

Findings that look like this band and are not are in the next one, with the test they failed.

> **T-014-02 has worked this band: twelve applied, one pushed back.** The band opened at thirteen.
> The `## Build state` finding failed the first test — two reasonable people do not make the same
> edit to a dated measurement — and is now in *needs an argument* below, with the reason. Three of
> the twelve carried an error in their own text (the file named, or the arithmetic in the verify
> command); each is corrected in place below and accounted for in
> `docs/active/work/T-014-02/`, which holds the command and its output for every one of the twelve.

### Stale prose in a page, contradicted by the built site

- **`one-pot.md`'s `## What it has` omits the five soups S-007 moved there.** They print correctly
  on the menu because `src/data/counters.json` has them under *Quick soups that go with dinner* —
  which is backwards, since these pages are the source the JSON is folded from. It is the last
  drift on the whole board. *Source:* T-007-02 §2, T-007-06 §3, T-008-05 §6.4.
  *Verify:* `node scripts/menu-sections.mjs | grep 'One Pot'` → `ok One Pot: 5 sections, 73/73 placed`
  (today: `4 sections, 68/73 placed`, with five `unplaced`).

- **`cha-chaan-teng.md`'s borrow section describes a mechanism that was removed.** Five cells read
  *listed, not rendering*, and the prose says a borrowed slug is *"dropped from the page"*,
  *"silently, with nothing failing"*, and that *"the counter prints 22"*. All five are shelved and
  rendering, and the counter prints 27. Its `## What it has` block is correct, so nothing is broken
  — only the words. *Source:* T-007-06 §1.
  *Verify:* `grep -c 'listed, not rendering' docs/gaps/cha-chaan-teng.md` → `0`, and
  `grep -o '<p class="count">[^<]*' dist/menu/cha-chaan-teng/index.html` → `27 recipes`.

- **`cha-chaan-teng.md:127` says *"No source states a ratio"* about the tea blend, and one does.**
  自由時報 — a source the page already cites — states 幼茶65%、粗茶25%、中茶10%. T-007-03 handed the
  correction to T-007-05 and it was never applied. *Source:* T-007-03 §4.
  *Verify:* `grep -c 'No source states a ratio' docs/gaps/cha-chaan-teng.md` → `0`.

- **`voice.md` in this directory still teaches `>> step.N:`** at lines 191, 194, 201, 213 and 215.
  The form was removed by T-009-03 and the checker now refuses it. The page is a dated measurement
  record, so the fix is a dated note saying the syntax is gone — **not** a rewrite of the
  measurements. *Source:* T-009-03 §1.
  *Verify:* the note is present and `npm run verify` is unchanged; `grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l` → `0` is the fact it records.

- **`docs/knowledge/scaling.md` §9 says *"there is no air fryer recipe, so the second pole in §7 is
  an illustration"*.** There are 21, and the illustration's hypothetical figures are within a
  couple of minutes of the real `air-fryer-chicken-wings`. **Only the false sentence is
  mechanical**; rewriting §7 from a real file is in the next band. *Source:* T-011-03 §7,
  T-011-01 §1.
  *Verify:* `grep -c 'no air fryer recipe' docs/knowledge/scaling.md` → `0`, and
  `node -e "const R=require('./src/generated/recipes.json');console.log(R.filter(r=>r.kit==='Air Fryer').length)"` → `13` files declaring the kit across a 21-recipe shelf.
  **T-014-02 correction:** that grep reaches **two** sites, not one — §9's sentence and the same
  claim inside §7 at line 403. Repairing §9 alone leaves the identical false clause forty lines
  above it and returns `1`. Both clauses were corrected; §7's illustration — its figures, its pole
  and its arithmetic — was not touched, because rewriting it is the *needs an argument* row below.

### A number a document states and the build contradicts

- **`docs/gaps/README.md` says the coverage report prints `3 of 1074`; it prints `4/1086`.** The
  extra name is `leftover pizza`, which T-008-05 left in the `other` aisle on purpose because no
  shop sells it — so the bullet's *"they are now the only three"* is still true of the three names
  that are not food, and only the figure moved. *Source:* T-007-05 §4, T-008-05 §6.5.
  **T-014-02 correction:** this said `README.md`; the sentence is in `docs/gaps/README.md:395`.
  *Verify:* `npx vitest run src/lib/shopping.test.ts --reporter=verbose 2>&1 | grep 'have no aisle'`
  → `4/1086 ingredients have no aisle`.

- **`docs/knowledge/occasions.md` says `0 capacities declared` in three places** — lines 213, 393
  and 539 — and it is 46. T-013-03 found this and deliberately did not edit a file it did not own.
  *Source:* T-013-03 §9.2 item 1.
  *Verify:* `node -e "const R=require('./src/generated/recipes.json');console.log(R.filter(r=>r.capacity).length)"`
  → `46`, and the three sites agree.

### A dead slug or a dead syntax still named in a live file

- **`scripts/measure-pages.mjs:6` uses `ching-bo-leung-soup` as its `--slug` usage example**, and
  T-007-02 deleted that file. The example now prints nothing. Line 30 cites the same slug inside a
  dated baseline note describing a build of commit `1ae1165` and **stays true of it** — the fix is
  line 6 only. *Source:* T-007-02 §3.
  *Verify:* `node scripts/measure-pages.mjs --slug <the replacement>` prints a count rather than
  nothing.

- **`README.md`'s list of things the build refuses rather than draws wrong has a third member that
  is not written down.** T-009-04 added an error for an `@&(…)` reference the parser cannot
  resolve, and did not add the bullet because its scope line permitted a README edit only *"if the
  syntax changed"*. It recommends the one-line follow-up in as many words. *Source:* T-009-04 §1.
  *Verify:* the bullet is present and `npm run verify` is unchanged.

- **`docs/gaps/air-fryer-and-pot.md`'s last section is titled `## What a table cannot hold`; the
  other twenty-one counter pages use `## What it could not stock`,** and the README's
  *items a table cannot express* figure is derived off that heading — so the new counter's eight
  entries are invisible to it. T-007-05 renamed `cha-chaan-teng.md`'s heading for exactly this
  reason and recorded it as a deviation. *Source:* T-007-05 §7, T-008-02 §5.
  *Verify:* `grep -l '^## What it could not stock' docs/gaps/*.md | wc -l` → `22`, and the derived
  bullet count moves from **155 across 21 pages** to **163 across 22** against the README's stated
  158.
  **T-014-02 correction:** that count was **already 22** before the rename and is **23** after it.
  The 22 were 21 counter pages plus `filter.md`, which borrows the heading deliberately and is not
  a counter; `soup-pot.md` is retired and uses a third wording. The rename was applied and the
  eight entries are now reachable by the derivation for the first time. **The README's 158 was not
  changed** — that file says in as many words that the figure is carried forward rather than
  re-derived, so replacing it with a derivation asserts that the derivation is the right way to
  count, which is a claim and not a correction.

### A one-line ratchet the ticket that found it could not reach

- **`src/lib/time.ts` does not know `airfry`, and 21 recipes read correctly only because of a word
  order.** `air fry` is in neither `UNATTENDED` nor `HANDS_ON`, so a `~air fry{}` timer falls
  through to its step's words, and *fry* is `HANDS_ON`. Every basket cell happens to open with
  `roast`, which `readWords` reaches first. **Reorder any basket cell so `roast` falls after the
  clock and that recipe silently becomes twenty minutes of standing at a machine you can walk away
  from.** The fix is `'airfry'` in `UNATTENDED`, exactly as T-002-01 added the four pressure names
  before any pressure recipe existed. *Source:* T-008-04 §6.1, T-008-05 §6.1.
  *Verify:* **measured here, on a scratch copy of `HEAD` so nothing was applied** — dump
  `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`, `assumedHandsOnMinutes`, `untimedCount`
  and `longestHandsOnMinutes` for all 685 recipes with and without the line: **the diff is empty.**
  It changes no figure today and removes the latent defect. If the diff is ever non-empty, the
  finding is not mechanical and belongs in the next band.

- **`scripts/parse-recipes.mjs` does not throw on `capacityProblem`.** It throws on
  `slackProblem`, `washingUpProblem`, `keepsProblem` and the step-label problems. `check-recipes.mjs`
  fails on the same problem and runs first in `npm run verify`, so nothing malformed can ship
  today — but a bare `npm run build` reads a half-written capacity as absent. Two tickets named
  this and neither owned the file. *Source:* T-011-02 §1, T-011-03 §2.
  *Verify:* a throwaway `.cook` carrying `>> capacity: 2` with no vessel makes `npm run recipes`
  exit non-zero; `npm run verify` over the real collection is unchanged.

---

## Needs an argument

Real, understood, and each waiting on a decision somebody would want to make deliberately.
Grouped by the kind of decision, because that is what makes the list usable.

### Pushed back out of *mechanical* by T-014-02

- **`docs/gaps/README.md`'s `## Build state` block is S-007's and is out by a season.** It says
  664 recipes, 894 tests in 11 files, 688 pages, 904 counter assignments, timers in 640,
  washing-up in 11, and 45 `kit:` files. The build says **685 · 1,229 in 21 · 710 · 930 · 661 ·
  177 · 58** (25 Instant Pot, 20 Slow Cooker, 13 Air Fryer). *Source:* T-010-03 §3, which left it
  stale deliberately and said so; banded mechanical by T-014-01.
  **Why it moved:** it fails the first test — two reasonable people do not make the same edit.
  The block says twice that it is S-007's (its own line 37, and again at line 76); the current
  figures already sit forty lines below it under *What the three dials can answer for*, correctly
  dated; and its closing paragraph is not figures at all but S-007's arithmetic — *658 at the
  start, minus the sixteen 老火湯, plus the eight and the fourteen* — which is true of S-007 and
  which a refresh deletes. So one reader refreshes the block, another keeps the record. **The
  decision is general**: it settles what happens to every dated block on the board, including
  `voice.md` §5, `scaling.md`'s 664-recipe figures, and this page's own dated fractions.
  **Also corrected:** the finding said `README.md`. The root `README.md` carries no build figures
  at all, so the *stale front-door number* argument it was banded on does not apply to the file it
  is actually in.

### The record itself

- **The record cites evidence that was never published.** Fifteen of the twenty-nine work
  directories cite, in backticks, filenames that exist nowhere in the repository — and only two
  directories, `T-012-02` and `T-013-03`, contain any artifact beyond the seven RDSPI files. The
  cases where the missing file *is* an acceptance criterion's evidence:
  `T-008-03/findings.md` (its own review says seven of eleven criteria are reported there),
  `T-009-04/naming-steps-proposal.md` (an entire criterion), `T-011-06/six-over-three.md` (the
  verdict per recipe for the six-over-three list), `T-011-05/before-after.md`, and the five
  screenshots under `shots/` that T-010-02 and T-011-05 cite for their one-screenshot criteria —
  `shots/` is empty. T-008-05 §6.5 spotted the pattern and worked around it by printing its
  scripts inline. **The decision is whether Lisa publishes the whole attempt directory or whether
  a criterion's evidence must be inlined into a phase artifact**, and it is a workflow decision,
  not a documentation one. *Source:* T-008-03, T-008-05 §6.5, T-009-01, T-009-02, T-009-04,
  T-010-02, T-011-05, T-011-06, T-013-03.

### Counter decisions

- **The chopping board.** T-008-01 excluded the knife and board from `washing-up` because every
  recipe would list them; S-008's own illustration of two-or-fewer is *"The pot and a chopping
  board"*, which under that boundary scores **1**, not 2, so the air fryer gate reads looser than
  the story's sentence implies. T-008-01 §4.2 and T-008-03 §5.1 both flagged it and nobody has
  ruled. **Every washing-up number in the collection was produced under this boundary.**
  *Source:* T-008-01, T-008-03.

- **Bar 1 has never excluded a recipe on its own.** Of 685 recipes, 640 fail bar 2, 14 fail bar 3
  alone, and bar 1 alone excludes zero. It is unreadable on 508 of 685 files. T-008-05 costed three
  options on the page — tighten to ≤ 1 (admits three of the twenty-one), rule on the chopping
  board, or drop bar 1 and keep `washing-up` as the thing the shelf prints. All three are counter
  decisions. *Source:* T-008-05 §4.1.

- **Does One Pot promise one pan or one sink?** Eight of its 73 wash three or more, re-measured
  here and unchanged from T-008-03: `chile-verde` (4), `country-fried-steak` (4),
  `beef-bourguignon`, `soy-sauce-chicken`, `tinga-de-pollo`, `tortilla-espanola`,
  `white-cut-chicken`, `wonton-soup` (3 each). Nothing was re-shelved and nothing should be
  without an answer to the question. *Source:* T-008-03 §4.1, T-008-05 §5.

- **Five counters still have no `docs/knowledge/counters.md` entry** — The Bowl Shop, Instant Pot,
  One Pot, Japanese Home Cooking and The Slow Cooker, every appliance-and-format shelf on the
  board. *Source:* T-008-02 §5.

### A declared number somebody has to own

Each of these is one line and each fails the mechanical bar on the same test: it changes a number
or a level a recipe declares.

- **`birista` declares `>> servings: 1 1/2 cups`.** `servingsOf()` takes the leading number and
  returns 1, so a cup and a half of fried shallots scales by twelve and becomes the **#2
  dumpling-party dish in the whole collection**. `lime-pickle` has the same shape at `2 cups`.
  *Source:* T-013-03 §2, T-010-03.
- **`lengua`'s `slack` reason carries a keeping fact** — *"reheating does not get it back"* — which
  belongs in `keeps`. *Source:* T-011-04 §2. A wider sweep run here finds **28 files** whose
  `slack` reason names a fridge, a leftover or a reheat while carrying no `keeps` line;
  `curry-beef-brisket`, `hong-kong-borscht`, `whitefish-salad`, `chopped-liver` and `harissa` are
  the clearest. Moving any of them edits a declared `slack` line.
- **`batata-harra`'s two properties disagree about one vessel.** `>> capacity: 2 — four cups of oil
  in the pan, fry` against `>> washing-up: the frying pot, …`, and its own step 4 says *"in the
  pan"*. It is the only cross-property wording contradiction in the collection. Which word is
  right is exactly the argument the mechanical bar excludes. *Source:* found here; the check is in
  *Do the new properties agree with each other* below.

### The annotation the machinery is waiting on

Three tickets independently called their version of this their strongest follow-up.

- **98 files are area-bounded and unmeasured** — sheet pans, cookie sheets, steamers, steels,
  griddles, irons. Every one is a surface where crowding changes the dish and not one says how full
  it is. Annotatable the moment their files say what the baskets say, at about 60 more capacities.
  *Source:* T-011-03 §4.
- **Five pan-bound dishes have no capacity, so `/list/` tells a cook the pan doesn't care** —
  `tortilla-espanola` (144 minutes standing at eighteen), `paella`, `jalfrezi`, `bhuna`,
  `sausage-and-peppers`. The model is right; the annotation is missing. The same gap shows as
  sibling inconsistency: `beef-bourguignon` says *feeds eighteen without taking any longer* while
  `beef-bourguignon-instant-pot` says *six lots*. *Source:* T-011-06 finding 3.
- **The hand-work nobody timed.** T-013-02's worked seven-dish holiday meal reports **13.75
  hands-on minutes for the whole afternoon**; five of the seven report zero and sixteen operations
  are untimed. T-013-01 reached the same wall from the ranking side: `har-gow`, `siu-mai` and
  `xiao-long-bao`, the three purest per-unit hand-labour dishes on the shelf, report zero hands-on
  minutes because their shaping steps carry no timer. **T-012-02's *write food before writing
  features* verdict does not cover this** — nothing has to be written, only measured.
  *Source:* T-013-02 §4, T-013-01 finding 1.
- **Eleven files say *in batches* without a count** and their siblings that say *two* got a
  capacity: `karaage`, `french-fries`, all three `chile-verde` variants,
  `braised-short-ribs-slow-cooker`, `lamb-tagine-slow-cooker`, `sambousek`, `onion-bhaji`,
  `kibbeh`, `nixtamalised-masa`. One word per file, and the word is a claim about cooking.
  *Source:* T-011-03 §5.

### Two things that should be one

- **There are two phrasebooks.** `src/components/scaling-words.ts` (T-011-05) says the nine
  findings for the recipe page from a `RawRecipe` and a `Cost`; `src/components/situation.ts`
  (T-011-06) says them for the front page from an index entry. They were written concurrently and
  agree on the load-bearing thing. They should be one module, split into a finding-namer and a
  `wordsFor(kind, numbers)`, and neither ticket could have done it. *Source:* T-011-06 §1.
- **There is no variant roll-up for the new properties, and the split is now measurable.** **24
  dish groups declare `keeps` on one variant and are silent on its sibling** — `air-fryer-chips`
  keeps and `french-fries` does not, `boston-baked-beans-instant-pot` keeps and the plain one does
  not — and **19 do the same for `capacity`**. `washing-up` has **zero** such splits, because
  T-008-03 annotated the plain siblings on purpose. T-011-04 §5 declined the roll-up for the right
  reason: one value beside a silent sibling reads as a claim about the silent one. That reason is
  now a measured 43 pairs. *Source:* T-011-04 §5; measured here.

### Vocabulary that changes a reading

- **Twenty timer names are in neither `UNATTENDED` nor `HANDS_ON`**, carrying 1,386 minutes across
  a collection that writes 70 distinct timer names. A name in neither set is not a claim, so the
  read falls through to the step's words and lands on `unknown` — **naming a timer with a word the
  list does not know is currently worse than leaving it unnamed.** `reduce` + `thicken` alone would
  move 31 recipes, take 16 off the unanswerable shelf, let 18 more pass and make **zero** newly
  fail; T-010-03 wrote each proposal up with its counter-evidence and applied none.
  *Source:* T-010-03 finding 2.
- **`~preheat` never reaches the clock** — seven recipes, 215 minutes, `margherita` reading as a
  seven-minute dish. Whether a preheat is elapsed time is a decision. *Source:* T-010-03 finding 3.
- **`shake` has no icon and ten cells wanted it.** The air fryer's own verb; the cells say *toss
  the basket* instead. Adding `shake: 'stir'` to `VERB_ICONS` enables something rather than fixing
  something, which is why it is here and not above. *Source:* T-008-04 §6.2.
- **Seven permanent `unaccountedCookware` advisories** — a `#fork{}`, three `#potato masher{}`, two
  `#immersion blender{}` — all utensils the convention excludes, all printing `ok` forever. A
  utensil entry in `NEVER_WASHED` silences them, and deciding what counts as a utensil is the
  argument. *Source:* T-008-03 §3.
- **A full-width prose row cannot contain a comma and this is written down nowhere.**
  `cleanLabel()` replaces every comma with a space, so a comma'd sentence renders as run-on prose.
  The checker measures the row's length and never its readability. Two answers — change the
  function or document the rule — and they are different tickets. *Source:* T-007-04 §2.
- **The preheat convention exists as 21 copies of one sentence** and belongs in
  `docs/knowledge/`. *Source:* T-008-04 §6.3, T-008-05 §6.5.

### Arguments inside a knowledge file

Each of these is a sentence a reader would act on and each sits inside somebody's argument, which
is why correcting it is not mechanical.

- **`scaling.md` §2 says `r ≥ m` always, and it is false in a corner.** With `s = 4, c = 3, n = 8`,
  `r = 1.5 < m = 2`. Reproduced on real data: `batches.costMinutes` goes to **−2 minutes** on both
  `carnitas` files. `elapsed` is unaffected, and `longestGrowth()` already takes `max(m, r)` because
  of it — but a field a page might print should probably not go below zero.
  *Source:* T-011-02 §2, T-011-03 §3.
- **Two `scaling.md` §6 phrasebook rows cannot be used as written.** *"It goes in three lots, and
  that is the only difference"* means the vessel's own share, and a reader has no such comparison —
  on a page it claims the whole evening is unchanged, which is false for all 24 recipes it would
  reach. And *"three times the batches, and three times as long standing there"* is false on every
  recipe that would reach it, because all 22 baskets report **zero** standing minutes.
  *Source:* T-011-05 §4.2.
- **`occasions.md` §3.5's combined table ranks four recipes its own gates reject** —
  `smoked-turkey-breast`, `turkey-brine`, `siu-mai`, `xiao-long-bao`. And **§3.6's claimed-minutes
  rule constrains `standing` and says nothing about `longest`**, which the party profile also
  weights positively and which has no assumed-minutes counterpart to subtract, so a fallback minute
  barred from one term still pays into the other. *Source:* T-013-03 §9.2 items 2 and 3.
- **The party profile is confounded with written servings.** At a fixed target of twelve, `costOf()`
  scales hands-on work by `wanted / written`, so a profile whose only large positive term is
  `standing(12)` partly ranks recipes by how small a batch the file was written for — seven of its
  top ten are written for four or fewer, two for one. T-013-03 does not know how much of
  ρ = −0.591 survives a per-serving rate, and says so. *Source:* T-013-03 §1.
- **`scaling.md` §7's air fryer pole should be rewritten from a real file.** Its own §9 asks for it.
  The hypothetical came within two minutes of the real `air-fryer-chicken-wings`, which is a good
  sign and not a reason to keep a hypothetical. *Source:* T-011-01 §1, T-011-03 §7.

### Aisles, where each has a different right answer

- **`fermented red bean curd` resolves to *Dairy & eggs* on the pattern `curd`.** It is a jar, used
  by exactly one file. *Source:* T-007-05 §8.
- **`Hong Kong milk tea` is a made-at-home component written as an ingredient line and resolves to
  *Dairy* on `milk`.** The convention elsewhere is a pattern per component; the honest fix is
  probably in `yuenyeung` rather than in the aisle list. *Source:* T-007-05 §4.
- **`evaporated milk` sits in the cold case on a coin toss.** `dairy` and `baking` carry the
  identical two-word pattern, so the tie breaks on file order. Nothing is wrong today; re-order
  `aisles.json` and a tin moves with no test failing. *Source:* T-007-05 §3.

### Already ranked, and still true

- **The category tree.** Pickles live in two folders, `coleslaw` and `barbecue-slaw` are filed as
  dressings though `salads/` exists, `cha-lua` is in `stews-and-braises/` and is a cold cut,
  `nixtamalised-masa` is the only non-pastry file in `pastry-and-doughs/`. Thirteen files, no URL
  changes. It is gap 1 in [README.md](README.md#the-five-gaps-to-fill-first) and nothing this
  season touched it. *Source:* T-001-18, T-003-07.
- **Nothing enforces the tag vocabulary, and the number has grown.** See the re-run below. It is
  gap 2 and it is now bigger than when it was ranked. *Source:* T-001-18.

### Two front-page decisions from this season

- **The front door lost the fold at 375px.** The first counter card sat at ≈695px before S-011 and
  sits at **820** after — 8px below an 812px fold. T-011-06 proposes putting the three dials behind
  a disclosure, closed by default, which needs T-010-02's argument about always-visible dials
  revisited. *Source:* T-011-06, T-010-02 §1.
- **The multiplier dial still prints notation.** `/list/` ships `×1/2 ×1 ×2 ×3` from
  `formatMultiplier()` and `serves 4 → 12` from `servingsText`, both verified in the shipped
  bundle. T-011-05 read S-011's ban as governing the sentences the model produces and left the
  older control alone, and flagged the reading rather than guessing. *Source:* T-011-05 §4.1.

---

## Needs food

The collection has to grow before these can be acted on.

**T-012-02 is the authority and its verdict covers exactly two of them.** That reading ranked four
capabilities and concluded that for **balance** (rank 3) and **the fridge** (rank 4) the honest
answer is *write food before writing features*. It did **not** reach that verdict for hand-off
(rank 1, 34 recipes today) or rotation (rank 2, eleven nights) — both are feedable now.

- **Balance.** Counted from ingredient lists rather than folder names, the collection uses **130
  distinct plants and only 23 of them ever carry a dish**. **16 non-starch vegetable sides** and
  **47 savoury dishes built on a non-starch plant**, against **101 sweets**. **14 pulse dishes** a
  person would call dinner. The forty-eight plants the shopping lists buy and no recipe is ever
  about are the work, and each one is one table. *Source:* T-012-02. **Covered by the verdict.**
- **The fridge, for one person.** **2 recipes** — a malted milk drink and an egg sandwich — that
  one person can cook for one or two with no trip to the shop. Four sensitivity runs and the
  answer does not move. *Source:* T-012-02. **Covered by the verdict.**
- **The Air Fryer & the Pot is 21, four short of the twenty-five S-008 asked for.** The four are
  four recipes, not a bar: six ranked pressure dishes (eggs, rice, lentils, kitchari, mujaddara,
  polenta) are unwritten, and seekh kabab became writable at two things once T-008-05 settled the
  drawer. **None of them needs a bar to move.** *Source:* T-008-05 §4.1.
- **The holiday occasion: open after five recipes.** T-013-03 recommends opening it once five named
  dishes exist, and recommends **not** opening the dumpling party — whose blocker it identifies as
  annotation rather than food, which is why the party sits in the band above rather than this one.
  Also recorded: there is no mooncake recipe, so the seasonal-board set is two of three.
  *Source:* T-013-03 §7, T-013-01.

And the food already ranked in [README.md](README.md#the-five-gaps-to-fill-first) — the toasted
dried-chile purée, buttercream and a cream cheese frosting, a dark roux and a trinity base, the
Vietnamese baguette, wor tip, cebolla y cilantro, youtiao and 咖喱汁 — is unchanged. Nothing this
season wrote any of it and nothing this season made any of it less wanted.

---

## Does the tag vocabulary still hold

**No. 615 distinct tags at 685 recipes, against 503 at 514 when the vocabulary was last folded —
and the folding has come apart in three separate ways.**

The last fold was **T-001-18**, not T-002-09: `T-001-18/review.md:52`, `structure.md:160` and
`progress.md:101` all carry `527 → 503` and the 24 concepts across 51 files, and `T-002-09`
contains none of those numbers. The finding is real and the source is one story earlier than the
ticket commissioning this page believed.

Re-run with **T-001-18's own verifier**, quoted from its `plan.md:113-124` — fold accents,
lowercase, strip non-alphanumerics, group, print the collisions:

| | then (514 recipes) | now (685 recipes) |
| --- | --: | --: |
| distinct tags | 527 → **503** after the fold | **615** |
| tag uses | — | 3,575 |
| collisions that verifier can see | **0** | **3** — `no-cook`/`no cook`, `make-ahead`/`make ahead`, `one-pot`/`one pot` |

Those three are the exact check T-001-18 drove to `[]`, and it has come back. Adding the
singularisation its research describes but its verifier does not implement finds **13 groups**:

```
black beans/black bean · carrot/carrots · chiles/chile · dumpling/dumplings · eggs/egg
hazelnuts/hazelnut · make-ahead/make ahead · no-cook/no cook · one-pot/one pot
onion/onions · peanut/peanuts · prawns/prawn · rolls/roll
```

And the verb/participle and spelling pairs neither normaliser can see, from T-001-18's own
hand-checked list: **`pan-fry`/`pan-fried`, `simmer`/`simmered`, `toasted`/`toasting`** — three
more, plus `no-cook`/`no cook` already counted above.

**Sixteen split concepts, across 243 files.** Tags feed the front-page search alongside `aka` and
ingredient names, so a split concept silently halves a query. `chiles` is used 43 times and
`chile` once — a searcher who types the singular gets one recipe. **Nothing enforces it**, which is
what T-001-18 said would happen and is why *a tag checker* is gap 2. The fold itself is
straightforward; the checker that keeps it folded is the job, and it has to know the difference
between a spelling variant and two real concepts.

*Verify:* `node` over `src/generated/recipes.json` with T-001-18's normaliser; the full script and
its output are in `progress.md`.

---

## Do the new properties agree with each other

`slack`, `washing-up`, `capacity` and `keeps` were each added by a different story, and a property
that disagrees with another is invisible from inside either one. Six checks, over
`src/generated/recipes.json`. **Coverage first, because every result below is a statement about the
files that answered:** slack **416**, washing-up **177**, capacity **46**, keeps **138**, and
**229 of 685 declare none of the four**. Thirty-nine files declare all four.

| # | the check that was run | result |
| --- | --- | --- |
| 1 | a `capacity` whose vessel word appears nowhere in the same file's `washing-up` list | **1 of the 42 that declare both** — `batata-harra` |
| 2 | a `capacity` on a file with no `washing-up` line at all | **4** — `fried-chicken`, `soy-sauce-pan-fried-noodles`, `dansak`, `beef-with-broccoli`. Not a contradiction; a coverage hole |
| 3 | a `keeps` span on a file whose `slack` reason says it cannot be held | **none found** |
| 4 | a `washing-up` count contradicting its counter's promise | **8 of 73 on One Pot wash three or more** (listed above, unchanged from T-008-03); **0 of 21 on the air fryer shelf exceed the gate's two**, and none exceeds 45 minutes |
| 5 | a `washing-up` count of 1 on a file naming three or more pieces of cookware | **1** — `carnitas`, which names a Dutch oven, a broiler and an oven, and washes the pot. Correct: the appliances are not washed |
| 6 | a dish group where one variant declares a property and its sibling is silent | **`keeps` 24 groups · `capacity` 19 · `washing-up` 0** |

**One real contradiction, and it is a word.** `batata-harra` writes
`>> capacity: 2 — four cups of oil in the pan, fry` and `>> washing-up: the frying pot, …`, and its
own step 4 says *"in the pan"*. Two of the file's three mentions say pan and one says pot. It is
one word and it is in the band above this one, because deciding which word is right is an argument
about the recipe rather than a correction to it.

**Everything else came back clean**, and check 6 is the finding rather than a defect: it is
T-011-04's *no variant roll-up* concern turned into 43 named pairs.

**Air fryer keeps, checked because it looked wrong and is not.** Seven basket recipes declare a
two- or three-day keep on a shelf whose whole point is a crisp edge. Every one says in its own
character text what happens — *"cold thigh meat is good and cold basket skin is leather"* — so the
property is doing the job the frame was built for rather than contradicting the shelf.

---

## Did each story's headline claim survive

Each claim is the story's own bolded thesis, checked against the **built site** rather than against
the work artifact that made it.

| story | the claim, in its own words | checked against `dist/` | verdict |
| --- | --- | --- | --- |
| **S-007** | The Soup Pot comes down and *"a Hong Kong cha chaan teng"* replaces it — a counter you can shop for | `/menu/soup-pot/` does not exist; `/menu/cha-chaan-teng/` prints **27 recipes** in five sections; the aisle report finds **4 of 1086** ingredients unplaced and all four are equipment or leftovers, not food | **held** |
| **S-008** | *"The Air Fryer & the Pot — plug one in, eat, wash two things"*, at about twenty-five recipes | `/menu/air-fryer-and-pot/` builds with four sections and **21** items; **0 of 21** declare more than two things to wash and none exceeds 45 minutes | **held on the promise, short on the number** — 21 against about 25, and T-008-05 says so in the page's first line |
| **S-009** | The override moves onto the line above its step, and *"every operation label on every page must be byte-identical"* | `grep -rn '^>> *step\.' recipes` → **0**; **2,892** inline `>> step:` lines; a probe file carrying the numbered form is refused by name with the fixer named | **held**, on the observable residue — the byte-identical claim was proved by T-009-02 and T-009-03 against baselines that no longer exist |
| **S-010** | *"Three dials, each of which is a real measurement, each of which the reader sets for themselves"*, and no difficulty score | `dist/index.html` carries `data-dial="standing"`, `="by"`, `="wash"` and 21 `aria-pressed` stops; the shipped script says *we can't say*; no *difficulty*, *easy* or *score* anywhere on the page | **held** — and the finding at the top of this page is about what the dials cannot ask, not about the dials |
| **S-011** | The site *"lies about what scaling costs"*, and *"never O(·) on a page a cook reads"* | `/list/` ships real cost sentences — *"It goes in three lots, and that costs you about 22 min"* — and **zero** `O(1)`/`O(n)`; but the multiplier dial still ships `×1/2 ×1 ×2 ×3` and `serves ${n} →` | **held with a caveat** — the lie is fixed, the notation ban holds for the sentences and not for the older controls beside them |
| **S-012** | *"This story writes down who is cooking and what the shelf actually offers them. It builds no feature."* | `docs/knowledge/cooks.md` and `docs/gaps/what-the-shelf-offers.md` exist; neither ticket committed a line under `src/`, `scripts/` or `recipes/` | **held** |
| **S-013** | *"It builds the system. It opens no counter."* | `src/data/counters.json` holds **22** counters, unchanged; `occasions.md` and `two-that-invert.md` exist; `src/lib/meal.ts` and `stations.ts` are new and nothing on the site reads them | **held** |

**Two of the seven are worth a second look and neither is a failure.** S-008's number is short and
the page that reports it leads with the shortfall. S-011's caveat is a reading of its own ban that
T-011-05 flagged rather than resolved, and is in the band above.

---

## What this page is not

It is not a plan and it makes no proposal. It is not ranked by importance — the axis is cost and
certainty, which is why a corrected sentence sits above a broken filter and why the largest finding
of the season is not in a band at all.

It is not a re-derivation of the three earlier consolidations. Where a finding already sits in
[README.md](README.md) from T-001-18, T-002-09 or T-003-07 it is named here and left there.

And **no fix of any kind was applied to produce it.** Every measurement above was taken from the
build or from a scratch copy of `HEAD`; `git status --porcelain` limited to `recipes/`, `src/`,
`scripts/` and `src/data/` was empty before the reading and is empty after it.
