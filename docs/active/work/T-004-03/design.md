# T-004-03 — Design

Four surfaces, four small `narrow` blocks, no markup. What follows is grounded in the numbers in
`research.md`; every rejected option is rejected against one of them.

---

## The shape of the problem, restated from the measurements

Nothing on these three pages overflows: 682 pages at 375px, clean, before a line was changed. The
card grids collapse to one column correctly. So this is not a "make it fit" ticket at all. Two
things are actually wrong, and they are different in kind:

1. **Touch.** Ten pressable things across the three pages are smaller than 44px: 7 items on the
   Bakery menu and 3 on The Bowl Shop at 42px, and on every recipe page the two crumb links (20px),
   the counter chips (15px) and the variant links (17px).
2. **Length.** The front door is 4998px, of which the 21 counter cards are **4505px**. The menus
   are 10.7k and 11.2k. Only the first is a fault: the front door is a shelf you scan, and 21
   near-identical 203px cards make scanning it a scroll. A 107-item menu is long because it has 107
   items on it.

The third thing the ticket asks about — reaching the finder — turns out to be already true, and
the honest answer is to prove it rather than build something.

---

## Decision 1 — the front door: a denser card, not a different grid

**Chosen: at `narrow`, the counter card sheds its teaser line and tightens its own spacing. The
grid is untouched.**

The card is four parts. Measured across all 21 at 375px:

| part | total px over 21 cards | per card |
| --- | --- | --- |
| `h2` the name | 756 | 36 |
| `.blurb` what the counter is | 782 | 37 (46 when it wraps) |
| `.teaser` four dish names | 504 | 24 (21 or 42) |
| `.count` how many recipes | 399 | 19 |
| padding + margins | 1712 | 81.6 |
| **card** | **4153** | **198 avg** |
| + 20 grid gaps at 17.6px | 352 | |
| **`.counters`** | **4505** | |

The brand test for a card is: the name, what it is for, and whether you can use it, in half a
second. That is `h2`, `.blurb`, `.count`. The teaser — "a few names off each menu", per the comment
in `index.astro` — is the fourth thing, and on a phone it is the one that turns a label into a
paragraph. Removing it at `narrow` costs 504px of text plus its 16px bottom margin on each card:
**840px, 19% of the column**, for the line a reader is least likely to need, and the same names are
one tap away on the menu itself.

With the spacing that goes with it:

| change | saves |
| --- | --- |
| `.teaser` hidden | 840px |
| card padding `1.5rem 1.6rem 1.3rem` → `1.05rem 1.15rem 0.95rem` | ~269px |
| grid `gap` 1.1rem → 0.7rem | 128px |
| `.blurb` bottom margin 0.9rem → 0.55rem | ~118px |
| **total** | **≈1355px, `.counters` ≈4505 → ≈3150px** |

That is roughly 6.8 phone screens down to 4.7, with every card still carrying its name, its
sentence and its count.

**Hiding content is a real cost and worth naming.** `display: none` takes the teaser out of the
accessibility tree too, so a phone screen-reader user loses it exactly as a sighted phone user
does. That is the consistent choice — the alternative, hiding it visually but leaving it read
aloud, would make the page longer for the reader who can least afford length. The teaser is
decoration-grade content by its own author's description; the counter's *identity* is the name and
the blurb, and those stay.

### Rejected

- **Two columns at `narrow`.** 21 cards two-up would be ~950px — by far the biggest win available.
  It costs the blurb: at (351 − 11) / 2 = 170px per column, "Japanese Home Cooking" wraps to three
  lines at 1.5rem and "Small dishes, made once, that add up to dinner all week." runs to five. A
  card that is only a name and a count is an index, not a shelf label, and the front door's whole
  job is to say what is behind each door. Also: the ticket says not to rewrite grids that work, and
  this one works.
- **Clamping the teaser to one line** (`-webkit-line-clamp: 1`). Saves ~250px, a third of what
  hiding it saves, and buys an ellipsis in the middle of a dish name — "Congee · Egg Drop Soup ·
  Chin…". A truncated name is worse than an absent list.
- **Shrinking the name to 1.35rem.** 63px across the whole column, and the name is the one thing
  the card exists to say. Not worth it.
- **Collapsing the list behind a "show all" control.** Needs markup and script; this ticket is CSS
  only, and a front door that hides most of itself on first visit is a worse front door.

## Decision 2 — the finder: prove it, do not build it

**Chosen: no change; the work artifact carries the measurement.**

The criterion is "a reader on a phone can reach the finder without scrolling past the whole counter
list". Measured at 375px: `.masthead` ends at 255px, `.finder` sits at **top 279px and is 114px
tall**, and the first counter card starts at **429px**. On the shortest phone this ticket targets —
375 × 667 — the finder is entirely on the first screen with 238px to spare, and the counter list has
not started. There is nothing to scroll past.

The document order does the work: `.finder` precedes `.counters` in `index.astro`, and when a
search is running the counters are hidden outright (`[data-counters].hidden`), so the list is never
between a searcher and their results. Decision 1 shortens what follows the finder by ~30% as well,
which helps the *return* trip.

Rejected: `position: sticky` on `.finder`. It would answer a question nobody asked (the finder is
already first), spend 114px of a 667px screen permanently, and add a scroll-position dependency to
a page that currently has none.

## Decision 3 — the menu: 44px items, and leave the length alone

**Chosen: at `narrow`, `.menu-section a` gets `min-height: 44px`; `.menu-head h1` steps down; the
rest of the menu is left as it is.**

- **The 42px item.** Seven on Bakery, three on The Bowl Shop: a short name, one line of
  ingredients, no aka. `min-height: 44px` on the block link raises exactly those and touches
  nothing else — the median item is 81px and the tallest 120px. The 14px gap between items
  (`li + li`, 0.85rem) is untouched, so two adjacent targets stay separated.
- **`.menu-head h1`.** `clamp(2.1rem, 6vw, 3.1rem)` floors at 2.1rem = 33.6px below 560px, which
  makes a counter's name the largest type on any narrow page — larger than the site's own title,
  which T-004-01 stepped down to 1.9rem. At `narrow` it becomes `clamp(1.7rem, 6.2vw, 2.1rem)`:
  27.2px at 375px, and at the breakpoint itself 6.2vw of 544px = 33.7px, clamped to 2.1rem = the
  exact value the wide rule holds there. **The two clamps meet at 544px**, the same way T-004-01
  made the masthead's meet, so there is no step at the boundary.
- **The multicol needs nothing.** `columns: 2 19rem` with a 40px gap resolves to one column at any
  width under ~688px — it already carries its own narrow behaviour, written in its own units. Used
  column count measured as 1 on all three menus tested. Adding a `narrow` override would be a
  second way of saying the same thing.

### Rejected

- **Truncating `.item-of` to one line.** Would take Bakery from 10.7k to roughly 8k. But the
  ingredient gloss is what tells two "Focaccia"s apart, and a menu's length is a property of the
  menu — a reader who opened The Bowl Shop asked for its 103 items. Length here is honest; on the
  front door it was not, because 21 counters are a *choice among* things rather than the things.
- **Tightening `.menu-section` bottom margin (1.9rem).** Would save ~64px on an 8-section menu —
  0.6% — and the section headings are the only wayfinding in a 10k-pixel single column. Their air
  is what makes them findable while scrolling. Not worth the trade.
- **Padding the item link instead of `min-height`.** Inline padding would offset the item text from
  its section heading, which is the alignment the menu is drawn on; block padding would move every
  item, not the seven that are short. `min-height` moves only what misses.

## Decision 4 — the recipe page's trimmings: three touch fixes

Every pressable thing here misses 44px. Each needs a different answer because each is a different
kind of thing.

- **`.crumbs a` (20px).** The trail is a flex row of two links and an arrow.
  `display: inline-flex; align-items: center; min-height: 44px` — the same idiom T-004-01 used for
  `.back` and `.site-bar a`, so the site has one way of saying this. The row grows 20 → 44px.
- **`.chips a` (15px) inside `.chips li` (the visible pill).** Growing the link inside a pill that
  stays 24px would put the touch area outside the thing you can see. So the **pill** becomes the
  44px target: `.chips li` gets `min-height: 44px` and centres its content, and `.chips a` stretches
  to fill it. Non-link chips (serves, about, category) get the same height, so the row stays one
  row of one shape rather than two sizes of pill. The row costs about 80px more on a 7-chip recipe;
  that is what tappable costs.
  `.chips` base rules live in the page-furniture section, but `.chips` renders on the recipe page
  only, so its narrow behaviour belongs in the trimmings block. The alternative — editing
  T-004-01's lines — is the thing section ownership exists to prevent.
- **`.variants a` (17px), the three-way switch.** This is prose: "Also written for *Instant Pot*,
  *Slow Cooker*." with the commas and the full stop as text nodes. CSS can change what the links
  are, not what the sentence is. `display: inline-flex; align-items: center; min-height: 44px`
  gives each link a 44px line box while leaving it a link in a sentence; the paragraph grows from
  22px to ~48px. The punctuation stays on the baseline between the two targets.

  **Rejected: making them look like chips.** A pill needs a background, and a background needs the
  sentence around it to stop being a sentence — "Also written for" reading into a row of buttons is
  worse copy than what is there. Rejected too: leaving them as they are and declaring inline links
  out of reach. They are the switch between three ways to cook the dish, the ticket calls them out
  by name, and 44px is achievable without touching the markup.

  **Named limitation:** two variant links on the same line sit about 4px apart. The touch areas are
  each 44px tall and 76–84px wide but adjacent. Separating them needs the sentence to become a
  list, which needs markup, which this ticket does not own. Recorded for T-004-06.

## Decision 5 — the shelves: spacing only

`.shelf` is the pair cards on a recipe page **and** the search results on the front door. Both
measured clean: single column at 375px, every card over 44px (min 55px), no overflow. What is worth
tightening is the air between them — `gap` 1.25rem → 0.8rem and card padding `1.4rem 1.5rem` →
`1.1rem 1.2rem` at `narrow`. On `pita-bread`'s 30 pairs that is ~380px; on a 60-result search,
~750px. No structural change, and the grid is untouched.

**`.shelf-group` is dead.** Its four rules (545–568) appear in no built page and in no `.astro`
file. Not deleted here: deleting is not what this ticket was opened to do, and a deletion that
turns out to be wrong is expensive. Reported in `review.md` for T-004-06, which may edit any file.

## Decision 6 — the "shelf labels" the ticket asks for do not exist

The ticket asks for 44px on "the shelf labels … pressable ('pressed means showing only this')".
That is `.filter` / `.filters`, and **no page has ever rendered it**: zero occurrences of
`class="filter` in the 682-page build, and no `.astro` file mentions it. It also sits in the finder
section, not in the four this ticket owns.

**Chosen: report it, do not style it.** A 44px rule on a selector nothing renders cannot be
verified at 375px or any other width, and adding one would put a fifth section in the diff to make
a criterion *look* satisfied. The pressable things that are actually on the front door — the 21
counter cards — are 145–200px tall and pass by a wide margin. Said plainly in `review.md` so a
reviewer can decide whether the rules should be deleted or a filter row should be built.

---

## What this adds up to

Four `narrow` blocks, one at the end of each of the four sections, in the file's existing style:

| section | block |
| --- | --- |
| the counters | `.counters` gap, `.counter a` padding, `.counter .blurb` margin, `.counter .teaser` hidden |
| one counter's menu | `.menu-head h1` clamp, `.menu-section a` min-height |
| the recipe page's trimmings | `.crumbs a`, `.chips li` + `.chips a`, `.variants a` |
| the shelves | `.shelf` gap, `.shelf a` padding |

No `snug` rules: nothing here changes behaviour between 44rem and 34rem — at 704px the counter grid
is two columns and every target already clears 44px, because a pointer-width layout is what these
rules were drawn for. Both names are already `[in use]`, so the block at the top of the file needs
no edit.

Everything is inside `@media (max-width: 34rem)`, so 1440px cannot move — which is asserted here
and proved in `review.md` by the screenshot-hash method T-004-02 used.
