# Japanese Home Cooking — what is missing

**0 recipes. The shelf was opened by T-003-01 and nothing is on it yet.** The site is not short of
Japanese food — **31 files** mention Japan and 28 carry a `japanese` tag — but almost every one of
them arrived through the **Ramen Shop**, and a ramen shop is a restaurant. Four ramens, three
tares, two broths, an aroma oil, a marinated egg and a bamboo pickle are the parts of a bowl that
exists to be sold. What is absent is the food a household actually eats on a Tuesday.

Missing entirely: nikujaga, shōgayaki, oyakodon, gyūdon, katsudon, omurice, tamagoyaki, kinpira,
hijiki, ohitashi, sunomono, buri daikon, saba shioyaki, takikomi gohan, chikuzenni, korokke,
hambāgu, nimono of any kind. **And there is no plain rice recipe anywhere on the site** — not
Japanese rice, not any rice; every file in `recipes/rice-beans-and-grains/` is seasoned. That is
the first hole on this shelf and the one everything else sits on.

What holds this list together is not a cuisine, it is a **system**. 一汁三菜 — rice, a soup and
three dishes — is a rule for composing a dinner, and 作り置き is the Sunday hour that makes it
possible on a Thursday. Most of the parts are small on purpose. **A small recipe is not a lesser
recipe:** a kinpira is four ingredients and three operations, and that is the correct size for it.

---

## What is already here

This heading is not `## What it has` yet, and that is deliberate: no recipe names this counter, so
`scripts/menu-sections.mjs` would report every slug below as *listed but not shelved here*. These
are shelved at the Ramen Shop and the Bakery. **T-003-06 renames this block to `## What it has`**
once the `>> counters:` lines are written; the `**Title.** slug · slug` line shape is already
correct, so that is the whole of the edit.

### The test used to sort them

Not *is it Japanese* — all 31 are. Not *is it hard* — `gyoza` is easy and is still a thing you buy.
The test is: **does a home kitchen make this as part of an ordinary dinner, or as an event, or as
a component of something a restaurant sells?** That splits three ways, and the third bucket is one
the criterion did not ask for but T-003-06 needs.

**Shelve this — the foundation, and it needs shelving rather than rewriting.**
dashi · miso-soup

Those two are upstream of nearly everything on this shelf. `dashi` is referenced by
`pairs-with:` and never re-taught — a simmered dish whose table spends three rows making dashi has
spent its rows badly. Both keep their Ramen Shop placement; they gain a second board. **T-003-04
was told explicitly not to rewrite them, and T-003-06 shelves them into "The soup and the rice".**

**Both boards — genuinely cooked at home and genuinely sold.**
karaage · gyoza · okonomiyaki · chawanmushi · japanese-beef-curry · teriyaki-sauce ·
shichimi-togarashi · goma-dare · japanese-milk-bread · castella

`karaage` is a Saturday and a bentō staple in the same country. `gyoza` is folded at a kitchen
table by the hundred and frozen. `okonomiyaki` is a home griddle dish before it is a shop.
`japanese-beef-curry` is the most-cooked home dinner in Japan by most surveys, and it is on this
site as a restaurant curry. `shichimi-togarashi` and `goma-dare` are pantry, not menu.
`japanese-milk-bread` and `castella` are the Bakery's and stay there — they are listed here only
so T-003-06 does not have to wonder. **Recommendation: shelve all of these on both boards.**

**This is restaurant food, leave it.**
ramen-noodles · shio-ramen · shoyu-ramen · miso-ramen · tonkotsu-ramen · tonkotsu-broth ·
chintan-broth · shio-tare · shoyu-tare · miso-tare · mayu · ajitama · menma · chashu ·
miso-ginger-dressing

The four bowls and everything that assembles into them. Nobody makes a tare, an aroma oil and a
twelve-hour broth for a weeknight; the whole point of a ramen shop is that it does that so you do
not. `chashu` and `ajitama` are borderline — both are made at home *for ramen* — and the honest
answer is that they belong to the bowl, so they stay at the Ramen Shop.

`haemul-pajeon` and `bulgogi-marinade` are also at the Ramen Shop and are **Korean**, which
`docs/gaps/README.md` already records as a misplacement. They are not this shelf's to fix, and
they are named here only so nobody counts them as Japanese.

### Grouped the way this counter's sections will print

**The soup and the rice.** dashi · miso-soup

**Simmered things (煮物).** *(empty — and that is the finding: the heart of the shelf has nothing
on it)*

**Grilled and pan-fried mains.** teriyaki-sauce (the sauce only; there is no dish under it)

**Small sides (小鉢).** *(empty)*

**Made ahead (作り置き).** *(empty)*

**Rice bowls and one-plate suppers.** *(empty)*

**Also here.** karaage · gyoza · okonomiyaki · chawanmushi · japanese-beef-curry · goma-dare ·
shichimi-togarashi

---

## What it is missing

Grouped by the section it lands in, ranked inside each group, so the counts T-003-04 has to hit
are readable off the page: **≥3 in every section, and ≥5 in each of 煮物 and 小鉢.**

### The soup and the rice — 5

1. **Gohan / plain steamed rice** — ご飯, *gohan*, `gohan`. The single most conspicuous absence on
   the site. Rinse until the water runs nearly clear, soak 30 minutes, a 1 : 1.1 rice-to-water
   ratio by volume, and a ten-minute rest off the heat that is part of the cooking and not a pause.
2. **Tamago-toji / vegetable miso variations** — 具だくさん味噌汁, *gudakusan misoshiru*. `miso-soup`
   exists as tofu and wakame; the version a household actually makes has whatever is in the fridge
   in it, and the rule that **miso is never boiled** is the recipe.
3. **Sumashi-jiru** — すまし汁, *sumashijiru*, `sumashi jiru`. The clear soup: dashi, a little
   usukuchi, a little salt, one or two things in it. It is the other half of 汁物 and it is three
   ingredients.
4. **Butajiru / tonjiru** — 豚汁, *tonjiru*, `tonjiru`. Pork and root vegetables in miso; the one
   soup that is a meal, and the winter staple.
5. **Takikomi gohan** — 炊き込みご飯, *takikomi gohan*, `takikomi gohan`. Rice cooked in seasoned
   dashi with mushroom, carrot and abura-age. Also the answer to "what do I do with one piece of
   chicken".

### Simmered things (煮物) — 9, and the heart of the shelf

1. **Nikujaga** — 肉じゃが, *nikujaga*, `nikujaga`. The dish this shelf is missing most. Thin beef,
   potato, onion, and the ratio doing all the work. The lid is a drop lid (落し蓋) and that is a
   real operation, not a flourish.
2. **Buri daikon** — ぶり大根, *buri daikon*, `buri daikon`. Yellowtail collar and daikon. The
   daikon is parboiled in rice water first; skipping that is the usual failure.
3. **Kabocha no nimono** — かぼちゃの煮物, *kabocha no nimono*, `kabocha no nimono`. Four
   ingredients, one pot, twenty minutes, and it keeps three days.
4. **Chikuzenni** — 筑前煮, *chikuzenni*, `chikuzenni` (also 煮しめ, *nishime*). Root vegetables and
   chicken, fried first then simmered dry. The New Year dish that is also a Sunday batch.
5. **Sabu no misoni** — さばの味噌煮, *saba no misoni*, `saba no misoni`. Mackerel simmered in miso
   with ginger. Twenty minutes, and the ginger is there to do a job.
6. **Satoimo no nikkorogashi** — 里芋の煮っころがし, *satoimo no nikkorogashi*,
   `satoimo no nikkorogashi`. Taro simmered until it glazes itself.
7. **Kiriboshi daikon no nimono** — 切干大根の煮物, *kiriboshi daikon*, `kiriboshi daikon`. Dried
   shredded daikon rehydrated and simmered — pantry to plate, and a 作り置き staple.
8. **Nikujaga's pork cousin / niku-dofu** — 肉豆腐, *nikudofu*, `nikudofu`. Beef and tofu in the
   same seasoning, faster, and the answer on a night with no potatoes.
9. **Aburaage to hakusai no nimono** — 白菜と油揚げの煮物, *hakusai to aburaage no nimono*,
   `hakusai aburaage nimono`. Cabbage and fried tofu; nearly free, and it is a whole dish.

### Grilled and pan-fried mains — 6

1. **Shōgayaki** — 生姜焼き, *shōgayaki*, `shogayaki`. Pork loin in ginger, soy, mirin and sake.
   Ten minutes, and the most-cooked pork dish in the country.
2. **Saba shioyaki** — さばの塩焼き, *saba shioyaki*, `saba shioyaki`. Salt, thirty minutes, a
   grill. Three ingredients and it is dinner.
3. **Buri no teriyaki** — ぶりの照り焼き, *buri no teriyaki*, `buri teriyaki`. Teriyaki done the home
   way — the glaze is made in the pan from the same four bottles, not poured from `teriyaki-sauce`.
   The table should say so plainly, since the site's teriyaki is a bottle sauce today.
4. **Hambāgu** — ハンバーグ, *hanbāgu*, `hambagu`. Panko soaked in milk, a steamed finish under a
   lid, and a pan sauce from the fond. Not a hamburger.
5. **Tori no karaage** — already here as `karaage`. Recorded so nobody writes it twice.
6. **Yakitori (home version, no charcoal)** — 焼き鳥, *yakitori*, `yakitori`. Thigh and negi under
   a broiler with a tare reduced from the same four bottles.

### Small sides (小鉢) — 9, tiny and correct at that size

1. **Kinpira gobō** — きんぴらごぼう, *kinpira gobō*, `kinpira gobo`. Burdock and carrot,
   matchsticked, fried in sesame oil, seasoned and cooked dry. Keeps 3 days, 4–5 if the liquid is
   fully cooked off.
2. **Hijiki no nimono** — ひじきの煮物, *hijiki no nimono*, `hijiki nimono`. Dried hijiki, carrot,
   abura-age. Keeps 1–2 days, which is shorter than people assume and is worth stating.
3. **Ohitashi** — おひたし, *ohitashi*, `ohitashi`. Spinach or komatsuna blanched, squeezed, dressed
   in dashi and soy. Two ingredients and a technique.
4. **Sunomono** — 酢の物, *sunomono*, `sunomono`. Cucumber and wakame in sanbaizu. The vinegar
   ratio is the recipe.
5. **Goma-ae** — ごま和え, *goma-ae*, `goma ae`. Green beans or spinach in ground sesame, sugar and
   soy.
6. **Horenso no shiraae** — 白和え, *shiraae*, `shiraae`. Tofu mashed with sesame as a dressing.
   The tofu is drained first and that is the whole difficulty.
7. **Tamagoyaki** — 卵焼き, *tamagoyaki*, `tamagoyaki`. Rolled in a rectangular pan, sweet or dashi
   style — **they are two different recipes** and a file that does not say which is unusable.
8. **Kyūri no asazuke** — 浅漬け, *asazuke*, `asazuke`. The overnight pickle, not the fermented
   one, and the difference matters.
9. **Nasu no agebitashi** — 揚げ浸し, *agebitashi*, `agebitashi`. Fried aubergine steeped in dashi,
   eaten cold. The one that most rewards being made the day before.

### Made ahead (作り置き) — 5, plus the ones above that qualify

1. **Niku miso** — 肉味噌, *nikumiso*, `nikumiso`. Minced pork cooked down with miso; goes on rice,
   on tofu, on noodles. Keeps a week.
2. **Shio kōji chicken / salt-cured chicken** — 塩麹, *shiokōji*, `shio koji`. A make-ahead
   marinade rather than a dish; it is what makes a Thursday chicken worth eating.
3. **Nanbanzuke** — 南蛮漬け, *nanbanzuke*, `nanbanzuke`. Fried fish or chicken steeped in sweet
   vinegar with onion. Better on day two, which is the point.
4. **Mentsuyu** — めんつゆ, *mentsuyu*, `mentsuyu`. Dashi, soy, mirin, concentrated. One bottle that
   seasons half this shelf, and it is a component more than a dish.
5. **Onigiri** — おにぎり, *onigiri*, `onigiri`. Not made ahead exactly, but it is what the rice and
   the fillings become, and no other file on the site covers it.

Also 作り置き by nature and already ranked above: `kinpira gobo`, `hijiki nimono`,
`kiriboshi daikon`, `kabocha no nimono`, `chikuzenni`, `agebitashi`, `asazuke`.

### Rice bowls and one-plate suppers — 7

1. **Oyakodon** — 親子丼, *oyakodon*, `oyakodon`. Chicken and egg over rice. The egg goes in in two
   pours and the second one is barely set; that is the dish.
2. **Gyūdon** — 牛丼, *gyūdon*, `gyudon`. Thin beef and onion. Fifteen minutes.
3. **Katsudon** — カツ丼, *katsudon*, `katsudon`. The cutlet is a component and the simmer is the
   recipe.
4. **Omurice** — オムライス, *omuraisu*, `omurice`. Ketchup rice under an omelette. A children's
   dish that adults keep cooking.
5. **Chāhan** — チャーハン, *chāhan*, `chahan`. Japanese fried rice, seasoned with soy and pepper
   rather than oyster sauce. `egg-fried-rice` is the Chinese one and stays where it is.
6. **Curry rice, the home version** — カレーライス, *karē raisu*, `kare raisu`. `japanese-beef-curry`
   exists and makes its roux inline, which `docs/gaps/README.md` already records as a debt. The
   home version starts from a block of roux and is a different, shorter recipe.
7. **Ochazuke** — お茶漬け, *ochazuke*, `ochazuke`. Tea or dashi over cold rice. Two minutes, and it
   is the most honest weeknight recipe in the canon.

---

## The system, and why the small recipes matter

**一汁三菜** is rice + 汁物 (a soup) + 主菜 (the main, the body-building dish) + 副菜 and 副々菜
(two small dishes that round the meal out — typically a 煮物 and an 和え物 or おひたし). It is a
composition rule, not a serving suggestion: it is how a small kitchen produces a complete dinner
without cooking three ambitious things at once, because two of the four are already in the fridge.

**作り置き** is the hour on Sunday that fills that fridge. It is why so many of the recipes above
are four ingredients: they are not simplified versions of bigger dishes, they are the correct size
for a thing you make six of and eat across a week.

**So the slack property from T-003-02 does real work on this shelf.** For a made-ahead side, the
honest declaration is how long it actually keeps and how you know when it has not: kinpira around
**3 days**, or 4–5 if the liquid is fully cooked off; hijiki no nimono **1–2 days**; the general
guide is 2–3 days refrigerated and 2–3 weeks frozen. Those are not decoration — for half this
shelf, that line is the reason the recipe exists.

## The ratios, which are the content

Japanese home cooking runs on proportions a cook knows by heart, and getting them right is the
difference between the dish and an approximation. **State them as real quantities in the table.**

- **Vegetable 煮物** — dashi 10 : soy 1 : mirin 1 : sake 1. The dashi dominates so the vegetable's
  own sweetness survives; pushing the soy up makes it salty and toughens the vegetable.
- **肉じゃが-type simmering** — soy 1 : mirin 1 against a much smaller dashi volume, so it reduces
  to a glaze rather than staying a broth.
- **Sanbaizu (for 酢の物)** — vinegar 3 : soy 1 : mirin or sugar 1, the standard three-part dressing.
- **Mentsuyu** — dashi 4 : soy 1 : mirin 1 as a dipping strength, concentrated further for storage.

Sources for all four are named at the foot of this file. **Where a writer cannot establish a ratio
from a source, write a different dish** — this is exactly where the story's "never fabricate a
number" bites hardest.

---

## Components it would need

- **Plain steamed rice**, ranked first above, because eleven dishes on this list are served on it
  and none of them should teach it.
- **Mentsuyu**, which turns four of the small sides into two operations instead of five.
- **A pantry note**: mirin versus aji-mirin, cooking sake versus drinking sake, usukuchi versus
  koikuchi soy — four substitutions that change a dish and that no individual table has room to
  argue.
- **Awase dashi versus the existing `dashi`.** The file on the shelf is kombu-and-katsuobushi,
  which is right. What is missing is the note that a household often uses granules and that the
  ratio changes when it does.
- **A drop lid (落し蓋).** One piece of equipment, named in half the 煮物 above, and the site has no
  vocabulary for it. Baking paper with a hole in it is the honest home version.
- **Panko**, which `korokke`, `hambāgu` and `katsudon` all wait on and which nothing here makes.

---

## What it could not stock

- **The meal, as opposed to the dishes.** 一汁三菜 is the arrangement of four tables at once. A
  single table can hold the kinpira; it cannot hold the evening. The most a recipe can do is name
  its companions in `pairs-with:`, and that is worth doing deliberately across this whole shelf.
- **The fridge.** Half of 作り置き is *what is already in there* — the thing that makes a Thursday
  dinner ten minutes long is not written in any recipe. The slack line is the nearest a table gets.
- **Rice as most households make it.** The canonical instruction is "use the rice cooker", and a
  table for a rice cooker is one operation, which `check-recipes.mjs` rejects outright. The stove
  version is the one that can be written; the file should say the machine exists and why the table
  is not about it.
- **Grilling fish over a fish grill.** 焼き魚 is cooked in a purpose-built drawer under the burner
  that most kitchens outside Japan do not have. A broiler is the substitution and it is a real
  change to say out loud, not a silent one.
- **Knife work as the recipe.** Katsuramuki, the matchsticking that makes kinpira kinpira, and the
  angle a burdock is shaved at are all technique that a table records as one word. The
  photographs would be the recipe and there are none.
- **Seasonality.** 旬 organises what a household cooks more strongly than any menu here, and a
  table has no place to say "this is a February dish".
- **The bentō.** It is the destination for most of the small sides above and it is an assembly of
  six things in a box, which is not a recipe and is not one table.

---

## Where this came from

- **一汁三菜 as a composition rule** — [和食の旨み](https://www.kobayashi-foods.co.jp/washoku-no-umami/a-soup-and-three-plates),
  [cotogoto](https://www.cotogoto.jp/blog/2017/04/kihon_ichizyuusannsai.html) and
  [マックスバリュ東海](https://www.mv-tokai.co.jp/tsushin/36562/), which agree on the 主菜 / 副菜 /
  副々菜 split and on what each is for.
- **The 煮物 ratios (煮物の黄金比)** — [和食の旨み](https://www.kobayashi-foods.co.jp/washoku-no-umami/boiled-golden-ratio)
  for dashi 10 : 1 : 1 : 1, and [SATETO](https://coop-sateto.jp/special/nimono_ougonhi/) for the
  same ratio stated as 5 : 1 : 1 : 1 at a stronger dilution. **The two disagree**, which is
  precisely why a writer should source the ratio per dish rather than carry one number across the
  shelf.
- **作り置き keeping times** — [macaroni on きんぴら](https://macaro-ni.jp/42466),
  [macaroni on ひじきの煮物](https://macaro-ni.jp/142936), and
  [暮らしニスタ](https://kurashinista.jp/articles/detail/26472) for the 2–3 day / 2–3 week general
  guide.
- **What is already on the shelf, by slug and by counter** — measured from
  `src/generated/recipes.json`, not recalled.
- **The Korean misplacements at the Ramen Shop** — `docs/gaps/README.md`, which recorded them and
  did not fix them.
