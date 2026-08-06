---
id: T-005-06
story: S-005
title: the-prose-nobody-reads
type: task
status: done
priority: medium
phase: done
depends_on: [T-005-05]
---

## Context

The cause, addressed last because it is the least visible and the largest.

A `>> step.N:` line overrides the operation label (`scripts/normalise.mjs:132`,
`src/lib/tree.ts:128`). When it does, the step's own written prose is discarded — it is not the
label, it is not a row, it is not anywhere. The only place it survives is inside the collapsed
`See how it is written` block on the recipe page (`src/pages/[slug].astro:132`), where it appears
as raw cooklang with `@&(~1)scrubbed bones{}` in the middle of it.

**1501 steps across 474 recipes are in that state. 228,000 characters that no reader sees.**

That is how the collection got two voices. The files were written as prose essays; when an essay
would not fit an operation cell, a `step.N:` line was bolted on to rescue the table; the essay
stayed, unread and unchecked, and kept growing because nothing it could break was visible. The
headnotes and the `slack:` lines the last two tickets just cut were the same essay leaking out
where the table did not catch it.

## What is actually in there

Read tonkotsu's second step, which is typical:

> Return `@&(~1)scrubbed bones{}` to the pot with `@water{2 1/2%qt}`, lock the lid and
> `~pressure cook{90%min}` at high pressure. **Less water than the stovetop version on purpose:
> nothing evaporates under pressure, so the eight-hour recipe's six quarts would come out thin
> here.** Keep the pot no more than two thirds full whatever size it is.

Three sentences, two kinds. The first and third tell a cook what to do. The bold one defends a
decision against a comparison the reader did not make. Same split as everywhere else in this
story, and the same test: **does this change what I do at the stove?**

**So do not delete the bodies.** They hold real cooking detail the 70-character label cannot —
*"scrub every bone under the tap until nothing brown or grey clings to it"* is the difference
between white broth and grey, and it exists nowhere else. Cut the defence, keep the instruction,
and the file becomes a recipe again instead of an essay with a recipe in it.

## The safe boundary

**Only steps that already have a `>> step.N:` override.** For those, the body is invisible and
editing it cannot change a single pixel.

A step *without* an override has its body derived into the label — editing that body edits the
table. Those are out of scope entirely. This is what makes the ticket verifiable: after this
ticket, **every operation cell label in the collection is byte-identical to before.** Nothing
else needs proving.

Do not remove a `>> step.N:` line, do not add one, do not change one. If a shortened body would
now make a good label on its own, that is a finding for the gap document, not a change here — the
label is what the table draws and T-005-05 just proved the tree unchanged.

## Where the ingredients live

The bodies carry the `@ingredient{qty}` and `~timer{}` markup. Every one of those is real data:
it is the ingredient column, the shopping list, the timeline and the schedule. **Cutting a
sentence that contains one deletes it from the recipe.**

So: cut whole sentences that carry no markup, and rewrite in place the ones that do. If a
sentence has to go and holds an ingredient, the ingredient moves to a kept sentence first.

The proof is arithmetic. Before and after, across all 658 recipes: the same ingredient count, the
same timer count, the same quantities. `src/generated/recipes.json` gives all of it — diff the
`ingredients` and `timers` of every step and show the diff is empty.

## Scope, exactly

- **474 recipes, 1501 steps.** Last in the `.cook` chain: T-005-04 has rewritten the slack lines
  and T-005-05 the prose rows, both in these same files. Rebase your list on the current files
  rather than on T-005-01's original report, which predates both.
- **Not the prose rows** (T-005-05, done) and **not the slack lines** (T-005-04, done).
- 228k characters is a lot of reading. If the ticket cannot finish all 474, finish whole
  categories rather than a scattering, and say plainly in the work artifact which categories were
  done and which were not. A partial pass that is honest about its boundary is worth more than a
  complete one that is not.

## Acceptance Criteria

- Every operation cell label in the collection is byte-identical to before this ticket. Show the
  comparison; this is the ticket's main safety property.
- Ingredient counts, timer counts and quantities are identical across all 658 recipes, shown by
  diffing `src/generated/recipes.json` before and after.
- No `>> step.N:` line is added, removed or changed.
- Steps without an override are untouched.
- Of the steps in scope, each edited body keeps its instructions and loses its justifications.
  Report the before/after character total and quote five worked examples in full.
- Whatever was not reached is named by category, not left implied.
- Bodies that would now make a good label on their own are listed in the work artifact as a
  finding. Nothing is acted on.
- `npm run check`'s over-cap report is smaller than when T-005-01 wrote it; paste both totals.
- `npm run verify` passes.
- Only step bodies inside `.cook` files that have a `>> step.N:` override are modified. No
  metadata line, no component, no data file.
