---
id: T-002-02
story: S-002
title: instant-pot-braises
type: task
status: done
priority: high
phase: done
depends_on: [T-002-01]
---

## Context

Write the pressure-cooker versions of the long meat braises. This is the half of the Instant
Pot shelf that people bought the pot for: `beef-stew` runs 3 hours on the shelf, `pot-roast`
4 hr 30, `birria-de-res` 4 hr 30, `carnitas` 4 hr, `oxtails` 3 hr 45, `beef-bourguignon` 4 hr.

**Your candidates are the dishes already in `recipes/stews-and-braises/`.** T-002-03 has the
beans, grains, stocks and soups; stay out of `recipes/rice-beans-and-grains/` and
`recipes/soups/`. `docs/gaps/instant-pot.md` ranks them.

Read **"The Instant Pot mechanism, exactly"** in `docs/active/stories/S-002-three-more-shelves.md`
before writing a line. The whole ticket is that mechanism applied ten times.

The shape of every file you write:

```
>> title: Beef Stew, Instant Pot
>> dish: beef-stew          ← the EXISTING slug, confirmed with ls
>> kit: Instant Pot
>> counters: Instant Pot
```

**Never edit the plain file.** Its `dish` already defaults to its own slug, so the pairing
happens without touching it. That is what lets six tickets run at once.

## The part that can hurt someone

A pressure-cooker time is not a braise time divided by three. There is no such conversion, and
inventing one produces undercooked pork with a confident number next to it.

Use the canonical time for that dish under pressure. If you cannot establish one for a dish,
skip it and say so in the work artifact — the list is longer than your target, so a skip costs
nothing. A dish where the pot genuinely does not help (a braise whose whole point is a
reduction, something that wants dry heat and a crust) is also a legitimate skip, and a more
useful one than a recipe that technically works.

Two things a pressure-cooker recipe has that a braise does not, and both are ingredients of the
method rather than decoration:

- **A minimum liquid.** The pot needs enough thin liquid to come to pressure. A braise that
  cooks in its own juices does not translate unchanged, and the amount you add is a real
  quantity in the table.
- **A release.** Natural release and quick release are different cooking, not different
  waiting — a natural release keeps cooking the meat, a quick release stops it. Say which, name
  the timer, and give natural release its real duration: `~natural release{15%min}`.

Browning still happens, in the same pot on sauté. It belongs in the table as its own operation,
the way it does in the plain version.

## Acceptance Criteria

- At least **10** new `.cook` files, each with `>> kit: Instant Pot` and a `>> dish:` naming a
  recipe that already exists — confirmed with `ls recipes/*/<dish-slug>.cook`, not assumed.
- Every one of them is a braise or stew whose plain version lives in
  `recipes/stews-and-braises/`. Nothing from `rice-beans-and-grains/` or `soups/`.
- The dishes at the top of `docs/gaps/instant-pot.md` are written, in that order, as far as
  the count reaches. Anything skipped is named in the work artifact with a reason.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file, and the printed label staircase reads as a cook's verbs.
- Every pressure time is the canonical time for that dish under pressure, and the work artifact
  says where each came from. **No time is derived from the plain recipe's duration.**
- Every timer is named, and the pressure and release timers read as unattended in the clock
  under the table.
- Every file carries `title`, `category`, `tags`, `servings`, `counters`, and `aka` where people
  say it another way.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
