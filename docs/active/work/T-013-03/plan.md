# T-013-03 — Plan

Nine steps. Three are stop-the-line: if step 2, 4 or 11 fails, the work stops and the failure is
the report rather than something to work around.

---

## Step 0 — Baseline

- `npm run recipes` — regenerate `src/generated/recipes.json`. **Done in Research:** 685 recipes,
  27 categories, md5 `f83cf3586331856f919bb747b3c0476a`.
- `git status --porcelain` — record what is dirty *before* this ticket touches anything, so the
  hand-off check at step 12 can tell this ticket's residue from other threads' work on the same
  branch.

**Verify:** the md5 is recorded in `progress.md`.

---

## Step 1 — Capture the `menu-sections.mjs` baseline

```
node scripts/menu-sections.mjs > .lisa/attempts/T-013-03/1/work/menu-sections-before.txt
```

Dry run — the script writes nothing without `--write`.

**Verify:** the file exists and is non-empty. It is compared at step 11 and **not** committed; it
is scaffolding for a check, not a deliverable.

---

## Step 2 — Transcribe the profiles and reproduce `chili-con-carne` — **STOP-THE-LINE**

Write §A–§C of `rank-the-shelf.ts`: the two profile tables, the reader, the gates, the scorer.
Then assert `occasions.md` §3.3's own worked figure:

```
chili-con-carne, FAMILY, 12 servings:  0 + 0 + (1 × 5) + (4 × −20) + (−20) = −95.0
```

**Verify:** the script exits non-zero if the computed score is not −95.0.

**If it fails:** do not adjust a rate to make it pass. Either the transcription is wrong (fix the
transcription) or the collection has changed since 7 August 2026 (report the change, adopt the new
number, and say which line of `occasions.md` is now stale). Tuning a rate to hit a target is the
one move this ticket exists to refuse.

Also assert, at the same time: the party profile's `slackUnforgiving` term never fires, because the
gate already removed those recipes.

---

## Step 3 — Rank all 685, twice

Write §D–§G. Print for each profile: top 20, bottom 20, the three answers split by cause, the
distinct-score count, the largest tie group, the share of ranked files with no `slack` line, and
the share of standing minutes that are assumed.

**Verify:**
- `ranked + rejected + cannotSay === 685` for both profiles.
- Rejected counts equal the number of `slack: unforgiving` files that also scale — cross-checked
  against the census (93 unforgiving overall).
- Re-running produces byte-identical stdout (ties broken by slug).

---

## Step 4 — Overlap, inversion, and the seventeen — **STOP-THE-LINE on the seventeen**

Write §E, §F, §H.

- Top-10 intersection · Jaccard over ranked sets · Spearman ρ over the shared ranked population.
- The inversion test three ways: the literal last-ranked slug, the worst-ten-against-top-ten count,
  and `gyoza` by name.
- Reproduce `occasions.md` §3.5's seventeen-row table and diff every rank.

**Verify:** every one of the seventeen is accounted for — reproduced, or its movement explained by
a named change in the collection since 7 August.

**If the seventeen do not reproduce:** that is a finding about `occasions.md`, and it is reported
with the diff. It does not stop the rankings, but it must not be discovered late, which is why it
runs here rather than at the end.

---

## Step 5 — Establish both occasions

Web search, independent of `occasions.md` §1. Per `design.md` §5:

- **Holiday meal:** confirm the four kinds of evidence with one source each, saying which kind it
  is and what it establishes.
- **Dumpling party:** push the four the ticket names — kits, restaurant classes, the frozen aisle,
  wrappers by the packet. Record what is sold: the making, or the food.

**Verify:** every link is real and reachable, and every one is annotated with what it established.
A link with no sentence attached is not evidence gathered the way `soup-pot.md` gathered its
sources, and does not go in.

**The honest-failure branch stays open:** if the party's evidence turns out to be classes and kits
only — a hobby product with no caterer, no deadline and no priced package for a household — that is
recorded as *passes the rule, on one kind of evidence*, and it changes what §7's recommendation can
say.

---

## Step 6 — Coverage: can the shelf feed either

From step 3's output plus a count of the real dumpling-party candidate pool (the folder is sixteen
files, several of which are not dumplings — `research.md` §4).

Per occasion: how many clear the gate · how many are *genuinely good* rather than merely admissible
· what is conspicuously missing. **"Genuinely good" needs a stated rule** and it is declared here
before the numbers are read: a recipe is genuinely good for an occasion when it is ranked **and**
its score is driven by declared fields rather than by absence — concretely, when at least two of
the four profile fields (`slack`, `keeps`, `washing-up`, a non-`unknown` hands-on figure) are
present. Anything ranked on fewer is *admissible*.

Cross-reference `docs/gaps/what-the-shelf-offers.md` §4's verdict and its veto.

**Verify:** the "genuinely good" rule is stated in the document before its number appears.

---

## Step 7 — Assemble the meal and diagnose it

Slot rules from `structure.md` §2.6, applied by hand to step 3's family ranking. Five or six
dishes. Then `diagnose()` at `cooks: 1` and `cooks: 2`, `burners: 4`, `ovenShelves: null`.

**Verify:** every chosen slug's family rank is recorded next to it, and any slot where the
ranking's own pick was overridden says so and says why. The raw `Diagnosis` is captured verbatim.

---

## Step 8 — Write `docs/gaps/two-that-invert.md`

The outline in `structure.md` §3. Every number cited to the script; every source annotated;
§10 (*what could not be verified*) written last and honestly.

**Verify:** no `## What it has` heading in the file. Every relative link resolves.

---

## Step 9 — Save the script's output

`ranking-output.txt`, the full stdout, as `T-012-02/reading-output.txt` does.

**Verify:** every headline number in the document appears in the output file.

---

## Step 10 — `npm run verify`

**Verify:** the same result as before this ticket started. Nothing here changes a test, a page or a
recipe, so a change in this output means something was touched that should not have been.

---

## Step 11 — Re-run `menu-sections.mjs` — **STOP-THE-LINE**

```
node scripts/menu-sections.mjs > .../menu-sections-after.txt
diff menu-sections-before.txt menu-sections-after.txt
```

**Verify: byte-identical.** A non-empty diff means the new `docs/gaps/` page is being read as a
counter, which would open a shelf this ticket is forbidden to open. Fix the document, not the
script.

---

## Step 12 — Commit and hand off

`lisa commit-ticket` with exact `--include` paths. Two commits, because they are different kinds of
thing and reviewing them together is worse:

1. `docs/active/work/T-013-03/rank-the-shelf.ts` + `ranking-output.txt` — the arithmetic.
2. `docs/gaps/two-that-invert.md` — the report.

Phase artifacts (`research.md`, `design.md`, `structure.md`, `plan.md`, `progress.md`, `review.md`,
`review-disposition.json`) are written to the attempt directory and **published by Lisa**; they are
not passed to `commit-ticket`.

**Verify:** `git status --porcelain` shows nothing this ticket owns as staged, modified or
untracked, against step 0's baseline. `menu-sections-before.txt` / `-after.txt` live only in the
attempt directory and are never committed.

---

## Testing strategy

**No `vitest` file is added, and that is a decision rather than an omission.** The deliverable is a
document plus a one-off reading script in a work directory. `src/lib/` is not changed, so there is
nothing new to unit-test; a test asserting that a paragraph exists is a test of the diff.
T-013-01 and T-012-02 — the two closest precedents, both documents produced by reading the
collection — shipped the same way, and T-012-02's disposition passed.

What stands in for tests:

| Check | Where | Catches |
| --- | --- | --- |
| `chili-con-carne` = −95.0 | inside the script, exits non-zero | a mis-transcribed rate |
| the party's unforgiving term never fires | inside the script | a gate that stopped gating |
| `ranked + rejected + cannotSay = 685`, both profiles | inside the script | a row silently dropped |
| the seventeen from §3.5 reproduce | step 4 | this being a different profile from the one on record |
| deterministic stdout across two runs | step 3 | tie-break instability |
| `menu-sections.mjs` diff is empty | step 11 | a document accidentally opening a counter |
| `npm run verify` unchanged | step 10 | anything touched that should not have been |

**The known gap:** nothing tests that the *rates* are the right rates. They are declared
preferences, not measurements — `occasions.md` says so itself — and the only available check is that
they match the file they were transcribed from. This is stated in the report's §10 rather than
papered over.
