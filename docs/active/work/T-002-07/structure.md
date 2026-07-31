# T-002-07 — Structure

Twelve new files, no file modified. The blueprint below fixes each file's path, metadata, step
sequence, reference edges and expected table shape, so Implement is transcription plus prose.

## 1. Files created

```
recipes/smoked-and-grilled/pulled-roast-chicken.cook        new
recipes/smoked-and-grilled/blackened-salmon.cook            new
recipes/fried-and-crispy/crispy-chickpeas.cook              new
recipes/fried-and-crispy/crisped-marinated-tofu.cook        new
recipes/fried-and-crispy/seared-halloumi.cook               new
recipes/eggs/seven-minute-eggs.cook                         new
recipes/vegetables-and-sides/roasted-sweet-potatoes.cook    new
recipes/vegetables-and-sides/charred-broccoli.cook          new
recipes/vegetables-and-sides/roasted-cauliflower.cook       new
recipes/vegetables-and-sides/roasted-brussels-sprouts.cook  new
recipes/vegetables-and-sides/roasted-beets.cook             new
recipes/vegetables-and-sides/crispy-roast-potatoes.cook     new
```

Files **modified**: none. Files **deleted**: none. Nothing outside `recipes/**` is touched — no
`counters.json`, no gap note, no test.

All twelve slugs were checked against the tree: none exists in any folder, so the unique-slug
invariant (`collection.test.ts`) holds.

## 2. The metadata block, per file

Every file carries, in this order: `title`, `category`, `tags`, `counters`, `aka`, `pairs-with`,
`servings`, `time`, then the `step.N` overrides. `slack` appears on the four files named in
Design §7 and nowhere else.

| Slug | category | counters | pairs-with (all verified present today) |
| --- | --- | --- | --- |
| `pulled-roast-chicken` | Smoked & Grilled | The Bowl Shop | `mujaddara`, `tahini-sauce`, `basic-vinaigrette` |
| `blackened-salmon` | Smoked & Grilled | The Bowl Shop | `lemon-rice`, `cheese-grits` |
| `crispy-chickpeas` | Fried & Crispy | The Bowl Shop | `tahini-sauce`, `tabbouleh` |
| `crisped-marinated-tofu` | Fried & Crispy | The Bowl Shop | `coconut-rice`, `miso-ginger-dressing` |
| `seared-halloumi` | Fried & Crispy | The Bowl Shop | `tabbouleh`, `hummus` |
| `seven-minute-eggs` | Eggs | The Bowl Shop | `mujaddara`, `harissa` |
| `roasted-sweet-potatoes` | Vegetables & Sides | The Bowl Shop | `rice-pilaf`, `tahini-sauce` |
| `charred-broccoli` | Vegetables & Sides | The Bowl Shop | `lemon-rice`, `romesco` |
| `roasted-cauliflower` | Vegetables & Sides | The Bowl Shop | `tahini-sauce`, `zaatar` |
| `roasted-brussels-sprouts` | Vegetables & Sides | The Bowl Shop | `polenta`, `basic-vinaigrette` |
| `roasted-beets` | Vegetables & Sides | The Bowl Shop | `green-goddess-dressing`, `tabbouleh` |
| `crispy-roast-potatoes` | Vegetables & Sides | The Bowl Shop | `chimichurri`, `toum` |

`pairs-with` is made mutual at build time, so writing one side edits nothing — which is how the
"no pre-existing file is edited" criterion survives having pairings at all.

## 3. Reference discipline

**Relative references only — `@&(~n)`, never `@&(N)`.** `green-beans.cook` mixes both and the
absolute form's base is ambiguous when a prose-only step is present. `~n` counts every step
including prose, which is well defined and is what `README.md:104-111` documents. Every merge
below is written as `@&(~1)` plus `@&(~2)`, which means the two branches must be the two steps
immediately preceding the merge. Each file's step order is arranged so that is true.

**Prose placement.** Files with an epigraph put it as step 1 and repeat it verbatim in
`>> step.1:`, following `ajitama` and `green-beans`. No file has prose between operations.

**One root.** Every file's last step consumes everything still open.

## 4. Per-file blueprint

Notation: `s1 … sN` are steps as written. `→ ~1` is the reference that step carries.
"cols" is the expected `colCount` (root column); "rows" is the ingredient-leaf count. The floors
are rows ≥ 3 and cols ≥ 3 (`check-recipes.mjs:70-72`).

### 4.1 `pulled-roast-chicken` — 4 ops, ~6 rows, 5 cols

| Step | Consumes | Ingredients / cookware | Timer |
| --- | --- | --- | --- |
| s1 dry-brine uncovered | — | chicken thighs, kosher salt | `~chill{12%hr}` |
| s2 roast on a hot sheet | `~1` | olive oil, black pepper, `#sheet pan{}` | `~roast{35%min}` |
| s3 rest | `~1` | — | `~rest{15%min}` |
| s4 pull into the juices | `~1` | lemon juice, extra-virgin olive oil | — |

The point of the file is s3→s4: the meat is pulled warm, back into what came out of it. A step
with a reference and no ingredients (s3) is a normal operation cell, not a full-width row.

### 4.2 `blackened-salmon` — 5 ops, ~10 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 stir the blackening spice | — | paprika, garlic powder, onion powder, dried thyme, cayenne, black pepper, kosher salt | — |
| s2 dry the fillets uncovered | — | salmon fillets | `~dry{20%min}` |
| s3 butter, then press into the spice | `~1` + `~2` | melted butter | — |
| s4 sear in a smoking dry skillet | `~1` | `#cast-iron skillet{}` | `~sear{3%min}` |
| s5 rest and squeeze lemon | `~1` | lemon | `~rest{3%min}` |

s3 is the merge: `~1` is s2 (dried fillets), `~2` is s1 (spice). Branch order matters and is fixed
here. `slack: narrow`.

### 4.3 `crispy-chickpeas` — 4 ops, ~6 rows, 4 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 dry until they squeak | — | cooked chickpeas | `~dry{20%min}` |
| s2 roast naked | `~1` | olive oil, `#oven{}` | `~roast{35%min}` |
| s3 stir the spice | — | smoked paprika, ground cumin, cayenne, kosher salt | — |
| s4 toss hot, off the sheet | `~2` + `~1` | — | — |

The argument of the file is s3 existing at all: the spice is mixed while the chickpeas roast and
meets them after the oven, because paprika and cumin carbonise in thirty-five minutes at 200 °C.
`slack: narrow`.

### 4.4 `crisped-marinated-tofu` — 5 ops, ~11 rows, 6 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 press under a weight | — | extra-firm tofu | `~press{30%min}` |
| s2 marinate the cubes | `~1` | soy sauce, maple syrup, rice vinegar, garlic, ginger | `~marinate{20%min}` |
| s3 toss in cornstarch | `~1` | cornstarch | — |
| s4 crisp undisturbed, face by face | `~1` | neutral oil, `#skillet{}` | `~fry{10%min}` |
| s5 finish off the heat | `~1` | toasted sesame oil, sesame seeds, scallions | — |

No ingredient appears twice, so no leaf is duplicated: the marinade and the finish share nothing.

### 4.5 `seared-halloumi` — 4 ops, ~5 rows, 4 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 rinse the brine, dry hard | — | halloumi | — |
| s2 sear in a dry pan | `~1` | `#skillet{}` | `~sear{90%sec}` |
| s3 stir the hot honey | — | honey, lemon juice, red chile flakes, dried oregano | — |
| s4 spoon over, serve now | `~2` + `~1` | — | — |

`slack: unforgiving`. The unit `sec` is in `PER_MINUTE` (`time.ts:11`), so `90%sec` resolves to 1.5
minutes.

### 4.6 `seven-minute-eggs` — 4 ops, ~5 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 lower fridge-cold eggs into boiling water | — | eggs, water | `~boil{7%min}` |
| s2 ice bath | `~1` | ice water | `~cool{5%min}` |
| s3 peel under the tap | `~1` | — | — |
| s4 halve and season | `~1` | flaky salt, black pepper | — |

`slack: unforgiving`. The file's job is to state the difference from `ajitama` outright — 7:00 for
an egg eaten within the hour, 6:30 for one that spends a night in soy.

### 4.7 `roasted-sweet-potatoes` — 5 ops, ~7 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 *(prose header)* the pan is already 450 °F | — | — | — |
| s2 toss the half-moons | — | sweet potatoes, olive oil, kosher salt | — |
| s3 roast cut-side down, not moved | `~1` | `#sheet pan{}` | `~roast{20%min}` |
| s4 turn and finish | `~1` | — | `~roast{10%min}` |
| s5 stir the glaze | — | maple syrup, lime juice, red chile flakes, flaky salt | — |
| s6 toss on the hot pan | `~2` + `~1` | — | — |

s1 is a step with no ingredients and no references, before the first real step, so it renders as a
full-width header row. It still counts for `~n`, and every reference here is written accordingly.

### 4.8 `charred-broccoli` — 5 ops, ~8 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 *(prose header)* 500 °F, bone dry, a hand's width apart | — | — | — |
| s2 cut into spears with a flat face and dry | — | broccoli | `~dry{10%min}` |
| s3 toss | `~1` | olive oil, kosher salt | — |
| s4 roast cut-face down, spaced | `~1` | `#sheet pan{}` | `~roast{14%min}` |
| s5 stir the lemon-garlic oil | — | garlic, lemon zest, lemon juice, extra-virgin olive oil, red chile flakes | — |
| s6 toss off the sheet | `~2` + `~1` | — | — |

### 4.9 `roasted-cauliflower` — 4 ops, ~7 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 halve through the core, cut slabs | — | cauliflower | — |
| s2 toss with the spice | `~1` | olive oil, kosher salt, ground cumin, ground coriander | — |
| s3 roast flat-face down, then turn | `~1` | `#sheet pan{}` | `~roast{25%min}`, `~roast{8%min}` |
| s4 finish | `~1` | lemon juice, flat-leaf parsley | — |

Deliberately linear and glaze-free, so the six vegetables are not one table six times.

### 4.10 `roasted-brussels-sprouts` — 5 ops, ~7 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 trim and halve, loose leaves left on | — | Brussels sprouts | — |
| s2 toss | `~1` | olive oil, kosher salt, black pepper | — |
| s3 roast cut-side down on a preheated sheet | `~1` | `#sheet pan{}` | `~roast{22%min}` |
| s4 simmer the balsamic to a syrup | — | balsamic vinegar, honey | `~simmer{4%min}` |
| s5 toss off the heat | `~2` + `~1` | flaky salt | — |

The late glaze is the file's whole argument and it is stated as such: balsamic on the sheet for
twenty-two minutes at 220 °C is soot, not glaze.

### 4.11 `roasted-beets` — 5 ops, ~8 rows, 6 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 scrub, into a dish with water, covered | — | beets, water, olive oil | — |
| s2 roast covered | `~1` | `#oven{}` | `~roast{60%min}` |
| s3 rub the skins off hot, under a towel | `~1` | — | — |
| s4 dress while hot | `~1` | red wine vinegar, kosher salt, extra-virgin olive oil | — |
| s5 stand, then fold in the herbs | `~1` | dill, orange zest | `~stand{15%min}` |

This is the file that is not roasting at all in the first half — foil plus water is steaming — and
it says so.

### 4.12 `crispy-roast-potatoes` — 5 ops, ~7 rows, 5 cols

| Step | Consumes | Ingredients | Timer |
| --- | --- | --- | --- |
| s1 parboil to just-yielding | — | Yukon Gold potatoes, water, kosher salt, baking soda | `~simmer{8%min}` |
| s2 drain and shake hard in the dry pan | `~1` | — | `~dry{5%min}` |
| s3 heat the fat on the pan until it shimmers | — | duck fat, `#sheet pan{}` | — |
| s4 roll in the hot fat and roast | `~2` + `~1` | — | `~roast{45%min}` |
| s5 salt and scatter rosemary | `~1` | flaky salt, rosemary | — |

Baking soda is in the parboil on purpose and the step says why: alkaline water breaks down the
outside of the potato so the shake in s2 raises a paste that fries to glass.

## 5. Timer vocabulary used, and how each reads

Checked against `src/lib/time.ts`:

- `UNATTENDED` by name: `chill`, `roast`, `rest`, `dry`, `marinate`, `press`, `boil`, `cool`,
  `simmer`, `stand`. All used for waits a cook can genuinely leave.
- `HANDS_ON` by name: `sear`, `fry`. Both used where the cook is at the pan.
- Nothing unrecognised is used, so no timer falls through to reading its label.
- No file claims anywhere near 240 unbroken hands-on minutes; the longest hands-on timer in the
  set is `~fry{10%min}`.

## 6. Ordering of the work

Two independent halves — the six proteins touch four folders, the six vegetables touch one, and
no file references another. Order chosen for review, not for dependency:

1. The six roasted vegetables, because the section is empty and it is the ticket's harder half.
2. The six proteins.
3. Work artifacts.

Each half is a commit; a file that fails `check-recipes.mjs` is fixed before its half is committed.

## 7. What Implement must not do

- Not edit any of the six existing files in `recipes/vegetables-and-sides/`, nor any other
  pre-existing file, for any reason including adding a reciprocal `pairs-with`.
- Not run ordinary `git add` / `git commit`; only `lisa commit-ticket --include <exact paths>`.
- Not touch `docs/gaps/bowl-shop.md`, `src/data/counters.json` or `docs/gaps/README.md`, all of
  which would be the natural next edit and all of which belong to T-002-08.
- Not leave `src/generated/` staged — it is uncommitted by design and `parse-recipes.mjs` writes
  it.
