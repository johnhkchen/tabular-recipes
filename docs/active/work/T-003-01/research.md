# T-003-01 — Research

What exists, where, and what the three new shelves have to fit into. Descriptive only.

---

## 1. The ticket's two jobs, and where they land

| Job | File(s) | Owner conflict |
| --- | --- | --- |
| Open three counters | `src/data/counters.json` | Held by T-002-01 (done, commit `2b8d1db` era). T-003-06 takes it next. |
| Write three work lists | `docs/gaps/soup-pot.md`, `japanese-home.md`, `slow-cooker.md` | New files; nothing else in `docs/gaps/` is touched. |

Acceptance also demands a throwaway `.cook` proving a counter name validates, **not committed**.

## 2. `src/data/counters.json` as it stands

1457 lines. Shape is `{ "//": <long comment>, "counters": [ … ] }`. Each counter object, in key
order as written: `name`, `slug`, `blurb`, `categories`, `sections[]`, where each section is
`{ "title", "items": [slug, …] }`.

**Nineteen counters today.** Fifteen storefronts from S-001, plus the three T-002-01 opened
(The Bowl Shop, Instant Pot, One Pot) — and those three still carry **empty item lists**, which is
the precedent this ticket copies exactly. Section counts confirmed by reading the file:
Bowl Shop 7 sections / 0 items, Instant Pot 6 / 0, One Pot 5 / 0.

`categories` is a fallback only, documented in the file's own `//` comment: a recipe naming no
counter lands at whichever counters claim its category. **Nine of fifteen S-001 counters carry
`[]`, and all three T-002-01 counters carry `[]`.** `docs/gaps/README.md` records *0 counters
inferred from category* for the whole collection.

### The house style T-002-01 set for a counter that is not a shop

`docs/active/work/T-002-01/design.md` §D1.4 is explicit. A blurb is a one-line instruction to a
visitor standing at the counter, second person or imperative, no cuisine adjectives. For the two
equipment shelves it rejected technique descriptions and chose the bargain:

- Instant Pot — *"Lock the lid and walk away; it gets there on its own."*
- One Pot — *"Everything goes in one pan, and that is the only pan to wash."*
- Bowl Shop (a shop) — *"Pick a base, pile it up, dress it last."* — the order you order in.

The fifteen shop blurbs are queue instructions: *"Take a tray and tongs, fill it, pay at the
register."*, *"Order by number, eat it out of the carton."*, *"Sliced, spread, and sold by the
tub."* The ticket's framing — bargain rather than queue, register kept out — is exactly the
Instant Pot / One Pot register, not the Panadería one.

### Two hard constraints on section titles

- **No ` — ` inside a title.** `scripts/menu-sections.mjs:55` cuts a title at the em-dash aside.
- A section whose items resolve to zero recipes is dropped at render (`src/lib/counters.ts`), and
  a counter with `count === 0` generates no page. So empty sections are safe and invisible until
  T-003-06 fills them.

`Also here` closes Panadería, Bowl Shop, Instant Pot, One Pot; `The shelf` closes Ramen Shop, Thai
Kitchen, Dim Sum Counter. Both are the existing convention for the catch-all.

## 3. `scripts/check-recipes.mjs` — what "a counter name passes" means

Lines 22–26 build `KNOWN_COUNTERS` from `counters.json` `.counters[].name`. Lines 55–61 fail any
recipe whose `>> counters:` names something not in that set, printing the full known list. So the
counter **name** string is the contract, not the slug — `The Soup Pot`, `Japanese Home Cooking`,
`The Slow Cooker` must match character for character, including the leading `The`.

Other gates a throwaway file must clear to prove the point: `title`, `category`, `tags`,
`servings` present (line 18); ≥3 ingredient rows and ≥3 columns (lines 70–71); no unlabelled
operation cell (lines 73–79). A minimal proof file is therefore a real small recipe, not a stub.

## 4. `docs/gaps/` — the shape to copy

Eighteen files plus `README.md`. Two distinct shapes:

**S-001 shop pages** (`bakery.md`, `taqueria.md`, …) use `## What it has`, which
`scripts/menu-sections.mjs` parses back into `counters.json` byte-for-byte. Line shape
`**Section title.** slug · slug`.

**S-002 new-shelf pages** (`instant-pot.md`, `one-pot.md`, `bowl-shop.md`) use
`## What is already here` instead, deliberately — the parser only reads `## What it has`, and
these slugs are shelved elsewhere, so parsing them would report every one as *listed but not
shelved here*. Each carries a paragraph saying so and naming T-002-08 as the ticket that renames
the heading. Section order: title line + a bold count-and-thesis paragraph → `## What is already
here` → `## What it is missing` (ranked) → `## Components it would need` → `## What it could not
stock`.

**The three new files belong to the second shape.** T-003-06 is their renamer, not T-002-08.

The ticket names three required blocks: what is already here (by slug, grouped by section), a
ranked missing list, and what a single table cannot hold. The S-002 files' fourth block
(*Components it would need*) is not required but is present on all three siblings.

No gap file currently cites a URL. `docs/knowledge/counters.md` carries all sourcing, in a
`**Chinese counters.** houseofdimsumsf.com · …` shape. The Soup Pot criterion demands sources
in the gap file itself, so this is a new pattern for `docs/gaps/`.

## 5. The collection, measured

**553 `.cook` files** across 27 category folders (`find recipes -name '*.cook' | wc -l`).
`src/generated/recipes.json` carries per-recipe `slug, category, tags, counters, dish, kit,
slack, aka, pairsWith, ingredientNames, cookware, metadata, steps[].timers[]`.

**25 Instant Pot variants exist already** — T-002-02 and T-002-03 got further than the ticket
text assumes. By `dish:`: `beef-bourguignon`, `beef-stew`, `birria-de-res`, `boston-baked-beans`,
`braised-short-ribs`, `cachete`, `carnitas`, `chicken-broth`, `chile-verde`, `chili-con-carne`,
`chintan-broth`, `collard-greens`, `congee`, `corned-beef`, `cuban-black-beans`, `ful-medames`,
`gigantes-plaki`, `ham-hock-stock`, `hungarian-goulash`, `oxtails`, `pho-broth`, `pot-roast`,
`refried-beans`, `tonkotsu-broth`, `borscht`. **This is the set that makes T-003-05's
three-way-choice criterion (≥12) satisfiable, and it must be measured, not assumed.**

### The Soup Pot's raw material

`recipes/soups/` holds 44 files. Chinese or Chinese-adjacent, by counter: `congee` +
`congee-instant-pot` (Dim Sum Counter), `egg-drop-soup` and `hot-and-sour-soup` (Takeout Counter),
`wonton-soup` (Takeout Counter). Adjacent non-soup Cantonese: `chicken-feet` (Dim Sum Counter,
`stews-and-braises/`), `lo-mai-gai`, `soy-sauce-chicken`, `white-cut-chicken`.

**Confirmed: not one 老火湯 on the shelf**, matching the story's claim. No dried Chinese soup
ingredient appears anywhere in `ingredientNames` — no 淮山, no 蜜棗, no 南北杏, no 玉竹, no dried
scallop, no dried octopus. The genre is absent entirely, not thinly represented.

Generic stocks that a Cantonese soup would *not* use but that sit nearby: `chicken-broth`,
`ham-hock-stock`, `pho-broth`, `chintan-broth`, `tonkotsu-broth`.

### Japanese Home Cooking's raw material

31 files mention Japan; 28 carry a `japanese` tag. Every one is shelved at the **Ramen Shop**
except `japanese-milk-bread` (Bakery) and `castella` (Bakery). By slug:

- Ramen system: `ramen-noodles`, `shio-ramen`, `shoyu-ramen`, `miso-ramen`, `tonkotsu-ramen`,
  `chintan-broth`, `tonkotsu-broth`, `shio-tare`, `shoyu-tare`, `miso-tare`, `mayu`, `ajitama`,
  `menma`, `chashu`.
- Foundations: `dashi`, `miso-soup`.
- Izakaya / restaurant plates: `karaage`, `gyoza`, `okonomiyaki`, `chawanmushi`, `haemul-pajeon`
  (Korean, misfiled — README records it), `goma-dare`, `miso-ginger-dressing`,
  `japanese-beef-curry`, `teriyaki-sauce`, `shichimi-togarashi`.
- Bakery: `japanese-milk-bread`, `castella`.

**No plain steamed rice recipe exists anywhere on the site** — no `gohan`, and the rice folder's
files are all seasoned (`rice-pilaf`, `coconut-rice`, `lemon-rice`, `yellow-rice`, `pilau-rice`,
`mexican-red-rice`). This is a real hole under "The soup and the rice".

Confirmed missing: nikujaga, shōgayaki, oyakodon, gyūdon, katsudon, omurice, tamagoyaki, kinpira,
hijiki, ohitashi, sunomono, buri daikon, saba shioyaki, takikomi gohan, chikuzenni, korokke,
hambāgu, nimono of any kind.

### The Slow Cooker's raw material

Measured from `recipes.json`: **112 plain (no `kit:`) recipes carry a wet timer ≥40 min**. Filtered
to genuine covered wet cooks and excluding baking, marinating, curing and chilling, the braise/
bean/stock population is roughly 60 files — the same population `instant-pot.md` ranked, which is
why cross-checking it is a ticket requirement rather than a courtesy.

Longest wet cooks, plain files only, with whether an Instant Pot variant exists:
`tonkotsu-broth` 8 hr (IP), `pho-broth` 6 hr (IP), `boston-baked-beans` 5 hr oven (IP),
`chintan-broth` 4 hr (IP), `birria-de-res` 4 hr (IP), `chicken-broth` 3 hr (IP),
`ham-hock-stock` 3 hr (IP), `beef-bourguignon` / `braised-short-ribs` / `cachete` / `carnitas` /
`corned-beef` / `oxtails` / `pot-roast` 3 hr (all IP), `chashu` / `lengua` /
`new-england-boiled-dinner` 3 hr (no IP), `bolognese` 3 hr (no IP).

## 6. What the downstream tickets inherit

- **T-003-02** (slack property) is *in flight* and independent. Every writer needs it. Nothing in
  this ticket touches it, but the gap files should not contradict its vocabulary.
- **T-003-03** needs ≥20 soups, ≥12 老火湯 and ≥5 滾湯, each with `aka` in characters +
  romanisation + plain-keyboard spelling, written in the gap file's order as far as the count
  reaches. So the ranked list must be **longer than 20 and ordered so the first 12 are 老火湯**.
- **T-003-04** needs ≥22 files, ≥3 per section, ≥5 each in 煮物 and 小鉢, `dashi` referenced via
  `pairs-with:` and never re-taught, canonical seasoning ratios.
- **T-003-05** needs ≥18 files, ≥12 of which name a dish that also has an Instant Pot variant, and
  every time canonical for the named setting.
- **T-003-06** fills `counters.json` sections and requires **no counter renders an "Also here"
  section** — which means "Also here" is written now as a catch-all and is expected to end up
  empty or absorbed. It also requires The Soup Pot ≥22 shelved and Japanese Home ≥25.

## 7. Domain research — sources gathered

**老火湯.** A Cantonese pot of water, meat and dried goods held at a bare simmer for ≥2–3 hr,
untouched; the broth is the dish and the solids are spent. The organising logic is seasonal and
per-ingredient: spring 健脾養肝袪濕, summer 消暑清熱, autumn 清潤肺燥, winter 益肺補腎補氣.
Distinguished from **滾湯** (water boiled first, quick-cooking ingredients, 15–45 min, made
nightly) and **燉湯** (double-boiled in a sealed vessel inside water).
Sources: [hk01 湯水營養](https://www.hk01.com/教煮/549421/), [鴻福堂 廣東湯文化及歷史](https://jikaon.hungfooktong.com/廣東湯文化及歷史),
[Kanlaw 廣東老火靚湯譜 七十款](http://kanlaw.blogspot.com/2013/02/blog-post.html) (70 named soups with
pairing and stated purpose), [hk01 滾湯食譜 12 款](https://www.hk01.com/教煮/509945/),
[Cosmopolitan HK 8 款家常滾湯](https://www.cosmopolitan.com.hk/cosmobody/boiling-soup),
[The Woks of Life — Ching Po Leung](https://thewoksoflife.com/ching-po-leung-soup/),
[China Sichuan Food — Chinese herbal soup ingredients](https://www.chinasichuanfood.com/chinese-herbal-soup-ingredients/),
[Made With Lau — Old Fire Soup](https://newsletter.madewithlau.com/p/my-dads-super-simple-old-fire-soup).

**一汁三菜.** Rice + 汁物 + 主菜 (the body-building dish) + 副菜 and 副々菜 (the two small
condition-regulating dishes, typically 煮物 and an 和え物/おひたし). It is a menu-composition rule,
not a serving suggestion. Sources: [和食の旨み](https://www.kobayashi-foods.co.jp/washoku-no-umami/a-soup-and-three-plates),
[cotogoto 一汁三菜](https://www.cotogoto.jp/blog/2017/04/kihon_ichizyuusannsai.html),
[マックスバリュ東海 献立の基本](https://www.mv-tokai.co.jp/tsushin/36562/).

**煮物の黄金比.** Vegetable 煮物 dashi 10 : soy 1 : mirin 1 : sake 1; 肉じゃが-type seasoning runs
soy 1 : mirin 1 against a smaller dashi volume. Sources:
[和食の旨み 黄金比](https://www.kobayashi-foods.co.jp/washoku-no-umami/boiled-golden-ratio),
[SATETO 煮物の黄金比 5:1:1:1](https://coop-sateto.jp/special/nimono_ougonhi/).

**作り置き keeping.** General guide 2–3 days refrigerated, 2–3 weeks frozen; きんぴら 3 days (4–5
if the liquid is cooked off), ひじきの煮物 1–2 days. Sources:
[macaroni きんぴら](https://macaro-ni.jp/42466), [macaroni ひじき煮](https://macaro-ni.jp/142936),
[暮らしニスタ 常備菜の日持ち](https://kurashinista.jp/articles/detail/26472).

**Slow cooker vs pressure.** ATK: a dedicated slow cooker beats a multicooker at slow cooking;
pressure wins on tough cuts and dried beans. Source:
[ATK — Slow Cooker vs. Instant Pot](https://www.americastestkitchen.com/articles/5883-slow-cooker-vs-instant-pot).

**A safety fact that changes a recipe.** Dried red kidney beans carry phytohaemagglutinin; a slow
cooker's low setting may not destroy it, and the FDA guidance is soak then **boil 10–30 min** in
fresh water before slow cooking. Checked against the collection: `chili-con-carne` has no beans at
all, and the seven dried-bean recipes use black, pinto, navy, lima, gigante and black-eyed peas —
**no kidney bean anywhere today**. So it is a hazard for what T-003-05 might write, not a defect in
what exists. Sources: [Illinois Extension](https://extension.illinois.edu/blogs/live-well-eat-well/2024-02-29-kidney-beans-and-slow-cookers),
[K-State — Do Not Cook Dry Beans in a Slow Cooker](https://www.johnson.k-state.edu/programs/health-food-safety/newsletter-articles/agents-articles/do-not-cook-dry-beans-in-slow-cooker.html).

## 8. Constraints and assumptions carried forward

- Only `src/data/counters.json` and `docs/gaps/**` may be modified. The throwaway proof `.cook`
  must be deleted before Review, and must never be committed.
- `node scripts/check-recipes.mjs` must report ok for the whole collection **unchanged** — adding
  counters can only ever *widen* `KNOWN_COUNTERS`, so the risk is a malformed JSON file, not a
  changed verdict.
- The three counters get `categories: []`, following all three T-002-01 siblings and the recorded
  *0 counters inferred from category*.
- Never fabricate a number. The Soup Pot's timings, the Japanese ratios and the slow-cooker hours
  are the writers' to establish per file; this ticket's job is to name the sources and the logic,
  and to say plainly where a claim is uncertain.
