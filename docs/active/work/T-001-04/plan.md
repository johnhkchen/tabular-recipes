# T-001-04 — Plan

Eleven commits, each one or more finished `.cook` files that already pass the checker. Verify
after every commit; verify the collection once at the end.

## Testing strategy

There is no code here, so there are no unit tests to add — this ticket adds data, and the
collection's invariants are already tested generically in `src/lib/collection.test.ts`. What
substitutes for a test suite:

| Check | Scope | When | Pass condition |
| --- | --- | --- | --- |
| `node scripts/check-recipes.mjs --labels <file>` | one file | before every commit | `ok`, and the label staircase reads as verbs |
| `grep -n '~{' <file>` | one file | before every commit | no match — an unnamed timer |
| `grep -c '^>> counters: Takeout Counter$'` | one file | before every commit | exactly 1, and nothing after the counter name |
| `node scripts/check-recipes.mjs` | all 268 | after the last commit | `all 268 file(s) draw a table` |
| `npm run recipes` | collection | after the last commit | parses; proves every `pairs-with` resolves and every counter name is known |
| `npx vitest run` | collection | after the last commit | no **new** failure beyond the known-red `schedule.test.ts` |
| `git status --porcelain -- recipes/` | worktree | after the last commit | empty |
| a counted shelf query over `recipes/` | criteria | after the last commit | ≥16 at the counter, ≥10 exclusive |

The verification criterion the acceptance list actually names is the first row: `--labels` on
every new slug. The last row is the acceptance arithmetic, and it is run as a one-liner over
`>> counters:` lines rather than by eye.

**Known-red baseline, established before writing anything.** `npx vitest run` is recorded now,
before the first file, so that "no new failure" is a comparison and not an assertion.

## Steps

Each numbered step is one `lisa commit-ticket` with exact `--include` paths. No ordinary
`git add`, no `git commit`, nothing left staged.

**0. Baseline.** Run `npx vitest run` and `node scripts/check-recipes.mjs` and record both
counts in `progress.md`. Nothing is written.

**1. `recipes/sauces-and-gravies/house-brown-sauce.cook`**
The component two later files lean on, and half of ranked item 7. Points at nothing, so it is
safe to land first. Verify: checker `ok` at 10 rows × 5 cols.

**2. `recipes/dumplings-and-rolls/egg-rolls.cook`** — new folder.
Ranked item 5, pulled forward because three later files pair with it. First deep-fried thing
in the collection. Verify the `~cool{30%min}` reads unattended in the staircase.

**3. `recipes/stir-fries/general-tsos-chicken.cook`** — new folder.
Ranked item 1, the loudest absence. At the 16-row ceiling, so the checker's row count is the
thing to read: 16 rows × 7 cols. If it comes back at 17, the fix is dropping the sesame oil
from step 5, not adding an operation.

**4. `recipes/stir-fries/sesame-chicken.cook`, `recipes/stir-fries/orange-chicken.cook`**
Ranked item 2, both at once because they are the same fry under two glazes and reviewing them
together is what catches an accidental copy-paste of the wrong glaze.

**5. `recipes/noodles/lo-mein.cook`** — new folder.
Ranked item 3, and the first noodle dish anywhere on the site. Three branches merging at step
5 makes this the most likely file to fail tiling; check it before writing its sibling.

**6. `recipes/stir-fries/beef-with-broccoli.cook`**
Ranked item 4. The only file carrying `house brown sauce` as a row, so step 1 of this ticket
has to be on disk first — it is.

**7. `recipes/soups/hot-and-sour-soup.cook`, `recipes/soups/egg-drop-soup.cook`,
`recipes/soups/wonton-soup.cook`**
Ranked item 6, the whole soup section in one commit. `wonton-soup` is the second file at the
16-row ceiling and has a ref-only step 3; if the checker objects to the ref-only step, the
remedy is folding the boil into step 2's label, not dropping a row.

**8. `recipes/stir-fries/egg-foo-young.cook`**
Completes ranked item 7 — the section, now that its gravy exists.

**9. `recipes/dumplings-and-rolls/crab-rangoon.cook`**
Ranked item 8.

**10. `recipes/stir-fries/sweet-and-sour-pork.cook`**
Ranked item 9 — the dish under the sauce that was already on the shelf.

**11. `recipes/noodles/singapore-mei-fun.cook`**
Ranked item 10. Last because it pairs with `madras-curry-powder` and `char-siu`, both of which
predate this ticket, so nothing gates it but the ranking.

**12. Collection verification.** Not a commit. Run the four collection-scope checks in the
table above, plus the shelf arithmetic, and write the numbers into `progress.md`.

## Verification criteria, per acceptance line

| Criterion | How it is verified |
| --- | --- |
| ≥16 shelved, ≥10 naming this counter alone | counted from `>> counters:` lines across `recipes/`; expected 20 and 15 |
| Top of the gap list written, in order; skips named | steps 1–11 run in ranked order; the two skips (char siu, plain mei fun) are named in `review.md` with reasons |
| `check-recipes.mjs --labels` ok for every new file, staircase reads as verbs | run per file at commit time and once over all fourteen at the end; the staircase is pasted into `review.md` |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` incl. an undiacriticked form | the first four are enforced by the checker; `counters`/`aka` are checked by grep over the fourteen |
| Every timer named | `grep '~{'` over the fourteen returns nothing |
| Quantities real for the servings; canonical method | judgement, recorded per file in `progress.md`; the two the gap doc calls out — velveting and the twice-fry — are written in rather than shortcut |
| Only `recipes/**` modified | `git status --porcelain` shows nothing outside `recipes/` and Lisa's own paths |

## Risks and what happens if they land

- **A file exceeds 16 rows.** Three are designed at or near the ceiling. The remedy is always
  to drop a garnish row, never to add an operation — an operation is a column and columns are
  what break a phone.
- **Tiling failure on a three-branch merge** (`lo-mein`, `singapore-mei-fun`). The remedy is to
  merge two branches one step earlier, not to flatten to a single chain, which would misdescribe
  the cooking.
- **`vitest` goes redder.** Nothing here is long enough to displace a ferment in
  `schedule.test.ts`, and no new counter or category name is invented outside `recipes/`. If a
  new failure appears anyway, it goes in `review.md` and, if it is not this ticket's to fix,
  the disposition says so rather than editing a file this ticket does not own.
- **A sibling ticket lands the same slug.** Checked in Research — no dish here appears in
  another counter's gap doc, and the story assigns lo mein and the egg roll to this counter by
  name. If a collision appears at the end, the collection check will show a duplicate basename
  and it becomes a `block`.
