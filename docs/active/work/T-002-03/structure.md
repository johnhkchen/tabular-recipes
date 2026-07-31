# T-002-03 — Structure

Twelve created files. Zero modified files. The blueprint below fixes each file's metadata,
its operation count, and its timers before any of them is written.

## Files

**Created — `recipes/soups/`**

```
tonkotsu-broth-instant-pot.cook
pho-broth-instant-pot.cook
chintan-broth-instant-pot.cook
chicken-broth-instant-pot.cook
ham-hock-stock-instant-pot.cook
congee-instant-pot.cook
borscht-instant-pot.cook
```

**Created — `recipes/rice-beans-and-grains/`**

```
ful-medames-instant-pot.cook
cuban-black-beans-instant-pot.cook
refried-beans-instant-pot.cook
boston-baked-beans-instant-pot.cook
gigantes-plaki-instant-pot.cook
```

**Modified:** none. **Deleted:** none. Nothing outside `recipes/` is touched — not
`src/data/counters.json` (T-002-08), not `docs/gaps/instant-pot.md` (T-002-08), not `src/`.

## The metadata block, identical in shape across all twelve

```cooklang
>> title: <Plain Title>, Instant Pot
>> category: <exact string from the plain file>
>> tags: <plain tags minus stovetop/oven>, instant pot, pressure cooker, <no-soak where true>
>> counters: Instant Pot
>> aka: <plain aka>, instant pot <dish>, pressure cooker <dish>
>> servings: <plain servings>
>> dish: <plain slug>
>> kit: Instant Pot
>> time: <sum of this file's own timers, rounded as a cook would say it>
>> pairs-with: <plain file's, where it has one and it is not the plain sibling>
>> step.N: <label override where the derived label would read badly>
```

`category` is copied rather than inherited from the folder so the two files sort together;
`Rice, Beans & Grains` and `Soups` are the two strings in play.

## Per-file specification

Rows = ingredient rows (README wants 5–16). Ops = operations (3–6). Every pressure and
release timer below is named with a string `src/lib/time.ts` recognises.

### 1. `soups/tonkotsu-broth-instant-pot.cook` — dish `tonkotsu-broth`

servings 8 · pairs-with `tonkotsu-ramen` · time ~3 hr 30 min · **5 ops, ~9 rows**

| # | Operation | Timers |
| --- | --- | --- |
| — | full-width note: the pot does the extraction, the uncovered boil does the colour | — |
| 1 | parboil trotters, neck bones, fatback; scrub every bone | `~parboil{30%min}` |
| 2 | seal with water, pressure cook | `~pressure cook{90%min}` |
| 3 | natural release, then aromatics in | `~natural release{30%min}` |
| 4 | **boil hard, lid off**, until white and coating | `~boil{20%min}` |
| 5 | strain, pressing the softened marrow through | — |

Aromatics go in at the release, not under pressure: 90 sealed minutes reduces onion and
ginger to nothing, same failure the plain file names for an eight-hour boil.

### 2. `soups/pho-broth-instant-pot.cook` — dish `pho-broth`

servings 8 · pairs-with `pho-bo` · time ~2 hr 15 min · **5 ops, ~13 rows**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | parboil bones and oxtail, rinse every one | `~parboil{10%min}` |
| 2 | char onion and ginger on the pot's own sauté, toast the spices, tie the sachet | `~char{10%min}`, `~toast{3%min}` |
| 3 | pressure cook with brisket and sachet | `~pressure cook{60%min}` |
| 4 | natural release, lift the brisket and pull the sachet | `~natural release{30%min}` |
| 5 | season with fish sauce and rock sugar, strain | — |

60 + 30 is the fetched Amy + Jacky figure. The brisket comes out at the release rather than
at ninety minutes, because under a lid there is no lifting it mid-cook — a real difference
from the plain file, stated in the step.

### 3. `soups/chintan-broth-instant-pot.cook` — dish `chintan-broth`

servings 8 · pairs-with `shoyu-ramen`, `shio-ramen`, `miso-ramen` · time ~2 hr 30 min ·
**5 ops, ~9 rows**

| # | Operation | Timers |
| --- | --- | --- |
| — | full-width note: this is the honest trade — clear-ish, not clear | — |
| 1 | parboil carcasses, wings, neck bones; rinse | `~parboil{10%min}` |
| 2 | pressure cook | `~pressure cook{60%min}` |
| 3 | **full** natural release, kombu and aromatics in as it falls | `~natural release{30%min}` |
| 4 | strain through cloth, settle, lift the fat | `~settle{20%min}` |

Four operations. The release is the clarity instruction, not a convenience: opening the
valve flashes the liquid to a boil inside the pot.

### 4. `soups/chicken-broth-instant-pot.cook` — dish `chicken-broth`

servings 8 · pairs-with `matzo-ball-soup`, `schmaltz`, `chicken-noodle-soup` ·
time ~1 hr 45 min · **4 ops, ~11 rows**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | cold water over backs and wings, aromatics in, seal | — |
| 2 | pressure cook | `~pressure cook{45%min}` |
| 3 | natural release, strain without pressing | `~natural release{25%min}` |
| 4 | settle and separate the fat, salt to taste | `~settle{20%min}` |

Against the plain file's 11 hr 30: the 8 hr chill is replaced by a 20 min settle (D5). The
prose says what is lost — this broth is gold but not glass.

### 5. `soups/ham-hock-stock-instant-pot.cook` — dish `ham-hock-stock`

servings 12 · pairs-with `collard-greens`, `green-beans`, `black-eyed-peas`,
`butter-beans` · time ~1 hr 30 min · **4 ops, ~8 rows**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | rinse hocks and neck bones into the pot with water and aromatics | — |
| 2 | pressure cook | `~pressure cook{45%min}` |
| 3 | natural release | `~natural release{20%min}` |
| 4 | strain, pick the meat off the bone, salt at the end | — |

`pairs-with` is copied verbatim from the plain file. All four slugs confirmed to exist by
`ls` before writing.

### 6. `rice-beans-and-grains/ful-medames-instant-pot.cook` — dish `ful-medames`

servings 4 · pairs-with `pita-bread`, `labneh`, `kabis` · time ~1 hr 30 min ·
**5 ops, ~14 rows** · **no soak**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | dry beans, water, bay, baking soda straight into the pot — no soak | — |
| 2 | pressure cook | `~pressure cook{45%min}` |
| 3 | natural release | `~natural release{20%min}` |
| 4 | crush half against the pot, dress with lemon, oil, garlic, cumin | — |
| 5 | build the top, finish at the table | — |

The plain file's `~soak{12%hr}` is gone and the step says so outright. 45 min is for the
small brown skin-on ful, not the peeled broad bean — the plain file already makes that
distinction and the variant repeats it, because the two beans want different times.

### 7. `rice-beans-and-grains/cuban-black-beans-instant-pot.cook` — dish `cuban-black-beans`

servings 6 · time ~1 hr 15 min · **5 ops, ~14 rows** · **no soak**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | sofrito on sauté, in the pot | `~sauté{10%min}` |
| 2 | toast cumin and oregano into it | `~toast{1%min}` |
| 3 | dry beans, water, bay on top; pressure cook | `~pressure cook{30%min}` |
| 4 | natural release | `~natural release{20%min}` |
| 5 | reduce lid off, then wine, vinegar, salt; pull the bay | `~reduce{10%min}` |

The wine and vinegar are the last step and the file says why: acid at the start stalls the
beans and there is no time that fixes it. The lid-off reduce replaces the plain file's
30-minute uncovered simmer — pressure adds no evaporation.

### 8. `rice-beans-and-grains/refried-beans-instant-pot.cook` — dish `refried-beans`

servings 8 · pairs-with `corn-tortillas` · time ~1 hr 30 min · **5 ops, ~10 rows** ·
**no soak**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | dry pintos, water, onion, garlic, bay; pressure cook | `~pressure cook{40%min}` |
| 2 | natural release, drain the beans, keep the liquid | `~natural release{20%min}` |
| 3 | fry the chopped onion in lard on sauté | `~fry{6%min}` |
| 4 | mash the beans in with a cup of their liquid | — |
| 5 | fry down until it holds a line | `~fry{10%min}` |

40 min is the top of the pinto range (D2). The plain file's phrase is "until completely
soft", which is the texture that has to be reached before the mash, so the top of the range
is the right end.

### 9. `soups/congee-instant-pot.cook` — dish `congee`

servings 4 · pairs-with `scallion-pancakes` · time ~1 hr 10 min · **4 ops, ~9 rows**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | rinsed rice, stock, ginger, salt; seal | — |
| 2 | pressure cook | `~pressure cook{30%min}` |
| 3 | natural release — never the valve, starch sprays | `~natural release{20%min}` |
| 4 | stir in chicken and white pepper, season, top | — |

The one dish where the pot improves rather than hurries: it does not catch and does not
need stirring, which is the plain file's "stirring now and then" removed. The
never-quick-release line is a safety instruction, not a texture note.

### 10. `soups/borscht-instant-pot.cook` — dish `borscht`

servings 6 · time ~1 hr 45 min · **5 ops, ~15 rows**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | brown the short ribs on sauté | `~brown{10%min}` |
| 2 | stock in, pressure cook | `~pressure cook{40%min}` |
| 3 | natural release, pull the meat off the bones | `~natural release{15%min}` |
| 4 | beets, onion, carrot, tomato paste, vinegar, potato, cabbage — **lid off** | `~simmer{20%min}` |
| 5 | garlic, dill, salt; sour cream at the table | — |

40 min is the repo's own short-rib figure (`docs/gaps/instant-pot.md:141`). The vegetables
never see pressure: cabbage collapses and grated beet loses its colour, so the second half
is an uncovered simmer in the same pot. Fifteen rows is at the top of README's range and
is checked in Plan.

### 11. `rice-beans-and-grains/boston-baked-beans-instant-pot.cook` — dish `boston-baked-beans`

servings 8 · time ~1 hr 45 min · **5 ops, ~11 rows** · **no soak**

| # | Operation | Timers |
| --- | --- | --- |
| — | full-width note: what the bean pot does that this does not | — |
| 1 | dry navy beans, water, salt pork, onion; pressure cook | `~pressure cook{30%min}` |
| 2 | natural release | `~natural release{20%min}` |
| 3 | molasses, brown sugar, mustard, vinegar, salt stirred in; pressure again | `~pressure cook{10%min}` |
| 4 | natural release | `~natural release{10%min}` |
| 5 | reduce lid off until it holds | `~reduce{15%min}` |

Five operations, two of them pressure legs, because molasses cannot go in first (D6). The
note at the top is the argument `docs/gaps/instant-pot.md:120` asks for.

### 12. `rice-beans-and-grains/gigantes-plaki-instant-pot.cook` — dish `gigantes-plaki`

servings 6 · pairs-with `tzatziki`, `pita-bread` · time ~13 hr (12 of them the soak) ·
**5 ops, ~13 rows** · **soak kept**

| # | Operation | Timers |
| --- | --- | --- |
| 1 | soak the gigantes overnight — the one soak the pot does not take away | `~soak{12%hr}` |
| 2 | sweat onion, carrot, garlic in oil on sauté | `~sauté{10%min}` |
| 3 | tomato, paste, oregano, salt, drained beans; pressure cook | `~pressure cook{20%min}` |
| 4 | natural release | `~natural release{20%min}` |
| 5 | reduce lid off, then feta and parsley over | `~reduce{15%min}` |

The soak is step 1 with a named timer and a sentence of reason, per D3. The plaki's oven
hour becomes the lid-off reduce; the browned top does not survive the change and the file
says so.

## Ordering of the work

Write in the D1 order — rank 1 first. Two reasons: the acceptance criterion is about the
top of the ranked list being written *in that order*, and the two hardest judgement calls
(tonkotsu's uncovered boil, chicken broth's dropped chill) are files 1 and 4, so they are
settled while there is still room to change the shared grammar.

Commit in four units (see `plan.md`), each a `lisa commit-ticket` with exact paths:
the five stocks and broths, the four unsoaked beans, the two grain-and-soup files, and
`gigantes-plaki` with the soak.

## What the shape has to satisfy, restated as a checklist

- One table per file, merge tree, exactly one unreferenced ending, no splits.
- Full-width prose notes (steps with no ingredients) at the **top only** — files 1, 3 and
  11 have one each, and each sits before step 1 so `~1` never points past it.
- Every step after the first consumes something: `@&(~1)…{}` or `@&(~N)…{}`.
- 5–16 rows, 3–6 ops per file. Borscht at 15 rows and five ops is the tightest.
- Every timer named. Every pressure and release timer named with a string from
  `src/lib/time.ts` UNATTENDED: `pressure cook`, `natural release`. Nothing else is
  used for the sealed legs.
- `>> time:` equals the file's own timers, not the plain file's total.
