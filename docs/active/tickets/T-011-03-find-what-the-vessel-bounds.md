---
id: T-011-03
story: S-011
title: find-what-the-vessel-bounds
type: task
status: done
priority: high
phase: done
depends_on: [T-011-02]
---

## Context

Find the recipes a vessel actually bounds and give them a capacity. **Most recipes are not bounded
and get nothing** — the failure here is over-annotation, not under.

**You own the `>> capacity:` line in `recipes/**/*.cook` and nothing else.** No other line changes.

### 1. The collection already knows, in prose

**55 files say it in words.** 19 carry *"in two batches"*, 3 carry *"in three batches"*, and the
rest are variants — *"in batches with room around every piece"*, *"in two batches and let the fat
climb back to 325°F between them"*. That is a cook writing down a capacity in the only place the
format gave them.

**Start there.** Every one of those 55 is a recipe whose author already decided it batches; the
work is converting a batch count and a serving count into a capacity, and the prose stays where it
is. A file saying *"in two batches"* at 4 servings is telling you the vessel holds 2.

Then the second source: 24 files name a bounding vessel — `#sheet pan{}`, `#air fryer{}`,
`#waffle iron{}` and their kin — in `#cookware{}`. A named vessel is a hint, **not an answer**: a
sheet pan of cookies is bounded and a sheet pan under a single chicken is not.

Then whatever S-008's air fryer files arrived carrying, which should be all of them.

### 2. What binds, and what only looks like it

**Bounded:** a surface where things must not touch — a basket, a sheet pan, a griddle, a waffle
iron, a frying pan searing in batches, a steamer tier. The limit is *area*, and area is why the
second batch exists.

**Usually not bounded:** a pot. Volume scales far past any realistic household number, and the
honest capacity for a stockpot is *more than you will ever cook*, which is the same as absent.

**The judgement to get right:** a pan is bounded when crowding it changes the dish, and not when
it merely fills up. A skillet of onions can be crowded and they still soften. A skillet of steaks
cannot — they steam, and that is a different dinner. **The `docs/gaps/one-pot.md` reference case
is already on the shelf**: `general-tsos-chicken` and its three siblings deep-fry in batches, and
their capacity is set by the oil recovering its temperature, not by the wok's size.

**Where you cannot tell without cooking it, leave it off and say so.** An absent capacity leaves
the plan page saying what it says today. A wrong one makes it confidently wrong in a new way,
which is worse.

### 3. Do not invent, and do not round up to be helpful

A capacity is a real number about a real pan. Where a file's prose gives a batch count, the
arithmetic is the source. Where it does not, the capacity comes from the vessel's size stated in
the file, or it does not come at all.

**Never derive a capacity from the servings alone.** "It serves 4 and uses a skillet, so the
skillet holds 4" is circular and it would silently declare that nothing ever batches.

## Acceptance Criteria

- All 55 prose-batching files are read, and each either carries a capacity derived from its own
  batch count and servings — **arithmetic shown per file in the work artifact** — or is listed as
  a case where the prose did not determine one, with the reason.
- All 24 files naming a bounding vessel are read and classed as bounded or not, with the reason.
- Every S-008 air fryer file carries a capacity, or the discrepancy is a finding.
- **No capacity is derived from servings alone**, and the work artifact states this was checked.
- Every capacity names its vessel as well as its number.
- No file that is not genuinely vessel-bound carries the line. State the total annotated as a
  fraction of 658 — **if it is more than a quarter, that is a signal of over-annotation and the
  work artifact addresses it.**
- The four deep-fry-in-batches recipes named in `docs/gaps/one-pot.md` —
  `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` — are
  annotated, and the work artifact says whether the bound is the pan or the oil temperature.
- No line other than `>> capacity:` changes in any file. Show it: a diff limited to added lines.
- The check from T-011-02 passes over the whole collection — no capacity contradicts its file's
  own servings.
- Run the cost function over every annotated recipe at 2×, 3× and 12 servings, and **paste a table
  of the ten largest jumps in elapsed time.** Those are the recipes this whole story exists to
  warn a cook about, and if any of them look wrong, that is a finding for T-011-02 rather than a
  reason to change the number.
- `npm run verify` passes.
- Only `recipes/**/*.cook` and `docs/active/work/T-011-03/**` are modified.
