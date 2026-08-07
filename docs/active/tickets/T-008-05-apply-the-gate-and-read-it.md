---
id: T-008-05
story: S-008
title: apply-the-gate-and-read-it
type: task
status: done
priority: high
phase: done
depends_on: [T-008-03, T-008-04]
---

## Context

Apply the gate, shelve what passes, and then read the result honestly — including the case where
the answer is *this shelf is thinner than we hoped*.

**You own `src/data/counters.json`, `src/data/aisles.json`, `docs/gaps/air-fryer-and-pot.md`,
`docs/gaps/one-pot.md`, `docs/gaps/instant-pot.md` and `docs/gaps/README.md`.** Read all four
S-008 work artifacts in `docs/active/work/T-008-0*/` before touching anything — T-008-03's
findings in particular were written for you.

### 1. Apply the gate, mechanically

The three bars are in `docs/gaps/air-fryer-and-pot.md`: **washing-up ≤ 2**, one plug-in machine
does the cooking, and 45 minutes wall-clock. Run them over every annotated recipe and produce the
list.

**Do this as a script and paste its output**, not by reading down a list and deciding. The whole
point of S-008 is that this shelf's membership is a rule; a rule applied by hand is a judgement
with extra steps. The script does not have to ship — a scratch file in the work artifact is fine —
but the numbers in the gap page must come out of it.

Bar 2 is the one a script cannot decide alone. T-008-03 produced the list of Instant Pot recipes
that brown outside the pot; use it, and say in the work artifact where you overrode it.

### 2. Fill the sections

Fill the counter's sections with what passed, in menu order. A section may list a recipe that
never names the counter — that is how a shelf borrows, and this shelf borrows its entire
pressure-cooker half.

**Two rules that are specific to a gated shelf:**

- **Nothing goes on this shelf that did not pass the script.** Not a recipe that is obviously
  fine, not one that misses by a minute. The counter's page states its rule; an exception makes
  the rule a lie and nobody will trust the shelf again.
- **A recipe that passes does not have to be shelved here** if it reads wrong on the board — but
  say which ones you left off and why, in the gap page. That is a judgement and it is allowed;
  silently including a failure is not.

### 3. Report the number, whatever it is

S-008 said this up front and it is the acceptance criterion that matters most:

> If fewer than about twenty-five recipes clear it once the pool is annotated, the finding is
> *the gate is wrong* or *the shelf is thin*, and T-008-05 reports it. It does not loosen the
> bars quietly to fill a page.

So: state the count. If it is thin, say which bar is doing the excluding and by how much — *"14
Instant Pot recipes fail only bar 3, all of them by natural-release time"* is a finding somebody
can act on. If a bar turns out to be measuring the wrong thing, **write that down as a
recommendation for a later story rather than changing it here.** Changing the rule in the same
ticket that first measures it is how a gate becomes decoration.

### 4. Catch the new ingredients

The air fryer files bring frozen goods the collection has not carried — frozen chips, frozen
dumplings, frozen pastry — plus whatever T-008-04 used. Run the aisle-coverage test in
`src/lib/shopping.test.ts` and add patterns to `src/data/aisles.json` for the real ones.

The hazards, unchanged and easy to repeat:

- **Most-specific pattern wins across aisles, not within one.** A bare `chips` or a bare `frozen`
  added to `Freezer` can steal a product from a more specific pattern elsewhere.
- **A pack size in the wrong system says nothing.** `purchaseOf` returns null rather than compare
  grams to cups. Do not add one to make a badge appear.

### 5. Pay the property forward

`washing-up` now exists on 100-plus recipes and its first use was this one shelf. It was worth
building for the other two:

- **Update `docs/gaps/one-pot.md`.** That page has said for two stories that *"washing-up is not
  a row in a table"*. It is now. Rewrite that passage, fold in T-008-03's list of One Pot recipes
  washing three or more things, and say what should happen to them — **as a recommendation, not
  as a re-shelving.** Moving them is a counter decision and it is a later story's.
- **Update `docs/gaps/instant-pot.md`** with the brown-outside-the-pot list.
- **Say whether the kit axis survived contact.** T-008-03 compared washing-up counts for every
  `dish` with a plain and a `kit:` file. If the pressure version washes the same three things as
  the plain one, the site has been implying a saving that does not exist, and that belongs in
  `docs/gaps/README.md` where the next pass will find it.

### 6. Read the shelf

Build and open `/menu/air-fryer-and-pot`. A counter whose items all land in "Also here" has
section titles that do not match what got written — fix the placement, or the titles. Check the
menus index still reads deliberately at 23 counters.

Then check the claim. S-008's promise is *plug one in, eat, wash two things.* Verify it against
the built pages rather than asserting it: every item on the shelf, its washing-up count, its
machine and its clock, in one table. **If a single item on the shelf contradicts the blurb, the
blurb or the item is wrong** — fix whichever, and say which.

## Acceptance Criteria

- The gate is applied by a script whose output is pasted into the work artifact, with a per-bar
  breakdown of what failed and why.
- The counter has populated sections, in menu order, and **renders no "Also here" section**.
- **Every item on the shelf passes all three bars**, shown in a table of slug, washing-up count,
  machine and wall-clock time. No exceptions, and no item without a `washing-up` line.
- The total is stated plainly in `docs/gaps/air-fryer-and-pot.md`, **including if it is under 25**,
  with which bar excluded the most recipes. **No bar is changed by this ticket**; a bar that looks
  wrong is written up as a recommendation.
- Every slug listed in every section resolves to a real recipe, and
  `node scripts/menu-sections.mjs` reproduces `src/data/counters.json` from the gap page.
- The aisle-coverage test passes, and no pattern added to `aisles.json` steals a product from a
  more specific pattern elsewhere — demonstrated by diffing the resolved aisle of every ingredient
  before and after.
- `docs/gaps/one-pot.md` no longer says washing-up cannot be expressed, carries the list of its
  own recipes washing three or more, and recommends rather than performs any re-shelving.
- `docs/gaps/instant-pot.md` carries the brown-outside-the-pot list.
- `docs/gaps/README.md`'s tally covers all counters including this one, and records what the
  plain-versus-kit washing-up comparison showed.
- `npm run verify` passes end to end: every file draws a table, every recipe parses, tests green,
  every page builds, 0 orphans, 0 counters inferred from category, 0 parser warnings, 0 duplicate
  slugs.
- **No `.cook` file is edited here** — a recipe that needs a fix is a finding, not a fix.
- Only `src/data/counters.json`, `src/data/aisles.json`, `docs/gaps/air-fryer-and-pot.md`,
  `docs/gaps/one-pot.md`, `docs/gaps/instant-pot.md`, `docs/gaps/README.md` and
  `docs/active/work/T-008-05/**` are modified.
