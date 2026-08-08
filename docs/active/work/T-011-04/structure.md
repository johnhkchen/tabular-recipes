# T-011-04 — Structure

File-level blueprint. Two files created, six modified, plus one new line in each annotated `.cook`.
Nothing deleted.

---

## The change list

| File | Action | Size | Why |
| --- | --- | ---: | --- |
| `src/lib/keeps.ts` | **create** | ~110 lines | the one reader |
| `src/lib/keeps.test.ts` | **create** | ~150 lines | the three required tests plus the collection sweep |
| `src/lib/tree.ts` | modify | +12 | `RawRecipe.keeps`, `keepsProblem` |
| `scripts/normalise.mjs` | modify | +12 | promote the line, delete the key |
| `scripts/parse-recipes.mjs` | modify | +1 | throw on `keepsProblem` |
| `scripts/check-recipes.mjs` | modify | +20 | report the problem, cap the character, warn on the freezer |
| `src/components/Timeline.astro` | modify | +18 | the third panel |
| `README.md` | modify | +40 | the field, the framing, the freezing decision |
| `recipes/**/*.cook` | modify | +1 each | one `>> keeps:` line, nothing else |

**Ordering matters and is fixed:** reader → type → promote → refuse → report → render → annotate →
document. Every step before *annotate* is inert on a collection with no `keeps` line anywhere, so
each one can land and be verified on its own.

---

## 1. `src/lib/keeps.ts` (new)

The only place a `>> keeps:` line is interpreted. Pure, no I/O, no imports beyond `minutesOf`.

```ts
import { minutesOf } from './time.ts';

export const NOT_AT_ALL = ['not at all', 'no', 'not'] as const;

export interface Keeps {
  /** The span in the author's own words: "3 days". "not at all" when it does not keep. */
  text: string;
  /** The same span in minutes, so "still good on Thursday" is a comparison. 0 = it does not. */
  minutes: number;
  /** Never empty. A duration with nothing after it is a shelf life, and this site does not make one. */
  character: string;
}

export interface KeepsReading {
  keeps: Keeps | null;
  /** Null when the line is absent (which is fine) or whole. */
  problem: string | null;
}

export function readKeeps(value: string | null | undefined): KeepsReading;
export function keepsWord(keeps: Keeps): string;
```

**Internal organisation, in the order the reader runs:**

1. Absent (`undefined`, `null`, `''`, whitespace) → `{keeps: null, problem: null}`. Unlike
   `washing-up`, an empty line is *absent* rather than an error, because this field has no
   `nothing`-shaped value to be reached by accident — its zero is spelled out in words and still
   needs a character after it.
2. `SPAN = /^(\d+(?:[./]\d+)?)\s*(\p{L}+)\b/u` off the front. If it matches, `minutesOf(value, unit)`
   decides whether the unit is a duration; `null` back means the unit is not one, which is a problem
   naming the units that are.
3. No span → try the `NOT_AT_ALL` phrases against the leading words, longest first, whole-phrase and
   case-folded. `text` is normalised to `not at all` regardless of which was written, so the printed
   word does not wobble between files; `minutes = 0`.
4. Neither → problem: *"keeps starts with "…", which is not a length of time"*, listing both legal
   openings and an example of each.
5. Separator: one of `—` `–` `-` `:` `,` or nothing, spaced or not, consumed once. The remainder is
   the character, trimmed, dashes of its own intact.
6. Empty character → the problem this whole field exists for, and its message says so: *"keeps "3
   days" says nothing about what it is like when you come back to it — a duration on its own is a
   shelf life, and this site does not make those."*

**`keepsWord(keeps)`** capitalises the first letter of `text` and changes nothing else — the same
contract `slackWord` has. `Not at all` and `3 days` both come out of it.

**Not in this file:** anything that compares a `keeps` against a request (T-011-06's), anything that
renders (Timeline's), and any list of units of its own (time.ts's).

---

## 2. `src/lib/tree.ts` — the type

Two fields on `RawRecipe`, placed directly after `washingUpProblem` so the three authored properties
read as a block, with the same comment discipline the two above them have:

```ts
/**
 * How long it stays good and what it is like when you come back to it. Authored, never
 * derived — nothing about a dish's afternoon can be read off its steps. Null is the common
 * and honest answer, and `minutes: 0` is a recipe that says outright it does not keep.
 */
keeps: Keeps | null;
/** What is wrong with a `>> keeps:` line that is there but not whole. A diagnostic, not a fact. */
keepsProblem?: string | null;
```

Plus `import type { Keeps } from './keeps.ts';` alongside the existing `Slack` / `WashingUp` type
imports. No other change to `tree.ts` — the tree itself does not know about this.

---

## 3. `scripts/normalise.mjs` — promotion

Three edits, all in the existing pattern:

1. `import { readKeeps } from '../src/lib/keeps.ts';` — alphabetically, before `readSlack`.
2. After the `washing-up` read and before `PROMOTED`:

```js
/*
 * Whether the dish is still worth eating tomorrow, and what it is like then. Authored, never
 * derived — no timer, step or ingredient knows what a fridge does overnight. Read before
 * PROMOTED deletes the key. A duration with no character reads as no keeps at all and hands
 * back why, which check-recipes prints and parse-recipes throws on.
 */
const { keeps, problem: keepsProblem } = readKeeps(metadata.keeps);
```

3. `'keeps'` added to the `PROMOTED` set, and `keeps` / `keepsProblem` on the returned object with a
   one-line doc comment matching its neighbours.

**Boundary:** `normalise.mjs` reads and promotes; it never validates beyond what the reader says.

---

## 4. `scripts/parse-recipes.mjs` — refusal

One line, into the existing loop at `:52-60`:

```js
recipe.keepsProblem,
```

placed after `recipe.washingUpProblem`. This is what makes a half-declared field unreachable from a
page: the build throws before `recipes.json` is written.

---

## 5. `scripts/check-recipes.mjs` — reporting, capping, warning

Four edits.

**(a) The cap**, into `CAPS`, with its measurement named beside it as every other entry has:

```js
// The character half. This field has no legacy to ratchet onto — every line under it was
// written by T-011-04 — so it gets the number voice.md actually asks for rather than the
// one slack's 304 pre-existing reasons forced. <N> lines written, mean <x>, p95 <y>, max <z>.
'keeps character': 150,
```

The three figures are measured at Plan/Implement time and written in; they are not guessed here.

**(b) The problem**, beside the other two authored fields:

```js
// A keeps line that is there but not whole — a duration with nothing after it, most often.
if (recipe.keepsProblem) problems.push(recipe.keepsProblem);
```

**(c) The measurement**, inside `measure()` beside the `slack` line:

```js
if (recipe.keeps) check('keeps character', recipe.keeps.character.length, 'keeps:', recipe.keeps.character);
```

**(d) The freezer advisory**, in the notes block with `unaccountedCookware` and `pluralEntries`, and
warning-strength for the same reason they are:

```js
if (mentionsFreezer(recipe.keeps)) notes.push('keeps: mentions the freezer — this line is the fridge…');
```

`mentionsFreezer()` is a small exported predicate in `keeps.ts` (`/\bfreez|\bfrozen\b/i` over the
character), so the pattern lives with the field and is testable, not buried in the script.

---

## 6. `src/components/Timeline.astro` — the third panel

Three edits, all mirroring what is already there.

1. Import: `import { keepsWord } from '../lib/keeps.ts';` after the `washingUpWord` import.
2. Frontmatter, after the `washingUp` const, with the comment that says what the field is *not*:

```js
/*
 * The fifth, and the one *six people over three days* turns on: whether the dish is still
 * worth eating on Thursday, and what it is like when you get there. Authored, null for almost
 * all of the collection. It is a cook's judgement of a dish and never a safety window — which
 * is why the duration cannot be written without the sentence that qualifies it.
 */
const keeps = recipe.keeps;
```

3. The block, immediately after the `washingUp` block:

```jsx
{keeps && (
  <dl class="keeps">
    <dt>Does it keep</dt>
    <dd><b>{keepsWord(keeps)}</b> — {keeps.character}</dd>
  </dl>
)}
```

4. CSS: `.keeps` joins the three existing selector lists (`.slack, .washing-up` at the block,
   `dt`, `dd`, `b`) and the `@media print` list. **No new rule and no new colour** — the panel's
   stated rule is that these are the same kind of fact, and a fourth selector list would say
   otherwise. The comment above the block gets "two facts" → "three facts".

---

## 7. `README.md` — the documentation

One new bullet in the optional-metadata list, directly after `washing-up`, plus one line in the
worked example block at the top of that section:

```cooklang
>> keeps: 4 days — better on the second, once the chile has settled into the fat
```

The bullet, ~35 lines, in the README's existing voice, covering in this order:

1. What the line is and where it renders.
2. **The two halves, and why the second is mandatory** — with the ticket's own two examples, which
   are both three days and different dinners.
3. **It is not a food-safety field.** Plain, unhedged, no more than four sentences, and it ends on
   the operative instruction: where you are not sure, leave the line off.
4. `not at all` — a real answer, and as useful as a long one.
5. **Freezing is a different question and is not in this line**, with D3's argument compressed to
   three sentences and the gap named as a future `freezes:` rather than a corner of this one.
6. Absent is the common answer.

Also: two rows in the file-map table near `:211` — `src/lib/keeps.ts`, and the caps table if
`voice.md`'s copy of it is in the README (it is not; `voice.md` is not this ticket's file and is not
edited).

---

## 8. `recipes/**/*.cook` — the annotations

**One line per file and nothing else.** Placement, in priority order: directly after
`>> washing-up:` if the file has one, else after `>> slack:`, else after `>> time:` / the last
`>>` line before the first blank. This keeps the authored block together and means the diff for
every annotated file is exactly `+1`.

Batches, which are also the commit units:

| Batch | Files | Character of the answers |
| --- | ---: | --- |
| A — the four fried | 4 | all *not at all*; the ticket's reference case |
| B — One Pot braises and stews | ~40 | mostly 3–4 days, many *better on the second* |
| C — One Pot soups, rice and beans | ~25 | the split between what improves and what goes to paste |
| D — Instant Pot | ~25 | includes the seven stocks, whose answer is about the gel and the fat cap |
| E — The Slow Cooker | ~20 | siblings of B; the answers differ where the method does |
| F — the air fryer shelf | ~12 | *not at all* and short spans, per what those files already say |

A file that cannot be answered honestly is skipped and recorded, not filled.

---

## 9. Test structure — `src/lib/keeps.test.ts`

Mirrors `slack.test.ts` exactly, which is the file a reviewer will read this against.

**`describe('readKeeps')`** — the unit half:

- reads a span and keeps the character as written (days, weeks, hours);
- **a bare duration fails** — `3 days`, `3 days —`, `2 weeks :` — and the problem names what is
  missing *(acceptance criterion)*;
- **a declaration with character parses** *(acceptance criterion)*;
- `not at all` / `no` → `minutes: 0`, `text: 'not at all'`, character still required;
- every separator, and a dash inside the character that is not eaten;
- a unit that is not a duration ("3 fortnights") is refused and the message names the legal units;
- a character with no duration ("better on the second") is refused;
- absent in all four shapes is silence, not a problem.

**`describe('keepsWord')`** — capitalisation only.

**`describe('mentionsFreezer')`** — fires on *freeze/freezer/frozen*, does not fire on *fridge*.

**`describe('keeps across the collection')`** — reads `../generated/recipes.json`, as `slack.test.ts`
does:

- every recipe is whole or null, never half-declared;
- **an undeclared recipe renders nothing** — the `null` guard the component's `{keeps && …}` stands
  on *(acceptance criterion)*;
- every declared line re-reads without a complaint;
- both kinds of answer exist in the collection, so a writer has one of each to copy;
- `declared.length >= 60` — the acceptance count, asserted rather than claimed;
- no character is under five words (the thin-reason test `slack` has);
- every declared `minutes` is either 0 or ≥ 60, since nothing is measured in minutes here.

---

## 10. What must not change

Enforced by reading the diff before each commit:

- No line of any recipe other than the one added.
- `src/generated/recipes.json` — gitignored; never staged.
- `docs/knowledge/voice.md`, `docs/gaps/**`, `src/data/counters.json` — not this ticket's.
- `src/lib/slack.ts`, `src/lib/washing-up.ts` — read, not edited.
- `scripts/normalise.mjs`, `check-recipes.mjs`, `parse-recipes.mjs` carry **T-009-04's uncommitted
  step-reference wiring** in the working tree (research §9). My edits to those three files are
  additive and in different regions; the overlap is a commit-time hazard, recorded in `plan.md` and
  reported in `review.md`.
