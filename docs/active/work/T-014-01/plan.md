# T-014-01 — Plan

Seven steps. Steps 1–3 are measurements and were run during Research; their outputs are the
inputs to steps 4–6, and they are re-run at step 7 so nothing on the page is older than the
final build.

---

## Step 0 — the baseline, before anything

```sh
git status --porcelain -- recipes/ src/ scripts/ src/data/    # must be empty
npm run verify                                                # must exit 0
```

Recorded in `progress.md`. Re-run identically at step 7; the two must agree.

**Result at Research:** both clean. 685 files draw a table · 685 recipes parse · 1229 tests in 21
files · 710 pages built · 22 counters, 930 slugs listed and printed.

---

## Step 1 — the tag re-run

`scratchpad/tags.mjs`, over `src/generated/recipes.json`. Runs two normalisers:

- **T-001-18's own verifier**, quoted from `T-001-18/plan.md:113-124` — fold accents, lowercase,
  strip non-alphanumerics, group, print the collisions. It printed `503` and `[]`.
- **plus singularisation**, which `T-001-18/research.md:163` describes and the verifier does not
  implement, so the broader reading is reported beside the narrow one rather than instead of it.

Also greps for the verb/participle and British/American pairs neither normaliser can see, from
T-001-18's own hand-checked list.

**Verification of the measurement itself:** the script prints the distinct-tag count, the total
tag uses, and the per-tag file lists, so a reader can check any single group by hand.

---

## Step 2 — the cross-property checks

`scratchpad/cross.mjs` and `scratchpad/cross2.mjs`. Six checks, each printed with its result:

| # | check |
| --- | --- |
| 1 | a `capacity` naming a vessel that its own `washing-up` list does not |
| 2 | a `capacity` on a file with no `washing-up` line |
| 3 | a `keeps` span on a file whose `slack` says it cannot be held |
| 4 | a `washing-up` count that contradicts its counter's promise (One Pot; the air fryer gate) |
| 5 | a `washing-up` count of 1 on a file naming three or more vessels |
| 6 | a dish group where one variant declares a property and its sibling is silent |

**Every check reports by slug or as `none found`, and the check itself is printed on the page** —
the ticket accepts *none found* only when the check that produced it is stated.

**Known false-positive risk, handled:** a `capacity` below its own `servings` is *legal* — the
checker permits it when a bound step's words say the recipe batches, which is why
`beef-with-broccoli` exists. That is not a contradiction and is excluded rather than reported.

---

## Step 3 — the seven headline claims

One claim per story, taken from the story's own bolded thesis, checked against `dist/` after a
clean build. The commands, per claim, are recorded in `progress.md` beside their output.

Where a claim is about a migration that has already run and left no baseline — S-009's
*byte-identical* — the **observable residue** is what is checked (`grep -rn '^>> *step\.' recipes`
→ 0, and the checker refusing a probe file), and the page says that is what was checked.

---

## Step 4 — write `docs/gaps/what-the-season-left.md`

Nine sections, `structure.md`'s order.

**Verify before committing:**

```sh
grep -c '^## What it has' docs/gaps/what-the-season-left.md          # must be 0
node scripts/menu-sections.mjs > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt                                  # must be empty
```

The second is T-013-03's check and it is the one that makes *no counter was opened* verified
rather than claimed.

Then, over the finished page:

```sh
grep -c 'T-0[01][0-9]-[0-9][0-9]' docs/gaps/what-the-season-left.md  # every finding names a ticket
```

and a read-through against the three bands: every finding in exactly one, every mechanical one
carrying a `*Verify:*` clause.

**Commit:** `lisa commit-ticket --ticket-id T-014-01 --include docs/gaps/what-the-season-left.md`.

---

## Step 5 — edit `docs/gaps/README.md`

Four localised edits, `structure.md`'s list. Written after the page so the links resolve.

**Verify:**

```sh
node scripts/menu-sections.mjs | diff /tmp/before.txt -    # empty: the README has no What-it-has block
grep -n 'what-the-season-left' docs/gaps/README.md         # the pointer and the band links resolve
npm run verify                                             # exit 0
```

**Commit:** one commit, exact `--include`.

---

## Step 6 — the no-fix proof

The acceptance criterion is a command and its output, not an assertion:

```sh
git status --porcelain -- recipes/ src/ scripts/ src/data/
git status --porcelain -- docs/gaps/ docs/active/work/T-014-01/
```

The first must print nothing. The second must print only the two owned paths, and after both
commits nothing at all.

---

## Step 7 — re-run and reconcile

Re-run steps 0–3 against the final tree. Any number on the page that moved gets corrected before
Review; any that did not is stated as unchanged. This is the step that catches a figure taken at
Research and stale by Implement — the failure T-010-02 recorded as a tripwire and T-012-02 hit
twice.

Then `npm run verify` one last time, exit code captured from the command rather than from a
pipeline. T-010-03 lost an afternoon to a pipeline exit code and T-014-03's ticket names it.

---

## Testing strategy

**No test is added, and that is the answer rather than a gap.** This ticket writes two markdown
files. `src/lib/` is unchanged, so there is nothing new to unit-test, and a test asserting a
paragraph exists is a test of the diff. T-012-02, T-013-01 and T-013-03 — the three closest
precedents, all documents produced by reading the collection — shipped the same way and all three
dispositions passed.

What stands in for tests:

| check | catches |
| --- | --- |
| `npm run verify` before and after | anything touched that should not have been |
| `menu-sections.mjs` before/after diff | the new page opening a counter |
| `git status --porcelain` over the four forbidden path roots | a fix applied by accident |
| every mechanical finding's own `*Verify:*` command, run once here | a finding that cannot actually be verified, which by the ticket's rule is not mechanical |
| every headline claim re-measured off `dist/` | a claim carried forward from an artifact rather than checked |

**The gap no check can close, and it is the important one: a finding could be missed.** Twenty-nine
`review.md` files and twenty-nine `progress.md` files is ~10,700 lines and nothing proves the read
was exhaustive. The mitigation is structural rather than empirical — every artifact stores its
deferrals under the same four headings (`research.md` §3), and the per-ticket table forces a line
for each of the twenty-nine whether or not it had anything, so an empty row is a claim rather than
a silence. That is weaker than a test and it is said so here rather than dressed up.

---

## Risks

| risk | mitigation |
| --- | --- |
| A finding is banded mechanical and T-014-02 pushes it back | the tie-break is *push it out of mechanical*, and `design.md` D3 shows five findings that failed test 3 |
| A number is taken at Research and stale at Review | step 7 |
| The new page opens a counter | `menu-sections.mjs` before/after diff, and no `## What it has` block |
| A fix is applied by accident | step 6, run after every commit |
| The page is unreadably long | grouped bands, a fixed bullet skeleton, and the per-ticket table as a table rather than as prose |
