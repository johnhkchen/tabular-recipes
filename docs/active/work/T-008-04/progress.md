# T-008-04 — Progress

Twenty-one files written, all committed through `lisa commit-ticket`. `npm run verify` exits 0.

---

## Steps, as planned and as they went

| step | planned | done | commit |
| --- | --- | --- | --- |
| 1 | `air-fryer-chicken-wings`, settle the shape | yes | `1d2ed62` |
| 2 | the 7 remaining standalones | yes | `ddc6f31` |
| 3 | the 5 vegetable variants | yes | `a7057a7` |
| 4 | the 8 protein and potato variants | yes | `37685a5` |
| — | **unplanned:** reword every operation cell to a known verb | yes | `ca4018e` |
| 5 | `npm run verify` over the whole collection | yes | — |
| 6 | the work artifact | this file, then `review.md` | — |
| 7 | hand off clean | `git status --porcelain` shows nothing ticket-owned outstanding | — |

## Deviation 1 — the icon coverage test, which the plan did not see coming

**What happened.** `npm run verify` failed at `src/lib/icons.test.ts:273`, *"recognises every verb
the recipes open an operation with"*. Fifteen verbs my cells opened with had no entry in
`VERB_ICONS`:

> at, blot, break, cube, dry, honey, lemon, lift, onion, parsley, probe, serve, shake, slick, tip

Every one was mine. The test's own message says *"Add them to `VERB_ICONS` in `src/lib/icons.ts`, or
leave them here deliberately"* — and **this ticket may not touch `src/`**, so neither branch of that
advice was available.

**What I did.** Reworded 48 lines across 20 files so every operation cell opens with a verb the map
already knows. The substantive ones:

| was | is | why the new one is not worse |
| --- | --- | --- |
| `shake at halfway — …` (10 files) | `toss the basket at halfway — …` | Tossing the basket *is* the shake. `toss` → the stir icon, which is what the picture should be. |
| `probe the thickest part — 74°C` | `cook to 74°C (165°F) at the thickest part` | States the same non-negotiable number as an instruction rather than as a gesture. |
| `blot hard, cube, and stand 10 min` | `pat hard, cube, and stand 10 min` | Same action, the collection's word for it. |
| `serve straight from the basket` | `scatter the cilantro, sauce alongside` | Says what the hands do instead of what the meal is. |
| `honey straight from the jar` | `spoon the honey over at the table` | Ditto. |
| `lift a corner at four minutes` | `peel a corner up at four minutes` | Ditto. |

**The judgement, recorded because it is arguable:** `shake` is the air fryer's own verb and the gap
page asked for *"a shake convention… one operation written the same way everywhere."* I have written
one — it is just spelled `toss the basket`, because the alternative was a failing build or an
out-of-scope edit to `src/lib/icons.ts`. **Adding `shake: 'stir'` to `VERB_ICONS` is a one-line
change and the right one**; it is recorded in `review.md` §6 alongside the `~air fry` note.

## Deviation 2 — six over-cap lines, fixed as they appeared

Five operation cells and four prose rows came in over the caps in `check-recipes.mjs`. All were
trimmed rather than argued about; none needed a fact dropped. The tightest surface is the 70-char
operation cell, which has to hold a temperature, a range, a load and sometimes a cue — that is the
real constraint on this shelf's file shape and it is why the doneness cue got its own operation.

## Deviation 3 — one file under the ingredient-row floor

`air-fryer-padron-peppers` is **4 ingredient rows** against the ticket's 5–16. Padrón peppers are
peppers, oil, salt and a wedge of lemon; a fifth row would be padding to hit a number, which is the
opposite of what the rest of this shelf does. The checker's own floor is 3 and it clears that. This
is the "or the work artifact says why not" case, and this is the why not.

## Not done, and deliberately

- **Ranks 21–26, the pot half.** Not this ticket's.
- **Seekh kabab, crispy roast potatoes, bacon, pork belly and the breaded block.** Ranked out;
  counts and bars in `review.md` §4.
- **A second reheat file.** The gap page's position is that reheating has no home in a table at
  all; one dish that genuinely merges answers both that and the ticket's "one or two".
- **`docs/gaps/air-fryer-and-pot.md`** still reads *0 recipes*. T-008-05 owns the update, and
  `menu-sections.mjs --write` must not be run against it while the item lists are empty.

## Where it stands

```
node scripts/check-recipes.mjs recipes/*/air-fryer-*.cook   →  all 21 file(s) draw a table
npm run check                                               →  all 685 file(s) draw a table
npm run recipes                                             →  parsed 685 recipe(s), washing-up in 177
npx vitest run                                              →  1005 passed (13 files)
npx astro build                                             →  710 page(s), /menu/air-fryer-and-pot now builds
git status --porcelain | grep recipes/                      →  (empty)
```

`/menu/air-fryer-and-pot/index.html` exists in `dist/` for the first time. Before this ticket the
counter had `menu.count === 0` and `src/pages/menu/[counter].astro` filtered it out entirely.
