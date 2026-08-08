# T-011-04 — Progress

All nine planned steps are done, in order, plus one unplanned step (the withdrawal). Ten commits
through `lisa commit-ticket`; nothing was ever put in the ordinary index.

---

## Steps, as executed

| # | Step | Commit | State |
| --- | --- | --- | --- |
| 1 | the reader + unit tests | `4a340a1` | done |
| 2 | type, promotion, refusal | `310334f` | done |
| 3 | checker: problem, cap, freezer note | `16474ad` | done |
| 4 | the render | `8c83908` | done |
| 5 | batch A — the four fried | `8e8c25e` | done |
| 6a | batch B — One Pot braises (40) | `215be68` | done |
| 6b | batch C — One Pot soups, rice, beans (33) | `f49d01f` | done |
| 7a | batch D — Instant Pot (25) | `a9456eb` | done |
| 7b | batch E — The Slow Cooker (20) | `bf2414d` | done |
| 8 | batch F — the air fryer shelf (21), + five corrections, + five withdrawals | `ee48aa0` | done |
| 8b | the cap's measured figures | `fcfef25` | done |
| 8c | collection tests | `a07f7db` | done |
| 9 | README | `ab30a94` | done |

`npm run verify` passes from clean: 685 files draw a table, 1104 tests in 16 files, 710 pages built.

---

## Deviations from the plan, and why

**1. The negative vocabulary shrank from three phrasings to one.** Structure specified
`NOT_AT_ALL = ['not at all', 'no', 'not']`. Writing the reader turned up the case that kills the
short forms: **`>> keeps: no longer than a day — it dries out`** would parse as a bare `no` with
*"longer than a day"* as its character — an answer inverted into its opposite by punctuation. On a
field whose whole justification is that it must not be misread, that is not a risk worth two extra
spellings. `NOT_AT_ALL` is now the single string `'not at all'`; `no longer than a day` falls
through to the *not a length of time* branch, whose message names both legal openings. There is a
test for exactly that line.

**2. The collection tests were written at the end, not at step 5.** The plan had them landing early
behind a temporary `>= 4` floor, raised to 60 at step 8. That would have committed a weaker claim
than the ticket asks for and then quietly strengthened it. Writing them once, after every batch,
means the assertion in the history is the real one. Everything else about the tests is as planned.

**3. The cap came in at 120, not 150.** Design proposed 150 pending measurement; the plan said the
figures get measured, not guessed. Measured across the 138 lines written: **mean 86, p95 94, max
101**. 150 would have been headroom rather than a cap, so it is set at **120** — `voice.md`'s
one-breath number, above everything written and below where a keeps line stops being one sentence.
The figures are in the comment beside it, as every other cap has.

**4. One commit carries a message about the step after it.** `fcfef25` is titled *"Take back the
five keeps lines nobody could stand behind"* but contains the cap measurement; the withdrawals
themselves rode in with `ee48aa0`. A mislabelled message, recorded here rather than rewritten,
since Lisa owns the commit history.

---

## The unplanned step: five annotations withdrawn

Written, then taken back out before Review, because on re-reading them I could not stand behind
them. Each file is now **byte-identical to its pre-ticket state** — verified with
`git diff 8e8c25e^ -- <the five>`, which is empty.

| Recipe | Shelf | Why it came out |
| --- | --- | --- |
| `century-egg-amaranth-soup` | One Pot | Two claims stacked — the amaranth going drab *and* the broth greying — and I have not eaten it cold. |
| `crucian-carp-tofu-soup` | One Pot | The answer depends on whether the fish stays in the broth, which the file does not settle. |
| `mustard-greens-tofu-soup` | One Pot | Same shape as the first: a leafy-green soup I was reasoning about rather than reporting. |
| `chintan-broth-instant-pot` | Instant Pot | Whether it gels cold depends on the bones; asserting it would have been inventing. |
| `tonkotsu-broth-instant-pot` | Instant Pot | Whether the emulsion survives the fridge is the exact thing this file's own `slack` says the pot struggles with. Not mine to claim. |

**Five is the count the ticket asked for, and it is honestly five rather than zero.** It is also
five out of 118 on the target shelves, which is low — braises, stews and beans are the part of
cooking where keeping behaviour is best established, and the shelves were chosen for that.

---

## The other correction: five lines that repeated their own `slack`

`voice.md`'s third house test is *say it once*. A scan for any four-word run shared between a
recipe's `keeps` character and its `slack` reason found five, all rewritten to do a different job
(`slack` is the cooking window; `keeps` is the day after):

- `air-fryer-batata-harra`, `air-fryer-chicken-thighs`, `beef-stroganoff`,
  `baked-turkey-wings-slow-cooker`, `osso-buco`.

A sixth line, `air-fryer-frozen-prawns`, tripped the new freezer advisory — for the honest reason
that the prawns go *into* the basket frozen. Reworded rather than waived, and the collection test
that holds the freezer out is left strict with a comment saying an author who needs the exception
moves the test and says why.

---

## What landed, in numbers

- **138 recipes declared**, of 685. **113 carry a span, 25 say `not at all`.**
- Spans written: 2 days ×23, 3 days ×42, 4 days ×47, 5 days ×1.
- Per shelf: **One Pot 70/73 · Instant Pot 23/25 · The Slow Cooker 20/20 · the air fryer shelf
  21/21 · the four deep-fried wok recipes 4/4.**
- Character length: mean 86, p95 94, max 101, cap 120.
- 547 recipes remain undeclared and print nothing.

---

## Shared-file overlap with concurrent threads

Three of this ticket's files are also owned by tickets that ran at the same time. All three
resolved without a carried-along commit, but the exposure was real and is worth recording:

- `scripts/normalise.mjs` / `parse-recipes.mjs` / `check-recipes.mjs` carried **T-009-04's**
  step-reference wiring uncommitted when Research read them. T-009-04 committed before my step 2,
  so `310334f` and `16474ad` contain only my hunks — checked with `git diff` immediately before
  each commit.
- `README.md` carried **T-011-02's** whole `capacity` section uncommitted when I opened it. They
  committed before my step 9, so `ab30a94` is 40 lines and all of them mine.
- `src/lib/tree.ts` gained T-011-02's `Capacity` import after my `310334f`. Untouched since.
- A mid-run `npm run verify` failed three assertions in **`src/lib/scaling.test.ts`** while
  T-011-02 was mid-edit in the working tree. Nothing to do with `keeps`; the final run is green.

The DAG has no edge for any of this — `T-011-04 depends_on: [T-011-01]` — which is the missing
dependency the workflow doc describes rather than something the transaction can fix.

---

## Left undone, on purpose

- **No `freezes:` field.** Argued out in `design.md` §D3 and written into the README as a future
  field rather than a corner of this one.
- **No filter, sort or plan-page use of `keeps`.** S-011 gives that to T-011-06.
- **`lengua`'s `slack` line still carries a keeping fact** (*"reheating does not get it back"*).
  It belongs in `keeps`, and moving it would have changed a line the acceptance criteria forbid
  changing. Flagged for whoever owns that file next.
- **547 recipes unread for this.** Not a gap: the ticket scoped the shelves where the answer
  changes what somebody cooks, and a value on every file would mean somebody guessed.
