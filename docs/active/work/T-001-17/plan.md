# T-001-17 — Plan

Five steps, two commits. Each step is verifiable on its own; the two commits are the two files.

## Step 0 — baseline (no commit)

- `npm run recipes` to rebuild `src/generated/recipes.json` (gitignored; every measurement below
  reads it).
- `npx vitest run` and record the failures as they stand: `shopping.test.ts` aisle coverage at
  90/925 = 9.73%, plus `icons.test.ts` (unknown operation verbs) and two in `schedule.test.ts`
  (hardcoded longest-path slugs) which neither owned file can reach.

Verification: the numbers above are reproduced. If the aisle figure differs, the map in
`structure.md` is stale and gets recomputed before anything is edited.

## Step 1 — apply the placement map to counters.json

Write `place.py` in the session scratchpad holding the map from `structure.md` verbatim as
`{counter slug: [(section title, [slug…])]}`, plus, per counter, the order sections are emitted in.
It:

1. loads `src/data/counters.json` and `src/generated/recipes.json`;
2. for each counter, appends mapped slugs to the named existing section or creates the section at
   the given position;
3. writes back with `json.dumps(file, indent=2, ensure_ascii=False) + "\n"`.

Assertions inside the script, all fatal:

- every slug in the map is shelved at that counter (`counter.name in recipe.counters`);
- no slug appears in two sections of one counter;
- after the edit, every slug shelved at a counter is named by exactly one of its sections;
- section titles are drawn only from the set recorded in `structure.md` — no title invented at
  apply time;
- the file round-trips: reload and re-serialise gives byte-identical output.

Verification: a second, independent script (`check-menus.py`) re-derives what `menuFor` would do —
`mine = [r for r in recipes if counter.name in r.counters]`, sections mapped through, leftovers
swept — and asserts **no counter produces an "Also" section** and no section comes out empty.

## Step 2 — commit counters.json

```
lisa commit-ticket --ticket-id T-001-17 \
  --message "Shelve every dish in a section its board would print" \
  --include src/data/counters.json
```

## Step 3 — add aisle patterns and pack sizes

Edit `src/data/aisles.json` directly (Edit tool, one aisle at a time) with the patterns listed in
`structure.md` §B, then the `packs` entries in §C. Patterns are appended to the end of each aisle's
existing list rather than interleaved, so the diff reads as an addition.

Verification, after each aisle and again at the end, using the Python replica of
`soldAs`/`aisleFor` already checked against vitest at exactly 90/925:

- recompute the unplaced set; it shrinks monotonically and ends at the three non-food names;
- re-assert every named aisle expectation from `shopping.test.ts` (beef chuck→butcher,
  littleneck clams→fishmonger, grated Parmesan→cheese, heavy cream→dairy, yellow onion→produce,
  coconut milk→tins, coconut oil→oils, chicken stock→tins, chicken thighs→butcher,
  fish sauce→world, dried oregano→spices, flat-leaf parsley→produce, crushed tomatoes→tins,
  hot sauce→world);
- spot-check the new names land where §B says, not merely somewhere.

Then the real gate:

```
npx vitest run
```

`shopping.test.ts` must be fully green, including `finds an aisle for nearly everything`,
`never lets a temperature word eat a product name`, and `never turns a name into an empty string`.
The pack additions are exercised by `a pack, part of one, or a spoonful`, whose existing
assertions must not move.

## Step 4 — commit aisles.json

```
lisa commit-ticket --ticket-id T-001-17 \
  --message "Give the new ingredients an aisle and a pack size" \
  --include src/data/aisles.json
```

## Step 5 — final verification

- `npx vitest run` once more from a clean rebuild of `recipes.json`.
- `git status --porcelain` — no ticket-owned file left modified, staged or untracked. The only
  expected residue is Lisa's own `.lisa/` bookkeeping and the pre-existing untracked
  `.lisa-layout.kdl`.
- `node scripts/check-recipes.mjs` is **not** run as a gate: it checks recipe files, which this
  ticket does not touch.
- `astro build` is not run either; `npm run verify` end-to-end belongs to T-001-18, which owns the
  three failures this ticket cannot reach.

## Testing strategy

No new test file. The ticket may change two data files, and a test would be a third; the
acceptance criteria are already expressed as tests that exist:

| Criterion | Test |
| --- | --- |
| Every shelved recipe in a named section, no "Also" | `check-menus.py` in the scratchpad, re-deriving `menuFor` |
| Titles are board titles, not categories | Reviewed against `docs/gaps/*.md` headings in `structure.md`; each title cited there |
| "Anything else" under 2%, water excepted | `src/lib/shopping.test.ts:146` |
| Packs only where honest | `src/lib/shopping.test.ts:89-140`, unchanged and still green |
| `npx vitest run` passes | Whole suite — with the three out-of-scope failures reported, not hidden |
| Only two files modified | `git status` |

## Risks and what is done about them

1. **A section title I invent rather than cite.** Mitigated by listing every title in
   `structure.md` with the note it comes from, and by the apply script refusing unknown titles.
2. **A new pattern shadowing an old one.** Specificity is global; mitigated by re-running the full
   sweep and the named assertions after every aisle, not only at the end.
3. **A dish placed at the wrong counter.** The apply script rejects any slug not shelved at that
   counter, so a typo fails loudly instead of vanishing into `menuFor`'s silent `.filter`.
4. **Reformatting noise.** Both files are re-serialised the same way `menu-sections.mjs --write`
   does, and the diff is read before committing.
5. **The three out-of-scope failures being read as this ticket's.** Recorded in `review.md` with
   the ticket that owns them (T-001-18), and stated in the disposition rather than left implicit.
