# T-001-18 — Structure

Every file this ticket touches, what changes in it, and the order that matters.

Nothing is created and nothing is deleted. **73 recipe files, 2 data/lib files, 2 test files,
16 gap docs** — 93 files modified.

---

## A. `src/lib/` — three edits, in this order

### A1. `src/lib/icons.ts` — 19 verbs into `VERB_ICONS`

No new icon, no new `IconName`, no change to `matchOperation`'s algorithm. Entries go into
the existing commented groups so the file keeps reading as a taxonomy rather than a list:

| Verb | Icon | Group it joins | Where it is written |
| --- | --- | --- | --- |
| `crack` | `flame` | Direct heat | four Thai curries — the coconut cream splits in a hot pan |
| `blitz` | `blend` | Machines that break things down | `mayu`, `korma` |
| `bruise` | `blend` | Machines that break things down | `som-tum` ×2, in a mortar |
| `clarify` | `strain` | Through a mesh | `baklava` |
| `wring` | `strain` | Through a mesh | `gyro-meat`, `kafta` |
| `dress` | `pour` | Liquid moving | `fatayer`, `ful-medames`, `fattoush`, `larb-gai` |
| `perfume` | `pour` | Liquid moving | `attar` |
| `ribbon` | `pour` | Liquid moving | `egg-drop-soup`, `hot-and-sour-soup` |
| `slide` | `pour` | Liquid moving | `hot-and-sour-soup` |
| `return` | `stir` | A bowl and something going round in it | `beef-with-broccoli` |
| `slacken` | `stir` | A bowl and something going round in it | `manakish` |
| `velvet` | `stir` | A bowl and something going round in it | four Takeout stir-fries |
| `mould` | `hand` | Your hands | `maamoul` |
| `thread` | `hand` | Your hands | `chicken-tikka`, `shish-tawook` |
| `tie` | `hand` | Your hands | `labneh` |
| `sheet` | `roll` | Rolling and flattening | `ramen-noodles` |
| `build` | `layer` | Stacked | `ful-medames` |
| `lay` | `layer` | Stacked | three ramen bowls, and the noodles after A3 |
| `throw` | `bowl` | Weak-ish openings | `fattoush` — *do this to these*, nothing more is true |

Checked against `matchOperation`'s read-past-the-first-word behaviour so no cell loses a
better icon than it has now. Four cells change their icon deliberately, each to the verb the
cook actually opened with: `mould, fill and seal` layer → hand; `sheet to 1.5 mm, rest 30 min`
rest → roll; `tie in cloth, drain 24 hr` strain → hand; `velvet, rest 30 min` rest → stir.
`clarify`, `return` and `throw` keep the icon they already resolve to.

### A2. `src/lib/icons.test.ts` — narrow the corpus to operation cells

One constant changes. Today:

```ts
const operationLabels = all.flatMap((recipe) =>
  recipe.steps.map((step) => step.labelOverride ?? step.rawLabel));
```

becomes the labels that actually land in an operation cell, read off `layout()` the way the
page does:

```ts
const operationLabels = all.flatMap((recipe) =>
  layout(buildTree(recipe)).rows.flat()
    .filter((cell) => cell.kind === 'op')
    .map((cell) => cell.text));
```

Adds imports of `layout` and `buildTree`. 2672 step labels → 2429 operation cells. The
docstring is amended to say why: a full-width prose row is not an operation and its first
word is a sentence's first word.

`has operations to look at` (>100 labels, >50 verbs), `gives every operation a real icon` and
`does not lean on one icon for everything` all still hold on the narrower corpus and are
unchanged.

### A3. `src/lib/schedule.test.ts` — the ferment assertion becomes a property

Only the first `it` in `describe('the recipes with the longest critical path')` changes. The
`longest` binding above it, and the two `it`s after it, are untouched. New shape:

```ts
const FERMENT_TIMERS = new Set(['ferment','stand','cure','brine','soak','chill','age','rest']);

it('are ferments and cures, and are long because of one wait rather than many steps', () => {
  for (const { slug, schedule } of longest.slice(0, 3)) {
    expect(schedule.totalMinutes, slug).toBeGreaterThan(7 * 24 * 60);
    const longestTask = [...schedule.tasks].sort((a, b) => b.minutes - a.minutes)[0]!;
    expect(longestTask.minutes / schedule.totalMinutes, slug).toBeGreaterThan(0.5);
    expect(longestTask.attention, slug).toBe('unattended');
    expect(longestTask.confidence, slug).toBe('stated');
  }
});
```

The three current names — `sour-dill-pickles`, `sauerkraut`, `lime-pickle` — move into a
comment above it, so a reader still knows what the property is describing. `FERMENT_TIMERS`
is only referenced if the final assertion needs the timer name; the `confidence === 'stated'`
check already means *the author named the timer*, which is the same claim in one word, so the
set is dropped rather than added.

---

## B. `recipes/**` — the two schedule data defects

### B1. `recipes/spice-blends-and-marinades/ginger-garlic-paste.cook`

`>> step.3` and the third paragraph. The `~chill{3%weeks}` timer is shelf life, not a wait, and
it is what puts a 21-day edge on a 15-minute recipe.

- `>> step.3: pack down, film with oil, chill 3 weeks` → `pack down, film with oil, into the fridge`
- The paragraph's `~chill{3%weeks}` is removed and the keeping time moves into the prose that
  is already in that step: *"It keeps three weeks in the fridge under the oil."*

`>> time: 15 min` is then correct and needs no change. Critical path 30240 → 0 min, drift
2015.00 → n/a (the recipe times nothing, like the other 24 no-cook pastes and dressings).

### B2. `recipes/dressings-and-dips/lime-pickle.cook`

One line: `>> time: 15 days` → `>> time: 14 days`. Two `~stand{7%days}` timers are 14 days
exactly. Drift 0.07 → 0.00.

---

## C. `recipes/**` — the eleven noun-and-adjective-led operation labels

Six files, `>> step.N:` lines only. No paragraph text changes, so no step index moves.

| File | Line | From | To |
| --- | --- | --- | --- |
| `soups/chintan-broth.cook` | step.4 | `aromatics and kombu for the last 30 min` | `stir the aromatics and kombu in, last 30 min` |
| `soups/tonkotsu-broth.cook` | step.3 | `hard rolling boil 8 hr, topping the water up` | `boil hard 8 hr, topping the water up` |
| `soups/tonkotsu-broth.cook` | step.4 | `aromatics in for the last hour` | `stir the aromatics in, last hour` |
| `noodles/miso-ramen.cook` | step.3 | `sprouts and aromatics in, 1 min` | `toss the sprouts and aromatics in, 1 min` |
| `noodles/miso-ramen.cook` | step.4 | `tare in, let it catch 30 sec` | `spoon the tare in, let it catch 30 sec` |
| `noodles/miso-ramen.cook` | step.5 | `broth in, boil 1 min, into the bowl` | `pour the broth in, boil 1 min, into the bowl` |
| `noodles/miso-ramen.cook` | step.7 | `corn and butter last` | `top with corn and butter` |
| `noodles/shio-ramen.cook` | step.2 | `tare and chicken fat into a scalded bowl` | `spoon the tare and chicken fat into a scalded bowl` |
| `noodles/shio-ramen.cook` | step.3 | `broth cut with dashi, boiling, in` | `pour the broth, cut with dashi, boiling` |
| `noodles/shio-ramen.cook` | step.5 | `noodles in, straightened with chopsticks` | `lay the noodles in, straightened with chopsticks` |
| `noodles/shoyu-ramen.cook` | step.2 | `tare and chicken fat into a scalded bowl` | `spoon the tare and chicken fat into a scalded bowl` |
| `noodles/shoyu-ramen.cook` | step.5 | `noodles in, straightened with chopsticks` | `lay the noodles in, straightened with chopsticks` |
| `noodles/tonkotsu-ramen.cook` | step.2 | `tare and mayu into a scalded bowl` | `spoon the tare and mayu into a scalded bowl` |
| `noodles/tonkotsu-ramen.cook` | step.5 | `noodles in, straightened with chopsticks` | `lay the noodles in, straightened with chopsticks` |

`boiling broth in, stir once` (shoyu, tonkotsu) is left alone — `boiling` already stems to
`boil`. Attention readings are unaffected throughout: every timer in these files is named, and
a named timer wins over the label.

---

## D. `recipes/**` — one tag vocabulary

24 spellings folded, **51 files**, one `>> tags:` line each. No file ends with a duplicate
tag (checked). Folds, with the direction and the count moved:

`walnut→walnuts` (1) · `almonds→almond` (4) · `egg→eggs` (5) · `biscuit→biscuits` (1) ·
`buns→bun` (1) · `apples→apple` (1) · `no cook→no-cook` (6) · `onions→onion` (4) ·
`chile→chiles` (7) · `green→greens` (1) · `rice noodle→rice noodles` (1) ·
`dumplings→dumpling` (2) · `pepper→peppers` (1) · `lentil→lentils` (1) ·
`mushroom→mushrooms` (1) · `cold cut→cold cuts` (1) · `beet→beets` (1) · `cookies→cookie` (1) ·
`appetizer→appetiser` (1) · `pan-fried→pan-fry` (2) · `stewed→stew` (5) · `simmered→simmer` (1) ·
`grilling→grill` (1) · `glazed→glaze` (1).

527 distinct tags → 503.

---

## E. `recipes/**` — the recorded hand-offs

| File | Change | Recorded by |
| --- | --- | --- |
| `fried-and-crispy/country-fried-steak.cook` | `>> counters:` + `Diner` | T-001-15 §1 |
| `sauces-and-gravies/cream-gravy.cook` | `>> counters:` + `Diner` | T-001-15 §2 |
| `stews-and-braises/meatloaf.cook` | `>> counters:` + `Diner` | T-001-15 §3 |
| `salads/tuna-salad.cook` | `>> counters:` + `Diner` | T-001-15 §4 |
| `custards-and-puddings/rice-pudding.cook` | `>> counters:` + `Taquería` | T-001-10 §1 |
| `sauces-and-gravies/marinara-sauce.cook` | `>> aka:` → `red sauce, tomato sauce, salsa marinara` | T-001-12 |

And the four `aka` collisions §3 of Design grades as a wrong answer or a weaker duplicate:

| File | Change |
| --- | --- |
| `dressings-and-dips/white-sauce.cook` | drop `tzatziki`, `taziki` from `aka` — the file's own prose says it is not tzatziki |
| `dressings-and-dips/tzatziki.cook` | drop `white sauce` from `aka` |
| `rice-beans-and-grains/pilau-rice.cook` | drop `yellow rice` from `aka` — `yellow-rice` is its own file |
| `soups/chintan-broth.cook` | drop `clear chicken broth` from `aka` — keeps `clear ramen broth`; the deli pot is the one printed in English |

`chintan-broth` is edited twice (C and E); one file, one commit.

---

## F. `src/data/counters.json` — five slugs into five sections

Five new counter assignments must land in a printed section or `getMenu()` sweeps them into
an `Also` catch-all, which is exactly what T-001-17 spent a ticket eliminating.

| Counter | Section | Slug added |
| --- | --- | --- |
| Diner | Blue plates | `country-fried-steak` |
| Diner | Blue plates | `meatloaf` |
| Diner | Gravies and sauces | `cream-gravy` |
| Diner | Sandwiches and burgers | `tuna-salad` (beside `tuna-melt`, which is why it is here) |
| Taquería | Dessert | `rice-pudding` (beside `flan`, as *arroz con leche*) |

No section is created, no title changes, nothing is removed. Diner 73 → 77, Taquería 33 → 34,
assignments 618 → 623.

---

## G. `docs/gaps/` — sixteen files

### G1. The fifteen counter notes

Each file keeps its four-part shape: header paragraph, `## What it has`, `## What it is
missing`, `## Components it would need`, `## What it could not stock`.

- **Header** — rewritten. Every one opens with a recipe count from the 241-recipe era and a
  complaint that is now wrong ("the green curry is written and its paste is not").
- **`## What it has`** — regenerated to match `src/data/counters.json` exactly: the same
  section titles in the same order, the same slugs in the same order, in the
  `**Title.** slug · slug` shape `menu-sections.mjs` parses. This is the machine-read block
  and the round-trip is the acceptance test for it.
- **`## What it is missing`** — every numbered item whose dish is now on the shelf is struck;
  the survivors keep their wording and are renumbered. Items recorded by the writer tickets as
  *ranked but not reached* are appended so the next pass starts where this one stopped
  (T-001-02's ranks 13–22, T-001-07's 14–21, T-001-14's 12–25, T-001-09's tiffin grid).
- **`## Components it would need`** — same treatment; written components struck, the three
  unowned ones (stabilised whipped cream, plain chicken stock, pickled mustard green) kept and
  marked unowned.
- **`## What it could not stock`** — unchanged. Nothing about what a table cannot express has
  moved.

Named staleness each ticket recorded, and the file it lands in: `smokehouse.md` ("there is no
cornbread", 5 recipes), `panaderia.md` (sections predate 18 of 30 files; "there is no drink"),
`meat-and-three.md` (five stale missing entries), `bakery.md` ("no pastry shell", "nothing is
laminated"), `pho-and-banh-mi.md` (pâté, đồ chua), `thai-kitchen.md` (the paste/curry
asymmetry, closed), `dim-sum-counter.md` (gains **wor tip** as a missing dish, per Design §5).

### G2. `docs/gaps/README.md`

Rewritten whole. Every number in it is from a 241-recipe collection.

- **Build state** — 514 recipes, 27 categories, 618 → 623 assignments, 558 pairings, timers in
  492, 0 orphans, 0 inferred counters, and `npm run verify` green.
- **The tally** — the fifteen-row table recomputed from `recipes.json` and `counters.json`
  (recipes, only-here, missing dishes, missing components), plus the before column so the
  story's shape is readable in one place.
- **What no single classifier could see** — rewritten. The old text's seven "whole techniques
  absent from all 241 files" are all now present: pickled and fermented, deep-fried, smoked and
  cured, pastry shells, dumplings and noodles, sandwiches, drinks. What replaces it is what
  reading 514 files found: the category tree has drifted (pickles in two folders, slaws outside
  `salads/`, `cured-fish/` holding one file), the tag vocabulary had 24 split concepts and
  nothing enforces it, and 26 dish names are claimed by two files each.
- **The five gaps to fill first** — replaced. All five originals (pastry shell, two pickles,
  cornbread, char siu, pâté) are written.
- **Shelving notes for the maintainer** — kept and extended; none of the four drifts was
  resolved and three tickets added to the list.

---

## H. Ordering

1. **A1–A3** and **B1–B2** together: the verify-green work. Nothing else can be measured until
   the suite is green, and B changes what A3 asserts over.
2. **C** — label rewrites. Depends on A2 having narrowed the corpus, so the remaining
   fall-throughs are exactly the eleven cells.
3. **D** — tag folds. Independent; touches `>> tags:` only.
4. **E** + **F** together — a `>> counters:` line and its section entry are one change in two
   files, and splitting them renders an `Also` heading in between.
5. **G** — the notes, last, because they report the state the four steps above produce.
6. `node scripts/menu-sections.mjs` (no `--write`) as the round-trip check on G1, then
   `npm run verify`.

`src/lib/__probe.test.ts` is a scratch file used during Research to read the schedule and icon
corpora. It is deleted before the first commit and appears in no `--include`.

---

## I. What is deliberately not touched

`scripts/*.mjs`, `src/components/`, `src/pages/`, `src/styles/`, `src/data/aisles.json`,
`src/lib/shopping.ts`, `src/lib/counters.ts`, `src/lib/tree.ts`, `src/lib/layout.ts`,
`README.md`, `docs/knowledge/`. No recipe file is moved between folders (Design §7), no recipe
file is created or deleted, and no `dish:`/`kit:` key changes.
