# T-007-04 — Design

Six decisions. Each is grounded in something Research found, and each says what was rejected.

---

## D1. The `&` question, and therefore the shape of 焗豬扒飯

**The ticket asks for something the codebase cannot do.**

> *"If it needs more than six operations it is two files — a tomato sauce that several plates
> share, and the assembly."* … *"Any dish written as two files (a shared sauce plus an assembly)
> has the assembly consuming the component via `&`."*

Research §4 proved by running the parser that `@&(…)` only becomes a tree edge when
`reference_target === 'step'`. A cross-file reference (`@./sauces-and-gravies/x{}`) parses as an
ordinary ingredient definition and `scripts/normalise.mjs` never looks at its `reference` field. An
ingredient back-reference (`@&x{}`) is dropped for the same reason. **There is no way for file B to
consume file A via `&`.** The collection's real two-file pattern is `margherita` →
`@pizza dough{2%balls}(250 g each; from the recipe on this shelf)` plus `pairs-with: pizza-dough`,
which is an ingredient row and a pointer, not a `&`.

So the two halves of the criterion can only both be satisfied by **one file** in which the sauce is
a step and the assembly consumes it with `@&(~1)tomato sauce{}`.

**Decision: 焗豬扒飯 is one file, at five operations.**

1. season and rest the chops · 2. fry the chops · 3. build the tomato sauce in the same pan ·
4. fry the rice with egg · 5. lay it up and bake

Five, under the six-operation ceiling, so the ticket's own trigger for splitting ("*if* it needs
more than six operations") never fires. The sauce is a step, consumed by step 5 via `&`, which is
exactly what the criterion asks for and is how `borscht`, `har-gow` and `club-sandwich` are already
built.

**Rejected — 茄汁 as its own `sauces-and-gravies/` file.** It would have to be consumed as a plain
ingredient row, which fails the criterion it was meant to satisfy; and it would put a component in
the "Also here" section that T-007-05 is required to keep empty. The work list's own answer to
"several plates share this sauce" is not a component file — it is **rank 11, 茄汁豬扒**: *"the pan
version of rank 14, and much the easier one… Writing this first gives the baked one its sauce."*
The sharing is between two dishes, and the mechanism the collection has for that is `pairs-with`.

**Rejected — pulling `egg-fried-rice` in as the base and shortening the file.** `egg-fried-rice` is
a wok dish with scallions and peas at the Takeout Counter; the rice under a baked pork chop is
plainer and is fried in the chop's own fat. Rewriting an existing file is explicitly out of scope,
and referencing it would cost the same operation the in-file version costs. It gets a `pairs-with`.

**Consequence, recorded for the reviewer:** no dish in this ticket is written as two files, so the
"both files argued in the work artifact" half of that criterion is satisfied by this section
arguing why there are none.

## D2. 咖喱汁 stays inside 咖喱牛腩

Same mechanism, different judgement, because here the work list *does* say the sauce "earns a file"
(rank 13).

**Decision: one file, `curry-beef-brisket`, with the curry sauce built in steps 2–3 and consumed
via `&`.** Not a standalone `hong-kong-curry-sauce`.

The work list gives the sauce three consumers: 牛腩, 魚蛋, and a pork chop. Of those:

- **魚蛋** is rank 19 and the work list itself flags it as *"blocked on an ingredient that is
  genuinely one-shop in most cities, which is exactly the failure mode S-007 is correcting for"* —
  so it is not being written (D5).
- **the pork chop** is already served by 茄汁豬扒, which is a tomato dish, not a curry one.

That leaves one consumer. A component file with one consumer, which the consumer cannot reference
with `&` anyway, is a file that exists to be listed rather than cooked — and it would land in the
"Also here" section T-007-05 must keep empty. Recorded as a note for T-007-05: if 咖喱魚蛋 or
焗葡國雞飯 are ever written, 咖喱汁 earns its file then.

Operation budget: 1. blanch the brisket · 2. fry the aromatics and curry powder · 3. simmer 2 hr ·
4. finish with coconut milk · 5. over rice. Five.

## D3. The three-way choice the work list never made

The ticket asks for *"whichever of 白汁海鮮焗飯 / 滑蛋蝦仁飯 / 揚州炒飯 the work list ranked."*
Research §5: **the work list ranked none of the three.** The instruction has no answer as written,
so it is a judgement, and here is the argument.

**Decision: 滑蛋蝦仁飯.**

- It is the only one of the three whose technique the work list ranks, and ranks *high*: **rank 6,
  滑蛋** — *"beaten with evaporated milk and a little cornflour, cooked low and pulled off wet…
  it is the technique four other ranks depend on."* Writing the plate writes the technique, and
  the technique is what the shelf actually needed.
- Evaporated milk in a savoury egg is the shelf's whole sourcing argument in one row, and no
  other file in this ticket carries it.
- Prawns are supermarket freezer goods anywhere.

**Rejected — 揚州炒飯.** Not a cha chaan teng dish so much as a Cantonese restaurant one, and
`egg-fried-rice` already draws that table. Writing it would be a near-duplicate of an existing file
on a different counter, which is the failure the gap page's `lo-mein` refusal exists to prevent.

**Rejected — 白汁海鮮焗飯.** It is a second baked-rice plate, and the work list reserves that shape
for **rank 23, 焗葡國雞飯**, with an explicit ordering: *"write it only after rank 14 exists so it
can share the shape."* Rank 14 exists as of this ticket and no further. Its 白汁 is `bechamel`,
which the gap page calls *"a pairing, not a new component"* — so the honest move is to leave the
shape to whoever writes rank 23.

## D4. The wok, and what a home burner gives up

**Decision: write 豉油皇炒麵, and say in the file what is different.**

The ticket offers both doors — write the home version and say what it gives up, or rank it out with
a reason. The gap page's rule ranks a saucepan-and-supermarket dish above a wok one, but
豉油皇炒麵 is *four ingredients and a hot pan*, not 乾炒牛河. Research §6 found that
`beef-chow-fun` — the file the ticket said might already have settled this — **has not**: it says
*"over the fiercest heat you have"* and carries no slack line and no disclaimer. So nothing in the
collection has settled it, and this file settles it for itself.

It gets both surfaces:

- **a full-width prose row** at the top saying what a domestic burner cannot do. That row prints
  three times and costs 3× its length, so it earns the spend only because it is the one thing a
  cook must know before starting.
- **`slack: narrow`**, naming the *failure* rather than repeating the frame — a crowded pan steams
  the noodles instead of browning them, and once they are wet they will not come back.

Two surfaces, two different jobs, which is the test `docs/knowledge/voice.md` sets.

**乾炒牛河 is not written.** It is rank 24, already exists as `beef-chow-fun`, and the work list
calls it *"a shelving job… the least useful thing this shelf could spend a ticket on."*

## D5. What is deliberately not written, and why

| Dish | Rank | Why not |
| --- | --- | --- |
| 咖喱魚蛋 curry fish balls | 19 | The work list: *"blocked on an ingredient that is genuinely one-shop in most cities."* Written up here rather than committed, which is what the acceptance criterion asks for. |
| 焗葡國雞飯 baked Portuguese chicken rice | 23 | *"write it only after rank 14 exists so it can share the shape."* Rank 14 exists now; this is the next writer's file, and it is the second baked plate rather than the first. |
| 撈丁 dry instant noodles | 22 | Same packet as 餐蛋麵, drained. Two instant-noodle files on a fourteen-file shelf reads as one dish twice, which is the exact criticism S-007 makes of The Soup Pot. Recorded for T-007-05 as a real board item that is not here. |
| 乾炒牛河 | 24 | Exists as `beef-chow-fun`. Shelving job. |
| 西多士, 奶油多, 菠蘿油, every drink | 1–4, 12, 20 | T-007-03's. |
| 滑蛋 on its own | 6 | Written as the technique inside 滑蛋蝦仁飯 (D3) rather than as a bare egg file, because a plate of soft egg with nothing under it is three ingredients and would not draw a table with three operations. |

## D6. How each file answers the two traps

**Trap one — luncheon meat is an ingredient.** Three files name the tin outright and none of them
softens it:

- `luncheon-meat-and-egg-noodles` (餐蛋麵) — `@tinned luncheon meat{}`
- `luncheon-meat-and-egg-sandwich` (餐蛋治) — the same row
- `ham-macaroni-soup` (湯通粉) — takes **ham**, because that is what 火腿通粉 means; the luncheon-meat
  version is 餐肉通粉 and goes in `aka`, not in a substitution note.

No file writes "or good-quality ham" beside a tin. A reader who wants to substitute will.

**Trap two — a shared English name is almost never a shared dish.** Two files in this set collide
with something already in the collection, and both get the same treatment: the old name in `aka`,
and **one line of prose saying what it is not**. That line goes in a full-width prose row, because
that is the only surface that renders words the cook reads before starting — a `step.N:` label is a
verb and its numbers, and a step body is rendered nowhere at all.

| New file | Collides with | The line says |
| --- | --- | --- |
| `hong-kong-borscht` (羅宋湯) | `borscht` — 1½ lb grated beetroot, Ukrainian | no beetroot; the name arrived through Shanghai |
| `soy-sauce-pan-fried-noodles` (豉油皇炒麵) | `lo-mein` shares the "tossed noodles" idea in English | *not* claimed as a collision — different English name, so no line needed. See below. |

Checked the rest against the collection and found no further English-name collisions:
`ham-macaroni-soup`, `luncheon-meat-and-egg-noodles`, `satay-beef-noodles`, `baked-pork-chop-rice`,
`pork-chop-in-tomato-sauce` (nearest is `smothered-pork-chops` — a different name and a different
dish), `curry-beef-brisket` (nearest is `japanese-beef-curry`), `minced-beef-rice`,
`shrimp-and-egg-rice`, `hong-kong-egg-sandwich`, `luncheon-meat-and-egg-sandwich`, `pork-chop-bun`,
`swiss-wings`. `hong-kong-egg-sandwich` is the one worth watching — there is no `egg-salad-sandwich`
in the collection today, so it collides with nothing, but it would if one were written later. Noted
for T-007-05's duplicate-name pass.

## D7. Metadata rules applied uniformly

Settled once here so fourteen files do not each decide:

- **`>> counters: Cha Chaan Teng`** on every file, and only that counter. Naming a second counter is
  a shelving judgement and T-007-05 owns shelving.
- **`aka` carries three kinds of thing**, in this order: the Cantonese romanisation (unaccented, as
  `docs/knowledge/counters.md` writes them), the characters, then the plain-keyboard English an
  English speaker would type — including the mangled board spellings the gap page found on real
  menus (*Borsch Soup*, *Spam & Egg Sandwich*, *Baked Pork Chop Over Rice*). The gap page's closing
  caution says the romanisations were compiled to save a lookup and are not to be trusted blind;
  every one used here is cross-checked against the `counters.md` vocabulary table, and where that
  table has no entry the form is written the same way the table writes its neighbours.
- **`pairs-with` never points outside this ticket's files plus files that already exist.** A
  pairing at a slug that is not in the collection is a build error, and T-007-03 is writing in
  parallel — so no file here pairs with a milk tea. Where a dish wants tea, it is a note for
  T-007-05 (per the ticket) and nothing else.
- **`dish` / `kit` are not used.** Nothing here is an equipment variant of anything. 茄汁豬扒 and
  焗豬扒飯 are two board rows, not two ways to cook one thing, and setting `dish` on them would trip
  the "at most one plain way to cook a dish" invariant in `src/lib/collection.test.ts`.
- **`slack` only where the file can name a real failure.** Expected on the fried noodles, the soft
  egg, the baked rice and the macaroni; expected absent on the sandwiches and the brisket, which
  have wide windows and nothing to warn about. A file with no honest failure leaves the line off,
  which the README calls a legitimate answer.
- **Every timer named.** `~fry`, `~simmer`, `~bake`, `~rest`, `~boil`, `~poach`.
- **5 to 16 ingredient rows, 3 to 6 operations**, every file, no exceptions requested.

## D8. Where these land on the menu — a recommendation, not an edit

T-007-05 owns `src/data/counters.json`. This is the recommendation, and the tension in it is
declared rather than hidden.

| Section | Files |
| --- | --- |
| Macaroni, noodles and things in soup | `ham-macaroni-soup`, `luncheon-meat-and-egg-noodles`, `satay-beef-noodles`, `hong-kong-borscht` |
| Rice plates | `baked-pork-chop-rice`, `pork-chop-in-tomato-sauce`, `curry-beef-brisket`, `minced-beef-rice`, `shrimp-and-egg-rice`, `soy-sauce-pan-fried-noodles` |
| Sandwiches and buns | `hong-kong-egg-sandwich`, `luncheon-meat-and-egg-sandwich`, `pork-chop-bun` |
| Also here | `swiss-wings` |

**The declared tension.** T-007-05's acceptance criteria require the built menu to render **no
"Also here" section**, and `swiss-wings` — rank 10, the highest-ranked thing in this ticket — has no
home in the other six titles. A real board files it under 小食 or 小炒, and neither is a section
title T-007-01 created. That is a placement question for the shelver, not a reason to leave a
rank-10 dish unwritten. Two clean answers exist and both are theirs to take: put it in "Also here"
and accept the section rendering, or retitle "Also here" to the snacks line the boards actually
print. `soy-sauce-pan-fried-noodles` is listed under Rice plates because that is where this ticket
puts it; a board would file it under 粉麵飯 with them.
