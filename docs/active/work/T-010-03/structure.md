# T-010-03 — Structure

Two files change in the repository. Nothing under `src/`, `scripts/` or `recipes/` is touched.

---

## Files

| path | action | ~lines | what |
| --- | --- | --: | --- |
| `docs/gaps/filter.md` | **create** | ~200 | what the filter cannot say, in the shape of a gap page's *what it could not stock* |
| `docs/gaps/README.md` | modify | +40 | per-dial coverage as fractions of 685, what the filter looks like at that coverage, and a link to the new page |
| `docs/active/work/T-010-03/*.md` | create | — | the six phase artifacts, published by Lisa |

**Not modified, and each for a stated reason:**

- `src/lib/time.ts` — the vocabulary proposals are written up in `filter.md` and applied by
  nobody. The file's own header is the argument for why.
- `src/lib/schedule.ts` — `handsOnEvidence()`'s hole is described, not repaired.
- `src/pages/search.json.ts` — `cookware` and `servings` stay out of the index.
- `src/components/dials.ts` — no dial is added and no rule is changed.
- every `.cook` file — the twelve one-file annotation fixes are listed by slug and left.

## `docs/gaps/filter.md` — the new page

The gap pages have a fixed shape: what it has, what it is missing, what it could not stock. This
page is the third section of that shape applied to a control rather than a counter, so it keeps
the section title the other twenty-five files use.

```
# The filter — what it cannot say

  (opening: what the three dials measure, and the one sentence
   that says a filter is a claim about 685 recipes at once)

## What it can answer                     — the coverage table, per dial, /685
## What the scenario looked like          — 227 · 42 · 416, with the verdict counts
## What it could not stock                — the eight things, each with its evidence
##   · Whether you have the equipment
##   · Whether it started yesterday
##   · Whether the shopping is done
##   · How tired the reader actually is
##   · Whether it is dinner
##   · How many it feeds
##   · Whether the standing figure is a figure or a floor
##   · Whether twenty minutes is a setting            (it is not)
## What was found and not fixed           — the vocabulary proposals, unapplied
## What would close each of these         — one line per item, ranked
```

**Ordering matters in one place.** The four candidates the ticket names come first and in the
ticket's order, because a reader arriving from the ticket should find them where they expect. The
four found by running it follow.

**The vocabulary proposals are a section of this page, not a separate file.** They are the
largest single thing found and they are unapplied; splitting them out would make them look like a
plan rather than a finding, and the whole point is that changing `time.ts` is somebody else's
ticket.

## `docs/gaps/README.md` — the modification

One new second-level section, placed **immediately after `## Build state`** and before
`### Retired counters`.

Chosen position because `Build state` is already where this file keeps *counts measured at a
moment* — "timers in 640 files, washing-up declared in 11" is the same kind of sentence this
ticket is adding, and those two numbers are now stale by a lot. The new section sits next to
them and says what its own numbers were measured against.

```markdown
## What the three dials can answer for

  (a paragraph: the dials are only as good as what has been annotated,
   and the three have very different coverage)

  | dial | rule | can answer for | share of 685 |

  (what the filter looks like at that coverage, per dial — the sentence
   that says a reader turning the sink dial is mostly filtering by who
   got annotated)

  (a pointer to docs/gaps/filter.md)
```

It does **not** get the findings, the verdict table or the vocabulary proposals. `README.md`'s job
is the counter tally and the ranked list of what to do next; three hundred lines of filter audit
in the middle of it would bury both.

**One existing line becomes wrong and is left alone.** `## Build state` reads *"664 files draw a
table, 664 recipes parse, 894 tests green in 11 files, 688 pages build"* and *"timers in 640
files, washing-up declared in 11"*. Every one of those is stale — it is 685, 1082 and 177 now.
That block says in its own text that it was *"measured after T-007-05, with the whole of S-007
in"*, which is the convention this repository uses for a number that was true on a Tuesday.
Rewriting it would be claiming S-007's measurement as this ticket's, and the new section carries
its own date and its own basis instead.

## The interface between the two files

The README section states the coverage and links. `filter.md` restates the coverage table once,
because a page about what a filter cannot say that does not say what it can answer for is not
readable on its own, and a reader arriving from a link should not have to go back.

That is a deliberate duplication of one table across two files. The alternative — README links
out for its own coverage numbers — makes the file that the next pass reads for work depend on
another file to answer the question the ticket asks it to answer.

## Ordering of the work

1. **`docs/gaps/filter.md` first.** It carries the evidence; the README section is a summary of
   its first table, and writing the summary first invites the summary to be the thing that is
   true.
2. **`docs/gaps/README.md` second**, quoting the same numbers.
3. **`npm run verify` and `npm run verify:mobile` last**, and neither can be affected by either
   file — no build step reads `docs/`. They are run because the criterion says so, and because
   the branch is live under other tickets and a red suite needs attributing.

## What a reviewer should check first

- The **227 verdicts** are a judgement. The rule is stated in `design.md` D2, the two hand-read
  sets are printed in full in `progress.md`, and the counts are broken down by reason. A reviewer
  who disagrees with rule 1 can subtract 112 and get a different headline; that is the intended
  affordance.
- The **`reduce`/`thicken` measurement** is the one number in this ticket produced by running
  modified code. The modification is a copy in a scratch directory, both versions run over the
  same 685 records, and `git status --porcelain -- src/` is the check that the repository copy is
  untouched.
