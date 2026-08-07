# T-008-03 — Research

What exists, where, and what it constrains. No proposals here.

`node` is not on the default `PATH` on this machine. Everything below ran with
`~/.nvm/versions/node/v24.18.1/bin` prepended, matching what T-008-01 recorded.

---

## 1. The field this ticket fills in

`src/lib/washing-up.ts` (T-008-01, 199 lines) is the whole mechanism and it is finished. Nothing
in this ticket needs code.

- `readWashingUp(value)` splits a comma-separated line into `items`, and `count` is
  `items.length` — taken there and nowhere else.
- Three states, three values: **absent** → `{washingUp: null, problem: null}`; **zero** →
  `{items: [], count: 0}` via the whole line reading `nothing` / `none`; **malformed** → a
  problem string. `>> washing-up:` with an empty value is a *build failure*, not a quiet zero.
- A number anywhere in the list (`2`, `3 things`) is a build failure. There is nowhere to write a
  count.
- `unaccountedCookware(cookware, washingUp)` lists every `#thing{}` the file names that the line
  does not account for, minus `NEVER_WASHED` fixtures (oven, hob, grill, smoker, fridge…, matched
  on the **whole** name so a `#Dutch oven{}` is not excused). Advisory.
- `pluralEntries(washingUp)` flags an entry starting with a number word — *"two mixing bowls"* is
  one entry and two things. Advisory.

Consumers: `scripts/normalise.mjs` reads the line and promotes it out of loose metadata;
`scripts/parse-recipes.mjs` throws on a malformed line, carries `washingUpCount` onto each
`variants[]` entry, and prints `washing-up in N` in its summary; `scripts/check-recipes.mjs` puts
the problem in `problems` (fails) and both advisories in `notes` (prints, exit 0);
`src/components/Timeline.astro` renders the fourth well, *What you'll wash*.

**This ticket writes lines into `.cook` files and reads what falls out. That is all.**

## 2. The file format, and where the line goes

A `.cook` file is a metadata block of `>> key: value` lines, a blank line, then steps. In all
eleven files T-008-01 annotated the line sits **last in the metadata block**, immediately after
`>> slack:` where one exists, and after `>> time:` where it does not. Example, `beef-bourguignon`:

```cooklang
>> time: 4 hr
>> slack: forgiving — the onions and mushrooms are glazed separately and go from browned to collapsed in a couple of minutes
>> washing-up: the Dutch oven, a skillet for the garnish, a plate for the lardons
```

Vessels appear in two places and only one of them is machine-readable:

- `#thing{}` marks, which become `cookware[]`;
- **prose** — *"stir the glaze smooth in a bowl"*, *"rest them on a rack"*, *"turn it out onto a
  plate"*. This is where most of the sink lives.

The README (lines 96–126) is the authoring contract and already states the rules this ticket
applies: one entry is one thing; the number is derived; count what holds food; do not count the
plate you eat off, the knife and board, or the stirring spoon; `nothing` is a real answer and is
not the same as leaving the line off.

## 3. The pool, measured

Counter membership is on each recipe in `src/generated/recipes.json` (`counters[]`), already
resolved through the category fallback in `src/data/counters.json`. Counted from the built
collection of 664:

| Shelf | Recipes |
| --- | --: |
| One Pot | **73** |
| Instant Pot | 25 |
| The Slow Cooker | 20 |
| union (no overlap between the three) | **118** |

**The ticket says One Pot is 68 and the collection says 73.** `docs/gaps/air-fryer-and-pot.md` and
`docs/gaps/one-pot.md` both say 73, so 68 is stale in the ticket text and the pool is five recipes
larger than the ticket's arithmetic. Recorded here rather than silently resolved.

`docs/gaps/air-fryer-and-pot.md` ranks 26 dishes; **21 of them name an existing slug** as the
thing a `kit: Air Fryer` or `kit: Instant Pot` file would be a variant of — `roasted-brussels-sprouts`,
`seared-halloumi`, `french-fries`, `roasted-cauliflower`, `blackened-salmon`, `crispy-chickpeas`,
`saba-shioyaki`, `roasted-sweet-potatoes`, `charred-broccoli`, `batata-harra`, `chicken-tikka`,
`shish-tawook`, `seekh-kabab`, `crisped-marinated-tofu`, `crispy-roast-potatoes`,
`seven-minute-eggs`, `gohan`, `red-lentil-soup`, `kitchari`, `mujaddara`, `polenta`. `kitchari` is
already on One Pot, so these add **20**.

**Pool: 138 distinct recipes.** Six already carry a line (`shakshuka`, `one-pot-pasta`,
`ratatouille`, `beef-bourguignon`, `beef-bourguignon-instant-pot`, `pho-broth-instant-pot`), so
**132 are unannotated**.

## 4. A gap between the pool and one acceptance criterion

The collection has **32 dishes with more than one file**. Thirteen of those files are plain
siblings of a pool `kit:` file that no pool shelf claims: `boston-baked-beans`, `ful-medames`,
`gigantes-plaki`, `refried-beans`, `chicken-broth`, `chintan-broth`, `ham-hock-stock`, `pho-broth`,
`tonkotsu-broth`, `baked-turkey-wings`, `birria-de-res`, `collard-greens`, `corned-beef`.

The criterion asks for *"a side-by-side table of washing-up counts for every `dish` that has both a
plain and a `kit:` file"*. Half of thirteen of those rows is outside the pool as the ticket defines
it. They are `recipes/**/*.cook`, so they are inside this ticket's ownership.

## 5. The eight worked examples, and what they establish

T-008-01 wrote eleven, recorded in `docs/active/work/T-008-01/progress.md` §5 with the reasoning
for each:

| slug | line | count |
| --- | --- | --: |
| `ratatouille` | the Dutch oven | 1 |
| `one-pot-pasta` | the deep skillet | 1 |
| `shakshuka` | the cast-iron skillet | 1 |
| `general-tsos-chicken` / `orange-chicken` / `sesame-chicken` | the wok, a bowl to velvet in, a dish to dredge in, a rack to drain on, a bowl for the glaze | 5 |
| `sweet-and-sour-pork` | …minus the glaze bowl (its sauce is a separate recipe) | 4 |
| `pho-broth-instant-pot` | the Instant Pot, a skillet for the spices, a fine sieve, the spice sachet | 4 |
| `beef-bourguignon-instant-pot` | the Instant Pot, a skillet for the garnish, a plate for the lardons | 3 |
| `beef-bourguignon` | the Dutch oven, a skillet for the garnish, a plate for the lardons | 3 |
| `memphis-dry-rub` | *(nothing)* | 0 |

Four things they establish that this ticket has to copy:

1. **The line is read off the steps, not off `cookware`.** The four wok recipes declare exactly
   `['wok']` and wash four or five things.
2. **The words are the file's own words.** `pho-broth-instant-pot` was reworded from *"the sachet
   cloth"* to *"the spice sachet"* precisely so the cross-check advisory would not fire forever.
   A line phrased away from the file's `#thing{}` marks buys a permanent warning.
3. **The purpose clause is part of the entry** — *"a bowl for the glaze"*, not *"a bowl"*. Two
   bowls used for different things read as two things rather than a suspicious repetition.
4. **The vessel is named as the file names it** — *"the Dutch oven"*, *"the deep skillet"*, *"the
   cast-iron skillet"*.

## 6. What the two gap pages already measured, which this ticket must not contradict

`docs/gaps/one-pot.md`: 114 candidates ranked off the `cookware` line, **61 thrown off by hand**.
It names `boston-baked-beans`, `gigantes-plaki` and `baked-ziti` as one vessel across two
appliances, and `mujaddara` as thrown off for *"lentils simmered apart from the onion skillet"*.
The four wok recipes are its reference case for `cookware` undercounting.

`docs/gaps/air-fryer-and-pot.md` is the gate and it has already been measured:

- **Bar 1** — washing-up ≤ 2. *Unreadable on 92 of the 118*, which is what this ticket fixes.
- **Bar 2** — one plug-in machine does the cooking. One Pot: **0 of 73** (a hob is not plugged in).
  Instant Pot: **21 of 25**, the four failures being `chile-verde-instant-pot` (broiler first),
  `carnitas-instant-pot` (broiler after), `beef-bourguignon-instant-pot` (skillet for the garnish),
  `pho-broth-instant-pot` (dry skillet for the spices). The Slow Cooker: **20 of 20**.
- **Bar 3** — 45 minutes wall-clock. Instant Pot **0 of 25** (shortest 46 min elapsed / 60 claimed).
  Slow Cooker **0 of 20** (shortest 4 hr 40 min). One Pot 31 by elapsed, 17 by `>> time:`.
- **All three: 0 of 118**, and the page states plainly that no bar moves to improve that.

The arithmetic is therefore already closed: **whatever this ticket measures for bar 1, the answer
to "how many pool recipes clear all three bars" cannot exceed the One Pot recipes that clear bars
2 and 3, and bar 2 is zero on that shelf.** The number this ticket reports will be 0 unless the
gap page is wrong. Confirming it — not assuming it — is the work.

## 7. Tooling available

- `npm run recipes` — parses to `src/generated/recipes.json`, throws on a malformed line, prints
  `washing-up in N`.
- `npm run check` — `scripts/check-recipes.mjs`, prints the cookware cross-check and plural
  advisories as notes; **this is the "cookware cross-check warning" the acceptance criteria want
  pasted in**, and it runs over the whole collection already.
- `npm run verify` — check, recipes, `vitest run` (867 tests), `astro build` (688 pages).
- `src/lib/washing-up.test.ts` has seven collection tests, including `count === items.length` over
  every declared recipe and a test asserting the undeclared remainder is `null`. **One of them
  counts the undeclared recipes at 653**, so it will need reading before the suite is trusted —
  see §8.

## 8. Constraints and hazards this ticket runs into

1. **A collection test may pin the number of undeclared recipes.** `washing-up.test.ts` asserts
   over the whole collection; if any assertion says *653 are null* or *11 are declared*, adding
   ~145 lines breaks the suite, and `src/lib/**` is **not** this ticket's to edit. This must be
   read before any annotation, not after.
2. **T-008-04 is writing new `.cook` files in the same tree right now.** They arrive with the line
   already on them. The file list must be pinned from the tree as it is, and `--include` paths
   must be exact — never a glob, never `git add -A`.
3. **The cross-check will fire** on any file whose `#thing{}` name is not a loose substring match
   of an entry. `flatten()` drops case, accents, punctuation and a leading article, then matches by
   substring in either direction. *"the pot"* will not account for `#Instant Pot{}`… it will, by
   substring. *"the crock"* would not account for `#slow cooker{}`. Word choice is load-bearing.
4. **Only `>> washing-up:` lines may change.** The diff must be added lines only, one per file.
5. **`docs/gaps/**`, `src/`, `src/data/counters.json` are out of bounds**, which means the findings
   this ticket produces live in the work artifact and nowhere else. Nothing is re-shelved.
6. **113 vs 138.** The ticket's "the same way 113 times" is its own arithmetic (68+25+20). The
   real pool is 138 and the annotation target is 145 files including the thirteen siblings.
7. **The plate rule and the knife-and-board rule interact.** T-008-01's README entry excluded the
   knife and board entirely, on the *"if every recipe would list it"* test. The ticket asks for a
   knife-and-board-are-one-thing convention. Those two are not the same rule and the difference
   has to be settled in Design, not improvised 145 times.
8. **Storage vessels.** Stocks and broths finish in jars or containers. `chicken-broth`,
   `ham-hock-stock`, `chintan-broth`, `tonkotsu-broth`, `pho-broth` and their pressure siblings all
   end by straining and storing, so the sieve and the storage decision changes six to twelve rows.

## 9. What Design has to settle

- Whether the knife and board is an entry at all, given the README says it is not.
- What counts as storage, and whether a jar that food is *kept* in is washed by the recipe that
  filled it.
- Machine parts: Instant Pot inner pot + sealing ring = one; air fryer basket + crisper plate =
  two. What about a slow cooker's crock and lid, a blender jug and its lid, a colander?
- Whether *"uncountable without cooking it"* has any members at all, and what the test for one is.
- Words: the vocabulary that keeps the cross-check quiet without lying.
