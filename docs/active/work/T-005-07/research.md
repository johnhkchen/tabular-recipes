# T-005-07 · Research — read it all again

Descriptive. What exists, where, and what the six preceding tickets left behind. No proposals.

---

## 1. What this ticket is, in the story's shape

`01 → 04 → 05 → 06 → 07` is the critical path and this is its end. Nothing runs beside it —
T-005-02 through T-005-06 are all `phase: done`, `git status` is clean apart from the untracked
story and ticket markdown for S-005/T-005-07. The ticket says it may edit any file.

Five jobs, in the ticket's own order:

1. Close the gate — flip the caps checker from reporting to failing.
2. Read whole pages, not fields — seven named pages plus a counter menu.
3. Re-measure six figures against the story's starting numbers, by the story's method.
4. Check four things the story could have broken.
5. Write `docs/gaps/voice.md`, and correct `docs/knowledge/voice.md` where it drifted.

---

## 2. The gate, and the one line

`scripts/check-recipes.mjs` does two jobs in one pass. The structural half (does this file draw a
table) already exits 1. The caps half reports and exits 0:

- `scripts/check-recipes.mjs:41-58` — the `CAPS` object. Five fields:
  `operation cell 70`, `step body 150`, `prose row 120`, `slack reason 200`, `ingredient note 80`.
  Each carries the measurement that chose it in a comment above it.
- `scripts/check-recipes.mjs:67` — `const CAPS_FAIL_BUILD = false;` with a comment naming
  T-005-07 as the ticket that flips it and saying *"It is the only change."*
- `scripts/check-recipes.mjs:244` —
  `process.exit(failed || (CAPS_FAIL_BUILD && overCap.length) ? 1 : 0)`. The flag gates only the
  caps half.
- `scripts/check-recipes.mjs:236-241` — the closing message branches on the same flag and today
  prints *"Set CAPS_FAIL_BUILD = true … once the collection is clean."*

T-005-01's `review.md` §"The line T-005-07 changes" states the flip was proved in both directions
before that ticket committed with `false`.

### What is over cap today

`npm run check`, run at the head of this attempt:

```
all 658 file(s) draw a table.
17 field(s) over cap in 13 file(s) — 500 characters over.
by field:  operation cell 0 · step body 0 · prose row 0 · slack reason 0 · ingredient note 17
```

Four of the five fields read zero. The whole remaining report is **ingredient notes**: 17 in 13
files, from `+1` (`old-cucumber-rice-bean-soup`, 81/80) to `+92`
(`green-radish-carrot-pork-bone-soup` and `watercress-honey-date-soup`, 172/80).

Twelve of the thirteen files are `recipes/soups/` — the Cantonese old-fire soup shelf, where the
note carries a romanisation, a Chinese term, and a paragraph about what the ingredient does. The
thirteenth is `recipes/stews-and-braises/buri-daikon.cook` at 84.

### Who owns them: nobody, until this ticket

This is the single most-flagged item in the story's own record:

- T-005-01 `review.md` open concern 1: *"Nothing in the story owns ingredient notes … when
  T-005-07 flips line 67, the build fails on 13 files that no ticket was scheduled to clean."*
  It recommended folding them into T-005-06.
- T-005-05 `review.md` open concern 4: recorded as known, out of scope.
- T-005-06 `review.md` open concern 1 and §12.2: *"Somebody has to take them before
  `CAPS_FAIL_BUILD` flips. This is the one thing worth acting on next."* T-005-06's last
  acceptance criterion confined it to step bodies, so it did not.

The ticket answers it directly: *"Fix what remains, or raise the cap with the measurement that
justifies it. **Do not** exempt files to make the check green."* There is no exemption mechanism
in `measure()` to reach for even if one were wanted — the function has no skip list, and adding
one would be the forbidden move.

`measure()` reads the note at `scripts/check-recipes.mjs:99-101`: `ing.note.length`, per step,
per ingredient. The note is the parenthetical in `@name{qty}(note)` — see `scripts/normalise.mjs`
for where it lands on the parsed step.

---

## 3. The measurement method

The story's figures came from *"stripping tags out of the built HTML with the collapsed source
block excluded."* That is not scripted anywhere in the repository. T-005-02's `research.md` §8
reconstructed it and validated the reconstruction:

> take the `<main>` element of `dist/<slug>/index.html`, drop `<details class="source">`,
> `<script>`, `<style>` and comments, strip remaining tags with no substitution, decode entities,
> collapse whitespace.

Its drift against the story's published numbers was **0.2% at worst**: `ching-bo-leung-soup` 6226
vs 6223, mean 3494 vs 3487, median 3383 vs 3379, max 6226 vs 6223. The wordiest-ten list came out
as the same shelf in the same order. That is the method to reuse, and the reconstruction is not
in the repository either — it lives only in T-005-02's prose, so it has to be re-written here.

The collapsed source block is `src/pages/[slug].astro:132-135`:

```astro
<details class="source">
  <summary>See how it is written</summary>
  <pre><code>{source}</code></pre>
</details>
```

`{source}` is the raw `.cook` file. This is both the thing excluded from the measurement and
finding 3 of the gaps file the ticket asks for.

### The six figures and where their baselines are

| Figure | Start | Baseline source |
| --- | --- | --- |
| visible chars per page — mean / median / max | 3487 / 3379 / 6223 | S-005 story; T-005-02 research §8 reproduces at 3494 / 3383 / 6226 |
| the wordiest ten | "almost entirely the Chinese soup shelf" | S-005 story, §Why |
| six chrome sentences | 577 / 531 / 307 / 144 / 97 / 15 pages | T-005-02's ticket table gives 577 / 531 / 307 / 144 / **57** / 15 |
| `slack:` reasons over 200 | 333 of 397 | S-005 story table (measured on the whole `>> slack:` value) |
| prose rows over 120 | 126 headers, 106 footers | T-005-05 review §2 |
| discarded step-body characters | 228,000 | S-005 story; T-005-01 re-measured the field wider at 278,833 |

Three of these carry a known discrepancy that has to be reported rather than smoothed over:

- **97 vs 57.** T-005-07's ticket says *97* for the fifth chrome sentence; T-005-02's ticket table
  says *57* for *"N of that is counted as needing you only because the step never said
  otherwise."* T-005-02's review §"The three cases" answers *"the assumed hands-on case (97 + 57
  pages)"*, so 97 and 57 are two different counts of two overlapping populations.
- **333 of 397 vs 304 of 397.** T-005-01 review open concern 3: the story counted the whole
  `>> slack:` value including the level word; the cap governs the rendered reason alone
  (`Timeline.astro:315` prints `<b>{word}</b> — {reason}`). Same field, two conventions.
- **228,000 vs 278,833.** T-005-01 review open concern 2: the story counted discarded bodies only
  on steps that become operations; `src/lib/tree.ts:129` applies the override on **both** sides of
  the `isOpStep` branch, so a prose-row step with a `>> step.N:` line also discards its paragraph.
  The wider, correct field is 2782 steps in 637 files, 278,833 characters.

---

## 4. The pages the ticket names, and what is known about each

| Page | Why it is on the list | What already happened to it |
| --- | --- | --- |
| `soups/ching-bo-leung-soup` | wordiest at 6223 | T-005-02 measured it 6226 → **5259** (−896 from the clock alone); T-005-05 collapsed nineteen Cantonese footers to one counter note; T-005-06 cut its bodies |
| `soups/dried-bok-choy-pork-lung-soup` | second at 6126 | same three passes; also carries an over-cap ingredient note (129/80) |
| `rice-beans-and-grains/boston-baked-beans-slow-cooker` | the 757-char headnote | T-005-03 moved its shelf-talk to The Slow Cooker; T-005-05 cut the 730-char row (the collection's worst) |
| `soups/tonkotsu-broth-instant-pot` | the worked example — one fact, three lengths, three fields | T-005-02: 4027 → 3579. T-005-04 rewrote its `slack:`. T-005-05 struck its row as an `echo-slack`. T-005-06 cut step 3, 273 → 63 |
| `pasta/fresh-egg-pasta` | 596-char footer that is really a cooking step | T-005-05 shortened it in place and **did not promote it**; it heads that ticket's fifteen-recipe list |
| `grilled-cheese` or `egg-cream` | already short — confirm nothing was taken | no ticket names either |
| The Slow Cooker menu | received moved sentences | T-005-03 wrote 4 notes + 1 group note; T-005-05 added 37 more entries |

`egg-cream` and `grilled-cheese` need locating — neither appears in any S-005 work artifact,
which is itself the point of reading them.

---

## 5. The four regressions, and where each one's evidence already lives

**a. The merge tree is unchanged, across all 658.**
T-005-05 proved it with `dump-rows.mjs cols` (root column count, leaf count, header count, footer
count, every operation's `stepIndex:col:row:rowSpan`) — `cols-before.txt` vs `cols-after.txt`,
empty diff. T-005-06 re-proved it after its own pass with `dump-bodies.mjs cols`,
`cols-before.tsv` / `cols-after.tsv`, empty diff, run after each of nine groups. Both tools are
in `.lisa/attempts/T-005-05/1/work/` and `.lisa/attempts/T-005-06/1/work/`, which are
**gitignored** — `.lisa/` is in `.gitignore`, and only the `.md` artifacts were published to
`docs/active/work/`. So the tools exist on this machine but are not part of the repository, and
the proof has to be re-run against the pre-story tree rather than read off a file.

The strong form the ticket asks for is *before the story began* → *now*, not per-ticket. The
pre-story ref is **`1ae1165` (`Complete T-004-06`)**; the first S-005 commit is `937ca8a`.

**b. No ingredient or timer was lost.**
`src/generated/recipes.json` is **gitignored** (`.gitignore` line `src/generated/`), rebuilt by
`npm run recipes` from `recipes/**/*.cook`. So "diff against the state before the story began"
means: build it at `1ae1165` in a worktree and diff a normalised projection. A whole-file diff is
useless — step bodies changed by design in 844 places, and `slack:` in 373, and prose rows in
232. What must be identical is ingredients, quantities, units, notes-as-facts, timers, refs and
cookware. T-005-06's `data-before.tsv`/`data-after.tsv` projection is the right shape:
`name|quantity|note|amount.value|amount.unit` per ingredient, `name|text|minutes|attention` per
timer, plus `cookware` and `ingredientNames` per recipe. Caveat: **ingredient notes are in that
projection and this ticket is about to change 17 of them**, so the note column has to be reported
separately rather than expected to be byte-identical.

**c. No safety fact was cut to fit a cap.**
T-005-04 `review.md` names *"the table of 36 in `progress.md` §Safety facts"*, quoted as
*after*-text with their numbers. `docs/active/work/T-005-04/progress.md` is published and
committed, so the list is readable from the repository. T-005-04 also records one case where the
collection **gained** a fact — `sauerkraut`, whose failure was rescued out of an unrendered step
body into `slack:` at 96 chars.

**d. Nothing moved twice, and nothing moved and stayed.**
T-005-03 moved four sentences (`boston-baked-beans-slow-cooker`, `baked-turkey-wings-slow-cooker`,
`new-england-boiled-dinner-slow-cooker`, `soy-sauce-chicken-slow-cooker`) plus one group note
written fresh. T-005-05 moved 52 more, producing 37 `counters.json` entries because fifteen
Cantonese soups collapse into one section note. Its `decisions-*.tsv` marks the four T-005-03
sentences as *"T-005-03 already moved it"* — struck from the row, not re-added. Those TSVs were
published to `docs/active/work/T-005-05/` and are readable. The check to run is textual: does a
sentence now on a counter menu also still appear in a `.cook` prose row?

`src/data/counters.json` is the file holding the notes; `src/lib/counters.ts` still types a
section as `{ title, items }` with **no `notes` field** (T-005-05 open concern 2), and
`src/pages/menu/[counter].astro` carries a local cast around it. Two tickets have now added data
through that gap.

---

## 6. `docs/knowledge/voice.md` — where it can have drifted

140 lines, written by T-005-01 *before* any of the cutting happened. Four passages describe the
collection as it was, and each is a candidate for correction:

| Line | Says | Reality after T-005-04/05/06 |
| --- | --- | --- |
| `voice.md:54` | *"There are 278,833 characters in this collection that nobody has ever read."* | T-005-06: **172,003**. The count is a live measurement of the collection, not a historical claim |
| `voice.md:61-94` | the tonkotsu worked example at three lengths — 472-char paragraph, 250-char `slack:`, 132-char `step.1:` | T-005-04 rewrote that `slack:` line; T-005-06 cut step 3's body. The quoted "before" text may no longer be in the file |
| `voice.md:133-136` | *"`slack:` is the opposite: almost every declared line is over"* | T-005-04: `slack reason 0` over cap, mean 111.7, max 151 |
| `voice.md:138-141` | *"Today the checker **reports and exits zero** … Once the collection is clean it flips to failing."* | this ticket flips it |

The ticket's criterion is narrower and sharper than "update the stale numbers": *"Where a ticket
decided something different from what T-005-01 wrote, the document is corrected and the change is
noted."* Two candidates for a genuine decision-level difference:

- **The step-body field definition.** `voice.md`'s table row says the step's own words go
  *"nowhere, once `step.N:` is set"* — which is right — but T-005-01's own review records that the
  ticket's narrower description (only steps that become operations) was wrong and the field is
  wider. `voice.md` already states it correctly; the number beside it is what moved.
- **The aim of about 120 for `slack:`.** T-005-04 left 78 lines between 120 and 151 and argued
  they carry two facts legitimately. That is a ticket declining an aim, not breaking a cap.

---

## 7. `docs/gaps/voice.md` — the shape to match

`docs/gaps/mobile.md`, 272 lines, is the model the ticket names. Its shape:

- A title stating what the site still does badly, and an opening paragraph saying it is not a
  counter page.
- When it was written and off what — *"Written at the end of S-004, after six tickets took the
  site from two width queries to thirteen."*
- How everything was measured, with the command.
- **Ranked by what it costs a person**, not by how hard it is to fix.
- Then numbered `## N. <plain sentence>` entries, each with **What happens** · a measured table ·
  **What a fix takes** · **Mitigation or cure**.

`docs/gaps/README.md` is the index for the per-counter files and has its own shape (a tally,
"what no single classifier could see", "the gaps to fill first", "recorded and not done"). It does
not link `mobile.md`, so a voice file is not obliged to register there.

The three findings the ticket says must open the file are all already written down:

1. **Footers that are really unwritten cooking steps** — T-005-05 review §5, fifteen recipes
   named with the verb and the operation hiding in the prose, plus two timing qualifiers listed
   separately so they are not double-counted, plus eight candidates explicitly rejected.
2. **Bodies that would now make good labels on their own** — T-005-06 `findings.md` (in the
   gitignored attempt dir) is summarised in its review §8: **four**, not 234, because a body
   carrying `@ingredient{}` markup renders as a fragment. Its recommendation is *leave them*. The
   companion question — whether `>> step.N:` overrides still earn their place — is open.
3. **`See how it is written` shows raw cooklang** — `src/pages/[slug].astro:133`. No ticket owned
   it.

---

## 8. Constraints and assumptions carried into Design

1. **`npm run verify` starts with `npm run check`.** Flipping the flag means every later phase of
   this ticket, and every future ticket, fails until the 17 notes are under cap. Order matters.
2. **`verify:mobile` is not safe to run while another build is in flight** — T-005-02 open
   concern 1, T-005-05 §7. Nothing runs beside this ticket, so a plain run should be clean; if it
   is not, `--root` against a private `--outDir` is the recorded way through.
3. **`.lisa/attempts/*/work/` is gitignored.** Prior tickets' tooling is on this machine but not
   in the repository. Anything this ticket wants to keep has to be an artifact Lisa publishes to
   `docs/active/work/T-005-07/`, or a committed file.
4. **`dist/` and `src/generated/recipes.json` are both current** — built 11:34–11:35, after the
   last recipe commit `78310a9`. They can be used as the "after" state, but should be rebuilt
   once to be sure.
5. **An ingredient note is inside a step body.** Editing one edits a `.cook` step line. The
   T-005-06 guarantees that must survive any note edit: operation labels byte-identical,
   `>> step.N:` lines untouched, merge tree unchanged, ingredient names and quantities unchanged.
   The note is the only part of `@name{qty}(note)` that may move.
6. **No test file covers `scripts/`.** Four prior tickets in this story each recorded declining to
   add one, for the same reason: the scripts are thin drivers over `src/lib/`, which carries all
   833 tests.
7. **The story forbids exempting.** It also forbids touching operation cell labels, and forbids
   structural change to the merge tree, the timeline or the views.
