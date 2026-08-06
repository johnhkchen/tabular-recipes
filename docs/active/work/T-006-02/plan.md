# T-006-02 — Plan

Six steps. One mutates the tree; the rest are checks. Structure's step 0 is resolved below, so the
commit shape is already known.

## Step 0 (resolved) — what this ticket owns

`.gitignore` line 4 ignores `src/generated/`, so `src/generated/recipes.json` is a build product
that is **not** tracked and must **not** appear in a `--include` list. `dist/` is ignored too.
`git ls-files src/generated` returns nothing, confirming it.

The ticket therefore owns exactly fourteen paths:

```
recipes/bars-and-brownies/baklava.cook
recipes/breads/deli-rye-bread.cook
recipes/breads/focaccia.cook
recipes/breads/no-knead-bread.cook
recipes/breads/teleras.cook
recipes/custards-and-puddings/chocoflan.cook
recipes/custards-and-puddings/lotus-seed-paste.cook
recipes/dressings-and-dips/mint-chutney.cook
recipes/dressings-and-dips/sour-dill-pickles.cook
recipes/flatbreads-and-pancakes/taro-cake.cook
recipes/flatbreads-and-pancakes/turnip-cake.cook
recipes/soups/chintan-broth.cook
recipes/spice-blends-and-marinades/bulgogi-marinade.cook
recipes/stews-and-braises/chicken-adobo.cook
```

T-006-01 owns `src/pages/[slug].astro`, `src/components/Timeline.astro` and `src/styles/site.css`
on the same branch. No overlap.

## Step 1 — the eight where a timer was left out

Edit `>> time:` in, in this order (largest gap first, so a mistake shows up in the biggest number):

| file | `>> time:` becomes | arithmetic |
| --- | --- | --- |
| `chintan-broth.cook` | `9 hr 30 min` | 5 hr 30 + `~chill{4%hr}` |
| `sour-dill-pickles.cook` | `23 days 2 hr` | 23 days + `~soak{2%hr}` |
| `baklava.cook` | `7 hr 30 min` | 3 hr 30 + `~stand{4%hr}` |
| `bulgogi-marinade.cook` | `2 hr 15 min` | 15 min + the 2 hr marinate |
| `no-knead-bread.cook` | `20 hr 45 min` | 20 hr + `~{30%min}` + `~{15%min}` bake |
| `focaccia.cook` | `20 hr 25 min` | 20 hr + `~{25%min}` bake |
| `mint-chutney.cook` | `45 min` | 15 min + `~chill{30%min}` |
| `chocoflan.cook` | `6 hr 10 min` | 6 hr + `~caramel{8%min}`, rounded up to the grain |

**Verification:** `grep '^>> time:'` on the eight files shows the new strings and nothing else on
those lines.

## Step 2 — the six that were rounded the wrong way

| file | `>> time:` becomes | the clock it clears |
| --- | --- | --- |
| `lotus-seed-paste.cook` | `6 hr 30 min` | 6 hr 30 min |
| `deli-rye-bread.cook` | `15 hr 15 min` | 15 hr 13 min |
| `turnip-cake.cook` | `14 hr 15 min` | 14 hr 13 min |
| `chicken-adobo.cook` | `1 hr 45 min` | 1 hr 43 min |
| `taro-cake.cook` | `14 hr 10 min` | 14 hr 7 min |
| `teleras.cook` | `2 hr 55 min` | 2 hr 53 min |

Steps 1 and 2 are independent of each other and of every other file; they are split only so the
two kinds of correction stay legible in the record. They commit together — fourteen half-fixes is
not a state worth having in history.

## Step 3 — the diff, before anything is built

```
git diff -- recipes/ | grep -E '^[-+]' | grep -v '^[-+][-+]'
```

**Pass condition:** 28 lines, fourteen `-` and fourteen `+`, every one of them a `>> time:` line.
Any other line means a timer, a step label, an ingredient or prose was touched, and the fix is to
revert that hunk immediately. Saved to `time-lines.diff` as the evidence the ticket asks for.

Belt and braces, since the criterion is absolute:

```
git diff --stat -- recipes/          # 14 files, 14 insertions, 14 deletions
git diff -U0 -- recipes/ | grep -cE '^\+>> time: '   # 14
git diff -U0 -- recipes/ | grep -vcE '^(\+\+\+|---|@@|diff |index |[-+]>> time: )'  # 0
```

## Step 4 — rebuild and re-measure

```
npm run build
node .lisa/attempts/T-006-02/1/work/compare-clock-to-chip.mjs
```

**Pass condition:** `clock GREATER than chip: 0`, `pages checked: 658`, `unreadable … 0`. The
unreadable count is the guard that every new figure still parses; `23 days 2 hr` is the one to
watch.

## Step 5 — prove nothing else moved

```
node .lisa/attempts/T-006-02/1/work/snapshot-figures.mjs .lisa/…/figures-after.json
node .lisa/…/diff-figures.mjs        # written in this step
```

`diff-figures.mjs` compares `figures-before.json` (taken from a clean build at the start of the
attempt) with `figures-after.json` and reports every page whose `chip`, `total` or `needsYou`
differs.

**Pass conditions:**

- exactly 14 pages differ, and they are the fourteen;
- all 14 differences are in `chip`;
- **0 pages differ in `total` or `needsYou`** — including the fourteen. This is the strong claim:
  the clock is computed from timers, so if no timer moved, no clock moved, on any of the 658.

A caveat to record honestly: T-006-01 is editing `Timeline.astro` and `[slug].astro` on the same
branch and may land between the two builds. The snapshot captures the figures' *values*, not the
markup around them, so a label added beside a figure does not register — but if T-006-01 changes a
figure's own string, this diff will show it and I will say so rather than absorb it.

## Step 6 — the project's own gate, then commit

```
npm run verify        # check → recipes → vitest → astro build
```

`npm run verify` includes `scripts/check-recipes.mjs`, which validates every `.cook` file, and the
full vitest suite. No test asserts any of the fourteen `>> time:` values (checked in Research), so
a failure here is either a real regression or a T-006-01 landing mid-run; the transcript will make
which obvious.

Then one commit, fourteen paths:

```
lisa commit-ticket --ticket-id T-006-02 \
  --message "Raise fourteen headers to meet their own timers" \
  --include recipes/bars-and-brownies/baklava.cook \
  --include … (the fourteen from step 0)
```

No `git add`, no `git commit`. After it returns, `git status --short -- recipes/` must be empty.

## Testing strategy

There is no unit test to add. The change is data, not code, and the collection's data is verified
the way the rest of it is: by `scripts/check-recipes.mjs` and by measuring the built site. The
comparison script *is* the test, and it is re-runnable by a reviewer in one command against a
fresh build.

What is deliberately **not** added: a check in `scripts/check-recipes.mjs` that fails any recipe
whose `>> time:` is below its critical path. It would prevent the fifteenth of these, it is
roughly twenty lines against `buildSchedule`, and it is outside the files this ticket may modify.
It goes in Review as the recommended follow-up.

## Rollback

`git checkout -- recipes/` before the commit; `git revert` of the single commit after. Nothing
else in the tree depends on these strings.

## Risks

| risk | likelihood | mitigation |
| --- | --- | --- |
| A new figure fails `authorMinutesOf` and the chip silently stops parsing | low | step 4's `unreadable: 0` |
| An editor slips and touches a timer on an adjacent line | low | step 3's diff, run before any build |
| T-006-01 lands between the two builds and muddies step 5 | moderate | snapshot compares values, not markup; any figure change is reported rather than absorbed |
| `6 hr 10 min` / `14 hr 10 min` read as oddly precise | certain, and accepted | Design: the alternative is inventing five more minutes than the file supports |
