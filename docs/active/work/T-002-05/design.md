# T-002-05 — Design

Research said what exists. This says what gets written, and what does not.

## The decision in one paragraph

Twelve new `.cook` files in `recipes/rice-beans-and-grains/`, each naming
`counters: The Bowl Shop` and each a composed bowl whose grain, protein and vegetable are cooked
inside its own table. Every one is built as **three or four branches that merge once**: a base
branch, a protein branch (marinate → cook, so the protein is two operations), a
roasted-or-charred branch, and a final build. Finished components that already exist —
`teriyaki-sauce`, `harissa`, `basil-pesto`, `barbecue-sauce`, `bulgogi`-style marinades, the forty
dressings — enter as **named ingredients plus a `pairs-with:` line**, never as steps.

## Decision 1 — what "a bowl that cooks" means, mechanically

`docs/gaps/bowl-shop.md` refuses the bowl outright ("one operation over eight leaves"). The ticket
asks for bowls anyway, on one condition: real cooking. The two are only reconcilable if the
condition is made structural rather than aspirational, so this is the rule every file is built to:

> **No file may take a component in already finished unless that component is a `pairs-with:`
> slug.** Anything the bowl needs that is *not* an existing recipe is cooked in the table.

That single rule produces the four-branch shape, and it produces it for a reason a reader can see:
the sweet potato is roasted in the table because there is no `roasted-sweet-potatoes` file to point
at; the teriyaki glaze is an ingredient because `teriyaki-sauce` is a file.

**Operation budget.** Five operations per bowl, occasionally four or six. `check-recipes.mjs:70-72`
fails under three rows or three columns; the README asks for 5–16 rows and 3–6 operations. Five
gives four non-assembly operations against an acceptance floor of three, and lands `colCount` at
4–5, comfortably inside the phone-scroll budget.

### Options considered for the shape

| Option | What it looks like | Verdict |
| --- | --- | --- |
| **A. Component-plus-`pairs-with`** (the gap note's own recommendation) | The bowl is a stub that names six slugs | **Rejected.** It is what the ticket exists to refuse, and it fails the acceptance floor of three non-assembly operations. It is also already T-002-07's job. |
| **B. Assemble-from-scratch** — every component cooked in the table, dressing included | Ten to fourteen operations, twenty-plus rows | **Rejected.** Blows the six-operation ceiling, re-teaches the forty dressings, and makes the table scroll sideways past any phone. |
| **C. Three or four branches, one merge** ← chosen | Base · protein (2 ops) · roasted thing · build | **Chosen.** Four non-assembly operations, 10–16 rows, `colCount` 4–5, and it is literally the build order the gap note reads off the boards: base, then greens, then what goes on top, then the dressing last. |
| **D. Two bowls per dish (a `dish`/`kit` pair)** | e.g. a sheet-pan version and a skillet version | **Rejected.** `kit` means equipment, not effort, and doubling the file count halves the number of distinct bowls this ticket delivers. |

## Decision 2 — which bowls, and in what order

The gap note has **one** ranked list for the whole counter, not one per menu section. Read against
the ticket's instruction to *stay in the bowls*, the grain-bowl entries are ranks **4, 8, 15, 19,
22** (Research §6). Those are written first, in that order, and the remaining eight come from the
same four boards the gap note was read off (Goop Kitchen, Sweetgreen, Cava, Dig), chosen for
protein spread and for having a **name a cook could say at a counter** rather than a list of
contents.

| # | Slug | Gap rank | Board it is printed on | Base | Protein |
| --- | --- | --- | --- | --- | --- |
| 1 | `harvest-bowl` | **8**, plus 1 and 20 as steps | Sweetgreen | wild rice (rank 4) | roast chicken, pulled |
| 2 | `teriyaki-chicken-bowl` | **19**, plus 17 as a step | Goop, Sweetgreen | short-grain rice | glazed chicken thigh |
| 3 | `crispy-rice-bowl` | **15**, plus 2 and 16 as steps | Goop | crisped day-old rice | jammy egg — vegetarian |
| 4 | `harissa-chicken-bowl` | ticket-named, plus 3 as a step | Cava | farro (rank 4) | harissa chicken |
| 5 | `miso-salmon-bowl` | **5** | Sweetgreen, Dig | brown rice | miso-glazed salmon |
| 6 | `bbq-tofu-bowl` | 14, plus 7 as a step | Goop, Sweetgreen | quinoa (rank 4) | glazed tofu — vegan-leaning |
| 7 | `burrito-bowl` | — | the archetype the whole build-your-own grid came from | cilantro-lime rice | seared chicken thigh |
| 8 | `poke-bowl` | — | ticket names "poke bowl" as a search term; `counters.md:966` records Bowl Shop as poke and donburi | seasoned sushi rice | marinated tuna |
| 9 | `spicy-lamb-bowl` | — | Cava | brown basmati | crisped spiced lamb |
| 10 | `chicken-pesto-bowl` | — | Sweetgreen (their best seller) | warm farro | seared chicken, parmesan frico |
| 11 | `fish-taco-bowl` | — | Sweetgreen | lime rice | blackened cod |
| 12 | `crispy-chickpea-bowl` | 9, plus 21 as a step | Goop, Cava | quinoa | crisped spiced chickpeas |

**Twelve rather than ten**, because the acceptance floor is ten and two of these carry structural
risk (`poke-bowl` on the archetype question below, `crispy-rice-bowl` on the operation floor). If
either has to be pulled at Review the ticket still delivers.

**Protein spread**: chicken 5, fish 3, tofu/chickpea 2, lamb 1, egg 1. Chicken is over-represented
because it is over-represented on the boards — the gap note's rank 20 records it as "the default
protein on half its menu" — but no two chicken bowls are cooked the same way: roasted and pulled,
seared and glazed, marinated and roasted, seared with a spice crust, seared with a frico.

**Bases**: wild rice, farro ×2, quinoa ×2, brown rice, brown basmati, short-grain, sushi rice,
day-old jasmine, long-grain white ×2. This is how rank 4 — quinoa, farro and wild rice, "none of
the three exists here" — gets closed: all three are cooked from raw, in a table, three times over.

### Rejected bowls, and why

- **A shawarma bowl, a falafel bowl, a meatball bowl, a carne asada bowl.** Each would re-teach
  `chicken-shawarma`, `falafel`, `meatballs`, `carne-asada`. The acceptance criteria forbid it and
  T-002-08 can shelve those files at this counter for free.
- **Bibimbap and a donburi (oyakodon, gyudon).** They are genuinely composed rice bowls with real
  cooking, and `counters.md:966` does record a "Bowl Shop (poke and donburi)" archetype — but that
  is a *different* archetype from the Goop/Sweetgreen/Cava/Dig counter T-002-01 actually opened,
  and T-002-01's review flagged the name collision as unresolved. Writing a Korean and a Japanese
  rice bowl onto a shelf whose gap note is read off four Californian salad chains would decide that
  collision by fiat, in a ticket that is not allowed to edit `counters.md`. Left for whoever
  resolves it. **`poke-bowl` is the one exception**, because the ticket itself names "poke bowl" as
  a search term this shelf has to answer for.
- **Plain quinoa, plain farro, plain wild rice as three grain tables** (rank 4's literal reading,
  and what `## Components it would need` asks for). Every acceptance criterion here says *composed
  bowl*; a one-grain table is not one. All three grains are cooked inside bowls instead, and the
  three plain component tables are recorded as still-missing.
- **A "hot grain bowl base" file** (rank 22). The gap note itself calls it "a technique note as
  much as a recipe", and a technique note is not a table. It is carried instead as the header
  sentence on the bowls where the warm base does the work.

## Decision 3 — one folder, one category

All twelve go in `recipes/rice-beans-and-grains/` with `category: Rice, Beans & Grains`.

- **Rejected: a new `recipes/bowls/` folder.** The folder names the category, so a new folder
  invents a category no counter claims (`counters.json` gives The Bowl Shop `categories: []`).
  Every one of these files names its counter explicitly, so the folder buys nothing and costs a
  category page nobody asked for.
- **Rejected: scattering by protein** (salmon to a fish folder, tofu to vegetables). The gap note's
  own "Grain bowls" list is thirteen `rice-beans-and-grains` slugs. A bowl is a grain dish.

## Decision 4 — how existing components are referenced

`pairs-with` is validated at build (`collection.test.ts:36-39`) and **made mutual there**, so
writing it on one side only is correct and edits no pre-existing file — which is what keeps this
ticket inside "no file that existed before this ticket is edited."

Two ways a component can enter a bowl, and they are used deliberately:

1. **As an ingredient _and_ a `pairs-with` slug** — when the bowl genuinely cannot be cooked
   without it: `@teriyaki sauce{1/2%cup}` in bowl 2, `@harissa{3%Tbs}` in bowl 4,
   `@basil pesto{1/3%cup}` in bowl 10, `@barbecue sauce{1/3%cup}` in bowl 6. The reader is told
   where to get it and the table does not re-teach it.
2. **As a `pairs-with` slug only** — the dressing or pickle you would put on it but which is not in
   the method: `tahini-sauce`, `guacamole`, `crema-mexicana`, `tzatziki`, `blue-cheese-dressing`.

**Every slug named is verified to exist today** by `ls`, and re-verified by
`node scripts/parse-recipes.mjs` before commit. Nothing points at a slug T-002-06 or T-002-07 is
about to write: those tickets share this branch and a dangling `pairs-with` is a build error for
everyone until their file lands.

## Decision 5 — names, `aka`, and the search box

The ticket is explicit that `aka` matters more here than anywhere: a cook knows the bowl by what
the board said. Each file carries three kinds of name:

- **the board name and its spellings** — "harvest bowl", "hot honey chicken", "chicken pesto parm";
- **the generic a person types** — "grain bowl", "buddha bowl", "power bowl", "rice bowl",
  "macro bowl", "protein bowl";
- **the component that made them remember it** — "teriyaki bowl", "miso salmon", "crispy rice",
  "blackened fish bowl".

Titles follow the global voice rule: a real name you could say aloud at a counter
(*Harvest Bowl*, *Crispy Rice Bowl*, *Poke Bowl*), never a description of contents.

## Decision 6 — timers, and the slack line

Every timer is named, which the acceptance criteria require and `src/lib/time.ts` rewards: a name
in `UNATTENDED` or `HANDS_ON` is the author saying outright whether the cook can walk away.
Vocabulary used: `~simmer`, `~roast`, `~steam`, `~rest`, `~marinate`, `~chill`, `~macerate`,
`~boil` for the waits; `~sear`, `~saute`, `~toast`, `~stirfry`, `~toss`, `~fry` for the hands-on
ones. **Unrecognised names are avoided** (`~massage`, `~pickle`, `~crisp`) — they are not errors
but they fall through to reading the step text, which makes a descriptive name *worse* than a
plain one.

`slack` is written **only where the file can name the actual failure** — the salmon that goes
chalky past its window, the egg whose yolk sets, the rice that will not crisp if it is not cold and
dry. Most of these bowls are forgiving in a way that is not worth a line, and
`src/lib/slack.ts:17-20` is explicit that absent is the honest answer.

## What this design does not do

- It does not shelve anything. No `counters.json` edit, no gap-note edit, no `## What it has`
  rename. That is T-002-08, and criterion 8 forbids touching those files here.
- It does not write the components (roasted sweet potato, crispy chickpeas, pickled red onion,
  seven-minute egg, sesame kale, massaged kale, plain quinoa/farro/wild rice). Every one of them is
  cooked *inside* a bowl here because the tree cannot reach across files; every one is recorded in
  the work artifact so T-002-07 writes the standalone table and T-002-08 shelves both.
- It does not touch a single pre-existing file, including the ones `pairs-with` points at.
