# T-005-03 · Design — one field, two placements

Five decisions. Each is answered from `research.md`, and each names what was rejected.

---

## Decision 1 — the shape: one field, `notes`, a list, with an optional `of`

### The candidates

**A · scalar `note: string` on a section.** The simplest thing that could work. One sentence
per section, about the group, allowed to name a dish.

**B · two fields — `note` on a section, `notes: {slug: string}` on the items.** The ticket's
"two" option: a group sentence and a per-dish sentence are different animals, so give them
different homes.

**C · one field, `notes`, a list of `{ of?: slug, note: string }`.** One key on a section. An
entry with `of` is about that dish and renders beside it; an entry without is about the group
and renders under the heading.

**D · one field, `notes: { slug: string }` — per-item only, no group note at all.** The
leanest reading of research §6a, where not one of the 35 sentences is about a group.

### What the data says

**A is dead on arrival, and this ticket kills it.** `The Slow Cooker / Braises, left alone all
day` holds 18 items and **10** of the 35 shelf-talk sentences (research §6b). It is not even a
future problem: of the four recipes the acceptance criteria name, `baked-turkey-wings` and
`new-england-boiled-dinner` are both in that one section. A scalar could carry one of them.
The ticket's own proof set breaks the ticket's own preferred shape, and that is the finding.

**D is very nearly right, and loses on one thing.** Research §6a is unambiguous — every one of
the 35 sentences names a dish, because each was written on a page that had a subject. But the
absence of group sentences in the corpus is evidence about *where the sentences came from*,
not about what a menu needs. `Braises, left alone all day` says what the group is called and
nothing about what makes these the ones; that gap is real, and D forecloses it permanently.

**B pays for that gap with a second field**, and the ticket's objection stands: a second key
is a second thing to keep filled across 21 counters and 147 sections, and it forces a writer
to classify a sentence before writing it. Worse, the classification is often false — *"the one
bean dish here where slow beats pressure"* is simultaneously about the dish and about what the
shelf is for.

**C is B's coverage at A's cost.** One optional key on a section. `of` present or absent is
not a second field to keep filled; it is the sentence's subject, which the writer knows
already because they just wrote it.

### Chosen: C

```json
{
  "title": "Braises, left alone all day",
  "items": ["pot-roast-slow-cooker", "..."],
  "notes": [
    { "note": "Every one is written for low and six to eight hours. …" },
    { "of": "baked-turkey-wings-slow-cooker", "note": "The only one here that browns …" }
  ]
}
```

- **One new key**, `notes`, on a section. Absent on 145 of 147 sections.
- **A list**, because ten sentences want one section.
- **`of` optional**, because the subject is either a dish in this section or the section
  itself, and nothing else.
- **No key anywhere else.** Not on the counter, not on an item — an item is a bare slug today
  and stays one, so `items` keeps diffing cleanly against `menu-sections.mjs` output.

Rejected along the way: `notes` as an object keyed by slug (cannot hold a group note, and
loses the order the author wrote them in); a `notes` array at counter level with a `section`
key (moves the note away from the thing it is about, and makes every note carry two pointers
instead of at most one).

## Decision 2 — where it renders

A note is words. `[counter].astro:50–57` is the rule and it is not being bent: no control, no
badge, no disclosure.

**A group note** — `<p class="menu-note">` between the `<h2>` and the `<ul>`. It reads as a
sentence under a heading, which is what a menu board does.

**An item note** — `<p class="item-note">` inside the `<li>`, **after the `</a>`**.

Not inside the anchor, and this is the one placement choice with a measurement behind it.
Research §3: `@media (max-width: 34rem) { .menu-section a { min-height: 44px } }` exists
because T-004-03 found ten items drawing at 42px against a 44px thumb. A note inside the
anchor grows the tap target — harmless — but it also joins the link's accessible name, so a
screen reader would announce *"Baked Turkey Wings, slow cooker, turkey, onion gravy,
cornstarch, smothered turkey wings, the only one here that browns before the pot…"* as one
link. Outside the anchor, the link keeps the name it has today and the note is read as the
prose it is.

It also keeps the browser's `.item-onlist` mark untouched: that script appends into the
anchor (`[counter].astro:90`), and a sibling after the anchor does not collide with it.

## Decision 3 — the cap: 120, the same number, and `voice.md` is not touched

The ticket allows a different number if it is justified in `voice.md`. It is not needed.

The `prose row` cap is 120 and its published reasoning has two halves
(`check-recipes.mjs:49–51`): *essays start at 125*, and *this row prints three times*. A menu
note prints once, so the 3× half does not carry over — but the first half does, and it is the
half that matters. 120 is where a sentence stops being a sentence.

The layout agrees. `.menu` is `columns: 2 19rem`; at 375px a note is about 40 characters a
line, so 120 characters is three lines under a menu item. 200 would be five.

And the sentences fit. All five notes written for this ticket are at or under it, without
squeezing:

| | Chars |
| --- | ---: |
| `boston-baked-beans-slow-cooker` | 113 |
| `baked-turkey-wings-slow-cooker` | 118 |
| `new-england-boiled-dinner-slow-cooker` | 111 |
| `soy-sauce-chicken-slow-cooker` | 84 |
| group note on `Braises, left alone all day` | 119 |

So: **120, no divergence, `docs/knowledge/voice.md` unmodified.** That keeps this ticket
inside its declared file list, and it keeps one number in the project instead of two. Recorded
as an open concern for review: `voice.md` §"Where the words go" now points at a room that
exists, and nothing there yet tells T-005-05 the field's name or its cap. The checker's own
error message does, and `voice.md` is not this ticket's file.

## Decision 4 — validated in `parse-recipes.mjs`

The acceptance criterion: *a note attached to a section or slug that does not exist fails the
check with a message that says which counter and which slug.*

**`check-recipes.mjs` cannot do the whole job.** Research §4: it is invoked per file
(`npm run check recipes/soups/*.cook` is a supported and documented call), so on a partial run
it does not know the slug set and cannot answer *is this recipe actually shelved here*. Its
own header says it *"Checks .cook files one at a time"*; counters.json is not a `.cook` file.

**`parse-recipes.mjs` can.** It already holds `slugs` (line 48), already reads `COUNTERS`
(line 21), and already owns exactly this class of check — the counter-name check at lines
60–68 is the one the criterion says to match. It throws, which fails `npm run recipes`, which
is inside `npm run verify`, `npm run build` and `npm run dev`.

Four things get checked, all before any recipe is read, because a malformed data file should
fail on its own terms rather than as a downstream symptom:

1. `notes` is an array, and each entry is an object with a string `note`.
2. `note` is at or under 120 characters, reported as `N/120`.
3. `of`, when present, is a slug listed in **this section's** `items`.
4. `of` names a recipe that is really shelved at this counter — i.e. its `>> counters:` line
   includes this counter's name. Without this, a note survives on a slug the section lists but
   `menuFor` filters out, and it silently never renders.

Every message names the counter, the section title and the slug, in the shape the existing
counter-name error uses.

Rejected: splitting it — structure in `parse-recipes.mjs`, the cap in `check-recipes.mjs`
where `CAPS` lives. Two files failing for one bad line is worse than one constant living in
two places, and the second copy carries a comment naming the first.

## Decision 5 — the CSS: `<style is:global>` in `[counter].astro`

Three ways to style two elements, and research §7 measured all three.

| | Cost |
| --- | --- |
| `src/styles/site.css` | Rehashes `Base.<hash>.css` → the `<link>` href changes on **all 682 pages**. Also outside this ticket's file list. |
| scoped `<style>` in `[counter].astro` | Astro stamps `data-astro-cid-*` on every element in the template → every menu page's markup changes. |
| **`<style is:global>` in `[counter].astro`** | Astro inlines one `<style>` at the end of `<head>` on the 21 menu pages. `<main>` unchanged, byte for byte. Bundle hash unchanged. |

Chosen: `is:global`.

**This is the one place the acceptance criterion is met in spirit and not to the letter, so it
is stated plainly here rather than discovered in review.** *"A counter with no notes renders
byte-identically to today"* — the twenty note-less counters render a byte-identical `<body>`,
and their `<head>` gains one inlined `<style>` element. The full text of that element is
quoted in `review.md`; it is the entire difference.

The one shape that would be literally byte-identical — emitting the CSS through
`<Fragment set:html={...} />` only when the counter has notes — was written out and rejected:
it puts a `<style>` element in `<body>`, which browsers accept and the HTML spec does not, and
it encodes a trick that the next person to style this page would have to either understand or
break.

The two rules are small and inherit almost everything:

```css
.menu-note  → the group sentence under the h2
.item-note  → the sentence under an item
```

Both take `--clay-ink-soft` and the 0.84rem/1.45 that `.item-of` and `.item-aka` already use,
so a note reads in the menu's existing quiet voice rather than as a new kind of thing.
`.menu-note` sits above the list with the heading's spacing; `.item-note` indents nothing —
the menu is drawn on the left edge of the item, and `.item-onlist`'s comment records that
indenting was already rejected once here.

---

## What this design does not do

- **It does not touch `src/lib/counters.ts`.** The `Counter` interface still describes a
  section as `{ title, items }`, so `[counter].astro` declares the note's shape locally and
  reads it off `menu.counter.sections` rather than through `menuFor`. The file is outside the
  ticket's list. The cost is a type that does not yet know about a field the JSON carries;
  carried to review as an open concern for whoever owns `counters.ts` next.
- **It does not touch `.cook` files.** The four sentences are *copied* to the menu. T-005-05
  removes them from the recipes and owns those files. `progress.md` records exactly which
  sentence went where so it is not moved twice.
- **It does not fix `menu-sections.mjs`.** `--write` still discards `notes` (research §2).
  Out of scope to change; in scope to warn about, and the warning goes in `counters.json`'s
  own `"//"` header, which is the file it would destroy.
- **It does not add a note to any counter but The Slow Cooker.** The proof set is the four
  named recipes plus one group note, all at one counter, which is where the acceptance
  criteria point. The other 31 shelf-talk sentences are T-005-05's to move.
