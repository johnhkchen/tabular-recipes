# T-001-18 — Design

Six acceptance criteria, four of them decisions. Each section names the options, weighs them
against what Research found, and chooses.

---

## 1. The two schedule assertions

`schedule.test.ts` fails twice. Research found the cause is **two data defects plus one test
pinned to a 241-recipe collection**, and the two are separable.

### The data defects are not in question

`ginger-garlic-paste` writes its keeping time as `~chill{3%weeks}` and `lime-pickle` claims 15
days against 14 days of timers. Both are wrong on their own terms, independent of any test.
`README.md` is explicit about what a timer is for — *"the name is what separates time you
spend from time you merely wait out, which is the most useful thing a recipe page can tell a
cook"* — and shelf life is neither. A jar that keeps three weeks is not a recipe that takes
three weeks. Fixed in the files; no option worth listing.

### Option A — re-pin the three slugs

Change the expected list to `sour-dill-pickles`, `sauerkraut`, `lime-pickle`.

Cheapest, and honest today. But this assertion has been re-pinned or reported wrong at
**every ticket since T-001-01**: `pizza-dough` → `crema-mexicana` → `lime-pickle` →
`ginger-garlic-paste` → `sauerkraut`. The collection has doubled and is meant to keep
growing; the story's own next passes will add pickles and cures. Re-pinning schedules the
same failure for whoever writes the next ferment.

### Option B — delete the assertion

The other two tests in the block (author agreement, almost-all-waiting) already carry real
content. Dropping the first loses the documentary claim that the longest tables are ferments,
which is a genuine and interesting property of this collection.

### Option C — assert the property ✅ **chosen**

Keep the test, keep its name, replace the three hard-coded slugs with what the slugs were
standing in for: **the longest critical paths belong to ferments and cures, they are measured
in days, and they are long because of one named unattended wait, not because of many steps.**

Concretely, for each of the top three:

- `totalMinutes` over a week,
- at least one timer named from the ferment-and-cure family (`ferment`, `stand`, `cure`,
  `brine`, `soak`, `chill`, `age`) carrying the bulk of the path,
- `untimedCount` small relative to the chain — the length comes from waiting, not from work.

Chosen because it is what four separate tickets asked for by name (T-001-01, T-001-04,
T-001-14, T-001-16 all wrote the same sentence), because it survives the next twenty recipes,
and because a property test says something a slug list never did: *why* those three are at the
top. The three current names go in a comment, so a reader still knows what it is describing.

The second assertion (author agreement within 5%) needs no change — with the two data fixes
the top three read 0.00, 0.00, 0.00.

---

## 2. The 54 icon fall-throughs

### Option A — add all 54 to `VERB_ICONS`

Would make the test green in one edit. It would also put `the`, `this`, `two`, `nine`,
`printed`, `unripe` and `everything` in a table called `VERB_ICONS`, and pick an icon for each
— i.e. teach the map to draw a picture for the first word of a sentence. `icons.ts`'s second
stated rule is *"a symbol never invents information"*. Rejected.

### Option B — reword every offending label in `recipes/**`

What T-001-06 did, because that ticket was forbidden `src/`. This ticket is not. Twenty-six
words across ~45 cells, most of them perfectly good cook's verbs — `clarify the butter`,
`wring the onion dry`, `crack the cream 5 min`. Rewording those to avoid an icon-map gap
would be writing worse recipes to satisfy a lookup table. Rejected for the 19; adopted for
the 7 (below).

### Option C — split the problem the way the data splits ✅ **chosen**

Research measured 54 fall-throughs from 2672 **step** labels but 26 from 2429 **operation
cell** labels. Three edits, each answering a different defect:

**C1. Narrow the test's corpus to operation cells.** The test's own docstring says it checks
"every distinct verb the recipes actually open an **operation** with". A prose row is not an
operation — it is the full-width row the README describes for a preheat or a closing note,
and its first word is a sentence's first word. Reading those as verbs is what produced `a`,
`the`, `these`, `printed`. Take the corpus from `layout()`'s `kind === 'op'` cells, which is
exactly what a reader sees in a cell and what `iconForOperation` is called with on the page.
This removes 28 words that were never verbs and costs no coverage: the site does not draw an
icon next to a prose row.

**C2. Add the 19 genuine verbs to `VERB_ICONS`.** `blitz`→blend, `bruise`→blend (mortar
work), `build`→layer, `clarify`→strain, `crack`→flame (the cream splits in a hot pan),
`dress`→pour, `lay`→layer, `mould`→hand, `perfume`→pour, `return`→stir, `ribbon`→pour,
`sheet`→roll, `slacken`→stir, `slide`→pour, `thread`→hand, `throw`→bowl, `tie`→hand,
`velvet`→bowl, `wring`→strain. Every one is a verb a cook wrote deliberately; the map is
where they belong. `throw` and `velvet` take the plain bowl on purpose — "throw the bread in
last" and "velvet, rest 30 min" are both *do this to these* and nothing more specific is
true.

**C3. Reword the 11 noun-and-adjective-led cells.** `tare in` · `noodles in` · `broth in` ·
`corn and butter last` · `sprouts and aromatics in` · `aromatics and kombu for the last 30
min` · `hard rolling boil 8 hr`. These are the ramen shop's assembly shorthand and one broth
adjective, and they are precisely what the README warns the `--labels` staircase exists to
catch — *"the only way to tell a cook's verb from a mangled sentence fragment"*. Rewording
them to open with the operation (`spoon the tare in`, `drop the noodles in`, `pour the broth
in`, `boil hard 8 hr`) makes the staircase read as a sequence of operations, which is the
site's whole thesis. Six files, eleven `>> step.N:` lines.

Rejected variant: adding `tare`, `broth`, `noodles`, `sprouts`, `corn`, `aromatics` to
`VERB_ICONS` as honorary verbs. It would work and it would quietly redefine the map from
"what the cook does" to "what the cell starts with", which is how a table of verbs becomes a
table of words.

---

## 3. "No dish appears twice under two names"

Research checked three ways — ingredient Jaccard, title+`aka` overlap, and `dish:` keys — and
**found no duplicate dish**. The criterion's remedy clause ("the weaker file is removed and
its counters are merged") therefore does not fire, and removing a file to satisfy the shape of
a sentence would be destroying work to make a checklist tick.

What the same scan *did* find is 26 names claimed by two recipes at once. That is the same
failure the criterion is aiming at, one level down: **one dish name, two tables answering to
it.** A searcher typing "tzatziki" gets the halal-cart white sauce beside the tzatziki;
"pizza sauce" gets the cooked marinara the Pizzeria ticket says is the wrong answer.

**Decision:** treat the criterion as satisfied by demonstration — state the evidence in the
review artifact — and fix the collisions that send a searcher to the wrong table. Three
grades, and only the first two get edited:

1. **Wrong answer.** One recipe claims a name that belongs to another dish on this shelf.
   `marinara-sauce`'s `pizza sauce` and `Sunday gravy` (T-001-12 recorded it and named the
   replacement); `white-sauce` claiming `tzatziki`/`taziki`; `tzatziki` claiming `white
   sauce`; `pilau-rice` claiming `yellow rice`. **Fixed.**
2. **Two right answers, one weaker.** `chicken-broth` and `chintan-broth` both claim `clear
   chicken broth`; the deli pot is the one printed in English. **Fixed on the weaker side.**
3. **Legitimately ambiguous on a real board.** `madras` the blend and `madras` the curry;
   `tonkotsu` the broth and the bowl; `vindalho`; `gaeng ped`; `roast pork` for both carnitas
   and char siu; `number 1` at two counters. A menu genuinely prints both, and `aka` exists to
   catch the words a customer remembers. **Left alone, and recorded in the review** — deleting
   them would make the search worse, not better.

---

## 4. One tag vocabulary

Three sub-decisions.

**Which way to fold a singular/plural pair.** Options: always singular; always plural; follow
the majority. Chosen: **follow the majority, break ties toward the plural for countable
things** (`chiles` 29 v `chile` 7 → chiles; `eggs` 16 v `egg` 5 → eggs; `lentils` 7 v
`lentil` 1 → lentils; `onion` 11 v `onions` 4 → onion). The majority is where the collection's
own habit already is, so it is the smaller edit and the one that leaves the most files
untouched. A rule imposed against the majority would rewrite 40 files to satisfy a preference
nobody expressed.

**Hyphenation and spelling.** `no cook` → `no-cook` (33 v 6, and the hyphen matches
`no-bake`). `appetizer` → `appetiser` (4 v 1, and the repo's prose is British throughout —
`normalise.mjs`, `caramelise`, `savoury`, `moulded`). `cookies` → `cookie` — one file each, so
the tie breaks toward the category-agnostic singular already used by `cookie`.

**Verb or participle for a method.** `pan-fry`/`pan-fried`, `stew`/`stewed`,
`simmer`/`simmered`, `grill`/`grilling`, `glaze`/`glazed`. Chosen: **the bare verb**, matching
the existing majority vocabulary — `braise`, `deep-fry`, `stir-fry`, `griddle`, `roast`,
`smoke` are all bare, so `stewed` and `pan-fried` are the odd ones out. Exception: `baked`,
`fried`, `steamed`, `poached`, `boiled`, `toasted` are adjectives describing the *result* and
are used that way (`baked custard`, `smoked fish`); they are left as they are. The line is
whether the tag names the method or the thing.

Rejected: writing a checker that enforces the vocabulary. It would be a new `src/lib/` file
and a new test for a 527-word list nobody has agreed the shape of, and the ticket asks for one
vocabulary, not a mechanism. Recorded in `docs/gaps/README.md` as the obvious next step.

---

## 5. The recorded hand-offs

Every one recorded as an *edit* is applied. Every one recorded as a *question* is answered
here rather than passed on again, because the whole point of this ticket is that the questions
have nowhere further to go.

**Applied as recorded** — five `counters:` additions (`country-fried-steak`, `cream-gravy`,
`meatloaf`, `tuna-salad` → `Diner`; `rice-pudding` → `Taquería`) and one `aka` rewrite
(`marinara-sauce`).

**Questions, answered:**

- *Should `mayonnaise` also name Phở & Bánh Mì?* (T-001-02) — **No.** The gap doc's own
  instruction was "pair to it and note the difference", `banh-mi-dac-biet` does exactly that,
  and the house mayonnaise on a bánh mì is a yolk-heavier sauce than the deli tub. Adding the
  counter would put the wrong mayonnaise on the board.
- *Should `dashi` and `gyoza` be shelved wider?* (T-001-08) — **`gyoza` yes, `dashi` no.**
  A dim sum counter sells its own dumpling and gyoza is on that board under `wor tip`; dashi
  is a Japanese pantry stock and no other counter here is Japanese. One counter added, one
  argument recorded.

**Not applied, and why:** every remaining hand-off is a *recorded observation* rather than an
edit — unwritten components, shelving judgements about whole cuisines, the Ethiopian trio.
Those are what `docs/gaps/` is for, and §6 puts them there. Moving `beef-rendang` or splitting
an Ethiopian counter is a board decision — a new ticket — not a file edit.

---

## 6. Rewriting `docs/gaps/`

The constraint that decides this: **`scripts/menu-sections.mjs` reads the `## What it has`
block back into `counters.json`**, and T-001-17 warns that running it today would undo that
ticket's work.

### Option A — regenerate the gap docs from `counters.json`

A script that prints each counter's sections and items into the `What it has` block. Perfect
round-trip by construction. But the gap docs are prose with judgement in them — the "missing"
lists, the "could not stock" arguments — and a generator would either destroy that or have to
carefully preserve it, which is the hard part anyway.

### Option B — hand-rewrite all fifteen ✅ **chosen**

Rewrite each file's header and `## What it has` block to match `counters.json` exactly
(section titles in the same order, slugs in the same order), strike from `## What it is
missing` and `## Components it would need` every item now on the shelf, keep the rest with
their original numbering intent, and leave `## What it could not stock` alone — nothing about
what a table cannot express has changed.

Chosen because the round-trip is verifiable after the fact (`node scripts/menu-sections.mjs`
with no `--write` reports what it found, and it must report the sections already in
`counters.json`), and because the striking is the actual work the ticket is asking for: *"so
the next pass starts where this one stopped."*

`README.md` is rewritten whole — every number in it is from a 241-recipe collection.

---

## 7. Scope held back

Research surfaced three category-placement problems that are real and are **not** in the
acceptance criteria: pickles split between `dressings-and-dips` (`sour-dill-pickles`,
`do-chua`, `lime-pickle`, `mango-chutney`) and `toppings-and-pickles` (`kabis`, `sauerkraut`,
`sumac-onions`); slaws in `dressings-and-dips` while `salads/` exists; `cured-fish/` holding
one file.

Moving a file changes its `category` and nothing else — the slug is the basename, so no URL
moves and no `counters.json` section breaks. It is safe and it is tempting. It is also
thirteen files re-categorised on this ticket's judgement, touching the category tally the
README has to report, in a pass whose stated job is *verify green, hand-offs applied, one
vocabulary, notes rewritten*. **Recorded in `docs/gaps/README.md` as the first item of the
next pass, not done here.**
