# T-008-04 — Review

The air fryer half of the shelf exists: **21 new `.cook` files**, every one declaring a
`washing-up` of two or fewer, cooked by one plug-in machine, on the table inside 45 minutes.
`npm run verify` exits 0 — 685 files check, 1005 tests pass, 710 pages build, and
`/menu/air-fryer-and-pot` builds for the first time.

Two things a reviewer should read before the diff: **§5**, where I followed a call from the gap
page I disagree with, and **§6.1**, a one-line change in `src/lib/time.ts` that this ticket could
not make and that twenty-one files quietly depend on.

---

## 1. What changed

**New: 21 files, all under `recipes/`. Nothing else in the repository is touched.** No existing
`.cook` file was edited, no file was deleted, `src/` and `docs/gaps/` and
`src/data/counters.json` are untouched.

| block | files |
| --- | --- |
| Straight out of the basket (6) | `air-fryer-chicken-wings`, `air-fryer-chicken-thighs`, `air-fryer-halloumi`, `air-fryer-tofu`, `air-fryer-salmon`, `air-fryer-saba-shioyaki` |
| Vegetables that want a hard edge (8) | `air-fryer-brussels-sprouts`, `air-fryer-broccoli`, `air-fryer-cauliflower`, `air-fryer-chickpeas`, `air-fryer-sweet-potatoes`, `air-fryer-batata-harra`, `air-fryer-padron-peppers`, `air-fryer-corn-ribs` |
| Chips and the two skewers (3) | `air-fryer-chips`, `air-fryer-chicken-tikka`, `air-fryer-shish-tawook` |
| **Frozen things, done properly (3)** | `air-fryer-frozen-chips`, `air-fryer-frozen-spring-rolls`, `air-fryer-frozen-prawns` |
| Reheats that beat the microwave (1) | `air-fryer-reheated-pizza` |

Five commits, all through `lisa commit-ticket` with exact `--include` paths. `git status
--porcelain` shows nothing ticket-owned staged, modified or untracked.

**Shape, measured off the build:** 4–11 ingredient rows (one exception, §7.3), 4–5 operations,
every washing-up count 1 or 2, every `>> time:` between 12 and 45 minutes.

## 2. `kit:` — the thirteen pairings, named, so they can be checked without the build

`scripts/parse-recipes.mjs:198` throws when two files share a `dish` and neither declares `kit:`.
The build passes, which is the proof; this is the table for reading it.

| new file | `>> dish:` | the plain file it now sits beside |
| --- | --- | --- |
| `air-fryer-halloumi` | `seared-halloumi` | `recipes/fried-and-crispy/seared-halloumi.cook` |
| `air-fryer-tofu` | `crisped-marinated-tofu` | `recipes/fried-and-crispy/crisped-marinated-tofu.cook` |
| `air-fryer-chickpeas` | `crispy-chickpeas` | `recipes/fried-and-crispy/crispy-chickpeas.cook` |
| `air-fryer-batata-harra` | `batata-harra` | `recipes/fried-and-crispy/batata-harra.cook` |
| `air-fryer-chips` | `french-fries` | `recipes/fried-and-crispy/french-fries.cook` |
| `air-fryer-salmon` | `blackened-salmon` | `recipes/smoked-and-grilled/blackened-salmon.cook` |
| `air-fryer-saba-shioyaki` | `saba-shioyaki` | `recipes/smoked-and-grilled/saba-shioyaki.cook` |
| `air-fryer-chicken-tikka` | `chicken-tikka` | `recipes/smoked-and-grilled/chicken-tikka.cook` |
| `air-fryer-shish-tawook` | `shish-tawook` | `recipes/smoked-and-grilled/shish-tawook.cook` |
| `air-fryer-brussels-sprouts` | `roasted-brussels-sprouts` | `recipes/vegetables-and-sides/roasted-brussels-sprouts.cook` |
| `air-fryer-broccoli` | `charred-broccoli` | `recipes/vegetables-and-sides/charred-broccoli.cook` |
| `air-fryer-cauliflower` | `roasted-cauliflower` | `recipes/vegetables-and-sides/roasted-cauliflower.cook` |
| `air-fryer-sweet-potatoes` | `roasted-sweet-potatoes` | `recipes/vegetables-and-sides/roasted-sweet-potatoes.cook` |

**The eight with no `dish:` and no `kit:`** — wings, thighs, padrón, corn ribs, the three frozen and
the reheat — each have a `dish` that defaults to their own slug and no other file claims it.
Verified against the built `src/generated/recipes.json`: every one has `variants: []`, and every
`kit: Air Fryer` file has exactly one sibling, the plain one.

## 3. Every time, and whose it is

**Sourced by a test kitchen (4 files).** Copied, not adjusted:

| file | number | source |
| --- | --- | --- |
| `air-fryer-chicken-wings` | 200°C/400°F, **18–24 min** on 2½ lb | ATK, *Air-Fryer Chili-Lime Chicken Wings* — range written wide on purpose to cover a cold or a preheated machine |
| `air-fryer-brussels-sprouts` | 175°C/350°F, **20–25 min**, 1 lb to 1 Tbsp oil | ATK, *Air-Fried Brussels Sprouts* — **reached by testing 200°C and rejecting it** |
| `air-fryer-broccoli` | 175°C/350°F, **8–12 min**, equal parts water and oil | ATK, *Air-Fryer Roasted Broccoli* + *When Air-Frying Vegetables, Water and Oil Do Mix* |
| `air-fryer-salmon` | 200°C/400°F, **10–14 min** on 1½-in fillets, pulled at **52°C/125°F** | ATK, *Air-Fryer Roasted Salmon Fillets* |

**Sourced, not a test kitchen (1 file).** `air-fryer-frozen-chips` — **12–18 min**, from the
measured wattage spread: the same bag at **18 min in a 1400 W machine, 12 in a 1700 W, 9 in a
2000 W**. The file prints the spread in a full-width row and says the snapping edge decides.

**Written as a range, with the reason, because nobody has tested them (16 files).** These are the
gap page's nineteen `[to establish]` ranks. Every one is a range in the operation cell with the
middle in the `~air fry` timer, which is what the ticket asks for and what the collection already
does. **None of them was copied out of the gap page as a single number, and none was produced by
the *drop 25°F, cut 20%* conversion rule** — the gap page records that rule so it can be refused,
and it is refused here.

The two ranges that carry an extra argument in the file itself:

- **`air-fryer-cauliflower`, 175°C for 12–18 min.** There is **no cauliflower number anywhere** —
  the gap page checked and so did I. The file says so in a full-width row: *"No test kitchen has
  published a cauliflower number. This is the broccoli method run longer, because a floret is
  denser."* The anchor is named so the next writer can improve on it rather than re-derive it.
- **`air-fryer-chips`, 200°C for 20–24 min.** No soak, so the plain file's number transfers
  nothing.

**Non-negotiable temperatures, which are not ranges and are marked as such in the cell:** 74°C
(165°F) for chicken thighs, tikka and tawook; 52°C (125°F) for salmon.

## 3.1 Where the sources disagreed, and by how much

Four disagreements. **None is resolved in a recipe file**; each is stated.

| dish | the disagreement | the spread | what the file does |
| --- | --- | --- | --- |
| **Wings** | The **load**, not the clock. ATK: *"arrange wings in even layer (wings will overlap)."* WellPlated and Everyday Family Cooking: a single layer with space between each wing. | Times agree within 380–400°F over 18–24 min | States one layer with room, and prints the disagreement in a full-width row |
| **Salmon** | The **finish temperature**. 125°F (ATK, medium-rare), 130–135°F (recipe sites), 145°F (food safety). | **20°F**, which is three different opinions about what cooked salmon is | Cooks to 52°C/125°F, names the number, and prints all three |
| **Vegetables generally** | Received wisdom is **200°C for 12–18 min**; ATK tested that on sprouts and **threw it out** for 175°C over 20–25. | **25°C and up to 13 min, in opposite directions at once** | Sprouts and broccoli use the tested numbers; the file says a test kitchen rejected the hotter one |
| **Frozen chips** | The **machine**. Two machines a person would buy from the same shelf are a factor of two apart. | **9 to 18 min** | Prints the wattage figures and gives the doneness cue as the answer |

## 4. Ranked out, with the count, because the next person will reach for the same dish

| dish | count | bar | the reason in one line |
| --- | --: | --- | --- |
| **Seekh kabab** (rank 17) | **3** | **bar 1** | Mince bowl, basket, **and the drawer** — the gap page names this as the one dish where rendered fat makes the drawer a separate thing. See §5. |
| **Crispy roast potatoes** (rank 20) | **3** | **bars 1 and 2** | Pot, colander, basket — and a hob before a machine. Dropping the parboil to fix it produces `air-fryer-chips` wearing another file's name, and loses the roughed starchy surface that is the whole point of the plain file. |
| **Pork belly** | — | **bar 3** | The skin wants an overnight dry-salt and then 45–55 min in the basket. Neither end fits a 45-minute wall clock. |
| **Karaage** | **4** | **bar 1** | Marinade bowl, egg bowl, starch dish, basket. The gap page's bag trick would fix it; a bag is not a vessel this collection has a convention for, and inventing one inside a recipe file is the wrong place. |
| **Falafel** | **3** | **bars 1 and 2** | Soaking bowl, food-processor bowl and blade, basket — and the processor is a second machine. |
| **Tonkatsu, korokke, arancini, mozzarella sticks, scotch egg** | **4** | **bar 1** | Flour dish, egg dish, crumb dish, basket. Demoted for washing-up, never for quality. |
| **Onion rings, tempura, corn dogs, battered fish** | — | **not a bar — a mechanism** | Wet batter lifts off in the draught before it sets, slides onto the element and bakes there. This is a different dish, not a substitution. |
| **Doughnuts, churros, a properly double-fried chip** | — | **not this machine's dish** | The method is submersion. A basket version resembles them; it is not them, and saying otherwise is the advertisement this shelf exists to avoid. |
| **Bacon** (rank 13) | **1** | **not the gate — the table rule** | It clears all three bars easily and still cannot be written: one ingredient and two operations gives `rowCount 1`, and `check-recipes.mjs:199` refuses anything under three rows. A timing note, not a table. |

**Bacon is the interesting one** and it is worth stating plainly: the gate is not what excluded it.
The collection's own definition of a table is. The gap page predicted exactly this about the frozen
block, and the answer there — build a dish *around* the thing rather than writing the thing alone —
is available for bacon too and was not taken, because a bacon-and-something dish is a different
commission from rank 13.

## 5. Where I disagree with the gap page, and followed it anyway

**The drawer.** The gap page counts the basket as one thing everywhere except seekh kabab, where
*"the fat renders out and drips, so this is the one dish on the page where the drawer under the
basket is part of the washing-up and should be counted."*

I do not think that line survives contact with the rest of the page: **wings render fat too**, and
so do chicken thighs and the prawns. Either the drawer is a second thing whenever fat lands in it —
in which case wings, thighs and saba fail bar 1 as well and this shelf is much smaller — or the
basket assembly washes as one and seekh kabab clears at two.

I followed the gap page rather than my own reading, for the reason the ticket gives about `kit:`
lines: the call is cheap to settle later and expensive to have two writers disagree about now. The
consequence is recorded: **one dish is ranked out on a distinction the other twenty are not held
to.** T-008-05 should settle it in one sentence, either way, and either way it changes exactly one
file's fate.

## 6. Things this ticket could not do, and one of them matters

### 6.1 `~air fry` is not a word `src/lib/time.ts` knows — and 21 files depend on that

**This is the item to act on.** `air fry` is in neither `UNATTENDED` nor `HANDS_ON`, so a
`~air fry{20%min}` timer falls through to the words of its step. A cell reading *"air fry 200°C,
20 min"* contains **fry**, which is `HANDS_ON`, and the page would print twenty minutes of standing
at a machine you can walk away from — on all twenty-one files.

The files are written so this does not happen: **every basket cell opens with `roast`**, which
`readWords` reads as unattended before the clock is reached, and I verified all 26 timers across
the 21 files read `unattended`. But the reading comes from the *label*, not the *name* — so
**reordering any basket cell so that `roast` falls after the clock silently flips that recipe to
hands-on.**

The permanent fix is one line: add `'airfry'` to `UNATTENDED` in `src/lib/time.ts`, exactly as
T-002-01 added the four pressure names before any pressure recipe existed. Then the reading comes
from `source: 'name'` and no cell wording can break it. **This ticket may not touch `src/`.**

### 6.2 `shake` has no icon

Ten cells originally opened with `shake`, the air fryer's own verb and the one the gap page asked
for a convention about. `src/lib/icons.ts` has no entry for it and
`src/lib/icons.test.ts:273` fails the build on any unrecognised opening verb — so the cells now
open with `toss the basket`, which is the same instruction and draws the right picture. **Adding
`shake: 'stir'` to `VERB_ICONS` is one line and would let the shelf use its own word.** The other
fourteen verbs the test caught were reworded on merit and want nothing.

### 6.3 Recorded for T-008-05

- **`docs/gaps/air-fryer-and-pot.md` still reads *0 recipes*.** It is now 21 for the basket half.
  Do not run `node scripts/menu-sections.mjs --write` against it until the item lists have slugs —
  the page says why.
- **The five section titles in `counters.json` are still empty.** Shelving these 21 is T-008-05's.
  The gap page's five titles map onto four of my five blocks; *Sheet-pan-shaped, in the basket* has
  nothing in it and *Start to finish in the pot* is the other half of the counter.
- **The preheat convention was decided here and belongs in `docs/knowledge/`.** Every file carries
  it in the same words: *written for a preheated 5.7 L basket; from cold add three minutes; a 3.5 L
  basket is two batches, not more minutes.* That is the "two lines, decided once" the gap page asked
  for, and it currently exists only as twenty-one copies of a sentence.
- **`src/lib/icons.ts:319` maps `air fry` to an oven icon.** Now that something uses it, the gap
  page's question — does a basket deserve its own icon? — is live.
- **No existing recipe needed a change.** The ticket asked for such notes; there are none.

## 7. Test coverage, and what it cannot reach

**No tests were written, and that is the right answer.** This ticket adds data, not code. The
collection's suite already walks every recipe:

| property | who checks it | result |
| --- | --- | --- |
| every file draws a table | `scripts/check-recipes.mjs` | 685 ok, no advisory notes on any of the 21 |
| no field over its cap | same, `CAPS_FAIL_BUILD = true` | 0 over |
| `washing-up` count equals its list length | `src/lib/washing-up.test.ts` collection tests | passes across all 177 declared files |
| no `dish` group has two plain files | `scripts/parse-recipes.mjs:198` | 685 parsed, no throw |
| every operation verb has an icon | `src/lib/icons.test.ts` | passes — this is what §6.2 was |
| every page renders | `astro build` | 710 pages |

**Three things no test can reach, and how each is covered instead:**

1. **Whether a time is real.** Covered by §3: four are a test kitchen's, one is a measured spread,
   sixteen are ranges written as ranges with the reason named in the file.
2. **Whether a `washing-up` line is honest.** It is authored and the count derives from the list;
   `src/lib/washing-up.ts` is the argument for why no check could do better. What I can say is that
   every entry is a vessel that holds food, and no file counts the plate you eat off.
3. **Whether the `~air fry` reading survives an edit.** It does not. §6.1.

## 8. Open concerns

1. **§6.1 is a latent defect, not a hypothetical.** Twenty-one files read correctly today because
   of a word order. It should be fixed with one line in `src/lib/time.ts` by whoever can touch it.
2. **§5, the drawer**, decides one file's existence on a distinction the shelf does not apply
   elsewhere.
3. **`slack` is declared on all 21 files.** The ticket asks that it appear *"only where the file can
   name a real failure"*, and I believe each does — a basket dish has a real failure mode
   (crowding, a tight O, a blistered pepper past its minute) far more often than a braise does. But
   21 of 21 is the number a field written to a length would also produce, and a reviewer should read
   two or three of the reasons rather than take that on trust.
4. **`air-fryer-padron-peppers` has 4 ingredient rows**, under the ticket's 5–16. Padding it would
   have been the wrong fix. `progress.md` deviation 3.
5. **The frozen block is three files and could be more.** It is the shelf's most useful claim and
   the ticket's floor is three. Each is a dish built around the frozen thing because the table rule
   demands it, which makes them more work to write than the section's reputation suggests.
