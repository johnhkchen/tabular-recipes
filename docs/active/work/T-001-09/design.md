# T-001-09 — Design

Five decisions. Each is forced by something in `research.md`, and each names what was
rejected.

---

## D1 — How far down the ranked list to go

The floor is 22 shelved, so seven files clear it. Seven files would be butter chicken, korma,
rogan josh and four of the ten remaining sauce names — and would leave the ticket's own
Context complaint standing: *"ten printed lines rest on one onion-tomato masala base that does
not exist yet."*

**Options.**

| | Files | Reaches | Leaves standing |
| --- | --- | --- | --- |
| A. The floor | 7 | ranked 1–4 partly | the base, the tray, the starters, every component |
| B. Sauce list + its components | 17 | ranked 1–4 whole | the tray, the starters, the skewer |
| C. Ranked 1–11 whole | 32 | 1–11 + 6 components | the veg column (12), the bread variants (13), tiffin (14–19) |
| D. Everything ranked | ~58 | all of it | nothing |

**Chosen: C — 32 new files, ranked items 1 through 11 complete, and the components those items
need.** Final count **47 shelved, 47 exclusive** against a floor of 22/20.

Why C and not B: the gap doc's item 5 (papadom and the chutney tray) and item 7 (samosa,
bhaji) are the two places where the counter has *nothing at all* — "the starter section is
empty and nothing is deep-fried anywhere on the site". A sauce list with no tray in front of
it is the same shape of failure the ticket is fixing, one section over.

Why C and not D: items 12–20 are the vegetable column, six naan variants and the whole tiffin
grid. The tiffin grid is what the gap doc says should become its own **Dosa Counter**, and it
depends on a dosa/idli batter that the doc itself flags as "exactly what the build refuses"
(one preparation, four lives). Writing 26 more files to reach it would put a Dosa Counter's
worth of recipes on a curry-house shelf, and that is a board decision, not this ticket's.

C stops at a clean line: **item 11 is the last one whose components are already paid for.**
Item 12 opens the vegetable column, which is a new run of five.

Skipped items are named with reasons in `structure.md` §5 and repeated in `review.md`.

## D2 — The base, and how many components to write

The ticket names one component in its Context and the gap doc names fourteen. Writing all
fourteen is not possible: `ghee` is one ingredient (`rowCount < 3`, hard FAIL) and
`tamarind-pulp` is two.

**Chosen: six components, each of which is consumed by two or more dishes in this ticket.**

| Component | Consumed by | Why its own file |
| --- | --- | --- |
| `ginger-garlic-paste` | 14 of the new files, and `chicken-tikka-masala` already | The doc: "assumed by everything on the board, written nowhere" |
| `onion-tomato-masala` | bhuna, dopiaza, jalfrezi, madras, vindaloo, karahi, balti, dansak, patia (9) | The ticket's stated highest-value gap. One table, nine menu lines |
| `makhani-gravy` | butter-chicken, and named by tikka masala's prose | "The same gravy with a different amount of butter, which is a fact worth one table" |
| `vindaloo-paste` | vindaloo | A distinct Goan preparation — vinegar-ground, made ahead, not a step |
| `paneer` | palak-paneer, and named across the veg column | Both a component and a menu word; `queso-fresco` is the precedent |
| `birista` | biryani, and mujaddara at the Shawarma Counter | The layer, not a garnish |

**Rejected as files, folded inline instead:** `ghee` and `tamarind-pulp` (below the row floor);
`cashew-paste` and `kashmiri-chile-paste` (one blitz each, and they are the *character* of
korma and rogan josh — pulled out, both dishes become "simmer the paste in cream" and stop
being recipes); `sambar-powder`, `dosa-batter`, `chai-masala`, `tamarind-chutney` (their
consumers are all below the line D1 draws).

**How a component is consumed.** Plain `@` ingredient row with the amount and a note naming
the file, never `@&(~N)` — the reference syntax is intra-file only (research §3). So
`@onion-tomato masala{1 1/2%cup}(360 g; the base recipe)` is one row in bhuna, and bhuna's
table still shows what else goes in.

**Rejected: writing the base and then having each sauce re-derive it inline** (what
`chana-masala` does today). Nine files each spending three steps browning onions is nine
tables that open identically, and the ticket's complaint is precisely that this base is
written nowhere as itself.

## D3 — What protein each sauce is written for

The grid — korma × {chicken, lamb, prawn, paneer} — cannot go in a table (research §6). The
gap doc's instruction is explicit: *"Write the sauce once; say in prose what it runs across."*

**Chosen: each sauce is written for the protein a board prints first against that line, and
carries a footer row saying what else it runs across and what changes.**

The footer is a real build feature (`tree.ts:120`), not a comment: a paragraph with no
ingredients and no refs becomes a full-width row under the table. So the fact lands on the
page rather than in a file nobody opens.

| Sauce | Written for | Footer says |
| --- | --- | --- |
| butter-chicken | chicken thigh | the tikka is the same skewer; paneer for the veg line |
| korma | chicken | lamb wants 1 hr longer; prawn goes in at the end |
| rogan-josh | lamb shoulder | it is a lamb dish; chicken is a shop's concession |
| bhuna, madras, karahi, balti, jalfrezi, dopiaza | chicken | lamb/prawn/paneer timings |
| vindaloo | pork | Goan, and pork is the original; chicken is the English board's |
| dansak | lamb | the lentils are the dish; chicken and veg both work |
| passanda | lamb | flattened, hence the name |
| patia | prawn | Parsi, sweet-sour-hot |

**Rejected: writing one sauce file per protein** (chicken-korma, lamb-korma …). Four files
that differ in one row is the duplication the whole collection is built to avoid, and it would
put 40 near-identical tables on one shelf.

**Rejected: a protein-free "korma sauce" file.** A sauce with nothing in it is not a menu
line, and the board prints "Chicken Korma", not "Korma Sauce". `aka` carries the protein
names so a search for "chicken korma" lands.

## D4 — Spice level, and how three near-identical sauces stay three recipes

Madras, vindaloo and phal are rungs on a ladder that changes an amount (gap doc). Bhuna,
karahi and balti are all "the base, reduced hard, in a different vessel". If these come out as
one table with one cell changed, the shelf has ten lines and one recipe on it.

**Chosen: each of the ten sauce lines is written to the thing that actually makes it
different**, and the difference is in the *method*, not in a chile count:

- **bhuna** — dry-fried down until the oil separates; the least liquid on the board.
- **dopiaza** — onions twice: browned in the base, and again as fresh wedges folded in late.
- **jalfrezi** — a stir-fry, peppers and onion kept crunchy, the base barely a coating.
- **madras** — madras curry powder (already on the shelf, with nothing under it) plus tamarind.
- **vindaloo** — vinegar-ground paste, pork, no cream, marinated overnight.
- **karahi** — cooked in a karahi at high heat, tomato and ginger julienne, no onion paste.
- **balti** — finished in the serving bowl, mint and coriander, Birmingham not Baltistan.
- **dansak** — lentils cooked to a purée, sweet-sour with pumpkin and tamarind.
- **passanda** — meat flattened and marinated in yogurt, almond and cream, mild.
- **patia** — Parsi, sweet-sour-hot together, jaggery and tamarind and chile at once.

**Rejected: `phal`.** The reference says it exists mainly as a dare. A file whose only content
is "the madras with four times the chile" is the duplication above, wearing a joke.

## D5 — Timers, labels and the shape of a step

Research §3 found the two existing sauce files use bare `~{60%min}`, and that an unrecognised
timer name is worse than no name.

**Chosen:**

- Every timer named, and named **from the vocabularies in `src/lib/time.ts`** — `~simmer`,
  `~marinate`, `~rest`, `~soak`, `~steep`, `~chill`, `~drain`, `~press`, `~stand`, `~steam`,
  `~bake` on the unattended side; `~fry`, `~sear`, `~stir`, `~toast`, `~knead`, `~whisk`,
  `~brown` on the hands-on side. No `~bhuna{}`, no `~temper{}` — evocative names classify as
  nothing.
- **Steps written verb-first**, so `cleanLabel` leaves a verb behind. A `>> step.N:` override
  wherever the derived label would come out a fragment — which is anywhere a step ends in a
  clause ("… until the oil separates").
- **One root, always.** Every branch ends in a final step that references it. Practically: the
  last step of every file references `@&(~1)` (and any earlier branch by its own back-count),
  and no step is referenced twice.
- 4–7 steps and 6–14 ingredients per file. Under that the table is thin; over it the staircase
  runs off the page.

**Rejected: leaving timers unnamed to match `chicken-tikka-masala`.** The ticket names this as
acceptance, and the existing files are the thing being corrected.

---

## What this design does not do

- It does not touch `src/data/counters.json`. Until T-001-17 runs, the Curry House page prints
  its eight old sections and the 32 new files are shelved but unsectioned. That is the
  ticket's own boundary, and it is worth saying out loud in `review.md`.
- It does not add a Dosa Counter or move `doro-wat`/`berbere` to an Ethiopian board. Both are
  maintainer decisions the gap doc raises and neither is in the acceptance criteria.
- It does not rewrite `chana-masala` to consume the new base, though it now could. That file
  belongs to another ticket, and the edit is recorded in `review.md` for T-001-18.
