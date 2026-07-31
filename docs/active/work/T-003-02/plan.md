# T-003-02 — Plan

Five commits, each one runnable and verifiable on its own. Every commit goes through
`lisa commit-ticket --ticket-id T-003-02 --message <m> --include <exact paths>`; no ordinary
`git add`, no `git commit`, nothing left staged or untracked at the end.

The order is the dependency order from Structure: the reader, then the pipeline, then the
render, then the recipes that exercise all three, then the documentation.

---

## Step 1 — the reader and its type

**Files**

- new `src/lib/slack.ts`
- new `src/lib/slack.test.ts` (unit half only; the collection sweep lands in step 4)
- mod `src/lib/tree.ts` — `slack` / `slackProblem` on `RawRecipe`, `import type { Slack }`
- mod `src/lib/schedule.test.ts` — `slack: null,` in `fixture()`

**Do**

1. Write `SlackLevel`, `SLACK_LEVELS`, `Slack`, `SlackReading`, `readSlack`, `slackWord`
   exactly as Structure specifies, with a header comment stating the two rules the file
   exists to hold: authored never derived, and absent is a legitimate answer.
2. Keep it type-strippable — `export type` / `import type`, no enum, no decorator — because
   `normalise.mjs` imports it under plain `node`.
3. Write the unit tests: three levels parse; five separator forms plus none; case and padding
   normalise; missing reason fails; unknown level fails and the message lists all three legal
   values; a reason with no level fails as an unknown level; absent is `{null, null}`.

**Verify**

```sh
npx vitest run src/lib/slack.test.ts     # new tests green
npx vitest run                            # nothing else regressed
npx astro check || npx tsc --noEmit       # if either is available; types compile
node -e "import('./src/lib/slack.ts').then(m => console.log(m.readSlack('forgiving — x')))"
```

The last one is the real check that Node can strip the types, which is what
`normalise.mjs` will depend on.

**Commit** — `slack.ts`, `slack.test.ts`, `tree.ts`, `schedule.test.ts`.

---

## Step 2 — through the pipeline

**Files**

- mod `scripts/normalise.mjs` — import, read beside `dish`/`kit`, `'slack'` into `PROMOTED`,
  `slack` and `slackProblem` on the returned object
- mod `scripts/check-recipes.mjs` — `if (recipe.slackProblem) problems.push(recipe.slackProblem)`
  after the counters loop
- mod `scripts/parse-recipes.mjs` — throw on `recipe.slackProblem`

**Do**

1. Promote in `normalise.mjs`. Confirm the key is deleted from the residual `metadata`, so a
   promoted field is not also a loose fact — the rule that file's own comment states.
2. Add the checker line and the build throw. Neither assembles a message; both print the one
   `slack.ts` wrote.

**Verify**

```sh
npm run check                    # all 514 still ok — no file declares slack yet
npm run recipes                  # builds; grep the JSON for the new field
node -e "const r=require('./src/generated/recipes.json'); console.log(new Set(r.map(x=>x.slack)))"
```

Then a **throwaway** file to prove the three outcomes, written under the scratchpad rather
than into `recipes/` so nothing is left behind:

- `>> slack: forgiving — an extra hour in the pot changes little` → `ok`
- `>> slack: gentle — …` → `FAIL`, message lists `forgiving, narrow, unforgiving`
- `>> slack: forgiving` → `FAIL`, message says the reason is missing

`node scripts/check-recipes.mjs <scratch>/probe.cook` for each. Delete the probe afterwards.

**Commit** — the three scripts.

---

## Step 3 — the render

**Files**

- mod `src/components/Timeline.astro` — import `slackWord`, one guarded `dl`, one style block,
  one line in the print block

**Do**

1. Insert the block after `{notes.length > 0 && …}` and before the axis caption.
2. One guard on the whole element. No placeholder branch, no `else`, no default level.
3. Styles reuse the `.stat` well treatment at full width. No colour keyed to `data-level`.

**Verify**

```sh
npm run build                    # astro build with zero recipes declaring slack
grep -rc "If you get it wrong" dist/ | grep -v ':0' | head    # expect: no matches yet
```

That is the acceptance criterion for absence, checked against real built HTML: with nothing
declared, the phrase appears nowhere in 514 built pages. After step 4 the same grep must
match exactly the ten annotated slugs — the before/after pair is the evidence that the guard
works in both directions.

**Commit** — `Timeline.astro`.

---

## Step 4 — the ten worked examples, and the collection sweep

**Files**

- mod ten `.cook` files (the table in Structure)
- mod `src/lib/slack.test.ts` — the whole-collection sweep

**Do**

1. **Read each file first.** Write the reason from what that recipe's own steps say — the
   temperature it names, the window it gives, the step that cannot be undone. A reason that
   describes a failure the file does not contain is worse than no reason, and these ten are
   the standard three writer tickets will copy.
2. Place the line with the other optional metadata: after `>> time:`, before any
   `>> step.N:` overrides.
3. Cover all three levels; make at least three of the ten genuinely dangerous or
   unrecoverable (crème anglaise, fried chicken, belly lox).
4. Add the sweep: every recipe is `null` or whole; no declared line re-reads as a problem;
   all three levels are present; at least eight recipes declare one.

**Verify**

```sh
node scripts/check-recipes.mjs recipes/custards-and-puddings/creme-anglaise.cook  # and the other nine
npm run recipes
npx vitest run src/lib/slack.test.ts
npm run build
grep -rl "If you get it wrong" dist/ | wc -l     # expect exactly 10
```

Ten pages carry the line, 504 do not, and nothing in the other 504 gained an empty slot.

**Commit** — the ten recipes plus `slack.test.ts`.

---

## Step 5 — the authoring contract

**Files**

- mod `README.md`

**Do**

1. Add `>> slack:` to the optional-metadata code block.
2. Add the bullet under it: the three levels and what each means, the reason being required
   when a level is present, the whole line being optional, and **two example lines** — one
   forgiving, one unforgiving, both lifted from the worked examples so the README and the
   collection cannot drift.
3. Add the `src/lib/slack.ts` row to "How it fits together".

**Verify** — read it back cold. Does someone opening their first `.cook` file know what to
write and when to leave it off?

**Commit** — `README.md`.

---

## Step 6 — the whole thing

```sh
npm run verify          # check → recipes → vitest → astro build, the one command that must pass
git status --short      # nothing ticket-owned staged, modified or untracked
```

Then `progress.md`, `review.md` and `review-disposition.json`, and
`lisa check-disposition T-003-02`.

---

## Testing strategy

| What | How | Where |
| --- | --- | --- |
| each level parses | unit, `readSlack` per level | `slack.test.ts` step 1 |
| a missing reason fails | unit, both `forgiving` and `forgiving —` | `slack.test.ts` step 1 |
| an unknown level fails | unit, and the message names the legal values | `slack.test.ts` step 1 |
| separators an author might type | unit, five forms plus none | `slack.test.ts` step 1 |
| the field survives the pipeline | sweep over `recipes.json` | `slack.test.ts` step 4 |
| no half-declared recipe exists | sweep: every recipe null or whole | `slack.test.ts` step 4 |
| the worked examples cover all levels | sweep | `slack.test.ts` step 4 |
| an undeclared recipe renders no line | the guard is one value; the value is swept, and the built HTML is grepped before and after step 4 | `slack.test.ts` + step 3/4 verification |
| a malformed line cannot reach the site | probe file through `check-recipes.mjs`; `parse-recipes.mjs` throws | step 2 |

**The one gap, stated up front.** There is no test that renders `Timeline.astro`. Doing so
needs `experimental_AstroContainer` plus the Astro Vite plugin, which arrives through a root
`vitest.config.ts` — a file outside the `scripts/` · `src/` · `README.md` budget this ticket
is held to. The render is therefore reduced to a single guard over a single nullable value:
the value is unit-tested and swept across the whole collection, and the rendered output is
verified by grepping `dist/` before and after the recipes are annotated. Review says this
plainly rather than implying component coverage that does not exist.

## Risks

| Risk | Handling |
| --- | --- |
| A reason that misdescribes its recipe | Read every file before writing its line; quote the file's own temperature or window. |
| `slack` colliding with a future filter/tag vocabulary | The vocabulary is exported from one module; nothing hard-codes the strings elsewhere. |
| The new `RawRecipe` field breaking a hand-built literal | Only one exists (`schedule.test.ts:49`); it is in step 1's commit. |
| Node failing to strip types in a new `.ts` import | Proven in step 1's verify before anything depends on it. |
| Touching a file another ticket owns | `src/data/counters.json` and `src/lib/time.ts` appear in no step. Every `--include` is listed above. |
