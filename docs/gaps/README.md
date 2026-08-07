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
` — `. Twenty of the twenty-one counters round-trip exactly; One Pot does not, and the dry run says so
every time it is run. Two things `--write` will do that a reader should know about before using it: it
rewrites **every** counter, not the one being edited, and it drops the hand-written `notes` blocks on
eleven sections, which are the only thing in `counters.json` not derived from these pages.

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

**The board is 21 counters and every one of them now has something on it.** Cha Chaan Teng was the
empty one; T-007-03 and T-007-04 wrote 22 recipes for it and T-007-05 shelved them into five sections.
The front page prints 21 cards, `/menu/soup-pot` no longer builds, and the grid needed no change to
absorb either — `.counters` is `repeat(auto-fill, minmax(16.5rem, 1fr))` and has no fixed column count.

At 514 recipes, three things needed repairing, and none of them was visible from inside one folder:

- **`ginger-garlic-paste` wrote its shelf life as a timer** (`~chill{3%weeks}` on a fifteen-minute paste),
  which put a 21-day edge on the critical path and made it the third-longest recipe on the site.
- **`lime-pickle` claimed 15 days** against two seven-day waits.
- **`schedule.test.ts` named three slugs** that had been wrong since the third ticket of this story. It now
  asserts the property those names stood for.

## The tally

Counts of *assignments*, so a recipe at two counters is counted twice. "Only here" is how many of a
counter's recipes are not also shelved somewhere else — the number that says whether a counter has a
menu of its own or is borrowing one. The **was** columns are the state this story started from, which is
the tree at `096b1d4`, rebuilt from source rather than remembered.

**All twenty-one counters, for the first time.** The previous version of this table had fifteen rows and
described the board before The Bowl Shop, Instant Pot, One Pot, The Slow Cooker and Japanese Home Cooking
existed. Every column below is derived the same way for every row: **Recipes** and **Only here** off
`src/generated/recipes.json`, **Missing dishes** off each page's ranked `## What it is missing` list,
**Missing components** off its `## Components it would need` bullets. Run against the fifteen printed
rows, that derivation reproduces the old Recipes, Missing-dishes and Missing-components figures exactly —
which is what licenses using it for the six new ones. It does **not** reproduce the old *Only here*
column, which was left at its 514-recipe values; those numbers are corrected here.

| Counter | Recipes | was | Only here | was | Missing dishes | was | Missing components | was |
| --- | --: | --: | --: | --: | --: | --: | --: | --: |
| [Bakery](bakery.md) | 107 | 107 | 63 | 63 | 18 | 18 | 11 | 11 |
| [The Bowl Shop](bowl-shop.md) | 103 | 103 | 36 | 36 | 7 | 7 | 8 | 8 |
| [Diner](diner.md) | 77 | 77 | 29 | 29 | 4 | 4 | 5 | 5 |
| [One Pot](one-pot.md) | 73 | 68 | 19 | 14 | 6 | 6 | 7 | 7 |
| [Deli](deli.md) | 62 | 62 | 17 | 17 | 13 | 13 | 10 | 10 |
| [Meat and Three](meat-and-three.md) | 53 | 53 | 16 | 16 | 7 | 7 | 6 | 6 |
| [Curry House](curry-house.md) | 47 | 47 | 31 | 31 | 10 | 10 | 8 | 8 |
| [Shawarma Counter](shawarma-counter.md) | 44 | 44 | 17 | 17 | 9 | 9 | 10 | 10 |
| [Japanese Home Cooking](japanese-home.md) | 38 | 38 | 28 | 28 | 41 | 41 | 6 | 6 |
| [Taquería](taqueria.md) | 34 | 34 | 18 | 18 | 14 | 14 | 7 | 7 |
| [Pizzeria](pizzeria.md) | 32 | 32 | 23 | 23 | 13 | 13 | 13 | 13 |
| [Dim Sum Counter](dim-sum-counter.md) | 30 | 30 | 17 | 17 | 9 | 9 | 11 | 11 |
| [Panadería](panaderia.md) | 30 | 30 | 17 | 17 | 8 | 8 | 6 | 6 |
| [Ramen Shop](ramen-shop.md) | 27 | 27 | 13 | 13 | 9 | 9 | 10 | 10 |
| [Instant Pot](instant-pot.md) | 25 | 25 | 25 | 24 | 31 | 31 | 5 | 5 |
| [Cha Chaan Teng](cha-chaan-teng.md) | 22 | — | 22 | — | 5 | — | 2 | — |
| [Smokehouse](smokehouse.md) | 21 | 21 | 12 | 12 | 4 | 4 | 8 | 8 |
| [Thai Kitchen](thai-kitchen.md) | 21 | 21 | 15 | 15 | 13 | 13 | 10 | 10 |
| [Takeout Counter](takeout-counter.md) | 20 | 20 | 13 | 12 | 9 | 9 | 9 | 9 |
| [The Slow Cooker](slow-cooker.md) | 20 | 20 | 20 | 20 | 18 | 18 | 6 | 6 |
| [Phở & Bánh Mì](pho-and-banh-mi.md) | 18 | 18 | 12 | 12 | 10 | 10 | 9 | 9 |
| **Total** | **904** | **901** | **463** | **455** | **258** | **285** | **167** | **171** |

**The Soup Pot's row is gone.** It was 24 recipes, 21 of them only there, 32 missing dishes and 6 missing
components at `096b1d4`; the **was** total above still includes it, which is why 901 does not equal the
sum of the twenty rows that have a was-value. What happened to each of its twenty-four files is in
[soup-pot.md](soup-pot.md).

**Cha Chaan Teng has no was-value** because it did not exist at `096b1d4` — T-007-01 opened it inside
this story. Its work list opened at 24 missing dishes and 7 missing components; nineteen ranks were
written or shelved and five components landed inside a dish, which is how it reads 5 and 2 now.

**Only four rows moved at all**, and each is S-007: One Pot took five of The Soup Pot's soups
(68 → 73), Instant Pot and Takeout Counter each gained an *only here* when `congee-instant-pot` and
`egg-drop-soup` lost their second counter, and Cha Chaan Teng arrived with 22.

Also recorded: **150 items across the twenty-one counters that a single table cannot express**, and the
reason in each case. The old figure was 107 across fifteen; nothing about what a table can hold changed,
the six counters missing from the tally were simply never counted.

Every counter is **fully sectioned**: all 904 assignments print under a heading its board would use.
Two counters list a slug they do not shelve — Cha Chaan Teng's five deliberate borrows, and One Pot's
four, which are a drift between `src/data/counters.json` and [one-pot.md](one-pot.md) dating from
`88ca990`. `node scripts/menu-sections.mjs` names both every run.

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
