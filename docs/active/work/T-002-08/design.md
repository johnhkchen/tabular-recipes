# T-002-08 — Design

Options, tradeoffs, and the decisions, grounded in `research.md`.

---

## 1. The problem this ticket actually has

The ticket asks for three things that cannot all be true at once:

| # | Asked for | Measured today |
| --- | --- | --- |
| 3 | One Pot shelves ≥ 25, *majority written before this story* | 14 recipes name One Pot, **all 14 new** |
| 2 | The Bowl Shop's dressing section lists the dressings that belong | **0** of 40 files in `recipes/dressings-and-dips/` name The Bowl Shop |
| 8 | Only `counters.json` and `aisles.json` are modified | `menuFor` drops any section item that does not name the counter |

`src/lib/counters.ts:74` is the whole of it: `mine = all.filter(r => r.counters.includes(counter.name))`,
and a section's items are then looked up **inside `mine`**. Adding a slug to `counters.json`
that does not name the counter changes nothing on the page. The category fallback that the
ticket points at ("that is how Panadería's page worked") is dead: all 658 files name their
counters, `0 inferred from category`.

So criteria 2 and 3 are unreachable while criterion 8 holds. One of them gives.

---

## 2. Decision: write the `>> counters:` lines, and say so

**Chosen: shelve a pre-existing recipe the way this repository has always shelved one — append
the counter's name to that file's `>> counters:` line, and list its slug in the section.**

Four pieces of evidence, all inside the repo:

1. **`docs/gaps/one-pot.md:23-27`, written by T-002-01 as the handoff to this ticket**, says so
   outright: *"no recipe names this counter … **T-002-08 renames this block to `## What it has`**
   once the `>> counters:` **lines are written**."* The same paragraph is in
   `docs/gaps/bowl-shop.md` and `docs/gaps/instant-pot.md`. The ticket that opened these shelves
   planned for this ticket to edit `.cook` files.
2. **Commit `a41f570`, "Apply the hand-offs the counter tickets recorded"** — the previous
   story's version of this exact ticket. It changed 13 pre-existing `.cook` files (one
   `>> counters:` line each) plus `counters.json`. `recipes/salads/tuna-salad.cook`:
   `- >> counters: Deli` → `+ >> counters: Deli, Diner`, with `tuna-salad` added to the Diner's
   sandwich section in the same commit.
3. **The invariant the data holds.** Across all 15 populated counters, every listed slug names
   its counter and every naming recipe is listed. Zero exceptions. A shelf built the other way
   would be the first.
4. **The writer tickets were forbidden from doing it.** T-002-04: *"no file that existed before
   this ticket is edited … Dishes found to exist are listed in the work artifact by slug and
   section, **for T-002-08 to shelve**."* T-002-07's `design.md` §5 hands over 39 slugs with the
   note *"These need a `>> counters: The Bowl Shop` line and no rewriting."* If this ticket does
   not write those lines, nobody does and the handoffs are dead letters.

Criterion 8 is therefore knowingly exceeded. The reason it exists — *"No writer ticket was
allowed to touch either, which is why this is safe to do all at once"* — is a concurrency
argument, and all six writer tickets are sealed, so the collision it guards against cannot
happen. This is recorded again in `review.md` with the exact file list, so a reviewer can revert
it in one command if they disagree.

### Rejected alternatives

**A. Fill `counters.json` only, and block on the two unreachable criteria.**
Rejected. It produces three shelves where One Pot has 14 items and the Bowl Shop has no
dressings and no soups, and it strands four handoff documents. The ticket's own sentence —
*"The large part of this job is the recipes that already existed"* — would be untouched work.

**B. Change `menuFor` to union section items into the menu**, making the story's sentence
("a section may list a recipe that never names the counter") true in code.
Rejected on three grounds. It is still an edit outside criterion 8, so it buys nothing there. It
splits the truth: `recipe.counters` would say Meat and Three while the One Pot page shows the
dish, so `[slug].astro:61` (the counter trail on the recipe's own page), `search.json.ts:15` and
`index.astro:124` would all disagree with the menu. And `scripts/menu-sections.mjs` — the tool
that generates `counters.json` — reports exactly this state as an error (`listed but not shelved
here`), so the repo already has an opinion about it.

**C. Give the three counters `categories`.** Rejected: the fallback only fires for a recipe that
names *no* counter, and none exists. It would also be far too coarse — "Stews & Braises" is 101
files, most of which fail the one-pot test.

---

## 3. How the sections get written: through the gap notes, not by hand

`src/data/counters.json` is **generated**. `scripts/menu-sections.mjs` parses the `## What it
has` block of `docs/gaps/<slug>.md` and folds it in with `--write`. Today the 15 old counters
round-trip byte-identically, which means the JSON and the notes have never disagreed.

**Chosen: edit the three gap notes, run `node scripts/menu-sections.mjs --write`.**
Hand-editing the JSON would be the first divergence, and the three notes are the human-readable
record the next ticket (T-003-06, `depends_on: [T-002-08]`) is told to read.

Two properties of the script make this safe for the neighbours:

- A counter whose note has no `## What it has` block is `continue`d **before**
  `counter.sections = sections`, so `soup-pot`, `japanese-home` and `slow-cooker` — T-003-06's
  three — keep their empty sections untouched.
- Section order follows the note's order, so "in menu order" is a property of how the note is
  written.

Consequence for criterion 1: a `**Also here.**` lead-in in a note becomes a section titled
"Also here". **None of the three notes gets one**, and the four/five/seven section titles
T-002-01 chose are reused verbatim so the JSON keeps the order it was opened with. The `Also`
section `menuFor` appends for unplaced recipes is prevented by placing every member.

### On "no counter renders an 'Also here' section"

Read as scoped to the three counters this ticket shelves. `panaderia` (7 items) and `deli` (3)
have carried a deliberate "Also here" section since T-001, from their own gap notes, and neither
is in this ticket's remit or in any handoff to it. Renaming another counter's menu section
without a mandate is a worse outcome than a literal reading of one clause. Stated again in
`review.md`.

---

## 4. Instant Pot — the easy shelf

25 recipes already name it, all 25 carry `kit: Instant Pot`, and `grep -rl '^>> kit: *Instant
Pot'` returns the same 25. Criterion 4 ("shelves every recipe carrying `kit: Instant Pot`, and
there are at least 20") is met by sorting, with **no `.cook` edit at all**.

The gap note's `## What is already here` lists the **plain** slugs (`birria-de-res`), because it
was written before the variants existed. Those must be replaced with the `-instant-pot` slugs,
or every one would report as *listed but not shelved here*. Five sections, 25 slugs:

| Section | Count | Notes |
| --- | --- | --- |
| Braises that took all afternoon | 11 | the T-002-02 braises, less `corned-beef` |
| Beans from dry | 5 | the T-002-03 bean pots |
| Stocks and broths | 5 | tonkotsu, phở, chintan, chicken, ham hock |
| Rice, grains and porridge | 1 | `congee-instant-pot` |
| Whole birds and big cuts | 1 | `corned-beef-instant-pot` — a whole brisket, 90 min |

That leaves `borscht-instant-pot` and `collard-greens-instant-pot`, which are neither braises of
meat nor beans. Both are cooked exactly like the braises (sauté, lid, pressure, release), so
both go under *Braises that took all afternoon* rather than into an "Also here" — 13 there. The
alternative, a sixth section, would be inventing a menu heading T-002-01 did not open.

---

## 5. One Pot — the wash-up test, made explicit

The test, from T-002-04's ticket: *"at the end, how many things need washing? If the answer is
more than the pot and the tools you ate with, it does not go on this shelf."*

`docs/gaps/one-pot.md` ranked ~114 candidates off each file's own `cookware` line. That is the
evidence, but it is not the answer — it counts *declared* items, not vessels.

**Rule adopted, applied to `recipe.cookware`:**

- **Counts as a vessel** — anything food cooks in or on: Dutch oven, pot, heavy pot, stockpot,
  saucepan, skillet, wok, karahi, balti bowl, tagine, cazuela, comal, plancha, pan, baking dish.
  **Two vessels disqualifies**, however the dish is marketed. This drops `birria-de-res` (Dutch
  oven + skillet), `beef-rendang`, `dansak`, `red-braised-pork-belly`, `palak-paneer`,
  `mushroom-risotto`, `suadero`, `lengua`, `tripas`, `caldo-verde`.
- **Does not count** — a heat source the same vessel goes into (`oven`, `broiler`), and a hand
  tool used in the pot or on the board (`fork`, `potato masher`, `immersion blender`,
  `fine-mesh sieve`, `kitchen twine`, `box grater`, `tea towel`).
- **Also disqualifying** — a jug blender, food processor or mortar. Each is a second bowl to
  wash, and the washing-up *is* this shelf's promise. This drops `jollof-rice`,
  `mexican-red-rice`, `korma`, `patia`, `karahi`, `thai-green-curry`, `pad-krapow`,
  `corn-chowder`. It is the judgement call most open to disagreement, and it is deliberately on
  the strict side: the ticket says a short shelf beats a shelf that lies.
- **A file declaring no cookware at all is read before it is shelved.** Silence is not a
  one-pot claim.

**Second filter: it has to read as a menu.** Every item must fit one of the four titles
T-002-01 opened — there is no "Also here" to catch strays. So plain accompaniment starches
(`rice-pilaf`, `lemon-rice`, `coconut-rice`, `yellow-rice`, `pilau-rice`, `polenta`,
`cheese-grits`) and vegetable sides (`fried-okra`, `stewed-squash`, `creamed-corn`,
`green-beans`, `home-fries`, `hash-browns`) are left off, even though several pass the vessel
test. *Skillet dinners* is a dinner list; a side in it makes the section a directory again.
First courses come off *Soups that are the whole meal* for the same reason —
`butternut-squash-soup`, `potato-leek-soup`, `tomato-soup`, `cream-of-mushroom-soup`,
`red-lentil-soup`, `french-onion-soup` have neither a starch nor a protein in them.

That yields roughly 40 recipes, ~26 of them written before this story — clearing "at least 25"
and "the majority written before this story" on the same list.

---

## 6. The Bowl Shop — the dressings judgement

The ticket: *"Not all of them belong — chopped liver and cream cheese are not bowl-shop
dressings — so read them and choose. This is a judgement, not a `ls`."*

The 40 files in `recipes/dressings-and-dips/` do at least four different jobs. The section is
called **Dressings and drizzles**, and the counter's own build order is *base, greens, what goes
on top, **dressing last***. So the test is: **would this be the last thing ladled over a
finished bowl?**

- **In** — pourable dressings and the spoonable dips these boards genuinely sell as a bowl
  component (Cava's whole board is dips): the seven American dressings, `miso-ginger-dressing`,
  `goma-dare`, `tahini-sauce`, `toum`, `tzatziki`, `raita`, `nuoc-cham`, `chimichurri`,
  `basil-pesto`, `romesco`, `muhammara`, `hummus`, `baba-ganoush`, `aioli`, `crema-mexicana`,
  `white-sauce`, `mint-chutney`.
- **Out, and why**, recorded in `progress.md` per file: deli spreads that go on bread, not over a
  bowl (`chopped-liver`, `cream-cheese`, `scallion-schmear`, `pork-liver-pate`); things that are
  a topping or a salad rather than a drizzle (`sour-dill-pickles`, `do-chua`, `guacamole`,
  `coleslaw`, `barbecue-slaw`, `birista`, `labneh`, `paneer`, `queso-fresco`); preserves eaten
  with curry, not over greens (`lime-pickle`, `mango-chutney`); and `mayonnaise`, which is an
  ingredient of six of the dressings above rather than a line on a board.

Several of the "out" list are not dropped from the counter — `guacamole`, `labneh`, `paneer`,
`queso-fresco`, `birista`, `do-chua` are on T-002-07's handoff for **What goes on top**, which is
where they belong. Being off the dressing list is a placement, not a rejection.

*Soups* is the counter's seventh section and has no members. The gap note lists twelve
candidates; a curated set of the ones a bowl counter actually prints as a cup of soup goes in, so
the section renders rather than disappearing.

---

## 7. Aisles

`npx vitest run` fails one test: 37 of 1082 ingredient names have no aisle, against a ceiling of
2% (21). At least 16 must be placed.

**Chosen: place all of the real ones, in the aisle a shop actually keeps them in, and add no
pack sizes.** Not the minimum 16 — the test is a floor, not a target, and leaving twenty
un-aisled ingredients in a shopping list is the defect the test exists to catch.

Two constraints from the ticket, both real:

- **Most specific wins across aisles.** Every pattern added is multi-word or unambiguous
  (`burdock root`, `dried hijiki`, `job's tears`), never a bare word that another aisle's
  specific pattern could lose to. The named precedent — `"pepper"` in Produce orphaning
  `green bell pepper` — is the exact failure to avoid.
- **No pack sizes.** `purchaseOf` returning null for grams-against-cups is correct; adding a
  pack to make a badge appear is the lie the file exists to prevent. `packs[]` is not touched.

Three of the 37 are **not food** — `flat skewers`, `metal skewers`, `oak or hickory wood`. They
are bought in a shop, so they get an aisle rather than being ignored; a skewer belongs wherever
the shop keeps kitchen kit, and hardwood belongs with the charcoal.

Six more are **recipes used as an ingredient** (`basic vinaigrette`, `ranch dressing`, `caesar
dressing`, `goma dare`, `teriyaki sauce`, `taco seasoning`). Each is also a bottle on a shelf,
which is what the aisle map is for — a cook who has not made the sub-recipe buys it.

The bulk of the remainder is S-003's pantry (konnyaku, hijiki, burdock, job's tears, dried lily
bulb, adenophora root…), nominally T-003-06 §3. That ticket runs **after** this one and this
ticket's criterion is that the suite is green now, so they are placed here. Recorded in
`review.md` so T-003-06 does not re-derive them.

---

## 8. What this design does not do

- No `.cook` **content** is touched — only the `>> counters:` metadata line. No step, ingredient,
  timer or label changes, which keeps `icons.test.ts`, `layout.test.ts` and `check-recipes.mjs`
  out of the blast radius.
- **`src/lib/icons.ts` is not touched.** T-002-02 and T-002-03 both asked for `pressure`,
  `natural` and `release` in `VERB_ICONS` "from T-002-08 or T-002-09". `icons.test.ts` is green
  — the writers reworded instead — so this is an improvement request, not a defect, and it is
  outside this ticket's two files by a wider margin than the shelving edits are. Passed to
  T-002-09 in `review.md`.
- **`pairs-with:` lines are not rewired.** T-002-06 asks whether its salads should now pair with
  T-002-07's components. That is a content change to files this ticket has no shelving reason to
  open, and it is a better fit for T-002-09, which reads the whole collection.
- **No other counter's sections change.** `soup-pot`, `japanese-home` and `slow-cooker` stay
  empty for T-003-06; the 15 old counters round-trip unchanged, which the `menu-sections.mjs`
  dry run verifies before and after.
