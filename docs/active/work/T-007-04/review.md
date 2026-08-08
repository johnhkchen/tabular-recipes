# T-007-04 — Review

Fourteen new `.cook` files at the Cha Chaan Teng — the plates, bowls and sandwiches a set meal is
built around. Nothing outside `recipes/**/*.cook` and this ticket's work artifacts was touched.

---

## What changed

**Created — 14 files, no modifications, no deletions.**

```
recipes/soups/ham-macaroni-soup.cook                              湯通粉 / 火腿通粉
recipes/soups/hong-kong-borscht.cook                              羅宋湯
recipes/noodles/luncheon-meat-and-egg-noodles.cook                餐蛋麵 / 公仔麵
recipes/noodles/satay-beef-noodles.cook                           沙嗲牛肉麵
recipes/noodles/soy-sauce-pan-fried-noodles.cook                  豉油皇炒麵
recipes/rice-beans-and-grains/baked-pork-chop-rice.cook           焗豬扒飯
recipes/rice-beans-and-grains/pork-chop-in-tomato-sauce.cook      茄汁豬扒
recipes/rice-beans-and-grains/minced-beef-rice.cook               免治牛肉飯
recipes/rice-beans-and-grains/shrimp-and-egg-rice.cook            滑蛋蝦仁飯
recipes/stews-and-braises/curry-beef-brisket.cook                 咖喱牛腩
recipes/stews-and-braises/swiss-wings.cook                        瑞士雞翼
recipes/sandwiches-and-rolls/hong-kong-egg-sandwich.cook          蛋治
recipes/sandwiches-and-rolls/luncheon-meat-and-egg-sandwich.cook  餐蛋治
recipes/sandwiches-and-rolls/pork-chop-bun.cook                   豬扒包
```

Six commits, all through `lisa commit-ticket` with exact `--include` paths: `f98affd`, `30748a3`,
`669dd57`, `cfe4839`, `10427bf`, `27e5349`. `git status --porcelain recipes` is empty — nothing of
this ticket's is staged, modified or untracked.

## Test coverage

This ticket's product is data, and the collection tests it in three existing layers. No new test was
added, and a test asserting "this is a real dish" is not writable.

| Layer | Result |
| --- | --- |
| `npm run check` — every file, every cap | **all 658 files draw a table**; zero fields over cap |
| `npm run recipes` — parse, slugs, counters | clean, no parser warnings |
| `vitest` — collection invariants | unique slugs, no orphan, `pairs-with` mutual and non-dangling, one plain way per dish: all pass |

Per-file shape, all fourteen inside the 5–16 row and 3–6 operation convention:

| File | Rows × cols | Ops |
| --- | --- | ---: |
| `ham-macaroni-soup` | 8 × 3 | 4 |
| `luncheon-meat-and-egg-noodles` | 8 × 3 | 4 |
| `satay-beef-noodles` | 13 × 5 | 5 |
| `hong-kong-borscht` | 15 × 5 | 4 |
| `baked-pork-chop-rice` | 16 × 4 | 5 |
| `pork-chop-in-tomato-sauce` | 14 × 4 | 4 |
| `curry-beef-brisket` | 15 × 5 | 5 |
| `minced-beef-rice` | 14 × 4 | 4 |
| `soy-sauce-pan-fried-noodles` | 9 × 4 | 4 |
| `shrimp-and-egg-rice` | 10 × 4 | 4 |
| `hong-kong-egg-sandwich` | 7 × 4 | 4 |
| `luncheon-meat-and-egg-sandwich` | 7 × 3 | 4 |
| `pork-chop-bun` | 11 × 4 | 4 |
| `swiss-wings` | 10 × 5 | 4 |

**Coverage gap, named honestly:** nothing here checks that a recipe *works when cooked*. Fourteen
tables tile, parse and stay inside every cap; whether the brisket is soft at two hours is a claim
only a kitchen settles. That is true of all 658 files and is not a regression, but a reviewer should
know it is what "green" means on this repo.

## Every acceptance criterion, against evidence

| Criterion | Evidence |
| --- | --- |
| ≥12 new `.cook` files, all passing the checker | 14 files, `all 14 file(s) draw a table` |
| 湯通粉, 餐蛋麵, 焗豬扒飯 among them | `ham-macaroni-soup`, `luncheon-meat-and-egg-noodles`, `baked-pork-chop-rice` |
| 羅宋湯 has no beetroot | `grep -in beet recipes/soups/hong-kong-borscht.cook` returns only the prose row saying there is none |
| …carries `borscht` in `aka` | `aka: lo song tong, lo sung tong, 羅宋湯, 紅湯, Borsch Soup, Hong Kong borscht, Russian soup, red soup, 餐湯` |
| …says in one line what it is not | prose row: *"There is no beetroot in this. It is not the Ukrainian soup — the name travelled through Shanghai."* |
| same test for every other shared English name | the collection was swept file by file; 羅宋湯 is the only collision. Argument in Design D6 |
| two-file dishes consume the component via `&` | **no dish is two files.** Design D1/D2/D2b argues all three candidates |
| `>> counters: Cha Chaan Teng` on every file | 14 of 14; and it is the only counter any of them names |
| `aka` carries characters, a Cantonese romanisation, plain-keyboard English | 14 of 14; forms cross-checked against `docs/knowledge/counters.md` |
| every timer named | `grep '~{'` across the fourteen returns nothing |
| 5–16 rows, 3–6 operations | table above; 7–16 rows, 4–5 operations |
| no specialist-shop ingredient | 65 ingredients listed by aisle in `progress.md`; the hardest twelve are a world-foods aisle or any Asian grocery |
| wok hei said or ranked out | `soy-sauce-pan-fried-noodles` says it in a prose row and a `slack` line; 乾炒牛河 ranked out in Design D4 |
| `slack` only where there is a real failure | 9 of 14 carry one; the 5 without are named in `progress.md` |
| no drink, no 西多士 | nothing written in `recipes/drinks/`; no egg-dipped deep-fried bread anywhere |
| `npm run check` passes for the whole collection | `all 658 file(s) draw a table`, no cap block printed |
| only `recipes/**/*.cook` and `docs/active/work/T-007-04/**` modified | `git status --porcelain` shows no `src/`, no `docs/gaps/`, no `counters.json` |

## The three judgement calls a reviewer should look at first

**1. Nothing was written as two files, and the ticket half-expected two.** The ticket says *"if it
needs more than six operations it is two files"* and then requires *"the assembly consuming the
component via `&`"*. Running the parser directly showed `&` is a **step** reference only: a
cross-file `@./folder/slug{}` parses as a plain ingredient and `scripts/normalise.mjs` never reads
its reference field. So the two halves of that criterion can only both hold inside one file.
焗豬扒飯 came out at **five** operations with the tomato sauce as step 3 and step 5 consuming it via
`@&(~2)tomato sauce{}` — under the ceiling, so the split trigger never fired. Same reasoning kept
咖喱汁 inside the brisket and 沙嗲牛肉 inside the noodles. Full argument in Design D1, D2 and D2b.
**If a reviewer disagrees, the change is cheap** — pull the sauce into `sauces-and-gravies/` and
accept that the assembly references it as an ingredient row the way `margherita` references
`pizza-dough`.

**2. The ticket asked for one of three dishes the work list never ranked.** *"Whichever of
白汁海鮮焗飯 / 滑蛋蝦仁飯 / 揚州炒飯 the work list ranked"* — `docs/gaps/cha-chaan-teng.md` ranks none
of them. Chose **滑蛋蝦仁飯**, because rank 6 (滑蛋, *"the technique four other ranks depend on"*) is
the only one of the three the work list touches at all, and writing the plate writes the technique.
揚州炒飯 would near-duplicate the existing `egg-fried-rice`; 白汁海鮮焗飯 is the second baked plate
and the work list explicitly reserves that shape for rank 23. Design D3.

**3. `swiss-wings` has no home in the counter's section titles, and that is T-007-05's problem now.**
It is rank 10 — the highest-ranked thing in this ticket — and a board files it under 小食 or 小炒,
which is not one of the seven titles T-007-01 created. The only fit is "Also here", and T-007-05's
own acceptance criteria require the built menu to render **no "Also here" section**. Two clean
answers, both theirs: accept the section, or retitle it to the snacks line the boards print. Leaving
a rank-10 dish unwritten to dodge a metadata question would have been the worse trade.

## Open concerns

**1. `npm run verify` currently fails, and the failure is not this ticket's.**

`src/lib/icons.test.ts` requires the first word of every operation label to be a verb
`VERB_ICONS` knows. Twelve leading words still fall through, and every one is in a file this ticket
does not own:

```
recipes/drinks/hong-kong-milk-tea.cook          pull, milk
recipes/drinks/yuenyeung.cook                   two
recipes/drinks/red-bean-ice.cook                sweeten, beans
recipes/drinks/lemon-coke-with-ginger.cook      smash, lemon
recipes/drinks/horlicks.cook                    paste, the, milk
recipes/flatbreads-and-pancakes/hong-kong-french-toast.cook   peanut, cold
recipes/flatbreads-and-pancakes/thick-toast.cook              condensed
```

All seven files are **T-007-03's** — the drinks and the toast, written in parallel on the same
branch. Ten of my own labels failed the same test and were rewritten to open on a verb
(`27e5349`); after that fix, none of the remaining failures is mine, verified by grep. This
ticket's own criterion is `npm run check`, which passes. **Nothing here is a blocker for T-007-04,
but `npm run verify` will not go green for T-007-05 until T-007-03 rewrites those twelve labels or
extends `VERB_ICONS`.** Recording it because T-007-05's criteria include `npm run verify` end to
end, and they will meet this if nobody says so first.

**2. A full-width prose row cannot contain a comma, and this is written down nowhere.**
`cleanLabel()` in `src/lib/label.ts` replaces every comma with a space before the row is rendered,
so a comma'd sentence renders as run-on prose. Found by reading `--labels` output, not by any test —
the checker measures the row's *length* and never its readability. Three of my files use a prose row
and all three are comma-free. Neither `README.md` nor `docs/knowledge/voice.md` mentions it. **A
finding for whoever owns those docs, not a fix I can make from this ticket** (`docs/knowledge/` is
outside my scope, and `src/` doubly so).

**3. `baked-pork-chop-rice` sits exactly on the 16-row ceiling.** Nothing was cut to get there and
nothing more can be added. If a later ticket wants, say, a splash of stock in the sauce, a row has
to come out first.

**4. The romanisations are compiled, not verified against a speaker.** The gap page's own closing
caution says the forms in `counters.md` were compiled to save a lookup and are not to be trusted
blind. Every `aka` here was cross-checked against that vocabulary table, and where the table had no
entry the form follows how the table writes its neighbours — but that is internal consistency, not
external confirmation. Unaccented, no tone marks, matching the collection's existing habit.

**5. Five files carry no `slack` line, deliberately.** `satay-beef-noodles`,
`pork-chop-in-tomato-sauce`, `minced-beef-rice`, `luncheon-meat-and-egg-sandwich`, `pork-chop-bun`.
Each has a wide window and no failure worth naming, and the README calls the empty line the
legitimate answer rather than a gap to fill with filler. Flagged so it reads as a decision, not an
omission.

## Handoff to T-007-05

Everything the shelver needs is in `progress.md` under *Notes for T-007-05* — the section
recommendation with its one open question, the eleven new ingredient strings needing an aisle, the
proof that `evaporated milk` appears here and `condensed milk` does not, the four `pairs-with` links
the build adds into existing files, and the six board items on the work list that are real and are
deliberately not written.

## Disposition

**Pass.** All sixteen acceptance criteria met with evidence above. The one failing test in
`npm run verify` belongs to T-007-03's files and is named rather than patched, because reaching into
a parallel ticket's `.cook` files is the wrong fix for a scope boundary.
