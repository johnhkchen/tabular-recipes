---
id: T-014-01
story: S-014
title: read-the-whole-season
type: task
status: done
priority: critical
phase: done
depends_on: [T-008-05]
---

## Context

Read every work artifact from S-007 through S-013 as one thing, and produce the ranked list of
what they left behind.

**77 directories under `docs/active/work/`.** The ones this ticket owes a full read are
`T-007-*` through `T-013-*`; the earlier stories were consolidated by T-001-18, T-002-09 and
T-003-07, so skim those three for what they already recorded and do not re-derive it.

**You write findings. You fix nothing.** T-014-02 applies the mechanical ones; everything else
stays recorded. A ticket that starts fixing while it reads stops reading carefully.

### 1. What to collect

Every work artifact in this repo follows the same habit: it records what it found and chose not to
do, usually under its own heading, always with a reason. Collect all of it. The recurring shapes:

- **Explicit deferrals.** A ticket that said *"this is a finding, not a fix"* or *"recommendation
  for a later story"*. S-008's tickets alone are full of these by construction — T-008-03 was told
  to list every One Pot recipe washing three or more things and re-shelve nothing.
- **Numbers that came out worse than the story expected.** T-010-03's review reports that **143 of
  the 227 recipes the filter recommends for a tired evening are wrong for it**, and that the
  largest single cause is that it cannot tell dinner from a spice blend. That is a headline
  finding and it should not be buried in a rank.
- **Things a ticket was forbidden to touch.** File ownership kept several tickets from fixing what
  they found — T-007-05 could not edit a `.cook` file, so the borrow bug became T-007-06. Look for
  the same pattern elsewhere.
- **Recommendations one ticket made to another that never landed**, because the receiving ticket
  had already run.

### 2. Rank by cost and certainty, not by importance

The ranking is what makes the list usable, and the axis is **can this be fixed without an
argument.** Three bands, and put every finding in exactly one:

- **Mechanical.** A rename, a moved file, a corrected number, a stale sentence. Verifiable by a
  command. **This band is T-014-02's entire scope**, so be strict: if two reasonable people would
  disagree about the right answer, it is not mechanical.
- **Needs an argument.** Real, understood, and requires a decision somebody would want to make
  deliberately. Goes to `docs/gaps/README.md` for a later story.
- **Needs food.** The collection has to grow before the finding can be acted on. T-012-02's
  reading is the authority here — if it concluded that food must be written before features, say
  which findings that verdict covers.

### 3. Check the cross-cutting things no single ticket could see

The three previous consolidations each found something structural. Look for the same class:

- **Does the tag vocabulary still hold?** T-002-09 folded 24 concepts spelled two ways across 51
  files and recorded that **nothing enforces it**. Seven stories of new recipes have landed since.
  Re-run that count.
- **Do the new properties agree with each other?** `slack`, `washing-up`, `capacity` and `keeps`
  were each added by a different story. Check for a recipe whose `washing-up` contradicts its
  `capacity`, or whose `keeps` contradicts its shelf. A property that disagrees with another is
  invisible from inside either story.
- **Did any story's headline claim survive?** Each of S-007 to S-013 made one. Check each against
  the built site rather than against its own work artifact.

### 4. Where it goes

One new page under `docs/gaps/`, in the shape of the existing readings, plus the ranked additions
folded into `docs/gaps/README.md`'s own recorded-and-not-done list and its five-gaps ranking.

**Every finding names the ticket it came from.** A finding without its source is a rumour, and the
whole value of this page is that a reader can go back to the evidence.

## Acceptance Criteria

- Every `docs/active/work/T-007-*` through `T-013-*` directory is read, and the work artifact
  lists them with a one-line note on what each contributed — including *nothing new*, which is a
  legitimate and common answer.
- One new page under `docs/gaps/` holds the consolidated findings, each with **its source ticket**
  and its band.
- Every finding sits in exactly one of the three bands, and the mechanical band is defensible:
  for each, state the command that would verify the fix.
- The T-010-03 filter finding — 143 of 227 wrong for the evening — is carried at the top of the
  list rather than ranked among smaller items, with what it implies for S-010's dials.
- The tag-vocabulary count from T-002-09 is re-run and the new number stated against the old.
- Cross-property contradictions are checked and either listed by slug or reported as none found,
  with the check that was run.
- Each of the seven stories' headline claims is checked **against the built site**, and the work
  artifact says which held and which did not.
- `docs/gaps/README.md`'s recorded-and-not-done list and five-gaps ranking are updated, and any
  entry now closed is removed with a note saying which ticket closed it.
- **No fix of any kind is applied.** No `.cook` file, no `src/`, no `scripts/`, no
  `src/data/*.json`. Show it: `git status --porcelain` limited to those paths comes back empty.
- `npm run verify` passes.
- Only `docs/gaps/**` and `docs/active/work/T-014-01/**` are modified.
