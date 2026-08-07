# T-008-02 — Structure

Three files change. Nothing is created outside `docs/gaps/`, nothing is deleted, no code moves.

| File | Change | Owned by this ticket |
| --- | --- | --- |
| `src/data/counters.json` | one counter appended | yes |
| `docs/knowledge/counters.md` | one Contents row + one entry | yes |
| `docs/gaps/air-fryer-and-pot.md` | created | yes |

Plus one file written and deleted inside the attempt directory and never committed:
a throwaway `.cook` demonstrating that `counters: The Air Fryer & the Pot` and `kit: Air Fryer`
pass their checks.

---

## 1. `src/data/counters.json`

**Appended as the twenty-second entry**, after Cha Chaan Teng, inside the `counters` array. Nothing
above it is touched — no reordering, no reflow, no key changes anywhere else in the file. The
file's leading `"//"` comment is unchanged.

```jsonc
{
  "name": "The Air Fryer & the Pot",
  "slug": "air-fryer-and-pot",
  "blurb": "Plug one in, eat, and wash two things.",
  "categories": [],
  "sections": [
    { "title": "Straight out of the basket", "items": [], "notes": [ { "note": "<the gate, 107 chars>" } ] },
    { "title": "Start to finish in the pot", "items": [] },
    { "title": "Sheet-pan-shaped, in the basket", "items": [] },
    { "title": "Vegetables that go crisp", "items": [] },
    { "title": "Frozen things, done properly", "items": [] }
  ]
}
```

**Key order matches every other entry**: `name`, `slug`, `blurb`, `categories`, `sections`; inside
a section, `title`, `items`, then optional `notes`. Two-space indentation, the file's own style.

**Constraints this shape satisfies, each with the code that enforces it:**

| Constraint | Enforced at |
| --- | --- |
| `notes` is a list of `{ of?, note }` | `scripts/parse-recipes.mjs:118` |
| a note has non-empty text | `:123` |
| a note is ≤ 120 characters | `:101`, `:130` |
| a note with no `of` is about the section and is legal | `:138` |
| `counters` a recipe names must exist here | `src/lib/collection.test.ts:29` |
| empty counter generates no page | `src/pages/menu/[counter].astro:16` |
| `categories: []` is the majority shape | 13 of 21 existing entries |

**Why `notes` on the first section rather than a sixth key.** There is no sixth key. The Counter
interface in `src/lib/counters.ts:9` is `name`/`slug`/`blurb`/`categories`/`sections?`, and adding a
field would be a schema change this ticket does not own and no page would render.

## 2. `docs/knowledge/counters.md`

Two edits, both additive.

**2a. One row appended to the Contents table** (currently 16 rows, ending at Cha Chaan Teng, around
line 45). Three cells, matching the column contract:

- `Counter` → `[The Air Fryer & the Pot](#the-air-fryer--the-pot)`. **The anchor drops the
  ampersand and leaves the double hyphen**, the same way `[Phở & Bánh Mì](#pho--banh-mi)` already
  does on line 35. That existing row is the precedent and the reason the anchor is not guessed.
- `What it is` → one clause naming both machines and the gate.
- `Combined or separate` → `Separate:` plus the reason, in the clause style the other fifteen use.

**2b. One entry appended**, after `## Cha Chaan Teng` and before `## Sources`, preceded by the `---`
separator every entry is preceded by. The file's order is `...Meat and Three`, `Cha Chaan Teng`,
`Sources`, `What could not be verified`; the new entry goes at line ~877, immediately before the
`---` that precedes `## Sources`.

Entry structure, following the sixteen that exist:

```
## The Air Fryer & the Pot

**What it is.** <paragraph: two countertop machines, one gate, not a cuisine and not a shop>

**The gate.** <numbered 1-3, each bar stated as a rule with how it is measured>

**Separate, and separate on the numbers.** <paragraph naming One Pot 73/0 and Instant Pot 25/0>

**There is no board, so there is no menu word.** <one paragraph explaining the table below>

| On the menu | Also called | Plainly |   <- the machine and packet vocabulary
```

The `## Sources` and `## What could not be verified` sections at the bottom of the file are **not
touched**. They record the menu-reading passes that settled the sixteen storefront counters; this
counter was not settled that way and appending to a provenance record it has no part in would be
false. Its sources live in the gap page, which is where `soup-pot.md` puts them.

## 3. `docs/gaps/air-fryer-and-pot.md` — new file

Follows `instant-pot.md` (224 lines) and `one-pot.md` (192) for shape and `soup-pot.md` (254) for
citations. Target ~230 lines.

```
# The Air Fryer & the Pot — what is missing

<headline: 0 recipes, and why that number is the finding>

---

## What it has                       <- MACHINE-READ. Five bold titles, nothing after them.
---
## The gate, measured                <- the 25-row Instant Pot table + the three-shelf summary
### What the clock actually reads
### Where One Pot and Instant Pot actually fail
### Fewer than ten clear it. It is zero.
---
## What it is missing                <- ranked, >= 20, banded, kit/standalone per item
### How this list is ranked
### The basket, ranks 1-14
### The pot, ranks 15-20
### Also worth writing, lower down
---
## What the basket times actually are  <- the ranges, and where sources disagree
---
## Components it would need
---
## What a table cannot hold          <- >= 4 things the machine is bad at
---
## Where this came from              <- linked sources, what each established
```

### 3a. The `## What it has` block

Five bold section titles in menu order, each on its own line, **with nothing after the bold
lead-in**, plus a plain-prose sentence outside the bold lines saying why they are empty.

```markdown
**Straight out of the basket.**

**Start to finish in the pot.**
...
```

**Round-trip behaviour, traced through `scripts/menu-sections.mjs` rather than assumed.**
`parseSections` splits on `\n(?=\*\*)`, matches `^\*\*(.+?)\*\*\s*(.*)$`, then splits `match[2]` on
`·`. With `match[2]` empty the single piece is `''`, `first` is undefined, `hits` is empty, and the
final `else if (cleaned)` is false — so **nothing is pushed to `sections` and nothing to
`unparsed`**. `mine` is empty because no recipe names this counter, so `missing` and `extra` are
both empty and the `problems` counter does not increment. The dry run prints:

```
  ok   The Air Fryer & the Pot: 0 sections, 0/0 placed
```

and `every counter parsed cleanly.` is preserved. **This is verified in Plan step 5, not assumed.**

**The prose sentence must not contain a hyphenated token that is also a slug**, or the fallback
scan would pick it up. It is written outside any `**bold**` lead-in, so `parseSections` skips the
line entirely (`if (!line.startsWith('**')) continue`) — but the constraint is stated here so a
later editor does not move it inside one.

### 3b. Ordering of the ranked list

Bands, not one flat run of twenty, because `instant-pot.md` established the pattern
(`### The twelve that pay for the appliance` / `### Ranks 13 to 31`) and because this list has two
machines in it and a reader needs to see which half a rank belongs to.

Every rank carries, in this order: **the dish name**, the slug decision, the reason it ranks where
it does, and the time range with what it depends on. The slug decision is one of exactly two
strings so it can be scanned:

- ``**`kit: Air Fryer` variant of `<slug>`.**``
- `**Standalone — nothing here to be a variant of.**`

### 3c. What must not be in this file

- **No fabricated times.** Every number is attributed to a source or given as a range with the
  disagreement named.
- **No `>> counters:` lines and no recipe content.** T-008-04 writes recipes; this page ranks them.
- **No adjusted bars.** The gate is quoted as S-008 wrote it, three times over (page copy,
  `counters.md`, here), identically.

## 4. The throwaway `.cook` demonstration

Written to `recipes/fried-and-crispy/zz-air-fryer-probe.cook`, checked, and deleted in the same
step. It has to live under `recipes/` because `scripts/parse-recipes.mjs` globs that tree; nowhere
else is read.

Minimum content to exercise both claims:

```
>> title: Air Fryer Probe
>> category: Fried & Crispy
>> counters: The Air Fryer & the Pot
>> dish: karaage
>> kit: Air Fryer
>> washing-up: the basket, a plate
... 3+ operations, 5+ ingredient rows, every timer named
```

`>> dish: karaage` and `>> kit: Air Fryer` together exercise the multi-file `dish` rule at
`parse-recipes.mjs:198` — `karaage` has no kit line, this one does, so the group is legal. What is
being proved:

1. `The Air Fryer & the Pot` is a counter name `collection.test.ts:29` accepts.
2. A `kit: Air Fryer` sibling of an existing plain file does not throw.
3. `check-recipes.mjs` reports ok with it present.

Then it is deleted and `check-recipes.mjs` is run again to prove the collection is unchanged. Both
transcripts go in `progress.md`.

## 5. Ordering of the changes

The order matters in one place only, and it is the reason for it rather than taste:

1. **`counters.json` first.** `scripts/menu-sections.mjs` iterates `file.counters` and reports a
   missing gap note as a problem, so the counter must exist before its gap page can be checked
   against it — and, the other way round, the gap page must exist before the counter can be checked
   without raising a problem. They are checked together, so they must land together.
2. **`docs/gaps/air-fryer-and-pot.md` second**, in the same commit, for the reason above.
3. **`docs/knowledge/counters.md` third**, separately. It is a reference edit and reads
   independently; nothing in the build touches it.
4. **The `.cook` probe last**, after all three are in, because it needs the counter name to exist.

## 6. What this ticket deliberately does not do

- **Does not backfill the five missing `counters.md` entries** (The Bowl Shop, Instant Pot, One
  Pot, Japanese Home Cooking, The Slow Cooker). Recorded in the gap page as a finding.
- **Does not run `node scripts/menu-sections.mjs --write`.** It rewrites all twenty-two counters,
  drops eleven `notes` blocks plus the new one, and would replace the five hand-written titles with
  `[]`. Dry run only.
- **Does not touch `src/lib/icons.ts:319`.** `'air fry': 'oven'` is the right icon for the verb and
  is not this ticket's file.
- **Does not annotate any recipe's `washing-up`.** That is T-008-03 and the gap page says so.
- **Does not write a recipe.** That is T-008-04.
- **Does not add a row to `docs/gaps/README.md`'s tally.** That file is a build-state record read
  after the shelf exists; a row of zeroes for a counter with nothing on it belongs to T-008-05's
  read, and `README.md` is not in this ticket's file list.
