# T-001-02 — Plan

Ten steps. Steps 2–9 are the eight commit units from `structure.md`; each is written, checked
and committed before the next starts, so a session that dies mid-way leaves a consistent
partial shelf rather than a half-parsed collection.

Project seal, confirmed with `lisa status`: **commit-sealed — finished work lands as
history.** So `lisa commit-ticket` applies; the journal-only branch of the workflow does not.

---

## Step 0 — Folders

Create `recipes/sandwiches-and-rolls/` and `recipes/drinks/`. Git tracks files, not
directories, so these appear in history only with their first file; no separate commit.

**Verify:** nothing to verify on its own.

---

## Step 1 — Baseline, recorded before anything is written

Already taken during Research, restated here as the number every later comparison is against:

```
npm run recipes   → parsed 254 recipe(s) in 13 categories · counters: 254 named,
                    0 inferred · timers in 234 · pairings 138
npx vitest run    → 405 passed, 1 failed
                    (schedule.test.ts "are the three ferments" — pre-existing,
                     T-001-01's crema-mexicana displaced pizza-dough)
npx vitest run src/lib/shopping.test.ts → passes, zero unplaced ingredient names
```

**Verification criterion for the whole ticket:** the failure count must not rise above 1, and
the one failure must still be that same assertion for that same reason.

---

## Step 2 — Commit unit 1: the two components everything else needs

Write:

- `recipes/breads/banh-mi-khong.cook`
- `recipes/dressings-and-dips/nuoc-cham.cook`

**Verify:**

```sh
node scripts/check-recipes.mjs --labels recipes/breads/banh-mi-khong.cook \
  recipes/dressings-and-dips/nuoc-cham.cook
```

Both must print `ok` at the size `structure.md` predicts (10 × 6 and 7 × 5), and the label
staircase must read as verbs — `stir the sponge`, `mix the dough`, `knead, rise`, not
`stir the sponge together then rest`. Any fragment gets a `>> step.N:` override, or the step
is reworded, and the check is re-run.

**Commit:**

```sh
lisa commit-ticket --ticket-id T-001-02 \
  --message "Write the Vietnamese roll and nước chấm for Phở & Bánh Mì" \
  --include recipes/breads/banh-mi-khong.cook \
  --include recipes/dressings-and-dips/nuoc-cham.cook
```

---

## Step 3 — Commit unit 2: the phở board

Write `recipes/soups/pho-broth.cook`, `pho-bo.cook`, `pho-ga.cook`.

The risk here is structural, not culinary: `pho-broth` merges **three** branches at step 4 and
`pho-bo` / `pho-ga` each merge two. `layout.ts`'s `findTilingErrors` is what catches a tree
that cannot be drawn without holes, and it runs inside `check-recipes.mjs`. If a three-way
merge tiles badly, the fallback is to fold the toasted sachet into the parboil step (two
branches instead of three), which costs one operation and no accuracy.

**Verify:** `check-recipes.mjs --labels` on all three, `ok` at 15 × 6, 14 × 6, 15 × 6.
Additionally confirm the long timer is read as a wait, not as work: the named `~simmer{6%hr}`
is in `time.ts`'s unattended set, which is the whole reason the gap doc asked for it by name.

**Commit:** `--message "Write the phở board for Phở & Bánh Mì"` with the three paths.

---

## Step 4 — Commit unit 3: the cold cut

Write `recipes/stews-and-braises/cha-lua.cook`.

**Verify:** `ok` at 10 × 6. Check by eye that the sub-50°F caveat is in the file — it is an
acceptance-criterion-adjacent point ("the method is the canonical one for the dish rather than
a shortcut wearing its name"), and the gap doc calls it the recipe's most useful line.

**Commit:** `--message "Write chả lụa for Phở & Bánh Mì"`.

---

## Step 5 — Commit unit 4: the bánh mì board

Write `recipes/sandwiches-and-rolls/banh-mi-dac-biet.cook` and `banh-mi-thit-nuong.cook`.
First file in a new folder, so this is where a new category first appears.

**Verify:**

- `check-recipes.mjs --labels` → `ok`, 11 × 4 and 15 × 6. The đặc biệt assembly is the one
  file near the floor (3 operations, minimum 3): if it comes out at `colCount < 3` the file
  fails outright, so this check is load-bearing rather than cosmetic.
- Confirm the category line reads `Sandwiches & Rolls` and matches the folder.

**Commit:** `--message "Write the bánh mì board for Phở & Bánh Mì"`.

---

## Step 6 — Commit unit 5: the appetiser rolls

Write `recipes/sandwiches-and-rolls/cha-gio.cook` and `goi-cuon.cook`.

`goi-cuon` has the trickiest tree: two branches opened at steps 1 and 2 merge at step 3, a
third opens at step 4, and step 5 closes it. Watch for the format's "two endings" refusal.

**Verify:** `ok` at 15 × 6 each.

**Commit:** `--message "Write chả giò and gỏi cuốn for Phở & Bánh Mì"`.

---

## Step 7 — Commit unit 6: bún and cơm

Write `recipes/rice-beans-and-grains/bun-thit-nuong.cook` and `com-tam.cook`.

**Verify:** `ok` at 15 × 6 each. Also read the two lemongrass marinades side by side against
`banh-mi-thit-nuong`'s: they must differ where the dish differs (oyster sauce in the sandwich,
dark soy in the chop) rather than be three copies of one paragraph, or T-001-18 will read them
as one dish written three times.

**Commit:** `--message "Write bún thịt nướng and cơm tấm for Phở & Bánh Mì"`.

---

## Step 8 — Commit unit 7: the wet one

Write `recipes/stews-and-braises/xiu-mai.cook`.

**Verify:** `ok` at 16 × 6 — the tallest table here, right at the README's 16-row ceiling. If
it comes out taller, drop the scallion garnish row rather than the cornstarch, which is
structural.

**Commit:** `--message "Write xíu mại for Phở & Bánh Mì"`.

---

## Step 9 — Commit unit 8: the drink

Write `recipes/drinks/ca-phe-sua-da.cook`. Second new folder, and the site's first drink.

**Verify:** `ok` at 5 × 6. Five rows is the README's floor for "aim" and above the checker's
hard floor of 3.

**Commit:** `--message "Write cà phê sữa đá for Phở & Bánh Mì"`.

---

## Step 10 — Verification across the collection

Run in this order, recording every number in `progress.md`:

1. **All fourteen, with labels.**
   ```sh
   node scripts/check-recipes.mjs --labels recipes/breads/banh-mi-khong.cook \
     recipes/dressings-and-dips/nuoc-cham.cook recipes/soups/pho-*.cook \
     recipes/stews-and-braises/cha-lua.cook recipes/stews-and-braises/xiu-mai.cook \
     recipes/sandwiches-and-rolls/*.cook recipes/rice-beans-and-grains/bun-thit-nuong.cook \
     recipes/rice-beans-and-grains/com-tam.cook recipes/drinks/ca-phe-sua-da.cook
   ```
   Expect `all 14 file(s) draw a table.` — this is the printed evidence for the third
   acceptance criterion, and the staircase output is the evidence for its second half.
2. **Every timer named.** `grep -rn '~{' <the fourteen>` must return nothing. This is the
   fourth criterion, and it is checkable exactly.
3. **The whole collection still checks.** `node scripts/check-recipes.mjs` → expect
   `all 268 file(s) draw a table.` (254 + 14).
4. **Parse.** `npm run recipes` → expect `268 recipe(s) in 15 categories · counters: 268
   named, 0 inferred`. Fifteen categories confirms both new folders landed; `0 inferred`
   confirms every new file names its counter. This is also where a dangling `pairs-with` or a
   duplicate slug fails loudly.
5. **The counter's own count**, from the generated JSON — the first acceptance criterion,
   measured rather than asserted:
   ```sh
   node -e 'const r=require("./src/generated/recipes.json");
     const on=r.filter(x=>x.counters.includes("Phở & Bánh Mì"));
     console.log("on the counter:", on.length,
       "exclusive:", on.filter(x=>x.counters.length===1).length);'
   ```
   Expect **18** and **16**, against a bar of 16 and 12.
6. **Tests.** `npx vitest run` → expect `405 + n passed, 1 failed`, that one failure still
   `schedule.test.ts > are the three ferments`. Two specific things to look at:
   - `schedule.test.ts` — the longest new critical path is `cha-lua` at ~580 min, well under
     the 1568-min cut, so the pinned top three should not move again.
   - `shopping.test.ts` — the 2% unplaced-ingredient budget. New names with no aisle pattern
     (rice paper wrappers, bánh phở noodles, thịt nguội, Maggi seasoning, annatto oil) come
     out of a budget that currently has zero spent. If the test prints a report, the names go
     into `progress.md` and `review.md` as a hand-off to T-001-17, which owns
     `src/data/aisles.json`. **They are not fixed here.**
7. **Ownership.** `git status --porcelain` must show no ticket-owned file staged, modified or
   untracked — every `recipes/**` path accounted for by a `lisa commit-ticket`. Files outside
   `recipes/` that were already dirty at session start (four ticket markdown files, the
   `.lisa/` journals) are not mine and are left alone.

**Not run:** `npm run verify` end to end. It is parse + tests + build; steps 4 and 6 cover the
first two, the Astro build adds nothing for a data-only change, and the suite is already known
red for a reason outside this ticket. Recorded here as a decision, the same one T-001-01 made
and reported.

---

## Testing strategy, stated plainly

There are no unit tests to write. This ticket adds data, and the collection's test strategy
already covers data in three layers:

| Layer | What it catches | Where |
| --- | --- | --- |
| Per file | metadata, unknown counter, a tree that will not tile, an unlabelled cell, a table too thin | `scripts/check-recipes.mjs` |
| Per collection, at parse | duplicate slug, dangling pairing, orphaned recipe | `scripts/parse-recipes.mjs` |
| Per collection, at test | pairings mutual, one plain way per dish, aisle coverage, critical paths | `src/lib/*.test.ts` |

Writing a new test would mean writing into `src/`, which this ticket is forbidden from
touching. So the verification is: run all three layers, report every number, and change
nothing outside `recipes/` to make a number look better.

## Risks, and what each one costs

| Risk | Signal | Response |
| --- | --- | --- |
| A three-way merge will not tile | `findTilingErrors` in `check-recipes.mjs` | fold the sachet into the parboil step; −1 operation |
| The đặc biệt assembly falls under 3 columns | `only one operation` from the checker | split "layer, close, press" into two steps |
| A table exceeds 16 rows | row count in `ok` line | drop a garnish leaf, never a structural one |
| New ingredients push `other` past 2% | `shopping.test.ts` report | record for T-001-17; `aisles.json` is not mine |
| The schedule snapshot moves again | `schedule.test.ts` diff naming a new slug | report it; `src/lib/` is not mine either |
| Two lemongrass marinades read as one dish | eyes, at step 7 | differentiate by dish, or merge the two files — but they are two menu items |
