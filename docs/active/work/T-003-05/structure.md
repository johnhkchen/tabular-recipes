# T-003-05 — Structure

Twenty new files. Nothing modified, nothing deleted, nothing outside `recipes/**`.

## Files created

```
recipes/stews-and-braises/pot-roast-slow-cooker.cook
recipes/stews-and-braises/chili-con-carne-slow-cooker.cook
recipes/stews-and-braises/carnitas-slow-cooker.cook
recipes/stews-and-braises/corned-beef-slow-cooker.cook
recipes/stews-and-braises/birria-de-res-slow-cooker.cook
recipes/stews-and-braises/cachete-slow-cooker.cook
recipes/stews-and-braises/oxtails-slow-cooker.cook
recipes/stews-and-braises/braised-short-ribs-slow-cooker.cook
recipes/stews-and-braises/beef-stew-slow-cooker.cook
recipes/stews-and-braises/chile-verde-slow-cooker.cook
recipes/stews-and-braises/collard-greens-slow-cooker.cook
recipes/stews-and-braises/hungarian-goulash-slow-cooker.cook
recipes/rice-beans-and-grains/boston-baked-beans-slow-cooker.cook
recipes/stews-and-braises/osso-buco-slow-cooker.cook
recipes/stews-and-braises/lamb-tagine-slow-cooker.cook
recipes/stews-and-braises/irish-stew-slow-cooker.cook
recipes/stews-and-braises/new-england-boiled-dinner-slow-cooker.cook
recipes/stews-and-braises/brunswick-stew-slow-cooker.cook
recipes/stews-and-braises/soy-sauce-chicken-slow-cooker.cook
recipes/stews-and-braises/baked-turkey-wings-slow-cooker.cook
```

Each lands in the same folder as its plain file, so `category` matches the folder and nothing
needs a category override. Basenames are unique across the collection (checked: no
`*-slow-cooker` file exists today).

## The metadata block, identical in shape across all twenty

```
>> title: <Plain Title>, Slow Cooker
>> category: <copied verbatim from the plain file>
>> tags: <plain tags, minus oven/stovetop method tags> + slow cooker, crock pot
>> counters: The Slow Cooker
>> dish: <plain slug, confirmed with ls>
>> kit: Slow Cooker
>> aka: <plain aka> + "slow cooker <dish>", "crockpot <dish>"
>> pairs-with: <copied verbatim from the plain file, where it has one>
>> servings: <plain servings, adjusted only where the crock's capacity forces it>
>> time: <wall clock: skillet legs + slow cook + finish>
>> slack: <level> — <the actual failure>
>> step.N: <label per operation; the long stretch names the setting>
```

Method tags come out and go in deliberately: `oven`, `stovetop`, `roast` describe a vessel this
file does not use. `braise`, `stew`, `one-pot` stay because they describe the dish.

## The operation skeleton

Three to six operations, per the authoring contract. The shelf's shape is four or five:

```
[optional] prep / a full-width note        ← only at the very top, because ~1 counts every step
1  brown or sear in a skillet              ~brown / ~sear      hands-on
2  soften the aromatics, deglaze, scrape into the crock
3  slow cook on low                        ~slow cook{N%hr}    UNATTENDED  ← the shelf's promise
4  [staggered addition, where the method needs one]
5  thicken lid-off on high, or finish      ~thicken / ~reduce / ~broil
```

Files that waive browning drop step 1 and merge 2 into 3, which keeps them at three or four
operations. Every file ends in exactly one unreferenced step; no step is consumed twice.

## Per-file blueprint

Columns: **liq** = what the carried-over liquid was cut to; **brown** = skillet / oven / waived;
**finish** = the last operation. Times are the sourced ones from `design.md`.

| File | Ops | Slow cook | liq | brown | finish | slack |
| --- | --: | --- | --- | --- | --- | --- |
| pot-roast | 5 | low 8 hr | 3 c → 1½ c | skillet | thicken 20 min high | forgiving |
| chili-con-carne | 5 | low 8 hr | 3 c stock → 1 c | skillet | masa slaked in, 20 min high | forgiving |
| carnitas | 4 | low 8 hr | 2 c water → none added | skillet | broil 10 min | narrow |
| corned-beef | 4 | low 9 hr + 1 hr | to barely cover, ~2 qt | waived (cured, simmered) | rest 20 min, carve | narrow |
| birria-de-res | 5 | low 8 hr | 4 c → 2½ c | skillet (chiles toasted) | skim, separate the consomé | forgiving |
| cachete | 4 | low 8 hr | 2 c → ¾ c | skillet | shred, salt | forgiving |
| oxtails | 5 | low 9 hr | 5 c → 2 c | skillet | lift the set fat, thicken 20 min high | forgiving |
| braised-short-ribs | 5 | low 7 hr | 7 c → 3 c | skillet | reduce in a pan 15 min | forgiving |
| beef-stew | 5 | low 8 hr | 5 c → 2½ c | skillet | thicken 20 min high | forgiving |
| chile-verde | 4 | low 8 hr | 2 c stock → 1 c | skillet | lime, uncovered 20 min high | forgiving |
| collard-greens | 4 | low 7 hr | 3 qt → 2 c | skillet (bacon rendered) | season, pot likker | narrow |
| hungarian-goulash | 5 | low 8 hr | 4 c → 2 c | skillet (paprika bloomed off-heat) | potatoes last 2 hr, sour cream off-heat | narrow |
| boston-baked-beans | 5 | low 8 hr + 30 min high | 2 c + parboil water | waived (nothing to brown) | reduce lid-off 30 min high | narrow |
| osso-buco | 5 | low 6 hr | 3 c → 1½ c | skillet | gremolata scattered | narrow |
| lamb-tagine | 5 | low 8 hr | 2 c → 1 c | skillet | apricots last 1 hr, honey | forgiving |
| irish-stew | 4 | low 8 hr | 4 c → 2 c | **waived, stated** | parsley, pepper | forgiving |
| new-england-boiled-dinner | 5 | low 8 hr + 1 hr + 1 hr | to cover, ~3 qt | **waived, stated** | rest 15 min, carve | narrow |
| brunswick-stew | 4 | low 6 hr | 4 c → 3 c | skillet (onion sweated) | corn and limas last 30 min | forgiving |
| soy-sauce-chicken | 4 | low 4 hr | 8 c → 5 c | **waived, stated** | rest 20 min, sesame, chop | unforgiving |
| baked-turkey-wings | 4 | low 6 hr | 4 c gravy → 2½ c | **oven, 40 min at 425 °F** | thicken 20 min high | forgiving |

Ingredient-row counts land between 8 and 15 in every file — inside the 5–16 contract. The two
widest (`corned-beef`, `new-england-boiled-dinner`) carry their aromatics as a single row each
where the plain file split them, to stay under 16.

## Where the `>> dish:` line points

Confirmed with `ls recipes/*/<slug>.cook` before writing, per the ticket. Every one resolved:

```
pot-roast chili-con-carne carnitas corned-beef birria-de-res cachete oxtails
braised-short-ribs beef-stew chile-verde collard-greens hungarian-goulash
osso-buco lamb-tagine irish-stew new-england-boiled-dinner brunswick-stew
soy-sauce-chicken baked-turkey-wings        → recipes/stews-and-braises/
boston-baked-beans                          → recipes/rice-beans-and-grains/
```

Thirteen of these already carry an `-instant-pot` sibling, so those thirteen pages will show the
three-way choice. The check for that is a `ls` of the `-instant-pot` files, not an assumption.

## Interfaces this work touches, and does not change

| Thing | How it is used | Changed? |
| --- | --- | --- |
| `src/data/counters.json` | the string `The Slow Cooker` is validated against it | no |
| `src/lib/time.ts` | `~slow cook` already reads as unattended | no |
| `src/lib/slack.ts` | three levels, reason required | no |
| `scripts/check-recipes.mjs` | run per file with `--labels` | no |
| plain `.cook` files | named by `>> dish:`, never opened for writing | no |
| `-instant-pot.cook` files | not read, not written; the count is confirmed with `ls` | no |

## Ordering

The files are independent — twenty new files in two folders, no shared state. The order below is
the gap file's reading order, so the twelve that make the three-way choice visible exist first and
the shelf is useful even if the run is interrupted:

1. The twelve with an Instant Pot sibling, in the gap file's rank order.
2. `hungarian-goulash` (the thirteenth sibling) and the six without one.
3. `baked-turkey-wings` last, as the twentieth.

Each batch is checked with `node scripts/check-recipes.mjs --labels <paths>` before it is
committed, and committed through `lisa commit-ticket` with exact paths.
