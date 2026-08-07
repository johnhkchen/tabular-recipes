# The Soup Pot — a counter that came down

**This is not a work list. It is the record of a shelf that was tried and taken down**, kept so
nobody spends another afternoon deriving it from scratch and reaching the same wall.

The Soup Pot ran from S-003 to **7 August 2026**, when S-007 retired it and put a Hong Kong cha
chaan teng in its place. At its widest it held twenty-four recipes: sixteen 老火湯, six 滾湯 and the
two congees. Sixteen were deleted, eight moved to other shelves, and the research below was kept
because most of it is still true — it was the shelf that was wrong, not the reading.

One caution carried over from the old version and it still holds: **the Cantonese romanisations
below have no tone marks and were compiled from the sources at the bottom rather than checked
against a dictionary.** They were written to save a lookup, not to be trusted blind.

---

## Why it came down

Five reasons, and they compound. The full argument is in
`docs/active/stories/S-007-a-counter-you-can-shop-for.md`.

1. **The ingredients were not for sale.** Twenty-four recipes rested on about eighteen dried goods —
   霸王花, 菜乾, 玉竹, 沙參, 章魚乾, 淮山 — and the shopping list filed most of the ones spot-checked
   into `World foods`, which is the aisle map shrugging. The honest answer is *a Chinese herbalist*,
   and this site had no way to say that. Worse, this page's own rules ruled substitution out: *"If
   the overlord flower cannot be got, the answer is not another flower — it is a different soup."*
   Specialist-only sourcing plus no substitutions means a reader either lived near the right shop or
   the whole shelf was shut to them.

2. **Three hours of clock bought a course, not a dinner.** All sixteen old-fire pots ran 2 hr to
   3 hr 30 against 8 to 12 minutes hands-on, and rule 4 of the pot is that the solids are spent and
   thrown away. The Instant Pot and One Pot shelves spend the same clock and put a meal on the
   table. This one produced a bowl of broth drunk *before* dinner, in a household arrangement most
   readers do not have.

3. **It was not a counter.** `docs/knowledge/counters.md` opens with the definition: *"A counter is
   where you would get this if you were not making it at home."* Nobody sells 老火湯 over a counter.
   There was no window, no board, no menu word to be the way in. Every other shelf here is a
   storefront a person can picture; this one was a domestic practice wearing a shop sign.

4. **The frame was a medicine frame, and that is structural rather than tonal.** The shelf was
   organised around 潤 / 祛濕 / 健脾, which the site then spent paragraphs holding at arm's length
   (*"made when someone in the house has been coughing" is honest, "cures a cough" is not*). The
   disclaiming was careful and it was not the problem. The problem was what the arrangement said:
   the site's one Chinese shelf sold folk remedies while its American shelves sold sandwiches. No
   individual file was at fault. The shelf was.

5. **Twenty-four files, one recipe.** Sixteen shared the same four method rules and the same alias
   *lo fo tong*. The variable between them was which dried thing went into a pot of water with pork
   bones. High file count, narrow reader-usable range.

---

## What happened to the twenty-four

**Sixteen 老火湯 were deleted.** Not re-shelved — deleted, because they failed on the bargain and on
the framing rather than only on sourcing, and moving them would have moved the problem:

```
green-radish-carrot-pork-bone-soup      chinese-yam-goji-black-chicken-soup
winter-melon-jobs-tears-soup            ching-bo-leung-soup
lotus-root-dried-octopus-soup           sha-shen-yu-zhu-soup
watercress-honey-date-soup              hairy-gourd-dried-scallop-soup
peanut-black-eyed-pea-chicken-feet-soup dried-bok-choy-pork-lung-soup
overlord-flower-soup                    lotus-seed-lily-bulb-soup
corn-carrot-pork-bone-soup              old-cucumber-rice-bean-soup
green-papaya-peanut-trotter-soup        apple-pear-pork-bone-soup
```

`corn-carrot-pork-bone-soup` and `green-radish-carrot-pork-bone-soup` look like they should have
survived, because everything in them is supermarket produce. They went anyway. Keeping two files
because their ingredients are easy would have kept the two least interesting members of a genre the
shelf had just decided not to carry.

**Eight stayed**, and none of them lost a line other than the counter they name:

| Slug | Where it lives now |
| --- | --- |
| `tomato-potato-beef-soup` | One Pot |
| `seaweed-egg-drop-soup` | One Pot |
| `mustard-greens-tofu-soup` | One Pot |
| `crucian-carp-tofu-soup` | One Pot |
| `century-egg-amaranth-soup` | One Pot |
| `egg-drop-soup` | Takeout Counter |
| `congee` | Dim Sum Counter, One Pot |
| `congee-instant-pot` | Instant Pot |

The five that had been shelved nowhere else went to One Pot together, under a section of its own —
*Quick soups that go with dinner*. Every one of them fries or boils and finishes in a single vessel
in 15 to 45 minutes, which is that shelf's whole promise, and `congee` was already there.

---

## What would have to be true for this to work

This is the part the old page never said, and it is worth more than the list of eighteen soups it
replaces. Three things would have to change before anybody tries this shelf again. None of them is
about the soups.

**1. An aisle that can name a dried-goods shop.** The shopping list has to be able to answer
*where do I buy 霸王花* with a real place rather than `World foods`. That means an aisle in
`src/data/aisles.json` that stands for a Chinese herbalist or a dried-goods shop, and it means
accepting what such an aisle says about a recipe: that this one needs a trip to a shop the reader
may not have. A shelf can be honest about that. It cannot be silent about it.

**2. A substitution model that works across a tradition, not inside a recipe.** The rule this page
wrote — *the answer is not another flower, it is a different soup* — is true about the cuisine and
fatal for a shelf, because it means one missing item closes the whole file. What is needed is
somewhere to say what a pot becomes when a dried thing is missing: a per-ingredient answer, held
once and read by every recipe that uses it. Nothing in the collection can hold that today, and
writing it per-file is how twenty tables end up disagreeing.

**3. A counter definition that admits a home practice.** *"Where you would get this if you were not
making it at home"* is a storefront test, and 老火湯 has no storefront anywhere in the world. Either
the definition widens to cover a practice as well as a shop — and then it has to say which practices
qualify, and why this one and not the next twenty — or this food does not get a shelf here, and the
recipes belong on a shelf named for the pot rather than for the cuisine.

Until all three are true, a shelf like this one will fail the same way: closed to most readers,
disclaiming itself, and carrying one recipe sixteen times.

---

## Preserved research: what each thing is for

**Everything from here down is kept because it is good and it is still true. None of it is a work
list, and no recipe here is waiting to be written.** It is what a reader with the ingredients in
front of them would want to know, and it is the part that would have been expensive to lose.

The glossary. This is the part a writer cannot derive from a dish name, and it is what makes twenty
tables agree with each other instead of each re-explaining the same handful of dried goods.

Everything below is the tradition's reasoning, stated as the tradition's reasoning.

### The dried goods

| Thing | Characters · romanisation | What it is | What the tradition says it is for | Standardly paired with |
| --- | --- | --- | --- | --- |
| Honey dates | 蜜棗 · *mat zou* | Candied jujube | Sweetens a pot with no sugar in it; the word used is 潤, "moistening" | almost any 潤肺 pot; watercress, dried bok choy, overlord flower |
| Apricot kernels | 南北杏 · *naam bak hang* | Sweet and bitter kernels, used together, in roughly 3 : 1 | Cough and phlegm; the pairing of the two kinds is the point, not a substitution | pork lung, watercress, dried bok choy, overlord flower |
| Dried Chinese yam | 淮山 · *waai saan* | Sliced dried yam | 健脾 — the spleen-and-stomach word; the everyday tonic | goji, black chicken, lotus seed, job's tears |
| Goji berries | 杞子 · *gei zi* | Wolfberry | Liver and eyes; added late because it is already soft | Chinese yam, chicken, red dates |
| Solomon's seal | 玉竹 · *juk zuk* | Rhizome slices | Dry throat and dry cough; the autumn word is 潤燥 | **沙參**, always — the two are sold and used as one pair |
| Adenophora root | 沙參 · *saa sam* | Pale dried root | The other half of that pair; same purpose | 玉竹, lean pork, honey dates |
| Job's tears | 薏米 · *ji mai* | Coix seed; comes raw (生) and toasted (熟) | 祛濕 — the damp word, and the reason this is a summer pot | winter melon, old cucumber, rice beans |
| Fox nut | 芡實 · *hin sat* | Euryale seed | Spleen and kidney; a fixture of the mixed packet | lotus seed, Chinese yam, lily bulb |
| Lotus seed | 蓮子 · *lin zi* | Dried seed, bitter core removed | Calm and sleep — 安神 | lily bulb, red dates, lean pork |
| Dried lily bulb | 百合 · *baak hap* | Petal-shaped scales | Lungs, and the same 安神 | lotus seed, red dates |
| Dried fig | 無花果 · *mou faa gwo* | Whole dried figs | Sweetens like the honey date but drier; 潤腸 | green radish, watercress |
| Aged tangerine peel | 陳皮 · *can pei* | Dried peel, aged; the older the dearer | Cuts richness and fishiness, and 理氣; a pinch, not a handful | red bean, fish, duck, any fatty pot |
| Red dates | 紅棗 · *hung zou* | Jujube | Blood and warmth; **pitted** by many households because the stone is held to make a pot 燥 | Chinese yam, black chicken, lotus seed |
| Dried scallop | 瑤柱 · *jiu cyu* | Conpoy | Pure savour; three or four carry a whole light pot | hairy gourd, winter melon, lean pork |
| Dried octopus | 章魚乾 · *zoeng jyu gon* | Small whole dried octopus | The deepest savour on this list, and the reason a lotus root pot tastes of more than lotus root | lotus root, peanut, black-eyed pea, pork bones |
| Overlord flower | 霸王花 · *baa wong faa* | Dried night-blooming cactus flower | Phlegm, and cooling | apricot kernels, pork bones, honey dates |
| Dried bok choy | 菜乾 · *coi gon* | Sun-dried whole cabbage | Autumn dryness, 清熱潤燥 | honey dates, apricot kernels, pork lung |
| Black-eyed peas and peanuts | 眉豆 · *mei dau* / 花生 · *faa sang* | Both go in dry | 祛濕健脾 — the spring-damp pot | chicken feet, pork shin, lotus root |
| Five-finger fig root | 五指毛桃 · *ng zi mou tou* | Roots that smell of coconut | Damp, and the southern summer | 土茯苓, pork bones |

### The bodies

The meat is chosen for what it gives the water, not for what is eaten. **Pork shin (豬展, *zyu zin*)
and pork neck bone (豬骨) are the defaults** — enough collagen to give body, little enough fat to
skim. Pork ribs (排骨) for a sweeter, lighter pot. A whole chicken or **black chicken (烏雞)** for
the tonic pots. **Chicken feet (雞腳)** for body without meat. **Pork lung (豬肺)** for the two or
three pots built on it, and it is the one ingredient whose preparation is genuinely long — it is
washed under running water until it is white, which is most of an hour.

**Lean pork (瘦肉)** is the light body for a pot meant to taste of the dried goods rather than of
meat. Dried **duck gizzard (陳腎)** appears in the everyday radish pot as a savoury note.

### The season

The tradition organises the year, and it is the reason the same household makes different soups in
March and October:

- **Spring** — 健脾袪濕: the damp season, and the peanut-and-black-eyed-pea pots.
- **Summer** — 消暑清熱: melons, job's tears, old cucumber, the mixed cooling packet.
- **Autumn** — 清潤肺燥: the dry season, and the whole family of 潤 pots — watercress, dried bok
  choy, apricot kernels, pear.
- **Winter** — 補氣益腎: the warming tonics — black chicken, red dates, Chinese yam, mutton.

### The four rules of the pot, which are method and not flavour text

1. **The meat is blanched first (汆水, *cyun seoi*).** Cold water, bring to a boil, pour the whole
   lot away, rinse the bones, start again with fresh water. Everything about whether the finished
   soup is clear or grey is decided in this step, and it is the one a translated recipe most often
   drops.
2. **The water goes in once, cold, and is not topped up.** The pot is filled for the number of
   bowls plus what will boil away in three hours. Adding water partway is the classic failure and
   the tradition treats it as ruining the pot, not as a correction.
3. **It is not stirred, and the lid stays mostly on.** A bare quiver, not a bubble. Stirring clouds
   the broth and breaks the solids into it.
4. **The broth is the dish.** The solids — 湯渣, *tong zaa* — are spent by the end. They are eaten
   on the side with soy sauce, or not at all. A recipe that plates the pork as the main course has
   misunderstood what was cooked.

Salt goes in at the end, never at the start. And the three words are not interchangeable:
**老火湯** is this — hours, uncovered heat under a lid, the broth extracted. **滾湯** boils the
water first and cooks quick things in it for fifteen to forty-five minutes. **燉湯** seals the
ingredients in a lidded jar and steams the jar inside a larger pot for hours; nothing evaporates
and the result is the clearest of the three.

---

## What a table could not hold

Kept for the same reason: these are findings about the limits of the format, and they did not stop
being findings when the shelf came down.

- **The reason it is made today.** A household's pot is chosen from the weather, who is in the
  house and what somebody is recovering from. That decision is upstream of every recipe here and no
  table has a cell for it. The nearest a file gets is naming the season and the occasion, which is
  why every entry above does.
- **The packet.** Half these soups are bought as a pre-mixed bag from a dried-goods shop with a
  handwritten label, and the contents vary by shop and by season. A table can list what is usually
  in it; it cannot hold "whatever the shop gave you", which is what a real cook is working from.
- **Substitution across a whole tradition.** If the overlord flower cannot be got, the answer is not
  another flower — it is a different soup. That is a rule about the whole shelf and it belongs
  somewhere central, not in each file's notes.
- **The pot itself.** A clay 煲 holds heat differently from a stainless stockpot and the tradition
  cares. A `>> cookware:` line can name it; a table cannot argue it.
- **A number for pork lung.** "Wash under running water, squeezing, until it runs clear and the
  lung is white" is an hour for one person and twenty minutes for another. It is a judgement and
  writing "45 min" would be inventing one.
- **The medical claim, deliberately.** The tradition's reasoning is in the file; a claim about what
  a soup does to a body is not, and the difference is not a hedge — it is the difference between
  recording a cuisine and asserting something the site cannot stand behind.
- **What to do with the 湯渣.** The spent solids are the household's business — soy sauce on a side
  plate, the dog, the bin — and every family answers differently. Rule 4 says the broth is the dish;
  the rest is not a recipe.

---

## Where this came from

- **The genre, its definition and the three-hour claim** — [hk01, 湯水營養：老火湯・滾湯・燉湯](https://www.hk01.com/%E6%95%99%E7%85%AE/549421/),
  which separates the three kinds by method, and [鴻福堂, 廣東湯文化及歷史](https://jikaon.hungfooktong.com/%E5%BB%A3%E6%9D%B1%E6%B9%AF%E6%96%87%E5%8C%96%E5%8F%8A%E6%AD%B7%E5%8F%B2)
  and [廣東人的老火靚湯](https://jikaon.hungfooktong.com/%E5%BB%A3%E6%9D%B1%E4%BA%BA%E7%9A%84%E8%80%81%E7%81%AB%E9%9D%9A%E6%B9%AF)
  for the seasonal frame — spring 健脾養肝袪濕, summer 消暑清熱, autumn 清潤肺燥, winter 益肺補腎.
- **The dried goods, one by one** — [China Sichuan Food, *An Introduction to Chinese Herbal Soup
  Ingredients*](https://www.chinasichuanfood.com/chinese-herbal-soup-ingredients/), which is the
  best English-language source found for 淮山, 玉竹, 蜜棗, 杞子, 紅棗, 百合, 無花果, 芡實, 薏米,
  瑤柱 and 霸王花, and [The Woks of Life, *Ching Po Leung*](https://thewoksoflife.com/ching-po-leung-soup/)
  for the mixed packet and what is in it.
- **Named soups with their pairings and their stated purpose** — [Kanlaw, 廣東老火靚湯譜 七十款](http://kanlaw.blogspot.com/2013/02/blog-post.html),
  a seventy-soup list where each entry names its pairing and what it is understood to be for. Ranks
  15, 17 and 18 above come from it directly.
- **The everyday radish pot** — [FWD, 青紅蘿蔔豬骨湯](https://www.fwd.com.hk/zh/blog/lifestyle/green-radish-carrot-and-corn-pork-soup-recipe/)
  and [UrbanLife](https://urbanlifehk.com/article/13963/), which agree on the ingredient list and on
  the green-radish/carrot pairing being the reason it suits any season.
- **The 滾湯 half** — [hk01, 滾湯食譜 12 款](https://www.hk01.com/%E6%95%99%E7%85%AE/509945/), which
  gives the 15–45 minute range, and [Cosmopolitan HK, 8 款家常滾湯](https://www.cosmopolitan.com.hk/cosmobody/boiling-soup).
- **The home version of the old-fire pot in English** — [Made With Lau, *My Dad's Super Simple Old
  Fire Soup*](https://newsletter.madewithlau.com/p/my-dads-super-simple-old-fire-soup).
