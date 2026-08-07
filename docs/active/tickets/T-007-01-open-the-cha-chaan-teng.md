---
id: T-007-01
story: S-007
title: open-the-cha-chaan-teng
type: task
status: done
priority: critical
phase: done
depends_on: []
---

## Context

Open the counter and write its work list, so two writers can start and T-007-02 can retire the
shelf it replaces.

**You own `src/data/counters.json`, `docs/knowledge/counters.md` and `docs/gaps/cha-chaan-teng.md`.**
T-007-02 holds `counters.json` after you and waits on this ticket for that reason. Do not remove
The Soup Pot here — that is T-007-02's job and it has to be done alongside the rehoming, not
before it.

### 1. Read real boards before writing anything

The other twenty counters were settled from menu reading, not from the recipes already written,
and this one gets the same treatment. `docs/knowledge/counters.md` says why: **the menu word is
the way in**, and the vocabulary table is the source for `>> aka:` lines.

Read actual cha chaan teng menus — Hong Kong, and the diaspora boards in Toronto, the Bay Area,
Sydney, London, which drift in useful ways. What to come back with:

- **The set-meal grid**, which is the thing that makes this counter a counter. 早餐 / 常餐 /
  快餐 / 下午茶餐 are *times of day with a fixed shape*, not dish names, and the drink is in the
  price. Record what each set actually contains and at what hours the board prints it.
- **Both spellings of everything.** Cha chaan teng / chachanteng / cha chan teng / 茶餐廳; yuenyeung
  / yuanyang / 鴛鴦; lai cha / naai cha / 奶茶. Boards in one city disagree and all of it is real.
- **What the English on the board says**, which is often not a translation. "Macaroni in soup",
  "Pork chop rice", "Set A with drink", "Thick toast". The English is what a reader will search.

### 2. Argue combined-or-separate honestly

Every entry in `docs/knowledge/counters.md` says whether the archetype is combined or separate
and why, and this one has a real case to make against two neighbours already on the shelf:

- **The Dim Sum Counter** is daytime, steamed, sold by the piece with "(3)" against it.
- **The Takeout Counter** is the Chinese-American numbered board — General Tso's, lo mein, egg
  drop soup.

Neither has ever been the same board as a cha chaan teng, which sells Western food re-made in
Hong Kong on a timed set-meal grid. **Say that with evidence from the menus you read**, not by
assertion, and name the overlaps where they exist: 蛋撻 and 菠蘿包 genuinely appear at both a
bakery and a cha chaan teng, and a recipe on two boards is normal and correct.

### 3. Open the counter

Add one entry to `src/data/counters.json` in the existing shape (`name`, `slug`, `blurb`,
`categories`, `sections`), with section titles in menu order and **empty item lists**. T-007-05
fills the items.

| Name | Slug |
| --- | --- |
| Cha Chaan Teng | `cha-chaan-teng` |

The blurb on a shop counter is an instruction to a visitor standing in front of it — *"Take a
tray and tongs, fill it, pay at the register."*, *"Order by number, eat it out of the carton."*
This is a shop, so write it as one. It should say what a person does at this counter in one
breath. Keep the word "authentic" out of it, and any word a person would not say at a kitchen
table.

Section titles, as intent — improve the wording if the real board says it better:

- The set meals (常餐 · 早餐 · 下午茶餐)
- The drinks counter
- Toast and the bun case
- Macaroni, noodles and things in soup
- Rice plates
- Sandwiches and buns
- Also here

**Do not add a `categories` fallback that steals recipes.** The fallback catches recipes naming
no counter at all, and `Sandwiches & Rolls` or `Drinks` would drag half the Deli onto this board.
Prefer an empty `categories` and let every item arrive by an explicit `>> counters:` line.

### 4. Write the work list

Write `docs/gaps/cha-chaan-teng.md` in the shape of the files already in that folder — read
`docs/gaps/pho-and-banh-mi.md` and `docs/gaps/dim-sum-counter.md` first. It needs a
`## What it has` block in the machine-read `**Section title.** slug · slug` shape (see
`docs/gaps/README.md`), a ranked missing list, the components those dishes wait on, and a
what-a-table-cannot-hold section.

Four things this ticket must get right, because the writers inherit them:

**Rank by what a reader can cook tonight, not by what is most emblematic.** That is the whole
argument of S-007. A dish needing a wok, a spit or an ingredient from one shop ranks below a
dish needing a saucepan and a supermarket.

**Say which existing files this board borrows and which it must not.** `club-sandwich`,
`beef-chow-fun`, `french-toast`, `borscht`, `pineapple-bun`, `egg-custard-tart` and `lo-mein`
are already here. Some belong on this board unchanged; some share only an English name.
**西多士 is deep-fried peanut-butter-filled toast under butter and golden syrup and is not
`french-toast`. 羅宋湯 is a tomato-and-cabbage soup with no beetroot in it and is not `borscht`.**
Go through all seven by slug and say, for each: *shelve it as it is*, or *write a new file and
say in it what it is not*.

**The tea is the hard recipe on this shelf and it must be researched, not guessed.** 港式奶茶 is
a blend of black teas, brewed hard, pulled through a cloth bag repeatedly, and finished with
evaporated milk. The blend, the pull and the milk are three separate decisions and every one of
them is a place a lazy file would invent a number. Give the writer enough to work from and say
where the ranges genuinely differ between shops rather than picking one and stating it flatly.

**Name the shared components once.** Several dishes on this board sit on the same two or three
things — the tea base, the tomato sauce under a baked pork chop rice, the curry that goes over
both brisket and fishballs. Say which are worth one file referenced many times, in the shape the
other gap pages use.

## Acceptance Criteria

- `src/data/counters.json` holds one more counter than it did, `cha-chaan-teng`, with `name`,
  `slug`, `blurb` and ordered `sections` with empty item lists, and the file parses. **The Soup
  Pot is untouched by this ticket.**
- `docs/knowledge/counters.md` has a `## Cha Chaan Teng` entry with a what-it-is paragraph, an
  argued combined-or-separate paragraph naming the Dim Sum Counter and the Takeout Counter, and
  a vocabulary table of at least **20** rows in the existing three-column shape. The contents
  table at the top of that file gains its row.
- Every vocabulary row's "Also called" column carries at least one non-English spelling and at
  least one alternative romanisation or English board-name.
- `docs/gaps/cha-chaan-teng.md` exists with a `## What it has` block in the machine-read shape, a
  ranked missing list of at least **20** dishes, a components section, and a
  what-a-table-cannot-hold section.
- The ranked list states, for each of the seven existing slugs above, either *shelve as is* or
  *write a new file*, with the reason.
- Sources are cited the way `docs/gaps/soup-pot.md` cites them — linked, and said what each one
  established.
- `node scripts/check-recipes.mjs` reports ok for the whole collection, unchanged.
- A `.cook` file naming `counters: Cha Chaan Teng` passes its check. Demonstrate it in the work
  artifact with a throwaway file; do not commit it.
- Only `src/data/counters.json`, `docs/knowledge/counters.md` and `docs/gaps/cha-chaan-teng.md`
  are modified.
