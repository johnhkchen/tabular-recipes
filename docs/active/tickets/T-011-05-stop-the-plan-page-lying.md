---
id: T-011-05
story: S-011
title: stop-the-plan-page-lying
type: task
status: done
priority: high
phase: done
depends_on: [T-011-03]
---

## Context

**This ticket fixes a live defect**, and it is the reason S-011 is worth doing before it is worth
demonstrating.

`src/lib/plan.ts` carries `MULTIPLIERS = [0.5, 1, 2, 3]`. `scaleAmount` triples the chicken.
`src/pages/list.astro:925` prints `serves 4 → 12`. **The clock says nothing and never changes.**

For chili that is correct — the simmer is two hours either way. For anything a vessel bounds it is
a fabricated number, in a repo whose cardinal rule is that it does not fabricate numbers. Somebody
sets the air fryer wings to `× 3`, reads a twenty-five-minute recipe, and finds out at the fourth
basket.

**You own `src/pages/list.astro` and any component it needs.** T-011-02 built the cost function;
this ticket calls it. Do not change `scaleAmount` or the multiplier set — the ingredient scaling
is right, it is the silence about time that is wrong.

### 1. Say what the multiplier costs

When a plan item is at anything other than `× 1`, the page says what changed. Three cases and all
three must read correctly:

- **Nothing bounds it.** *Three times as much, and it takes just as long.* This is the good news
  and most recipes are this. **Say it out loud** — it is genuinely useful and no cookbook tells
  anybody.
- **A vessel bounds it.** *Three times as much is four batches — about 1 hr 40 rather than 25 min,
  and you are at the machine for most of it.* The batch count is the fact; the time is the
  consequence.
- **We cannot say.** The recipe declares no capacity and its hands-on figure is mostly assumed.
  **Print nothing rather than a guess**, and make sure that is distinguishable in the code from
  the unbounded case — those two are opposite answers and collapsing them is the bug this ticket
  exists to fix, reintroduced one level up.

The wording comes from the phrasebook in `docs/knowledge/scaling.md`. **No notation.** If a
sentence you need is not in the phrasebook, that is a gap in the phrasebook — add it there and use
it here, do not improvise.

### 2. The list has a total, and the total is where this bites hardest

The plan page is several recipes at once. A cook reading it wants to know what the *evening* costs,
not what each line costs.

That total is a scheduling question and `buildSchedule` already knows how to answer one for a
single recipe: unattended work runs in parallel, hands-on work does not. Two recipes with
two-hour braises are a two-hour evening; two recipes with forty minutes of chopping are eighty
minutes of chopping.

**Decide how far to take this and argue it.** A full cross-recipe schedule is a bigger feature
than this ticket, and the honest small version — sum the hands-on, take the max of the elapsed,
and say that is a rough floor — may be enough. **What is not acceptable is a total that adds
elapsed times together**, which would be wrong in the same direction as the current silence.

If the answer is *this needs its own story*, say so and deliver the per-line version.

### 3. Do not let it shout

The plan page is a working document — a shopping list somebody reads in a shop. A batch warning
that pushes the list around, or that appears on every line at `× 1`, has made the page worse in
exchange for a fact that only matters sometimes.

Nothing at `× 1`. Nothing where there is nothing to say. `npm run verify:mobile` passes: no
overflow at 375, 390 or 768, and every control still meets the touch-target check.

## Acceptance Criteria

- With a multiplier other than `× 1`, the plan page says what it costs, for all three cases, using
  the phrasebook's wording. Show all three in one screenshot.
- **The unbounded case and the cannot-say case are visibly different**, and different in the code.
- No notation appears anywhere on the page.
- The batch count comes from `src/lib/scaling.ts`, not from arithmetic done in the page.
- Nothing renders at `× 1`, and nothing renders where the recipe cannot answer.
- The plan total is either delivered or explicitly deferred with a reason, and **in no case are
  elapsed times summed**.
- `scaleAmount`, the multiplier set and the shopping list's grouping are unchanged.
- `npm run verify` and `npm run verify:mobile` both pass.
- The work artifact shows **the five recipes in the collection whose `× 3` is most misleading
  today**, by slug, with what the page said before and after. That list is the ticket's
  justification and it should be checked before the code is written, not after.
- Only `src/pages/list.astro`, any new component, `src/styles/**`, tests and
  `docs/active/work/T-011-05/**` are modified. No `.cook` file, and not `src/lib/plan.ts`.
