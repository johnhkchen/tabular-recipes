# T-002-03 — Research

Instant Pot variants for the beans, grains, stocks and long soups. Descriptive only: what
exists, where it lives, what constrains a writer.

## 1. The mechanism, as the code actually implements it

`scripts/normalise.mjs:198-232` is the whole of it:

```js
const dish = metadata.dish ?? slug;   // a file with no >> dish: is its own dish
const kit  = metadata.kit  ?? null;   // a file with no >> kit: is the plain way
```

`scripts/parse-recipes.mjs:103-130` groups every recipe by `dish`. For a group larger than
one it throws if more than one member lacks `kit`, and otherwise writes each member a
`variants` array of `{slug, title, kit}`. `src/pages/[slug].astro:81-88` renders that array
as a line of links, labelling each with `variant.kit ?? 'the plain way'`.

So the pairing is entirely one-sided. Writing `>> dish: cuban-black-beans` plus
`>> kit: Instant Pot` in a new file makes both pages offer the switch, and the plain file is
never opened. That is what makes this ticket and T-002-02 safe to run in parallel.

Three failure modes, all of them build-stopping or silent:

- Two files sharing a `dish` with neither naming a `kit` → `parse-recipes.mjs:117` throws.
  Only ever add the kit file.
- A `dish:` naming a slug that does not exist → no throw, just a lonely variant that pairs
  with nothing. Only `ls` prevents this.
- `src/lib/collection.test.ts:59-70` re-checks both invariants over the built collection.

## 2. Counters and validation

`src/data/counters.json:1397` has the counter, opened by T-002-01:

```json
{ "name": "Instant Pot", "slug": "instant-pot",
  "blurb": "Lock the lid and walk away; it gets there on its own.",
  "categories": [],
  "sections": ["Braises that took all afternoon", "Beans from dry", "Stocks and broths",
               "Rice, grains and porridge", "Whole birds and big cuts", "Also here"] }
```

Every `sections[].items` array is empty. Filling them is T-002-08, not this ticket.
`categories: []` means the counter claims no category as a fallback, so a recipe reaches
this shelf only by naming it: `>> counters: Instant Pot`, exact string, validated at
`parse-recipes.mjs:52-60`.

`scripts/check-recipes.mjs` is the per-file gate and writes nothing, so any number of
tickets can run it at once. `--labels` prints the staircase of derived operation cells,
which is the only way to see whether a step reads as a cook's verb or a mangled fragment.

## 3. The clock — what T-002-01 actually taught it

`src/lib/time.ts` UNATTENDED now contains, verbatim:

```
'pressure', 'pressurecook', 'pressurecooking', 'pressurerelease', 'naturalrelease',
'naturalpressurerelease', 'quickrelease', 'cometopressure', 'keepwarm'
```

`normalise()` in that file lowercases and strips spaces and hyphens before lookup, so
`~pressure cook{30%min}` → `pressurecook` → unattended, **from the name**, source `'name'`.
Same for `~natural release{20%min}` → `naturalrelease` and `~quick release{2%min}` →
`quickrelease`.

Two consequences a writer must respect:

- An **unrecognised** name falls through to reading the operation label, then defaults to
  hands-on. `~let the pressure fall{20%min}` would be read as twenty minutes of standing at
  the pot. Use the exact words above.
- `readTimers()` slices the step label per timer, so a step containing
  `~sauté{8%min}` and `~pressure cook{30%min}` reports the first as hands-on and the second
  as unattended, correctly, without either reaching over the comma for the other's verb.

`release` alone is deliberately **not** in the set (`time.ts` comment: "what makes the shell
release", "until the mushrooms release their liquid"). So `~release{...}` would read as
hands-on. It must be `~natural release` or `~quick release`.

## 4. The candidates, filtered to this ticket's two folders

`docs/gaps/instant-pot.md` ranks 58 dishes. This ticket owns
`recipes/rice-beans-and-grains/` and `recipes/soups/`; T-002-02 owns
`recipes/stews-and-braises/`. Filtering the ranked list by folder, confirmed with
`ls recipes/*/<slug>.cook`:

| Gaps rank | Slug | Folder | Plain cook it replaces |
| --- | --- | --- | --- |
| 1 | `tonkotsu-broth` | soups | 8 hr hard rolling boil |
| 2 | `pho-broth` | soups | 6 hr bare simmer |
| 4 | `chintan-broth` | soups | 4 hr at a tremble |
| 9 | `chicken-broth` | soups | 3 hr simmer + 8 hr chill |
| 15 | `ham-hock-stock` | soups | 3 hr simmer |
| 24 | `ful-medames` | rice-beans-and-grains | 12 hr soak + 1 hr 30 simmer |
| 25 | `cuban-black-beans` | rice-beans-and-grains | overnight soak + 1 hr 30 |
| 26 | `refried-beans` | rice-beans-and-grains | overnight soak + 1 hr 30 |
| 27 | `congee` | soups | 1 hr 30 simmer |
| 28 | `borscht` | soups | 1 hr 30 simmer on short ribs |
| 31 | `boston-baked-beans` | rice-beans-and-grains | overnight soak + 30 parboil + 5 hr bake |
| lower | `gigantes-plaki` | rice-beans-and-grains | overnight soak + 1 hr + 1 hr bake |

Ranks 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16–23, 29, 30 are all `stews-and-braises/` or
`vegetables-and-sides/` — T-002-02's or nobody's. **`collard-greens` (rank 21) is in
`recipes/stews-and-braises/`**, confirmed by `ls`, so it is out of this ticket's folders
despite reading like a bean pot.

Two dishes named in this ticket's own Context are out of its folders:

- **`chana-masala`** → `recipes/stews-and-braises/chana-masala.cook`. The acceptance
  criteria forbid `stews-and-braises/`, so the Context and the criteria disagree and the
  criteria win.
- **`hummus`** → `recipes/dressings-and-dips/hummus.cook`, also outside both folders.

## 5. What the plain files say that a pressure version has to answer

Read in full: `tonkotsu-broth`, `pho-broth`, `chintan-broth`, `chicken-broth`,
`ham-hock-stock`, `congee`, `borscht`, `cuban-black-beans`, `refried-beans`, `ful-medames`,
`boston-baked-beans`, `gigantes-plaki`.

Four of them contain an argument that a sealed pot contradicts, and these are the real
constraints on this ticket:

1. **`tonkotsu-broth.cook`, step 3**: *"The whole difference between white broth and grey
   broth is mechanical: a rolling boil beats the collagen and the fat into the water as an
   emulsion, and a simmer lets them separate and sit there."* A pressure cooker is by
   definition not a rolling boil — the pressure suppresses it. Kenji López-Alt's public
   position is that this makes tonkotsu impossible under pressure. Published pressure
   tonkotsu recipes disagree in practice and all of them, on inspection, boil hard with the
   lid off afterwards.

2. **`chicken-broth.cook`, step 1**: *"Cold water and a slow climb are what make the broth
   clear."* Step 2: *"Never let it boil."* And `chintan-broth.cook`: *"one lazy bubble
   breaking every few seconds and no more."* Under a locked lid the liquid is above 100 °C
   and moving; you cannot skim it and you cannot see it. This ticket's own brief says so:
   *"two hours at pressure is not eleven hours of simmering made faster, it is a different
   extraction that produces a different, cloudier stock."*

3. **`chicken-broth.cook`, step 4**: an 8 hr chill to lift the fat cap. That is 8 of the
   11 hr 30 on the page and pressure gives none of it back. A variant that keeps the chill
   barely improves the clock.

4. **`boston-baked-beans.cook`, step 6**: 5 hr at 300 °F, *"uncovering for the last half
   hour."* `docs/gaps/instant-pot.md:120` already concedes the point: the long bake is doing
   flavour work — molasses, salt pork, a lid off at the end — that pressure does not
   reproduce.

Three carry an overnight soak the pot is supposed to make unnecessary:
`cuban-black-beans` ("soaked overnight"), `refried-beans` ("soaked overnight"),
`boston-baked-beans` ("soaked overnight"), `gigantes-plaki` ("soaked overnight"), and
`ful-medames` (an explicit `~soak{12%hr}` timer).

## 6. Bean times: what the sources actually say, and how far apart they are

This is the dangerous part of the ticket, so the spread is worth recording rather than
averaging away. All figures are minutes at **high pressure**, from **dry and unsoaked**,
with a natural release, unless marked.

| Bean | `docs/gaps/instant-pot.md` | Instant Pot published chart | Third-party tested charts |
| --- | --- | --- | --- |
| black | 25 | 20–25 | 30 |
| pinto | 25 | 25–30 | 30–40 |
| navy | — | 20–25 | 30 |
| chickpea | 35 | 35–40 | 50 |
| lima / butter | — | 12–14 | 25 |
| black-eyed pea | — | 14–18 | 17 |
| fava, dried | — | — | 28 (split/skinned) |
| great northern | — | — | 35 |

The charts disagree by up to 60%. They agree on the shape: unsoaked is roughly two to four
times soaked, and larger and older beans take longer. Nobody publishes a figure for
**gigante / corona** beans, which are half again the size of a great northern.

Two facts that bear on which end of a range to take:

- Undercooked beans are the failure that matters. Overcooked beans are soft; undercooked
  beans are inedible, and for **kidney beans** specifically the phytohaemagglutinin case
  makes it a real hazard. No dish in this ticket's list uses kidney beans.
- **Acid and sugar stall softening.** `cuban-black-beans` finishes with wine and vinegar;
  `boston-baked-beans` cooks in molasses; `gigantes-plaki` cooks in tomato. In a sealed pot
  those cannot be added late by stirring — the writer has to sequence around them.
- **Quick release splits beans** (`docs/gaps/instant-pot.md:145`) and, for starchy pots,
  sprays foam through the valve. Every bean and every porridge here wants natural release.

## 7. Stock and porridge times, sourced

| Dish | Figure found | Where |
| --- | --- | --- |
| pho broth | 60 min HP + 30 min natural release | Amy + Jacky, `pressurecookrecipes.com/instant-pot-pho/`, fetched |
| chicken stock | 45 min HP | Alton Brown / Kitchn / Saveur pressure-cooker stock recipes |
| chicken bone broth | 2 hr HP | Paint The Kitchen Red chart, fetched |
| tonkotsu | 90 min HP | `docs/gaps/instant-pot.md:63` — "Ninety minutes under pressure" |
| seafood stock | 30 min HP, natural release | Paint The Kitchen Red chart, fetched |

Congee has no chart entry anywhere; published Instant Pot congee recipes cluster at 20–30
min high pressure at a 1:8 to 1:10 rice-to-liquid ratio with a full natural release.

## 8. Authoring constraints that will shape every file

From `README.md` and the story's "Conventions every ticket follows":

- 5–16 ingredient rows, **3–6 operations**. Operations are columns and columns break a
  phone. A pressure variant naturally wants sauté → seal → pressure → release → reduce,
  which is already five if each is its own step.
- One table, a merge tree, exactly one unreferenced ending, no splits.
- Every step after the first states what it consumes: `@&(~1)thing{}`.
- A step with no ingredients is a full-width row and **must be at the top**, because `~1`
  counts every step including prep ones.
- Required metadata `title`, `category`, `tags`, `servings`, `counters`; then `aka` and
  `pairs-with` (slugs, verified, made mutual at build time by `parse-recipes.mjs:84-101`).
- `>> time:` is not a promoted key; it lands in `metadata` and renders as the "about" line
  at `src/pages/[slug].astro:42`. Every plain file in both folders carries one, so the
  variants should, and it must agree with the timers in the file.
- `>> step.N:` overrides a derived cell label, 1-based over steps as written.

## 9. Ownership and blast radius

- Files created: `recipes/soups/*.cook` and `recipes/rice-beans-and-grains/*.cook`, new
  basenames only. Basenames are URLs and globally unique (`parse-recipes.mjs:32-37`).
- Files edited: none. Not the plain recipes, not `counters.json`, not `docs/gaps/`, not
  `src/`.
- `pairs-with` is made mutual **in the generated data**, not in the other file, so naming a
  pairing does not edit anything.
- `src/generated/` is not committed, so `npm run recipes` and `npm run verify` are safe to
  run and produce nothing to commit.
