# T-002-02 — Progress

Thirteen files written, all six plan steps done, six commits through `lisa commit-ticket`.

## Steps

| Step | What | State |
| --- | --- | --- |
| 1 | `beef-stew-instant-pot.cook`, the skeleton | done — `87679ec` |
| 2 | birria, carnitas, pot roast, short ribs | done — `e6126cb` |
| 3 | oxtails, cachete, bourguignon | done — `b2f3055` |
| 4 | corned beef, chile verde, chili, goulash | done — `7b1d0a4` |
| 5 | collards | done — `d28120f` |
| 5a | label fix, three files (deviation, below) | done — `9fd7e14` |
| 6 | whole-collection verification | done — see *Verification* |

## Files created (13, nothing modified, nothing deleted)

```
recipes/stews-and-braises/beef-bourguignon-instant-pot.cook
recipes/stews-and-braises/beef-stew-instant-pot.cook
recipes/stews-and-braises/birria-de-res-instant-pot.cook
recipes/stews-and-braises/braised-short-ribs-instant-pot.cook
recipes/stews-and-braises/cachete-instant-pot.cook
recipes/stews-and-braises/carnitas-instant-pot.cook
recipes/stews-and-braises/chile-verde-instant-pot.cook
recipes/stews-and-braises/chili-con-carne-instant-pot.cook
recipes/stews-and-braises/collard-greens-instant-pot.cook
recipes/stews-and-braises/corned-beef-instant-pot.cook
recipes/stews-and-braises/hungarian-goulash-instant-pot.cook
recipes/stews-and-braises/oxtails-instant-pot.cook
recipes/stews-and-braises/pot-roast-instant-pot.cook
```

## The numbers, and where each came from

**No time on this list is arithmetic on the plain recipe's duration.** Sources: `S-002` is the
story text; *gap table* is the pressure-braise table in `docs/gaps/instant-pot.md` §
*Components it would need*; *canonical* is the established pressure time for that dish as it is
actually cooked, stated in the file itself where it needed arguing.

| File | Come to pressure | High pressure | Release | Source |
| --- | --- | --- | --- | --- |
| `beef-stew` | 12 | **35** | natural 15 | S-002, worded outright: *"thirty-five minutes at pressure and then a natural release that is itself fifteen minutes"* |
| `beef-bourguignon` | 15 | **35** | natural 15 | gap table, chuck at 35 (2-in cubes, same cut and size) |
| `chili-con-carne` | 12 | **35** | natural 15 | gap table, chuck at 35. Not shaved for the finer dice — an over-tender cube shreds into a bowl of red and that is not a fault |
| `hungarian-goulash` | 12 | **35** | natural 15, then 4 min + quick | gap table, chuck at 35. Potatoes at their own canonical 4 min |
| `chile-verde` | 12 | **35** | natural 15 | canonical for pork shoulder cut at 1 1/2 in; the gap table's 45 is the 2-in chunk carnitas uses, and the file says so |
| `braised-short-ribs` | 15 | **40** | natural 15 | gap table, short rib at 40 |
| `oxtails` | 15 | **45** | natural 20 | gap table, oxtail at 45 |
| `carnitas` | 12 | **45** | natural 15 | gap table, pork shoulder at 45 (2-in chunks) |
| `cachete` | 12 | **45** | natural 15 | canonical for beef cheek; the same all-collagen class as the gap table's oxtail at 45 |
| `birria-de-res` | 15 | **45** | natural 15 | canonical for 3-in chuck pieces with bone-in short rib in adobo; larger than either the table's chuck (35, 2-in) or its short rib (40) |
| `pot-roast` | 15 | **75**, then 4 | natural 20, then quick | canonical for a whole 4-lb chuck roast, about 20 min a pound — a roast left whole is not cubed chuck. Root vegetables at their own canonical 4 min |
| `corned-beef` | 20 | **90** | natural 20 | canonical for a 3-lb cured flat. The 5-day cure and the 2-hr desalting soak are unchanged from the plain file |
| `collard-greens` | 10 | **20** | **quick** | canonical for collards under pressure; the release is quick on purpose, because greens collapse inside a natural one |

## Skipped, with reasons

Required by Acceptance Criterion 3. Ranks are `docs/gaps/instant-pot.md`.

| Rank | Slug | Why |
| --- | --- | --- |
| 1, 2, 4, 9, 15 | `tonkotsu-broth`, `pho-broth`, `chintan-broth`, `chicken-broth`, `ham-hock-stock` | In `recipes/soups/`, owned by T-002-03. This ticket is fenced to `recipes/stews-and-braises/` |
| 8 | `chashu` | Published pressure times for one 3-lb rolled belly log run 30 to 45 minutes with no agreement, and the dish is graded by whether cold slices hold together — a judgement made by looking, which a locked lid removes |
| 13 | `lengua` | The gap table says tongue at 45; common practice for a whole 3-lb tongue is 60. An unresolved third, on a dish where undercooking means the skin will not peel, is exactly the number not to invent |
| 19 | `osso-buco` | The shins have to hold their shape and stay tied on the plate, and the gap note names that as the risk to test. Under a locked lid it cannot be watched |
| 20 | `lamb-tagine` | The vessel is what is being sold. Swapping the appliance in is a real change to the dish |
| 22 | `suadero` | A confit: the meat cooks in a pound of fat, not thin liquid. Fat makes no steam, so the pot cannot come to pressure on it |
| 23 | `tripas` | No canonical pressure time for cleaned beef small intestine that could be sourced. The tenderising leg is also not the dish — the plancha is |
| 29 | `red-braised-pork-belly` | Its finish is a reduction to a syrupy glaze and its wet cook is only 90 minutes; the pot gives back under an hour on a dish whose caramel is the point |
| 24–28, 31 | beans, congee, borscht, Boston baked beans | `recipes/rice-beans-and-grains/` and `recipes/soups/` — T-002-03 |

Ranks 3, 5, 6, 7, 10, 11, 12, 14, 16, 17, 18 and 21 are written, in that order, plus rank 30
(`beef-stew`), which the ticket names in its Context and which the story gives the numbers for.

## Deviations from the plan

**One, and it was caught by the tests rather than by reading.** `npx vitest run` failed
`src/lib/icons.test.ts:273` — *"recognises every verb the recipes open an operation with"* — a
collection-wide test that had not been read during Research. Three of my labels opened with a
noun rather than a verb (`vegetables, 4 min, quick release` in `beef-stew` and `pot-roast`,
`potatoes, 4 min, quick release` in `hungarian-goulash`), so the second pressure leg drew the
fallback bowl instead of an icon.

Fixed in `9fd7e14` by opening those three labels with `add the …`, which `matchOperation()`
answers. Attribution was done per verb rather than guessed:

```
$ node scratch/verbs.mjs      # every fall-through verb, with the files it came from
potatoes     hungarian-goulash-instant-pot
vegetables   beef-stew-instant-pot, pot-roast-instant-pot
…
```

After the fix, no fall-through verb belongs to a file this ticket owns. The ones that remain
are listed under *Open concerns* in `review.md`; they belong to T-002-03, which is still in
flight in the same working tree.

## Verification run

```
$ node scripts/check-recipes.mjs
all 549 file(s) draw a table.                      # includes the 13 new ones

$ npx vitest run
Test Files  1 failed | 7 passed (8)
     Tests  1 failed | 717 passed (718)            # the one failure is icons.test.ts, above

$ git status --porcelain recipes/stews-and-braises/
                                                   # empty: nothing staged, modified or untracked
```

Every new file was also checked with `--labels` as it was written, and every timer was read
back with a throwaway script that prints the duration and attention the site derives:

```
beef-stew-instant-pot   >> time: 1 hr 45 min -> 105 min
  ~brown             12 min  hands-on   (name)
  ~come to pressure  12 min  unattended (name)
  ~pressure cook     35 min  unattended (name)
  ~natural release   15 min  unattended (name)
  ~pressure cook      4 min  unattended (name)
  ~quick release      2 min  unattended (name)
  ~thicken            8 min  hands-on   (default)
```

All 13 files report the same shape: every `~come to pressure`, `~pressure cook`,
`~natural release` and `~quick release` reads **unattended, by name**, and every `>> time:`
line parses whole.
