# T-002-02 — Plan

Six steps, five of them a commit. Every step is verifiable on its own, and the verification is
the same command each time, so a failure names its own file.

## The verification loop

Per file, as it is written:

```sh
node scripts/check-recipes.mjs --labels recipes/stews-and-braises/<slug>-instant-pot.cook
```

`ok` plus a staircase that reads as a cook's verbs is the pass. A `FAIL` names the reason
(missing metadata, unknown counter, a tiling hole, an unlabelled operation cell). The script
writes nothing, so it is safe to run at any time alongside the other five S-002 writers.

Per step, before committing:

```sh
node scripts/check-recipes.mjs --labels <every file in the step>
```

Once, at the end (Step 6):

```sh
node scripts/check-recipes.mjs          # all 527 files, catches nothing regressed
npx vitest run                          # the invariants no single file can be checked for
npm run verify                          # parse + tests + build, the command CI runs
```

`npm run verify` regenerates `src/generated/recipes.json` and `dist/`, neither committed. It is
the only thing that exercises `parse-recipes.mjs:103-126` — the *one plain way per dish* throw —
against the real collection, so it is not optional.

## Manual checks the scripts cannot make

Three things no command verifies, done by reading, per file:

1. **The number.** Every `~pressure cook{}` matches its row in `design.md` D2, and that row
   names a source that is not the plain recipe's duration.
2. **The release.** Named, timed, and the choice argued where it is not obvious.
3. **The liquid.** A real quantity in an ingredient row, sized for a sealed pot rather than an
   oven.

## Step 1 — the skeleton, proved on one file

Write `beef-stew-instant-pot.cook`. Rank 30, written first on purpose: the story states its
numbers outright (35 min at pressure, a 15-minute natural release), so the one file whose
figures are beyond argument is the one that shakes out the table shape twelve others copy.

What this step is really testing:

- `>> dish: beef-stew` + `>> kit: Instant Pot` parse and pair.
- `>> counters: Instant Pot` resolves against `counters.json`.
- The four timer names read as unattended, and `>> time:` reads whole.
- A six-operation table with two pressure legs still tiles.

Verify: `check-recipes.mjs --labels`, then `npx vitest run src/lib/collection.test.ts` for the
one-plain-way invariant with a real variant present for the first time in the repo's history.

Commit: `lisa commit-ticket --ticket-id T-002-02 --message "Beef stew under pressure, and the shape the shelf copies" --include recipes/stews-and-braises/beef-stew-instant-pot.cook`

## Step 2 — the four the appliance is sold on (ranks 3, 5, 6, 7)

`birria-de-res`, `carnitas`, `pot-roast`, `braised-short-ribs`.

The step that carries the most new shape:

- **birria** has no browning leg in the plain file either — the chiles are toasted and the beef
  goes in seasoned. The adobo is the pressure liquid *and* the consomé, so it is the one file
  where the liquid is not cut back.
- **carnitas** is the split: pressure for the tender, the broiler for the crust, unchanged.
- **pot-roast** is the first two-leg file — 75 minutes for the roast, then 4 for the vegetables
  behind a quick release. If the second leg does not tile, that is the file that says so.
- **short ribs** is the first halved-liquid file: 3 cups wine + 4 cups stock → 1 1/2 + 1 1/2.

Verify: all four with `--labels`. Watch specifically that the two-leg pot roast reads as
`… 75 min at high pressure, natural release / vegetables, 4 min, quick release / thicken`
rather than one mangled cell.

Commit: `… --message "The four the appliance is sold on" --include <the four paths>`

## Step 3 — collagen and a reduction handed back (ranks 10, 11, 12)

`oxtails`, `cachete`, `beef-bourguignon`.

- **oxtails** and **cachete** are the pot's best case and need nothing new from the skeleton.
- **bourguignon** is the argument file. Its finish is a reduction, which a sealed pot cannot
  do, so the glaze and the reduction happen with the lid off — and the note says that outright,
  because this is why `red-braised-pork-belly` was skipped and this one was not.
- Both bourguignon and the beef stew drop the plain file's flour dredge. Scorched flour on a
  sealed base is a burn notice, and the slurry at the end is the honest substitute.

Verify: `--labels` on all three; read the bourguignon's note against `docs/gaps/instant-pot.md`
§ *What it could not stock* to be sure it is making the same argument, not a contrary one.

Commit: `… --message "Oxtails, cachete, and a bourguignon that reduces with the lid off"`

## Step 4 — the smaller clock (ranks 14, 16, 17, 18)

`corned-beef`, `chile-verde`, `chili-con-carne`, `hungarian-goulash`.

- **corned beef** is the odd one: no browning, four operations, and the five-day cure plus the
  two-hour desalting soak carried over untouched. Only the simmer moves. The batch drops from
  5 lb to 3 because a 6-qt pot will not take five pounds under the fill line, and `servings`
  drops with it — a real change, stated, not a silent one.
- **chile verde** keeps its broiler char leg; the pot cannot blister a skin.
- **chili** and **goulash** are the two where the risk is the burn sensor: bloomed chile and
  bloomed paprika both scorch against a hot base, and under a lid nobody sees it happen. Both
  notes say to bloom off the heat and to float the tomato rather than stir it down.

Verify: `--labels` on all four. Check `>> time:` on corned beef reads whole — it is the file
with the most components (`2 hr` soak + `20` + `90` + `20` + `20`).

Commit: `… --message "Corned beef, chile verde, chili and goulash on the smaller clock"`

## Step 5 — the release, argued (rank 21)

`collard-greens`.

The only quick-release meat-free file, and the one that exists to make the release legible:
twenty minutes at pressure and a vent the moment the timer ends, because greens go from done to
collapsed inside a natural release. Stock drops from 3 qt to 2 cups; the pot likker still comes
out, and it comes out darker.

Verify: `--labels`, and confirm `~quick release{2%min}` reads unattended by name (it is in
`UNATTENDED` as `quickrelease`).

Commit: `… --message "Collards in twenty minutes, vented the second the timer ends"`

## Step 6 — the whole collection, and the handoff

No new files. Run, in order:

1. `node scripts/check-recipes.mjs` — every file in the collection, not just the new thirteen.
2. `npx vitest run` — unique slugs, mutual pairings, one plain way per dish, every timer
   readable, no four unbroken hands-on hours, every `>> time:` parseable.
3. `npm run verify` — the command CI and the deploy run.
4. `git status --porcelain` — must show no ticket-owned file staged, modified or untracked.

Then write `review.md` and `review-disposition.json`.

## Testing strategy, stated plainly

**There are no unit tests to write here, and that is not a gap being waved away.** This ticket
adds data, not code. The invariants that a `.cook` file can violate are already covered by four
independent readers, all of which run over every new file automatically:

| Risk | Caught by |
| --- | --- |
| Malformed table, missing metadata, unknown counter | `scripts/check-recipes.mjs` |
| Two plain files for one dish | `scripts/parse-recipes.mjs:111-126` and `collection.test.ts:66-74` |
| A variant pointing at a different dish than it claims | `collection.test.ts:60-64` |
| A timer whose duration cannot be read | `collection.test.ts:90-95` |
| Four unbroken hands-on hours | `collection.test.ts:77-88` |
| A `>> time:` that cannot be read whole | `schedule.test.ts:279-284` |
| Duplicate slug across the collection | `collection.test.ts` |
| A `pairs-with` pointing at nothing | `parse-recipes.mjs` |

What none of them can check is the only thing that can hurt somebody: **whether 45 minutes is
the right number for a beef cheek.** That is a reading check, done per file against the sources
in `design.md` D2, and it is why the skip list is as long as it is.

## Rollback

Each step is one commit of new files only. Reverting any step deletes files and touches nothing
else, because nothing else was opened.

## What would make me stop and block

- A number I cannot source without deriving it from the plain file's duration → skip the dish,
  name it in `progress.md`, and write the next one down the ranked list. The list is longer
  than the target, so the floor of ten survives three more skips.
- `parse-recipes.mjs` throwing *"dish X has N files with no kit line"* → a `dish:` slug pointed
  at something that is already two files. Fix the line, not the other file.
- Fewer than ten files passing at Step 6 → block with the count and the failing files named.
