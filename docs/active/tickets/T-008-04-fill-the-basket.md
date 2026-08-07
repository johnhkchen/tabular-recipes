---
id: T-008-04
story: S-008
title: fill-the-basket
type: task
status: done
priority: high
phase: done
depends_on: [T-008-01, T-008-02]
---

## Context

Write the air fryer half of the shelf. **The site has none** — no `.cook` file declares
`kit: Air Fryer`, and the only trace of the machine anywhere is `src/lib/icons.ts:319`, where
`air fry` already maps to an oven icon. You are opening a technique, not adding to one.

Work from the ranked list in `docs/gaps/air-fryer-and-pot.md`, which T-008-02 wrote for you, and
from T-008-01's worked examples for what a `washing-up` line reads like.

**`.cook` files in `recipes/` only.** You do not touch `src/`, `docs/gaps/**` or
`src/data/counters.json`. T-008-05 shelves what you write. T-008-03 is annotating existing files
in the same tree in parallel — **do not edit an existing recipe for any reason**; if one needs a
change, that is a note for T-008-05.

### 1. Every file must clear the gate

The shelf admits a recipe only if all three are true, and the writer is the only person who can
guarantee bars 1 and 2:

1. **`washing-up` of two or fewer.** Declared on every file you write, no exceptions.
2. **One plug-in machine does the cooking.** The air fryer, start to finish.
3. **On the table in 45 minutes**, wall-clock.

**A dish that needs a marinade bowl, a dredging plate and the basket does not belong here**,
however good it is in an air fryer. That is three things in the sink and it fails bar 1. Rank it
out, and say so in the work artifact — a recorded rejection is worth as much as a written file,
because the next person will reach for the same dish.

The pressure-cooker half of this shelf is not yours. T-008-03 is annotating the existing Instant
Pot recipes and T-008-05 applies the gate to them.

### 2. The number problem, which is this ticket's whole difficulty

**Basket times are not oven times and they are not transferable between machines.** Wattage varies
by several hundred watts across common models, basket geometry changes airflow, and a preheated
machine and a cold one are minutes apart. A file that says *"12 min at 200°C"* with nothing else
has invented a number and it will be wrong in most kitchens.

What a file on this shelf must do instead:

- **State the load.** *"one layer, not touching"* is the single most useful sentence in an air
  fryer recipe and it decides whether the dish crisps or steams.
- **Give the doneness cue alongside the clock**, not instead of it. Temperature probed, colour,
  the sound it makes. The timer is a starting estimate; the cue is the answer.
- **Say whether the machine was preheated** and whether the time assumes it.
- **Say the basket size the time was written for.** If the sources only support a range, write the
  range in the prose and put the middle in the timer — that is what the collection already does
  and it is honest.

**Never fabricate a number.** A time you could not source is worse than no file.

### 3. `kit:` is a build error waiting to happen

`scripts/parse-recipes.mjs` enforces that **only one file per `dish` may omit `kit:`**. So:

- An air fryer version of something already here — wings, chips, karaage, falafel, salmon — is a
  **`kit: Air Fryer` sibling** and shares the existing file's `dish` key. It does not get its own.
- An air fryer dish with no plain counterpart on the site carries **no `kit:` line at all**.

T-008-02's ranked list says which each item is, by slug. Follow it. If you disagree with a call,
say so in the work artifact and follow it anyway — a wrong `kit` line fails the build for everyone
and the disagreement is cheap to settle later.

### 4. What to write

The gap page is the authority; the shape below is what this ticket expects back. **Fifteen files
minimum.**

- **Straight out of the basket.** The things the machine is genuinely better at than an oven:
  wings, chicken thighs, pork belly, halloumi, tofu. Dry surface, hot air, one layer.
- **Vegetables that want a hard edge.** Brussels sprouts, broccoli, cauliflower, potatoes,
  chickpeas. Cheapest to cook, cleanest to wash, and the block most likely to clear bar 1 at a
  count of one.
- **Frozen things, done properly.** Straight from the freezer to the basket, nothing to wash but
  the basket. This is the most useful and least written-about category the machine has, and a
  collection that is too proud to include it has misread who is standing in the kitchen.
- **Reheats that beat the microwave.** Pizza, chips, fried chicken, pastry. One or two files.

### 5. What the machine is bad at, and the file should say so

T-008-02's gap page has a what-a-table-cannot-hold section naming these. Where a recipe brushes
one, the file says it in a line of prose:

- **Wet batter blows off** in the airflow. Anything battered is dredged dry or it is not this
  machine's dish.
- **A crowded basket steams.** This is why the load matters more than the time.
- **Anything needing real depth of oil is a fryer**, and calling it an air fryer recipe is a lie
  about the result, not a substitution.

## Acceptance Criteria

- At least **fifteen** new `.cook` files, all passing `node scripts/check-recipes.mjs`.
- **Every file declares `>> washing-up:` and every count is two or fewer.** A file that cannot
  clear that bar is not committed; it is recorded as a rejection with its count and reason.
- Every file states the load ("one layer, not touching" or equivalent), a doneness cue alongside
  the clock, whether the machine was preheated, and the basket size the time was written for.
- Every time in every file is traceable to a source cited in the work artifact, or written as a
  range with the reason. **No invented numbers**, and the work artifact says which files had
  sources that disagreed and by how much.
- Every file names `>> counters: The Air Fryer & the Pot` and every timer is named.
- Every `kit: Air Fryer` file shares a `dish` key with an existing plain file, named in the work
  artifact; every file without a `kit:` line has no plain counterpart on the site. The build
  passes, which is what proves it.
- At least **three** files are in the frozen-things block. That block is the shelf's most useful
  claim and it is the one most likely to be quietly dropped as beneath the collection.
- Every file is 5 to 16 ingredient rows and 3 to 6 operations, or the work artifact says why not.
- `slack` appears only where the file can name a real failure.
- The work artifact lists every dish ranked out for failing the gate, with its washing-up count.
- No existing `.cook` file is edited.
- `npm run check` passes for the whole collection.
- Only new files under `recipes/**/*.cook` and `docs/active/work/T-008-04/**` are modified.
