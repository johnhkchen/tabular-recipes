---
id: T-007-06
story: S-007
title: the-borrow-that-never-worked
type: task
status: done
priority: high
phase: done
depends_on: [T-007-05]
---

## Context

**`src/data/counters.json` lists nine recipes the site does not print, and nothing says so.**

T-007-05 hit this and stopped, correctly — it may not edit a `.cook` file, so it could only report
it. The report is right and the cause is older than that ticket.

`src/lib/counters.ts:74`:

```ts
const mine = all.filter((r) => r.counters.includes(counter.name));
const bySlug = new Map(mine.map((r) => [r.slug, r]));
```

Section slugs are then resolved through `bySlug` and `.filter(Boolean)`. **A listed slug whose
recipe does not name the counter is dropped on the floor**, with no warning, no build failure and
no difference in the page.

Meanwhile `src/data/counters.json`'s own header comment and `docs/knowledge/counters.md` both
document the opposite. T-003-06 was instructed in as many words that *"a section may list a recipe
that never names the counter — that is how a shelf borrows."*

**It has never worked.** Every shelf that appeared to borrow succeeded only because somebody also
edited the recipe's `>> counters:` line.

### The nine

| Counter | Dropped |
| --- | --- |
| One Pot | `general-tsos-chicken` · `orange-chicken` · `sesame-chicken` · `sweet-and-sour-pork` |
| Cha Chaan Teng | `pineapple-bun` · `egg-custard-tart` · `beef-chow-fun` · `char-siu` · `club-sandwich` |

**The One Pot four are the interesting half, and read them before deciding anything.**
`docs/gaps/one-pot.md` threw all four off that shelf deliberately — *"one wok on paper and four
things to wash in a kitchen… They sit at the Takeout Counter, which is where all four already
were."* The recipes were updated; **`counters.json` never was**, and the silent drop has been
producing the correct page from incorrect data for two stories.

That is the real damage here. A bug that yields the right answer is the one nobody finds.

### 1. Decide what a borrow is

Two coherent answers. **Pick one and argue it; do not implement both.**

**Borrowing works.** `menuFor` resolves listed slugs against `all` rather than `mine`, and `count`
counts them. Matches every word of the documentation and makes a shelf's section list the single
source of truth for what is on it.

**Borrowing is not a thing.** A listed slug that does not claim its counter **fails the build**,
and shelf membership always lives in the `.cook` file. Matches how all twenty-two shelves were
actually built, and keeps one fact in one place.

**The trap in the first option**, and it decides the ticket: making borrowing work **silently puts
those four deep-fried wok recipes back on One Pot**, which is the exact placement `one-pot.md`
argued against at length. Choosing it means cleaning `counters.json` first, in the same change, or
the fix ships a regression.

Whichever wins, **the silent drop ends.** That part is not a judgement.

### 2. Make the data honest

- If borrowing works: remove the four stale One Pot entries, because they are wrong data that was
  being covered for.
- If it does not: the five Cha Chaan Teng borrows get a `>> counters: Cha Chaan Teng` on their own
  `.cook` files, which is what T-007-05 would have done had it been allowed.

**Either way T-007-05's criterion has to end up true on the built site** — Cha Chaan Teng shelves
at least 20 recipes including at least four written before S-007. Today it prints 22 and **none of
them predates the story**, which is the half of that criterion nobody noticed was failing.

### 3. Make it impossible to reintroduce

`scripts/menu-sections.mjs` rebuilds `sections` from the gap pages and must survive whichever
answer wins. And a check has to exist: **every slug in every section resolves to a recipe that the
built site actually prints under that heading.** Nine slugs went missing for two stories because
nothing compared the list to the page.

Run it over all twenty-two counters and report the count. Nine is what today's data says; if the
real number is higher, that is the finding.

## Acceptance Criteria

- The decision is made and argued in the work artifact, naming which of the two answers won and
  what it costs.
- **No slug in `src/data/counters.json` is silently dropped.** Every one either renders on its
  counter's page or fails a check by name.
- The four stale One Pot entries are resolved in line with the decision, and **`general-tsos-chicken`,
  `orange-chicken`, `sesame-chicken` and `sweet-and-sour-pork` do not reappear on One Pot** —
  `docs/gaps/one-pot.md` argued them off and this ticket does not overturn that by accident.
- Cha Chaan Teng prints at least 20 recipes **including at least four written before S-007**, named
  in the work artifact. Show the built page.
- A check exists that compares every section's slug list against what the built site prints, it
  runs in `npm run verify`, and its output over all twenty-two counters is pasted in.
- `node scripts/menu-sections.mjs` still round-trips `src/data/counters.json` byte for byte.
- `docs/knowledge/counters.md` and `src/data/counters.json`'s header comment **both describe what
  the code now does.** The documentation being wrong for two stories is half of this bug.
- Every other counter's rendered item count is unchanged. Show it: a before-and-after of all
  twenty-two.
- `npm run verify` passes.
- Only `src/lib/counters.ts`, `src/data/counters.json`, `scripts/`, `docs/knowledge/counters.md`,
  any `.cook` file whose `>> counters:` line the decision requires, tests and
  `docs/active/work/T-007-06/**` are modified.
