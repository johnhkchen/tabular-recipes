# T-011-01 — Progress

## Done

| Step | Status | Notes |
| --- | --- | --- |
| 1 — Pin the measurements | done | Re-run immediately before writing; 664-recipe build |
| 2 — Pin the arithmetic | done | 17 cases, then re-run over every figure the file prints |
| 3 — Write `docs/knowledge/scaling.md` | done | 504 lines, nine sections |
| 4 — Commit through `lisa commit-ticket` | done | One `--include` |
| 5 — Review | in progress | — |

`docs/knowledge/scaling.md` is the only source file touched. Nothing in `src/`, `recipes/`,
`scripts/` or `docs/knowledge/counters.md` was modified. `src/generated/recipes.json` was rebuilt
twice with `npm run recipes` to take measurements; it is gitignored.

---

## Deviations from the plan

### 1. The model gained a result the plan did not anticipate, and it corrected the file

Plan step 3 ordered §2 first because four sections quote it. That held, and the check paid for
itself: verifying §7 against the formula caught **a wrong claim in the first draft.**

The draft said the wok in `beef-with-broccoli` "costs eight minutes". Subtracting the no-capacity
answer showed it costs **nothing** — 42 minutes either way. Working out why produced the sharpest
statement in the file:

```
cost of the vessel = A_batch·(r − 1) + H_batch·(r − m)
```

`r ≥ m` always, so the second term is only a part-full last batch. **A vessel that binds on a wait
is expensive; a vessel that binds on work is free.** The air fryer's capacity costs 40 minutes at
twelve portions; the wok's and the deep fryer's cost zero.

Three changes followed, all in the deliverable:

- **§2** gained a subsection, *What the vessel actually costs, which is less often than it looks*,
  with the formula and the wait-versus-work test. It also gives T-011-03 a filter: most of the 55
  files that mention batching do not need a `>> capacity:` at all.
- **§3** gained a closing check — the same twelve portions with no capacity is also 42 minutes.
- **§7** and the phrasebook were corrected. The air fryer block now prints the vessel cost
  explicitly (40 against 0) instead of comparing two totals, which was a weaker and slightly
  misleading contrast. The phrasebook gained a twelfth row: *"It goes in three lots, and that is the
  only difference."*

This is the ticket's own instruction working — *"Then attack it. Find the cases where it fails"* —
applied to the file's own arithmetic rather than only to the kitchen.

### 2. Five worked dishes, not four

`design.md` Decision 2 settled this before Implement. Four is the acceptance floor;
`beef-with-broccoli` is the fifth because it is the only candidate whose capacity is readable from
its own words, which is what makes §3 hand-checkable.

### 3. The air fryer pole is an illustration, not a recipe

Recorded in `plan.md` and stated twice in the deliverable (§7, §9). **No air fryer `.cook` file
exists** — T-008-04 writes them and T-011-01 `depends_on: []`, so this ticket runs first by design.
The pole is worked from `karaage` (named by slug in `docs/gaps/air-fryer-and-pot.md` as the parent
of the basket variant) plus that file's measured basket figures. No capacity was invented for any
recipe.

A transient `recipes/fried-and-crispy/zz-air-fryer-probe.cook` from a concurrent thread existed for
part of this session and was removed by that thread; it was never in git and is not cited.

### 4. Two counts corrected mid-flight

- `UNATTENDED` is **53** words, not 48. Counted from `src/lib/time.ts`; the earlier figure was an
  estimate that reached `research.md` and was corrected there, in `design.md`, in `structure.md` and
  in the deliverable.
- `handsOnEvidence` splits **46 / 223 / 395** on the 664-recipe build. The 224 in the first pass was
  the 665-file build that included the probe.

---

## Verification run

| Check | Result |
| --- | --- |
| `A + H ≥ totalMinutes`, gap `= H − H_cp` | Holds on all 7 measured slugs |
| Every figure in §3, §7, §8 reproduced by script | 17 of 17 match, including the two rounded columns |
| Cited paths exist | 12 of 12 |
| `plan.ts:47` and `list.astro:925` still say what the file quotes | Both confirmed verbatim |
| No notation in the phrasebook's right column | Clean — grepped for `O(`, backticks, symbols, `×`, `≈`, `≤`, `≥` |
| Vocabulary counts | `UNATTENDED` 53, `HANDS_ON` 24 |
| Batch prose counts | 55 files mention batches, 23 say `in two batches` |
| Nothing else modified | `git status` clean for `src/`, `recipes/`, `scripts/` |

`npm run verify` was **not** run, per `plan.md`: it runs vitest over `src/lib/`, which two other
threads are mid-edit in. `npm run recipes` parsed 664 recipes in 27 categories cleanly, which is the
only build step this ticket's inputs touch.

---

## Commit

```
lisa commit-ticket --ticket-id T-011-01 \
  --message "Write the cost of cooking more down" \
  --include docs/knowledge/scaling.md
```
