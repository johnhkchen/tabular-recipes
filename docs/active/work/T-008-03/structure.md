# T-008-03 — Structure

No file is created, deleted, moved or renamed in `src/`, `scripts/`, `docs/gaps/` or
`src/data/`. **The only source change this ticket makes is one added line per `.cook` file.**

---

## 1. The change, exactly

Each annotated file gains **one line and nothing else**:

```
>> washing-up: <thing>, <thing>, …
```

or, for a recipe that genuinely washes nothing:

```
>> washing-up: nothing
```

**Placement:** last line of the metadata block — immediately after `>> slack:` where the file has
one, otherwise after the last `>> ` line before the blank line that opens the steps. This matches
all eleven files T-008-01 annotated and keeps the diff to a single added line with no context
churn.

**Nothing else in the file moves.** Not a step, not a `#thing{}`, not a `>> time:`, not
whitespace. The verification for this is mechanical and is in Plan §5: `git diff` filtered to
removed lines must be empty, and added lines must all start with `>> washing-up:`.

## 2. Files modified — the pinned list

**151 in the pool, 6 already annotated by T-008-01, 145 to write.** Pinned from the tree as it
stands at the start of Implement. Any `.cook` file that appears after this point belongs to
T-008-04 and is not touched.

### Batch 1 — One Pot (73 files, 69 to write)

- `recipes/eggs/` — shakshuka *(done)*, tortilla-espanola, western-omelette
- `recipes/fried-and-crispy/` — country-fried-steak
- `recipes/noodles/` — beef-stroganoff
- `recipes/pasta/` — one-pot-pasta *(done)*, skillet-lasagna
- `recipes/rice-beans-and-grains/` — arroz-con-pollo, black-eyed-peas, butter-beans,
  cuban-black-beans, dirty-rice, hoppin-john, jambalaya, kitchari, paella, risotto-alla-milanese
- `recipes/soups/` — black-bean-soup, borscht, century-egg-amaranth-soup, congee,
  crucian-carp-tofu-soup, gumbo, harira, minestrone, mustard-greens-tofu-soup,
  new-england-clam-chowder, sancocho, seaweed-egg-drop-soup, split-pea-soup,
  tomato-potato-beef-soup, wonton-soup
- `recipes/stews-and-braises/` — balti, beef-bourguignon *(done)*, beef-stew, bhuna,
  braised-short-ribs, brunswick-stew, cachete, carnitas, chicken-adobo, chicken-and-dumplings,
  chicken-cacciatore, chile-verde, chili-con-carne, coq-au-vin, dopiaza, doro-wat,
  hungarian-goulash, irish-stew, jalfrezi, japanese-beef-curry, lamb-tagine, madras,
  massaman-curry, new-england-boiled-dinner, osso-buco, oxtails, panang-curry, passanda,
  pot-roast, ratatouille *(done)*, rogan-josh, sausage-and-peppers, smothered-pork-chops,
  soy-sauce-chicken, thai-red-curry, thai-yellow-curry, tinga-de-pollo, vindaloo,
  white-cut-chicken, xiu-mai
- `recipes/stir-fries/` — egg-foo-young

### Batch 2 — Instant Pot (25 files, 23 to write)

- `recipes/rice-beans-and-grains/` — boston-baked-beans-instant-pot,
  cuban-black-beans-instant-pot, ful-medames-instant-pot, gigantes-plaki-instant-pot,
  refried-beans-instant-pot
- `recipes/soups/` — borscht-instant-pot, chicken-broth-instant-pot, chintan-broth-instant-pot,
  congee-instant-pot, ham-hock-stock-instant-pot, pho-broth-instant-pot *(done)*,
  tonkotsu-broth-instant-pot
- `recipes/stews-and-braises/` — beef-bourguignon-instant-pot *(done)*, beef-stew-instant-pot,
  birria-de-res-instant-pot, braised-short-ribs-instant-pot, cachete-instant-pot,
  carnitas-instant-pot, chile-verde-instant-pot, chili-con-carne-instant-pot,
  collard-greens-instant-pot, corned-beef-instant-pot, hungarian-goulash-instant-pot,
  oxtails-instant-pot, pot-roast-instant-pot

### Batch 3 — The Slow Cooker (20 files, all to write)

- `recipes/rice-beans-and-grains/` — boston-baked-beans-slow-cooker
- `recipes/stews-and-braises/` — baked-turkey-wings-slow-cooker, beef-stew-slow-cooker,
  birria-de-res-slow-cooker, braised-short-ribs-slow-cooker, brunswick-stew-slow-cooker,
  cachete-slow-cooker, carnitas-slow-cooker, chile-verde-slow-cooker, chili-con-carne-slow-cooker,
  collard-greens-slow-cooker, corned-beef-slow-cooker, hungarian-goulash-slow-cooker,
  irish-stew-slow-cooker, lamb-tagine-slow-cooker, new-england-boiled-dinner-slow-cooker,
  osso-buco-slow-cooker, oxtails-slow-cooker, pot-roast-slow-cooker, soy-sauce-chicken-slow-cooker

### Batch 4 — air-fryer gap candidates (20 files, all to write)

- `recipes/eggs/` — seven-minute-eggs
- `recipes/fried-and-crispy/` — batata-harra, crisped-marinated-tofu, crispy-chickpeas,
  french-fries, seared-halloumi
- `recipes/rice-beans-and-grains/` — gohan, mujaddara, polenta
- `recipes/smoked-and-grilled/` — blackened-salmon, chicken-tikka, saba-shioyaki, seekh-kabab,
  shish-tawook
- `recipes/soups/` — red-lentil-soup
- `recipes/vegetables-and-sides/` — charred-broccoli, crispy-roast-potatoes, roasted-brussels-sprouts,
  roasted-cauliflower, roasted-sweet-potatoes

### Batch 5 — plain siblings of pool `kit:` files (13 files, all to write)

- `recipes/rice-beans-and-grains/` — boston-baked-beans, ful-medames, gigantes-plaki, refried-beans
- `recipes/soups/` — chicken-broth, chintan-broth, ham-hock-stock, pho-broth, tonkotsu-broth
- `recipes/stews-and-braises/` — baked-turkey-wings, birria-de-res, collard-greens, corned-beef

## 3. Work artifacts created

All under `.lisa/attempts/T-008-03/1/work/`, published by Lisa to
`docs/active/work/T-008-03/`:

| File | Contents |
| --- | --- |
| `research.md` | done |
| `design.md` | done — carries the convention |
| `structure.md` | this file |
| `plan.md` | the ordered steps and the verification |
| `progress.md` | every line written, with its count, plus the deviations |
| `findings.md` | **the three findings the ticket asks for, plus the gate count and the cross-check output** |
| `review.md` | the handoff |
| `review-disposition.json` | `{"disposition":…}` |

**`findings.md` is a sixth artifact beyond the RDSPI set, and it is deliberate.** Seven of the
eleven acceptance criteria are *reports*, not code: the One Pot ≥3 ranking, the Instant Pot
browning list, the plain-versus-kit table, the gate count, the cross-check paste, the convention
restatement and the uncountable list. Putting them in `progress.md` would bury them under 145 rows
of annotation; putting them in `review.md` would make the handoff document the primary evidence.
They get their own file and `review.md` points at it.

## 4. The insertion mechanism

Lines are inserted by a **scratchpad script**, not by 145 hand edits:

- Input: a JSON map of `slug → line`, written by hand as each batch is read.
- The script locates the file by slug from `src/generated/recipes.json`, finds the last `>> `
  line before the first blank line, and inserts after it.
- It **refuses** to write a file that already has a `>> washing-up:` line, so the six T-008-01
  files and any re-run are safe.
- It lives in the scratchpad (`/private/tmp/claude-501/…/annotate.mjs`) and is **never committed** —
  it is not a ticket-owned source unit and `scripts/` is not this ticket's to add to.

The reading that produces each line is the human part and is not automated. The script only moves
a decided string into a decided position.

## 5. Ordering that matters

1. **Read `src/lib/washing-up.test.ts`'s collection assertions before writing anything.** Done in
   Research §7: no assertion pins the undeclared count, so 145 new lines break nothing.
2. **Batch 5 (siblings) must land before the plain-versus-kit table is written**, since it supplies
   thirteen of that table's rows.
3. **`npm run recipes` after every batch**, because a malformed line is a build error and finding
   it inside a 20-file batch is cheaper than at the end of 145.
4. **The cross-check (`npm run check`) is run last, over the whole collection**, and its output is
   pasted verbatim. Running it per batch would produce five partial pastes and no total.
5. **The gate count is computed after all five batches**, because bar 1 is only readable once every
   pool recipe has an answer.

## 6. What the boundary excludes, restated as paths

| Path | Why it is not touched |
| --- | --- |
| `src/**` | T-008-01 owns the mechanism; nothing here needs a code change |
| `src/data/counters.json` | re-shelving is a counter decision and is not this ticket's |
| `docs/gaps/**` | the findings belong in the work artifact; the gap pages are somebody else's edit |
| `scripts/**` | the insertion script is scratchpad-only |
| `README.md` | the authoring contract already covers this field |
| `docs/knowledge/**` | outside the permitted paths, and the cap deferral T-008-01 recorded is still open there |
| new `recipes/**/*.cook` from T-008-04 | they arrive with the line already on them |
