# T-002-05 — Structure

The blueprint: twelve new files, one folder, no edits to anything that existed before this ticket.

## Files

**Created — 12, all in `recipes/rice-beans-and-grains/`:**

```
harvest-bowl.cook            teriyaki-chicken-bowl.cook   crispy-rice-bowl.cook
harissa-chicken-bowl.cook    miso-salmon-bowl.cook        bbq-tofu-bowl.cook
burrito-bowl.cook            poke-bowl.cook               spicy-lamb-bowl.cook
chicken-pesto-bowl.cook      fish-taco-bowl.cook          crispy-chickpea-bowl.cook
```

**Modified: none. Deleted: none.** `counters.json`, `docs/gaps/bowl-shop.md`, the forty dressings
and every slug named in a `pairs-with:` line are read, never written. Mutual pairing is computed by
`scripts/parse-recipes.mjs` at build time into `src/generated/recipes.json`, which is not committed.

## The common shape

Every file is the same skeleton, so a reviewer reads the first one and skims the rest:

```
>> title:        the board name, said aloud
>> category:     Rice, Beans & Grains
>> tags:         protein, base, method, "bowl"
>> counters:     The Bowl Shop
>> aka:          board name · spellings · the generic people type · the component they remember
>> pairs-with:   existing slugs only, verified by ls and by parse-recipes
>> servings:     4
>> time:         wall clock
>> slack:        only where the file can name the real failure
>> step.N:       label overrides, N counting the prose header as step 1

<prose header — one full-width row above the table: the technique the bowl turns on>

<base>                    no refs                                          col 2
<protein prep>            no refs                                          col 2
<protein cooked>          @&(~1) the prep                                  col 3
<roasted or charred>      no refs                                          col 2
<build>                   @&(~1) @&(~2) @&(~4) — every branch merges here  col 4
```

Steps are separated by blank lines, so the prose header is **step 1** and the five operations are
steps 2–6. Every `@&(~N)` is relative and counts the header, per `README.md:106-111`.

Resulting table: **`colCount` 3–4, `rowCount` 11–16**, against gates of ≥3 and ≥3
(`check-recipes.mjs:70-72`) and a README target of 5–16 rows and 3–6 operations.

## The twelve, one line of tree each

Notation: `2` = step number; `→` = which step consumes it. Every chain ends at the build step.

| # | Slug | Steps (2 … n) | Merge |
| --- | --- | --- | --- |
| 1 | `harvest-bowl` | 2 wild rice · 3 sweet potato · 4 chicken · 5 pull+dress `~1`→4 · 6 build | 6 ← `~4`=2, `~3`=3, `~1`=5 |
| 2 | `teriyaki-chicken-bowl` | 2 rice · 3 sear · 4 glaze `~1`→3 · 5 sesame kale · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 3 | `crispy-rice-bowl` | 2 crisp rice slab · 3 toss broccoli · 4 char `~1`→3 · 5 eggs · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 4 | `harissa-chicken-bowl` | 2 farro · 3 marinate · 4 roast `~1`→3 · 5 cauliflower · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 5 | `miso-salmon-bowl` | 2 brown rice · 3 glaze+marinate · 4 broil `~1`→3 · 5 cucumbers · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 6 | `bbq-tofu-bowl` | 2 press tofu · 3 roast+glaze `~1`→2 · 4 quinoa · 5 sprouts · 6 build | 6 ← `~3`=3, `~2`=4, `~1`=5 |
| 7 | `burrito-bowl` | 2 lime rice · 3 rub chicken · 4 sear `~1`→3 · 5 black beans · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 8 | `poke-bowl` | 2 rice · 3 season `~1`→2 · 4 marinate tuna · 5 cucumber · 6 build | 6 ← `~3`=3, `~2`=4, `~1`=5 |
| 9 | `spicy-lamb-bowl` | 2 basmati · 3 crisp lamb · 4 spice `~1`→3 · 5 eggplant · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 10 | `chicken-pesto-bowl` | 2 farro · 3 fold pesto `~1`→2 · 4 sear chicken · 5 tomatoes · 6 frico · 7 build | 7 ← `~4`=3, `~3`=4, `~2`=5, `~1`=6 |
| 11 | `fish-taco-bowl` | 2 lime rice · 3 rub cod · 4 blacken `~1`→3 · 5 cabbage · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |
| 12 | `crispy-chickpea-bowl` | 2 quinoa · 3 roast chickpeas · 4 spice hot `~1`→3 · 5 carrots · 6 build | 6 ← `~4`=2, `~2`=4, `~1`=5 |

Ten files have five operations; `chicken-pesto-bowl` has six (the frico is its own step and the
pesto is folded into hot farro as its own step); none has fewer than five. Each has **four
non-assembly operations** against an acceptance floor of three.

`tree.ts:163-168` — one consumer per step — is satisfied everywhere: the only steps with two
possible readings are the protein pairs (prep → cook), and the prep is consumed by the cook alone.

## Interfaces to the rest of the collection

**`pairs-with` slugs used, all verified present today:**

| Bowl | Slugs |
| --- | --- |
| harvest | `basic-vinaigrette` |
| teriyaki-chicken | `teriyaki-sauce`, `shichimi-togarashi` |
| crispy-rice | `ginger-scallion-oil` |
| harissa-chicken | `harissa`, `tahini-sauce`, `hummus` |
| miso-salmon | `goma-dare`, `miso-ginger-dressing` |
| bbq-tofu | `barbecue-sauce`, `ranch-dressing` |
| burrito | `taco-seasoning`, `guacamole`, `salsa-verde-cruda`, `crema-mexicana` |
| poke | `goma-dare`, `shichimi-togarashi` |
| spicy-lamb | `ras-el-hanout`, `tzatziki`, `pomegranate-molasses` |
| chicken-pesto | `basil-pesto` |
| fish-taco | `cajun-seasoning`, `crema-mexicana`, `salsa-verde-cruda`, `guacamole` |
| crispy-chickpea | `zaatar`, `tahini-sauce`, `hummus` |

Eight of those slugs also appear **as an ingredient** in the step text — `teriyaki sauce`,
`harissa`, `barbecue sauce`, `basil pesto`, `taco seasoning`, `cajun seasoning`, `za'atar`,
`ras el hanout` — which is how a bowl uses a component without re-teaching it.

**No slug is named that does not exist yet.** In particular nothing points at `pickled-red-onion`,
`roasted-sweet-potatoes`, `crispy-chickpeas`, `seven-minute-egg`, `sesame-kale`, `whipped-feta`,
`massaged-kale`, `quinoa`, `farro` or `wild-rice`: those are T-002-07's and a backfill's, and a
`pairs-with` pointing at an unwritten file is a build error for every thread on this branch.

**Counters:** every file names `The Bowl Shop` and nothing else. Several of them (`burrito-bowl`,
`fish-taco-bowl` at the Taquería; `poke-bowl`, `teriyaki-chicken-bowl` at a Japanese counter that
does not exist) plausibly sit at a second counter. That is a shelving judgement and T-002-08 owns
it; recorded in the work artifact rather than decided here.

**Categories:** `Rice, Beans & Grains` for all twelve, matching the folder so nothing is inferred.

**`dish` / `kit`:** left off. Each bowl is its own dish and the plain way to cook it.

## Naming inside the files

- **Titles** are the board name: *Harvest Bowl*, *Teriyaki Chicken Bowl*, *Crispy Rice Bowl*,
  *Harissa Chicken Bowl*, *Miso Salmon Bowl*, *BBQ Tofu Bowl*, *Burrito Bowl*, *Poke Bowl*,
  *Spicy Lamb Bowl*, *Chicken Pesto Bowl*, *Fish Taco Bowl*, *Crispy Chickpea Bowl*.
- **`aka`** carries, for every file, at least one **generic** term (`grain bowl`, `buddha bowl`,
  `power bowl`, `rice bowl`, `protein bowl`, `macro bowl`) alongside the specific ones, because the
  ticket is explicit that the generic is what people type.
- **`step.N` overrides** are written for every operation, so the `--labels` staircase reads as a
  cook's verbs — `simmer 45 min, until the grains split`, `roast 425°F (220°C) 30 min, cut side
  down`, `pull hot, dress hot`, `build the bowl warm` — rather than as a stripped sentence.

## Timers

Named throughout, using vocabulary `src/lib/time.ts` recognises so the reading comes from the name
and not from a guess:

- **Unattended:** `~simmer`, `~roast`, `~steam`, `~boil`, `~rest`, `~marinate`, `~chill`,
  `~macerate`, `~press`, `~cool`.
- **Hands-on:** `~sear`, `~saute`, `~fry`, `~toast`, `~toss`, `~broil`.

`~boil` and `~press` are read from the **name** (`time.ts:173-178`), which is checked before
`NOT_A_VERB_IN_A_SENTENCE` ever applies — that set only withholds trust from the word when it is
found loose in a step. No unrecognised timer names (`~massage`, `~pickle`, `~crisp`) are used.

## Slack lines

Written on five of the twelve, only where the file can name the actual failure:

| Bowl | Level | The failure named |
| --- | --- | --- |
| `harvest-bowl` | forgiving | rice, sweet potato and chicken all hold; only the greens suffer, and they go in last |
| `teriyaki-chicken-bowl` | narrow | the glaze is mostly sugar — a minute past sticky it is bitter |
| `crispy-rice-bowl` | narrow | the crust forms in one unbroken run; stir the slab once and it never sets |
| `miso-salmon-bowl` | unforgiving | miso under a broiler goes caramel to charcoal inside a minute |
| `fish-taco-bowl` | narrow | cod is done as the flakes part; a minute later it shreds into the rice |

The other seven carry no `slack:` line, which `src/lib/slack.ts:17-20` records as the honest
answer for a recipe that cannot name a real failure.

## Order of work

Ordering matters only in that verification is per-file and cheap, so files are written and checked
in small batches, gap-ranked bowls first:

1. `harvest-bowl`, `teriyaki-chicken-bowl`, `crispy-rice-bowl` — gap ranks 8, 19, 15.
2. `harissa-chicken-bowl`, `miso-salmon-bowl`, `bbq-tofu-bowl` — the ticket-named bowl, rank 5,
   rank 14.
3. `burrito-bowl`, `poke-bowl`, `spicy-lamb-bowl`.
4. `chicken-pesto-bowl`, `fish-taco-bowl`, `crispy-chickpea-bowl`.

Each batch: `node scripts/check-recipes.mjs --labels …` must print `ok` and a readable staircase
before the next batch starts. `node scripts/parse-recipes.mjs` and `npx vitest run` are run once
after batch 4, because dangling `pairs-with` and slug collisions are collection-level facts.

## What the commits look like

Four commits through `lisa commit-ticket`, one per batch, each with exact repository-relative
`--include` paths for its three files and nothing else. The working tree also carries T-002-02,
T-002-03 and T-002-04's untracked files; exact `--include` is what keeps them out.
