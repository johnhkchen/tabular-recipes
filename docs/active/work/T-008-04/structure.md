# T-008-04 — Structure

Twenty-one new `.cook` files. Nothing else in `recipes/` is touched, nothing in `src/` is touched,
no directory is created.

---

## 1. Exact paths

A variant lands in the **same folder and carries the same `category:`** as the plain file it is a
sibling of, so the two sit together in every listing that is not the counter. Standalones land by
what they are.

| # | path | folder exists | `category:` |
| --: | --- | --- | --- |
| 1 | `recipes/fried-and-crispy/air-fryer-chicken-wings.cook` | yes | Fried & Crispy |
| 2 | `recipes/fried-and-crispy/air-fryer-chicken-thighs.cook` | yes | Fried & Crispy |
| 3 | `recipes/fried-and-crispy/air-fryer-halloumi.cook` | yes | Fried & Crispy |
| 4 | `recipes/fried-and-crispy/air-fryer-tofu.cook` | yes | Fried & Crispy |
| 5 | `recipes/smoked-and-grilled/air-fryer-salmon.cook` | yes | Smoked & Grilled |
| 6 | `recipes/smoked-and-grilled/air-fryer-saba-shioyaki.cook` | yes | Smoked & Grilled |
| 7 | `recipes/vegetables-and-sides/air-fryer-brussels-sprouts.cook` | yes | Vegetables & Sides |
| 8 | `recipes/vegetables-and-sides/air-fryer-broccoli.cook` | yes | Vegetables & Sides |
| 9 | `recipes/vegetables-and-sides/air-fryer-cauliflower.cook` | yes | Vegetables & Sides |
| 10 | `recipes/fried-and-crispy/air-fryer-chickpeas.cook` | yes | Fried & Crispy |
| 11 | `recipes/vegetables-and-sides/air-fryer-sweet-potatoes.cook` | yes | Vegetables & Sides |
| 12 | `recipes/fried-and-crispy/air-fryer-batata-harra.cook` | yes | Fried & Crispy |
| 13 | `recipes/vegetables-and-sides/air-fryer-padron-peppers.cook` | yes | Vegetables & Sides |
| 14 | `recipes/vegetables-and-sides/air-fryer-corn-ribs.cook` | yes | Vegetables & Sides |
| 15 | `recipes/fried-and-crispy/air-fryer-chips.cook` | yes | Fried & Crispy |
| 16 | `recipes/smoked-and-grilled/air-fryer-chicken-tikka.cook` | yes | Smoked & Grilled |
| 17 | `recipes/smoked-and-grilled/air-fryer-shish-tawook.cook` | yes | Smoked & Grilled |
| 18 | `recipes/fried-and-crispy/air-fryer-frozen-chips.cook` | yes | Fried & Crispy |
| 19 | `recipes/dumplings-and-rolls/air-fryer-frozen-spring-rolls.cook` | yes | Dumplings & Rolls |
| 20 | `recipes/fried-and-crispy/air-fryer-frozen-prawns.cook` | yes | Fried & Crispy |
| 21 | `recipes/pizzas/air-fryer-reheated-pizza.cook` | yes | Pizzas |

Every slug is checked free: no `air-fryer-*` file exists anywhere in `recipes/`, and none of
`chicken-wings`, `bacon`, `corn-ribs`, `padron-peppers` is taken. `swiss-wings` and
`baked-turkey-wings` are different `dish` keys and do not collide.

## 2. The frontmatter block, in order

Every file, same order as the collection already writes it:

```
>> title:        Title Case, and a variant says which machine — "Chicken Wings, Air Fryer"
>> category:     from the table above
>> tags:         lowercase, comma-separated; every file carries "air fryer"
>> counters:     The Air Fryer & the Pot          ← exactly this, on all 21
>> dish:         <existing slug>                  ← ONLY on the 13 kit variants
>> kit:          Air Fryer                        ← ONLY on the same 13
>> aka:          what a person would call it, including the machine's name
>> pairs-with:   0–2 verified existing slugs, or omitted
>> servings:     a number — a claim about MY basket, per the capacity finding
>> time:         wall clock, preheat included, ≤ 45 min on all 21
>> slack:        forgiving | narrow | unforgiving — only where the file can name a real failure
>> washing-up:   the things, comma-separated. Count is derived. ≤ 2 on all 21.
```

**`dish:` / `kit:` — the thirteen that carry them.** Getting this backwards is a build error
(`parse-recipes.mjs:198`), so the mapping is written out rather than derived at the keyboard:

| new file | `>> dish:` | new file | `>> dish:` |
| --- | --- | --- | --- |
| `air-fryer-halloumi` | `seared-halloumi` | `air-fryer-sweet-potatoes` | `roasted-sweet-potatoes` |
| `air-fryer-tofu` | `crisped-marinated-tofu` | `air-fryer-batata-harra` | `batata-harra` |
| `air-fryer-salmon` | `blackened-salmon` | `air-fryer-chips` | `french-fries` |
| `air-fryer-saba-shioyaki` | `saba-shioyaki` | `air-fryer-chicken-tikka` | `chicken-tikka` |
| `air-fryer-brussels-sprouts` | `roasted-brussels-sprouts` | `air-fryer-shish-tawook` | `shish-tawook` |
| `air-fryer-broccoli` | `charred-broccoli` | `air-fryer-chickpeas` | `crispy-chickpeas` |
| `air-fryer-cauliflower` | `roasted-cauliflower` | | |

**The eight with no `dish:` and no `kit:`** — `air-fryer-chicken-wings`,
`air-fryer-chicken-thighs`, `air-fryer-padron-peppers`, `air-fryer-corn-ribs`,
`air-fryer-frozen-chips`, `air-fryer-frozen-spring-rolls`, `air-fryer-frozen-prawns`,
`air-fryer-reheated-pizza`. Each `dish` defaults to its own slug (`normalise.mjs:231`) and each slug
is unique, so no group has two plain files.

## 3. The body, same skeleton in all twenty-one

```cook
>> step: <preheat + basket size, one sentence, ≤ 120 chars>
<one short line; discarded, so it stays short>

>> step: <verb the prep>
<prep step: the bowl, the ingredients>

>> step: roast in the basket <T°C (T°F)>, <lo>–<hi> min, one layer
<basket step: @&(~1)…{} in a preheated #air fryer basket{} … ~air fry{<middle>%min}>

>> step: <shake or turn at halfway> — <the doneness cue>
<cue step: @&(~1)…{} only, no ingredients — it earns its column from the ref>

>> step: <finish, off the heat>
<final step: @&(~n)…{} plus the finishing ingredients — the single root>
```

**Invariants the checker enforces, restated as authoring rules:**

- The **last** step is the only one with no parent. Every branch reaches it through `@&(~n){}`.
- `@&(~n)` counts back **n step blocks including the prose row**, so the prep step is `~1` from the
  basket step, and a second prep branch is referenced by its own distance from the final step.
- **5–16 ingredient rows**, **3–6 operations**. The skeleton gives 4 operations; a file with a
  second prep branch (a sauce stirred while the basket runs) gives 5.
- **Operation cell ≤ 70 chars.** The basket cell is the tight one: `roast in the basket 200°C
  (400°F), 18–24 min, one layer` is 58.
- **`roast` appears before the clock in the basket cell.** This is load-bearing — design §1.
- **Cookware is named `#air fryer basket{}`**, and the `washing-up` entry is `the basket`.
  `unaccountedCookware` matches them by substring, so no advisory fires.
- **`~air fry{}` is the basket timer's name on all twenty-one files.** Other timers keep the name
  of what they are: `~marinate`, `~rest`, `~stand`.

## 4. What each of the four required facts looks like in place

Worked on file 1 so the other twenty have a model:

| requirement | where it lands |
| --- | --- |
| load | `roast in the basket 200°C (400°F), 18–24 min, one layer` |
| doneness cue | `turn once at halfway — skin gone matt and pebbled, not glossy` |
| preheated? | prose row: *"Written for a preheated 5.7 L basket. From cold add three minutes…"* |
| basket size | same sentence — `5.7 L`, and what a `3.5 L` basket means |
| range vs timer | `18–24 min` in the cell, `~air fry{21%min}` in the timer |

## 5. Ordering

Files are independent — no file imports another and the only cross-file relationship is the `dish`
key, which points at files that already exist. So the order is chosen for **cheap verification**,
not dependency:

1. **File 1 alone** (`air-fryer-chicken-wings`), checked, committed. It settles the skeleton, the
   prose row, the cell lengths and the `~air fry` reading against the real parser. Everything after
   it is a variation on a shape that has already passed.
2. **The seven remaining standalones**, because they cannot break the build — no `dish` collision
   is possible.
3. **The thirteen `kit:` variants**, in two batches, with a full `npm run recipes` after the first
   batch. This is the only place a build error can appear (`parse-recipes.mjs:198`), so it is the
   only place that gets its own gate.
4. **`npm run check` over the whole collection**, then `npm run verify`.

## 6. Files deliberately NOT created

- Nothing under `src/`. The one-line `~air fry` addition to `src/lib/time.ts` is **out of scope**
  and is recorded as a note, not written.
- Nothing under `docs/gaps/`. `air-fryer-and-pot.md` still says the shelf is empty; T-008-05 owns
  the update, and `menu-sections.mjs --write` must not be run against it while the lists are empty.
- `src/data/counters.json` is untouched. The five section titles stay empty; shelving is T-008-05.
- No pot-half file. Ranks 21–26 belong to the other half of the counter.
- No `air-fryer-bacon`, `air-fryer-seekh-kabab`, `air-fryer-roast-potatoes`, `air-fryer-karaage`,
  `air-fryer-onion-rings` — design §7 says why for each, and `review.md` records the counts.

## 7. What a reviewer can check in one command

```
node scripts/check-recipes.mjs recipes/**/air-fryer-*.cook   # 21 ok, no notes
grep -L '>> washing-up:' recipes/**/air-fryer-*.cook          # empty
grep -c 'The Air Fryer & the Pot' recipes/**/air-fryer-*.cook # 1 on each of 21
npm run check && npm run recipes                              # 685 files, build passes
```
