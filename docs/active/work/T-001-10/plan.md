# T-001-10 — Plan

Seven commit units, thirteen files. Each unit is written, checked, label-audited, then
committed through `lisa commit-ticket` before the next one starts.

## The per-unit loop

For every unit:

1. Write the `.cook` file(s).
2. `node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook` — must print `ok`
   with a row × col count inside 5–16 × 3–6, and a staircase that reads as verbs.
3. **Verb audit**: take the first word of every label in the staircase and confirm it is a
   key in `VERB_ICONS` or a `PHRASE_ICONS` opening in `src/lib/icons.ts`. This is the gate
   that is invisible to the checker and cost T-001-06 an unplanned rework pass.
4. **Timer audit**: every `~` in the file is named, and the name is in `UNATTENDED` or
   `HANDS_ON` in `src/lib/time.ts`. No hands-on name on a timer ≥ 4 hr.
5. `lisa commit-ticket --ticket-id T-001-10 --message "<message>" --include <exact paths>`.

No ordinary `git add`, no `git add -A`, no ordinary `git commit`, at any point. Other
tickets are writing into `recipes/stews-and-braises/` concurrently (`dansak`, `madras`,
`vindaloo` were untracked at the start of this attempt), so `--include` names each file
exactly and never a directory.

## Steps

### Step 1 — the adobo and the dish that needs it

Files: `recipes/spice-blends-and-marinades/adobo-para-al-pastor.cook`,
`recipes/smoked-and-grilled/al-pastor.cook`.

Written in that order because `al-pastor` takes the adobo as an ingredient row and pairs
with it. Verification: both `ok`; `al-pastor`'s header and step 2 must say plainly that a
loaf tin is not a trompo.

Commit: `Write the al pastor adobo and the loaf-tin trompo it dresses`.

### Step 2 — the salsa pair

Files: `recipes/sauces-and-gravies/salsa-verde.cook`,
`recipes/sauces-and-gravies/salsa-verde-cruda.cook`.

Verification: `salsa-verde`'s four labels should read as near-siblings of `salsa-roja`'s
(`char 10 min` / `blend coarse` / `fry 5 min` / `finish off heat`). `salsa-verde-cruda` is
allowed to be the thinnest table in the set at 3 operations; if it comes out at 2 columns
it is a failure, not a rounding error, and gets a fourth operation or is cut.

Commit: `Print the green half of the salsa pair, raw and charred`.

### Step 3 — the grill

Files: `recipes/smoked-and-grilled/carne-asada.cook`,
`recipes/smoked-and-grilled/pollo-asado.cook`.

Verification: `~marinate{4%hr}` reads unattended (it is in `UNATTENDED`), so
`collection.test.ts`'s four-hour rule is not tripped. Both finish chopped and tossed, which
is how a taquería serves them — not as a whole steak on a plate.

Commit: `Light the grill: carne asada and pollo asado`.

### Step 4 — the guisado pot

Files: `recipes/stews-and-braises/tinga-de-pollo.cook`,
`recipes/stews-and-braises/chile-verde.cook`.

Verification: `tinga-de-pollo` is the only file with an absolute `@&(1)` reference and three
branches. Its tree is the one to read twice — every branch has to reach the final step, and
step 1's shredded chicken must come back at the end rather than being orphaned.

Commit: `Fill the chicken column and the green pork`.

### Step 5 — the first two cuts

Files: `recipes/stews-and-braises/lengua.cook`,
`recipes/stews-and-braises/suadero.cook`.

Verification: `~simmer{3%hr}` on the tongue is unattended (`simmer` is in `UNATTENDED`), so
the three-hour wait does not read as three hours of standing there. `suadero` merges two
branches at step 3 — check the salted beef is not stranded.

Commit: `Write lengua and suadero, the first two cuts`.

### Step 6 — the second two cuts

Files: `recipes/stews-and-braises/cachete.cook`,
`recipes/stews-and-braises/tripas.cook`.

Verification: `cachete` opens with a full-width prep row, so `~1` in step 2 must point at
the seasoning step and not at the preheat. Confirm the checker's row count includes the
prep row's ingredients (it has none) and that the staircase starts at `season`, not at
`preheat`.

Commit: `Write cachete and tripas, the cuts that say it is a real taquería`.

### Step 7 — the cup

File: `recipes/soups/consome-de-birria.cook`.

Verification: it must start *from* the braise — one plain ingredient row of birria braising
liquid — not branch off `birria-de-res`. `pairs-with: birria-de-res` is written on this side
only; `birria-de-res` is not edited.

Commit: `Pour the consomé the birria order is half of`.

## Verification strategy

**Per file, always** — `node scripts/check-recipes.mjs --labels <path>`. This is the check
the acceptance criteria name, and it covers the metadata, the tree, the tiling, the counter
name, the 3-row/3-column floor and the empty-label case.

**Across the set, once at the end** — `node scripts/check-recipes.mjs recipes/*/*.cook` over
the whole collection, to prove nothing this ticket wrote broke a neighbour, and
`npm run recipes` to prove `parse-recipes.mjs` accepts every `counters:` and `pairs-with:`
line (dangling pairings and unknown counters are build errors, not checker errors, so the
per-file check cannot see them).

**Counts, at the end** — recompute shelved and exclusive from `recipes/` directly rather
than trusting the plan:

```sh
grep -rl 'Taquer' recipes/ | wc -l                                  # shelved, expect 33
grep -rl 'Taquer' recipes/ | xargs grep -h '^>> counters:' \
  | grep -c ':[[:space:]]*Taquería[[:space:]]*$'                    # exclusive, expect 25
```

**Not run by this ticket**: `npm run verify` in full. It builds the site and runs the whole
vitest suite, including tests over `src/` that other in-flight tickets are actively
changing; a failure there would not be attributable. `npm run recipes` plus the per-file
checker plus a hand audit against `icons.ts` and `time.ts` covers everything this ticket
can break. If `npm run recipes` succeeds and every file checks `ok`, the two collection
tests that could plausibly fail — the icon coverage test and the timer sanity test — are
covered by steps 3 and 4 of the per-unit loop. This is stated as a known limitation in
`review.md` rather than hidden.

## Risks

| Risk | Signal | Response |
| --- | --- | --- |
| An opening verb is not in `VERB_ICONS` | Verb audit in the per-unit loop | Reword the step (T-001-06's precedent — `src/lib/icons.ts` is not ours) |
| A table comes out under 3 columns | Checker says "only one operation" | Add the operation the dish actually has, or drop the file and say so |
| A concurrent ticket commits into the same folder | `git status` shows untracked files not ours | `--include` exact paths only; never a folder |
| `salsa-verde-cruda` is too thin to be honest | 3 ops, 2 columns | Cut it; the count still clears without it |
| Quantities drift from the stated servings | Hand check per file | 2–3 lb of meat per 6–8 taco servings, which is the taquería measure |

## Definition of done for Implement

- 13 files exist, each printing `ok`.
- `npm run recipes` succeeds.
- Shelved ≥ 24 and exclusive ≥ 18, measured from `recipes/` not from this document.
- `git status --porcelain recipes/` shows none of this ticket's files staged, modified or
  untracked.
- `progress.md` names every gap-list item not written, with a reason.
