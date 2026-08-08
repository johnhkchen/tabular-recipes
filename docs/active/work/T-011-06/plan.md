# T-011-06 — Plan

Six commits, each through `lisa commit-ticket` with exact `--include` paths, each one a thing that
works on its own. The gate is step 2: if the closed form disagrees with `costOf` anywhere in the
collection, nothing after it is worth writing.

Every command below runs with `PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` — node is on
`nvm` and not on this shell's default path.

---

## Step 1 — The vocabulary and the cost at a target

**Write** `src/components/situation.ts`: `CONTROLS`, `Situation`, `NOBODY`, `TARGETS`, `anyoneSet`,
`target`, `days`, `SituationItem`, `costAt`, `scaledItem`. No sentences, no shelving yet.

**Verify:** `npx vitest run src/components` still green (nothing imports it yet); `npx tsc --noEmit`
is not a project script, so type errors surface through `astro build` in step 6 and through
vitest's own transform.

**Commit:** `--include src/components/situation.ts`

## Step 2 — The index carries the numbers, and the agreement is proved

**Modify** `src/pages/search.json.ts`: seven keys, `TARGETS` imported from `situation.ts`, the
schedule passed into every `costOf` call.

**Write** the first half of `src/components/situation.test.ts`:

- for all 685 recipes × all 8 targets, `costAt()` reproduces `costOf(recipe, max(n, s))`'s
  `elapsed.at` / `standing.at` / `longest.at` **exactly** (both code paths — 639 closed-form, 46
  table);
- `scaledItem` returns the item unchanged whenever the target is at or below the written servings;
- `canAnswer` is invariant under scaling on every recipe at every target;
- every reachable `target(situation)` is in `TARGETS`.

**Modify** `src/pages/_search.json.test.ts`: the new keys present exactly where they should be, and
`waitMinutes` equal to `costOf`'s own written figures.

**Verify:** `npx vitest run` — this is the gate. Also record the index size before and after
(`astro build`, `wc -c dist/search.json`) and put both numbers in `progress.md`; design.md D3 claims
4% and a claim like that should be measured, not asserted.

**Commit:** `--include src/pages/search.json.ts src/components/situation.test.ts
src/pages/_search.json.test.ts`

## Step 3 — The fourth question and the shelving

**Modify** `situation.ts`: `keepsMinutesNeeded`, `keepsVerdict`, `Shelf`, `shelve`.

**Tests** (second half of `situation.test.ts`):

- `days − 1`: a 3-day span passes three days, a 2-day span fails it, `not at all` fails two days,
  everything passes one day;
- silence is `unsaid` at two days and irrelevant at one;
- the off state delegates to `verdict()` for all 685 recipes × 64 settings — **byte-identical
  behaviour**;
- a known failure beats an unknown on the fourth question too;
- `dropped` is only ever a recipe that was not already failing at the written size.

**Verify:** `npx vitest run src/components/situation.test.ts`

**Commit:** `--include src/components/situation.ts src/components/situation.test.ts`

## Step 4 — The sentences

**Modify** `situation.ts`: `reason`, `dropped`, `silence`, `keepsLine`, and the two private word
helpers. Design.md D8's table is the specification, uncertainty rows first.

**Tests:**

- one test per row of D8's table, on a hand-built shape chosen for it;
- the notation ban over **every sentence the module can produce for all 685 recipes at all 8
  targets** — no `×`, no `→`, no `O(`, no bare multiplier;
- named slugs: `chili-con-carne` at eighteen (*feeds eighteen without taking any longer*),
  `beef-with-broccoli` at twelve (§3's worked example — binds, costs nothing),
  `air-fryer-chicken-wings` at eighteen (binds on a wait, costs real minutes), `gyoza` (*doesn't
  time enough of itself to say*).

**Verify:** `npx vitest run`

**Commit:** `--include src/components/situation.ts src/components/situation.test.ts`

## Step 5 — The page

**Modify** `src/pages/index.astro` (control row, dropped shelf, four-way render, URL state) and
`src/styles/site.css` (`.situation`, `.reason`, `.wont-scale`).

**Verify:** `npm run build`, then by hand through `scripts/browser.mjs` at 375px:

1. pristine front page — counter row present, no `data-situation` state in the URL, tally reads
   *Press / to search*;
2. `?people=6&days=3` pasted cold — the list reproduces, both controls painted;
3. people=1, days=Today with `standing=15` — **the same list as `?standing=15` alone**, captured
   before and after as the criterion's before-and-after;
4. keyboard: tab order runs box → people → days → the three dials, Space presses.

**Commit:** `--include src/pages/index.astro src/styles/site.css`

## Step 6 — Both situations, read as a cook

**Run** `npm run verify` and `npm run verify:mobile` in full, against a build standing still (a
concurrent rebuild trips `check-overflow`'s own guard — T-010-02 hit this).

**Run both of S-011's situations end to end** and read every result:

- *exhausted, two meals for one, for today* — people 1, days Today, standing 15 min. Expect the
  list to equal the dials-only list, recipe for recipe.
- *stressed, six people, over three days* — people 6, days 3 days. Read the **whole** match list
  and give a verdict per recipe: would a cook batch-cook this? The ticket says if it is full of
  things nobody would batch-cook, the model or the annotation is wrong **and that is the finding**.
  Read the dropped shelf too, and check that what dropped deserved to.

**Screenshot** at 375px with the situation set, for the front-door judgement (design.md D10). If the
controls dominate, that goes in `review.md` as a finding with what should happen — not as a reason
to ship it quietly.

**Write** `progress.md`, then `review.md` and `review-disposition.json`, then
`lisa check-disposition T-011-06`.

---

## Testing strategy, in one place

| what | how | why not otherwise |
| --- | --- | --- |
| the cost at a target | whole-collection equality with `costOf` | the closed form is the one place this ticket could invent a number |
| identity at small numbers | object identity on `scaledItem`, plus `shelve` vs `verdict` over 685 × 64 | the criterion is *identical*, and identical is testable |
| the sentences | one hand-built shape per phrasebook row + a collection-wide notation grep | a row asserted against a real recipe breaks when the recipe changes |
| the shelving | hand-built shapes for the four outcomes, collection-wide for the delegation | — |
| the URL | round-trip every combination, reject every malformed one | T-010-02's precedent |
| rendering, `replaceState`, the live region | by hand through `scripts/browser.mjs` | nothing in vitest drives a DOM, and jsdom is a dependency this ticket does not get to take |
| overflow and touch targets | `npm run verify:mobile` | — |

## Risks

1. **The closed form disagrees with `costOf`** on some recipe. Then design.md D3 falls back to
   option A (a full table, +110 KB) and that trade lands in `review.md`. Step 2 is deliberately the
   second thing done.
2. **The three-day list is thin or wrong.** 138 recipes carry `keeps` and the rest go to *we can't
   say*. If the match list reads as things nobody would batch-cook, that is the ticket's headline
   finding and belongs in `review.md` with the slugs.
3. **Five control rows swamp the front door.** Mitigated by one row rather than two (design.md
   D10); judged from a screenshot, and reported honestly either way.
4. **`src/styles/site.css` is shared with T-011-05.** It has not started, and the additions are a
   new block at the end of the dial section rather than edits to existing rules.
