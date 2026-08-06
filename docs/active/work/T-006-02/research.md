# T-006-02 — Research

Fourteen recipes whose header claims less time than their own timers add up to. What follows is
what exists and how it connects, measured rather than assumed.

## The two numbers and where each comes from

**The chip** — `src/pages/[slug].astro:41`:

```js
recipe.metadata.time && { label: 'about', value: recipe.metadata.time },
```

The chip prints `>> time:` **verbatim**. It is a string, never parsed, never rounded, never
recomputed on the way to the page. Whatever is in the `.cook` file is what a reader sees, so a
change to a `>> time:` line changes exactly one thing on the page and nothing else. (T-006-01 is
relabelling this row on the same branch; it does not change the value.)

**The clock** — `src/components/Timeline.astro:214`:

```js
const totalText = `${allTimed ? '' : 'at least '}${formatDuration(schedule.totalMinutes)}`;
```

`schedule.totalMinutes` comes from `buildSchedule` in `src/lib/schedule.ts`. It is the length of
the **critical path** through the merge tree, not a plain sum: two branches that do not depend on
each other run at the same time, so a 2-minute glaze simmering beside a 35-minute bake adds
nothing. An operation nobody timed contributes zero minutes and sets `timed: false`; when any
operation is untimed the figure is prefixed `at least ` and a sub-line says how many steps gave no
time.

So the clock is a **floor derived only from timers written in the file**. It cannot exceed the
true elapsed time of the timed chain, and it under-reports whenever a step is untimed.

## Why "clock greater than chip" is the contradiction

The floor is built out of the author's own numbers. If the floor is larger than the author's
total, the author's total is not counting something the author themselves timed. That is a
contradiction inside one file, and it needs no definition of `>> time:` to detect — which is why
the ticket can hold the bar absolute while S-006 leaves the definition open.

Both sides are read into minutes by the same reading, `authorMinutesOf` (`schedule.ts:273`) and
`minutesOf` (`src/lib/time.ts:20`): number-unit pairs, whole or nothing. A range, a bare
"overnight", a fraction like `1 1/2 hr` reads as null. None of the fourteen is unreadable.

## The measurement

`\.lisa/attempts/T-006-02/1/work/compare-clock-to-chip.mjs` reads the clock out of every built
page and the chip out of `src/generated/recipes.json` (which is where the chip's string comes
from), converts both, and reports where the clock exceeds the chip. Run against a fresh
`npm run build`:

```
pages checked: 658
pages printing a clock: 635
unreadable on one side or the other: 0
clock GREATER than chip: 14
```

The fourteen and their gaps match the ticket's table exactly, worst first: `chintan-broth` 190,
`sour-dill-pickles` 120, `baklava` 105, `bulgogi-marinade` 105, `no-knead-bread` 45, `focaccia`
25, `mint-chutney` 18, `lotus-seed-paste` 15, then `deli-rye-bread`, `turnip-cake`,
`chicken-adobo` at 13, `chocoflan` 8, `taro-cake` 7, `teleras` 3.

23 pages print no clock at all (nothing timed), and on the other 621 the clock sits at or below
the chip. Those are floors below an estimate and are correct.

## What is actually missing in each file

`\.lisa/attempts/T-006-02/1/work/explain-fourteen.mjs` runs the site's own `buildSchedule` and
prints the chain that sets the total. Two distinct shapes emerge, and they are distinguishable by
arithmetic rather than by taste.

### Shape A — a whole timer sits outside the header (7 files)

The header equals a clean subset of the file's timers; one named wait is missing from the sum.

| Recipe | `>> time:` | what the header adds up to | the timer left out |
| --- | --- | --- | --- |
| `chintan-broth` | 5 hr 30 min | parboil 10 + simmer 4 hr + simmer 30, plus ~50 min untimed skim/strain | `~chill{4%hr}` (step 5) |
| `sour-dill-pickles` | 23 days | `~ferment{3%weeks}` + `~chill{2%days}` exactly | `~soak{2%hr}` (step 2) |
| `bulgogi-marinade` | 15 min | the three untimed mixing steps | `~{2%hr}` marinate (step 4) |
| `baklava` | 3 hr 30 min | `~bake{1 1/4%hr}` plus ~2 hr 15 of untimed clarify/chop/layer | `~stand{4%hr}` (step 6) |
| `no-knead-bread` | 20 hr | 18 hr rise + 2 hr rest, exactly | the bake, `~{30%min}` + `~{15%min}` |
| `focaccia` | 20 hr | 18 hr chill + 2 hr rise, exactly | `~{25%min}` bake |
| `mint-chutney` | 15 min | toast 1 + blend 2, plus ~12 min untimed prep | `~chill{30%min}` (step 3) |
| `chocoflan` | 6 hr | bake 60 + cool 1 hr + chill 4 hr, exactly | `~caramel{8%min}` (step 1) |

That is eight rows; `chocoflan` is shape A with a small timer rather than a long wait, which is
why its gap is 8 minutes.

The pattern the ticket asked me to check rather than assume — "a long unattended wait the author
did not count" — holds for the big four and for `mint-chutney`, and fails for `no-knead-bread`,
`focaccia` and `chocoflan`, where what was left out is **the cooking itself** (a 45-min bake, a
25-min bake, an 8-min caramel) and the long waits *are* counted. Those three headers are the
rise-and-prove total with the oven omitted.

### Shape B — the header covers every timer but is rounded down (6 files)

No timer is missing. The header is short of the chain by less than the collection's rounding
grain.

| Recipe | `>> time:` | chain | short by | what tips it over |
| --- | --- | --- | ---: | --- |
| `lotus-seed-paste` | 6 hr 15 min | soak 4 hr + simmer 60 + fry 30 + cool 1 hr = 6 hr 30 | 15 min | nothing omitted; the four timers already make 6 hr 30 |
| `deli-rye-bread` | 15 hr | sponge 12 hr + knead 8 + rise 90 + proof 60 + bake 35 = 15 hr 13 | 13 min | the 8-min knead and the 5 min the header rounded away |
| `turnip-cake` | 14 hr | simmer 15 + steam/cool/chill 13 hr 50 + fry 8 = 14 hr 13 | 13 min | the 15-min daikon simmer and the 8-min pan-fry |
| `chicken-adobo` | 1 hr 30 min | marinate 60 + simmer 35 + reduce 8 = 1 hr 43 | 13 min | the 8-min reduction, and 5 min of the simmer |
| `taro-cake` | 14 hr | fry 5 + toss 4 + steam/cool/chill 13 hr 50 + fry 8 = 14 hr 7 | 7 min | the 5-min fry, the 4-min toss and the 8-min pan-fry |
| `teleras` | 2 hr 50 min | stand 10 + knead 10 + rise 90 + proof 45 + bake 18 = 2 hr 53 | 3 min | nothing omitted; the five timers make 2 hr 53 |

`turnip-cake` and `taro-cake` are twins — the same `~steam{50%min}` / `~cool{1%hr}` /
`~chill{12%hr}` chain of 13 hr 50, rounded up to a flat 14 hr, with the pan work left outside.

## The collection's grain

Every `>> time:` line in the 658 files resolves to a whole multiple of five minutes. Measured:

```
grep -h '^>> time:' recipes/*/*.cook | sed 's/^>> time: //' | grep -oE '[0-9]+ min' | sort -n | uniq -c
   2 5 min   22 10 min   77 15 min   50 20 min   25 25 min   113 30 min
  22 35 min  48 40 min   95 45 min   36 50 min     7 55 min
```

No value carries a minute figure outside that grain. The commonest whole values are `45 min` (56),
`1 hr` (44), `40 min` (36), `1 hr 15 min` (33), `20 min` (33). Any replacement figure that is not
a multiple of five minutes would be the only one in the collection.

## Constraints found in the code

- **Nothing else reads `>> time:`.** `authorMinutesOf` is called in exactly one place
  (`schedule.ts:168`) and `schedule.authorMinutes` is not printed anywhere: `Timeline.astro:195`
  explains at length that the author's figure is deliberately *not* repeated in the clock panel.
  Menus, the shopping list, and the plan do not sort or filter by it. So the blast radius of a
  `>> time:` edit is the chip on one page.
- **No test asserts any of the fourteen values.** `src/lib/schedule.test.ts` exercises
  `authorMinutesOf` on synthetic strings only; no test file names any of the fourteen slugs.
- **`scripts/check-recipes.mjs` does not validate `>> time:`** — no format rule, no requirement
  that it agree with the timers. Nothing in `npm run verify` currently catches this class of
  error, which is why fourteen of them are in the collection.
- **The parser passes metadata through untouched** (`scripts/parse-recipes.mjs`), so
  `src/generated/recipes.json` is a build product; editing a `.cook` file and rebuilding is the
  whole change.
- **`23 days 2 hr` parses.** `authorMinutesOf` accepts any sequence of number-unit pairs, and
  `days` is a known unit, so a two-part figure with days in it is readable.

## Concurrency

T-006-01 runs alongside on `src/pages/[slug].astro`, `src/components/Timeline.astro` and possibly
`src/styles/site.css`. It changes the *labels* around both figures, never a value. My measurement
scripts read the chip from `recipes.json` and match the clock with a tolerant regex on
`Start to finish<\/dt><dd…><b…>`, so a label added beside either figure does not disturb the
comparison. The two tickets share no file: mine are fourteen `.cook` files under `recipes/`.

## Baseline recorded

`figures-before.json` holds, for all 658 pages, the chip string plus the `Start to finish` and
`Needs you` figures and their sub-lines, taken from a clean `npm run build` at the start of this
attempt. It is the evidence for "the chip and the clock still print exactly as before on every
other page".
