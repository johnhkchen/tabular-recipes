# T-005-02 · Progress

Three commits, in the order the plan set. No deviation from `plan.md`.

| Step | Commit | Files |
| --- | --- | --- |
| 1 · the shared predicate | `314881d` | `src/lib/schedule.ts`, `src/lib/schedule.test.ts` |
| 2 · the timeline | `1a56330` | `src/components/Timeline.astro` |
| 3 · the cook pane | `51a03d7` | `src/components/CookModes.astro` |

No other file was staged, modified or created. `src/generated/recipes.json` is a gitignored
build artifact.

---

## Step 1 — `attentionIsOurs`

Added to `schedule.ts` beside `confidenceOfTask`, with the reason for the two-way collapse in
its doc comment. `schedule.test.ts` gained one `it` inside the existing
`describe('what a task says it knows')` block, which already builds a fixture carrying exactly
one `stated`, one `inferred` and one `unknown` task — so the new assertion is one line against
a shape the file already vouches for.

`npx vitest run src/lib/schedule.test.ts` — 40 passed.

## Step 2 — `Timeline.astro`

Deleted: the `notes` array (four sentences), the `note` array (three clauses), `authorText`,
`handsOnSub`, the `HEDGE` map, the `.notes` and `.note` style blocks, and `data-confidence` from
both the tag and the bar.

Added: `OUR_READING`, `anyOurReading`, `overlapping` (a count where `overlaps` was a boolean),
`totalSub`, `needsYouSub`, `handsOnFigure`, `legend.ours`, the `we think` legend item and its
`.swatch--ours` rule, and one `.bar[data-reading='ours']` rule where two `data-confidence` rules
had been.

The two stale claims in the file's header comment — the one about a count sitting under the
headline, and the one about "solid to dashed to dotted… 'read off the step' or 'assumed'" — were
rewritten rather than left to describe a page that no longer exists.

### Verified against the four worked recipes

Text extracted from the built pages and diffed against the capture taken before any edit:

| | after |
| --- | --- |
| `shakshuka` | `Start to finish 34 min` · `Needs you 11 min / the rest you can walk away from` — **deletions only**, no hedge word anywhere |
| `mushroom-risotto` | `at least 24 min / 1 of 5 steps gives no time` · `about 34 min / 4 steps run at once`, four rows `(we think)`, legend `… never timed · we think` |
| `ching-bo-leung-soup` | `at least 3 hr 30 min / 1 of 4 steps gives no time` · `about 10 min`, one row `(we think)` |
| `tonkotsu-broth-instant-pot` | `at least 2 hr 50 min / 1 of 5 steps gives no time` · `none given`, no sub, no `(we think)` — all four bars are the author's own word |

### Verified across the built collection

Ten deleted strings, grepped over all 658 built recipe pages, **zero hits each**:

```
so both numbers are floors · keep a sliver · a dotted one means · The recipe itself says
adds up to more hands-on · counted as needing you only because
counted as time you are standing over it · two waits that overlap count once
of the steps that give a time · never puts a number on anything
```

Also zero: `read off the step`, `(assumed)`, and `border-style: dotted` in the built CSS.

### The drawing is untouched

The axis column track was recomputed independently — linear minutes, `minmax(11px, …fr)`, no
scaling of any kind — and compared with the `--stretches` value on every built page:

```
axis tracks checked 658, mismatched 0
```

## Step 3 — `CookModes.astro`

Deleted: `clockFacts` and its four entries, `floor`, `workMinutes`, `anyTiming`, `overlaps`, the
two `pane-note` paragraphs, and the `.clock` style block. `clockFacts` had rendered nowhere since
the clock chips were removed from the cook pane; `design.md` §5 records what follows from that.

Changed: the per-step hedge now fires on `attentionIsOurs(row.task)` rather than only on
`confidence === 'unknown'`, and says `we think` rather than
`the recipe does not say whether you can leave`.

Built-page greps: `Start to finish is the longest chain` 0 (was 144),
`there is no clock to keep` 0 (was 23), `the recipe does not say whether you can leave` 0.

`we think` now appears on **307 pages** — exactly the count of recipes with a bar whose attention
is our reading, which is the number `design.md` predicted and the same 307 that used to carry the
dashed-and-dotted paragraph.

## Deviations

None. Two things were found during implementation and are recorded in `design.md` rather than
handled as changes of plan, because both were already true before this ticket:

1. `clockFacts` was dead code, so the `at least` the ticket points at in `CookModes.astro:263`
   had not been on a page since the chips were removed. The unified vocabulary is being written
   into that component for the first time, not corrected.
2. The 144-page overlap note reconciled the elapsed figure with the waiting figure, and the
   waiting figure was one of those dead chips.

## Still to run at the time of writing

`npm run verify` — **passed**: `all 658 file(s) draw a table`, 9 test files, **833 tests**, 682
pages built. (The cap report shows 964 fields over cap in 388 files, down from T-005-01's 1209 in
499; that movement is T-005-04's work on `.cook` files running alongside, not this ticket's.)

`npm run verify:mobile` and the after-measurement are in `review.md`.
