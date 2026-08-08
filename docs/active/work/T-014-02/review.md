# T-014-02 — Review

**Twelve of thirteen applied, one pushed back.** Thirteen commits, twelve files, 124 insertions and
56 deletions. No `.cook` file, no `src/data/`, no test. `npm run verify` exits 0 with figures
identical to the baseline: 685 files draw a table, 1,229 tests in 21 files, 710 pages, 22 counters
printing 930 of 930.

Three things a reviewer should read before the diff:

- **§3, the pushback.** `## Build state` was banded mechanical and is not. That is the finding this
  ticket exists to be willing to make, and if a reviewer disagrees it is one bullet to move back.
- **§4, three corrections to the band's own text.** Two findings named the wrong file and one
  finding's verify arithmetic was wrong by one. All three findings were real; only their paperwork
  was not.
- **§5.2, the one place I went further than the finding's letter** — `scaling.md` §7 — and why.

---

## 1. What changed

| file | fix | commit |
| --- | --- | --- |
| `docs/gaps/one-pot.md` | the fifth section its menu already prints | `926f37b` |
| `docs/gaps/cha-chaan-teng.md` | a mechanism that was removed | `2fd6e63` |
| `docs/gaps/cha-chaan-teng.md` | *"No source states a ratio"*, and one does | `b0e9118` |
| `docs/gaps/voice.md` | a dated note; `>> step.N:` is gone | `691b99b` |
| `docs/gaps/air-fryer-and-pot.md` | the heading the other counter pages use | `d9f2a7e` |
| `docs/knowledge/scaling.md` | *there is no air fryer recipe*, and there are 21 | `2f2743d` |
| `docs/knowledge/occasions.md` | `0 capacities declared`, and it is 46 | `5a90ef4` |
| `docs/gaps/README.md` | `3 of 1074` against the test's `4/1086` | `6e373f5` |
| `README.md` | the third thing the build refuses | `98aa1b7` |
| `scripts/measure-pages.mjs` | a usage example naming a deleted page | `6f10dbe` |
| `scripts/parse-recipes.mjs` | throw on `capacityProblem`, like its four siblings | `0d16e53` |
| `src/lib/time.ts` | `'airfry'` in `UNATTENDED` | `3c0ca89` |
| `docs/gaps/README.md`, `what-the-season-left.md` | the pushback, and the two undone bands | `252e6b9` |

All thirteen through `lisa commit-ticket` with exact `--include` paths. The ordinary index was never
used — no `git add`, no `git add -A`, no `git commit`. `git status --porcelain` carries nothing of
this ticket's staged, modified or untracked.

**Not touched:** every `.cook` file, `src/data/counters.json`, `src/generated/`, every test file,
`docs/knowledge/cooks.md`, `docs/knowledge/counters.md`, and the twenty-one counter pages the
findings did not name.

---

## 2. Acceptance criteria, against evidence

| criterion | evidence |
| --- | --- |
| Every finding **applied** or **pushed back** with the reason; the artifact accounts for all of them; none silently skipped | 13 of 13 in `progress.md`, one section each. **12 applied · 1 pushed back** |
| Each applied fix has its verifying command and that command's output, **run after that fix and before the next** | `progress.md` steps 1-12, one command block each, in commit order. Each step also re-diffs `menu-sections.mjs` against the running baseline |
| No fix moves a recipe between counters, changes a declared time, servings, capacity, washing-up count or slack level, or rewrites an argument | `git diff --name-only acce740..HEAD -- recipes/ src/data/` → **empty**. Argument-preservation checked per fix — the seven Cha Chaan Teng verdicts and the section's closing sentence, `scaling.md` §7's figures, `occasions.md`'s *two of those rows are the whole difficulty*, `voice.md`'s whole measurement table |
| For any `.cook` touched, operation labels and clock figures unchanged by dump-and-diff | **No `.cook` was touched**, so the criterion has no call site. Run anyway for `src/lib/time.ts`, which is upstream of every clock figure on the site: 685 recipes × 6 schedule figures, before and after → **empty diff**. Operation labels cannot move at all — the label path never imports `time.ts` (§5.3) |
| Both undone bands recorded in `docs/gaps/README.md` with finding, evidence, source ticket and reason; nothing from them applied | Read row by row, 25 + 4, verdict per row in `progress.md` step 13. Two gaps found and closed additively. **Nothing applied** |
| `npm run verify` passes, including `scripts/check-menus.mjs` | **exit 0**, captured from the command and not a pipeline. `22 counter(s): 930 slug(s) listed, 930 printed.` Headline figures diffed against the baseline → **IDENTICAL** |
| `npm run verify:mobile` passes, run with nothing else building | See §7 |
| The artifact states the count applied and the count pushed back | **12 applied, 1 pushed back**, at the top of `progress.md` and of this file |

---

## 3. The pushback, and it is the largest of the thirteen

**`## Build state` fails test 1** — *two reasonable people would make the same edit*. Four reasons,
any one of them enough:

1. **The file the finding names is wrong, and its justification depends on that.** It says
   `README.md` and argues *"S-014 is the pass that publishes, and a stale front-door number is the
   first thing a reader meets."* The block is in `docs/gaps/README.md` — an internal index that is
   not built and not published. The root `README.md` carries no build figures at all.
2. **The staleness is already disclosed twice on the same page**, at its own line 37 and again at
   line 76.
3. **The current figures are already on the page**, forty lines below, correctly dated.
4. **The block's closing paragraph is not figures.** It is S-007's arithmetic — *658 at the start,
   minus the sixteen 老火湯, plus the eight and the fourteen* — true of S-007, false of today, and
   deleted by any refresh.

So one reader refreshes it and one keeps the record, and the decision generalises: it settles what
happens to every dated block on the board, including `voice.md` §5 (which this ticket annotated
rather than refreshed, on exactly that reasoning), `scaling.md`'s five surviving 664-recipe figures,
and `what-the-season-left.md`'s own dated fractions.

Recorded in three places: `progress.md`, `docs/gaps/what-the-season-left.md` under its own *Pushed
back out of mechanical* heading with the reason, and `docs/gaps/README.md`'s *needs an argument*
table. **The block itself was not edited** — `grep -c '664 files draw a table'` → 1.

**A reviewer who disagrees has a one-bullet job**, and the evidence is on the page.

---

## 4. Three corrections to the band's own text, all recorded on the page

A verify command that cannot return its stated output is not a verify command, so these are stated
rather than absorbed.

| finding | what was wrong | consequence |
| --- | --- | --- |
| `3 of 1074` | said `README.md`; it is `docs/gaps/README.md:395` | applied at the corrected location |
| `## Build state` | same, and the *front door* justification does not survive the move | contributed to the pushback |
| the air fryer heading | verify said the grep goes to 22; it was **already 22** and is **23** after | applied; the arithmetic corrected on the page |
| `no air fryer recipe` | verify's grep reaches **two** sites, not the one §9 the bullet names | both clauses corrected — see §5.2 |

The 22 were 21 counter pages **plus `filter.md`**, which borrows the heading deliberately and is not
a counter; `soup-pot.md` is retired and uses a third wording.

---

## 5. The judgement calls a reviewer should check

### 5.1 Test 1 was read as being about the substance, not the sentence

Eleven of the twelve fixes edit prose, and every prose fix needs words nobody has written. If test 1
meant *would two people type the same characters*, only the four code-and-slug fixes would qualify
and the ticket's own §2 — which expects *"stale sentences in gap pages"* — would describe an empty
band. So the bar applied was: **is the fact being asserted contested?** `27 recipes` is not.
`menuFor()` throws rather than drops is not. 46 capacities is not.

**If a reviewer reads test 1 the stricter way, seven fixes move**, and the diffs are small enough to
revert one at a time.

### 5.2 `scaling.md` §7 — one clause beyond the finding's letter

The finding names §9. Its verify grep reaches §7 as well, and fixing §9 alone leaves the identical
false sentence forty lines above it. Both clauses were corrected as **facts, with the date**;
§7's illustration — `a basket load ≈ 20 min`, `c ≈ 4`, `r = 3`, `elapsed = 66 min`, the karaage
comparison — was not touched, because rewriting it from `air-fryer-chicken-wings` is the
*needs an argument* row and stays there.

**This is the fix most open to the charge of doing too much**, which is the failure mode the ticket
names. The defence is that the alternative was to knowingly leave a false sentence in a knowledge
page during the season that publishes, and to report a verify command as passing when it returns 1.

### 5.3 `'airfry'` is a code change, and here is why it is still mechanical

Not because it is small. Because it changes nothing that exists:

- **Dump-and-diff, 685 recipes × 6 schedule figures, empty.** T-014-01 measured this on a scratch
  copy; it was re-measured here in the repository rather than trusted, which is what the ticket asked
  for. If it had come back non-empty the fix would have been reverted and pushed back — that branch
  was planned for and not taken.
- **Operation labels cannot move**, and this is structural rather than measured: the label path is
  `check-recipes.mjs` → `label.ts` → `tree.ts` → `layout.ts`, and none imports `time.ts`. `tree.ts`
  imports `keeps`, `scaling`, `slack` and `washing-up` as **types only**.
- **Two source tickets recommended the exact edit** (T-008-04 §6.1, T-008-05 §6.1), and the file
  already carries the precedent: T-002-01 added four pressure names before any pressure recipe
  existed, and the comment says so.

**What a reviewer could reasonably dispute** is whether basket time is unattended at all — a basket
gets shaken. The answer that made it mechanical is that the collection **already** reads all 21 that
way, by accident: every basket cell opens with `roast`, which `readWords` reaches first. The edit
makes an existing reading explicit and removes the trap where reordering a cell silently flips it.

### 5.4 What was left undone on purpose, inside a fix that was applied

`docs/gaps/README.md`'s stated **158** *items a table cannot express* was not re-derived, although
the heading rename now makes the air fryer page's eight entries reachable for the first time. That
file says in as many words that these figures are *carried forward* and that *"it would be dishonest
to print numbers as though somebody had"* re-derived them. Replacing 158 with a derivation asserts
that the derivation is the right way to count — a claim, not a correction. Recorded on the page.

### 5.5 The five T-014-01 pushed out were re-read and agreed with

`birista`, `lengua`, `batata-harra`, the category tree and `scaling.md` §2. Each fails test 3 on its
face — a declared number, a declared slack line, a contested word, thirteen `category` lines, and an
argument. Not re-litigated, and not silently ratified either: they are named here so a reviewer knows
they were looked at.

---

## 6. Test coverage

**No test was added, and that is the answer rather than a gap.** Eleven fixes are documents; a test
asserting a paragraph exists is a test of the diff. T-012-02, T-013-01 and T-013-03 shipped the same
way and all three dispositions passed.

The two code fixes are covered by demonstration rather than by fixture, and both demonstrations ran:

| check | catches | result |
| --- | --- | --- |
| the malformed-capacity probe, **before and after** | finding 13 doing nothing | before: `npm run recipes` exits **0** on a file `check-recipes` fails, parsing 686. After: exits **1**, naming the file and quoting the problem |
| 685 × 6 schedule dump-and-diff | finding 12 moving a clock figure | **empty** |
| the label path's import graph | finding 12 moving an operation label | `time.ts` is not in it |
| `attentionOf()` on four spellings | finding 12 over-reaching | `air fry`/`air-fry`/`airfry` → unattended; **`fry` → hands-on**, unchanged |
| a `>> step.N:` probe | finding 4's note claiming something false | the checker refuses it and names `inline-step-labels.mjs`, verbatim as the note says |
| an `@&(~3)` probe | finding 10's bullet claiming something false | the checker names the line, in the words the bullet was then written in |
| `npm run verify` | anything reaching the build | exit 0 at steps 9, 12 and 14, figures identical to baseline |
| `menu-sections.mjs` diffed against a running baseline | a gap-page edit moving a counter section | empty after every gap-page fix except step 1, whose delta was the point |
| `git status --porcelain -- recipes/` | a probe left behind | empty; both probes removed in the step that created them |

**Both probes were written to prove a failure, not to assert one.** The capacity probe initially
tripped a different guard — *"1 recipe(s) sit at no counter"* — which would have proved nothing, and
was given a `>> counters:` line until `capacityProblem` was the only thing that could fail it.

### The gap no check closes

**Whether the twelve are the right twelve is a judgement, not a measurement.** Nothing here proves
that a thirteenth finding does not deserve pushback, or that the pushback does not deserve applying.
What stands in for that is that every verdict names the test it turned on and the evidence sits
beside it, so disagreeing is cheap. §5.1 is the single assumption that most changes the count.

---

## 7. `npm run verify:mobile`

Run **alone, with nothing else building in this tree.** `pgrep` was checked first; the two
`astro dev` processes found belong to a different repository (`boilerplate-demo`) and touch neither
this tree nor its `dist/`. This is the instruction in the ticket with a cost already attached to
ignoring it — five attempts and an operator's afternoon on T-010-03.

```
$ npm run verify:mobile > mobile.txt 2>&1 ; echo "MOBILE_RC=$?"
MOBILE_RC=0
2130 page views at 375px, 390px, 768px — nothing scrolls sideways.
2130 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px, the table says
when it continues, and the pinned column stays below 44rem.
```

Both halves, 2,130 page views each. `grep -icE 'fault|changed while this was reading it|Could not
finish'` → **0**: no fault, and `check-touch`'s own `build.moved()` guard — the one a concurrent
build trips, which is what the ticket is warning about — did not fire. Exit code read from the
command, not from a pipeline.

A first run was killed by a **ten-minute command timeout, not by a failure** — the overflow sweep
had already passed and the touch sweep was part-way through. It was re-run to completion rather than
reported from partial output, because a sweep read at 60% is not a sweep that passed.

---

## 8. Open concerns

1. **The pushback is one bullet from being wrong.** If a reviewer holds that a superseded dated
   block should simply be refreshed, `## Build state` becomes a thirteenth fix and the count reads
   13 of 13. The evidence is already written on both pages; nothing needs re-deriving.

2. **`scaling.md` §7 now reads as a dated note wrapped around an undated illustration.** It is
   honest and it is not elegant. The clean end state is the rewrite its own §9 asks for, which is
   banded *needs an argument* and belongs to whoever takes that row.

3. **Three fixes landed in `docs/knowledge/`**, which T-014-01 flagged as neither `docs/gaps/**` nor
   obviously this ticket's. The acceptance criteria restrict what a fix may **do**, not where it may
   live, so they were read as in scope — but a reviewer who reads it the other way should say so.
   They are `scaling.md` ×1 and `occasions.md` ×1; the third, `voice.md`, turned out to be
   `docs/gaps/voice.md` and is not in that directory at all.

4. **`occasions.md`'s line 217 needed a sentence, not a number.** *"No file declares one yet, so
   every scaling answer in this collection today is the no-vessel branch"* is false at 46, so the
   count could not be corrected in isolation. The replacement says what is true — 46 declare, the
   other 639 take that branch — and the paragraph's argument, that two of those rows are the whole
   difficulty, is untouched and still holds at 46 of 685. **This is the fix where a sentence moved
   furthest**, and it is six insertions against six deletions.

5. **The needs-food band gained a column.** It had `finding | source` and no reason per row; the
   band's single shared reason was true but did not say why *that* row waits. Four cells were added,
   each drawn from `what-the-season-left.md` rather than invented. Additive — no existing row was
   reworded. A reviewer who considers the shared reason sufficient loses nothing by reverting it.

6. **One exit code in this attempt was read from a pipeline and was worthless.** It was caught in the
   same step and re-run properly. Recorded because T-014-03's ticket names that exact failure and the
   next attempt should know it is easy to do by accident.

7. **The branch was quiet for this whole attempt.** Every figure here comes from one build and was
   re-checked against the same build at Review; there is no concurrency caveat to record.

---

## 9. What T-014-03 inherits

- **A board with no drift.** `node scripts/menu-sections.mjs` now ends *"every counter parsed
  cleanly"* instead of *"1 counter(s) need a look"* — the last drift, carried since S-007.
- **A stricter build.** `npm run build` alone no longer reads a half-written capacity as absent.
- **A publish-season front door that is accurate about what the build refuses**, and one dated block
  that is knowingly still S-007's, with the decision written down rather than the number changed.
- **A `docs/gaps/README.md` whose two undone bands each carry finding, evidence, source and reason**,
  and a `what-the-season-left.md` whose mechanical band says twelve, says what happened to them, and
  says where the thirteenth went.
