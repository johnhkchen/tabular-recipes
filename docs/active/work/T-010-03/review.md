# T-010-03 — Review

The three dials were run against all 685 recipes and every result was read. **143 of the 227
recipes the filter recommends for a tired evening are wrong for it**, and the largest single reason
is that it cannot tell dinner from a spice blend.

Two files changed, both under `docs/gaps/`. No `.cook` file, no `src/`, no `scripts/`, no dial
added.

This is the fourth attempt at the ticket. The first carried it through Research to Implement and
blocked in Review on one criterion — `npm run verify:mobile` had never been observed passing,
because other tickets rebuilding `dist/` kept invalidating the sweep mid-read. **This attempt did
two things: re-ran both suites on a quiet tree, and re-derived every headline number in the two
documents from the shipped build rather than trusting the earlier session's harness.**

---

## What changed

| file | | what |
| --- | ---: | --- |
| `docs/gaps/filter.md` | new, 424 | what the filter cannot say — eight things, each with its evidence, plus the vocabulary findings and a ranked list of what would close them |
| `docs/gaps/README.md` | +56 | per-dial coverage as fractions of 685, what the filter looks like at that coverage, and a pointer to the new page |

Eight commits, all through `lisa commit-ticket` with exact `--include` paths, and
`git show --stat` on each confirms **every one touches only those two files**:

`b1e1128` `3bdd021` `80b6d22` `b30443b` `f2bd7cc` `368ec32` `30d773d` `9cf7a07`

`git status --porcelain -- src/ scripts/ recipes/ docs/gaps/` is empty. `git diff HEAD --
src/lib/time.ts` is empty. Nothing ticket-owned is left staged, modified or untracked.

## Every headline number re-derived this attempt

The earlier session measured through a harness that imported `src/lib/` directly. This attempt
re-measured against **`dist/search.json` — the file the browser actually fetches** — so the two
paths are independent. Every figure reproduces:

| claim in the documents | re-measured | |
| --- | --- | :-: |
| 685 recipes | `find recipes -name '*.cook'` → 685; `search.json` → 685 records | ✓ |
| standing dial answers for 269 (39.3%) | `evidence !== 'unknown'` → 269 | ✓ |
| clock answers for 661 (96.5%) | `elapsedMinutes > 0` → 661 | ✓ |
| sink answers for 177 (25.8%) | `washingUpCount !== null` → 177 | ✓ |
| confidence states 46 · 223 · 416 | stated 46, inferred 223, unknown 416 | ✓ |
| the scenario splits 227 · 42 · 416 | `standing ≤ 15` → 227 pass, 42 fail, 416 unanswerable | ✓ |
| gumbo 4th of 685 at 49 unbroken min, `stated` | rendang 60 · mujaddara 52 · french-onion 50 · **gumbo 49** | ✓ |
| `longest === handsOn` on 625 of 685 (91.2%) | 625 | ✓ |
| three rescued recipes, all `unknown` | 42/22, 45/25, 45/30 — all `evidence: unknown` | ✓ |
| the qualifier prints on 35 · 19 unanswerable · 16 left · 5 pass | at the site's own `BREAK_MINUTES = 5`: **35 · 19 · 16 · 5** | ✓ |
| 70 distinct named timers, 20 in neither word list | 70 and 20, through `time.ts`'s own `normalise()` | ✓ |
| `~preheat`: 7 recipes, 215 minutes, invisible to the clock | 7 timers, 215 min; `margherita` elapsed = **7** | ✓ |
| only 35 of the 227 passes have every operation timed | `untimedCount === 0` among the passes → 35 | ✓ |
| `crab-rangoon` 3 min / `inferred`, `flour-tortillas` 0.75 min / `inferred` | 3 min, 2 untimed; 0.75 min, 3 untimed; both `inferred` | ✓ |

One correction to a figure quoted in the first attempt's review: the twenty unknown timer names
carry **1,386 minutes**, not *"over 1,100"*. The documents say *over 1,100*, which is true and
conservative; the exact number is recorded here.

**One number was checked, found to differ, and deliberately left alone.** `filter.md` says 26 of
the 227 passes serve exactly two; the index field says 27. The extra one is `lime-pickle`, which
writes `servings: 2 cups` — a volume, which the site parses to the number 2. The sentence is about
how many people a dish feeds, so **26 is the truer number for the claim being made** and changing
it to match the field would make the sentence less true. Recorded here so the next reader who runs
the same query does not think they have found a bug.

## The findings, in the order a reviewer should read them

**1. The confidence state holds where it was supposed to, and has a hole beside it.** No recipe
with assumed minutes is answerable on the standing dial — checked over all 685 real files, not
fixtures. But `handsOnEvidence()` fires its trap rule only when `handsOnMinutes === 0`; one
recognised timer anywhere turns it off. **Only 35 of the 227 passes have every operation timed.**
`flour-tortillas` reports **0.75 minutes** of standing for rolling twelve tortillas by hand and
`crab-rangoon` **3 minutes** for sealing twenty-four wonton purses, and both say `inferred`. That
is the ticket's requested headline finding.

**2. Twenty timer names the vocabulary does not know.** The collection writes 70 distinct timer
names; twenty are in neither `UNATTENDED` nor `HANDS_ON`, carrying 1,386 minutes. A name in
neither set is not a claim, so the read falls through to the step's words and lands on
`confidence: unknown`. **Naming a timer with a word the list does not know is currently worse than
leaving it unnamed** — the exact failure `time.ts`'s own header describes for `~blind bake`.
`reduce` + `thicken` alone would move 31 recipes, take 16 off the unanswerable shelf, let 18 more
pass, and make **zero** newly fail. **None applied** — each proposal is written up with its
counter-evidence (`nikujaga` and `red-braised-pork-belly` spoon liquid through their `~reduce`).

**3. `~preheat` never reaches the clock.** Seven recipes, 215 minutes, and `elapsedMinutes` sees
none of it. `margherita` reads as a **seven-minute dish**. Found on the dial with 96.5% coverage —
the one nobody was auditing.

**4. The dark-roux check passes.** `gumbo` is 4th at 49 unbroken minutes with `evidence: stated`.
The three above it are two 100%-and-94%-assumed figures and one inferred. Read with the evidence
column beside it, gumbo is first, and that diagnosis is given rather than a bare tick.

**5. The fourth number rescues three recipes and prints on about five cards.** All three rescued
recipes really are broken up, read one at a time. All three are `evidence: unknown`, so their card
is never drawn. It is not failing; it is waiting for annotation.

**6. The air-fryer shelf cannot be recommended at all.** All 21 read `unknown`. Reading the files
rather than the numbers changed what this finding says, and the change is recorded: the untimed
work is not all seconds — `air-fryer-chips` opens with five minutes of cutting and drying
potatoes. So it is the floor case again, not a false *cannot say*.

**7. Four things the filter cannot say beyond the four the ticket named** — whether it is dinner
(112 of the 143 wrong verdicts), how many it feeds (`servings` is on all 685 files and is not in
the index), whether the standing figure is a floor, and whether twenty minutes is even a setting
(it is not — the stops are 5, 15, 30, and the two nearest are 33 recipes apart). `cookware` is on
588 of 685 and is not in the index either. Neither is an annotation gap; both are a gap in which
nine keys `search.json.ts` was given.

## Test coverage

**This ticket adds no test, deliberately**, and that judgement is worth restating because it is
the one place a reviewer might expect code. Every criterion here is a finding about the collection
as it stands. An exact-count assertion on a branch where five tickets are adding recipes is a
tripwire, not a guard — T-010-02's review records making exactly that mistake and repairing it
within one session. The count moved again during this ticket's own life: the first attempt ran
1,105 tests, this one 1,229.

The structural invariants that *would* survive are already asserted in `dials.test.ts` over the
whole collection — *no recipe passes a dial that cannot answer for it*, *every recipe gets exactly
one of three answers* — and **this audit found no counter-example to either.** The filter's logic
is correct. What is wrong is underneath it.

**Two facts found here would make good tests, and both are about code this ticket does not own:**

1. `handsOnEvidence()` returns `inferred` for untimed hands-shaped work beside timed work. A test
   naming `crab-rangoon` belongs in `schedule.test.ts`, in the ticket that fixes it.
2. Every timer name written in the collection is in `UNATTENDED ∪ HANDS_ON`. A real invariant,
   failing on twenty names today, belonging in `time.test.ts` in the ticket that adds them.

Both are written up in `filter.md` so the next ticket does not have to rediscover them.

## Verification — both suites, this attempt, one after the other

Run as the two literal commands the acceptance criteria name, exit codes captured from `npm`
directly rather than off a pipeline.

```
$ npm run verify
  Test Files  21 passed (21)
       Tests  1229 passed (1229)
  astro build ✓ · check-menus ✓
VERIFY_RC=0

$ npm run verify:mobile
  [build] 710 page(s) built
  2130 page views at 375px, 390px, 768px — nothing scrolls sideways.
  2130 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px,
  the table says when it continues, and the pinned column stays below 44rem.
VERIFY_MOBILE_RC=0
```

**Both are the scripts' own clean-pass sentences, and both legs swept the full 2,130 page views.**
`grep -c 'changed while this was reading'` over the whole run is **0** — the concurrency guard that
invalidated the first attempt's four tries never fired, and `pgrep -f 'astro build'` was empty
throughout. Exit codes were captured from `npm` directly rather than off a pipeline, which is how
an earlier aborted run once came to be recorded as passing.

**This is what the first attempt blocked on, and it is now met by the exact command the criterion
names.** Nothing in the work changed to achieve it; the branch was quiet.

## Open concerns

1. **The 227 verdicts are a judgement, and 112 of the 143 rest on one call** — that a person asking
   *what can I cook tonight* is not answered by a spice blend or a loaf. Both sets are printed in
   full by slug in `progress.md` with counts broken out by reason, so a reviewer who disagrees can
   subtract and get a different headline. The three softest individual calls are named there too.
   This is the intended affordance, not a hedge.
2. **`filter.md` is 424 lines against a gap-page average of about 130.** It carries a findings
   report and a *what it could not stock* section at once. Splitting the vocabulary section out
   would make it read as a plan rather than a finding, which is the opposite of true.
3. **The `README.md` `## Build state` block is stale and was left stale.** It says 664 recipes and
   894 tests. It also says in its own text that it was measured after T-007-05, which is this
   repository's convention for a number that was true on a Tuesday. Rewriting it would claim
   S-007's measurement as this ticket's. The new section carries its own date and basis and says
   the block above it is stale.
4. **Five of the twelve floor recipes are counted under *not dinner*** in the verdict breakdown,
   because a verdict takes the first reason that applies and they were already out. Said in
   `filter.md` where the table is, so the two counts of twelve are not mistaken for the same twelve.
5. **Nothing here was pressed in a browser.** Every count comes from the modules the browser
   fetches, and this attempt re-took them from the shipped `search.json` for that reason, but no
   dial was turned by hand for this ticket. The screenshots that would show it are T-010-02's.
6. **Every fraction is dated 7 August 2026 against 685 recipes.** The structural findings — the
   twenty names, the floor case, the preheat — do not move when a recipe is added. The fractions do.

## Evidence against each acceptance criterion

| criterion | evidence |
| --- | --- |
| scenario run, **every** result read, verdict per recipe, slugs not a summary | `progress.md` — all 227 by slug in five reason-labelled groups; standard fixed in `design.md` D2 |
| recipes that pass and should not, with the confidence state | `filter.md` *Whether the standing figure is a figure or a floor* — 12 named, all `inferred`. **The confidence state failed to catch them, and that is the headline** |
| recipes that fail and should not, with the timer or word, cross-referenced against the withheld-words list | `filter.md` *Twenty timer names…* and *Two recipes where an interval is read as a duration*; `churn` set beside `dry`/`press`/`boil` |
| proposed additions written up, **not applied** | `git diff HEAD -- src/lib/time.ts` empty; each proposal carries measured impact and counter-evidence |
| dark-roux check run; gumbo diagnosed if not near the top | `filter.md` — 4th of 685, re-confirmed here, with the two assumed figures above it diagnosed |
| high hands-on + short longest, read and confirmed broken up | `filter.md` — 3 recipes, all confirmed, all unanswerable; qualifier prints on 5 cards |
| per-dial coverage as a fraction of the collection, in `docs/gaps/README.md` | `README.md` *What the three dials can answer for* — 269 / 661 / 177 of **685**, re-confirmed here |
| a page recording what the filter cannot say, ≥ the four candidates | `docs/gaps/filter.md` — the four, plus four found by running it |
| no dial added, no `.cook` file edited | eight commits, two files, both under `docs/gaps/` |
| `npm run verify` | **green** — 21 files, 1,229 tests, `VERIFY_RC=0` |
| `npm run verify:mobile` | **green** — both legs clean at 2,130 page views, `VERIFY_MOBILE_RC=0`, zero guard aborts |
| only `docs/gaps/README.md`, the new page and the work directory modified | `git status --porcelain -- src/ scripts/ recipes/ docs/gaps/` empty |
