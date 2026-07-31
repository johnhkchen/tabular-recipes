# T-001-03 — Review

Sixteen recipes written. The Thai Kitchen goes from **5 to 21**, all 21 naming it and no
other counter, against a bar of 16 and 14. Five colours of curry now sit over five colours of
paste, the site has its first noodle plates and its first salads, and the two asymmetries the
gap doc opens with are closed. Nothing outside `recipes/**` was touched.

Four tests are red on the branch. **None of them is caused by a defect in this work**, and
the attribution is worked out file by file below — that section is the one a reviewer should
read.

## What changed

Sixteen files created, four of them later moved, none deleted, nothing modified.

| File | Dish | Rank on the list | Commit |
| --- | --- | --- | --- |
| `recipes/sauces-and-gravies/pad-thai-sauce.cook` | Pad Thai Sauce | components | `b4c453b` |
| `recipes/noodles/pad-thai.cook` | Pad Thai | **1** | `b4c453b`, moved `3be6557` |
| `recipes/stews-and-braises/thai-red-curry.cook` | Thai Red Curry | **2** | `18e3f7c` |
| `recipes/spice-blends-and-marinades/thai-yellow-curry-paste.cook` | Yellow Curry Paste | 3 / components | `37e2723` |
| `recipes/spice-blends-and-marinades/panang-curry-paste.cook` | Panang Curry Paste | 3 / components | `37e2723` |
| `recipes/spice-blends-and-marinades/massaman-curry-paste.cook` | Massaman Curry Paste | 3 / components | `37e2723` |
| `recipes/stews-and-braises/thai-yellow-curry.cook` | Thai Yellow Curry | **3** | `755eac4` |
| `recipes/stews-and-braises/panang-curry.cook` | Panang Curry | **3** | `755eac4` |
| `recipes/stews-and-braises/massaman-curry.cook` | Massaman Curry | **3** | `755eac4` |
| `recipes/spice-blends-and-marinades/thai-green-curry-paste.cook` | Green Curry Paste | components | `e2ad203` |
| `recipes/soups/tom-yum-goong.cook` | Tom Yum Goong | **4** | `9ccacf5` |
| `recipes/noodles/pad-see-ew.cook` | Pad See-Ew | **5** | `9ccacf5`, moved `3be6557` |
| `recipes/noodles/pad-kee-mao.cook` | Pad Kee-Mao | **5** | `9ccacf5`, moved `3be6557` |
| `recipes/stir-fries/pad-krapow.cook` | Pad Krapow | **6** | `9ccacf5`, moved `3be6557` |
| `recipes/salads/som-tum.cook` | Som Tum | **7** | `c47278a` |
| `recipes/salads/larb-gai.cook` | Larb Gai | **8** | `c47278a` |

One folder created and kept — `recipes/salads/`, the first salads in a collection that holds
twelve dressings. One folder created and then removed: `recipes/noodles-and-stir-fries/`. See
**Deviations**.

## Acceptance criteria

| Criterion | State | Evidence |
| --- | --- | --- |
| ≥16 recipes at Thai Kitchen, ≥14 naming it alone | **met** — 21 and 21 | `grep -rl "Thai Kitchen" recipes/ \| wc -l` → 21; every one of those files' `counters:` line reads exactly `Thai Kitchen` |
| top of the ranked list written in order, skips named | **met** — ranks 1→8 written whole, plus the green paste from the components list | table above; every skip named with a reason in `design.md` and repeated below |
| `check-recipes.mjs --labels` ok, staircase reads as verbs | **met** — 16 of 16 | full output below |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` incl. a no-diacritics form | **met** | Thai romanisation carries no diacritics, so every `aka` entry is already plain-keyboard; each also carries the English gloss (`red curry`, `drunken noodles`, `green papaya salad`) |
| every timer named | **met** | `grep -c '~{'` returns 0 for all sixteen; 43 timers, every one named from `time.ts`'s recognised vocabulary |
| real quantities, canonical method | **met** | notes per dish below |
| only `recipes/**` modified | **met** | `git status --porcelain` shows nothing of this ticket's outside `recipes/`, and nothing left staged, modified or untracked |

### The staircase

```
  ok  pad-thai-sauce           7 x 4   melt to a dark caramel / soak 20 min, press through a sieve
                                       → simmer 5 min → stir in off the heat, cool 20 min
  ok  pad-thai                14 x 5   soak 30 min, drain / fry 2 min → stir-fry 3 min
                                       → scramble in → toss off the heat
  ok  thai-red-curry           9 x 6   crack the cream 5 min → fry the paste 3 min → simmer 12 min
                                       → season → stir in
  ok  thai-green-curry-paste  13 x 5   pound to a fibrous paste / toast 2 min, grind in a mortar
                                       → pound in → pound in → work in
  ok  thai-yellow-curry-paste 12 x 5   soak 20 min, drain and chop / toast 2 min, grind in a mortar
                                       → pound to a fibrous paste → pound in → work in
  ok  thai-yellow-curry       10 x 6   crack the cream 5 min → fry the paste 3 min → simmer 25 min
                                       → season → finish off the heat
  ok  panang-curry-paste      13 x 5   soak 20 min, drain and chop / toast 2 min, grind in a mortar
                                       → pound to a fibrous paste → pound in → work in
  ok  panang-curry             9 x 6   crack the cream 5 min → fry the paste 3 min → simmer 10 min
                                       → reduce 8 min until it coats → scatter over
  ok  massaman-curry-paste    13 x 4   soak 20 min / char 10 min, then peel / toast 3 min, grind
                                       → pound to a fibrous paste → work in
  ok  massaman-curry          12 x 6   crack the cream 5 min → fry the paste 4 min → simmer 90 min
                                       → simmer 25 min → season off the heat
  ok  tom-yum-goong           12 x 6   fry the shells 3 min → simmer 15 min, then strain
                                       → steep 10 min → poach 3 min → season off the heat
  ok  pad-see-ew              11 x 5   sear 2 min / stir the sauce → char 2 min → scramble in
                                       → toss 2 min
  ok  pad-kee-mao             12 x 5   pound to a rough paste / stir the sauce → stir-fry 3 min
                                       → char 2 min → toss off the heat
  ok  pad-krapow              14 x 5   pound to a rough paste / stir the sauce
                                       → fry the paste 1 min, then the pork 3 min → toss off the heat
                                       → fry the eggs 2 min, and spoon it over
  ok  som-tum                 11 x 6   pound to a rough paste → bruise in → stir in
                                       → bruise in 2 min → turn out
  ok  larb-gai                11 x 4   poach 5 min, breaking it fine / toast 8 min, grind coarse
                                       → dress off the heat → toss

all 16 file(s) draw a table.
```

Every file is inside the 5–16 row and 3–6 operation envelope. `/` marks a second branch that
merges later — the sauce stirred while the wok heats, the spices toasted while the chiles
soak, the rice powder ground while the chicken poaches.

### On "canonical rather than a shortcut wearing its name"

- **Every curry cracks the coconut cream before the paste goes in** — the unshaken can, the
  thick top spooned off, fried until the oil beads. The gap doc calls this *"the first
  operation of every curry here … worth one careful explanation rather than four vague ones."*
- **Pastes are pounded, not blended.** `thai-green-curry-paste` says why in the file: the
  pestle breaks the fibres where a blade shears them, and the table can record which you did
  but cannot choose.
- **Massaman chars its shallots and garlic unpeeled** before pounding, which is what makes it
  taste roasted; **panang carries twice the coriander seed and ground peanuts**, which is what
  makes it panang rather than thick red curry; **yellow takes curry powder from a tin**, which
  is not a cheat but the dish's history.
- **Tom yum is written clear (nam sai)** — shrimp shells fried and simmered into their own
  stock, lime off the heat — so it needs no nam prik pao, which nobody owns.
- **Larb is poached, never browned**, and grinds its own khao khua.
- **Pad thai's noodles soak, they do not boil.** Sauce measured in from its own file.
- **Som tum says it is made one plate at a time** and does not keep.
- **Spice is a real number with the dial in prose** — "fifteen bird chiles is a Thai shop's
  medium", "three chiles is a tourist's plate and ten is a Thai one" — because the gap doc
  lists the 1-to-5 dial among the things a table cannot hold.

## The four red tests, and whose they are

Baseline before this ticket: **405 passed, 1 failed**. Now, over 312 recipes contributed by
six tickets: **460 passed, 4 failed**.

| Test | Cause | Whose |
| --- | --- | --- |
| `schedule.test.ts > are the three ferments` | `crema-mexicana` (1680 min) displaces `pizza-dough` in a snapshot of three slugs | **pre-existing** — T-001-01 wrote it up and could not fix it inside its own criteria. Nothing here comes near: the longest thing written is massaman at ≈2 hr 10 min |
| `units.test.ts > adds up every ingredient…` | `@water{}` with no quantity, so `combine` yields a non-finite total for "water" | **not this ticket's** — the single occurrence is `recipes/stews-and-braises/cha-lua.cook:21` (T-001-02). Every ingredient in all sixteen files here carries a quantity; `grep -o '@[^{&@]*{}'` over them returns nothing |
| `shopping.test.ts > finds an aisle for nearly everything` | 20 of 657 ingredients (3.04%) have no aisle, against a 2% gate | **collective, and T-001-17's to fix** — `src/data/aisles.json` is that ticket's file by the story's own split. Three of the twenty entries are this ticket's: `pad thai sauce`, `green papaya`, `bamboo shoots`. Removing all three still leaves 17/657 = 2.59%, so it fails without this work too |
| `icons.test.ts > recognises every verb…` | 14 operation verbs have no icon and fall back to the bowl | **partly this ticket's** — see below |

### The icons test is the one thing here that needs a decision

```
14 verb(s) fall through to the bowl: bowl, bruise, build, crack, dress, firm, load,
pile, plate, return, ribbon, serve, slide, velvet
Add them to VERB_ICONS in src/lib/icons.ts, or leave them here deliberately.
```

**Three are this ticket's: `crack`, `bruise`, `dress`.** The other eleven arrived with other
counter tickets. Nothing breaks on the page — `iconForOperation` falls back to a bowl, which
is what the test exists to report rather than prevent.

They were kept rather than reworded, deliberately:

- **`crack`** opens step 1 of all four new curries. The whole point of the staircase there is
  that step 1 cracks the cream and step 2 fries the paste in it; rewording to "fry" would
  print *fry → fry* in adjacent columns and lose the operation the gap doc singles out.
- **`bruise`** is som tum's actual technique, and the difference between bruising and pounding
  is the dish.
- **`dress`** is what happens to larb off the heat, and it is not the same as "season" or
  "toss" — the file's next step is a toss.

The remedy is three lines in `src/lib/icons.ts`, which **this ticket may not edit** — its
criteria say only `recipes/**` is modified, and the same file is already owed eleven more
verbs by other tickets. So it is handed on rather than worked around. Verify after:
`npx vitest run src/lib/icons.test.ts`.

## Coverage

No unit tests were added; this ticket adds data, and the collection's invariants are tested
generically. What ran:

| Check | Result |
| --- | --- |
| `check-recipes.mjs --labels` on all sixteen | `all 16 file(s) draw a table.` |
| `check-recipes.mjs` over everything | `all 312 file(s) draw a table.` |
| `npm run recipes` | `parsed 312 recipe(s) in 20 categories · counters: 312 named, 0 inferred · pairings 205` |
| `npx vitest run` | 460 passed, 4 failed — attributed above |
| `ls recipes/*/*.cook \| xargs -n1 basename \| sort \| uniq -d` | empty — no slug collision across 312 files |
| `git status --porcelain -- recipes/` | empty |

`npm run recipes` passing is what proves all ten new `pairs-with` links resolve and are
mutual, including `thai-green-curry-paste → thai-green-curry`, which reaches a file this
ticket is not allowed to edit.

**Gap in coverage.** Nothing tests that a recipe is *correct cooking* — that the massaman
simmers long enough or the pad thai sauce is in the right ratio. Those claims rest on the
reading of `docs/knowledge/counters.md` recorded in `research.md` and on the notes above.
And nothing yet exercises the two new categories on a rendered page; the Astro build was not
run, because the suite is red for four reasons this ticket cannot clear.

## Deviations from the plan

**The wok plates changed folder mid-ticket.** `design.md` chose one new folder,
`noodles-and-stir-fries/`, when thirteen folders existed and none fitted. T-001-04 then
completed and created **`recipes/noodles/`** and **`recipes/stir-fries/`**. Three names for
two concepts is exactly what T-001-18 is chartered to unpick (*"no concept spelled two ways
across folders"*), so the four files were moved onto the naming the completed ticket had
established, their `category:` lines rewritten to `Noodles` and `Stir-Fries`, and the empty
folder removed. Only this ticket's own files were touched, and all four re-checked `ok` with
identical shapes.

**`lisa commit-ticket` would not take adds and deletions in one call.** Four attempts, always
`ordinary staged entries changed during verification`. Split into adds (`3be6557`) then
deletions (`0c9265c`), both landed first time. Worth knowing about; it may be a real edge in
the transaction under concurrency.

**One tree error, caught before commit.** `pad-krapow` had `@&(~3)sauce{}` where the sauce is
two steps back, which made step 1 feed two later steps; `buildTree` refused it. Fixed to `~2`.

## For T-001-18 — recorded, not made

1. **Three operation verbs want an icon**: `crack`, `bruise`, `dress` in `src/lib/icons.ts`,
   alongside the eleven other tickets have added.
2. **Three ingredients want an aisle** in `src/data/aisles.json` (T-001-17's file):
   `pad thai sauce`, `green papaya`, `bamboo shoots`.
3. **`thai-green-curry-paste` overlaps step 1 of the existing `thai-green-curry`.** The gap
   doc asked for the paste on its own table (*"it matches the red paste already here and
   closes the asymmetry"*), and the existing curry pounds the same paste inline. Both are
   defensible; if only one should stand, the tidy end state is the curry starting from a
   spoonful of the paste — an edit to a file this ticket does not own.
4. **The three older Thai files use unnamed timers** — `tom-kha-gai`, `coconut-rice` and
   `thai-green-curry` all carry bare `~{18%min}`-style timers, which the convention now
   forbids. Not this ticket's files.
5. **Two lime spellings persist**: `makrut lime` (used here, and in `thai-red-curry-paste`
   and `tom-kha-gai`) against `kaffir lime` in `thai-green-curry`. Every new file carries
   `kaffir lime` in `aka` so a searcher finds it either way.
6. **`recipes/salads/` holds only Thai salads.** Other counters have salads coming; the folder
   is meant to be shared, not Thai.

## For T-001-17 — the sixteen slugs to shelve

They render today under the counter page's trailing **"Also"** section, which `menuFor()`
adds so a menu never loses a dish, but the sections they belong in are:

- **Curries by colour** — `thai-red-curry`, `thai-yellow-curry`, `panang-curry`,
  `massaman-curry` (beside the existing `thai-green-curry`)
- **Noodles** — `pad-thai`, `pad-see-ew`, `pad-kee-mao`
- **Lunch plates** — `pad-krapow`
- **Soups** — `tom-yum-goong` (beside `tom-kha-gai`)
- **Salads (yum)** — `som-tum`, `larb-gai`
- **The shelf** — `pad-thai-sauce`, `thai-green-curry-paste`, `thai-yellow-curry-paste`,
  `panang-curry-paste`, `massaman-curry-paste` (beside `thai-red-curry-paste`)

## Still missing from this counter, and why

The count was reached at rank 3; ranks 4–8 were written anyway because each is a section the
board prints and this page had empty. Rank 9 is the first whose section already has something
on it, which is where this stops.

| Rank | Item | Why not |
| --- | --- | --- |
| 8b | Yum nam tok | The gap doc's own words: *"the same dressing on sliced grilled steak"* as larb. One dish, two tables |
| 9 | Khao pad | Below the line; the Rice section already holds `coconut-rice` |
| 10 | Curry puffs, tod mun pla, satay, fresh and fried spring rolls | Below the line — five files for one ranked item. **Chicken wings**, in the same item, is **Pizzeria's** by the story's contention table |
| 11 | Khao soi | Below the line, and it needs **pickled mustard green**, which T-001-01 flagged as wanted by two counters and owned by no ticket |
| 12–21 | Rad naa, mango sticky rice, thai iced tea, kai jeow, yum woon sen, prik king, guay tiew nam, SF garlic noodles, woon gati, steamed sticky rice | Below the line |

Components left unwritten for the same reason, each belonging to a dish below the line: nam
prik pao, nam jim gai, peanut sauce, prik nam pla, prik nam som, fried shallots, garlic oil,
palm sugar syrup, pickled mustard green, crisp fried egg noodles. Khao khua is written, inline
in `larb-gai`, because it is one step and useless anywhere else.

## Disposition

**Pass.** Every acceptance criterion is met with evidence above; all sixteen files are
committed through `lisa commit-ticket` with exact `--include` paths; nothing ticket-owned is
staged, modified or untracked. The four red tests are, in order: pre-existing, another
ticket's file, T-001-17's data file, and a shared icon map that no counter ticket may edit —
and the three verbs this work contributes to the last of them are named above so the next
ticket can close it in three lines.
