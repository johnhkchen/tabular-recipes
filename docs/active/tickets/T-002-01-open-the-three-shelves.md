---
id: T-002-01
story: S-002
title: open-the-three-shelves
type: task
status: open
priority: critical
phase: implement
depends_on: []
---

## Context

Six writers are waiting on this ticket, and they cannot start without it for a mechanical
reason: **counter names are validated against `src/data/counters.json`** by both
`scripts/check-recipes.mjs` (line 23) and `scripts/parse-recipes.mjs`. Until the three counters
exist there, every `.cook` file a writer produces fails its check with `unknown counter`.

Three jobs, all of them prerequisites rather than content.

### 1. Open the counters

Add three entries to `src/data/counters.json`, matching the existing shape exactly
(`name`, `slug`, `blurb`, `categories`, `sections`). Read the fifteen that are there first —
the blurbs are written as an instruction to the visitor standing in front of the counter
("Take a tray and tongs, fill it, pay at the register"), not as a description of the cuisine.
Match that voice.

| Name | Slug |
| --- | --- |
| The Bowl Shop | `bowl-shop` |
| Instant Pot | `instant-pot` |
| One Pot | `one-pot` |

Give each its section titles now, in menu order, with **empty item lists**. T-002-08 fills the
items once the recipes exist. The titles below are the intent; improve the wording if a real
menu says it better, but keep the shape.

- **The Bowl Shop** — Grain bowls · Leafy salads · What goes on top · Roasted vegetables ·
  Dressings and drizzles · Soups · Also here
- **Instant Pot** — Braises that took all afternoon · Beans from dry · Stocks and broths ·
  Rice, grains and porridge · Whole birds and big cuts · Also here
- **One Pot** — Braises and stews · Skillet dinners · Rice and grains that cook in ·
  Soups that are the whole meal · Also here

### 2. Teach the clock that pressure cooking is waiting

`src/lib/time.ts` decides whether a timer is time a cook spends or time they wait out. It has
an `UNATTENDED` set, a `HANDS_ON` set, and a `NOT_A_VERB_IN_A_SENTENCE` set. Nothing in it
knows about a pressure cooker, so `~pressure cook{35%min}` currently reads as thirty-five
minutes of a cook's attention — for every recipe two whole tickets are about to write.

Add the vocabulary: pressure cook, natural release, quick release, come to pressure, and
whatever else the existing sets suggest by their own pattern. Read how `attentionOf` falls
through before adding anything; a previous pass found that naming a timer well made the answer
*worse* than leaving it blank, and the fix was the fall-through order rather than a bigger list.

`src/lib/collection.test.ts` has a test that no recipe claims four unbroken hours of a cook's
attention. It should still pass, and it is the thing that catches this class of error.

### 3. Write the three work lists

Write `docs/gaps/bowl-shop.md`, `docs/gaps/instant-pot.md` and `docs/gaps/one-pot.md`, in the
shape of the fifteen already in that folder. **Read two or three of those first** — they are the
format the writer tickets are told to work down, and they earn their length by being specific.

Each needs:

- **What is already here** that belongs on this shelf, grouped under the section it goes in,
  listed by slug. This is the largest part of the job for One Pot and the Bowl Shop, and it is
  what stops six writers from rewriting recipes that exist. `recipes/dressings-and-dips/`
  alone holds 41 files that belong to the Bowl Shop.
- **What is missing**, ranked, most conspicuous absence first, named the way a menu names it.
- **What a single table cannot hold**, with the reason.

Ground the lists in real menus, the way the first fifteen were. For the Bowl Shop, Goop Kitchen
(`goopkitchen.com/menu`) is the reference the brief names, and its menu is rendered by script —
you will need a search or a cached view rather than a plain fetch. Sweetgreen, Cava and Dig are
the same archetype and are worth reading for what the sections are actually called and how the
items are named. For Instant Pot, the ranked list is not a wish list: it is drawn from the ~60
long-cook recipes already on the shelf, ranked by how much the pot actually helps.

## Acceptance Criteria

- `src/data/counters.json` holds 18 counters. The three new ones carry a `name`, `slug`,
  `blurb` and ordered `sections` with empty item lists, and the file still parses.
- `node scripts/check-recipes.mjs` reports ok for the whole collection, unchanged — the
  three new counters must not disturb the 514 recipes already there.
- A `.cook` file naming `counters: The Bowl Shop`, `Instant Pot` or `One Pot` passes its check.
  Demonstrate this in the work artifact with one throwaway file, and do not commit the file.
- `src/lib/time.ts` classifies `~pressure cook{35%min}` and `~natural release{15%min}` as
  unattended, and `npx vitest run` passes.
- `docs/gaps/bowl-shop.md`, `docs/gaps/instant-pot.md` and `docs/gaps/one-pot.md` exist, each
  with a what-is-already-here section listing real slugs, a ranked missing list, and a
  what-a-table-cannot-hold section.
- The Instant Pot list names at least 25 candidate dishes that already exist as plain recipes,
  each with its existing slug, so the writers can spend their time cooking rather than searching.
- Only `src/data/counters.json`, `src/lib/time.ts` and `docs/gaps/**` are modified.
