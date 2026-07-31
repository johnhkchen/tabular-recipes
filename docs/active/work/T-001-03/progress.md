# T-001-03 — Progress

All seven planned steps done, plus one unplanned ninth commit pair the parallel tickets
forced. Sixteen `.cook` files written, every one checked before it was committed.

## Steps

| # | Step | Files | Commit | State |
| --- | --- | --- | --- | --- |
| 1 | Pad thai and its sauce | 2 | `b4c453b` | done |
| 2 | Red curry | 1 | `18e3f7c` | done |
| 3 | Yellow, panang, massaman pastes | 3 | `37e2723` | done |
| 4 | Yellow, panang, massaman curries | 3 | `755eac4` | done |
| 5 | Green curry paste | 1 | `e2ad203` | done |
| 6 | Tom yum and the three wok plates | 4 | `9ccacf5` | done |
| 7 | Som tum and larb gai | 2 | `c47278a` | done |
| 8a | Re-shelve the four wok plates | 4 moved in | `3be6557` | done, unplanned |
| 8b | Drop the folder they moved out of | 4 removed | `0c9265c` | done, unplanned |

## Deviations from the plan

**1. The wok plates moved folder mid-ticket, and `noodles-and-stir-fries/` is gone.**

`design.md` chose one new folder, `noodles-and-stir-fries/`, on the evidence available when
it was written: thirteen folders existed and none of them fitted a noodle plate. Between
step 6 and the final verification, **T-001-04 (Takeout Counter) completed** and its commits
created **`recipes/noodles/`** (`lo-mein`, `singapore-mei-fun`) and **`recipes/stir-fries/`**
(six dishes) with `>> category: Noodles` and `>> category: Stir-Fries`.

That left three folder names for two concepts. Rather than hand T-001-18 a vocabulary split
it would have to unpick — its acceptance criteria say *"no concept spelled two ways across
folders"* — the four files were moved onto the naming a completed ticket had already
established, and their `category:` lines rewritten to match:

| Was | Now | Category line |
| --- | --- | --- |
| `noodles-and-stir-fries/pad-thai.cook` | `noodles/pad-thai.cook` | `Noodles` |
| `noodles-and-stir-fries/pad-see-ew.cook` | `noodles/pad-see-ew.cook` | `Noodles` |
| `noodles-and-stir-fries/pad-kee-mao.cook` | `noodles/pad-kee-mao.cook` | `Noodles` |
| `noodles-and-stir-fries/pad-krapow.cook` | `stir-fries/pad-krapow.cook` | `Stir-Fries` |

All four re-checked after the move: `ok`, same row and column counts as before. Only this
ticket's own files were touched. `recipes/salads/` stays — nobody else made one.

**2. The move needed two commits, not one.** `lisa commit-ticket` refused four times, always
with `ordinary staged entries changed during verification`, when one call carried both the
new paths and the four now-deleted ones. The same paths split into two calls — adds first
(`3be6557`), then deletions (`0c9265c`) — both succeeded first time. Recorded because it
looks like a real edge in the transaction and the workaround is not obvious.

**3. One tree error, caught by the checker.** `pad-krapow` first shipped
`@&(~3)sauce{}` in step 4 where the sauce is two steps back, so step 1 fed two later steps
and `buildTree` refused it: *"A table is a tree."* Fixed to `~2` before the commit. Nothing
else needed a second pass.

**4. `plan.md`'s step 3 predicted panang at 14 rows; it came out at 13.** Miscount in the
blueprint, not a change to the file.

## What was verified, and when

Per step: `node scripts/check-recipes.mjs --labels <that step's files>`. All sixteen report
`ok` first time except `pad-krapow`, above. Row and column counts, all inside the 5–16 / 3–6
envelope:

```
pad-thai-sauce          7 x 4     thai-green-curry-paste   13 x 5
pad-thai               14 x 5     thai-yellow-curry-paste  12 x 5
thai-red-curry          9 x 6     panang-curry-paste       13 x 5
thai-yellow-curry      10 x 6     massaman-curry-paste     13 x 4
panang-curry            9 x 6     tom-yum-goong            12 x 6
massaman-curry         12 x 6     pad-see-ew               11 x 5
som-tum                11 x 6     pad-kee-mao              12 x 5
larb-gai               11 x 4     pad-krapow               14 x 5
```

At the end, over the whole collection — which by then held **312 files** rather than the 254
this ticket started against, because five other counter tickets landed work in parallel:

| Check | Result |
| --- | --- |
| `node scripts/check-recipes.mjs` | `all 312 file(s) draw a table.` |
| `npm run recipes` | `parsed 312 recipe(s) in 20 categories · 312 named, 0 inferred · pairings 205` |
| `grep -rl "Thai Kitchen" recipes/ \| wc -l` | **21** |
| every one of those 21 naming Thai Kitchen alone | 21 of 21 |
| `grep -c '~{'` over the sixteen | 0 in every file |
| `git status --porcelain -- recipes/` | empty |
| `npx vitest run` | 460 passed, **4 failed** — attribution in `review.md` |

`npm run recipes` failed once mid-ticket with
`nuoc-cham.cook pairs with "cha-gio", which is not a recipe here` — T-001-02's file reaching
for a dish it had not written yet. It passed once that ticket committed `cha-gio`. Nothing
to do with this work, and noted only because it makes the parse step unreliable as a gate
while fifteen tickets share a branch.

## Nothing left open in the code

No TODOs, no partial files, no ticket-owned file staged, modified or untracked. What remains
is hand-off, not work in progress, and it is written up in `review.md`:

- three operation verbs (`crack`, `bruise`, `dress`) that want a line in `src/lib/icons.ts`;
- three ingredients that want an aisle in `src/data/aisles.json`;
- the overlap between the new `thai-green-curry-paste` and the existing green curry's step 1;
- the sixteen slugs T-001-17 needs to file into the counter's menu sections.
