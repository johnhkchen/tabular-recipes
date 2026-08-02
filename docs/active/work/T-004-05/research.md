# T-004-05 — Research

What `src/pages/list.astro` is, how the shopping list is drawn, and what a real 375px phone
measures today. Descriptive only; nothing here proposes a change.

Every number below was measured, not estimated: `dist/` was built (`npm run build`, 682 pages),
served on loopback, and driven in the Chrome already on this machine over the DevTools protocol —
the same technique `scripts/check-overflow.mjs` uses, extended to seed a plan into `localStorage`
first, because an empty `/list/` has nothing on it to measure.

**The measured plan** — eight recipes, deliberately spread across the shop:

```
biryani ×2 · gumbo ×1 · espresso-brownies ×1 · miso-ramen ×1/2
beef-rendang ×3 · sancocho ×1 · xiao-long-bao ×1 · aioli ×1
```

It draws **84 shopping lines across 11 aisles**, 7 828px of page at 375px. That is well past the
ticket's "at least six aisles" and is the list this research measures throughout.

---

## 1. The file

1 082 lines, three parts:

| lines | what |
| --- | --- |
| 1–102 | frontmatter and the static markup — headings, empty state, the two `<section>` shells |
| 104–509 | one `<style>` block |
| 511–1082 | one `<script>` that builds every row in the browser |

The page is **entirely client-rendered below the headings**. Nothing about the plan is on the
server: `src/lib/plan.ts` keeps a few slugs in `localStorage`, `/plan.json` supplies the
ingredients, and the script does the arithmetic. This matters for measurement — a static read of
`dist/list/index.html` shows an empty shell.

Because the script makes the elements, every style rule is written `.list-page :global(…)`
(explained at `list.astro:15-19`). Astro's scoping lands on `.list-page` only; `:global()` lets the
rule reach script-made children. **Any rule added to this file must follow that form or it will not
apply.**

## 2. Where a line comes from

`src/lib/shopping.ts` does three things to each ingredient, and the page renders all three:

1. **`soldAs(name)`** — the name a shop puts on the shelf edge. Strips "finely chopped", keeps
   "sliced almonds". This is the string the ticket calls *"the as-it's-sold name"*.
2. **`aisleFor(name)`** → one of 14 aisles in `src/data/aisles.json`, ordered as a walk:
   produce → butcher → fishmonger → cheese → dairy → bakery → baking → dry-goods → tins → spices →
   oils → world → freezer → drinks. `walkOrder()` returns only the ones in play, in that order.
3. **`purchaseOf(name, amounts)`** → `{ scale: 'pack' | 'part' | 'smidge', packs, as }` or `null`
   when no honest answer exists. `SCALE_WORDS` gives each scale a `label` and a `hint`.

`drawLine()` (`list.astro:872-924`) builds one `<li>` holding a `<button class="tick">` and a
`<p class="from">`. The button's children are appended in this order (`list.astro:880-899`):

```
box (✓)  ·  amount (line.text)  ·  name (line.name)  ·  scale (pips + word)
```

`drawShopping()` (`:926-966`) groups by aisle and emits an `<li class="aisle">` heading before each
group, carrying `.aisle-name`, `.aisle-note` and `.aisle-n` (the count).

## 3. The layout, as written

```css
.lines            { display: grid; gap: 0.15rem }
.lines li         { padding: 0.1rem 0; border-bottom: 1px solid var(--clay-border) }
.lines li.aisle   { display: flex; margin: 1.4rem 0 0.2rem; padding: 0 0.5rem 0.35rem }
.tick             { display: grid;
                    grid-template-columns: 1.5rem minmax(5.5rem, auto) 1fr auto;
                    align-items: baseline; gap: 0.5rem; padding: 0.55rem 0.5rem }
```

The four `.tick` tracks are, in order: the ✓ box, **the amount**, the name, the pack badge.

Two consequences fall straight out of that and are visible in the measurements below:

- **The amount is in front of the name**, at every width, on screen and in the copied text.
- **Every row is its own grid.** `.lines` is a grid, but each `.tick` is a separate grid container,
  so `minmax(5.5rem, auto)` is resolved per row. A row whose amount is wider than 5.5rem pushes its
  own name right, and no other row moves with it.

## 4. What 375px measures today

Chrome, `--headless=new`, 375 × 1400, the eight-recipe plan.

### 4.1 Horizontal scroll — clean

```
scrollWidth 375  ·  clientWidth 375  ·  scrolls: false  ·  elements loose past the edge: 0
```

The body does not scroll sideways. This matches T-004-01's finding for the whole site and is the
baseline this ticket must not break, not a defect to fix.

### 4.2 Tap targets — under the floor

| control | 375px | 545px | 1440px |
| --- | --- | --- | --- |
| `.tick` (84 of them) | **36.6px** min, 55.6px max | 36.6px | 36.6px |
| `[data-clear]` "Take everything off" | **26.8px** | 26.8px | 26.8px |
| `[data-copy]` "Copy the list" | **26.8px** | 26.8px | 26.8px |
| `.dial button` (×1/2 ×1 ×2 ×3) | **24.2px** | 24.2px | 24.2px |
| `.drop` "Take it off" | **25.5px** | 25.5px | 25.5px |

82 of the 84 ticks are 36.6px; two run to 55.6px because a long name wraps. **Nothing on this page
reaches 44px.** The ticket calls 44px "a floor here, not a target".

### 4.3 The name does not lead — 0 of 84

The probe compared the painted box of `.name` against `.amount` on every row:

```
nameLeadsCount: 0/84      sameRowCount: 84/84
```

The amount is first on every line, at 375px, at 545px and at 1440px. **The ticket's Context says
the opposite** — *"The 'as it's sold' name is deliberately the front of each line, ahead of the
quantity"* — and its criterion says the ordering *"must survive"*. It is not there to survive. This
is the same class of drafting slip T-004-01 recorded three of (see
`docs/active/work/T-004-01/review.md`, "Corrections to the board"), and it is the single largest
finding in this research.

The copied text agrees with the screen and not with the ticket. `plainText()` at `list.astro:1040`
writes `- ${line.text} ${line.name}` — amount, then name.

### 4.4 The name's left edge is ragged

Because each row resolves `minmax(5.5rem, auto)` alone, the 84 names start at **7 distinct x
positions**:

```
148, 155.7, 158.1, 161, 165, 168, 249.3   (px from the viewport's left edge)
```

148px is the common case (amount ≤ 5.5rem). 249.3px is a row whose amount is long enough to leave
the name **~106px** — under seven characters of Karla at 16px — in a 375px window. A shopper
scanning for a name is scanning a column that is not a column.

### 4.5 The pack pips — they do not wrap, and the words are gone

```css
@media (max-width: 34rem) { .list-page :global(.scale-word) { display: none } }
```

29 of the 84 lines carry a badge. Measured at 375px: **0 wrapped, 0 truncated, 0 clipped**; each
badge is 24.9 × 6.7px — three pips and nothing else. At 545px and 1440px the same badges are
103.2 × 14px, pips plus "part of a pack".

So the criterion "pips … do not wrap or truncate at 375px" **already holds**. What does not hold is
the intent recorded two lines above the rule, at `list.astro:884-888`:

> *The pips are never the only signal — a meter alone would be a colour-and-shape guess, and the
> whole point is being able to tell at a glance without decoding.*

At 375px the pips **are** the only signal. The words are `display: none`, which also removes them
from the accessibility tree, and the fallback is `scaleEl.title` — a hover tooltip on a device with
no hover. Three grey-or-blue dots, undecodable.

### 4.6 Aisle headings scroll away

All 11 headings measure `position: static`. Their tops, in page coordinates at 375px:

```
Produce 1533 (28 items) · Butcher 3361 (8) · Fishmonger 3917 (1) · Dairy & eggs 4034 (6)
Baking aisle 4464 (4)   · Dry goods 4788 (3) · Tins & jars 5049 (4) · Spice rack 5354 (7)
Oils & vinegars 5847 (2)· World foods 6027 (4) · Drinks 6332 (1)
```

Produce runs from 1533 to 3361 — **1 828px, roughly 2.7 phone screens.** Standing in the middle of
it there is nothing on screen that says "Produce". That is exactly the question the ticket asks the
work artifact to answer.

One heading is two lines tall (**Baking aisle, 45px** against 26.3px for the rest): its note,
"flour, sugar, the things that make it rise", wraps at 375px. `.aisle-note` is `flex: 1` and there
is no rule to stop it.

A constraint on any fix: **`.lines` is `display: grid`.** A grid item's sticky travel is bounded by
its own grid area, and each `<li>` is its own row, so `position: sticky` on `li.aisle` as the file
stands today would have nowhere to travel to.

## 5. The width vocabulary in this file

`list.astro` has **three `@media` blocks and exactly one width query**:

| line | query | what it does |
| --- | --- | --- |
| 399 | `@media (max-width: 34rem)` | hides `.scale-word` |
| 474 | `@media (prefers-reduced-motion: reduce)` | drops two transitions |
| 482 | `@media print` | hides the controls, outlines the ✓ box, flattens the pantry |

The ticket (and S-004) say "three width queries". There is one, and `34rem` **is** the `narrow`
literal T-004-01 named in `src/styles/site.css:10-48`. T-004-01's review already recorded this
correction. So "no second vocabulary left in the file" is true before this ticket starts; the live
obligation is that whatever this ticket adds also writes only `34rem` — enforced by
`src/styles/breakpoints.test.ts`, which fails the build on any other number.

`44rem` (`snug`) is declared **`[reserved]`**. `breakpoints.test.ts:80-88` asserts that a name
tagged `[in use]` really is used, and the tag lives in `site.css` — a file this ticket may not
touch. Writing a `snug` query from here would therefore mean either a stale tag or an
out-of-scope edit.

## 6. State that must not move

`TICK_KEY = 'tabular-recipes:list'` (`list.astro:567`) — its own key, separate from
`tabular-recipes:plan`. Around it:

- `loadTicks()` `:569` — tolerant read; anything unparseable is an empty set.
- `saveTicks()` `:584` — swallows a throwing `localStorage` (private browsing).
- `pruneTicks()` `:593` — drops ticks whose key is no longer on the list, so the key cannot grow
  without end. Driven by `liveKeys`, rebuilt in `drawShopping()` `:932`.
- The click handler `:901-908` toggles `ticked`, flips `aria-pressed`, sets the ✓, saves.

Ticks are keyed by `shoppingKey(name)`, not by position, so **re-ordering or re-styling rows cannot
disturb them** — but a change to `drawLine()`'s children could, if it touched the handler's
closure over `box` or `button`.

## 7. Other constraints found

- **Focus survives a repaint.** `focusedControl()` / `restoreFocus()` (`:777-805`) exist because
  both blocks are rebuilt from scratch on every plan change. They key off `[data-dial]` and
  `[data-drop]`, not off ticks.
- **Print is a supported output** (`:482-508`) — "a list is for taking with you, and paper is one
  way to take it". Anything added to the screen layout has to be considered on paper too.
- **`.from`'s indent is hard-coded** to the first column: `padding-left: calc(1.5rem + 0.5rem +
  0.5rem)` = 40px = the ✓ box track, the gap, and `.tick`'s own padding. It aligns with whatever
  sits in the *second* track.
- **`.visually-hidden`** already exists globally at `site.css:95-102` and is available to
  script-made elements.
- **Body side padding at 375px is 12px**, from `site.css:151-154` (`padding: 1rem 0.75rem 4rem` at
  `narrow`), not the 16px the unclamped rule would give. `.tick`'s content box at 375px is
  therefore **335px** wide, which is the budget every column decision spends from.

## 8. Assumptions carried into Design

1. Only `src/pages/list.astro` may change. `shopping.ts`, `aisles.json`, `site.css` and
   `package.json` are all out of scope, so anything needed from them must be derived locally.
2. `34rem` is the only width literal this file may write.
3. The measured 84-line, 11-aisle plan is the working case; a one-recipe plan is the easy case and
   is checked separately, not instead.
4. "Renders exactly as today at 1440px" and "the name leads at every width" cannot both hold, since
   the name leads at no width today. Design has to pick, and say so.
