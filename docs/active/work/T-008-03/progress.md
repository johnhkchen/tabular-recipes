# T-008-03 — Progress

Ten planned steps, ten executed, **five commits, 145 files annotated**. One deviation, recorded in
§4. `node` ran from `~/.nvm/versions/node/v24.18.1/bin` throughout, as T-008-01 recorded.

---

## Commits

| # | Commit | Files | What |
| --- | --- | --: | --- |
| 1 | `d93f15b` Say what the One Pot shelf actually washes | 69 | the whole One Pot shelf bar T-008-01's four |
| 2 | `70eafcc` Say what the Instant Pot shelf actually washes | 23 | the whole Instant Pot shelf bar T-008-01's two |
| 3 | `a01178a` Say what the slow cooker leaves in the sink | 20 | all twenty Slow Cooker files |
| 4 | `13890dd` Say what the basket would be washing against | 20 | the existing slugs the air-fryer gap page ranks |
| 5 | `91a66c5` Give every kit recipe a plain half to compare against | 14 | 13 plain siblings + one correction |

Every commit went through `lisa commit-ticket` with exact `--include` paths, generated from the
pinned list rather than typed. **The ordinary index was never used.** No `git add`, no `-A`, no
ordinary `git commit`. `git status --porcelain recipes/` at the end shows nothing of this ticket's
staged, modified or untracked — the only untracked `.cook` files are T-008-04's, which arrived
during the run and were not touched.

## Step by step

### 0 — pin the tree ✅

`git status --porcelain recipes/` → 0. `find recipes -name '*.cook'` → **664**.
`grep -rl washing-up recipes/` → **11**. Base commit `ce86973`.

**The pool, measured rather than taken from the ticket:** One Pot **73** (the ticket says 68 — see
`research.md` §3), Instant Pot 25, The Slow Cooker 20, no overlap → 118; plus the 20 existing slugs
`docs/gaps/air-fryer-and-pot.md` ranks that no shelf already claimed → **138**; plus the 13 plain
siblings an acceptance criterion needs → **151**, of which 6 were already annotated. **145 to
write.** Target was 100.

### 1 — the insertion script ✅

`scratchpad/annotate.mjs`. Takes `slug → line`, inserts after the last `>> ` line of the metadata
block, refuses a file that already declares. Proved on `tortilla-espanola`: one added line, zero
removed. **Not committed** — `scripts/` is not this ticket's, and the reading it moves is the human
part anyway.

### 2 — Batch 1, One Pot, 69 files ✅

Read in seven sub-batches of about ten, from a condensed dump printing each file's counters,
`cookware`, and step prose with the Cooklang markup flattened. `npm run recipes` after the batch:
`washing-up in 80` (= 11 + 69). Distribution 1→40, 2→25, 3→6, 4→2.

**Where the reading disagreed with `cookware`, which is most of the interesting rows:**

| slug | count | what `cookware` could never see |
| --- | --: | --- |
| `chile-verde` | 4 | a tray under the broiler, a bowl to steam the skins, a blender jug — the file names only `Dutch oven` and `broiler` |
| `country-fried-steak` | 4 | a flour dish, an egg-wash bowl, a rack — the file names one `cast-iron skillet` |
| `tinga-de-pollo` | 3 | a poaching pot and a blender jug, neither marked |
| `tortilla-espanola` | 3 | its own prose says it: *"One pan, one bowl and a plate to turn it on"* |
| `wonton-soup` | 3 | a second pot for the broth, simmered while the wontons boil |
| `white-cut-chicken` | 3 | the ice bath, which is a bowl the size of the bird |
| `risotto-alla-milanese` | 2 | the pan the saffron stock is steeped in and ladled from |
| `beef-stew` | 2 | the bowl the beef is tossed with flour in, before the pot |
| `oxtails`, `rogan-josh` | 2 | a cup to slake starch or chile powder in |

**40 of the 73 wash exactly one thing**, and those lines took as long to write as the others: the
work was reading each file to the end to be sure nothing left the pot.

### 3 — Batch 2, Instant Pot, 23 files ✅

`washing-up in 103`. Bar 2 collected in the same pass: **four files brown or char outside the pot**,
exactly the four `docs/gaps/air-fryer-and-pot.md` names. Nothing new found. (`findings.md` §3.)

The expensive end of this shelf is not the braises — those are the pot alone — but the broths:
`chintan-broth-instant-pot` washes **6** (pot, colander, sieve, cloth, settling jug, fat jar), the
most on the site alongside its plain sibling.

### 4 — Batch 3, The Slow Cooker, 20 files ✅

`washing-up in 123` (plus one file T-008-04 had just landed → the summary read 124).

**T-008-01's claim checked and confirmed:** 15 of 20 brown or sweat in a skillet before the crock.
Mean washing-up 3.05, nearly double One Pot's 1.59. Only two wash one thing — `irish-stew-slow-cooker`
and `new-england-boiled-dinner-slow-cooker`, the two that brown nothing.

**Deviation (the only one).** `tonkotsu-broth-instant-pot` was written in batch 2 as *"the Instant
Pot, a colander to drain and scrub the bones in, a coarse sieve, a container for the strained
broth"* (4). Reading its plain sibling in batch 5 showed both files parboil and scrub identically
and the plain one has no drain step at all, so the colander was an invention in one file and not
the other. **Corrected to 3 in commit 5**, which is the single removed line in the whole diff. The
rule it broke is `findings.md` §1 rule 15: *count what the file says, do not invent a vessel.*

### 5 — Batch 4, the air-fryer gap candidates, 20 files ✅

`washing-up in 144`. These are the plain files the new counter's ranked list points at, so each was
read for **the vessel a basket would remove**: `batata-harra` washes 5 (parboil pot, colander,
frying pot, rack, mortar), `french-fries` 3, `crispy-roast-potatoes` 3 — *"a pot plus a colander
plus the basket"*, exactly as the gap page predicted at rank 20.

`red-lentil-soup` came out at **1**, which is the gap page's own reading at rank 23 (*"one thing, if
the blending is done with a stick blender in the pot"*), and it is what fixed the immersion-blender
convention (`findings.md` §1 rule 7).

### 6 — Batch 5, the plain siblings, 13 files + 1 correction ✅

`washing-up in 161` (156 of them this ticket's and T-008-01's; the rest T-008-04's). **145 written,
target was 100.**

### 7 — the cross-check ✅

`npm run check` over the whole collection: **7 notes, 0 failures, exit 0.** All seven are
`unaccountedCookware` on a `#fork{}`, `#potato masher{}` or `#immersion blender{}` — utensils, which
convention rule 7 excludes. **No `pluralEntries` note fired on 145 lines.** Output pasted verbatim
in `findings.md` §9.

*(The first run of this step exited 1 on two over-cap operation cells in
`air-fryer-corn-ribs.cook` and `air-fryer-padron-peppers.cook`, both T-008-04's untracked files.
They were fixed by that ticket and the re-run is clean.)*

### 8 — the measurements ✅

`scratchpad/measure.mjs`, reproducible. All in `findings.md`: the One Pot ≥3 ranking (**8 of 73**),
the four browning-outside files, the 45-dish plain-versus-kit table with its three tallies, the gate
count (**0 of 151**, with bar 1 now readable on every one of them), the four wok recipes confirmed
at 5/5/5/4, and the uncountable list (**none**).

### 9 — the diff audit ✅

Per commit: 146 added lines, **all of them `>> washing-up:`**, one removed line (the §4
correction), zero non-`recipes/` paths. Table in `findings.md` §10.

### 10 — verify ✅

**`npm run verify` exits 0 at commit `ca4018e`:** 685 files check with 7 advisory notes, 685 parse
with `washing-up in 177`, **1005 tests pass in 13 files**, the build completes.

It went red in between, twice, and neither was this ticket's:

- **`src/lib/icons.test.ts`** listed 15 operation verbs falling through to the fallback icon — every
  one of them opening a cell in an `air-fryer-*.cook` file T-008-04 was writing, traced file by
  file. **This ticket adds no operations at all**, only metadata lines, and the diff audit proves
  it. T-008-04 closed it in `ca4018e` by rewording its own labels.
- **Two operation cells over cap**, also T-008-04's, also fixed by them.

**A third collision resolved itself while this ran.** `src/components/dials.test.ts` (T-010-02)
pinned *"653 sinks nobody wrote down"* as an exact assertion, which every one of these 145 lines
breaks. That ticket rewrote the assertion to a shape check mid-flight, with a comment naming what
happened: *"the sink went from 11 answerable to 164 between two runs… on a shared branch an
exact-count assertion is not a guard, it is a tripwire strung across everybody else's
`npm run verify`."* Nothing was needed from here, and nothing in `src/` was touched.

