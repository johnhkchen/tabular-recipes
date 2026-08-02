# T-002-05 — Plan

Four batches of three bowls, each written, checked and committed before the next starts, then one
collection-level verification pass and the acceptance sweep.

## Testing strategy

There are no unit tests to write. This ticket adds data, and the collection already has three
layers of checking that read it:

| Layer | Command | What it can catch | When |
| --- | --- | --- | --- |
| **Per file** | `node scripts/check-recipes.mjs --labels <paths>` | missing metadata, unknown counter, malformed `slack:`, a broken tree (two consumers, two roots, a ref to a step that makes nothing), fewer than 3 rows or 3 columns, an unlabelled operation cell, cooklang warnings | after every batch |
| **Collection** | `node scripts/parse-recipes.mjs` then `npx vitest run` | dangling `pairs-with`, non-mutual pairing, duplicate slug, a timer with no readable duration, ≥4 unbroken hands-on hours, a counter that does not exist | once, after batch 4 |
| **Whole build** | `npm run verify` | all of the above plus `astro build` | once, at Review, and read with the knowledge that three sibling tickets have files in this tree |

The `--labels` staircase is not machine-checkable — the acceptance criterion is that it "reads as a
cook's verbs" — so every staircase is pasted into `progress.md` and read by eye.

**Definition of done for one file:** `check-recipes.mjs --labels` prints `ok` with 5–16 rows and
3–4 columns, the staircase reads as verbs, every timer is named, `title`/`category`/`tags`/
`servings`/`counters`/`aka` are all present, and every `pairs-with` slug resolves to a file that
exists today.

---

## Step 1 — Batch 1: the gap-ranked bowls

Write `recipes/rice-beans-and-grains/harvest-bowl.cook` (gap rank 8),
`teriyaki-chicken-bowl.cook` (rank 19), `crispy-rice-bowl.cook` (rank 15).

These three are first because they are the ones the gap note names, and because between them they
exercise every structural risk in the ticket: a five-branch merge (`harvest`), a component used as
an ingredient with a `pairs-with` line (`teriyaki`), and the operation floor (`crispy-rice`, whose
base is deliberately cold day-old rice rather than a grain cooked from raw).

**Verify:** `node scripts/check-recipes.mjs --labels recipes/rice-beans-and-grains/harvest-bowl.cook recipes/rice-beans-and-grains/teriyaki-chicken-bowl.cook recipes/rice-beans-and-grains/crispy-rice-bowl.cook`

Expect `ok` ×3, `all 3 file(s) draw a table.`, and three staircases pasted into `progress.md`.

**Commit:** `lisa commit-ticket --ticket-id T-002-05 --message "…" --include` the three exact paths.

---

## Step 2 — Batch 2: the ticket-named bowl, the salmon, the tofu

Write `harissa-chicken-bowl.cook` (named in the ticket; closes gap rank 3's cauliflower and rank
4's farro inside a bowl), `miso-salmon-bowl.cook` (rank 5 — the largest protein hole on the
counter), `bbq-tofu-bowl.cook` (rank 14, and rank 7's Brussels sprouts as a step).

Same verify, same commit shape.

Watch for: `harissa-chicken-bowl` is the widest file (six leaves on the marinade branch) and is the
one most likely to exceed 16 rows. If it does, the marinade loses its olive oil before anything
else is cut.

---

## Step 3 — Batch 3: the archetype bowls

Write `burrito-bowl.cook`, `poke-bowl.cook`, `spicy-lamb-bowl.cook`.

Watch for: `poke-bowl` has the most `pairs-with`-adjacent risk (`goma-dare`, `shichimi-togarashi`)
and its rice is seasoned in a second step, so its `@&(~1)` chain is the one to re-read.
`spicy-lamb-bowl` must not re-teach `sumac-onions` — its onion goes in raw in the build with
vinegar, not macerated with sumac as a component.

---

## Step 4 — Batch 4: the rest of the board

Write `chicken-pesto-bowl.cook`, `fish-taco-bowl.cook`, `crispy-chickpea-bowl.cook`.

Watch for: `chicken-pesto-bowl` is the only six-operation file. If `check-recipes.mjs` reports more
than four columns, the pesto fold merges back into the farro step.

---

## Step 5 — Collection verification

```sh
node scripts/parse-recipes.mjs
npx vitest run
node scripts/check-recipes.mjs --labels recipes/rice-beans-and-grains/*bowl.cook
```

**Pass conditions**

1. `parse-recipes` completes and reports the new file count, with no dangling `pairs-with` and no
   duplicate slug.
2. `vitest run` is green, specifically `pairings › point at recipes that are here`,
   `pairings › are mutual`, `the collection › only names counters that exist`,
   `the timeline data › reads a duration off every timer it found`.
3. All twelve files `ok`.

**If a `pairs-with` dangles** it is because a slug was mistyped or because it belongs to a sibling
ticket that has not landed. The fix is always to drop or correct the slug in *my* file — never to
wait for, or write, another ticket's file.

**If `vitest` fails on something that is not mine** (a sibling's in-flight file), record it in
`progress.md` with the failing test name and carry on; it is evidence for Review, not a defect in
this ticket.

---

## Step 6 — The acceptance sweep

Walk the eight criteria and record the evidence for each in `progress.md`:

1. **≥10 new `.cook`, each `counters: The Bowl Shop`, each a composed grain or rice bowl** —
   `grep -c` over the twelve; twelve files, twelve counter lines.
2. **Real cooking: ≥3 non-assembly operations and a table that says something a list would not** —
   the column count and the staircase from `--labels`; four non-assembly operations minimum.
3. **No bowl re-teaches an existing component; those are `pairs-with:` with every slug confirmed** —
   a loop that checks each named slug resolves to a real file, plus a written note on the four
   judgement calls (quick black beans vs `cuban-black-beans`, raw vinegared onion vs
   `sumac-onions`, cabbage vs `coleslaw`, lime rice vs `mexican-red-rice`).
4. **Every file carries `aka` with the names people say, generics included** — grep each file for
   `>> aka:` and confirm at least one generic term per file.
5. **Gap-note grain bowls written in rank order, anything skipped named** — ranks 8, 19, 15 in
   batch 1; ranks 4, 5, 14 in batch 2; ranks 22 and the plain-grain reading of 4 recorded as
   deliberately not written, with reasons.
6. **`check-recipes.mjs --labels` ok for every new file, staircase reads as verbs** — full
   transcript in `progress.md`.
7. **Every timer named; `title`/`category`/`tags`/`servings`/`counters` on every file** — a grep
   for `~{` (an unnamed timer) across the twelve must return nothing, and a metadata grep must
   return twelve of each.
8. **Only `recipes/**` modified, no pre-existing file edited** — `git status --porcelain` shows the
   twelve as untracked-then-committed and nothing of mine modified; `git show --stat` on each of my
   four commits lists only my paths.

---

## Step 7 — Review

Write `review.md` and `review-disposition.json`, then run `lisa check-disposition T-002-05`.

`review.md` covers: the twelve files and their shapes; the component overlaps T-002-07 and T-002-08
need (roasted sweet potato, sesame kale, crisped chickpeas, roasted cauliflower, roasted Brussels
sprouts, quick-pickled red onion, seven-minute egg, parmesan frico, blackened fish, quinoa/farro/
wild rice as plain tables); the second-counter shelving suggestions; the archetype collision that
kept bibimbap and the donburi off the shelf; and the fact that nothing here is shelved until
T-002-08 writes the `counters.json` items.

Disposition is `pass` if all eight criteria hold with evidence, `block` with an actionable reason
otherwise. After both artifacts exist, stop and wait for Lisa.

## Risks, and what each one costs

| Risk | Cost | Response |
| --- | --- | --- |
| A sibling ticket writes a slug I also chose | duplicate-slug build failure | slugs chosen are all bowl names; T-002-06 writes salads and T-002-07 components. Checked again at Step 5 |
| A `pairs-with` slug is a near-miss (`salsa-verde` vs `salsa-verde-cruda`) | build error | every slug copied from `ls` output, then re-checked at Step 5 |
| A bowl reads as assembly despite five operations | acceptance criterion 2 | the staircase is read by eye in `progress.md`; a bowl that reads as a list is rewritten, not defended |
| The tree rejects a build step | per-file failure | all references are relative `@&(~N)` counting the prose header; caught immediately by the per-batch check |
| `npm run verify` fails on a sibling's file | none to this ticket | recorded with the failing name, not fixed here |
