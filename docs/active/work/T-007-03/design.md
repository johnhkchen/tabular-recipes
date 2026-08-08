# T-007-03 — Design

Five decisions, each against the codebase reality in `research.md`. The rejected options are
written out because two of them are what the ticket text asks for on a first reading.

---

## Decision 1 — What the eight files are

**Chosen.** Six drinks and two toasts:

| # | Slug | Folder | Rank on the work list |
| --- | --- | --- | --- |
| 1 | `hong-kong-milk-tea` | `drinks/` | 1 |
| 2 | `yuenyeung` | `drinks/` | 3 |
| 3 | `iced-lemon-tea` | `drinks/` | 2 |
| 4 | `lemon-coke-with-ginger` | `drinks/` | **unranked — named only by the ticket** |
| 5 | `red-bean-ice` | `drinks/` | 20 |
| 6 | `horlicks` | `drinks/` | **unranked — in `counters.md`, not in the work list** |
| 7 | `hong-kong-french-toast` | `flatbreads-and-pancakes/` | 12 |
| 8 | `thick-toast` | `flatbreads-and-pancakes/` | 4 |

**What this drops: 菠蘿油.** Decision 2.
**What this adds: `horlicks`.** It replaces 菠蘿油 in the count. The ticket names it as one of
three options for a slot ("whichever of 好立克 / 阿華田 / 紅豆冰 the work list ranked") and the
work list ranked only 紅豆冰, so 紅豆冰 takes that slot on merit and 好立克 is the free eighth.
It is a real board row — `docs/knowledge/counters.md` carries it, and the Brooklyn board prints
it as *Holick*, which is the spelling a searcher has seen.

**Rejected: writing 檸樂煲薑 out because the work list never ranked it.** The work list's own
caution says "where a dish cannot be established from more than one board, write a different
dish". It can be: four independent recipe sources were read for it (below), it is on cha chaan
teng boards, and the ticket names it with a description. The ticket wins; the gap between the
two documents is recorded for T-007-05 rather than resolved silently.

**Rejected: 好立克 and 阿華田 as two files.** Same preparation, two tins. One file, both names in
`aka`, exactly as the work list handles the thick-toast spreads.

## Decision 2 — 菠蘿油 cannot be a file, and what to do instead

The work list (rank 21) says: *"A short assembly file that pairs to the bun is more honest than
a second bun recipe."* The ticket says: *"check whether the work list called that a new file or
a note on the existing one, and do what it says."*

**It called for a file. The checker will not draw one.** 菠蘿油 is a warm `pineapple-bun` and a
cold slab of butter — two ingredients — and `check-recipes.mjs` fails anything under three
ingredient rows. Measured, not assumed:

```
FAIL   …/pineapple-bun-with-butter.cook
       - only 2 ingredient row(s) — too thin to be a table
```

**Chosen: do not write the file, and hand T-007-05 the note instead.** `counters.json` sections
take a `notes` list (`{ of?, note }`, ≤120 characters, validated in `parse-recipes.mjs`). The
Toast-and-the-bun-case section already has to borrow `pineapple-bun` from the Bakery; a note on
that borrow is the mechanism that exists for saying "split it warm around a cold slab of butter
and it is 菠蘿油". `structure.md` writes the exact line.

**Rejected: pad it to three rows.** The candidates were condensed milk, a fried egg, a slice of
cheese. Each is a different printed item — 奶油菠蘿包, 菠蘿蛋包 — and none is 菠蘿油. Padding a
table to clear a floor is inventing the recipe, which is the one thing this ticket forbids.

**Rejected: edit `pineapple-bun.cook` to carry 菠蘿油 in its `aka` and prose.** It would work,
and it is the wrong ticket. An existing `.cook` file is the only surface where this ticket and
T-007-04 could collide, and shelving decisions on files written before this story are named in
T-007-05's acceptance criteria, not this one's.

## Decision 3 — How the pull (撞茶) becomes a table operation

The AC: *"has the pull as a named operation with a timer."* The constraint from research: **no
source gives 撞茶 a duration.** Three give it a count — 3–4 (自由時報), 4–6 (teavoya), 4 in the
shop (hk01) — and the work list's *what a table cannot hold* entry says a number in a table
reads as *the* number.

**Chosen.** One operation carrying the pull and the covered steep that follows it in the
heritage sequence (撞茶 → 焗茶), with the count as a range in the cell and the timer measuring
the steep, which is sourced:

```cooklang
>> step.4: pull it through the bag 3 to 6 times, steep 6 min
```

The operation is the pull. It is a column in the table. Its timer is named and its duration is
`~steep{6%min}` from hk01. The pull's own number stays a count, and it stays a range.

**Rejected: `~pull{2%min}`.** Nothing measured it. It would be the first fabricated number in
the file and it would sit in the most-read cell on the page.

**Rejected: `~pull{4%times}`.** Parses, but `minutesOf` returns null for the unit and
`collection.test.ts` fails on "reads a duration off every timer it found". A timer is a
duration in this codebase; a count is not one.

**Rejected: pull and steep as two operations, the pull with no timer.** Reads the AC out of the
file. The pull would be a column with a bare verb and the timer would belong to the step after
it.

## Decision 4 — Which numbers go in the milk tea, and where the range is said

Every figure below is quoted in `research.md` with its URL. Nothing is averaged across sources;
where a source states a range, that range is what the file prints.

| In the file | Value | Source | Why this one |
| --- | --- | --- | --- |
| leaf : water | 1 : 30 (20 g : 600 mL) | 自由時報 | Sources give 1:21, 1:30, 1:50. 自由時報 also supplies the blend and the temperature, so taking all three from one source keeps the file internally consistent rather than assembling a brew no one described |
| the blend | 65 % fine cut / 35 % coarse | 自由時報 (幼茶 65 %, 粗茶 25 %, 中茶 10 %) | Merged, and said out loud — see below |
| water temperature | 90–96 °C | 自由時報 | Only source that states it |
| simmer | 2 to 3 min | 自由時報 | Sources give 1, 2–3, 3–5. The file prints 自由時報's range as a range: `~simmer{2-3%min}` |
| the pull | 3 to 6 times | 自由時報 3–4 · teavoya 4–6 | The union, printed as the range. No timer — Decision 3 |
| covered steep | 6 min | hk01 (謝忠德師傅) | The only sourced steep found |
| tea : evaporated milk | 7 : 3 | **all three sources agree** | The one settled number on the drink |

**The blend is merged from three grades to two, and the file says so.** 自由時波's ratio is by
trade grade — 幼茶 (DUST) 65 %, 粗茶 (BOP) 25 %, 中茶 (BOPF) 10 % — and trade grades are a
specialist purchase. S-007 exists to stop that. An ordinary shop sells two cuts: what is inside
a tea bag, which *is* dust and fannings, and loose leaf. So the file buys **13 g of tea-bag
contents (65 %) and 7 g of loose-leaf Ceylon (35 %)**, the 35 % being 自由時報's 粗 25 % plus 中
10 % added together. That addition is arithmetic on one source's numbers, not a fourth opinion,
and it is stated here and in the ingredient notes.

**"Shops differ" goes in the full-width row**, which is the only place on the page a frame can
be read (voice.md: printed three times, above prep and cook). One sentence, naming the 2017
intangible-heritage listing's 並無統一標準.

**`slack: narrow`** — the leaf keeps working while it sits, so tea left past the steep goes
bitter under the milk rather than strong. A real failure, and not the clock.

## Decision 5 — How 鴛鴦 consumes the milk tea

The AC: *"鴛鴦 consumes the milk tea via `&`, rather than re-deriving a brew."*

**Chosen.** `hong-kong-milk-tea` enters as a single ingredient row with a note naming the
recipe, the coffee is brewed in the file's own first operation, and the merge is a step that
takes the tea and consumes the coffee with `@&(~1)`. `>> pairs-with: hong-kong-milk-tea` makes
the link mutual at build time. This is exactly how the eight `onion-tomato masala` curries and
`char-siu-bao` consume their components — the pattern is established and no other one exists in
this codebase.

**Rejected: re-deriving the brew inside 鴛鴦.** It is what the ticket names as the failure, it
would duplicate every sourced number, and the two files would drift.

---

## The other seven files, decided

**`iced-lemon-tea` (凍檸茶).** Brew, chill, and — separately — press five lemon slices against
the glass with a long spoon, then pour the cold tea over. Two branches merging at the glass,
which is what makes the bruising an operation rather than a note. The work list calls the
bruising "the one thing a table can say", so it gets its own column.

**`lemon-coke-with-ginger` (檸樂煲薑).** Cola simmered with smashed ginger until the fizz is
gone, taken off the heat, lemon added off the heat. **The lemon goes in last on purpose** and
that is the recipe's one real technique — sources are consistent that lemon boiled in it turns
bitter. Three ingredient rows. See "Where the sizes fall short".

**`red-bean-ice` (紅豆冰).** Beans boiled, drained, simmered soft **but whole**, sweetened, then
built in a tall glass over crushed ice with evaporated milk poured down the side.
`pairs-with: red-bean-paste`, and the file says in its cell that the beans stay loose — the work
list's whole reason for allowing a second red-bean file.

**`horlicks` (好立克 / 阿華田).** Powder pasted with a little boiling water first so it does not
lump, the rest of the water, then evaporated milk and sugar. Four ingredient rows.

**`hong-kong-french-toast` (西多士).** Peanut butter between two slices, egged, **deep-fried**,
a cold slab of butter on top, golden syrup over. `aka` leads with `french toast`. The full-width
row says what it is not, in one line. `pairs-with: french-toast`. Filed in
`flatbreads-and-pancakes/` beside `french-toast` — a reader who lands on one should find the
other in the same folder, and that outranks `fried-and-crispy/` being the more literal shelf.
Sourcing note: the peanut-butter filling is confirmed by the Medium guide the work list already
cites ("adds peanut butter and jam or *kaya* … between the slices of bread, which are then
deep-fried").

**`thick-toast` (奶油多 / 厚多士).** One thick slice, grilled, butter on while it is hot,
condensed milk poured over. Three ingredient rows, three operations. The work list's "one table
with the spreads as the variable" cannot be a table — cooklang has no *or* — so the canonical
pair is written and the swap that makes it 奶醬多 goes in a full-width row below the table.

**Domestic deep-fryer.** The work list's *what a table cannot hold* says a counter fryer held at
temperature all afternoon and a domestic pan of oil are different equipment. 西多士 says which
one it is written for, in the operation cell (`350°F`) and in `slack`.

## Where the sizes fall short, and why

The README aims at 5–16 ingredient rows. Three files land under it:

| File | Rows | Why not five |
| --- | --: | --- |
| `lemon-coke-with-ginger` | 3 | Cola, ginger, lemon. Every source read lists exactly those three. A fourth would be invented |
| `horlicks` | 4 | Powder, water, evaporated milk, sugar |
| `thick-toast` | 3 | Bread, butter, condensed milk — and the ticket says so itself: "it is three ingredients and one operation, which is fine" |

All three clear the checker's floor of three rows and three columns. The general finding, for
T-007-05: **a drinks counter's drinks are three-ingredient drinks.** The 5–16 aim was measured
off a shelf of stews and bakes; this counter is the first one where the drinks block is the
point rather than the garnish.

Operations run 3–5 in every file. Nothing needs six.

## Sourcing, against S-007's promise

Every ingredient across the eight files, and where it is bought:

Ceylon tea bags · loose-leaf black tea · ground coffee · evaporated milk · sweetened condensed
milk · granulated sugar · rock sugar · lemons · fresh ginger · cola · dried adzuki beans ·
Horlicks or Ovaltine · white sandwich bread · smooth peanut butter · eggs · neutral oil · salted
butter · golden syrup · ice.

**Every one is a supermarket item**, with two worth naming: dried adzuki beans and golden syrup
are supermarket items in the UK/HK/Australia and an Asian-grocery or baking-aisle item in the
US. Neither needs a specialist shop. Nothing on this list comes from a herbalist, which is the
comparison S-007 is making.
