# T-005-07 · Review — read it all again

**The gate is closed.** `npm run check` fails the build on any over-cap field, nothing is
exempted, no cap moved in either direction, and all five fields read zero. The last field —
17 ingredient notes on the Cantonese soup shelf, flagged as unowned by T-005-01 and passed on by
T-005-05 and T-005-06 — was cut rather than waived.

**The merge tree is byte-identical from before the story began to now**, across all 658 recipes,
and so is every ingredient, quantity, unit, timer, reference and piece of cookware. Both are
empty diffs against a build of `1ae1165`, not summary statistics.

Six commits. Seven pages read whole. Six measurements reported against their starting figures by
a method that is now a committed script. Two duplications found by check (d) and fixed.

---

## 1. What changed

| Path | Action | Extent | Commit |
| --- | --- | --- | --- |
| 13 `recipes/**/*.cook` | modified | 17 ingredient notes, 500 characters over → 0 | `ee79ac2` |
| `src/data/counters.json` | modified | +1 section note on *The Soup Pot · Old-fire soups* | `ee79ac2` |
| `scripts/check-recipes.mjs` | modified | `CAPS_FAIL_BUILD` `false` → `true`, and two comments | `0637147` |
| `scripts/measure-pages.mjs` | **created** | 163 lines — the story's measurement, scripted | `00f2947`, `dc2284d` |
| `recipes/soups/corn-carrot-pork-bone-soup.cook` | modified | one prose row that repeated its menu note | `7f531fc` |
| `recipes/stews-and-braises/new-england-boiled-dinner-slow-cooker.cook` | modified | same | `7f531fc` |
| `docs/gaps/voice.md` | **created** | seven findings, ranked | `ab98c46` |
| `docs/knowledge/voice.md` | modified | four corrections + a `What changed, and when` section | `ab98c46` |

**Every file is named with why, which the last acceptance criterion asks for.** Nothing else was
touched: no component, no page, no `src/lib/`, no `package.json`, no other script, no other
recipe.

`git status --porcelain` shows no ticket-owned file staged, modified or untracked — only the
untracked story, ticket and work markdown, plus a `.DS_Store` that macOS wrote during the run.
It is not mine to add to `.gitignore` and it is not ticket-owned, so it was left alone;
mentioning it so a reviewer is not surprised by it.

---

## 2. The acceptance criteria, one by one

| Criterion | Result | Evidence |
| --- | --- | --- |
| `npm run check` fails on an over-cap field; nothing exempted | **met** | flip proved both ways after committing — clean → 0, one note put back at 172/80 → 1, restored → 0. `CAPS` unchanged; `measure()` has no skip list |
| the named pages read whole, with a verdict each, including the short one | **met** | `progress.md` §6, seven verdicts, each naming what is on the page. `egg-cream` and `grilled-cheese` shown by line-by-line text diff, not asserted |
| every measurement in §3 reported against its starting figure, same method | **met** | `progress.md` §4, six tables. All "before" figures measured on a build of `1ae1165` with `scripts/measure-pages.mjs` |
| the four regressions each checked and stated, not assumed | **met** | `progress.md` §5. Two empty diffs, 36 of 36 safety facts, and two duplications **found** and fixed |
| `docs/gaps/voice.md` exists, ranked, opening with the three known findings | **met** | seven entries; 1, 3 and 5 are the three named, plus four found by reading |
| `docs/knowledge/voice.md` matches what was built; corrections noted | **met** | four passages corrected, `## What changed, and when` names the ticket behind each |
| `npm run verify` and `npm run verify:mobile` both pass | **met** | verify exit 0 — 658 tables, 833 tests, 682 pages. verify:mobile exit 0 — 2046 page views each scan |
| any file may be edited; the work artifact names each one and why | **met** | §1 above |

---

## 3. The measurement, and the three discrepancies it exposed

Full tables in `progress.md` §4. The headline:

| | before `1ae1165` | after |
| --- | ---: | ---: |
| visible characters a page — mean / median / max | 3487 / 3376 / 6219 | **2823 / 2766 / 4474** |
| the collection | 2,294,301 | **1,857,209** (−437,092) |
| the six chrome sentences | 577 · 531 · 307 · 144 · 97 · 15 | **0 · 0 · 0 · 0 · 0 · 0** |
| `slack:` reasons over 200 | 304 of 397 | **0** |
| prose rows over 120 | 126 headers, 106 footers | **0 and 0** |
| unread step-body characters | 278,833 | **172,003** |
| ingredient notes over 80 | 17 | **0** |
| the wordiest ten | 7 of 10 were the Chinese soup shelf | 2 of 10 |

**Three baseline figures in the ticket do not match the collection, and each is reported with both
numbers rather than smoothed over.** A reviewer should read these three before the rest:

1. **97 vs 57 for the fifth chrome sentence — resolved.** They are two different sentences.
   *"counted as time you are standing over it"* was on **97** pages (this ticket's figure);
   *"counted as needing you only because"* was on **57** (T-005-02's ticket's figure). Both
   measured on the pre-story build, both now zero.
2. **333 vs 304 slack reasons over 200 — two counting conventions.** The story counted the whole
   `>> slack:` value including the level word; the cap governs the rendered reason. Measured on
   the pre-story tree: 330 by the story's convention, 304 by the cap's. Both are now zero and
   both are reported.
3. **228,000 vs 278,833 unread characters — the story's number could not be reproduced.** T-005-01
   found the field is wider than the story described (`tree.ts:129` applies the override on both
   sides of the `isOpStep` branch) and measured 2782 steps / 278,833 characters, which is what
   `progress.md` reports. The story's *1501 steps across 474 recipes, 228,000 characters* does not
   come out of any definition tried; the three closest are recorded so nobody hunts for it again.

---

## 4. The four regressions

**a. The merge tree is unchanged.** `diff cols-before.tsv cols-after.tsv` → **empty, 658 lines**.
Root column count, leaf count, row count, column count, header count, footer count and every
operation's `stepIndex:col:row:rowSpan`, pre-story against now. T-005-05 and T-005-06 each proved
this across their own commits; this is the whole seven-ticket chain in one diff, which is what the
ticket asked for. Re-run after the last recipe commit and still empty.

**b. No ingredient or timer was lost.** `diff data-before.tsv data-after.tsv` → **empty, 4786
lines**. Every ingredient as `name|quantity|amount.value|amount.unit`, every timer as
`name|text|minutes|attention`, every ref in order, plus per-recipe `cookware` and
`ingredientNames`.

Ingredient notes are projected separately **on purpose**, because this ticket changes 17 of them.
That diff is **exactly 17 rows out of 4553**, in exactly the 13 files this ticket names. No note
anywhere else in the collection moved across the whole story.

**c. No safety fact was cut to fit a cap. 36 of 36.** Checked against the collection as it stands
now rather than against T-005-04's table, because T-005-05 and T-005-06 edited files on that list
afterwards. Every number token in T-005-04's after-text is still in the current `slack:` reason,
**and** that reason appears in the visible text of the built page. Nothing is living only in a
discarded body.

**d. Nothing moved twice — two found, both fixed.** This is the check that earned its keep.

| Recipe | On the menu | Still on the page |
| --- | --- | --- |
| `new-england-boiled-dinner-slow-cooker` | *…you are home for the last two hours, adding the vegetables in order.* | *You are home for the last two hours adding things in order.* |
| `corn-carrot-pork-bone-soup` | *…sweet, mild, and made all year round.* | *The child's pot — sweet, mild, made all year…* |

The first is one of the four sentences T-005-03 moved and T-005-05 recorded as *struck from the
row*. It was not struck. Neither ticket was wrong within its own scope — T-005-03 could not edit
`.cook` files, T-005-05 worked from its own row list — but between them the sentence ended up in
both rooms. Fixed in `7f531fc`: each row keeps only what changes how you cook it. Re-run: **43
notes, 0 flagged**, and both projections still empty diffs.

One judgement recorded rather than acted on: `baked-turkey-wings-slow-cooker`'s menu note and row
share a fact but split it correctly — the menu has the comparison, the row has the failure.

---

## 5. `docs/knowledge/voice.md` — what was corrected, and the one that is a real difference

Four passages, all noted in a new `## What changed, and when` section naming the ticket behind
each. The rules — who is reading, the five places words can go, the three house tests, the five
caps — are untouched, because nothing decided differently about those.

Three are numbers that moved: the unread-body count (278,833 → **172,003**), the `slack:`
description (*"almost every declared line is over"* → 0 over, 78 above the aim on purpose), and
the checker (reports → **fails**).

**The fourth is a decision-level difference and it is what the criterion is for.** `voice.md`'s
worked example prescribed: *"The fix is not to shorten all three. It is to pick one. The
132-character version is the one that prints, so it is the one that survives."*

What three tickets actually built on `tonkotsu-broth-instant-pot` is **all three shortened and
each given a different job**:

| | was | is |
| --- | ---: | --- |
| the row | 132 | *The pot does the extraction. It cannot do the emulsion.* (55) |
| `>> slack:` | 250 | *…a broth not boiled hard there stays thin and grey* (115) |
| the step 1 body | 472 | 72, still rendered nowhere |

That is better than the prescription and it is not the prescription, so the document now describes
what was done, keeps the diagnosis word for word, and says plainly that the test is not *how many
times* but *is each one doing a different job*. If a reviewer thinks the original rule should have
been enforced instead, that is a real disagreement and it is one section to rewrite.

---

## 6. Test coverage

**No new vitest file, and it is the fifth time this story has made that call** — T-005-01, -03,
-04, -05 and -06 each recorded the same decision for the same reason: `scripts/` holds thin
drivers, `src/lib/` holds all 833 tests, and there is no harness for a script that reads `dist/`.

What stands in its place, per surface:

| Surface | What proves it |
| --- | --- |
| the 17 notes | `npm run check` re-parses all 658 files; projections (a) and (b) prove nothing else moved; the applier compares the file with every `(...)` blanked out before writing, so nothing outside a parenthetical *can* move |
| `counters.json` | `parse-recipes.mjs` validates cap, non-emptiness and slug membership; the menu pages build |
| the flag | exercised in **both** directions on a real file after the flip; exit codes in `progress.md` §2 |
| `measure-pages.mjs` | **pinned against figures published before it existed** — on a build of `1ae1165` it says mean 3487 (story: 3487), median 3376 (3379), max 6219 on `ching-bo-leung-soup` (6223, same page) |
| the two documents | every number traced to a command; every quoted example grepped for in the file it names — which is how the 128/115 and 68/72 errors in a draft were caught |

`measure-pages.mjs`'s pin is the strongest test added by this ticket and it is worth saying why:
it is not a snapshot of its own output. It reproduces a number a person measured by hand and
published in the story before any of this code was written, on a tree checked out from before the
story began.

### Gaps, stated plainly

- **No check can tell whether a shortened note still says the useful thing.** 17 were judged by
  hand. The mitigation is that the judgement is published as data: `progress.md` §1 is a 17-row
  table with the before, the after, the length and the destination of every dropped clause.
- **No check can tell whether a page reads like it is talking to a cook.** Seven were read. The
  verdicts each name something concrete on the page, which is the only way a reviewer can tell a
  reading from a summary.
- **`measure-pages.mjs` has no unit test** and is not in `npm run verify`. It gates nothing, and a
  test would pin numbers that are supposed to move. Its pin against the pre-story build is
  re-runnable but only while that build can be made.
- **Check (d)'s comparison is a heuristic** — shared four-word runs of content words, plus a
  word-overlap threshold. It found two real duplications and no false ones, but it is a net, not a
  proof, and it lives in no committed script. That is finding 7 in `docs/gaps/voice.md`.

---

## 7. Open concerns

1. **The gate now fails the build for everyone, including work in progress.** That is the point,
   and it is worth saying out loud: from this commit, a writer who drafts a 200-character headnote
   cannot run `npm run verify` until they cut it. The checker names the file, the field, the
   length and the cap, and the message now says what to do — shorten it, or move the cap and say
   what you measured. There is no waiver and adding one would be the move the ticket forbids.

2. **`docs/gaps/voice.md` finding 2 is new and was found by reading, not by a list.** 601 of 619
   pages print two different totals for how long a recipe takes — the author's chip and the
   computed clock — and 181 differ by half an hour or more. T-005-02 was right to delete the
   sentence that explained it; nothing replaced what the sentence did. **This is the most
   actionable item in the file** and it is roughly four lines of component code plus a decision.

3. **Finding 6 is an inconsistency this ticket created and deliberately did not tidy.** Four
   ingredient notes lost their Chinese tonic word to the cap; fifteen notes on the same shelf keep
   theirs because they were already under 80. Which way it should go is a judgement about whether
   that vocabulary is per-ingredient or per-shelf, and guessing is how a shelf ends up
   half-converted twice. `voice.md` leans one way; a person should say.

4. **`src/lib/counters.ts` still does not type the `notes` field.** Three tickets have now written
   data through that gap and 43 notes depend on a runtime validator rather than a type. Recorded
   by T-005-03 and T-005-05 before this; recorded again as finding 7.

5. **Prior tickets' reviews point at files that were never published.** T-005-05's review cites
   `rows-after.tsv` and `decisions-*.tsv` *"in this directory"*; `docs/active/work/T-005-05/` holds
   only the phase markdown. The data is real but lives under `.lisa/`, which is gitignored. This
   ticket assumed nothing from those files — every figure was re-measured — but a reviewer
   following those citations will not find them. It is why `measure-pages.mjs` was committed
   rather than left in the attempt directory.

6. **Nothing here is a blocker.** Both empty diffs, 36 of 36 safety facts, verify and
   verify:mobile green, and no note required losing a fact with nowhere to go.

---

## 8. What a reviewer should look at first

In order, if time is short:

1. **`progress.md` §1, the 17-row note table.** The only prose judgement in this ticket, and the
   only place a fact could have been lost. Each row says what was cut and where it went. The one
   safety fact in the set — bitter apricot kernels, *never raw* — is inside all five replacements.
2. **`docs/gaps/voice.md` findings 1 and 2.** Fifteen recipes are missing a cooking step, and 601
   pages print two different totals. Those are the two things on the site that can still cost
   somebody a dinner, and neither is fixed.
3. **`docs/knowledge/voice.md`, the tonkotsu section.** It is the one place this ticket says a
   previous decision was overruled by what got built. If a reviewer disagrees, it is one section.
4. **`scripts/check-recipes.mjs:60-69`.** The comment above the flag is now a record rather than a
   promise, and it is where the next person will look when the build fails on them.
