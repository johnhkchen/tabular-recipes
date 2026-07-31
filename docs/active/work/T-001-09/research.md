# T-001-09 — Research

What the Curry House holds, what the build accepts, and where the edges are. Descriptive
only; no proposals.

## 1. What the counter actually holds today

The ticket and `docs/gaps/curry-house.md` both say **15 recipes**. Counted from the files,
that is exactly right, and — unusually for this collection — **all fifteen name Curry House
and nothing else**:

```
$ grep -rl "Curry House" recipes/ | wc -l
15
$ grep -h '^>> counters:' recipes/*/*.cook | tr ',' '\n' | sort | uniq -c | sort -rn
  96 Bakery … 46 Diner … 41 Deli … 15 Curry House … 10 Ramen Shop
```

| Slug | Folder | Gap-doc section |
| --- | --- | --- |
| `tandoori-marinade` | spice-blends-and-marinades | Tandoori |
| `chicken-tikka-masala` | stews-and-braises | The sauce list |
| `chana-masala` | stews-and-braises | The sauce list |
| `dal-tadka` | soups | Dal and vegetarian |
| `kitchari` | rice-beans-and-grains | Dal and vegetarian |
| `lemon-rice` | rice-beans-and-grains | Rice |
| `naan` `chapati` `paratha` `dosa` | flatbreads-and-pancakes | Breads |
| `kheer` | custards-and-puddings | Sweets |
| `garam-masala` `madras-curry-powder` `berbere` | spice-blends-and-marinades | The spice shelf |
| `doro-wat` | stews-and-braises | Shelved from the Ethiopian board |

So the acceptance floor — **22 shelved, ≥20 exclusive** — needs **seven** new files at
minimum, and every one of them starts exclusive by default. The exclusivity half of the
criterion is already satisfied at 15/15 and cannot be broken by anything this ticket writes,
because nothing on the ranked list belongs at a second counter.

`src/data/counters.json` still prints the eight old sections (2 sauces, 4 breads, …). That
file is **T-001-17's** and is out of scope; the counter page will keep printing the stale
section list until that ticket runs, and the recipes will still be shelved because the
`counters:` line on each file is what the build reads.

## 2. Every ranked item is genuinely absent

The ticket warns the gap docs are stale. `ls recipes/*/<slug>.cook` was run over **all 68
names** on the ranked list and in "Components it would need" — butter-chicken, murgh-makhani,
korma, rogan-josh, bhuna, dopiaza, jalfrezi, madras, vindaloo, dansak, karahi, balti,
passanda, patia, papadom, mango-chutney, lime-pickle, mint-chutney, raita, samosa, pakora,
onion-bhaji, chicken-tikka, seekh-kabab, biryani, pilau-rice, paneer, palak-paneer,
saag-aloo, bombay-aloo, bhindi-bhaji, aloo-gobi, baingan-bharta, garlic-naan, keema-naan,
peshwari-naan, tandoori-roti, poori, sambar, coconut-chutney, gulab-jamun, mango-lassi,
masala-chai, filter-kaapi, idli, medu-vada, uttapam, rava-dosa, ven-pongal, curd-rice, upma,
tamarind-rice, bisi-bele-bath, rava-kesari, mysore-pak, onion-tomato-masala, makhani-gravy,
ginger-garlic-paste, cashew-paste, kashmiri-chile-paste, vindaloo-paste, tamarind-pulp,
sambar-powder, dosa-batter, birista, ghee, chai-masala, tamarind-chutney — and confirmed
again against all **325** basenames in `recipes/`.

**Not one of them exists.** Nothing on this list is a "dish that already exists and only needs
this counter added", so **nothing here belongs in T-001-18's artifact** on that basis. The
staleness the ticket warns about (a pastry shell, two pickles, cornbread, char siu, a pâté)
is real but lands at other counters; it does not touch this list.

Three of the fifteen already carry what a component would have supplied, and must not be
rewritten by this ticket:

- `tandoori-marinade` is the tikka marinade — the "nothing on the skewer" complaint is about a
  missing dish, not a missing marinade.
- `chicken-tikka-masala` already carries `@ginger-garlic paste{2%Tbs}` as a plain ingredient
  row, i.e. it assumes a component that is not written.
- `chana-masala` cooks its onion-tomato base **inline** across steps 2–4. That is the base the
  ticket says does not exist — it exists once, unnamed, inside one dish.

## 3. What a `.cook` file has to be

From `scripts/normalise.mjs`, `src/lib/tree.ts`, `src/lib/layout.ts` and the 325 files:

**Metadata.** `>> key: value` above the prose. `title`, `category`, `tags`, `servings` are
required by `check-recipes.mjs` (`REQUIRED_META`); missing one is a hard FAIL. `counters` is
validated against `src/data/counters.json` — `Curry House` is a known name. `aka`,
`pairs-with`, `dish`, `kit` are promoted fields; anything else (`time:`) survives as free
metadata printed under the table. `>> step.N:` overrides the derived label of step N, counting
**every** paragraph including prose-only ones.

**`pairs-with` is checked at build time, not by the checker.** `scripts/parse-recipes.mjs:88`
throws if a slug does not resolve. A recipe pointing at a slug written later in the same
ticket is fine; one pointing at a slug nobody writes breaks `npm run recipes`.

**The tree is written, not guessed.** `@&(~N)thing{}` is an intermediate reference and N counts
**backwards**: `~1` is the previous step, `~4` is four steps back (`chana-masala` step 5 reaches
`~4` for its chickpeas). Three hard errors come out of `buildTree`:

1. `no step uses an ingredient` — a file of pure prose.
2. `step N is used by two later steps` — the tree forbids a preparation flowing into two
   places. A base used twice in one file has to be split or duplicated.
3. `N steps end the recipe` — **every branch must flow into one final step.** This is the
   error that bites: a garnish tossed on at the end without an `@&(~1)` reference is a second
   root and fails the file.

**The two size floors**, from `check-recipes.mjs:66`:

- `rowCount < 3` → "too thin to be a table". Rows are **ingredient leaves**, one per `@`.
- `colCount < 3` → "only one operation". `colCount = 1 + depth of the op chain`, so a file
  needs **at least two chained operations** (`@&(~1)` at least once) to draw a table at all.

This is why a one-ingredient component cannot be a file here: `ghee` is butter, melted,
simmered, strained — one ingredient row, and it fails on `rowCount`.

**Prose rows are a feature.** A paragraph with no ingredients and no refs becomes a
full-width row: a **header** if it comes before the first real step, a **footer** if after
(`tree.ts:120`). `naan` uses one for its preheat. This is the only place a table can say
something a cell cannot hold.

**Cross-file components are plain ingredients.** A recipe that consumes another recipe writes
`@onion-tomato masala{2%cup}(…)`, not `@&(~N)`. `naan` does exactly this with ghee. The
reference syntax is for steps inside one file only.

**Labels.** `cleanLabel` strips the ingredients out of the sentence, collapses the commas, and
drops **one** trailing connective. Sentences that read as verb-first instructions survive it;
sentences with a clause at the end come out as fragments. `--labels` prints the staircase, and
that printout is the acceptance criterion — the fix is a `>> step.N:` line.

**Timers.** `~name{20%min}` is named, `~{20%min}` is not. The ticket requires every timer
named. `src/lib/time.ts` reads the name against two vocabularies — `UNATTENDED` (simmer, rest,
marinate, soak, steep, fry is *not* in it, chill, drain, press, …) and `HANDS_ON` (fry, stir,
knead, sear, toast, …). **An unrecognised name is worse than no name**: it falls through to
reading the label. So the names have to be chosen from those two sets to mean anything.
`chicken-tikka-masala` and `chana-masala` — the two existing sauces — use bare `~{60%min}`
throughout, so the existing files are not the model for this.

## 4. Where the new files would go

`recipes/` has 20 category folders. The categories that already hold this counter's work:

- `stews-and-braises/` — 27 files, holds both existing curries and every Thai curry. Anything
  with a sauce belongs here.
- `sauces-and-gravies/` — 24 files, holds base preparations that are eaten with something
  else: `bolognese`, `mole-poblano`, `red-enchilada-sauce`, `pad-thai-sauce`.
- `spice-blends-and-marinades/` — 24 files, dry blends and wet pastes alike: seven Thai curry
  pastes live here, so a vindaloo paste has precedent.
- `dressings-and-dips/` — 28 files, the condiment shelf. It already holds two pickles
  (`do-chua`, `sour-dill-pickles`) and two fresh cheeses (`queso-fresco`, and a pâté), so a
  chutney tray and a pressed paneer have precedent.
- `flatbreads-and-pancakes/` — 23 files, all four existing breads, plus `hush-puppies`, which
  is the precedent for a fritter that is not a bread.
- `dumplings-and-rolls/` — 2 files (`crab-rangoon`, `egg-rolls`): fried filled parcels.
- `rice-beans-and-grains/` — 22 files, holds `lemon-rice` and `kitchari`.
- `smoked-and-grilled/` — 8 files, all smokehouse; skewered and charred meat has no other home.
- `drinks/` — **1 file** (`ca-phe-sua-da`). The gap doc's three drinks would land here.

No new folder is needed for anything in the top half of the ranked list.

## 5. Constraints the ticket sets on itself

- **`recipes/**` only.** `src/data/counters.json` — where the sections and the aisles are —
  belongs to T-001-17. Editing it here would collide.
- **Existing files are other tickets' property.** Anything that would only need a `counters:`
  line added goes in T-001-18's artifact instead. Section 2 found no such case.
- Commits go through `lisa commit-ticket --include <exact paths>`; the ordinary index is not
  to be touched.

## 6. What the gap doc says cannot be done, and what that costs

Four of the five "could not stock" items bear directly on the top of the list:

- **The sauce-across-protein grid.** Korma is one recipe and four printed lines. The table
  cannot hold four proteins, so the protein has to be chosen in the file and the rest said in
  prose — which is exactly what a footer row is for.
- **The tandoor.** 480°C against a clay wall. `naan` is already written for a baking steel at
  500°F and does not say which it is. Anything skewered has the same problem.
- **The chutney tray.** Four preparations arriving on one tray is four tables and a habit.
- **Spice level.** Madras, vindaloo and phal differ by an amount of chile. Three files that
  differ in one cell are three tables that look identical, and the reference notes phal is
  mostly a dare.

The fifth — dosa batter's four lives — sits under ranked items 18–19, below anything this
ticket's count reaches.

## 7. Verification available

- `node scripts/check-recipes.mjs --labels <files>` — per-file, writes nothing, safe to run
  concurrently with other tickets. Exits non-zero on any FAIL.
- `npm run recipes` (`just recipes`) — rebuilds `src/generated/recipes.json`; this is where a
  broken `pairs-with` shows up. It **writes** a generated file, so it is not this ticket's to
  commit.
- `npm run verify` — parse, test, build. Whole-repo, and will fail on other tickets' work in
  progress, so it is a signal rather than a gate here.
