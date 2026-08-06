# T-005-03 · Research — a place for shelf talk

What exists today, where, and what the sentences that need a home actually look like. No
proposals here; `design.md` picks the shape.

---

## 1. The data file

`src/data/counters.json` — 21 counters. One `"//"` key at the top carries the file's own
explanation; the rest is `{ "counters": [...] }`.

Every counter has exactly five keys, and all 21 have all five:

```
name · slug · blurb · categories · sections[{ title, items[] }]
```

A section has exactly `title` and `items`, and nothing else. Measured across the file:

| | |
| --- | --- |
| Counters | 21 |
| Sections | 147 |
| Item slots (a recipe shelved twice counts twice) | 905 |
| Section size — min / median / max | 0 / 4 / 36 |
| Sections with 10 or more items | 25 |
| Sections with **no** items | 2 — `The Soup Pot / What each thing is for`, `The Slow Cooker / Stocks` |

The median section is four items. The two empty sections matter for validation: `menuFor`
drops a section with no items, so a note attached to one would never render.

`categories` is a fallback that no longer fires — `npm run recipes` reports *658 named, 0
inferred*. Every recipe carries a `>> counters:` line.

## 2. Who reads counters.json

| Reader | What it takes | What it would do with a new key |
| --- | --- | --- |
| `src/lib/counters.ts` | `counters` array, typed by the `Counter` interface (lines 9–21) | Nothing. The interface names `sections?: { title: string; items: string[] }[]`; an extra key survives the JSON import but is not in the type. |
| `src/pages/menu/[counter].astro` | `counters`, `menuFor`, `principalIngredients` | Renders the menu. |
| `src/pages/index.astro`, `list.astro` | `menus(all)` / counter lookups | Untouched by a per-section key. |
| `scripts/parse-recipes.mjs:21` | `counters[].name` | Validates every `>> counters:` line against the set of names; throws on a miss. |
| `scripts/check-recipes.mjs:27` | `counters[].name` | Same check, per `.cook` file, so a typo is found without a full build. |
| `scripts/menu-sections.mjs` | the whole file | **Rewrites `sections` wholesale** from `docs/gaps/*.md` when run with `--write`. |

The last row is the one with teeth. `menu-sections.mjs:parseSections` builds fresh
`{ title, items }` objects from the gap notes and assigns `counter.sections = sections`
(line 130). Anything hand-written onto a section is discarded by that command. It is not in
`npm run verify`, `npm run build` or `npm run check` — it is a hand-run import tool — but
nothing in the file warns a future reader.

## 3. What the page renders now

`src/pages/menu/[counter].astro`, 96 lines, three parts:

- **Frontmatter (1–22).** `getStaticPaths` builds one page per counter with `menu.count > 0`.
- **Template (24–66).** `<h1>` name, `<p class="blurb">`, `<p class="count">`, then
  `menu.sections.map(...)` → `<section class="menu-section"><h2>{title}</h2><ul>` and one
  `<li><a>` per item. Inside the anchor: `.item-name` (+ `.kit`), `.item-of` (principal
  ingredients), `.item-aka` (alternate names, only when non-empty).
- **Script (68–96).** Marks items already on the plan with `.item-onlist`, in words.

The comment at lines 50–57 is the constraint the ticket calls load-bearing:

> A menu, not a shop: no buttons here. The only thing an item says about the list is whether
> it is already on it, in words, and only when it is — and that mark is put here by the
> browser, because only the browser knows.

There is no `<style>` block in this file. All of its CSS lives in `src/styles/site.css`,
`/* ---- one counter's menu ---- */`, lines 447–540:

- `.menu { columns: 2 19rem; column-gap: 2.5rem }` — a two-column masonry that collapses to
  one below ~40rem. `.menu-section { break-inside: avoid }`.
- `.menu-section h2` — 0.82rem, uppercase, letter-spaced, with a bottom rule.
- `.item-of, .item-aka` — 0.84rem, `--clay-ink-soft`, `line-height: 1.45`, both `display: block`.
  `.item-aka` adds italic.
- `@media (max-width: 34rem)` (line 588): `.menu-section a { min-height: 44px }`. The comment
  records that ten items across Bakery and The Bowl Shop draw at 42px and a thumb wants 44,
  and that padding was rejected because it would break the alignment the menu is drawn on.

**A note placed inside the `<a>` becomes part of the link's accessible name and part of the
44px target that T-004-03 measured.** A note placed in the `<li>` after the `</a>` does not.

## 4. Where counter names are validated

Two places, deliberately, and the comment at `check-recipes.mjs:25` says why: *"so that
someone classifying one folder finds their typo without building the whole collection."*

- `parse-recipes.mjs:60–68` — throws. The message names the file, the bad counter, and lists
  the known counters.
- `check-recipes.mjs:141–147` — pushes the same sentence into `problems`, which prints under
  `FAIL <file>` and exits 1.

The asymmetry that matters for a note pointing at a slug:

| | `parse-recipes.mjs` | `check-recipes.mjs` |
| --- | --- | --- |
| Sees | every `.cook` file, always | only the files named on the command line |
| Knows the full slug set | **yes** (`const slugs = new Set(...)`, line 48) | no |
| Owns cross-recipe facts | yes — counters, pairings, variants | no; its header says *"Checks .cook files one at a time"* |
| Owns the character caps | no | yes — `CAPS`, lines 41–58 |

`check-recipes.mjs` cannot answer *does this slug name a recipe that is actually shelved at
this counter* on a partial run. `parse-recipes.mjs` can, and already does that class of check.

`npm run verify` = `check && recipes && vitest run && astro build`, so both run.

## 5. The cap that already exists

T-005-01 put five caps in `check-recipes.mjs`. The relevant one:

```js
// Two humps with a hollow between them: prep lines end at 74, essays start at 125. And
// this row is printed three times — in the table, in prep and in cook — so 120 is 360.
'prose row': 120,
```

`CAPS_FAIL_BUILD = false` today; T-005-07 flips it. The caps are reported worst-overage-first
and the run exits 0. `docs/knowledge/voice.md` is the readable copy of the table, and its
§"Where the words go" already states the rule this ticket builds the destination for:

> **Anything comparing this dish to its shelf-mates goes on the counter's menu, not here.**

So `voice.md` already points at a room that does not exist yet.

## 6. The sentences — what is actually coming off the recipe pages

393 full-width prose rows exist (286 headers, 107 footers); 232 are over the 120 cap, in 183
recipes. Reading those rows for shelf-comparison vocabulary (`shelf`, `only one`, `the plain`,
`pressure`, `elsewhere`, `unlike`, `no other`, `compared`) finds **35 rows in 35 recipes**.

Where they land, by section:

```
 10  The Slow Cooker / Braises, left alone all day
  6  The Soup Pot / Old-fire soups (老火湯)
  3  Curry House / The sauce list
  3  One Pot / Braises and stews
  3  Instant Pot / Braises that took all afternoon
  2  Pizzeria / By the slice
  2  The Bowl Shop / Leafy salads
  2  The Soup Pot / Quick daily soups (滾湯)
  1  each: Curry House / Starters, One Pot / Skillet dinners, Pizzeria / Primi,
        The Slow Cooker / Beans and pulses, Japanese Home / Made ahead,
        Instant Pot / Whole birds, The Slow Cooker / Whole birds
```

**Two facts fall straight out of this list, and they are what the design question turns on.**

### 6a. Every one of the 35 names a dish, not a group

Read them and the subject is always *this dish against its neighbours*:

- `boston-baked-beans-slow-cooker` — "this is the one bean dish on the shelf where slow beats
  pressure outright"
- `baked-turkey-wings-slow-cooker` — "the only file on the shelf that browns somewhere other
  than a skillet"
- `soy-sauce-chicken-slow-cooker` — "The shortest cook on the shelf, at four hours, and the
  only one where longer is actively worse"
- `new-england-boiled-dinner-slow-cooker` — "the one file on the shelf that is not
  leave-it-and-go"
- `osso-buco-slow-cooker` — "the shortest braise on the shelf, deliberately so"
- `irish-stew-slow-cooker` — "this is the easiest file on the shelf"
- `corn-carrot-pork-bone-soup` — "the one soup on this shelf that needs no explaining"
- `dried-bok-choy-pork-lung-soup` — "This pot sits below the others on the shelf for one reason"
- `panzanella` — "Fattoush at the other end of the shelf throws its fried bread in at the last
  second and races to the table; panzanella wants the bread to drink first"

**Not one of the 35 is a sentence about the group with no dish in it.** The closest is
`mentsuyu` — *"One bottle that seasons half this shelf"* — and that is still a sentence about
mentsuyu.

The reason is structural: these sentences were written on a recipe page, so they had a subject
already. A sentence about a group has no page to have been written on.

### 6b. One section wants ten of them

`The Slow Cooker / Braises, left alone all day` holds 18 items and 10 of the 35 sentences.
`The Soup Pot / Old-fire soups` holds 6. **A single string per section cannot hold ten
sentences about ten different dishes.**

This is not hypothetical for this ticket. Of the four recipes the acceptance criteria name:

| Recipe | Row | Counter / section |
| --- | ---: | --- |
| `boston-baked-beans-slow-cooker` | 730 header | The Slow Cooker / Beans and pulses |
| `baked-turkey-wings-slow-cooker` | 563 header | The Slow Cooker / **Braises, left alone all day** |
| `new-england-boiled-dinner-slow-cooker` | 544 header | The Slow Cooker / **Braises, left alone all day** |
| `soy-sauce-chicken-slow-cooker` | 543 header | The Slow Cooker / Whole birds and big cuts |

All four are at one counter, and **two of them are in the same section**. A scalar
`note: string` on a section could not carry both.

(The row lengths measured here — 730/563/544/543 — are the rendered rows after `cleanLabel`
strips the cooklang. The ticket quotes 757/578/567/558, which is the raw source. Same rows.)

## 7. What "byte-identical" costs, measured

Built `dist` before and after appending a throwaway `<style is:global>` to `[counter].astro`,
then diffed:

- The shared CSS bundle keeps its hash (`Base.DmNFMqhT.css`) — an `is:global` block small
  enough to inline is **not** folded into it.
- Astro inlines it as a `<style>` element at the end of `<head>`, on **all 21 menu pages**.
- `<main>` is unchanged, byte for byte, on every menu page.

The two alternatives both cost more: editing `src/styles/site.css` rehashes
`Base.<hash>.css`, which changes the `<link>` href on **all 682 pages**; a scoped (non-global)
`<style>` makes Astro stamp `data-astro-cid-*` attributes onto every element in the template.

`src/styles/site.css` is also outside this ticket's declared file list.

## 8. Mobile, and what T-004-03 left behind

`npm run verify:mobile` = `npm run build && node scripts/check-overflow.mjs --width 375,390,768
&& node scripts/check-touch.mjs`. Both drive real Chrome over the DevTools protocol and both
stay out of `npm run verify` because a CI container may have no browser.

`check-overflow.mjs` enforces one rule from S-004: no horizontal scroll on `<body>` at any
width, and it tags each escaping element with the nearest ancestor that scrolls it, so the
recipe table's own `.table-scroll` is not counted as a fault.

The menu's layout risk at 375px is not the note's length but its content: `.menu` is a
`columns: 2 19rem` masonry, so at 375px the column is the full body width minus padding, and
any unbreakable token longer than that column pushes the body sideways. Prose breaks; a long
slug or URL would not.

## 9. Constraints carried into Design

1. **One field or two, decided by §6.** Ten sentences want one section; every sentence names
   a dish.
2. **Optional everywhere.** 145 of 147 sections will have nothing, and a counter with none
   must render as it does today.
3. **Words, not a widget** — `[counter].astro:50–57`.
4. **Validated where counter names are, with a message naming the counter and the slug.**
   Only `parse-recipes.mjs` can check that a slug is really shelved in that section (§4).
5. **A cap applies.** 120 is the existing `prose row` number; `voice.md` is the readable copy
   and is only to be touched if the number differs.
6. **Files: `counters.json`, `[counter].astro`, and one of the two scripts.** `site.css` and
   `src/lib/counters.ts` are outside the list — §7 and §2 say what that costs.
7. **`menu-sections.mjs --write` silently drops anything hand-added to a section** (§2). It is
   out of scope to change; the file it destroys is in scope to warn in.
