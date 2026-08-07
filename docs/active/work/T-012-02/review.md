# T-012-02 — Review

Read 685 recipes against the three cooks in `docs/knowledge/cooks.md`, measured five things the
ticket asked for, ranked four capabilities, and held five running stories against three people.
**Two commits, four files, no source changed and nothing on the board edited.**

## What changed

| File | Action | Why |
| --- | --- | --- |
| `docs/gaps/what-the-shelf-offers.md` | **new**, ~430 lines | The reading. Fourth whole-shelf pass, first taken from outside the collection looking in. |
| `docs/active/work/T-012-02/read-the-shelf.ts` | **new**, ~470 lines | The measurement. Produces every number in the reading. Reads three files, writes none. |
| `docs/active/work/T-012-02/reading-output.txt` | **new**, 574 lines | Its full output, so a sceptic can diff rather than re-derive. |
| `docs/gaps/README.md` | edited, **+21, −0** | One pointer, at the end of `## The five gaps to fill first`. |

**No `.cook` file, no `src/`, no `scripts/`, no story, no ticket.** That answers the ticket's last
acceptance criterion: the list of files outside `docs/gaps/**` and `docs/active/work/T-012-02/**`
is empty.

Commits, both through `lisa commit-ticket` with exact `--include` paths:
`875c4a8` *Read the shelf against the three cooks*, `9cf7a07` *Point the gaps list at the reading*.
`git status --porcelain` leaves nothing of this ticket's staged, modified or untracked.

## `npm run verify`, before and after

Both pass, exit 0, identical:

```
all 685 file(s) draw a table.
parsed 685 recipe(s) in 27 categories -> src/generated/recipes.json
 Test Files  16 passed (16)      Tests  1104 passed (1104)
[build] 710 page(s) built in 713ms
```

Nothing this ticket wrote is read by the build except `docs/gaps/` via `scripts/menu-sections.mjs`,
and that path was checked directly: the new file has **zero** `## What it has` blocks, and the dry
run reports the same three counters needing a look as before (One Pot, Cha Chaan Teng, The Air
Fryer & the Pot — all pre-existing, the third from S-008). The new file is not named in its output.

---

## Acceptance criteria, against evidence

### The plant count, from ingredient lists, not folder names ✅

Counted from `ingredientNames` with a four-band vocabulary. **The residue is 0 of 1,081 names**,
which is what licenses the distinct count as a count and not a sample.

| Reported | |
| --- | --: |
| Distinct plants, all bands | **130** |
| Non-starch band-A plant food | **71** |
| **Distinct non-starch plants that ever carry a dish** | **23** |
| Savoury dishes built on a non-starch plant | **47** |
| — of those, a vegetable side | **16** |
| Sweets, re-derived from categories | **101** |

**The cattle claim is confirmed** — 101 sweets to 47 plant-built savoury dishes, 2.2 to 1 — and
S-012's *roughly eight* is corrected upward to 16 sides while the conclusion stands. The
`charred-broccoli` / `candied-yams` test is run in both directions: the folder is one-third starch,
and the rule finds twice as many plant dishes outside `vegetables-and-sides` as inside it.

### The pulse count ✅

**72** files mention a pulse on the loosest reading (larger than the ticket's 43, and the reading
says why: *bean* is doing four jobs). **29** through gate 1, **19** through gate 2, and **14
dishes** once kit siblings are folded. Every one of the ten gate-2 drops carries a reason;
`sweet-tart-shell`, whose beans are pie weights, is the clearest false positive on the shelf.

### Each persona run as a query, answered with slugs ✅

**Cooking for the day.** The assumed kitchen is printed in full — `staples.json`'s 31, plus a
19-pattern cupboard and a 23-pattern fridge, both listed item by item before any slug. The answer
is **2 recipes**: `horlicks` and `hong-kong-egg-sandwich`. Four sensitivity runs are published and
**the answer does not move** when tomatoes and potatoes are added, which is what makes it a result
about the shelf rather than about the assumption.

**The family rotation.** Seven named nights, and a computed ceiling of **11**.

**Holiday guests.** **34** recipes with a hand-off-able branch, listed as slugs, with the branch
described for the first three.

### The week for four, and what ran out ✅

Done by hand, seven slugs with servings, protein and counters. It works with no protein repeat.
Four of the seven share One Pot and the reading says so rather than hiding it. **What runs out is
fish** — nine recipes across five counters, five of them Japanese and one a tinned-tuna casserole —
and behind it the vegetable side, since a seven-night rotation exhausts a quarter of the sixteen.

### The multi-cook count, computed from `buildSchedule`'s lanes ✅

`buildSchedule` is imported and run over all 685 records; nothing is reimplemented. **200 raw lanes
→ 34 filtered branches**, with the three filter conditions stated and `BREAK_MINUTES` reused rather
than a second threshold invented. **275 recipes cannot answer at all** and are reported as
cannot-say rather than zero.

### The four capabilities, ranked ✅

Ranked 1 hand-off (34) · 2 rotation (11 nights, 248 dinners) · 3 balance (16 · 47 · 23) · 4 fridge
(2). Each carries needs / stands-on / day-one / food-first. The veto is applied to 3 and 4 with a
number rather than a warning, and the reading says plainly that **the honest answer for two of the
four is write food before writing features**, with the shortest path listed.

### Every board conflict named, nothing edited ✅

Five running stories held against three cooks with `cooks.md`'s own passes/fails/cannot-say
instrument. S-011 × T-011-06 is written first and at length. Also named: T-011-02/03, T-011-04
(with a recommendation *not* to cut it), T-010-03, T-008-04/05, and T-013-01/02/03. Plus one
board-level finding that belongs to no single story — three of five running stories are building a
control that offers a choice, to a person whose cost *is* the deciding.

### Recorded where the readings live, README points to it ✅

`docs/gaps/what-the-shelf-offers.md`, with `soup-pot.md` as the precedent for a non-counter file in
that directory. `docs/gaps/README.md` gains a sixth-gap subsection at the end of the five-gaps
list, which is where the next pass looks for work.

---

## Test coverage

**There is none to add, and that is correct rather than a gap.** This ticket writes no code the
repo keeps: `scripts/` is out of bounds by acceptance criterion, and the measurement is a one-time
reading like T-001-18's and T-003-07's before it. A permanent script would be a tool the repo has
to keep green forever in exchange for a report nobody re-runs.

What stands in for tests:

1. **The residue check.** The script prints every unclassified ingredient name. Driven to 0 of
   1,081 in two passes. An unclassified name is a plant the count would silently miss.
2. **Three hand-walks** of the branch filter against the recipes' own tables — one expected
   multi-branch (`mole-poblano`), one expected single (`beef-with-broccoli`), one expected false
   positive under the raw count (`charred-broccoli`, the ticket's own example). All three agree
   with the filter.
3. **Every slug spot-checked** against its `.cook` file where the reading names it as an answer.
4. **`npm run verify`** before and after, identical.

## Open concerns

### 1. The hand correction to the plant rule is 68% of the pool — larger than the plan's trigger

`plan.md` said: if the correction exceeds about a third, the rule is wrong and design §3 gets
revisited before publishing. It is 100 dropped and 2 added out of 147. **The rule was revisited**
and the resolution is in the reading rather than in a tuned rule: both machine tests do what they
were designed to do — find recipes where a plant is *prominent* — and *built on* is a narrower
thing that no available rule separates. So they are kept as a **candidate generator**, both numbers
are published, and all four drop classes are named with examples.

**This is the finding most open to disagreement**, and the reading is written so a reader can
disagree with a specific line: every drop class is enumerated and the 47 are listed by slug. If a
reviewer thinks the 34 condiments or the 20 fruit desserts belong in the count, the numbers to add
are printed.

### 2. Two mid-flight defects in my own measurement, both caught by hand-checking rather than by design

Recorded in `progress.md` and worth a reviewer's attention because both would have published a
wrong number:

- **Lane hands-on was over-counted** — `task.attention` labels a whole step hands-on when any timer
  in it is, so a 128-minute step that is 8 minutes of work read as a two-hour hand-off branch.
  Fixed by importing `readTimers` and splitting timer by timer. Moved the count 35 → 34.
- **Stock and sauce were read as the protein of a dish** — `chicken stock` made a risotto a chicken
  dinner, `fish sauce` made every Vietnamese recipe a fish one. Fixed with an exclusion list. Moved
  fish from 9 reachable counters to 5.

**Both were found by reading example slugs rather than totals.** A third such defect surviving is
the most likely way this reading is wrong.

### 3. Two numbers are floors, because two tickets are mid-flight

`capacity` is **0 of 685** (T-011-02 in `implement`, nothing landed) and `keeps` is **138 of 685**
(T-011-04 in `implement`, moved 102 → 138 during this ticket's own working session). The reading
says both are floors and names the tickets. Anything built on the batching half of persona three's
question will need re-reading once T-011-02 lands.

### 4. "Cuisine" is approximated by `counters`, and a counter is a shop

The week exercise needed cuisines and the collection has none. `counters` is the nearest thing and
it is not the same thing — One Pot is not a shop at all but one of the four *bargains*. The reading
states the substitution, shows where the week bends because of it, and flags **"the collection has
no cuisine field"** as the one thing a rotation feature would need and cannot read today. A
reviewer who wants the eleven-night ceiling recomputed on real cuisines will need that field first.

### 5. The assumed kitchen is a judgement, and it is the reading's largest single assumption

42 patterns beyond `staples.json`'s 31. It is printed in full, capped deliberately, and its
sensitivity is published — the answer is 2 with the fridge, 2 with tomatoes and potatoes added, 0
on staples alone. **The result is robust to widening but was never tested against narrowing beyond
staples-only.** A reviewer who thinks the cupboard is too generous should note that a smaller
kitchen only makes the answer smaller than 2.

## Nothing needing human attention before this ticket completes

No defect was introduced, nothing on the board was touched, `npm run verify` passes identically,
and every number in the reading is reproducible by one command. The five concerns above are the
reading's own limits, stated where a later pass will find them — which is what the artifact is for.
