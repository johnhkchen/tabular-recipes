# T-001-10 — Design

## The decision in one line

Write **13 new `.cook` files**, all exclusive to the Taquería, working straight down
`docs/gaps/taqueria.md` from the top and stopping cleanly at the end of ranked item **#7**
— which takes the counter from 20/12 to **33 shelved / 25 exclusive** against a gate of
24/18.

## What the numbers force

The gate is two numbers: ≥24 shelved, ≥18 exclusive. Today: 20 and 12. A file that names
only the Taquería moves both, so **six** new exclusive files is the arithmetic minimum. The
ranking in the gap doc is what decides which files, and the acceptance criteria say to work
down it "in that order, as far as the count above reaches".

## Options considered

### A. The arithmetic minimum — six files

al-pastor, salsa-verde, carne-asada, pollo-asado, tinga-de-pollo, chile-verde. Clears both
numbers with nothing to spare.

**Rejected.** It stops in the middle of ranked item #6 (the four cuts — lengua, suadero,
cachete, tripa — which the gap doc treats as one argument: "the four cuts that tell you it
is a real taquería"), and it leaves the al pastor adobo — the component the gap doc calls
"the missing thing behind the missing thing" — unwritten while writing the dish that needs
it. Six files also leaves no margin: if one file turns out unwritable under the 3×3 floor,
the ticket fails its own gate.

### B. Down the list to the end of item #7 — thirteen files  ← chosen

| # in gap doc | Files |
| --- | --- |
| components | `adobo-para-al-pastor` |
| 1 | `al-pastor` |
| 2 | `salsa-verde`, `salsa-verde-cruda` |
| 3 | `carne-asada` |
| 4 | `pollo-asado`, `tinga-de-pollo` |
| 5 | `chile-verde` |
| 6 | `lengua`, `suadero`, `cachete`, `tripas` |
| 7 | `consome-de-birria` |

Every one of these is a board line in the vocabulary table in `docs/knowledge/counters.md`,
so every one has real `aka` spellings to carry. Every slug is free. None of them is an edit
to an existing file, so the T-001-18 escalation path is not needed.

**Why it stops there.** Item #8 is the garnish tray, and it is where the list stops being
writable as tables: `crema` already exists (`crema-mexicana`), and *cebolla y cilantro* is
two ingredients and one operation — below the checker's 3-row/3-column floor and below the
README's honest-table line. Ending at #7 ends on a complete thought (the birria order,
whole) rather than mid-item.

### C. The whole list — twenty-two items

**Rejected.** The gap doc's own "What it could not stock" section disqualifies several
(the grid itself, the mojado burrito, aguas frescas as three tables, the plancha), and
several more — sopes, huaraches, tortas, pupusas — depend on components nobody has written
(sope masa, bolillo at the Panadería, Salvadoran chicharrón). Attempting them here either
produces stub recipes or drags in files this ticket does not own. They are named as skipped,
with reasons, in `progress.md`.

## Design decisions inside the chosen set

### 1. Al pastor is two files, and says it is not the trompo

The gap doc is explicit on both halves. On the dish: "Al pastor as the trompo makes it" has
no final operation, so a home version — marinate, stack, roast, slice, crisp — "is writable
and worth writing, but it is a different dish and should say so." On the component: "Adobo
para al pastor … someone who liked al pastor is looking for this and has no name for it."

So:

- `adobo-para-al-pastor` in `spice-blends-and-marinades/` — toast guajillo and ancho, soak,
  blend with achiote, pineapple juice, vinegar and spices, strain. Its own table, its own
  search term, alongside the existing `taco-seasoning` and `mojo-marinade`.
- `al-pastor` in `smoked-and-grilled/` — takes the adobo as a plain ingredient (the
  precedent is `burnt-ends`, which takes `@barbecue sauce{1%cup}` the same way), marinates
  sliced pork shoulder, packs the stack in a loaf tin under a pineapple crown, roasts,
  rests, shaves, and crisps the shavings on the griddle. The title carries "home trompo" in
  its `aka` and the marinade step says the stack stands in for the spit.

Rejected alternative: one file with the adobo inline, the way `birria-de-res` does it. That
buries the searched-for thing and would push al pastor to eight operations, past the
README's six-column ceiling.

### 2. Salsa verde is two files, not one

The gap components section: "Salsa verde cruda and salsa verde asada — raw and charred are
different sauces on the same board." They are different ingredients lists and different
trees, not one recipe with a note.

- `salsa-verde` is the charred/cooked one, deliberately built as the mirror of the existing
  `salsa-roja` (char on a comal → blend coarse → fry → finish off the heat), because the
  board prints the pair on one line and the two tables should read as a pair.
- `salsa-verde-cruda` is the raw one: rinse the tomatillos, blend, fold in onion and
  cilantro. Three operations, which is the floor and honestly all a raw salsa has.

Rejected alternative: one `salsa-verde` with the raw version as a note. A note is not a
table, and the collection's rule is that a different tree is a different file.

### 3. The consomé starts from the braise, as its own file

The gap doc: birria and its consomé "cannot be a second branch of the same tree" — one
preparation, two endings, which `layout.ts` refuses outright. `consome-de-birria` therefore
takes `@birria braising liquid{}` as a plain ingredient row, strains it, skims it, sharpens
it with a chile de árbol steep, and finishes with onion, cilantro and lime. It carries
`pairs-with: birria-de-res`, which the build makes mutual without editing birria's file.

### 4. The four cuts are four files, in the gap doc's order

lengua, suadero, cachete, tripas. Each is a genuinely different method and none is a
variant of another — tongue is simmered whole then peeled and griddled; suadero is cooked
slow in its own fat; cachete is braised; tripa is boiled soft then crisped hard. They are
not `dish`/`kit` siblings; each is its own dish.

Rejected alternative: one "the offal cuts" file. A permutation is not a recipe, and four
methods on one table is four endings.

### 5. No shared toasted-chile-purée file

The gap components section makes the strongest case on the list for one: birria,
red-enchilada-sauce, mole-poblano and adobada all begin with toasted, soaked, blended,
strained dried chiles. **Not written here anyway**, because the three existing files each
carry that work inline already, and a shared file only pays for itself if those three are
rewritten to use it — which is an edit to files this ticket does not own. Recorded for
T-001-18 in `progress.md` instead. The new `adobo-para-al-pastor` does its own toasting, in
step with the three existing files rather than ahead of them.

### 6. Categories

| File | Folder | Why |
| --- | --- | --- |
| `adobo-para-al-pastor` | `spice-blends-and-marinades` | Sits with `taco-seasoning`, `mojo-marinade`, `tandoori-marinade`. |
| `al-pastor`, `carne-asada`, `pollo-asado` | `smoked-and-grilled` | Fire and a grate; the folder already holds eight barbecue files. |
| `tinga-de-pollo`, `chile-verde`, `lengua`, `suadero`, `cachete`, `tripas` | `stews-and-braises` | Where `carnitas` and `birria-de-res` already are. |
| `salsa-verde`, `salsa-verde-cruda` | `sauces-and-gravies` | Beside `salsa-roja`. |
| `consome-de-birria` | `soups` | It is a cup of broth. |

No new category folder is needed, which is the outcome the ticket prefers ("use an existing
category where one fits").

### 7. Writing rules adopted for every file

Drawn from Research §4, and each one is a gate something enforces:

1. **Opening verb must be in `VERB_ICONS`.** The `--labels` staircase is checked for every
   file *and* the first word of each label is checked against the table in
   `src/lib/icons.ts` before committing. This is what cost T-001-06 an unplanned tenth step.
2. **Every timer named**, per the acceptance criteria, and named with a word `time.ts`
   recognises (`~braise{}`, `~simmer{}`, `~marinate{}`, `~sear{}`, `~rest{}`…) so the
   hands-on/unattended reading comes from the author rather than a guess.
3. **No hands-on timer at or over 4 hr** — `collection.test.ts` fails it. Long marinades
   and braises get unattended names.
4. **3–6 operations, 5–16 rows.** Under 3 of either the checker refuses; over 6 columns the
   table scrolls on a phone.
5. **Prep steps at the top only**, because `~1` counts them.
6. **`aka` carries a diacritic-free form** — required by the acceptance criteria and
   already the collection's habit. `consome` beside `consomé`, `pastor`, `adobada`.
7. **Quantities real for the stated servings.** Taquería servings are stated in tacos where
   the board would: a 3 lb pork shoulder is 8 servings of tacos, not 4 of a dinner plate.

## What this design does not do

- It does not touch `src/data/counters.json`. The new files will not appear in the rendered
  Taquería menu sections until T-001-17 runs; they *are* on the counter, because
  `>> counters:` is what `parse-recipes.mjs` reads, and that is what the acceptance criteria
  count.
- It does not add this counter to any existing recipe. Nothing at the top of the gap list
  needed it.
- It does not write the pupusería block, the masa vehicles, or the drinks. Those are named
  with reasons in the work artifact.
