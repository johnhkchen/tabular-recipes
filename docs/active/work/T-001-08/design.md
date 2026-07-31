# T-001-08 — Design

The decision: **write the ramen board bottom-up — broths, tares, oil, noodles and toppings
first, then four bowls that consume them** — covering `docs/gaps/ramen-shop.md` items 1–9 in
order, and stopping there.

## The question the design has to answer

The gap doc's item 1 is a broth, item 2 is three more broths, item 4 is "a bowl of ramen",
and item 5 is the noodle. But §5 of research says the build refuses a step that feeds two
later steps, so **a bowl cannot contain its own broth, tare, oil, noodles and toppings** in
one table. Every option below is a different answer to "then what is a file?"

## Options

### A — Eight files, straight down the list, stop at the bar

Tonkotsu broth, shoyu/shio/miso ramen, chashu, ramen noodles, ajitama, gyoza. Exactly clears
18/14.

Cheapest, and it is in list order. But the three bowls would each call for `shoyu tare` and
`chicken fat` as bought ingredients that exist nowhere on the site and cannot be bought in
most of the world. The gap doc names this exact failure — *"it is the thing that names the
dish, it is never printed on a menu, and nobody knows to look it up"* — and item 2 would be
satisfied in name while leaving the reader unable to make any of the three.
**Rejected: it clears the count and not the criterion "the canonical method rather than a
shortcut wearing its name".**

### B — Components first, then bowls that consume them *(chosen)*

Seventeen files in dependency order: `dashi` → the two broths → three tares → `mayu` →
`chashu` → `ramen-noodles` → `ajitama`, `menma` → four bowls → `gyoza`, `karaage`.

The bowl files are short assembly tables — this is the gap doc's own prescription: *"Write
the five, and write the bowl as a short table that consumes them."* Components appear in a
bowl as ordinary `@` ingredient rows (they are other files, not `@&(~N)` refs), and
`pairs-with` links the two directions since the build makes it mutual.

Costs: seventeen files instead of eight, and four bowls that share a skeleton. The second
cost is the real risk and §"How the four bowls stay four dishes" below is the answer to it.

### C — Four self-contained bowls, everything inline

One file per bowl, each building its own broth and tare.

Fails outright on the tree: the broth would have to feed both "season with the tare" and
"pour over the noodles", and one preparation can only flow into one place. Even where it
could be linearised it would put a twelve-hour boil inside a table headed "Shoyu Ramen", and
four files would each carry a slightly different copy of the same tare.
**Rejected: the build forbids it and the duplication is worse than the file count.**

### D — Components only, no bowls

Write the five preparations and let the reader assemble.

Item 4 is on the list, ranked above the noodle itself, and a ramen counter whose menu has no
ramen on it is the same joke the ticket opens with. **Rejected.**

### E — B, but only one bowl instead of four

A single `ramen` file with "swap the tare" as a note.

Cheaper, and it is what "kaedama / firmness dials" reasoning would suggest. But item 2 is
explicit that shoyu, shio, miso and tonkotsu are **four section headers on a real board**,
not one dish with a dial: they differ in broth, in tare, in noodle cut, in fat and in
toppings — Sapporo miso is stir-fried in lard before the broth goes in, Hakata tonkotsu is
a 15-second noodle. One file could not honestly describe all four.
**Rejected: it collapses the counter's organising principle back into the thing the gap doc
complains about.**

## Chosen: B

### How far down the list this reaches

| # | Gap item | This ticket |
| --- | --- | --- |
| 1 | Tonkotsu broth | `tonkotsu-broth` |
| 2 | Shoyu, shio, miso — the other three broths | `chintan-broth` + `shoyu-ramen`, `shio-ramen`, `miso-ramen` |
| 3 | Chashu | `chashu` |
| 4 | A bowl of ramen | four bowls, each a short assembly table |
| 5 | Ramen noodles (kansui) | `ramen-noodles` |
| 6 | Ajitama | `ajitama` |
| 7 | Gyoza | `gyoza` |
| 8 | Karaage | `karaage` |
| 9 | Menma, kikurage, naruto, nori, corn and butter | `menma` only — see below |
| 10+ | donburi, tonkatsu, tantanmen, chahan, korokke, onigiri, snacks, the other noodle, drinks | **not reached** — recorded in `review.md` |

Plus the components the list's own "Components it would need" section demands and the bowls
cannot work without: `dashi`, `shoyu-tare`, `shio-tare`, `miso-tare`, `mayu`.

Seventeen new files. Ramen Shop goes from 10 recipes / 9 exclusive to **27 / 26**, against a
bar of 18 / 14. The bar is cleared at file 8 (`chashu`); the remaining nine exist because
stopping at the bar would leave four bowls calling for tares that do not exist.

Item 9 is written down to **menma** and no further, on the gap doc's own reasoning about what
a table can hold: nori is bought in sheets, naruto maki is bought sliced and cut, corn and
butter is two things dropped on a finished bowl, and kikurage is a twenty-minute soak and a
knife — one ingredient, no operation, under the three-row floor at `check-recipes.mjs:66`.

### How the four bowls stay four dishes

The risk of option B is four files that differ only in a word. They do not, and each file's
tree is different:

| | tonkotsu | shoyu | shio | miso |
| --- | --- | --- | --- | --- |
| broth | `tonkotsu-broth`, emulsified | `chintan-broth` | `chintan-broth` + `dashi` | `chintan-broth` |
| tare | shio tare | shoyu tare | shio tare | miso tare |
| fat | `mayu` | chicken fat off the broth | chicken fat | lard, in the wok |
| noodle | thin, straight, 15 sec | wavy, medium, 90 sec | thin, 60 sec | thick, curly, 3 min |
| the move | none — assembly at the pass | none | none | **aromatics and pork stir-fried in the wok, tare bloomed in the fat, broth poured onto it** |
| toppings | chashu, kikurage, beni shoga, sesame | chashu, ajitama, menma, nori, naruto | chashu, ajitama, scallion, yuzu | corn, butter, bean sprouts, chashu |

Miso ramen is the one that is not assembly at all, which is why it is written last of the
four and gets a longer table.

### Aroma oil: one file, not three

The gap doc asks for mayu, chicken fat and scallion oil. **`mayu` is a recipe** — garlic
burnt black in sesame oil, a real technique that goes wrong easily. **Chicken fat is not**:
it is the fat you skim off the chintan, so `chintan-broth`'s final step says to keep it and
the shoyu and shio bowls call for it by that name. Writing a third file to say "skim the
broth you just made" would be a table with one operation, which the checker rejects anyway.

### Two new category folders

`recipes/fried-and-crispy/` and `recipes/toppings-and-pickles/`.

Research §7 found no home for either kind of thing. Karaage is not a dumpling, not a
stir-fry and not grilled; the folder is where tonkatsu, korokke, agedashi tofu and takoyaki
go when items 11, 14 and 16 are written, so it is a family and not a folder for one file.
Ajitama and menma are the "Toppings you tick off" section of the board — an egg is not a
dressing and bamboo shoots are not a dip, which is where `dressings-and-dips` would have put
them. The ticket allows this explicitly: *"a genuinely new kind of thing may take a new
category and folder."* No registration is needed — category falls out of the folder name and
nothing validates the list (research §4).

Everything else lands in an existing folder: broths and tares in `soups` / `sauces-and-gravies`,
`chashu` in `stews-and-braises` beside `char-siu` and `cha-lua`, the four bowls and the noodle
dough in `noodles`, `gyoza` in `dumplings-and-rolls`.

### Counters

Every one of the seventeen carries `>> counters: Ramen Shop` and nothing else. Two are
arguable — `dashi` underlies half of Japanese cooking and `gyoza` is sold at the Dim Sum
Counter as *jiaozi* — but they are written here as the ramen shop's versions (gyoza is
fried flat-side-down and pleated on one side only; jiaozi is boiled and is a different
dish), and widening a counter list is a judgement about the whole shelf, which is T-001-18's.
Keeping them exclusive also keeps the 14-exclusive criterion unambiguous.

### Where the ticket does not go

- `src/data/counters.json` gains no "Broths" or "Toppings" section here. Until T-001-17 runs,
  the seventeen files reach the counter through the category grouping in `src/lib/counters.ts`.
- `japanese-beef-curry` is not touched, though `chashu` and the tares now sit next to it.
- `okonomiyaki` asks for `okonomiyaki sauce` and `Japanese mayonnaise` as bought goods. Both
  are on the gap doc's component list; both belong to a lower-ranked part of it than this
  ticket reaches, and writing them would not change the file that wants them (that edit is
  T-001-18's). Recorded in `review.md`, not written.

### Verification

Per file, before it is committed: `node scripts/check-recipes.mjs --labels <file>` must print
`ok`, the printed staircase must read as verbs a cook would say, and `grep '~{'` must find
nothing (every timer named). At the end, the whole collection is re-checked so no file was
broken in passing, and the counter's totals are counted from `grep`, not from the docs.
