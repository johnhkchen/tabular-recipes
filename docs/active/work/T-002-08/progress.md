# T-002-08 — Progress

All six plan steps done. `npm run verify` green. Four commits through `lisa commit-ticket`.

---

## Steps

| # | Step | State | Commit |
| --- | --- | --- | --- |
| 0 | Baseline captured (sections report, `counters.json`, 1082-name aisle map, test run) | done | — |
| 1 | One Pot membership — 58 `.cook` files | done | `abba20f` |
| 2 | The Bowl Shop membership — 67 `.cook` files | done | `9b79c4e` |
| 3 | Three gap notes rewritten, folded into `counters.json` | done | `ac9236e` |
| 4 | `aisles.json` — 33 patterns | done | `4b3a36b` |
| 5 | `npm run build`, the three pages asserted from the built HTML | done | — |
| 6 | `npm run verify` end to end | done | — |

Working tree after step 6: `git status --porcelain` shows only the ticket file (Lisa's) and the
untracked work directory. No ticket-owned source is staged, modified or untracked.

---

## Results against the acceptance criteria

| Criterion | Result |
| --- | --- |
| Three counters populated, in menu order, no "Also here" rendered | Bowl Shop 6 sections / 103, Instant Pot 5 / 25, One Pot 4 / 72. Section titles read out of the built HTML equal `counters.json` order exactly; no `<h2>` reads `Also` or `Also here` |
| Bowl Shop dressing section, with the exclusions recorded | 24 of the drawer's 40; the 16 left off are in `docs/gaps/bowl-shop.md` § *What came off the dressing drawer* and in §3 below |
| One Pot ≥ 25, majority written before this story | **72**, of which **58** predate S-002 — 81% |
| Instant Pot shelves every `kit: Instant Pot`, ≥ 20 | **25**. `grep -rl '^>> kit: *Instant Pot' recipes/` returns 25; the section lists are the same 25 |
| Every slug resolves to a real recipe | asserted twice: `menu-sections.mjs` refuses an unknown slug, and a post-write check confirms all 200 items resolve **and** name their counter |
| Aisle test passes, `npx vitest run` green | 37 unplaced → **3**; `8 files, 825 tests, 0 failures` |
| `npm run build` succeeds, three pages render | 682 pages; all three menus present and linked from the front page |
| Only `counters.json` and `aisles.json` modified | **not met, deliberately** — see `review.md` §1 |

---

## 1. The One Pot list, and how each candidate was decided

Applied to `docs/gaps/one-pot.md`'s 114 candidates. The `cookware` line was the starting
evidence; **eight dishes failed on something `cookware` does not record**, and those were only
found by reading the steps.

### Shelved — 58 files

*Braises and stews (31)* — one vessel from start to finish, oven or broiler counted as the heat
the same vessel goes into:
`beef-stew` `pot-roast` `chili-con-carne` `beef-bourguignon` `coq-au-vin` `braised-short-ribs`
`osso-buco` `carnitas` `cachete` `chile-verde` `oxtails` `irish-stew` `hungarian-goulash`
`lamb-tagine` `massaman-curry` `rogan-josh` `vindaloo` `passanda` `japanese-beef-curry`
`doro-wat` `brunswick-stew` `balti` `bhuna` `jalfrezi` `madras` `dopiaza` `thai-red-curry`
`thai-yellow-curry` `panang-curry` `soy-sauce-chicken` `white-cut-chicken`

*Skillet dinners (11)* — `smothered-pork-chops` `chicken-adobo` `tinga-de-pollo` `xiu-mai`
`western-omelette` `egg-foo-young` `country-fried-steak` `general-tsos-chicken` `orange-chicken`
`sesame-chicken` `sweet-and-sour-pork`

*Rice and grains that cook in (9)* — `jambalaya` `dirty-rice` `hoppin-john` `kitchari`
`risotto-alla-milanese` `cuban-black-beans` `black-eyed-peas` `butter-beans` `congee`

*Soups that are the whole meal (7)* — `minestrone` `harira` `split-pea-soup`
`new-england-clam-chowder` `borscht` `black-bean-soup` `wonton-soup`

### Left off — the eight the `cookware` line would have let through

| Slug | What reading it found |
| --- | --- |
| `chicken-noodle-soup` | egg noodles boiled in four quarts of separate water and drained into the broth at the end |
| `matzo-ball-soup` | the balls poached in their own salted pot, explicitly so their starch does not fog the broth |
| `biryani` | rice parboiled five minutes in four quarts and drained before it is layered |
| `corned-beef-hash` | potatoes simmered in two quarts and drained |
| `beef-with-broccoli` | broccoli blanched in boiling salted water and drained |
| `mujaddara` | lentils simmered in three cups of water and drained, separately from the onion skillet |
| `chana-masala` | chickpeas simmered ninety minutes apart from the masala |
| `dal-tadka` | the tempering fried in a second pan and poured over |

**None of these eight declares a second vessel.** This is the ticket's own colander case, and it
is the reason the gap note now says its `cookware` line is evidence rather than an answer.

### Left off — the other four groups

- **Two vessels declared (10)** — `birria-de-res` (Dutch oven + skillet), `beef-rendang`,
  `dansak`, `red-braised-pork-belly`, `palak-paneer`, `mushroom-risotto`, `suadero`, `lengua`,
  `tripas`, `caldo-verde`.
- **A jug blender, food processor or mortar (8)** — `jollof-rice`, `mexican-red-rice`, `korma`,
  `patia`, `karahi`, `thai-green-curry`, `pad-krapow`, `corn-chowder`. The strictest line drawn
  here; see `review.md` §4 for the argument against it.
- **The protein cooked off the pan the sauce is made in (2)** — `butter-chicken`,
  `chicken-tikka-masala`.
- **Passes the vessel test but is not a dinner (25)** — `rice-pilaf`, `lemon-rice`,
  `coconut-rice`, `yellow-rice`, `pilau-rice`, `polenta`, `cheese-grits`, `refried-beans`,
  `fried-okra`, `stewed-squash`, `creamed-corn`, `green-beans`, `home-fries`, `hash-browns`,
  `breakfast-sausage-patties`, `creamed-chipped-beef`, `collard-greens`, `chashu`, plus the seven
  first courses off *Soups that are the whole meal* (`hot-and-sour-soup`, `tomato-soup`,
  `butternut-squash-soup`, `potato-leek-soup`, `red-lentil-soup`, `cream-of-mushroom-soup`,
  `french-onion-soup`). This menu has four sections and none of them is for a side.
- **The old "Also here" line (4)** — `macaroni-and-cheese` and `tuna-noodle-casserole` boil pasta
  separately; `bolognese` is a sauce; `meatballs` went to the Bowl Shop's protein list, which is
  where T-002-07 asked for it.

### Borderline calls made in favour of the shelf

`osso-buco` keeps a dish of dredging flour, `lamb-tagine` a marinating bowl, and the four
battered wok dishes their batter bowls. T-002-04 set that precedent for `tortilla-espanola` in
its own words — *a plate is not a pot* — and it is applied here rather than re-argued.

---

## 2. The Instant Pot list

No `.cook` edit. All 25 already named the counter. The gap note's `## What is already here` block
listed the **plain** slugs (`birria-de-res`), because it was written before the variants existed;
every one was replaced with its `-instant-pot` variant, or the whole block would have reported as
*listed but not shelved here* and the page would have rendered one giant `Also`.

Two placements worth stating: `borscht-instant-pot` and `collard-greens-instant-pot` are neither
meat braises nor beans, and both sit under *Braises that took all afternoon*. They are cooked
exactly like the braises — sauté, lid, pressure, release — and the alternative was a sixth section
T-002-01 never opened. `corned-beef-instant-pot` is the only *Whole birds and big cuts* item: a
whole brisket, 90 minutes.

---

## 3. The Bowl Shop dressing drawer — 40 files, 24 shelved

The test: the counter's own build order ends *dressing last*, so — **would this be the last thing
ladled over a finished bowl?**

**In (24).** `basic-vinaigrette` `caesar-dressing` `green-goddess-dressing` `ranch-dressing`
`blue-cheese-dressing` `honey-mustard-dressing` `russian-dressing` `miso-ginger-dressing`
`goma-dare` `tahini-sauce` `toum` `tzatziki` `raita` `nuoc-cham` `chimichurri` `basil-pesto`
`romesco` `muhammara` `hummus` `baba-ganoush` `aioli` `crema-mexicana` `white-sauce`
`mint-chutney`

The five thick dips — hummus, baba ganoush, muhammara, toum, tzatziki — are in because Cava's
entire board is dips spooned into the bowl as a component, not because they pour.

**Out (16), each with its reason.**

| Slug | Why not a drizzle |
| --- | --- |
| `chopped-liver` | named by the ticket itself; a deli spread eaten on rye |
| `cream-cheese` | named by the ticket itself; a schmear for a bagel |
| `scallion-schmear` | the same, with scallions in it |
| `pork-liver-pate` | a terrine sliced onto a bánh mì |
| `sour-dill-pickles` | a whole pickle out of a barrel |
| `do-chua` | a pickle — shelved under *What goes on top* |
| `guacamole` | a topping every board prints as a topping — shelved under *What goes on top* |
| `birista` | fried shallots, the crunch line — *What goes on top* |
| `labneh` | strained yogurt, spooned on — *What goes on top* |
| `paneer` | a cheese, cubed — *What goes on top* |
| `queso-fresco` | a cheese, crumbled — *What goes on top* |
| `coleslaw` | an already-dressed salad, and a deli-case one |
| `barbecue-slaw` | the same, from the Smokehouse |
| `lime-pickle` | a preserve eaten in teaspoons beside a curry |
| `mango-chutney` | the same |
| `mayonnaise` | an ingredient of six dressings on the list above, not a line on a board |

Six of the sixteen are not off the counter at all — they moved to the section they belong in.

---

## 4. The rest of the Bowl Shop

- ***Grain bowls*** — the twelve assembled bowls only. The gap note's earlier list put
  `rice-pilaf`, `lemon-rice`, `coconut-rice`, `yellow-rice`, `pilau-rice`, `polenta`,
  `cheese-grits`, `tabbouleh`, `com-tam` and `bun-thit-nuong` here. Those are **bases**, and a
  section called *Grain bowls* that lists a plain lemon rice mislabels a side as a bowl. The
  note now says so in prose instead.
- ***Leafy salads*** — the twelve T-002-06 wrote, plus four genuinely leafy pre-existing ones
  (`fattoush`, `kachumber`, `som-tum`, `larb-gai`). The six deli-case salads the gap note listed
  — `potato-salad`, `macaroni-salad`, `chicken-salad`, `egg-salad`, `tuna-salad`,
  `whitefish-salad` — stay off: the story's opening paragraph names that shape as the thing this
  counter exists to contrast with.
- ***What goes on top*** — T-002-07's handoff taken whole, all 30, plus its own 6. It is a
  considered list and nothing in it failed a read.
- ***Roasted vegetables*** — the 6 T-002-07 roasted, plus `batata-harra`, which its handoff
  argues for explicitly as the site's only other high-heat vegetable. The remaining 8 from that
  handoff (`green-beans`, `stewed-squash`, `creamed-corn`, `mashed-potatoes`, `collard-greens`,
  `fried-okra`, `ratatouille`, `candied-yams`) are **not roasted**. T-002-07 flagged
  `candied-yams` on exactly that ground — *"shelving it would make the section look filled when
  it is not"* — and the argument applies to all eight, including `ratatouille`, which its own
  handoff calls borderline.
- ***Soups*** — eight a fast-casual counter genuinely prints as a cup of soup:
  `butternut-squash-soup`, `tomato-soup`, `potato-leek-soup`, `red-lentil-soup`, `corn-chowder`,
  `minestrone`, `black-bean-soup`, `caldo-verde`. `dal-tadka`, `miso-soup`, `avgolemono` and
  `cream-of-mushroom-soup` were on the gap note's list and are left at the counters they came
  from; `miso-soup` in particular is T-003-06's, not this ticket's.

---

## 5. Aisles — 33 patterns, 34 names placed, nothing stolen

| Aisle | Patterns added |
| --- | --- |
| Produce | `burdock root` `lotus root` `kabocha` `radicchio` `snow pear` `snow pears` `hairy gourd` `amaranth` `yuca` |
| World foods | `abura-age` `konnyaku` `hijiki` `laver` `job's tears` `lily bulb` `fox nut` `apricot kernels` `Solomon's seal` `adenophora root` `overlord flower` `goma dare` `teriyaki sauce` |
| Fishmonger | `yellowtail` `crucian carp` |
| Spice rack | `filé powder` `taco seasoning` `aged tangerine peel` |
| Tins & jars | `pepperoncini` `basic vinaigrette` `ranch dressing` `caesar dressing` |

Nine patterns cover more than one name because `soldAs` folds the home-prep word off first:
`konnyaku` also takes `ito konnyaku`, `hijiki` takes `dried hijiki`, `job's tears` takes
`raw job's tears` and `toasted job's tears`, `yellowtail` takes both the fillets and the collar.

**The theft check, which is the one that matters.** `aisleFor()` was run over all 1082 ingredient
names before and after. **34 names moved, every one of them from `other` to a real aisle, and not
one moved between two real aisles.** That is the `"pepper"`-in-Produce failure the ticket names,
and it did not happen — because every pattern added is multi-word or a word no other name
contains. No `packs[]` entry was added; `purchaseOf` is untouched.

**Three names are deliberately left unplaced**: `flat skewers`, `metal skewers`,
`oak or hickory wood`. None of the fourteen aisles is a hardware shelf, and filing hickory chunks
under *Dry goods* to move a number is the same class of lie as an invented pack size. The test's
ceiling is 21 unplaced names out of 1082; three is well inside it.

`aged tangerine peel` went to the **Spice rack**, next to the `dried tangerine peel` and
`dried mandarin peel` already there, rather than to World foods with the other Chinese
soup goods — same product, same shelf.

---

## Deviations from the plan

One, and it is a correction rather than a change of direction. The plan said the three gap notes
would have their heading renamed and lists curated. In fact each also needed its **ranked
"what it is missing" list rewritten**, because between them the six writer tickets wrote 14 of
One Pot's 20 ranked absences and 15 of the Bowl Shop's 22. Leaving a page that calls
`chicken-and-dumplings` the most conspicuous hole on a shelf that now carries it would be a
worse artifact than the one this ticket started with, and `docs/gaps/` is where the next pass is
told to start. Both lists are renumbered with only the genuinely unwritten items, and the
Instant Pot note gained one paragraph saying which of its 31 ranks are done and where the skip
reasons live. No ranked item was deleted without being either written or explained.
