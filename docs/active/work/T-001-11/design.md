# T-001-11 — Design

Options for filling the Shawarma Counter, weighed against what Research found on disk, and
the decision.

## The question the ticket actually poses

Five new files clear the acceptance floor (21 → 26 shelved, 15 → 18 exclusive). But the
second criterion binds harder than the first: *"The dishes at the top of
`docs/gaps/shawarma-counter.md` are written, in that order, as far as the count above
reaches."* The top of that list is not five cheap dips. It is **the spit, the second spit,
falafel, the rice, the skewers** — the five hardest things on the board, and three of them
need a component that does not exist yet.

So the real design question is not *how many* but *how far down the ranked list, and what
does going that far drag in with it*.

## Option A — the floor: five files, cheapest first

Write `labneh`, `fattoush`, `kabis`, `batata-harra`, `ful-medames`. All are one-session
recipes, none needs a component, all pass the tiling gate easily. 26 shelved, 20 exclusive.

**Rejected.** It satisfies criterion 1 and violates criterion 2 outright: these are ranked
7, 8, 9, 10 and 11, and it skips 1–6 — the entire reason the gap doc exists. The doc's first
line is "**nothing on the spit**". A counter named for shaved meat that gains a pickle plate
and a bread salad is still a counter with nothing on the spit.

## Option B — the top six, and nothing else

Write `shawarma-spice`, `chicken-shawarma`, `gyro-meat`, `falafel`, `yellow-rice`,
`shish-tawook`, `kafta`. Seven files, 28 shelved, 22 exclusive. Exactly the ranked order,
stopping the moment the count is met.

**Rejected, but only just.** This is honest and it is defensible. What it leaves behind is
the *reason* those dishes are ordered that way: the gap doc ranks by conspicuousness, and
items 7–14 are conspicuous too — the dip case's plainest item, the second salad, the pickle
plate, the bakery half of the mezze list, and the sweets. Stopping at seven leaves the
counter with a spit and no sides, which is a different lopsidedness rather than none. The
comparable ticket, T-001-09 (Curry House), had a floor of seven and shipped **twenty**;
15 → 35. Matching the floor here would be the outlier.

## Option C — down the ranked list to item 14, with the components each dish needs

Twenty-three files: six components and seventeen dishes, taking the list from item 1 to item
14 in order, skipping only what the doc itself rules out. 21 → 44 shelved, 21 → 36
exclusive.

**Chosen.** It is the only option that satisfies criterion 2 as written — *in that order* —
and it matches the scale the sibling counters were filled at. The components are not
padding: three of the top six dishes cannot be written honestly without them, and each is
also a menu item people order by name.

## The collision at item 4, and how it is resolved

`docs/gaps/shawarma-counter.md` lists **"Chicken over rice"** as missing item 4, and its
**"What it could not stock"** section names the same dish:

> **The grid.** Three or four proteins × four formats × two sauces is the whole board.
> "Chicken over rice" is three finished tables and a scoop. That is the reference's own
> description of the counter and a table cannot express a permutation.

The ticket is explicit that the could-not-stock section "is not a to-do list: those are the
items a single table genuinely cannot express, and the reasons are given." The two entries
are the same dish seen from two sides, and the later, reasoned one wins.

**Decision: `chicken-over-rice` is not written**, and neither are `loaded-fries` (item 21),
the combo plate, or mezze-as-a-meal. Each is named in the work artifact with the doc's own
reason. What *is* written is every finished table the plate is assembled from —
`chicken-shawarma`, `yellow-rice`, `white-sauce`, `sumac-onions` — so the plate exists as
four real recipes and a scoop, which is precisely what the doc says it is.

`makdous` (item 20) is also skipped, for the doc's stated reason: weeks under oil, a
spoilage risk, and it converges to a jar.

## What "the spit" becomes

The doc rules out the spit itself — no final operation, the stack never finishes. But it
also says, in the same breath, that the home versions "are writable and worth writing, and
they are a different dish."

`al-pastor` is the precedent, and it was recently **edited** to move that caveat out of a
`>> note:` field and into the prose of the step where the substitution happens. That is the
house answer to this exact problem, and both spit recipes follow it:

- **`chicken-shawarma`** — thighs marinated in the spice, stacked and pressed into a loaf
  tin, roasted through, then shaved and crisped in a hot pan. The caveat rides in step 2's
  prose, where the tin replaces the cone.
- **`gyro-meat`** — the other half of the same problem and a genuinely different method:
  ground lamb and beef worked to a paste in a processor (this is what makes it sliceable,
  and it is the step home versions skip), baked as a pressed loaf, chilled, sliced thin,
  crisped. Chilling before slicing is the part that decides it.

Two files rather than one, because the gap doc ranks them separately and they share no step
after the marinade.

## Components: which are written, which stay assumed

| Component | Written? | Why |
| --- | --- | --- |
| Shawarma spice rub | **yes** | Under both spit recipes; "does not have a cookbook name" |
| Labneh | **yes** | Ranked item 7 *and* the base under three dips |
| The cart's white sauce | **yes** | Doc is explicit that `tahini-sauce` and `tzatziki` are both here and neither is it |
| Pomegranate molasses | **yes** | `fattoush` needs it; `muhammara` already assumes it |
| Sumac onions | **yes** | "on every plate off the spit" |
| Attar (sugar syrup) | **yes** | Under baklava and maamoul; which way round hot-over-cold goes is the whole trick |
| Yellow rice | **yes**, as a dish | Ranked item 5 in its own right |
| Falafel mix | **no** | It is not separable from falafel — the mix *is* the recipe, and grinding it is the method |
| Yogurt-lemon-garlic marinade | **no** | Same: it is `shish-tawook`'s first step and nothing else uses it |
| Kibbeh dough | **no** | Same: ground with the meat, inside the one dish |
| Filo | **no** | Bought sheets are the canonical home method; the clarified butter is written inline |
| Thin red hot sauce | **no** | Ranked below the cut; named as deferred |
| Amba | **no** | Ranked below the cut; named as deferred |
| Turnip-and-beet brine | **no** | It is `kabis` itself, not a separate thing |

The rule applied: **a component is written when it is also something a person orders or buys
by name, or when more than one dish on this list needs it.** Otherwise it stays a step.

## Rejected: one `levantine-dough` shared by the four bakery items

`manakish`, `lahm-bi-ajeen`, `fatayer` and `sambousek` all start from a plain yeasted flour
dough. A shared file would save repetition.

**Rejected.** `pita-bread` is the precedent and it builds its dough inline; so do `gyoza`
and every filled thing in `dumplings-and-rolls`. More to the point, the doughs are not the
same — fatayer's is enriched with yogurt and oil so it folds without cracking, sambousek's
is short and unleavened so it fries crisp, and manakish's is the pita dough rolled thicker
and not puffed. Collapsing them would be a shortcut wearing the dish's name, which criterion
6 forbids in as many words.

## Shelving: which files name a second counter

Two, and both because another gap doc asks for them in writing:

- **`baklava`** — `docs/gaps/bakery.md:79`, "sold at the Arabic bakery beside the dip case
  (see also Shawarma Counter)". Counters: `Shawarma Counter, Bakery`.
- **`manakish`** — `docs/gaps/bakery.md:69`. Counters: `Shawarma Counter, Bakery`.

The other twenty-one name **Shawarma Counter and nothing else**. That is a deliberate floor,
not an accident: exclusivity lands at 36, well clear of the 18 required, and no dish is
shelved at a second counter merely to look generous.

Nothing here is an edit to a file another ticket owns, so **T-001-18's artifact gets no
entry from this ticket**. Research checked all 60 candidate slugs and none existed.

## Rejected: writing the Greek set (items 15–19)

`halloumi`, `saganaki`, `horiatiki`, `melitzanosalata`, `taramosalata`, `tirokafteri`,
`fava`, `spanakopita`, `loukoumades`, `ezme`, `haydari`, `zaalouk`.

**Deferred, not refused.** `docs/knowledge/counters.md` says outright that if enough Greek
recipes accumulate — naming avgolemono, spanakopita, saganaki, loukoumades — the right move
is to **split out a Gyro Shop**. Writing nine Greek files into a counter that a maintainer
may be about to split is a decision this ticket should not make on its own. Item 14 is a
clean stopping line: everything above it is Levantine and unambiguously this counter's.
The deferral and its reason go in `progress.md` and `review.md`.

## Verification approach

`node scripts/check-recipes.mjs --labels recipes/<folder>/<slug>.cook` per file, read for
three things and not one: `ok`, the printed staircase reading as verbs, and no `cooklang:`
warning underneath. Then a whole-collection run to prove nothing else moved. Detail in
`plan.md`.
