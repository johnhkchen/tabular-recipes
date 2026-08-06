# T-005-04 · Structure — the shape of the change

Not code, but where every byte moves. One field, one line per file, 373 files, plus the
machinery that guarantees nothing else moves.

---

## 1. Files touched in the repository

| Path | Action | Extent |
| --- | --- | --- |
| `recipes/**/*.cook` — 373 of them | modified | **exactly one line each**: the `>> slack:` line |
| everything else in `recipes/` (285 files) | untouched | 261 undeclared + 24 already at one breath |
| `src/lib/slack.ts` | untouched | parser needs nothing; hazard names it explicitly |
| `src/lib/slack.test.ts` | untouched (expected) | no fixture is near the cap — research §5 |
| `src/components/Timeline.astro` | untouched | render is one line and correct |
| `scripts/check-recipes.mjs` | untouched | the cap is T-005-01's, already committed |
| `docs/knowledge/voice.md` | untouched | the rule is written; this ticket obeys it |
| `src/generated/recipes.json` | regenerated, **never committed** | gitignored build artifact |

**No file is created in the repository.** The whole change is 373 single-line replacements.

### The line, before and after

Every one of the 397 declared files carries the field in exactly one form (research §1):

```
>> slack: <level> — <reason>
```

The replacement preserves the prefix, the level word and the spaced em dash, and substitutes the
reason. Nothing else on the line, and no other line, is written.

---

## 2. Files created in the attempt work directory

`.lisa/attempts/T-005-04/1/work/` — Lisa publishes these to `docs/active/work/T-005-04/`.

| Path | Kind | Role |
| --- | --- | --- |
| `research.md` · `design.md` · `structure.md` · `plan.md` · `progress.md` · `review.md` | phase artifacts | RDSPI record |
| `review-disposition.json` | phase artifact | pass/block |
| `dump-slack.mjs` | tool, read-only | measures the field: `stats` · `list` · `json` |
| `apply-slack.mjs` | tool, writes `.cook` | the only thing that edits a recipe |
| `slack-before.json` · `slack-before.tsv` | evidence | the field as found, all 397 |
| `slack-after.tsv` | **the deliverable** | 373 hand-authored replacements |
| `report-before.txt` · `report-after.txt` | evidence | full `npm run check` output, both ends |
| `dispositions.tsv` | evidence | per-file record of what was dropped and why |

`dump-slack.mjs` already exists and produced the baseline. It writes nothing and can be re-run
at any point.

---

## 3. `slack-after.tsv` — the interface between judgement and machine

Three tab-separated columns, no header, one row per rewritten file:

```
recipes/soups/dashi.cook <TAB> unforgiving <TAB> boiled kombu turns the pot slimy and bitter…
```

| Column | Content | Why it is there |
| --- | --- | --- |
| 1 | repository-relative path to the `.cook` file | the `--include` path, verbatim |
| 2 | the level, **copied from the file, never chosen** | lets the applier assert rule 5 instead of trusting it |
| 3 | the new reason, exactly as it will render | reviewable as prose; measured directly |

Column 2 is redundant on purpose. It exists so that a level typo in the table is a hard abort
rather than a silent re-rating of a recipe.

A file absent from this table is a file that is not edited. The 24 one-breath lines are absent,
and so are the 261 undeclared recipes.

---

## 4. `apply-slack.mjs` — the contract

One entry point, no options, no partial application.

**Reads** `slack-after.tsv` and every path named in it.
**Writes** those `.cook` files, and only after every check on every row has passed.

### Phase 1 — validate the table, in memory, writing nothing

Per row, abort the entire run on any of:

| Check | Guards against |
| --- | --- |
| path resolves inside `recipes/` and ends `.cook` | editing anything outside the collection |
| the file contains **exactly one** line matching `/^>>\s*slack\s*:/m` | a second declaration, or none |
| `readSlack` of the existing line yields the level in column 2 | changing a rating (design rule 5) |
| new reason is non-empty and ≥ 5 whitespace-separated words | `slack.test.ts`'s failure-not-restatement guard |
| `new reason.length ≤ 200` | the cap, checked before the checker sees it |
| no row repeats a path | two rewrites racing on one file |
| the reason contains no tab, newline, or leading separator character | a malformed line, or `readSlack` eating the first word |

### Phase 2 — write

For each row, replace the single matched line with

```
>> slack: <level> — <reason>
```

using the level read **from the file**, not from the table. Byte-for-byte identical output for
every other line, same trailing newline, same encoding. Re-running the script on an
already-applied collection is a no-op that still passes phase 1 — it is idempotent.

### Phase 3 — report

Print rows written, rows unchanged, and the new min/mean/max. Exit non-zero on any abort.

---

## 5. Ordering, and why it matters

1. **Baseline first.** `report-before.txt` and `slack-before.json` are captured before any
   `.cook` file changes, because the acceptance criterion is a *before and after* by the same
   method. Both exist already.
2. **Author, then apply, per batch.** A batch is one or more recipe categories. Rows are written
   into `slack-after.tsv`, applied, and verified before the next batch is authored. A mistake is
   then bounded to one category rather than found at the end across 373 files.
3. **Variant families are authored inside one batch.** `carnitas` / `-slow-cooker` /
   `-instant-pot`, `chile-verde` ×3, `hungarian-goulash` ×3, `cachete` ×3,
   `boston-baked-beans` ×3, `collard-greens` ×3, `birria-de-res` ×3, `braised-short-ribs` ×3,
   `oxtails` ×3, `corned-beef` ×2, `beef-bourguignon` ×2, `beef-stew` ×3, `pot-roast` ×3,
   `refried-beans` ×2, `cuban-black-beans` ×2, `ful-medames` ×2, `gigantes-plaki` ×2,
   `ham-hock-stock` ×2, `pho-broth` ×2, `chintan-broth` ×2, `tonkotsu-broth` ×2,
   `chili-con-carne` ×3, `soy-sauce-chicken` ×2, `new-england-boiled-dinner` ×2,
   `lamb-tagine` ×2, `osso-buco` ×2, `irish-stew` ×2, `collard-greens` ×3,
   `brunswick-stew` ×1, `baked-turkey-wings` ×2, `smoked-*` — all share a category, so the
   pressure-cooker line and the slow-cooker line get different sentences because their windows
   genuinely differ.
4. **`npm run recipes` before any vitest run.** `slack.test.ts` reads
   `src/generated/recipes.json`; without regenerating, the suite tests the old text.
5. **Commit per batch**, `lisa commit-ticket --include` with the exact paths of that batch.
6. **Full verify last**, once, over the whole collection.

---

## 6. Boundaries this structure enforces

- **One field.** The applier's regex matches `^>>\s*slack\s*:` and replaces that line only. It
  has no code path that can write a step body, a prose row, an ingredient note or another
  metadata line. This is the mechanical guarantee behind the acceptance criterion.
- **One level vocabulary.** The level is echoed from the file. The applier cannot introduce a
  level the file did not already have, so the 117/187/93 split is preserved by construction and
  asserted afterwards.
- **One direction.** Nothing in this ticket adds a `>> slack:` line to a file that lacks one.
  `apply-slack.mjs` aborts on a file with zero matches rather than inserting.
- **No index leakage.** Every commit is `lisa commit-ticket` with explicit paths. The generated
  JSON is gitignored; the attempt work directory is Lisa's to publish.

---

## 7. Post-conditions, checkable by a reviewer

Run after the last batch, all from the repository root:

| # | Check | Expected |
| --- | --- | --- |
| 1 | `npm run check` → `by field:` line | `slack reason 0` |
| 2 | `node … dump-slack.mjs stats` | `declared: 397`, `over 200: 0`, mean ≈ 120, max ≤ 200 |
| 3 | same output, `levels:` | `{"unforgiving":93,"narrow":187,"forgiving":117}` — unchanged |
| 4 | `grep -rlc '^>> slack:' recipes \| wc -l` | 397 declared, 261 undeclared, unchanged |
| 5 | `git diff --stat` on the range | only `recipes/**/*.cook`, **1 insertion + 1 deletion per file** |
| 6 | `npm run verify` | exit 0, 832+ tests pass, 682 pages build |
| 7 | `git status --porcelain` | no ticket-owned file staged, modified or untracked |

Check 5 is the strongest one: a file with more than one changed line means the applier or a hand
edit went outside the boundary, and it is visible without reading any prose.
