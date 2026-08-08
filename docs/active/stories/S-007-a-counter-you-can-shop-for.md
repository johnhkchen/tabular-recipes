---
id: S-007
title: a-counter-you-can-shop-for
type: story
status: open
priority: high
---

## Why

**The Soup Pot is the one shelf on this site that most readers cannot cook from, and the reason
is not that the food is hard.** It is that the shelf was built on a premise none of the other
twenty share.

Five things are wrong with it, and they compound.

**1. The ingredients are not for sale.** Twenty-four recipes rest on about eighteen dried goods —
霸王花, 菜乾, 玉竹, 沙參, 章魚乾, 淮山 — and the shopping list files five of the six spot-checked
into `World foods`, which is the aisle map shrugging. The honest answer is *a Chinese herbalist*,
and this site has no way to say that. Worse, the shelf's own page rules substitution out:
*"If the overlord flower cannot be got, the answer is not another flower — it is a different
soup"* (`docs/gaps/soup-pot.md`). Specialist-only sourcing plus no substitutions means a reader
either lives near the right shop or the whole shelf is closed to them.

**2. Three hours of clock buys a course, not a dinner.** All sixteen 老火湯 run 2 hr to 3 hr 30
against 8 to 12 minutes hands-on, and rule 4 of the shelf is that the solids are spent and thrown
away. The Instant Pot and One Pot shelves spend the same clock and put a meal on the table. This
one produces a bowl of broth drunk *before* dinner, in a household arrangement most readers do
not have.

**3. It is not a counter.** `docs/knowledge/counters.md` opens with the definition: *"A counter is
where you would get this if you were not making it at home."* Nobody sells 老火湯 over a counter.
There is no window, no board, no menu word to be the way in. Every other shelf is a storefront a
person can picture. This one is a domestic practice wearing a shop sign, and the definition fails
at the door.

**4. That is where the orientalism sits, and it is structural rather than tonal.** The shelf is
organised around 潤 / 祛濕 / 健脾 — a traditional-medicine frame the site then has to spend
paragraphs holding at arm's length (*"made when someone in the house has been coughing" is honest,
"cures a cough" is not*). The disclaiming is careful and it is not the problem. The problem is
what the arrangement says: the site's one Chinese shelf sells folk remedies while its American
shelves sell sandwiches. No individual file is at fault. The shelf is.

**5. Twenty-four files, one recipe.** Sixteen share the same four method rules and the same alias
*lo fo tong*. The variable between them is which dried thing goes into a pot of water with pork
bones. High file count, narrow reader-usable range.

## What replaces it

**A Hong Kong cha chaan teng**, and it answers all five.

| The Soup Pot's problem | The cha chaan teng |
| --- | --- |
| Herbalist-only dried goods | Evaporated milk, condensed milk, black tea, luncheon meat, ham, macaroni, white bread, pork chop, ketchup — a supermarket, anywhere |
| 3 hr for a bowl of broth | 10 to 25 minutes, and it is lunch |
| Not a shop anybody can picture | The most literal counter in Hong Kong, with a printed board and a set-meal grid |
| A medicine frame the site has to disclaim | 常餐, 下午茶餐, 凍檸茶 — food, sold to people who are hungry |
| One recipe repeated sixteen times | Toast, sandwiches, macaroni soup, rice plates, fried noodles, and a drinks list |

It is also the counter this site has been asking for from another direction. `docs/gaps/README.md`
lists **"a drink that is brewed"** among the five gaps to fill first — three drinks exist and all
three are poured cold. 港式奶茶 is that recipe, and it brings 鴛鴦 and 凍檸茶 with it.

**Why it is a separate counter and not folded into an existing one.** The Dim Sum Counter is a
daytime steamer counter selling by the piece. The Takeout Counter is a Chinese-American numbered
board. A cha chaan teng is neither: it is Western food re-made in Hong Kong and sold as a timed
set — breakfast set, regular set, afternoon tea set — with a drink included in the price. Those
three boards have never been the same board. T-007-01 argues this properly in
`docs/knowledge/counters.md`; the rule there is that the entry says *combined or separate* and why.

## What goes and what stays

**The sixteen 老火湯 are deleted.** Not re-shelved — deleted. They fail on the bargain and on the
framing, not only on sourcing, so moving them to another shelf moves the problem rather than
fixing it. Nothing in the collection points at any of them: checked across every `.cook` file,
`src/`, and `docs/knowledge/`, and the only references are `src/data/counters.json` and the
generated file. This is the cheapest cull the board will ever get.

**Eight stay.** The six 滾湯 — water boiled first, quick things cooked in it, 6 to 31 minutes on
the clock — and the two congees. Every one of them is supermarket-sourceable and is a dinner or a
breakfast rather than a course.

**Five of those eight are shelved nowhere else and will orphan if this is done carelessly.**
`tomato-potato-beef-soup`, `seaweed-egg-drop-soup`, `mustard-greens-tofu-soup`,
`crucian-carp-tofu-soup` and `century-egg-amaranth-soup` sit only at The Soup Pot today.
`egg-drop-soup` also sits at the Takeout Counter, `congee` at Dim Sum and One Pot,
`congee-instant-pot` at the Instant Pot. Rehoming the five is T-007-02's real work and its
acceptance criterion.

## Shape of the work

- **T-007-01** opens the counter: reads real boards, writes the vocabulary table into
  `docs/knowledge/counters.md`, writes `docs/gaps/cha-chaan-teng.md` with a ranked work list, and
  adds the counter to `src/data/counters.json` with ordered section titles and empty item lists.
  Depends on nothing.
- **T-007-02** retires The Soup Pot: deletes sixteen files, rehomes five, removes the counter,
  rewrites its gap page as a record of why. It holds `counters.json`, so it waits for T-007-01.
- **T-007-03** and **T-007-04** fill the shelf in parallel. `.cook` files only, neither touches
  any `src/` or `docs/` file. Both wait for T-007-01's work list.
- **T-007-05** shelves the result, catches the new ingredients in `aisles.json`, and reads the
  whole thing.

## Conventions

Everything in `README.md` holds and is not restated per ticket: one table per recipe, a merge
tree, 5 to 16 ingredient rows, 3 to 6 operations, every timer named, `aka` carrying what a person
would actually say at the counter, `slack` only where the file can name its real failure.

**Never fabricate a number.** On this shelf that lands hardest on the tea — the brew and the
pull are the recipe, and a milk tea written with an invented steeping time is worth less than no
milk tea.

**A dish that exists is not rewritten.** `club-sandwich`, `beef-chow-fun`, `french-toast`,
`borscht`, `pineapple-bun`, `egg-custard-tart` and `lo-mein` are all already here and all belong
on this board. Those are shelving jobs for T-007-05, not writing jobs — with one exception the
writer tickets must handle rather than assume: **a Hong Kong dish that shares an English name with
a Western one is usually not the same dish.** 西多士 is not `french-toast` and 羅宋湯 is not
`borscht`. Where they differ, write the new file and say in it what it is not.
