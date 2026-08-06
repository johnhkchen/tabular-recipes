# T-005-03 · Review — a place for shelf talk

**Disposition: pass.** The field exists, is validated, renders, and carries four sentences
moved off the four recipes the criteria named. `npm run verify` and `npm run verify:mobile`
both exit 0. Four open concerns are carried below; three are files outside this ticket's
declared list, and one is a stated departure from the letter of a criterion, quoted in full so
a reviewer can judge it rather than discover it.

---

## What changed

| File | Action | Lines | Commit |
| --- | --- | ---: | --- |
| `src/data/counters.json` | modified | 1834 → 1859 | `c3f495c` |
| `scripts/parse-recipes.mjs` | modified | 154 → 226 | `c3f495c` |
| `src/pages/menu/[counter].astro` | modified | 96 → 161 | `2765213` |

Nothing else. No `.cook` file, no component, no `site.css`, no `src/lib/`, no `package.json`.
`git status --porcelain src/ scripts/ docs/knowledge/` is empty.

## The decision the ticket asked for: one field, not two

**One field — `notes` on a section, a list of `{ of?, note }`.** An entry with `of` is about
that dish and prints beside it; one without is about the section and prints under its heading.

The ticket said *"one is likely better … but the data should decide it,"* and the data decided
it in a way the ticket did not anticipate. Reading all 393 prose rows for shelf-comparison
vocabulary found 35 sentences, and two facts fell out (`research.md` §6):

1. **Every one of the 35 names a dish.** Not one is about a group with no dish in it. They
   were written on recipe pages, so they arrived with a subject already.
2. **One section wants ten of them.** `The Slow Cooker / Braises, left alone all day` holds 18
   items and 10 of the 35.

Fact 2 kills a scalar `note: string` on a section, and it kills it using this ticket's own
proof set: of the four recipes the criteria name, **two are in that same section**. A single
string could have carried one of them. That is the finding worth a reviewer's minute — the
shape the ticket leaned toward could not have held the sentences the ticket asked to move.

Fact 1 argued for going further, to per-item notes only, and was not taken: the absence of
group sentences is evidence about where the corpus came from, not about what a menu needs, and
`Braises, left alone all day` still says nothing about what makes these the ones. The
`of`-less entry costs one optional key and closes that gap. It is exercised — the group note
on that section is the fifth note written here.

Rejected in full, with reasons, in `design.md` §1.

## The four sentences that moved

| Recipe | Row was | Note is | Landed at |
| --- | ---: | ---: | --- |
| `boston-baked-beans-slow-cooker` | 730 | 113 | The Slow Cooker / Beans and pulses |
| `baked-turkey-wings-slow-cooker` | 563 | 118 | The Slow Cooker / Braises, left alone all day |
| `new-england-boiled-dinner-slow-cooker` | 544 | 111 | The Slow Cooker / Braises, left alone all day |
| `soy-sauce-chicken-slow-cooker` | 543 | 84 | The Slow Cooker / Whole birds and big cuts |

Plus one group note on `Braises, left alone all day` (119), **written for the section, not
moved from anywhere** — no recipe lost it and T-005-05 owes nothing for it.

The `.cook` files are untouched; the sentences were copied. `progress.md` §Step 8 records
exactly which clause was taken from each row and which clauses stay, so T-005-05 can strike
the right words. It also carries the other **27 shelf-talk rows** found in the survey, with
counter and section, as a starting list rather than something to re-derive — including two
findings T-005-05 should read first: `balti` and `madras` sit at two counters each and their
comparisons are only true at one of them, and every Instant Pot row is the mirror of a slow
cooker row for the same dish, so the same sentence must not be written twice.

## Acceptance criteria, one by one

| Criterion | Evidence |
| --- | --- |
| `counters.json` carries an optional place for shelf talk; one-vs-two decided from the sentences and recorded | `design.md` §1; the two facts above |
| `menu/[counter].astro` renders it | `progress.md` §Step 5 — the built markup, quoted |
| A counter with no notes renders byte-identically — **shown, not asserted** | `progress.md` §Step 4. See open concern 1: `<body>` is byte-identical on all 20; `<head>` gains one `<style>`, quoted in full |
| Validated where counter names are; a bad section or slug fails naming counter and slug | `progress.md` §Step 2 — six fault injections, every message quoted |
| At least four notes moved from the four named recipes | table above; `.cook` files unmodified |
| The T-005-01 cap applies, or `voice.md` says why it differs | 120, unchanged. All five notes fit: 84–119. `voice.md` untouched — see open concern 4 |
| 375px, no horizontal scroll, checked on The Bowl Shop and Bakery; `verify:mobile` passes | below |
| `npm run verify` passes | exit 0 |
| Only the three files modified; no `.cook` touched | `git status` empty; `git show --stat` on both commits |

## Test coverage

### `npm run verify` — exit 0

```
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories
Test Files  9 passed (9) · Tests  833 passed (833)
682 page(s) built
```

### `npm run verify:mobile` — exit 0

```
2046 page views at 375px, 390px, 768px — nothing scrolls sideways.
2046 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px, the table
says when it continues, and the pinned column stays below 44rem.
```

The named targets were also run alone: `/menu/bowl-shop/`, `/menu/bakery/` and
`/menu/slow-cooker/` at 375px — nothing scrolls.

**The first attempt exited 2, not 0, and that is worth reading.** `verify:mobile` begins with
`npm run build`, and T-005-04 was building the same `dist/` at the same time; the script's own
guard caught it and refused to report — *"Nothing above is evidence either way."* Correct
behaviour. The clean run above is against a frozen copy of the build, driven through the
`--root` flag both scripts already accept, so nothing could move underneath it. **A reviewer
re-running `npm run verify:mobile` while other S-005 tickets are live should expect exit 2 and
should not read it as a failure.**

### Where the coverage is, and where it is not

**No new vitest file, and that is a decision, matching T-005-01's.** `scripts/` has no test
file in this project — the pure libraries under `src/lib/` carry the suite and every script is
a thin driver over them. `parse-recipes.mjs` exports nothing and is imported by nothing.
Making the note check unit-testable would mean a new module, which is outside the ticket's
file list.

What stands in for it is stronger than a happy-path unit test would be: **every branch of the
validator was fired against the real data file**, and each message is recorded verbatim in
`progress.md` §Step 2 — `notes` not a list; an entry with no text; 121/120; a one-character
typo in a slug; a slug listed in the section but shelved at another counter; and a real note
filed under the wrong section heading. `parse-recipes.mjs` exits 1 and `npm run verify` exits
1 on each. That covers the failure mode that matters — a check that never fires.

The renderer's coverage is a `diff -r` of all 682 built pages against the tree as it stood
before the change, which no unit test would match.

**Gaps:**

- Nothing pins the shape of `notes` as a type. `src/lib/counters.ts` still describes a section
  as `{ title, items }` — open concern 2.
- The note styling is verified by the overflow and touch checks and by reading the markup, not
  by a visual assertion. There is no screenshot baseline in this project to compare against.
- The validator is not exercised by an automated test that would fail if someone deleted it.
  It runs on every `npm run recipes`, so it cannot silently stop being called, but it could
  silently stop checking.

---

## Open concerns

### 1. Twenty note-less menu pages gain one `<style>` element in `<head>`

The criterion says *"A counter with no notes renders byte-identically to today — show this
rather than asserting it."* Shown, and here is the honest reading:

- **`<body>` is byte-identical on all 20**, without stripping anything
  (`bakery` and `bowl-shop` hashed and compared in `progress.md` §Step 4).
- **`<head>` gains exactly this, and nothing else:**

```html
<style>.menu-note{color:var(--clay-ink-soft);margin:-.35rem 0 .9rem;font-size:.84rem;line-height:1.45}.item-note{color:var(--clay-ink-soft);margin:.2rem 0 0;font-size:.84rem;font-style:italic;line-height:1.45}
</style>
```

Remove that one element and 20 of the 21 menu pages are byte-identical to the baseline. The
661 other pages are byte-identical untouched, and `dist/_astro/*.css` keeps its filenames.

The two alternatives cost more, and both were measured (`design.md` §5): putting the rules in
`src/styles/site.css` rehashes the shared bundle and changes the stylesheet link on **all 682
pages** — and that file is outside this ticket's list anyway; a scoped `<style>` makes Astro
stamp `data-astro-cid-*` onto every element of every menu. A third shape that would be
literally byte-identical — emitting the CSS through `<Fragment set:html>` only when a counter
has notes — was written out and rejected for putting a `<style>` in `<body>`, which browsers
accept and the spec does not.

**This is the one place the work meets a criterion in substance and not to the letter.** It is
here rather than buried so that a reviewer who wants the letter can say so; the fix is
mechanical and is the `<Fragment>` shape above.

### 2. `src/lib/counters.ts` does not describe `notes`

The `Counter` interface types a section as `{ title: string; items: string[] }`. The JSON now
carries a third key it does not know about, so `[counter].astro` declares the shape locally and
casts through `unknown` to read it (`[counter].astro:34–45`, with the reason in the comment
above it).

`src/lib/counters.ts` is outside this ticket's file list. The cost is that a future reader of
the interface will not learn the field exists from the type — they will learn it from
`counters.json`'s own header, from `parse-recipes.mjs`, or from the comment in the page.
**Recommendation: whoever next opens `counters.ts` adds
`notes?: { of?: string; note: string }[]` to the section type and drops the local declaration.**
T-005-05 already edits `counters.json` and is the natural place.

### 3. `scripts/menu-sections.mjs --write` discards every note

`parseSections` builds fresh `{ title, items }` objects from `docs/gaps/*.md` and assigns
`counter.sections = sections` (line 130). Anything hand-written onto a section is gone. It is
a hand-run import tool — not in `verify`, `build` or `check` — but nothing warned about it.

Out of scope to fix. In scope to warn in, and the warning went into the file it would destroy:
`counters.json`'s `"//"` header now ends *"They are the only thing in this file written by hand
rather than derived, so scripts/menu-sections.mjs --write — which rebuilds `sections` from
docs/gaps/*.md — will drop every one of them."*

**This is the concern most likely to cost someone real work**, because the failure is silent
and the tool looks harmless. The proper fix is for `menu-sections.mjs` to carry notes across by
section title, which is about six lines.

### 4. `voice.md` does not name the field or its cap

The cap did not differ — 120, the same `prose row` number — so the ticket's escape hatch for
editing `docs/knowledge/voice.md` never opened, and it is not in the file list.

The consequence: `voice.md` §"Where the words go" tells a writer *"Anything comparing this dish
to its shelf-mates goes on the counter's menu, not here,"* and now that room exists, but that
page does not say what the field is called or how long a note may be. T-005-05 will write
dozens of these. It will find out from `parse-recipes.mjs`, which prints `N/120` and points at
`voice.md`, and from `counters.json`'s header — but the readable copy has a hole in it.

**Recommendation: a row in `voice.md`'s caps table — `a menu note · 120 · one sentence,
compared against its shelf-mates` — owned by T-005-05 or T-005-07.**

---

## What a reviewer should look at first

1. **`design.md` §1**, the one-field decision. It is the ticket's actual question, and the
   answer contradicts the shape the ticket leaned toward, for a reason visible in the ticket's
   own four recipes.
2. **Open concern 1**, the `<style>` in `<head>`. It is the only criterion met in substance
   rather than to the letter, and the whole difference is eleven lines of quoted CSS.
3. **`progress.md` §Step 8**, the handoff table. T-005-05 depends on it to avoid moving a
   sentence twice, and it carries two findings about `balti`/`madras` and the Instant Pot
   mirrors that would otherwise be re-derived.
4. **Open concern 3**, `menu-sections.mjs`. Silent data loss, six lines to fix, no ticket.
