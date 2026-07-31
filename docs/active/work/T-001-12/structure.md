# T-001-12 — Structure

The blueprint: which files appear, what tree each one draws, and in what order they have
to be written. No code, and nothing outside `recipes/**`.

## Files

| # | Path | Status | Category | Counters |
| --- | --- | --- | --- | --- |
| 1 | `recipes/pizzas/margherita.cook` | new | Pizzas | Pizzeria |
| 2 | `recipes/breads/sicilian-pan-dough.cook` | new | Breads | Pizzeria |
| 3 | `recipes/pizzas/sicilian-pizza.cook` | new | Pizzas | Pizzeria |
| 4 | `recipes/pizzas/grandma-pie.cook` | new | Pizzas | Pizzeria |
| 5 | `recipes/pizzas/white-pizza.cook` | new | Pizzas | Pizzeria |
| 6 | `recipes/pasta/baked-ziti.cook` | new | Pasta | Pizzeria |
| 7 | `recipes/fried-and-crispy/chicken-parmigiana.cook` | new | Fried & Crispy | Pizzeria |
| 8 | `recipes/stews-and-braises/meatballs.cook` | new | Stews & Braises | Pizzeria |
| 9 | `recipes/pasta/fresh-egg-pasta.cook` | new | Pasta | Pizzeria |
| 10 | `recipes/breads/garlic-knots.cook` | new | Breads | Pizzeria |

Two new folders: `recipes/pizzas/` and `recipes/pasta/`. No file is modified and no file is
deleted. `src/`, `docs/gaps/`, `src/data/counters.json` are untouched.

**Ordering that matters.** `sicilian-pan-dough` (2) before `sicilian-pizza` (3), because
the pie names the dough as an ingredient and the wording of one has to match the other.
`pairs-with` targets must exist by the time `npm run recipes` runs, not by the time each
file is written, so the rest is free; they are written in gap-list order anyway.

## Ingredient-level dependencies between tables

A table cannot reach into another table, so a component is consumed as a plain ingredient
with a note pointing at it — the `balti` → `onion-tomato-masala` pattern.

```
pizza-dough (exists) ──► margherita, white-pizza, grandma-pie, garlic-knots
sicilian-pan-dough (new) ──► sicilian-pizza
marinara-sauce (exists) ──► sicilian-pizza, baked-ziti, chicken-parmigiana, meatballs
raw crushed tomato (a branch, not a file) ──► margherita, grandma-pie
```

`pairs-with` declarations, written on one side only and made mutual at build:

```
margherita        pairs-with: pizza-dough, basil-pesto
sicilian-pizza    pairs-with: sicilian-pan-dough, marinara-sauce
grandma-pie       pairs-with: pizza-dough
white-pizza       pairs-with: pizza-dough
baked-ziti        pairs-with: marinara-sauce, meatballs
chicken-parmigiana pairs-with: marinara-sauce, fresh-egg-pasta
meatballs         pairs-with: marinara-sauce, fresh-egg-pasta
fresh-egg-pasta   pairs-with: bolognese, basil-pesto, alfredo-sauce
garlic-knots      pairs-with: marinara-sauce, pizza-dough
```

Every target is a slug that exists (four of them written by this ticket). None is
self-referential.

## The tree each file draws

`[H]` is a full-width header row — a step with no ingredients and no refs, which must sit
above the first real operation. `~N` counts every step including that one.

### 1. margherita — 5 ops, 2 branches

```
[H] preheat the steel, 550°F, 45 min
 1  crush the tomatoes by hand ─────────┐
 2  stretch to 12 in ────────┐          │
 3  top: sauce thin, cheese torn ◄──────┴──── (~1 = stretch, ~2 = crush)
 4  bake 6 to 8 min
 5  finish with oil and basil
[F] note: which crust this is (home 550°F steel, not an 800°F deck)
```
Rows ≈ 8: whole peeled tomatoes, fine sea salt, extra-virgin olive oil, pizza dough,
semolina, fresh mozzarella, fresh basil, olive oil.

### 2. sicilian-pan-dough — 4 ops, 1 chain

```
 1  mix to a wet, shaggy dough
 2  fold four times over 2 hr
 3  press into an oiled tray
 4  prove 2 hr, until it fills the corners
[F] note: what 75% hydration is for
```
Rows ≈ 6. Step 2 carries a ref and no new ingredient, which is a legal operation.

### 3. sicilian-pizza — 4 ops, 1 chain

```
 [H] preheat 500°F, low rack
  1  layer the cheese to the edges     (dough is an ingredient, not a branch)
  2  ladle the sauce on top in stripes
  3  bake 22 to 28 min
  4  cool 10 min, then cut in squares
 [F] note: cheese under sauce is the difference
```
Rows ≈ 5: sicilian pan dough, low-moisture mozzarella, marinara sauce, dried oregano,
grated pecorino.

### 4. grandma-pie — 5 ops, 2 branches

```
[H] preheat 500°F
 1  press cold dough into an oiled sheet, twice ──┐
 2  crush the tomatoes raw with garlic ───────┐   │
 3  scatter the cheese, dollop the tomato ◄───┴───┘
 4  bake 16 to 20 min
 5  finish with parmesan, basil and oil
[F] note: how it is told apart from a Sicilian
```
Rows ≈ 10.

### 5. white-pizza — 5 ops, 2 branches

```
[H] preheat the steel, 550°F
 1  mix the ricotta with garlic and pepper ──┐
 2  stretch to 12 in ───────────┐            │
 3  spoon on the ricotta, tear the mozzarella between ◄─┴─┘
 4  bake 6 to 8 min
 5  finish with oil, oregano and flaky salt
[F] note: no tomato at all, and why it goes on in spoonfuls
```
Rows ≈ 11.

### 6. baked-ziti — 5 ops, 2 branches

```
[H] preheat 375°F
 1  boil 3 min under the box ──────────┐
 2  beat the ricotta with an egg ──┐   │
 3  toss hot pasta through it ◄────┴───┘
 4  layer with mozzarella, half in the middle
 5  bake 35 min, uncovered for the last 15
[F] note: why the pasta comes out early
```
Rows ≈ 10.

### 7. chicken-parmigiana — 5 ops, 1 chain

```
[H] preheat 425°F
 1  pound thin and salt
 2  dredge flour, egg, then crumb
 3  fry 3 min a side, drain on a rack
 4  sauce the middle, cheese on top
 5  bake 12 min, until the cheese blisters
[F] note: the same five parms off one method
```
Rows ≈ 10.

### 8. meatballs — 5 ops, 1 chain

```
 1  soak the bread to a paste
 2  mix by hand, lightly
 3  roll 18 balls, chill 20 min
 4  brown all over, 8 min
 5  simmer 45 min in the sauce
[F] note: fry a teaspoon first and taste it
```
Rows ≈ 13 — the top of the README's range, and the reason meatballs is one table and not
two.

### 9. fresh-egg-pasta — 5 ops, 1 chain

```
 1  mix to a stiff dough
 2  knead 10 min, until it springs back
 3  rest 30 min, wrapped
 4  roll thin and cut in ribbons
 5  boil 90 sec, keep a cup of the water
[F] note: the pasta-water emulsion, said out loud
```
Rows ≈ 8.

### 10. garlic-knots — 5 ops, 2 branches

```
[H] preheat 450°F
 1  cut 12 strips and tie each in a knot ──┐
 2  prove 30 min, until puffed             │
 3  bake 12 to 15 min, until gold ─────────┤
 4  warm the garlic in butter ─────────┐   │
 5  toss hot knots through it ◄────────┴───┘   (~1 = warm, ~2 = bake)
[F] note: toss them within the minute
```
Rows ≈ 10.

## Metadata contract, per file

Required by the checker: `title`, `category`, `tags`, `servings`. Required by this ticket's
acceptance criteria on top of that: `counters`, and `aka` wherever the board uses another
name. Written throughout: `time`, `pairs-with`, and a `step.N` override for **every** step
including the closing note row.

`aka` lines are drawn from the Pizzeria table in `docs/knowledge/counters.md`, and every one
of them carries at least one form typed the way a person types it — no diacritics, and the
misspellings the board actually prints:

| File | `aka` |
| --- | --- |
| margherita | pizza margherita, margarita, margarita pizza, marg, cheese pizza, cheese pie, plain slice, a regular, Neapolitan pizza |
| sicilian-pizza | sicilian, square, square slice, square pie, thick crust, tray pizza, pizza siciliana |
| grandma-pie | grandma, grandma pie, grandma square, grandma slice, grandma style, grandma pizza |
| white-pizza | white pie, bianca, pizza bianca, pizza blanca, ricotta slice, white slice |
| baked-ziti | ziti, baked pasta, ziti al forno, pasta al forno |
| chicken-parmigiana | chicken parm, chicken parmesan, chicken parmigiano, parm, pollo alla parmigiana |
| meatballs | polpette, italian meatballs, meatballs in sauce, spaghetti and meatballs, meatball |
| fresh-egg-pasta | pasta all'uovo, pasta alluovo, egg pasta, fresh pasta, tagliatelle, fettuccine |
| garlic-knots | knots, garlic rolls, garlic twists, garlic knot |
| sicilian-pan-dough | sicilian dough, square pizza dough, pan pizza dough, tray dough |

## Boundaries this structure keeps

- **`recipes/**` only.** No `src/`, no `docs/gaps/`, no ticket frontmatter.
- **No existing file changed.** The one edit this work surfaces — dropping `pizza sauce`
  and `Sunday gravy` from `marinara-sauce.cook`'s `aka` — is recorded for T-001-18 in
  `progress.md` and `review.md` and is deliberately not made.
- **No new verb asked of `src/lib/icons.ts`.** Every label and every note opens with a word
  already in `VERB_ICONS`.
