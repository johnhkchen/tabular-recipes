---
id: T-005-02
story: S-005
title: the-clock-stops-explaining-itself
type: task
status: done
priority: high
phase: done
depends_on: [T-005-01]
---

## Context

The single widest-reaching change in the story. Four sentences, written once in two components,
printed on up to 658 pages.

`src/components/Timeline.astro` builds a `notes` array at **~215–246** and a `note` string at
**~249–260**. `src/components/CookModes.astro` builds `clockFacts` at **~255–285**. Between
them they produce, on a page about soup:

| Sentence | Pages |
| --- | --- |
| "One of the N steps never says how long it takes, so both numbers are floors." | **577** |
| "The shortest stretches keep a sliver so they stay visible; their times are printed beside them." | **531** |
| "The minutes are always the recipe's own; a dashed edge means we worked out from the step whether you have to be there, and a dotted one means nothing was said, so we assumed you are standing over it." | **307** |
| "Start to finish is the longest chain through the table, so branches that overlap are counted once." | **144** |
| "N of that is counted as needing you only because the step never said otherwise." | **57** |
| "It adds up to more hands-on time than the whole dish takes because two branches run at once." | **15** |

## The decision this carries out

**The hedge moves into the number.** `about 3 hr 30 min` instead of `3 hr 30 min` plus a
paragraph explaining why it might not be. A cook does not need to know that the floor exists
because step 4 has no timer; they need to know the number is approximate.

`CookModes.astro:263` already does a version of this — `const floor = schedule.untimedCount > 0
? 'at least ' : ''`. That instinct was right and the paragraph beside it was the mistake. Make
the number carry the whole load, in both components, in one vocabulary.

## Read the comments before deleting them

Every one of these sentences has a comment above it saying why it was added, and the reasons are
real. Three worth answering rather than ignoring:

1. **"needs you 34 min" beside "start to finish 24 min" reads as one of them being wrong.**
   (Timeline ~239.) True — and 15 pages hit it. If the sentence goes, what stops those 15 pages
   looking broken? A different label, a different arrangement, or accepting it. Pick one and say
   which.
2. **Hands-on is the fallback when a step says nothing.** (Timeline ~223.) French onion soup's
   50-minute caramelise is counted as hands-on on the site's say-so alone. Printed with no hedge
   at all it becomes a claim the recipe never made. The hedge word has to reach this case, not
   just the missing-timer case.
3. **The author's own `>> time:` is deliberately not repeated** in `clockFacts` (~281). That
   restraint stays. But `The recipe itself says 3 hr 30 min.` is currently printed on **all 658
   pages** from the notes array — decide whether the author's own figure is a fact worth showing
   at all once the computed one is honest about being approximate, and say why.

## The dashed and dotted edges

307 pages carry a sentence explaining that a dashed edge means inferred and a dotted one means
assumed. Delete the sentence and the code is still on the page, now unexplained.

**An undocumented visual code is worse than none.** So this is a genuine fork, not a cleanup:
either the edges stop being three-way and collapse to something legible without a paragraph, or
they keep their meaning and it lives somewhere other than a sentence under every timeline — a
legend, a title attribute, the shape itself. Choose, and say in the work artifact what a reader
now understands from a dotted edge and how.

Whatever is chosen must survive the T-004-04 rule: **no compression, no log scale, no invented
ratio.** The timeline draws true proportions or says something true instead.

## Acceptance Criteria

- Every explanatory sentence about how the numbers are worked out is gone from both components.
  No prose on a recipe page describes the site's own inference.
- The approximation is carried by the figures themselves, in one vocabulary across
  `Timeline.astro` and `CookModes.astro` — the same word for the same uncertainty in both.
- The three cases above are each answered in the work artifact: the overlap case (15 pages), the
  assumed-hands-on case (97 pages), and the author's own `>> time:` (658 pages).
- The dashed/dotted edge decision is made and recorded, with what a reader takes from an edge
  afterwards. Nothing on the page carries a meaning nothing explains.
- A page with no ambiguity at all reads no differently than before, apart from what was deleted —
  the hedge word appears only where there is something to hedge. Name one such recipe and one
  fully-hedged recipe in the work artifact, with what each now shows.
- Measured after: report the visible character count of `ching-bo-leung-soup` and
  `tonkotsu-broth-instant-pot` before and after, excluding the collapsed source block, by the
  same method the story used.
- The timeline still draws true proportions. No compression, no log scale.
- `npm run verify` passes, and `npm run verify:mobile` still passes — these strings sit in a
  layout that T-004 fixed for narrow screens.
- Only `src/components/Timeline.astro`, `src/components/CookModes.astro` and — if the schedule
  has to expose the uncertainty rather than each component re-deriving it — `src/lib/schedule.ts`
  are modified. No recipe file. If `schedule.ts` changes, its tests change with it.
