# T-008-04 — Research

What exists, where it is, and what it will let me write. No solutions here.

---

## 1. The shelf, as it stands today

`src/data/counters.json:1990` holds the counter. Name **`The Air Fryer & the Pot`**, slug
`air-fryer-and-pot`, blurb *"Plug one in, eat, and wash two things."* Five sections, **every
`items` array empty**, one shelf-talk note under the first: *"Everything here washes two things or
fewer, cooks in one plug-in machine, and is on the table in 45 minutes."*

`src/pages/menu/[counter].astro` filters on `menu.count > 0`, so **the page does not build at all
until this ticket lands** (`docs/gaps/air-fryer-and-pot.md` §*Fewer than ten clear it*).

Confirmed by search, not assumed:

- No `.cook` file anywhere declares `kit: Air Fryer`.
- No `.cook` file names an air fryer in cookware or prose.
- `src/lib/icons.ts:319` maps the verb `air fry` to an oven icon. Nothing uses it.

The technique is being opened, not extended.

## 2. The inputs I am working from

| Source | What it gives me |
| --- | --- |
| `docs/gaps/air-fryer-and-pot.md` | The ranked list (26 ranks, 20 basket / 6 pot), the `kit:`-or-standalone call per slug, every sourced time, and the *what a table cannot hold* list. **The authority.** |
| `docs/active/work/T-008-01/review.md` | How `washing-up` is authored: the count is derived, never written; absent ≠ zero; the cross-check warns. |
| `recipes/eggs/shakshuka.cook`, `.../beef-bourguignon-instant-pot.cook` | The two worked shapes I copy — a declared `washing-up` line, and a `dish:`/`kit:` sibling. |
| `docs/knowledge/voice.md` | Where each sentence goes and what it costs. |

## 3. What the checker will and will not let me write

`scripts/check-recipes.mjs`, run per file. Two jobs, and **both fail the build**
(`CAPS_FAIL_BUILD = true`).

**Structural, from `src/lib/tree.ts` and `src/lib/layout.ts`:**

- Required metadata: `title`, `category`, `tags`, `servings`. Nothing else is mandatory.
- `grid.rowCount >= 3` — rowCount is `tree.leaves.length`, one leaf per ingredient entry.
- `grid.colCount >= 3` — colCount is `tree.root.col`; leaves sit at col 1 and every op is
  `max(child.col) + 1`, so a **chain of two operations gives 3** and satisfies it. The ticket asks
  for 3–6 operations, comfortably above the floor.
- Exactly one root: every branch must flow into one final step via `@&(~n){}`, or
  `buildTree` throws *"N steps end the recipe"*.
- A referenced step may only be used once — the table is a tree, not a graph.
- Every op cell must have a non-empty label.
- A step with **no ingredients and no refs** becomes a full-width prose row: above the table if it
  comes before the first op, below it after (`tree.ts:145`).
- `@&(~n)name{}` counts back **n step blocks, prose rows included** (verified against
  `charred-broccoli.cook`, where the header is step 0).

**Length caps, in characters of what a reader actually meets:**

| Field | Cap | Where it bites here |
| --- | --: | --- |
| operation cell | 70 | The basket step has to hold temperature, time, load and cue. This is the tight one. |
| step body | 150 | The step's own words, when a `>> step:` label overrides them. |
| prose row | 120 | Where the preheat and basket-size convention has to fit. |
| slack reason | 200 | Fine. |
| ingredient note | 80 | Fine. |

**Advisory notes (print, exit 0):** a `#thing{}` the `washing-up` line does not account for, and a
`washing-up` entry that starts with a number word. `unaccountedCookware` flattens both sides and
matches on substring either way, so cookware `#air fryer basket{}` is accounted for by the entry
`the basket` — `"air fryer basket".includes("basket")` is true.

## 4. `washing-up`, exactly as authored

`src/lib/washing-up.ts`. A comma-separated list of things, in a cook's own words. The **count is
`items.length` and is taken in that one function** — an author has nowhere to write a number and
`>> washing-up: 2` is a build error. `nothing` is the whole line or none of it. A line that is
present and empty is a failure, not a quiet zero.

Eleven files in 664 declare one. `NEVER_WASHED` covers fixtures (oven, hob, grill, smoker,
fridge…); **an air fryer basket is not in it and should not be — it is washed.**

The open question this ticket has to settle in writing: **is the outer drawer a second thing?**
The gap page names exactly one dish where it is — rank 17, seekh kabab, *"the one dish on the page
where the drawer under the basket is part of the washing-up and should be counted"* — and treats it
as one thing everywhere else. That single sentence decides whether a dish clears bar 1.

## 5. `dish:` / `kit:`, and the build error waiting behind it

`scripts/normalise.mjs:231` — `dish` defaults to the file's own slug, `kit` defaults to null.
`scripts/parse-recipes.mjs:198` throws when two files share a `dish` and more than one of them has
no `kit:` line. So:

- **A basket version of something already here** carries `>> dish: <existing-slug>` **and**
  `>> kit: Air Fryer`.
- **A basket dish with no plain counterpart** carries **neither line**.

Fifteen of the gap page's twenty basket ranks name an existing slug. I verified every one of them
resolves to a real file:

| Rank | Existing plain file | Rank | Existing plain file |
| --- | --- | --- | --- |
| 2 sprouts | `vegetables-and-sides/roasted-brussels-sprouts.cook` | 11 broccoli | `vegetables-and-sides/charred-broccoli.cook` |
| 3 halloumi | `fried-and-crispy/seared-halloumi.cook` | 12 batata harra | `fried-and-crispy/batata-harra.cook` |
| 4 chips | `fried-and-crispy/french-fries.cook` | 15 tikka | `smoked-and-grilled/chicken-tikka.cook` |
| 5 cauliflower | `vegetables-and-sides/roasted-cauliflower.cook` | 16 shish tawook | `smoked-and-grilled/shish-tawook.cook` |
| 6 salmon | `smoked-and-grilled/blackened-salmon.cook` | 17 seekh kabab | `smoked-and-grilled/seekh-kabab.cook` |
| 7 chickpeas | `fried-and-crispy/crispy-chickpeas.cook` | 19 tofu | `fried-and-crispy/crisped-marinated-tofu.cook` |
| 9 saba | `smoked-and-grilled/saba-shioyaki.cook` | 20 roast potatoes | `vegetables-and-sides/crispy-roast-potatoes.cook` |
| 10 sweet potatoes | `vegetables-and-sides/roasted-sweet-potatoes.cook` | | |

Standalone ranks — 1 wings, 8 thighs, 13 bacon, 14 corn ribs, 18 padrón — have **no counterpart**.
Searched: no `wings`, `chicken-wings`, `bacon`, `corn-ribs` or `padron-peppers` slug exists.
`swiss-wings` and `baked-turkey-wings` are different dishes with their own `dish` keys, so they do
not collide.

## 6. The clock, and the one piece of vocabulary that is missing

`src/lib/time.ts` decides whether a timer is time you stand there for. Order of precedence
(`readTimers`, line 174):

1. The **timer's own name**, if it is in `UNATTENDED` or `HANDS_ON`.
2. Failing that, the **words of the step slice** the timer sits in.
3. Failing that, the **whole step label**.
4. Failing everything, **hands-on** — *"promising a cook they can leave when they cannot is the
   worse error."*

**`air fry` is in neither set.** `normalise('air fry')` gives `airfry`; it is not in `UNATTENDED`
(which holds `roast`, `bake`, `braise`, `steam`, the four pressure names T-002-01 added) and not in
`HANDS_ON` (which holds `fry`, `deepfry`, `stirfry`, `sear`, `grill`, `toast`).

So a timer written `~air fry{20%min}` falls through to the label — and a label reading
*"air fry 200°C 20 min"* contains the word **fry**, which is `HANDS_ON`. **Twenty minutes of
walk-away basket time would print as twenty minutes of standing at the machine**, on every file
this ticket writes, which is the opposite of what the shelf promises.

The gap page predicted this exactly: *"`~air fry` as a timer name, added to `src/lib/time.ts` the
way T-002-01 added `~pressure cook`… Without it the clock reads a basket cook as hands-on time a
cook is standing over, which is wrong."* **This ticket may not touch `src/`.** That is a
constraint, not an oversight, and Design has to route around it.

`readWords` resolves ties in favour of unattended: *"Unattended wins, as it always did."* So a
label containing both an unattended word and `fry` reads unattended. That is the seam.

## 7. What the sources actually establish

From the gap page's *Where this came from*, unchanged and not re-derived:

**Tested (America's Test Kitchen), four dishes only:**

- **Wings** — 400°F/200°C, **18–24 min**, 2½ lb, range written wide to cover a cold or preheated
  machine; ATK permits overlap, every other source insists on a single layer. **The disagreement is
  about the load, not the clock, and it should not be resolved.**
- **Brussels sprouts** — **350°F/175°C for 20–25 min**, 1 lb to 1 Tbsp oil, reached by testing
  400°F and **rejecting** it (the outside browned before the inside softened).
- **Broccoli** — 350°F/175°C, **8–12 min**, tossed halfway, tossed first with **equal parts water
  and oil**: the water steams, then boils off, then the oil browns.
- **Salmon** — 400°F/200°C, **10–14 min** on 1½-in fillets, pulled at **125°F/52°C**. Finish
  temperature is genuinely contested: 125°F (ATK), 130–135°F (recipe sites), 145°F (food safety).

**Sourced but not test-kitchen:** the same bag of frozen chips at **18 min in a 1400 W machine, 12
in a 1700 W, 9 in a 2000 W** — a factor of two across machines from one shop shelf.

**Capacity:** *"external dimensions and stated capacities of air fryers are not reliable indications
of how much food they can cook at once"*; ATK's winners exceed 10 × 10 in and hold four cutlets or
two 15-oz bags of chips, small machines half that.

**Everything else on the list is tagged `[to establish]`** — nineteen of twenty-six ranks — and the
gap page is explicit: *"A writer must not copy one of these into a recipe."* The conversion rule
(*drop 25°F, cut 20%*) is recorded there **so it can be refused**.

That leaves exactly one honest instrument for the untested dishes: **write the range, in the prose,
with the reason it is a range, and put the middle in the timer.** The ticket names that instrument
in §2 and the collection already does it.

## 8. Constraints I am under

- **`.cook` files in `recipes/` only.** No `src/`, no `docs/gaps/**`, no `src/data/counters.json`.
- **No existing `.cook` file may be edited**, for any reason. T-008-03 is annotating the same tree
  in parallel; anything an existing file needs is a note for T-008-05.
- Fifteen files minimum; ≥3 in the frozen block; 5–16 ingredient rows and 3–6 operations each, or
  the artifact says why not.
- Every file: `>> washing-up:` with a count ≤ 2, `>> counters: The Air Fryer & the Pot`, every
  timer named, load stated, doneness cue beside the clock, preheat stated, basket size stated.
- `npm run check` passes for all 664 + N files; `npm run verify` also builds and runs 867 tests.

## 9. Open questions Design has to answer

1. **The timer name.** `~air fry` is the vocabulary the shelf should own; `~roast` is the word the
   clock can already read. §6 is the whole problem and `src/` is closed.
2. **The drawer.** One thing or two? §4. It decides seekh kabab and nothing else.
3. **The soak, the press and the marinade.** `french-fries` soaks 30 min, `crisped-marinated-tofu`
   presses 30 min, `chicken-tikka` marinates 6 hr. Each is wall-clock and each threatens bar 3.
   The gap page says pick a way out **in the file** and argue it; it does not pick.
4. **Where the four required facts go**, against a 70-char op cell and a 120-char prose row.
5. **Which dishes are ranked out**, and on which bar. A recorded rejection is worth as much as a
   file.
