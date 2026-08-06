# T-005-06 · Research — the prose nobody reads

What exists, where it lives, and what an edit to a step body can and cannot touch. No
proposals here; the decisions are in `design.md`.

---

## 1. The mechanism, read off the code

Three files decide whether a step's written words reach a reader.

**`scripts/normalise.mjs:131-133`** — for every step it builds two labels and picks one:

```js
const rawLabel = stripIngredients(items, recipe);
const labelOverride = metadata[`step.${index + 1}`] ?? null;
const operationLabel = labelOverride ?? rawLabel;
```

`rawLabel` is the step's own paragraph with the ingredient names taken out. Cookware names,
timer quantities and inline quantities stay in it. It is kept on the step object whether or
not it is used.

**`src/lib/tree.ts:128`** — the tree takes the same choice again:

```ts
const label = step.labelOverride ?? cleanLabel(step.rawLabel);
```

An op step (`ingredients.length > 0 || refs.length > 0`, `tree.ts:119`) puts that label in an
operation cell. A step with neither becomes a full-width prose row (`tree.ts:131`).

**`src/pages/[slug].astro`** — renders the tree. Nothing on the page reads `rawLabel` when
`labelOverride` is set. The only survival is the collapsed `See how it is written` block,
which prints the `.cook` source verbatim, markup included.

So: **a step with a `>> step.N:` line has a body that is parsed, measured, stored in
`src/generated/recipes.json` and rendered nowhere.**

## 2. How much of it there is

Measured against the working tree at `7eb9baa` — after T-005-04 and T-005-05 landed, which is
what the ticket asks for.

```
$ node dump-bodies.mjs stats
overridden steps: 2782 in 637 recipes
characters total: 278,833
mean 100.2  p50 76  p90 215  max 535
over 150: 656
  of which operation steps 2642, prose rows 140
  over 150: operation 551, prose 105
```

The ticket's headline is *1501 steps across 474 recipes, 228,000 characters*. T-005-01
already reconciled this (`research.md:93`): the plain definition gives 2642 op steps / 637
files / 250,382 characters, and the story's figure is the same set with a 60-character floor.
This run adds the 140 overridden **prose-row** steps that T-005-01 counted separately, which
is why the total is 2782 / 278,833 rather than 2642 / 250,382.

Both counting rules describe the same phenomenon. The plain one is larger, not smaller.

`npm run check` agrees from a second code path: `step body 656`.

### By sentence count — the shape of the essay

```
$ node split-bodies.mjs counts
 1662  under 100 · 1 sentence
   25  under 100 · 2+ sentences
  276  100-150 · 1 sentence
  161  100-150 · 2+ sentences
   70  over 150 · 1 sentence
  586  over 150 · 2+ sentences
```

**844 bodies are either over the cap or longer than one sentence.** The other 1938 are a
single sentence under 150 characters — the mechanical line that names the ingredients, which
T-005-01 measured at p50 71 / p90 131. That is not an essay; it is the step.

Of the 656 over-cap bodies, **584 end in a sentence carrying no cooklang markup at all.**
That is the defence, and it is structurally identifiable before anyone reads a word of it.

### Where it sits

```
$ node dump-bodies.mjs cats          (folder, steps, over 150, chars, files)
soups                    340   89   38,119   66
stews-and-braises        437   75   39,091  101
rice-beans-and-grains    282   68   28,462   55
salads                   110   58   16,086   23
fried-and-crispy          96   37   13,530   20
smoked-and-grilled       102   37   13,706   22
vegetables-and-sides      86   35   11,690   18
dumplings-and-rolls       76   32   10,676   15
sauces-and-gravies       169   31   13,692   41
dressings-and-dips       168   29   12,796   40
… 17 more folders, 165 over-cap bodies between them
```

27 folders. No folder is clean; `cakes-and-loaves` is the only one with nothing over cap.

## 3. What one body actually looks like

`recipes/vegetables-and-sides/charred-broccoli.cook`, step 2, as it sits in the file:

```
Cut @broccoli{1 1/2%lb}(700 g; crowns and peeled stalks) top to bottom into spears so each
one keeps a flat cut face, then spread them on a towel and ~dry{10%min}. Washed broccoli
carries more water in its florets than you would believe; put it wet on a hot pan and the
first four minutes are spent boiling that off, which is four minutes the pan is not
browning anything.
```

`>> step.3: dry 10 min, spread out` is what the table draws. The first sentence holds the
ingredient, its note, the timer, and the one thing the label cannot say — *spears, flat cut
face*. The second sentence argues with recipes that do it differently.

The ticket's own example, `soups/tonkotsu-broth-instant-pot.cook` step 3, splits the same way:
two instruction sentences around one comparison to the stovetop version.

**This is the general shape.** Sentence one is the step; the tail is the defence.

## 4. The data that lives inside the bodies

`normalise.mjs:135-177` walks the step's items. Everything it finds is real:

| Token in the body | Becomes | Reached by |
| --- | --- | --- |
| `@name{qty}(note)` | an ingredient leaf row, a shopping-list line | `steps[].ingredients`, `ingredientNames` |
| `@&(~1)thing{}` | **an edge in the merge tree** | `steps[].refs` → `tree.ts:156` |
| `~name{qty}` | a timeline bar, the clock | `steps[].timers` → `schedule.ts` |
| `#cookware{}` | the equipment list | `recipe.cookware` |
| `@x{2%cups}` inline | text inside `rawLabel` only | — |

Two of these are wider than the ticket says.

- **`@&(~1)ref{}` is not an ingredient — it is a tree edge.** Losing one, or reordering two
  in the same step, moves columns (`tree.ts:151-171`, children are wired in ref order then
  ingredient order, and `assignRows` sorts on column). The ticket's arithmetic proof —
  ingredient and timer counts — would not catch a reordering.
- **`#cookware{}` is collected into `recipe.cookware`** and printed. The ticket names
  ingredients and timers; cookware belongs in the same invariant.

So the safe invariant is stronger than the ticket's: **the ordered token sequence of a body
is unchanged**, not merely the counts.

## 5. Locating a body in the file

There is no line number anywhere in the parsed output; a step knows only its index. The file
is metadata lines, then blank-line-delimited paragraphs.

`map-steps.mjs` tests the obvious mapping — the Nth non-metadata block is step N — against
the parser over the whole collection, by count **and** by content (every ingredient name the
parser found in step N must appear in block N):

```
$ node map-steps.mjs
658 file(s) checked, 0 disagreement(s).
```

No file uses a `= section =` header or a `--` comment in a way that breaks it. The mapping
holds; it is not an assumption.

## 6. Splitting a body into sentences

A body contains full stops that are not sentence ends: `@attar{2%cups}(475 mL; straight from
the fridge)`, `450°F (230°C)`, `20 min.`. `split-bodies.mjs` masks every cooklang token to a
same-length opaque run first, then splits on a terminator followed by whitespace and a
capital, digit or opening quote, with an abbreviation guard.

Verified as a round trip over every in-scope body, not a sample:

```
$ node split-bodies.mjs check
2782 bodies, 0 splitter failure(s).
```

Two properties checked per body: rejoining the sentences reproduces the paragraph, and the
token sequence survives the split. Both are what an applier would rely on.

## 7. What is already fixed and must not move

`npm run check`'s cap table (`check-recipes.mjs:41-58`) has five fields. Three are settled:

| Field | Cap | State | Owner |
| --- | ---: | --- | --- |
| operation cell | 70 | **0 over** — the surface that works | nobody; leave alone |
| prose row | 120 | **0 over** — T-005-05 | done |
| slack reason | 200 | **0 over** — T-005-04 | done |
| **step body** | **150** | **656 over** | **this ticket** |
| ingredient note | 80 | 17 over | unowned residue of T-005-01 |

`CAPS_FAIL_BUILD = false` at `check-recipes.mjs:67`, and the comment names T-005-07 as the
ticket that flips it. That is what makes `step body 0` the number this ticket is aiming at
rather than merely "smaller".

T-005-01's own report is the baseline the ticket asks to be beaten. `report-before.txt` in
this directory is the current run, captured before any edit.

## 8. The boundary, stated as code

A step **without** an override has its body derived into the label (`tree.ts:128`,
`normalise.mjs:133`). Editing that body edits the table. Those steps are out of scope, and
the distinction is mechanical: `step.labelOverride !== null`.

The consequence worth stating plainly: for a step **with** an override, an edit to the body
can only change the page in three ways —

1. by changing the token sequence (ingredients, refs, timers, cookware);
2. by changing the number of paragraphs in the file, which renumbers every later step and
   silently re-points every `>> step.N:` line below (`normalise.mjs:112-119`);
3. by emptying a body so a step stops existing.

All three are structural and all three are checkable before a byte is written. Nothing else
an edit does to a body is visible anywhere.

## 9. Prior art in this chain

T-005-04 and T-005-05 both landed the same division of labour and both recorded it as the
thing that made the work safe: **the judgement is written by hand into a table; the edit is
made by a tool that validates every row against the current files before writing anything,
and aborts whole rather than half-applying.**

Their toolchains are on disk at `.lisa/attempts/T-005-04/1/work/` and
`.lisa/attempts/T-005-05/1/work/` — `apply-slack.mjs`, `apply-rows.mjs`, `dump-rows.mjs`.
`dump-rows.mjs cols` is the tree-identity proof this ticket inherits: one line per recipe
carrying root column count, leaf count, header count, footer count and every operation's
`stepIndex:col:row:rowSpan`.

Both tickets also rejected a shortening heuristic on measured evidence, T-005-04 on 64 of 117
slack lines and T-005-05 on its first-sentence rule. The same warning applies here and the
data agrees with it: 70 of the 656 over-cap bodies are a **single** sentence, so "drop
everything after the first full stop" would leave every one of them untouched and over cap
while claiming the job was done.

## 10. Assumptions and constraints carried into Design

1. **`src/generated/recipes.json` is not tracked by git** (`git ls-files` returns nothing).
   It is a build product of `npm run recipes`, so the before/after diff the ticket asks for
   has to be captured to files in this work directory, not read out of git.
2. **The collection is committed and the tree is clean** apart from three untracked ticket
   and story markdown files. The baseline is `7eb9baa`.
3. **658 recipes, 637 of which carry at least one override.** The ticket says 474; that is
   the 60-character-floor count. Whichever floor is used, every category is affected.
4. **A comma in a body is invisible.** `cleanLabel` (`label.ts:15-16`) deletes commas, which
   is why the measured bodies read as run-ons. It affects the measured length by exactly the
   comma count and nothing else — the file keeps its commas.
5. **`readTimers(timers, operationLabel)` at `normalise.mjs:179` reads the *override*, not
   the body**, when one is present. So a timer's `attention` reading cannot move under a body
   edit. Confirmed by reading the call site.
6. **No test exists that would catch a body edit**, because no test asserts on body text. The
   833 tests under `src/lib/` cover parsing and tiling, which is exactly the property that
   must not move — they are the right suite, and they are indifferent to prose.
