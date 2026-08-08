# T-008-02 — Progress

All nine plan steps complete. Two commits. Three files changed, one file written and deleted.

| Step | State | Note |
| --- | --- | --- |
| Baseline | done | 664 files, 664 recipes, 11 washing-up, 2 counters need a look |
| 1 — counter entry | done | 22 counters, note 108/120 chars |
| 2 — gap page | done | one deviation, §Deviations below |
| 3 — commit one | done | `b646acf` |
| 4 — `counters.md` | done | one row + one entry |
| 5 — round-trip | done | `0 sections, 0/0 placed`, no `unparsed` |
| 6 — `.cook` probe | done | one deviation, §Deviations below |
| 7 — re-measure | done | 0 and 0, as the page says |
| 8 — commit two | done | `addd18d` |
| 9 — verification | done | see below |
| 10 — ranked list revised | done | `9bf59b9`, deviation 3 below |

---

## Baseline, recorded before anything was edited

```
$ node scripts/check-recipes.mjs   -> all 664 file(s) draw a table.   (0 FAIL lines)
$ node scripts/parse-recipes.mjs   -> parsed 664 recipe(s) in 27 categories
                                      counters: 664 named, 0 inferred from category ·
                                      timers in 640 · pairings 770 · washing-up in 11
$ node scripts/menu-sections.mjs   -> dry run ... 2 counter(s) need a look.
```

The two counters needing a look are One Pot and Cha Chaan Teng, both pre-existing and both named
in `docs/gaps/README.md`. Neither moved.

`node` is not on this environment's default PATH; every command was run with
`PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"`. Nothing in the repository was changed for it.

## Step 1 — `src/data/counters.json`

Twenty-second entry appended after Cha Chaan Teng. Nothing above it touched.

```
$ node -e "...print the last counter..."
counters: 22
last: The Air Fryer & the Pot air-fryer-and-pot []
sections: Straight out of the basket:0 | Start to finish in the pot:0 |
          Sheet-pan-shaped, in the basket:0 | Vegetables that go crisp:0 |
          Frozen things, done properly:0
note len 108

$ node scripts/parse-recipes.mjs
parsed 664 recipe(s) in 27 categories
  counters: 664 named, 0 inferred from category · timers in 640 · pairings 770 · washing-up in 11
```

**664 named / 0 inferred is the assertion that matters here.** It is the proof that the absent
`categories` fallback is genuinely absent: had one leaked in, recipes would have been pulled onto
this counter by category and the counts would have moved.

## Step 2 — `docs/gaps/air-fryer-and-pot.md`

Written to the shape in `structure.md` §3. 274 lines.

## Step 5 — the machine-read round trip

```
$ node scripts/menu-sections.mjs
  ok   The Air Fryer & the Pot: 0 sections, 0/0 placed
...
dry run — pass --write to fold these into counters.json
2 counter(s) need a look.
```

No `unparsed:`, no `unplaced ->`, no `listed but not shelved here ->`, and the problem count is
unchanged from the baseline at 2. `--write` was never run.

## Step 6 — the throwaway `.cook`, run and deleted

`recipes/fried-and-crispy/zz-air-fryer-probe.cook`, written with `>> counters: The Air Fryer & the
Pot`, `>> dish: karaage`, `>> kit: Air Fryer` and `>> washing-up: the basket, the bag`.

**With it present:**

```
$ node scripts/check-recipes.mjs
  ok   recipes/fried-and-crispy/zz-air-fryer-probe.cook  7 rows x 4 cols
all 665 file(s) draw a table.

$ node scripts/parse-recipes.mjs
parsed 665 recipe(s) in 27 categories
  counters: 665 named, 0 inferred from category · timers in 641 · pairings 770 · washing-up in 12

$ node -e "...print the karaage dish group..."
karaage             dish=karaage kit=null      counters=["Ramen Shop","The Bowl Shop","Japanese Home Cooking"]
                    variants=[{"slug":"zz-air-fryer-probe","title":"Karaage, Air Fryer",
                               "kit":"Air Fryer","washingUpCount":2}]
zz-air-fryer-probe  dish=karaage kit=Air Fryer counters=["The Air Fryer & the Pot"]
                    wash={"items":["the basket","the bag"],"count":2}
                    variants=[{"slug":"karaage","title":"Karaage","kit":null,"washingUpCount":null}]

$ npx vitest run src/lib/collection.test.ts
Test Files  1 passed (1)      Tests  11 passed (11)
```

Four things are proved, not asserted:

1. **`The Air Fryer & the Pot` is a counter name the collection accepts.** `collection.test.ts:29`
   fails any recipe naming a counter that does not exist, and it passed with a recipe naming this
   one.
2. **`kit: Air Fryer` beside a plain sibling does not throw.** `parse-recipes.mjs:198` throws when
   two files share a `dish` and neither declares a `kit:` line; `karaage` declares none and the
   probe does, so the group is legal. This is the build error the ticket says the writer will hit
   blind, and it is now demonstrated rather than described.
3. **`check-recipes.mjs` reports ok with it in**, at 665 files, 7 rows × 4 cols.
4. **The variant carries `washingUpCount: 2` onto the plain file.** That is the mechanism the whole
   story rests on — the page where the deep-fried original sits beside the basket version showing
   what each washes — and it works today with no new code.

**Then deleted, and the collection re-verified back to baseline:**

```
$ rm recipes/fried-and-crispy/zz-air-fryer-probe.cook
$ node scripts/parse-recipes.mjs   -> 664 recipes, 664 named, 0 inferred, washing-up in 11
$ node scripts/check-recipes.mjs   -> all 664 file(s) draw a table.
```

The file was never passed to `lisa commit-ticket` and does not appear in `git status`.

## Step 7 — the measurement, re-run

```
0 clear bar 3 by elapsed
0 clear bar 3 by >> time:
```

Matching the table published in the gap page. Bar 2's four failures were re-read off each file's
step prose by hand rather than scripted, per `research.md` §3.

## Step 9 — whole-collection verification

```
$ node scripts/check-recipes.mjs   -> all 664 file(s) draw a table.       (baseline: identical)
$ node scripts/parse-recipes.mjs   -> 664 recipes, 27 categories, 664 named, 0 inferred,
                                      timers in 640, pairings 770, washing-up in 11  (identical)
$ npx vitest run                   -> Test Files 13 passed (13) · Tests 980 passed (980)
$ npx astro build                  -> 688 page(s) built
$ git status --short                -> no ticket-owned file staged, modified or untracked
```

`astro build` was run although the plan called it optional, and 688 pages is the figure
`docs/gaps/README.md` records for the current tree. **The new counter adds no page**, which is
correct: `src/pages/menu/[counter].astro:16` filters on `menu.count > 0` and nothing names this
counter yet.

---

## Deviations from the plan

**1. The `## What it has` block cannot be closed with a `---` rule while its lists are empty.**

Found by running the round trip rather than by reading the parser. `menu-sections.mjs` treats
everything between `## What it has` and the next `##` as the block and splits it at each bold
lead-in, so whatever follows the last title lands in that title's chunk. With slugs present the
slug-first branch swallows the trailing prose and rule — which is why every other gap page gets
away with it. With the lists empty there is no slug, so the rule itself came back as
`unparsed: Frozen things, done properly: ---`.

Three shapes were tried and measured:

| Attempt | Result |
| --- | --- |
| prose after the titles, `---` rule closing the section | 2 unparsed lines |
| prose moved above the titles, `---` rule kept | 1 unparsed line — the rule |
| prose moved above the titles, an HTML comment explaining the missing rule | 1 unparsed line — the comment |
| **prose above the titles, nothing after the last one** | **clean** |

Adopted the fourth. The explanation lives in the prose above the titles instead, and says to put
the rule back once the lists have slugs in them. **A fifth shape was considered and rejected**:
leaving the prose below the titles and de-bolding it. It parses, but the paragraph contains the
link `[one-pot.md](one-pot.md)` and `one-pot` is a real slug, so the parser's fallback scan would
have shelved `one-pot` at this counter and reported it as *listed but not shelved here* — turning a
cosmetic warning into a counted problem.

**2. The probe had to be rewritten from the numbered step-label form to the inline one.**

The first draft used `>> step.1:` … `>> step.4:`, copied from `recipes/fried-and-crispy/karaage.cook`
as it read at the start of this session. `check-recipes.mjs` refused it —
*"`>> step.N:` is the numbered form, and it is gone"*. **`karaage.cook` had been migrated to
`>> step:` by a concurrent thread while this ticket was in Research**; T-009-02 (*move two thousand
labels*) landed as `9aa31a2` mid-session. Rewritten in the inline form, and three operation cells
were shortened to fit the 70-character cap. No project file was changed for it.

**3. The ranked list was extended from twenty to twenty-six, after re-reading the criterion.**

The first draft ranked fourteen basket dishes and six pot dishes: twenty ranks. The acceptance
criterion asks for *"a ranked missing list of at least 20 **air fryer** dishes"*, and six of those
twenty were Instant Pot dishes, so the list was twenty ranks and only fourteen air fryer ones.
Caught during the criterion-by-criterion pass before Review rather than by any checker.

Six were promoted out of *Also worth writing, lower down* into ranks 15 to 20 — `chicken-tikka`,
`shish-tawook` and `seekh-kabab` as kit variants, padrón peppers as a standalone, and
`crisped-marinated-tofu` and `crispy-roast-potatoes` as the two flagged ones — and the pot band was
renumbered 21 to 26. **The order was not shuffled to make the count**: the six promoted are the six
that were already at the top of the lower list, and the two flagged ones sit at 19 and 20 precisely
because they are the two that may not clear bar 1 at all. The page now ranks **twenty basket dishes
and six pot dishes, twenty-six with a kit-or-standalone call on every one.**

Committed separately as `9bf59b9` rather than folded into `b646acf`, so the revision is legible as
a revision.

---

## Concurrency, and one thing worth flagging

This branch is being worked by other threads at the same time and it moved twice underneath this
ticket:

- **T-009-02 migrated every step label** during Research, which is deviation 2 above.
- **`npx vitest run` failed twice mid-session** — `src/lib/step-labels.test.ts`, 2 of 979 —
  while `src/lib/step-labels.ts` and its test were dirty in the working tree. Checked out at
  `b646acf^`, `b646acf`, `a190d7c`, `4dc8e19` and `addd18d` in a scratch worktree, that file passes
  **27/27 at every one of them**, including both of this ticket's commits. Re-run after the other
  thread finished writing: **980/980 green.** It was a transient mid-edit state in another
  ticket's files and nothing to do with this change; recorded because a reviewer looking at a log
  would otherwise see a red run against this ticket's window.

Neither commit here touched a file another thread was holding. `lisa commit-ticket` was given
exact `--include` paths both times and the ordinary index was never used.
