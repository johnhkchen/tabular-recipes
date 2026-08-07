# T-010-03 — Plan

Eight steps. Steps 1–6 are measurement and were run before any file was written; steps 7–9 write
the two documents and verify. Each measurement step names the check that says it is right.

---

## Step 1 — Stand up a harness that reproduces `search.json` exactly

Import `buildSchedule` and `handsOnEvidence` from `src/lib/schedule.ts` into a scratch script and
map all 685 records of `src/generated/recipes.json` the way `search.json.ts`'s `GET()` does.
Reimplement `canAnswer` / `measure` / `verdict` from `dials.ts` line for line.

**Check:** spot-record equals the shipped one for a named slug. `adobo-para-al-pastor` reads
`elapsed 25.5 · hands 0.5 · longest 0.5 · wash null · inferred` from both.

**Why reimplement rather than import `dials.ts`:** it imports `../lib/schedule.ts` with an
explicit `.ts` extension that Astro resolves and bare node does not. Copying three one-line
functions is cheaper and less likely to drift than a resolver shim.

## Step 2 — Coverage, as fractions of the real collection size

Count, over 685: timers present, `slack` present, `washingUpCount !== null`, and each dial's
`canAnswer`. Count the three `evidence` states.

**Check:** the three evidence counts sum to 685. `canAnswer('wash')` equals the `washingUpCount`
count exactly, since they are the same test.

**Expected to disagree with the ticket text**, which names 658 files, 635 timers and 395 `slack`.
The ticket was written against an earlier tree. Report both.

## Step 3 — Run the scenario and read every result

Settings `{standing: 15}`, the nearest reachable stop to *under twenty minutes standing*. Dump
each of the 227 passes with the five facts a cook would judge on: servings, elapsed, hands-on,
category, cookware.

Classify by the rule fixed in `design.md` D2, with two hand-read override sets — the recipes whose
untimed step is minutes of shaping, and the recipes that are a stock, side, loaf, course or
drink. Print both sets in full.

**Check:** the three verdict counts sum to 227. Every override set member is a slug that appears
in the pass list.

**Also record `standing=30`** (260 · 9 · 416) so the cost of the missing 20-minute stop is a
number rather than an observation.

## Step 4 — The recipes that pass and should not

Two questions, and they have different answers.

**4a. Does the confidence state catch the assumed-minutes trap on real files?** Test: is there a
recipe with `assumedHandsOnMinutes > 0` that passes the standing dial? By construction of
`handsOnEvidence()` there cannot be — rule 3 returns `unknown` — but it is checked rather than
reasoned, because the ticket says *on real files rather than on the fixtures*.

**4b. Is there a class it does not catch?** Rank the 227 passes by untimed share, read the
untimed operation labels, and pick out the ones where that operation is minutes of shaping.

**Check for 4b:** each named recipe is opened as a `.cook` file and the untimed step read in
full. A claim that `crab-rangoon` hides fifteen minutes of folding is only worth making after
reading the line that says *"Fill @wonton wrappers{24} … pressing the corners together into a
purse"*.

## Step 5 — The recipes that fail and should not

Dump the 42 answerable failures with their largest hands-on tasks and each task's confidence.
Read for the three shapes the ticket names: a wait counted as attention, an unnamed timer, a
`~simmer` reading as standing there.

Then generalise: extract every timer **name** written anywhere in the collection and difference
it against `UNATTENDED ∪ HANDS_ON`. The names in neither set are where the next lie lives.

**Check:** the extraction finds 70 distinct names and the recognised ones are exactly the words
those two sets contain. `~air fry` normalises to `airfry` under `time.ts`'s own `normalise`.

## Step 6 — Measure each proposed word before proposing it

Copy `src/lib/*.ts` to a scratch directory, patch the copy's `UNATTENDED`, run both versions over
the same 685 records, and diff.

Report per proposal: recipes whose figures move, recipes that change evidence state, recipes
newly passing, **recipes newly failing**. The last is the safety number.

**Check:** `git status --porcelain -- src/` names no file this ticket touched, before and after.

**Stop condition:** a proposal that makes any recipe newly fail is reported with that recipe
named, not quietly dropped.

## Step 7 — The dark-roux check and the rescue check

Rank all 685 by `longestHandsOnMinutes` and find `gumbo`. Rank the top of that list with
`assumedHandsOnMinutes` beside it.

Then the other direction: recipes with high `handsOnMinutes` and a short longest stretch. Read
each one to confirm it really is broken up.

**Check:** the count of recipes where `figures()` would print the qualifier is derived from the
same `BREAK_MINUTES` the code imports, not from a repeated 5.

## Step 8 — Write `docs/gaps/filter.md`, then `docs/gaps/README.md`

In that order, per `structure.md`. Every number in the README section is copied from a table in
`filter.md`, not recomputed.

**Check:** the coverage table appears identically in both files.

## Step 9 — `npm run verify` and `npm run verify:mobile`

Neither can be affected by a change under `docs/`, so a failure is either pre-existing or another
ticket's. Attribute it rather than reporting a colour.

---

## Testing strategy

**This ticket adds no test, and that is the right answer rather than a gap to apologise for.**

Every acceptance criterion is a finding about the collection as it stands today. A test that
asserted *227 recipes pass at `standing ≤ 15`* would be red within the hour — T-010-02's review
records exactly that mistake and its repair, on this branch, under these conditions:

> The first draft asserted exact counts … both were stale within the hour. On a branch where four
> other tickets are adding recipes, an exact-count assertion is not a guard, it is a tripwire
> strung across everybody else's `npm run verify`.

The structural facts that *would* survive — *no recipe passes a dial that cannot answer for it*,
*every recipe gets exactly one of three answers* — are already asserted in `dials.test.ts` over
the whole collection, and this ticket found no counter-example to any of them.

The two facts found here that **would** make good tests are both about code this ticket does not
own:

1. `handsOnEvidence()` returns `inferred` for a recipe with untimed hands-shaped work beside timed
   work. A test naming `crab-rangoon` belongs in `schedule.test.ts` in the ticket that repairs it.
2. Every timer name written in the collection is in `UNATTENDED ∪ HANDS_ON`. That is a real
   invariant, it fails today on twenty names, and it belongs in `time.test.ts` in the ticket that
   adds them. It is written up in `filter.md` as the check that would have caught all twenty at
   once.

**Verification for this ticket is therefore:** both suites run and their state attributed; every
count reproducible from the scripts described in step 1; every hand-read judgement printed in full
so it can be disagreed with; and `git status --porcelain -- src/ scripts/ recipes/` showing this
ticket touched none of them.

## Commit plan

One `lisa commit-ticket` per document, in the order of step 8:

1. `docs/gaps/filter.md` — *Write down what the filter cannot say*
2. `docs/gaps/README.md` — *Say what fraction of the shelf each dial can answer for*

Two files, two commits, exact `--include` paths. No ordinary `git add` at any point — the working
tree already carries twenty-six files belonging to other tickets in flight, and a broad add would
take them.
