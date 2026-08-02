# T-003-06 — Research

What exists, where it is, and what it constrains. Descriptive only; the choices are `design.md`'s.

---

## 1. The two files this ticket owns, and what they are

| File | Lines | Shape |
| --- | --- | --- |
| `src/data/counters.json` | 1752 | `{ "//": <note>, "counters": [ {name, slug, blurb, categories[], sections[{title, items[]}]} ] } ` |
| `src/data/aisles.json` | 1697 | `{ note, matching, aisles: [{slug, name, patterns[], except?}], packs }` |

Both are written by `JSON.stringify(file, null, 2)` + a trailing newline — 2-space indent, no
trailing spaces. Any hand edit has to hold that shape or the next regeneration produces a noise
diff.

## 2. How a recipe reaches a counter page

```
recipes/<category>/x.cook   >> counters: A, B          hand-written
  └─ scripts/normalise.mjs  splitList(raw_metadata.counters)
  └─ scripts/parse-recipes.mjs
       · throws on a counter name not in counters.json (exact string match)
       · IF the file names none, inherits every counter whose `categories` contains
         the recipe's category, and sets countersInferred
       · writes src/generated/recipes.json (658 recipes, not committed)
  └─ src/lib/counters.ts  menuFor()
  └─ src/pages/menu/[counter].astro
```

`npm run recipes` currently reports **`658 named, 0 inferred from category`**. The category
fallback is therefore dead across the whole collection: **every** recipe carries an explicit
`>> counters:` line, so no `categories` entry in `counters.json` can put anything anywhere.

## 3. The constraint the whole ticket turns on — `menuFor()`

`src/lib/counters.ts:73-91`:

```ts
const mine = all.filter((r) => r.counters.includes(counter.name));
const bySlug = new Map(mine.map((r) => [r.slug, r]));
…
items: items.map((slug) => bySlug.get(slug)).filter(Boolean)
…
const rest = mine.filter((r) => !placed.has(r.slug));
if (rest.length) sections.push({ title: 'Also', items: rest });
```

Three consequences, all load-bearing here:

1. **A section item is looked up inside `mine`.** A slug listed in `counters.json` that does not
   name the counter in its own `.cook` file is silently dropped from the render. **Borrowing, as
   the ticket's §1 describes it, does not work.** This is not a new discovery: `T-002-08`'s
   `review.md` §1 measured it and §5.7 says in as many words that *"T-003-06 will hit exactly the
   wall in §1 … it needs `dashi`, `miso-soup` and `congee` on shelves they do not name."*
2. **A section with zero surviving items is filtered out** and never renders. An empty section in
   the data costs nothing on the page.
3. **Any member not listed in a section is swept into a generated section titled `Also`.** That is
   the failure mode acceptance criterion 1 names.

## 4. What T-002-08 did with the same two files, and what it left

`docs/active/work/T-002-08/review.md`:

- It hit the same wall and **broke its own "only the two data files" criterion**, editing 119
  `.cook` files — one `>> counters:` metadata line each, nothing else — and documented the trade
  in §1 rather than failing criteria 2 and 3. Commits `abba20f`, `9bf79c4e`, `ac9236e`, `4b3a36b`.
- It **regenerated** `counters.json` from `docs/gaps/*.md` via `scripts/menu-sections.mjs --write`
  rather than hand-editing it, and rewrote three gap notes to make that possible.
- It asserted that **this ticket's three counters were left byte-identical**, which holds: all
  three still carry their section titles with `"items": []`.
- **§6: it already placed roughly twenty of S-003's aisle patterns** — konnyaku, hijiki, burdock,
  job's tears, adenophora root and the rest — because its own criterion demanded a green suite.
  It says explicitly: *"T-003-06 should not re-derive them."*

## 5. The three shelves as the data has them

`categories` is `[]` on all three, so nothing arrives by fallback. Section titles were written by
T-003-01; every `items` array is empty.

| Counter | `name` (exact) | Sections, in order | Members today |
| --- | --- | --- | --- |
| `soup-pot` | `The Soup Pot` | Old-fire soups (老火湯) · Quick daily soups (滾湯) · What each thing is for · Congee and rice soups · Also here | **21** |
| `japanese-home` | `Japanese Home Cooking` | The soup and the rice · Simmered things (煮物) · Grilled and pan-fried mains · Small sides (小鉢) · Made ahead (作り置き) · Rice bowls and one-plate suppers · Also here | **28** |
| `slow-cooker` | `The Slow Cooker` | Braises, left alone all day · Beans and pulses · Stocks · Whole birds and big cuts · Also here | **20** |

Every one of those 69 members is a file written by T-003-03 / T-003-04 / T-003-05. None of them is
listed in any section, so all three pages currently render as one `Also` block.

### Note on the literal section title `Also here`

T-003-01 wrote a section *titled* `Also here` into each of the three counters, and each gap note
lists slugs for it. Acceptance criterion 1 says **no counter renders an "Also here" section**.
Those two facts are in direct tension, and the tension is this ticket's to resolve. `panaderia`
and `deli` have carried deliberate `Also here` sections since T-001; T-002-08 §5.3 read the same
criterion as scoped to its own three counters and left the others alone.

## 6. The hand-off lists the writer tickets wrote for this ticket

All three exist and all three are complete. They are the ticket's §1 *"read all three before
touching the file"*.

**`T-003-03/progress.md` — The Soup Pot.** Full 16 + 5 ordered mapping of its own files
(老火湯 ranks 1–16, 滾湯 ranks 1–5), plus a *"Found already here"* table:

| slug | section it names | note it gives |
| --- | --- | --- |
| `congee` | Congee and rice soups | at the Dim Sum Counter; this ticket's criterion names it |
| `congee-instant-pot` | Congee and rice soups | the Instant Pot variant |
| `egg-drop-soup` | Quick daily soups (滾湯) | Takeout Counter, but a genuine 滾湯 by method |
| `wonton-soup` | Also here | *"a noodle lunch in a Cantonese house, not a home soup"* |
| `hot-and-sour-soup` | Also here | *"northern by way of an American menu"* |
| `chicken-feet` | Also here | Dim Sum; listed only because feet are the body of rank 5 |
| `chicken-broth` | Also here | the Deli's, and **not** what these soups start from |

It also hands over sixteen ingredient names with no aisle — see §8.

**`T-003-04/progress.md` — Japanese Home Cooking.** A paste-ready section mapping for all 28 of
its files (4 · 6 · 4 · 6 · 4 · 4), and an eight-slug *Also here* list. It records that `dashi`,
`miso-soup` and those eight *"need a `>> counters:` line, which is T-003-06's."*

**`T-003-05/progress.md` — The Slow Cooker.** No borrowings by design. It flags two consequences:
**Beans and pulses will have one entry** and **Stocks will have none**, and says *"it is T-003-06's
call whether those sections belong on this shelf at all."*

## 7. §2 — what `docs/gaps/japanese-home.md` decided about the Ramen Shop

The gap note sorts all 31 Japanese files with one test — *does a home kitchen make this as part of
an ordinary dinner, or as an event, or as a component of something a restaurant sells?* — into
three buckets:

- **Shelve here, do not rewrite:** `dashi` · `miso-soup`. *"Both keep their Ramen Shop placement;
  they gain a second board … T-003-06 shelves them into 'The soup and the rice'."*
- **Both boards:** `karaage` · `gyoza` · `okonomiyaki` · `chawanmushi` · `japanese-beef-curry` ·
  `teriyaki-sauce` · `shichimi-togarashi` · `goma-dare`. (`japanese-milk-bread` and `castella` are
  named in the same paragraph but stay at the Bakery, *"listed here only so T-003-06 does not have
  to wonder."*)
- **Restaurant food, leave it:** `ramen-noodles` · `shio-ramen` · `shoyu-ramen` · `miso-ramen` ·
  `tonkotsu-ramen` · `tonkotsu-broth` · `chintan-broth` · `shio-tare` · `shoyu-tare` · `miso-tare`
  · `mayu` · `ajitama` · `menma` · `chashu` · `miso-ginger-dressing`. `chashu` and `ajitama` are
  called *"borderline — both are made at home for ramen — and the honest answer is that they
  belong to the bowl."*

Current `counters` on the ten that would move:

```
dashi               [Ramen Shop]                      recipes/soups/dashi.cook
miso-soup           [Ramen Shop]                      recipes/soups/miso-soup.cook
karaage             [Ramen Shop, The Bowl Shop]       recipes/fried-and-crispy/karaage.cook
gyoza               [Ramen Shop]                      recipes/dumplings-and-rolls/gyoza.cook
okonomiyaki         [Ramen Shop]                      recipes/flatbreads-and-pancakes/okonomiyaki.cook
chawanmushi         [Ramen Shop]                      recipes/custards-and-puddings/chawanmushi.cook
japanese-beef-curry [Ramen Shop, One Pot]             recipes/stews-and-braises/japanese-beef-curry.cook
teriyaki-sauce      [Ramen Shop, Takeout Counter]     recipes/sauces-and-gravies/teriyaki-sauce.cook
shichimi-togarashi  [Ramen Shop]                      recipes/spice-blends-and-marinades/shichimi-togarashi.cook
goma-dare           [Ramen Shop, The Bowl Shop]       recipes/dressings-and-dips/goma-dare.cook
congee              [Dim Sum Counter, One Pot]        recipes/soups/congee.cook
congee-instant-pot  [Instant Pot]                     recipes/soups/congee-instant-pot.cook
egg-drop-soup       [Takeout Counter]                 recipes/soups/egg-drop-soup.cook
```

Adding a counter is purely additive: none of these leaves the board it is on, so no other
counter's sections or counts change.

## 8. §3 — the aisle position, measured now

`npx vitest run` on `main` at `c0fe6a4` is **green: 8 files, 825 tests.** The coverage assertion
(`shopping.test.ts:163`, `real.length / counts.size < 0.02`) reports:

```
3/1082 ingredients have no aisle:
  flat skewers (1), oak or hickory wood (1), metal skewers (1)
```

0.28 % against a 2 % ceiling. All three are Smokehouse equipment, not this story's vocabulary and
not food. Every name T-003-03 and T-003-04 handed over is already placed by T-002-08:

| Aisle | Names from this story it now holds |
| --- | --- |
| `produce` | burdock root · lotus root · kabocha · snow pear · snow pears · hairy gourd · amaranth |
| `fishmonger` | yellowtail · crucian carp |
| `spices` | aged tangerine peel |
| `world` | abura-age · konnyaku · hijiki · laver · job's tears · lily bulb · fox nut · apricot kernels · Solomon's seal · adenophora root · overlord flower |

**This ticket adds no recipe and therefore no ingredient name.** Shelving changes `counters`
arrays only; the 1082-name set is fixed. So the aisle-coverage number cannot move as a result of
anything here.

`aisles.json` matching rules, for the record: a pattern hits when its words appear as consecutive
whole words in the name; **the most specific pattern wins across every aisle**, counted in words
then characters; `except` takes something back out. Pack sizes live in a separate `packs` block
and `purchaseOf` returns null rather than compare across measurement systems.

## 9. What runs, and what does not

`npm run verify` = `check` → `recipes` → `vitest run` → `astro build`. **`scripts/menu-sections.mjs`
is not in it** — it is a one-shot generator, run by hand with `--write`. It also `continue`s past
any counter whose gap note has no `## What it has` heading, *before* it reassigns `sections`, so
hand-written sections on those counters survive a regeneration of the other eighteen.

All three of this story's gap notes still head their block `## What is already here`, each with a
paragraph saying **T-003-06 renames it to `## What it has`**. Against that,
`docs/active/tickets/T-003-07-backfill-and-read-it-all.md` §3 says in its own words: *"Rewrite
`docs/gaps/soup-pot.md`, `docs/gaps/japanese-home.md` and `docs/gaps/slow-cooker.md` against the
shelf as it now is"*, and its criteria list that rewrite as its own. The two documents disagree
about who owns the gap notes.

## 10. Guards that will catch a mistake here

| Risk | What catches it |
| --- | --- |
| A counter name typo in a `>> counters:` line | `parse-recipes.mjs` throws; `check-recipes.mjs` too |
| A section slug that is not a recipe | nothing automatic — `menuFor` drops it silently |
| A section slug that does not name the counter | nothing automatic — same silent drop |
| A member left out of every section | renders as a generated `Also` section |
| Malformed JSON | `astro build` and every test that imports the file |
| An aisle pattern stealing from another aisle | only a before/after `aisleFor()` sweep |
| A page that does not render | `astro build` |

The middle three have no test. They have to be checked by a script written for the purpose and by
reading the built HTML, which is what T-002-08 did.

## 11. Assumptions carried into Design

1. `menuFor()` is not this ticket's to change (`src/lib/` is outside both owned files, and
   changing it would rewrite how all 21 counters render).
2. The writer tickets' section mappings are authoritative for their own files; the gap notes are
   authoritative for the borrowings, per the ticket's §2.
3. Criteria 2 and 3 (`dashi`, `miso-soup`, `congee` shelved) and criterion 8 (only two files
   modified) cannot both hold. Which one gives is Design's decision, and it is the same decision
   T-002-08 already made once on this branch.
