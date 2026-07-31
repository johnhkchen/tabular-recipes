# T-001-14 — Design

The question this phase answers: **which dishes get written, in what form, and where do the
files land** — given that the gap doc ranks 25 absences, forbids several of them outright, and
the acceptance gate only asks for three more shelved items.

## The decision in one line

Write **18 new `.cook` files**, working down `docs/gaps/deli.md` from rank 2 to rank 11 and
picking up the components those ranks need, all Deli-first, 17 of them Deli-exclusive.
Skip every sandwich, and write the meat instead of the sandwich it goes in.

## Option A — write the minimum (3 files) and stop

Three Deli-exclusive files clears 44/12 with one to spare.

**Rejected.** The counter would still be a bread rack and a spread case. The gap doc's
complaint is not a count, it is that "the slicer is empty" — five named sections with nothing
on them. Three files cannot open five sections. And the acceptance criterion says the top of
the list gets written "in that order, **as far as the count above reaches**", which is a floor
on the count, not a ceiling on the work: it tells you where you may stop, not where you must.

## Option B — work the whole list, ranks 1–25

Twenty-five ranked entries plus a components list of fifteen. Forty-odd files.

**Rejected.** Two reasons, one hard and one soft. Hard: ranks 12–23 are mostly the Italian,
Polish and Jersey ends of the counter, and their headline items are exactly what "What it
could not stock" removes — the combo is dry-cured pork, the cheesesteak and the sloppy joe are
sandwiches, żurek needs a kept starter. What survives there is a scatter of side dishes with no
section under them. Soft: quality per file is the thing being bought here — real quantities,
canonical method, a staircase that reads as verbs — and forty files at that standard is not one
attempt's work.

## Option C — ranks 2–11, plus the components those ranks name  ← **chosen**

The top ten ranked entries are, in the doc's own order, the delicatessen and the appetizing
store: cured beef, the dressing that goes on it, the soup, the salads-by-the-pound case, the
liver, the fish-and-dairy side, the kraut and the knish. That is **five of the five empty
sections opened** — the slicer, the smoked-fish case, salads by the pound, the pickle barrel
(already open, rank 1) and the hot case — with a component under each one that needs it.

It is also the boundary where the list stops being about this counter's identity and starts
being about its neighbours' (Italian, Polish, San Francisco bread). A later ticket picking up
rank 12 onward starts at a clean seam.

## What gets written, rank by rank

| Rank | Gap-doc entry | This ticket writes | Why that form |
| --- | --- | --- | --- |
| 1 | A pickle | — already `sour-dill-pickles` | Written since the doc was compiled |
| 2 | Pastrami on rye | `pastrami` | The meat. The sandwich is forbidden; the wet cure + smoke + steam is explicitly allowed |
| 3 | Corned beef, Reuben, Rachel | `corned-beef` | Same brine, different finish. Reuben and Rachel are sandwiches |
| 4 | Russian dressing | `russian-dressing` | Straight |
| 5 | Coleslaw | — already `coleslaw` | Written since the doc was compiled |
| 6 | Matzoh ball soup | `matzo-ball-soup`, `chicken-broth`, `schmaltz` | The soup is three preparations; two of them are also case items in their own right |
| 7 | The salads-by-the-pound case | `potato-salad`, `macaroni-salad`, `egg-salad`, `tuna-salad`, `chicken-salad` | Five lines, the doc's own count. `mayonnaise` already exists, so each is one step from it |
| 8 | Chopped liver | `chopped-liver` | Straight; `schmaltz` written at rank 6 is its fat |
| 9 | The appetizing side | `cream-cheese`, `scallion-schmear`, `whitefish-salad`, `belly-lox` | Nova is cold smoke and is out; belly lox is the salt cure and is in |
| 10 | Sauerkraut | `sauerkraut` | The site's second ferment |
| 11 | Knish | `potato-knish` | The square baked one |

**Named skips, with reasons** (these go in `progress.md` too):

- **Pastrami on rye, the Reuben, the Rachel, the Italian combo, the cheesesteak, the Jersey
  sloppy joe** — sandwiches. `docs/gaps/deli.md:108`. The components and `pairs-with` carry it.
- **Nova lox** — cold smoke below 30 °C is equipment, and hot smoke makes a different fish.
  `docs/gaps/deli.md:105`. Belly lox is written instead and says so in its own prose.
- **The round fried knish** — the doc is right that it is a second food, but it is a second
  dough and a second fry, and rank 11 is where the count already stands well clear. Left for
  the ticket that picks up rank 12 onward.
- **Ranks 12–25** — Italian, Polish, Jersey and the egg cream. Out of scope per Option C above.
- **A standalone `curing-brine` file** — see below.

## Three form decisions worth arguing

### 1. The brine is a step, not a file

The components list asks for "a curing brine" as a shared thing. There is no cross-recipe
include in this format: a recipe either restates a preparation as steps or names it as an
ingredient. A brine file would be two ingredients and one stir — under the checker's floor —
and both meats would still have to restate it. So `pastrami` and `corned-beef` each open with
their own brine step, identical in composition, and each names the other in `pairs-with`. The
gap doc's real point — "those two operations are the entire difference between pastrami and
corned beef" — is then visible as two tables that agree for four steps and part company at the
fifth. That is the table saying it out loud, which is what the doc asked for.

### 2. Schmaltz, cream cheese and clear broth are files; matzo balls are not

Each of the first three is listed twice in the gap doc — once under "components it would need"
and once as something sold by weight at the case ("Farmer Cheese … sold by the pound",
"schmear", "clear chicken broth … sits under matzoh ball soup, kreplach and half the case").
Something sold at the counter is a menu item, so it gets a file.

Matzo balls are not sold by the pound and are not eaten alone. They are a branch of the soup:
the broth chain and the batter chain merge at the poach. One table, two branches, which is a
shape this format is good at and `mujaddara` already demonstrates.

### 3. Belly lox needs a folder that does not exist

Twenty-two category folders and none of them is honest about a raw salt cure.
`smoked-and-grilled` would be a lie in the URL; `toppings-and-pickles` makes the appetizing
counter's headline item a garnish. So: **one new folder, `recipes/cured-fish/`, category
`Cured Fish`.** It is a one-file folder today and the doc says why it will not stay one — the
smoked-fish case also wants sable, kippered salmon, schmaltz herring and matjes, and every one
of those is a cure plus a heat step. The ticket permits this explicitly: "a genuinely new kind
of thing may take a new category and folder."

Everything else lands in an existing folder: `pastrami` → `smoked-and-grilled` (it is smoked),
`corned-beef` → `stews-and-braises` (it is simmered), `sauerkraut` → `toppings-and-pickles`
(the folder is literally named for it), `potato-knish` → `dumplings-and-rolls`, the five case
salads → `salads` (which holds three files and is exactly this shape), the spreads →
`dressings-and-dips`, broth and soup → `soups`, `schmaltz` → `sauces-and-gravies` beside
`mayu` and `ginger-scallion-oil`, which are the other two rendered-fat condiments.

## Counters: honest, not inflated

Seventeen of the eighteen name **Deli and nothing else**, which is not counting-gaming — this
is the counter these dishes come from, and no other counter on the list sells cured beef,
schmear or a knish. The one exception is `potato-salad`, which is a cafeteria side as much as a
deli one and gets **`Deli, Meat and Three`**. That single share costs nothing: the exclusive
count lands at 25 against a gate of 12.

Deli total after this ticket: **41 + 18 = 59**. Exclusive: **8 + 17 = 25**.

## Method: the canonical one, and where that costs time

The criterion is "the canonical one for the dish rather than a shortcut wearing its name". The
three places that bites:

- **Pastrami** brines five days with pink curing salt #1, is rinsed and soaked, rubbed with
  cracked pepper and coriander, smoked low, then **steamed** — the steam is not optional, it is
  the operation that separates pastrami from smoked brisket, and the gap doc names it twice.
- **Sauerkraut** is 2% salt by weight of cabbage and its own juice, fermented at room
  temperature for weeks. Not vinegar and not blanched.
- **Cream cheese** is cultured overnight with buttermilk, set with a trace of rennet, drained
  in cloth and beaten with salt — not blended cottage cheese.
- **Matzo balls** rest in the fridge before shaping and poach in **salted water, not the
  broth**, or the broth goes cloudy and the balls go leaden. Schmaltz, not oil; seltzer for
  floaters, and the file says which one it is making.

## Risks accepted

1. **The schedule test's top-three list will change again.** `pastrami` has a five-day cure and
   `sauerkraut` a three-week ferment, so both will enter the ranking that
   `schedule.test.ts` asserts on. That test is already red for the same reason (curry-house
   files displaced it). Mitigation: make `>> time:` on every new file agree with its own timer
   chain within a few percent, so that if a new file does enter the top three, the *second*
   assertion — the one comparing the author's claim against the timers — still holds for it.
   The list assertion itself is `src/`-side and not this ticket's to edit.
2. **Unfamiliar ingredient names may not find a shopping aisle.** `pink curing salt`,
   `matzo meal`, `smoked whitefish`, `beef navel`. Mitigation: prefer names the aisle patterns
   already know where the name is genuinely interchangeable (`kosher salt`, `chicken livers`,
   `russet potatoes`), and do not invent a name to game a match. `src/data/aisles.json` is not
   this ticket's file.
3. **Pairings are a build-time hard dependency.** Every `>> pairs-with:` slug must exist. All
   pairings are drawn from files that already exist (`deli-rye-bread`, `bagels`,
   `sour-dill-pickles`, `mayonnaise`, `coleslaw`) or from files written in this same ticket, and
   the commit order below writes components before the things that point at them.
