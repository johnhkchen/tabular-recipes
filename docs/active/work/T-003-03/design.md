# T-003-03 — Design

Options, tradeoffs, and the decision, grounded in the Research findings.

---

## D1. Which soups, and how many

`docs/gaps/soup-pot.md` gives an explicit reading order and an explicit reason for it: "Write the
first twelve of the 老火湯 block and the first five of the 滾湯 block, then keep going down the
老火湯 block … a writer working straight down a single merged list would produce eighteen old-fire
soups and fail on the quick ones while following instructions exactly."

**Decision: 21 new files — 老火湯 ranks 1–16, 滾湯 ranks 1–5.**

| | count | criterion |
| --- | --- | --- |
| total new `.cook` files | 21 | ≥ 20 |
| 老火湯 (long-simmered) | 16 | ≥ 12 |
| 滾湯 (quick daily) | 5 | ≥ 5 |

Rejected: **exactly 20** (老火 1–15 + 滾 1–5). It meets every floor with zero margin, and one file
failing the checker late would take the ticket under the bar.

Rejected: **26+, taking both blocks out** (老火 1–18 + 滾 1–8). The gap note itself marks ranks 17
and 18 as the shakiest — 五指毛桃土茯苓 is "strongly regional" and 蟲草花響螺 depends on dried
conch "if it can be got". The ticket's rule is "write a different one" rather than fill a rank
with something plausible, and the honest way to obey it here is to stop where the count reaches
rather than reach for the two entries the source itself hedges.

What is left unwritten, and why, is named in `progress.md` per the criteria: 老火 17–18,
滾 6–10, and the four congee entries (congee is T-003-06's shelving job, not a rewrite).

## D2. The table skeleton

Every 老火湯 is the same four moves. The question is how many operations that becomes — and each
operation is a column, which is what makes the table scroll sideways on a phone (README, "Size").

**Option A — one operation per ingredient group (6–8 columns).** Rejected. It draws a wide table
for a dish that has four moves in it, and it would state the merge order as if it mattered. In
this genre it does not: everything except the late additions goes in at once.

**Option B — three operations: blanch → simmer → season.** Rejected. `colCount` would sit at the
checker's minimum, and it deletes the step the gap note explicitly asks for ("a dried-goods
soaking note … getting it wrong is the difference between a clear pot and a gritty one"). The
dried goods would become anonymous rows hanging off the simmer.

**Option C — four operations: blanch → rinse/soak the dried goods → simmer → season. CHOSEN.**

```
[ header note: the pot's own logic — season, occasion, the rule it turns on ]

  blanch from cold, then rinse the bones ─┐
  rinse the dried goods ─────────────────┴─ simmer 3 hr, barely a quiver ─ season at the end

[ footer note: the broth is the dish; the solids are spent ]
```

Two branches that merge at the simmer, which is a true statement about how the pot is made: the
meat is dealt with separately and the dried goods are dealt with separately, and they meet once.
It gives the dried goods their own operation cell, which is where "what each thing is for" earns
its column. Verified against the real pipeline: 8 rows × 4 cols, tiles cleanly.

Where a pot genuinely has a third distinct move — the pork lung's washing, the papaya-and-trotter
pot's browning, 清補涼's packet plus its meat — the skeleton takes a fifth operation. Six is the
ceiling.

**滾湯 get a different skeleton, deliberately.** They are a different bargain and the shelf should
say so out loud:

```
[ header note: this is the nightly bowl, not the Sunday pot ]

  fry/scald the base ─┬─ boil 15 min ─ finish with the delicate thing (off the heat)
  slice the quick things ─┘
```

No blanch, no three hours, and the water is boiled **first** — which is the definitional
difference between the two genres and is what makes the two halves of this shelf readable side by
side.

## D3. Where "what each ingredient is for" lives — the ticket's core question

The ticket: "put the logic where a reader will find it." So the design question is literally
*which slot on the rendered page*, and the answer has to be checked against the renderers rather
than assumed.

**Option A — loose `>>` metadata (`>> season: autumn`, `>> for: 潤肺`, `>> genre: 老火湯`).
REJECTED ON EVIDENCE.** `scripts/normalise.mjs:215` strips promoted keys and hands the rest back
as `recipe.metadata`, and `src/pages/[slug].astro:40-44` renders exactly two of them — `servings`
and `time` — plus the category. **Anything else written as loose metadata is invisible on the
page.** It would have looked tidy in the source file and shown a reader nothing.

**Option B — long prose inside the step. PARTIALLY REJECTED.** A step's text becomes its operation
label with the ingredients stripped out, and the label is what the table cell and the cook-mode
row show. The rest of the sentence surfaces only in the collapsed "See how it is written" source
disclosure at the foot of the page. `tonkotsu-broth` writes this way and its best paragraph is
three clicks from a reader. Step prose is kept short here, and carries method the label cannot
hold, not the reasoning.

**Option C — ingredient notes. CHOSEN as the primary home.**

```cooklang
@apricot kernels{1/4%cup}(naam bak hang; sweet and bitter kernels together, and the pairing is the point)
```

`normalise.mjs:166` builds `display` as `quantity (note) name`, so the note is on the ingredient's
own row in the table. `CookModes.astro:177-179` splits the note: a bare second unit ("900 g")
becomes `measure`, anything else becomes the ingredient's **`job`** and prints under its name in
cook mode. That is precisely the ticket's sentence — "organised around what each ingredient is
for … that is not decoration, it is the recipe's structure" — rendered as a property of the row
rather than as a paragraph somewhere near it.

It also solves the romanisation problem cheaply: `(mat zou; …)` puts the name a cook would say to
a shopkeeper on the row for the thing they are buying.

**Option D — the header note row. CHOSEN as secondary.** A first step with no ingredients renders
full-width above the table (`tree.headers`) and gets its own number and icon in cook mode. This
carries what belongs to the *pot* rather than to any one ingredient: the season, the occasion, and
the one rule this pot turns on.

**Option E — the footer note row. CHOSEN for the 老火湯 files.** Verified working: a trailing
no-ingredient step lands in `tree.footers` and renders below the table. This is where rule 4 goes
— the broth is the dish, the solids (湯渣) are spent. It is the single most misread thing about
the genre and it belongs after the table, not before it.

**Final placement rule for the whole shelf:**

| what | where |
| --- | --- |
| what one ingredient is for | that ingredient's note |
| what the pot is for, and when it is made | the header note |
| what to do with what is left in the pot | the footer note |
| the move | the `>> step.N:` label |
| what goes wrong | `>> slack:` |
| what to call it | `>> aka:` |

## D4. Saying the shared rules the same way twenty-one times

The gap note's warning: written once and referenced it costs one row; "re-derived twenty times, it
will end up described twenty slightly different ways."

**Option A — one shared `汆水` recipe that the others point at.** Rejected on three counts. It is
not a dish, so it would draw a two-row table and fail `check-recipes.mjs` ("too thin to be a
table"). `pairs-with` means *goes with at the table*, not *see also*, and it is made mutual at
build time, so every soup would advertise a blanching procedure as a side dish. And this ticket
cannot add a component anywhere but `recipes/**`.

**Option B — a fixed vocabulary, repeated verbatim. CHOSEN.** The shared moves get one wording
each and it does not vary between files:

- `blanch from cold, then rinse the bones`
- `simmer {n} hr, barely a quiver`
- `season at the end, never at the start`
- footer: `The broth is the dish. …`
- the water line is always `@cold water{...}` and never a stock

Repetition is the feature: twenty-one tables that agree is what makes the shelf legible, and a
reader who has read one 老火湯 can read the rest at a glance. Where a pot departs from a rule, the
departure is the thing the file says.

## D5. Slack levels

Authored per pot from its own failure, never from a formula (`src/lib/slack.ts` rule 1). The
ticket says the honest answer for most of these is "very little," and that saying so is the point
of the shelf — but T-003-02's contract is that the value is entirely in the *reason*, so
`forgiving` still has to name the thing that does go wrong.

For a 老火湯 that thing is never the clock. It is one of: topping the water up partway (rule 2,
which the tradition treats as ruining the pot), letting it get to a boil instead of a quiver
(rule 3), salting at the start, or putting a late ingredient in early. Each file names its own.

Planned distribution — deliberately not uniform, because a shelf where every line says
`forgiving` has stopped carrying information:

- **forgiving** (~13): the old-fire pots whose only real failure is a rule broken, not a minute
  missed.
- **narrow** (~6): the 滾湯, where greens, liver and egg have windows measured in seconds; plus
  the two old-fire pots with a late addition that turns (goji, watercress's second half).
- **unforgiving** (2): the pork lung pot — a lung that goes in still pink perfumes the whole pot
  and there is no taking it back out — and the crucian carp, where the fry-then-hard-boil is the
  only thing that makes it white and it cannot be done afterwards.

## D6. `aka`, and what a person actually types

The criterion wants three spellings on every file: characters, a romanisation, and the
plain-keyboard form somebody would really type. Format chosen, in this order:

```
>> aka: 青紅蘿蔔豬骨湯, cing hung lo baak zyu gwat tong, ching hung lo bak jue gwat tong,
        green radish and carrot pork bone soup, old fire soup, 老火湯, lo fo tong
```

1. characters
2. the tone-less Jyutping from the gap note, which I verified (Research §7)
3. a **plain-keyboard** spelling — the ad-hoc English-phonetic form a Hong Kong menu or an
   English speaker types (`jue` not `zyu`, `bak` not `baak`, `gai gerk`, `choi gon`). This is
   genuinely a third string, not a copy of the second; the gap note treats it as the English name
   for most entries, but a searcher typing from memory does neither perfectly, so both go in.
4. the plain English name
5. the genre word — `老火湯` / `lo fo tong` on all sixteen old-fire pots, `滾湯` / `gwan tong`
   on the five quick ones — so the shelf can be found by what it is, not only by dish name

`aka` is searched alongside the title (`README`, "aka is searchable alongside the title") and
prints under the title as "also called …", so this is the one field where redundancy pays.

## D7. Verb discipline, which is a hard build constraint

`src/lib/icons.test.ts` fails the whole test run if any operation label in the collection opens
with a verb `VERB_ICONS` does not know, and this ticket may not edit `src/lib/icons.ts`. Every
label is therefore set by hand with `>> step.N:` and opens with a verb from the map. The working
set for this shelf: `blanch, rinse, soak, simmer, boil, scald, poach, fry, brown, sear, slice,
strain, skim, season, scatter, stir, add, top, finish, warm, wash, squeeze, drop` — minus `drop`,
which is not in the map, and minus `serve`, `discard`, `tip`, `lift`, `taste`, which are not
either. This is checked per file with `--labels` rather than assumed.

## D8. Water, not stock

Every 老火湯 starts from `@cold water{}` in a rinsed pot. The gap note asks for this to be said in
the shelf's own voice "because every Western soup instinct says otherwise", and `chicken-broth`
sitting in the same folder makes the temptation concrete. It is stated in the header note of the
first-ranked pot (the default household one) and held to silently by the rest.

## D9. Registering the tradition without asserting it

The single easiest thing to get wrong on this shelf, per both the ticket and the gap note. The
rule I am writing to:

- **Attribute.** "the word used is 潤", "the tradition holds that", "which is why it is the pot
  made when…".
- **Name the occasion, not the effect.** "made in the house when somebody has been coughing";
  "the pot made for a new mother"; "the winter tonic, and what a family makes for someone
  recovering".
- **Never write a sentence whose subject is the soup and whose object is a body.** No "clears",
  "cures", "boosts", "detoxes", "strengthens" with a person on the receiving end.

The Chinese terms (潤肺, 祛濕, 健脾, 安神, 清熱) are used as the tradition's own vocabulary, glossed
plainly, which is the honest form: it records what is said rather than translating it into a claim
the site would then own.

## D10. The aisle coverage test, which this ticket cannot close

Research §6: fourteen or so new ingredient names will land in the `other` aisle against seven
names of headroom, so `src/lib/shopping.test.ts`'s 2% assertion goes red when this lands.

Options considered:

- **Add patterns to `src/data/aisles.json`.** Not available: the criteria limit this ticket to
  `recipes/**`, and T-003-06's criteria claim that file and say "Only `src/data/counters.json`
  and `src/data/aisles.json` are modified."
- **Rename ingredients to fit an existing aisle** — "dried herbs" for 淮山, "dried fruit" for
  蜜棗. Rejected outright: it would be writing a shopping-list convenience into the recipe and
  lying about what the cook is buying, on the one shelf whose whole point is that each dried
  thing is a specific thing with a specific job.
- **Write the exact list into the work artifact and hand it over. CHOSEN**, because it is what
  the board was drawn for: the gap note hands the aisle problem to T-003-06 by name, T-003-06's
  criteria require the coverage test to pass, and this ticket's criteria require per-file
  `check-recipes.mjs` rather than `npm run verify`.

This is stated plainly in `review.md` rather than buried, because a red test on `main` between
two tickets is the kind of thing a reviewer should be told about rather than discover.
