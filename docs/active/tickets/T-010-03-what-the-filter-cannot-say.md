---
id: T-010-03
story: S-010
title: what-the-filter-cannot-say
type: task
status: done
priority: high
phase: done
depends_on: [T-010-02]
---

## Context

Run the dials against the whole collection and find out where they lie. A filter is a claim about
658 recipes at once, and this is the first pass that has ever been able to check that claim
against the food.

**You own `docs/gaps/README.md` and a new page recording what the filter cannot say.** Read
T-010-01's five worked pairs and T-010-02's confidence design first.

**No `.cook` file is edited here.** Everything this ticket finds is a finding.

### 1. Turn the dials and read the results as a cook

Set the filter to the story's own scenario — *a long day, cooking for two, under twenty minutes
standing there* — and read the whole result list.

Then answer the only question that matters: **would a tired person be glad to see each of these?**

The failures to hunt for, and each is a different bug:

- **A recipe that passes and should not.** Its hands-on figure is low because its steps never said
  how long they take, not because it is easy. These are the ones the confidence state is supposed
  to catch; check that it does, on real files rather than on the fixtures.
- **A recipe that fails and should not.** A long unattended wait counted as attention because a
  timer was unnamed, or a `~simmer` that reads as standing there. `src/lib/time.ts` carries a long
  argued list of words that mean a wait when named and something else when spotted loose in a
  sentence — every one of them *"was caught lying"*. **Expect to catch more.** Each is a
  one-recipe fix or a one-word addition to that list, and it is a finding either way.
- **A recipe that passes on the numbers and is obviously wrong for the evening.** This is the
  interesting one, because it is where the three dials are not enough. Something that needs a
  stand mixer, a marinade started yesterday, a shopping trip for one ingredient. **Do not add a
  dial.** Write it down.

### 2. Check the longest-stretch number against the food

T-010-01 derived it and tested it against constructed cases. Now check it against real cooking.

`docs/gaps/one-pot.md` names the reference case: a dark roux is *"flour and fat taken to milk
chocolate over 30 to 45 minutes of continuous stirring… hands-on time from end to end."* If the
gumbo line does not come back as the longest unbroken stretch in the collection, the number is
measuring something other than what it says.

Do the same in the other direction: find the recipes with the highest `handsOnMinutes` and the
*shortest* longest-stretch, and check by reading them that they really are broken up. Those are
the dishes the fourth number exists to rescue, and if it is not rescuing them it is not earning
its place.

### 3. Report the coverage plainly

The dials are only as good as what has been annotated, and three of the numbers have very
different coverage:

- Timers: 635 of 658 files.
- `slack`: 395 of 658.
- `washing-up`: whatever S-008 reached — roughly 100 plus the air fryer files.

**Say what fraction of the collection each dial can actually answer for, and what the filter looks
like at that coverage.** If the washing-up dial can speak for a sixth of the shelf, a reader
turning it is mostly filtering by who got annotated. That may be acceptable for now; it is not
acceptable unsaid, and it belongs in `docs/gaps/README.md` where the next pass looks for work.

### 4. Write down what the filter cannot say

Every gap page in this repo carries a *what it could not stock* section, and that habit is why
this collection is honest about itself. The filter needs the same page.

Candidates, and the list will grow as you use it:

- **Whether you have the equipment.** A recipe needing a stand mixer or a pressure cooker is not
  a fifteen-minute recipe in a kitchen without one.
- **Whether it started yesterday.** A marinade, a soak, a prove. The clock counts it as elapsed
  time, which is right, and a person deciding at six o'clock cannot use it at all.
- **Whether the shopping is done.** The single most common reason a recipe is wrong for tonight,
  and the site has a shopping list but no idea what is in the reader's cupboard.
- **How tired the reader actually is.** Twenty minutes of chopping is not twenty minutes of
  whisking. Nothing in the data knows the difference.

## Acceptance Criteria

- The story's scenario is run against the built site and **every result is read**, with a verdict
  per recipe: right for the evening, wrong, or borderline. Slugs, not a summary.
- A list of every recipe that **passes on the numbers and should not**, with the reason and which
  confidence state it was in. If the confidence state failed to catch any of them, that is the
  ticket's headline finding.
- A list of every recipe that **fails and should not**, with the timer or word that caused it,
  cross-referenced against the withheld-words list in `src/lib/time.ts`. Proposed additions to
  that list are written up, **not applied** — that file is argued line by line and a change to it
  is its own ticket.
- The dark-roux check is run: the recipes with the longest unbroken hands-on stretch are listed,
  and if the gumbo line is not near the top, the number is diagnosed rather than accepted.
- A list of recipes with high total hands-on and a short longest stretch, read and confirmed to
  really be broken up. If they are not, the fourth number is not earning its place and that is
  said.
- **Per-dial coverage is stated as a fraction of 658**, with what the filter looks like at that
  coverage, and it is recorded in `docs/gaps/README.md`.
- A page recording what the filter cannot say, in the shape of the gap pages'
  *what it could not stock* sections, with at least the four candidates above and whatever else
  turned up.
- No dial is added and no `.cook` file is edited. Everything found is a finding.
- `npm run verify` and `npm run verify:mobile` both pass.
- Only `docs/gaps/README.md`, the new record page and `docs/active/work/T-010-03/**` are modified.
