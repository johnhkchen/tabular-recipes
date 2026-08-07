# T-007-02 — Plan

Nine steps, four commits. Each step names what makes it green before the next one starts.

## A correction to Structure §3

Structure said commit 3 (remove the counter) could land before commit 2 (delete the sixteen). It
cannot, and neither can the reverse, because **both orders leave a working tree that fails a build**:

- Delete the files first → the Soup Pot entry still carries eight `of:` notes naming slugs that are
  no longer recipes, and `parse-recipes.mjs:146-148` throws *"has a note on X, which is not a recipe
  here."*
- Remove the counter first → the sixteen files still carry `>> counters: The Soup Pot`, and
  `check-recipes.mjs:26-31` and `parse-recipes.mjs:60-68` both throw *unknown counter*.

The resolution is not an ordering, it is a **grouping**: both edits are made in the working tree,
the tree is verified once, and only then are they committed as two commits. `lisa commit-ticket`
records paths; it does not build. Steps 5-7 below do exactly that. Nothing else in Structure moves.

---

## Step 1 — Pre-flight, before anything is touched

Run and record, because deleting is the irreversible half of this ticket:

```
grep -rn "The Soup Pot" recipes/                       # expect: the 24 files, nothing else
grep -c '' src/data/counters.json                      # expect: 2065
ls recipes/soups/*.cook | wc -l                        # expect: 66
git status --porcelain                                 # expect: clean of ticket-owned paths
```

Then re-run the per-slug inbound-reference sweep from research §4 for all sixteen and confirm the
only hits outside `docs/active/`, `docs/archive/` and the file itself are `docs/gaps/soup-pot.md`,
`src/data/counters.json`, `docs/gaps/voice.md` (3 slugs) and `scripts/measure-pages.mjs` (1 slug).

**Green when:** the sweep matches research §4. A new hit — a `pairs-with` added since — stops the
ticket here rather than after the file is gone.

## Step 2 — Rehome the eight

Eight single-line edits, line 4 of each file, per Structure §1. Exact target strings so no other
line can match.

**Green when:** `grep -n "^>> counters:" ` on the eight prints exactly the eight target values, and
`git diff --stat -- recipes/soups/` shows `8 files changed, 8 insertions(+), 8 deletions(-)`.

## Step 3 — Give One Pot somewhere to put them

Append the `Quick soups that go with dinner` section to the One Pot entry in
`src/data/counters.json`, five items, no `notes` key.

**Green when:** the file still parses as JSON, `One Pot` has 5 sections, and the counter count is
still 22.

## Step 4 — Check and commit the rehoming

```
node scripts/check-recipes.mjs recipes/soups/*.cook
```

This state is internally consistent: The Soup Pot still exists as a counter and the sixteen still
name it, so nothing should fail.

```
lisa commit-ticket --ticket-id T-007-02 --message "Rehome the eight soups that stay" \
  --include recipes/soups/tomato-potato-beef-soup.cook \
  --include recipes/soups/seaweed-egg-drop-soup.cook \
  --include recipes/soups/mustard-greens-tofu-soup.cook \
  --include recipes/soups/crucian-carp-tofu-soup.cook \
  --include recipes/soups/century-egg-amaranth-soup.cook \
  --include recipes/soups/egg-drop-soup.cook \
  --include recipes/soups/congee.cook \
  --include recipes/soups/congee-instant-pot.cook \
  --include src/data/counters.json
```

**Green when:** `check-recipes` reports all 66 soups draw a table, and the commit lands.

## Step 5 — Delete the sixteen

`rm` the sixteen paths in `recipes/soups/`. No `git rm` — the ordinary index is not used for ticket
work; `lisa commit-ticket --include` records the deletion.

**Green when:** `ls recipes/soups/*.cook | wc -l` is 50, and none of the sixteen basenames remain.

## Step 6 — Remove the counter

Delete the `The Soup Pot` array element from `src/data/counters.json` — the object and its four
sections and fourteen notes, whole. Do not run a build between Step 5 and Step 6.

**Green when:** `grep -c "soup-pot\|The Soup Pot" src/data/counters.json` is 0, the file parses, and
it holds 21 counters with `cha-chaan-teng` still last and `one-pot` still carrying 5 sections.

## Step 7 — Verify the whole tree, then commit both

```
grep -rn "The Soup Pot" recipes/          # expect nothing — checked before building, per the criteria
npm run verify
```

Expect, against the research §3 baseline: 642 files draw a table, 642 recipes parsed, `642 named,
0 inferred from category`, 9 test files / 833 tests, 665 pages. Deltas are what is asserted, not
absolutes — T-007-03 and T-007-04 are writing `.cook` files concurrently, so a higher count with a
matching `−16` delta against the files present at Step 1 is still a pass.

Then two commits:

```
lisa commit-ticket --ticket-id T-007-02 --message "Delete the sixteen old-fire soups" \
  --include recipes/soups/apple-pear-pork-bone-soup.cook ... (all sixteen)

lisa commit-ticket --ticket-id T-007-02 --message "Take The Soup Pot off the board" \
  --include src/data/counters.json
```

**Green when:** `npm run verify` exits 0 and `dist/menu/soup-pot/` does not exist.

## Step 8 — The record

Rewrite `docs/gaps/soup-pot.md` per Structure §1, then make the two edits to `docs/gaps/README.md`.

**Green when:**

- The dried-goods table, the bodies, the season, the four rules and the three-genres paragraph are
  **byte-identical** to the old file. Checked by extracting both blocks and `diff`-ing them —
  expected output: nothing.
- The file states the five reasons and the date, has a `what would have to be true` section, and
  contains no ranked list of unwritten soups.
- `node scripts/menu-sections.mjs` reports 21 counters with no reference to a Soup Pot gap note.

```
lisa commit-ticket --ticket-id T-007-02 --message "Leave the Soup Pot's research as a record" \
  --include docs/gaps/soup-pot.md --include docs/gaps/README.md
```

## Step 9 — Evidence for Review

Collect, because the acceptance criteria ask to be *shown* rather than told:

1. **The eight survivors' resolved counters, by name**, read out of `src/generated/recipes.json`
   after the build — the literal answer to *"every one of the eight resolves to at least one
   counter, shown by name."*
2. **A diff limited to the `>> counters:` line** for all eight — `git diff HEAD~n -- <8 paths>`
   filtered to `^[-+]>>`, expected to show only `counters` lines.
3. **Per-counter item counts before and after**, showing every counter unchanged except One Pot
   (+5) and The Soup Pot (gone).
4. **The recipe-count delta**, computed against the Step 1 file list rather than the global count,
   so concurrent tickets cannot muddy it.
5. **`git status --porcelain`**, clean of every ticket-owned path.

---

## Testing strategy

**No new test file is written, and that is a decision rather than an omission.**

Everything this ticket can break is already asserted, and asserted twice — once in the build and
once in the suite:

| Property | Enforced by | Runs in |
| --- | --- | --- |
| No recipe sits at zero counters | `parse-recipes.mjs:79-87` and `collection.test.ts:26-29` | `npm run verify` |
| No recipe names a counter that does not exist | `parse-recipes.mjs:60-68`, `check-recipes.mjs:26-31`, `collection.test.ts:31-34` | `npm run verify` |
| No menu note points at an unshelved or non-existent slug | `parse-recipes.mjs:139-152` | `npm run verify` |
| Every surviving file still draws a table | `check-recipes.mjs` | `npm run verify` |
| Pairings still resolve both ways | `parse-recipes.mjs:160-175`, `collection.test.ts:37-55` | `npm run verify` |

A new test would have to assert something like *"`soup-pot` is not in `counters.json`"*, which is a
snapshot of one decision rather than an invariant, and it would need a new file under `src/lib/` —
outside this ticket's permitted-file list. The right check for *"the shelf did not orphan anyone"*
already exists and already runs.

**What is verified by hand instead**, because no automated check covers it:

- That only the `>> counters:` line moved in the eight. A diff, in Review.
- That the glossary and the four rules crossed over intact. A diff, in Review.
- That `/menu/soup-pot` is gone from the build. An `ls` of `dist/`.

## Rollback

Steps 2-4 and 8 are ordinary edits and revert cleanly. Step 5 is the irreversible one, which is why
the inbound-reference sweep runs twice — once in research and once as Step 1 — and why the sixteen
are deleted only after the eight survivors are already committed at their new counters.
