# T-003-05 — Progress

## Done

All twenty files written, checked and committed through `lisa commit-ticket`. Five commits:

| Commit | What |
| --- | --- |
| `ed32612` | batch A — pot-roast, chili-con-carne, carnitas, corned-beef |
| `bc65cf4` | batch B — birria, cachete, oxtails, short-ribs, beef-stew, chile-verde, collard-greens, goulash, boston-baked-beans |
| `fa28fee` | batch C — osso-buco, lamb-tagine, irish-stew, boiled-dinner, brunswick-stew, soy-sauce-chicken |
| `f25c77b` | batch D — baked-turkey-wings |
| `e1e11a4` | label fix across all twenty (see deviation 3) |

Measured, not assumed:

```
ls recipes/*/*-slow-cooker.cook | wc -l                  → 20   (criterion: ≥18)
dish: lines whose slug has an -instant-pot sibling       → 13   (criterion: ≥12)
node scripts/check-recipes.mjs recipes/*/*-slow-cooker.cook → all 20 file(s) draw a table
grep -L "^>> slack:" recipes/*/*-slow-cooker.cook        → nothing
grep -L "~slow cook{"  recipes/*/*-slow-cooker.cook      → nothing
grep -c "^>> kit: Slow Cooker" … | grep -v ':1$'         → nothing
```

The thirteen with a three-way choice: pot-roast, chili-con-carne, carnitas, corned-beef,
birria-de-res, cachete, oxtails, braised-short-ribs, beef-stew, chile-verde, collard-greens,
hungarian-goulash, boston-baked-beans.

## Deviations from the plan

**1. `collard-greens` slack moved from `narrow` to `forgiving`.** The design table had it narrow on
the theory that greens go grey. Sources put slow-cooker collards at 6–10 hours on low, and the gap
file's own argument is that all day with a hock *is* the method rather than a shortcut. Calling it
narrow would have contradicted both. Rewritten as forgiving with the honest reason: past done is
where these are meant to go.

**2. `corned-beef` and `new-england-boiled-dinner` came out at 5 and 4 operations** rather than the
4 and 5 the structure blueprint guessed. Both are inside the 3–6 contract. The cabbage and the rest
share one operation in `corned-beef`; the boiled dinner keeps its three staggered additions as
separate operations because the staggering is the dish.

**3. Operation labels reworded so each opens with a verb `src/lib/icons.ts` knows.**
`src/lib/icons.test.ts` asserts that the first word of every operation label resolves to an icon.
Written as `slow cook on low, 8 hr`, the leading word is `slow`, which is not a verb in that table —
and seven of my labels fell through (`slow`, `apricots`, `cabbage`, `corn`, `lift`, `roots`,
`uncovered`). Since this ticket may only touch `recipes/**`, the labels changed rather than the icon
table: `braise / stew / simmer / poach / cook on low, N hr`, `add the cabbage, 1 hr`, `stir the
apricots in`, `skim the fat`, `reduce uncovered on high`. **Every label still names the setting and
the hours**, which is the acceptance criterion; and the clock is unaffected, because
`~slow cook{N%hr}` is read from the timer *name*, which is in `UNATTENDED`, not from the label.

**4. `lamb-tagine`'s apricots go in at the end rather than mid-day.** Sources put them in the last
hour; a mid-day addition would mean being home at hour seven, which breaks the shelf's promise.
Twenty minutes on high at the end, when the cook is at the pot anyway, plumps them without
dissolving them.

## What was skipped, and why

Refused outright — these are worse in the machine, not merely slower:

- `tonkotsu-broth` — needs a boil violent enough to emulsify fat and collagen. A slow cooker cannot
  boil hard by design. A different liquid, not a worse one.
- `beef-rendang` — finished by cooking the coconut liquid away until the meat fries in its own oil.
  Nothing cooks away under a slow lid. Same objection retires `char-siu` and softens
  `red-braised-pork-belly` to a braise-then-reduce.
- `chopped-pork`, `smoked-brisket`, `burnt-ends`, `pastrami`'s smoke leg — smoke is the dish, and a
  sealed moist vessel cannot make it.
- `white-cut-chicken`, `smothered-pork-chops`, `coq-au-vin`, `egg-drop-soup` — under an hour on the
  stove. The shelf's promise is a day you get back, not a longer cook.
- `doro-wat`, `tripas` — the hands-on leg is the dish.

Deferred rather than refused — the gap table ranks pressure the better machine, so writing them
here first would contradict the page that ranked them:

- Beans: `cuban-black-beans`, `refried-beans`, `black-eyed-peas`, `butter-beans`, `gigantes-plaki`,
  `ful-medames`, `hoppin-john`.
- Stocks: `chicken-broth`, `ham-hock-stock`, `pho-broth`, `chintan-broth`.

Consequence to hand on: the counter's **Beans and pulses** section will have one entry
(`boston-baked-beans-slow-cooker`) and **Stocks** will have none. That is a deliberate choice, and
it is T-003-06's call whether those sections belong on this shelf at all.

## `npm run verify` — three failures, all pre-existing

`npm run check` passes on all 20 files. `npm run recipes` parses the whole collection. `vitest`
reports three failures, and **all three were measured to fail with these twenty files removed**
(the files were moved aside, `npm run recipes` re-run, `vitest` re-run, then the files restored):

| Test | Baseline without these files | With them |
| --- | --- | --- |
| `icons.test.ts` — every leading verb resolves | 5 fall through: `drop float skin to uncover` | same set, plus verbs from other tickets landing concurrently; **none from these files** |
| `shopping.test.ts` — aisle coverage under 2 % | 24/1049 unplaced = 2.29 % | 31/1063 = 2.92 %; **none of the unplaced names come from these files** (they are `abura-age`, `job's tears`, `konnyaku`, `yuca` and similar, from the Japanese and home-cooking tickets) |
| `units.test.ts` — `boiling water` combines | fails | fails identically |

The `boiling water` failure traces to `recipes/rice-beans-and-grains/polenta.cook`, which writes
`@&(~1)boiling water{}` — an intermediate-preparation reference that carries no amount and lands in
the same by-name bucket as the real quantities. Not this ticket's file and not this ticket's fix.

The collection is also moving while this ticket runs: between two `vitest` runs minutes apart the
ingredient count went 1044 → 1063 and three new fall-through verbs appeared, none of them from
here. T-003-03 and T-003-04 are writing.

## State at hand-off

- 20 new files under `recipes/**`, all committed through `lisa commit-ticket`.
- Nothing staged, nothing modified, nothing untracked that this ticket owns.
- No file that existed before this ticket was edited: no `src/`, no `docs/gaps/`, no
  `counters.json`, no plain recipe, no `-instant-pot` file.
