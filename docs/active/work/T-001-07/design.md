# T-001-07 — Design

The counter shelves 11 recipes, 3 of them its own. It needs 18 and 12. This is what gets written,
and why it is written that way.

## Decision 1 — how far down the gap list to go

**Chosen: gap items 1 through 13 complete, in order. Eighteen new files.**

The acceptance criteria set a floor (18 shelved, 12 sole) and an ordering rule (work down
`docs/gaps/dim-sum-counter.md`, name what is skipped). The floor alone is reachable with nine
files. The ordering rule is the binding constraint: item 6 is three roast meats, item 8 is two
cakes, item 12 is three fried things. Stopping mid-item leaves an obviously half-done row of the
list, and "the fried basket, all three" is one gap, not three.

Item 5 — char siu — is already written (`recipes/stews-and-braises/char-siu.cook`, naming this
counter). It is recorded as satisfied rather than rewritten.

| Gap | Dish | File |
| --- | --- | --- |
| 1 | Har gow | `recipes/dumplings-and-rolls/har-gow.cook` |
| 2 | Siu mai | `recipes/dumplings-and-rolls/siu-mai.cook` |
| 3 | Char siu bao | `recipes/dumplings-and-rolls/char-siu-bao.cook` |
| 4 | Dan tat | `recipes/custards-and-puddings/egg-custard-tart.cook` |
| 5 | Char siu | *exists* |
| 6 | Siu yuk | `recipes/stews-and-braises/siu-yuk.cook` |
| 6 | Soy sauce chicken | `recipes/stews-and-braises/soy-sauce-chicken.cook` |
| 6 | White cut chicken | `recipes/stews-and-braises/white-cut-chicken.cook` |
| 6 | *(its point)* | `recipes/sauces-and-gravies/ginger-scallion-oil.cook` |
| 7 | Cheung fun | `recipes/dumplings-and-rolls/cheung-fun.cook` |
| 8 | Turnip cake | `recipes/flatbreads-and-pancakes/turnip-cake.cook` |
| 8 | Taro cake | `recipes/flatbreads-and-pancakes/taro-cake.cook` |
| 9 | Lo mai gai | `recipes/rice-beans-and-grains/lo-mai-gai.cook` |
| 10 | Xiao long bao | `recipes/dumplings-and-rolls/xiao-long-bao.cook` |
| 11 | Chicken feet | `recipes/stews-and-braises/chicken-feet.cook` |
| 12 | Wu gok | `recipes/dumplings-and-rolls/wu-gok.cook` |
| 12 | Ham sui gok | `recipes/dumplings-and-rolls/ham-sui-gok.cook` |
| 12 | Sesame balls | `recipes/dumplings-and-rolls/sesame-balls.cook` |
| 13 | Chow fun | `recipes/noodles/beef-chow-fun.cook` |

Seventeen of the eighteen name Dim Sum Counter and nothing else. The exception is the egg custard
tart, below. Result: **29 shelved, 20 sole.**

*Rejected: the minimum nine.* It clears the bar and leaves the counter with no fried basket, no
roast-meat window and no noodle — the three things the gap doc says are conspicuously empty.

*Rejected: continuing to item 21.* Items 14–21 are named with reasons in `progress.md`. The two
that most want writing — gai lan (item 14) and youtiao (item 16) — are argued below.

## Decision 2 — a dumpling as one file, or as three

The gap doc says the honest form of a dumpling is "wrapper as one recipe, filling as another, and
the dumpling as a third that consumes both", and warns that one tree cannot hold a wrapper and
forty pieces.

**Chosen: one file per dumpling, with the dough and the filling as two branches that merge.**

`src/lib/tree.ts` refuses a step that flows into *two later steps*. It does not refuse two steps
flowing into *one*. So:

```
step 1  wheat-starch dough  ─┐
                             ├─→ step 3  roll and pleat  ─→ step 4  steam
step 2  shrimp filling      ─┘
```

is a legal tree and draws as a staircase with two arms. The build's actual refusal is a wrapper
recipe reused by three dumpling recipes, which is a cross-*file* relationship cooklang has no
edge for anyway — `@&(~N)` only reaches inside one file.

*Rejected: `wheat-starch-dough.cook` as its own recipe, with har gow naming it as a plain
ingredient.* It reads well on the shelf and is what the "Components it would need" section
suggests, but it costs a table row that says `wheat starch dough` with no quantity a shopper can
buy, and the dumpling's file then stops teaching the one thing that makes har gow har gow: the
boiling water going into wheat starch. The dough is three lines. It stays in the file.

*Rejected: bought wrappers, as `wonton-soup.cook` does.* Legitimate for wontons — thin square
wonton wrappers are a shelf product. Not legitimate here: the gap doc says wheat-starch skin "is
the reason har gow steams translucent, and the reason it cannot be faked with a wonton wrapper".
Siu mai and xiao long bao are the split case: siu mai genuinely uses bought thin yellow wrappers
in most shops and at home, so it buys them; xiao long bao's skin is rolled thin from plain hot
water dough with a thick middle, and buying it would be the shortcut wearing the name.

## Decision 3 — the master stock, told honestly

The gap doc is explicit: "**A master stock has no final operation** — it is kept, skimmed, topped
up and re-used for years. Written as a one-off poach it is honest and it is a different thing;
say which."

**Chosen: `soy-sauce-chicken.cook` poaches in a first-time *lou sui* and says so in a full-width
footer row** — the step-with-no-ingredients mechanism from `tree.ts`, which is how
`smoked-brisket.cook` states its pit temperature. The footer says the liquid is strained, chilled
and re-used, and that a shop's is decades old. The recipe still ends in one operation, so it
tiles; the difference between this and the window's is stated rather than hidden.

*Rejected: a `master-stock.cook` component file.* It has no final operation, so `buildTree()`
throws on it. The build is right, and this is the gap doc's own example of what a table cannot
hold.

## Decision 4 — where the roast-meat window lives

**Chosen: `stews-and-braises/`, alongside the char siu already there.**

Siu yuk is roasted, soy sauce chicken is poached, white cut chicken is poached, chicken feet are
fried and then braised. Only the last is literally a braise. But `char-siu.cook` — a roast — is
already shelved in this folder, and `docs/active/work/T-001-05/review.md` records the same
folder having "already absorbed a roast and an oven confit for want of anywhere better". Splitting
the window across three folders to be taxonomically precise would put char siu and siu yuk, which
hang side by side in the same glass, in different places.

*Rejected: `smoked-and-grilled/`.* T-001-05 created it for pit cookery. Nothing here goes near
smoke.

*Rejected: a new `roast-meats/` folder.* It would be right, and it would strand `char-siu` —
another ticket's file — in the old place, leaving the window split anyway.

## Decision 5 — where turnip cake and taro cake live

**Chosen: `flatbreads-and-pancakes/`, next to `scallion-pancakes.cook`.**

The two-stage move — steam a loaf, chill it, slice it, pan-fry the slices — is the counter's
signature, and the thing that arrives at the table is a griddled savoury square. That is the same
object `scallion-pancakes` is, and it is the same shelf a cook would look on.

*Rejected: `rice-beans-and-grains/`.* Rice flour binds the loaf, but neither cake is a grain
dish; the bulk is daikon and taro.

*Rejected: a new `steamed-savoury-cakes/` folder.* Two files do not earn a category, and it would
put the eaten form on a shelf named for an intermediate stage.

Both are written as one preparation ending in the fry, with a footer row saying the shop sells it
at both stages — the gap doc's "one preparation, two products".

## Decision 6 — the one file that is not sole

**Chosen: `egg-custard-tart.cook` names Dim Sum Counter *and* Bakery.**

Gap item 4 says dan tat is "Missing at the Bakery too, and for the same reason". `counters.md`
lists Egg Custard Tart in both counters' menu tables, verbatim, twice. One file with two names in
`counters:` is what the ticket asks for; a second file under the same dish is the duplicate
T-001-18 exists to catch. Bakery's gap list is T-001-11's, and it will find this written.

The shell is the existing `sweet-tart-shell.cook` — written after the gap docs were compiled, and
already naming both counters. The tart file makes the custard, fills, bakes, and names the shell
as its ingredient, so no second pastry is invented.

*Rejected: naming Bakery on the sesame balls, wife cake and lotus buns as well.* Those are
trolley and bun-case items whose home board is this one; the shared-counter case is weaker, and
the criteria's 12-sole floor deserves headroom, not a raid on it.

## Decision 7 — what gets skipped, and why it is skipped rather than fudged

- **Gai lan with oyster sauce (item 14).** The canonical plate is *blanched* greens under hot
  oyster sauce and oil. There is no vegetables folder, nothing else in the collection is a plain
  plate of greens, and writing it into `stir-fries/` would be a shortcut wearing the dish's name —
  which the acceptance criteria forbid by name. One file does not justify inventing a folder that
  the collection's other counters all need. Recorded for whoever writes the first greens.
- **Youtiao (item 16).** Alkaline dough, rested overnight, stretched and fried in pairs. It is a
  real gap and a good file; it is also a bread, and it lands after the count is already met.
- **Congee toppings (17), the sweet trolley (18), the sweet steamed pair (19), the combo (20) and
  hot tea (21).** Reasons per item in `progress.md`. Item 20 is on the gap doc's own "could not
  stock" list.

## Decision 8 — house style each file has to meet

Read off `char-siu.cook`, `wonton-soup.cook`, `pad-see-ew.cook` and `nixtamalised-masa.cook`:

1. `>> step.N:` override on **every** step, opening with a verb the icon table knows, carrying
   its temperature and time: `steam 8 min, until the skin goes translucent`.
2. Every timer named, with a name `src/lib/time.ts` classifies — `~steam`, `~soak`, `~chill`,
   `~rest`, `~simmer`, `~fry`, `~stirfry`. No bare `~{20%min}`.
3. Metric in a note beside imperial: `@pork belly{2%lb}(900 g; skin on)`.
4. `aka` carries the counter's own names from `counters.md` §Dim Sum Counter, including the
   Chinese characters *and* a form typed without diacritics.
5. One sentence of why, where a cook would otherwise get it wrong — why the wheat starch needs
   boiling water, why the cheung fun tray must be greased, why the turnip cake has to go cold
   before it is sliced. Never a paragraph.
6. Four to six operations, three or more ingredient rows, one final step.

## What this design does not do

It does not touch `src/data/counters.json`, so all 18 files land in the Dim Sum Counter's
trailing "Also" section until T-001-17 places them. It does not add aisles for wheat starch,
tapioca starch, lotus leaves, glutinous rice flour, fermented black beans, maltose, dried shrimp,
lap cheong or rock sugar — `src/data/aisles.json` is T-001-17's, and `shopping.test.ts` is already
failing above its threshold for the same reason.
