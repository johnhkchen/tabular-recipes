# T-007-01 — Research

What exists, where, and what the boards actually say. Descriptive only; the argument is in `design.md`.

---

## 1. The three files this ticket owns

### `src/data/counters.json`

One object, two keys: `"//"` (a long prose note that is the file's own documentation) and `"counters"`,
an array of **21** entries in menu order — `bakery, panaderia, taqueria, dim-sum-counter,
takeout-counter, pho-and-banh-mi, ramen-shop, curry-house, thai-kitchen, shawarma-counter, pizzeria,
deli, diner, smokehouse, meat-and-three, bowl-shop, instant-pot, one-pot, soup-pot, japanese-home,
slow-cooker`.

Each entry is `{ name, slug, blurb, categories: string[], sections: { title, items: string[] }[] }`.
A section may also carry `notes` — the only hand-written thing in the file, and the thing
`scripts/menu-sections.mjs --write` destroys.

Consumers:

- `src/lib/counters.ts` — `counters`, `counterBySlug`, `counterByName`, `menuFor()`, `menus()`.
  `menuFor()` drops any section whose items resolve to no shelved recipe (line 83); `menus()` drops
  any counter with `count === 0` (line 112). **An empty counter therefore renders nowhere and breaks
  nothing.**
- `scripts/check-recipes.mjs:27` — builds `KNOWN_COUNTERS` from `counters[].name` and fails any
  `.cook` file naming a counter not in that set.
- `scripts/parse-recipes.mjs:21` — same validation, plus the `categories` fallback (line 72) and the
  `notes` integrity checks (lines 109-155).
- `src/lib/collection.test.ts:12` — asserts every recipe's counters exist. It does **not** assert
  every counter has recipes, so an empty counter passes the suite.

Blurb register, read off all 21: one imperative sentence to a person standing at the counter.
*"Take a tray and tongs, fill it, pay at the register."* · *"Order by number, eat it out of the
carton."* · *"Choose the broth first; everything else follows."* Eleven of the 21 carry an empty
`categories`; the newest counters (bowl-shop, instant-pot, one-pot, soup-pot, japanese-home,
slow-cooker) all do.

### `docs/knowledge/counters.md`

978 lines. Opens with the definition (*"A counter is where you would get this if you were not making
it at home"*), then the two rules — archetypes not taxonomies, and **the menu word is the way in**
— then a `## Contents` table with three columns (`Counter | What it is | Combined or separate`), then
one `## <Counter>` section per counter.

Each section is: a **What it is.** paragraph, a **Combined / Separate** paragraph that argues the
call, then a three-column vocabulary table `| On the menu | Also called | Plainly |`. Table sizes
run from 15 rows (Panadería) to 24 (Bakery). The "Also called" column mixes non-Latin script,
romanisations and English board-names in one comma list; the "Plainly" column is one or two
sentences and routinely says what a thing is *not* (*"No pineapple in it."* · *"there is no fish in
it"* · *"Not the crisp pan-fried noodle dish the name means elsewhere."*).

**The Contents table is out of date.** It lists 15 counters against the 21 in `counters.json` — the
six S-002/S-003 additions were never given rows. The ticket asks only that Cha Chaan Teng gains its
row; it does not ask for the other six, and adding them would be another ticket's file.

The two neighbours this ticket must argue against are at lines 189-231 (Dim Sum Counter) and
234-271 (Takeout Counter). Their own entries already do half the work: Takeout says *"Separate from
the Dim Sum Counter. Different room, different hours, different vocabulary; the overlap is only char
siu."* Dim Sum says roast meats are folded in and should split back out if the collection ever
carries enough.

### `docs/gaps/`

23 files plus a README. The README (`docs/gaps/README.md`) says the `## What it has` block is
**machine-read** by `scripts/menu-sections.mjs`, that the shape is `**Section title.** slug · slug`,
and that section titles must not contain ` — ` because the parser cuts a title there.

Shape of a gap page, from `pho-and-banh-mi.md` and `dim-sum-counter.md`: a bold one-line tally
header, a short paragraph on what is left, `---`, `## What it has`, `## What it is missing`
(numbered, ranked), `## Components it would need` (bulleted), `## What it could not stock`
(bulleted, each naming why a table fails). `soup-pot.md` adds a **Sources** section at the end:
linked, each with a clause saying what that source established, plus a cautions paragraph addressed
to the writer ticket.

### `scripts/menu-sections.mjs` — the constraint that shapes the gap page

- `whatItHas()` slices from `## What it has` to the next `##`.
- `parseSections()` splits the block on `\n` followed by `**`. **A chunk that does not start with
  `**` is skipped entirely**, so prose placed *before* the first bold heading is invisible to it.
  Prose placed *after* a heading is absorbed into that heading's item list and scanned for slugs.
- `if (found.length) sections.push(...)` — **a heading with no slugs after it produces no section.**
- A slug listed but not shelved at that counter is reported as `listed but not shelved here`.
- `--write` is not run by `npm run verify`; `verify` is `check → recipes → vitest → astro build`.

Consequence for this ticket: the Cha Chaan Teng `## What it has` block can carry section headings
with **empty** item lists, matching `counters.json`, and `menu-sections.mjs` will report zero
sections for it rather than an error — the same state `soup-pot.md` described for itself before
T-003-03 wrote its files. Any explanatory prose must sit before the first `**`.

---

## 2. The seven existing slugs, read

| Slug | File | Counters today | What it actually is |
| --- | --- | --- | --- |
| `club-sandwich` | `sandwiches-and-rolls/` | Diner, Deli | Three slices, turkey, bacon, tomato, lettuce, mayo, cut in quarters on picks. |
| `beef-chow-fun` | `noodles/` | Dim Sum Counter | 乾炒牛河 — dry-fried, flank steak, ho fun, sprouts, yellow chives. `aka` already carries 乾炒牛河. |
| `french-toast` | `flatbreads-and-pancakes/` | Diner | Challah soaked in egg-milk-vanilla-cinnamon custard, **griddled in butter**, maple syrup. |
| `borscht` | `soups/` | Deli, One Pot | 1½ lb **beets**, short ribs, 2 hr 15 min, dill and sour cream. Ukrainian. |
| `pineapple-bun` | `breads/` | Bakery, Dim Sum Counter | Tangzhong dough, cookie lid with custard powder and baker's ammonia. 3 hr 30 min. |
| `egg-custard-tart` | `custards-and-puddings/` | Dim Sum Counter, Bakery | Sugar syrup, eggs, **evaporated milk**, strained twice, into a blind-baked shell. |
| `lo-mein` | `noodles/` | Takeout Counter | Fresh egg noodles boiled 3 min then tossed with char siu, napa, oyster sauce. Chinese-American. |

Collateral facts: `recipes/drinks/` holds exactly **three** files — `ca-phe-sua-da`, `egg-cream`,
`milkshake` — and all three are poured cold, which is the gap `docs/gaps/README.md` ranks fifth.
`western-omelette` exists at the Diner (奄列). `bechamel`, `homemade-ketchup`, `french-fries`,
`onion-rings`, `egg-fried-rice`, `char-siu`, `wonton-soup`, `singapore-mei-fun` and
`chinese-five-spice-powder` all exist. 658 `.cook` files total. Only three files mention Hong Kong
at all: `egg-custard-tart`, `pineapple-bun`, `char-siu-bao`.

---

## 3. What the boards say

### The set-meal grid is a grid of *times*, not of dishes

Cantonese Wikipedia's 茶餐廳 entry sets out the frame that every board read since has matched:

- **早餐** — morning. 牛油餐包、西煎雙蛋、火腿通粉、咖啡或茶.
- **午餐** — 11:00 to 14:30. Same shape with swaps (火腿奄列、叉燒湯意粉).
- **快餐** — lunch hours only, pre-cooked, served immediately; a 碟頭飯 with a soup chosen from
  紅湯/羅宋湯, 白湯/忌廉湯 or 中湯/例湯.
- **常餐** — all day, unchanged year-round. That is where the name comes from.
- **下午茶餐** — afternoon, and it is the fried section: 炸雞髀、炸雞翼、西多士、炸薯條.
- **營養餐** — all day, same as breakfast but with bottled or chocolate milk.

Hours: Chinese Wikipedia's 下午茶 entry puts HK afternoon tea at **14:30–17:30**; the three big
chains (大家樂 Café de Coral, 大快活 Fairwood, 美心MX) all print **14:00–17:00** for their 下午茶餐,
per the roasterpig survey of their current boards. A cha chaan teng's own trading day runs roughly
05:00/06:00 to 01:00, split 早市 / 午市 / 下午茶 / 晚市 / 宵夜.

**The drink is in the price.** The Peak (Glebe, Sydney) prints its whole set block as *"茶餐 Set Menu
(Each includes Milk Tea or Coffee)"*. Café de Coral's 花生醬西多士茶餐 at HK$34 is *西多士 + 湯粉 +
飲品*. Fairwood's 肉燥麵下午茶餐 at HK$28 is *粉麵 + 燒賣 + 蘿蔔糕 + 熱飲*. Chinese Wikipedia notes
the surcharges that prove the drink is the baseline: about HK$2–3 to take a cold drink instead of
hot, about HK$5 to have the bread toasted.

### Section order on real boards

| Board | Sections, in printed order |
| --- | --- |
| 極上冰室, Tsim Sha Tsui (OpenRice takeaway menu) | 早餐 · 三文治及多士 · 港式風情 · 常餐 · 下午茶-茶點 · 湯飯 · 粉麵飯 · 小炒 · 煲仔 · 咖喱 · 西式 · 小食 · 飲品 |
| The Peak HK Cafe, Glebe, Sydney | 招牌之選 · 飯類 Over Rice · 麵類 Noodles · 三文治·包 Sandwiches & Rolls · 小吃·包點·湯 · 甜品 Sweets & Toast · 港式飲品 · 咖啡·茶 · 茶餐 Set Menu |
| Kowloon Cafe, Brooklyn NY | Soup · Drinks · Smoothies · Milk Shake · Ice Drink · Omelettes · Sandwiches · Appetizer · Fried Rice · Chow Fun/Fried Noodle/Mei Fun · Chinese Style · Western Style |

Three cities, and all three separate a *toast-and-sandwich* block from a *rice plate* block from a
*noodles-in-soup* block, and all three give drinks their own long section.

### What the English on the board says

Straight off the Brooklyn board, which prints English only: *Borsch Soup* · *Butter & Condensed Milk
with Toast* · *Peanut Butter & Condensed Milk & Toast* · *French Toast* · *Kowloon French Toast*
(the house 西多士, priced above the plain one) · *Club Sandwich* · *Spam & Egg Sandwich* · *Corn Beef
& Egg Sandwich* · *Satay Beef Sandwich* · *Pork Chop Sandwich* · *Coffee & Tea* (鴛鴦) · *Hong Kong
Style Tea* · *Ovaltine* · *Holick* (Horlicks, misspelled on the board) · *Baked Pork Chop Over Rice /
Spaghetti* · *Baked Portuguese Chicken* · *Combo Chops* · *Fish Filet w/ Corn sauce*.

From Sydney: *Ham & Macaroni Soup* · *Satay Beef Fried Instant Noodles* · *Thick-Cut Butter Toast* ·
*Crispy Bun with Condensed Milk* · *Ovaltine Toast* · *Snow White* · *Cola Spider* · *Yuenyeung (Tea
& Coffee Mix)* · *Pineapple Bun, Cold Butter*.

The Sydney set block, verbatim: **Set A** satay beef noodle soup with scrambled egg, ham & toast ·
**Set B** baked pork chop fried rice · **Set C** thick scrambled egg sandwich · **Set D** pork &
preserved vegetable noodle soup with scrambled egg, ham & toast · **Set E** Hong Kong French toast.

### Spellings that all coexist

茶餐廳 / cha chaan teng / cha chan teng / chachanteng · 冰室 / bing sutt / bing sat · 鴛鴦 / yuenyeung
/ yuen yeung / yuanyang, and on the Brooklyn board simply *Coffee & Tea* · 奶茶 / naai cha / nai cha
/ lai cha, and 絲襪奶茶 / silk stocking / pantyhose milk tea · 西多士 / sai do si, and on boards
*French Toast*, *HK French Toast*, *Kowloon French Toast*, *Western Toast* · 菠蘿包 / bo lo bao and
菠蘿油 / bo lo yau, printed as *Pineapple Bun, Cold Butter* · 羅宋湯 / lo song tong, printed as
*Borsch Soup* or *Borscht* · 公仔麵 / gong zai mein, printed as *Instant Noodles*.

### Ordering slang (Cantonese Wikipedia, 茶餐廳)

走冰/走雪 no ice · 飛沙走奶 black coffee no sugar no milk · 茶走 / 啡走 condensed milk instead of
evaporated · 少甜/走甜 · 加底 extra rice or noodles · 扣底 less · 炒底 swap to fried rice · 烘底
toast the bread · 戴帽 fried egg on top · 走青 no scallion or coriander · 靚仔 plain rice · 靚女
plain congee · 行街 takeaway. Order-slip shorthand: 反=飯, 0T=檸茶.

### The tea

- **The blend.** Sri Lankan Ceylon, and it is a blend of grades rather than one tea. The Hong Kong
  Coffee and Tea Association names the three by their trade grades: **BOP (Broken Orange Pekoe) =
  粗茶**, aroma; **BOPF (Broken Orange Pekoe Fannings) = 中粗茶**, colour and body; **DUST = 幼茶**,
  which extracts fastest and carries most of the flavour and colour. Shop practice is *three or
  more* grades, and some houses use seven or eight. Lan Fong Yuen is variously reported as a secret
  blend of **five** and of **six** teas. So the honest statement is a range, not a recipe.
- **The pull.** 撞茶: the brewed tea is poured back through the cloth bag onto the leaves and
  repeated. Reported counts differ by shop and by source — **3 to 4** times in the Taiwanese
  食譜自由配 write-up, **8** times at Lan Fong Yuen per one account and **exactly 3** per another,
  against the same shop. Water temperature is given as **90–96 °C** and a ratio of **1 g blended
  leaf : 30 g water**, from one source only. The named sequence is 一沖、二焗、三撞、四回溫 — brew,
  steep covered, pull, bring back to temperature. The ICH listing gives the steps as 調配茶葉 → 煲茶
  → 撞茶 → 焗茶 → 撞奶 and states plainly that **並無統一標準** — there is no single standard, each
  master's材料、分量、手法 differ.
- **The milk.** Evaporated, not condensed, and the house brand matters: 黑白淡奶 (Black & White) is
  the default and is described as creamier and denser than the alternatives; Lan Fong Yuen is
  reported to use a non-dairy creamer instead. 茶走 is the order that swaps in condensed milk and
  drops the sugar.
- Listed on the first Hong Kong ICH representative list in **2017** as 港式奶茶製作技藝.

### 羅宋湯 is not borscht

The Medium field guide describes 羅宋湯 as an **orange** soup of oxtail, cabbage, tomato, potato,
onion and celery. No beetroot appears in any board description read. The Brooklyn board prints it as
*Borsch Soup* beside clam chowder and cream of mushroom — it is the 紅湯 half of the 快餐's
red-soup/white-soup choice, and the white one is 忌廉湯.

---

## 4. Constraints carried into Design

1. `menu-sections.mjs` drops a heading with no slugs, so the `## What it has` block can be written
   empty and stay honest; prose must sit before the first `**`.
2. `menus()` hides a zero-recipe counter, so nothing renders and nothing breaks between this ticket
   and T-007-05.
3. `categories` must be `[]` — `Sandwiches & Rolls` (60+ files) and `Soups` (66 files) are both
   claimed elsewhere and either would drag the Deli or the Diner onto this board.
4. **T-007-02 owns The Soup Pot.** This ticket adds an entry and touches nothing else in
   `counters.json`; the two tickets are serialised by `depends_on` for exactly that reason.
5. `docs/knowledge/counters.md` needs ≥20 vocabulary rows and every row's *Also called* must carry
   at least one non-English spelling **and** one romanisation or English board-name.
6. Never state a tea number flatly. The sources disagree with each other and with themselves, and
   the ICH listing says outright there is no standard.
