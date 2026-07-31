# T-003-01 — Progress

## Status

| Step | State |
| --- | --- |
| 1. Append three counters to `src/data/counters.json` | done |
| 2. Whole-collection check unchanged | done |
| 3. Prove a `.cook` naming each new counter passes, then delete it | done |
| 4. Commit unit 1 — `src/data/counters.json` | done |
| 5. `docs/gaps/slow-cooker.md` | done |
| 6. `docs/gaps/japanese-home.md` | done |
| 7. `docs/gaps/soup-pot.md` | done |
| 8. Commit unit 2 — the three gap files | done |

---

## Step 1 — the three counter entries

Appended after `One Pot`, in ticket order. Key order `name`, `slug`, `blurb`, `categories`,
`sections`; every section `"items": []`.

```
$ node -e "const c=require('./src/data/counters.json').counters; console.log('count', c.length);
  console.log(c.slice(-3).map(x=>x.name+' / '+x.slug+' / '+x.sections.length+' sections / '+
  x.sections.reduce((n,s)=>n+s.items.length,0)+' items').join('\n'))"
count 21
The Soup Pot / soup-pot / 5 sections / 0 items
Japanese Home Cooking / japanese-home / 7 sections / 0 items
The Slow Cooker / slow-cooker / 5 sections / 0 items

titles with em-dash aside or trailing dot: 0

$ git diff --stat src/data/counters.json
 src/data/counters.json | 92 ++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 92 insertions(+)
```

**Deviation from the plan, recorded.** Plan and Structure both said the count goes 19 → 22. The
real starting count is **18** — fifteen S-001 storefronts plus the three T-002-01 opened — so it
goes **18 → 21**. The acceptance criterion is *"three more counters than T-002-01 left it with"*,
which is met either way; the wrong absolute was a miscount in Research §2 and has been corrected
in all four artifacts. Nothing about the edit changed.

## Step 2 — the whole collection, unchanged

```
$ node scripts/check-recipes.mjs | tail -3
  ok   recipes/vegetables-and-sides/stewed-squash.cook  8 rows x 5 cols

all 589 file(s) draw a table.
$ echo $?
0
```

**Second deviation, recorded.** Research measured 553 `.cook` files; the run reports 589. T-002-05,
T-002-06 and T-002-07 are writing Bowl Shop recipes on the same branch while this ticket runs, so
the total moves under it. The criterion is that every file is ok — it is, and the exit code is 0.
No file's verdict changed: widening `KNOWN_COUNTERS` can only make more counter names legal.

## Step 3 — the counter names, demonstrated

Throwaway file `recipes/soups/zzz-counter-name-proof.cook`, a real six-row table (the checker
requires four metadata keys, ≥3 ingredient rows and ≥3 operations, so a stub would have failed for
the wrong reason). Run once per counter name, plus a misspelling as a negative control so the three
`ok` lines prove the name was read rather than ignored.

```
=== counters: The Soup Pot ===
  ok   recipes/soups/zzz-counter-name-proof.cook  6 rows x 4 cols

all 1 file(s) draw a table.

=== counters: Japanese Home Cooking ===
  ok   recipes/soups/zzz-counter-name-proof.cook  6 rows x 4 cols

all 1 file(s) draw a table.

=== counters: The Slow Cooker ===
  ok   recipes/soups/zzz-counter-name-proof.cook  6 rows x 4 cols

all 1 file(s) draw a table.

=== counters: The Soup Pott ===   ← negative control
FAIL   recipes/soups/zzz-counter-name-proof.cook
       - unknown counter "The Soup Pott" — known: Bakery, Panadería, Taquería, Dim Sum Counter,
         Takeout Counter, Phở & Bánh Mì, Ramen Shop, Curry House, Thai Kitchen, Shawarma Counter,
         Pizzeria, Deli, Diner, Smokehouse, Meat and Three, The Bowl Shop, Instant Pot, One Pot,
         The Soup Pot, Japanese Home Cooking, The Slow Cooker

1 of 1 file(s) would not draw a table.
```

The failure message prints all 21 known names, which is independent confirmation that the three
new entries reached `KNOWN_COUNTERS` in the exact spelling the writers must type.

Deleted immediately, before any gap file was written:

```
$ rm recipes/soups/zzz-counter-name-proof.cook
$ git status --porcelain | grep '^.. recipes/' || echo "clean: no recipes/ entry"
clean: no recipes/ entry
```

## Step 4 — commit unit 1

`lisa commit-ticket --ticket-id T-003-01 --include src/data/counters.json`, message
*"Open the soup pot, the home kitchen and the slow cooker"*. Working tree checked before and
after: the only other entries are T-002-05 / T-002-07 ticket files and work directories belonging
to other threads, plus this ticket's own published work directory, none of which this ticket
touches or commits.

## Steps 5–7 — the three work lists

Written in the order the plan set: `slow-cooker.md` (grounded entirely in measured data),
`japanese-home.md`, then `soup-pot.md`.

Counts, checked against what each downstream writer has to hit:

| File | Criterion it feeds | Floor | Written |
| --- | --- | --- | --- |
| `slow-cooker.md` | T-003-05 ≥18 files, ≥12 naming a dish with an Instant Pot variant | 20 candidates / 12 IP | **32 candidates, 25 with an IP variant** |
| `japanese-home.md` | T-003-04 ≥22 files, ≥3 per section, ≥5 in 煮物 and 小鉢 | 22 / 3 / 5 | **41 ranked, 煮物 9, 小鉢 9, every section ≥4** |
| `soup-pot.md` | T-003-03 ≥20 soups, ≥12 老火湯, ≥5 滾湯 | 20 / 12 / 5 | **18 老火湯 + 10 滾湯 + 4 rice soups** |

Every slug named in all three files was resolved against `src/generated/recipes.json`; the check
and its output are in `review.md`.

**Third deviation, recorded.** Structure §3c said `slow-cooker.md` would state "0 recipes" like its
S-002 siblings. It does — but it does *not* copy `instant-pot.md`'s framing that the Instant Pot
shelf is empty, because 25 variants now exist. The file states the measured count and names all 25,
which is what makes T-003-05's three-way-choice criterion checkable rather than aspirational.

## Step 8 — commit unit 2

`lisa commit-ticket --ticket-id T-003-01` with three exact `--include` paths, message *"Three work
lists for the home wing"*. No ordinary `git add` or `git commit` was used at any point in this
ticket.

## Nothing left behind

Final `git status --porcelain` carries no `recipes/` entry, no `src/data/` entry and no
`docs/gaps/` entry. The remaining lines belong to other threads and were present before this
ticket started.
