# T-002-01 — Progress

All three steps done, three commits through `lisa commit-ticket`, working tree clean.

| Step | State | Commit |
| --- | --- | --- |
| 0. Baseline | done | — |
| 1. Open the three counters | done | `614b5b3` |
| 2. Teach the clock about pressure | done | `4a2cc36` |
| 3. Write the three work lists | done | `e9d9e7c` |
| 4. Final gate | done | — |

---

## Step 0 — baseline

```
node scripts/check-recipes.mjs   → all 514 file(s) draw a table.
npx vitest run                   → Test Files 7 passed (7) · Tests 666 passed (666)
node scripts/menu-sections.mjs   → 15 counters, every one fully placed, "every counter parsed cleanly."
```

---

## Step 1 — `src/data/counters.json`

Three entries appended after `Meat and Three`, five keys each in the fifteen's order.

```
The Bowl Shop | bowl-shop   | cats [] | 7 sections | all items empty | "Pick a base, pile it up, dress it last."
Instant Pot   | instant-pot | cats [] | 6 sections | all items empty | "Lock the lid and walk away; it gets there on its own."
One Pot       | one-pot     | cats [] | 5 sections | all items empty | "Everything goes in one pan, and that is the only pan to wash."
```

**Verification**

```
counters.length: 18 · dup names 0 · dup slugs 0 · key order ok · no " — " in any title
node scripts/check-recipes.mjs   → all 514 file(s) draw a table.          (AC 2)
node scripts/parse-recipes.mjs   → parsed 514 recipe(s) in 27 categories
                                   counters: 514 named, 0 inferred from category
npx vitest run                   → 666 passed
git status                       → src/generated/recipes.json unchanged
```

`0 inferred from category` is the number that proves `categories: []` re-shelved nothing.

**AC 3 — a `.cook` file naming the three new counters passes its check.** One throwaway file,
written to the session scratchpad *outside the repository*, naming all three on one line:

```
>> counters: The Bowl Shop, Instant Pot, One Pot
```

```
$ node scripts/check-recipes.mjs …/throwaway-bowl.cook
  ok   …/scratchpad/throwaway-bowl.cook  10 rows x 3 cols

all 1 file(s) draw a table.
```

Negative control, same file with `>> counters: Bowl Shop` (the wrong name):

```
$ node scripts/check-recipes.mjs …/throwaway-typo.cook
FAIL   …/scratchpad/throwaway-typo.cook
       - unknown counter "Bowl Shop" — known: Bakery, Panadería, Taquería, Dim Sum Counter,
         Takeout Counter, Phở & Bánh Mì, Ramen Shop, Curry House, Thai Kitchen, Shawarma Counter,
         Pizzeria, Deli, Diner, Smokehouse, Meat and Three, The Bowl Shop, Instant Pot, One Pot

1 of 1 file(s) would not draw a table.
```

Both files deleted. Nothing was created under `recipes/`, so `parse-recipes.mjs` never saw them
and the 514 count could not move.

---

## Step 2 — `src/lib/time.ts`

Nine words added to `UNATTENDED`, in the normalised form `normalise()` produces:

```
'pressure', 'pressurecook', 'pressurecooking', 'pressurerelease', 'naturalrelease',
'naturalpressurerelease', 'quickrelease', 'cometopressure', 'keepwarm',
```

plus a comment above the set explaining why `pressure` is trusted bare and why `release` and
`seal` are not. `HANDS_ON`, `NOT_A_VERB_IN_A_SENTENCE`, every function body and every export are
untouched.

**Verification.** Full transcript in `pressure-check-output.txt`; summary:

```
AC 5 — the two cases the ticket names
  ok   ~pressure cook{35%min}          → { unattended, name }
  ok   ~natural release{15%min}        → { unattended, name }
AC 5 — the rest of the vocabulary
  ok   ~quick release · ~come to pressure · ~natural pressure release · ~keep warm
  ok   ~pressure cook, with a step that says otherwise
the unnamed-timer path the bare word exists for
  ok   cook at high pressure 35 min    → { unattended, label }
  ok   lock the lid and bring to pressure
regressions the change must not have caused
  ok   unknown name still falls through (blind bake / bake the shell 20 min)
  ok   unknown name over a hands-on step
  ok   bare "release" is not a wait  (cook until the mushrooms release their liquid)
  ok   bare "release" beside a hands-on verb
  ok   ajitama's shell release is not a wait
  ok   bare "seal" is not a wait · bare "vent" is not a wait
  ok   a dry skillet is still a pan · the hot iron is still your hands
  ok   each timer still gets only its own words (saute 8 min | pressure cook 35 min)

all assertions passed.
```

```
npx vitest run                 → 666 passed, unchanged
node scripts/check-recipes.mjs → all 514 file(s) draw a table.
```

**Deviation from the plan, recorded.** One assertion in the throwaway script was written wrong,
not the code: `attentionOf(null, 'cook until the mushrooms release their liquid, 8 min')` returns
`source: 'default'`, not `'label'`, because `cook` is in neither vocabulary. The property under
test — that it is **not** unattended — held. The expectation was corrected and a second case
added with a real hands-on verb (`stir until …`) to cover the `'label'` path.

---

## Step 3 — `docs/gaps/bowl-shop.md`, `instant-pot.md`, `one-pot.md`

Created in the planned order: instant-pot (hard numeric criterion first), one-pot, bowl-shop.
174 / 180 / 166 lines, against the fifteen's 78–120 — longer because the already-here block is
the part that stops six writers rewriting what exists.

Each uses `## What is already here` rather than `## What it has`, with a line in the file saying
why and what T-002-08 does about it (design D3.1).

**Verification — every slug in an already-here block is real:**

```
bowl-shop    116 slug tokens, 116 unique, 0 duplicates, 0 not-a-slug
instant-pot   72 slug tokens,  72 unique, 0 duplicates, 0 not-a-slug
one-pot      114 slug tokens, 114 unique, 0 duplicates, 0 not-a-slug
```

**AC 6 — the Instant Pot ranked list:** **58 distinct existing slugs**, all real, against the 25
required.

**`menu-sections.mjs` is undisturbed.** All fifteen existing counters still report `ok` with the
same section counts and `N/N placed` (Bakery 107/107, Deli 62/62, Diner 77/77, Meat and Three
53/53, …). The only new lines are the three expected ones:

```
  --   The Bowl Shop: gap note has no "What it has" block
  --   Instant Pot: gap note has no "What it has" block
  --   One Pot: gap note has no "What it has" block
3 counter(s) need a look.
```

The script's summary line therefore changes from `every counter parsed cleanly` to
`3 counter(s) need a look`. This is unavoidable while the shelves are empty — without the gap
notes it would say `no gap note` for the same three — and it clears when T-002-08 stocks them.
The script is not in `npm run verify` and cannot fail CI.

**Two counts corrected after a first draft** by re-counting from the files themselves rather than
from the plan's estimates: the Bowl Shop lede now says 116 (not "around 130"), One Pot says 114
(not 86), and the Instant Pot total says 58 (not 57).

---

## Step 4 — final gate

```
npm run verify
  all 514 file(s) draw a table.
  parsed 514 recipe(s) in 27 categories
    counters: 514 named, 0 inferred from category · timers in 491 · pairings 558
  Test Files  7 passed (7) · Tests  666 passed (666)
  [build] 532 page(s) built
```

`dist/menu/` holds the same **fifteen** directories as before. No `bowl-shop`, `instant-pot` or
`one-pot` page was generated, which is the intended consequence of empty sections
(`counters.ts:109-114`, `[counter].astro:12-18`).

`git status --porcelain` → **empty**. No ticket-owned file left staged, modified or untracked.

---

## One thing that happened outside this ticket

Between step 2 and step 3, a concurrent session committed `0eba542 "Draft the board for cooking to
a labour outcome"` on this branch. That commit drafted story S-003 and seven T-003 tickets — and
it also swept in the three `docs/gaps/*.md` files while they were still in my working tree, plus
Lisa's published `docs/active/work/T-002-01/` artifacts. The content it captured was mine and
correct at that moment; my remaining edits (the three count corrections above) went through
`lisa commit-ticket` as `e9d9e7c` in the normal way, and the tree is clean.

Nothing needs undoing. It is recorded because it is exactly the ordinary-index hazard the workflow
warns about (`rdspi-workflow.md:45,134-136`) arriving from the other direction — a broad commit in
another pane picking up a ticket thread's in-progress files.
