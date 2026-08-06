---
id: T-006-01
story: S-006
title: say-whose-number-it-is
type: task
status: done
priority: high
phase: done
depends_on: []
---

## Context

Two totals, 635 pages, nothing saying which is which.

**The chip**, `src/pages/[slug].astro:42`:

```js
recipe.metadata.time && { label: 'about', value: recipe.metadata.time },
```

It sits with `serves 12` and the category, and prints the author's own `>> time:`. The word
`about` is doing double duty — it reads as a hedge on the number when it is really the whole
attribution, and the clock lower down uses `about` too, for a different reason.

**The clock**, `src/components/Timeline.astro:282–291`:

```
Start to finish        at least 16 hr 15 min
                       1 of 5 steps gives no time
Needs you              about 45 min
```

`totalText` at `:214` and `handsOnFigure` at `:229`. These are the table's reading of the steps.

`sourdough-boule` is the page to hold in mind: `about 24 hr` at the top, `at least 16 hr 15 min`
below, and a reader with no way to know the first is the baker's word and the second is a floor
derived from five timers.

## The one constraint that outranks everything

**This is a label, not an explanation.**

S-005 spent seven tickets removing every sentence on a recipe page that described how the site
works out its own numbers. This ticket pays off a debt that story took on, and it is not allowed
to reintroduce the thing it was paying for. If the fix grows into a sentence — anything of the
shape *"this figure is worked out from the steps because…"* — it has failed.

Two or three words per figure. `docs/knowledge/voice.md` is the rule and it applies here.

## What a good answer looks like

Not prescribed, because the right shape depends on how it sits in the layout. The test is a
reader glancing at the page for half a second, and there is more than one way to pass it:

- Words on the figures — *the recipe says* against *the table reads*, or similar.
- Placement — the chips are the author's row and the clock is the table's panel, so a heading on
  the panel may do the whole job with nothing added to the chips.
- Something that already exists on the page carrying it, if reading the markup turns one up.

Whatever is chosen, check it in the two hard cases:

1. **A page with the chip and no clock.** All 658 recipes carry a `>> time:` line, but **23 time
   no step at all**, so the table works out nothing and the clock's `Start to finish` never
   renders — `guacamole`, `basil-pesto`, `mayonnaise`, `taco-seasoning` and 19 more, all short
   sauces and blends. On those pages the author's figure stands alone. **An attribution that only
   makes sense as a contrast will read as half a sentence there.** There is no page in the
   opposite state; the clock never appears without the chip.
2. **`about` appearing twice for different reasons.** The chip's `about` and the clock's `about`
   on `Needs you` do not mean the same thing today. Make them distinguishable or make them the
   same word deliberately, and say which in the work artifact.

## Do not

- **Do not change either figure.** No recomputation, no rounding, no reconciling. The numbers are
  correct as they stand; only their attribution is missing. `schedule.ts` is not in scope.
- **Do not remove the author's `>> time:` from the page.** That was considered and rejected —
  `sourdough-boule` is the case where 24 hr is the better answer and the table's floor is not.
- **Do not add a note, a tooltip-only explanation, or a legend.** See the constraint above.
- **Do not touch the 14 contradictory recipes.** T-006-02 owns those, in the `.cook` files, and
  runs alongside this ticket.

## Acceptance Criteria

- A reader can tell which total came from the recipe and which from the table, on any of the 635
  pages that print both, without reading a sentence.
- Nothing added is longer than a label. The work artifact quotes every string added, with its
  character count, and checks each against `docs/knowledge/voice.md`.
- The 23 chip-only pages — the ones whose steps time nothing, so no clock renders — still read
  correctly with the author's figure standing alone. Name one in the work artifact and say what
  it shows.
- The two meanings of `about` are resolved deliberately, with the decision recorded.
- Neither figure changes value anywhere. Prove it: the `Start to finish` and `Needs you` strings
  are byte-identical across all 658 pages before and after, apart from whatever label was added.
- Measured after, by the method in `scripts/measure-pages.mjs`: visible characters a page should
  be within a few characters of **2823 mean**. This ticket adds words to a site that just spent
  an epic removing them; say how many it cost.
- No page gains a sentence about how the site computes anything. Grep the built site for the
  six sentences S-005 removed and confirm all are still at zero.
- Renders at 375px with no horizontal scroll — the chips row and the clock panel are both narrow
  surfaces T-004 measured. `npm run verify:mobile` passes.
- `npm run verify` passes.
- Only `src/pages/[slug].astro` and `src/components/Timeline.astro` are modified, plus
  `src/styles/site.css` if the label needs styling. No recipe file, no `schedule.ts`.
