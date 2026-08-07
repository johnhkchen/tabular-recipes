# T-007-02 — Structure

The blueprint: every file created, modified or deleted, what changes inside it, and the order the
changes have to happen in.

---

## 1. The change set

### Deleted — 16 files, all in `recipes/soups/`

```
apple-pear-pork-bone-soup.cook            lotus-root-dried-octopus-soup.cook
chinese-yam-goji-black-chicken-soup.cook  lotus-seed-lily-bulb-soup.cook
ching-bo-leung-soup.cook                  old-cucumber-rice-bean-soup.cook
corn-carrot-pork-bone-soup.cook           overlord-flower-soup.cook
dried-bok-choy-pork-lung-soup.cook        peanut-black-eyed-pea-chicken-feet-soup.cook
green-papaya-peanut-trotter-soup.cook     sha-shen-yu-zhu-soup.cook
green-radish-carrot-pork-bone-soup.cook   watercress-honey-date-soup.cook
hairy-gourd-dried-scallop-soup.cook       winter-melon-jobs-tears-soup.cook
```

`recipes/soups/` goes from 66 files to 50. No other `.cook` file is deleted anywhere.

### Modified — 8 `.cook` files, one line each

Every one is line 4 of its file, `>> counters:`. Nothing else in any of the eight moves — not the
`>> aka:` lines carrying `滾湯, gwan tong`, not the `>> slack:` lines, not a step.

| File | From | To |
| --- | --- | --- |
| `recipes/soups/tomato-potato-beef-soup.cook` | `The Soup Pot` | `One Pot` |
| `recipes/soups/seaweed-egg-drop-soup.cook` | `The Soup Pot` | `One Pot` |
| `recipes/soups/mustard-greens-tofu-soup.cook` | `The Soup Pot` | `One Pot` |
| `recipes/soups/crucian-carp-tofu-soup.cook` | `The Soup Pot` | `One Pot` |
| `recipes/soups/century-egg-amaranth-soup.cook` | `The Soup Pot` | `One Pot` |
| `recipes/soups/egg-drop-soup.cook` | `Takeout Counter, The Soup Pot` | `Takeout Counter` |
| `recipes/soups/congee.cook` | `Dim Sum Counter, One Pot, The Soup Pot` | `Dim Sum Counter, One Pot` |
| `recipes/soups/congee-instant-pot.cook` | `Instant Pot, The Soup Pot` | `Instant Pot` |

The three at the bottom are pure removals: the surviving names keep their existing order, so the
diff on those three lines shows only the deletion of `, The Soup Pot` / `The Soup Pot, `.

### Modified — `src/data/counters.json`

Two edits, in this order:

1. **Add one section to the `One Pot` entry**, appended after `Soups that are the whole meal` as
   the fourth-and-last member of its `sections` array:

   ```json
   {
     "title": "Quick soups that go with dinner",
     "items": [
       "tomato-potato-beef-soup",
       "seaweed-egg-drop-soup",
       "mustard-greens-tofu-soup",
       "crucian-carp-tofu-soup",
       "century-egg-amaranth-soup"
     ]
   }
   ```

   No `notes` key. Item order is the order the retired counter's 滾湯 section used.

2. **Delete the whole `The Soup Pot` object** — the array element opening `"name": "The Soup Pot"`
   and closing before `"name": "Japanese Home Cooking"`. All four of its sections and all fourteen
   of its notes go with it. Nothing from it is relocated.

The file must stay 2-space indented with a trailing newline (`JSON.stringify(file, null, 2)` + `\n`
is what `menu-sections.mjs --write` produces, and the file matches that today). Counter count goes
22 → 21. The `Cha Chaan Teng` entry, appended by T-007-01 after `slow-cooker`, is not touched — it
sits after the deleted block and does not share a line with it.

### Rewritten — `docs/gaps/soup-pot.md`

Same path, new content. Section map, old → new:

| Old | New |
| --- | --- |
| `# The Soup Pot — what is missing` + opening | `# The Soup Pot — a counter that came down` + standing note with the date |
| — | `## Why it came down` (the five reasons, new) |
| — | `## What happened to the twenty-four` (new; the record) |
| — | `## What would have to be true for this to work` (new; the ticket's one required addition) |
| `## What it has` | **dropped** |
| `## What each thing is for` (lines 69-143) | `## Preserved research` — moved across unchanged |
| `## What it is missing` (lines 146-292) | **dropped** — the ranked 18 + 10 + 4 |
| `## What reading the whole collection found` | **dropped** |
| `## Components it would need` | **dropped** |
| `## What it could not stock` | `## What a table could not hold` — kept |
| `## Where this came from` | kept, all eight sources |

The dried-goods table (19 rows), the bodies, the season and the four rules of the pot cross over
character-for-character. That is checkable and Review checks it.

Dropping `## What it has` is safe only *after* the counter leaves `counters.json`:
`scripts/menu-sections.mjs:93-107` iterates `file.counters` and opens `docs/gaps/<slug>.md` per
counter, so a gap page with no counter is never read, but a counter with no `## What it has` block
is reported as a problem. Hence the ordering in §2.

### Modified — `docs/gaps/README.md`

Two localised edits, no table rows touched:

1. A **`### Retired counters`** note under **Build state**: The Soup Pot came down 2026-08-07 under
   S-007/T-007-02, sixteen files deleted and eight rehomed, `soup-pot.md` kept as a record rather
   than a counter page — which keeps the file's own *"One page per counter"* opening true.
2. The **Build state** paragraph's numbers refreshed from this ticket's verify run, stamped with
   what they were measured after and pointing at T-007-05 for the twenty-counter restatement.

### Not modified, and why

| File | Why not |
| --- | --- |
| `docs/knowledge/counters.md` | The ticket's condition does not fire — it never names the counter (research §1). |
| `docs/gaps/one-pot.md` | Outside the permitted list. Its drift from `counters.json` predates this ticket by four slugs; widening it is a Review finding. |
| `docs/gaps/voice.md` | Outside the permitted list. Its three citations are records of past measurements. |
| `scripts/measure-pages.mjs` | Outside the permitted list; not in `npm run verify` by its own design. |
| `src/data/aisles.json` | T-007-05's, and its ticket says to leave the dead dried-goods patterns alone. |
| `src/generated/recipes.json` | Gitignored, rebuilt by `npm run recipes`. Never committed. |
| Any other `.cook` file | Out of scope. |

---

## 2. Ordering, where it matters

Three orderings are load-bearing; the rest is free.

1. **The One Pot section is added before the `>> counters:` lines change, or at the same time.**
   Not strictly enforced — `parse-recipes.mjs` only rejects a *note* pointing at an unshelved slug,
   not a bare item — but a section listing five slugs that name no counter renders empty and reads
   as a mistake in any intermediate state.

2. **The eight `>> counters:` lines change before `The Soup Pot` leaves `counters.json`.** Reversed,
   `check-recipes.mjs:26-31` and `parse-recipes.mjs:60-68` both throw *unknown counter "The Soup
   Pot"* on eight files. This is the one ordering that turns into a hard failure.

3. **`docs/gaps/soup-pot.md` loses its `## What it has` block only after the counter is out of
   `counters.json`.** Otherwise `menu-sections.mjs` reports the counter as *"gap note has no 'What
   it has' block"*.

The sixteen deletions are order-free with respect to all of the above — nothing points at them.

## 3. Commit units

Four, each independently checkable, all through `lisa commit-ticket --ticket-id T-007-02` with
exact `--include` paths.

| # | What | Paths | Green when |
| --- | --- | --- | --- |
| 1 | Rehome the eight | the 8 `.cook` files + `src/data/counters.json` | `node scripts/check-recipes.mjs recipes/soups/*.cook` clean; the 5 resolve to One Pot |
| 2 | Delete the sixteen | the 16 deleted paths | `npm run recipes` parses 16 fewer files |
| 3 | Remove the counter | `src/data/counters.json` | `soup-pot` absent; 21 counters; `/menu/soup-pot` not in the build |
| 4 | The record | `docs/gaps/soup-pot.md`, `docs/gaps/README.md` | glossary and four rules byte-identical; five reasons and date present |

Commit 1 carries `counters.json` for the One Pot section; commit 3 carries it again for the
deletion. The same file in two commits is fine — they touch disjoint regions and `commit-ticket`
takes exact paths.

Between 1 and 3 the tree is momentarily inconsistent in one direction only: after commit 2 the Soup
Pot entry lists sixteen slugs that are no longer recipes. That is not an error — `menuFor()` maps
slugs through `bySlug.get()` and filters (`src/lib/counters.ts:78-80`), and `parse-recipes.mjs`
only validates `notes`, whose `of:` targets are checked against `section.items` and then against
`shelvedAt`. A note on a deleted slug **does** throw (`parse-recipes.mjs:146-148`, *"which is not a
recipe here"*), and eight of the fourteen Soup Pot notes carry `of:` targets among the sixteen. So
**commits 2 and 3 must land in one working-tree state before `npm run recipes` is run again** —
either 3 before 2, or both before the next full build. Taking 3 before 2 is simpler and is what the
plan does.

---

## 4. What the build should read afterwards

Measured against the baseline in research §3, and stated as deltas because T-007-03 and T-007-04 are
writing `.cook` files concurrently.

| Number | Before | Expected change |
| --- | --: | --- |
| files that draw a table | 658 | −16 |
| recipes parsed | 658 | −16 |
| counters named | 658 | −16, and **`0 inferred` unchanged** |
| pages built | 682 | −17 (sixteen recipe pages, plus `/menu/soup-pot`) |
| counters in `counters.json` | 22 | 21 |
| counter assignments | 901 | −24 for The Soup Pot, +5 for One Pot = −19 |
| One Pot items | 68 | 73 |
| Takeout Counter / Dim Sum / Instant Pot items | 20 / 30 / 25 | unchanged |
| test files / tests | 9 / 833 | unchanged |

Any deviation caused by a `.cook` file this ticket does not own belongs to T-007-03 or T-007-04 and
is reported, not fixed.

---

## 5. Verification surface

- **Zero orphans** — `parse-recipes.mjs:79-87` throws on a homeless recipe;
  `src/lib/collection.test.ts:26-29` asserts it from the built JSON. Both run inside `npm run
  verify`. Plus an explicit per-slug print of the eight survivors' resolved counters for the work
  artifact, which is what the criterion actually asks for.
- **Only `>> counters:` changed in the eight** — `git diff -- <the 8 paths>` filtered to changed
  lines; the criterion asks to show it and Review shows it.
- **No `.cook` anywhere still names The Soup Pot** — `grep -rn "The Soup Pot" recipes/`, run
  *before* the build so it is a check rather than a crash.
- **`/menu/soup-pot` no longer builds** — absence of `dist/menu/soup-pot/` after `astro build`.
- **The glossary and four rules survived intact** — diff the kept block of the old file against the
  new one; expect no content lines changed.
- **The permitted-file boundary** — `git status --porcelain` at the end must show nothing outside
  the permitted list and nothing left staged, modified or untracked among ticket-owned paths.
