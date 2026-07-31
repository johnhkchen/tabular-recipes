# T-003-01 — Plan

Seven steps, two commits. Every step has a command that decides whether it is done.

---

## Step 1 — Append the three counters to `src/data/counters.json`

**Do.** Edit the text after the `One Pot` object; append three objects in the key order
`name`, `slug`, `blurb`, `categories`, `sections`, with the eighteen section titles from
`structure.md` §1 and `"items": []` throughout. Two-space indentation, no reformat of anything
above.

**Verify.**

```
node -e "const c=require('./src/data/counters.json').counters;
  console.log(c.length);
  console.log(c.slice(-3).map(x=>x.name+' / '+x.slug+' / '+x.sections.length+' sections / '+
    x.sections.reduce((n,s)=>n+s.items.length,0)+' items').join('\n'))"
```

Expect `22`, then the three lines with `0 items` each. Then:

```
git diff --stat src/data/counters.json      # one file, additions only
node -e "…" | grep ' — '                    # no section title contains an em-dash aside
```

**Done when** the count is 22, all three report 0 items, and the diff touches nothing above the
insertion point.

---

## Step 2 — Whole-collection check, unchanged

**Do.** `node scripts/check-recipes.mjs`

**Verify.** `all 553 file(s) draw a table.` and exit 0. This is the acceptance criterion
*"reports ok for the whole collection, unchanged"*. Adding names to `KNOWN_COUNTERS` can only
widen what is legal, so any change here means the JSON edit broke the file.

**Done when** the tail line matches and the exit code is 0.

---

## Step 3 — Prove a `.cook` naming each new counter passes

**Do.** Write `recipes/soups/zzz-counter-name-proof.cook` as a real minimal soup: four required
metadata keys, `>> counters:` under test, ≥3 ingredient rows, ≥3 operations, every operation
cell labelled.

Run four times:

```
node scripts/check-recipes.mjs recipes/soups/zzz-counter-name-proof.cook   # counters: The Soup Pot
…                                                                          # Japanese Home Cooking
…                                                                          # The Slow Cooker
…                                                                          # "The Soup Pott" — negative control
```

**Verify.** Three `ok` lines with a row × col count; the fourth `FAIL` with
`unknown counter "The Soup Pott"`. Paste all four outputs verbatim into `progress.md` — the
criterion says *demonstrate it in the work artifact*.

**Then delete and prove the deletion:**

```
rm recipes/soups/zzz-counter-name-proof.cook
git status --porcelain | grep recipes/ || echo "clean"
```

**Done when** the four outputs are captured and `git status --porcelain` shows no `recipes/`
entry. The negative control is not optional: without it, three `ok` lines prove only that the
checker ran.

---

## Step 4 — Commit unit 1

```
lisa commit-ticket --ticket-id T-003-01 \
  --message "Open the soup pot, the home kitchen and the slow cooker" \
  --include src/data/counters.json
```

**Verify.** `git status --porcelain` no longer lists `src/data/counters.json`, and lists no
`recipes/` entry. Nothing else is staged.

**Done when** the commit lands and the working tree is clean of ticket-owned source.

---

## Step 5 — `docs/gaps/slow-cooker.md`

First of the three: entirely grounded in data already measured, so it validates the document
shape before the two that need judgement.

**Do.** Write it to the outline in `structure.md` §3c. The candidate table is the load-bearing
part — ≥20 rows, each `dish · slug · IP? · more/less/differently · why`.

**Verify — this file has four criteria and all four are countable:**

```
# every slug in the file resolves to a real recipe
grep -oE '`[a-z0-9-]+`' docs/gaps/slow-cooker.md | tr -d '`' | sort -u > /tmp/claimed
node -e "console.log(require('./src/generated/recipes.json').map(r=>r.slug).join('\n'))" | sort -u > /tmp/real
comm -23 /tmp/claimed /tmp/real          # must be empty of anything slug-shaped
```

- ≥20 rows in the candidate table, each carrying a slug — count them.
- Every row carries exactly one of `more` / `less` / `differently`.
- ≥12 rows marked as having an Instant Pot variant, cross-checked against the 25 measured in
  Research §5, so T-003-05's ≥12 criterion is reachable.
- The three sections `## What is already here`, the ranked/table block, and
  `## What it could not stock` all exist.

**Done when** the slug set is clean, the row count is ≥20, and every row has a verdict.

---

## Step 6 — `docs/gaps/japanese-home.md`

**Do.** Write to `structure.md` §3b. The criterion that decides this file is the **shelve /
leave** split by slug, so that block is written first and the rest arranged around it.

**Verify.**

- Every one of the 31 existing Japanese-adjacent slugs from Research §5 appears in exactly one
  bucket. Enumerated and checked by hand against the list, then slug-resolved with the same
  `comm` check as Step 5.
- The ranked missing list is grouped by the seven counter sections, and 煮物 and 小鉢 each carry
  ≥5 named dishes — T-003-04's floor, made countable rather than derived.
- `dashi` and `miso-soup` appear under *shelve this* and are stated as shelving-not-writing jobs
  for T-003-06.
- The 黄金比 ratios appear with their source.

**Done when** every existing Japanese slug is bucketed once, and 煮物 / 小鉢 both list ≥5.

---

## Step 7 — `docs/gaps/soup-pot.md`

Last and longest.

**Do.** Write to `structure.md` §3a. Order of writing inside the file: glossary first (it is the
part the ranked list leans on), then the seasonal frame and the four rules, then the two ranked
blocks, then the surrounding sections.

**Verify.**

- The 老火湯 block lists ≥16 soups and the 滾湯 block ≥8, so T-003-03's 12 and 5 both have slack.
- The reading-order sentence from design D2.2 is present immediately above the two blocks.
- Every entry carries characters + romanisation + plain-keyboard spelling, because T-003-03 has to
  put all three in `aka` and this file is where they come from.
- Every entry says what the pairing is **for**, not only what is in it.
- No sentence asserts a health outcome in the site's own voice. Read the whole file once against
  this test specifically; it is the one failure mode that a checker cannot catch.
- `## Where this came from` names every source used.
- Slug-resolve check as in Step 5.

**Done when** the two blocks meet their counts, every entry carries the three spellings and a
purpose, and the health-claim read-through is clean.

---

## Step 8 — Commit unit 2

```
lisa commit-ticket --ticket-id T-003-01 \
  --message "Three work lists for the home wing" \
  --include docs/gaps/soup-pot.md \
  --include docs/gaps/japanese-home.md \
  --include docs/gaps/slow-cooker.md
```

**Verify.** `git status --porcelain` lists no ticket-owned file — no `src/data/`, no `docs/gaps/`,
no `recipes/`. The pre-existing dirty entries from other tickets (`docs/active/tickets/T-002-0*`,
`docs/active/work/T-002-0*`) are **not** this ticket's and must be left exactly as found.

---

## Testing strategy

There is no unit test to write. This ticket adds data and prose, and its correctness is decided by
existing checkers plus counts:

| What could go wrong | What catches it |
| --- | --- |
| Malformed JSON | `require()` throws; `check-recipes.mjs` throws at line 23 before checking anything |
| A counter name that a `.cook` cannot use | Step 3's three `ok` lines |
| A checker that is not actually reading the name | Step 3's negative control |
| A section title the parser will truncate | grep for ` — ` across the eighteen titles |
| A gap file naming a slug that does not exist | the `comm` slug-resolve check, run on all three files |
| A downstream ticket unable to meet its own criteria | the count checks in Steps 5–7: ≥20 table rows and ≥12 IP-variant rows for T-003-05, ≥5 per 煮物/小鉢 for T-003-04, ≥16 / ≥8 for T-003-03 |
| A health claim written in the site's voice | a deliberate read-through, recorded in `progress.md` as done |
| Scope creep | `git status --porcelain` before each commit |

**Not run:** `npm run build`, `npx vitest run`. Neither is in the acceptance criteria, both are
T-003-06's gates, and neither can be affected by a counter with zero items — verified in Research
§2 that such a counter generates no page. If `check-recipes.mjs` is green on all 553 files the data
is well-formed by the same code path the build uses.

## Risks carried

- **The 老火湯 material is not in English and the sources are mostly Cantonese-language pages.**
  Mitigation: the glossary states the tradition's reasoning in the tradition's terms and the
  sources are named, so T-003-03 can check any single claim rather than inheriting it on trust.
  Where a pairing could not be established from more than one source, the file says so in the
  entry rather than stating it flatly.
- **T-003-03's target (20) is close to what a ranked list can honestly hold.** Mitigation: 16 + 8
  gives real headroom, and the ticket already permits substitution — *"the list is longer than
  your target."*
- **`instant-pot.md` was written before the 25 variants existed** and describes the shelf as empty.
  `slow-cooker.md` must not copy that framing; it states the measured current count instead.
