# T-007-03 — Review

Eight new `.cook` files open the cha chaan teng's drinks counter and its bun case. Nothing that
already existed was edited. `npm run check`, `npm run recipes`, `vitest` and `astro build` are
all green over the whole collection.

**The one thing worth a human's attention is §4** — the milk tea's numbers and the single place
where the wording of a criterion and the wording of the file do not match word for word.

---

## 1. What changed

**Created** — eight files, nothing else:

```
recipes/drinks/hong-kong-milk-tea.cook                          5 rows x 5 cols   4 ops
recipes/drinks/yuenyeung.cook                                   5 rows x 4 cols   3 ops
recipes/drinks/iced-lemon-tea.cook                              5 rows x 4 cols   4 ops
recipes/drinks/lemon-coke-with-ginger.cook                      3 rows x 4 cols   3 ops
recipes/drinks/red-bean-ice.cook                                6 rows x 5 cols   4 ops
recipes/drinks/horlicks.cook                                    5 rows x 4 cols   3 ops
recipes/flatbreads-and-pancakes/hong-kong-french-toast.cook     7 rows x 5 cols   5 ops
recipes/flatbreads-and-pancakes/thick-toast.cook                3 rows x 4 cols   3 ops
```

**Modified** — none. **Deleted** — none.

`recipes/drinks/` goes from three files to nine, and all three of the old ones are poured cold.
`docs/gaps/README.md`'s fifth gap — *a drink that is brewed* — is closed by
`hong-kong-milk-tea`, and `iced-lemon-tea` and `yuenyeung` brew as well.

Five commits, all through `lisa commit-ticket` with exact `--include` paths: `e2941f6`,
`209641d`, `ca44889`, `17190f6`, `ba4e886`.

## 2. Acceptance criteria, against evidence

| Criterion | Evidence |
| --- | --- |
| At least eight new `.cook` files, all passing the checker | eight, all `ok` — the block above is the checker's own output |
| `hong-kong-milk-tea` exists, brewed, pull as a named operation with a timer, evaporated milk, figures traceable | §4 below, in full |
| No invented number; ranges where sources disagree | §4. The file prints `2 to 3 min` and `3 to 6 pulls` as ranges |
| 鴛鴦 consumes the milk tea via `&` | `yuenyeung` has one `Hong Kong milk tea` row and `@&(~1)coffee{}` merging into it; it contains no tea leaf, no temperature and no steep for the tea |
| 西多士 carries `french toast` in `aka` and says in prose what it is not | `aka` opens with `french toast`; the full-width row is *"Not the diner's french toast — the peanut butter goes inside and it is deep-fried rather than griddled."* |
| `>> counters: Cha Chaan Teng` on every file | `grep -L` over the eight returns nothing |
| `aka` with characters + Cantonese romanisation + plain-keyboard English | all eight, §3 |
| every timer named | `grep -n '~{'` over the eight returns nothing; 13 timers, all named |
| 5–16 rows and 3–6 ops, or say why not | five files inside; three under, argued in `design.md` and §5 |
| no specialist-shop ingredient | §6 — 28 ingredient names, all supermarket |
| `slack` only where there is a real failure | 5 of 8 declare it; 3 leave it off |
| `npm run check` passes for the whole collection | `all 664 file(s) draw a table.`, nothing over cap |
| only `recipes/**/*.cook` and the work dir modified | `git status --porcelain \| grep recipes/` → nothing |

## 3. The `aka` lines

Each carries the characters, a Cantonese romanisation and the spelling an English speaker types.
The romanisations in `docs/knowledge/counters.md` were compiled to save a lookup and its own
page says not to trust them blind; each was checked against the source pages read for this
ticket rather than copied.

| File | Characters | Romanisation | Plain keyboard |
| --- | --- | --- | --- |
| `hong-kong-milk-tea` | 港式奶茶 · 奶茶 · 絲襪奶茶 | gong sik naai cha · naai cha · lai cha · si mat naai cha | hong kong milk tea · milk tea · HK milk tea |
| `yuenyeung` | 鴛鴦 | yuen yeung · yuanyang · yin yong | coffee and tea · Coffee & Tea · yuenyeung |
| `iced-lemon-tea` | 凍檸茶 · 檸茶 | dung ling cha · dong ning cha · ling cha | iced lemon tea · lemon tea · LT |
| `lemon-coke-with-ginger` | 檸樂煲薑 · 薑檸樂 | ling lok bou geung · ning lok bou geung · geung ling lok | lemon coke with ginger · ginger coke |
| `red-bean-ice` | 紅豆冰 | hung dau bing · hong dau bing | red bean ice · iced red bean |
| `horlicks` | 好立克 · 阿華田 | hou laap hak · a wa tin | horlicks · **holick** · ovaltine · malted milk |
| `hong-kong-french-toast` | 西多士 · 西多 | sai do si · sai dor si | **french toast** · hong kong french toast |
| `thick-toast` | 厚多士 · 奶油多 · 奶醬多 | hau do si · naai yau do | thick toast · condensed milk toast |

`holick` is the Brooklyn board's misspelling and is deliberate: it is what a searcher will have
seen printed.

## 4. The milk tea — every number and where it came from

**This is the part to review.** The ticket's binding constraint is *never fabricate a number*,
and no test can check it.

| In the file | Value | Source |
| --- | --- | --- |
| the blend | 65 % fine cut, 35 % coarse | [自由時報 食譜自由配](https://food.ltn.com.tw/article/10846) — 幼茶65%、粗茶25%、中茶10% |
| leaf : water | 20 g : 600 mL (1 : 30) | same — 1g配好的茶粉：30g水的比例 |
| water temperature | 90–96 °C | same — 沖茶最佳溫度在90～96℃之間 |
| on the heat | `~simmer{2-3%min}` | same — 小火煮約2～3分鐘 |
| the pull | 3 to 6 | 自由時報 重覆3～4次 · [teavoya](https://teavoya.com.tw) 至少要做 4-6 次 — printed as the union |
| covered steep | `~steep{6%min}` | [hk01 / 謝忠德師傅](https://www.hk01.com/教煮/128519/) — 焗6分鐘 |
| tea : evaporated milk | 7 : 3 | 自由時報, hk01 and teavoya all say 7:3 — the one settled number |
| the prose row | "there is no standard" | HK intangible cultural heritage listing, 2017, 港式奶茶製作技藝: 並無統一標準 |

**Two judgement calls, both stated in the file rather than hidden:**

**(a) The three trade grades are merged into two, because a supermarket sells two.** 自由時報's
ratio is by trade grade — DUST 幼茶 65 %, BOP 粗茶 25 %, BOPF 中粗茶 10 % — and buying by trade
grade is a specialist purchase, which is the exact failure S-007 exists to correct. The file
buys **six Ceylon tea bags cut open (65 %; what is inside a tea bag is dust and fannings) and
7 g of loose-leaf Ceylon (35 %)**, the 35 % being 自由時報's 25 % + 10 % added together. That is
arithmetic on one source's numbers, not a fourth opinion, and the ingredient notes say which
percentage each row is.

**(b) The pull's timer measures the steep, not the pull — because no source times the pull.**
The criterion reads *"has the pull as a named operation with a timer"*. What is in the file:

```
>> step.4: pour it back through the bag, 3 to 6 pulls, steep 6 min
```

It is an operation, it is its own column in the table, it names the pull and its count, and it
carries a named timer, `~steep{6%min}`. **It does not put a duration on 撞茶 itself, because
every source read gives 撞茶 a count and none gives it a clock** — 3–4, 4–6, and 8-versus-3 at
the same shop in the same write-up. The work list's own *what a table cannot hold* entry says a
number in a table reads as *the* number, and inventing one would have been the first fabricated
figure in the file.

A reviewer reading the criterion strictly may want the timer to be the pull's own. It cannot
honestly be. **Flagged here rather than buried**, with the alternative that was rejected:
`~pull{4%times}` parses but `minutesOf` returns null for the unit, and
`collection.test.ts`'s "reads a duration off every timer it found" fails on it.

**A correction for `docs/gaps/cha-chaan-teng.md`, which this ticket does not own:** that page
says *"No source states a ratio"* about the blend. 自由時報 — a source the page already cites —
states one, at 幼茶65%、粗茶25%、中茶10%. T-007-05 owns the page.

## 5. Where the sizes fall short

Three files are under the README's 5-row aim. All three clear the checker's floor of 3 rows and
3 columns; none is under on operations.

| File | Rows | Why |
| --- | --: | --- |
| `lemon-coke-with-ginger` | 3 | Cola, ginger, lemon. Four sources read, all three ingredients |
| `thick-toast` | 3 | Bread, butter, condensed milk — the ticket itself says "three ingredients and one operation, which is fine" |
| `red-bean-ice` / `horlicks` / others | 5–7 | inside the aim |

`horlicks` came out at 5 rather than the 4 the design expected, because the paste water and the
rest of the water are separate rows — the same device `red-bean-paste` uses for its two waters.

**The general finding for T-007-05:** the 5–16 aim was measured off a shelf of stews and bakes.
A drinks counter's drinks are three-ingredient drinks, and this is the first counter where the
drinks block is the point rather than the garnish.

## 6. Sourcing — S-007's actual claim

Twenty-eight ingredient names across the eight files:

> boiling water · boiling water for the paste · Ceylon tea bags · cola · creamy peanut butter ·
> crushed ice · dried adzuki beans · eggs · evaporated milk · fresh ginger · fresh water ·
> golden syrup · granulated sugar · ground dark roast coffee · Hong Kong milk tea · ice ·
> lemon · loose-leaf Ceylon black tea · malted milk powder · neutral oil · rock sugar ·
> salted butter · sugar syrup · sweetened condensed milk · thick-cut white bread · water ·
> water for the first boil · white sandwich bread

**Every one is a supermarket or ordinary-Asian-grocery item.** Nothing here comes from a
herbalist, which is the comparison the story is making. Two are worth naming for the shelver:
dried adzuki beans and golden syrup are a supermarket item in the UK, HK and Australia and an
Asian-grocery or baking-aisle item in the US.

`evaporated milk` and `sweetened condensed milk` are spelled to match the patterns already in
`aisles.json`, and they are two different rows in two different files. `Hong Kong milk tea` is a
component row, the same shape as `onion-tomato masala` in the eight curries.

## 7. Test coverage, and the gap in it

**What is covered.** `check-recipes.mjs` per file (table shape, tiling, counter name, slack
grammar, five length caps); `parse-recipes.mjs` across the collection (unique slugs, known
counters, no orphan, `pairs-with` resolves); `collection.test.ts` (mutual pairings, one plain
way per dish, every timer readable as minutes); `icons.test.ts` (every operation's opening verb
draws a real icon); `astro build` (688 pages).

```
npm run check      all 664 file(s) draw a table.       (nothing over cap)
npm run recipes    664 recipes, 27 categories, 0 inferred counters, pairings 770
npx vitest run     10 files, 856 tests, all passing
npx astro build    688 page(s) built
```

**The gap, and it is not closable by a test.** Nothing verifies that a number in a recipe came
from anywhere. §4 is that verification, done by hand, and it is the single thing a human
reviewer should spend their time on.

**A second gap, smaller:** nothing checks that a Cantonese romanisation is right. §3 lists all
eight so they can be read at once by someone who would know.

## 8. Open concerns

**菠蘿油 is not written, and it is the one thing the ticket asked for that is missing.** It is a
warm `pineapple-bun` and a cold slab of butter — two ingredients — and `check-recipes.mjs` fails
under three rows. Measured, not assumed:

```
FAIL   …/pineapple-bun-with-butter.cook
       - only 2 ingredient row(s) — too thin to be a table
```

The three ways to pad it to three rows are condensed milk, a fried egg and cheese, or a pork
chop; each is a different printed item and none is 菠蘿油. `horlicks` was written in its place,
so the count is eight. **The recommended handoff to T-007-05** — a section note on the borrowed
`pineapple-bun`, under the 120-character cap `parse-recipes.mjs` enforces:

```
Split warm around a cold slab of butter it is 菠蘿油, bo lo yau — the same bun, nothing added.
```

**檸樂煲薑 is in the ticket and not on the ranked work list.** It was written, from four sources.
The work list ranks 24 items and this is not one of them; the ticket names it with a
description. Recorded so the gap between the two documents is closed on purpose rather than by
accident.

**Four verbs are missing from `VERB_ICONS`.** `pull`, `paste`, `smash` and `sweeten` are real
cooking verbs that fall through to a plain bowl, and `icons.test.ts` fails the build on them.
Thirteen cells were reworded rather than editing `src/lib/icons.ts`, which this ticket does not
own. The rewording improved the cells — voice.md asks for a verb and its numbers — but the
collection should probably know the word `pull`, and 撞茶 is the reason.

**Two toasts are filed in `flatbreads-and-pancakes/`**, beside `french-toast`, which is where a
reader comparing the two will look. `hong-kong-french-toast` is deep-fried and
`fried-and-crispy/` is the more literal shelf; `thick-toast` is neither a flatbread nor a
pancake. `docs/gaps/README.md` already records category drift as a known open job, and this adds
two files to it rather than fixing it.

**Nothing here needs a human decision to land.** The four items above are findings for T-007-05
and for whoever next owns the icon table.

## 9. For T-007-05, in one place

- **Sections.** *The drinks counter*: `hong-kong-milk-tea`, `yuenyeung`, `iced-lemon-tea`,
  `lemon-coke-with-ginger`, `horlicks`, `red-bean-ice`. *Toast and the bun case*:
  `hong-kong-french-toast`, `thick-toast`, plus the borrowed `pineapple-bun` and
  `egg-custard-tart`.
- **The 菠蘿油 note**, above, on the borrowed `pineapple-bun`.
- **New ingredient names wanting an aisle:** `Ceylon tea bags`, `loose-leaf Ceylon black tea`,
  `cola`, `crushed ice`, `sugar syrup`, `rock sugar`, `golden syrup`, `thick-cut white bread`,
  `ground dark roast coffee`, `Hong Kong milk tea` (a component, like `onion-tomato masala`).
  `evaporated milk`, `sweetened condensed milk`, `malted milk powder`, `white sandwich bread`,
  `salted butter`, `neutral oil` and `dried adzuki beans` already have patterns.
- **`docs/gaps/README.md` gap 5 is closed.** A drink that is brewed now exists, three times over.
- **`docs/gaps/cha-chaan-teng.md` needs two corrections**: "No source states a ratio" is wrong,
  and 檸樂煲薑 belongs on the ranked list.
- **New `aka` collisions to class as honest or wrong:** `french toast` now answers to two
  recipes (`french-toast` and `hong-kong-french-toast`) — deliberate, and each file says what
  the other is. `milk tea`, `lemon tea` and `malted milk` are new and unique.
