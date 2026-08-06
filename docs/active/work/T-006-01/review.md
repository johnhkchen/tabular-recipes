# T-006-01 · Review — one string, six characters, both figures intact

**One commit, two files, one string a reader meets.** The chip's label went from `about` to
`recipe says`, so the author's own `>> time:` is now attributed on all 658 pages; the clock panel
was not touched. Neither figure moved on any page — proved, not asserted. Cost: **6 characters a
page**, mean 2823 → 2829.

Commit `35ced89` · `Say whose number the chip is quoting`.

---

## What changed

| file | change | reaches a reader |
| --- | --- | --- |
| `src/pages/[slug].astro` | `facts[1].label`: `'about'` → `'recipe says'`, plus a 3-line comment saying the label slot is the attribution | **yes**, 658 pages |
| `src/components/Timeline.astro` | one comment clause corrected | no |

No file created. No file deleted. `src/styles/site.css` was permitted and **not needed** — the
chip label is unstyled and inherits `--clay-ink-soft`, and `.chips` is `flex-wrap: wrap`, so six
more characters wrap instead of widening the row. No recipe file, no `schedule.ts`.

### The rendered change

```diff
- Bakery · serves 12 · about 24 hr · Breads
+ Bakery · serves 12 · recipe says 24 hr · Breads
```

Below it, unchanged: `The clock` · `Start to finish  at least 16 hr 15 min` · `1 of 5 steps gives
no time` · `Needs you  about 45 min`.

### The comment change

`Timeline.astro:219–227` argued that `Needs you` says `about` partly because *"it is the word the
page already uses for the author's own time in the chips above"*. That clause stopped being true
the moment the chip changed, so it was replaced with what is true instead: the chip no longer
shares the word, and `about` now means one thing on the page. The argument's load-bearing half —
untimed steps leave minutes out, hands-on is the fallback — is untouched.

---

## The acceptance criteria, one at a time

**1 · A reader can tell which total came from the recipe and which from the table, on all 635
pages that print both, without reading a sentence.** The chip now names its source in two words.
The clock names itself `The clock` and shows its work in front of the reader — one row per
operation with its own duration, an axis drawn to scale, a `(we think)` on every reading that is
the site's rather than the author's, and a four-item legend. The argument, in full, is
`design.md` §"Why A": **the chip was the ambiguous figure and the panel never was**, so naming one
side is what produces the contrast. This is the one judgement call in the ticket and it is the
open concern below.

**2 · Nothing added is longer than a label; every string quoted with its character count, checked
against `voice.md`.**

| string | chars | `voice.md` |
| --- | ---: | --- |
| `recipe says` | **11** | *friend at a kitchen table* ✓ — "recipe says four hours" · *changes how you cook it* ✓ — it says which of two totals to plan the afternoon around · *say it once* ✓ — one figure, one place, and the word it replaced is not reintroduced |

That is the entire list. Two words, inside the ticket's "two or three words per figure". Not a
sentence, not a note, not a tooltip, not a legend.

**3 · The 23 chip-only pages still read correctly.** `guacamole`: `Taqueria · serves 4 · recipe
says 15 min · Sauces and Gravies`, then `The clock` / `Not one of its 4 steps is timed.`
**What it shows:** `recipe says 15 min` names a source and gives a number, so it is a whole thing
to read with nothing beside it — it does not point at a second figure that is not there. That is
the specific trap the ticket set, and the phrasing avoids it by being a source rather than a
contrast. (Design option D, a heading reading `The clock, from the steps`, fails this test on
these 23 pages: it would promise a derivation the next line says could not be done.)

**4 · The two `about`s resolved deliberately, decision recorded.** **Separated, by deletion.**
Before: `about` on all 658 chips meaning *this is the author's figure*, and on 365 `Needs you`
figures meaning *this number is fuzzy in both directions*. After: `about` appears on the recipe
pages in one place with one meaning — the panel's own worked-out figure. The chip stops using it,
because the chip was never hedging: `sourdough-boule`'s file says `>> time: 24 hr` and the page
added `about` on its own. Declaring the two identical was the other permitted resolution and was
rejected because they are not identical; recorded in `design.md` §"The two `about`s".

**5 · Neither figure changes value anywhere.** Built before and after, extracted per slug: chip
time, `Start to finish`, `Needs you`.

```
diff <(cut -f1,3,4 before) <(cut -f1,3,4 after)   → empty
figure rows changed:               0 / 658
chip rows not a clean label swap:  0 / 658
rows with no chip time:            0
```

**Both clock strings byte-identical across all 658 pages.** All 658 chips changed by exactly
`about ` → `recipe says `, with the number unchanged on every one. The 23 pages with no stat
blocks record `-` in both figure columns before and after, so a page gaining or losing a block
would show as a changed row rather than being silently skipped. Split unchanged: 635 / 23 / 0.

**6 · Measured after, by `scripts/measure-pages.mjs`. Say what it cost.**

```
              before      after   delta
mean            2823       2829      +6
median          2766       2772      +6
max             4474       4480      +6   biryani, same page
min             1566       1572      +6   egg-cream, same page
total      1,857,209  1,861,157  +3,948   = 658 × 6
```

**It cost six characters a page** — `about` (5) → `recipe says` (11) — paid on all 658 because
every recipe carries a `>> time:`. The delta is identical at every percentile, which is itself
evidence that nothing else on any page moved. 2829 against a 2823 baseline is within a few
characters, as required.

**7 · No page gains a sentence about how the site computes anything.** The ten strings T-005-02
grepped to zero, re-grepped over the built site (the criterion says six; T-005-02's review lists
ten, and a superset is the safer check):

```
0  so both numbers are floors                0  counted as needing you only because
0  keep a sliver                             0  counted as time you are standing over it
0  a dotted one means                        0  two waits that overlap count once
0  The recipe itself says                    0  of the steps that give a time
0  adds up to more hands-on                  0  never puts a number on anything
```

All ten at zero. `The recipe itself says` is the one this ticket came nearest to reinventing and
it is still absent — `recipe says` is a label in a chip, not that sentence in a panel of
worked-out numbers. Also grepped for the forbidden shape: `worked out` **0**, `from the steps`
**0**. `the table` returns 658 and always did — it is the pre-existing mobile hint *"More to the
right — drag the table across"*, untouched here.

**8 · Renders at 375px with no horizontal scroll; `npm run verify:mobile` passes.** **exit 0** —
*2046 page views at 375px, 390px, 768px — nothing scrolls sideways*, and *everything a thumb has
to hit is 44px, the table says when it continues, and the pinned column stays below 44rem*.

**9 · `npm run verify` passes.** **exit 0** — `all 658 file(s) draw a table`, 9 test files,
**833 tests passed**, 682 pages built.

**10 · Only `[slug].astro` and `Timeline.astro` modified.** `git show --stat 35ced89`: two files,
7 insertions, 3 deletions. Nothing staged, modified or untracked afterwards except the work
artifacts and the story/ticket files Lisa publishes.

---

## Verification, collected

| | |
| --- | --- |
| `npm run verify` | **exit 0** — 833 tests, 658 files draw a table, 682 pages built |
| `npm run verify:mobile` | **exit 0** — 2046 page views, nothing scrolls sideways, 44px met |
| figure diff, 658 pages × 2 strings | **0 changed** |
| chip diff, 658 pages | **658 clean label swaps, 0 anomalies** |
| `measure-pages.mjs` | mean **2829**, delta **+6** at every percentile |
| ten S-005 strings | **0 each** |

**One deviation, and it is not this ticket's.** The first `verify:mobile` run exited 2 on
`check-overflow`'s own guard — *"dist/ changed while this was reading it — a build running
alongside, most likely."* T-006-02 runs concurrently and edits `.cook` files, so its builds
rewrite `dist/` under any reader. The guard refused to report against a half-rewritten build,
which is correct behaviour. Re-run against a settled build: exit 0. Worth knowing for anyone
running these two tickets side by side.

## Test coverage

**No test was added, and that is the shape of the project rather than a shortcut.** The change is
a string literal in an `.astro` template. There is no pure function to unit-test, no `.astro`
component test anywhere in the repository, and no component renderer in `devDependencies` —
T-005-02 hit the identical wall on the identical surface and recorded the same conclusion. Adding
a harness means a new dependency, outside a ticket permitted three files.

What stands in its place is stronger for the claim actually being made. The claim is *1316
rendered figures across 658 pages did not move, and 658 labels changed by exactly this much* —
a property of the built site, checked exhaustively rather than sampled. The existing 833-test
suite still runs green.

**Gap, named rather than fixed:** nothing in CI notices if a later ticket puts `about` back on the
chip or lets the mean drift. `measure-pages.mjs` is deliberately outside `npm run verify` — its
own header says it measures and does not judge. Adding a gate is a change to the verify pipeline,
and this ticket owned two component files.

---

## Open concerns

**1 · The clock is not attributed in words, only the chip.** This is the deliberate judgement of
the ticket and the thing a reviewer is most likely to want changed. The argument for leaving it:
the panel derives itself in front of the reader — rows, durations, axis, legend, `(we think)` —
so nothing in it can be mistaken for a number somebody typed at the top of a recipe file, while
the chip, sitting beside `serves 12` in the site's own voice, could be and was.

The argument against is simply that it is inferred rather than stated. **If a person decides the
panel must say it too, the change is one string and the price is known:** `Timeline.astro:274`,
`The clock` → `The clock, from the steps`, **+16 characters a page**, mean 2829 → 2845. It was
rejected on two grounds — the acceptance criterion says "within a few characters of 2823", and on
the 23 pages that time nothing it would head a panel whose next line is *Not one of its 4 steps is
timed*. Both grounds are in `design.md`; neither is beyond argument.

**2 · `recipe says` has no article, on purpose.** `docs/gaps/voice.md` and the story both write
*the recipe says*. The article costs 4 more characters on 658 pages (+10 rather than +6) and chips
do not carry articles — the chip beside it reads `serves 12`. If the article is wanted, it is a
one-word edit and 4 more characters a page.

**3 · Nothing here defines what `>> time:` means.** Out of scope by the story's own words, and it
stays on `docs/gaps/voice.md`'s list. `sourdough-boule` still says `recipe says 24 hr` above
`at least 16 hr 15 min`, and that is now legible as two different measurements rather than as a
contradiction — which is exactly what the story asked for and no more.

**4 · The 14 contradictory recipes are untouched**, correctly — T-006-02 owns them, in the `.cook`
files, running alongside. No file overlap with this ticket.

**5 · `docs/gaps/voice.md` §2 is now stale** — it says "nothing on the page says which is which"
and lists this as unfixed. Updating it was not in this ticket's file list. It is S-006's to close
when both tickets land.

---

## What a reviewer should read, in order

1. `src/pages/[slug].astro:42` — the one string a reader meets.
2. `design.md` §"Why A" — the only judgement call, and open concern 1 is its counter-argument.
3. `progress.md` §3–4 — the before/after proof and the character arithmetic.
