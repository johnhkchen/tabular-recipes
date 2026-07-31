# T-002-02 — Design

Six decisions, each with what was rejected. Everything here is grounded in Research §§ 2–8.

---

## D1. What gets written, and what gets skipped

**Options.**

1. *Take the ranked list top-down until the count reaches ten.* Cheapest, and it satisfies the
   letter of the criterion.
2. *Take the ranked list top-down, skip only what cannot be given a canonical time or that the
   pot genuinely does not help, and overshoot the floor.* More files, and the skips carry the
   ticket's actual argument.
3. *Pick the ten easiest tables.* Rejected outright — the criterion names the order, and the
   order is the point: the dishes that pay for the appliance come first.

**Decision: option 2, thirteen files.** Ten is a floor with no margin; if one file turns out to
rest on a number that cannot be sourced, a ten-file plan has to either drop below the floor or
keep the number. Thirteen leaves three files of slack for exactly that.

In rank order, written:

| Rank | Slug | Why it is in |
| --- | --- | --- |
| 3 | `birria-de-res` | 3–4 hr of oven braise, and the consomé falls out of the same pot |
| 5 | `carnitas` | splits cleanly: pressure for the tender, broiler leg unchanged |
| 6 | `pot-roast` | the dish the appliance is sold on |
| 7 | `braised-short-ribs` | collagen, wine, a sealed vessel; nothing resists |
| 10 | `oxtails` | all collagen, the pot's best case |
| 11 | `cachete` | same argument, and the taquería wants it weekly |
| 12 | `beef-bourguignon` | with the reduction handed back to the stove |
| 14 | `corned-beef` | the five-day cure stays; only the simmer moves |
| 16 | `chile-verde` | the sauce is already thin enough to come to pressure |
| 17 | `chili-con-carne` | 2 hr covered, and nothing in it is judged by eye |
| 18 | `hungarian-goulash` | 2 hr covered, one vessel throughout |
| 21 | `collard-greens` | the release choice is the whole lesson, and pot likker included |
| 30 | `beef-stew` | the story's own worked example, 35 min and a 15 min release |

Skipped, with reasons (Acceptance Criterion 3 requires these named):

| Rank | Slug | Why not |
| --- | --- | --- |
| 1, 2, 4, 9, 15 | `tonkotsu-broth`, `pho-broth`, `chintan-broth`, `chicken-broth`, `ham-hock-stock` | `recipes/soups/`. T-002-03 owns them; this ticket is fenced to `recipes/stews-and-braises/` |
| 8 | `chashu` | Two reasons. The published pressure times for one 3-lb rolled belly log run from 30 to 45 minutes with no agreement, and the dish is graded by whether cold slices hold together — a judgement made by looking, which a locked lid removes. Both of the gap note's own grounds for not stocking something |
| 13 | `lengua` | The repo's shared table says tongue at 45 min; common practice for a whole 3-lb tongue is 60. An unresolved third on a dish where undercooking means the skin will not peel is the exact number not to invent |
| 19 | `osso-buco` | The gap note names the risk itself: the shins have to hold their shape and stay tied on the plate. Under pressure that is a judgement you cannot make through the lid |
| 20 | `lamb-tagine` | The vessel is what is being sold. Swapping the appliance in is a real change to the dish, and the gap note says so |
| 22 | `suadero` | A confit: the meat cooks in a pound of fat, not in thin liquid. Fat does not make steam, so the pot cannot come to pressure on it. The dish the appliance genuinely does not do |
| 23 | `tripas` | No canonical pressure time for cleaned beef small intestine that I can source. The tenderising leg is also not the dish — the plancha is |
| 29 | `red-braised-pork-belly` | Its finish is a reduction to a syrupy glaze and its wet cook is only 90 min. Pressure-then-reduce works, but the pot gives back under an hour on a dish whose caramel is the point |
| 24–28, 31 | beans, congee, borscht, Boston baked beans | `recipes/rice-beans-and-grains/` and `recipes/soups/` — T-002-03 |

## D2. Where every pressure time comes from

**Options.**

1. *A conversion from the plain recipe's braise time.* Forbidden outright by the ticket and the
   story. Not an option; recorded so the rejection is on the record.
2. *One shared number per cut, from the table in `docs/gaps/instant-pot.md`.*
3. *A canonical figure per dish, corroborated against that table where the table speaks.*

**Decision: option 3.** The gap note's table is the in-repo canonical source and it covers
chuck, short rib, oxtail and pork shoulder — four of the thirteen dishes rest on it directly.
It does not cover a whole pot roast, a corned-beef flat, beef cheek or collards, and the table
is per *cut*, not per *dish*: a 4-lb roast left whole is not cubed chuck, whichever animal it
came off. So each file takes the canonical time for that dish as it is actually cooked under
pressure, and where the table speaks it is cited as corroboration.

The table of record, carried into Structure and repeated in `progress.md`:

| Slug | High pressure | Release | Source |
| --- | --- | --- | --- |
| `beef-stew` | 35 min | natural, 15 min | Story S-002, stated outright: *"about thirty-five minutes at pressure and then a natural release that is itself fifteen minutes"* |
| `beef-bourguignon` | 35 min | natural, 15 min | Same cut, same size (2-in chuck). Gap-note table: chuck at 35 |
| `chili-con-carne` | 35 min | natural, 15 min | Gap-note table: chuck at 35. Fine dice would reach shred sooner; the table's figure is kept rather than shaved, because in chili an over-tender cube shreds into the sauce and is not a fault |
| `hungarian-goulash` | 35 min | natural, 15 min | Gap-note table: chuck at 35 (1-in cubes) |
| `braised-short-ribs` | 40 min | natural, 15 min | Gap-note table: short rib at 40 |
| `oxtails` | 45 min | natural, 20 min | Gap-note table: oxtail at 45 |
| `carnitas` | 45 min | natural, 15 min | Gap-note table: pork shoulder at 45 (2-in chunks) |
| `birria-de-res` | 45 min | natural, 15 min | The canonical figure for 3-in chuck pieces with bone-in short rib in adobo; sits between the table's chuck (35, for 2-in) and its short rib (40) because the pieces are larger than either |
| `cachete` | 45 min | natural, 15 min | Beef cheek, canonically 45 min at high pressure; the same all-collagen class as the table's oxtail at 45 |
| `chile-verde` | 35 min | natural, 15 min | Pork shoulder cut at 1 1/2 in, canonically 35 min — the table's 45 is for the 2-in chunks carnitas uses |
| `pot-roast` | 75 min, then 4 min | natural 20 min, then quick | A whole 4-lb chuck roast, canonically about 20 min per pound, unlike cubed chuck. Root vegetables go in after, at their own canonical 4 min with a quick release |
| `corned-beef` | 90 min | natural, 20 min | A 3-lb cured flat, canonically 90 min. The plain recipe's 5-lb brisket is cut to 3 lb because a 6-qt pot will not take five pounds under the fill line |
| `collard-greens` | 20 min | quick | Canonically 20 min for collards under pressure. The release is quick on purpose — see D5 |

No file's number is arithmetic on the plain file's duration, and every row above says where it
came from.

## D3. The table grammar, shared across all thirteen

**Options.**

1. *Mirror each plain file's step structure and swap the braise step.* Keeps the diff legible
   per dish, but reproduces the oven's liquid volumes and its ordering, both of which are wrong
   under a lid.
2. *One skeleton for the whole shelf, adapted per dish.*

**Decision: option 2.** The gap note asks for exactly this — *"the sauté-then-seal grammar…
needs to be one operation in the table, not a footnote"* and *"a reduction step to hand back…
it should be the same operation everywhere."* Thirteen tables that read the same way are also
what makes the shelf browsable.

The skeleton, five or six operations:

```
(one full-width note at the top — what the pot changes about this dish)
1  season / toss          the meat, dry, before it goes near heat
2  brown on sauté         in the same pot, in batches, ~brown{N%min}
3  soften and deglaze     aromatics, then wine or stock, bottom scraped clean
4  pressure cook          liquid named with a real quantity, ~come to pressure{N%min},
                          ~pressure cook{N%min}, ~natural release{N%min}
5  finish, lid off        reduce / thicken / crisp / add the vegetables
```

Rejected within this: putting the browning in prose ("brown as the plain recipe does"). The
ticket is explicit that browning is an operation in the table, and the gap note calls it *the
whole claim of the appliance*.

Also rejected: flouring the meat before browning, which several plain files do
(`beef-stew`, `osso-buco`). Flour on the bottom of a sealed pot scorches and trips the burn
sensor. Those files finish with a slurry after the lid comes off instead, and the note at the
top says why.

## D4. Liquid

**Decision.** Every file names its pressure liquid as a real quantity in the table, and the
quantity is sized for a sealed pot rather than an oven:

- Dishes whose plain version relies on hours of evaporation get **less**: `beef-stew` 4 cups
  stock → 2; `braised-short-ribs` 3 cups wine + 4 cups stock → 1 1/2 + 1 1/2;
  `collard-greens` 3 qt → 2 cups; `hungarian-goulash` 4 cups → 2.
- Dishes that cook nearly dry get **an explicit floor**: `carnitas` and `cachete` name the cup
  of liquid that lets the pot seal at all, where the oven versions were content to sit half
  submerged.

Rejected: a single boilerplate sentence about "at least 1 cup of thin liquid" repeated in
thirteen files. The ticket says the amount is *a real quantity in the table*, and a number in
the ingredient column is checkable where a sentence is not.

## D5. Release

**Decision.** Every file names its release, gives it a duration, and the choice is argued in
the step where it is not obvious:

- **Natural** for every meat: twelve of thirteen. It is still cooking, which is why the number
  is part of the time and why the pressure minutes are what they are.
- **Quick** for `collard-greens`, and for the four-minute vegetable leg of `pot-roast`. Greens
  and root vegetables go from done to collapsed inside a natural release, so stopping the cook
  is the method.

Timer names are the exact words `time.ts` knows: `~come to pressure`, `~pressure cook`,
`~natural release`, `~quick release`. Rejected: `~release{}`, `~seal{}`, `~vent{}` — Research
§ 5 shows `release` alone is deliberately absent from `UNATTENDED` and the other two are not in
it at all, so each would report a sealed wait as time a cook stands at the pot.

## D6. Metadata

**Decision.**

- `>> counters: Instant Pot` only. The kit shelf is the one this file belongs on; the plain
  file keeps the Taquería, the Deli, the Diner. T-002-08 does the shelving pass, and a variant
  quietly inserting itself into five existing menus would pre-empt it.
- `>> dish:` the plain slug, `ls`-confirmed one by one, never assumed.
- `>> title: <Plain Title>, Instant Pot` — the shape the ticket prints.
- `>> aka:` the plain file's aka list plus the two phrasings a person actually searches:
  *instant pot X*, *pressure cooker X*.
- `>> pairs-with:` mirrors the plain file where it has one. Pairings are made mutual at build
  time in the generated data, so this writes nothing into another file.
- `>> tags:` the plain file's tags, plus `instant pot`, `pressure cooker`.
- `>> time:` the sum of the file's own named timers plus its prep, written in the only shape
  `authorMinutesOf()` reads whole: `1 hr 40 min`. Rejected: copying the plain file's `time:`,
  which is the exact fabrication the ticket forbids, in the one field nobody would check.
- `>> step.N:` overrides wherever the derived label would come out as a sentence fragment
  rather than a cook's verb — verified with `--labels`, not assumed.

## D7. What this design does not do

- Does not edit any pre-existing `.cook` file, `counters.json`, `docs/gaps/`, or anything under
  `src/`.
- Does not add the `## What it has` rename in `docs/gaps/instant-pot.md` — T-002-08's edit.
- Does not write a shared timing table anywhere in `docs/`; the gap note already has one, and
  this ticket's job is `recipes/**` only.
