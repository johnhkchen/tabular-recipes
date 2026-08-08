# T-008-04 — Design

Five decisions, each one grounded in something Research measured. Then the file list and the
rejections.

---

## 1. The timer name — `~air fry{}`, with the label carrying the reading

**The problem** (research §6): `air fry` is in neither `UNATTENDED` nor `HANDS_ON` in
`src/lib/time.ts`, so `~air fry{20%min}` falls through to the step's words — and those words
contain **fry**, which is `HANDS_ON`. `src/` is closed to this ticket.

I probed the real parser rather than reasoning about it. `readTimers` narrows each timer to the
slice of the label **ending at that timer's own text** (`regionsOf`, `time.ts:154`), so only words
*before* the clock are read:

| label | timer | reading |
| --- | --- | --- |
| `air fry 200°C 18-24 min, one layer, skin matt` | `~air fry` | **hands-on** (label) |
| `air fry 200°C 20 min, one layer, roasted matt` | `~air fry` | **hands-on** — "roasted" sits after the clock |
| `one layer 200°C, 20 min, skin matt and pebbled` | `~air fry` | **hands-on** (default) |
| `roast in the basket 200°C, 20 min, one layer` | `~air fry` | **unattended** (label) |
| `air fry 200°C 20 min, one layer, skin matt` | `~roast` | **unattended** (name) |

Three options:

**(a) `~roast{}` as the timer name, "air fry" in the prose.** Correct today, `source: 'name'` —
the strongest reading the module has, and immune to rewording. Costs the vocabulary: when someone
adds `air fry` to `time.ts` there is nothing in the collection for it to match, and the gap page's
component stays unclaimed forever.

**(b) `~air fry{}`, and let it read hands-on.** Honest vocabulary, false page. Twenty files would
each print twenty minutes of standing at a machine you can walk away from — the exact claim S-008
exists to refuse. Rejected outright.

**(c) `~air fry{}`, with `roast` leading the label before the clock.** ← **chosen.**
`roast in the basket 200°C, 18–24 min, one layer` reads unattended today *and* carries the name the
shelf should own. "Roast in the basket" is not a dodge: the machine is a mini convection oven, and
ATK's own recipes are titled *Air-Fryer Roasted Salmon Fillets* and *Air-Fryer Roasted Broccoli*.
It is also plainer English than "air fry" for the cell.

**What (c) costs, stated plainly:** the reading depends on word order. Move `roast` after the clock
and twenty files silently flip to hands-on. **The permanent fix is one line — `'airfry'` into
`UNATTENDED` in `src/lib/time.ts` — and this ticket may not write it.** It goes in the work
artifact as the first note for T-008-05, with the file list it affects.

## 2. The drawer — the gap page decides, and it decides one dish

The gap page names exactly one dish where the outer drawer counts: rank 17, seekh kabab, *"the one
dish on the page where the drawer under the basket is part of the washing-up and should be
counted."* Everywhere else it counts the basket as one thing.

I follow it rather than invent a general rule. So:

- **The basket and its crisper plate are one entry: `the basket`.** They are lifted out and washed
  together.
- **Seekh kabab is three** — mince bowl, basket, drawer — and is **ranked out on bar 1**. It is the
  cleanest recorded rejection on the page, because the reason is a fact about the dish (mince on
  bars renders fat straight through) and not about the machine.

I disagree mildly — wings render fat too — and the ticket's instruction covers this: follow the
call, say so in the artifact. The disagreement is recorded in §5 of `review.md` and costs nothing
to settle later.

## 3. The soak, the press and the marinade — three bar-3 threats, three answers

The gap page flags each and refuses to pick. Picking is this ticket's job.

**Chips (`french-fries`, rank 4).** The plain file soaks 30 min. Soak + cook is 50–55 min and
**fails bar 3**. The two honest ways out are *start from soaked potato* or *drop the soak and say
what is lost*. **Chosen: drop it.** A shelf whose promise is *plug one in and eat* cannot open its
most-wanted recipe with "yesterday". The file argues the loss in its prose row — a rinsed, dried
baton browns and softens at once instead of drying to glass first — rather than omitting it. This
is the decision the gap page said must appear **in the file**, and it does.

**Tofu (`crisped-marinated-tofu`, rank 19).** The plain file presses 30 min under a weight. Press +
marinate + cook is well over 45. **Chosen: drop the press**, blot hard, and use extra-firm. The
basket's dry draught does what the press does — it takes water off the surface — which is not true
of a skillet, so this is a real difference between the two vessels rather than a corner cut. Bar 1:
one bowl to marinate and toss in, plus the basket. **Two.** The cornflour goes into the same bowl;
a second bowl for it makes three and the gap page says so.

**Tikka and shish tawook (ranks 15, 16).** Plain files marinate 6 hr and 6 hr 30. The gap page
treats falafel's overnight soak as *"outside the clock the same way a cure is"*, so precedent
exists for excluding it — but a shelf built on a 45-minute wall clock cannot lean on a precedent
that hides five hours. **Chosen: a 20-minute marinade, inside `>> time:`, with the trade named.**
Thin yoghurt on 2-inch pieces takes salt and spice in twenty minutes; six hours is better and the
file says so in one line. `>> time: 45 min` is then true rather than true-if-you-squint.

## 4. Where the four required facts go

Against a 70-char operation cell and a 120-char prose row (research §3):

| Fact | Where | Why there |
| --- | --- | --- |
| **the load** | the basket cell — `one layer, not touching` | voice.md: the cell is the verb and its numbers. The load *is* an instruction. |
| **the doneness cue** | the shake/turn cell that follows — `loose rattle, not a wet thud` | Gives the cue its own cell beside the clock instead of crushing both into one 70-char line. |
| **preheat** | the prose row above the table | "The one thing you must know before you start." |
| **basket size** | the same prose row | Same sentence, same reason: it is a fact about the number, not about the food. |

**The shared prose row**, ~114 chars, the *preheat convention* the gap page asked for, decided once:

> Written for a preheated 5.7 L basket. From cold add three minutes; a 3.5 L basket is two batches,
> not more minutes.

Files whose real caution is something else (frozen, wet batter, reheats) replace the second half
with their own and keep the first.

**Prose rows use a `>> step:` override, not bare text.** `cleanLabel` strips every comma
(`src/lib/label.ts:19`), so a bare sentence comes out as *"two batches not more minutes"*. Verified
by running the checker. The discarded body is kept to one short line, which is what
`charred-broccoli.cook` and `saba-shioyaki.cook` already do.

## 5. The shape of a file

Four operations, chained, one root. Probed and passing at **5 rows × 5 cols**:

```
prose row      preheat + basket size            (>> step: override, no ingredients)
op 1           toss / season / stir             bowl
op 2           roast in the basket T°, range    ~air fry{middle} + one layer
op 3           shake or turn at halfway         the doneness cue
op 4           finish, off the heat             back into the same bowl
```

Op 3 has a ref and no ingredients, which `isOpStep` counts as an operation — so it earns a column
without inventing an ingredient. That is what gives every file a cheap, honest place for the cue.

## 6. What gets written — 21 files

Ranks are the gap page's. **[ATK]** times are copied exactly; **[range]** times are written as a
range in the prose with the middle in the timer, and the reason for the range is named in the work
artifact.

**Straight out of the basket (6)**

| slug | rank | `dish:` / `kit:` | time | wash |
| --- | --- | --- | --- | --: |
| `air-fryer-chicken-wings` | 1 | standalone | [ATK] 200°C, 18–24 min | 2 |
| `air-fryer-chicken-thighs` | 8 | standalone | [range] 190°C, 22–25 min, finish 74°C | 2 |
| `air-fryer-halloumi` | 3 | `seared-halloumi` | [range] 200°C, 8–10 min | 1 |
| `air-fryer-tofu` | 19 | `crisped-marinated-tofu` | [range] 200°C, 15–18 min | 2 |
| `air-fryer-salmon` | 6 | `blackened-salmon` | [ATK] 200°C, 10–14 min, pull 52°C | 2 |
| `air-fryer-saba-shioyaki` | 9 | `saba-shioyaki` | [range] 200°C, 10–12 min | 2 |

**Vegetables that want a hard edge (8)**

| slug | rank | `dish:` / `kit:` | time | wash |
| --- | --- | --- | --- | --: |
| `air-fryer-brussels-sprouts` | 2 | `roasted-brussels-sprouts` | [ATK] 175°C, 20–25 min | 2 |
| `air-fryer-broccoli` | 11 | `charred-broccoli` | [ATK] 175°C, 8–12 min, water-and-oil toss | 2 |
| `air-fryer-cauliflower` | 5 | `roasted-cauliflower` | [range] 175°C, 12–18 min | 2 |
| `air-fryer-chickpeas` | 7 | `crispy-chickpeas` | [range] 200°C, 12–15 min | 2 |
| `air-fryer-sweet-potatoes` | 10 | `roasted-sweet-potatoes` | [range] 200°C, 15–18 min | 2 |
| `air-fryer-batata-harra` | 12 | `batata-harra` | [range] 200°C, 16–20 min | 2 |
| `air-fryer-padron-peppers` | 18 | standalone | [range] 200°C, 6–8 min | 1 |
| `air-fryer-corn-ribs` | 14 | standalone | [range] 200°C, 12–14 min | 2 |

**Chips and the two skewers (3)**

| slug | rank | `dish:` / `kit:` | time | wash |
| --- | --- | --- | --- | --: |
| `air-fryer-chips` | 4 | `french-fries` | [range] 200°C, 20–24 min, no soak | 2 |
| `air-fryer-chicken-tikka` | 15 | `chicken-tikka` | [range] 200°C, 12–15 min | 2 |
| `air-fryer-shish-tawook` | 16 | `shish-tawook` | [range] 200°C, 12–14 min | 2 |

**Frozen things, done properly (3)** — all standalone, per the gap page: *"a frozen dish is not a
variant of a recipe that starts by cutting a potato."* Each is a **dish built around the frozen
thing**, because `check-recipes.mjs:199` refuses a table that does not merge and a bag of chips on
its own is a timing note.

| slug | what makes it a table | time | wash |
| --- | --- | --- | --: |
| `air-fryer-frozen-chips` | a garlic-and-lemon mayo stirred in the bowl they are tipped into | [sourced spread] 200°C, 12–18 min | 2 |
| `air-fryer-frozen-spring-rolls` | a dipping sauce mixed in the bowl they are served from | [range] 190°C, 10–12 min | 2 |
| `air-fryer-frozen-prawns` | garlic-chile butter melted by the prawns themselves | [range] 200°C, 8–10 min | 2 |

**Reheats that beat the microwave (1)**

| slug | what makes it a table | time | wash |
| --- | --- | --- | --: |
| `air-fryer-reheated-pizza` | hot honey with chile stirred while the slices heat | [range] 180°C, 4–6 min | 2 |

One, not two. The gap page's position is that reheating *"will never be a table: no ingredients, no
merge, no tree"*, and the ticket asks for one or two. One dish that genuinely merges is the honest
answer to both; a second would be the same file with a different leftover in it.

**Twenty-one files. Fifteen is the floor and three frozen is the floor.**

## 7. What is ranked out, and on which bar

Recorded because the next person will reach for the same dish. Full counts in `review.md`.

| dish | rank | bar it fails | count |
| --- | --- | --- | --: |
| **Seekh kabab** | 17 | **bar 1** — mince bowl, basket, **drawer** (§2) | 3 |
| **Crispy roast potatoes** | 20 | **bars 1 and 2** — pot, colander, basket; two appliances. Dropping the parboil makes it `air-fryer-chips` wearing another file's name. | 3 |
| **Pork belly** | — | **bar 3** — skin needs an overnight dry-salt and 45–55 min in the basket | — |
| **Bacon** | 13 | not the gate — **the table rule**. One ingredient, two operations; `check-recipes.mjs` refuses it at `rowCount < 3`. | 1 |
| **Karaage, tonkatsu, korokke, arancini, mozzarella sticks, scotch egg** | — | **bar 1** — flour dish, egg dish, crumb dish, then the basket | 4 |
| **Falafel** | — | **bar 1 and bar 2** — the food processor is a second machine and a second thing | 3 |
| **Onion rings, tempura, corn dogs, battered fish** | — | **not a substitution** — wet batter lifts off in the draught before it sets | — |
| **Doughnuts, churros, a double-fried chip** | — | **not this machine's dish** — the method is submersion | — |

## 8. What I am not doing

- **No pot half.** Ranks 21–26 are T-008-03's tree and T-008-05's gate.
- **No existing file edited.** Every plain sibling stays exactly as it is; the `dish:` key is the
  only thing the two files share and it is declared on my side only.
- **No `src/`, no `docs/gaps/**`, no `counters.json`.** The `~air fry` line, the basket-load table
  and the icon question are all recorded for T-008-05 rather than reached for.
- **No number I could not source.** Nineteen of these are ranges written as ranges. The work
  artifact says which had sources that disagreed and by how much.
