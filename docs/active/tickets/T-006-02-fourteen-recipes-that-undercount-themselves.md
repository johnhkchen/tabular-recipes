---
id: T-006-02
story: S-006
title: fourteen-recipes-that-undercount-themselves
type: task
status: done
priority: high
phase: done
depends_on: []
---

## Context

Fourteen recipes claim to take less time than their own timers add up to.

The clock's `Start to finish` is a sum of the durations written in the file. When it says
`at least`, it is a floor — some step gave no time, so the true total is higher. **A floor cannot
honestly exceed the author's own estimate.** Where it does, the `>> time:` line is counting
something other than the dish.

All fourteen, measured on the built site, worst first:

| Recipe | `>> time:` | the clock | gap |
| --- | --- | --- | ---: |
| `chintan-broth` | 5 hr 30 min | 8 hr 40 min | 3 hr 10 min |
| `sour-dill-pickles` | 23 days | at least 23 days 2 hr | 2 hr |
| `bulgogi-marinade` | 15 min | at least 2 hr | 1 hr 45 min |
| `baklava` | 3 hr 30 min | at least 5 hr 15 min | 1 hr 45 min |
| `no-knead-bread` | 20 hr | at least 20 hr 45 min | 45 min |
| `focaccia` | 20 hr | at least 20 hr 25 min | 25 min |
| `mint-chutney` | 15 min | 33 min | 18 min |
| `lotus-seed-paste` | 6 hr 15 min | at least 6 hr 30 min | 15 min |
| `turnip-cake` | 14 hr | at least 14 hr 13 min | 13 min |
| `deli-rye-bread` | 15 hr | at least 15 hr 13 min | 13 min |
| `chicken-adobo` | 1 hr 30 min | at least 1 hr 43 min | 13 min |
| `chocoflan` | 6 hr | at least 6 hr 8 min | 8 min |
| `taro-cake` | 14 hr | at least 14 hr 7 min | 7 min |
| `teleras` | 2 hr 50 min | at least 2 hr 53 min | 3 min |

Three are already diagnosed:

- **`baklava`** — `3 hr 30 min` against a `~stand{4%hr}`. The stand is not in the figure.
- **`bulgogi-marinade`** — `15 min` against `step.4: fold in, marinate 2 hr`. The marinate is not
  in the figure.
- **`chintan-broth`** — `5 hr 30 min` against `~simmer{4%hr}`, `~simmer{30%min}`,
  `~parboil{10%min}` and `~chill{4%hr}`. The chill is not in the figure.

The pattern in the big four is a long unattended wait the author did not count. **Check the
pattern rather than assuming it** — the small ones, at three to thirteen minutes, are more likely
rounding or a step whose duration was added later than the header.

## What to fix, and what not to

**The `>> time:` line is what is wrong.** Correct it to a figure that is not less than what the
file's own timers already add to.

- **Do not touch a timer to make a header true.** A timer is a claim about cooking; the header is
  a summary. Changing a `~stand{4%hr}` because the header disagreed with it would be inventing a
  number, which is the one thing this collection does not do.
- **Do not add a timer.** If a step has an untimed wait, that is what the clock's `at least` is
  for.
- **Do not remove the `>> time:` line.** A recipe with no author's figure is a different fix and
  it is not this one.

Where the gap is small enough that it looks like rounding, say so and round upward — the header
may be approximate, but it may not be under.

## Which way `>> time:` counts

`>> time:` means different things across the collection, and **this ticket does not settle that.**
`baklava` excludes a long wait; `sourdough-boule` says 24 hr against timers summing 16 hr 15,
which means it includes proving nobody timed. Both are defensible and S-006 leaves the definition
on the gap list.

So the bar here is narrow and absolute: **not less than the timers.** A recipe whose header
already clears that bar is not touched, whichever way it counts.

If a fix cannot be made without deciding what `>> time:` means, stop, leave the file, and write
the case up — that is the evidence the bigger story needs, and it is worth more than a guess.

## Acceptance Criteria

- No page in the built site has a `Start to finish` figure greater than its `>> time:` chip.
  Verify by rebuilding and re-running the comparison across all 658 pages, and paste the count —
  it should be zero, from fourteen.
- Each of the fourteen is listed in the work artifact with its old figure, its new one, and **the
  specific wait or step that was missing**. A row that says only "increased" has not been
  understood.
- No timer, no step, no ingredient and no `step.N` label is changed in any of the fourteen files.
  Show it — a diff limited to `>> time:` lines.
- Any file where the fix needs `>> time:` to be defined is left unchanged and written up instead.
- Recipes outside the fourteen are untouched, including the ~602 where the clock is *below* the
  chip. Those are floors and they are correct.
- The chip and the clock still print exactly as before on every other page.
- `npm run verify` passes.
- Only the `>> time:` line inside those fourteen `.cook` files is modified.
