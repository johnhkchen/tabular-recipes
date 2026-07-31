# T-001-11 — Plan

Four commits, twenty-three files, one verification loop repeated per file and once per wave.

## Verification, defined once

There are no unit tests for recipe content; `scripts/check-recipes.mjs` is the test harness
and the ticket names it. A file is **done** when all four hold:

1. `node scripts/check-recipes.mjs --labels <path>` prints `ok <path>  R rows x C cols`.
2. `R >= 3` and `C >= 3` — implied by `ok`, but read the numbers anyway; `3 rows x 3 cols`
   is a warning sign that a step lost its edge and the tree flattened.
3. The printed staircase reads as **a cook's verbs**: `marinate 12 hr`, `shave and crisp`,
   not `in the with and to`. This is the criterion a green `ok` does not cover, and it is
   why `--labels` is in the acceptance text.
4. **No `cooklang:` note** under the `ok` line. Those are parser warnings — an unclosed
   `@ingredient{`, a `~timer` with no unit — and they print without failing.

Plus two invariants checked by hand per file before running the script:

- every `~timer` has a name, and the name is in `UNATTENDED` or `HANDS_ON` in
  `src/lib/time.ts` (an unrecognised name is silently equivalent to no name);
- `title`, `category`, `tags`, `servings`, `counters` present, and `aka` carries a
  diacritic-free form.

## Step 1 — Wave 1, the six components

Write, in order:

1. `recipes/spice-blends-and-marinades/shawarma-spice.cook`
2. `recipes/dressings-and-dips/labneh.cook`
3. `recipes/dressings-and-dips/white-sauce.cook`
4. `recipes/sauces-and-gravies/pomegranate-molasses.cook`
5. `recipes/toppings-and-pickles/sumac-onions.cook`
6. `recipes/sauces-and-gravies/attar.cook`

Run the checker over all six together with `--labels`. These are the thinnest files in the
ticket and the ones most likely to trip `only 2 ingredient row(s)` or `only one operation`;
finding that on a three-ingredient spice blend is cheaper than finding it on a baklava.

**Commit:** `lisa commit-ticket --ticket-id T-001-11 --message "Write the marinade, the
labneh and the white sauce the spit assumes" --include <the six paths>`

## Step 2 — Wave 2, the spit and the skewers

Write, in ranked order: `chicken-shawarma`, `gyro-meat`, `falafel`, `yellow-rice`,
`shish-tawook`, `kafta`.

Specific risks to check as each is written:

- **`chicken-shawarma` and `gyro-meat`** must each carry the "this is not the spit" caveat
  in the prose of the step where the substitution happens, following the edited `al-pastor`.
  Two different methods, not one method twice: marinated whole slices stacked and shaved
  versus ground meat emulsified and pressed. If they come out reading the same, one of them
  is wrong.
- **`falafel`**: dried chickpeas **soaked and never cooked**. A canned-chickpea falafel is
  the shortcut wearing the name that criterion 6 forbids, and the gap doc flags this dish
  specifically as the one whose method surprises people.
- **`yellow-rice`**: turmeric, not saffron. The gap doc is explicit.
- **`shish-tawook` and `kafta`** both risk collapsing to three steps. Tawook needs the
  marinade whisked as its own operation; kafta needs the chill between working and
  skewering, which is also the step that stops it falling off the skewer.

Checker over all six. **Commit:** `... --message "Load the spit and the skewers the counter
is named for" --include <the six paths>`

## Step 3 — Wave 3, the sides

Write: `fattoush`, `kabis`, `batata-harra`, `ful-medames`, `kibbeh`.

- **`fattoush`** references `pomegranate-molasses` from wave 1 in `pairs-with` — confirm the
  slug on disk before writing the line.
- **`batata-harra`**: tossed **off the heat**. Raw-ish garlic and cilantro hitting hot oil is
  the version that is not the dish.
- **`kabis`**: the pink is beet. One beet wedge in the jar, not dye and not much beet.
- **`kibbeh`**: fine bulgur ground *with* the meat until it is a paste — that is the dough,
  and there is no separate dough file by design.

Checker over all five. **Commit:** `... --message "Fill the sides — the bread salad, the
pickle plate, the potatoes, the bean and the torpedo" --include <the five paths>`

## Step 4 — Wave 4, the bakery half and the sweets

Write: `manakish`, `lahm-bi-ajeen`, `fatayer`, `sambousek`, `baklava`, `maamoul`.

- **`manakish` and `baklava`** carry `counters: Shawarma Counter, Bakery` — the only two
  that name a second counter, each because `docs/gaps/bakery.md` asks for it (lines 69 and
  79). Every other file in the ticket names this counter alone.
- **The four doughs must be four different doughs**, per the design: enriched for fatayer,
  short and unleavened for sambousek, pita-style for manakish, the same rolled thinner and
  docked for lahm bi ajeen.
- **`baklava`**: cut *before* baking, and cold syrup onto the hot tray. Which way round is
  the trick and it goes in the prose. Bought filo, stated as bought.
- **`maamoul`**: the semolina rests overnight with the butter before any liquid. Skipping
  that is why home maamoul comes out sandy.

Checker over all six. **Commit:** `... --message "Write the bakery half of the mezze list
and the two sweets" --include <the six paths>`

## Step 5 — whole-collection verification

```
node scripts/check-recipes.mjs                       # all 405 files
grep -rl "Shawarma Counter" recipes/ | wc -l         # expect 44
grep -h '^>> counters:' $(grep -rl "Shawarma Counter" recipes/) \
  | sed 's/>> counters: *//' | grep -c '^Shawarma Counter$'   # expect 36
git status --porcelain                               # expect: no recipes/ entries
```

The last one is the real check on criterion 7 ("Only `recipes/**` is modified") *and* on the
commit discipline: after four `lisa commit-ticket` calls, no ticket-owned file may remain
modified, staged or untracked. Work artifacts under `.lisa/attempts/` are Lisa's to publish
and are expected to show.

Acceptance arithmetic, restated so the numbers can be checked rather than trusted:

| | before | after | required |
| --- | --- | --- | --- |
| shelved at Shawarma Counter | 21 | **44** | ≥ 26 |
| naming it and no other | 15 | **36** | ≥ 18 |

## Step 6 — Review

`review.md` covering: the twenty-three files, the acceptance arithmetic above, the
verification output, and — required by criterion 2 — **every skipped dish named with its
reason**:

- `chicken-over-rice` (item 4), `loaded-fries` (item 21), combo plate, mezze-as-a-meal —
  ruled out by the gap doc's own "What it could not stock", quoted.
- `makdous` (item 20) — same section, weeks under oil.
- The Greek and Turkish set (items 15–19) and the drinks (item 22) — deferred below the
  stopping line, with the `docs/knowledge/counters.md` Gyro Shop split as the reason for
  the Greek half specifically.
- Components left unwritten (falafel mix, tawook marinade, kibbeh dough, filo, thin red hot
  sauce, amba) with the rule that decided each.

Then `review-disposition.json`, then `lisa check-disposition T-001-11`, then stop.

## What would make this block

Named now so the judgement is not made under pressure later:

- A dish that will not tile without being written dishonestly — padding a spice blend with
  ingredients it does not have to reach three rows. Correct response: drop the file and
  name it as skipped, not pad it.
- `check-recipes.mjs` failing on a file this ticket did **not** write. That is someone
  else's file and out of scope; record it in review as an observation, do not fix it.
- A wave-1 slug turning out to collide with a file another ticket adds concurrently. The
  DAG says T-001-11 depends only on T-001-01, and Research confirmed all 60 candidate slugs
  absent, so this is unlikely — but a collision is a missing dependency edge and a block,
  not something to resolve by renaming.
