# T-001-04 — Research

What the Takeout Counter currently holds, what the repository will accept as a recipe, and
which of the ranked absences are already answered elsewhere. Descriptive only.

## The counter as it stands

`src/data/counters.json` gives the Takeout Counter a blurb ("Order by number, eat it out of
the carton"), **no category fallback at all**, and five printed sections holding six slugs:

| Section | Items |
| --- | --- |
| Appetizer / Side Orders | `scallion-pancakes` |
| Fried Rice | `egg-fried-rice` |
| Pork | `char-siu` |
| The sauce shelf | `sweet-and-sour-sauce`, `teriyaki-sauce` |
| Spice | `chinese-five-spice-powder` |

`grep -rl "Takeout Counter" recipes/` returns exactly those six files, which confirms the
empty `categories: []` — nothing arrives here by category fallback, so the counter holds
precisely what names it.

Of the six, only one names this counter **and no other**:

| Recipe | `counters:` line | Exclusive? |
| --- | --- | --- |
| `sweet-and-sour-sauce` | Takeout Counter | **yes** |
| `egg-fried-rice` | Takeout Counter, Dim Sum Counter | no |
| `teriyaki-sauce` | Dim Sum Counter, Takeout Counter | no |
| `chinese-five-spice-powder` | Dim Sum Counter, Takeout Counter | no |
| `scallion-pancakes` | Ramen Shop, Takeout Counter | no |
| `char-siu` | Dim Sum Counter, Takeout Counter, Phở & Bánh Mì | no |

That is the ticket's "6 recipes, 1 of them its own", verified rather than taken on trust.
Against acceptance criteria of **≥16 shelved / ≥10 exclusive**, the arithmetic is: at least
**10 new files**, of which at least **9 must name Takeout Counter alone**.

## The gap list, checked against `recipes/`

`docs/gaps/takeout-counter.md` ranks twenty absences. The ticket warns the gap docs are
stale, so every ranked item was checked with `ls recipes/*/<slug>.cook` and against a listing
of all 254 basenames.

| # | Ranked item | State in `recipes/` |
| --- | --- | --- |
| 1 | General Tso's chicken | absent |
| 2 | Sesame chicken, orange chicken | absent |
| 3 | Lo mein | absent — and no noodle dish exists anywhere |
| 4 | Beef with broccoli | absent |
| 5 | Egg roll | absent — nothing on the site is deep-fried |
| 6 | Hot and sour / egg drop / wonton soup | absent (20 soups, none Chinese but `congee`) |
| 7 | Egg foo young + brown gravy | absent |
| 8 | Crab rangoon | absent |
| 9 | Sweet and sour pork | absent; its **sauce is written** |
| 10 | Mei fun, Singapore mei fun | absent |
| 11 | Moo shu pork, mandarin pancakes, hoisin | absent |
| 12 | **Roast pork (char siu)** | **WRITTEN** — `recipes/stews-and-braises/char-siu.cook`, already names this counter |
| 13 | Boneless spare ribs, duck sauce, hot mustard | absent |
| 14 | Chicken with garlic sauce (yu xiang) | absent |
| 15 | Moo goo gai pan, kung pao, Happy Family | absent |
| 16 | Pork fried rice | absent (`egg-fried-rice` is the only fried rice) |
| 17 | Yat gaw mein | absent |
| 18 | Pu pu platter | absent (an assembly of other items) |
| 19 | Fortune / almond cookie | absent (20 cookies, none of these) |
| 20 | Chow mein, American-style | absent |

**Item 12 is the stale entry the ticket warned about.** `char-siu.cook` was written by an
earlier pass, carries `counters: Dim Sum Counter, Takeout Counter, Phở & Bánh Mì` already,
and needs no edit from anyone. It is the "roast pork" strips in the fried rice and the lo
mein. Nothing else on the ranked list has been written since the docs were compiled.

## What other tickets own

`docs/active/stories/S-001-fill-the-menus.md` resolves contested dishes on the board. The
contested-dish table names no dish on this counter's list. The story does make three
assignments that bear directly here:

- *"Ramen Shop writes ramen noodles, **Takeout Counter lo mein**, Thai Kitchen pad thai,
  Phở & Bánh Mì bún."*
- *"chả giò and gỏi cuốn are the Vietnamese counter's, **the egg roll is the Takeout
  Counter's**, and Thai fresh and fried spring rolls are the Thai Kitchen's."*
- *"Write the specific dish under its own name, never a generic one."*

A grep across all fifteen gap docs for `wonton|egg roll|egg drop|hot and sour|lo mein|mei
fun|chow mein|general tso|sesame chicken|orange chicken|broccoli|crab rangoon|foo young|moo
shu` finds no other counter asking for any of them. The only hits are incidental: the Deli's
broccoli *rabe*, the Dim Sum Counter's note that har gow "cannot be faked with a wonton
wrapper", and the Thai Kitchen's lunch-special line mentioning an egg roll as a side it does
not itself write. **No dish this ticket would write is claimed by a sibling ticket.**

One live cross-ticket risk is recorded in `docs/active/work/T-001-01/review.md`: **plain
chicken stock is wanted by both the Deli and this counter and is owned by nobody.** T-001-01
deliberately did not write it.

## The authoring contract

`README.md` is the contract and the checker enforces most of it.
`scripts/check-recipes.mjs` fails a file for: missing `title`/`category`/`tags`/`servings`;
a counter name absent from `counters.json`; tiling errors from `src/lib/layout.ts`; fewer
than 3 ingredient rows; fewer than 3 columns; and any operation cell that comes out blank.
Category strings are **not** validated against a list, and `scripts/find-recipes.mjs` walks
`recipes/` recursively, so **a new folder is a new category with no registration step.**

Structural rules from `src/lib/tree.ts` via the README:

1. Every step after the first says what it consumes — `@&(~1)thing{}` (one step back) or
   `@&(3)thing{}` (absolute). A step consuming nothing starts a branch; **every branch must
   merge**, and there is exactly one unreferenced ending.
2. **No splitting** — a preparation feeds exactly one later step.
3. Ingredient-free steps become full-width rows and **must sit at the top**, because `~1`
   counts every step including prep.
4. Aim 5–16 ingredient rows, 3–6 operations. Columns ≈ operations + 1, and columns are what
   break a phone.
5. Labels are derived from the step with ingredients stripped; `>> step.N:` overrides.

Metadata beyond the four required: `counters` (list), `aka` (searchable, and the repo
convention is to include an undiacriticked form), `pairs-with` (slugs, made mutual at build,
pointing at a missing slug is a build error), `time`, `dish`/`kit`.

**Timers.** `src/lib/time.ts` reads a timer name against two vocabularies. Recognised
unattended names include `rest chill marinate soak steep simmer boil steam braise drain
press cool set`; recognised hands-on names include `whisk stir knead fry stirfry sear toss
toast flip beat fold`. An **unrecognised** name falls through to reading the operation label,
then defaults to hands-on. So "name every timer" is met by any name, but only a *recognised*
name actually sets the attention flag from the author's own claim.

## What the existing Chinese files look like

`char-siu.cook` is the model for a long file: eleven marinade rows in step 1, a `>> step.N:`
override on every step, `aka` carrying `cha siu`, `chashao`, both Han spellings, `xá xíu`,
`xa xiu`, and three plain-English menu names. `egg-fried-rice.cook` and
`sweet-and-sour-sauce.cook` are short and both use **unnamed** timers (`~{1%min}`,
`~{3%min}`) — they predate the convention and are not this ticket's to fix.

`sweet-and-sour-sauce.cook` is the gap doc's item 9 observation in the file tree: the sauce
exists, nothing is served under it.

## Categories

Thirteen folders exist. Reading them against this counter's board:

- `soups/` (20 files) takes the entire soup section without argument.
- `rice-beans-and-grains/` (20) takes any fried rice.
- `sauces-and-gravies/` (20) takes a brown sauce, a duck sauce, a hot mustard.
- `spice-blends-and-marinades/`, `flatbreads-and-pancakes/` take a velveting slurry
  and mandarin pancakes respectively, at a stretch.
- **Nothing takes a stir-fry, a noodle dish, or a fried wrapped snack.** The nearest is
  `stews-and-braises/`, which holds `char-siu` and `red-braised-pork-belly` because they are
  the closest thing to a braise on the site. A wok dish finished in four minutes is not a
  braise, and `docs/gaps/README.md` states the collection-wide fact outright: *"There are no
  dumplings and no noodle dishes"* and *"Nothing is deep-fried."*

The ticket anticipates this: *"a genuinely new kind of thing may take a new category and
folder."*

## Constraints and assumptions carried into Design

- **Only `recipes/**` may be modified.** `src/data/counters.json` is T-001-17's, so new
  files will not appear in a printed section until that ticket runs; they still shelve at the
  counter because `counters:` is read per recipe.
- **New ingredients will fall through `src/data/aisles.json`** until T-001-17 places them.
  Expected, same as T-001-01.
- **Cooklang has no sub-recipe reference in this repo** — every file surveyed uses
  `@chicken stock{2%cups}` as a plain ingredient row rather than pointing at another recipe.
  A component recipe and a dish that uses it are two independent tables linked only by
  `pairs-with`. This bounds every dish to its own 16 rows.
- **The 16-row ceiling is the binding constraint**, not the recipe knowledge. A takeout main
  is a marinade, a coating, a fry, a sauce and a toss — five ingredient groups.
- `docs/gaps/takeout-counter.md`'s "What it could not stock" section is out of scope by the
  ticket's own words: the C-numbers (they belong in `aka`), combination platters, the
  sauce-across-proteins grid, lunch-special hours, the wok itself, the steam table, the diet
  menu.
- `npx vitest run` is **already red on this branch** before this ticket touches anything —
  `src/lib/schedule.test.ts` pins three recipe names and T-001-01's `crema-mexicana`
  displaced `pizza-dough`. Documented in `docs/active/work/T-001-01/review.md`; the remedy is
  outside any counter ticket's ownership. This ticket must not make it worse, and must not
  claim credit for it being red.
