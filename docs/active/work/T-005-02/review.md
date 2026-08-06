# T-005-02 · Review — the clock stops explaining itself

Four commits, three source files, one test file. Every explanatory sentence about how the
numbers are worked out is off the recipe pages; the doubt is carried by the figures. `npm run
verify` is green. `npm run verify:mobile` needed a second run for a reason that is not this
ticket's doing and is written up below.

---

## What changed

| Commit | File | Lines |
| --- | --- | ---: |
| `314881d` | `src/lib/schedule.ts` | +14 |
| `314881d` | `src/lib/schedule.test.ts` | +14 |
| `1a56330` | `src/components/Timeline.astro` | 847 → 786 |
| `51a03d7` | `src/components/CookModes.astro` | 1210 → 1160 |
| `8a184c5` | `src/components/Timeline.astro` | +6 (forced-colors) |

Nothing else. No recipe file, no page, no script, no `package.json`. `git status` shows no
ticket-owned file staged, modified or untracked; the one modified file in the tree,
`src/pages/menu/[counter].astro`, belongs to T-005-03 running alongside.

### `schedule.ts` — one export

```ts
export function attentionIsOurs(task: Task): boolean {
  return task.confidence !== 'stated';
}
```

The line between *the author said* and *we worked it out*, drawn once in the module that assigns
`confidence`. It was being drawn twice, differently: `Timeline.astro` asked
`confidence !== 'stated'` and `CookModes.astro` asked `confidence === 'unknown'`, so the same
step was hedged in one pane and not the other. Four call sites now share one answer.

### `Timeline.astro` — the sentences go, the words stay

Deleted: the `notes` array (four sentences), the `note` paragraph (three clauses), the two
`.sub` lines that described the arithmetic, the two-sentence verdict, the `HEDGE` map, and the
`.notes` / `.note` styles.

Added: `at least` kept on the elapsed figure and `about` put on the hands-on figure; two
`.sub` labels that state recipe facts; `(we think)` beside a bar whose attention is ours; a
fourth legend item naming the dashed edge; one `.bar[data-reading='ours']` rule where two
`data-confidence` rules were.

### `CookModes.astro` — one sentence, and a dead block

The 144-page overlap paragraph and the 23-page "no clock to keep" paragraph are gone; the
per-step hedge now says `we think` and fires wherever the reading is ours.

`clockFacts` — the array the ticket points at — **was dead code**: built, never rendered,
`grep`-findable exactly once at its own declaration. It went, with `floor`, `workMinutes`,
`anyTiming`, `overlaps` and the `.clock` styles.

---

## The vocabulary, and why it is two words rather than one

| Word | On | Fires when | Pages |
| --- | --- | --- | ---: |
| `at least` | start to finish | a step gives no time | **577** |
| `about` | needs you | a step gives no time, **or** any attention reading is ours | **365** |
| `we think` | a step's attention word, and the legend | that step's reading is ours | **307** |
| *(nothing)* | | nothing untimed, every reading the author's own | **44** |

Counted off the built pages, not predicted: 577 / 365 / 307 / 44, with the `n of m steps give no
time` label on 577, `n steps run at once` on 15, and the one-line verdict on 23.

The ticket's example is `about 3 hr 30 min`, and `about` is already the site's word — the chip
under every title reads `about 2 hr`. It is kept for the figure that is fuzzy. It is **not** used
for the figure that can only be too small, and `pizzelle` is why: it times 45 seconds across five
steps against its own header's 45 minutes. *"About 45 sec"* under a chip saying *"about 45 min"*
would be a new false claim in place of a deleted true one. `at least` is the word
`CookModes.astro:263` already reached for, which the ticket calls the right instinct.

**If a reviewer disagrees, it is one ternary** — `Timeline.astro:214`.

## The three cases the ticket asked to be answered

1. **The overlap, 15 pages — a different label.** Under the hands-on figure, on exactly those
   pages, `4 steps run at once`. A count and a fact about the recipe, four words, replacing a
   118-character sentence about how the site counts. `mushroom-risotto` now reads
   `at least 24 min · 1 of 5 steps gives no time` / `about 34 min · 4 steps run at once`.
2. **Assumed hands-on, 97 + 57 pages — the hedge reaches it by construction.** `about` fires on
   *any* reading of ours, not only on a missing timer, so french onion soup's 50-minute
   caramelise is inside `about 53 min` and the step itself says `needs you (we think)`. 14 recipes
   get `about` on this ground alone, with a fully-timed clock beside it.
3. **The author's `>> time:`, 658 pages — deleted, because the page already prints it.**
   `[slug].astro:42` renders `about 3 hr 30 min` as a chip under the title on all 658. Worth
   showing? Yes — on `pizzelle` the two figures differ by a factor of sixty and a cook needs the
   author's. Worth showing *twice*? No, and `CookModes.astro` already refused to print it a third
   time for the same reason. The fact does not move because it never left.

## The dashed and dotted edges

**Collapsed to two — solid when the recipe said, dashed when we read it — with the meaning in the
legend and in the words beside every bar.**

A reader looking at a dashed edge finds out three ways, none of them a paragraph: the row beside
it says `needs you (we think)`; the legend gains a dashed, unfilled swatch labelled `we think`;
and it is the same two words in both panes. The legend is a real `<ul aria-label="How to read
the bars">`, so a screen reader gets it too.

The third level distinguished *reading a word off the step* from *having no word to read* — two
ways **we** arrived at an answer. `readTimers()` only ever defaults to hands-on, so a dotted bar
always said "needs you": the level could only ever tell a cook to stay when they might have left,
which is the safe error either way. Of 1697 bars with a duration, 1112 are now solid and 585
dashed, so the surviving code carries real information.

**The drawing is untouched.** The axis column track was recomputed independently — linear
minutes, `minmax(11px, …fr)`, no scaling — and compared against every built page:

```
axis tracks checked 658, mismatched 0
```

No compression, no log scale, no invented ratio. The only change to the chart is one
`border-style`.

## A page with nothing to hedge, and a page with everything

**`shakshuka`** — 4 steps, none untimed, every reading the author's own; one of 44.

```
before   Start to finish 34 min / two waits that overlap count once
         Needs you 11 min / the rest you can walk away from
         "The recipe itself says 45 min."
         "Drawn to scale… The shortest stretches keep a sliver so they stay visible…"

after    Start to finish 34 min
         Needs you 11 min / the rest you can walk away from
```

**Deletions only.** No `at least`, no `about`, no `we think`, no dashed bar. 4288 → 4060 visible
characters.

**`mushroom-risotto`** — 1 untimed step, 4 minutes of assumed hands-on, three inferred readings,
34 minutes of work in a 24-minute dish; one of 15.

```
after    Start to finish at least 24 min / 1 of 5 steps gives no time
         Needs you about 34 min / 4 steps run at once
         rows: 4 min · needs you (we think) · from the start
         legend: needs you · never timed · we think
```

Every fact the four deleted sentences carried is still on the page. None of it is a sentence.
3688 → 2707 visible characters.

## Measured after

Method: the `<main>` of the built page, collapsed source block excluded, tags stripped, entities
decoded, whitespace collapsed — reproducing the story's published figures to within 0.2%
(`research.md` §8).

**A caveat that has to come first.** T-005-04 is committing to `.cook` files alongside this
ticket and has already shortened 373 `slack:` reasons, which moves the same page counts. So the
change is reported twice: once at the ticket's boundaries, and once isolated by building the
pre-ticket components against **today's** recipes in a throwaway worktree, which attributes the
delta to this ticket alone.

| | at ticket start | same recipes, old components | **after** | this ticket's delta |
| --- | ---: | ---: | ---: | ---: |
| `ching-bo-leung-soup` | 6226 | 6155 | **5259** | **−896** |
| `tonkotsu-broth-instant-pot` | 4027 | 3892 | **3579** | **−313** |
| `shakshuka` | 4421 | 4288 | **4060** | −228 |
| `mushroom-risotto` | 3688 | 3688 | **2707** | −981 |
| `pizzelle` | 2835 | 2686 | **2214** | −472 |
| collection mean | 3494 | 3427 | **2976** | **−451 a page** |
| collection median | 3383 | 3287 | **2809** | −478 |
| collection total | 2,298,907 | 2,254,977 | **1,958,255** | **−296,722** |

The two pages the ticket names, at its own boundaries: `ching-bo-leung-soup` **6226 → 5259**,
`tonkotsu-broth-instant-pot` **4027 → 3579**.

## Verification

| | |
| --- | --- |
| `npm run verify` | **exit 0** — `all 658 file(s) draw a table`, 9 test files, **833 tests**, 682 pages built |
| `check-overflow --width 375,390,768` | **exit 0** — *2046 page views at 375px, 390px, 768px — nothing scrolls sideways* |
| `check-touch` | **exit 0** — *2046 page views … everything a thumb has to hit is 44px, the table says when it continues, and the pinned column stays below 44rem* |
| ten deleted strings, grepped over 658 built pages | **0 hits each** |
| `read off the step`, `(assumed)`, `border-style: dotted` | 0 |
| `Start to finish is the longest chain` | 0 (was 144) |
| `there is no clock to keep` | 0 (was 23) |
| `the recipe does not say whether you can leave` | 0 |
| axis column tracks vs an independent recomputation | 658 checked, 0 mismatched |
| hedge words on built pages | 577 / 365 / 307, none on 44 |

The strings grepped for zero:

```
so both numbers are floors · keep a sliver · a dotted one means · The recipe itself says
adds up to more hands-on · counted as needing you only because
counted as time you are standing over it · two waits that overlap count once
of the steps that give a time · never puts a number on anything
```

## Test coverage

**One unit test added**, for the one pure function added. It sits inside the existing
`describe('what a task says it knows')`, whose fixture already carries one `stated`, one
`inferred` and one `unknown` task, and asserts `[false, true, true]` — so a fourth `Confidence`
added later cannot land on the wrong side of the page's solid/dashed line unnoticed.

**The components get no test, and that is the shape of the project rather than a shortcut.**
There is no `.astro` test anywhere in the repository and no component test renderer in
`devDependencies`; `src/lib/` carries the whole vitest suite. Adding a harness would mean a new
dependency, outside a ticket permitted three files.

What stands in its place is verification against the built output, which is the stronger check
for this particular claim — *"this sentence is on no page"* is a property of 658 pages, not of a
snapshot: ten greps at zero, four recipes' rendered text diffed against a capture taken before
the first edit, and a whole-collection recount of where each hedge word landed.

### Gaps

- **No test pins the new strings.** `1 of 4 steps gives no time`, `4 steps run at once`,
  `about `, `at least `, `we think` are asserted only by the greps recorded here. If a later
  ticket edits them, nothing fails.
- **Nothing type-checks the components but `astro build`.** Unchanged from before.
- **`attentionIsOurs` is trivially correct today** and the test is worth exactly what it costs;
  its value is the day someone adds a fourth confidence.

## Open concerns

### 1. `npm run verify:mobile` had to be run twice, and the first run is not evidence

The first run finished with the build moving underneath it — T-005-03 and T-005-04 are building
into the same `dist/` from their own threads — and the script says so itself rather than
reporting a verdict: *"dist/ changed while this was reading it… Nothing above is evidence either
way. Re-run against a build standing still."* It printed one `SCROLLS 390px /honey-cake/` line
from that torn read, which is exactly the kind of finding a torn read invents.

The two checks were then run against a private build that no other thread writes to —
`npx astro build --outDir .lisa/attempts/T-005-02/1/dist-check`, then each script with
`--root` pointed at it. Both passed, 2046 page views each; those are the results in the table
above, and they are what `npm run verify:mobile` runs, on the same commit, against a build
standing still. **The finding worth passing on is not about this ticket: `verify:mobile` is not
safe to run while a sibling ticket builds**, and three tickets in this story are scheduled to
run alongside each other. `--root` and `--outDir` are the way through, and `scripts/browser.mjs`
already carries the `watchBuild` machinery that caught the problem rather than reporting noise.

### 2. The cook pane now hedges 153 pages that it did not hedge before

Closing the drift between the two components means the cook pane flags `inferred` readings as
well as `unknown` ones. That is more honest and it is what "one vocabulary" costs; it also
shrinks the text where it already appeared, from 43 characters to 8. Net across the collection is
a large decrease, but on a page whose readings are all `inferred` it is a small increase.

### 3. The `at least` / `about` split is the one judgement in here

Everything else follows from the ticket. This is argued from `pizzelle` in `design.md` §1 and it
is one ternary to reverse. A reviewer who wants a single word everywhere should read that
paragraph first, because the single word makes `pizzelle` say something false.

### 4. Nothing replaces the sliver sentence

The `.axis-caption` above the chart still says *"Drawn to scale, longest wait and all:"* and every
row still prints its own duration, which is what the sentence promised. If a reviewer wants words
back, the caption is where they go — not a paragraph under the chart.

## What a reviewer should look at first

1. **`design.md` §1**, the two-word vocabulary. It is the only decision here that could reasonably
   have gone the other way, and it is one line of code.
2. **`design.md` §3**, the dashed/dotted fork — what a reader now takes from an edge, and the
   three places that say so.
3. **Open concern 1.** It is not a defect in this work, and it will bite the next ticket in this
   story that runs `verify:mobile` while a sibling is building.
