# T-006-02 — Design

The direction is settled by the ticket: fourteen `>> time:` lines go up. The design question is
**by how much**, and it has to be answerable without deciding what `>> time:` means.

## The bar, restated

A new figure is acceptable only if it is **not less than the clock** — the sum of the timers along
the file's own critical path. That is the whole of the ticket's requirement. Everything below is
about picking one number from the many that clear it, and the risk being managed is *inventing a
number*, which is the one thing this collection does not do.

## Options for choosing the new figure

### Option 1 — set the header to the clock's figure

`baklava` becomes `5 hr 15 min`, `chintan-broth` becomes `8 hr 40 min`, and so on down.

**Against.** On eleven of the fourteen the clock is a floor — some step gave no time. Setting the
header equal to the floor claims those untimed steps take zero. `baklava` is the clearest case:
its 3 hr 30 min plainly includes clarifying butter, chopping nuts and layering filo, none of which
carries a timer; `5 hr 15 min` would delete that allowance and assert that a tray of baklava is
assembled instantly. The header would become a restatement of the clock, which makes the chip
redundant and quietly answers the question S-006 deliberately left open.

**Rejected.** It destroys information that is in the file.

### Option 2 — the author's figure plus the timer that was left out

`baklava` = 3 hr 30 + the `~stand{4%hr}` = `7 hr 30 min`. `bulgogi-marinade` = 15 min + `~{2%hr}`
= `2 hr 15 min`. `chintan-broth` = 5 hr 30 + `~chill{4%hr}` = `9 hr 30 min`.

**For.** Every term is a number already written in the file. Whatever the header was counting, it
still counts it — the untimed prep allowance survives — and the omission is repaired by exactly
the amount that was omitted. It is also what the ticket's own three diagnoses describe: *"the
stand is not in the figure"* has one obvious repair, which is to put the stand in the figure.

**Limit.** It only applies where a whole timer is demonstrably outside the header. Research found
that in 8 of the 14 (shape A). In the other 6 (shape B) nothing is missing; the header is simply
rounded down past the sum, so there is no term to add.

### Option 3 — round the clock up to the collection's grain

The smallest multiple of five minutes that is not less than the clock. `teleras` 2 hr 53 →
`2 hr 55 min`. `taro-cake` 14 hr 7 → `14 hr 10 min`.

**For.** Every `>> time:` in all 658 files is a multiple of five minutes (measured in Research);
this keeps that true. Where the gap is 3 to 15 minutes, "the author rounded and rounded the wrong
way" is the honest reading, and the repair is to round the same claim the other way.

**Against, as a universal rule.** Applied to `baklava` it collapses into Option 1, with the same
loss.

### Option 4 — leave some of them and write them up

Reserved by the ticket for a file whose fix needs `>> time:` to be defined.

**Not needed.** No file in the fourteen requires it, and the argument is worth stating precisely
because it is the one place this ticket could go wrong. A header that means *how long you are
busy* and a header that means *start to eating* disagree about whether an unattended wait belongs
in the figure — but neither of them licenses a figure **below the timers on the critical path**,
because under either reading those minutes are minutes the recipe itself claims to spend. The bar
is therefore reachable from both definitions, and raising a number to reach it does not choose
between them. What *would* choose between them is deciding the header must equal the clock
(Option 1) — which is exactly why Option 1 is rejected.

## Decision

**Option 2 where a timer is missing, Option 3 where it is only rounding, and the result always
snapped up to the five-minute grain.**

Stated as a rule, applied file by file:

1. If a whole timer sits outside what the header adds up to (shape A), the new figure is
   `header + that timer`.
2. Otherwise (shape B) the new figure is the smallest multiple of five minutes not less than the
   clock.
3. In both cases, if the result is not a multiple of five minutes, round it up to one. (This only
   bites on `chocoflan`: 6 hr + 8 min = 6 hr 8 → `6 hr 10 min`.)
4. Nothing else in the file is touched.

Every resulting figure is arithmetic on numbers already present in the file, plus at most four
minutes of upward rounding to keep the collection's grain.

## The fourteen figures this produces

| Recipe | old | new | clock it must clear | why |
| --- | --- | --- | --- | --- |
| `chintan-broth` | 5 hr 30 min | **9 hr 30 min** | 8 hr 40 min | + `~chill{4%hr}` |
| `sour-dill-pickles` | 23 days | **23 days 2 hr** | 23 days 2 hr | + `~soak{2%hr}` |
| `bulgogi-marinade` | 15 min | **2 hr 15 min** | 2 hr | + the 2 hr marinate |
| `baklava` | 3 hr 30 min | **7 hr 30 min** | 5 hr 15 min | + `~stand{4%hr}` |
| `no-knead-bread` | 20 hr | **20 hr 45 min** | 20 hr 45 min | + the 30 + 15 min bake |
| `focaccia` | 20 hr | **20 hr 25 min** | 20 hr 25 min | + the 25 min bake |
| `mint-chutney` | 15 min | **45 min** | 33 min | + `~chill{30%min}` |
| `chocoflan` | 6 hr | **6 hr 10 min** | 6 hr 8 min | + `~caramel{8%min}`, rounded to the grain |
| `lotus-seed-paste` | 6 hr 15 min | **6 hr 30 min** | 6 hr 30 min | rounded down past its own four timers |
| `deli-rye-bread` | 15 hr | **15 hr 15 min** | 15 hr 13 min | rounded down past the knead and the bake |
| `turnip-cake` | 14 hr | **14 hr 15 min** | 14 hr 13 min | rounded down past the simmer and the fry |
| `chicken-adobo` | 1 hr 30 min | **1 hr 45 min** | 1 hr 43 min | rounded down past the 8 min glaze |
| `taro-cake` | 14 hr | **14 hr 10 min** | 14 hr 7 min | rounded down past the fry, toss and pan-fry |
| `teleras` | 2 hr 50 min | **2 hr 55 min** | 2 hr 53 min | rounded down past its own five timers |

`turnip-cake` and `taro-cake` are twins that land five minutes apart, and that is correct rather
than sloppy: turnip-cake's chain carries a 15-minute daikon simmer that taro-cake's does not.

## What was considered and deliberately not done

- **Not touching a timer.** `teleras` would read tidily at a flat `2 hr 50 min` if the proof were
  42 minutes, and that thought is the trap the ticket names: the timer is a claim about baking,
  the header is a summary, and a summary does not get to edit the thing it summarises. The
  `~proof{45%min}` is also load-bearing prose — the `>> slack:` line says the creases only survive
  "forty-five minutes and no longer".
- **Not adding a timer** to `no-knead-bread`'s shaping or `chicken-adobo`'s sear. `at least` is
  the site's answer for an untimed step and it is already correct there.
- **Not removing `>> time:`** from any file, including `bulgogi-marinade`, where a marinade's "15
  min" is arguably the useful number for a cook standing at the bowl. It has a chip and it keeps
  one.
- **Not adding a check to `scripts/check-recipes.mjs`** that would catch this class of error on
  future recipes. It is the obvious follow-up and it is out of scope: the ticket permits only the
  `>> time:` lines in fourteen files to change. Named in Review as an open concern.
- **Not rounding to the nearest quarter hour.** `6 hr 10 min` and `14 hr 10 min` are less tidy
  than `6 hr 15 min` and `14 hr 15 min`, but ten-minute figures appear 22 times in the collection
  and the smaller number is the one that adds least of anyone's invention.

## How it will be verified

1. `npm run build`, then the comparison script over all 658 pages: the count of pages whose clock
   exceeds their chip goes from 14 to 0.
2. `figures-before.json` against a snapshot taken after: the chip changes on exactly fourteen
   pages, and the `Start to finish` and `Needs you` figures change on **none** — the clock is
   computed from timers, and no timer is touched.
3. `git diff` restricted to the fourteen files shows fourteen changed lines, all `>> time:`.
4. `npm run verify`.
