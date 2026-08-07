# T-008-02 — Research

What is here, where, and how it connects. No proposals; the decisions are in `design.md`.

Everything numeric below was measured against the tree as it stands — `src/generated/recipes.json`
(664 recipes, written by `npm run recipes`) read through `src/lib/schedule.ts` — not estimated and
not remembered. The measuring script is `scratch/measure.mjs` reproduced in `plan.md` §7.

---

## 1. The file this ticket owns first: `src/data/counters.json`

**21 counters, in menu order, one JSON object each.** Keys, in the order every entry uses them:
`name`, `slug`, `blurb`, `categories`, `sections`. A section is `{ title, items }` and may carry
an optional hand-written `notes` array. Cha Chaan Teng is last and was added by T-007-01 inside
S-007; The Soup Pot's entry was removed by T-007-02, which is the only counter ever taken out.

**T-007-05 is what this ticket waited on, and what it did to the file matters in two ways.**

1. It filled Cha Chaan Teng's five sections with the 22 recipes T-007-03 and T-007-04 wrote, so
   the board is now 21 counters with something on all 21. `docs/gaps/README.md` says so twice.
2. It left the file at exactly the shape above. Nothing about the schema moved.

**`categories` is a fallback and three counters already decline it.** Taquería, Dim Sum Counter,
Takeout Counter, Phở & Bánh Mì, Ramen Shop, Thai Kitchen, Smokehouse, The Bowl Shop, Instant Pot,
One Pot, Japanese Home Cooking, The Slow Cooker and Cha Chaan Teng all carry `"categories": []`.
Thirteen of twenty-one. An empty array, never an absent key.

**The house style for a shelf that is not a shop.** The shop counters instruct a person standing
at a window — *"Take a tray and tongs, fill it, pay at the register"*, *"Order by number, eat it
out of the carton"*, *"Pick a filling, then pick what it goes in"*. The three appliance counters
do not, because there is no register:

| Counter | Blurb |
| --- | --- |
| Instant Pot | Lock the lid and walk away; it gets there on its own. |
| One Pot | Everything goes in one pan, and that is the only pan to wash. |
| The Slow Cooker | Fill it before you leave; dinner is waiting when you get back. |

Each is *what you put in and what you get back*, in one sentence, no imperative aimed at a
customer. That is the register this counter's blurb has to sit in.

**An empty counter builds and does not render.** `src/pages/menu/[counter].astro:12` filters
`menuFor(counter, all)` on `menu.count > 0`, so a counter with no recipes naming it generates no
page. `src/pages/index.astro` prints its cards off `menus` in `src/lib/counters.ts`, filtered the
same way. Cha Chaan Teng sat empty between T-007-01 and T-007-05 and the build was green
throughout — that is the precedent for opening a counter before it has anything on it.

## 2. `docs/knowledge/counters.md`

1,079 lines. A preamble, a **Contents** table, then one `## Counter Name` entry per counter
separated by `---`, then `## Sources` and `## What could not be verified`.

**The Contents table has three columns** — `Counter` (a link to the anchor), `What it is` (one
clause), `Combined or separate` (a clause with the reason attached, e.g. *"Separate: the shelf is
the menu; nothing is described or numbered"*). It currently prints **sixteen rows against
twenty-one counters**: Bakery, Panadería, Taquería, Dim Sum Counter, Takeout Counter, Phở & Bánh
Mì, Ramen Shop, Curry House, Thai Kitchen, Shawarma Counter, Pizzeria, Deli, Diner, Smokehouse,
Meat and Three, Cha Chaan Teng. **The Bowl Shop, Instant Pot, One Pot, Japanese Home Cooking and
The Slow Cooker have neither a row nor an entry.** The five appliance-and-format counters were
never written into this file. That is a pre-existing gap this ticket inherits and does not own.

**An entry's shape**, from the sixteen that exist: a `**What it is.**` paragraph; a
`**Combined, and contested**` / `**Separate.**` paragraph naming what it was weighed against; a
three-column vocabulary table (`On the menu` / `Also called` / `Plainly`) which the file says is
the source for `>> aka:` lines; sometimes a trailing prose paragraph folding in a neighbouring
format's vocabulary.

The vocabulary table exists to bridge a menu word to a recipe. An air fryer counter has no menu
words — nobody orders "the air fryer one" at a window — which is a real shape mismatch and is
argued in `design.md` §3.

## 3. The gate, measured against the built collection

The three bars, from S-008 and restated in the ticket: `washing-up` ≤ 2; **one** plug-in machine
(air fryer or Instant Pot) does the cooking; on the table in **45 minutes** wall-clock.

### Bar 3 is the one the ticket said to check hardest. It is worse than the ticket feared.

**Not one of the 25 Instant Pot recipes clears 45 minutes, on either reading of the clock.**

| | shortest | second | third |
| --- | --- | --- | --- |
| `>> time:`, the author's own claim | `collard-greens-instant-pot` **60 min** | `congee-instant-pot` 75 | `ham-hock-stock-instant-pot` 90 |
| elapsed, `buildSchedule().totalMinutes` | `collard-greens-instant-pot` **46 min** | `congee-instant-pot` 50 | `ful-medames-instant-pot` 65 |

The ticket's worry was that `>> time:` would understate the clock — that a 25-minute pressure cook
hides ten minutes coming up and fifteen of release. **On these 25 files it is the other way
round.** `>> time:` is greater than or equal to the derived critical path on **all 25**, median gap
20 min. The writers of T-002-02 and T-002-03 timed `~come to pressure`, `~pressure cook`,
`~natural release` and `~quick release` explicitly — `docs/gaps/instant-pot.md` counts 42 such
tasks across the 25 — and `>> time:` was written over the top of them. The pressurising is in the
number already.

**The derived elapsed figure is a floor, not the clock.** `schedule.ts` gives an untimed operation
0 minutes and `timed: false` on purpose. `collard-greens-instant-pot`'s 46 minutes has **two**
untimed operations in it; `congee-instant-pot`'s 50 has two. So the true wall clock for the two
shortest files is above 46 and above 50 by an unknown amount, and both readings put them past 45
regardless. The two readings agree, which is the useful part: **0 of 25, measured twice.**

### Bar 2 — one plug-in machine does the cooking

Read off the steps, not off `cookware`, because `docs/gaps/one-pot.md` established that the
`cookware` line counts what a recipe *names*. **Four of the 25 fail**, each for a second appliance
the file states plainly:

- `beef-bourguignon-instant-pot` — *"in a skillet for 10 min — a separate pan, because the pot is
  full"*.
- `carnitas-instant-pot` — *"the pot does the tender and the broiler does the crust"*.
- `chile-verde-instant-pot` — *"the char stays under the broiler"*, and it comes **before** the pot.
- `pho-broth-instant-pot` — *"toast … in a dry skillet 3 min"*.

**21 of 25 clear bar 2.** `birria-de-res-instant-pot` uses a jug blender, which is a plug-in
machine that does no cooking — it clears bar 2 and its sieve and jug are a bar 1 problem instead.

### Bar 1 — `washing-up` of two or fewer

**Only 11 files in the whole 664 declare `washing-up`**, and only **two** of them are Instant Pot
variants: `pho-broth-instant-pot` (4 — *the Instant Pot, a skillet for the spices, a fine sieve,
the spice sachet*) and `beef-bourguignon-instant-pot` (3 — *the Instant Pot, a skillet for the
garnish, a plate for the lardons*). Both fail. **The other 23 have not declared one**, so bar 1 is
unmeasurable on them today. That is precisely T-008-03's job and this ticket must not guess it.

### All three bars together

**0 of 25.** Bar 3 alone is sufficient; nothing survives it.

### The wider candidate pool

| Shelf | Recipes | Clear bar 1 | Clear bar 2 | Clear bar 3 | Clear all three |
| --- | --: | --- | --: | --: | --: |
| Instant Pot | 25 | 0 declared, 2 fail, 23 unmeasured | 21 | 0 | **0** |
| One Pot | 73 | 4 declared (all ≤ 2), 69 unmeasured | **0** | 31 by elapsed, 17 by `>> time:` | **0** |
| The Slow Cooker | 20 | 0 declared | 20 | 0 (shortest 4 hr 40 min) | **0** |

The three shelves do not overlap at all — the Instant Pot ∩ One Pot and Slow Cooker ∩ One Pot
intersections are both empty — so the union is **118 recipes and the gate admits none of them.**

**One Pot dies on bar 2, not bar 3.** Its 73 are hob and oven dishes; not one names a plug-in
machine that cooks. Its 31 fastest are exactly where the shelf is strong — `western-omelette` at 3
minutes elapsed, `egg-foo-young` at 3, `seaweed-egg-drop-soup` at 6, `jalfrezi` at 7 — and every
one of them fails a bar that has nothing to do with speed. Meanwhile its slow end is what S-008
already suspected: `vindaloo` 14 hr, `pot-roast` 4 hr 30 min, `carnitas` 4 hr.

The four One Pot files that declare `washing-up` are `one-pot-pasta` (1), `shakshuka` (1),
`ratatouille` (1) and `beef-bourguignon` (3).

**No recipe anywhere on the site names an air fryer.** `cookware` across all 664 yields
`food processor` 11, `blender` 13, `Instant Pot` 24, `slow cooker` 20, `immersion blender` 6,
`waffle iron` 1, `small food processor` 1, `small blender` 1. No air fryer, no rice cooker, no
toaster oven, no deep fryer.

## 4. The air fryer's absence

`grep` over the whole tree finds exactly one trace: `src/lib/icons.ts:319`, `'air fry': 'oven'`.
An icon mapping written for a verb nothing uses. No `.cook` file, no `kit: Air Fryer`, no gap page,
no line in `counters.md`, no tag.

**Existing files that a basket version would be a `kit:` sibling of**, confirmed present:
`karaage`, `falafel`, `french-fries`, `onion-rings`, `hush-puppies`, `fried-chicken`,
`crispy-chickpeas`, `crisped-marinated-tofu`, `seared-halloumi`, `crispy-roast-potatoes`,
`roasted-cauliflower`, `charred-broccoli`, `roasted-brussels-sprouts`, `roasted-sweet-potatoes`,
`batata-harra`, `samosa`, `onion-bhaji`, `crab-rangoon`, `egg-rolls`, `blackened-salmon`,
`chicken-tikka`, `shish-tawook`, `kafta`, `seekh-kabab`, `chicken-shawarma`, `meatballs`,
`siu-yuk`, `potato-knish`, `garlic-knots`.

**Absent entirely** — so a basket version would carry no `kit` line: chicken wings (no `wings`,
no `buffalo-wings`), tonkatsu/katsu, korokke, halloumi on its own, bacon, latkes, arancini,
mozzarella sticks, jalapeño poppers, corn dogs, scotch eggs, churros, doughnuts, fish and chips.

**The rule that decides which.** `scripts/normalise.mjs:230` — `dish` defaults to the slug and
`kit` defaults to null. `scripts/parse-recipes.mjs:198` throws when a `dish` group has more than
one file with no `kit:` line. So an air fryer version of `karaage` is a second file with
`>> dish: karaage` and `>> kit: Air Fryer`; an air fryer dish with no plain counterpart carries
neither line and its `dish` is its own slug. 45 files declare a `kit` today — 25 `Instant Pot`,
20 `Slow Cooker` — across 32 multi-file dish groups.

## 5. `docs/gaps/` — the shape of a work list

24 files. The relevant conventions, from `docs/gaps/README.md` and from reading `instant-pot.md`
(224 lines), `one-pot.md` (192) and `soup-pot.md` (254):

- `# Counter — what is missing`, then a headline paragraph with the count in bold.
- `## What it has` — **machine-read.** `scripts/menu-sections.mjs` parses
  `**Section title.** slug · slug · slug`, cuts a title at ` — `, strips a trailing period, and
  drops parenthetical asides. Twenty of twenty-one round-trip; One Pot does not.
- `## What it is missing` — a ranked list, each entry naming a slug and a reason, sometimes split
  into sub-headed bands (`### The twelve that pay for the appliance`).
- `## Components it would need` — bulleted, each one naming what waits on it.
- `## What it could not stock` (Instant Pot, One Pot) or `## What a table could not hold`
  (soup-pot) — the limits of the format.
- `## Where this came from` — soup-pot only. Bullets of the shape *what it established* — *[linked
  source](url)*, several sources per claim, and it names where two sources disagree.

**`menu-sections.mjs` against a counter whose sections are all empty.** `parseSections` only pushes
a section when it found at least one slug, so five empty titles yield zero sections; `mine` is
empty, so `missing` and `extra` are empty and `problems` does not increment. The dry run will print
`ok The Air Fryer & the Pot: 0 sections, 0/0 placed`. **`--write` would then overwrite the
hand-written titles with `[]`** — which is a reason not to run it, on top of the two the README
already gives (it rewrites every counter, and it drops eleven sections' `notes`).

## 6. The washing-up property, as T-008-01 built it

`src/lib/washing-up.ts`. Authored, never derived. `readWashingUp` splits on commas; the count is
the list's length and is taken there and nowhere else; a bare number is refused; `nothing`/`none`
is the whole line or none of it; absent (`null`) and zero (`{items: [], count: 0}`) are different
answers. `unaccountedCookware` and `pluralEntries` are advisory warnings in
`scripts/check-recipes.mjs:172,183`. `parse-recipes.mjs:216` carries `washingUpCount` onto each
variant, so a kit sibling's count shows on the plain file's page — which is the mechanism that will
make an air fryer variant's *two things* legible beside the deep-fried original's five.

## 7. Sources found for basket times

Read for the gap page's citation section. The disagreements are the point.

- **America's Test Kitchen, air-fryer chicken wings** — 400°F, **18–24 min**, 2½ lb, and the
  instruction is *"arrange wings in even layer … (wings will overlap)"*, developed on a large
  machine, range written to cover cold or preheated.
- **Recipe blogs on the same dish** — 390°F for 10 then 8–10 more; 380°F for 20–24; 400°F for
  18–24 — and every one of them says single layer, **no overlap**, contradicting ATK directly.
- **ATK, air-fryer roasted salmon** — 400°F, **10–14 min**, two 8-oz fillets at 1½ in, pulled at
  **125°F** medium-rare (120°F wild).
- **Everyone else on salmon** — 6 min; 7–9 min at 200°C; 10–12 min at 400°F for a 1-in fillet; and
  doneness targets of **145°F** (the food-safety number) and **130–135°F**. Three sources, three
  different finish temperatures for the same fish.
- **ATK equipment review** — cooking surface matters more than height; winners exceed 10 × 10 in;
  the winner takes four cutlets or two 15-oz bags of fries in one layer, small models take two
  cutlets or one bag; *"external dimensions and stated capacities … are not reliable indications of
  how much food they can cook at once"*; stacked racks cook unevenly because the upper blocks the
  lower.
- **ATK, 5 tips** — pat dry; add fat; do not overfill, because *"overfilling the basket leads to
  poor browning and unevenly cooked food"*; flip once halfway; cut to even size.
- **ATK, the case for buying one** — *"a mini convection oven"*, and *"if the food was packed too
  tightly it steamed instead of browned"*.
- **Wattage** — the same frozen chips quoted at 18 min in a 1400 W machine, 12 in a 1700 W and 9 in
  a 2000 W; and two 1700 W machines differing anyway on fan design and basket geometry.
- **Wet batter** — the fan blows it off before it sets, it drips onto the element; egg-and-crumb
  holds where a pourable batter does not.
- **The conversion rule in circulation** — *drop the oven temperature 25°F and cut the time 20%*.
  This is the rule that manufactures a number, and it is worth naming as such.

## 8. Constraints this ticket is bound by

- **Only three files may change**: `src/data/counters.json`, `docs/knowledge/counters.md`,
  `docs/gaps/air-fryer-and-pot.md`. No `.cook` file, no script, no test.
- **The demonstration `.cook` file must not be committed.** Written, checked, deleted, and the
  transcript pasted into the work artifact.
- **`node scripts/check-recipes.mjs` must report ok for the whole collection, unchanged.**
- **No `categories` fallback**, and the reason is in the ticket: a fallback drags in recipes never
  measured against the gate.
- **Do not adjust the bars to improve the count.** The acceptance criteria name 10 as the threshold
  below which the page must say so plainly. The measured number is 0.
