# T-003-04 — Review

Japanese Home Cooking now has **28 recipes** on it, written as the system 一汁三菜 and 作り置き
actually are rather than as a list of dishes that happen to be Japanese. Seven commits, 28 new
files, nothing outside `recipes/**`, no pre-existing file edited.

---

## What changed

| Folder | Files added |
| --- | --- |
| `recipes/rice-beans-and-grains/` | `gohan` `takikomi-gohan` `oyakodon` `gyudon` `omurice` `chahan` |
| `recipes/stews-and-braises/` | `nikujaga` `buri-daikon` `chikuzenni` `saba-no-misoni` |
| `recipes/vegetables-and-sides/` | `kabocha-no-nimono` `kiriboshi-daikon` `kinpira-gobo` `hijiki-no-nimono` `ohitashi` `goma-ae` |
| `recipes/soups/` | `tonjiru` `sumashi-jiru` |
| `recipes/smoked-and-grilled/` | `saba-shioyaki` `buri-teriyaki` |
| `recipes/toppings-and-pickles/` | `nikumiso` `asazuke` |
| `recipes/fried-and-crispy/` | `hambagu` `nanbanzuke` |
| `recipes/stir-fries/` | `shogayaki` |
| `recipes/salads/` | `sunomono` |
| `recipes/eggs/` | `tamagoyaki` |

**Nothing modified, nothing deleted.** Commits `03ff7a8` · `9cde7c7` · `c0cd7cc` · `f0f3d1a` ·
`34daa06` · `2d0a541` · `64f1ab2`, all through `lisa commit-ticket` with exact `--include` paths.
`git status --porcelain` shows nothing of this ticket's left staged, modified or untracked.

## Acceptance criteria, against evidence

| Criterion | Evidence |
| --- | --- |
| ≥22 new `.cook` files, each naming `counters: Japanese Home Cooking` | **28.** `grep -l 'counters: Japanese Home Cooking' recipes/*/*.cook \| wc -l` → 28 |
| Every section ≥3, and 煮物 and 小鉢 ≥5 | 4 · 6 · 4 · 6 · 4 · 4. Section mapping in `progress.md`; **this ticket cannot write it** — `counters.json` `sections[].items` is T-003-06's file, so the mapping is handed over rather than committed |
| Every recipe declares slack with a reason naming a real failure; made-ahead sides say how long they keep | 28/28 carry `>> slack:`; 12 forgiving, 12 narrow, 4 unforgiving. Keeping times in `kinpira-gobo` (3 days, a month frozen), `hijiki-no-nimono` (3–4 days, 2–3 in summer, 14 frozen), `nanbanzuke`, `nikumiso`, `mentsuyu`, `asazuke`, `kiriboshi-daikon`, `kabocha-no-nimono`, `chikuzenni`, `nikujaga` |
| Every file carries `aka` with characters, a romanisation and a plain-keyboard spelling | 28/28. e.g. `生姜焼き, shōgayaki, shogayaki, …` and `切干大根の煮物, kiriboshi daikon, kiriboshi daikon, …` |
| Nothing re-teaches `dashi`; it is referenced in `pairs-with:` | 13 files take `@dashi{}` as one ingredient row and all 13 name `dashi` in `pairs-with` (the two sets `diff` empty). No file has kombu-and-katsuobushi as a stock; the only two hits are `asazuke`'s kombu (a pickling ingredient) and `ohitashi`'s katsuobushi (a topping) |
| Nothing rewritten that exists; found dishes recorded by slug | `dashi`, `miso-soup` and the eight "Also here" slugs are untouched and listed in `progress.md` for T-003-06 |
| Ratios are canonical and the artifact says where they came from | Nine ratios, each fetched from its source rather than recalled. Table in `research.md` §6 with URLs and in `progress.md`. Two dishes were **moved off** a ratio they could not honestly claim (below) |
| `check-recipes.mjs --labels` ok for every new file, and the staircase reads as a cook's verbs | `all 28 file(s) draw a table.` Seventeen labels were reworded so every one opens with a verb the collection's icon table recognises |
| Every timer named; every file carries `title`, `category`, `tags`, `servings`, `counters` | `grep '~{'` → nothing. All five metadata keys present in all 28 |
| Only `recipes/**` modified, no pre-existing file edited | Seven commit diffstats and `git status`; `pairs-with` mutuality is computed at build into `src/generated/`, which is not committed, so pointing at `dashi` costs no edit |

## Test coverage

This ticket adds data, not code, so the test surface is the existing harness. It was used at three
levels: `check-recipes.mjs` per file, the same with `--labels` per batch, and the collection tests
once at the end.

```
$ node scripts/check-recipes.mjs --labels <28 files>     all 28 file(s) draw a table.
$ npm run recipes                                        parsed 658 recipe(s) · pairings 760
$ npx vitest run                                         1 failed | 7 passed (8 files)
                                                         1 failed | 824 passed (825 tests)
```

**The gap the harness does not cover:** nothing tests whether a ratio is right, whether a keeping
time is true, or whether a slack reason names the failure that actually happens. Those are the
three things this shelf is made of, and they are only as good as the sources in `research.md` §6
and the judgement in `design.md` D3–D4. A reviewer who wants to check one thing should check the
ratio table against the linked pages.

## The one failing test, and whose it is

`src/lib/shopping.test.ts` — *"finds an aisle for nearly everything"* — fails: **37 of 1082
ingredient names have no aisle (3.42%), against a 2% ceiling.**

Attribution, measured rather than assumed:

| State | Unmatched | Result |
| --- | --- | --- |
| `ebe5ba3`, the commit before this ticket started | — | **already failing** on `icons.test.ts`; shopping passed |
| HEAD with this ticket's 28 files deleted in a scratch worktree | 29 / 1056 = **2.75%** | **already failing** — T-003-03's Soup Pot took it over the ceiling |
| HEAD as it stands | 37 / 1082 = **3.42%** | failing |

So the test was red before this ticket's work reached it, and this shelf raises it further. The
eight names this ticket contributes are real Japanese pantry items with no aisle pattern yet:
**abura-age, burdock root, lotus root, konnyaku, ito konnyaku, dried hijiki, kabocha, yellowtail
(fillets and collar).**

**It is not this ticket's to fix and the remedy is already scheduled.** The fix is a pattern per
name in `src/data/aisles.json`; this ticket's criterion 10 permits only `recipes/**`, and
`T-003-06-shelve-the-home-wing` explicitly *owns* `src/data/aisles.json`, says "add the Japanese
pantry staples", and carries "the aisle-coverage test passes and `npx vitest run` is green" as its
own acceptance criterion. Renaming the ingredients to something with an aisle would have made the
test green and the recipes wrong.

Two failures that *were* this ticket's were found the same way and fixed inside `recipes/**`:
`units.test.ts` (eight water rows carried no quantity while the same names are measured in ~50
existing recipes, which made the collection total non-finite) and `icons.test.ts` (17 labels opened
with a word the icon table does not know). Both are green now — `icons.test.ts` is greener than it
was at `ebe5ba3`.

## Open concerns

1. **`npm run verify` does not pass on this branch**, because of the aisle test above. It was
   already failing when this ticket's first commit landed. T-003-06 fixes it as part of its own
   criteria; nothing needs to happen before then, but a human should know the branch is red and
   why.
2. **Two dishes were moved off the ratio `design.md` planned for them**, because writing them
   showed the ratio could not be claimed honestly. `takikomi-gohan`'s liquid doubles as the rice's
   cooking water, so its volume is fixed and 10:1:1:1 overshoots it by 60 mL; no source states a
   ratio for takikomi by name, so the file claims none. `kiriboshi-daikon` has no dashi at all —
   the soaking water off the dried daikon is the stock. Both are reasoned in `progress.md`.
3. **`gohan` sits at the collection's floor**, 3 ingredient rows, because plain rice is two things
   plus the water you rinse it in. It passes, but any change that merges those rows breaks it. It
   was written first for this reason.
4. **`chikuzenni` is 14 rows and 5 operations**, the widest table on the shelf and near the point
   where the README says a dish is probably two recipes. It is one dish and it is written as one;
   worth a second opinion.
5. **`hambagu` opens the door to a hamburger argument.** It is filed under Fried & Crispy with
   ground beef, ground pork, panko and a red-wine pan sauce. If a reader arrives expecting a burger
   the file will read as wrong; its first line says it is not one.
6. **Nine dishes from the gap file's ranked list were not written.** Four cannot be one honest
   table (`ochazuke`, `katsudon`, `korokke`, home `kare raisu`); eight more are writable and were
   cut for scope. Both lists are in `progress.md` so a later pass does not re-derive them.
7. **One house rule is undocumented and cost a debugging cycle**: an ingredient name that is
   measured anywhere in the collection may not appear unmeasured elsewhere, or `units.test.ts`
   fails on a non-finite total. `README.md`'s authoring contract does not say so. Not this ticket's
   file to change.

## What a reviewer should look at first

The ratio table in `research.md` §6, against the linked sources. Everything else on this shelf is
checkable by a script; the ratios are the content, they are the thing the ticket said "never
fabricate a number" bites hardest on, and they are the only part where being wrong looks exactly
like being right.
