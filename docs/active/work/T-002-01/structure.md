# T-002-01 — Structure

The shape of the change, file by file. Five files touched, none created outside `docs/gaps/`.

| File | Action | Size of change |
| --- | --- | --- |
| `src/data/counters.json` | modify | +3 array entries, ~90 lines |
| `src/lib/time.ts` | modify | +8 words in one set, +6 lines of comment |
| `docs/gaps/bowl-shop.md` | create | ~135 lines |
| `docs/gaps/instant-pot.md` | create | ~135 lines |
| `docs/gaps/one-pot.md` | create | ~125 lines |

Nothing under `recipes/`, `src/generated/`, `scripts/` or `src/lib/*.test.ts` changes.
`docs/gaps/README.md` is deliberately left alone (design D3.3).

---

## 1. `src/data/counters.json`

Appended to the end of the `counters` array, after `Meat and Three`, in the ticket's order. The
array is not otherwise reordered — position is menu order on the front door only through
`menus()`, which sorts by recipe count, so appending is inert.

Each entry keeps the five-key order the fifteen use: `name`, `slug`, `blurb`, `categories`,
`sections`. Two-space indent, matching `JSON.stringify(file, null, 2)` — which is what
`menu-sections.mjs:134` would rewrite the file with, so staying byte-compatible with that
formatter matters.

```
{
  "name": "The Bowl Shop",
  "slug": "bowl-shop",
  "blurb": "Pick a base, pile it up, dress it last.",
  "categories": [],
  "sections": [
    { "title": "Grain bowls",            "items": [] },
    { "title": "Leafy salads",           "items": [] },
    { "title": "What goes on top",       "items": [] },
    { "title": "Roasted vegetables",     "items": [] },
    { "title": "Dressings and drizzles", "items": [] },
    { "title": "Soups",                  "items": [] },
    { "title": "Also here",              "items": [] }
  ]
}
```

```
{
  "name": "Instant Pot",
  "slug": "instant-pot",
  "blurb": "Lock the lid and walk away; it gets there on its own.",
  "categories": [],
  "sections": [
    { "title": "Braises that took all afternoon", "items": [] },
    { "title": "Beans from dry",                  "items": [] },
    { "title": "Stocks and broths",               "items": [] },
    { "title": "Rice, grains and porridge",       "items": [] },
    { "title": "Whole birds and big cuts",        "items": [] },
    { "title": "Also here",                       "items": [] }
  ]
}
```

```
{
  "name": "One Pot",
  "slug": "one-pot",
  "blurb": "Everything goes in one pan, and that is the only pan to wash.",
  "categories": [],
  "sections": [
    { "title": "Braises and stews",              "items": [] },
    { "title": "Skillet dinners",                "items": [] },
    { "title": "Rice and grains that cook in",   "items": [] },
    { "title": "Soups that are the whole meal",  "items": [] },
    { "title": "Also here",                      "items": [] }
  ]
}
```

(The alignment above is for reading here; the file gets one key per line, as the fifteen have.)

**Invariants this must not break**

- `.counters.length === 18` and the file parses — read by four call sites:
  `check-recipes.mjs:22`, `parse-recipes.mjs:21`, `counters.ts:23`, `collection.test.ts:8`.
- `categories: []` on all three, so `parse-recipes.mjs:62-68` re-shelves nothing.
- `items: []` everywhere, so `counters.ts:78-83` and `[counter].astro:12-18` drop all three from
  the built site.
- No duplicate `name` or `slug` against the fifteen — checked before writing.

---

## 2. `src/lib/time.ts`

One set changes. `HANDS_ON` and `NOT_A_VERB_IN_A_SENTENCE` are untouched, and no function body,
signature or export moves — so the public interface (`minutesOf`, `formatDuration`, `attentionOf`,
`readTimers`, `Attention`, `AttentionSource`, `Reading`) is unchanged.

`UNATTENDED` (currently `:42-48`) gains a line, and the file gains a short comment above the set
explaining the one word that carries risk. Words go in normalised form — lowercase, no spaces, no
hyphens — because `normalise()` at `:83` strips both before the lookup at `:163`.

Added:

```
'pressure', 'pressurecook', 'pressurecooking', 'pressurerelease',
'naturalrelease', 'naturalpressurerelease', 'quickrelease',
'cometopressure', 'keepwarm',
```

Comment to add, in the register of the existing ones (which explain *why a word is trusted*, using
the case that forced it):

> A pressure cooker's whole point is that the wait is sealed, so every one of these is time you
> are not there for. `pressure` is listed bare as well as compounded, because it is the one word
> an unnamed timer's step reliably contains — "cook at high pressure 35 min" — and it does not
> occur anywhere in the 514 files today, so it has no prose meaning here to lie about. `release`
> is deliberately *not* here on its own: "what makes the shell release" (`ajitama`) and "until the
> mushrooms release their liquid" are the hands doing work, which is the exact trap
> `NOT_A_VERB_IN_A_SENTENCE` was built for.

**Resolution path after the change**, for the two acceptance cases:

- `~pressure cook{35%min}` → `normalise` → `pressurecook` → `UNATTENDED.has` at `:163` →
  `{ unattended, 'name' }`. Independent of the step label, so it holds for every phrasing.
- `~natural release{15%min}` → `naturalrelease` → same branch → `{ unattended, 'name' }`.

**Regressions the change must not cause** (each is an existing green test):

- `attentionOf('blind bake', 'bake the shell 20 min')` stays `{ unattended, 'name' }` —
  the fall-through on an unknown name is not touched.
- `attentionOf(null, 'toast in a dry skillet 3 min')` stays `{ hands-on, 'label' }` —
  `NOT_A_VERB_IN_A_SENTENCE` unchanged.
- `readTimers` region-splitting behaviour is unchanged; a sauté timer beside a pressure timer in
  one step still reads hands-on from its own slice.
- `collection.test.ts` "never claims four unbroken hours of your attention" stays green. The
  change can only ever move a timer *from* hands-on *to* unattended, so it cannot add a new
  violation — it can only remove one.

---

## 3. The three gap notes

All three follow the fifteen. Common skeleton:

```
# <Counter> — what is missing

**<lede: what the shelf is, what is already here, what the next ticket is.>**

---

## What is already here

<one-line note on why this heading is not "What it has" yet>

**Section title.** slug · slug · slug
…

---

## What it is missing

1. **Dish name** — why, in menu language.
…

---

## Components it would need

- **Thing** — what waits on it.

---

## What it could not stock

- **Thing** — the reason a single table cannot hold it.
```

The `**Section title.** slug · slug` line shape is kept exactly so that T-002-08's edit is a
heading rename and nothing more. Section titles carry no ` — ` (`menu-sections.mjs:55`).

### 3a. `docs/gaps/bowl-shop.md`

Already-here block, grouped under the seven section titles from the counter entry. Slugs verified
against `src/generated/recipes.json`:

- **Grain bowls** — `rice-pilaf`, `lemon-rice`, `coconut-rice`, `yellow-rice`, `mujaddara`,
  `tabbouleh`, `mexican-red-rice`, `pilau-rice`, `kitchari`, `polenta`, `cheese-grits`,
  `mushroom-risotto`, `risotto-alla-milanese`, `bun-thit-nuong`, `com-tam`, `hoppin-john`,
  `cuban-black-beans`, `refried-beans`, `ful-medames`, `gigantes-plaki`, `black-eyed-peas`,
  `butter-beans`
- **Leafy salads** — `fattoush`, `kachumber`, `som-tum`, `larb-gai`, `coleslaw`, `barbecue-slaw`,
  `potato-salad`, `macaroni-salad`, `chicken-salad`, `egg-salad`, `tuna-salad`, `whitefish-salad`
- **What goes on top** — `chicken-shawarma`, `karaage`, `falafel`, `paneer`, `queso-fresco`,
  `labneh`, `ajitama`, `birista`, `dukkah`, `sumac-onions`, `do-chua`, `kabis`, `sauerkraut`,
  `sour-dill-pickles`, `menma`, `guacamole`
- **Roasted vegetables** — `batata-harra`, `green-beans`, `candied-yams`, `stewed-squash`,
  `creamed-corn`, `mashed-potatoes`, `fried-okra`
- **Dressings and drizzles** — the 40-file drawer, minus the ones shelved above:
  `basic-vinaigrette`, `caesar-dressing`, `green-goddess-dressing`, `ranch-dressing`,
  `blue-cheese-dressing`, `honey-mustard-dressing`, `russian-dressing`, `miso-ginger-dressing`,
  `goma-dare`, `tahini-sauce`, `toum`, `tzatziki`, `raita`, `nuoc-cham`, `mint-chutney`,
  `mango-chutney`, `lime-pickle`, `chimichurri`, `basil-pesto`, `romesco`, `muhammara`, `hummus`,
  `baba-ganoush`, `aioli`, `mayonnaise`, `crema-mexicana`, `white-sauce`, `cream-cheese`,
  `scallion-schmear`, `chopped-liver`, `pork-liver-pate`, `ginger-scallion-oil`,
  `pomegranate-molasses`
- **Soups** — `butternut-squash-soup`, `potato-leek-soup`, `tomato-soup`, `red-lentil-soup`,
  `corn-chowder`, `minestrone`, `dal-tadka`, `black-bean-soup`, `caldo-verde`, `miso-soup`
- **Also here** — `salsa-verde-cruda`, `salsa-roja`, `homemade-ketchup`, `teriyaki-sauce`

Missing list, ranked most conspicuous first, named the way the boards name them: the signature
bowls (Harvest, Kale Caesar, Shroomami, Chicken Teriyaki, Mediterranean Hummus), the roasted
vegetable line the shelf genuinely lacks, the crunchy toppings, the grain bases, and the wrap.

### 3b. `docs/gaps/instant-pot.md`

The ranked list here is drawn from what is already on the shelf, ordered by how much the pot
helps — that is, by unattended braise/bean/stock minutes the pot collapses, not by appetite. The
already-here block groups the same slugs under the five section titles. **At least 25 named with
slugs** (AC 6); the draft carries 40+, which is what the arithmetic supports:

- Braises that took all afternoon (18): `corned-beef` 7550 min unattended, `vindaloo` 780,
  `chashu` 660, `birria-de-res` 240, `pot-roast` 240, `oxtails` 185, `beef-bourguignon` 180,
  `braised-short-ribs` 180, `cachete` 180, `carnitas` 180, `lengua` 180, `hungarian-goulash` 150,
  `lamb-tagine` 150, `beef-stew` 135, `irish-stew` 130, `chile-verde` 120, `osso-buco` 120,
  `collard-greens` 120
- Beans from dry (9): `boston-baked-beans` 330, `ful-medames` 810, `cuban-black-beans` 120,
  `gigantes-plaki` 130, `black-eyed-peas` 75, `butter-beans` 70, `refried-beans` 90,
  `split-pea-soup` 75, `hoppin-john` 50
- Stocks and broths (6): `chicken-broth` 660, `tonkotsu-broth` 540, `chintan-broth` 510,
  `pho-broth` 360, `ham-hock-stock` 180, `consome-de-birria`
- Rice, grains and porridge (5): `congee` 90, `biryani` 170, `kitchari`, `polenta`, `cheese-grits`
- Whole birds and big cuts (5): `soy-sauce-chicken`, `white-cut-chicken`, `chicken-feet`,
  `red-braised-pork-belly`, `suadero`
- Also here (3): `harira`, `chana-masala`, `japanese-beef-curry`

Excluded on purpose, and said so in the file: anything whose long wait is a rise, a cure or a
chill (`pastrami`, `sauerkraut`, `sour-dill-pickles`, `belly-lox`, every bread), because the pot
does nothing for a ferment.

### 3c. `docs/gaps/one-pot.md`

Grounded in the parsed `cookware` field rather than the title, so the claim is one the file
already makes.

- **Braises and stews** — the `Dutch oven` / `heavy pot` / `pot` / `cazuela` / `tagine` list:
  `beef-stew`, `pot-roast`, `chili-con-carne`, `beef-bourguignon`, `coq-au-vin`,
  `braised-short-ribs`, `osso-buco`, `carnitas`, `cachete`, `chile-verde`, `birria-de-res`,
  `collard-greens`, `oxtails`, `irish-stew`, `hungarian-goulash`, `lamb-tagine`,
  `massaman-curry`, `beef-rendang`, `rogan-josh`, `vindaloo`, `dansak`, `passanda`,
  `japanese-beef-curry`, `doro-wat`, `brunswick-stew`, `red-braised-pork-belly`
- **Skillet dinners** — `smothered-pork-chops`, `chicken-adobo`, `tinga-de-pollo`, `xiu-mai`,
  `corned-beef-hash`, `home-fries`, `hash-browns`, `western-omelette`, `egg-foo-young`,
  `pad-krapow`, `country-fried-steak`, `breakfast-sausage-patties`, `creamed-chipped-beef`
- **Rice and grains that cook in** — `jambalaya`, `dirty-rice`, `jollof-rice`, `mexican-red-rice`,
  `hoppin-john`, `kitchari`, `mujaddara`, `biryani`, `mushroom-risotto`, `risotto-alla-milanese`,
  `pilau-rice`, `rice-pilaf`, `lemon-rice`, `coconut-rice`, `congee`
- **Soups that are the whole meal** — `minestrone`, `chicken-noodle-soup`, `caldo-verde`,
  `harira`, `split-pea-soup`, `new-england-clam-chowder`, `corn-chowder`, `borscht`,
  `black-bean-soup`, `hot-and-sour-soup`, `wonton-soup`, `matzo-ball-soup`
- **Also here** — `macaroni-and-cheese`, `baked-ziti`, `meatballs`, `tuna-noodle-casserole`

---

## Ordering of changes

1. `src/data/counters.json` — the writers' gate, and what the AC 3 demonstration needs.
2. `src/lib/time.ts` — independent; verified by a suite that does not read the counters.
3. `docs/gaps/*.md` — needs nothing from either, and is the longest.

Three commits through `lisa commit-ticket`, one per step, with exact `--include` paths.
