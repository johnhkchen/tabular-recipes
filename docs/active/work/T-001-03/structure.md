# T-001-03 — Structure

Sixteen files created, none modified, none deleted. Two folders are new. Nothing outside
`recipes/**` is touched.

## Files

| # | Path | Slug | Category line |
| --- | --- | --- | --- |
| 1 | `recipes/sauces-and-gravies/pad-thai-sauce.cook` | `pad-thai-sauce` | Sauces & Gravies |
| 2 | `recipes/noodles-and-stir-fries/pad-thai.cook` | `pad-thai` | **Noodles & Stir-Fries** |
| 3 | `recipes/stews-and-braises/thai-red-curry.cook` | `thai-red-curry` | Stews & Braises |
| 4 | `recipes/spice-blends-and-marinades/thai-green-curry-paste.cook` | `thai-green-curry-paste` | Spice Blends & Marinades |
| 5 | `recipes/spice-blends-and-marinades/thai-yellow-curry-paste.cook` | `thai-yellow-curry-paste` | Spice Blends & Marinades |
| 6 | `recipes/stews-and-braises/thai-yellow-curry.cook` | `thai-yellow-curry` | Stews & Braises |
| 7 | `recipes/spice-blends-and-marinades/panang-curry-paste.cook` | `panang-curry-paste` | Spice Blends & Marinades |
| 8 | `recipes/stews-and-braises/panang-curry.cook` | `panang-curry` | Stews & Braises |
| 9 | `recipes/spice-blends-and-marinades/massaman-curry-paste.cook` | `massaman-curry-paste` | Spice Blends & Marinades |
| 10 | `recipes/stews-and-braises/massaman-curry.cook` | `massaman-curry` | Stews & Braises |
| 11 | `recipes/soups/tom-yum-goong.cook` | `tom-yum-goong` | Soups |
| 12 | `recipes/noodles-and-stir-fries/pad-see-ew.cook` | `pad-see-ew` | **Noodles & Stir-Fries** |
| 13 | `recipes/noodles-and-stir-fries/pad-kee-mao.cook` | `pad-kee-mao` | **Noodles & Stir-Fries** |
| 14 | `recipes/noodles-and-stir-fries/pad-krapow.cook` | `pad-krapow` | **Noodles & Stir-Fries** |
| 15 | `recipes/salads/som-tum.cook` | `som-tum` | **Salads** |
| 16 | `recipes/salads/larb-gai.cook` | `larb-gai` | **Salads** |

New folders: `recipes/noodles-and-stir-fries/` (4 files), `recipes/salads/` (2 files). Every
file carries an explicit `>> category:` line, so the title-cased folder name never reaches a
page. All sixteen slugs were checked against all 254 existing basenames — none collides.

## Metadata, every file

`title`, `category`, `tags`, `servings` (required by the checker), then `counters:
Thai Kitchen` alone, `aka:` (every spelling in `docs/knowledge/counters.md` lines 465–497
plus the English gloss and a no-diacritics form), `time:`, and `>> step.N:` overrides for
every step. No `dish:` or `kit:` lines anywhere — nothing here is an equipment variant.

## Pairings

Written on one side only; `parse-recipes.mjs` makes them mutual, so nothing needs editing on
the other end. Every target verified to exist.

| File writing it | `pairs-with` | Why |
| --- | --- | --- |
| `pad-thai` | `pad-thai-sauce` | the dish and its ratio |
| `thai-red-curry` | `thai-red-curry-paste`, `coconut-rice` | closes the doc's headline asymmetry |
| `thai-green-curry-paste` | `thai-green-curry` | reaches the existing curry **without editing it** |
| `thai-yellow-curry-paste` | `thai-yellow-curry`, `madras-curry-powder` | yellow paste is the one that takes curry powder |
| `panang-curry-paste` | `panang-curry` | |
| `massaman-curry-paste` | `massaman-curry` | |
| `massaman-curry` | `coconut-rice` | |
| `tom-yum-goong` | `tom-kha-gai` | the gap doc: *"the two are always printed as a pair"* |
| `pad-see-ew` | `pad-kee-mao` | the wide-noodle pair, one sweet one hot |
| `larb-gai` | `som-tum` | ordered together, always |

## The tree of each file

Rows = ingredient leaves; ops = operation columns. README asks 5–16 rows, 3–6 ops.
Reference arithmetic is written out where a step reaches back more than one, because `~N`
counts every step.

**1. `pad-thai-sauce`** — 7 rows, 4 ops. *soak 20 min, press through a sieve* (tamarind pulp)
→ *melt to a dark caramel* (palm sugar, water) [branch] → *simmer 5 min* (`~1` caramel, `~2`
tamarind water; fish sauce, salt) → *stir in the vinegar, cool 20 min* (rice vinegar).

**2. `pad-thai`** — 14 rows, 5 ops. *soak 30 min, drain* (rice stick noodles) → *fry 2 min*
(dried shrimp, preserved radish, firm tofu, garlic, oil) [branch] → *stir-fry 3 min* (`~1`
aromatics, `~2` noodles; pad thai sauce, shrimp) → *scramble in* (eggs) → *toss off the heat,
serve* (bean sprouts, garlic chives, peanuts, lime, chile powder).

**3. `thai-red-curry`** — 9 rows, 5 ops. *crack the cream 5 min* (coconut milk) → *fry the
paste 3 min* (Thai red curry paste) → *simmer 12 min* (chicken thighs, bamboo shoots, makrut
lime leaves) → *season* (fish sauce, palm sugar) → *stir in* (Thai basil, red chiles).

**4. `thai-green-curry-paste`** — 13 rows, 5 ops. Mirrors `thai-red-curry-paste`'s shape so
the two read as a set. *toast 2 min, grind in a mortar* (coriander seed, cumin seed, white
peppercorns) [branch] → *pound to a paste* (green bird chiles, long green chiles, salt) →
*pound in* (`~1`; lemongrass, galangal, makrut lime zest, coriander root) → *pound in* (`~1`;
garlic, shallots) → *work in* (`~1` paste, `~4` ground spices; shrimp paste).

**5. `thai-yellow-curry-paste`** — 12 rows, 5 ops. *soak 20 min, drain and chop* (dried long
red chiles) → *toast 2 min, grind* (coriander seed, cumin seed, white peppercorns) [branch] →
*pound to a paste* (`~2` soaked chiles; salt, lemongrass, fresh turmeric, galangal) → *pound
in* (`~1`; garlic, shallots) → *work in* (`~1`, `~3` ground spices; madras curry powder,
shrimp paste).

**6. `thai-yellow-curry`** — 10 rows, 5 ops. *crack the cream 5 min* (coconut milk) → *fry
the paste 3 min* (Thai yellow curry paste) → *simmer 25 min* (chicken thighs, potatoes,
onion, chicken stock) → *season* (fish sauce, palm sugar) → *finish* (lime juice, cilantro).

**7. `panang-curry-paste`** — 14 rows, 5 ops. Same five-step shape as the red paste, with
twice the coriander seed and ground peanuts worked in at the end — the two things that make
panang panang. *soak 20 min* → *toast 2 min, grind* [branch] → *pound* (`~2`) → *pound in*
(`~1`) → *work in* (`~1`, `~3`; roasted peanuts, shrimp paste).

**8. `panang-curry`** — 9 rows, 5 ops. *crack the cream 5 min* (coconut cream) → *fry the
paste 3 min* (panang curry paste) → *simmer 10 min* (beef sirloin, coconut milk) → *reduce 8
min until it coats* (fish sauce, palm sugar, ground peanuts) → *scatter* (makrut lime leaves
cut to hairs, red chile).

**9. `massaman-curry-paste`** — 13 rows, 5 ops. The only paste with a charring branch, which
is what makes it taste roasted rather than raw. *soak 20 min* (dried long red chiles) →
*toast 3 min, grind* (coriander, cumin, cardamom, cloves, cinnamon, star anise) [branch] →
*char 10 min, then peel* (shallots, garlic, both unpeeled) [branch] → *pound to a paste*
(`~3` chiles, `~1` charred alliums; salt, lemongrass, galangal) → *work in* (`~1` paste,
`~3` ground spices; shrimp paste).

**10. `massaman-curry`** — 12 rows, 5 ops. *crack the cream 5 min* (coconut cream) → *fry the
paste 4 min* (massaman curry paste) → *simmer 90 min* (beef chuck, coconut milk, cinnamon
stick, bay) → *simmer 25 min* (potatoes, pearl onions, roasted peanuts) → *season* (tamarind
water, fish sauce, palm sugar). Critical path ≈ 2 hr 10 min, nowhere near the 1568 min that
would disturb `schedule.test.ts`.

**11. `tom-yum-goong`** — 12 rows, 5 ops. Written as **tom yum nam sai**, the clear one, so it
needs no nam prik pao. *fry the shells 3 min* (shrimp shells, oil) → *simmer 15 min, strain*
(water) → *steep 10 min* (`~1`; lemongrass, galangal, makrut lime leaves) → *poach 3 min*
(shrimp, oyster mushrooms) → *season off the heat* (fish sauce, lime juice, Thai chiles,
cilantro).

**12. `pad-see-ew`** — 11 rows, 5 ops. *stir the sauce* (dark soy, thin soy, oyster sauce,
sugar, vinegar) [branch] → *sear 2 min* (pork shoulder, garlic, oil) [branch] → *char 2 min*
(`~1` wok; wide rice noodles) → *scramble in* (eggs) → *toss 2 min* (`~1` noodles, `~4`
sauce; Chinese broccoli).

**13. `pad-kee-mao`** — 12 rows, 5 ops. *pound to a rough paste* (Thai chiles, garlic) →
*stir the sauce* (oyster, thin soy, dark soy, fish sauce, sugar) [branch] → *stir-fry 3 min*
(`~2` chile paste; ground pork, oil) → *char 2 min* (`~1`; wide rice noodles) → *toss* (`~1`,
`~3` sauce; holy basil, long beans).

**14. `pad-krapow`** — 14 rows, 5 ops. *pound to a rough paste* (Thai chiles, garlic) → *stir
the sauce* (oyster, thin soy, dark soy, fish sauce, sugar, water) [branch] → *fry the paste 1
min, then the pork 3 min* (`~2`; oil, ground pork) → *toss off the heat* (`~1`, `~3` sauce;
holy basil) → *fry the eggs 2 min, and spoon it over* (`~1`; eggs, oil, jasmine rice). Two
timers in one step at step 3; each is named, so `readTimers()` reads each against its own
half of the label.

**15. `som-tum`** — 11 rows, 5 ops. *pound to a rough paste* (garlic, Thai chiles, salt) →
*bruise in* (long beans, cherry tomatoes) → *stir in* (palm sugar, fish sauce, lime juice,
dried shrimp) → *bruise in 2 min* (green papaya) → *turn out* (roasted peanuts). Prose says
it is pounded one plate at a time, which is the thing the gap doc says a table cannot hold.

**16. `larb-gai`** — 11 rows, 4 ops. *toast 8 min, grind coarse* (glutinous rice) — khao khua,
inline because it is one step and useless anywhere else → *poach 5 min, break it fine* (ground
chicken, chicken stock) [branch] → *dress off the heat* (`~1`; fish sauce, lime juice, toasted
chile powder, palm sugar) → *toss* (`~1`, `~3` toasted rice powder; shallots, mint, cilantro,
scallions).

## Conventions applied uniformly

- **Every timer is named** and every name is in `time.ts`'s recognised vocabulary: `soak`,
  `simmer`, `steep`, `poach`, `toast`, `roast`, `fry`, `stirfry`, `toss`, `cool`. Nothing
  invented — an unrecognised name reads no better than a bare `~{}`.
- **`>> step.N:` on every step.** The staircase is the acceptance criterion, so no label is
  left to derivation.
- **`makrut lime`** in the ingredient, `kaffir lime` in `aka` — matches the two existing
  files that use it against the green curry's one.
- **Second units in notes**: `@palm sugar{6%oz}(170 g)`, `@lime juice{1/4%cup}(60 mL)`.
- **Fractions as fractions**: `{1/4%cup}`, never `{0.25%cup}`.
- **The spice dial is prose, not a variant.** One line in the file that carries the chiles:
  the number is what the kitchen changes, not the dish.
- **Servings are per plate where the dish is per plate**: 2 for the wok dishes and som tum,
  4–6 for the curries, soups and the pastes' yield.

## Ordering of the work

Pastes before the curries that consume them, sauce before pad thai — not a build dependency
(an ingredient is just a name) but it keeps each commit readable. Full order in `plan.md`.

## Explicitly not created or modified

- No file in `src/`. `counters.json` and `aisles.json` are T-001-17's, so the new items sit
  in the counter page's trailing "Also" section until that ticket shelves them, and the new
  ingredients (tamarind pulp, palm sugar, sen yai noodles, holy basil, green papaya,
  glutinous rice, preserved radish, dried shrimp) fall through the shopping aisles until then.
- **None of the five existing Thai files.** `thai-green-curry.cook` keeps its inline paste;
  the overlap with the new `thai-green-curry-paste.cook` is recorded for T-001-18.
- No `pickled-mustard-green` (owned by nobody, wanted by two counters), no chicken wings
  (Pizzeria's), no `khao-soi`, `khao-pad`, `yum-nam-tok` or appetiser — all below the line and
  named in `design.md` with reasons.
