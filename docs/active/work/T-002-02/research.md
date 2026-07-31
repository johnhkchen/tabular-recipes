# T-002-02 — Research

What exists, where, and what constrains a writer adding pressure-cooker braises. Descriptive
only; no proposals here.

## 1. The ticket in one line

Write the Instant Pot half of `recipes/stews-and-braises/` — at least ten new `.cook` files,
each a second table for a dish that already has one, differing by `>> kit: Instant Pot`.

## 2. The variant mechanism, as the code actually implements it

`scripts/normalise.mjs:198-222` is the whole of it:

```js
const dish = metadata.dish ?? slug;   // a file with no >> dish: is its own dish
const kit  = metadata.kit  ?? null;   // a file with no >> kit: is the plain way
```

So the pairing is one-sided by construction. `beef-stew.cook` already has
`dish === 'beef-stew'` without saying so, which is why the plain file is never edited and why
six writers can work in parallel without touching each other's files.

`scripts/parse-recipes.mjs:103-126` groups by `dish` and throws when a group has more than one
file with no `kit:` line — *"dish X has N files with no >> kit: line, so nothing says how they
differ"*. That is the one way to break the build from this ticket: give a new file a `dish:`
and forget its `kit:`, or point `dish:` at a slug that is really two files.

`src/lib/collection.test.ts:66-74` pins the same invariant from the test side (*"leave at most
one plain way to cook a dish"*), and `collection.test.ts:60-64` checks that every file a recipe
lists as a variant reports the same `dish`.

Consequences for this ticket:

- The new file carries `dish:`, `kit:`, `counters:`. The old file is not opened.
- A `dish:` slug that names nothing produces a lonely variant, silently. `ls` before writing.
- Two new files must never share a `dish:` — one variant per dish, per kit.

## 3. What is on the shelf to work from

`recipes/stews-and-braises/` holds 59 files. The ranked list in `docs/gaps/instant-pot.md`
names 58 existing dishes across the whole collection; the ones that live in this folder, in
rank order, are:

| Rank | Slug | Plain wet cook |
| --- | --- | --- |
| 3 | `birria-de-res` | 3–4 hr at 325°F |
| 5 | `carnitas` | 3 hr at 300°F |
| 6 | `pot-roast` | 3 hr + 1 hr at 300°F |
| 7 | `braised-short-ribs` | 3 hr at 325°F |
| 8 | `chashu` | 3 hr at a tremble, then an 8 hr chill |
| 10 | `oxtails` | 3 hr at 325°F |
| 11 | `cachete` | 3 hr at 300°F |
| 12 | `beef-bourguignon` | 3 hr at 325°F |
| 13 | `lengua` | 3 hr simmer |
| 14 | `corned-beef` | 3 hr 30 min simmer, after a 5-day cure |
| 16 | `chile-verde` | 2 hr simmer |
| 17 | `chili-con-carne` | 2 hr covered |
| 18 | `hungarian-goulash` | 2 hr + 30 min |
| 19 | `osso-buco` | 2 hr at 325°F |
| 20 | `lamb-tagine` | 2 hr + 30 min at 325°F |
| 21 | `collard-greens` | 2 hr covered |
| 22 | `suadero` | 2 hr confit in fat |
| 23 | `tripas` | 2 hr simmer in milk and water |
| 29 | `red-braised-pork-belly` | 1 hr 30 min covered, then a reduction |
| 30 | `beef-stew` | 1 hr 30 min + 45 min at 325°F |

Ranks 1, 2, 4, 9 and 15 (`tonkotsu-broth`, `pho-broth`, `chintan-broth`, `chicken-broth`,
`ham-hock-stock`) sit in `recipes/soups/`; ranks 24–28 are beans, congee and borscht in
`recipes/rice-beans-and-grains/` and `recipes/soups/`. The ticket assigns all of those to
T-002-03 and puts them out of bounds here.

## 4. The authoring contract that will fail a build

From `README.md` § *Writing a recipe*, and enforced by `scripts/check-recipes.mjs`:

- **Required metadata**: `title`, `category`, `tags`, `servings` (`check-recipes.mjs:19`).
  A counter name not in `src/data/counters.json` is a hard failure
  (`check-recipes.mjs:22-27`, and again in `parse-recipes.mjs`).
- **`>> time:` is required in practice.** `grep -L '^>> time:' recipes/*/*.cook` returns
  nothing — all 514 files carry it — and `src/lib/schedule.test.ts:279-284` fails any recipe
  whose `>> time:` `authorMinutesOf()` cannot read whole. Per `src/lib/schedule.ts:259-280`
  that rules out ranges (`3 to 4 hr`), mixed fractions (`1 1/2 hr`) and trailing words
  (`plus chilling`). `1 hr 40 min` is the shape that reads.
- **One table, a merge tree**: every step after the first names what it consumes
  (`@&(~1)thing{}`), exactly one unreferenced ending, no splits. `layout()` +
  `findTilingErrors()` catch the rest.
- **Prep steps at the top only** — `~1` counts every step, so a note wedged mid-table breaks
  the next back-reference.
- **Size**: 5–16 ingredient rows, 3–6 operations. `check-recipes.mjs` hard-fails under 3 rows
  or under 3 columns; the upper bounds are guidance, since a column is what makes a phone
  scroll.
- **Labels are derived** from the step with its ingredients stripped, and overridable with
  `>> step.N:` (1-based over steps as written). `--labels` prints the staircase.

## 5. The clock, and why timer names matter more here

`src/lib/time.ts` was taught the pressure vocabulary by T-002-01. `UNATTENDED` now contains
`pressure`, `pressurecook`, `pressurecooking`, `pressurerelease`, `naturalrelease`,
`naturalpressurerelease`, `quickrelease`, `cometopressure`, `keepwarm` — normalised by
stripping spaces and hyphens, so `~pressure cook{35%min}` and `~natural release{15%min}` both
resolve by name, with `source: 'name'`.

Two readings are relevant to how these files must be written:

- An **unrecognised** timer name falls through to reading the step's words, then defaults to
  hands-on (`time.ts:attentionOf` / `readTimers`). So a made-up name like `~seal{}` would
  report the sealed wait as time a cook stands there.
- `release` alone is deliberately **not** in `UNATTENDED` (the comment names ajitama shells and
  mushrooms releasing liquid as the trap). `~release{15%min}` would read hands-on. The names
  that work are the compound ones.

`collection.test.ts:77-88` fails any timer that is hands-on and ≥ 240 minutes, and
`collection.test.ts:90-95` fails any timer whose duration cannot be read at all.

## 6. Where the numbers may come from

The story (`docs/active/stories/S-002-three-more-shelves.md` § *Two rules that are not
negotiable*) is explicit: **a pressure-cooker time is not a braise time divided by three.** It
gives one worked figure outright — *"a beef stew takes about thirty-five minutes at pressure and
then a natural release that is itself fifteen minutes of doing nothing."*

`docs/gaps/instant-pot.md` § *Components it would need* carries the repo's own shared table,
which is the in-repo canonical source for the cuts:

> Chuck at 35 minutes, short rib at 40, tongue at 45, oxtail at 45, pork shoulder at 45,
> chicken thigh at 12, dried chickpeas at 35 from dry, black beans at 25, pinto at 25.

Everything not on that list (a whole 4-lb pot roast, a corned-beef flat, beef cheek, collards)
needs its own canonical figure from how the dish is actually cooked under pressure, and the
ticket requires the work artifact to say where each came from.

The same document names four things pressure cannot do, and they are the honest grounds for a
skip: **no evaporation** (any dish finished by reducing), **no looking** (anything judged by
eye under a locked lid), **cures, marinades and rises** (unchanged), **browning at volume** (the
pot's element is small and narrow), and **the vessel as the dish** (a tagine, a cazuela, a bean
pot).

## 7. What a plain file in this folder looks like

`recipes/stews-and-braises/beef-stew.cook` is the shape, and the parts that carry over:

```
>> title / category / tags / counters / pairs-with / servings / time / step.N overrides

Preheat the #oven{} to 325°F (160°C).      ← a prep step, full-width, at the top
Toss @beef chuck{3%lb}(1.4 kg; cut in 2-in cubes), @all-purpose flour{1/4%cup}(30 g), …
Brown @&(~1)floured beef{}, @vegetable oil{2%Tbs} in a #Dutch oven{}.
Soften @yellow onions{2%large}(chopped), … with @&(~1)browned beef{}.
Deglaze @&(~1)pot{} with @dry red wine{1%cup}(240 mL).
Braise @&(~1)pot{} with @beef stock{4%cup}(950 mL), @thyme{4%sprigs} covered at 325°F for ~{90%min}.
Add @carrots{4%large}, @Yukon Gold potatoes{2%lb} to @&(~1)stew{} and braise ~{45%min}.
```

Observations that shape the variants:

- Quantities carry a second unit in `( )`; sizes and cuts ride in the same note.
- Several plain files use unnamed timers inside a `braise`/`simmer` step and rely on the label
  reading. Under pressure that fallback is not good enough — the ticket requires named timers.
- Liquid volumes in the plain files are sized for an oven, where hours of evaporation are part
  of the method: 4 cups stock in `beef-stew`, 3 cups wine + 4 cups stock in
  `braised-short-ribs`, 3 qt of stock over the `collard-greens`. A sealed pot returns all of it.
- `carnitas` and `cachete` sit half-submerged in ~2 cups and finish nearly dry, which is the
  opposite problem: the pot has a floor below which it will not come to pressure at all.

## 8. Ownership and collision surface

- Story § *Shape of the work*: T-002-02 … T-002-07 run in parallel, `.cook` files only, and
  **no writer touches a file another ticket owns**. New basenames in a shared folder do not
  collide; basenames are URLs and must be unique across the whole collection
  (`collection.test.ts`).
- `src/generated/` is not committed, so nothing this ticket writes needs regenerating for a
  reviewer.
- `docs/gaps/instant-pot.md` § *What is already here* is explicitly T-002-08's edit, not this
  ticket's. `counters.json` sections stay empty here too.
- The Instant Pot counter exists (`src/data/counters.json`, `name: "Instant Pot"`, slug
  `instant-pot`, six empty sections). The counter **name** — not the slug — is what a
  `>> counters:` line must match.

## 9. Constraints and assumptions carried into Design

1. Ten files is the floor; the ranked order is the required order, and a skip is legitimate but
   must be named with a reason.
2. Every pressure time must have a stated source, and none may be derived from the plain
   recipe's duration.
3. Every file needs a real liquid quantity in the table, because the minimum is part of the
   method, and a release that is named, timed and cooking-relevant.
4. Browning belongs in the table as its own operation, in the same pot, on sauté.
5. Only `recipes/**` may change; no pre-existing file may be edited.
6. Verification is per-file and side-effect free:
   `node scripts/check-recipes.mjs --labels <paths>`.
