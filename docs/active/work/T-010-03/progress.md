# T-010-03 — Progress

All nine steps of `plan.md` are done. Two files written, two commits, both suites run.

---

## Step-by-step

| step | | outcome |
| --- | --- | --- |
| 1 | harness reproducing `search.json` | done — `adobo-para-al-pastor` matches the shipped record |
| 2 | coverage over 685 | done — 269 / 661 / 177 |
| 3 | run the scenario, read all 227 | done — 72 right · 12 borderline · 143 wrong |
| 4 | passes that should not | done — the confidence state holds on 4a, and has a hole on 4b |
| 5 | fails that should not | done — 2 interval bugs, 1 `churn`, 20 unknown timer names |
| 6 | measure each proposed word | done — `reduce`+`thicken`: 31 move, 18 newly pass, **0 newly fail** |
| 7 | dark-roux and rescue checks | done — gumbo 4th of 685; the qualifier prints on ~5 cards |
| 8 | write the two documents | done — `docs/gaps/filter.md`, `docs/gaps/README.md` |
| 9 | `verify` and `verify:mobile` | run and attributed — see `review.md` |

## Deviations from the plan

**One, and it is a correction rather than a change of course.** Step 5 planned to read the 42
answerable failures for the three shapes the ticket names. Reading them found two, and finding the
third needed a different move: extracting every timer **name** written anywhere in the collection
and differencing it against `UNATTENDED ∪ HANDS_ON`. That turned a list of suspicions into a
closed set of twenty, and it is the finding the ticket's *"expect to catch more"* was pointing at.
The extraction is described in `plan.md` step 5 as written, because the plan was updated before
the work continued.

**One thing planned and not needed.** Step 6 budgeted for proposals that make a recipe newly fail,
with a rule for reporting them by name. None did. The safety number is zero and the rule was never
exercised.

## Commits

| commit | file | message |
| --- | --- | --- |
| `b1e1128` | `docs/gaps/filter.md` | Write down what the filter cannot say |
| `3bdd021` | `docs/gaps/README.md` | Say what fraction of the shelf each dial can answer for |

Both through `lisa commit-ticket` with exact `--include` paths. No ordinary `git add` at any
point — the working tree carries 26 files belonging to S-011 in flight and a broad add would take
them.

---

## The scenario, every result, with a verdict

`standing = 15`, no other dial. **227 pass · 42 fail · 416 we can't say.**

The standard is fixed in `design.md` D2 and applied in order: not dinner → started yesterday →
the standing figure is a floor → a quart of oil. A recipe takes the first reason that applies.

### Right for the evening — 72

`baked-pork-chop-rice` · `balti` · `bbq-tofu-bowl` · `beef-chow-fun` · `beef-stroganoff` ·
`beef-with-broccoli` · `blackened-salmon` · `blt` · `burrito-bowl` · `century-egg-amaranth-soup` ·
`chahan` · `chicken-and-dumplings` · `chicken-parmigiana` · `chicken-tikka-masala` ·
`club-sandwich` · `congee` · `corned-beef-hash` · `country-fried-steak` ·
`crisped-marinated-tofu` · `crispy-chickpea-bowl` · `crispy-rice-bowl` · `crucian-carp-tofu-soup` ·
`dansak` · `dopiaza` · `egg-foo-young` · `eggs-benedict` · `fish-taco-bowl` · `grilled-cheese` ·
`haemul-pajeon` · `ham-macaroni-soup` · `home-fries` · `hong-kong-egg-sandwich` ·
`hong-kong-french-toast` · `jalfrezi` · `kitchari` · `lo-mein` ·
`luncheon-meat-and-egg-noodles` · `luncheon-meat-and-egg-sandwich` · `madras` · `meatballs` ·
`minced-beef-rice` · `miso-ramen` · `miso-salmon-bowl` · `mustard-greens-tofu-soup` · `omurice` ·
`one-pot-pasta` · `oyakodon` · `pad-see-ew` · `pad-thai` · `panang-curry` ·
`pork-chop-in-tomato-sauce` · `pork-roll-egg-and-cheese` · `saba-shioyaki` · `satay-beef-noodles` ·
`seaweed-egg-drop-soup` · `shakshuka` · `shrimp-and-egg-rice` · `singapore-mei-fun` ·
`skillet-lasagna` · `smothered-pork-chops` · `soy-sauce-pan-fried-noodles` · `spicy-lamb-bowl` ·
`teriyaki-chicken-bowl` · `thai-red-curry` · `thai-yellow-curry` · `tinga-de-pollo` ·
`tom-yum-goong` · `tomato-potato-beef-soup` · `tonjiru` · `tuna-melt` · `tuna-noodle-casserole` ·
`western-omelette`

**This is the filter working, and it is a good list.** A tired person handed `omurice`,
`pad-see-ew`, `shakshuka`, `tonjiru` or `one-pot-pasta` would be glad. Seven minutes elapsed,
seven standing, one pan.

### Borderline — 12

| slug | why |
| --- | --- |
| `pad-kee-mao` `pad-krapow` `patia` `palak-paneer` `smash-burger` `kafta` | needs a mortar, a blender, a griddle or a charcoal grill |
| `birria-de-res-instant-pot` `cachete-instant-pot` | needs an Instant Pot |
| `bun-thit-nuong` `massaman-curry` `passanda` `oxtails` | two to four hours on the clock |

Each is right for the evening **if** the kitchen has the thing or the reader started early, and
the filter cannot see either condition.

### Wrong — 143

**Not dinner — a component another recipe eats (37).** `adobo-para-al-pastor` · `ajitama` ·
`berbere` · `chili-powder` · `chinese-five-spice-powder` · `cream-gravy` · `creamed-chipped-beef` ·
`garam-masala` · `harissa` · `hollandaise` · `lime-pickle` · `madras-curry-powder` ·
`makhani-gravy` · `mango-chutney` · `pan-dulce-dough` · `massaman-curry-paste` · `mayu` · `menma` ·
`mentsuyu` · `piloncillo-syrup` · `mint-chutney` · `miso-tare` · `muhammara` ·
`panang-curry-paste` · `raita` · `ras-el-hanout` · `red-enchilada-sauce` · `romesco` ·
`salsa-verde` · `shawarma-spice` · `shichimi-togarashi` · `thai-green-curry-paste` ·
`thai-red-curry-paste` · `thai-yellow-curry-paste` · `vindaloo-paste` · `whipped-cream` · `zaatar`

**Not dinner tonight — a stock, a loaf, a side, a course or a drink (75).** `al-pastor` ·
`baguette` · `banana-pudding` · `banh-mi-khong` · `batata-harra` · `bolillos` ·
`breakfast-sausage-patties` · `brioche` · `carne-asada` · `cha-lua` · `challah` · `chapati` ·
`char-siu-bao` · `chashu` · `chewy-granola-bars` · `chicken-broth` · `chicken-shawarma` ·
`chinese-chicken-salad` · `chintan-broth` · `chintan-broth-instant-pot` · `chocolate-babka` ·
`crab-rangoon` · `creamed-corn` · `curry-beef-brisket` · `dashi` · `dinner-rolls` · `fattoush` ·
`flour-tortillas` · `french-toast` · `gyro-meat` · `hash-browns` · `hijiki-no-nimono` ·
`hot-cross-buns` · `hot-water-cornbread` · `hotteok` · `hush-puppies` · `japanese-milk-bread` ·
`kheer` · `kiriboshi-daikon` · `larb-gai` · `lengua` · `maamoul` · `mexican-red-rice` ·
`milkshake` · `new-england-boiled-dinner` · `new-england-boiled-dinner-slow-cooker` ·
`onion-bhaji` · `pan-de-muerto` · `panzanella` · `papadom` · `paratha` · `pilau-rice` ·
`pineapple-bun` · `pita-bread` · `pizza-dough` · `ramen-noodles` · `rice-pudding` ·
`roasted-beet-salad` · `salade-nicoise` · `scrapple` · `seared-halloumi` · `sesame-balls` ·
`shaved-brussels-salad` · `socca` · `som-tum` · `soy-sauce-chicken` ·
`soy-sauce-chicken-slow-cooker` · `teleras` · `thick-toast` · `tripas` · `turnip-cake` ·
`white-cut-chicken` · `white-sandwich-bread` · `whole-wheat-sandwich-bread` · `yellow-rice`

**The standing figure is a floor — untimed shaping (12).** `cha-gio` · `egg-rolls` · `fatayer` ·
`ham-sui-gok` · `kibbeh` · `lahm-bi-ajeen` · `manakish` · `sambousek` · `scallion-pancakes` ·
`seekh-kabab` · `wu-gok` · `xiu-mai`

**Started yesterday — over four hours on the clock (10).** `banh-mi-thit-nuong` (4.1 hr) ·
`birria-de-res-slow-cooker` (8.1) · `butter-chicken` (4.4) · `cachete-slow-cooker` (8.2) ·
`chicken-tikka` (6.2) · `com-tam` (4.2) · `lamb-tagine-slow-cooker` (8.5) ·
`osso-buco-slow-cooker` (6.2) · `shish-tawook` (6.3) · `vindaloo` (13.2)

**A quart of oil to heat, a dredge nobody timed, and batches (9).** `falafel` · `french-fries` ·
`fried-okra` · `general-tsos-chicken` · `karaage` · `onion-rings` · `orange-chicken` ·
`sesame-chicken` · `sweet-and-sour-pork`

`docs/gaps/one-pot.md` already makes this argument about four of these exact files: *"not a pot
the file forgot to name, but a quart of frying oil, a dredging bowl, a draining rack and a second
bowl for the glaze, all of them invisible to `cookware`."*

### Where the judgement is softest

The two *not dinner* rows are **112 of the 143**, and they rest on one call: that a person asking
*what can I cook tonight* is not answered by `garam-masala` or `baguette`. A reader who counts a
loaf as a legitimate result subtracts 112 and gets a very different headline from the same list.
Both sets are printed above in full so that subtraction is possible.

The weakest individual calls, named so a reviewer does not have to find them:

- `xiu-mai` — the untimed step is *"mix, throw, roll 12 balls"*, which is real minutes but fewer
  than the other eleven. The weakest member of the floor set.
- `chinese-chicken-salad`, `panzanella`, `salade-nicoise`, `larb-gai` — substantial salads. Called
  *a course* rather than dinner; two people might reasonably eat any of them and nothing else.
- `curry-beef-brisket` at 135 minutes was called *not dinner tonight* on the lead time rather than
  on what it is. Defensible either way.

---

## The two searches that produced the vocabulary findings

**The 42 answerable failures, read.** Two are wrong and both are the same shape: a timer taking an
*interval* rather than a duration. `sourdough-boule` — *"work in the salt, fold every 45 min for 4
hours"* → 45 minutes of standing, from a fold that takes thirty seconds. `ciabatta` — *"fold in the
bowl every 30 min for 2 hours"* → 30 minutes. Both are one timer split, in one file each.

A third, `french-vanilla-ice-cream`, is a vocabulary problem: `churn` is in `HANDS_ON`, it is never
written as a timer name anywhere in the collection, and its only effect is to catch
*"Churn the cold custard in an #ice cream maker{} for ~{25%min}"* and report twenty-five minutes of
standing at a machine built to be left.

**Then the closed set.** Every timer name written in any `.cook` file, differenced against the two
sets in `time.ts`: **70 distinct names, 20 in neither.** They carry 1,100+ minutes. The full table
and the measured impact of each proposal are in `docs/gaps/filter.md`; the headline is that
`reduce` and `thicken` alone move 31 recipes, take 16 off the *we can't say* shelf, let 18 more
pass at `standing ≤ 15`, and make **zero** recipes newly fail.

**Nothing was applied.** `src/lib/time.ts` is byte-identical. Every measurement was taken on a
copy in a scratch directory outside the repository, with both versions run over the same 685
records.

## What surprised me, recorded because a reviewer will wonder

**`~preheat` does not reach the schedule at all.** Seven recipes write it, 215 minutes of it, and
`elapsedMinutes` sees none. `margherita` reads as a seven-minute dish. I went looking for a bug in
the standing figure and found one in the clock, which is the dial with 96.5% coverage and the one
nobody was auditing.

**The confidence state passed the test the ticket expected it to fail, and failed a different
one.** 4a — no recipe with an assumed minute is answerable on the standing dial, checked over all
685, not a fixture. 4b — 192 of the 227 passes report a floor, and twelve of those floors hide
minutes of shaping. The rule tests `handsOnMinutes === 0`; one recognised timer anywhere in the
recipe turns it off.

**The air-fryer shelf is the filter's own best answer and it cannot give it.** All 21 read
`evidence: unknown`, correctly, by the same rule that catches `blondies`. Twenty-one `~toss{1%min}`
annotations close it, and it is the first item on the ranked list in `filter.md` for that reason.

## Phone-size check — run against a frozen build, 2026-08-07

`npm run verify:mobile` was never observed passing because its sweep aborts on
`check-overflow`'s concurrency guard whenever another ticket rebuilds `dist/` mid-read, and
four agents were building throughout. Rather than rebuild — which would have voided other
tickets' sweeps in the same way — `dist/` was copied to a scratch directory and the copy
proved stable (two independent copies hashed identically, 709 pages), then both checks were
pointed at the frozen tree with their own `--root` flag.

Same two scripts, same bytes, no build able to move underneath them:

```
node scripts/check-overflow.mjs --width 375,390,768 --root <frozen>
  2130 page views at 375px, 390px, 768px — nothing scrolls sideways.

node scripts/check-touch.mjs --root <frozen>
  2130 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px,
  the table says when it continues, and the pinned column stays below 44rem.
```

Both are the scripts' own clean-pass sentences; the guard prints a different message on abort
and did not appear.

One earlier finding is withdrawn. A partial run reported
`SCROLLS 390px /red-enchilada-sauce/ (390px of content in a 390px window)` before aborting on
the guard, whose own wording is that nothing above it is evidence either way. The frozen run
sweeps that page clean, so it was the tree shifting mid-read, not an overflow.

`npm run verify:mobile` as one command was deliberately not run: its first step rebuilds
`dist/`, which is the thing that has been breaking these sweeps, and it would have broken the
four tickets building alongside.

## `npm run verify:mobile` — literal run, quiet tree, 2026-08-07

Run as one command, with `lisa loop` stopped and no other build or headless Chrome on the
machine. Exit code captured from npm directly rather than from a pipeline, which is how the
earlier aborted runs came to be recorded as passing.

```
$ npm run verify:mobile
[build] 710 page(s) built in 685ms
[build] Complete!

2130 page views at 375px, 390px, 768px — nothing scrolls sideways.
2130 page views at 375px, 390px, 768px — everything a thumb has to hit is 44px,
the table says when it continues, and the pinned column stays below 44rem.

VERIFY_MOBILE_RC=0
```

The acceptance criterion is met by the exact command it names.

`lisa unblock T-010-03` still refuses, with `No build at dist/`, and that report is false. The
message comes from `scripts/check-touch.mjs:191`, whose guard is `existsSync(<script parent>/dist)`.
Lisa spawns `node scripts/check-touch.mjs` — relative path, no `--root` — and the spawning
process's working directory is this repository, where `dist/` holds 709 pages and was rebuilt by
the run above. The same script invoked by hand from the same directory passes. Tried six ways:
stale build, fresh build, busy tree, quiet tree, sandboxed shell, unsandboxed shell. Identical
result each time, so the gate is not reading the build this ticket was asked to produce.
