# T-011-04 — Review

**A recipe can now say how long it keeps and what it is like when you come back to it, and it
cannot say the first half without the second.** Two files created, six modified, 138 recipes
annotated, five annotations withdrawn on purpose. `npm run verify` passes: 685 files draw a table,
1104 tests across 16 files, 710 pages built.

---

## What changed

| File | Action | Lines | What it does |
| --- | --- | ---: | --- |
| `src/lib/keeps.ts` | created | 143 | the one reader: `readKeeps`, `keepsWord`, `mentionsFreezer` |
| `src/lib/keeps.test.ts` | created | 213 | 21 tests — the reader, and the whole collection |
| `src/lib/tree.ts` | modified | +11 | `RawRecipe.keeps` / `keepsProblem` |
| `scripts/normalise.mjs` | modified | +14 | reads the line, promotes it, deletes the key |
| `scripts/parse-recipes.mjs` | modified | +1 | throws on a half-written line |
| `scripts/check-recipes.mjs` | modified | +25 | reports the problem, caps the character, warns on the freezer |
| `src/components/Timeline.astro` | modified | +26 | the third panel, sharing the other two's CSS |
| `README.md` | modified | +40 | the field, the framing, the freezing decision |
| `recipes/**/*.cook` | modified | +1 each | 138 files, one line each, nothing else |

Ten commits, all through `lisa commit-ticket` with exact `--include` paths. The working tree holds
no modified, staged or untracked file owned by this ticket.

---

## The field, in one paragraph

`>> keeps: 3 days — better on the second`. The front of the line is a span read with
`minutesOf()` from `time.ts` — the same reader every timer goes through — or the single phrase
`not at all`, which is `minutes: 0`. One separator is punctuation. **Everything after it is the
character, and it is mandatory**: a span with nothing after it is refused by the reader, reported
by `check-recipes` and thrown by `parse-recipes`, so it can never reach a page. Absent is `null`
and prints nothing at all. Three states, three values, the same shape `washing-up` established.

---

## The two decisions the ticket asked to have argued

**1. It is not a food-safety field, and the mechanism carries that rather than a disclaimer.**
A number on its own is a shelf life; a shelf life is a claim about a body. The field is built so
the bare form *cannot be written* — `readKeeps('3 days')` returns a problem whose text is *"a
duration on its own is a shelf life, and this site does not make those"*. That is the same move
`slack` made when it refused a level with no reason, and it is the S-007 lesson applied: the frame
does the claiming, so fix the frame. The README says it in plain unhedged words and ends on the
instruction that actually prevents harm — **where you are not sure, leave it off**. The page label
is *"Does it keep"*, a question a cook asks, not *"Shelf life"* or *"Safe for"*.

**2. Freezing is out of scope, and the argument is in three places.** Chili keeps four days cold
and three months frozen; bread is stale by Tuesday and perfect from the freezer. There is no
ordering between the two answers, so one line carrying both would sometimes carry a contradiction —
and only the fridge answers S-011's *six people, over three days*. `keeps` is the fridge, covered,
as it is. `npm run check` **warns** when a character wanders into the freezer (advisory, because
*"unlike the frozen version…"* is a legitimate sentence). What this costs is stated rather than
hidden: the site cannot answer *what can I make now and eat in March*, and the README names that as
a future `freezes:` so the next author does not widen this line into it.

---

## The annotations

**138 declared, of 685.** 113 carry a span, 25 say `not at all`.

| Shelf | Declared | Of |
| --- | ---: | ---: |
| One Pot | 70 | 73 |
| Instant Pot | 23 | 25 |
| The Slow Cooker | 20 | 20 |
| The Air Fryer & the Pot | 21 | 21 |
| the four deep-fried wok recipes | 4 | 4 |

Spans written: 2 days ×23, 3 days ×42, 4 days ×47, 5 days ×1 (`chicken-adobo`, on the vinegar).

**The four deep-fried recipes** from `docs/gaps/one-pot.md` all say *not at all*, and each says
what happens to **it** rather than to fried food in general — the coating drinking the glaze
(`general-tsos-chicken`), the glaze setting sticky (`orange-chicken`), ten minutes of crunch
(`sesame-chicken`), the pineapple thinning the sauce (`sweet-and-sour-pork`).

**Five recipes were left undeclared because the answer could not be established honestly**, and
each had a line written and then taken back out. They are listed with reasons in `progress.md`:
`century-egg-amaranth-soup`, `crucian-carp-tofu-soup`, `mustard-greens-tofu-soup`,
`chintan-broth-instant-pot`, `tonkotsu-broth-instant-pot` — three leafy-green or whole-fish soups
I was reasoning about rather than reporting, and two broths whose gel and emulsion depend on
things the files do not settle. **Five is a low count and the ticket says why that is worth
looking at.** The defence is the scope: braises, stews, beans and fried things are the part of
cooking where keeping behaviour is best established, and those shelves were chosen for exactly
that reason. Each of the five files is byte-identical to its pre-ticket state.

---

## Test coverage

**21 tests in `src/lib/keeps.test.ts`.** The three the ticket names by hand:

| Criterion | Test |
| --- | --- |
| a declaration with character parses | *reads a span and keeps the character exactly as it was written* — days, weeks and hours, character verbatim |
| a bare duration fails | *refuses a duration with no character, because that is a shelf life* — `3 days`, `3 days —`, `2 weeks :`, `not at all -` |
| an undeclared recipe renders nothing | *renders nothing for a recipe that never declared one* — the `null` the `{keeps && …}` guard stands on, over all 547 |

Around them: every separator and none; a dash inside the character that is not eaten; a unit that
is not a duration; a character with no span; the four shapes of absent; the `not at all` form and
that it still wants a character; `keepsWord` capitalisation; `mentionsFreezer` both ways. Then the
collection sweep: whole-or-null, re-read without complaint, both kinds of answer present, **the
`>= 60` count asserted rather than claimed**, no span under an hour, no character under five words,
and the freezer held out.

**Gaps, named.** `Timeline.astro` is not unit-tested — Astro components have no test harness here,
and the render is one guard over one value, which is what the collection tests stand behind. The
panel was read once by hand in `dist/orange-chicken/index.html`; the four fried pages carried it
and the other 681 carried nothing. The freezer advisory's message text is not asserted anywhere,
only its predicate.

---

## Open concerns

1. **138 lines are one person's judgement, and nothing can check them.** That is the field's
   design — authored, never derived — but it means a wrong character is invisible to the build.
   The mitigations are the withdrawal list, the five-word floor, and the `not at all` answers being
   the easiest to falsify by anyone who has eaten cold chips.
2. **`lengua`'s `slack` line still carries a keeping fact** — *"reheating does not get it back"*.
   It belongs in `keeps` now. Moving it would have edited a recipe line the criteria forbid
   changing, so it is flagged rather than fixed.
3. **The cap at 120 has never fired.** Max written is 101. If a future author needs 130, the file's
   own rule applies: move the cap and say what you measured.
4. **Three shared files ran hot with concurrent tickets** (T-009-04 on the three scripts, T-011-02
   on `README.md` and `tree.ts`). Every commit was diff-checked immediately beforehand and none
   carried another ticket's work, but the DAG models none of this — `depends_on: [T-011-01]` only.
   Worth an edge if S-011's remaining tickets touch the same files.
5. **No variant roll-up.** *This one keeps and its slow-cooker sibling does not* is a real
   comparison and is not built, for the reason `washingUpCount` records: one value beside a silent
   sibling reads as a claim about the silent one.

Nothing here needs human attention before completion.
