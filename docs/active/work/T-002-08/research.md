# T-002-08 — Research

What exists, where, and how it connects. No solutions here.

---

## 1. What the ticket is asking for

Three counters opened by T-002-01 with ordered section titles and **empty item lists**:

| Counter | Slug | Sections, in menu order |
| --- | --- | --- |
| The Bowl Shop | `bowl-shop` | Grain bowls · Leafy salads · What goes on top · Roasted vegetables · Dressings and drizzles · Soups · Also here |
| Instant Pot | `instant-pot` | Braises that took all afternoon · Beans from dry · Stocks and broths · Rice, grains and porridge · Whole birds and big cuts · Also here |
| One Pot | `one-pot` | Braises and stews · Skillet dinners · Rice and grains that cook in · Soups that are the whole meal · Also here |

Six writer tickets (T-002-02 … T-002-07) have finished and are sealed. Nothing on those three
shelves renders as a menu yet.

---

## 2. How a recipe reaches a counter page — the mechanism, exactly

Two files decide it, and only two.

**`scripts/parse-recipes.mjs`** reads every `recipes/**/*.cook` into `src/generated/recipes.json`.
The `>> counters:` line of the file becomes `recipe.counters`. It validates each name against
`src/data/counters.json` and throws on an unknown one (`parse-recipes.mjs:60-70`). A recipe that
names **no** counter inherits the counters whose `categories` list its category, and is marked
`countersInferred` (`:72-78`).

**`src/lib/counters.ts:73-91`** builds the menu:

```js
const mine = all.filter((r) => r.counters.includes(counter.name));
const bySlug = new Map(mine.map((r) => [r.slug, r]));
...
items: items.map((slug) => bySlug.get(slug)).filter(Boolean)
```

Three consequences, all load-bearing for this ticket:

1. **A section item that is not in `mine` is silently dropped.** Listing a slug in
   `counters.json` does **not** shelve it. Membership comes from the recipe file's own
   `>> counters:` line (or the category fallback).
2. **A section with zero surviving items is filtered out** (`:83`), so an empty section does not
   render at all.
3. **Anything in `mine` that no section lists is appended as a section literally titled
   `'Also'`** (`:86-88`). That is the failure mode the ticket's "no *Also here* section"
   criterion is aimed at.

**Measured state of the category fallback: it is dead.** `npm run recipes` reports
`658 named, 0 inferred from category`. Every one of the 658 files carries a `>> counters:` line.
So for the three new counters — which were opened with `"categories": []` — membership is
*exclusively* the `>> counters:` line.

### 2.1 The ticket's stated model does not match the code

Both the ticket and `docs/active/stories/S-002-three-more-shelves.md` say:

> `counters.json` sections list slugs, and **a section may list a recipe that never names the
> counter**. … This is how Panadería's page worked before it had a menu of its own.

Panadería carries `"categories": ["Cakes & Loaves"]`, so before it had sections its page was
filled by the category fallback — a different mechanism from section items. Measured against the
built collection, **no counter anywhere in the repo currently lists a slug that does not name
it**: across all 15 populated counters, `listed ∖ mine` and `mine ∖ listed` are both empty. The
invariant the data actually holds is *sections list exactly the recipes that name the counter*.

### 2.2 What the handoffs say the fix is

`docs/gaps/one-pot.md:23-27`, written by T-002-01 for this ticket:

> This heading is not `## What it has` yet, and that is deliberate: **no recipe names this
> counter**, so `scripts/menu-sections.mjs` would report every slug below as *listed but not
> shelved here*. … **T-002-08 renames this block to `## What it has`** once the `>> counters:`
> **lines are written**.

`docs/gaps/instant-pot.md:24-28` and `docs/gaps/bowl-shop.md:23-27` carry the same paragraph.
So the ticket that opened the shelves expected **this ticket to write `>> counters:` lines into
existing `.cook` files**. That is also what commit `a41f570` ("Apply the hand-offs the counter
tickets recorded") did for the previous story: one-line `>> counters:` edits to 13 pre-existing
recipe files, alongside the matching `counters.json` section entries.

This is in direct tension with this ticket's last acceptance criterion, *"Only
`src/data/counters.json` and `src/data/aisles.json` are modified."* See `design.md` §2.

---

## 3. `counters.json` is generated, not hand-written

`scripts/menu-sections.mjs` reads the `## What it has` block of `docs/gaps/<slug>.md`, parses
lines shaped

```
**Braises and stews.** beef-stew · pot-roast · chili-con-carne
```

into `{title, items}`, and with `--write` folds them into `src/data/counters.json`. It reports
per counter:

- `unplaced -> …` — at the counter but in no section (it then appends an `Also` section)
- `listed but not shelved here -> …` — in a section but not at the counter (dropped by `menuFor`)

Dry run today: the 15 old counters round-trip byte-identically (`107/107 placed`, etc.). The six
new ones report `gap note has no "What it has" block` and are `continue`d **before**
`counter.sections = sections`, so `--write` leaves their existing empty-item sections untouched.
That matters: `soup-pot`, `japanese-home` and `slow-cooker` belong to **T-003-06**, not here.

A section title is taken from the bold lead-in, so a `**Also here.**` line in a gap note becomes
a rendered section named "Also here" — which is how `panaderia` (7 items) and `deli` (3 items)
have one today.

---

## 4. What is on each of the three shelves right now

Measured from `src/generated/recipes.json`.

### Instant Pot — 25 recipes, all named, all `kit: Instant Pot`

Written by T-002-02 (13 braises) and T-002-03 (12 stocks, beans, porridge, borscht). Every one
carries `>> counters: Instant Pot` and `>> kit: Instant Pot`, and `grep -rl '^>> kit: *Instant
Pot'` returns the same 25. Distribution: 13 in `stews-and-braises/`, 7 in `soups/`, 5 in
`rice-beans-and-grains/`.

**This counter needs no `.cook` edits at all.** 25 ≥ the criterion's 20, and every recipe is
already a member; the job is purely to sort 25 slugs into 5 sections.

### The Bowl Shop — 36 recipes named

12 grain bowls (T-002-05), 12 leafy salads (T-002-06), 12 components (T-002-07: 6 proteins, 6
roasted vegetables). Four of the counter's seven sections are therefore already coverable:
Grain bowls, Leafy salads, What goes on top, Roasted vegetables.

**Two sections have no members at all**: *Dressings and drizzles* and *Soups*. Not one of the 40
files in `recipes/dressings-and-dips/` names The Bowl Shop — they name Deli, Shawarma Counter,
Curry House, Diner, Pizzeria, Ramen Shop, Taquería, Phở & Bánh Mì, Smokehouse, Panadería.
The ticket names this section as *"the large part of this job"* and requires the work artifact to
say which dressings were left off and why.

### One Pot — 14 recipes named

All 14 written by T-002-04. Its review says plainly: *"Nothing to hand T-002-08 beyond the
fourteen"* — every dish it checked was genuinely absent. Ten pre-existing recipes carry a
`one-pot` **tag** (`kitchari`, `jollof-rice`, `jambalaya`, `pot-roast`, `beef-stew`,
`chili-con-carne`, `dirty-rice`, `hungarian-goulash`, `irish-stew`, `japanese-beef-curry`) and
nothing renders a tag.

**14 < the criterion's 25**, and the criterion additionally wants *the majority written before
this story*. Both are unreachable without changing what `recipe.counters` says for pre-existing
files. `docs/gaps/one-pot.md` lists ~114 candidates, grouped under the four section titles,
derived from each file's own `cookware` line.

---

## 5. The judgement the ticket asks for, and the evidence available

### 5.1 The wash-up test (One Pot)

`docs/active/tickets/T-002-04-one-pot-dinners.md`: *"at the end, how many things need washing? If
the answer is more than the pot and the tools you ate with, it does not go on this shelf."* A
plate is explicitly not a pot; a separate pot of pasta water is disqualifying.

Machine-readable evidence exists: `recipe.cookware` is every `#thing{}` the file declares.
`docs/gaps/one-pot.md` was built from exactly that field and says so. It also flags its own edge
cases in *What it could not stock*: the oven-and-stove dish (`boston-baked-beans`,
`gigantes-plaki`, `baked-ziti`) is *"one pot by the pot's own count and two by the cook's …
Shelving them here is defensible and should be argued in the file, not assumed"*; and sheet-pan
cooking is a different promise entirely.

### 5.2 The dressings judgement (Bowl Shop)

The ticket names two exclusions itself — `chopped-liver` and `cream-cheese`. The folder holds 40
files spanning at least four different jobs: pourable dressings, spoonable dips, cheeses and
pickles that are toppings rather than drizzles, and deli spreads.

### 5.3 The writer handoffs

- `T-002-07/design.md` §5 — the largest handoff: **30 slugs for *What goes on top*** and **9 for
  *Roasted vegetables***, each with its folder and a reason. Two carry explicit warnings:
  `ratatouille` (*"borderline — it is a stew and may read better under Also here"*) and
  `candied-yams` (*"listed with a warning … shelving it under Roasted vegetables would make the
  section look filled when it is not"*).
- `T-002-06/review.md` §5 — its twelve salads belong under *Leafy salads*, in table order; also
  asks whether the salads' `pairs-with:` lines should now name T-002-07's components.
- `T-002-04/review.md` — the fourteen, with section assignments in its `progress.md`, marked
  *"advisory"*; notes `one-pot-pasta` could sit under either *Skillet dinners* or *Rice and
  grains that cook in*.
- `T-002-02` and `T-002-03` reviews — both close with "nothing shelves these yet; that is
  T-002-08's", and both ask for `pressure` / `natural` / `release` to be added to `VERB_ICONS` in
  `src/lib/icons.ts` *"from T-002-08 or T-002-09"*. That file is outside this ticket's ownership
  and `icons.test.ts` is currently **green** (the writers reworded instead), so it is a request,
  not a defect.

---

## 6. Aisles — measured state

`src/data/aisles.json` is `{note, matching, aisles[], packs[]}`. Patterns match via
`matchesStaple()` in `src/lib/units.ts`: a pattern hits when its words appear as consecutive
whole words, and **the most specific pattern wins across every aisle**, counted in words then
characters. `except` takes something back out.

`npx vitest run` today: **824 passed, 1 failed**. The failure is the aisle-coverage test:

```
src/lib/shopping.test.ts:163  expected 0.0342 to be less than 0.02
37/1082 ingredients have no aisle
```

The bar is `real.length / counts.size < 0.02` where `real` excludes anything matching `\bwater\b`
— so with 1082 distinct ingredient names, **at most 21 may be unplaced**. 16 must be placed.

The 37 fall into four groups:

1. **S-003 pantry** (the majority): abura-age, burdock root, konnyaku, ito konnyaku, dried
   hijiki, kabocha, lotus root, amaranth, job's tears (three spellings), fox nut, hairy gourd,
   aged tangerine peel, dried lily bulb, apricot kernels, Solomon's seal, adenophora root, dried
   overlord flower, snow pears, crucian carp, yellowtail fillets, yellowtail collar, laver.
2. **S-002 salads and one-pots**: radicchio, pepperoncini (`italian-chopped-salad`), filé powder
   (`gumbo`), yuca (`sancocho`).
3. **Recipes used as an ingredient**: basic vinaigrette, ranch dressing, caesar dressing, goma
   dare, teriyaki sauce, taco seasoning.
4. **Not food**: flat skewers, metal skewers, oak or hickory wood.

Group 1 is nominally T-003-06's §3 (*"dried Chinese soup ingredients, Japanese pantry staples"*),
but its ticket `depends_on: [T-002-08]` — it runs after this one — and this ticket's criterion is
that the test **passes** now. Group 1 cannot be left alone.

`docs/active/tickets/T-003-06` also records that *"a new aisle is allowed; a wrong aisle is not"*
for goods bought from a herbalist or an Asian grocery.

The ticket's two named hazards are both real and both testable: a bare word added to one aisle
can steal a product from a more specific pattern in another (`"pepper"` in Produce once orphaned
`green bell pepper`), and `purchaseOf` returning null for grams-vs-cups is correct behaviour, not
a gap to be filled with a pack size.

---

## 7. Boundaries and constraints

- **Ownership.** `src/data/counters.json` and `src/data/aisles.json`. **T-003-06 holds the same
  two files** and waits on this ticket; its three counters (`soup-pot`, `japanese-home`,
  `slow-cooker`) must be left exactly as they are.
- **`docs/gaps/*.md` is upstream of `counters.json`.** Editing the JSON by hand without editing
  the gap note leaves `menu-sections.mjs` disagreeing with the committed data — the two have
  round-tripped identically until now.
- **Verification available**: `node scripts/check-recipes.mjs`, `npm run recipes`,
  `node scripts/menu-sections.mjs`, `npx vitest run`, `npm run build`, and `npm run verify`
  (all four in sequence).
- **`icons.test.ts`** asserts the first word of every operation label is a verb `VERB_ICONS`
  knows — a collection-wide coupling that bit three writer tickets. Adding no new `.cook` prose
  keeps it green.
- **Build volume**: 658 recipes, 21 counters, ~610+ pages. A full `npm run build` is the only
  thing that proves the three menu pages render.
