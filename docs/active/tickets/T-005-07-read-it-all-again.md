---
id: T-005-07
story: S-005
title: read-it-all-again
type: task
status: done
priority: high
phase: done
depends_on: [T-005-02, T-005-06]
---

## Context

Six tickets each cut their own field. This one reads whole pages, catches what no single ticket
could see, and closes the gate behind them.

Nothing runs beside it. It may edit any file.

### 1. Close the gate

T-005-01 landed the caps **reporting, not failing**, because a failing check would have blocked
the very tickets that bring the collection under it. Its work artifact names the exact line to
change. Change it.

If anything is still over cap, that is the honest outcome of a partial pass — T-005-06 was
allowed to stop at a category boundary. Fix what remains, or raise the cap with the measurement
that justifies it. **Do not** exempt files to make the check green.

### 2. Read pages, not fields

Every ticket verified its own field in isolation. Nobody has read a finished page. At each of
these, read the whole thing top to bottom and say whether a cook is being talked to:

- `ching-bo-leung-soup` and `dried-bok-choy-pork-lung-soup` — the two wordiest pages when this
  started, 6223 and 6126 visible characters
- `boston-baked-beans-slow-cooker` — the 757-character headnote
- `tonkotsu-broth-instant-pot` — the worked example: one fact in three lengths, in three fields
- `fresh-egg-pasta` — the 596-character footer that is really a cooking step
- `grilled-cheese` or `egg-cream` — a page that was already short, to confirm nothing was taken
  from a recipe that had nothing spare
- The counter menus that received moved sentences — The Slow Cooker first

### 3. The measurement

The story's numbers came from stripping tags out of the built HTML with the collapsed source
block excluded. Use the same method so the numbers compare, and report:

- visible characters per recipe page — mean, median, max — against **mean 3487 / median 3379 /
  max 6223** at the start
- the new wordiest ten, against a start list that was almost entirely the Chinese soup shelf
- the six chrome sentences, against **577 / 531 / 307 / 144 / 97 / 15** pages
- slack lines over 200 characters, against **333 of 397**
- prose rows over 120 characters, against **126 headers and 106 footers**
- discarded step-body characters, against **228,000**

### 4. What must not have happened

Four things this story could have broken while making pages shorter. Check each:

- **The merge tree is unchanged.** Same operations, same columns, same rowspans, across all 658.
  T-005-05 proved it once; prove it again after T-005-06.
- **No ingredient or timer was lost.** T-005-06 cut sentences that contained markup. Diff
  `src/generated/recipes.json` against the state before the story began.
- **No safety fact was cut to fit a cap.** T-005-04 listed the internal temperatures and cure
  times it touched. Read that list and confirm each one still says what it needs to.
- **Nothing moved twice, and nothing moved and stayed.** T-005-03 moved four sentences and
  T-005-05 moved the rest. Confirm no sentence is now on both a menu and a recipe.

### 5. What is still wrong

Write `docs/gaps/voice.md`, ranked, in the shape of `docs/gaps/mobile.md`. Three findings are
already known and should start it rather than be rediscovered:

- **Footers that are really unwritten cooking steps** — T-005-05's list. Promoting them changes
  the merge tree, which is why nobody did it.
- **Bodies that would now make good labels on their own** — T-005-06's list, and with it the
  question of whether `>> step.N:` overrides are still earning their place.
- **`See how it is written` shows raw cooklang** — `@&(~1)scrubbed bones{}` on the page, to a
  reader who opened a disclosure expecting a recipe. No ticket owned it.

Say plainly what this story did not fix. The next pass should start from an honest list.

## Acceptance Criteria

- `npm run check` fails the build on an over-cap field. Nothing is exempted to achieve it; if a
  cap moved, the measurement that justifies it is in the work artifact.
- The pages listed above are read whole, with a verdict on each in the work artifact — including
  the already-short page, which should show that nothing was taken from a recipe with nothing
  spare.
- Every measurement in section 3 is reported against its starting figure, by the same method.
- The four regressions in section 4 are each checked and the result stated, not assumed.
- `docs/gaps/voice.md` exists and ranks what is still wrong, opening with the three known
  findings.
- `docs/knowledge/voice.md` matches what was actually built. Where a ticket decided something
  different from what T-005-01 wrote, the document is corrected and the change is noted.
- `npm run verify` and `npm run verify:mobile` both pass.
- Any file may be edited; the work artifact names each one changed and says why.
