# T-001-09 — Structure

32 files created, 0 modified, 0 deleted. Every path is under `recipes/**`. Nothing in `src/`,
nothing in `docs/gaps/`, no existing `.cook` file touched.

---

## 1. The files

### Components (6) — written first, because nine sauces are rows away from them

| # | Path | Servings | Rows × ops | Consumed by |
| --- | --- | --- | --- | --- |
| 1 | `recipes/spice-blends-and-marinades/ginger-garlic-paste.cook` | 1 cup | 5 × 3 | 14 files + `chicken-tikka-masala` |
| 2 | `recipes/sauces-and-gravies/onion-tomato-masala.cook` | 6 cups | 11 × 4 | 9 sauces |
| 3 | `recipes/sauces-and-gravies/makhani-gravy.cook` | 6 | 12 × 4 | butter-chicken |
| 4 | `recipes/spice-blends-and-marinades/vindaloo-paste.cook` | 1 cup | 12 × 4 | vindaloo |
| 5 | `recipes/dressings-and-dips/paneer.cook` | 12 oz | 4 × 4 | palak-paneer |
| 6 | `recipes/dressings-and-dips/birista.cook` | 1 1/2 cups | 4 × 3 | biryani |

### The sauce list — ranked 1–4 (13)

All in `recipes/stews-and-braises/`, category `Stews & Braises`, 4–6 servings.

| # | Slug | Protein | Base it stands on | The thing that makes it itself |
| --- | --- | --- | --- | --- |
| 7 | `butter-chicken` | chicken thigh | makhani-gravy | charred tikka, butter mounted in cold |
| 8 | `korma` | chicken | own onion-cashew | blanched almond and cashew paste, no tomato, no browning |
| 9 | `rogan-josh` | lamb shoulder | own yogurt braise | Kashmiri chile bloomed in fat for colour; fennel and ginger powder, no onion paste |
| 10 | `bhuna` | chicken | onion-tomato-masala | fried down until the oil breaks out; almost no liquid |
| 11 | `dopiaza` | chicken | onion-tomato-masala | onions twice — in the base and as late wedges |
| 12 | `jalfrezi` | chicken | onion-tomato-masala | high-heat fry, peppers still crunchy |
| 13 | `madras` | chicken | onion-tomato-masala | madras-curry-powder, curry leaf, tamarind |
| 14 | `vindaloo` | pork shoulder | vindaloo-paste | vinegar, overnight marinade, no cream |
| 15 | `dansak` | lamb | onion-tomato-masala | toor dal cooked to purée, pumpkin, sweet-sour |
| 16 | `karahi` | chicken | onion-tomato-masala | tomato and ginger julienne, no onion paste at the end |
| 17 | `balti` | chicken | onion-tomato-masala | finished in the bowl it is served in, mint and coriander |
| 18 | `passanda` | lamb leg | own yogurt-almond | meat beaten flat, cream and almond, mild |
| 19 | `patia` | prawn | onion-tomato-masala | jaggery, tamarind and chile at once |

### The tray and the starters — ranked 5–8 (10)

| # | Path | Category | Servings |
| --- | --- | --- | --- |
| 20 | `recipes/flatbreads-and-pancakes/papadom.cook` | Flatbreads & Pancakes | 8 |
| 21 | `recipes/dressings-and-dips/mango-chutney.cook` | Dressings & Dips | 3 cups |
| 22 | `recipes/dressings-and-dips/lime-pickle.cook` | Dressings & Dips | 2 cups |
| 23 | `recipes/dressings-and-dips/mint-chutney.cook` | Dressings & Dips | 1 cup |
| 24 | `recipes/salads/kachumber.cook` | Salads | 6 |
| 25 | `recipes/dressings-and-dips/raita.cook` | Dressings & Dips | 6 |
| 26 | `recipes/dumplings-and-rolls/samosa.cook` | Dumplings & Rolls | 12 |
| 27 | `recipes/flatbreads-and-pancakes/onion-bhaji.cook` | Flatbreads & Pancakes | 12 |
| 28 | `recipes/smoked-and-grilled/chicken-tikka.cook` | Smoked & Grilled | 6 |
| 29 | `recipes/smoked-and-grilled/seekh-kabab.cook` | Smoked & Grilled | 6 |

`kachumber` goes to `salads/` (with `som-tum` and `larb-gai`) because it is a salad, not a
dip — it is dressed with lime and eaten in spoonfuls. `onion-bhaji` goes to
`flatbreads-and-pancakes/` on the `hush-puppies` precedent: a loose fried batter that is not a
bread and is not a filled parcel. `samosa` is a filled parcel, so it goes to
`dumplings-and-rolls/` with `egg-rolls`. `papadom` is a rolled and cooked lentil round; it
sits with the breads it arrives beside.

### Ranked 9–11 (3)

| # | Path | Category | Notes |
| --- | --- | --- | --- |
| 30 | `recipes/rice-beans-and-grains/biryani.cook` | Rice, Beans & Grains | layered and sealed, consumes `birista` |
| 31 | `recipes/rice-beans-and-grains/pilau-rice.cook` | Rice, Beans & Grains | the default rice |
| 32 | `recipes/stews-and-braises/palak-paneer.cook` | Stews & Braises | consumes `paneer` |

---

## 2. The metadata block every file carries

```
>> title:      Menu spelling, with diacritics where the menu prints them
>> category:   the folder's printed name, exactly as existing files spell it
>> tags:       5 or so, lowercase, always including `indian` and the counter's word
>> counters:   Curry House          # alone, on every one of the 32
>> aka:        the other names, including one typed without diacritics
>> pairs-with: slugs that exist, or that this ticket creates
>> servings:   a number, or a yield for the components
>> time:       total, in the "1 hr 30 min" shape
>> step.N:     wherever the derived label would come out a fragment
```

`counters: Curry House` alone on all 32 satisfies the exclusivity half of the acceptance
criterion by construction: 15 existing + 32 new = **47 shelved, 47 exclusive**, against a
floor of 22 and 20.

## 3. The `pairs-with` graph

Only slugs that exist now or that this ticket creates. `parse-recipes.mjs:88` throws on
anything else, and pairings are made mutual at build, so each edge is written once.

- Every sauce → `pilau-rice` and one bread already on the shelf (`naan`, `chapati`, `paratha`).
- Every sauce that stands on the base → `onion-tomato-masala`.
- `butter-chicken` → `makhani-gravy`, `chicken-tikka`.
- `vindaloo` → `vindaloo-paste`. `palak-paneer` → `paneer`. `biryani` → `birista`, `raita`.
- `papadom` → `mango-chutney`, `lime-pickle`, `mint-chutney`, `kachumber`. **This is the tray**:
  four edges off one recipe is as close as the build gets to a tray, and it is honest about
  being four preparations and a habit.
- `chicken-tikka` and `seekh-kabab` → `tandoori-marinade` (existing), `mint-chutney`.
- `raita` → `biryani`, `vindaloo`.

## 4. Ordering, and why it matters

1. **Components before consumers.** Nine sauces carry an `@onion-tomato masala{}` row and a
   `pairs-with: onion-tomato-masala`. Written the other way round, `npm run recipes` fails on
   every one of them until the last file lands.
2. **`ginger-garlic-paste` first of all.** It is a row in fourteen of the other files.
3. **Sauces before the tray**, because that is the ranked order and the acceptance criterion
   says "in that order".
4. **`birista` before `biryani`, `paneer` before `palak-paneer`, `vindaloo-paste` before
   `vindaloo`** — the same rule at file scale.

Within a batch the order is free; across batches it is not.

## 5. What is deliberately not written, and why

Named here so `review.md` can repeat it and a reader does not have to diff the ranked list.

| Ranked | Item | Why not |
| --- | --- | --- |
| 4 | **phal** | The reference says it exists mainly as a dare. Its whole content is "the madras, four times the chile" — a table identical to `madras` in every cell but one |
| 12 | saag aloo, bombay aloo, bhindi bhaji, aloo gobi, baingan bharta | The vegetable column, five files. Below the line D1 draws; the count is already more than double the floor |
| 13 | garlic / keema / peshwari naan, tandoori roti, poori | Five variants of a bread that is already written. `naan` carries `dish:`/`kit:` machinery for exactly this and using it well is a bigger decision than a file each |
| 14–15 | sambar, coconut chutney | They belong to `dosa`, i.e. to the tiffin counter the gap doc says should be split out |
| 16 | gulab jamun | Sweets section has `kheer`; the ranked order puts nine other things first |
| 17 | mango lassi, masala chai, filter kaapi | `drinks/` has one file in it. Three drinks is a shelf decision, and `chai-masala` under it is a fourth file |
| 18–19 | idli, medu vada, uttapam, rava dosa, ven pongal, curd rice, upma, tamarind rice, bisi bele bath | The tiffin grid. The gap doc says these become a **Dosa Counter**, and they stand on a dosa/idli batter it also flags as the one preparation the build refuses to split four ways |
| 20 | rava kesari, mysore pak | Same shelf as 19 |
| — | ghee, tamarind pulp | One and two ingredients. `rowCount < 3` is a hard FAIL — they cannot be files here, and both are written inline where used |
| — | cashew paste, Kashmiri chile paste | Folded into `korma` and `rogan-josh`. Pulled out, each dish becomes "simmer the paste in cream" and stops being a recipe |
| — | sambar powder, dosa batter, chai masala, tamarind chutney | Every consumer is below the line |

Nothing in this table needs an edit to a file another ticket owns, so **T-001-18's artifact
gets no entry from this ticket** — confirmed in `research.md` §2 against all 325 basenames.

## 6. The shape inside a file

Every one of the 32 obeys the same five rules, which are the build's rules and not a style:

1. **One root.** The last paragraph references `@&(~1)`, and any second branch is merged by an
   explicit back-count from the step that consumes it. `buildTree` throws on two roots.
2. **No step referenced twice.** A base that two later steps want is written once and carried
   forward through the chain.
3. **≥3 ingredient rows, ≥2 chained operations.** Both are hard FAILs below the floor.
4. **Every timer named**, from `src/lib/time.ts`'s two vocabularies — `~simmer`, `~marinate`,
   `~rest`, `~soak`, `~chill`, `~drain`, `~press`, `~stand`, `~steam`, `~bake` (unattended);
   `~fry`, `~sear`, `~stir`, `~toast`, `~knead`, `~whisk`, `~brown` (hands-on). An
   unrecognised name reads as nothing, so no `~bhuna{}` and no `~temper{}`.
5. **A footer row on every sauce** — a paragraph with no ingredients and no refs, after the
   last real step, saying what the sauce runs across. This is the grid the table cannot hold,
   put where the build will print it.

## 7. What a reviewer should look at first

- `recipes/sauces-and-gravies/onion-tomato-masala.cook` — nine files stand on it. If its
  quantities are wrong, nine tables are wrong.
- The `--labels` staircase of `bhuna`, `karahi` and `balti` side by side. If those three read
  the same, D4 failed and the shelf has one recipe on it three times.
- `recipes/rice-beans-and-grains/biryani.cook` — the only file with two branches merging late
  (rice, and the marinated meat), so the only one where the one-root rule is non-trivial.
