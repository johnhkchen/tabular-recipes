# T-001-09 — Progress

Nine steps planned, nine steps done, nine commits. 32 files created, 0 modified, 0 deleted.
Every step ran the loop in `plan.md`: write → `check-recipes.mjs --labels` → read the staircase
→ `grep '~{'` → `lisa commit-ticket`. No step was committed before it printed `ok`.

| Step | Commit | Files | Result |
| --- | --- | --- | --- |
| 0 pilot | folded into 1 | — | all three assumptions held |
| 1 | `8bb0e03` | ginger-garlic-paste, onion-tomato-masala | ok, 5×4 and 11×5 |
| 2 | `e47bc27` | makhani-gravy, vindaloo-paste, paneer, birista | ok, 14×5 / 14×4 / 4×5 / 4×4 |
| 3 | `0d81266` | butter-chicken, korma, rogan-josh | ok, 11×5 / 16×5 / 16×6 |
| 4 | `a47f36c` | bhuna, dopiaza, jalfrezi, karahi | ok, 13×6 / 11×4 / 13×4 / 11×4 |
| 5 | `aae42b0` | madras, vindaloo, dansak, patia | ok, 12×6 / 9×5 / 17×5 / 13×5 |
| 6 | `a8c4de7` | balti, passanda, palak-paneer | ok, 16×5 / 14×5 / 14×5 |
| 7 | `4c216f1` | papadom, mango-chutney, lime-pickle, mint-chutney, kachumber, raita | ok, 8×6 / 10×4 / 8×5 / 10×4 / 10×3 / 8×4 |
| 8 | `1124a79` | samosa, onion-bhaji, chicken-tikka, seekh-kabab | ok, 17×5 / 11×4 / 7×5 / 10×5 |
| 9 | `cb171ad` | biryani, pilau-rice | ok, 19×4 / 11×4 |

## Step 0 — the pilot, and what it settled

Three unproven assumptions from `research.md` §3, all three confirmed on
`ginger-garlic-paste.cook` and `onion-tomato-masala.cook`:

1. **A step whose only content is a `@&(~1)` reference and cookware is an op, not a footer.**
   Confirmed — `isOpStep` is `ingredients.length > 0 || refs.length > 0`. Used in
   `vindaloo-paste` step 2 (grind), `karahi` step 2 (crush), `papadom` steps 3 and 4,
   `palak-paneer` step 2 (blend) and `chicken-tikka` step 3 (grill).
2. **A prose-only closing paragraph becomes a footer row, not a second root.**
   Confirmed — `onion-tomato-masala` checks `ok` at 11 rows × 5 cols with its closing
   paragraph in place. Every one of the 32 files ends this way, which is where the
   sauce-across-protein grid went.
3. **`--labels` prints the staircase.** Confirmed, and it is what steps 4 and 5 were read
   against.

## Deviations from the plan

**One structural fix, caught by the checker exactly where `plan.md` predicted it would bite.**
`dopiaza` step 2 was first written as `Sear @chicken{} in @&(~1)the same pan and fat{}`, which
made step 1's parent step 2 — and step 4 then also reaches back to step 1 for the charred
onions. That is `step 1 is used by two later steps`, the tree-is-not-a-DAG rule. Rewritten so
step 2 takes its own ghee and does not reference step 1 at all, leaving step 1 free to flow
into step 4 where the second onions actually belong. The dish is unchanged; the file now says
in prose what the reference used to say structurally.

**`palak-paneer`'s blanch is written as a steam.** `~blanch{}` is in neither vocabulary in
`src/lib/time.ts`, so naming it that would have classified as nothing. Wilting spinach under a
lid for two minutes is honestly a steam, `~steam{}` is in the unattended set, and the step
still says to run it under cold water straight after. No cooking change.

**`karahi` kept the base.** `design.md` D4 describes karahi as "no onion paste at the end",
which read against `structure.md`'s table could have been taken as writing it without
`onion-tomato-masala` at all. It kept the base — the gap doc lists karahi among the nine lines
the base sits under — and the distinction is carried instead by quartered tomatoes, coarse
hand-crushed kadai masala, ginger cut in sticks and the pan going to the table. Reading the
four staircases from step 4 side by side, the four dishes are four dishes.

No other deviation. Row and column counts came out at or above the `structure.md` estimates on
every file; `kachumber` at 10 × 3 is the thinnest table in the ticket and sits exactly on the
`colCount` floor, which was expected for a salad with one real operation in it.

## Verification, whole-collection, after step 9

```
$ node scripts/check-recipes.mjs
all 410 file(s) draw a table.

$ grep -rl "Curry House" recipes/ | wc -l
47

$ grep -h '^>> counters:' $(grep -rl "Curry House" recipes/) | sort | uniq -c
  47 >> counters: Curry House

$ <the 32 new files> | xargs grep -n '~{'          # unnamed timers
(nothing)

$ npm run recipes
parsed 410 recipe(s) in 22 categories -> src/generated/recipes.json
  counters: 410 named, 0 inferred from category · timers in 389 · pairings 347

$ git status --short -- recipes/ src/
(nothing)
```

410 rather than the 325 counted in Research: other tickets are landing files on the same
branch concurrently. All 410 pass, so nothing this ticket wrote broke anything else's, and
`npm run recipes` resolving proves every `pairs-with` slug in the 32 exists.

`src/generated/recipes.json` is gitignored, so the run left nothing to revert — the plan's
`git checkout --` step was unnecessary and was not run.

## Acceptance criteria, as things stand

| Criterion | Evidence |
| --- | --- |
| ≥22 shelved | **47** |
| ≥20 naming it and no other counter | **47**, one distinct `counters:` line across all of them |
| ranked order, skips named | ranked 1–11 written whole, in order; 12–20 named with reasons in `structure.md` §5 |
| checker ok on every new file | `all 410 file(s) draw a table.` |
| labels read as a cook's verbs | the 32 staircases in the table above, each read at its step |
| title/category/tags/servings/counters/aka on every file | checked field by field across all 32; none missing |
| a form typed without diacritics | no title and no `aka` entry in the 32 contains a non-ASCII character at all |
| every timer named | `grep '~{'` over the 32 prints nothing |
| only `recipes/**` modified | `git status --short -- recipes/ src/` is empty; nine commits, all `recipes/**` |
