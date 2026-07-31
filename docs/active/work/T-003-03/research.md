# T-003-03 — Research

What exists, where it is, and what it constrains. No proposals here.

## 1. The shelf as it stands

`The Soup Pot` is a real counter already. `src/data/counters.json` carries it:

```json
{ "name": "The Soup Pot", "slug": "soup-pot",
  "blurb": "Put it on, leave it alone for three hours, and it gets better.",
  "categories": [],
  "sections": [ "Old-fire soups (老火湯)", "Quick daily soups (滾湯)",
                "What each thing is for", "Congee and rice soups", "Also here" ] }
```

Every `items` array is empty and `categories` is empty. `categories` being empty is load-bearing:
it is the fallback that would otherwise sweep every recipe in a category onto this counter. With
it empty, **the only way onto this shelf is a `>> counters: The Soup Pot` line in a `.cook`
file** — which is exactly what this ticket writes, and exactly why the shelf is at zero today.

`grep -l 'The Soup Pot' recipes/*/*.cook` returns nothing. The gap note's headline is accurate.

`recipes/soups/` holds 43 files (the gap note says 44 counting `congee-instant-pot`; both counts
describe the same directory). None of them is a 老火湯. Confirmed by reading the list: the
closest neighbours by method are `tonkotsu-broth` (a hard 8-hour boil, the opposite rule),
`chicken-broth` (a stock, not a soup), and `egg-drop-soup` (genuinely a 滾湯 by method, and
already shelved at the Takeout Counter).

## 2. What a `.cook` file has to satisfy

Four gates, in the order a file hits them.

**Gate 1 — required metadata.** `scripts/check-recipes.mjs:18` requires `title`, `category`,
`tags`, `servings`. Everything else is optional.

**Gate 2 — the counter name.** `check-recipes.mjs:55` rejects a counter name not in
`counters.json`. The exact string is `The Soup Pot`.

**Gate 3 — the tree.** `src/lib/tree.ts` + `src/lib/layout.ts`. The rules that bite:

- Every step after the first must consume something with `@&(~N)x{}` or it starts a new branch,
  and every branch has to merge into one final step.
- A step with no ingredients is a full-width row, not an operation. `~1` counts **every** step
  including those, so a prose note has to sit at the top or it shifts every back-reference
  under it.
- `rowCount < 3` or `colCount < 3` fails: "too thin to be a table" / "nothing merges".
- An operation cell that comes out with an empty label fails.

**Gate 4 — slack.** `src/lib/slack.ts`, read in `scripts/normalise.mjs:212`. The line is
`>> slack: <level> — <reason>`. Levels are exactly `forgiving`, `narrow`, `unforgiving`. A level
with no reason is a build error; an unknown level is a build error; **an absent line is fine**.
The separator is liberal (em dash, hyphen, colon, comma, or nothing).

## 3. The clock, and whether this shelf's claim survives it

`src/lib/time.ts` decides hands-on versus walk-away. The decision order is:

1. A **named** timer whose name is in `UNATTENDED` or `HANDS_ON` — the author saying it outright.
2. Failing that, the words of the timer's own slice of the operation label.
3. Failing that, the whole label.
4. Failing everything, **hands-on** — because promising a cook they can leave when they cannot is
   the worse error.

`simmer` is in `UNATTENDED`. `soak` and `steep` are in `UNATTENDED`. `blanch` is in **neither**
set, so a `~blanch{8%min}` falls through to the label and then to the hands-on default.

I put a probe file through the real pipeline (`normalise` → `buildSchedule`) before writing
anything. A four-operation 老火湯 skeleton — note, blanch, rinse the dried goods, `~simmer{3%hr}`,
season — reports:

```
total 3 hr 8 min | hands-on 8 min | walk away 3 hr
  hands-on   |  8 min | blanch from cold, then rinse the bones
  unknown    |  0 min | rinse the dried goods
  unattended | 180 min| simmer 3 hr, barely a quiver     <- stated, from the timer's name
  unknown    |  0 min | season at the table
```

**The shelf's claim renders.** "Three hours, eight minutes of it yours" is what the table says,
and the 3 hr is `stated` confidence rather than inferred, because the timer is named `simmer`.
The gap note's instruction to check this before writing twenty files against it is satisfied.

The blanch reading as hands-on is honest — you are at the sink scrubbing bones — and it is what
produces the small non-zero hands-on figure the shelf wants to show.

## 4. Icons: a hard constraint on how a step may open

`src/lib/icons.test.ts` asserts **every leading verb of every operation cell in the whole
collection** resolves through `matchOperation`. A new verb that is not in `VERB_ICONS` fails
`npx vitest run` for the entire repo, not just for the new file.

This ticket may only modify `recipes/**`, so `src/lib/icons.ts` cannot be extended. Every
operation label I write must open with a verb already in the map. Verified present and useful
here:

`blanch, simmer, boil, poach, steam, scald, reduce, bring (to), rinse, wash, strain, drain,
skim, squeeze, soak, steep, season, scatter, sprinkle, top, finish, stir, toss, add, fry, sear,
brown, cook, warm, slice, cut, halve, trim, peel, shred, combine, mix, ladle, pour, drop-in? (no)`

Verified **absent**, so unusable as an opening word: `serve`, `discard`, `lift`, `drop`, `tip`,
`float`, `taste`, `check`.

Every recipe in this collection sets its cell labels explicitly (`568` of `589` files carry
`>> step.N:` lines), so the label is fully under the author's control. That is the mechanism I
will use rather than hoping a derived label opens with the right word.

## 5. The `>> time:` line is parsed, not decorative

`src/lib/schedule.test.ts:280` asserts `authorMinutesOf` reads the `>> time:` line of **every**
recipe in the collection. It returns null — and so fails the test — for a range ("30 to 40 min"),
for "about an hour", for "1 1/2 hr", and for anything with a leftover word. Legal forms are
`45 min`, `3 hr`, `3 hr 30 min`, `2 days`.

`src/lib/collection.test.ts:78` also fails any single timer of 4 hours or more that reads as
hands-on. Nothing here goes near that, since every long timer will be named `simmer`.

## 6. The aisle problem, which belongs to a later ticket

`src/lib/shopping.test.ts:146` asserts fewer than **2%** of the collection's distinct ingredient
names fall through to the `other` aisle. Today: **13 of 1008 = 1.29%**, with about seven names of
headroom.

I probed `aisleFor` against the ingredient list this shelf needs. These land somewhere real
already: pork neck bones, pork shin, pork trotter, chicken feet, black chicken, pork lung, lean
pork, pork liver (all `butcher`); dried scallops, dried octopus, dried shrimp (`fishmonger`);
green radish, carrot, corn, winter melon, old cucumber, green papaya, watercress, dried bok choy,
dried Chinese yam, goji berries, black-eyed peas, straw mushrooms (`produce`); red dates, dried
figs, lotus seeds, raw peanuts, rice beans, glass noodles, soft tofu (`dry-goods`); honey dates
(`baking`).

These fall through to `other`: **apricot kernels, Solomon's seal, adenophora root, job's tears,
fox nut, dried lily bulb, aged tangerine peel, dried overlord flower, lotus root, hairy gourd,
laver, crucian carp, amaranth, silk gourd.**

That is around fourteen new unplaced names against seven names of headroom, so **the aisle
coverage test will go red when this ticket lands**. This is not an accident of my design; it is
the shape the board was drawn in:

- `docs/gaps/soup-pot.md` says outright: "None of the dried goods above exists in
  `src/data/aisles.json` … an aisle problem handed to T-003-06."
- This ticket's own criteria require `check-recipes.mjs --labels` per file and say nothing about
  `npm run verify`, unlike T-003-02's criteria which named it explicitly.
- `T-003-06`'s criteria say: "Run the aisle-coverage test … Add patterns to `src/data/aisles.json`
  for the real ones", "The aisle-coverage test passes and `npx vitest run` is green", and "Only
  `src/data/counters.json` and `src/data/aisles.json` are modified."
- This ticket may only touch `recipes/**`, so I cannot close it even if I wanted to.

The obligation this leaves me is to hand T-003-06 the exact list of names it has to place, which
goes in the work artifact.

## 7. The source material, and what it settles

`docs/gaps/soup-pot.md` is the substantive research input and it is unusually complete: a
glossary of nineteen dried goods with what each is for and what it is standardly paired with, the
bodies, the seasonal frame, four method rules, the three-way 老火/滾/燉 distinction, and two
ranked lists with characters, romanisation and a plain-keyboard spelling for each entry. Its
sources are cited at the bottom (hk01, 鴻福堂, China Sichuan Food, The Woks of Life, Kanlaw's
seventy-soup list, FWD, UrbanLife, Cosmopolitan HK, Made With Lau).

It carries two explicit cautions:

1. The romanisations were written to save a lookup and are **not to be trusted blind**.
2. Where a pairing could not be established, **write a different soup rather than filling a rank**.

I checked every romanisation in both blocks against Cantonese Jyutping with the tones dropped —
which is what the doc says they are. All 28 are correct as given: 青紅蘿蔔 *cing hung lo baak*,
薏米 *ji mai*, 蓮藕 *lin ngau*, 章魚 *zoeng jyu*, 西洋菜 *sai joeng coi*, 蜜棗 *mat zou*, 眉豆
*mei dau*, 雞腳 *gai goek*, 霸王花 *baa wong faa*, 南北杏 *naam bak hang*, 粟米 *suk mai*, 淮山
*waai saan*, 杞子 *gei zi*, 烏雞 *wu gai*, 清補涼 *cing bou loeng*, 沙參 *saa sam*, 玉竹 *juk
zuk*, 瘦肉 *sau juk*, 節瓜 *zit gwaa*, 瑤柱 *jiu cyu*, 菜乾 *coi gon*, 豬肺 *zyu fai*, 蓮子 *lin
zi*, 百合 *baak hap*, 老黃瓜 *lou wong gwaa*, 赤小豆 *cek siu dau*, 木瓜 *muk gwaa*, 豬腳 *zyu
goek*, 蘋果 *ping gwo*, 雪梨 *syut lei*, 番茄 *faan ke*, 薯仔 *syu zai*, 紫菜 *zi coi*, 蛋花
*daan faa*, 芥菜 *gaai coi*, 豆腐 *dau fu*, 鯽魚 *zik jyu*, 皮蛋 *pei daan*, 莧菜 *jin coi*.

No correction is needed to any of them. The one thing worth noting is 豬膶 *zyu jeon* (rank 7 of
the 滾湯 block): 膶 is the Cantonese euphemistic substitution for 肝, avoided because 肝 sounds
like 乾 "dry". The doc's romanisation is right; the reason is worth a line in the file.

## 8. The register the ticket is most likely to be failed on

Both the ticket and the gap note single out the same hazard, in the same words: these soups carry
a traditional logic about what they do for a body, that logic is *why the soup is made* and
belongs in the file, and it must be written as **the tradition's own reasoning** rather than as a
health claim the site asserts. "Made when someone in the house has been coughing" is honest;
"cures a cough" is not, and is not what the tradition says either.

Grammatically that means: attribute (`the tradition holds`, `the word used is 潤`, `the pot made
when…`), name the occasion and the season, and never write a verb whose subject is the soup and
whose object is a body.

## 9. What is already here and must not be rewritten

- `congee` (Dim Sum Counter) and `congee-instant-pot` — the gap note is explicit that congee
  "needs shelving here, not rewriting", and it is T-003-06's job.
- `egg-drop-soup` (Takeout Counter) — a real 滾湯 by method. The 紫菜蛋花湯 in the work list is a
  different soup and sits beside it.
- `wonton-soup`, `hot-and-sour-soup` (Takeout Counter), `chicken-feet` (Dim Sum Counter),
  `chicken-broth` (Deli).

`chicken-broth` matters as a negative: a 老火湯 starts from **cold water**, not stock. The gap
note flags this as the instinct every Western soup habit will push against.

## 10. Constraints this leaves for Design

- New files only, in `recipes/soups/`, category `Soups`, counter `The Soup Pot`.
- Four to six operations per table; the note step first or not at all.
- Labels open with a verb `VERB_ICONS` already knows.
- Long timers named `~simmer{…}`; every timer named, per the criteria.
- `>> time:` in a form `authorMinutesOf` can read whole.
- `slack` on every file, with a reason naming a real failure specific to that pot.
- `aka` carrying characters, romanisation, and a plain-keyboard English spelling.
- The blanch, the water-once rule, the no-stir rule and the broth-is-the-dish rule are shared
  across every 老火湯 and will be written the same way in each — the gap note warns they will
  otherwise end up described twenty slightly different ways.
