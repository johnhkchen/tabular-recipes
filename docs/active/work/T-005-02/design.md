# T-005-02 · Design — the hedge moves into the number

The decision, the three cases the ticket asks to be answered, and the dashed/dotted fork.

---

## 0. The rule that decides every line below

> **A fact about the recipe stays. A sentence about how the site reasons goes.**

"1 of 4 steps gives no time" is a fact about the recipe. "…so both numbers are floors" is the
site explaining its own arithmetic. Everything in this ticket sorts cleanly on that line, and it
is the line the acceptance criteria draw: *"No prose on a recipe page describes the site's own
inference."*

Where a fact is kept, it is kept **as a label under a figure**, not as a sentence in a
paragraph. Where a hedge is needed, it is kept **as a word inside the figure**.

---

## 1. The vocabulary: two words, one per kind of uncertainty

The ticket asks for "the same word for the same uncertainty in both" components. There are two
uncertainties, and they point in different directions, so they get one word each — used
identically in `Timeline.astro` and `CookModes.astro`.

| Word | Means | Goes on | Fires when |
| --- | --- | --- | --- |
| **`at least`** | the number is missing minutes we know nothing about | the elapsed figure | `untimedCount > 0` |
| **`about`** | the number is our reading, not a quote | the hands-on figure | `untimedCount > 0` or any bar's attention is ours |
| **`we think`** | this *word* is our reading | a per-step attention word | that step's attention is ours |

**Why not `about` everywhere.** The ticket's headline example is `about 3 hr 30 min`, and
`about` is already the site's word for a duration — `[slug].astro:42` prints the author's own
`>> time:` as a chip labelled **`about 2 hr`** on all 658 pages. Joining that vocabulary is
right for a figure that might be wrong in either direction. It is wrong for a figure that can
only be *too small*, and the collection contains the proof:

> **`pizzelle`** times 45 **seconds** across five steps and its own header says 45 **minutes**.
> Today it reads *at least 45 sec*. Written *about 45 sec* it would sit 200px below a chip
> reading *about 45 min*, and one of the two would be a lie.

`Timeline.astro:208–213` already argues this case in a comment; `CookModes.astro:263` already
wrote the word — *"That instinct was right,"* says the ticket. So `at least` is kept, and kept
for the figure it is true of.

**Why the hands-on figure gets `about` and not `at least`.** It is wrong in both directions at
once: untimed steps leave minutes out of it, and every minute of assumed hands-on may not be
hands-on at all. A floor word would claim a direction we do not have. `about` is the honest
shape of a number that is fuzzy rather than short.

So each figure has exactly one hedge word it can ever wear. Nothing has to be sequenced, and no
page can read *"at least about 10 min"*.

**Coverage, measured:** `at least` on 577 pages, `about` on 365, **no hedge word at all on 44** —
the recipes where nothing is untimed and every reading is the author's own.

## 2. The three cases the ticket asks to be answered

### 2.1 The overlap — 15 pages — *a different label*

> *"It adds up to more hands-on time than the whole dish takes because two branches run at once."*

`mushroom-risotto`: 34 minutes of hands-on work inside a 24-minute dish. Measured across the 15:
2 overlapping steps on nine pages, 3 on five, 4 on one.

**Chosen: a different label** — the `.sub` line under the hands-on figure states the recipe fact
that makes the arithmetic ordinary:

```
Start to finish   at least 24 min
Needs you         about 34 min
                  4 steps run at once
```

Four words, a count, and a fact about the recipe, on exactly the 15 pages where two numbers look
like they disagree. It replaces a 118-character sentence about how the site counts.

*Rejected — accepting it:* the timeline directly below draws the overlapping bars, so a reader
who looks does find out. But the two numbers are read first and in display type, and 34-inside-24
reads as a bug before anybody reaches the chart. Fifteen pages is few enough to leave broken and
few enough to fix cheaply; fixing is the better trade.

*Rejected — renaming "Needs you" to something that means "summed work":* every candidate was
either jargon ("active time", "total hands-on") or still implied a share of the clock. The label
is not what is wrong; the missing fact is.

### 2.2 Assumed hands-on — 97 + 57 pages — *the hedge word reaches it*

> *"Nothing here says whether you can walk away, so all 10 min of it is counted as time you are standing over it."*

The ticket is explicit that the hedge must reach this case and not only the missing-timer case.
It does, by construction: the `about` on the hands-on figure fires on
`untimedCount > 0 **or** any bar's attention being ours`, so French onion soup's 50-minute
caramelise — counted hands-on on the site's say-so alone — is printed as **`about 1 hr 5 min`**,
never as a bare figure. 14 recipes get `about` on this ground alone, with a fully-timed clock
beside it.

At the step where the assumption was actually made, the same fact is carried by the word:
`50 min · needs you (we think)`, and the bar's dashed edge. The claim the recipe never made is
never printed without a hedge attached to it.

*Rejected — keeping a shortened sentence ("10 min of that is our guess"):* it is still the site
narrating its own method, and it is the sentence the ticket is deleting, one clause shorter.

### 2.3 The author's own `>> time:` — 658 pages — *deleted, because the page already prints it*

> *"The recipe itself says 3 hr 30 min."*

**Deleted from the timeline. The fact does not move, because it is already there:**
`[slug].astro:42` prints `about 3 hr 30 min` as a chip under the title, on every one of the 658
recipes that carry `>> time:` — measured, all 658. `CookModes.astro:281–285` already refuses to
print it a third time and says why: *"a third copy in the same chip shape reads as three
different claims rather than one."* This ticket extends that restraint to the second copy.

**Is it a fact worth showing at all once the computed figure is honest?** Yes — and that is the
argument for deleting the *note*, not the chip. The two figures answer different questions: the
chip is what the author claims for the whole dish, the timeline is what the table's own timers
add up to. On `pizzelle` they differ by a factor of sixty, and a cook needs the author's number
there. Keeping it in the chrome above the table, where the servings and the category are, keeps
it plainly the author's; repeating it inside a panel of computed numbers makes it look like a
third computed number.

The one page where the author's figure carried real weight inside the panel is the
`timesNothing` verdict (23 pages), which said *"the recipe itself says 2 hr altogether, but it
does not say where that time goes."* That whole two-sentence paragraph collapses to the recipe
fact — **`Not one of its 5 steps is timed.`** — and the chip above still says `about 2 hr`.

## 3. The dashed and dotted edges — the fork

**Chosen: the code collapses from three-way to two-way, and its meaning lives in the legend and
in the words beside every bar.**

### What the three levels are, and which of them is about the recipe

| `confidence` | Where it comes from | Edge today | About |
| --- | --- | --- | --- |
| `stated` | the author named a timer we know — `~rise{90%min}` | solid | the recipe |
| `inferred` | read off the operation's own words — "braise 3 hr" | dashed | **our method** |
| `unknown` | nothing said, so hands-on is assumed | dotted | **our method** |

The split a cook can act on is **the author said so / we worked it out**. The split between the
two ways *we* worked it out is a fact about the site, and this story's whole subject is that
such facts do not belong on a recipe page. Three levels also cost a three-line legend, which is
a paragraph wearing a different hat.

`readTimers()` only ever defaults to hands-on, so **a dotted bar always reads "needs you"** — the
third level can only ever tell a cook to stay when they might have left, which is the safe error
already. Collapsing it loses no warning.

### What a reader now understands from an edge, and how

- **Solid edge** — the recipe said whether you have to be there.
- **Dashed edge** — we worked it out. Three things say so, and none of them is a paragraph:
  1. **The words on the row**, next to the bar: `50 min · needs you (we think) · 20 min in`.
     Present already, on every row, for both collapsed levels.
  2. **The legend**, `<ul aria-label="How to read the bars">`, gains a fourth item: a swatch with
     no fill and a dashed edge, labelled **`we think`**. The legend is one of the homes the
     ticket names, it is read aloud by a screen reader, and it costs eight visible characters on
     the 307 pages that draw a dashed bar and nothing on the other 351.
  3. **The bar's `title`** is not used for this; a title attribute is invisible on a phone, and
     this collection is read on phones.

Measured, this is a code that carries information rather than firing on everything: of 1697 bars
with a duration, **1112 solid, 585 dashed**. The 1380 untimed operations draw a diamond mark and
no edge at all, exactly as before.

*Rejected — dropping the edge entirely:* the words on the row already carry the fact, so nothing
would be lost in text, and the chart would get simpler. But the edge is free, it is the fourth
signal the component's own design note asks for, and a reader scanning bars sees which readings
are ours without reading a word. The ticket's objection is to an *undocumented* code, and a
legend documents it.

*Rejected — keeping three levels with a three-line legend:* it documents the code by printing
the deleted paragraph in a list.

*Rejected — a `title` attribute:* invisible to touch, invisible in print, and the mobile
verification this repo runs is the reason to say so.

The timeline's geometry is untouched: `FLOOR_PX`, `LABEL_AT`, `LABEL_FITS_AT`, the linear
`fr` columns and the container queries are all left exactly as they are. **No compression, no log
scale, no invented ratio** — the only change to the drawing is one `border-style`.

## 4. Where each deleted sentence's fact goes

| Sentence | Pages | Where the fact goes |
| --- | ---: | --- |
| "One of the 4 steps never says how long it takes, so both numbers are floors." | 577 | the count becomes the `.sub` label `1 of 4 steps gives no time`; "floors" becomes the word **`at least`** |
| "The shortest stretches keep a sliver…" | 531 | the `.axis-caption` above the axis already says *"Drawn to scale, longest wait and all:"*; every row already prints its own duration, which is what the sentence promised |
| "…a dashed edge means we worked out… a dotted one means nothing was said…" | 307 | the legend's `we think` swatch, and the per-row `(we think)` |
| "Start to finish is the longest chain through the table…" (CookModes) | 144 | nowhere, and nothing is lost — see §5 |
| "It adds up to more hands-on time than the whole dish takes…" | 15 | the `.sub` label `4 steps run at once` |
| "12 min of that is counted as needing you only because the step never said otherwise." | 57 | the word **`about`** on the figure, and `(we think)` on the step it came from |
| "Nothing here says whether you can walk away, so all 10 min of it…" | 97 | same |
| "The recipe itself says 3 hr 30 min." | 658 | the `about 3 hr 30 min` chip under the title, which was always there |
| "This one never puts a number on anything…" (verdict) | 23 | shortened to `Not one of its 5 steps is timed.` |
| "Not one step here is timed…" (CookModes) | 23 | the verdict above, which says it once |
| `.sub` "two waits that overlap count once" | 635 | nowhere; it describes the arithmetic, and on the 15 pages where the arithmetic shows it is replaced by `4 steps run at once` |
| `.sub` "of the steps that give a time" | ~577 | the new `1 of 4 steps gives no time` under the elapsed figure says it plainer |

## 5. `clockFacts` is dead code, and the 144-page note explains a number nobody prints

`CookModes.astro:264–286` builds `clockFacts` and **never renders it.** `grep` finds the name
once, at its declaration. The cook pane's comment at `412–416` records why: the chips were
removed because the timeline prints the same numbers 200px away.

Two things follow.

1. The `at least` at `CookModes.astro:263` — the instinct the ticket calls right — has not been
   on a page for as long as the chips have been gone. **The vocabulary this ticket unifies is
   being written into CookModes for the first time, not corrected.** `clockFacts`, `floor`,
   `workMinutes`, `anyTiming` and the `.clock` CSS block all go with it.
2. The live 144-page note — *"the waits add up to more than the clock"* — explains a clash
   between the elapsed figure and the **waiting** figure. The waiting figure lived in
   `clockFacts`. It is not printed anywhere on the page today, so the note explains a
   contradiction a reader cannot see. Deleting it loses nothing, and the 15 pages where a
   visible clash does exist are handled in §2.1 where the two visible numbers are.

## 6. Should the schedule expose the uncertainty?

Yes, once, for one thing. The ticket allows `schedule.ts` to change "if the schedule has to
expose the uncertainty rather than each component re-deriving it" — and the components have
already drifted apart doing exactly that: `Timeline.astro:255` asks `confidence !== 'stated'`
while `CookModes.astro:491` asks `confidence === 'unknown'`, so today the same step is hedged in
one pane and not the other.

`schedule.ts` gains **one export**:

```ts
/** True when the hands-on / walk-away reading is ours rather than the author's own word. */
export function attentionIsOurs(task: Task): boolean {
  return task.confidence !== 'stated';
}
```

That is where the two-way collapse is defined, in the module that assigns `confidence` in the
first place. Four call sites — Timeline's row hedge, Timeline's legend, Timeline's `about`
condition, CookModes' step hedge — cannot drift again. `schedule.test.ts` gains a test beside
the existing *"will not claim to know whether you can walk away"*.

Nothing else in `schedule.ts` changes: no new field on `Schedule`, no change to any number.
`assumedHandsOnMinutes` stays, still read by Timeline's `about` condition; nothing else consumed
it and nothing else will.

*Rejected — adding a `hedged` boolean to `Schedule`:* the elapsed figure's condition is already
`untimedCount > 0`, which `Schedule` exposes, and a second derived boolean would put the
components' presentation rule inside the scheduler.

*Rejected — leaving both components to re-derive it:* that is the defect, not the constraint.

## 7. The two named recipes, before and after

**`shakshuka` — nothing to hedge** (4 steps, none untimed, every reading the author's own; one of
44). After the change the page has lost two sentences and gained nothing:

```
before   Start to finish  34 min / two waits that overlap count once
         Needs you        11 min / the rest you can walk away from
         "The recipe itself says 45 min."
         "Drawn to scale, so a long wait really does take up the room it takes. The shortest
          stretches keep a sliver so they stay visible; their times are printed beside them."

after    Start to finish  34 min
         Needs you        11 min / the rest you can walk away from
```

No `at least`, no `about`, no `we think`, no dashed bar. **Deletions only** — which is the
acceptance criterion, stated as a page.

**`mushroom-risotto` — everything to hedge** (1 untimed step, 4 minutes assumed hands-on, three
readings inferred, and 34 minutes of work in a 24-minute dish; one of 15):

```
before   Start to finish  at least 24 min / two waits that overlap count once
         Needs you        34 min / of the steps that give a time
         "One of the 5 steps never says how long it takes, so both numbers are floors.
          4 min of that is counted as needing you only because the step never said otherwise.
          It adds up to more hands-on time than the whole dish takes because two branches run
          at once — which needs someone free to run both. The recipe itself says 45 min."
         "…a dashed edge means we worked out from the step whether you have to be there, and a
          dotted one means nothing was said…"

after    Start to finish  at least 24 min / 1 of 5 steps gives no time
         Needs you        about 34 min / 4 steps run at once
         rows:  4 min · needs you (we think) · from the start
         legend: needs you · never timed · ▭ we think
```

Every fact the four sentences carried is still on the page. None of it is a sentence.

## 8. What this design deliberately does not do

- It does not touch the axis, the columns, the label-fit table, or any duration string. Row
  durations are the recipe's own timers and stay bare.
- It does not touch `meanwhile` lines, `.kind` ("you can walk away" / "stay with it"), the prep
  pane, or operation labels. Those describe the recipe.
- It does not touch a recipe file, `[slug].astro`, or the chips.
- It does not change any number `buildSchedule` computes.
