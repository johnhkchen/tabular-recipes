# T-001-18 — Review

Read the whole shelf, fix what only shows up from there. 93 files changed across eight
commits, no file created and no file deleted.

---

## 1. The recipe count per counter, before and after this story

The criterion the ticket asks this artifact for. "Before" is the state `docs/gaps/README.md`
recorded when S-001 opened — 241 recipes, 311 assignments. "After" is the shelf as it stands at
`d0c44fd`. Both are counts of *assignments*, so a recipe at two counters is counted twice.

| Counter | Before | After | Change | Only here, after |
| --- | --: | --: | --: | --: |
| Bakery | 91 | 107 | +16 | 63 |
| Diner | 43 | 77 | +34 | 35 |
| Deli | 38 | 62 | +24 | 24 |
| Meat and Three | 23 | 53 | +30 | 27 |
| Curry House | 15 | 47 | +32 | 47 |
| Shawarma Counter | 21 | 44 | +23 | 36 |
| Taquería | 17 | 34 | +17 | 25 |
| Pizzeria | 22 | 32 | +10 | 26 |
| Panadería | 8 | 30 | +22 | 17 |
| Dim Sum Counter | 7 | 30 | +23 | 20 |
| Ramen Shop | 10 | 27 | +17 | 26 |
| Thai Kitchen | 5 | 21 | +16 | 21 |
| Smokehouse | 5 | 21 | +16 | 14 |
| Takeout Counter | 5 | 20 | +15 | 15 |
| Phở & Bánh Mì | 1 | 18 | +17 | 16 |
| **Total** | **311** | **623** | **+312** | **412** |

Recipes: **241 → 514**. Categories: **12 → 27**. Only-here: **171 → 412**.

Five of the +312 are this ticket's own: `country-fried-steak`, `cream-gravy`, `meatloaf` and
`tuna-salad` gained `Diner`; `rice-pudding` gained `Taquería`. Every other one was written by
the sixteen counter tickets.

The two numbers the old tally called "the story on their own" are both closed. **Panadería had
no recipe of its own** — it has seventeen. **Phở & Bánh Mì had one recipe** — it has eighteen,
sixteen of them only there.

---

## 2. Acceptance criteria

| Criterion | Status |
| --- | --- |
| `ls recipes/*/*.cook \| xargs -n1 basename \| sort \| uniq -d` is empty | ✅ empty; `parse-recipes.mjs` and `collection.test.ts` both enforce it |
| No dish appears twice under two names | ✅ none found — evidence in §3. The removal clause did not fire |
| The recorded hand-offs are applied | ✅ six edits applied, three open questions answered — §4 |
| Tag vocabulary is one vocabulary | ✅ 24 concepts folded across 51 files, 527 → 503 distinct tags, collision check `[]` |
| `npm run verify` passes end to end | ✅ 514 draw · 514 parse · 666 tests · 532 pages built |
| `docs/gaps/` rewritten; README tally matches reality | ✅ 16 files; the tally is computed, not typed — §5 |
| Review states the recipe count per counter, before and after | ✅ §1 |

---

## 3. "No dish appears twice under two names"

The criterion carries a remedy — *"the weaker file is removed and its counters are merged into
the survivor"* — and it did not fire, so the evidence matters more than usual.

**Three independent scans, all negative:**

- **Ingredient-set Jaccard ≥ 0.6** over all 131,841 pairs: 72 hits, every one a family
  resemblance. The two closest are `salsa-verde` / `salsa-verde-cruda` (0.88) and
  `general-tsos-chicken` / `sesame-chicken` (0.88) — cooked versus raw, and the Takeout gap
  doc's own words, *"the same fried chicken under two other glazes"*. Both are argued in their
  own tickets and both were left alone.
- **Title-plus-`aka` name-set overlap.** Top pair `tzatziki` / `white-sauce` at 0.36. Not one
  dish: Greek yogurt, cucumber, dill, drained, versus halal-cart mayonnaise, yogurt, vinegar,
  oregano. What they shared was `aka`, which is §3b.
- **`dish:` keys.** `collection.test.ts`'s "leave at most one plain way to cook a dish" passes.

The one true collision this story produced — `potato-salad`, written by both T-001-13 and
T-001-14 — was resolved inside T-001-13 by withdrawal before this ticket started. The Deli's
copy survived and already carried both counters, so there was nothing left to merge.

### 3b. What the scan did find: 26 names claimed by two recipes

The same failure one level down — one dish name, two tables answering to it. A searcher typing
"tzatziki" got the halal-cart white sauce beside the tzatziki. Graded three ways; the first two
were fixed:

| Fixed | Was | Now |
| --- | --- | --- |
| `white-sauce` | claimed `tzatziki`, `taziki`, `yogurt sauce`, `garlic sauce` | none of them |
| `tzatziki` | claimed `white sauce` | keeps `yogurt sauce` alone |
| `tahini-sauce`, `toum` | both claimed `white sauce` | *white sauce* now returns 2 dishes, not 5 |
| `marinara-sauce` | `red sauce, pizza sauce, Sunday gravy` | `red sauce, tomato sauce, salsa marinara` |
| `pilau-rice` | claimed `yellow rice`, `pilaf rice` | `yellow rice` → `yellow-rice` alone |
| `rice-pilaf` | claimed `pilau` | `pilau` → `pilau-rice` alone |
| `chintan-broth` | claimed `clear chicken broth` | → `chicken-broth` alone; keeps `clear ramen broth` |

**Left alone on purpose**, and recorded here rather than deleted: `madras` (the blend and the
curry), `tonkotsu` (the broth and the bowl), `vindalho`, `gaeng ped`, `roast pork` (carnitas and
char siu), `rice pudding` (kheer and rice-pudding), `number 1` (a bánh mì and a phở), `egg
rolls` (`egg-rolls` and `cha-gio`), `sambusa` (`sambousek` and `samosa`). A real board prints
both halves of each of these, and `aka` exists to catch the word a customer remembers. Deleting
them would make the search worse.

---

## 4. The recorded hand-offs

Every `docs/active/work/T-001-*/` artifact was read. Eleven of sixteen tickets recorded
something; five recorded an explicit no-op.

**Applied (6):** `country-fried-steak`, `cream-gravy`, `meatloaf`, `tuna-salad` → `Diner`
(T-001-15 §1–4). `rice-pudding` → `Taquería`, gap item 22, *arroz con leche* (T-001-10 §1).
`marinara-sauce`'s `aka` rewritten to T-001-12's own suggestion.

**Questions answered rather than passed on again:**

- *Should `mayonnaise` also name Phở & Bánh Mì?* (T-001-02) — **No.** The gap doc's instruction
  was "pair to it and note the difference", `banh-mi-dac-biet` does exactly that, and the house
  mayonnaise on a bánh mì is a yolk-heavier sauce than the deli tub.
- *Should `dashi` and `gyoza` be shelved wider?* (T-001-08 §4) — **No, to both.** `dashi` is a
  Japanese pantry stock and no other counter here is Japanese. A dim sum counter does sell a
  pan-fried dumpling, but it sells **wor tip**, not gyoza — a different wrapper, a different
  fold, a different name on the board. `wor tip` is now a missing dish on
  `docs/gaps/dim-sum-counter.md`, which is the honest reading of what T-001-08 spotted.
- *The icon verbs* (T-001-03 §1, T-001-06, T-001-07, T-001-14) — all folded into §6.

**Recorded but not actionable as a file edit**, carried into `docs/gaps/README.md` §Recorded and
not done so the next pass starts from them: the shared toasted dried-chile purée under four
Mexican files (T-001-10 §2), `chana-masala` deriving its own masala base (T-001-09 §5),
`okonomiyaki` buying its sauce and `japanese-beef-curry` making roux inline (T-001-08 §3), the
three Thai files with unnamed timers and the `makrut`/`kaffir` split (T-001-03 §4–5),
`thai-green-curry-paste` overlapping the curry's step 1 (T-001-03 §3), `naan` not declaring
which naan it is (T-001-09 §6), and the undocumented `>> step.N:` counting rule (T-001-08 §5).

**Three of T-001-01's "wanted by two counters and owned by nobody" components turned out to be
written** by the tickets that came after it: `whipped-cream` (Bakery and Diner) and
`chicken-broth` (Deli and Takeout). Only **pickled mustard green** is still unowned. Recorded.

---

## 5. `npm run verify`, and the three tests

Red before this ticket, at `f86f437`, and red at every ticket since T-001-06. Green now.

```
all 514 file(s) draw a table.
parsed 514 recipe(s) in 27 categories -> src/generated/recipes.json
 Test Files  7 passed (7)
      Tests  666 passed (666)
[build] 532 page(s) built in 505ms
```

### 5a. `schedule.test.ts` — two failures, two data defects and one over-pinned test

**The data defects were real and were the point.** `ginger-garlic-paste` wrote its *shelf life*
as a timer — `~chill{3%weeks}` on a fifteen-minute paste — which put a 21-day edge on the
critical path and made a jar of blended ginger the third-longest recipe on the site. It was
also the whole of the 2015× author-drift failure that four tickets reported and none could
reach. `lime-pickle` claimed 15 days against two seven-day waits. Both fixed in the files; the
keeping time is now prose, which is where it belongs.

**The assertion.** It named three slugs from a 241-recipe collection and had been wrong since
T-001-01 — `pizza-dough` → `crema-mexicana` → `lime-pickle` → `ginger-garlic-paste` →
`sauerkraut`, a different wrong trio at nearly every ticket. Four separate reviews (T-001-01,
T-001-04, T-001-14, T-001-16) recorded the same remedy, and T-001-17 named this ticket as the
owner. It now asserts the property the slugs stood for: over a week long, >99% of the critical
path unattended, six tasks or fewer, and every task over an hour carrying a timer the author
named. The three current names are in a comment above it.

**It has teeth**: widened to the top twelve it fails at #4 (`pastrami`, 5.4 days).

### 5b. `icons.test.ts` — 54 fall-through "verbs", and only 26 of them were verbs

The test built its corpus from **every step**, including the ingredient-less prose steps that
render as full-width rows. Their first word is a sentence's first word, which is how `a`, `the`,
`these`, `printed`, `everything` and `unripe` came to be reported as verbs the icon map was
missing. Measured against `layout()`: 2672 step labels → 54; 2429 real operation cells → 26.

Narrowed the corpus to `kind === 'op'` cells, which is what the page actually calls
`iconForOperation` with and what the test's own docstring already claimed. 54 → 26.

Of the 26, **19 were genuine cook's verbs** — `clarify the butter`, `wring the onion dry`,
`crack the cream`, `bruise in`, `thread the skewers` — and went into `VERB_ICONS`. 26 → 7.

The last 7 were the Ramen Shop's assembly shorthand and one broth adjective: `tare in`,
`noodles in`, `broth in`, `corn and butter last`, `sprouts and aromatics in`, `aromatics and
kombu for the last 30 min`, `hard rolling boil 8 hr`. Those were reworded to open with the
operation — `spoon the tare in`, `lay the noodles in`, `boil hard 8 hr` — rather than teaching a
verb table to answer to nouns. 7 → 0.

---

## 6. Test coverage, and where it stops

**No new test file, deliberately.** The work is data plus two test repairs; a third `src/` file
asserting what `collection.test.ts` already covers would be noise.

| Change | What gates it | What it cannot catch |
| --- | --- | --- |
| Tag folds, 51 files | `parse-recipes.mjs`; a scripted collision check per file and over the collection | **Nothing enforces the vocabulary going forward.** The next fifty recipes will split it again |
| Label rewrites, 6 files | `icons.test.ts`; `check-recipes.mjs --labels` staircases read by eye | Whether the new wording is a *better* sentence |
| Schedule data fixes | `schedule.test.ts`, both assertions | Whether three weeks is the right keeping time for the paste. It is the file's own claim, unchanged |
| Counter additions | `collection.test.ts`; a scripted unsectioned/ghost check | Whether meatloaf belongs at a diner. It is the Diner gap doc's own rank 15 |
| `aka` edits | a scripted claimant check per fixed name | Whether a searcher wanted the other one |
| The fifteen gap notes | `menu-sections.mjs` round-trip, byte for byte | Everything outside `## What it has`. Prose, read by eye |

**The round-trip is the one genuinely new guarantee.** T-001-17's review warned that running
`node scripts/menu-sections.mjs --write` would *undo* that ticket, because the notes had fallen
behind `counters.json`. Run against a copy now, it reproduces `counters.json` **byte for byte**.
Getting there needed three section titles shortened — the parser cuts a heading at ` — `, so
`Broths — the menu's first decision` could never survive a round trip. `Broths`, `The spit` and
`Breakfast all day` are the form every other section on the site already uses.

**Stated plainly:** nothing checks that a *missing* list is complete, or that a struck item is
genuinely on the shelf. That is fifteen files of judgement. The mitigation is that every strike
was made by matching the bolded dish name against the collection's titles and `aka` rather than
from memory, and that the survivors were audited a second time — which caught six sentences that
were still true when written and are not now, including **eight "there is no drink on the site"
claims** across seven counters.

---

## 7. Open concerns for a human

1. **The category tree has drifted, and this ticket did not fix it.** Pickles are in two folders
   — `sour-dill-pickles`, `do-chua`, `lime-pickle`, `mango-chutney` in `dressings-and-dips/`;
   `kabis`, `sauerkraut`, `sumac-onions` in `toppings-and-pickles/`. `coleslaw` and
   `barbecue-slaw` are dressings though `salads/` exists. `cured-fish/` holds one file. Held
   back on purpose (Design §7): thirteen files re-categorised on this ticket's judgement is not
   one of the six criteria, and it moves the category tally the README has to report. **It is
   cheap** — the slug is the basename, so no URL moves — and it is recorded as the first job of
   the next pass.
2. **Nothing enforces the tag vocabulary.** 24 concepts were folded here and the 25th will
   arrive with the next recipe. A checker is one small file and one test, and it needs to know
   the difference between a spelling variant and two real concepts, which is why it is worth
   writing once. Second job of the next pass.
3. **Four cells changed icon.** `mould, fill and seal` layer→hand, `sheet to 1.5 mm` rest→roll,
   `tie in cloth, drain 24 hr` strain→hand, `velvet, rest 30 min` rest→stir. Each now shows the
   verb the cook opened with, which is the map's stated rule, but a reviewer who thinks
   `tie in cloth, drain 24 hr` is better drawn as a sieve has a one-line change.
4. **Eleven ramen and broth cells were reworded.** They are the terse assembly idiom of a
   counter, and they read differently now — `tare in` became `spoon the tare in`. The
   `--labels` staircases are in `progress.md`; if a reviewer prefers the shorthand, the
   alternative was adding `tare` and `noodles` to a table called `VERB_ICONS`.
5. **`docs/active/tickets/T-001-18-read-the-whole-shelf.md` rode along in commit `a41f570`.**
   Lisa's own `phase: ready → implement` edit was unstaged in the working tree and the
   `--include` list for that commit was built from `git diff --name-only` without filtering it
   out. Nothing in that file was written by this ticket and its content is unchanged; later
   commits used explicit paths. Flagged because it is an ownership slip, not a content one.
6. **Nothing here checks that a recipe is correct cooking**, and this ticket read 514 of them by
   metadata rather than by method. Everything it changed is a tag, a name, a label, a counter or
   a note — no quantity, no temperature and no technique was touched, which bounds the damage a
   wrong judgement here can do.

---

## 8. What a reviewer should look at first

1. `node scripts/menu-sections.mjs` — it should say **every counter parsed cleanly**, and that
   one line is the whole of the gap-doc rewrite's correctness.
2. `docs/gaps/README.md` §"What no single classifier could see". It is the answer to the
   ticket's actual question — what only shows up from here — and every number in it is computed.
3. `src/lib/schedule.test.ts`'s first assertion, read next to the two below it. If the property
   is wrong, it is wrong in a way that will hide a real regression later.
4. `recipes/spice-blends-and-marinades/ginger-garlic-paste.cook` step 3. One timer, removed,
   and it was the whole of a failure four tickets could not reach.

## Disposition

**Pass.** All seven criteria are met and measured. `npm run verify` is green end to end for the
first time since T-001-05. Ninety-three files are committed through `lisa commit-ticket` with
exact `--include` paths across eight commits, and `git status --short` shows no ticket-owned file
staged, modified or untracked. The two things deliberately not done — the category moves and the
tag checker — are outside the criteria, are argued in `design.md` §7, and are written down as the
next pass's first two jobs rather than lost.
