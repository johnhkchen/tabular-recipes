# T-005-07 · Structure — read it all again

Seventeen files change. Six of them are the deliverable; thirteen are the residue that lets the
gate close. Nothing is created outside `docs/gaps/` and `scripts/`, and nothing is deleted.

---

## 1. The whole file list

| # | Path | Action | Why |
| --- | --- | --- | --- |
| 1 | `recipes/soups/apple-pear-pork-bone-soup.cook` | modified | 1 ingredient note, 129 → ≤80 |
| 2 | `recipes/soups/century-egg-amaranth-soup.cook` | modified | 1 note, 121 → ≤80 |
| 3 | `recipes/soups/chinese-yam-goji-black-chicken-soup.cook` | modified | 1 note, 91 → ≤80 |
| 4 | `recipes/soups/crucian-carp-tofu-soup.cook` | modified | 1 note, 101 → ≤80 |
| 5 | `recipes/soups/dried-bok-choy-pork-lung-soup.cook` | modified | 1 note, 129 → ≤80 |
| 6 | `recipes/soups/green-radish-carrot-pork-bone-soup.cook` | modified | 2 notes, 172 and 83 → ≤80 |
| 7 | `recipes/soups/old-cucumber-rice-bean-soup.cook` | modified | 1 note, 81 → ≤80 |
| 8 | `recipes/soups/overlord-flower-soup.cook` | modified | 1 note, 129 → ≤80 |
| 9 | `recipes/soups/seaweed-egg-drop-soup.cook` | modified | 1 note, 85 → ≤80 |
| 10 | `recipes/soups/sha-shen-yu-zhu-soup.cook` | modified | 2 notes, 96 and 91 → ≤80 |
| 11 | `recipes/soups/watercress-honey-date-soup.cook` | modified | 2 notes, 172 and 95 → ≤80 |
| 12 | `recipes/soups/winter-melon-jobs-tears-soup.cook` | modified | 2 notes, 111 and 90 → ≤80 |
| 13 | `recipes/stews-and-braises/buri-daikon.cook` | modified | 1 note, 84 → ≤80 |
| 14 | `src/data/counters.json` | modified | one section note on `The Soup Pot · Old-fire soups (老火湯)` — the destination for the dropped tonic vocabulary |
| 15 | `scripts/check-recipes.mjs` | modified | `CAPS_FAIL_BUILD` `false` → `true`, and the three comments that describe it in the present tense |
| 16 | `scripts/measure-pages.mjs` | **created** | the story's measurement, scripted for the first time |
| 17 | `docs/knowledge/voice.md` | modified | four passages corrected where a ticket decided differently |
| 18 | `docs/gaps/voice.md` | **created** | what is still wrong, ranked |

Seventeen counting `green-radish` once; eighteen rows because two files carry two notes each and
the table lists paths, not notes. **17 notes across 13 files** is the field count.

Not touched, and each for a reason:

- `src/lib/*` — no library changes. `counters.ts` still does not type `notes`; that is finding 6 of
  the gaps file, not a fix here (typing it is a component change and this ticket ships no component).
- `src/components/*`, `src/pages/*` — nothing rendered changes shape. The raw-cooklang disclosure at
  `[slug].astro:133` is finding 2, deliberately not fixed.
- `package.json` — `measure-pages.mjs` is not wired into `verify`. It measures; it gates nothing.
- `recipes/**` beyond the 13 — no step body, no `slack:` line, no prose row, no `>> step.N:` line,
  no metadata line is edited anywhere.

---

## 2. `scripts/measure-pages.mjs` — the interface

A driver, like every other file in `scripts/`. Reads `dist/`, writes nothing, exports nothing, no
dependency outside `node:fs` / `node:path`.

```
node scripts/measure-pages.mjs                       # mean, median, max, and the wordiest ten
node scripts/measure-pages.mjs --slug ching-bo-leung-soup    # one page's visible characters
node scripts/measure-pages.mjs --count "so both numbers are floors"   # pages carrying a string
node scripts/measure-pages.mjs --all                 # one line per page, slug and count, for a diff
node scripts/measure-pages.mjs --root <dir>          # measure a build other than dist/
```

**The one function that matters** is the extractor, and it reproduces T-005-02 `research.md` §8
exactly, because the whole value of the number is that it compares to the story's:

```
visible(html):
  take the <main> element
  drop <details class="source">, <script>, <style>, and comments
  strip remaining tags with no substitution
  decode entities
  collapse whitespace
  return length
```

`--root` exists because T-005-02 and T-005-05 both recorded that a build moving underneath a
`dist/`-reading script produces findings that are artefacts. Nothing runs beside this ticket, so it
should not be needed; it costs four lines and it is the recorded way through.

A file header comment states the method, names T-005-02 §8 as its source, and records the drift
against the story's published figures — so the next person can see how far to trust it without
re-deriving it.

---

## 3. `src/data/counters.json` — the shape of the added note

One entry appended to the existing `notes` array on `The Soup Pot` → `Old-fire soups (老火湯)`,
which already carries a section-level note (the 湯渣 one T-005-05 wrote) plus eight `of:` notes.

```json
{ "note": "<one sentence, ≤120 chars, no `of:` key — it is about the shelf, not one dish>" }
```

A section-level note (no `of:`) is the right shape because the fact is true of the whole packet
shelf, not one soup — the same reasoning T-005-05 used to collapse nineteen footers into one.
`scripts/parse-recipes.mjs` validates cap, non-emptiness, and that an `of:` slug is both listed in
the section's `items` and shelved at that counter; a note with no `of:` skips the last two.

**Boundary:** this is the only line of `counters.json` that changes. No section, no item, no title,
no existing note.

---

## 4. `scripts/check-recipes.mjs` — exactly what moves

| Line | Now | After |
| --- | --- | --- |
| `:60-66` | comment: *"Reported, not enforced … T-005-07 flips this line to true once the collection is clean"* | rewritten to the past: what the flag was for, which ticket cleared each field, and that it is now on |
| `:67` | `const CAPS_FAIL_BUILD = false;` | `= true;` |
| `:236-241` | branches to *"Set CAPS_FAIL_BUILD = true … once the collection is clean"* | the `false` branch stays (a reader who turns it off should still be told what they turned off), the `true` branch is what now prints |

`CAPS` is **not** touched — no cap moves, in either direction. `measure()` is not touched. The exit
expression at `:244` is not touched. Nothing is added to the file.

---

## 5. `docs/knowledge/voice.md` — four edits, one of them substantive

| Section | Edit |
| --- | --- |
| *Where the words go*, the discard paragraph (`:54`) | `278,833` → `172,003`, with the sentence saying it is what is left after S-005 rather than a fixed fact |
| *One fact, three lengths* (`:61-94`) | rewritten. The diagnosis stays word for word — it is still the clearest statement of the mechanism in the document. The three quoted lengths are replaced with what the file says today, and a closing paragraph names what was actually decided and that it differs from what this page originally prescribed |
| *How long*, the `slack:` paragraph (`:131-136`) | *"almost every declared line is over"* → the state after T-005-04, keeping the 120 aim and naming the 78 lines above it |
| *How long*, the closing paragraph (`:138-141`) | reports-and-exits-zero → enforced, and what a writer now sees when they go over |

**A `## What changed, and when` section is added at the foot**, four bullets, one per correction,
each naming the ticket that decided differently. The criterion asks that the change be *noted*, not
merely made; a silent correction to a document six tickets were written against is worse than the
stale text.

The five-field table, the three house tests, the caps table and the *who is reading* section are
unchanged. They were right and nothing decided differently.

---

## 6. `docs/gaps/voice.md` — the outline

Modelled on `docs/gaps/mobile.md`, section for section.

```
# What the site still gets wrong when it talks to a cook

<not a counter page; what this file is>
<written at the end of S-005, after seven tickets; what they did, in one paragraph>
<how everything below was measured, with the command>
<ranked by what it costs a person holding a packet of dried lotus seeds>

## 1. Fifteen recipes are missing a step you have to do
## 2. `See how it is written` shows the source code
## 3. 172,003 characters nobody reads, and the overrides that made them
## 4. …            ← from reading the pages
## N. …
## What this story did not fix
```

Each numbered entry carries, in `mobile.md`'s order: **What happens** · a measured table or figure ·
**What a fix takes** · **Mitigation or cure**. Entries 1–3 are the three the ticket names and they
open the file. Later entries come from §4 of this ticket's own reading and from findings the six
prior tickets recorded and no ticket owned.

The closing section is the one the ticket asks for in its own words — *"Say plainly what this story
did not fix"* — and it is a list, not a paragraph.

**Not registered in `docs/gaps/README.md`.** That file indexes the per-counter shelf notes and its
own tally; `mobile.md` is not linked from it either, and the two site-wide files sit beside the
counter files rather than under them. Following the existing shape rather than inventing a new one.

---

## 7. Ordering, and why each step has to come where it does

1. **Cut the 17 notes.** Must be first: `npm run verify` begins with `npm run check`, so nothing
   else in this ticket can be verified while the collection is dirty.
2. **Add the counter note.** Same commit as (1) — the note is the destination for what (1) drops,
   and splitting them would leave a commit where a fact is gone and not yet anywhere.
3. **Flip the flag.** Only after `check` reads `ingredient note 0`, and after the flip is proved
   both ways: put one note back over cap, confirm exit 1, restore, confirm exit 0.
4. **Write `measure-pages.mjs` and take every measurement.** After the flip, so the numbers describe
   the tree the ticket ships rather than an intermediate one.
5. **Run the four regression checks.** Needs the pre-story worktree at `1ae1165` and `HEAD`. Also
   after (1), because check (b) expects exactly 17 note changes and no others.
6. **Write `docs/gaps/voice.md`.** Needs (4) and (5) and the page reading, because its entries carry
   measurements.
7. **Correct `docs/knowledge/voice.md`.** Last of the source changes: the number in it
   (172,003) comes from (4), and the closing paragraph describes the flag flipped in (3).

The page reading (§2 of the ticket) runs alongside (4) — it needs a current `dist/`, which (4)
builds, and it feeds (6).

---

## 8. Commit boundaries

Four, through `lisa commit-ticket` with exact `--include` paths:

| # | Message | Paths |
| --- | --- | --- |
| 1 | Say which one to buy, and put the tonic word on the shelf | the 13 `.cook` files + `src/data/counters.json` |
| 2 | Fail the build on a field that says too much | `scripts/check-recipes.mjs` |
| 3 | Script the measurement the story was written from | `scripts/measure-pages.mjs` |
| 4 | Write down what the pages still get wrong, and correct the rule | `docs/gaps/voice.md` + `docs/knowledge/voice.md` |

Commit 1 is the only one that can leave the tree in a state where a later command fails, which is
why it is first and why (3) in §7 does not happen until it is green.

---

## 9. What could go wrong, and what catches it

| Risk | Catch |
| --- | --- |
| a note edit changes a quantity, an ingredient name or a ref | projection (b) diffed against the pre-story worktree; `npm run check` re-parses all 658 |
| a note edit moves an operation label or a row | projection (a), 658 lines, byte-identical |
| a note is cut under 80 but loses a fact with nowhere to go | the 17-row disposition table in `progress.md`, one row per note, naming the destination |
| the counter note fails validation | `npm run recipes` refuses and names the counter and section |
| the flag is flipped and something else is over cap | step (3) does not start until `check` reads all five fields at zero |
| the measurement drifts from the story's | the script's header records its drift against the story's published figures, the same way T-005-02 §8 did |
