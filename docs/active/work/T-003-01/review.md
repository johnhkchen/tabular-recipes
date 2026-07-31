# T-003-01 — Review

Three counters opened and three work lists written, so T-003-03, T-003-04 and T-003-05 can start.
Two commits, four files, nothing else touched.

---

## What changed

| File | Change | Commit |
| --- | --- | --- |
| `src/data/counters.json` | +92 lines — three counter objects appended after `One Pot` | `c47e8ea` |
| `docs/gaps/slow-cooker.md` | new, 282 lines | `11444cf` |
| `docs/gaps/japanese-home.md` | new, 300 lines | `11444cf` |
| `docs/gaps/soup-pot.md` | new, 354 lines | `11444cf` |

Both commits went through `lisa commit-ticket` with exact `--include` paths. No ordinary `git add`
or `git commit` was used. Nothing this ticket owns is left staged, modified or untracked.

**Created and destroyed:** `recipes/soups/zzz-counter-name-proof.cook`, the throwaway that proves a
`.cook` naming each new counter passes. Deleted before the first commit; `git status --porcelain`
shows no `recipes/` entry.

### The three counters

```
The Soup Pot          / soup-pot      / 5 sections / 0 items / categories: []
Japanese Home Cooking / japanese-home / 7 sections / 0 items / categories: []
The Slow Cooker       / slow-cooker   / 5 sections / 0 items / categories: []
```

Counter count 18 → 21. `categories: []` on all three, matching all three T-002-01 siblings — and
for The Slow Cooker it is the only option compatible with T-003-06's criterion that the shelf holds
`kit: Slow Cooker` and nothing else, since a category fallback is the one mechanism that could put
a stovetop braise on a kit shelf.

Section titles adopted from the ticket verbatim. Two candidate rewrites were tested and rejected,
with reasons in `design.md` D1.3; the strongest was *"Beans and pulses"* → *"Beans from dry"* to
match the Instant Pot sibling, rejected because the slow cooker's bean story is the opposite of
"from dry" and the borrowed title would have promised something the shelf cannot keep.

---

## Acceptance criteria, against evidence

| Criterion | Evidence |
| --- | --- |
| Three more counters, each with `name`, `slug`, `blurb`, ordered `sections` with empty item lists, and the file parses | 21 counters; the three print `0 items`; `require()` succeeds |
| `check-recipes.mjs` reports ok for the whole collection, unchanged | `all 589 file(s) draw a table.`, exit 0 |
| A `.cook` naming each of the three passes; demonstrated with a throwaway, not committed | Four runs pasted in `progress.md` — three `ok`, one deliberate `FAIL` on a misspelling; file deleted and the deletion verified |
| The three gap files exist, each with a what-is-already-here section listing real slugs, a ranked missing list, and a what-a-table-cannot-hold section | All three present; every section heading listed below |
| The Soup Pot list explains the logic of the genre, with sources | A 19-row glossary, the seasonal frame, four method rules, a purpose clause on every ranked entry, and a `## Where this came from` block naming seven sources |
| The Japanese list separates existing recipes into shelve/leave by slug | Three buckets — *shelve this*, *both boards*, *this is restaurant food, leave it* — covering all 29 existing Japanese-adjacent slugs; verified programmatically that none is missing |
| The Slow Cooker list names ≥20 existing dishes with slugs, each saying whether the machine helps more or less than pressure | **46 rows**, every one with a slug and one of `more` / `less` / `differently`; 24 also carry an Instant Pot variant |
| Only `src/data/counters.json` and `docs/gaps/**` modified | Both commit diffstats; final `git status --porcelain` |

### Verification run

```
$ node -e "require('./src/data/counters.json')"          # silent
$ node scripts/check-recipes.mjs | tail -1
all 589 file(s) draw a table.
$ git status --porcelain                                  # no recipes/, src/data/ or docs/gaps/ entry
```

Every slug named in all three gap files was resolved against `src/generated/recipes.json`. The only
hyphenated tokens that did not resolve are English compounds (`pan-fried`, `one-plate`) and file
names (`menu-sections`, `slow-cooker`) — no false slug in any of the three.

---

## What the downstream tickets now have, and the counts that make it checkable

The most valuable thing this ticket produced is not the JSON — it is that each writer's floor is
readable off its page rather than derived.

| Ticket | Its floor | What the page gives it |
| --- | --- | --- |
| T-003-03 | ≥20 soups, ≥12 老火湯, ≥5 滾湯 | **18 老火湯 + 10 滾湯 + 4 rice soups**, each with characters, a romanisation and a plain-keyboard spelling |
| T-003-04 | ≥22 files, ≥3 per section, ≥5 in 煮物 and 小鉢 | **41 ranked**, grouped by section: 5 / 9 / 6 / 9 / 5 / 7 — every section clears its floor |
| T-003-05 | ≥18 files, ≥12 naming a dish with an Instant Pot variant | **46 candidates, 24 with an IP variant**; the top twelve are all IP-carrying by construction |

**Two ordering decisions were the point of the ticket, and both are stated in the files themselves
rather than left implicit.** The Soup Pot's ranked list is split into two genre blocks with an
explicit reading order, because a single strictly-ranked list would put eighteen old-fire soups at
the top and a compliant writer working straight down it would fail the ≥5 滾湯 criterion while
following instructions exactly. The Slow Cooker's list does the same thing for a different reason:
its first twelve entries all have Instant Pot siblings, so a writer taking twelve-then-six hits the
≥12 three-way-choice count without having to work it out.

---

## Deviations from the plan

Three, all recorded in `progress.md` as they happened:

1. **The counter count.** Research said 19 → 22; the true starting count is 18, so it is 18 → 21.
   A miscount in Research §2, corrected in all four artifacts. The criterion — *three more than
   T-002-01 left it with* — is met either way and the edit itself never changed.
2. **The collection size.** Research measured 553 `.cook` files; the check reports 589. T-002-05,
   T-002-06 and T-002-07 are writing Bowl Shop recipes on the same branch while this ran. Every
   file is ok and the exit code is 0, which is what the criterion asks; the total is not a fixed
   number while other threads are working.
3. **`slow-cooker.md` does not copy its sibling's framing.** `instant-pot.md` describes the Instant
   Pot shelf as empty, which was true when it was written and is not now — **25 variants exist**.
   The new file states the measured count and names them, which is what makes T-003-05's criterion
   checkable rather than aspirational.

---

## Open concerns

**1. The three gap files run longer than their S-002 siblings.** 282 / 300 / 354 lines against
`instant-pot.md`'s 180. The length is where the ticket's own requirements pushed it — a 46-row
verdict table, a 19-row glossary, 41 ranked Japanese dishes with three spellings each — but a human
reviewer should know these are longer documents than the pattern they follow, and that the RDSPI
~200-line guideline applies to phase artifacts rather than to these.

**2. The Cantonese romanisations are a convenience, not an authority.** They are Cantonese written
without tone marks. `soup-pot.md` says so in the file and tells T-003-03 to confirm each one before
writing it into `aka`. This is deliberate: giving a tone-marked romanisation I could not verify
would have been fabricating a number in a different currency.

**3. The two 煮物 ratio sources disagree.** One gives dashi 10 : soy 1 : mirin 1 : sake 1, the other
5 : 1 : 1 : 1. `japanese-home.md` states both and says explicitly that the disagreement is why a
writer should source the ratio per dish rather than carry one number across the shelf. T-003-04's
criterion is that the ratios are canonical and that the work artifact says where they came from —
this file gives it the starting point, not the answer.

**4. `What each thing is for` may render as an empty section.** It is the glossary's counterpart on
The Soup Pot's board and it holds a recipe only if T-003-03 writes a soup that is *about* one
ingredient — `清補涼` is the natural candidate and the file says so. If nothing lands there the
section is dropped at render, which is safe. Noted so T-003-06 does not read it as a mistake.

**5. `Also here` on all three counters, against T-003-06's criterion.** T-003-06 requires that no
counter renders an "Also here" section. That is not a contradiction — the catch-all is written so
T-003-06 has somewhere to put a borrowing that fits nowhere else, and its criterion says the end
state should be that nothing needed it. An empty section disappears on its own. Each gap file says
this, so it is not re-litigated.

**6. Three things recorded and deliberately not done here**, because they belong to a ticket that
owns the file: no `>> counters:` line was added to `dashi`, `miso-soup` or `congee` (T-003-06's job,
and "nothing is rewritten that exists"); no aisle patterns were added for the dried Chinese goods
or the Japanese pantry, which will be needed and which `soup-pot.md` hands to T-003-06 §3; and
`docs/gaps/README.md` was not updated, because its tally is a per-pass artifact and three shelves
with zero recipes would add three zero rows to a table about what landed. That one is a note for
T-003-07.

## One thing worth a human's attention

`slow-cooker.md` carries a **food-safety fact**, not a preference: dried red kidney beans contain
phytohaemagglutinin and a slow cooker on low may not destroy it, so the beans must be boiled hard
for 10–30 minutes first. Checked against the whole collection — **no recipe here uses kidney beans**
(the dried beans on the shelf are black, pinto, navy, lima, gigante and black-eyed, and
`chili-con-carne` carries none at all), so nothing that exists is affected. It is a constraint on
what T-003-05 may write, and it is the one line on these three pages where getting it wrong could
hurt somebody rather than just read badly.

## Test coverage

No test was added and none was warranted: this ticket adds data and prose. Its correctness is
carried by `check-recipes.mjs` (which validates the JSON on every run, for every recipe), by the
counter-name proof and its negative control, and by the slug-resolution check run over all three gap
files. `npm run build` and `npx vitest run` were not run — neither is in the acceptance criteria,
both are T-003-06's gates, and a counter with zero items generates no page, which was verified in
Research §2 rather than assumed.
