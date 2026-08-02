# T-003-06 — Design

Six decisions. D1 is the one a reviewer should spend their time on; the rest follow from it.

---

## D1 — Borrowing: how `dashi`, `miso-soup` and `congee` get onto shelves they do not name

**The conflict, stated once.** Criterion 2 requires `dashi` and `miso-soup` on Japanese Home
Cooking. Criterion 3 requires `congee` on The Soup Pot. Criterion 8 permits only
`src/data/counters.json` and `src/data/aisles.json` to be modified. `menuFor()` looks a section's
slugs up inside the set of recipes that name the counter (research §3), so a listed slug that does
not name the counter is dropped from the page. **Criteria 2, 3 and 8 cannot all hold.** The
ticket's §2 makes it worse, not better: *"A recipe on two boards is normal and correct"* describes
an operation that is, in this codebase, a `>> counters:` edit and nothing else.

### Options

**A. Hold criterion 8. List the borrowings anyway and let them drop.**
`counters.json` would claim `dashi` is on the shelf and the page would not show it — the data and
the render disagreeing, which is worse than either failing cleanly. Criteria 2 and 3 fail.
Rejected: it produces a lie in a file whose whole job is to say what is on a shelf.

**B. Hold criterion 8. Do not list the borrowings at all, and block Review.**
Honest, and it delivers 21 / 28 / 20 correctly-sectioned recipes. But it fails criteria 2 and 3 on
a conflict that was identified, argued and already resolved the other way once on this branch
(T-002-08 §1), by a ticket whose review was admitted. Blocking a second time on the same known
conflict asks a human to re-decide something they have decided. Rejected as the primary path;
retained as the fallback if the `.cook` edits turn out to cost more than a metadata line.

**C. Change `menuFor()` to resolve section items against the whole collection.**
Two lines in `src/lib/counters.ts` would make borrowing work exactly as the ticket describes, and
it is one file instead of thirteen. Rejected on three grounds:
- It is a `src/lib/` change — **further** outside this ticket's ownership than a metadata line,
  and it changes how all 21 counters render, not just three.
- It makes the shelving half-true. `menu.count`, the front-page count, `search.json`, and the
  recipe's own page all read `recipe.counters`. A borrowed `dashi` would appear on the Japanese
  Home board while its own page still said "Ramen Shop" — a visitor who arrived from the board
  would find the page denying it.
- The collection's invariant is currently exact: across all 18 populated counters, every listed
  slug names its counter and every naming recipe is listed. `scripts/menu-sections.mjs` reports
  any other state as an error (`listed but not shelved here`). Option C would make that script
  permanently wrong.

**D. Add one `>> counters:` line to each of thirteen `.cook` files. — CHOSEN.**

### Why D

1. **It is the operation the ticket describes.** "A recipe on two boards" is, in this data model,
   a recipe naming two counters. The edit makes the fact true in every place that reads it: the
   menu, the count, the front page, the search index, and the recipe's own page.
2. **It is the precedent on this branch.** T-002-08 made the same call for the same reason, edited
   119 files, and stated the trade in its review §1. Its §5.7 wrote this ticket's name into the
   handover: *"T-003-06 will hit exactly the wall in §1 … It should read this document before it
   starts."* Deciding it differently now would leave two of five S-002/S-003 shelves built one way
   and three the other.
3. **It is thirteen files, not 119, and one line each.** Every edit is of the shape
   `>> counters: Ramen Shop` → `>> counters: Ramen Shop, Japanese Home Cooking`. Nothing else in
   any file changes, and that is checkable with a one-line `git diff | grep -vc`.
4. **The concurrency argument for criterion 8 has expired.** Criterion 8 exists so two tickets do
   not fight over the same file. T-003-03, T-003-04 and T-003-05 are all sealed; T-003-07
   `depends_on: [T-002-09, T-003-06]` and says *"Nothing runs in parallel with this."* Nobody else
   holds these thirteen files.

**The thirteen, and no others:**

| File | now | after |
| --- | --- | --- |
| `recipes/soups/dashi.cook` | Ramen Shop | + Japanese Home Cooking |
| `recipes/soups/miso-soup.cook` | Ramen Shop | + Japanese Home Cooking |
| `recipes/fried-and-crispy/karaage.cook` | Ramen Shop, The Bowl Shop | + Japanese Home Cooking |
| `recipes/dumplings-and-rolls/gyoza.cook` | Ramen Shop | + Japanese Home Cooking |
| `recipes/flatbreads-and-pancakes/okonomiyaki.cook` | Ramen Shop | + Japanese Home Cooking |
| `recipes/custards-and-puddings/chawanmushi.cook` | Ramen Shop | + Japanese Home Cooking |
| `recipes/stews-and-braises/japanese-beef-curry.cook` | Ramen Shop, One Pot | + Japanese Home Cooking |
| `recipes/sauces-and-gravies/teriyaki-sauce.cook` | Ramen Shop, Takeout Counter | + Japanese Home Cooking |
| `recipes/spice-blends-and-marinades/shichimi-togarashi.cook` | Ramen Shop | + Japanese Home Cooking |
| `recipes/dressings-and-dips/goma-dare.cook` | Ramen Shop, The Bowl Shop | + Japanese Home Cooking |
| `recipes/soups/congee.cook` | Dim Sum Counter, One Pot | + The Soup Pot |
| `recipes/soups/congee-instant-pot.cook` | Instant Pot | + The Soup Pot |
| `recipes/soups/egg-drop-soup.cook` | Takeout Counter | + The Soup Pot |

Every one is **additive**. No recipe leaves a board, so no other counter's sections, counts or
pages change. The Slow Cooker needs **zero** edits: its shelf is exactly the 20 files carrying
`kit: Slow Cooker`, and all 20 already name it.

**If a reviewer disagrees**, reverting the one `.cook` commit restores the recipes exactly as the
writer tickets wrote them. Japanese Home then reads 28 without `dashi` or `miso-soup`, The Soup Pot
reads 21 without `congee`, and criteria 2 and 3 fail. That is the trade, stated plainly.

---

## D2 — Hand-edit `counters.json`, do not regenerate it from the gap notes

T-002-08 regenerated `counters.json` with `scripts/menu-sections.mjs --write`, which reads each
counter's `## What it has` block out of `docs/gaps/<slug>.md`. Doing the same here would require
**rewriting three gap notes** — the notes only carry the pre-existing dishes, not the 69 files the
writer tickets added, and `menu-sections.mjs` deliberately ignores the `## What it is missing`
block those are described in.

`docs/active/tickets/T-003-07` §3 already owns that rewrite: *"Rewrite `docs/gaps/soup-pot.md`,
`docs/gaps/japanese-home.md` and `docs/gaps/slow-cooker.md` against the shelf as it now is."*
The gap notes' own paragraphs say T-003-06 renames the heading; the later ticket says T-003-07
rewrites the file. **The ticket wins over the note it supersedes**, and the smaller reading is the
right one when criterion 8 is already being stretched: hand-write the items into the file this
ticket owns, and leave three documents this ticket does not own to the ticket that does.

This is safe against a later regeneration. `menu-sections.mjs` `continue`s past a counter whose
note has no `## What it has` heading **before** it reassigns `counter.sections`, so the three
hand-written blocks survive `--write` untouched until T-003-07 rewrites the notes.

Mechanically: read the JSON, replace the three `sections` arrays, write back with
`JSON.stringify(file, null, 2) + '\n'` — the exact serialisation the file already has, so the diff
is confined to the three blocks.

---

## D3 — Delete the literal `Also here` section from all three counters

Criterion 1: *"no counter renders an 'Also here' section."* T-003-01 wrote one into each of the
three, and each gap note lists slugs for it.

- **Keeping it and filling it** renders it. Fails criterion 1 outright.
- **Keeping it empty** satisfies the criterion — `menuFor` filters zero-item sections — but leaves
  a section in the data whose only possible use is forbidden, and invites the next pass to fill it.
- **Deleting it — CHOSEN.** A section that must never render has no business in the file. It also
  makes the criterion structurally true rather than incidentally true: there is no `Also here` to
  render. The generated fallback (`title: 'Also'`, `counters.ts:88`) is handled separately by
  placing every member, and verified against the built HTML.

**Consequence for The Soup Pot.** The four slugs the gap note parked in `Also here` —
`wonton-soup`, `hot-and-sour-soup`, `chicken-feet`, `chicken-broth` — have nowhere to go, and are
therefore **not shelved at all**. That is not a dodge: the gap note argues against each of them in
its own words (*"not a home soup in this tradition"*, *"northern by way of an American menu"*,
*"listed here only because chicken feet are the standard body of rank 5"*, *"**not** what these
soups start from"*). The section existed to hold things that did not belong; removing the section
and not shelving them says the same thing more plainly, and it saves four `.cook` edits.

**Consequence for Japanese Home Cooking.** Its eight `Also here` slugs *do* belong — the gap note
says shelve all of them on both boards — so they go into real sections instead. See D4.

---

## D4 — Where the ten Japanese borrowings sit, since there is no `Also here`

The gap note's §2 call is applied as written: the ten below go on both boards, the fifteen ramen
files stay at the Ramen Shop, `japanese-milk-bread` and `castella` stay at the Bakery. What the gap
note does **not** give is a real section for the eight, because it put them in `Also here`. Each is
placed against the section title that describes how the dish is actually made, following the
precedent T-003-04 set with its own files (`hambagu`, deep in Fried & Crispy, went to *Grilled and
pan-fried mains*; `mentsuyu`, a sauce, went to *Made ahead*):

| slug | section | why |
| --- | --- | --- |
| `dashi` | The soup and the rice | the gap note names this section for it |
| `miso-soup` | The soup and the rice | the gap note names this section for it |
| `gyoza` | Grilled and pan-fried mains | yaki-gyōza is pan-fried; that is the whole technique |
| `karaage` | Grilled and pan-fried mains | the mains section, and T-003-04 already routes fried mains there |
| `okonomiyaki` | Rice bowls and one-plate suppers | the gap note calls it *"a home griddle dish"*; at home it is the whole plate |
| `japanese-beef-curry` | Rice bowls and one-plate suppers | カレーライス is a plate of rice with curry on it |
| `chawanmushi` | Small sides (小鉢) | a savoury custard served in its own small cup alongside the meal |
| `teriyaki-sauce` | Made ahead (作り置き) | a bottled sauce; `mentsuyu` sets the precedent |
| `goma-dare` | Made ahead (作り置き) | same — a dressing kept in the fridge |
| `shichimi-togarashi` | Made ahead (作り置き) | the gap note calls it *"pantry, not menu"* |

Resulting section counts: **6 · 6 · 6 · 7 · 7 · 6 = 38**. Criterion 2 needs 25.

---

## D5 — Keep the empty `Stocks` section on The Slow Cooker

T-003-05 deferred every stock to the Instant Pot shelf on the gap file's own ranking and asked
whether the section should exist at all. It renders nothing today (`menuFor` filters it) and it
costs nothing. Keeping it preserves T-003-01's ordering and records that the shelf wants stocks;
deleting it would throw away a finding to save two lines of JSON. Kept, empty.

`Beans and pulses` keeps its single entry (`boston-baked-beans-slow-cooker`) for the same reason —
a one-item section is thin, but it is true, and the alternative is filing baked beans under
braises, which they are not.

`What each thing is for` on The Soup Pot is the gap note's dried-goods glossary, not recipes. Kept,
empty.

---

## D6 — `aisles.json` is not modified

The ticket's §3 says to run the coverage test and add patterns for the real gaps. Run:

```
3/1082 ingredients have no aisle:  flat skewers (1), oak or hickory wood (1), metal skewers (1)
```

0.28 % against a 2 % ceiling, and the whole suite is green at `c0fe6a4`. The reason is recorded in
T-002-08 §6: it placed roughly twenty of this story's patterns itself, because its own criterion
was a green suite, and it says *"T-003-06 should not re-derive them."* Research §8 confirms every
name T-003-03 and T-003-04 handed over is placed, and placed somewhere defensible.

The three that remain are **Smokehouse equipment, not food** — skewers and smoking wood. Options:

- **Add a `hardware` aisle for them.** Rejected: they are not this story's names, not this shelf's
  vocabulary, and inventing an aisle to move a number that is already seven times inside its
  ceiling is exactly the kind of badge-chasing the file's own note warns against.
- **Leave them. — CHOSEN.** They fall through to `other`, which is what `other` is for.

**This ticket adds no recipe, so it adds no ingredient name.** The 1082-name set cannot move as a
result of anything here, and neither can the coverage number. `aisles.json` is left byte-identical,
and the review states that as a fact rather than as an omission. The ticket's three hazards —
a bare word stealing across aisles, a pack size in the wrong system, a wrong aisle for a
herbalist's dried goods — are all hazards of *adding* patterns, and none of them is run.

---

## What this design does not do

- It does not touch `src/lib/counters.ts`, so borrowing still requires a `>> counters:` line, and
  the next shelf ticket will meet the same wall. Review flags it.
- It does not rename `## What is already here` to `## What it has` in the three gap notes, so
  `scripts/menu-sections.mjs` still reports all three as *"no `What it has` block"*. T-003-07 §3.
- It does not touch `panaderia` or `deli`, which carry deliberate `Also here` sections from T-001.
  Criterion 1 is read as scoped to the three counters the ticket is about, as T-002-08 §5.3 read it.
