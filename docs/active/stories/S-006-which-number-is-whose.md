---
id: S-006
title: which-number-is-whose
type: story
status: open
priority: high
---

## Why

A debt S-005 took on knowingly, written up as item 2 of `docs/gaps/voice.md` and now due.

Every recipe page prints two totals. Under the title, a chip: `about 24 hr`. Further down, the
clock: `at least 16 hr 15 min`. They are different numbers, and since S-005 **nothing on the page
says which is which.**

T-005-02 deleted *"The recipe itself says 3 hr 30 min."* from all 658 pages, and that was the
right call — the chip already prints it, and a third copy inside a panel of worked-out numbers
read as a third worked-out number. What went with the sentence was the only thing telling a
reader the two figures were **different measurements of different things** rather than one of
them being wrong.

Measured on the built site:

| | |
| --- | ---: |
| Pages printing both figures | **635** |
| Where the two disagree | **616** |
| By 30 minutes or more | **190** |
| Where the clock already says `at least` | **577** |
| **Where the clock is *larger* than the chip** | **14** |

## The two problems are not the same problem

That last row is the one that matters, and it splits the work cleanly.

**602 of the disagreements are not errors.** The clock says `at least` because a step gave no
time, so it is a floor. A floor sitting below an estimate is exactly what a floor does. Nothing
is wrong with those pages except that a reader has no way to know one figure is the recipe's word
and the other is the table's reading.

**14 are errors**, and they are errors in the recipe files, not in the rendering. A floor cannot
honestly exceed an estimate — if the timers already add to more than the author's total, the
author's total is counting something else:

| | `>> time:` | the clock | what it is not counting |
| --- | --- | --- | --- |
| `chintan-broth` | 5 hr 30 min | 8 hr 40 min | a 4 hr chill |
| `baklava` | 3 hr 30 min | at least 5 hr 15 min | a 4 hr stand |
| `bulgogi-marinade` | 15 min | at least 2 hr | a 2 hr marinate |
| `sour-dill-pickles` | 23 days | at least 23 days 2 hr | |

Ten more, down to `teleras` at 3 minutes.

## What `>> time:` actually means

Nothing consistent, and this story is not going to fix that.

- `baklava` and `bulgogi-marinade` exclude a long unattended wait — the figure is roughly
  *how long you are busy*.
- `sourdough-boule` says 24 hr against timers summing 16 hr 15 — the figure includes proving time
  nobody put a timer on, so it is *how long from start to eating*.

Both readings are defensible. Picking one and enforcing it across the collection would mean
re-authoring the line on a few hundred recipes, and that is a different story than this one. What
this story does is stop the page from presenting two figures as if they were comparable when they
are not.

## What changes

**1. Both figures get attributed.** A reader can tell, without a paragraph, that one is the
recipe's own word and one is what the table worked out from the steps. The constraint from S-005
holds absolutely: **this is a label, not an explanation.** Anything that grows into a sentence
about how the site computes things has failed the story it is paying off.

**2. The 14 contradictions get corrected in the recipe files.** Where a timer is already on the
page, the author's total cannot be less than the timers. These are wrong `>> time:` lines and
they get fixed, one at a time, with the wait that was left out named.

## What this story does not do

- **It does not define `>> time:`.** That is the bigger fix and it is left on the gap list, now
  with the evidence attached.
- **It does not touch the other 602 disagreements.** Once the figures are attributed, a floor
  below an estimate reads correctly and needs nothing.
- **It does not bring back a note under the clock.** S-005 removed those on purpose.

## Done looks like

A cook glancing at a recipe page sees two totals and knows in half a second that one came from
the recipe and one from the table, without reading a sentence about either. And no page claims a
dish takes less time than its own timers add up to.
