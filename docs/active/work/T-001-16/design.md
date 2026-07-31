# T-001-16 — Design

## The decision in one line

Write the **croissant family** — a yeasted laminated dough as its own table, three shaped items
that start from it, and the frangipane one of them needs — plus the **pineapple bun**, which is
the next entry on the gap list that is still genuinely missing. Six new `.cook` files, five of
them Bakery and nothing else.

## What has to be true when this is done

- Bakery shelves ≥ 97. It shelves 99 today, so any addition keeps this true.
- Bakery-only ≥ 62. It is 58 today. **This is the only binding number: +4 exclusive, minimum.**
- The dishes at the top of `docs/gaps/bakery.md` are written in that order, as far as the count
  reaches; anything skipped is named with a reason.

Item 1 on that list is the croissant. Item 2 is already written. Item 3 is the pineapple bun.
So "in order, as far as the count reaches" means: finish item 1 completely, then take item 3.

## Option A — four cheap Bakery-only recipes off the middle of the list

Pick four absent items that need no new components: black-and-white cookie (#10), blueberry
muffin and scone (#19), bialy (#11). All are single-table, all are unambiguously Bakery-only,
all would clear the count in an afternoon.

**Rejected.** It clears the number and fails the criterion. The acceptance text is explicit that
the dishes are taken *from the top, in that order*. The gap doc's own framing — "the loudest
absence on the site's largest counter" — is about the laminated case, and skipping it to bank
four cookies is exactly the shortcut the ticket's "the method is the canonical one for the dish
rather than a shortcut wearing its name" clause exists to prevent, applied at the board level
rather than the recipe level.

## Option B — croissant as one table

One `croissant.cook`: mix dough, make butter block, laminate, fold, chill, roll, cut, shape,
proof, wash, bake.

**Rejected**, and the gap doc rejects it first:

> Lamination is a loop — fold, chill, turn, fold, chill, turn — not a chain of distinct
> operations, and the finished dough is then cut into a dozen crescents.

Mechanically it also breaks. The three folds are the *same* operation repeated, so they either
collapse into one cell that lies about the work or become three near-identical cells that lie
about there being three distinct things to do. And a single dough that becomes croissants *and*
pain au chocolat *and* almond croissants is one step flowing into three later steps, which
`buildTree` throws on by design.

## Option C — dough as its own table, shaped items start from it (**chosen**)

Five files for gap item 1:

1. `croissant-dough.cook` — détrempe, butter block, three letter folds with a chill between,
   overnight rest. Ends where a dough recipe ends: a rested sheet ready to be cut.
2. `croissant.cook` — takes the finished dough in as an ingredient, cuts triangles, rolls,
   proofs, washes, bakes.
3. `pain-au-chocolat.cook` — same, with batons.
4. `almond-croissant.cook` — day-old croissants, syrup, frangipane, sliced almonds, re-baked.
5. `frangipane.cook` — the almond cream #4 needs, and #7 (fruit tart) and bakewell will need.

Then gap item 3:

6. `pineapple-bun.cook` — bo lo bao: enriched bun dough on one branch, the cracked sugar lid on
   the other, merged at the shaping step.

### Why this is the right split

- **It is the collection's existing precedent.** `hojaldre.cook` is a laminated dough as its own
  table, with `orejas` and `campechanas` as separate files that start from a sheet of it. The
  croissant family is the same shape with yeast in the dough. Following it means the two
  laminated doughs on the site read as siblings rather than as two people's guesses.
- **It satisfies the tree.** Each shaped item takes the dough as a plain leaf ingredient
  (`@croissant dough{1%batch}`), the way `egg-custard-tart` takes `@blind-baked tart shells{12}`.
  No step is reused; `pairs-with:` carries the relationship instead, and the build makes it
  mutual in both directions.
- **It is honest about the work.** Someone making croissants on a Sunday makes the dough on
  Saturday. Two tables is what the day actually looks like.

### Why the dough is not just "use hojaldre"

`hojaldre` is puff pastry: no yeast, no proof, four turns, lift entirely from steam. A croissant
is a yeasted laminate — the dough ferments, the shaped crescents proof for two hours before they
see the oven, and it takes *three* folds, not four, because a fourth thins the layers past the
point where yeast can push them apart. Substituting one for the other produces a palmier in the
shape of a crescent. Writing it as a separate dough is not duplication; the two are different
doughs that happen to share a folding technique.

## Counter assignment, decided per dish

| File | `counters:` | Why |
|---|---|---|
| `croissant-dough` | Bakery | Nowhere else on the board laminates. |
| `croissant` | Bakery | — |
| `pain-au-chocolat` | Bakery | — |
| `almond-croissant` | Bakery | — |
| `frangipane` | Bakery | A bakery component; no other counter uses almond cream. |
| `pineapple-bun` | Bakery, Dim Sum Counter | Sold from the till case at both. `chiffon-cake` and `sweet-tart-shell` already sit at both for the same reason, and `egg-custard-tart` — the closest kin — is `Dim Sum Counter, Bakery`. |

Five exclusive → **58 + 5 = 63 ≥ 62**. Shelved → **99 + 6 = 105 ≥ 97**.

Giving `pineapple-bun` a second counter costs nothing against the target and is the honest
answer. Trimming it to Bakery alone to bank a sixth exclusive would be gaming the number.

## Categories, decided per file

`pastry-and-doughs` for `croissant-dough` — it is a dough, and it sits beside `hojaldre`.

`pastry-and-doughs` for `croissant`, `pain-au-chocolat`, `almond-croissant`. The alternative is
`breads/`, and it was considered: they are yeasted, and `breads/` holds `brioche` and
`cinnamon-rolls`. Rejected because the thing that defines all three is the lamination, not the
yeast — they belong with the dough they come from, the way `orejas` sits with `hojaldre`.
Viennoiserie is a pastry case, not a bread rack.

`custards-and-puddings` for `frangipane`, beside `pastry-cream`, `creme-anglaise` and
`lemon-curd`. It is a filling made from eggs, sugar and fat, and those three are its shelfmates
in every case in the world. `pastry-and-doughs` was considered and rejected: frangipane is not a
dough and would be the only thing in that folder that is not one.

`breads/` for `pineapple-bun` — it is an enriched roll with a lid on it, and `hot-cross-buns`,
`conchas` and `dinner-rolls` are already there.

No new category folder is needed. The ticket allows one for "a genuinely new kind of thing"; a
yeasted laminate is not one, given `pastry-and-doughs` exists and already holds a laminate.

## What is deliberately not written, and why

- **Bo lo yau** (pineapple bun with butter, gap #3). It is a finished bun cut open with a cold
  slab of butter in it. As a table it is one operation and two rows — under both floors in
  `check-recipes.mjs`, and the gap doc's own "Bread by the slice count … the knife is the
  customer's" covers it. Named in the work artifact.
- **Danish, éclair, cream puff, fruit tart, turnover, doughnut** (gap #5–9). Below the line the
  count reaches. Each needs a component of its own (danish dough, choux, an enriched fried
  base), which is another ticket's worth of work, not a tail on this one.
- **`counters.json` section lists.** New recipes reach the Bakery page through `>> counters:`.
  Adding them to the printed sections is an `src/` edit and belongs to T-001-17.
- **`pairs-with` edits to existing files.** `pairs-with` is made mutual at build time, so
  pointing `croissant` at `croissant-dough` is enough; no file another ticket owns is touched.

## Risks

- **`~N` reference drift.** The count is over all content steps including prose-only paragraphs.
  Mitigation: no prose-only paragraphs; every note lives inside the step it annotates, as
  `hojaldre` and `egg-custard-tart` do.
- **The repeated fold collapsing into one indistinct cell.** Mitigation: `hojaldre` solves it
  with one step whose label says "— four times in all" and whose text says where the loop is.
  Same device, three turns.
- **Concurrent tickets in `recipes/`.** Mitigation: exact `--include` paths on every
  `lisa commit-ticket`, never a folder or a glob.
