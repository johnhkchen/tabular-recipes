# T-005-05 · Review — the rows above and below

Every full-width prose row in the collection is now at or under 120 characters. 183 `.cook` files
and `src/data/counters.json` changed, across seven commits. Nothing else moved: same tree, same
columns, same rowspans, same 658 tables.

This attempt (generation 2) picked the ticket up at Review. Generation 1 wrote Research, Design,
Structure and Plan, did the whole Implement pass and landed all seven commits, then was cut off
mid-verification without writing `progress.md` or the Review artifacts. Everything below was
re-measured against the working tree as it stands now rather than read off generation 1's logs —
including `verify:mobile`, which generation 1 recorded as a failure and which passes cleanly here
(see *The mobile result generation 1 left behind*).

---

## 1. What changed

| Path | Action | Extent |
| --- | --- | --- |
| `recipes/**/*.cook` | modified | 183 files, 232 prose rows rewritten in place |
| `src/data/counters.json` | modified | +167 lines, **−0** — `notes` entries only, nothing removed |

Nothing created, nothing deleted. No component, no `src/lib/`, no `scripts/`, no other metadata
line, no step body.

```
$ git diff --name-only 84e068a..HEAD | grep -v '\.cook$'
src/data/counters.json
```

Seven commits, one per shelf group, the grouping the plan named:

```
994fa8e  Cut the braise shelf's headnotes down to what happens at the stove      70 rows
1153058  Say what the soup pot is for in one line, not a paragraph               47 rows
ef3f62f  Say what the grain does in the pot, once                                26 rows
5631184  Cut the sides, the salads and the chutney tray to the sentence …        34 rows
3341f3f  Keep the frying and the baking notes to the failure they name           20 rows
8348803  Bring the last shelves under the cap: noodles, pasta, eggs, …           35 rows
849a9a6  Print the shelf talk where you can see both dishes                      counters.json
```

Working tree is clean of ticket-owned files: `git status --porcelain` shows only the untracked
story and ticket markdown and the work directory, no `recipes/` and no `src/`.

---

## 2. The measurement the criteria ask for

Headers and footers separately, by the story's own method (`buildTree()` on the parsed recipe,
then `tree.headers` / `tree.footers`, rendered length):

| | Count | Mean | Max | Over 120 |
| --- | ---: | ---: | ---: | ---: |
| Headers **before** | 286 | 133.9 | 730 | 126 |
| Headers **after** | 286 | **69.8** | **120** | **0** |
| Footers **before** | 107 | 270.7 | 588 | 106 |
| Footers **after** | 107 | **89.8** | **117** | **0** |
| All rows **after** | 393 | 75.2 | 120 | 0 |

The counts are the point as much as the means: **286 headers before, 286 after; 107 footers
before, 107 after.** No row was deleted and no row was created, which is the first half of the
tree-identity proof.

The before figures are a little under the ticket's headline (135 / 757 and 276 / 596). The
ticket's numbers were measured at the top of the story; T-005-02, T-005-03 and T-005-04 landed
in between and each trimmed a few rows on the way past. `rows-before.tsv` in this directory is the
baseline actually used, taken against the tree as it stood when writing started.

Two independent counting paths agree, which is the test strategy the plan committed to:

```
$ npm run check
by field:  operation cell 0 · step body 656 · prose row 0 · slack reason 0 · ingredient note 17
all 658 file(s) draw a table.
```

`prose row 0` comes from `measure()` in `scripts/check-recipes.mjs`; the table above comes from
`dump-rows.mjs stats` calling `buildTree` directly. Same number, two code paths.

`step body 656` and `ingredient note 17` are unchanged and out of scope — step bodies are
T-005-06, the ingredient notes are T-005-01's unowned residue. Neither was touched.

---

## 3. Every sentence accounted for

232 rows, split into sentences, each sentence given one of three destinations:

| Destination | Sentences | |
| --- | ---: | --- |
| **Stayed** | 390 | the rewritten rows, all ≤120 chars |
| **Moved to a counter menu** | 52 | + 4 struck as already-moved by T-005-03 |
| **Dropped** | 273 | tagged by reason, below |

Dropped, by reason:

| Tag | Count | What it means |
| --- | ---: | --- |
| `shelf` | 127 | compares this dish to its neighbours — belongs on a counter, but the counter already says it |
| `justify` | 73 | argues the recipe deserves to exist, to a reader who already clicked |
| `echo-slack` | 38 | repeats the `slack:` line printed on the same page |
| `provenance` | 32 | etymology and origin story |
| `meta` | 3 | talks about the site rather than the food |

The full per-row record is `decisions-*.tsv` in this directory — one line per row, five shelves,
columns: path, step, the row as written, where a sentence moved, the drop tags, the counter note.
`rows-after.tsv` carries the same 232 rows with the original text in full alongside the rewrite,
so any single judgement can be read without opening the file.

### The 52 moved, by destination

| Counter · section | Rows |
| --- | ---: |
| The Soup Pot · Old-fire soups (老火湯) — one shared group note | 15 |
| The Soup Pot · Old-fire soups (老火湯) — per-dish notes | 9 |
| Curry House · The sauce list | 6 |
| The Slow Cooker · Braises, left alone all day | 5 |
| The Soup Pot · Quick daily soups (滾湯) | 4 |
| Curry House · Starters and the tray | 4 |
| Pizzeria · By the slice, Curry House · The spice shelf, Curry House · Rice | 2 each |
| The Bowl Shop · Leafy salads, Japanese Home Cooking · The soup and the rice, Curry House · Tandoori | 1 each |

52 moved rows produce **37** entries in `counters.json`, because the 15 Cantonese old-fire soups
were all saying a version of the same thing and collapse into one section-level note rather than
fifteen near-duplicates. 52 − 15 = 37, which is the row count of `notes.tsv` and the note count
the validator sees.

### No sentence moved twice

T-005-03 moved four, quoted exactly in its `progress.md` §Step 8:
`boston-baked-beans-slow-cooker`, `baked-turkey-wings-slow-cooker`,
`new-england-boiled-dinner-slow-cooker`, `soy-sauce-chicken-slow-cooker`. All four appear in
`decisions-*.tsv` with the destination column reading `T-005-03 already moved it` — the sentence
was **struck** from the row, not re-added to a counter. Verifiable:

```
$ cat decisions-*.tsv | awk -F'\t' '$4 ~ /T-005-03/' | wc -l
4
```

### Reasoning, on a sample

- `stews-and-braises/balti` — *"A thin steel bowl over a high flame is the recipe: it is what
  lets this finish in ten minutes."* Kept in the row: it changes the pan you reach for. The
  Birmingham-not-Baltistan sentence is `provenance` and went to *Curry House · The sauce list* as
  "the only line here finished with fresh mint, and the only one cooked fast in a thin steel bowl"
  — true on the shelf, where the other nine curries are visible.
- `rice-beans-and-grains/boston-baked-beans-slow-cooker` — the collection's worst row at 730
  characters. The crock-versus-bean-pot comparison was already on the shelf via T-005-03, so it
  was struck rather than moved. What is left is what happens at the stove.
- `soups/*` — nineteen Cantonese soups shared a footer word for word: *"The broth is the dish. The
  solids — 湯渣, tong zaa — are spent by the end…"* It is true, it is useful once, and printed
  nineteen times it is furniture. One section note on *Old-fire soups*, and each recipe keeps only
  what is specific to its own pot.

---

## 4. Rows that repeated the `slack:` line

`slack-echo.mjs` scored every (row, slack reason) pair on shared content stems and flagged
everything over a deliberately low threshold; `slack-echo.txt` is its output. **37 rows** were
then judged by hand to be saying the same thing as the `slack:` line printed beneath them. **In
every one of the 37 the row is what went and the `slack:` line was kept** — T-005-04 had just
rewritten those lines to one breath each, and a row that duplicates one is the cheaper thing to
lose.

The full list is `decisions-*.tsv` filtered on the `echo-slack` tag. The heaviest shelf is
`stews-and-braises` (16 of the 37). Named in full:

```
custards-and-puddings/peach-cobbler      dressings-and-dips/lime-pickle
dumplings-and-rolls/samosa               eggs/shakshuka
eggs/tortilla-espanola                   fried-and-crispy/chicken-parmigiana
fried-and-crispy/country-fried-steak     fried-and-crispy/fried-chicken
fried-and-crispy/karaage                 fried-and-crispy/nanbanzuke
noodles/beef-stroganoff                  pasta/one-pot-pasta
rice-beans-and-grains/arroz-con-pollo    rice-beans-and-grains/butter-beans
rice-beans-and-grains/paella             rice-beans-and-grains/teriyaki-chicken-bowl
soups/gumbo                              soups/ham-hock-stock
soups/sancocho                           soups/tonkotsu-broth-instant-pot
stews-and-braises/baked-turkey-wings     stews-and-braises/baked-turkey-wings-slow-cooker
stews-and-braises/beef-bourguignon-instant-pot   stews-and-braises/beef-stew-instant-pot
stews-and-braises/beef-stew-slow-cooker  stews-and-braises/braised-short-ribs-slow-cooker
stews-and-braises/cachete-slow-cooker    stews-and-braises/chicken-and-dumplings
stews-and-braises/chili-con-carne-instant-pot    stews-and-braises/collard-greens-instant-pot
stews-and-braises/corned-beef-instant-pot        stews-and-braises/hungarian-goulash-instant-pot
stews-and-braises/new-england-boiled-dinner      stews-and-braises/osso-buco-slow-cooker
stews-and-braises/oxtails                stews-and-braises/oxtails-instant-pot
stews-and-braises/oxtails-slow-cooker
```

`tonkotsu-broth-instant-pot` is the story's worked example and the tool found it, which is the
check the plan set for the threshold being low enough.

---

## 5. Footers that are really unwritten cooking steps

**None of these was promoted to a step.** Each was shortened in place and stays a footer; the tree
is unchanged. This list is the finding the ticket asked to be handed on rather than re-derived.

The test applied: an imperative verb, a thing to do it to, and either a duration or a doneness
cue — *and nothing in the operation cells above it already says so*. That last clause was checked
against the recipe's actual operation labels, not assumed.

| File | Verb | The operation hiding in the prose |
| --- | --- | --- |
| `pasta/fresh-egg-pasta` | toss | finish the drained pasta in the pan of sauce with its water, ~30 sec |
| `stews-and-braises/meatballs` | fry | a test teaspoon of the mix, taste it before rolling the rest |
| `stews-and-braises/meatloaf` | rest | 10 min before cutting |
| `noodles/macaroni-and-cheese` | rest | 10 min before cutting |
| `custards-and-puddings/peach-cobbler` | cool | 30 min before spooning out |
| `custards-and-puddings/sweet-potato-pie` | cool | fully, before cutting |
| `fried-and-crispy/fried-chicken` | drain | on a rack, not paper |
| `fried-and-crispy/fried-okra` | salt | the moment it leaves the fat, while the surface is wet |
| `soups/dashi` | simmer | the spent kombu and flakes again, 10 min, for niban dashi |
| `rice-beans-and-grains/butter-beans` | mash | a ladleful against the pot and stir it back in |
| `eggs/tortilla-espanola` | rest | 5 min before cutting (the flip *is* an operation; the rest is not) |
| `pasta/skillet-lasagna` | push / stir | noodles under the liquid, one stir at the 10-min mark |
| `sauces-and-gravies/cream-gravy` | thin | a splash more milk at the last moment |
| `vegetables-and-sides/creamed-corn` | loosen | a splash of water if it tightens before service |
| `soups/ham-hock-stock` | stir | the picked meat back into the pot the stock goes to |

Fifteen. Two more are **timing qualifiers on an operation that does exist**, listed separately so
the next person does not double-count them: `breads/garlic-knots` (the butter toss is step 5; the
one-minute window is not in it) and `soups/sancocho` (step 3 says *skimmed*; the second skim
before the vegetables go in is not).

Eight candidates were rejected on the "nothing above says so" clause after checking the operation
cells: `chicken-and-dumplings` (step 5 already says covered, 15 min), `chicken-cacciatore` (step 5
is *Reduce uncovered … 8 min*), `one-pot-pasta` (step 3 says *stirring along the bottom*),
`arroz-con-pollo` (step 4 *undisturbed*, step 5 *fold*), `beef-stroganoff` (step 5 *off the
heat*), `dressings-and-dips/paneer` (step 4 *is* the press), `salads/spinach-salad` (step 6
*tossing once*), `new-england-boiled-dinner` (a doneness qualifier on step 1's simmer).

**Recommendation for whoever picks this up:** fifteen recipes are missing a real operation, most
of them a rest or a cool at the end. Promoting them changes the merge tree, the column count and
every mobile measurement T-004 took, so it is a story of its own and not a follow-up commit.

---

## 6. Proof the tree did not move

The strong proof, not a summary statistic — `dump-rows.mjs cols` writes one line per recipe
carrying the root column count, leaf count, header count, footer count, and every operation's
`stepIndex:col:row:rowSpan`:

```
$ diff cols-before.txt cols-after.txt
$ echo $?
0
```

658 lines, byte-identical. Every operation is in the same column, the same row, with the same
rowspan, in every recipe. Both files are in this directory.

Backed by:

- `all 658 file(s) draw a table.` — `findTilingErrors` over the whole collection, still clean.
- `operation cell 0` in `npm run check` — no operation label went over its cap, and by
  construction none was edited: the applier writes only `step.N` lines belonging to steps with no
  ingredients and no refs, and body paragraphs of those same steps.
- Header count 286 → 286, footer count 107 → 107 (§2).

---

## 7. Verification, run in this attempt

| Criterion | Command | Result |
| --- | --- | --- |
| every prose row at or under the cap | `npm run check` | `prose row 0` |
| `findTilingErrors` holds | `npm run check` | `all 658 file(s) draw a table.` |
| the merge tree is unchanged | `diff cols-before.txt cols-after.txt` | empty, exit 0 |
| the suite and the build | `npm run verify` | **9 files, 833 tests passed**, 682 pages built |
| the phone | `npm run verify:mobile` | **exit 0** — see below |
| only prose rows and `counters.json` | `git diff --name-only 84e068a..HEAD` | 183 `.cook` + `counters.json` |

```
$ npm run verify:mobile ; echo exit=$?
2046 page views at 375px, 390px, 768px — nothing scrolls sideways.
2046 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px, the table says
when it continues, and the pinned column stays below 44rem.
exit=0
```

Full log: `verify-mobile.log` in this directory.

### The mobile result generation 1 left behind

Generation 1's `mobile.log` records `exit=1` and seven pages scrolling sideways at 390px and
768px — `onion-tomato-masala`, `chintan-broth`, `jollof-rice`, `thai-green-curry` among them.
Every one of the seven reports the offender as a `<code>` element reaching 1000–3000px, which is
the collapsed source dump, not a prose row. The plan anticipated exactly this: T-005-03 recorded
that a build running concurrently makes the overflow scan read a half-written `dist`. Generation 1
re-ran it against a frozen root and got `overflow exit=0`, then was killed before the touch scan
finished.

Re-run clean in this attempt, both scans pass over all 2046 page views. The seven were a scan
artifact. **No prose row causes horizontal scroll at any of the three widths.**

---

## 8. Test coverage, and the gap

**No new vitest file, and that is a decision** — the same one T-005-01, T-005-03 and T-005-04
made. This ticket ships no code. The 833 existing tests under `src/lib/` cover the pure libraries
that parse and tile, and they are what proves an edited `.cook` file still parses and tiles the
same way. They pass.

What is covered:

- **The measurement** — two independent paths (`check-recipes.mjs`'s `measure()` and
  `dump-rows.mjs`'s `buildTree`) agree at every step. A miscount would have to be made twice, the
  same way, in two files.
- **The tree moving under an edit** — `cols-before` vs `cols-after` over all 658 recipes, plus
  thirteen per-file guards in the applier that restore the original and abort on the file that
  caused the problem.
- **The counter notes** — `parse-recipes.mjs` validates cap, non-empty note, and that an `of:`
  slug is both listed in the section's `items` and actually shelved at that counter. All 37 pass;
  the menu pages build.

**The gap, stated plainly: no test can check whether a shortened row still says the useful
thing.** 232 rows were judged by hand. The mitigation is that the judgement is data, not prose —
`rows-after.tsv` carries the original and the rewrite side by side for all 232, and
`decisions-*.tsv` carries the disposition of every sentence. A reviewer who disagrees with a call
can find it in one grep. That is the deliverable; it is not a substitute for a human reading it.

---

## 9. Open concerns

1. **`progress.md` was never written.** Generation 1 was cut off during verification, so the
   Implement phase has no narrative artifact. The record is not lost — seven commits, the five
   `decisions-*.tsv`, `rows-before.tsv`, `rows-after.tsv` and both `cols` dumps are all here — but
   a reviewer looking for `progress.md` will not find one. Not worth a re-run to fabricate after
   the fact.

2. **`src/lib/counters.ts` still types a section as `{ title, items }`,** with no `notes` field,
   and `[counter].astro` carries a local cast to work around it. T-005-03 recorded this as a
   recommendation and it is still open. This ticket added 37 notes through that gap. It is not in
   this ticket's file list and was correctly not touched, but the second ticket to add data
   through an untyped field is a good moment to say so out loud.

3. **Fifteen recipes are missing a real operation** (§5). Deliberately not acted on here.

4. **`step body 656` and `ingredient note 17` remain over cap.** Both out of scope — T-005-06 owns
   the step bodies, and the 17 ingredient notes are T-005-01's unowned residue. Recorded so the
   next `npm run check` reader knows they are known rather than new.

5. **Nothing here is a blocker.** No row required losing a fact with nowhere to go, the column
   dump is identical, and the counters validator accepted every note first time.

---

## 10. What a human should look at

In order, if time is short:

1. `decisions-*.tsv`, the `justify` column — 73 sentences were dropped for arguing the recipe
   deserves to exist. That is the largest judgement call in the ticket and the one most likely to
   have taken something with it.
2. The nineteen Cantonese soups collapsing to one shared section note (§3). It is right, and it is
   the most aggressive single move.
3. §5's fifteen recipes. That list is the next story.
