# T-011-03 — Plan

Seven steps. Two of them commit; the rest read.

The candidate table and both writers live in the attempt's scratch directory
(`scan.mjs`, `inventory.mjs`, `probe.mjs`, `annotate.mjs`). **None of them is committed** — they
are how the lines were derived and checked, not something the repo has to carry. The evidence they
produced goes into `progress.md` as text.

---

## 1. Prove the mechanism before writing anything *(done during Research)*

`probe.mjs` injects a candidate line into a real file **in memory** and prints what it binds, which
timers land inside the vessel, and `costOf()` at several sizes.

Verified before any file changed:

- `beef-with-broccoli` with `2 — the wok, sear` reproduces `scaling.md` §3 exactly: 42 minutes at
  twelve servings, 12 of them standing, and **not 102**.
- `air-fryer-chicken-wings` with `roast` alone costs **0** and with `roast, air fry` costs **42**.
  This is the trap that decides the wording of 21 files.

**Verification:** both figures match the published model by hand.

## 2. Dry-run all 46 rows

`annotate.mjs check` builds each file's text with its candidate line, normalises it, and asserts
five things per row:

1. `readCapacity()` returns a whole `Capacity`.
2. `servingsOf()` matches the table's `s`.
3. `ceil(s/c) = N`.
4. `boundSteps()` is non-empty.
5. Where `c < s`, `saysItBatches()` is true — so `check-recipes.mjs` will not fail it.

Then a sixth pass asserts **no bound step carries an unnamed timer**, since an unnamed timer inside
a bound step is charged to the vessel whether or not it belongs there.

**Verification:** `46 rows, 0 with something to fix`, and no `UNNAMED` line.

## 3. Write group 1 — the 25 files that state a batch count

`annotate.mjs write` inserts the line after `>> washing-up:` / `>> slack:` / `>> time:`.

**Verification, before the commit:**

```
git diff --numstat recipes/ | awk '$2 != 0'        # nothing deleted, anywhere
git diff -U0 recipes/ | grep '^+' | grep -v '^+++' | grep -cv '^+>> capacity:'   # 0
node scripts/check-recipes.mjs                      # 685 files, no new failure
```

**Commit:** `lisa commit-ticket --ticket-id T-011-03 --include <25 exact paths>`.

## 4. Write group 2 — the 21 air fryer files

Same writer, same verification.

**Commit:** a second `lisa commit-ticket` with the 21 paths.

## 5. Run the whole check over the collection

```
npm run check
```

Reads every one of the 685 files. What has to hold:

- No new **failure**: no capacity binds nothing, none contradicts its own `>> servings:`.
- No new **warning**: no capacity sits on a file whose servings is a volume. (None of the six
  `N cups` files is in the table — checked: every row's `>> servings:` is a plain integer.)

This is the acceptance criterion *"the check from T-011-02 passes over the whole collection."*

## 6. The cost table

A read-only script over the built collection: `costOf()` at 2×, 3× and 12 servings for each of the
46, plus the same recipe with its capacity removed, so the vessel's own contribution is visible.

Printed into `progress.md`:

- **The ten largest jumps in elapsed time**, which the AC asks for by name.
- The per-file arithmetic: the quoted sentence, `s`, `N`, `c`, and elapsed at 12.

**What would make a jump a finding rather than a number:** an elapsed figure that grows when the
vessel bounds only hands-on work (it must not — `A_batch` is zero there), or a jump on a recipe
whose bound step has no timer inside the vessel (it would be zero, not large). Per the AC, a jump
that looks wrong is a finding for **T-011-02**, not a reason to change the capacity.

## 7. `npm run verify`

```
npm run verify        # check → recipes → vitest → astro build
```

1104 tests in 16 files, 685 recipes, ~710 pages. **Nothing in `scaling.test.ts` asserts that no
`.cook` file declares a capacity**, and the whole-collection properties there — confidence never
strengthens, nothing is `NaN` at any plan multiplier, `longest ≤ standing` — now run against 46
real capacities for the first time. That is the strongest single check this ticket gets, and it is
free.

---

## Testing strategy

**No new test file.** This ticket owns `>> capacity:` lines in `.cook` files and nothing else;
`src/lib/scaling.test.ts` is T-011-02's, and adding to it would be work outside the ownership list.

The data is tested three ways instead, all of which run in CI already:

| Check | Runs | Catches |
| --- | --- | --- |
| `check-recipes.mjs` | `npm run check`, first in `verify` | a line that is malformed, binds nothing, or contradicts its servings |
| `scaling.test.ts` whole-collection properties | `vitest` | `NaN` at any multiplier, confidence strengthening, `longest > standing` — over all 685 |
| `astro build` | `verify` | anything downstream that reads `recipe.capacity` |

The one thing no automated check can catch is **a number that is wrong about a real pan**. That is
what the per-file arithmetic in `progress.md` is for: every capacity is one division away from a
sentence quoted out of its own file, so a reviewer can check any row in about ten seconds without
opening the file.

## Risks

| Risk | Handling |
| --- | --- |
| A capacity that binds a step but charges no minutes | Step 2's sixth assertion, and `costMinutes` reported per file |
| Over-annotation | 46/685 = 6.7%, and the rule is stated so a reviewer can test the boundary |
| A jump that reads as absurd | Reported in the ten-largest table with the operation that produces it, so it can be argued against the file |
| Rounding `c` up quietens the clock at large `n` | Bounded at one load in eight on the worst row (`carnitas`), stated in `design.md` |
| `parse-recipes.mjs` still swallows a bad line | Outside ownership; `check` runs first in `verify`; carried into `review.md` |
