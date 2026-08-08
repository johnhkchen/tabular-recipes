# T-008-05 — Review

**The shelf is open at twenty-one, which is four short of what S-008 asked for, and the page says so
in its first line.** `/menu/air-fryer-and-pot` builds with four sections, 21 items and no *Also
here*. `npm run verify` exits 0 — 685 files draw a table, 685 recipes parse, 1229 tests pass in 21
files, 710 pages build, 22 counters print 930 slugs.

Three things a reviewer should read before the diff:

- **§4.1**, the number, and the case that the shelf is thin rather than the gate wrong.
- **§4.2**, where the script was overruled by a person, which is the ticket's own instruction and the
  one place a total could be wrong without anything failing.
- **§6.1**, a latent defect in `src/lib/time.ts` that twenty-one recipes depend on and that this
  ticket could not fix.

---

## 1. What changed

**Six files modified. Nothing created, nothing deleted. No `.cook` file, no `src/lib/**`, no
`scripts/**`.**

| commit | message | files |
| --- | --- | --- |
| `564577a` | Shelve the twenty-one that cleared the gate, and say it is twenty-one | `docs/gaps/air-fryer-and-pot.md`, `src/data/counters.json` |
| `442a9c2` | Put the frozen things where the shop keeps them | `src/data/aisles.json` |
| `1d48482` | Pay washing-up forward to the three shelves that promised it | `docs/gaps/one-pot.md`, `docs/gaps/instant-pot.md`, `docs/gaps/README.md` |
| `3b145f2` | Point the gap pages at a work artifact that will exist | `docs/gaps/air-fryer-and-pot.md`, `docs/gaps/README.md` |

All four through `lisa commit-ticket` with exact `--include` paths. The ordinary index was never
used. `git status --porcelain` shows no ticket-owned file staged, modified or untracked.

**In data terms the whole change is small and worth stating plainly:** 21 slugs into four sections
of one counter, and three patterns into one aisle. Everything else is prose about what those two
edits mean.

## 2. The shelf

Four sections, in menu order, 8 + 9 + 3 + 1 = 21:

| section | items |
| --- | --: |
| Straight out of the basket | 8 |
| Vegetables that go crisp | 9 |
| Frozen things, done properly | 3 |
| Reheats that beat the microwave | 1 |

**Two of T-008-02's five titles were dropped rather than filled**, which the ticket permits
(*"fix the placement, or the titles"*) and which `menu-sections.mjs` forces: it emits only a section
it found a slug for, so a titled-but-empty section cannot round-trip.

- ***Start to finish in the pot*** — no Instant Pot recipe on the site clears bar 3 and T-008-04
  wrote none. **The absence moved into the page's prose**, where a reader gets the reason.
- ***Sheet-pan-shaped, in the basket*** — described the vegetables, which have their own title.

***Reheats that beat the microwave*** was added for `air-fryer-reheated-pizza`, which had no other
home. **A one-item section is normal on this board** — checked, not assumed: Smokehouse's *Dessert*,
Instant Pot's *Rice, grains and porridge*, two of The Slow Cooker's four.

## 3. Coverage: what stands in for tests

No application code changed, so no unit test was written. What checks this work:

| Risk | Check | Result |
| --- | --- | --- |
| the JSON does not parse | `parse-recipes.mjs` | 685 recipes, 0 inferred from category |
| a section lists a slug that is not a recipe | `menu-sections.mjs`; `menuFor()` **throws** | 21/21 placed, build clean |
| a section lists a recipe not shelved here | `menuFor()` throws with the slug named | no throw |
| the page and the JSON disagree | destructive round-trip, §5 of `progress.md` | **0 air-fryer lines in the diff** |
| an item lands in *Also here* | `grep -c '<h2>Also</h2>' dist/menu/air-fryer-and-pot/index.html` | **0**, and 0 across all 22 menus |
| the shelf loses a dish | `check-menus.mjs` | `4 sections, 21 listed, 21 printed, count 21` |
| a new aisle pattern steals a product | 1086-line before/after diff | **exactly 3 lines, all intended** |
| aisle coverage regresses | `shopping.test.ts` at its 2% gate | 14 passed; unplaced 5 → 4 |
| a prose edit disturbs a machine-read block | `menu-sections.mjs`, re-run | One Pot 68/73, Instant Pot 25/25, both unchanged |
| the collection regressed | `npm run verify` | **exit 0** |

**The gap no check can close, and it is the important one: the numbers in the gap page could be
wrong.** The answer is that the gate is a script, its full text and full output are in
`progress.md`, and anyone can re-run it. That is weaker than a test and it is said so here rather
than dressed up. The second-order version is bar 2's lexicon, which is why §4.2 names every verdict
it and the authored reading disagree on.

**No test was added and none was removed.** The aisle probe is a `.probe.mts` driven by its own
vitest config precisely so that it cannot join the suite — verified at `npx vitest list | grep -c
aisle-diff` → 0. T-008-03 §5.4 is why that mattered.

## 4. The findings

### 4.1 It is twenty-one, and the shelf is thin rather than the gate wrong

S-008's criterion fires: fewer than about twenty-five. The report has three measured parts.

**Bar 2 excludes the most and it is not close.** Of 685 recipes, 640 fail *one plug-in machine does
the cooking*, and **22 fail that and nothing else** — `seven-minute-eggs`, `shakshuka`,
`one-pot-pasta`, `red-lentil-soup` and eighteen more, every one cooked on a hob. Bar 3 alone
excludes 14. **Bar 1 alone excludes zero.**

**The cupboard is the constraint, not the rule.** All 21 are air fryer files written by T-008-04.
The borrowing is 0% — and since T-011-05 a section list cannot borrow at all, because `menuFor()`
throws on a slug whose file does not name the counter. The ticket's instruction that *"this shelf
borrows its entire pressure-cooker half"* describes behaviour removed two tickets ago, and there was
nothing to borrow in any case.

**The four short of twenty-five are four recipes.** Six ranked pressure dishes (eggs, rice, lentils,
kitchari, mujaddara, polenta) are unwritten; seekh kabab becomes writable at two things once the
drawer question is settled, which this ticket settles. **None of them needs a bar to move.**

**Bar 1 is written up as a recommendation, not changed.** It has never excluded a recipe on its own,
it is unreadable on 508 of 685 files, and rule 6 of T-008-03's convention makes S-008's own
illustration of two-or-fewer score 1 rather than 2. Three options are costed on the page — tighten
to ≤ 1 (**admits three of the twenty-one**), rule on the chopping board, or drop bar 1 and keep
`washing-up` as the thing the shelf prints. All three are counter decisions.

### 4.2 Where a person overruled the script — read this one

**Bar 2 on the Instant Pot shelf is T-008-03's hand reading, not the lexicon's**, exactly as the
ticket instructed. **Nine verdicts moved**, all fail → pass: `cuban-black-beans`, `gigantes-plaki`,
`refried-beans`, `borscht`, `chicken-broth`, `chintan-broth`, `tonkotsu-broth`,
`braised-short-ribs`, `pot-roast`, each `-instant-pot`. The result — 21 of 25 — reproduces the
figure published before any of it was scripted, which is the point of measuring twice.

One further override: `birria-de-res-instant-pot` **passes** bar 2, because a jug blender is plugged
in and cooks nothing.

**Both are in the gap page with every slug named**, so a reader can disagree with a line rather than
with a total.

### 4.3 Two claims on the gap page were wrong and are corrected

1. **"The Slow Cooker clears bar 2 outright" (20 of 20) → 3 of 20.** Seventeen use a second
   appliance: fifteen brown or sweat in a skillet, `baked-turkey-wings-slow-cooker` roasts in an
   oven, `boston-baked-beans-slow-cooker` parboils in a saucepan. **Changes no outcome** — all
   twenty lose bar 3 by hours. Each of the four affected files was read by hand to confirm it.
2. **The 25-row Instant Pot table's bar 1 column read `not declared` on 23 of 25 rows.**
   Regenerated: **13 clear bar 1, 12 fail**, the twelve being the broths and drained beans
   (`chintan-broth-instant-pot` washes six). Bar 1 becoming readable moved the gate's total by
   nothing, which is the finding.

### 4.4 The ticket expected 23 counters. There are 22

The Soup Pot came down under S-007. Every one of the 22 has recipes on it and every one is fully
sectioned. Recorded on the counter's page and in `docs/gaps/README.md` rather than worked around.

### 4.5 The drawer, settled in one sentence

T-008-04 §5 left this for here. **The basket assembly — basket, drawer and crisper plate — is one
thing, because it is washed in one action.** That is T-008-03 rule 9 (*a lid is part of its vessel*)
applied to this machine; rule 4 reserves separate counting for parts washed on a *different
schedule*. **It changes nothing on the shelf today** — no item counts a drawer — and makes
`air-fryer-seekh-kabab` writable at two. Written as a rule and a recommendation, not a re-ranking,
because the dish does not exist.

## 5. The three pages that were paid forward

**`docs/gaps/one-pot.md`** — the *"washing-up is not a row in a table"* passage is rewritten; it is a
row now, on all 73 files. Carries T-008-03's table of the **eight washing three or more**, the
distribution (1→40, 2→25, 3→6, 4→2, mean 1.59), and a recommendation — *does One Pot promise one pan
or one sink?* — with what each answer costs. **Nothing was re-shelved.** Headline corrected 68 → 73.
Two stale claims fixed: the four fried slugs are already out of `counters.json`, and `menuFor()`
throws rather than dropping since T-011-05.

**`docs/gaps/instant-pot.md`** — new *What browns outside the pot*: the four, with the quote from
each file and whether it happens before, during or after. Answers T-008-01's open concern. Plus what
the sink says now it has been asked: 13 of 25 wash two or fewer, and against the plain siblings it is
a dead heat sixteen times out of twenty-five.

**`docs/gaps/README.md`** — the tally goes 21 rows → 22 with **Recipes** and **Only here** re-derived
for every row (930 assignments, 483 only-here) and the other two columns carried forward, **with the
file saying which are which**. Records the plain-versus-kit comparison: Slow Cooker 16 of 20 wash
more and none fewer; Instant Pot 16 of 25 a dead heat; Air Fryer 10 of 13 fewer.

## 6. Open concerns

### 6.1 A latent defect in `src/lib/time.ts` that 21 recipes depend on — act on this

**`air fry` is in neither `UNATTENDED` nor `HANDS_ON`**, so a `~air fry{}` timer's reading falls
through to the words of its step, and *fry* is `HANDS_ON`. All 21 files read correctly **only
because every basket cell happens to open with `roast`**, which `readWords` reaches first.
**Reorder any basket cell so `roast` falls after the clock and that recipe silently becomes twenty
minutes of standing at a machine you can walk away from.** T-008-04 found it and could not fix it;
neither could this ticket. **The fix is one line — `'airfry'` in `UNATTENDED`** — exactly as T-002-01
added the four pressure names before any pressure recipe existed. It is recorded in the gap page's
*Components it would need* as a live defect.

Two smaller `src/lib/**` items, each one line: `shake` in `VERB_ICONS` (ten cells wanted the
machine's own verb and had to say *toss the basket*), and a `NEVER_WASHED` utensil entry, which
would silence the seven permanent `unaccountedCookware` advisories T-008-03 left.

### 6.2 Bar 2's lexicon is a judgement, and it was tightened twice after measuring

Both rounds are documented on the gap page and in `progress.md`, but a reviewer should know the
shape: reading the whole `.cook` file failed 18 of 21 air fryer recipes on their own metadata
(`>> category: Fried & Crispy` contains *fried*), and keeping `simmer`/`boil`/`sauté` failed two slow
cooker files that say in their own first row that nothing is browned.

**The lexicon now finds a second appliance mostly by name** (`#skillet{}`, `#saucepan{}`, `#oven{}`),
which is checkable but inherits `cookware`'s known weakness: it counts what a recipe *names*. **A
recipe that browns in a pan it never names would pass bar 2 wrongly.** No such recipe is on this
shelf — all 21 name only a basket and at most one bowl or plate — but the guarantee is weaker than
the shelf's other two bars, and that is why the Instant Pot shelf is read by a person instead.

### 6.3 Two numbers on the gap page are somebody else's reading, not this ticket's

The 25-row table's **bar 2** column and the **washing-up counts throughout** are T-008-03's authored
readings. This ticket did not re-read 145 files. Where T-008-03 flagged a call as arguable
(`soy-sauce-chicken` at 3 only because it stores the master stock; `crispy-chickpeas` at 3 on one
reading of a reused bowl), those calls flow into `one-pot.md`'s eight-recipe list unchanged and are
flagged there.

### 6.4 One drift is left on the board and it is not this ticket's

`docs/gaps/one-pot.md`'s `## What it has` block does not list the five soups S-007 moved there, so
`menu-sections.mjs` reports `One Pot: 68/73 placed` every run. **They print correctly on the menu**,
because `counters.json` has them under *Quick soups that go with dinner* — which is backwards, since
these pages are meant to be the source. Adding five slugs closes the last drift; re-sectioning
another counter is not S-008's call. It is recorded on both pages.

### 6.5 Smaller notes

- **`npm run verify:mobile` was not run.** It drives a browser and is not part of `npm run verify`.
  This ticket adds no markup, but it adds a menu page with 21 items where there were none, so the
  first person to run it is measuring something new.
- **`leftover pizza` is deliberately left in the `other` aisle.** No shop sells it. Three more
  unplaced names (`flat skewers`, `metal skewers`, `oak or hickory wood`) are equipment and predate
  this story.
- **The preheat convention exists as 21 copies of one sentence.** T-008-04 decided it; it belongs in
  `docs/knowledge/`, which is not this ticket's. Recorded in *Components it would need*.
- **`docs/knowledge/counters.md`'s entry for this counter describes a gate applied to a basket.**
  When the six pot ranks are written, its vocabulary table will need to say something about pressure.
- **`gate.mjs` and `tally.mjs` are printed in full inside `progress.md`** rather than cited as files.
  Lisa publishes phase artifacts, not the whole attempt directory, and a committed gap page must not
  carry a path that will not exist — T-008-03's `findings.md`, cited by its own review and absent
  from `docs/active/work/T-008-03/`, is the precedent this avoids.

## 7. Acceptance criteria, one line each

| criterion | where |
| --- | --- |
| gate applied by a script, output pasted, per-bar breakdown | `progress.md` §2 and the script in full; gap page *The gate, measured* |
| populated sections in menu order, **no *Also here*** | 4 sections, 21 items; `grep -c '<h2>Also</h2>'` → 0 |
| every item passes all three bars, in a table of slug / count / machine / clock | gap page *The shelf, item by item*, 21 rows, no empty cell |
| the total stated plainly **including under 25**, with the excluding bar | gap page opening line and *It is twenty-one* |
| **no bar changed**; a wrong-looking bar written up | *Bar 1 measures the wrong thing*, three costed options |
| every slug resolves; `menu-sections.mjs` reproduces `counters.json` | `4 sections, 21/21 placed`; round-trip diff has 0 air-fryer lines |
| aisle test passes; no pattern steals, shown by before/after diff | 14 passed, 5 → 4 unplaced; diff is exactly 3 intended lines |
| `one-pot.md` no longer says washing-up cannot be expressed; carries the ≥ 3 list; recommends | *What the shelf actually washes* |
| `instant-pot.md` carries the brown-outside-the-pot list | *What browns outside the pot* |
| `README.md` tally covers all counters; records the plain-vs-kit comparison | 22-row tally; *What the kit axis says about the sink* |
| `npm run verify` passes end to end | **exit 0**, transcript in `verify.txt` |
| **no `.cook` file edited** | none in any commit |
| only the six owned paths modified | four commits, all `--include`, `git status` clean |

**One criterion is met by a different number than it names**, and it is called out rather than
quietly satisfied: *"Check the menus index still reads deliberately at 23 counters."* It reads
**22**. Nothing is broken — every counter has recipes and every one is sectioned — and the
difference is The Soup Pot, retired under S-007 before this ticket was written.
