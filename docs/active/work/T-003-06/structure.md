# T-003-06 — Structure

The blueprint. Exact files, exact contents, exact ordering. No prose that is not a constraint.

---

## 1. Files touched

| File | Change | Owner |
| --- | --- | --- |
| `src/data/counters.json` | modify — 3 of 21 counter objects get their `sections` rewritten | this ticket |
| `src/data/aisles.json` | **none** — D6 | this ticket |
| 13 × `recipes/**/*.cook` | modify — one `>> counters:` line each, nothing else | D1, outside criterion 8 |

Created: none. Deleted: none. Nothing under `src/lib/`, `src/pages/`, `scripts/`, `docs/gaps/`.

`src/generated/recipes.json` is rewritten by `npm run recipes` and is **not committed** —
`.gitignore` it or not, it has never appeared in a ticket commit and must not appear in one here.

---

## 2. `src/data/counters.json` — the three blocks, verbatim

Serialisation contract: read with `json.load`, mutate, write with
`json.dumps(file, indent=2, ensure_ascii=False) + "\n"`. That reproduces
`JSON.stringify(file, null, 2) + '\n'` byte-for-byte for this file, so the diff is confined to the
three counter objects. **Verified by round-tripping the untouched file first and asserting a zero
diff** — that check is step 1 of the plan, and if it fails the edit is done by hand instead.

Key order inside a counter object is `name`, `slug`, `blurb`, `categories`, `sections`; inside a
section it is `title`, `items`. Mutating in place preserves both.

### 2.1 `soup-pot` — 4 sections, 24 items

```
"Old-fire soups (老火湯)"        [16]  T-003-03 ranks 1–16, in its order
    green-radish-carrot-pork-bone-soup
    winter-melon-jobs-tears-soup
    lotus-root-dried-octopus-soup
    watercress-honey-date-soup
    peanut-black-eyed-pea-chicken-feet-soup
    overlord-flower-soup
    corn-carrot-pork-bone-soup
    chinese-yam-goji-black-chicken-soup
    ching-bo-leung-soup
    sha-shen-yu-zhu-soup
    hairy-gourd-dried-scallop-soup
    dried-bok-choy-pork-lung-soup
    lotus-seed-lily-bulb-soup
    old-cucumber-rice-bean-soup
    green-papaya-peanut-trotter-soup
    apple-pear-pork-bone-soup

"Quick daily soups (滾湯)"       [6]   T-003-03 滾湯 ranks 1–5, then the borrowing
    tomato-potato-beef-soup
    seaweed-egg-drop-soup
    mustard-greens-tofu-soup
    crucian-carp-tofu-soup
    century-egg-amaranth-soup
    egg-drop-soup                     ← borrowed from the Takeout Counter

"What each thing is for"        [0]   the gap note's dried-goods glossary; holds no recipe
"Congee and rice soups"         [2]
    congee                            ← borrowed from the Dim Sum Counter
    congee-instant-pot                ← borrowed from the Instant Pot
```

`Also here` is **deleted** (D3). Section count goes 5 → 4; three of the four render.

### 2.2 `japanese-home` — 6 sections, 38 items

```
"The soup and the rice"              [6]
    dashi                             ← borrowed from the Ramen Shop
    miso-soup                         ← borrowed from the Ramen Shop
    sumashi-jiru
    tonjiru
    gohan
    takikomi-gohan

"Simmered things (煮物)"              [6]   T-003-04's list, unchanged
    nikujaga · buri-daikon · chikuzenni · saba-no-misoni · kabocha-no-nimono · kiriboshi-daikon

"Grilled and pan-fried mains"        [6]   T-003-04's four, then two borrowings
    shogayaki · saba-shioyaki · buri-teriyaki · hambagu · gyoza · karaage

"Small sides (小鉢)"                  [7]   T-003-04's six, then one borrowing
    kinpira-gobo · hijiki-no-nimono · ohitashi · goma-ae · sunomono · tamagoyaki · chawanmushi

"Made ahead (作り置き)"                [7]   T-003-04's four, then three borrowings
    nikumiso · nanbanzuke · mentsuyu · asazuke · teriyaki-sauce · goma-dare · shichimi-togarashi

"Rice bowls and one-plate suppers"   [6]   T-003-04's four, then two borrowings
    oyakodon · gyudon · omurice · chahan · okonomiyaki · japanese-beef-curry
```

`Also here` is **deleted**; its eight slugs are distributed above per D4. Section count 7 → 6.

**One deliberate reordering.** T-003-04 handed over *"gohan · takikomi-gohan · tonjiru ·
sumashi-jiru (+ the existing dashi and miso-soup)"*. The section is titled *The soup and the rice*,
so it prints in that order: the stock everything is built on, then the two soups, then the two
rices. Every one of the six is present; only the sequence differs, and only inside one section.
Every other section keeps the writer ticket's order exactly, with borrowings appended.

### 2.3 `slow-cooker` — 4 sections, 20 items

Taken from `docs/gaps/slow-cooker.md`'s candidate grouping, in its order, with `-slow-cooker`
appended to each plain slug and every candidate that was never written dropped.

```
"Braises, left alone all day"   [18]
    pot-roast-slow-cooker
    beef-stew-slow-cooker
    chili-con-carne-slow-cooker
    braised-short-ribs-slow-cooker
    carnitas-slow-cooker
    birria-de-res-slow-cooker
    cachete-slow-cooker
    oxtails-slow-cooker
    chile-verde-slow-cooker
    hungarian-goulash-slow-cooker
    collard-greens-slow-cooker
    corned-beef-slow-cooker
    osso-buco-slow-cooker
    lamb-tagine-slow-cooker
    irish-stew-slow-cooker
    baked-turkey-wings-slow-cooker
    brunswick-stew-slow-cooker
    new-england-boiled-dinner-slow-cooker

"Beans and pulses"              [1]   boston-baked-beans-slow-cooker
"Stocks"                        [0]   kept empty, D5 — every stock was deferred to the Instant Pot
"Whole birds and big cuts"      [1]   soy-sauce-chicken-slow-cooker
```

`Also here` is **deleted**; the gap note's `congee` and `consome-de-birria` entries were a
candidate list, and neither has a `kit: Slow Cooker` file. Section count 5 → 4; three render.

18 + 1 + 0 + 1 = **20**, which is exactly the set of files carrying `kit: Slow Cooker` and nothing
else. No `.cook` edit is needed for this shelf.

---

## 3. The thirteen `.cook` edits — exact shape

One line per file. The line is `>> counters: …` and the edit appends `, <Counter Name>` to it.
Nothing else in the file is read or written.

```
recipes/soups/dashi.cook                              Ramen Shop
                                                   →  Ramen Shop, Japanese Home Cooking
recipes/soups/miso-soup.cook                          same shape
recipes/dumplings-and-rolls/gyoza.cook                same shape
recipes/flatbreads-and-pancakes/okonomiyaki.cook      same shape
recipes/custards-and-puddings/chawanmushi.cook        same shape
recipes/spice-blends-and-marinades/shichimi-togarashi.cook   same shape
recipes/fried-and-crispy/karaage.cook                 Ramen Shop, The Bowl Shop
                                                   →  Ramen Shop, The Bowl Shop, Japanese Home Cooking
recipes/dressings-and-dips/goma-dare.cook             Ramen Shop, The Bowl Shop → + …
recipes/stews-and-braises/japanese-beef-curry.cook    Ramen Shop, One Pot → + …
recipes/sauces-and-gravies/teriyaki-sauce.cook        Ramen Shop, Takeout Counter → + …
recipes/soups/congee.cook                             Dim Sum Counter, One Pot → + The Soup Pot
recipes/soups/congee-instant-pot.cook                 Instant Pot → + The Soup Pot
recipes/soups/egg-drop-soup.cook                      Takeout Counter → + The Soup Pot
```

Counter names are matched by exact string against `counters.json` `name` by both
`parse-recipes.mjs` and `check-recipes.mjs`, so `The Soup Pot` and `Japanese Home Cooking` are
written exactly, with no trailing space.

**Invariant to hold and to prove:** the diff of `recipes/` for this ticket contains no changed line
that is not a `>> counters:` line.

```
git diff -U0 <base>..HEAD -- recipes/ | grep '^[+-][^+-]' | grep -vc '^[+-]>> counters:'   → 0
```

---

## 4. Ordering of changes

The `.cook` edits must land **before** the `counters.json` edit is verified, because a section item
that does not name its counter is dropped silently and the verification script cannot tell that
case from a typo. Order:

1. Round-trip probe on `counters.json` (no change written) — proves the serialiser matches.
2. The thirteen `.cook` edits → `npm run recipes` → commit.
3. The three `sections` blocks in `counters.json` → commit.
4. Verification sweep and the built HTML.

Steps 2 and 3 are separately revertable, which is the point: a reviewer who rejects D1 reverts
step 2 alone and the shelves fall back to 21 / 28 / 20 with two criteria failing.

---

## 5. Public interfaces — unchanged

Nothing here changes a type, a function signature, or a rendered component. `Counter`,
`MenuSection`, `Menu` and `menuFor()` are read, never written. The only interface this ticket
*uses* that is not enforced by a test is the implicit contract that a section item names its
counter; §6 turns that into a check.

---

## 6. The verification script (throwaway, not committed)

No test covers "a listed slug resolves and names its counter" (research §10). A short probe over
`src/generated/recipes.json` + `src/data/counters.json` is written under the scratchpad, run, and
its output pasted into `progress.md`. It asserts, for each of the three counters:

1. every listed slug exists in `recipes.json`;
2. every listed slug's `counters` includes the counter's `name`;
3. every recipe naming the counter appears in exactly one section (⇒ no generated `Also`);
4. no section is titled `Also here`;
5. section titles and their order match `counters.json`.

Plus, from the built HTML in `dist/menu/<slug>/index.html`: the `<h2>` sequence, the count in the
header, and that no `<h2>` reads `Also` or `Also here`.

Nothing is added to `src/lib/*.test.ts`. A test asserting that `nikujaga` is in 煮物 would be a
copy of `counters.json` under a different name, which is the same reasoning T-002-08 §4 gives.

---

## 7. What could break, and where it would show

| Change | Blast radius | Caught by |
| --- | --- | --- |
| `>> counters:` line malformed | that recipe parses with a bogus counter | `parse-recipes.mjs` throws |
| Counter name misspelled | build fails | `parse-recipes.mjs`, `collection.test.ts` |
| A slug typo in a section | item silently missing from the page | §6 probe, check 1 |
| A member left unplaced | a generated `Also` section appears | §6 probe check 3, built HTML |
| JSON serialiser mismatch | a 1700-line noise diff | step 1 round-trip probe |
| Anything else in a `.cook` file touched | recipe content changed | §3 `grep -vc` invariant |
| Adding a counter changes another shelf | — | impossible: every edit is additive |

`npm run verify` (`check` → `recipes` → `vitest run` → `astro build`) is green at `c0fe6a4` and must
be green at the end. 825 tests, 682 pages.
