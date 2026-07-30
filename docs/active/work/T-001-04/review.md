# T-001-04 — Review

The Takeout Counter went from **6 recipes, 1 of its own** to **20 recipes, 15 of its own**.
Four of the twelve empty printed sections are now stocked and a fifth has its gravy. Nothing
outside `recipes/**` was touched, and no existing recipe file was opened.

## What changed

Fourteen files created, none modified, none deleted. Three new folders.

| # | File | Ranked item | Commit |
| --- | --- | --- | --- |
| 1 | `recipes/sauces-and-gravies/house-brown-sauce.cook` | 7 (half) | `af087bd` |
| 2 | `recipes/dumplings-and-rolls/egg-rolls.cook` | 5 | `20908dc` |
| 3 | `recipes/stir-fries/general-tsos-chicken.cook` | 1 | `ce744b7` |
| 4 | `recipes/stir-fries/sesame-chicken.cook` | 2 | `db0e26a` |
| 5 | `recipes/stir-fries/orange-chicken.cook` | 2 | `db0e26a` |
| 6 | `recipes/noodles/lo-mein.cook` | 3 | `4c7911e` |
| 7 | `recipes/stir-fries/beef-with-broccoli.cook` | 4 | `be05b1e` |
| 8 | `recipes/soups/hot-and-sour-soup.cook` | 6 | `befca49` |
| 9 | `recipes/soups/egg-drop-soup.cook` | 6 | `befca49` |
| 10 | `recipes/soups/wonton-soup.cook` | 6 | `befca49` |
| 11 | `recipes/stir-fries/egg-foo-young.cook` | 7 | `0cf8553` |
| 12 | `recipes/dumplings-and-rolls/crab-rangoon.cook` | 8 | `eb1d520` |
| 13 | `recipes/stir-fries/sweet-and-sour-pork.cook` | 9 | `01a12d4` |
| 14 | `recipes/noodles/singapore-mei-fun.cook` | 10 | `6edf20c` |

New folders: `recipes/stir-fries/` (Stir-Fries), `recipes/noodles/` (Noodles),
`recipes/dumplings-and-rolls/` (Dumplings & Rolls). The collection had no shelf for a wok
dish, a noodle dish or a fried wrapped snack — `docs/gaps/README.md` says so outright
(*"There are no dumplings and no noodle dishes"*, *"Nothing is deep-fried"*) — and the ticket
allows a new category and folder for a genuinely new kind of thing. No file outside `recipes/`
was needed to register them: `scripts/find-recipes.mjs` walks the tree and no checker
validates a category string against a list.

## The two things skipped, and why

The criteria require anything skipped from the top of the ranked list to be named here.

1. **Ranked item 12, roast pork (char siu) — already written.** This is the stale entry the
   ticket warned about. `recipes/stews-and-braises/char-siu.cook` exists and already carries
   `counters: Dim Sum Counter, Takeout Counter, Phở & Bánh Mì`, so it needs no edit from
   anyone. Two files here use it as an ingredient row (`lo-mein`, `egg-foo-young`,
   `singapore-mei-fun`) and two pair with it.
2. **Ranked item 10's plain "mei fun" — written as one table, not two.** `singapore-mei-fun`
   is the same soaked-vermicelli table with curry powder in it; plain mei fun is that table
   with one row removed. Writing both would be the gap doc's own *"sauce-across-proteins
   grid"* objection — a table that held both would be splitting the dish. The `aka` line
   carries `singapore mai fun`, `rice vermicelli` and `星洲炒米` so a searcher after either
   lands on it.

Ranked items 11 and 13–20 are below where this ticket stops; the count target is met at item
10 with headroom. They are the next pass, and `docs/gaps/takeout-counter.md` still describes
them accurately — this ticket does not edit that file, since it owns only `recipes/**`.

## Acceptance criteria

| Criterion | State |
| --- | --- |
| ≥16 shelved, ≥10 naming this counter and no other | **met — 20 and 15** |
| Top of the gap list written in order; skips named with a reason | **met** — items 1–10 in ranked order; two skips above |
| `check-recipes.mjs --labels` ok for every new file; staircase reads as verbs | **met** — `all 14 file(s) draw a table`, staircase below |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` incl. an undiacriticked form | **met** — first four enforced by the checker; `counters` and `aka` verified by reading all fourteen back through `normalise()` |
| Every timer named | **met** — 47 timers, 0 unnamed, 0 with an unreadable duration |
| Quantities real for the servings; canonical method, not a shortcut | **met** — see `progress.md`; velveting and the twice-fry are written in rather than skipped |
| Only `recipes/**` modified | **met** — `git status` shows nothing of this ticket's outside `recipes/` |

The shelf count, run over `>> counters:` lines across `recipes/`:

```
shelved at Takeout Counter: 20   exclusive: 15
  exclusive : beef-with-broccoli, crab-rangoon, egg-drop-soup, egg-foo-young, egg-rolls,
              general-tsos-chicken, hot-and-sour-soup, house-brown-sauce, lo-mein,
              orange-chicken, sesame-chicken, singapore-mei-fun, sweet-and-sour-pork,
              sweet-and-sour-sauce, wonton-soup
  shared    : char-siu, chinese-five-spice-powder, egg-fried-rice, scallion-pancakes,
              teriyaki-sauce
```

The label staircase, which is the criterion about a cook's verbs:

```
  ok   recipes/stir-fries/general-tsos-chicken.cook  16 rows x 5 cols
       velvet, rest 30 min
       stir the glaze smooth
         dredge dry, shake off the loose
         sizzle the chiles, pour in, simmer 1 min
           fry 350°F 5 min, again at 375°F 2 min
             toss to coat, serve at once
  ok   recipes/noodles/lo-mein.cook  15 rows x 4 cols
       stir-fry the vegetables 3 min
       boil 3 min, drain, slick with oil
       stir the sauce smooth
         warm the pork through 1 min
           toss over high heat until it coats
  ok   recipes/soups/wonton-soup.cook  16 rows x 5 cols
       mix one way until sticky, chill 20 min
       simmer the broth 10 min
         wrap, a scant teaspoon each
           boil 4 min, until they float and swell
             ladle over, greens in the bowl
```

Every step on every file carries a `>> step.N:` override. The derived label for a wok step is
"Stir-fry , , and in a wok for 3 min" — a fragment, not a verb — so each was set by hand and
read back with `--labels`.

## Test coverage

There are no unit tests to add: this ticket adds data, and the collection's invariants are
tested generically in `src/lib/collection.test.ts`. What ran instead:

| Check | Result |
| --- | --- |
| `check-recipes.mjs --labels` per file, at commit time | `ok` first time, all fourteen |
| `check-recipes.mjs` over the whole collection | `all 280 file(s) draw a table` |
| unique slugs, counters known, pairings resolve, one plain way per dish | ok — run directly, see the gap below |
| `npx vitest run` | 1 failed \| 405 passed — **identical to the baseline taken before writing** |
| `git status --porcelain` over this ticket's paths | empty |

**Gap in coverage, and how it was covered instead.** `npm run recipes` does not complete on
this branch, and `src/generated/recipes.json` therefore cannot be refreshed, which means
`vitest` is testing the collection as it stood *before* these fourteen landed. The cause is
not this ticket: the build throws on the first dangling `pairs-with` it meets, and those
belong to sibling tickets still working:

```
Error: recipes/dressings-and-dips/nuoc-cham.cook pairs with "cha-gio", which is not a
       recipe here.
```

A scan of every `pairs-with` in the collection finds four dangling edges — `nuoc-cham` →
`cha-gio`, `goi-cuon`, `bun-thit-nuong` and `pho-broth` → `pho-bo`, all T-001-02's — and
**none from these fourteen**. They resolve when that ticket writes those dishes.

To close the gap rather than report it, the five collection-scope checks `parse-recipes.mjs`
performs were run directly against a fresh `normalise()` of every `.cook` file on disk,
fourteen included: unique slugs (294 files, no duplicate), no recipe homeless, no unknown
counter name, no dangling or self-pairing `pairs-with` from these files, no dish with two
plain ways. All clean. That script is read-only, lives in the session scratchpad, and wrote
nothing into the repository.

The residual risk is small and named: the only invariants not re-run against the new files
are the ones in `collection.test.ts` and `layout.test.ts` that need a built
`src/generated/recipes.json`, and every one of them has a direct equivalent above except the
table-tiling assertion — which `check-recipes.mjs` already runs per file, and which passed on
all fourteen.

## Open concerns

**1. Two counter tickets have invented overlapping categories for the same kind of dish.**
This ticket created `recipes/noodles/` and `recipes/stir-fries/`; a sibling has created
`recipes/noodles-and-stir-fries/` for the Thai Kitchen. Both are legitimate under the ticket
wording and neither can see the other's decision in time. The collection now has two shelves
for one kind of thing. This is exactly the sort of thing T-001-18 is chartered to catch
(*"reads the whole collection afterwards for the things no single counter ticket can see"*),
and it is a rename of folders after the fact, not a rewrite. Flagged, not fixed — the ticket
may not edit another ticket's files.

**2. New ingredients will fall through `src/data/aisles.json`** until T-001-17 places them:
oyster sauce, black vinegar, dried wood ear mushrooms, dried lily buds, bamboo shoots, wonton
wrappers, egg roll wrappers, fresh egg noodles, rice vermicelli, bean sprouts, napa cabbage,
baby bok choy, cream cheese, crab meat, dried red chiles, Worcestershire sauce. Expected —
that file is T-001-17's, and this is the same note T-001-01 left.

**3. The three new categories print nowhere until T-001-17 runs.** The counter has
`categories: []` in `counters.json`, so nothing arrives by fallback; all fourteen shelve
because they name the counter outright. But the menu page renders *sections*, and the sections
for Chow Mein / Lo Mein / Egg Foo Young / Soup / Combination Platters are still empty lists in
`counters.json`. **The work is invisible on the menu page until T-001-17 puts these slugs into
sections** — which is that ticket's whole job, and the story's design.

**4. `src/lib/schedule.test.ts` is still red**, unchanged from T-001-01's report. Nothing here
is long enough to displace a ferment — the longest path on this board is a 30-minute velvet —
so this ticket neither fixed nor worsened it. The remedy T-001-01 suggested (give the test to
T-001-18, or loosen it to test the property rather than three fixed names) still stands.

## Smaller notes

- **Three near-identical fried-chicken tables** — General Tso's, sesame, orange — are
  deliberate, and are the gap doc's own words (*"the same fried chicken under two other
  glazes… one operation apart"*). They are three lines on the board, not equipment variants,
  so they take no shared `dish:` key. A reader comparing them should see the same first three
  steps and three different step 4s.
- **`house-brown-sauce` is the only component written as its own table.** The other eleven the
  gap doc lists stayed as ingredient rows, because cooklang gives this repo no sub-recipe
  reference — a component table would not shorten a single dish, only duplicate its rows. This
  matches what the collection already does with `garam masala` and `chicken stock`.
- **Chicken stock was deliberately not written**, though four files here use it. T-001-01's
  review records it as wanted by both the Deli and this counter and **owned by nobody**;
  writing it here would race T-001-14 for the slug. It stays a row, as it is in eight files
  that predate this ticket. **That component is still unowned and still needs a board
  decision.**
- **`egg-drop-soup` is the thinnest table at 9 rows × 5 cols.** It is a four-ingredient soup;
  padding it would have been dishonest. Comfortably over the checker's floor.
- **Branching costs no columns.** The files with two or three branches come out *narrower*
  than their operation count (6 operations in 5 columns, 5 in 4), because branches that start
  together share a column. Worth knowing before anyone tries to flatten one for phone width.
- **The dish notes that carry a warning or a technique are in the step text**, not comments —
  the reason egg roll filling must be cooled, why the second fry exists, why the soup is
  thickened before the egg goes in, and that crab rangoon is American rather than Burmese.
  A table has nowhere else to put them.

## Disposition

**Pass.** All seven acceptance criteria are met, with the shelf count at 20/15 against a
required 16/10. The fourteen files are committed through `lisa commit-ticket` with exact
`--include` paths across eleven commits, and nothing this ticket owns is left staged,
modified or untracked. The two open items that touch other files — the duplicated
noodle/stir-fry shelf and the unowned chicken stock — are recorded here for T-001-18 and the
board rather than fixed, because this ticket may not edit another ticket's files. The two red
signals on the branch (`schedule.test.ts`, and `npm run recipes`) both predate or sit outside
this work, and both are evidenced above.
