# T-009-01 — Review

The build now understands a step label written on the line above its step, alongside the numbered
form it already understood. No `.cook` file changed; all 643 files on `>> step.N:` produce the
same page they did before, and the checker's output over the whole collection is identical line
for line.

## What changed

| File | | What |
| --- | --- | --- |
| `src/lib/step-labels.ts` | **new**, 213 lines | `readStepLabels()` — reads the `>> step:` lines off the source, binds each to the step under it, and says what is wrong when one does not bind. Pure: no parser, no filesystem. |
| `src/lib/step-labels.test.ts` | **new**, 27 tests | 20 unit tests of the reader, 7 that run `check-recipes.mjs` for real. |
| `scripts/normalise.mjs` | +30 −2 | Calls the reader, hands the blanked copy to the parser, reads `labels.get(index) ?? metadata['step.' + (index + 1)]`, and returns `stepLabelProblems`. |
| `scripts/parse-recipes.mjs` | +5 −1 | The build throws on those problems, in the loop that already throws on `slack` and `washing-up`. |
| `scripts/check-recipes.mjs` | +5 −1 | The checker prints them; and the "no label" hint now names the inline form instead of `>> step.N:`. |
| `README.md` | +14 −2 | Rule 5 of the authoring contract. |

Unchanged, deliberately: `src/lib/tree.ts`, `src/lib/time.ts`, `src/lib/label.ts`,
`src/lib/layout.ts`, every `.astro` file, every `.cook` file, `docs/knowledge/voice.md`.

## How it works, in four sentences

The parser hoists any mid-file `>> key: value` into `raw_metadata.map`, where two `>> step:`
lines collide and the last one wins, and it keeps no record of where the line sat — so position
is read off the source before parsing. Each label line is blanked **in place** to `--`, which
cooklang treats as a comment: the parse comes out byte-identical to the same file without the
line, and every line number below it still points where the author is looking. A line scan finds
the step blocks, the label binds to the block under it, and `normalise()` holds that scan to the
parser's own step count, so a disagreement fails loudly instead of mislabelling a page. A file
with no `>> step:` line returns before any of that runs.

## Acceptance criteria, against evidence

**1. Both forms render identically, shown on a real recipe.** Better than one recipe: all 664
files, and a copy of the collection with all 643 numbered files rewritten into the inline form,
both run through `check-recipes.mjs --labels`. `cmp labels-numbered.txt labels-inline.txt` — byte
identical, 186,525 bytes each. The rewriter used for that sweep finds step blocks with its own
rule and never imports `step-labels.ts`, so this is not the scanner agreeing with itself. The
same claim is a test (`renders one real recipe identically written either way`), built from
`new-england-clam-chowder.cook` with its own overrides stripped, so it keeps working whichever
form the collection is written in when it runs.

**2. Position comes from the source, and more than one label per file works.**
`readStepLabels()` never reads `raw_metadata`; the label line is gone before the parser sees the
file. `new-england-clam-chowder.cook` carries **six** inline labels in the sweep and all six land
(`labels-inline.txt`). Two unit tests and one checker test cover it directly.

**3. A prep step is labelled correctly, and the numbered form gets that same step wrong.**
`inserted-step-demo.md`, on a real file. A prep step is added at the top of the chowder, which is
the ordinary edit the story is about:

```
Numbered, after a prep step is added at the top      Inline, after the same prep step is added
  [ Render in a Dutch oven ]        ← wrong row        [ Scrub the clams and discard any that stay open ]
  sweat 8 min                       ← wrong row        render in a Dutch oven
  stir in flour 2 min               ← wrong row        sweat 8 min
  …                                                    …
  season with                       ← derived, the     season
                                      label ran out
```

Every numbered label slid one row up, the new prep row wears a label meant for the first
operation, and the file still builds — a confident, plausible, incorrect page. The inline file
labels the prep row with the words written above it and leaves the other six alone.
`prep-step-demo.md` shows the other half on `fudgy-cocoa-brownies.cook`: `>> step.3:`, written by
an author counting the operations the table actually shows, lands on **melt** because two prose
rows are counted ahead of it.

**4. The checker fails, naming file and line, on a dangling label, a label over a blank line, and
a file using both forms.** Run by hand and asserted in tests:

```
FAIL   …/blank-line.cook
       - line 8: >> step: "simmer it down" has a blank line under it — the label binds to the step on the very next line, so close the gap
FAIL   …/dangling.cook
       - line 12: >> step: "and then what" has nothing under it — the label names the step on the next line, so put it directly above one
FAIL   …/mixed.cook
       - line 9: this file writes both >> step: and >> step.2: (line 5) — use one or the other, and the label above its step is the one to use
```

Three more the ticket did not name are refused for the same reason — each is a measured silent
corruption, and each costs nothing today (see *Open concerns*).

**5. Nothing about the numbered form changes, and `npm run verify` output is the same.**
`check-before.txt` vs `check-after.txt`: 664 `ok` lines, identical, no diff. `npm run verify`
exits 0 — 664 files draw a table, 894 tests in 11 files, 665 pages build. The only difference in
the verify output is the test count, and the guarantee under it is structural: a file with no
`>> step:` line returns from `readStepLabels()` before it scans anything, with its own source
object, so none of the new code can run for those 643 files.

**6. `tree.ts`, `time.ts` and the render are unchanged.** They read `labelOverride`, which is the
whole interface, and both forms fill in the same field. Verified by `git show --stat` on the four
commits: no file under `src/` other than the two new ones.

**7. Tests cover the six named cases.** Inline label wins (unit + checker); two in one file (unit
+ checker); a prep step (unit + checker); dangling — end of file, blank line, stacked (unit +
checker); a mixed file (unit + checker); a file with neither renders its derived label (unit +
checker). Plus the scanner's own rules, the blanking, the fast path, and the messages' wording.

**8. README documents the new form as the one to use.** Rule 5, with a worked example, what it
binds to, what happens when it does not, and the numbered form named as older and still working.
It is not called removed.

**9. Files outside `recipes/**` are limited to `scripts/`, `src/` and `README.md`.** They are. No
`.cook` file was edited, and `docs/knowledge/voice.md` was not touched.

## Test coverage, and where it is thin

27 tests, 640 ms. Six of them start a child process, which is most of that.

Covered: every binding rule, every message, the blanking, the fast path (by reference), the block
scan against comments / sections / text blocks / multi-line steps, and the whole pipeline through
the real checker.

**Thin, and worth saying plainly:**

- **No `.cook` file in the collection uses the inline form**, so it ships with zero production
  users. That is the ticket's design — T-009-02 migrates — but it means the confidence here rests
  on the sweep over a copied tree rather than on a built page. The sweep covers all 664 files and
  goes through the same `normalise()` the build uses, so the gap is narrower than it sounds.
- **The block scanner duplicates a parser rule.** The collection exercises none of cooklang's
  harder constructs (0 sections, 0 text blocks, 0 comments, 0 multi-line steps across 664 files),
  so the unit tests are the only thing exercising those branches. The runtime cross-check in
  `normalise()` is what makes a divergence loud rather than silent, and it is not itself covered
  by a test — provoking it needs a file the scanner gets wrong, which is by definition one I do
  not have. It is four lines and it names itself as a bug when it fires.
- **`astro build` renders no inline-labelled page**, since no recipe uses one. The label reaches
  the page through a field the render already draws, unchanged.

## Open concerns

1. **Three failure rules beyond the ticket's three, and a reviewer should agree with them.** A
   label *inside* a step (cooklang splits the step there and shifts every step below it); an
   *indented* `>> step:` line (cooklang does not read it as metadata at all — the words fall into
   the step's own text); and a label with *nothing after the colon* (it would blank the cell).
   Each is measured, each is a silent-corruption path, and none can affect a file that exists
   today. If any is unwanted, it is one branch and one test to remove.
2. **`>> Step:` is accepted as well as `>> step:`.** Cooklang's map is case-sensitive, so a file
   writing `>> Step:` today lands a stray key in `metadata` and labels nothing. Reading it as a
   label is the kinder answer and matches `check-recipes.mjs`'s own case-insensitive check for
   required metadata, but it is a decision, not a fact.
3. **One user-facing string outside README changed.** The checker's "operation cell(s) came out
   with no label" hint said `>> step.N:` and now says `>> step:`. Anyone grepping for the old
   wording will not find it.
4. **`src/lib/tree.ts`'s doc comment still says only `A >> step.N: … line wins over the derived
   label`.** True but no longer complete. Left alone because the ticket asks for that file to be
   unchanged and T-009-03 rewrites this vocabulary anyway; flagged rather than quietly fixed.
5. **The mixed-form check looks for `^>> step.N:` anywhere in the file.** A file that has moved to
   the inline form and left one numbered line behind fails, which is the point — but it means
   T-009-02's codemod has to convert a file all at once, never half.
6. **The working tree carries other tickets' files.** `src/lib/zz-aisle-dump.test.ts` (T-007-05's
   scratch probe) was present and failing when this attempt started and was deleted by its owner
   partway through; `docs/gaps/cha-chaan-teng.md` was modified by another ticket mid-attempt.
   Nothing here touched either. Every commit named exact paths through `lisa commit-ticket`, and
   `git status` shows no file this ticket owns left staged, modified or untracked.

## Commits

```
9faefa3  Read the label that sits above its step        src/lib/step-labels.ts, src/lib/step-labels.test.ts
efe3d54  Bind the label to the step under it            scripts/normalise.mjs, parse-recipes.mjs, check-recipes.mjs
e16bb4e  Run the checker at both forms of the same recipe   src/lib/step-labels.test.ts
a685055  Teach the label that sits above its step        README.md
```

## Handing on

T-009-02 inherits two things it can use directly: the sweep in this work directory is a working
sketch of the codemod (find the `step.N` lines, delete them, re-insert above the Nth step block)
together with the byte-identical proof the story demands of it, and the mixed-form check means a
half-migrated file fails loudly rather than rendering half its labels in the wrong place.
