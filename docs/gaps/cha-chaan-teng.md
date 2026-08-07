# Cha Chaan Teng — what is missing

**22 recipes, and five more borrowed off other boards.** The counter was opened by T-007-01 with
seven ordered sections and empty item lists; T-007-03 wrote the drinks and the toast, T-007-04 the
plates, bowls and sandwiches, and T-007-05 shelved them. This page began as their work list — the
only one in this folder written *before* the shelf rather than after it — and from here on it is
what every other page in this folder is: the record of what landed.

**Rank is by what a reader can cook tonight, not by what is most emblematic.** That is the whole
argument of S-007: the shelf this one replaces failed because its ingredients came from a herbalist
and its clock bought a course rather than a dinner. So a dish that needs a saucepan and a
supermarket ranks above a dish that needs a wok hot enough to scorch rice noodles, and both rank
above anything needing one shop across town. The rule held: 乾炒牛河 is the most Hong Kong thing on
this board and it was the last thing this shelf spent a ticket on, which is why it arrived borrowed
from the Dim Sum Counter rather than rewritten.

**The tea was the hard recipe on this shelf and it is written.** 港式奶茶 is three separate
decisions — the blend, the pull, and the milk — and the sources disagree with each other about
every one of them; the Hong Kong intangible-heritage listing says outright that there is no single
standard. `hong-kong-milk-tea` prints ranges rather than picking, and [the tea](#the-tea) below is
now the record those ranges came from rather than an instruction to a writer.

**A Hong Kong dish that shares an English name with a Western one is usually not the same dish.**
Two of the seven files this board was assumed to inherit are traps, and the section on
[what this board borrows](#what-this-board-borrows-and-what-it-must-not) goes through all seven by
slug.

---

## What it has

Five sections, in the order the counter prints them, and the same five in
`src/data/counters.json` — `node scripts/menu-sections.mjs` reads this block back into that file.
Two of T-007-01's seven headings are gone. *The set meals* could only ever be empty: 常餐 is a rule
and not a dish, which is the first entry under [what a table cannot hold](#what-a-table-cannot-hold),
and the set grid is recorded in `docs/knowledge/counters.md` where it belongs. *Also here* was the
catch-all, and there is nothing left over to put in it.

Five of the slugs below are borrowed — shelved at other counters, listed here because a diner at
this one is sold them, and named one by one in
[what this board borrows](#what-this-board-borrows-and-what-it-must-not). Read the caution there
before adding a sixth: `menuFor()` builds its lookup from the recipes whose own `>> counters:` line
names this counter, so a borrowed slug is recorded in this file and dropped from the page. The
counter prints 22.

**The drinks counter.** hong-kong-milk-tea · yuenyeung · iced-lemon-tea · lemon-coke-with-ginger ·
horlicks · red-bean-ice

**Toast and the bun case.** thick-toast · hong-kong-french-toast · pineapple-bun · egg-custard-tart

**Macaroni, noodles and things in soup.** ham-macaroni-soup · luncheon-meat-and-egg-noodles ·
hong-kong-borscht · satay-beef-noodles · soy-sauce-pan-fried-noodles · beef-chow-fun · char-siu

**Rice plates.** baked-pork-chop-rice · pork-chop-in-tomato-sauce · minced-beef-rice ·
shrimp-and-egg-rice · curry-beef-brisket · swiss-wings

**Sandwiches and buns.** luncheon-meat-and-egg-sandwich · hong-kong-egg-sandwich · pork-chop-bun ·
club-sandwich

## What it is missing

Five dishes, down from twenty-four. Nineteen of T-007-01's ranks were written by T-007-03 and
T-007-04 or shelved from another board by T-007-05; the old rank is kept in brackets so the
argument that put each one there is still findable. The ranking rule has not changed — **what a
reader can cook tonight, not what is most emblematic** — and what is left over is what the rule
pushed down.

1. **撈丁 dry instant noodles** *(was 22)* — the same packet noodles as 公仔麵, drained and tossed
   in sauce rather than served in broth. Ten minutes and a packet, so the rule puts it top. Worth
   writing precisely because "lo" here means the opposite of what it means on the takeout board,
   and `luncheon-meat-and-egg-noodles` is already here to pair to.

2. **咖喱汁 Hong Kong curry sauce** *(was 13)* — mild, yellow, thickened with coconut milk, and not
   an Indian curry. One saucepan, supermarket curry powder and a tin. `curry-beef-brisket` derives
   it inline across steps 2 to 4, and rank 5 below cannot be written until it exists.

3. **菠蘿油 pineapple bun with butter** *(was 21)* — `pineapple-bun` split warm around a cold slab
   of butter. The assembly is five minutes; the bun under it is three and a half hours, which is
   why it is a short file that pairs to the bun rather than a second bun recipe.

4. **焗葡國雞飯 baked Portuguese chicken rice** *(was 23)* — chicken and potato in a mild coconut
   curry, baked over rice under cheese. It was ranked last of the baked plates so it could share
   `baked-pork-chop-rice`'s shape; that file now exists, so this one is unblocked.

5. **咖喱魚蛋 curry fish balls** *(was 19)* — rank 2's sauce over bought fish balls. Still blocked
   on an ingredient that is genuinely one-shop in most cities, which is exactly the failure mode
   S-007 is correcting for, so it is written with a stated substitution or not at all.

### What got written, and what closed each rank

| Old rank | Dish | File |
| --: | --- | --- |
| 1 | 港式奶茶 | `hong-kong-milk-tea` |
| 2 | 凍檸茶 | `iced-lemon-tea` |
| 3 | 鴛鴦 | `yuenyeung` |
| 4 | 奶醬多 / 厚多士 | `thick-toast` |
| 5 | 餐蛋治 | `luncheon-meat-and-egg-sandwich` |
| 6 | 滑蛋 | `shrimp-and-egg-rice` — the technique is the dish's first half |
| 7 | 火腿通粉 | `ham-macaroni-soup` |
| 8 | 公仔麵 | `luncheon-meat-and-egg-noodles` |
| 9 | 羅宋湯 | `hong-kong-borscht` |
| 10 | 瑞士雞翼 | `swiss-wings` |
| 11 | 茄汁豬扒 | `pork-chop-in-tomato-sauce` |
| 12 | 西多士 | `hong-kong-french-toast` |
| 14 | 焗豬扒飯 | `baked-pork-chop-rice` |
| 15 | 咖喱牛腩 | `curry-beef-brisket` |
| 16 | 沙嗲牛肉麵 | `satay-beef-noodles` |
| 17 | 免治牛肉飯 | `minced-beef-rice` |
| 18 | 豬扒包 | `pork-chop-bun` |
| 20 | 紅豆冰 | `red-bean-ice` |
| 24 | 乾炒牛河 | `beef-chow-fun`, shelved rather than written |

Four files landed that were on no rank: `horlicks` (the board prints it *Holick* and nobody finds
it), `lemon-coke-with-ginger`, `hong-kong-egg-sandwich` — 蛋治, the plain one the 餐蛋治 is a
variation of — and `soy-sauce-pan-fried-noodles`, 豉油皇炒麵, which every board read prints and this
list missed.

### The tea

Three decisions, and the honest position on each is a range with its source attached.

- **The blend.** Ceylon black tea from Sri Lanka, and it is a blend of *grades*, not of estates.
  The Hong Kong Coffee and Tea Association names them by their trade grades: **BOP** (Broken Orange
  Pekoe, 粗茶) for aroma, **BOPF** (Broken Orange Pekoe Fannings, 中粗茶) for colour and body, and
  **DUST** (幼茶), which extracts fastest and carries most of the flavour. Shop practice is three
  grades or more; some houses use seven or eight. Lan Fong Yuen is reported as a secret blend of
  **five** teas in one account and **six** in another. **No source states a ratio.** A file that
  invents one is inventing the recipe.

- **The pull.** The named sequence is 一沖、二焗、三撞、四回溫 — brew, steep covered, pull, bring back
  to temperature — and the heritage listing gives the steps as 調配茶葉 → 煲茶 → 撞茶 → 焗茶 → 撞奶.
  撞茶 is pouring the brewed tea back through the cloth bag onto the leaves and repeating. **The
  count is where the sources fall apart**: 3 to 4 times in the Taiwanese write-up, 8 times at Lan
  Fong Yuen in one account and *exactly 3* at the same shop in another. One source, and only one,
  gives numbers for the brew: **90–96 °C** and **1 g blended leaf to 30 g water**. Use them if you
  use them at all *as that source's numbers*, and say so in the file.

- **The milk.** Evaporated, not condensed. 黑白淡奶 (Black & White) is the default and is described
  as creamier and denser than the alternatives; Lan Fong Yuen is reported to use a non-dairy
  creamer instead, which is the clearest evidence that "the" recipe does not exist. 茶走 is the
  order that swaps in condensed milk and drops the sugar, and it is a one-line variation rather
  than a second file.

- **What is settled.** The technique was listed on Hong Kong's first intangible cultural heritage
  representative list in **2017**, as 港式奶茶製作技藝, and that listing states plainly that
  **並無統一標準** — each master's materials, quantities and hand differ. A file that says so is
  more accurate than a file that picks one.

---

## What this board borrows, and what it must not

Seven files were already in the collection and the story assumed all seven belong here. Five do, one
needs a new file beside it, and one shares nothing but an English name. Every verdict below was
applied as written; the **What happened** column is what T-007-05 did with it.

**A borrowed slug does not reach the page.** `menuFor()` in `src/lib/counters.ts` looks each slug
up among the recipes whose own `>> counters:` line names this counter, and drops anything it does
not find — silently, with nothing failing. So the five *shelve as is* rows are listed in
[what it has](#what-it-has) and in `src/data/counters.json`, and the counter prints 22 rather than
27. Making them appear needs `Cha Chaan Teng` added to five `>> counters:` lines, which is a
one-line edit per file and belongs to whoever owns those files. `scripts/menu-sections.mjs` reports
the five as *listed but not shelved here* every run, and that line is the reminder, not a fault.

| Slug | Verdict | What happened | Why |
| --- | --- | --- | --- |
| `club-sandwich` | **shelve as is** | listed, not rendering | 公司三文治 is printed under that exact English on the Brooklyn board. Same three slices, same quartering on picks. The Hong Kong version usually swaps a fried egg in for one of the fillings; that is an `aka` and a note, not a rewrite. |
| `beef-chow-fun` | **shelve as is** | listed, not rendering | Already carries 乾炒牛河 in its own `aka` and is already dry-fried flank over ho fun. Same dish on the dim sum board and on this one. Add the counter and stop. |
| `pineapple-bun` | **shelve as is** | listed, not rendering | Same bun, already shelved at two counters. 菠蘿油 — the same bun split around cold butter — is rank 21 and is a short assembly file, not a second bun. |
| `egg-custard-tart` | **shelve as is** | listed, not rendering | Already made with evaporated milk, already at Bakery and Dim Sum Counter. A genuine three-board dish and the collection already models it that way. |
| `char-siu` | **shelve as is** | listed, not rendering | Not on the story's list of seven but it belongs here anyway: 叉燒湯意粉 is a breakfast-set item on a Hong Kong board and 叉燒 is already written. Noted so T-007-05 does not miss it. |
| `french-toast` | **write a new file** | `hong-kong-french-toast` written | The existing file is day-old challah soaked in an egg-milk-vanilla-cinnamon custard, **griddled in butter**, and finished with maple syrup. 西多士 is two slices sandwiched around **peanut butter**, egg-dipped, **deep-fried** in oil, and finished with a slab of butter and golden syrup. Different fat, different method, and there is a filling. **The new file must say in it that it is not `french-toast`**, and pair to it. |
| `borscht` | **write a new file** | `hong-kong-borscht` written | The existing file is 1½ lb of grated **beetroot** with short ribs, dill and sour cream — Ukrainian, 2 hr 15 min. 羅宋湯 is a tomato-and-cabbage soup with celery, onion and potato and **no beetroot at all**; the name travelled through Shanghai from "Russian" and stuck to a different soup. **The new file must say in it that it is not `borscht`.** |
| `lo-mein` | **do not shelve, and probably do not replace** | not shelved | The existing file is the Chinese-American 撈麵 — soft boiled wheat noodles tossed with char siu and oyster sauce. It shares an English name with this board and nothing else. A cha chaan teng's 撈丁 is instant noodles served drained (rank 22) and its 雲吞撈麵 is thin wonton noodles under a separate bowl of soup. **Shelving `lo-mein` here would be the exact mistake this section exists to prevent.** |

That is five *shelve as is*, two *write a new file*, and one refusal. The refusal is the useful
finding: the story listed `lo-mein` among files that "all belong on this board", and reading the
boards says it does not.

---

## Components it would need

Named once so four writers did not each derive them inline. Two are still not files.

- **咖喱汁 Hong Kong curry sauce** — mild, yellow, coconut-thickened, and not an Indian curry. Over
  牛腩, over 魚蛋, over a pork chop, over rice. `curry-beef-brisket` builds it inline, which is the
  duplication a component file ends; it is rank 2 of what is missing for that reason.
- **茄汁 the tomato sauce** — ketchup, tomato, onion, a little sugar and Worcestershire, reduced.
  `pork-chop-in-tomato-sauce` and `baked-pork-chop-rice` each reduce their own and pair to each
  other and to `homemade-ketchup`, so the sauce is written twice and named nowhere. A file for it
  is cheap; nothing is blocked on it, which is why it is not on the ranked list.

The other five landed inside a dish rather than beside it. Recorded so nobody re-derives them:

| Component | Where it ended up |
| --- | --- |
| 茶膽 the milk tea base | the first half of `hong-kong-milk-tea`. `yuenyeung` consumes the finished tea by reference rather than re-brewing it — the one file-referenced-many-times case on this board, and it works |
| 沙嗲牛肉 satay beef | inside `satay-beef-noodles`. The satay sauce itself is bought, and it now has an aisle |
| 瑞士汁 sweet soy master sauce | inside `swiss-wings`, which carries 瑞士汁 in its own `aka`, so a searcher looking for the sauce finds the wings |
| the ham broth under the macaroni | a note on `ham-macaroni-soup`, which pairs to `chicken-broth` — the five-minute derivation it always should have been |
| evaporated milk, condensed milk, luncheon meat, custard powder, golden syrup | bought, not made, and every one now resolves to a supermarket aisle. That was the shelf's whole sourcing argument; it is checked ingredient by ingredient in `docs/active/work/T-007-05/review.md` |

`bechamel` already exists and is the 白汁 under a baked seafood plate; that is a pairing, not a new
component.

---

## What a table cannot hold

- **The set itself.** 常餐 is not a dish, it is a rule: a main, an egg, bread and a drink, chosen
  off four short lists, and which lists you get depends on what time it is. Four tables and a
  clock. The right shape is the individual dishes written properly and the *set* recorded here and
  in `docs/knowledge/counters.md`, which is where it already is.
- **The pull.** 撞茶 is a hand skill measured in how the tea sounds hitting the bag, and the count
  differs by shop and by the day's leaf. A number in a table reads as *the* number. The honest
  form is a range with its source, plus what the cook is looking for.
- **The ordering slang.** 走冰, 烘底, 加底, 靚仔, 茶走 — a customer says these; a board does not print
  them. They belong in `aka` and in the counter reference, and they cannot be recipes.
- **例湯, the soup of the day.** Literally whatever the kitchen boiled that morning, and it changes
  daily. It is the third option in the 快餐's soup choice and there is nothing to draw.
- **The drinks board as it is printed.** Every base is sold hot or cold at different prices, and one
  Brooklyn board runs thirty-one drink rows off maybe nine actual preparations. That is a
  permutation table, not thirty-one recipes. Write the preparations; the hot/cold split is a line
  in each file.
- **The deep-fryer at counter scale.** 西多士, 炸雞髀 and 薯條 all come out of a standing fryer held
  at temperature all afternoon. A domestic pan of oil is a different piece of equipment with a
  different recovery time, and the file that pretends otherwise gets a soggy 西多士. Say which one
  is being written.
- **菠蘿包 and 蛋撻 as this counter's own.** Both are baked at a bakery and *sold* here. The recipes
  belong to the Bakery and the collection already shelves them at two counters; adding a third
  counter is a metadata line, not a recipe.
- **The bing sutt ice desserts.** 紅豆冰 is writable. The rest of that case — 雪糕梳打, 菠蘿冰, 黑牛 —
  is scooping bought ice cream into bought soda, which is an assembly instruction and not a table.

---

## Sources

Boards were read end to end rather than skimmed; guides were used only for vocabulary and are said
to be guides where they are.

- **The set-meal grid, its hours, and the ordering slang** — [zh-yue.wikipedia.org, 茶餐廳](https://zh-yue.wikipedia.org/wiki/%E8%8C%B6%E9%A4%90%E5%BB%B3),
  which is the only source found that lays out 早餐 / 午餐 / 快餐 / 常餐 / 下午茶餐 / 營養餐 with what
  is in each and which service it belongs to, and which supplied 走冰, 飛沙走奶, 茶走, 加底, 扣底,
  炒底, 烘底, 戴帽, 走青, 靚仔, 靚女 and 行街. The red/white/Chinese soup choice inside 快餐 comes
  from here.
- **The afternoon-tea window and the surcharges** — [zh.wikipedia.org, 下午茶](https://zh.wikipedia.org/zh-hk/%E4%B8%8B%E5%8D%88%E8%8C%B6)
  for 2:30–5:30pm as the general Hong Kong hours, and [en.wikipedia.org, Cha chaan teng](https://en.wikipedia.org/wiki/Cha_chaan_teng)
  for the ~HK$2–3 cold-drink surcharge and ~HK$5 toasting surcharge, which are the clearest
  evidence that the hot drink is the baseline the set price already covers.
- **The chains' current tea sets** — [花小錢去旅行, 平價下午茶餐牌](https://roasterpig.blogspot.com/2023/06/fairwood-tea-set-specials.html),
  which established the 2pm–5pm window as printed by 大家樂, 大快活 and 美心MX, and gave three real
  set compositions (西多士 + 湯粉 + 飲品; 粉麵 + 燒賣 + 蘿蔔糕 + 熱飲; 細粉麵 + 烤麵包 + 熱飲).
- **A Hong Kong board, in Chinese, section by section** — [OpenRice, 極上冰室 (尖沙咀) takeaway menu](https://www.openrice.com/zh/hongkong/menu/844527/takeaway),
  which gave the printed section order 早餐 · 三文治及多士 · 港式風情 · 常餐 · 下午茶-茶點 · 湯飯 ·
  粉麵飯 · 小炒 · 煲仔 · 咖喱 · 西式 · 小食 · 飲品, and which is the shop that settled the 冰室
  question: it trades under the 冰室 name and sells full rice plates and claypots.
- **A diaspora board with an explicit set grid** — [The Peak Hong Kong Cafe, Glebe, Sydney](https://thepeakhkcafe.com.au/menu.html),
  whose set block is printed as "茶餐 Set Menu (Each includes Milk Tea or Coffee)" with Sets A to E.
  It also gave the English section names this page's headings are built from and the *Pineapple Bun,
  Cold Butter* / *Ham & Macaroni Soup* / *Satay Beef Fried Instant Noodles* wordings.
- **A board printed in English only** — [Kowloon Cafe, Brooklyn (Yelp menu)](https://www.yelp.com/menu/kowloon-cafe-brooklyn),
  which is the best evidence of what a reader will search for: *Borsch Soup*, *Butter & Condensed
  Milk with Toast*, *Kowloon French Toast* priced above the plain one, *Spam & Egg Sandwich*,
  *Corn Beef & Egg Sandwich*, *Satay Beef Sandwich*, *Coffee & Tea*, *Holick*, *Baked Pork Chop
  Over Rice / Spaghetti*, *Combo Chops*. It also carries the thirty-one-row drinks list quoted in
  *what a table cannot hold*.
- **Dish-by-dish vocabulary and the borscht finding** — [Yow Hong Chieh, *Your Definitive Guide to
  Hong Kong's Cha Chaan Teng Food*](https://medium.com/@sixtybolts/your-definitive-guide-to-hong-kongs-cha-chaan-teng-food-fad7d454ef21),
  which describes 羅宋湯 as an **orange** soup of oxtail, cabbage, tomato, potato, onion and celery
  — no beetroot in any description found anywhere — and which supplied 撈丁 and the pineapple-bun
  fillings.
- **The tea leaves and their grades** — [ACTHK 香港咖啡紅茶協會, 奶茶知識・茶葉簡介](https://www.coffee-tea.hk/tealeaves),
  the trade body, which is where BOP = 粗茶 (aroma), BOPF = 中粗茶 (colour and body) and DUST = 幼茶
  (flavour) comes from, and which states no ratio.
- **The blend counts and the milk** — [Brooklyn Soda Works, *Hong Kong silk-stocking milk tea*](https://www.brooklynsodaworks.com/blog/2014/10/3/hong-kong-silk-stocking-milk-tea-part-1),
  which reports Lan Fong Yuen straining **8** times against another account's **3** for the same
  shop, a "secret blend of six", 黑白淡奶 as the denser default, and Lan Fong Yuen using a creamer
  rather than evaporated milk. It is also candid that it could not get the recipes, which is the
  most useful thing on the page.
- **The brew numbers, single-sourced** — [自由時報 食譜自由配, 港式茶飲沖泡秘訣](https://food.ltn.com.tw/article/10846),
  the only source found stating **90–96 °C** and **1 g leaf : 30 g water**, the 3-to-4-times pull,
  the term 茶膽 for the finished tea before milk, and the sequence 一沖、二焗、三撞、四回溫.
- **That there is no standard** — [香港非物質文化遺產資料庫, 港式奶茶製作技藝](https://www.hkichdb.gov.hk/zht/item.html?aebd99be-73ff-4a8d-a327-41296eafbc12=)
  and [公民・好學, 港式奶茶製作技藝](https://ls.chiculture.org.hk/tc/explore/0042), for the 2017
  listing, the five steps 調配茶葉 → 煲茶 → 撞茶 → 焗茶 → 撞奶, and the sentence this whole shelf
  should be written under: 並無統一標準.

**The three cautions this page carried for T-007-03 and T-007-04 are spent, and all three held.**
The romanisations were re-checked file by file against the source pages rather than copied from
`docs/knowledge/counters.md`, which says on its own page not to trust them blind. The tea prints
ranges with the source named and averages nothing. And no rank was filled with something plausible:
where a dish could not be established from more than one board it was left on the missing list,
which is part of why five are still there.
