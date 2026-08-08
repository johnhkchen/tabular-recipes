# T-013-01 — Research

What exists, where, and what it can already say. No proposals here.

---

## 1. The file this one is modelled on

`docs/knowledge/counters.md`, 1160 lines, 21 counters. Its shape, which the ticket asks to be
carried over:

| Part | What it does |
| --- | --- |
| Opening thesis | One bolded sentence defining the thing, then the two rules that follow from it |
| Contents table | Every archetype, one line of *what it is*, and **combined or separate** with the reason |
| Per-entry | *What it is* · *Why combined / why separate*, argued from evidence · a vocabulary table |
| `## Sources` | Grouped by cuisine, raw domains, with which pass cited them |
| `## What could not be verified` | The longest single argument in the file. Sample bias, open spellings, things nobody looked at |

Two things in it matter more than the shape:

**The archetypes-not-taxonomies rule** (`counters.md:9-13`): settled from ~70 real menus read end
to end, *"rather than from the recipes already written."* Where menus showed two formats combine,
one counter; where separate, separate; every entry says which and why.

**The namespace has already stretched once.** Sixteen counters are shops. The seventeenth,
[The Air Fryer & the Pot](../../../../docs/knowledge/counters.md), says so out loud at line 889:
*"It is also not a shop. Nobody sells air fryer food out of a window, so unlike the sixteen
counters above this one was not settled by reading menus. It was settled by measuring."* Its
membership is a three-bar gate, written down twice, with a stated refusal — *"Do not loosen a bar
to make the shelf look fuller."* One Pot, Instant Pot and The Slow Cooker are the same kind of
entry. So the field `>> counters:` already carries two kinds of thing, and the second kind was
admitted with an argument rather than quietly.

---

## 2. What the site already measures, verified against the code

Every field below was read out of `src/lib/` and counted against `src/generated/recipes.json` at
**685 recipes**, on 7 August 2026.

| Field | Where | Type | Declared on |
| --- | --- | --- | ---: |
| `totalMinutes` | `schedule.ts:61` | critical path, not a sum | 685 (0 for untimed) |
| `handsOnMinutes` | `schedule.ts:69` | sum over branches | 685 |
| `unattendedMinutes` | `schedule.ts:68` | sum over branches | 685 |
| `assumedHandsOnMinutes` | `schedule.ts:78` | how much of hands-on nobody claimed | 685 |
| `longestHandsOnMinutes` | `schedule.ts:89` | longest unbroken run, **one cook** | 685 |
| `untimedCount` | `schedule.ts:91` | operations that never said | 685 |
| `handsOnEvidence()` | `schedule.ts:364` | `stated` \| `inferred` \| `unknown` | **269 not `unknown`** |
| `authorMinutes` | `schedule.ts:93` | `>> time:` | 685 |
| `slack` | `slack.ts:40` | level **and** reason | **416** |
| `washingUp.count` | `washing-up.ts:51` | derived from an authored list | **177** |
| `keeps` | `keeps.ts:45` | span + character; `minutes: 0` = not at all | **138** |
| `capacity` | `scaling.ts:42` | servings the vessel holds + the operation | **0** |
| `costOf()` | `scaling.ts:446` | `elapsed`/`standing`/`longest` growth at `n`, `batches` | machinery only |
| `lanes`, `criticalPath`, `tasks` | `schedule.ts:55-59` | the DAG `buildSchedule` computes | 685 |

**`capacity` is built and unannotated.** T-011-02 landed the reader, the cost function and
`boundSteps`; T-011-03 — the ticket that finds what actually binds — has not run. So every
`costOf()` answer in this collection today is the unbounded branch, `r = 1`.

**43 recipes of 685 carry `keeps`, `washing-up`, `slack` and a hands-on figure that is not
`unknown`.** That is the population any four-field profile can rank without a gap.

## 3. What the schedule assumes about how many cooks there are

`src/lib/schedule.ts:63-66`, quoted in `cooks.md` §3:

> The schedule also assumes you have as many hands as the tree has branches; it never delays one
> hands-on task for another.

and the correction on one number only, `schedule.ts:306-322`, behind `longestHandsOnMinutes`:

> ... which is right for a timeline and wrong for this number. A person with two hands-on jobs
> running at once is doing both, one after the other.

`cooks.md` §3 names this as **two models of a household living in one module**, the multi-cook one
half-built by accident. Both occasion corners in this ticket are exactly a question about how many
hands there are, so this is the most load-bearing unresolved thing in the code for §3 of the file.

## 4. What the sibling knowledge files already settled

- **`scaling.md`** (T-011-01, 521 lines). The cost function, `elapsed(n) = A_free + m·H_free +
  r·(A_batch + H_batch)`. §4.3 is the finding this ticket runs straight into: `gyoza`'s
  `roll thin, cut 3.5-in rounds` and `fill, pleat one side, press flat` **carry no timer**, so
  *"the model prices the most scale-sensitive dish in this file as one of the cheapest."* §6 is the
  phrasebook — the only sentences the site may say — and §8's second query already flags that
  scaling alone cannot answer *over three days* without `keeps`.
- **`cooks.md`** (T-012-01, 326 lines). Three cooks, each a **situation, its constraints, and a
  contradiction**. Explicitly *"there is not a fourth"*, and the tempting fourth — cooks alone on a
  Tuesday, hosts at Christmas — is refused as *"two of these three in different weeks."* Its
  instrument is **passes / fails / cannot say**, and cannot-say is a real verdict.
- **`voice.md`**. The three house tests; *would a friend say it at a kitchen table*. S-013's own
  Conventions section says the register bites hardest here: *festive*, *effortless entertaining*,
  *crowd-pleaser* describe nothing.

**Precedent for the index question.** `T-012-01/review.md:29-42` records that there is no
`docs/knowledge/README.md`, that `voice.md` and `scaling.md` are linked from nowhere outside
`docs/active/`, and that the folder's actual convention is **sibling cross-links from the opening**.
`cooks.md:20-22` does exactly that and its criterion was accepted. This ticket's criteria forbid
touching `README.md`, so the same reading applies.

---

## 5. Selling evidence, gathered

Eight searches. What each establishes, and what it does not.

| Kind of evidence | Found | What it proves |
| --- | --- | --- |
| **Supermarket / restaurant pre-order sheet** | Star Super Market ham & turkey order form, orders due 21 Dec 2025; Metro Diner Thanksgiving feast for 1 / 4 / 8, deadline 25 Nov; Harris Teeter entrées priced **by the pound** | A printed form with a deadline is a commitment of inventory. Nobody prints one on a guess |
| **Caterer's seasonal menu** | Keif's holiday combo from $45/head, 10 minimum; Local Table family feasts in sizes of 4 or 10; Rivera three tiered packages | A caterer who lists a dish nobody orders stops listing it |
| **Bakery seasonal board** | Hot cross buns listed *"Seasonal — January through April"*; pan de muerto in Mexican bakeries **from mid-September**; mooncake boxes in Asian supermarkets in the weeks before the festival | A dish that exists only in a window is the purest case: the moment is the entire reason it is baked |
| **One-night prix fixe / dining volume** | National Restaurant Association, two decades: **Mother's Day is the top dining-out day**, then Valentine's, Father's Day, New Year's Eve, Easter; 80 M US adults forecast to dine out on Mother's Day 2026 | The occasion moves a whole industry's Sunday |

**Applied to candidates, and it rejects things.**

| Candidate | Selling evidence found | Verdict |
| --- | --- | --- |
| Thanksgiving / a holiday meal | Pre-order forms, caterers, prix fixe, all four kinds | Strongly real |
| Lunar New Year dumpling party | Costco *Make Your Own Dumpling Set* $9.97; Katie Mai kit at Target; ticketed dumpling-making parties at $55 for two hours; virtual classes | **Real**, and the product sold is *the making*, not the dumplings |
| A new baby | Postpartum meal delivery is a priced product: Gather Around 1–4 week packages, Restorative Roots, roughly $195–665/week; new-baby gift meal packages from $99 | Real, and thinner than the holidays: regional, and priced as a gift |
| Somebody died | *Repast* is a printed menu category at delis and caterers — sandwich platters, deli trays, hot entrées, dessert trays | Real |
| A snow day | Restaurant snow-day specials in DC, Philadelphia, Boston, NYC; take-home pizza kits sold as *Snow Day* | **Real by the rule** — and see §2 of the file: real is not the same as ours |
| **Moving day** | Movers' blogs and advice posts. Pizza and Chinese takeout named as the tradition. **No menu, no form, no deadline, no priced package** | **Rejected.** Advice about what to eat is not somebody selling for it |
| **In-laws for a week** | Hosting blogs, make-ahead listicles. Airbnb host-services *welcome meals* are sold to a lodging business for an arrival day, not to a household with relatives in the spare room | **Rejected**, and it is one of `cooks.md`'s three cooks |
| A rustic Tuscan evening | None sought; the definitional case S-013 names | Rejected |

Two of the three rejections are inside the site's own lists — *moving* is on S-013's own
moment-in-life list, and *in-laws for a week* is `cooks.md`'s third cook. The rule bites at home.

---

## 6. What the collection actually holds, measured

**Occasion vocabulary is almost absent.** Over 685 files, searching tags, titles, slugs and `aka`:
`thanksgiving` on **3** (`cranberry-sauce`, `turkey-pan-gravy`, `turkey-brine`), christmas-ish on
**3** (`gingerbread-cookies`, `pizzelle`, `speculaas`), `day of the dead` on **1**
(`pan-de-muerto`), easter on **1** (`hot-cross-buns`), new year on **1** (`chikuzenni`),
passover **1**, ramadan **1**. `make-ahead` is on 50, which is the largest occasion-adjacent tag
and is not an occasion.

**One correction to the ticket's premise.** The ticket says the collection carries three
seasonal-board dishes: `pan-de-muerto`, mooncake, `hot-cross-buns`. **There is no mooncake recipe.**
`recipes/custards-and-puddings/lotus-seed-paste.cook` is the filling and mentions the word; no
`.cook` file is a mooncake. Two of the three, not three.

**`keeps`, where it exists**, over the 138 that declare it: 25 say `not at all`, 23 are 1–2 days,
89 are 3–4 days, 1 is 5–7. The 3–4 day block is mostly beans and stews.

---

## 7. The two corners, with the numbers they would be ranked on

Computed with `buildSchedule()` and `costOf(recipe, 12)` over the built collection. This is the
material §3 of the file has to work with, and the shape of the problem is visible from the table
alone.

| Slug | standing @12 | longest @12 | elapsed @12 | wash | keeps | slack | evidence | untimed | assumed |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | ---: | ---: |
| `smoked-turkey-breast` | 0 | 0 | 920 | — | — | unforgiving | unknown | 1 | 0 |
| `turkey-brine` | 0 | 0 | 20 | — | — | unforgiving | unknown | 3 | 0 |
| `turkey-pan-gravy` | 4.5 | 4.5 | 14.5 | — | — | narrow | unknown | 3 | 3 |
| `cranberry-sauce` | 0 | 0 | 17 | — | — | — | unknown | 2 | 0 |
| `mashed-potatoes` | 0 | 0 | 22 | — | — | — | unknown | 2 | 0 |
| `green-beans` | 19.5 | 19.5 | 74.5 | — | — | — | unknown | 2 | **13** |
| `baked-turkey-wings` | 0 | 0 | 135 | 1 | — | narrow | unknown | 1 | 0 |
| `chili-con-carne` | 0 | 0 | 120 | 1 | **4 days** | forgiving | unknown | 4 | 0 |
| `gyoza` | 48 | 24 | 84 | — | — | narrow | inferred | 2 | 0 |
| `siu-mai` | 0 | 0 | 58 | — | — | unforgiving | unknown | 1 | 0 |
| `har-gow` | 0 | 0 | 36 | — | — | narrow | unknown | 1 | 0 |
| `xiao-long-bao` | 0 | 0 | 368 | — | — | unforgiving | unknown | 2 | 0 |
| `char-siu-bao` | 0 | 0 | 132 | — | — | narrow | **stated** | 0 | 0 |
| `wonton-soup` | 0 | 0 | 24 | 3 | not at all | — | unknown | 2 | 0 |
| `samosa` | 17 | 15 | 47 | — | — | narrow | inferred | 3 | 0 |
| `egg-rolls` | 18 | 10.5 | 48 | — | — | narrow | inferred | 1 | 0 |
| `ham-sui-gok` | 8.25 | 4.5 | 28.25 | — | — | narrow | inferred | 1 | 0 |

Three observations, all descriptive:

1. **Nine of the seventeen report zero standing minutes at twelve servings.** Four of them —
   `siu-mai`, `har-gow`, `xiao-long-bao`, `char-siu-bao` — are dishes whose whole labour is
   shaping by hand. Their shaping steps carry no timer, which is `scaling.md` §4.3 generalised
   beyond `gyoza`.
2. **The one Thanksgiving-shaped dish with all four fields is `chili-con-carne`**, which is not a
   Thanksgiving dish. Not one of the six actual holiday-plate files declares `keeps` or
   `washing-up`.
3. **`green-beans` carries 13 of its 19.5 standing minutes as `assumed`** — minutes nobody claimed.
   Which direction that error runs in depends on the sign the occasion gives hands-on time, and
   that is the single most consequential thing found in this pass.

---

## 8. Constraints this ticket is under

- **Two files only.** `docs/knowledge/occasions.md` and `docs/active/work/T-013-01/**`. No counter
  opened, no property added, no recipe, no code, no `README.md`.
- **No O(·) on a reader's page** (S-011). The analysis is knowledge-file only; nothing here reaches
  a recipe page.
- **`voice.md`'s register**, and S-013's warning that this is where the site would most easily
  start sounding like a magazine.
- **Never fabricate a number** (`README.md`, S-011 Conventions). Absent is a legitimate answer.
- **T-012-02 is in flight on the same branch** and owns the shelf-can-it-feed-one measurement.
  This ticket must not pre-empt its numbers; S-013 says no shelf opens until it reports.
