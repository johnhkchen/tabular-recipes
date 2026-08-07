# T-008-01 — Progress

Eight steps planned, eight executed, seven commits. No step was skipped and one design decision
moved during implementation (step 5). `npm run verify` exits 0.

`node` is not on the default `PATH` here; everything below ran with
`~/.nvm/versions/node/v24.18.1/bin` prepended, matching `.node-version`.

---

## Commits

| # | Commit | Paths |
| --- | --- | --- |
| 1 | `b45aeba` Add the washing-up reader and its tests | `src/lib/washing-up.ts`, `src/lib/washing-up.test.ts` |
| 2 | `eb2c867` Read the washing-up line and type it | `src/lib/tree.ts`, `scripts/normalise.mjs` |
| 3 | `5f67bd4` Refuse a half-declared washing-up line, warn about the rest | `scripts/parse-recipes.mjs`, `scripts/check-recipes.mjs` |
| 4 | `0d01f9d` Say what eleven recipes leave in the sink | 11 × `recipes/**/*.cook` |
| 5 | `1b9f228` Put the sink beside the clock | `src/components/Timeline.astro`, `src/pages/[slug].astro` |
| 6 | `387efae` Hold the count, the zero and the warning to their word | `src/lib/washing-up.test.ts` |
| 7 | `d07091e` Write the washing-up line into the authoring contract | `README.md` |

Every commit went through `lisa commit-ticket` with exact `--include` paths. The ordinary index
was never used. `git status` at the end shows no ticket-owned file staged, modified or untracked.

---

## Step by step

### 1-2 — `src/lib/washing-up.ts` and its unit tests ✅

Written to Structure §2. `readWashingUp`, `washingUpWord`, `unaccountedCookware`, `pluralEntries`,
`NOTHING_WORDS`, `NEVER_WASHED`. 17 unit tests green before anything consumed it.

**Deviation, caught while writing:** `NEVER_WASHED` was specified as a word-inside-the-name match.
That is wrong in the worst possible way here — `#Dutch oven{}` contains the word `oven`, so the one
vessel this field exists to talk about would have been silently excused from the cross-check.
Changed to **whole-name matching**, with `toaster oven`, `charcoal grill`, `gas grill` and
`refrigerator` added explicitly so the real appliance names still land. Pinned by the test *"does
not excuse a Dutch oven for ending in the word oven"*.

`npx tsc --noEmit` is not available — TypeScript is not a dependency of this project (Astro strips
types at build; `node` strips them at run). Typing is therefore checked by `astro build` in step 8,
which is what `npm run verify` does anyway.

### 3 — `scripts/normalise.mjs`, `src/lib/tree.ts` ✅

Read placed beside `readSlack`, before the `PROMOTED` loop deletes the key. `'washing-up'` added to
`PROMOTED`. `washingUp` and `washingUpProblem` emitted; `RawRecipe` typed; `variants` gained
`washingUpCount`.

Verified before any recipe declared one:

```
recipes 664 · declared 0 · problems 0 · field present on all true · loose metadata leak 0
```

### 4 — the two guards ✅

`parse-recipes.mjs`: the `slack` block became *the authored fields, which are whole or absent and
never halfway*, looping over both problems. Variant mapping carries the count. Summary line gained
`· washing-up in N`.

`check-recipes.mjs`: `washingUpProblem` → `problems` (fails); `unaccountedCookware` and
`pluralEntries` → `notes` (prints, never increments `failed`).

`npm run check` stayed green on the untouched 664 with **no new notes**, which is the proof that
every advisory is gated on `washingUp !== null`.

Three throwaway probes, written to the scratchpad and deleted after:

| Probe | Exit |
| --- | ---: |
| `>> washing-up: 2` | **1** — `FAIL … which is a number rather than a thing` |
| `>> washing-up: a chopping board` (file names `#Dutch oven{}`) | **0** — `ok`, plus the advisory |
| `>> washing-up:` (empty) | **1** — `FAIL … is there but says nothing` |

### 5 — the eleven worked examples ✅

**The evidence the ticket asks for.** Printed from `src/generated/recipes.json` after
`npm run recipes`, so these are the parsed values and not the source lines:

| slug | the line as written | count |
| --- | --- | ---: |
| `ratatouille` | the Dutch oven | **1** |
| `one-pot-pasta` | the deep skillet | **1** |
| `shakshuka` | the cast-iron skillet | **1** |
| `general-tsos-chicken` | the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze | **5** |
| `orange-chicken` | the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze | **5** |
| `sesame-chicken` | the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze | **5** |
| `sweet-and-sour-pork` | the wok, a bowl to marinate in, a dish to dredge in, a rack to drain on | **4** |
| `pho-broth-instant-pot` | the Instant Pot, a skillet for the spices, a fine sieve, the spice sachet | **4** |
| `beef-bourguignon-instant-pot` | the Instant Pot, a skillet for the garnish, a plate for the lardons | **3** |
| `beef-bourguignon` | the Dutch oven, a skillet for the garnish, a plate for the lardons | **3** |
| `memphis-dry-rub` | *(nothing)* | **0** |

`declared: 11 · zero: 1 · derivation holds (count === items.length): true`

**How each line was arrived at, and where it disagrees with `cookware`:**

- **The four wok recipes** declare exactly `['wok']`. Each line was read off the steps: velvet in a
  bowl (step 1), dredge in a dish (step 2), *"rest them on a rack"* (step 3), *"smooth in a bowl"*
  (step 4), the wok. **Four of the five things are never marked `#…{}`.** `sweet-and-sour-pork` is
  four rather than five because its sauce is a separate recipe poured in, so there is no glaze
  bowl. This is the ticket's premise reproduced from the files rather than quoted.
- **`beef-bourguignon` (plain)** declares `['Dutch oven', 'oven']` — the skillet its garnish is
  glazed in is never named, and the plate the lardons wait on is never named. Two of its three
  things are invisible to `cookware`. The `#oven{}` is a fixture and correctly draws no advisory.
- **`ratatouille`, `one-pot-pasta`, `shakshuka`** each wash exactly one thing, honestly: one
  vessel, and each is served out of it or eaten from bread. These are the One Pot shelf keeping
  its promise, and `ratatouille` is the criterion's *"one from One Pot that genuinely washes one
  thing."*
- **`memphis-dry-rub`** names no cookware at all and is dry spices rubbed and whisked together — a
  blend that is made in the jar it is kept in. It is the zero.

**Deviation from Plan.** `pho-broth-instant-pot`'s line was first written as *"the sachet cloth"*,
which drew the cross-check advisory against its `#spice sachet{}` — the check working, but a
warning that would print on every `npm run check` forever. Reworded to *"the spice sachet"*, which
is the same object in the file's own words. The advisory is now proved by the test fixture instead,
where it belongs. The unit test's example line was updated to match.

`node scripts/check-recipes.mjs` over exactly the eleven: **all `ok`, exit 0, no notes.**

### 6 — the render ✅

`Timeline.astro`: `washingUp` beside `slack`, a fourth `<dl>` after the slack block, and `.slack`'s
CSS rules extended to `.washing-up` **by selector list rather than by a second block**, so the two
panels cannot drift apart. Added to the `@media print` group.

`[slug].astro`: `variantCounts` — true only when this recipe and every variant have declared.

Read off the built HTML:

```
general-tsos-chicken   What you'll wash · Five things — the wok, a bowl to velvet in, …
memphis-dry-rub        What you'll wash · Nothing to wash                 (no dash, no list)
beef-stew              grep -c "What you'll wash" → 0                     (undeclared: nothing)
beef-bourguignon       Also written for Instant Pot (3 to wash)           (both declared)
beef-stew              Also written for Instant Pot, Slow Cooker          (unchanged)
```

`beef-stew` is the control pair and its sentence is byte-identical to before.

### 7 — the collection tests ✅

Appended four collection assertions and a four-case integration block that spawns
`scripts/check-recipes.mjs` against a fixture in `os.tmpdir()` and asserts on the **exit code**:
warn → 0, quiet → 0 with no `washing-up:` output, number → 1, empty → 1. That is the only place
"warns without failing" can actually be proved, because the property lives in a process's exit
status and not in a function's return value.

28 tests in the file; **867 across the suite, all green.**

### 8 — `README.md` ✅

A `washing-up` bullet after `slack`, in the same shape: what it is, **two example lines** (a list
and `nothing`), the derived-count rule, the boundary, the zero-is-not-absent rule, and why the
cross-check warns rather than fails. The metadata block at the top of the section gained a
`washing-up` line. `src/lib/washing-up.ts` added to the "How it fits together" table.

### 9 — `npm run verify` ✅

```
all 664 file(s) draw a table.
counters: 664 named, 0 inferred from category · timers in 640 · pairings 770 · washing-up in 11
Test Files 10 passed (10) · Tests 867 passed (867)
688 page(s) built
VERIFY EXIT=0
```

---

## What was decided differently from Design, and why

1. **`NEVER_WASHED` matches whole names, not words inside them** (step 1). A word match excused
   `#Dutch oven{}`. Caught before the module had a consumer.
2. **`pho-broth-instant-pot` says "the spice sachet"** (step 5), so the collection carries no
   standing advisory. The warning is exercised by a test fixture instead.

Nothing else moved. D5's boundary, D3's sentinel, D7's no-cap and D9's all-or-nothing switcher were
implemented as argued.

## Not done, and deliberately

- **No `CAPS` entry for the line** (Design D7). `docs/knowledge/voice.md` mirrors that table and is
  outside this ticket's permitted paths; adding a sixth cap would leave that document wrong.
  Carried to Review as a follow-up.
- **`src/data/counters.json` untouched.** T-007-05 and T-008-02 hold it.
- **`npm run verify:mobile` not run.** It drives a browser and is not part of `npm run verify`;
  the new panel reuses `.slack`'s rules exactly and adds no new layout.
