# T-003-04 — Research

What exists, where, and what the shelf has to fit into. Descriptive only; the choices are in
`design.md`.

---

## 1. The shelf as the data has it

`src/data/counters.json` already holds the counter, opened by T-003-01:

```
name    "Japanese Home Cooking"
slug    "japanese-home"
blurb   "Small dishes, made once, that add up to dinner all week."
categories []                      ← no category fallback; every recipe must name the counter
sections   The soup and the rice · Simmered things (煮物) · Grilled and pan-fried mains ·
           Small sides (小鉢) · Made ahead (作り置き) · Rice bowls and one-plate suppers · Also here
```

`categories: []` matters. `scripts/parse-recipes.mjs:72` only infers counters for a recipe that
names none, and it infers them from `categories`. An empty list means **nothing reaches this
shelf except by writing `>> counters: Japanese Home Cooking` in the file.** No accidents, and no
way to get there via the category either.

`sections[].items` are all empty. **Section membership is not mine to set** — T-003-06 fills the
item lists in `counters.json`, and this ticket must not touch that file. So the per-section counts
in the acceptance criteria are a claim about what I hand T-003-06, not about anything I can write
into the repo. The mapping has to be stated explicitly in the work artifacts or it is lost.

Counter count as of now: 21. Recipe count: **589 `.cook` files** across 27 category folders.

## 2. The authoring contract, as the code enforces it

Read from `README.md` (lines 36–130), `scripts/check-recipes.mjs`, `scripts/normalise.mjs`,
`src/lib/slack.ts`, `src/lib/tree.ts`.

**Required metadata** — `check-recipes.mjs:18`: `title`, `category`, `tags`, `servings`. Nothing
else is required by the checker. `counters` is required by *this ticket*, not by the code.

**Known metadata keys** — `normalise.mjs:216`: `title`, `category`, `tags`, `counters`, `dish`,
`kit`, `aka`, `pairs-with`, `slack`, plus `servings` and `step.N`. `>> time:` is *not* in that
list — it survives as loose metadata and nearly every existing file carries it (`dashi.cook`,
`harvest-bowl.cook`), so it is house style rather than contract.

**Category is free text.** `parse-recipes.mjs` never validates it against a list; the folder
supplies it when the file does not. A category no counter claims is only a problem for a recipe
that names no counter (`parse-recipes.mjs:82`, "sit at no counter"). Since every file here names
one, category is purely how the recipe files itself. The 27 existing folder → category strings are
canonical and I should reuse them rather than mint new ones.

**Counters are validated.** `check-recipes.mjs:22` builds `KNOWN_COUNTERS` from `counters.json`
and rejects an unknown name with the full list. The string must be exactly
`Japanese Home Cooking`.

**Table shape gates** — `check-recipes.mjs:70–80`:

| Gate | Rule |
| --- | --- |
| `rowCount < 3` | fewer than 3 ingredient rows → "too thin to be a table" |
| `colCount < 3` | → "only one operation, so the table is a list" |
| unlabelled op cell | a step whose derived label comes out empty |
| tiling errors | from `findTilingErrors` — splits, two endings |

`colCount = operations + 1` (guacamole: 3 operations → `7 rows x 4 cols`). So the true floor is
**3 ingredient rows and 2 operations**. README's target is 5–16 rows and 3–6 operations.

This is the single biggest constraint on this shelf. The gap file's own framing — *"a kinpira is
four ingredients and three operations"* — sits one ingredient above the floor. **Several 小鉢 are
at genuine risk of failing `rowCount < 3`**, and `ochazuke` (rice, tea, one topping) is the
clearest case. That is a research finding, not a design decision, but it decides which dishes are
writable.

**Tree rules.** Every step after the first says what it consumes (`@&(~1)x{}` = one step back,
`@&(3)x{}` = step 3). A step with no ingredients is a full-width row and must be kept at the top,
because `~1` counts every step including prep ones. One ending; no splitting a preparation into
two later steps.

**Labels.** The cell label is the step with ingredients stripped; `>> step.N:` overrides it. Every
existing file in the collection sets `step.N` for every step — `dashi.cook` and `harvest-bowl.cook`
both do. `--labels` prints the staircase, which is what the acceptance criterion reads.

**Timers.** `~soak{30%min}` — named. `src/lib/time.ts` reads an unnamed timer from the operation
label and, failing that, counts it as hands-on. The ticket requires every timer named.

## 3. Slack, as T-003-02 left it

`src/lib/slack.ts` is done and shipped (T-003-02 status `done`).

```
levels     forgiving · narrow · unforgiving          (SLACK_LEVELS, declaration order)
line       >> slack: <level> <separator> <reason>
separator  — – : , - or nothing; liberal about punctuation, strict about the level
failure    unknown level → problem; level with empty reason → problem
absent     legal and common; renders nothing
```

`readSlack` splits on the first run of letters, so the reason may itself contain dashes.
`check-recipes.mjs:65` surfaces `recipe.slackProblem` as a hard failure.

Worked examples already in the tree (T-003-02's eight-plus): `beef-stew`, `creme-anglaise`,
`sourdough-boule`, `no-knead-bread`, `blackened-salmon`, the seven Bowl Shop bowls, several
salads. `harvest-bowl.cook` shows the house register:

> `>> slack: forgiving — the rice, the sweet potato and the chicken all hold an hour in a low
> oven; only the greens wilt, and they go in last`

A reason names the failure and the window, in a cook's words. **For this shelf the ticket adds a
requirement the library does not enforce: for a made-ahead side the reason must include how long
it actually keeps.**

## 4. What Japanese food is already here, by slug

33 files carry a `japanese` tag or mention Japan. `docs/gaps/japanese-home.md` has already sorted
them and this ticket inherits that sorting — it is not mine to redo, only to obey.

**Shelve, do not rewrite** (T-003-06 puts these in "The soup and the rice"):
`dashi` · `miso-soup`

**Both boards** (T-003-06 puts these in "Also here"):
`karaage` · `gyoza` · `okonomiyaki` · `chawanmushi` · `japanese-beef-curry` · `teriyaki-sauce` ·
`shichimi-togarashi` · `goma-dare` — plus `japanese-milk-bread` and `castella`, which are the
Bakery's and are listed only so nobody wonders.

**Restaurant food, leave it:** `ramen-noodles` · `shio-ramen` · `shoyu-ramen` · `miso-ramen` ·
`tonkotsu-ramen` · `tonkotsu-broth` · `chintan-broth` (+ both `-instant-pot` variants) ·
`shio-tare` · `shoyu-tare` · `miso-tare` · `mayu` · `ajitama` · `menma` · `chashu` ·
`miso-ginger-dressing`. `haemul-pajeon` and `bulgogi-marinade` are Korean and not this shelf's.

Three things this list decides for me:

1. **`dashi` exists and is good.** `recipes/soups/dashi.cook` is kombu + katsuobushi, 45 min, and
   its own step 1 says *"Everything here that asks for dashi means this one."* Every simmered dish
   on my shelf takes `@dashi{}` as an ingredient row and carries `>> pairs-with: dashi`.
   `pairs-with` is **made mutual at build time** (`parse-recipes.mjs:90–108`), so pointing at
   `dashi` costs me no edit to `dashi.cook` — which is what makes the "no file that existed before
   is edited" criterion survivable.
2. **`miso-soup` exists** as tofu-and-wakame and re-teaches dashi inline. I may not touch it. A
   miso variation of mine would be a near-duplicate; the honest additions are the *other* soups —
   the clear one and the pork-and-root one.
3. **`teriyaki-sauce` exists as a bottle sauce.** A home 照り焼き makes its glaze in the pan. The
   gap file asks for the table to say so plainly.

**There is no plain rice recipe anywhere on the site.** Every file in
`recipes/rice-beans-and-grains/` is seasoned — `coconut-rice`, `lemon-rice`, `pilau-rice`,
`yellow-rice`, `mexican-red-rice`, `rice-pilaf`. Verified by reading the folder listing. This is
the largest single hole and eleven dishes on this shelf are served on it.

## 5. Slug collisions

Checked against all 589 basenames. None of the candidate slugs in `docs/gaps/japanese-home.md`
collides: `gohan`, `nikujaga`, `shogayaki`, `oyakodon`, `gyudon`, `omurice`, `tamagoyaki`,
`kinpira-gobo`, `hijiki-no-nimono`, `ohitashi`, `sunomono`, `buri-daikon`, `saba-shioyaki`,
`takikomi-gohan`, `chikuzenni`, `nikumiso`, `mentsuyu`, `asazuke`, `ochazuke` are all free.
Near-misses worth naming: `egg-fried-rice` exists (Chinese — `chahan` would be the Japanese one and
must not read as a duplicate), `congee` exists, `teriyaki-chicken-bowl` exists (a Bowl Shop bowl,
not 照り焼き).

Basenames are URLs and unique across the whole collection (`src/lib/collection.test.ts` pins it).

## 6. Where the ratios come from

The ticket makes this a criterion: *"Seasoning ratios are the canonical ones, and the work artifact
says where they came from."* `docs/gaps/japanese-home.md` names four and warns that two of its own
sources disagree. I fetched the sources rather than trusting the summary. Verified 2026‑07‑31:

| Ratio | Value as the source states it | Source |
| --- | --- | --- |
| Vegetable 煮物 | だし10：醤油1：みりん1：酒1 — named for 大根の煮物, 里芋の煮物 **and 肉じゃが** | [和食の旨み — 煮物の黄金比](https://www.kobayashi-foods.co.jp/washoku-no-umami/boiled-golden-ratio) |
| 煮魚 (simmered fish) | 水5：醤油1：みりん1：酒1 — **water, not dashi**, because the fish's own umami dissolves into the liquid | same page |
| 三杯酢 | 砂糖2：醤油1：酢3 (2 Tbs : 1 Tbs : 3 Tbs), "the golden ratio for every 酢の物" | [SATETO — 基本の合わせ酢3種](https://coop-sateto.jp/article/基本の合わせ酢３種類/) |
| 丼ものつゆ / 割り下 | 本みりん1：しょうゆ1：出汁4 (2 Tbs : 2 Tbs : 120 mL, 2 servings) | [全国味淋協会](https://www.honmirin.org/recipes/215) |
| 生姜焼きのタレ | 生姜1：しょうゆ1：酒1：みりん1 — 2 Tbs each per **400 g** thin-sliced pork | [macaroni](https://macaro-ni.jp/49784) |
| 照り焼きのたれ | しょうゆ2：みりん2：酒2：砂糖1 | [macaroni](https://macaro-ni.jp/173044) via [食べチョク](https://www.tabechoku.com/feature_articles/sakana_recipe-teriyaki) |
| めんつゆ | だし4：しょうゆ1：みりん1 (300 mL dashi + 4 Tbs + 4 Tbs) | [発酵食大学](https://hakkoushoku.jp/yuru/31552/), agreeing with the gap file |
| おひたしの浸し地 | だし8：しょうゆ1：みりん1 (also quoted 10:1:1) | [全国味淋協会 / cookpad](https://cookpad.com/jp/recipes/21385677) |

**Two disagreements, recorded rather than resolved:**

- The gap file's second 煮物 source, [SATETO](https://coop-sateto.jp/special/nimono_ougonhi/),
  states **5:1:1:1** and — this is the part the gap file did not have — **uses water, not dashi**,
  and does not label the four terms. So the "disagreement" is smaller than it looked: 10:1:1:1 is
  the dashi-based ratio and 5:1:1:1 is a water-based one at double strength. Both are internally
  consistent. The dashi-based one is the one this shelf wants, and it is the one whose source
  names nikujaga by dish.
- **肉じゃが specifically** is a mess in the wider sources: 砂糖1：酒2：醤油3 (FOODIE, no dashi at
  all), 醤油3：みりん2：酒2：砂糖1, 1:1:1. This is exactly the case the ticket's *"never fabricate a
  number"* is aimed at. The only nikujaga ratio I have from a source that names the dish is
  kobayashi-foods' 10:1:1:1.

**作り置き keeping times**, which the ticket requires inside the slack reasons:

| Dish | Refrigerated | Frozen | Source |
| --- | --- | --- | --- |
| きんぴらごぼう | 約3日 | 約1ヶ月 | [macaroni](https://macaro-ni.jp/42466) |
| ひじきの煮物 | 3〜4日 (2〜3 in summer) | 14日 | [macaroni](https://macaro-ni.jp/142936) |
| general 作り置き guide | 2〜3日 | 2〜3週間 | [暮らしニスタ](https://kurashinista.jp/articles/detail/26472) via the gap file |

## 7. Constraints I am working under

- **Only `recipes/**` may be modified**, and **no pre-existing file may be edited.** That rules
  out: touching `counters.json` sections, fixing `miso-soup`'s inline dashi, adding a `pairs-with`
  line to `dashi.cook`, and correcting `teriyaki-sauce`. Every one of those is someone else's
  ticket.
- **Three sibling tickets are in flight on the same branch** — T-003-03 (The Soup Pot), T-003-05
  (The Slow Cooker), T-002-05 (Bowl Shop). All three write into `recipes/**` too, and T-003-03 and
  T-003-05 will be adding files to `recipes/soups/` and `recipes/stews-and-braises/`. Nothing is
  shared at file level, so exact `--include` paths on every `lisa commit-ticket` are the whole
  safety mechanism. **`npm run verify` and a bare `node scripts/check-recipes.mjs` over the whole
  collection will see their half-finished work**, so my verification has to be per-file and
  path-scoped.
- **Ingredient rows are the scarce resource on this shelf.** A dish whose seasoning is four
  bottles spends four rows before anything else. `dashi` as one row instead of three is not a
  nicety, it is what makes a 煮物 table fit.
- `>> servings:` is required and these are household portions — 2 to 4, not 8.
- The gap file asks for `aka` to carry the characters, a romanisation *and* the plain-keyboard
  spelling. The existing `dashi.cook` already does this (`出汁, だし, ichiban dashi, ...`), so
  there is a precedent and it is generous — ten variants on one line is normal here.

## 8. Open questions carried into Design

1. Which of the 41 candidate dishes in the gap file can actually clear 3 rows × 2 operations, and
   which have to be dropped rather than padded.
2. Whether `mentsuyu` — dashi, soy, mirin, three rows, one reduction — clears the operation floor
   at all, given it is the component four other files would lean on.
3. How to write 照り焼き so it does not read as a duplicate of `teriyaki-sauce`.
4. Whether `chahan` can be written so it is not `egg-fried-rice` in Japanese.
5. Where each of the ~26 files files itself among the 27 existing category folders, given none of
   them is Japanese-shaped.
