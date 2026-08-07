# T-008-03 — Review

**145 recipes now say what they leave in the sink, and the collection went from 11 answerable to
177.** One Pot's promise has been checked against every one of its 73 files for the first time and
it holds: 65 of 73 wash one or two things, 40 wash exactly one. `npm run verify` exits 0.

Two things a reviewer should read before the diff: **§4 finding 2**, where the kit axis turns out to
say almost nothing about washing up, and **§5 concern 1**, a rule this ticket had to overrule
because the ticket and the README disagree.

The measurements the acceptance criteria ask for are in **`findings.md`**, not here — seven of the
eleven criteria are reports rather than code, and burying them in a handoff document would have
made them unreadable. This file says what changed and what to distrust.

---

## 1. What changed

**Modified: 145 `.cook` files, one added line each.** Nothing created, nothing deleted, no `src/`,
no `scripts/`, no `docs/gaps/`, no `counters.json`, no README.

| Batch | Files | Commit |
| --- | --: | --- |
| One Pot | 69 | `d93f15b` Say what the One Pot shelf actually washes |
| Instant Pot | 23 | `70eafcc` Say what the Instant Pot shelf actually washes |
| The Slow Cooker | 20 | `a01178a` Say what the slow cooker leaves in the sink |
| air-fryer gap candidates | 20 | `13890dd` Say what the basket would be washing against |
| plain siblings of pool `kit:` files | 14 | `91a66c5` Give every kit recipe a plain half to compare against |

All five through `lisa commit-ticket` with exact `--include` paths generated from the pinned list.
The ordinary index was never used. Nothing of this ticket's is left staged, modified or untracked.

**The diff is 146 added lines and one removed, across 145 files. Every added line begins
`+>> washing-up:`.** Per-commit audit in `findings.md` §10. The one removal is this ticket's own
correction to `tonkotsu-broth-instant-pot`, described in `progress.md` §4.

## 2. Scope: 151 read, not 113

The ticket's arithmetic (68 + 25 + 20) is five short — **One Pot has 73 recipes**, as both gap pages
say. The pool actually read was the three shelves as measured (118), plus the 20 existing slugs the
air-fryer gap page ranks (138), plus **13 plain siblings** without which the criterion *"a
side-by-side table… for every `dish` that has both a plain and a `kit:` file"* could not be written
(151). Six already carried a line, so **145 were written against a target of 100**.

## 3. Coverage: what stands in for tests

No code changed, so there are no new tests. What checks this work:

| Risk | Check | Result |
| --- | --- | --- |
| a malformed line | `npm run recipes` throws by design | ran after every batch, 0 |
| a number written in a line | build error by design | none |
| an entry that is secretly two things | `pluralEntries` advisory | **0 notes on 145 lines** |
| a line forgetting a vessel the file *names* | `unaccountedCookware` advisory | **7 notes, all utensils, all overruled by rule 7** — `findings.md` §9 |
| something other than the line changed | per-commit diff audit | 146 added, all `>> washing-up:`; 1 removed |
| the count disagreeing with the list | collection test in `washing-up.test.ts` | passes over all 177 |
| the whole build | `npm run verify` | **exit 0** — 685 files, 1005 tests, build complete |

**The gap no check can close, and it is the important one: a line that forgets a vessel the file
never names is invisible to everything in this repository.** That is why the field is authored, and
the only defence is that every count was read off the steps and recorded — `progress.md` lists the
rows where the reading disagreed with `cookware`, and `findings.md` §8 lists the five closest calls
with the alternative reading spelled out, so a reviewer can disagree with a specific line rather
than with a total.

## 4. The three findings, in one line each

Full versions in `findings.md` §§2–5.

**1. One Pot mostly keeps its promise. Eight of 73 wash three or more**, not the larger number the
ticket expected — `chile-verde` (4), `country-fried-steak` (4), `beef-bourguignon`,
`soy-sauce-chicken`, `tinga-de-pollo`, `tortilla-espanola`, `white-cut-chicken`, `wonton-soup` (3
each). Two of those are genuine two-appliance dishes (`chile-verde` chars under a broiler and blends;
`tinga-de-pollo` poaches in a second pot and blends); two are honest one-*pan* dishes that need a
bowl and a plate. **Nothing was re-shelved.** The question that decides the list is whether One Pot
promises one pan or one sink, and that is a counter decision.

**2. The kit axis says almost nothing about washing up, and the slow cooker makes it worse.**
Instant Pot: **16 of 25 pairs are a dead heat** with the plain version, 5 wash more, 4 fewer. Slow
Cooker: **16 of 20 wash more and not one washes fewer** — the crock browns nothing, so a skillet
joins it, and `pot-roast` goes 1 → 4. Where the pot does win it is always the same win: dried
pulses from dry, no soak bowl, no parboiling pan (`boston-baked-beans` 4 → 1). **The basket is the
only kit that reliably removes a vessel** — 10 of 13 on T-008-04's in-flight numbers.

**3. Bar 1 was never the reason the gate admits nothing. 0 of 151 clear all three bars**, unchanged
from `docs/gaps/air-fryer-and-pot.md`'s published zero — but bar 1 is now readable on every recipe
in the pool and **96 of 151 clear it.** 33 recipes clear bars 1 and 3 together and every one dies on
bar 2, because a hob is not plugged in.

**And the answer to the ticket's fourth question: no recipe was uncountable.** Zero of 151 needed
the honest-absence escape. The rule stays in the convention because the air-fryer files are where it
will first bite (*"it might be two batches"*).

## 5. Open concerns

### 1. The ticket and the README disagree about the chopping board, and the README won

The ticket says *"a knife and a chopping board are one thing together, by convention"*. The README —
written by T-008-01 from the same instruction that produced the plate rule — says *"do not count…
the knife and board you prepped on"*, because every recipe on the site would list it. **Both cannot
be applied.** I kept the README's exclusion and preserved the ticket's rule for the case that
survives it (a board used as a vessel rather than a prep surface), which did not arise once in 151
files. Reasoning in `design.md` §3 rule 6, restated in `findings.md` §1.

**Consequence a human should confirm:** S-008 illustrates two-or-fewer as *"The pot and a chopping
board."* Under these lines that recipe scores **1**, not 2, so the gate reads looser than the story's
sentence implies. T-008-01 flagged the same thing in its review §4.2 and nobody has ruled on it.
**Every number in `findings.md` §5 was produced under this boundary**, so a ruling the other way
would move them.

### 2. Three judgement calls that a second annotator could reasonably reverse

Listed with their alternatives in `findings.md` §8. The two that move a headline number:

- **`soy-sauce-chicken` is 3 because it ends by straining and keeping the master stock** (rule 3,
  storage). Read the closing note as optional and it is 1 — and it leaves the ≥3 list in §4.
- **`crispy-chickpeas` is 3** on the reading that the spice is stirred *while* the oiling bowl is
  still dirty. One bowl reused makes it 2.

Neither is hidden: both are in the table with the alternative spelled out.

### 3. Seven permanent advisory notes, and the fix is not in this ticket

`npm run check` now prints seven `unaccountedCookware` notes forever — a `#fork{}`, three
`#potato masher{}`, two `#immersion blender{}`. All are utensils that convention rule 7 excludes,
all print `ok`, none fails the build. **If someone wants them silent, the fix is a utensil entry in
`NEVER_WASHED` in `src/lib/washing-up.ts`, not 145 longer lines** — and `src/lib/**` is not this
ticket's to edit. Noted, not done.

### 4. This ran on a live branch and two other tickets moved under it

- **T-010-02's `src/components/dials.test.ts`** pinned *"653 sinks nobody wrote down"* as an exact
  assertion. Every line this ticket wrote breaks it. That ticket rewrote the assertion to a shape
  check while this one was mid-flight — nothing was needed from here, and nothing in `src/` was
  touched. **It is worth reading their comment**: an exact-count assertion on a shared branch is a
  tripwire across everybody else's `npm run verify`.
- **T-008-04 wrote 21 new `.cook` files** during this run and broke `npm run verify` twice, once on
  two over-cap operation cells and once on 15 unrecognised operation verbs. Both were theirs, both
  traced file by file, both fixed by them. **Their files were never touched here**, and the pinned
  151-file list is why that is checkable rather than asserted.
- **The Air Fryer column in `findings.md` §4 is therefore a snapshot**, read at commit `37685a5`.
  The plain, Instant Pot and Slow Cooker columns are this ticket's and are stable.

### 5. Smaller notes

- **`docs/gaps/one-pot.md` should eventually carry §2's list** and cannot be edited from here.
  Its 61-recipes-thrown-off-by-hand experiment now has a measured counterpart.
- **The 513 recipes still carrying no line** are the rest of the collection. Nothing about the three
  shelves needs them, and `washing-up.test.ts`'s *"renders nothing for a recipe that never declared
  one"* still has plenty to assert over.
- **The insertion script stayed in the scratchpad.** The reading is the human part; the script only
  moved a decided string into a decided position, and `scripts/` is not this ticket's.
- **`npm run verify:mobile` was not run** — it drives a browser, is not part of `npm run verify`,
  and this ticket adds no markup. The *What you'll wash* panel now renders on 145 more pages than it
  did, though, so the first person to run it will be measuring something new.
