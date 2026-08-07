# T-008-05 — Design

Seven decisions. Each names the options, the evidence from `research.md`, and what was rejected.

The measurement is already taken — `gate.mjs` and `gate-output.md` in this directory — because
three of the seven decisions could not be made without it. **21 recipes clear all three bars, and
every one of them is an air fryer file.** That number is the design constraint, not an outcome of
it.

---

## 1. How the gate is applied

**Chosen: a standalone `gate.mjs` in the work artifact, reading the built collection through
`buildSchedule()`, with bar 2 decided in two halves.**

Options considered:

| option | why not |
| --- | --- |
| read down the list and decide | the failure S-008 exists to end. *"A rule applied by hand is a judgement with extra steps."* |
| add `scripts/gate.mjs` to the repo | `scripts/` is not this ticket's to edit, and the ticket says the script does not have to ship |
| a vitest test asserting the shelf | pins the answer instead of measuring it, and a test that fails when a recipe is written is a tripwire — T-008-03 §5.4 is the precedent |

The script runs over **all 685 recipes**, not the 151-recipe pool, because the pool was defined
before the air fryer files existed and a gate that is only ever pointed at three shelves cannot
find the twenty-second. Running it over everything costs nothing and is the only way the *no bar
was the sole cause* claim below can be made.

**Bar 3 is read on both clocks and passes only on both.** `>> time:` is a person's claim about the
whole dish; `buildSchedule().totalMinutes` is a floor, because an untimed operation gets zero
minutes and `untimedCount` says how many. The gap page already refuses to call either one the
truth. Requiring both keeps the shelf honest in the direction that matters: a recipe whose author
says 50 minutes does not get admitted because its tree adds up to 40.

## 2. Bar 2, and where the script is overruled

**Chosen: a lexicon over the file's own cooking steps, overridden by T-008-03 §3 on the Instant
Pot shelf, with every disagreement printed.**

The lexicon reads the `>> step:` labels and their bodies and nothing else. Two kinds of line are
dropped, and dropping them is the whole design:

- **every other `>> key: value` line.** `>> category: Fried & Crispy` is not a frying pan.
  `>> keeps: the basket brings the skin round better than an oven or a microwave will` is not an
  oven. Left in, they failed **eighteen of the twenty-one air fryer files** on their own metadata.
- **any step carrying no `@ingredient`, no `#cookware` and no `~timer`** — this collection's
  full-width note rows. They are argument about the dish, and they are exactly where the
  comparisons to ovens, grills and microwaves live.

**Where the lexicon is not trusted at all: the Instant Pot shelf.** The machine's selling point is
that it browns on its own Sauté, and no word list separates *"sauté the onions"* in an Instant Pot
from *"sauté the onions"* in a skillet. T-008-03 read all 25 files' step prose and found exactly
four that cook outside the pot. The script takes that verdict wholesale for that shelf.

**Nine verdicts moved**, all in the same direction, all on the Instant Pot shelf:
`cuban-black-beans`, `gigantes-plaki`, `refried-beans`, `borscht`, `chicken-broth`,
`chintan-broth`, `tonkotsu-broth`, `braised-short-ribs`, `pot-roast` — each `-instant-pot`, each
read `instant pot plus hob` by the lexicon and `the pot, browning on its own Sauté` by T-008-03.
The result, 21 of 25 clearing bar 2, reproduces the published figure exactly.

One further override, kept from the gap page and named in the script:
`birria-de-res-instant-pot` uses a jug blender and still clears — a blender is plugged in and
cooks nothing; its jug is a bar 1 cost, and it washes 4.

**Rejected: overriding The Slow Cooker the same way.** T-008-03 counted 15 of 20 browning in a
skillet but published no slug list, so there is nothing to take. The lexicon reads **1 of 20**
clearing bar 2, and the one is `irish-stew-slow-cooker`. That contradicts
`docs/gaps/air-fryer-and-pot.md`'s *"The Slow Cooker clears bar 2 outright"* (20 of 20), which was
written before any of those files declared what they washed. It changes no outcome — every slow
cooker recipe loses bar 3 by hours — so it is **reported as a correction to a sentence, not acted
on**.

## 3. The sections, and which titles survive

**Chosen: four sections. Two of T-008-02's five titles are dropped and one is added.**

The ticket permits either branch — *"fix the placement, or the titles"* — and the placement cannot
be fixed, because two of the five titles have nothing that could go under them:

| title | items | decision |
| --- | --: | --- |
| Straight out of the basket | 8 | keep |
| **Start to finish in the pot** | **0** | **drop** — no Instant Pot recipe clears bar 3, and T-008-04 wrote none |
| **Sheet-pan-shaped, in the basket** | **0** | **drop** — T-008-04 wrote nothing for it; what it described is the vegetables |
| Vegetables that go crisp | 9 | keep |
| Frozen things, done properly | 3 | keep |
| **Reheats that beat the microwave** | **1** | **add** — `air-fryer-reheated-pizza` has no other home |

`scripts/menu-sections.mjs` forces this: it only emits a section that found at least one slug, so a
titled-but-empty section **cannot round-trip** and would break the reproduce-from-the-gap-page
criterion. Keeping the pot title would have meant hand-writing a section into `counters.json` that
the script deletes on sight.

**Dropping a title is not dropping the finding.** The empty pot half is the loudest thing this
ticket measured, and it moves into the gap page's prose, where a reader gets the reason rather than
an empty heading.

**A one-item section is normal on this board** and was checked rather than assumed: Smokehouse has
*Dessert* (1), Instant Pot has *Rice, grains and porridge* (1) and *Whole birds and big cuts* (1),
The Slow Cooker has two. Padding *Reheats that beat the microwave* to look fuller would be the
exact move this shelf exists to refuse.

**Rejected: an *Also here* section.** `menuFor()` appends one automatically for anything shelved
and unlisted, so the acceptance criterion is met by listing all 21 — not by suppressing anything.
The check is that `menu-sections.mjs` reports `21/21 placed`.

## 4. The borrow that cannot happen

**Chosen: list nothing this counter does not shelve, and record why the ticket's instruction is
stale.**

The ticket says *"A section may list a recipe that never names the counter — that is how a shelf
borrows, and this shelf borrows its entire pressure-cooker half."* Two things have changed since:

- **`menuFor()` throws** on a slug whose file does not name the counter (T-011-05, `675f22b` —
  *"Fail the build by name instead of dropping the slug"*). Borrowing by section list is no longer
  possible anywhere on the site; it now needs the recipe's own `>> counters:` line.
- **There is nothing to borrow.** 0 of 25 Instant Pot recipes clear bar 3, so the pressure-cooker
  half is empty whatever the mechanism.

A `.cook` file may not be edited here, so adding `The Air Fryer & the Pot` to an Instant Pot file's
counters line is out of scope even if a recipe qualified. None does.

## 5. What to do about 21 being under 25

**Chosen: state 21, name bar 2 as the excluder, and change no bar.**

S-008's criterion: *"If fewer than about twenty-five recipes clear it once the pool is annotated,
the finding is the gate is wrong or the shelf is thin, and T-008-05 reports it."* It is 21. The
report has three parts and each is a measurement:

1. **Bar 2 excludes the most, by an enormous margin.** 642 of 685 fail it; **22 fail it and
   nothing else**. Bar 3 alone excludes 13, bar 1 alone excludes **none — zero recipes in the whole
   collection are excluded by washing-up alone.**
2. **The shelf is thin because the cupboard is, not because a bar is.** Every one of the 21 is an
   air fryer file written by T-008-04. The gate admits an appliance the collection owned nothing
   for until three days ago, and the way to 25 is four more baskets, not a looser bar.
3. **Bar 1 is the bar that turned out to measure the wrong thing, and it is written up rather than
   moved.** It has never been the sole cause of a single exclusion, and rule 6 of T-008-03's
   convention (the chopping board is not counted) makes S-008's own illustration of two-or-fewer —
   *"The pot and a chopping board"* — score 1. A bar that excludes nobody and reads looser than the
   sentence that defined it is a recommendation for a later story. **Changing it here is how a gate
   becomes decoration**, and the ticket says so.

**Rejected: shelving the near-misses.** `seven-minute-eggs`, `shakshuka`, `one-pot-pasta` and
nineteen others fail bar 2 alone and would look right on this shelf. A hob is not plugged in. The
counter's page states its rule.

**Rejected: leaving a recipe off that passed.** The ticket permits it with a written reason; there
is no candidate. All 21 read correctly under their section titles.

## 6. The aisles

**Chosen: three patterns added to `Freezer`, and one ingredient deliberately left in `other`.**

Measured before anything was changed, over all 1086 ingredient names:

| ingredient | resolves to | verdict |
| --- | --- | --- |
| `frozen chips` | **`other`** | a real gap — nothing claims it |
| `frozen spring rolls` | **`bakery`** | wrong — the Bakery's `rolls` pattern claims it |
| `frozen raw prawns` | `fishmonger` | defensible, and wrong for the shopper — you take it out of a freezer |
| `leftover pizza` | `other` | **correct** — no shop sells it |

`aisleFor` picks the most specific pattern **across** aisles (`words × 1000 + length`), and
`matchesStaple` needs consecutive whole words. So `frozen prawns` would not claim
`frozen raw prawns`, and each pattern has to be written at the length the ingredient is written.

Added: `frozen chips` (2 words), `frozen spring rolls` (3 words, beating Bakery's `rolls` at 1),
`frozen raw prawns` (3 words, beating Fishmonger's `prawns` at 1).

**Rejected: a bare `frozen` or a bare `chips` in `Freezer`.** The ticket names this as the hazard
and the mechanism confirms it: a one-word pattern is compared against every other aisle's
one-word patterns on length alone, so `frozen` (6 chars) would beat `peas`, `corn`, `ice` and
every other short pattern on the board and drag a shelf of things into the freezer.

**Rejected: patterns for `frozen dumplings` and `frozen pastry`.** The gap page predicted them;
T-008-04 wrote neither. The ticket asks for patterns *"for the real ones"*, and a pattern for an
ingredient that does not exist cannot be shown not to steal.

**Rejected: inventing a `packs` entry** so a pack badge appears on frozen chips. `purchaseOf`
returns null rather than compare grams to cups, and the ticket names this explicitly.

**The proof is a diff, not an assertion.** `aisle-diff.probe.mts` writes the resolved aisle of all
1086 ingredients; it is run before and after and the diff must contain exactly the three lines
above. It is named `.probe.mts` and driven by its own vitest config so that `npm run verify` cannot
see it — a throwaway that changes the suite's test count is a tripwire, which is T-008-03 §5.4's
lesson.

## 7. The three gap pages this pays forward

**`docs/gaps/one-pot.md`** — rewrite the *"washing-up is not a row in a table"* passage, since it
is one now, on all 73 of that shelf's files. Fold in T-008-03 §2's list of the eight washing three
or more, with the distribution. **Recommend, never re-shelve**: the question that decides those
eight is whether One Pot promises one pan or one sink, and that is a counter decision. The
headline number is also stale (68 → 73) and the S-007 soups are unplaced; **the count is corrected
and the section list is left alone**, because re-sectioning One Pot is not this ticket's and the
drift is already reported every run.

**`docs/gaps/instant-pot.md`** — add T-008-03 §3's brown-outside-the-pot list, four of 25, with
what each does and where. It also answers T-008-01's open concern, which that page records.

**`docs/gaps/README.md`** — the tally goes from 21 rows to 22 and every row's **Recipes** and
**Only here** are re-derived from `src/generated/recipes.json`, because the existing values predate
S-007's Cha Chaan Teng finishing and S-008's counter opening. **Missing dishes** and **Missing
components** are carried forward for the 21 existing rows and derived for the new one, and the file
says which columns were re-derived and which were carried — a table that silently mixes fresh and
stale numbers is worse than one that admits it. The plain-versus-kit washing-up comparison
(T-008-03 §4) is recorded there because the ticket names that file as where the next pass will look.

**Rejected: rewriting the `Build state` block** to 685 recipes. It is labelled S-007's, the file
already carries a fresher measurement two sections below, and rewriting a block another story
signed is not this ticket's.

## 8. The drawer, settled in one sentence

T-008-04 §5 left this for here: the gap page counts the basket as one thing everywhere except
seekh kabab, where rendered fat makes the drawer a second thing — but wings, thighs and prawns
render fat too.

**Chosen: the basket assembly — basket, drawer and crisper plate — is one thing, because it is
washed in one action.** T-008-03's convention rule 9 already says a lid is part of its vessel and
rule 4 reserves separate counting for parts washed on a *different schedule*. Nothing in the 21
counts a drawer, so this settles a future dish's fate and changes nothing on the shelf today:
`air-fryer-seekh-kabab` becomes writable at two things. It is written into the gap page as a rule
and as a recommendation, not as a re-ranking, because the dish does not exist yet.
