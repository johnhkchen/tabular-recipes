# The Bowl Shop — what is missing

**0 recipes. The shelf was opened by T-002-01 and nothing is on it yet.** But the drawer under it
is the fullest on the site: `recipes/dressings-and-dips/` holds **40 files**, and almost every one
of them is a line on a bowl-shop board. Between the dressings, the grain dishes, the pickles and
the crunchy toppings, **around 130 recipes already belong on this shelf**, and none of them needs
rewriting.

What this counter is missing is not sauces. It is **the vegetables and the grains** — the middle
of the bowl. There is no quinoa, no farro, no wild rice, no roasted cauliflower, no roasted sweet
potato, no charred broccoli, no shaved Brussels, no kale as anything but a handful in
`minestrone`, and one salmon on the whole site (`belly-lox`, cured). That is the list below, and
it is why the *Roasted vegetables* section of this menu is the thinnest of the seven.

The vocabulary is read off real boards: Goop Kitchen (the reference the brief names), Sweetgreen,
Cava and Dig. Their build order is the same everywhere and it is the order of the sections here —
**base, then greens, then what goes on top, then the dressing last.**

---

## What is already here

This heading is not `## What it has` yet, and that is deliberate: no recipe names this counter, so
`scripts/menu-sections.mjs` would report every slug below as *listed but not shelved here*. These
are shelved at the Shawarma Counter, the Deli, the Curry House and elsewhere. **T-002-08 renames
this block to `## What it has`** once the `>> counters:` lines are written; the `**Title.** slug ·
slug` line shape is already correct, so that is the whole of the edit.

**Grain bowls.** rice-pilaf · lemon-rice · coconut-rice · yellow-rice · pilau-rice ·
mexican-red-rice · mujaddara · kitchari · tabbouleh · polenta · cheese-grits · mushroom-risotto ·
risotto-alla-milanese · bun-thit-nuong · com-tam · hoppin-john · cuban-black-beans ·
refried-beans · ful-medames · gigantes-plaki · black-eyed-peas · butter-beans

**Leafy salads.** fattoush · kachumber · som-tum · larb-gai · coleslaw · barbecue-slaw ·
potato-salad · macaroni-salad · chicken-salad · egg-salad · tuna-salad · whitefish-salad

**What goes on top.** chicken-shawarma · karaage · falafel · paneer · queso-fresco · labneh ·
ajitama · birista · dukkah · sumac-onions · do-chua · kabis · sauerkraut · sour-dill-pickles ·
menma · guacamole · shish-tawook · pollo-asado · carne-asada · kafta · smoked-chicken

**Roasted vegetables.** batata-harra · green-beans · candied-yams · stewed-squash · creamed-corn ·
mashed-potatoes · fried-okra · collard-greens

**Dressings and drizzles.** basic-vinaigrette · caesar-dressing · green-goddess-dressing ·
ranch-dressing · blue-cheese-dressing · honey-mustard-dressing · russian-dressing ·
miso-ginger-dressing · goma-dare · tahini-sauce · toum · tzatziki · raita · nuoc-cham ·
mint-chutney · mango-chutney · lime-pickle · chimichurri · basil-pesto · romesco · muhammara ·
hummus · baba-ganoush · aioli · mayonnaise · crema-mexicana · white-sauce · cream-cheese ·
scallion-schmear · chopped-liver · pork-liver-pate · ginger-scallion-oil · pomegranate-molasses ·
harissa · chermoula · zaatar · salsa-verde-cruda · salsa-roja

**Soups.** butternut-squash-soup · potato-leek-soup · tomato-soup · red-lentil-soup ·
corn-chowder · minestrone · dal-tadka · black-bean-soup · caldo-verde · miso-soup · avgolemono ·
cream-of-mushroom-soup

**Also here.** homemade-ketchup · teriyaki-sauce · shichimi-togarashi · ras-el-hanout

---

## What it is missing

Ranked, most conspicuous absence first. Named the way the boards name them.

1. **Roasted sweet potatoes** — Sweetgreen sells them as a side and inside the Harvest Bowl; Goop
   sells *Garlic Roasted Japanese Sweet Potatoes*; Dig calls them a market side. The site has
   `candied-yams`, which is a dessert with a vegetable in it. This is the single most-ordered item
   this counter does not have.

2. **Charred broccoli** — Dig's is "charred broccoli with lemon", Goop's is *Simple Garlic
   Broccoli*. Broccoli appears in exactly two files here and both are stir-fries.

3. **Roasted cauliflower**, whole and in florets — Goop sells a *Whole Roasted Cauliflower* as a
   main and a half as a side. **Zero cauliflower on the site.**

4. **Quinoa**, **farro** and **wild rice** — the three grain bases every one of these boards
   offers, and **none of the three exists here**. Cava's are saffron basmati, brown basmati and
   black lentils; Dig's are toasted quinoa and brown rice. Without them the *Grain bowls* section
   is rice and cornmeal.

5. **A roasted salmon fillet** — blackened, miso-glazed or herb-roasted; every board sells all
   three. The site has one salmon file and it is cured (`belly-lox`). This is the largest protein
   hole on the counter.

6. **Kale Caesar** — massaged kale, shaved parmesan, the dressing already written
   (`caesar-dressing`). Sweetgreen's second-best-selling item, and kale appears here only as a
   handful in `minestrone`.

7. **Shaved Brussels sprouts** — Goop's *Everyday Kale And Brussels Salad*. **Zero Brussels
   sprouts on the site.**

8. **The Harvest Bowl** — the assembled signature, and the thing a person actually orders: roast
   chicken, sweet potato, apple, goat cheese, wild rice, balsamic. It waits on ranks 1 and 4.

9. **Crispy spiced chickpeas** — Goop sells them à la carte. `hummus`, `falafel`, `socca`,
   `harira` and `chana-masala` all use chickpeas; nothing makes them crunchy.

10. **Pickled red onions** — the default pink topping on every bowl board in the country.
    `sumac-onions` is raw and dressed; `do-chua` is carrot and daikon. This one is missing.

11. **Whipped feta** (Cava's *Crazy Feta*) — the signature dip of the archetype, and the site has
    feta in one file.

12. **Lemon herb tahini** and **Greek vinaigrette** — Cava names both. `tahini-sauce` is the
    Levantine one and `basic-vinaigrette` is the neutral one; these are the two the board prints.

13. **A chopped salad** — Goop prints three (*Fall Harvest Chopped*, *The Goop Father Italian
    Chopped*, *Brentwood Chinese Chicken*). The chop is the item, not the ingredients.

14. **Baked or BBQ-glazed tofu** — Goop and Sweetgreen both sell it as the default vegetarian
    protein. Tofu appears here only as a cube in three soups and a pad thai.

15. **Crispy rice** — Goop's crunch element in two bowls and a salad. One skillet, one table.

16. **A seven-minute egg**, plain — `ajitama` is soy-marinated and belongs to the Ramen Shop. The
    bowl-shop version is the egg on its own.

17. **Sesame kale** — Goop's teriyaki bowl component, and the second use for the kale in rank 6.

18. **Toasted seeds and nuts** (pepitas, sunflower, candied pecans) — the crunch line. `dukkah` is
    the only thing here doing that job and it is a spice blend.

19. **A grain-bowl teriyaki chicken** — `teriyaki-sauce` exists; the bowl it goes in does not.

20. **Shredded rotisserie-style chicken** — Goop's *Hand-Pulled Organic Chicken* is the default
    protein on half its menu. `chicken-salad` is dressed; this is the plain pulled bird.

21. **Roasted beets** — `borscht` and `kabis` are the only beets, and both are cooked in liquid.

22. **A hot grain bowl base**, warm rather than cold — the difference between a "warm bowl" and a
    salad on these boards, and it is a technique note as much as a recipe.

---

## Components it would need

- **A roasting method for hard vegetables** — one hot sheet, one fat, one salt, and the doneness
  cue per vegetable. Ranks 1, 2, 3, 7 and 21 are all the same table with a different vegetable in
  it, which is exactly the case for writing it once.
- **Cooked quinoa, farro and wild rice**, as three plain grain tables. They are the base of half
  the menu and none of them exists.
- **A whole-grain cooking ratio note** — the pilaf method in `rice-pilaf` does not transfer to
  farro or wild rice, and every grain bowl above quietly assumes it does.
- **Massaged kale** — a two-operation table, and the reason a kale salad is edible.
- **Pickled red onion** in a quick brine (not the sumac dressing, not `do-chua`).
- **A plain roasted or poached chicken breast, pulled** — the default protein, and a component
  that `chicken-salad`, the Harvest Bowl and the chopped salads all consume.
- **A basic roasted fish fillet**, since the site has no cooked-fish technique at all.
- **Balsamic vinaigrette** and **carrot-ginger dressing** — two named board dressings the drawer
  does not yet hold, despite holding forty others.

---

## What it could not stock

- **The bowl itself.** A bowl is an assembly: a base, a protein, three sides, a dressing. Every
  one of those is a table already, and the bowl is one operation over eight leaves — under the
  floor on operations and over it on the point, the same finding the Deli recorded for a sandwich.
  The honest form is components plus `pairs-with`, and the counter page *is* the bowl.
- **"Choose any three."** The board's real grammar is a build: base, protein, up to three sides,
  dressing, unlimited toppings. That is a combinatorial menu, not a recipe, and a table cannot
  hold a choice.
- **Free toppings.** Cava's toppings and dressings are unlimited and unpriced, which is a pricing
  model doing menu work. It shapes what people order and cannot be written down as a step.
- **Seasonal by definition.** Dig's menu is "curated by season, ingredients vary"; Sweetgreen
  rotates limited-time bowls. A recipe that says "whatever is good this week" is not a recipe, and
  a recipe that pins the vegetable has lost what the counter is for.
- **Certified-clean and allergen claims.** Goop's whole board runs on gluten-free and
  "no processed sugars, no dairy, no peanuts". That is a supply claim about ingredients bought,
  not an operation a cook performs.
- **Portioning by weight into a bowl.** The line cook's scoop is the item — the same problem the
  Deli recorded for the by-the-pound case.
- **A salad spinner's worth of greens.** Washing and drying leaves for a shop is a step nobody
  writes and everybody does, and at a table it is one cell that says "wash and dry well" and
  teaches nothing.
