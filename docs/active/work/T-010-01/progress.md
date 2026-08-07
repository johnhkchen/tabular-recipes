# T-010-01 — Progress

All three plan steps done. `npm run verify` passes: **12 test files, 935 tests, 688 pages built.**

| Step | State | Commit |
| --- | --- | --- |
| 1 — the longest unbroken stretch, in `schedule.ts` + its tests | done | `4411167` |
| 2 — the index, in `search.json.ts` + a new test | done | `cc1c210` |
| — deviation: the endpoint test moved out of the router | done | `9ae51ff`, `ad1041e` |
| 3 — measure, and prove the clock did not move | done | no source change |

---

## Step 1 — `src/lib/schedule.ts`, `src/lib/schedule.test.ts`

As planned. `BREAK_MINUTES = 5`, `interface HandsOnSpan`, `longestUnbroken()`,
`handsOnEvidence()`, and one field — `longestHandsOnMinutes` — on `Schedule`. Spans are collected
inside the existing per-operation loop, after `start` is known, using the same hands-on test as the
minute split.

**Deviation (small):** Structure put the span collection "between the minute split and the `Task`
literal". It sits after `start` is computed rather than immediately after the split, because a span
needs the task's start and `start` is derived from `dependsOn` two statements later. Nothing was
reordered; the loop's existing statements are untouched.

**Fixture repair as planned:** `fixture()` gained `washingUp: null`, which `tree.ts:72` has
required since T-008-01.

**One thing the plan got wrong about the tests.** The first run failed 4 of 69. The fixtures'
`timer(minutes, attention, source)` helper does **not** decide anything: `buildSchedule` re-reads
every timer through `readTimers()`, so the attention comes from the timer's *name* or from the
words of the label, and the helper's `attention`/`source` arguments only document what that
reading is expected to produce. Two consequences:

- `'knead 8 min, then rise 2 hr'` with `timer(8)` and `timer(120)` read as **all unattended**,
  because the helper writes `text: '120 min'`, which `regionsOf()` cannot find in the label, so
  every timer fell back to the whole sentence and "rise" won.
- `'reduce 6 min'` read as hands-on **by default** rather than off the label, because `reduce` is in
  neither vocabulary — so an evidence fixture meant to be `inferred` was correctly `unknown`.

Fixed by naming the timers (`handsOn(minutes, name = 'stir')`), which is how the existing
`describe('what a task says it knows')` block already pins a reading. The fixtures now test this
ticket's arithmetic rather than `time.ts`'s vocabulary.

## Step 2 — `src/pages/search.json.ts`, `src/pages/_search.json.test.ts`

Five fields added, `find` deduplicated, the file's leading comment extended.

**Deviation (real, and it changed a filename):** `src/pages/search.json.test.ts` **cannot live
there.** Astro routes everything under `src/pages/`, so the test file built as the page
`/search.json.test/`, and the build died inside vitest's runner:

```
[ERROR] [build] Caught error rendering /search.json.test:
TypeError: Cannot read properties of undefined (reading 'config')
    at initSuite (@vitest/runner/dist/chunk-artifact.js:1848:23)
```

Renamed to **`src/pages/_search.json.test.ts`**. The leading underscore is Astro's own mechanism for
"not a route". It stays under `src/pages/` rather than moving to `src/lib/` because the repo puts a
test beside the thing it tests (`src/styles/breakpoints.test.ts` does the same), and the thing it
tests is a page. The reason is written into the file's header comment so the next person does not
undo it.

**Also worth recording:** `lisa commit-ticket` refused the rename as one commit —
`--include src/pages/search.json.test.ts --include src/pages/_search.json.test.ts` failed twice with
*"ordinary staged entries changed during verification"* and rolled itself back, with nothing staged
in the ordinary index and no other change pending. Splitting it into two commits — the new path,
then the deleted one — worked first time. Recorded because it will happen to the next ticket that
renames a file.

## Step 3 — Measurement

### The clock did not move

Baseline taken **before any edit**: `<section class="timeline">` extracted from all 664 recipe
pages of a clean `dist/`, tags stripped, whitespace collapsed. Re-extracted after the change and
diffed.

```
664 pages with a clock, before and after
diff clocks-before.txt clocks-after.txt   ->   exit 0, 0 lines
```

**Zero lines.** Every "Start to finish", "Needs you", "N of M steps give no time", every bar
duration, every "we think", every "what you'll wash" is byte-identical.

### Bytes

| | raw | gzip -9 | brotli |
| --- | ---: | ---: | ---: |
| before | 253,812 | 58,946 | 47,603 |
| after | **275,542** | **56,131** | **44,752** |
| change | **+8.6%** | **−4.8%** | **−6.0%** |

**On the wire the endpoint is smaller than it was.** On disk it is 21,730 bytes larger — 33 bytes
per recipe for four numbers and a word.

**What was cut, and it is not enough to hold the raw figure flat.** `find` was 26.6% repeated
tokens (190,400 chars → 139,825). Without that cut the file would be ~326,100 raw, **+28.5%**.

**Design D8 predicted −4.5% raw and was wrong**, and it is worth saying why rather than quietly
reporting a different number. That table priced short key names and an omitted `washingUpCount`.
The shape actually shipped keeps the long names that match `Schedule` and writes
`"washingUpCount": null` explicitly on the 653 recipes that never declared one, which is D8's own
argument — absent and zero must be two answers, not a missing key and a falsy value. Those two
choices are worth about 25 KB between them, and they are the right ones: what a visitor pays is the
compressed figure, and that fell.

### Time

| | before | after |
| --- | ---: | ---: |
| the endpoint's own work (median of 5, warm) | 0.8 ms | **6.3 ms** |
| `/search.json` in the astro build log | — | +16 ms |
| whole build, 688 pages | 619 ms | 629 ms |

`buildSchedule` over all 664 recipes, cold, in isolation: **12.2 ms**. The endpoint's 5.5 ms of new
work is that, warm, plus the dedupe. Against a 629 ms build it is under 1%.

### What the collection looks like through the new numbers

| | count | share |
| --- | ---: | ---: |
| `evidence: stated` | 46 | 6.9% |
| `evidence: inferred` | 223 | 33.6% |
| `evidence: unknown` | 395 | 59.5% |
| a washing-up count declared | 11 | 1.7% |
| hands-on work broken up by at least one break | 60 | 9.0% |
| `longestHandsOnMinutes > elapsedMinutes` | 17 | 2.6% |

Longest stretch across the collection: median 3 min, p90 15 min, max 60 (`beef-rendang`).

That last row is a flag for T-010-02, not a bug: `blt`, `chahan`, `club-sandwich`,
`crispy-rice-bowl` and 13 others are more work than there is clock, for the same reason
`handsOnMinutes` can already exceed `totalMinutes` — parallel branches, one cook.
`Timeline.astro:250-252` handles it today by printing "N steps run at once".

## Nothing left staged

`git status --porcelain src/` is empty. Every ticket-owned change is in one of the four commits
above.
