# T-011-04 — Design

Five decisions, each with what was rejected. The field is called **`keeps`**.

---

## D1. The shape of the line

### Options

**(a) Duration only.** `>> keeps: 3 days`. Machine-comparable, trivially checkable, and it is the
one shape the ticket forbids by name: *"A number with no character is a shelf life, and a shelf
life is a food-safety claim this site should not be making."* Rejected before it was considered.

**(b) Character only.** `>> keeps: better on the second day`. Honest, unfalsifiable, and useless to
the thing that needs it — S-011's *six people over three days* is a comparison against three days,
and prose does not compare. Rejected.

**(c) Duration, then character** — `slack`'s exact grammar with a span where the level is.

```cooklang
>> keeps: 3 days — better on the second
>> keeps: 3 days — the crust is gone by the next morning; reheat in the oven, not the microwave
```

**Chosen.** The ticket names this shape and the codebase already has one field built to it. The
two examples above are the ticket's own, and they are three days and different dinners, which is
the whole argument. Both halves are required: a duration with nothing after it is a shelf life, a
character with no duration is not comparable.

### How it is read

`readKeeps(value)` mirrors `readSlack` in signature, return type and temperament — liberal about
how a human typed it, strict about what it means:

1. The leading span is `number + unit`, read with `minutesOf()` from `src/lib/time.ts`. That is the
   repo's one number-plus-unit reader; `day`, `days`, `week`, `hr`, `hour` are all already in its
   table, and reusing it means "3 days" means the same thing here as it does in a timer.
2. One separator — `—`, `–`, `-`, `:`, `,` or nothing — is punctuation, not meaning. A dash inside
   the character is not eaten. Same regex discipline as `slack`.
3. Everything after it is the character, kept exactly as written.

Rejected inside (c): **a controlled vocabulary for the character** (`improves | holds | fades`), the
way `slack` has levels. The parallel is tempting and wrong. `slack`'s level is a *comparison
between recipes* that the reason then explains; here the duration is already that comparable term,
so a second closed vocabulary would be a vibe stacked on a fact — the thing S-011 says this repo
has refused three times. The character's job is to say *what you are actually eating on Thursday*,
and three words cannot.

---

## D2. How a recipe says it does not keep

This is the case the ticket is most interested in — *"the things that obviously do not keep, which
are as useful as the things that do"* — and it is `washing-up: nothing` one field along.

### Options

**(a) Zero with a unit.** `>> keeps: 0 days — …`. Parses for free, and nobody would write it. A
field a cook cannot say out loud has already failed the house test.

**(b) Leave the line off.** Conflates *does not keep* with *nobody has looked*, which is the exact
distinction `washing-up` spent 30 lines of comment defending. Rejected: this ticket's most valuable
answers would become indistinguishable from silence.

**(c) A keyword, whole-line, in the duration slot.**

```cooklang
>> keeps: not at all — the crust goes soft in the time it takes to sit down
```

**Chosen.** `not at all` and `no` are the accepted phrasings, matched on the duration half only and
after a case-fold. It reads as English, it lands in the slot the comparison already looks at, and
**the character is still required** — the negative answers are the ones a cook most needs the
reason for, since "does not keep" alone tells you nothing about whether the fix is the oven or
whether there is no fix.

The value carries `minutes: 0`, so *still good on Thursday* is one comparison over one number and
never a special case at the call site. Absent stays `null`. Three states, three values, exactly as
`washing-up` has them:

| The file says | `keeps` |
| --- | --- |
| nothing | `null` — nobody has looked |
| `not at all — …` | `{ text: 'not at all', minutes: 0, character: … }` |
| `3 days — …` | `{ text: '3 days', minutes: 4320, character: … }` |

Rejected inside (c): allowing the keyword *among* other words, e.g. `2 days, but not at all if you
sauced it`. Same reasoning as `washing-up`'s stray-`nothing` refusal — the strongest thing the
field can say should not be reachable by accident.

---

## D3. Freezing — **out of scope, and the line says so**

The ticket requires the decision to be made and argued. It is: **`keeps` is the fridge, covered, as
it is.** Freezing is not in it, and no second field is added by this ticket.

**The argument.** Three reasons, in order of weight.

1. **They are different questions with different answers.** Chili keeps four days in the fridge and
   three months in a freezer; a custard tart keeps two days in the fridge and does not freeze at
   all; bread is the opposite — stale by Tuesday, perfect from frozen. There is no ordering between
   the two answers, so one line carrying both would sometimes carry a contradiction. The ticket
   states the failure mode precisely: *one line that means two things is how a field stops
   comparing.*
2. **Only one of them is the request.** S-011's second situation is *six people, over three days*.
   Three days is a fridge question. A freezer answers a different request — *cook once, eat in a
   month* — which nothing on this site currently asks.
3. **The character half would break.** *"Better on the second"* is about the same dish a day later.
   Frozen-then-thawed is a different dish, and a sentence trying to describe both is the 250-character
   `slack` reason `voice.md` already dissected.

**What this costs, stated rather than hidden:** the collection cannot answer *what can I make now
and eat in March*. That is a real gap and it is a future field (`freezes:`), not a corner of this
one. Recorded in the README so the next author does not quietly widen this line into it.

**How it is enforced.** A **warning, never an error**, when a `keeps` character mentions the
freezer: `check-recipes.mjs` prints *"keeps: mentions the freezer — `keeps` is the fridge…"*. Same
strength as `unaccountedCookware`, and for the same reason: it is a guess about what an author
meant, and a guess that fails a build has no credibility. Rejected: making it an error (a sentence
like *"unlike its frozen version, this one…"* is legitimate and rare, and refusing it would teach
authors to write around the checker).

---

## D4. The framing — this is not a food-safety field

The ticket's sharpest constraint: *"a confident wrong number could make somebody ill."* Three
places take the weight, and none of them is a disclaimer stapled to a recipe page.

**1. The words in the file.** The value is not a shelf life because it does not stand alone —
the character is mandatory and the check enforces it. A field that cannot be written as a bare
number cannot be read as a safety window. The mechanism *is* the framing; this is the same move
`slack` made when it refused a level with no reason.

**2. The label on the page.** `<dt>` reads **"Does it keep"** — a question a cook asks, in the
grammar the two panels above it already use (*"If you get it wrong"*, *"What you'll wash"*).
Rejected: *"Shelf life"* (the exact claim being refused), *"Safe for"* (worse), *"Storage"*
(category jargon, and the user-global brand voice rules it out), and *"Still good for"* (reads as
a guarantee about a duration, which is the half we are trying to de-emphasise).

**3. The README, in plain words.** Following the S-007 precedent named in the ticket — that story's
whole finding was that a frame can make a claim its individual files never make, and that the fix
is structural. The section will say, without hedging: *this line is about whether the dish is still
worth eating, not about whether it is safe to eat. It is one cook's judgement of a dish, not a
food-safety window, and nothing on this site is one. If you are not sure whether something is safe,
this field cannot help you.* Plus the operative instruction, which is the one that actually
prevents harm: **where the answer is uncertain, leave the line off.**

Rejected: a per-recipe rendered footnote. It would print on every annotated page, say the same
thing 90 times, and — by protesting — make the field look more like a safety claim than the plain
sentence does. `voice.md`'s second house test: if it does not change how you cook it, it is the
site explaining itself, and that goes nowhere.

---

## D5. Where it renders, and the cap

**Renders in `Timeline.astro`, immediately under `washing-up`**, third in the family of authored
facts, sharing the existing `.slack, .washing-up` selector list (which becomes a three-way list).
The ticket says *"rendered where `slack` renders"*; the CSS comment says two facts of the same kind
written to the same grammar must not be allowed to drift apart, and this is a third of them.

```jsx
{keeps && (<dl class="keeps">
  <dt>Does it keep</dt>
  <dd><b>{keepsWord(keeps)}</b> — {keeps.character}</dd></dl>)}
```

`keepsWord()` prints the author's own span, capitalised — *"3 days"*, *"Not at all"* — the same
contract `slackWord()` has: capitalisation only, the words are the author's. No colour keyed to the
value, matching the panel's stated rule.

**The cap.** `check-recipes.mjs` gains `'keeps character'`, measured off what this ticket writes
rather than asserted: the number and the measurement go in the comment beside it, as every other
cap does. `voice.md` asks for one breath ≈ 120 characters; `slack reason` sits at 200 because it
was ratcheted onto 304 pre-existing lines. This field has no legacy to accommodate, so it gets the
tighter number the house actually wants. **Set at 150**, with the measured distribution recorded in
`plan.md` and the final figures in `review.md`. A cap is the only thing standing between this field
and the 172,003 characters `voice.md` counted that nobody has ever read.

---

## D6. Which recipes get annotated, and how the answer is decided

Not a code decision, but it is where the ticket's risk actually lives.

**The rule for writing one, in the order it is applied:**

1. **Does the dish have a texture that is the dish?** Crust, crisp, foam, a just-set egg, a sauce
   held by emulsion, rice with a bite. If yes, the answer is *not at all* or a short span with the
   loss named. This is the fried food, the risotto, the air fryer shelf.
2. **Does it improve?** Stews, chilis, curries, braised beans, anything whose seasoning wants time.
   Say so, because *better on the second* changes when a cook makes it.
3. **Is there a specific thing that goes wrong first?** Potatoes going grainy, greens going drab,
   dairy splitting on reheat, a broth's fat setting. Name that thing rather than the duration.
4. **If none of the above can be said honestly, leave the line off** and record it in the work
   artifact with the reason. The ticket asks for the count of these and says why: *a low one means
   somebody guessed.*

**Scope**, per the acceptance criteria: the 118 files on One Pot / Instant Pot / The Slow Cooker,
the four deep-fried wok recipes from `docs/gaps/one-pot.md`, and the air fryer shelf where those
files already state the answer themselves. Target ≥60 annotated; the undeclared remainder is listed
with reasons.

Two categories inside the 118 that are their own case and are handled explicitly rather than lumped
in: **the seven stocks and broths** (a different keeping question from a dinner — a stock is an
ingredient, and its answer is about the fat cap and the gel, not about whether you want to eat it),
and **`lengua`'s existing `slack` line**, which already carries a keeping fact. That line is not
edited — the criteria forbid changing any other line of any recipe — but the overlap is noted so a
later ticket can move it to where it belongs.

---

## What Design deliberately did not decide

- **A `keeps` filter or sort on the plan page.** S-011 gives that to T-011-06. This ticket makes
  the fact readable; it does not spend it.
- **Search.** `keeps` is not added to `search.json` — nobody searches for "3 days".
- **A `variants` roll-up** like `washingUpCount`. The comparison *this one keeps and its slow-cooker
  sibling does not* is real and is not this ticket's; the same trap applies (one number beside a
  silent sibling reads as a claim about the silent one) and it would need every variant declared.
