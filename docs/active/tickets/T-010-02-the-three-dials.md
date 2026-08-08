---
id: T-010-02
story: S-010
title: the-three-dials
type: task
status: done
priority: high
phase: done
depends_on: [T-010-01]
---

## Context

Build the controls. **This is the first genuinely interactive thing on the site** — everything
before it is a text box and a set of links — so it sets the pattern for whatever comes after.

**You own `src/pages/index.astro` and the styles it needs.** T-010-01 put the numbers in the
search index; read its work artifact for the confidence shape and the five worked pairs before
you design against them.

### 1. Three dials, no score

- **Time you're standing there** — the primary one, and the one that should be easiest to reach.
- **On the table by** — a cap, not a target.
- **Things to wash** — from S-008's property.

**Do not build a difficulty rating**, and do not combine the three into one number. S-010 argues
this at length and it is the same discipline as `slack` carrying a reason rather than a level
alone. Somebody who can stand at a pan for forty minutes but has no clean bowls is not served by
an average.

**The labels are the design.** `docs/knowledge/voice.md` governs them: words a tired person reads
at a glance and would say out loud. *Time you're standing there.* Not *active time*, not
*hands-on effort*, not *difficulty*. If a shorter phrase says it better, use it — but it stays a
plain description of what is being measured.

Whether the fourth number — the longest unbroken stretch — is its own dial or a qualifier on the
first is a judgement. **Argue it.** The case for its own dial is that it is the actual complaint
this story came from; the case against is that four dials is more than a tired person will turn.
A defensible answer either way; an unargued one is not.

`slack` sits on 395 of 658 files and is a candidate fourth. Same judgement, same requirement to
argue it, and the same warning: every dial added makes every other dial less likely to be used.

### 2. Three answers, not two

**Passes, fails, and cannot say.** The third is the one that matters and it is where this gets
built wrong.

An under-annotated recipe collects hands-on minutes nobody claimed, and a recipe with no timers
reads as no time at all. Filter naively for *under fifteen minutes standing* and the recipes with
the least evidence sort to the top.

So a recipe the data cannot answer for is **shown, and shown as unanswered** — below the ones
that pass, marked, in a way a reader understands without a legend. Not silently included. Not
silently dropped. *"We don't know how long you'd be standing there for these"* is an honest thing
for a page to say and this is the page to say it on.

### 3. Where it lives, and how it comes back

The front page already has search, and results replace the counter row rather than going to a
separate page. **The dials belong in the same place**, working with search rather than beside it:
a query and a set of dials narrow the same list.

**Put the state in the URL.** The whole use case is a person who wants this again next Tuesday —
a link they can bookmark is the difference between a feature and a feature they remember exists.
It also means the state survives a reload and can be shared.

Decide what happens with dials set and no query: does the page show every recipe that passes, or
stay on the counter row until asked? **Showing them is probably right** — *what can I cook
tonight* is a real question with no search term in it — but it changes the front page's shape, so
argue it and check the result still reads as a front door rather than a database.

### 4. A tired person is holding a phone

S-004 put this site on a phone and left `npm run verify:mobile` behind to keep it there:
`scripts/check-overflow.mjs` at 375, 390 and 768, and `scripts/check-touch.mjs` for target sizes.

The dials pass both. That is not a nice-to-have on this feature — the entire scenario is somebody
who has just got home, and they are not at a desk.

Keyboard and screen reader too. The search box already carries a `visually-hidden` label and an
`aria-live` tally; match that standard rather than inventing a new one, and make sure the live
region announces the filtered count without shouting on every keystroke.

### 5. The kit

`b28-clay.css` is the shared kit and the front page already uses `clay-well` and `clay-surface`.
**Use its primitives rather than inventing controls** — what looks pressable is pressable, and a
dial is the most pressable thing on the page. No new palette.

## Acceptance Criteria

- Three dials on the front page, working together and with the search box: a query plus dials
  narrows one list.
- No composite score, no difficulty rating, anywhere in the UI or the data behind it.
- **A recipe the data cannot answer for is shown and marked as unanswered**, never silently
  included in a pass and never silently dropped. Show all three states in one screenshot.
- The labels are plain-language descriptions of what is measured, and the work artifact says
  which alternatives were rejected and why.
- The longest-unbroken-stretch decision — own dial or qualifier — is argued, and so is any fourth
  dial.
- Filter state is in the URL, survives a reload, and a pasted link reproduces the same list.
- With dials set and no query, the page does something deliberate, argued in the work artifact,
  and still reads as a front door.
- `npm run verify:mobile` passes: no overflow at 375, 390 or 768, and every control meets the
  touch-target check.
- The tally's `aria-live` region announces the filtered count, and the dials are operable by
  keyboard alone. Say how it was tested.
- Built with `b28-clay.css` primitives. No new colours.
- The counter row, the search behaviour and every recipe page are unchanged when no dial is set.
- `npm run verify` passes.
- Only `src/pages/index.astro`, `src/styles/**`, any new component under `src/components/`, tests
  and `docs/active/work/T-010-02/**` are modified. **No `.cook` file, and not
  `src/pages/search.json.ts`** — T-010-01 owns that.
