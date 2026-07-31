# T-003-01 — Structure

The blueprint. Four files touched, one file created and destroyed, nothing else.

---

## File-level change list

| File | Action | Owner | Committed |
| --- | --- | --- | --- |
| `src/data/counters.json` | modify — append three counter objects | this ticket | yes |
| `docs/gaps/soup-pot.md` | create | this ticket | yes |
| `docs/gaps/japanese-home.md` | create | this ticket | yes |
| `docs/gaps/slow-cooker.md` | create | this ticket | yes |
| `recipes/soups/<throwaway>.cook` | create, prove, delete | this ticket | **no** |

Nothing else. Specifically **not** touched: `docs/gaps/README.md`, `src/data/aisles.json`,
`docs/knowledge/counters.md`, any existing `.cook` file, any `src/lib/**`, any test.

---

## 1. `src/data/counters.json`

### Insertion point

Append three objects to the end of `counters[]`, after `One Pot`. The array order is the order the
front door renders in, and the existing order is chronological by story — S-001's fifteen, then
S-002's three. S-003's three continue it. Ticket order is kept inside the group: The Soup Pot,
Japanese Home Cooking, The Slow Cooker.

The `//` comment at the top of the file is not edited. It already describes what a counter is and
explicitly covers the case these three are in: *"Counters with no fallback are filled in by hand;
a counter with nothing on it simply does not render."*

### Key order inside each object

`name`, `slug`, `blurb`, `categories`, `sections` — matching all nineteen existing entries.
Each section is `{ "title": …, "items": [] }`.

### The three objects, exactly

```
The Soup Pot / soup-pot
  blurb:      Put it on, leave it alone for three hours, and it gets better.
  categories: []
  sections:   Old-fire soups (老火湯)
              Quick daily soups (滾湯)
              What each thing is for
              Congee and rice soups
              Also here

Japanese Home Cooking / japanese-home
  blurb:      Small dishes, made once, that add up to dinner all week.
  categories: []
  sections:   The soup and the rice
              Simmered things (煮物)
              Grilled and pan-fried mains
              Small sides (小鉢)
              Made ahead (作り置き)
              Rice bowls and one-plate suppers
              Also here

The Slow Cooker / slow-cooker
  blurb:      Fill it before you leave; dinner is waiting when you get back.
  categories: []
  sections:   Braises, left alone all day
              Beans and pulses
              Stocks
              Whole birds and big cuts
              Also here
```

Eighteen sections, all with `items: []`.

### Invariants to hold

- The file parses. Checked with `node -e "require('./src/data/counters.json')"`.
- Counter count goes **19 → 22**; three more than T-002-01 left it with.
- No section title contains ` — `, and none ends in `.` (`menu-sections.mjs:55`).
- Slugs are unique across all 22, and none collides with an existing recipe slug pattern.
- Indentation is two spaces, matching the file; the JSON is written by editing the text, not by
  `JSON.parse` → `JSON.stringify`, so the other nineteen entries stay byte-identical.

### What this changes downstream, and what it does not

`check-recipes.mjs:22-26` and `parse-recipes.mjs` both build their known-counter set from this
file, so the only effect on the existing collection is that three more names become legal.
No recipe names them yet, so `menuFor()` resolves zero items for every new section, every section
is dropped, all three counters report `count === 0`, and no page is generated. The whole-collection
check must therefore be **unchanged** — same ok lines, same total.

---

## 2. `recipes/soups/<throwaway>.cook` — the proof, then gone

Filename: `zzz-counter-name-proof.cook`, chosen so it cannot collide with a real slug and sorts
last if anyone lists the folder mid-run.

It must be a genuine table, because `check-recipes.mjs` will otherwise fail it for the wrong
reason. Minimum shape, from the checker's own gates:

- `>> title:`, `>> category:`, `>> tags:`, `>> servings:` — all four required (line 18).
- `>> counters:` naming the counter under test.
- ≥3 ingredient rows (line 70) and ≥3 operations (line 71).
- Every operation cell derives a non-empty label (lines 73–79).

Run three times, once per counter name, plus one negative control with a misspelled name to show
the checker is actually reading the file. Output pasted into `progress.md`. Then:

```
rm recipes/soups/zzz-counter-name-proof.cook
git status --porcelain          # must show no recipes/ entry
```

Deletion is verified before the gap files are written, not after, so a forgotten file cannot ride
along in a later commit.

---

## 3. The three gap documents

All three take the S-002 shape (`instant-pot.md`, `one-pot.md`, `bowl-shop.md`), with the
inherited "T-002-08 renames this heading" sentence corrected to **T-003-06**.

### Common skeleton

```
# <Counter> — what is missing

<bold state line: 0 recipes, opened by T-003-01>  +  the thesis paragraph:
what this shelf is, and what makes its list different from a shop's.

---

## What is already here
<the heading-is-not-"What it has"-yet paragraph, naming T-003-06>
**Section title.** slug · slug · slug        ← one line per counter section

---

## What it is missing
<ranked; the shape differs per file — see below>

---

## Components it would need
<shared things more than one dish waits on>

---

## What it could not stock
<what a single table genuinely cannot hold>

---

## Where this came from
<sources, named, with what each was used for>
```

The `**Section title.** slug · slug` shape is kept even though nothing parses it yet, exactly as
the three S-002 files did, so T-003-06's edit is a heading rename and nothing else.

### 3a. `docs/gaps/soup-pot.md`

Blocks, in order:

1. **State line.** 0 recipes; 44 files in `recipes/soups/` and not one 老火湯; no dried Chinese
   soup ingredient anywhere in the collection.
2. **What is already here.** Grouped under the five counter sections. Real slugs only —
   `congee`, `congee-instant-pot` under *Congee and rice soups*; `egg-drop-soup` under *Quick
   daily soups*; `wonton-soup`, `hot-and-sour-soup`, `chicken-feet` under *Also here*, each with
   a clause saying it is a Takeout-Counter or Dim-Sum item borrowed here rather than a Cantonese
   home soup. *Old-fire soups* is listed as **empty, and that is the finding.**
3. **What each thing is for — the glossary.** The recurring dried goods, one line each: what it
   is, what it is understood to do, what it is standardly paired with. Written as the tradition's
   reasoning, never as a health claim (D2.3). This is the block T-003-03 cannot derive.
4. **The seasonal frame.** Four lines, spring through winter, in the tradition's own terms.
5. **Four rules of the genre**, because they are the method and a writer will otherwise treat
   them as flavour text: the pot is not stirred; the solids are spent and the broth is the dish;
   the meat is blanched first (汆水) and why; 老火湯 vs 滾湯 vs 燉湯.
6. **What it is missing — ranked, in two blocks.** 老火湯 ranked 1–16, 滾湯 ranked 1–8, with the
   one-sentence reading order from D2.2 immediately above them. Each entry: the name in
   characters, a romanisation, the plain-keyboard spelling, the pairing, and one clause of what
   the pairing is *for*.
7. **Components it would need.** The blanch step, the 湯料 bundle question, whether a stock is
   ever used (it is not — the answer is water, and saying so is the point).
8. **What it could not stock.**
9. **Where this came from.**

Length: this is the longest of the three. ~200 lines is the target; the glossary earns its space.

### 3b. `docs/gaps/japanese-home.md`

1. **State line.** 0 recipes; 31 Japanese files on the site, 29 of them shelved at the Ramen Shop
   or the Bakery, and no plain rice recipe anywhere.
2. **What is already here**, grouped under the seven counter sections — but this file's version of
   the block carries the criterion's split. Three buckets, by slug:
   - **Shelve this** — the foundations that belong here without being rewritten.
   - **Both boards** — cooked at home constantly *and* sold; they gain a second shelf.
   - **This is restaurant food, leave it** — the ramen system and the izakaya plates.
   Each bucket states the test from D2.5 once, then lists slugs.
3. **What it is missing — ranked**, grouped by counter section so T-003-04's "≥3 per section, ≥5
   in 煮物 and 小鉢" is countable from the page rather than derived.
4. **The system, in one block.** 一汁三菜 as a composition rule; 作り置き as the Sunday batch;
   what that means for how small a recipe is allowed to be.
5. **The ratios.** The 黄金比 numbers, with the source, and the instruction to state them as real
   quantities.
6. **Components it would need.** Plain rice; the pantry (mirin, sake, usukuchi, dashi already
   exists); the awase-dashi question.
7. **What it could not stock.**
8. **Where this came from.**

### 3c. `docs/gaps/slow-cooker.md`

1. **State line.** 0 recipes; the sibling `instant-pot.md` ranked the same population; 25 Instant
   Pot variants already exist, named.
2. **What is already here**, grouped under the four content sections, listing the plain recipes
   that are candidates. Explicit note that **this shelf shelves only `kit: Slow Cooker`**, unlike
   the other two — so this block is a candidate list, not a borrowing list, and T-003-06 must not
   shelve any of it.
3. **The twelve that pay for the appliance** — short prose entries, mirroring `instant-pot.md`.
4. **The full candidate table** — ≥20 rows, every row `dish · slug · IP? · more/less/differently ·
   why`. This is the criterion's evidence and it has to be countable.
5. **Where the machine helps less than pressure**, called out separately: stocks, dried beans,
   anything judged by looking, anything whose point is a reduction.
6. **Components it would need**, including the three method facts from T-003-05's own ticket
   (nothing evaporates, browning is a pan, dairy/herbs/seafood go in last) and the dried-kidney-
   bean hazard from Research §7.
7. **What it could not stock.**
8. **Where this came from.**

---

## Ordering of changes

1. `src/data/counters.json` — the riskiest edit, done first and verified with the JSON parse and
   the whole-collection check.
2. Proof `.cook` — written, run, output captured, deleted, deletion verified.
3. `docs/gaps/slow-cooker.md` — first of the three because it is grounded entirely in measured
   data from `recipes.json` and the sibling file, so it validates the shape cheaply.
4. `docs/gaps/japanese-home.md`.
5. `docs/gaps/soup-pot.md` — last and longest.

Commits through `lisa commit-ticket`, exact `--include` paths only. Two units:

- **Unit 1** — `src/data/counters.json`.
- **Unit 2** — the three `docs/gaps/*.md` files.

Splitting the gap files across three commits would be three commits of a single document set with
no independent verification between them; splitting the JSON out is worth it because it is the
one change with a machine check attached.

---

## Verification gates

| Gate | Command | Expected |
| --- | --- | --- |
| JSON parses | `node -e "require('./src/data/counters.json')"` | silent |
| Counter count | `node -e "…counters.length"` | 22 |
| Collection unchanged | `node scripts/check-recipes.mjs` | `all 553 file(s) draw a table.` |
| Counter name accepted | `node scripts/check-recipes.mjs recipes/soups/zzz-counter-name-proof.cook` | `ok` for each of the three names |
| Negative control | same, with a misspelled counter | `FAIL … unknown counter` |
| Nothing left behind | `git status --porcelain` | no `recipes/` entry |
| Scope | `git status --porcelain` | only `src/data/counters.json` and `docs/gaps/*.md` |
