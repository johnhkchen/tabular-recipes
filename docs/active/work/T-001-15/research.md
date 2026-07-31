# T-001-15 — Research

What exists, where, and what constrains a new `.cook` file at the Diner counter. Descriptive
only; the choices are in `design.md`.

## 1. The counter as it stands today

Counted from the working tree, not from the gap doc:

```
node -e "…"   # counters line, with the category fallback applied
shelved 46   exclusive 17
```

`shelved` = files whose `>> counters:` names `Diner`, plus any file with no `counters:` line
whose `category` is one of Diner's fallback categories (`Flatbreads & Pancakes`, `Soups`,
`Custards & Puddings`). No file currently relies on that fallback — every Diner recipe names
the counter outright, so `shelved` is exactly the count of `>> counters:` lines mentioning it.

The acceptance floor is **49 shelved / 20 exclusive**, i.e. +3 and +3 over today. The gap doc
was compiled at 43; `skillet-cornbread` and `all-butter-pie-crust` have landed since, which is
the staleness the ticket warns about.

The 17 exclusive files are the soups (11), `corn-chowder` etc., plus `homemade-ketchup`,
`crepes`, `dutch-baby`, `french-vanilla-ice-cream`, `banana-pudding`, `butterscotch-pudding`.
The rest of the shelf is shared with Bakery, Deli, Meat and Three, Pizzeria and Shawarma.

`src/data/counters.json` holds Diner's printed sections: **The griddle · Gravies and sauces ·
Soup of the day · Blue plates · Sides · Dressings, by the cup on the side · The dessert case.**
There is no *Breakfast all day* section and no *Sandwiches and burgers* section in that file —
the ticket calls them "printed sections with nothing in them", and both the section list and
the aisle wiring are **T-001-17's**, not this ticket's. This ticket writes recipes; the sections
that will hold them get added elsewhere. A recipe naming `Diner` still reaches the counter page
through the sections file only if listed there, so new files will sit at the counter in the data
and wait for T-001-17 to print them.

## 2. File format

A recipe is one cooklang file: a metadata block of `>> key: value` lines, then one paragraph
per step.

```
>> title: Sausage Gravy
>> category: Sauces & Gravies
>> tags: pork, milk, breakfast, biscuits, stovetop
>> counters: Diner, Meat and Three
>> aka: biscuits and gravy, sawmill gravy, country gravy, white gravy
>> servings: 6
>> time: 25 min
>> step.1: brown 8 min

Brown @bulk breakfast sausage{1%lb}(450 g) in a #cast-iron skillet{} over medium heat for ~{8%min}…
```

Read from `scripts/normalise.mjs`, `scripts/parse-recipes.mjs`, `src/lib/tree.ts`,
`src/lib/layout.ts`, `src/lib/time.ts`:

- `@name{qty%unit}(note)` is an ingredient — one **row** of the table.
- `@&(~N)name{}` is an *intermediate reference*: the output of the step N paragraphs back. It is
  an edge in the tree, not an ingredient.
- `#pan{}` is cookware, `~name{10%min}` a named timer, `~{10%min}` an unnamed one.
- `>> step.N:` overrides the derived label for the Nth **step paragraph** (1-based, counting
  every paragraph, including ones with no ingredients).
- Metadata keys promoted to fields: `title, category, tags, counters, dish, kit, aka,
  pairs-with`. Anything else (`servings`, `time`) survives as free metadata.
- Category comes from `>> category:` or, failing that, title-cased folder name. Every existing
  file states it.

## 3. What makes a file legal

`scripts/check-recipes.mjs` is the gate named in the acceptance criteria. It fails a file for:

1. missing `title`, `category`, `tags`, `servings`;
2. a `counters:` name not in `src/data/counters.json`;
3. any tiling error from `findTilingErrors` — every (row, column) covered exactly once;
4. `rowCount < 3` — fewer than three ingredient rows, "too thin to be a table";
5. `colCount < 3` — "only one operation — nothing merges, so the table is a list";
6. any operation cell with an empty label.

`buildTree` adds three hard errors of its own:

- a step referenced by **two** later steps ("a table is a tree");
- a reference to a step that makes nothing;
- **more than one root** — every branch must flow into one final step.

`colCount = 1 + depth of the operation chain`, so `colCount ≥ 3` means at least one step must
reference another step. The practical floor for a new file is therefore **two operation steps,
the second referring to the first, and three ingredients**. A grilled cheese clears it; a plate
of bacon does not.

`rowCount` is the leaf count, so ingredients are the rows and there is no way to pad them
honestly other than by using real ingredients.

## 4. Timers

`src/lib/time.ts` classifies each timer as hands-on or unattended. A **name** is trusted first
(`~simmer{10%min}`, `~fry{3%min}`), then the words around the timer, then a default of
hands-on. The vocabulary it recognises:

- unattended: `rise prove proof ferment rest chill cool freeze set marinate brine soak steep
  bake roast braise simmer steam boil slowcook infuse dry cure age refrigerate overnight leave
  stand sit blindbake parbake prebake autolyse retard thaw defrost macerate wilt drain press
  smoke stew poach`
- hands-on: `whisk stir knead beat mix fold toss whip roll shape saute fry deepfry stirfry sear
  brown broil temper toast grill flip baste skim churn`

An **unrecognised** name falls through to the sentence reading — so naming a timer
`~griddle{4%min}` is no better than leaving it blank, and the ticket requires every timer named.
The practical rule: name every timer, and name it with a word from those two sets.

## 5. Cross-file facts (build-time, `npm run recipes`)

- **Slugs are globally unique** — the file basename is the URL. A duplicate slug throws.
- `pairs-with:` takes slugs and **must resolve**; a dangling one throws at build. `check-recipes`
  does *not* check this, so a bad pairing passes the per-file gate and breaks the build.
- Two files sharing a `dish` need a `kit:` line to say how they differ.
- Counters are validated against `src/data/counters.json` in both scripts.

## 6. Where things live

23 category folders under `recipes/` (438 files at session start). Relevant to this ticket:

| Folder | Holds | Diner-relevant |
| --- | --- | --- |
| `flatbreads-and-pancakes` | pancakes, waffles, crepes, dutch-baby, hush-puppies | the griddle |
| `sauces-and-gravies` | 35 files incl. `sausage-gravy`, `turkey-pan-gravy`, `hollandaise` | gravies |
| `soups` | 32 | the strong section |
| `stews-and-braises` | 55 incl. `pot-roast`, `corned-beef` | blue plates |
| `custards-and-puddings` | 27 incl. `egg-custard-tart`, `new-york-cheesecake` | the case |
| `sandwiches-and-rolls` | 4, all Vietnamese | **the empty sandwich page** |
| `fried-and-crispy` | 5 (`falafel`, `karaage`, `chicken-parmigiana`, `batata-harra`, `kibbeh`) | fries, potatoes |
| `drinks` | 1 (`ca-phe-sua-da`) | the fountain |
| `pastry-and-doughs` | 6 incl. `all-butter-pie-crust` | pie |
| `toppings-and-pickles` | 4 | whipped cream |

Two gap-doc claims are **stale**: "nothing on the site is deep-fried" (there are five fried
files) and "the site has no drink at all" (`ca-phe-sua-da`). `all-butter-pie-crust` — the doc's
"most-reused missing component on the entire site" — now exists and already names `Diner`.

## 7. What already exists of the gap list

Checked file by file with `ls recipes/*/<slug>.cook`. Of the 20 ranked absences and the
component list, **only** these exist:

- `all-butter-pie-crust` (Bakery, Diner, Meat and Three) — the pie shell.
- `corned-beef` (`stews-and-braises`, Deli) — the hash's meat, written by T-001-14.
- `skillet-cornbread`, `hot-water-cornbread` — already on the Diner/Meat-and-Three shelves.

Everything else on the ranked list is missing: home fries, hash browns, creamed chipped beef,
biscuits, corned beef hash, french toast, scrapple, sausage patties, pork roll egg & cheese,
eggs benedict, western omelette, mashed potatoes, apple pie, every sandwich and burger, chicken
fried steak, meatloaf, fries, onion rings, every fountain drink, tuna noodle casserole, whipped
cream, hot fudge, milk gravy.

## 8. Concurrency — three sibling tickets are writing right now

T-001-12 (pizzeria), T-001-13 (meat-and-three) and T-001-14 (deli) are mid-flight on the same
branch. Their plans claim these slugs, read out of `docs/active/work/T-001-1{2,3,4}/*.md`:

- **T-001-13 claims `stews-and-braises/meatloaf.cook`**, `fried-and-crispy/country-fried-steak.cook`
  and `sauces-and-gravies/cream-gravy.cook`. Those are gap ranks 14 and 15 for this counter, and
  the white gravy of the component list.
- **T-001-14 claims `salads/tuna-salad.cook`**, `salads/chicken-salad.cook`,
  `salads/egg-salad.cook`, `toppings-and-pickles/sauerkraut.cook`,
  `dressings-and-dips/russian-dressing.cook`, `smoked-and-grilled/pastrami.cook`,
  `stews-and-braises/corned-beef.cook`.
- T-001-13 also introduces the folder `recipes/vegetables-and-sides/` and puts
  `custards-and-puddings/sweet-potato-pie.cook` and `custards-and-puddings/peach-cobbler.cook`
  there — i.e. **pies live in `custards-and-puddings` on this site**.

Slug uniqueness is global and enforced at build. Anything on this counter's list that a sibling
has claimed is a collision, and the ticket's own rule covers the case: a dish that belongs to
several counters is **one recipe with several names in `counters:`**, and adding this counter to
a file another ticket owns is a note for **T-001-18**, not an edit here.

`pairs-with` to a sibling's not-yet-written slug would pass `check-recipes` and break
`npm run recipes`. Only slugs that exist in the tree right now are safe to pair with.

## 9. Menu vocabulary available for `aka`

`docs/knowledge/counters.md` §Diner is the source for the names people actually order by, and
the acceptance criteria require a diacritic-free form wherever a name carries one (none of this
counter's names do — the diacritic clause is a house rule that binds elsewhere on the site).
Named there: *S.O.S. / shit on a shingle / frizzled beef / creamed dried beef* (chipped beef);
*country fries / cottage fries / homefries*; *pon haus / pannhaas / panhaas / panhoss*
(scrapple); *Taylor ham egg and cheese / SPK* (pork roll); *Denver omelette*; *hash*;
*hot beef / commercial* (the open-faced plate); *stack of two* (short stack).

## 10. Constraints carried into Design

1. Only `recipes/**` may change. `src/data/counters.json` sections are T-001-17's, so a new
   recipe is invisible on the site until that ticket runs — expected, not a defect.
2. Three ingredient rows and two chained operations are the floor; several gap-list items
   (bacon, buttered toast, two eggs any style, a short stack) sit under it by construction, and
   the gap doc says so itself for the last two.
3. Sibling-claimed slugs must be left alone and recorded for T-001-18.
4. Every timer named with a word `time.ts` recognises.
5. `pairs-with` only to slugs that exist today.
6. Quantities must be real for the stated `servings`; the method must be the canonical one.
