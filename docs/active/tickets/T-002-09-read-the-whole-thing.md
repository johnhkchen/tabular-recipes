---
id: T-002-09
story: S-002
title: read-the-whole-thing
type: task
status: open
priority: high
phase: ready
depends_on: [T-002-08]
---

## Context

Eight tickets have each seen their own corner. This one reads the result as one collection and
fixes what no single ticket could see, then verifies the whole thing.

This is the ticket that may edit files other tickets wrote. Nothing is running in parallel with
it.

### What to look for

**The variant pairs actually pair.** Every file with `kit: Instant Pot` should name a `dish:`
that resolves, and both pages should offer the switch. `parse-recipes.mjs` throws if two files
share a dish and neither names a kit, so a clean build proves half of it; the other half is
opening a few pages and seeing the link.

**The clock tells the truth about pressure.** T-002-01 taught `src/lib/time.ts` that pressure
cooking is walk-away time, before twenty recipes existed to test it against. Now they exist.
Check the timeline under a few Instant Pot recipes: a natural release must not read as hands-on,
and total hands-on time for a pressure recipe should be a fraction of its plain sibling's. If it
is not, the fix is in `time.ts` or in a timer name, not in the number.

**The same dish did not get written twice.** Six writers worked in parallel against ranked
lists that overlap. Two files for one dish under different names is the failure this ticket
exists to catch — check for near-duplicate titles and for `aka` values that collide.

**Pairings are mutual and real.** Bowls and salads lean on `pairs-with:` more than any recipes
so far, pointing at dressings and bases. Every slug must resolve.

**Counter counts.** Read the three new menu pages as menus. Does anything on them look like it
wandered in from another shelf?

### Then update the gap docs

`docs/gaps/bowl-shop.md`, `docs/gaps/instant-pot.md` and `docs/gaps/one-pot.md` were written
before any of this existed. Rewrite them to say what is *now* missing, in the same before/after
shape the fifteen older ones use, so the next pass starts where this one stopped rather than
re-deriving it.

## Acceptance Criteria

- `npm run verify` passes in full: check, parse, `npx vitest run`, and `astro build`.
- At least **20** recipes carry `kit: Instant Pot`, every one paired to a plain recipe that
  exists, and the variant switch renders on both pages of at least three pairs spot-checked in
  the work artifact.
- No two files describe the same dish under different names. The work artifact lists what was
  checked and any merges made.
- Every `pairs-with:` slug across the whole collection resolves.
- The clock under a pressure-cooker recipe reports its pressure and release time as unattended,
  demonstrated in the work artifact for at least three recipes with the numbers.
- The three new counter pages read as menus, and the work artifact says how many recipes each
  shelves and how many name it and no other counter.
- `docs/gaps/bowl-shop.md`, `docs/gaps/instant-pot.md` and `docs/gaps/one-pot.md` are rewritten
  against the shelf as it now is.
- Any file in the repo may be edited, but the work artifact names each one changed outside
  `recipes/` and `docs/` and says why.
