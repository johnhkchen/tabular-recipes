# T-002-01 — Review

Three shelves opened, the clock taught that a sealed pot is a wait, three work lists written. All
eight acceptance criteria met and checked. Working tree clean, `npm run verify` green end to end.

## What changed

| File | Change |
| --- | --- |
| `src/data/counters.json` | +96 lines. Three entries appended: The Bowl Shop, Instant Pot, One Pot. |
| `src/lib/time.ts` | +14 / −1. Nine words into `UNATTENDED`, one comment explaining the risky one. |
| `docs/gaps/bowl-shop.md` | new, 174 lines. |
| `docs/gaps/instant-pot.md` | new, 180 lines. |
| `docs/gaps/one-pot.md` | new, 166 lines. |

Nothing else. Nothing deleted. No `.cook` file added, no test file touched, no
`src/generated/recipes.json` change, `docs/gaps/README.md` deliberately untouched (see *Open
concerns* 4).

Commits, all through `lisa commit-ticket` with exact `--include` paths:

```
614b5b3  Open the three shelves: The Bowl Shop, Instant Pot, One Pot   src/data/counters.json
4a2cc36  Teach the clock that pressure cooking is a wait               src/lib/time.ts
e9d9e7c  Write the three work lists for the new shelves                docs/gaps/{bowl-shop,instant-pot,one-pot}.md
```

## Acceptance criteria, one by one

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | 18 counters, three new with `name`/`slug`/`blurb`/ordered `sections` with empty items, file parses | `counters.length: 18`, dup names 0, dup slugs 0, key order matches the fifteen, every `items` is `[]` |
| 2 | `check-recipes.mjs` ok for the whole collection, unchanged | `all 514 file(s) draw a table.` — identical to baseline |
| 3 | A `.cook` naming any of the three passes; demonstrated with a throwaway, not committed | Transcript in `progress.md` § Step 1, plus a negative control on a misspelled name. Both files written outside the repository and deleted |
| 4 | `~pressure cook{35%min}` and `~natural release{15%min}` unattended; `npx vitest run` passes | Both `{ unattended, source: 'name' }`; `666 passed (666)`, unchanged from baseline |
| 5 | Three gap files, each with a real-slug already-here section, a ranked missing list and a what-a-table-cannot-hold section | All three present; 116 / 72 / 114 slug tokens, **every one a real slug, zero duplicates** |
| 6 | Instant Pot names ≥ 25 existing dishes with slugs | **58 distinct existing slugs** in its ranked list |
| 7 | Only `counters.json`, `time.ts` and `docs/gaps/**` modified | The three commits above touch exactly those five paths |

## Test coverage

**What is covered well.** The counters change is guarded by four independent readers of the file
(`check-recipes.mjs`, `parse-recipes.mjs`, `counters.ts`, `collection.test.ts`), and the number
that proves nothing was silently re-shelved — `0 inferred from category` — is printed by the build
itself. The `time.ts` change is bounded by 666 existing tests, including
`collection.test.ts:77-88`, the four-unbroken-hours invariant the ticket names, run across all 514
recipes. The gap notes' slugs are machine-checked against the generated collection.

**The gap, stated plainly.** Acceptance criterion 7 restricts the diff to three paths, so
`src/lib/time.test.ts` could not be touched. **The nine new words therefore ship with no committed
regression test.** They are verified by a throwaway script whose full transcript is in
`pressure-check-output.txt` — 19 assertions covering both acceptance cases, the unnamed-timer
path, and five regressions the change could have caused — but a transcript is not a test, and the
next person to edit `UNATTENDED` gets no warning from CI.

**Remedy, and it is small:** one `describe('the pressure vocabulary', …)` block in
`src/lib/time.test.ts`, lifted verbatim from `pressure-check-output.txt`. It is a ten-minute
follow-up ticket and it is the single most valuable thing to do after this one.

**What is not covered by anything, by nature.** The judgement in the three gap notes — the
rankings, what belongs on which shelf, what a table cannot hold — is prose. A human reviewer
reading those three files is the only check on it, and it is where review time is best spent.

## Open concerns

1. **`pressure` is in `UNATTENDED` as a bare word.** Every other word added is a compound name
   (`pressurecook`, `naturalrelease`) that can only match a timer the author named on purpose.
   `pressure` also matches prose, which is the mechanism behind every lie
   `NOT_A_VERB_IN_A_SENTENCE` exists to correct. It was added deliberately, because an unnamed
   timer in a step reading "cook at high pressure 35 min" otherwise resolves to 35 minutes of
   claimed attention, and because `grep -ri "pressure" recipes/` returns **zero hits across all
   514 files** — it has no prose meaning here to lie about yet. `release`, `seal` and `vent` were
   left out precisely because they do. If a future file uses "pressure" to mean something else,
   this is the first place to look.

2. **The Instant Pot and One Pot shelves are equipment, not storefronts.**
   `docs/knowledge/counters.md` records fifteen archetypes that are all places a person walks
   into, and records **Bowl Shop** under that name meaning *poke and donburi* — a different
   archetype from the Goop-Kitchen/Sweetgreen grain-bowl shop this ticket opened. That reference
   file was not updated (out of scope by AC 7). Someone should decide whether the knowledge doc
   grows a section for equipment shelves, or whether that name collision gets resolved.

3. **`scripts/menu-sections.mjs` now ends with `3 counter(s) need a look`** instead of
   `every counter parsed cleanly`. All fifteen existing counters are unchanged and still fully
   placed; the three new lines are `gap note has no "What it has" block`, which is expected — the
   heading is deliberately `## What is already here` while the shelves are empty, so the tool does
   not fold 150+ slugs from other counters into `counters.json`. It clears when T-002-08 renames
   those blocks. The script is not in `npm run verify` and cannot fail CI.

4. **`docs/gaps/README.md` was not updated.** Its tally table is the state of a pass that read 514
   recipes; the three new counters hold zero, and adding three zero-rows would claim they were
   counted. The three rows become true at T-002-08, which is when they should be written.

5. **The already-here lists are candidates, not assignments.** A recipe being *listable* at the
   Bowl Shop is a judgement — `coleslaw` is currently the Smokehouse's, `mujaddara` the Shawarma
   Counter's. Nothing about those files changed and no `>> counters:` line was written. T-002-08
   makes the actual calls, and it may well drop some of what is listed.

6. **One number in the ticket is wrong**, and nothing depends on it: it says
   `recipes/dressings-and-dips/` holds 41 files. It holds **40** — confirmed by `ls`, by the file
   count in the folder, and by the generated collection. The gap note says 40.

## Something that happened on this branch, for the record

Between the second and third commits, a concurrent session committed `0eba542 "Draft the board for
cooking to a labour outcome"` — story S-003 and seven T-003 tickets. That commit also swept in the
three `docs/gaps/*.md` files while they were still in this thread's working tree, along with
Lisa's published `docs/active/work/T-002-01/` artifacts. The captured content was correct, the
remaining edits went through `lisa commit-ticket` normally as `e9d9e7c`, and the tree is clean.

Nothing needs undoing, and no criterion is affected. It is worth a maintainer's attention only
because it is the ordinary-index hazard the workflow warns about
(`rdspi-workflow.md:45,134-136`) arriving from the other side: a broad commit in another pane
picking up a running ticket thread's in-progress files. If board-drafting sessions run alongside
`lisa loop`, they want narrower `--include` paths too.

## What a reviewer should actually read

1. The three blurbs and twenty section titles in `src/data/counters.json` — they are the only
   visitor-facing copy in this change, and the ticket invited improving the wording.
2. `docs/gaps/instant-pot.md`, the ranked list. It is the one that six writers work down, and its
   order is an argument about what a pressure cooker is for.
3. The `## What it could not stock` block in each of the three. That is where the honest limits
   are, and where a wrong call quietly costs a writer a week.

## Disposition

**Pass.** All eight criteria met with evidence; `npm run verify` green; working tree clean. The
one real limitation — no committed test for the new vocabulary — is a consequence of criterion 7
rather than an oversight, is fully covered by a recorded transcript, and has a ten-minute remedy
named above.
