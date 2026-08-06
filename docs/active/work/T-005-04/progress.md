# T-005-04 · Progress — 373 lines rewritten, 24 left alone

All plan steps complete. Nine commits, every one `.cook` files only.

---

## Steps

| # | Step | Result |
| --- | --- | --- |
| 0 | Baseline | `report-before.txt`, `slack-before.json/.tsv` — 397 declared, 304 over cap |
| 1 | Build and prove `apply-slack.mjs` | 7/7 proofs pass, no trace left |
| 2–9 | Eight authoring batches | 373 files, one line each |
| 10 | Safety audit | 36 files, every fact survives with its number |
| 11 | Random twenty spot-check | 20/20 name a failure and when |
| 12 | Final verification | `npm run verify` exit 0 |
| — | Corrective pass | 2 lines that only implied a failure |

### Commits

| Commit | Batch | Files |
| --- | --- | ---: |
| `d39918d` | baking — bars, breads, cakes, cookies | 38 |
| `72c81fb` | custards, dips, cured fish | 45 |
| `c891549` | dumplings, eggs, flatbreads, fried | 42 |
| `f21aeba` | noodles, pasta, pastry, grains | 39 |
| `995cc0f` | salads, sauces, the smoker | 49 |
| `b6ecd4f` | the soup shelf | 44 |
| `eed448e` | spice jars, stir-fries, pickles, sides | 39 |
| `f48a24d` | the braise shelf | 77 |
| `d3c82ec` | two lines that only implied a failure | 2 |

`git show --name-only` on each: **373 files total, 373 of them `recipes/**/*.cook`, nothing
else.** `git diff --stat` across the range: **373 files changed, 373 insertions(+), 373
deletions(-)** — one line per file, mechanically confirmed.

---

## The numbers, before and after

Measured by `dump-slack.mjs`, which reads each file's `>> slack:` line through `readSlack` —
the same function the site and the checker use.

| | Before | After |
| --- | ---: | ---: |
| declared | 397 | **397** |
| undeclared | 261 | **261** |
| **over 200 (the cap)** | **304** | **0** |
| over 120 (the aim) | 373 | 78 |
| **mean** | **222.4** | **111.7** |
| **max** | **290** | **151** |
| min | 92 | 88 |
| p50 / p90 / p99 | 236 / 260 / 280 | 111 / 126 / 141 |
| levels | 93 / 187 / 117 | **93 / 187 / 117** |

```
before                              after
  75- 99    6  ###                    75- 99   54  ###########################
 100-124   21  ###########           100-124  296  ############################…
 125-149    8  ####                  125-149   45  #######################
 150-174   15  ########              150-174    2  #
 175-199   39  ####################  175-199    0
 200-224   51  ##########…           200-224    0
 225-249  153  ###############…      225-249    0
 250-274   95  ##########…           250-274    0
 275-299    9  #####                 275-299    0
```

By the checker's own code path — `npm run check`, `report-after.txt`:

```
by field:  operation cell 0  ·  step body 656  ·  prose row 232  ·  slack reason 0  ·  ingredient note 17
```

**`slack reason 304 → 0.`** The other four fields are unchanged, which is the second proof that
nothing outside this ticket's field moved.

### The 24 left alone

Every reason already at or under 120 was left byte-for-byte, because they are the target the
ticket and `voice.md` quote — `rice-beans-and-grains/fish-taco-bowl` (92, the ticket's worked
example) and `rice-beans-and-grains/mushroom-risotto` (120, `voice.md`'s). All 24 are
single-clause, single-failure lines. They are listed as `unchanged` in `dispositions.tsv`.

---

## What was dropped, and where it went

`dispositions.mjs` finds the drops by diffing before against after rather than from recall: it
splits each before-reason into clauses and reports those whose content words do not survive.
423 rows in `dispositions.tsv`; 19 of them are additionally flagged `+SAFETY-REVIEW`.

| Disposition | Clauses | What it is |
| --- | ---: | --- |
| `dropped:no-failure-named` | 166 | The clause named no failure — scene-setting, method, or a number's provenance. |
| `dropped:lesser-failure` | 129 | A second real failure, outranked by the survivor. The ticket's *keep the one with no give*. |
| `dropped:slack-half` | 78 | *"three hours or four is the same beef"* — the half that says nothing goes wrong. |
| `dropped:self-justification` | 19 | The recipe defending its own numbers. Design rule 3. |
| `dropped:shelf-talk` | 7 | Comparisons to shelf-mates. Design rule 4 — S-005 sends these to the counter menu (T-005-03). |
| `unchanged` | 24 | Already one breath. |

**Nothing was relocated into another field, and that is deliberate.** The ticket offers
relocation to *"an ingredient note, a step label"*; its own Scope section forbids touching
anything but the `>> slack:` line, because T-005-05 owns prose rows and T-005-06 owns step
bodies — and an ingredient note lives inside a step body. Writing into those lines now would put
an edit into text another ticket is about to rewrite from a list that will not contain it, which
is the silent overwrite the story's chain exists to prevent. Scope won. See `design.md` §5.

### The four drops that looked load-bearing, checked one by one

Four dropped clauses carried a fact rather than a rating. Each was checked against the file it
came from, and **all four already exist in the operation cell that actually renders** — which is
`voice.md`'s *say it once*, arrived at from the other direction:

| File | Dropped from `slack:` | Still in the file at |
| --- | --- | --- |
| `stews-and-braises/corned-beef` | the five-day cure | `>> step.3: brine 5 days, turn daily` |
| `stews-and-braises/corned-beef-instant-pot` | the five-day cure | `>> step.3: brine 5 days, turn daily` |
| `pastry-and-doughs/nixtamalised-masa` | the eight-hour steep | `>> step.3: steep 8 hr` |
| `sauces-and-gravies/shoyu-tare` | boiling the alcohol off | `>> step.3: boil the alcohol off 2 min` |

No hand-off list was needed. Nothing this ticket dropped has left the collection.

### Two lines went the other way — a fact was rescued *into* `slack:`

`toppings-and-pickles/sauerkraut`'s original slack line named no failure at all (*"three weeks is
when to start tasting … the white film skims off"*). The file itself has the failure, in step 3's
paragraph:

> Nothing may sit above the brine: what is submerged ferments and what is exposed goes mouldy,
> and that is the whole of the technique.

That step carries `>> step.3: pack under its own brine`, so **that paragraph is rendered
nowhere** — it is part of S-005's 278,833 unread characters. The slack line now carries it:

> `forgiving — nothing may sit above the brine: what is submerged ferments and what is exposed goes mouldy` (96)

`smoked-and-grilled/pulled-roast-chicken` was the other: the first pass kept 175°F but only
implied what goes wrong below it. Now: *"the thighs come off at 175°F; pulled short of that the
connective tissue has not melted and the meat will not shred"* (130). Both in `d3c82ec`.

---

## Safety facts — all 36 audited as *after* text

Every file `research.md` §6 identified. Each keeps its number; none was traded for a cap.

| File | After | Chars |
| --- | --- | ---: |
| `smoked-chicken` | *the temperature here is a safety number and not a preference: **165°F** in the breast, **175°F** in the thigh, never the clock* | 118 |
| `gyro-meat` | *the loaf is baked to **165°F** at the centre, which is where a ground-meat loaf stops being a safety question* | 105 |
| `pork-liver-pate` | *a terrine is baked to **160°F** at the centre and held cold afterwards, and getting that wrong is a safety failure rather than a texture one* | 136 |
| `cha-lua` | *the paste stays below **50°F** or the fat smears and the roll is crumbly, and the poach still has to reach **165°F** at the centre* | 122 |
| `smoked-turkey-breast` | *breast has no fat to forgive you with: it comes off at **160°F** and carries to **165°F**, and ten degrees past that is dry* | 115 |
| `turkey-brine` | *the bird is held below **40°F** for the whole eight to twelve hours; a bird brining warm is a food-safety failure* | 109 |
| `white-cut-chicken` | *the pot has to be big enough and hot enough to carry the bird through: an under-poached chicken is a safety failure* | 115 |
| `xiu-mai` | *pork balls reach temperature in the sauce or they do not, and there is no telling from the outside: give them twenty minutes* | 124 |
| `meatloaf` | *ground meat is not a cut of meat: the middle has to reach temperature, and that is what the hour is for* | 103 |
| `meatballs` | *they finish in the sauce and they finish cooked through, not pink at the centre, whatever the outside looks like* | 112 |
| `kafta` | *ground lamb and beef on a skewer comes off cooked through and not pink, which is eight minutes over the fire* | 108 |
| `seekh-kabab` | *ground meat on a skewer is cooked all the way through or it is not served, and that is ten minutes over live fire* | 113 |
| `breakfast-sausage-patties` | *raw pork sausage is cooked through every time, and the six minutes in the pan is not a preference* | 97 |
| `fried-chicken` | *325°F does not forgive a crowded pan or a wet piece going in, and a piece pulled early is raw at the bone* | 105 |
| `siu-mai` | *pork and shrimp are cooked through in eight minutes of real steam or not at all, and a basket that ran dry is how that goes wrong* | 129 |
| `belly-lox` | *three days in salt is what makes raw salmon safe to eat; cut the cure short and you have raw fish that only looks cured* | 119 |
| `corned-beef` | *salt can still be taken out in the two-hour desalting soak and never after it, so that soak has no give at all* | 110 |
| `corned-beef-instant-pot` | *the two-hour desalting soak has no give: a brisket that skips it is too salty to eat and nothing later dilutes it* | 113 |
| `pastrami` | *the brine has edges both ways: under five days the middle is still grey, past seven it is salt and nothing else* | 111 |
| `ginger-garlic-paste` | *raw garlic under oil is where **botulism** grows, so it is a fridge item with a two-week life and the oil is no preservative* | 120 |
| `sour-dill-pickles` | *anything that sits above the brine goes mouldy and takes the jar with it, so skim the film and keep everything under the surface* | 128 |
| `lime-pickle` | *the oil has to stand above the limes at all times; anything that breaks the surface goes mouldy and the jar is finished* | 119 |
| `sauerkraut` | *nothing may sit above the brine: what is submerged ferments and what is exposed goes mouldy* | 96 |
| `mayonnaise` | *…it starts again in a clean bowl with a fresh yolk, and **raw yolk keeps it in the fridge*** | 141 |
| `aioli` | *too much oil too fast and it splits into a slick; it is rescued by starting a fresh yolk, never by whisking harder* | 114 |
| `caesar-dressing` | *the oil goes in slowly or it splits and will not come back, and **raw yolk makes it a three-day fridge item*** | 105 |
| `chopped-liver` | *cooked liver is a **two-day item** in the fridge whatever the bowl looks like, and the livers go grey and chalky past six minutes a side* | 132 |
| `whitefish-salad` | *smoked fish and mayonnaise is a **three-day item** in the fridge and not a counter one, and the flakes go to paste if they are stirred* | 130 |
| `new-england-clam-chowder` | *a boiled chowder splits and the clams go to rubber, and the clams are a **same-day ingredient** besides* | 99 |
| `chikuzenni` | *left wet it keeps two days instead of four, and it turns first at the konnyaku, which sours before anything looks wrong* | 119 |
| `crema-mexicana` | *the culture dies above 110°F, and cream warmed past it sits out for twenty-four hours and never thickens* | 104 |
| `congee-instant-pot` | *do not open the valve: venting sends a jet of scalding porridge out of the top, and **that is a burn*** | 98 |
| `chicken-feet` | *the feet have to be bone dry before they meet the oil, because water left on them spits and **that is a burn*** | 106 |
| `sesame-balls` | *a fryer run hot puffs the shell before the middle cooks and it bursts, which is **boiling oil moving quickly*** | 106 |
| `corn-tortillas` | ***cal is caustic** and the steep cannot be restarted: too short and the hulls will not rub off, too long and the corn grinds to mush* | 128 |
| `nixtamalised-masa` | ***cal is caustic** and the batch is the batch: under-steeped corn will not give up its hulls, over-steeped goes to slippery mush* | 124 |

One clause `dispositions.mjs` flagged is worth naming because it is a *deletion of a negative*:
`smoked-and-grilled/smoked-bologna` said *"a bologna is already cooked, so nothing here is a
safety question."* That sentence asserted the absence of a hazard, so dropping it removes no
fact. The other flags were regex false positives (`mould` matching a madeleine tin) or
rewordings the word-overlap test could not follow.

---

## Ratings shortening exposed — recorded, not fixed

Design rule 5 holds: **no level changed**, and `93 / 187 / 117` is identical before and after.
`apply-slack.mjs` echoes the level from the file rather than the table, so a re-rating was not
possible by construction.

Nine `forgiving` recipes now read as though they have no give at all, because the half that made
them forgiving was the half that named no failure:

| File | Now reads |
| --- | --- |
| `dressings-and-dips/do-chua` | *the rinse after the salting **has no room in it**…* |
| `stews-and-braises/corned-beef` | *…so that soak **has no give at all*** |
| `stews-and-braises/corned-beef-instant-pot` | *the two-hour desalting soak **has no give**…* |
| `stews-and-braises/braised-short-ribs-slow-cooker` | *the sauce comes out loose **every single time**…* |
| `stews-and-braises/chashu` | *…the eight-hour chill **is not optional**…* |
| `rice-beans-and-grains/lo-mai-gai` | *the ninety minutes of steam **cannot be cut**…* |
| `custards-and-puddings/rice-pudding` | *once the egg is in it **must not boil**…* |
| `dumplings-and-rolls/potato-knish` | *the mash **has no room in it**…* |
| `smoked-and-grilled/smoked-pork-ribs` | *the forty-five minutes setting the glaze **has no room in it**…* |

This is the predicted consequence of the house shape, not a defect introduced here: in each case
the recipe *as a whole* is forgiving and one leg of it is not, and the field has room for one
fact. A reviewer who thinks these should be `narrow` has a real argument; it is out of this
ticket's scope by the Hazards section, and it is recorded here rather than acted on.

---

## Deviations from the plan

1. **A ninth commit was added.** The plan had eight batches; Step 11's own check surfaced two
   lines (`sauerkraut`, `pulled-roast-chicken`) that named a failure only by implication. They
   were rewritten and committed separately rather than left as a review note.
2. **`slack.test.ts` was not touched**, as `research.md` §5 predicted. Its longest fixture is 50
   characters. The plan allowed for a fixture fix; none was needed.
3. **`dispositions.tsv` is generated, not hand-written.** The plan implied recording dispositions
   while authoring. Diffing before against after afterwards is stronger evidence — it finds drops
   the author forgot rather than the ones they remembered.

## Verification

`npm run verify` — **exit 0** (`verify.log`):

```
all 658 file(s) draw a table.
by field:  operation cell 0 · step body 656 · prose row 232 · slack reason 0 · ingredient note 17
Test Files  9 passed (9)
     Tests  833 passed (833)
[build] 682 page(s) built
```

`git status --porcelain -- recipes` — empty. No ticket-owned file staged, modified or untracked.
