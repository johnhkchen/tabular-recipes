---
id: T-010-01
story: S-010
title: put-the-numbers-within-reach
type: task
status: done
priority: critical
phase: done
depends_on: [T-008-01]
---

## Context

The numbers a tired cook needs are computed already and stop at the recipe page. Put them where
the front page can reach them, and derive the one that is missing.

**You own `src/lib/schedule.ts`, `src/pages/search.json.ts` and their tests.** T-010-02 builds
the dials on top of what you produce; nothing about the front page's markup is yours.

`washing-up` is T-008-01's and this waits on it — not because the filter needs it to work, but
because indexing a field that does not exist yet would have to be done twice.

### 1. Derive the longest stretch without a break

`Schedule` gives `handsOnMinutes` as a sum over every task. **A sum cannot tell thirty minutes of
stirring from three ten-minute jobs around two waits**, and that difference is the entire reason
this story exists.

The task graph can. Every `Task` carries `attention`, `start`, `end` and `dependsOn`, and the
lanes are already packed. A run of hands-on work with no wait a cook could sit down in is what
the dial wants.

Two things to settle in the design phase and to argue in the work artifact:

- **What counts as a break.** An unattended task between two hands-on ones is plainly a break. An
  unattended task of two minutes probably is not — nobody sits down for two minutes. Pick a
  threshold, say why, and make it a named constant rather than a number in an expression.
- **Parallel branches.** The schedule's own comment says it *"assumes you have as many hands as
  the tree has branches; it never delays one hands-on task for another."* That assumption is fine
  for a timeline and **wrong for this number** — a person with two hands-on tasks running in
  parallel is doing both, one after the other. Decide whether the stretch is measured along the
  critical path or across all branches, and say which and why. Getting this wrong makes a
  four-branch recipe look restful.

### 2. Put the numbers in the index

`src/pages/search.json.ts` currently carries slug, title, counters and one flattened `find`
string. Add what the dials need.

The file's own comment is the constraint to respect: the index used to live in `data-` attributes
on 241 cards, *"which put 47 KB of ingredient names into every visit whether or not anyone
searched."* It is now one file fetched on the first keystroke. **Adding four small numbers per
recipe is cheap; adding a task list per recipe is not.** Report the before-and-after byte size of
the endpoint in the work artifact, and if the growth is more than a few percent, say what you cut.

`buildSchedule` runs per recipe at build time. 658 of them is fine for a static endpoint, but
measure the build-time cost and report it rather than assuming.

### 3. Carry the confidence, not just the number

**This is the part that makes the filter honest and it is not optional.**

Hands-on is what the clock falls back to when a step says nothing, so an under-annotated recipe
collects minutes nobody claimed — and a recipe with no timers at all reads as no time at all.
`Schedule` already carries `assumedHandsOnMinutes` and `untimedCount` for exactly this reason.

The index must let a browser tell three states apart:

- **The recipe says.** Its timers are named and its figure is the author's.
- **We read it off the step.** Plausible, and inferred rather than stated.
- **Nobody said.** The figure is a floor at best and a fiction at worst.

Get that into the index in whatever shape T-010-02 can act on — a per-recipe confidence, or the
raw `assumedHandsOnMinutes` and `untimedCount` for it to threshold. **Argue which in the work
artifact**, and prefer the one that makes the wrong thing hard to build: a browser that has to
work to hide an unannotated recipe will not do it by accident.

Do not change what the clock computes, and do not change the fallback. Hands-on-when-unsure is
the safe assumption and S-003 argued it; this ticket surfaces the uncertainty rather than
removing it.

## Acceptance Criteria

- `Schedule` gains the longest-unbroken-hands-on figure, with the break threshold as a named
  constant and the parallel-branch decision argued in the work artifact.
- The search index carries, per recipe: elapsed minutes, hands-on minutes, longest unbroken
  stretch, washing-up count, and enough to distinguish stated from inferred from nobody-said.
- **The endpoint's byte size before and after is reported**, along with the build-time cost of
  computing schedules for all 658 recipes. If either grew more than a few percent, the work
  artifact says what was cut.
- The work artifact shows **at least five worked pairs**: two recipes with similar
  `handsOnMinutes` and very different longest stretches, and three where the figure is mostly
  assumed. Name them by slug. These are the cases T-010-02 designs against and T-010-03 audits.
- A count of how many of the 658 recipes fall into each of the three confidence states.
- Nothing the clock computes changes. Every recipe page's Timeline renders exactly as before —
  show it, by diffing the rendered clock text across all 658 pages.
- Tests cover: the longest stretch on a recipe with one long hands-on task; on a recipe with
  several short ones separated by waits; on a recipe with a wait too short to count as a break;
  and on a recipe with parallel branches.
- `npm run verify` passes.
- Only `src/lib/schedule.ts`, `src/pages/search.json.ts`, their tests and
  `docs/active/work/T-010-01/**` are modified. **No `.cook` file and no page markup.**
