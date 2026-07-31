# T-002-07 — Design

Twelve files: six proteins for **What goes on top**, six for **Roasted vegetables**. This document
picks them, says where each lands, and records what was rejected.

## 1. The decision in one paragraph

Write **twelve** component recipes rather than the ten the AC floors at, because the two sections
are unevenly empty: the protein shelf can borrow twenty-odd finished dishes from other counters
(T-002-08's shelving), while the roasted-vegetable shelf can borrow **nothing that is roasted** —
`vegetables-and-sides/` is six stewed and creamed Southern sides and the site's only high-heat
vegetable is deep-fried. Six and six puts real weight where the gap note ranks it (its top three
absences are all roasting-tray vegetables) without going long enough to dilute the technique in
any one file.

## 2. What goes on top — the six

Chosen against `docs/gaps/bowl-shop.md`'s ranked list and against the ticket's own sentence: *"the
proteins a bowl counter actually sells, cooked the way a counter cooks them: marinated and
grilled, blackened, braised and shredded, crisped in a pan, roasted whole and pulled … crisped
chickpeas, seared halloumi, marinated tofu, a jammy egg."*

| Slug | Folder | Gap rank | The technique that earns the table |
| --- | --- | --- | --- |
| `pulled-roast-chicken` | `smoked-and-grilled/` | 20 | Dry-brine overnight; thighs skin-up on a hot sheet; pull warm **into the resting juices**, not onto a board |
| `blackened-salmon` | `smoked-and-grilled/` | 5 | Dry the surface, butter-dip, heavy spice, a smoking dry skillet; blackened is toasted spice, not burnt fish; pull at 49 °C |
| `crispy-chickpeas` | `fried-and-crispy/` | 9 | Dry them until they squeak, roast **naked** first, spice **after** the oven so it does not carbonise, cool uncovered |
| `crisped-marinated-tofu` | `fried-and-crispy/` | 14 | Press, marinate, cornstarch, undisturbed in a hot pan face by face, glaze **off the heat** |
| `seared-halloumi` | `fried-and-crispy/` | — (ticket) | Rinse the brine, dry, no fat in a hot dry pan, 90 seconds a face, eat it hot — the one protein with a deadline |
| `seven-minute-eggs` | `eggs/` | 16 | Fridge-cold into already-boiling water, timed to the second, ice bath, peel under the tap |

Four of the six are not meat, against the AC's floor of two. That is deliberate and it is what the
archetype sells: on Goop's, Sweetgreen's and Cava's boards the vegetarian protein column is as long
as the meat one.

**Why not a marinated grilled chicken thigh**, which the ticket names first. The site already has
five marinated grilled chickens — `shish-tawook` (yogurt, lemon, garlic), `pollo-asado`,
`chicken-tikka`, `chicken-shawarma`, `smoked-chicken`. A sixth would be a spice-swap of
`shish-tawook` and would fail *"nothing duplicates a protein that already exists."* The ticket
also tells us what to do instead: **record it and shelve it.** `shish-tawook` and `pollo-asado`
are on the T-002-08 list in §5.

**Why `pulled-roast-chicken` is not that duplicate.** It is the opposite recipe: no marinade, no
char, salt and time only, and the whole point is the pull and the juices. `chicken-salad` consumes
this and is dressed; nothing here makes the plain bird.

## 3. Roasted vegetables — the six

The gap note's `## Components it would need` opens with *"a roasting method for hard vegetables —
one hot sheet, one fat, one salt, and the doneness cue per vegetable. Ranks 1, 2, 3, 7 and 21 are
all the same table with a different vegetable in it."* That observation is correct about the
skeleton and wrong about the recipes: the skeleton is four operations, and what differs per
vegetable is the entire content of the ticket — the parboil, the cornstarch, the cut-side-down,
the late glaze. So: **six files, each carrying one technique the others do not.**

| Slug | Gap rank | The one thing this file teaches that the others do not |
| --- | --- | --- |
| `roasted-sweet-potatoes` | 1 | **The preheated sheet.** Cut face onto metal that is already 230 °C, then not moved for 20 minutes. Sugar caramelises and glues, so the pan is oiled, not lined |
| `charred-broccoli` | 2 | **Dryness and space.** Bone-dry florets, 260 °C, a hand's width between them; crowding is the whole failure mode, and the lemon goes on after |
| `roasted-cauliflower` | 3 | **The cut.** Halve through the core so every piece has a flat face; the flat face is the browning, the florets are the garnish |
| `roasted-brussels-sprouts` | 7 | **The late glaze.** Balsamic tossed through off the sheet, because sugar at 220 °C for 25 minutes is soot. Loose outer leaves left on |
| `roasted-beets` | 21 | **Steam, then dress hot.** Foil and a splash of water; skins slipped under a towel; vinegar onto a warm beet, which takes it up, not a cold one, which does not |
| `crispy-roast-potatoes` | — (ticket's own example) | **The parboil and the roughing.** Salted water to just-yielding, shaken hard in the dry pan until the surfaces go fluffy, into fat already smoking |

All six land in `recipes/vegetables-and-sides/` with `category: Vegetables & Sides`. That folder is
named for the shelf, not for the method, and putting the roasting tray in the same drawer as the
Southern sides is the point of the ticket: the drawer stops being a regional board.

`crispy-roast-potatoes` is the one not on the gap note's ranked list. It is included because the
ticket names its technique twice — *"the parboil before the roast"* — and because Dig sells
roasted potatoes as a market side. `home-fries`, `hash-browns` and `french-fries` are pan and
fryer; there is no roasted potato on the site.

## 4. Options considered and rejected

**A. One `roasted-vegetables` master table plus five short variants.** Rejected. The tree is a
merge tree over ingredients, not a parameterised procedure — a "master" would have to name a
vegetable to have a leaf at all, and the five variants would each be under the three-row floor. It
also contradicts the ticket directly: *"the temptation here is a recipe that says roast at 425
until done, and that is not worth a table."*

**B. Ten files, the AC floor, five and five.** Rejected on the asymmetry in §1: the protein
section has a borrowable back catalogue and the roasted section has none.

**C. Assembled bowls with the protein cooked inside.** Rejected — that is T-002-05's ticket, and
this one says *"stay in the components."*

**D. `miso-glazed-salmon` instead of `blackened-salmon`.** Both are on every board the gap note
reads. Blackened wins because the site has no cooked fish at all and blackening teaches the
harder, more transferable thing (surface dryness, spice toasted rather than burnt, a dry pan hot
enough to be frightening). A miso glaze is a marinade plus a broiler and overlaps
`teriyaki-sauce`, which already exists. Recorded as the obvious follow-up.

**E. Shaved Brussels sprouts (gap rank 7) as written.** Rank 7 is a *salad* — Goop's *Everyday
Kale And Brussels Salad*. That is T-002-06's ground. The roasted half of the sprout is this
ticket's, so `roasted-brussels-sprouts` is written and the shaved salad is left alone.

**F. Pickled red onions (rank 10) and whipped feta (rank 11).** Both missing, both wanted, neither
in this ticket's two sections — a quick pickle is *Dressings and drizzles* / a pickle, and whipped
feta is a dip. Left for the section that owns them. Recorded in §6.

**G. `seven-minute-eggs` as a duplicate of `ajitama`.** Considered seriously and rejected.
`ajitama` is eight hours in a soy-mirin marinade and belongs to the Ramen Shop; the gap note ranks
the plain egg 16th precisely because *"the bowl-shop version is the egg on its own."* The two files
share one operation (the boil) and disagree about it: `ajitama` runs 6:30 for a liquid centre to
survive a night of marinade, this runs 7:00 for a set-edged jammy yolk that gets eaten within the
hour. Written to make that contrast explicit rather than to hide it.

## 5. Existing dishes to shelve, by section — the artifact the AC asks for

For T-002-08. These need a `>> counters: The Bowl Shop` line and **no rewriting**. Nothing in this
list is edited by this ticket.

**Section: What goes on top**

| Slug | Lives in | Why it belongs |
| --- | --- | --- |
| `char-siu` | `stews-and-braises/` | sliced roast pork, the default donburi protein |
| `chashu` | `stews-and-braises/` | rolled braised belly, sliced cold or warm |
| `carnitas` | `stews-and-braises/` | braised and shredded, the ticket's own example |
| `tinga-de-pollo` | `stews-and-braises/` | braised and shredded chicken |
| `white-cut-chicken` | `stews-and-braises/` | poached and pulled |
| `soy-sauce-chicken` | `stews-and-braises/` | sliced cold protein |
| `cha-lua` | `stews-and-braises/` | sliced steamed pork loaf |
| `meatballs` | `stews-and-braises/` | Cava's spicy lamb meatball slot |
| `chicken-shawarma` | `smoked-and-grilled/` | the spit protein, sliced onto anything |
| `shish-tawook` | `smoked-and-grilled/` | marinated grilled chicken — the slot §2 declines to rewrite |
| `pollo-asado` | `smoked-and-grilled/` | the second one |
| `carne-asada` | `smoked-and-grilled/` | grilled steak, sliced |
| `kafta` | `smoked-and-grilled/` | ground and grilled |
| `smoked-chicken` | `smoked-and-grilled/` | pulled smoked bird |
| `gyro-meat` | `smoked-and-grilled/` | sliced off the loaf |
| `chicken-tikka` | `smoked-and-grilled/` | yogurt-marinated, grilled |
| `karaage` | `fried-and-crispy/` | the fried protein |
| `falafel` | `fried-and-crispy/` | the fried non-meat protein |
| `paneer` | `dressings-and-dips/` | the cheese protein |
| `queso-fresco` | `dressings-and-dips/` | crumbled on top |
| `labneh` | `dressings-and-dips/` | spooned on top |
| `ajitama` | `toppings-and-pickles/` | the marinated egg, next to the plain one this ticket writes |
| `sumac-onions` | `toppings-and-pickles/` | the sharp thing |
| `do-chua` | `dressings-and-dips/` | the pickle |
| `kabis` | `toppings-and-pickles/` | pink turnip pickle |
| `sauerkraut` | `toppings-and-pickles/` | the kraut line |
| `menma` | `toppings-and-pickles/` | seasoned bamboo |
| `birista` | `dressings-and-dips/` | fried shallot, the crunch line |
| `dukkah` | `spice-blends-and-marinades/` | the seed-and-nut crunch |
| `guacamole` | `dressings-and-dips/` | the avocado slot every board prints |

**Section: Roasted vegetables**

| Slug | Lives in | Why it belongs, and the caveat |
| --- | --- | --- |
| `batata-harra` | `fried-and-crispy/` | the closest thing to a roasting-tray vegetable on the site; it is fried, so it goes on this shelf next to `crispy-roast-potatoes`, not instead of it |
| `green-beans` | `vegetables-and-sides/` | a hot vegetable side, stewed |
| `stewed-squash` | `vegetables-and-sides/` | the squash slot |
| `creamed-corn` | `vegetables-and-sides/` | the corn slot |
| `mashed-potatoes` | `vegetables-and-sides/` | the warm starch side |
| `collard-greens` | `stews-and-braises/` | the greens slot; `collard-greens-instant-pot` is its `kit` variant and should be shelved with it |
| `fried-okra` | `fried-and-crispy/` | the okra slot |
| `ratatouille` | `stews-and-braises/` | a vegetable main; borderline — it is a stew and may read better under *Also here* |
| `candied-yams` | `vegetables-and-sides/` | **listed with a warning.** The gap note calls it *"a dessert with a vegetable in it"*; it is the reason rank 1 exists, and shelving it under *Roasted vegetables* would make the section look filled when it is not |

## 6. Recorded and deliberately not written

Missing, wanted, and outside this ticket's two sections: **pickled red onions** (rank 10),
**whipped feta** (rank 11), **lemon herb tahini** and **Greek vinaigrette** (rank 12),
**balsamic vinaigrette** and **carrot-ginger dressing** (components list) — all dressings and
pickles. **Massaged kale** (rank 6/17) and the **chopped salad** (rank 13) — T-002-06. **Quinoa,
farro, wild rice** (rank 4) and **crispy rice** (rank 15) — T-002-05. **Miso-glazed salmon** — the
follow-up to §4-D.

## 7. Consequences to watch

- **Overlap with T-002-05 is intended.** If a grain bowl roasts a sweet potato inside its own
  table, that is not a duplicate of `roasted-sweet-potatoes`; the tree cannot cross files.
- **`pairs-with` points only at slugs that exist today** — `tahini-sauce`, `toum`, `hummus`,
  `basic-vinaigrette`, `miso-ginger-dressing`, `chimichurri`, `zaatar`, `harissa`, `dukkah`,
  `mujaddara`, `rice-pilaf`, `lemon-rice`, `polenta`. Nothing points at a sibling's in-flight file.
- **`slack` is written only where the failure is nameable**: `seven-minute-eggs` (unforgiving —
  thirty seconds is the difference), `seared-halloumi` (unforgiving — it squeaks cold),
  `blackened-salmon` (narrow), `crispy-chickpeas` (narrow — they soften back within the hour).
  The rest leave it off, which the README says is the honest answer.
