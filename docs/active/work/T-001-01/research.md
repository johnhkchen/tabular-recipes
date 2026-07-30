# T-001-01 — Research

What exists, where it is, and what the five shared components have to fit into. Descriptive
only; no decisions here.

## The ticket in one line

Write the five components that more than one counter's gap doc asks for, so that fifteen
counter tickets running in parallel do not each write their own copy under a different name.

## The collection as it stands

249 `.cook` files under `recipes/`, in 13 category folders:

| Folder | Files | What lives there |
| --- | --: | --- |
| `bars-and-brownies` | 21 | tray bakes |
| `breads` | 20 | yeasted loaves and buns |
| `cakes-and-loaves` | 21 | cakes, quick breads, both cornbreads |
| `cookies` | 21 | cookies by the piece |
| `custards-and-puddings` | 20 | set and spoonable sweets — **and sweet fillings**: `lemon-curd`, `pastry-cream`, `creme-anglaise` |
| `dressings-and-dips` | 23 | the table shelf — `toum`, `tzatziki`, `hummus`, `pork-liver-pate`, `do-chua`, `sour-dill-pickles` |
| `flatbreads-and-pancakes` | 21 | griddle things — `corn-tortillas`, `flour-tortillas`, `arepas-de-queso` |
| `pastry-and-doughs` | **2** | `all-butter-pie-crust`, `sweet-tart-shell` |
| `rice-beans-and-grains` | 20 | `refried-beans`, `cuban-black-beans`, `mexican-red-rice`, `egg-fried-rice`, `polenta` |
| `sauces-and-gravies` | 20 | `salsa-roja`, `red-enchilada-sauce`, `mole-poblano` |
| `soups` | 20 | includes `congee`, `black-bean-soup` |
| `spice-blends-and-marinades` | 20 | rubs, pastes, marinades |
| `stews-and-braises` | 21 | `carnitas`, `birria-de-res`, `char-siu`, `red-braised-pork-belly` |

`pastry-and-doughs` is the newest and thinnest folder — it holds only the two pastry shells
written after the gap docs were compiled.

## Do the five already exist?

Checked with `ls recipes/*/<slug>.cook` and by scanning every basename in the collection.

| Component | Slug looked for | Present? |
| --- | --- | --- |
| nixtamalised masa | `nixtamalised-masa`, `nixtamalized-masa`, `masa` | no |
| crema mexicana | `crema-mexicana`, `crema` | no |
| queso fresco | `queso-fresco` | no |
| red bean paste | `red-bean-paste` | no |
| lotus seed paste | `lotus-seed-paste` | no |

Nothing close exists either. `arepas-de-queso` uses cheese but writes it as a bought
ingredient; `refried-beans` and `cuban-black-beans` are savoury bean dishes, not a sweet
paste; `thai-red-curry-paste` and `garam-masala` are the only files with "paste"/"masala" in
the name and are unrelated.

**All five are genuinely missing.** This is not the case the ticket warns about.

## What the gap docs are stale about (and what that removes from scope)

`docs/gaps/README.md` ranks five gaps as most-reused. Four of the five have since been
written, which is exactly the staleness the story warns about:

- pastry shell → `pastry-and-doughs/all-butter-pie-crust`, `pastry-and-doughs/sweet-tart-shell`
- two pickles → `dressings-and-dips/do-chua`, `dressings-and-dips/sour-dill-pickles`
- cornbread → `cakes-and-loaves/skillet-cornbread`, `flatbreads-and-pancakes/hot-water-cornbread`
- char siu → `stews-and-braises/char-siu`
- pâté → `dressings-and-dips/pork-liver-pate`

So the highest-fanout shared components are already done, and what is left of the
cross-counter set is the five in this ticket plus a short tail (below).

## Where each of the five is asked for

Read from the "Components it would need" section of each gap doc.

**`docs/gaps/panaderia.md`** — the counter with **zero recipes of its own**:

- *"**Nixtamalised masa** — corn tortillas are here, almost certainly from masa harina. The
  nixtamal itself (corn, cal, an overnight soak, a grind) is the tortillería's real product."*
- *"**Crema mexicana** and **queso fresco** — sold from the same case, and both are short
  tables."*

**`docs/gaps/taqueria.md`**:

- *"**Queso Oaxaca**, **queso fresco**, **crema mexicana** — quesabirria, gringas and every
  taco topping need one of these."*
- *"**Nixtamalised masa** — see the Panadería."*

**`docs/gaps/bakery.md`**:

- *"**Red bean paste**, chunky (tsubu-an) and sieved (koshi-an) — anpan, sesame ball, mochi
  donut, mooncake."*
- *"**Lotus seed paste** — mooncake."*

**`docs/gaps/dim-sum-counter.md`**:

- *"**Red bean paste** and **lotus seed paste** — see the Bakery."* Its ranked list wants
  them for **red bean soup**, **sesame ball (jin deui)**, **lotus paste bun** and
  **wife cake (lo po beng)**.

So the counter assignment is unambiguous and comes straight from the docs:

| Component | Counters that ask for it |
| --- | --- |
| nixtamalised masa | Panadería, Taquería |
| crema mexicana | Panadería, Taquería |
| queso fresco | Panadería, Taquería |
| red bean paste | Bakery, Dim Sum Counter |
| lotus seed paste | Bakery, Dim Sum Counter |

## Other components named by two or more gap docs

Scanned all fifteen "Components it would need" sections for anything else wanted by two or
more counters and not already written, and not already resolved by the story's
dish-ownership table:

| Component | Wanted by | Already covered? |
| --- | --- | --- |
| pastry shell / pie crust / pie shell | Bakery, Diner, Meat and Three, Panadería, Phở & Bánh Mì, Dim Sum Counter | **written** (`all-butter-pie-crust`, `sweet-tart-shell`) |
| cornbread batter | Meat and Three, Smokehouse | **written**; story says T-001-17 shelves it |
| char siu / char siu marinade | Dim Sum Counter, Takeout Counter, Phở & Bánh Mì | **written** |
| filo handling and clarified butter | Bakery, Shawarma Counter | story gives **baklava** to Shawarma Counter |
| vanilla custard and wafers | Meat and Three, Smokehouse | story gives **banana pudding** to Meat and Three |
| slaw dressing | Smokehouse, Deli, Meat and Three | story gives **coleslaw** to Deli |
| sweetened whipped cream | Bakery, Diner | **not written, not assigned** |
| plain chicken stock / clear chicken broth | Deli, Takeout Counter | **not written, not assigned** |
| pickled mustard green | Phở & Bánh Mì, Thai Kitchen | **not written, not assigned** |

The last three are real cross-counter components with no owner. They are recorded here and
carried into Design as a scope question; they are not in the ticket's list of five.

## The authoring contract (from `README.md`)

Rules a file must satisfy or the build refuses it:

1. **One table per recipe, a merge tree.** Every step after the first names what it consumes:
   `@&(~1)thing{}` (one step back) or `@&(3)thing{}` (step 3). Exactly one unreferenced
   ending. **No splits** — a preparation cannot be consumed by two later steps.
2. **Prep steps at the top only.** A step with no ingredient items becomes a full-width row;
   `~1` counts every step including prep, so a prep step wedged mid-tree makes the next
   `@&(~1)` point at nothing.
3. **Size:** 5 to 16 ingredient rows, 3 to 6 operations. Rows are cheap; operations add
   columns and columns break a phone.
4. **Name every timer** — `~soak{8%hr}`, `~simmer{90%min}`. This ticket's acceptance criteria
   restate it.
5. Notes carry the second unit: `@sugar{1%cup}(200 g)`. Fractions stay fractions.
6. Cell labels are derived from the step with ingredients stripped, and overridable with
   `>> step.N:`.

Metadata: `title`, `category`, `tags`, `servings` are **required** (`REQUIRED_META` in
`scripts/check-recipes.mjs:18`). Then `counters:` (list), `aka:` (searchable, and the repo
convention is to include the un-accented spelling), `pairs-with:` (slugs, made mutual at
build time — write it on one side only). All 249 existing files also carry `>> time:`.

## What the checker actually enforces

`scripts/check-recipes.mjs`:

- required metadata present (`title`, `category`, `tags`, `servings`);
- every name in `counters:` exists in `src/data/counters.json` (line 22-26) — a typo is a
  failure, so the accented forms `Panadería` and `Taquería` must be exact;
- the tree lays out with no tiling holes (`findTilingErrors`);
- `rowCount >= 3` and `colCount >= 3`;
- no operation cell comes out with an empty label.

It does **not** check `pairs-with` targets — that is `scripts/parse-recipes.mjs` at build
time, and pointing at a missing slug is a build error. Since no counter ticket has run yet,
every `pairs-with` slug written here has to be a recipe that exists **today**, or one of the
other four files this ticket creates.

`--labels` prints the derived operation staircase, which is the only way to see whether a
label reads as a cook's verb.

## Timer names the clock recognises

`src/lib/time.ts` classifies a **named** timer against two sets, and falls back to reading
the operation label when the name is unknown:

- unattended: `rise prove proof ferment rest chill cool freeze set marinate brine soak steep
  bake roast braise simmer steam boil infuse dry cure age refrigerate stand sit drain press
  smoke stew poach …`
- hands-on: `whisk stir knead beat mix fold toss whip roll shape saute fry sear brown broil
  temper toast grill flip baste skim churn`

Naming a timer with a word from one of those sets is what makes the timeline read the wait
as stated rather than inferred, which is the acceptance criterion's actual intent.

## Counter names, exactly

From `src/data/counters.json`: `Bakery`, `Panadería`, `Taquería`, `Dim Sum Counter`,
`Takeout Counter`, `Phở & Bánh Mì`, `Ramen Shop`, `Curry House`, `Thai Kitchen`,
`Shawarma Counter`, `Pizzeria`, `Deli`, `Diner`, `Smokehouse`, `Meat and Three`.

Category fallback only matters for a file that names no counter; all five files here will
name theirs, so the folder's category has no routing effect. It is still the label the site
groups by.

## Existing files worth copying the shape of

- `recipes/custards-and-puddings/lemon-curd.cook` — a sweet filling as a component table,
  5 steps, `step.N` label overrides. (Note: two of its timers are unnamed, so it is a style
  reference, not a compliance one.)
- `recipes/dressings-and-dips/do-chua.cook` — long unattended waits, all timers named
  (`~stand`, `~brine`, `~chill`), `aka` carrying the un-accented spelling and the words a
  customer would type.
- `recipes/pastry-and-doughs/all-butter-pie-crust.cook` — a component that several counters
  consume, `counters: Bakery, Diner, Meat and Three`.

## Constraints and assumptions carried into Design

- **Ownership.** Only `recipes/` may be touched. `src/data/counters.json` and
  `src/data/aisles.json` belong to T-001-17, so any new ingredient that falls through the
  aisle map is their problem, not a defect here.
- **Everything blocks on this ticket.** Fifteen counter tickets wait on it, which argues
  against widening scope.
- **No new counter names are needed.** All four counters involved already exist.
- **Three of the five are dairy/corn short tables** with few natural ingredients; the 5-row
  floor is the real design pressure, not the 16-row ceiling.
- **The two pastes are long simmers**, so they are timer-heavy and the named-timer criterion
  carries most of their value.
