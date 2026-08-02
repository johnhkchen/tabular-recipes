# T-003-06 — Progress

**Done.** Three shelves that rendered as one undifferentiated block each now render as menus:
**Japanese Home Cooking 38**, **The Soup Pot 24**, **The Slow Cooker 20**. `npm run verify` green:
658 files draw a table, 825 tests pass, 682 pages build. Three commits, all through
`lisa commit-ticket` with exact `--include` paths.

**One acceptance criterion is knowingly not met** — criterion 8, only two files modified. Thirteen
`.cook` files carry one changed metadata line each. That is `design.md` D1 and it is argued in
`review.md` §1.

---

## Steps, as planned and as executed

| Step | What | Result |
| --- | --- | --- |
| 0 | Baseline at `ed98111` | 8 test files / 825 tests green; `658 named, 0 inferred`; 3/1082 unplaced ingredients; the 21-counter membership vector recorded |
| 1 | Round-trip probe on `counters.json` | `IDENTICAL` — `json.dumps(f, indent=2, ensure_ascii=False) + "\n"` reproduces the file byte-for-byte |
| 2 | Thirteen `>> counters:` lines | 13 files, 13 insertions, 13 deletions; diff invariant **0** |
| 3 | Commit `db18740` | *Put the home dishes on the second board they were always cooked on* |
| 4 | Three `sections` blocks | +106 −24, five hunks, all above line 1664 |
| 5 | Commit `af175c7` | *Shelve the home wing in the sections its boards would print* |
| 6 | `npm run verify` + read the built HTML | green; three menus asserted |
| 7 | Aisle sweep | coverage unchanged; **four mis-aisled products fixed** — a deviation, below |
| 7b | Commit `4681d37` | *Take four products back off the aisle a bare word had put them on* |

No ordinary `git add`, no `git add -A`, no ordinary `git commit` at any point.
`src/generated/recipes.json` was regenerated repeatedly and committed never.

---

## 1. The thirteen `.cook` edits

One line each, of this shape:

```
- >> counters: Ramen Shop
+ >> counters: Ramen Shop, Japanese Home Cooking
```

Nothing else in any of them changed, measured rather than asserted:

```
$ git diff -U0 -- recipes/ | grep '^[+-][^+-]' | grep -vc '^[+-]>> counters:'
0
$ git diff --stat -- recipes/ | tail -1
13 files changed, 13 insertions(+), 13 deletions(-)
```

| File | added counter |
| --- | --- |
| `recipes/soups/dashi.cook` | Japanese Home Cooking |
| `recipes/soups/miso-soup.cook` | Japanese Home Cooking |
| `recipes/fried-and-crispy/karaage.cook` | Japanese Home Cooking |
| `recipes/dumplings-and-rolls/gyoza.cook` | Japanese Home Cooking |
| `recipes/flatbreads-and-pancakes/okonomiyaki.cook` | Japanese Home Cooking |
| `recipes/custards-and-puddings/chawanmushi.cook` | Japanese Home Cooking |
| `recipes/stews-and-braises/japanese-beef-curry.cook` | Japanese Home Cooking |
| `recipes/sauces-and-gravies/teriyaki-sauce.cook` | Japanese Home Cooking |
| `recipes/spice-blends-and-marinades/shichimi-togarashi.cook` | Japanese Home Cooking |
| `recipes/dressings-and-dips/goma-dare.cook` | Japanese Home Cooking |
| `recipes/soups/congee.cook` | The Soup Pot |
| `recipes/soups/congee-instant-pot.cook` | The Soup Pot |
| `recipes/soups/egg-drop-soup.cook` | The Soup Pot |

**Every edit is additive, proven against the Step 0 vector.** All 21 counters were counted before
and after; exactly two moved:

```
The Soup Pot           21 -> 24    (+3)
Japanese Home Cooking  28 -> 38   (+10)
The Slow Cooker        20 -> 20
… the other eighteen unchanged.
```

`node scripts/check-recipes.mjs` on the thirteen: `all 13 file(s) draw a table.`

---

## 2. The shelves, as written

Verified by a probe over `src/generated/recipes.json` × `src/data/counters.json` — the five checks
no test in the repo makes (`structure.md` §6):

```
== The Soup Pot  members=24  listed=24        == Japanese Home Cooking  members=38  listed=38
      16  Old-fire soups (老火湯)                     6  The soup and the rice
       6  Quick daily soups (滾湯)                    6  Simmered things (煮物)
       0  What each thing is for                     6  Grilled and pan-fried mains
       2  Congee and rice soups                      7  Small sides (小鉢)
                                                     7  Made ahead (作り置き)
== The Slow Cooker  members=20  listed=20            6  Rice bowls and one-plate suppers
      18  Braises, left alone all day
       1  Beans and pulses                     kit:Slow Cooker=20  listed=20  members=20
       0  Stocks
       1  Whole birds and big cuts             OK — nothing to fix.
```

Zero unknown slugs, zero listed-but-not-shelved, zero duplicates, zero unplaced members, zero
sections titled `Also*`.

### Where each shelf's order came from

- **老火湯 and 滾湯**: `T-003-03/progress.md` ranks 1–16 and 1–5, in its order, unchanged.
- **煮物 · mains · 小鉢 · 作り置き · rice bowls**: `T-003-04/progress.md`'s mapping, in its order,
  with borrowings appended to the end of each section.
- **The Slow Cooker**: `docs/gaps/slow-cooker.md`'s candidate grouping, in its order, with
  `-slow-cooker` appended and every unwritten candidate dropped.

---

## 3. §2 — what the Ramen Shop keeps, and where I disagreed

`docs/gaps/japanese-home.md` made the call and it is **applied as written**. Ten recipes gain the
Japanese Home board and keep the one they had; fifteen stay at the Ramen Shop; two stay at the
Bakery.

**Added to Japanese Home Cooking (10)** — with the section each landed in, since the gap note put
eight of them in an `Also here` that no longer exists (§4 below):

| slug | section | the gap note's argument |
| --- | --- | --- |
| `dashi` | The soup and the rice | *"upstream of nearly everything on this shelf"*; named for this section by the note |
| `miso-soup` | The soup and the rice | same |
| `gyoza` | Grilled and pan-fried mains | *"folded at a kitchen table by the hundred and frozen"* |
| `karaage` | Grilled and pan-fried mains | *"a Saturday and a bentō staple in the same country"* |
| `okonomiyaki` | Rice bowls and one-plate suppers | *"a home griddle dish before it is a shop"* |
| `japanese-beef-curry` | Rice bowls and one-plate suppers | *"the most-cooked home dinner in Japan by most surveys"* |
| `chawanmushi` | Small sides (小鉢) | home dish, listed in the both-boards block |
| `teriyaki-sauce` | Made ahead (作り置き) | pantry |
| `goma-dare` | Made ahead (作り置き) | *"pantry, not menu"* |
| `shichimi-togarashi` | Made ahead (作り置き) | *"pantry, not menu"* |

**Left at the Ramen Shop (15).** `ramen-noodles` · `shio-ramen` · `shoyu-ramen` · `miso-ramen` ·
`tonkotsu-ramen` · `tonkotsu-broth` · `chintan-broth` · `shio-tare` · `shoyu-tare` · `miso-tare` ·
`mayu` · `ajitama` · `menma` · `chashu` · `miso-ginger-dressing`.

**Left at the Bakery (2).** `japanese-milk-bread` · `castella`.

### Where I disagreed

**One, and it is not acted on.** `ajitama` and `chashu` are the note's own "borderline" pair, and
it keeps them at the Ramen Shop because *"they belong to the bowl."* I think `ajitama` is the
weaker half of that: a marinated egg is a 作り置き in the plainest sense — it is made on Sunday, it
keeps a week, and it goes into a bentō as often as into a bowl. `chashu` I agree with; a rolled,
tied, braised pork belly is a component of a sold dish and its own page says so.

I did not move `ajitama`, because the ticket says *"`docs/gaps/japanese-home.md` made this call —
apply it"*, and one arguable egg is not a reason to overrule the document that read all 31 files
against one consistent test. It is recorded here so the decision is visible rather than lost, and
it is a one-line change if a reviewer disagrees with me rather than with the note.

**Two things I noticed and did not treat as disagreements.** `haemul-pajeon` and
`bulgogi-marinade` sit at the Ramen Shop and are Korean; the note already flags this as a
misplacement recorded in `docs/gaps/README.md` and *"not this shelf's to fix."* I left them.

---

## 4. Deviations from the plan

### 4a. `Also here` was deleted from all three counters, not left empty

`plan.md` and `design.md` D3 already chose deletion; recording the consequence, which is a real
editorial decision rather than a formatting one.

**The Soup Pot loses four candidate slugs entirely.** `docs/gaps/soup-pot.md` parked
`wonton-soup`, `hot-and-sour-soup`, `chicken-feet` and `chicken-broth` in `Also here`.
Acceptance criterion 1 forbids that section rendering, so they are **not shelved at all**. The gap
note argues against each of them in its own words — *"a noodle lunch in a Cantonese house, not a
home soup"*, *"northern by way of an American menu"*, *"listed here only because chicken feet are
the standard body of rank 5"*, *"**not** what these soups start from"* — so the outcome matches
what the note actually believes. It also saved four `.cook` edits.

**Japanese Home's eight went into real sections instead**, because the note does believe in those
(§3 above).

### 4b. One section's item order was changed

T-003-04 handed over *"gohan · takikomi-gohan · tonjiru · sumashi-jiru (+ the existing dashi and
miso-soup)"* for **The soup and the rice**. It prints as
`dashi · miso-soup · sumashi-jiru · tonjiru · gohan · takikomi-gohan` — the stock everything is
built on, then the two soups, then the two rices, which is what the section title says in the
order it says it. All six are present. **No other section's order was touched.**

### 4c. `aisles.json` was modified after all, for four products — but not for coverage

`design.md` D6 concluded that `aisles.json` needed no change, and the *coverage* half of that held
exactly: this ticket adds no recipe, so it adds no ingredient name, and the test reports the same
3/1082 before and after (`flat skewers`, `oak or hickory wood`, `metal skewers` — all Smokehouse
equipment, none of it food).

But the ticket's §3 also says *"a wrong aisle is not"* allowed, and a sweep of all 262 ingredient
names on the three new shelves found four products sitting in the wrong aisle for exactly the
reason the ticket names as its first hazard — **a bare word in one aisle beating a product that no
aisle claimed specifically**:

| name | was | is | the bare word that stole it |
| --- | --- | --- | --- |
| `century eggs` | `dairy` | `world` | `egg` / `eggs` — a 皮蛋 is not in the dairy case |
| `mustard greens` | `world` | `produce` | `mustard` — 芥菜 is a leaf, not a condiment |
| `honey dates` | `baking` | `dry-goods` | `honey` — 蜜棗 sit with `red dates`, which are already dry-goods |
| `potato starch` | `produce` | `baking` | `potato` — 片栗粉 sits with `cornstarch`, which is already baking |

Four patterns added, each **more specific** than the word that was stealing it, so none of them can
steal from anything else — the hazard runs the other way. Proven rather than assumed: `aisleFor()`
was run over all 1082 ingredient names before and after, and **exactly those four moved**.

```
4 name(s) moved:
   century eggs           dairy    -> world
   honey dates            baking   -> dry-goods
   mustard greens         world    -> produce
   potato starch          produce  -> baking
```

No pack size was added anywhere, and no new aisle was created.

---

## 5. What T-002-08 already did, and was not re-derived

`docs/active/work/T-002-08/review.md` §6 says *"T-003-06 should not re-derive them"* about the
~20 aisle patterns it placed for this story's vocabulary — konnyaku, hijiki, burdock, job's tears,
adenophora root, Solomon's seal, overlord flower, fox nut, laver, abura-age and the rest. It was
right and they were not re-derived. Every name T-003-03 and T-003-04 handed over was checked and
every one resolves:

```
produce      burdock root · lotus root · kabocha · snow pear(s) · hairy gourd · amaranth
fishmonger   yellowtail (fillets, collar) · crucian carp
spices       aged tangerine peel
world        abura-age · konnyaku · ito konnyaku · hijiki · dried hijiki · laver · job's tears
             (raw, toasted) · lily bulb · dried lily bulb · fox nut · apricot kernels ·
             Solomon's seal · adenophora root · overlord flower · dried overlord flower
```

---

## 6. Verification, as run

```
$ npm run verify
all 658 file(s) draw a table.
parsed 658 recipe(s) in 27 categories -> src/generated/recipes.json
  counters: 658 named, 0 inferred from category · timers in 635 · pairings 760
Test Files  8 passed (8)
     Tests  825 passed (825)
[build] 682 page(s) built
```

Read out of the built HTML, not out of the JSON:

| page | header count | `<li>` items | `<h2>` sequence | `Also` / `Also here` | items with no built page |
| --- | --- | --- | --- | --- | --- |
| `/menu/soup-pot/` | 24 | 24 | 老火湯 · 滾湯 · Congee and rice soups | **none** | none |
| `/menu/japanese-home/` | 38 | 38 | the six, in `counters.json` order | **none** | none |
| `/menu/slow-cooker/` | 20 | 20 | Braises · Beans and pulses · Whole birds and big cuts | **none** | none |

The two empty sections (`What each thing is for`, `Stocks`) are in the data and correctly do not
render — `menuFor` filters a zero-item section. The front page lists **21 counters** and all three
are on it.

---

## 7. State at hand-off

- Three commits: `db18740` (13 `.cook`), `af175c7` (`counters.json`), `4681d37` (`aisles.json`).
- Nothing of this ticket's staged, modified or untracked. The scratch probes
  (`src/lib/zz-aisle-probe.test.ts`, `.probe-names.json`) were written, run and removed; they were
  never committed and `git status --porcelain` shows no trace.
- `docs/gaps/soup-pot.md`, `japanese-home.md` and `slow-cooker.md` are **untouched** and still head
  their block `## What is already here`. `T-003-07` §3 owns rewriting all three.
