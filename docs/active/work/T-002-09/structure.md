# T-002-09 — Structure

File-level blueprint. Eight files change; none of them is code.

## Files modified

### Recipes — four one-line edits (`recipes/stir-fries/`)

| File | Change |
| --- | --- |
| `recipes/stir-fries/general-tsos-chicken.cook` | `>> counters: Takeout Counter, One Pot` → `>> counters: Takeout Counter` |
| `recipes/stir-fries/orange-chicken.cook` | same |
| `recipes/stir-fries/sesame-chicken.cook` | same |
| `recipes/stir-fries/sweet-and-sour-pork.cook` | same |

Nothing else in these files moves — not the tree, not a timer, not a tag, not an `aka`. Each
file keeps its `deep-fry` tag and its Takeout Counter home. The edit reverts exactly the four
lines `abba20f` added.

**Ownership.** Written by T-001-x (Takeout Counter), amended by T-002-08, both complete. No live
ticket claims `recipes/stir-fries/`.

**Consequence in the build.** `parse-recipes.mjs` re-emits each recipe with one fewer counter;
`counter assignments` drops 892 → 888. `menuFor('One Pot')` intersects the section list in
`counters.json` with the recipes that name the counter, so all four fall out of *Skillet
dinners* — 16 items → 12 — with no edit to `counters.json`. One Pot's page count goes 72 → 68.
Takeout Counter is unchanged at 20. No recipe is orphaned: every one of the four still names
Takeout Counter, so `collection.test.ts`'s "leaves no recipe without a counter" holds.

### Gap notes — three rewrites (`docs/gaps/`)

Each of these files has a fixed skeleton the tooling and the other eighteen notes share, and it
is preserved:

```
# <Counter> — what is missing
<lede: count, who wrote what, what the counter is>
---
## What it has            <- machine-read by scripts/menu-sections.mjs
**Section title.** slug · slug · slug
---
## What it is missing     <- ranked, most conspicuous absence first
## Components it would need
## What it could not stock
```

`menu-sections.mjs` parses only the `## What it has` block, splits sections on a line starting
`**`, cuts a title at a ` — ` aside, and splits items on `·`. So: **keep the bold-lead-in shape,
keep the middot separator, keep titles free of em-dashes.** Section titles must stay
byte-identical to the ones already in `counters.json`, or the next `--write` run would rename
live menu headings.

#### `docs/gaps/one-pot.md`

| Block | Change |
| --- | --- |
| Lede | 72 → **68**; "T-002-08 shelved fifty-eight" → **fifty-four**; add one sentence on what this pass took off and why. |
| *What it has* → **Skillet dinners** | Remove `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork`. 16 items → 12. Other three sections untouched. |
| *What it is missing* | Unchanged — the six ranked absences are still absent. |
| *Components it would need* | Unchanged. |
| *What it could not stock* | Add a new bullet: **the deep-fry case**, naming the four with the reason (4 cups of oil, a dredging bowl, a rack, a glaze bowl). |
| *The fifty-seven that came off* | Retitle to **sixty-one**, add the four to a new group, and note the `carnitas` / `chile-verde` broiler argument left open. |
| End | One line recording that `counters.json` still lists the four under *Skillet dinners* inertly, for T-003-07. |

#### `docs/gaps/instant-pot.md`

| Block | Change |
| --- | --- |
| *What it is missing*, opening sentence | "Twenty-five of the thirty-one ranks below are written" → **24 of 31 ranks, plus `gigantes-plaki` from the lower list**, keeping the list of seven still out as-is. |
| *Also worth a variant, lower down* | Remove `gigantes-plaki` (written). Correct the "58 existing dishes" tally that follows it. |
| New section, after *What it is missing* | **What the clock now reads** — the pressure evidence measured across all 25 variants, and the untimed-plain-sibling asymmetry. |
| *What it has*, *Components*, *Could not stock* | Unchanged. |

#### `docs/gaps/bowl-shop.md`

| Block | Change |
| --- | --- |
| Lede | Verified against the data (103 = 12 + 16 + 36 + 7 + 24 + 8; 36 written by T-002-05/06/07, 67 shelved). No number changes. |
| *What it has* | Unchanged — nothing on this menu wandered in. |
| *What it is missing* | Unchanged — all seven still absent. |
| New section, before *What it could not stock* | **What reading the whole shelf found** — pairings all resolve, pairing density is at the collection average not above it, and the generic `aka` values are a search item. |

### `docs/gaps/README.md` — one paragraph

Only the `## Build state` paragraph, which currently claims 514 recipes and 666 tests. Rewritten
with the measured numbers and one line saying the fifteen-row tally is deferred to T-003-07,
which reads the whole board after the S-003 shelves land. **The tally table, the five gaps, and
every other section are untouched.**

## Files deliberately not touched

| Path | Why |
| --- | --- |
| `src/data/counters.json` | **Owned by T-003-06, live.** Not needed: `menuFor()` intersects, so the menu is correct without it. |
| `src/data/aisles.json` | Owned by T-003-06. |
| `src/lib/time.ts` | Reads all four pressure timer names correctly, by name. Nothing to fix. |
| `src/lib/schedule.ts`, `collection.test.ts`, any `src/` file | No defect found. |
| `recipes/eggs/tamagoyaki.cook` and 17 others with a repeated `aka` | Japanese home wing, held by T-003-06. Cosmetic. |
| `recipes/stews-and-braises/carnitas.cook`, `chile-verde.cook` | Argued, not resolved; recorded in the gap note. |

**Nothing outside `recipes/` and `docs/` changes.** That is the answer to the acceptance
criterion asking this artifact to name each such file and say why — the list is empty.

## Ordering

1. The four `.cook` edits first, so the parse and the menu can be re-measured before the notes
   claim a number.
2. `npm run recipes` + `node scripts/menu-sections.mjs` (dry run, writes nothing) to confirm the
   One Pot menu is 68 in four sections and that the gap note still reconciles.
3. The three gap notes, written against the measured output rather than the predicted one.
4. `docs/gaps/README.md`.
5. `npm run verify` in full.

Steps 1 and 3 are separate commits: a source change and a documentation change are different
units, and the first is the one a reviewer needs to see on its own.

## Interfaces relied on, and what would break them

- **`menuFor()` intersects.** If it ever stopped filtering section items by membership, the four
  removed dishes would reappear on One Pot as broken entries. `src/lib/counters.ts` builds
  `bySlug` from `mine`, so this holds today.
- **`menu-sections.mjs` reports rather than guesses.** Running it dry after the edit is the check
  that the gap note and the shelf agree; it prints `listed but not shelved here` for any
  disagreement.
- **`collection.test.ts` is the regression net** for every invariant this ticket verified by
  script. The audit scripts themselves are one-off and live in the scratchpad, not the repo.
