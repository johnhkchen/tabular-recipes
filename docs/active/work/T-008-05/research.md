# T-008-05 — Research

What exists, where, and how it connects. No proposals here.

The ticket's own framing — *apply the gate, shelve what passes, read the result honestly* — turns
out to rest on four things that have all moved since the ticket was written. This file records the
state as measured on **7 August 2026**, at `7dc86d3` (`Complete T-008-04`), against a rebuilt
`src/generated/recipes.json`.

---

## 1. The counter as it stands

`src/data/counters.json` holds **22 counters**, and the twenty-second is
`The Air Fryer & the Pot` — blurb *"Plug one in, eat, and wash two things."*, `categories: []`,
five sections, **every one of them `items: []`**. The first section carries the only `notes` block
on this counter:

> Everything here washes two things or fewer, cooks in one plug-in machine, and is on the table in
> 45 minutes.

The five titles, in the order T-008-02 wrote them:

1. Straight out of the basket
2. Start to finish in the pot
3. Sheet-pan-shaped, in the basket
4. Vegetables that go crisp
5. Frozen things, done properly

**The ticket says the menus index should read at 23 counters. It reads 22.** Every one of the 22
has at least one recipe, so `menus()` prints 22 cards and `/menu/air-fryer-and-pot` is the
twenty-second. The Soup Pot came down under S-007 (recorded in `docs/gaps/README.md`), which is
where the arithmetic diverges. Nothing here is broken; the ticket's number is stale.

## 2. What T-008-04 actually landed

**21 `.cook` files**, all named `air-fryer-*`, all declaring `>> counters: The Air Fryer & the Pot`
in their own file. Measured off the built collection:

| property | value |
| --- | --- |
| files | 21 |
| `washing-up` declared | 21 of 21 |
| `washing-up` count 1 | 3 (`air-fryer-chicken-thighs`, `air-fryer-halloumi`, `air-fryer-padron-peppers`) |
| `washing-up` count 2 | 18 |
| `>> time:` range | 12 min (`air-fryer-reheated-pizza`) to 45 min (tikka, tawook) |
| `kit: Air Fryer` | 13 |
| standalone (`dish` = own slug) | 8 |
| `cookware` | `air fryer basket` plus at most one of bowl / small bowl / plate |

They span five categories: Fried & Crispy (8), Vegetables & Sides (6), Smoked & Grilled (4),
Dumplings & Rolls (1), Pizzas (1).

**The pot half is empty.** No `kit: Instant Pot` file was written by T-008-04, and T-008-03 measured
0 of 25 existing Instant Pot recipes clearing bar 3 (shortest: `collard-greens-instant-pot`, 46 min
elapsed / 60 claimed).

## 3. The gate, and what has already been measured against it

The three bars live in `docs/gaps/air-fryer-and-pot.md` §*The gate, measured* and are not restated
anywhere in code:

1. `washing-up` ≤ 2, as declared. Authored, never derived.
2. One plug-in machine does the cooking. Air fryer or Instant Pot. Not a hob then a machine.
3. On the table in 45 minutes, wall-clock, pressurising and resting included.

Two prior measurements exist and agree:

- **`docs/gaps/air-fryer-and-pot.md`** (T-008-02, pool of 118, bar 1 unreadable on 92): **0 clear**.
- **`.lisa/attempts/T-008-03/1/work/findings.md` §5** (pool of 151, bar 1 readable on all):
  bar 1 **96 pass / 55 fail / 0 unreadable**; bar 2 **41 / 110**; bar 3 **27 / 124**;
  **all three: 0**. 33 recipes clear bars 1 and 3 and every one dies on bar 2, because a hob is
  not plugged in.

Neither pool included T-008-04's 21 files, which did not exist yet.

**Bar 2 is the one no script decides alone.** T-008-03 §3 produced the authored list, read off step
prose rather than `cookware`, of Instant Pot recipes that brown outside the pot — and it is exactly
the four the gap page already named: `chile-verde-instant-pot` (broiler before), `carnitas-instant-pot`
(broiler after), `beef-bourguignon-instant-pot` (skillet for the garnish), `pho-broth-instant-pot`
(dry skillet for the spices). `birria-de-res-instant-pot` uses a jug blender and still clears bar 2
— a blender is plugged in and cooks nothing.

## 4. The machinery that shelves a recipe

Three pieces, in the order they run.

**`scripts/menu-sections.mjs`** reads the `## What it has` block of each `docs/gaps/<slug>.md`,
splits it at each `**bold lead-in.**`, takes every middot-separated slug-shaped token that is also a
real slug, and folds the result into `src/data/counters.json`. Facts that bear on this ticket:

- It only emits a section that found **at least one** slug (`if (found.length) sections.push(...)`).
  A titled-but-empty section in the gap page produces no section at all — which is why the counter
  currently reports `0 sections, 0/0 placed` and why an empty pot section cannot round-trip.
- `--write` **rewrites every counter, not the one being edited**, and drops the hand-written `notes`
  blocks — eleven of them elsewhere, one of them this counter's. The gap page says so in place.
- Anything a counter shelves but the page does not list is reported as `unplaced ->` and, on
  `--write`, swept into a section literally titled **`Also`**.
- Today it reports **2 counters needing a look**: One Pot (5 unplaced soups, the S-007 drift) and
  The Air Fryer & the Pot (21 unplaced).

**`src/lib/counters.ts` `menuFor()`** is the render-time half and it is stricter than the script:

- A section's slugs are intersected with the recipes whose own `>> counters:` line names this
  counter. A slug that does not **throws with the slug named** (T-011-05, `675f22b` — *"Fail the
  build by name instead of dropping the slug"*).
  **So this shelf cannot borrow.** The ticket's sentence *"A section may list a recipe that never
  names the counter — that is how a shelf borrows, and this shelf borrows its entire pressure-cooker
  half"* describes behaviour that was removed two tickets ago, and the pressure-cooker half is empty
  anyway.
- Empty sections are dropped (`.filter((section) => section.items.length > 0)`).
- Anything the sections forgot is appended as a section titled **`Also`** — this is the "Also here"
  the acceptance criteria forbid, and it appears if and only if a shelved recipe is unlisted.

**`src/pages/menu/[counter].astro`** builds a page per counter with `menu.count > 0`, prints
sections in order, and matches `notes` **by title, not position**, precisely because `menuFor` can
append `Also`.

## 5. `washing-up`, as built

`src/lib/washing-up.ts` — authored, never derived; the count is the list's length and is taken in
that file and nowhere else. `absent` (`null`), `nothing` (`{items: [], count: 0}`) and *malformed*
are three different answers. `unaccountedCookware()` and `pluralEntries()` are advisory only.

Collection state after `npm run recipes`: **685 recipes, washing-up in 177**. T-008-01 wrote 11,
T-008-03 wrote 145, T-008-04's 21 files carry their own.

The annotation convention that produced those 145 lines is
`.lisa/attempts/T-008-03/1/work/findings.md` §1, fifteen rules. Two matter downstream:

- **Rule 6** — the knife and chopping board are not counted at all. The README won over the ticket.
  This makes S-008's own illustration of two-or-fewer (*"The pot and a chopping board"*) score **1**,
  not 2. Flagged by T-008-01 §4.2 and again by T-008-03 §7; nobody has ruled on it.
- **Rule 7** — utensils are not counted; an immersion blender is a utensil, a jug blender's jug is a
  vessel. This is the source of the seven permanent `unaccountedCookware` advisories.

## 6. `docs/gaps/one-pot.md` as it stands

192 lines. **68 recipes** in the headline; the shelf is now **73**. Its *What it has* block lists 68
slugs in four sections, and `menu-sections.mjs` reports 5 unplaced — the S-007 soups
(`century-egg-amaranth-soup`, `crucian-carp-tofu-soup`, `mustard-greens-tofu-soup`,
`seaweed-egg-drop-soup`, `tomato-potato-beef-soup`).

The passage this ticket has to rewrite is under *What it could not stock*, line 105:

> …it means the *promise* of the counter is a claim about the washing-up, and **washing-up is not a
> row in a table**.

Two further passages bear on it: the *sixty-one that came off* groups (a hand experiment with a
measured counterpart now), and *Left open* — the broiler argument and the four inert fried slugs
still listed in `counters.json` under *Skillet dinners*.

T-008-03's measured answer for this page: **8 of 73 wash three or more** (`chile-verde` 4,
`country-fried-steak` 4, `beef-bourguignon`, `soy-sauce-chicken`, `tinga-de-pollo`,
`tortilla-espanola`, `white-cut-chicken`, `wonton-soup` at 3). Distribution 1→40, 2→25, 3→6, 4→2,
mean 1.59.

## 7. `docs/gaps/instant-pot.md` as it stands

224 lines, five `##` sections. It has **no list of what browns outside the pot** — its *What the
clock now reads* section counts 42 pressure-and-release tasks and its *What it could not stock*
section talks about the pot generally. T-008-01's open concern (it could not find a recipe that
browns in a separate pan first) is now answered by T-008-03 §3.

## 8. `docs/gaps/README.md` as it stands

367 lines. Two things this ticket is named against:

- **The tally** — a table of **21 counters** headed *"All twenty-one counters, for the first
  time"*, totals 904 assignments. It predates the Air Fryer counter and predates S-008/S-011's
  annotation, and the file already says so in the *three dials* section (measured at 685 recipes).
  Cha Chaan Teng reads 22 there and is 27 now.
- **The `Build state` block** — 664 files, 11 washing-up. Explicitly labelled S-007's and stale.

There is no record anywhere in this file of the plain-versus-kit washing-up comparison.

## 9. Aisles and the shopping test

`src/data/aisles.json`: 14 aisles, 910 patterns. `Freezer` is the smallest at **6**
(`frozen peas`, `frozen corn`, `frozen spinach`, `frozen berries`, `ice cream`, `ice`).

`src/lib/shopping.ts` `aisleFor()` picks the **most specific pattern across all aisles**:
`specificity = words × 1000 + length`, compared globally, not within an aisle. So a bare `frozen`
in `Freezer` (1 word, 6 chars) would lose to any two-word pattern but beat every one-word pattern
shorter than 6 characters — and a bare `chips` would beat nothing longer but would claim
`fish and chips`-shaped names elsewhere if any existed.

`src/lib/shopping.test.ts` `the whole collection > finds an aisle for nearly everything` fails
above 2% unplaced. **It passes today at 5/1086 = 0.46%.** The five, verbatim:

```
frozen chips (1), leftover pizza (1), flat skewers (1), oak or hickory wood (1), metal skewers (1)
```

Of those: `frozen chips` is T-008-04's (`air-fryer-frozen-chips`); `leftover pizza` is T-008-04's
(`air-fryer-reheated-pizza`); `flat skewers`, `metal skewers` and `oak or hickory wood` predate this
story and are equipment, not food.

The other frozen goods T-008-04 introduced (`frozen spring rolls`, `frozen prawns`) already resolve
somewhere — where, and whether it is right, is a measurement this ticket has to take rather than
assume, because `aisleFor` never returns *nothing*, only `other`.

`purchaseOf` returns null rather than compare grams to cups; `packs` in `aisles.json` is a separate
block from `aisles`.

## 10. Verification surface

`npm run verify` = `check-recipes` → `parse-recipes` → `vitest run` → `astro build` →
`check-menus`. Current baseline, run at the head of this ticket:

- `parse-recipes`: **685 recipes, 27 categories, 0 inferred from category, timers in 661, pairings
  770, washing-up in 177**.
- `menu-sections.mjs` (dry): **2 counters need a look** — One Pot (5 unplaced), Air Fryer (21
  unplaced).
- `shopping.test.ts`: 14 tests green.

## 11. Constraints this ticket inherits

- **No `.cook` file may be edited.** A recipe that needs a fix is a finding.
- **No bar moves.** A bar that looks wrong is a recommendation for a later story.
- Owned paths only: `src/data/counters.json`, `src/data/aisles.json`,
  `docs/gaps/air-fryer-and-pot.md`, `docs/gaps/one-pot.md`, `docs/gaps/instant-pot.md`,
  `docs/gaps/README.md`, `docs/active/work/T-008-05/**`.
- Two items are recorded by T-008-04 as needing `src/lib/**` and are **out of scope here**:
  `'airfry'` missing from `UNATTENDED` in `src/lib/time.ts` (21 files read correctly only because
  every basket cell happens to open with `roast`), and `shake` missing from `VERB_ICONS`.
- T-008-04 §5 leaves one call open for this ticket: **the drawer**. The gap page counts the basket
  as one thing everywhere except seekh kabab, where the rendered fat makes the drawer a second
  thing — but wings, thighs and prawns render fat too. One sentence settles it and it changes
  exactly one dish's fate.
