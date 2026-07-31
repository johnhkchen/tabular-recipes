# T-002-02 — Review

Thirteen pressure-cooker braises written into `recipes/stews-and-braises/`, each paired to a
dish already on the shelf. Ten was the floor; thirteen leaves the ranked list's next eight
dishes documented as deliberate skips rather than as work not reached. All eight acceptance
criteria met. Nothing that existed before this ticket was opened.

## What changed

| File | Rows × cols | Dish it pairs to | High pressure | Release |
| --- | --- | --- | --- | --- |
| `birria-de-res-instant-pot.cook` | 15 × 5 | `birria-de-res` | 45 min | natural 15 |
| `carnitas-instant-pot.cook` | 10 × 5 | `carnitas` | 45 min | natural 15 |
| `pot-roast-instant-pot.cook` | 13 × 7 | `pot-roast` | 75 min, then 4 | natural 20, then quick |
| `braised-short-ribs-instant-pot.cook` | 12 × 6 | `braised-short-ribs` | 40 min | natural 15 |
| `oxtails-instant-pot.cook` | 12 × 5 | `oxtails` | 45 min | natural 20 |
| `cachete-instant-pot.cook` | 12 × 5 | `cachete` | 45 min | natural 15 |
| `beef-bourguignon-instant-pot.cook` | 11 × 6 | `beef-bourguignon` | 35 min | natural 15 |
| `corned-beef-instant-pot.cook` | 14 × 6 | `corned-beef` | 90 min | natural 20 |
| `chile-verde-instant-pot.cook` | 14 × 5 | `chile-verde` | 35 min | natural 15 |
| `chili-con-carne-instant-pot.cook` | 12 × 6 | `chili-con-carne` | 35 min | natural 15 |
| `hungarian-goulash-instant-pot.cook` | 11 × 6 | `hungarian-goulash` | 35 min, then 4 | natural 15, then quick |
| `collard-greens-instant-pot.cook` | 11 × 5 | `collard-greens` | 20 min | **quick** |
| `beef-stew-instant-pot.cook` | 13 × 7 | `beef-stew` | 35 min, then 4 | natural 15, then quick |

Nothing modified. Nothing deleted. No `src/`, no `docs/gaps/`, no `counters.json`, no
pre-existing `.cook` file. Six commits, all through `lisa commit-ticket` with exact paths:

```
87679ec  Beef stew under pressure, and the shape the shelf copies              1 file
e6126cb  The four the appliance is sold on: birria, carnitas, pot roast, …     4 files
b2f3055  Oxtails, cachete, and a bourguignon that reduces with the lid off     3 files
7b1d0a4  Corned beef, chile verde, chili and goulash on the smaller clock      4 files
d28120f  Collards in twenty minutes, vented the second the timer ends          1 file
9fd7e14  Open the vegetable legs with a verb the icon map reads                3 files (labels)
```

## Acceptance criteria, one by one

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ≥ 10 new `.cook` files, each with `>> kit: Instant Pot` and a `>> dish:` naming a recipe that exists, confirmed with `ls` | 13 files. The `ls` transcript for all 13 slugs is in `structure.md` § *The `dish:` targets*. `src/generated/recipes.json` then shows all 13 resolving: each plain file lists exactly its one variant |
| 2 | Every one a braise or stew whose plain version is in `recipes/stews-and-braises/` | All 13 plain files are in that folder (same `ls`). Nothing from `rice-beans-and-grains/` or `soups/` |
| 3 | Top of `docs/gaps/instant-pot.md` written in order; skips named with a reason | Ranks 3, 5, 6, 7, 10, 11, 12, 14, 16, 17, 18, 21 in order, plus rank 30 (`beef-stew`, named in the ticket's Context). Nine skips with reasons in `progress.md` § *Skipped* |
| 4 | `check-recipes.mjs --labels` ok for every new file, staircase reads as a cook's verbs | `all 13 file(s) draw a table.` Staircases in `progress.md`; the one place they did not read as verbs was fixed in `9fd7e14` |
| 5 | Every pressure time canonical, sourced in the work artifact, none derived from the plain duration | `progress.md` § *The numbers* — 13 rows, each naming its source (story text, the gap note's timing table, or the dish's canonical time with the argument stated in the file) |
| 6 | Every timer named; pressure and release timers read as unattended | All 13 verified with a script that prints what `time.ts` derives: every `~come to pressure`, `~pressure cook`, `~natural release`, `~quick release` is `unattended (name)`. Sample in `progress.md` |
| 7 | `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | Audited across all 13, plus `dish`, `kit` and `time`; no field missing in any file |
| 8 | Only `recipes/**` modified; no pre-existing file edited | `git show --stat` on all six commits: 13 paths, all new files under `recipes/stews-and-braises/`, and the only re-touch is my own three labels |

## Test coverage

**This ticket adds data, not code, so the coverage that matters is what already reads every
new file.** All of it ran:

| Risk | Guard | Result |
| --- | --- | --- |
| Malformed table, missing metadata, unknown counter | `scripts/check-recipes.mjs` | `all 549 file(s) draw a table.` |
| Two plain files for one dish | `parse-recipes.mjs:111-126`, `collection.test.ts:66-74` | pass |
| Variant claiming a different dish than it reports | `collection.test.ts:60-64` | pass |
| A timer with no readable duration | `collection.test.ts:90-95` | pass |
| Four unbroken hands-on hours | `collection.test.ts:77-88` | pass |
| `>> time:` unreadable | `schedule.test.ts:279-284` | pass, including `5 days 4 hr 30 min` on the corned beef |
| Duplicate slug, broken `pairs-with` | `collection.test.ts`, `parse-recipes.mjs` | pass |
| An operation verb with no icon | `icons.test.ts:262-274` | **fails on files this ticket does not own** — see below |

`npx vitest run`: **717 passed, 1 failed (718)**. The one failure is the icons test, and no
verb in it belongs to this ticket.

**What no test can check** is the only thing that could hurt someone: whether 45 minutes is
right for a beef cheek. That is a reading check, done per file against the sources in
`progress.md`, and it is why nine dishes were skipped rather than written on a number that
could not be stood behind.

## Open concerns

1. **`src/lib/icons.test.ts` currently fails on the shared branch, on other tickets' files.**
   The remaining fall-through verbs are `cold`, `dry`, `full`, `molasses`, `natural`,
   `pressure`, `rice`, and every one traces to a file owned by **T-002-03**, still in flight in
   the same working tree: `tonkotsu-broth-instant-pot`, `pho-broth-instant-pot`,
   `chintan-broth-instant-pot`, `chicken-broth-instant-pot`, `ham-hock-stock-instant-pot`,
   `boston-baked-beans-instant-pot`, `cuban-black-beans-instant-pot`, `ful-medames-instant-pot`,
   `refried-beans-instant-pot`, `congee-instant-pot`. Attribution was computed per verb, not
   guessed. Two fixes are open to that ticket and neither is mine to make: open those labels
   with a verb (`add the …`, `bring …`), or add the words to `VERB_ICONS` in `src/lib/icons.ts`
   — which this ticket may not touch under Criterion 8. Nothing here is blocked on it.

2. **`birria-de-res` and `cachete` do not appear in the gap note's timing table.** Their 45
   minutes is the canonical figure for the dish, corroborated by the cut class rather than
   taken from the table (short rib 40 and oxtail 45 sit either side of both). If T-002-09 wants
   one shared table, these two are the rows to add to it, not to re-derive.

3. **Three batch sizes were cut, and each is a real change to the dish, stated in its file**:
   `corned-beef` 5 lb → 3 lb (servings 8 → 6), `braised-short-ribs` 5 lb → 4 lb (servings 6 →
   4), `collard-greens` 4 lb → 3 lb (servings 8 → 6). A 6-quart pot's fill line is the reason
   in all three. A reviewer who thinks the site should assume an 8-quart pot would want those
   three numbers revisited together.

4. **`chile-verde` at 35 min and `carnitas` at 45 min are both pork shoulder.** The difference
   is cut size — 1 1/2-in cubes against 2-in chunks — and both files say so in the pressure
   step. It reads as an inconsistency at a glance and is not one, but it is the pair most
   likely to be queried.

5. **The plain files are untouched, so the `pairs-with` mutuality now runs both ways in
   generated data.** `beef-stew`'s page will list `dinner-rolls` as before and the variant
   switch appears on both pages. No source file was opened to make that happen; it falls out
   of `parse-recipes.mjs`.

6. **`docs/gaps/instant-pot.md` still opens with "0 recipes"** and its `## What is already
   here` heading is still not `## What it has`. That rename is T-002-08's, explicitly, and was
   deliberately left alone.

## What a human should look at first

The thirteen numbers in `progress.md` § *The numbers, and where each came from*, in that table
alone. Everything else in this ticket is checkable by a script; those are not, and an
undercooked pork shoulder with a confident number beside it is the failure this ticket was
written to avoid.
