# T-009-02 — Review

**2,771 of 2,771 `>> step.N:` lines moved onto the line above their step, in all 643 files that
carried one. The label dump — labels, derived durations and hands-on splits, every step of every
recipe — is byte-identical before and after, and so is `src/generated/recipes.json`. Nothing was
skipped, and nothing was corrected.**

The proof is in `progress.md` with the command and the output for each claim. This document is the
handoff: what changed, what is thin, and what T-009-03 inherits.

## What changed

| | | What |
| --- | --- | --- |
| `scripts/inline-step-labels.mjs` | **new**, 332 lines | The codemod, its refusals, and the `--dump` that proves it. |
| `recipes/**/*.cook` | 643 modified | 2,771 insertions, 2,771 deletions. Every one of them a `>> step` line. |

Unchanged, deliberately: everything under `src/`, every other script, `README.md`,
`docs/knowledge/voice.md`, `package.json`. No `npm` script was added — `npm run verify` had to stay
exactly what it was so its output is comparable across the migration.

Two commits through `lisa commit-ticket`:

```
993e2b8  Move a numbered label onto the line above its step      scripts/inline-step-labels.mjs
9350854  Move two thousand seven hundred and seventy-one labels to their steps   643 .cook files
```

`git status` shows nothing this ticket owns staged, modified or untracked.

## How it is safe, in four sentences

The script never counts steps: `normalise()` says which step wears which label — 1-based over every
step block including prose ones, the undocumented behaviour in `docs/gaps/README.md:260`, bugs
included — and that is the only number the codemod ever sees. It does have to find *lines*, because
inserting text is a line-level act and no exported function hands out step positions, so its line
scan is treated as a proposal and never as an answer. Before any file is written, the candidate
output goes back through `readStepLabels()`, the build's own reader, and the file is written only
when the reader puts every label back on the step `normalise()` took it off — plus two more gates:
every line other than a `>> step` line must be byte-identical, and as many labels must come out as
went in. **Guess the position, verify the binding**: a bug in the scan becomes a file left alone
with a printed reason, never a page whose words moved.

## Acceptance criteria, against evidence

**1. A script under `scripts/`, idempotent, per-file summary, `--write` to change anything.**
`scripts/inline-step-labels.mjs`. Dry run prints `move`/`--`/`SKIP` per file and writes nothing
(`git status` clean after it). Second `--write` over the migrated collection: `0 file(s) moved,
0 label(s). 664 file(s) had none.` and `git status --porcelain recipes` → 0 lines. Idempotence
falls out of the form rather than being special-cased — a migrated file has no `>> step.N:` line
left to find.

**2. The label dump is byte-identical before and after. THE primary criterion.**

```
$ diff before/labels.txt after/labels.txt
$ echo $?
0
```

Empty. 3,466 lines each, one per step of all 664 files. Both files are in this directory.

**3. Per-step derived duration and hands-on split in the same dump, also unchanged.** They are
columns 4, 5 and 6 of every line of that same diff — total timed minutes, hands-on minutes,
unattended minutes — summed from the `readTimers()` readings `normalise()` attaches, the same
arithmetic as `src/lib/schedule.ts:153-158`. `src/lib/time.ts` reads the operation label's own words
to classify a timer, so a label that moved a step would move a number here; none did.

Corroborated independently: `cmp before/recipes.json after/recipes.json` → identical, 3,956,883
bytes. That is the build's own artifact over every field it derives, produced by the build rather
than by this ticket's code.

**4. N resolved by calling the build's own reader. Show the call.** Both calls quoted in
`progress.md` §1: `normalise(source, …).steps[n - 1].labelOverride` going in,
`readStepLabels(migrated).labels` coming out, compared key by key on all 643 files. The script
contains no step counter of its own; `stepStarts()` finds line positions and its answer is
checked, not trusted.

**5. At least 2,700 of 2,771 migrated; every unmigrated one listed.** **2,771 of 2,771.** The list
is empty, and that is a measurement rather than an omission — no `step.N` in the collection is out
of range, below 1, duplicated, empty, or written below the first step. T-009-03 inherits nothing
to migrate by hand.

**6. Every label directly above its step, no blank line between, no paragraph structure changed.**
The representative diff of `new-england-clam-chowder.cook` is pasted whole in `progress.md` §4.6.
Collection-wide: `grep -rc '^$'` over all 664 files gives **3,466 before and 3,466 after**. The
codemod removes k non-blank lines from the metadata block and inserts k non-blank lines in the
body; it never touches a blank line.

**7. A list of every label the build gives to a step it does not describe.** Below. It is empty,
and the working is shown.

**8. No `.cook` file changed in any way other than moving these lines.**

```
$ git diff -U0 -- recipes | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' \
    | grep -vE '^[+-]>>[ \t]*step[.: \t]'
$ wc -l
0
```

No output, across all 643 files. Tally: 2,771 `- >> step.N:` and 2,771 `+ >> step:`, nothing else.

**9. `npm run verify` passes.** Exit 0. `all 664 file(s) draw a table.` · 664 recipes parsed ·
935 tests in 12 files · 688 pages built.

**10. Only `recipes/**/*.cook`, one new file under `scripts/`, and this work directory.** Exactly
those. `git show --stat` on both commits.

## The labels that land on a step they do not describe

**None.** Here is how that answer was reached, because a bare "none" on this criterion is worth
nothing.

Two screens, both run over the collection *before* it was touched (and re-run after — same 2,771
labelled steps, same 14 candidates, which is one more small confirmation that nothing moved):

**Screen A — systemic drift.** 264 files contain both a prose step and a `step.N` line. For each,
every label was scored by word overlap against the step the build gives it, and against the step an
*operations-only* numbering would give it. Files fitting the operations-only numbering better:
**0**. So although `step.N` counting prose steps has cost three files a round trip historically, it
has left no shifted file behind in the collection as it stands.

**Screen B — individual mismatch.** Each of the 2,771 labels scored against every step in its own
file; flagged where another step scored ≥ 0.5 and beat its own step by ≥ 0.34. **14 candidates**
(`mismatch-screen.txt`, and the screen itself is `mismatch-screen.mjs`). Every one read against its
file by hand:

| Slug | # | Verdict |
| --- | --- | --- |
| `anzac-biscuits` | 5 | Correct. "stir in" on *Add soda water to melted butter*; the metric matched "stir" against step 2. |
| `flan` | 5 | Correct. "strain over the caramel" on *Pour custard through a fine sieve over caramel*. |
| `thick-toast` | 2 | Correct. "butter on while it is hot" on *Lay butter on hot toast*. |
| `harvest-bowl` | 6 | Correct. "build it warm" on *Spoon rice into four bowls, pile … on top*. |
| `refried-beans-instant-pot` | 4 | Correct. "mash the beans in" on *Add beans … and mash with a potato masher*. |
| `salade-nicoise` | 6 | Correct. "dress the potatoes warm" on *Dress warm potatoes with a third of the vinaigrette*. The prose footer repeats the phrase, which is what the metric caught. |
| `barbecue-dip` | 2 | Correct. "stir in the heat" — the chillies — on *Stir brown sugar, pepper flakes, cayenne into the vinegar base*. Matched against step 4's "off the heat". |
| `smoked-turkey-breast` | 2 | Correct. "brine chilled, 12 hr" on *Submerge … in the fridge and ~brine{12%hr}*. One stemmed word of overlap. |
| `irish-stew` | 4 | Correct. "simmer 40 min more" on *Add potatoes … for ~{40%min}*. |
| `japanese-beef-curry` | 4 | Correct. "simmer 20 min more" on *Add potatoes … for ~{20%min}*. |
| `pot-roast` | 6 | Correct. "braise 300°F 1 hr more" on *Add carrots, potatoes … for ~{60%min}*. |
| `thai-green-curry` | 4 | Correct. "simmer 5 min" on *Add Thai basil … for ~{5%min}*. |
| `creamed-corn` | 2 | Correct. "cut and scrape the cobs" on *Cut corn into a bowl*; step 1 is a prose row saying the same thing at length. |
| `gumbo` | 1 | **Correct, and the one worth a second look.** See below. |

The last four of the "more" family are the metric's systematic blind spot: a label that continues
the previous operation ("simmer 40 min more") shares its vocabulary with the step above, not with
the step it names. Each is right.

`gumbo`'s `step.1` is the one that genuinely reads like another step. Its label — *"Thirty-five
minutes of flour and oil over medium heat, taken to the colour of milk chocolate"* — describes the
roux, which is step 3, while it sits on the prose row *"The roux is made in the gumbo pot, which is
the reason this is one pot at all."* It is nonetheless not a finding, and the file says so itself:
`gumbo` uses the same device again at the other end, labelling its closing prose row *"Filé goes in
off the heat or the whole pot turns stringy"* over the words *"A bowl of gumbo is dinner as it
stands."* Both are an author writing the header and footer rows deliberately, not a number that
slipped. Step 3 already carries its own label. Listed here anyway, because it is the one a reviewer
should disagree with me about if they are going to disagree about any of them.

108 labels land on a **prose** step. That is not a finding either: `peach-cobbler`'s `step.1` is
byte-identical to the prose row it names. It is an author counting prose steps correctly.

**Nothing was corrected. Nothing needed to be.**

## Test coverage, and where it is thin

**No new test file, and no test asserts the script's behaviour.** The criteria limit this ticket to
`recipes/**`, one `scripts/` file and this directory, so `src/lib/*.test.ts` is not mine to extend.
What stands in for a test is stronger on the axis that matters here: the per-file verification gate
compares the build's answer before the edit with the build's answer after it, on real files, 643
times, and it ran on every one of them. A unit test I wrote would have exercised my idea of a
`.cook` file; this exercised the collection.

Said plainly, that leaves three gaps:

1. **The refusal paths ship unexercised by real data.** No file in the collection triggers any of
   them. Four were exercised on synthetic files instead (out-of-range N, duplicate N, empty label,
   a file writing both forms) and the output is in `refusals.txt` — but they are synthetic, they
   were run once by hand, and nothing will re-run them. The two remaining paths (a `step.N` below
   the first step; the scan and the parser disagreeing on the step count) have no synthetic case at
   all and were never executed.
2. **`stepStarts()` duplicates a parser rule, and the corpus tests none of the hard cases.** The
   collection has zero comments, sections, text blocks and multi-line steps across all 664 files —
   measured, in `research.md`. So the scan's handling of those branches is untested by anything.
   The mitigation is structural rather than empirical: the verification gate turns a scan bug into
   a refused file, not a wrong page. That is the mitigation, and it is not coverage, and it is not
   claimed as coverage.
3. **`stepStarts()` and `scanSteps()` in `src/lib/step-labels.ts` are now two copies of one rule.**
   They agreed on all 664 files today. Nothing makes them agree tomorrow except that a divergence
   is loud.

Against those: 643 real pages now render through the inline reader for the first time — T-009-01
shipped it with zero production users — and 935 tests and 688 built pages pass over them.

## Open concerns

1. **The dump is this ticket's own instrument.** `before/labels.txt` and `after/labels.txt` were
   produced by code written in the same hour as the migration, so a reviewer is entitled to ask
   what stops a dump that silently omits the thing that changed. Three answers: the dump prints
   one line for every step of every file whether or not it has a label (3,466 lines for 3,466
   steps, `op` and `prose` both), so an omission would show as a missing line rather than a missing
   field; and the two independent witnesses — `recipes.json` byte-identical, and
   `check-recipes.mjs --labels` byte-identical — were produced by the build and by T-009-01
   respectively, neither of which this ticket wrote. If a reviewer wants one artifact to check,
   check `recipes.json`.
2. **`src/lib/tree.ts`'s doc comment still says `A >> step.N: … line wins over the derived label`,
   and nothing in the collection writes `>> step.N:` any more.** T-009-01 flagged this and left it;
   it is now stale rather than incomplete. Still not fixed here — `src/` is outside this ticket's
   ownership — and it belongs to T-009-03 along with `README.md` and `docs/knowledge/voice.md`,
   which both still teach the numbered form.
3. **`docs/gaps/README.md:260` still records the prose-step counting bug as *Recorded and not
   done*.** It is now unreachable in the collection — no file addresses a step by number — but the
   code path is still there, so the entry is not yet false. Whoever removes `step.N` should retire
   that line in the same commit, and Screen A above (0 files affected) is the evidence that
   retiring it costs nothing.
4. **The 21 files with no label at all.** Untouched, never candidates, and still with no operation
   labels of their own — their cells render the derived text. Not this ticket's business, but the
   number is 21 now rather than the 15 the ticket quotes, because six files have been added since
   it was written.
5. **`--dump` has no consumer but this migration.** It is a proof instrument that now lives in
   `scripts/` forever. It is 25 lines, it writes nothing, and it is the only way to see the clock
   and the labels together — but if T-009-03 or a reviewer would rather it were not there, it is
   one function and one flag to remove.
6. **Line counting in the tail is per-file, not per-label, for skips.** A file with five labels and
   one bad number is reported once, with the one reason, and its other four labels are left on the
   numbered form. That is deliberate — a half-migrated file fails T-009-01's mixed-form check — but
   it means the skip list is a list of files, and T-009-03 will want to expand each into its labels.
   Nothing was skipped, so it costs nothing today.

## What T-009-03 inherits

- **An empty hand-migration list.** Every `step.N` in the collection is gone. The checker can be
  made to reject `^>> step.N:` outright with no file needing a person first.
- **A working fixer.** `node scripts/inline-step-labels.mjs` on a collection that has grown, and it
  will catch the hand-written numbered label the story predicts someone will add out of habit —
  and refuse it loudly if it cannot move it safely.
- **The `--dump` proof, repeatable.** The same three commands prove the next migration.
- **Screen A's result**: no file in the collection depends on `step.N` counting prose steps, so
  retiring the behaviour breaks nothing.
