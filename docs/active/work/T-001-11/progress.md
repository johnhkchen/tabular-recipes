# T-001-11 — Progress

Twenty-three files written, four commits, plan followed without deviation in scope. Two
small deviations in shape are recorded below.

## Status: complete

| Wave | Files | Commit | State |
| --- | --- | --- | --- |
| 1 — components | 6 | `d39dbea` | done |
| 2 — the spit and the skewers | 6 | `b13490a` | done |
| 3 — the sides | 5 | `a2559cd` | done |
| 4 — the bakery half and the sweets | 6 | `837c5e6` | done |

All four went in through `lisa commit-ticket --ticket-id T-001-11 --include <exact paths>`.
No ordinary `git add` or `git commit` was run at any point. `git status --porcelain` shows
**no `recipes/` entry** of any kind — nothing staged, modified or untracked.

## What was written

**Wave 1 — the components the top of the list assumes** (`d39dbea`)

`shawarma-spice` · `labneh` · `white-sauce` · `pomegranate-molasses` · `sumac-onions` ·
`attar`

**Wave 2 — gap items 1, 2, 3, 5, 6** (`b13490a`)

`chicken-shawarma` · `gyro-meat` · `falafel` · `yellow-rice` · `shish-tawook` · `kafta`

**Wave 3 — gap items 8, 9, 10, 11, 12** (`a2559cd`)

`fattoush` · `kabis` · `batata-harra` · `ful-medames` · `kibbeh`

**Wave 4 — gap items 13, 14** (`837c5e6`)

`manakish` · `lahm-bi-ajeen` · `fatayer` · `sambousek` · `baklava` · `maamoul`

## Deviations from the plan

**1. `fattoush` was restructured after its first passing check.** It came out `16 rows x 3
cols` — passing, but at the checker's exact floor, with three parallel branches (fry the
bread, whisk the dressing, chop the vegetables) collapsing into a single final toss. The
plan flagged three columns as a warning sign that a tree had flattened, and it had: the
recipe's own prose claimed the bread goes in "at the very last moment" while the table
showed it going in at the same moment as everything else.

Split into two operations — dress the vegetables and let them stand five minutes, then throw
the bread through — which is how the salad is actually made and which makes the table say
what the prose says. Now `16 rows x 4 cols`. The edit was made before the wave-3 commit, so
only the corrected version is in history.

**2. `>> note:` was not used anywhere.** Structure planned to follow `al-pastor`'s caveat
field. During Research that file was changed underneath this ticket: the `>> note:` line was
removed and the caveat moved into the prose of the step where the substitution happens. All
twenty-three files follow the newer shape — `chicken-shawarma` and `gyro-meat` carry their
"this is not the spit" caveat inside step 2 and step 2 respectively, not in metadata.

Nothing else departed from `plan.md`. No file was dropped, no file was padded to reach the
tiling floor, and no dish was written that the design had not already argued for.

## Verification

Per-file, at the end of each wave:

```
node scripts/check-recipes.mjs --labels <the wave's paths>
```

All 23 report `ok`, all print a verb staircase, none prints a `cooklang:` warning.
Column counts run 4–6; row counts 3–16. The thinnest is `pomegranate-molasses` at
`3 rows x 5 cols` — three ingredients is what the dish has, and the plan's rule was to leave
a thin file thin rather than pad it.

Whole collection, after wave 4:

```
$ node scripts/check-recipes.mjs
all 434 file(s) draw a table.

$ grep -rl "Shawarma Counter" recipes/ | wc -l
44

$ grep -h '^>> counters:' $(grep -rl "Shawarma Counter" recipes/) \
    | sed 's/>> counters: *//' | grep -c '^Shawarma Counter$'
36
```

Criterion sweeps over the 23 new files:

- **unnamed timers:** `grep -n '~{'` → none.
- **timer names:** every one of the 62 timers uses a name in `UNATTENDED` or `HANDS_ON` in
  `src/lib/time.ts` — bake, beat, chill, cool, drain, dry, fry, grill, knead, marinate,
  prove, rest, roast, sear, simmer, soak, stand, steam, toast. No invented name, which
  would have read as no name at all.
- **metadata:** `title`, `category`, `tags`, `servings`, `counters` and `aka` present in all
  23. Every `aka` list carries a diacritic-free form; the three that use diacritics at all
  (`döner`, `köfte`, `döner spice`) each carry the plain spelling beside it.

## Deferred, with reasons — the record criterion 2 asks for

**Ruled out by the gap doc's own "What it could not stock", quoted in `design.md`:**

- `chicken-over-rice` (item 4) — "*'Chicken over rice' is three finished tables and a scoop
  … a table cannot express a permutation.*" The four tables it is a scoop of are all now
  written: `chicken-shawarma`, `yellow-rice`, `white-sauce`, `sumac-onions`.
- `loaded-fries` (item 21) and the combo plate — assembly on a tray; a choice, not a recipe.
- `makdous` (item 20) — weeks submerged in oil, a spoilage risk, converges to a jar.
- mezze-as-a-meal and the twelve-flavour hummus case — a form and a shop, not dishes.

**Below this ticket's stopping line, deferred not refused:**

- The Greek and Turkish set, gap items 15–19: `halloumi`, `saganaki`, `horiatiki`,
  `melitzanosalata`, `taramosalata`, `tirokafteri`, `fava`, `spanakopita`, `loukoumades`,
  `ezme`, `haydari`, `zaalouk`. `docs/knowledge/counters.md` says that if enough Greek
  recipes accumulate the right move is to **split out a Gyro Shop**. Writing nine Greek
  files into a counter that may be about to split is a maintainer's decision, not this
  ticket's.
- Gap item 20's remainder (`mast-o-sir`, `makanek`, `soujouk`, `hummus-fatteh`) and item 22's
  drinks (`mint-tea`, `ayran`, `jallab`).
- Two of the three kibbeh: `kibbeh-nayyeh` (raw) and `kibbeh-bil-sanieh` (baked in a tray).
  The fried torpedo was written as `kibbeh` because it is the one the word means unqualified
  on a menu.

**Components deliberately left inside their dish**, per the design rule that a component is
written only when it is also ordered by name or needed by more than one dish: falafel mix
(it *is* falafel), the yogurt-lemon-garlic marinade (`shish-tawook` step 1), kibbeh dough
(ground with the meat, by definition), filo (bought, and stated as bought in `baklava`), the
thin red hot sauce, and amba.

## Nothing for T-001-18

Research checked all 60 candidate slugs against the 382 files then on disk and found none
of them. No dish on this list already existed and needed only this counter added, so this
ticket makes **no entry** in T-001-18's artifact and edited no file owned by another ticket.
