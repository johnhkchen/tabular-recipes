# T-003-04 — Progress

**Done.** 28 new `.cook` files, seven commits, nothing outside `recipes/**`, no pre-existing file
edited.

---

## Batches, as planned and as executed

| Batch | Files | Commit | Result |
| --- | --- | --- | --- |
| B1 foundation | `gohan` `takikomi-gohan` `tonjiru` `sumashi-jiru` `mentsuyu` | `03ff7a8` | 5 ok |
| B2 煮物 | `nikujaga` `buri-daikon` `chikuzenni` `saba-no-misoni` `kabocha-no-nimono` `kiriboshi-daikon` | `9cde7c7` | 6 ok |
| B3 mains | `shogayaki` `saba-shioyaki` `buri-teriyaki` `hambagu` | `c0cd7cc` | 4 ok |
| B4 小鉢 | `kinpira-gobo` `hijiki-no-nimono` `ohitashi` `goma-ae` `sunomono` `tamagoyaki` | `f0f3d1a` | 6 ok |
| B5 bowls & 作り置き | `oyakodon` `gyudon` `omurice` `nikumiso` `nanbanzuke` | `34daa06` | 5 ok |
| B6 stretch | `asazuke` `chahan` | `2d0a541` | 2 ok |
| B7 collection fixes | 21 files re-touched (labels + two water rows) | `64f1ab2` | 21 ok |

Every commit went through `lisa commit-ticket` with exact repository-relative `--include` paths.
No ordinary `git add`, `git add -A` or `git commit` was used at any point. Final
`git status --porcelain` shows nothing of this ticket's staged, modified or untracked.

## The shelf, by section — hand-off list for T-003-06

The section is not something this ticket can write: `counters.json` `sections[].items` belongs to
T-003-06. This is the mapping to paste.

```
The soup and the rice           gohan · takikomi-gohan · tonjiru · sumashi-jiru
                                (+ the existing dashi and miso-soup)
Simmered things (煮物)           nikujaga · buri-daikon · chikuzenni · saba-no-misoni ·
                                kabocha-no-nimono · kiriboshi-daikon
Grilled and pan-fried mains     shogayaki · saba-shioyaki · buri-teriyaki · hambagu
Small sides (小鉢)               kinpira-gobo · hijiki-no-nimono · ohitashi · goma-ae ·
                                sunomono · tamagoyaki
Made ahead (作り置き)             nikumiso · nanbanzuke · mentsuyu · asazuke
                                (kinpira-gobo, hijiki-no-nimono, kiriboshi-daikon,
                                 kabocha-no-nimono and chikuzenni also qualify)
Rice bowls and one-plate        oyakodon · gyudon · omurice · chahan
Also here                       karaage · gyoza · okonomiyaki · chawanmushi ·
                                japanese-beef-curry · teriyaki-sauce · shichimi-togarashi ·
                                goma-dare
```

Counts: 4 · 6 · 4 · 6 · 4 · 4, and eight existing slugs for "Also here". Every section clears the
≥3 minimum; 煮物 and 小鉢 clear ≥5.

**Found dishes recorded by slug, not rewritten**, per criterion 7: `dashi` and `miso-soup` are the
foundation and were not touched; the eight "Also here" slugs above were not touched;
`japanese-milk-bread` and `castella` stay at the Bakery. None of the ten needs an edit from this
ticket — they need a `>> counters:` line, which is T-003-06's.

## Ratios used, and where each came from

Fetched from the source rather than taken from the gap file's summary. Full table in
`research.md` §6 with URLs.

| Ratio | Files | Source |
| --- | --- | --- |
| dashi 10 : soy 1 : mirin 1 : sake 1 | `nikujaga` `kabocha-no-nimono` `chikuzenni` | 和食の旨み, which names 肉じゃが by dish |
| water 5 : soy 1 : mirin 1 : sake 1 (煮魚) | `buri-daikon`, and the base of `saba-no-misoni` | same page, 煮魚 section |
| 三杯酢 vinegar 3 : sugar 2 : soy 1 | `sunomono` | SATETO |
| 割り下 dashi 4 : mirin 1 : soy 1 | `oyakodon` `gyudon` | 全国味淋協会 |
| ginger 1 : soy 1 : sake 1 : mirin 1 | `shogayaki` | macaroni (2 Tbs each per 400 g pork) |
| soy 2 : mirin 2 : sake 2 : sugar 1 | `buri-teriyaki` | macaroni / 食べチョク |
| dashi 4 : soy 1 : mirin 1 | `mentsuyu` | 発酵食大学 |
| 浸し地 dashi 8 : soy 1 : mirin 1 | `ohitashi` | 全国味淋協会 |
| soy 4 Tbs : sugar 2 : mirin 2 : water 300 mL | `hijiki-no-nimono` | macaroni |

Keeping times inside the slack lines: `kinpira-gobo` 3 days / 1 month frozen and
`hijiki-no-nimono` 3–4 days (2–3 in summer) / 14 days frozen are both quoted from macaroni; the
rest use the 2–3 day general guide and say so in the reason rather than inventing a tighter number.

### Deviation from `design.md` D3

**`takikomi-gohan` and `kiriboshi-daikon` were moved out of the 10:1:1:1 row.** Design listed both
under the vegetable 煮物 ratio. Writing them showed why that was wrong:

- `takikomi-gohan`'s liquid also has to be the *cooking water for the rice*, so its volume is fixed
  at about 525 mL for 2 cups of rice. 10:1:1:1 against that gives 45 mL each of soy, mirin and sake
  and a total of 585 mL — more liquid than the rice can take. I have no source that states a ratio
  for takikomi specifically, so **the file claims no ratio** and uses conventional quantities
  (dashi 475 mL, soy 2 Tbs, mirin 1 Tbs, sake 1 Tbs). Per the ticket's own rule, a number without a
  source is not dressed up as canon.
- `kiriboshi-daikon` has no dashi in it at all: the soaking water off the dried daikon is the stock,
  and it is sweeter than dashi. The file says so, and `dashi` is not in its `pairs-with`.

## Verification

```
$ node scripts/check-recipes.mjs --labels recipes/*/<28 new slugs>.cook
all 28 file(s) draw a table.

$ npm run recipes
parsed 658 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 658 named, 0 inferred from category · timers in 635 · pairings 760

$ npx vitest run
Test Files  1 failed | 7 passed (8)
     Tests  1 failed | 824 passed (825)
```

Mechanical checks over the 28 (`grep -l 'counters: Japanese Home Cooking'` gives exactly 28):

```
missing title 0 · category 0 · tags 0 · servings 0 · counters 0 · aka 0 · slack 0 · pairs-with 0
unnamed timers (~{)                    none
kombu / katsuobushi as an ingredient   asazuke (kombu, as a pickling ingredient)
                                       ohitashi (katsuobushi, as a topping)
                                       — neither makes a stock; no file re-teaches dashi
files with a @dashi{} row              13
files naming dashi in pairs-with       13, and it is the same 13 (diff is empty)
```

Table shapes: 3 to 15 rows, 3 to 6 columns. `gohan` at 3 rows is the collection's floor and was
written first as the plan's step 0 for exactly that reason.

Slack levels across the 28: **12 forgiving · 12 narrow · 4 unforgiving.** All 28 declare one.

## Two corrections found by the collection tests

`check-recipes.mjs` is per-file and does not see collection invariants. Running `npx vitest run`
after B6 surfaced three failures; two of them were mine and both were fixable inside `recipes/**`.

1. **`src/lib/units.test.ts`** — `@boiling water{}` in `buri-daikon` and `saba-no-misoni` and
   `@cold water{}` / `@salted water{}` in six more had no quantity, while the same names carry
   quantities in ~50 existing recipes. Combining a null with a number gives a non-finite total.
   Fixed by giving all eight a real quantity. **This is a house rule nothing documents:** an
   ingredient name that is measured anywhere in the collection may not be unmeasured elsewhere.
2. **`src/lib/icons.test.ts`** — 17 operation labels opened with a word `VERB_ICONS` does not know
   (`drop lid…`, `uncover…`, `first pour…`, `pile onto…`, `serve with…`, `float on top`, and so
   on), which drops the cell to the fallback bowl icon. Fixed by rewording every one to open with
   a verb the table knows — `simmer 15 min under a drop lid`, `reduce to a glaze, uncovered`,
   `pour two-thirds, set 60 sec`, `spoon onto the cabbage`, `top with grated daikon`,
   `scatter on top, off the heat`. This test was **already failing before this ticket** (4 verbs at
   `ebe5ba3`); it is green now.

The third failure is not mine to fix and is written up in `review.md`.

## Not written, and why

Recorded so the next pass does not re-derive the list. Reasons in `design.md` D1.

- **Cannot be one honest table:** `ochazuke` (one operation), `katsudon` and `korokke` (both wait
  on a component that does not exist), `kare raisu` from a roux block (one of its three operations
  is opening a packet), a vegetable `miso-soup` variation (would duplicate a file I may not edit).
- **Writable, cut for scope:** `yakitori`, `nikudofu`, `satoimo no nikkorogashi`,
  `hakusai to aburaage no nimono`, `shiraae`, `agebitashi`, `onigiri`, `shio koji`.
