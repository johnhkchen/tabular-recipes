# T-002-07 — Review

Twelve new `.cook` files. Six proteins for *What goes on top*, six for *Roasted vegetables*, all
shelved at The Bowl Shop. No pre-existing file edited. `npm run verify` green end to end.

## What changed

| File | Lines | Shape | What it teaches |
| --- | --: | --- | --- |
| `recipes/vegetables-and-sides/roasted-sweet-potatoes.cook` | 26 | 7 rows × 5 cols, 5 ops | the preheated pan, and a glaze added last |
| `recipes/vegetables-and-sides/charred-broccoli.cook` | 26 | 8 × 5, 5 ops | dryness and space; garlic on after, never during |
| `recipes/vegetables-and-sides/roasted-cauliflower.cook` | 20 | 7 × 5, 4 ops | cut through the core so every piece has a face |
| `recipes/vegetables-and-sides/roasted-brussels-sprouts.cook` | 23 | 7 × 5, 5 ops | the late balsamic; loose leaves kept |
| `recipes/vegetables-and-sides/roasted-beets.cook` | 26 | 8 × 6, 5 ops | steam under foil, skins off hot, dressed warm |
| `recipes/vegetables-and-sides/crispy-roast-potatoes.cook` | 23 | 7 × 5, 5 ops | alkaline parboil, the shake, fat already smoking |
| `recipes/smoked-and-grilled/pulled-roast-chicken.cook` | 20 | 6 × 5, 4 ops | overnight dry-brine; pulled warm into its own juices |
| `recipes/smoked-and-grilled/blackened-salmon.cook` | 24 | 10 × 5, 5 ops | blackened is toasted spice, not burnt fish; pull at 49 °C |
| `recipes/fried-and-crispy/crispy-chickpeas.cook` | 21 | 6 × 4, 4 ops | roast naked, spice after the oven, cool uncovered |
| `recipes/fried-and-crispy/crisped-marinated-tofu.cook` | 23 | 11 × 6, 5 ops | press, cornstarch, one face at a time, never stirred |
| `recipes/fried-and-crispy/seared-halloumi.cook` | 21 | 5 × 4, 4 ops | a dry pan, 90 seconds a face, and a deadline |
| `recipes/eggs/seven-minute-eggs.cook` | 21 | 5 × 5, 4 ops | 7:00 from fridge-cold, and why it is not `ajitama` |

**Modified: none. Deleted: none.** Nothing outside `recipes/**`.

Three commits, all through `lisa commit-ticket` with exact `--include` paths:

```
593699f  Put a roasting tray in the vegetable drawer            6 files, +144
a776e83  Write the protein column the bowl counter sells        6 files, +130
cd2dfd0  Open four operations with a verb the icon map reads    4 files, +4 −4
```

`git show --stat` on all three lists sixteen file entries and every one is among the twelve above.

## Acceptance criteria, one by one

| # | Criterion | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | ≥ 10 new files, each naming `counters: The Bowl Shop` | **met** — 12 | `grep -c` returns 1 on each; `grep -rl` over `recipes/` finds all twelve |
| 2 | ≥ 5 proteins and ≥ 4 roasted vegetables | **met** — 6 and 6 | the table above |
| 3 | ≥ 2 proteins not meat | **met** — 4 of 6 | chickpeas, tofu, halloumi, eggs |
| 4 | 3–6 operations of real technique | **met** — 4 to 5 ops each | staircases in `progress.md`; every step carries a sentence of *why* |
| 5 | Nothing duplicates an existing protein or side | **met** | see *The three close calls* below |
| 5b | Existing dishes listed by slug and section for T-002-08 | **met** | `design.md` §5: 30 slugs under *What goes on top*, 9 under *Roasted vegetables*, each with its current folder and a reason |
| 6 | `check-recipes.mjs --labels` ok for every file; the staircase reads as a cook's verbs | **met** — 12 of 12 `ok` | `progress.md` Steps 1 and 3, verbatim |
| 7 | Every timer named; six metadata keys on every file | **met** | 27 timers, all named, no `~{`; all twelve carry `title`, `category`, `tags`, `servings`, `counters`, `aka` |
| 8 | Only `recipes/**` modified; no pre-existing file edited | **met** | the three `git show --stat` above |

## The three close calls on criterion 5

Worth a reviewer's attention, because "duplicate" is a judgement and I made it three times.

1. **`seven-minute-eggs` against `ajitama`.** Both boil an egg. `ajitama` runs 6:30 and then spends
   eight hours in soy-mirin; this runs 7:00 and is eaten within the hour. The gap note ranks the
   plain egg 16th on exactly this ground — *"the bowl-shop version is the egg on its own."* The new
   file names `ajitama` in its prose and states the disagreement rather than hiding it.
2. **`pulled-roast-chicken` against five existing grilled chickens.** It is the opposite recipe: no
   marinade, no char, salt and time, and the pull is the point. The marinated grilled chicken thigh
   the ticket names first was **deliberately not written** — `shish-tawook` already is it — and is
   on the T-002-08 shelving list instead. That reasoning is `design.md` §2.
3. **`crispy-roast-potatoes` against `french-fries`, `home-fries`, `hash-browns`,
   `batata-harra`.** All four are pan or fryer. There is no roasted potato on the site, and this
   one carries the parboil-and-roughen technique the ticket names.

Grep evidence for the rest: cauliflower, broccoli, Brussels sprouts, beets, sweet potato, salmon,
tofu, halloumi and crisped chickpeas appear nowhere on the site as the dish itself
(`research.md` §4). Brussels sprouts and halloumi appear **nowhere at all**.

## Test coverage

**What is covered.** These twelve files are data, and the collection's invariants now run over
them the same as over the other 577: every file draws a table with no holes (`layout.test.ts`),
slugs are unique, `pairs-with` resolves and is made mutual, every timer resolves to minutes,
nothing claims four unbroken hands-on hours (`collection.test.ts`), and — the one that actually
bit — every operation label opens with a verb the icon map knows (`icons.test.ts`). 756 tests
green; `astro build` renders 610 pages.

**No new test was written, and none should be.** There is no new behaviour here to pin. Adding a
test that asserts these particular twelve slugs exist would pin the collection's contents to a
ticket, which is not what any test in this repository does.

**What nothing checks, and it is the important gap.** *No automated check can tell whether the
cooking is right.* `check-recipes.mjs` proves a file draws a table; it cannot tell 450 °F from
250 °F, seven minutes from six, or a baking-soda parboil from a plain one. Every number in these
twelve files — the temperatures, the times, the 120 °F pull on the salmon, the half-teaspoon of
baking soda — is my claim and nothing in CI disputes it. **A cook reading the twelve files is the
only real check on this ticket, and that is where review time is worth spending.**

## Open concerns

1. **The icon map is a second vocabulary and Design missed it.** `structure.md` §5 checked timer
   names against `src/lib/time.ts` and never looked at `src/lib/icons.ts`, where the *leading verb
   of every operation label* is also asserted collection-wide. Four labels had to be reworded after
   the fact (`progress.md` Step 3a). Nothing is wrong now, but the next person writing recipes will
   hit the same wall: **`README.md` documents the timer vocabulary and says nothing about the verb
   vocabulary.** Two sentences in the *Writing a recipe* section would fix that permanently. It is
   out of scope here (criterion 8) and is worth a small follow-up ticket.

2. **`pull` is not a verb the icon map reads, in a recipe called Pulled Roast Chicken.** The label
   now says `shred`, which is accurate and draws a knife. It is a slightly worse word for what the
   step is. The better repair is `pull: 'hand'` in `VERB_ICONS`, which this ticket may not make.

3. **These twelve are components, and the counter page is still half-built.** The two sections are
   filled but nothing else on The Bowl Shop's menu is: the shelf holds only what this ticket,
   T-002-05 and T-002-06 have written. The twenty-odd existing dishes listed in `design.md` §5 are
   **not shelved** — they carry no `counters:` line for this counter and will not appear until
   T-002-08 adds one. Until then the *What goes on top* section shows six items where it should
   show thirty-six.

4. **`docs/gaps/bowl-shop.md` is now out of date and was deliberately left alone.** It says the
   shelf holds 0 recipes and lists roasted sweet potatoes, charred broccoli, roasted cauliflower,
   Brussels sprouts, beets, crispy chickpeas, baked tofu and the plain seven-minute egg as missing.
   Eight of its twenty-two ranked absences are now written. Editing it would edit a pre-existing
   file, which criterion 8 forbids; the tally in `docs/gaps/README.md` is stale for the same
   reason. Both belong to T-002-08.

5. **Miso-glazed salmon and herb-roasted salmon are still missing.** The gap note names three
   salmon preparations at rank 5 and this ticket wrote one. `blackened-salmon` is now the only
   cooked-fish technique on a site of 589 recipes, which is better than none and is not enough.

6. **Four files carry a `slack` line and eight do not.** That is authored, not an oversight: a
   roasted vegetable that sits five minutes longer is a slightly darker roasted vegetable, and the
   README is explicit that a recipe which cannot name its real failure has not earned the field.
   The four that carry one — salmon, chickpeas, halloumi, eggs — each name a temperature or a
   window.

## For the human reviewer, in one paragraph

Read `roasted-beets.cook` and `crispy-roast-potatoes.cook` first: they are the two files where the
technique claim is strongest and most falsifiable (foil-and-water is steaming, not roasting;
baking soda in the parboil is what makes the shake work). Then `seven-minute-eggs.cook`, because
it is the one file that argues with an existing recipe by name. If the cooking in those three is
right, the other nine are the same kind of writing. Everything mechanical — tables, timers,
metadata, slugs, the build — is green and evidenced above.
