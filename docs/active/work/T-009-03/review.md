# T-009-03 — Review

**The numbered form is gone. `scripts/normalise.mjs` no longer reads it, `scripts/check-recipes.mjs`
fails on it with the same label written the new way and the fixer named, and the nine places that
taught it now teach one form. The label dump over all 664 files is byte-identical to the end of
T-009-02, and so is `src/generated/recipes.json`. `npm run verify` exits 0.**

`progress.md` has the command and the output behind every claim here. This is the handoff: what
changed, what is thin, and what a reviewer should push back on.

## What changed

| | | What |
| --- | --: | --- |
| `src/lib/step-labels.ts` | +84 −32 | Refuses `>> step.N:`; publishes `stepLines` and `numbered`; the both-forms check retired |
| `src/lib/step-labels.test.ts` | +115 −47 | 7 tests added, 4 rewritten, 34 passing |
| `scripts/normalise.mjs` | +10 −9 | The numbered reader and the `/^step\.\d+$/` cleanup, both out |
| `scripts/inline-step-labels.mjs` | +60 −77 | Resolves N from the build's scan instead of from `normalise()` |
| `src/lib/tree.ts`, `src/lib/time.ts`, `src/lib/time.test.ts`, `scripts/check-recipes.mjs` | +6 −6 | five prose comments |
| `README.md` | +3 −3 | rule 5 |
| `docs/knowledge/voice.md` | +17 −10 | eight syntax sites, one added note |
| `docs/gaps/README.md` | +52 −2 | the defect closed, the `@&(~N)` decision recorded |

347 insertions, 186 deletions across eleven files.

**`recipes/**` is untouched.** No `.cook` file needed a hand migration, and none got one.

Four commits through `lisa commit-ticket`: `f38cb8d`, `a3596e9`, `b2d280f`, `314a61a`. Nothing
this ticket owns is left staged, modified or untracked.

## Acceptance criteria, against evidence

**1. No `.cook` file uses `>> step.N:`, and the count is zero, shown.**

```
$ grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l
       0
```

**2. `scripts/normalise.mjs` no longer reads or special-cases the `step.N` key.** Both lines gone:
`metadata['step.' + (index + 1)]` from the override, and `/^step\.\d+$/` from the metadata sweep.
The file contains no occurrence of `step.` outside a comment saying the form was removed.

**3. `check-recipes.mjs` fails, with the label written inline and the fixer named. Shown.**

```
$ node scripts/check-recipes.mjs demo.cook
FAIL   demo.cook
       - line 2: >> step.2: is the numbered form, and it is gone — the label goes on the line
         directly above the step it names. Write ">> step: sweat them soft, 8 min" on the line
         above step 2, or run node scripts/inline-step-labels.mjs --write and it will move every
         one of them for you.

1 of 1 file(s) would not draw a table.        exit 1
```

One line in the terminal, wrapped here. It quotes the author's own label back, rewritten, so it
can be copied straight out — not a schematic `>> step: <label>`. It says `--write` and not the
bare command, because the bare command is a dry run and a reader who sees nothing change is worse
off than before.

**4. Any file T-009-02 could not migrate is migrated by hand here, or the form is left with a
reason. Not both, and not silence.** **Neither: the list is empty.** T-009-02 moved 2,771 of 2,771
and its review says it hands over nothing; the grep in criterion 1, run independently at the start
of this ticket, agrees. That is the third branch of the fork and it is stated with the count rather
than passed over.

**5. `README.md` rule 5 teaches only the inline form.** The two sentences that presented
`>> step.7:` as a live alternative — *"it still works, and a file uses one form or the other"* —
are replaced by one saying it is gone, the check refuses it, and what to run.

**6. voice.md teaches only the inline form, and its argument is intact. Diff limited to the
syntax.** Eight sites changed, listed with before-and-after in `progress.md` §4. The whole diff is
`17 +, 10 −`: ten lines carrying the eight substitutions — three of them a paragraph re-wrapped
because one substitution made a line too long — and six lines of a new paragraph.

The re-wrap changed one token and no words:

```
$ diff <(git show HEAD:…/voice.md | sed -n '87,91p' | tr ' ' '\n') \
       <(sed -n '87,92p' …/voice.md | tr ' ' '\n')
38c38,40
< `step.1:`
---
> `>> step:` label
```

(The `label` token is on its own line in the real output; joined here.)

And the argument, checked by counting its numbers rather than by reading for them — 172,003 /
278,833 / 2782 / 637 / 472 / 250 / 132 / 55 / 115 / 72 / 3077 / 304 / 397 / 111 / 151 / 78 / 120,
**every count identical before and after** (`progress.md` §4). The 132-character worked example
works down to 55 exactly as it did; both length tables say 70 / 150 / 120 / 200 / 80; *"throws your
paragraph away — not shortens, throws away"* is untouched apart from the four characters `.N` in
the line above it.

**7. The prose comments no longer describe a syntax that does not exist.** Five sites in the four
named files (`check-recipes.mjs` has two). Comment text only: `git diff --stat` is 6 insertions,
6 deletions, and no executable line moved.

**8. The `step.N` entry is out of *Recorded and not done*, marked closed by removal, and the
`@&(~N)` decision recorded with its reasoning.** A new `## Recorded and closed` section holds
both. The first quotes the original wording, says it was fixed by removing the form rather than
repairing the count, says why repairing it was rejected, and cites T-009-02's Screen A — 0 of 264
candidate files — as the evidence that retiring the behaviour cost nothing. The second records
2,401 `@&(~N)` uses and 373 at `~2` or deeper, left alone because a mis-pointed relative reference
usually stops the tree merging, which is a build error and not a wrong page. Both counts were
re-measured here, not copied from the story, and they match it.

**9. Every operation label on every page unchanged from the end of T-009-02. Same dump, same diff,
pasted.**

```
$ diff before/labels.txt after/labels.txt
$ echo $?
0
```

Empty. 3,466 lines each — one line per step of all 664 files: slug, step, operation-or-prose,
timed minutes, hands-on, unattended, and the label as the cell renders it. Both files are in this
directory.

Corroborated by a witness this ticket did not write: `cmp before/recipes.json
src/generated/recipes.json` → identical, 3,956,883 bytes, over every field the build derives. Not
vacuous — another ticket added 33 lines to `src/data/counters.json` between the two runs and the
output still came out byte for byte the same.

**10. Tests cover: a `step.N` line fails the check, and the inline form still works everywhere.**
Both. Seven new tests: five unit tests on the refusal (the message, that nothing binds by number,
the empty-label wording, one problem per line in line order, and the shapes the line can be typed
in) and two at the checker. The inline half is 23 pre-existing tests that were not touched, plus
664 real files through `npm run check` and 688 pages through `astro build`.

The strongest of them builds both variants from one real recipe: `new-england-clam-chowder.cook`
stripped of its own labels, written back once inline and once numbered. The inline file draws its
table and prints its three labels; the numbered one exits 1 with a refusal per label, each naming
the label back and the way out.

**11. `npm run verify` passes.** Exit 0. `all 664 file(s) draw a table.` · 664 parsed ·
980 tests in 13 files · 688 pages built.

**12. Only the allowed paths are modified.** Eleven files across `scripts/`, `src/`, `README.md`,
`docs/knowledge/voice.md`, `docs/gaps/README.md`, plus this work directory. No `.cook` file. The
one other modified file in the tree, `docs/gaps/air-fryer-and-pot.md`, belongs to T-008-02 running
concurrently on this branch.

## The one thing not in the ticket, and why

**`scripts/inline-step-labels.mjs` was rebuilt.** The ticket does not ask for it; skipping it was
not an option.

That script resolved `step.N` through `normalise()` — *"the script never counts; normalise() says
which step wears which label"* was its stated safety property. Removing the numbered reader makes
`labelOverride` null for every numbered step, so `plan()` would have refused every file, and the
new rejection routed through `stepLabelProblems` would have skipped them before `plan()` ran at
all. **The checker's message names this script. A message that says *run this to fix it*, pointing
at a script that refuses every file, is worse than a message that only says no** — which is the
ticket's own argument, applied to its own instruction.

So the script now resolves N against `readStepLabels().stepLines`, the build's scan of where step
blocks start, published for the purpose. Its private copy of that scan is deleted, which closes
T-009-02's open concern #3: the two implementations that had to agree are one.

**This is weaker than what T-009-02 shipped, and the header comment now says so.** Before:
`normalise()` resolved and `readStepLabels()` verified — two code paths. After: one scan does both,
held against the parser's step count in two places. The count check is what keeps it from being
circular; a scan wrong by a compensating error would get through it. See "Where it is thin" below.

Verified end to end rather than argued: a real recipe with three numbered labels is refused by the
checker, migrated by the fixer, and comes out with each label on the step its number named
(`progress.md` §2). A second run moves nothing.

## Test coverage, and where it is thin

**Covered.** The refusal, at both levels — the pure function and the real checker process. The
message's three jobs, asserted as three separate strings, because it is documentation and a
reworded message that no longer names the fixer should fail a test. The inline form, by 23
untouched tests and by the whole collection. `stepLines`, asserted directly now that it is a
published position list another script inserts against.

**Thin, in order of how much it would matter:**

1. **The fixer has no automated test at all.** It did not before either — T-009-02 argued that the
   per-file verification gate over 643 real files was worth more than a unit test, which was true
   while there were 643 files to run it on. There are now zero, so the argument has expired: what
   stands behind the rebuilt script is two round-trips run by hand, once, whose output is pasted in
   `progress.md` and which nothing will re-run. **This is the biggest gap in the ticket.** It is
   not a blocker — the script writes nothing unless `verify()` passes, so its failure mode is a
   refused file rather than a wrong page — but the next person to touch it has no safety net.
2. **Resolution and verification now share one scan.** `design.md` §2 states it, the script's
   header states it, and it is stated here: a scan that miscounts step blocks by a compensating
   error would resolve a label to the wrong line *and* verify it there. The parser's step count is
   the guard, and it catches every non-compensating error. No file in the collection can reach
   this — 664 files with zero comments, sections, text blocks or multi-line steps.
3. **The refusal paths in `plan()` ship unexercised.** Five of them — empty label, N out of range,
   N twice, a numbered line below the first step, and the new "that step already has a label" —
   have no test and no file that triggers them. They were reachable before only through the
   synthetic files T-009-02 ran by hand.
4. **No test asserts that a numbered key cannot leak onto a page.** Removing the
   `/^step\.\d+$/` sweep from `normalise()` means a `step.1` key now survives into
   `recipe.metadata`. It cannot reach a page, because the file fails `check` and throws in
   `recipes` first — but that is an argument, and the other two things in this ticket that rest on
   arguments got tests.

## Open concerns

1. **`docs/gaps/voice.md` still teaches `step.N`** — five times, at lines 191, 194, 201, 213, 215.
   It is outside this ticket's ownership list and it is a dated measurement page rather than
   instruction, so it was deliberately left. Somebody reading it cold will meet a syntax that does
   not exist. Worth a line in a later ticket; not worth breaking the criteria's file list for.
2. **Two `step.N` mentions survive in the files that were meant to stop teaching it**, both saying
   it is gone: `README.md:163` and `docs/knowledge/voice.md:171`. A strict reading of *"teaches
   only the inline form"* would delete them; the reading taken here is that a reader with an old
   file in front of them needs to be told what happened to it and what to run. If a reviewer
   disagrees, both are one sentence to cut.
3. **`src/lib/step-labels.ts`'s header still describes the numbered form**, in past tense, in the
   paragraph explaining why the inline form exists. Deliberate: that history is the reason the file
   has the shape it has. The ticket's rule — a comment describing a syntax that no longer exists is
   worse than no comment — was read as being about comments that describe it as *current*.
4. **The `>> step.N:` line is still valid cooklang.** The parser hoists it into `raw_metadata.map`
   exactly as before; it is this repo that refuses it. Nothing can be done about that from here,
   and it costs nothing: the file fails before a page exists.
5. **The `@&(~N)` entry is now the only decision-with-reasoning in `docs/gaps/README.md`.** The
   rest of that file is measurements and defects. It is in the right file — that is where the next
   pass looks — but the new section is doing two jobs (one closed, one declined) and may want
   splitting if a third entry ever joins it.
6. **T-009-04 inherits a smaller job than it expects.** It removes `@&(N)`, the absolute
   back-reference, 33 uses in 30 files. The pattern this ticket used — reject in the pure reader,
   route through `stepLabelProblems`, name a fixer in the message — transfers directly, but there
   is no fixer for `@&(N)` yet and this ticket's error-message shape assumes one exists.

## What a reviewer should check first

`diff before/labels.txt after/labels.txt` and `cmp before/recipes.json src/generated/recipes.json`.
Everything else in this ticket is a syntax change and a set of words; those two commands are the
ones that would catch a page whose label moved.

After that, the diff of `docs/knowledge/voice.md`. It is 19 lines and the criterion that matters
most is that its argument survived — the numbers table in `progress.md` §4 says it did, but the
paragraph at lines 52–58 is the one worth reading with your own eyes.
