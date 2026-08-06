# T-005-06 · Structure — the prose nobody reads

The shape of the change. Nothing in `src/`, nothing in `scripts/`, nothing in `docs/`
outside this work directory. The only files that change in the repository are `.cook` files,
and inside those only step-body paragraphs of steps that already carry a `>> step.N:` line.

---

## 1. Repository files that change

| Path | Action | Extent |
| --- | --- | --- |
| `recipes/**/*.cook` | modified | up to 637 files; one or more body paragraphs each |

Nothing created. Nothing deleted.

### Files that must NOT change, and what stops them

| Path | Guarded by |
| --- | --- |
| every `>> …:` metadata line, including `>> step.N:` | applier re-reads the metadata map and compares it whole; `meta-before.tsv` diff |
| step bodies of steps **without** an override | applier only addresses blocks whose step has `labelOverride !== null` |
| `src/lib/**`, `scripts/**`, `src/components/**` | not in any `--include` |
| `src/data/counters.json` | not in any `--include`; §5 of design says findings, not moves |
| `src/generated/recipes.json` | untracked build product; regenerated, never committed |

## 2. The unit of change, exactly

One **body paragraph**: the Nth blank-line-delimited non-metadata block of a `.cook` file,
where step N carries a `>> step.N+1:` line.

The paragraph is replaced by either

- the concatenation of a chosen subset of its own sentences, joined by a single space
  (`keep`), or
- a hand-written replacement (`rewrite`).

Nothing else in the file is read into the output. The applier rebuilds the file as
`lines[0..start-1] + newParagraph + lines[end+1..]`, so a byte outside the block cannot move.

Trailing newline, blank-line spacing and file ending are preserved by construction, because
only the block's own line range is substituted.

## 3. New files, all inside `.lisa/attempts/T-005-06/1/work/`

None of these ship. None is passed to `--include`.

### Tools

| File | Job | State |
| --- | --- | --- |
| `dump-bodies.mjs` | the measurement, and the four proof dumps (`labels`, `data`, `cols`, `meta`) | written |
| `map-steps.mjs` | step index → block range; exports `stepBlocks()`; self-checks over 658 files | written |
| `split-bodies.mjs` | markup-safe sentence split; exports `collectBodies()`, `tokensOf()`, `splitSentences()` | written |
| `apply-bodies.mjs` | applies one decisions table; validates everything, then writes or writes nothing | to write |

`apply-bodies.mjs` is the only one that writes. Its public shape:

```
node apply-bodies.mjs decisions-<group>.tsv          # validate and apply
node apply-bodies.mjs decisions-<group>.tsv --dry    # validate only, report, touch nothing
```

Exit 0 on a clean apply, 1 with a named file and reason on any refusal. **Refusal is
all-or-nothing across the table**: validation runs over every row first, and no file is
opened for writing until every row has passed.

### Data

| File | Shape | Written by |
| --- | --- | --- |
| `bodies-all-before.tsv` | 2782 rows: path, step, kind, length, label, rendered body | `dump-bodies.mjs tsv` |
| `bodies-over-before.tsv` | the 656 over cap | `dump-bodies.mjs over` |
| `labels-before.tsv` / `-after` | 3470 rows: slug, node, label | `dump-bodies.mjs labels` |
| `data-before.tsv` / `-after` | 4786 rows: slug, step, refs, ingredients, timers, + cookware and ingredientNames per recipe | `dump-bodies.mjs data` |
| `cols-before.tsv` / `-after` | 658 rows: the whole merge tree per recipe | `dump-bodies.mjs cols` |
| `meta-before.tsv` / `-after` | 658 rows: every `>> step.N:` key and value per file | `dump-bodies.mjs meta` |
| `report-before.txt` / `-after.txt` | `npm run check` in full | npm |
| `decisions-<group>.tsv` | **the judgement** — path, step, keep, rewrite, tag | by hand |
| `findings.md` | bodies that would make a good label; bodies that were all defence | by hand |

`decisions-*.tsv` is the ticket's real deliverable alongside the diff: one line per body
touched, reviewable without opening a `.cook` file.

## 4. The decisions table

Five tab-separated columns, header row present, `#` comments allowed.

```
path              recipes-relative, must exist, must be .cook
stepIndex         0-based; step must carry a labelOverride
keep              comma-separated sentence indices, ascending, or empty when rewrite is set
rewrite           full replacement paragraph, or empty when keep is set
tag               why the cut sentences went: compare | defend | provenance | meta | rewrite
```

Exactly one of `keep` / `rewrite` is non-empty. `tag` is not used by the applier; it is what
makes the artifact countable in Review.

The **precondition column is the file itself**: a row is validated by re-splitting the
current paragraph and checking that `max(keep) < sentenceCount`, so a table written against
an older tree fails loudly rather than mis-slicing.

## 5. Ordering

Order matters in two places and nowhere else.

**Within a file**, blocks are addressed by index into the *current* text, so all edits to one
file are computed against one read and applied in one write, bottom-up by line range. Two
judgements on two steps of the same file cannot interfere.

**Across groups**, `npm run recipes` is re-run after each group so the next group's split is
taken against the current tree. The four `*-before` dumps are taken **once**, before the
first edit, and are never regenerated — they are the baseline, and a baseline that moves
proves nothing.

## 6. Group boundaries

Nine groups, each one `lisa commit-ticket`. Ordered by over-cap count so the largest
judgement lands first and a failure costs the least remaining work.

| # | Group | Folders | Over-cap bodies |
| --- | --- | --- | ---: |
| 1 | the soup pot | `soups` | 89 |
| 2 | the braise | `stews-and-braises` | 75 |
| 3 | the grain shelf | `rice-beans-and-grains` | 68 |
| 4 | the cold bowl | `salads` | 58 |
| 5 | the fat and the fire | `fried-and-crispy`, `smoked-and-grilled` | 74 |
| 6 | the sides | `vegetables-and-sides`, `dumplings-and-rolls` | 67 |
| 7 | the pouring shelf | `sauces-and-gravies`, `dressings-and-dips`, `spice-blends-and-marinades`, `toppings-and-pickles` | 85 |
| 8 | the flour shelf | `breads`, `pastry-and-doughs`, `flatbreads-and-pancakes`, `pizzas`, `pasta`, `noodles` | 68 |
| 9 | the rest | `custards-and-puddings`, `eggs`, `cookies`, `bars-and-brownies`, `cakes-and-loaves`, `sandwiches-and-rolls`, `stir-fries`, `cured-fish`, `drinks` | 72 |

Sum 656. Each group also carries its share of the 188 under-cap multi-sentence bodies.

`--include` paths are the exact `.cook` files the applier reported as written for that group,
taken from its output rather than from a glob, so a file the applier declined to touch is
never committed.

## 7. Interfaces between the tools

```
findRecipes() ──▶ normalise() ──▶ recipe.steps[]
                                      │
        source ──▶ stepBlocks() ──▶ blocks[]   (map-steps.mjs, index-aligned, verified)
                                      │
                              collectBodies()  (split-bodies.mjs)
                                      │
                        { path, stepIndex, kind, label, raw, sentences[] }
                                      │
                    ┌─────────────────┴─────────────────┐
            dump-bodies.mjs                      apply-bodies.mjs
          (measure, prove)                    (validate, then write)
```

`apply-bodies.mjs` imports `stepBlocks` and `splitSentences`/`tokensOf` rather than
re-implementing them, so the split the judgement was written against is the split the applier
slices on. That identity is the reason the table's `keep` indices mean anything.

## 8. What Review will diff

```
diff labels-before.tsv labels-after.tsv     # expected: empty
diff data-before.tsv   data-after.tsv       # expected: empty
diff cols-before.tsv   cols-after.tsv       # expected: empty
diff meta-before.tsv   meta-after.tsv       # expected: empty
diff report-before.txt report-after.txt     # expected: step body 656 → 0
git diff --name-only 7eb9baa..HEAD          # expected: only recipes/**/*.cook
```

Four empty diffs and one that is only the number going down is the whole safety argument.
