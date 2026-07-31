# T-002-03 — Progress

**Status: complete.** Twelve new `.cook` files, five commits, `npm run verify` green.

## Commits

| SHA | Message | Files |
| --- | --- | --- |
| `6c3a6d5` | Put the stockpot under a lid | 5 stocks and broths |
| `72ce24e` | Beans from dry, no soak | 4 beans, unsoaked |
| `f7955f3` | The porridge and the beet pot | congee, borscht |
| `0facdb8` | The one soak the pot does not take away | gigantes-plaki |
| `0c59a09` | Give every pressure cell a verb the icons know | all 12, label fix (see Deviation 2) |

All five through `lisa commit-ticket` with exact `--include` paths. `git status --porcelain`
over both folders is empty. Every commit is insertions only, except `0c59a09`, which changes
only `>> step.N:` lines in the twelve files this ticket created.

## Where every number came from

**No time in any of these files is derived from the plain recipe's duration.** Sources are
lettered as in `design.md` D2: (a) the repo's own table in `docs/gaps/instant-pot.md`,
(b) a fetched tested recipe, (c) published pressure-cooking charts and practice.

| File | Timer | Source |
| --- | --- | --- |
| tonkotsu | `~pressure cook{90%min}` | **(a)** `docs/gaps/instant-pot.md:63`, "Ninety minutes under pressure" |
| tonkotsu | `~boil{20%min}` lid off | (c) every published pressure-tonkotsu recipe finishes with an uncovered hard boil; it is the emulsion step, not a time to be shortened |
| pho broth | `~pressure cook{60%min}` + `~natural release{30%min}` | **(b)** Amy + Jacky, `pressurecookrecipes.com/instant-pot-pho/`, fetched during Research: "High pressure for 1 hour + Natural release for 30 minutes" |
| chintan | `~pressure cook{60%min}` | (c) published pressure-cooker chintan practice runs 60–90 min for chicken frames plus pork neck; 60 taken with a full natural release |
| chicken broth | `~pressure cook{45%min}` | (c) 45 min is the figure Alton Brown, The Kitchn and Saveur all publish for pressure-cooker chicken stock. Deliberately **not** the 2 hr that charts give for *bone broth*, which is a different product |
| ham hock stock | `~pressure cook{45%min}` | (c) smoked-hock stock practice, 45–60 min; 45 is where the meat comes off the bone without shredding to nothing |
| ful medames | `~pressure cook{45%min}` from dry | (c) whole skin-on brown ful, unsoaked, 40–45 min. The 28 min in the general charts is for split or skinned dried fava, which is a different bean and is called out in the file |
| cuban black beans | `~pressure cook{30%min}` from dry | (c) black beans from dry, published 20–30; top of range (D2) |
| refried beans | `~pressure cook{40%min}` from dry | (c) pinto from dry, published 25–40; top of range, because the plain file's own target is "completely soft" before a mash |
| congee | `~pressure cook{30%min}` | (c) published Instant Pot congee clusters at 20–30 min at 1:8 rice to liquid; top of range |
| borscht | `~pressure cook{40%min}` | **(a)** `docs/gaps/instant-pot.md:141`, "short rib at 40" |
| boston baked beans | `~pressure cook{30%min}` then `{10%min}` | (c) navy from dry, published 20–30, top of range; the 10 min second leg is the molasses going in, not more bean cooking |
| gigantes plaki | `~soak{12%hr}` then `~pressure cook{20%min}` | (c) large white bean, **soaked**, 15–20 min; top of range. No source publishes an unsoaked gigante figure, which is why the soak stays (D3) |

Natural release durations are the pot's own behaviour rather than a recipe's choice: 15–30
min depending on how full the pot is and how much liquid it holds. They are written long
enough to be honest and are named so the clock reads them as walk-away.

## Skipped, and why

**Named in the ticket's own Context but out of its folders.** The acceptance criteria
restrict this ticket to `rice-beans-and-grains/` and `soups/`; the Context names two dishes
that are not there. Criteria win.

- **`chana-masala`** — `recipes/stews-and-braises/chana-masala.cook`. Inside the folder
  T-002-02 owns, so writing it would also be a two-writer collision on one dish.
- **`hummus`** — `recipes/dressings-and-dips/hummus.cook`. Out of both folders.

**Ranked above the cut but in another ticket's folder.** Everything at gaps ranks 3, 5, 6,
7, 8, 10, 11, 12, 13, 14, 16–23, 29 and 30 lives in `recipes/stews-and-braises/` —
`birria-de-res`, `carnitas`, `pot-roast`, `braised-short-ribs`, `chashu`, `oxtails`,
`cachete`, `beef-bourguignon`, `lengua`, `corned-beef`, `chile-verde`, `chili-con-carne`,
`hungarian-goulash`, `osso-buco`, `lamb-tagine`, `collard-greens`, `suadero`, `tripas`,
`red-braised-pork-belly`, `beef-stew`. All T-002-02's. `collard-greens` is the one worth
naming explicitly, because it reads like a bean pot and is not one on this shelf.

**In folder, below the count reach.** Written in ranked order until twelve were done, which
stopped after gaps rank 31 plus one from the tail. Not written: `black-eyed-peas`,
`butter-beans`, `hoppin-john`, `split-pea-soup`, `black-bean-soup`, `harira`,
`matzo-ball-soup`, `pho-ga`, `kitchari`, `lo-mai-gai`, `dashi`, `biryani`. Two of those
would be skips even with more budget:

- **`dashi`** steeps for ten minutes. Pressure has nothing to give it.
- **`biryani`** is `docs/gaps/instant-pot.md:174`'s own example of what the pot cannot
  stock: layered and steamed so the rice stays in grains, and pressure gives it one texture.

## Deviations from the plan

**Deviation 1 — operation counts.** `structure.md` guessed four operations for chintan and
five for pho; both landed one higher (five and six) once the release became its own cell and
the aromatics moved out of the pressure leg. Both are inside README's 3–6. Every file's
final shape is in the `check-recipes.mjs --labels` output above.

**Deviation 2 — the icon test, and a shelf-wide gap it exposed.** `npm run verify` failed on
`src/lib/icons.test.ts:273`, which requires the **first word of every operation label** to be
a word `matchOperation()` knows. The natural vocabulary of this shelf is not:

```
9 verb(s) fall through: beets, cold, dry, full, molasses, natural, pressure, rice, stock
```

`pressure` and `natural` are the two that matter — `>> step.N: pressure cook 90 min` and
`>> step.N: natural release 30 min` are exactly what the story tells writers to name, and
`src/lib/icons.ts` has no entry for either. T-002-01 taught `src/lib/time.ts` the
pressure-cooker words and did not teach `icons.ts` the same words.

This ticket may not touch `src/`, so the fix was in the twelve files: every cell label now
opens with a verb already in `VERB_ICONS`.

- `pressure cook 90 min` → **`cook at high pressure 90 min`** (`cook` → flame)
- `natural release 30 min` → **`wait out the natural release 30 min`** (`wait` → hourglass,
  which is the right picture for it)
- and seven one-off openings reworded: `cover with cold water…`, `cook … from dry…`,
  `stir the molasses in…`, `simmer the beets…`, `return the ribs to the stock…`.

**The timer names were not changed.** `~pressure cook{}` and `~natural release{}` are still
what every file writes, so `src/lib/time.ts` still reads them as unattended from the name.
Only the cell captions moved. Flagged for T-002-08/T-002-09 in `review.md`.

## Verification run

```
node scripts/check-recipes.mjs --labels <all 12>     → ok, 12 files, 8–15 rows × 5–6 cols
npm run recipes                                      → parsed 553 recipe(s), 0 errors
npm run verify                                       → Test Files 8 passed, Tests 720 passed,
                                                       573 page(s) built
```

Variant probe over `src/generated/recipes.json`, before the label fix and again after:

```
kit files (mine): 12 | every one paired 1:1 with its plain file
unnamed timers: 0 across all twelve
pressure and release timers: 26, every one attention='unattended', source='name'
```
