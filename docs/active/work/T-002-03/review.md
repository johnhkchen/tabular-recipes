# T-002-03 — Review

Twelve pressure-cooker recipes on the Instant Pot shelf: five stocks and broths, five bean
pots, a porridge and a beet soup. `npm run verify` is green.

## What changed

**Created — 12 files, all new basenames.**

```
recipes/soups/tonkotsu-broth-instant-pot.cook
recipes/soups/pho-broth-instant-pot.cook
recipes/soups/chintan-broth-instant-pot.cook
recipes/soups/chicken-broth-instant-pot.cook
recipes/soups/ham-hock-stock-instant-pot.cook
recipes/soups/congee-instant-pot.cook
recipes/soups/borscht-instant-pot.cook
recipes/rice-beans-and-grains/ful-medames-instant-pot.cook
recipes/rice-beans-and-grains/cuban-black-beans-instant-pot.cook
recipes/rice-beans-and-grains/refried-beans-instant-pot.cook
recipes/rice-beans-and-grains/boston-baked-beans-instant-pot.cook
recipes/rice-beans-and-grains/gigantes-plaki-instant-pot.cook
```

**Modified: none. Deleted: none.** Nothing outside `recipes/` was touched, and no file that
existed before this ticket was edited. Confirmed with `git show --stat` over all five
commits: four are insertions only, and the fifth changes only `>> step.N:` lines inside the
twelve files this ticket created.

Five commits, all through `lisa commit-ticket` with exact `--include` paths:
`6c3a6d5`, `72ce24e`, `f7955f3`, `0facdb8`, `0c59a09`. `git status --porcelain` over both
folders is empty.

## Acceptance criteria, against evidence

| Criterion | Result |
| --- | --- |
| ≥ 10 new files, each with `kit: Instant Pot` and a `dish:` naming an existing recipe | **12.** Every `dish:` slug confirmed with `ls recipes/*/<slug>.cook` before writing; re-confirmed in the built collection, where all 12 pair 1:1 with their plain file |
| Plain versions all in `rice-beans-and-grains/` or `soups/`, nothing from `stews-and-braises/` | **Met.** 7 in `soups/`, 5 in `rice-beans-and-grains/` |
| ≥ 4 beans from dry | **5** — ful medames, cuban black beans, refried beans, boston baked beans, gigantes plaki. Four of the five start unsoaked |
| ≥ 1 stock or broth | **5** — tonkotsu, phở, chintan, chicken, ham hock |
| Top of `docs/gaps/instant-pot.md` written in order, skips named | **Met.** Ranks 1, 2, 4, 9, 15, 24, 25, 26, 27, 28, 31 — every in-folder dish down to 31, in order — plus `gigantes-plaki` from the tail. Skips are named with reasons in `progress.md` |
| `check-recipes.mjs --labels` ok for every new file | **12 ok**, 8–15 rows × 5–6 cols, staircases read as a cook's verbs |
| Every pressure time canonical, sourced, none derived from the plain duration | **Met.** Source per number in `progress.md`, one row per file |
| Every timer named; pressure and release read as unattended | **48 timers, 0 unnamed.** All 26 pressure and release timers report `attention: 'unattended', source: 'name'` |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | **All 12 complete**, plus `dish` and `kit`, checked by script |
| Only `recipes/**` modified, no pre-existing file edited | **Met** |

## Test coverage

There is no unit test to add — this ticket adds data, and the repo's existing checks are the
right ones. What ran:

```
node scripts/check-recipes.mjs --labels <all 12>   → ok, 12 files
npm run recipes                                    → parsed 553 recipe(s), 0 errors
npm run verify                                     → 8 test files, 720 tests passed, 573 pages built
```

`npm run verify` is the one that matters here, because it runs
`src/lib/collection.test.ts` — the only check on "at most one plain way per dish" and
"variants agree about which dish they are" — plus `parse-recipes.mjs`, which is the only
thing that catches a `dish:` typo, an unknown counter name, or a dead `pairs-with`.

**The gap in coverage is the one that matters most and nothing can close it:** no test can
tell whether 40 minutes is the right time for a pinto bean. The only defence is the sourcing
discipline, and it is written down per number in `progress.md` rather than asserted. A
reviewer who wants to check one thing should check that table.

## Three judgement calls a reviewer should look at

**1. Tonkotsu ends with the lid off, and that is not a garnish.** The plain file argues the
white broth is *mechanical* — a rolling boil beating fat and collagen into an emulsion — and
a sealed pot suppresses exactly that boil. Kenji López-Alt's public position is that this
rules the pot out entirely. The file takes the middle road that every published pressure
tonkotsu actually takes: 90 minutes of pressure for the extraction, then 20 minutes of hard
uncovered boil for the colour, and it says outright that skipping the second leg gives you
thin grey pork stock. If a reviewer disagrees, the alternative is to drop rank 1 from the
shelf, not to shorten the boil.

**2. Chicken broth drops the plain version's 8 hr chill.** The chill is there to set the fat
into a liftable cap, and it is 8 of the plain file's 11 hr 30. Keeping it would leave the
variant at ~10 hr, which nobody would click. It is replaced with a 20-minute stand and a fat
separator, and the file says what is lost: less collagen at 45 minutes than at 3 hours, so it
never sets to the same firm wobble.

**3. Gigantes plaki keeps its overnight soak.** Every other bean here goes in dry. Gigantes
do not, because no source publishes a tested from-dry figure for a bean that size and a
gigante taken from bone dry in one sealed run splits. The ticket explicitly allows this
("if the canonical method still wants a soak, keep it and name the timer") and the file gives
the reason in step 1 rather than just stating the soak.

## Open concerns

**1. `src/lib/icons.ts` does not know the words this shelf is built on.** `npm run verify`
failed on `src/lib/icons.test.ts:273`, which requires the first word of every operation label
to be a verb `matchOperation()` recognises. `pressure` and `natural` are not in `VERB_ICONS`,
so `>> step.N: pressure cook 90 min` and `>> step.N: natural release 30 min` — the exact
captions the story's conventions section tells writers to use — fall through to the fallback
icon and fail the test.

This ticket may not touch `src/`, so the twelve files work around it: labels now read
`cook at high pressure 90 min` (flame) and `wait out the natural release 30 min` (hourglass).
The timer *names* are unchanged, so `src/lib/time.ts` still reads them as unattended.

The workaround is fine and arguably reads better. The concern is that it is a workaround in
twelve places rather than two entries in one map, and T-002-02 hit the same wall
independently (`9fd7e14`, "Open the vegetable legs with a verb the icon map reads"). **This
is worth a line in `VERB_ICONS` from T-002-08 or T-002-09** — `pressure`, `natural` and
`release` — after which writers on this shelf can caption a cell the way the story says to.
It is not a blocker: nothing on the shelf is wrong today.

**2. `borscht` is the weakest variant of the twelve, honestly.** 2 hr against the plain
2 hr 15. What it buys is attention, not clock: 55 of those minutes are the lid locked. The
file says so in step 5 rather than pretending otherwise. If a reviewer would rather the shelf
not carry a marginal win, `borscht` is the one to cut — the ticket's floors are still met at
11 files.

**3. Natural release durations are estimates of the pot's behaviour, not recipe choices.**
They vary with how full the pot is and how much liquid it holds; 15–30 min is written per
dish. They are on the long side deliberately, because a reader who plans for 30 and gets 20
is fine and the reverse is not.

**4. Nothing shelves these yet.** Every `sections[].items` under the Instant Pot counter in
`src/data/counters.json` is still empty, and `docs/gaps/instant-pot.md` still says
"0 recipes" and carries the `## What is already here` heading it is meant to lose. Both are
T-002-08's, correctly — but a reviewer browsing to `/menu/instant-pot/` before that ticket
runs will see a counter that renders nothing, and that is expected rather than broken.

## What a reviewer does not need to check

Slug uniqueness, counter-name resolution, pairing validity, one-plain-way-per-dish, and
whether each table tiles without holes — all of these throw or fail a test, and all of them
are green.
