# T-008-05 — Plan

Eleven steps, four commits. Every step names what proves it. Nothing here is application code, so
there are no unit tests to write; the verification is the collection's own checkers plus three
round-trip checks specific to this change.

`node` is on PATH in this environment (`v24.18.1`). Every command below runs from the repository
root.

---

## Baseline, recorded before anything is edited

So that "unchanged" at the end means something.

```
npm run recipes                 -> 685 recipes, 27 categories, 0 inferred, timers 661,
                                   pairings 770, washing-up 177
node scripts/menu-sections.mjs  -> 2 counter(s) need a look:
                                   One Pot 68/73 placed · Air Fryer 0 sections, 0/21 placed
npx vitest run src/lib/shopping.test.ts -> 14 passed
```

Pasted into `progress.md` verbatim.

---

## Step 1 — Take the aisle snapshot, before

```
AISLE_SNAPSHOT=$PWD/.lisa/attempts/T-008-05/1/work/aisle-before.tsv \
  npx vitest run --config .lisa/attempts/T-008-05/1/work/aisle-probe.config.mts
```

**Expect** 1086 lines. This is the evidence for step 8 and it is worthless if taken afterwards.

**Also confirm the probe is invisible to the suite:**

```
npx vitest list | grep -c aisle-diff    -> 0
```

If that is not 0, `npm run verify` would count a test this ticket invented, which is the tripwire
T-008-03 §5.4 warned about.

## Step 2 — Run the gate and pin its output

```
node .lisa/attempts/T-008-05/1/work/gate.mjs > .lisa/attempts/T-008-05/1/work/gate-output.md
```

**Expect**, and these are the assertions the whole ticket rests on:

- `Clearing all three: 21.`
- sole cause: `bar 1 only 0 · bar 2 only 22 · bar 3 only 13`
- `The Air Fryer & the Pot | 21 | 21 | 21 | 21 | 21`
- the shelf table has 21 rows, every row's count is 1 or 2, every `>> time:` ≤ 45, every elapsed
  ≤ 45, **no row with an empty washing-up cell**

If any of those moves, the gap page's central number is wrong and nothing downstream should be
written.

## Step 3 — Write `docs/gaps/air-fryer-and-pot.md`

Per `structure.md` §2. The numbers in *The gate, measured* and the whole of *The shelf, item by
item* are **pasted from step 2's file, not retyped**.

**Verify the machine-read block round-trips before touching the JSON:**

```
node scripts/menu-sections.mjs
```

**Expect exactly** `ok   The Air Fryer & the Pot: 4 sections, 21/21 placed` followed by the four
titles and their counts (8, 9, 3, 1), with **no** `unplaced ->`, **no** `listed but not shelved
here ->` and **no** `unparsed:` line under it. The counters-needing-a-look total must **drop from 2
to 1** — One Pot's pre-existing drift, which is not this ticket's.

An `unparsed:` line means a bold lead-in in the block has trailing prose that is not a slug.

## Step 4 — Write `src/data/counters.json`

Per `structure.md` §3. By hand, keeping the `notes` block.

```
node -e "JSON.parse(require('fs').readFileSync('src/data/counters.json','utf8'))"
npm run recipes
```

**Expect** the file parses and `parse-recipes` still reports **685 recipes, 0 inferred from
category** — sections do not create membership, so any movement means the wrong thing was edited.

## Step 5 — Prove the round-trip destructively, then put it back

The criterion is that `menu-sections.mjs` *reproduces* `counters.json` from the gap page. The dry
run in step 3 says the page parses; this says the two agree.

```
cp src/data/counters.json .lisa/attempts/T-008-05/1/work/counters.hand.json
node scripts/menu-sections.mjs --write
diff .lisa/attempts/T-008-05/1/work/counters.hand.json src/data/counters.json \
  > .lisa/attempts/T-008-05/1/work/roundtrip.diff
cp .lisa/attempts/T-008-05/1/work/counters.hand.json src/data/counters.json
```

**Expect** the diff to contain **only**:

- the twelve hand-written `notes` blocks `--write` drops, one of them this counter's
- One Pot gaining an `Also` section holding its five S-007 soups

**and nothing at all under `The Air Fryer & the Pot`'s four sections.** Any line there is a
disagreement between the page and the JSON and is a failure.

The restore is `cp`, not `git checkout`: this file is ticket-owned and mid-flight, and the ordinary
index is not used for ticket work.

## Step 6 — Commit one

The page and the JSON go together, because `menu-sections.mjs` checks each against the other and
either alone is a reported problem. This is T-008-02's precedent.

```
lisa commit-ticket --ticket-id T-008-05 \
  --message "Shelve the twenty-one that cleared the gate, and say it is twenty-one" \
  --include docs/gaps/air-fryer-and-pot.md \
  --include src/data/counters.json
```

## Step 7 — Build the shelf and read it

```
npm run build
```

**Expect** `/menu/air-fryer-and-pot` in the built output with **four** `<section class="menu-section">`
and **no section titled `Also`**. Checked against `dist/`, not asserted:

```
grep -o '<h2>[^<]*</h2>' dist/menu/air-fryer-and-pot/index.html
grep -c 'data-slug' dist/menu/air-fryer-and-pot/index.html    -> 21
grep -c '>Also<' dist/menu/air-fryer-and-pot/index.html       -> 0
node scripts/check-menus.mjs
```

**And the index:** the front page prints **22** counter cards. The ticket says 23; it is 22, and
that is a finding rather than a fault — the Soup Pot came down under S-007.

```
grep -c 'class="counter clay-surface"' dist/index.html        -> 22
```

## Step 8 — `src/data/aisles.json`, and the diff that proves it

Add the three patterns per `structure.md` §4, then:

```
AISLE_SNAPSHOT=$PWD/.lisa/attempts/T-008-05/1/work/aisle-after.tsv \
  npx vitest run --config .lisa/attempts/T-008-05/1/work/aisle-probe.config.mts
diff .lisa/attempts/T-008-05/1/work/aisle-before.tsv \
     .lisa/attempts/T-008-05/1/work/aisle-after.tsv \
  > .lisa/attempts/T-008-05/1/work/aisles.diff
```

**Expect exactly three changed lines and no others:**

```
other      -> freezer   frozen chips
bakery     -> freezer   frozen spring rolls
fishmonger -> freezer   frozen raw prawns
```

A fourth line is a pattern stealing a product from a more specific one elsewhere and the pattern
comes back out.

```
npx vitest run src/lib/shopping.test.ts
```

**Expect** 14 passed, and the console line to drop from `5/1086 ingredients have no aisle` to
`4/1086` — `leftover pizza`, `flat skewers`, `oak or hickory wood`, `metal skewers`. Those four are
deliberate: three are equipment and one is not a thing any shop sells.

## Step 9 — Commit two

```
lisa commit-ticket --ticket-id T-008-05 \
  --message "Put the frozen things where the shop keeps them" \
  --include src/data/aisles.json
```

## Step 10 — The three pages that pay the property forward

`docs/gaps/one-pot.md`, `docs/gaps/instant-pot.md`, `docs/gaps/README.md`, per `structure.md`
§§5–7. `tally.mjs` produces the README's Recipes and Only-here columns:

```
node .lisa/attempts/T-008-05/1/work/tally.mjs
```

**Verify** the two machine-read blocks were not disturbed:

```
node scripts/menu-sections.mjs
```

**Expect** the same output as step 3 — One Pot still `68/73 placed`, Instant Pot still
`25/25 placed`, 1 counter needing a look. Editing prose in a gap page must not move its
`## What it has` block, and this is the check that says it did not.

## Step 11 — Commit three, then verify end to end

```
lisa commit-ticket --ticket-id T-008-05 \
  --message "Pay washing-up forward to the three shelves that promised it" \
  --include docs/gaps/one-pot.md \
  --include docs/gaps/instant-pot.md \
  --include docs/gaps/README.md

npm run verify
git status --porcelain
```

**Expect** `npm run verify` to exit 0 — every file draws a table, every recipe parses, tests green,
every page builds, and `check-menus` clean — and `git status` to show no ticket-owned file staged,
modified or untracked.

The work artifacts commit as commit four, which Lisa's completion handles.

---

## Testing strategy, stated plainly

**No unit test is written and that is the honest answer rather than a gap.** The six changed files
are one JSON section list, three JSON patterns and four markdown documents. Every mechanism they
touch is already covered:

| Risk | Covered by | Step |
| --- | --- | --: |
| the JSON does not parse | `parse-recipes.mjs` | 4 |
| a section lists a slug that is not a recipe | `menu-sections.mjs` reports it; `menuFor()` **throws** | 3, 7 |
| a section lists a recipe that does not name this counter | `menuFor()` throws with the slug named | 7 |
| the page and the JSON disagree | the destructive round-trip | 5 |
| an item lands in *Also here* | `grep -c '>Also<' … -> 0` on the built page | 7 |
| a new aisle pattern steals a product | the 1086-line before/after diff | 8 |
| coverage regresses | `shopping.test.ts` at its 2% gate | 8 |
| a prose edit disturbs a machine-read block | `menu-sections.mjs`, re-run | 10 |
| the collection regressed | `npm run verify` | 11 |

**The one risk with no automated cover is the one that matters most: the numbers in the gap page
could be wrong.** Step 2 is the answer — the gate is a script, its whole output is pasted into the
artifact, and anyone can re-run it. That is weaker than a test and it is said so here rather than
dressed up. The second-order version of the same risk is bar 2's lexicon, which is why every
verdict it and the authored reading disagree on is printed by name rather than summed.

**`npm run verify:mobile` is not run.** It drives a browser, is not part of `npm run verify`, and
this ticket adds no markup. It does add a menu page with 21 items where there were none, so the
first person to run it is measuring something new — recorded in `review.md`.

## Rollback

Each commit is one or two files with no dependants.

- Reverting commit one empties the counter's sections; `/menu/air-fryer-and-pot` stops building
  (`menu.count > 0` still holds, so it builds by category fallback — worth knowing, not worth
  relying on) and nothing else on the site references it.
- Reverting commit two puts three ingredient names back where they were; the coverage test passes
  either way.
- Reverting commit three is three markdown documents, two of which are read only by people and one
  of which has a machine-read block this ticket does not touch.
