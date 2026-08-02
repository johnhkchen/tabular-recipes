# T-002-09 — Design

Research found the collection healthy: verify green, every variant paired, every pairing mutual,
no dish written twice. Three decisions are left, and one of them is about a file another live
ticket is holding.

## Decision 1 — the four fried takeout dishes on One Pot

`general-tsos-chicken`, `orange-chicken`, `sesame-chicken` and `sweet-and-sour-pork` are shelved
at One Pot. Each is: velvet in a bowl → dredge in cornstarch → deep-fry 4 cups of peanut oil in
two batches → rest on a rack → stir a glaze smooth in a second bowl → sauce in the wok → toss.
The counter's blurb is *"Everything goes in one pan, and that is the only pan to wash."*

### Options

**A. Leave them.** They declare one `#wok{}`, so by the letter of the `cookware` line they pass.
Rejected: `docs/gaps/one-pot.md` opens by disowning that line as an answer — "it counts what a
recipe *names*, and the dishes that fail this shelf mostly fail by boiling something in water the
file never bothers to call a pot." Four cups of frying oil is the same evasion. The doc's own
strictest rule — a whole component made outside the pot is a second thing to wash — already took
`jollof-rice`, `korma` and `corn-chowder` off for a blender. A dredging bowl, a rack and a glaze
bowl are three.

**B. Drop `One Pot` from the four `counters:` lines.** They keep their real home at the Takeout
Counter, where all four already sit. One line changed per file. `menuFor()` intersects the
section list with actual membership, so the One Pot menu loses them with no edit to
`counters.json`. **Chosen.**

**C. Drop them and also strip them from `counters.json`'s One Pot section.** The tidier end
state, and rejected on ownership: T-003-06 declares `src/data/counters.json` as a file it owns
and has a live attempt open. Two tickets committing the same file through separate isolated
indexes is exactly the collision the workflow doc calls a missing dependency edge. Option B
leaves four inert slugs in that file which render nothing; the follow-up is one line for
T-003-07, and the gap note — which is upstream of `counters.json` via `menu-sections.mjs` — is
corrected here so the reconciliation is already written down.

### What stays, and why it is argued rather than silent

`carnitas` and `chile-verde` both declare a `broiler` next to their Dutch oven. Carnitas puts its
own pot under the broiler to crisp the shreds in their own fat — one vessel, two appliances,
which the gap note already permits by name. Chile-verde chars its chiles under the broiler
*before* the pot, which is the shape that kept `birria-de-res` off this shelf. Treating the two
differently on the strength of an undeclared sheet pan would be a finer distinction than the
files support, so both stay and the argument is recorded in the gap note for the next pass to
settle. This ticket removes what is unambiguous and writes down what is not.

## Decision 2 — the pressure clock

Research established that `time.ts` reads all four pressure timer names correctly, with
`source: 'name'`, and that no pressure or release timer anywhere reads hands-on. The ticket's
diagnostic — *"total hands-on time for a pressure recipe should be a fraction of its plain
sibling's"* — does not hold, and the ticket says the fix is then "in `time.ts` or in a timer
name, not in the number."

It is in neither.

The plain siblings report `handsOnMinutes: 0` because their brown / soften / deglaze steps carry
**no timer**. `schedule.ts` gives an untimed operation 0 minutes and `timed: false` on purpose,
and reports `untimedCount` rather than inventing a duration. `beef-stew` has four such steps;
`beef-bourguignon` five; `pot-roast` three. The Instant Pot files time those steps because their
writers timed everything. So the comparison is between a number and a silence.

### Options

**A. Change `time.ts`.** There is nothing to change — every pressure word is already recognised
by name, and the hands-on default is doing exactly what its comment says.

**B. Add timers to the plain siblings so the comparison works.** Rejected outright. The story's
first non-negotiable rule is *never fabricate a number*, and "brown 12 min" written into
`beef-stew` because its Instant Pot variant says so is a fabricated number wearing a plausible
coat. It would also silently edit files six other tickets own.

**C. Report the pressure evidence the acceptance criterion actually asks for — pressure and
release read as unattended, with the numbers — and record the untimed-plain-sibling asymmetry as
a finding rather than pretending it away.** **Chosen.** The criterion is "the clock under a
pressure-cooker recipe reports its pressure and release time as unattended, demonstrated in the
work artifact for at least three recipes with the numbers." That is demonstrable and true. The
asymmetry is real, is not a defect in the clock, and belongs in `docs/gaps/instant-pot.md` where
the next pass will look for it.

## Decision 3 — how much of the gap docs to rewrite

The acceptance criterion is that the three files are "rewritten against the shelf as it now is."
T-002-08 already rewrote all three (`ac9236e`) against the current 658-recipe shelf, in the
before/after shape the other eighteen use. They are accurate apart from a short list.

### Options

**A. Rewrite from scratch.** Rejected. Discarding a correct, freshly-researched document to
re-derive the same rankings burns the ticket's budget on prose and risks losing the per-dish
reasoning T-002-02 through T-002-07 handed forward. The next pass would start further back, not
further on, which is the opposite of what the criterion is for.

**B. Verify every claim against the generated data and correct what this pass changed or
disproved.** **Chosen.** Concretely:

- `one-pot.md` — remove the four fried dishes from *Skillet dinners*, correct the counts
  (72 → 68, "fifty-eight shelved" → fifty-four), add the deep-fry case to *What it could not
  stock* as its own group with the reason, and record the `carnitas` / `chile-verde` broiler
  argument and the `counters.json` reconciliation for T-003-07.
- `instant-pot.md` — fix the "twenty-five of the thirty-one ranks" arithmetic (24 of 31, plus
  `gigantes-plaki` from the lower list), take `gigantes-plaki` off the unwritten list, and add
  what reading the clock across all 25 variants found: the pressure words all read by name, and
  the plain siblings' untimed hands-on steps.
- `bowl-shop.md` — verify its counts against the data and record what reading the whole shelf
  found: every pairing resolves, the bowls sit at the collection-average pairing density rather
  than above it, and the generic `aka` values (*grain bowl* on 10 of 12) are a search-quality
  item for the next pass.

The `## What it has` block of each is machine-read by `menu-sections.mjs`, so its `**Title.**
slug · slug` shape and its section titles are load-bearing and are preserved exactly.

`docs/gaps/README.md` is outside the three named files but carries a *Build state* paragraph that
now states a false number (514 recipes, 666 tests). One paragraph is corrected; its fifteen-row
tally table is left for T-003-07, which reads the whole thing after the S-003 shelves land and
can write all eighteen rows at once.

## What is deliberately not done

- **No `src/` change.** Nothing in `time.ts`, `schedule.ts`, `counters.ts` or the tests is wrong.
  The acceptance criterion that anticipates one ("the work artifact names each file changed
  outside `recipes/` and `docs/` and says why") is satisfied by naming none.
- **No `src/data/counters.json` change** — held by T-003-06, and not needed for a correct menu.
- **No edit to the 19 files with a repeated `aka` value** — 18 of them are the Japanese home wing
  that T-003-06 is reading right now, and a repeated alias is cosmetic. Recorded for T-003-07.
- **No new tests.** The invariants this ticket checked by script — dish resolution, aka
  collisions, ingredient overlap — are one-off audits over a snapshot, not properties that hold
  for all future files. `collection.test.ts` already pins the ones that are properties.
