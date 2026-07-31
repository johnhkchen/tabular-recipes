# T-002-01 — Design

Three independent jobs. Each gets its own options-and-decision below, then the cross-cutting
choices at the end.

---

## Job 1 — the three counter entries

### D1.1 What `categories` gets

`categories` is a fallback: `parse-recipes.mjs:62-68` gives a recipe with no `>> counters:` line
the counters whose `categories` claim its `category`.

| Option | Effect |
| --- | --- |
| **A. `[]` on all three** | Nothing moves. The three counters stay empty until a recipe names them. |
| B. Bowl Shop gets `["Dressings & Dips", "Salads"]` | Would claim recipes only if they name no counter — and the README records **0 counters inferred from category** today, so it would claim nothing, silently, while looking like it does something. |
| C. Instant Pot gets `["Stews & Braises"]` | Same shape, same nothing, plus it reads as a claim that every braise is a pressure-cooker dish. |

**Chosen: A.** Nine of the fifteen existing counters already carry `[]`, so it is the majority
shape, and the ticket's own framing — the shelves are *opened*, T-002-08 stocks them — makes any
fallback a lie about the current state. B and C are rejected for pretending to a claim that the
data does not support.

### D1.2 What the sections hold

The ticket requires ordered sections with **empty item lists**. Verified safe, not assumed:

- `counters.ts:78-83` — `menuFor()` drops any section whose items resolve to zero recipes.
- `counters.ts:109-114` and `pages/menu/[counter].astro:12-18` — both drop counters with
  `count === 0`, so no page is generated and no empty card appears on the front door.

So the three entries carry their menu order from day one and render nothing until T-002-08 fills
them. This is what the file's own `//` comment already promises.

### D1.3 The section titles

Adopted from the ticket essentially verbatim. The ticket permits improving the wording; the case
for *not* rewriting is stronger than the case for polish:

- They already pass the brand test — "What goes on top", "Beans from dry", "Braises that took all
  afternoon", "Rice and grains that cook in", "Soups that are the whole meal" are all plain,
  verb-forward, and say what you would do with the thing.
- They match real boards. Cava's build order is base → dips and spreads → toppings → dressing;
  Dig sells "market sides" (charred broccoli, roasted sweet potato) beside a grain or greens base;
  Goop Kitchen prints *Bowls & Plates*, *Salads*, *Soups And Side Salads*, *Sides*, and *A La
  Carte Proteins and Sides*. The ticket's list is that grammar in kitchen-table English.
- T-002-08 is going to write these titles into its own work. A rename now costs that ticket a
  round trip for no gain.

One constraint carried from `menu-sections.mjs:55`: **no ` — ` inside a section title**, because
the parser cuts a title there. None of the twenty titles contains one.

`Also here` closes all three, matching the existing `Also here` / `The shelf` / `Also` convention
at Panadería, Thai Kitchen, Deli and Meat and Three.

### D1.4 The blurbs

`blurb` is a one-line instruction to a visitor standing at the counter, second person or
imperative, no cuisine adjectives. Two of the three shelves are *equipment*, not storefronts,
which is the hard part: the voice has to survive a shelf that has no street.

| Counter | Rejected | Chosen |
| --- | --- | --- |
| The Bowl Shop | "Fresh grain bowls and seasonal salads." — a category description, and "fresh/seasonal" is the marketing register the brand forbids. | **"Pick a base, pile it up, dress it last."** — the actual order you order in, at Cava, Dig, Sweetgreen and Goop alike. |
| Instant Pot | "Pressure-cooked versions of long braises." — describes the technique to someone who did not ask. | **"Lock the lid and walk away; it gets there on its own."** — what the visitor does, and the honest reason this shelf exists. |
| One Pot | "One-pot meals for weeknights." — "weeknight" is a food-blog word, not a kitchen-table one. | **"Everything goes in one pan, and that is the only pan to wash."** — the whole promise, said the way a person says it. |

---

## Job 2 — teaching the clock about pressure

### D2.1 Where the change goes

Read of the fall-through (`time.ts:154-172`) confirms the ticket's warning is already *fixed*: an
unrecognised timer **name** falls through to the step words rather than defaulting, which is why
`~blind bake{20%min}` inside `bake the shell 20 min` reads unattended (`time.test.ts:44-59`).
So there is no ordering bug to repair — the risk is the opposite one, of adding a word that
starts lying. Every option below is therefore judged on *what it could get wrong*.

Today `~pressure cook{35%min}` normalises to `pressurecook`, matches neither set, falls to the
step words, finds nothing (`cook`, `high`, `pressure`, `lid` are all absent from both
vocabularies) and lands on `{ hands-on, default }` — thirty-five minutes of claimed attention.

| Option | Assessment |
| --- | --- |
| **A. Compound names in `UNATTENDED`, plus the bare noun `pressure`.** | Names are caught at step 1; the bare noun catches an unnamed timer in a step that says "cook at high pressure 35 min". |
| B. Compound names only, no bare noun. | Safest, but leaves the unnamed-timer path unfixed, and two whole tickets of pressure recipes are about to be written against it. |
| C. Add `release` and `vent` as bare words too. | Rejected — see D2.3. |
| D. New `PRESSURE` set with its own branch in `readTimers`. | Rejected: a fourth vocabulary and a fourth branch to buy nothing the existing two branches cannot express. The file's own precedent, `slowcook`, is a compound appliance verb sitting plainly in `UNATTENDED`. |

**Chosen: A.**

### D2.2 The words

Stored in the normalised form `normalise()` produces (lowercased, spaces and hyphens stripped),
which is how `slowcook` and `blindbake` are already stored:

```
pressure, pressurecook, pressurecooking, pressurerelease,
naturalrelease, quickrelease, cometopressure, keepwarm
```

- `pressurecook`, `naturalrelease`, `quickrelease`, `cometopressure` — the four the ticket names.
- `pressurerelease` and `pressurecooking` — the same words as a writer might actually type them
  ("natural pressure release" normalises to `naturalpressurerelease`, so that spelling is listed
  too). `UNATTENDED` already carries `prove`/`proof` and `thaw`/`defrost`, so listing the
  variants a writer will really produce is the file's own pattern, not padding.
- `keepwarm` — the pot's hold. A wait by definition, and a sibling of `slowcook`.
- `pressure`, bare — the step-words path. Evidence for the risk: **`grep -ri "pressure" recipes/`
  returns zero hits across all 514 files.** The word cannot be lying in prose today, and in
  cooking prose it is only ever the appliance's state ("under pressure", "comes to pressure",
  "at high pressure") — never a verb meaning *stand here and work*.

### D2.3 What is deliberately not added

- **Bare `release`.** It has already been caught lying once: `ajitama` says "what makes the shell
  release", and there are cooking steps of the form "until the mushrooms release their liquid,
  8 min" that are plainly hands-on. This is exactly the failure mode `NOT_A_VERB_IN_A_SENTENCE`
  exists for, and the cheaper answer is to not put the word in.
- **Bare `vent` and `seal`.** `seal` occurs 22 times in the corpus, almost all of them "seal the
  edges" of a dumpling or an empanada — a hands-on operation. `vent` occurs once, in
  `apple-pie`'s "fill, lid, vent, bake 20 min hot", where the step already resolves correctly
  through `bake`. Adding either would create the bug the ticket warns about rather than fix one.
- **Anything in `HANDS_ON`.** A pressure cooker's hands-on leg is its sauté step, and `saute` is
  already there.
- **Anything in `NOT_A_VERB_IN_A_SENTENCE`.** That set withholds trust from a word found loose in
  prose. For `pressure`, the loose prose occurrence is precisely the signal we want.

### D2.4 How it is verified, given the file constraint

Acceptance criterion 8 restricts the diff to `src/data/counters.json`, `src/lib/time.ts` and
`docs/gaps/**`. **`src/lib/time.test.ts` is therefore off limits**, so the new vocabulary ships
without a regression test of its own.

Verification instead comes from three places, and the gap is recorded honestly in Review:

1. `src/lib/collection.test.ts:77-88` — the four-unbroken-hours invariant across all 514 recipes.
   It is the test the ticket names, and it must stay green.
2. The full existing suite (666 tests) must stay green, which is what proves no existing word or
   ordering was disturbed.
3. A throwaway script, run and its transcript pasted into `progress.md`, asserting the two
   acceptance cases and the three regressions that matter most (an unknown name still falling
   through; `release` in prose still not reading as a wait; a sauté timer beside a pressure timer
   still reading hands-on).

A follow-up ticket to move (3) into `time.test.ts` is the right remedy and is named in Review.

---

## Job 3 — the three work lists

### D3.1 The heading collision, and how it is resolved

`menu-sections.mjs` machine-reads **only** the `## What it has` block (`:29-35`) and cross-checks
every slug against the recipes that actually name that counter (`:109-112`). For a counter no
recipe names yet, that check reports **every** listed slug as `listed but not shelved here`.

| Option | Assessment |
| --- | --- |
| A. Use `## What it has`, matching the fifteen. | The heading would be false — these recipes are shelved at the Deli, the Diner, the Curry House — and it hands a manual tool 150+ slugs it will reject. |
| **B. Use `## What is already here`.** | The parser ignores any heading it does not recognise, so the three files are inert to it until T-002-08 renames the block. The ticket's own words for the section are "what is already here". |
| C. Use `## What it has` but list nothing. | Throws away the largest part of the job. |

**Chosen: B**, with a one-line note in each file saying why the heading differs and what T-002-08
does with it. The `**Section title.** slug · slug` line shape is kept exactly, so the rename is
the whole of that later edit.

### D3.2 What grounds each ranked list

- **Bowl Shop** — real boards. Goop Kitchen's sections are *Bowls & Plates*, *Salads*, *Handhelds*,
  *Soups And Side Salads*, *Sides*, *A La Carte Proteins and Sides*; its items are named
  Fall Harvest Chopped Salad, Little Gem Caesar, Everyday Kale And Brussels, Mediterranean Hummus
  Bowl, Garlic Roasted Japanese Sweet Potatoes, Green Beans And Caramelized Shallots. Cava's build
  is greens → grains (saffron basmati, brown basmati, black lentils) → dips and spreads (hummus,
  red pepper hummus, harissa, roasted eggplant, Crazy Feta, tzatziki) → toppings → dressing
  (Greek vinaigrette, lemon herb tahini, yogurt dill). Dig sells marketplates over farm greens,
  toasted quinoa or brown rice with charred broccoli and roasted sweet potato. Sweetgreen's
  signatures are the Harvest Bowl, Kale Caesar and Shroomami, with focaccia and roasted sweet
  potato as sides.
- **Instant Pot** — **not** a wish list, per the ticket. Ranked out of the recipes already on the
  shelf, by how much the pot actually helps: summed *unattended* minutes per recipe, computed from
  `src/generated/recipes.json`, crossed with whether the dish is a collagen braise, a dry bean, a
  stock or a grain. Recipes whose long wait is a *rise*, a *cure* or a *chill* are excluded — the
  pot does nothing for a 20-hour ferment. Sixty-odd files qualify; the note names 25+ with slugs.
- **One Pot** — grounded in the parsed `cookware` field rather than the title, so "one pot" is a
  claim the file already makes (`Dutch oven`, `heavy pot`, `cast-iron skillet`, `cazuela`,
  `stockpot`, `wok`) rather than an assertion made from the outside.

### D3.3 Length and shape

Each file follows the fifteen: title, a lede that gives the counts and says what the next ticket
is, `---`, `## What is already here`, `## What it is missing` (ranked), `## Components it would
need`, `## What it could not stock`. The existing files run 78–120 lines; these three run longer
in the already-here block for One Pot and the Bowl Shop, because that block is the part that stops
six writers from rewriting recipes that exist, which is the ticket's stated point.

`docs/gaps/README.md` is **not** updated. Its tally table is explicitly "the state after the whole
shelf was read at 514 recipes", the three new counters hold zero recipes, and every number in it
would still be correct. Adding three zero-rows would make the table say the pass counted them.
Recorded as a note for T-002-08, which is when those rows become true.

---

## Cross-cutting decisions

**No `.cook` file is added.** The counters-pass demonstration (AC 3) uses one throwaway file
written outside the repository, checked with an explicit path — `check-recipes.mjs:32-37` accepts
arbitrary paths — with the transcript pasted into `progress.md` and the file deleted. Nothing
under `recipes/` changes, so `parse-recipes.mjs` never sees it and the 514 count cannot move.

**Ordering.** counters.json first (it unblocks the demonstration and is the six writers' actual
gate), then time.ts (independent, and verified by a suite that does not depend on the counters),
then the three gap notes (longest, and needs nothing from the other two). Three commits through
`lisa commit-ticket`.

**One correction to carry.** The ticket says `recipes/dressings-and-dips/` holds 41 files. It
holds 40, confirmed three ways. Nothing depends on it; the gap note will say 40.
