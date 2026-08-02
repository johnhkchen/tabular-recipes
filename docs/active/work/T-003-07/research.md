# T-003-07 — Research

The last ticket of S-002 and S-003. Nothing runs beside it. What follows is what is on the
shelf right now, measured rather than remembered.

## The collection, as it stands

`npm run recipes` reports **658 recipes in 27 categories · 658 counters named, 0 inferred ·
timers in 635 · 760 pairings**. Twenty-one counters. 144 `.cook` files were added since
`651fd66` (*Draft the board for three more shelves*), which is the boundary between the old
collection and everything S-002 and S-003 wrote.

| Folder | Files | Folder | Files |
| --- | --: | --- | --: |
| stews-and-braises | 101 | soups | 66 |
| rice-beans-and-grains | 55 | sauces-and-gravies | 41 |
| dressings-and-dips | 40 | breads | 30 |
| custards-and-puddings | 31 | flatbreads-and-pancakes | 29 |
| spice-blends-and-marinades | 28 | cookies | 26 |
| salads | 23 | bars-and-brownies · cakes-and-loaves · smoked-and-grilled | 22 each |
| fried-and-crispy | 20 | vegetables-and-sides | 18 |
| dumplings-and-rolls | 15 | noodles | 14 |
| sandwiches-and-rolls | 11 | pastry-and-doughs | 10 |
| stir-fries · toppings-and-pickles | 8 each | eggs | 6 |
| pasta · pizzas | 4 each | drinks | 3 |
| cured-fish | 1 | | |

## Where the slack property lives

`src/lib/slack.ts` is the whole of it, and it is short. `SLACK_LEVELS = ['forgiving',
'narrow', 'unforgiving']`. `readSlack()` takes the raw `>> slack:` line, splits the first run
of letters off as the level, treats one following punctuation mark as punctuation, and keeps
the rest as the reason. Two failure modes, both surfaced:

- a word that is not one of the three → `problem`, no slack
- a level with an empty reason → `problem`, no slack

`scripts/normalise.mjs` calls it and hands back `{slack, slackProblem}`.
`scripts/check-recipes.mjs` prints `slackProblem` as a failure, so a half-written line fails
`npm run check` before it reaches a page. The property is **authored, never derived** — the
file header says so twice and no code reads a timer to guess at it.

### Coverage today

**101 of 658 declared; 557 undeclared.** By level: forgiving 50, narrow 36, unforgiving 15.

The 101 break down as: eight worked examples from T-003-02, and every file the three S-003
writer tickets produced (T-003-03 soups, T-003-04 Japanese home, T-003-05 slow cooker) — 91 of
the 144 new files carry it. **The 53 new files that do not carry it are all S-002's**, written
before T-003-02 landed the property: 25 Instant Pot variants, the Bowl Shop's bowls and salads,
the One Pot additions, and six roasted vegetables. That is the first and most obvious hole,
and it is not a hole in old work — it is a hole in work written last week.

Undeclared, by folder, the ones the ticket's three rules point at:

| Rule | Folders it reaches | Undeclared there |
| --- | --- | --: |
| A window that closes | custards-and-puddings 30, breads 28, cookies 26, cakes-and-loaves 22, bars-and-brownies 22, pastry-and-doughs 10, flatbreads-and-pancakes 29 | 167 |
| Dangerous when wrong | beans from dry, pork, canning and pickling, held custards — spread across rice-beans-and-grains, smoked-and-grilled, toppings-and-pickles, dressings-and-dips | ~40 |
| The long cooks | stews-and-braises 77, soups 42 | 119 |

Those buckets overlap and neither is a work list yet; Design has to turn them into one.

## The kit axis

`>> dish:` is what two files have in common, `>> kit:` is what makes one different, and a file
with no `kit:` is the plain way. Defaults in `normalise.mjs`: `dish` falls back to the slug,
`kit` to null. 45 kit files: **25 `Instant Pot`, 20 `Slow Cooker`.**

**Thirteen dishes exist in all three forms** — plain, Instant Pot and Slow Cooker:

`beef-stew` · `carnitas` · `pot-roast` · `chili-con-carne` · `collard-greens` ·
`birria-de-res` · `corned-beef` · `oxtails` · `boston-baked-beans` · `braised-short-ribs` ·
`cachete` · `chile-verde` · `hungarian-goulash`

Nineteen more exist in two forms: eleven plain+Instant Pot (the stocks and bean pots), eight
plain+Slow Cooker (`baked-turkey-wings`, `brunswick-stew`, `irish-stew`, `lamb-tagine`,
`new-england-boiled-dinner`, `osso-buco`, `soy-sauce-chicken`, and `beef-bourguignon` on the
pressure side).

`collection.test.ts` already asserts the two invariants that would break this: a variant
agreeing with its siblings about its `dish`, and at most one plain way per dish. Both green.

## The clock

`src/lib/schedule.ts` reads the merge tree as a dependency graph and reports `totalMinutes`
(the critical path, not the sum), `handsOnMinutes`, `unattendedMinutes`,
`assumedHandsOnMinutes` and `untimedCount`. `src/lib/time.ts` decides hands-on versus
unattended, in three ways it labels honestly: a recognised timer *name* (`stated`), the words
of the operation (`inferred`), or the fallback that you are standing there (`unknown`).

Measured across the 144 new files: **13 report hands-on as the bulk of the work.** All but one
are short by design — `chahan` 4 min, `shogayaki` 4 min, `seared-halloumi` 2 min,
`goma-ae` 3 min, `omurice` 7 min, `crispy-rice-bowl` 10 min, `kale-caesar` 12 min,
`kinpira-gobo` 12 min, `spinach-salad` 13 min, `nikumiso` 15 min, `sausage-and-peppers` 29 min,
`tortilla-espanola` 42 min. A four-minute stir-fry that reports four minutes of standing at the
pan is telling the truth.

**One is worth a second look: `buri-daikon` — 55 min total, 30 hands-on, 25 unattended, and
all 30 of the hands-on minutes are `assumed`** (source `default`, nobody said). That is the
exact signature the ticket's rule is aimed at: a simmered dish reporting itself as time spent
standing there because a timer went unnamed.

Nothing in the collection trips `collection.test.ts`'s four-unbroken-hours guard.

## Duplicates

Three passes, all run against `src/generated/recipes.json`.

**By `dish:` key.** 32 keys hold more than one file; every group is a declared kit family.
Zero lonely variants, zero dishes with two plain ways.

**By normalised title**, stopwords and kit words stripped, Jaccard ≥ 0.60, variants excluded:
17 pairs. Every one is a paste beside its curry (`thai-red-curry-paste` ~ `thai-red-curry`),
a component beside its dish (`char-siu` ~ `char-siu-bao`, `pad-thai` ~ `pad-thai-sauce`), or
two genuinely different dishes sharing a word (`chicken-salad` ~ `chinese-chicken-salad`).

**By `aka` and title collision across different dishes:** 33 keys. Most are generic menu words
doing exactly the job `aka` exists for — *grain bowl* on ten bowls, *lo fo tong* on sixteen
old-fire soups, *gwan tong* on five quick ones. Two are worth reading properly rather than
waving through:

- **`crockpot corned beef and cabbage`** on both `corned-beef-slow-cooker` and
  `new-england-boiled-dinner-slow-cooker`. Corned beef and cabbage *is* the New England boiled
  dinner in most American kitchens. Two files, two dishes, one thing a person would say.
- **`beetroot salad`** on both `roasted-beet-salad` and `roasted-beets` — a salad and its
  component, which is the `char-siu-bao` shape and probably fine, but it was written by two
  different tickets in the same week.

## Pairings

**760 mutual edges, 0 dangling, 0 one-way, 0 self-pairings.** `collection.test.ts` asserts all
three and they are inside the current 825 passing tests. This criterion is already met by the
test suite; the work is to confirm it after any edit, not to build a checker.

## The front page at 21 counters

`src/pages/index.astro` renders one `<ul class="counters">` with no grouping, no sections and
no ordering beyond `counters.json`'s declaration order. Each card carries the counter name,
a blurb, four short titles as a teaser, and a count. Search sits above and *replaces* the
whole row when a query is typed.

Recipe counts per counter, in declaration order:

| Counter | n | Counter | n | Counter | n |
| --- | --: | --- | --: | --- | --: |
| Bakery | 107 | Panadería | 30 | Taquería | 34 |
| Dim Sum Counter | 30 | Takeout Counter | 20 | Phở & Bánh Mì | 18 |
| Ramen Shop | 27 | Curry House | 47 | Thai Kitchen | 21 |
| Shawarma Counter | 44 | Pizzeria | 32 | Deli | 62 |
| Diner | 77 | Smokehouse | 21 | Meat and Three | 53 |
| The Bowl Shop | 103 | Instant Pot | 25 | One Pot | 68 |
| The Soup Pot | 24 | Japanese Home Cooking | 38 | The Slow Cooker | 20 |

The first fifteen answer *where would I buy this*. The last six do not: **Instant Pot** and
**The Slow Cooker** are kit, **One Pot** is a constraint, **The Bowl Shop** is a place, and
**The Soup Pot** and **Japanese Home Cooking** are a household rather than a storefront. Six
of twenty-one cards are now answering a different question from the other fifteen, in the same
undifferentiated row, with no visual or structural signal of which is which. That is the
finding this ticket is asked to record; the ticket explicitly does not ask for the fix.

## The gap docs

`docs/gaps/` holds 21 counter notes plus a README. The shape, from the ones already rewritten:

1. `# Name — what is missing` and a bold headline count
2. `## What it has` — **bold section title.** slug · slug · slug
3. `## What it is missing` — ranked, with the reason each rank matters
4. `## Components it would need`
5. `## What it could not stock`
6. `## Where this came from`

`scripts/menu-sections.mjs` parses **only** the `## What it has` block and folds those section
titles and slugs into `counters.json`. So that block is not prose — it is upstream data, and
rewriting it wrong silently rewrites the menu. It reports anything it cannot parse rather than
guessing.

The three to rewrite:

- **`docs/gaps/soup-pot.md`** — still written as *0 recipes, the shelf was opened and nothing
  is on it yet*. Its `## What it has` heading is deliberately `## What is already here`, with
  a note saying T-003-06 renames it. T-003-06 has run. The shelf now holds **24**.
- **`docs/gaps/japanese-home.md`** — shelf now holds **38**.
- **`docs/gaps/slow-cooker.md`** — shelf now holds **20**.

The before/after shape T-002-09 used on `one-pot.md` and `instant-pot.md`: correct the counts,
move written dishes off the missing list and into `What it has`, and add a closing block
saying what reading the whole shelf found and what is left open.

## Constraints this ticket inherits

- **Never fabricate a number.** Governs the slack reasons too: a reason that names a
  temperature or a window is a claim, and a wrong one is worse than an absent line.
- **An honest gap beats a filled field.** The render omits the line when absent and was built
  to look deliberate doing so. Filler is the failure mode, not silence.
- `npm run verify` = `check` → `recipes` → `vitest run` → `astro build`. All four must pass.
- Commits go through `lisa commit-ticket` with exact `--include` paths only.
- Any file may be edited, but every file changed outside `recipes/` and `docs/` must be named
  in the work artifact with its reason.
