---
id: T-003-05
story: S-003
title: the-slow-cooker
type: task
status: open
priority: high
phase: ready
depends_on: [T-003-01, T-003-02]
---

## Context

Write the slow-cooker half of the kit axis. S-002 built the mechanism and wrote the Instant Pot
side; this writes the same dishes under the opposite bargain — leave in the morning, eat in the
evening.

The point of this shelf only exists next to the others. A cook looking at `pot-roast` should be
able to see three ways to spend the day on it:

```
(plain)             4 hr 30, tended
kit: Instant Pot      50 min, unattended
kit: Slow Cooker       8 hr, unattended and gone
```

That is a choice about the shape of a day, not about a recipe, and no site shows it.

`docs/gaps/slow-cooker.md` ranks the candidates and says for each whether the machine helps
more or less than pressure does. Read it, and read `docs/gaps/instant-pot.md` beside it.

## The mechanism

Identical to the Instant Pot tickets. Read **"The Instant Pot mechanism, exactly"** in
`docs/active/stories/S-002-three-more-shelves.md`.

```
>> title: Pot Roast, Slow Cooker
>> dish: pot-roast            ← the EXISTING slug, confirmed with ls
>> kit: Slow Cooker
>> counters: The Slow Cooker
```

**Never edit the plain file, and never edit the Instant Pot file.** A dish may now have three
files sharing a `dish:`; that is fine, because only one of them has no `kit:`. The parser throws
only when *two* files claim to be the plain way.

T-002-02 and T-002-03 may still be writing Instant Pot variants while you work. Your filenames
end `-slow-cooker`, theirs end `-instant-pot`, so you cannot collide — but do not assume an
Instant Pot variant exists when you write your `dish:` line. Confirm the **plain** slug with
`ls`, which is the one that is definitely there.

## The part that can hurt someone

A slow-cooker time is not a braise time multiplied by two, any more than a pressure time is one
divided by three. Use the canonical time for that dish in a slow cooker, on the setting you
name — **low and high are different recipes**, not the same recipe at different speeds, and a
recipe that does not say which is unusable.

Three things a slow cooker does that a braise does not, and all three are method rather than
trivia:

- **Nothing evaporates.** A braise reduces; a slow cooker does not. Liquid quantities are not
  carried over unchanged, and a sauce that thickens on the stove has to be thickened
  deliberately here, at the end.
- **Browning still has to happen in a pan.** The machine cannot do it. Either the recipe says so
  as its own operation, or it is honestly a dish that does not need it — say which.
- **Dairy, herbs and seafood go in at the end.** Eight hours is not a longer version of forty
  minutes for anything delicate.

Where a dish genuinely does not survive the translation, skip it and say so in the work
artifact. A shelf of dishes the machine actually improves is worth more than a longer shelf
where a third of them are worse than the original.

## Acceptance Criteria

- At least **18** new `.cook` files, each with `>> kit: Slow Cooker` and a `>> dish:` naming a
  recipe that already exists — confirmed with `ls recipes/*/<dish-slug>.cook`, not assumed.
- At least **12** name a dish that also has an Instant Pot variant, so the three-way choice is
  visible on those pages.
- Every recipe names the setting (low or high) and its real time on that setting. The work
  artifact says where each came from. **No time is derived from the plain recipe's duration.**
- Every recipe that needs browning says so as its own operation, or says why it does not.
- Every recipe declares its slack per T-003-02. This shelf is where the property earns itself:
  most of these are wide, and the exceptions are worth naming.
- Every timer is named, and the long unattended stretch reads as unattended in the clock.
- Anything skipped is named in the work artifact with a reason.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
