# T-003-05 — Research

What exists, where, and what constrains a slow-cooker shelf. Descriptive only.

## 1. The shelf as it stands today

`src/data/counters.json` already carries the counter, opened by T-003-01:

```json
{ "name": "The Slow Cooker", "slug": "slow-cooker",
  "blurb": "Fill it before you leave; dinner is waiting when you get back.",
  "categories": [],
  "sections": [ "Braises, left alone all day", "Beans and pulses", "Stocks",
                "Whole birds and big cuts", "Also here" ] }
```

Every `items` array is empty and `categories` is `[]`, so nothing inherits onto the shelf by
category. **The counter name to write in `>> counters:` is `The Slow Cooker`**, exactly — both
`scripts/check-recipes.mjs:22` and `scripts/parse-recipes.mjs` validate the string against the
`name` field, and a typo is a build error rather than a silent miss.

T-003-06 is the ticket that fills `sections[].items`. This ticket writes files only.

`recipes/**` currently holds 25 `-instant-pot.cook` files (12 in `stews-and-braises`, 7 in
`soups`, 5 in `rice-beans-and-grains`, plus `tonkotsu-broth`). Zero files declare
`kit: Slow Cooker`.

## 2. The variant mechanism, as implemented

From `S-002-three-more-shelves.md` and confirmed against
`recipes/stews-and-braises/pot-roast-instant-pot.cook`:

- A dish is a set of files sharing `>> dish: <slug>`. The one file with **no** `>> kit:` line is
  the plain way. `parse-recipes.mjs` throws only when *two* files claim the plain way, so a third
  file (plain + Instant Pot + Slow Cooker) is legal and is exactly what this ticket produces.
- A file with no `>> dish:` line defaults its dish to its own slug. That is how the plain files
  join the set without being edited — **the plain file and the Instant Pot file are never
  touched**, which is what lets T-002-02/03 keep running in parallel with this ticket.
- Filenames end `-slow-cooker`; theirs end `-instant-pot`; no collision is possible.
- `src/pages/[slug].astro` renders the switch between the files of a dish.

Established convention in the 25 existing kit files:

```
>> title: <Dish>, Instant Pot          → here: <Dish>, Slow Cooker
>> category: <same as the plain file>
>> tags: <plain tags> + instant pot, pressure cooker   → + slow cooker, crock pot
>> counters: Instant Pot               → The Slow Cooker   (kit files name ONE counter)
>> dish: <plain slug>
>> kit: Instant Pot                    → Slow Cooker
>> aka: <plain aka> + "instant pot X", "pressure cooker X"
>> pairs-with: <copied from the plain file>
>> servings / time / step.N labels
```

`>> time:` on the existing files is the whole wall clock including the come-to-pressure and the
release, e.g. `carnitas-instant-pot` is `1 hr 45 min` for a 45-minute cook.

## 3. Slack — the field T-003-02 shipped

`src/lib/slack.ts` (done, on `main`):

- Levels are exactly `forgiving`, `narrow`, `unforgiving`. Anything else fails the check with a
  message naming the legal values.
- The line is `>> slack: <level> — <reason>`; the separator may be an em dash, en dash, hyphen,
  colon, comma or nothing. The reason is **required**: a level with an empty tail fails.
- Absent is legal and is the common case (20 recipes carry the line today, out of 514+).
- `scripts/normalise.mjs:212` reads it and hands `slackProblem` to `check-recipes.mjs:65`.

Worked examples set the standard for what a reason reads like — they name the failure, not the
feeling:

```
>> slack: forgiving — an extra half hour in the oven only softens the beef further; the potatoes
   go to mush long before the meat minds                         (beef-stew.cook)
>> slack: unforgiving — past 82°C the yolks scramble and the sauce will not come back
   (creme-anglaise.cook)
>> slack: narrow — the wedge has to be cold enough to sweat, and a head left out on the bench
   never gets there again inside the hour                        (wedge-salad.cook)
```

None of the 25 Instant Pot files carry a slack line; they predate the field. This ticket is the
first shelf authored with it from the first file, which is what T-003-02's context anticipated.

## 4. Timers and the clock

`src/lib/time.ts` decides whether a wait is `unattended` or `hands-on`. The name is normalised by
lowercasing and stripping spaces and hyphens, then looked up in `UNATTENDED` / `HANDS_ON`.

Relevant to this shelf:

| Timer name written | normalises to | in UNATTENDED? |
| --- | --- | :--: |
| `~slow cook{8%hr}` | `slowcook` | **yes** |
| `~keep warm{30%min}` | `keepwarm` | **yes** |
| `~braise`, `~simmer`, `~stew`, `~poach`, `~steep`, `~soak`, `~brine`, `~rest`, `~chill` | — | yes |
| `~on low{8%hr}` | `onlow` | **no** |
| `~on high{4%hr}` | `onhigh` | **no** |
| `~brown`, `~sear`, `~saute`, `~skim`, `~stir` | — | no (hands-on, correctly) |
| `~thicken`, `~reduce`, `~broil` | — | not in either set |

So `~slow cook` is the word for the long stretch, and `~on low` is not. An unrecognised name is
not a claim: it falls back to reading the operation label, and failing that to `hands-on`, which
is the safe-but-wrong answer for an eight-hour stretch. `~thicken` and `~reduce` fall through to
the label — both are lid-off pan work, so `hands-on` is the right reading anyway. `~broil` is not
in `UNATTENDED` and the label carries "broiler", which is also correct: you stand there.

The gap file asked whether `~keep warm` and `~on low` read as unattended. **`~keep warm` does;
`~on low` does not.** That is a finding for the work artifact and it decides the vocabulary.

## 5. The checker's hard limits

`scripts/check-recipes.mjs` fails a file for:

- missing `title`, `category`, `tags`, `servings`
- an unknown counter name
- a slack problem (unknown level / no reason)
- tiling errors from `findTilingErrors`
- fewer than 3 ingredient rows, or fewer than 3 columns
- any operation cell that comes out with an empty label

The README adds soft guidance the story treats as binding: 5–16 ingredient rows, 3–6 operations,
one unreferenced ending, no splits, prep steps at the top only (because `~1` counts every step,
prep steps included).

`pairs-with` slugs must exist and are made mutual at build time, so copying the plain file's
`pairs-with` is safe and is what the existing kit files do.

## 6. The dishes — every plain slug confirmed with `ls`

All 20 targets were confirmed present, with their folder:

```
recipes/stews-and-braises/   pot-roast chili-con-carne carnitas corned-beef birria-de-res
                             cachete oxtails braised-short-ribs beef-stew chile-verde
                             collard-greens osso-buco lamb-tagine irish-stew
                             new-england-boiled-dinner brunswick-stew soy-sauce-chicken
                             hungarian-goulash baked-turkey-wings
recipes/rice-beans-and-grains/  boston-baked-beans
```

Instant Pot siblings confirmed present for 13 of them: `pot-roast chili-con-carne carnitas
corned-beef birria-de-res cachete oxtails braised-short-ribs beef-stew chile-verde collard-greens
hungarian-goulash boston-baked-beans`. No Instant Pot sibling for `osso-buco lamb-tagine
irish-stew new-england-boiled-dinner brunswick-stew soy-sauce-chicken baked-turkey-wings`.

## 7. What the machine actually does, from the gap file and its sources

Four facts that are method, not trivia, and change every file:

1. **Nothing evaporates.** Manufacturer guidance is to cut a stovetop or oven recipe's liquid by
   25–50 %. Every ingredient row carrying stock or water has to come down, and it cannot be
   carried over from the plain file unchanged.
2. **Nothing browns.** 209 °F under a lid full of steam. Colour comes from a skillet before or a
   broiler after, and it has to appear as its own operation or be explicitly waived.
3. **The sauce is loose at the end.** A slurry held on high 15–30 minutes, or the liquid pulled
   into a pan — one operation, the same everywhere.
4. **Low and high are different recipes.** A Crock-Pot on low takes 7–8 hours to reach its simmer
   point of ~209 °F; on high, 3–4 hours. A recipe that does not name the setting is unusable.

Safety constraint carried forward: dried **red kidney** beans must be boiled hard 10 minutes
before entering a slow cooker. The gap file checked the whole collection — no recipe uses kidney
beans, and `chili-con-carne` carries none. The only dried bean in scope is navy
(`boston-baked-beans`), and the plain file already parboils 30 minutes, which this shelf keeps
and states plainly.

## 8. Times, and where each came from

**No time here is derived from the plain recipe's duration.** Each was taken from the canonical
slow-cooker treatment of that dish in published recipe sources, checked in July 2026. The
per-dish citation table lives in `design.md`; the shape of the sourcing is:

- **Setting behaviour** — Crock-Pot's own support page: low reaches the simmer point in 7–8 hr,
  high in 3–4 hr, and the 25–50 % liquid cut.
- **Which machine wins which dish** — America's Test Kitchen, *Slow Cooker vs. Instant Pot*.
- **Thickening at the end** — ATK, *How to thicken thin or watery slow cooker sauces*.
- **Per-dish hours** — searched per dish (ATK, Food Network, RecipeTin Eats, Serious-Eats-class
  recipe publishers and the manufacturer). Representative findings: pot roast / chuck 6–8 hr low;
  short ribs 6–8 hr low; oxtails 8–10 hr low; beef cheeks 8 hr low; osso buco 6–8 hr low; carnitas
  8 hr low; chile verde 8 hr low; corned beef 8–10 hr low with cabbage added in the last hour;
  collard greens 7–8 hr low; boston baked beans 7–8 hr low after a parboil; birria 8 hr low;
  goulash 8 hr low; chili con carne 8 hr low; lamb tagine 8 hr low; Irish stew 7–8 hr low; beef
  stew 7–8 hr low; brunswick stew 6 hr low; turkey wings 6 hr low; whole chicken 4–6 hr low.

## 9. Boundaries this ticket must not cross

- **Only `recipes/**` is modified.** No `src/`, no `docs/gaps/`, no `counters.json`.
- **No pre-existing file is edited** — not the plain file, not the Instant Pot file. New files
  only.
- T-002-02 and T-002-03 may still be writing `-instant-pot` files. Nothing here reads or depends
  on those; every `>> dish:` line was confirmed against the **plain** slug with `ls`.
- Two dishes the gap file refuses outright — `tonkotsu-broth` and `beef-rendang` — are out of
  scope by construction and are recorded as skips rather than attempted.

## 10. Open questions carried into Design

1. Which 20 of the 46 candidates, and which are honestly worse in the machine and get skipped.
2. Low or high per dish, and how the setting is stated so it cannot be missed.
3. How much liquid comes out of each carried-over ingredient row.
4. Which files legitimately have nothing to brown (the gap file names `irish-stew` and
   `soy-sauce-chicken`) and how the waiver is worded so it reads as a decision.
5. Whether the long stretch stays inside the 3–6 operation budget once browning and thickening
   are their own operations. Browning + slow cook + thicken is already three.
