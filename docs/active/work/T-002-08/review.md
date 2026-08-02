# T-002-08 — Review

Three shelves that rendered nothing now render as menus: **The Bowl Shop 103**, **One Pot 72**,
**Instant Pot 25**. `npm run verify` is green end to end — 658 files draw a table, 825 tests
pass, 682 pages build. Four commits, all through `lisa commit-ticket` with exact `--include`
paths. **One acceptance criterion is knowingly not met**, and that is §1.

---

## 1. Read this first: the ticket's last criterion is not met

> *Only `src/data/counters.json` and `src/data/aisles.json` are modified.*

**119 `.cook` files were also modified — one metadata line each.** Nothing else in any of them
changed: `git diff -U0 7e1efd1..HEAD -- recipes/ | grep '^[+-][^+-]' | grep -vc '^[+-]>> counters:'`
returns **0**. Every edit is of this shape:

```
- >> counters: Meat and Three, Diner
+ >> counters: Meat and Three, Diner, One Pot
```

### Why, in four sentences

`src/lib/counters.ts:74` builds a menu from `all.filter(r => r.counters.includes(counter.name))`
and then looks section items up **inside that set**, so a slug listed in `counters.json` that does
not name the counter is silently dropped. The fallback the ticket points at — *"that is how
Panadería's page worked"* — is dead: `npm run recipes` reports `658 named, 0 inferred from
category`. So with the criterion held, One Pot tops out at the 14 recipes T-002-04 wrote (the
criterion asks for 25 with the majority pre-existing) and the Bowl Shop's dressing section renders
nothing at all (the criterion asks for it by name). Criteria 2, 3 and 8 cannot all be satisfied,
and 8 is the one whose stated purpose — *"No writer ticket was allowed to touch either, which is
why this is safe to do all at once"* — is a concurrency argument that no longer applies, because
all six writer tickets are sealed.

### The evidence that this is what was planned, not a shortcut

1. **`docs/active/work/T-002-07/design.md` §5**, the handoff written for this ticket, opens:
   *"For T-002-08. These need a `>> counters: The Bowl Shop` line and no rewriting."* Thirty
   slugs follow.
2. **`docs/gaps/one-pot.md` as T-002-01 wrote it** (now rewritten by this ticket; the original is
   at `git show ac9236e^:docs/gaps/one-pot.md`, lines 21-25): *"no recipe names this counter …
   **T-002-08 renames this block to `## What it has`** once the `>> counters:` lines are
   written."* `bowl-shop.md` and `instant-pot.md` carried the same paragraph.
3. **Commit `a41f570`, "Apply the hand-offs the counter tickets recorded"** — the previous
   story's version of this ticket. Thirteen pre-existing `.cook` files, one `>> counters:` line
   each, committed with `counters.json`. This ticket did the same thing at a larger scale.
4. **The invariant the data holds.** Before this ticket, across all 15 populated counters, every
   listed slug named its counter and every naming recipe was listed — zero exceptions. A shelf
   built the other way would have been the first, and `scripts/menu-sections.mjs` reports that
   state as an error (`listed but not shelved here`).

**If a reviewer disagrees**, `git revert 9b79c4e abba20f` removes every `.cook` edit and leaves
the recipes exactly as the writer tickets wrote them. The three menus then fall back to 36 / 14 /
25 and criteria 2 and 3 fail. That is the trade, stated plainly.

Everything else in this document is inside the ticket as written.

---

## 2. What changed

| Commit | Message | Files |
| --- | --- | --- |
| `abba20f` | Shelve fifty-eight dishes on the pot that is the only pot to wash | 58 `.cook` |
| `9b79c4e` | Put the drawer of dressings on the counter it was always for | 67 `.cook` |
| `ac9236e` | Shelve every dish in a section its board would print | 3 gap notes + `src/data/counters.json` |
| `4b3a36b` | Give the shelves' new ingredients an aisle to be found in | `src/data/aisles.json` |

124 files, +597 −393. Created: none. Deleted: none.

**`src/data/counters.json` was not hand-edited.** It is generated: `scripts/menu-sections.mjs`
reads the `## What it has` block of each `docs/gaps/<slug>.md` and folds it in. The 15 old
counters round-tripped byte-identically before this ticket and do so after it; a diff of the
written JSON against the baseline touches **only** the `bowl-shop`, `instant-pot` and `one-pot`
blocks.

**T-003-06's three counters are untouched.** `soup-pot`, `japanese-home` and `slow-cooker` still
carry their empty sections, asserted byte-for-byte against the baseline. The script `continue`s
past a counter whose note has no `## What it has` block, before it reassigns `sections`.

The three gap notes also had their ranked *"what it is missing"* lists rewritten, because the six
writer tickets between them wrote 14 of One Pot's 20 ranked absences and 15 of the Bowl Shop's
22. That is a deviation from `plan.md` and it is argued in `progress.md` § *Deviations*.

---

## 3. Acceptance criteria, one by one

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Three counters populated, in menu order, **no "Also here" rendered** | Read out of the built HTML, not the JSON: `/menu/bowl-shop/` 6 sections / 103 items, `/menu/instant-pot/` 5 / 25, `/menu/one-pot/` 4 / 72. The `<h2>` sequence equals `counters.json` order on all three; **no `<h2>` reads `Also` or `Also here`**; the rendered count equals the item count; every `data-slug` resolves to a built page |
| 2 | Bowl Shop dressing section, with the exclusions recorded | 24 of the drawer's 40. The 16 left off are tabulated with a reason each in `progress.md` §3 and in `docs/gaps/bowl-shop.md` § *What came off the dressing drawer* |
| 3 | One Pot ≥ 25, majority written before this story | **72**, of which **58 predate S-002** (81%) |
| 4 | Instant Pot shelves every `kit: Instant Pot`, ≥ 20 | **25**. `grep -rl '^>> kit: *Instant Pot' recipes/` returns 25 and the sections list the same 25 |
| 5 | Every slug in every section resolves to a real recipe | Twice over: `menu-sections.mjs` refuses a slug that is not in `recipes.json`, and a post-write check confirms all 200 items resolve **and** name their counter |
| 6 | Aisle test passes, `npx vitest run` green | 37 unplaced → **3**; `Test Files 8 passed, Tests 825 passed` |
| 7 | `npm run build` succeeds, three pages render | 682 pages; all three menus built and linked from the front page |
| 8 | Only the two data files modified | **Not met.** §1 |

---

## 4. Test coverage, and the three gaps no test closes

This ticket changes data, not code, so **no unit test was added and none is wanted** — a test
asserting that `carnitas` is on the One Pot shelf would be a copy of `counters.json`. What ran:

| Risk | Guard | Result |
| --- | --- | --- |
| A `>> counters:` line broken by the edit | `parse-recipes.mjs` throws on an unknown counter | 658 parsed, 0 errors |
| A recipe file damaged beyond its metadata line | `check-recipes.mjs`, `layout.test.ts` | all 658 draw a table |
| A section slug that is not a recipe | `menu-sections.mjs` | `0 unplaced`, `0 listed but not shelved here` on all three |
| A member with no section → an `Also` on the page | `menu-sections.mjs`, then the built HTML | none |
| An aisle pattern stealing from another aisle | `aisleFor()` over all 1082 names, before vs after | 34 names moved, **all from `other`**, none between real aisles |
| Aisle coverage | `shopping.test.ts:163` | 3/1082 unplaced against a ceiling of 21 |
| A page that does not render | `astro build` + HTML assertions | 682 pages, three menus asserted |

**Gap 1 — whether a dish is really one pot.** The `cookware` line is evidence and it is not
enough: **eight dishes pass it and fail the shelf**, because they boil something in water the
file never calls a pot — `chicken-noodle-soup`, `matzo-ball-soup`, `biryani`, `corned-beef-hash`,
`beef-with-broccoli`, `mujaddara`, `chana-masala`, `dal-tadka`. Each was found by reading the
steps and each is named in `progress.md` §1. **A check that fails a file claiming `One Pot` while
naming two vessels would catch the easy half of this and is worth writing** — T-002-04 asked for
it and said it belongs to whoever owns the counter. It is not written here because it would be
a `src/` change on top of the one in §1.

**Gap 2 — whether a dressing belongs on a bowl board.** Held by one question — *would this be the
last thing ladled over a finished bowl?* — with all 16 exclusions listed and reasoned.

**Gap 3 — whether the menus read as menus.** Held by looking at the three built pages, which is
what the ticket's §3 asks for in those words.

---

## 5. Open concerns, in the order a reviewer should weigh them

1. **The 119 `.cook` edits.** §1. This is the one thing to decide.

2. **The strictest judgement on the One Pot shelf is the blender line.** Eight dishes came off
   for using a jug blender, food processor or mortar — `jollof-rice`, `mexican-red-rice`,
   `korma`, `patia`, `karahi`, `thai-green-curry`, `pad-krapow`, `corn-chowder`. The argument is
   that a whole component made outside the pot is a second bowl to wash, and the shelf's promise
   *is* the washing-up. A reviewer could reasonably rule that a blender is a prep tool like a
   knife, in which case those eight go on and the shelf reads 80. Nothing else moves.

3. **"No counter renders an 'Also here' section" was read as scoped to these three.** `panaderia`
   (7 items) and `deli` (3) have carried a deliberately-titled *Also here* section since T-001,
   out of their own gap notes. Renaming another counter's menu section with no mandate looked
   worse than the narrow reading. If the criterion was meant literally across all 21 counters,
   that is two gap-note titles and one regeneration, and it is not done here.

4. **`src/lib/icons.ts` still does not know `pressure`, `natural` or `release`.** T-002-02 and
   T-002-03 both asked for them *"from T-002-08 or T-002-09"*. `icons.test.ts` is **green** —
   both tickets reworded their labels instead — so this is an improvement request, not a defect,
   and it is a `src/lib/` change further outside this ticket than the shelving edits are.
   **Passed to T-002-09.**

5. **`pairs-with:` was not rewired, and two tickets asked about it.** T-002-06 wants to know
   whether its salads should now pair with T-002-07's components; `docs/gaps/bowl-shop.md`
   records that `chicken-salad`, `harvest-bowl` and the chopped salads all consume what
   `pulled-roast-chicken` now makes. That is a content change to files this ticket had no
   shelving reason to open. **T-002-09's, and it is written into the gap note so it is not lost.**

6. **T-003-06's pantry was placed here.** Roughly twenty of the 34 aisle patterns are S-003's
   vocabulary (konnyaku, hijiki, burdock, job's tears, adenophora root…), nominally that ticket's
   §3. It `depends_on: [T-002-08]` and runs after, and this ticket's criterion is that the suite
   is green *now*, so they were placed rather than left failing. **T-003-06 should not re-derive
   them**; its §3 will find only its own genuinely new names.

7. **T-003-06 will hit exactly the wall in §1.** Its ticket carries the same sentence — *"A
   section may list a recipe that never names the counter — that is how a shelf borrows"* — and
   the same two-file ownership, and it needs `dashi`, `miso-soup` and `congee` on shelves they do
   not name. It should read this document before it starts.

8. **The Bowl Shop's *What goes on top* is 36 items in one section.** It is T-002-07's handoff
   taken whole and nothing in it failed a read, but it is the longest section on the site and a
   reviewer who wants it split into proteins and pickles would not be wrong. That is a gap-note
   edit, not a data one.

---

## What a human should look at first

`docs/gaps/one-pot.md` § *The fifty-seven that came off the candidate list* — specifically the
first group, the eight dishes whose second pot is invisible in their `cookware` line. Everything
else in this ticket is checkable by a script. That group is the shelf's whole promise, and a cook
who picks a recipe off it and finds themselves washing a colander has been lied to.
