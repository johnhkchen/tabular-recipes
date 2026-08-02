# T-003-07 — Progress

Thirteen commits, all through `lisa commit-ticket` with exact `--include` paths. Every step in
`plan.md` ran. Two deviations, both recorded below.

## Commits

| # | Message | Files |
| --- | --- | --: |
| `b8a3be7` | Say what the locked lid costs you if you are wrong | 25 |
| `cf6eaae` | Name the failures that are not just a worse dinner | 23 |
| `1551654` | The long smoke is forgiving; the pull temperature is not | 15 |
| `dda0ed4` | An extra hour changes little, and say which part it does not | 32 |
| `379b530` | The bulk ferment is the window, and over-proof does not come back | 40 |
| `8f8f795` | Where the property earns its place | 38 |
| `7cab403` | The emulsion, the foam, the grain and the fryer | 26 |
| `ca24bc6` | Finish the two-hour list | 15 |
| `f50297a` | A parboil is a wait, and the clock was calling it work | 1 |
| `be3067b` | The boiled dinner is the corned beef and cabbage; put the alias back on it | 1 |
| `598042d` | The temperature that is a safety number, and the sauces that split | 39 |
| `b5c0d64` | Spices burn in seconds, and the jar outlives the mistake | 19 |
| `a28bdc6` | Close the three new shelves: every file on them now says what it costs to be late | 9 |
| `ad8a297` | Rewrite the three new shelves' notes against the shelf that now exists | 3 |
| `6495201` | The beans from dry, the ground meat and the sealed dumpling | 15 |

**296 `.cook` files gained a `>> slack:` line. One `.cook` file lost an alias. One TypeScript
file changed. Three markdown notes were rewritten.**

## Step 0 — the reading tool

A scratch dumper that prints, per slug, the metadata block, the `>> step.N:` overrides, the
timers with their attention reading, and the prose lines containing a failure word. Never
committed; it lives in the session scratchpad. Without it this backfill would have meant opening
281 files by hand and the reasons would have been worse for it.

## Steps 1–8 and 9a — the backfill

Ran as designed, batch by batch, `node scripts/check-recipes.mjs` on the batch's exact paths
before each commit. **Every batch passed its check first time.** No slack line was rejected for
an unknown level or an empty reason, which is the parser being liberal about punctuation exactly
as its header promises.

Coverage moved **101 → 397 declared, 557 → 261 undeclared.**

Level distribution across all 397: **93 `unforgiving`, 187 `narrow`, 117 `forgiving`.** That
spread is the check `plan.md` asked for — a backfill that had stopped reading files would have
produced one level over and over, and this did not.

### Deviation 1 — batch boundaries moved

`structure.md` put the fast custards (`chawanmushi`, `bread-pudding`, `cherry-clafoutis`,
`egg-custard-tart`, `frangipane`, `peach-cobbler`, `rice-pudding`, `sweet-potato-pie`,
`tapioca-pudding`) in Batch 7 with the short windows and the long ones in Batch 6.

**They all went in Batch 6.** A custard is a custard; splitting the folder by elapsed time would
have meant reading `custards-and-puddings/` twice and writing two sets of reasons for the same
failure. The batch is still one commit and still self-checking.

### Deviation 2 — three batches added beyond the plan

`plan.md` sized the work at roughly 205 files across eight batches. Three more ran:

- **`598042d`, 39 files.** The safety cases the three predicates did not reach: ground meat and
  pork to temperature (`meatloaf`, `meatballs`, `xiu-mai`, `breakfast-sausage-patties`,
  `white-cut-chicken`, `turkey-brine`), the fryer, and the sauces that split and do not come back
  (`avgolemono`, `alfredo-sauce`, `bechamel`, `makhani-gravy`, `beef-stroganoff`, `gumbo`'s roux).
  The acceptance criterion says *every* recipe whose failure is a safety failure declares its
  slack. These were that, and leaving them out to match a plan written before I had read them
  would have been the wrong call.
- **`b5c0d64`, 19 files.** The spice blends that are toasted. `src/lib/time.ts`'s own comment says
  *spices burn in seconds*, and a scorched blend is bitter in everything built on it for the life
  of the jar. Only the 18 that actually toast, plus `ginger-garlic-paste`, which is raw garlic
  under oil and therefore a fridge item with a real reason. The wet marinades and the whisk-only
  mixes were left undeclared on purpose.
- **`a28bdc6`, 9 files.** Everything on the three new shelves that arrived by shelving rather than
  writing and so had no slack: `dashi`, `miso-soup`, `gyoza`, `okonomiyaki`, `teriyaki-sauce`,
  `goma-dare`, `japanese-beef-curry`, `congee`, `egg-drop-soup`. S-003's own argument is that *a
  shelf that promises "walk away" and then hands someone a recipe with a narrow window has lied to
  them* — so a shelf with holes in it was the wrong place to stop. **All three new counters now
  declare slack on every file.**
- **`6495201`, 15 files.** Found by auditing what was still undeclared *against my own stated
  rule* rather than declaring the rule satisfied. It was not satisfied: `refried-beans`,
  `black-eyed-peas`, `butter-beans`, `hoppin-john` and `chana-masala` are all pulses from dry —
  `refried-beans` even had its Instant Pot sibling marked `unforgiving` while the plain file said
  nothing at all. `kafta` and `seekh-kabab` are ground meat on a skewer.
  `new-england-clam-chowder` splits if boiled and holds shellfish. And seven fried or steamed
  dumplings (`egg-rolls`, `samosa`, `sambousek`, `ham-sui-gok`, `wu-gok`, `siu-mai`, `har-gow`)
  seal raw pork or shrimp inside a wrapper, which is a safety case and a burst-seam case at once.
  **These were misses, not judgement calls**, and the audit that found them is the reason the
  remaining count in `review.md` can be trusted.

## Step 9 — `src/lib/time.ts`

`parboil` added to `UNATTENDED`, with a comment saying why it is safe where bare `boil` is not.

Blast radius measured before and after, and it matched the prediction exactly: **seven timers in
six files** — `buri-daikon` (20 min), `chintan-broth` and its Instant Pot sibling (10 each),
`pho-broth` and its sibling (10 each), `tonkotsu-broth` and its sibling (30 each). All seven now
read `unattended` with source `name`. Nothing else moved: the twelve timers in steps whose label
contains the word `parboil` were listed before and after, and the other five were already
unattended through `simmer`, `dry` or `drain`.

`buri-daikon`: **30 hands-on / 25 unattended → 10 / 45.** The number was never touched.

`vitest run` green before the commit, 825 tests.

## Step 10 — the alias

`crockpot corned beef and cabbage` dropped from `corned-beef-slow-cooker.cook`. Not a merge: the
two files are different dishes and both should exist. `new-england-boiled-dinner` is the
corned-beef-and-cabbage dish and its plain file carries that alias; `corned-beef` does not, so the
variant had drifted from its own sibling's vocabulary. Everything else on the line kept.

## Step 11 — reading the collection

All measurements re-taken after every edit. Results are in `review.md`; nothing here was carried
over from `research.md`, which was written before 281 files changed.

**One correction to `design.md`.** It says the front page renders the counter row in
`counters.json` declaration order. It does not — `menus()` in `src/lib/counters.ts` sorts
**biggest first**. Read off `dist/index.html`, not off the source. That makes the verdict sharper
rather than softer, and `review.md` states it from the built page.

## Step 12 — the gap docs

All three rewritten. `soup-pot.md` and `japanese-home.md` had their `## What is already here`
heading renamed to `## What it has` — the edit their own text said T-003-06 would make and did
not — and `slow-cooker.md`'s candidate list replaced with its twenty members.

`node scripts/menu-sections.mjs` reported all three as *gap note has no "What it has" block*
before, and **`every counter parsed cleanly` after**, with all 21 counters placing every member:
Soup Pot 24/24 in 3 sections, Japanese Home 38/38 in 6, Slow Cooker 20/20 in 3. Those match
`counters.json` exactly, so the notes are now upstream of the menu in fact and not only in
intention.

Two things found while rewriting and fixed in place:

- A `**Stocks.**` line in `slow-cooker.md` with an italic parenthetical was reported as unparsed
  by `menu-sections.mjs`. Rewritten as prose, since the shelf genuinely has no stocks and every
  stock in its own candidate table ranks *less* against pressure.
- `japanese-home.md` carried a second copy of its section list under
  `### Grouped the way this counter's sections will print`, **inside** the `What it has` block.
  That would have been parsed as a competing set of sections. Deleted, and the sorting argument
  promoted to its own `## How the ten were sorted` heading so it sits outside the parsed block.

Every number in the three closing blocks was measured after the last recipe commit, and three
first drafts were corrected against the measurement rather than shipped: the Soup Pot's level
distribution, the Slow Cooker's elapsed range (`corned-beef-slow-cooker`'s 132 hours are a
five-day cure and were skewing it), and the Japanese shelf's 一汁三菜 timings.

## Step 13 — verify

```
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 658 named, 0 inferred from category · timers in 635 · pairings 760
 Test Files  8 passed (8)
      Tests  825 passed (825)
[build] 682 page(s) built in 910ms
```

682 pages, the same count T-002-09 recorded. This ticket added no pages.

## Working tree

`git status --porcelain` shows the ticket file (Lisa's, not mine) and Lisa's own publication of
this attempt's artifacts under `docs/active/work/T-003-07/`. **No ticket-owned source file is
staged, modified or untracked.**
