# T-007-01 — Design

Five decisions, each with the alternatives that lost and the research line that settled it.

---

## D1. Where the `## What it has` block gets its content from

The acceptance criteria want a machine-read `## What it has` block. The counter has **no recipes**
— T-007-05 shelves them. So what goes in the block?

**Option A — list the seven borrowed slugs (`club-sandwich`, `beef-chow-fun`, …) under headings.**
Rejected. Those files do not name Cha Chaan Teng today, and `menu-sections.mjs` reports every one of
them as `listed but not shelved here` (research §1, the `extra` branch). It would also pre-empt the
per-slug judgement this ticket is supposed to *argue*, and it would put `french-toast` and `borscht`
on the board — the two files the story explicitly says are not the Hong Kong dishes.

**Option B — headings with empty item lists.** Chosen. `parseSections()` only pushes a section when
`found.length` is non-zero, so an empty heading yields no section, no `unparsed` noise, no `extra`
report. The block is then a promise the parser can keep: the moment T-007-05 writes `>> counters:
Cha Chaan Teng` into a file and adds its slug to a line here, the section becomes real without the
page changing shape. It is also literally what `counters.json` will hold — ordered titles, empty
`items` — so the two files agree from day one.

**Option C — omit the block and use a different heading, as `soup-pot.md` once did.** Rejected: the
acceptance criteria name the block, and the reason `soup-pot.md` dodged it (slugs listed but not
shelved) does not apply to an empty block.

The mechanical consequences of Option B, and the two rules they impose on the writing:

- All explanatory prose in that section sits **before** the first `**`, because a chunk not starting
  with `**` is skipped, and prose *after* a heading is scanned for slugs and would be mis-read.
- No section title may contain ` — `, which the parser cuts a title at.

## D2. Section titles

The ticket supplies seven titles "as intent — improve the wording if the real board says it better."
Three boards were read (research §3). What they agree on:

- toast/sandwiches, rice plates and noodles-in-soup are three separate blocks everywhere;
- drinks get their own long section everywhere;
- the set block is its own thing, printed either first (常餐 sits fourth on the 極上冰室 board, after
  早餐) or last (The Peak prints 茶餐 Set Menu at the foot).

Two changes to the ticket's list, both because the board says it better:

1. **"The set meals (常餐 · 早餐 · 下午茶餐)"** — kept verbatim. It is the one title that has to
   carry the Chinese, because the three words *are* the grid and no English phrase replaces them.
   Checked against the parser: the middots sit inside the bold span and are never split on; the
   parentheses are only stripped from *item* pieces, not from titles.
2. **"Toast and the bun case"** → **"Toast and the bun case"**, kept. **"Sandwiches and buns"** →
   **"Sandwiches"**, because the ticket's own list already puts buns in the toast section and every
   board read prints one sandwich block, not two. The bun items (菠蘿油, 豬扒包, 雞尾包) go with the
   toast, which is where 極上冰室 puts them (三文治及多士) and where The Peak puts them (小吃·包點).

Wait — that would collapse two of the seven. Held instead: **"Sandwiches and buns"** is kept as
given, and the toast section is narrowed to **"Toast and the bun case"** meaning the toast board
proper. Rationale: the two really are printed apart on the Brooklyn board (a `Sandwiches` section
whose first six rows are toasts) only because that board has no bun case at all. Keeping both
matches the two boards that do.

Final order, and why: **the sets first**, because the set grid is what makes this counter a counter
and a visitor's first question is which time of day they are in; **the drinks second**, because the
drink is in the set price and the tea is this shelf's flagship recipe; then the food blocks in the
order a board prints them; then a catch-all.

## D3. The blurb

Register, from the 21 existing blurbs: one imperative sentence, second person implied, no adjectives
about quality. The ticket's own examples — *"Take a tray and tongs, fill it, pay at the register."*,
*"Order by number, eat it out of the carton."* — are both *what you do*.

What a person does at a cha chaan teng, from the boards: they pick a set by the time of day, and the
drink comes with it. That is the whole mechanic and it is one breath. Candidates:

- *"Pick a set by the time of day; the milk tea comes with it."* — chosen.
- *"Order the set, and the tea is in the price."* — true, but "in the price" is shop-side accounting,
  not something the visitor does.
- *"Breakfast set, lunch set, tea set — and a drink with each."* — a list, not an instruction.

"Authentic" does not appear. Neither does any word ("fusion", "iconic", "nostalgic") a person would
not say at a kitchen table.

## D4. Combined or separate, and how it is argued

The entry must argue against the Dim Sum Counter and the Takeout Counter **with evidence from the
menus**, not by assertion. The evidence available:

| | Dim Sum Counter | Takeout Counter | Cha Chaan Teng |
| --- | --- | --- | --- |
| How the combo is stated | *"any 3 items with white rice"* — a rule you say aloud | `C1`–`C16`, `L1`–`L16` — a number that means a different dish at a different shop | **早餐 / 常餐 / 快餐 / 下午茶餐** — a time of day with a fixed shape |
| What is in the combo price | rice | pork fried rice and an egg roll | **a drink**, hot; +HK$2–3 to take it cold |
| Hours | late morning to mid-afternoon | dinner-weighted, one board all day | 05:00–01:00 split into five named services; 下午茶餐 at 14:00–17:00 |
| The cooking | steamer and fryer | wok, one brown sauce family | **griddle, deep-fryer, toaster, pasta pot and a tea urn** |
| The food | Cantonese small plates | Chinese-American | **Western food re-made in Hong Kong** — macaroni, pork chop, spaghetti, borscht, toast |

The honest overlaps, named rather than hidden: **蛋撻** is at a bakery, a dim sum trolley and a cha
chaan teng, and **菠蘿包** at a bakery and a cha chaan teng — both already shelved at two counters
each in this collection, which is the collection agreeing. **乾炒牛河** appears on the dim sum
board's noodle line and on the cha chaan teng's. **叉燒** turns up at all three. A recipe on two
boards is normal and correct; the site already models it with a `counters` list.

The one place a reclassifier might reasonably push back — and it is worth writing down — is the
**冰室 (bing sutt)**, which is a narrower, older, drinks-and-toast-only version of the same shop.
Every board read prints both vocabularies together (極上冰室 *is* a 冰室 and sells 湯飯 and 煲仔),
so it is folded in rather than split, and the entry says so.

## D5. How much the tea page commits to

The story's rule is *never fabricate a number*, and this is where the shelf will break it if
anything does. Three sub-decisions:

- **Blend.** Say the trade grades — BOP / BOPF / DUST, 粗 / 中粗 / 幼 — and what each contributes,
  because that is a named, sourced fact from the Hong Kong Coffee and Tea Association. Say the count
  is *three or more, sometimes seven or eight*, and that Lan Fong Yuen is reported as five in one
  account and six in another. Do **not** invent a ratio.
- **Pull.** Give the named sequence 一沖、二焗、三撞、四回溫 and report the counts as the spread they
  are: 3–4 in one write-up, 8 and 3 for the same shop in two others. Give the 90–96 °C and the
  1 g : 30 g ratio *attributed to the single source that states them*, and flag that they are
  single-sourced.
- **Milk.** Evaporated, and name 黑白淡奶 as the default with the caveat that at least one famous
  shop uses a creamer instead. Give 茶走 as the condensed-milk order.

Rejected alternative: pick the modal numbers and state them flatly so the writer has something to
type. That is exactly the failure `docs/gaps/soup-pot.md` warns about in its own closing cautions
(*"write a different soup rather than filling a rank with something plausible"*), and it is the one
recipe on this shelf where a made-up number is the whole recipe.

---

## D6. The ranking rule, and the seven verdicts it produces

S-007's argument is that the Soup Pot fails because a reader cannot cook from it. So the missing
list is ranked by **what a reader can cook tonight**: a saucepan and a supermarket beats a wok, a
deep-fryer, a spit, or one shop across town. Emblematic-ness is not the axis; 乾炒牛河 is the most
Hong Kong thing on the board and ranks low because it needs a wok hot enough to scorch rice noodles.

The seven existing slugs, decided from the files read in research §2:

| Slug | Verdict | Why |
| --- | --- | --- |
| `club-sandwich` | **shelve as is** | 公司三文治 is on the Brooklyn board under that exact English. Same construction, same three slices. |
| `beef-chow-fun` | **shelve as is** | Already `乾炒牛河` in its own `aka`. Same dish on both boards. |
| `french-toast` | **write a new file** | The existing one is soaked challah *griddled in butter* with maple syrup. 西多士 is two slices sandwiched around peanut butter, egg-dipped and **deep-fried**, then butter and golden syrup. Different fat, different method, different filling. The new file must say what it is not. |
| `borscht` | **write a new file** | 1½ lb of beets versus a tomato-and-cabbage soup with **no beetroot**. The English name on the board is *Borsch Soup*; the dish is not borscht. New file says what it is not. |
| `pineapple-bun` | **shelve as is** | Same bun, already at two counters. 菠蘿油 — the same bun split around a cold slab of butter — is a separate ranked item, not a rewrite. |
| `egg-custard-tart` | **shelve as is** | Already made with evaporated milk; already at Bakery and Dim Sum. The ticket names it as a genuine two-board dish. |
| `lo-mein` | **write a new file, or nothing** | The existing file is the Chinese-American 撈麵 — soft wheat noodles tossed with char siu. A cha chaan teng's 撈丁 is instant noodles served dry, and its 雲吞撈麵 is thin wonton noodles. **Shares only an English name.** Do not shelve it here. |

That is five *shelve* / two *write* on the seven the story listed, plus one refusal — and the
refusal is `lo-mein`, which the story assumed belonged here. Saying so is the point of the exercise.

## D7. Components: one file referenced many, or inline each time

The gap pages already use a `## Components it would need` section for exactly this. Four candidates
carry more than one dish each on this board:

- **The milk tea base (茶膽)** — 港式奶茶, 鴛鴦, 凍奶茶, and 茶走 is a variation on it. Four drinks,
  one brew. Unambiguously one file.
- **The tomato sauce over baked pork chop rice** — the same red sauce goes over 焗豬扒飯, 茄汁豬扒飯
  and the tomato half of a 湯粉. Ketchup-based, and `homemade-ketchup` already exists to pair to.
- **Hong Kong curry sauce** — over 咖喱牛腩, 咖喱魚蛋 and the 咖喱豬扒飯. One sauce, three dishes,
  and the ticket names it.
- **Satay beef (沙嗲牛肉)** — the topping on 沙嗲牛肉麵, the 沙嗲牛肉炒河 and the satay beef
  sandwich. One braise, three vehicles.

A fifth that is worth naming but is *not* worth a file: **evaporated milk**. It is bought, and every
gap page that names a bought thing says so (`dim-sum-counter.md`: *"Dried shrimp and lap cheong —
bought, not made, but worth saying so"*). Same treatment.

The 白汁 (béchamel under a baked dish) is already `bechamel`; it is a pairing, not a new component.

---

## D8. What is deliberately not done here

- **The Contents table's other six missing rows.** The table lists 15 of 21 counters. Adding the six
  S-002/S-003 rows would be right and is not this ticket's file to widen; the criteria ask for one
  row and one row is added.
- **Touching The Soup Pot.** T-007-02 owns it, holds `counters.json` after this ticket, and has to
  delete and rehome in one motion.
- **Any `.cook` file.** The demonstration file required by the criteria is written, checked, and
  deleted inside the Implement phase without ever being committed.
- **`aisles.json`.** Evaporated milk, condensed milk, luncheon meat and custard powder will need
  aisles. That is T-007-05's acceptance criterion, named there.
