# T-002-05 — Progress

**Done.** Twelve grain bowls written, checked and committed in five `lisa commit-ticket`
transactions. All eight acceptance criteria met. One test in the suite fails, and it is a sibling
ticket's, with the attribution below.

## Steps, against the plan

| Step | Plan | Outcome |
| --- | --- | --- |
| 1 | Batch 1 — `harvest-bowl`, `teriyaki-chicken-bowl`, `crispy-rice-bowl` | done, `f65c12d` |
| 2 | Batch 2 — `harissa-chicken-bowl`, `miso-salmon-bowl`, `bbq-tofu-bowl` | done, `e771448` |
| 3 | Batch 3 — `burrito-bowl`, `poke-bowl`, `spicy-lamb-bowl` | done, `3cbb843` |
| 4 | Batch 4 — `chicken-pesto-bowl`, `fish-taco-bowl`, `crispy-chickpea-bowl` | done, `adcfbf0` |
| — | *(deviation)* four operation labels reworded | done, `87752ac` — see below |
| 5 | Collection verification | done: `parse-recipes` clean, `astro build` clean, one sibling-owned test failure |
| 6 | Acceptance sweep | done, evidence below |
| 7 | Review artifacts | `review.md`, `review-disposition.json` |

## Deviation 1 — the prose header needed a `>> step.1:` override

The first check of batch 1 printed the header row as *"A warm bowl not a salad. … goat cheese which
is the whole difference…"* — `cleanLabel()` (`src/lib/label.ts:16`) strips commas, because it is
built to turn a step into a two-word cell, and a full-width prose row goes through the same
function. `recipes/pasta/one-pot-pasta.cook` had already solved this by repeating the sentence in a
`>> step.1:` line, and that is what all twelve files now do. Cost: one duplicated sentence per
file. Nothing in the plan anticipated it.

## Deviation 2 — four labels reworded to verbs the icon map knows

`src/lib/icons.test.ts:264` requires every verb the collection opens an operation with to be in
`VERB_ICONS`. Four of mine were not:

| File | Was | Now | Icon |
| --- | --- | --- | --- |
| `harvest-bowl` | `pull it hot, dress it hot` | `shred it hot, dress it hot` | knife |
| `crispy-rice-bowl` | `break it up and build` | `build it on the shards` | layer |
| `spicy-lamb-bowl` | `break it up, fry 2 min with the spice` | `crumble it, fry 2 min with the spice` | hand |
| `crispy-chickpea-bowl` | `spice them hot` | `season them hot` | sprinkle |

Rewording was the only option available: the alternative is adding words to `src/lib/icons.ts`, and
acceptance criterion 8 restricts this ticket to `recipes/**`. All four replacements are ordinary
cook's verbs and none of them lost information.

## The remaining test failure is not this ticket's

```
3 verb(s) fall through to the bowl: dry, pull, scrub
 Test Files  1 failed | 7 passed (8)
      Tests  1 failed | 755 passed (756)
```

Attributed by running `matchOperation` over every operation cell in the built collection:

```
recipes/fried-and-crispy/crispy-chickpeas.cook        ->  dry them until they squeak
recipes/smoked-and-grilled/blackened-salmon.cook      ->  dry the fillets uncovered 20 min
recipes/smoked-and-grilled/pulled-roast-chicken.cook  ->  pull it back into its own juices
recipes/vegetables-and-sides/roasted-beets.cook       ->  scrub, into a covered dish …
```

All four are T-002-07's files, landed on this branch while this ticket was running. None of the
twelve bowls contributes a verb to that list. Nothing here can fix it — the fix is either four
words in `src/lib/icons.ts` or four reworded labels in T-002-07's files, and both are outside this
ticket's allowed paths.

`npx astro build` passes: **610 pages built**.

## The label staircases, as printed

```
  ok   harvest-bowl.cook  14 rows x 4 cols        ok   burrito-bowl.cook  15 rows x 4 cols
       roast 425°F (220°C) 25 min                       rub, then marinate 30 min
       simmer 45 min, until the grains split             simmer 18 min, rest 10 min, lime last
       roast 425°F (220°C) 30 min, cut side down        simmer 10 min, until it coats
         shred it hot, dress it hot                       sear 10 min, rest 5 min, chop
           build it warm                                    build it, beans beside the rice

  ok   teriyaki-chicken-bowl.cook  13 rows x 4     ok   poke-bowl.cook  15 rows x 4 cols
       sear 9 min, both faces brown                     steam 15 min, rest 10 min
       steam 18 min, rest 10 min, lid on                dress, then chill 20 min
       wilt 4 min, dress off the heat                   macerate 15 min, squeeze dry
         glaze over low heat 2 min                        cut the vinegar through, fan it cool
           build it, kale beside the chicken                build it, fish on one side

  ok   crispy-rice-bowl.cook  12 rows x 4 cols     ok   spicy-lamb-bowl.cook  15 rows x 4 cols
       toss in cornstarch                               fry 8 min, undisturbed, until it crusts
       fry 9 min, undisturbed, until it is one sheet     simmer 35 min, rest 10 min
       boil 7 min, then ice water                       roast 450°F (230°C) 25 min
         char 6 min, cut side down                        crumble it, fry 2 min with the spice
           build it on the shards                           build it, lamb and eggplant over the rice

  ok   harissa-chicken-bowl.cook  15 rows x 4      ok   chicken-pesto-bowl.cook  12 rows x 4 cols
       marinate 45 min in the fridge                    boil 25 min, drain
       boil 25 min, drain, steam dry                    sear 8 min, rest 5 min, slice
       roast 450°F (230°C) 25 min, cut sides down       blister 5 min, undisturbed
         roast 450°F (230°C) 22 min, rest 5 min         fry 4 min, until the bubbling stops
           build it, chicken and cauliflower …            fold the pesto through hot
                                                            build it, crisps standing up

  ok   miso-salmon-bowl.cook  15 rows x 4 cols     ok   fish-taco-bowl.cook  14 rows x 4 cols
       glaze, then marinate 30 min                      press the rub on
       simmer 40 min, rest 10 min                       simmer 18 min, rest 10 min, lime last
       macerate 20 min, then drain                      macerate 15 min, until it slumps
         broil 7 min, six inches down                     sear 6 min in a smoking pan
           build it, salmon in large pieces                 build it, fish along one side

  ok   bbq-tofu-bowl.cook  15 rows x 4 cols        ok   crispy-chickpea-bowl.cook  15 rows x 4
       press 20 min, then slab it                       roast 425°F (220°C) 35 min, until they rattle
       toast 3 min, simmer 15 min, rest 10 min          toast 3 min, simmer 15 min, rest 10 min
       roast 450°F (230°C) 22 min, cut side down        roast 425°F (220°C) 28 min, cut side down
         roast 450°F (230°C) 25 min, glaze, 5 min more    season them hot
           build it, tofu and sprouts over the quinoa        build it, chickpeas last so they stay loud

all 12 file(s) draw a table.
```

## Acceptance criteria, with evidence

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ≥10 new `.cook`, each `counters: The Bowl Shop`, each a composed grain or rice bowl | **12**; a scripted check confirms `>> counters: The Bowl Shop` in all twelve, alone on the line |
| 2 | ≥3 non-assembly operations; a table that says something a list would not | 5 operations in eleven files, 6 in `chicken-pesto-bowl`; **4 non-assembly minimum**; every table is 4 columns wide, so nothing merges in one go |
| 3 | No bowl re-teaches an existing component; those go in `pairs-with:` with slugs confirmed | 27 `pairs-with` slugs across the twelve, **every one resolved to a file by `find`**, and re-resolved by `parse-recipes` (`pairings 668`) and by `collection.test.ts`. See the concurrency note in `review.md` |
| 4 | `aka` with the names people say, generics included | twelve `>> aka:` lines, 7–8 names each, each carrying at least one of *grain bowl / rice bowl / power bowl / buddha bowl / protein bowl* |
| 5 | Gap-note grain bowls written in rank order, skips named | ranks 8, 19, 15 first (batch 1), then the ticket-named harissa bowl, rank 5 and rank 14; rank 4 satisfied inside bowls; rank 22 deliberately not a file. All recorded in `review.md` |
| 6 | `check-recipes.mjs --labels` ok for every new file; staircase reads as verbs | `all 12 file(s) draw a table.`, transcript above |
| 7 | Every timer named; `title`/`category`/`tags`/`servings`/`counters` present | `grep "~{"` over the twelve returns nothing; the metadata check reports no missing key |
| 8 | Only `recipes/**` modified, no pre-existing file edited | five commits, `git show --stat` on each lists only the twelve paths: 4 files ×27 lines + … , total 322 insertions, 4 deletions, all inside `recipes/rice-beans-and-grains/` |

## Working tree

Nothing of this ticket's is staged, modified or untracked. `git status --porcelain` shows only
sibling tickets' files and Lisa's own frontmatter updates.
