# T-007-04 — Research

The food half of the cha chaan teng: the plates, bowls and sandwiches a set meal is built around.
This is a description of what is already here and what the ticket is standing on. No decisions.

---

## 1. Where the authority sits

Three documents, and they do not all say the same thing.

| Document | What it is | Standing |
| --- | --- | --- |
| `docs/gaps/cha-chaan-teng.md` | T-007-01's ranked work list, 24 items | The ticket names it "the authority" |
| `docs/active/tickets/T-007-04-…md` | This ticket's own shape and criteria | "the shape below is what this ticket expects back" |
| `docs/knowledge/counters.md` §Cha Chaan Teng | The vocabulary table — characters, romanisation, plain-keyboard spellings | Where `aka` lines come from |

The gap page is the ranked list; the ticket is the shape. **They diverge in five places** and that
divergence is the single most important research finding, so it is set out in full in §5.

The story `S-007-a-counter-you-can-shop-for.md` sits above both. Its claim is that this shelf is
cookable from an ordinary supermarket, which is the constraint every file here has to survive.

## 2. The collection as it stands

658 `.cook` files under `recipes/`, in 27 category folders. All 658 pass
`node scripts/check-recipes.mjs` today — the baseline is clean, so any failure after this ticket
belongs to this ticket.

Folders relevant here: `soups/`, `noodles/`, `rice-beans-and-grains/`, `sandwiches-and-rolls/`,
`stews-and-braises/`, `stir-fries/`, `sauces-and-gravies/`, `eggs/`.

Twenty-two counters live in `src/data/counters.json`. `Cha Chaan Teng` exists with seven ordered
sections and **empty item lists**:

1. The set meals (常餐 · 早餐 · 下午茶餐)
2. The drinks counter
3. Toast and the bun case
4. **Macaroni, noodles and things in soup**
5. **Rice plates**
6. **Sandwiches and buns**
7. Also here

Sections 4, 5 and 6 are this ticket's; 2 and 3 are T-007-03's; 1 cannot hold a recipe at all
(a set is a rule, not a dish, and the gap page files it under *what a table cannot hold*). Section
7 is the overflow, and T-007-05's acceptance criteria say the built menu must render **no "Also
here" section** — so anything I write that lands nowhere is a problem I create for the shelver.

Naming a counter that does not exist is a build error, so `>> counters: Cha Chaan Teng` is safe:
the counter is already there.

## 3. What a `.cook` file has to do

Read from `README.md`, `docs/knowledge/voice.md` and `scripts/check-recipes.mjs`.

**Required metadata:** `title`, `category`, `tags`, `servings`. Everything else — `counters`, `aka`,
`pairs-with`, `time`, `slack`, `dish`, `kit`, `step.N` — is optional, though every file in the
collection carries `time`.

**The table is a merge tree.** Each step after the first must consume what came before with
`@&(~1)thing{}` (one step back) or `@&(3)thing{}` (step 3). A step consuming nothing starts a new
branch, and every branch must merge into one final step. Two endings is a build error; so is
splitting one preparation into two later steps.

**A step with no ingredients becomes a full-width prose row**, printed three times (table, prep,
cook). Those must sit at the top of the file, because `~1` counts prep steps too.

**Size**: 5 to 16 ingredient rows, 3 to 6 operations. The checker fails a file under 3 rows or
under 3 operations; the 16/6 ceilings are the README's convention, and the ticket restates them as
an acceptance criterion with an escape hatch ("or the work artifact says why not").

**The five caps, enforced — `CAPS_FAIL_BUILD = true`:**

| Field | Cap | Aim |
| --- | ---: | ---: |
| `>> step.N:` operation cell | 70 | 25 |
| the step's own words, once `step.N:` is set | 150 | one sentence |
| a full-width prose row | 120 | one sentence |
| `>> slack:` reason | 200 | ~120 |
| an ingredient `(note)` | 80 | 15 |

Over any cap and the whole run fails. No waivers, no skip list.

**Timers must be named** — `~fry{8%min}`, `~simmer{2%hr}`. An unnamed timer is read from the
operation label and, failing that, counted as time you stand there.

**`slack` is a level plus a reason**, one of `forgiving` / `narrow` / `unforgiving`. A level with no
reason is a build error; a level nobody agreed on is a build error. Most of the collection has no
slack line and that is the documented correct answer when a file cannot name a real failure.

## 4. The `&` mechanism, tested

`scripts/normalise.mjs` treats an ingredient as a tree edge only when
`relation.type === 'reference'` **and** `relation.reference_target === 'step'`. I ran the parser
directly on a probe file to see what else it can produce:

- `@&(~1)sauce{}` → `reference_target: "step"` — a tree edge. This is the one that works.
- `@&x{2%cup}` → `reference_target: "ingredient"` — an ingredient back-reference, **dropped**:
  `normalise` only pushes to `refs` when the target is `step`, so this lands as a plain ingredient.
- `@./sauces-and-gravies/x{1%cup}` → parses as an ordinary **definition** with a `reference`
  component list that `normalise` never reads. A cross-file recipe reference is, to this codebase,
  an ingredient row with a slash in its name.

**So `&` is intra-file only.** There is no mechanism by which a file consumes another file via `&`.
The collection's actual precedent for a component is `recipes/pizzas/margherita.cook`:

```cooklang
Stretch @pizza dough{2%balls}(250 g each; from the recipe on this shelf) …
>> pairs-with: pizza-dough, basil-pesto
```

— an ordinary ingredient row, a note pointing at the other file, and a `pairs-with` line. That is
what "two files" means in this codebase, and it is *not* consumption via `&`. This bears directly
on the ticket's baked-pork-chop-rice criterion and is carried into Design.

## 5. Where the ticket and the work list diverge

Five items the ticket asks for by name are **not in the gap page's ranked list at all**:

| Ticket asks for | Rank on the work list | Note |
| --- | --- | --- |
| 湯通粉 | rank 7, as **火腿通粉** | Same dish, two board names. No conflict. |
| 餐蛋麵 | rank 8, as **公仔麵** | Same dish. The counters table gives 公仔麵 as the noodle and 餐蛋 as the topping. |
| 沙嗲牛肉麵 | rank 16 | Listed; its satay beef is named under *Components it would need*. |
| 羅宋湯 | rank 9 | Listed, with "no beetroot" and "say it is not `borscht`". |
| 焗豬扒飯 | rank 14 | Listed. Its 茄汁 is named under *Components*. |
| 咖喱牛腩飯 | rank 15 | Listed (as 咖喱牛腩); 咖喱汁 is rank 13. |
| 免治牛肉飯 | rank 17 | Listed. |
| **豉油皇炒麵** | **absent** | Not ranked, not mentioned anywhere on the page. |
| **白汁海鮮焗飯** | **absent** | Not ranked. `bechamel` is named as its 白汁 pairing. |
| **滑蛋蝦仁飯** | **absent** as a plate — but **滑蛋 is rank 6** | The technique is ranked high; the plate is not named. |
| **揚州炒飯** | **absent** | Not ranked. |
| **蛋治** | **absent** — but **餐蛋治 is rank 5** | The luncheon-meat sandwich is ranked; the plain egg one is not. |
| 豬扒包 | rank 18 | Listed, with the roll called out as the hard part. |

The ticket says *"Whichever of 白汁海鮮焗飯 / 滑蛋蝦仁飯 / 揚州炒飯 the work list ranked"* — and the
work list ranked **none of the three**. That instruction has no answer as written. What the work
list *does* rank, and the ticket does not mention, is:

- rank 10 **瑞士雞翼** Swiss wings — poached not fried, twenty minutes, a saucepan
- rank 11 **茄汁豬扒** pork chop in tomato sauce — "the pan version of rank 14, and much the easier
  one… Writing this first gives the baked one its sauce"
- rank 13 **咖喱汁** Hong Kong curry sauce — "earns a file"
- rank 19 **咖喱魚蛋** curry fish balls — explicitly flagged as blocked on a one-shop ingredient
- rank 22 **撈丁** dry instant noodles
- rank 23 **焗葡國雞飯** baked Portuguese chicken rice — "write it only after rank 14 exists"

## 6. The files already in the collection that these touch

| Slug | Path | What it actually is | Consequence here |
| --- | --- | --- | --- |
| `borscht` | `soups/` | 1½ lb grated **beetroot**, beef short ribs, dill, sour cream, 2 hr 15. Ukrainian. `counters: Deli, One Pot`. | A new 羅宋湯 file must carry `borscht` in `aka` and say what it is not. |
| `beef-chow-fun` | `noodles/` | Dry-fried flank over ho fun, `aka` already carries 乾炒牛河, `counters: Dim Sum Counter`. Says *"over the fiercest heat you have"* and **has no slack line and no wok-hei disclaimer**. | It has *not* settled the wok question in prose. Shelving it here is T-007-05's job; nothing to write. |
| `lo-mein` | `noodles/` | Chinese-American 撈麵 — boiled wheat noodles tossed with char siu and oyster sauce. | The gap page **refuses** to shelve it here. Not mine either way. |
| `club-sandwich` | `sandwiches-and-rolls/` | Three slices, bacon, turkey, `counters: Diner, Deli`. | Shelving job. Do not rewrite. |
| `french-toast` | `flatbreads-and-pancakes/` | Griddled custard-soaked challah. | T-007-03's problem, not mine. **I must not write 西多士.** |
| `egg-fried-rice` | `rice-beans-and-grains/` | Eggs, day-old jasmine rice, peas, scallions, wok, `counters: Takeout Counter, Dim Sum Counter`. | The obvious `pairs-with` for a baked rice plate. Not a rewrite. |
| `homemade-ketchup` | `sauces-and-gravies/` | Onion, canned tomato, brown sugar, cider vinegar, allspice, 1 hr 30. | The gap page says pair to it and say what 茄汁 adds. |
| `bechamel` | `sauces-and-gravies/` | Roux and milk, 25 min. | Named as the 白汁 pairing if a baked seafood plate is written. |
| `char-siu` | — | Already written; the gap page notes it belongs on this board. | T-007-05's shelving note. |
| `singapore-mei-fun` | `noodles/` | Madras curry powder, rice vermicelli, wok. | Precedent for curry powder as a supermarket ingredient. |

## 7. The pantry this shelf brings, and what the collection already knows

`evaporated milk` appears in the collection today only in sweets — `flan`, `egg-custard-tart`,
`mango-pudding`, `chocoflan`, `tres-leches-cake`, `sweet-potato-pie`. **Luncheon meat, instant
noodles, custard powder, golden syrup and satay sauce appear nowhere.**

That matters for two reasons. First, T-007-05 has to find each of them an aisle and has been warned
that `condensed milk` and `evaporated milk` catching one pattern is a silent wrong shelf — so the
ingredient **names** I write are load-bearing and must be exact and consistent. Second, the ticket's
first trap is that writing *around* the tin is the failure: naming "good-quality ham" instead of
luncheon meat restates the snobbery S-007 exists to remove.

Sourcing constraint, from the acceptance criteria: no ingredient that cannot be bought in an
ordinary supermarket **or an ordinary Asian grocery**. The gap page's own rank-19 entry (curry fish
balls) is the worked example of a dish that fails this and is therefore written up rather than
committed.

## 8. Boundaries

- **`.cook` files in `recipes/` only.** Not `src/`, not `docs/gaps/**`, not
  `src/data/counters.json`. Work artifacts go to `docs/active/work/T-007-04/` (published by Lisa
  from the private attempt directory).
- **T-007-03 runs in parallel** and owns every drink, 西多士, 奶油多/厚多士 and 菠蘿油. If a dish of
  mine wants tea, it is a note for T-007-05, not a second tea file.
- **T-007-02 runs in parallel** and deletes sixteen 老火湯 from `recipes/soups/`. I add files to that
  same folder. Different files, so no collision — but `npm run check` runs over the whole
  collection, so a green run of mine depends on their tree being green too.
- **T-007-05 shelves.** Every placement decision I make is a *note*, not an edit. Section titles are
  fixed and I write to them.

## 9. Constraints and assumptions carried into Design

1. `&` cannot cross files. Any "two files" split therefore cannot satisfy "the assembly consuming
   the component via `&`". These two requirements are in tension and Design has to resolve it.
2. The romanisations in `counters.md` and the gap page are marked **not to be trusted blind** —
   the gap page's own closing caution says confirm each. They are unaccented Jyutping-ish forms.
3. `aka` must carry three things per the criteria: the characters, a Cantonese romanisation, and
   the plain-keyboard spelling an English speaker would type.
4. Twelve files minimum; 湯通粉, 餐蛋麵 and 焗豬扒飯 are mandatory.
5. The tomato sauce (茄汁) is wanted by four dishes and the curry sauce (咖喱汁) by three. Both are
   named as components on the work list. Whether either becomes a file is Design's call.
6. `beef-chow-fun` did **not** settle the wok-hei question in prose, so any fried-noodle plate I
   write has to settle it for itself or be ranked out with a reason.
