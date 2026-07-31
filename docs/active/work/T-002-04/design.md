# T-002-04 — Design

Decisions, with what was rejected. Grounded in `research.md`.

## Decision 1 — How far down the ranked list to go, and what to do about the two that fail

**Chosen: write 14 files, taking `docs/gaps/one-pot.md` ranks 1–16 in order, skipping rank 5 (red
beans and rice) and rank 6 (étouffée) with the reason recorded.**

The acceptance criteria set a floor of 12 and require the top of the ranked list "in that order,
as far as the count reaches", with skips named. Fourteen clears the floor with two files of
margin, reaches rank 16, and stops before the ranks that need components this ticket is not
writing.

Rejected — **write all of ranks 1–12 as listed, including 5 and 6.** Both are a pot plus a pot of
rice. Red beans go on rice; étouffée *is* a sauce and is nothing without the rice under it.
Writing them would put a file on the shelf whose cook ends up washing a rice pot, which is the
exact failure the ticket says is worse than the shelf being short. Marketing calls both one-pot;
the washing-up does not.

Rejected — **write them as "red beans" and "shrimp étouffée sauce", renamed to dodge the rice.**
That is a shelf trick, not a dish. A visitor looking for red beans and rice would find a
component wearing the name of a dinner. Better to leave the hole visible and named.

Rejected — **push on to ranks 17–20 for a bigger number.** Rank 17 (kedgeree) needs
`smoked-haddock`, which does not exist and is a `cured-fish/` component, not a One Pot file. Rank
18 (chicken and biscuits) is rank 1's pot with a different lid and would read as a duplicate table
next to it. Rank 19 (bigos) is recorded as the Deli's rank 8 and is that ticket's to claim. Rank
20 is a variant of an existing file, which is shelving work. Fourteen honest files beat eighteen
where four are argued.

## Decision 2 — Which six are the skillet dinners

The shelf's thin section needs six. Chosen, all literally cooked in a skillet from start to
finish, all protein-plus-aromatics-plus-something-starchy in the one pan:

1. `shakshuka` — eggs poached in the pepper sauce they were cooked in (rank 4)
2. `skillet-lasagna` — noodles broken into the sauce (rank 9)
3. `tortilla-espanola` — potato and egg, flipped in the pan (rank 10)
4. `chicken-cacciatore` — thighs braised down in the pan they browned in (rank 11)
5. `beef-stroganoff` — noodles simmered in the beef's own broth (rank 12)
6. `sausage-and-peppers` — one skillet, three things (rank 13)

`one-pot-pasta` (rank 8) is written in a deep skillet and is a seventh candidate; it is recorded
under **Rice and grains that cook in** because the section's defining move — the liquid becoming
the dish — is precisely what it does, and because the six above already satisfy the criterion
without it. If a reviewer disagrees with any one of the six, it is the replacement.

Rejected — **counting `arroz con pollo` or `paella` as skillet dinners** to pad the number. Both
are rice dishes cooked in a wide pan; putting them in the skillet section would leave the rice
section as thin as the skillet section is now, having moved the problem rather than fixed it.

## Decision 3 — Beef stroganoff cooks its noodles in

Rank 12 as normally written is beef in sour cream over separately boiled egg noodles: two pots.
The version written here simmers the noodles in the beef stock in the skillet until they take up
the liquid, then folds sour cream in off the heat. This is a real and common weeknight dish, not
an invention, and it is the only stroganoff that can honestly carry `counters: One Pot`.

The gap file singles out this dish as "the one … finished with sour cream off the heat, which is
worth one table saying out loud" — so the last operation is its own step, labelled to say off the
heat, rather than folded into the simmer.

Rejected — **stroganoff over noodles with a note that the cook may boil them separately.** A note
does not unwash a pot.

## Decision 4 — Gumbo is written; the roux is a step, not a file

Gumbo is rank 2 and the reason the Louisiana line exists. It stays on the shelf because the pot is
complete: a bowl of gumbo is a dinner, and rice is how it is often served rather than how it is
made. This is the difference from étouffée, where the rice is the entire starch of the plate.

The dark roux is written as the first two operations of the gumbo file — flour and fat taken to
milk chocolate, then the trinity dropped in to stop it — rather than as a separate
`recipes/sauces-and-gravies/roux.cook`.

Why: a roux file would be a component this ticket does not own (the gap file lists it under
"components it would need", and `docs/gaps/README.md` schedules it), and referencing a
not-yet-written file as an ingredient would leave a dangling name. Writing the roux inside the
gumbo also keeps the one-pot claim literal — the roux is made *in the gumbo pot*, which is the
whole technique. When the component ticket lands, this file is what it will be factored out of.

The roux timer is `~stir{35%min}`, which `time.ts` reads as hands-on. Naming it `~cook{…}` would
fall through to the default and, worse, a `~simmer{…}` would promise a cook they can walk away
from a pan that scorches in seconds.

## Decision 5 — One counter per file: `One Pot`

Every new file names `>> counters: One Pot` and nothing else, even where the dish plainly also
belongs at the Diner (stroganoff, boiled dinner), the Pizzeria (cacciatore, sausage and peppers)
or the Taquería-adjacent boards (sancocho).

Why: those boards are `sections` lists in `src/data/counters.json`, and a recipe naming a counter
whose sections do not list it shows up in `scripts/menu-sections.mjs` as *listed but not shelved*.
Claiming another counter from this ticket would either create that noise or require editing
`counters.json`, which the ticket forbids (`recipes/**` only). Cross-shelving is T-002-08's job
and it has the whole board in front of it.

Rejected — **naming the second counter anyway and letting T-002-08 clean up.** It inverts the
dependency: this ticket would be handing a downstream ticket a mess to notice.

## Decision 6 — House style: prose header, verb-staircase overrides, prose footer

Each file follows the shape of the newer written files (`smothered-pork-chops`, `corned-beef`):

- an opening prose step, no ingredients, which becomes the full-width header row and says the one
  thing about the dish a cook needs before starting (usually *why* it is one pot);
- four to six operation steps, each with a `>> step.N:` override giving a verb-first label
  ("brown 8 min", "simmer covered 25 min", "fold in off the heat") so the printed staircase reads
  as a cook's verbs rather than as a stripped sentence;
- a closing prose step, which becomes the footer row, for the thing that is usually got wrong.

Why override every operation label rather than let `cleanLabel` derive them: derived labels are
reliable only when the sentence happens to strip cleanly, and the acceptance criterion is about
what the `--labels` staircase reads like. Overriding is the format's own supported way to say it.

Rejected — **deriving labels and only overriding the mangled ones.** That is how `beef-stew` ended
up with two overrides out of seven and a staircase that changes register halfway down.

## Decision 7 — Ingredient references name the thing, not "mixture"

References are written as `@&(~1)browned chicken{}`, `@&(~1)roux{}`, `@&(~1)base{}` — the state
the pot is in at that point. It costs nothing, and it is what makes the middle of the table
readable when the file is long.

## Decision 8 — Vessels, declared per file

Every file names its vessel with `#…{}` in the step where cooking starts, and the same vessel for
the whole file. The vessel per dish (also tabulated in `structure.md`):

- Dutch oven: chicken and dumplings, gumbo, arroz con pollo, ratatouille
- Large skillet / cast-iron skillet: shakshuka, one-pot pasta, skillet lasagna, cacciatore,
  stroganoff, sausage and peppers
- Nonstick skillet: tortilla española (the flip is the whole reason)
- Wide shallow pan: paella
- Stockpot: New England boiled dinner, sancocho

No file names a second vessel, and no file names a pressure cooker, an Instant Pot or a
`>> kit:` line — those belong to T-002-02 and T-002-03.

## Decision 9 — Guard against "one operation is a list"

The checker rejects a file whose table is a single merge, and several weeknight one-pot dishes are
genuinely "everything in, simmer". The two at risk here are `sausage-and-peppers` (three
ingredients, one pan) and `ratatouille` (vegetables, one pot). Both are written the way they are
actually cooked — sausage browned and removed to a plate, peppers softened in the fat, sausage
returned; each vegetable given the pan in the order it needs — which is four operations and is
also the honest method, not padding.

## What this does not decide

- Where each file is shelved in the counter's five sections: recorded in `structure.md` and
  carried into `progress.md`, for T-002-08.
- Whether the oven-and-stove files (`baked-ziti`, `boston-baked-beans`, `gigantes-plaki`) belong
  on this shelf: that is a shelving argument about existing files, so T-002-08's.
- The socarrat. `paella` says *do not stir or touch it for the last eight minutes* and stops there;
  the gap file is right that a table cannot hold a heat gradient, and the file does not pretend.
