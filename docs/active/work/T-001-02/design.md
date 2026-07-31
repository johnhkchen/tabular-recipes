# T-001-02 — Design

Six decisions, each grounded in `research.md`: how many files, which dishes, how phở splits,
whether the sandwich gets written at all, where the files live, and what the metadata carries.

---

## D1. How many new files

The counter starts at **4 on the counter, 2 exclusive**. The bar is **16 / 12**. Every new
file will be exclusive to this counter (nothing here is sold anywhere else on the site), so
`n` new files gives `4 + n` total and `2 + n` exclusive. Exclusivity binds first: `n ≥ 10`
clears 12 exclusive, `n ≥ 12` clears 16 total.

| Option | New files | Total / exclusive | Verdict |
| --- | --: | --- | --- |
| A. The arithmetic minimum | 12 | 16 / 14 | rejected |
| B. **Minimum plus slack** | **14** | **18 / 16** | **chosen** |
| C. Down to bún bò Huế | 18 | 22 / 20 | rejected |

**A** is rejected because it has no slack: one file that turns out not to draw a table, or one
dish that on writing proves to be the same dish as another under a second name, drops the
ticket below the bar and there is no way to notice that until the end.

**C** is rejected on quality per file. Ranked items 13–22 (nem nướng, bì, chả cá, chả bông, bò
kho, bún bò Huế, pâté chaud, bánh mì ốp la, chè ba màu, thịt nguội/giò thủ) are real dishes,
but the criterion "the method is the canonical one for the dish rather than a shortcut wearing
its name" is the expensive part, and the ranked list is ranked for a reason — the return on
the eighteenth file is much lower than on the fourth. T-001-18 rewrites `docs/gaps/` so the
next pass starts where this one stops; that is the mechanism for the tail, not this ticket.

**B** it is: 14 files, reaching ranked item **#12 (xíu mại)** plus **#23 (bánh mì không)**
pulled forward as a dependency.

---

## D2. Which dishes, in the doc's order

The criterion is "the dishes at the top … are written, in that order, as far as the count
reaches". Working down `docs/gaps/pho-and-banh-mi.md`:

| # | Gap item | Decision | Slug(s) |
| --: | --- | --- | --- |
| 1 | Bánh mì đặc biệt | write, as an assembly (D4) | `banh-mi-dac-biet` |
| 2 | Pâté | **already written** — `pork-liver-pate`, already counters here | — |
| 3 | Đồ chua | **already written** — `do-chua`, exclusive here | — |
| 4 | Phở bò | write, split (D3) | `pho-broth`, `pho-bo` |
| 4 | Phở gà | write, one table (D3) | `pho-ga` |
| 5 | Chả lụa | write, with the caveat the doc asks for | `cha-lua` |
| 6 | Bánh mì thịt nướng | write | `banh-mi-thit-nuong` |
| 7 | Bún thịt nướng | write | `bun-thit-nuong` |
| 8 | Nước chấm | write | `nuoc-cham` |
| 9 | Chả giò | write | `cha-gio` |
| 9 | Gỏi cuốn | write | `goi-cuon` |
| 10 | Cơm tấm | write | `com-tam` |
| 11 | Cà phê sữa đá | write | `ca-phe-sua-da` |
| 12 | Xíu mại | write | `xiu-mai` |
| 23 | Bánh mì không | write, **pulled forward** | `banh-mi-khong` |

**Why #23 is pulled out of order.** It is ranked last as a *menu item* — the roll sold on its
own — but the doc's own component list opens with it and calls it "the component everything
else needs", and its entry says it "is the item that tells you the shop bakes". Item #1 cannot
be written honestly without it: a bánh mì on a French `baguette` is, in the doc's words, "a bad
bánh mì and that is the whole point of writing this one separately". Writing #1 while pointing
it at the wrong bread would satisfy the count and fail the point.

**Not written this pass** (named here as the criterion requires): #13 nem nướng, #14 bì, #15
chả cá, #16 chả bông, #17 bò kho, #18 bún bò Huế, #19 pâté chaud, #20 bánh mì ốp la, #21 chè ba
màu, #22 thịt nguội / giò thủ. Reason for all ten: the count reached #12, and the ranked list
is worked in order. Two of them are worth a note for whoever picks up the tail — bì needs
thính (toasted rice powder) which is a component in its own right, and giò thủ is the one the
doc calls "exactly the kind of thing this site exists to record", so it is the first thing the
next pass should write.

---

## D3. Phở: three files, not one and not four

The gap doc's "could not stock" says plainly: *"Broth and bowl never merge in the kitchen —
they merge at the pass. Two recipes: the broth, and the bowl that consumes it."*

| Option | Shape | Verdict |
| --- | --- | --- |
| A. One `pho-bo` table | 8 hr broth and 30 sec noodles in one tree | rejected |
| B. **`pho-broth` + `pho-bo` + `pho-ga`** | broth, beef bowl, chicken one-pot | **chosen** |
| C. Four files (a `pho-ga-broth` too) | symmetric split | rejected |

**A** is rejected on the doc's reasoning and on the format's: a single table would put a
`~simmer{6%hr}` and a `~boil{30%sec}` in the same operation row, and the schedule under the
table would read as one 6-hour job when the bowl is a two-minute one.

**C** is rejected because the symmetry is false. Phở bò is built on beef bones that are
parboiled, charred-aromatic, and simmered for hours with no edible yield of their own — the
broth is a standalone product. Phở gà is built on **one bird that is both the broth and the
meat**: you poach it, lift it out, shred it, and the pot you poached it in is the soup. There
is no kitchen moment at which a phở gà broth exists separately from the chicken going in the
bowl, so splitting it would invent a step. It is written as one table, and the file says so.

`pho-bo` consumes `pho-broth` as a named ingredient and pairs to it, which is the "pairs-with
web" the doc describes. The beef-cut ladder (tái, chín, nạm, gầu, gân, sách, bò viên) stays out
of the rows — the doc calls it a topping list — and lands in `aka` and in one line of prose.

---

## D4. The sandwich: written, as an assembly

This is the ticket's one genuinely contested call, because bánh mì đặc biệt appears in **both**
lists in the gap doc — ranked **#1** in "what it is missing", and twice in "what it could not
stock" ("The sandwich, honestly" and "Đặc Biệt").

| Option | Verdict |
| --- | --- |
| A. Skip both bánh mì; treat "could not stock" as binding | rejected |
| B. **Write `banh-mi-dac-biet` as a short assembly + `banh-mi-thit-nuong` as a full recipe** | **chosen** |
| C. Write one generic `banh-mi` | rejected |

**A** is rejected because the "could not stock" entry does not refuse the sandwich — it refuses
one *shape* of it and then names the shape that works: *"The right shape is a short assembly
recipe that names its components and pairs to them, with the components written properly."*
That is a design instruction, and this ticket is the one that can carry it out, because the
components (pâté, đồ chua, the bread, chả lụa) are either already written or written here.
Skipping the item the doc calls "the single most conspicuous absence on the entire site" while
writing item #12 would be a strange reading of a ranked list.

The separate "Đặc Biệt" entry — *"'all of them at once' is a rule applied to whatever the shop
has that day … Not a dish"* — is about the **rule**, and it is answered inside the file rather
than by silence: `banh-mi-dac-biet` names a fixed, canonical cold-cut set (pâté, chả lụa, and a
sliced pork cold cut) and says in prose that the set is whatever the shop's case holds that
morning. The recipe records one shop's đặc biệt, which is what a recipe can do.

**C** is rejected because "đặc biệt" and "thịt nướng" are two printed menu items ordered by
two different names, and `aka` search is the whole reason the site exists. One file would make
one of them unfindable.

The two sandwiches differ in kind, which is why they are not one file with a variant: `thịt
nướng` has a real cooking process in front of the assembly (marinate, grill), so it is a normal
recipe that ends in a sandwich. `đặc biệt` has no cooking at all — three operations, spread,
layer, close — so it is the short assembly the doc describes, and every leaf that is a
component is `pairs-with`-linked to its own table.

Both clear the checker's floor (≥ 3 ingredient rows, ≥ 3 columns) comfortably: the assembly has
nine leaves and three operations, which is 9 rows × 4 columns.

---

## D5. Where the files live

Category comes from the folder. `find-recipes.mjs` walks `recipes/` recursively, so a new
folder needs no registration; the only consequence is that no counter claims it as a category
fallback, and every file here names its counter explicitly.

**Existing folders, on precedent:**

| Slug | Folder | Precedent |
| --- | --- | --- |
| `banh-mi-khong` | `breads` | `baguette`, `pita-bread` |
| `nuoc-cham` | `dressings-and-dips` | `do-chua`, `nuoc-cham` is a dressing by any reading |
| `pho-broth`, `pho-bo`, `pho-ga` | `soups` | `chicken-noodle-soup` — a noodle soup is a soup |
| `bun-thit-nuong`, `com-tam` | `rice-beans-and-grains` | `mexican-red-rice`; rice vermicelli is rice |
| `cha-lua`, `xiu-mai` | `stews-and-braises` | `char-siu` (an oven roast) already lives there |

**Two new folders:**

- **`recipes/sandwiches-and-rolls/`** → `banh-mi-dac-biet`, `banh-mi-thit-nuong`, `cha-gio`,
  `goi-cuon`. Nothing in 254 recipes is an assembled handheld. The alternative — filing a
  sandwich under `breads` and a fried roll under `flatbreads-and-pancakes` — would put the
  dish under its wrapper, which is the mistake `pork-liver-pate`-in-`dressings-and-dips`
  narrowly avoids by being genuinely a spread. Four files justify the folder on their own.
- **`recipes/drinks/`** → `ca-phe-sua-da`. One file is thin for a folder, but the gap doc's
  point is exactly that: *"There is no drink recipe anywhere on the site."* A drink is not a
  custard, a dressing or a soup, and the next counter ticket that writes horchata, Thai iced
  tea or an egg cream has somewhere to put it.

**The weakest placement, flagged honestly:** `cha-lua` in `stews-and-braises`. It is poached,
not braised. The folder is already the collection's de-facto meat drawer (`char-siu` is a
roast), and the alternative was a third new folder holding one file. Recorded for T-001-18,
which reads the whole shelf and can move it next to `pork-liver-pate` if a charcuterie
category emerges.

---

## D6. Metadata policy

Applied uniformly to all fourteen files.

- **`counters:`** — `Phở & Bánh Mì` alone on every file. None of these is sold at another
  counter on this site; a `char-siu`-style multi-counter line would cost exclusivity, which is
  the binding criterion.
- **`aka:`** — every file carries, at minimum: the diacritic form, **a form typed without
  diacritics** (the criterion names this explicitly), and the English words a searcher would
  actually use. Where the doc records a board code or a number — "customers say 'number 23'",
  the P / A / B / C / S codes — that goes in `aka` too, because the doc says outright that the
  numbering "belongs in `aka` and cannot be a recipe".
- **`pairs-with:`** — used to build the web the doc describes. Mutual at build time, so it is
  written on one side only, and always the side this ticket owns. Every target must exist at
  parse time; targets outside this ticket (`pork-liver-pate`, `do-chua`, `mayonnaise`,
  `banh-xeo`, `char-siu`) already do.
- **`servings:`** and **`time:`** — real numbers for the quantities written. `time:` is the
  author's claim and is cross-checked against the derived critical path by
  `schedule.test.ts`, so it is the sum of the named timers plus honest handling, not a round
  number.
- **Timers** — every one named, no exceptions, per the criterion. Names are chosen from the
  vocabulary `src/lib/time.ts` already classifies (`~simmer`, `~soak`, `~marinate`, `~chill`,
  `~grill`, `~fry`, `~steep`, `~poach`, `~rest`) so the schedule under the table reads the
  wait correctly rather than defaulting to "you are standing there".
- **`dish:` / `kit:`** — not used. No dish here has an equipment variant written, and the
  README is explicit that a `kit:` line means *a variant exists*, never *this would adapt*.
- **Step labels** — set with `>> step.N:` wherever the derived label would come out as a
  sentence fragment, checked against `--labels` output before each commit.

---

## What this does not do

- Does not touch `src/data/counters.json`. The new files will name the counter and render, but
  the menu sections ("Phở (P)", "Bún (B)", "Cơm (C)", "Bánh mì (S)", the drinks case) are
  T-001-17's to print.
- Does not touch `src/data/aisles.json`. Vietnamese ingredients with no aisle pattern (rice
  paper, bánh phở noodles, rock sugar, condensed milk) fall to the `other` aisle and eat into
  `shopping.test.ts`'s 2% budget. That is measured in Implement and reported, not fixed.
- Does not edit `mayonnaise`. `banh-mi-dac-biet` pairs to it and says in prose how the
  sandwich's mayonnaise differs, which is what the gap doc asks for. Whether `mayonnaise`
  should also name this counter is recorded as a hand-off to T-001-18.
- Does not rewrite `docs/gaps/`. That is T-001-18's acceptance criterion.
