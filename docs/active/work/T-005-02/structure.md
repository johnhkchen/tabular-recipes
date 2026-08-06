# T-005-02 · Structure — the shape of the change

Three files modified, one of them a test. No file created, none deleted.

| File | Action | Why |
| --- | --- | --- |
| `src/lib/schedule.ts` | modified | one exported predicate: the two-way collapse, defined once |
| `src/lib/schedule.test.ts` | modified | a test beside it, per the ticket |
| `src/components/Timeline.astro` | modified | the two figures, the rows, the legend, the edges |
| `src/components/CookModes.astro` | modified | the step hedge; three dead or duplicated blocks removed |

Order matters: `schedule.ts` first (both components import from it), then the two components in
either order — they share no state and no string constant except through `schedule.ts`.

---

## 1. `src/lib/schedule.ts`

**Added, after `confidenceOfTask` or beside the `Confidence` type — one function, no new field on
`Schedule`, no change to any number:**

```ts
/**
 * Whether the hands-on / walk-away reading is ours rather than the author's own word.
 *
 * `stated` is the author naming a timer we know. Everything else — read off the operation, or
 * assumed because nothing was said — is us, and a page that prints the reading should say so.
 * The two ways we came to it are a fact about this module, not about the dish, so they are one
 * answer here rather than two on the page.
 */
export function attentionIsOurs(task: Task): boolean {
  return task.confidence !== 'stated';
}
```

Public interface after the change: unchanged types, unchanged `buildSchedule`, unchanged
`authorMinutesOf`, plus `attentionIsOurs`. Nothing that reads `Schedule` today needs updating.

## 2. `src/lib/schedule.test.ts`

One `it` added next to the existing *"will not claim to know whether you can walk away"*, using
the same fixture style already in the file. It pins all three `confidence` values through the
predicate — a named timer we know is the author's word; a timer read off the operation and a
timer with nothing said are both ours — so a future fourth `Confidence` value cannot silently
land on the wrong side of the page's solid/dashed line.

## 3. `src/components/Timeline.astro`

### 3.1 Frontmatter

| Region | Change |
| --- | --- |
| `2–32` header comment | rewritten where it is now false: point 2's *"the count of them sits under the headline so the two big numbers are read as floors"*, point 3's *"solid to dashed to dotted, and also written out as 'read off the step' or 'assumed'"* |
| `35` import | add `attentionIsOurs` |
| `130–135` `HEDGE` map | replaced by one constant, `const OUR_READING = 'we think';` |
| `137–149` `Row` | unchanged shape; `hedge` keeps its type |
| `165` `hedge:` | `task.minutes > 0 && attentionIsOurs(task) ? OUR_READING : ''` |
| `169–179` `overlaps` | becomes `overlapping`, a **count** of spanning rows that overlap another spanning row; same predicate, `filter` instead of `some` |
| `186–189` `authorText` | deleted — the chip at `[slug].astro:42` is the page's copy |
| `202–205` `handsOnSub` | replaced by `needsYouSub` (§3.2) |
| `214` `totalText` | unchanged (`at least`) |
| new | `handsOnFigure` = `about ` prefix when `handsOnMinutes > 0 && (untimed > 0 \|\| anyOurReading)` |
| new | `anyOurReading` = `rows.some((row) => row.spans && attentionIsOurs(row.task))` |
| new | `totalSub` (§3.2) |
| `216–248` `notes` | **deleted** |
| `250–259` `note` | **deleted** |
| `261–265` `legend` | gains `guess: anyOurReading` |

### 3.2 The two sub-labels — the only strings that survive as text

```ts
const totalSub = untimed > 0
  ? `${untimed} of ${stepCount} ${untimed === 1 ? 'steps gives' : 'steps give'} no time`
  : '';
```

(The singular reads *"1 of 4 steps gives no time"* — the verb agrees with the count, the noun
stays plural because it is *of* the four.)

```ts
const needsYouSub = schedule.handsOnMinutes > schedule.totalMinutes
  ? `${overlapping} steps run at once`
  : allTimed && schedule.unattendedMinutes > 0
    ? 'the rest you can walk away from'
    : '';
```

First branch: 15 pages, the overlap answer. Second branch: the existing string, kept so a page
with nothing to hedge changes by deletion only. Third: nothing, which is where
*"of the steps that give a time"* goes — `totalSub` now says it under the figure it belongs to.

### 3.3 Markup

| Region | Change |
| --- | --- |
| `282–287` verdict | one sentence: `Not one of its {stepCount} steps is timed.` |
| `289–304` stats | `<b>{totalText}</b>`, then `{totalSub && <span class="sub">{totalSub}</span>}`; `<b>{handsOnFigure}</b>`, then `{needsYouSub && <span class="sub">{needsYouSub}</span>}` |
| `308` `<p class="notes">` | **deleted** |
| `352` `.tag` | `data-confidence` dropped (nothing styles it; `data-attention` stays) |
| `366–372` `.bar` | `data-confidence={row.task.confidence}` → `data-reading={attentionIsOurs(row.task) ? 'ours' : undefined}` |
| `386–408` legend | fourth `<li>`, rendered when `legend.guess`: `<span class="swatch swatch--guess" aria-hidden="true" /> we think` |
| `410` `<p class="note">` | **deleted** |

`data-cell` on every row, the axis, the marks, the grid columns and every `title` stay exactly as
they are.

### 3.4 Styles

| Selector | Change |
| --- | --- |
| `.bar[data-confidence='inferred']` / `[data-confidence='unknown']` | replaced by one rule: `.bar[data-reading='ours'] { border-style: dashed; }` |
| `.swatch--guess` | added: transparent fill, dashed ink-soft border, same width/height as `.swatch--hands` so the row of keys stays level |
| `.notes` (`486–491`) | deleted |
| `.note`, `.note:empty` (`808–817`) | deleted |
| everything else | untouched — `.stat`, `.sub`, `.verdict`, `.slack`, the axis block, the container queries, forced-colors, print |

The forced-colors block drops fills and keeps outlines; a dashed outline survives it, so the
`we think` code degrades to the same dashed edge in high contrast. No change needed there.

## 4. `src/components/CookModes.astro`

### 4.1 Frontmatter

| Region | Change |
| --- | --- |
| `25` import | add `attentionIsOurs` alongside `buildSchedule`, `type Task` |
| `246–252` comment | rewritten: it introduces `clockFacts`, which is going; what remains is the two icons |
| `254–255` `workMinutes`, `anyTiming` | **deleted** — only the two removed notes read them |
| `256–257` `overlaps` | **deleted** |
| `258–263` `floor` + its comment | **deleted** |
| `264–286` `clockFacts` | **deleted** (dead: rendered nowhere — see `design.md` §5) |

`handIcon` and `waitIcon` (`251–252`) stay: the cook pane's `.dur` uses them.

### 4.2 Markup

| Region | Change |
| --- | --- |
| `418–425` `!anyTiming` pane-note | **deleted** — Timeline's verdict says it once |
| `427–435` `overlaps` pane-note | **deleted** — see `design.md` §5 |
| `490–493` `.hedge` | condition `row.task.confidence === 'unknown'` → `attentionIsOurs(row.task)`; text → `we think`; the comment above it kept and shortened |

The `{/* No clock chips here… */}` comment at `412–416` stays and is extended by one line: it is
now also the record that the clock chips' code has gone, not just their markup.

### 4.3 Styles

`.clock` and `.clock li` (`750–769`) deleted — the markup they styled left before this ticket.

## 5. What the page looks like afterwards, as a contract

For any recipe, the timeline prints, in order:

1. `The clock`
2. either the one-line verdict (23 pages) or two figures:
   - **Start to finish** — `[at least ]<duration>`, optionally `<n> of <m> steps give no time`
   - **Needs you** — `[about ]<duration>` or `none of it` / `none given`, optionally
     `<n> steps run at once` or `the rest you can walk away from`
3. `If you get it wrong` — untouched, authored by the recipe
4. the axis and its caption — untouched
5. one row per operation: label, duration, attention word `[(we think)]`, when
6. the legend: `needs you` · `you can walk away` · `never timed` · `we think`

Nothing else. No paragraph anywhere in the component.

## 6. Ordering and blast radius

1. **`schedule.ts` + `schedule.test.ts`.** Self-contained; `vitest run` proves it alone.
2. **`Timeline.astro`.** Every deleted string is here except one; the visible-character drop is
   almost entirely this commit.
3. **`CookModes.astro`.** Two note deletions, one hedge swap, one dead block removed.

Files explicitly **not** touched: every `.cook` file, `src/pages/[slug].astro`,
`src/lib/time.ts`, `src/lib/tree.ts`, `src/lib/layout.ts`, `src/components/RecipeTable.astro`,
`scripts/*`, `package.json`. `src/generated/recipes.json` is a gitignored build artifact and is
never committed.

## 7. Risks this shape accepts

- **`data-reading` replaces `data-confidence` in the DOM.** Nothing else in the repository reads
  either attribute (`grep`: `Timeline.astro` only), and no test asserts on markup. A future page
  that wanted the three-way distinction would have to go back to `task.confidence`, which is
  still on the task and still three-valued.
- **The cook pane gains a hedge on 153 pages that had none** — the ones whose readings are all
  `inferred`. That is the drift being closed, and it costs eight characters a step against the
  43 it removes wherever an `unknown` step exists.
- **Nothing replaces the sliver sentence.** The `.axis-caption` above the axis already says the
  chart is drawn to scale, and every row prints its own duration. If a reviewer disagrees, the
  caption is the place to put words back, not a paragraph under the chart.
