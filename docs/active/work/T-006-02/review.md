# T-006-02 — Review

Fourteen recipe headers claimed less time than the timers inside their own files. All fourteen now
clear that bar, and no other page moved.

## What changed

One commit, `8822b39` — *"Raise fourteen headers to meet the timers in their own files"*:

```
14 files changed, 14 insertions(+), 14 deletions(-)
```

Fourteen `.cook` files, one `>> time:` line each. Nothing created, nothing deleted, no source code
touched. `src/generated/recipes.json` and `dist/` are gitignored build products and are not in the
commit.

| Recipe | `>> time:` was | now | the wait or step it was not counting |
| --- | --- | --- | --- |
| `chintan-broth` | 5 hr 30 min | 9 hr 30 min | `~chill{4%hr}` — "strain, chill, lift the fat off" (step 5) |
| `sour-dill-pickles` | 23 days | 23 days 2 hr | `~soak{2%hr}` before packing. 23 days was the 3-week ferment + 2-day chill exactly |
| `baklava` | 3 hr 30 min | 7 hr 30 min | `~stand{4%hr}` under the cold syrup (step 6) |
| `bulgogi-marinade` | 15 min | 2 hr 15 min | the `~{2%hr}` marinate (step 4); 15 min was the three mixing steps |
| `no-knead-bread` | 20 hr | 20 hr 45 min | the bake — `~{30%min}` covered + `~{15%min}` open. 20 hr was rise + rest exactly |
| `focaccia` | 20 hr | 20 hr 25 min | the `~{25%min}` bake. 20 hr was the 18 hr chill + 2 hr rise exactly |
| `mint-chutney` | 15 min | 45 min | `~chill{30%min}` after the yogurt (step 3) |
| `chocoflan` | 6 hr | 6 hr 10 min | `~caramel{8%min}` (step 1). 6 hr was bake + cool + chill exactly; 6 hr 8 rounded up to the grain |
| `lotus-seed-paste` | 6 hr 15 min | 6 hr 30 min | nothing omitted — soak 4 hr + simmer 60 + fry 30 + cool 1 hr already make 6 hr 30 |
| `deli-rye-bread` | 15 hr | 15 hr 15 min | the `~{8%min}` knead, plus 5 min rounded off the sponge/rise/proof/bake chain |
| `turnip-cake` | 14 hr | 14 hr 15 min | the 15-min daikon simmer and the 8-min pan-fry; 14 hr was steam + cool + chill (13 hr 50) rounded up |
| `chicken-adobo` | 1 hr 30 min | 1 hr 45 min | the 8-min glaze reduction — marinate + simmer alone are 1 hr 35 |
| `taro-cake` | 14 hr | 14 hr 10 min | the 5-min fry, 4-min toss and 8-min pan-fry around the same steam/cool/chill chain |
| `teleras` | 2 hr 50 min | 2 hr 55 min | nothing omitted — its five timers make 2 hr 53 |

Two shapes, and the ticket was right to ask that the pattern be checked rather than assumed. The
big gaps are a long unattended wait left out — but `no-knead-bread`, `focaccia` and `chocoflan`
count their long waits and leave out **the cooking**, and six of the fourteen omit nothing at all:
their headers were simply rounded the wrong way, by 3 to 15 minutes. The rule applied was
*header + the omitted timer* where a whole timer was outside it, and *round up to the collection's
five-minute grain* where it was not. Every figure is arithmetic on numbers already in the file,
plus at most four minutes of upward rounding.

## Evidence, against each acceptance criterion

**Zero pages where the clock exceeds the chip.** `npm run build`, then
`compare-clock-to-chip.mjs` over all 658 pages:

```
pages checked: 658
pages printing a clock: 635
unreadable on one side or the other: 0
clock GREATER than chip: 0        ← was 14
```

**Each of the fourteen named with old, new and the missing wait.** The table above, and at greater
length in `progress.md`.

**No timer, step, ingredient or `step.N` label changed.** `time-lines.diff` holds the whole diff.
Lines in it that are not a `>> time:` line: **0**. Counted mechanically:

```
git diff --stat -- recipes/                        # 14 files, 14 insertions, 14 deletions
git diff -U0 -- recipes/ | grep -cE '^\+>> time: ' # 14
git diff -U0 -- recipes/ | grep -vcE '^(\+\+\+|---|@@|diff |index |[-+]>> time: )'  # 0
```

**No file needed `>> time:` to be defined, so none was left unchanged.** This is the judgement most
worth a reviewer's attention, so the reasoning is stated plainly: a header meaning *how long you
are busy* and a header meaning *how long from start to eating* disagree about whether an unattended
wait belongs in the figure, but neither licenses a figure **below the timers on the critical path**
— under either reading those are minutes the recipe itself claims to spend. The bar is reachable
from both definitions, so raising a number to reach it does not pick one. What *would* have picked
one is setting each header equal to the clock; that option was considered and rejected in
`design.md`, because on eleven of the fourteen the clock is a floor and matching it would assert
that the untimed steps take zero — `baklava`'s butter-clarifying, nut-chopping and filo-layering
most visibly.

**Recipes outside the fourteen untouched, and the chip and clock print as before elsewhere.**
`figures-before.json` (658 pages, clean build before the edit) against `figures-after.json`
(after):

```
pages compared: 658
pages present in only one build: 0
chip changed on 14 pages          ← the fourteen, and only the fourteen
total changed on 0 pages          ← `Start to finish` and its "N of M steps give no time" sub-line
needsYou changed on 0 pages       ← `Needs you` and its sub-line
```

Both clock figures are identical on all 658 pages, including the fourteen. That is the direct
proof no timer moved: the clock is computed from timers alone.

**`npm run verify` passes.** Exit 0 — 658 recipes `ok` from `check-recipes.mjs`, 833 tests in 9
files passed, astro build complete at 682 pages.

**Re-checked against T-006-01.** T-006-01 landed its label change in the working tree while this
ticket was in Implement (`recipe says` on the chip in `src/pages/[slug].astro`, plus a comment in
`Timeline.astro`). Rebuilding with both changes present and re-running everything gives the same
answers: `clock GREATER than chip: 0`, chip changed on 14, `total` and `needsYou` changed on 0
(`figures-after-with-T-006-01.json`). The two tickets share no file and do not interact — theirs is
a label, mine is a value.

## Test coverage

No unit test was added, and that is a considered position rather than an omission. The change is
data, not code: no branch was introduced, and the collection's data is verified the way the rest of
it is — by `scripts/check-recipes.mjs` and by measuring the built site. `compare-clock-to-chip.mjs`
is the test, it runs over all 658 pages in one command against a fresh build, and it is in the work
directory for a reviewer to re-run.

**The gap this leaves, stated plainly: nothing in `npm run verify` will catch the fifteenth of
these.** `check-recipes.mjs` has no rule about `>> time:` at all, which is how fourteen of them
accumulated. A rule that fails any recipe whose header is below its own critical path is roughly
twenty lines against `buildSchedule`, and it is outside the files this ticket is permitted to
modify (*"Only the `>> time:` line inside those fourteen `.cook` files is modified"*). It is the
recommended follow-up and belongs to S-006 or to whatever eventually settles the definition.

## Open concerns

1. **`6 hr 10 min` and `14 hr 10 min` read as oddly precise** next to a collection of quarter
   hours. Ten-minute figures do occur (22 times), so this is in-house, but it is the visible cost
   of refusing to round up further than the file supports. A reviewer who would rather see
   `6 hr 15 min` and `14 hr 15 min` is asking for five minutes nobody wrote down; the change is one
   character each if that is the call.
2. **`baklava` at 7 hr 30 min and `chintan-broth` at 9 hr 30 min are the two big movers**, and both
   now read as start-to-finish figures where they previously read as how-long-you-are-busy figures.
   That shift is unavoidable in any fix that raises the number, and it is the shift S-006 predicted
   when it said these were "wrong `>> time:` lines". It is not a decision about what `>> time:`
   means across the collection, and it does not bind the other 644.
3. **The clock is a critical path, not a sum.** The ticket describes `Start to finish` as "a sum of
   the durations written in the file", which is true along the chain that sets the total but not
   across parallel branches — `deli-rye-bread`'s 2-minute glaze and `turnip-cake`'s 5-minute fry
   simmer beside longer work and add nothing. Where those off-chain timers are the thing the header
   left out, they are named above anyway. No conclusion changes; the description is just looser
   than the code.
4. **`sour-dill-pickles` now equals its floor exactly** at `23 days 2 hr`, with one untimed step
   ("pack the jar"). The header therefore implies packing a jar takes no time. The alternative was
   inventing a number for it, which the collection does not do.

## Nothing left staged or modified

`git status --short -- recipes/` is empty. The only uncommitted paths in the tree belong to
T-006-01 and to Lisa's own artifact publication.
