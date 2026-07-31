# T-001-10 — Review

**Disposition: pass.** Thirteen recipes written, both acceptance counts cleared with margin,
one pre-existing test failure found and attributed to other work.

## What changed

Thirteen files created under `recipes/**`. Nothing modified, nothing deleted, nothing
outside `recipes/**`.

| Path | Rows × cols |
| --- | --- |
| `recipes/spice-blends-and-marinades/adobo-para-al-pastor.cook` | 14 × 5 |
| `recipes/smoked-and-grilled/al-pastor.cook` | 7 × 6 |
| `recipes/smoked-and-grilled/carne-asada.cook` | 14 × 6 |
| `recipes/smoked-and-grilled/pollo-asado.cook` | 13 × 6 |
| `recipes/sauces-and-gravies/salsa-verde.cook` | 9 × 5 |
| `recipes/sauces-and-gravies/salsa-verde-cruda.cook` | 8 × 4 |
| `recipes/stews-and-braises/tinga-de-pollo.cook` | 13 × 4 |
| `recipes/stews-and-braises/chile-verde.cook` | 14 × 5 |
| `recipes/stews-and-braises/lengua.cook` | 9 × 5 |
| `recipes/stews-and-braises/suadero.cook` | 9 × 5 |
| `recipes/stews-and-braises/cachete.cook` | 12 × 5 |
| `recipes/stews-and-braises/tripas.cook` | 10 × 5 |
| `recipes/soups/consome-de-birria.cook` | 8 × 5 |

Seven commits, all through `lisa commit-ticket --ticket-id T-001-10` with exact
`--include` paths: `aa8bfc2`, `cafcbf8`, `5d05f71`, `2e7cd2e`, `5a18f96`, `41322f7`,
`a2d795c`.

## Acceptance criteria, one by one

| Criterion | Evidence |
| --- | --- |
| Taquería shelves ≥ 24 | **33.** `grep -rl 'Taquer' recipes/ \| wc -l` |
| ≥ 18 name it and no other counter | **25.** Was 12; 13 new exclusive files |
| Top of the gap list written, in order | Ranked items **#1–#7 complete**, plus the first entry of the components list. Everything skipped is named with a reason in `progress.md` |
| `check-recipes --labels` reports ok, staircase reads as verbs | All 13 `ok`. Staircases quoted in `progress.md`; e.g. `coat every slice, marinate 12 hr / stack the slices, pineapple on top / roast 325°F 2 hr, then 450°F 20 min / rest 20 min, shave off the block / crisp on the comal 2 min` |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` on every file | All 13 carry all six, plus `time` and per-step labels. Every `aka` has a diacritic-free form (`consome`, `pastor`, `salsa verde crudo`, `taco de cabeza`) |
| Every timer named | Every `~` in all 13 files carries a name, and every name is one `src/lib/time.ts` recognises: `toast`, `soak`, `simmer`, `marinate`, `roast`, `rest`, `sear`, `grill`, `fry`, `poach`, `braise`, `render` |
| Quantities real for the servings | Hand-checked per file; 2–3 lb of meat per 6–8 taco servings, which is the taquería measure rather than the dinner-plate one |
| Canonical method, not a shortcut | Notes below |
| Only `recipes/**` modified | `git status --porcelain recipes/` empty; every commit's `--include` list is `recipes/…` only |

## Where the method was the point, not the shortcut

- **Al pastor** is the loaf-tin version and says so in step 2's prose, because the gap doc
  is explicit that a trompo has no final operation and a home version "is a different dish
  and should say so". It still marinates 12 hours in a real chile-and-achiote adobo, roasts
  under a pineapple crown, and finishes shaved and crisped — the shape of the thing, not a
  skillet of chile-powdered pork.
- **Suadero** is a confit — 1 lb of lard, barely shivering, two hours — not a braise in
  water. The step text says "the fat should shiver rather than spit" for exactly that reason.
- **Tripas** spends its first operation on cleaning and its second on a milk simmer, which
  is the difference between the dish and the reason people say they do not like it.
- **Lengua** is peeled hot, because it cannot be peeled cold.
- **Consomé** starts *from* the braise as its own ingredient row rather than branching off
  `birria-de-res` — one preparation cannot have two endings, and `layout.ts` refuses it.
- **Salsa verde** is deliberately the four-step mirror of the existing `salsa-roja`, because
  the board prints the pair on one line.

## Test coverage

There are no unit tests to write here — the artefacts are data files, and the collection's
tests are the coverage.

**Run and passing:**

- `node scripts/check-recipes.mjs` over the whole collection — **all 410 files draw a
  table.** This is the per-file gate the acceptance criteria name: metadata, tree shape,
  tiling, counter names, the 3-row/3-column floor, empty labels.
- `npm run recipes` — **410 recipes, 410 counters named, 0 inferred, 347 pairings.** This is
  the only thing that proves the new `>> counters:` and `>> pairs-with:` lines resolve;
  dangling pairings and unknown counters are build errors, invisible to the per-file checker.
- `npx vitest run src/lib/collection.test.ts` — **passes.** Slug uniqueness, mutual
  pairings, one plain way per dish, and the timer rules (nothing unreadable, nothing
  claiming four unbroken hands-on hours).

**Run and failing, pre-existing:**

- `npx vitest run src/lib/icons.test.ts` — **fails** on "recognises every verb the recipes
  open an operation with". 46 verbs across the collection fall through to the plain bowl.
  **None of them is from this ticket** — verified by running `matchOperation` over the
  leading verb of every operation label in the 13 new files, which reports zero
  fall-throughs. The failing verbs come from other counters' in-flight and already-landed
  work: `velvet` (`orange-chicken`, `sesame-chicken`, `beef-with-broccoli`), `ribbon`
  (`egg-drop-soup`, `hot-and-sour-soup`), `bruise` (`som-tum`), `tare` and `noodles` (the
  ramen files), `the` and `this` (nine curry-house files), and so on. Three of those files
  — `orange-chicken`, `egg-drop-soup`, `som-tum` — exist at this ticket's base commit
  `4abb4cf`, so **the test was already red before this ticket started.**

**Not run:** `npm run verify` in full. It builds the site and runs the whole suite over
`src/`, which three other tickets are actively changing; a failure there would not be
attributable to this work, and the two collection tests that this ticket could plausibly
break were run individually instead.

## Open concerns

1. **The icon coverage test is red for the collection as a whole.** Not this ticket's to
   fix — the remedy is either a `src/lib/icons.ts` change (owned by another ticket; `src/`
   is out of bounds here) or rewording other counters' recipes. Flagged because whoever runs
   `npm run verify` next will meet it, and because it will keep growing as counters fill.
   The scan that attributes it, verb by verb and file by file, took about ten lines and is
   worth keeping around.
2. **The new recipes are not yet on the rendered Taquería menu.** `src/data/counters.json`
   still lists the old six sections with two fillings in them. That file is T-001-17's, by
   the ticket's own instruction. The recipes *are* at the counter — `>> counters:` is what
   `parse-recipes.mjs` reads and what the acceptance criteria count — but a visitor
   browsing the menu page will not see them until T-001-17 runs. If T-001-17 is the last
   thing to run before a deploy, that is fine; if not, the counter renders a menu that is
   behind its own shelf.
3. **`docs/gaps/taqueria.md` is now stale in the other direction.** Its "What it is
   missing" list still names all thirteen of these. It is not this ticket's file to edit and
   `scripts/menu-sections.mjs` lifts section names out of it, so an edit there would reach
   into T-001-17's input.
4. **Two items recorded for T-001-18** rather than done here, per the ticket's instruction:
   adding the Taquería to `rice-pudding`'s counters (it is *arroz con leche*, gap item #22),
   and the shared toasted-chile purée, which only pays off if `birria-de-res`,
   `red-enchilada-sauce` and `mole-poblano` are rewritten to use it.
5. **`salsa-verde-cruda` is the thinnest table in the set** at 3 operations and 4 columns.
   That is the floor, and it is honest — an uncooked salsa is rinse, blend, stir — but it is
   the one file a reviewer might argue should have been a note on `salsa-verde` instead. The
   gap doc's components section asks for both by name, which is why it is here.

## What a reviewer should read first

`recipes/smoked-and-grilled/al-pastor.cook` and
`recipes/spice-blends-and-marinades/adobo-para-al-pastor.cook` together — they are the pair
the whole gap list opens with, and the split between them (component as its own searchable
table, dish taking it as an ingredient row) is the one design decision in this ticket that
could reasonably have gone the other way.
