# T-012-02 — Research

What exists, where it is, and what it can be counted with. **No proposals here.** The ticket asks
for five measurements and a ranked recommendation; this file maps the ground each one has to stand
on, and records the numbers already visible without doing any of the five.

## The shelf as it is today, re-counted

`src/generated/recipes.json` is the whole collection in one array, written by
`scripts/parse-recipes.mjs`. It is the only thing that needs reading — every `.cook` file's
metadata, ingredient names, per-step ingredients with parsed amounts, refs and timers are already
in it.

**685 recipes, 27 categories.** The ticket's table was taken at 658 and drifted:

| | Ticket says | Today |
| --- | --: | --: |
| `stews-and-braises` | 103 | **103** |
| Sweets — cookies, cakes, bars, custards | 101 | **101** |
| `rice-beans-and-grains` | 59 | **59** |
| `salads` | 23 | **23** |
| `vegetables-and-sides` | **18** | **24** |

Only one row moved, and it is the row the argument is about: `vegetables-and-sides` is 24 files,
not 18. S-012 wrote 18 at 658 files; six arrived since. **The ratio the cattle claim rests on is
therefore 101 : 24 rather than 101 : 18** before any ingredient is read, and the ticket's own
instruction — count by what is in the files, not by the folder name — is what settles whether
either number means anything.

Tag counts also moved slightly: pork 80 + chicken 79 + beef 70 = **229** meat tags (ticket: 225)
against **33** `vegetarian` (ticket: 32) and 13 `vegan`. 615 distinct tags.

## What a recipe record carries

One entry of `src/generated/recipes.json`, fields that matter to this ticket:

| Field | Shape | Coverage |
| --- | --- | --: |
| `ingredientNames` | flat, deduped, lower-case names | 685 |
| `steps[].ingredients[].amount` | `{ value, unit }` — parsed, nullable | most |
| `steps[].refs` | step indices this step consumes | — |
| `steps[].timers` | `{ name, minutes, attention }` | 640 files have at least one |
| `metadata.servings` | a string, usually a bare integer | 685 |
| `metadata.time` | author's claim | 685 |
| `slack` | `{ level, reason }` | **416** |
| `washingUp` | `{ items, count }` | **177** |
| `keeps` | authored, T-011-04 | **102** |
| `capacity` | authored, T-011-02 | **0** |
| `kit` | equipment variant | 58 |
| `tags`, `counters`, `aka`, `pairsWith`, `dish` | — | — |

**`capacity` is zero.** T-011-02 is in `implement` and nothing has landed, so any measurement this
ticket makes about batching has to come from the schedule or from prose, not from the field.

**`keeps` is 102 and rising** — T-011-04 is also in `implement`. Any number this ticket reports off
`keeps` is a number taken mid-backfill and has to say so.

## Servings, which decides persona one's whole query

189 recipes at 4 servings, 150 at 6, 126 at 8, 73 at 12, **39 at 2, 11 at 1**. Six files write
servings as a volume (`1 cup`, `2 cups`, `12 oz`) rather than a count, which is a parse the query
has to handle rather than silently drop.

**50 recipes serve one or two as written.** That is the pool before any other constraint — before
"no store run", before "not a heavy starch" — and it is small enough that the persona-one query is
a hand-checkable list rather than a statistic.

## The ingredient vocabulary

**1,081 distinct ingredient names across 685 files.** The head is what you would expect and is
almost entirely not food-you-eat: `kosher salt` 364, `garlic` 203, `water` 164, `granulated sugar`
126, `all-purpose flour` 123, `black pepper` 120, `unsalted butter` 117, `yellow onion` 115.

Three properties of this vocabulary decide how any plant count has to be built:

1. **It is uncontrolled.** `carrot`/`carrots`, `onion`/`onions`/`yellow onion`/`yellow onions`/
   `large yellow onions`, `tomato`/`tomatoes`/`ripe tomato`/`ripe tomatoes`/`plum tomato`/
   `plum tomatoes`/`roma tomatoes`/`beefsteak tomato`/`cherry tomatoes`/`grated tomatoes` are all
   separate strings. A count of distinct *names* is not a count of distinct *plants*.
   `docs/gaps/README.md` already records the same problem one level up: the tag vocabulary had 24
   concepts spelled two ways and nothing enforces it.
2. **Most plant-derived names are not plant food.** `ground cumin`, `bay leaf`, `dried oregano`,
   `cinnamon stick`, `star anise`, `vanilla extract`, `all-purpose flour` and `granulated sugar`
   are all plants botanically. None of them is what persona one means by a vegetable. Any count
   that does not draw this line will return a triumphant number and answer nothing.
3. **~40 names are components, not ingredients.** `onion-tomato masala` (9), `char siu` (4),
   `đồ chua` (4), `nước chấm` (3), `chāshū` (4), `birria braising liquid`, `makhani gravy`,
   `basil pesto`, `hong kong milk tea`. These are other recipes on this shelf appearing as a line
   in a table. A plant inside one of them is invisible to a flat scan of `ingredientNames` —
   which is a real limit on any count and has to be stated rather than papered over.

**Three ingredient names are not food at all** — `flat skewers`, `metal skewers`,
`oak or hickory wood` — already recorded in `docs/gaps/README.md`.

## Pulses, as the vocabulary has them

Names carrying a pulse, from the full list: `dried chickpeas` (3), `chickpeas` (3),
`cooked chickpeas` (2), `dried navy beans` (3), `dried black beans` (2), `black beans` (2),
`dried pinto beans` (2), `dried fava beans` (2), `dried gigante beans` (2), `dried adzuki beans`
(2), `dried black-eyed peas` (2), `baby lima beans` (2), `dried lima beans`, `cannellini beans`,
`dried beans`, `brown lentils` (2), `red lentils`, `urad dal` (2), `toor dal` (2),
`split mung dal`, `urad dal flour`, `green split peas`, `gram flour`, `chickpea flour`,
`roasted gram flour`, `fermented black beans`, `fermented red bean curd`, `red bean paste`,
`long beans` (2), `flat green beans`, `green beans` (3), `snow peas` (2), `frozen peas` (7).

**Three separate things are hiding in that list** and the ticket's "main thing rather than a
component" instruction is exactly the cut between them: a pulse the dish is built on
(`dried chickpeas` in a chana masala), a pulse as a flour (`gram flour` in a pakora — a pulse
botanically, a batter in the kitchen), and a green vegetable that is only a bean by name
(`green beans`, `snow peas`, `long beans`). `frozen peas` at 7 is the largest single count in the
list and is a garnish in most of its files.

## `buildSchedule`, and what its lanes actually are

`src/lib/schedule.ts` exports `buildSchedule(recipe, tree?)`. It runs on the raw recipe record
straight out of `recipes.json` — the pages do exactly that (`src/components/Timeline.astro:54`,
`src/components/CookModes.astro:37`) — so it is callable over all 685 files with no adapter.

`Schedule.lanes` is `packLanes(tasks)`: first-fit by start time, a task joins the first lane whose
last task has already finished. **A lane is a row on a timeline, not a cook.** Two facts follow,
and the multi-cook count depends on both:

- **Lane count is inflated by zero-length tasks.** `packLanes` gives an untimed operation a slot
  anyway, deliberately, so it does not vanish from the timeline. A recipe of six untimed prep steps
  all starting at 0 packs into six lanes and needs one person.
- **A lane is not a branch.** The real structural question — *does this recipe have two
  independent runs of work of real length* — is a property of the task DAG (`dependsOn`), which
  `Schedule.tasks` carries in full. Lanes are the packing of that DAG onto a clock.

The module states its own assumption at `src/lib/schedule.ts:63-66`:

> The schedule also assumes you have as many hands as the tree has branches; it never delays one
> hands-on task for another.

and then contradicts it deliberately for one number, `longestHandsOnMinutes`
(`src/lib/schedule.ts:306-322`), which serialises every hands-on span onto **one** cook.
`docs/knowledge/cooks.md` §3 names this as the finding: two models of how many cooks there are,
living in one module, and the multi-cook one built by accident.

`BREAK_MINUTES = 5` is the module's own threshold for what counts as a break, argued in a comment
from the collection's actual gap distribution. Anything this ticket calls "real length" should
reach for that constant rather than invent a second threshold.

## The staples doctrine, and what it can and cannot answer

`src/data/staples.json`: **31 staples**, a five-clause written rule for where the pantry line is,
and a note that matching is `matchesStaple()` in `src/lib/units.ts` — whole consecutive words, so
`salt` does not claim `unsalted butter` and `olive oil` does claim `extra-virgin olive oil`.
`except` lists exist because a pattern would otherwise swallow a real purchase (`salt pork`).

`src/lib/shopping.ts` uses it in one direction only: recipe → list, splitting into buy and
probably-have. `isMoreThanAJar()` puts a staple back on the buying side when the amount is large.

**Persona one's query needs it backwards** and `docs/knowledge/cooks.md` §1 says so: there is no
reading that goes *here is what I have* → *here is what is within reach*. The 31 staples are
therefore the floor of any assumed fridge, and everything above that floor is an assumption this
ticket has to write down in full — which is the acceptance criterion, and the reason the criterion
exists.

## Where whole-shelf readings live

`docs/gaps/` holds one page per counter plus `README.md`. Three precedents:

- **T-001-18, T-002-09, T-003-07** each read the whole shelf. Their findings landed in
  `docs/gaps/README.md` (the `## What no single classifier could see`, `## The five gaps to fill
  first` and `## Shelving notes` sections) and in individual counter pages.
- **`docs/gaps/soup-pot.md`** is the precedent for a file in `docs/gaps/` that is **not** a
  counter page. S-007 kept it and rewrote it as a record. It has no `## What it has` block,
  because `scripts/menu-sections.mjs` has no counter to match it to.

That precedent matters mechanically: `node scripts/menu-sections.mjs` parses the `## What it has`
block of every file in `docs/gaps/` back into `src/data/counters.json`. A new file there is safe
only if it carries no such block.

`docs/gaps/README.md`'s `## The five gaps to fill first` has never been a feature list — every
entry is food or a checker. The ticket's line about *write food before writing features* is
pointing at exactly this list.

## The board, and which stories are running

Open tickets today, by story:

| Story | Open tickets | Argued before `cooks.md`? |
| --- | --- | --- |
| **S-008** two things to wash | T-008-04 (blocked), T-008-05 | yes |
| **S-010** after a long day | T-010-03 | yes |
| **S-011** what doubling costs | T-011-02, -03, -04, -05, -06 | yes |
| **S-012** who is actually cooking | T-012-02 (this) | it *is* the personas |
| **S-013** cooking for a moment | T-013-01, -02, -03 | **no** — it cites `cooks.md` |

S-007 and S-009 have closed since S-012 was written, which is why S-012's sentence *"five stories
are in flight"* and today's roster of five are not the same five.

**S-013 is the one story that already read the personas**, and it forward-declares this ticket:
*"nothing here opens a shelf until T-012-02 has said whether the collection can feed one."* It
also carries the dumpling-party inversion — an occasion where O(n) hands-on work is the *point* —
which is the sharpest existing counter-example to any single difficulty ranking.

**S-011's T-011-06** — *how many people, over how many days, with how much left in you* — is the
one the ticket names as the live collision. S-011 §"The two situations" already splits its own
scope into *two meals for one, for today* (n = 2, "S-010's dials already answer this") and
*six people over three days* (n ≈ 18). The two personas are already both inside one story, and
T-011-06 is scheduled to build one control for both.

`docs/knowledge/cooks.md` §"Holding a design against these" has already worked two examples —
S-010's three dials (passes / fails / cannot say) and S-011's capacity (passes / silent / silent) —
and states the rule: a design **passes** when it changes what the contradiction costs, **fails**
when it serves only the half already served, **cannot say** when the source does not settle it.
That rule is the instrument for §5 of this ticket and does not need re-deriving.

## Constraints this ticket is under

- **It builds nothing.** No `.cook`, no `src/`, no `scripts/`. Writable paths are `docs/gaps/**`
  and `docs/active/work/T-012-02/**` only.
- **It edits no story and no ticket**, including where it finds a conflict. A conflict is a
  recommendation in the artifact, named with the ticket it concerns.
- **Never fabricate a number** (`README.md`, and S-011 restates it). Every count here has to be
  reproducible from a command or a stated rule, and where a rule is a judgement call the call is
  written down.
- **Absent is a real answer.** `slack` at 416/685 and `washingUp` at 177/685 are not zeros, and a
  query that treats them as zeros will recommend the least-annotated recipes first — the trap
  S-010 §"The honesty problem" already named.
- **`npm run verify` must still pass**, and nothing this ticket writes is read by the build except
  `docs/gaps/` via `menu-sections.mjs`, which only reads `## What it has` blocks.

## Environment note

`node` is not on the default `PATH` in this shell; `~/.nvm/versions/node/v24.18.1/bin` has it.
Node 24 strips TypeScript types natively, so `src/lib/schedule.ts` can be imported directly by an
analysis script with no build step — verified by running `buildSchedule` over a record from
`recipes.json` and getting lanes and minutes back.
