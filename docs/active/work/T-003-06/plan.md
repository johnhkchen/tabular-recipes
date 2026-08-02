# T-003-06 — Plan

Seven steps, two commits. Each step has a check that fails loudly. Steps 1–2 are reversible with
no commit; steps 3 and 5 are the two commits and are separately revertable.

---

## Step 0 — Baseline, recorded before anything moves

Nothing is edited. The numbers are written into `progress.md` so every later claim has something
to be measured against.

```
git rev-parse --short HEAD                  → the base commit for the diff invariant
git status --porcelain                      → only the two ticket files Lisa owns
npm run recipes                             → 658 named, 0 inferred
npx vitest run                              → 8 files, 825 tests, green
npx vitest run src/lib/shopping.test.ts --reporter=verbose
                                            → 3/1082 unplaced: flat skewers, oak or hickory
                                              wood, metal skewers
```

Also record, per counter, the member count and the fact that every `items` array is empty:
21 / 28 / 20.

**Verifies:** the branch is green before this ticket, so any red afterwards is this ticket's.

---

## Step 1 — Round-trip probe on `counters.json`

Read `src/data/counters.json` with `json.load`, write it straight back with
`json.dumps(f, indent=2, ensure_ascii=False) + "\n"` **to a scratch path**, and diff against the
real file.

```
diff <(python3 -c '…dumps…') src/data/counters.json   → empty
```

**If it is not empty**, the serialiser does not match and the three blocks are edited by hand with
`Edit` instead. Do not proceed on a mismatch — a 1700-line noise diff would bury the real change.

**Verifies:** structure §2's serialisation contract. No file is written in this step.

---

## Step 2 — The thirteen `>> counters:` lines

For each file in structure §3, read the `>> counters:` line and append `, <Counter Name>`.
Thirteen `Edit` calls, one line each, nothing else touched.

Checks, in order:

```
grep -c '^>> counters:' <each file>                    → 1 (a second line would silently win/lose)
npm run recipes                                        → 658 named, 0 inferred, no throw
node scripts/check-recipes.mjs <the 13 files>          → all 13 file(s) draw a table
git diff -U0 -- recipes/ | grep '^[+-][^+-]' | grep -vc '^[+-]>> counters:'   → 0
```

Then the membership counts move to their targets:

```
The Soup Pot           21 → 24
Japanese Home Cooking  28 → 38
The Slow Cooker        20 → 20   (untouched)
```

And no other counter's membership changes — assert the full 21-counter count vector against the
Step 0 baseline, allowing only those two increases.

**Verifies:** D1's claim that every edit is additive.

---

## Step 3 — Commit the thirteen

```
lisa commit-ticket --ticket-id T-003-06 \
  --message "Put the three home dishes on the second board they were always cooked on" \
  --include recipes/soups/dashi.cook \
  --include recipes/soups/miso-soup.cook \
  … (13 exact repository-relative paths)
```

One commit, thirteen files, so a reviewer who rejects D1 reverts exactly this and nothing else.
No ordinary `git add`, no `git add -A`, no ordinary `git commit`. `src/generated/recipes.json` is
**not** included.

**Verifies:** `git status --porcelain` shows nothing of `recipes/` left staged, modified or
untracked.

---

## Step 4 — The three `sections` blocks

A single script that loads `counters.json`, replaces `sections` on `soup-pot`, `japanese-home` and
`slow-cooker` with the arrays in structure §2.1–2.3, and writes the file back with the Step 1
serialiser.

Checks:

```
git diff --stat -- src/data/counters.json      → one file
git diff -- src/data/counters.json | grep -c '^[+-]'   → confined to the three blocks;
                                                          read the hunk headers to confirm
python3 -c 'json.load(...)'                    → parses
```

Then the probe from structure §6, over the freshly-parsed `recipes.json`:

1. every listed slug exists → **0 unknown**
2. every listed slug names its counter → **0 borrowed-and-dropped**
3. every member appears in exactly one section → **0 unplaced, 0 duplicated**
4. no section titled `Also here` on the three → **0**
5. section titles and order match `counters.json` → identical

Expected item counts: `soup-pot` 16 · 6 · 0 · 2 = 24; `japanese-home` 6 · 6 · 6 · 7 · 7 · 6 = 38;
`slow-cooker` 18 · 1 · 0 · 1 = 20.

Plus the kit assertion for criterion 4:

```
set(kit == 'Slow Cooker')  ==  set(slugs listed on slow-cooker)  ==  set(members)   → all equal, 20
```

**Verifies:** criteria 1, 2, 3, 4, 5 at the data level.

---

## Step 5 — Commit `counters.json`

```
lisa commit-ticket --ticket-id T-003-06 \
  --message "Shelve the home wing in the sections its boards would print" \
  --include src/data/counters.json
```

One file. `src/data/aisles.json` is **not** included, because it is not modified (D6).

---

## Step 6 — Build, and read the three pages

```
npm run verify        → check ok · 658 parsed · 825 tests green · 682 pages
```

Then read the built HTML rather than the JSON, because the JSON is what was written and the HTML
is what a visitor sees:

```
dist/menu/soup-pot/index.html
dist/menu/japanese-home/index.html
dist/menu/slow-cooker/index.html
```

For each, extract and record in `progress.md`:

- the `<h2>` sequence, and that it equals the non-empty section titles from `counters.json` in
  order;
- that **no `<h2>` reads `Also` or `Also here`** — criterion 1;
- the count in `<p class="count">` against the number of `<li>` items;
- that every `data-slug` has a built page at `dist/<slug>/index.html` — criterion 5, checked
  against the render rather than the data.

Also confirm the three counters appear on the front page (`dist/index.html`) — 21 counters now.

**Verifies:** criteria 1, 5, 6, 7.

---

## Step 7 — `aisles.json`, stated rather than skipped

Re-run the coverage test after the build and record the output verbatim.

```
npx vitest run src/lib/shopping.test.ts --reporter=verbose
  → 3/1082 ingredients have no aisle: flat skewers (1), oak or hickory wood (1), metal skewers (1)
```

Assert the number is **identical to Step 0** — it must be, because no recipe was added and no
ingredient name changed — and spot-check that the sixteen names T-003-03 handed over and the eight
T-003-04 handed over each resolve to the aisle recorded in research §8. If any one of them resolves
to `other`, D6 is wrong and a pattern goes in; the plan branches there and only there.

**Verifies:** criterion 6, and turns "no change to `aisles.json`" into a measured statement.

---

## Testing strategy

**No unit test is added, and that is a decision rather than an omission.** This ticket writes data,
not code. A test asserting `nikujaga` is in 煮物 would be `counters.json` transcribed into
TypeScript: it would fail whenever the shelf was rearranged deliberately and pass whenever it was
rearranged wrongly. T-002-08 §4 reasoned the same way for the same file.

What guards the work instead:

| Property | Guard | Kind |
| --- | --- | --- |
| Counter names are real | `parse-recipes.mjs`, `collection.test.ts` | existing, automatic |
| Every recipe still draws a table | `check-recipes.mjs`, `layout.test.ts` | existing, automatic |
| Pairings still resolve and are mutual | `collection.test.ts` | existing, automatic |
| Aisle coverage under 2 % | `shopping.test.ts:163` | existing, automatic |
| Every page builds | `astro build` | existing, automatic |
| Listed slug exists **and names its counter** | Step 4 probe | written for this ticket |
| Every member placed exactly once | Step 4 probe | written for this ticket |
| No `Also` / `Also here` renders | Step 6, built HTML | read, not asserted by a test |
| The shelves read as shelves | Step 6, by eye | judgement |

The last row is the one nothing can automate, and it is the ticket's §4.

**The gap I am naming in advance:** nothing in the repo will stop the *next* shelf ticket from
listing a slug that does not name its counter and watching it vanish. That is the third time this
has cost a ticket a phase (T-002-08 §1, this ticket's D1). The fix is either a line in
`menuFor()` or an assertion in `collection.test.ts`, both `src/` changes, both outside this
ticket. It goes into `review.md` as an open concern for T-003-07, which may edit any file.

---

## Rollback

| To undo | Command | Result |
| --- | --- | --- |
| D1 only | `git revert <step-3 commit>` | shelves fall to 21 / 28 / 20; criteria 2 and 3 fail; sections still correct for everything that names its counter, and the three borrowed slugs drop out of the render silently |
| Everything | `git revert <step-5> <step-3>` | back to `c0fe6a4`, three pages rendering as one `Also` block each |

---

## Definition of done

All eight acceptance criteria addressed with evidence in `review.md`; criterion 8 answered honestly
(D1) rather than claimed. `npm run verify` green. Nothing of this ticket's staged, modified or
untracked. `review.md` + `review-disposition.json` written, `lisa check-disposition T-003-06` clean.
