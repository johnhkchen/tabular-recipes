# T-014-01 — Progress

Two commits, two files. No fix of any kind applied.

| step | state |
| --- | --- |
| 0 — baseline | done |
| 1 — the tag re-run | done |
| 2 — the six cross-property checks | done |
| 3 — the seven headline claims | done |
| 4 — write `docs/gaps/what-the-season-left.md` | done, `f7bcb4e` |
| 5 — edit `docs/gaps/README.md` | done, `2be0ede` |
| 6 — the no-fix proof | done, run after each commit |
| 7 — re-run and reconcile | done |

Both commits through `lisa commit-ticket` with exact `--include` paths. The ordinary index was
never used.

---

## Step 0 — baseline

```
$ git status --porcelain -- recipes/ src/ scripts/ src/data/
$ npm run verify
all 685 file(s) draw a table.
parsed 685 recipe(s) in 27 categories -> src/generated/recipes.json
 Test Files  21 passed (21)
      Tests  1229 passed (1229)
[build] 710 page(s) built
22 counter(s): 930 slug(s) listed, 930 printed.
```

Empty, and exit 0. Re-run identically at step 7.

Baseline for the counter-opening check, T-013-03's technique:

```
$ node scripts/menu-sections.mjs > ms-before.txt      # 177 lines
```

---

## Step 1 — the tag re-run

T-001-18's own verifier, quoted from `T-001-18/plan.md:113-124`, plus the two readings its
verifier does not implement. Script in the scratchpad; the load-bearing part:

```js
const n = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'')
                .toLowerCase().replace(/[^a-z0-9]/g,'');
const g = {}; for (const x of tags) (g[n(x)] = g[n(x)] || []).push(x);
console.log(Object.values(g).filter(v => v.length > 1));
```

Output:

```
recipes: 685
distinct tags: 615  tag uses: 3575

== punctuation/case/accent collisions (T-001-18 printed []): 3
    no-cook | no cook
    make-ahead | make ahead
    one-pot | one pot

== + singularise: groups 13  -> distinct would fold to 602
    black beans(1) | black bean(1)      carrot(3) | carrots(1)
    chiles(43) | chile(1)               dumpling(8) | dumplings(1)
    eggs(31) | egg(9)                   hazelnuts(1) | hazelnut(1)
    make-ahead(50) | make ahead(9)      no-cook(45) | no cook(1)
    one-pot(34) | one pot(2)            onion(16) | onions(1)
    peanut(1) | peanuts(2)              prawns(1) | prawn(1)
    rolls(4) | roll(1)
files touched by a split concept: 243

== hand-checked verb/participle + spelling pairs still present together:
    pan-fry(4) | pan-fried(3)
    simmer(3) | simmered(6)
    toasted(6) | toasting(1)
    no-cook(45) | no cook(1)
  -> 4 pairs
```

**615 against 503.** Sixteen split concepts once `no-cook` is not double-counted, across 243
files.

**One correction to the ticket that commissioned this.** It attributes the fold to T-002-09.
It was **T-001-18** — `T-001-18/review.md:52` (*"24 concepts folded across 51 files, 527 → 503
distinct tags, collision check `[]`"*), `structure.md:160`, `progress.md:101`. `grep -rn '527\|503'
docs/active/work/T-002-09/` returns nothing. The finding is real; the source ticket is one story
earlier. Recorded on the page.

---

## Step 2 — the six cross-property checks

Two scripts over `src/generated/recipes.json`. Coverage first, because every result is a statement
about the files that answered:

```
685 recipes. declared: slack 416 · washing-up 177 · capacity 46 · keeps 138
39 declare all four · 229 declare none of the four
overlap: slack&wash 139 · wash&keeps 138 · cap&keeps 41
```

**C1 — a `capacity` whose vessel appears nowhere in the same file's `washing-up` list.**
Word-matched with a stop list of counting words, over the 42 files that declare both.

```
batata-harra: "four cups of oil in the pan" vs [the frying pot, a pot to parboil in,
              a colander, a rack to drain on, the mortar]
 -> 1 of 42
```

The file's own step 4 says *"in the pan"*. Two mentions say pan, one says pot.

**C2 — a `capacity` on a file with no `washing-up` line.** `fried-chicken`,
`soy-sauce-pan-fried-noodles`, `dansak`, `beef-with-broccoli`. A coverage hole, not a
contradiction.

**C3 — a `keeps` span on a file whose `slack` says it cannot be held.** Regex over
*eaten straight away · to order · does not reheat · will not undo · only itself hot · within the
hour · goes rubber*. **0.**

**C4 — a `washing-up` count against its counter's promise.**

```
One Pot, washing-up >= 3:  8 of 73
  tortilla-espanola (3) · country-fried-steak (4) · wonton-soup (3) · beef-bourguignon (3)
  chile-verde (4) · soy-sauce-chicken (3) · tinga-de-pollo (3) · white-cut-chicken (3)
The Air Fryer & the Pot, bar 1 (<= 2):  none — all 21 declare <= 2
The Air Fryer & the Pot, bar 3 (<= 45 min):  0 over
```

The eight are the same eight T-008-03 named, unchanged.

**C5 — a `washing-up` count of 1 on a file naming three or more pieces of cookware.**
`carnitas` only: a Dutch oven, a broiler and an oven, washing the pot. Correct — the appliances
are not washed.

**C6 — a dish group split across a property.**

```
washingUp: 0 split dish groups
keeps:    24  (air-fryer-chips/french-fries, boston-baked-beans-instant-pot/boston-baked-beans, …)
capacity: 19
```

**Deliberately excluded, with the reason.** A `capacity` below its own `servings` is *legal* —
`checkCapacity()` permits it when a bound step's words say the recipe batches, which is why
`beef-with-broccoli` (holds 2, serves 4) exists at all. Twenty-five files match that shape and not
one is a contradiction; reporting them would have been the check misreading the checker.

**Checked because it looked wrong and is not:** seven air fryer recipes declare a two- or
three-day keep on a shelf sold on a crisp edge. Every one says in its own character text what
happens to it cold. The property is doing its job.

---

## Step 3 — the seven headline claims, against `dist/`

```
S-007  ls dist/menu/                                → 22 dirs, no soup-pot
       dist/menu/cha-chaan-teng/index.html          → <p class="count">27 recipes
       npx vitest run src/lib/shopping.test.ts      → 4/1086 ingredients have no aisle
S-008  dist/menu/air-fryer-and-pot/index.html       → 21 recipes, 4 menu-sections
       washing-up over the shelf                    → 21 declare, 0 above 2, 0 over 45 min
S-009  grep -rn '^>> *step\.' recipes               → 0
       grep -rc '^>> step:' recipes                 → 2892 inline labels
       node scripts/check-recipes.mjs <probe>       → refuses by name, quotes the label back,
                                                      names inline-step-labels.mjs --write
S-010  grep -o 'data-dial="[a-z]*"' dist/index.html → by, standing, wash · 21 aria-pressed stops
       grep -i 'difficulty|easy|score' dist/index.html → 0
       shipped script                               → "we can’t say", "We can't say for"
S-011  dist/list/index.html                         → "It goes in three lots, and that costs you
                                                       about 22 min." · 0 matches for O(1)/O(n)
       dist/_astro/plan.*.js                        → × ×1 ×1/2 ×1/3
       dist/_astro/list.*.js                        → serves ${e} →
S-012  docs/knowledge/cooks.md, docs/gaps/what-the-shelf-offers.md exist; no src/ or recipes/ commit
S-013  src/data/counters.json                       → 22 counters, unchanged
       docs/knowledge/occasions.md, docs/gaps/two-that-invert.md exist
```

Also verified for the *no Also here* claim across the board:
`grep -l '<h2>Also</h2>' dist/menu/*/index.html | wc -l` → **0**.

---

## The one measurement taken on a scratch copy

The `airfry` finding's verification needed a code change, and this ticket may not make one. So it
was made on a pristine copy of `HEAD` outside the repository:

```sh
git archive HEAD | tar -x -C $SP/airfry
cp src/generated/recipes.json $SP/airfry/src/generated/
ln -s <repo>/node_modules $SP/airfry/node_modules
node dump.mjs $SP/airfry > before.txt          # 685 lines: slug + 6 schedule figures
# insert 'airfry' as the first member of UNATTENDED in the copy only
node dump.mjs $SP/airfry > after.txt
diff before.txt after.txt   ->  0 lines
```

The dump carries `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`, `assumedHandsOnMinutes`,
`untimedCount` and `longestHandsOnMinutes` for every recipe. **Byte-identical.** That is what makes
the finding mechanical rather than a behaviour change, and the same commands are the verification
T-014-02 should re-run.

`git status --porcelain -- src/` was empty before and after. Nothing in the repository was touched.

---

## Step 4 — the page

`docs/gaps/what-the-season-left.md`, 589 lines, nine `##` sections.

```
$ grep -c '^## What it has' docs/gaps/what-the-season-left.md
0
$ node scripts/menu-sections.mjs > ms-after.txt && diff ms-before.txt ms-after.txt
$ echo $?
0
$ grep -o 'T-0[01][0-9]-[0-9][0-9]' docs/gaps/what-the-season-left.md | sort -u | wc -l
34
$ awk '/^## Mechanical/{p=1;next} /^## Needs an argument/{p=0} p' … | grep -c '\*Verify:\*'
13
$ awk '… same range …' | grep -c '\*Source:\*'
13
```

Every one of the 29 work directories is named on the page — checked by looping over
`docs/active/work/T-00[7-9]-* T-01[0-3]-*` and grepping for each basename; the not-named list is
empty.

**Commit** `f7bcb4e` — *Read the whole season and write down what it left*.

### Deviation: 13 mechanical findings, not the ~8 the plan sketched

The plan's grouping expected *stale prose (5) · stale number (3) · dead syntax or slug (3) ·
one-line ratchet (2)*, which is 13, and that is what was written. No deviation in the count; the
deviation worth recording is in the other direction — **five findings that read as mechanical were
pushed out of the band before the page was written**, listed in `design.md` D3: `birista`,
`lengua`, `batata-harra`, the category tree, and `scaling.md` §2's false claim. Each fails
T-014-02's third test (no declared number, no rewritten argument). The tie-break used throughout
was *push it out of mechanical*, because a finding T-014-02 pushes back costs it a session and a
finding it applies wrongly costs a story.

---

## Step 5 — the README

Four localised edits, no other line moved:

1. A pointer to the new page, in the paragraph run that already points at `filter.md` and
   `what-the-shelf-offers.md`.
2. `## Recorded and not done` gains `### What the season left, S-007 to S-013` — 25 rows of
   *needs an argument* and 4 of *needs food*, each with finding, source ticket and why it was not
   done, which are the four things T-014-02's acceptance criteria require to be present here. The
   six existing S-001 entries are untouched.
3. `## Recorded and closed` gains `### Three closed during S-007 and S-008, with the ticket that
   closed each` — the silent borrow drop and One Pot's four inert slugs (both T-007-06) and the
   drawer (T-008-05 §4.5). The intro line is updated from *"Two entries"* to say what is now there.
4. `## The five gaps to fill first` re-ranked. **Nothing moved, and that is the finding** — all
   five were checked against the shelf rather than remembered:

```
$ ls recipes/*/{buttercream,cream-cheese-frosting,dark-roux,roux,trinity}.cook   -> none
$ ls recipes/dressings-and-dips/ | grep -E 'pickle|chutney|slaw|do-chua'
   barbecue-slaw · coleslaw · do-chua · lime-pickle · mango-chutney · mint-chutney
   · sour-dill-pickles
$ ls recipes/toppings-and-pickles/ -> kabis, sauerkraut, sumac-onions, …
$ ls recipes/stews-and-braises/cha-lua.cook recipes/pastry-and-doughs/nixtamalised-masa.cook
   both present
```

Gap 2's stale `527 tags` is restated at the re-run's 615, with the three re-opened collisions and
the 243 files, because updating the ranking is this ticket's job rather than a fix.

**Commit** `2be0ede` — *Fold the season's findings into the gaps list and the ranking*.

---

## Step 6 — the no-fix proof

Run after each commit:

```
$ git status --porcelain -- recipes/ src/ scripts/ src/data/
$ git status --porcelain -- docs/gaps/
```

Both empty. The acceptance criterion names the first one and it is the output above: nothing under
`recipes/`, `src/`, `scripts/` or `src/data/` is staged, modified or untracked.

---

## Step 7 — re-run and reconcile

`npm run verify` re-run on the final tree, **exit code captured from the command rather than from
a pipeline** (T-010-03's afternoon, and T-014-03's ticket names it):

```
$ npm run verify > verify.txt 2>&1 ; echo "VERIFY_RC=$?"
VERIFY_RC=0
all 685 file(s) draw a table.
parsed 685 recipe(s) in 27 categories
 Test Files  21 passed (21)      Tests  1229 passed (1229)
[build] 710 page(s) built
22 counter(s): 930 slug(s) listed, 930 printed.
every listed slug prints under the heading it was listed under.
```

`node scripts/menu-sections.mjs` diffed against the step-0 baseline after both commits: **empty**.

Every figure on the page was taken from this build or from the scratch copy of this `HEAD`. Nothing
moved between Research and Review — the branch was quiet for the whole attempt, which is the
condition four earlier tickets did not get.

---

## What was not done, deliberately

- **`npm run verify:mobile` was not run.** It is not an acceptance criterion here, it drives a
  browser, and this ticket adds no markup and no page — `docs/gaps/**` is not built. T-014-02 and
  T-014-03 both name it and both are told to run it on a quiet tree.
- **No test was added.** `src/lib/` is unchanged, so there is nothing new to unit-test, and a test
  asserting a paragraph exists is a test of the diff. T-012-02, T-013-01 and T-013-03 shipped the
  same way and all three dispositions passed.
- **The README's `## Build state`, its tally, and its `3 of 1074` aisle figure are all stale and
  were all left stale.** Each is recorded as a mechanical finding with its command. Fixing them
  here would have broken this ticket's last acceptance criterion, which is the one the whole
  ticket rests on.
