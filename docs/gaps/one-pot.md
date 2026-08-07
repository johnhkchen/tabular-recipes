# One Pot — what is missing

**73 recipes.** T-002-04 wrote fourteen; T-002-08 shelved fifty-four that were already here and
had never been counted as one pot; S-007 added five more when The Soup Pot came down —
`century-egg-amaranth-soup`, `crucian-carp-tofu-soup`, `mustard-greens-tofu-soup`,
`seaweed-egg-drop-soup` and `tomato-potato-beef-soup`, which the menu prints under *Quick soups
that go with dinner* and the `## What it has` block below has never been updated to list. That is
the drift `node scripts/menu-sections.mjs` reports every run, and it is now the only one left on
the board. Like the Instant Pot, this is a vessel rather than a cuisine — but unlike the Instant
Pot, most of what is on it was written as a one-pot recipe years ago and simply had not been
shelved that way.

**And the shelf's promise has now been checked.** For two stories this page said that washing-up
could not be expressed and therefore could not be tested. It can. Every one of the 73 files
declares what goes in the sink, and the answer is under *What the shelf actually washes* below.

The earlier draft of this page ranked 114 candidates off the `cookware` line each file declares.
That line turned out to be evidence rather than an answer: it counts what a recipe *names*, and
the dishes that fail this shelf mostly fail by boiling something in water the file never bothers
to call a pot. Every candidate was read against the test in T-002-04 — *at the end, how many
things need washing?* — and the sixty-one that came off are listed under
*What it could not stock*, each with the reason.

**Four of those sixty-one came off after the shelf was built**, when T-002-09 read this page as a
menu rather than as a list. `general-tsos-chicken`, `orange-chicken`, `sesame-chicken` and
`sweet-and-sour-pork` each declare one `#wok{}` and nothing else, and each is four cups of peanut
oil double-fried in two batches. They are the same evasion the paragraph above describes, one
rung further along: not a pot the file forgot to name, but a quart of frying oil, a dredging
bowl, a draining rack and a second bowl for the glaze, all of them invisible to `cookware`.

What is genuinely missing is smaller than it looks, and it is specific: the Louisiana line, the
chicken-and-dumplings line is now written, and the pans where the starch cooks in its own sauce.

---

## What it has

**Braises and stews.** beef-stew · pot-roast · chicken-and-dumplings · chicken-cacciatore ·
new-england-boiled-dinner · sausage-and-peppers · ratatouille · chili-con-carne ·
beef-bourguignon · coq-au-vin · braised-short-ribs · osso-buco · oxtails · irish-stew ·
hungarian-goulash · brunswick-stew · carnitas · cachete · chile-verde · lamb-tagine · doro-wat ·
japanese-beef-curry · massaman-curry · thai-red-curry · thai-yellow-curry · panang-curry ·
rogan-josh · vindaloo · passanda · madras · dopiaza · bhuna · balti · jalfrezi ·
soy-sauce-chicken · white-cut-chicken

**Skillet dinners.** shakshuka · tortilla-espanola · skillet-lasagna · one-pot-pasta ·
beef-stroganoff · smothered-pork-chops · country-fried-steak · chicken-adobo · tinga-de-pollo ·
xiu-mai · western-omelette · egg-foo-young

**Rice and grains that cook in.** arroz-con-pollo · paella · jambalaya · dirty-rice ·
hoppin-john · kitchari · risotto-alla-milanese · cuban-black-beans · black-eyed-peas ·
butter-beans · congee

**Soups that are the whole meal.** gumbo · sancocho · minestrone · harira · split-pea-soup ·
new-england-clam-chowder · borscht · black-bean-soup · wonton-soup

---

## What it is missing

Fourteen of the twenty dishes this page ranked have been written by T-002-04 and are on the shelf
above. Six are still out, renumbered, most conspicuous absence first.

1. **Red beans and rice** — Monday, a ham hock, and `ham-hock-stock` already written. One of the
   five Louisiana lines the README names. T-002-04 skipped it deliberately: the dish as a person
   eats it needs a second pot of rice, which is this shelf's own colander case. It wants either a
   version that cooks the rice in, or a home at the Meat and Three instead.

2. **Étouffée** — the shallower roux, and the second Louisiana line. Skipped for the same reason
   as red beans and rice, and it has the same two ways out.

3. **Kedgeree** — rice, smoked fish, egg, one pan. `belly-lox` is the only cured fish here, so
   this needs a component (below).

4. **Chicken and biscuits** — the same pot as `chicken-and-dumplings`, now written, with
   `buttermilk-biscuits`, which already exists, dropped on top.

5. **Bigos** — recorded at the Deli as rank 8 and still unwritten. It is a one-pot dish and this
   shelf is a second reason to write it.

6. **Congee with a thousand-year egg** — `congee` is on the shelf plain; the version people order
   is a different item on the board.

---

## Components it would need

- **A dark roux** — flour and fat taken to milk chocolate over 30 to 45 minutes of continuous
  stirring. It is hands-on time from end to end, it is the difference between gumbo and soup, and
  five lines wait on it. Already recorded as the next component in `docs/gaps/README.md`.
- **A trinity base** — onion, celery, green pepper, and the point at which the roux stops cooking.
  One table, three lines fed.
- **A sofrito** — the same idea in Spanish, under `arroz con pollo`, `sancocho` and the rice
  dishes. `mexican-red-rice` derives one inline today.
- **Drop dumplings** and **rolled dumplings** — two genuinely different things, and the argument
  over which is correct is the reason chicken and dumplings is worth a table.
- **Smoked haddock** — kedgeree's whole flavour, and the `cured-fish/` folder holds exactly one
  file (`belly-lox`).
- **A fish stock** — chowder and paella both start there, and the stock shelf is chicken, pork and
  beef only.
- **A pot of long-grain rice that finishes in liquid it did not measure**, which is a different
  technique from `rice-pilaf` and is what every rice-cooks-in dish above quietly assumes.

---

## What it could not stock

- **The socarrat.** Paella is judged on the crust that forms on the bottom of a wide thin pan over
  a fire that is hotter at the edges than the middle. A table can say "do not stir for the last
  eight minutes"; it cannot hold a heat gradient, and a paella that is stirred is a rice dish.
- **A "one pot" claim that is really two.** Half the braises above brown in a skillet and braise
  in a Dutch oven, or boil pasta separately. A table shows every operation, so the shelf is
  honest about this by construction — but it means the *promise* of the counter is a claim about
  the washing-up. **This page said for two stories that washing-up is not a row in a table. It is
  one now**, and the sentence is corrected here rather than left standing.

  `>> washing-up:` is a declared list of the things that go in the sink, authored and never derived
  — S-008 built it and `src/lib/washing-up.ts` says why no formula over `cookware` could stand in:
  it counts what a recipe *names*, which is exactly the failure the four wok dishes below are made
  of. The count is the list's length, taken in one place, so a file cannot say *two* and then list
  three things. **It is still not a thing a table can hold** — it does not go in a cell, it goes
  under the table with the clock and `slack` — and that distinction is what this bullet should have
  said in the first place. What has changed is that the claim is now checkable at all.

  The measurement is in *What the shelf actually washes*, below. It is not on this shelf's side or
  against it.
- **The deep fry.** `general-tsos-chicken`, `orange-chicken`, `sesame-chicken` and
  `sweet-and-sour-pork` are one wok on paper and four things to wash in a kitchen: a bowl to
  velvet in, a shallow one to dredge in, a rack to drain on, and a third bowl for the glaze that
  goes into the wok after the oil comes out of it. Nobody browsing *everything goes in one pan*
  on a Tuesday expects to heat, strain and store a quart of peanut oil. They sit at the Takeout
  Counter, which is where all four already were.
- **The oven-and-stove dish.** `boston-baked-beans`, `gigantes-plaki` and `baked-ziti` use one
  vessel across two appliances. It is one pot by the pot's own count and two by the cook's.
  Shelving them here is defensible and should be argued in the file, not assumed.
- **Sheet-pan anything.** The nearest neighbour to this shelf, and a different promise: a tray is
  not a pot and nothing braises on it. It wants its own counter if it ever wants one.
- **A recipe that is one operation.** "Put everything in and simmer" is a shopping list with a
  timer, and `check-recipes.mjs` rejects it outright — one operation means the table is a list.
  Several genuine one-pot weeknight recipes fail this test and should not be forced through it.
- **Cassoulet.** Three days, three separate cooks, a crust broken and reformed seven times. It is
  the most famous one-pot dish in the world and it is not one pot; it is one *dish* that a pot is
  assembled in.
- **The cast-iron seasoning argument.** Whether tomato may go in a cast-iron pan is the single
  most common one-pot question and it is a property of the cook's pan, not of the recipe.

### What the shelf actually washes

**65 of 73 wash one or two things, and 40 wash exactly one.** Measured by T-008-03, which read
every file on this shelf and wrote a `>> washing-up:` line into each; the distribution is
**1 → 40 · 2 → 25 · 3 → 6 · 4 → 2**, mean 1.59. The convention it was read under is in
`docs/active/work/T-008-03/` — fifteen rules, of which the three that decide the most rows are:
the plate you eat off is never counted, the knife and chopping board are never counted, and a
utensil dipped into the pot (a masher, a fork, an immersion blender) is not a vessel.

**The promise mostly holds.** This page's own experiment — 114 candidates ranked off `cookware` and
sixty-one thrown off by hand — expected worse, and so did the ticket that commissioned the
measurement. Eight of 73 wash three or more:

| count | slug | the line |
| --: | --- | --- |
| 4 | `chile-verde` | the Dutch oven, a tray to char the chiles on, a bowl to steam the skins loose in, the blender jug |
| 4 | `country-fried-steak` | the cast-iron skillet, a dish for the seasoned flour, a bowl for the egg wash, a rack to rest the breaded steaks on |
| 3 | `beef-bourguignon` | the Dutch oven, a skillet for the garnish, a plate for the lardons |
| 3 | `soy-sauce-chicken` | the stockpot, a sieve to strain the lou sui, a jar to keep it in |
| 3 | `tinga-de-pollo` | the wide skillet, a pot to poach the chicken in, the blender jug |
| 3 | `tortilla-espanola` | the nonstick skillet, a bowl to beat the eggs in, a plate to turn it on |
| 3 | `white-cut-chicken` | the stockpot, a bowl for the ice bath, a rack to rest the chicken on |
| 3 | `wonton-soup` | the wonton pot, a pot for the broth, a bowl to mix the filling in |

**They are not one list, they are three, and only one of them is a failure of this shelf.**

- **Two are genuinely two-vessel dishes wearing a one-pot label**, the same shape as the four fried
  dishes above: `chile-verde` chars under a broiler and finishes in a blender jug;
  `tinga-de-pollo` poaches its chicken in a second pot and blends the sauce. `chile-verde` is the
  one this page already left open under *The broiler argument*, and the measurement has now
  answered it in the direction that page suspected.
- **Two are honest one-*pan* dishes that need a bowl and a plate.** `tortilla-espanola` is cooked
  in one skillet and turned onto a plate; `country-fried-steak` is one cast-iron pan and a dredging
  station. The pan is genuinely one. The dish is not one *thing*.
- **Three are one pot plus what happens at the end.** `soy-sauce-chicken` is three only because it
  strains and keeps the master stock — read the closing note as optional and it is one, which
  T-008-03 flags as the most arguable row it wrote. `white-cut-chicken` needs an ice bath and a
  rack. `wonton-soup` is two pots because the wontons are poached away from the broth, for the same
  reason `matzo-ball-soup` came off this shelf entirely.

**And `beef-bourguignon` is the eighth**, at 3 — a Dutch oven, a skillet for the garnish and a
plate for the lardons — which is the same reading its `kit: Instant Pot` sibling gets, because the
pot is full in both.

#### What should happen to them, which is a recommendation and not a move

**Nothing has been re-shelved and nothing should be until one sentence is settled: does One Pot
promise one pan or one sink?**

- **If one sink**, the two-vessel pair (`chile-verde`, `tinga-de-pollo`) comes off, and a case can
  be made for the other six. A shelf that ejected all eight would still be 65 recipes, which is
  larger than it was two stories ago.
- **If one pan**, only `tinga-de-pollo` and `wonton-soup` fail — both cook in two vessels — and the
  other six stay, because a bowl and a plate are not a second pan.

The recommendation from here is **one pan, said out loud on the counter's own page**, on the
evidence that four of the eight are exactly the dishes a person would defend and the shelf's blurb
already says *"everything goes in one pan, and that is the only pan to wash"* — which is a claim
about a pan. But **re-shelving is a counter decision and it is a later story's**; this page records
the eight and the argument, and moves nothing.

**One thing worth doing that is smaller than any of that:** `general-tsos-chicken`,
`orange-chicken`, `sesame-chicken` and `sweet-and-sour-pork` — the four this page threw off by hand
and the origin of the whole idea — now wash **5, 5, 5 and 4** by their own declared lines, against
the single `#wok{}` each declares. The first three read *the wok, a bowl to velvet in, a dish to
dredge in, a rack to drain on, a bowl for the glaze*, which is this page's own sentence turned into
a field. The hand reading was right, and it is now a number rather than an argument.

### The sixty-one that came off the candidate list

Kept here so nobody re-derives them. Seven groups, and only the first four are about the pot.

**A quart of frying oil (4).** `general-tsos-chicken` · `orange-chicken` · `sesame-chicken` ·
`sweet-and-sour-pork`. Added by T-002-09, which read the built menu rather than the candidate
list. All four were shelved here by T-002-08 and all four declare one `#wok{}`, which is why they
got through; the reason they come off is in *What it could not stock* above.

**A second pot of water, drained — the colander case (8).** `chicken-noodle-soup` (noodles boiled
in four quarts and drained) · `matzo-ball-soup` (the balls poached away from the broth, precisely
so they do not fog it) · `biryani` (rice parboiled and drained before it is layered) ·
`corned-beef-hash` (potatoes simmered and drained) · `beef-with-broccoli` (broccoli blanched and
drained) · `mujaddara` (lentils simmered apart from the onion skillet) · `chana-masala` (chickpeas
simmered apart from the masala) · `dal-tadka` (the tempering fried in a second pan). **Not one of
these declares a second vessel in its `cookware` line.** They were found by reading the steps, and
they are the reason this page no longer trusts that line on its own.

**Two vessels, declared (10).** `birria-de-res` · `beef-rendang` · `dansak` ·
`red-braised-pork-belly` · `palak-paneer` · `mushroom-risotto` · `suadero` · `lengua` · `tripas` ·
`caldo-verde`.

**A jug blender, food processor or mortar (8).** `jollof-rice` · `mexican-red-rice` · `korma` ·
`patia` · `karahi` · `thai-green-curry` · `pad-krapow` · `corn-chowder`. Each makes a whole
component outside the pot, and that is a second bowl to wash. This is the strictest line on the
page and the one most open to argument — a hand tool that goes *into* the pot (a fork, a masher,
an immersion blender) does not count, and neither does a plate or a dish, which is T-002-04's own
carve-out.

**The protein cooked off the pan the sauce is made in (2).** `butter-chicken` ·
`chicken-tikka-masala`.

**Not a dinner (18).** These pass the vessel test and come off because the shelf has four
sections and none of them is for a side: `rice-pilaf` · `lemon-rice` · `coconut-rice` ·
`yellow-rice` · `pilau-rice` · `polenta` · `cheese-grits` · `refried-beans` · `fried-okra` ·
`stewed-squash` · `creamed-corn` · `green-beans` · `home-fries` · `hash-browns` ·
`breakfast-sausage-patties` · `creamed-chipped-beef` · `collard-greens` · `chashu`. The same
argument takes the first courses off *Soups that are the whole meal* — `hot-and-sour-soup`,
`tomato-soup`, `butternut-squash-soup`, `potato-leek-soup`, `red-lentil-soup`,
`cream-of-mushroom-soup`, `french-onion-soup` — seven more, none of which has a starch and a
protein in it.

**The old *Also here* line (4).** `macaroni-and-cheese` and `tuna-noodle-casserole` both boil
pasta in separate water; `bolognese` is a sauce rather than a dinner; `meatballs` went to The Bowl
Shop's protein list instead, which is where T-002-07 asked for it. This menu has no *Also here*
section to sweep a stray into, and that is deliberate — a shelf whose items land in *Also here*
has section titles that do not match what is on it.

---

## Left open, for whoever reads this next

- **The broiler argument, now with numbers on both sides.** `carnitas` and `chile-verde` are both on
  the shelf and both declare a `#broiler{}` next to their Dutch oven. Carnitas puts its own pot
  under the broiler to crisp the shreds in their own fat — one vessel, two appliances, which this
  page already permits under *The oven-and-stove dish* — and **it declares 1**. Chile-verde chars
  its chiles under the broiler **before** the pot, on a sheet the file never names, which is the
  shape that kept `birria-de-res` off — and **it declares 4**, the joint-highest on the shelf. The
  measurement did not settle the argument, but it did separate the two cases that were being argued
  as one: whatever a preliminary char is, these two are not the same dish. Settling it still means
  either writing the sheet into `chile-verde`'s `cookware` or agreeing that a preliminary char is a
  step and not a second washing-up. **No `.cook` file was edited to find this out and none should
  be to act on it without a ticket.**

- **The four fried dishes are out of `src/data/counters.json`** — T-003-07 removed them, and
  `menuFor()` no longer drops a stray slug quietly in any case: since T-011-05 it **throws with the
  slug named**, so an inert slug is now a build failure rather than an invisible one. What is still
  open on this page is the opposite drift: `## What it has` above does not list the five soups S-007
  moved here, so `node scripts/menu-sections.mjs` reports `68/73 placed` every run. **They are on
  the built menu** under *Quick soups that go with dinner*, because `counters.json` has them and
  this page does not — which is exactly backwards, since this page is supposed to be the source.
  Adding the five to the block above is a one-line job and it is not S-008's; it is the last
  unplaced drift on the whole board.
