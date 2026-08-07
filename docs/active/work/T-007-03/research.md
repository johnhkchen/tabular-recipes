# T-007-03 — Research

What exists, where it is, and what it constrains. No decisions here; those are in `design.md`.

---

## 1. The ticket's place in the story

S-007 retires The Soup Pot and opens a Cha Chaan Teng in its place. Five tickets:

| Ticket | Owns | State |
| --- | --- | --- |
| T-007-01 | `docs/knowledge/counters.md`, `docs/gaps/cha-chaan-teng.md`, the counter entry in `src/data/counters.json` | done (commit `9120fb6`) |
| T-007-02 | deleting/rehoming The Soup Pot, `counters.json` | in flight |
| **T-007-03** | **`recipes/**/*.cook` — drinks and toast** | **this ticket** |
| T-007-04 | `recipes/**/*.cook` — rice plates, noodles, sandwiches | in flight (phase `structure`) |
| T-007-05 | shelving: `counters.json`, `aisles.json`, both gap pages | blocked on 02/03/04 |

T-007-03 and T-007-04 run in parallel on the same directory. The dependency edge that keeps
them apart is **filename ownership, not directory ownership**: T-007-04 is told "do not write a
drink and do not write 西多士". Everything else in `recipes/` is theirs. Nothing in this ticket
may edit an existing `.cook` file, because that is the one way the two writers could collide.

## 2. The work list this ticket is written against

`docs/gaps/cha-chaan-teng.md` (T-007-01) is the authority. It ranks 24 items by *what a reader
can cook tonight*. The ones inside this ticket's half:

| Rank | Item | What the list says |
| --: | --- | --- |
| 1 | 港式奶茶 Hong Kong milk tea | the flagship; closes `docs/gaps/README.md` gap 5, *a drink that is brewed* |
| 2 | 凍檸茶 iced lemon tea | tea over ice, five lemon slices, bruised with a long spoon — the bruising is the technique |
| 3 | 鴛鴦 yuenyeung | milk tea + coffee, ~2:1. **Consumes rank 1, so write it after** |
| 4 | 奶醬多 / 厚多士 thick toast | "One table with the spreads as the variable" |
| 12 | 西多士 HK French toast | new file; **must say it is not `french-toast`** |
| 20 | 紅豆冰 red bean ice | whole beans left loose — `red-bean-paste` is the wrong texture and the file has to say so |
| 21 | 菠蘿油 pineapple bun with butter | "A short assembly file that pairs to the bun is more honest than a second bun recipe" |

**檸樂煲薑 is named in the ticket and is not on the ranked list at all.** The ticket asks for it
("the one item on this board a Western reader will not believe until they read it"); the work
list never ranked it. That is a real gap between the two documents and it is recorded here so
the design can decide rather than assume.

**好立克 / 阿華田** appear in `docs/knowledge/counters.md`'s vocabulary table but are also not on
the ranked list. The ticket says "whichever of 好立克 / 阿華田 / 紅豆冰 the work list ranked" —
only 紅豆冰 is ranked (20).

## 3. What the tea sources actually say

The ticket's hardest constraint is "**Never fabricate a number**". T-007-01 wrote out the
disagreements; this pass read the primary sources again and found one more ratio and two more
clocks. Everything below is a quote with its source attached.

**自由時報 食譜自由配, 港式茶飲沖泡秘訣** — <https://food.ltn.com.tw/article/10846>

- 沖茶最佳溫度在90～96℃之間 — brew at **90–96 °C**
- 1g配好的茶粉：30g水的比例 — **1 g blended leaf : 30 g water**
- 幼茶65%、粗茶25%、中茶10% — **a blend ratio: 65 % dust, 25 % coarse, 10 % medium**
- 小火煮約2～3分鐘，直到茶體微滾 — **simmer 2–3 min**
- 重覆3～4次 — 撞茶 **repeated 3–4 times**
- 倒入30%淡奶，最後再沖入70%茶膽 — **30 % evaporated milk to 70 % tea**

The blend ratio matters: **T-007-01's page states "No source states a ratio."** This source
states one. The correction belongs in the work artifact and eventually on the gap page (which
this ticket does not own).

**hk01 教煮 128519, 謝忠德師傅** (Hong Kong milk tea competition runner-up) —
<https://www.hk01.com/教煮/128519/>

- 紅茶茶葉12克 / 水250毫升 — **12 g leaf : 250 mL water** (≈ 1 : 21)
- 淡奶60毫升 — **60 mL evaporated milk**
- 焗6分鐘 — **steep 6 min off the heat**
- 以細火煮1分鐘後關火 — **simmer 1 min**
- 茶和奶的比例大概是7比3 — **7 : 3 tea to milk**
- 撞茶 4次 in a shop; the home version substitutes 6–8 clockwise stirs in the bag

**teavoya, 港式奶茶完全指南** — <https://teavoya.com.tw/blogs/最新消息/港式奶茶完全指南…>

- 50g 茶葉配 2500ml 水 — **1 : 50**
- 煮滾後轉小火燜 3-5 分鐘 — **simmer 3–5 min**
- 至少要做 4-6 次 — 撞茶 **4–6 times**
- 黑白淡奶 約 150ml, 茶與淡奶比例約 7:3

**What is settled and what is not.**

| Decision | Settled? | Evidence |
| --- | --- | --- |
| Ceylon black tea, several grades blended | yes | ACTHK trade body (BOP 粗茶 aroma · BOPF 中粗茶 colour/body · DUST 幼茶 flavour) |
| tea : evaporated milk = 7 : 3 | **yes — three independent sources agree** | ltn, hk01, teavoya |
| evaporated, not condensed; 黑白淡奶 the default | yes | teavoya; Brooklyn Soda Works |
| leaf : water | **no** — 1:21, 1:30, 1:50 | hk01, ltn, teavoya |
| simmer on the heat | **no** — 1, 2–3, 3–5 min | hk01, ltn, teavoya |
| covered steep (焗茶) | one source only — 6 min | hk01 |
| 撞茶 count | **no** — 3–4, 4–6, 8-vs-3 at the same shop | ltn, teavoya, Brooklyn Soda Works |
| that there is a standard at all | **settled: there is not** | HK ICH 2017 listing, 並無統一標準 |

**No source anywhere gives 撞茶 a duration.** It is given as a count. That is the single fact
that shapes how the pull can be written as a table operation.

## 4. The file format, and what it will and will not draw

A `.cook` file is cooklang plus `>>` metadata. `scripts/normalise.mjs` is the only place the
parser is touched; `src/lib/tree.ts` turns steps into a merge tree; `src/lib/layout.ts` turns
the tree into cells; `scripts/check-recipes.mjs` runs both and reports.

**Hard failures** (`check-recipes.mjs` exits non-zero, and so does the deploy):

- fewer than **3 ingredient rows** — "too thin to be a table"
- fewer than **3 columns**, i.e. fewer than two chained operations — "nothing merges"
- an operation cell that comes out blank
- a step used by two later steps (it is a tree, not a graph), or two steps that end the recipe
- a counter name not in `src/data/counters.json` — `Cha Chaan Teng` is there
- a `>> slack:` line that is not `<level> — <reason>` with level ∈ forgiving/narrow/unforgiving
- any of the five length caps: operation cell 70, step body 150, prose row 120, slack reason
  200, ingredient note 80

**Shape conventions** (README §Size, restated by S-007): aim 5–16 ingredient rows, 3–6
operations. These are aims, not checks — the checker only enforces the 3/3 floor.

**Mechanics that will matter here:**

- `@&(~n)thing{}` consumes the step *n* steps back. `~1` counts **every** step including prose
  steps, so prose rows go at the top or the references shift.
- A step with no ingredients and no refs becomes a full-width row, **printed three times**
  (table, prep, cook). That is the only place a "this is not the other dish" line can live and
  be read.
- `>> step.N:` overrides the cell label and **throws the step's own prose away** — 172,003
  characters in this collection have never been rendered. Write short bodies.
- Timers must be named (`~steep{6%min}`) and must carry a unit `src/lib/time.ts` understands.
  `{4%times}` would parse but `minutesOf` returns null, which fails
  `collection.test.ts` → "reads a duration off every timer it found".
- Range quantities work: `~{3-4%hr}` exists in `birria-de-res` and renders "3 to 4 hr",
  counting the top end for the schedule.
- A component from another recipe is a **plain ingredient row** with a note like
  `(the base recipe)` plus `>> pairs-with: <slug>` — see the eight `onion-tomato masala`
  curries and `char-siu-bao`. `pairs-with` is made mutual at build time and a dangling slug is
  a build error.
- `>> category:` defaults to the folder name title-cased. `recipes/drinks/` → `Drinks`.

**Measured, not assumed:** a two-ingredient 菠蘿油 was written and run through the checker
during this pass. It fails:

```
FAIL   …/pineapple-bun-with-butter.cook
       - only 2 ingredient row(s) — too thin to be a table
```

## 5. What the collection already holds that this ticket touches

**Drinks — three files, all cold, none brewed.** `ca-phe-sua-da` (phin coffee, condensed milk,
over ice), `egg-cream`, `milkshake`. `recipes/drinks/` is the smallest folder on the shelf.
`ca-phe-sua-da` is the closest model for a drink that drips/steeps and is worth reading for
shape: 5 rows, 5 operations, timers named `~bloom` and `~steep`.

**`french-toast`** — `recipes/flatbreads-and-pancakes/french-toast.cook`, Diner counter,
day-old challah in an egg-milk-vanilla-cinnamon custard, **griddled in butter**, maple syrup.
`aka: french toast, eggy bread, pain perdu, gypsy toast`. Different fat, different method, no
filling. The work list rules it a *write a new file* case.

**`pineapple-bun`** — `recipes/breads/pineapple-bun.cook`, Bakery + Dim Sum Counter, 3 hr 30
min, six operations, `slack: narrow`. Already carries 菠蘿包 in `aka`. Work list: *shelve as is*,
with 菠蘿油 as a separate short assembly file.

**`red-bean-paste`** — `recipes/custards-and-puddings/red-bean-paste.cook`, 16 servings, boil
5 min → simmer 90 min → mash → cook down with sugar 25 min → beat in oil. Explicitly the wrong
texture for 紅豆冰, which wants the beans whole and loose.

**`egg-custard-tart`, `club-sandwich`, `beef-chow-fun`, `char-siu`** — all *shelve as is*, all
T-007-05's job, none of them this ticket's.

**Evaporated and condensed milk in the aisle map.** `src/data/aisles.json` already carries
patterns for `evaporated milk`, `condensed milk`, `sweetened condensed milk`, `milk powder` and
`malted milk powder`. Matching is most-specific-wins across aisles, counted in words then
characters, so `evaporated milk` (2 words) beats a bare `milk`. The names in the ingredient
rows are what decide the aisle, so they have to be written exactly — T-007-05's AC calls a
`condensed milk` that matches an `evaporated milk` pattern "a silent wrong shelf".

**Existing ingredient spellings worth matching:** `sweetened condensed milk` (ca-phe-sua-da),
`evaporated milk` (egg-custard-tart, macaroni-and-cheese), `malted milk powder` (milkshake),
`custard powder` (pineapple-bun), `white sandwich bread` (club-sandwich).

## 6. The counter, and where these files will be shelved

`src/data/counters.json` holds Cha Chaan Teng with seven ordered section titles and **empty
item lists**. T-007-05 fills them. The two that take this ticket's files:

- **The drinks counter**
- **Toast and the bun case**

`menuFor()` hides a counter with no recipes, so nothing renders and nothing breaks until then.
`node scripts/menu-sections.mjs` round-trips those titles against
`docs/gaps/cha-chaan-teng.md`'s `## What it has` block, which is why neither file may drift —
and why neither is this ticket's to edit.

Sections also support a `notes` list (`{ of?, note }`, capped at 120 characters, validated in
`parse-recipes.mjs`) for saying something about a slug the section borrows. That is the
mechanism a dish which cannot be its own file would have to use.

## 7. Constraints this ticket inherits, collected

1. `.cook` files under `recipes/` and `docs/active/work/T-007-03/**`. Nothing else.
2. No existing `.cook` file is edited — that is the collision surface with T-007-04.
3. Eight new files minimum, all passing `node scripts/check-recipes.mjs`; `npm run check`
   green for the whole collection.
4. Every file: `>> counters: Cha Chaan Teng`; `aka` carrying characters + a Cantonese
   romanisation + the plain-keyboard English spelling; every timer named.
5. 5–16 ingredient rows and 3–6 operations, or the work artifact says why not.
6. Supermarket or ordinary Asian grocery only. Anything else is written up, not committed.
7. `slack` only where the file names a real failure.
8. No invented numbers. Where sources disagree, the file says the range.
9. `node` is not on the default PATH in this environment; it is at
   `~/.nvm/versions/node/v24.18.1/bin` and `.node-version` pins 24.18.1.

## 8. Open questions carried into Design

- 撞茶 has a count in every source and a duration in none. The AC wants "the pull as a named
  operation with a timer". What timer can honestly sit in that operation?
- 菠蘿油 is two ingredients and the table has a three-row floor. The work list called for a
  short assembly file; the checker will not draw one.
- 檸樂煲薑 is in the ticket and not in the work list. Write it, or treat the work list as the
  authority the ticket says it is?
- Which drink fills the eighth slot if 菠蘿油 cannot be written.
- Where do the two toast files live — `flatbreads-and-pancakes/` beside `french-toast`, or
  `breads/` beside `pineapple-bun`?
