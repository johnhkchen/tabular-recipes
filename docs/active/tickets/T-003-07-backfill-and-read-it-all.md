---
id: T-003-07
story: S-003
title: backfill-and-read-it-all
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-09, T-003-06]
---

## Context

The last ticket of two stories. Everything is written and shelved; this reads the result as one
collection, backfills the slack property where it decides something, and verifies.

Nothing runs in parallel with this. It may edit files other tickets wrote.

### 1. Backfill slack where it decides something

T-003-02 built the property and annotated eight worked examples. Three writer tickets carried
it on every new file. **514 recipes predate it**, and this ticket does not annotate all of
them — that is a judgement per file and a pass of its own.

Annotate where the answer changes what a cook does:

- **Anything with a window that closes.** Custards, caramel, emulsions, bread doughs, anything
  that goes from right to wrong in minutes and does not come back. These are the ones where the
  property earns its place, and a cook meeting them unwarned is the failure it exists to
  prevent.
- **Anything dangerous when wrong.** Undercooked beans, undercooked pork, canning and pickling,
  a custard held warm. Where the failure is a safety failure, say that plainly.
- **The long cooks**, where the honest answer is usually "an extra hour changes little" — and
  saying so is what makes the walk-away shelves trustworthy.

Leave the rest undeclared. **An honest gap is better than a filled field**, and the render was
built to look deliberate when the line is missing. Say in the work artifact how many you
annotated, how you chose, and roughly how many remain — the next pass starts from that number.

### 2. Read the whole collection

**The three-way kit choice works.** A dish with a plain, an Instant Pot and a Slow Cooker file
should show all three on every one of those pages. Spot-check at least three such dishes and
put the numbers in the work artifact — total time and hands-on time for each of the three — so
the choice is visibly a choice.

**The clock tells the truth about the new bargains.** A three-hour soup with ten minutes of
hands-on, an eight-hour slow cooker with fifteen. If any new recipe reports most of its
duration as hands-on, the fix is a timer name or `src/lib/time.ts`, never the number.

**Nothing got written twice.** Five writer tickets ran in parallel across two stories against
overlapping lists. Two files for one dish under different names is the failure this ticket
exists to catch — check near-duplicate titles and colliding `aka` values across the whole
collection, not just the new files.

**Pairings resolve.** Everything in `pairs-with:` points at something real.

**The counters read as shelves.** Twenty-one of them now, in one list on the front page. Open
it. If that list has stopped being usable at twenty-one, say so in the work artifact with what
you would do about it — it is not this ticket's job to redesign the front page, but it is this
ticket's job to be the one that noticed.

### 3. Update the gap docs

Rewrite `docs/gaps/soup-pot.md`, `docs/gaps/japanese-home.md` and `docs/gaps/slow-cooker.md`
against the shelf as it now is, in the before/after shape the older ones use.

## Acceptance Criteria

- `npm run verify` passes in full.
- Every recipe with a window that closes, and every recipe whose failure is a safety failure,
  declares its slack with a reason that names the real failure. The work artifact says how many
  were annotated, how they were chosen, and how many recipes remain undeclared.
- At least three dishes exist in all three forms — plain, Instant Pot, Slow Cooker — and the
  work artifact gives total and hands-on time for each of the nine files.
- No two files describe the same dish under different names, across the whole collection. The
  work artifact lists what was checked and any merges made.
- Every `pairs-with:` slug in the collection resolves.
- No new recipe reports the bulk of its duration as hands-on.
- The three new gap docs are rewritten against the current shelf.
- The work artifact records the front-page verdict at 21 counters.
- Any file may be edited; the work artifact names each one changed outside `recipes/` and
  `docs/` and says why.
