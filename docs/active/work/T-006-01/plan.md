# T-006-01 · Plan — one commit, five checks

The edit is two lines. Almost all of this ticket is proving it cost what it says it cost and broke
nothing, so the plan is mostly measurement, and the baseline has to be captured before the edit.

---

## Step 0 — baseline (done during Research, recorded here so it can be reproduced)

```
npm run build
node scripts/measure-pages.mjs
node <scratchpad>/figures.mjs --root dist > <scratchpad>/before-figures.tsv
```

Captured at `HEAD` = `ff0cd55`:

```
658 recipe page(s) in dist
  mean    2823
  median  2766
  max     4474  biryani
  min     1566  egg-cream
  total   1,857,209
```

`before-figures.tsv` — 658 rows, `slug \t chip time \t Start to finish \t Needs you`:

| | |
| --- | ---: |
| both figures | 635 |
| chip, no clock figures | 23 |
| clock, no chip | 0 |

**`figures.mjs` lives in the attempt scratchpad, not in `scripts/`.** The ticket permits three
source files and none of them is a script; this is a measuring instrument for one ticket, and
`measure-pages.mjs --count` already covers the reusable half. Its source is reproduced in
`progress.md` so the numbers can be re-derived.

Verification: the 635 / 23 / 0 split and the 2823 mean both reproduce the ticket's and
`docs/gaps/voice.md`'s published figures. If they had not, the instrument would be wrong and
nothing after this step would mean anything.

---

## Step 1 — the label

`src/pages/[slug].astro:42`: `label: 'about'` → `label: 'recipe says'`, plus the three-line
comment from `structure.md` §1 saying why the label slot carries the attribution.

**Verify immediately:**

```
npm run build
node scripts/measure-pages.mjs --slug sourdough-boule --text | head
node scripts/measure-pages.mjs --slug guacamole --text | head
```

Expect `recipe says 24 hr` and `recipe says 15 min` in the visible text, and
`at least 16 hr 15 min` still present on `sourdough-boule`.

Atomic on its own? Yes — the site builds and reads correctly with the comment in
`Timeline.astro` still stale. But it ships with step 2 (see §Commits).

---

## Step 2 — the comment that stops being true

`src/components/Timeline.astro:225–226`: replace the clause claiming the chip uses `about` with
what is true after step 1. No other line changes.

**Verify:** `git diff --stat` shows exactly two files; `git diff src/components/Timeline.astro`
shows only comment lines.

---

## Step 3 — prove neither figure moved

```
npm run build
node <scratchpad>/figures.mjs --root dist > <scratchpad>/after-figures.tsv
diff <(cut -f1,3,4 before-figures.tsv) <(cut -f1,3,4 after-figures.tsv)   # must be empty
diff <(cut -f1,2 before-figures.tsv) <(cut -f1,2 after-figures.tsv)       # must be 658 chips, about → recipe says
```

**Pass condition:**

1. Columns 1, 3, 4 — slug, `Start to finish`, `Needs you` — **byte-identical, all 658 rows**. This
   is the acceptance criterion's proof, and it covers the 23 pages whose stat blocks do not exist
   (recorded as `-`, so a page gaining or losing one shows as a changed row).
2. Column 2 differs on exactly **658** rows, and every difference is `about X` → `recipe says X`
   with `X` unchanged. Any row where the number itself moved is a failure.

Checked mechanically, not by eye:

```
paste before-figures.tsv after-figures.tsv | awk -F'\t' '{
  if ($3 != $7 || $4 != $8) bad++;
  if ("recipe says " substr($2, 7) != $6) chipbad++;
} END { print "figure rows changed:", bad+0; print "chip rows not a clean label swap:", chipbad+0 }'
```

Both must print 0.

---

## Step 4 — the cost, and the sentences that must still be gone

```
node scripts/measure-pages.mjs
```

**Pass condition: mean 2829**, exactly 6 above baseline, and median/max/min/total all moved by
exactly 6 / 6 / 6 / 3948 (658 × 6). Any other number means something else changed and has to be
explained before this ticket can pass.

Then the ten strings T-005-02 grepped to zero (research §3 — the ticket says six; the list of
record is ten and a superset is the safer check):

```
for s in "so both numbers are floors" "keep a sliver" "a dotted one means" \
         "The recipe itself says" "adds up to more hands-on" \
         "counted as needing you only because" \
         "counted as time you are standing over it" \
         "two waits that overlap count once" \
         "of the steps that give a time" \
         "never puts a number on anything"; do
  node scripts/measure-pages.mjs --count "$s"
done
```

**All ten must print `0`.** They were 0 before; nothing in this change could reintroduce them, and
the criterion asks for the check, not for the argument.

One more, specific to this ticket: `--count "The recipe itself says"` is the sentence T-005-02
deleted and the one this ticket is closest to reinventing. It must stay at 0, and
`recipe says` — 11 characters, no verb phrase about computation, no sentence — is why it does.

Also grep for the shape the constraint forbids, to be able to say it was checked rather than
assumed:

```
node scripts/measure-pages.mjs --count "worked out"
node scripts/measure-pages.mjs --count "from the steps"
node scripts/measure-pages.mjs --count "the table"
```

Expect 0 on all three across recipe pages (any hit is a recipe's own prose and must be inspected).

---

## Step 5 — the suites

```
npm run verify          # check-recipes, parse-recipes, vitest, astro build
npm run verify:mobile   # build, check-overflow --width 375,390,768, check-touch
```

**Both must exit 0.** `verify:mobile` is the one that could plausibly fail: the chip is 6
characters wider on every page. `.chips` is `display: flex; flex-wrap: wrap` (`site.css:207–214`),
so the expected behaviour is a wrap, not an overflow — but expected is not measured, and 375px is
the width T-004 pinned. If `check-overflow` fails, the remedy is a `site.css` rule (the third file
the ticket permits) and it gets its own step.

---

## Step 6 — the artifacts

`progress.md` with what was done, the numbers as they came out, and any deviation. Then `review.md`
and `review-disposition.json`, then `lisa check-disposition T-006-01`.

---

## Commits

**One commit**, through `lisa commit-ticket`:

```
lisa commit-ticket --ticket-id T-006-01 \
  --message "Say whose number the chip is quoting" \
  --include src/pages/[slug].astro \
  --include src/components/Timeline.astro
```

Both files in one unit because the comment in `Timeline.astro` is only true given the change in
`[slug].astro`. A commit carrying one without the other leaves the source contradicting itself.

Nothing else is included. The scratchpad instrument and the TSVs are not repository files. No
`git add`, no `git commit`, no staged residue.

---

## Testing strategy, stated once

**No new unit test, and this is a judgement rather than a gap.** The change is a string literal in
a template. There is no pure function to test, no `.astro` renderer in `devDependencies`, and no
component test anywhere in the repository — T-005-02 hit the identical wall on the identical
surface and recorded the same conclusion.

What stands in its place is step 3: the claim is *1316 rendered figures across 658 pages did not
move*, and that is a property of the built site, which the diff checks exhaustively rather than by
sample. The existing 833-test suite still runs under `npm run verify` and guards everything this
change could reach indirectly (nothing).

**Gap worth naming:** nothing in CI will notice if a later ticket puts `about` back on the chip,
or lets the mean drift. `measure-pages.mjs` is deliberately outside `npm run verify` (its own
header says so — it measures and does not judge). Recorded in `review.md`, not fixed here: adding
a gate is a change to the verify pipeline and this ticket owns two component files.

---

## Rollback

`git revert` of the one commit. Nothing is migrated, generated, or persisted; the change is a
string in a template and the build is reproducible from `npm run build`.

---

## Risks, ranked

1. **A reviewer wants the clock labelled too** (design option D, +16 characters). Not a defect —
   a trade the acceptance criteria pull in opposite directions on. Carried to `review.md` as the
   single open concern, with the exact string and price so the decision is one line of work.
2. **`check-overflow` fails at 375px.** Mitigated by `flex-wrap`, checked in step 5, remedied in
   `site.css` if it happens.
3. **The mean lands somewhere other than 2829.** Would mean something changed that this plan did
   not intend. Step 4 catches it; the exact-arithmetic pass condition is there so a near miss
   cannot be waved through.
