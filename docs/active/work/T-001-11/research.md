# T-001-11 — Research

What the Shawarma Counter holds today, what the build will accept as a `.cook` file, and
where the edges of this ticket are. Descriptive only; no proposals.

## 1. What the counter actually holds

The ticket and `docs/gaps/shawarma-counter.md` both say **21 recipes, 15 of them its own**.
Counted from the files, both numbers are exactly right:

```
$ grep -rl "Shawarma Counter" recipes/ | wc -l
21
$ grep -h '^>> counters:' $(grep -rl "Shawarma Counter" recipes/) \
    | sed 's/>> counters: *//' | grep -c '^Shawarma Counter$'
15
```

| Slug | Folder | Counters | Gap-doc section |
| --- | --- | --- | --- |
| `hummus` | dressings-and-dips | + Deli | Cold mezze |
| `baba-ganoush` | dressings-and-dips | + Deli | Cold mezze |
| `muhammara` | dressings-and-dips | own | Cold mezze |
| `tabbouleh` | rice-beans-and-grains | own | Cold mezze |
| `tahini-sauce` `toum` `tzatziki` | dressings-and-dips | own | Sauces |
| `harissa` | spice-blends-and-marinades | own | Sauces |
| `rice-pilaf` | rice-beans-and-grains | + Diner | Rice and grains |
| `mujaddara` `gigantes-plaki` | rice-beans-and-grains | own | Rice and grains |
| `red-lentil-soup` `harira` | soups | own | Soups |
| `avgolemono` | soups | + Diner | Soups |
| `pita-bread` | flatbreads-and-pancakes | + Bakery | Bread |
| `injera` | flatbreads-and-pancakes | own | Bread (shelved from Ethiopian) |
| `zaatar` | spice-blends-and-marinades | + Bakery | Spice shelf |
| `dukkah` `ras-el-hanout` `chermoula` | spice-blends-and-marinades | own | Spice shelf |
| `lamb-tagine` | stews-and-braises | own | Hot |

The acceptance floor — **26 shelved, ≥18 exclusive** — therefore needs **5 new files at
minimum**, of which **3 must name only this counter**. Every new file starts exclusive by
default, so the exclusivity half is the easier half; nothing this ticket writes can reduce
the existing 15.

The shape of the hole is not the count. Six of the twenty-one are spice blends and sauces,
four are dips, three are soups. **The protein column is empty and the format column is
empty** — the two leftmost cells of the grid the counter is organised around.

## 2. Every ranked item is genuinely absent

The ticket warns the gap docs are stale. `ls recipes/*/<slug>.cook` was run over **60
candidate slugs** drawn from the ranked list and from "Components it would need" —
chicken-shawarma, beef-shawarma, lamb-shawarma, gyro, gyro-meat, doner-kebab, falafel,
taameya, chicken-over-rice, yellow-rice, shish-tawook, kafta, kofta, labneh, fattoush,
kabis, torshi, batata-harra, ful-medames, kibbeh, kibbeh-nayyeh, fatayer, sambousek,
lahm-bi-ajeen, sfiha, manakish, baklava, maamoul, halloumi, saganaki, horiatiki,
greek-salad, melitzanosalata, taramosalata, tirokafteri, fava, spanakopita, loukoumades,
ezme, haydari, zaalouk, mast-o-sir, makdous, makanek, soujouk, hummus-fatteh, loaded-fries,
mint-tea, ayran, jallab, shawarma-spice, white-sauce, amba, pomegranate-molasses,
sugar-syrup, attar, filo, phyllo, pickled-turnips, sumac-onion.

**Not one exists.** Checked again against all 382 basenames under `recipes/`. So:

- Nothing on this list is a "dish that already exists and only needs this counter added",
  and therefore **nothing here belongs in T-001-18's artifact on that basis**.
- The staleness the ticket warns about is real but lands elsewhere: `sour-dill-pickles` and
  `lime-pickle` (dressings-and-dips) and `do-chua` postdate the gap docs, which is why the
  gap doc's claim that "**nothing on the site is pickled**" (item 9) is now false. The
  *observation* is stale; the *dish* — kabis, the turnip-and-beet plate — is still missing.
- `recipes/fried-and-crispy/` now exists (opened by T-001-08 for `karaage`), so the gap
  doc's "there is no falafel, because nothing in the collection is deep-fried" is also
  stale as an explanation. The folder is there and has one file in it.

Two adjacent facts that matter for shelving:

- `docs/gaps/bakery.md` line 79 lists **Baklava** with "*sold at the Arabic bakery beside
  the dip case (see also Shawarma Counter)*", and line 69 lists **Manakish**. Those two are
  legitimately two-counter dishes, and the Bakery gap doc says so in writing.
- `docs/gaps/bakery.md` line 107 records the same missing component this doc does: "Filo
  handling and clarified butter — baklava, and nothing filo exists."

## 3. What a `.cook` file has to be

From `scripts/check-recipes.mjs`, `scripts/normalise.mjs`, `src/lib/tree.ts`,
`src/lib/layout.ts`, `src/lib/label.ts`, `src/lib/time.ts`, and the 382 files on disk.

**Metadata.** `>> key: value` lines above the prose. `title`, `category`, `tags`, `servings`
are in `REQUIRED_META` — a missing one is a hard FAIL. `counters` is validated against the
names in `src/data/counters.json`; `Shawarma Counter` is a known name. `aka`, `pairs-with`,
`dish`, `kit` are promoted to their own fields. Anything else (`time`, `note`) survives as
free metadata and prints under the table — `al-pastor` uses `>> note:` for exactly the
caveat this counter needs, that the home version is a different dish from the spit.

**`>> step.N:`** overrides the derived label of step N, counting **all** steps including
header steps. The derived label is the step's sentence with its ingredients deleted and
`cleanLabel()` run over the wreckage, which is why `--labels` exists: it prints the
staircase so an author can see whether the cells read as verbs or as sentence fragments.
An operation cell that comes out empty is a FAIL.

**The tree is written, not guessed.** Leaves are ingredients, one row each. Internal nodes
are operations. Edges come only from cooklang intermediate references — `@&(~1)dough{}`,
where `~N` counts **N steps back from the current step**, header steps included. `gyoza`
uses `@&(~3)rested dough{}` to reach back over the filling branch, which is how two chains
merge into one root.

**Tiling gates in the checker.** `rowCount < 3` — "too thin to be a table". `colCount < 3` —
"only one operation — nothing merges, so the table is a list". Plus
`findTilingErrors(grid)`. In practice: at least three ingredients, and at least two chained
operations so the merge tree has depth.

**Timers.** `~name{8%min}` is named; `~{8%min}` is not. `src/lib/time.ts` reads the name
first against `UNATTENDED` (rest, marinate, chill, fry-adjacent waits) and `HANDS_ON`
(knead, stir, fry, sear, toss…), falling back to the words of the step only when the name
says nothing. An **unrecognised** name is treated as no name at all — `~blind bake{20%min}`
is the recorded example of a descriptive name making the answer worse. So "every timer is
named" means named **from those two vocabularies**, not merely named.

Older files here use bare `~{45%min}` (`hummus`, `toum`, `pita-bread`). The recently written
ones (`karaage`, `gyoza`, `al-pastor`) name every timer. The ticket's criterion follows the
newer files; the older ones belong to other tickets and are not this ticket's to fix.

**House prose voice**, read off the newest files: one imperative sentence carrying the
ingredients, then plain commentary about the thing people get wrong — `gyoza`'s wrung
cabbage, `karaage`'s two fries, `som-tum`'s "three chiles is a tourist's plate". Metric in
parentheses beside imperial. `aka` is generous and includes undiacriticked forms and the
literal menu line ("an order of six", "1. Chicken over Rice").

## 4. Categories available

Twenty-two folders exist and the `>> category:` string is the title-cased form of the folder
name: `Fried & Crispy`, `Smoked & Grilled`, `Rice, Beans & Grains`, `Toppings & Pickles`,
`Dumplings & Rolls`, `Flatbreads & Pancakes`, `Dressings & Dips`, `Sauces & Gravies`,
`Spice Blends & Marinades`, `Salads`, `Bars & Brownies`, `Cookies`, `Pastry & Doughs`,
`Drinks`, `Soups`, `Stews & Braises`, `Sandwiches & Rolls`, `Breads`, `Noodles`,
`Cakes & Loaves`, `Custards & Puddings`, `Stir-Fries`.

Relevant occupancy: `fried-and-crispy` holds 1 file, `salads` holds 2, `drinks` holds 1,
`toppings-and-pickles` holds 2, `smoked-and-grilled` holds 9 (all American pit work except
`al-pastor`). None of the dishes on this list needs a new folder — every one of them is a
fry, a grill, a pickle, a salad, a filled pastry, a flatbread, a dip or a sweet, and each of
those already has a shelf.

## 5. The two things this counter's dishes assume and cannot say

Both are recorded in the gap doc's "Components it would need" and both are real:

- **No shawarma marinade exists.** `tandoori-marinade` is the nearest thing on the site and
  it is a different cuisine. Chicken shawarma and gyro meat both start from it.
- **No pomegranate molasses exists.** `muhammara` — already written, and not this ticket's
  file — takes it as a plain ingredient row. `fattoush` and `ezme` would do the same.

Also absent and assumed: labneh (a component under tzatziki, haydari and mast o sir *and* a
menu item in its own right), the sugar syrup under every one of the sweets, and the sumac
onions that land on every plate off the spit.

## 6. Boundaries

- **`recipes/**` only.** `src/data/counters.json` still prints the counter's old section
  list; that file is **T-001-17's** and is out of scope. New recipes shelve themselves
  through their own `>> counters:` line, so the page will list them regardless.
- **Do not edit existing recipe files.** `muhammara` assuming pomegranate molasses is a
  fact about another ticket's file, not an invitation.
- **Sealing.** `lisa status` reports **commit-sealed**, so every file goes in through
  `lisa commit-ticket --include <exact path>`; no ordinary `git add`/`git commit`.
- **The gap doc's "What it could not stock" is not a work list.** It rules out the spit
  itself, **the grid** (and with it "chicken over rice", named there as "three finished
  tables and a scoop"), platters, loaded fries, mezze-as-a-meal, the twelve-flavour dip
  case, makdous, and the combo plate. Item 4 of the *missing* list and the grid entry of the
  *could not stock* list are the same dish looked at from two sides; that collision is the
  one real ambiguity in this ticket and Design has to resolve it.
