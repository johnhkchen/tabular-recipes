---
id: S-009
title: a-label-that-sits-with-its-step
type: story
status: open
priority: high
---

## Why

**`>> step.4:` names a step by counting to it, and the count is written somewhere the step is
not.** Add an operation in the middle of a recipe and every override below it now labels the
wrong row. Nothing tells you. The file still parses, the table still draws, and the words under
`fold in` are the words that belonged to `bake`.

This is the format's one fragile joint and it is not a small one:

| | Uses | Files |
| --- | --: | --: |
| `>> step.N:` | **2,771** | **643 of 658** |
| `@&(N)` absolute back-reference | 33 | 30 |
| `@&(~N)` relative back-reference | 2,401 | most |

Nearly every recipe on the site carries the fragile form, several of them eight deep.

**It has already cost real work, and that is written down.** `docs/gaps/README.md` has carried
this under *Recorded and not done* since T-001-08:

> **`>> step.N:` counts prose steps as well as operations**, which is undocumented, silently
> mislabels a file rather than failing it, and cost three files a round trip.

Two separate defects, one cause. The number has to be counted by a person, and what it counts is
not what the person thinks it counts. Both disappear the moment the label stops being addressed
by number.

**The failure is silent, which is what makes it worth a story.** This repo refuses to draw a
table it cannot justify — it rejects a split preparation, refuses two endings, returns null
rather than compare grams to cups, and errors on a counter name that does not exist. `step.N` is
the one place where being wrong produces a confident, plausible, incorrect page.

## What changes

**The override moves to the line directly above the step it labels.**

```cooklang
Blanch @pork neck bones{2%lb}(900 g) from cold in a #soup pot{}, ~blanch{10%min}.

>> step: soak the flower 30 min, then rinse it hard
Soak @dried overlord flower{2%oz}(60 g) in cold water, ~soak{30%min}.
```

No number to write, no number to maintain, and the label is readable next to the thing it
renames — which is the other half of the win, because today you have to count paragraphs to find
out which line a `step.5:` at the top of the file is talking about.

**This is buildable and it has been checked, not assumed.** The parser (`@cooklang/cooklang`
0.18.7) hoists a mid-file `>> key: value` into `raw_metadata.map` and — the part that matters —
**does not split the step that follows it.** A `>> step:` line placed inside the body leaves the
step blocks and their numbering exactly as they were. What the AST does *not* preserve is where
the line sat, so `scripts/normalise.mjs` reads the positions off the source before parsing. That
is the one piece of new machinery this story needs; everything downstream keeps working on the
same `labelOverride` field it uses today.

## What is in scope, and what is deliberately not

**In:** `>> step.N:`, all 2,771 of them, migrated by a script rather than by hand.

**In:** `@&(N)`, the absolute back-reference. Same defect exactly — a number counted by a person,
addressing a step from a distance, wrong and silent when a step is inserted above it. Only 33
uses across 30 files, so it is cheap, and leaving it would mean fixing the format's fragile joint
and leaving a splinter in it.

**Out: `@&(~N)`, the relative back-reference**, and the reason is not squeamishness. `~1` means
*the step before this one*, which is what the author actually means and stays true when a step is
appended. It breaks only when something is inserted **between** a step and its target — and when
that happens the tree usually stops merging, which is a build error rather than a wrong page.
Relative references fail loudly; positional ones fail quietly. **This story is about the quiet
ones.** The 373 uses of `~2` and deeper are worth a look one day and they are recorded here, not
fixed here.

## The migration is the risk, so it is proved rather than trusted

643 files is not a change anybody reviews by reading. So the codemod carries its own proof:
**every operation label on every page must be byte-identical before and after.** The site is
built, every label extracted, the migration run, the site rebuilt, and the two sets diffed to
zero. A migration that cannot demonstrate that is not merged, however good the diff looks.

**The old form keeps working until the new one has proved itself.** T-009-01 teaches the build
both, T-009-02 migrates, and only T-009-03 takes `step.N` away. Sequenced the other way, one
unmigratable file breaks 643 pages.

## Shape of the work

- **T-009-01** teaches the build the inline form, alongside the numbered one. Depends on nothing.
- **T-009-02** writes and runs the codemod over 643 files, and proves the labels did not move.
- **T-009-03** retires `step.N`: the checker rejects it, the docs stop teaching it.
- **T-009-04** does the same for `@&(N)`. Small, independent, and safe to drop if it turns out
  to be harder than it looks.

## Conventions

The authoring contract in `README.md` and the register rules in `docs/knowledge/voice.md` both
teach `step.N` today — README at line 153, voice.md in seven places. **A syntax change that
leaves the documentation teaching the old form has not landed**, and voice.md matters more than
README here: it is the file that explains *why* an override throws the step's own words away,
and that argument is unchanged and must survive the rename intact.
