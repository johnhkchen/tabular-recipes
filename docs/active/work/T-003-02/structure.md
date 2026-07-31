# T-003-02 — Structure

File-level blueprint. Two new files, six modified, one README section, ten recipes annotated.
Nothing under `src/data/`, nothing in `src/lib/time.ts`.

---

## New — `src/lib/slack.ts`

The vocabulary and the one reader. Pure, no I/O, type-strippable so `normalise.mjs` can
import it the way it already imports `meta.ts` and `time.ts`.

```
header comment   why the field is authored and never derived; why absence is legitimate

export type SlackLevel = 'forgiving' | 'narrow' | 'unforgiving'
export const SLACK_LEVELS: readonly SlackLevel[]      // declaration order = most to least slack

export interface Slack {
  level: SlackLevel
  reason: string        // never empty; a level without one is not a reading
}

export interface SlackReading {
  slack: Slack | null   // whole, or nothing
  problem: string | null // what is wrong with a line that is present but not whole
}

export function readSlack(value: string | null | undefined): SlackReading
export function slackWord(level: SlackLevel): string   // 'Forgiving' — display case only
```

`readSlack` internals, in order:

1. Nullish or blank after trim → `{ slack: null, problem: null }`. Absence is not a fault.
2. First whitespace-delimited token, lower-cased → candidate level.
3. Not in `SLACK_LEVELS` → `{ slack: null, problem: unknown-level message listing
   `SLACK_LEVELS.join(', ')` }`.
4. Remainder after the token: trim, strip one leading `—`/`–`/`-`/`:`/`,` and the space
   around it, trim again. Empty → `{ slack: null, problem: no-reason message }`.
5. Otherwise `{ slack: { level, reason }, problem: null }`.

Message wording is fixed here, once, so the checker and the build print the same sentence:

- `unknown slack "gentle" — it has to be one of: forgiving, narrow, unforgiving`
- `slack "forgiving" gives no reason — say what actually goes wrong, e.g. >> slack: forgiving — an extra hour in the pot changes little`

`slackWord()` exists so the component does not hand-roll capitalisation and so the display
form is testable. It is the only presentational thing in the module.

## New — `src/lib/slack.test.ts`

Vitest, matching `time.test.ts`'s shape (describe per function, negative cases explicit) plus
one whole-collection sweep in the manner of `collection.test.ts`.

- `describe('readSlack')`
  - each of the three levels parses, level and reason both correct
  - the separators an author might write: `—`, `–`, `-`, `:`, `,`, and none at all
  - upper-case and padded input normalise
  - **a missing reason fails** — `forgiving` alone, and `forgiving —` with nothing after
  - **an unknown level fails**, and the problem text names all three legal values
  - a reason with no level fails as an unknown level (the first word is not a level)
  - absent / empty / whitespace → both fields null, and no problem
- `describe('slackWord')` — display case for each level
- `describe('the collection')` — over `src/generated/recipes.json`:
  - **an undeclared recipe has nothing to render**: every recipe is either `slack === null`
    or a whole `{level, reason}`; no empty reason, no unknown level, no `undefined`
  - re-reading each declared recipe's raw line through `readSlack` yields no problem
  - all three levels appear among the worked examples, and at least eight recipes declare one

The last group is how "renders without the line" is tested. No `.astro` file can be rendered
under this repo's test setup (Research §7: that needs a root `vitest.config.ts`, which is
outside the files this ticket may touch), so the render is reduced to a single guard over a
single value, and the value is what the tests hold. Recorded as a known limitation in Review.

## Modified — `scripts/normalise.mjs`

Three edits, all in the existing grain:

1. `import { readSlack } from '../src/lib/slack.ts';` beside the `meta.ts` / `time.ts` imports.
2. Beside the `dish` / `kit` reads (~line 202), with a short comment saying the field is
   authored and that a malformed line yields nothing here because the checker and the build
   are what report it:
   ```js
   const { slack } = readSlack(metadata.slack);
   ```
3. `'slack'` added to the `PROMOTED` set, so the key is deleted from the residual `metadata`
   exactly as `dish` and `kit` are, and `slack,` added to the returned object with a one-line
   comment.

The raw line stays reachable to the callers that need to report on it via
`recipe.metadata` — no: it is deleted by promotion, so **the two validators re-read the raw
value themselves** from the source they already hold. `check-recipes.mjs` has the file text;
`parse-recipes.mjs` does not. To keep one source of truth, `normalise.mjs` also returns the
problem:

```js
return { …, slack, slackProblem, … }
```

`slackProblem: string | null` is the fourth outcome of the reading, carried out so both
validators can report identically without re-parsing. It is a diagnostic, not a recipe fact,
and it is documented as such on `RawRecipe`.

## Modified — `src/lib/tree.ts`

Two fields on `RawRecipe`, next to `kit`:

```ts
  /**
   * How much room the recipe leaves you, and what actually goes wrong when you run out.
   * Authored, never derived — null is the honest answer for a recipe that cannot name its
   * real failure, and most of the collection is null.
   */
  slack: Slack | null;
  /** What is wrong with a `>> slack:` line that is present but not whole. Null when fine. */
  slackProblem?: string | null;
```

plus `import type { Slack } from './slack.ts';` at the top. `RecipeTree` is **not** touched:
it carries only what the table draws, and the table does not draw this.

`slackProblem` is optional so the hand-built fixture in `schedule.test.ts` need not carry a
diagnostic; `slack` is required so a new `RawRecipe` literal has to make a decision about it.

## Modified — `src/lib/schedule.test.ts`

One line in `fixture()` (~line 59, after `kit: null`): `slack: null,`. Nothing else in that
file changes.

## Modified — `scripts/check-recipes.mjs`

One block, placed with the other per-file `problems.push(...)` checks — immediately after the
counters loop, since both are "a controlled vocabulary the file got wrong":

```js
if (recipe.slackProblem) problems.push(recipe.slackProblem);
```

The message already names the legal values (Design §4), so nothing is assembled here. No new
import, no new constant, no read of `src/data/`.

## Modified — `scripts/parse-recipes.mjs`

In the existing per-recipe loop under `/* ---- counters ---- */`, or a short new section of
its own beside it, matching the counters `throw`:

```js
if (recipe.slackProblem) {
  throw new Error(`${recipe.path}: ${recipe.slackProblem}`);
}
```

So a malformed line cannot reach `src/generated/recipes.json`, and no consumer downstream
ever has to defend against half a reading.

## Modified — `src/components/Timeline.astro`

**Frontmatter** — one destructure near the top, beside `const { recipe, tree, schedule }`:

```ts
const slack = recipe.slack;   // null for most of the collection, and that draws nothing
```

and `slackWord` added to the `src/lib/slack.ts` import.

**Markup** — one block, inserted after the `{notes.length > 0 && …}` paragraph and before
the axis caption. The notes footnote the two numbers, so they stay adjacent to them; slack
follows as the third fact, above the chart:

```astro
{
  slack && (
    <dl class="slack" data-level={slack.level}>
      <dt>If you get it wrong</dt>
      <dd>
        <b>{slackWord(slack.level)}</b> — {slack.reason}
      </dd>
    </dl>
  )
}
```

One guard on the whole element: no line, no `dl`, no label, no separator, nothing in the DOM.
The reason prints verbatim — no appended full stop, no re-capitalisation.

**Styles** — a `.slack` block added near `.stats` in the existing `<style>`, reusing the
`.stat` well treatment so it reads as the same family:

- `.slack` — `margin: 0.55rem 0 0`, `padding` and `background: var(--clay-well)`,
  `border-radius: var(--clay-radius-sm)`, `box-shadow: var(--clay-shadow-well)`; full width
  rather than the 8.5rem flex basis the two numbers use, because a reason needs a line.
- `.slack dt` — the same `0.78rem` and walked-back `--clay-ink-soft` as `.stat dt`.
- `.slack dd` — `margin: 0.1rem 0 0`, `0.88rem`, `line-height: 1.45`, ink.
- `.slack b` — `--clay-font-display`, weight 600, ink. Not a colour, not a badge.
- `@media print` — added to the existing print block's shadow-stripping list.

No colour keyed to `data-level`, per the panel's rule that colour is the fourth signal and
never the first (Design §5). `data-level` is a seam for a future filter.

## Modified — `README.md`

Two edits, both inside "Writing a recipe":

1. The optional-metadata code block gains the line, with an inline comment in the style of
   the others:
   ```cooklang
   >> slack: forgiving — an extra hour in the pot changes little
   ```
2. A bullet in the list under it, after the `dish`/`kit` bullet, giving the three levels,
   stating that the reason is required and the whole line optional, that absence is a
   legitimate answer, and carrying the **two example lines** the acceptance criteria ask for
   — one forgiving, one unforgiving.

The "How it fits together" table gains one row for `src/lib/slack.ts`, beside the
`src/lib/time.ts` row.

## Modified — ten `.cook` files

Worked examples, one `>> slack:` line each, placed with the other optional metadata (after
`>> time:` where there is one, before any `>> step.N:` overrides). Every reason is checked
against what the file's own steps actually say — no reason describes a failure the recipe
does not contain.

| File | Level | The failure it names |
| --- | --- | --- |
| `recipes/stews-and-braises/beef-stew.cook` | forgiving | overrun changes little |
| `recipes/soups/chicken-broth.cook` | forgiving | a long simmer has no edge to fall off |
| `recipes/breads/no-knead-bread.cook` | forgiving | wide rise window |
| `recipes/toppings-and-pickles/sauerkraut.cook` | forgiving | a ferment you taste your way through |
| `recipes/rice-beans-and-grains/mushroom-risotto.cook` | narrow | the al dente window |
| `recipes/breads/sourdough-boule.cook` | narrow | over-proof costs the rise, not the loaf |
| `recipes/smoked-and-grilled/carne-asada.cook` | narrow | the sear window either side of done |
| `recipes/custards-and-puddings/creme-anglaise.cook` | unforgiving | **breaks past 82°C and will not come back** |
| `recipes/fried-and-crispy/fried-chicken.cook` | unforgiving | **undercooked chicken / hot oil** |
| `recipes/cured-fish/belly-lox.cook` | unforgiving | **a cure that is short is a safety matter** |

Ten rather than the required eight, so the three writer tickets have more than one example
per level to copy from, and three of them are genuinely dangerous or unrecoverable rather
than the required two.

## Ordering that matters

1. `src/lib/slack.ts` before anything that imports it.
2. `src/lib/tree.ts` before `schedule.test.ts` compiles clean.
3. `normalise.mjs` before either validator (both read `recipe.slackProblem`).
4. The `.cook` files last: `npm run check` is the thing that proves each line is well formed,
   and it needs the reader and the checker already in place.
5. `README.md` any time; it depends on nothing.

## Interfaces crossing a boundary

| Boundary | What crosses |
| --- | --- |
| `.cook` → `normalise.mjs` | one `>> slack:` line, free text |
| `slack.ts` → `normalise.mjs` | `SlackReading` |
| `normalise.mjs` → both validators | `recipe.slackProblem` |
| `recipes.json` → components | `RawRecipe.slack: Slack \| null` |
| `slack.ts` → `Timeline.astro` | `slackWord()` |
| `slack.ts` → tests | `SLACK_LEVELS`, `readSlack`, `slackWord` |
