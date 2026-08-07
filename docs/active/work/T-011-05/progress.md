# T-011-05 — Progress

Plan's five steps, all landed. Two deviations, both recorded below with their reasons.

---

## Step 0 — the evidence, before the code ✅

`costOf()` run over all 685 recipes at `× 0.5`, `× 2` and `× 3` before a line of the feature was
written. It changed the design twice:

- **`bounded` has to be tested before `evidence`.** Every air fryer file reads
  `evidence: 'unknown'` — roast and air-fry are unattended verbs, so those recipes report zero
  hands-on minutes. A rule of *"silence when the evidence is unknown"* would have silenced the
  22 recipes this ticket was written about.
- **The worst offenders are not vessel-bound.** `mujaddara` and `gumbo` add 104 and 98 minutes at
  `× 3` with no capacity anywhere near them. See `before-after.md` §1.

---

## Step 1 — `scaling-words.ts` and its tests ✅

`src/components/scaling-words.ts` + `src/components/scaling-words.test.ts`.
Commit `457ad94` *Say what the multiplier costs*.

Nine findings, one §6 row each, and `free` / `cannot-say` as two distinct kinds so the two
opposite answers cannot be collapsed. 23 tests green at the time of the commit.

---

## Step 2 — `PlanCosts.astro` ✅

Commit `cb73622`, with step 3.

Built and measured as the plan required: **685 slugs, 71 distinct sentences, 54 067 bytes of
inline JSON** against the 100 KB gate that would have forced a rethink. The whole `/list/` page
is 58 KB, and it already fetches a 650 KB `plan.json`.

---

## Step 3 — `list.astro` ✅

Commit `cb73622` *Stop the plan page lying about the clock*. Frontmatter import, the island as
the first child of `.list-page`, the evening line between the planned list and the doubling note,
the reader and the two hooks inside `drawPlanned`, three style rules, no new media query.

Checked by hand, as the plan asked: pressing `× 2` then `× 3` changes the sentence with the dial
(the line is built inside `drawPlanned` from `item.multiplier`, not cached), and `evening.hidden`
alone is enough because `.list-page :global([hidden])` was already in the file.

---

## Deviation 1 — a ninth finding, `lots-and-work`

**Found by reading the built output, not by a test.** `beef-bourguignon-instant-pot` came out as

> It goes in six lots, and that is the only difference.

and the recipe gains **ninety minutes** at `× 3`, every one of them browning. The vessel really
is free — `costMinutes` is 0, which is what §6's row is about — but *"that is the only
difference"* is a claim about the whole evening, and a reader has no counterfactual
recipe-without-a-capacity to measure it against. **That is this ticket's own defect, one branch
over**: a page implying the clock stood still when it moved by an hour and a half.

It is not one recipe. **All 24 recipes whose vessel is free gain time at `× 2` and `× 3`** — the
`× 0.5` cases are `fits`/`unbinds` and genuinely flat.

So `lots-only` was split. `elapsed.flat` is asked first, and only a recipe whose clock genuinely
does not move gets §6's row; the rest get two §6 rows in one sentence:

> It goes in six lots, and three times as much is three times the chopping.

*"The pot doesn't care"* is dropped from the second clause, because here it demonstrably does.

A whole-collection invariant now guards the class rather than the instance: **no sentence
containing "the only difference", "costs you nothing extra" or "still takes the same" may be
printed for a recipe whose elapsed figure moves at all**, over 685 recipes × 4 multipliers. It
also proved the `free` and `same-wait` branches were already right.

Commit `f8cd05a` *Stop a free vessel claiming a still clock*. 25 tests green.

**This is a real gap in `docs/knowledge/scaling.md` §6** — the row is written for a comparison a
page cannot show. The ticket's §1 says a missing sentence should be added to the phrasebook, but
the acceptance criteria do not list `docs/knowledge/**` among the files this ticket may modify,
so the file is left alone and the gap is reported in `review.md` instead. Nothing was invented:
both clauses of the replacement are §6 rows.

---

## Deviation 2 — `npm run verify` was run against a clean copy of HEAD

Another ticket's thread is working the same branch and had `src/pages/search.json.ts`,
`src/components/situation.test.ts` and `src/lib/meal.ts` in flight in the shared working tree
mid-run. Six of their tests were red at the time, and none of the files involved is one this
ticket touches.

So the gates were run against `git archive HEAD | tar -x` into a scratch directory with
`node_modules` symlinked — every committed file, none of the neighbouring thread's uncommitted
ones. `npm run verify` exits **0** there: 20 test files, 1218 tests. The same command in the
shared tree now also passes, the other thread having since committed.

---

## Step 4 — the gates ✅

| | result |
| --- | --- |
| `npm run verify` (clean copy of HEAD) | **exit 0** — 20 files, 1218 tests |
| `check-overflow.mjs --width 375,390,768` on `/`, `/list/`, two recipes | 12 page views, nothing scrolls sideways |
| `check-touch.mjs` on the same | 9 page views, everything a thumb hits is 44px |
| `npm run verify:mobile`, all 710 pages × 3 widths | see `review.md` |
| a **populated** `/list/`, which neither script can reach | measured by `shot.mjs`: no sideways scroll, nothing under 44px, at 390px and 768px |

That last row is the one worth noticing. `check-overflow` and `check-touch` visit `/list/` with
an empty `localStorage`, so they never see a cost line at all — the case this ticket adds is
invisible to both. `shot.mjs` seeds a four-recipe plan and measures the same two things there.

---

## Step 5 — the evidence ✅

- `before-after.md` — the five most misleading, the basket family, the 34 recipes that stay
  silent while carrying half an hour or more of unwarned cost, and the whole-collection counts.
- `shot.mjs` + `list-390.png` + `list-768.png` — all three readings, plus a `× 1` line, in one
  frame at each width.

---

## Not done, and deliberately

- **A real cross-recipe schedule.** Argued in `design.md` §4 and deferred with a reason: it needs
  a merged critical path and a vessel-contention model the collection has no data for
  (`scaling.md` §9). The total sums hands-on and takes the maximum elapsed, stated as a floor.
  **No elapsed times are added together anywhere**, which is a property of one tested function.
- **`servingsText` and `serves 4 → 12`.** True as it stands — the servings really do triple. The
  silence beside it was the lie, and the silence is what this fills.
- **`scaleAmount`, `MULTIPLIERS`, the shopping list's grouping, `src/lib/plan.ts`, any `.cook`
  file.** Untouched, as the criteria require.
