# T-002-02 — Structure

Thirteen new files, nothing modified, nothing deleted. This is the blueprint: names, metadata,
the operation skeleton each table draws, and the numbers each one carries.

## Files created

All in `recipes/stews-and-braises/`, all new basenames, all `<plain-slug>-instant-pot.cook`:

```
beef-bourguignon-instant-pot.cook
beef-stew-instant-pot.cook
birria-de-res-instant-pot.cook
braised-short-ribs-instant-pot.cook
cachete-instant-pot.cook
carnitas-instant-pot.cook
chile-verde-instant-pot.cook
chili-con-carne-instant-pot.cook
collard-greens-instant-pot.cook
corned-beef-instant-pot.cook
hungarian-goulash-instant-pot.cook
oxtails-instant-pot.cook
pot-roast-instant-pot.cook
```

Basenames are URLs and unique across the collection; none of these thirteen exists today.

## Files modified

None. Confirmed against Acceptance Criterion 8: no pre-existing `.cook` file, no
`src/data/counters.json`, no `docs/gaps/**`, nothing under `src/`.

## The `dish:` targets, `ls`-confirmed

```
$ for s in birria-de-res carnitas pot-roast braised-short-ribs oxtails cachete \
           beef-bourguignon corned-beef chile-verde chili-con-carne \
           hungarian-goulash collard-greens beef-stew; do ls recipes/*/$s.cook; done
recipes/stews-and-braises/birria-de-res.cook
recipes/stews-and-braises/carnitas.cook
recipes/stews-and-braises/pot-roast.cook
recipes/stews-and-braises/braised-short-ribs.cook
recipes/stews-and-braises/oxtails.cook
recipes/stews-and-braises/cachete.cook
recipes/stews-and-braises/beef-bourguignon.cook
recipes/stews-and-braises/corned-beef.cook
recipes/stews-and-braises/chile-verde.cook
recipes/stews-and-braises/chili-con-carne.cook
recipes/stews-and-braises/hungarian-goulash.cook
recipes/stews-and-braises/collard-greens.cook
recipes/stews-and-braises/beef-stew.cook
```

Thirteen slugs, thirteen files, every one in `stews-and-braises/`. Nothing from
`rice-beans-and-grains/` or `soups/`.

## The metadata block every file carries

```
>> title: <Plain Title>, Instant Pot
>> category: Stews & Braises
>> tags: <plain tags>, instant pot, pressure cooker
>> counters: Instant Pot
>> dish: <plain slug>
>> kit: Instant Pot
>> aka: <plain aka list>, instant pot <dish>, pressure cooker <dish>
>> pairs-with: <plain pairs-with, where the plain file has one>
>> servings: <as the plain file, unless the pot forces a smaller batch>
>> time: <sum of this file's own timers, in the shape `1 hr 40 min`>
>> step.N: <label override wherever the derived label is not a cook's verb>
```

`category` is stated rather than inherited from the folder so the file reads whole. `counters`
is `Instant Pot` alone (Design D6). `kit` is the counter name spelled the same way, since it is
what the page prints as the switch label.

## The operation skeleton

Five operations, six where the dish needs a second pressure leg or a separate garnish. One
full-width note above the table — never below, never between operations, because `~1` counts
every step.

| # | Operation | Carries |
| --- | --- | --- |
| 0 | note (full width, top) | what the pot changes about *this* dish: the liquid floor, the release, or the leg that stays on the stove |
| 1 | season / toss | meat, salt, spice. Dry, before heat |
| 2 | brown on sauté | the same pot, `#Instant Pot{}`, `~brown{N%min}`, in batches |
| 3 | soften and deglaze | aromatics, then wine or stock, bottom scraped clean — the fond is what the burn sensor reads |
| 4 | pressure cook | the liquid as a real quantity, `~come to pressure{N%min}`, `~pressure cook{N%min}`, `~natural release{N%min}` |
| 5 | finish, lid off | reduce, thicken, crisp, or the vegetable leg with `~quick release{N%min}` |

Row budget: 9–15 ingredient rows per file, inside the 5–16 guidance. Column budget: 5–6
operations plus the merge, inside the 3–6 guidance and the `check-recipes.mjs` floor of 3.

## Per-file specification

Times below are the ones sourced in `design.md` D2. `CTP` = come to pressure, `HP` = high
pressure, `NR` = natural release, `QR` = quick release.

### 1. `birria-de-res-instant-pot.cook` — rank 3
- `dish: birria-de-res`, servings 8, pairs-with `corn-tortillas, salsa-roja`
- Ops: toast chiles on sauté → blend and strain the adobo → season the beef → pressure →
  shred, skim the fat off the consomé
- Numbers: CTP 15, **HP 45**, NR 15. Liquid: 4 cups hot water in the adobo, which is also the
  consomé, so it is not cut back
- Note: the consomé is the pot's liquid, so this variant gives two things at once

### 2. `carnitas-instant-pot.cook` — rank 5
- `dish: carnitas`, servings 8, pairs-with `corn-tortillas, salsa-roja, refried-beans`
- Ops: toss pork with salt and spice → brown on sauté → pressure with the orange and aromatics
  → shred → crisp under the broiler
- Numbers: CTP 12, **HP 45**, NR 15, broiler 10. Liquid: 1 cup water plus the orange juice —
  the floor, stated, where the oven version sat in 2 cups and lard
- Note: the broiler leg is unchanged; the pot does the tender, not the crust

### 3. `pot-roast-instant-pot.cook` — rank 6
- `dish: pot-roast`, servings 6, aka carries the plain file's hot-beef list
- Ops: rub → sear on sauté → soften with tomato paste, deglaze → pressure the roast →
  vegetables, second pressure leg, quick release → thicken lid off
- Numbers: CTP 15, **HP 75**, NR 20, then **HP 4** + QR 2, thicken 8. Liquid: 1 1/2 cups stock
  + 1/2 cup wine
- Note: a whole roast is not cubed chuck; the vegetables go in after because they cannot take
  the roast's time

### 4. `braised-short-ribs-instant-pot.cook` — rank 7
- `dish: braised-short-ribs`, servings 6
- Ops: season → sear → soften with tomato paste, deglaze → pressure → skim and reduce lid off
- Numbers: CTP 15, **HP 40**, NR 15, reduce 15. Liquid: 1 1/2 cups wine + 1 1/2 cups stock,
  down from 3 + 4
- Note: nothing evaporates under the lid, so the wine is halved and the sauce is finished open

### 5. `oxtails-instant-pot.cook` — rank 10
- `dish: oxtails`, servings 6, pairs-with `cheese-grits, collard-greens, butter-beans, hoppin-john`
- Ops: season → brown in batches → pressure with the aromatics → skim, slake the starch in
- Numbers: CTP 15, **HP 45**, NR 20, thicken 5. Liquid: 2 cups stock + 1/2 cup wine
- Note: the plain file's "until it slips off the bone" is a judgement made by looking, and the
  lid takes that away — which is what the number is for

### 6. `cachete-instant-pot.cook` — rank 11
- `dish: cachete`, servings 6, pairs-with `corn-tortillas, salsa-verde`
- Ops: trim and season → brown on sauté → pressure with the pot vegetables → shred, salt
- Numbers: CTP 12, **HP 45**, NR 15. Liquid: 1 cup water — named as the floor, where the oven
  version had the cheeks half submerged in 2
- Note: the cheeks must sit in liquid, not swim; the pot returns every drop

### 7. `beef-bourguignon-instant-pot.cook` — rank 12
- `dish: beef-bourguignon`, servings 6, pairs-with `baguette`
- Ops: render the lardons → brown the beef → soften and deglaze → pressure → glaze the garnish
  and fold in, lid off, reducing
- Numbers: CTP 15, **HP 35**, NR 15, reduce and glaze 15. Liquid: 1 1/2 cups wine + 1 cup stock
- Note: the reduction is the dish and pressure cannot do it, so it is handed back to the stove —
  which is exactly why this one is on the shelf and `red-braised-pork-belly` is not
- No flour dust: the plain file dusts the beef with flour, which scorches on a sealed base. A
  slurry goes in at the end instead

### 8. `corned-beef-instant-pot.cook` — rank 14
- `dish: corned-beef`, servings 6, pairs-with `pastrami, sauerkraut, russian-dressing, deli-rye-bread`
- **Only the simmer moves.** The five-day cure and the two-hour desalting soak stay exactly as
  the plain file has them, and the note says so
- Ops: rinse and soak the cured flat → pressure with the aromatics → rest and carve
- Numbers: soak 2 hr, CTP 20, **HP 90**, NR 20, rest 20. Liquid: 6 cups water, to just cover
- Batch: 3 lb flat, not the plain file's 5 — a 6-qt pot will not take five pounds under the
  fill line, and servings drop from 8 to 6 with it
- This file has 4 operations and no browning leg, because boiled beef is not browned

### 9. `chile-verde-instant-pot.cook` — rank 16
- `dish: chile-verde`, servings 8, pairs-with `corn-tortillas, mexican-red-rice`
- Ops: char the tomatillos and chiles under the broiler → blend → brown the pork on sauté →
  pressure under the sauce → finish with lime, lid off
- Numbers: broiler 12, CTP 12, **HP 35**, NR 15. Liquid: the blended sauce plus 1 cup stock
- Note: the char leg stays under the broiler; the pot cannot blister a skin

### 10. `chili-con-carne-instant-pot.cook` — rank 17
- `dish: chili-con-carne`, servings 6
- Ops: brown → soften → bloom the chile off the heat → pressure → thicken with masa lid off
- Numbers: CTP 12, **HP 35**, NR 15, thicken 8. Liquid: 2 cups stock + the crushed tomatoes
- Note: bloom the chile off the heat and stir the tomatoes in without stirring them down to the
  base — a scorched bottom is what trips the burn sensor

### 11. `hungarian-goulash-instant-pot.cook` — rank 18
- `dish: hungarian-goulash`, servings 6
- Ops: render the onions on sauté → bloom the paprika off the heat → stir the beef in →
  pressure → potatoes, second leg, quick release
- Numbers: CTP 12, **HP 35**, NR 15, then **HP 4** + QR 2. Liquid: 2 cups stock, down from 4
- Note: paprika scorches against a hot base and turns bitter, and under a lid you cannot see it
  happen

### 12. `collard-greens-instant-pot.cook` — rank 21
- `dish: collard-greens`, servings 8, pairs-with `ham-hock-stock, skillet-cornbread, hot-water-cornbread, black-eyed-peas`
- Ops: trim and wash → render the bacon and sweat → pressure the greens → season at the end
- Numbers: CTP 10, **HP 20**, **QR 2**. Liquid: 2 cups ham hock stock, down from 3 qt
- Note: **the release is the lesson.** Greens go from done to collapsed inside a natural
  release, so this is the one dish on the shelf that is vented the moment the timer ends

### 13. `beef-stew-instant-pot.cook` — rank 30
- `dish: beef-stew`, servings 6, pairs-with `dinner-rolls`
- Ops: toss → brown → soften and deglaze → pressure the beef → vegetables, second leg, quick
  release → thicken lid off
- Numbers: CTP 12, **HP 35**, NR 15, then **HP 4** + QR 2, thicken 8. Liquid: 2 cups stock +
  1 cup wine, down from 4 cups stock
- Note: the flour dredge goes, for the same scorching reason as the bourguignon; potatoes go in
  after, because 35 minutes turns them to soup

## Ordering of the work

1. `beef-stew-instant-pot.cook` first, though it is rank 30 — it is the file whose numbers the
   story states outright, so it is the one that proves the skeleton before twelve more copy it.
2. Then rank order: birria, carnitas, pot-roast, short ribs, oxtails, cachete, bourguignon,
   corned beef, chile verde, chili, goulash, collards.
3. Each file is checked with `--labels` as it is written, not in a batch at the end — a label
   that comes out a sentence fragment is cheaper to fix while the step is still in mind.

## Interfaces this work touches, and does not change

| Thing | How this ticket uses it |
| --- | --- |
| `>> dish:` / `>> kit:` (`normalise.mjs:198-222`) | Reads only. One variant per dish, plain file untouched |
| `src/data/counters.json` | Reads the name `Instant Pot`. No edit |
| `src/lib/time.ts` `UNATTENDED` | Uses the four names T-002-01 added. No edit |
| `scripts/check-recipes.mjs` | Verification, per file, `--labels`. Writes nothing |
| `docs/gaps/instant-pot.md` | Source for the ranked order and the timing table. No edit — the `## What it has` rename is T-002-08's |
