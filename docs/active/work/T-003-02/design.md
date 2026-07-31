# T-003-02 — Design

Five decisions: what the field is called, what the legal levels are, how one line carries
both parts, where the reading lives, and where it draws. Each is weighed against the
codebase as Research found it.

---

## Decision 1 — the field is called `slack`

```cooklang
>> slack: forgiving — an extra hour in the pot changes little
```

**Considered**

| Name | Why not |
| --- | --- |
| `slack` | ✅ chosen |
| `forgiveness` | Abstract noun; nobody says "this recipe's forgiveness is high". |
| `margin` | Finance/engineering. The user-global voice rules out that register. |
| `risk` | Names a probability the field does not carry. The field names a *consequence*. |
| `fail` / `failure` | Reads as "this recipe failed", i.e. a build state, not a property. |
| `if-late` | Only covers timing. Half the real failures are temperature or technique. |

`slack` is the word the story and the ticket already use — *"how much slack a recipe gives
you"* — and it is ordinary English outside the kitchen as well as in it ("there's no slack in
that schedule"). Opening a `.cook` file cold, `>> slack: forgiving — …` explains itself in
one read, which is the acceptance criterion. It is also short enough to sit in the same
column as `>> dish:` and `>> kit:` without the metadata block going ragged.

## Decision 2 — three levels: `forgiving`, `narrow`, `unforgiving`

These are the whole controlled vocabulary. Lower-cased in the file, compared lower-cased.

- **`forgiving`** — the window is wide, and being late costs little or nothing. Braises,
  long ferments, stocks, most slow-cooker work.
- **`narrow`** — there is a real window and you have to hit it. Miss it and the dish is
  noticeably worse, but it is still dinner. Pasta, a roast to a temperature, a sear, a proof
  that overruns.
- **`unforgiving`** — miss it and it is gone: broken, ruined, or unsafe. It does not come
  back and there is no fixing it in the next step.

**Considered and rejected**

| Set | Why not |
| --- | --- |
| `forgiving` / `fussy` / `unforgiving` | `fussy` names *labour*, not slack — a fiddly recipe with a wide window is fussy but forgiving. The clock's "Needs you" figure sits two lines above this one, so a labour word here invites exactly the wrong reading, and the three writer tickets copying these examples would mis-tag on the wrong axis. This was the leading candidate until that clash surfaced. |
| `forgiving` / `tight` / `unforgiving` | `tight` is the true antonym of slack and reads beautifully — but a tight dough and a tight sauce are both established cooking senses, and both are about texture. |
| `wide` / `narrow` / `none` | A scale wearing adjectives. The ticket rules out a scale. |
| `easy` / `medium` / `hard` | The thing the ticket explicitly says not to build. |
| `forgiving` / `unforgiving` (two) | Collapses to a flag. The ticket names this failure directly: the middle case is where most of the collection actually sits. |

`narrow` carries no competing cooking sense, so the only way to read it is *the window is
narrow* — the right axis, unambiguously. Mixing a width word between two forgiveness words is
a slight metaphor clash, and it is the price paid for the middle level being unmisusable.
The ordering `forgiving → narrow → unforgiving` is obvious from the words alone, which is
what a filter needs.

The middle level carries real information: it is the difference between *"pull it at twelve
minutes or the pasta is soft"* and *"the custard breaks past 82°C and will not come back."*
One is a worse dinner; the other is no dinner. A cook planning an evening treats those
completely differently, and that difference is the whole reason for a third level.

## Decision 3 — one line: first word is the level, the rest is the reason

```cooklang
>> slack: forgiving — an extra hour in the pot changes little
>> slack: unforgiving — the custard breaks past 82°C and will not come back
```

**Rule.** Trim the value. The first whitespace-delimited token is the level, lower-cased.
Everything after it is the reason, trimmed, with one leading separator character
(`—`, `–`, `-`, `:`, `,`) and any space around it removed. An empty remainder is no reason.

**Considered**

| Shape | Why not |
| --- | --- |
| Two keys: `>> slack:` + `>> slack-reason:` | Splits one property across two lines an author can drift apart, and reads like a form rather than a sentence. The checker's job gets marginally easier; the file gets worse. `dish`/`kit` are two keys because they are two facts. |
| A required em dash | Correct-looking and hostile to type. An author who writes `-` or `:` gets a validation error over punctuation, which is the checker spending its credibility on nothing. |
| Split on the first comma | Reasons contain commas, and `splitList()` already means "comma-separated list" everywhere else in this repo. |
| The level as the key (`>> forgiving: …`) | Three keys for one property; an unknown level becomes an unrecognised metadata key, which nothing can detect. |

Because the split is on whitespace, **every level must be a single word** — which the
vocabulary above already is, and which this decision now pins as a constraint on it.

Accepting any of five separators, or none at all, is the same discipline the rest of the
repo applies to reading a file: be liberal about how a human wrote it, strict about what it
means. The *level* is validated ruthlessly; the punctuation joining it to its reason is not
worth an error.

## Decision 4 — the reading lives in a new `src/lib/slack.ts`

A dedicated module holding the vocabulary, the reader, and nothing else. Modelled on
`time.ts`: domain vocabulary plus pure readers, importable by the `.mjs` scripts (Node strips
the types) and by `.astro` components alike.

**Considered**

- *Inline in `normalise.mjs`* — then `check-recipes.mjs` cannot reuse the vocabulary for its
  error message without duplicating it, and nothing is unit-testable. Rejected.
- *Added to `meta.ts`* — plausible; `meta.ts` is the home of small metadata readers. But
  `meta.ts` is documented as "readers for the comma-separated metadata lines", this reader is
  not one of those, and the module also has to own the display word for the render. A
  15-line file with a clear name beats stretching an 11-line one. Rejected, narrowly.
- *In `src/data/*.json`* — the counters precedent, but `src/data/counters.json` is owned by
  another ticket and a three-word vocabulary does not need a data file. Rejected.

**The reader returns a reading, not a throw**, because two callers need different things
from the same parse:

```ts
export type SlackLevel = 'forgiving' | 'narrow' | 'unforgiving';
export const SLACK_LEVELS: readonly SlackLevel[];
export interface Slack { level: SlackLevel; reason: string; }

/** `slack` is only set when the line is whole; `problem` says what is wrong when it is not. */
export interface SlackReading { slack: Slack | null; problem: string | null }
export function readSlack(value: string | null | undefined): SlackReading;
```

Four outcomes, and they are distinct on purpose:

| Input | `slack` | `problem` |
| --- | --- | --- |
| absent / blank | `null` | `null` — absence is not a fault |
| `forgiving — an extra hour…` | the pair | `null` |
| `gentle — …` | `null` | unknown level, **naming the legal values** |
| `forgiving` | `null` | a level with no reason, saying what a reason is for |

A bad line never yields a half-built value: `slack` is either whole or null, the same way
`authorMinutesOf()` returns null rather than a half-read duration and `minutesOf()` returns
null rather than guess at a unit.

## Decision 5 — validated twice, rendered once

**Validation** follows the counters precedent exactly, and the checker's own comment says why
both places exist: *"validated here as well as in parse-recipes.mjs, so that someone
classifying one folder finds their typo without building the whole collection."*

- `scripts/check-recipes.mjs` pushes `problem` onto `problems[]` → `FAIL` with the reason and
  the legal values, per file, without building anything.
- `scripts/parse-recipes.mjs` throws on the same problem → a malformed slack line cannot
  reach `recipes.json`, so no component ever has to defend against one.

**Rendering** goes *inside* `src/components/Timeline.astro`, after the notes and before the
axis. Alternatives weighed:

- *A new `Slack.astro` beside `<Timeline>` in `[slug].astro`* — less coupling, but a whole
  clay card carrying one sentence, and "next to the clock" becomes "under the clock's card".
- *A fourth chip in the `.chips` row* — a chip fits a word, not a reason, and the value is
  entirely in the reason.
- *A third `.stat` in the `dl.stats`* — those two blocks are 8.5rem numbers in a flex row; a
  sentence squashes them. Also `.stats` is not rendered at all when a recipe times nothing,
  and such a recipe can still declare slack.

Inside the clock panel is what the ticket asks for literally — the clock says how long and
how much of it needs you, this says what happens if you slip, and the three are one panel of
facts about the recipe that stays on screen whichever pane is showing. It reuses the `.stat`
well treatment so it reads as the same family, at full width so the reason has a line.

Shape:

```
If you get it wrong
Forgiving — an extra hour in the pot changes little
```

`If you get it wrong` is the ticket's own framing of the question and is plain at a kitchen
table; it also covers the failures that are not about lateness (temperature, technique),
which `If you're late` would not.

**Absence renders nothing.** One guard, `{slack && (…)}`, on the whole block — no label, no
well, no dash. That is already how `notes`, `note`, `legend` and `.aka` behave in this
component; a missing line here will look like every other thing this codebase declines to
say. With 514 files predating the field, absence is the default state of the page, and the
page has to look finished in it.

**Colour is not the signal.** The panel's rule 3 — colour is the fourth signal, never the
first — holds: the level is a word in display type, and `data-level` exists on the element
for a future filter to hook, not to drive a traffic light. No red, no alarm.

## What is deliberately not built

- **No derivation, ever.** Nothing reads timers, step count or ingredient count. A
  five-minute custard is less forgiving than a six-hour braise, and any formula that gets
  that backwards is worse than nothing. `slack` enters the system from one place: a line a
  human wrote.
- **No default level.** An undeclared recipe is `null`, not `forgiving`. Silence is not a
  promise, and this field's whole job is to stop the site making promises it cannot keep.
- **No filtering, search or menu grouping yet.** The vocabulary is controlled so those become
  possible; building them now would be inventing a UI no ticket asked for. `data-level` and
  the exported `SLACK_LEVELS` are the seams they will use.
- **Not carried into `plan.json` or `search.json`.** Out of scope for this ticket; both read
  `RawRecipe`, so both can pick it up with one line when something needs it.
- **No length or style check on the reason.** Non-empty is enforceable; "is this a real
  failure or filler" is a review judgement. The eight worked examples are the standard the
  three writer tickets copy, which is the mechanism the story chose for that.
