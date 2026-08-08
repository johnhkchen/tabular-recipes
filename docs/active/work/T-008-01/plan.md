# T-008-01 — Plan

Eight steps, each independently verifiable, each a commit. The verification command is written
beside every one; nothing advances on "it looks right".

`node`/`npm` are not on the default `PATH` in this environment — `.node-version` says `24.18.1` and
it lives at `~/.nvm/versions/node/v24.18.1/bin`. Every command below assumes that prefix is
exported first.

---

## Step 1 — `src/lib/washing-up.ts`

Write the module exactly as Structure §2 specifies: header comment, `NOTHING_WORDS`,
`NEVER_WASHED`, `WashingUp`, `WashingUpReading`, `readWashingUp`, `washingUpWord`,
`unaccountedCookware`, `pluralEntries`.

Nothing imports it yet, so this step cannot break the build.

**Verify:** `npx tsc --noEmit` clean (config at `tsconfig.json`).
**Commit:** `lisa commit-ticket --include src/lib/washing-up.ts`

## Step 2 — `src/lib/washing-up.test.ts`, unit blocks

The first three `describe` blocks from Structure §9 — `readWashingUp`, `washingUpWord`, and the
advisory pair. The fourth block (collection) is **not** written yet; it needs step 5's data.

Three of the `readWashingUp` cases are the ticket's evidence requirement and use real lines from
the files step 5 annotates, so the number in the test is the number the site will show:

| Line under test | Expected `count` |
| --- | ---: |
| `the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze` | 5 |
| `the Instant Pot, a skillet for the spices, a fine sieve, the sachet cloth` | 4 |
| `the Dutch oven` | 1 |
| `nothing` | 0 |

**Verify:** `npx vitest run src/lib/washing-up.test.ts` — all green.
**Commit:** with step 1 if step 1 has not landed, otherwise its own.

## Step 3 — `src/lib/tree.ts` and `scripts/normalise.mjs`

Structure §3 and §4. The type and its producer are one change and land together.

Order inside `normalise()` matters: read `metadata['washing-up']` **before** the `PROMOTED` loop
deletes it. Placing the read beside the `readSlack` call (line ~212) satisfies that, because
`PROMOTED` is line ~215.

**Verify:**
```sh
npm run recipes                                   # writes src/generated/recipes.json
node -e "const r=require('./src/generated/recipes.json');
  console.log(r.length, r.filter(x=>x.washingUp!==null).length,
              r.filter(x=>x.washingUpProblem).length)"
```
Expect `<n> 0 0` — the field exists on every recipe and no file has declared one yet. Also confirm
no recipe still carries `washing-up` in loose `metadata`.

**Commit:** `--include src/lib/tree.ts scripts/normalise.mjs`

## Step 4 — the two guards

`scripts/parse-recipes.mjs` (Structure §5) and `scripts/check-recipes.mjs` (Structure §6).

**Verify:**
```sh
npm run check          # must stay green: 0 failures, no new notes on the untouched collection
npm run recipes        # must not throw
```
Then a throwaway probe, **written to the scratchpad and never to `recipes/`**: a copy of
`ratatouille.cook` with `>> washing-up: 2` must make `check-recipes.mjs` print `FAIL` and exit 1;
with `>> washing-up: the Dutch oven, a chopping board` and its `#Dutch oven{}` intact it must print
`ok` and exit 0. Delete the probe afterwards.

**Commit:** `--include scripts/parse-recipes.mjs scripts/check-recipes.mjs`

## Step 5 — the eleven worked examples

The table in Design, "The worked examples, chosen". One `>> washing-up:` line per file, inserted
directly **after the `>> slack:` line** where one exists and after `>> time:` where it does not, so
the two authored fields sit together in every file.

Files:

```
recipes/stews-and-braises/ratatouille.cook                      1
recipes/pasta/one-pot-pasta.cook                                1
recipes/eggs/shakshuka.cook                                     1
recipes/stir-fries/general-tsos-chicken.cook                    5
recipes/stir-fries/orange-chicken.cook                          5
recipes/stir-fries/sesame-chicken.cook                          5
recipes/stir-fries/sweet-and-sour-pork.cook                     4
recipes/soups/pho-broth-instant-pot.cook                        4
recipes/stews-and-braises/beef-bourguignon-instant-pot.cook     3
recipes/stews-and-braises/beef-bourguignon.cook                 3
recipes/spice-blends-and-marinades/memphis-dry-rub.cook         0
```

Each line is written by **reading that file's steps**, not by copying its `cookware` array. Where
the two disagree the disagreement is the point and is recorded in `progress.md`.

**Verify:**
```sh
node scripts/check-recipes.mjs <the eleven paths>      # all ok, exit 0
npm run recipes
node -e "…print slug, count, items for the eleven…"    # the evidence table
```
This step produces the ticket's required evidence: *the parse of at least three real lines with the
number each produced.* The full eleven-row output is pasted into `progress.md`.

Expected advisories, and each is correct rather than a bug to fix:
- `pho-broth-instant-pot` names `#spice sachet{}` — accounted for by *"the sachet cloth"*.
- `beef-bourguignon` names `#oven{}` — a fixture, so no advisory.
- Any file naming cookware the line omits should produce exactly one note and still print `ok`.

**Commit:** `--include` the eleven exact paths.

## Step 6 — the render

`src/components/Timeline.astro` and `src/pages/[slug].astro` (Structure §7, §8).

**Verify:**
```sh
npx astro build
grep -c "What you'll wash" dist/general-tsos-chicken/index.html      # 1
grep -c "What you'll wash" dist/beef-stew/index.html                 # 0 — undeclared renders nothing
grep -o "Also written for[^<]*" dist/beef-bourguignon/index.html     # carries "(3 to wash)"
grep -o "Also written for[^<]*" dist/beef-stew/index.html            # unchanged, no counts
```
`beef-stew` / `beef-stew-instant-pot` is the control pair: neither declares, so the switcher must
be byte-identical to today. `beef-bourguignon` / `beef-bourguignon-instant-pot` is the treatment
pair: both declare, so both show counts.

Also `node scripts/check-overflow.mjs --width 375,390,768` if the build is already made — the new
well is full-width like `.slack`, so nothing should move, but the panel is on every recipe page.

**Commit:** `--include src/components/Timeline.astro src/pages/[slug].astro`

## Step 7 — the collection tests

Append the fourth `describe` block to `src/lib/washing-up.test.ts` (Structure §9) — including the
`execFileSync` integration test that proves the cookware advisory exits **0**.

Care with the integration test:
- fixture written to `os.tmpdir()`, cleaned up in `afterAll`
- it must draw a real table (≥3 ingredient rows, ≥3 operations) or the checker fails it for an
  unrelated reason and the test proves nothing
- assert on the exit code **and** on the advisory text, so a checker that stopped warning would
  fail the test rather than pass it quietly
- spawn `process.execPath`, not the string `node`, since `node` is not on `PATH` here

**Verify:** `npx vitest run` — the whole suite.
**Commit:** `--include src/lib/washing-up.test.ts`

## Step 8 — `README.md`

Into "Writing a recipe", after the `slack` bullet (README.md:73-93), matching its shape: one bullet
that says what the field is, a fenced block with **two example lines**, then the rules.

Content, per the ticket's criteria:
- the field, and that it renders next to the clock
- **two example lines** — a list and the sentinel
- **the count is derived from the list**, never written beside it, with the reason
- **`nothing` is a real answer and is not the same as leaving the line off**
- **the plate you eat off does not count** — and the boundary D5 settled, with its reason
- one entry is one thing; write "two bowls" as two entries
- the checker warns when named cookware is missing from the line, and why that is a warning

Also add `src/lib/washing-up.ts` to the "How it fits together" table beside the `src/lib/slack.ts`
row (README.md:166).

**Verify:** read it back cold; the field has to be writable by someone who has read only this page.
**Commit:** `--include README.md`

## Step 9 — `npm run verify`

`npm run check && npm run recipes && vitest run && astro build` — the one command that must pass.
Any failure sends the step that caused it back through its own verification, not a patch on top.

---

## Testing strategy, gathered

| Acceptance criterion | Where it is proved |
| --- | --- |
| a list parses to the right count | `readWashingUp` unit tests, four real lines (step 2) |
| a zero declaration parses and is not absent | unit: `readWashingUp('nothing')` → `{items:[],count:0}`, `toBeNull()` fails; collection: `memphis-dry-rub` has `count === 0` and `washingUp !== null` |
| a malformed line fails | unit: five refusal cases; integration: probe file exits 1 (step 4) |
| an undeclared recipe renders without the line | collection: `washingUp === null` for the majority; build: `grep -c` on `dist/beef-stew/index.html` is 0 (step 6) |
| the cookware cross-check warns without failing | `execFileSync` integration test asserting **exit 0** plus the advisory text (step 7) |
| count derived, never authored | collection test: `count === items.length` for every declared recipe; no code path anywhere writes `count` from metadata |
| ≥8 annotated, with the required members | collection test: `>= 8` declared, ≥1 zero, ≥1 with `count >= 4`; the specific files listed in `progress.md` |
| README documents it | step 8, read back |
| `npm run verify` passes | step 9 |

## Risks, and what each costs

1. **`.ts` imports from `.mjs`.** `normalise.mjs` already imports `../src/lib/slack.ts` and
   `../src/lib/meta.ts` (lines 7-9) and runs under bare `node`, so Node's type-stripping is already
   load-bearing here. `washing-up.ts` must stay in the same subset — **no enums, no decorators, no
   `satisfies`, no runtime-typed constructs.** Cost if broken: `npm run check` dies on import.
   Caught by step 3's verification.
2. **A worked example that is wrong about its own recipe.** Mitigated by reading every file's steps
   in step 5 and recording each count's justification in `progress.md`, where a reviewer can check
   it against the file.
3. **The advisory firing on the untouched collection.** It cannot: every advisory is gated on
   `washingUp !== null`, and 650-odd files are `null`. Confirmed by step 4's verification running
   `npm run check` before any file is annotated.
4. **The `[slug].astro` sentence changing for undeclared pairs.** Guarded by the all-or-nothing
   condition and by step 6's `beef-stew` control.
5. **`npm run verify` running `astro build` over 650 pages** — slow (minutes), so it runs once at
   step 9 and the per-step verification uses the cheaper commands.
