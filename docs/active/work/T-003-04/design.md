# T-003-04 — Design

Six decisions, each against the codebase reality in `research.md`. What was rejected is recorded
with its reason.

---

## D1 — The unit of work: 26 files, sized against the table floor, not against the wish list

`docs/gaps/japanese-home.md` ranks **41** candidate dishes. The acceptance criteria want ≥22, with
≥3 per section and ≥5 in each of 煮物 and 小鉢. The binding constraint is not the wish list, it is
`check-recipes.mjs`: **3 ingredient rows and 2 operations minimum**, 5–16 rows and 3–6 operations
as the README's target.

**Options considered**

| | Approach | Verdict |
| --- | --- | --- |
| A | Write all 41 | Rejected. Several cannot clear the floor without padding, and padding a 小鉢 to reach three operations is exactly the "a small recipe is not a lesser recipe" failure the ticket warns about — inverted. |
| B | Write exactly 22, the minimum | Rejected. Zero margin. One file that fails the floor drops a section below its count and the ticket fails on a technicality after all the writing is done. |
| C | **26 core + 2 stretch, chosen for table-shape first** | **Chosen.** 4 files of margin over the floor; every section over its minimum; the two stretch files are written last, only if the core lands clean. |

**Chosen roster.** Section is the one T-003-06 should shelve it under — I cannot write it into
`counters.json` myself (research §1), so it is recorded here and in `structure.md` instead.

| # | Section | Slug | Why it is on the list |
| --- | --- | --- | --- |
| 1 | The soup and the rice | `gohan` | The site has no plain rice at all. Eleven dishes here sit on it. |
| 2 | " | `tonjiru` | The miso soup that is a meal; the winter staple. |
| 3 | " | `sumashi-jiru` | The other half of 汁物, and three ingredients. |
| 4 | " | `takikomi-gohan` | Rice cooked in seasoned dashi; the answer to one piece of chicken. |
| 5 | 煮物 | `nikujaga` | The dish this shelf is missing most. |
| 6 | " | `buri-daikon` | The parboil-in-rice-water step is the recipe. |
| 7 | " | `kabocha-no-nimono` | Four ingredients, one pot, keeps three days. |
| 8 | " | `chikuzenni` | Fried first, then simmered dry. A Sunday batch. |
| 9 | " | `saba-no-misoni` | The miso simmer, and the ginger doing a job. |
| 10 | " | `kiriboshi-daikon` | Pantry to plate; a 作り置き staple. |
| 11 | Grilled & pan-fried | `shogayaki` | The most-cooked pork dish in the country. |
| 12 | " | `saba-shioyaki` | Salt, thirty minutes, a grill. |
| 13 | " | `buri-teriyaki` | Teriyaki made in the pan, not poured from a bottle. |
| 14 | " | `hambagu` | Panko in milk, a steamed finish, a pan sauce. Not a hamburger. |
| 15 | 小鉢 | `kinpira-gobo` | The 作り置き side, and the knife work. |
| 16 | " | `hijiki-no-nimono` | Keeps a shorter time than people assume. |
| 17 | " | `ohitashi` | Two ingredients and a technique. |
| 18 | " | `sunomono` | The vinegar ratio *is* the recipe. |
| 19 | " | `goma-ae` | Ground sesame, sugar, soy. |
| 20 | " | `tamagoyaki` | Written as the dashi version, and the file says which. |
| 21 | 作り置き | `nikumiso` | Keeps a week; goes on rice, tofu, noodles. |
| 22 | " | `nanbanzuke` | Better on day two, which is the point. |
| 23 | " | `mentsuyu` | One bottle that seasons half this shelf. |
| 24 | Rice bowls | `oyakodon` | Two egg pours; the second barely set. |
| 25 | " | `gyudon` | Fifteen minutes. |
| 26 | " | `omurice` | A children's dish adults keep cooking. |
| S1 | 作り置き | `asazuke` | Stretch. The overnight pickle, not the fermented one. |
| S2 | Rice bowls | `chahan` | Stretch. Soy and white pepper, not oyster sauce. |

Counts: **4 · 6 · 4 · 6 · 3 · 3 = 26**, rising to 4 · 6 · 4 · 6 · 4 · 4 = 28 with both stretch
files. Every section clears its minimum with the core alone.

**Rejected dishes, with the reason each was rejected** — this is the part worth reviewing:

- **`ochazuke`** — the gap file's "most honest weeknight recipe". Rice, hot tea, one salted thing.
  It is one operation. Writing it means either inventing a second operation it does not have, or
  folding the grilled salmon in and duplicating `saba-shioyaki`. **A recipe the table cannot hold
  is a finding, not a file.** Recorded for whoever owns 一品 next.
- **`katsudon`** — the cutlet is a component and there is no `tonkatsu` on the site. Writing the
  cutlet inline makes it a two-recipe file, which the README says is two recipes.
- **`korokke`** — same shape: it waits on panko *and* on mashed potato, and the frying is a second
  recipe's worth of operations.
- **`gudakusan miso-soup`** — would be `miso-soup` with different vegetables, and `miso-soup` may
  not be edited. Two near-identical tables is worse than one.
- **`kare raisu` (home version from a roux block)** — three operations, one of which is "open the
  packet". The honest version is a note on `japanese-beef-curry`, which is another ticket's file.
- **`yakitori`, `nikudofu`, `satoimo no nikkorogashi`, `hakusai to aburaage`, `shiraae`,
  `agebitashi`, `onigiri`, `shio koji`** — all writable, all cut for scope. Recorded by name so the
  next pass does not have to re-derive the list.

## D2 — Dashi is one row, and the `pairs-with` edge does the teaching

The ticket is explicit and `research.md` §4 confirms it is free: `pairs-with` is **made mutual at
build time** (`parse-recipes.mjs:90–108`), so `>> pairs-with: dashi` in my file creates the link on
`dashi.cook` without editing it. That is what lets criterion 8 ("no file that existed before this
ticket is edited") and the dashi rule hold at once.

**Decision:** every recipe whose seasoning is dashi-based takes `@dashi{}` as a single ingredient
row, with a note carrying the practical alternative — `(2 cups, 475 mL; or 2 cups water and 1 tsp
dashi granules)` — and carries `dashi` in `pairs-with`. **No file contains kombu and katsuobushi as
ingredients.** Rejected alternative: writing "make dashi (see dashi)" as a full-width prep row,
which spends a row and a column on a cross-reference the metadata already carries.

Sixteen of the 26 will point at `dashi`. `mentsuyu` points at it too and is itself pointed at by
the four sides that can be made from it — the second-order edges the gap file asked for.

## D3 — Ratios: sourced per dish, stated as real quantities, and the disagreements named

The ticket: *"Seasoning ratios are the canonical ones, and the work artifact says where they came
from."* Research §6 has the fetched sources. The design decision is **which ratio governs which
file**, and it is deliberately not one number carried across the shelf.

| Dish(es) | Ratio used | Source |
| --- | --- | --- |
| `nikujaga`, `kabocha-no-nimono`, `kiriboshi-daikon`, `chikuzenni`, `takikomi-gohan` | dashi 10 : soy 1 : mirin 1 : sake 1 | 和食の旨み, which names 肉じゃが by dish |
| `buri-daikon` | water 5 : soy 1 : mirin 1 : sake 1 | same page, 煮魚 section — **water, not dashi**, because the fish's umami goes into the liquid |
| `saba-no-misoni` | the 煮魚 base plus miso whisked in at the end | same, plus the never-boil-miso rule from `miso-soup` |
| `sunomono` | 三杯酢 — vinegar 3 : sugar 2 : soy 1 | SATETO |
| `oyakodon`, `gyudon` | 割り下 — dashi 4 : mirin 1 : soy 1 | 全国味淋協会 |
| `shogayaki` | grated ginger 1 : soy 1 : sake 1 : mirin 1, 2 Tbs each per 400 g pork | macaroni |
| `buri-teriyaki` | soy 2 : mirin 2 : sake 2 : sugar 1 | macaroni / 食べチョク |
| `mentsuyu` | dashi 4 : soy 1 : mirin 1 | 発酵食大学, agreeing with the gap file |
| `ohitashi`, `goma-ae` | 浸し地 — dashi 8 : soy 1 : mirin 1 | 全国味淋協会 |
| `hijiki-no-nimono` | soy 4 Tbs : sugar 2 Tbs : mirin 2 Tbs : water 300 mL, 3–4 servings | macaroni |
| `tonjiru`, `sumashi-jiru`, `tamagoyaki`, `nikumiso`, `nanbanzuke`, `hambagu`, `omurice`, `gohan`, `saba-shioyaki`, `kinpira-gobo` | no ratio claimed | — |

**The last row is the important one.** Ten of the 26 do not get a ratio claim, because I do not
have a dish-named source for one. They get real quantities that work, and the table does not
dress them up as canon. Where a table states a ratio, the ratio is quoted in a `step.N` line or a
prose line so a reader can see the arithmetic against the quantities.

**Rejected:** carrying 10:1:1:1 across everything simmered. The same source that gives it for
vegetables gives 5:1:1:1-in-water for fish, and using the vegetable ratio on `buri-daikon` would
be a fabricated number wearing a citation.

**`gohan`'s numbers**, since it is the file everything else sits on: rinse until the water runs
nearly clear, soak 30 min, **1 : 1.1 rice to water by volume**, boil, 12 min low, **10 min rest off
the heat with the lid on**. The rest is part of the cooking, not a pause. The file says out loud
that most households use a rice cooker and why the table is not about one — `check-recipes.mjs`
rejects a one-operation table, and "use the rice cooker" is one operation.

## D4 — Slack: the level is chosen from the failure, and made-ahead files state the keeping time

`src/lib/slack.ts` gives three levels and requires a reason. The ticket adds: for a made-ahead
side, the reason includes **how long it actually keeps**. Research §6 has three sourced keeping
times and one general guide; the rest are reasoned from the same guide and stated as the guide's
range, never invented tighter than the source.

Assignments, and the failure each names:

- **`unforgiving`** — `oyakodon` (the second egg pour: once it sets it is an omelette on rice and
  there is no unsetting it) · `tamagoyaki` (a pan too hot browns the first layer and every roll
  after it shows) · `saba-shioyaki` (the window between done and dry under a broiler is about a
  minute) · `gohan` (lift the lid during the rest and the steam that finishes the top grains is
  gone).
- **`narrow`** — `shogayaki` (thin loin goes from juicy to grey in under a minute) ·
  `buri-teriyaki` (the glaze burns at the edge of the pan the moment it stops moving) · `hambagu`
  (a patty cooked past the steam finish squeezes its juice out) · `ohitashi` (spinach past thirty
  seconds is a wet rope) · `sunomono` (a cucumber not salted and squeezed waters the dressing
  down within the hour) · `nikumiso` (miso browns and turns bitter over a high flame).
- **`forgiving`** — the 煮物, the soups, and the made-ahead sides, each with its keeping time:
  `kinpira-gobo` (about 3 days, a month frozen) · `hijiki-no-nimono` (3–4 days, 2–3 in summer;
  14 days frozen) · `nanbanzuke` (better on day two) · `mentsuyu` · `kiriboshi-daikon` ·
  `kabocha-no-nimono` · `chikuzenni` · `nikujaga` · `takikomi-gohan` · `tonjiru`.

**Every one of the 26 declares a slack line.** The README is clear that absent is legitimate, and
most of the collection is absent — but this shelf's whole argument is that the fridge is part of
the recipe, so a file here that cannot name its failure has not been thought through. That is a
stricter rule than the repo's, applied to this shelf only, and it is a design decision rather than
a criterion.

## D5 — Where the files sit among 27 category folders, none of which is Japanese-shaped

Category is free text and unvalidated (research §2), and the counter is named explicitly, so
placement affects only how the recipe files itself. **Decision: reuse existing folders and their
canonical category strings; mint no new category.** A `recipes/japanese/` folder would create a
28th category that no counter claims and that duplicates the counter it already has.

| Folder | Category string | Files |
| --- | --- | --- |
| `rice-beans-and-grains` | Rice, Beans & Grains | `gohan` `takikomi-gohan` `oyakodon` `gyudon` `omurice` |
| `soups` | Soups | `tonjiru` `sumashi-jiru` |
| `stews-and-braises` | Stews & Braises | `nikujaga` `buri-daikon` `chikuzenni` `saba-no-misoni` |
| `vegetables-and-sides` | Vegetables & Sides | `kabocha-no-nimono` `kiriboshi-daikon` `kinpira-gobo` `hijiki-no-nimono` `ohitashi` `goma-ae` |
| `smoked-and-grilled` | Smoked & Grilled | `saba-shioyaki` `buri-teriyaki` |
| `stir-fries` | Stir-Fries | `shogayaki` |
| `fried-and-crispy` | Fried & Crispy | `hambagu` `nanbanzuke` |
| `salads` | Salads | `sunomono` |
| `eggs` | Eggs | `tamagoyaki` |
| `toppings-and-pickles` | Toppings & Pickles | `nikumiso` (+ `asazuke`) |
| `sauces-and-gravies` | Sauces & Gravies | `mentsuyu` |

`sunomono` in Salads rather than Vegetables & Sides because it is dressed and eaten cold and the
folder already holds `kabis` — no, that is Toppings; it holds `greek-salad` and `panzanella`, which
is the right company. `shogayaki` in Stir-Fries rather than Smoked & Grilled because the pan is hot
and moving; `saba-shioyaki` the other way because it is under a broiler and still.

**Note for T-003-06:** these placements put six files in `Vegetables & Sides`, a category no
counter claims. That is fine only because every file names its counter. If a later ticket adds
`Vegetables & Sides` to some counter's `categories`, all six land there too.

## D6 — 照り焼き without duplicating `teriyaki-sauce`, and 一汁三菜 without a meal table

**`buri-teriyaki`** makes its glaze in the pan from soy, mirin, sake and sugar, reducing it around
the fish so the fond goes into it. `teriyaki-sauce` is a bottle made ahead and used on anything.
Different tree, different operations, different dish. The file says so in its opening full-width
row, because the gap file asked for it plainly and because a reader arriving from
`teriyaki-chicken-bowl` needs to know which one they are looking at. It does **not** carry
`dish: teriyaki` — `dish`/`kit` is for equipment variants of one dish and these are two dishes.

**一汁三菜 cannot be a table** (the gap file's own finding). The nearest a table gets is
`pairs-with`, and the decision is to use it deliberately rather than decoratively: each main
points at rice and at one or two small sides; each small side points back at a main. Mutuality is
automatic, so I write each edge once. The result is that opening `nikujaga` shows you `gohan`,
`miso-soup` and a 小鉢 — which is the meal, drawn as edges instead of as a page.

Every `pairs-with` target must already exist or be one of my 26 (`parse-recipes.mjs` throws
otherwise). The last batch to be written is the one whose edges close the graph, so the check
order in `plan.md` matters.
