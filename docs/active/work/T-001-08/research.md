# T-001-08 — Research

What the Ramen Shop holds, what the build will accept, and where the boundaries of this
ticket run. Descriptive only; no proposals.

## 1. What the counter actually holds today

Counted from the files, not from the docs:

```
$ grep -h '^>> counters:' recipes/*/*.cook | tr ',' '\n' | sort | uniq -c | sort -rn
   96 Bakery … 46 Diner … 41 Deli … 15 Curry House … 11 Dim Sum Counter … 10 Ramen Shop
```

**Ramen Shop is the smallest counter on the site.** Ten recipes name it. Every `.cook` file
in the collection carries an explicit `>> counters:` line (0 files fall through to the
category fallback), so the count is exact:

| Slug | Folder | `counters:` |
| --- | --- | --- |
| `chawanmushi` | custards-and-puddings | Ramen Shop |
| `goma-dare` | dressings-and-dips | Ramen Shop |
| `miso-ginger-dressing` | dressings-and-dips | Ramen Shop |
| `haemul-pajeon` | flatbreads-and-pancakes | Ramen Shop |
| `okonomiyaki` | flatbreads-and-pancakes | Ramen Shop |
| `teriyaki-sauce` | sauces-and-gravies | **Ramen Shop, Takeout Counter** |
| `miso-soup` | soups | Ramen Shop |
| `bulgogi-marinade` | spice-blends-and-marinades | Ramen Shop |
| `shichimi-togarashi` | spice-blends-and-marinades | Ramen Shop |
| `japanese-beef-curry` | stews-and-braises | Ramen Shop |

So the ticket's "10 recipes, 9 of them its own" is exactly right: `teriyaki-sauce` is the one
shared file. Nine are exclusive. The acceptance bar is **18 total / 14 exclusive**, so the
gap is **8 more recipes, at least 5 of which must name Ramen Shop alone**.

Five of the ten are shelf items (two dressings, a sauce, a spice blend, a marinade). Two are
Korean (`haemul-pajeon`, `bulgogi-marinade`). **There is no broth, no noodle, no topping and
no protein on this counter** — the three things a ramen board is actually made of.

`src/data/counters.json` prints five sections for the Ramen Shop (small plates, rice and
donburi, soup, custard, the shelf). Neither a "Broths" nor a "Toppings" section exists. That
file belongs to **T-001-17**, not here.

## 2. Where `docs/gaps/ramen-shop.md` has gone stale

The ticket warns the gap docs are stale. Four of its claims are now wrong, and all four are
claims of absence — which matters, because they are the reasons it gives for ranking items:

- *"No noodle dish exists on the site."* — `recipes/noodles/` now holds `lo-mein`,
  `pad-thai`, `pad-see-ew`, `pad-kee-mao`, `singapore-mei-fun`. The folder exists and has a
  house style.
- *"Nothing fried on the site."* — `recipes/dumplings-and-rolls/egg-rolls.cook` and
  `crab-rangoon.cook` are both deep-fried, and `general-tsos-chicken` dredges and fries.
- *"There is not a dumpling on the site."* — `recipes/dumplings-and-rolls/` exists (two
  files). Neither is a gyoza, so **item 7 is still a real gap**; only its stated reason is stale.
- *"There is no drink on the site."* — `recipes/drinks/ca-phe-sua-da.cook` exists, written by
  T-001-02.

None of the staleness removes an item from the list. It changes the *rationale* for items 4,
7, 8 and 18, not their absence.

## 3. Every ranked item and every component is genuinely absent

`ls recipes/*/<slug>.cook` over every name on the page returned nothing for any of:

> tonkotsu · chashu · gyoza · karaage · tonkatsu · dashi · ramen · ajitama · shoyu · shio ·
> menma · chahan · onigiri · katsudon · gyudon · oyakodon · korokke · edamame · tsukemen ·
> tantanmen · mazemen · yakisoba · udon · takoyaki · agedashi · wakame · nori · naruto ·
> tare · mayu · panko · curry-roux

Nothing on this page is a "the dish exists, it just needs this counter added" case, so
**this ticket produces no entries for T-001-18 on that basis**. Every item is a new file or
nothing.

Two adjacent files already exist and would be the ones to check for overlap:
`japanese-beef-curry` (holds its own roux inline) and `okonomiyaki` (calls for
`okonomiyaki sauce` and `Japanese mayonnaise` as bought ingredients). Both are owned by
earlier tickets; changing them is T-001-18's business, not this one's.

## 4. The file format

A `.cook` file is cooklang plus a `>>` metadata block, parsed by `scripts/normalise.mjs`.

- **Required by `check-recipes.mjs`** (`REQUIRED_META`): `title`, `category`, `tags`,
  `servings`. Missing any is a hard FAIL.
- **Promoted fields** (`normalise.mjs:206`): `counters`, `dish`, `kit`, `aka`, `pairs-with`.
  Anything else — `time`, `yield` — stays in `metadata` and prints on the page.
- `counters` is validated against `src/data/counters.json` in *both* the checker and the
  build. The exact string is **`Ramen Shop`**.
- `aka` is a comma list. Every Japanese title needs at least one diacritic-free / romaji form
  because that is what a person types; `ca-phe-sua-da` and `cha-lua` both do this.
- `pairs-with` takes slugs and is **made mutual at build time**, so naming a component from a
  bowl links both directions without editing the component.
- `>> step.N:` (1-based) overrides the derived label for step N.
- Category defaults to the folder name in title case (`normalise.mjs:194`), and no list of
  valid categories exists anywhere — a new folder is a new category, no registration needed.
  `parse-recipes.mjs` only fails when a recipe sits at **no** counter, which an explicit
  `>> counters:` line prevents.

## 5. What makes a table draw — the real constraints

`buildTree()` in `src/lib/tree.ts` turns steps into a merge tree; `layout()` tiles it. The
checker fails a file for any of:

1. **No step uses an ingredient** — nothing to draw.
2. **Two roots.** Every branch must flow into one final step via `@&(~N)`. This is the one
   that bites: a recipe that makes a sauce and a filling and never joins them fails.
3. **A step used twice.** `child.parent` is set once; a second consumer throws *"a
   preparation can only flow into one place."* A component used in two later steps must be
   two files, or duplicated.
4. **`rowCount < 3`** — fewer than three ingredients is "too thin to be a table".
5. **`colCount < 3`** — `colCount` is the root's column, and `col(op) = 1 + max(col(children))`
   with ingredients at column 1. So a one-step recipe is 2 columns and fails; **at least two
   chained operations are required**, and each additional link adds a column.
6. **Tiling errors** — every (row, col) covered exactly once. Falls out of the tree
   automatically; only a hand-broken structure trips it.
7. **An operation cell with an empty label** — reword, or set `>> step.N:`.

A step with **no ingredients and no refs** is not an operation at all: it becomes a
full-width header row (before the first real step) or footer row (after). That is the way to
put a sentence of prose above the table.

Reference syntax is **relative**: `@&(~1)broth{}` is one step back, `@&(~3)bones{}` is three
back. A step may take several (`char-siu` step 5 takes `~1` and `~2`). The name inside the
braces is free text and is what the row would say if it were an ingredient — it is not
matched against anything.

## 6. Timers

`~name{5%min}` — the acceptance criteria require every timer named, and 221 of the 315
existing files still use bare `~{...}`, so the *existing* files are not the pattern to copy
here.

`src/lib/time.ts` reads the name first: `UNATTENDED` holds `simmer, braise, boil, steep,
soak, marinate, chill, rest, cool, drain, press, steam, poach, roast, bake, brine, set`;
`HANDS_ON` holds `fry, deepfry, stirfry, sear, brown, toast, stir, whisk, knead, roll,
shape, toss, skim, baste, flip`. An **unrecognised** name is not an error — it falls through
to reading the label — but a recognised one is the author saying it outright, which is the
point of the timeline under the table. Units: `sec`, `min`, `hr`, `day`.

## 7. Where the Japanese things currently live

| Kind of thing | Folder in use |
| --- | --- |
| griddled pancake | `flatbreads-and-pancakes` (okonomiyaki, haemul-pajeon) |
| savoury egg custard | `custards-and-puddings` (chawanmushi) |
| stock / soup | `soups` (miso-soup, and every broth on the site) |
| braised meat, roast pork | `stews-and-braises` (char-siu, cha-lua, japanese-beef-curry) |
| pickles | `dressings-and-dips` (do-chua, sour-dill-pickles) |
| fried parcels | `dumplings-and-rolls` (egg-rolls, crab-rangoon) |
| noodle plates | `noodles` (five Thai/Chinese plates, all stir-fried) |
| drinks | `drinks` (one file) |

Two kinds of thing on the ramen board have **no home**: a deep-fried plate that is not a
parcel (karaage, tonkatsu, korokke, agedashi tofu, takoyaki), and a ramen topping that is
neither a pickle nor a dip (ajitama, menma, kikurage). `stir-fries` and `smoked-and-grilled`
are the nearest folders and neither is right.

## 8. House style, read from the strongest recent files

`pho-broth`, `cha-lua`, `char-siu`, `egg-rolls` and `ca-phe-sua-da` share a shape:

- 5 steps, `>> step.N:` overrides on most, staircase of 5–6 columns.
- Quantities carry both customary and metric: `@beef marrow bones{4%lb}(1.8 kg)`.
- The note in parentheses is prep or a spec: `(halved lengthways)`, `(at 350°F/175°C)`.
- One or two steps carry a paragraph of real cook's judgement after the instruction — why
  the parboil is not optional, what temperature the paste must stay under. This is where the
  files earn their keep, and it is what "the canonical method rather than a shortcut wearing
  its name" looks like in practice.
- Cookware in `#stockpot{}`, `#wok{}`, `#food processor{}`.

## 9. Ownership and boundaries

- **Write `.cook` files under `recipes/` only.** `src/` is T-001-17's (menu sections,
  shopping aisles); `src/data/counters.json` sections are therefore *not* updated here, and
  new recipes will not appear in a Ramen Shop section until that ticket runs — they will
  still be on the counter, because `counters.ts` falls back to grouping by category.
- Editing an existing recipe to add `Ramen Shop` to its `counters:` is **T-001-18's**. No
  such case was found (§3).
- `docs/gaps/ramen-shop.md` is input, not output.
- Only `recipes/**` may be modified.

## 10. Assumptions and open constraints

1. **A bowl of ramen cannot be one table** — five preparations, and the tree forbids one step
   feeding two consumers. The gap doc's own answer is "write the five, and write the bowl as a
   short table that consumes them", which the build does allow: the components are separate
   files, and the bowl lists them as plain `@` ingredient rows.
2. **A chashu braise cannot also be the tare** — same rule. Two files, cross-referenced with
   `pairs-with`.
3. Tonkotsu at shop scale (12–18 hr, topped up as it goes) is a loop the table cannot hold.
   A home version is a single unbroken boil and the file has to say so.
4. Some toppings are not recipes at all: nori is bought in sheets, naruto maki is bought
   sliced, corn-and-butter is two ingredients dropped on a bowl. Only menma and kikurage
   involve cooking, and kikurage is a soak plus a slice — under the three-ingredient floor.
5. `servings` for a component (a litre of broth, a jar of tare) is expressed the way the
   existing components do it — the number of bowls it dresses, not "1 jar".
