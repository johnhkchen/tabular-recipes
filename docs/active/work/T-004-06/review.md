# T-004-06 — Review

The whole site read at three widths, the three controls nobody owned raised to a thumb, the two
variant links parted, and — the thing four tickets asked for — a check in the repository that
will notice if any of it is undone. Eight commits, seven files, **+696 −188**.

The headline number: **twelve pages at 1440px and 768px, built from the commit S-004 started
from and from `HEAD`, and all 24 SHA-256 hashes are identical.** Six tickets of narrow-width
work, and the desktop did not move a pixel.

---

## What changed

| file | action | what, and why |
| --- | --- | --- |
| `scripts/browser.mjs` | **created**, 242 lines | the static server, the Chrome launcher, the CDP client and the viewport-settling `go()` that `check-overflow.mjs` had invented — lifted out so a second checker can use them instead of copying them. Plus `watchBuild()`, the guard two tickets wanted |
| `scripts/check-touch.mjs` | **created**, 323 lines | the criterion "tap targets ≥44px on **every** interactive element" turned into a command that runs over the whole build, plus the three table promises T-004-02 named and nothing enforced |
| `docs/gaps/mobile.md` | **created**, 264 lines | the ticket's own deliverable: nine ranked entries, what S-004 fixed, and what the net does not catch |
| `scripts/check-overflow.mjs` | modified, **+36 −182** | imports the plumbing; a build that moved underneath a run now exits **2** (*could not look*), not 1 (*something scrolls*) |
| `package.json` | modified, +1 line | `verify:mobile`. **`verify` is unchanged** |
| `src/styles/site.css` | modified, +85 | three tap-target rules, the variant spacing, the corrected `snug` arithmetic |
| `src/pages/list.astro` | modified, +13 | the recipe title in the plan block, 22px → 44px at narrow |

Commits, in order:

| | |
| --- | --- |
| `6cb4436` | the plumbing extracted, and the build-moved guard |
| `869090d` | the touch check, and `verify:mobile` |
| `4028569` | the four rules — the only commit that changes what a reader sees |
| `8261b22` | the corrected `snug` arithmetic (comment only) |
| `e068b6c` | a comment of mine that had the wrong number in it |
| `150c253` | the checker asking the table's own question — see *Decisions*, 1b |
| `a48d9f1`, `4caa7f1` | the progress counter: silent through the desktop pass, then doubled |

Six of the eight touch only the two checkers or a comment. **One commit changes rendering**, and
it changes it only below 34rem.

**Every rule added is inside a `max-width` query.** Not one declaration outside a media query was
added or changed, in either stylesheet — which is why "the desktop is unchanged" is a structural
property of the diff before it is a claim about screenshots.

**Not touched, each for a reason:** `src/styles/b28-clay.css` (vendored from b28.dev; a local
edit dies at the next `just sync-kit`), `src/pages/[slug].astro` (the variant fix is CSS, so the
desktop stays byte-identical), `src/pages/index.astro` (the "Press `/`" tally is recorded, not
rewritten), `src/pages/404.astro` (its defect was a stylesheet property, not its fifteen lines),
`src/styles/breakpoints.test.ts` (no new number was written, and a check you edited is not a
check).

---

## Acceptance criteria, against evidence

| criterion | evidence |
| --- | --- |
| every page at 375px, no body scroll, **whole build not a sample** | `2046 page views at 375px, 390px, 768px — nothing scrolls sideways.` — 682 pages × 3 |
| the listed surfaces walked at 375, 390, 768, **including the 404** | the walk below; the 404 is its own row and its one control was the fix |
| one breakpoint vocabulary; any disagreement resolved and recorded | `breakpoints.test.ts` green — two numbers, 13 queries. The one disagreement was prose, not a value; resolved in the block itself |
| desktop at 1440px demonstrably unchanged, by a stated method | **24 of 24 hashes identical**, method below |
| tap targets ≥44px on every interactive element | `2046 page views … everything a thumb has to hit is 44px` — whole build, both phone widths, plus a 768px pass |
| `docs/gaps/mobile.md` exists and ranks what is still wrong | nine entries, ranked by cost to a person holding a phone |
| `npm run verify` passes in full | 9 files, **832 tests**, 658 recipes, 682 pages |
| the work artifact names each file changed and says why | the table above |

---

## The walk, at three widths

Against the final build. `over` is how far the table travels inside `.table-scroll`; the body
does not move on any of them, at any width.

| surface | 375px | 390px | 768px |
| --- | --- | --- | --- |
| the front door, 21 counters | 3596px, one column | 3530px | 2892px, two columns |
| Bakery (107 items) | 10 706px | 10 414px | 6539px |
| The Bowl Shop (103) | 11 158px | 10 866px | 7713px |
| `miso-ramen` — 7 col × 15 | over 238px, pinned, cue shown | over 223px | **over 0**, static, no cue |
| `pastrami` — 7 × 14, 5 days | over 231px, pinned | over 216px | over 0, static |
| `beef-stew-slow-cooker` — 6 × 13 | over 184px, pinned | over 169px | over 0, static |
| `tonkotsu-broth` — 5 × 10 | over 109px, pinned | over 94px | over 0, static |
| `biryani` — 4 × **20 rows** | over 34px, pinned | over 19px | over 0, static |
| `conchas` — 4 × 5 | **over 0**, no cue | over 0 | over 0 |
| `boston-baked-beans` — three-way variant | over 11px, cue shown | over 0, cue absent | over 0 |
| `/list/`, 7 recipes, 47 things, **10 aisles**, 58 lines | 6694px, headings `sticky` | 6658px | 5547px |
| **`/404.html`** | fits, no scroll | fits | fits |

**The prep and cook views**, clicked through on four recipes: at 375px nothing under 44px in any
pane. `miso-ramen`'s panes measure 1249px (Table), 2042px (Prep), 1589px (Cook).

**The shopping list with six or more aisles**, which the ticket asks for by name: the seeded plan
draws **ten** — Produce, Butcher, Dairy & eggs, Bakery, Baking aisle, Dry goods, Tins & jars,
Spice rack, World foods, Anything else — over 58 lines, and each heading computes `sticky` and
holds the top of the screen for as long as its aisle lasts.

**The clock at an extreme ratio.** `pastrami` (5 days 10 hr) draws one 285.9px bar and three
slivers at 11–14.3px, none labelled; `beef-stew-slow-cooker` (8 hr 45) draws 11px, 295.8px,
15.4px. It is **not a width problem** — `pastrami` still has an 11px stretch at 768px. Every row
prints its own duration underneath, so nothing is lost; it is only not drawn. Ranked third in the
gaps file, honestly.

### What the fixes cost, measured

Every recipe page is **exactly 20px taller** at 375px and 390px — the `.source` disclosure's new
padding, and nothing else. `miso-ramen` 3280 → 3300, `biryani` 3810 → 3830, `conchas` 2303 →
2323. At 768px every page height is unchanged to the pixel. Table travel, `data-more`, the
sticky column and the shortest cell are identical before and after on all seven recipes.

---

## Desktop unchanged — the method, since the criterion asks

Not "my rules did not leak" but **the whole story changed nothing**, so the baseline is the tree
before T-004-01: commit `02b65e8`, the parent of `b72822a`.

1. `git worktree add --detach <tmp> 02b65e8`, `npm run build` in it.
2. Twelve pages rendered full-page at **1440px and 768px** by `check-overflow.mjs --shots`,
   against that build and against `HEAD`'s.
3. SHA-256 per PNG, compared.

**All 24 identical.** Pixel identity, not a judgement. Same tool both sides, both runs offline,
so the fallback fonts match and the comparison is about layout rather than about a fonted render.
768px is in the set because it sits above both breakpoints and is where a rule leaking out of its
band would show — it is identical too. The worktree was removed afterwards.

Twelve: the front door, `/list/`, `/404.html`, Bakery, The Bowl Shop, `miso-ramen` (7 col),
`beef-stew-slow-cooker` (6), `tonkotsu-broth` (5), `conchas` (4), `biryani` (20 rows),
`boston-baked-beans` (variants), `pastrami` (5 days).

### The one place identity is not claimed, and why

`/list/` is empty without `localStorage`, so its screenshot proves only that the empty state is
unchanged. The **populated** list was measured separately at 1440px on both sides:

| | before `02b65e8` | after | |
| --- | --- | --- | --- |
| page height | 5575px | **5575px** | identical |
| lines drawn | 58 | **58** | identical |
| first row height | 60.3px | **60.3px** | identical |
| the planned title link | 22px | **22px** | identical — this ticket's fix is narrow-only |
| a line reads | `1 cup bean sprouts for Miso Ramen` | `bean sprouts 1 cup for Miso Ramen` | **changed** |
| aisle heading `position` | `static` | `sticky` | **changed** |

Both changes are **T-004-05's**, and both are the two things its `note` disposition already told
the board about — the as-it's-sold name could not be moved to the front of every line on a phone
without moving it on a desktop, because the same elements render at both widths. Reported here
rather than left implied by an empty screenshot. Nothing in this ticket touched either.

Also checked, because the badge could have leaked the other way: `.scale-short` computes
`display: none` at 0px at 1440px and `.scale-word` draws its full 71.9px phrase, so the phone's
short form stayed a phone thing.

---

## Test coverage

### In `npm run verify` — unchanged, deliberately

9 test files, **832 tests**, 658 recipes check, 682 pages build. Green.

`verify` gained nothing, and that is the decision rather than an omission: the two checks this
ticket cares about need a layout engine, and `verify` must keep running on a machine without
Chrome. `breakpoints.test.ts` already covers the one claim that can be made without a browser —
that no third width exists — and it was **not edited**, because a check you changed to make your
own work pass is not a check. It still reads the declaration lines out of the block this ticket
rewrote: 7 passed.

### `npm run verify:mobile` — new, and the answer to four tickets' note

```
npm run build
node scripts/check-overflow.mjs --width 375,390,768   # 2046 page views, clean
node scripts/check-touch.mjs                          # 2046 page views, clean
```

`check-touch.mjs` makes four claims per page:

| claim | who asked |
| --- | --- |
| every visible interactive element is ≥44px tall | this ticket's criterion |
| the shortest drawn table cell is ≥44px | T-004-02 — "the floor is explicit but nothing enforces the result" |
| `data-more` is set exactly when `.table-scroll` overflows | T-004-02 — "the affordance's whole claim" |
| `.cell--ingredient` is `sticky` below 44rem, `static` above | T-004-02 |

**Proved in both directions, and the red direction is the interesting one.**

Run before the CSS fixes, against a build with the three known defects in it, it named exactly
those three and nothing else:

```
SHORT  375px  /404.html     <a.clay-button> is 41.4px, wants 44  "Back to the recipes"
SHORT  375px  /miso-ramen/  <summary> is 24px, wants 44  "See how it is written"
SHORT  375px  /list/        <a> is 22px, wants 44  "Miso Ramen"  (×7 here)
```

Then pointed at the build of `02b65e8` — **the real site as it stood before S-004 began**,
rather than a synthetic mutation. Four pages, and it caught **52 faults, 28 distinct**, across
all three fault kinds:

```
SHORT  /miso-ramen/  <button.clay-button.toggle> is 34.7px   "✓On the list"
SHORT  /miso-ramen/  <button.mode> is 40px  "Table"  (×3 here)
LIES   /miso-ramen/  the table scrolls (317px past the edge) but data-more is absent
LOOSE  /miso-ramen/  the ingredient column is not pinned below 44rem
SHORT  /list/        <button.tick> is 36.6px  "1 cup bean sprouts"  (×56 here)
SHORT  /list/        <button.drop> is 25.5px  "Take it off"  (×7 here)
```

Every one of those is a defect a ticket in S-004 was written to fix. The check would have caught
all of them, and it goes green now only because they were fixed. That is a stronger claim than
"I broke something on purpose and it noticed".

Run against `HEAD` over the whole build:

```
2046 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px,
the table says when it continues, and the pinned column stays below 44rem.
```

It also seeds a seven-recipe plan into `localStorage` before loading `/list/`, so the busiest
page on the site is checked populated rather than as its empty state. That matters: on the
pre-story build the empty `/list/` has almost nothing on it, and the populated one has 56 tick
rows at 36.6px. A checker that skipped it would have called that page clean.

**The refactor is regression-tested by 2046 cases.** `check-overflow.mjs` prints, after the
extraction, character for character what it printed before it: `2046 page views at 375px, 390px,
768px — nothing scrolls sideways.` Bare routes still work, `CHROME_BIN=/nonexistent` still prints
the by-hand procedure and exits 2, and the new guard was exercised deliberately —
`touch dist/index.html` mid-run produces *"Nothing above is evidence either way"* and **exit 2**.

### By hand, because a script cannot

The table's "Clear the marks" button ships `hidden` and appears only once something is crossed
off, so no sweep can see it. Clicked into existence on `miso-ramen`:

| | before `02b65e8`, 375px | after, 375px | after, 1440px |
| --- | --- | --- | --- |
| `.reset` "Clear the marks" | 25.5px | **44px** | 25.5px — unchanged |
| `.source summary` | 24px | **44.2px** | 24px — unchanged |

Also by hand, both widths: crossing a cell off still works and still reveals the button; a
crossed-off ingredient cell keeps `opacity: 1` with its spans at 0.4 and an opaque background, so
the operations do not read through it while they scroll under it; the disclosure still discloses,
and un-crossing puts the cell back.

`.reset` is the one control the new rule reaches that the automated run never sees, which is why
it was checked this way and why it is written down here rather than assumed from the selector.

### The gaps that remain, named rather than left

`docs/gaps/mobile.md` ends with them: the aisle heading staying stuck, the crossed-off cell
staying opaque, the edge cue's gradient being drawn, the teaser staying hidden. All four are
visual, and asserting them costs more than it protects. A green `verify:mobile` is "the four
things that can be checked are still true", not "the phone layout is correct" — said in the file
so nobody reads it as the larger claim.

---

## The three decisions worth a reviewer's time

**0. The checker was wrong twice, and both times the site was right.** Worth stating first,
because it is what a reviewer should be most suspicious of: a new check whose failures all turn
out to be the check's fault is a check being bent to fit. Both are recorded with the number that
settled them, and neither was resolved by adding an exemption.

**1. The label and its control are one target, not two.** The plan
required running `check-touch.mjs` before trusting it. Its first run reported a fourth thing:
`<label.search> is 19px` on the front door. That is not a defect — the finder is a 19px inline
`<label>` around a 50px input, and a tap on either lands on the input. The first draft carried an
exemption ("a checkbox inside a label is not the target — the label is") written for CookModes'
18.4px checkbox in a 44px row, and that rule is right in one direction and wrong in the other.

Fixed by modelling rather than exempting: a label and its control are **one** target, so the
union of the two boxes is measured, once, under the label. CookModes' tick passes on the row
(44px); the finder passes on the input (50.5px). The exemption list got *shorter*. Handles `for=`
as well as wrapping.

**1b. The second wrong answer: `cornbread-dressing` at 375px.** The whole-build run reported one
kind of fault, on three page views: *"the table scrolls (1px past the edge) but data-more is
absent"*. `RecipeTable.astro:161` sets the cue on `room > 1`; the checker was asking `room > 0.5`.
One pixel of unseen table is not a table that continues, and drawing a 40px gradient and a line
of prose for it would be the affordance lying in the other direction.

The fix was not to widen a tolerance but to **stop asking a different question**: `UNSEEN` is now
the component's own number, in a named constant, with a comment at each end saying the two move
together. A checker that picks its own threshold is not testing the affordance, it is disagreeing
with it.

**2. `snug` stays at 44rem, and the block now says why.** Measured, the two 7-column recipes
first fit at **736px ≈ 46rem**, not the 44.5rem the block predicted — between 705px and 735px
they travel up to 14px with nothing pinned. Moving the breakpoint to 46rem would recover those
14px and hand the phone cell floor and the pinned column to a 736px window, restyling a 32px band
nobody has read a recipe in. So the number was kept and the prose corrected, in the block, with
the measurement beside it. This is the ticket's "resolve any disagreement and say which you
kept": **no two tickets disagreed about a value** — `breakpoints.test.ts` has been green
throughout — the disagreement was between a comment and a browser.

**3. Four defects were found and recorded rather than fixed.** A ticket allowed to edit any file
can quietly become a sixth implementation ticket with no design behind it, so the rule was:
change it if a criterion names it, otherwise rank it in the gaps file with what a fix would cost.
That is why "Press `/` to search 658 recipes" is still on the front door (it is copy, on the
surface T-004-01 owned and deliberately left, and fixing it means choosing new front-page words),
why 63 lines of dead stylesheet are still in `site.css` (the real question is *does the front
door get a filter row*, and deleting the CSS answers it silently), why the variant sentence is
still a sentence, and why 768px still gets the mouse drawing.

---

## Open concerns

1. **`verify:mobile` is a command, not CI.** Nothing runs it automatically, so the net catches a
   regression only when someone asks it to. Wiring it into CI needs a container with Chrome; the
   alternative was putting a browser inside `npm run verify` and making the check that *does* run
   everywhere conditional on one that does not. If this project gains a CI job that can run
   Chrome, `verify:mobile` is ready for it and needs no changes.

2. **`check-touch.mjs` reports the first page a fault appears on, not all of them.** A control
   that is 24px on 658 pages prints once. That is deliberate — 658 identical lines teach nothing —
   but it means the summary count (`N faults, M distinct`) is the honest number and the printed
   list is a sample of *locations*, never of *kinds*. Every kind is always printed.

   **"Distinct" counts lines, not kinds.** The dedupe key is `kind@width`, so one defect seen at
   both 375px and 390px reads as two distinct entries. A run reporting "3 faults, 2 distinct" was
   one kind on three page views. This is fine for reading the output and wrong for quoting the
   number as "two problems"; said here because I misread it once before checking.

3. **`verify:mobile` takes 15–30 minutes on this machine**, depending on what else is competing
   for the CPU: two browser sweeps at 2046 page views each, about seven minutes apiece with the
   machine to themselves and twice that when they are not. Nobody will run it casually and nobody
   should have to: `node scripts/check-touch.mjs /some/page/ /another/` on a handful of routes is
   **under two seconds**, and that is the form a person editing CSS will actually use. The
   whole-build form is for before a release, and its cost is the price of "not a sample".

4. **The variant spacing is a mitigation and says so.** 24.2px between two 44px targets is the
   figure WCAG 2.2's target-size criterion is written around, and it is not the same as the two
   links being separate rows. The cure is markup, and markup changes the desktop, which this
   ticket's own criteria forbid. Whoever lifts that constraint should take the fix from
   `docs/gaps/mobile.md` entry 5.

5. **`SHORT_SCALE` was not moved out of `list.astro`.** T-004-05 recorded that it belongs beside
   `SCALE_WORDS` in `src/lib/shopping.ts` and could not move it under a one-file scope. This
   ticket could have. It did not, because it is a refactor with no width in it, and it would put
   `shopping.ts` and its tests in the diff of a verification ticket. Still recorded, still true,
   still cheap for whoever wants it.

---

## Corrections to the record

- **T-004-02's third open concern estimated the unpinned band at 29px.** Measured here it is
  **14px** at 720px (`miso-ramen`) and 9px (`pastrami`). Its direction was right and its number
  was pessimistic. The block now carries the measured figure.
- **T-004-02 reported the pre-story table travel as 324/319/279px** for `miso-ramen`, `pastrami`
  and `beef-stew-slow-cooker`. Measured against `02b65e8` — the tree before T-004-01, rather than
  before T-004-02 — it is **332/327/269px**. The 8px is T-004-01's body padding, which had already
  landed when T-004-02 measured. Both are right about their own baselines; `docs/gaps/mobile.md`
  uses the whole-story one and says which.
- **This ticket's own comment had a wrong number in it, and `e068b6c` is the correction.** The
  first draft of the `.clay-button` note said "Clear the marks" was "the same 41.4px"; measured,
  it was **25.5px**, because `.reset` sets its own 0.82rem font and the kit's padding is in `em`.
  Same defect, different number. Recorded because T-004-03 had to make the same kind of
  correction in its own fourth commit, and a comment that states a measurement it never took is
  the failure both were catching.

## How to look at this yourself

```
npm run verify                       # 832 tests, 682 pages, no browser needed
npm run verify:mobile                # both sweeps over the whole build, 15–30 min
node scripts/check-touch.mjs /404.html /list/ /miso-ramen/    # under 2s, and the usual form
```
