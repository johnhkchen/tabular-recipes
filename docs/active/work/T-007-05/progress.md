# T-007-05 — Progress

Six commits, four files, no source code and no `.cook` touched. Every step in `plan.md` ran; two
deviations, both recorded below.

---

## Done

| # | Step | Commit | File |
| --- | --- | --- | --- |
| 1 | Three aisle patterns | `062e89b` | `src/data/aisles.json` |
| 2 | The `## What it has` block | `8fd1931` | `docs/gaps/cha-chaan-teng.md` |
| 3 | The counter's five sections | `de86f85` | `src/data/counters.json` |
| 4 | Re-rank the rest of the gap note | `e0885ae` | `docs/gaps/cha-chaan-teng.md` |
| 4b | Heading rename (deviation 1) | `4c99920` | `docs/gaps/cha-chaan-teng.md` |
| 6 | Tally, build state, five gaps | `dfa92ff` | `docs/gaps/README.md` |

Step 5 (read the built page) and step 7 (clean up, final verify) produced no commit, by design.

## Step-by-step

**1 — aisles.** `luncheon meat` → `tins`, `satay sauce` and `chili garlic sauce` → `world`. The
coverage report went from 5 unplaced to 3, and the three left are the cookware names already on
record. The whole-collection dump diffed to **exactly three changed lines**, which is the no-theft
evidence the criteria ask for:

```
< chili garlic sauce  produce  garlic          > chili garlic sauce  world  chili garlic sauce
< satay sauce         other    -               > satay sauce         world  satay sauce
< tinned luncheon meat other   -               > tinned luncheon meat tins  luncheon meat
```

**2 — the gap note's shelf.** Five sections, 27 slugs. The dry run reported them and named the five
borrows, as designed.

**3 — the counter.** Hand-edited to match. Round-trip proved on a scratch copy: `menu-sections.mjs
--write` there produced a `cha-chaan-teng` object **identical** to the real one.

**4 — the rest of the note.** `## What it is missing` re-ranked from 24 to 5, with a table of what
closed each rank. `## Components it would need` cut from 7 to 2, with the five that landed inside a
dish recorded in a table so the `- **` bullet count stays comparable across the folder.
`## What this board borrows` gained a **What happened** column and the borrow caution.

**5 — the page, read not predicted.**

```
<h1>Cha Chaan Teng</h1>   class="count">22 recipes
The drinks counter (6) · Toast and the bun case (2) · Macaroni, noodles and things in soup (5)
Rice plates (6) · Sandwiches and buns (3)
```

No `Also` heading. Front page: 21 counter cards, no Soup Pot, Cha Chaan Teng among them.
`dist/menu/` has 21 directories and no `soup-pot`.

**6 — README.** Build state, retired-counters closing paragraph, the 21-row tally, the duplicate
check result, the re-ranked five gaps, two new shelving notes. The fifteen-counter apology is gone.

**7 — clean.** `src/lib/zz-aisle-dump.test.ts` and `src/lib/zz-shelf.test.ts` were scratch probes;
both were deleted and neither reached a commit. `npm run verify` green end to end.

## Deviations from the plan

**1. One extra edit: `## What a table cannot hold` → `## What it could not stock`.** Not planned.
Found while deriving the README's "items a single table cannot express" figure: twenty of the
twenty-one counter pages use `## What it could not stock` and only `cha-chaan-teng.md` used a
different heading, so that counter's eight items were invisible to the same derivation that
produced every other number in the tally. Renamed, and the one in-page anchor that pointed at it
was updated. The folder is now 21/21 on that heading and the tally figure is 150.

**2. Step 4 and step 4b are two commits on the same file, not one.** The rename was found after
step 4 was already committed.

## Not done, and why

- **The five borrowed dishes do not render.** They are listed in `counters.json` and in the gap
  note; `menuFor()` drops them because their `.cook` files do not name this counter. Making them
  appear needs five `>> counters:` lines, which the last acceptance criterion forbids this ticket
  from touching. Argued in `design.md` §1, recorded in the gap note, and the headline of
  `review.md`.
- **One Pot's four ghost slugs and its five-section drift** are left exactly as found.
  `docs/gaps/one-pot.md` is not owned here, and fixing one half of a two-file drift makes it worse.
  Named in the README tally and in `review.md`.
- **`evaporated milk`'s order-dependent aisle** and **`Hong Kong milk tea` resolving to Dairy** are
  recorded as findings rather than changed; both are argued in `design.md` §4.
- **No shelf talk (`notes`) was written** for the new counter. `menu-sections.mjs --write` drops
  notes, and the criteria ask for a block that round-trips.

## Concurrency note

Three other threads committed to this branch while this ticket ran — T-008-01, T-009-01 and a
`schedule.ts` change. `npm run verify` was briefly red partway through on
`src/lib/step-labels.test.ts`, which belongs to T-009-01 and was green again within minutes. It
never touched any file this ticket owns. The test and page counts quoted in the README's Build
state are the ones read at `dfa92ff` and will move under those stories.
