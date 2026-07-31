# T-001-06 — Design

Three real decisions here: how far down the ranked list to go, how to handle the one dough
that becomes four breads, and whether the components count as shelf items. Everything else
follows from Research.

## Decision 1 — how many files, and where the line falls

The criteria bind on **exclusivity**, not on total: ≥18 shelved is satisfied by 6 new files,
but ≥12 naming Panadería *and no other counter* needs 12 new exclusive files. So the count is
set by the second number, and the ranked list is worked down until it is met with headroom.

### Options

**A. Minimum viable — 12 files, ranked 1–8 plus components.**
Meets both numbers exactly. Rejected: no headroom if one file fails review, and it stops
mid-way through the "on every list" tier — mantecada, cubilete, bigote and polvorón rosa are
all still named at the top of the doc as things the case obviously has.

**B. Ranked 1–13 plus the five components they need — 18 files.** ← **chosen**
Lands 30 shelved / 17 exclusive. The cut at 13 is a real seam, not a budget: items 1–13 are
things that are *in the case on a tray*, and each is a short table. Item 14 (tamales) is the
first that needs a build of its own — masa preparada, a chile-braised filling and a husk
assembly, three tables before the dish exists — and 15–22 are fryer, drink, and by-the-kilo
items whose components nothing else on the list shares.

**C. The whole list to 22.**
Rejected. It would mean writing masa preparada, a tamal filling, cajeta, a fryer batter and
the collection's first drink — roughly doubling the ticket for items the count does not
reach, and taking speculative ownership of `recipes/drinks/`, which is empty and which no
ticket has claimed. Better as the next pass, named as skipped here.

**Skipped, and why**, as the criteria require: **14 tamales** (needs masa preparada plus a
braised filling — two prerequisite tables, and the counter-sign phrase belongs with the
tortillería side rather than the tray), **15 churros** (needs a fryer table and cajeta),
**16 pan de elote**, **17 buñuelos** (fryer plus piloncillo), **18 gelatina** (the gap doc
itself calls the case a split), **19 capirotada**, **20 masa fresca / preparada** (gap doc:
"could not stock" for masa fresca; masa preparada waits on tamales), **21 tostadas / totopos**,
**22 café de olla / atole** (no drink exists on the site; `recipes/drinks/` is empty and
unclaimed). All are below where the count reaches.

## Decision 2 — one dough, four breads

`buildTree` throws when a step feeds two later steps: *"a table is a tree, so a preparation
can only flow into one place."* Conchas, cuernos and bigotes are the same enriched dough with
three finishes. Three ways to write it:

**A. One `pan-dulce` file that branches into three shapes.** Impossible — that is precisely
the throw above. Even sequentially (shape half, shape the other half) it is two roots.

**B. Three self-contained files, each repeating the dough.** Rejected: the same dough written
three times is three tables that disagree the first time one is corrected, and the gap doc
names this as the split to avoid.

**C. One `pan-dulce-dough` file, consumed by name as an ingredient row.** ← **chosen**
`recipes/pastry-and-doughs/pan-dulce-dough.cook` is a real table (yeast sponge → enrich →
knead → rise). `conchas`, `cuernos` and `bigotes-de-pina` each open with
`@pan dulce dough{...}` as an ordinary ingredient row and `pairs-with: pan-dulce-dough`.
This is the shape the gap doc asks for outright — *"a dough recipe and four short recipes
that consume it"* — and the collection already does it: `lo-mein` and `egg-foo-young` consume
`char-siu` as a plain ingredient row.

The same reasoning applies to `hojaldre` (oreja + campechana — the gap doc says these two
"could not" be one table), `costra-de-azucar` (conchas + bigotes), `relleno-de-pina`
(empanadas + bigotes) and `piloncillo-syrup` (puerquitos, and the items below the line).

Consequence accepted: a cook making conchas from scratch reads two tables. That is the cost
of the tree rule and it is the cost the gap doc already priced.

## Decision 3 — do components count as shelf items?

Yes. The Bakery shelves `all-butter-pie-crust` and `sweet-tart-shell` under **"Doughs and
shells"**, and `nixtamalised-masa` — a component written by T-001-01 — carries
`counters: Panadería, Taquería` today. A dough on the panadería shelf is the collection's own
precedent. It is also true to the counter: a panadería that is also a tortillería sells masa
by the pound, and the gap doc's whole "Components it would need" section is written as things
this counter needs to stock.

Guard against gaming the number: **17 of the 18 new files are finished items or doughs a
customer could actually be sold**, and the 13 ranked dishes alone clear the ≥12 exclusive bar
without counting a single component. The components are additive, not load-bearing.

## Decision 4 — `hojaldre` is shared with the Bakery

`docs/gaps/bakery.md` lists laminated dough as a component *it* needs, naming campechana and
oreja among the things waiting on it. T-001-01 deduplicated five shared components; laminated
dough was not among them, so no ticket owns it. Writing it Panadería-only would set up
exactly the duplicate T-001-01 exists to prevent.

So `recipes/pastry-and-doughs/hojaldre.cook` carries `counters: Panadería, Bakery`. It is the
one new file that is not Panadería-exclusive, which costs one against a bar already cleared by
five. T-001-16 should consume it rather than write a second laminated dough; that goes in
`review.md` as an open concern, since this ticket cannot edit another ticket's gap doc.

Rejected alternative: write it Panadería-only and let the Bakery write its own croissant
dough. Rejected because they are the same détrempe-and-butter-block table, and the difference
(butter vs. shortening, three turns vs. four) is a note, not a second recipe.

## Decision 5 — rough puff vs. classic lamination

The canonical-method criterion applies. A panadería's hojaldre is a laminated dough with a
butter (often shortening) block and three or four letter folds — not a rough-puff shortcut
wearing the name. Chosen: **détrempe + butter block, four letter folds with rests**, written
as a chain of fold steps so the table is a real staircase. Rough puff is rejected: it is the
shortcut the criterion names.

Same test applied elsewhere: conchas get a **straight enriched dough with a real bulk rise and
a proof**, not a one-rise quick bread; bolillos get a **preferment-free but properly bulked
lean dough with steam**, which is the shop method; puerquitos are **piloncillo-sweetened**,
not molasses-and-brown-sugar; polvorones rosas are **shortening-and-cinnamon** discs, not the
nut-and-butter snowball `russian-tea-cakes` already covers.

## Decision 6 — folders

No new folder is needed, and none is created. Placement follows the existing sort:

- **breads/** — anything yeast-raised: conchas, bolillos, teleras, cuernos, bigotes.
- **pastry-and-doughs/** — the doughs and the topping paste: pan-dulce-dough, hojaldre,
  costra-de-azucar. Joins `all-butter-pie-crust`, `sweet-tart-shell`, `nixtamalised-masa`.
- **cookies/** — puerquitos, polvorones-rosas, orejas, campechanas. Orejas and campechanas are
  laminated but they are sold and eaten by the piece from the cookie tray; `florentines` and
  `pizzelle` set the precedent that "cookie" here is the shelf, not the chemistry.
- **cakes-and-loaves/** — mantecadas (the fluted paper case is a muffin/cake).
- **custards-and-puddings/** — cubiletes-de-queso, chocoflan, relleno-de-pina. `flan` is here,
  and `red-bean-paste` / `lotus-seed-paste` prove a filling belongs here rather than in sauces.
- **sauces-and-gravies/** — piloncillo-syrup. It is poured, and it is a syrup.
- **empanadas-de-pina** → **pastry-and-doughs/**? No — it is a finished turnover with its own
  short-dough table inside it. It goes to **cookies/**, alongside the other by-the-piece
  tray items. Recorded here because it was the one placement that was genuinely arguable.

Rejected: a new `recipes/pan-dulce/` folder. The collection sorts by *kind of thing*, not by
counter — `counters:` already does the counter — and a per-counter folder would be the first
of its kind.

## Decision 7 — naming and `aka`

Slugs are the plural form a shop board prints (`conchas`, `bolillos`, `orejas`), except where
the singular is the name (`chocoflan`, `hojaldre`). Every title keeps its diacritics; every
`aka` carries **at least one form typed without diacritics** — the criterion is explicit —
plus the alternate shop names the gap doc records (`marranito`, `cochinito de piloncillo`,
`cuernito`, `pan de yema`, `pastel de queso`). English glosses go in `aka` too, because that
is how a non-Spanish-speaking cook searches.

## What Design does not decide

Section placement on the rendered page (`src/data/counters.json`) is T-001-17's, and this
ticket writes no file outside `recipes/**`.
