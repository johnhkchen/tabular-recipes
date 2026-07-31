# T-003-02 — Research

What exists today, where it lives, and which of it the slack property has to fit into.
Descriptive only; the choice of level names, syntax and placement is Design's job.

## 1. The pipeline a recipe fact travels

A `.cook` file's metadata line reaches a page through exactly one path, and every existing
promoted field (`dish`, `kit`, `aka`, `pairs-with`, `counters`) travels it:

```
recipes/<category>/x.cook          hand-written source, `>> key: value` lines
  └─ scripts/normalise.mjs         the only place the WASM parser is touched
       · reads recipe.raw_metadata.map into a plain object
       · promotes the fields it knows into named return properties
       · deletes promoted keys from `metadata` so they are not left as loose facts
  ├─ scripts/parse-recipes.mjs     walks recipes/, settles cross-file facts, writes
  │                                src/generated/recipes.json (not committed)
  └─ scripts/check-recipes.mjs     normalises one file at a time and prints what is wrong
src/lib/tree.ts                    RawRecipe — the TypeScript shape of that JSON
src/pages/[slug].astro             reads recipes.json as RawRecipe[], renders the page
src/components/Timeline.astro      "The clock" — the panel under the table
```

Two consumers, one producer. `normalise.mjs` is imported by both scripts, so anything read
there is available to the build and to the per-file checker without duplication.

## 2. `scripts/normalise.mjs` — how a field gets promoted

Relevant shape (lines ~100–236):

- `const metadata = { ...(recipe.raw_metadata?.map ?? {}) }` — every `>> key: value` line,
  keys verbatim, values as written.
- Named reads sit together near the end: `metadata.title`, `metadata.category`,
  `splitList(metadata.tags)`, `metadata.dish ?? slug`, `metadata.kit ?? null`.
- `const PROMOTED = new Set(['title','category','tags','counters','dish','kit','aka','pairs-with'])`
  followed by a loop that deletes those keys plus `step.N` overrides from `metadata`. The
  comment states the rule: *"Authoring directives and anything promoted to its own field are
  not recipe facts."*
- The returned object lists each promoted field explicitly (`dish`, `kit`, `aka`,
  `pairsWith`, …) alongside the residual `metadata`.

Note an inconsistency already present: some fields read from the local `metadata` copy
(`dish`, `kit`) and some re-read `recipe.raw_metadata?.map` (`counters`, `aka`, `pairs-with`).
Both work; the local copy is the tidier of the two.

`normalise.mjs` imports `../src/lib/meta.ts` and `../src/lib/time.ts` directly. Node
(24.18.1 pinned in `.node-version`; 26.5.0 on this machine) strips the types at load, so a
new `src/lib/*.ts` module is importable from the `.mjs` scripts with no build step, provided
it stays type-strippable: `export type` / `import type`, no enums, no decorators.

## 3. `src/lib/meta.ts` — the shared metadata readers

Eleven lines of `splitList()` (comma lists) and `slugify()`. It is the precedent for "a
metadata line is parsed by a small pure function in `src/lib/`, not inline in the script."
`time.ts` is the larger precedent: `minutesOf`, `formatDuration`, `attentionOf`, `readTimers`
— domain vocabulary plus readers, with the returning-null-rather-than-guessing discipline
stated in its header comment.

## 4. `src/lib/tree.ts` — where the type lives

`RawRecipe` (lines 40–67) is the contract between the generated JSON and everything that
reads it. Every promoted field is declared there with a one-line comment saying what it is
for, e.g.:

```ts
  /** What this and its equipment variants have in common. */
  dish: string;
  /** The equipment that makes this variant different; null is the plain way. */
  kit: string | null;
```

`countersInferred` and `variants` are declared there but written by `parse-recipes.mjs`, not
by `normalise.mjs` — so the interface is the union of both producers.

`RecipeTree` (96–108) is a *different*, smaller shape: slug, title, category, tags,
metadata, headers, footers, root, leaves. It deliberately does not carry `kit`, `aka` or
`counters`. Anything the table itself does not draw stays on `RawRecipe`.

Consumers of `RawRecipe` that would have to satisfy a new required field:

- `src/lib/schedule.test.ts:49` — `fixture()` builds a whole `RawRecipe` literal by hand
  (slug, path, title, category, tags, counters, countersInferred, dish, kit, aka, pairsWith,
  variants, ingredientNames, cookware, metadata, steps). A new non-optional field breaks
  this file until it is added. This is the only hand-built `RawRecipe` in the repo.
- `src/pages/[slug].astro`, `src/pages/plan.json.ts`, `src/components/*.astro`,
  `src/lib/collection.test.ts` all cast the generated JSON to `RawRecipe[]` and read
  properties; a new field costs them nothing.

## 5. `scripts/check-recipes.mjs` — how a file is rejected

Structure: for each target file, build a `problems[]` array; if it is empty print
`  ok   <path>  R rows x C cols`, otherwise print `FAIL` and one line per problem, and exit
non-zero at the end. Existing checks, in order:

1. `REQUIRED_META = ['title','category','tags','servings']` — a regexp per key over the raw
   source, reported as `missing metadata: a, b`.
2. `normalise()`, then cooklang's own warnings as *notes* (printed, not failing).
3. Unknown counter names, with the legal set inlined in the message:
   `unknown counter "X" — known: a, b, c`. This is the model the ticket points at for the
   slack message: **say what the legal values are, in the message**.
4. `buildTree` + `layout` errors, tiling holes, too-few rows/columns, unlabelled cells.

`KNOWN_COUNTERS` is read from `src/data/counters.json` — a file this ticket is forbidden to
touch. The slack vocabulary therefore cannot live in that file; it needs a home in `src/lib/`.

`parse-recipes.mjs` duplicates the counter check as a `throw`, with the comment in
`check-recipes.mjs` explaining why both exist: *"validated here as well as in
parse-recipes.mjs, so that someone classifying one folder finds their typo without building
the whole collection."* So the established pattern for a validated field is **both**: a
throw at build time and a per-file problem line in the checker.

## 6. `src/components/Timeline.astro` — the clock

The panel the ticket says to render next to. Props: `recipe: RawRecipe`, optional `tree`,
optional `schedule`. Rendered from `src/pages/[slug].astro:105`, directly under
`<CookModes>`, with a comment: *"Under the panes rather than inside the table pane: the clock
is a fact about the recipe, not one of the three ways of reading it, so it stays on screen
whichever pane is showing."*

Its markup order inside `<section class="timeline clay-surface">`:

1. `<h2>The clock</h2>`
2. either `<p class="verdict">` (recipe times nothing at all) or `<dl class="stats">` with
   two `.stat` blocks — *Start to finish* and *Needs you* — each a `dt`, a big `b`, and a
   small `.sub` caption.
3. `{notes.length > 0 && <p class="notes">…}` — grey footnotes about those two numbers.
4. axis caption + `.axis`, both `aria-hidden`, only when `stretches.length > 0`.
5. `<ol class="rows">` — one row per operation.
6. `<ul class="legend" hidden={…}>`, then `{note && <p class="note">…}`.

Three conventions here that the new line has to respect:

- **Conditional blocks are built in the frontmatter and guarded in the markup**
  (`{notes.length > 0 && …}`, `{note && …}`, `.note:empty { display: none }`). Absence
  already leaves no empty slot anywhere in this component; that is the house style, not a
  new requirement.
- **Nothing is invented.** The header comment's rule 2 and the long comments around
  `handsOnSub` / `totalText` are all about refusing to state a number the author did not
  write. An authored-only field is consistent with that.
- **Colour is never the first signal** (rule 3): fill, height, icon and words carry the
  meaning, colour is fourth.

Styling vocabulary available: `.clay-surface`, `.clay-well` via `var(--clay-well)`,
`--clay-shadow-well`, `--clay-radius-sm`, `--clay-ink`, `--clay-ink-soft`, `--clay-primary`,
`--clay-primary-strong`, `--clay-font-display`. `.stat` shows the established treatment for
"a small labelled fact in a well".

`src/lib/icons.ts` exports 25 icon names (`oven`, `flame`, `hand`, `hourglass`,
`thermometer`, `rest`, …) and `iconSvg(name, {size})`; `icons.test.ts` pins them. Nothing in
that set obviously means "if you are late", and rule 1 of that file is that an icon never
replaces a word.

## 7. Testing reality

`package.json`: `"test": "vitest run"`, `"verify": "npm run check && npm run recipes && vitest run && astro build"`. Note the order — the per-file checker runs **before** the recipes
are regenerated, and the build runs last.

There is **no `vitest.config.*` in the repo**. Vitest runs on defaults: it picks up
`src/lib/*.test.ts` (five files today) and excludes `node_modules/` and `dist/`.

Consequences for this ticket, and this is the binding constraint on the test plan:

- The acceptance criteria limit non-recipe files to `scripts/`, `src/` and `README.md`. A
  root `vitest.config.ts` — or a `package.json` edit to point at one elsewhere — is outside
  that list.
- Rendering an `.astro` component in vitest needs `experimental_AstroContainer` from
  `astro/container` **plus** the Astro Vite plugin, which arrives via
  `getViteConfig()` from `astro/config` in a root vitest config. `astro/container` is
  present in `astro@7.1.6` (`node_modules/astro/dist/container/`), but without the plugin
  Vite cannot transform `.astro` at all.
- So: **no component-rendering test is reachable inside this ticket's file budget.** The
  existing tests already work this way — `layout.test.ts` asserts on the grid data structure,
  not on `RecipeTable.astro`'s HTML. Whatever decides whether the line is drawn has to be a
  pure value the tests can hold, and the component has to be a thin guard over it.

Existing test styles worth matching:

- `time.test.ts` — pure unit tests of readers, including the negative cases
  (`expect(minutesOf(350,'°F')).toBeNull()`).
- `collection.test.ts` — reads `src/generated/recipes.json` and asserts collection-wide
  invariants as `expect(offenders).toEqual([])`, so a failure names the offending slugs.
- `schedule.test.ts` — hand-built fixtures plus a whole-collection sweep at the end.

## 8. The collection as it stands

- 514 `.cook` files across 27 category folders under `recipes/`.
- No file uses a `>> slack` line today; grep finds none. No `>> kit:` line either — S-002's
  writers have not landed yet — so `kit` is a promoted field with zero users, which is
  precedent that a promoted field is allowed to be absent everywhere.
- Categories relevant to worked examples: `custards-and-puddings` (27 files incl.
  `creme-anglaise`, `creme-brulee`, `pastry-cream`, `flan`), `stews-and-braises`, `breads`
  (30 files incl. `no-knead-bread`, `sourdough-boule`), `cured-fish`, `smoked-and-grilled`,
  `fried-and-crispy`, `toppings-and-pickles`, `soups`.
- `recipes/custards-and-puddings/creme-anglaise.cook` already writes the failure into a step
  override — `>> step.4: cook to 180°F (82°C)` — and the story quotes that exact dish as the
  model reason. The information exists in the files; it is just not declared as a property.

## 9. Constraints carried into Design

1. Files touched outside `recipes/**` must be under `scripts/`, `src/`, or be `README.md`.
   `src/data/counters.json` and `src/lib/time.ts` are owned by other tickets and are off
   limits.
2. The vocabulary cannot live in `src/data/counters.json`; it needs a `src/lib/` home that
   both the `.mjs` scripts and the `.astro` components can import.
3. Whatever module the scripts import must survive Node's type stripping.
4. A new non-optional field on `RawRecipe` obliges an edit to `schedule.test.ts:49`.
5. The render decision must be a pure, testable value, because no `.astro` file can be
   rendered under this repo's test setup.
6. The field is authored, never derived: nothing in `schedule.ts`, `time.ts` or the timer
   data may feed it.
7. Absence is the common case (514 files predate it, only some get backfilled in T-003-07),
   so absence must be the cheap, silent path in every one of the six places above.
