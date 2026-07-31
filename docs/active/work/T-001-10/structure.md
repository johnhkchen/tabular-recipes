# T-001-10 — Structure

Thirteen files created, nothing modified, nothing deleted. All under `recipes/**`.

## The file list

| # | Path | Rows × ops (target) | Counter |
| --- | --- | --- | --- |
| 1 | `recipes/spice-blends-and-marinades/adobo-para-al-pastor.cook` | 14 × 4 | Taquería |
| 2 | `recipes/smoked-and-grilled/al-pastor.cook` | 7 × 5 | Taquería |
| 3 | `recipes/sauces-and-gravies/salsa-verde.cook` | 9 × 4 | Taquería |
| 4 | `recipes/sauces-and-gravies/salsa-verde-cruda.cook` | 9 × 3 | Taquería |
| 5 | `recipes/smoked-and-grilled/carne-asada.cook` | 14 × 5 | Taquería |
| 6 | `recipes/smoked-and-grilled/pollo-asado.cook` | 13 × 5 | Taquería |
| 7 | `recipes/stews-and-braises/tinga-de-pollo.cook` | 13 × 5 | Taquería |
| 8 | `recipes/stews-and-braises/chile-verde.cook` | 15 × 5 | Taquería |
| 9 | `recipes/stews-and-braises/lengua.cook` | 9 × 4 | Taquería |
| 10 | `recipes/stews-and-braises/suadero.cook` | 9 × 5 | Taquería |
| 11 | `recipes/stews-and-braises/cachete.cook` | 12 × 4 + prep row | Taquería |
| 12 | `recipes/stews-and-braises/tripas.cook` | 10 × 4 | Taquería |
| 13 | `recipes/soups/consome-de-birria.cook` | 8 × 4 | Taquería |

No new category folder. No file outside `recipes/**`. `src/data/counters.json` is untouched
— the menu sections belong to T-001-17.

## What the probe changed about the blueprint

A throwaway file was run through `check-recipes.mjs --labels` before any real writing, to
settle two uncertainties:

1. **`@&(N)` absolute references work** and are 1-based over steps as written — confirmed
   against `zucchini-bread`, `chiffon-cake`, `skillet-cornbread`, which all use the form.
   `tinga-de-pollo` needs one, to bring step 1's shredded chicken back at the end.
2. **Column count is tree depth, not operation count.** Five operations across three
   branches came out as 4 columns, because sibling branches share a column. This is good
   news for the 3–6 column ceiling and means branching recipes are cheap.
3. **Derived labels are unusable for these recipes.** The probe produced `fry in for 8 min`
   and `poach in for 25 min then shred`. Every step in every file therefore gets an explicit
   `>> step.N:` label, the way `salsa-roja` and `carnitas` already do it. The staircase is
   authored, not scavenged.

## Per-file blueprint

Metadata common to all thirteen: `title`, `category`, `tags`, `counters: Taquería`, `aka`
(with at least one diacritic-free spelling), `servings`, `time`, and a `>> step.N:` line for
every step. `pairs-with` where the board really pairs them.

### 1. `adobo-para-al-pastor` — Spice Blends & Marinades

*aka: adobada marinade, al pastor marinade, adobo para tacos al pastor, marinada de achiote,
adobo rojo.* pairs-with `al-pastor`. Serves 8 (dresses 3 lb of pork).

1. **toast, soak 20 min** — guajillo + ancho in a dry comal, then into hot water.
   `~toast{30%sec}`, `~soak{20%min}`.
2. **blend smooth** — soaked chiles + achiote paste, pineapple juice, white vinegar, garlic,
   onion, cumin, Mexican oregano, cloves, salt, sugar.
3. **strain** — through a fine-mesh sieve, chile skins out.
4. **simmer 5 min, cool** — in a little lard, until it darkens.

### 2. `al-pastor` — Smoked & Grilled

*aka: pastor, adobada, trompo, tacos al pastor, taco de pastor, home trompo.* pairs-with
`adobo-para-al-pastor`, `corn-tortillas`, `salsa-verde`. Serves 8.

The header note and step 2 say outright that a loaf tin standing in for a vertical spit is a
different dish from the trompo, per the gap doc.

1. **coat every slice, marinate 12 hr** — thin-sliced pork shoulder in one batch of the
   adobo (taken as a plain ingredient row). `~marinate{12%hr}`, unattended.
2. **stack the slices, pineapple on top** — bacon and onion on the floor of a loaf tin, the
   slices packed flat, a thick round of pineapple as the crown.
3. **roast 325°F 2 hr, then 450°F 20 min** — `~roast{2%hr}` + `~roast{20%min}`.
4. **rest 20 min, shave off the block** — `~rest{20%min}`.
5. **crisp on the comal 2 min** — the shavings in lard until the edges catch. `~sear{2%min}`.

### 3. `salsa-verde` — Sauces & Gravies

The charred one; deliberately the mirror of `salsa-roja`'s four steps, because the board
prints the pair on one line. *aka: verde, salsa verde asada, green salsa, salsa de
tomatillo, table salsa.* pairs-with `salsa-roja`, `corn-tortillas`. Serves 6.

1. **char 10 min** — tomatillos, onion, unpeeled garlic, serranos on a dry comal.
2. **blend coarse** — with salt and cilantro.
3. **fry 5 min** — in oil over high heat until it darkens. `~fry{5%min}`.
4. **finish off heat** — lime and raw chopped onion.

### 4. `salsa-verde-cruda` — Sauces & Gravies

*aka: salsa cruda, raw salsa verde, salsa verde crudo, green table salsa, salsa de
molcajete.* pairs-with `corn-tortillas`. Serves 6. Three operations, which is the floor and
honestly all an uncooked salsa has.

1. **rinse and quarter** — the stickiness off the tomatillos.
2. **blend in short pulses** — serranos, garlic, onion, salt; loose and foamy, not smooth.
3. **stir in, rest 10 min** — cilantro, raw onion, lime. `~rest{10%min}`.

### 5. `carne-asada` — Smoked & Grilled

*aka: asada, taco de asada, carne asada tacos, grilled skirt steak, arrachera.* pairs-with
`corn-tortillas`, `guacamole`, `salsa-verde`. Serves 6.

1. **whisk the marinade** — orange, lime, soy, oil, garlic, jalapeño, cumin, oregano,
   pepper, cilantro.
2. **marinate 4 hr** — outside skirt in it, turned once. `~marinate{4%hr}`, unattended.
3. **grill 4 min a side, hard char** — over hot charcoal, salted as it goes. `~grill{4%min}`
   twice.
4. **rest 10 min** — `~rest{10%min}`.
5. **chop across the grain, toss** — onion and cilantro on the board.

### 6. `pollo-asado` — Smoked & Grilled

*aka: pollo, grilled chicken, taco de pollo asado, pollo a la parrilla, chicken asado.*
pairs-with `mexican-red-rice`, `corn-tortillas`. Serves 6.

1. **blend the achiote adobo** — achiote paste, orange, lime, vinegar, garlic, cumin,
   oregano, salt, allspice.
2. **marinate 4 hr** — bone-in thighs, skin on. `~marinate{4%hr}`.
3. **grill skin down 12 min, turn, 12 min** — to 175°F. `~grill{12%min}` twice.
4. **rest 10 min** — `~rest{10%min}`.
5. **chop off the bone, toss** — onion, cilantro, lime.

### 7. `tinga-de-pollo` — Stews & Braises

*aka: tinga, chicken tinga, tinga poblana, pollo en tinga.* pairs-with `corn-tortillas`,
`refried-beans`. Serves 6. **Three branches, one ending** — the shape the probe validated.

1. **poach 25 min, shred** — thighs with onion, garlic, bay, salt. `~poach{25%min}`.
2. **blend smooth** — tomatoes, chipotles in adobo, garlic, oregano. *(new branch)*
3. **fry the onion 8 min** — sliced onion limp and gold. *(new branch)* `~fry{8%min}`.
4. **pour over, reduce 10 min** — merges 2 into 3. `~simmer{10%min}`.
5. **simmer the chicken in, 10 min** — `@&(1)` brings step 1 back. `~simmer{10%min}`.

### 8. `chile-verde` — Stews & Braises

*aka: chile verde, puerco en salsa verde, green chile pork, chili verde, pork chile verde.*
pairs-with `corn-tortillas`, `mexican-red-rice`. Serves 8.

1. **char under the broiler 12 min, peel** — tomatillos, poblanos, Anaheims, jalapeños,
   onion, garlic.
2. **blend with the cilantro** — plus cumin, oregano, stock.
3. **brown in batches 10 min** — pork shoulder in lard. *(new branch)* `~sear{10%min}`.
4. **pour over** — merges 2 into 3.
5. **simmer 2 hr, finish with lime** — `~simmer{2%hr}`, unattended.

### 9. `lengua` — Stews & Braises

*aka: lengua, beef tongue, taco de lengua, tacos de lengua, lengua en su jugo.* pairs-with
`corn-tortillas`, `salsa-verde`. Serves 8.

1. **simmer 3 hr** — whole tongue with onion, garlic head, bay, peppercorns, salt.
   `~simmer{3%hr}`, unattended.
2. **peel hot, trim the root** — the skin comes off in sheets while it is hot.
3. **dice 1/2-in** —
4. **crisp on the comal 6 min** — in lard, edges brown, middle soft. `~sear{6%min}`.

### 10. `suadero` — Stews & Braises

*aka: suadero, res, taco de suadero, tacos de suadero, rose meat, brisket flap.* pairs-with
`corn-tortillas`, `salsa-roja`. Serves 8.

1. **salt the beef** — brisket flat and navel in one piece.
2. **render the fat 10 min** — lard with onion, garlic, bay in a wide cazuela. *(new
   branch)* `~render{10%min}`.
3. **simmer barely covered 2 hr** — merges 1 into 2. `~simmer{2%hr}`, unattended.
4. **chop on the board** —
5. **crisp on the comal 4 min** — in the rendered fat. `~sear{4%min}`.

### 11. `cachete` — Stews & Braises

*aka: cachete, cabeza, beef cheek, taco de cabeza, tacos de cachete, barbacoa de cachete.*
pairs-with `corn-tortillas`, `salsa-verde`. Serves 6. Opens with a full-width prep row, the
way `carnitas` and `birria-de-res` do.

0. *(prep row)* **Preheat the oven to 300°F (150°C).**
1. **season in the pot** — cheeks, salt, pepper.
2. **add the pot vegetables** — onion, garlic, bay, oregano, cloves, vinegar, water,
   avocado leaves.
3. **braise 300°F 3 hr** — `~braise{3%hr}`, unattended.
4. **shred coarse, salt** —

### 12. `tripas` — Stews & Braises

*aka: tripa, tripas, tripe, taco de tripas, tripitas, chinchulines.* pairs-with
`corn-tortillas`, `salsa-verde`. Serves 6.

1. **rinse, rub with salt and vinegar, rinse** — the cleaning step, which is the whole
   difference between good and bad tripas.
2. **simmer 2 hr in milk and water** — with onion, garlic, bay. `~simmer{2%hr}`.
3. **drain, cut in 3-in lengths, dry** —
4. **crisp on the plancha 15 min** — hard outside, chewy inside. `~sear{15%min}`.

### 13. `consome-de-birria` — Soups

*aka: consome, consome de birria, dipping broth, caldo de birria, birria broth.* pairs-with
`birria-de-res`, `corn-tortillas`. Serves 6.

Starts **from** the braise rather than branching off it — the gap doc's condition, and the
layout's, since one preparation cannot have two endings. The braising liquid is a plain
ingredient row, the way `burnt-ends` takes barbecue sauce.

1. **strain the braising liquid** — into a saucepan.
2. **skim, leave the red slick** —
3. **simmer 15 min with the árbol** — plus beef stock, oregano, salt. `~simmer{15%min}`.
4. **ladle into cups, top** — onion, cilantro, lime wedges.

## Ordering of the work

Committed in seven units, each one a group that would read as one entry on the board:

1. `adobo-para-al-pastor` + `al-pastor` — the component before the dish that names it.
2. `salsa-verde` + `salsa-verde-cruda` — the pair.
3. `carne-asada` + `pollo-asado` — the grill.
4. `tinga-de-pollo` + `chile-verde` — the guisado pot.
5. `lengua` + `suadero` — the first two cuts.
6. `cachete` + `tripas` — the second two.
7. `consome-de-birria` — the cup that finishes the birria order.

Order matters in exactly one place: `al-pastor` names the adobo in its ingredient list and
pairs with it, so the adobo is written first. `pairs-with` is resolved at build time across
the whole collection, so no ordering constraint follows from it beyond both files existing
before `npm run recipes` is run.

## Public surface this creates

- 13 new slugs, therefore 13 new URLs.
- 13 new entries in the Taquería's recipe set (via `>> counters:`), taking it to 33 shelved
  and 25 exclusive.
- New `pairs-with` edges into `corn-tortillas`, `salsa-roja`, `guacamole`, `refried-beans`,
  `mexican-red-rice` and `birria-de-res`, all made mutual at build time without editing
  those files.
- New searchable `aka` vocabulary, lifted from the Taquería table in
  `docs/knowledge/counters.md`.

## What is deliberately not created

`salsa-de-aguacate`, `cebolla y cilantro`, `chiles-toreados`, `escabeche`, `quesabirria`,
`chile-relleno`, the five masa vehicles, `torta`, `flautas`, `alambre`, `machaca`, the aguas
frescas, `elote`/`esquites`, the pupusería block, `salsa-macha`, and `arroz-con-leche`.
Reasons are recorded per item in `progress.md`; the short version is that they sit below
ranked item #7, and several of them need components (bolillo, sope masa, Salvadoran
chicharrón) that belong to other counters' tickets.
