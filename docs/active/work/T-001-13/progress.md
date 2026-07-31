# T-001-13 — Progress

**Done.** 21 new `.cook` files, one new category folder, ten commits through
`lisa commit-ticket`. Nothing outside `recipes/**` was touched.

---

## Step 0 — Prove the format *(done)*

`ham-hock-stock.cook` written alone and run through the checker before anything else.
`ok … 8 rows x 4 cols`, no parser notes. Confirmed on one file rather than twenty-two:

- `>> step.N:` is 1-based over **all** paragraphs, including ones with no ingredients.
- `@&(~n)thing{}` counts back over all paragraphs too, not just operations.
- A paragraph with neither an ingredient nor a reference becomes a full-width header row
  (before the first operation) or footer row (after it).
- `--labels` prints the header text and the operation staircase, and nothing else.

**One deviation from `plan.md` found here and applied to every file after it.**
`icons.test.ts` takes the leading word of *every* step label — headers and footers
included, not just operations. `plan.md` only said "every step opens with a verb
`icons.ts` already knows"; the header and footer rows are prose sentences and it was not
obvious they counted. They do. Every header and footer in these files was therefore
rewritten to open on an imperative verb already in `VERB_ICONS` ("Cook this once and four
sides come out of it", "Pour the liquid left in the pot into a cup"). Audited at the end:
**zero** of the 21 files contributes a fall-through verb.

---

## Steps 1–8 — The batches *(all done)*

| # | Commit | Files |
| --- | --- | --- |
| 1 | `757a4c4` The pot of smoked pork, and the greens that come out of it | `ham-hock-stock`, `collard-greens` |
| 2 | `1e67e5c` Brine the chicken overnight and fry it, the most-ordered line on the list | `fried-chicken` |
| 3 | `d47c581` Macaroni and candied yams, the two starches the board calls vegetables | `macaroni-and-cheese`, `candied-yams` |
| 4 | `606b040` Write the onion gravy once, and smother the chops in it | `onion-gravy`, `smothered-pork-chops` |
| 5 | `b286819` Dressing every day, and the two biggest plates on the board | `cornbread-dressing`, `baked-turkey-wings`, `oxtails` |
| 6 | `f1e6168` Six more lines on the vegetable list, four of them out of one pot | `green-beans`, `fried-okra`, `stewed-squash`, `black-eyed-peas`, `butter-beans`, `creamed-corn` (+ label fix to `collard-greens`) |
| 7 | `0935471` Cream gravy, and the two meat-list regulars that need it | `cream-gravy`, `country-fried-steak`, `meatloaf` |
| 8 | `1ca39ee` Cobbler, sweet potato pie, and the potato salad at the cold end | `peach-cobbler`, `sweet-potato-pie`, `potato-salad` |
| — | `5709f6a` Drop the duplicate potato salad; the Deli's copy already shelves it here | *(deletion — see below)* |
| — | `b145746` Name the beef so the shopping list finds the butcher counter | `oxtails`, `country-fried-steak` |

Every batch passed `node scripts/check-recipes.mjs --labels <exact paths>` before it was
committed. All 21 files draw a table: between 5 and 16 ingredient rows and 4 or 5 columns
each, no parser warnings on any of them.

---

## Deviations from the plan

### 1. `potato-salad` was written, then removed — a genuine collision

`plan.md` step 8 included `recipes/dressings-and-dips/potato-salad.cook`, written and
committed in `1ca39ee`. `npm run recipes` then failed:

```
Error: two recipes share the slug "potato-salad" — that is the URL, so it has to be unique:
  recipes/dressings-and-dips/potato-salad.cook
  recipes/salads/potato-salad.cook
```

**T-001-14 (Deli) had committed `recipes/salads/potato-salad.cook` in `5352a97`, and its
`counters:` line already reads `Deli, Meat and Three`.** So the dish was already shelved
here by a ticket that owns it, in a better folder (`salads`), and my file was a duplicate
that broke the build for everybody on the branch.

Mine was deleted and the deletion committed through `lisa commit-ticket` (`5709f6a`). The
counter loses nothing — the Deli's file already carries it — and `npm run recipes` passes
again. This is exactly the "missing dependency edge in the DAG" the workflow doc names:
items 18 (potato salad, coleslaw, deviled eggs) sit at both counters and there is no edge
between T-001-13 and T-001-14. Recorded for T-001-18 in `review.md`.

Net effect on the criteria: none. `potato-salad` was item **18** on the ranked list,
below the item-11 line this ticket set for itself, and the count clears the floor without
it. The written total is therefore **21 files, not 22**.

### 2. Three leading verbs reworded after the fact

`strip` (collard greens), `snap` (green beans) and `drop` (peach cobbler) are not in
`VERB_ICONS` and this ticket may not touch `src/`. Reworded to `trim`, `trim` and
`spoon` before those batches landed, except `collard-greens` which was already committed
and was fixed in batch 6. `these` (black-eyed peas header) was reworded to `Cook these
plain` for the same reason, although that one was already in the collection's
fall-through list and would not have been new.

### 3. Two ingredients renamed for the shopping list

`oxtails` → `beef oxtails` and `cube steaks` → `beef cube steaks`. Both were falling
through `aisleFor()` to the "other" aisle; with the meat named they reach the butcher.
Honest names, not a workaround: the aisle table matches on what a shop calls the thing.

---

## Step 9 — Whole-collection cross-check *(done)*

| Check | Result |
| --- | --- |
| `node scripts/check-recipes.mjs` | **all 505 file(s) draw a table** |
| `npm run recipes` | parsed 505 recipes in 27 categories, 0 inferred counters, 0 warnings |
| duplicate slugs | none — `ls recipes/*/*.cook \| xargs -n1 basename \| sort \| uniq -d` is empty |
| `npx vitest run` | 4 failed / 641 passed — **the same 4 that failed before this ticket started**, see `review.md` |
| shelved at Meat and Three | **52** (floor 30) |
| exclusive to Meat and Three | **30** (floor 14) |
| every timer named | `grep -n '~{'` over the 21 → no output |
| required metadata | title/category/tags/servings/counters/aka/time/pairs-with present on all 21 |
| `git status --short recipes/` | nothing of this ticket's staged, modified or untracked |

---

## What remains

Nothing for this ticket. Items 12–20 of the ranked list are deliberately not written and
each is named with a reason in `review.md`; the Louisiana half of the board (red beans,
gumbo, étouffée, po-boy, boudin, cracklins, maque choux, chitterlings, gumbo z'herbes) is
the next natural piece of work and needs a dark roux and a New Orleans French bread under
it before any of it can be written honestly.
