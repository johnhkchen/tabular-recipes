# T-001-03 — Plan

Seven commits, each a group that makes sense to read on its own and each verified before it
lands. Every commit goes through `lisa commit-ticket` with exact `--include` paths; the
ordinary git index is never used.

## Verification, defined once

Two commands, both read-only, both safe to run while other tickets are working:

```sh
# per file, and the staircase it produces
node scripts/check-recipes.mjs --labels <the files in this step>

# the whole collection, after every step
node scripts/check-recipes.mjs
```

And after the last step, the cross-file checks that only the build sees:

```sh
npm run recipes     # unique slugs, counter names resolve, pairings resolve and are mutual
npx vitest run      # expect 405 passed / 1 failed — the pre-existing crema-mexicana snapshot
git status --porcelain -- recipes/    # must be empty at the end
```

**Pass criteria per file**: `ok`, 5–16 ingredient rows, 3–6 operations, and a `--labels`
staircase whose every line is a verb a cook would say — no fragments like "in a until".

**Baseline to beat, recorded before any change**: 254 files draw a table; `npm run recipes`
reports 254 recipes, 13 categories, 254 counters named, 138 pairings; `npx vitest run` is
405 passed / 1 failed. The single failure is T-001-01's documented
`schedule.test.ts` snapshot (`crema-mexicana` displacing `pizza-dough`) and is not this
ticket's to fix. **Any second failure is mine.**

## Step 1 — Pad thai and its sauce  *(rank 1)*

Files: `recipes/sauces-and-gravies/pad-thai-sauce.cook`,
`recipes/noodles-and-stir-fries/pad-thai.cook`

The sauce first, so the dish can measure it in. This step also creates the
`noodles-and-stir-fries/` folder — the first noodle dish in the collection, which is the
single most conspicuous absence on the page.

Verify: both files `ok`; `pad-thai` shows 14 rows × 6 cols; `pad-thai-sauce` 7 × 5.

Commit: `Write pad thai and its sauce for the Thai Kitchen`

## Step 2 — Red curry  *(rank 2)*

File: `recipes/stews-and-braises/thai-red-curry.cook`

The written paste finally has a curry under it. `pairs-with: thai-red-curry-paste` is what
joins them, and it is written on this side because the paste file belongs to no ticket here.

Verify: `ok`, and the label staircase reads *crack the cream → fry the paste → simmer →
season → stir in*.

Commit: `Write red curry for the Thai Kitchen`

## Step 3 — The three remaining pastes  *(rank 3 and the components list)*

Files: `recipes/spice-blends-and-marinades/thai-yellow-curry-paste.cook`,
`panang-curry-paste.cook`, `massaman-curry-paste.cook`

Grouped because they are one idea repeated three ways and they share a shape with the
existing red paste. Massaman is the one with the charring branch, so it gets the closest
look: its step 4 reaches back three steps and its step 5 reaches back three, and if either
index is off the tree either throws or draws the wrong dish.

Verify: three `ok` lines; each 12–14 rows; the massaman staircase shows the char as its own
column rather than folded into the pound.

Commit: `Write the yellow, panang and massaman curry pastes for the Thai Kitchen`

## Step 4 — The three curries those pastes unlock  *(rank 3)*

Files: `recipes/stews-and-braises/thai-yellow-curry.cook`, `panang-curry.cook`,
`massaman-curry.cook`

After this the "Curries by colour" section is five colours of curry over five colours of
paste, which is what the reference says the section *is*.

Verify: three `ok` lines; `massaman-curry`'s claimed `time` within a few percent of
5 + 4 + 90 + 25 min, since that is the check the schedule tests would apply if it were ever
long enough to be sampled.

Commit: `Write the yellow, panang and massaman curries for the Thai Kitchen`

## Step 5 — Green curry paste  *(components list)*

File: `recipes/spice-blends-and-marinades/thai-green-curry-paste.cook`

Its own step because it is the one file that overlaps something already written — step 1 of
`thai-green-curry.cook` — and a reviewer should be able to see that decision in one commit
rather than find it inside a batch of three.

Verify: `ok`; `npm run recipes` still reports pairings resolving, which is what proves
`pairs-with: thai-green-curry` reached the existing file without editing it.

Commit: `Write green curry paste for the Thai Kitchen`

## Step 6 — Tom yum, and the three wok plates  *(ranks 4, 5, 6)*

Files: `recipes/soups/tom-yum-goong.cook`,
`recipes/noodles-and-stir-fries/pad-see-ew.cook`, `pad-kee-mao.cook`, `pad-krapow.cook`

Four dishes, three empty sections filled: the sour soup beside the creamy one, the
wide-noodle pair, and the lunch plate. `pad-krapow` carries two timers in one step, so its
`--labels` output is read specifically to confirm the fry and the pork read as one operation
rather than a mangled fragment.

Verify: four `ok` lines; the whole collection still draws.

Commit: `Write tom yum, pad see-ew, pad kee-mao and pad krapow for the Thai Kitchen`

## Step 7 — The two salads  *(ranks 7, 8)*

Files: `recipes/salads/som-tum.cook`, `recipes/salads/larb-gai.cook`

Creates `recipes/salads/`. The first salads in a collection that holds twelve dressings.

Verify: both `ok`; then the **full** pass — `node scripts/check-recipes.mjs`,
`npm run recipes`, `npx vitest run`, `git status --porcelain -- recipes/`.

Commit: `Write som tum and larb gai for the Thai Kitchen`

## Testing strategy

There are **no unit tests to add**. This ticket adds data, and the collection's invariants
are already tested generically:

| Invariant | Where it is enforced | What would break it here |
| --- | --- | --- |
| every file draws a table | `check-recipes.mjs`, run per step | a bad `~N` index, a split, two endings |
| slugs unique | `parse-recipes.mjs`, `collection.test.ts` | a slug colliding with one of 254 |
| counter names real | both, plus `check-recipes.mjs` | a typo in `Thai Kitchen` |
| pairings resolve and are mutual | `parse-recipes.mjs`, `collection.test.ts` | a `pairs-with` naming a dish I chose not to write |
| every timer readable, no 4-hour hands-on wait | `collection.test.ts` | an unnamed timer in a long simmer |
| one plain way per dish | `parse-recipes.mjs` | a stray `dish:` line |

The one collection-wide assertion this work could newly break is
`schedule.test.ts > the recipes with the longest critical path`, which pins three slugs by
name. The longest thing written here is massaman at ≈ 2 hr 10 min against a third place of
1568 min, so it cannot reach the list. This is checked, not assumed: `npx vitest run` at the
end must still report exactly one failure, and the same one.

## Acceptance criteria → evidence

| Criterion | How it is shown |
| --- | --- |
| ≥16 recipes at Thai Kitchen, ≥14 exclusive | `grep -rl "Thai Kitchen" recipes/ \| wc -l` = 21, and each of the 16 new files names that counter alone |
| top of the ranked list written, in order, skips named | steps 1–7 walk ranks 1→8; `design.md` names every skip with a reason |
| `check-recipes.mjs --labels` ok, staircase reads as verbs | output pasted into `review.md` for all 16 |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` incl. no-diacritics form | every file; spot-checked with a grep over the sixteen |
| every timer named | `grep -c '~{' <the sixteen>` returns nothing |
| real quantities, canonical method | stated per dish in `review.md`; the pastes are pounded, not blended, and the curries crack the cream before the paste |
| only `recipes/**` modified | `git status --porcelain` shows nothing outside `recipes/` and Lisa's own files |

## Risks, and what is done about each

1. **A `~N` index off by one** draws a silently wrong tree instead of failing. Mitigated by
   writing the arithmetic into `structure.md` first and reading every `--labels` staircase,
   which shows the column each operation actually landed in.
2. **A new folder surprises something.** Checked in Research: nothing in `src/` reads a fixed
   category list, and the fallback in `counters.json` only applies to files with no
   `counters:` line. Confirmed empirically by `npm run recipes` in step 7.
3. **Row or column overrun.** Every file's counts are predicted in `structure.md`; the
   checker reports actuals, and any file over 16 rows or 6 ops gets a step folded before it
   is committed.
4. **Another ticket writes one of these dishes concurrently.** The story's contention table
   assigns pad thai and the Thai rolls here explicitly, and none of the sixteen appears on
   another counter's ranked list. If a slug collides anyway, `parse-recipes.mjs` fails loudly
   and T-001-18 arbitrates.
