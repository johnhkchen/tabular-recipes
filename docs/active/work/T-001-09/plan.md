# T-001-09 — Plan

Nine steps, nine commits. Each is write → check → commit, and each is verifiable alone. A step
that fails its check is fixed before the next starts; nothing is committed that has not printed
`ok`.

## The loop every step runs

```
1. write the .cook file(s) for this step
2. node scripts/check-recipes.mjs --labels <exactly those files>
      -> "all N file(s) draw a table."     ok
      -> anything else                     fix, back to 2
3. read the printed staircase: does every cell read as a verb a cook would say?
      -> fragment, or a cell that is a clause -> add a >> step.N: override, back to 2
4. grep -n '~{' <those files>            # must print nothing: every timer is named
5. grep -c '^>> counters: Curry House$' <each file>   # must be 1 on every file
6. lisa commit-ticket --ticket-id T-001-09 --message "<message>" --include <exact paths>
7. append the step to progress.md
```

Steps 2, 4 and 5 are pass/fail. Step 3 is the only judgement call, and it is the one the
acceptance criterion actually names ("reads as a cook's verbs rather than sentence fragments").

`npm run recipes` is **not** in the loop — it writes `src/generated/recipes.json`, which this
ticket does not own. It is run **once**, read-only in effect, at step 9, purely to prove the
`pairs-with` graph resolves; the generated file is reverted before Review.

## Step 0 — pilot, before any of the 32

Write `recipes/spice-blends-and-marinades/ginger-garlic-paste.cook` alone and run the loop on
it. Three assumptions from research are unproven and all three are cheap to disprove here:

1. a step whose only content is a `@&(~1)` reference and cookware is still an op (not a footer);
2. a prose-only closing paragraph becomes a footer row rather than a second root;
3. `--labels` prints the staircase for a file this small without tripping `colCount < 3`.

If any of the three is wrong, `structure.md` §6 changes before 31 files are written to it.
This is not a separate commit; it is folded into step 1.

## The steps

**Step 1 — the paste and the base.**
`spice-blends-and-marinades/ginger-garlic-paste.cook`, `sauces-and-gravies/onion-tomato-masala.cook`.
Nothing depends on anything yet, and everything depends on these. The check to watch: the base
has 11 ingredient rows and 4 operations — if the tomato reduction collapses into the spice
bloom it loses a column, and if the label for "cook down until the oil separates" comes out as
"until the oil separates" it needs an override.
Commit: *Write the ginger-garlic paste and the onion-tomato masala base for the Curry House*.

**Step 2 — the other four components.**
`sauces-and-gravies/makhani-gravy.cook`, `spice-blends-and-marinades/vindaloo-paste.cook`,
`dressings-and-dips/paneer.cook`, `dressings-and-dips/birista.cook`.
`vindaloo-paste` is the first file with **two branches** (toasted spice, soaked chile) merging
at the last step — the one-root rule, exercised early where it is cheap to fix. `birista` is
the thinnest file in the ticket at 4 rows; if it comes out at 2 it fails `rowCount < 3` and the
salt and the ghee/oil split are what save it.
Commit: *Write the makhani gravy, vindaloo paste, paneer and birista for the Curry House*.

**Step 3 — the top of the list.**
`stews-and-braises/butter-chicken.cook`, `korma.cook`, `rogan-josh.cook`.
Ranked 1, 2, 3. The first files with a **footer row** saying what the sauce runs across; verify
the footer appears as a full-width row and not as a second root. `butter-chicken` is the first
consumer of `makhani-gravy` — verify it appears as a plain `@` ingredient row, not `@&(~N)`.
Commit: *Write butter chicken, korma and rogan josh for the Curry House*.

**Step 4 — the dry end of the sauce list.**
`stews-and-braises/bhuna.cook`, `dopiaza.cook`, `jalfrezi.cook`, `karahi.cook`.
Four files that all stand on the base and could all come out as the same table. Run
`--labels` on all four **together** and read the four staircases side by side: bhuna must be
the one with no liquid, dopiaza the one with onions twice, jalfrezi the one that never
simmers, karahi the one with julienne. If two read the same, the design failed and the fix is
in the method, not in a tag.
Commit: *Write bhuna, dopiaza, jalfrezi and karahi for the Curry House*.

**Step 5 — the hot end and the sour end.**
`stews-and-braises/madras.cook`, `vindaloo.cook`, `dansak.cook`, `patia.cook`.
`madras` is what finally goes under `madras-curry-powder`, which has sat on the shelf with
nothing under it. `vindaloo` is the only overnight marinade in the batch and the only file
consuming `vindaloo-paste`. `dansak` has two branches — dal and meat — and merges them.
Commit: *Write madras, vindaloo, dansak and patia for the Curry House*.

**Step 6 — the mild end, and the bowl.**
`stews-and-braises/balti.cook`, `passanda.cook`, `palak-paneer.cook`.
`balti` finishes in the serving bowl, which is a real step and not a garnish, so it must be a
referenced op. `palak-paneer` is the first consumer of `paneer` and closes ranked item 11.
Commit: *Write balti, passanda and palak paneer for the Curry House*.

**Step 7 — the tray.**
`flatbreads-and-pancakes/papadom.cook`, `dressings-and-dips/mango-chutney.cook`,
`lime-pickle.cook`, `mint-chutney.cook`, `salads/kachumber.cook`, `dressings-and-dips/raita.cook`.
Six files, ranked 5 and 6. `papadom` carries four `pairs-with` edges — the tray, as close as
the build gets to one. `lime-pickle` is the longest wait in the ticket (a week in the sun);
`~cure{}` is not in either vocabulary, so the timer name has to be `~stand{}` or `~rest{}` to
classify as anything.
Commit: *Write the papadom and the chutney tray for the Curry House*.

**Step 8 — the starters and the skewer.**
`dumplings-and-rolls/samosa.cook`, `flatbreads-and-pancakes/onion-bhaji.cook`,
`smoked-and-grilled/chicken-tikka.cook`, `smoked-and-grilled/seekh-kabab.cook`.
Ranked 7 and 8. These are the first deep-fried things on the site, so the oil temperatures
have to be in the labels where a cook can see them. `chicken-tikka` is what finally goes on
the skewer the `tandoori-marinade` was written for; it consumes that file as an ingredient row.
Commit: *Write samosa, onion bhaji, chicken tikka and seekh kabab for the Curry House*.

**Step 9 — the rice.**
`rice-beans-and-grains/biryani.cook`, `pilau-rice.cook`.
Ranked 9 and 10. `biryani` is the hardest tree in the ticket: parboiled rice and marinated meat
are two branches that meet at the layering step, and the seal-and-steam is a third operation
after that. If it throws `2 steps end the recipe`, the layering step is missing a back-count.
Then, once, whole-collection:

```
node scripts/check-recipes.mjs           # all 357 files
npm run recipes                          # proves every pairs-with slug resolves
git checkout -- src/generated/recipes.json   # not this ticket's file
```

Commit: *Write the biryani and pilau rice for the Curry House*.

## Verification criteria, in the order the acceptance criteria state them

| Criterion | How it is checked | When |
| --- | --- | --- |
| ≥22 shelved, ≥20 exclusive | `grep -rl "Curry House" recipes/ \| wc -l` → 47; `grep -h '^>> counters:' <those> \| sort -u` → one line | step 9 |
| ranked order, skips named | `structure.md` §5, repeated in `review.md` | written already |
| checker ok + label staircase | `check-recipes.mjs --labels` per step, then whole-collection | every step, and 9 |
| title/category/tags/servings/counters/aka | checker enforces the first four; `grep '^>> aka:'` on all 32 for the rest | step 9 |
| an aka form without diacritics | only 4 titles carry diacritics at all; checked by eye at step 9 | step 9 |
| every timer named | `grep -rn '~{' <the 32>` prints nothing | every step, and 9 |
| real quantities, canonical method | judgement, recorded per file in `progress.md` | every step |
| only `recipes/**` modified | `git status --short` shows nothing outside `recipes/` and the attempt dir | step 9 |

## Risks and what they cost

- **The one-root rule** is the only build error that a well-written recipe hits by accident: a
  garnish stirred in at the end with no `@&(~1)` is a second root. Steps 2, 5, 8 and 9 each
  contain at least one file with two branches, so it is met early and often rather than at the
  end.
- **`colCount < 3` on the short files** — `birista`, `mint-chutney`, `kachumber`, `raita`. Each
  needs two chained operations. Where a dish genuinely has one (raita is "grate, salt, drain,
  stir"), the honest fix is the draining step, which is a real step and not padding.
- **Sameness across the ten sauce lines** is the failure mode nobody's checker catches. Step 4
  reads four staircases side by side specifically to catch it, and step 5 does the same.
- **`npm run recipes` writes a generated file** this ticket does not own. It is run once, at
  step 9, and reverted in the same breath.
