# T-005-06 · Review — the prose nobody reads

**844 step bodies edited across 358 `.cook` files in nine commits. 106,830 characters cut.
`step body 656 → 0`.** Every operation cell label in the collection is byte-identical to before
this ticket, every ingredient, timer, quantity, reference and piece of cookware is unchanged
across all 658 recipes, and no `>> step.N:` line was added, removed or changed. All four proofs
are empty diffs, not small ones.

---

## 1. What changed

| Path | Action | Extent |
| --- | --- | --- |
| `recipes/**/*.cook` | modified | 358 files, 844 body paragraphs rewritten in place |

Nothing created, nothing deleted, and nothing outside `recipes/`:

```
$ git diff --name-only 7eb9baa..HEAD | wc -l                       358
$ git diff --name-only 7eb9baa..HEAD | grep -v '\.cook$' | wc -l     0
```

No metadata line, no component, no `src/lib/`, no `scripts/`, no data file. `src/data/counters.json`
was deliberately not touched — see §7.

Nine commits, one per shelf group:

```
b87f2db  Cut the soup pot's step bodies to what happens in the pot            121 bodies, 45 files
5063308  Cut the braise shelf's step bodies to the pot and the failure         95 bodies, 58 files
44491e9  Cut the grain shelf's step bodies to what happens to the rice         73 bodies, 34 files
29a5f33  Cut the cold bowl's step bodies to the knife and the dressing         67 bodies, 23 files
2bb3874  Cut the fryer and the fire's step bodies to the heat and the moment   92 bodies, 33 files
d7c95ca  Cut the sides and the dumpling table to the hand and the pan          82 bodies, 32 files
3473535  Cut the pouring shelf's step bodies to the pan and the jar           117 bodies, 46 files
461c864  Cut the flour shelf's step bodies to the dough and the oven           93 bodies, 42 files
78310a9  Cut the last shelves' step bodies to what the hand does              104 bodies, 45 files
```

Working tree clean of ticket-owned files: `git status --porcelain` shows only the untracked
story, ticket and work markdown, no `recipes/` and no `src/`.

---

## 2. The main safety property

**Every operation cell label is byte-identical.**

`dump-bodies.mjs labels` prints one line per node per recipe in tree order — every operation
label *and* every full-width header and footer row, 3470 lines:

```
$ diff labels-before.tsv labels-after.tsv ; echo $?
0
```

Empty. This is wider than the criterion asks: it covers the prose rows T-005-05 set as well as
the operation cells, so a body edit that leaked into a full-width row would show here too.

It is also the positive proof of a second criterion — **steps without an override are
untouched.** A step with no `>> step.N:` line has its label *derived from its body*
(`tree.ts:128`), so editing one would move a label. The diff being empty is therefore evidence,
not only an argument about the applier. (The applier's own guard is the belt: a judgement naming
a step with no override is refused before anything is written, and that refusal was tested.)

---

## 3. The arithmetic proof

**Ingredient counts, timer counts and quantities identical across all 658 recipes.**

`dump-bodies.mjs data` prints, per step, the refs in order and every ingredient as
`name|quantity|note|amount.value|amount.unit`, every timer as `name|text|minutes|attention`,
plus each recipe's whole `cookware` and `ingredientNames` lists — 4786 lines:

```
$ diff data-before.tsv data-after.tsv ; echo $?
0
```

Empty. Three parts of that are wider than the ticket asks, each for a reason found in Research:

- **`@&(~1)ref{}` in order.** An intermediate reference is a *tree edge*, not an ingredient
  (`tree.ts:156`). Losing one, or reordering two inside a step, moves columns — and a count of
  ingredients would not notice.
- **`#cookware{}`.** It lives in the bodies too and is printed on the page.
- **`amount.value` / `amount.unit`.** A different code path from the display quantity, and the
  one the shopping list adds up.

Backed at the file level: the applier compares the ordered **token sequence** of every body
before and after writing, and re-parses the whole file and deep-compares every step. A mistyped
quantity dies there, naming the file.

---

## 4. The other two structural criteria

**No `>> step.N:` line added, removed or changed** — `meta-before.tsv` / `meta-after.tsv` carry
every `step.N` key and its value for all 658 files:

```
$ diff meta-before.tsv meta-after.tsv ; echo $?
0
```

**The merge tree did not move** — `cols`, one line per recipe carrying root column count, leaf
count, header count, footer count and every operation's `stepIndex:col:row:rowSpan`:

```
$ diff cols-before.tsv cols-after.tsv ; echo $?
0
```

All four diffs were run **after every group**, not only at the end — thirty-six empty diffs
across nine commits.

---

## 5. The measurement

| | Before | After |
| --- | ---: | ---: |
| Overridden steps | 2782 in 637 recipes | 2782 in 637 recipes |
| Characters in those bodies | **278,833** | **172,003** |
| Mean / p50 / p90 / max | 100.2 / 76 / 215 / 535 | **61.8 / 56 / 121 / 150** |
| Over the 150 cap | **656** | **0** |

Across the **844 bodies actually edited**: **169,922 → 63,092 characters, 106,830 cut (63%).**

The over-cap report, both totals the criterion asks for:

```
T-005-01 wrote it:   1209 field(s) over cap in 499 file(s) — 92,947 characters over.
Before this ticket:   673 field(s) over cap in 329 file(s) — 48,733 characters over.
After this ticket:     17 field(s) over cap in  13 file(s) —    500 characters over.

by field, after:  operation cell 0 · step body 0 · prose row 0 · slack reason 0 · ingredient note 17
```

**The whole of the remaining report is the 17 ingredient notes**, which are T-005-01's unowned
residue and out of this ticket's scope. Four of the five cap fields now read zero.

---

## 6. Five worked examples, in full

**1 · `soups/tonkotsu-broth-instant-pot.cook` step 3** — the ticket's own example. `>> step.3:
cook at high pressure 90 min`. 273 → 63 characters.

> **Before:** Return `@&(~1)scrubbed bones{}` to the pot with `@water{2 1/2%qt}(2.4 L)`, lock the
> lid and `~pressure cook{90%min}` at high pressure. *Less water than the stovetop version on
> purpose: nothing evaporates under pressure, so the eight-hour recipe's six quarts would come
> out thin here. Keep the pot no more than two thirds full whatever size it is.*
>
> **After:** Return `@&(~1)scrubbed bones{}` to the pot with `@water{2 1/2%qt}(2.4 L)`, lock the
> lid and `~pressure cook{90%min}` at high pressure.

The cut sentence defends the water quantity against the stovetop version — a comparison the
reader did not make, and the quantity itself is right there in the markup.

**2 · `vegetables-and-sides/charred-broccoli.cook` step 2** — `>> step.2: cut into spears with
one flat face, air-dry 10 min`. 310 → 102.

> **Before:** Cut `@broccoli{1 1/2%lb}(700 g; crowns and peeled stalks)` top to bottom into
> spears so each one keeps a flat cut face, then spread them on a towel and `~dry{10%min}`.
> *Washed broccoli carries more water in its florets than you would believe; put it wet on a hot
> pan and the first four minutes are spent boiling that off, which is four minutes the pan is
> not browning anything.*
>
> **After:** Cut `@broccoli{1 1/2%lb}(700 g; crowns and peeled stalks)` top to bottom into spears
> so each one keeps a flat cut face, then spread them on a towel and `~dry{10%min}`.

*Spears, flat cut face* survives — it is the technique the 70-character label cannot hold. What
goes is the argument for the ten minutes the timer already names.

**3 · `vegetables-and-sides/roasted-brussels-sprouts.cook` step 3** — `>> step.3: roast 425°F
(220°C) 22 min, cut side down`. 312 → 84.

> **Before:** Spread `@&(~1)oiled sprouts{}` cut side down on a `#sheet pan{}` heated with the
> oven and `~roast{22%min}` at 425°F (220°C). *Twenty-two minutes untouched: the cut face goes to
> mahogany and the round back stays green and firm, which is the whole contrast. Stir them at the
> halfway mark, as most recipes tell you to, and you get thirty-two evenly beige sprouts.*
>
> **After:** Spread `@&(~1)oiled sprouts{}` cut side down on a `#sheet pan{}` heated with the
> oven and `~roast{22%min}` at 425°F (220°C).

The second sentence opens with a doneness cue and ends arguing with other recipes. *Untouched*
is already in the label's `cut side down` and in the first sentence's `spread`; the argument is
rule 2 and goes.

**4 · `rice-beans-and-grains/boston-baked-beans-instant-pot.cook` step 4** — the largest single
cut in the ticket. `>> step.4: stir the molasses in now, not before — 10 min at high pressure`.
342 → 39.

> **Before:** Stir `@molasses{1/3%cup}(80 mL)`, `@dark brown sugar{1/4%cup}(50 g)`,
> `@dry mustard{1%tsp}`, `@cider vinegar{1%Tbs}` and `@kosher salt{1 1/2%tsp}` into
> `@&(~1)beans{}`, lock the lid again and `~pressure cook{10%min}`. *This is why it is two legs
> rather than one: molasses is sugar and vinegar is acid, and both of them stall a dry bean from
> softening. In at the start they give you chalky beans at forty minutes and chalky beans at
> sixty, with no time that works. In after the beans are cooked, they need only long enough to
> go in.*
>
> **After:** Stir `@molasses{1/3%cup}(80 mL)`, `@dark brown sugar{1/4%cup}(50 g)`,
> `@dry mustard{1%tsp}`, `@cider vinegar{1%Tbs}` and `@kosher salt{1 1/2%tsp}` into
> `@&(~1)beans{}`, lock the lid again and `~pressure cook{10%min}`.

Three sentences defending the step's existence. The instruction they defend — *now, not before* —
is the `step.N` line, which is what the reader actually sees.

**5 · `soups/congee-instant-pot.cook` step 2** — a `rewrite`, not a keep-mask, because the
sentence had to be cut inside itself. 344 → 129.

> **Before:** Let `@&(~1)pot{}` `~natural release{20%min}` until the pin drops on its own. **Do
> not open the valve.** *A pot of congee under pressure is thick starch with liquid trapped
> through it, and* venting it sends a jet of scalding porridge out of the top *— this is a burn,
> not a texture note. The porridge also finishes thickening while the pressure falls, so the
> release is part of the cooking.*
>
> **After:** Let `@&(~1)pot{}` `~natural release{20%min}` until the pin drops on its own. Do not
> open the valve: venting sends a jet of scalding porridge out of the top.

This is the case the design's fourth rule exists for. *Do not open the valve* is an instruction
and *a jet of scalding porridge* is what happens if you get it wrong — the story says a cook
reads exactly those two kinds of sentence. Both stay; the mechanism, the aside about texture and
the note about thickening go.

All 844 before/after pairs are in `record.tsv`, one row each, with the text in full.

---

## 7. Scope: what was read, and what was not

**844 of the 2782 overridden bodies were read and judged. 1938 were not, and the boundary is
stated rather than implied:**

> In scope: every body over the 150-character cap, **or** made of more than one sentence.
> Out: the 1938 that are a single sentence at or under the cap.

The claim behind leaving those is measured: a defence is a second sentence, and T-005-01
measured the mechanical first sentence of a body at p50 71 / p90 131. One line checks it:

```
$ node split-bodies.mjs counts | grep '1 sentence'
 1662  under 100 · 1 sentence
  276  100-150 · 1 sentence
```

**No folder was skipped.** All 27 folders carrying an overridden body were worked. The ticket's
fallback — finish whole categories rather than a scattering — was kept available and never
needed.

**`src/data/counters.json` was deliberately not touched.** T-005-05 relocated shelf talk to the
counter menus; this ticket could not, because the last acceptance criterion says no data file.
Sentences that would have been worth relocating are named in `findings.md` §3d and recoverable
in full from `record.tsv`.

---

## 8. Findings, nothing acted on

`findings.md` in this directory.

- **Four bodies would now make a good label on their own.** Not 234 — a body carrying
  `@ingredient{}` markup renders as a fragment (`rinse and 2 hr`), so the test requires it to
  render whole. All four are prose rows whose `step.N` line T-005-05 set deliberately.
  **Recommendation: leave them.**
- **46 prose-row bodies came out as a fragment of context**, because a body may not be emptied
  (deleting a paragraph renumbers every later `step.N` line). Costs a reader nothing: for a
  prose-row step the `step.N` line *is* the row on the page, unchanged.
- **The 17 over-cap ingredient notes are now the entire remaining report**, and **T-005-07 flips
  `CAPS_FAIL_BUILD = true`, which will fail on them.** Nobody owns them. This is the most
  actionable item in the ticket.

---

## 9. Verification, run in this attempt

| Criterion | Command | Result |
| --- | --- | --- |
| operation cell labels byte-identical | `diff labels-before.tsv labels-after.tsv` | **empty, exit 0** |
| ingredients, timers, quantities identical | `diff data-before.tsv data-after.tsv` | **empty, exit 0** |
| no `>> step.N:` line moved | `diff meta-before.tsv meta-after.tsv` | **empty, exit 0** |
| merge tree unchanged | `diff cols-before.tsv cols-after.tsv` | **empty, exit 0** |
| every body under cap | `npm run check` | `step body 0` |
| every file still draws a table | `npm run check` | `all 658 file(s) draw a table.` |
| block mapping still holds | `node map-steps.mjs` | `658 file(s) checked, 0 disagreement(s)` |
| sentence split still round-trips | `node split-bodies.mjs check` | `2782 bodies, 0 splitter failure(s)` |
| the suite and the build | `npm run verify` | **9 files, 833 tests passed**, 682 pages built, exit 0 |
| only `.cook` step bodies changed | `git diff --name-only` | 358 `.cook`, 0 others |

The two self-checks were re-run **against the edited tree**, so the mapping and the split are
proved on the files as they end up, not only as they started. Full logs: `verify.log`,
`report-before.txt`, `report-after.txt`.

---

## 10. Test coverage, and the gap

**No new vitest file, and it is a decision** — the same one T-005-01, T-005-03, T-005-04 and
T-005-05 made. This ticket ships no code that runs in the site. The 833 existing tests under
`src/lib/` cover parsing, labelling and tiling — exactly the properties that must not move — and
they pass.

Four layers of check ran, narrowest first:

| Layer | Scope | Catches |
| --- | --- | --- |
| tool self-checks | 658 files, 2782 bodies, before any write | a bad block mapping, a split that loses a token |
| applier guards | one row, one file, in memory before writing | a mistyped quantity, a dropped ref, a keep index off the end, a step with no override |
| per-group diffs | the whole collection, after each of nine groups | anything the guards let through, at the group that caused it |
| `npm run verify` | check + parse + 833 tests + build | a file that no longer draws a table, a page that no longer builds |

Every applier refusal path was tested with a deliberately bad table **before** any group table
was written; the five refusals are quoted in `progress.md` §1.

**The gap, stated plainly: no check can tell whether a shortened body still says the useful
thing.** 844 bodies were judged by hand. The mitigation is that the judgement is data —
`record.tsv` carries the original and the rewrite side by side for all 844, `patch-<group>.tsv`
carries the 121 places the generated proposal was overruled, and `prop-<group>.tsv` carries the
proposal itself so the overrule is diffable. A reviewer who disagrees with a call can find it in
one `grep`. That is the deliverable; it is not a substitute for a human reading it.

---

## 11. Open concerns

1. **The 17 ingredient notes will fail T-005-07's build.** Out of scope here and unowned since
   T-005-01. Named in T-005-05's review too. Somebody has to take them before
   `CAPS_FAIL_BUILD` flips. **This is the one thing worth acting on next.**

2. **723 of the 844 judgements accepted a generated proposal.** The proposal is *keep the first
   sentence and every sentence carrying markup*; it was read against the body in every case and
   overruled 121 times. It is nonetheless a rule, and a reviewer who wants to audit the ticket
   should audit those 723 rather than the 121 — the 121 are where the attention already went.
   `record.tsv` filtered on `how` starting `keep` is the list.

3. **`npm run verify:mobile` was not run.** Nothing here changes a rendered pixel — the `labels`
   diff is empty, so every string on every page is the string that was there before. The one
   surface that shows a body at all is the collapsed `See how it is written` block, which prints
   `.cook` source and got *shorter*. T-005-05 recorded that the overflow scan misreads a `dist`
   being written concurrently, which is the other reason not to run it for a no-pixel change.
   Recorded rather than claimed passing.

4. **113 bodies were retyped rather than sliced.** That is where a silent error could live. The
   token-sequence guard makes a changed quantity impossible, and the re-parse guard makes a
   changed ingredient, ref, timer or metadata line impossible — but neither can catch a rewrite
   that is grammatically fine and factually wrong about something carrying no markup. They are
   `how = rewrite` in `record.tsv`, 113 rows, and they are the shortest useful read in the
   ticket.

5. **Group 3 was applied with one body still 6 characters over cap**, caught before the commit
   and fixed by a one-row follow-up table. Recorded in `progress.md` rather than tidied away.
   No other group applied over cap, and the final report reads `step body 0`.

6. **Nothing here is a blocker.** No body required losing a fact with nowhere to go, all four
   proof diffs are empty, and `npm run verify` passes.

---

## 12. What a human should look at

In order, if time is short:

1. **`record.tsv`, filtered to `how = rewrite`** — 113 rows where text was written rather than
   sliced. The highest-risk edits in the ticket, and the shortest list.
2. **`findings.md` §3a** — the 17 ingredient notes, and the fact that T-005-07 will fail on them.
3. **The 46 fragments** (`finding-fragments.tsv`). They are the most aggressive-looking outcome
   and the reason they are harmless is a mechanism worth checking rather than taking on trust.
