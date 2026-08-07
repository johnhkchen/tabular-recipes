# T-008-04 — Plan

Seven steps, each independently verifiable, each a commit through `lisa commit-ticket`. The gate
after every step is the same command; the gate that can actually fail differently is named where it
differs.

---

## The verification loop, once, so the steps can be short

```
node scripts/check-recipes.mjs <the files this step wrote>
```

Passes when every file prints `ok N rows x M cols` **with no indented notes under it**. A note is
not a failure but it is a defect here: the only two that can fire are *cookware the washing-up line
does not account for* and *a washing-up entry that means several things*, and both mean I wrote the
line wrong.

Additional, per file, read off the `ok` line and by eye:

| check | how |
| --- | --- |
| 5–16 ingredient rows, 3–6 operations | `N rows x M cols` — rows is the ingredient count, `M - 1` is the operation count |
| every cell under 70 chars | the checker fails the run if not; `--labels` prints them to read |
| `washing-up` ≤ 2 | count the commas in the line |
| the timer reads unattended | `node -e` over `normalise()`, asserting `attention === 'unattended'` on every `~air fry` timer |

## Step 1 — the first file, which settles the shape

Write `recipes/fried-and-crispy/air-fryer-chicken-wings.cook`.

Rank 1, [ATK] 200°C/400°F, 18–24 min on 2½ lb, range written wide to cover a cold or preheated
machine. It is also the one dish where the sources **disagree on the load** — ATK permits overlap,
WellPlated and Everyday Family Cooking insist on a single layer with space. The file gives the
range, states the load as one layer, and does **not** resolve the disagreement.

Verify: the loop, plus the attention assertion. **This step is where the design is proved or
thrown away** — if `~air fry` reads hands-on here, design §1 option (a) is the fallback and the
remaining twenty files change one word.

Commit: `lisa commit-ticket --ticket-id T-008-04 --message "..." --include recipes/fried-and-crispy/air-fryer-chicken-wings.cook`

## Step 2 — the rest of the standalones (7 files)

`air-fryer-chicken-thighs`, `air-fryer-padron-peppers`, `air-fryer-corn-ribs`,
`air-fryer-frozen-chips`, `air-fryer-frozen-spring-rolls`, `air-fryer-frozen-prawns`,
`air-fryer-reheated-pizza`.

No `dish:` line on any of them, so `parse-recipes.mjs:198` cannot fire. Two things to get right
that step 1 did not exercise:

- **The frozen three must each merge.** A bag of chips is a timing note; a bag of chips plus a mayo
  stirred in the bowl they are tipped into is a table. The checker's `colCount < 3` refusal is the
  test, and it is the reason the section exists in this shape at all.
- **The thighs carry a temperature that is not negotiable** — 74°C in the thickest part — and the
  clock beside it is a range. Both go in, the cue in its own cell.

Verify: the loop over all 7. Expect 4–5 operations each.

Commit: one, all 7 paths on `--include`.

## Step 3 — the vegetable variants (5 files)

`air-fryer-brussels-sprouts`, `air-fryer-broccoli`, `air-fryer-cauliflower`,
`air-fryer-sweet-potatoes`, `air-fryer-chickpeas`.

**First files with `dish:` + `kit:`**, so this is where a build error can first appear. Two of the
five carry an [ATK] number and the other three do not, and the difference has to be visible in the
file: sprouts at **175°C for 20–25 min** (the number ATK reached by testing 200°C and rejecting it)
and broccoli at **175°C for 8–12 min with the equal-parts water-and-oil toss**; cauliflower,
sweet potatoes and chickpeas as ranges anchored on the broccoli method.

Verify: the loop, **then `npm run recipes`** — the first run that can throw on a duplicate plain
file. Expect 685 recipes parsed and the `washing-up in N` count up by the number written so far.

Commit: one, all 5 paths.

## Step 4 — the protein and potato variants (8 files)

`air-fryer-halloumi`, `air-fryer-tofu`, `air-fryer-salmon`, `air-fryer-saba-shioyaki`,
`air-fryer-batata-harra`, `air-fryer-chips`, `air-fryer-chicken-tikka`,
`air-fryer-shish-tawook`.

The three design §3 decisions land here and each must be **argued in its file**, not omitted:

- `air-fryer-chips` drops the 30-minute soak and says what is lost.
- `air-fryer-tofu` drops the 30-minute press and says why the basket can afford to.
- `air-fryer-chicken-tikka` and `air-fryer-shish-tawook` marinate 20 minutes inside the clock and
  say that six hours is better.

`air-fryer-salmon` names its finish temperature and says whose it is — 52°C/125°F, ATK,
medium-rare — because three credible sources give three numbers.

Verify: the loop, then `npm run recipes`.

Commit: one, all 8 paths.

## Step 5 — the whole collection

```
npm run check          # 685 files draw a table, no field over cap
npm run recipes        # parses, no dish/kit throw
npx vitest run         # 867 tests, none of which this ticket should move
npx astro build        # every new file gets a page
```

`npm run verify` runs all four in that order. No commit unless something has to change; if it does,
the fix is committed with the file it fixes.

## Step 6 — the work artifact

`progress.md` as I go; `review.md` at the end. `review.md` carries the things only this ticket
knows and the next person needs:

1. **Every time, with its source**, and the four dishes where sources disagreed, with the spread.
2. **Every dish ranked out**, with its washing-up count and the bar it failed.
3. **The thirteen `dish:` pairings**, named, so the `kit:` calls can be checked without the build.
4. **The `~air fry` note** — one line in `src/lib/time.ts`, out of scope here, and what breaks
   quietly without it.
5. The disagreement with the gap page's drawer call (design §2), recorded and followed anyway.

## Step 7 — hand off clean

```
git status --porcelain    # nothing ticket-owned staged, modified or untracked
```

Then `review-disposition.json`, then `lisa check-disposition T-008-04`, then stop.

---

## Testing strategy

**There are no unit tests to write.** This ticket adds data, not code. The collection's test suite
already asserts the properties that matter about a `.cook` file — `src/lib/washing-up.test.ts` has
seven collection tests that walk every recipe, including *count equals items.length* and *no
variant's `washingUpCount` disagrees with its sibling* — and those tests will pick up all
twenty-one files with no change. That is the right shape: a recipe is checked by the checker and by
the collection tests, not by a test written beside it.

**What the checker cannot test, and how each is covered instead:**

| not testable | covered by |
| --- | --- |
| whether a time is real | every number carries a source in `review.md`; nineteen are ranges with the reason named |
| whether `washing-up` is honest | it is authored, and the count derives from the list — `washing-up.ts` §1 is the whole argument |
| whether the load statement is true | the sourced ATK capacity finding, restated per file, and the servings line declared as a claim about one machine |
| whether the reading of `~air fry` survives an edit | it does not — hence the note in step 6.4. This is the one known fragility and it is written down rather than hidden |

**Rollback:** every step is one commit of new files only. Nothing existing is modified, so any step
can be reverted by deleting its files with no effect on the other 664 recipes.
