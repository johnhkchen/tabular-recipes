---
id: T-007-02
story: S-007
title: retire-the-soup-pot
type: task
status: done
priority: high
phase: done
depends_on: [T-007-01]
---

## Context

Take The Soup Pot off the board: delete sixteen recipes, rehome eight, remove the counter, and
leave a record of why so nobody re-derives the shelf in a year.

**You own `src/data/counters.json` and the eight `.cook` files that stay.** T-007-01 holds
`counters.json` before you, which is why this waits on it. Read what it did first.

The argument is in `docs/active/stories/S-007-a-counter-you-can-shop-for.md` and it is not
re-litigated here. This ticket is the execution, and the failure mode is orphaning a recipe, not
disagreeing about the cull.

### 1. Delete the sixteen 老火湯

```
green-radish-carrot-pork-bone-soup      chinese-yam-goji-black-chicken-soup
winter-melon-jobs-tears-soup            ching-bo-leung-soup
lotus-root-dried-octopus-soup           sha-shen-yu-zhu-soup
watercress-honey-date-soup              hairy-gourd-dried-scallop-soup
peanut-black-eyed-pea-chicken-feet-soup dried-bok-choy-pork-lung-soup
overlord-flower-soup                    lotus-seed-lily-bulb-soup
corn-carrot-pork-bone-soup              old-cucumber-rice-bean-soup
green-papaya-peanut-trotter-soup        apple-pear-pork-bone-soup
```

All sixteen are in `recipes/soups/`. **Nothing in the collection points at any of them** — checked
across every `.cook` file, `src/` and `docs/knowledge/`, and the only references are
`src/data/counters.json` and the generated `src/generated/recipes.json`, which rebuilds. Confirm
that yourself before deleting rather than trusting this paragraph: a `pairs-with` added since
would be a build error the moment the file goes.

**`corn-carrot-pork-bone-soup` and `green-radish-carrot-pork-bone-soup` will look like they should
survive**, because everything in them is supermarket produce. They go anyway. The cull is on the
bargain and the framing — three hours for a broth whose solids are thrown away — not on sourcing
alone, and a shelf keeping two files because their ingredients are easy would be keeping the two
least interesting members of a genre it just decided not to carry.

### 2. Rehome the eight that stay

The six 滾湯 and the two congees. **Five of them are shelved nowhere else and orphan the moment
the counter goes** — that is the real work of this ticket.

| Slug | Also shelved at, today |
| --- | --- |
| `tomato-potato-beef-soup` | nowhere |
| `seaweed-egg-drop-soup` | nowhere |
| `mustard-greens-tofu-soup` | nowhere |
| `crucian-carp-tofu-soup` | nowhere |
| `century-egg-amaranth-soup` | nowhere |
| `egg-drop-soup` | Takeout Counter |
| `congee` | Dim Sum Counter, One Pot |
| `congee-instant-pot` | Instant Pot |

Find each of the five an honest home and edit its `>> counters:` line. **One Pot** is the obvious
candidate — *"Everything goes in one pan, and that is the only pan to wash"* is exactly what a
15-to-45-minute soup is — and `congee` is already there, so the shelf has precedent. **Cha Chaan
Teng** is a second real option for one or two of them, because the 常餐 comes with a 餐湯 and a
tomato-and-beef soup is squarely that; T-007-01's work list will have said whether it wants them.

Two rules on the rehoming, and they matter more than which counter you pick:

- **A borrowed shelf is not a dumping ground.** If a soup does not fit any existing counter
  honestly, say so in the work artifact and leave it to fall through the `categories` fallback —
  `Soups` already lands at the Diner. An awkward-but-argued placement is fine; a placement nobody
  can defend is what put us here.
- **Do not rewrite the recipes.** The `>> counters:` line is the only line that changes in any of
  the eight.

### 3. Remove the counter

Delete the `soup-pot` entry from `src/data/counters.json`. Its four sections go with it, including
the empty `What each thing is for` section, which has never held an item and should not be
recreated anywhere.

### 4. Rewrite the gap page as a record

`docs/gaps/soup-pot.md` is 404 lines and most of it is genuinely good research — a dried-goods
glossary, the seasonal frame, the four rules of the pot, the sources. **Do not delete it and do
not leave it describing a live shelf.**

Rewrite it as what it now is: a record of a counter that was tried and taken down. It needs, at
the top, the five reasons from the story stated plainly and the date. Then the glossary and the
method rules kept intact, under a heading that says they are preserved research rather than a work
list. The ranked list of unwritten soups goes; nobody is writing them.

The one thing the new version must state that the old one did not: **what would have to be true
for this shelf to work.** An aisle that names a dried-goods shop, a substitution model, and a
counter definition that admits a home practice. That is the honest note to leave for whoever
wants to try again, and it is worth more than the list of eighteen soups.

Update the row for The Soup Pot in `docs/gaps/README.md`'s tally, and the pointer in
`docs/knowledge/counters.md` if it names the counter.

## Acceptance Criteria

- The sixteen files above are deleted from `recipes/soups/` and no other `.cook` file is deleted.
- **Zero orphans.** Every one of the eight survivors resolves to at least one counter, shown by
  name in the work artifact, and `npm run verify` reports 0 orphans.
- The five previously-unshelved soups each name a counter explicitly in `>> counters:`, and the
  work artifact gives the reason for each — not "One Pot" alone, but why that shelf and not
  another.
- No line other than `>> counters:` changes in any of the eight survivors. Show it: a diff limited
  to that line.
- `soup-pot` no longer appears in `src/data/counters.json`, and `/menu/soup-pot` no longer builds.
- No `.cook` file anywhere still names `The Soup Pot` in a `>> counters:` line — that would be a
  build error, so this falls out of the build, but check it before building.
- `docs/gaps/soup-pot.md` still exists, states the five reasons and the date, keeps the dried-goods
  glossary and the four method rules, drops the ranked work list, and says what would have to be
  true for the shelf to work.
- `docs/gaps/README.md`'s tally no longer counts The Soup Pot as a live counter.
- The recipe count in the build drops by exactly 16, and every other counter's item count is
  unchanged except those that gained a rehomed soup.
- `npm run verify` passes end to end.
- Only `src/data/counters.json`, the sixteen deleted files, the eight survivors'
  `>> counters:` lines, `docs/gaps/soup-pot.md`, `docs/gaps/README.md` and — if it names the
  counter — `docs/knowledge/counters.md` are modified.
