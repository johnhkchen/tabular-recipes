# T-011-06 — Progress

Six files, four commits, all through `lisa commit-ticket` with exact `--include` paths.

| step | commit | what |
| --- | --- | --- |
| 1 | `db75fe0` | `src/components/situation.ts` — the vocabulary, the cost at a size, the shelving, the sentences |
| 2 | `cd76aa7` | `search.json.ts` + both test files — the index carries the numbers, and the agreement with `costOf` is proved |
| 3 | `31a759a` | `index.astro`, `site.css`, `situation.ts` — the control row, the dropped shelf, the four-way render |

Steps 3 and 4 of `plan.md` (the fourth question, then the sentences) landed inside step 1's file
rather than as separate commits: the module was written whole and the tests for all four parts ran
together. No behaviour was skipped, and every test named in the plan exists.

## Deviations from the plan, and why

### 1. The index costs 21% more, not the 4% design.md claimed

Measured rather than estimated, which is why it moved.

| | raw | gzipped |
| --- | ---: | ---: |
| before | 281,289 | 57,840 |
| **after** | **343,113** | **69,789** (+12.0 KB, +21%) |
| design.md's rejected option A (a row per recipe per size) | 390,759 | 78,730 (+20.9 KB, +36%) |

D3 costed the *values* (about 12 KB) and forgot the *key names*: `writtenServings`, `waitMinutes`
and `untimedCount` are three more keys on 685 entries, which is 41 KB of repeated names before a
single number. The decision does not reverse — the chosen shape is still 43% cheaper than the one
it beat, and the endpoint is fetched once, lazily, on the first keystroke — but the number in
design.md is wrong and this is the correction.

### 2. The uncertainty row is a tail, not a replacement

design.md D8 said the phrasebook's *"This one doesn't time enough of itself to say"* would be
tested before the growth rows. Measured against the collection, that rule fires on **228 of the
248 recipes that scale flat at eighteen servings** — including every stew in the three-day list,
because 267 recipes report zero hands-on minutes and most of that is silence rather than freedom
(`scaling.md` §4.6). A list of a hundred cards all reading *we can't say* is the site explaining
itself, which §6's second rule refuses.

So the finding is said and the silence is said after it, using the phrasebook's own last row:

> Feeds eighteen without taking any longer. Plus four steps it never times.

That is `chili-con-carne`'s card at six people over three days, and it is both halves of §4.6 in
one line. The refusal row is not used by this page at all; `review.md` records that and where it
belongs instead.

### 3. The days stops are numbers, not words

`Today · 2 days · 3 days` made the two tracks wider than a 375px phone and wrapped one stop onto a
line of its own — a control that reads as broken rather than compact. The labels are now `1 · 2 ·
3` under a name that already says *how many days*, and the words survive where they matter: the
`aria-label` is still *eating it today*.

### 4. The situation's name sits beside its stops, not above them

`.dial-set` puts the name above the track. Two more names on their own lines is 40px of a phone
screen spent on two short phrases, and the counter shelf is what pays for it. Read across, the row
is a sentence with two blanks in it. Everything else — the track, the pressed stop, the 44px thumb
rule — is `.dial`'s, unchanged.

## What was measured along the way

- **The gate held on the first run.** `costAt()` reproduces `costOf()` exactly on all 685 recipes
  at all 8 sizes, both code paths, first time. No fallback to design.md's option A was needed.
- `beef-with-broccoli` at twelve portions comes out at 42 minutes elapsed and 12 standing, which
  is `scaling.md` §3's hand-worked example digit for digit. It is asserted in
  `_search.json.test.ts` rather than trusted.
- **Six people over three days: 113 match, 25 dropped, 547 we can't say.** The whole list, with a
  verdict per recipe, is `six-over-three.md`.
- **The small situation is identical.** `?standing=15` and `?standing=15&people=1&days=1` return
  the same 227 recipes in the same order, the same 416 on the unanswered shelf, and nothing at all
  on the dropped shelf. Captured from a real browser in `browser-pass.json`.
- The front door: at 375px the counter shelf now starts 8px below the fold, where it started
  about 120px above it before. That is a finding and it is in `review.md` with what should happen.

## Files

| file | | |
| --- | --- | --- |
| `src/components/situation.ts` | new | 480 |
| `src/components/situation.test.ts` | new | 400 |
| `src/pages/search.json.ts` | modified | +58 |
| `src/pages/_search.json.test.ts` | modified | +101 |
| `src/pages/index.astro` | modified | +150/−45 |
| `src/styles/site.css` | modified | +56 |

No `.cook` file, nothing under `src/lib/`, `src/data/` or `scripts/`, and
`src/components/dials.ts` is imported everywhere and edited nowhere.
