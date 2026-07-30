# T-001-04 — Structure

Fourteen files created, none modified, none deleted. Three new folders. Every table specified
here as rows-per-step and edges, because the 16-row / 6-operation ceiling is the binding
constraint and discovering it mid-Implement is how a table gets rewritten twice.

## Files

```
recipes/
  sauces-and-gravies/
    house-brown-sauce.cook          NEW
  soups/
    hot-and-sour-soup.cook          NEW
    egg-drop-soup.cook              NEW
    wonton-soup.cook                NEW
  stir-fries/                       NEW FOLDER — category "Stir-Fries"
    general-tsos-chicken.cook       NEW
    sesame-chicken.cook             NEW
    orange-chicken.cook             NEW
    beef-with-broccoli.cook         NEW
    egg-foo-young.cook              NEW
    sweet-and-sour-pork.cook        NEW
  noodles/                          NEW FOLDER — category "Noodles"
    lo-mein.cook                    NEW
    singapore-mei-fun.cook          NEW
  dumplings-and-rolls/              NEW FOLDER — category "Dumplings & Rolls"
    egg-rolls.cook                  NEW
    crab-rangoon.cook               NEW
```

Nothing outside `recipes/**` is touched. No existing `.cook` file is opened for edit — the
one dish that would have wanted it, char siu, already names this counter.

## The shape every file shares

```
>> title:                 required
>> category:              required — Stir-Fries | Noodles | Dumplings & Rolls | Soups | Sauces & Gravies
>> tags:                  required — main ingredient, method, cuisine
>> counters: Takeout Counter        exactly this, on all fourteen
>> aka:                   menu name, ASCII form, Han characters where a board prints them
>> pairs-with:            slugs, verified to exist at the moment of that file's commit
>> servings:              required
>> time:                  wall clock
>> step.N:                a label override on every step
```

`>> step.N:` on every step is deliberate rather than lazy. The derived label is the step with
its ingredients stripped, and a wok step reads "Stir-fry , , and in a wok for 3 min" — a
sentence fragment, not a cook's verb. The criteria ask for a staircase that reads as verbs, so
each is set by hand and checked with `--labels`.

## Table blueprints

Read as: **step — rows it introduces — what it consumes**. `~n` is relative (n steps back).

### 1. `general-tsos-chicken` — Stir-Fries, serves 4 — 16 rows × 6 ops

| # | Step | Rows | Consumes |
| --- | --- | --- | --- |
| 1 | velvet, `~rest{30%min}` | chicken thighs, egg white, Shaoxing wine, light soy sauce, baking soda | — |
| 2 | dredge | cornstarch | ~1 |
| 3 | fry twice, `~fry{5%min}` + `~fry{2%min}` | peanut oil | ~1 |
| 4 | whisk the glaze | chicken stock, dark soy sauce, sugar, rice vinegar, cornstarch | — (branch) |
| 5 | sizzle the chiles, `~simmer{1%min}` | dried red chiles, garlic, fresh ginger, toasted sesame oil | ~1 |
| 6 | toss | — | ~1 (glaze) + ~3 (chicken) |

Two branches, one ending at step 6. **This is the file at the ceiling** — 16 rows exactly. The
flour was dropped from the dredge (all-cornstarch is the crisper coating anyway) to make room
for the aromatics.

### 2. `sesame-chicken` — Stir-Fries, serves 4 — 16 rows × 6 ops

Same first three steps as above (velvet / dredge / twice-fry, 7 rows). Then: whisk glaze
(chicken stock, sugar, dark soy, rice vinegar, toasted sesame oil, cornstarch — 6); simmer with
garlic + ginger (2); toss with toasted sesame seeds (1). Sweeter, no chile, vinegar pulled back.

### 3. `orange-chicken` — Stir-Fries, serves 4 — 16 rows × 6 ops

Same first three steps (7 rows). Then: whisk glaze (orange juice, orange zest, sugar, rice
vinegar, light soy sauce, cornstarch — 6); simmer with dried red chiles, garlic, ginger (3);
toss (0). The zest is what separates it from a sweet-and-sour glaze in the same pan.

The three fried-chicken tables are near-identical by design; the gap doc says so outright
(*"the same fried chicken under two other glazes … one operation apart"*). They are three
dishes on the board, not equipment variants, so they take no shared `dish:` key.

### 4. `lo-mein` — Noodles, serves 4 — 15 rows × 5 ops

| # | Step | Rows | Consumes |
| --- | --- | --- | --- |
| 1 | boil and slick the noodles, `~boil{3%min}` | fresh egg noodles, toasted sesame oil | — |
| 2 | whisk the sauce | light soy, dark soy, oyster sauce, sugar, white pepper, chicken stock | — (branch) |
| 3 | stir-fry the vegetables, `~stirfry{3%min}` | peanut oil, garlic, fresh ginger, napa cabbage, carrot, scallions | — (branch) |
| 4 | add the pork, `~stirfry{1%min}` | char siu | ~1 |
| 5 | toss it all | — | ~1 + ~3 (sauce) + ~4 (noodles) |

Three branches merging at step 5. Char siu is a row, not a sub-recipe, and the file pairs with
`char-siu` — the gap doc's *"the strips in the fried rice and the lo mein."*

### 5. `beef-with-broccoli` — Stir-Fries, serves 4 — 10 rows × 6 ops

| # | Step | Rows | Consumes |
| --- | --- | --- | --- |
| 1 | velvet, `~rest{30%min}` | flank steak, egg white, cornstarch, Shaoxing wine, baking soda | — |
| 2 | blanch, `~boil{1%min}` | broccoli | — (branch) |
| 3 | sear in two batches, `~sear{3%min}` | peanut oil | ~2 |
| 4 | stir-fry the aromatics, `~stirfry{1%min}` | garlic, fresh ginger | ~2 (broccoli) |
| 5 | gloss the sauce, `~simmer{1%min}` | house brown sauce | ~1 |
| 6 | return the beef | — | ~1 + ~3 (beef) |

The one dish that carries `house brown sauce` as a single row — Design decision 3.

### 6. `egg-rolls` — Dumplings & Rolls, makes 8 — 15 rows × 5 ops

Straight chain, no branches: stir-fry pork with aromatics (ground pork, garlic, ginger, peanut
oil — 4) → add the vegetables (napa cabbage, carrot, bean sprouts, scallions — 4) → season and
`~cool{30%min}` (light soy, oyster sauce, toasted sesame oil, white pepper — 4) → roll (egg
roll wrappers, cornstarch — 2) → `~fry{5%min}` (peanut oil — 1).

**The cool is the step home versions skip and the reason theirs leak.** It is a named,
unattended timer, which is exactly what the timeline under the table exists to show.

### 7. `hot-and-sour-soup` — Soups, serves 6 — 14 rows × 5 ops

`~soak{20%min}` the dried things (wood ear, lily buds — 2) → simmer the stock (chicken stock,
shiitake, bamboo shoots — 3) → season (light soy, black vinegar, white pepper, salt — 4) →
tofu and thicken (firm tofu, cornstarch — 2) → egg ribbons off the heat (eggs, toasted sesame
oil, scallions — 3). Single chain.

The sour is black vinegar and the hot is white pepper, not chile — the thing the dish is most
often got wrong on, so both are their own rows in their own step.

### 8. `egg-drop-soup` — Soups, serves 4 — 9 rows × 4 ops

Simmer (chicken stock, fresh ginger, salt, white pepper — 4) → thicken (cornstarch — 1) →
ribbon the egg off the heat (eggs — 1) → finish (toasted sesame oil, scallions, frozen peas —
3). Single chain. The thickening before the egg is what makes the ribbons hang rather than
sink, so it is its own operation.

### 9. `wonton-soup` — Soups, serves 4 — 16 rows × 5 ops

| # | Step | Rows | Consumes |
| --- | --- | --- | --- |
| 1 | mix the filling, `~chill{20%min}` | ground pork, shrimp, light soy, Shaoxing, toasted sesame oil, fresh ginger, scallions, white pepper (8) | — |
| 2 | wrap | wonton wrappers | ~1 |
| 3 | boil, `~boil{4%min}` | — | ~1 |
| 4 | simmer the broth, `~simmer{10%min}` | chicken stock, fresh ginger, light soy, salt (4) | — (branch) |
| 5 | ladle over | baby bok choy, scallions, toasted sesame oil (3) | ~1 (broth) + ~2 (wontons) |

Step 3 has a reference and no ingredients, which is allowed — `char-siu.cook`'s last step does
the same. The full-width-row rule applies to steps with neither. **Second file at the ceiling**
at 16 rows.

### 10. `egg-foo-young` — Stir-Fries, serves 4 — 10 rows × 4 ops

Beat (eggs, light soy, white pepper, salt — 4) → fold in (bean sprouts, napa cabbage,
scallions, char siu — 4) → `~fry{3%min}` as four patties (peanut oil — 1) → ladle the gravy
over (house brown sauce — 1). Single chain, and the second half of ranked item 7.

### 11. `house-brown-sauce` — Sauces & Gravies, serves 6 (~2 cups) — 10 rows × 4 ops

Whisk (chicken stock, light soy, oyster sauce, dark soy, sugar, white pepper — 6) →
`~simmer{10%min}` with aromatics lifted out after (fresh ginger, garlic — 2) → thicken
(cornstarch — 1) → finish (toasted sesame oil — 1). Single chain.

The gap doc's *"one table sits under a dozen printed lines on this board"*; here it sits under
two of them on day one, and its `aka` carries `brown gravy` and `egg foo young gravy` so a
searcher arriving from either name lands on it.

### 12. `crab-rangoon` — Dumplings & Rolls, makes 24 — 10 rows × 4 ops

Beat (cream cheese, sugar, garlic powder, Worcestershire sauce, salt — 5) → fold and
`~chill{20%min}` (crab meat, scallions — 2) → fill and seal (wonton wrappers, water — 2) →
`~fry{3%min}` (peanut oil — 1). Single chain. Named American in the title note, per the gap
doc's *"American, not Burmese."*

### 13. `sweet-and-sour-pork` — Stir-Fries, serves 4 — 10 rows × 6 ops

`~marinate{20%min}` (pork shoulder, Shaoxing, light soy, egg — 4) → dredge (cornstarch — 1) →
twice-fry, `~fry{5%min}` + `~fry{2%min}` (peanut oil — 1) → stir-fry, `~stirfry{2%min}` (green
bell pepper, onion, pineapple — 3, branch) → `~simmer{1%min}` (sweet and sour sauce — 1) → toss
(~1 + ~3). Two branches, one ending.

The written sauce enters as one row and the file pairs with it — the gap doc's *"the sauce is
written with nothing under it"*, answered without re-deriving the sauce in a second table.

### 14. `singapore-mei-fun` — Noodles, serves 4 — 15 rows × 5 ops

| # | Step | Rows | Consumes |
| --- | --- | --- | --- |
| 1 | `~soak{10%min}` | rice vermicelli | — |
| 2 | whisk the curry sauce | Madras curry powder, light soy, Shaoxing, sugar, chicken stock, white pepper (6) | — (branch) |
| 3 | scramble, `~fry{1%min}` | eggs, peanut oil (2) | — (branch) |
| 4 | stir-fry, `~stirfry{3%min}` | shrimp, char siu, onion, red bell pepper, bean sprouts (5) | ~1 |
| 5 | toss over high heat, `~stirfry{2%min}` | scallions (1) | ~1 + ~3 (sauce) + ~4 (noodles) |

Three branches, one ending. Pairs with `madras-curry-powder`, which is already in the
collection — the curry powder is the dish, and the gap doc's joke (*"the curry one that is not
from Singapore"*) goes in the `aka` line, not a comment.

## Cross-file wiring

`pairs-with` is made mutual at build, so each edge is written on one side only, and every
target already exists when that file is committed.

| File | pairs-with |
| --- | --- |
| `house-brown-sauce` | — (pointed at) |
| `egg-rolls` | `sweet-and-sour-sauce` |
| `general-tsos-chicken` | `egg-fried-rice`, `egg-rolls` |
| `sesame-chicken` | `egg-fried-rice` |
| `orange-chicken` | `egg-fried-rice` |
| `lo-mein` | `char-siu`, `egg-rolls` |
| `beef-with-broccoli` | `house-brown-sauce`, `egg-fried-rice` |
| `hot-and-sour-soup` | `egg-rolls` |
| `egg-drop-soup` | `egg-fried-rice` |
| `wonton-soup` | `egg-rolls` |
| `egg-foo-young` | `house-brown-sauce` |
| `crab-rangoon` | `sweet-and-sour-sauce` |
| `sweet-and-sour-pork` | `sweet-and-sour-sauce`, `egg-fried-rice` |
| `singapore-mei-fun` | `madras-curry-powder`, `char-siu` |

## Timer names, chosen against `src/lib/time.ts`

Only these are used, and every one is in a vocabulary the reader recognises, so the attention
flag comes from the author rather than from guessing at a label: **unattended** — `rest`,
`marinate`, `chill`, `soak`, `cool`, `simmer`, `boil`, `steep`; **hands-on** — `fry`,
`stirfry`, `sear`, `toss`, `whisk`. No unnamed timer anywhere; no name outside those sets,
because an unrecognised name is read as if it were not there.

## Ordering

Commit order is chosen so that no commit leaves a `pairs-with` pointing at a slug that is not
yet on disk:

1. `house-brown-sauce` (points at nothing)
2. `egg-rolls` (points at an existing sauce; three later files point at it)
3. `general-tsos-chicken` → 4. `sesame-chicken`, `orange-chicken` → 5. `lo-mein`
6. `beef-with-broccoli` → 7. the three soups → 8. `egg-foo-young` → 9. `crab-rangoon`
10. `sweet-and-sour-pork` → 11. `singapore-mei-fun`

That is also ranked order from the gap doc, with the two pointed-at files pulled to the front.
