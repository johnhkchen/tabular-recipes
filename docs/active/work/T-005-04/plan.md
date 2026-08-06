# T-005-04 · Plan — 373 lines, eight batches

Ordered steps, each independently verifiable. Every step that changes a `.cook` file ends with
the same three checks, so a mistake is caught inside the batch that made it.

---

## Step 0 — baseline (done during Research)

- [x] `npm run check > report-before.txt` — exit 0, `slack reason 304`
- [x] `dump-slack.mjs json > slack-before.json`, `… > slack-before.tsv` — 397 rows
- [x] Baseline recorded: `min 92 · mean 222.4 · max 290 · over 200: 304 · over 120: 373`
- [x] Levels recorded: `forgiving 117 · narrow 187 · unforgiving 93`

No repository file changed. This is the "before" half of the acceptance criterion and it must
exist before anything is edited.

---

## Step 1 — build the applier

Write `apply-slack.mjs` to the contract in `structure.md` §4. Then prove it before trusting it,
with a throwaway `slack-after.tsv` containing a single row:

| Proof | Expected |
| --- | --- |
| a row whose level disagrees with the file | abort, nothing written |
| a reason of 201 characters | abort, nothing written |
| a reason of 4 words | abort, nothing written |
| a path outside `recipes/` | abort, nothing written |
| a valid row | one file changes; `git diff --numstat` shows exactly `1 1` |
| the same valid row applied twice | second run writes nothing |
| the file reverted, `git status` clean | proof leaves no trace |

**Commit:** nothing. `apply-slack.mjs` lives in the attempt work directory, which Lisa publishes;
it is not repository source.

---

## Step 2 through Step 9 — the eight authoring batches

Each batch: author the rows into `slack-after.tsv`, apply, verify, commit.

| # | Batch | Categories | Files |
| ---: | --- | --- | ---: |
| 2 | baking | bars-and-brownies 4 · breads 22 · cakes-and-loaves 4 · cookies 8 | **38** |
| 3 | custards and dips | cured-fish 1 · custards-and-puddings 30 · dressings-and-dips 14 | **45** |
| 4 | fried and folded | dumplings-and-rolls 14 · eggs 4 · flatbreads-and-pancakes 10 · fried-and-crispy 14 | **42** |
| 5 | grains and pastry | noodles 2 · pasta 2 · pastry-and-doughs 7 · rice-beans-and-grains 28 | **39** |
| 6 | sauces and fire | salads 6 · sandwiches-and-rolls 1 · sauces-and-gravies 21 · smoked-and-grilled 21 | **49** |
| 7 | soups | soups 44 | **44** |
| 8 | spice and sides | spice-blends-and-marinades 21 · stir-fries 5 · toppings-and-pickles 7 · vegetables-and-sides 6 | **39** |
| 9 | braises | stews-and-braises 77 | **77** |
|  |  | | **373** |

Batch 9 is the largest because it is one category and its variant families
(`carnitas`/`chile-verde`/`hungarian-goulash`/`cachete`/`collard-greens`/`birria`/`oxtails` ×3
each) must be authored together to avoid three copies of one sentence.

### The per-batch loop

1. **Author.** For each file in the batch, apply the five rules from `design.md` §3 to the
   before-text: one failure, name when it happens, cut the self-justification, cut shelf talk,
   never touch the level. Record the disposition of every dropped clause in `dispositions.tsv`
   as `folded` / `dropped` / `handed off`.
2. **Apply.** `node apply-slack.mjs` over the rows added this batch.
3. **Verify — three checks, every batch:**
   - `git diff --numstat <batch paths>` → every file shows exactly `1 1`. Nothing else moved.
   - `node dump-slack.mjs stats` → `over 200` fell by the batch size; `levels` still
     `117/187/93`; `declared` still 397.
   - `npm run check <batch paths>` → those files draw a table and report no `slack reason` over
     cap.
4. **Commit.** `lisa commit-ticket --ticket-id T-005-04 --message "<batch>" --include <path>…`
   with the exact repository-relative path of each file in the batch. No `git add`, no
   `git commit`, nothing left staged.

A batch that fails any check is fixed inside the batch; nothing advances on a red check.

---

## Step 10 — safety audit

The 36 files from `research.md` §6 are re-read as *after* text, not as *before* text, and each
is confirmed to still carry its fact — a number where it had a number:

`smoked-chicken` 165/175°F · `gyro-meat` 165°F · `pork-liver-pate` 160°F · `cha-lua` 165°F ·
`smoked-turkey-breast` 160°F · `turkey-brine` 40°F · `belly-lox` three days ·
`ginger-garlic-paste` botulism + two weeks · `white-cut-chicken` · `xiu-mai` · `meatloaf` ·
`meatballs` · `kafta` · `seekh-kabab` · `breakfast-sausage-patties` · `fried-chicken` (not
edited) · `siu-mai` · `corned-beef` ×2 · `pastrami` · `sour-dill-pickles` · `lime-pickle` ·
`mayonnaise` · `aioli` · `caesar-dressing` · `chopped-liver` · `whitefish-salad` ·
`clam-chowder` · `chikuzenni` · `congee-instant-pot` · `chicken-feet` · `sesame-balls` ·
`corn-tortillas` · `nixtamalised-masa` · `sauerkraut` · `crema-mexicana`.

Written into `progress.md` as a table of after-text, so a reviewer checks 36 quoted lines rather
than 373 diffs. **A safety fact that did not survive is a blocking defect, not a note.**

---

## Step 11 — the spot-check the acceptance criteria ask for

Draw **twenty at random** — `sort -R` over the 373 applied paths with a recorded seed — and quote
each before and after in `progress.md`. Judge each against the two questions the criteria pose:
does it still name a specific failure, and does it say when that failure happens? A line that
reduced to a restatement of its level is a defect and goes back to Step 2's loop.

Random, not chosen. A hand-picked twenty proves nothing.

---

## Step 12 — final verification

| Check | Expected |
| --- | --- |
| `npm run check > report-after.txt` | `by field:` shows `slack reason 0`; exit 0 |
| `dump-slack.mjs stats` | `declared 397 · over 200: 0 · mean ≈ 120 · max ≤ 200` |
| `dump-slack.mjs stats` `levels:` | `{"unforgiving":93,"narrow":187,"forgiving":117}` |
| declared/undeclared count | 397 / 261, unchanged |
| `git diff --stat` over the ticket's commits | only `recipes/**/*.cook`; 373 files; 373 insertions, 373 deletions |
| `npm run verify` | exit 0 — check, recipes, 832+ tests, 682 pages |
| `git status --porcelain` | no ticket-owned file staged, modified or untracked |

`npm run verify` is deliberately last and run once over the whole collection: it is the
acceptance criterion, and running it per batch would spend eight full Astro builds to learn
nothing a per-batch `npm run check` did not already say.

---

## Testing strategy

**No new test is written, and that is a decision.** The cap is enforced by
`scripts/check-recipes.mjs`, which `npm run verify` runs first, against the same generated JSON
a vitest assertion would read. A second copy of `reason.length <= 200` in `slack.test.ts` would
restate the checker and drift from it — and T-005-07's whole job is to make the checker fail the
build on exactly this number.

What the existing suite already covers, and will cover the rewritten text:

| Existing test | What it will catch in this work |
| --- | --- |
| `re-reads every declared line without a complaint` | a reason that `readSlack` cannot parse back |
| `only uses levels that are in the vocabulary` | a level mangled by the applier |
| `gives reasons that name a failure rather than restating the level` | a reason cut below 5 words |
| `leaves every recipe either whole or silent` | a reason emptied out |
| `renders nothing for a recipe that never declared one` | an accidental backfill of the 261 |
| `check-recipes.mjs` structural pass | a `.cook` file broken by a bad write |

**Gaps, stated plainly.** Nothing automated can tell a named failure from a fluent restatement of
its level — that is Step 11's twenty quoted lines and a human reading them. Nothing automated
knows a safety fact was load-bearing — that is Step 10's table of 36. Both gaps are answered
with evidence in the artifact rather than with a test that would only pretend to close them.

---

## Rollback

Every batch is one commit of `.cook` files with no dependants. Reverting a batch restores its
text exactly; the applier is idempotent and re-runnable from `slack-after.tsv`, so a reverted
batch can be re-applied without re-authoring.
