# T-002-03 — Design

Twelve new `.cook` files. The decisions below are all about which numbers go in them and
what the table is allowed to claim.

## D1 — Scope: twelve dishes, in the gaps order, folder-filtered

**Decision.** Write, in this order:

1. `tonkotsu-broth-instant-pot` (gaps rank 1)
2. `pho-broth-instant-pot` (2)
3. `chintan-broth-instant-pot` (4)
4. `chicken-broth-instant-pot` (9)
5. `ham-hock-stock-instant-pot` (15)
6. `ful-medames-instant-pot` (24)
7. `cuban-black-beans-instant-pot` (25)
8. `refried-beans-instant-pot` (26)
9. `congee-instant-pot` (27)
10. `borscht-instant-pot` (28)
11. `boston-baked-beans-instant-pot` (31)
12. `gigantes-plaki-instant-pot` (gaps "also worth a variant")

That is every in-folder dish from the ranked list down to rank 31, taken strictly in order,
plus one from the tail. Against the acceptance criteria: 12 ≥ 10 files; five stocks and
broths ≥ 1; five beans from dry (`ful-medames`, `cuban-black-beans`, `refried-beans`,
`boston-baked-beans`, `gigantes-plaki`) ≥ 4, of which four start unsoaked.

**Rejected: exactly ten.** Ten is the floor and lands exactly on the four-bean floor too,
so a single file failing review would fail two criteria at once. Twelve buys a margin of
two files and one bean.

**Rejected: writing `chana-masala` and `hummus`,** both named in the ticket Context.
`ls` puts them in `stews-and-braises/` and `dressings-and-dips/`, and the acceptance
criteria say "Every one of them has its plain version in `recipes/rice-beans-and-grains/`
or `recipes/soups/`. Nothing from `stews-and-braises/`." `chana-masala` is inside the
folder T-002-02 owns, so writing it would also be the collision the story exists to
prevent. Both are recorded as named skips.

**Rejected: `collard-greens`** (rank 21, and it reads like this ticket's kind of pot) —
`recipes/stews-and-braises/collard-greens.cook`. Same rule.

## D2 — Where every pressure time comes from

**Decision.** Each file's pressure time is sourced from one of exactly three places, named
per dish in `progress.md`, and **no number is derived from the plain file's duration**:

- **(a) The repo's own table** at `docs/gaps/instant-pot.md:139-143` and `:63` — written by
  T-002-01 to stop every writer re-deriving the same figures. It pins black beans 25,
  pinto 25, chickpeas 35, short rib 40, and tonkotsu at ninety minutes.
- **(b) A fetched, tested recipe** — Amy + Jacky's Instant Pot pho, verified during
  Research at 60 min high pressure + 30 min natural release.
- **(c) The published bean and stock charts**, where the honest answer is a range.

**Where a range exists, take the top of it.** Research §6 records charts disagreeing by up
to 60% on the same bean. Undercooked beans are inedible; overcooked beans are soft. The
asymmetry is not close, so the range's upper end is the only defensible pick, and taking it
also keeps the file consistent with the repo's own figures being at or below it.

**Rejected: averaging the charts.** An average is a number nobody tested. The top of the
range is at least a figure somebody cooked.

**Rejected: quoting a range in the timer** (`~pressure cook{25-30%min}`). Cooklang timers
carry one quantity, and `minutesOf()` in `src/lib/time.ts` needs a number. A range would
either fail to parse or silently read as null and drop out of the clock.

Resulting table, all at high pressure, unsoaked unless stated:

| File | Time | Release | Source |
| --- | --- | --- | --- |
| tonkotsu | 90 min | natural, 30 min | (a) gaps:63 |
| pho broth | 60 min | natural, 30 min | (b) Amy + Jacky, fetched |
| chintan | 60 min | natural, 30 min | (c) published pressure-chintan practice, 60–90 |
| chicken broth | 45 min | natural, 25 min | (c) Alton Brown / Kitchn / Saveur, all 45 |
| ham hock stock | 45 min | natural, 20 min | (c) smoked-hock stock practice, 45–60 |
| ful medames | 45 min | natural, 20 min | (c) whole skin-on brown fava, 40–45 |
| cuban black beans | 30 min | natural, 20 min | (c) 20–30 range, top |
| refried beans | 40 min | natural, 20 min | (c) 25–40 range, top |
| congee | 30 min | natural, 20 min | (c) 20–30 range, top |
| borscht | 40 min | natural, 15 min | (a) gaps:141, short rib at 40 |
| boston baked beans | 30 + 10 min | natural ×2 | (c) navy 20–30, top; second leg is the molasses |
| gigantes plaki | 20 min, **soaked** | natural, 20 min | (c) large white bean, soaked, 15–20 |

## D3 — The soak, dish by dish

The ticket: *"Where a dish's plain version soaks overnight, the pressure version's whole
claim is that it does not. Do not carry the soak over out of symmetry, and do not silently
drop it either."*

**Decision.** Drop the soak for `cuban-black-beans`, `refried-beans`, `ful-medames`,
`boston-baked-beans`. **Keep it for `gigantes-plaki`**, with the timer named `~soak{12%hr}`
and a sentence saying why.

Gigantes are the one case where the canonical method still wants the soak, and the reason
is structural rather than about time: plaki is a dish of whole beans in tomato, and a
gigante taken from bone dry to done in one sealed run splits its skin and goes to mush.
Nobody publishes an unsoaked figure for a bean that size. A soaked gigante at 20 minutes is
a figure that exists; an unsoaked one at 40 would be invention.

**Rejected: dropping the soak everywhere for symmetry.** That is exactly the fabrication
the story forbids, and it would be the one file on the shelf whose claim is untested.

**Rejected: skipping `gigantes-plaki` because it keeps a soak.** The pot still collapses
1 hr simmer + 1 hr bake into 20 minutes, which is the larger half of the dish.

## D4 — Tonkotsu: pressure, then the lid off

The hard case. `tonkotsu-broth.cook` argues the white broth is *mechanical* — a rolling
boil emulsifying fat and collagen — and a sealed pot suppresses exactly that boil. Kenji
López-Alt's public position is that this rules the pot out. Published pressure-tonkotsu
recipes disagree, and every one of them boils hard with the lid off afterwards.

**Decision.** Write it as two things the pot does well and one it cannot: 90 minutes at
pressure to break the bones down, full natural release, then **a hard uncovered boil to
emulsify**, and say in the table that the second leg is not optional and is where the
colour comes from.

**Rejected: skipping tonkotsu.** It is rank 1, the acceptance criteria require the top of
the list "in that order, as far as the count reaches", and a skip at rank 1 would need a
much stronger reason than "one source says no" when the pot demonstrably does the
extraction.

**Rejected: 90 minutes sealed and nothing else.** That claims the plain recipe's result
from a mechanism the plain recipe explicitly says will not produce it. It would be the
lie the ticket warns about, on the most visible file of the twelve.

## D5 — The stocks tell the truth about clarity

`chicken-broth` and `chintan-broth` both spend their prose on never boiling. Under a locked
lid the liquid is above 100 °C, moving, unskimmable and unwatchable.

**Decision.** Both files say plainly that the pot trades clarity for the afternoon, and
both use a **full natural release** as a cooking instruction rather than a convenience —
opening the valve drops the pressure, flashes the liquid to a violent boil in the pot, and
is what actually clouds a pressure stock. Both also keep a strain and a fat step, because
that is where the remaining clarity is won.

For `chicken-broth` specifically the plain file's 8 hr chill exists to set the fat into a
liftable cap. **Decision: replace it with a 20-minute settle and a fat separator.** Keeping
the chill would leave the variant at ~10 hr against the plain 11 hr 30, which is not a
variant anybody would click. Skipping fat removal entirely would be a different broth. The
settle is honest, it is what the twenty-minute version of that operation is, and the
schmaltz still comes off.

**Rejected: keeping `~chill{8%hr}`.** See above — it makes the whole file pointless.

## D6 — Boston baked beans: two legs, and an argument in the table

`docs/gaps/instant-pot.md:120` already says the 5 hr bake is doing flavour work pressure
does not reproduce, and asks for that to be argued in the table.

**Decision.** Two pressure legs, because molasses cannot go in at the start: sugar and acid
stall bean softening, which is a fact about beans and not a preference. Cook the navy beans
plain at 30 min, then add the molasses, mustard, salt pork and cook 10 min more, then
finish with the lid off to thicken. The file says outright that this is a faster, looser,
less caramelised pot than the bean-pot version and names what is missing.

**Rejected: molasses from the start.** It produces beans that are still chalky at 45
minutes and there is no fixed time that works, which is precisely a number nobody can
source.

## D7 — The shape every file shares

**Decision.** One grammar across all twelve, so the shelf reads as one shelf:

```
[ optional full-width note, top only ]
1  sauté / brown / char        in the pot, hands-on, named ~sauté / ~char / ~parboil
2  pressure cook               ~pressure cook{N%min}         unattended, from the name
3  natural release             ~natural release{N%min}       unattended, from the name
4  the leg the pot cannot do   reduce / mash / fry / boil hard, lid off
5  finish                      acid, salt, the things that go in last
```

Three to six operations, inside README's limit. Steps 2 and 3 are separate operations
rather than two timers in one step, because the release is different cooking and the
staircase should show it as its own cell.

**Timer names are the exact strings `src/lib/time.ts` knows**: `~pressure cook`,
`~natural release`, `~quick release`, `~come to pressure`. Anything else — `~release`,
`~let it fall` — reads as hands-on and would report walk-away time as time spent standing
at the pot, which is the one thing this shelf exists to get right.

**Decision: no `~quick release` anywhere in this ticket.** Every dish here is a bean, a
starch or a stock. Beans split under a quick release; congee sprays starch foam through the
valve; a stock flashes to a boil and clouds. Natural release is the correct instruction for
all twelve, which is a happy accident of this ticket's half of the shelf and worth saying
once here rather than twelve times.

**Decision: `~come to pressure` is not written as a timer.** It varies with how full the
pot is and it is not a figure any source publishes per dish. Writing it would be inventing
a number to make the clock look thorough. The files say the pot takes time to come up in
prose where it matters.

## D8 — Naming and metadata

**Decision.** `<plain-slug>-instant-pot.cook`, in the same folder as the plain file. That
matches the story's worked example (`beef-stew-instant-pot.cook`), keeps the URL guessable,
and cannot collide with T-002-02, which owns a different folder.

Every file carries `title` ("X, Instant Pot"), `category` (matching the plain file's, not
the folder default), `tags` (the plain file's, minus `stovetop`/`oven`, plus
`instant pot`, `pressure cooker`), `counters: Instant Pot`, `servings` (the plain file's),
`aka`, `dish`, `kit`, and `time`.

**Decision: `aka` on every file**, and it carries the pressure-cooker names people actually
search — "instant pot black beans", "pressure cooker pho broth", "no soak black beans" —
alongside the dish's own aliases. The criteria ask for `aka` "where people say it another
way", and for a kit variant the kit *is* the other way people say it.

**Decision: `counters: Instant Pot` only, not the plain file's counter as well.** A
pressure-cooker chintan is not what the Ramen Shop sells; the shelf it belongs on is the
kit shelf. T-002-08 decides whether any of these also belong on their origin counter.

**Decision: `pairs-with` copied from the plain file where it exists**, and never pointing
at the plain sibling — that relationship is `dish`, and `[slug].astro` already renders it.
Pairings are made mutual in generated data only (`parse-recipes.mjs:84-101`), so this edits
no file.

## D9 — Verification

**Decision.** Three gates, in order:

1. `node scripts/check-recipes.mjs --labels <all 12 paths>` — the acceptance criterion.
   Read the staircase, not just the `ok`.
2. `npm run recipes` — the only thing that can catch a `dish:` typo, a bad counter name, a
   dead `pairs-with`, or two plain files sharing a dish. `check-recipes.mjs` cannot: it
   sees one file at a time.
3. `npm run verify` — full parse + tests + build, including
   `src/lib/collection.test.ts`'s "one plain way per dish" and "agree with their siblings".

`src/generated/` is not committed, so all three are safe and leave nothing to commit.
