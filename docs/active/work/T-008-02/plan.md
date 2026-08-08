# T-008-02 — Plan

Nine steps, three commits. Every step names what proves it. Nothing in this ticket is code, so
there are no unit tests to write; the verification is the collection's own checkers plus two
round-trip checks that are specific to this change and are run by hand.

---

## Baseline, before anything is edited

Recorded so that "unchanged" at the end means something.

```
node scripts/check-recipes.mjs      -> expect: ok, 664 files
node scripts/parse-recipes.mjs      -> expect: 664 recipes, 27 categories, 904 counter assignments
node scripts/menu-sections.mjs      -> expect: 21 counters, One Pot the only one with drift
```

`node` is not on the default PATH in this environment; every command below is run with
`PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` prefixed. That is a fact about the shell, not
about the project, and nothing in the repository is changed for it.

---

## Step 1 — Append the counter to `src/data/counters.json`

Insert the twenty-second entry after Cha Chaan Teng's closing brace, per `structure.md` §1.

**Verify**

```
node -e "JSON.parse(require('fs').readFileSync('src/data/counters.json','utf8'))"
node scripts/parse-recipes.mjs
```

Expect: the file parses; `parse-recipes` still reports **664 recipes, 904 counter assignments, 0
orphans, 0 counters inferred from category** — the new counter changes none of those, because no
recipe names it and it has no `categories` fallback. If the assignment count moves, the fallback
leaked in and the entry is wrong.

**Also verify the note passes its own gate.** `parse-recipes.mjs:130` throws above 120 characters,
so a silent pass here is the proof. Count it explicitly anyway:

```
node -e "const c=require('./src/data/counters.json');const s=c.counters.at(-1).sections[0];console.log(s.notes[0].note.length, s.notes[0].note)"
```

## Step 2 — Write `docs/gaps/air-fryer-and-pot.md`

The whole page, per `structure.md` §3. The numbers in *The gate, measured* are pasted from the
measurement in step 7 and not retyped.

**Verify**: the checks in step 5. Nothing about this file is machine-read except the
`## What it has` block.

## Step 3 — Commit one

`counters.json` and the gap page go together, because `menu-sections.mjs` checks each against the
other and either alone is a reported problem.

```
lisa commit-ticket --ticket-id T-008-02 \
  --message "Open The Air Fryer & the Pot and write its work list" \
  --include src/data/counters.json \
  --include docs/gaps/air-fryer-and-pot.md
```

## Step 4 — Add the row and the entry to `docs/knowledge/counters.md`

Per `structure.md` §2. Row first, entry second, `## Sources` untouched.

**Verify by reading**, since nothing parses this file: the anchor `#the-air-fryer--the-pot` matches
the heading `## The Air Fryer & the Pot` under GitHub's slugging (lowercase, drop `&`, spaces to
hyphens, so the two spaces around the ampersand collapse to a double hyphen) — the same shape as
the existing `[Phở & Bánh Mì](#pho--banh-mi)` row.

## Step 5 — Round-trip the machine-read block

```
node scripts/menu-sections.mjs
```

**Expect exactly**, and this is the assertion:

- a line `ok   The Air Fryer & the Pot: 0 sections, 0/0 placed`
- **no** `unparsed:` line under it
- **no** `unplaced ->` or `listed but not shelved here ->` line under it
- the last line still names only the pre-existing drift (One Pot), and the count of counters
  needing a look has **not increased** from the baseline

If an `unparsed:` line appears, a bold lead-in in the block has trailing text that is not a slug and
the block is written wrong.

**Do not run `--write`.** It would replace all five titles with `[]` and drop twelve `notes` blocks.

## Step 6 — The throwaway `.cook` probe

Write `recipes/fried-and-crispy/zz-air-fryer-probe.cook` with `>> counters: The Air Fryer & the
Pot`, `>> dish: karaage`, `>> kit: Air Fryer` and a `>> washing-up:` line of two things, obeying
`README.md`'s conventions (5–16 ingredient rows, 3–6 operations, every timer named).

```
node scripts/check-recipes.mjs      -> expect ok, 665 files
node scripts/parse-recipes.mjs      -> expect 665 recipes, 905 assignments, karaage now a 2-file dish group
npx vitest run src/lib/collection.test.ts   -> expect green (proves the counter name is accepted)
rm recipes/fried-and-crispy/zz-air-fryer-probe.cook
node scripts/parse-recipes.mjs      -> expect 664 recipes, 904 assignments again
```

Both transcripts are pasted into `progress.md`. The file is **never** passed to
`lisa commit-ticket` and the working tree is checked clean of it before Review.

**The failure this step is really testing** is `parse-recipes.mjs:198`: two files sharing a `dish`
with neither declaring `kit` throws. `karaage` declares no kit, the probe does, so the group is
legal — and if the ticket had the rule backwards, this is where it would blow up. That is exactly
the build error §4 of the ticket says the writer will hit blind.

## Step 7 — Re-run the measurement and diff it against the page

The 25-row table in the gap page must be reproducible. Re-run the script below and diff its output
against the committed table.

```js
// scratch/table.mjs — run from the repository root
import fs from 'node:fs';
const { buildSchedule } = await import('./src/lib/schedule.ts');
const recipes = JSON.parse(fs.readFileSync('src/generated/recipes.json', 'utf8'));
const ip = recipes.filter((r) => r.counters.includes('Instant Pot'));
const rows = ip.map((r) => {
  const s = buildSchedule(r);
  return { slug: r.slug, time: r.metadata.time, author: s.authorMinutes,
           elapsed: Math.round(s.totalMinutes), untimed: s.untimedCount,
           wash: r.washingUp ? r.washingUp.count : null };
}).sort((a, b) => a.elapsed - b.elapsed);
console.log(rows.filter(r => r.elapsed <= 45).length, 'clear bar 3 by elapsed');
console.log(rows.filter(r => r.author <= 45).length, 'clear bar 3 by >> time:');
```

**Expect `0` and `0`.** If either is non-zero the page is wrong and the shelf's central finding
changes.

Bar 2's four failures are read off step prose rather than off `cookware`, per `research.md` §3, so
they are re-read by hand rather than scripted — `docs/gaps/one-pot.md` is the precedent for not
trusting that line.

## Step 8 — Commit two

```
lisa commit-ticket --ticket-id T-008-02 \
  --message "Write the gate into the counters reference" \
  --include docs/knowledge/counters.md
```

## Step 9 — Whole-collection verification, unchanged

```
node scripts/check-recipes.mjs      -> ok, 664 files, byte-identical to the baseline
node scripts/parse-recipes.mjs      -> 664 recipes, 904 assignments, identical to the baseline
npx vitest run                      -> green, same file and test counts as the baseline
git status --short                  -> no ticket-owned file staged, modified or untracked
```

`astro build` is **not** run as a gate. It builds 688 pages and takes minutes, this change adds no
page (the counter is empty, so `getStaticPaths` skips it), and `check` + `recipes` + `vitest` cover
everything that could break. If time allows it is run once as belt and braces and the result
recorded either way.

---

## Testing strategy, stated plainly

**Nothing here has a unit test to write, and that is the honest answer rather than a gap.** The
three changed files are one JSON entry and two markdown documents. The mechanisms they touch are
already covered:

| Risk | Covered by |
| --- | --- |
| the JSON does not parse | `parse-recipes.mjs`, step 1 |
| the note is too long / malformed | `parse-recipes.mjs:118-136`, step 1 |
| a recipe names a counter that does not exist | `src/lib/collection.test.ts:29`, step 6 |
| `kit: Air Fryer` breaks the dish-group rule | `parse-recipes.mjs:198`, step 6 |
| the `## What it has` block does not round-trip | `menu-sections.mjs`, step 5 |
| the collection regressed | `check-recipes.mjs` + `vitest`, step 9 |

The one risk with **no** automated cover is the one that matters most and cannot be tested: **the
numbers in the gap page could be wrong.** Step 7 is the answer — the measurement is a script, it is
printed in the artifact, and anyone can re-run it. That is weaker than a test and it is said so in
`review.md` rather than dressed up.

## Rollback

Each commit is one or two files with no dependants. Reverting commit one removes the counter and
its page; nothing references either. Reverting commit two removes a table row and an entry from a
reference document. No recipe, script, test or page depends on any of it until T-008-05 shelves
something.
