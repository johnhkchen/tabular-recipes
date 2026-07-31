# T-003-03 — Plan

Ordered steps, each verifiable, each a commit through `lisa commit-ticket`.

## Verification strategy

There is no unit test to write here — this ticket adds no code, only content — so "tests" means
the checks the repo already runs against content, and the discipline is to run them per batch
rather than once at the end.

**Per file (the criterion's own check):**

```sh
node scripts/check-recipes.mjs --labels recipes/soups/<slug>.cook
```

Passing means: required metadata present, counter name known, slack line whole, the tree draws,
the grid tiles with no holes, ≥3 rows, ≥3 columns, no unlabelled operation cell. `--labels`
additionally prints the staircase, which is the only way to see whether the labels read as a
cook's verbs — that is a criterion and it is judged by eye, not by exit code.

**Per file (the clock), with a scratch harness over the real `normalise` + `buildSchedule`:**

- total, hands-on and walk-away minutes;
- every timer's attention and confidence.

Acceptance: on every old-fire file the long timer reads `unattended` with `stated` confidence,
and hands-on lands near ten minutes — the shelf's claim, checked rather than asserted.

**Whole collection, at the end:**

```sh
npm run recipes
npx vitest run src/lib/icons.test.ts src/lib/collection.test.ts \
               src/lib/schedule.test.ts src/lib/layout.test.ts
npx vitest run                      # the full suite, to see exactly what the aisle gap costs
npm run build
```

Expected green: icons (every leading verb known), collection (unique slugs, known counters,
timeline sanity), schedule (`>> time:` readable on all 610 files), layout (every table tiles).

Expected **red, by design**: `src/lib/shopping.test.ts` aisle coverage — see Design D10. That is
T-003-06's criterion, not this one's, and this ticket may not touch `src/data/aisles.json`. The
exact unplaced list is recorded for it.

## Steps

### Step 1 — the reference pot

Write `recipes/soups/green-radish-carrot-pork-bone-soup.cook`.

It is the default household pot and it is where the shared wording is fixed: the blanch label, the
simmer label, the season label, the `cold water` line, the footer note, the ingredient-note style.
Fifteen files copy it, so it is checked and read carefully before any of them exist.

- Verify: `--labels` prints `blanch from cold, then rinse the bones / rinse the dried goods /
  simmer 3 hr, barely a quiver / season at the end, never at the start`.
- Verify: clock reads ~3 hr 30 min total, ~10 min hands-on, 3 hr walk-away, `stated`.
- Commit: `lisa commit-ticket --ticket-id T-003-03 --message "The pot a house makes when nobody
  has decided" --include recipes/soups/green-radish-carrot-pork-bone-soup.cook`

### Step 2 — old-fire ranks 2–6

`winter-melon-jobs-tears-soup`, `lotus-root-dried-octopus-soup`, `watercress-honey-date-soup`,
`peanut-black-eyed-pea-chicken-feet-soup`, `overlord-flower-soup`.

Rank 4 is the first five-operation file (the watercress goes in twice) and rank 6 is the first
with a real soak (`~soak{30%min}` on the overlord flower), so both shapes get their first outing
here.

- Verify: `--labels` over all five; clock over all five.
- Commit: one commit, five `--include` paths.

### Step 3 — old-fire ranks 7–11

`corn-carrot-pork-bone-soup`, `chinese-yam-goji-black-chicken-soup`, `ching-bo-leung-soup`,
`sha-shen-yu-zhu-soup`, `hairy-gourd-dried-scallop-soup`.

Rank 8 carries the strongest 補 register on the shelf and rank 9 is the one soup that is *about*
the dried goods — the two files where D9's rule (record the tradition's reasoning, assert nothing
about a body) is doing the most work. Both get read back against that rule before committing.

Rank 10 is the four-ingredient pot and will have the fewest rows on the shelf; check it clears
the checker's three-row floor with room.

- Verify: `--labels` + clock over all five.
- Commit: one commit, five paths.

### Step 4 — old-fire ranks 12–16

`dried-bok-choy-pork-lung-soup`, `lotus-seed-lily-bulb-soup`, `old-cucumber-rice-bean-soup`,
`green-papaya-peanut-trotter-soup`, `apple-pear-pork-bone-soup`.

Rank 12 is the untimed-step file: the lung is washed "until it runs clear and the lung is white",
which the gap note says is a judgement and that writing a number for it would be inventing one. So
that step carries no timer at all, and the file says plainly that it is most of an hour. Check the
clock still reads sensibly with an untimed step in it.

- Verify: `--labels` + clock over all five; confirm rank 12's `>> time:` is still readable by
  `authorMinutesOf` even though one step has no timer.
- Commit: one commit, five paths.

### Step 5 — the five quick daily soups

`tomato-potato-beef-soup`, `seaweed-egg-drop-soup`, `mustard-greens-tofu-soup`,
`crucian-carp-tofu-soup`, `century-egg-amaranth-soup`.

Different skeleton: water boiled first, no blanch, no footer note. Write
`tomato-potato-beef-soup` first and check it before the other four, the same way step 1 worked.

`crucian-carp-tofu-soup` is the one file on the shelf where a hard boil is correct, and it is the
only place the word `boil` is used as a virtue rather than a warning. Its header note has to say
so, because a reader arriving from any of the sixteen old-fire files has just been told four times
not to let the pot boil.

- Verify: `--labels` + clock over all five.
- Commit: one commit, five paths.

### Step 6 — whole-shelf verification

```sh
node scripts/check-recipes.mjs --labels recipes/soups/*.cook
npm run recipes
npx vitest run
npm run build
```

Then a read-through against the criteria, one at a time:

1. ≥20 new files naming `counters: The Soup Pot` → count 21.
2. ≥12 老火湯 and ≥5 滾湯 → 16 and 5.
3. `aka` on every one carries characters + romanisation + plain-keyboard spelling.
4. `slack` on every one, with a reason naming a real failure, and no two files given the same
   failure.
5. The gap note's ranks are written in order as far as the count reaches; anything not reached is
   named with a reason in `progress.md`.
6. `progress.md` says, per soup, where the method and the pairing came from.
7. Found dishes recorded by slug for T-003-06; nothing pre-existing edited
   (`git status` shows only additions under `recipes/soups/`).
8. `check-recipes.mjs --labels` ok on all 21, staircases read as verbs.
9. Every timer named; the three-hour simmer reads unattended in the clock.
10. Only `recipes/**` modified.

Anything that fails here is fixed and re-committed before Review, not carried into it.

### Step 7 — Review

`review.md` and `review-disposition.json`, then `lisa check-disposition T-003-03`.

The disposition is a **pass** if all ten criteria above hold. The aisle-coverage test being red is
not a block: it is the handoff the board was drawn for (Design D10), this ticket's criteria do not
name `npm run verify`, and T-003-06's criteria do. It is stated in `review.md` in the first
section rather than buried, with the exact ingredient list a reviewer or T-003-06 needs.

## Risks, and what each would look like

| risk | how it shows | response |
| --- | --- | --- |
| a label opens with a verb the icon map lacks | `icons.test.ts` names it in `fellThrough` | reword the label with a verb from the map; cannot edit `icons.ts` |
| a step's back-reference is off by one | `check-recipes` reports a hole or a second ending | the note steps are the usual cause — they must be first or last |
| a `>> time:` line unreadable | `schedule.test.ts` names the slug | drop ranges and stray words; `3 hr 30 min` form only |
| a slack line with no reason | `check-recipes` fails that file with the legal levels | write the failure, or drop the line — but every file here has one |
| a pairing I cannot establish | nothing fails; it is silently wrong | do not write it — the ticket permits a different soup, and the list is longer than the target |
| the aisle test goes red | `shopping.test.ts` ratio assertion | expected; hand the list to T-003-06 |

## What is explicitly out of scope

- Filling `counters.json` sections (T-003-06).
- Adding aisle patterns (T-003-06).
- Renaming the gap note's `## What is already here` heading (T-003-06).
- Rewriting `congee`, `egg-drop-soup`, or anything else already here (forbidden by criterion).
- Backfilling `slack` on existing recipes (T-003-07).
