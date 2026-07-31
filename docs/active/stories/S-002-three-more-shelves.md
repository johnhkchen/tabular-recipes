---
id: S-002
title: three-more-shelves
type: story
status: open
priority: high
---

## Why

Fifteen counters answer one question: *where would I buy this if I couldn't make it at home.*
That question has carried the site a long way, and it does not cover everything a cook reaches
for. Three shelves are missing, and only one of them is a place.

**The Bowl Shop is a place**, and the collection is oddly shaped without it. There are **41
dressings and dips** on the shelf — vinaigrette, green goddess, miso ginger, tahini, goma-dare,
toum — and **ten salads**, nearly all of them the deli-case kind you buy by the pound: chicken
salad, potato salad, macaroni salad. Almost nothing to spoon those forty-one dressings onto. The
fast-casual bowl shop is now one of the most legible menus in an American city, and this site
cannot draw one.

**Instant Pot is not a place, it is a piece of kit** — and the machinery for that has been
built and never used. `>> dish:` says what two files have in common; `>> kit:` says what makes
one of them different; `src/pages/[slug].astro` already renders the switch between them as
"the plain way." **Zero recipes declare a kit.** Meanwhile there are roughly sixty braises,
stews, stocks and bean pots on the shelf that run three to twelve hours, every one of them a
dish people own a pressure cooker in order to cook. Someone who ate carnitas and owns an
Instant Pot has no way in, and the file that would let them in is one line of metadata.

**One Pot is neither** — it is a constraint on the cooking, and it is the one people actually
shop by on a Tuesday. Ten recipes already carry a `one-pot` tag, which nothing renders.

## Shape of the work

Nine tickets: one to open the shelves, six to fill them, one to shelve the result, one to read
the whole thing afterwards.

- **T-002-01** opens the three counters in `src/data/counters.json`, teaches
  `src/lib/time.ts` that pressure cooking is walk-away time, and writes the three ranked work
  lists in `docs/gaps/`. **Everything depends on it**, for a reason worth stating plainly:
  counter names are validated against `counters.json` by both `scripts/check-recipes.mjs` and
  `scripts/parse-recipes.mjs`, so until the counters exist, every file a writer produces fails
  its check.
- **T-002-02 … T-002-07** fill the shelves, running in parallel. Each writes `.cook` files
  only, into whichever `recipes/<category>/` folder the dish belongs in. Distinct new files in
  a shared folder do not collide; **no writer may touch a file another ticket owns**, and no
  writer touches `src/`.
- **T-002-08** shelves everything: the menu sections in `counters.json` and any new ingredient
  that falls through `src/data/aisles.json`.
- **T-002-09** reads the collection for what no single ticket can see, and runs the full
  verification.

## The three shelves

| Counter | Slug | What it is |
| --- | --- | --- |
| **The Bowl Shop** | `bowl-shop` | A real counter. Grain bowls, leafy salads, things to put on top. |
| **Instant Pot** | `instant-pot` | A kit shelf. Every recipe is a variant of a dish already here. |
| **One Pot** | `one-pot` | A constraint. Mostly existing recipes, shelved for the first time. |

## Two rules that are not negotiable

**Never fabricate a number.** This governs the whole repo and it has a specific, dangerous form
in this story: **a pressure-cooker time is not a braise time divided by three.** There is no
conversion. Beans from dry take the time beans from dry take under pressure; a stock takes two
hours; a beef stew takes about thirty-five minutes at pressure and then a natural release that
is itself fifteen minutes of doing nothing. Use the canonical time for that dish under
pressure, from the way the dish is actually cooked. If you cannot establish one, write a
different recipe. A wrong pressure time is not a typo — it is undercooked pork.

**A dish that exists is not rewritten.** The Bowl Shop does not need its own chicken salad;
there is one. One Pot does not need its own beef stew; there is one. Where a counter should
carry a recipe that already exists, that is a shelving job — `counters.json` sections list
slugs, and a section may list a recipe that never names the counter. Record it for T-002-08
rather than writing a second file. **This is how Panadería's page worked before it had a menu
of its own, and it is why nine tickets can run without colliding.**

## The Instant Pot mechanism, exactly

A variant is two files that share a `dish:` and differ by `kit:`.

```
recipes/stews-and-braises/beef-stew.cook            (exists, unchanged)
  >> title: Beef Stew
  # no >> dish: line, so its dish defaults to its slug: beef-stew
  # no >> kit: line, so it is the plain way

recipes/stews-and-braises/beef-stew-instant-pot.cook   (new)
  >> title: Beef Stew, Instant Pot
  >> dish: beef-stew
  >> kit: Instant Pot
  >> counters: Instant Pot
```

Both pages then offer the switch, and **the existing file is never edited** — which is what
makes six writers safe in parallel.

Three ways to get this wrong:

1. **Two files with no `kit:` sharing a `dish:`** makes `parse-recipes.mjs` throw and the build
   stops. Only ever add the kit file.
2. **A `dish:` that names nothing on the shelf** silently produces a lonely variant. Confirm
   with `ls recipes/*/<dish-slug>.cook` before writing the line.
3. **A pressure-cooker recipe with no plain counterpart** is fine, but then it has no `dish:`
   line at all — it is simply a recipe that happens to use the pot. Do not invent a traditional
   version you have not written.

## Conventions every ticket follows

`README.md` is the authoring contract. The parts that fail a build if broken:

- One table per recipe, a merge tree, edges written as `@&(~1)thing{}`. Exactly one
  unreferenced ending. No splits. Prep steps at the top only.
- 5 to 16 ingredient rows, 3 to 6 operations. Rows are cheap; operations add columns and
  columns break a phone.
- Required metadata: `title`, `category`, `tags`, `servings`, `counters`. Then `aka:` (what
  people call it when they order it, including without diacritics) and `pairs-with:` (slugs,
  verified to exist).
- **Name every timer.** `~pressure cook{35%min}`, `~natural release{15%min}`, `~rest{10%min}`.
  The name is what separates time a cook spends from time they merely wait out. Under pressure
  this matters more than anywhere else on the site: the whole reason to own the pot is that the
  time is walk-away, and an unnamed timer reports it as time spent standing there.

Check any file with `node scripts/check-recipes.mjs --labels <paths>`. It writes nothing, so
any number of tickets can run it at once.

## Done when

- All three counters read as shelves somebody could browse: no section a board prints is empty
  while its ranked list still names something for it.
- At least twenty recipes declare `kit: Instant Pot`, each one paired to a dish already on the
  shelf, and both pages offer the switch.
- `npm run verify` passes: every recipe draws a table, every counter name resolves, every
  pairing points at something real, and the tests are green.
- `docs/gaps/` says what is still missing on the three new shelves, so the next pass starts
  where this one stopped.
