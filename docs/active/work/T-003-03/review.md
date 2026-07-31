# T-003-03 — Review

## The one thing a reviewer should read first

`npx vitest run` is currently **three tests red on this branch**. None of the three is this
ticket's work, and one of them is a handoff the board was drawn for. In full:

| red test | cause | whose |
| --- | --- | --- |
| `icons.test.ts` — "recognises every verb the recipes open an operation with" | 13 verbs: `blot, chicken, drop, first, float, lift, pile, second, serve, skin, to, two, uncover` | **T-003-04.** Every one traces to a Japanese Home Cooking file (`buri-daikon`, `oyakodon`, `tamagoyaki`, `saba-shioyaki`, `sumashi-jiru`, …). Zero come from this ticket's 21 files. |
| `units.test.ts` — "adds up every ingredient in the collection without losing a drop" | `boiling water` has a null amount | **T-003-04.** `@boiling water{}(a full kettle)` in `buri-daikon` and `saba-no-misoni`. Every null-amount ingredient in the collection is a T-003-04 file. |
| `shopping.test.ts` — aisle coverage | 37/1081 names have no aisle | **T-003-06's**, by design. 16 of the 37 are this shelf's; the rest are T-003-04's and pre-existing. |

The aisle gap is the one worth understanding rather than just noting. `docs/gaps/soup-pot.md`
says it outright — "None of the dried goods above exists in `src/data/aisles.json` … an aisle
problem handed to T-003-06." This ticket's criteria require `check-recipes.mjs --labels` per file
and, unlike T-003-02's, do not name `npm run verify`. T-003-06's criteria require the coverage
test to pass and limit it to `src/data/counters.json` and `src/data/aisles.json`. This ticket is
limited to `recipes/**`, so it could not close the gap even in principle. The exact sixteen names,
with a note on where each belongs, are in `progress.md`.

`npm run build` **succeeds** (682 pages). Nothing here stops the site rendering.

## What changed

**21 files created, all in `recipes/soups/`. Nothing else. No pre-existing file edited.**

Six commits through `lisa commit-ticket`; the last (`da8ecb9`) modifies a file this ticket created
two commits earlier. `git status` shows no ticket-owned file staged, modified or untracked.

**16 老火湯**, ranks 1–16 of the gap note's list, in order:
`green-radish-carrot-pork-bone-soup` · `winter-melon-jobs-tears-soup` ·
`lotus-root-dried-octopus-soup` · `watercress-honey-date-soup` ·
`peanut-black-eyed-pea-chicken-feet-soup` · `overlord-flower-soup` ·
`corn-carrot-pork-bone-soup` · `chinese-yam-goji-black-chicken-soup` · `ching-bo-leung-soup` ·
`sha-shen-yu-zhu-soup` · `hairy-gourd-dried-scallop-soup` · `dried-bok-choy-pork-lung-soup` ·
`lotus-seed-lily-bulb-soup` · `old-cucumber-rice-bean-soup` ·
`green-papaya-peanut-trotter-soup` · `apple-pear-pork-bone-soup`

**5 滾湯**, ranks 1–5: `tomato-potato-beef-soup` · `seaweed-egg-drop-soup` ·
`mustard-greens-tofu-soup` · `crucian-carp-tofu-soup` · `century-egg-amaranth-soup`

## The design decision most worth a second opinion

**Where the "what each ingredient is for" logic lives.** The ticket says to put the logic where a
reader will find it, so I checked the renderers rather than guessing:

- Loose `>>` metadata is **invisible** — `src/pages/[slug].astro:40-44` prints only `servings` and
  `time`. A `>> season:` or `>> for:` line would have looked tidy and shown a reader nothing.
- Step prose beyond the label surfaces only in the collapsed "See how it is written" disclosure.
- **Ingredient notes** render on the ingredient's own row (`normalise.mjs:166`) and as the
  ingredient's `job` in cook mode (`CookModes.astro:179`).

So the glossary is distributed as ingredient notes — `@honey dates{2}(mat zou; sweetens a pot
that has no sugar in it — the word used is 潤, moistening)` — with the pot's own logic in the
header note row and the 湯渣 rule in a footer note row. If a reviewer disagrees with that
placement, it is the change that would touch all 21 files, so it is worth disagreeing with now.

## Test coverage, and the gap in it

**No unit tests were added, and none should be.** This ticket adds content, not code. The checks
that apply are the repo's own, and they were run per batch rather than once at the end:

- `node scripts/check-recipes.mjs --labels` on each of the 21 — **ok**, and
  `all 66 file(s) draw a table` across `recipes/soups/`. This is the criterion's own check.
- A scratch harness over the real `normalise` + `buildSchedule`, run on all 21: **every file's
  longest timer reads `unattended` with `stated` confidence.** The old-fire pots come out at 8–12
  minutes hands-on against 1½–3½ hours of walking away — the shelf's whole claim, measured rather
  than asserted.
- Every timer is named (0 unnamed across 21 files). Every file declares slack. Every `aka` carries
  characters, two romanisations and an English name.
- `icons.test.ts` re-run and checked verb by verb: **none of the 13 fall-through verbs is from
  this ticket.**

**The gap:** nothing here can be tested for being *true*. A checker can tell you the table draws;
it cannot tell you that 沙參 and 玉竹 go together or that the lung is washed until it is white.
That is what the provenance table in `progress.md` is for, and it is the part of this work that
needs a human who knows the cuisine rather than a green test run.

## Open concerns

1. **The register.** Both the ticket and the gap note name this as the easiest thing to get wrong.
   The rule I wrote to: attribute (`the word used is 潤`, `the tradition holds`), name the occasion
   rather than the effect (`the pot set on for someone recovering`), and never write a sentence
   whose subject is the soup and whose object is a body. `chinese-yam-goji-black-chicken-soup` and
   `green-papaya-peanut-trotter-soup` carry the most weight here — the winter tonic and the pot
   for a new mother — and are where I would look first if this reads wrong to somebody.

2. **The bitter apricot kernel.** 北杏 carries a note on every file it appears in: used in small
   amounts, always cooked through, never raw. That is a preparation fact rather than a health
   claim, and it is stated as one. If the house style would rather it were not there at all, it is
   one line in five files.

3. **The 湯渣 footer.** All sixteen old-fire files end with the same sentence. That is deliberate —
   twenty-one tables that agree is what makes the shelf legible — but it is the repetition most
   likely to read as boilerplate to somebody scrolling several of them in a row.

4. **Three ingredient additions beyond the gap note.** Red dates in ranks 3, 5 and 15, aged
   tangerine peel in rank 14, honey dates in rank 16, dried figs in rank 6. Each comes from the
   gap note's own glossary of standard pairings rather than from its entry for that soup; all six
   are itemised in `progress.md`. A reviewer who wants the files to carry *only* what the ranked
   entry named should strike them.

5. **`>> time:` is an author's claim, not the computed schedule.** It runs 10–30 minutes ahead of
   the timers on most files, which is the chopping and the trip to the sink. `authorMinutesOf`
   reads every one of them; `schedule.test.ts` is green on that.

## What is deliberately left for other tickets

- **T-003-06** — filling The Soup Pot's five `counters.json` sections (until then the 21 land in
  the menu's `Also` bucket, which `menuFor` adds precisely so a shelf never drops a dish);
  the sixteen unplaced ingredient names; shelving `congee`; renaming the gap note's
  `## What is already here` heading. All of `progress.md`'s handoff sections are written for it.
- **T-003-07** — backfilling slack elsewhere in the collection.
- **Anyone extending the shelf** — 老火湯 17–18 and 滾湯 6–10 are named with reasons in
  `progress.md`, and the gap note's list is longer than this ticket's target by design.

## Criteria, one by one

| criterion | result |
| --- | --- |
| ≥20 new `.cook` files naming `counters: The Soup Pot` | **21** |
| ≥12 老火湯, ≥5 滾湯 | **16 / 5** |
| `aka` with characters, romanisation, plain-keyboard spelling | all 21 |
| slack declared, reason names a real failure | all 21; 13 forgiving, 6 narrow, 2 unforgiving, no two failures repeated |
| gap-note ranks written in order, skips named | 老火 1–16 and 滾 1–5, unbroken; what lies beyond is named in `progress.md` |
| provenance per soup in the work artifact | the table in `progress.md` |
| nothing rewritten; found dishes recorded by slug | 7 recorded with their sections; no pre-existing file edited |
| `check-recipes.mjs --labels` ok, labels read as verbs | ok on all 21; staircases are `blanch / rinse / simmer / season` and their kin |
| every timer named; three-hour simmer unattended | 0 unnamed; every longest timer `unattended` / `stated` |
| only `recipes/**` modified | 21 additions and 1 self-modification, all under `recipes/soups/` |

Ten of ten.
