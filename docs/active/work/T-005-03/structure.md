# T-005-03 · Structure — the shape of the change

Three files modified, none created, none deleted.

| File | Action | Roughly |
| --- | --- | --- |
| `src/data/counters.json` | modified | +1 line in the `"//"` header, +5 `notes` entries on 3 sections of one counter |
| `scripts/parse-recipes.mjs` | modified | +~55 lines: one validation block and one constant |
| `src/pages/menu/[counter].astro` | modified | +~35 lines: a lookup, two render branches, one `<style is:global>` |

Order matters: **data → validator → renderer.** Writing the data first means the validator has
something real to fail against; writing the validator before the renderer means a bad note can
never reach a page.

---

## 1 · `src/data/counters.json`

### 1a. The `"//"` header

The file's own explanation gains one sentence, at the end, because `menu-sections.mjs --write`
rebuilds `sections` from `docs/gaps/*.md` and would discard every note (research §2). The
warning belongs in the file that gets destroyed, not in the tool that destroys it.

> `notes` on a section is written by hand and is the only thing here that is not derivable
> from a gap note — `scripts/menu-sections.mjs --write` rebuilds `sections` and will drop
> them, so read them out first if you ever run it.

### 1b. The new key

```
counters[].sections[].notes?  : Array<{ of?: string; note: string }>
```

- **Optional.** Absent on 145 of 147 sections after this ticket. A section without it is
  unchanged, character for character.
- **`note`** — required, non-empty, ≤ 120 characters.
- **`of`** — optional. When present, a slug that appears in *this section's* `items`.
- Nothing else is allowed. An unknown key is not silently ignored; §2 rejects it.

### 1c. What gets written — five notes, one counter

`The Slow Cooker`, three of its four sections:

| Section | `of` | Source |
| --- | --- | --- |
| Braises, left alone all day | — (group) | newly written for the section, **not moved** |
| Braises, left alone all day | `baked-turkey-wings-slow-cooker` | header row, 563 chars |
| Braises, left alone all day | `new-england-boiled-dinner-slow-cooker` | header row, 544 chars |
| Beans and pulses | `boston-baked-beans-slow-cooker` | header row, 730 chars |
| Whole birds and big cuts | `soy-sauce-chicken-slow-cooker` | header row, 543 chars |

Two notes in one section is the case that decided the schema (design §1), so the proof set
exercises it. The group note exercises the `of`-absent branch. `Stocks` — the counter's empty
section — gets nothing, and stays the control.

The `.cook` files are **not** edited. The sentences are copied.

---

## 2 · `scripts/parse-recipes.mjs`

### Placement

A new block, `/* ---- shelf notes on the menu ---- */`, between the existing
`/* ---- counters ---- */` block (ends line 86) and `/* ---- pairings ---- */` (line 88).

After counters, because it needs `recipe.counters` resolved — the fallback at line 71–76 fills
in inferred counters, and a note must be checked against what a recipe finally sits at, not
what its file happens to name. Before pairings, because a data-file error should surface
before a cross-recipe one.

### The constant

```js
// A menu note is one sentence, same as the prose row it came off — the number is
// CAPS['prose row'] in scripts/check-recipes.mjs, and docs/knowledge/voice.md is the
// readable copy. It prints once here rather than three times, but 120 is where a
// sentence stops being a sentence, and that is the half that carries over.
const NOTE_CAP = 120;
```

### The check

Input: `COUNTERS` (already read, line 21) and a slug→counter-names index built from `recipes`.
Output: nothing, or a thrown `Error`. Pure iteration; no mutation of `recipes` or `COUNTERS`.

Four failures, in this order per note, each throwing on the first offence so a message is
never a pile:

| # | Condition | Message names |
| --- | --- | --- |
| 1 | `notes` is not an array, or an entry is not an object with a string `note` | counter, section title, the offending value |
| 2 | `note.length > NOTE_CAP` | counter, section title, `N/120`, the note |
| 3 | `of` present and not in `section.items` | counter, section title, the slug, and the slugs the section does list |
| 4 | `of` present, in `items`, but that recipe is not shelved at this counter | counter, section title, the slug, and the counters it is actually shelved at |

Every message opens with `src/data/counters.json:` and names the counter and the section, in
the shape the counter-name error at line 62–68 already uses:

```
src/data/counters.json: The Slow Cooker / "Beans and pulses" has a note on
  "boston-baked-beans-slowcooker", which the section does not list.
  the section lists: boston-baked-beans-slow-cooker
```

Case 4 is the one that catches the quiet failure: `menuFor` drops items it cannot find
(`counters.ts:81`), so a note on a slug that is listed but not shelved here would validate
under case 3 and then never render.

### What it does not do

No writes, no mutation, no effect on `src/generated/recipes.json`. The generated file gains
nothing — a note is menu data, and the menu reads `counters.json` directly.

---

## 3 · `src/pages/menu/[counter].astro`

### 3a. Frontmatter — the lookup

`menuFor` returns `MenuSection[]` typed `{ title, items: RawRecipe[] }`, and `Counter.sections`
in `src/lib/counters.ts` is typed `{ title, items: string[] }[]`. Neither knows about `notes`,
and `counters.ts` is outside this ticket's file list (design §5, *what this design does not
do*). So the shape is declared locally and read off the raw counter:

```ts
interface ShelfNote { of?: string; note: string }

// menuFor works in RawRecipes and does not carry the counter's own text through, and the
// Counter interface in src/lib/counters.ts does not describe `notes` yet — so the notes are
// read off the raw counter and matched to the rendered section by title. Titles are unique
// within a counter, and menuFor only ever adds one of its own ("Also"), which has none.
const notesByTitle = new Map<string, ShelfNote[]>(...);
const groupNote = (title: string) => notesByTitle.get(title)?.filter((n) => !n.of) ?? [];
const itemNote  = (title: string, slug: string) => notesByTitle.get(title)?.find((n) => n.of === slug);
```

Matching by title rather than by index is deliberate: `menuFor` filters out empty sections and
appends an `Also` section, so positions do not line up between `counter.sections` and
`menu.sections`.

### 3b. Template — two insertions, both guarded

```
<section class="menu-section">
  <h2>{section.title}</h2>
  {groupNote(section.title).map((n) => <p class="menu-note">{n.note}</p>)}   ← new
  <ul>
    <li>
      <a …> … </a>
      {itemNote(section.title, recipe.slug) && <p class="item-note">…</p>}   ← new
    </li>
```

- The group note goes **between** `<h2>` and `<ul>` — a sentence under a heading.
- The item note goes **inside `<li>`, after `</a>`** — outside the link's accessible name and
  outside the 44px target T-004-03 measured (design §2).
- Both are `false`/empty when there is no note, so nothing is emitted. This is what makes a
  note-less counter's `<body>` byte-identical.

The `.item-onlist` comment block (lines 50–57) stays exactly where it is, inside the anchor.
The item note is a sibling of the anchor and does not disturb it.

### 3c. A `<style is:global>` at the end of the file

Two rules, appended after the existing `<script>`:

```css
/*
 * A note is words, not a widget — the same quiet voice .item-of and .item-aka already
 * speak in, so shelf talk reads as part of the menu rather than as a thing stuck on it.
 * Global rather than scoped, and here rather than in site.css: a scoped block would stamp
 * data-astro-cid-* onto every element on every menu, and site.css would rehash the shared
 * bundle on all 682 pages. This inlines into <head> on the 21 menu pages and leaves the
 * body of a counter with no notes untouched.
 */
.menu-note { … }
.item-note { … }
```

Both: `--clay-ink-soft`, `0.84rem`, `line-height: 1.45`, zero side padding. `.menu-note` takes
the heading's bottom spacing so the list still starts where it does today; `.item-note` sits
tight under its item and is set in the same italic `.item-aka` uses, because both are asides
about the dish rather than part of its name.

No new colour, no border, no background, no `::before` marker.

### 3d. The browser script

Unchanged. It queries `.menu-section a[data-slug]` and appends into the anchor; a `<p>` after
the anchor is invisible to it.

---

## Interfaces, stated once

```
counters.json  ──(notes)──▶  parse-recipes.mjs   validate, throw, write nothing
      │
      └──────────────────▶  [counter].astro     read by title, render as prose
```

Nothing else in the project reads `notes`. `src/lib/counters.ts`,
`src/generated/recipes.json`, `check-recipes.mjs`, `index.astro`, `list.astro`, the plan and
the search index are all untouched and none of them changes shape.

## Order of changes

1. **`counters.json`** — the five notes and the header line. Nothing renders them yet, and
   nothing rejects them yet; `npm run verify` is green because no reader exists.
2. **`parse-recipes.mjs`** — the validator. Proved by breaking each of the four cases in turn
   against the real data and reading the message, then restoring.
3. **`[counter].astro`** — the renderer and the style. Proved by `diff -r` of `dist` against
   the baseline captured before any change.

Each step is a separate `lisa commit-ticket`. Step 1 and 2 could be one commit; they are kept
apart so the "before the validator existed" and "after" states are both on the record.
