# T-006-02 — Progress

## Done

**Step 0 — ownership resolved.** `.gitignore` ignores `src/generated/` and `dist/`, and
`git ls-files src/generated` returns nothing, so both are build products and neither is committed.
The ticket owns exactly fourteen `.cook` files.

**Steps 1 and 2 — fourteen `>> time:` lines edited.** Eight where a whole timer sat outside the
header, six where the header was rounded down past its own timers. Every new figure is a multiple
of five minutes, matching the collection's grain.

| Recipe | old | new | what the old figure was not counting |
| --- | --- | --- | --- |
| `chintan-broth` | 5 hr 30 min | 9 hr 30 min | `~chill{4%hr}` — "strain, chill, lift the fat off" (step 5) |
| `sour-dill-pickles` | 23 days | 23 days 2 hr | `~soak{2%hr}` — the ice-water soak before packing (step 2). 23 days is the ferment and the chill exactly |
| `baklava` | 3 hr 30 min | 7 hr 30 min | `~stand{4%hr}` — the tray standing under cold syrup (step 6) |
| `bulgogi-marinade` | 15 min | 2 hr 15 min | the `~{2%hr}` marinate in step 4. The old figure is the three mixing steps only |
| `no-knead-bread` | 20 hr | 20 hr 45 min | the bake, `~{30%min}` covered + `~{15%min}` open. 20 hr is the 18 hr rise + 2 hr rest exactly, with the oven left out |
| `focaccia` | 20 hr | 20 hr 25 min | the `~{25%min}` bake. 20 hr is the 18 hr chill + 2 hr rise exactly |
| `mint-chutney` | 15 min | 45 min | `~chill{30%min}` after the yogurt goes in (step 3) |
| `chocoflan` | 6 hr | 6 hr 10 min | `~caramel{8%min}` (step 1). 6 hr is bake + cool + chill exactly; 6 hr 8 rounded up to the grain |
| `lotus-seed-paste` | 6 hr 15 min | 6 hr 30 min | nothing omitted — its four timers (soak 4 hr, simmer 60, fry 30, cool 1 hr) already make 6 hr 30, and the header was 15 min under them |
| `deli-rye-bread` | 15 hr | 15 hr 15 min | the `~{8%min}` knead, and 5 min the header rounded away from the 12 hr sponge + 90 min rise + 1 hr proof + 35 min bake |
| `turnip-cake` | 14 hr | 14 hr 15 min | the 15-min daikon simmer and the 8-min pan-fry. 14 hr is the steam + cool + chill (13 hr 50) rounded up |
| `chicken-adobo` | 1 hr 30 min | 1 hr 45 min | the 8-min reduction to a glaze, and 5 min of the 35-min simmer — the marinate and simmer alone are 1 hr 35 |
| `taro-cake` | 14 hr | 14 hr 10 min | the 5-min fry, the 4-min toss and the 8-min pan-fry. Same steam/cool/chill chain as `turnip-cake`, without its daikon simmer |
| `teleras` | 2 hr 50 min | 2 hr 55 min | nothing omitted — its five timers make 2 hr 53, and the header was 3 min under them |

**Step 3 — the diff, taken before any rebuild.**

```
14 files changed, 14 insertions(+), 14 deletions(-)
lines in the diff that are not a `>> time:` line: 0
```

Saved whole to `time-lines.diff`. No timer, step label, ingredient or line of prose is touched in
any of the fourteen.

**Step 4 — rebuilt and re-measured across all 658 pages.**

```
pages checked: 658
pages printing a clock: 635
unreadable on one side or the other: 0
clock GREATER than chip: 0
```

From fourteen to zero. The `unreadable: 0` line is the guard that every new figure still parses
through `authorMinutesOf`, including the two-unit `23 days 2 hr`.

**Step 5 — nothing else moved.**

```
pages compared: 658
pages present in only one build: 0
chip changed on 14 pages        (the fourteen, and only the fourteen)
total changed on 0 pages        (`Start to finish`, including its "N of M steps give no time" sub-line)
needsYou changed on 0 pages     (`Needs you`, including its sub-line)
```

Both clock figures are byte-identical on all 658 pages — including the fourteen, whose clocks were
already right. That is the direct evidence that no timer moved.

**Step 6 — `npm run verify` passes.** Exit 0: 658 recipes `ok` from `check-recipes.mjs`, 833 tests
in 9 files passed, astro build complete, 682 pages.

## Deviations from the plan

None in substance. Two notes:

- Plan step 5 called for a `diff-figures.mjs` to be written during the step; it was, and it is in
  the work directory with the other scripts.
- The plan allowed for `src/generated/recipes.json` possibly being a ticket-owned path. It is not
  — `.gitignore` settles it — so the commit is fourteen paths and nothing else.

## Remaining

- Commit the fourteen through `lisa commit-ticket`.
- Review: `review.md` and `review-disposition.json`.

## Watch item

T-006-01 is editing `src/components/Timeline.astro` and `src/pages/[slug].astro` on this branch at
the same time. Nothing of theirs appeared in my working tree during any of the three builds
(`git status --short` shows only my fourteen `.cook` files plus untracked `docs/active/work/`), so
the before/after comparison is uncontaminated. If their change lands afterwards it can only add a
label beside these figures; it cannot alter either value, and the fourteen headers stay above their
clocks regardless.
