# T-006-01 · Research — where the two totals come from and what already names them

Descriptive. What exists, where, how it connects. No proposal here.

---

## 1. The two figures, in the code

### The chip — `src/pages/[slug].astro:40–44`

```js
const facts = [
  recipe.metadata.servings && { label: 'serves', value: recipe.metadata.servings },
  recipe.metadata.time && { label: 'about', value: recipe.metadata.time },
  { label: '', value: recipe.category },
].filter(Boolean) as { label: string; value: string }[];
```

Rendered at `:70–77`:

```jsx
{facts.map((fact) => (
  <li class="clay-chip">
    {fact.label && `${fact.label} `}
    <b>{fact.value}</b>
  </li>
))}
```

Three facts in one `<ul class="chips">`, after the counter chips. The structure is already
**label + value**: `serves` **12**, `about` **24 hr**, and the category with an empty label. So
`about` occupies the *label* slot, not the value slot. Whatever the word is, it is a label by
construction and swapping it cannot touch `recipe.metadata.time`.

`recipe.metadata.time` is the author's `>> time:` line, read straight out of the parsed recipe.
Nothing in `[slug].astro` computes it, rounds it, or compares it to anything.

### The clock — `src/components/Timeline.astro:214–232`

```js
const totalText = `${allTimed ? '' : 'at least '}${formatDuration(schedule.totalMinutes)}`;
const totalSub  = allTimed ? '' : `${untimed} of ${stepCount} ${…} no time`;

const handsOnText = formatDuration(schedule.handsOnMinutes) || (allTimed ? 'none of it' : 'none given');
const handsOnFigure =
  schedule.handsOnMinutes > 0 && (!allTimed || anyOurReading) ? `about ${handsOnText}` : handsOnText;
```

Printed at `:280–295` as a `<dl class="stats">` of two `.stat` blocks, `Start to finish` and
`Needs you`, inside `<section class="timeline">` headed `<h2>The clock</h2>` (`:274`).

Both numbers come from `buildSchedule(recipe, tree)` in `src/lib/schedule.ts` — the timers on the
steps, merged for overlap. **`schedule.ts` is not in this ticket's scope and does not need to be.**

### They never meet

`Timeline.astro:196–201` is an existing comment recording that the author's figure is
deliberately *not* reprinted in the panel:

> The author's own `>> time:` is deliberately NOT printed here. It is already on the page, as an
> "about 3 hr 30 min" chip under the title … Repeating it inside a panel of worked-out numbers
> made it look like a third worked-out number.

That is T-005-02's decision and this ticket is not allowed to undo it. So the two figures live in
two different components that share no data about each other.

---

## 2. What the page actually prints, measured

Built at `HEAD` (`npm run build`, 682 pages, 658 recipes). Extraction script kept in the attempt
scratchpad; it pulls the chip's time-bearing chip text and the `<b>` of each `.stat`.

| | |
| --- | ---: |
| recipe pages built | 658 |
| pages printing a `>> time:` chip | **658** |
| pages printing both figures | **635** |
| pages printing the chip and no clock figures | **23** |
| pages printing the clock and no chip | **0** |

The ticket's 635 / 23 / 0 reproduce exactly.

`node scripts/measure-pages.mjs` on the same build:

```
658 recipe page(s) in dist
  mean    2823
  median  2766
  max     4474  biryani
  min     1566  egg-cream
  total   1,857,209
```

Matches `docs/gaps/voice.md`'s post-S-005 table to the character. That is the baseline the
acceptance criterion measures against.

### The 23 chip-only pages

They are the `timesNothing` branch at `Timeline.astro:277–278`: `schedule.totalMinutes === 0`, so
the `<dl class="stats">` never renders and the panel prints one line instead —
`Not one of its N steps is timed.` The `Start to finish` and `Needs you` blocks do not exist in
the HTML at all.

All 23, from the build:

```
aioli · basil-pesto · beurre-blanc · caesar-dressing · cajun-seasoning · chermoula
costra-de-azucar · creme-anglaise · egg-cream · ginger-garlic-paste · goma-dare
green-goddess-dressing · guacamole · honey-mustard-dressing · jerk-marinade · mayonnaise
memphis-dry-rub · miso-ginger-dressing · rice-krispie-treats · taco-seasoning · tahini-sauce
tandoori-marinade · zabaglione
```

Short sauces, dressings, rubs and blends, exactly as the ticket says. `guacamole` reads
`about 15 min` in the chips and `Not one of its 4 steps is timed.` in the panel. **On these pages
the chip is the only duration on the page**, so anything added to it has to make sense with
nothing to contrast against.

### `about`, both of them

| | count |
| --- | ---: |
| chips printing `about <time>` | **658** — every page |
| `Needs you` figures printing `about …` | **365** |
| `Start to finish` printing `at least …` | **577** |

So on 365 pages the word `about` appears twice, in two panels, meaning two different things:

- **the chip** — the site is quoting the author. `about` is not a hedge the site is adding; it is
  the whole of what the page says about where the number came from.
- **`Needs you`** — `Timeline.astro:219–227` argues the figure is fuzzy *in both directions*
  (untimed steps leave minutes out; hands-on is the fallback when a step says nothing), so
  `about` is the honest shape of a number the site worked out.

That same comment ends: *"and it is the word the page already uses for the author's own time in
the chips above"* — i.e. the collision is deliberate in the source today, and it is the thing the
ticket asks to be re-decided.

---

## 3. The constraint, and where it is written down

`docs/knowledge/voice.md`:

> **A sentence about the dish is for them. A sentence about how the site works out its numbers is
> not.** … Put the honesty in the number — *about 3 hr 30 min* — not in a paragraph beside it.

Three house tests: would a friend say it at a kitchen table; does it change how you cook it; say
it once. The five character caps in that file all govern **recipe file fields** (`step.N`, step
bodies, prose rows, `slack:`, ingredient notes) and are enforced by `scripts/check-recipes.mjs`.
**None of them applies to a template string in a component** — there is no checker for page
chrome. The governing limit on this ticket is therefore the acceptance criterion's *mean visible
characters ≈ 2823*, not a `CAPS` entry.

`docs/gaps/voice.md` §2 is the standing write-up, and it already names the three candidate fixes:

> Either the two figures are labelled so the difference is legible (*the recipe says* / *the table
> works out*), or the author's figure stops being printed on pages where the table has a full
> chain, or the chip carries the computed one … All three are `[slug].astro:42` and
> `Timeline.astro`.

The ticket forbids the second (do not remove the author's `>> time:`) and the third is a
recomputation the ticket also forbids. So the live ground is the first.

**S-005's deleted sentences.** T-005-02's review §"The strings grepped for zero" lists ten, not
six:

```
so both numbers are floors · keep a sliver · a dotted one means · The recipe itself says
adds up to more hands-on · counted as needing you only because
counted as time you are standing over it · two waits that overlap count once
of the steps that give a time · never puts a number on anything
```

The ticket's acceptance criterion says "the six sentences". The list of record is these ten
strings; grepping all ten is a superset of any six and is what this ticket will do.

---

## 4. What else is already on the page doing attribution work

Reading the markup for something that could carry it without new words:

- **`<h2>The clock</h2>`** (`Timeline.astro:274`) — names the panel. Says nothing about whose
  reading it is. It is the panel's `aria-labelledby` target, id `clock-<slug>`.
- **`<p class="axis-caption">Drawn to scale, longest wait and all:</p>`** (`:313`) — `aria-hidden`,
  renders only when there are stretches, sits *below* the two figures. It is about the axis.
- **The rows** (`:329–373`) — one `<li>` per operation, each with its own duration, its
  hands-on / walk-away tag and, where the reading is the site's, an italic `(we think)`
  (`OUR_READING`, `:137`). The panel visibly derives itself in front of the reader.
- **The legend** (`:375–409`) — `needs you` / `you can walk away` / `never timed` / `we think`.
  `we think` is the site's established two-word phrase for *this is our reading, not the
  author's*, and it is already used in three places (bar edge, row, legend).
- **`.chips` row** — counter link(s), then `serves`, then the time, then the category. Not purely
  the author's row: the counter chip and the category are the site's classification. So
  "the chips are the author's row" is only two-thirds true.

Nothing on the page currently says *this number is the recipe's own word*.

---

## 5. Boundaries and constraints this ticket inherits

**Files.** Only `src/pages/[slug].astro` and `src/components/Timeline.astro`, plus
`src/styles/site.css` if styling is needed. No recipe file, no `schedule.ts`.
T-006-02 owns the 14 contradictory `.cook` files and runs concurrently — **no file overlap**, so
the two tickets cannot collide. (Nothing in this ticket reads the 14 by name.)

**Character budget.** Post-S-005 mean is 2823 over 658 pages. "Within a few characters" is the
criterion. Every character added to the chip is paid on all 658 pages; every character added to
the clock panel is paid on 635. A change of *n* characters in the chip label moves the mean by
exactly *n*; in the clock heading, by `n × 635/658 ≈ 0.965n`.

**Tests.** `src/lib/*.test.ts` and `src/styles/breakpoints.test.ts`. **No `.astro` component test
exists anywhere in the repository and there is no component test renderer in `devDependencies`** —
T-005-02's review says this in as many words and calls it "the shape of the project rather than a
shortcut". Nothing in the suite asserts the chip label or the clock heading; `grep -rn "'about'"`
over `src/` hits only `[slug].astro:42` and two comments in `Timeline.astro`. So the verification
surface for this ticket is the built site, not vitest.

**Mobile.** `npm run verify:mobile` builds, then `check-overflow.mjs --width 375,390,768` and
`check-touch.mjs` over 2046 page views. The chips row is `display:flex; flex-wrap:wrap`
(`site.css:207–214`), so a longer chip wraps rather than pushing the row wide; `.stat` is
`flex: 1 1 8.5rem; min-width: 0` (`Timeline.astro:435–441`), so the stat blocks reflow. Both are
surfaces T-004 measured at 375px.

**Styling.** `.chips li` sets padding and `0.82rem`; `.chips b` sets ink and weight 600
(`site.css:215–223`). The label is unstyled, inheriting `--clay-ink-soft`. A longer label needs no
new rule to look like the ones beside it.

---

## 6. Assumptions surfaced

1. **`about` in the chip is a label, not part of the value.** The `facts` array proves it — the
   value is `recipe.metadata.time` and the label is a sibling string. Replacing the label
   therefore cannot change the figure.
2. **The clock panel's figures are byte-stable under any chip change**, because `Timeline.astro`
   never reads `recipe.metadata.time`. This is checkable rather than assumed, and the before/after
   diff will check it.
3. **The 23 chip-only pages have no `Start to finish` string at all**, so a "byte-identical across
   all 658 pages" proof has to treat their absence as a value, not as a missing row.
4. **`measure-pages.mjs` strips tags with no substitution**, so `about <b>24 hr</b>` counts as
   `about 24 hr` — 11 characters. Any label swap's cost is the plain difference in label length.

---

## 7. Open questions this research does not answer

- Whether attributing the chip alone is enough for a reader to place the clock, or whether the
  panel also needs a word. That is a design decision and it has a measurable price.
- Whether the two `about`s should be separated or declared identical. Both are defensible from
  the source comments; the ticket requires the decision to be recorded either way.
