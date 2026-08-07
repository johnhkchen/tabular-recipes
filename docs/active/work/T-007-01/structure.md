# T-007-01 — Structure

The blueprint. Three files touched, one created, none deleted. No source code changes.

---

## Files

| Path | Action | Owner |
| --- | --- | --- |
| `src/data/counters.json` | modify — one array entry appended | T-007-01, then T-007-02 |
| `docs/knowledge/counters.md` | modify — one Contents row, one `##` section | T-007-01 |
| `docs/gaps/cha-chaan-teng.md` | **create** | T-007-01 |

Nothing else. In particular: no `.cook` file, no `src/data/aisles.json`, no `docs/gaps/README.md`,
no `docs/gaps/soup-pot.md`, no `src/` TypeScript, no test file.

---

## 1. `src/data/counters.json`

**Where.** Appended as the **last** element of the `counters` array, after `slow-cooker`. The array
is in the order counters were added, not alphabetical or by size — `menus()` re-sorts by recipe count
at render time — so appending is the shape-preserving edit and leaves the smallest possible diff for
T-007-02 to rebase onto.

**What.** One object, exactly the five keys every other entry carries:

```jsonc
{
  "name": "Cha Chaan Teng",
  "slug": "cha-chaan-teng",
  "blurb": "Pick a set by the time of day; the milk tea comes with it.",
  "categories": [],
  "sections": [
    { "title": "The set meals (常餐 · 早餐 · 下午茶餐)", "items": [] },
    { "title": "The drinks counter",                    "items": [] },
    { "title": "Toast and the bun case",                "items": [] },
    { "title": "Macaroni, noodles and things in soup",  "items": [] },
    { "title": "Rice plates",                           "items": [] },
    { "title": "Sandwiches and buns",                   "items": [] },
    { "title": "Also here",                             "items": [] }
  ]
}
```

**Interface contract this must satisfy** (`src/lib/counters.ts:9-21`): `name: string`,
`slug: string`, `blurb: string`, `categories: string[]`, `sections?: {title, items}[]`. `notes` is
optional and is not used.

**Invariants to hold:**

- `name` is the string `.cook` files will write after `>> counters:`. It is validated in two places
  (`check-recipes.mjs:27`, `parse-recipes.mjs:22`), so it must match byte for byte in both the
  demonstration file and, later, in every writer ticket's files.
- `categories: []`. Non-negotiable per the ticket: `Sandwiches & Rolls` and `Drinks` would pull the
  Deli and the drinks shelf onto this board through the fallback at `parse-recipes.mjs:72`.
- `items: []` everywhere. T-007-05 fills them.
- **The Soup Pot entry is not touched.** Verified by diffing the file after the edit and asserting
  the only changed hunk is the appended object.
- The file must stay `JSON.stringify(file, null, 2)` + trailing newline — that is the shape
  `menu-sections.mjs --write` produces, and a hand-edit in a different style would show up as noise
  the next time anyone runs it. Two-space indent, no trailing commas.

**Ordering within the sections array** is the menu order and is load-bearing: `menuFor()` renders
sections in array order (`counters.ts:78`). Sets first, drinks second — decided in `design.md` §D2.

---

## 2. `docs/knowledge/counters.md`

Two separate edits.

### 2a. The Contents table

One row appended to the table at lines 28-45, after the `Meat and Three` row (the table is in the
same order as the file's `##` sections, and the new section is appended at the end of the file):

```
| [Cha Chaan Teng](#cha-chaan-teng) | Hong Kong tea café: Western food re-made in Hong Kong, sold as a timed set | Separate: never the same board as the dim sum trolley or the numbered takeout menu |
```

Anchor check: GitHub-flavoured anchors lowercase the heading and hyphenate spaces, so
`## Cha Chaan Teng` → `#cha-chaan-teng`. Matches the pattern of every other row.

### 2b. The `## Cha Chaan Teng` section

Appended at the **end of the file**, after the last existing section, preceded by the `---` rule the
file uses between sections. Internal shape, matching all fifteen existing entries:

1. `## Cha Chaan Teng`
2. **What it is.** — one paragraph. Must contain: the set-meal grid named in Chinese, the fact that
   the drink is in the price, the trading-day split, and what the kitchen is (griddle + fryer +
   toaster + pasta pot + tea urn). Boards cited inline by city, the way the Panadería and Phở
   entries cite theirs ("two independent passes found…", "of seven bánh mì boards read, five…").
3. **Separate, and argued.** — one or two paragraphs naming **the Dim Sum Counter** and **the
   Takeout Counter** by their markdown anchors, with the evidence table's content stated as prose,
   plus the named overlaps (蛋撻, 菠蘿包, 乾炒牛河, 叉燒) and the 冰室 fold-in.
4. A vocabulary table, `| On the menu | Also called | Plainly |`, **≥ 20 rows**.

**Per-row contract** (this is the acceptance criterion most easily failed): every row's *Also
called* cell carries **at least one non-English spelling** (Chinese characters count) **and at least
one alternative romanisation or English board-name**. A row like `| Yuenyeung | 鴛鴦 | … |` fails —
it has the characters but no second romanisation. `| Yuenyeung | yuen yeung, yuanyang, 鴛鴦, coffee
with tea, Coffee & Tea | … |` passes.

The table's row set is planned as: the four set meals (4 rows, since 早餐/常餐/快餐/下午茶餐 are the
counter's own vocabulary and *are* menu words), the drinks (奶茶, 鴛鴦, 凍檸茶, 好立克/阿華田, 紅豆冰,
茶走), the toast and buns (西多士, 菠蘿油, 豬仔包/餐蛋治), the soup-and-noodle line (火腿通粉, 公仔麵,
沙嗲牛肉麵, 羅宋湯), the rice plates (焗豬扒飯, 咖喱牛腩飯, 免治牛肉飯, 揚州炒飯 or 星洲炒米), the
sandwich block (公司三文治, 蛋治/牛治), plus 瑞士雞翼 and the ordering slang row. That is **≥ 24
candidates for 20+ rows** — room to drop any row whose *Also called* cell cannot be filled honestly.

**Style rules inherited from the file**, and they are strict:

- The *Plainly* cell says what the thing is in plain words and, where a name misleads, says what it
  is **not** — the file does this eleven times already (*"No pineapple in it."*, *"there is no fish
  in it"*, *"Not the crisp pan-fried noodle dish the name means elsewhere."*). 西多士 and 羅宋湯 both
  need that sentence.
- No em-dash-led asides that turn a *Plainly* cell into two sentences of opinion.
- No "authentic", no "iconic", no "nostalgic".

---

## 3. `docs/gaps/cha-chaan-teng.md` (new)

Section order copied from `pho-and-banh-mi.md` and `dim-sum-counter.md`, with `soup-pot.md`'s
sources block appended:

```
# Cha Chaan Teng — what is missing
  <bold header line: the state of the shelf, i.e. zero recipes and why>
  <2-3 paragraphs: the ranking rule, and the register warning>
---
## What it has
  <prose, BEFORE the first ** — says the block is empty on purpose and how it gets filled>
  **The set meals (常餐 · 早餐 · 下午茶餐).**
  **The drinks counter.**
  **Toast and the bun case.**
  **Macaroni, noodles and things in soup.**
  **Rice plates.**
  **Sandwiches and buns.**
  **Also here.**
---
## What it is missing
  1..20+ ranked, cookable-tonight first
---
## What this board borrows, and what it must not
  the seven slugs, one verdict each
---
## Components it would need
---
## What a table cannot hold
---
## Sources
```

**Hard constraints on the `## What it has` block**, from `scripts/menu-sections.mjs`:

| Rule | Why |
| --- | --- |
| Prose goes **before** the first `**` line | a chunk not starting with `**` is skipped; a chunk after a heading is scanned for slugs |
| Heading titles match `counters.json` titles **exactly** | so the two files can never drift, and so a later `--write` is a no-op rather than a rename |
| No ` — ` inside a title | the parser truncates a title at ` — ` |
| Nothing after the closing `**` on a heading line | anything there is parsed as an item |
| No hyphenated real slug anywhere in the block | it would be picked up and reported as `listed but not shelved here` |

**The ranked list.** ≥ 20 entries, numbered, ranked by *cookable tonight* (design §D6). Each entry
is a bold dish name with its Chinese, then a sentence of what it is and what it needs. Entries that
reference a component say which. Ranks 1-8 should need a saucepan, a frying pan or a toaster; a wok,
a deep-fryer or a specialist ingredient pushes an entry down.

**The seven-slug section** is its own `##` heading rather than being folded into the ranked list,
because it answers a different question (*what do we already have*) and because the acceptance
criterion checks for a verdict on each of the seven. Presented as a table: `Slug | Verdict | Why`,
with the two *write a new file* rows also saying **what the new file must say it is not**.

**The sources block** follows `soup-pot.md`'s form exactly: bulleted, each bullet a bold subject,
then a linked source, then a clause saying what that source established. Ends with a cautions
paragraph addressed to T-007-03/04 — Cantonese romanisations are unverified, tea numbers disagree
between shops, and a rank should be dropped rather than filled with something plausible.

---

## Ordering of the changes

The three edits are independent of one another, but the verification is not, so:

1. `src/data/counters.json` first — because it is the only file that can break a build, and
   `node scripts/check-recipes.mjs` plus the demonstration `.cook` file can only be run once the
   counter name exists.
2. `docs/knowledge/counters.md` second — the gap page's vocabulary is supposed to come *from* it
   (`docs/gaps/README.md`: *"The vocabulary throughout comes from `docs/knowledge/counters.md`"*),
   so writing the knowledge file first keeps the dish names in the gap page derived rather than
   invented twice.
3. `docs/gaps/cha-chaan-teng.md` third.

Each is a separate `lisa commit-ticket` with an exact `--include`.

---

## Verification surface

| Check | Command | Expected |
| --- | --- | --- |
| JSON parses, entry present, Soup Pot intact | `node -e` assertion script | 22 counters, `cha-chaan-teng` last, `soup-pot` deep-equal to its pre-edit value |
| Whole collection unchanged | `node scripts/check-recipes.mjs` | `all 658 file(s) draw a table.`, exit 0 |
| A file naming the counter passes | throwaway `.cook`, then `node scripts/check-recipes.mjs <path>` | `ok`, then the file is deleted |
| Gap page parses as a menu | `node scripts/menu-sections.mjs` (dry run) | Cha Chaan Teng reports `0 sections, 0/0 placed`; **no** `listed but not shelved here`, **no** `unparsed` |
| Nothing else moved | `git status --porcelain` | only the three owned paths |
| Full build still green | `npm run verify` | check + parse + 825 tests + astro build |
