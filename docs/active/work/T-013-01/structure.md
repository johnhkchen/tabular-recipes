# T-013-01 — Structure

One file is created. Nothing is modified, moved or deleted.

---

## Files

| Path | Change | Shape |
| --- | --- | --- |
| `docs/knowledge/occasions.md` | **created**, ~330 lines | Prose argument in the shape of `counters.md`: thesis, contents table, argued sections, sources, what could not be verified |
| `docs/active/work/T-013-01/*.md` | created by Lisa from the attempt directory | The six phase artifacts |

**Nothing else.** No `.cook` file, no `src/`, no `scripts/`, no `README.md`, no `docs/gaps/`, no
JSON. `npm run verify` is untouched by a markdown file in `docs/knowledge/`, and no checker reads
that folder.

**One mechanical constraint carried from T-012-02's design.** `scripts/menu-sections.mjs` parses
`## What it has` blocks out of `docs/gaps/**` into `src/data/counters.json`. This file is in
`docs/knowledge/` and carries no such heading, so it cannot be mistaken for a counter page. Both
facts hold; the heading is avoided anyway.

---

## The file's outline, section by section

Line budgets are targets, not caps. Section 3 is the ticket's stated real work and gets the most.

```
# Occasions                                                              ~10
  thesis · the archetypes-not-taxonomies rule carried from counters.md
  sibling cross-links (counters · scaling · cooks · voice)  ← the index decision
  what an occasion is NOT (theme, cuisine, mood, season with recipes)

## Contents                                                              ~14
  table: occasion axis | what it is | in or out, and why

## 1. Somebody sells for it                                              ~55
  1.1 the rule, stated once
  1.2 the four kinds of evidence, each with what it proves and what it cannot
  1.3 what is NOT evidence — advice, tradition, search volume
  1.4 applied: the candidates table, with rejections
  1.5 the second gate: real is not the same as ours

## 2. The three axes                                                     ~45
  time of year — in
  moment in life — in, thinner, graded
  type of day — out, on gate two, with both costs stated
  why the fourth tempting axis (a cuisine, a theme) is not an axis

## 3. What makes a hall of famer, per occasion                          ~120
  3.1 the fields it is allowed to use, each with where it comes from and coverage
  3.2 the shape: gate · signed weighting in minutes-equivalent · three answers
  3.3 corner one worked in full — a big family meal, cooked alone
  3.4 corner two worked in full — a dumpling party
  3.5 the same seventeen ranked both ways: the inversion table
  3.6 what the collection did to it — the silence, and the sign-flip finding
  3.7 fields that do not exist, and what each would take

## 4. One namespace or two                                               ~40
  for · against · the decisive test · the decision · the cost

## Sources                                                               ~20
## What could not be verified                                            ~30
## What this file does not do                                            ~10
```

---

## Section contracts

What each section must contain for its acceptance criterion to be met.

**§1** — the rule as one bolded sentence; **four kinds** of selling evidence named, each with a
concrete instance and a stated weakness; a *what is not evidence* paragraph; a candidates table
containing **at least one rejection** with the reason. Rejections carried: *moving day*, *in-laws
for a week*, *a rustic Tuscan evening*. The first two are inside the site's own lists, and the file
says so.

**§2** — each of the three axes classed in or out, with its reason. The *type of day* entry must
name S-010, name the three dials it duplicates, and state the cost of the decision **in both
directions**. It must also record that type of day passes the selling test — that is what makes the
second gate necessary rather than decorative.

**§3** — this is the section the ticket says earns the file's keep.

- Every field named must exist. The table gives the symbol, the module it comes from, and how many
  of 685 files declare it. Verified against `src/lib/` and `src/generated/recipes.json`.
- The profile is defined once, abstractly, then instantiated twice.
- Both corners are worked **in full**: gates, weights with their signs, the arithmetic, the ranking,
  and what the ranking is wrong about.
- One table shows the same seventeen recipes ranked under both profiles, so the inversion is
  visible in one place.
- The sign-flip finding gets its own bolded statement and the rule that follows from it.
- Missing fields are **named with what each would take** and nothing more.

**§4** — argued both ways at comparable length; the decision; the cost as a list of what would have
to change. No implementation.

**Sources** — grouped the way `counters.md` groups them, with the domains actually read.

**What could not be verified** — the sample bias of the selling pass, the mooncake correction, the
things not looked at, the numbers that will drift.

---

## Data the file quotes, and where each figure came from

Every number in `occasions.md` must be traceable to one of these. Nothing else is quoted.

| Figure | Source |
| --- | --- |
| 685 recipes; keeps 138 · washing-up 177 · slack 416 · capacity 0 | `src/generated/recipes.json`, read 7 Aug 2026 |
| hands-on evidence not `unknown` on 269 | `handsOnEvidence()` over the collection |
| 43 files carry all four | same pass |
| per-recipe standing / longest / elapsed at n=12 | `costOf(recipe, 12, buildSchedule(recipe))` |
| `assumedHandsOnMinutes`, `untimedCount` | `buildSchedule()` |
| occasion tags: thanksgiving 3, christmas-ish 3, muertos 1, easter 1 | tag/title/slug/aka scan |
| no mooncake recipe | `find recipes -name '*.cook'` and a grep for the word |
| `keeps` distribution 25 / 23 / 89 / 1 | `keeps.minutes` over the 138 |
| the four kinds of selling evidence and their instances | the eight searches recorded in `research.md` §5 |
| Mother's Day / dining-out ranking | National Restaurant Association, via the sources named |

**Figures deliberately not quoted:** anything from `docs/gaps/README.md`'s build-state block, which
is S-007's and stale by its own admission; and any shelf-supply count, which is T-012-02's and
in flight on this branch.

---

## Ordering

The file is written in one pass, in section order, because §3's argument depends on §1's rule and
§4's decision depends on §3's finding about derived membership. There is no partial state worth
committing: one file, one commit, through `lisa commit-ticket`.

## Verification

- `npm run verify` — must stay green; the change cannot affect it, and running it proves that.
- Link check by hand: every relative link out of `docs/knowledge/occasions.md` resolves, and every
  in-page anchor matches a heading.
- Field check by hand: every field name, module path and line reference quoted in §3 exists.
- Register check: read §3 and §4 against `voice.md`'s three house tests. No *festive*, no
  *effortless*, no *crowd-pleaser*, no O(·) presented as something a cook would read.
