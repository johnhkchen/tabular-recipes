# T-001-01 — Plan

Five files, five commits, one verification pass. Each step is independently checkable and
small enough to commit on its own.

## Testing strategy

There are no unit tests to write. This ticket adds data, and the collection's tests are
generic invariants that already exist:

| Level | What runs | What it proves |
| --- | --- | --- |
| Per file | `node scripts/check-recipes.mjs --labels <path>` | required metadata, counter names resolve, the tree tiles with no holes, ≥3 rows and ≥3 cols, no empty operation cell — and `--labels` shows the staircase so a mangled sentence fragment is caught by eye |
| Whole collection | `node scripts/check-recipes.mjs` | the five did not break the other 249 |
| Build | `npm run recipes` | `pairs-with` slugs resolve and are made mutual; counter assignment lands |
| Suite | `npx vitest run` | unique slugs, mutual pairings, one plain way per dish, every table tiles |
| Everything | `npm run verify` | parse + tests + build, the one command that must pass |

`check-recipes.mjs` writes nothing, so running it while other ticket threads run is safe.
`npm run recipes` writes `src/generated/`, which is **not committed** (`.gitignore`), so it
is safe to run but produces nothing to include in a commit.

**Verification criteria, per file:** `ok  <path>  N rows x M cols` with `5 <= N <= 16` and
`4 <= M <= 7` (M is operations + 1), every timer in the source carrying a name, and the
`--labels` staircase reading as a sequence of cook's verbs.

Manual checks the tooling cannot do, done by reading each file before its commit:

- `counters:` names every counter the gap docs ask for and no others;
- the un-accented spelling is in `aka`;
- quantities are plausible for the stated `servings` and both units are given where a cook
  would want both;
- no step below step 1 is missing an intermediate reference.

## Steps

Each numbered step is one commit through `lisa commit-ticket`, with the exact
repository-relative path in `--include`. No ordinary `git add`, no `git commit`, nothing left
staged.

### Step 1 — `crema-mexicana`

1. Write `recipes/dressings-and-dips/crema-mexicana.cook` to the shape in `structure.md`.
2. `node scripts/check-recipes.mjs --labels recipes/dressings-and-dips/crema-mexicana.cook`
3. Read the staircase: `warm the cream` → `whisk in the buttermilk, culture 24 hr` →
   `stir in the lime and salt` → `chill 4 hr`. Fix with `>> step.N:` if any cell is a
   fragment.
4. Commit:
   `lisa commit-ticket --ticket-id T-001-01 --message "Write crema mexicana for the Panadería and Taquería" --include recipes/dressings-and-dips/crema-mexicana.cook`

Done when: `ok … 6 rows x 5 cols`, four operations, two named timers.

### Step 2 — `queso-fresco`

Same loop, `recipes/dressings-and-dips/queso-fresco.cook`.

Watch for: step 1 opens with the milk, so the derived label may strip to nothing — set
`>> step.1: heat to 185°F (85°C)` if `--labels` shows an empty or fragmentary first cell.

Done when: `ok … 5 rows x 6 cols`, five operations, four named timers, no timer on the
heating step.

Commit message: `Write queso fresco for the Panadería and Taquería`.

### Step 3 — `nixtamalised-masa`

`recipes/pastry-and-doughs/nixtamalised-masa.cook`.

Watch for: this is the first non-pastry file in `pastry-and-doughs`; confirm the category
string is exactly `Pastry & Doughs` as the other two files spell it. The cal safety note
belongs in the step sentence, and must not read as a quantity.

Done when: `ok … 5 rows x 6 cols`, five operations, three named timers.

Commit message: `Write nixtamalised masa for the Panadería and Taquería`.

### Step 4 — `red-bean-paste`

`recipes/custards-and-puddings/red-bean-paste.cook`.

Watch for: `pairs-with` names `lotus-seed-paste`, which does not exist until Step 5. The
per-file checker does not resolve pairings, so this passes on its own; the build in Step 6 is
where it would fail if Step 5 were skipped. Commit anyway — the two steps land in one
sitting and Step 6 gates the ticket.

Done when: `ok … 6 rows x 6 cols`, five operations, four named timers, and the tsubu-an /
koshi-an choice reads in the mash step.

Commit message: `Write red bean paste for the Bakery and Dim Sum Counter`.

### Step 5 — `lotus-seed-paste`

`recipes/custards-and-puddings/lotus-seed-paste.cook`.

Done when: `ok … 7 rows x 6 cols`, five operations, four named timers.

Commit message: `Write lotus seed paste for the Bakery and Dim Sum Counter`.

### Step 6 — Verify the five together, then the collection

1. `node scripts/check-recipes.mjs --labels <all five paths>` — the acceptance criterion,
   run as one command so the output can be quoted verbatim in `review.md`.
2. `grep -o '~[a-z]*{' <all five paths>` — every match must have a name between `~` and `{`.
   This is the mechanical form of "every timer is named"; a bare `~{` is the failure.
3. `node scripts/check-recipes.mjs` — all 254 files.
4. `npm run recipes` — proves `pairs-with` resolves and the counters attach.
5. `npx vitest run` — the collection invariants.
6. `git status --porcelain` — must show no ticket-owned file staged, modified or untracked.
   `src/generated/` is gitignored and will not appear.

If step 3, 4 or 5 fails on a file this ticket did **not** write, that is a pre-existing
failure: record it in `review.md` rather than fixing it, because those files belong to other
tickets.

**Deliberately not run:** `npm run verify` in full includes the Astro build, which is
slower and adds nothing beyond 4 and 5 for a data-only change. If 4 and 5 are clean, the
build has what it needs. Recorded here so the omission is a decision, not a gap.

### Step 7 — Progress and review artifacts

1. `progress.md` — updated as each step lands, with any deviation and its reason.
2. `review.md` — files created, the checker output quoted, coverage, and the three unowned
   cross-counter components Research found (sweetened whipped cream, plain chicken stock,
   pickled mustard green) as the open concern for the board.
3. `review-disposition.json` — `{"disposition":"pass","reason":null}` if Step 6 is clean on
   the five files, otherwise a block with the actionable reason.
4. `lisa check-disposition T-001-01`, and correct anything it reports.

## Risks and how each is handled

| Risk | Handling |
| --- | --- |
| A derived operation label comes out empty or as a fragment | `--labels` on every file before its commit; fix with `>> step.N:` |
| An accented counter name is mistyped (`Panaderia` for `Panadería`) | the checker rejects unknown counter names outright; the five files are copy-pasted from `counters.json` |
| A `pairs-with` target does not exist | every target verified against the current collection in `design.md`; only `lotus-seed-paste` is forward-looking and lands in the same sitting |
| Row count falls under 5 on a three-ingredient preparation | the water is written where it is genuinely separate (cook, rinse, grind), which is a cook's information, not padding |
| Another ticket's thread touches the same folder | distinct new files in a shared folder do not collide, per the story; `--include` names exact paths so the isolated index carries nothing else |
| An ingredient falls through `src/data/aisles.json` | expected; that file is T-001-17's and is listed for them in `structure.md` |

## Definition of done

- Five `.cook` files exist, one per component, each naming every counter that wants it.
- `node scripts/check-recipes.mjs --labels <the five>` reports `ok` for each.
- Every timer in the five files has a name.
- Nothing outside `recipes/` is modified.
- Each file committed through `lisa commit-ticket` with an exact `--include` path, and
  `git status --porcelain` shows nothing ticket-owned left behind.
- `review.md` names which counters each component was written for.
