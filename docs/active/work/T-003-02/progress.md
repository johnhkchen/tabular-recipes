# T-003-02 — Progress

All five planned steps done, in the planned order, one commit each. No deviations from the
plan's design; two things it did not anticipate are recorded at the bottom.

| Step | What | Commit |
| --- | --- | --- |
| 1 | the reader and its type | `34d3964` Give a recipe a way to say what happens if you get it wrong |
| 2 | through the pipeline | `9f410ad` Read slack out of the file, and refuse a line that is not whole |
| 3 | the render | `70af43e` Say it next to the clock, or say nothing |
| 4 | ten worked examples + collection sweep | `4e43c24` Ten worked examples, so a writer has a standard to copy |
| 5 | the authoring contract | `beaac00` Write the slack line into the authoring contract |

Every commit went through `lisa commit-ticket --ticket-id T-003-02` with exact
`--include` paths. Nothing ticket-owned is staged, modified or untracked.

## Step 1 — `src/lib/slack.ts`, `src/lib/slack.test.ts`, `tree.ts`, `schedule.test.ts`

`SLACK_LEVELS = ['forgiving', 'narrow', 'unforgiving']`, `readSlack()`, `slackWord()`.
`RawRecipe` gained `slack: Slack | null` and `slackProblem?: string | null`; the one
hand-built fixture in `schedule.test.ts` gained `slack: null`.

**Deviation, found while writing the tests.** The plan's parse — "first whitespace-delimited
token is the level" — breaks on `>> slack: narrow, it goes grey`, because the first token is
then `narrow,` with the separator stuck to it, and the reader rejects a legal line over
punctuation. Replaced with one regexp: the first run of letters is the level, one separator
after it is punctuation whether or not it is spaced, and everything left is the reason. The
test that caught it (`takes whichever separator the author reached for`) is kept.

Verified: 9 new tests green, 675 total green, and
`node -e "import('./src/lib/slack.ts')…"` proved Node strips the types before anything
depended on it. There is no TypeScript compiler in the project (`npx tsc` is not installed
and no script calls one), so types are checked by review and by esbuild's transform only —
which is the pre-existing state of this repo, not something this ticket changed.

## Step 2 — `normalise.mjs`, `check-recipes.mjs`, `parse-recipes.mjs`

Promoted beside `dish`/`kit`, `'slack'` added to `PROMOTED` so the key does not also survive
as a loose fact, and `slack` + `slackProblem` returned. The checker pushes the problem; the
build throws on it.

Verified with a throwaway probe file under the scratchpad, never inside `recipes/`:

- `>> slack: forgiving — an extra hour in the pot changes little` → `ok`
- `>> slack: gentle — …` → `FAIL … unknown slack "gentle" — it has to be one of: forgiving, narrow, unforgiving, and the rest of the line says what goes wrong`
- `>> slack: forgiving` → `FAIL … slack "forgiving" gives no reason — name the actual failure, e.g. >> slack: forgiving — an extra hour in the pot changes little`

The build's throw was proved by copying the malformed probe into `recipes/` for one run and
removing it in the same command; `npm run recipes` failed with the file's path and the same
sentence, and the probe is gone.

## Step 3 — `src/components/Timeline.astro`

One guarded `<dl class="slack" data-level=…>` after the notes and before the axis, plus a
`.slack` style block reusing the `.stat` well at full width, and one line added to the print
block. No colour keyed to the level.

Verified against real built HTML **before** any recipe declared one: 532 pages built, and
`grep -rl "If you get it wrong" dist/` matched **0** of them.

## Step 4 — ten `.cook` files and the collection sweep

Every file was read in full before its line was written, and every reason names something
that file's own steps actually say — the 82°C in crème anglaise's step override, the "never
let it boil" in the broth, the 2% salt and three weeks in the sauerkraut, the 500 g of salt
and three days in the lox.

| Recipe | Level |
| --- | --- |
| beef-stew, no-knead-bread, sauerkraut | forgiving |
| chicken-broth, mushroom-risotto, sourdough-boule, carne-asada | narrow |
| creme-anglaise, fried-chicken, belly-lox | unforgiving |

**Deviation from the plan's table.** `chicken-broth` was planned as *forgiving* and is filed
as *narrow*. Reading the file settled it: the three-hour simmer has hours of slack, but the
recipe says twice, in its own prose, that a boil emulsifies the fat and the broth "turns
beige and stays beige". That is a real window missed and a worse dinner, which is exactly
what the middle level is for. Ten examples rather than the required eight, and three
dangerous-or-unrecoverable rather than the required two.

Verified after: 534 pages built, `grep -rl "If you get it wrong" dist/` matched **exactly
10**, and they are exactly the ten slugs above. The before/after pair is the evidence that
the guard works in both directions.

## Step 5 — `README.md`

`>> slack:` added to the optional-metadata block, a bullet under it giving the three levels
and **two example lines** (one forgiving, one unforgiving, both lifted from the worked
examples so the README and the collection cannot drift), and a `src/lib/slack.ts` row in
"How it fits together".

## The one thing left open

`npm run verify` **passes on this ticket's work** — exit 0, 681 tests, 532 pages — proved by
running it in a clean worktree at `4e43c24`, the commit holding all of this ticket's source
changes.

At the current branch tip it fails, on a test this ticket does not own and did not touch:
`src/lib/icons.test.ts > recognises every verb the recipes open an operation with`, over the
verbs `cabbage`, `roots` and `vegetables`. Those come from
`recipes/stews-and-braises/new-england-boiled-dinner.cook` (added by `6fd3fd0`, T-002-04) and
`recipes/stews-and-braises/beef-stew-instant-pot.cook` (T-002-02, landing while this was
written). Neither file is this ticket's, neither existed at the session-start HEAD, and no
`>> slack:` line can affect an operation label. Detail and evidence in `review.md`.
