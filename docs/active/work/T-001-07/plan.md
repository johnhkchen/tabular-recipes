# T-001-07 — Plan

Eighteen new `.cook` files in five commits, each commit a section of the counter that can be read
and judged on its own. Nothing outside `recipes/**` is written.

## Verification available at each step

| Command | What it proves | When |
| --- | --- | --- |
| `node scripts/check-recipes.mjs --labels <files>` | the file parses, tiles, has ≥3 rows and ≥3 columns, names a real counter, and every operation cell has a label — and prints the staircase so the labels can be read as verbs | after every file, before every commit |
| `grep -n '~{' <files>` | no unnamed timer (acceptance criterion) | before every commit |
| `grep -c '^>> ' <files>` / eyeball | `title`, `category`, `tags`, `servings`, `counters`, `aka` all present | before every commit |
| `npm run recipes` | collection-wide build: unique slugs, no dangling `pairs-with`, no self-pairing, counters known | once, at the end |
| `npx vitest run` | the seven suites, against the baseline recorded in Research §8 | once, at the end |
| a throwaway node script over `normalise()` | counts: recipes at the counter, recipes naming it alone | once, at the end |

There are no unit tests to add. This ticket adds data; the collection's suites are the tests for
data, and they run over these files automatically. Any new assertion would belong in
`src/lib/*.test.ts`, which is outside this ticket's ownership.

**Baseline to compare against** (measured in Research, before any file was written): `npm run
recipes` fails on `recipes/pastry-and-doughs/costra-de-azucar.cook` pairing with an unwritten
`bigotes-de-pina` — T-001-06, in flight. `npx vitest run` against the last good generated data:
**4 failed test files, 460 tests passing** (`icons`, `schedule`, `shopping`, `units`), all
attributed in `docs/active/work/T-001-05/review.md` to other tickets.

---

## Step 1 — The Four Heavenly Kings (4 files)

Write, in this order:

1. `recipes/dumplings-and-rolls/har-gow.cook`
2. `recipes/dumplings-and-rolls/siu-mai.cook`
3. `recipes/dumplings-and-rolls/char-siu-bao.cook`
4. `recipes/custards-and-puddings/egg-custard-tart.cook`

Har gow first because it is the hardest tree in the ticket — two branches merging into a pleat
step — and if that shape does not tile, every dumpling file below has to change.

**Check.** `check-recipes --labels` on all four. Read the staircase: each cell must open with a
verb (`knead`, `mix`, `roll`, `steam`, `whisk`, `strain`, `bake`), not a fragment.

**Watch for.** `char-siu-bao` names `char siu` as an ingredient and pairs with `char-siu`;
`egg-custard-tart` names `sweet tart shell` and pairs with `sweet-tart-shell`. Both target slugs
exist — confirmed in Research §1 — but the pairing is only validated by `npm run recipes` at
Step 6, so a typo here surfaces late. Spell them from the `ls` output, not from memory.

**Commit.** `lisa commit-ticket --ticket-id T-001-07 --message "Write the Four Heavenly Kings the
Dim Sum Counter is named for" --include recipes/dumplings-and-rolls/har-gow.cook --include
recipes/dumplings-and-rolls/siu-mai.cook --include recipes/dumplings-and-rolls/char-siu-bao.cook
--include recipes/custards-and-puddings/egg-custard-tart.cook`

---

## Step 2 — The roast-meat window (4 files)

1. `recipes/stews-and-braises/siu-yuk.cook`
2. `recipes/stews-and-braises/soy-sauce-chicken.cook`
3. `recipes/stews-and-braises/white-cut-chicken.cook`
4. `recipes/sauces-and-gravies/ginger-scallion-oil.cook`

**The one thing to get right.** `soy-sauce-chicken` carries the master-stock footer — a step with
no ingredients and no `@&(~N)` reference, written *after* the first real step so `buildTree()`
files it as a footer rather than a header. If it accidentally takes an ingredient it becomes a
second root and the checker fails with "2 steps end the recipe". That failure is the test.

**Check.** `check-recipes --labels` on all four. Confirm `ginger-scallion-oil` reports at least
`3 cols` — it is the thinnest file in the ticket at three operations.

**Commit.** `lisa commit-ticket --ticket-id T-001-07 --message "Hang the roast-meat window, and
say plainly that this master stock is a first pour" --include recipes/stews-and-braises/siu-yuk.cook
--include recipes/stews-and-braises/soy-sauce-chicken.cook --include
recipes/stews-and-braises/white-cut-chicken.cook --include recipes/sauces-and-gravies/ginger-scallion-oil.cook`

---

## Step 3 — The steamer (6 files)

1. `recipes/dumplings-and-rolls/cheung-fun.cook`
2. `recipes/dumplings-and-rolls/xiao-long-bao.cook`
3. `recipes/flatbreads-and-pancakes/turnip-cake.cook`
4. `recipes/flatbreads-and-pancakes/taro-cake.cook`
5. `recipes/rice-beans-and-grains/lo-mai-gai.cook`
6. `recipes/stews-and-braises/chicken-feet.cook`

**Watch for.** `lo-mai-gai` merges three branches into the parcel step and `xiao-long-bao` merges
two into the pleat with a third feeding the filling; both are the deepest trees here. A long
unattended wait — the 4 hr rice soak, the overnight chill on the turnip cake loaf — must be
named with a wait word (`~soak`, `~chill`) or `collection.test.ts` will read it as four unbroken
hours of a cook's attention and fail.

**Check.** `check-recipes --labels`, then `grep -n '~{' ` over the six for unnamed timers.

**Commit.** `lisa commit-ticket --ticket-id T-001-07 --message "Load the steamer baskets, and let
the loaf go cold before it is sliced" --include …` (six exact paths).

---

## Step 4 — The fryer (3 files)

1. `recipes/dumplings-and-rolls/wu-gok.cook`
2. `recipes/dumplings-and-rolls/ham-sui-gok.cook`
3. `recipes/dumplings-and-rolls/sesame-balls.cook`

**Watch for.** All three are fried at a deliberately low temperature, and all three say why in one
sentence — the lace on a wu gok, the blister on a ham sui gok, the hollow in a sesame ball are all
the same fact about a cool fryer. `sesame-balls` pairs with `red-bean-paste`.

**Check.** `check-recipes --labels`. A `~fry` timer is hands-on by name, which is correct here.

**Commit.** `lisa commit-ticket --ticket-id T-001-07 --message "Fill the fried basket — taro puff,
ham sui gok, jin deui" --include …` (three exact paths).

---

## Step 5 — The plate (1 file)

1. `recipes/noodles/beef-chow-fun.cook`

**Check.** `check-recipes --labels`.

**Commit.** `lisa commit-ticket --ticket-id T-001-07 --message "Dry-fry the ho fun, no gravy in
it" --include recipes/noodles/beef-chow-fun.cook`

---

## Step 6 — Whole-collection verification

Run in order and record the output for `review.md`:

1. `node scripts/check-recipes.mjs --labels` over all eighteen at once. Every line must read
   `ok`, and the printed staircases are read once more end to end. This is the acceptance
   criterion that cannot be satisfied by the exit code alone — "the printed label staircase reads
   as a cook's verbs rather than sentence fragments" is a human judgement, so it is made
   deliberately here rather than assumed.
2. `npm run recipes`. If it still dies on another ticket's dangling pairing, note it and re-run
   after; the build must be proved to succeed *with* these eighteen files present before Review
   can pass, so if it cannot be run to completion that is a blocking finding, not a footnote.
3. `npx vitest run`. Compare failure-for-failure against the baseline above. Any new failure is
   traced to a file, not explained away.
4. A throwaway script in the scratchpad over `normalise()` for the counts:
   - recipes naming Dim Sum Counter (target ≥ 18)
   - of those, naming it and no other (target ≥ 12)
   - every new file has `title`, `category`, `tags`, `servings`, `counters`, `aka`
   - every timer in every new file has a name
5. `git status --short` — confirm nothing outside `recipes/**` is modified by this ticket, and
   that no ticket-owned file is left staged, modified or untracked.

---

## Step 7 — Progress and Review

- `progress.md`: what landed, in which commit, with gap items 14–21 each named and given a reason
  for not being written, plus any deviation from this plan and why.
- `review.md`: the table of files, the acceptance criteria against measured evidence, the
  `check-recipes` output, test coverage against the baseline, and open concerns — including the
  aisles this ticket adds without being able to fix, and the menu sections T-001-17 owns.
- `review-disposition.json`: `{"disposition":"pass","reason":null}` if every criterion is met by
  measurement; a `block` with a named remedy owner otherwise.
- `lisa check-disposition T-001-07`, and fix whatever it reports.

## Risks, and what each costs

| Risk | Cost if it happens | Mitigation |
| --- | --- | --- |
| A dumpling's two-branch tree does not tile | every dumpling file reshapes | har gow is written first, on purpose |
| The parallel tickets keep `npm run recipes` broken | Step 6.2 cannot complete | re-run; if still broken and not caused by this ticket, it is reported in `review.md` with the exact other-ticket file named |
| A verb here is not in the icon table | `icons.test.ts` gains a fall-through verb | labels are written from the mapped vocabulary listed in Research §4 |
| New ingredients have no aisle | `shopping.test.ts` moves further past its threshold | cannot be fixed from this ticket; counted exactly and recorded for T-001-17 |
| A method is plausible but wrong | nothing catches it | vocabulary and method sourced from `docs/knowledge/counters.md` §Dim Sum Counter; flagged in Review as the thing a human must judge |
