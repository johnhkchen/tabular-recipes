# T-002-06 — Plan

Twelve files, four commits, three gates. Ordered so the gaps-page ranks land first and every
commit is independently checkable.

---

## Step 0 — Confirm the slugs before anything is written

Done during Structure; recorded here because a mistyped `pairs-with:` slug fails the whole
collection's test run, not just the new file.

```
ls recipes/*/{caesar-dressing,blue-cheese-dressing,basic-vinaigrette,goma-dare,\
miso-ginger-dressing,green-goddess-dressing,ranch-dressing,honey-mustard-dressing,\
fattoush,russian-dressing,tahini-sauce}.cook
```

**Result: all present.** One correction to Structure: **`sourdough-bread` does not exist** —
the file is `recipes/breads/sourdough-boule.cook`. `kale-caesar` pairs with `sourdough-boule`.
`panzanella` picks up `ciabatta` (confirmed present) for the same reason.

Verification: every slug that appears in any `pairs-with:` line in the twelve new files is in
the list above or is `sourdough-boule` / `ciabatta` / another new file in this ticket.

---

## Step 1 — The gaps-page ranks (5 files)

Writes, in the order the acceptance criterion requires:

1. `recipes/salads/kale-caesar.cook` — gaps rank 6
2. `recipes/salads/shaved-brussels-salad.cook` — gaps rank 7
3. `recipes/salads/italian-chopped-salad.cook` — gaps rank 13, *The Goop Father*
4. `recipes/salads/chinese-chicken-salad.cook` — gaps rank 13, *Brentwood Chinese Chicken*
5. `recipes/salads/harvest-chopped-salad.cook` — gaps rank 13, *Fall Harvest Chopped*

**Verify** after each file, not after all five:

```
node scripts/check-recipes.mjs --labels recipes/salads/<slug>.cook
```

Pass condition: `ok`, at least 3 rows and at least 3 cols, and the printed label staircase reads
as a sequence of a cook's verbs — not fragments. Reading the staircase is a real gate, not a
formality: it is the only thing that catches a label that parses and does not mean anything.

**Commit** when all five pass:

```
lisa commit-ticket --ticket-id T-002-06 \
  --message "The kale, the sprouts and the three chopped salads" \
  --include recipes/salads/kale-caesar.cook \
  --include recipes/salads/shaved-brussels-salad.cook \
  --include recipes/salads/italian-chopped-salad.cook \
  --include recipes/salads/chinese-chicken-salad.cook \
  --include recipes/salads/harvest-chopped-salad.cook
```

---

## Step 2 — The bacon three (3 files)

6. `recipes/salads/cobb-salad.cook`
7. `recipes/salads/wedge-salad.cook`
8. `recipes/salads/spinach-salad.cook`

Grouped because all three render bacon and the risk they carry is the same one: three files that
say the same thing about a strip of bacon. Written together so the paragraphs can be made to
differ — the cobb dices it into rows, the wedge crumbles it whole over a quarter, the spinach
salad keeps the fat and makes the dressing in it. If any of the three cannot say something the
other two do not, it is cut and the count drops to eleven.

**Verify**: same per-file check. Then read the three side by side.

**Commit**: `--include` the three paths, message "Bacon three ways over a leaf".

---

## Step 3 — The dressed-in-the-bowl four (4 files)

9. `recipes/salads/greek-salad.cook`
10. `recipes/salads/panzanella.cook`
11. `recipes/salads/salade-nicoise.cook`
12. `recipes/salads/roasted-beet-salad.cook`

Grouped because each one builds its dressing as part of the method (or, for the beets, cures a
cheese), and each therefore has to justify not referencing the drawer. The justification goes in
the step paragraph, in the file, not only in this artifact.

**Verify**: same per-file check.

**Commit**: `--include` the four paths, message "Four that dress themselves".

---

## Step 4 — Whole-collection gates

Run in this order. The order matters: the tests read `src/generated/recipes.json`, so the parse
has to run first or a green test run proves nothing about the new files.

```
node scripts/check-recipes.mjs                # 1. every file still draws a table
npm run recipes                               # 2. regenerate src/generated/recipes.json
npx vitest run                                # 3. the collection invariants
```

What each gate is actually for:

| Gate | Catches |
| --- | --- |
| `check-recipes.mjs` (all) | a new file that breaks, and proves the 553 existing ones were not disturbed |
| `npm run recipes` | a `pairs-with:` slug naming no file — the parser rejects it by name |
| `vitest run` — `icons.test.ts` | **an operation label opening with a verb the icon table does not know.** The one failure mode invisible from inside a single file |
| `vitest run` — `collection.test.ts` | dangling pairings, non-mutual pairings, unknown counters, duplicate slugs |

`src/generated/` is gitignored (`.gitignore` line 5), so step 2 leaves nothing to commit.

Expected end state: 565 files draw a table (553 + 12), tests green.

**No commit** — this step produces no tracked file.

---

## Step 5 — Working-tree hygiene

Before Review, prove nothing ticket-owned is loose:

```
git status --porcelain recipes/
```

Expected: **empty**. Every new `.cook` file is committed through `lisa commit-ticket`; nothing in
`recipes/` is staged, modified or untracked. If a file shows up here it was missed from an
`--include` list and gets its own commit.

Also confirm the negative half of the acceptance criteria:

```
git status --porcelain                        # nothing outside recipes/ and .lisa/
git log --stat -3                             # no pre-existing file in any of the three commits
```

---

## Step 6 — Review

Write both artifacts into `.lisa/attempts/T-002-06/1/work/`:

- `review.md` — what was written, what each file's table looks like, the gate results, what was
  skipped from the gaps page and why, the T-002-07 subject overlaps, and open concerns.
- `review-disposition.json` — `{"disposition":"pass","reason":null}` if all three gates are
  green and the count is ≥10; otherwise a block with an actionable reason.

Then `lisa check-disposition T-002-06`, and correct anything it reports.

---

## Testing strategy

There are no unit tests to write. This ticket adds data, and the collection's own test suite is
the coverage:

- **Per-file**, `check-recipes.mjs` is the unit test: metadata present, counter known, tree
  builds, grid tiles, no unlabelled cell, ≥3 rows, ≥3 cols.
- **Cross-file**, `collection.test.ts` and `icons.test.ts` are the integration tests: pairings
  resolve and are mutual, slugs unique, counters known, every operation verb has an icon.
- **Not covered by any test**: whether a salad is worth eating, whether the paragraph says
  something a cook does not know, whether three bacon salads are three recipes or one. That is
  what the side-by-side read in Step 2 and the label-staircase read in Step 1 are for, and the
  Review artifact records the judgement.

## Risks and what happens if they fire

| Risk | Fires as | Response |
| --- | --- | --- |
| A label opens with a verb not in `VERB_ICONS` | `icons.test.ts` fails at Step 4, naming the verb | Reword the label. **Not** by editing `icons.ts` — outside this ticket's file scope |
| A preparation is wanted in two places | `buildTree` throws "used by two later steps" | Put it in one place; the tree is the recipe |
| Two steps end the recipe | `buildTree` throws with the root count | Add the missing `@&(~n)` into the final step |
| A `pairs-with:` slug is wrong | `npm run recipes` rejects it by name | Fix the slug against `ls`; never delete the pairing to make it pass |
| T-002-05 or T-002-07 lands a file with a slug we also chose | duplicate-slug test fails | Rename ours; they are the components and the bowls, we are the salads, and no slug in the twelve is a component or a bowl name |
| Three bacon salads read as one recipe | nothing fails; a human notices | Cut one at Step 2, land eleven, say so in Review |
