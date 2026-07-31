# T-002-01 — Research

What exists, where, and how it connects. No solutions here.

## The mechanical reason six writers are blocked

Counter names are validated in two places, both reading the same file:

- `scripts/check-recipes.mjs:22-26` builds `KNOWN_COUNTERS` from
  `src/data/counters.json` → `.counters[].name`, and at `:55-61` turns any `>> counters:` value
  not in that set into a `unknown counter "X" — known: …` problem, which makes the file fail.
- `scripts/parse-recipes.mjs:21-22, 52-60` does the same, but `throw`s — so one bad counter name
  kills the whole build rather than one file.
- `src/lib/collection.test.ts:29-32` asserts the same invariant across the generated collection
  (`only names counters that exist`).

So the gate is exactly the `name` string, and nothing else about the counter entry. A writer's
`.cook` file cannot even be checked until the name is in that JSON.

## `src/data/counters.json`

1361 lines. Top-level shape is `{ "//": <long prose comment>, "counters": [ … ] }`. 15 entries
today. Each entry:

```
{ "name", "slug", "blurb", "categories": [ … ], "sections": [ { "title", "items": [slug…] } … ] }
```

- `name` is the display name and the token a recipe writes in `>> counters:`.
- `slug` is the URL segment (`/menu/<slug>`), and `src/lib/meta.ts` `slugify()` is what other code
  derives one with — worth matching by hand rather than relying on it.
- `blurb` is one sentence, and it is **an instruction to the visitor standing there**, not a
  description of the cuisine. All fifteen read this way:
  - Panadería — "Take a tray and tongs, fill it, pay at the register."
  - Taquería — "Pick a filling, then pick what it goes in."
  - Ramen Shop — "Choose the broth first; everything else follows."
  - Deli — "Sliced, spread, and sold by the tub."
  - Meat and Three — "One meat, three sides, cornbread whether you ask or not."
  Second person or imperative, no cuisine adjectives, no "featuring".
- `categories` is a **fallback only** (documented in the `//` comment and implemented at
  `parse-recipes.mjs:62-68`): a recipe naming *no* counter inherits the counters whose
  `categories` claim its `category`. Nine of the fifteen carry `[]`. Adding a category to a new
  counter would silently re-shelve existing recipes.
- `sections` is the menu order. Consumed by `src/lib/counters.ts` `menuFor()`.

**Empty sections are safe.** `counters.ts:78-83` filters out any section whose items resolve to
zero recipes, and `menus()` at `:109-114` plus `src/pages/menu/[counter].astro:12-18`
`getStaticPaths` both drop counters with `count === 0`. A counter with three empty-item sections
renders nothing and generates no page — which is what the `//` comment already promises
("a counter with nothing on it simply does not render").

## The gap notes and the parser that reads them back

`docs/gaps/` holds 15 counter files plus `README.md`. Files run 78–120 lines. Shape, consistent
across all fifteen (`deli.md` is the fullest example):

1. `# <Counter> — what is missing`
2. A 2–4 line lede: `**N recipes, M of them only here.**` then what is stocked and what the next
   ticket is.
3. `---`
4. `## What it has` — one `**Section title.** slug · slug · slug` line per section.
5. `## What it is missing` — a numbered, ranked list; bold dish name, em-dash, one or two lines of
   why, in menu language.
6. `## Components it would need` — bulleted sub-recipes the missing dishes wait on.
7. `## What it could not stock` — bulleted, each with the reason a single table cannot hold it.

`scripts/menu-sections.mjs` **machine-reads section 4 only** (`whatItHas()` at `:29-35` searches
for `^## What it has$`). With `--write` it folds the parsed sections into `counters.json`; the
README claims it currently reproduces that file byte for byte. Constraints it imposes on that
block: keep `**Title.** slug · slug`, and keep ` — ` out of titles (`:55` cuts a title there).

Two facts that matter for the three new files:

- The script cross-checks parsed slugs against `recipes.filter(r => r.counters.includes(name))`
  (`:109-112`). For a brand-new counter that no recipe names yet, `mine` is empty, so **every**
  slug listed under a `## What it has` heading would report as `listed but not shelved here`.
- `npm run verify` is `check → recipes → vitest → astro build` (`package.json:19`).
  `menu-sections.mjs` is **not** in it, so the script is a manual tool and cannot fail CI. It is
  still the reason a `## What it has` heading is a loaded name for a list of recipes that live at
  other counters.

`docs/gaps/README.md` carries the cross-counter tally table (recipes / only-here / missing dishes
/ missing components per counter), the build state, and the shelving notes. It records **Bowl
Shop** by name — see below.

## `docs/knowledge/counters.md`

978 lines; the vocabulary source the gap notes draw dish names from. It has per-counter sections
with `| Menu word | aka | What it is |` tables.

The relevant finding at `:960-970`: under **"Archetypes found and deliberately not shelved"**, it
lists **Bowl Shop (poke and donburi)** — i.e. the archetype it recorded under that name is the
Hawaiian/Japanese bowl shop, *not* the Goop-Kitchen/Sweetgreen grain-bowl archetype this ticket
means. `:341` says the same thing from the Ramen Shop's side: "Poke and rice-bowl shops … that is
a different place, not this one." There is **no** entry for Instant Pot or One Pot; neither is a
storefront, which is a real difference in kind from the fifteen — they are equipment shelves
wearing counter clothes.

## `src/lib/time.ts`

172 lines. Three vocabularies and a fall-through:

- `UNATTENDED` (`:42-48`, 46 words) — `rise prove proof ferment rest chill cool freeze set
  marinate brine soak steep bake roast braise simmer steam boil slowcook infuse dry cure age
  refrigerate overnight leave stand sit blindbake parbake prebake autolyse retard thaw defrost
  macerate wilt drain press smoke stew poach`.
- `HANDS_ON` (`:51-55`, 24 words) — `whisk stir knead beat mix fold toss whip roll shape saute fry
  deepfry stirfry sear brown broil temper toast grill flip baste skim churn`.
- `NOT_A_VERB_IN_A_SENTENCE` (`:72`) — `boil dry press`. These three stay trusted as a **timer
  name** but are ignored when merely *spotted in a step's prose*, because "a dry skillet",
  "press in the hot iron" and "boil 1 min a side" were each caught lying.

Fall-through, in `readTimers()` (`:154-172`) — `attentionOf()` is a one-timer wrapper over it:

1. If the timer has a name: `normalise()` it (lowercase, strip spaces and hyphens, so
   `natural release` → `naturalrelease`), then `UNATTENDED` → `hands-on` check → **`source:
   'name'`**.
2. Otherwise `readWords(region)` — the slice of the step label belonging to this timer.
3. Otherwise `readWords(operationLabel)` — the whole step.
4. Otherwise `{ hands-on, default }`.

`readWords()` (`:107-121`) checks UNATTENDED first, then HANDS_ON, and skips any word in
`NOT_A_VERB_IN_A_SENTENCE`.

The key documented property, at `:85-97` and asserted in `time.test.ts:44-59`: **an unrecognised
name must not beat the step it sits in**. Step 1 above falls *through* on an unknown name rather
than returning a default — that is why `~blind bake{20%min}` inside `bake the shell 20 min`
resolves unattended. The ticket's warning ("naming a timer well made the answer *worse*") is this
exact bug, and the fix was the ordering, not a longer list.

Consequence for pressure cooking today: `~pressure cook{35%min}` has an unrecognised name
(`pressurecook`), falls to the step words. If the step says "pressure cook on high 35 min",
`readWords` finds nothing in either set (no `cook` in either list) and lands on
`{ hands-on, default }` — 35 minutes of claimed attention. `~natural release{15%min}` behaves the
same way. Neither word appears anywhere in the file.

Words to watch when adding: `release` is not currently in either set; `pressure` is not; `vent`,
`seal`, `depressurise` are not. `slowcook` is the closest existing precedent for a compound
appliance verb, and it is stored **without** the space because `normalise()` strips whitespace and
hyphens — so `naturalrelease`, `quickrelease`, `pressurecook`, `cometopressure` are the storable
forms.

## The test that catches this class of error

`src/lib/collection.test.ts:77-88`:

```
it('never claims four unbroken hours of your attention', …)
```

flags any timer that is `attention === 'hands-on'` **and** `minutes >= 240`, across all 514
recipes. `:90-95` separately requires every timer to read a duration. Suite today: **7 files, 666
tests, all green** (verified this session). `check-recipes.mjs` on the whole collection: **all 514
files draw a table** (verified this session).

## The collection, as it bears on the three shelves

514 recipes over 27 categories, 623 counter assignments. Category counts relevant here:

| Category | n |
| --- | --: |
| Stews & Braises | 60 |
| Dressings & Dips | 40 |
| Sauces & Gravies | 40 |
| Soups | 34 |
| Rice, Beans & Grains | 29 |
| Smoked & Grilled | 18 |
| Salads | 10 |
| Stir-Fries | 7 |
| Toppings & Pickles | 6 |
| Vegetables & Sides | 6 |

**A correction to the ticket's arithmetic.** It says `recipes/dressings-and-dips/` "holds 41
files". It holds **40** (`ls` and the generated JSON agree, and every file in the folder carries
the `Dressings & Dips` category). Nothing else in the ticket depends on the number.

**Bowl Shop material already on the shelf.** Dressings and drizzles is the deep drawer — 40 files
including `basic-vinaigrette`, `caesar-dressing`, `green-goddess-dressing`, `ranch-dressing`,
`blue-cheese-dressing`, `honey-mustard-dressing`, `miso-ginger-dressing`, `goma-dare`,
`tahini-sauce`, `nuoc-cham`, `toum`, `tzatziki`, `raita`, `hummus`, `baba-ganoush`, `muhammara`,
`romesco`, `basil-pesto`, `chimichurri`, `aioli`. Grains: `rice-pilaf`, `lemon-rice`,
`coconut-rice`, `mujaddara`, `tabbouleh`, `polenta`, `mushroom-risotto`, `yellow-rice`. Leaves and
crunch: `fattoush`, `kachumber`, `som-tum`, `larb-gai`, `coleslaw`, `barbecue-slaw`. Toppings:
`ajitama`, `sumac-onions`, `kabis`, `do-chua`, `birista`, `paneer`, `queso-fresco`, `labneh`,
`dukkah`, `falafel`, `karaage`, `chicken-shawarma`. Roasted vegetables is the thin shelf:
`vegetables-and-sides/` has six files and most are Southern (`candied-yams`, `creamed-corn`,
`green-beans`, `mashed-potatoes`, `stewed-squash`, `cornbread-dressing`), plus `batata-harra` and
`fried-okra` in `fried-and-crispy/`.

**Instant Pot material.** The long-cook shelf is real and measurable. Sorting all 514 by summed
*unattended* minutes gives, above 90 minutes of unattended time and excluding baking/curing:
`corned-beef` (7550), `chashu` (660), `chicken-broth` (660), `tonkotsu-broth` (540), `chintan-broth`
(510), `pho-broth` (360), `boston-baked-beans` (330), `ful-medames` (810), `lo-mai-gai` (390),
`ham-hock-stock` (180), plus the whole `stews-and-braises/` long tail — `beef-bourguignon`,
`braised-short-ribs`, `cachete`, `carnitas`, `lengua`, `oxtails`, `pot-roast`, `osso-buco`,
`birria-de-res`, `chile-verde`, `chili-con-carne`, `collard-greens`, `suadero`, `tripas`,
`irish-stew`, `hungarian-goulash`, `beef-stew`, `lamb-tagine`, `massaman-curry`, `vindaloo`,
`rogan-josh`, `red-braised-pork-belly`, `beef-rendang`, `coq-au-vin`, `japanese-beef-curry`,
`dansak`, `passanda`, `biryani` — and the dry-bean files `cuban-black-beans`, `black-eyed-peas`,
`butter-beans`, `gigantes-plaki`, `refried-beans`, `hoppin-john`, `split-pea-soup`,
`black-bean-soup`, `harira`. That is comfortably over the 25 the acceptance criteria ask for, and
each already has a slug.

**One Pot material.** `stews-and-braises/` (60) is most of it; add the skillet files
(`smothered-pork-chops`, `chicken-adobo`, `corned-beef-hash`, `home-fries`, `hash-browns`,
`western-omelette`), the rice-cooks-in files (`jambalaya`, `dirty-rice`, `jollof-rice`,
`mexican-red-rice`, `hoppin-john`, `kitchari`, `mujaddara`, `mushroom-risotto`,
`risotto-alla-milanese`, `biryani`, `congee`) and the whole-meal soups
(`minestrone`, `chicken-noodle-soup`, `caldo-verde`, `harira`, `split-pea-soup`,
`new-england-clam-chowder`, `corn-chowder`, `hot-and-sour-soup`, `borscht`).

`cookware` is a parsed field on every recipe (`Dutch oven`, `skillet`, `heavy pot`, `wok`,
`stockpot`, `cast-iron skillet`, `cazuela`, `tagine`), which is the honest evidence for a One Pot
claim rather than the recipe's title.

**Equipment variants are already a modelled concept.** `>> kit:` marks a recipe as an equipment
variant of a `dish:` (`parse-recipes.mjs:104-130`), and `collection.test.ts:58-75` enforces that
variants agree on the dish and that at most one plain version exists. So an Instant Pot *version*
of `carnitas` is a `kit:` sibling, not a rename — which is why the Instant Pot gap note is a list
of existing slugs to write siblings for, not a wish list.

## Brand-voice constraints on anything a visitor reads

`CLAUDE.md` (user-global) governs `name`, `blurb` and section titles, since all three are
user-facing: a parlor not a portfolio, plain kitchen-table English, names that are grab-able, and
labels that orient by what you would *do* with the thing. The three names are fixed by the ticket
table. The section titles in the ticket already read this way ("What goes on top", "Beans from
dry", "Braises that took all afternoon", "Rice and grains that cook in") and the ticket invites
improving the wording while keeping the shape.

## Constraints and assumptions carried into Design

1. Only `src/data/counters.json`, `src/lib/time.ts` and `docs/gaps/**` may be modified (AC 8). No
   `.cook` file may be added — the demo file must be a throwaway outside the tracked set.
2. `categories` must be `[]` on all three new counters, or existing recipes silently re-shelve.
3. `sections` must have empty `items` (T-002-08 fills them); the render path already tolerates it.
4. The new gap notes describe recipes shelved at *other* counters, which collides with what
   `menu-sections.mjs` expects under a `## What it has` heading.
5. The time.ts change must not disturb the existing 666 tests, and the fall-through order is the
   fragile part, not the word list.
6. External menu reading (Goop Kitchen, Sweetgreen, Cava, Dig) is needed to name Bowl Shop
   sections and missing dishes the way a real board does. Goop Kitchen's menu is script-rendered.
