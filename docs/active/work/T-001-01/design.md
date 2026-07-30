# T-001-01 — Design

Five files, five decisions each: scope, folder, tree shape, timers, metadata. The options
below are weighed against what Research found, not against what would be nice.

## Decision 1 — Scope: the five, and only the five

Research turned up three cross-counter components with no owner: **sweetened whipped cream**
(Bakery + Diner), **plain chicken stock** (Deli + Takeout Counter) and **pickled mustard
green** (Phở & Bánh Mì + Thai Kitchen).

**Options:**

1. **Write the five named in the ticket.** Ships the blocking ticket fastest; leaves three
   components where two tickets could each write their own copy.
2. **Write all eight.** Removes every known duplicate-recipe race in the story.
3. **Write the five, and name the other three as a board decision in Review.**

**Chosen: 3.**

The ticket says *"keep it tight — these five"*, and the story says every counter ticket
depends on this one, so the cost of widening is paid fifteen times over in scheduling. More
importantly, the story handles cross-ticket contention **on the board**, not in an agent's
judgement: it has an explicit table of contested dishes with an owner named for each, and it
resolved cornbread by assigning it to T-001-17. Three newly-found contested components belong
in that table, which is a board edit — and this ticket is forbidden from editing anything
outside `recipes/`. Writing them here would be me arbitrating an ownership question the story
reserves for itself.

Rejected 1 because silently dropping the finding is how the duplicate-under-two-names cleanup
happens again. Rejected 2 because it is a scope decision dressed up as thoroughness, and
because whipped cream and chicken stock are plausibly *inline* in the dishes that want them,
which is a call the counter tickets are better placed to make.

Review will state the three, with the counters that ask for them, as the handoff.

## Decision 2 — Which folder each component lands in

There is no "cheese", "filling" or "condiment" folder, so each of the five has to be argued
into an existing category. The category is a display grouping and a fallback for counter
assignment only; since all five name their counters explicitly, the fallback never fires, and
the only thing at stake is which shelf a browser finds it on.

| Component | Folder | Category string | Why |
| --- | --- | --- | --- |
| nixtamalised masa | `pastry-and-doughs` | `Pastry & Doughs` | The output is a dough. The folder is named for doughs, not only for pastry, and it currently holds two shells because it is new — not because it is a pastry-only shelf. |
| crema mexicana | `dressings-and-dips` | `Dressings & Dips` | It is a table condiment poured over finished food, which is what that folder is (`toum`, `tzatziki`, `tahini-sauce`). |
| queso fresco | `dressings-and-dips` | `Dressings & Dips` | Same shelf, and the Panadería doc names crema and queso fresco in one breath as *"sold from the same case, and both are short tables."* Keeping them together is what that sentence describes. |
| red bean paste | `custards-and-puddings` | `Custards & Puddings` | The precedent is exact: `lemon-curd` and `pastry-cream` are sweet fillings shelved there already. |
| lotus seed paste | `custards-and-puddings` | `Custards & Puddings` | Sibling of the above; the two are asked for together by both counters. |

**Rejected for masa:** `flatbreads-and-pancakes` (where `corn-tortillas` lives) — masa is the
input to a tortilla, not a griddled thing, and shelving a dough among finished flatbreads
would make the tortilla page's own component invisible. **Also rejected:**
`rice-beans-and-grains` — defensible, since nixtamal is whole field corn simmered, but the
recipe's ending is a dough and the last operation is a grind.

**Rejected for queso fresco:** `custards-and-puddings` (milk set with acid is mechanically
adjacent to a custard) — it is savoury, it is crumbled onto tacos, and it would be the only
savoury item on that shelf.

## Decision 3 — What each table actually is

Every one of the five is a **component**: a linear chain with a single ending. None of them
branches, so the "no splits / one ending" rule is satisfied structurally rather than by
careful arrangement. The design pressure is the opposite one — the **5-ingredient-row floor**
on preparations that a cook would describe with three ingredients.

The honest way to reach five rows is to write the water separately where it genuinely is
separate: cooking liquor that gets discarded is not the same ingredient as the water that
goes into the grind, and a cook needs both quantities. This is used for masa (lime water,
rinse water, grind water) and both pastes (blanch water, simmer water). It is not padding —
it is the difference between a table you can follow and one you cannot.

**Rejected:** inflating rows with optional garnishes and "to taste" lines. That reads as
filler and the tables are meant to be read at a glance.

### The five trees

```
nixtamalised-masa                 5 rows,  5 ops
  slake the cal  ->  simmer the corn 15 min  ->  steep 8 hr  ->  rinse and rub off the hulls  ->  grind to a masa

crema-mexicana                    6 rows,  4 ops
  warm the cream to 85°F  ->  whisk in the buttermilk, culture 24 hr  ->  season with lime and salt  ->  chill 4 hr

queso-fresco                      5 rows,  5 ops
  heat the milk to 185°F  ->  stir in the acid, stand 20 min  ->  drain 45 min  ->  salt and press 2 hr  ->  chill 2 hr

red-bean-paste                    6 rows,  5 ops
  boil 5 min and drain  ->  simmer 90 min  ->  mash  ->  cook down with sugar 25 min  ->  cool 1 hr

lotus-seed-paste                  7 rows,  5 ops
  soak 4 hr and pull the germ  ->  simmer 60 min  ->  blend smooth  ->  fry down with sugar and oil 30 min  ->  cool 1 hr
```

All five sit inside 5–16 rows and 3–6 operations. `colCount` is depth + 1, so a linear
five-step chain draws six columns — comfortably above the checker's floor of three and at the
README's ceiling for operations, not over it.

**Rejected: folding `mash` into the simmer step for red bean paste.** Mashing is where the
cook chooses tsubu-an (chunky) or koshi-an (sieved), which is the distinction the Bakery doc
explicitly asks for. It earns its column.

**Rejected: writing tsubu-an and koshi-an as two files.** They are one preparation to the
point of divergence and diverge only in whether you push it through a sieve. Two files would
be the same recipe under two names, which is the exact thing this ticket exists to prevent.
The choice is written as a sentence in the mash step plus an `aka` carrying both words.

## Decision 4 — Timers

Every timer is named, per the acceptance criteria. Beyond that, names are chosen from the
vocabulary `src/lib/time.ts` already classifies, so the clock reads the wait from the name
rather than falling back to parsing the operation label:

| File | Timers |
| --- | --- |
| nixtamalised-masa | `~simmer{15%min}`, `~steep{8%hr}`, `~rest{30%min}` |
| crema-mexicana | `~culture{24%hr}` *(see below)*, `~chill{4%hr}` |
| queso-fresco | `~stand{20%min}`, `~drain{45%min}`, `~press{2%hr}`, `~chill{2%hr}` |
| red-bean-paste | `~boil{5%min}`, `~simmer{90%min}`, `~simmer{25%min}`, `~cool{1%hr}` |
| lotus-seed-paste | `~soak{4%hr}`, `~simmer{60%min}`, `~fry{30%min}`, `~cool{1%hr}` |

`culture` is **not** in either set in `src/lib/time.ts`, so it would fall back to reading the
operation label. Two options: use `~ferment{24%hr}` (recognised, unattended) and lose the
word a cook would actually use, or keep `culture` and let the fallback read it.

**Chosen: `~ferment{24%hr}`.** The acceptance criterion is that the clock reads the wait *as
stated rather than inferred*, and `culture` would be inferred. `culture` goes in the step
sentence, where it costs nothing. Heating steps get **no** timer at all rather than an
unrecognised one — "heat to 185°F" is a temperature target, not a duration, and inventing a
duration for it would be the kind of guess the timer rules exist to prevent.

## Decision 5 — `pairs-with`, and the ordering trap

`pairs-with` is made mutual at build time, so it is written on one side only and **never**
requires editing a file this ticket does not own. But a slug that does not resolve is a build
error, and no counter ticket has run yet — so every target must exist **today** or be one of
the four other files created here.

| File | pairs-with | Target exists |
| --- | --- | --- |
| nixtamalised-masa | `corn-tortillas`, `carnitas` | yes, yes |
| crema-mexicana | `birria-de-res`, `refried-beans` | yes, yes |
| queso-fresco | `salsa-roja`, `mexican-red-rice` | yes, yes |
| red-bean-paste | `japanese-milk-bread`, `lotus-seed-paste` | yes, created here |
| lotus-seed-paste | *(none — the pairing is written on red bean paste's side)* | — |

The obvious targets for the two pastes — mooncake, anpan, sesame ball, lotus paste bun — are
all unwritten, and are exactly what the Bakery and Dim Sum Counter tickets will add. They
will point at these files, and the build will make it mutual from their side. Nothing is left
dangling.

## Decision 6 — `aka`, and how a searcher actually types

The README says `aka` is what someone calls it when they order it; the repo convention
(`do-chua`, `pan-de-muerto`) is that the un-accented spelling is listed too, because a
searcher types on a plain keyboard. Applied here:

- **nixtamalised masa** — `masa`, `masa nixtamalizada`, `nixtamalized masa`, `nixtamal`,
  `masa fresca`, `fresh masa`, `hominy dough`
- **crema mexicana** — `crema`, `mexican crema`, `mexican sour cream`, `crema agria`
- **queso fresco** — `queso blanco`, `fresh cheese`, `mexican fresh cheese`, `ranchero cheese`
- **red bean paste** — `anko`, `an`, `tsubuan`, `koshian`, `azuki paste`, `adzuki bean paste`,
  `hong dou sha`, `dou sha`, `sweet red bean paste`
- **lotus seed paste** — `lotus paste`, `lian rong`, `lin yung`, `sweet lotus seed paste`,
  `mooncake filling`

Both spellings of the ticket's own word are covered: the title uses the repo's British
`nixtamalised` (matching `normalise.mjs`), and `nixtamalized masa` is in `aka`.

## Decision 7 — Metadata shape

All 249 existing files carry `>> time:`, so all five carry it, set to the sum of the named
waits plus working time. `servings` for a component is written as the number of portions the
yield covers, which is how `lemon-curd` (12) and `do-chua` (12) do it. `dish` and `kit` are
omitted: none of the five has an equipment variant, and `kit` means *a variant exists and is
written*.

`>> step.N:` label overrides are used wherever the derived label would come out as a
fragment. The derived label is the step with ingredients stripped, so a step that opens with
its ingredient ("`@whole milk{}` and `@heavy cream{}` heated to 185°F") can strip down to
nothing. Every file is checked with `--labels` and the staircase is read as a cook's verbs
before it is committed.

## What this design does not do

- It does not touch `src/data/counters.json` or `src/data/aisles.json` (T-001-17 owns both),
  so new ingredients — cal, adzuki beans, lotus seeds, maltose — will fall through the aisle
  map until that ticket runs. That is expected, not a defect.
- It does not write the dishes that consume these components. The counter tickets do.
- It does not update `docs/gaps/` — the story assigns that to the end of the pass.
