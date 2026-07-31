# T-001-12 — Review

The Pizzeria had two halves of a Margherita and no Margherita. It now has ten items,
written down the gap list in its own order, and the counter reads as a menu rather than a
sauce shelf.

## What changed

Ten files created, none modified, none deleted. Everything inside `recipes/**`.

| File | Rows × cols | Why it is here |
| --- | --- | --- |
| `recipes/pizzas/margherita.cook` | 8 × 5 | Gap #1 — the most conspicuous absence on the site |
| `recipes/breads/sicilian-pan-dough.cook` | 6 × 5 | The 75%-hydration tray dough gap #2 cannot be written without |
| `recipes/pizzas/sicilian-pizza.cook` | 5 × 5 | Gap #2, the thick square |
| `recipes/pizzas/grandma-pie.cook` | 10 × 5 | Gap #2, the thin square, written beside it as the gap doc asks |
| `recipes/pizzas/white-pizza.cook` | 12 × 5 | Gap #3 |
| `recipes/pasta/baked-ziti.cook` | 10 × 5 | Gap #4 — the site's first baked pasta |
| `recipes/fried-and-crispy/chicken-parmigiana.cook` | 10 × 6 | Gap #5 |
| `recipes/stews-and-braises/meatballs.cook` | 13 × 6 | Gap #6 |
| `recipes/pasta/fresh-egg-pasta.cook` | 8 × 6 | Gap #7 — six sauces finally have something to go on |
| `recipes/breads/garlic-knots.cook` | 10 × 5 | Gap #8 |

Two new category folders: `recipes/pizzas/` and `recipes/pasta/`. Six commits, all through
`lisa commit-ticket` with exact `--include` paths: `8504b2c`, `15fc66b`, `82f0cf3`,
`c83e08a`, `8ef1c16`, `a11429c`.

## Acceptance criteria, one by one

| Criterion | Result |
| --- | --- |
| ≥27 recipes shelve Pizzeria | **32** (`grep -rl 'Pizzeria' recipes/`) |
| ≥20 name it and no other counter | **26** (`grep -rlE '^>> counters: *Pizzeria *$'`) |
| Top of the gap list written in order; skips named with a reason | #1–#8 written in order. #9 skipped with a reason; #10–#21 not reached. Both recorded in `progress.md` |
| `check-recipes --labels` ok for every new file, staircase reads as a cook's verbs | All ten `ok`. Full staircases in `progress.md` |
| `title`, `category`, `tags`, `servings`, `counters`, `aka` on every new recipe | All ten, checked programmatically, not by eye |
| A form typed without diacritics in `aka` | Every `aka` form is already diacritic-free; `pasta all'uovo` is also given as `pasta alluovo` |
| Every timer named | All 34 timers carry a name, and `time.ts` reads a duration off every one |
| Quantities real for the stated servings | See "What a reviewer should check by hand" |
| The canonical method, not a shortcut wearing its name | Same |
| Only `recipes/**` modified | `git status` clean on every path this ticket owns; nothing else touched |

## Test coverage

**Automated, and green:**

- `scripts/check-recipes.mjs --labels` on each of the ten — tiling, the 3-row and
  3-column floors, no empty operation label, counters known. All `ok`, all inside the
  README's 5–16 rows and 3–6 operations.
- A scratch script over the ten using the repo's own `normalise` and `matchOperation`:
  pairings resolve to real slugs, every label has an icon, every timer is named and
  readable, metadata is complete, slugs are unique collection-wide.
- `collection.test.ts` and `layout.test.ts` — **467 passed** (run in an isolated copy of
  the tree; see the caveat below).
- `npm run recipes` — **parsed 448 recipes in 24 categories**, same isolated copy.

**Not automated, and not automatable here:**

- **Quantities.** Nothing in the repo checks that 500 g of dough makes two 12-inch pies or
  that 425 g of ricotta dresses a pound of ziti. Every figure carries both units and is
  scaled off the component recipe's own yield: `pizza-dough` makes four 250 g balls, so the
  Margherita and the white pie take two each, the grandma pie two, the knots one.
- **Canonical method.** The design records the claim per dish and where it came from
  (`docs/knowledge/counters.md`'s Pizzeria table). A reader who cooks is the only check.

## The two red signals a reviewer will see, and what they are

**Neither is this ticket's, and both were measured rather than assumed.**

1. **`npm run recipes` fails in the working tree.** Four other tickets' files declare
   `pairs-with` at slugs not yet written — `chicken-broth` → `matzo-ball-soup`,
   `collard-greens` → `ham-hock-stock`, `corned-beef` → `sauerkraut`, and the untracked
   `schmaltz.cook` → `chopped-liver`. These are the Deli and Meat-and-Three tickets
   mid-flight on the shared branch and they resolve when those tickets finish. To get a real
   signal, the tree was copied to the scratchpad, those dangling targets were stripped from
   *those* files *in the copy only*, and the build and tests were run there. No file in the
   repository was modified to do it. Every one of this ticket's own pairings resolves today.
2. **`npm run verify` is red on `src/lib/icons.test.ts`.** It was **already failing on
   `main` before this ticket started**, with 46 operation verbs falling through to the
   fallback icon. It now reports 55. All nine additions were traced to their files by name
   and every one belongs to another ticket: `attar`, `baklava`, `collard-greens`,
   `fattoush`, `ful-medames`, `gyro-meat`, `kafta`, `labneh`, `maamoul`, `manakish`. **Zero
   come from these ten files** — every label and every closing note here opens with a verb
   already in `VERB_ICONS`, which was a design decision (D5) and was verified, not hoped
   for. `src/lib/icons.ts` belongs to another ticket, so this could not be fixed here even
   in principle.

## Open concerns

1. **`marinara-sauce.cook` now carries a misleading `aka`.** It lists `pizza sauce` and
   `Sunday gravy`. The gap doc's own argument is that marinara is a *cooked* sauce and a pie
   takes raw crushed tomato — and this ticket has now written that raw sauce, as a branch
   inside `margherita` and `grandma-pie`. So a search for "pizza sauce" lands on the wrong
   recipe, and Sunday gravy is a separate dish the gap doc lists on its own. Editing an
   existing file is T-001-18's, so it was recorded there and deliberately not done.
   Suggested replacement: `>> aka: red sauce, tomato sauce, salsa marinara`.
2. **Two new categories are unclaimed by any counter's fallback.** `Pizzas` and `Pasta` do
   not appear in `src/data/counters.json`'s `categories` lists. Harmless while every file in
   those folders names `Pizzeria` outright — all six do — but a future file in either folder
   that omits `>> counters:` will be orphaned and fail the build. For T-001-17.
3. **The ten new slugs are not on the rendered menu yet.** `counters.json`'s Pizzeria
   sections do not list them, so they reach the site through the counter set rather than
   through a named section until T-001-17 runs. That is the ticket's stated boundary, not an
   oversight.
4. **`meatballs` sits at 13 ingredient rows**, the top of the README's 5–16. It reads
   cleanly, but there is no room in it for anything else; a reviewer who wants it shorter
   should cut aromatics rather than split the file.
5. **No standalone raw pizza sauce.** The gap doc's components list asks for one. An
   uncooked sauce is *crush* and *season* — two operations, below the checker's three-column
   floor — so it is written as a branch inside the two pies that want it, where the table
   actually shows the difference the gap doc is arguing about. If a reviewer wants it as its
   own file, it needs a third operation that is not padding, and none suggests itself.

## Judgement calls worth a second opinion

- **`recipes/pizzas/` and `recipes/pasta/` as new folders.** The ticket permits a new
  category for "a genuinely new kind of thing". Four pies and two pasta dishes land in them
  now and nine more gap items are queued behind. The alternative was filing a Margherita
  under flatbreads and a baked ziti under Asian noodles, which reads as a filing error on a
  site whose front page is a row of counters.
- **A grandma pie made from the round dough, not the tray dough.** That is how it is
  actually made — pressed cold and thin into an oiled sheet with no second proof — and it is
  what makes the pair tellable apart when they sit side by side, which is the gap doc's
  stated reason for writing them together.
- **One Margherita, not a Margherita and a cheese pie.** One dish, one table, both names in
  `aka`, including the `margarita` spelling that real boards print.
- **Chicken parm carries the other four parms in its closing note** rather than as four
  files. Gap #5 says "parm applies across all five equally" — it is one method, and four
  near-identical tables would say less than one sentence does.

## Handoff

A reviewer who reads nothing else should read
`node scripts/check-recipes.mjs --labels recipes/pizzas/*.cook recipes/pasta/*.cook` and one
file end to end — `recipes/pizzas/grandma-pie.cook` is the most representative: two
branches, a component consumed as an ingredient, raw sauce, and a closing note doing the
work a table cannot.

Nothing here is blocked and nothing is left half-done. The disposition is **pass**.
