# T-005-02 · Plan — three commits, measured at both ends

---

## Step 0 · Baseline, already taken

Recorded before any edit, from the `dist/` in the working tree (built 08:12 today, ahead of every
commit touching `src/`):

| | visible characters |
| --- | ---: |
| `ching-bo-leung-soup` | **6226** |
| `tonkotsu-broth-instant-pot` | **4027** |
| collection mean / median / max | **3494 / 3383 / 6226** |

Method in `research.md` §8, reproducing the story's figures to within 0.2%. The measuring script
lives in the attempt scratchpad, not in the repository — the ticket allows three source files and
a measurement script is not one of them.

Also captured verbatim: the rendered timeline and cook-pane text of `shakshuka`,
`mushroom-risotto`, `ching-bo-leung-soup` and `tonkotsu-broth-instant-pot`, so the after-state can
be diffed sentence by sentence rather than by eye.

---

## Step 1 · `schedule.ts` gains the predicate; `schedule.test.ts` pins it

**Do:** add `attentionIsOurs(task)` with its doc comment. Add one test beside
*"will not claim to know whether you can walk away"* covering all three `Confidence` values.

**Verify:** `npx vitest run src/lib/schedule.test.ts` — green, including the new case, and no
other test in the file moves.

**Commit:** `lisa commit-ticket --ticket-id T-005-02 --message "Say once where the attention
reading came from" --include src/lib/schedule.ts --include src/lib/schedule.test.ts`

Independently correct: the export is unused at this point, and nothing renders differently.

---

## Step 2 · `Timeline.astro`

Largest step; every acceptance criterion except the cook-pane hedge lands here. Done as one unit
because the deletions and the replacements are the same edit — removing `notes` without adding
`totalSub` would leave the page briefly less honest than either end state.

**Do,** in this order so the file compiles at each stop:

1. import `attentionIsOurs`; replace `HEDGE` with `OUR_READING`.
2. `overlaps` → `overlapping` (a count).
3. add `anyOurReading`, `handsOnFigure`, `totalSub`, `needsYouSub`; delete `authorText`,
   `handsOnSub`, `notes`, `note`.
4. `legend.guess`.
5. markup: verdict, stats, delete both paragraphs, `data-reading`, legend item.
6. styles: one `.bar` rule, add `.swatch--guess`, delete `.notes` and `.note`.
7. rewrite the two stale claims in the header comment.

**Verify:**
- `npx astro build` completes; no unused-variable or missing-import error.
- Re-extract the rendered text for the four named recipes and check against the baseline capture:
  - `shakshuka` — **deletions only**. Stats unchanged apart from the removed
    `two waits that overlap count once`; no `at least`, no `about`, no `we think`.
  - `mushroom-risotto` — `at least 24 min` / `1 of 5 steps gives no time`;
    `about 34 min` / `4 steps run at once`; four rows carrying `(we think)`; legend ends
    `we think`; no `<p class="notes">` and no `<p class="note">` in the section.
  - `ching-bo-leung-soup` — `at least 3 hr 30 min` / `1 of 4 steps gives no time`;
    `about 10 min`; one `(we think)` row.
  - `tonkotsu-broth-instant-pot` — `at least 2 hr 50 min` / `1 of 5 steps gives no time`;
    `none given` with no sub; no `(we think)` on any row (all four bars `stated`).
- Grep the whole of `dist/` for each deleted sentence: `so both numbers are floors`,
  `keep a sliver`, `a dotted one means`, `The recipe itself says`, `adds up to more hands-on`,
  `counted as needing you only because`, `is counted as time you are standing over it`,
  `two waits that overlap count once`, `of the steps that give a time`,
  `never puts a number on anything`. **Zero hits, all ten.**
- Grep for `border-style: dotted` in the built CSS — zero.
- Confirm the axis is untouched: the `grid-template-columns` of `ching-bo-leung-soup` is
  byte-identical to the baseline page's.

**Commit:** `lisa commit-ticket --ticket-id T-005-02 --message "Put the hedge in the number and
the code in the legend" --include src/components/Timeline.astro`

---

## Step 3 · `CookModes.astro`

**Do:** import `attentionIsOurs`; delete `workMinutes`, `anyTiming`, `overlaps`, `floor`,
`clockFacts` and their comments; delete the two `pane-note` paragraphs; swap the `.hedge`
condition and text; delete the `.clock` CSS; extend the "No clock chips here" comment.

**Verify:**
- `npx astro build` clean.
- `dist/` grep: `Start to finish is the longest chain` → 0 (was 144),
  `there is no clock to keep` → 0 (was 23),
  `the recipe does not say whether you can leave` → 0 (was 154 pages' worth).
- `mushroom-risotto`'s cook pane shows four `we think` hedges and no pane-note beyond the prep
  pane's own instruction.

**Commit:** `lisa commit-ticket --ticket-id T-005-02 --message "One word for one doubt in the
cook pane" --include src/components/CookModes.astro`

---

## Step 4 · Full verification

1. `npm run verify` — check → recipes → `vitest run` (9 files, 832 tests + the new one) →
   `astro build` (682 pages). Must exit 0.
2. `npm run verify:mobile` — build → `check-overflow.mjs --width 375,390,768` →
   `check-touch.mjs`. Must exit 0. The strings changed sit in the stat wells and the legend, both
   of which T-004 sized for 375px; the new sub-labels are shorter than the ones they replace
   (`1 of 4 steps gives no time` is 26 characters against `two waits that overlap count once` at
   33), so the narrow-screen risk is a decrease, but it is measured rather than argued.
3. Re-measure visible characters with the same script and record `ching-bo-leung-soup` and
   `tonkotsu-broth-instant-pot` before and after, plus the collection mean/median/max as context.
4. Re-run the whole-collection counts through `buildSchedule` to confirm the hedge words appear
   exactly where the design says: `at least` on 577, `about` on 365, neither on 44, `we think` on
   307.

---

## Testing strategy

**Unit tests: one, and only one, is warranted.** `attentionIsOurs` is the only pure function this
ticket adds, and `src/lib/` is where this repository's vitest suite lives. It gets a test.

**The components get none, and that is the existing shape of the project, not a shortcut.**
There is no component test in the repository — no `.astro` test file, no test renderer in
`devDependencies`. Introducing one would mean adding a dependency and a harness, which is outside
a ticket permitted three files.

**What stands in for component tests** is verification against the built output, which is
stronger than a snapshot for this particular change because the claim being tested is *"this
sentence is on no page"*:

- a grep of all 658 built pages for each of the ten deleted strings, expecting zero;
- the four worked recipes' rendered text diffed against a capture taken before the edit;
- a whole-collection re-derivation of where each hedge word should appear, compared with the
  design's predicted counts.

**Gaps this leaves,** to be stated in `review.md` rather than hidden: nothing pins the sub-label
strings against future edits, and nothing but `astro build` type-checks the components.

---

## Rollback and risk

Each step is one commit and one file (two in step 1). Step 2 is the only one that can change the
drawing, and the check for that is a byte-comparison of the axis `grid-template-columns` before
and after.

The single decision most likely to be argued with is **keeping `at least` rather than making
everything `about`**. It is one ternary at `Timeline.astro:214`; the argument for it — `pizzelle`,
45 seconds against the author's 45 minutes — is in `design.md` §1 and the counter-change is one
line.
