# T-005-05 · Research — the rows above and below

What a full-width prose row is, where its words physically live, what renders it, and what the
three finished tickets in front of this one already decided. Descriptive only.

---

## 1. What a prose row is, mechanically

`src/lib/tree.ts:119`

```ts
const isOpStep = (step: RawStep) => step.ingredients.length > 0 || step.refs.length > 0;
```

A step that uses no `@ingredient{}` and makes no `@&(~N)` reference earns no column. `buildTree`
(`tree.ts:127–133`) pushes it into `headers` before the first operation is seen and into
`footers` after:

```ts
const label = step.labelOverride ?? cleanLabel(step.rawLabel);
if (!isOpStep(step)) {
  (seenOp ? footers : headers).push(label ? label[0].toUpperCase() + label.slice(1) : '');
  continue;
}
```

Three facts fall out of those five lines, and all three matter to this ticket.

**(a) A prose row's words come from one of two places.** Either a `>> step.N:` metadata line
(`labelOverride`, wired at `scripts/normalise.mjs:132`) or the step's own paragraph run through
`cleanLabel`. Measured across all 393 rows:

| | from a `>> step.N:` line | from the paragraph |
| --- | ---: | ---: |
| headers | 109 | 177 |
| footers | 31 | 76 |
| **over the 120 cap** | **124** | **108** |

So a majority of the rows this ticket must shorten are edited on a metadata line, not in the
body. That is a different edit with a different blast radius, and it is the single most
load-bearing fact in this research.

**(b) `cleanLabel` deletes every comma.** `src/lib/label.ts:15–16`:

```ts
.replace(/,\s*and\b/gi, ',')    // "a, b, and c" -> "a, b, c"
.replace(/\s*,\s*/g, ' ')       // the separators themselves
```

That was written for operation cells (`"fold in @flour{}, @cocoa{}"` → `fold in`) and it runs on
prose rows too, because line 128 is one expression for both branches. Confirmed on the built
page:

```
dist/boston-baked-beans-slow-cooker/index.html
A crock is the closest vessel to a bean pot there is this is the one bean dish on the shelf …
```

The file says *"…there is, and this is the one bean dish…"*. The comma and the `and` are gone on
the page. **Every paragraph-sourced prose row in the collection is rendered as a comma-less
run-on**, and no one has noticed because nobody reads them. A row written on a `>> step.N:` line
is not affected — `labelOverride` skips `cleanLabel` entirely.

**(c) The step index is positional and `>> step.N:` is absolute.** `normalise.mjs:116,132`:
`index = steps.length`, `metadata['step.' + (index + 1)]`. A paragraph counts as a step. So
**deleting a prose row renumbers every step after it**, and every `>> step.N:` line below the
deletion silently points one step too far. `@&(~N)` references are written relatively in the
source and are resolved by the parser, so they survive; the metadata keys do not.

## 2. Where a row is printed

| Surface | headers | footers |
| --- | :---: | :---: |
| `RecipeTable.astro:26` / `:63` — full-width `<td colspan>` | ✓ | ✓ |
| `CookModes.astro:311–320` — the *Before anything else* prep group | ✓ | — |
| `CookModes.astro:190` / `:224` — `kind: 'note'` rows in cook order | ✓ | ✓ |
| `[slug].astro:132` — inside the collapsed *See how it is written* | ✓ | ✓ |

Counted in the built HTML: `boston-baked-beans-slow-cooker` prints its header **4 times** (3
rendered + 1 in the collapsed raw source), `fresh-egg-pasta` prints its footer **3 times** (2
rendered + 1 raw). So the ticket's *"three times on one page"* is exact for a header and one too
many for a footer, which renders twice. The multiplier argument is unaffected — a footer is still
the longest row type in the collection by a factor of two.

`CookModes.astro:335` runs `noteIcon(text)` → `matchOperation(text)` over the row's words, so the
icon a note row gets is derived from its wording. Shortening a row can change or remove its icon.
Not a tree change; worth watching in the diff.

## 3. The numbers as they stand today

Measured with `.lisa/attempts/T-005-05/1/work/dump-rows.mjs`, which calls the same `buildTree`
the page does, over `src/generated/recipes.json`:

```
headers   count  286  mean  133.9  p50   80  p90  291  max  730  over 120:  126
footers   count  107  mean  270.7  p50  255  p90  454  max  588  over 120:  106
all       count  393  mean  171.1  p50  150  p90  378  max  730  over 120:  232
files carrying a row over 120: 183
```

`npm run check` agrees independently: `prose row 232`.

**161 rows are already at or under the cap — 160 headers and 1 footer.** The header field has two
populations and the cap sits in the hollow between them, exactly as T-005-01 measured. The footer
field has one population and it is entirely above the cap.

Small discrepancy worth recording: the story and the ticket say the longest header is 757
characters; measured through `buildTree` it is 730. The difference is `cleanLabel` — 27
characters of commas and `and`s the reader never sees. Every number in this ticket is the
rendered number, matching `check-recipes.mjs`, which is the same convention T-005-01 §"Two
counting conventions" settled on.

By folder, the 232 over-cap rows:

```
  70  stews-and-braises      15  vegetables-and-sides     6  noodles        4  pizzas
  47  soups                  13  salads                   6  pasta          4  smoked-and-grilled
  26  rice-beans-and-grains   9  fried-and-crispy         5  eggs           3  flatbreads-and-pancakes
                              7  sauces-and-gravies       4  custards       2  breads · dumplings · pickles
                              6  dressings-and-dips                         1  spice-blends
```

The ticket predicted 61 / 28 / 22 for the top three; the true numbers are 70 / 47 / 26. The
ticket counted *recipes*, this counts *rows*, and several files carry two.

## 4. What the three finished tickets left behind

### T-005-01 — the rule and the ruler

- `docs/knowledge/voice.md` is the written rule; `prose row` cap is **120**.
- `scripts/check-recipes.mjs:69–110` measures it. `CAPS_FAIL_BUILD = false` at line 67 — this
  ticket does not flip it, T-005-07 does.
- `measure()` reads `tree.headers` / `tree.footers`, so the checker cannot disagree with the page.
- Its `report.txt`, referenced by the ticket as *"T-005-01's ranked report"*, **was not published
  to `docs/active/work/T-005-01/`** — only the six markdown artifacts are there. `npm run check`
  regenerates it in full; that is the substitute and it is byte-equivalent by construction.

### T-005-03 — the destination

`src/data/counters.json` sections may carry `notes`, a list of `{ of?, note }`. Validated in
`scripts/parse-recipes.mjs` against a 120-character cap and against the section's own `items`.
Rendered by `src/pages/menu/[counter].astro` as `.menu-note` (group) and `.item-note` (per dish).

**Five notes exist. Four were moved off four recipes and must not be moved again**
(`T-005-03/progress.md` §Step 8): `boston-baked-beans-slow-cooker`,
`baked-turkey-wings-slow-cooker`, `new-england-boiled-dinner-slow-cooker`,
`soy-sauce-chicken-slow-cooker`. In every case it was **sentence 1 of the header row**, and the
progress file quotes the exact clause taken and says the rest is cooking and stays. The fifth
note is a group note on *Braises, left alone all day*, written for the section and owed by nobody.

It also hands over **27 further shelf-talk rows** with the counter and section each would land at,
and two warnings: `balti` and `madras` are shelved at two counters each and their comparison is
only true at one; every Instant Pot row is the mirror of a slow-cooker row for the same dish
(`collard-greens`, `corned-beef`, `braised-short-ribs`, `oxtails` all have both), so the same
sentence must not be written from both sides.

Two open concerns land on this ticket by name: `src/lib/counters.ts` still types a section as
`{ title, items }` and does not know about `notes`; and `voice.md` has no row for a menu note.
Both are recommendations, neither is in this ticket's file list.

### T-005-04 — the line underneath

373 `.cook` files, exactly one line changed in each, `slack reason` 304 over cap → 0, mean 222 →
112, max 151. Every one of the 397 declared recipes now has a `>> slack:` line that names a
specific failure and when it happens. `git status --porcelain recipes/` is empty and `npm run
check` reports `slack reason 0`, so the tree this ticket starts from is clean.

**This is the field a prose row is most likely to repeat**, because both were written to explain
the same anxiety and T-005-04 has just made the slack line the sharper of the two.

## 5. What this ticket may and may not touch

From the ticket's Scope and from T-005-06's, which is the next link in the same chain:

| Thing | Owner |
| --- | --- |
| `>> step.N:` line that renders as a prose row | **this ticket** |
| paragraph of a step with no ingredients and no refs | **this ticket** |
| paragraph of a step that has a `>> step.N:` line | T-005-06 |
| `>> slack:` | T-005-04, done |
| operation cell labels | protected by the story, nobody |
| `src/data/counters.json` notes | this ticket, when a sentence moves |

T-005-06 states its own boundary as *"Do not remove a `>> step.N:` line, do not add one, do not
change one"* and *"Every operation cell label in the collection is byte-identical to before."*
Those two commitments are compatible with this ticket editing the `step.N` lines that render as
full-width rows, because a full-width row is not an operation cell — but the overlap is real and
narrow, and it is the thing a reviewer should check.

One conflict of wording to record rather than resolve here: this ticket's Scope says T-005-06
owns *"the bodies of steps that have ingredients"*, while T-005-06 itself claims every body under
a `>> step.N:` line, including steps with no ingredients (T-005-01 open concern 2 measured that
as 140 extra steps in 109 files). Under T-005-06's own reading, the paragraph sitting beneath a
`step.N`-sourced prose row belongs to T-005-06 and not here. That is the reading that keeps both
tickets consistent.

## 6. Constraints the acceptance criteria impose

- **The merge tree must be provably unchanged.** `tree.root.col` per recipe, and the per-op
  `col:row:rowSpan`, are derivable from `src/generated/recipes.json` — `dump-rows.mjs cols`
  prints one line per recipe. A `diff` of before against after is the proof.
- **`findTilingErrors` still holds** — `src/lib/layout.ts`, already asserted by
  `src/lib/layout.test.ts` and run by `npm run check` over all 658 files.
- **`npm run verify:mobile` passes.** It begins with `npm run build`, and T-005-03 recorded that
  a concurrent build makes it exit 2 with *"Nothing above is evidence either way"* — a guard, not
  a failure. Both `check-overflow.mjs` and `check-touch.mjs` accept `--root` so it can be run
  against a frozen copy.
- **Only `.cook` prose rows and `src/data/counters.json`.** No component, no `src/lib`, no other
  metadata line, no step body.

## 7. Assumptions carried into Design

1. The rendered length — post-`cleanLabel`, as `check-recipes.mjs` measures — is the number the
   cap governs. Every count in this ticket uses it.
2. A prose row that exists today should still exist after, unless deleting it is worth
   renumbering the `>> step.N:` lines beneath it. §1(c) is why.
3. Because `cleanLabel` eats commas, a rewritten paragraph-sourced row should be written without
   mid-sentence commas. This costs nothing and is the only way the row reads as English.
4. `T-005-03/progress.md` §Step 8 is authoritative on which sentences have already moved. Four,
   all sentence 1 of a header row.
5. The four moved sentences' rows still exist and are still over cap — `boston-baked-beans-slow-cooker`
   is still 730. T-005-03 copied, it did not cut. Striking those clauses is this ticket's job.
