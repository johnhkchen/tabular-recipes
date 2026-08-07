---
id: T-012-02
story: S-012
title: what-the-shelf-offers-them
type: task
status: done
priority: high
phase: done
depends_on: [T-012-01]
---

## Context

Measure the collection against the three people in `docs/knowledge/cooks.md`, and end with a
ranked recommendation of what to build next.

**This ticket builds nothing and writes no recipe.** Its output is a reading, in the tradition of
T-001-18, T-002-09 and T-003-07 — the passes that read the whole shelf as one thing and found what
no writer ticket could see from inside a folder.

### 1. Test the cattle claim, because it looks true

Persona one says this food eats *more like cattle than a zoo animal*. The rough count says they
are right and it is not close:

| | Files |
| --- | --: |
| `stews-and-braises` | 103 |
| Sweets — cookies, cakes, bars, custards | **101** |
| `rice-beans-and-grains` | 59 |
| `salads` | 23 |
| **`vegetables-and-sides`** | **18** |

Of the eighteen, five are potato, yam or corn, and five more arrived as one block from S-003's
Japanese shelf. Meat tags run 225 across pork, chicken and beef against 32 `vegetarian`.

**Check those numbers properly**, because a folder name is not a diet — `charred-broccoli` is in
`vegetables-and-sides` and so is `candied-yams`, and a stew full of vegetables is not counted at
all. Count by what is actually in the files: the ingredient lists, not the folders. Say how many
recipes are built on a plant that is not a potato, and how many distinct plants the whole
collection uses.

**If the claim survives that, say so plainly.** *A hundred and one desserts and eight non-starch
vegetable sides* is a finding about the shelf that no filter can repair, and it decides whether a
balance feature is worth building yet or would just return the same eight files to everybody.

### 2. Test the beans claim

Persona two says beans get neglected although they were always an option. 43 files mention a bean,
lentil, chickpea or dal; `rice-beans-and-grains` holds 59 and is mostly rice.

Count how many recipes have a pulse as the **main** thing rather than as a component, and how many
of those a person would recognise as dinner. That is the number persona two is describing, and it
is probably much smaller than 43.

### 3. Run each persona against the shelf as a query

For each of the three, answer with slugs rather than with adjectives:

**Cooking for the day.** How many recipes serve one or two without scaling, need no store run
against `src/data/staples.json`'s 31 staples plus a plausible fridge, and are not a heavy starch?
**State the fridge you assumed** — that assumption is the whole answer and it must be visible.

**The family rotation.** Take a week of dinners for four off this shelf without repeating a
protein or a cuisine. Can it be done? What runs out first? That is the forecast persona two cannot
make, done once by hand so the size of the problem is known.

**Holiday guests.** How many recipes have a tree that genuinely splits into work two people can do
at once? `src/lib/schedule.ts` already builds the DAG and packs the lanes — **use it**, and count
how many recipes have more than one branch of real length. That number is how much of a
multi-cook feature is already sitting there.

### 4. Rank what to build next, from the shelf

At least four capabilities are missing and each is a story: cooking from what is in the fridge,
balance and breadth, work that can be handed to a helper, and a rotation that does not need
polling.

**Rank them by what the shelf can support today, not by which sounds best.** A feature the
collection cannot feed is worse than no feature — it is the eight-vegetable-sides problem, shipped.
For each: what it would need, what already exists that it could stand on, how many recipes it
could serve on day one, and whether the collection has to grow first.

**Say plainly if the honest answer is "write food before writing features."** Given the numbers
above, it may be — and this repo has taken that answer before. `docs/gaps/README.md`'s five-gaps
list has never been a feature list.

### 5. Say where the personas disagree with the board

Five stories are running and were argued before the personas existed. Hold each against
`docs/knowledge/cooks.md` and say where it serves nobody, or serves one persona at another's
expense. **Do not change any of them** — a running story is not this ticket's to edit. Where a
conflict is real, it goes in the work artifact as a recommendation, with the ticket it concerns.

S-011's *six people over three days* against persona one's *two servings of the same thing gets old
fast* is the one to start with. They may be the same feature pulling opposite ways, and that is
worth knowing before T-011-06 builds a control for both.

## Acceptance Criteria

- The plant count is done **from ingredient lists, not folder names**, and reports: recipes built
  on a non-starch plant, distinct plants used across the collection, and how both compare to the
  sweets count. The cattle claim is confirmed or refuted with numbers.
- The pulse count reports how many recipes have a pulse as the main thing and would read as
  dinner.
- Each of the three personas is run as a query and answered **with slugs**. The assumed fridge for
  persona one is stated in full.
- The week-of-dinners-for-four exercise is attempted and what ran out first is named.
- The multi-cook count is computed from `buildSchedule`'s lanes, not estimated, and reports how
  many recipes have more than one branch of real length.
- The four missing capabilities are ranked by what the shelf can support, each with: what it
  needs, what it can stand on, how many recipes it serves on day one, and whether food has to be
  written first. **A recommendation, argued, not a list.**
- Every place a running story conflicts with a persona is named, with the ticket it concerns, as a
  recommendation. Nothing on the board is edited.
- The reading is recorded where the other whole-shelf readings live, and
  `docs/gaps/README.md` gains a pointer to it.
- No `.cook` file, no `src/`, no `scripts/`, and no other story or ticket is modified. Only
  `docs/gaps/**` and `docs/active/work/T-012-02/**`.
