# T-011-04 — Plan

Nine steps. Steps 1–5 are inert on a collection with no `keeps` line, so each is verifiable alone.
Steps 6–8 are the annotation batches. Step 9 is the documentation and the final sweep.

Each step names its commit and its check. Every commit goes through
`lisa commit-ticket --ticket-id T-011-04 --message … --include <exact paths>`. No ordinary
`git add`, no `git commit`, nothing left staged.

---

## Step 1 — the reader

**Files:** `src/lib/keeps.ts` (new), `src/lib/keeps.test.ts` (new).

Write both together: the reader is pure, so its tests are the whole verification.

- `readKeeps`, `keepsWord`, `mentionsFreezer`, `NOT_AT_ALL`, the `Keeps` / `KeepsReading` types.
- The unit half of the test file only — the collection sweep is added at step 5, once anything is
  declared, because `declared.length >= 60` cannot pass before the annotations land.

**Check:** `npx vitest run src/lib/keeps.test.ts` green. `npm run verify` unaffected (nothing
imports the file yet).

**Commit:** `Read how long a dish keeps, and refuse a number on its own`
`--include src/lib/keeps.ts src/lib/keeps.test.ts`

---

## Step 2 — the type and the promotion

**Files:** `src/lib/tree.ts`, `scripts/normalise.mjs`, `scripts/parse-recipes.mjs`.

`RawRecipe.keeps` / `keepsProblem`; `readKeeps(metadata.keeps)` in `normalise`; `'keeps'` into
`PROMOTED`; `recipe.keepsProblem` into the refusal loop in `parse-recipes`.

**Check:** `npm run recipes` writes 685 recipes with `"keeps": null` on every one and no throw.
Spot-check with a scratch file carrying `>> keeps: 3 days` (no character) that the build **fails**
with the reader's message — then delete the scratch file. That negative check is the one that
proves the refusal is wired, and it is cheap.

**Commit:** `Promote the keeps line, and refuse one that is half-written`
`--include src/lib/tree.ts scripts/normalise.mjs scripts/parse-recipes.mjs`

**Hazard, from research §9:** those two scripts carry T-009-04's uncommitted step-reference wiring.
`lisa commit-ticket --include` commits the file, not the hunk, so that wiring rides along if it is
still uncommitted when this step runs. Before committing: re-check `git diff` on both files and
record in `progress.md` exactly what went with them. Do not revert or stage anything of theirs — a
carried-along commit is recoverable; a reverted one is lost work.

---

## Step 3 — the checker

**Files:** `scripts/check-recipes.mjs`.

The `keepsProblem` report, the `measure()` line, the freezer note. The `CAPS` entry is added here
with a placeholder comment; **the measured figures are written in at step 9**, once every line
exists to measure. Cap value 150 from D5.

**Check:** `npm run check` — 685 files, no new failures, no new notes (nothing declares yet).

**Commit:** `Cap what a keeps line may say, and warn when it wanders into the freezer`
`--include scripts/check-recipes.mjs`

---

## Step 4 — the render

**Files:** `src/components/Timeline.astro`.

The import, the const with its comment, the `{keeps && …}` block under `washing-up`, `.keeps` into
the four existing selector lists.

**Check:** `npm run build` clean. With one hand-annotated recipe present, `dist/` contains
`Does it keep`; with it removed, no page contains an empty panel. (The permanent version of that
second check is the collection test at step 5.)

**Commit:** `Put whether it keeps under what you will wash`
`--include src/components/Timeline.astro`

---

## Step 5 — batch A: the four fried, and the collection tests

**Files:** four `.cook` files + `src/lib/keeps.test.ts`.

- `recipes/stir-fries/general-tsos-chicken.cook`, `orange-chicken.cook`, `sesame-chicken.cook`,
  `sweet-and-sour-pork.cook` — paths confirmed at implement time; `docs/gaps/one-pot.md` names the
  slugs, not the paths.
- All four are *not at all*, each saying **what happens to it in a cook's words** — the coating
  going from crisp to wet is not the same failure as a glaze going tacky, and the criterion asks
  for the words, not the verdict.
- The collection half of `keeps.test.ts` is added now, with `declared.length >= 4` as a temporary
  floor, raised to 60 at step 8. (Written as a constant with a comment so the raise is one edit and
  is visible in the diff.)

**Check:** `npm run verify`. Four pages carry the panel; 681 carry nothing.

**Commit:** `Say what a quart of frying oil buys and how long it lasts`
`--include <the four .cook paths> src/lib/keeps.test.ts`

---

## Step 6 — batches B and C: One Pot (73 files)

Read in two passes, committed in two units.

**B — stews and braises (~41).** The shelf where the answer is mostly *it improves*: chili, the
curries, the goulash, the tagine. The interesting ones are where it does not — a dish finished with
dairy or fresh herbs, a skin or a crust, `country-fried-steak`.

**C — soups, rice and beans (~32).** The split this batch exists to record: bean and lentil dishes
that improve against rice dishes that go to paste, `risotto-alla-milanese` (the texture is the
dish), `paella`'s socarrat, and the egg soups where the egg is the point.

**Rule applied per file, from D6:** texture-is-the-dish → improves → the specific thing that goes
wrong first → otherwise leave it off and record it.

**Check after each:** `npm run check` on the touched folder, then `npm run verify`.
`git diff --stat` must show `+1` and `-0` on every file.

**Commits:**
`Say which pot dishes are better on Tuesday` `--include <B paths>`
`Separate the beans that improve from the rice that does not` `--include <C paths>`

---

## Step 7 — batches D and E: Instant Pot (25) and The Slow Cooker (20)

**D — Instant Pot.** Seven of these are stock or broth, and their keeping question is a different
one: not *do you still want to eat it* but *is the gel still there and has the fat capped*. Written
in those terms.

**E — The Slow Cooker.** Siblings of batch B. The answer is written for *this* file, not copied from
its One Pot twin — a slow cooker's longer, wetter cook is a real difference where it is one, and
where it is not the two lines will simply agree.

**Check:** `npm run verify` after each.

**Commits:**
`Say what a sealed pot leaves you on Wednesday` `--include <D paths>`
`Say what eight hours on low is like the next day` `--include <E paths>`

---

## Step 8 — batch F: the air fryer shelf, and the count

**Files:** the air fryer files that state the answer for themselves, per the criterion
(*"whatever S-008's air fryer files say for themselves"*) — the crisp things, and
`air-fryer-reheated-pizza`, which is a recipe *for* the answer.

Then raise the floor in `keeps.test.ts` from 4 to **60** and confirm the real count is above it.

**Check:** `npm run verify`. The test now asserts the acceptance count.

**Commit:** `Say how long a crust lasts, on the shelf that is all crust`
`--include <F paths> src/lib/keeps.test.ts`

---

## Step 9 — the README, the cap's measurement, the sweep

**Files:** `README.md`, `scripts/check-recipes.mjs`.

1. Measure the character halves across everything declared: count, mean, p95, max. Write those
   figures into the `CAPS` comment. **If the max is over 150, shorten the line, not the cap** —
   that is the file's own stated rule and this field has no legacy to plead.
2. The README bullet, per structure §7: the two halves, the mandatory character, **the food-safety
   framing in plain unhedged words**, `not at all`, **the freezing decision and its argument**, and
   absent-is-normal. Plus the `src/lib/keeps.ts` row in the file-map table.
3. Final sweep before Review:
   - `git status --short` shows nothing of this ticket's staged, modified or untracked;
   - `git diff HEAD --stat -- recipes/` over the whole ticket shows `+1 -0` per file and no other
     recipe line touched;
   - `npm run verify` from clean.

**Commit:** `Say plainly that this is about dinner, not about safety`
`--include README.md scripts/check-recipes.mjs`

---

## Testing strategy

**Unit (`src/lib/keeps.test.ts`, vitest).** The reader is pure and carries the entire contract, so
this is where the acceptance criteria are actually pinned:

| Criterion | Test |
| --- | --- |
| a declaration with character parses | `readKeeps('3 days — better on the second')` → whole value, character verbatim |
| a bare duration fails | `'3 days'`, `'3 days —'`, `'2 weeks :'` → `keeps: null`, problem naming what is missing |
| an undeclared recipe renders nothing | collection sweep: every undeclared recipe is `null`, which is the `{keeps && …}` guard |

**Collection (same file, over `src/generated/recipes.json`).** The regression net `slack.test.ts`
established: whole-or-null, re-read without complaint, both kinds of answer present, the count
floor, no thin characters. These fail loudly if a future annotation is sloppy, which is the point.

**Integration (`npm run verify`).** `check` → `recipes` → `vitest` → `astro build`. The build is the
only thing that exercises `Timeline.astro`, so a render mistake shows there and nowhere else.

**Manual, once, at step 4.** Read one rendered page and confirm the three panels read as one family
and the label does not sound like a safety claim. Not automatable and worth the two minutes.

---

## What could go wrong, and what happens then

- **A guessed keeping time.** The failure mode the ticket calls out by name. Mitigation is the D6
  rule and the honest skip list; the count of skips goes in `review.md`, and a suspiciously low
  count is itself the alarm.
- **A concurrent thread committing the same script files.** Step 2's hazard note. Recorded, not
  prevented — the DAG has no edge for it.
- **The cap fights the writing.** If several good lines want 160 characters, that is evidence about
  the cap and it is written up rather than worked around. `slack reason` at 200 is the precedent for
  a number moved with a measurement beside it.
- **Scope creep into freezing.** The advisory warning exists to catch it in the lines themselves;
  the README exists to catch it in the next author.
