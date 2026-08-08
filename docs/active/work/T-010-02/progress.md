# T-010-02 — Progress

All six plan steps done. Three commits, four files, 38 new tests, both browser checks clean.

`node` is not on the default PATH here; every command below ran after
`export PATH="$HOME/.nvm/versions/node/v24.18.1/bin:$PATH"`.

---

## Step 1–2 — `src/components/dials.ts` + `dials.test.ts` ✅

Written to `structure.md` §1's interface, no deviation. 38 tests.

**Two numbers in the plan were wrong, and the tests caught both.**

1. A test fixture set `handsOnMinutes: 12` and left `longestHandsOnMinutes` at the helper's
   default 4, so the qualifier fired where the assertion expected it not to. The fixture was
   inconsistent, not the module.
2. **The two-dial split in `research.md` §2 was computed under the rule `design.md` D4 later
   rejected.** `standing ≤ 15 and by ≤ 60` was tabulated as 148 / 121 / 395 using a *global*
   evidence gate. Under the per-dial rule the module implements, the same **148 pass** but the
   split is **292 fail / 224 cannot say**: 171 of the 395 recipes with no standing evidence are
   over the hour on a clock that is real, so they are failures rather than unanswered — which is
   exactly what D4 argues for, showing its work. `research.md` now carries the correction and a
   footnote saying which rule produced which figure; the test asserts the real numbers with the
   reason in a comment.

Every single-dial figure in `design.md` D1 was confirmed unchanged by the test.

**Commit `a190d7c` — "Three dials, and the three answers they give"**

## Step 3 — `src/styles/site.css` ✅

Dead `.filters` / `.filter` block (41 lines, unused since `62a3ab9`, the first commit) removed;
`.dials` / `.dial-set` / `.dial-name` / `.dial` / `.dial button` and its four states added in its
place, plus `.cannot-say`, `.results .figures`, `.results .unsaid`, a
`prefers-reduced-motion` block and one `@media (max-width: 34rem)` giving the stops
`min-height: 44px`.

| check | result |
| --- | --- |
| `vitest run src/styles/breakpoints.test.ts` | 7 passed — only `44rem`/`34rem` written |
| `grep '#[0-9a-fA-F]{3,6}' src/styles/site.css` | 4 hits, all pre-existing, all inside `@media print` |
| `grep -rn 'class="filter'` over `src/` and `dist/` | nothing |

**Commit `4dc8e19` — "Draw the dials, and retire the chips nobody used"**

## Step 4–5 — `src/pages/index.astro` ✅

Markup and script in one commit rather than two: the markup is unusable without the script and a
commit that ships twelve dead buttons is not a reviewable unit.

Rendered markup, off the built page:

```
data-dial="standing" ×4   data-dial="by" ×4   data-dial="wash" ×4
role="group" ×3           aria-labelledby="dial-standing|by|wash" ×1 each
dist/miso-ramen/index.html: data-dial ×0     — no other page moved
```

**One deviation from `structure.md`.** The card's `<p>` was to carry `class="figures"` always;
it is now left bare when no dial is set, so a plain search draws the exact card it drew before.
Two lines, and it keeps criterion 11 literally true rather than nearly true.

**Commit `87059f1` — "Put the dials on the front page, beside the box"**

## Step 6 — the browser pass ✅

### `npm run verify`

**946 of 948 pass; the 2 failures are another ticket's, not this one's.**
`src/lib/step-labels.test.ts` fails on a `scripts/inline-step-labels.mjs` that does not exist
yet. `git status` shows `src/lib/step-labels.ts`, `src/lib/step-labels.test.ts` and
`scripts/normalise.mjs` modified in the working tree by T-009-03, in flight on the same branch.
Stashing those three files and re-running that one file gives **27 passed** — so the failure is
theirs and this ticket's tree is clean. With those files excluded, **12 files, 946 tests, all
green**, and `astro build` completes **688 pages**.

### `npm run verify:mobile`

The first run aborted with `dist/ changed while this was reading it` — a concurrent ticket
building on the same branch, which is the race `check-overflow.mjs` was written to name. Re-run
against an isolated build (`astro build --outDir <scratch>/dist`) standing still:

```
2064 page views at 375px, 390px, 768px — nothing scrolls sideways.
2064 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px,
      the table says when it continues, and the pinned column stays below 44rem.
```

Both exit 0. The twelve dial buttons are server-rendered and visible, so they were measured on
every one of those page views of `/`, not skipped as hidden.

### The by-hand pass

Driven through `scripts/browser.mjs`'s own plumbing so it is reproducible; the full state dump
is in `shots/transcript.md`. **A bug in the driver, not the page:** the first run read a stale
tally because `Runtime.evaluate` does not await a promise unless asked to, so
`evaluate('new Promise(...)')` returned instantly and measured the page mid-debounce. Sleeping
on the node side instead fixed it, and the mid-debounce reading is now recorded on purpose as
evidence the debounce works.

| # | expected | observed |
| --- | --- | --- |
| 1 | press *15 min* → counters go, tally, URL | `227 match · 42 don’t · 395 we can’t say`, `/?standing=15`, counters hidden |
| 2 | all three answers in one screenshot | `shots/375-three-answers.png` — `2 match · 2 don’t · 2 we can’t say` with both passes and the cannot-say heading on one 375×1000 screen |
| 3 | reload | identical state, dial still pressed |
| 4 | pasted link, fresh tab | identical state |
| 5 | type `beans` on top | `/?q=beans&standing=15`, 24 passes, 43 unanswered, tally `24 match · 8 don’t · 43 we can’t say` |
| 5a | 100 ms after the keystroke | list already redrawn (24 cards), tally still the old sentence — **the debounce, working** |
| 6 | dial back to *Any* | `/?q=beans`, tally back to `75 of 664 recipes`, cannot-say section gone |
| 7 | clear the box too | URL back to a bare `/`, counter row back |
| 8 | Tab from the box | `input → standing:any,5,15,30 → by:any,30,60,120 → wash:any,1,3,5 → a` — twelve stops, in reading order; focus lands, Space presses, ring declared |
| 9 | *Things to wash → 1* | `4 match · 7 don’t · 653 we can’t say`; 4 passes led by `Memphis Dry Rub — nothing to wash`; 12 unanswered cards and `and 641 more we can’t say for` |
| 10 | pristine page, type `miso` | **URL stays `/`** — no `replaceState`, search behaviour unchanged |

### Front-door geometry, measured

| width | finder height | counter row starts at |
| --- | ---: | ---: |
| 375px | 379px | 694px |
| 900px | 191px | 463px |

The dials cost about **270px above the counter row on a phone** and about 80px on a desktop,
where `auto-fit` puts all three in one row. At 375×900 the first counter card is still on the
first screen (`shots/375-front-door.png`); on a 667px-tall phone it is just below the fold. That
is the real price of the decision in D6 and it is written up as a concern rather than hidden.

Screenshots: `shots/375-front-door.png`, `shots/900-front-door.png`,
`shots/375-three-answers.png`, `shots/375-wash-1.png`.

---

## Files, and nothing else

```
new       src/components/dials.ts            296 lines
new       src/components/dials.test.ts       380 lines
modified  src/pages/index.astro              +173 / −38
modified  src/styles/site.css                +112 / −41
```

No `.cook` file. Not `src/pages/search.json.ts`. Nothing under `src/lib/`, `src/data/`,
`scripts/`, or any other page or component.
