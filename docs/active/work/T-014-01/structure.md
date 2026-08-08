# T-014-01 — Structure

Two files change. Neither is code, neither is a recipe, neither is a counter page.

---

## Files

| path | action | why |
| --- | --- | --- |
| `docs/gaps/what-the-season-left.md` | **create** | The consolidated findings, each with its source ticket and its band. |
| `docs/gaps/README.md` | **modify**, four blocks | The recorded-and-not-done list, the recorded-and-closed list, the five-gaps ranking, and a pointer. |
| `docs/active/work/T-014-01/**` | create | These artifacts. |

**Nothing else.** No `.cook`, no `src/`, no `scripts/`, no `src/data/*.json`, no
`docs/knowledge/`, no other page under `docs/gaps/`. Findings *about* those files are recorded;
none is applied.

---

## `docs/gaps/what-the-season-left.md`

Nine `##` sections, in this order. The order is the argument: the thing that cannot be banded
first, then the reading it rests on, then the bands, then the checks no single ticket could run.

```
# What the season left

  (opening: what was read, what the ranking axis is, and that it is not importance)

## The finding that is not in a band          ← T-010-03, and what it implies for S-010's dials
## What each of the twenty-nine contributed   ← 29 rows, "nothing new" allowed
## Mechanical                                 ← 13 entries, each with its verifying command
## Needs an argument                          ← grouped by the decision each is waiting on
## Needs food                                 ← T-012-02's verdict applied, and what it does not cover
## Does the tag vocabulary still hold         ← the re-run, old number against new
## Do the new properties agree with each other ← six checks, by slug or none-found
## Did each story's headline claim survive    ← seven, against dist/
## What this page is not
```

**No `## What it has` block anywhere in the file.** `scripts/menu-sections.mjs` matches a page to
a counter by that heading; a page in this directory carrying one would open a counter by accident.
`soup-pot.md`, `filter.md`, `what-the-shelf-offers.md` and `two-that-invert.md` are the four
precedents. Verified by a before/after diff of the script's output, the check T-013-03 established.

### The shape of a finding

Every entry in the three band sections is one bullet with a fixed skeleton, so a reader can scan
for the ticket or for the command without reading the prose:

```
- **The one-line claim.** What is wrong, in one or two sentences, with the number.
  *Source:* T-0NN-NN §where. *Verify:* `the command` → `the expected output`.
```

The *Verify* clause is mandatory in **Mechanical** and absent in the other two — a finding in
*needs an argument* that had a verifying command would be mechanical.

### Section-by-section content

**`## The finding that is not in a band`** — the 143/227, restated with its re-measurement, then
three numbered consequences for S-010's dials (D2). Ends by saying why it is above the bands
rather than in them.

**`## What each of the twenty-nine contributed`** — five tables, one per story, the rows from
`research.md` §2. Acceptance criterion: every `T-007-*` through `T-013-*` directory listed with a
one-line note, *nothing new* included.

**`## Mechanical`** — 13 entries. Grouped into *stale prose in a gap page* (5), *a stale number*
(3), *a dead syntax or a dead slug still taught* (3), *a one-line ratchet* (2). Each carries the
command. This section is T-014-02's entire scope and says so at the top.

**`## Needs an argument`** — grouped by the kind of decision, because the grouping is what makes
twenty-odd findings readable:

| group | what is waiting |
| --- | --- |
| The record itself | evidence cited and never published |
| Counter decisions | the chopping board, bar 1, one pan or one sink |
| A declared number somebody has to own | `birista`, `lengua`, `batata-harra` |
| The annotation the machinery is waiting on | 98 area-bounded files, five pan-bound dishes, the untimed hand-work |
| Two things that should be one | the two phrasebooks, the two heading names |
| Vocabulary that changes a reading | the twenty timer names, `~preheat`, `shake`, `NEVER_WASHED` |
| Arguments inside a knowledge file | `scaling.md` §2 and §6, `occasions.md` §3.5 and §3.6 |
| Already ranked and still true | the category tree, the tag checker |

**`## Needs food`** — four entries, and one paragraph stating precisely which of them T-012-02's
*write food before writing features* verdict covers and which it does not. The ticket asks for
that sentence by name.

**`## Does the tag vocabulary still hold`** — the old number, the new number, the normaliser used
for each, the split concepts listed, and the count of files touched.

**`## Do the new properties agree with each other`** — a table of six checks with the command for
each and the result by slug or `none found`.

**`## Did each story's headline claim survive`** — seven rows: the claim in the story's own words,
what was checked in `dist/`, and *held* / *held with a caveat* / *did not hold*.

---

## `docs/gaps/README.md`

Four edits, each localised. No other line moves.

**1. A pointer, in the intro paragraph run that already points at `filter.md` and
`what-the-shelf-offers.md`.** One sentence naming the new page and what it holds. Placed after the
`filter.md` paragraph, so the three non-counter pages read as a set.

**2. `## Recorded and not done` gains `### What the season left, S-007 to S-013`.** The six
existing S-001 entries are untouched and stay above it — they are still open and this list is
where the next pass looks. The new sub-block holds the *needs an argument* and *needs food* bands
in compressed form: the finding, its source ticket, why it was not done, and a link to the new
page for the evidence. T-014-02's acceptance criteria require exactly these four things to be
present here, so the sub-block is written to that shape rather than to a prose one.

**3. `## Recorded and closed` gains the entries this read found already closed.** Each names the
ticket that closed it. The section's existing two entries are untouched. Candidates, all verified
in §"Mechanical"'s neighbourhood rather than assumed:

- the borrow mechanism's silent drop — closed by T-007-06, `menuFor()` throws
- One Pot's four inert slugs — closed by T-007-06
- `>> step.N:` as a live form — already recorded closed by T-009-03; **not duplicated**
- the drawer question T-008-04 raised — closed by T-008-05 §4.5

**4. `## The five gaps to fill first` is re-ranked, not ticked.** Gap 1 (the pickles) and gap 2
(the tag checker) are unchanged and gap 2's number is now larger. Gaps 3, 4 and 5 are unchanged —
nothing this season touched them. The re-rank is therefore small and the file says so, in the same
form T-007-05 used when gap 5 closed: what moved, and why.

**What is deliberately not edited**, and each is recorded as a finding instead:

| block | why it stays |
| --- | --- |
| `## Build state` | it is stale and fixing it is T-014-02's |
| the 22-row tally | its two carried-forward columns are stale and fixing them is T-014-02's |
| `### What the kit axis says about the sink` | S-008's argument; not this ticket's to rewrite |
| `## What no single classifier could see` | T-001-18/T-003-07's; the tag number is corrected on the new page and cross-referenced, not overwritten |
| `## Shelving notes for the maintainer` | four board decisions, none resolved this season |

---

## Ordering

The new page is written first and committed first, because the README's new sub-block links into
it and a link to a file that does not exist is the exact failure T-008-05 §6.5 recorded. Then the
README. Two commits, both through `lisa commit-ticket` with exact `--include` paths.
