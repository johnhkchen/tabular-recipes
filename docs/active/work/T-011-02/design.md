# T-011-02 — Design

Nine decisions. Each is grounded in `research.md` and, where the two speak, in
`docs/knowledge/scaling.md` — which the ticket makes the authority over the code.

---

## D1. Capacity is measured in **servings**, not in batches of this recipe

**Options.** (a) servings the vessel holds — `c` as `scaling.md` defines it. (b) how many batches
the recipe already needs at its written size. (c) a fraction of the recipe ("the wok holds half").

**Decided: (a) servings.** Four reasons, in order of weight:

1. **The authority already chose it.** §2's symbol table: *"`c` — Capacity: servings the limiting
   vessel holds"*, and `b(k) = ceil(k / c)` is arithmetic on servings. Implementing (b) or (c) would
   put the code in disagreement with the file, which the ticket forbids.
2. **It composes with the plan page.** `plan.ts` stores a multiplier and `list.astro` renders
   `serves 4 → 12` in servings. A capacity in servings drops straight into `ceil(n/c)` with no
   conversion; a capacity in batches has to be multiplied back through `s` at every call site, and
   the conversion would be wrong for any recipe scaled by anything but a whole number.
3. **It survives the recipe changing.** A batch count is measured *against the current `servings:`
   line*: edit the recipe from 4 portions to 6 and a batch count silently becomes a lie, while a
   pan that holds 2 still holds 2. This repo has refused stated-derived numbers twice already
   (`washing-up` derives its count from the list; labels are derived from steps).
4. **It is the fact a cook actually has.** "This pan does two portions" is knowable while standing
   at the pan. "This recipe is 2.5 batches" is arithmetic about a recipe you have not written yet.

**Consequence, stated once:** `b(s) = ceil(s/c)` may be greater than 1. That is not an error — it is
`scaling.md` §3's `beef-with-broccoli`, and it is why `r` is a ratio. See D5.

## D2. The line carries a number, a vessel, **and the operations it bounds**

**Options.**

| | Shape | Verdict |
| --- | --- | --- |
| a | `>> capacity: 6` | Refused by the ticket ("a bare `6` does not [tell a reader with a different pan what to do]") and by §5. |
| b | `>> capacity: 6 — one 12-inch skillet` | Refused by §5's last rule and proved wrong by §3: a number with no operation triples a fridge rest and turns 42 minutes into 102. |
| c | `>> capacity: 6 — one 12-inch skillet, searing` | **Chosen.** |
| d | Three keys (`capacity`, `capacity-vessel`, `capacity-binds`) | Three lines an author can half-write, three ways to disagree. `slack` and `washing-up` are each one line. |

**Grammar.** Leading number, an optional unit word, one optional separator, then a comma-separated
list whose **first entry is the vessel** and whose **remaining entries are the operations**:

```cooklang
>> capacity: 2 — the wok, sear
>> capacity: 4 — the air fryer basket, roast
>> capacity: 6 servings — one 12-inch skillet, brown, fry
```

Liberal about the punctuation joining the number to the words (`—`, `–`, `-`, `:`, `,`, or nothing),
exactly as `readSlack` is, and strict about what the parts mean. The comma-list is `washing-up`'s
rule reused: **one entry is one thing**, and the reader derives everything else.

**Refused inside the line**, each with its own message: a missing number; a number that is not
positive and finite; a batch claim (`2 batches`, `two loads` — the same class of error
`readWashingUp` refuses when a line states `2` instead of the things); no vessel; no operation.

## D3. The reader and the cost function live in **`src/lib/scaling.ts`**

`slack` and `washing-up` each got their own file. Capacity would too, but the ticket's ownership
list is exact and does not include a new `src/lib/capacity.ts`. `scaling.ts` is where the ticket
puts the model, the reader is fifty lines, and both halves are the same subject — what the vessel
holds and what that costs. `tree.ts` imports the `Capacity` **type only**, the way it already does
for `Slack` and `WashingUp`, so nothing circular exists at runtime.

Rejected: putting the reader in `tree.ts` (that file is types and the tree, and has never parsed a
metadata line) and in `normalise.mjs` (a reader in a script cannot be unit-tested the way
`readSlack` is, and `check-recipes` needs it too).

## D4. Bound operations are matched to steps **by the author's words**, checked loudly

`scaling.md` §9: *"Per-step cookware is not in the generated data … Whatever builds the cost
function needs the mark per step, **or** `>> capacity:` has to carry the operation itself."*

**Options.** (a) add per-step `cookware[]` in `normalise.mjs` and match the vessel to steps. (b) let
the author name step numbers. (c) match the operation words the author wrote against step labels.

**Decided: (c).** (a) changes the shape of every one of the 664 records in `recipes.json` for a
field nothing else reads yet, and it fails on the collection as it is: 2782 steps carry a `>> step:`
label that replaces the text the `#wok{}` mark was in, so the vessel is not in the label a cook
sees. (b) is a positional reference into a file people reorder — the exact fragility the numbered
step-label form was removed for (`src/lib/step-labels.ts`).

**The matching rule**, deliberately small: flatten both sides (lowercase, drop accents and
punctuation), and an entry matches a step when **every word of the entry matches some word of that
step's label or body, by prefix in either direction, minimum three letters.** So `sear` matches
*"sear in two batches 3 min"* and *"searing"*; `fry` matches both of `karaage`'s fries. It is a
guess about English, and the reason it is safe is that **the check fails when an entry matches no
step at all** and prints the step labels — so a wrong guess is caught by the author on the first
run, not by a reader six months later. Same posture as `washing-up`'s `PLURAL_START`: a modest
guess with a loud failure.

## D5. Capacity below servings fails the check **unless the file already says it batches**

The one place the ticket and `scaling.md` appear to disagree (`research.md` §6a). The ticket:
*"A capacity below the recipe's own servings is a contradiction … That is either a wrong number **or
a recipe that already batches and did not say**. Fail the check and make the message say which two
lines disagree."* `scaling.md` §3 authors exactly such a capacity on `beef-with-broccoli` (`s = 4`,
`c = 2`) and calls it the collection's one readable case.

**Options.** (a) fail always — makes §3's example unauthorable and breaks T-011-03. (b) warn only —
loses the acceptance criterion and lets a typo through silently. (c) **fail unless the recipe says
it batches, in the operations the capacity binds.**

**Decided: (c)**, which is the ticket's own sentence read whole: the fault is batching *and not
saying*. Detection is not a guess — it is the word `batch` (or `batches`) in the label or the body
of a step the capacity binds. `beef-with-broccoli`'s label is `sear in two batches 3 min, lift out`;
`karaage`'s body is *"Fry … in batches"*; `vindaloo`'s is `sear 8 min in batches`. The 23 files
§2 cites say it the same way.

The failure message names **both lines**, quoted as the author wrote them, and says which of the two
readings to fix. The passing case is tested too, so the rule cannot quietly become "always fail".

## D6. `A` is re-read timer by timer, and pinned to the schedule by a property test

`A` is unattended minutes **on the critical path**, and `Task.attention` is a cautious *task-level*
label — `karaage` measures 35 that way and 40 the right way, and §7 says 40 (`research.md` §2).
`schedule.ts` computes the split timer by timer but publishes only collection-wide sums, and it is
**outside this ticket's ownership**, so a field cannot be added to `Task`.

**Decided:** `scaling.ts` re-reads each critical-path step's timers with the same call
`buildSchedule()` makes — `readTimers(step.timers, task.label)` — and sums the unattended ones. The
inputs are identical (the same timers, the same label off the same tree), so the reading is the same
reading and not a second opinion.

The duplication is real and is paid for with a **whole-collection property test**: for all 664
recipes, summing every task's re-read split reproduces `schedule.unattendedMinutes` and
`schedule.handsOnMinutes` exactly. If `schedule.ts` ever changes how it reads a timer, that test
fails on the same day rather than a page quietly disagreeing with a timeline.

Rejected: approximating `A` as `totalMinutes − (hands-on on the path)`. It is right only when every
path task is timed, and `chili-con-carne`'s path ends in an untimed `thicken`.

## D7. The return type carries **numbers, booleans and one enum** — no strings a page could print

The ticket: *"It must not return a string a page could print. … A function returning `"O(n)"` is how
the notation ends up on a card."*

**Decided:** `Cost` contains no free text at all — not even the vessel the author named. The only
string-typed member is `Confidence` (`'stated' | 'inferred' | 'unknown'`), which is T-010-01's
existing verdict enum and not display text. A page that wants the vessel's name reads
`recipe.capacity.vessel` itself, which is the author's own words rather than the model's.

This is checked by a test that walks the returned object and asserts every string value it contains
is one of those three words — a grep the ticket asks for, made executable.

**Growth is returned, not left to the caller** ("a caller needs to say *three times as much costs
nothing extra*, which is a statement about the curve"). Every figure comes back as the same small
record:

```ts
interface Growth { written: number; at: number; factor: number | null; flat: boolean }
```

`factor` is `null` rather than `Infinity` or `NaN` when the figure was zero to begin with —
`chili-con-carne` has `H = 0`, and "zero grew by a factor of nothing" is a division a caller must
not have to defend. `flat` is the phrasebook's first row asked directly.

## D8. The longest unbroken stretch grows by `max(m, r)`, and errs busy

T-010-01's `longestHandsOnMinutes` is made of hands-on minutes, but which ones — free or batched —
is not recorded, and recovering it means re-running the schedule with scaled timers.

**Options.** (a) scale by `m` always. (b) scale by `max(m, r)`. (c) rebuild a scaled schedule.

**Decided: (b).** (a) under-reports the case the number exists for — a cook standing over four
consecutive loads. (c) is a second scheduler in a file that the ticket says must not know about
pages, and it would have to invent where the scaled work lands.

`max(m, r)` and not `r`, because `r < m` is possible (`research.md` §6b: `s=4, c=3, n=8` gives
`r = 1.5, m = 2`) and the stretch must never be reported as growing more slowly than the work it is
made of. Where it errs it errs towards a busier evening — `schedule.ts:longestUnbroken()`'s own
stated convention, and the opposite of §4.5's warning about the model being optimistic. Written down
as an accepted error with its direction named, the way §4 does it.

## D9. Confidence is carried through, and multiplying is allowed to make it worse, never better

The ticket: *"A scaled figure must never look more certain than the figure it scaled."*

**Decided**, three parts:

1. `cost.evidence` is `handsOnEvidence(schedule)` — the verdict T-010-01 already ships to the search
   index, unchanged, so the scaled figure and the unscaled figure never give a reader two answers.
2. `cost.assumedStandingMinutes` scales the assumed part **by the same factors as the figure it sits
   inside**, so it grows when the standing figure grows. A guess multiplied is a bigger guess, and
   the number that says so grows with it.
3. `cost.untimedCount` is passed through untouched, for §6's *"…plus four steps the recipe never
   times"* row.

Two tests state the rule as a property over the whole collection: `evidence` is never stronger than
`handsOnEvidence(schedule)` at any multiplier, and `assumedStandingMinutes ≥
schedule.assumedHandsOnMinutes` whenever `m ≥ 1`.

Rejected: computing a *scaled* confidence that degrades `inferred` to `unknown` past some
multiplier. There is no measurement behind a threshold like that, and inventing one is the vibe in a
mathematical costume §5 refuses.

---

## What is deliberately not built

- **Per-operation capacity beyond the bound set.** A capacity binds whole steps, never a fraction of
  one. A step that sears *and* simmers in the same timer is charged whole. Known limitation, in the
  code's own words and in `review.md`.
- **A page-facing sentence.** §6's phrasebook is T-011-05's and T-011-06's. `scaling.ts` returns the
  finding; the words are theirs.
- **A `capacity` on any `.cook` file.** T-011-03's, by the ticket's own last line.
- **`parse-recipes.mjs` throwing on a malformed capacity.** That file is outside the ownership list.
  `check-recipes.mjs` fails on it, and `npm run verify` runs `check` before `recipes`, so the build
  cannot ship one today. Flagged for whoever owns that file next.
