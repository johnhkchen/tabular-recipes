# T-012-01 — Research

What exists, where, and how it connects. No proposals here.

Measured on 7 August 2026, on `main`, with five stories in flight on the same branch. Counts move
under other tickets; every number below says how it was taken.

---

## 1. The deliverable's neighbourhood: `docs/knowledge/`

Four files, one of which is Lisa's and not the repo's:

| File | Lines | What it settles | Created by |
| --- | --: | --- | --- |
| `counters.md` | 1160 | What a counter is, and the menu vocabulary each one was drawn from | S-001 |
| `voice.md` | 190 | Who is reading a recipe page and how long each line may be | T-005-01, commit `937ca8a` |
| `scaling.md` | 521 | What it costs to cook more of a thing | T-011-01, commit `2a118e5` |
| `rdspi-workflow.md` | 136 | Lisa's own workflow definition — not a repo argument | tooling |

**Shape they share.** A title, a bolded one-sentence thesis directly under it, then numbered or
named sections that each state a claim and the evidence behind it. Tables carry the dense parts.
`voice.md` and `scaling.md` both open with an instruction about *when to read this* — *"Read this
before you write a recipe file"*, *"Read this before you build anything that offers a cook more
than one serving size."* Both end with a section reconciling the page against what was actually
built afterwards (`voice.md` §"What changed, and when"). Both point at code by path and line.

**How they are linked.** This is the finding that matters for the ticket's first acceptance
criterion. There is no index of `docs/knowledge/`:

- No `docs/knowledge/README.md` exists. `docs/gaps/` has one; `docs/knowledge/` does not.
- `README.md:15` names `docs/knowledge/counters.md` inside a prose paragraph about how the site is
  arranged. It names no other file in the folder.
- `README.md`'s "How it fits together" table indexes `recipes/`, `src/` and `scripts/`. It contains
  no `docs/` row at all.
- `docs/gaps/README.md:11` names `counters.md` as the source of its vocabulary.
- `voice.md` and `scaling.md` are linked from **nowhere** outside `docs/active/` tickets and work
  artifacts. `git show --stat` on both creating commits: each added exactly one file and touched
  nothing else.

So the precedent for adding a knowledge file is a one-file commit with no index edit, because there
is no index to edit. Cross-links between knowledge files exist and run inward and to `docs/gaps/`
(`voice.md:189` → `../gaps/voice.md`; `counters.md` → six gaps pages; `scaling.md:349,369` cites
`voice.md` by name in prose without a link).

---

## 2. The source material

`docs/active/stories/S-012-who-is-actually-cooking.md`, 107 lines. Three cooks, each given a
paragraph in §"The three, and what makes each one hard", each with its contradiction stated in bold.
The ticket's §1 restates the same three in slightly more detail. **Between them these are the only
source**, and the story is explicit that they came from the person the collection is for.

Details present in the ticket but not the story, which is the ticket expanding on its own story:
*"eating more like cattle than a zoo animal"* (story has it in §"What the collection already fails
at"), *"too oily or too salty, or lacking nutrition"*, *"open to side dishes, but not ones that send
them to the shop"*, *"hosting a couple and a niece"*, *"wants to impress the in-laws at the big
meals"*, *"cramped living space"*.

Details **neither** gives, which any concrete claim about them would have to mark as an assumption:
how many days the fridge-clearing covers, the household's size, whether anyone has a dietary
restriction, what equipment is in any of the three kitchens, how much of the holiday cooking is the
big meals versus the other days, what "a few days" is in nights.

The story also carries a measured indictment of the shelf — 103 stews, 101 sweets, 18
`vegetables-and-sides` of which roughly eight are not a starch, 225 meat tags against 32
`vegetarian`, measured at 658 recipes. **That measurement is T-012-02's job to redo and rank
from**, and the story says so.

---

## 3. The fields a recipe page already carries

From `README.md` §"Writing a recipe" and the readers in `src/lib/`. Coverage counted with
`grep -rl '^>> <field>:' recipes/` over 685 `.cook` files on 7 August 2026.

| Field / number | Where it is read | Coverage | What it says |
| --- | --- | --: | --- |
| `>> servings:` | `scripts/normalise.mjs` | 685 / 685 | The baseline every multiplier and capacity is relative to |
| the clock — `totalMinutes` | `src/lib/schedule.ts` | derived | Elapsed: the critical path, not the sum |
| the clock — `handsOnMinutes` | `schedule.ts` | derived | How much of it you stand there for |
| the clock — `unattendedMinutes` | `schedule.ts` | derived | How much of it you do not |
| `assumedHandsOnMinutes` | `schedule.ts` | derived | How much of the hands-on figure nobody claimed |
| `longestHandsOnMinutes` | `schedule.ts`, T-010-01 | derived | Longest unbroken run at the hob, on **one cook's** clock |
| `untimedCount` | `schedule.ts` | derived | Operations that never said how long |
| `>> slack:` | `src/lib/slack.ts` | 416 / 685 | Level **and reason**: what goes wrong if you get it wrong |
| `>> washing-up:` | `src/lib/washing-up.ts` | 177 / 685 | The list; the count is derived from it |
| `>> counters:` | `src/data/counters.json` | list, with a category fallback | Where you would have bought it |
| `>> aka:` | search index | searchable | What the menu called it |
| `>> pairs-with:` | build, made mutual | 434 / 685 | What goes with it |
| `>> dish:` / `>> kit:` | build | 58 carry `kit` | One dish, two tables, one plain way |
| the staples split | `src/lib/shopping.ts`, `src/data/staples.json` | 31 staples | *Buy* versus *you probably have* on `/list/` |

**Not yet fields.** `capacity` (T-011-02, phase `plan`) and `keeps` (T-011-04, phase `plan`) are
designed and not built: `grep -rl '>> capacity:' recipes/` and the same for `keeps` both return 0,
and `src/lib/scaling.ts` does not exist. The ticket names both, so the file must say which side of
the line each is on.

**What a browser can reach.** `src/pages/search.json.ts` (T-010-01, done) ships per recipe: `slug`,
`title`, `counters`, a joined `find` blob (title, category, counters, `aka`, tags, ingredient
names), `elapsedMinutes`, `handsOnMinutes`, `longestHandsOnMinutes`, `washingUpCount` (null when
undeclared) and `evidence` from `handsOnEvidence()`. Nothing about balance, nothing about the
pantry, nothing about a week, nothing about a second pair of hands.

---

## 4. `src/lib/schedule.ts` — the many-hands assumption

The ticket asks for this finding explicitly. The file states the assumption twice, and treats it
differently each time.

**Stated as a caveat on the totals**, `schedule.ts:63-66`, inside the `Schedule` interface doc:

> How much of the WORK is of each kind, summed over every task — not elapsed time, which is
> `totalMinutes`. Two parallel one-hour rises are two hours of unattended work and one hour of your
> evening. (The schedule also assumes you have as many hands as the tree has branches; it never
> delays one hands-on task for another.)

**Stated again as a bug it fixes for one number**, `schedule.ts:306-322`, above `longestUnbroken()`:

> The schedule above assumes as many hands as the tree has branches — it never delays one hands-on
> task for another — **which is right for a timeline and wrong for this number.** A person with two
> hands-on jobs running at once is doing both, one after the other. So the stretches are laid on one
> cook's clock here […] Measuring along `criticalPath` instead would disagree on 80 recipes and
> always downward, six of them to ZERO.

So the module already holds **two models of how many cooks there are**: a many-hands model for
`lanes`, `totalMinutes` and `criticalPath`, and a deliberate one-cook model for
`longestHandsOnMinutes`, added by T-010-01 for S-010's tired reader. The many-hands model was never
argued as a model of a household — it is a property of reading a dependency graph — and nobody has
written down who it is right for.

---

## 5. `src/lib/plan.ts` — what holds a plan, and what does not

321 lines. `PlanItem` is `{ slug, multiplier }`; a `StoredPlan` is `{ version, items }` in
`localStorage` under `tabular-recipes:plan`. `MULTIPLIERS = [0.5, 1, 2, 3]`. The exported surface is
`readPlan`, `addToPlan`, `removeFromPlan`, `togglePlan`, `setMultiplier`, `clearPlan`, `isInPlan`,
`multiplierOf`, `planSize`, `onPlanChange`, `resetPlanCache`.

There is no date, no day, no history, no record of what was cooked, no preference, no person, and no
second plan. The plan is a set, not a week; clearing it leaves nothing behind. `/list/` builds a
shopping list from it and splits staples out (`src/pages/list.astro:1099-1100`, with
`isMoreThanAJar()` pushing a large amount of a staple back onto the buying side).

`S-011` records the live defect: the plan page prints `serves 4 → 12` and the clock does not move.
T-011-05 owns that.

---

## 6. `src/data/staples.json` — the pantry, and the direction it runs

31 staples, each `{ name, patterns, except? }`, plus a five-clause written doctrine under
`"where the line is"`: bought-once-and-spent-by-the-spoonful is a staple; anything wanted by the cup
or the pound is shopping; fresh is shopping even when dried is a staple; universal not
cuisine-specific; and a large amount is shopping whatever the file says. Matching is
`matchesStaple()` in `src/lib/units.ts` — whole consecutive words, so "salt" does not claim
"unsalted butter".

**The direction is recipe → list.** Given a plan, the code can say which lines you probably already
have. Nothing anywhere takes a set of things a person has and returns recipes. `search.json.ts`
indexes ingredient *names* as free text, so a person can type "chickpeas" and find recipes naming
chickpeas — one ingredient at a time, with no notion of *all of these and nothing else*, and no
notion of the pantry doctrine that would let the 31 staples be assumed.

---

## 7. What is already on the board, for the demonstration the ticket asks for

The file has to hold a design against the three and get a pass or fail. Two candidates:

**S-010's three dials** (T-010-02, phase `review`, so built): *time you're standing there*
(`handsOnMinutes`), *on the table by* (`totalMinutes` as a cap), *things to wash*
(`washingUpCount`). Three answers, not two — passes, fails, and **cannot say**, the third shown and
marked. No difficulty score, argued at length in S-010. Front page, phone-first.

**S-011's capacity** (T-011-02, phase `plan`): the author declares how many servings the limiting
vessel holds, naming the vessel; batches are `ceil(n / c)`, serial, and repeat the unattended time.
Absent is the common answer. Derived growth, never a declared class.

Both are defined precisely enough to be held against a person and to fail.

---

## 8. Constraints on the writing

- `docs/knowledge/voice.md` governs. Kitchen-table English; no jargon a friend would not say.
- The story forbids a name, a photograph, a job title, and a fourth persona.
- The ticket forbids designing: no proposed fields, no dials, no ranking. Ranking is T-012-02's, and
  it is ranked from the shelf rather than from the personas.
- Every detail traces to the source; every gap is marked as an assumption.
- File scope: `docs/knowledge/cooks.md` and `docs/active/work/T-012-01/**` only.

## 9. Open question carried into Design

The first acceptance criterion asks for the file to be *"linked from wherever that folder is
indexed"*; the last restricts the change to `docs/knowledge/cooks.md`. §1 establishes that the
folder is indexed nowhere and that both prior knowledge files were added without an index edit.
Design has to resolve those two criteria against each other rather than pick one silently.
