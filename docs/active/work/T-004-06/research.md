# T-004-06 — Research

What the site is, at 375px, 390px and 768px, after five tickets have each fixed their own
surface. Descriptive only: measurements and what owns them, no proposals.

Everything numbered below was measured in a headless Chrome against the build at `96914e6`
(682 pages), not read off the stylesheet.

---

## 1. The shape of the codebase, as it now stands

### Where the width rules live

Nine `@media` blocks carry a width condition. There is no tenth.

| file | line | breakpoint | what it holds |
| --- | --- | --- | --- |
| `src/styles/site.css` | 151 | `34rem` | body padding, `.site-bar a`, `.skip:focus` |
| `src/styles/site.css` | 223 | `34rem` | `.masthead h1`, `.back` |
| `src/styles/site.css` | 393 | `34rem` | the front door's counter cards |
| `src/styles/site.css` | 548 | `34rem` | `.menu-head h1`, `.menu-section a` |
| `src/styles/site.css` | 630 | `34rem` | `.crumbs a`, `.variants a`, `.chips li`, `.chips a` |
| `src/styles/site.css` | 728 | `34rem` | `.shelf` gap and padding |
| `src/styles/site.css` | 883 | **`44rem`** | the sticky ingredient column, the cell floor, the edge cue |
| `src/styles/site.css` | 947 | `34rem` | the table's `min-width: 0` and tightened padding |
| `src/pages/list.astro` | 457 | `34rem` | the shopping list |
| `src/components/AddToPlan.astro` | 106 | `34rem` | the toggle and "See the list" |
| `src/components/CookModes.astro` | 961 | `34rem` | the mode bar, the ticks, the step rows |

Everything else that greps as `@media` is `print`, `prefers-reduced-motion` or `forced-colors`.
`src/components/Timeline.astro` writes **no width query at all** — its narrow behaviour is six
`@container` thresholds (20, 30, 36, 52, 58, 61px) measured against a stretch's own inline size,
not against the viewport.

### What holds the vocabulary in place

`src/styles/breakpoints.test.ts` (5 tests, in `npm run verify`) reads the allowed set out of the
comment block at `site.css:10–48` and fails any width query outside it. It strips CSS comments
first, scans `src/**/*.css` and every `<style>` block in `src/**/*.astro`, and does not follow
`@import` or look inside `@supports` — neither exists in this repository.

It does **not** see `@container` queries. That is correct: a container query measures an element,
not a window, so its numbers are not breakpoints and cannot be one of two named viewport widths.

### What proves the invariant

`scripts/check-overflow.mjs` — serves `dist/`, drives the installed Chrome over the DevTools
protocol with node's built-in `WebSocket`, measures real layout, and names the elements that
escape. Zero dependencies, deliberately outside `npm run verify` because it needs a browser CI
may not have. It knows two distinctions a naive checker does not: off to the *left* creates no
scrollable area, and an element inside a scroller (`.table-scroll`) is the pattern the story
mandates rather than a fault.

---

## 2. The invariant, measured across the whole build

```
node scripts/check-overflow.mjs --width 375,390,768
2046 page views at 375px, 390px, 768px — nothing scrolls sideways.
```

682 pages × 3 widths. Not a sample. This is the state the ticket inherits, not something it
has yet had to defend.

---

## 3. The walk

### The front page, 21 counters

| width | page height | h1 | notes |
| --- | --- | --- | --- |
| 375px | 3596px | 26.25px | grid at one column; teaser hidden by `site.css:403` |
| 390px | 3530px | 27.3px | same |
| 768px | 2892px | 34.56px | two columns; desktop rendering |

The finder's tally reads **"Press `/` to search 658 recipes"** at every width, with a real `<kbd>`
element. On a phone that is a keyboard shortcut offered to a device with no keyboard. Layout is
fine; the sentence is not. T-004-01 found this and recorded it as copy rather than layout.

The search field is 50.5px tall at 375px and its font computes above 16px, so iOS will not zoom
it on focus.

### The two largest menus

| page | 375px | 390px | 768px |
| --- | --- | --- | --- |
| Bakery (107) | 10 706px | 10 414px | 6 539px |
| The Bowl Shop (103) | 11 158px | 10 866px | 7 713px |

One column at both phone widths, two at 768px. No item under 44px at 375 or 390. Length is
unchanged from before S-004 and deliberately so — T-004-03's design argues a 107-item menu is
honestly 107 items long.

### Recipes, by shape

Measured at 375px. `over` is how far the table travels inside `.table-scroll`; the body does not
move on any of them.

| recipe | cols × rows | over | cue | ingredient column | shortest cell |
| --- | --- | --- | --- | --- | --- |
| `miso-ramen` | 7 × 15 | 238px | shown | sticky | 55.1px |
| `pastrami` | 7 × 14 | 231px | shown | sticky | 67.8px |
| `beef-stew-slow-cooker` | 6 × 13 | 184px | shown | sticky | 44.0px |
| `tonkotsu-broth` | 5 × 10 | 109px | shown | sticky | 68.0px |
| `biryani` | 4 × **20** | 34px | shown | sticky | 44.0px |
| `boston-baked-beans` | 4 × 11 | 11px | shown | sticky | 44.8px |
| `conchas` | 4 × 5 | **0px** | absent | sticky | 92.0px |

At 768px every one of these fits (`over: 0`), the cue is absent and the ingredient column
computes `static` — 768px is above both breakpoints and is the desktop drawing.

`biryani` at 20 rows and `pastrami` at 5 days are the deep and the long cases; both behave.

### The three-way variant switch

`boston-baked-beans` → *Instant Pot* / *Slow Cooker*, plus itself. At 375px both links are 44px
tall, on the same line, and **6.6px apart**. Each target clears the floor; the pair does not
clear each other. T-004-03 measured this and could not act — the sentence is prose, and turning
it into a list needs markup that ticket did not own.

### The clock at an extreme ratio

| recipe | total | stretches, at 375px |
| --- | --- | --- |
| `pastrami` | 5 days 10 hr | **285.9px "5 days"**, 11px, 14.3px, 11px — three unlabelled |
| `beef-stew-slow-cooker` | 8 hr 45 min | 11px, **295.8px "8 hr"**, 15.4px |
| `tonkotsu-broth` | 9 hr 30 min | 17px, **271.3px "8 hr"**, 33.9px "1 hr" |

At an extreme ratio the axis is one long bar and two or three slivers at the 11px `minmax` floor,
and the slivers carry no label because no label fits in 11px. This is unchanged at 768px —
`pastrami` still has an 11px stretch in a 768px window, so it is a ratio problem, not a width one.

The mitigation is real and already there: `Timeline.astro:340–358` prints a `.dur` and a `.when`
beside **every** row, so each step's own duration is on the page whether or not the axis can
carry it.

### The prep and cook views

Clicked through all three panes on four recipes at 375px and 768px.

| view | `miso-ramen` pane height, 375px | anything under 44px |
| --- | --- | --- |
| Table | 1249px | none |
| Prep | 2042px | the bare `<input>` at 18.4px — the target is the 44px+ `<label>` around it |
| Cook | 1589px | none |

At 768px the same prep view reports `label.tick` at **42.8px** — the label itself, not the
checkbox. Above `narrow` none of the phone rules apply.

### The shopping list, seven recipes, 47 things to buy

Seeded `tabular-recipes:plan` with `miso-ramen`, `biryani`, `conchas`, `tonkotsu-broth`,
`boston-baked-beans` ×2, `aioli`, `pastrami`. 68 lines across the aisle walk.

| width | page height | sideways | shortest control |
| --- | --- | --- | --- |
| 375px | 6694px | no | **the recipe title link, 22px** |
| 390px | 6658px | no | same |
| 768px | 5547px | no | mouse-sized throughout |

`.tick` rows, the multiplier dial, "Take it off", "Take everything off" and "Copy the list" are
all 44px at narrow — T-004-05 raised them. The one link it did not raise is the recipe's own
title inside the plan block (`.planned h3 a`, `list.astro:213`), which is the way back from the
list to the recipe.

The aisle headings (`.lines li.aisle`) compute `sticky` and hold while their aisle lasts.

### The 404 page, which no ticket owned

`src/pages/404.astro` is fifteen lines: a masthead, one paragraph, one `.clay-button` link back.

| width | body scroll | h1 | the button |
| --- | --- | --- | --- |
| 375px | none | 26.25px | **41.4px** |
| 390px | none | 27.3px | 41.4px |
| 768px | none | 34.56px | 41.4px |

Nothing overflows. The single control on the page is 2.6px short of a thumb at every width,
because a bare `.clay-button` is sized by `padding: 0.7em 1.4em` in the vendored kit and nothing
raises it. Every other `.clay-button` on the site has a local override that does
(`AddToPlan.astro:107`, `CookModes.astro:975`).

---

## 4. Tap targets under 44px, gathered

Measured across `/`, `/404.html`, both large menus, five recipes and `/list/`.

**At 375px and 390px** — three, and they are the whole set:

| element | where | height | owner |
| --- | --- | --- | --- |
| `.source summary` "See how it is written" | every recipe page (658) | 24px | the `source` section of `site.css`; **no ticket** |
| `.clay-button` | `/404.html` | 41.4px | `404.astro`; **no ticket** |
| `.planned h3 a` | `/list/`, one per planned recipe | 22px | `list.astro`; not in T-004-05's four extras |

(`a.skip` reports 1px: that is its hidden state. On focus it is 44px — `site.css:161`.)

**At 768px** — everything. A tablet in portrait is above `narrow`, so it gets the mouse drawing:
`.site-bar a` 24.5px, `.back` 24px, `.chips a` 15px, `.to-list` 21.1px, `.source summary` 24px,
`.clay-button.toggle` 34.7px, `.mode` 40px, `label.tick` 42.8px, `.clay-button` on 404 41.4px.
T-004-05 raised this as its first open concern and named the alternative (`pointer: coarse`) and
why it was rejected: a second vocabulary in a file whose whole criterion is not having one.

---

## 5. The two breakpoints, against measurement

`snug` is documented as "the widest recipes have stopped fitting", derived at 44.5rem and
rounded to `44rem` (704px). Measured on the two 7-column recipes:

| window | `miso-ramen` over | `pastrami` over | ingredient column |
| --- | --- | --- | --- |
| 688px | 41px | 36px | sticky |
| **704px** | 27px | 22px | sticky |
| 720px | 14px | 9px | **static** |
| 736px | **0px** | **0px** | static |

So the widest recipes actually stop fitting at **736px ≈ 46rem**, not 704px. Between 705px and
735px they scroll up to 14px with nothing pinned. T-004-02 flagged this as its third open concern
and estimated the band at 29px; measured here it is 14px. The block's prose and the browser
disagree by about 2rem. Nothing in the codebase writes a third number — `breakpoints.test.ts`
passes — so this is a disagreement between a comment and reality, not between two tickets.

---

## 6. Dead stylesheet

Two blocks in `site.css` style markup that no page emits. Confirmed by grepping the 682-page
build and every `.astro` file:

- `.filters` / `.filter` / `.filter--clear` — `site.css:261–301`, 41 lines, a pressable shelf
  label with the comment *"Pressed means showing only this"*. Zero occurrences in `dist/`.
- `.shelf-group` and its three descendants — `site.css:662–683`, 22 lines. Zero occurrences.

Both were found by T-004-01 and re-confirmed by T-004-03, which declined to restyle a control
nobody can see. They cost every phone the bytes and cost every reader of the file the confusion.

---

## 7. What the board has handed to this ticket

Four of the five prior reviews end with a note addressed here. Collected, because they are the
work nobody else could do:

1. **The regression net.** T-004-01, T-004-02, T-004-03 and T-004-05 each measured their result
   with a throwaway rig and each said the same thing: nothing in `npm run verify` would notice if
   a later edit dropped a tap target back to 34px, un-stuck the aisle heading, or made
   `data-more` lie. Adding a browser leg means editing `package.json`, which was nobody's file
   until now. T-004-02 named the three assertions most worth keeping: the shortest rendered cell
   is ≥44px; `data-more` is set exactly when the scroller overflows; an ingredient cell computes
   `sticky` below 44rem and `static` above.
2. **`.source summary` at 24px** — T-004-03, concern 2, explicitly unowned.
3. **The variant links 6.6px apart** — T-004-03, concern 3, needs markup.
4. **The `snug` arithmetic** — T-004-02, concern 3, "a later ticket may want to correct the
   comment".
5. **The build changing under the sweep.** Two tickets saw a one-page false positive from running
   `check-overflow.mjs` while `astro build` was rewriting `dist/`. The script serves files
   straight off disk with no guard.
6. **`SHORT_SCALE` in `list.astro`** is a second copy of a vocabulary that belongs beside
   `SCALE_WORDS` in `src/lib/shopping.ts` — T-004-05, concern 2, blocked by its one-file scope.

---

## 8. Constraints this ticket inherits

- **Desktop must be provably unchanged at 1440px, against the state before T-004-01.** That state
  is commit `02b65e8` ("Draft the board for the site on a phone"), the parent of T-004-01's first
  commit `b72822a`. `check-overflow.mjs --shots` writes full-page PNGs and a SHA-256 manifest, and
  is the method the four prior tickets used for the same claim.
- **Green baseline.** `npm run verify`: 9 test files, **832 tests**, 658 recipes check, 682 pages
  built. `node scripts/check-overflow.mjs --width 375,390,768`: 2046 page views, clean.
- **Any file may be edited**, and the work artifact must name each one and say why. That is the
  first time in S-004 that `package.json`, `404.astro` and `[slug].astro` are in scope.
