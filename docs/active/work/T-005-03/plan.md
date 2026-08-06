# T-005-03 · Plan — ordered steps and how each is proved

Nine steps, three commits. Every step names what proves it, and the proof is a command whose
output goes into `progress.md`.

---

## Step 0 — baseline (done before Research finished)

`npm run recipes && npm run build`, then `cp -R dist` to the attempt scratchpad.

This is the control for the byte-identity criterion, and it has to be taken from the tree as
it stands, before anything is edited. Captured: 682 pages, CSS bundle `Base.DmNFMqhT.css`.

**Proof:** the baseline directory exists and `git status --short src/ scripts/` is empty.

---

## Step 1 — write the five notes into `counters.json`

Add `notes` to three sections of `The Slow Cooker`, and one sentence to the file's `"//"`
header about `menu-sections.mjs --write`.

The five sentences, already drafted and measured (design §3):

| Section | `of` | Chars |
| --- | --- | ---: |
| Braises, left alone all day | *(group)* | 119 |
| Braises, left alone all day | `baked-turkey-wings-slow-cooker` | 118 |
| Braises, left alone all day | `new-england-boiled-dinner-slow-cooker` | 111 |
| Beans and pulses | `boston-baked-beans-slow-cooker` | 113 |
| Whole birds and big cuts | `soy-sauce-chicken-slow-cooker` | 84 |

**Proof:**
- `node -e` reads the file back and prints each note with its length — five notes, all ≤ 120.
- `npm run verify` still passes. Nothing reads the key yet, so this must be a no-op.
- `dist` diffs clean against the baseline. Same reason.

---

## Step 2 — the validator in `parse-recipes.mjs`

`NOTE_CAP = 120` and one block between counters and pairings, four checks (structure §2).

**Proof — every failure path is fired against the real file, not asserted:**

| Case | Injected fault | Expected |
| --- | --- | --- |
| 1 | `"notes": "a string"` | throws, names counter + section |
| 1 | `{ "of": "…" }` with no `note` | throws, names counter + section |
| 2 | a 121-character note | throws, `121/120` |
| 3 | `of: "boston-baked-beans-slowcooker"` (typo) | throws, names counter, section, slug, and the slugs the section lists |
| 4 | `of` on a slug listed in the section but shelved elsewhere | throws, names the counters it is really at |

Each is injected with a temporary copy of `counters.json`, the message is captured into
`progress.md` verbatim, and the file is restored before the next case. After all five, the
real file parses clean.

`git diff --stat src/data/counters.json` after the sweep must show only the Step 1 change.

**Commit A** — `counters.json` + `parse-recipes.mjs`. Data and its guard, together, because
neither is meaningful alone: the data with no validator is unchecked, and the validator with
no data has nothing to run against.

---

## Step 3 — the renderer in `[counter].astro`

Frontmatter lookup, two guarded insertions, one `<style is:global>` (structure §3).

**Proof:** `npm run build` succeeds, 682 pages.

---

## Step 4 — byte-identity of the twenty note-less counters

```
diff -r <baseline>/menu dist/menu
```

Expected, and to be reported exactly rather than summarised:

- `dist/menu/slow-cooker/index.html` differs in `<main>` — that is the whole point.
- The other twenty differ by exactly one inlined `<style>` element at the end of `<head>`,
  and by nothing else.
- To show the second claim rather than assert it: strip `<style>…</style>` from `<head>` on
  both sides and diff again — the twenty must come out identical, byte for byte.
- `dist/_astro/*.css` filenames unchanged, which proves the 661 non-menu pages are untouched.
- `diff -r baseline dist` over the whole tree, to catch anything not thought of.

**This is the acceptance criterion that says "show this rather than asserting it", so the
command and its output both go into `progress.md`.**

---

## Step 5 — the rendered note, read

`grep` the built `slow-cooker/index.html` for `menu-note` and `item-note` and print the
surrounding markup. Confirm:

- the group note is between `</h2>` and `<ul>`;
- each item note is inside its `<li>`, after `</a>`;
- the anchor's inner text is unchanged from the baseline for those four items — i.e. the
  link's accessible name did not grow.

---

## Step 6 — `npm run verify`

`check && recipes && vitest run && astro build`. Expected: 658 files draw a table, 658
recipes parsed, 832 tests in 9 files, 682 pages built, exit 0.

The cap report from `check-recipes.mjs` should be unchanged from T-005-01's — 1209 fields over
cap in 499 files — because no `.cook` file was touched. That number is itself a proof that
this ticket left the recipes alone.

---

## Step 7 — `npm run verify:mobile`

`npm run build && node scripts/check-overflow.mjs --width 375,390,768 && node
scripts/check-touch.mjs`.

Needs Chrome on the machine; exits 2 if it cannot look, which is not a pass. If it exits 2 the
ticket is blocked on the operator, not quietly waved through.

**Named targets from the acceptance criteria:** The Bowl Shop (103 recipes) and Bakery (107)
must show no horizontal scroll on `<body>` at 375px. Both are note-less, so both are also
covered by Step 4 — but they are checked live anyway, because Step 4 proves the markup did not
change and this proves the layout did not.

`slow-cooker` is the page that *did* change and is the one that actually tests a note at
375px, where `.menu` is a single ~343px column and a 119-character note wraps to three lines.

`check-touch.mjs` must still pass: the item notes sit outside the anchors, so the 44px minimum
applies to the same elements it did before.

**Commit B** — `[counter].astro`.

---

## Step 8 — the handoff record for T-005-05

`progress.md` gains a table with one row per moved sentence:

| Recipe | Source | Chars in | Counter / section | Note | Chars out |

so T-005-05 can check its list against it and not move the same sentence twice. The group note
is listed separately and marked **not moved** — it was written for the section and no recipe
lost it.

The 31 other shelf-talk rows found in research §6 are listed too, with their counter and
section, as a starting list for T-005-05 rather than something it re-derives.

---

## Step 9 — Review

`review.md` and `review-disposition.json`, then `lisa check-disposition T-005-03`.

Open concerns to carry, all known now:

1. `<head>` gains an inlined `<style>` on twenty note-less menu pages. `<body>` is
   byte-identical. The full text of the difference is quoted, and design §5 says what the two
   alternatives cost.
2. `src/lib/counters.ts` does not describe `notes`. Outside the file list.
3. `scripts/menu-sections.mjs --write` discards `notes`. Outside the file list; warned about
   in `counters.json`'s own header.
4. `docs/knowledge/voice.md` does not name the field or its cap for T-005-05. The cap did not
   differ, so the ticket's escape hatch for touching it did not open.

---

## Testing strategy

**No new vitest file, and that is a decision, matching T-005-01's.** `scripts/` has no test
file in this project; the pure libraries under `src/lib/` carry the suite, and every script is
a thin driver over them. `parse-recipes.mjs` exports nothing and is imported by nothing — it
is a top-level program that reads the disk and throws. Extracting the note check into a
testable module would mean creating a new file, which is outside the ticket's list.

What stands in for it is the five-case fault injection in Step 2: every branch of the
validator is fired against the real data file and its message is recorded. That covers the
part that could silently be wrong (a check that never fires) rather than the part that could
not (a throw that does not throw).

The renderer's coverage is the `dist` diff, which is stronger than a unit test would be: it
compares every one of 682 built pages against the tree as it stood before the change.

## What would make this fail

- A note that cannot be said in 120 characters. Then design §3 is wrong and `voice.md` gets a
  row. Not expected — all five drafts fit with room.
- `check-overflow.mjs` exiting 2 for want of a browser. That is a block on the operator.
- The `dist` diff showing a change in a page that has no notes and is not a menu. That would
  mean the style landed in the shared bundle, and the fix is in design §5's table.
