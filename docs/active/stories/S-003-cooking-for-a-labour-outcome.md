---
id: S-003
title: cooking-for-a-labour-outcome
type: story
status: open
priority: high
---

## Why

The fifteen counters answer one question — *where would I buy this if I couldn't make it at
home.* It is a good question and it built the site. It is not the question most people are
actually asking on a Tuesday.

**They are asking for a labour outcome, not a dish.** A cap on how hard it is, a cap on how
much of it they have to stand there for, and a cap on the chance it comes out badly. The dish
is downstream of that. Somebody who wants dinner without standing over it does not search for
*nikujaga*; they search for the shape of the evening they want, and the dish is whatever
answers.

The food that answers best is the food nobody wrote down. Restaurant dishes are documented to
death because a restaurant is a public thing with a menu. Domestic cooking that a whole
super-region quietly figured out — the arrangement that produces a real dinner on a weeknight,
for decades, without heroics — is transmitted by watching a grandmother and almost never
written properly in English.

Three shelves, chosen because each is a different bargain and each is under-documented:

| Counter | Slug | The bargain |
| --- | --- | --- |
| **The Soup Pot** | `soup-pot` | Put it on, walk away for three hours, and it improves. |
| **Japanese Home Cooking** | `japanese-home` | Small repeatable parts that assemble into a real meal. |
| **The Slow Cooker** | `slow-cooker` | Leave in the morning, eat in the evening. |

And one property, which is the third cap made visible: **how much slack a recipe gives you.**

## What is missing, concretely

**The Soup Pot.** Thirty-three soups on the shelf and not one Cantonese 老火湯. The whole genre
— a pot of water, a piece of meat, a handful of dried things, three hours, no stirring — is
absent, and it is the single best fit for this site's clock that exists. The logic these soups
carry, *what each ingredient is for*, has no home anywhere in the collection.

**Japanese Home Cooking.** The site has Japanese food and it is all restaurant food, arrived
via the Ramen Shop: `karaage`, `gyoza`, `okonomiyaki`, `chawanmushi`, four ramens, three tares.
The home canon is missing entirely — no nikujaga, no shōgayaki, no oyakodon, no tamagoyaki, no
kinpira, no ohitashi, no nimono. 一汁三菜 (one soup, three sides) is a *system* for getting a
balanced dinner out of a small kitchen on a weeknight, most of its parts made ahead, and it is
exactly the thing this story is about.

**The Slow Cooker.** The other half of the kit axis. S-002 establishes the mechanism and writes
the Instant Pot side; this writes the same dishes under the opposite bargain. A cook choosing
between four hours tended, fifty minutes under pressure, and eight hours unattended is choosing
a shape of day, and the site should be able to show all three of the same dish.

## The bargain has to be visible

A shelf that promises "walk away" and then hands someone a recipe with a narrow window has lied
to them, and there is currently no way for a recipe to say which it is.

So: **every recipe gets to declare how much slack it gives you**, and what happens if you miss.
Not a shelf, not a tag — a property, rendered next to the clock under the table. The clock
already says how long and how much of it is hands-on. This says what happens if you are late.

The value is entirely in the reason, not the rating. "Forgiving" alone is a vibe. *"An extra
hour in the pot changes little"* is a fact a cook can plan around, and so is *"the custard
breaks if it goes past 82°C, and it will not come back."* **A recipe that cannot name its real
failure has not earned a rating** — leave it off rather than writing filler.

T-003-02 builds this before any writer starts, so the three new shelves are authored with it
from the first file.

## Scope, stated plainly

This pass adds the property, requires it on every new recipe, and backfills it where it decides
something — the long cooks, the baking, anything with a window. **It does not backfill all 514
existing recipes**; that is a judgement per file and roughly four more tickets. The render omits
the line when a recipe does not declare one, so a partial collection looks deliberate rather
than broken. Call for the full sweep as its own pass.

## Shape of the work

- **T-003-01** opens the three counters and writes their work lists. It depends on **T-002-01**,
  which owns `src/data/counters.json` and is running now — two tickets must not hold that file
  at once.
- **T-003-02** builds the slack property: metadata, parse, render, tests. Depends on nothing and
  should start immediately, because every writer needs it.
- **T-003-03 … T-003-05** fill the three shelves in parallel. `.cook` files only.
- **T-003-06** shelves the result. It owns `counters.json` and `aisles.json`, so it waits for
  **T-002-08** as well as its own writers.
- **T-003-07** backfills slack where it matters, reads the whole collection, and verifies.

## Conventions

Everything in `README.md` and in `docs/active/stories/S-002-three-more-shelves.md` still holds:
one table per recipe, a merge tree, 5–16 ingredient rows, 3–6 operations, every timer named,
`aka` carrying what people actually say. **Never fabricate a number** — and for these shelves
that lands hardest on the slow cooker, where a time is not a braise time multiplied by two.

**A dish that exists is not rewritten.** `dashi` and `miso-soup` are on the shelf and the
Japanese ticket needs both — those are shelving jobs for T-003-06, not writing jobs.
