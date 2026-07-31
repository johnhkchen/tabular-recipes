# T-001-12 — Design

Options considered and the decisions taken, grounded in Research. Six decisions matter;
the rest follows from them.

## D1 — How far down the gap list to go

The gate is +5 shelved / +4 exclusive. Five exclusive files clear both.

| Option | What it gives | Verdict |
| --- | --- | --- |
| **A. Exactly five** — Margherita, Sicilian, Grandma, white pizza, baked ziti | Meets the gate. Leaves the counter with no pasta to put on six sauces, and no fried anything. | Rejected: the gap doc's #5–#8 are the ones that stop it being a sauce shelf. |
| **B. Ten files, gap items #1–#8 plus one component** | Clears the gate with margin (32 shelved / 26 exclusive) and makes each of the board's four shops real: slices/pies, the dinner list, the fried counter, the sides. | **Chosen.** |
| C. Everything down to #16 (desserts, secondi, fried appetisers) | Twenty-plus files in one pass, most of them nothing to do with the conspicuous absence the ticket names. | Rejected: past the point where the ranking is doing any work. |

Chosen order, which is the gap list's order:

1. `margherita` — gap #1
2. `sicilian-pan-dough` — the component #2 needs (see D3)
3. `sicilian-pizza` — gap #2
4. `grandma-pie` — gap #2
5. `white-pizza` — gap #3
6. `baked-ziti` — gap #4
7. `chicken-parmigiana` — gap #5
8. `meatballs` — gap #6
9. `fresh-egg-pasta` — gap #7
10. `garlic-knots` — gap #8

**Skipped inside the range, with reasons:** gap #9 (calzone, stromboli) is in the gap
doc's own "What it could not stock" — one dough split into a base and a closure is the
build's flat refusal. Everything from #10 down (rollatini, lasagna, the fried-appetiser
section, arancini, pasta e fagioli, the dessert case, the salads, the secondi, tomato pie,
vodka slice, sfincione) is **not reached**, not skipped: the count is satisfied five files
earlier and the ranking says these come after.

## D2 — Where a pizza lives

`category` is a storage aisle, and no existing aisle holds a pizza.

| Option | Assessment |
| --- | --- |
| `flatbreads-and-pancakes` (with socca) | Technically true — a pizza is a flatbread. Reads as a filing error on a site whose whole front page is a Pizzeria. Nobody orders a flatbread. |
| `breads` (with `pizza-dough`) | Puts the dough and the pie in one aisle, which is the one thing the gap doc says is *not* true: the dough is a component, the pie is the item. |
| **New folder `recipes/pizzas/`, category `Pizzas`** | **Chosen.** Four files land in it immediately (margherita, sicilian-pizza, grandma-pie, white-pizza) and five more are queued behind it in the gap list (tomato pie, sfincione, vodka slice, and the two square variants). |

The ticket permits this outright — "a genuinely new kind of thing may take a new category
and folder" — and `recipes/fried-and-crispy/`, which currently holds one file, is the
standing precedent. The risk is nil: `parse-recipes.mjs` only consults `category` for the
counter fallback, and every file here names `Pizzeria` explicitly.

Same reasoning gives **`recipes/pasta/`, category `Pasta`**, for `baked-ziti` and
`fresh-egg-pasta`. `recipes/noodles/` is eleven Asian noodle dishes and calling a baked
ziti a noodle is the same filing error one aisle over. This is gap #7's point — six sauces
with nothing to put them on — and it wants a shelf, not a guest slot.

The other three land in existing aisles: `sicilian-pan-dough` and `garlic-knots` in
`breads` (beside `pizza-dough`, which is what they are made of), `chicken-parmigiana` in
`fried-and-crispy` (the cutlet is the dish), `meatballs` in `stews-and-braises` (they are
browned and then spend forty-five minutes in sauce, which is the whole method).

## D3 — One dough or two

Research constraint 3: `pizza-dough` is a 500 g-flour, ~63%-hydration, four-ball,
cold-fermented round dough, and a preparation cannot feed two later steps.

- **Margherita** and **white pizza** consume two balls of it as a plain ingredient. This is
  the `balti` → `onion-tomato-masala` pattern: `@pizza dough{2%balls}(250 g each; from the
  recipe on this shelf)`. Not a tree edge — a table cannot reach into another table.
- **Grandma pie** consumes the *same* round dough, pressed cold into an oiled sheet pan.
  That is how a grandma pie is actually made, and it is why the gap doc says being sold
  beside a Sicilian is the only reliable way to tell them apart: thin, crisp, no second
  proof.
- **Sicilian** cannot. A thick, airy tray pie is a wetter dough that proofs *in* the oiled
  pan, and one file cannot be both doughs. Hence `sicilian-pan-dough` as its own table —
  the one component this ticket writes, because without it gap #2 is unwritable.

So the pair the gap doc asks to be written together is written together, and the
difference between them is now visible as two doughs and two handlings rather than as a
sentence.

## D4 — Marinara is not pizza sauce

The gap doc's sharpest technical point: `marinara-sauce` is *cooked*, a Neapolitan pie
takes raw crushed tomato that finishes in the oven, and using the former for the latter is
why home pizza tastes stewed.

| Option | Assessment |
| --- | --- |
| A standalone `pizza-sauce.cook` | The gap doc asks for it as a component. But an uncooked sauce is *crush, season* — two operations, and the checker's floor is three columns. Padding it to three would be inventing work to satisfy a gate. |
| **The raw tomato as a branch inside each pie that wants it** | **Chosen.** `margherita` opens with `Crush @whole peeled tomatoes …` as its own branch, merging into the topping step. `grandma-pie` does the same with garlic and oregano in it. The table then *shows* the difference the gap doc is arguing for, in the place a cook reads it. |

`sicilian-pizza`, `baked-ziti`, `meatballs` and `chicken-parmigiana` all take
`@marinara sauce{…}(from the recipe on this shelf)` as a plain ingredient, because all four
genuinely want the cooked sauce. That is the honest split and it makes both sauces earn
their place.

**Recorded for T-001-18, not done here:** `recipes/sauces-and-gravies/marinara-sauce.cook`
carries `aka: red sauce, pizza sauce, Sunday gravy`. Both of those trailing names are now
wrong on the shelf — pizza sauce is the raw one, and Sunday gravy is a long-cooked
pork-and-beef dish the gap doc lists separately as its own afternoon. Editing an existing
file is another ticket's; this is the escalation the ticket asks for.

## D5 — The label staircase, and the gate nobody mentions

Research §4: `src/lib/icons.test.ts` reads the **first word of every step's label** — and
`buildTree` gives a full-width note row its label too, so a closing prose paragraph is in
scope. `src/lib/icons.ts` is another ticket's, so the remedy has to be the wording.

**Baseline measured, not assumed:** the test is **already failing on `main`** with 46 verbs
falling through to the bowl (`tare`, `tonkotsu`, `velvet`, `two`, `the`, `there`, … — the
opening words of other counters' prose rows). `npm run verify` is therefore red before this
ticket touches anything.

Decision: **every step in every new file gets a `>> step.N:` override opening with a verb
already in `VERB_ICONS`, and every closing note opens with one too.** The intended result is
zero new fall-throughs — the count stays at 46. That is verified in Plan step P3 by diffing
the fall-through list before and after, not by hoping.

This also delivers the acceptance criterion about the staircase directly: overriding every
label is what the recent, good files (`papadom`, `balti`, `char-siu-bao`) do, and it is why
their staircases read `sear 6 min over high heat / fry in 4 min / simmer 10 min …` instead
of sentence fragments.

## D6 — Shape of each table

Held to the README's 5–16 rows and 3–6 operations, and to one silhouette per kind:

- **A pie** is *(prep row: preheat)* → sauce branch → dough branch → top → bake → finish.
  Five operations, two branches, one ending.
- **A tray pie** is dough-as-ingredient → cheese → sauce on top → bake → cut. Four
  operations, one chain. Cheese under sauce is the Sicilian's whole identity.
- **A baked pasta** is boil-short → ricotta bind → toss → layer → bake.
- **A fried cutlet** follows `karaage`: pound and salt → breading standard → fry → sauce and
  cheese → bake.

Every timer is named (`~preheat`, `~bake`, `~prove`, `~rest`, `~chill`, `~simmer`,
`~brown`, `~knead`, `~fry`, `~soak`, `~cool`, `~warm`, `~boil`, `~cook`), which the ticket
requires and the existing collection does not generally do. Names are chosen for what the
wait actually is: pasta pulled at ninety seconds gets `~cook`, which `time.ts` does not
recognise and therefore reads as time you are standing there — the honest answer — while
`~bake{35%min}` reads as unattended because it is.

## What was rejected, and why

- **Writing the components list first** (mozzarella, ricotta, breading standard, garlic
  butter, sunday gravy, pasta-water emulsion). Fresh mozzarella and ricotta are bought by
  every pizzeria in the country; the breading standard is three bowls, not a table; the
  garlic butter is one operation inside `garlic-knots` where it belongs. Writing five
  component tables would meet the count while leaving the board with no items on it, which
  is the exact failure the ticket describes.
- **A "cheese pie" and a "Margherita" as two files.** One dish, one table, both names —
  `aka: cheese pizza, cheese pie, plain slice, margarita, marg, pizza margherita`. The
  counters.md entry records "Spelled *Margarita* on a great many real boards", so the
  misspelling goes in the `aka` on purpose, as `chopped-pork` does with *barbeque*.
- **`dish`/`kit` for the pies.** A Sicilian is not a pan variant of a Margherita; they are
  different dishes with different doughs. `dish` defaults to the slug and stays there.
- **Touching `src/`.** T-001-17's, stated in the ticket. The new categories do not require
  it: nothing is orphaned, because every file names its counter.
