# T-001-05 — Research

What is on the Smokehouse shelf, what the collection's machinery will and will not accept, and
where a pit recipe would have to live. Descriptive only.

## The counter as it stands

`src/data/counters.json` defines **Smokehouse** — slug `smokehouse`, blurb *"Smoked all night,
chopped to order, sauce on the table."*, `categories: []` (no fallback, so every recipe here
names the counter on its own file), and four printed sections: *Sauce on the table*, *Rubs and
brines*, *Sides*, *Bread*.

Seven files name it today (`grep -ril smokehouse recipes/`):

| Slug | Category | `counters:` | Smokehouse-only |
| --- | --- | --- | --- |
| `barbecue-sauce` | Sauces & Gravies | Smokehouse | **yes** |
| `memphis-dry-rub` | Spice Blends & Marinades | Smokehouse | **yes** |
| `jerk-marinade` | Spice Blends & Marinades | Smokehouse, Meat and Three | no |
| `turkey-brine` | Spice Blends & Marinades | Meat and Three, Smokehouse | no |
| `boston-baked-beans` | Rice, Beans & Grains | Smokehouse, Meat and Three | no |
| `skillet-cornbread` | Cakes & Loaves | Meat and Three, Smokehouse, Diner | no |
| `hot-water-cornbread` | Flatbreads & Pancakes | Meat and Three, Smokehouse | no |

That is the ticket's "7 recipes, 2 of them its own" exactly. It is also the gap doc's count plus
the two cornbreads, which were written after the gap doc was compiled — the doc's *"There is no
cornbread and no hushpuppy on the site"* is stale on the cornbread half and still true on the
hushpuppy half. Nothing in the seven has been in smoke; six of the seven are things you put *on*
meat or *beside* it, and the seventh is a bean.

## The work list

`docs/gaps/smokehouse.md` ranks eighteen absences. Ordered, with the collection checked rather
than the list trusted (`ls recipes/*/<slug>.cook` over every candidate slug — all absent unless
noted):

1. Chopped pork — smoked shoulder off the bone. NC menu word is bare "barbecue".
2. Sliced brisket — lean/moist is a customer instruction, not two recipes.
3. Pork ribs, St. Louis cut — dry (rub) and wet (sauced).
4. Burnt ends — the point half cubed, back in the smoke until the edges candy.
5. The dip — thin ketchup-vinegar-pepper sauce, distinct from `barbecue-sauce`.
6. Barbecue slaw (red) and white slaw, listed together.
7. Hush puppies — nothing on the site is deep-fried.
8. Banana pudding — shared with Diner and Meat and Three, on none of the three.
9. Cornbread — **already written**: `skillet-cornbread`, `hot-water-cornbread`, both naming
   Smokehouse. The list is stale here.
10. Smoked chicken and smoked turkey.
11. Smoked bologna ("Oklahoma prime rib").
12. Brunswick stew.
13. Rib tips.
14. Mac and cheese, potato salad, collard greens, pit beans.
15. Smoked sausage / hot links.
16. Coarse chopped (outside brown, bark).
17. Peach cobbler and pecan pie.
18. Sweet tea.

The doc also lists **components it would need** (Alabama white sauce, Carolina mustard sauce, KC
thick sauce, cornbread batter, hushpuppy batter, a salt-and-pepper beef rub, a mop/spritz, beef
tallow, smoked pork stock, slaw dressing both ways, vanilla custard and wafer layers) and, under
**what it could not stock**, the things a single table genuinely cannot express: fire management,
meat by the pound, Tray vs Plate, whole hog (one preparation, four products — the build refuses
splitting), sauce on the table as a `pairs-with` rather than a step, bark, and wood as fuel
rather than ingredient. That last section is explicitly *not* a to-do list.

`docs/knowledge/counters.md` §Smokehouse supplies the menu vocabulary verbatim — Chopped BBQ,
Coarse Chopped/outside brown/brownies/bark, Barbecue Slaw/red slaw/dip slaw/Lexington slaw, Dip,
Burnt Ends, Sliced Brisket (lean/moist/fatty/flat/point), Smoked Bologna/Oklahoma prime rib,
Hush Puppies/hushpuppies/corn sticks, Brunswick Stew, Dry Rub, Banana Pudding/nanner pudding.
That table is the source for `aka:` lines; it is not a guess.

## The file format, and what enforces it

`README.md` and `scripts/normalise.mjs` between them:

- Required metadata (`scripts/check-recipes.mjs:18`): `title`, `category`, `tags`, `servings`.
  Optional and promoted to real fields: `counters`, `aka`, `pairs-with`, `dish`, `kit`. Every
  existing file also carries `>> time:`, which is an ordinary metadata line, not a promoted one.
- The folder names the category unless `>> category:` overrides it
  (`scripts/normalise.mjs:194`), so a new folder is a new category with no other wiring needed.
- Steps after the first must say what they consume: `@&(~1)thing{}` (one step back) or
  `@&(3)thing{}` (step 3). Every branch must merge into one final step; splitting one
  preparation into two later steps is refused.
- A step with no ingredients becomes a full-width row and belongs at the top, because `~1`
  counts prep steps too.
- `>> step.N:` overrides a derived cell label, 1-based over the steps as written.
- `~name{n%unit}` — named timers. `src/lib/time.ts` recognises **`smoke`, `braise`, `rest`,
  `chill`, `brine`, `soak`, `simmer`, `bake`, `roast`, `steep`, `cure`, `drain`, `stand`** and
  more as unattended, and `fry`, `whisk`, `stir`, `sear`, `toast`, `grill`, `baste` as hands-on.
  An unrecognised name falls through to reading the label, so names should come from those sets.
- `src/lib/collection.test.ts` adds the collection-wide invariants: unique slugs, no recipe
  without a counter, only counters that exist, `pairs-with` mutual (made mutual at build time —
  writing one side is enough and does not touch the other file) and pointing at recipes that are
  here, and **no hands-on timer of four hours or more**. A long unattended cook must therefore
  carry a recognised unattended timer name or the suite fails.

`node scripts/check-recipes.mjs --labels <file>` is the per-file gate: it re-checks required
metadata, unknown counter names, tiling of the laid-out grid, at least 3 ingredient rows, at
least 3 columns (one operation means "the table is a list"), and no operation cell that came out
with an empty label. It writes nothing, so any number can run at once.

Size guidance from `README.md`: 5–16 ingredient rows, 3–6 operations, because every operation is
a column and columns are what force sideways scrolling.

## Shape precedents already in the tree

- `recipes/stews-and-braises/char-siu.cook` is the closest analogue to a pit item: a marinade
  branch, a long unattended cook (`~marinate{8%hr}`, `~roast{30%min}`), a second branch for the
  glaze, and a final step consuming both (`@&(~1)glaze{}` + `@&(~2)roast pork{}`). It also carries
  a long `aka:` including diacritic-free forms (`xá xíu, xa xiu`), which is the convention the
  acceptance criteria ask for.
- `recipes/stews-and-braises/carnitas.cook` shows a whole-cut braise finished by shredding.
- `recipes/soups/corn-chowder.cook` shows a two-branch merge in a soup.
- `recipes/custards-and-puddings/bread-pudding.cook` shows a custard poured over solids.
- `recipes/dressings-and-dips/ranch-dressing.cook` is the four-step dressing shape a slaw
  dressing would take.

Named timers are the minority in the existing corpus (`~chill` ×8, `~simmer` ×4, `~bake` ×4,
and a long tail); `barbecue-sauce`, `carnitas`, `bread-pudding` and `corn-chowder` all use bare
`~{n%min}`. This ticket's criterion — *every timer in every new file is named* — applies to new
files only, and the new files will be the largest block of named timers in the collection.

## Categories, and where a smoked shoulder would sit

Thirteen folders exist: `bars-and-brownies`, `breads`, `cakes-and-loaves`, `cookies`,
`custards-and-puddings`, `dressings-and-dips`, `flatbreads-and-pancakes`, `pastry-and-doughs`,
`rice-beans-and-grains`, `sauces-and-gravies`, `soups`, `spice-blends-and-marinades`,
`stews-and-braises`. There is no meat-cookery folder. `stews-and-braises` currently absorbs
things that are neither stewed nor braised — `char-siu` is a roast, `carnitas` is a confit-ish
oven cook, `red-braised-pork-belly` is the only one true to the name.

A category is free text. `parse-recipes.mjs:64` only consults it as the counter fallback for
recipes that name no counter, and nothing keys off the category list anywhere else — icons are
chosen from the operation verb (`src/lib/icons.ts`), not the category. A counter that prints its
own `sections` (Smokehouse does) groups by those and sweeps anything unplaced into a trailing
**"Also"** section (`src/lib/counters.ts:85-88`), so new recipes appear on the menu even before
T-001-17 places them. Nothing is lost by not touching `src/`.

## Ownership and concurrency

- This ticket writes `.cook` files only, into `recipes/<category>/`. `src/` — menu sections and
  shopping aisles — belongs to T-001-17. `docs/gaps/` rewriting belongs to T-001-18.
- A dish wanted by several counters is ONE file with several names in `counters:`. If a dish
  already exists and only needs Smokehouse added to its `counters:` line, that edit belongs to
  the owning ticket and is recorded for T-001-18 instead of made. The two cornbreads and
  `boston-baked-beans` already name Smokehouse, so no hand-off is needed for them.
- `lisa status` reports 4 tickets in progress: T-001-02, T-001-03, T-001-04 and this one — Phở &
  Bánh Mì, Thai Kitchen, Takeout Counter. None of their gap docs mentions banana pudding, slaw,
  hush puppies or brunswick stew, so no live collision on a shared slug. T-001-13 (Meat and
  Three) and T-001-15 (Diner) have not started, and `docs/gaps/meat-and-three.md` does name
  banana pudding — whichever ticket writes it first owns the file, and the other records a
  hand-off.
- Seal: `lisa status` reports **commit-sealed**, so each unit lands through
  `lisa commit-ticket --ticket-id T-001-05 --include <exact path>`.

## Constraints this leaves

1. Nine new recipes is the arithmetic minimum for "at least 16" at the counter; at least eight of
   them must name Smokehouse and no other counter to reach "at least 10" exclusive.
2. Gap items must be taken from the top down, in order, and anything skipped named with a reason
   — item 9 (cornbread) is already the first forced skip.
3. Long pit cooks must be one operation with a named unattended timer (`~smoke{12%hr}`), both
   because the gap doc says a table *should* hold it that way and because a 12-hour hands-on
   timer fails `collection.test.ts`.
4. Whole hog is refused by the build (one preparation, four products), and "coarse chopped" is
   the same cook as chopped pork with a different knife at the end — the split the build cannot
   draw.
5. Sauce that is poured at the table is a `pairs-with`, not a step in the meat.
6. Every operation is a column; a twelve-hour pit cook still has to fit in 3–6 of them.
