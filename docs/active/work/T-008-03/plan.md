# T-008-03 — Plan

Ten steps. Steps 2–6 are the annotation and each is independently committable; steps 7–9 are the
measurements the acceptance criteria actually ask for and none of them can run before step 6.

`node` is not on the default `PATH`. Every command below is run with
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"` first.

---

## Step 0 — pin the tree

```
git status --porcelain recipes/ | wc -l          # expect 0 ticket-owned changes at start
find recipes -name '*.cook' | wc -l              # expect 664; record it
grep -rl 'washing-up' recipes/ | wc -l           # expect 11
```

The 151-file list in `structure.md` §2 is the pinned set. Anything not on it is not touched, and
a `.cook` file that appears during the ticket belongs to T-008-04.

**Verify:** the three numbers above are recorded in `progress.md` before any edit.

## Step 1 — the insertion script

`scratchpad/annotate.mjs`, per `structure.md` §4. Takes `slug → line`, inserts after the last
`>> ` line of the metadata block, refuses a file that already has one, prints what it wrote.

**Verify:** run it on a single file (`tortilla-espanola`), `git diff` that file, confirm one added
line and zero removed lines, then continue. If the diff shows anything else, stop.

## Step 2 — Batch 1, One Pot (69 files)

The shelf whose promise has never been checked, and the largest batch. Read in sub-batches of
about ten files with the condensed dump (`scratchpad/pool.mjs show`), which prints each file's
counters, `cookware`, existing line and step prose with the markup flattened. For each file:

1. List the vessels named `#thing{}`, minus fixtures.
2. Add the vessels in prose.
3. Add the vessels implied by an operation with no home (`design.md` §2 pass 3).
4. Apply the convention (`design.md` §3), including the *thing used twice* rule.
5. Write the line in the file's own nouns, purpose clauses where two of a kind exist.
6. Record the count and, where it is not obvious, the one-line reason in `progress.md`.

**Commit:** `lisa commit-ticket --ticket-id T-008-03 --message 'Say what the One Pot shelf actually
washes' --include <69 exact paths>`

**Verify:** `npm run recipes` exits 0 and its summary reports `washing-up in 80`.

## Step 3 — Batch 2, Instant Pot (23 files)

Same reading. **This batch also collects the second finding**: for every file, whether any browning
or toasting happens *outside* the pot, quoted from the step text. Sauté mode is the same pot; a
skillet or a broiler is not. `docs/gaps/air-fryer-and-pot.md` already names four
(`chile-verde-instant-pot`, `carnitas-instant-pot`, `beef-bourguignon-instant-pot`,
`pho-broth-instant-pot`); the reading either confirms that list or extends it, and either outcome
is reported.

**Commit:** *Say what the Instant Pot shelf actually washes.* **Verify:** `washing-up in 103`.

## Step 4 — Batch 3, The Slow Cooker (20 files)

T-008-01's review says fifteen of these twenty declare a `#skillet{}` or `#saucepan{}` beside the
cooker. That claim is checked in the reading, and the brown-in-a-separate-pan example T-008-01
could not find on the Instant Pot shelf is expected to be here in quantity.

**Commit:** *Say what the slow cooker leaves in the sink.* **Verify:** `washing-up in 123`.

## Step 5 — Batch 4, air-fryer gap candidates (20 files)

These are the plain files the new counter's ranked list points at. Their counts are what a
`kit: Air Fryer` sibling will be compared against, so the reading pays special attention to the
vessel the basket would remove — the pan of oil, the sheet tray, the parboiling pot.

**Commit:** *Say what the basket would be washing against.* **Verify:** `washing-up in 143`.

## Step 6 — Batch 5, plain siblings (13 files)

The plain half of every pool `kit:` dish that no pool shelf claims. Without these the
plain-versus-kit table has thirteen half-rows.

**Commit:** *Give every kit recipe a plain half to compare against.* **Verify:** `washing-up in
156` — 145 written plus T-008-01's 11.

## Step 7 — the cross-check, over the whole collection

```
npm run check 2>&1 | tee scratchpad/check.txt
grep -c 'FAIL' scratchpad/check.txt          # expect 0
```

Every note is pasted verbatim into `findings.md` with a line each on why it is overruled or what it
reveals. **Warnings are findings, not failures** — the criterion says so. Two kinds are expected:

- **`unaccountedCookware`** — a `#thing{}` the line does not mention. Either the line missed
  something real (fix the line) or the thing is excluded by convention rule 7/9 (record why).
- **`pluralEntries`** — an entry starting with a number word. Any of these is a **line to rewrite**,
  because one entry is one thing and that is the contract the count rests on.

**Verify:** `npm run check` exits 0, and every note in the output has a disposition in
`findings.md`.

## Step 8 — the measurements

All computed from `src/generated/recipes.json` after step 6, by a scratchpad script, so every
number in `findings.md` is reproducible rather than tallied by hand:

1. **Every One Pot recipe washing three or more**, by slug with its count, ranked descending. This
   is the evidence a later re-shelving pass needs. **Nothing is re-shelved here.**
2. **Every Instant Pot recipe that browns outside the pot**, by slug, with the quoted step.
3. **Plain versus kit**, one row per `dish` with two or more files, counts side by side, plus a
   sentence on what it shows. The interesting outcome is a *zero* difference and it gets said
   plainly if that is what it is.
4. **The gate count** — how many pool recipes clear all three bars of
   `docs/gaps/air-fryer-and-pot.md`:
   - **bar 1** — `washingUp.count <= 2`, now readable on the whole pool;
   - **bar 2** — one plug-in machine does the cooking, taken from the gap page's own per-shelf
     measurement and re-read against this ticket's step reading;
   - **bar 3** — 45 minutes wall-clock, computed through `buildSchedule()` in `src/lib/schedule.ts`
     and cross-read against each file's `>> time:`.

   **State the number even if it is small**, and state it against both readings of the clock.
5. **The four wok recipes** — confirm `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`
   and `sweet-and-sour-pork` are annotated and each is three or more. They already are (5/5/5/4);
   the check is that nothing in this ticket moved them.
6. **Uncountable-without-cooking** — the list, with a reason each. Expected to be short or empty;
   the number is reported either way.

**Verify:** every one of the eleven acceptance criteria has a named section in `findings.md`.

## Step 9 — the diff audit

The criterion is *"No line other than `>> washing-up:` changes in any file. Show it: a diff limited
to added lines."*

```
git diff HEAD -- recipes/ | grep '^-' | grep -v '^---'            # expect empty
git diff HEAD -- recipes/ | grep '^+' | grep -v '^+++' | grep -cv '^+>> washing-up:'   # expect 0
git status --porcelain                                            # no ticket-owned file left dirty
```

Because each batch is committed as it lands, the audit is run against the ticket's own commit range
rather than the working tree:

```
git diff <base>..HEAD -- recipes/ | grep -v '^+>> washing-up:' | grep -E '^[-+]' | grep -v '^\+\+\+|^---'
```

**Verify:** the filtered diff is empty. Its command and output go into `findings.md` verbatim.

## Step 10 — verify and review

```
npm run verify        # check → recipes → vitest run → astro build
```

**Expected:** exit 0. The five collection assertions in `src/lib/washing-up.test.ts` that this
ticket touches indirectly — `count === items.length`, at least one zero, at least one 1, at least 8
declared, `undeclared.length > 0` — all stay true with 156 declared and 508 undeclared. **If a test
fails, that is a finding and `src/lib/**` is still not this ticket's to edit.**

Then `review.md` and `review-disposition.json`, and `lisa check-disposition T-008-03`.

---

## Testing strategy

There is **no new code**, so there are no new unit tests. What stands in for them:

| Risk | The check that catches it |
| --- | --- |
| a malformed line | `npm run recipes` throws; run after every batch |
| a number written into a line | same — it is a build error by design |
| an entry that is secretly two things | `pluralEntries` note in `npm run check`, step 7 |
| a line that forgets a vessel the file names | `unaccountedCookware` note, step 7 |
| a line that forgets a vessel the file *doesn't* name | **nothing catches this.** It is why the field is authored, and the only defence is the reading being done file by file and recorded in `progress.md` |
| something other than the line changed | step 9's diff audit |
| the count and the list disagreeing | impossible — `count` is `items.length`, and a collection test asserts it |
| a wrong pool | step 0's pinned list, and the pool script is in the scratchpad and rerunnable |

The last row of that table is the honest limit of this ticket: **an under-count is invisible to
every check in the repository.** The mitigation is procedural, not mechanical — every count is
recorded in `progress.md` with the vessels that produced it, so a reviewer can disagree with a
specific line rather than with a total.
