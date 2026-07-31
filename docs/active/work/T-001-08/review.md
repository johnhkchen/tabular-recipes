# T-001-08 — Review

The Ramen Shop had ten recipes, nine of them its own, no broth, no noodle, no topping and no
protein. It now has **27, of which 26 name it and no other counter**, and the board's
organising principle — choose the broth first — is written down.

## What changed

Seventeen files created. Nothing modified, nothing deleted, nothing outside `recipes/**`.

| File | Rows × cols | Commit |
| --- | --- | --- |
| `recipes/soups/dashi.cook` | 3 × 4 | `8d794eb` |
| `recipes/soups/tonkotsu-broth.cook` | 9 × 5 | `8d794eb` |
| `recipes/soups/chintan-broth.cook` | 9 × 5 | `8d794eb` |
| `recipes/sauces-and-gravies/shoyu-tare.cook` | 7 × 4 | `154bb1b` |
| `recipes/sauces-and-gravies/shio-tare.cook` | 7 × 5 | `154bb1b` |
| `recipes/sauces-and-gravies/miso-tare.cook` | 10 × 4 | `154bb1b` |
| `recipes/sauces-and-gravies/mayu.cook` | 3 × 4 | `154bb1b` |
| `recipes/stews-and-braises/chashu.cook` | 11 × 5 | `c289d00` |
| `recipes/noodles/ramen-noodles.cook` | 6 × 6 | `c289d00` |
| `recipes/toppings-and-pickles/ajitama.cook` | 6 × 4 | `2262941` |
| `recipes/toppings-and-pickles/menma.cook` | 8 × 4 | `2262941` |
| `recipes/noodles/tonkotsu-ramen.cook` | 10 × 5 | `ebb1331` |
| `recipes/noodles/shoyu-ramen.cook` | 11 × 5 | `ebb1331` |
| `recipes/noodles/shio-ramen.cook` | 11 × 5 | `ebb1331` |
| `recipes/noodles/miso-ramen.cook` | 14 × 7 | `ebb1331` |
| `recipes/dumplings-and-rolls/gyoza.cook` | 17 × 6 | `7631a5a` |
| `recipes/fried-and-crispy/karaage.cook` | 12 × 6 | `9cd4e0a` |

Two new folders, and therefore two new categories: **Toppings & Pickles** (`ajitama`,
`menma`) and **Fried & Crispy** (`karaage`). Research §7 found no existing folder for either
kind of thing — an egg is not a dressing, and a fried plate that is not a parcel had nowhere
to go. `fried-and-crispy` is where tonkatsu, korokke, agedashi tofu and takoyaki land when
gap items 11, 14 and 16 are written; it holds one file today.

## Acceptance criteria

| Criterion | Result |
| --- | --- |
| ≥18 recipes at Ramen Shop, ≥14 exclusive | **27 / 26** — recounted from `grep -h '^>> counters:' recipes/*/*.cook` |
| Top of `docs/gaps/ramen-shop.md` written, in order | items **1–9** written; 10–18 not reached, listed below |
| `check-recipes.mjs --labels` ok, staircase reads as a cook's verbs | ok for all 17 individually and `all 376 file(s) draw a table` for the collection |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` with a diacritic-free form | all 17, checked mechanically — every `aka` list has ≥5 pure-ASCII entries |
| Every timer named | `grep -n '~{'` over the 17 finds nothing |
| Real quantities for the stated servings; canonical method | see below |
| Only `recipes/**` modified | `git status --porcelain` shows no ticket-owned residue; every commit used exact `--include` paths |

### How far down the ranked list this got

Written: **1** tonkotsu broth · **2** shoyu/shio/miso (as `chintan-broth` plus the three
bowls) · **3** chashu · **4** a bowl of ramen (four of them) · **5** kansui noodles ·
**6** ajitama · **7** gyoza · **8** karaage · **9** menma.

Also written, from the page's own "Components it would need" list, because the bowls are
unmakeable without them: `dashi`, `shoyu-tare`, `shio-tare`, `miso-tare`, `mayu`.

**Skipped, with reasons:**

- **Item 9, the rest of the toppings list.** `nori` is bought in sheets, `naruto maki` is
  bought and sliced, `corn and butter` is two things dropped on a finished bowl, and
  `kikurage` is a 20-minute soak and a knife — one ingredient and no operation, under the
  three-row floor at `check-recipes.mjs:66`. All four appear as ingredient rows in the bowls
  that use them.
- **Aroma oil, two of three.** `mayu` is a recipe — garlic taken past brown to black, thirty
  seconds wide. Chicken fat is not: it is the cap you lift off the chilled chintan, so
  `chintan-broth`'s last step says to keep it and the shoyu and shio bowls call for it by
  name. A file saying "skim the broth you just made" would be one operation and would fail.
- **Items 10–18 — not reached.** Donburi (katsudon, gyudon, oyakodon), tonkatsu, tantanmen,
  tsukemen, mazemen, chahan, korokke, onigiri, edamame, agedashi tofu, takoyaki, wakame
  salad, curry udon, yakisoba, and the drinks. The count was cleared at file 8; files 9–17
  exist so the four bowls are makeable. Item 11 (tonkatsu) is the highest-leverage of these —
  `japanese-beef-curry` is already on this counter with nothing to lay across it — and it
  needs `tonkatsu sauce` and the panko-cutlet method with it.

### Quantities and method

Each bowl is written for **one serving** and its numbers are a real bowl: 350 mL of broth,
140–170 g of fresh noodles, 1½–2 Tbs of tare. The components are written for the number of
bowls they dress (`shoyu-tare` 10, `shio-tare` 12, `mayu` 12) rather than as "one jar".

The canonical method is the point of four of the files and each says so in prose the table
cannot hold: the tonkotsu must stay at a rolling boil or it is grey, not white; the ajitama
is 6:30 from the fridge and an ice bath; the karaage is fried twice at two temperatures; the
gyoza cabbage is salted and wrung dry and pleated on one side only. `tonkotsu-broth` also
says outright that a shop runs 12–18 hours with continuous top-up and that this is the
one-off home version — the thing the gap doc asked the recipe to admit.

## The two structural refusals, and what was done instead

Both come out of `src/lib/tree.ts`: a table is a tree, so one preparation cannot flow into
two later steps, and every branch must end in one final step.

1. **A bowl of ramen as one table.** Written as the gap doc prescribed — five preparations as
   five files, and the bowl as a short assembly table that lists them as ordinary ingredient
   rows. The three poured bowls are 5 columns; `miso-ramen`, which is genuinely cooked in a
   wok, is 7.
2. **A chashu braise that is also the tare.** Two files. `chashu`'s last step says to strain
   and reduce the braising liquid and that two spoonfuls of it season a bowl; `pairs-with`
   links it to `shoyu-tare` in both directions, since the build makes that field mutual.

## Test coverage and gaps

There is no unit test to add — this ticket writes data, and `scripts/check-recipes.mjs` is
its harness. It was run per file before every commit with `--labels`, and over the whole
collection at the end.

What the harness does **not** check, and a human reviewer therefore should:

- **That the food is right.** Nothing validates that 190 g of water to 500 g of flour is 38%
  hydration, that 6:30 gives a jammy yolk, or that 1½ Tbs of shio tare seasons 350 mL of
  broth. These are the numbers a cook would use, but they are unverified by any script.
- **That the three poured bowls are three dishes.** Their staircases are near-identical —
  *tare in · broth in · noodles in · top* — because that is honestly what assembly is. They
  differ in every ingredient row. If a reviewer thinks four bowls is one bowl with a dial,
  that is a judgement call worth making now rather than after T-001-17 shelves them.
- **The two new categories.** Nothing validates a category name, so a typo would have gone
  through silently. `Toppings & Pickles` and `Fried & Crispy` were chosen to match the
  existing ampersand-and-title-case convention.

## Open concerns

1. **The build is currently red, for another ticket's reason.** `node scripts/parse-recipes.mjs`
   exits non-zero on `recipes/dressings-and-dips/birista.cook`, which declares
   `pairs-with: biryani` — a recipe that does not exist. That file came from T-001-09
   (commit `e47bc27`), still running on this branch. Every `pairs-with` slug in this ticket's
   seventeen files was checked against the files on disk and all seventeen resolve. Nothing
   was changed there; it is not this ticket's file.
2. **These recipes will not appear under a Ramen Shop menu section until T-001-17 runs.**
   `src/data/counters.json` still lists five sections with no "Broths" and no "Toppings", and
   that file is T-001-17's. Until then the new files reach the counter through the
   category-grouping fallback in `src/lib/counters.ts` — they are on the counter, just not in
   the right boxes.
3. **`okonomiyaki` still asks for bought `okonomiyaki sauce` and `Japanese mayonnaise`**, and
   `japanese-beef-curry` still makes its roux inline. Both are on the gap doc's component
   list, both sit below where this ticket reached, and changing either file is T-001-18's.
4. **`dashi` and `gyoza` are shelved at Ramen Shop alone**, though dashi underlies half of
   Japanese cooking and a dim sum counter sells its own dumpling. Widening a `counters:` list
   is a judgement about the whole shelf, which is T-001-18's; recorded here so it is not lost.
5. **`>> step.N:` counts prose steps.** Both header rows and operation cells share one
   1-based index over every paragraph in the file. This is not documented anywhere, it
   silently mislabels a file rather than failing it, and it cost the first three files a
   round trip. Worth a line in the knowledge docs, which this ticket does not own.
