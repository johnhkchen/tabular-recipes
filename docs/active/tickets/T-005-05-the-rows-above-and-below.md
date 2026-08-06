---
id: T-005-05
story: S-005
title: the-rows-above-and-below
type: task
status: done
priority: high
phase: done
depends_on: [T-005-03, T-005-04]
---

## Context

The full-width prose rows — the sentence above the table and the one below it. These are the
first and last words a cook reads, and they are the longest.

A step with no ingredients and no refs becomes one of these rows (`src/lib/tree.ts:119` and
`~126`): before the first real operation it is a **header**, after it a **footer**. Measured:

| | Count | Mean | Max | Over 120 chars |
| --- | --- | --- | --- | --- |
| Headers | 286 | 135 | **757** | 126 |
| Footers | 107 | **276** | 596 | **106 of 107** |

**183 recipes carry a row over 120 characters**, concentrated in `stews-and-braises` (61),
`soups` (28) and `rice-beans-and-grains` (22).

And each of these rows renders **three times on one page** — once in the table view, once in
prep, once in cook. `boston-baked-beans-slow-cooker` opens with 757 characters, paid three times,
before anybody puts a bean in a pot.

The 3× is not a bug and is not being changed: the three views are three ways to read the same
recipe and each needs its own copy. It is the multiplier that makes a long row expensive. A
short row costs three short rows and nobody notices.

## The decision this carries out

**Shelf talk goes to the shelf. Dish talk stays, short.**

T-005-03 has already built somewhere for it to go, and has already moved four of them as proof —
read its work artifact first and do not move the same sentence twice.

The test for each sentence is one question: **does this change what I do at the stove?**

> "A crock is the closest vessel to a bean pot there is, and this is the one bean dish on the
> shelf where slow beats pressure outright."

No. It is a comparison with the other things on the shelf, and it is interesting *on the shelf*.
Move it.

> "Six hours on low. Lid off for the last one or the top never sets."

Yes. Stays.

Three destinations for every sentence, and every sentence gets one:

1. **Stays** — it changes what you do. Cut to the cap.
2. **Moves to the counter menu** — it compares this dish to its neighbours.
3. **Goes** — it justifies the recipe's existence to a reader who already clicked on it. This
   will be more of them than expected.

## The footers are the surprise

106 of 107 footers are over 120 characters, and they are a different animal from the headers.
Read a few before deciding anything:

> `fresh-egg-pasta` — "Toss it into the pan of sauce with a splash of that water and keep it
> moving over the heat for half a minute. This is the operation nobody writes down…"

That is not commentary. It is **a cooking step that was never written as one** — it has a verb,
an ingredient and a duration, and it ended up as a paragraph under the table because it was
written as prose instead of as a step.

**Do not promote it to a step in this ticket.** Adding an operation changes the merge tree, the
column count, and every mobile measurement T-004 took. Shorten it in place, keep it a footer, and
**list every footer that is really a step in the work artifact** — that list is a story of its
own, and the next person should get it as a finding rather than re-deriving it.

## Do not repeat what the page already says

T-005-04 has just rewritten the `slack:` lines and they render on the same page. Tonkotsu is the
worked example from the story: its `slack:`, its `step.1:` and its opening paragraph all said the
same thing about the emulsion, in three lengths. Once the row is short, check it against the
slack line beneath it — if they say the same thing, the row is the one that goes.

## Scope, exactly

- **`.cook` files only, and only the prose rows in them.** Not `>> slack:` (T-005-04, done), not
  the bodies of steps that have ingredients (T-005-06, next). This ticket runs in a chain with
  those two because all three edit the same files and a ticket commits whole files.
- Work off T-005-01's ranked report rather than re-deriving the list.
- If a sentence moves to a counter menu, `counters.json` is edited here — that is the destination
  T-005-03 built, and T-005-03 is finished before this starts.

## Acceptance Criteria

- Every prose row is at or under the T-005-01 cap. Report the before/after counts and means for
  headers and footers separately, by the same method the story used.
- Every sentence removed is accounted for: stayed, moved (naming the counter and section it went
  to), or dropped. A count of each in the work artifact, and the reasoning for a sample.
- No sentence is moved twice — T-005-03's four are checked first.
- No prose row repeats what the `slack:` line on the same page says. Name the recipes where this
  was found and which one you kept.
- Footers that are really unwritten cooking steps are listed in the work artifact, with the file
  and the verb. **None of them is promoted to a step** — the tree is unchanged.
- The merge tree is unchanged everywhere: same operations, same columns, same rowspans. Prove it
  rather than asserting it — the column-count distribution across all 658 recipes is identical
  before and after.
- `findTilingErrors` still holds and `npm run verify` passes.
- `npm run verify:mobile` passes — these rows are full-width and T-004 measured them.
- Only `.cook` prose rows and `src/data/counters.json` are modified. No component, no other
  metadata line, no step body.
