# T-001-18 — Plan

Seven steps. Each ends at a green command and a `lisa commit-ticket` with exact
`--include` paths. Steps 1–5 are independently verifiable; 6 depends on all of them.

Throughout: `node scripts/parse-recipes.mjs` after any `recipes/**` edit, because
`src/generated/recipes.json` is what every test reads and it is not committed.

---

## Step 0 — clear the scratch file

`src/lib/__probe.test.ts` was written during Research to read the schedule totals and the
icon corpora. Delete it before anything else, so no commit can pick it up and `git status`
stays honest.

**Verify:** `git status --short` shows no `src/lib/__probe.test.ts`.
**Commit:** none — it was never committed.

---

## Step 1 — the two schedule data defects

`recipes/spice-blends-and-marinades/ginger-garlic-paste.cook` — drop the `~chill{3%weeks}`
shelf-life timer from step 3, move the keeping time into that step's prose, retitle the step
label. `recipes/dressings-and-dips/lime-pickle.cook` — `>> time: 15 days` → `14 days`.

**Verify:**

```sh
node scripts/check-recipes.mjs recipes/spice-blends-and-marinades/ginger-garlic-paste.cook \
                               recipes/dressings-and-dips/lime-pickle.cook
node scripts/parse-recipes.mjs
npx vitest run src/lib/schedule.test.ts
```

The three-ferment assertion still fails (it names `injera` and `pizza-dough`), but the
**author-agreement** assertion must now pass: the top three become `sour-dill-pickles`,
`sauerkraut`, `lime-pickle` at 0.00 / 0.00 / 0.00 drift. That is the measurable outcome of
this step — 3 failures → 2.

**Commit:** `lisa commit-ticket --ticket-id T-001-18 -m "Stop two jars claiming the time they keep for" --include recipes/spice-blends-and-marinades/ginger-garlic-paste.cook --include recipes/dressings-and-dips/lime-pickle.cook`

---

## Step 2 — the ferment assertion becomes a property

`src/lib/schedule.test.ts`, first `it` of `the recipes with the longest critical path` only.
Asserts of each of the top three: over a week long; its single longest task carries more than
half the path; that task is `unattended` and its `confidence` is `stated` (the author named
the timer). The three current names go in a comment.

**Verify:** `npx vitest run src/lib/schedule.test.ts` — 0 failures, all three `it`s green.
Then a deliberate check that the property has teeth: temporarily assert `.slice(0, 5)` and
confirm it still passes for `pastrami` and `corned-beef` (both cures), and that it would fail
on a recipe whose length came from many small steps. Revert the slice.

**Commit:** `--include src/lib/schedule.test.ts`

---

## Step 3 — icons: narrow the corpus, then fill the map

Two files, one commit, because the second is only correct in the presence of the first.

1. `src/lib/icons.test.ts` — `operationLabels` reads `layout(buildTree(recipe))` cells of
   `kind === 'op'` instead of every step; docstring amended.
2. `src/lib/icons.ts` — the 19 verbs from Structure §A1.

**Verify:**

```sh
npx vitest run src/lib/icons.test.ts
```

The fall-through list must go 54 → 11 after edit 1 alone (the eleven noun-and-adjective-led
cells of Step 4), and 11 → 11 after edit 2 — i.e. **edit 2 removes exactly the 19 verbs and
introduces nothing.** The three other collection tests in that file (`has operations to look
at`, `gives every operation a real icon`, `does not lean on one icon`) must stay green on the
narrower corpus; the last one is the real guard, since it fails if a lazy mapping collapses
everything onto one glyph.

**Commit:** `--include src/lib/icons.test.ts --include src/lib/icons.ts`

---

## Step 4 — the eleven mangled labels

Six files, the fourteen `>> step.N:` lines in Structure §C. No paragraph text moves, so no
step index shifts.

**Verify:**

```sh
node scripts/check-recipes.mjs --labels recipes/soups/chintan-broth.cook \
  recipes/soups/tonkotsu-broth.cook recipes/noodles/miso-ramen.cook \
  recipes/noodles/shio-ramen.cook recipes/noodles/shoyu-ramen.cook \
  recipes/noodles/tonkotsu-ramen.cook
node scripts/parse-recipes.mjs && npx vitest run src/lib/icons.test.ts
```

Read the six staircases by eye — this is the one step whose output is a judgement, and the
`--labels` staircase is the tool the README says exists for exactly it. `icons.test.ts` must
be **fully green** at the end of this step: 0 fall-throughs.

**Commit:** `--include` the six files.

---

## Step 5 — one tag vocabulary

The 51 files of Structure §D, one `>> tags:` line each, 24 spellings folded.

**Verify:**

```sh
node scripts/parse-recipes.mjs
node -e "const R=require('./src/generated/recipes.json'); \
  const t=new Set(R.flatMap(r=>r.tags)); console.log(t.size); \
  const n=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,''); \
  const g={}; for(const x of t){(g[n(x)]=g[n(x)]||[]).push(x)} \
  console.log(Object.values(g).filter(v=>v.length>1))"
```

Must print `503` and `[]`. Then re-check the three pairs the normaliser cannot see —
`cookie/cookies`, `appetiser/appetizer`, and the six method verb/participle pairs — by
grepping the tag dump. Also confirm no file gained a duplicate tag.

**Commit:** one commit, all 51 files by exact path.

---

## Step 6 — hand-offs, and the sections that hold them

`recipes/**` (Structure §E, 10 files) and `src/data/counters.json` (§F) **in one commit** —
a `>> counters:` line without its section entry renders an `Also` heading, which is a
regression against T-001-17's criterion.

**Verify:**

```sh
node scripts/parse-recipes.mjs
npx vitest run
node -e "const R=require('./src/generated/recipes.json'),C=require('./src/data/counters.json'); \
  for(const c of C.counters){const mine=R.filter(r=>r.counters.includes(c.name)); \
    const placed=new Set(c.sections.flatMap(s=>s.items)); \
    const un=mine.filter(r=>!placed.has(r.slug)).map(r=>r.slug); \
    const ghost=[...placed].filter(s=>!mine.some(r=>r.slug===s)); \
    if(un.length||ghost.length)console.log(c.name,'unsectioned',un,'ghosts',ghost)}"
```

The last must print nothing: **no counter renders `Also`, and no section names a slug that is
not shelved there.** Counts move Diner 73 → 77, Taquería 33 → 34, assignments 618 → 623.

Then confirm the four `aka` edits by searching for each dropped name and finding one claimant:

```sh
node -e "const R=require('./src/generated/recipes.json'); \
  for(const n of ['tzatziki','white sauce','yellow rice','clear chicken broth','pizza sauce','sunday gravy']) \
    console.log(n, R.filter(r=>[r.title,...(r.aka||[])].some(a=>a.toLowerCase()===n)).map(r=>r.slug))"
```

**Commit:** the 10 recipe files + `src/data/counters.json`, exact paths.

---

## Step 7 — rewrite `docs/gaps/`

Fifteen counter notes and `README.md`. Done last, because it reports the state Steps 1–6
produce. Order within the step: the fifteen first, `README.md` after, so the tally is computed
from finished notes.

For each of the fifteen:

1. Regenerate `## What it has` from `src/data/counters.json` — same titles, same order, same
   slugs, in the `**Title.** slug · slug` shape.
2. Strike from `## What it is missing` and `## Components it would need` every entry now on
   the shelf, checked by matching the bolded dish name against the collection's titles and
   `aka` rather than by memory.
3. Append the ranked-but-unwritten items the writer tickets recorded, so nothing is lost.
4. Rewrite the header paragraph to the counter's real count and its real remaining complaint.
5. Leave `## What it could not stock` alone.

**Verify — the round-trip, which is the whole reason the block has a fixed shape:**

```sh
node scripts/menu-sections.mjs        # report only, never --write
```

It must report the sections **already in `counters.json`**, with nothing unparsed and nothing
added or removed. T-001-17 warned that running it today would undo that ticket; after this
step it reproduces it. That is the acceptance test for G1.

`README.md` last: the fifteen-row tally recomputed from `recipes.json` and `counters.json`,
with before-and-after columns, plus the build-state paragraph and the rewritten
"what no single classifier could see" section.

**Verify:** every number in `README.md` regenerated by the same one-liners used above, not
typed from memory.

**Commit:** two commits — the fifteen notes, then `README.md`.

---

## Step 8 — the whole thing

```sh
npm run verify
```

End to end: `check` (514 files draw) → `recipes` (parse) → `vitest run` (0 failures) →
`astro build`. This is acceptance criterion 5 and it is the gate on Review.

Then the ownership check the workflow requires:

```sh
git status --short          # no ticket-owned file staged, modified or untracked
```

---

## Testing strategy

**There is no new unit test in this ticket, and that is deliberate.** The work is data plus
two test repairs; a new test file would be a third `src/` file asserting something the
existing collection tests already cover.

What covers what:

| Change | Gate | What it cannot catch |
| --- | --- | --- |
| Tag folds (§D) | `parse-recipes.mjs`, and the two one-liners in Step 5 | Nothing enforces the vocabulary going forward — a checker is recorded in `README.md` as the next pass's work |
| Label rewrites (§C) | `icons.test.ts`, `check-recipes.mjs --labels` | Whether the new wording is a *better* sentence. Read by eye, six files |
| Schedule fixes (§B) | `schedule.test.ts`, both assertions | Whether 3 weeks is the right keeping time for a ginger-garlic paste. It is the file's own claim, unchanged |
| Counter additions (§E/§F) | `collection.test.ts`, the unsectioned/ghost one-liner | Whether meatloaf belongs at a diner. It is the gap doc's own ranked item |
| `aka` edits (§E) | the claimant one-liner in Step 6 | Whether a searcher wanted the other one |
| Gap notes (§G) | `menu-sections.mjs` round-trip | Everything outside `## What it has`. Prose, read by eye |

**Known gap, stated plainly:** the round-trip check proves the `What it has` block agrees with
`counters.json`. Nothing checks that the *missing* lists are complete or that a struck item is
genuinely on the shelf — that is 15 files of judgement, and the mitigation is that every strike
is made by matching against titles and `aka`, not from memory.

## Rollback

Every step is one commit against one concern. Steps 1–5 are independent of each other; Step 6
is two files' worth of a single change; Step 7 touches only `docs/`. Reverting any single
commit leaves `npm run verify` green except for reverting Step 1, 2, 3 or 4 alone, which
restores exactly the failure that commit fixed.
