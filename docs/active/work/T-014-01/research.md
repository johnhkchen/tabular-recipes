# T-014-01 — Research

What exists, where, and what shape it is in. No proposals here.

## 1. The corpus

`docs/active/work/` holds **78** directories. **29** are this ticket's full read — `T-007-01`
through `T-013-03`. Every one carries exactly the seven RDSPI artifacts; **two** carry anything
else (`T-012-02` a reading script and its output, `T-013-03` a ranking script and its output).
`review.md` + `progress.md` alone is ~10,700 lines.

The three earlier consolidations — `T-001-18`, `T-002-09`, `T-003-07` — are skim-only by the
ticket's own instruction. What they left is already folded into `docs/gaps/README.md`, whose
`## What no single classifier could see`, `## Shelving notes for the maintainer` and
`## Recorded and not done` sections are their output.

**One attribution correction the ticket itself needs.** The ticket says *"T-002-09 folded 24
concepts spelled two ways across 51 files."* It was **T-001-18** — `T-001-18/review.md:52`,
`structure.md:160`, `progress.md:101` all carry `527 → 503`, and `T-002-09` contains none of those
numbers. The finding is real; the source ticket is one story earlier.

## 2. What each of the 29 contributed

**S-007 — the cha chaan teng.**

| ticket | one line |
| --- | --- |
| T-007-01 | Opened the counter in `counters.json`, wrote `counters.md`'s entry and the 24-rank gap page. Five open concerns, four still live. |
| T-007-02 | Retired The Soup Pot: 16 files deleted, 8 rehomed, the counter removed. Named two stale slug citations outside its scope. |
| T-007-03 | Eight drinks and toasts. Every milk-tea number sourced. Named four missing `VERB_ICONS` verbs and two corrections `cha-chaan-teng.md` still needs. |
| T-007-04 | Fourteen plates and bowls. Found that a full-width prose row cannot contain a comma, documented nowhere. |
| T-007-05 | Shelved 27, aisled the tins, rewrote the README tally to 21 rows. **Found the borrow mechanism drops five slugs silently.** |
| T-007-06 | Made a listed-but-unshelved slug a build failure; `check-menus.mjs` added to `verify`. Left four stale-prose findings. |

**S-008 — washing-up and the basket.**

| ticket | one line |
| --- | --- |
| T-008-01 | Built `washing-up` end to end. Found the collection contains no Instant Pot recipe that browns in a separate pan; flagged that the chopping-board rule makes S-008's own gate example score 1, not 2. |
| T-008-02 | Opened The Air Fryer & the Pot. **The gate admits 0 of the 118 recipes on the three shelves that already promise less work.** Nineteen ranked times shipped as `[to establish]`. |
| T-008-03 | Annotated 145 files, 11 → 177 declared. **The kit axis says almost nothing about the sink**; the slow cooker never washes fewer. Its measurements live in a `findings.md` that was never published. |
| T-008-04 | Wrote the 21 basket recipes. **Found the `~air fry` latent defect in `src/lib/time.ts`** that all 21 depend on. Disagreed with the gap page about the drawer and followed it anyway. |
| T-008-05 | Shelved the 21 and said plainly it is four short of 25. Settled the drawer. Re-derived the README tally to 22 rows. |

**S-009 — the label above its step.**

| ticket | one line |
| --- | --- |
| T-009-01 | Taught the build the inline `>> step:` form. Six failure rules, three beyond the ticket's three. |
| T-009-02 | Moved 2,771 of 2,771 labels across 643 files, byte-identical dump. **Screen A: 0 files depended on the prose-step counting bug.** |
| T-009-03 | Removed the numbered form. Closed the `step.N` entry in `docs/gaps/README.md`; recorded the `@&(~N)` decision. Left `docs/gaps/voice.md` still teaching the dead syntax. |
| T-009-04 | **Nothing new** on migration — 0 of 33 absolute references were mechanical, and misdirected ones fail 30/30. Added a real check for an unresolvable reference. Its `naming-steps-proposal.md` was never published. |

**S-010 — the three dials.**

| ticket | one line |
| --- | --- |
| T-010-01 | Derived `longestHandsOnMinutes` and put five fields in the search index. 17 recipes have longest > elapsed. |
| T-010-02 | Built the three dials with three answers. **Recorded that an exact-count assertion on a shared branch is a tripwire.** The dials cost ~270px above the counter row on a phone. |
| T-010-03 | Ran the scenario and read all 227. **143 of 227 are wrong for a tired evening; the largest cause is that the filter cannot tell dinner from a spice blend.** Twenty timer names in neither word list; `~preheat` never reaches the clock. |

**S-011 — what doubling costs.**

| ticket | one line |
| --- | --- |
| T-011-01 | Wrote `scaling.md`. Found the vessel-cost identity nobody asked for. Its §7 air-fryer pole is an illustration because no air fryer file existed yet. |
| T-011-02 | Built `capacity` and `costOf()`. **`parse-recipes.mjs` still does not throw on `capacityProblem`.** Found `r ≥ m` false in a corner. |
| T-011-03 | Annotated 46 capacities. **98 files are area-bounded and unmeasured** — the strongest single follow-up it found. `carnitas` costMinutes goes negative. |
| T-011-04 | Built `keeps`, annotated 138, withdrew 5 deliberately. Flagged `lengua`'s slack line carrying a keeping fact, and that there is no variant roll-up. |
| T-011-05 | Put the cost sentence on `/list/`. **Two `scaling.md` §6 phrasebook rows are unusable as written.** The `×N` dial and `serves 4 → 12` still print notation. |
| T-011-06 | Built the situation control. **Five pan-bound dishes have no capacity, so the page says the pan doesn't care.** Two phrasebooks now exist and should be one. The front door lost the fold at 375px. |

**S-012 — who is cooking.**

| ticket | one line |
| --- | --- |
| T-012-01 | Wrote `cooks.md`. Found `schedule.ts`'s parallel assumption is a bug for two of the three cooks and a feature for the third. |
| T-012-02 | Read 685 against the three cooks. **130 plants, 23 ever carry a dish; 2 recipes one person can cook with no shop trip.** Verdict for two of four capabilities: *write food before writing features.* |

**S-013 — cooking for a moment.**

| ticket | one line |
| --- | --- |
| T-013-01 | Wrote `occasions.md`. **A profile weighting hands-on positively rewards the recipe nobody annotated.** No mooncake recipe exists. |
| T-013-02 | Built the meal model. **The worked seven-dish meal reports 13.75 hands-on minutes for a whole afternoon** — the machinery is right and the shelf cannot feed it. |
| T-013-03 | Ran two inverting profiles: ρ = −0.591, inversion passes. **The party profile is confounded with written servings.** `birista` declares `1 1/2 cups` and becomes the #2 party dish. Named three errors in `occasions.md` and did not edit it. |

**Nothing new** is a legitimate answer and T-009-04 is the clearest case of it: it was
commissioned to migrate 33 references and found 0 of them worth migrating.

## 3. The recurring shapes, as they actually appear

Every artifact carries its deferrals in the same four places, and a reader can find them by
heading rather than by reading:

1. `## Open concerns` in `review.md` — the primary store. Numbered, each with what it costs.
2. `## Test coverage` → *Gaps* — what no check can reach.
3. A *judgement calls a reviewer should check* block — where the ticket disagreed with itself.
4. A handoff section naming the next ticket by ID.

Ownership is the commonest reason a finding stayed a finding: T-007-05 could not edit five
`.cook` files, T-008-03 could not add a `NEVER_WASHED` entry, T-008-04 could not touch
`src/lib/time.ts`, T-011-03 could not edit `parse-recipes.mjs`, T-013-03 could not edit
`occasions.md`. Five different tickets, one mechanism.

## 4. Where findings are published today

`docs/gaps/` holds 29 files. **26 are counter pages** with a machine-read `## What it has` block
that `scripts/menu-sections.mjs` parses back into `src/data/counters.json`. **Three are not**:
`soup-pot.md` (a retirement record), `filter.md` (T-010-03), `what-the-shelf-offers.md`
(T-012-02), plus `two-that-invert.md` (T-013-03) — four, in fact. A non-counter page in this
directory is established practice and carries no `## What it has` block, which is what keeps
`menu-sections.mjs` from trying to match it to a counter.

`docs/gaps/README.md` is the index and the ranking. Its load-bearing sections for this ticket:

- `## Build state` — a dated measurement block, currently S-007's, at 664 recipes / 894 tests.
- `## The five gaps to fill first` — the ranking this ticket must update.
- `### And a sixth gap` — T-012-02's reading, appended at the end of the five.
- `## Recorded and not done` — six entries, all from the sixteen S-001 writer tickets.
- `## Recorded and closed` — two entries S-009 finished with, with the reason each is here.

## 5. The measurement surfaces

| what | where | notes |
| --- | --- | --- |
| the parsed collection | `src/generated/recipes.json` | gitignored; `npm run recipes` rebuilds. 685 records with `tags`, `slack`, `washingUp`, `capacity`, `keeps`, `counters`, `steps` |
| what the browser fetches | `dist/search.json` | 685 records, nine keys. The independent path T-010-03 re-measured through |
| the menus, read back | `node scripts/check-menus.mjs` | in `npm run verify` since T-007-06 |
| gap page ↔ JSON drift | `node scripts/menu-sections.mjs` | dry run; `--write` is destructive |
| aisle coverage | `npx vitest run src/lib/shopping.test.ts` | prints the unplaced names |

## 6. Constraints this ticket works under

- **No fix of any kind.** `git status --porcelain` limited to `recipes/`, `src/`, `scripts/` and
  `src/data/*.json` must come back empty. Verified empty at the start of Research and re-checked
  at each measurement.
- Only `docs/gaps/**` and `docs/active/work/T-014-01/**` may be modified.
- `npm run verify` must pass. It does, at the start of this ticket: **685 files draw a table, 685
  recipes parse, 1229 tests in 21 files, 710 pages build, 22 counters print 930 slugs.**
- Every finding must name its source ticket, and every mechanical finding must state the command
  that verifies the fix.

## 7. Assumptions

- The band boundary is *cost and certainty*, not importance. A finding can be the most important
  thing on the page and still be *needs an argument*.
- T-012-02's *write food before writing features* is the authority for the third band. It applies
  that verdict to two of its four ranked capabilities — **balance** and **the fridge** — and not
  to the other two.
- A headline claim is checked against the **built site** (`dist/`), not against the artifact that
  made it. Where a claim is about a migration that has already run, the observable residue is
  what can be checked.
