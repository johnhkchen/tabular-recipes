# T-012-02 — Structure

Two files are created, one is edited, and nothing else on disk moves.

## Files

| Path | Action | What it is |
| --- | --- | --- |
| `docs/gaps/what-the-shelf-offers.md` | **create** | The reading. The deliverable. |
| `docs/gaps/README.md` | **edit** | One pointer, in `## The five gaps to fill first`'s neighbourhood. Nothing else in the file is touched. |
| `docs/active/work/T-012-02/read-the-shelf.ts` | **create** | The measurement, so every number in the reading can be re-run. |
| `docs/active/work/T-012-02/*.md` | **create** | RDSPI artifacts: research, design, structure, plan, progress, review. |
| `docs/active/work/T-012-02/review-disposition.json` | **create** | Required by the workflow. |

**Nothing else.** No `.cook`, no `src/`, no `scripts/`, no story, no other ticket — the ticket's
last acceptance criterion, and the reason the analysis script lives in the work directory rather
than in `scripts/` where a reader might otherwise expect it.

### Why the script is an artifact and not a tool

`scripts/` is out of bounds and that is the right call, not a workaround. The measurement is a
one-time reading, like T-001-18's and T-003-07's before it. A permanent `scripts/read-the-shelf.mjs`
would be a tool the repo has to keep passing `npm run verify` for the rest of its life, in exchange
for a report nobody re-runs. Keeping it beside the reading it produced means a sceptic can re-run
it against a newer `recipes.json` and see exactly which numbers drifted, and nothing in the build
depends on it.

It is TypeScript rather than `.mjs` because it imports `src/lib/schedule.ts` directly. Node 24
strips types natively, so it runs with no build step:

```
PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH" \
  node docs/active/work/T-012-02/read-the-shelf.ts
```

## `read-the-shelf.ts` — internal organisation

One file, six sections, each ending in a printed block the reading quotes. It reads
`src/generated/recipes.json`, `src/data/staples.json` and `src/lib/schedule.ts`, and **writes
nothing**.

```
┌ vocabulary ──────────────────────────────────────────────┐
│ PLANTS     : Record<canonical, string[]>   name → plant   │
│ STARCHES   : Set<canonical>                the flag       │
│ PULSES     : Set<canonical>                gate 1         │
│ NOT_PLANT  : string[]  spice / flour / sugar / oil / …    │
│ FRIDGE     : string[]  the assumed perishables            │
│ GRAMS      : Record<unit, number>  one unit table         │
└───────────────────────────────────────────────────────────┘
        │
        ├─ §1 plants()    → distinct plants, by band; built-on candidates
        ├─ §2 pulses()    → pulse-as-main candidates
        ├─ §3 forOne()    → persona one's query + sensitivity runs
        ├─ §4 week()      → protein/cuisine matrix for the rotation exercise
        ├─ §5 hands()     → buildSchedule → branch filter → counts
        └─ §6 support()   → day-one served counts for the four capabilities
```

### The vocabulary tables are the reviewable surface

Every classification decision is a line in one of five literal tables at the top of the file, not
a regex buried in a function. A reviewer who disagrees with *"`frozen peas` is band A, not a
pulse"* can point at that line. This is the same reason `src/data/staples.json` writes its
`except` lists out longhand instead of tuning a matcher.

`NOT_PLANT` is a **deny list applied first**, so a name has to survive it before any plant pattern
is tried. `ground cumin` never reaches the plant table. This ordering is what implements design
§2's band-D line, and getting it backwards would silently reclassify every spice.

### Matching

Whole consecutive words, the same rule `matchesStaple()` uses in `src/lib/units.ts` — so `corn`
does not claim `cornstarch` and `bean` does not claim `bean sprouts` unless a table says it does.
The script does not import `matchesStaple` for its plant work (different vocabulary, different
purpose) but it uses the same predicate shape, and it **does** import the real one via
`src/lib/units.ts` for the staples half of §3, so the pantry answer is the site's own answer and
not a second implementation of it.

### The unit table

`GRAMS` covers mass and volume units only: `g`, `kg`, `oz`, `lb`, `cup`, `Tbs`, `tsp`, `ml`, `l`,
`quart`, `pint`. Volume is converted at water density and the reading says so — a cup of flour and
a cup of water are not the same mass, and the alternative is either a density table per
ingredient (a large invented number) or no dominance test at all.

**Count units are not converted.** `2 cloves`, `1 bunch`, `3 whole` return `null` and drop out of
the dominance arithmetic rather than being assigned a plausible weight. `src/lib/shopping.ts`
already returns null rather than compare grams to cups; this follows it.

### Output

Plain text to stdout, one section per heading, every list printed as slugs. The reading quotes
from it. No JSON dump, no file written — a second copy of the numbers on disk is a second copy to
drift.

## `docs/gaps/what-the-shelf-offers.md` — shape

Section order follows the ticket's five parts, then the ranking, so a reviewer can hold the file
against the acceptance criteria top to bottom.

```
# What the shelf offers the three cooks

  Preamble          when, against what, at what recipe count, and what is *not* re-measured
  How the counting was done   the four bands, the starch list, the pulse gates — the rules,
                              before any number, with the script path

1 The cattle claim            plants by band · built-on-a-plant · against 101 sweets · verdict
2 The beans claim             43 mentions → pulse-as-main → reads-as-dinner · verdict
3 The three, run as queries
    Cooking for the day       THE ASSUMED FRIDGE, in full · slugs · sensitivity
    The family rotation       the week, night by night, with slugs · what ran out first
    Holiday guests            raw lanes vs filtered branches · the count · slugs
4 What to build next          four capabilities ranked, each with needs/stands-on/day-one/food-first
                              and the plain sentence on writing food first
5 Where the personas disagree with the board
                              one subsection per running story, ticket named, verdict from
                              cooks.md's instrument · S-011 × T-011-06 first
  What this reading does not do
  How to re-run it
```

**Two things the file must not contain:**

- **No `## What it has` block.** `scripts/menu-sections.mjs` parses that heading out of every file
  in `docs/gaps/` and matches it to a counter in `src/data/counters.json`. A file with one and no
  counter would make the dry run report a phantom. `docs/gaps/soup-pot.md` is the precedent for a
  non-counter page in this directory and it has no such block.
- **No edit to any story or ticket**, including the ones it finds fault with. Conflicts are
  recommendations inside this file, each naming the ticket it concerns.

## `docs/gaps/README.md` — the edit

**One insertion, and no other line changed.** The pointer goes at the end of
`## The five gaps to fill first`, because that section is where the next pass looks for work and
the reading's ranking is exactly a claim about what the next pass should do. The wording states
what the reading found and what it decided, so somebody scanning the README learns whether they
need to open it.

The `## Build state` block is **deliberately left alone**. It records 664 files and is already
stale at 685; correcting it is a different pass's job and would put this ticket's hand on a
paragraph three other stories are also drifting.

## Ordering

The order matters in one place only: **§1's plant vocabulary feeds §3's fridge query and §6's
day-one counts.** Everything else is independent, so if the plant tables move, three numbers move
with them, and they are re-run together or not at all.

1. `read-the-shelf.ts` — vocabulary tables and §1 (plants). The largest single unit of judgement.
2. §2 (pulses), §5 (branches) — independent of each other and of §1's outcome.
3. §3 (the three queries) — needs §1's tables and §5's branch filter.
4. §4 (the week) — hand exercise, informed by §1–§3 but not blocked on them.
5. `what-the-shelf-offers.md` — written once every number exists. Not before: a reading drafted
   around expected numbers is a reading that will argue for them.
6. `docs/gaps/README.md` pointer — last, so it can say what was actually found.

## Interfaces this leans on

| From | Used for | Note |
| --- | --- | --- |
| `src/generated/recipes.json` | everything | Read-only. 685 records. |
| `src/lib/schedule.ts` → `buildSchedule`, `BREAK_MINUTES` | §5 | Imported, not reimplemented. The ticket requires it. |
| `src/lib/units.ts` → `matchesStaple` | §3 | The site's own pantry answer. |
| `src/data/staples.json` | §3 | The 31 staples and the doctrine. |
| `docs/knowledge/cooks.md` | §3, §5 verdicts | The three cooks and the passes/fails/cannot-say instrument. |

None of these is modified. If a signature has drifted the script fails loudly at import rather
than working around it.
