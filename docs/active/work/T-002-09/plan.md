# T-002-09 — Plan

Five steps, two commits. Every step ends in something runnable.

## Step 1 — take the four fried dishes off One Pot

Edit one line in each of:

- `recipes/stir-fries/general-tsos-chicken.cook`
- `recipes/stir-fries/orange-chicken.cook`
- `recipes/stir-fries/sesame-chicken.cook`
- `recipes/stir-fries/sweet-and-sour-pork.cook`

`>> counters: Takeout Counter, One Pot` → `>> counters: Takeout Counter`

**Verify**

```sh
node scripts/check-recipes.mjs recipes/stir-fries/general-tsos-chicken.cook \
  recipes/stir-fries/orange-chicken.cook recipes/stir-fries/sesame-chicken.cook \
  recipes/stir-fries/sweet-and-sour-pork.cook
npm run recipes
```

Expected: four `ok` lines with unchanged row × col shapes, and a clean parse of 658 recipes.
Counter assignments 892 → 888.

**Commit**

```sh
lisa commit-ticket --ticket-id T-002-09 --message "Send the deep-fried four back to the takeout counter" \
  --include recipes/stir-fries/general-tsos-chicken.cook \
  --include recipes/stir-fries/orange-chicken.cook \
  --include recipes/stir-fries/sesame-chicken.cook \
  --include recipes/stir-fries/sweet-and-sour-pork.cook
```

## Step 2 — re-measure the three menus

Nothing to edit. Run the measurements the gap notes and the review will quote, so no number in
them is predicted rather than observed:

```sh
node scripts/menu-sections.mjs        # dry run — writes nothing
```

**Expected**: One Pot reports 4 sections; `Skillet dinners (12)`; and — until step 3 rewrites the
note — a `listed but not shelved here` line naming the four. After step 3 that line is gone.

Also re-run the audit script over `src/generated/recipes.json` for the counts the review quotes:
per-counter totals, exclusive counts, kit families, pairing edges.

**Verification criteria**

- One Pot: 68 recipes, 4 sections, no *Also*, 14 exclusive.
- The Bowl Shop: 103, 6 sections, no *Also*, 36 exclusive.
- Instant Pot: 25, 5 sections, no *Also*, 25 exclusive.

## Step 3 — the pressure evidence

Nothing to edit. Build the schedule for every `kit: Instant Pot` recipe and its plain sibling and
record, for at least three pairs, the pressure and release minutes with their attention and
confidence. This is the evidence the acceptance criterion asks for, and it is gathered before the
gap note quotes it.

**Verification criterion**: zero tasks anywhere in the 25 Instant Pot schedules whose label
mentions pressure or release and whose attention is `hands-on`.

## Step 4 — rewrite the three gap notes

In order: `one-pot.md`, `instant-pot.md`, `bowl-shop.md`, then the one stale paragraph in
`README.md`.

Constraints that fail the build or the tooling if broken:

- Keep `## What it has` in the `**Section title.** slug · slug` shape.
- Keep section titles byte-identical to `counters.json`, and free of ` — ` asides.
- Every slug named in that block must exist and be shelved at that counter.

**Verify**

```sh
node scripts/menu-sections.mjs
```

Expected: `every counter parsed cleanly.` — in particular no `unplaced`, no `listed but not
shelved here`, and no `unparsed` line for the three counters this ticket touched. That command is
the whole test for these files: it is the same parser that would fold them back into
`counters.json`.

## Step 5 — full verification and commit

```sh
npm run verify
```

All four legs must pass:

| Leg | Expected |
| --- | --- |
| `npm run check` | `all 658 file(s) draw a table.` |
| `npm run recipes` | 658 recipes, no warnings |
| `npx vitest run` | 8 files, 825 tests, green |
| `astro build` | 682 pages |

Then spot-check the built pages that this ticket makes claims about:

- `dist/menu/one-pot/index.html` — 68 items, four sections, none of the four fried dishes.
- `dist/menu/bowl-shop/index.html`, `dist/menu/instant-pot/index.html` — unchanged.
- `dist/beef-stew/index.html` ↔ `dist/beef-stew-instant-pot/index.html`, and the same for
  `carnitas` and `congee` — the variant switch present in both directions.

**Commit**

```sh
lisa commit-ticket --ticket-id T-002-09 --message "Say what the three new shelves are missing now" \
  --include docs/gaps/one-pot.md --include docs/gaps/instant-pot.md \
  --include docs/gaps/bowl-shop.md --include docs/gaps/README.md
```

Then confirm nothing ticket-owned is left staged, modified or untracked:

```sh
git status --porcelain
```

## Testing strategy

**No new unit tests.** The invariants this ticket checked — dish resolution, `aka` collisions,
ingredient overlap, pressure attention — split into two kinds:

- **Properties that hold for every future file**, which are already pinned in
  `src/lib/collection.test.ts` (unique slugs, no homeless recipe, counters resolve, pairings
  resolve / mutual / not self, variants agree on their dish, one plain way per dish, no timer
  claiming four unbroken hands-on hours, every timer readable) and `src/lib/time.test.ts` (the
  pressure vocabulary). Nothing to add: they already cover what this ticket verified.
- **One-off audits over a snapshot** — "no two of these 658 titles are near-duplicates", "these
  100 ingredient-overlap pairs are all deliberate". A test asserting a hand-curated allowlist of
  100 pairs would fail on the next dessert written and teach nobody anything. These live in the
  scratchpad and their results are quoted in `review.md`.

**The regression risk this ticket does create** is the four `counters:` edits, and it is covered:
`check-recipes.mjs` proves the tables still draw, `parse-recipes.mjs` proves the counter names
still resolve, `collection.test.ts` proves nothing was orphaned, and `menu-sections.mjs` proves
the gap note and the menu still agree.

## Deviations to expect

`node scripts/menu-sections.mjs` reports every counter, not only the three. Counters this ticket
does not touch may report their own `unplaced` or `unparsed` lines — those are pre-existing and
out of scope; only the three named counters must come back clean.
