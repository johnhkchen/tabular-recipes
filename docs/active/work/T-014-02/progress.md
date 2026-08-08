# T-014-02 — Progress

**Twelve applied, one pushed back.** Thirteen commits, eleven files. Every fix has its verifying
command and that command's output below, run after that fix and before the next one started.

| step | fix | state |
| --- | --- | --- |
| 0 | baseline | done |
| 1 | `one-pot.md`'s fifth section | **applied**, `926f37b` |
| 2 | `cha-chaan-teng.md`'s removed mechanism | **applied**, `2fd6e63` |
| 3 | `cha-chaan-teng.md`'s tea ratio | **applied**, `b0e9118` |
| 4 | `voice.md`'s `>> step.N:` | **applied**, `691b99b` |
| 5 | `air-fryer-and-pot.md`'s heading | **applied**, `d9f2a7e` |
| 6 | `scaling.md`'s air fryer claim | **applied**, `2f2743d` |
| 7 | `occasions.md`'s `0 capacities` | **applied**, `5a90ef4` |
| 8 | the aisle coverage figure | **applied**, `6e373f5` |
| 9 | the build's third refusal | **applied**, `98aa1b7` |
| 10 | `measure-pages.mjs`'s dead slug | **applied**, `6f10dbe` |
| 11 | `parse-recipes.mjs` and `capacityProblem` | **applied**, `0d16e53` |
| 12 | `'airfry'` in `UNATTENDED` | **applied**, `3c0ca89` |
| — | **`## Build state`** | **pushed back**, reason below |
| 13 | the two undone bands, and the pushback recorded | done, `252e6b9` |
| 14 | the sweep | done |

Thirteen commits, all through `lisa commit-ticket` with exact `--include` paths. The ordinary index
was never used: no `git add`, no `git add -A`, no `git commit`.

---

## Step 0 — baseline

```
$ git status --porcelain -- recipes/ src/ scripts/ docs/gaps/ docs/knowledge/ README.md
                                                              (empty)
$ npm run verify > verify-before.txt 2>&1 ; echo "VERIFY_RC=$?"
VERIFY_RC=0
all 685 file(s) draw a table.
parsed 685 recipe(s) in 27 categories -> src/generated/recipes.json
 Test Files  21 passed (21)      Tests  1229 passed (1229)
[build] 710 page(s) built
22 counter(s): 930 slug(s) listed, 930 printed.
$ node scripts/menu-sections.mjs > ms-before.txt              # 177 lines
$ node scripts/measure-pages.mjs | sed -n '4p'
  max     4480  biryani
```

`ms-before.txt` is the floor every gap-page edit is diffed against. It was advanced once, after
step 1, which is the only step licensed to move it.

---

## The pushback, first, because it is the result the ticket cares most about

**`## Build state` was banded mechanical and is not.** It fails test 1.

- **The file the finding names is wrong.** It says `README.md`. The block is in
  `docs/gaps/README.md:29-40`; the root `README.md` carries no build figures at all. The finding's
  own justification — *"S-014 is the pass that publishes, and a stale front-door number is the first
  thing a reader meets"* — is about the front door, and this is not it.
- **The staleness is already disclosed twice on the same page**, at line 37 (*"Measured after
  T-007-05, with the whole of S-007 in"*) and line 76 (*"the `Build state` figures above, which are
  S-007's, are stale by a good deal"*).
- **The current figures are already on the page**, forty lines below, correctly dated to 7 August
  2026 at 685 recipes.
- **Lines 37-40 are not figures.** They are S-007's arithmetic — *658 at the start, minus the
  sixteen 老火湯, plus the eight and the fourteen* — true of S-007 and deleted by a refresh.

So one reasonable person refreshes the block; another keeps the record. That is what test 1 asks
about and the answer is no. Recorded in three places: this artifact,
`docs/gaps/what-the-season-left.md` (moved into *needs an argument* under its own heading, with the
reason), and `docs/gaps/README.md`'s *needs an argument* table.

**Nothing about the block was edited.** `grep -c '664 files draw a table' docs/gaps/README.md` → `1`.

---

## Step 1 — `docs/gaps/one-pot.md`, the fifth section

The title and its five members copied out of `src/data/counters.json` verbatim, in its order.

```
$ node scripts/menu-sections.mjs | grep -A5 'One Pot'
  ok   One Pot: 5 sections, 73/73 placed
         Braises and stews (36)
         Skillet dinners (12)
         Rice and grains that cook in (11)
         Soups that are the whole meal (9)
         Quick soups that go with dinner (5)

$ node scripts/menu-sections.mjs > ms-after.txt && diff ms-before.txt ms-after.txt
147c147
<   ok   One Pot: 4 sections, 68/73 placed
>   ok   One Pot: 5 sections, 73/73 placed
152c152
<          unplaced -> century-egg-amaranth-soup, crucian-carp-tofu-soup, mustard-greens-tofu-soup,
                       seaweed-egg-drop-soup, tomato-potato-beef-soup
>          Quick soups that go with dinner (5)
177c177
< 1 counter(s) need a look.
> every counter parsed cleanly.
```

**The third hunk was not expected and is the result.** The dry run's trailer went from *"1
counter(s) need a look"* to *"every counter parsed cleanly"* — the last drift on the board, carried
since S-007 and named as such at `docs/gaps/README.md:207`, is closed. No other counter moved.

`ms-before.txt` advanced to this output for every later step.

---

## Step 2 — `docs/gaps/cha-chaan-teng.md`, the removed mechanism

Three sites: the `## What it has` preamble, the borrow preamble, and five `What happened` cells.

```
$ grep -c 'listed, not rendering' docs/gaps/cha-chaan-teng.md      0
$ grep -c 'prints 22' docs/gaps/cha-chaan-teng.md                  0
$ grep -o '<p class="count">[^<]*' dist/menu/cha-chaan-teng/index.html
<p class="count">27 recipes
$ node scripts/menu-sections.mjs | diff ms-before.txt -            DIFF_RC=0
$ grep -c 'shelve as is' docs/gaps/cha-chaan-teng.md               7
$ grep -c 'That is five \*shelve as is\*, two \*write a new file\*, and one refusal'  1
```

The last two are the *not touched* checks: the seven verdicts and the section's closing argument are
where they were. What changed is a status column and two descriptions of code — `menuFor()` no
longer drops silently, it **throws with the slug named** (T-011-05), and the five were shelved by
T-007-06.

---

## Step 3 — `docs/gaps/cha-chaan-teng.md:127`, the tea ratio

```
$ grep -c 'No source states a ratio' docs/gaps/cha-chaan-teng.md   0
$ grep -c '自由時報' docs/gaps/cha-chaan-teng.md                     2
$ node scripts/menu-sections.mjs | diff ms-before.txt -            DIFF_RC=0
```

The correction was decided two stories ago and never applied: `T-007-03/design.md:106` records
自由時報 giving 幼茶 65 % · 粗茶 25 % · 中茶 10 %, and `T-007-03/plan.md:151` hands it to T-007-05
in as many words. The shipped file agrees:

```
$ grep -n 'blend' recipes/drinks/hong-kong-milk-tea.cook
13: … @Ceylon tea bags{6}(cut open; the fine cut, 65% of the blend) …
    @loose-leaf Ceylon black tea{7%g}(the coarse 35%, and the aroma) …
```

The bullet's standing point — no standard, and a file that invents its own is inventing the recipe —
is kept. `## Sources` already cited 自由時報 and already said ACTHK states no ratio; neither moved.

---

## Step 4 — `docs/gaps/voice.md`, a dated note

The finding's own instruction was *a dated note saying the syntax is gone — **not** a rewrite of the
measurements*, and that is what was done.

```
$ grep -rn '^>> *step\.' recipes --include='*.cook' | wc -l        0
$ grep -c 'T-009-03' docs/gaps/voice.md                            1
$ grep -c '172,003' docs/gaps/voice.md                             3   (unchanged)
$ grep -c '2782 in 637 recipes' docs/gaps/voice.md                 1   (unchanged)
$ grep -c 'came down by 38%' docs/gaps/voice.md                    1   (unchanged)
$ node scripts/menu-sections.mjs | diff ms-before.txt -            DIFF_RC=0
```

The note's claim was checked against the checker rather than asserted:

```
$ node scripts/check-recipes.mjs <a probe carrying '>> step.1:'>
FAIL   probe-stepn.cook
       - line 4: >> step.1: is the numbered form, and it is gone — the label goes on the line
         directly above the step it names. Write ">> step: x" on the line above step 1, or run
         node scripts/inline-step-labels.mjs --write and it will move every one of them for you.
```

The probe lived in the scratchpad, never in `recipes/`.

---

## Step 5 — `docs/gaps/air-fryer-and-pot.md`, the heading

```
$ grep -rn 'table cannot hold' docs/gaps/air-fryer-and-pot.md docs/gaps/README.md
docs/gaps/air-fryer-and-pot.md:856:## What a table cannot hold      (no cross-reference to break)

$ grep -l '^## What it could not stock' docs/gaps/*.md | wc -l     23
$ grep -c 'What a table cannot hold' docs/gaps/air-fryer-and-pot.md 0
$ awk '/^## What it could not stock/{p=1;next} p&&/^## /{exit} p' … | grep -c '^- '   8
$ node scripts/menu-sections.mjs | diff ms-before.txt -            DIFF_RC=0
```

**23, not the 22 the finding predicted, and the count was already 22 before the edit.** The 22 were
21 counter pages plus `filter.md`, which borrows the heading deliberately and is not a counter;
`soup-pot.md` is retired and uses a third wording. The finding's arithmetic was wrong; the finding
was not. Its eight entries are now reachable by the derivation for the first time.

**The README's stated 158 was not changed** — see *What was deliberately not done* below.

---

## Step 6 — `docs/knowledge/scaling.md`, the air fryer claim

Two sites, not the one the finding named.

```
$ grep -c 'no air fryer recipe' docs/knowledge/scaling.md          0
$ grep -ci 'There is no air fryer' docs/knowledge/scaling.md       0
$ node -e "…filter(r=>r.kit==='Air Fryer').length"                 13
$ ls recipes/*/air-fryer-chicken-wings.cook
recipes/fried-and-crispy/air-fryer-chicken-wings.cook
$ grep -c 'elapsed = 66 min\|a basket load ≈ 20 min\|the oil bath costs'  2   (untouched)
$ grep -c '664' docs/knowledge/scaling.md                          5   (untouched)
```

**A first attempt returned 1, not 0**, because the replacement text quoted the old sentence back at
the reader. That is a legitimate way to write a correction and it makes the finding's own verify
command unable to return its stated output, so the wording was changed until the command holds. The
verify command is the contract.

§7's illustration — its figures, its pole, its arithmetic — was not touched. Rewriting it from
`air-fryer-chicken-wings` is `docs/gaps/README.md`'s *needs an argument* row and stays there.

---

## Step 7 — `docs/knowledge/occasions.md`, `0 capacities declared`

```
$ node -e "…"                        capacity declared: 46 | silent: 639
$ grep -c '0 capacities declared'                                  0
$ grep -c 'capacity` 0'                                            0
$ grep -c 'no file declares one yet'                               0
$ grep -c 'all 685 files answer as though nothing binds'           0
$ grep -n '46 capacities declared|46 files of 685 declare one|639 of 685|capacity` 46'
213: | … | src/lib/scaling.ts | **46 capacities declared** |
217: … and **46 files of 685 declare one**,
393: … the annotation pass has barely started, so 639 of 685 files still answer as though nothing binds
539: 416, `washing-up` 177, `capacity` 46, and the hands-on figure could speak for 269.
$ git show --stat HEAD    docs/knowledge/occasions.md | 12 ++++++------
```

Four lines at three sites, six insertions and six deletions in a 500-line file. Line 217's sentence
had to move with the count — *"no file declares one yet, so every scaling answer in this collection
today is the no-vessel branch"* is false at 46 — and it moved to what is true, not to a different
argument. **The argument stands**: two of those rows are still the whole difficulty at 46 of 685.
The 43-file population sentence, §3.5, §3.6 and every rate were not touched.

---

## Step 8 — `docs/gaps/README.md`, the aisle coverage figure

```
$ npx vitest run src/lib/shopping.test.ts --reporter=verbose 2>&1 | grep -A1 'have no aisle'
4/1086 ingredients have no aisle:
  leftover pizza (1), flat skewers (1), oak or hickory wood (1), metal skewers (1)
$ grep -c '3 of 1074' docs/gaps/README.md                          0
$ grep -c '^## Build state' docs/gaps/README.md                    1   (the pushback, untouched)
$ grep -c '664 files draw a table' docs/gaps/README.md             1   (the pushback, untouched)
$ node scripts/menu-sections.mjs | diff ms-before.txt -            DIFF_RC=0
```

The bullet's heading — *"Three ingredient names are not food"* — is **still true** and was kept. The
fourth name is `leftover pizza`, which is food; it has no aisle for a different reason, which the
corrected clause now says. Only the figure moved.

---

## Step 9 — `README.md`, the third refusal

The claim was demonstrated before it was written down, with a probe in the scratchpad:

```
$ node scripts/check-recipes.mjs <probe writing @&(~3) with one step above it>
FAIL   probe-ref.cook
       - step 2 writes @&(~3), which points at no step — cooklang read it as an ingredient
         instead of a reference, so the table would draw a row that is not an ingredient. …
```

The bullet is written in the checker's own terms. Then the finding's own verify:

```
$ sed -n '/Things a table cannot show/,/^To find out/p' README.md    → three bullets
$ npm run verify > v9.txt 2>&1 ; echo "VERIFY_RC=$?"
VERIFY_RC=0
all 685 file(s) draw a table.  ·  1229 passed (1229) in 21  ·  710 page(s)  ·  930/930
```

Unchanged from step 0, which is what *"the bullet is present and `npm run verify` is unchanged"*
asks for.

---

## Step 10 — `scripts/measure-pages.mjs:6`

The defect shown first:

```
$ node scripts/measure-pages.mjs --slug ching-bo-leung-soup
no page for ching-bo-leung-soup in dist                            RC=2
```

The replacement is **derived, not chosen** — the script's own report of today's wordiest page, which
is the role the dead slug played when the line was written:

```
$ node scripts/measure-pages.mjs | sed -n '4p'
  max     4480  biryani
$ node scripts/measure-pages.mjs --slug biryani
4480	biryani                                                     RC=0
$ grep -n 'ching-bo-leung-soup' scripts/measure-pages.mjs
30: *     max                   6219  (story: 6223, ching-bo-leung-soup, and it is the same page)
```

Line 30 is a dated baseline note about a build of commit `1ae1165` and stays true of it. Line 6 only.

---

## Step 11 — `scripts/parse-recipes.mjs`, `capacityProblem`

**The hole was demonstrated before the fix, with the same probe, so the after-state is a
demonstration rather than an assertion.**

A first probe failed on a different guard (*"1 recipe(s) sit at no counter"*), which would have
proved nothing, so it was given a `>> counters:` line until `capacityProblem` was the only thing
that could fail it.

```
BEFORE
$ npm run recipes > probe-before.txt 2>&1 ; echo "RECIPES_RC=$?"
RECIPES_RC=0
parsed 686 recipe(s) in 28 categories -> src/generated/recipes.json
$ node scripts/check-recipes.mjs recipes/soups/zz-t01402-probe.cook
       - capacity 2 names no vessel — "2" alone tells a reader with a different pan nothing at all.

AFTER
$ npm run recipes > probe-after.txt 2>&1 ; echo "RECIPES_RC=$?"
RECIPES_RC=1
Error: recipes/soups/zz-t01402-probe.cook: capacity 2 names no vessel — …
    at scripts/parse-recipes.mjs:61:24
```

The build parsed a file the checker fails, and now it does not.

```
$ rm recipes/soups/zz-t01402-probe.cook && rmdir recipes/soups
$ npm run recipes > probe-clean.txt 2>&1 ; echo "RECIPES_RC=$?"
RECIPES_RC=0
parsed 685 recipe(s) in 27 categories
$ git status --porcelain -- recipes/ src/data/                     (empty)
```

**One exit code in this step was read from a pipeline and was therefore worthless** — `npm run
recipes 2>&1 | tail -1 ; echo $?` reports `tail`'s status, which is the exact failure the ticket
warns about. It was caught and re-run as above, capturing the status from the command.

---

## Step 12 — `src/lib/time.ts`, and the dump-and-diff

T-009-02's technique, run in the repository rather than on a scratch copy, because this ticket is
allowed to make the change T-014-01 was not.

```
$ node dump.mjs > sched-before.txt                     685 lines: slug + 6 figures
# edit: 'airfry' added to UNATTENDED, with the comment explaining why
$ npm run recipes                                      parsed 685
$ node dump.mjs > sched-after.txt                      685 lines
$ diff sched-before.txt sched-after.txt ; echo "DIFF_RC=$?"
DIFF_RC=0
```

**Empty.** The six figures are `totalMinutes`, `handsOnMinutes`, `unattendedMinutes`,
`assumedHandsOnMinutes`, `untimedCount` and `longestHandsOnMinutes` — the same six T-014-01 dumped,
so the two measurements are comparable. The dump script lived in the scratchpad; nothing was added
to `scripts/`.

**Operation labels cannot move, and this is structural rather than measured.** The label path is
`check-recipes.mjs` → `label.ts` → `tree.ts` → `layout.ts`, and none of them imports `time.ts` —
`tree.ts` imports `keeps`, `scaling`, `slack` and `washing-up` as **types only**. Shown anyway on
two basket recipes:

```
$ node scripts/check-recipes.mjs --labels recipes/fried-and-crispy/air-fryer-chicken-wings.cook
  ok   6 rows x 5 cols
       pat dry, then toss in the bowl you will serve from
         roast in the basket 200°C (400°F), 18–24 min, one layer
           turn at halfway — skin gone matt and pebbled, not glossy
             toss hot in the same bowl
```

The word is reachable and does not over-reach:

```
air fry  -> {"attention":"unattended","source":"name"}
air-fry  -> {"attention":"unattended","source":"name"}
airfry   -> {"attention":"unattended","source":"name"}
fry      -> {"attention":"hands-on","source":"name"}
$ npm run verify ; VERIFY_RC=0   ·  685 · 1229/21 · 710 · 930/930
```

---

## Step 13 — the two undone bands, read row by row

**Not a fix.** The acceptance criterion asks that both bands carry finding, evidence, source ticket
and reason.

| band | rows | finding | source | reason | evidence |
| --- | --: | --- | --- | --- | --- |
| needs an argument | 25 | 25/25 | 25/25, every one naming a ticket and mostly a section | 24/25 | by pointer |
| needs food | 4 | 4/4 | 4/4 | **0/4 — the column did not exist** | by pointer |

Two gaps, both closed additively; no existing row was reworded.

- **The *needs food* table had two columns.** Its reason was carried once for the whole band
  (*"The collection has to grow before these can be acted on"*), which is true but does not say why
  *this* row waits. A `why it was not done` column was added, four cells, each drawn from
  `what-the-season-left.md` rather than invented.
- **One *needs an argument* reason was the bare word "Same"**, a back-reference to the row above it
  that a reader scanning to it would not resolve. Made explicit.

Evidence was spot-checked rather than assumed — every row's finding was located on
`what-the-season-left.md`, including the four *needs food* entries and the bar-1 row, so the
preamble's *"which carries the evidence for every line below"* holds.

And the pushback recorded in both places, plus the two corrections to the band's own text:

```
$ awk '/^## Mechanical/{p=1;next} /^## Needs an argument/{p=0} p' … | grep -c '\*Verify:\*'   12
$ awk '… same range …' | grep -c '\*Source:\*'                                                12
$ awk '/^## Needs an argument/{p=1} /^## Needs food/{p=0} p' … | grep -c 'Build state'          1
$ grep -c 'T-014-02 pushed it back' docs/gaps/README.md                                         1
$ node scripts/menu-sections.mjs | diff ms-before.txt -                             DIFF_RC=0
```

**Nothing from either band was applied.**

---

## Step 14 — the sweep

```
$ npm run verify > verify-after.txt 2>&1 ; echo "VERIFY_RC=$?"
VERIFY_RC=0
$ diff <(headline figures from verify-before.txt) <(same from verify-after.txt)
IDENTICAL
```

685 files draw a table · 685 parsed in 27 categories · 1,229 tests in 21 files · 710 pages ·
22 counters, 930 listed and 930 printed — identical to step 0 after twelve fixes.

`npm run verify:mobile` was run **alone, with nothing else building in this tree**, checked with
`pgrep` first. The two `astro dev` processes found belong to a different repository
(`boilerplate-demo`) and touch neither this tree nor its `dist/`.

```
$ npm run verify:mobile > mobile.txt 2>&1 ; echo "MOBILE_RC=$?"
2130 page views at 375px, 390px, 768px — nothing scrolls sideways.
```

**A first run was killed by a ten-minute command timeout, not by a failure** — the overflow sweep
had already passed and the touch sweep was mid-way through its 2,130 pages. It was re-run to
completion in the background rather than reported from the partial output.

---

## What was deliberately not done

- **The `## Build state` block.** The pushback, at the top of this file.
- **`docs/gaps/README.md`'s stated 158 *items a table cannot express*.** Finding 11's verify notes
  the derived count moves to 163 across 22 pages. The rename was applied; the 158 was not touched.
  That file says in as many words that these figures are **carried forward** and that *"it would be
  dishonest to print numbers as though somebody had"* re-derived them — so replacing 158 with a
  derivation asserts that the derivation is the right way to count, which is a claim rather than a
  correction. Recorded on the page.
- **§7 of `scaling.md`, rewritten from a real file.** Its own §9 asks for it and
  `docs/gaps/README.md` bands it *needs an argument*. Only the false clauses moved.
- **The five findings T-014-01 pushed out of the band before the page was written**
  (`birista`, `lengua`, `batata-harra`, the category tree, `scaling.md` §2). Re-read, agreed with,
  not re-litigated. Each fails test 3 on its face.
- **No `.cook` file, no `src/data/`, no test.** No recipe changed shelf, servings, capacity,
  washing-up count or slack level. `git status --porcelain -- recipes/ src/data/` is empty.
- **`scripts/menu-sections.mjs --write` was never run.** It rewrites every counter and drops twelve
  hand-written `notes` blocks; the page was edited towards the JSON by hand instead.
