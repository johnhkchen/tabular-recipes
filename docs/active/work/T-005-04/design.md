# T-005-04 · Design — say the one thing that will actually go wrong

Research found that this field is not verbose, it is **plural**: 374 of 397 reasons carry two or
three separate warnings, and one clause of this collection already averages 108 characters. So
the design question is not "how do we shorten sentences" but **"which warning survives, and who
decides."** Everything below follows from that.

---

## 1. What gets edited: the aim, not the cap

Three candidate trigger lines.

| Option | Files touched | After: mean | After: max | Verdict |
| --- | ---: | ---: | ---: | --- |
| **A** Edit only what is over the cap (>200) | 304 | ~178 | 200 | rejected |
| **B** Edit everything over the aim (>120) | **373** | ~120 | ≤200 | **chosen** |
| **C** Edit all 397 | 397 | ~118 | ≤200 | rejected |

**A is rejected because the cap is a ceiling, not a target.** `voice.md:118` says so in those
words. Editing to 200 leaves the mean near 178 and leaves the 39 files in the 175–199 band as
untouched three-warning chains — the exact shape the story is removing — for the sole reason
that they were written slightly shorter than their neighbours. It would satisfy the acceptance
criterion and miss the story.

**C is rejected because the 24 lines already at or under 120 are the target.** They are what the
ticket and `voice.md` quote as correct. `rice-beans-and-grains/fish-taco-bowl` (92) is the
ticket's own worked example of the right shape; `rice-beans-and-grains/mushroom-risotto` (120)
is `voice.md`'s. Rewriting them would be churn against the model. All 24 are single-clause,
single-failure lines. They are left byte-for-byte alone, and the after-report will show them
unchanged.

**B is the line where the field stops being one breath.** 373 files.

---

## 2. How the surviving warning is chosen: by hand, per file

The mechanical option is real and it is measurable, so it is worth rejecting explicitly.

**Rejected: keep clause 1, drop the rest.** Mean 107.9, only 4 over 200, one script, an hour of
work. It fails on the shape of the `forgiving` field: on **64 of 117 forgiving lines clause 1
names no failure at all** (research §4). It is the slack half — *"three hours or four is the
same beef"*. Truncating there produces 64 recipes whose entire slack line restates its own
level, which the acceptance criteria name as a failure and which the ticket names as the thing
this is explicitly not ("this is not 'cut the reason to fit'").

**Rejected: keep whichever clause matches failure vocabulary.** A regex for
`cannot|never|burns|splits|no way back` selects a clause on 90%+ of lines. But it cannot rank
two genuine failures against each other, and ranking is the whole job — the ticket's instruction
is *"keep the one with no give"*, and no lexical signal distinguishes *the caramel burns in ten
seconds* from *the chill can be two days* when both clauses contain failure words. It also
cannot see that a clause is load-bearing for safety. Worse: it would emit 373 sentences that no
person read, into a field whose entire premise is that a human wrote it (`slack.ts:10-13`,
"IT IS AUTHORED, NEVER DERIVED").

**Chosen: 373 hand-authored replacements, applied by a deterministic script.** The judgement is
human; the edit is mechanical. The split matters — see §4.

---

## 3. The five rules the rewriting follows

Applied to every one of the 373, in this order.

1. **One failure.** Where a line chains two or three, keep the one with no give — the one where
   the dish is actually lost, not merely worse. The others go, and §5 says what happens to them.
2. **Name when it happens.** A failure without its trigger is not actionable. Keep the number,
   the temperature, the moment: *"a minute past that"*, *"past 82°C"*, *"once the lid goes on"*.
   The ticket's target line does this — *"cod is done as the flakes part, and a minute past that
   it dries out"* — and it is why 103 characters is enough.
3. **Cut the recipe justifying itself.** *"the brine is 5% because that is the strength that
   carries three weeks"* is the recipe defending its own numbers to a reader who did not ask.
   143 lines contain `because`; most of those instances go. What survives is the failure the
   `because` was propping up.
4. **Cut shelf talk.** *"the most patient thing on the shelf"*, *"the one file on the shelf
   where…"* — 9 files. S-005's second settled decision sends comparisons to the counter menu
   (T-005-03). Nothing on a recipe page compares it to its shelf-mates.
5. **The level word is untouched, always.** Not one of the 397 changes. Where shortening makes a
   rating look wrong, §6 says what happens instead.

Two constraints ride along: keep the author's diction (this is a cut, not a re-voicing — the
collection has one voice and it is mostly good at clause length), and stay at or above the
5-word floor `slack.test.ts` enforces (never close: the shortest planned line is ~90
characters).

### What the shape looks like

The ticket's 306-character example, run through the rules:

> **before** *the brine is 5% because that is the strength that carries three weeks without the
> cucumbers going soft, and a weak brine or a warm room gives mush and off smells rather than
> sour pickles; skim the white film and keep everything under the surface, because what sits in
> the air is what spoils*

Rule 3 cuts the 5% justification. Rules 1 and 2 rank the three remaining failures: mush from a
weak brine is recoverable-ish and is a texture failure; what sits above the brine goes mouldy
and ends the jar, and that is spoilage. Keep the second.

> **after** *anything that sits above the brine goes mouldy and takes the jar with it, so skim
> the film and keep everything under the surface* — 128

---

## 4. How the edit is applied

A two-file mechanism, both living in the attempt work directory:

- **`slack-after.tsv`** — one row per rewritten file: repository-relative path, level, new
  reason. Hand-authored. This is the deliverable; it is reviewable as a diff of prose without
  reading 373 `.cook` files.
- **`apply-slack.mjs`** — reads that table and rewrites exactly one line per file.

The script refuses rather than guesses. For each row it asserts: the file exists; it contains
exactly one line matching `/^>>\s*slack\s*:/m`; the level parsed out of the existing line equals
the level in the table (rule 5, enforced not trusted); the new reason is non-empty, ≥5 words and
≤200 characters. Any failure aborts the whole run before writing anything. It writes the line
back in the collection's single existing form, `>> slack: <level> — <reason>`, and touches no
other byte of the file.

**Rejected: 373 Edit calls.** Same result, no assertions, no re-runnability, and 373 chances to
mistype a neighbouring line in a file this ticket does not own.

Verification is by the same two instruments the ticket names: `node dump-slack.mjs stats` for
the before/after distribution, and `npm run check` for the cap count from the checker's own
code path, so the reported number is the checker's and not mine.

---

## 5. Where the dropped warnings go

The ticket asks for each load-bearing drop to be relocated *"an ingredient note, a step label"*
— and the scope section forbids editing anything but the `>> slack:` line, because T-005-05 owns
prose rows and T-005-06 owns step bodies (and ingredient notes live inside step bodies).

**These cannot both be satisfied, and scope wins.** Relocating a warning into a step body would
put an edit into a line another ticket is about to rewrite from a list that will not contain it
— which is precisely the silent-overwrite the story's chain exists to prevent. So no file is
edited outside its slack line, and every dropped warning is disposed of in one of three ways,
all recorded in `progress.md`:

| Disposition | What it means |
| --- | --- |
| **folded** | The dropped clause's fact survives inside the surviving sentence, compressed. |
| **dropped** | A second, genuine but lesser failure. Listed with the file and why the survivor outranks it. This is the ticket's *"keep the one with no give"* and it is the common case. |
| **handed off** | Load-bearing, not safety, and it belongs in a field this ticket may not touch. Listed by file **and target field** for T-005-05/T-005-06 to pick up. |

**Safety facts are never in the `dropped` column.** Research §6 identified 36 files where the
failure is illness or injury rather than texture. In every one of them, the safety fact *is* the
surviving clause — which is usually easy, because a safety failure is by definition the one with
no give. The temperature or the cure time stays as a number, not a gesture: `smoked-chicken`
keeps 165°F and 175°F, `pork-liver-pate` keeps 160°F, `cha-lua` keeps 165°F, `turkey-brine`
keeps 40°F, `belly-lox` keeps the three days. `progress.md` lists all 36 with their after-text.

---

## 6. Ratings that shortening exposes

Rule 5 forbids changing a level. But cutting a two-part line to its failure half makes some
ratings visibly wrong — the clearest class is a `forgiving` recipe whose only real content is a
window with no give at all (`do-chua`'s rinse, `braised-short-ribs-slow-cooker`'s sauce,
`corned-beef`'s desalting soak). Under the house shape those read as forgiving because the
*first* half was forgiving; with the first half gone, the line reads as a `narrow` recipe
labelled `forgiving`.

These are **recorded in `progress.md` and `review.md` as findings, not fixed.** The ticket is
explicit that this is a finding and not a licence, and the level split (117/187/93) is asserted
unchanged after the run as a check.

---

## 7. Sequencing and commits

Work proceeds one recipe category at a time — 25 categories carry at least one rewrite — because
that is a unit a reviewer can read in one sitting and because the variant families that share
verbatim clauses (`carnitas` ×3, `chile-verde` ×3, `hungarian-goulash` ×3, `cachete` ×3,
`boston-baked-beans` ×3, `collard-greens` ×3) always sit in the same category, so they are
written together and can be given genuinely different sentences rather than one sentence copied
three times.

Commits go through `lisa commit-ticket` with explicit `--include` paths, one commit per batch of
categories, never `git add`. `src/generated/recipes.json` is gitignored and is never included.

## 8. What this design does not do

- It does not touch `src/lib/slack.ts`. The parser already rejects a level with no reason and
  normalises the separator; the cap is the checker's and it is already committed.
- It does not add a test. The cap is enforced by `check-recipes.mjs`, which `npm run verify`
  runs first; a per-line vitest assertion would duplicate it against the same generated JSON.
  Research §5 found no `slack.test.ts` fixture near the cap, so that file is expected to be
  untouched — and if that expectation is wrong the run fails loudly rather than quietly.
- It does not backfill the 261 undeclared recipes, and asserts their count afterwards.
