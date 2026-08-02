# T-004-06 — Plan

Six steps, five commits. Each step is verifiable on its own, and the order is chosen so that
every measurement is taken with a tool that is already proven.

Baseline to beat, measured at `96914e6` before anything was written:

```
npm run verify                                    9 files, 832 tests, 658 recipes, 682 pages
node scripts/check-overflow.mjs --width 375,390,768   2046 page views, nothing scrolls sideways
```

---

## Step 1 — extract the plumbing, and guard the sweep

**Do.** Create `scripts/browser.mjs` with the server, the launcher, the `Cdp` client, the
viewport-settling `go()`, the `CHROME` path, the `BY_HAND` text and `watchBuild()`. Rewrite
`scripts/check-overflow.mjs` to import them. Its flags, its `PROBE`, its output lines and its
three exit codes do not change. Add the build-moved check after the sweep.

**Verify.**

1. `node scripts/check-overflow.mjs --width 375,390,768` → must print **exactly**
   `2046 page views at 375px, 390px, 768px — nothing scrolls sideways.` and exit 0. This is a
   2046-case regression test for the refactor.
2. `node scripts/check-overflow.mjs /miso-ramen/ /conchas/` → the bare-route path still works.
3. `CHROME_BIN=/nonexistent node scripts/check-overflow.mjs` → prints the by-hand procedure,
   exits 2.
4. The build-moved guard, exercised deliberately: start a sweep, `touch dist/index.html` while it
   runs, confirm exit 2 and a message naming the rebuild rather than a page.
5. `npm run verify` → unchanged. Neither script is imported by the site; `astro build` never
   sees them.

**Commit.** `lisa commit-ticket --include scripts/browser.mjs scripts/check-overflow.mjs`

**If it goes wrong.** Revert to the single file; `check-touch.mjs` in step 2 becomes
self-contained with a duplicated copy of the plumbing, and design.md §1 records why. Nothing
downstream depends on the extraction.

---

## Step 2 — the touch check, failing first

**Do.** Create `scripts/check-touch.mjs`: the four claims, the three documented exemptions, the
whole build at 375px and 390px, plus a 768px pass for the negative half of the sticky claim.
Add `verify:mobile` to `package.json`.

**Verify — and this is the step that matters most.** Run it **before** any CSS is written. It
must fail, and it must name exactly what research found and nothing else:

- `.source summary` at 24px on 658 recipe pages
- `.clay-button` at 41.4px on `/404.html`
- `.planned h3 a` at 22px on `/list/` *(only if the checker can populate a plan — see below)*

A checker that passes on a codebase with three known defects is broken. If it reports a fourth
thing, that is a finding and goes into research's list before the fix is written; if it reports
fewer than three, the exemptions are too wide and get narrowed here.

**`/list/` is empty without `localStorage`.** The checker seeds
`tabular-recipes:plan` before loading that one route and reloads, so the populated list is
checked rather than the empty-state page. This is stated in the script's header, because a
checker that silently skips the busiest page on the site is worse than no checker.

**Commit.** `lisa commit-ticket --include scripts/check-touch.mjs package.json`

---

## Step 3 — the three tap targets and the variant spacing

**Do.**

| edit | file |
| --- | --- |
| `.source summary` padding + `min-height` at `narrow` | `src/styles/site.css` |
| `.clay-button` floor at `narrow`, in a new section with the vendoring note | `src/styles/site.css` |
| `.variants a + a { margin-inline-start: 1.1rem }` at `narrow` | `src/styles/site.css` |
| `.planned h3 a` at `narrow` | `src/pages/list.astro` |

Each carries its measured before/after in the comment, not a predicted one — the correction
T-004-03 had to make to its own comments in a fourth commit.

**Verify.**

1. `npm run build && node scripts/check-touch.mjs` → green, where step 2 was red.
2. The variant gap re-measured on `boston-baked-beans` at 375px: 6.6px → expected ≥24px.
3. `node scripts/check-overflow.mjs --width 375,390,768` → still 2046 clean. A 44px floor makes
   pages taller, never wider, but "never" is a prediction and this is the measurement.
4. `npm run verify` → 832 tests still green, including `breakpoints.test.ts`, which is what
   proves no fourth number was introduced.

**Commit.** `lisa commit-ticket --include src/styles/site.css src/pages/list.astro`

---

## Step 4 — the `snug` arithmetic

**Do.** Correct the breakpoint block: the 7-column row and `snug`'s one-line description now
carry the measured 736px ≈ 46rem, and the 705–735px unpinned band is named. **The number stays
`44rem`.** Comment only — no rule changes.

**Verify.**

1. `npx vitest run src/styles/breakpoints.test.ts` → still 5 green. The test reads the block's
   declaration lines with a regex (`name  max-width: Nrem  [in use|reserved]`); the shape of
   those two lines must survive the edit, and this is what proves it.
2. `git diff --stat` → one file, comment lines only.

**Commit.** `lisa commit-ticket --include src/styles/site.css`

---

## Step 5 — the proofs

No files change. This is where the criteria get their evidence, and it runs against the final
build so the numbers are the ones that ship.

**5a. The invariant, whole build.**
`npm run build && node scripts/check-overflow.mjs --width 375,390,768` → 2046 page views clean.
Recorded verbatim in `review.md`.

**5b. Tap targets, whole build.**
`node scripts/check-touch.mjs` → 682 pages × 2 widths, plus the 768px sticky pass. Recorded
verbatim.

**5c. Desktop unchanged at 1440px, against the state before T-004-01.**

```
git worktree add <tmp> 02b65e8        # the parent of T-004-01's first commit
(in it) npm ci --silent && npm run build
node scripts/check-overflow.mjs --root <tmp>/dist --width 1440,768 --shots shots/before <12 routes>
node scripts/check-overflow.mjs --root dist        --width 1440,768 --shots shots/after  <12 routes>
diff <(sort shots/before/hashes.txt) <(sort shots/after/hashes.txt)
```

24 SHA-256 comparisons over twelve pages at two widths. Twelve: the front door, `/list/`,
`/404.html`, Bakery, The Bowl Shop, `miso-ramen` (7 col), `beef-stew-slow-cooker` (6),
`tonkotsu-broth` (5), `conchas` (4), `biryani` (20 rows), `boston-baked-beans` (variants),
`pastrami` (5 days).

**The expected exception, predicted before the run.** `/list/` screenshots as its empty state on
both sides, so its hash proves only that. The *populated* list did change on the desktop —
T-004-05 moved the as-it's-sold name to the front of every line at every width and filed a `note`
disposition saying so. So 5c also measures the populated list at 1440px on both sides and
reports the difference in words rather than letting an empty page imply an identity that is not
claimed.

**5d. The walk, at three widths.** The nine surfaces the ticket lists, at 375, 390 and 768, with
the numbers from research re-taken against the final build so nothing in `review.md` is stale.

Then the worktree is removed: `git worktree remove <tmp> --force`. Nothing is left in the
repository.

---

## Step 6 — `docs/gaps/mobile.md`

**Do.** Write it last, from the numbers steps 5a–5d produced. Nine ranked entries in the order
fixed in structure.md, each with: what a person holding a phone experiences, where in the code,
the measurement, what a fix would cost, and *mitigation* or *cure*. Then a closing section
naming what is **not** in the list because this ticket fixed it.

**Verify.** Every number in it traceable to a command in `review.md`; every file:line reference
checked against the tree at the commit that lands it. `node scripts/menu-sections.mjs` (dry run)
→ unchanged output, proving `mobile.md` did not disturb the counters round-trip.

**Commit.** `lisa commit-ticket --include docs/gaps/mobile.md`

---

## Testing strategy, stated whole

**What gets an automated test in `npm run verify`:** nothing new. The two things this ticket adds
need a layout engine, and `verify` must keep running on a machine without Chrome (design.md §1).
`breakpoints.test.ts` already covers the one claim that *can* be made without a browser — that no
third width exists — and it is deliberately not edited.

**What gets a committed browser check:** the four claims in `check-touch.mjs`, run over the whole
build by `npm run verify:mobile`. This is the answer to the note four tickets left, and it is the
first time any of S-004's narrow-width work is defended by something in the repository rather
than by a paragraph in a review.

**What stays a measurement in a document:** the desktop hash comparison (it needs two builds and
a worktree, which is a procedure rather than a check), and the walk (a person reading pages is
not a `process.exit(1)`).

**Known to remain uncovered, and why.** The aisle heading staying stuck, the crossed-off cell
staying opaque under the scroll, the edge cue's gradient, the teaser being hidden — all four are
visual, and asserting them costs more than it protects. They are in `docs/gaps/mobile.md` under
what the net does not catch, so the next person does not mistake a green `verify:mobile` for
full coverage.

---

## Order, and why deviation would cost

1 → 2 → 3 is not rearrangeable. The tool must be proven before it measures (1), the check must be
seen failing before it is trusted (2), and only then may the fix make it pass (3). Steps 4, 5 and
6 depend only on 3. If step 1 fails, the whole plan still runs with a duplicated-plumbing
`check-touch.mjs`; if step 2's first run comes back green, the plan **stops** and the checker is
rewritten, because the finding would be that the checker is wrong, not that the site is fine.
