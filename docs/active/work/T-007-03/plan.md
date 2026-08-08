# T-007-03 — Plan

Five commits. Each one is a group of files that can be checked on its own, in an order that
never leaves a dangling `pairs-with`.

**Environment.** `node` is not on the default PATH here. Every command below is run with
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` first; `.node-version` pins
24.18.1.

---

## Step 0 — Confirm the ground before writing

Read-only, no commit.

```sh
ls recipes/*/hong-kong-milk-tea.cook recipes/*/yuenyeung.cook \
   recipes/*/iced-lemon-tea.cook recipes/*/lemon-coke-with-ginger.cook \
   recipes/*/red-bean-ice.cook recipes/*/horlicks.cook \
   recipes/*/hong-kong-french-toast.cook recipes/*/thick-toast.cook   # expect: all absent
grep -rn "sugar syrup\|golden syrup\|rock sugar\|cola\|crushed ice" recipes/  # match existing spellings
node scripts/check-recipes.mjs | tail -3                                     # baseline: all green
```

**Verification:** eight slugs free, baseline clean. A slug that already exists is a build error
(`two recipes share the slug`), so this is checked before anything is written rather than after.

## Step 1 — `hong-kong-milk-tea`

The file everything else waits on. Written to the blueprint in `structure.md` §1.

```sh
node scripts/check-recipes.mjs --labels recipes/drinks/hong-kong-milk-tea.cook
```

**Verification, and this is the strictest gate in the ticket:**

- reports `ok … 5 rows x 5 cols`
- `--labels` prints five cells and the staircase descends
- the pull is one of those cells and reads `pull it through the bag 3 to 6 times, steep 6 min`
- the file contains no number that is not in `design.md` §4's table — checked by reading the
  file against that table line by line, not by eye
- `evaporated milk`, spelled exactly that, appears once
- no field over cap (the checker prints nothing after the `ok`)

```sh
lisa commit-ticket --ticket-id T-007-03 \
  --message "Write the Hong Kong milk tea" \
  --include recipes/drinks/hong-kong-milk-tea.cook
```

## Step 2 — `yuenyeung`

```sh
node scripts/check-recipes.mjs --labels recipes/drinks/yuenyeung.cook
```

**Verification:** `ok … 5 rows x 4 cols`; the file contains **no** tea leaf, no brew temperature
and no steep for the tea — grep it:

```sh
grep -nE "tea bags|loose-leaf|90|96|steep\{6" recipes/drinks/yuenyeung.cook   # expect: nothing
grep -n "Hong Kong milk tea" recipes/drinks/yuenyeung.cook                    # expect: one row
```

Then commit with `--include recipes/drinks/yuenyeung.cook`.

## Step 3 — The four remaining drinks

`iced-lemon-tea`, `lemon-coke-with-ginger`, `red-bean-ice`, `horlicks`.

```sh
node scripts/check-recipes.mjs --labels recipes/drinks/*.cook
```

**Verification:** four `ok` lines at the shapes in `structure.md`; the three pre-existing drinks
still `ok`; nothing over cap. `iced-lemon-tea` must report **4 cols**, which is the proof that
the lemon-bruising branch merged rather than collapsing into the tea chain.

One commit, four `--include` paths.

## Step 4 — The two toasts

```sh
node scripts/check-recipes.mjs --labels \
  recipes/flatbreads-and-pancakes/hong-kong-french-toast.cook \
  recipes/flatbreads-and-pancakes/thick-toast.cook
```

**Verification:**

- `hong-kong-french-toast` reports `7 rows x 5 cols`
- its `aka` begins `french toast`
- its full-width row says what it is not — visible in the checker's header output and by reading
  the file
- `thick-toast` reports `3 rows x 4 cols` and carries `sweetened condensed milk`

One commit, two `--include` paths.

## Step 5 — The whole collection, and the tests

```sh
npm run check          # every file draws a table, nothing over cap
npm run recipes        # cross-recipe facts: slugs, counters, pairings, notes
npx vitest run         # collection invariants, including "reads a duration off every timer"
npm run build          # every page builds
```

**Verification, mapped to the acceptance criteria:**

| Criterion | How it is shown |
| --- | --- |
| 8 new files, all pass the checker | eight `ok` lines in step 1–4 output |
| `npm run check` passes for the collection | `all N file(s) draw a table`, N = 666 |
| every timer named | `grep -c '~{' ` over the eight files returns 0 |
| `>> counters: Cha Chaan Teng` on every file | `grep -L 'counters: Cha Chaan Teng'` returns nothing |
| `aka` has characters + romanisation + plain English | read the eight `aka` lines |
| pairings resolve and are mutual | `npm run recipes` + `vitest` pairings suite |
| no timer without a readable duration | `vitest` "reads a duration off every timer it found" |
| only `recipes/**/*.cook` and the work dir touched | `git status --porcelain` after the last commit |

The commit for the work artifacts is Lisa's, not this ticket's.

## Testing strategy

There is no unit test to write here. This ticket produces data, and the collection's tests are
the ones that read it:

- **Per file:** `check-recipes.mjs` — table shape, tiling, counter name, slack grammar, five
  length caps. Run on each file as it is written, not in a batch at the end.
- **Across the collection:** `parse-recipes.mjs` — unique slugs, known counters, no orphan,
  `pairs-with` resolves, section notes point at shelved slugs.
- **Invariants:** `src/lib/collection.test.ts` — mutual pairings, one plain way per dish, every
  timer readable as minutes, no four-hour hands-on claim.
- **The one thing no test can check:** that the numbers in `hong-kong-milk-tea` are the numbers
  the sources gave. That is verified by hand against `design.md` §4 in step 1 and re-checked in
  `review.md`, and it is the criterion most worth a human's attention.

## Risks, and what is done about each

| Risk | Handling |
| --- | --- |
| `~simmer{2-3%min}` range syntax does not parse under a *named* timer (only an unnamed one exists in the collection) | Checked in step 1. Fallback: `~simmer{3%min}` with the 2-to-3 range still printed in the cell |
| `@&(~2)` in `iced-lemon-tea` and `hong-kong-french-toast` mis-targets because a prose step shifts the count | `--labels` prints the staircase; a mis-target shows up as a wrong column count or a tree error |
| T-007-04 writes a file with the same slug | Both tickets' slugs are disjoint by section (`drinks/` and the two toasts are named as this ticket's in T-007-04's own text). `npm run recipes` catches it either way |
| A number drifts from its source while writing prose | The number table in `design.md` §4 is the single copy; the file is diffed against it before commit |

## Out of scope, and recorded rather than done

- 菠蘿油 — cannot draw a table. Handed to T-007-05 as a section note.
- The blend-ratio correction to `docs/gaps/cha-chaan-teng.md` — that file is T-007-05's.
- Shelving anything into `src/data/counters.json` — T-007-05's.
- Aisle patterns for `golden syrup`, `rock sugar`, `cola`, `Ceylon tea bags` — T-007-05's, and
  listed for them in `structure.md`.
