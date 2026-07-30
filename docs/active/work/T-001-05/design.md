# T-001-05 — Design

The decision: **fourteen new `.cook` files**, taking `docs/gaps/smokehouse.md` from item 1 to item
13 in order (item 9 already written), eight of them in a new `recipes/smoked-and-grilled/` folder
so that the pit has somewhere to be.

## What the numbers force

The counter holds 7, of which 2 are its own. The criteria want **≥16 total** and **≥10
Smokehouse-only**. Nine new exclusive files would clear both. Nine is also exactly gap items 1–8
(item 6 is two slaws), which is a suspicious coincidence: it would stop the list one item short
of the poultry that a Tennessee board is half made of, and leave the counter's "From the pit"
section holding four items — pork, brisket, ribs, burnt ends — with nothing to eat beside them.

Fourteen takes the list to item 13 and leaves **21 at the counter, 14 of them exclusive**. The
margin matters because `aka:` and `pairs-with:` are the only places a dish's other names live,
and a menu with one chicken on it reads as a menu rather than a proof.

## Option 1 — nine files, gaps 1–8, stop at the number *(rejected)*

Meets the criteria and nothing else. Rejected because the acceptance criterion is "written, in
that order, **as far as the count above reaches**", and the count is a floor, not a target;
stopping at 16 would mean naming smoked chicken, smoked turkey, smoked bologna, brunswick stew and
rib tips as skipped when nothing about them is hard. The gap doc's own framing — smoked bologna is
*"exactly the kind of item nobody would think to look up, which is what this site is for"* —
argues against treating the tail as optional.

## Option 2 — twenty-plus files, gaps 1–15 plus the components list *(rejected)*

Would also pick up mac and cheese, potato salad, collard greens, pit beans, smoked sausage,
Alabama white sauce, Carolina mustard sauce and a salt-and-pepper beef rub. Rejected on two
grounds:

1. **Collard greens and pit beans both want smoked pork stock**, which the gap doc lists as a
   component *"the same component Meat and Three needs"*. A component two counters share is the
   shape T-001-01 exists for; writing it here, inside a counter ticket, puts a shared file under a
   single counter's ownership and hands T-001-13 a file it must edit rather than write. Better
   recorded than made.
2. **Mac and cheese, potato salad and coleslaw are the cold/starch end of three different
   counters** (`docs/gaps/deli.md:41`, `docs/gaps/meat-and-three.md:62`). Claiming all of them
   from the pit ticket is land-grabbing across counter boundaries for dishes the pit did not
   invent. Coleslaw is the one exception, argued below, because the gap doc pairs it with red slaw
   *at this counter* and the two slaws are the same cabbage.

## Option 3 — fourteen files, gaps 1–13 *(chosen)*

| # | Gap | File | Counters |
| --- | --- | --- | --- |
| 1 | Chopped pork (+16 coarse chopped) | `smoked-and-grilled/chopped-pork.cook` | Smokehouse |
| 2 | Sliced brisket | `smoked-and-grilled/smoked-brisket.cook` | Smokehouse |
| 3 | Pork ribs, St. Louis | `smoked-and-grilled/smoked-pork-ribs.cook` | Smokehouse |
| 4 | Burnt ends | `smoked-and-grilled/burnt-ends.cook` | Smokehouse |
| 5 | The dip | `sauces-and-gravies/barbecue-dip.cook` | Smokehouse |
| 6a | Barbecue slaw | `dressings-and-dips/barbecue-slaw.cook` | Smokehouse |
| 6b | White slaw | `dressings-and-dips/coleslaw.cook` | Smokehouse, Deli, Meat and Three |
| 7 | Hush puppies | `flatbreads-and-pancakes/hush-puppies.cook` | Smokehouse |
| 8 | Banana pudding | `custards-and-puddings/banana-pudding.cook` | Smokehouse, Diner, Meat and Three |
| 9 | Cornbread | **skipped — already written**, both files already name Smokehouse | — |
| 10 | Smoked chicken / turkey | `smoked-and-grilled/smoked-chicken.cook`, `smoked-and-grilled/smoked-turkey-breast.cook` | Smokehouse |
| 11 | Smoked bologna | `smoked-and-grilled/smoked-bologna.cook` | Smokehouse |
| 12 | Brunswick stew | `stews-and-braises/brunswick-stew.cook` | Smokehouse |
| 13 | Rib tips | `smoked-and-grilled/rib-tips.cook` | Smokehouse |

Twelve of the fourteen are Smokehouse-only; with `barbecue-sauce` and `memphis-dry-rub` that is
**14 exclusive of 21**.

## The decisions inside that

### A new category: `Smoked & Grilled`

There is no meat-cookery folder. The thirteen that exist are baking, doughs, sauces, soups,
grains, spice blends, dressings and `stews-and-braises` — and `stews-and-braises` has already
absorbed a roast (`char-siu`) and an oven confit (`carnitas`) for want of anywhere better. Putting
eight smoked meats there would compound a wrong call rather than inherit a right one: nothing in
this ticket is stewed or braised.

`scripts/normalise.mjs:194` derives the category from the folder unless the file says otherwise,
and `parse-recipes.mjs:64` only consults it as the counter fallback for files that name no
counter. Every file here names Smokehouse, so a new category is inert: no counter claims it, no
icon keys off it, and `src/data/counters.json` needs no edit — which matters, because `src/` is
T-001-17's.

Folder `recipes/smoked-and-grilled/`, category `Smoked & Grilled` written explicitly on each file.
The name is chosen with room for the grill items a later counter will want, and matches the
existing ampersand-plural style (`Rice, Beans & Grains`, `Spice Blends & Marinades`).

Rejected alternatives: `smoked-meats` (excludes the smoked vegetables and the grill, and reads as
a category of ingredient rather than of method); `from-the-pit` (a menu section name, not a
category — and the menu section is T-001-17's to print).

### Slaws go in `Dressings & Dips`, not a new `Salads & Slaws`

`dressings-and-dips` already holds the cold, dressed, sold-by-the-tub end: `do-chua`,
`sour-dill-pickles`, `guacamole`, `hummus`. A slaw is at home there. A second new folder for two
files is more churn than the shelf needs, and the honest home for a salads category is a ticket
that has salads.

### `coleslaw`, not `white-slaw`, as the slug

The Smokehouse board says *white slaw*; the Deli and Meat and Three boards say *coleslaw*
(`docs/gaps/deli.md:41`, `docs/gaps/meat-and-three.md:62`). One cabbage, one file. The slug is the
URL and the thing another ticket will run `ls recipes/*/coleslaw.cook` against, so it takes the
name two of the three counters use, with `white slaw` first in `aka:`. Writing it as `white-slaw`
invites T-001-14 to write `coleslaw.cook` beside it, which is precisely the duplicate-under-two-
names that T-001-18 has to clean up.

### The dip is `barbecue-dip`, a second sauce, not a variant of the first

`barbecue-sauce` is the sweet tomato one and is already written. The gap doc calls the dip *"a
different sauce"* and *"the more important of the two"*. They are not `dish`/`kit` variants —
`kit` means equipment, and these differ by region and by use, not by pan. Two independent files,
and the dip carries `aka: dip, thin sauce, vinegar sauce, ...` from
`docs/knowledge/counters.md`.

### Dry vs wet ribs, lean vs moist brisket, coarse vs fine chopped: one file each

All three are the gap doc's own framing — *"a customer instruction rather than two recipes"*.
Only `servings`, `time` and `category` render as facts on a recipe page (`src/pages/[slug].astro:39-43`),
so the distinction has exactly two places to live: the `aka:` line, which is searchable, and the
final operation's label, which is the cell a cook reads last. Both get used:

- ribs — final label carries *"sauce for wet, dust with rub for dry"*.
- brisket — final label carries *"slice the flat for lean, the point for moist"*.
- chopped pork — final label carries *"chop, keeping the outside brown in"*, and `aka:` carries
  coarse chopped, outside brown, brownies, bark.

Gap item 16 (coarse chopped) is therefore answered inside item 1 rather than as a fifteenth file.
Writing it separately would be the whole-hog split the build refuses: one preparation, two
products.

### The pit is written for a smoker, and says so in its own words

`docs/gaps/smokehouse.md` is explicit that fire management is craft and the offset smoker is
equipment, that a table can and should hold `~smoke{12%hr}` as one operation, and that a recipe
written for an oven *"is honest and it is a different piece of meat; the file should say which"*.

Decision: every pit file names `#smoker{}` in its cookware and opens with a full-width prep row
that gives the temperature and the wood. That is the file saying which. `src/lib/time.ts:47`
already recognises `smoke` as an unattended timer name, so `~smoke{7%hr}` reads correctly on the
timeline; a bare `~{7%hr}` would default to hands-on and trip
`collection.test.ts`'s "never claims four unbroken hours of your attention".

No oven variant is written. `dish`/`kit` would be the mechanism, and a `kit:` line means *a
variant exists and is written* — writing eight oven twins is a different ticket's worth of work,
and claiming the variant without writing it is the one thing the README says the field must never
mean.

### Sauce stays out of the meat, except where the pit puts it there

The gap doc: sauce on the table is *"a `pairs-with` rather than a step"*. So `chopped-pork` pairs
with `barbecue-dip` rather than mixing it in — but the *chop* itself gets a splash of vinegar
sauce at the board, which is what pitmasters actually do and is not the same as saucing a plate.
Burnt ends and wet ribs are glazed in the smoke, which is a step because the candying is the dish.

`pairs-with` is made mutual at build time (`README.md`, `collection.test.ts:41`), so pointing at
`barbecue-sauce`, `memphis-dry-rub`, `turkey-brine`, `boston-baked-beans` or `skillet-cornbread`
adds the reverse edge without editing those files. That keeps the ticket inside its ownership
while still wiring the new pit items to the rubs and sauces that were written for them.

### Shape budget

`README.md` asks for 5–16 ingredient rows and 3–6 operations, and the checker refuses fewer than
3 rows or 3 columns. A twelve-hour cook is the hardest fit: trim, rub, smoke, wrap, rest, slice is
six operations before a mop branch exists. Resolution — the mop/spritz is written as its own short
branch that the smoke step consumes (the `char-siu` glaze shape), and the rest is folded into the
final slicing step's label rather than given its own column. Five to six operations each.

## What this design does not do

- Does not touch `src/`, `docs/gaps/`, `src/data/counters.json`, or any existing `.cook` file.
  New recipes land in the Smokehouse menu's trailing "Also" section until T-001-17 places them
  (`src/lib/counters.ts:85-88`), so nothing is lost in the meantime.
- Does not write the shared components (smoked pork stock, beef rub, Alabama white sauce,
  Carolina mustard sauce, cornbread batter) — recorded in the work artifact instead.
- Does not write gap items 14, 15, 17, 18 (the side list, sausage, the rest of the dessert list,
  sweet tea). Reasons are recorded per item in `progress.md` and `review.md`.
