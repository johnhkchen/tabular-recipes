# tabular-recipes

Recipes as one table each: ingredients down the left, what you do with them across.
The shape comes from Cooking for Engineers; the source files are
[cooklang](https://cooklang.org).

```sh
npm install
npm run dev        # or: just dev
npm run verify     # parse + tests + build, the one command that must pass
```

The site is arranged by **counter** — where you would have got the thing if you were not
making it. The front page is a row of counters; each one's page is a menu, and every item on
it leads to a table instead of into a cart. `docs/knowledge/counters.md` records the
archetypes and the menu vocabulary they were drawn from; `docs/gaps/` records what each
counter is still missing.

## The idea

A table like this is a **merge tree** drawn sideways. Leaves are ingredients, one per
row. Every other cell is an operation spanning exactly the ingredients that feed into
it. Cooklang gives us the steps but not the tree — so the tree is written explicitly,
using cooklang's intermediate-preparation references.

```cooklang
Melt @unsalted butter{4%oz}(115 g).

Mix @&(~1)melted butter{} with @sugar{1%cup}(200 g), @vanilla extract{1/4%tsp}(2.5 mL).
```

`@&(~1)melted butter{}` means "the thing made one step back." The parser resolves it to
a step index, which is the edge in the tree. Nothing is inferred or guessed.

## Writing a recipe

Drop a `.cook` file in `recipes/<category>/`. The folder names the category unless the
file overrides it. Four metadata lines are required:

```cooklang
>> title: Espresso Brownies
>> category: Bars & Brownies
>> tags: chocolate, coffee, dessert, oven
>> servings: 9
```

`tags` and the ingredient names are what the search box on the front page looks through,
so tag by what someone would actually reach for: main ingredient, meal, method.

Then the optional lines, which are what the site is organised by:

```cooklang
>> counters: Taquería, Butcher      # where you would buy this if you were not making it
>> aka: taco de carnitas, carnitas  # what people call it when they order it
>> pairs-with: corn-tortillas, salsa-roja
>> dish: beef-stew                  # what this and its equipment variants have in common
>> kit: instant pot                 # the equipment that makes this variant different
```

- **`counters`** is a list, because a recipe can sit at more than one — noodles are not only
  sold by the sushi-and-ramen place. Leave it off and the recipe inherits whichever counters
  claim its category (see `src/data/counters.json`), so nothing is ever orphaned. Naming a
  counter that does not exist is a build error, which catches typos.
- **`aka`** is searchable alongside the title. Someone who wants to recreate the pâté from a
  bánh mì does not know to search for "pork liver pâté" — they know what the menu said.
- **`pairs-with`** takes slugs and is **made mutual at build time**, so you only write it on
  one side. Pointing at a recipe that is not here is a build error.
- **`dish` and `kit`** are how one dish has two tables. A braise and its pressure-cooker
  version have different steps, different times and different trees, so they are two files
  that share a `dish`. Only one file per dish may omit `kit` — that one is the plain way.
  A `kit` line means *a variant exists and is written*, never *this would probably adapt*.

**Name your timers.** `~rise{90%min}`, `~chill{4%hr}`, `~bake{30%min}` — the name is what
separates time you spend from time you merely wait out, which is the most useful thing a
recipe page can tell a cook. An unnamed timer is read from the operation it sits in
("braise 3 hr" is plainly not three hours of your attention) and, failing that, counted as
time you are standing there, because promising a cook they can leave when they cannot is
the worse error.

Then the rules, which are short:

1. **Every step after the first must say what it consumes** — `@&(~1)batter{}` for the
   previous step, `@&(3)dough{}` for step 3. A step that consumes nothing starts a new
   branch, and every branch has to merge before the end.
2. **A step with no ingredients becomes a full-width row.** `Preheat the #oven{} to
   350°F.` sits above the table if it comes before the first real step, below it if after.
   **Keep those at the top**: `~1` counts every step, prep steps included, so a prep step
   wedged between two operations makes the next `@&(~1)` point at something that makes
   nothing.
3. **Notes carry the second unit.** `@sugar{1%cup}(200 g)` renders as
   `1 cup (200 g) sugar`. Cooklang cannot convert cups to grams — that needs the
   ingredient's density — so write both when you want both.
4. **Write fractions as fractions.** `{1/4%tsp}` stays `1/4 tsp`; `{0.25%tsp}` renders
   as `0.25 tsp`.
5. **Cell labels are derived, and overridable.** The label is the step with its
   ingredients stripped out: `Fold in @flour{}, @cocoa{} to @&(~1)batter{}` → `fold in`.
   Temperatures, times and cookware stay. To set one by hand, add
   `>> step.7: bake 350°F (170°C) 30 to 40 min` (N is 1-based over the steps as written).

Row order is not the order you wrote the ingredients: children sort deepest-first, which
is what makes the staircase descend to the right and puts the long chain of operations
along the top.

**Size.** Aim for 5 to 16 ingredient rows and 3 to 6 operations. Rows are cheap — they make
the table taller, not wider — but every operation adds a column, and columns are what force
the table to scroll sideways on a phone. If a dish genuinely needs more than six operations,
it is probably two recipes.

Things a table cannot show, and which the build will refuse rather than draw wrong:

- **Splitting** a preparation into two later steps (it is a tree, not a graph).
- **Two endings** — every branch must flow into one final step.

To find out what is wrong with a file without building the site:

```sh
just check recipes/breads/focaccia.cook    # or: npm run check
```

It prints `ok` with the table's shape, or `FAIL` with the reason. It writes nothing, so any
number of them can run at once.

Add `--labels` to see the staircase of operation cells a file actually produced, which is the
only way to tell a cook's verb from a mangled sentence fragment:

```
$ node scripts/check-recipes.mjs --labels recipes/soups/new-england-clam-chowder.cook
  ok   recipes/soups/new-england-clam-chowder.cook  12 rows x 7 cols
       render in a Dutch oven
         sweat 8 min
           stir in flour 2 min
             simmer 15 min
               warm through, no boil
                 season
```

## How it fits together

| Path | Job |
| --- | --- |
| `recipes/<category>/*.cook` | The source of truth. Hand-written. Basenames are URLs, so they are unique across the whole collection. |
| `src/data/counters.json` | The counters, their blurbs, the sections each menu prints, and the category fallback that keeps every recipe on at least one. |
| `src/lib/time.ts` | Timer durations in minutes, and whether a wait is hands-on or unattended. |
| `src/lib/collection.test.ts` | The invariants no single file can be checked for: unique slugs, mutual pairings, one plain way per dish. |
| `scripts/normalise.mjs` | The only place the WASM parser is touched. |
| `scripts/parse-recipes.mjs` | Walks `recipes/`, emits `src/generated/recipes.json`. |
| `scripts/check-recipes.mjs` | Says what is wrong with one file, or all of them. |
| `src/lib/tree.ts` | Steps → merge tree. Assigns each cell its column and rows. |
| `src/lib/layout.ts` | Tree → table cells, with the blank regions merged. |
| `src/lib/layout.test.ts` | Pins the brownie table to the reference image, and checks every table tiles with no holes. |
| `src/components/RecipeTable.astro` | The table, plus tap-to-cross-off. |
| `src/pages/index.astro` | The counters, and the search over all of them. The index is fetched from `/search.json` on the first keystroke, so no page carries it. |
| `src/pages/menu/[counter].astro` | One counter's menu. |
| `scripts/menu-sections.mjs` | Lifts the menu section names out of `docs/gaps/*.md` into `counters.json`. |
| `src/styles/b28-clay.css` | Vendored from the shared kit — `just sync-kit` to update. |

`src/generated/` is not committed; `npm run recipes` rebuilds it.

## Publishing

The site is static, and `.github/workflows/deploy.yml` publishes it to GitHub Pages on every
push to `main`. Turn it on once, in **Settings → Pages → Source → GitHub Actions**. After
that it lands at `https://johnhkchen.github.io/tabular-recipes/`.

The job runs `npm run verify` before it publishes, so a recipe that would not draw a table
fails the deploy instead of reaching a reader.

Two details worth knowing if you change hosting:

- **The base path.** Because it is a project page, every internal link needs the
  `/tabular-recipes/` prefix. Links go through `url()` in `src/lib/url.ts` rather than being
  written by hand, and the prefix comes from `SITE_BASE` in the workflow. `npm run dev` uses
  the same prefix, so local URLs look like `localhost:4321/tabular-recipes/`.
- **Moving to a custom domain**, say `recipes.b28.dev`: put the domain in `public/CNAME`, set
  `SITE_URL` to `https://recipes.b28.dev` and `SITE_BASE` to `/` in the workflow. Nothing
  else changes.

`public/.nojekyll` has to stay — without it GitHub ignores Astro's `_astro/` directory and
the site loads with no CSS.

## Not yet

- **Importing.** Turning a prose recipe into a `.cook` file is still by hand.
- **Scaling.** Cooklang can scale quantities; the table does not offer the switch yet.
- **Phones.** The table scrolls sideways below about 34rem. It works, but it is not yet
  designed for a small screen.
