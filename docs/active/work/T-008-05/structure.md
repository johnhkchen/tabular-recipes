# T-008-05 — Structure

Six files change. Three scratch files live in this work directory and ship nothing. No `.cook`
file, no `src/lib/**`, no `scripts/**`.

---

## 1. Files, by what happens to them

| path | change | why |
| --- | --- | --- |
| `docs/gaps/air-fryer-and-pot.md` | **rewrite two sections, add one** | the item lists, the measured total, the corrections |
| `src/data/counters.json` | **replace one counter's `sections`** | five empty titles → four populated ones |
| `src/data/aisles.json` | **three patterns into `Freezer`** | the frozen goods T-008-04 brought |
| `docs/gaps/one-pot.md` | **rewrite one passage, add one section** | washing-up *is* a row now |
| `docs/gaps/instant-pot.md` | **add one subsection** | the brown-outside-the-pot list |
| `docs/gaps/README.md` | **rewrite the tally, add two notes** | 22 counters; the kit comparison |
| `.lisa/attempts/T-008-05/1/work/gate.mjs` | scratch | the gate, applied mechanically |
| `.lisa/attempts/T-008-05/1/work/tally.mjs` | scratch | Recipes / Only here, per counter |
| `.lisa/attempts/T-008-05/1/work/aisle-diff.probe.mts` + `aisle-probe.config.mts` | scratch | the before/after aisle map |

**Nothing is created and nothing is deleted** in the repository proper.

## 2. `docs/gaps/air-fryer-and-pot.md`

684 lines today. The page keeps its shape; three regions change.

### 2.1 The opening paragraph — replaced

Today it opens **"0 recipes, and the zero is the finding."** That was true and is not. The
replacement states 21, states that it is under the twenty-five S-008 named, and states which bar
did the excluding, in the first three sentences. Everything the old opening said about the pool of
118 and the 0% borrow is kept, moved down, and marked as what was true before T-008-04.

### 2.2 `## What it has` — the machine-read block

The **only** part of this file that is parsed. Four bold lead-ins, each followed by middot-separated
slugs, in menu order:

```
**Straight out of the basket.** air-fryer-chicken-wings · air-fryer-chicken-thighs ·
air-fryer-salmon · air-fryer-saba-shioyaki · air-fryer-halloumi · air-fryer-tofu ·
air-fryer-chicken-tikka · air-fryer-shish-tawook

**Vegetables that go crisp.** air-fryer-brussels-sprouts · air-fryer-broccoli ·
air-fryer-cauliflower · air-fryer-sweet-potatoes · air-fryer-chips · air-fryer-batata-harra ·
air-fryer-chickpeas · air-fryer-corn-ribs · air-fryer-padron-peppers

**Frozen things, done properly.** air-fryer-frozen-chips · air-fryer-frozen-spring-rolls ·
air-fryer-frozen-prawns

**Reheats that beat the microwave.** air-fryer-reheated-pizza
```

8 + 9 + 3 + 1 = **21**.

Three constraints on this block, all of them parser facts recorded in the page itself:

- **A title must carry no ` — ` aside.** `parseSections` cuts a title at the first em-dash run.
- **Prose between the lead-ins is reported as `unparsed:`.** The four explanatory paragraphs the
  page currently carries in this block (why there is no *Also here*, why no `---` closes it, why
  `--write` is dangerous) sit **above the first bold lead-in**, where the parser never reaches
  them, or move out of the block entirely.
- **The trailing `---` rule goes back in.** The page removed it deliberately while the lists were
  empty, because it would have printed `unparsed: Frozen things, done properly: ---`. With slugs in
  the lists the last lead-in ends in a slug, and the rule is separated from it by a blank line, so
  it can return — and the note explaining its absence comes out with it.

### 2.3 `## The gate, measured` — rewritten around the new numbers

Keeps the three bars **verbatim**, keeps the 25-row Instant Pot table (it is still true and it is
still the reason the pot half is empty), and replaces the summary tables with `gate.mjs`'s output:

- per-bar over all 685 recipes: bar 1 **118 / 59 / 508 undeclared**, bar 2 **43 / 642**,
  bar 3 **260 / 425**, all three **21**
- what each failure died on, and the *sole cause* line: bar 1 **0**, bar 2 **22**, bar 3 **13**
- the four-shelf table, with `The Air Fryer & the Pot` at 21/21/21/21
- the nine bar-2 verdicts the authored reading moved, and the one slow-cooker correction

### 2.4 A new section: `## The shelf, item by item`

The acceptance criterion's table — 21 rows of slug, washing-up list, count, machine, `>> time:`,
elapsed, untimed operations — pasted from `gate.mjs --shelf`. Under it, the verification of S-008's
blurb *plug one in, eat, wash two things* against those rows, and the three corrections this
ticket makes to the page's own earlier prose:

1. `The Slow Cooker clears bar 2 outright` — it does not; 1 of 20 does.
2. `this shelf borrows its entire pressure-cooker half` — it borrows nothing, and cannot.
3. the drawer, settled: the basket assembly is one thing.

### 2.5 `## Recorded for whoever reads this next` — appended to

Four recommendations, each explicitly *not done here*: bar 1's uselessness, `'airfry'` in
`src/lib/time.ts`, `shake` in `VERB_ICONS`, and the preheat convention that exists as 21 copies of a
sentence.

## 3. `src/data/counters.json`

One object changes: `counters[21]`, `The Air Fryer & the Pot`. Its `sections` array goes from five
`{title, items: []}` (one carrying `notes`) to four `{title, items: [...]}`, with the same `notes`
block still on the first.

```jsonc
"sections": [
  { "title": "Straight out of the basket", "items": [ /* 8 */ ],
    "notes": [ { "note": "Everything here washes two things or fewer, …" } ] },
  { "title": "Vegetables that go crisp",   "items": [ /* 9 */ ] },
  { "title": "Frozen things, done properly", "items": [ /* 3 */ ] },
  { "title": "Reheats that beat the microwave", "items": [ /* 1 */ ] }
]
```

Nothing else in the file moves: not the other 21 counters, not `name`, `slug`, `blurb` or
`categories`.

**Hand-written, then round-tripped — not generated.** `node scripts/menu-sections.mjs --write`
rewrites **every** counter and drops all twelve `notes` blocks, so it cannot be the thing that
produces this file. The order is: write it by hand → run the dry run and require
`4 sections, 21/21 placed` with no `unplaced`, `listed but not shelved here` or `unparsed` line →
then prove the round-trip by copying the file aside, running `--write`, diffing, and restoring.
The diff must contain nothing but the twelve `notes` blocks and One Pot's known drift.

**Item order inside a section is the gap page's order**, because `menuFor()` preserves it and a
menu's order is part of what it says.

## 4. `src/data/aisles.json`

One array grows: `aisles[12].patterns` (`freezer`), 6 → 9.

```
"frozen peas", "frozen corn", "frozen spinach", "frozen berries",
"frozen chips", "frozen spring rolls", "frozen raw prawns",
"ice cream", "ice"
```

Written at the length the ingredient is written, because `matchesStaple` needs **consecutive whole
words**: `frozen prawns` would not claim `frozen raw prawns`. Placed with the other `frozen *`
patterns and before `ice cream`/`ice`, which are the grab-on-the-way-out tail.

Nothing else in the file changes — no aisle is added, no `except` clause, no `packs` entry.

## 5. `docs/gaps/one-pot.md`

Three edits, in file order.

1. **Line 3, the headline.** `**68 recipes.**` → 73, with one sentence naming the five S-007 soups
   as the difference and pointing at the drift `menu-sections.mjs` already reports. **The
   `## What it has` block is not touched** — re-sectioning One Pot is a counter decision and this
   ticket does not make counter decisions about other counters.
2. **Line 102–105, under *What it could not stock*.** The passage ending *"washing-up is not a row
   in a table"* is rewritten: it is a row now, it is authored rather than derived, and the promise
   this page could only assert is now measured across all 73 files.
3. **A new subsection, `### What the shelf actually washes`**, holding T-008-03 §2's table of the
   eight washing three or more, the distribution (1→40, 2→25, 3→6, 4→2, mean 1.59), and the
   recommendation. Placed immediately after the rewritten passage, so the claim and its evidence
   are adjacent.

**The recommendation is a recommendation.** No slug moves, `src/data/counters.json`'s One Pot entry
is untouched, and the sentence that decides the eight — *does One Pot promise one pan or one sink?*
— is named as the open question rather than answered.

## 6. `docs/gaps/instant-pot.md`

One new subsection, `### What browns outside the pot`, at the end of `## What the clock now reads`
— the section that already talks about what the 25 files actually do rather than what is missing.
Four rows, slug and what happens outside the pot, plus the `birria-de-res-instant-pot` note and the
answer to T-008-01's open concern. Nothing existing is rewritten; the `## What it has` block is not
touched.

## 7. `docs/gaps/README.md`

Three edits.

1. **The tally table** — 21 rows → 22. Every row's **Recipes** and **Only here** re-derived by
   `tally.mjs` from `src/generated/recipes.json`; **Missing dishes** and **Missing components**
   carried forward, with the new row's derived from its own page. The heading changes from *"All
   twenty-one counters, for the first time"* and the paragraph under it says plainly which two
   columns are fresh and which two are carried. Totals recomputed.
2. **The `Every counter is fully sectioned` paragraph** — updated: the Air Fryer counter is now
   sectioned, and the two counters listing a slug they do not shelve are unchanged.
3. **A new short section, `### What the kit axis says about the sink`**, holding T-008-03 §4's
   result: Slow Cooker 16 of 20 wash **more** and none fewer; Instant Pot 16 of 25 a dead heat;
   Air Fryer 10 of 13 wash fewer. This is the "record what the plain-versus-kit comparison showed"
   criterion and it goes here because this file is where the next pass looks.

**The `## Build state` block is left alone.** It is labelled S-007's and the file already carries a
fresher measurement two sections below it.

## 8. Ordering, where it matters

Only two orderings are forced:

1. **`docs/gaps/air-fryer-and-pot.md` before `src/data/counters.json`.** The JSON has to match what
   the page says, and `menu-sections.mjs` checks each against the other — either alone is a reported
   problem. They are one commit for that reason, which is the precedent T-008-02 set.
2. **`aisles.json` after the before-snapshot.** The diff is the evidence; taking the snapshot
   afterwards proves nothing.

Everything else is independent. The three other gap pages touch no shared state and can land in any
order.

## 9. What is deliberately not changed

- **No bar.** Not the ≤ 2, not the one machine, not the 45 minutes.
- **No `.cook` file.** The `~air fry` timer-name defect (T-008-04 §6.1) is real, latent and lives in
  `src/lib/time.ts` — recorded, not fixed.
- **`src/data/counters.json`'s One Pot entry**, including the four inert fried slugs
  `docs/gaps/one-pot.md` already records.
- **`docs/knowledge/counters.md`**, which is not this ticket's and whose five missing appliance-shelf
  entries the gap page already records.
