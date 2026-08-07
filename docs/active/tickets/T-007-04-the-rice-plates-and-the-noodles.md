---
id: T-007-04
story: S-007
title: the-rice-plates-and-the-noodles
type: task
status: done
priority: high
phase: done
depends_on: [T-007-01]
---

## Context

Write the food half of the cha chaan teng — the plates and bowls a set meal is built around. Work
from the ranked list in `docs/gaps/cha-chaan-teng.md`, which T-007-01 wrote for you.

**`.cook` files in `recipes/` only.** You do not touch `src/`, `docs/gaps/**` or
`src/data/counters.json`. T-007-05 shelves what you write. Record anything the shelver needs — a
dish you found already existed, a section you think an item belongs in — in your work artifact
under `docs/active/work/T-007-04/`.

T-007-03 is writing the drinks and toast in parallel. **Do not write a drink and do not write
西多士**, and if you need a tea in a dish, note it for T-007-05 rather than writing a second one.

### 1. What to write

The list in `docs/gaps/cha-chaan-teng.md` is the authority; the shape below is what this ticket
expects back. **Twelve files minimum.**

**Macaroni, noodles and things in soup.** This is the block that makes the counter legible to
someone who has never been to one, and it is the cheapest food on the shelf to cook.

- 湯通粉 — macaroni in a thin broth with ham or luncheon meat, and a fried egg alongside. It is
  breakfast, it takes fifteen minutes, and it is the single best argument this shelf makes.
- 餐蛋麵 — instant noodles with luncheon meat and a fried egg. **A recipe whose main ingredient is
  a packet of instant noodles is a real recipe here**, not a joke and not a shortcut, because that
  is what the board sells and what the kitchen makes. Write it straight.
- 沙嗲牛肉麵 — satay beef on the same noodles. Check whether the work list wants the satay as its
  own component file.
- 羅宋湯 — Hong Kong borscht: tomato, cabbage, carrot, beef, **no beetroot**, and it is the 餐湯
  that comes with a 常餐. `borscht` already exists and is a different soup; this file says so.

**Rice plates.** The heavier half of the board.

- 焗豬扒飯 — baked pork chop rice: fried rice under a pork chop under tomato sauce under cheese,
  finished in the oven. The most-ordered plate in Hong Kong and the most operations of anything in
  this ticket. **If it needs more than six operations it is two files** — a tomato sauce that
  several plates share, and the assembly. That is a judgement for you to make and to argue in the
  work artifact.
- 咖喱牛腩飯 — curry brisket over rice. Long, but unattended, which is a bargain this site already
  knows how to render.
- 免治牛肉飯 — minced beef over rice with a fried egg. Twenty minutes.
- 豉油皇炒麵 — soy sauce pan-fried noodles. Four ingredients and a hot pan.
- Whichever of 白汁海鮮焗飯 / 滑蛋蝦仁飯 / 揚州炒飯 the work list ranked.

**Sandwiches and buns.**

- 蛋治 — the Hong Kong egg sandwich: soft scrambled egg, crustless white bread, cut in triangles.
- 豬扒包 — pork chop bun, in a bolillo-like roll the collection may not have.
- `club-sandwich` and `beef-chow-fun` and `lo-mein` already exist. Check the work list for which
  are shelving jobs and leave those alone.

### 2. The two traps on this shelf

**Luncheon meat is an ingredient, and writing around it is the failure.** Half this board runs on
tinned luncheon meat, evaporated milk and instant noodles, and a version that substitutes
"good-quality ham" for the tin has written a different dish and quietly restated the exact snobbery
S-007 exists to remove. Name the tin. If a reader wants to substitute, they will.

**A shared English name is almost never a shared dish.** 羅宋湯 is not `borscht`. 焗豬扒飯 is not a
casserole. Where the collection already holds a same-named file, the new one carries the old name
in `aka` **and says in one line of prose what it is not** — that is how a searcher who types the
English word lands on the right table.

### 3. What a wok would cost this shelf

乾炒牛河 and several fried-noodle plates want wok hei, which a home burner cannot produce. The
site does not lie about equipment. **Write the home version and say in the file what is different
about it**, or rank the dish out and say why in the work artifact. `beef-chow-fun` already exists
and may already have settled this — read it before deciding.

## Acceptance Criteria

- At least **twelve** new `.cook` files, all passing `node scripts/check-recipes.mjs`.
- 湯通粉, 餐蛋麵 and 焗豬扒飯 are among them. Those three are the shelf's argument and the ticket is
  not complete without them.
- The 羅宋湯 file contains no beetroot, carries `borscht` in `aka`, and says in one line what it is
  not. Same test for every other file sharing an English name with an existing recipe.
- Any dish written as two files (a shared sauce plus an assembly) has the assembly consuming the
  component via `&`, and both files argued in the work artifact.
- Every file names its counter with `>> counters: Cha Chaan Teng`, carries `aka` with characters,
  a Cantonese romanisation and the plain-keyboard spelling an English speaker would type, and
  names every timer.
- Every file is 5 to 16 ingredient rows and 3 to 6 operations, or the work artifact says why not.
- No file uses an ingredient that cannot be bought in an ordinary supermarket or an ordinary Asian
  grocery. If one does, it is written up rather than committed.
- Any dish requiring wok hei either says in the file what the home version gives up, or is left
  unwritten with the reason recorded.
- `slack` appears only where the file can name a real failure.
- No drink and no 西多士 is written here — those are T-007-03's.
- `npm run check` passes for the whole collection.
- Only `recipes/**/*.cook` and `docs/active/work/T-007-04/**` are modified.
