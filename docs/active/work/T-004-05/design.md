# T-004-05 — Design

Five decisions, each against the measurements in `research.md`. The page is a shopping list read
one-handed in an aisle; where a call is close, the aisle wins.

---

## The conflict to settle first

Two acceptance criteria cannot both hold:

> - The as-it's-sold name still leads each line at every width.
> - A 1440px window renders exactly as today.

The name leads at **no** width today (0 of 84 rows, §4.3). "Still" is the tell: the ticket was
written believing the ordering already existed. It does not. One criterion has to give.

**Decision: the name leads, and 1440px changes.**

Because the ticket does not merely list the ordering, it argues for it — *"deliberately the front
of each line, ahead of the quantity … it is the whole point of the component"* — while "renders
exactly as today" is the no-regression guard carried by every ticket in S-004 (T-004-01 had the
same line). Asked which they meant, the author who wrote "the whole point of the component" would
not answer "the pixels".

What that guard is protecting is still honoured, and stated as a narrower promise this ticket can
actually keep and verify:

> At 1440px the only differences are the two the ticket asks for — the name leads the amount, and
> aisle headings stay put while you scroll. Type, colour, spacing, row height and page height are
> unchanged.

Recorded as a `note` at Review, with the screenshots behind it. Not a block: nothing here needs a
human before the work can be done.

---

## D1 · The line: name first, in real columns

**Chosen — reorder the tracks and reserve the badge column.**

```
today   [✓]  [ amount 5.5rem+ ]  [ name 1fr ]  [ badge auto ]
chosen  [✓]  [ name 1fr ]  [ amount auto ]  [ badge 7rem+ ]
```

`drawLine()` appends `box, name, amount, scale`; `grid-template-columns` becomes
`1.5rem minmax(0, 1fr) auto minmax(7rem, auto)`, and `minmax(4.8rem, auto)` for the badge at
`narrow`.

Three things this buys, all of them measurable:

1. **The name leads** — the criterion, at every width, from one rule rather than a
   breakpoint-dependent order.
2. **The name's left edge stops being ragged.** It moves from 7 distinct x positions to one, at
   40px, because `1fr` is the same width in every row regardless of how long that row's amount is.
   §4.4's worst row gave the name 106px; under `1fr` it gets the same share as its neighbours.
3. **The amounts line up on the right.** Reserving the badge track even on rows with no badge (55
   of 84) is what does this: an `auto` track collapses to 0 when empty, which would leave amounts
   ragged by the width of a badge. `minmax` and not a fixed track, so a badge wider than the floor
   grows rather than spills — the floor is sized from the measured widest badge (103.2px at wide,
   ~68px at narrow) with headroom for a real webfont, since the measurement ran on fallbacks.

**Rejected — two rows at narrow** (name on top, amount and badge beneath). It reads well and needs
no reordering, but it doubles an 84-line list's height: 7 828px becomes roughly 13 000px, and the
one thing a shopper does with this page is scroll it. Density is the feature.

**Rejected — leave the DOM order and reverse visually** with `order:` or `direction`. It satisfies
the letter of the criterion and breaks the copied text, the printed page, and the reading order for
a screen reader, all of which would still say the amount first. The ordering the ticket calls the
whole point should be one fact, not a presentation trick.

**Rejected — name first only at `narrow`.** Cheapest for desktop, and directly contrary to "at
every width".

### The copied text follows the screen

`plainText()` writes `- 1/2 cup bean sprouts`. Print already follows the DOM, so leaving this alone
would make the clipboard the only place in the product where the amount leads. It becomes
`- bean sprouts — 1/2 cup  (part of a pack)`. Nothing in the repository asserts the old format
(grepped: the only reference to the header string is the line that writes it). Flagged at Review as
a deliberate change beyond layout.

## D2 · 44px targets, at `narrow` only

**Chosen — `min-height: 44px` plus symmetric padding on `.tick`, inside `@media (max-width: 34rem)`,
and the same for the four other controls on the page.**

| control | today | at `narrow` |
| --- | --- | --- |
| `.tick` | 36.6px | ≥ 44px |
| `.dial button` | 24.2px | ≥ 44px |
| `.drop` | 25.5px | ≥ 44px |
| `[data-clear]`, `[data-copy]` (`.small`) | 26.8px | ≥ 44px |

Padding rather than `min-height` alone: `.tick` is a grid with `align-items: baseline`, and a
`min-height` taller than its single row leaves the text pinned to the top of the empty space.
Padding grows the row itself, so the text stays centred and a wrapped two-line row simply gets
taller. `min-height` is kept alongside as a floor that does not depend on the font metrics.

**Only the ticks are named in the criteria.** The other four are on the same page, tapped by the
same thumb, and the ticket's bar is "actually usable while shopping" — a 24px ×2 button beside a
44px row is the failure the criterion is describing, one control over. Cost is four rules in a
block that already exists.

**Cost, stated:** +8px on 84 rows is roughly +670px of scrolling at 375px. That is the price of the
criterion and there is no version of a 44px row that is also a 36px row.

**Rejected — 44px at every width.** It would add the same 670px to desktop, where a mouse has never
needed it, and it is the change most likely to read as gratuitous next to D1's already-conceded
desktop delta. `narrow` is where the thumb is.

**Rejected — `@media (pointer: coarse)`.** Truer to the actual concern (a touchscreen, not a narrow
window) and it would cover a 768px tablet, which `narrow` does not. It is also a second vocabulary
in a file whose criterion is "no second vocabulary left", and it lies to a desktop with a
touchscreen. Recorded as a known gap: **545px–1440px keeps today's 36.6px rows.**

## D3 · Aisle headings that stay on screen

**Chosen — `position: sticky; top: 0` on `li.aisle`, at every width.**

This is the answer to the criterion "the work artifact says how a shopper knows which aisle they
are in while scrolled into a long group": **the aisle heading is pinned to the top of the screen
for as long as that aisle lasts, with its item count beside it, and is pushed off by the next
aisle's heading.** Halfway down Produce's 1 828px the top line of the screen reads
`PRODUCE … 28`. The count is already rendered and now becomes useful: it says how much of this
aisle there is, from anywhere inside it.

Three things it needs:

- **`.lines` must stop being a grid.** A grid item's sticky travel is bounded by its own grid area,
  and each `<li>` is its own row (§4.6), so sticky would have nowhere to go. `.lines` becomes
  `display: block` and the `0.15rem` grid gap becomes `margin-bottom: 0.15rem` on `li`, zeroed on
  the last child so the block's outer height is unchanged. `.lines li` already has vertical padding,
  so no margin can collapse through it.
- **An opaque background** — `var(--clay-bg)`, the page colour — or rows scroll through the
  heading. Invisible where it is not stuck, because it is the colour already behind it.
- **Room above the text when it is stuck.** `padding-top: 0.4rem` with `margin-top` reduced by the
  same `0.4rem` — the box grows upward by exactly the amount the margin gave up, so the static
  layout does not move a pixel. Same arithmetic on `:first-child`.

At `narrow`, **`.aisle-note` is hidden**. It is the charm ("the greengrocer's end"), not the
wayfinding, and at 375px it is what makes *Baking aisle* a 45px two-line heading (§4.6). A pinned
bar has to be one predictable line; hiding the note is better than truncating it with an ellipsis,
which would leave the visitor reading half a phrase.

**Rejected — a heading that re-states itself at the top of each screenful** (an "in Produce"
crumb). More machinery, another element to keep in sync, and it says the same thing sticky says for
free.

**Rejected — sticky only at `narrow`.** Sticky changes nothing about a page at rest, so it costs
desktop nothing and a long list is long on a laptop too. Making it conditional would be a rule
written to protect a screenshot rather than a reader.

## D4 · The badge says a word again at 375px

**Chosen — a short word at `narrow`: `pack` · `part` · `smidge`.**

At 375px the badge is three dots and a hover tooltip on a device with no hover (§4.5). The file's
own comment says why that is wrong: *"a meter alone would be a colour-and-shape guess."* The
criterion "pips remain readable" is met by geometry today and failed by meaning.

`drawLine()` appends a second span, `.scale-short`, carrying a short form of the same scale. The
two are swapped by the one width query:

- wide: `.scale-word` shown, `.scale-short` `display: none`
- `narrow`: `.scale-word` gets `.visually-hidden` (the global helper at `site.css:95`),
  `.scale-short` shown and `aria-hidden`

Swapping to `visually-hidden` rather than `display: none` means **the accessible name of the button
is the same at every width** — always "a pack", "part of a pack", "a smidge", never the clipped
form. That is strictly better than today, where the narrow rule takes the word out of the
accessibility tree entirely.

The short words are a four-line map in `list.astro`. `SCALE_WORDS` lives in `shopping.ts`, which
this ticket may not modify, so the map is local and carries a comment saying where it belongs if
the file scope ever opens.

Budget: the badge grows from 24.9px to ~68px at 375px, and the name column absorbs it. After D1 the
name still holds ~175px on a typical row against 199px today, because D1 hands back the 88px the
amount used to reserve. Longer names wrap to two lines exactly as they do today (2 of 84).

**Rejected — a legend above the list.** One explanation, read once, then pips are decodable and the
rows stay narrow. But it scrolls away, and nobody standing in Spices scrolls back up 5 000px to
remember what two dots meant. The sticky heading earns its place because you cannot lose it; a
legend has the opposite property.

**Rejected — leaving it as pips only** and reporting the criterion satisfied. Defensible on the
letter of it and wrong on the ticket's actual question, "are they still at-a-glance".

## D5 · Width vocabulary

**Chosen — one query, `@media (max-width: 34rem)`, and `snug` left alone.**

Everything narrow-specific goes in the file's single existing width query, which already writes
`narrow`. `src/styles/breakpoints.test.ts` fails the build on any other literal, so this is
enforced rather than promised.

`44rem`/`snug` is not used. Using it would mean flipping its `[reserved]` tag to `[in use]` in
`src/styles/site.css` — a file outside this ticket's scope — or leaving the tag stale. Nothing in
this design wants a middle step: the list is one column at every width and the questions are touch
and legibility, which are the phone's questions.

A comment goes at the top of the style block naming where the vocabulary is defined, so the next
reader of this file does not have to find `site.css` to learn why the number is 34.

---

## What this does not do

- **545px–1440px keeps 36.6px rows** (D2). A tablet is touch and is not covered.
- **`title` stays the only home for the pack hint** ("this uses most of one — a 2 lb bag"). It is
  hover-only. Putting it in the row costs a line per item; putting it in `.from` mixes two
  unrelated notes. Left as found.
- **No change to the tick state.** `TICK_KEY`, `loadTicks`, `saveTicks`, `pruneTicks` and the click
  handler are not touched. D1 moves an `append()` argument; the handler closes over `button` and
  `box`, both unmoved.
