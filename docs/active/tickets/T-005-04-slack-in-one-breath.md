---
id: T-005-04
story: S-005
title: slack-in-one-breath
type: task
status: done
priority: high
phase: done
depends_on: [T-005-01]
---

## Context

`>> slack:` is the newest field on the site and the worst offender in the collection.

**333 of the 397 declared slack lines are over 200 characters. Not one is under 100.**

It renders under the timeline as `**unforgiving** — <reason>`, one paragraph, on every page that
declares it. Here is a real one, at 306 characters, as a reader meets it:

> **unforgiving** — the brine is 5% because that is the strength that carries three weeks
> without the cucumbers going soft, and a weak brine or a warm room gives mush and off smells
> rather than sour pickles; skim the white film and keep everything under the surface, because
> what sits in the air is what spoils

That is three separate warnings welded together with semicolons: the brine strength, the room
temperature, and the surface film. Each is worth knowing. Together, at that length, none of them
lands.

## What must not be lost

**The value is in the reason, not the rating.** That was the point of the field and it still is.
`unforgiving` on its own tells a cook nothing they can act on — the whole job is naming the
specific failure. So this is not "cut the reason to fit"; it is **say the one thing that will
actually go wrong.**

The good ones already exist in the collection and they are the short ones:

> **narrow** — cod is done as the flakes part, and a minute past that it dries out and shreds
> into the rice

103 characters. One failure, named, with the moment it happens. That is the target shape, and it
came out of the same collection as the 306-character one.

## The pattern to cut against

Read a long one and it is almost always the same three parts:

1. **Why the number is the number** — *"the brine is 5% because that is the strength that
   carries three weeks"*. This is the recipe justifying itself. It is the voice this whole story
   is removing. Cut it.
2. **The failure, named** — *"a weak brine gives mush and off smells"*. Keep this. It is the
   field.
3. **A second and third failure, semicolon-chained.** Keep the one with no give. A cook who
   remembers one thing about these pickles should remember the right one — and a line naming
   three things is a line naming none.

Where a dropped warning is genuinely load-bearing and belongs somewhere else — an ingredient
note, a step label — move it and say so. Where it is a real safety fact, it does not get dropped
to make a cap; say in the work artifact which lines those were and how you handled them. There
are chicken temperature and terrine temperature lines in here.

## Scope, exactly

- **397 files.** Every recipe that declares `>> slack:`. Work off the ranked report T-005-01
  saved into its work directory rather than re-deriving the list.
- **The 261 recipes with no slack line stay that way.** Backfilling the rest of the collection is
  not this story's work and would add words, not remove them. Leave them undeclared.
- **Only the `>> slack:` line is edited in each file.** Not the prose rows, not the step bodies —
  T-005-05 and T-005-06 own those, and they run after this ticket precisely so two agents do not
  commit the same file.

## Hazards

- `src/lib/slack.ts` already rejects a level with no reason (`slack.ts:86`) and normalises the
  separator. It does not need changing — the cap is T-005-01's, in the checker. If you find
  yourself editing `slack.ts`, stop and say why.
- The three levels — `forgiving` / `narrow` / `unforgiving` — are not being re-litigated. If
  shortening a reason makes its level look wrong, that is a finding worth recording, not a
  licence to re-rate the collection.
- `slack.test.ts` has fixtures with reasons in them. Keep it passing; if a fixture is now longer
  than the cap the checker enforces, fix the fixture.

## Acceptance Criteria

- Every declared `>> slack:` line is at or under the T-005-01 cap. Report the before/after
  distribution — count over 200, mean, max — by the same method the story used.
- Every line still names a specific failure and when it happens. A line reduced to a restatement
  of its own level has failed; spot-check a random twenty in the work artifact by quoting them.
- Every dropped warning that was load-bearing is either relocated — naming the file and the field
  it went to — or listed in the work artifact as deliberately dropped, with why.
- Safety facts (internal temperatures, cure times, anything where the failure is illness rather
  than texture) survive in some form. The work artifact lists which recipes those were.
- No level is changed. If shortening exposed a wrong rating, it is recorded, not fixed.
- The 261 recipes with no slack line still have none.
- `slack.test.ts` passes and `npm run verify` passes.
- Only the `>> slack:` line inside `.cook` files is modified, plus `slack.test.ts` if a fixture
  needs it. No component, no `slack.ts`, no other metadata line, no step body.
