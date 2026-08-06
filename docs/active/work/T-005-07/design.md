# T-005-07 · Design — read it all again

Five jobs, five decisions. Only the first two could reasonably have gone another way; the rest are
method choices, and each is recorded with what was rejected.

---

## 1. The 17 ingredient notes: cut them, and move the shared fact to the shelf

This is the decision the whole ticket turns on, because it is the one that lets the gate close.

**The situation.** `npm run check` reads `operation cell 0 · step body 0 · prose row 0 ·
slack reason 0 · ingredient note 17`. 13 files, 500 characters over, from +1 to +92. Twelve are the
Cantonese old-fire soup shelf; the thirteenth is `stews-and-braises/buri-daikon`. No ticket in
S-005 owned this field, and T-005-01, T-005-05 and T-005-06 each recorded that fact and passed it
on.

### Option A — raise the cap to 172 and justify it

The ticket permits this: *"or raise the cap with the measurement that justifies it."*

**Rejected.** There is no measurement that justifies it. T-005-01 measured the field at **p99 63**
across 4553 notes; 80 is a cap set above the 99th percentile of a field that is otherwise healthy.
Raising it to 172 would move the ceiling above the single worst outlier, which is the exact case
T-005-01's own review names as decoration (*"a cap only the 757-char outlier fails"*). It also
contradicts what the field is for: `voice.md`'s table says an ingredient note is *which one to buy,
and how to cut it*, aim 15, and it names *"What it does for the dish. Where the name comes from"*
as what does not go there. Every one of the 17 is over because it carries exactly those two things.

### Option B — exempt the shelf

**Rejected, and the ticket rejects it: "Do not exempt files to make the check green."** There is no
skip list in `measure()` to reach for; adding one would be building the mechanism the ticket
forbids.

### Option C — cut all 17 under 80 · **chosen**

Each note keeps the two things the field is for and loses the third:

| Keep | Drop |
| --- | --- |
| the romanisation — `naam bak hang`, `mat zou`, `pei daan` — which is how you ask for it | what the ingredient does for the dish |
| how it arrives and how it is cut — *shelled and quartered*, *the sheets torn up* | the Chinese tonic word and its gloss, where the name comes from |

Worked, on the worst one (172 → 79):

> **Before:** `naam bak hang; the sweet and the bitter kind together, about three to one, and the
> pairing is the point — the bitter kind goes in small and always cooked through, never raw`
>
> **After:** `naam bak hang; sweet and bitter together, about three to one, never raw`

*Never raw* stays: apricot kernels are the one note on this shelf where the dropped clause carried
a safety fact, and it survives inside the cap. Nothing else on the list carries one — checked
against T-005-04's table of 36, which names no ingredient note.

**Where the dropped knowledge goes.** The story forbids deleting knowledge without naming a
destination. There are two, and every one of the 17 gets one or the other:

1. **The shared fact goes to the shelf.** Nine of the notes are variations on one idea: a Cantonese
   soup ingredient is chosen for a word — 潤 moistening, 祛濕 damp-clearing, 健脾 spleen-and-stomach,
   理氣, 潤燥. That is shelf talk by the story's own definition, and it is printed nine times on nine
   pages where the reader can compare nothing. **One note on `The Soup Pot · Old-fire soups (老火湯)`**,
   the section T-005-05 already collapsed nineteen footers into. Precedent, mechanism and validator
   all exist.
2. **The rest is not worth keeping, and the reason is named per note** — it is either already said
   elsewhere on the same page (the pot's own step says *washed hard*, *scooped out*), or it is the
   *"what it does for the dish"* the field explicitly excludes.

A per-note disposition table goes in `progress.md`, one row per note: file, ingredient, before,
after, length, and where the dropped clause went. 17 rows.

**Cost:** 13 `.cook` files and `src/data/counters.json`. That is the same pair of surfaces
T-005-05 touched, through the same applier shape.

---

## 2. The gate: flip the flag, and flip it after the notes are clean

`scripts/check-recipes.mjs:67`, `false` → `true`. T-005-01 proved the flip in both directions and
left the comment naming this ticket. Nothing else in that file changes except the two comments that
describe the flag in the present tense (`:60-66` and the closing message at `:236-241`, which today
prints instructions to set the flag that is now set).

**Ordering is a decision, not a detail.** `npm run verify` runs `npm run check` first. Flip the flag
before the notes are cut and every subsequent command in this ticket exits 1 — including the ones
that measure. So: notes first, `check` green at `ingredient note 0`, then the flip, then verify.

**Rejected: flip first to prove it fails.** Tempting as evidence, and unnecessary — the proof that
the flag bites is stronger the other way round. After the flip, deliberately putting one note back
over cap must exit 1, and restoring it must exit 0. That is the same demonstration without leaving
the tree broken between commits.

---

## 3. The measurement: script it, and commit the script

The story's six figures were produced by a method that *"is not scripted anywhere in the
repository"* (T-005-02 `research.md` §8). T-005-02 reconstructed it in prose. T-005-05 and T-005-06
each built their own throwaway dumpers in `.lisa/attempts/`, which is gitignored. Three tickets have
now rebuilt the same measurement and none of it survives.

### Chosen: one committed script, `scripts/measure-pages.mjs`

Reads the built `dist/`, prints the four page-level figures the ticket asks for — visible characters
per page (mean, median, max), the wordiest ten, a count of any string across the collection, and the
per-page number for a named slug. Zero dependencies, reads only `dist/`, writes nothing.

**Why commit it rather than keep it in the attempt directory:**

- `docs/gaps/voice.md` is supposed to be an honest list the *next* pass starts from. `mobile.md`,
  the file it is modelled on, says *"The commands are in `package.json` under `verify:mobile`"* — its
  numbers are re-runnable. A voice gaps file whose numbers can only be re-derived by rewriting a
  parser is a worse artifact.
- There is precedent for a script that reads `dist/`: `scripts/check-overflow.mjs` and
  `scripts/check-touch.mjs` both do.
- `.lisa/` is gitignored and Lisa publishes only the phase `.md` files. T-005-05's review points at
  `rows-after.tsv` *"in this directory"* and that file is not in `docs/active/work/T-005-05/`.
  Anything meant to outlive this attempt has to be committed or be inside an `.md`.

**Not wired into `npm run verify`.** It measures, it does not judge; there is no threshold it could
fail on that `check-recipes.mjs` does not already own. Adding a gate here would be inventing an
acceptance criterion nobody wrote.

**Rejected: no script, prose only.** It is what T-005-02 did and it is why this is the fourth time
the method has been rebuilt.

### The three baseline discrepancies are reported, not smoothed

Research §3 found three places where the ticket's starting figure and the collection's real starting
figure differ. Each is reported as *"ticket says X, the honest baseline is Y, because Z"*, with both
numbers:

- **97 vs 57** for the fifth chrome sentence — two counts of overlapping populations.
- **333 of 397 vs 304 of 397** slack reasons over 200 — the story counted the level word, the cap
  governs the rendered reason.
- **228,000 vs 278,833** discarded body characters — the story counted only steps that become
  operations; `tree.ts:129` discards on both sides of the branch.

Reporting the ticket's number alone would be reporting a number known to be wrong; silently
substituting the corrected one would break the comparison the ticket asked for. Both, with the
reason.

---

## 4. The four regressions: prove them against the pre-story tree, not per-ticket

Each of T-005-05 and T-005-06 proved the tree unchanged **across its own commits**. The ticket asks
for the whole story: *"Same operations, same columns, same rowspans, across all 658 … prove it again
after T-005-06."* Chaining six per-ticket proofs is not the same claim, and one of the six
(T-005-05 generation 1) has no `progress.md`.

**Chosen: one baseline, `1ae1165` (`Complete T-004-06`), the commit before the first S-005 commit.**
A `git worktree` at that ref, `npm run recipes` inside it, and two projections diffed against the
same projections taken from `HEAD`:

| Check | Projection | Expected |
| --- | --- | --- |
| **a. merge tree** | per recipe: root column count, leaf count, header count, footer count, and every operation's `stepIndex:col:row:rowSpan` — `buildTree` + `layout` | empty diff, 658 lines |
| **b. ingredients and timers** | per step: every ingredient as `name\|quantity\|amount.value\|amount.unit`, every timer as `name\|text\|minutes\|attention`, every ref in order, plus per-recipe `cookware` and `ingredientNames` | empty diff |

**The note column is deliberately not in projection (b).** T-005-06's version of this projection
included `note`, and this ticket is about to change 17 of them. Notes are diffed **separately** and
the diff is expected to be exactly 17 rows, all in the 13 named files. Folding them into the main
projection would either hide the note change or fail the whole check for a change made on purpose.

Rejected: diffing `src/generated/recipes.json` whole. It is gitignored and it contains the step
bodies, `slack:` reasons and prose rows that 1449 edits changed on purpose. A whole-file diff answers
a question nobody asked.

**c. Safety facts.** T-005-04 published a table of 36 as *after*-text in
`docs/active/work/T-005-04/progress.md`. Read each of the 36 against the file as it stands **now** —
T-005-05 and T-005-06 both edited files on that list afterwards, so T-005-04's table proves nothing
about the current tree. The check is textual: does each named number (`165°F`, `40°F`, three days,
five days, two hours) still appear in a field that **renders**, and does the sentence around it still
say what it needs to. Any number now living only in a discarded step body is a finding, not a pass.

**d. Nothing moved twice.** Every `notes` entry in `counters.json` (42 after this ticket adds one)
against every prose row and every rendered field of the recipe it names. The failure mode is a
sentence that is on a menu **and** still on the page. Compared on content words, not exact strings,
because both were rewritten — an exact-match test would report clean by construction and prove
nothing.

---

## 5. `docs/gaps/voice.md`: ranked by what it costs a cook

Modelled on `docs/gaps/mobile.md`: a title saying what the site still does badly, when it was
written and off what, how it was measured with the command, then numbered entries each carrying
**What happens** · a measurement · **What a fix takes** · **Mitigation or cure**.

**The ranking axis is the one `mobile.md` uses: what it costs a person, not how hard it is to fix.**
That puts the three known findings in an order the ticket does not dictate:

1. **Fifteen recipes are missing a step you have to do.** A footer that says *rest 10 min before
   cutting* is a cooking instruction sitting outside the table, printed as an aside. This is the only
   finding on the list where a cook can get a worse dinner. T-005-05 §5 names all fifteen with the
   verb and the operation hiding in the prose, plus two timing qualifiers listed separately and eight
   candidates it checked and rejected.
2. **`See how it is written` shows raw cooklang, on all 658 pages.** A reader opens a disclosure
   labelled in plain English and meets `@&(~1)scrubbed bones{}`. Costs no dinner; costs the site's
   whole claim to be legible, on every page, to exactly the curious reader it was built for.
3. **172,003 characters nobody reads, and the question of whether `>> step.N:` still earns its
   place.** Down from 278,833 but not gone, and the mechanism that made them is untouched. Costs a
   cook nothing today, which is why it is third and why it kept growing.

The ticket says these three *"should start it rather than be rediscovered"*. They do — as entries
1–3, in the order above — and anything reading the pages turns up goes after them, ranked the same
way. `voice.md` (the knowledge file) says what a recipe may say; `gaps/voice.md` says where the site
still does not do it.

**Also on the list, from the story's own record rather than rediscovered:** the `slack:` aim of about
120 with 78 lines above it (T-005-04 open concern 3), the nine `forgiving` recipes that now read as
having no give (T-005-04 open concern 1), the 46 prose-row bodies that came out as fragments
(T-005-06), and `src/lib/counters.ts` still not typing the `notes` field two tickets after it started
carrying data (T-005-05 open concern 2). Each is somebody's recorded finding that no ticket owned;
collecting them is the point of the file.

---

## 6. `docs/knowledge/voice.md`: correct it where a ticket decided differently

The criterion is narrow — *"Where a ticket decided something different from what T-005-01 wrote, the
document is corrected and the change is noted."* Four passages qualify, and they are not all the same
kind of thing:

| Passage | What happened | Treatment |
| --- | --- | --- |
| `:54` — *"278,833 characters that nobody has ever read"* | T-005-06 cut it to 172,003 | a live measurement that moved; update the number and date it |
| `:61-94` — the tonkotsu worked example at three lengths | **all three lengths were rewritten.** The 472-char paragraph is 68 chars; `slack:` is a different fact at 128; `step.1:` is 56, not 132 | the example now describes a file that does not exist. Rewrite it as *what was done*, keeping the diagnosis |
| `:133-136` — *"`slack:` is the opposite: almost every declared line is over"* | T-005-04: 0 over, mean 111.7, max 151, and 78 still above the aim | correct the tense and keep the aim |
| `:138-141` — *"Today the checker reports and exits zero … Once the collection is clean it flips to failing"* | this ticket flips it | rewrite to the present |

The tonkotsu passage is the one that matters, and it is a genuine decision-level difference.
`voice.md` prescribed: *"The fix is not to shorten all three. It is to pick one. The 132-character
version is the one that prints, so it is the one that survives."* What three tickets actually built
is **all three shortened and each given a different job** — the row says what the pot can and cannot
do (56), `slack:` says what goes wrong and when (128, which is the different fact `voice.md` asked
for by name), and the body is gone. That is better than the prescription and it is not the
prescription. The document says so.

**Rejected: leave `voice.md` alone because its rules are still right.** The rules are right; three of
its five illustrations quote text that is no longer in the collection, and a page that opens *"Read
this before you write a recipe file"* cannot quote a file that says something else.

---

## 7. What is deliberately not done

- **The fifteen missing operations are not promoted.** Promoting one changes the merge tree, which
  the story forbids and which check (a) is about to prove did not happen. It is finding 1 of the gaps
  file and a story of its own — T-005-05 said so and it is right.
- **The raw cooklang disclosure is not fixed.** Rendering `.cook` source legibly is a component, a
  parser pass and a design decision about what a reader should see. Finding 2, not a commit.
- **No `>> step.N:` override is removed.** Finding 3 asks whether they earn their place; answering it
  means rewriting bodies into labels, which the story excludes by name.
- **No test file is added for `scripts/`.** Four tickets in this story each recorded the same
  decision for the same reason: the scripts are thin drivers over `src/lib/`, which carries all 833
  tests. `measure-pages.mjs` measures and gates nothing, so a test would pin a number that is
  supposed to move.
