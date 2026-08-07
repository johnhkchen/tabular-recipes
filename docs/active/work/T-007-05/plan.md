# T-007-05 — Plan

Five commits. Each is one file, each is independently verifiable, and the check for each is
written out before it runs.

Node is not on the default `PATH` here: every command below is run with
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"`.

---

## Step 0 — baseline (no commit)

Already taken and held in the scratchpad:

- `before.tsv` — 1074 lines of `name → aisle [pattern]`, produced by `src/lib/zz-aisle-dump.test.ts`,
  which asserts its resolver agrees with `aisleFor()` on every name.
- `base/` — the tree at `096b1d4` rebuilt from source, for the `was` columns.
- `dupes-base.txt`, `dupes-now.txt` — the three T-002-09 passes over both trees.

## Step 1 — `src/data/aisles.json`

Add three patterns (`structure.md` §2).

**Verify.**

```
npx vitest run src/lib/shopping.test.ts --reporter=verbose   # the coverage report
DUMP_OUT=$SP/after.tsv npx vitest run src/lib/zz-aisle-dump.test.ts
diff $SP/before.tsv $SP/after.tsv
```

Pass conditions:

- the coverage report drops from 5 unplaced to 3, and the 3 left are `flat skewers`,
  `metal skewers`, `oak or hickory wood`;
- the diff has **exactly three** changed lines — `tinned luncheon meat` other→tins,
  `satay sauce` other→world, `chili garlic sauce` produce→world — and no line where an
  ingredient moves *away* from a pattern more specific than the one that now wins;
- `aisleFor('condensed milk')` and `aisleFor('evaporated milk')` resolve through different
  patterns; printed with their aisles.

**Commit** — `lisa commit-ticket --ticket-id T-007-05 --include src/data/aisles.json`

## Step 2 — `docs/gaps/cha-chaan-teng.md`, the `## What it has` block

Rewrite the header paragraph and replace the seven empty headings with five populated ones
(`design.md` §3). Leave every other block for step 4 so this step's check is unambiguous.

**Verify.**

```
node scripts/menu-sections.mjs 2>&1 | sed -n '/Cha Chaan Teng/,$p'
```

Pass conditions: five sections with 6 / 4 / 7 / 6 / 4 items, `27/22 placed`, no `unparsed`, no
`unplaced`. The expected warning is `listed but not shelved here -> beef-chow-fun, char-siu,
club-sandwich, egg-custard-tart, pineapple-bun` — the five borrows, and the reason
`review.md` has a section about it.

**Commit** — `--include docs/gaps/cha-chaan-teng.md`

## Step 3 — `src/data/counters.json`

Hand-edit the `cha-chaan-teng` object to exactly what step 2's dry run reported.

**Verify — the round-trip, on a copy.**

```
rm -rf $SP/rt && mkdir $SP/rt
git archive HEAD | tar -x -C $SP/rt          # tracked files at HEAD…
cp src/data/counters.json src/data/aisles.json $SP/rt/src/data/     # …plus this ticket's edits
cp docs/gaps/cha-chaan-teng.md $SP/rt/docs/gaps/
ln -s $PWD/node_modules $SP/rt/node_modules
cd $SP/rt && node scripts/parse-recipes.mjs && node scripts/menu-sections.mjs --write
python3 - <<'PY'   # compare the cha-chaan-teng object only
PY
```

Pass condition: the `cha-chaan-teng` object in the rewritten copy is **identical** to the one in
the real `counters.json`. The comparison is scoped to that counter because `--write` also strips
the eleven `notes` blocks that other counters carry, which is a known property of the script and
not something this ticket may cause in the real file.

Then, in the real tree:

```
npm run recipes && npx vitest run && npm run check
```

Pass conditions: 664 recipes, 0 orphans, 0 inferred, 0 duplicate slugs, no parser warning; all
tests green.

**Commit** — `--include src/data/counters.json`

## Step 4 — `docs/gaps/cha-chaan-teng.md`, the rest of the file

Re-rank `## What it is missing` to the five dishes still absent, re-cut
`## Components it would need`, update the borrows table's verdicts, retire the three cautions at
the end of `## Sources`. `## What a table cannot hold` and every source bullet stay verbatim.

**Verify.**

```
node scripts/menu-sections.mjs 2>&1 | sed -n '/Cha Chaan Teng/,$p'   # unchanged from step 2
```

plus a re-read of the file against `git diff` to confirm nothing under `### The tea` or
`## Sources` moved.

**Commit** — `--include docs/gaps/cha-chaan-teng.md`

## Step 5 — the page, read rather than predicted

```
npm run build
```

Then read `dist/menu/cha-chaan-teng/index.html` for: the five section headings in order, the
recipe count in the header, and the absence of an `Also` heading. Read `dist/index.html` for the
counter cards — count them, confirm no Soup Pot card, confirm a Cha Chaan Teng card.

No commit. Findings go to `review.md`; if a heading is empty or an `Also` appears, step 3 is wrong
and is redone before step 6.

## Step 6 — `docs/gaps/README.md`

Rewrite Build state, the Retired-counters closing paragraph, the tally, the five gaps; delete the
fifteen-counter apology; add this pass's duplicate-check result and the two aisle findings.

The tally numbers come from the two `stats.mjs` runs, which reproduce the existing file's
**Recipes**, **Missing dishes** and **Missing components** columns for all fifteen printed rows —
that agreement is what licenses using the same method for the six new ones.

**Verify.**

```
node scripts/menu-sections.mjs        # README claims the round-trip; re-assert it
npm run verify                        # the numbers Build state quotes
```

**Commit** — `--include docs/gaps/README.md`

## Step 7 — clean up and final verify

1. `rm src/lib/zz-aisle-dump.test.ts` — it must not reach a commit.
2. `npm run verify` end to end, and quote its real output in `review.md`.
3. `git status --porcelain` for the four owned files: nothing staged, modified or untracked.
   `src/components/Timeline.astro` and `src/pages/[slug].astro` stay modified — they were modified
   before this ticket started and are not its business.

---

## Testing strategy

**No test is added, and that is a decision rather than an omission.**

What this ticket produces is data. Three existing layers already assert every property it could
break, and each is run:

| Layer | What it pins |
| --- | --- |
| `src/lib/shopping.test.ts` | every ingredient has an aisle (< 2% "other"); no temperature word eats a product name; the more specific pattern wins across aisles |
| `src/lib/collection.test.ts` | unique slugs, no orphan, counters resolve, pairings mutual and non-dangling |
| `scripts/parse-recipes.mjs` | counters exist, no inferred counter, notes point at shelved slugs |
| `scripts/check-recipes.mjs` | every file still draws a table |
| `scripts/menu-sections.mjs` | the gap note and the menu agree |

The two things this ticket asserts that no test can hold are one-off audits over a snapshot: "no
added pattern stole a product" and "these 148 alias collisions are honest". Both are diffs against
a baseline taken before the change, and a test asserting a hand-curated allowlist would fail on the
next recipe written and teach nobody anything — the same reasoning T-002-09 recorded.

**The gap this leaves, stated plainly:** nothing in the repository fails when `counters.json` lists
a slug the counter does not shelve. One Pot has had four such entries since before this story and
every gate above is green. This ticket adds five more on purpose (`design.md` §1) and cannot close
the gap from inside its own file ownership.

## Rollback

Each step is one file and one commit. Steps 1, 3 and 6 are independently revertible. Step 2 and
step 4 are the same file; reverting step 4 alone means reverting to the step-2 blob, which is a
valid state (the `## What it has` block is what `counters.json` depends on).
