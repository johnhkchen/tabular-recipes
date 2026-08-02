# T-002-08 — Structure

The shape of the change. Not code — file-level changes, ordering, and the exact lists.

---

## 1. Files touched, by class

| Class | Path | Change |
| --- | --- | --- |
| Owned data | `src/data/counters.json` | **generated** — 3 counters' `sections[].items` filled, by `menu-sections.mjs --write` |
| Owned data | `src/data/aisles.json` | hand-edited — patterns added to existing aisles; `packs[]` untouched |
| Upstream of the JSON | `docs/gaps/bowl-shop.md` | `## What is already here` → `## What it has`, lists curated |
| Upstream of the JSON | `docs/gaps/instant-pot.md` | same, plus plain slugs replaced with `-instant-pot` slugs |
| Upstream of the JSON | `docs/gaps/one-pot.md` | same, lists filtered by the wash-up test |
| Membership | 119 `.cook` files | **one line each** — the `>> counters:` line gains `One Pot` and/or `The Bowl Shop` |
| Generated, gitignored | `src/generated/recipes.json` | rebuilt by `npm run recipes`; not committed |

Nothing else. No `src/lib/**`, no `src/pages/**`, no recipe step, ingredient, timer or label.

---

## 2. Ordering — this matters, the pipeline is one-directional

```
.cook  >> counters:  ──▶  npm run recipes  ──▶  src/generated/recipes.json
                                                        │
docs/gaps/<slug>.md  ──▶  menu-sections.mjs --write  ◀───┘
        ## What it has                  │
                                        ▼
                            src/data/counters.json  ──▶  menuFor()  ──▶  /menu/<slug>/
```

`menu-sections.mjs` validates section items against `recipes.json`, so **the `.cook` lines must
be written and the collection reparsed before the gap notes are folded in.** Running it earlier
reports every slug as *listed but not shelved here* and writes a menu full of holes.

Step order is therefore fixed:

1. `.cook` `>> counters:` lines
2. `npm run recipes`
3. gap notes
4. `node scripts/menu-sections.mjs` (dry run — read the report)
5. `node scripts/menu-sections.mjs --write`
6. aisles
7. full verify

---

## 3. `src/data/counters.json` — the expected result

Only three of the 21 counters change. Assertions to hold after step 5:

- `bakery` … `meat-and-three` (15 counters): **byte-identical**. They round-trip today; a diff
  there means the script or a gap note moved under me.
- `soup-pot`, `japanese-home`, `slow-cooker`: **untouched**, sections still present with empty
  `items`. Guaranteed by the `continue` at `menu-sections.mjs:100-110` — no `## What it has`
  block, so `counter.sections` is never reassigned. These are T-003-06's.
- `bowl-shop`, `instant-pot`, `one-pot`: sections filled, in the order T-002-01 opened them,
  **with no section titled "Also here" and no section left empty**.

### Section shape after the change

| Counter | Section (in menu order) | Items |
| --- | --- | --- |
| The Bowl Shop | Grain bowls | 12 |
| | Leafy salads | 16 |
| | What goes on top | 36 |
| | Roasted vegetables | 7 |
| | Dressings and drizzles | 24 |
| | Soups | 8 |
| **total** | 6 sections | **103** |
| Instant Pot | Braises that took all afternoon | 13 |
| | Beans from dry | 5 |
| | Stocks and broths | 5 |
| | Rice, grains and porridge | 1 |
| | Whole birds and big cuts | 1 |
| **total** | 5 sections | **25** |
| One Pot | Braises and stews | 36 |
| | Skillet dinners | 16 |
| | Rice and grains that cook in | 11 |
| | Soups that are the whole meal | 9 |
| **total** | 4 sections | **72** |

The seventh Bowl Shop section and the sixth Instant Pot / fifth One Pot section that T-002-01
opened are all named "Also here". They are **dropped**, not filled: `menuFor` filters a section
with no items, so an empty one never renders, and a filled one would fail the acceptance
criterion. Every member is placed in a real section instead.

---

## 4. The `.cook` edits — exact lists

The edit is always the same shape and never touches anything else in the file:

```
- >> counters: Meat and Three, Diner
+ >> counters: Meat and Three, Diner, One Pot
```

### 4.1 One Pot — 58 files

**Braises and stews (31)**
`beef-stew` · `pot-roast` · `chili-con-carne` · `beef-bourguignon` · `coq-au-vin` ·
`braised-short-ribs` · `osso-buco` · `carnitas` · `cachete` · `chile-verde` · `oxtails` ·
`irish-stew` · `hungarian-goulash` · `lamb-tagine` · `massaman-curry` · `rogan-josh` ·
`vindaloo` · `passanda` · `japanese-beef-curry` · `doro-wat` · `brunswick-stew` · `balti` ·
`bhuna` · `jalfrezi` · `madras` · `dopiaza` · `thai-red-curry` · `thai-yellow-curry` ·
`panang-curry` · `soy-sauce-chicken` · `white-cut-chicken`

**Skillet dinners (11)**
`smothered-pork-chops` · `chicken-adobo` · `tinga-de-pollo` · `xiu-mai` · `western-omelette` ·
`egg-foo-young` · `country-fried-steak` · `general-tsos-chicken` · `orange-chicken` ·
`sesame-chicken` · `sweet-and-sour-pork`

**Rice and grains that cook in (9)**
`jambalaya` · `dirty-rice` · `hoppin-john` · `kitchari` · `risotto-alla-milanese` ·
`cuban-black-beans` · `black-eyed-peas` · `butter-beans` · `congee`

**Soups that are the whole meal (7)**
`minestrone` · `harira` · `split-pea-soup` · `new-england-clam-chowder` · `borscht` ·
`black-bean-soup` · `wonton-soup`

Plus T-002-04's 14, which already name the counter and need no edit: `chicken-and-dumplings`,
`chicken-cacciatore`, `new-england-boiled-dinner`, `ratatouille`, `sausage-and-peppers` (braises);
`shakshuka`, `tortilla-espanola`, `beef-stroganoff`, `one-pot-pasta`, `skillet-lasagna`
(skillet); `arroz-con-pollo`, `paella` (rice); `gumbo`, `sancocho` (soups).

**58 + 14 = 72; 58 written before this story ⇒ the majority, and ≥ 25.**

### 4.2 The Bowl Shop — 67 files

**Leafy salads (4)** `fattoush` · `kachumber` · `som-tum` · `larb-gai`

**What goes on top (30)** — T-002-07 `design.md` §5, taken whole:
`char-siu` · `chashu` · `carnitas` · `tinga-de-pollo` · `white-cut-chicken` ·
`soy-sauce-chicken` · `cha-lua` · `meatballs` · `chicken-shawarma` · `shish-tawook` ·
`pollo-asado` · `carne-asada` · `kafta` · `smoked-chicken` · `gyro-meat` · `chicken-tikka` ·
`karaage` · `falafel` · `paneer` · `queso-fresco` · `labneh` · `ajitama` · `sumac-onions` ·
`do-chua` · `kabis` · `sauerkraut` · `menma` · `birista` · `dukkah` · `guacamole`

**Roasted vegetables (1)** `batata-harra`

**Dressings and drizzles (24)**
`basic-vinaigrette` · `caesar-dressing` · `green-goddess-dressing` · `ranch-dressing` ·
`blue-cheese-dressing` · `honey-mustard-dressing` · `russian-dressing` ·
`miso-ginger-dressing` · `goma-dare` · `tahini-sauce` · `toum` · `tzatziki` · `raita` ·
`nuoc-cham` · `chimichurri` · `basil-pesto` · `romesco` · `muhammara` · `hummus` ·
`baba-ganoush` · `aioli` · `crema-mexicana` · `white-sauce` · `mint-chutney`

**Soups (8)** `butternut-squash-soup` · `tomato-soup` · `potato-leek-soup` · `red-lentil-soup` ·
`corn-chowder` · `minestrone` · `black-bean-soup` · `caldo-verde`

Plus the 36 that already name the counter (T-002-05's 12 bowls, T-002-06's 12 salads,
T-002-07's 12 components) — no edit.

**Overlap**: 6 files appear in both lists (`carnitas`, `tinga-de-pollo`, `soy-sauce-chicken`,
`white-cut-chicken`, `minestrone`, `black-bean-soup`) and get both names in one edit.
**119 distinct files.**

### 4.3 Instant Pot — 0 files

All 25 already name it.

---

## 5. What is deliberately left off, and where the reason is recorded

Each of these is a judgement, and each goes in `progress.md` with its reason so a reviewer can
overturn one without re-deriving the whole list.

| Left off | From | Reason |
| --- | --- | --- |
| `chicken-noodle-soup`, `matzo-ball-soup`, `chana-masala`, `dal-tadka`, `biryani`, `mujaddara`, `corned-beef-hash`, `beef-with-broccoli` | One Pot | a second pot of water, drained — the colander case, found by reading |
| `birria-de-res`, `beef-rendang`, `dansak`, `red-braised-pork-belly`, `palak-paneer`, `mushroom-risotto`, `suadero`, `lengua`, `tripas`, `caldo-verde` | One Pot | two cooking vessels declared |
| `jollof-rice`, `mexican-red-rice`, `korma`, `patia`, `karahi`, `thai-green-curry`, `pad-krapow`, `corn-chowder` | One Pot | a jug blender, processor or mortar — a second bowl to wash |
| `butter-chicken`, `chicken-tikka-masala` | One Pot | the protein is broiled or grilled off the pan the sauce is made in |
| `rice-pilaf`, `lemon-rice`, `coconut-rice`, `yellow-rice`, `pilau-rice`, `polenta`, `cheese-grits`, `refried-beans` | One Pot | an accompaniment, not a dinner — no section on this menu is for a side |
| `fried-okra`, `stewed-squash`, `creamed-corn`, `green-beans`, `home-fries`, `hash-browns`, `breakfast-sausage-patties`, `creamed-chipped-beef`, `collard-greens`, `chashu` | One Pot | ditto: a side, a breakfast component or a ramen topping, not a skillet dinner |
| `hot-and-sour-soup`, `tomato-soup`, `butternut-squash-soup`, `potato-leek-soup`, `red-lentil-soup`, `cream-of-mushroom-soup`, `french-onion-soup` | One Pot | a first course; the section is *soups that are the whole meal* |
| `macaroni-and-cheese`, `tuna-noodle-casserole`, `bolognese` | One Pot | the gap note's own "Also here" — and there is no "Also here" on this menu |
| `chopped-liver`, `cream-cheese`, `scallion-schmear`, `pork-liver-pate` | Bowl Shop dressings | a deli spread for bread, not a drizzle over a bowl (two named by the ticket itself) |
| `sour-dill-pickles`, `do-chua`, `guacamole`, `birista`, `labneh`, `paneer`, `queso-fresco` | Bowl Shop dressings | a topping, not a dressing — all shelved under *What goes on top* instead |
| `coleslaw`, `barbecue-slaw` | Bowl Shop dressings | a dressed salad, and a deli-case one |
| `lime-pickle`, `mango-chutney` | Bowl Shop dressings | a preserve eaten with curry |
| `mayonnaise` | Bowl Shop dressings | an ingredient of six of the dressings above, not a line on a board |
| `potato-salad`, `macaroni-salad`, `chicken-salad`, `egg-salad`, `tuna-salad`, `whitefish-salad` | Bowl Shop leafy salads | the deli case by the pound — the shape the story says this counter exists to *contrast* |
| `green-beans`, `stewed-squash`, `creamed-corn`, `mashed-potatoes`, `collard-greens`, `fried-okra`, `candied-yams`, `ratatouille` | Bowl Shop roasted vegetables | not roasted. Filing a creamed corn under *Roasted vegetables* makes the section look filled when it is not — T-002-07's own argument against `candied-yams`, applied to its whole list |

---

## 6. `docs/gaps/*.md` — the edit, per file

Each of the three loses its `## What is already here` preamble paragraph (the one that explains
the heading is not `## What it has` yet) and gains the real heading. The `**Title.** slug · slug`
line shape is already correct and the section titles must match T-002-01's `counters.json` titles
exactly, because the JSON's order and names come from these lines.

- **`one-pot.md`** — four `**…**` lines, filtered per §4.1 and §5, plus the 14 new files folded
  into the section each belongs in. The `**Also here.**` line is **deleted**; its five slugs are
  in §5's table with reasons. The opening "0 recipes" line becomes the real count.
- **`bowl-shop.md`** — six `**…**` lines. *Grain bowls* is rewritten to the twelve assembled
  bowls (the pre-existing rice dishes it listed are bases, not bowls, and are named in the
  file's own prose instead). *Dressings and drizzles* is cut to the 24. The `**Also here.**`
  line is deleted.
- **`instant-pot.md`** — five `**…**` lines, every slug replaced with its `-instant-pot`
  variant. `**Also here.**` deleted. The ranked "what it is missing" list stays as it is: it is
  still an accurate account of what the shelf does not have.

---

## 7. `src/data/aisles.json` — the edit

Patterns only, appended to the aisle each thing is actually sold in. No new aisle; no `packs[]`
entry. Grouped by destination:

- **Produce** — `burdock root`, `lotus root`, `kabocha`, `radicchio`, `snow pears`,
  `hairy gourd`, `amaranth`, `yuca`
- **World foods** — `abura-age`, `konnyaku`, `ito konnyaku`, `dried hijiki`, `laver`,
  `job's tears`, `raw job's tears`, `toasted job's tears`, `dried lily bulb`, `fox nut`,
  `aged tangerine peel`, `apricot kernels`, `Solomon's seal`, `adenophora root`,
  `dried overlord flower`, `goma dare`, `teriyaki sauce`
- **Fishmonger** — `yellowtail fillets`, `yellowtail collar`, `crucian carp`
- **Spice rack** — `filé powder`, `taco seasoning`
- **Tins & jars** — `pepperoncini`
- **Oils & vinegars** — `basic vinaigrette`, `ranch dressing`, `caesar dressing`
- **Left unplaced, deliberately** — `flat skewers`, `metal skewers`, `oak or hickory wood`

Every pattern is multi-word or unambiguous. Each is added, then the whole suite is re-run: the
hazard is not the new name failing to match, it is an old name silently changing aisle because a
new pattern outranked its old one. The check is a **before/after diff of `aisleFor()` across all
1082 names**, not just the failing count.

---

## 8. Commit boundaries

Five units, each independently verifiable, each through `lisa commit-ticket` with exact
`--include` paths:

1. **The One Pot membership lines** — 58 `.cook` files. Verify: `npm run recipes` clean,
   72 recipes name One Pot.
2. **The Bowl Shop membership lines** — 61 further `.cook` files. Verify: 103 name it.
3. **The three gap notes + `counters.json`** — the notes and the generated JSON in one commit,
   because they must not diverge. Verify: `menu-sections.mjs` dry run reports `0 counter(s) need
   a look` for the three; the other 18 unchanged.
4. **`aisles.json`** — verify: `npx vitest run` green, and the before/after aisle diff shows only
   `other` → real moves.
5. Work artifacts are published by Lisa, not committed here.
