---
id: T-008-02
story: S-008
title: open-the-air-fryer-and-the-pot
type: task
status: done
priority: critical
phase: done
depends_on: [T-007-05]
---

## Context

Open the counter and write its work list, so a writer can start and T-008-03 knows what to
annotate.

**You own `src/data/counters.json`, `docs/knowledge/counters.md` and
`docs/gaps/air-fryer-and-pot.md`.** T-007-05 holds `counters.json` before you — that is the only
reason this waits on it. Read what S-007 did to the file first; it removed a counter and added
one, and the house style for a shelf that is not a shop may have moved.

### 1. Open the counter

Add one entry to `src/data/counters.json` in the existing shape, with section titles in menu
order and **empty item lists**. T-008-05 fills the items.

| Name | Slug |
| --- | --- |
| The Air Fryer & the Pot | `air-fryer-and-pot` |

Blurb: **plug one in, eat, wash two things** — or better words for the same bargain. The shop
counters' blurbs instruct a visitor standing at a window; this is not a shop, so like Instant
Pot and One Pot it states what you put in and what you get back. Keep the register out of it.

Section titles, as intent — improve the wording if the shelf turns out to want different ones:

- Straight out of the basket
- Start to finish in the pot
- Sheet-pan-shaped, in the basket
- Frozen things, done properly
- Also here

**No `categories` fallback.** This is a gated shelf and a fallback would drag recipes onto it
that have never been measured against the gate.

### 2. Write the gate down where the build can find it

The counter admits a recipe only if all three are true:

1. **`washing-up` of two or fewer**, as declared by T-008-01's property.
2. **One plug-in machine does the cooking** — air fryer or Instant Pot. Not a hob and then a
   machine.
3. **On the table in 45 minutes**, wall-clock, pressurising and resting included.

Write this into the counter's own page copy and into `docs/knowledge/counters.md`, because it is
the one shelf here whose membership is a rule rather than a judgement, and a rule nobody can read
becomes a judgement within a year.

**Bar 3 is the one to check hardest.** Instant Pot recipes carry a pressure time that is not the
whole clock — a 25-minute cook is 10 minutes to come up, 25 under, and 15 of natural release. Go
and look at how `>> time:` and the clock actually behave on the existing 25 Instant Pot recipes
before you write "45 minutes" as if it were obvious, and say in the gap page which of the 25
clear it. If it turns out to be four, that is a finding worth having early rather than at
T-008-05.

### 3. Argue combined-or-separate honestly

`docs/knowledge/counters.md` requires every entry to say whether the archetype is combined or
separate and why, and this entry has to answer the obvious objection: **the site already has
three shelves that promise less work.**

Make the case with numbers rather than assertion. One Pot holds 68 and a good many are
three-hour braises. Instant Pot holds 25 and some brown in a skillet first. Say how many of each
clear the gate, name a few that do not and why, and be honest if the overlap turns out to be
large. **A counter that is 90% borrowed from Instant Pot is a filter wearing a shelf's clothes**,
and if that is what the numbers show, say so in the gap page — S-008 would rather learn that here
than after twenty recipes are written.

### 4. Argue the air fryer's absence

Nothing in this collection uses the machine. No `kit: Air Fryer`, no recipe, no gap page; the
only trace is `src/lib/icons.ts:319`, where `air fry` already maps to an oven icon. That is a
finding worth a paragraph, and it decides how the writer ticket works:

- **Which air fryer dishes are `kit:` variants** of files already here — wings, chips, karaage,
  falafel, salmon — and which are dishes with no plain counterpart at all.
- `scripts/parse-recipes.mjs` allows **only one file per `dish` to omit `kit`**. An air fryer
  version of an existing plain recipe is a `kit:` sibling of it. An air fryer dish that stands
  alone carries no `kit` line. Say which each ranked item is, by slug, because getting it
  backwards is a build error the writer will hit blind.

### 5. Write the work list

Write `docs/gaps/air-fryer-and-pot.md` in the shape of the folder — read `docs/gaps/instant-pot.md`
and `docs/gaps/one-pot.md` first, since this shelf argues with both. It needs a `## What it has`
block in the machine-read `**Section title.** slug · slug` shape (see `docs/gaps/README.md`), a
ranked missing list, the components those dishes wait on, and a what-a-table-cannot-hold section.

Three things the writer inherits and cannot recover from if this gets them wrong:

**Rank by what clears the gate, not by what an air fryer is famous for.** A dish that needs a
marinade bowl, a dredging station and the basket has three things in the sink and does not belong
here however good it is.

**Basket times are not oven times.** Machines differ by several hundred watts and by basket
geometry, and a recipe that states a time without stating the machine and the load has invented a
number. Give the writer the ranges the sources actually support, say where they disagree, and say
what to look for instead of the clock where the clock cannot be trusted.

**Name what the machine is bad at, in the what-a-table-cannot-hold section.** Wet batters blow off.
A crowded basket steams instead of crisping, which is one line of advice that decides half the
recipes on this shelf. Anything needing a lot of oil is a fryer, not an air fryer. This section is
what stops the shelf becoming an advertisement.

## Acceptance Criteria

- `src/data/counters.json` holds one more counter, `air-fryer-and-pot`, with `name`, `slug`,
  `blurb` and ordered `sections` with empty item lists, no `categories` fallback, and the file
  parses.
- `docs/knowledge/counters.md` has an entry with a what-it-is paragraph, the three-bar gate stated
  as a rule, and a combined-or-separate paragraph **naming One Pot and Instant Pot with counts**.
  The contents table at the top gains its row.
- The gap page reports how many of the 25 existing Instant Pot recipes clear each of the three
  bars, measured off the built site rather than estimated — including bar 3, measured against the
  real clock and not against `>> time:` alone.
- If fewer than **10** existing recipes clear all three bars, the gap page says so plainly and
  says what that means for the shelf. **It does not adjust the bars to improve the number.**
- `docs/gaps/air-fryer-and-pot.md` exists with a `## What it has` block in the machine-read shape,
  a ranked missing list of at least **20** air fryer dishes, a components section, and a
  what-a-table-cannot-hold section naming at least four things the machine is bad at.
- Every ranked item says whether it is a `kit: Air Fryer` variant of an existing slug — named —
  or a standalone dish, and the reason.
- Sources for the basket times are cited the way `docs/gaps/soup-pot.md` cites them: linked, and
  said what each established.
- A `.cook` file naming `counters: The Air Fryer & the Pot` and `kit: Air Fryer` passes its check.
  Demonstrate it in the work artifact with a throwaway file; do not commit it.
- `node scripts/check-recipes.mjs` reports ok for the whole collection, unchanged.
- Only `src/data/counters.json`, `docs/knowledge/counters.md` and
  `docs/gaps/air-fryer-and-pot.md` are modified.
