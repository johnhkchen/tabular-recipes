# T-006-01 · Progress

**Done.** Two files, one rendered string, one commit. Every number the plan predicted came out
exactly.

---

## Steps

| # | step | state |
| --- | --- | --- |
| 0 | baseline captured at `ff0cd55` | done |
| 1 | `[slug].astro:42` label `about` → `recipe says` | done |
| 2 | `Timeline.astro` comment corrected | done |
| 3 | prove neither figure moved | done — **0 rows changed** |
| 4 | cost, and the deleted sentences still at zero | done — **mean 2829**, all ten at 0 |
| 5 | `npm run verify` / `npm run verify:mobile` | done — see §5 |
| 6 | artifacts + commit | done |

---

## 1 · The change

`src/pages/[slug].astro:40–47`:

```js
const facts = [
  recipe.metadata.servings && { label: 'serves', value: recipe.metadata.servings },
  // The label is the whole attribution: the value is the author's own `>> time:`, quoted, and
  // this says so. It read "about", which was the site hedging a number it had not worked out —
  // and put that word on the page twice, meaning something else again in the clock's "Needs you".
  recipe.metadata.time && { label: 'recipe says', value: recipe.metadata.time },
  { label: '', value: recipe.category },
].filter(Boolean) as { label: string; value: string }[];
```

`src/components/Timeline.astro:225–227`, comment only, no rendered change:

```
 * direction we do not have; "about" is the honest shape of the number. The chip above no longer
 * shares the word — it says "recipe says", because quoting the author is not hedging — so
 * "about" now means one thing on the page: a figure this panel worked out.
```

**Every string added, quoted, with its character count** — the acceptance criterion asks for this
list and this is all of it:

| string | chars | where | `voice.md` |
| --- | ---: | --- | --- |
| `recipe says` | **11** | the chip's label slot, `[slug].astro:42` | friend-at-a-kitchen-table ✓ · changes how you cook it ✓ (it says which total to plan around) · said once ✓ · two words, not a sentence ✓ |

Nothing else rendered was added, moved or removed. `site.css` was not touched — the chip label is
unstyled and `.chips` is `flex-wrap: wrap`, so a 6-character-longer label wraps and needs no rule.

## 2 · What a page reads now

`sourdough-boule`, the page the ticket said to hold in mind:

```
Bakery · serves 12 · recipe says 24 hr · Breads
…
The clock
Start to finish   at least 16 hr 15 min
                  1 of 5 steps gives no time
Needs you         about 45 min
```

`guacamole`, one of the 23 with no clock figures:

```
Taqueria · serves 4 · recipe says 15 min · Sauces and Gravies
…
The clock
Not one of its 4 steps is timed.
```

**What guacamole shows:** `recipe says 15 min` is a whole thing to read with nothing beside it. It
names a source and gives a number; it is not half of a comparison, so the page does not read as
missing its other half. (Its `.cook` file says `>> time: 15 min` — the site added `about` and now
adds nothing.)

---

## 3 · Neither figure moved

`figures.mjs` (source in §7) pulls, per slug, the chip's time text, the `Start to finish` `<b>`
and the `Needs you` `<b>` out of the built HTML. Run before and after against a 658-page build:

```
diff <(cut -f1,3,4 before-figures.tsv) <(cut -f1,3,4 after-figures.tsv)
  → empty. FIGURES: byte-identical across all 658 pages

paste before after | awk …
  figure rows changed:              0
  chip rows not a clean label swap: 0
  rows with no chip time:           0
```

So: **0 of 658 pages** changed either clock figure, and **658 of 658** chips changed by exactly
`about ` → `recipe says `, with the number itself untouched on every one. The 23 chip-only pages
record `-` in both figure columns before and after, so a page that gained or lost a stat block
would have shown as a changed row rather than being skipped.

Split, unchanged, before and after: **635** pages with both figures, **23** with the chip alone,
**0** with the clock alone.

## 4 · What it cost

```
                before     after    delta
mean              2823      2829       +6
median            2766      2772       +6
max               4474      4480       +6   (biryani, same page)
min               1566      1572       +6   (egg-cream, same page)
total        1,857,209 1,861,157    +3,948  = 658 × 6
```

**Six characters a page.** `about` (5) → `recipe says` (11). Every page pays it once because every
one of the 658 recipes carries a `>> time:`; nothing else moved, which is why the delta is
identical at every percentile.

The ten sentences S-005 deleted, grepped over the built site with
`measure-pages.mjs --count` (the ticket says six; T-005-02's review lists ten and a superset is
the safer check):

```
0  so both numbers are floors            0  counted as needing you only because
0  keep a sliver                         0  counted as time you are standing over it
0  a dotted one means                    0  two waits that overlap count once
0  The recipe itself says                0  of the steps that give a time
0  adds up to more hands-on              0  never puts a number on anything
```

**All ten at zero.** `The recipe itself says` is the one this ticket came closest to reinventing;
`recipe says` is a label in a chip, not that sentence in a panel of worked-out numbers, and the
grep says so.

Also grepped for the shape the constraint forbids: `worked out` **0**, `from the steps` **0**.
`the table` returns 658 and always did — it is the pre-existing mobile hint *"More to the right —
drag the table across"*, in `RecipeTable`/`CookModes`, untouched by this ticket.

## 5 · The suites

| | |
| --- | --- |
| `npm run verify` | **exit 0** — `all 658 file(s) draw a table`, 9 test files, **833 tests passed**, 682 pages built |
| `npm run verify:mobile` | see below |

**`verify:mobile` deviation.** The first run exited 2 without measuring anything, on
`check-overflow`'s own guard: *"dist/ changed while this was reading it — a build running
alongside, most likely."* That is exactly what it was — **T-006-02 is running concurrently and
edits `.cook` files, so its builds rewrite `dist/` under any reader.** The guard did its job: it
refused to report rather than reporting against a half-rewritten build. Re-run; result recorded in
`review.md` §Verification.

## 6 · Deviations from the plan

1. **`verify:mobile` needed a re-run** because of the concurrent ticket's builds. Not a defect in
   this change and not a change to the plan — the plan's step 5 is unchanged, it just ran twice.
2. **Nothing else.** No extra file, no CSS rule, no new test, no change to the two figures. The
   plan predicted mean 2829 and the delta at every percentile; both came out exactly.

## 7 · The instrument, so the numbers can be re-derived

`figures.mjs` lives in the attempt scratchpad rather than in `scripts/` — the ticket permits three
source files and none of them is a script, and the reusable half (`--count`, `--slug`) already
exists in `measure-pages.mjs`. Its method: for each slug in `src/generated/recipes.json`, read
`dist/<slug>/index.html`, take the `<li class="clay-chip">` entries inside `<ul class="chips">`
whose text carries a time unit, and the `<b>` inside each `.stat` whose `<dt>` is `Start to
finish` / `Needs you`; strip tags with no substitution, decode entities, collapse whitespace —
the same normalisation `measure-pages.mjs` uses, so the two agree on what a character is. Prints
`slug \t chip \t total \t hands-on`, one row per page, `-` where a figure does not render.

Reproduce with:

```
git stash && npm run build && node figures.mjs > before.tsv
git stash pop && npm run build && node figures.mjs > after.tsv
diff <(cut -f1,3,4 before.tsv) <(cut -f1,3,4 after.tsv)
```

## 8 · Commit

One, through `lisa commit-ticket`, carrying both files — the comment in `Timeline.astro` is only
true given the change in `[slug].astro`, so a commit with one and not the other would leave the
source contradicting itself.
