# What each counter is missing

One page per counter, rewritten after the whole shelf was read at 514 recipes. Each file says what landed
there grouped into the sections that counter's menu actually prints, what a place like that obviously sells
and we do not have yet, which sub-recipes those dishes wait on, and which of its items a single table
genuinely cannot hold.

One file here is no longer a counter page: [soup-pot.md](soup-pot.md) is the record of a shelf that came
down. See [Retired counters](#retired-counters) below.

The vocabulary throughout comes from `docs/knowledge/counters.md`. Dish names are the names on real
boards, because that is the way in.

The `## What it has` block of each file is machine-read: `node scripts/menu-sections.mjs` parses it back
into `src/data/counters.json` and reports what it found. Keep the `**Section title.** slug · slug` shape
when you edit one, and keep the section titles free of an em-dash aside — the parser cuts a title at
` — `. **Twenty-one of the twenty-two counters round-trip exactly**; One Pot does not, and the dry run
says so every time it is run. Two things `--write` will do that a reader should know about before using
it: it rewrites **every** counter, not the one being edited, and it drops the hand-written `notes` blocks
on **twelve** sections, which are the only thing in `counters.json` not derived from these pages. Run it
against a copy and diff, rather than against the file.

**Also worth knowing before you title a section: a section with no items cannot round-trip.** The parser
only emits a section it found at least one slug for, so a title written ahead of its contents is deleted
on the next `--write` and reported as nothing at all in the dry run. The Air Fryer & the Pot opened with
five empty titles for exactly that reason and closed with four full ones; the fifth is discussed on
[its page](air-fryer-and-pot.md) in prose, which is where an absence belongs.

## Build state

`npm run verify` passes end to end: **664 files draw a table, 664 recipes parse, 894 tests green in 11
files, 688 pages build.** 664 recipes, 27 categories, 904 counter assignments, 770 pairings made mutual,
timers in 640 files, washing-up declared in 11, 0 orphans, 0 counters inferred from category, 0 parser
warnings, 0 duplicate slugs. 45 files declare a `kit:` — 25 `Instant Pot`, 20 `Slow Cooker` — and every
one resolves to exactly one plain sibling.

**Measured after T-007-05, with the whole of S-007 in.** The recipe count is the arithmetic the story
promised: 658 at the start, minus the sixteen 老火湯 T-007-02 deleted, plus the eight T-007-03 wrote and
the fourteen from T-007-04. The test and page counts move under other stories working the same branch
and are the ones read at the time of writing; the recipe, counter and pairing counts are this story's.

### Retired counters

**The Soup Pot came down on 7 August 2026** under S-007, and is the first counter this collection has
removed. Sixteen 老火湯 were deleted, eight soups moved to other shelves — five of them to One Pot, under
a new section there — and the counter's entry was taken out of `src/data/counters.json`, so
`/menu/soup-pot` no longer builds. The board is 21 counters, 20 of them with something on them; Cha Chaan
Teng is the empty one and T-007-05 fills it.

[soup-pot.md](soup-pot.md) was kept rather than deleted, and rewritten as a record: why the shelf failed,
what happened to each of the twenty-four recipes, and what would have to be true for anyone to try it
again. Its dried-goods glossary and its four rules of the pot are intact. It has no `## What it has`
block, because there is no counter for `menu-sections.mjs` to match it to.

**The board is 22 counters and every one of them has something on it.** It was 21 when S-007 closed —
Cha Chaan Teng was the empty one and T-007-03, T-007-04 and T-007-06 wrote 27 recipes for it. **S-008
opened the twenty-second, The Air Fryer & the Pot**, and filled it with 21. The front page prints 22
cards, `/menu/soup-pot` no longer builds, and the grid has needed no change to absorb any of it —
`.counters` is `repeat(auto-fill, minmax(16.5rem, 1fr))` and has no fixed column count.

At 514 recipes, three things needed repairing, and none of them was visible from inside one folder:

- **`ginger-garlic-paste` wrote its shelf life as a timer** (`~chill{3%weeks}` on a fifteen-minute paste),
  which put a 21-day edge on the critical path and made it the third-longest recipe on the site.
- **`lime-pickle` claimed 15 days** against two seven-day waits.
- **`schedule.test.ts` named three slugs** that had been wrong since the third ticket of this story. It now
  asserts the property those names stood for.

## What the three dials can answer for

The front page's filter is only as good as what has been annotated, and its three dials have very
different coverage. Each carries its own rule about whether the data can speak for a recipe at all, and
a recipe it cannot speak for comes back *we can't say* rather than passing quietly.

**Measured on 7 August 2026, against 685 recipes** — S-008 and S-011 have both been annotating on this
branch, so the `Build state` figures above, which are S-007's, are stale by a good deal.

| dial | what it measures | the rule | can answer for | share of 685 |
| --- | --- | --- | --: | --: |
| Time you're standing there | `handsOnMinutes` | `evidence !== 'unknown'` | 269 | **39.3%** |
| On the table by | `elapsedMinutes` | `elapsedMinutes > 0` | 661 | **96.5%** |
| Things to wash | `washingUpCount` | `washingUpCount !== null` | 177 | **25.8%** |

Supporting annotation: timers in 661 files, `slack` in 416, `washing-up` in 177. The three confidence
states behind the standing dial are **stated 46 · inferred 223 · unknown 416**.

**What the filter looks like at that coverage.** A reader who turns the sink dial is putting
three-quarters of the shelf into *we can't say* and choosing among the quarter S-008 has reached — they
are mostly filtering by who got annotated. A reader who turns the standing dial is choosing among two
fifths. Only the clock speaks for nearly everything, and it speaks for the axis S-010 argues is the
wrong one. That is acceptable for now and it is not acceptable unsaid, which is why it is here.

Run at the story's own scenario — *under twenty minutes standing there*, set at the nearest stop the
dial has — the collection splits **227 pass · 42 fail · 416 we can't say**, and reading all 227 as a
tired cook found 72 right for the evening, 12 borderline and 143 wrong.

**[filter.md](filter.md) is the record of what the filter cannot say**, in the shape of these pages'
*what it could not stock* sections: the equipment it cannot see, the marinade that started yesterday,
the shopping, how tired the reader is, whether the result is even dinner, how many it feeds, and the
twenty timer names `src/lib/time.ts` does not know. It ends with the five things that would close them,
ranked. Like [soup-pot.md](soup-pot.md) it is a file in this directory that is not a counter page, so
`node scripts/menu-sections.mjs` has no counter to match it to and it carries no `## What it has` block.

## The tally

Counts of *assignments*, so a recipe at two counters is counted twice. "Only here" is how many of a
counter's recipes are not also shelved somewhere else — the number that says whether a counter has a
menu of its own or is borrowing one.

**All twenty-two counters, including The Air Fryer & the Pot**, which S-008 opened and filled. The
version before this one had twenty-one rows and the one before that fifteen.

**Two of the four columns are fresh and two are carried forward, and the table says which**, because a
table that silently mixes a re-derived number with a remembered one is worse than one that admits it:

- **Recipes** and **Only here** are re-derived for every row from `src/generated/recipes.json` at 685
  recipes, by the twenty-line script printed in `docs/active/work/T-008-05/progress.md`. Run it and the
  two columns come back.
- **Missing dishes** and **Missing components** are **carried forward** from the previous version for
  the twenty-one rows that had one, and derived for the new row the same way it was derived for them:
  the length of each page's ranked `## What it is missing` list, and the count of its
  `## Components it would need` bullets. Nobody re-read twenty-one work lists for this pass and it
  would be dishonest to print numbers as though somebody had.

**One thing that derivation gets wrong, said here rather than left for the next reader to trip over:**
*Missing dishes* is the **length of the printed rank list**, not the count still unwritten, and two
pages number every rank whether or not it has been written. **Instant Pot's 31 includes 24 that are
written; The Air Fryer & the Pot's 26 includes 17.** One Pot renumbers as it writes, so its 6 is a true
still-out count. Read those two rows as *the size of the work list*, and read the page for the rest.

**The `was` columns changed meaning with this version and it is worth one line.** They used to hold the
tree at `096b1d4`, the state S-007 started from. That baseline has been overtaken twice and is no longer
the useful comparison, so **`was` is now the previous version of this table** — the board as S-007 left
it. The two `was` columns for *Missing dishes* and *Missing components* are dropped rather than carried,
because neither moved.

| Counter | Recipes | was | Only here | was | Missing dishes | Missing components |
| --- | --: | --: | --: | --: | --: | --: |
| [Bakery](bakery.md) | 107 | 107 | 63 | 63 | 18 | 11 |
| [The Bowl Shop](bowl-shop.md) | 103 | 103 | 36 | 36 | 7 | 8 |
| [Diner](diner.md) | 77 | 77 | 29 | 29 | 4 | 5 |
| [One Pot](one-pot.md) | 73 | 73 | 19 | 19 | 6 | 7 |
| [Deli](deli.md) | 62 | 62 | 17 | 17 | 13 | 10 |
| [Meat and Three](meat-and-three.md) | 53 | 53 | 16 | 16 | 7 | 6 |
| [Curry House](curry-house.md) | 47 | 47 | 31 | 31 | 10 | 8 |
| [Shawarma Counter](shawarma-counter.md) | 44 | 44 | 17 | 17 | 9 | 10 |
| [Japanese Home Cooking](japanese-home.md) | 38 | 38 | 28 | 28 | 41 | 6 |
| [Taquería](taqueria.md) | 34 | 34 | 18 | 18 | 14 | 7 |
| [Pizzeria](pizzeria.md) | 32 | 32 | 23 | 23 | 13 | 13 |
| [Dim Sum Counter](dim-sum-counter.md) | 30 | 30 | **16** | 17 | 9 | 11 |
| [Panadería](panaderia.md) | 30 | 30 | 17 | 17 | 8 | 6 |
| [Cha Chaan Teng](cha-chaan-teng.md) | **27** | 22 | **22** | 22 | 5 | 2 |
| [Ramen Shop](ramen-shop.md) | 27 | 27 | 13 | 13 | 9 | 10 |
| [Instant Pot](instant-pot.md) | 25 | 25 | 25 | 25 | 31 | 5 |
| [Smokehouse](smokehouse.md) | 21 | 21 | 12 | 12 | 4 | 8 |
| [Thai Kitchen](thai-kitchen.md) | 21 | 21 | 15 | 15 | 13 | 10 |
| [**The Air Fryer & the Pot**](air-fryer-and-pot.md) | **21** | — | **21** | — | **26** | **5** |
| [Takeout Counter](takeout-counter.md) | 20 | 20 | 13 | 13 | 9 | 9 |
| [The Slow Cooker](slow-cooker.md) | 20 | 20 | 20 | 20 | 18 | 6 |
| [Phở & Bánh Mì](pho-and-banh-mi.md) | 18 | 18 | 12 | 12 | 10 | 9 |
| **Total** | **930** | **904** | **483** | **463** | **284** | **172** |

**Three rows moved and each has a reason.**

- **The Air Fryer & the Pot arrived with 21**, all of them only there, and it is the first counter on
  the board whose membership is a *rule* rather than a kind of food. Every item passes a three-bar
  gate; [air-fryer-and-pot.md](air-fryer-and-pot.md) is the measurement and the number came in under
  the twenty-five S-008 asked for, which that page reports rather than fixes.
- **Cha Chaan Teng finished at 27, not 22.** T-007-06 landed five more after the previous version of
  this table was written.
- **Dim Sum Counter's *only here* is 16, not 17.** One of its recipes gained a second counter; the old
  value was carried forward from before that happened and is corrected by the re-derivation.

**The Soup Pot is not in either column now.** It came down under S-007 and was already absent from the
previous table, so under the new `was` definition its 24 recipes are gone from both sides and the two
totals reconcile without a footnote: **904 → 930 is exactly the 5 Cha Chaan Teng gained plus the 21 this
counter arrived with.** What happened to each of its twenty-four files is in
[soup-pot.md](soup-pot.md).

**The Air Fryer & the Pot has no was-value** because it did not exist when the previous table was
written — S-008 opened it in T-008-02, with five section titles and nothing under them, and T-008-05
filled four of the five. **The fifth, *Start to finish in the pot*, was removed rather than left
empty**: no Instant Pot recipe on the site clears the gate's 45-minute bar and none of the six ranked
pressure dishes has been written, so the title had nothing to hold. A section title with nothing under
it is a claim about a menu that the menu does not keep.

Also recorded: **158 items across the twenty-two counters that a single table cannot express** — 150 of
them counted at the previous pass, plus the eight on the new counter's page, which are the sharpest set
on the board because a basket is a machine and most of what goes wrong with it is a fact about the
reader's kitchen: how much fits in one layer, whether it needs two batches, how loud it is. Each carries
the reason it cannot be a cell. The figure before that was 107 across fifteen; nothing about what a table
can hold has changed, the counters missing from the tally were simply never counted.

Every counter is **fully sectioned**: all 930 assignments print under a heading its board would use, and
**no menu on the site renders an *Also here* section.** That is a live check rather than a habit —
`menuFor()` appends one automatically for anything a counter shelves that its section list forgets, so an
empty *Also* means every slug is placed on purpose. `node scripts/check-menus.mjs` says
`22 counter(s): 930 slug(s) listed, 930 printed.`

**One drift is left on the whole board, and it is the reverse of the old one.**
[one-pot.md](one-pot.md)'s `## What it has` block does not list the five soups S-007 moved there, so
`node scripts/menu-sections.mjs` reports `One Pot: 68/73 placed` every run. They print correctly on the
menu, because `src/data/counters.json` has them under *Quick soups that go with dinner* — which is the
wrong way round, since these pages are supposed to be the source the JSON is folded from. Adding five
slugs to that block closes the last one. The older drifts are gone: Cha Chaan Teng's five borrows were
settled by T-007-06, and One Pot's four inert fried slugs came out under T-003-07. Since T-011-05,
`menuFor()` **throws with the slug named** rather than dropping a slug it cannot place, so a drift of
that shape can no longer hide.

### What the kit axis says about the sink

**Recorded here because this is where the next pass looks, and because it is not what the `kit:` badge
was sold on.** S-008 annotated `>> washing-up:` across 145 files and could then compare, for the first
time, every `dish` that has both a plain file and an appliance one — 45 pairs, measured by T-008-03.

| kit | pairs | washes **more** than plain | the same | **fewer** |
| --- | --: | --: | --: | --: |
| The Slow Cooker | 20 | **16** | 4 | **0** |
| Instant Pot | 25 | 5 | **16** | 4 |
| Air Fryer | 13 | 0 | 3 | **10** |

- **The slow cooker is the most expensive machine in the kitchen and never the cheapest.** Sixteen of
  twenty wash more than the plain version and **not one washes fewer**. The reason is structural: the
  crock browns nothing, so a skillet joins it. `pot-roast` goes 1 → 4, `braised-short-ribs` 1 → 4,
  `baked-turkey-wings` 1 → 4. The four that break even are the four that brown nothing at all.
- **The Instant Pot is a dead heat, sixteen times out of twenty-five.** Sauté means it browns in the
  pot, so it lands exactly level with a Dutch oven. **For the largest kit family on the site, the sink
  is usually identical**, and the *fewer things to wash* claim is not one that shelf can make. It still
  says something true about time and attention — that is what `>> time:` and the standing dial are for.
- **Where the pot does win it wins big, always for one reason**: dried pulses cooked from dry, with no
  soak bowl and no parboiling pan. `boston-baked-beans` 4 → **1**, `ful-medames` 3 → **1**,
  `cuban-black-beans` 2 → **1**.
- **The basket is the only kit that reliably removes a vessel** — ten of thirteen — because what it
  replaces is a pan of frying oil or a parboiling pot. `batata-harra` 5 → 2 is the largest single drop
  on the site.

**What a later pass should do with this:** nothing on any page currently promises that a `kit:` variant
washes less, so nothing is wrong today. What is missing is the opposite — the one page where a
deep-fried original sits beside its basket version with **five things against two** is the clearest
argument S-008 can make and nothing renders it. `scripts/parse-recipes.mjs` already carries
`washingUpCount` onto each variant, so it needs no new data, only a place to show it.

**Coverage, so the table above is read at its true weight:** 177 of 685 recipes declare a
`>> washing-up:` line — 11 before S-008 and 177 after. The 508 that do not are most of the collection,
and every number on this page about the sink is a statement about the quarter that has been asked.

## What no single classifier could see

The old version of this section said the collection was *components and dessert*, and listed seven whole
techniques absent from all 241 files. **All seven are now present** — pickles and ferments (`do-chua`,
`sour-dill-pickles`, `sauerkraut`, `kabis`, `lime-pickle`), deep frying (`falafel`, `karaage`,
`hush-puppies`, `onion-rings`, `fried-chicken`, `cha-gio`), smoking and curing (`pastrami`, `belly-lox`,
`smoked-brisket`, `chopped-pork`, `char-siu`), pastry shells (`all-butter-pie-crust`, `sweet-tart-shell`,
`hojaldre`, `croissant-dough`), dumplings and noodles (fifteen and seventeen), sandwiches (fourteen), and
drinks — **nine now, not three**, and the three S-007 added that brew are the ones the old list said were
missing entirely.

What reading all 514 files found instead is not about what is on the shelf but about how it is arranged.

- **The category tree has drifted.** Pickles live in two folders: `sour-dill-pickles`, `do-chua`,
  `lime-pickle` and `mango-chutney` are in `dressings-and-dips/`, while `kabis`, `sauerkraut` and
  `sumac-onions` are in `toppings-and-pickles/`. `coleslaw` and `barbecue-slaw` are filed as dressings
  though `salads/` exists. `cured-fish/` holds one file. Moving a file changes its category and nothing
  else — the slug is the basename, so no URL moves — which makes this cheap to fix and easy to keep
  putting off. **This is the first job of the next pass.**
- **The tag vocabulary had 24 concepts spelled two ways** — `chile`/`chiles`, `no cook`/`no-cook`,
  `stew`/`stewed`, `appetiser`/`appetizer` and twenty more — across 51 files. Folded in this pass, 527
  distinct tags down to 503. **Nothing enforces it.** Tags feed the front-page search alongside `aka` and
  ingredient names, so a split concept silently halves a query, and the next fifty recipes will split it
  again. A checker is a small file and it is the second job of the next pass.
- **26 dish names were claimed by two recipes at once.** Some are honest — a menu really does print
  *madras* for both a blend and a curry, *tonkotsu* for both a broth and a bowl. Six were sending a
  searcher to the wrong table and were fixed: `white-sauce` no longer answers to *tzatziki*,
  `marinara-sauce` no longer answers to *pizza sauce* or *Sunday gravy*, `pilau-rice` no longer answers to
  *yellow rice*, and *white sauce* now returns two dishes instead of five.
- **No two files are the same dish.** Checked by ingredient overlap, by title-and-`aka` overlap, and by
  `dish:` key. The closest pairs — `salsa-verde`/`salsa-verde-cruda`, `general-tsos-chicken`/
  `sesame-chicken`, `tzatziki`/`white-sauce` — are all deliberate and argued in their own tickets.
- **Re-run after S-007, all three passes, and it moved by two.** Alias collisions went 149 → 148:
  *lo fo tong* and *老火湯* left with the sixteen 老火湯 files, and *french toast* arrived, now shared by
  `french-toast` and `hong-kong-french-toast`. That one is **honest and deliberate** — a searcher who
  types it should be shown both, and the Hong Kong file says in a full-width row that it is not the
  diner's, so the table itself disambiguates. Multi-file `dish:` keys are unchanged at 32, all declared
  kit families. Ingredient overlap ≥ 0.60 went 97 → 98: `baked-pork-chop-rice` ~ `pork-chop-in-tomato-sauce`
  at 0.61, which is the pan version and the baked one sharing a sauce on purpose, each pairing to the
  other. **No collision was wrong, so nothing was fixed.** The block of Cantonese `aka` lines that arrived
  with the cha chaan teng added no collision at all: 22 new files, 0 new shared names besides that one.

## The five gaps to fill first

**Gap 5 is closed, and this list is re-ranked rather than ticked.** *A drink that is brewed* was fifth,
on the evidence that three drinks existed and all three were poured cold. There are nine drinks now and
three of them brew: `hong-kong-milk-tea`, `yuenyeung` and `iced-lemon-tea`. What that gap was really
asking for — a brewed hot drink anyone can make from a supermarket — exists, so it comes off the list
and its runner-up moves up.

Ranked the same way as before: by how many counters each one unblocks, not by how much anyone wants to
eat it.

1. **Move the pickles into one folder, and the slaws into `salads/`.** Not a recipe: an afternoon of
   `git mv` and one `>> category:` line each. Thirteen files, no URL changes, and it is the difference
   between a shelf and a pile.
2. **A tag checker.** One file under `src/lib/`, one test. It has to know the difference between a
   spelling variant and two real concepts, which is why it is worth writing once rather than re-reading
   527 tags every pass.
3. **A shared toasted dried-chile purée** — `birria-de-res`, `red-enchilada-sauce`, `mole-poblano` and
   `adobo-para-al-pastor` all begin toast, soak, blend, strain. Recorded by T-001-10 and still true. It
   only pays off if those four are rewritten to consume it, which is the work.
4. **Buttercream and a cream cheese frosting.** Twenty-one cakes are written and not one of them is
   finished. Two tables turn the whole Bakery cake section into case items, and they unlock the éclair,
   the fruit tart and the doughnut alongside `pastry-cream`, which is already here.
5. **A dark roux and a trinity base.** Promoted from the runners-up now that the brewed drink is done.
   Five Louisiana lines at Meat and Three rest on them, and both are a pan and twenty minutes.

The rest of the drinks the old gap 5 asked for are still unwritten and are now ordinary requests rather
than a first-five gap: **sweet tea** for the Smokehouse and Meat and Three, **Thai iced tea**, **café de
olla**, and **hot tea** for the Dim Sum Counter. One table each, and `hong-kong-milk-tea` is the shape
they can copy.

### And a sixth gap, which is not a dish and is bigger than any of the five

[**What the shelf offers the three cooks**](what-the-shelf-offers.md) is the fourth whole-shelf
reading, and the first taken from outside the collection looking in: 685 files held against the three
people in `docs/knowledge/cooks.md`. It ranks the four capabilities the board does not have, and its
answer for two of them is **write food before writing features** — which is why it belongs on this
list and not in a story.

Counted from ingredient lists rather than folder names, the collection uses **130 distinct plants**
and only **23 of them ever carry a dish**. There are **16 non-starch vegetable sides** and **47
savoury dishes built on a non-starch plant**, against **101 sweets**; **14 pulse dishes** a person
would call dinner; and **2 recipes** — a malted milk drink and an egg sandwich — that one person can
cook for one or two with no trip to the shop. The forty-eight plants the shopping lists buy and no
recipe is ever about are the work, and each one is one table.

The reading also finds that **only 34 of 685 recipes have a job a second cook could take** (the raw
lane count says 200), and that a week of dinners for four can run **eleven nights** before a protein
repeats — so the two features the shelf *can* feed today are handing work to a helper and a rotation.
Nothing on the board was edited; where a running story pulls against one of the three cooks, it is a
recommendation in that file, named with the ticket it concerns.

Immediately after, in order: **the Vietnamese baguette** (the one component under a counter that reached
rank 12 and stopped), **wor tip** (the Dim Sum Counter's own pan-fried dumpling — `gyoza` is Japanese and
stays at the Ramen Shop), **cebolla y cilantro** (one row, one operation, on every taquería counter in
the world), **youtiao**, which two gap notes point at from different rooms, and **咖喱汁**, the Hong Kong
curry sauce three cha chaan teng dishes derive inline.

## Shelving notes for the maintainer

Four things landed where the nearest counter was rather than where they belong, and no per-recipe
classifier could have seen them. **None of the four was resolved by this pass**, because each is a board
decision — a new counter or a moved cuisine — rather than a file edit.

- **The Ethiopian trio is still split across two rooms.** `berbere` and `doro-wat` are at the Curry House;
  `injera` is at the Shawarma Counter. The reference records **Ethiopian Platter** as an archetype found
  and deliberately not shelved.
- **`beef-rendang` sits at the Thai Kitchen** and is Malay/Indonesian. The reference's unshelved
  **Roti Stall** and **Kopitiam** are its real home.
- **`chicken-adobo` and `jollof-rice` sit at Meat and Three**, joined during this story by
  `beef-bourguignon` and `coq-au-vin`, which are French bistro. Each is defensible as "one meat off a
  rotating list"; four of them together is a pattern.
- **`haemul-pajeon` and `bulgogi-marinade` sit at the Ramen Shop**, which the reference explicitly says
  does not sell Korean food. The unshelved **Grill Table** and **Banchan Case** are where they point.

Three more, added by this pass:

- **`cha-lua` is in `stews-and-braises/`** and is a cold cut. It is the weakest placement on the shelf and
  it wants a charcuterie category that does not exist yet.
- **`nixtamalised-masa` is the only non-pastry file in `pastry-and-doughs/`.** It is a dough, and the
  folder is named for doughs, but if that shelf is meant to be pastry-only this is the file to move.
- **Three ingredient names are not food** — `flat skewers`, `metal skewers` and `oak or hickory wood` read
  like cookware written into an ingredient list, and they sit in the shopping list's "Anything else".
  They are now the **only** three: T-007-05 gave `tinned luncheon meat` and `satay sauce` aisles, so the
  coverage report in `src/lib/shopping.test.ts` prints 3 of 1074 rather than 5.

Two more, both found by reading the aisles rather than the recipes:

- **`evaporated milk` is in the cold case by a coin toss.** `dairy` and `baking` carry the identical
  two-word pattern, so `aisleFor()` scores them the same and the tie breaks on which aisle comes first
  in `src/data/aisles.json`. Nothing is wrong today. Re-order that file and a tin quietly moves from the
  baking aisle to the chiller, or back, with no test failing. `condensed milk` is not exposed to this —
  `dairy.except` takes it out, so only `baking` can claim it.
- **A made-at-home component written as an ingredient lands wherever its words point.**
  `Hong Kong milk tea` is an ingredient line in `yuenyeung` and resolves to *Dairy & eggs* on the pattern
  `milk`. The collection's answer elsewhere is a pattern per component — `char siu` → butcher,
  `pizza dough` → bakery — but the honest fix here is probably in the recipe rather than the aisle list,
  so it is recorded and not touched.

## Recorded and not done

Carried forward from the sixteen writer tickets so it is not lost. Each is a rewrite of a dish rather than
an edit to a metadata line, which is why none of it happened here.

- **`chana-masala` derives an onion-tomato masala inline** across steps 2 to 4 — the exact duplication
  `onion-tomato-masala` exists to end (T-001-09 §5).
- **`okonomiyaki` buys its sauce and `japanese-beef-curry` makes its roux inline** (T-001-08 §3).
- **`thai-green-curry-paste` overlaps step 1 of `thai-green-curry`.** Both are defensible; the tidy end
  state is the curry starting from a spoonful of the paste (T-001-03 §3).
- **Three older Thai files carry unnamed timers** — `tom-kha-gai`, `coconut-rice`, `thai-green-curry` —
  which the convention now forbids (T-001-03 §4).
- **The same leaf is spelled two ways**: `makrut lime` in the newer files, `kaffir lime` in
  `thai-green-curry`. Every newer file carries the other spelling in `aka`, so search works either way
  (T-001-03 §5).
- **`naan` does not declare which one it is** — a tandoor naan or a home-oven one (T-001-09 §6).

## Recorded and closed

Two entries S-009 finished with. They are here rather than above because the list above is where the next
pass looks for work, and an item that is done but still listed costs somebody an afternoon finding out.
One of these was fixed; the other was looked at and deliberately left, which is also an answer.

### `>> step.N:` counts prose steps as well as operations — closed by removal

Carried under *Recorded and not done* from T-001-08 §5, as:

> **`>> step.N:` counts prose steps as well as operations**, which is undocumented, silently mislabels a
> file rather than failing it, and cost three files a round trip.

**Fixed by removing the form, not by repairing the count** (S-009: T-009-01 taught the build the inline
`>> step:` label, T-009-02 moved all 2,771 of them across 643 files, T-009-03 took the numbered form
away). There is nothing left to count from: the label sits on the line directly above the step it names,
so what it counts is no longer a question anybody can get wrong. A file that still writes `>> step.N:`
now fails `npm run check` with a message showing the same label written inline, and
`node scripts/inline-step-labels.mjs --write` moves it.

Repairing the count instead — making N skip prose steps — was possible and was not done. It would have
renumbered every one of the 2,771 existing labels against a rule nobody had written down, to keep a form
whose real defect was that the number is written somewhere the step is not.

**Retiring the behaviour cost nothing, and that was measured rather than assumed.** 264 files contained
both a prose step and a numbered label; each label was scored against the step the build gave it and
against the step an operations-only numbering would give it. Files that fitted the operations-only
numbering better: **0** (T-009-02 §"Screen A", `docs/active/work/T-009-02/review.md`). So although the
behaviour cost three files a round trip historically, it had left no shifted file behind.

### `@&(~N)`, the relative back-reference, is left as it is

Not a defect being carried; a decision, recorded so the next person does not have to reach it again.

| | Uses | Of those |
| --- | --: | --- |
| `@&(~N)` relative back-reference | **2,401** | **373** are `~2` or deeper |
| `@&(N)` absolute back-reference | 33 | all of them S-009's business — see T-009-04 |

S-009 was about references that are **wrong and silent**. `~1` means *the step before this one*, which is
what the author actually means and stays true when a step is appended. It breaks only when something is
inserted **between** a step and its target — and when that happens the tree usually stops merging, which
is a build error and not a wrong page. Relative references fail loudly; positional ones failed quietly,
and the quiet ones are what the story took.

The 373 uses at `~2` or deeper are the ones worth a look one day: the further back a relative reference
reaches, the more it behaves like a positional one. That is a reason to look, not a reason to have
rewritten 2,401 lines alongside a migration that had to prove itself byte for byte.

Counted with `grep -roh '@&(~[0-9]*)' recipes --include='*.cook' | wc -l` and its `~[2-9][0-9]*` variant,
re-run at T-009-03: 2,401 and 373, unchanged from the numbers S-009 was written with.
