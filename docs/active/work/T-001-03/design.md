# T-001-03 — Design

Three decisions, each grounded in something Research found: where the noodle and salad
plates live, whether a curry pounds its own paste or consumes one, and how far down the
ranked list to go.

---

## Decision 1 — Two new folders: `noodles-and-stir-fries/` and `salads/`

**The problem.** Thirteen folders, and the four wok dishes at the top of the ranked list fit
none of them. Pad thai is not a stew, not a soup, not a bread and not a grain. Som tum is a
salad in a collection whose only salad-shaped file, `tabbouleh`, is filed under
`rice-beans-and-grains` because bulgur is a grain — an excuse a green papaya does not have.

**Options.**

| Option | What it does | Why not |
| --- | --- | --- |
| A. Wedge them into `rice-beans-and-grains` | No new folder; khao pad and pad krapow are rice plates | Pad thai is a noodle plate. The category prints on the page: "Pad Thai — Rice, Beans & Grains" is a lie a reader can see |
| B. Wedge the salads into `dressings-and-dips` | No new folder; som tum's dressing is the dish's engine | A dressing is a jar; som tum is a plate. Filing a main-course salad next to `mayonnaise` is the "recipe living outside the category tree" T-001-18 is chartered to find |
| C. Three folders — `noodles`, `stir-fries`, `salads` | Most precise | `stir-fries` would hold one file. Pad thai and pad see-ew are stir-fries *of* noodles; the line between the two folders would have to be redrawn by whoever writes lo mein |
| **D. Two folders — `noodles-and-stir-fries`, `salads`** | One home for everything cooked fast in a wok, one for the plates dressed cold | Chosen |

**Chosen: D.** The compound name matches the house pattern (`Rice, Beans & Grains`,
`Stews & Braises`, `Bars & Brownies`) and it is the shape the rest of the story needs:
Research found **six counters separately asking for a noodle dish** — ramen, lo mein, bún,
pad thai — and they will all want this folder. A folder holding one file, which is what C
gives, is a category invented for a single recipe.

`>> category: Noodles & Stir-Fries` and `>> category: Salads` are written into every file, so
the title-cased folder name (`Noodles And Stir Fries`) never reaches a page. Research
confirmed adding a folder is not a build event: nothing in `src/` reads a fixed list of
categories, and the `categories` fallback in `counters.json` only catches recipes that name
no counter — every file here names Thai Kitchen.

**Cost, stated plainly.** These two categories will be absent from `counters.json`'s fallback
lists until T-001-17 runs. That is harmless, because the fallback exists for recipes with no
`counters:` line and there are none here.

---

## Decision 2 — A curry consumes a paste that has its own table

**The problem, in the gap doc's own words:** *"the green curry is written and its paste is
not; the red paste is written and its curry is not."* Both precedents live on this counter
and they point opposite ways. `thai-green-curry.cook` pounds ten ingredients into a mortar in
step 1 and carries on; `thai-red-curry-paste.cook` is five steps of paste and stops.

**Options.**

| Option | Shape | Consequence |
| --- | --- | --- |
| A. Every curry pounds its own paste inline | 4 files, no new pastes | 15-row tables at best (the green curry is already at 15 of a 16-row ceiling), and the doc's four requested pastes stay unwritten. Two curries that share 80% of a paste would repeat it |
| B. Curries consume a paste; each paste is its own file | 8 files | Doubles the file count; a reader who wants dinner tonight has to open two pages |
| C. Split the difference — red and panang consume the written red paste, yellow and massaman pound inline | 6 files | The rule for which is which is not visible to a reader. Panang and massaman genuinely differ from red paste (peanut and roasted spice), so making them borrow it is a shortcut wearing the dish's name — the exact thing the acceptance criteria forbid |

**Chosen: B.** Four new paste files (green, yellow, panang, massaman) and four new curries
(red, yellow, panang, massaman) that name a paste as an ingredient.

Why it wins on the codebase's own terms:

1. **It closes the asymmetry rather than moving it.** After this ticket the counter holds
   five colours of paste and five colours of curry, and the "Curries by colour" section is
   complete. That is the section the reference says *is* the menu.
2. **Row budget.** A curry that starts from a spoon of paste is 8–11 rows and 4 operations —
   comfortably inside the 5–16 / 3–6 envelope. Pounding inline pushes panang (peanuts,
   roasted spices) past the ceiling.
3. **It is what the kitchen does.** A paste is made by the tub and kept; the gap doc calls
   the pastes *"one table that unlocks one printed line."*
4. **`pairs-with` is made mutual at build time**, so a new paste file may write
   `pairs-with: thai-green-curry` and the existing green curry gains the link **without being
   edited** — which matters, because Research established that the five existing Thai files
   belong to no ticket here.

**The duplication this accepts.** `thai-green-curry-paste.cook` repeats, as its own table,
what `thai-green-curry.cook` does in step 1. That is deliberate and is what the gap doc asks
for (*"on its own table it matches the red paste already here and closes the asymmetry"*),
but it is a judgement about two files, one of which this ticket may not touch — so it is
recorded for **T-001-18** in the work artifact rather than resolved here. The honest fix, if
a reviewer disagrees, is to shorten the existing green curry's step 1 to a spoon of paste,
and that is an edit to another ticket's file.

**Pad thai gets the same treatment.** `pad-thai-sauce.cook` is the component the gap doc
singles out — *"people search for pad thai and what they actually need is the ratio"* — so
the sauce is a jar with its own table and `pad-thai.cook` measures it in. This also keeps pad
thai's row count sane: the dish has fourteen things in it before the sauce is broken out.

**Where inline still wins.** Larb's toasted ground sticky rice (khao khua) is *one* step —
toast, pound — and it is useless outside larb. It stays as step 1 of `larb-gai.cook` rather
than becoming a two-line file. Cracked coconut cream, likewise, is the first operation of
every curry here and is written out once per curry in the step where it happens.

---

## Decision 3 — Sixteen new files, worked strictly down the ranked list

The bar is 16 recipes on the counter, 14 exclusive; the counter holds 5, so the floor is 11
new files. Working the ranked list in order, in whole items rather than half of one:

| Rank | Gap doc item | Files written |
| --- | --- | --- |
| 1 | Pad thai | `pad-thai`, `pad-thai-sauce` |
| 2 | Red curry | `thai-red-curry` |
| 3 | Yellow, panang, massaman | `thai-yellow-curry` + paste, `panang-curry` + paste, `massaman-curry` + paste |
| — | Components: green curry paste | `thai-green-curry-paste` |
| 4 | Tom yum | `tom-yum-goong` |
| 5 | Pad see-ew and pad kee mao | `pad-see-ew`, `pad-kee-mao` |
| 6 | Pad krapow | `pad-krapow` |
| 7 | Som tum | `som-tum` |
| 8 | Larb | `larb-gai` |

Sixteen new files; the counter finishes at **21 recipes, all 21 exclusive to it**, against a
bar of 16 and 14.

**Why stop at rank 8 rather than 11 or 13.** The count is reached at rank 3. Everything from
4 to 8 is written because each is a *section* the board prints and this page has empty: no
sour soup beside the creamy one, no wide-noodle pair, no lunch plate, no salads at all. Rank
9 (khao pad) is the first item whose section — Rice — already has something on it, so that is
the natural line.

**Named as skipped, with reasons** (acceptance criterion 2 requires this):

| Rank | Item | Why not here |
| --- | --- | --- |
| 8b | Yum nam tok | The gap doc itself says it is *"the same dressing on sliced grilled steak"*. Writing it beside `larb-gai` would put one dish on two tables, which is what T-001-18 exists to delete |
| 9 | Khao pad | Below the line. The Rice section is not empty — `coconut-rice` is on it |
| 10 | Curry puffs, tod mun pla, satay, fresh and fried spring rolls | Below the line: five files for one ranked item. **Chicken wings**, listed in the same item, is assigned to **Pizzeria** by the story's contention table and is not this ticket's to write |
| 11 | Khao soi | Below the line, and it needs **pickled mustard green**, which T-001-01's review flagged as wanted by two counters and owned by no ticket. Writing it here is the race the story exists to prevent |
| 12–21 | Rad naa, mango sticky rice, thai iced tea, kai jeow, yum woon sen, prik king, guay tiew nam, SF garlic noodles, woon gati, steamed sticky rice | Below the line |

**Components not written**, and why they were not silently absorbed: `nam prik pao`,
`nam jim gai`, peanut sauce, `prik nam pla`, `prik nam som`, fried shallots, garlic oil, palm
sugar syrup, pickled mustard green, crisp fried egg noodles. Each belongs to a dish below the
line — the caddy pots and the sweet chile sauce go with the appetiser list, the crisp noodles
and the mustard green with khao soi. `tom-yum-goong` is therefore written as **tom yum nam
sai**, the clear version, which is the one that answers the gap doc's *"clear fierce sour-hot
one with no coconut milk"* and needs no chile jam.

---

## What every new file will do, and why

Settled here so Structure can just list them:

- **Timers are named, always**, from `time.ts`'s recognised vocabularies —
  `~simmer{}`, `~soak{}`, `~toast{}`, `~fry{}`, `~stirfry{}`, `~steep{}`, `~rest{}`,
  `~drain{}`. Research showed an unrecognised name is worth no more than no name, so
  invented words like `~wok{}` are out. The three existing Thai files use bare `~{}`; they
  are not this ticket's to fix, and the new files do not copy them.
- **`aka` is generous and includes a no-diacritics form**, because the counters doc says the
  transliteration pair is one line on the board and *"neither half is optional"*. Every
  spelling in `docs/knowledge/counters.md` lines 465–497 goes in, plus the English gloss.
- **Spice is written at a real level with the dial named in prose**, not as a variant. The
  gap doc lists "Spicy level 1 to 5" under what a table cannot hold; a step that says "four
  chiles is a Thai two — the kitchen changes this number, not the dish" records the dial
  without pretending the table has one.
- **`makrut lime`** is the spelling used, matching `thai-red-curry-paste` and `tom-kha-gai`
  (two files to the green curry's one), with `kaffir lime` carried in `aka` where a searcher
  would type it.
- **Every file names `Thai Kitchen` and only that**, so all sixteen count toward the
  exclusive bar. None of these dishes is on another counter's ranked list.
- **No `dish`/`kit` lines.** Nothing here is an equipment variant of anything else, and a
  stray `dish:` would collide with the one-plain-way-per-dish rule.
- **`pairs-with` points only at slugs that exist**, verified before writing: the four existing
  Thai files plus the new ones. Written on one side only where both sides are new.

## What this design does not do

It does not touch `src/data/counters.json`, so **none of the sixteen appears in a menu
section until T-001-17 runs** — they will render on the counter page through the
category-less fallback path only after that ticket shelves them. Research confirmed this is
the story's designed order. It also does not touch the five existing Thai files, so the
duplication between the new green paste and the old green curry's step 1, and the bare timers
in those three older files, are handed to T-001-18 as notes rather than fixed.
