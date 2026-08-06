# T-005-05 · Plan — the rows above and below

Twelve steps. Steps 1–3 are measurement and tooling, 4 is the judgement (the bulk), 5–11 are
seven commits, 12 is verification. Each step names what proves it.

---

## Step 1 — the baseline, frozen

```
npm run recipes
node …/dump-rows.mjs cols  > cols-before.txt
node …/dump-rows.mjs tsv   > rows-before.tsv
node …/dump-work.mjs       > work-list.txt
npm run check              > report-before.txt
```

**Verify:** `report-before.txt` ends `prose row 232`; `cols-before.txt` has 658 lines;
`rows-before.tsv` has 393.

Already done during Research. Re-taken at the top of Implement so the baseline is against the
tree as it actually stands when writing starts.

## Step 2 — `slack-echo.mjs`, and read what it flags

Write the tool (structure §2), run it, save `slack-echo.txt`.

**Verify:** the tool finds `tonkotsu-broth-instant-pot`, which the story names as the worked
example of a row and a slack line saying the same thing. If it does not, the threshold is wrong.

**Test strategy:** this is a net, not an assertion. Its only correctness requirement is that it
over-reports. Checked by confirming the known case appears and by reading the whole flagged list
rather than the top of it.

## Step 3 — `apply-rows.mjs`, proved before it is trusted

Write the tool with all thirteen guards (structure §2). Then prove each guard fires, against real
files, on a scratch copy — **never against the working tree**:

| Injection | Expected |
| --- | --- |
| a `was` that does not match the file | abort, naming path and step, nothing written |
| a `now` containing `@salt{1%tsp}` | abort on guard 6 |
| a `now` of 121 rendered characters | abort on guard 7, printing 121/120 |
| an empty `now` | abort on guard 7 |
| a `path` outside `recipes/` | abort on guard 1 |
| the same `path`+`step` twice | abort on guard 8 |
| a `source` of `paragraph` on a step that has a `step.N` line | abort on guard 5 |
| a valid row | file written, guards 9–13 pass, second run is a no-op |

**Verify:** each abort message quoted in `progress.md`; `git status --porcelain recipes/` empty
after the whole rehearsal.

## Step 4 — the judgement · `rows-after.tsv`

The ticket's actual work. Read `work-list.txt` shelf by shelf. For each of the 232 rows, split
into sentences and give each sentence one of four destinations (design §3), then write the
kept sentences as one row of ≤120 rendered characters.

Rules applied to every row before it is written down:

1. **Strike first what T-005-03 already took.** Four rows only —
   `boston-baked-beans-slow-cooker`, `baked-turkey-wings-slow-cooker`,
   `new-england-boiled-dinner-slow-cooker`, `soy-sauce-chicken-slow-cooker` — and the exact clause
   is quoted in `T-005-03/progress.md` §Step 8. It is struck, not re-moved.
2. **Check against the slack line printed underneath.** `slack-echo.txt` flags the candidates;
   where both say the same thing the row is what goes.
3. **Check against the operation cells.** A row that says what step 3's label already says is a
   restatement, not a header.
4. **Paragraph-sourced rows are written without mid-sentence commas** (design §4).
5. **Every sentence gets a disposition tag**, in columns 7 and 8, so the accounting totals.

**Verify:** 232 rows, every one with a non-empty `now`; the disposition columns total to 232 rows
and a countable number of moved and dropped sentences.

## Step 5 — braises · 70 rows

```
node …/apply-rows.mjs --check
node …/apply-rows.mjs --apply recipes/stews-and-braises
npm run recipes && npm run check | tail -3
git diff --numstat recipes/stews-and-braises | …
lisa commit-ticket --ticket-id T-005-05 --message "…" --include <each path>
```

**Verify:** `prose row` drops by exactly 70; every changed file shows a one-site diff;
`git status --porcelain recipes/` empty after the commit.

## Step 6 — soups · 47 rows

Same shape. **Verify:** `prose row` drops by 47.

The Cantonese soup shelf is where T-005-01's 12 unowned over-cap ingredient notes live. They are
**not** touched here — this ticket owns prose rows. Confirmed by `ingredient note 17` being
unchanged in `report-after.txt`.

## Step 7 — rice, beans and grains · 26 rows

Same shape. **Verify:** `prose row` drops by 26; `boston-baked-beans-slow-cooker`'s 730-character
header, the collection's worst single row and the story's headline case, is now ≤120.

## Step 8 — vegetables, salads, dressings · 34 rows

**Verify:** `prose row` drops by 34.

## Step 9 — the fried and the baked · 20 rows

fried-and-crispy, pizzas, breads, flatbreads-and-pancakes, dumplings-and-rolls.
**Verify:** `prose row` drops by 20.

## Step 10 — noodles, pasta, eggs, sauces, and the rest · 35 rows

noodles, pasta, eggs, sauces-and-gravies, custards-and-puddings, smoked-and-grilled,
toppings-and-pickles, spice-blends-and-marinades.

**Verify:** `prose row 0` in `npm run check`. This is the last `.cook` commit, so the whole field
is clean here.

## Step 11 — the shelf · `src/data/counters.json`

Every sentence tagged `moved` in `rows-after.tsv` column 7, written as a note on the named section.

```
npm run recipes     # the validator runs here: cap, slug in items, slug shelved at this counter
```

**Verify:** `npm run recipes` exits 0; the note count is exactly 5 + the number of `moved` rows;
no note over 120; `git diff` on `counters.json` shows only `notes` keys added.

**Test strategy:** the validator is the test and it is already proved — T-005-03 fired all six of
its branches and quoted the messages. What is added here is data, so what needs checking is that
the data passes the existing gate and that the menu pages still build.

## Step 12 — verification, and the proofs the criteria name

| Criterion | Command | Expected |
| --- | --- | --- |
| every prose row at or under cap | `npm run check` | `prose row 0` |
| before/after counts and means, headers and footers separately | `dump-rows.mjs stats` | both distributions, same method as the story |
| the merge tree is unchanged | `dump-rows.mjs cols > cols-after.txt; diff cols-before.txt cols-after.txt` | **empty** |
| `findTilingErrors` holds | `npm run check` | `all 658 file(s) draw a table.` |
| the suite and the build | `npm run verify` | exit 0, 833 tests, 682 pages |
| the phone | `npm run verify:mobile` | exit 0 at 375/390/768 |
| only prose rows and `counters.json` | `git status`, `git show --stat` on all seven commits | `recipes/**/*.cook` + `src/data/counters.json` and nothing else |

`npm run verify:mobile` runs `npm run build` first. T-005-03 recorded that a build running
alongside makes it exit **2** — *"Nothing above is evidence either way"* — which is the script's
guard, not a failure. If that happens, re-run against a frozen `dist` via the `--root` flag both
scripts accept, and say so in the artifact.

## Testing strategy, stated once

**No new vitest file, and that is a decision**, matching T-005-01, T-005-03 and T-005-04. The
suite under `src/lib/` covers the pure libraries; this ticket writes no code that ships. The two
things that could silently be wrong are:

1. **The measurement** — answered by two independent counting paths that must agree:
   `npm run check`'s `prose row` tally (via `measure()`), and `dump-rows.mjs stats` (via
   `buildTree` directly). Two code paths, same number, at every step.
2. **The tree moving under an edit** — answered by `cols-before` vs `cols-after`, which is not a
   summary statistic but the whole tree of all 658 recipes, and by guard 13 firing per file at
   write time.

What no test can check is whether a shortened row still says the useful thing. That is answered
the way T-005-04 answered it: `rows-after.tsv` is the deliverable in one readable file, a random
sample is quoted in full in `progress.md`, and the reasoning for the borderline calls is written
out rather than summarised.

## What would make this ticket block

- The column dump differs after the edits and the cause is not immediately a fixable mistake.
- A row cannot be brought under 120 without losing a fact that exists nowhere else and has no
  counter to move to.
- `counters.json`'s validator rejects a note for a reason that needs a section to be re-shelved,
  which is not this ticket's file.

None of these is expected. If one happens, the disposition is `block` with the file named.
