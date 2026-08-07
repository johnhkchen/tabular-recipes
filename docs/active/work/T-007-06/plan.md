# T-007-06 — Plan

Four commits, each independently verifiable. Data before code, because the throw added in step 2
fails `astro build` while the nine bad slugs are still in place.

`src/generated/` is gitignored (build product) — never include it in a commit.

---

## Step 0 — Record the before-half (no commit)

Already captured in `research.md` §3 and re-pasted into `progress.md`:

```
npm run build
node -e '<count data-slug per dist/menu/*/index.html, and the stated count>'
```

22 counters, rendered == stated on every one. Also record
`shasum -a 256 src/data/counters.json` for the round-trip evidence, and the current
`node scripts/menu-sections.mjs` output.

**Verification:** the before table exists in `progress.md` before anything is edited.

---

## Step 1 — Make the data honest

*Files:* `src/data/counters.json` (4 slugs), five `.cook` files.

1. Delete `general-tsos-chicken`, `orange-chicken`, `sesame-chicken`, `sweet-and-sour-pork` from
   One Pot / `Skillet dinners`. Hand edit — **not** `menu-sections.mjs --write`.
2. Append `Cha Chaan Teng` to the `>> counters:` line of `pineapple-bun`, `egg-custard-tart`,
   `beef-chow-fun`, `char-siu`, `club-sandwich`. Append only; `counters[0]` must not move.

**Verification (before committing):**

- `npm run check` passes — proves the five counter names parse and are known.
- `npm run recipes` regenerates; the nine-slug scan from research §2 now reports **0 dropped**.
- `npm run build`; Cha Chaan Teng prints **27**, One Pot still **73**, the other 20 counters
  byte-identical counts to the before table.
- `git diff --stat` shows exactly six files.
- JSON shape preserved: `JSON.parse` → `JSON.stringify(…, null, 2)` + `\n` equals the file.

**Commit:** `lisa commit-ticket --ticket-id T-007-06 --message "Shelve the five borrows and drop the four stale ones" --include src/data/counters.json --include recipes/breads/pineapple-bun.cook --include recipes/custards-and-puddings/egg-custard-tart.cook --include recipes/noodles/beef-chow-fun.cook --include recipes/stews-and-braises/char-siu.cook --include recipes/sandwiches-and-rolls/club-sandwich.cook`

*Risk:* if any of the five files is also owned by a concurrently running ticket, the commit is the
place that surfaces it. T-007-05 is a dependency and is complete, so the five are free.

---

## Step 2 — End the silent drop, with tests

*Files:* `src/lib/counters.ts`, `src/lib/counters.test.ts` (new).

1. Replace `.filter(Boolean)` in `menuFor`'s sectioned branch with resolve-and-collect; throw once
   with every offender named (structure §3). Diagnostics look up `all`; membership stays `mine`.
2. Update the `menuFor` doc comment with the rule.
3. Write `src/lib/counters.test.ts` — eight cases from structure §4.

**Testing strategy.** Unit tests own the *rule*; the post-build check (step 3) owns the *site*.
The tests use synthetic `RawRecipe` fixtures, not the generated collection: after step 1 the real
data has no offender, so a data-driven test could never exercise the throw, and a test that can
only pass is not a test. Each throw case asserts on message **content** (counter name, section
title, slug, where the recipe actually is), because the message is the deliverable — "fails a
check by name" is the acceptance criterion, not "fails".

**Verification:**

- `npx vitest run src/lib/counters.test.ts` — all green.
- `npx vitest run` — no sibling test regressed (`_search.json.test.ts` and `collection.test.ts`
  read the same data).
- `npm run build` still succeeds on the now-honest data — the throw must be silent when the data
  is right.
- Negative control: temporarily re-add `orange-chicken` to One Pot, confirm `astro build` fails
  and the message names `orange-chicken`, `One Pot`, `Skillet dinners` and `Takeout Counter`; then
  revert. Paste the failure into `progress.md` — it is the proof the drop is over.

**Commit:** `--include src/lib/counters.ts --include src/lib/counters.test.ts`

---

## Step 3 — The check, wired into `verify`

*Files:* `scripts/check-menus.mjs` (new), `package.json`.

1. Write the checker per structure §5: parse `dist/menu/*/index.html` into
   `heading → [slug]`, compare against `counters.json`, three assertions, one line per counter for
   all 22, exit 1 on any failure.
2. Append `&& node scripts/check-menus.mjs` to `verify`.

**Verification:**

- `npm run build && node scripts/check-menus.mjs` — 22 `ok` lines, exit 0. Paste the full output.
- Negative control A (a drop): re-add `orange-chicken` to One Pot → `astro build` now fails first,
  so instead point the checker at a hand-edited copy of `counters.json` in the scratchpad, or add
  a slug shelved at the counter but under the *wrong heading*, which `menuFor` accepts and only
  this checker can catch. That second case is the one that proves the checker earns its place;
  run it and paste the failure.
- Negative control B: `rm -rf dist && node scripts/check-menus.mjs` exits 1 with "run astro build
  first" — a bare run cannot pass vacuously.
- `npm run verify` end to end, green.

**Commit:** `--include scripts/check-menus.mjs --include package.json`

---

## Step 4 — Say what the code does

*Files:* `docs/knowledge/counters.md`, `src/data/counters.json` (header comment only).

1. New `### Sections` block in `counters.md` after the fallback paragraph (structure §7).
2. Extend the `"//"` header string in `counters.json` with the one-sentence rule.

**Verification:**

- `npm run verify` green (the header comment is inside a JSON string; a broken quote fails
  `npm run check` immediately).
- Re-read both against `src/lib/counters.ts` line by line: every claim in the prose must be a
  behaviour a test or the checker enforces.
- Round-trip: `shasum -a 256 src/data/counters.json`, run `node scripts/menu-sections.mjs`
  (dry run), `shasum` again — identical. Paste both hashes.

**Commit:** `--include docs/knowledge/counters.md --include src/data/counters.json`

---

## Evidence to collect for Review

Each maps to one acceptance criterion.

| Criterion | Evidence |
| --- | --- |
| decision made and argued | `design.md` — *borrowing is not a thing*, with its cost stated |
| no slug silently dropped | negative control in step 2 + `check-menus.mjs` output |
| the four resolved, not back on One Pot | `counters.json` diff; One Pot rendered 73 before and after; the four absent from `dist/menu/one-pot/index.html` |
| Cha Chaan Teng ≥ 20 incl. ≥ 4 pre-S-007, named | 27 printed; `pineapple-bun`, `egg-custard-tart`, `beef-chow-fun`, `char-siu`, `club-sandwich`, all first committed 2026-07-30 vs S-007's first commit 9120fb6 on 2026-08-07 — with the built page shown |
| a check exists, runs in `verify`, output over 22 | `scripts/check-menus.mjs`, the `verify` line, the pasted 22-line run |
| `menu-sections.mjs` round-trips byte for byte | sha256 before/after a dry run; `--write`'s pre-existing drift documented, not hidden |
| docs describe what the code does | `counters.md` §Sections + `counters.json` header diff |
| every other counter's count unchanged | before/after table, all 22 rows |
| `npm run verify` passes | full run pasted |
| only permitted files modified | `git status` / `git diff --stat` at the end |

## Known risks

1. **The throw is a behaviour change in a shared module.** Mitigated by step 1 landing first and by
   `npm run build` after step 2; `menuFor`'s only callers are two `.astro` files, both passing the
   full collection.
2. **`--write` still does not round-trip.** Pre-existing, caused by `docs/gaps/**` drift and by
   notes being dropped; `docs/gaps/**` is outside this ticket. Reported in Review, not half-fixed.
3. **Stale prose left behind** in `docs/gaps/cha-chaan-teng.md`, `docs/gaps/README.md`,
   `T-003-06` and `T-008-05`. Outside the modifiable set; each named in Review with the exact line.
4. **Cha Chaan Teng's `notes`**, if any, could now point at newly-shelved slugs —
   `parse-recipes.mjs` validates this and would fail `npm run recipes`. Watched in step 1.
