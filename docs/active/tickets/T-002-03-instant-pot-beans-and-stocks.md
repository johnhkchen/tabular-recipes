---
id: T-002-03
story: S-002
title: instant-pot-beans-and-stocks
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-01]
---

## Context

Write the pressure-cooker versions of the beans, grains, stocks and long soups. This is the
half of the Instant Pot shelf that changes what a weeknight can contain: `chicken-broth` runs
**11 hr 30** on the shelf, `chintan-broth` 5 hr 30, `congee` 1 hr 45, `boston-baked-beans`,
`cuban-black-beans`, `ful-medames`, `gigantes-plaki`, `chana-masala` at 2 hr. Beans from dry
with no overnight soak is the single most useful thing the pot does, and nothing on this site
says so.

**Your candidates live in `recipes/rice-beans-and-grains/` and `recipes/soups/`.** T-002-02 has
the meat braises; stay out of `recipes/stews-and-braises/`. `docs/gaps/instant-pot.md` ranks
them.

Read **"The Instant Pot mechanism, exactly"** in `docs/active/stories/S-002-three-more-shelves.md`
before writing a line.

```
>> title: Cuban Black Beans, Instant Pot
>> dish: cuban-black-beans     ← the EXISTING slug, confirmed with ls
>> kit: Instant Pot
>> counters: Instant Pot
```

**Never edit the plain file.**

## The part that can hurt someone

A pressure time is not a simmer time divided by three, and beans are where a wrong number does
real damage: undercooked beans are inedible and, for kidney beans specifically, actually
unsafe. Use the canonical time for that bean, from dry, under pressure — they differ from each
other by a lot, and soaked and unsoaked are different numbers again. Say which you mean.

Where a dish's plain version soaks overnight, the pressure version's whole claim is that it does
not. Do not carry the soak over out of symmetry, and do not silently drop it either — if the
canonical method still wants a soak, keep it and name the timer.

Stocks are the other case worth care: two hours at pressure is not eleven hours of simmering
made faster, it is a different extraction that produces a different, cloudier stock. Write what
the pot actually gives you rather than claiming the plain recipe's result.

## Acceptance Criteria

- At least **10** new `.cook` files, each with `>> kit: Instant Pot` and a `>> dish:` naming a
  recipe that already exists — confirmed with `ls recipes/*/<dish-slug>.cook`, not assumed.
- Every one of them has its plain version in `recipes/rice-beans-and-grains/` or
  `recipes/soups/`. Nothing from `stews-and-braises/`.
- At least **four** are beans from dry, and at least **one** is a stock or broth.
- The dishes at the top of `docs/gaps/instant-pot.md` are written, in that order, as far as
  the count reaches. Anything skipped is named in the work artifact with a reason.
- `node scripts/check-recipes.mjs --labels recipes/*/<each new slug>.cook` reports ok for every
  new file.
- Every pressure time is the canonical time for that ingredient under pressure, soaked or
  unsoaked as stated, and the work artifact says where each came from. **No time is derived
  from the plain recipe's duration.**
- Every timer is named, and the pressure and release timers read as unattended.
- Every file carries `title`, `category`, `tags`, `servings`, `counters`, and `aka` where people
  say it another way.
- Only `recipes/**` is modified, and no file that existed before this ticket is edited.
