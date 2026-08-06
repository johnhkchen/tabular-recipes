# T-006-01 · Design — put the attribution in the label slot that already exists

**Decision: change one string.** `src/pages/[slug].astro:42`, the chip's label, from `about` to
`recipe says`. Nothing is added to the clock panel. Cost: **+6 visible characters a page**, on all
658 pages, mean 2823 → 2829.

Everything below is why, and what was rejected.

---

## The problem restated in terms of the code

Research §1 found that the chip is already built as a label/value pair:

```js
{ label: 'about', value: recipe.metadata.time }
```

The value is the author's word. The label is the site's. **The bug is that the label slot is
filled with a hedge instead of an attribution** — the ticket says this exactly: *"the word `about`
is doing double duty — it reads as a hedge on the number when it is really the whole
attribution."* So the shape of the fix is already in the file. There is one string in a label slot
and it is the wrong string.

That framing decides most of what follows: this is not "add a label to the page", it is "fill the
existing label correctly", which is why it can be done inside the character budget at all.

---

## The options

Every cost below is the change in **mean visible characters a page**, by
`scripts/measure-pages.mjs`'s method — tags stripped with no substitution, so the delta is just
the difference in plain text. Baseline 2823 (658 pages).

### A — chip label `about` → `recipe says`  · **+6** · CHOSEN

`serves 12 · recipe says 24 hr · Breads`, then `The clock` panel below with `at least 16 hr
15 min`.

### B — chip label `about` → `the recipe says` · **+10**

The phrasing `docs/gaps/voice.md` §2 and the ticket both write in prose. Reads slightly more like
a sentence; costs 67% more than A for one article.

### C — clock heading `The clock` → `The clock, from the steps` · **+16**, chip unchanged

Attributes the panel, leaves the chip saying `about` with no owner. The `<h2>` is unconditional,
so all 658 pages pay it, including the 23 with no clock figures — where it would promise steps
that timed nothing.

### D — A + C together · **+22**

Belt and braces. Both figures named in their own words.

### E — chip label → `recipe says`, and pay for a panel word by shortening the axis caption

`Drawn to scale, longest wait and all:` (36) → `Drawn from the steps, to scale:` (31). Net about
**+1**.

### F — `about` → `we think` on the chip

Reuses the site's established two-word phrase for its own readings (`OUR_READING`,
`Timeline.astro:137`). **+3.**

---

## Why A

**1. The chip is the ambiguous figure. The panel is not.**

This is the load-bearing argument and it comes out of reading the markup rather than the story.
The clock is not a number on its own: it is a `<section>` headed `The clock`, containing one row
per operation, each with its own duration, a hands-on tag, a `(we think)` where the reading is the
site's, an axis drawn to scale, and a four-item legend. **The panel shows its work in front of the
reader.** Nothing inside it can be mistaken for a single figure somebody typed at the top of a
recipe file.

The chip cannot show its work, because there is none — it is a quotation. It sits in a row with
`serves 12` and `Breads`, in the site's own voice, hedged with the site's own word. That is
exactly the number that needs a source, and it is the only one.

So the contrast the story asks for — *which is the recipe's word and which is the table's* — is
produced by naming one side. Once `recipe says 24 hr` is the recipe's word, everything else on the
page is the page, which is what it already looked like.

**2. It costs the least of any option that names anything.** The ticket's own words: *"This ticket
adds words to a site that just spent an epic removing them."* 6 characters is the smallest true
answer on the list. C is 16 for the weaker half; D is 22 for both.

**3. It resolves the two `about`s by removing one of them** (see below), which no other option
does. B and C leave `about` on the chip; F replaces it with a phrase already carrying a different
job.

**4. It matches the register of the chips it sits in.** `serves` **12** / `recipe says` **24 hr**
— a verb and its number, twice, in the same clipped chip English. Not a coincidence worth much,
but it is the reason `recipe says` reads better in a chip than `the recipe says`: chips do not
carry articles.

**5. It survives the chip-only page.** See the hard cases below.

## Why not the others

**B (`the recipe says`, +10).** The article is what makes it read as the beginning of a sentence,
and it is 4 of the 10 characters. `voice.md`'s first house test — *would a friend say it at a
kitchen table* — passes either way; a friend says "recipe says four hours" as readily as "the
recipe says four hours". The article buys nothing and costs 67% more. Rejected on price.

**C (heading only, +16).** Two failures. It leaves the ambiguous figure unattributed, which is the
half of the problem that matters. And on the 23 pages where nothing is timed, the panel heading
would read `The clock, from the steps` above `Not one of its 4 steps is timed.` — a heading
promising a derivation the page then says it could not do. Rejected on correctness, then on price.

**D (both, +22).** The honest reason to reject this is the budget: 22 characters is not "within a
few characters of 2823 mean". The second reason is `voice.md`'s third house test — *say it once*.
If the chip says the number is the recipe's, the panel saying it is not the recipe's is the same
fact twice. **This is the option a reviewer is most likely to ask for**, so it is recorded here
with its price, and again in `review.md` as an open concern.

**E (pay for it by cutting the axis caption, +1).** Cheapest of the lot and still wrong. The
caption is `aria-hidden`, renders only when there are stretches to draw, and sits *below* both
figures — it is the axis's caption, not the totals'. Attribution that a reader meets after the
number it attributes is not attribution, and rewriting a caption about scale into a caption about
provenance makes the drawing worse to buy something the drawing was not carrying. Rejected: the
saving is real, the placement is wrong.

**F (`we think` on the chip, +3).** Actively wrong, and worth writing down because it is cheap
enough to tempt. `we think` is the site's phrase for *the site inferred this*, used on the bar
edge, on the row, and in the legend. Putting it on the author's own figure would say the exact
opposite of the truth. Rejected on meaning.

---

## The two `about`s — the decision, recorded

**They are separated, and separated by deletion rather than by a new word.**

Today, on 365 pages, `about` appears twice:

| where | what it means today |
| --- | --- |
| the chip, all 658 pages | *this is the author's figure* — attribution wearing a hedge's clothes |
| `Needs you`, 365 pages | *this figure is fuzzy in both directions* — `Timeline.astro:219–227` |

After this change, `about` appears on the page **in one place and with one meaning**: the site's
own worked-out figure, where the number is approximate. The chip stops using it entirely.

This is the better of the two resolutions the ticket permits, because the alternative — declaring
them the same word deliberately — would require them to actually mean the same thing, and they do
not. The chip's `about` is not a claim about precision at all; `sourdough-boule`'s author did not
write `about 24 hr`, they wrote `24 hr`, and the page added the hedge. Keeping the word on both
would mean the page hedging a number it is only quoting.

**Consequence in the source.** `Timeline.astro:225–226` currently ends its argument for `about`
with *"and it is the word the page already uses for the author's own time in the chips above"*.
That clause becomes false the moment this ships. It is a comment, so it changes no output, but it
must be corrected in the same change — an argument resting on a fact that stopped being true is
how the next person gets it wrong. The rest of that comment (untimed steps leave minutes out;
hands-on is the fallback) is unaffected and stands on its own.

---

## The two hard cases the ticket names

**1. A page with the chip and no clock — the 23.**

`guacamole` before:

```
Guacamole
Taqueria · serves 4 · about 15 min · Sauces and Gravies
The clock
Not one of its 4 steps is timed.
```

after:

```
Guacamole
Taqueria · serves 4 · recipe says 15 min · Sauces and Gravies
The clock
Not one of its 4 steps is timed.
```

**`recipe says 15 min` is a complete thing to read with nothing beside it.** It names a source and
gives a number; it does not point at a second figure, and it reads no worse alone than in company.
That is the specific test the ticket sets — *an attribution that only makes sense as a contrast
will read as half a sentence there* — and this phrasing is not a contrast, it is a source. C and D
both fail this test through the heading; A does not.

There is no page in the opposite state (research §2 confirms: 0 pages print the clock without the
chip), so no case needs the mirror argument.

**2. The two `about`s.** Above.

---

## What is not being touched, and why

- **Neither figure's value.** `recipe.metadata.time` is the chip's `value` and the label is a
  sibling string; `Timeline.astro` never reads `recipe.metadata.time`. Byte-identical
  `Start to finish` / `Needs you` across 658 pages is provable and will be proved, not asserted.
- **`schedule.ts`.** Out of scope by the ticket and not needed by this design.
- **The author's `>> time:`.** Still printed, on every page, unchanged.
- **`site.css`.** The chip label is unstyled and inherits `--clay-ink-soft`; `.chips b` styles the
  value. A longer label needs no rule. The chips row is `flex-wrap: wrap`, so the extra 6
  characters wrap rather than widen the row. **This ticket is expected to modify two files, not
  three.**
- **The 14 contradictory recipes.** T-006-02, different files, running alongside.
- **The clock panel's markup.** Nothing added, nothing removed.

---

## What this does not fix, stated plainly

A reader now knows the chip is the recipe's word. They learn what the clock is by looking at the
clock, which shows them. **They are not told in words that the clock is derived from the steps.**
If that is judged insufficient, the remedy is option D and it costs 16 more characters against a
criterion that says "a few". That trade is a person's call, not this ticket's, and it is carried
into `review.md` as the single open concern.

Nor does this define what `>> time:` means — the story says explicitly it does not, and
`docs/gaps/voice.md` keeps it on the list.
