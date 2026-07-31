# T-002-04 — Review

Fourteen new recipes on the One Pot shelf, five commits, no existing file touched.

## What changed

Created, all new, all under `recipes/**`:

```
recipes/eggs/shakshuka.cook
recipes/eggs/tortilla-espanola.cook
recipes/noodles/beef-stroganoff.cook
recipes/pasta/one-pot-pasta.cook
recipes/pasta/skillet-lasagna.cook
recipes/rice-beans-and-grains/arroz-con-pollo.cook
recipes/rice-beans-and-grains/paella.cook
recipes/soups/gumbo.cook
recipes/soups/sancocho.cook
recipes/stews-and-braises/chicken-and-dumplings.cook
recipes/stews-and-braises/chicken-cacciatore.cook
recipes/stews-and-braises/new-england-boiled-dinner.cook
recipes/stews-and-braises/ratatouille.cook
recipes/stews-and-braises/sausage-and-peppers.cook
```

Modified: none. Deleted: none. `src/data/counters.json`, `docs/gaps/one-pot.md` and every
pre-existing `.cook` are untouched.

Commits: `6fd3fd0`, `82ad1f2`, `7caa69e`, `2dfa3eb`, `05e0f71` — all through
`lisa commit-ticket` with exact `--include` paths.

## Against the acceptance criteria

| criterion | result |
|---|---|
| ≥ 12 new `.cook` files naming `counters: One Pot` | 14. `grep -L` finds none missing the line. |
| ≥ 6 skillet dinners | 6: shakshuka, skillet-lasagna, tortilla-espanola, chicken-cacciatore, beef-stroganoff, sausage-and-peppers. `one-pot-pasta` is a seventh if one is rejected. |
| one vessel start to finish, named per file in the artifact | Each file names exactly one `#…{}` and uses it throughout; the vessel for each is tabulated in `progress.md`. |
| top of the gap list, in order, skips named | Ranks 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 written in order. Ranks 5 and 6 skipped with reasons; ranks 17–20 are past the count and also named. |
| nothing written that already exists | All twenty ranked dishes were checked by slug and by a grep of every `title:` and `aka:` line before writing. None existed. Nothing to hand T-002-08 beyond the fourteen. |
| no pressure-cooker recipes | `grep -ilE 'pressure|instant pot|kit:'` over the fourteen is empty. |
| `check-recipes.mjs --labels` ok, staircase reads as verbs | ok for all fourteen; every label opens with a cook's verb (see the reword below). |
| every timer named; full metadata | `grep -l '~{'` empty; `title`, `category`, `tags`, `servings`, `counters`, `aka` present in all fourteen. |
| only `recipes/**`, no existing file edited | Confirmed by the commit contents and `git status`. |

## The two skips, stated plainly

**Red beans and rice (rank 5)** and **étouffée (rank 6)** are not written. Both are a pot plus a
pot of rice: the dish as a person eats it needs a second vessel, which is the ticket's own
colander case in a different hat. The ticket says a short shelf beats a shelf that lies, so they
are named here rather than written or renamed into components.

Gumbo (rank 2) *is* written on the other side of that same line: a bowl of gumbo is dinner as it
stands, and its file says so in the closing line — rice under it is the cook's call and the
recipe's pot is finished without it. If a reviewer disagrees, the disagreement is with gumbo's
last paragraph, not hidden in the method.

## Test coverage

`.cook` files are data; `scripts/check-recipes.mjs` is the harness the repository already has for
them, and `npm run verify` runs it over everything plus the unit suite and the build.

- `check-recipes.mjs --labels` on each of the fourteen: **ok**, 5–7 columns each, 5–18 rows each.
- `npm run verify`: `all 551 file(s) draw a table`; **717 of 718 tests pass**; `astro build`
  reached.
- No new unit tests were added, and none are wanted: there is no new code here, and a test that
  asserted the contents of a recipe would be a copy of the recipe.

**Gap worth naming:** nothing mechanically checks the ticket's actual promise — that a cook ends
up washing one pot. The checker verifies the table draws; the one-vessel claim is held by reading
each file and by the `#…{}` count, which is what `progress.md` records. If this shelf grows, a
check that fails a file naming two pieces of cookware while claiming `One Pot` would be worth
having, and it belongs to whoever owns the counter rather than to a writing ticket.

## Open concerns

1. **`icons.test.ts` is red on this branch, and not from these files.** The test requires every
   verb a label opens with to be in `VERB_ICONS`. Ten labels here originally fell through; they
   were reworded in `05e0f71` (`sofrito 8 min` → `sweat the sofrito 8 min`, `roots in, 20 min` →
   `simmer the roots 20 min`, and eight more, listed in `progress.md`). The eight verbs still
   falling through — `cold`, `dry`, `full`, `molasses`, `natural`, `potatoes`, `pressure`,
   `vegetables` — all come from `*-instant-pot.cook` files written in parallel by T-002-02 and
   T-002-03. The fix is a handful of entries in `src/lib/icons.ts`, which no writing ticket may
   touch; it needs an owner. Flagging, not blocking: this ticket's own contribution to that list
   is zero.
2. **Section assignment is advisory.** The `.cook` format has no section field, so the shelf
   sections in `progress.md` are a handoff to T-002-08, not something the build reads. If T-002-08
   shelves `one-pot-pasta` under Skillet dinners instead of Rice and grains that cook in, nothing
   breaks and the skillet count goes to seven.
3. **Paella cannot promise the socarrat.** The file says spread the rice thin, do not stir for the
   last stretch, listen for the crackle, and stops there. The gap file is right that a table
   cannot hold a heat gradient, and the recipe does not pretend otherwise.
4. **`tortilla-espanola` uses a bowl and a plate.** Eggs are beaten in a bowl, the potato is lifted
   in with a slotted spoon, the oil is poured off rather than strained, and the tortilla is turned
   out on a plate. That is the ticket's explicit carve-out ("a plate is not a pot") and it is
   stated in the file's opening line so a cook knows before starting. It is the one file on the
   shelf where a reasonable reviewer could rule the other way.
5. **The roux lives inside `gumbo.cook`.** `docs/gaps/one-pot.md` wants a dark roux and a trinity
   base as components. Writing them as separate files would have created a component this ticket
   does not own and a dangling ingredient reference, so they are steps 3 and 4 of the gumbo — made
   in the gumbo pot, which is also the honest method. When the component ticket lands, this file
   is what it factors out of.

## What a reviewer should look at first

`recipes/soups/gumbo.cook` — the roux timing, and its closing paragraph about rice, which is where
the shelf's boundary is argued. Then `recipes/noodles/beef-stroganoff.cook`, which is the one dish
here that had to be written differently from how it is usually written in order to belong at all.
