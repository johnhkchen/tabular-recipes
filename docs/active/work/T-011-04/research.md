# T-011-04 — Research

*Does it keep.* What exists today, where it lives, and what the two fields that came before this
one already settled. Descriptive only — no proposals.

---

## 1. The question this ticket answers, and where it came from

`docs/knowledge/scaling.md` (T-011-01, 521 lines) closes with the thing its own model could not
see. §8 works the query *six people, over three days* and lands on `chili-con-carne`, then flags
its own runner-up:

> **`beef-with-broccoli` scores better on the table and is the wrong answer.** *Over three days*
> smuggles in a second question — **does it keep** — and a stir-fry does not survive to Thursday.
> That is a separate fact from scaling, S-011 says so, and T-011-04 owns it.

and again in §9's *what this file could not settle*:

> **Whether a dish keeps is not a scaling question.** It decides one of S-011's two situations and
> the model cannot see it.

So the gap is stated by the dependency, not inferred. Nothing in `src/generated/recipes.json`
carries it: the 23 fields on a recipe are listed in §3 below and none of them is about the day
after.

---

## 2. The two fields this one is shaped like

Two authored properties already exist and they were built two tickets apart to the same pattern.
Reading them is most of the research, because the ticket says "follow the path the other
properties took".

### `slack` — `src/lib/slack.ts`, 99 lines

- A closed vocabulary (`forgiving | narrow | unforgiving`) plus a free-text reason.
- **The reason is required.** `readSlack('forgiving')` returns `{slack: null, problem: 'slack
  "forgiving" gives no reason — name the actual failure…'}`. The file's own header says why: *"a
  level without a reason is not a reading"*.
- Liberal about punctuation, strict about meaning: the separator between level and reason may be
  `—`, `–`, `-`, `:`, `,` or nothing, and a dash inside the reason is not eaten
  (`/^(\p{L}+)\s*[—–:,-]?\s*([\s\S]*)$/u`).
- Absent is legitimate and common. **416 of 685 recipes declare one**; 269 do not.
- Printed through `slackWord(level)`, which capitalises and changes nothing else.

### `washing-up` — `src/lib/washing-up.ts`, 198 lines

- A comma-separated list of things; **the count is `items.length`, derived here and nowhere else**,
  so the number and the list can never disagree.
- **Absent (`null`) and zero (`{items: [], count: 0}`) are different answers and are different
  values.** `readWashingUp` therefore distinguishes `undefined` from `''`, which is the one place
  it parts company with `readSlack`.
- `nothing` / `none` is the whole line or none of it; a numeric entry ("2", "3 items") is refused
  outright because it is the one shape the field exists to forbid.
- Two **advisory** checks that warn and never fail: `unaccountedCookware()` (a `#thing{}` the line
  never mentions) and `pluralEntries()` ("two mixing bowls" is one entry and two things).
- **177 of 685 recipes declare one.**

The shared shape, in the words both files use: *whole, or nothing — and when it is nothing, what
to tell the person who wrote the line.* Both readers hand back `{value, problem}`; the problem is
a diagnostic, never a fact.

---

## 3. The pipeline a new property has to walk

Five stops, in this order. Each one is a few lines, and the ordering is what makes a half-declared
field impossible to render.

| Stop | File | What it does for `slack` / `washing-up` |
| --- | --- | --- |
| 1. read | `src/lib/{slack,washing-up}.ts` | the pure reader; the only place the line is interpreted |
| 2. promote | `scripts/normalise.mjs` | calls the reader off `metadata`, puts the value and its problem on the recipe, and deletes the key from `PROMOTED` so it is not also a loose metadata fact |
| 3. type | `src/lib/tree.ts` | `RawRecipe.slack: Slack \| null` + `slackProblem?: string \| null` |
| 4. refuse | `scripts/parse-recipes.mjs:52-60` | throws on any problem, so a half-declared field never reaches a page |
| 4b. report | `scripts/check-recipes.mjs:147-152` | prints the same problem per file, so one folder can be fixed without building everything |
| 5. render | `src/components/Timeline.astro:314-334` | `{slack && (<dl…>)}` — one guard over one value |

Two details of stop 2 that matter:

- `normalise.mjs` builds `metadata` from `recipe.raw_metadata?.map`, reads the promoted fields off
  it, **then** deletes the promoted keys. `washing-up` is read *before* the delete and its raw value
  is passed through `undefined`-or-not on purpose.
- `PROMOTED` is a literal `Set` of eleven keys: `title, category, tags, counters, dish, kit, aka,
  pairs-with, slack, washing-up`. Anything not in it survives as a free metadata row on the page.

Stop 5's grammar, verbatim from `Timeline.astro`:

```jsx
{slack && (<dl class="slack" data-level={slack.level}>
  <dt>If you get it wrong</dt>
  <dd><b>{slackWord(slack.level)}</b> — {slack.reason}</dd></dl>)}

{washingUp && (<dl class="washing-up">
  <dt>What you'll wash</dt>
  <dd><b>{washingUpWord(washingUp.count)}</b>{washingUp.count > 0 && <> — {…}</>}</dd></dl>)}
```

Both `<dt>`s are a question or a plain noun phrase a cook would say; both `<dd>`s are **a short
bold half and a sentence after it**. The CSS is one selector list covering both
(`Timeline.astro:521-548`), with the comment: *"if they were allowed to drift apart the page would
say they are different kinds of thing"*. There is a `@media print` rule naming both, and no
colour keyed to the value — *"a traffic light over someone's dinner would be alarm rather than
information"*.

---

## 4. The checker, and the caps

`scripts/check-recipes.mjs` has two jobs: whether a file draws a table (fails the build), and how
much each place that carries words says (also fails the build — `CAPS_FAIL_BUILD = true`).

```js
const CAPS = {
  'operation cell': 70,   'step body': 150,   'prose row': 120,
  'slack reason': 200,    'ingredient note': 80,
};
```

Every cap carries the measurement it was read off, in a comment beside it. `slack reason` is 200
because *"65% of the reasons written so far sit between 225 and 299 … 200 is the last point below
that pile"*. The file states the rule for adding to this table: *"If a cap is wrong, move the cap
and say what you measured; do not carve out the file that disagrees with it."* There is no skip
list and no waiver.

`measure()` only checks `recipe.slack.reason` today; a second free-text field would be measured in
the same function or be the only unmeasured prose on the page.

---

## 5. What a duration would be read with

`src/lib/time.ts` already owns the one number-plus-unit reader in the repo:

```ts
const PER_MINUTE = { sec…: 1/60, min…: 1, hr/hour/hours/h: 60, day/days/d: 1440, week/weeks: 10080 };
export function minutesOf(value: number | null, unit: string | null): number | null
```

It returns `null` for a unit it does not understand, rounds to two decimals, and is used by
`normalise.mjs` for every cooklang timer. `formatDuration(minutes)` is its inverse for printing
("2 days", "4 hr 35 min"). Days and weeks are already in the table, so a keeping span is expressible
in the unit the rest of the site compares in.

---

## 6. The shelves this ticket has to read

Counter tallies from `src/generated/recipes.json` (685 recipes):

| Counter | Recipes |
| --- | ---: |
| One Pot | 73 |
| Instant Pot | 25 |
| The Slow Cooker | 20 |
| **union of the three** | **118** |
| The Air Fryer & the Pot | 21 |

The union is 118 rather than 118 because no recipe sits on two of the three: the Instant Pot and
slow-cooker files are `-instant-pot` / `-slow-cooker` variants of One Pot dishes and carry only
their own counter. The composition:

- **One Pot (73)** — 41 stews and braises, 16 soups, 9 rice-and-bean dishes, 3 egg dishes, 2 pasta,
  plus `beef-stroganoff`, `country-fried-steak`, `egg-foo-young`.
- **Instant Pot (25)** — 13 braises, 7 broths and soups, 5 bean dishes. Seven of them are *stock*
  (`chicken-broth`, `chintan-broth`, `pho-broth`, `tonkotsu-broth`, `ham-hock-stock`), which is a
  different keeping question from a dinner.
- **The Slow Cooker (20)** — 19 braises plus `boston-baked-beans-slow-cooker`.

Two members of One Pot are already the interesting negative cases: `risotto-alla-milanese` (the
texture is the dish) and `country-fried-steak` (a crust).

**The four deep-fried wok recipes** named in `docs/gaps/one-pot.md:15-21` —
`general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` — came *off* the
One Pot shelf, so they are not in the 118. The page's reason for throwing them off is the same
observation this ticket needs: *"not a pot the file forgot to name, but a quart of frying oil, a
dredging bowl, a draining rack and a second bowl for the glaze"*. They live at the Takeout Counter.

**The air fryer shelf (21 files, S-008)** states reheating as part of what it is for.
`air-fryer-reheated-pizza` is a recipe *for* leftovers: `>> tags: pizza, leftovers, reheat…`, and
its full-width row already says *"Cold slices from the fridge, one layer — a stacked slice steams
the one below."* The shelf is otherwise crisp things — chips, wings, tofu, halloumi, chickpeas.

---

## 7. What the collection already says in prose

A grep for keeping language across `recipes/**`:

- 20 files contain *next day*, *keeps* or *leftover* somewhere in their prose or tags.
- `recipes/stews-and-braises/lengua.cook:9` carries it **inside `slack`**:
  *"the skin comes off a hot tongue in one piece and off a cooled one in shreds, and reheating does
  not get it back"* — a keeping fact filed in the failure field because that was the next empty box.
  `docs/knowledge/voice.md` describes exactly this mechanism ("One fact, three lengths") and its
  third house test is **say it once**.
- `air-fryer-reheated-pizza` is the only file whose entire subject is the answer.

So the fact is in the collection, unreadable, in the same way S-011 says batching was.

---

## 8. Constraints this ticket inherits

**From the ticket itself.**

- The character alongside the duration is required; a bare number fails the check.
- The README must say plainly that this is not a food-safety claim, with the S-007 precedent named:
  the tradition's reasoning recorded as the tradition's reasoning, never as a claim about a body.
- Absent is fine and will be the common answer.
- The freezing decision must be made **and argued** — one line that means two things is how a field
  stops comparing.
- Where the answer is uncertain, leave it off; list those and **state the count**.
- ≥60 annotated; the four fried recipes annotated; nothing else in any recipe file changes.

**From the repo.**

- `docs/knowledge/voice.md`: five places carry words and each does a different job; a fact goes in
  exactly one of them. One breath is nearer 120 characters than 200.
- `S-011`: *never fabricate a number*, and *absent is a legitimate answer* — a value on every file
  would mean somebody guessed.
- `CLAUDE.md` / user-global: plain kitchen-table English on anything a visitor reads.
- `npm run verify` = `check` → `recipes` → `vitest run` → `astro build`. `src/generated/` is
  gitignored, so the regenerated JSON is never committed.

---

## 9. Working-tree state at the start of this ticket

`scripts/normalise.mjs`, `scripts/check-recipes.mjs` and `scripts/parse-recipes.mjs` are **dirty in
the working tree** with T-009-04's step-reference wiring (`readStepRefs` / `refProblems`, +22 lines
across the three). `src/lib/step-refs.ts` is committed at `HEAD` (`b6b425c`); the wiring is not.
`.lisa/attempts/` shows T-011-02 and T-009-04 with open attempt directories.

This ticket has to touch all three of those files, which is a shared-file overlap the DAG does not
model — `T-011-04 depends_on: [T-011-01]` only. It is recorded here because it constrains how
`lisa commit-ticket --include` behaves at Implement time, not because anything about the design
changes.

---

## 10. Open questions Research does not answer

1. What the duration half is allowed to be, and whether it is parsed to a number at all.
2. How a recipe says *it does not keep* — the `washing-up: nothing` problem, one field along.
3. Whether freezing is one line, two lines, or out of scope.
4. Whether the character half gets a cap in `check-recipes.mjs`, and what it is measured against.
5. What the `<dt>` says, given that the label itself is where a food-safety claim would sneak in.

All five are Design's.
