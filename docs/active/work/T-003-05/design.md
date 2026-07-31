# T-003-05 — Design

Six decisions, each with what was rejected. Then the sourced setting-and-hours table, which is
the part that can hurt someone.

## D1. How many files, and which

**Options.** (a) The gap file's exact 18 — twelve with a pressure sibling, six without.
(b) All 30-odd rows the gap table marks *more* or *differently*. (c) The 18 plus a small margin.

**Chosen: (c), twenty files — thirteen with an Instant Pot sibling, seven without.**

The acceptance criteria are *at least* 18 and *at least* 12. Landing exactly on both leaves no
room: one file that turns out badly on the page takes the ticket below its floor. Twenty and
thirteen cost two more files and give a file of margin on each count.

The two added beyond the gap file's list are the two the gap table itself ranks highest among
what is left: `hungarian-goulash` (*differently*, has an IP sibling — so it also lifts the
three-way count) and `baked-turkey-wings` (**more** — "gelatinous, cheap, and improved by time").

Rejected (b): the gap table marks 20 rows *less*, and the shelf's own argument is that a shelf of
dishes the machine improves beats a longer shelf where a third are worse than the original.
Writing `white-cut-chicken` or `coq-au-vin` for the count would contradict the page that ranked
them.

## D2. Which dishes are refused, and where that is recorded

Skipped deliberately, all recorded in `progress.md` and `review.md` with the reason:

| Dish | Why not |
| --- | --- |
| `tonkotsu-broth` | needs a boil violent enough to emulsify fat; the machine's design is that it cannot boil hard. A different liquid, not a worse one. |
| `beef-rendang` | finished by cooking the coconut liquid away until the meat fries in its own oil. Nothing cooks away under a slow lid. |
| `char-siu`, `red-braised-pork-belly` | the finish is a lacquer reduction. Same objection. |
| `chopped-pork`, `smoked-brisket`, `burnt-ends`, `pastrami` | smoke is the dish; a sealed moist vessel cannot make it. |
| `white-cut-chicken`, `smothered-pork-chops`, `coq-au-vin`, `egg-drop-soup` | under an hour on the stove. The shelf's promise is a day you get back, not a longer cook. |
| `cuban-black-beans`, `refried-beans`, `black-eyed-peas`, `butter-beans`, `gigantes-plaki`, `ful-medames`, `hoppin-john` | the gap table's *less* column: dried beans are pressure's best case. Deferred, not refused. |
| `chicken-broth`, `ham-hock-stock`, `pho-broth`, `chintan-broth` | pressure pulls more gelatin in a fifth of the time. Deferred, not refused. |
| `doro-wat`, `tripas` | the hands-on leg *is* the dish. |

Two shelf sections — **Beans and pulses** (one entry) and **Stocks** (none) — therefore come out
thin. That is a deliberate consequence of D1 and is flagged for T-003-06 rather than papered over
with files the gap page argues against.

## D3. Low or high — and how the setting is said

**Chosen: every recipe is written for one named setting, and the setting appears in three
places** — the `>> step.N:` label for the long stretch, the prose of that step, and (where the
choice is close) the intro line. Nineteen of twenty are written for **low**; none is written for
high as its primary setting, and `boston-baked-beans` uses high only for the final reduce.

Rejected: "8 hr on low or 4 hr on high" as a single line in every file. It reads as one recipe at
two speeds, which is exactly what the ticket says is false. A high-setting conversion is a
different recipe and this shelf does not have one; a cook who owns the machine knows the dial, and
the file states the setting it was written and timed for.

Why low nearly everywhere: the whole bargain of the shelf is *leave in the morning, eat in the
evening*. A four-hour high cook is not that day. The exceptions the sources support for high are
short cooks, and short cooks are what D2 already refused.

## D4. Liquid, browning, thickening — the three shared operations

**Liquid.** Every carried-over stock/water row is cut. Manufacturer guidance is 25–50 %; the files
use **roughly a third to a half off**, stated per file in `structure.md`. This is not a rounding —
it is the single most common way a slow-cooker adaptation fails, and the intro line of each file
says so where the cut is large.

**Browning.** Three shapes, and every file takes exactly one:

1. **Brown in a skillet as its own operation** (`~brown` / `~sear`, hands-on) — 15 of 20.
2. **Colour first in the oven** — `baked-turkey-wings` only, where the plain recipe's own note is
   that a covered start steams the skin grey. That note survives the translation intact.
3. **Explicitly waived in the file's prose** — `irish-stew`, `soy-sauce-chicken`,
   `new-england-boiled-dinner`, `corned-beef`. Each says *why* it does not need it (nothing to
   brown; a master stock that must never colour; a cured brisket that is simmered, never seared),
   so the absence reads as a decision rather than an omission.

Rejected: "brown if you like." A conditional operation is not an operation, and the table would
either draw it or not depending on the reader's mood.

**Thickening.** A slurry stirred in and held **on high with the lid off**, 15–30 min, or the
liquid pulled into a pan. Only the files whose plain version reduces get it — pot roast, oxtails,
short ribs, beef stew, goulash, chili, turkey wings, birria's consomé note. Files whose sauce is
already a sauce (chile verde, tagine, boiled dinner, collards, carnitas) do not get a fake one.

## D5. Slack on every file — how the level is chosen

The ticket says this shelf is where the property earns itself. Policy:

- **`forgiving`** is the default for the long braises, and the reason must name *what gives out
  first*, not repeat "it is forgiving". The honest failure in a slow cooker is almost never the
  meat — it is the vegetables, the dairy, the herbs, or the sauce that never reduced.
- **`narrow`** where a real window exists: the vegetables in a boiled dinner, the cabbage,
  the greens, the beans, the broiler leg on carnitas.
- **`unforgiving`** where it is gone: a whole chicken poached past its point (dry and stringy, and
  a master stock that has boiled is a different stock), and beef cheeks are *not* an example —
  they are the opposite and say so.

Every reason names a time, a temperature, or a specific thing that breaks. No reason is a vibe.

## D6. Timer vocabulary

Decided against the gap file's tentative `~on low`: it normalises to `onlow`, which is in neither
set in `src/lib/time.ts`, so the clock falls back to the step label and then to **hands-on** — it
would report an eight-hour stretch as eight hours of standing there, which is the exact lie the
shelf exists to disprove.

Used instead:

| Timer | Reads as | Where |
| --- | --- | --- |
| `~slow cook{8%hr}` | unattended (name) | the long stretch, every file |
| `~keep warm{...}` | unattended (name) | held legs |
| `~brown`, `~sear` | hands-on (name) | the skillet leg |
| `~thicken`, `~reduce` | hands-on (via label) | the lid-off finish |
| `~broil` | hands-on (via label) | carnitas |
| `~rest`, `~soak`, `~brine`, `~simmer`, `~roast` | unattended (name) | carried from the plain files |

`~slow cook` is already in `UNATTENDED` as `slowcook`; nothing in `src/lib/time.ts` needs to
change, which matters because this ticket may not touch `src/`.

---

## The setting-and-hours table

Every row is the canonical slow-cooker treatment of that dish, sourced July 2026. **No row is
computed from the plain file's duration.** Where sources give a range, the file takes a value
inside it and the range is recorded here.

| # | Dish | Setting | Cook | Range found | Source class | IP? |
| --: | --- | --- | --- | --- | --- | :--: |
| 1 | pot-roast | low | 8 hr | 6–10 hr low | chuck-roast slow-cooker guides + recipe publishers | yes |
| 2 | chili-con-carne | low | 8 hr | 6–10 hr low (no-bean, cubed chuck) | slow-cooker chili publishers | yes |
| 3 | carnitas | low | 8 hr | 8 hr low / 4–5 hr high | multiple carnitas publishers, all 8 hr low + broiler | yes |
| 4 | corned-beef | low | 9 hr + 1 hr | 8–10 hr low; cabbage in the last hour | corned-beef-and-cabbage slow-cooker recipes incl. ATK | yes |
| 5 | birria-de-res | low | 8 hr | 6–10 hr low | birria slow-cooker publishers | yes |
| 6 | cachete | low | 8 hr | 8 hr low (10–12 hr for very large cheeks) | beef-cheek slow-cooker recipes | yes |
| 7 | oxtails | low | 9 hr | 8–10 hr low | oxtail slow-cooker recipes | yes |
| 8 | braised-short-ribs | low | 7 hr | 6–8 hr low | short-rib slow-cooker recipes | yes |
| 9 | beef-stew | low | 8 hr | 7–8 hr low | beef-stew slow-cooker recipes | yes |
| 10 | chile-verde | low | 8 hr | 6–8 hr low | chile-verde slow-cooker recipes | yes |
| 11 | collard-greens | low | 7 hr | 6–10 hr low | collards-and-hock slow-cooker recipes | yes |
| 12 | hungarian-goulash | low | 8 hr | 7–10 hr low | goulash slow-cooker recipes | yes |
| 13 | boston-baked-beans | low | 8 hr + 30 min high | 7–8 hr low (after a parboil) | baked-bean slow-cooker recipes + molasses-stalls-beans note | yes |
| 14 | osso-buco | low | 6 hr | 5–8 hr low | osso buco slow-cooker recipes incl. ATK | — |
| 15 | lamb-tagine | low | 8 hr | 6–10 hr low | lamb tagine slow-cooker recipes | — |
| 16 | irish-stew | low | 8 hr | 7–9 hr low | Irish stew slow-cooker recipes | — |
| 17 | new-england-boiled-dinner | low | 8 hr + 1 hr + 1 hr | 8–10 hr low, staggered | corned beef and cabbage, staggered-vegetable recipes | — |
| 18 | brunswick-stew | low | 6 hr | 6–8 hr low | Brunswick stew slow-cooker recipes incl. Food Network | — |
| 19 | soy-sauce-chicken | low | 4 hr | 4–6 hr low, whole bird | whole-chicken and soy-poached slow-cooker recipes | — |
| 20 | baked-turkey-wings | low | 6 hr | 6–8 hr low | smothered turkey wing slow-cooker recipes | — |

Underlying the whole column: a Crock-Pot on **low** reaches its ~209 °F simmer point in 7–8 hr and
on **high** in 3–4 hr (Crock-Pot support), which is why an 8 hr low cook and a 4 hr high cook are
not the same recipe.

Three rows need a note beyond the number:

- **#4 corned-beef** and **#17 new-england-boiled-dinner** are the same cut on two clocks and they
  are deliberately different files: the corned beef variant is the meat, with cabbage in the last
  hour; the boiled dinner is the staggered-vegetable method the gap file calls "the one thing a
  locked pressure lid cannot do", and it says outright that you have to be home twice.
- **#13 boston-baked-beans** keeps the plain file's 30-minute parboil. Molasses is sugar and
  vinegar is acid and both stall a dry bean, so they go in *after* the parboil, and the last
  30 minutes on high with the lid off is the only reduction the recipe gets.
- **#19 soy-sauce-chicken** starts with the master stock brought to a simmer on the stove — that
  is the plain recipe's own first step, it is why the bird starts hot rather than climbing slowly
  through a whole bird's worth of cold, and it is the shortest cook on the shelf at 4 hr.

## What this design does not do

- It does not touch `counters.json` sections — T-003-06 owns that, and the shelf will read as
  thin under **Beans and pulses** and empty under **Stocks** until someone decides those sections
  are wrong for this shelf. That is a finding, recorded, not a thing to fix here.
- It does not add high-setting timings as a second clock in each file.
- It does not backfill slack onto the 25 Instant Pot files, though they now sit beside files that
  have it. T-003-07 owns backfill.
