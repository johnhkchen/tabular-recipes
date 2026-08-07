# T-008-01 — Structure

The blueprint. Every file this ticket creates or modifies, the public surface of each, and the
order the changes have to land in. No code — shapes, signatures and boundaries.

---

## 1. The map

| File | Change | Owner of |
| --- | --- | --- |
| `src/lib/washing-up.ts` | **new** | The type, the only reader, the printing word, the cross-check. |
| `src/lib/washing-up.test.ts` | **new** | Unit tests, collection tests, one checker integration test. |
| `scripts/normalise.mjs` | modify | Reads the line, promotes the key, emits two fields. |
| `src/lib/tree.ts` | modify | Types `washingUp`, `washingUpProblem`, `variants[].washingUpCount`. |
| `scripts/parse-recipes.mjs` | modify | Throws on a problem; fills `washingUpCount` on variants; tally. |
| `scripts/check-recipes.mjs` | modify | Problem → `problems`; two advisories → `notes`. |
| `src/components/Timeline.astro` | modify | The fourth well, under `slack`. |
| `src/pages/[slug].astro` | modify | The variant switcher's all-or-nothing count. |
| `README.md` | modify | The authoring contract: field, two lines, the plate rule. |
| 11 × `recipes/**/*.cook` | modify | The worked examples. |

**Not touched, deliberately:** `src/data/counters.json` (ticket forbids it), `docs/knowledge/voice.md`
(outside permitted paths — design D7), `src/lib/plan.ts`, `src/lib/shopping.ts`,
`src/lib/counters.ts` (none enumerate recipe fields — Research §6).

---

## 2. `src/lib/washing-up.ts` — the new module

The whole field lives behind this file. Pure: no `fs`, no parser, no Astro. Mirrors
`src/lib/slack.ts` in size, header comment and export order, because the two fields are siblings
and a reader should meet one pattern twice.

### Header comment

Three paragraphs, in the register of `slack.ts:1-21`: what the field is, then the two rules that
hold the file up — **authored, never derived** (with the `#wok{}` evidence named) and **the count
is the list's length and is computed here and nowhere else**.

### Exports, in declaration order

```ts
/** The words that mean "this washes nothing", matched on the whole line only. */
export const NOTHING_WORDS: readonly string[]        // ['nothing', 'none']

/** Cookware that is bolted down or plugged in, and so never goes in a sink. */
export const NEVER_WASHED: readonly string[]         // oven, hob, stove, stovetop, range,
                                                     // grill, broiler, smoker, microwave,
                                                     // fridge, freezer, worktop, counter, sink

export interface WashingUp {
  items: string[];    // the author's words and order; empty means nothing
  count: number;      // items.length — the single derivation
}

export interface WashingUpReading {
  washingUp: WashingUp | null;   // null: never declared
  problem: string | null;        // null: absent (fine) or whole
}

/** `>> washing-up: the wok, a rack to drain on` → { items: [...], count: 2 }. */
export function readWashingUp(value: string | null | undefined): WashingUpReading

/** The derived count as it is printed: 0 → 'Nothing to wash', 1 → 'One thing', 5 → 'Five things'. */
export function washingUpWord(count: number): string

/** #thing{} marks the washing-up line does not account for. Advisory: never an error. */
export function unaccountedCookware(cookware: string[], washingUp: WashingUp | null): string[]

/** Entries that count as one thing and plainly mean several. Advisory. */
export function pluralEntries(washingUp: WashingUp | null): string[]
```

### `readWashingUp` — the decision table it implements

| Input | `washingUp` | `problem` |
| --- | --- | --- |
| `undefined`, `null` | `null` | `null` |
| `''`, `'   '` | `null` | **`'…is there but says nothing…'`** |
| `'nothing'`, `'  None '` | `{ items: [], count: 0 }` | `null` |
| `'the wok, a rack'` | `{ items: ['the wok','a rack'], count: 2 }` | `null` |
| `','`, `' , , '` | `null` | `'…is there but says nothing…'` |
| `'2'`, `'5 things'` | `null` | `'…a number, not a list…'` |
| `'3, 2'` | `null` | same |
| `'the jar, nothing'` | `null` | `'…"nothing" is the whole line or none of it…'` |

The distinction between the first two rows is **the key's presence**, which the caller supplies:
`normalise.mjs` passes `metadata['washing-up']`, which is `undefined` when the line is absent and
`''` when it is there and empty. This is the one behavioural difference from `readSlack`, which
folds both into absent (`slack.ts:66`), and it is deliberate: D3 forbids a fumbled line from
meaning zero.

Every `problem` string ends with a good example line, both forms — the list and the sentinel.

### `unaccountedCookware` — the matching rule

Normalise both sides (lowercase, strip leading articles, collapse whitespace, drop punctuation),
then a name is **accounted for** when it is a substring of any item, or any item is a substring of
it. A name in `NEVER_WASHED` (matched the same loose way) is dropped before the test. Returns the
original spellings, so a message can quote the file's own words. Never throws, never mutates.

### `washingUpWord` — printing

`['Nothing to wash','One thing','Two things', … 'Twelve things']`, then `${n} things` above twelve.
Capitalisation only, like `slackWord` (`slack.ts:97-99`).

---

## 3. `scripts/normalise.mjs`

Three edits, each beside its `slack` twin.

1. **Import** (after line 8): `import { readWashingUp } from '../src/lib/washing-up.ts';`
2. **Read** (after the `readSlack` call, ~line 212), with a comment in the file's register saying
   *authored, never derived* and naming the `#wok{}` case as the evidence:
   ```js
   const { washingUp, problem: washingUpProblem } = readWashingUp(metadata['washing-up']);
   ```
3. **Promote** (`PROMOTED`, line 215-217): add `'washing-up'`, so the key leaves loose `metadata`
   and stops rendering as an unclaimed fact.
4. **Emit** (return object, beside `slack`/`slackProblem`): `washingUp`, `washingUpProblem`.

`metadata['washing-up']` is read from the **already-copied** `metadata` object (line 107), not from
`recipe.raw_metadata`, so it is read before step 3 deletes it. Ordering inside the function is
therefore: read at ~212, promote at 215. Same as `slack`.

---

## 4. `src/lib/tree.ts`

Type-only. Three edits:

1. `import type { WashingUp } from './washing-up.ts';` beside the `Slack` import (line 9).
2. In `RawRecipe`, after `slackProblem` (line 63), with a doc comment carrying the field's rule:
   ```ts
   /**
    * What is in the sink when the food is on the table. Authored, never derived — `cookware`
    * counts what a recipe names, and a quart of frying oil names one wok. `null` is never
    * declared; `{ items: [], count: 0 }` is a recipe that genuinely washes nothing.
    */
   washingUp: WashingUp | null;
   /** What is wrong with a `>> washing-up:` line that is there but not whole. A diagnostic. */
   washingUpProblem?: string | null;
   ```
3. `variants` (line 68) gains a fourth member:
   ```ts
   variants: { slug: string; title: string; kit: string | null; washingUpCount: number | null }[];
   ```

`buildTree()` is untouched — the field is a fact about the recipe, not about the table.

---

## 5. `scripts/parse-recipes.mjs`

1. **Throw on a problem** — extend the existing `slack` block (lines 50-56) to cover both fields,
   keeping its section comment honest by renaming it to *the authored fields, which are whole or
   absent*. One loop, two checks, same message shape: `${recipe.path}: ${problem}`.
2. **Carry the count into variants** — the variant loop (lines 191-208) already has every sibling
   in hand:
   ```js
   .map((r) => ({ slug: r.slug, title: r.title, kit: r.kit,
                  washingUpCount: r.washingUp?.count ?? null }))
   ```
3. **Tally** — the closing summary (lines 223-226) gains ` · washing-up in N`, so a build says how
   far the annotation has got. One term, no new line of output.

---

## 6. `scripts/check-recipes.mjs`

Imports `unaccountedCookware` and `pluralEntries` from `../src/lib/washing-up.ts`.

**Fails** — one line beside `slackProblem` (line 154):

```js
if (recipe.washingUpProblem) problems.push(recipe.washingUpProblem);
```

**Warns** — a block placed after the counter loop and before `buildTree`, pushing to `notes`:

```
washing-up: names #Dutch oven{}, #skillet{} but the line mentions neither — add them,
            or they are things that are not washed (an oven, a hob, a foil-lined tray)
washing-up: "two mixing bowls" counts as one thing — write it as two entries, or the
            count under-reports
```

`notes` is printed under `ok` at line 183 and never increments `failed` (Research §5), so this is
"warns without failing" by construction rather than by convention. **`CAPS` is not touched** (D7).

---

## 7. `src/components/Timeline.astro`

1. Import `washingUpWord` beside `slackWord` (line 38).
2. A `const washingUp = recipe.washingUp;` beside `const slack` (line 269), with the same shape of
   comment: the fourth fact, authored, absent draws nothing.
3. Markup, immediately after the `slack` block (lines 300-309), so the four facts read top to
   bottom in the order the story's table lists them:
   ```astro
   {washingUp && (
     <dl class="washing-up">
       <dt>What you'll wash</dt>
       <dd>
         <b>{washingUpWord(washingUp.count)}</b>
         {washingUp.count > 0 && <> — {washingUp.items.join(', ')}</>}
       </dd>
     </dl>
   )}
   ```
4. CSS: `.washing-up` joins `.slack`'s existing selector list rather than duplicating the rules —
   `.slack, .washing-up { … }` for the well, the `dt`, the `dd` and the `b`, and `.washing-up` is
   added to the `@media print` group at line 830. Zero new declarations; the two panels are the
   same object and must not be able to drift apart.

No `data-` attribute, no colour, no icon (D8).

---

## 8. `src/pages/[slug].astro`

Inside the existing `recipe.variants.length > 0` block (lines 83-96). One computed value above the
markup:

```ts
// Shown only when every side has declared: one number beside a silent variant reads as a
// claim that the silent one washes nothing, which is the one thing absent must never mean.
const variantCounts =
  recipe.washingUp && recipe.variants.every((v) => v.washingUpCount !== null);
```

and in the sentence, after each link: `{variantCounts && ` (${v.washingUpCount} to wash)`}`.
When the condition is false the sentence renders byte-identically to today.

---

## 9. `src/lib/washing-up.test.ts`

Four `describe` blocks. Mirrors `slack.test.ts`'s structure so the two files review as a pair.

**`readWashingUp`** — the D3/D6 table above, one `it` per row group:
- reads a list and derives the count (the three real lines the ticket asks to see, with numbers)
- takes the sentinel in either word and any case, and returns `count: 0` **which is not null**
- says nothing at all when the key is absent
- refuses a line that is there and empty, and names the sentinel in the message
- refuses a number, and refuses a number hidden among entries
- refuses `nothing` used as one entry among several
- keeps the author's words and order exactly

**`washingUpWord`** — 0, 1, 5, 12, 13.

**`unaccountedCookware` / `pluralEntries`** — the advisory pair:
- an unnamed `#Dutch oven{}` is returned; the same file's `#oven{}` is not (fixture)
- loose matching: `#Dutch oven{}` accounted for by *"the Dutch oven, scraped"*
- absent washing-up returns `[]` — no advisory for a file that declared nothing
- `two mixing bowls` is flagged; `a bowl for two eggs` is not

**`washing-up across the collection`** — imports `../generated/recipes.json` like `slack.test.ts:2`:
- every declared value is whole; no half-declared state exists (the render guard's backing)
- **`count === items.length` for every declared recipe** — the derivation invariant, asserted over
  real data rather than over a fixture
- an undeclared recipe is `null`, and there are many (the "renders nothing" case)
- at least eight worked examples exist, including at least one `count === 0` and at least one
  `count >= 4`
- **the checker warns without failing** — an integration test: write a fixture `.cook` to
  `os.tmpdir()` that declares a `#Dutch oven{}` and a washing-up line omitting it, run
  `node scripts/check-recipes.mjs <path>` with `execFileSync`, assert **exit code 0** and that
  stdout contains both `ok` and the advisory. This is the only test that can prove "warns, does not
  fail", because that property lives in the process's exit code and not in a function's return.
  The fixture lives in the temp dir, never in `recipes/`, so the collection build never sees it.

---

## 10. Ordering

The dependency chain is real; this order is the only one where every step is independently
verifiable.

1. **`src/lib/washing-up.ts`** — nothing depends on it yet; `vitest` can exercise it alone.
2. **`src/lib/washing-up.test.ts`**, unit blocks only — proves the reader before anything consumes
   it. The collection block is written now but will fail until step 5, so it is written last.
3. **`tree.ts` + `normalise.mjs`** — together, because the type and the producer are one change.
   Verified by `npm run recipes` still writing `recipes.json` with `washingUp: null` everywhere.
4. **`parse-recipes.mjs` + `check-recipes.mjs`** — the two guards. Verified by `npm run check`
   staying green on the untouched collection.
5. **The eleven `.cook` files** — the first content the guards see. `npm run check` on exactly
   those eleven prints the counts and any advisory, and this is where the ticket's *"parse of at
   least three real lines with the number each produced"* evidence is captured.
6. **`Timeline.astro` + `[slug].astro`** — the render, once there is something to render.
7. **The collection tests** — they need step 5's data and step 3's field.
8. **`README.md`** — written last so it documents what exists, not what was planned.
9. **`npm run verify`**.

Steps 1-2, 3-4, 5, 6, 7 and 8 are each a `lisa commit-ticket` unit.
