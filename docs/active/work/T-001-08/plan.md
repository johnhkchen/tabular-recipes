# T-001-08 — Plan

Seven steps, one commit each, in dependency order. Nothing is committed that has not printed
`ok`.

## The loop every step runs

```
1. write the .cook file(s) for the step
2. node scripts/check-recipes.mjs --labels <exactly those files>
3. read the staircase: does every cell read as a verb a cook would say?
   fragment, essay, or empty cell -> add or repair a >> step.N: override, back to 2
4. grep -n '~{' <those files>            # must print nothing — every timer named
5. grep -n 'pairs-with' <those files>    # every slug named must already exist on disk
6. lisa commit-ticket --ticket-id T-001-08 --message "<message>" --include <exact paths>
7. append the step to progress.md
```

Step 3 is the only judgement call; 2, 4 and 5 are pass/fail.

## Steps

**Step 1 — the two broths and the dashi.**
`recipes/soups/dashi.cook`, `recipes/soups/tonkotsu-broth.cook`,
`recipes/soups/chintan-broth.cook`.
Nothing depends on anything yet. The check to watch: `dashi` has exactly three ingredient
rows, which is the floor at `check-recipes.mjs:66` — if any ingredient collapses (kombu and
katsuobushi written into one row) the file fails as "too thin to be a table". Also watch that
`tonkotsu-broth`'s two water rows stay two rows: the parboil water is thrown away and the boil
water is not.
Commit: *Write the tonkotsu and chintan broths and the dashi under them*.

**Step 2 — the three tares and the aroma oil.**
`recipes/sauces-and-gravies/shoyu-tare.cook`, `shio-tare.cook`, `miso-tare.cook`,
`recipes/sauces-and-gravies/mayu.cook`.
`shoyu-tare` and `shio-tare` name `dashi` in `pairs-with`, which step 1 has just created.
The check to watch: `mayu` is three rows and three operations, the tightest file in the
ticket — if "blitz" and "cool" merge into one step it fails on `only one operation`.
Commit: *Write the shoyu, shio and miso tares and the black garlic oil*.

**Step 3 — chashu and the noodles.**
`recipes/stews-and-braises/chashu.cook`, `recipes/noodles/ramen-noodles.cook`.
The two things every bowl needs. `chashu` carries the note pointing at `shoyu-tare` — the
braising liquid is a tare, one preparation with two later uses, which the build refuses as
one table and which is therefore written as a sentence on each file. **The 18/14 acceptance
bar is cleared here** (10 + 9 = 19 total, 18 exclusive); everything after this exists so the
bowls are makeable.
Commit: *Write the chāshū and the kansui noodle dough*.

**Step 4 — the toppings.**
`recipes/toppings-and-pickles/ajitama.cook`, `recipes/toppings-and-pickles/menma.cook`.
Creates the folder. The check to watch: the new folder means a new category string, so
confirm `check-recipes.mjs` prints `ok` (it validates counters, not categories) and that the
explicit `>> category: Toppings & Pickles` line matches the title-cased folder name so the
build and the file agree.
Commit: *Write the ajitama and menma the toppings list is made of*.

**Step 5 — the four bowls.**
`recipes/noodles/tonkotsu-ramen.cook`, `shoyu-ramen.cook`, `shio-ramen.cook`,
`miso-ramen.cook`.
Every component they name now exists. The checks to watch:
- each bowl's components appear as plain `@` ingredient rows, never `@&(~N)` — the refs are
  for steps inside the same file, and a ref to a step that does not exist throws;
- `pairs-with` slugs all resolve;
- the four staircases must not be four copies of the same five words. Read them side by side.
Commit: *Write the four bowls the ramen board is organised around*.

**Step 6 — gyoza.**
`recipes/dumplings-and-rolls/gyoza.cook`.
The only two-branch tree in the ticket: dough and filling are built separately and joined at
"fill and pleat". The check to watch is the root count — if the join step forgets one of its
two `@&(~N)` refs, `buildTree` throws *"2 steps end the recipe"*. Reference distances are
counted from the join step backwards and must be re-counted after any step is inserted.
Commit: *Write the gyoza, pleated on one side and fried flat*.

**Step 7 — karaage.**
`recipes/fried-and-crispy/karaage.cook`. Creates the second folder. Last item reached on the
ranked list.
Commit: *Write the karaage and open the fried plates folder for it*.

## Testing strategy

There is no unit test to add — this ticket writes data, and `scripts/check-recipes.mjs` is
the test harness for it. Verification is layered:

**Per file, before its commit** (steps 2–5 of the loop above). `--labels` is not optional:
the acceptance criteria ask that the staircase read as a cook's verbs, and the label is
derived from the sentence unless overridden, so it can only be judged by printing it.

**Per step, after its commit.** `git status --porcelain recipes/` must show nothing for the
files just committed — no ticket-owned file left modified, staged or untracked.

**Once, at the end of step 7:**

```
node scripts/check-recipes.mjs                     # all 332 files, not just the new 17
node scripts/parse-recipes.mjs                     # the real build: counters resolve, no orphans
grep -rn '~{' recipes/<the 17 new files>           # nothing
grep -c 'Ramen Shop' — recount both totals from the files
git status --porcelain                             # no ticket-owned residue
```

The full-collection run matters because `parse-recipes.mjs` fails the build if any recipe
lands at no counter, and because two new categories are introduced — a category that no
counter claims is fine only because every new file names its counter explicitly.

## Acceptance criteria, and what proves each

| Criterion | Evidence |
| --- | --- |
| ≥18 recipes at Ramen Shop, ≥14 exclusive | `grep -h '^>> counters:' recipes/*/*.cook` recount: 27 / 26 |
| Top of the gap list written, in order | steps 1–7 follow items 1→9; skipped items named with reasons in `review.md` |
| `check-recipes.mjs --labels` ok, staircase reads as verbs | loop step 2 per file, then the full run |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` with a diacritic-free form | the metadata block in `structure.md`, applied to all 17 |
| Every timer named | loop step 4, then the final `grep -rn '~{'` |
| Real quantities, canonical method | written per file; the four judgement paragraphs (tonkotsu's boil, the 6:30 egg, the double fry, the gyoza wring) are where this is visible |
| Only `recipes/**` modified | final `git status --porcelain` and the `--include` paths on every commit |

## Risks and what they look like when they happen

1. **A component used twice inside one file** → `buildTree` throws *"a preparation can only
   flow into one place"*. Only a live risk in `gyoza`; the design keeps everything else linear.
2. **Two roots** → the same file, if the join step drops a ref. Both are caught by the
   checker before the commit, never after.
3. **Relative refs drifting.** `@&(~3)` counts steps back from the step it is written in.
   Inserting a step silently changes what every later ref points at. Rule: after editing any
   file, re-read every `~N` in it before re-running the checker.
4. **Four bowls that read alike.** Not a checker failure — a judgement one. Mitigated by
   writing all four in one step and reading the four staircases together before committing.
5. **A label that comes out as an essay.** Any step carrying a paragraph of judgement gets a
   `>> step.N:` override, decided while writing rather than after the checker complains.
