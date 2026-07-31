# T-003-05 — Plan

Four write-check-commit batches, then a whole-shelf verification. Every step is independently
verifiable, and any batch can fail without invalidating the ones before it.

## Step 0 — preconditions (already done in Research)

- `ls recipes/*/<slug>.cook` for all twenty plain slugs → all present, folders recorded in
  `structure.md`.
- `ls recipes/*/*-instant-pot.cook` → 25 files, thirteen of which match a slug in scope.
- `ls recipes/*/*-slow-cooker.cook` → none, so no basename collides.
- `grep -n "The Slow Cooker" src/data/counters.json` → the counter exists, exact string confirmed.

**Verification:** all four commands run and their output recorded in `progress.md`.

## Step 1 — batch A: the flagship four

`pot-roast`, `chili-con-carne`, `carnitas`, `corned-beef`.

These four set every convention the other sixteen copy: the metadata block, the `~slow cook`
timer, the liquid cut stated in the intro line, the browning operation, the thickening operation,
and the slack line. They are written first and read back before anything else is written, because
a convention error caught here costs four files and caught at the end costs twenty.

**Verification:**

```sh
node scripts/check-recipes.mjs --labels \
  recipes/stews-and-braises/pot-roast-slow-cooker.cook \
  recipes/stews-and-braises/chili-con-carne-slow-cooker.cook \
  recipes/stews-and-braises/carnitas-slow-cooker.cook \
  recipes/stews-and-braises/corned-beef-slow-cooker.cook
```

Pass condition: `ok` for all four, row/col counts inside 5–16 rows and 3–6 operation columns, and
the printed label staircase reads as a cook's verbs — specifically that the long stretch's label
names the setting (`slow cook on low 8 hr`, not `slow cook 8 hr`).

**Commit:** `lisa commit-ticket --ticket-id T-003-05 --message "..." --include <the four paths>`.

## Step 2 — batch B: the rest of the pressure siblings

`birria-de-res`, `cachete`, `oxtails`, `braised-short-ribs`, `beef-stew`, `chile-verde`,
`collard-greens`, `hungarian-goulash`, `boston-baked-beans`.

Nine files. After this batch the twelve-sibling criterion is exceeded (thirteen), which is the
criterion most at risk if the run is cut short — so it is satisfied second, not last.

`boston-baked-beans` is the one file in `rice-beans-and-grains` and the one carrying a food-safety
sentence (beans parboiled before they enter the machine). It gets read back word by word.

**Verification:** same command over the nine paths; `ok` for all nine.

**Commit:** one `lisa commit-ticket` with the nine exact paths.

## Step 3 — batch C: the six with no pressure sibling

`osso-buco`, `lamb-tagine`, `irish-stew`, `new-england-boiled-dinner`, `brunswick-stew`,
`soy-sauce-chicken`.

Three of these waive browning (`irish-stew`, `soy-sauce-chicken`,
`new-england-boiled-dinner`), so the check here is as much about the prose as the parse: each
waiver has to say why, in the file, in a sentence a cook would accept.

`soy-sauce-chicken` is the only `unforgiving` file and the only whole bird. Its stock is brought to
a simmer on the stove before the bird goes in — that is both the plain recipe's own first step and
the reason the bird is not climbing slowly from cold.

**Verification:** same command over the six paths; `ok` for all six.

**Commit:** one `lisa commit-ticket` with the six exact paths.

## Step 4 — batch D: the twentieth

`baked-turkey-wings`. The only file that colours in the oven rather than a skillet, carrying the
plain file's own note that a covered start steams the skin grey.

**Verification:** `node scripts/check-recipes.mjs --labels` on the one path.

**Commit:** one `lisa commit-ticket` with the one path.

## Step 5 — whole-shelf verification

```sh
node scripts/check-recipes.mjs --labels recipes/*/*-slow-cooker.cook
grep -L "slack:"   recipes/*/*-slow-cooker.cook     # must print nothing
grep -L "slow cook" recipes/*/*-slow-cooker.cook    # must print nothing
grep -c "kit: Slow Cooker" recipes/*/*-slow-cooker.cook | grep -v ':1$'   # must print nothing
git status --porcelain                              # only the 20 new files, all committed
```

Then the collection-level checks, which catch what a per-file check cannot:

```sh
npm run recipes     # parse-recipes.mjs — throws if two files claim the plain way for a dish
npm run verify      # parse + tests + build
```

`npm run verify` is the project's one command that must pass. It is run once, at the end, over the
whole collection — not per batch, because it rebuilds everything and other tickets may be writing
concurrently.

**Pass condition:** `verify` green. If it fails on something outside `recipes/**` — a
concurrently-written Instant Pot file, say — the failure is recorded in `review.md` and attributed,
rather than fixed here: this ticket may not edit another ticket's files.

## Step 6 — counts, checked rather than assumed

```sh
ls recipes/*/*-slow-cooker.cook | wc -l                     # >= 18   (expect 20)
for f in recipes/*/*-slow-cooker.cook; do
  d=$(sed -n 's/^>> dish: //p' "$f")
  ls recipes/*/"$d"-instant-pot.cook >/dev/null 2>&1 && echo "$d"
done | wc -l                                                # >= 12   (expect 13)
```

Both numbers go into `review.md` as measured output, not as claims.

## Step 7 — Review

`review.md` (files created, the sourced-times table, coverage, open concerns, the skip list with
reasons) and `review-disposition.json`. Then `lisa check-disposition T-003-05`, and correct
anything it reports.

## Testing strategy

There is no unit test to write — the deliverable is data, and the project's tests are the parser,
the checker and the collection invariants:

| Layer | What it catches | When it runs |
| --- | --- | --- |
| `check-recipes.mjs --labels` | a file that would not draw a table; unknown counter; bad slack; unlabelled cell; too few rows/cols | per batch |
| `parse-recipes.mjs` | two files claiming the plain way for one dish; an unresolvable counter | step 5 |
| `src/lib/collection.test.ts` | unique slugs, mutual pairings, one plain way per dish | inside `npm run verify` |
| `layout.test.ts` | every table tiles with no holes | inside `npm run verify` |
| the label staircase, read by eye | a mangled sentence fragment where a cook's verb should be; a long stretch that does not name its setting | per batch |

**The gap no automated check covers:** whether a time is *right*. Nothing in the repo can tell an
8-hour low cook from a 6-hour one. That is why the sourced table in `design.md` exists and why
every number in it was taken from the canonical slow-cooker treatment of that dish rather than
computed from the plain file. It is the single thing a human reviewer should spot-check.

## Rollback

Each batch is its own commit through `lisa commit-ticket`. A bad batch is a revert of one commit
and does not touch the others. No pre-existing file is modified, so there is nothing to restore.
